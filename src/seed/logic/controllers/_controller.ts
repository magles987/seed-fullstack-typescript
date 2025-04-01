import { TKeyLogicContext } from "../config/shared-modules";
import { ELogicResStatusCode, IResponse } from "../reports/shared";
import { ActionModule, LogicModuleWithReport } from "../config/module";
import { BagModule } from "../bag/_bag";
import { IBuilderBaseCtrl } from "./builder-ctrl-shared";
import { ELogicCodeError, LogicError } from "../errors/logic-error";
import { TFnBagForActionModule } from "../bag/shared";
import { LogicMetadataHandler } from "../meta/_metadata-handler";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**refactorización de la clase*/
export type Trf_LogicController = LogicController;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**
 * base controller
 */
export abstract class LogicController extends LogicModuleWithReport {
  public static getDefault = () => {
    const superDf = LogicModuleWithReport.getDefault();
    return {
      ...superDf,
      status: ELogicResStatusCode.VALID_DATA, //personalizada para validación
      globalTolerance: ELogicResStatusCode.INVALID_DATA, //tolerancia a partir de invalida para validaciones
    };
  };
  /**clave identificadora del contexto */
  public abstract get keyModuleContext(): unknown;
  /**
   * @param keyLogicContext configuracion de
   * inicialización
   * @param baseConfigMetadata configuracion base de metadatos
   * (es un objeto literal no el manejador)
   */
  constructor(
    keyLogicContext: TKeyLogicContext,
    baseConfigMetadata: IBuilderBaseCtrl<any, any>
  ) {
    super("controller", keyLogicContext);
    if (!this.util.isObject(baseConfigMetadata, false)) {
      throw new LogicError({
        code: ELogicCodeError.NOT_VALID,
        msn: `${baseConfigMetadata} is not metadata base object valid`,
      });
    }
    this.keySrc = baseConfigMetadata.keySrc;
  }
  protected override getDefault() {
    return LogicController.getDefault();
  }
  /**... */
  public getDiccModuleInstance() {
    const mH = this.metadataHandler;
    const diccMI = (mH as LogicMetadataHandler).diccModuleInstanceContext;
    return diccMI;
  }
  /**micro hook embebido que se ejecuta antes de ejecutar la accion
   *
   * @param bag
   * @param keyAction
   * @returns el objeto bag (posiblemente mutado)
   */
  protected preRunAction(bag: unknown, keyAction: unknown): void {
    return;
  }
  /**micro hook embebido que se ejecuta despues de ejecutar la accion
   *
   * @param bag
   * @param res
   * @returns el objeto res (posiblemente mutado), el bag puede tambien mutarse
   */
  protected postRunAction(bag: unknown, res: unknown): void {
    //mutar data de res a bag
    bag["data"] = res["data"];
    return;
  }
  /**propiedad especial que simula una acción genérica para el controller */
  protected abstract actionCtrl: TFnBagForActionModule;
  /**
   * @param actionModuleInstContext
   * @param bag
   * @param keyAction
   * @returns
   */
  public static async runActionRequest(
    actionModuleInstContext: ActionModule<any>,
    bag: BagModule,
    keyAction: any
  ): Promise<IResponse> {
    let res: IResponse = undefined;
    const { keyModule } = actionModuleInstContext;
    let actionFn: TFnBagForActionModule;
    if (
      keyModule === "mutater" ||
      keyModule === "validator" ||
      keyModule === "hook" ||
      keyModule === "provider"
    )
      actionFn = actionModuleInstContext.getActionFnByKey(keyAction);
    else if (keyModule === "controller")
      actionFn = (
        actionModuleInstContext as any as LogicController
      ).actionCtrl.bind(actionModuleInstContext);
    else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${keyModule} is not key module valid`,
      });
    }
    if (typeof actionFn !== "function") {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${actionFn} is not action function valid`,
      });
    }
    actionModuleInstContext.preRunAction(bag, keyAction) as any;
    res = await actionFn(bag);
    actionModuleInstContext.postRunAction(bag, res);
    return res;
  }
  /**verifica si la acción es permitida ejecutarla, se gun las condiciones necesarias
   *
   *  - Debe existir la tupla de `[keyModuleContext, keyAction]` bien configurada.
   *  - El diccionario de configuraciones debe estar bien configurado
   *  - La configuración asignada a esa acción no puede ser `undefined` o `null`
   *
   * @param tKeyGlobalAC tupla formada conformada por:
   *  - `[0]` clave identificadora del modulo en contexto (`keyModuleContext`).
   *  - `[1]` clave identificadora de la acción (`keyAction`)
   * @param diccGlobalAC diccionario con las configuraciones de acciones globales (**ya deben esta fusionadas**)
   *
   * @returns si es o no permitido la ejecución de la acción
   */
  protected isAllowRunAction(
    tKeyGlobalAC: [string, string],
    diccGlobalAC: object
  ): boolean {
    let r = false;
    if (
      !this.util.isTuple(tKeyGlobalAC, 2) ||
      !this.util.isObject(diccGlobalAC)
    )
      return r;
    const [keyModuleContext, keyAction] = tKeyGlobalAC;
    const diccAC = diccGlobalAC[keyModuleContext as any];
    if (!this.util.isObject(diccAC)) return r;
    const actionConfig = diccAC[keyAction];
    r = this.util.isNotUndefinedAndNotNull(actionConfig);
    return r;
  }
  /**... */
  protected async runActionRequest(
    actionModuleInstContext: ActionModule<any>,
    bag: BagModule,
    keyAction: any
  ): Promise<IResponse> {
    const res = (await LogicController.runActionRequest(
      actionModuleInstContext,
      bag,
      keyAction
    )) as IResponse;
    return res;
  }
  /**
   * @returns el estado de respuesta reducido
   * segun criterio de este modulo
   */
  public static getControlReduceStatusResponse(
    cStt: ELogicResStatusCode,
    nStt: ELogicResStatusCode
  ): ELogicResStatusCode {
    let stateStatus: ELogicResStatusCode;
    if (
      cStt === ELogicResStatusCode.ERROR ||
      nStt >= ELogicResStatusCode.ERROR
    ) {
      stateStatus = ELogicResStatusCode.ERROR;
    } else if (
      cStt === ELogicResStatusCode.INVALID_DATA ||
      nStt >= ELogicResStatusCode.BAD
    ) {
      stateStatus = ELogicResStatusCode.INVALID_DATA;
    } else if (
      cStt === ELogicResStatusCode.WARNING_DATA ||
      nStt >= ELogicResStatusCode.WARNING
    ) {
      stateStatus = ELogicResStatusCode.WARNING_DATA;
    } else {
      stateStatus = ELogicResStatusCode.VALID_DATA;
    }
    return stateStatus;
  }
}
