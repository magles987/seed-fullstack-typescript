import { Module } from "../modules/index-barrel";
import {
  IPrimitiveReadCriteria,
  PrimitiveCriteriaHandler,
  TPrimitiveActionConfigFn,
  TPrimitiveBaseModifyCriteria,
  TPrimitiveBaseReadCriteria,
} from "../criterias/index-barrel";
import { ELogicCodeError, LogicError } from "../errors/index-barrel";
import { PrimitiveLogicHook } from "../hooks/index-barrel";
import {
  PrimitiveLogicMetadataHandler,
  Trf_PrimitiveLogicMetadataHandler,
} from "../meta/index-barrel";
import { PrimitiveLogicMutater } from "../mutaters/index-barrel";
import { PrimitiveLogicProvider } from "../providers/index-barrel";
import {
  ELogicResStatusCode,
  IPrimitiveResponse,
  PrimitiveReportHandler,
} from "../reports/index-barrel";
import {
  PrimitiveLogicValidation,
  RequestLogicValidation,
} from "../validators/index-barrel";
import { IDiccCtrlActionConfig, LogicController } from "./_controller";
import {
  TKeyPrimitiveCtrlModuleContext,
  TKeyPrimitiveModifyRequestCtrl,
  TKeyPrimitiveReadRequestCtrl,
  TPrimitiveCtrlBaseConfig,
} from "./shared-types";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** define todas las propiedades de configuración
 * de cada acción  para este modulo
 */
export interface IDiccPrimitiveCtrlActionConfig extends IDiccCtrlActionConfig {}
/**claves identificadoras del diccionario de acciones de configuración */
export type TKeysDiccPrimitiveCtrlActionConfig =
  keyof IDiccPrimitiveCtrlActionConfig;
/**tipado para refactorización de la clase*/
export type Trf_PrimitiveLogicController = PrimitiveLogicController<any>;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**... */
export class PrimitiveLogicController<
  TValue,
  TPrimitiveMutateInstance extends PrimitiveLogicMutater = PrimitiveLogicMutater,
  TPrimitiveValInstance extends PrimitiveLogicValidation = PrimitiveLogicValidation,
  TRequestValInstance extends RequestLogicValidation = RequestLogicValidation,
  TPrimitiveHookInstance extends PrimitiveLogicHook = PrimitiveLogicHook,
  TPrimitiveProviderInstance extends PrimitiveLogicProvider = PrimitiveLogicProvider,
  TKeyDiccActionRequest extends string =
    | TKeyPrimitiveReadRequestCtrl
    | TKeyPrimitiveModifyRequestCtrl
> extends LogicController<IDiccPrimitiveCtrlActionConfig> {
  public static override getDefault = () => {
    const superDf = LogicController.getDefault();
    return {
      ...superDf,
      diccActionConfig: {
        ...superDf.diccActionConfig,
      } as IDiccPrimitiveCtrlActionConfig,
      diccCriteriaRequestConfig:
        {} as TPrimitiveCtrlBaseConfig["diccCriteriaRequestConfig"],
    };
  };
  public override get metadataHandler(): PrimitiveLogicMetadataHandler<
    TValue,
    TPrimitiveMutateInstance,
    TPrimitiveValInstance,
    TRequestValInstance,
    TPrimitiveHookInstance,
    TPrimitiveProviderInstance,
    TKeyDiccActionRequest
  > {
    return super.metadataHandler as any;
  }
  public override set metadataHandler(
    metadataHandler: Trf_PrimitiveLogicMetadataHandler
  ) {
    super.metadataHandler = metadataHandler;
  }
  public override get keyModuleContext(): TKeyPrimitiveCtrlModuleContext {
    return "primitiveCtrl" as TKeyPrimitiveCtrlModuleContext;
  }
  private _diccCriteriaRequestConfig: TPrimitiveCtrlBaseConfig<
    TPrimitiveMutateInstance,
    TPrimitiveValInstance,
    TRequestValInstance,
    TPrimitiveHookInstance,
    TPrimitiveProviderInstance,
    TKeyDiccActionRequest
  >["diccCriteriaRequestConfig"];
  public get diccCriteriaRequestConfig(): TPrimitiveCtrlBaseConfig<
    TPrimitiveMutateInstance,
    TPrimitiveValInstance,
    TRequestValInstance,
    TPrimitiveHookInstance,
    TPrimitiveProviderInstance,
    TKeyDiccActionRequest
  >["diccCriteriaRequestConfig"] {
    return this._diccCriteriaRequestConfig;
  }
  protected set diccCriteriaRequestConfig(
    v: TPrimitiveCtrlBaseConfig<
      TPrimitiveMutateInstance,
      TPrimitiveValInstance,
      TRequestValInstance,
      TPrimitiveHookInstance,
      TPrimitiveProviderInstance,
      TKeyDiccActionRequest
    >["diccCriteriaRequestConfig"]
  ) {
    v = this.util.isObject(v)
      ? v
      : (this.getDefault().diccCriteriaRequestConfig as any);
    this._diccCriteriaRequestConfig = this.util.isObject(
      this._diccCriteriaRequestConfig
    )
      ? this._diccCriteriaRequestConfig
      : (this.getDefault().diccCriteriaRequestConfig as any);
    for (const keyAR in v) {
      if (Object.prototype.hasOwnProperty.call(v, keyAR)) {
        const baseCRC = this._diccCriteriaRequestConfig[keyAR];
        const newCRC = v[keyAR];
        this._diccCriteriaRequestConfig[keyAR] =
          PrimitiveCriteriaHandler.rebuildCustomConfigFromModuleContext(
            baseCRC as any,
            newCRC as any
          ) as any;
      }
    }
  }
  /** */
  constructor(
    baseConfig?: TPrimitiveCtrlBaseConfig<
      TPrimitiveMutateInstance,
      TPrimitiveValInstance,
      TRequestValInstance,
      TPrimitiveHookInstance,
      TPrimitiveProviderInstance,
      TKeyDiccActionRequest
    >
  ) {
    super("primitive");
    baseConfig = this.util.isObject(baseConfig) ? baseConfig : ({} as any);
    const { diccCriteriaRequestConfig } = baseConfig;
    this.diccCriteriaRequestConfig = diccCriteriaRequestConfig;
  }
  protected override getDefault() {
    return PrimitiveLogicController.getDefault();
  }
  /**... */
  protected static buildInstanceForMetadata<
    TPrimitiveHookInstance extends PrimitiveLogicController<any> = PrimitiveLogicController<any>
  >(preInstance: TPrimitiveHookInstance): TPrimitiveHookInstance {
    const util = Module.util;
    let inst: TPrimitiveHookInstance;
    if (util.isInstance(preInstance)) {
      inst = preInstance;
    } else {
      const { primitiveModuleFactory } =
        Module._globalConfig_.diccModuleFactory;
      inst = primitiveModuleFactory.makeModuleInstance(
        "primitiveCtrl",
        preInstance as any
      ) as any;
    }
    return inst;
  }
  /**obtiene una funcion de accion de acuerdo a su clave identificadora
   * preparada para ser inyectada en el middleware
   *
   * @param keyAction la clave identificadora de la funcion de accion solicitada
   *
   * @returns la funcion de accion
   */
  public override getActionFnByKey<
    TKeys extends keyof IDiccPrimitiveCtrlActionConfig = keyof IDiccPrimitiveCtrlActionConfig
  >(keyAction: TKeys): TPrimitiveActionConfigFn<any>;
  /**obtiene un array de funciones de accion de acuerdo a sus claves identificadoras
   * preparadas para ser inyectadas en el middleware
   *
   * @param keysAction el array de las claves identificadoras de las funciones de accion solicitadas
   *
   * @returns el array de funciones de accion
   */
  public override getActionFnByKey<
    TKeys extends keyof IDiccPrimitiveCtrlActionConfig = keyof IDiccPrimitiveCtrlActionConfig
  >(keysAction: TKeys[]): Array<TPrimitiveActionConfigFn<any>>;
  public override getActionFnByKey(keyOrKeysAction: unknown): unknown {
    return super.getActionFnByKey(keyOrKeysAction);
  }
  protected override getTupleActionConfigFromCriteriaHandler<
    TKey extends keyof IDiccPrimitiveCtrlActionConfig
  >(
    criteriaHandler: PrimitiveCriteriaHandler<TValue>,
    keyAction: TKey
  ): [TKey, IDiccPrimitiveCtrlActionConfig[TKey]] {
    const tKeyGlobalAC = [this.keyModuleContext, keyAction];
    const actionConfig =
      criteriaHandler.findGlobalActionByKeyModuleAndKeyAction(
        tKeyGlobalAC as any
      );
    return [keyAction, actionConfig];
  }
  protected override buildReportHandler(
    criteriaHandler: PrimitiveCriteriaHandler<TValue>,
    keyActionConfig: unknown
  ): PrimitiveReportHandler {
    const { data, firstData, type, modifyType, keyActionRequest } =
      criteriaHandler;
    let rH = new PrimitiveReportHandler(this.keySrc, {
      keyRepModule: this.keyModule as any,
      keyRepModuleContext: this.keyModuleContext,
      keyRepLogicContext: this.keyLogicContext,
      keyActionRequest: keyActionRequest,
      keyAction: keyActionConfig as any,
      keyTypeRequest: type,
      keyModifyTypeRequest: modifyType,
      keyLogic: this.keySrc,
      keyRepSrc: this.keySrc,
      status: this.globalStatus,
      tolerance: this.globalTolerance,
      firstCtrlData: firstData,
      data,
    });
    return rH;
  }
  public override preRunAction(
    criteriaHandler: PrimitiveCriteriaHandler<TValue>,
    keyActionConfig: unknown
  ): void {
    super.preRunAction(criteriaHandler, keyActionConfig as any) as any;
    return;
  }
  public override postRunAction(
    criteriaHandler: PrimitiveCriteriaHandler<TValue>,
    res: IPrimitiveResponse
  ): void {
    super.postRunAction(criteriaHandler, res) as any;
    return;
  }
  /**... */
  public getEmptyBasePrimitiveCriteria():
    | TPrimitiveBaseReadCriteria<
        TPrimitiveMutateInstance["diccActionConfig"],
        TPrimitiveValInstance["diccActionConfig"],
        TRequestValInstance["diccActionConfig"],
        TPrimitiveHookInstance["diccActionConfig"],
        TPrimitiveProviderInstance["diccActionConfig"],
        TKeyDiccActionRequest
      >
    | TPrimitiveBaseModifyCriteria<
        TPrimitiveMutateInstance["diccActionConfig"],
        TPrimitiveValInstance["diccActionConfig"],
        TRequestValInstance["diccActionConfig"],
        TPrimitiveHookInstance["diccActionConfig"],
        TPrimitiveProviderInstance["diccActionConfig"],
        TKeyDiccActionRequest
      > {
    return {}; //vació, solo se necesita el tipado, posiblemente se convierta a cursor
  }
  protected override async runCommonActionRequest(
    keyActionConfig: TKeysDiccPrimitiveCtrlActionConfig,
    criteriaHandler: PrimitiveCriteriaHandler<TValue>
  ): Promise<IPrimitiveResponse> {
    const { data, aTGlobalActionConfig } = criteriaHandler;
    const rH = this.buildReportHandler(criteriaHandler, keyActionConfig);
    let res = rH.mutateResponse(undefined, { data });
    //verificar si hay acciones para ejecutar
    if (aTGlobalActionConfig.length === 0) {
      res = rH.mutateResponse(res, {
        status: ELogicResStatusCode.WARNING,
        msn: `${aTGlobalActionConfig} is array of global action config empty`,
      });
      return res;
    }
    for (const tGAC of aTGlobalActionConfig) {
      const [keyModuleContext, keyActionConfig] = tGAC;
      const keyModule =
        this.metadataHandler.getKeyModuleFromKeyModuleContext(keyModuleContext);
      const mIC = this.metadataHandler.getInstanceModuleByModuleContext(
        keyModule as any,
        keyModuleContext as any
      );
      if (this.isAllowRunAction(tGAC)) {
        let actionFn: TPrimitiveActionConfigFn<TValue>;
        actionFn = mIC.getActionFnByKey(keyActionConfig as any);
        if (!this.util.isFunction(actionFn)) {
          throw new LogicError({
            code: ELogicCodeError.MODULE_ERROR,
            msn: `${actionFn} is not action function valid`,
          });
        }
        mIC.preRunAction(criteriaHandler, keyActionConfig as any) as any;
        const resForAction = await actionFn(criteriaHandler);
        mIC.postRunAction(criteriaHandler, resForAction);
        res.responses.push(resForAction);
        if (resForAction.status > this.globalTolerance) break;
      }
    }
    res = rH.mutateResponse(res);
    return res;
  }
  //████ Actions ███████████████████████████████████████████████████
  /**... */
  public async readRequest(
    baseCriteria: Omit<
      TPrimitiveBaseReadCriteria<
        TPrimitiveMutateInstance["diccActionConfig"],
        TPrimitiveValInstance["diccActionConfig"],
        TRequestValInstance["diccActionConfig"],
        TPrimitiveHookInstance["diccActionConfig"],
        TPrimitiveProviderInstance["diccActionConfig"],
        TKeyDiccActionRequest
      >,
      "aTGlobalActionConfig"
    > &
      Pick<
        IPrimitiveReadCriteria<
          TPrimitiveMutateInstance["diccActionConfig"],
          TPrimitiveValInstance["diccActionConfig"],
          TRequestValInstance["diccActionConfig"],
          TPrimitiveHookInstance["diccActionConfig"],
          TPrimitiveProviderInstance["diccActionConfig"],
          TKeyDiccActionRequest
        >,
        "keyActionRequest"
      >
  ): Promise<IPrimitiveResponse> {
    const mH = this.metadataHandler;
    let cH = new PrimitiveCriteriaHandler(mH, {
      ...(baseCriteria as any),
      data: this.util.dfValue, //❗Obligatorio❗
    });
    const res = await this.runCommonActionRequest("readRequest", cH);
    return res;
  }
  /**... */
  public async modifyRequest(
    baseCriteria: Pick<
      TPrimitiveBaseModifyCriteria<
        TPrimitiveMutateInstance["diccActionConfig"],
        TPrimitiveValInstance["diccActionConfig"],
        TRequestValInstance["diccActionConfig"],
        TPrimitiveHookInstance["diccActionConfig"],
        TPrimitiveProviderInstance["diccActionConfig"],
        TKeyDiccActionRequest
      >,
      "aTGlobalActionConfig"
    > &
      Pick<
        IPrimitiveReadCriteria<
          TPrimitiveMutateInstance["diccActionConfig"],
          TPrimitiveValInstance["diccActionConfig"],
          TRequestValInstance["diccActionConfig"],
          TPrimitiveHookInstance["diccActionConfig"],
          TPrimitiveProviderInstance["diccActionConfig"],
          TKeyDiccActionRequest
        >,
        "keyActionRequest" | "data"
      >
  ): Promise<IPrimitiveResponse> {
    const mH = this.metadataHandler;
    let cH = new PrimitiveCriteriaHandler(mH, {
      ...(baseCriteria as any),
    });
    const res = await this.runCommonActionRequest("modifyRequest", cH);
    return res;
  }
}
