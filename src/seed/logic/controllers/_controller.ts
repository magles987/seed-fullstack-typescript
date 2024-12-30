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
import { ICriteria } from "../criterias/shared";
import { TFnBagForActionModule } from "../bag-module/shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
export type TKeyReadRequestController =
  | "exist"
  | "count"
  | "inform"
  | "readAll"
  | "readOne"
  | "readMany";
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
      status: ELogicResStatusCode.VALID_DATA, //personalizada para validación
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
  /**
   * @param keyActionRequest clave identificadora de la acción de petición a solicitar su correspondiente método
   * @returns el método correspondiente a la acción
   */
  public getActionRequestFn(keyActionRequest: unknown): Function {
    const that = this;
    let fn = that[keyActionRequest as any] as Function;
    if (typeof fn !== "function") {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${fn} is not action request function valid`,
      });
    }
    fn = fn.bind(that);
    return fn;
  }
  /**construye una instancia de criteria
   *
   * @param base parametros iniciales de inicalizacion
   *
   * @returns instancia de criteria
   */
  protected abstract buildCriteriaHandler(
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
    //mutar data de res a bag
    bag["data"] = res["data"];
    return;
  }
  /**propiedad especial que simula una acción genérica para el controller */
  public abstract actionCtrl: TFnBagForActionModule;
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
  /**... */
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
