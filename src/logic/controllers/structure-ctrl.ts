import {
  IStructureEmbModelCriteria,
  IStructureFieldCriteria,
  IStructureModelCriteria,
  IStructureModelModifyCriteria,
  IStructureModelReadCriteria,
  TStructureActionConfigFn,
  TStructureEmbModelBaseCriteria,
  TStructureFieldBaseCriteria,
  TStructureModelBaseModifyCriteria,
  TStructureModelBaseReadCriteria,
} from "../criterias/shared-types";
import { StructureCriteriaHandler } from "../criterias/structure-criteria-handler";
import { ELogicCodeError, LogicError } from "../errors/logic-error";
import { StructureLogicHook } from "../hooks/structure-hook";
import {
  StructureLogicMetadataHandler,
  Trf_StructureLogicMetadataHandler,
} from "../meta/structure-metadata-handler";
import { Module } from "../modules/module";
import { TKeyStructureContextFull } from "../modules/shared-types";
import { FieldLogicMutater } from "../mutaters/field-mutater";
import { ModelLogicMutater } from "../mutaters/model-mutater";
import { StructureLogicProvider } from "../providers/structure-provider";
import {
  ELogicResStatusCode,
  IStructureResponse,
} from "../reports/shared-types";
import { StructureReportHandler } from "../reports/structure-report-handler";
import { Util_Module } from "../util/util-module";
import { FieldLogicValidation } from "../validators/field-validation";
import { ModelLogicValidation } from "../validators/model-validation";
import { RequestLogicValidation } from "../validators/request-validation";
import { IDiccCtrlActionConfig, LogicController } from "./_controller";
import {
  TFieldCtrlBaseConfig,
  TKeyStructureCtrlModuleContext,
  TKeyStructureModifyRequestCtrl,
  TKeyStructureReadRequestCtrl,
  TModelCtrlBaseConfig,
  TStructureCtrlBaseConfig,
} from "./shared-types";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** define todas las propiedades de configuración
 * de cada acción  para este modulo
 */
export interface IDiccStructureCtrlActionConfig<
  TModel,
  TIDiccFieldMutateAC extends FieldLogicMutater["diccActionConfig"] = FieldLogicMutater["diccActionConfig"],
  TIDiccFieldValAC extends FieldLogicValidation["diccActionConfig"] = FieldLogicValidation["diccActionConfig"],
  TIDiccStructureHookAC extends StructureLogicHook["diccActionConfig"] = StructureLogicHook["diccActionConfig"]
  ////❗el dicc controller embebido no se puede tipar por profundidad❗
> extends IDiccCtrlActionConfig {
  /** */
  checkField: boolean;
  /** */
  checkEmbModel: boolean;
  /** */
  checkAllFields:
    | Record<
        keyof TModel,
        Pick<
          TStructureFieldBaseCriteria<
            TModel,
            TIDiccFieldMutateAC,
            TIDiccFieldValAC,
            TIDiccStructureHookAC
          >,
          "diccGlobalAC"
        >
      >
    | boolean;
}
/**claves identificadoras del diccionario de acciones de configuración */
export type TKeysDiccStructureCtrlActionConfig =
  keyof IDiccStructureCtrlActionConfig<any>;
/**tipado para refactorización de la clase*/
export type Trf_StructureController = StructureLogicController<any>;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**
 * controller basico para un contexto estructural
 * ____
 */
export class StructureLogicController<
  TModel,
  TFieldMutateInstance extends FieldLogicMutater = FieldLogicMutater,
  TModelMutateInstance extends ModelLogicMutater = ModelLogicMutater,
  TFieldValInstance extends FieldLogicValidation = FieldLogicValidation,
  TModelValInstance extends ModelLogicValidation = ModelLogicValidation,
  TRequestValInstance extends RequestLogicValidation = RequestLogicValidation,
  TStructureHookInstance extends StructureLogicHook = StructureLogicHook,
  TStructureProviderInstance extends StructureLogicProvider = StructureLogicProvider,
  TKeyDiccActionRequest extends string =
    | TKeyStructureReadRequestCtrl
    | TKeyStructureModifyRequestCtrl
> extends LogicController<
  IDiccStructureCtrlActionConfig<
    TModel,
    TFieldMutateInstance["diccActionConfig"],
    TFieldValInstance["diccActionConfig"],
    TStructureHookInstance["diccActionConfig"]
  >
> {
  public static override getDefault = () => {
    const superDf = LogicController.getDefault();
    return {
      ...superDf,
      diccActionConfig: {
        ...superDf.diccActionConfig,
        checkField: true,
        checkEmbModel: true,
        checkAllFields: { modelForDiccAC: {} },
      } as IDiccStructureCtrlActionConfig<any>,
      criteriaEmbModelRequestConfig:
        {} as TModelCtrlBaseConfig<any>["criteriaEmbModelRequestConfig"],
      criteriaFieldRequestConfig: {} as Record<
        any,
        TFieldCtrlBaseConfig["criteriaFieldRequestConfig"]
      >,
      diccCriteriaFieldRequestConfig:
        {} as TFieldCtrlBaseConfig["criteriaFieldRequestConfig"],
      diccCriteriaRequestConfig:
        {} as TModelCtrlBaseConfig<any>["diccCriteriaRequestConfig"],
    };
  };
  public override get metadataHandler(): StructureLogicMetadataHandler<
    TModel,
    TFieldMutateInstance,
    TModelMutateInstance,
    TFieldValInstance,
    TModelValInstance,
    TRequestValInstance,
    TStructureHookInstance,
    TStructureProviderInstance,
    TKeyDiccActionRequest
  > {
    return super.metadataHandler as any;
  }
  public override set metadataHandler(
    metadataHandler: Trf_StructureLogicMetadataHandler
  ) {
    super.metadataHandler = metadataHandler;
  }
  public override get keyModuleContext(): TKeyStructureCtrlModuleContext {
    return "structureCtrl";
  }
  private _diccCriteriaRequestConfig: TModelCtrlBaseConfig<
    TModel,
    TModelMutateInstance,
    TModelValInstance,
    TRequestValInstance,
    TStructureHookInstance,
    TStructureProviderInstance,
    TKeyDiccActionRequest
  >["diccCriteriaRequestConfig"];
  public get diccCriteriaRequestConfig(): TModelCtrlBaseConfig<
    TModel,
    TModelMutateInstance,
    TModelValInstance,
    TRequestValInstance,
    TStructureHookInstance,
    TStructureProviderInstance,
    TKeyDiccActionRequest
  >["diccCriteriaRequestConfig"] {
    return this._diccCriteriaRequestConfig;
  }
  protected set diccCriteriaRequestConfig(
    v: TModelCtrlBaseConfig<
      TModel,
      TModelMutateInstance,
      TModelValInstance,
      TRequestValInstance,
      TStructureHookInstance,
      TStructureProviderInstance,
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
          StructureCriteriaHandler.rebuildCustomConfigFromModuleContext(
            "structureModel",
            baseCRC as any,
            newCRC as any
          ) as any;
      }
    }
  }
  /**... */
  private _criteriaEmbModelRequestConfig: TModelCtrlBaseConfig<
    TModel,
    TModelMutateInstance,
    TModelValInstance,
    TRequestValInstance,
    TStructureHookInstance,
    TStructureProviderInstance,
    TKeyDiccActionRequest
  >["criteriaEmbModelRequestConfig"];
  public get criteriaEmbModelRequestConfig(): TModelCtrlBaseConfig<
    TModel,
    TModelMutateInstance,
    TModelValInstance,
    TRequestValInstance,
    TStructureHookInstance,
    TStructureProviderInstance,
    TKeyDiccActionRequest
  >["criteriaEmbModelRequestConfig"] {
    return this._criteriaEmbModelRequestConfig;
  }
  protected set criteriaEmbModelRequestConfig(
    v: TModelCtrlBaseConfig<
      TModel,
      TModelMutateInstance,
      TModelValInstance,
      TRequestValInstance,
      TStructureHookInstance,
      TStructureProviderInstance,
      TKeyDiccActionRequest
    >["criteriaEmbModelRequestConfig"]
  ) {
    const newCRC = this.util.isObject(v)
      ? v
      : (this.getDefault().criteriaEmbModelRequestConfig as any);
    const baseCRC = this.util.isObject(this._criteriaEmbModelRequestConfig)
      ? this._criteriaEmbModelRequestConfig
      : (this.getDefault().criteriaEmbModelRequestConfig as any);
    this._criteriaEmbModelRequestConfig =
      StructureCriteriaHandler.rebuildCustomConfigFromModuleContext(
        "structureEmbedded",
        baseCRC as any,
        newCRC as any
      ) as any;
  }
  private _criteriaFieldRequestConfig: TFieldCtrlBaseConfig<
    TFieldMutateInstance,
    TFieldValInstance
  >["criteriaFieldRequestConfig"];
  public get criteriaFieldRequestConfig(): TFieldCtrlBaseConfig<
    TFieldMutateInstance,
    TFieldValInstance
  >["criteriaFieldRequestConfig"] {
    return this._criteriaFieldRequestConfig;
  }
  protected set criteriaFieldRequestConfig(
    v: TFieldCtrlBaseConfig<
      TFieldMutateInstance,
      TFieldValInstance
    >["criteriaFieldRequestConfig"]
  ) {
    const newCRC = this.util.isObject(v)
      ? v
      : (this.getDefault().criteriaFieldRequestConfig as any);
    const baseCRC = this.util.isObject(this._criteriaFieldRequestConfig)
      ? this._criteriaFieldRequestConfig
      : (this.getDefault().criteriaFieldRequestConfig as any);
    this._criteriaFieldRequestConfig =
      StructureCriteriaHandler.rebuildCustomConfigFromModuleContext(
        "structureField",
        baseCRC as any,
        newCRC as any
      ) as any;
  }
  private _diccCriteriaFieldRequestConfig: Record<
    keyof TModel,
    TFieldCtrlBaseConfig<
      TFieldMutateInstance,
      TFieldValInstance
    >["criteriaFieldRequestConfig"]
  >;
  public get diccCriteriaFieldRequestConfig(): Record<
    keyof TModel,
    TFieldCtrlBaseConfig<
      TFieldMutateInstance,
      TFieldValInstance
    >["criteriaFieldRequestConfig"]
  > {
    return this._diccCriteriaFieldRequestConfig;
  }
  protected set diccCriteriaFieldRequestConfig(
    v: Record<
      keyof TModel,
      TFieldCtrlBaseConfig<
        TFieldMutateInstance,
        TFieldValInstance
      >["criteriaFieldRequestConfig"]
    >
  ) {
    v = this.util.isObject(v)
      ? v
      : (this.getDefault().diccCriteriaFieldRequestConfig as any);
    this._diccCriteriaFieldRequestConfig = this.util.isObject(
      this._diccCriteriaFieldRequestConfig
    )
      ? this._diccCriteriaFieldRequestConfig
      : (this.getDefault().diccCriteriaFieldRequestConfig as any);
    for (const keyField in v) {
      if (Object.prototype.hasOwnProperty.call(v, keyField)) {
        const baseCRC = this._diccCriteriaFieldRequestConfig[keyField];
        const newCRC = v[keyField];
        this._diccCriteriaFieldRequestConfig[keyField] =
          StructureCriteriaHandler.rebuildCustomConfigFromModuleContext(
            "structureField",
            baseCRC as any,
            newCRC as any
          ) as any;
      }
    }
  }
  /** */
  constructor(
    baseConfig?: TStructureCtrlBaseConfig<
      TModel,
      TFieldMutateInstance,
      TModelMutateInstance,
      TFieldValInstance,
      TModelValInstance,
      TRequestValInstance,
      TStructureHookInstance,
      TStructureProviderInstance,
      TKeyDiccActionRequest
    >
  ) {
    super("structure");
    baseConfig = this.util.isObject(baseConfig) ? baseConfig : ({} as any);
    const {
      diccCriteriaRequestConfig,
      criteriaEmbModelRequestConfig,
      diccCriteriaFieldRequestConfig,
    } = baseConfig;
    this.diccCriteriaRequestConfig = diccCriteriaRequestConfig;
    this.criteriaEmbModelRequestConfig = criteriaEmbModelRequestConfig;
    this.diccCriteriaFieldRequestConfig = diccCriteriaFieldRequestConfig;
  }
  protected override getDefault() {
    return StructureLogicController.getDefault();
  }
  /**... */
  protected static buildInstanceForMetadata<
    TStructureCtrlInstance extends StructureLogicController<any> = StructureLogicController<any>
  >(preInstance: TStructureCtrlInstance): TStructureCtrlInstance {
    const util = Util_Module.getInstance();
    let inst: TStructureCtrlInstance;
    if (util.isInstance(preInstance)) {
      inst = preInstance;
    } else {
      const { structureModuleFactory } =
        Module._globalConfig_.diccModuleFactory;
      inst = structureModuleFactory.makeModuleInstance(
        "structureCtrl",
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
    TKeys extends keyof IDiccStructureCtrlActionConfig<
      TModel,
      TFieldMutateInstance["diccActionConfig"],
      TFieldValInstance["diccActionConfig"],
      TStructureHookInstance["diccActionConfig"]
    > = keyof IDiccStructureCtrlActionConfig<
      TModel,
      TFieldMutateInstance["diccActionConfig"],
      TFieldValInstance["diccActionConfig"],
      TStructureHookInstance["diccActionConfig"]
    >
  >(keyAction: TKeys): TStructureActionConfigFn<any>;
  /**obtiene un array de funciones de accion de acuerdo a sus claves identificadoras
   * preparadas para ser inyectadas en el middleware
   *
   * @param keysAction el array de las claves identificadoras de las funciones de accion solicitadas
   *
   * @returns el array de funciones de accion
   */
  public override getActionFnByKey<
    TKeys extends keyof IDiccStructureCtrlActionConfig<
      TModel,
      TFieldMutateInstance["diccActionConfig"],
      TFieldValInstance["diccActionConfig"],
      TStructureHookInstance["diccActionConfig"]
    > = keyof IDiccStructureCtrlActionConfig<
      TModel,
      TFieldMutateInstance["diccActionConfig"],
      TFieldValInstance["diccActionConfig"],
      TStructureHookInstance["diccActionConfig"]
    >
  >(keysAction: TKeys[]): Array<TStructureActionConfigFn<any>>;
  public override getActionFnByKey(keyOrKeysAction: unknown): unknown {
    return super.getActionFnByKey(keyOrKeysAction);
  }
  protected override getTupleActionConfigFromCriteriaHandler<
    TKey extends keyof IDiccStructureCtrlActionConfig<
      TModel,
      TFieldMutateInstance["diccActionConfig"],
      TFieldValInstance["diccActionConfig"],
      TStructureHookInstance["diccActionConfig"]
    >
  >(
    criteriaHandler: StructureCriteriaHandler<TModel>,
    keyAction: TKey
  ): [
    TKey,
    IDiccStructureCtrlActionConfig<
      TModel,
      TFieldMutateInstance["diccActionConfig"],
      TFieldValInstance["diccActionConfig"],
      TStructureHookInstance["diccActionConfig"]
    >[TKey]
  ] {
    const tKeyGlobalAC = [this.keyModuleContext, keyAction];
    const actionConfig =
      criteriaHandler.findGlobalActionByKeyModuleAndKeyAction(
        tKeyGlobalAC as any
      );
    return [keyAction, actionConfig];
  }
  protected override buildReportHandler(
    criteriaHandler: StructureCriteriaHandler<TModel>,
    keyAction: unknown
  ): StructureReportHandler {
    const {
      data,
      firstData,
      type,
      modifyType,
      keyPath,
      keyActionRequest,
      keyStructureContext,
    } = criteriaHandler;
    //adapta clave de contexto general a profundo
    const deep_keyModuleContext =
      StructureReportHandler.adapatKeyStructureContextToDeepKeyModuleContext(
        this.keyModule as any,
        keyStructureContext
      );
    let rH = new StructureReportHandler(this.keySrc, {
      keyRepModule: this.keyModule as any,
      keyRepModuleContext: deep_keyModuleContext as any,
      keyRepLogicContext: this.keyLogicContext,
      keyActionRequest: keyActionRequest,
      keyAction: keyAction as any,
      keyTypeRequest: type,
      keyModifyTypeRequest: modifyType,
      keyPath,
      keyLogic: this.util.getKeyLogicByKeyPath(keyPath),
      keyRepSrc: this.keySrc,
      status: this.globalStatus,
      tolerance: this.globalTolerance,
      firstCtrlData: firstData,
      data,
    });
    return rH;
  }
  public override preRunAction(
    criteriaHandler: StructureCriteriaHandler<TModel>,
    keyAction: unknown
  ): void {
    super.preRunAction(criteriaHandler, keyAction) as any;
    return;
  }
  public override postRunAction(
    criteriaHandler: StructureCriteriaHandler<TModel>,
    res: IStructureResponse
  ): void {
    super.postRunAction(criteriaHandler, res) as any;
    return;
  }
  /**... */
  public getEmptyBaseModelCriteria():
    | TStructureModelBaseReadCriteria<
        TModel,
        TModelMutateInstance["diccActionConfig"],
        TModelValInstance["diccActionConfig"],
        TRequestValInstance["diccActionConfig"],
        TStructureHookInstance["diccActionConfig"],
        TStructureProviderInstance["diccActionConfig"],
        TKeyDiccActionRequest
      >
    | TStructureModelBaseModifyCriteria<
        TModel,
        TModelMutateInstance["diccActionConfig"],
        TModelValInstance["diccActionConfig"],
        TRequestValInstance["diccActionConfig"],
        TStructureHookInstance["diccActionConfig"],
        TStructureProviderInstance["diccActionConfig"],
        TKeyDiccActionRequest
      > {
    return {}; //vació, solo se necesita el tipado, posiblemente se convierta a cursor
  }
  protected override async runCommonActionRequest(
    keyActionConfig: TKeysDiccStructureCtrlActionConfig,
    criteriaHandler: StructureCriteriaHandler<TModel>
  ): Promise<IStructureResponse> {
    const { data, keyStructureContext, aTGlobalActionConfig } = criteriaHandler;
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
        keyStructureContext as any,
        keyModule as any,
        keyModuleContext as any,
        criteriaHandler.keyPath
      );
      if (this.isAllowRunAction(tGAC)) {
        let actionFn: TStructureActionConfigFn<TModel>;
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
  //████ Actions ████████████████████████████████████████████████████████████
  /**... */
  public async checkField(
    baseCriteria: Omit<
      TStructureFieldBaseCriteria<
        TModel,
        TFieldMutateInstance["diccActionConfig"],
        TFieldValInstance["diccActionConfig"],
        TStructureHookInstance["diccActionConfig"]
      >,
      "aTGlobalActionConfig"
    > &
      Pick<
        IStructureFieldCriteria<
          TModel,
          TFieldMutateInstance["diccActionConfig"],
          TFieldValInstance["diccActionConfig"],
          TStructureHookInstance["diccActionConfig"]
        >,
        "keyPath" | "data"
      >
  ): Promise<IStructureResponse> {
    const mH = this.metadataHandler;
    let criteriaHandler: StructureCriteriaHandler<any>;
    if (!this.util.isInstance(baseCriteria)) {
      criteriaHandler = new StructureCriteriaHandler(mH, "structureField", {
        ...(baseCriteria as any),
      });
    } else {
      criteriaHandler = baseCriteria as any;
    }
    const res = await this.runCommonActionRequest(
      "checkField",
      criteriaHandler as any
    );
    return res;
  }
  /**... */
  public async checkEmbModel<TEmbModel>(
    baseCriteria: Omit<
      TStructureEmbModelBaseCriteria<
        TModel,
        TModelMutateInstance["diccActionConfig"],
        TModelValInstance["diccActionConfig"],
        TStructureHookInstance["diccActionConfig"]
      >,
      "aTGlobalActionConfig"
    > &
      Pick<
        IStructureEmbModelCriteria<
          TModel,
          TModelMutateInstance["diccActionConfig"],
          TModelValInstance["diccActionConfig"],
          TStructureHookInstance["diccActionConfig"]
        >,
        "keyPath" | "data"
      >
  ): Promise<IStructureResponse> {
    const mH = this.metadataHandler;
    let criteriaHandler: StructureCriteriaHandler<TEmbModel>;
    if (!this.util.isInstance(baseCriteria)) {
      criteriaHandler = new StructureCriteriaHandler<TEmbModel>(
        mH,
        "structureEmbedded",
        {
          ...(baseCriteria as any),
        }
      );
    } else {
      criteriaHandler = baseCriteria as any;
    }
    const res = await this.runCommonActionRequest(
      "checkEmbModel",
      criteriaHandler as any
    );
    return res;
  }
  /**... */
  public async checkAllFields(
    baseCriteria: IStructureModelCriteria<
      TModel,
      TModelMutateInstance["diccActionConfig"],
      TModelValInstance["diccActionConfig"],
      TRequestValInstance["diccActionConfig"],
      TStructureHookInstance["diccActionConfig"],
      TStructureProviderInstance["diccActionConfig"],
      TKeyDiccActionRequest
    >
  ): Promise<IStructureResponse> {
    const mH = this.metadataHandler;
    const keyStructureContext: TKeyStructureContextFull =
      this.util.isEmbeddedFieldFromKeyPath(baseCriteria.keyPath)
        ? "structureEmbedded"
        : "structureModel";
    let criteriaHandler: StructureCriteriaHandler<TModel>;
    if (!this.util.isInstance(baseCriteria)) {
      criteriaHandler = new StructureCriteriaHandler<TModel>(
        mH,
        "structureModel",
        {
          ...(baseCriteria as any),
          keyPath: mH.keyModelPath,
          data: this.util.dfValue,
        }
      );
    } else {
      criteriaHandler = baseCriteria as any;
    }
    const { data } = criteriaHandler;
    const [keyAction, actionConfig] =
      this.getTupleActionConfigFromCriteriaHandler(
        criteriaHandler,
        "checkAllFields"
      );
    const rH = this.buildReportHandler(criteriaHandler, keyAction);
    let res = rH.mutateResponse(undefined, { data });
    let modelForDiccAC = actionConfig as Record<
      any,
      Pick<TStructureFieldBaseCriteria<any>, "diccGlobalAC">
    >;
    modelForDiccAC = this.util.isObject(modelForDiccAC) ? modelForDiccAC : {};
    const modelMetadata = mH.getExtractMetadataByStructureContext(
      keyStructureContext as any
    );
    const keysField = modelMetadata.__keysProp;
    const promForField = keysField.map(async (keyField) => {
      const fieldData = data[keyField];
      const fieldMetadata = modelMetadata[keyField];
      const fieldKeyPath = fieldMetadata.__keyPath;
      const diccFieldGlobalAC = modelForDiccAC[keyField];
      const resForField = this.checkField({
        data: fieldData,
        keyPath: fieldKeyPath,
        diccGlobalAC: diccFieldGlobalAC as any,
      });
      return resForField;
    });
    const resesForField = await Promise.all(promForField);
    res = rH.mutateResponse(res, {
      responses: resesForField,
    });
    return res;
  }
  /**... */
  public async readRequest(
    baseCriteria: Omit<
      TStructureModelBaseReadCriteria<
        TModel,
        TModelMutateInstance["diccActionConfig"],
        TModelValInstance["diccActionConfig"],
        TRequestValInstance["diccActionConfig"],
        TStructureHookInstance["diccActionConfig"],
        TStructureProviderInstance["diccActionConfig"],
        TKeyDiccActionRequest
      >,
      "aTGlobalActionConfig"
    > &
      Pick<
        IStructureModelReadCriteria<
          TModel,
          TModelMutateInstance["diccActionConfig"],
          TModelValInstance["diccActionConfig"],
          TRequestValInstance["diccActionConfig"],
          TStructureHookInstance["diccActionConfig"],
          TStructureProviderInstance["diccActionConfig"],
          TKeyDiccActionRequest
        >,
        "keyActionRequest"
      >
  ): Promise<IStructureResponse> {
    const mH = this.metadataHandler;
    let criteriaHandler: StructureCriteriaHandler<TModel>;
    if (!this.util.isInstance(baseCriteria)) {
      criteriaHandler = new StructureCriteriaHandler<TModel>(
        mH,
        "structureModel",
        {
          ...(baseCriteria as any),
          keyPath: mH.keyModelPath,
          data: this.util.dfValue,
        }
      );
    } else {
      criteriaHandler = baseCriteria as any;
    }
    const res = await this.runCommonActionRequest(
      "readRequest",
      criteriaHandler
    );
    return res;
  }
  /**... */
  public async modifyRequest(
    baseCriteria: Omit<
      TStructureModelBaseModifyCriteria<
        TModel,
        TModelMutateInstance["diccActionConfig"],
        TModelValInstance["diccActionConfig"],
        TRequestValInstance["diccActionConfig"],
        TStructureHookInstance["diccActionConfig"],
        TStructureProviderInstance["diccActionConfig"],
        TKeyDiccActionRequest
      >,
      "aTGlobalActionConfig"
    > &
      Pick<
        IStructureModelModifyCriteria<
          TModel,
          TModelMutateInstance["diccActionConfig"],
          TModelValInstance["diccActionConfig"],
          TRequestValInstance["diccActionConfig"],
          TStructureHookInstance["diccActionConfig"],
          TStructureProviderInstance["diccActionConfig"],
          TKeyDiccActionRequest
        >,
        "keyActionRequest" | "data"
      >
  ): Promise<IStructureResponse> {
    const mH = this.metadataHandler;
    let criteriaHandler: StructureCriteriaHandler<TModel>;
    if (!this.util.isInstance(baseCriteria)) {
      criteriaHandler = new StructureCriteriaHandler<TModel>(
        mH,
        "structureModel",
        {
          ...(baseCriteria as any),
          keyPath: mH.keyModelPath,
        }
      );
    } else {
      criteriaHandler = baseCriteria as any;
    }
    const res = await this.runCommonActionRequest(
      "modifyRequest",
      criteriaHandler
    );
    return res;
  }
}
