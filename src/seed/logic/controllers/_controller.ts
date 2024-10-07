import { TKeyLogicContext, TKeyRequestType } from "../config/shared-modules";
import { Util_Ctrl } from "./_util-ctrl";
import {
  ELogicResStatusCode,
  IResponse,
  TResponseForMutate,
} from "../reports/shared";
import { ActionModule, LogicModuleWithReport } from "../config/module";
import { BagModule } from "../bag-module/_bag";
import { IBuilderBaseMetadata } from "../meta/metadata-builder-shared";
import { ELogicCodeError, LogicError } from "../errors/logic-error";
import { ReportHandler } from "../reports/_reportHandler";
import { CriteriaHandler } from "../criterias/_criteria-handler";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
export type TKeyReadRequestController = "readAll" | "readOne" | "readMany";
export type TKeyModifyRequestController = "create" | "update" | "delete";
/**refactorizacion de la clase*/
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
      status: ELogicResStatusCode.VALID_DATA, //personalizada para validacion
      globalTolerance: ELogicResStatusCode.INVALID_DATA, //tolerancia a partir de invalida para validaciones
    };
  };
  /**clave identificadora del contexto */
  public abstract get keyModuleContext(): unknown;
  /**utilidades del manejador de controller*/
  protected override readonly util = Util_Ctrl.getInstance();
  /**
   * @param keyLogicContext configuracion de
   * inicialización
   * @param baseMetadata configuracion base de metadatos
   * (es un objeto literal no el manejador)
   */
  constructor(
    keyLogicContext: TKeyLogicContext,
    baseMetadata: IBuilderBaseMetadata<any, any>
  ) {
    super("controller", keyLogicContext, baseMetadata?.keySrc);
    this.util = Util_Ctrl.getInstance();
    if (!this.util.isObject(baseMetadata, false)) {
      throw new LogicError({
        code: ELogicCodeError.NOT_VALID,
        msn: `${baseMetadata} is not metadata base object valid`,
      });
    }
  }
  protected override getDefault() {
    return LogicController.getDefault();
  }
  /**obtiene la accion de configuracion desde el bag controller
   *
   * @param bagCtrl el objeto bag que contiene la configuracion de accion.
   * @param keyModuleContext la clave identificadora del contexto del modulo
   * @param keyAction la clave identificadora de la acion
   */
  protected abstract getActionConfigFromBagCtrl(
    bagCtrl: unknown,
    keyModuleContext: unknown,
    keyAction: unknown
  ): any;
  /**@returns configuracion predefinida de opciones
   * de construccion de acciones de configuracion */
  protected abstract getDefaultBuilderACOption(): unknown;
  /**... */
  protected buildTupleACFromBagCtrl(
    bagCtrl: unknown,
    actionModule: ActionModule<any>, //??
    keyModuleContext: unknown,
    keyAction: unknown,
    BuilderACOption: unknown
  ): unknown {
    const actionConfig = this.getActionConfigFromBagCtrl(
      bagCtrl,
      keyModuleContext,
      keyAction
    );
    let tupleGAC = BagModule.buildTupleGlobalActionConfig({
      actionModule,
      keyAction,
      actionConfig,
      builderACOption: BuilderACOption,
    });
    return tupleGAC;
  }
  /**verifica que la accion a ejecutar esta
   * configurada como permitida
   *
   * ❕Tener en cuenta:❕
   * Dentro de la tupla global con estructura:
   *
   * `[keyGlobalAC, [keyAction, actionConfig]]`
   *
   * la `actionConfig` es `null` esta accion
   * 🚫No se permite su ejecucion🚫,
   *  en caso de `undefined` si se permite la
   * ejecucion porque se asume que se quiere
   * ejecutar con los parametros predefindos.
   *
   */
  protected isAllowRunAction(tupleGlobalAC: [string, [any, any]]): boolean {
    let r = false;
    if (
      !this.util.isTuple(tupleGlobalAC, 2) ||
      !this.util.isTuple(tupleGlobalAC[1], 2)
    ) {
      return r;
    }
    const actionConfig = tupleGlobalAC[1][1];
    r = !(actionConfig === null);
    return r;
  }
  /**construye una instancia de criterai
   *
   * @param base parametros iniciales de inicalizacion
   *
   * @returns instancia de criteria
   */
  public abstract buildCriteriaHandler(
    requestType: TKeyRequestType,
    base?: unknown
  ): CriteriaHandler;
  /**micro hook embebido que se ejecuta antes de ejecutar la accion
   *
   * @param bag
   * @param keyAction
   * @returns el objeto bag (posiblemente mutado)
   */
  public preRunAction(bag: unknown, keyAction: unknown): void {
    return;
  }
  /**micro hook embebido que se ejecuta despues de ejecutar la accion
   *
   * @param bag
   * @param res
   * @returns el objeto res (posiblemente mutado), el bag puede tambien mutarse
   */
  public postRunAction(bag: unknown, res: unknown): void {
    return;
  }
  /**... */
  protected async runRequestForAction(
    actionModuleInstContext: ActionModule<any>,
    bag: BagModule,
    keyAction: any
  ): Promise<IResponse> {
    const res = (await LogicController.runRequestForAction(
      actionModuleInstContext,
      bag,
      keyAction
    )) as IResponse;
    return res;
  }
  /**... */
  public static async runRequestForAction(
    actionModuleInstContext: ActionModule<any>,
    bag: BagModule,
    keyAction: any
  ): Promise<IResponse> {
    const actionFn = actionModuleInstContext.getActionFnByKey(keyAction);
    let res: IResponse = undefined;
    if (typeof actionFn !== "function") {
      const rH = actionModuleInstContext.buildReportHandler(
        bag,
        keyAction
      ) as ReportHandler;
      res = rH.mutateResponse(res, {
        keyAction,
        status: ELogicResStatusCode.ERROR,
        msn: `${keyAction} is not action function valid`,
      }) as IResponse;
    }
    actionModuleInstContext.preRunAction(bag, keyAction) as any;
    res = await actionFn(bag);
    actionModuleInstContext.postRunAction(bag, res);
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
