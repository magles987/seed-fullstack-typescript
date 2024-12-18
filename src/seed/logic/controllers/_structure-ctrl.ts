import {
  LogicController,
  TKeyModifyRequestController,
  TKeyReadRequestController,
} from "./_controller";
import {
  TFieldConfigForCtrl,
  TFieldCtrlActionFn,
  TKeyStructureCtrlModuleContext,
  TKeyStructureDeepCtrlModuleContext,
  TModelConfigForCtrl,
  TModelCtrlActionFn,
  TStructureCtrlModuleConfigForField,
} from "./_shared";
import {
  StructureLogicMetadataHandler,
  Trf_StructureLogicMetadataHandler,
} from "../meta/structure-metadata-handler";
import { FieldLogicMutater } from "../mutaters/field-mutater";
import { ModelLogicMutater } from "../mutaters/model-mutater";
import { FieldLogicValidation } from "../validators/field-validation";
import { ModelLogicValidation } from "../validators/model-validation";
import { RequestLogicValidation } from "../validators/request-validation";
import { StructureReportHandler } from "../reports/structure-report-handler";
import {
  EKeyActionGroupForRes,
  ELogicResStatusCode,
  IStructureResponse,
} from "../reports/shared";
import { StructureBag, Trf_StructureBag } from "../bag-module/structure-bag";
import { ActionModule } from "../config/module";
import { IStructureBuilderBaseMetadata } from "../meta/metadata-builder-shared";
import { StructureLogicHook } from "../hooks/structure-hook";
import {
  StructureCriteriaHandler,
  Trf_StructureCriteriaHandler,
} from "../criterias/structure-criteria-handler";
import { StructureLogicProvider } from "../providers/structure-provider";
import { ELogicCodeError, LogicError } from "../errors/logic-error";
import {
  TKeyStructureInternalACModuleContext,
  Trf_TStructureFieldMetaAndCtrl,
  Trf_TStructureMetaAndCtrl,
  TStructureFieldMetaAndCtrl,
  TStructureMetaAndCtrl,
} from "../meta/metadata-shared";
import { TKeyRequestType } from "../config/shared-modules";
import {
  ELogicOperatorForCondition,
  TStructureBaseCriteria,
  TStructureBaseCriteriaForCtrlField,
  TStructureBaseCriteriaForCtrlModify,
  TStructureBaseCriteriaForCtrlRead,
} from "../criterias/shared";
import { Model } from "../models/_model";
import { Util_Ctrl } from "./_util-ctrl";
import { TCapitalizeFirstLetter } from "../../util/shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
export type TKeyStructureReadRequestController =
  | TKeyReadRequestController
  | "readById";
export type TKeyStructureModifyRequestController = TKeyModifyRequestController;
//| "createMany"
//| "updateMany"
//| "deleteMany";
/**tipado refactorizado de la clase*/
export type Trf_StructureController = StructureLogicController<any>;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**
 * controller basico para un contexto estructural
 * ____
 */
export abstract class StructureLogicController<
    TModel,
    TStructureCriteriaInstance extends StructureCriteriaHandler<TModel> = StructureCriteriaHandler<TModel>,
    TFieldMutateInstance extends FieldLogicMutater = FieldLogicMutater,
    TModelMutateInstance extends ModelLogicMutater = ModelLogicMutater,
    TFieldValInstance extends FieldLogicValidation = FieldLogicValidation,
    TModelValInstance extends ModelLogicValidation = ModelLogicValidation,
    TRequestValInstance extends RequestLogicValidation = RequestLogicValidation,
    TStructureHookInstance extends StructureLogicHook = StructureLogicHook,
    TStructureProviderInstance extends StructureLogicProvider = StructureLogicProvider,
    TKeyDiccActionRequest extends
      | TKeyStructureReadRequestController
      | TKeyStructureModifyRequestController =
      | TKeyStructureReadRequestController
      | TKeyStructureModifyRequestController
  >
  extends LogicController
  implements
    Record<
      TKeyStructureReadRequestController | TKeyStructureModifyRequestController,
      TModelCtrlActionFn<
        TModel,
        TModelMutateInstance["dfDiccActionConfig"],
        TModelValInstance["dfDiccActionConfig"],
        TRequestValInstance["dfDiccActionConfig"],
        TStructureHookInstance["dfDiccActionConfig"],
        TStructureProviderInstance["dfDiccActionConfig"]
      >
    >,
    Record<
      `checkField${TCapitalizeFirstLetter<keyof Model>}`,
      TFieldCtrlActionFn<
        TModel,
        TFieldMutateInstance["dfDiccActionConfig"],
        TFieldValInstance["dfDiccActionConfig"]
      >
    >
{
  public static override getDefault = () => {
    const superDf = LogicController.getDefault();
    return {
      ...superDf,
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
    return "structureCtrl"; //❗especial❗, no hay contexto field o model ya que solo hereda modelos
  }
  /**... */
  public get fieldMutateModuleInstance() {
    const r = this.metadataHandler.diccModuleInstanceContext.fieldMutate;
    return r;
  }
  /**... */
  public get modelMutateModuleInstance() {
    const r = this.metadataHandler.diccModuleInstanceContext.modelMutate;
    return r;
  }
  /**... */
  public get fieldValModuleInstance() {
    const r = this.metadataHandler.diccModuleInstanceContext.fieldVal;
    return r;
  }
  /**... */
  public get modelValModuleInstance() {
    const r = this.metadataHandler.diccModuleInstanceContext.modelVal;
    return r;
  }
  /**... */
  public get requestValModuleInstance() {
    const r = this.metadataHandler.diccModuleInstanceContext.requestVal;
    return r;
  }
  /**... */
  public get structureHookModuleInstance() {
    const r = this.metadataHandler.diccModuleInstanceContext.structureHook;
    return r;
  }
  /**... */
  public get structureProviderModuleInstance() {
    const r = this.metadataHandler.diccModuleInstanceContext.structureProvider;
    return r;
  }
  /**
   * @param baseStructureMetadata configuracion base de metadatos
   * (es un objeto literal no el manejador)
   */
  constructor(
    baseStructureMetadata: IStructureBuilderBaseMetadata<
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
    super("structure", baseStructureMetadata);
    const { keySrc, customBase, customDiccModuleInstance } =
      baseStructureMetadata;
    this.metadataHandler = new StructureLogicMetadataHandler(
      keySrc,
      customBase,
      customDiccModuleInstance as any
    );
  }
  protected override getDefault() {
    return StructureLogicController.getDefault();
  }
  public static rebuildCustomConfigFromModuleContext( //estatica obligatoria
    keyModuleDeepContext: "fieldCtrl",
    currentContextConfig: TFieldConfigForCtrl<any>["fieldCtrl"],
    newContextConfig: TFieldConfigForCtrl<any>["fieldCtrl"]
  ): TFieldConfigForCtrl<any>["fieldCtrl"];
  public static rebuildCustomConfigFromModuleContext( //estatica obligatoria
    keyModuleDeepContext: "modelCtrl",
    currentContextConfig: TModelConfigForCtrl<any, any>["modelCtrl"],
    newContextConfig: TModelConfigForCtrl<any, any>["modelCtrl"]
  ): TModelConfigForCtrl<any, any>["modelCtrl"];
  public static rebuildCustomConfigFromModuleContext(
    //estatica obligatoria
    keyModuleDeepContext: unknown,
    currentContextConfig: unknown,
    newContextConfig: unknown
  ): unknown {
    const util = Util_Ctrl.getInstance();
    let rConfig: unknown;
    if (keyModuleDeepContext === "fieldCtrl") {
      const cCC = currentContextConfig as TFieldConfigForCtrl<any>["fieldCtrl"];
      const nCC = newContextConfig as TFieldConfigForCtrl<any>["fieldCtrl"];
      let rFieldConfig: TFieldConfigForCtrl<any>["fieldCtrl"];
      if (!util.isObject(nCC)) {
        rFieldConfig = cCC;
      } else {
        rFieldConfig = {
          ...nCC,
          aTKeysActionRequest: util.isArray(nCC.aTKeysActionRequest)
            ? nCC.aTKeysActionRequest
            : cCC.aTKeysActionRequest,
        };
      }
      //reordenar tuplas de diccionario global
      //...falta
      rConfig = rFieldConfig;
    } else if (keyModuleDeepContext === "modelCtrl") {
      const cCC = currentContextConfig as TModelConfigForCtrl<
        any,
        any
      >["modelCtrl"];
      const nCC = newContextConfig as TModelConfigForCtrl<
        any,
        any
      >["modelCtrl"];
      let rModelConfig: TModelConfigForCtrl<any, any>["modelCtrl"];
      if (!util.isObject(nCC)) {
        rModelConfig = cCC;
      } else {
        rModelConfig = {
          ...nCC,
          diccATKeysActionRequest: util.isObject(nCC.diccATKeysActionRequest)
            ? nCC.diccATKeysActionRequest
            : cCC.diccATKeysActionRequest,
        };
      }
      //reordenar tuplas de diccionario global
      //...falta
      rConfig = rModelConfig;
    } else {
      throw new LogicError({
        code: ELogicCodeError.NOT_VALID,
        msn: `${keyModuleDeepContext} is not deep module context key valid`,
      });
    }
    //...aqui configuracion refinada:
    return rConfig;
  }
  protected getMetadataWithContextModule(
    keyModuleDeepContext: "fieldCtrl",
    keyPath: string
  ): TStructureFieldMetaAndCtrl<
    TFieldMutateInstance["dfDiccActionConfig"],
    TFieldValInstance["dfDiccActionConfig"]
  >;
  protected getMetadataWithContextModule(
    keyModuleDeepContext: "modelCtrl",
    keyPath: string
  ): TStructureMetaAndCtrl<
    TModel,
    TModelMutateInstance["dfDiccActionConfig"],
    TModelValInstance["dfDiccActionConfig"],
    TRequestValInstance["dfDiccActionConfig"],
    TStructureHookInstance["dfDiccActionConfig"],
    TStructureProviderInstance["dfDiccActionConfig"],
    TKeyDiccActionRequest
  >;
  protected getMetadataWithContextModule(
    keyModuleDeepContext: TKeyStructureDeepCtrlModuleContext,
    keyPath: string
  ): unknown {
    let extractMetadataByContext: unknown;
    if (keyModuleDeepContext === "fieldCtrl") {
      extractMetadataByContext =
        this.metadataHandler.getExtractMetadataByModuleContext(
          "structureField",
          "controller",
          keyPath
        ) as any;
    } else if (keyModuleDeepContext === "modelCtrl") {
      if (this.util.isEmbeddedFromKeyPath(keyPath)) {
        throw new Error("No actived yet");
        // extractMetadataByContext =
        //   this.metadataHandler.getExtractMetadataByModuleContext(
        //     "structureEmbedded",
        //     "controller",
        //     keyPath
        //   ) as any;
      } else {
        extractMetadataByContext =
          this.metadataHandler.getExtractMetadataByModuleContext(
            "structureModel",
            "controller"
          ) as any;
      }
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${this.keyModuleContext} does not module context valid`,
      });
    }
    return extractMetadataByContext;
  }
  protected getMetadataOnlyModuleConfig(
    keyModuleDeepContext: "fieldCtrl",
    keyPath: string
  ): TFieldConfigForCtrl<
    TFieldMutateInstance["dfDiccActionConfig"] &
      TFieldValInstance["dfDiccActionConfig"]
  >;
  protected getMetadataOnlyModuleConfig(
    keyModuleDeepContext: "modelCtrl",
    keyPath: string
  ): TModelConfigForCtrl<
    TModelMutateInstance["dfDiccActionConfig"] &
      TModelValInstance["dfDiccActionConfig"] &
      TRequestValInstance["dfDiccActionConfig"] &
      TStructureHookInstance["dfDiccActionConfig"] &
      TStructureProviderInstance["dfDiccActionConfig"],
    TKeyDiccActionRequest
  >;
  protected getMetadataOnlyModuleConfig(
    keyModuleDeepContext: TKeyStructureDeepCtrlModuleContext,
    keyPath: string
  ): unknown {
    let config: unknown;
    const metadata = this.getMetadataWithContextModule(
      keyModuleDeepContext as any,
      keyPath
    ) as any;
    if (keyModuleDeepContext === "fieldCtrl") {
      const metadataField = metadata as Trf_TStructureFieldMetaAndCtrl;
      config = metadataField.__ctrlConfig;
    } else if (keyModuleDeepContext === "modelCtrl") {
      const metadataInModel = metadata as Trf_TStructureMetaAndCtrl;
      config = metadataInModel.__ctrlConfig;
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${this.keyModuleContext} does not module context valid`,
      });
    }
    return config;
  }
  /**... */
  protected getATKeysActionRequest(
    keyPath: string
  ): TStructureCtrlModuleConfigForField<
    TFieldMutateInstance["dfDiccActionConfig"] &
      TFieldValInstance["dfDiccActionConfig"]
  >["aTKeysActionRequest"] {
    const config = this.getMetadataOnlyModuleConfig("fieldCtrl", keyPath);
    let { aTKeysActionRequest } = config.fieldCtrl;
    aTKeysActionRequest = this.util.isArray(aTKeysActionRequest)
      ? aTKeysActionRequest
      : [];
    return aTKeysActionRequest;
  }
  protected getDiccATKeysActionRequest(
    keyPath: string
  ): TModelConfigForCtrl<
    TModelMutateInstance["dfDiccActionConfig"] &
      TModelValInstance["dfDiccActionConfig"] &
      TRequestValInstance["dfDiccActionConfig"] &
      TStructureHookInstance["dfDiccActionConfig"] &
      TStructureProviderInstance["dfDiccActionConfig"],
    TKeyDiccActionRequest
  >["modelCtrl"]["diccATKeysActionRequest"] {
    const config = this.getMetadataOnlyModuleConfig("modelCtrl", keyPath);
    let { diccATKeysActionRequest } = config.modelCtrl;
    return diccATKeysActionRequest;
  }
  /**... */
  protected getATKeysActionRequestByKeyActionRequest(
    keyPath: string,
    keyActionRequest: TKeyDiccActionRequest
  ) {
    const schemaATKeyGlobal = this.getDiccATKeysActionRequest(keyPath);
    const aTKeyGlobal =
      this.util.isObject(schemaATKeyGlobal) &&
      this.util.isArray(schemaATKeyGlobal[keyActionRequest])
        ? schemaATKeyGlobal[keyActionRequest]
        : [];
    return aTKeyGlobal;
  }
  protected override buildCriteriaHandler(
    requestType: "read",
    base?: TStructureBaseCriteriaForCtrlRead<
      TModel,
      TModelMutateInstance["dfDiccActionConfig"],
      TModelValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TStructureHookInstance["dfDiccActionConfig"],
      TStructureProviderInstance["dfDiccActionConfig"]
    >,
    customCriteriaInstance?: StructureCriteriaHandler<TModel>
  ): StructureCriteriaHandler<
    TModel,
    TFieldMutateInstance["dfDiccActionConfig"],
    TModelMutateInstance["dfDiccActionConfig"],
    TFieldValInstance["dfDiccActionConfig"],
    TModelValInstance["dfDiccActionConfig"],
    TRequestValInstance["dfDiccActionConfig"],
    TStructureHookInstance["dfDiccActionConfig"],
    TStructureProviderInstance["dfDiccActionConfig"]
  >;
  protected override buildCriteriaHandler(
    requestType: "modify",
    base?: TStructureBaseCriteriaForCtrlModify<
      TModel,
      TModelMutateInstance["dfDiccActionConfig"],
      TModelValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TStructureHookInstance["dfDiccActionConfig"],
      TStructureProviderInstance["dfDiccActionConfig"]
    >,
    customCriteriaInstance?: StructureCriteriaHandler<TModel>
  ): StructureCriteriaHandler<
    TModel,
    TFieldMutateInstance["dfDiccActionConfig"],
    TModelMutateInstance["dfDiccActionConfig"],
    TFieldValInstance["dfDiccActionConfig"],
    TModelValInstance["dfDiccActionConfig"],
    TRequestValInstance["dfDiccActionConfig"],
    TStructureHookInstance["dfDiccActionConfig"],
    TStructureProviderInstance["dfDiccActionConfig"]
  >;
  protected override buildCriteriaHandler(
    requestType: TKeyRequestType,
    base?:
      | TStructureBaseCriteriaForCtrlRead<TModel>
      | TStructureBaseCriteriaForCtrlModify<TModel>,
    customCriteriaInstance?: StructureCriteriaHandler<TModel>
  ): StructureCriteriaHandler<
    TModel,
    TFieldMutateInstance["dfDiccActionConfig"],
    TModelMutateInstance["dfDiccActionConfig"],
    TFieldValInstance["dfDiccActionConfig"],
    TModelValInstance["dfDiccActionConfig"],
    TRequestValInstance["dfDiccActionConfig"],
    TStructureHookInstance["dfDiccActionConfig"],
    TStructureProviderInstance["dfDiccActionConfig"]
  > {
    //establece la instancia de la critera con opcion personalizada
    base = this.util.isObject(base) ? base : {};
    let cH: StructureCriteriaHandler<TModel>;
    if (!this.util.isInstance(customCriteriaInstance)) {
      cH = new StructureCriteriaHandler(this.keySrc, this.metadataHandler, {
        ...base,
        type: requestType,
        keyStructureContext: "structureModel",
      });
    } else {
      customCriteriaInstance.mutateProps({
        ...base,
        type: requestType,
        keyStructureContext: "structureModel",
      });
      cH = customCriteriaInstance;
    }
    return cH;
  }
  /**... */
  protected buildCriteriaHandlerForField(
    base?: TStructureBaseCriteriaForCtrlField<
      TModel,
      TFieldMutateInstance["dfDiccActionConfig"],
      TFieldValInstance["dfDiccActionConfig"]
    >,
    customCriteriaInstance?: StructureCriteriaHandler<TModel>
  ): StructureCriteriaHandler<
    TModel,
    TFieldMutateInstance["dfDiccActionConfig"],
    any,
    TFieldValInstance["dfDiccActionConfig"],
    any,
    any,
    any,
    any
  > {
    //establece la instancia de la criteria con opción personalizada
    base = this.util.isObject(base) ? base : {};
    let cH: StructureCriteriaHandler<TModel>;
    if (!this.util.isInstance(customCriteriaInstance)) {
      cH = new StructureCriteriaHandler(this.keySrc, this.metadataHandler, {
        ...base,
        keyStructureContext: "structureField",
      });
    } else {
      customCriteriaInstance.mutateProps({
        ...base,
        keyStructureContext: "structureField",
      } as any);
      cH = customCriteriaInstance;
    }
    return cH;
  }
  public override buildReportHandler(
    bag: Trf_StructureBag,
    keyAction: unknown
  ): StructureReportHandler {
    const { data, criteriaHandler, firstData } = bag;
    const { type, modifyType, keyPath, keyActionRequest } = criteriaHandler;
    let rH = new StructureReportHandler(this.keySrc, {
      keyRepModule: this.keyModule as any,
      keyRepModuleContext: this.keyModuleContext as any,
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
    bag: Trf_StructureBag,
    keyAction: unknown
  ): void {
    super.preRunAction(bag, keyAction) as any;
    return;
  }
  public override postRunAction(
    bag: Trf_StructureBag,
    res: IStructureResponse
  ): void {
    super.postRunAction(bag, res) as any;
    return;
  }
  //████ runs commons ████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
  protected async runCommonFieldRequest(
    data: any,
    criteriaHandler: Trf_StructureCriteriaHandler
  ): Promise<IStructureResponse> {
    let bag = new StructureBag(this.keySrc, "fieldBag", {
      data,
      criteriaHandler: criteriaHandler as any,
    });
    const res = await this.runRequest("fieldCtrl", bag as any);
    return res;
  }
  protected async runCommonModelRequest(
    data: TModel,
    criteriaHandler: Trf_StructureCriteriaHandler
  ): Promise<IStructureResponse> {
    let bag = new StructureBag<
      TModel,
      TStructureCriteriaInstance,
      any,
      TModelMutateInstance["dfDiccActionConfig"],
      any,
      TModelValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TStructureHookInstance["dfDiccActionConfig"],
      TStructureProviderInstance["dfDiccActionConfig"]
    >(this.keySrc, "modelBag", {
      data,
      criteriaHandler: criteriaHandler as any,
    });
    const res = await this.runRequest("modelCtrl", bag);
    return res;
  }
  /**
   * ejecuta las acciones configuradas en el bag completo
   *
   * @param keyBagCtrlContext contexto de ejecucion del bag controller
   * @param bag instancia del bag completo
   * @returns respuesta de la ejecucion
   */
  protected async runRequest(
    keyBagCtrlContext: TKeyStructureDeepCtrlModuleContext,
    bag: StructureBag<
      TModel,
      TStructureCriteriaInstance,
      any,
      TModelMutateInstance["dfDiccActionConfig"],
      any,
      TModelValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TStructureHookInstance["dfDiccActionConfig"],
      TStructureProviderInstance["dfDiccActionConfig"]
    >
  ): Promise<IStructureResponse> {
    let keyCtrlAction: EKeyActionGroupForRes;
    if (keyBagCtrlContext === "fieldCtrl")
      keyCtrlAction = EKeyActionGroupForRes.ctrlField;
    else if (keyBagCtrlContext === "modelCtrl")
      keyCtrlAction = EKeyActionGroupForRes.ctrlModel;
    else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${keyBagCtrlContext} is not key bag controller context valid`,
      });
    }
    const { data, criteriaHandler: cH } = bag;
    const { aTKeysGlobalActionConfig, diccGlobalAC } = cH;
    const rH = this.buildReportHandler(bag, keyCtrlAction);
    let res = rH.mutateResponse(undefined, { data });
    this.preRunAction(bag, keyCtrlAction);
    //verificar si hay acciones para ejecutar
    if (aTKeysGlobalActionConfig.length === 0) {
      res = rH.mutateResponse(res, {
        status: ELogicResStatusCode.WARNING,
        msn: `${aTKeysGlobalActionConfig} is array of global action config empty`,
      });
      this.postRunAction(bag, res);
      return res;
    }
    for (const tKeyGAC of aTKeysGlobalActionConfig) {
      const [keyModuleContext, keyAction] = tKeyGAC;
      const mFX = this.metadataHandler.getModuleInstanceForActionContext(
        keyModuleContext as TKeyStructureInternalACModuleContext
      );
      if (this.util.isAllowRunAction(tKeyGAC, diccGlobalAC as object)) {
        const resForAction = await this.runRequestForAction(
          mFX,
          bag,
          keyAction
        );
        res.responses.push(resForAction);
        if (resForAction.status > this.globalTolerance) break;
      }
    }
    res = rH.mutateResponse(res);
    this.postRunAction(bag, res);
    return res;
  }
  protected override async runRequestForAction(
    actionModuleInstContext: ActionModule<any>,
    bag: StructureBag<TModel>,
    keyAction: any
  ): Promise<IStructureResponse> {
    const res = (await super.runRequestForAction(
      actionModuleInstContext,
      bag,
      keyAction
    )) as IStructureResponse;
    return res;
  }
  //████ Field Actions ████████████████████████████████████████████████████████████
  public async checkField_id(
    data: any,
    baseCriteria: TStructureBaseCriteriaForCtrlField<
      TModel,
      TFieldMutateInstance["dfDiccActionConfig"],
      TFieldValInstance["dfDiccActionConfig"]
    >
  ): Promise<IStructureResponse> {
    baseCriteria = this.util.isObject(baseCriteria) ? baseCriteria : {};
    //criterios obligatorios para esta acción de petición
    const cH = this.buildCriteriaHandlerForField({
      ...(baseCriteria as any),
      type: "read",
      keyActionRequest: "checkField_id" as `checkField${TCapitalizeFirstLetter<
        keyof Model
      >}`,
      expectedDataType: "any",
    });
    const res = await this.runCommonFieldRequest(data, cH);
    return res;
  }
  public async checkField_pathDoc(
    data: any,
    baseCriteria: TStructureBaseCriteriaForCtrlField<
      TModel,
      TFieldMutateInstance["dfDiccActionConfig"],
      TFieldValInstance["dfDiccActionConfig"]
    >
  ): Promise<IStructureResponse> {
    baseCriteria = this.util.isObject(baseCriteria) ? baseCriteria : {};
    //criterios obligatorios para esta acción de petición
    const cH = this.buildCriteriaHandlerForField({
      ...(baseCriteria as any),
      type: "read",
      keyActionRequest:
        "checkField_pathDoc" as `checkField${TCapitalizeFirstLetter<
          keyof Model
        >}`,
      expectedDataType: "any",
    });
    const res = await this.runCommonFieldRequest(data, cH);
    return res;
  }
  //████ Acciones de peticion ████████████████████████████████████████████████████████████
  /**... */
  public async exist(
    baseCriteria: TStructureBaseCriteriaForCtrlRead<
      TModel,
      TModelMutateInstance["dfDiccActionConfig"],
      TModelValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TStructureHookInstance["dfDiccActionConfig"],
      TStructureProviderInstance["dfDiccActionConfig"]
    >
  ): Promise<IStructureResponse> {
    baseCriteria = this.util.isObject(baseCriteria) ? baseCriteria : {};
    //criterios obligatorios para esta acción de petición
    const cH = this.buildCriteriaHandler("read", {
      ...(baseCriteria as any),
      type: "read",
      keyActionRequest: "exist" as TKeyStructureReadRequestController,
      expectedDataType: "boolean",
    });
    const res = await this.runCommonModelRequest(this.util.dfValue, cH);
    return res;
  }
  public async count(
    baseCriteria: TStructureBaseCriteriaForCtrlRead<
      TModel,
      TModelMutateInstance["dfDiccActionConfig"],
      TModelValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TStructureHookInstance["dfDiccActionConfig"],
      TStructureProviderInstance["dfDiccActionConfig"]
    >
  ): Promise<IStructureResponse> {
    baseCriteria = this.util.isObject(baseCriteria) ? baseCriteria : {};
    //criterios obligatorios para esta acción de petición
    const cH = this.buildCriteriaHandler("read", {
      ...(baseCriteria as any),
      type: "read",
      keyActionRequest: "count" as TKeyStructureReadRequestController,
      expectedDataType: "number",
    });
    const res = await this.runCommonModelRequest(this.util.dfValue, cH);
    return res;
  }
  public async inform(
    baseCriteria: TStructureBaseCriteriaForCtrlRead<
      TModel,
      TModelMutateInstance["dfDiccActionConfig"],
      TModelValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TStructureHookInstance["dfDiccActionConfig"],
      TStructureProviderInstance["dfDiccActionConfig"]
    >
  ): Promise<IStructureResponse> {
    baseCriteria = this.util.isObject(baseCriteria) ? baseCriteria : {};
    //criterios obligatorios para esta acción de petición
    const cH = this.buildCriteriaHandler("read", {
      ...(baseCriteria as any),
      type: "read",
      keyActionRequest: "inform" as TKeyStructureReadRequestController,
      expectedDataType: "string",
    });
    const res = await this.runCommonModelRequest(this.util.dfValue, cH);
    return res;
  }
  public async readAll(
    baseCriteria: TStructureBaseCriteriaForCtrlRead<
      TModel,
      TModelMutateInstance["dfDiccActionConfig"],
      TModelValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TStructureHookInstance["dfDiccActionConfig"],
      TStructureProviderInstance["dfDiccActionConfig"]
    >
  ): Promise<IStructureResponse> {
    baseCriteria = this.util.isObject(baseCriteria) ? baseCriteria : {};
    //criterios obligatorios para esta acción de petición
    const cH = this.buildCriteriaHandler("read", {
      ...(baseCriteria as any),
      type: "read",
      keyActionRequest: "readAll" as TKeyStructureReadRequestController,
      expectedDataType: "array",
      query: [], //❗se leen todos (no hay condición de filtrador)❗
    });
    const res = await this.runCommonModelRequest(this.util.dfValue, cH);
    return res;
  }
  public async readMany(
    baseCriteria: TStructureBaseCriteriaForCtrlRead<
      TModel,
      TModelMutateInstance["dfDiccActionConfig"],
      TModelValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TStructureHookInstance["dfDiccActionConfig"],
      TStructureProviderInstance["dfDiccActionConfig"]
    >
  ): Promise<IStructureResponse> {
    baseCriteria = this.util.isObject(baseCriteria) ? baseCriteria : {};
    //criterios obligatorios para esta acción de petición
    const cH = this.buildCriteriaHandler("read", {
      ...(baseCriteria as any),
      type: "read",
      keyActionRequest: "readMany" as TKeyStructureReadRequestController,
      expectedDataType: "array",
    });
    const res = await this.runCommonModelRequest(this.util.dfValue, cH);
    return res;
  }
  public async readOne(
    baseCriteria: TStructureBaseCriteriaForCtrlRead<
      TModel,
      TModelMutateInstance["dfDiccActionConfig"],
      TModelValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TStructureHookInstance["dfDiccActionConfig"],
      TStructureProviderInstance["dfDiccActionConfig"]
    >
  ): Promise<IStructureResponse> {
    baseCriteria = this.util.isObject(baseCriteria) ? baseCriteria : {};
    //criterios obligatorios para esta acción de petición
    const cH = this.buildCriteriaHandler("read", {
      ...(baseCriteria as any),
      type: "read",
      keyActionRequest: "readOne" as TKeyStructureReadRequestController,
      expectedDataType: "object",
      limit: 1,
      sort: [],
    });
    const res = await this.runCommonModelRequest(this.util.dfValue, cH);
    return res;
  }
  public async readById(
    _id: any,
    baseCriteria: TStructureBaseCriteriaForCtrlRead<
      TModel,
      TModelMutateInstance["dfDiccActionConfig"],
      TModelValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TStructureHookInstance["dfDiccActionConfig"],
      TStructureProviderInstance["dfDiccActionConfig"]
    >
  ): Promise<IStructureResponse> {
    baseCriteria = this.util.isObject(baseCriteria) ? baseCriteria : {};
    //criterios obligatorios para esta acción de petición
    const key_id = "_id" as keyof Model;
    const cH = this.buildCriteriaHandler("read", {
      ...(baseCriteria as any),
      type: "read",
      keyActionRequest: "readById" as TKeyStructureReadRequestController,
      expectedDataType: "boolean",
      limit: 1,
      sort: [],
      query: [{ op: ELogicOperatorForCondition.eq, vCond: _id }], //⚠Sobreescribe la query⚠
    });
    const res = await this.runCommonModelRequest(undefined, cH);
    return res;
  }
  public async create(
    data: TModel,
    baseCriteria: TStructureBaseCriteriaForCtrlModify<
      TModel,
      TModelMutateInstance["dfDiccActionConfig"],
      TModelValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TStructureHookInstance["dfDiccActionConfig"],
      TStructureProviderInstance["dfDiccActionConfig"]
    >
  ): Promise<IStructureResponse> {
    baseCriteria = this.util.isObject(baseCriteria) ? baseCriteria : {};
    //criterios obligatorios para esta acción de petición
    const cH = this.buildCriteriaHandler("modify", {
      ...(baseCriteria as any),
      type: "modify",
      modifyType: "create",
      keyActionRequest: "create" as TKeyStructureModifyRequestController,
      expectedDataType: "object",
    });
    const res = await this.runCommonModelRequest(data, cH);
    return res;
  }
  public async update(
    data: TModel,
    baseCriteria: TStructureBaseCriteriaForCtrlModify<
      TModel,
      TModelMutateInstance["dfDiccActionConfig"],
      TModelValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TStructureHookInstance["dfDiccActionConfig"],
      TStructureProviderInstance["dfDiccActionConfig"]
    >
  ): Promise<IStructureResponse> {
    baseCriteria = this.util.isObject(baseCriteria) ? baseCriteria : {};
    //criterios obligatorios para esta acción de petición
    const cH = this.buildCriteriaHandler("modify", {
      ...(baseCriteria as any),
      type: "modify",
      modifyType: "update",
      keyActionRequest: "update" as TKeyStructureModifyRequestController,
      expectedDataType: "object",
    });
    const res = await this.runCommonModelRequest(data, cH);
    return res;
  }
  public async delete(
    data: TModel,
    baseCriteria: TStructureBaseCriteriaForCtrlModify<
      TModel,
      TModelMutateInstance["dfDiccActionConfig"],
      TModelValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TStructureHookInstance["dfDiccActionConfig"],
      TStructureProviderInstance["dfDiccActionConfig"]
    >
  ): Promise<IStructureResponse> {
    baseCriteria = this.util.isObject(baseCriteria) ? baseCriteria : {};
    //criterios obligatorios para esta acción de petición
    const cH = this.buildCriteriaHandler("modify", {
      ...(baseCriteria as any),
      type: "modify",
      modifyType: "delete",
      keyActionRequest: "delete" as TKeyStructureModifyRequestController,
      expectedDataType: "object",
    });
    const res = await this.runCommonModelRequest(data, cH);
    return res;
  }
  // public async createMany(
  //   bagCtrl: IStructureBagForModelCtrlContext<
  //     TModel,
  //     TStructureCriteriaInstance,
  //     TModelMutateInstance["dfDiccActionConfig"],
  //     TModelValInstance["dfDiccActionConfig"],
  //     TRequestValInstance["dfDiccActionConfig"],
  //     TStructureHookInstance["dfDiccActionConfig"],
  //     TStructureProviderInstance["dfDiccActionConfig"]
  //   >
  // ): Promise<IStructureResponse> {
  //   return;
  // }
  // public async updateMany(
  //   bagCtrl: IStructureBagForModelCtrlContext<
  //     TModel,
  //     TStructureCriteriaInstance,
  //     TModelMutateInstance["dfDiccActionConfig"],
  //     TModelValInstance["dfDiccActionConfig"],
  //     TRequestValInstance["dfDiccActionConfig"],
  //     TStructureHookInstance["dfDiccActionConfig"],
  //     TStructureProviderInstance["dfDiccActionConfig"]
  //   >
  // ): Promise<IStructureResponse> {
  //   return;
  // }
  // public async deleteMany(
  //   bagCtrl: IStructureBagForModelCtrlContext<
  //     TModel,
  //     TStructureCriteriaInstance,
  //     TModelMutateInstance["dfDiccActionConfig"],
  //     TModelValInstance["dfDiccActionConfig"],
  //     TRequestValInstance["dfDiccActionConfig"],
  //     TStructureHookInstance["dfDiccActionConfig"],
  //     TStructureProviderInstance["dfDiccActionConfig"]
  //   >
  // ): Promise<IStructureResponse> {
  //   return;
  // }
}
