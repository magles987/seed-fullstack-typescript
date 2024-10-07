import {
  LogicController,
  TKeyModifyRequestController,
  TKeyReadRequestController,
} from "./_controller";
import {
  TFieldConfigForCtrl,
  TKeyFieldInternalACModuleContext,
  TKeyModelInternalACModuleContext,
  TKeyStructureCtrlModuleContext,
  TKeyStructureDeepCtrlModuleContext,
  TKeyStructureInternalACModuleContext,
  TModelConfigForCtrl,
  TStructureCtrlModuleConfigForField,
  TStructureCtrlModuleConfigForModel,
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
import { EKeyActionGroupForRes, IStructureResponse } from "../reports/shared";
import { StructureBag, Trf_StructureBag } from "../bag-module/structure-bag";
import { ActionModule, IBuildACOption } from "../config/module";
import { IStructureBuilderBaseMetadata } from "../meta/metadata-builder-shared";
import { StructureLogicHook } from "../hooks/structure-hook";
import { StructureCriteriaHandler } from "../criterias/structure-criteria-handler";
import { StructureLogicProvider } from "../providers/structure-provider";
import { ELogicCodeError, LogicError } from "../errors/logic-error";
import {
  IStructureBagForFieldCtrlContext,
  IStructureBagForModelCtrlContext,
  TModelFnBagForCtrl,
  Trf_IStructureBagForCtrlContext,
} from "../bag-module/shared-for-external-module";
import { TKeyStructureDeepBagModuleContext } from "../bag-module/shared";
import {
  Trf_TStructureFieldMetaAndCtrl,
  Trf_TStructureMetaAndCtrl,
  TStructureFieldMetaAndCtrl,
  TStructureMetaAndCtrl,
} from "../meta/metadata-shared";
import { TKeyRequestType } from "../config/shared-modules";
import {
  ELogicOperatorForCondition,
  TStructureBaseCriteriaForCtrlModify,
  TStructureBaseCriteriaForCtrlRead,
} from "../criterias/shared";
import { Model } from "../models/_model";
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
    TKeyDiccCtrlCRUD extends string = string
  >
  extends LogicController
  implements
    Record<
      TKeyStructureReadRequestController | TKeyStructureModifyRequestController,
      TModelFnBagForCtrl<
        IStructureBagForModelCtrlContext<
          TModel,
          TStructureCriteriaInstance,
          TModelMutateInstance["dfDiccActionConfig"],
          TModelValInstance["dfDiccActionConfig"],
          TRequestValInstance["dfDiccActionConfig"],
          TStructureHookInstance["dfDiccActionConfig"],
          TStructureProviderInstance["dfDiccActionConfig"]
        >
      >
    >
{
  public static override getDefault = () => {
    const superDf = LogicController.getDefault();
    return {
      ...superDf,
      bagCtrl: {
        data: undefined,
        keyPath: undefined,
        criteriaHandler: undefined,
        diccGlobalAC: {
          fieldMutate: {},
          fieldVal: {},
          modelMutate: {},
          modelVal: {},
          requestVal: {},
          structureHook: {},
        },
      } as Trf_IStructureBagForCtrlContext,
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
    TKeyDiccCtrlCRUD
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
    const r = this.metadataHandler.diccModuleIntanceContext.fieldMutate;
    return r;
  }
  /**... */
  public get modelMutateModuleInstance() {
    const r = this.metadataHandler.diccModuleIntanceContext.modelMutate;
    return r;
  }
  /**... */
  public get fieldValModuleInstance() {
    const r = this.metadataHandler.diccModuleIntanceContext.fieldVal;
    return r;
  }
  /**... */
  public get modelValModuleInstance() {
    const r = this.metadataHandler.diccModuleIntanceContext.modelVal;
    return r;
  }
  /**... */
  public get requestValModuleInstance() {
    const r = this.metadataHandler.diccModuleIntanceContext.requestVal;
    return r;
  }
  /**... */
  public get structureHookModuleInstance() {
    const r = this.metadataHandler.diccModuleIntanceContext.structureHook;
    return r;
  }
  /**... */
  public get structureProviderModuleInstance() {
    const r = this.metadataHandler.diccModuleIntanceContext.structureProvider;
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
      TKeyDiccCtrlCRUD
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
    TKeyDiccCtrlCRUD
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
    TKeyDiccCtrlCRUD
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
  protected getATKeysForReq(
    keyPath: string
  ): TStructureCtrlModuleConfigForField<
    TFieldMutateInstance["dfDiccActionConfig"] &
      TFieldValInstance["dfDiccActionConfig"]
  >["aTKeysForReq"] {
    const config = this.getMetadataOnlyModuleConfig("fieldCtrl", keyPath);
    const aTKeysForReq = config.fieldCtrl.aTKeysForReq;
    return aTKeysForReq;
  }
  protected getDiccATKeyCRUD(
    keyPath: string
  ): TStructureCtrlModuleConfigForModel<
    TModelMutateInstance["dfDiccActionConfig"] &
      TModelValInstance["dfDiccActionConfig"] &
      TRequestValInstance["dfDiccActionConfig"] &
      TStructureHookInstance["dfDiccActionConfig"] &
      TStructureProviderInstance["dfDiccActionConfig"],
    TKeyDiccCtrlCRUD
  >["diccATKeyCRUD"] {
    const config = this.getMetadataOnlyModuleConfig("modelCtrl", keyPath);
    const diccATKeyCRUD = config.modelCtrl.diccATKeyCRUD;
    return diccATKeyCRUD;
  }
  public override buildCriteriaHandler(
    requestType: "read",
    base?: TStructureBaseCriteriaForCtrlRead<TModel>
  ): StructureCriteriaHandler<TModel>;
  public override buildCriteriaHandler(
    requestType: "modify",
    base?: TStructureBaseCriteriaForCtrlModify<TModel>
  ): StructureCriteriaHandler<TModel>;
  public override buildCriteriaHandler(
    requestType: TKeyRequestType, //❗Solo para tipar❗
    base?:
      | TStructureBaseCriteriaForCtrlRead<TModel>
      | TStructureBaseCriteriaForCtrlModify<TModel>
  ): StructureCriteriaHandler<TModel> {
    let cH = new StructureCriteriaHandler(this.keySrc, {
      ...base,
      type: requestType,
      keySrc: this.keySrc,
    });
    cH.metadataHandler = this.metadataHandler;
    return cH;
  }
  public override buildReportHandler(
    bag: Trf_StructureBag,
    keyAction: unknown
  ): StructureReportHandler {
    const { data, criteriaHandler, keyPath, firstData } = bag;
    const { type, modifyType, keyActionRequest } = criteriaHandler;
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
      fisrtCtrlData: firstData,
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
  /**costruye un literal bag controller en contexto de campo */
  public buildBagCtrl(
    keyBagCtrlContext: "fieldCtrl",
    baseBagCtrl: IStructureBagForFieldCtrlContext<
      TFieldMutateInstance["dfDiccActionConfig"],
      TFieldValInstance["dfDiccActionConfig"]
    >
  ): IStructureBagForFieldCtrlContext<
    TFieldMutateInstance["dfDiccActionConfig"],
    TFieldValInstance["dfDiccActionConfig"]
  >;
  /**costruye un literal bag controller en contexto de modelo */
  public buildBagCtrl(
    keyBagCtrlContext: "modelCtrl",
    baseBagCtrl: IStructureBagForModelCtrlContext<
      TModel,
      TStructureCriteriaInstance,
      TModelMutateInstance["dfDiccActionConfig"],
      TModelValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TStructureHookInstance["dfDiccActionConfig"],
      TStructureProviderInstance["dfDiccActionConfig"]
    > &
      //❗Obligatorias❗
      Pick<
        IStructureBagForModelCtrlContext<TModel, TStructureCriteriaInstance>,
        "data" | "criteriaHandler" | "keyPath"
      >
  ): IStructureBagForModelCtrlContext<
    TModel,
    TStructureCriteriaInstance,
    TModelMutateInstance["dfDiccActionConfig"],
    TModelValInstance["dfDiccActionConfig"],
    TRequestValInstance["dfDiccActionConfig"],
    TStructureHookInstance["dfDiccActionConfig"],
    TStructureProviderInstance["dfDiccActionConfig"]
  >;
  public buildBagCtrl(
    keyBagCtrlContext: TKeyStructureDeepCtrlModuleContext,
    baseBagCtrl: Trf_IStructureBagForCtrlContext
  ): Trf_IStructureBagForCtrlContext {
    const dfBC = this.getDefault().bagCtrl;
    const bBC = baseBagCtrl;
    let rBagCtrl: Trf_IStructureBagForCtrlContext;
    if (!this.util.isObject(bBC)) {
      rBagCtrl = {
        ...dfBC,
        criteriaHandler: this.buildCriteriaHandler("read"),
        keyPath: this.metadataHandler.keyModelPath,
      };
    } else {
      rBagCtrl = {
        data: bBC.data,
        keyPath:
          keyBagCtrlContext === "modelCtrl"
            ? this.metadataHandler.keyModelPath //❗❗El inicial de modelo❗❗
            : bBC.keyPath, //❗❗debe ser proporcionado❗❗
        criteriaHandler: this.util.isInstance(bBC.criteriaHandler)
          ? bBC.criteriaHandler
          : this.buildCriteriaHandler("read"),
        diccGlobalAC: this.util.isObject(bBC.diccGlobalAC)
          ? {
              ...bBC.diccGlobalAC,
              fieldMutate: this.util.isObject(bBC.diccGlobalAC.fieldMutate)
                ? bBC.diccGlobalAC.fieldMutate
                : dfBC.diccGlobalAC.fieldMutate,
              modelMutate: this.util.isObject(bBC.diccGlobalAC.modelMutate)
                ? bBC.diccGlobalAC.modelMutate
                : dfBC.diccGlobalAC.modelMutate,
              fieldVal: this.util.isObject(bBC.diccGlobalAC.fieldVal)
                ? bBC.diccGlobalAC.fieldVal
                : dfBC.diccGlobalAC.fieldVal,
              modelVal: this.util.isObject(bBC.diccGlobalAC.modelVal)
                ? bBC.diccGlobalAC.modelVal
                : dfBC.diccGlobalAC.modelVal,
              requestVal: this.util.isObject(bBC.diccGlobalAC.requestVal)
                ? bBC.diccGlobalAC.requestVal
                : dfBC.diccGlobalAC.requestVal,
              structureHook: this.util.isObject(bBC.diccGlobalAC.structureHook)
                ? bBC.diccGlobalAC.structureHook
                : dfBC.diccGlobalAC.structureHook,
            }
          : dfBC.diccGlobalAC,
      };
    }
    return rBagCtrl as any;
  }
  protected buildBag(
    keyBagDeepContext: TKeyStructureDeepBagModuleContext,
    bagCtrl: Trf_IStructureBagForCtrlContext,
    aTupleGlobalActionConfig: [string, [any, any]]
  ): StructureBag<
    TModel,
    TStructureCriteriaInstance,
    TFieldMutateInstance["dfDiccActionConfig"],
    TModelMutateInstance["dfDiccActionConfig"],
    TFieldValInstance["dfDiccActionConfig"],
    TModelValInstance["dfDiccActionConfig"],
    TRequestValInstance["dfDiccActionConfig"],
    TStructureHookInstance["dfDiccActionConfig"],
    TStructureProviderInstance["dfDiccActionConfig"]
  > {
    if (!this.util.isObject(bagCtrl)) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${bagCtrl} is not bag controller valid`,
      });
    }
    if (!this.util.isArrayTuple(aTupleGlobalActionConfig, [1, 2])) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${aTupleGlobalActionConfig} is not array of tuple of action config valid`,
      });
    }
    const { data, keyPath, criteriaHandler: criteriaCursor } = bagCtrl;
    const bag = new StructureBag(this.keySrc, keyBagDeepContext, {
      criteriaHandler: criteriaCursor,
      data,
      keyPath,
      keySrc: this.keySrc,
      aTupleGlobalActionConfig: aTupleGlobalActionConfig as any,
    });
    return bag as any;
  }
  protected override getActionConfigFromBagCtrl(
    bagCtrl: IStructureBagForModelCtrlContext<any>,
    keyModuleContext: keyof IStructureBagForModelCtrlContext<any>["diccGlobalAC"],
    keyAction: string
  ): any {
    let aC = undefined;
    if (!this.util.isLiteralObject(bagCtrl)) return aC;
    if (!this.util.isLiteralObject(bagCtrl.diccGlobalAC)) return aC;
    if (!this.util.isLiteralObject(bagCtrl.diccGlobalAC[keyModuleContext]))
      return aC;
    aC = bagCtrl.diccGlobalAC[keyModuleContext][keyAction];
    return aC;
  }
  protected override getDefaultBuilderACOption(): IBuildACOption {
    return {
      keyPath: this.metadataHandler.keyModelPath,
      mergeMode: "soft",
    };
  }
  protected buildATupleForRequestCtrlFromBagCtrl<
    TIDiccGlobalAC extends TFieldMutateInstance["dfDiccActionConfig"] &
      TFieldValInstance["dfDiccActionConfig"],
    TKeyAction extends keyof TIDiccGlobalAC = keyof TIDiccGlobalAC
  >(
    keyBagCtrlContext: "fieldCtrl", //❗❗solo para tipar retorno❗❗
    bagCtrl: IStructureBagForFieldCtrlContext<
      TFieldMutateInstance["dfDiccActionConfig"],
      TFieldValInstance["dfDiccActionConfig"]
    >,
    aTupleKeyModuleCAndAction: Array<
      [TKeyFieldInternalACModuleContext, TKeyAction]
    >
  ): Array<[string, [TKeyAction, TIDiccGlobalAC[TKeyAction]]]>;
  protected buildATupleForRequestCtrlFromBagCtrl<
    TIDiccGlobalAC = TModelMutateInstance["dfDiccActionConfig"] &
      TModelValInstance["dfDiccActionConfig"] &
      TRequestValInstance["dfDiccActionConfig"] &
      TStructureHookInstance["dfDiccActionConfig"] &
      TStructureProviderInstance["dfDiccActionConfig"],
    TKeyAction extends keyof TIDiccGlobalAC = keyof TIDiccGlobalAC
  >(
    keyBagCtrlContext: "modelCtrl", //❗❗solo para tipar retorno❗❗
    bagCtrl: IStructureBagForModelCtrlContext<
      TModel,
      TStructureCriteriaInstance,
      TModelMutateInstance["dfDiccActionConfig"],
      TModelValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TStructureHookInstance["dfDiccActionConfig"],
      TStructureProviderInstance["dfDiccActionConfig"]
    >,
    aTupleKeyModuleCAndAction: Array<
      [TKeyModelInternalACModuleContext, TKeyAction]
    >
  ): Array<[string, [TKeyAction, TIDiccGlobalAC[TKeyAction]]]>;
  protected buildATupleForRequestCtrlFromBagCtrl<
    TIDiccAC = TFieldMutateInstance["dfDiccActionConfig"] &
      TFieldValInstance["dfDiccActionConfig"] &
      TModelMutateInstance["dfDiccActionConfig"] &
      TModelValInstance["dfDiccActionConfig"] &
      TRequestValInstance["dfDiccActionConfig"] &
      TStructureHookInstance["dfDiccActionConfig"] &
      TStructureProviderInstance["dfDiccActionConfig"],
    TKeyAction extends keyof TIDiccAC = keyof TIDiccAC
  >(
    keyBagCtrlContext: TKeyStructureDeepCtrlModuleContext, //❗❗solo para tipar retorno❗❗
    bagCtrl: Trf_IStructureBagForCtrlContext,
    aTupleKeyModuleCAndAction: Array<
      [TKeyStructureInternalACModuleContext, TKeyAction]
    >
  ): Array<[string, [TKeyAction, TIDiccAC[TKeyAction]]]> {
    if (!this.util.isArrayTuple(aTupleKeyModuleCAndAction, 2, true)) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${aTupleKeyModuleCAndAction} is not array of tuple of module key and action key valid`,
      });
    }
    let bACOp = {
      ...this.getDefaultBuilderACOption(),
      keyPath: bagCtrl.keyPath,
    } as IBuildACOption;
    let aTGlobalAC: any[] = [];
    for (const itemAny of aTupleKeyModuleCAndAction) {
      const item = itemAny as [
        TKeyStructureInternalACModuleContext,
        TKeyAction
      ];
      const keyModuleContext = item[0];
      const keyAction = item[1];
      let actionModule: ActionModule<any>;
      if (keyModuleContext === "fieldMutate")
        actionModule = this.fieldMutateModuleInstance;
      else if (keyModuleContext === "modelMutate")
        actionModule = this.modelMutateModuleInstance;
      else if (keyModuleContext === "fieldVal")
        actionModule = this.fieldValModuleInstance;
      else if (keyModuleContext === "modelVal")
        actionModule = this.modelValModuleInstance;
      else if (keyModuleContext === "requestVal")
        actionModule = this.requestValModuleInstance;
      else if (keyModuleContext === "structureHook")
        actionModule = this.structureHookModuleInstance;
      else if (keyModuleContext === "structureProvider")
        actionModule = this.structureProviderModuleInstance as any;
      else {
        throw new LogicError({
          code: ELogicCodeError.MODULE_ERROR,
          msn: `${keyModuleContext} is not key module context valid`,
        });
      }
      const tupleGAC = this.buildTupleACFromBagCtrl(
        bagCtrl,
        actionModule,
        keyModuleContext,
        keyAction,
        bACOp
      ) as [string, [any, any]];
      aTGlobalAC.push(tupleGAC);
    }
    return aTGlobalAC;
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
    const {
      fieldMutate: mFM,
      modelMutate: mMM,
      fieldVal: mFV,
      modelVal: mMV,
      requestVal: mRV,
      structureHook: mSH,
      structureProvider: mSP,
    } = this.metadataHandler.diccModuleIntanceContext;
    let keyCtrlAction: EKeyActionGroupForRes;
    if (keyBagCtrlContext === "fieldCtrl") {
      keyCtrlAction = EKeyActionGroupForRes.ctrlField;
    } else if (keyBagCtrlContext === "modelCtrl") {
      keyCtrlAction = EKeyActionGroupForRes.ctrlModel;
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${keyBagCtrlContext} is not key bag controller context valid`,
      });
    }
    this.preRunAction(bag, keyCtrlAction) as any;
    const rH = this.buildReportHandler(bag, keyCtrlAction);
    let res = rH.mutateResponse(undefined, { data: bag.data });
    for (const tGAC of bag.aTupleGlobalActionConfig) {
      const { keyModule, keyModuleContext, keyAction } =
        bag.getDiccKeysGlobalFromTupleGlobal(tGAC);
      let resForAction: IStructureResponse;
      let mFX: ActionModule<any>;
      if (keyModuleContext === "fieldMutate") mFX = mFM;
      else if (keyModuleContext === "fieldVal") mFX = mFV;
      else if (keyModuleContext === "modelMutate") mFX = mMM;
      else if (keyModuleContext === "modelVal") mFX = mMV;
      else if (keyModuleContext === "requestVal") mFX = mRV;
      else if (keyModuleContext === "structureHook") mFX = mSH;
      else if (keyModuleContext === "structureProvider")
        mFX = mSP as any; //provider es un modulo de accion especial
      else {
        throw new LogicError({
          code: ELogicCodeError.MODULE_ERROR,
          msn: `${keyModuleContext} is not key action module context valid`,
        });
      }
      if (this.isAllowRunAction(tGAC)) {
        resForAction = await this.runRequestForAction(mFX, bag, keyAction);
        res.responses.push(resForAction);
      }
    }
    res = rH.mutateResponse(res, { data: bag.data });
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
  //████ Acciones de peticion ████████████████████████████████████████████████████████████
  /**... */
  public async runGenericFieldRequest(
    bagCtrl: IStructureBagForFieldCtrlContext<
      TFieldMutateInstance["dfDiccActionConfig"],
      TFieldValInstance["dfDiccActionConfig"]
    >
  ): Promise<IStructureResponse> {
    bagCtrl = this.buildBagCtrl("fieldCtrl", bagCtrl); //reconstruccion OBLIGATORIA
    const aTKeyGlobal = this.getATKeysForReq(bagCtrl.keyPath);
    const aTGlobalAC = this.buildATupleForRequestCtrlFromBagCtrl(
      "fieldCtrl",
      bagCtrl,
      aTKeyGlobal
    );
    let bag = this.buildBag("fieldBag", bagCtrl, aTGlobalAC as any);
    const r = await this.runRequest("fieldCtrl", bag);
    return r;
  }
  /**... */
  public async runGenericModelRequest(
    keyActionRequest: TKeyDiccCtrlCRUD,
    bagCtrl: IStructureBagForModelCtrlContext<
      TModel,
      TStructureCriteriaInstance,
      TModelMutateInstance["dfDiccActionConfig"],
      TModelValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TStructureHookInstance["dfDiccActionConfig"],
      TStructureProviderInstance["dfDiccActionConfig"]
    >
  ): Promise<IStructureResponse> {
    if (!this.util.isString(keyActionRequest)) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${keyActionRequest} is not request action key valid`,
      });
    }
    bagCtrl = this.buildBagCtrl("modelCtrl", bagCtrl); //reconstruccion OBLIGATORIA
    bagCtrl.criteriaHandler.keyActionRequest = keyActionRequest;
    const schemaATKeyGlobal = this.getDiccATKeyCRUD(bagCtrl.keyPath);
    const aTKeyGlobal = schemaATKeyGlobal[keyActionRequest];
    const aTGlobalAC = this.buildATupleForRequestCtrlFromBagCtrl(
      "modelCtrl",
      bagCtrl,
      aTKeyGlobal
    );
    let bag = this.buildBag("modelBag", bagCtrl, aTGlobalAC as any);
    const r = await this.runRequest("modelCtrl", bag);
    return r;
  }
  public async readAll(
    bagCtrl: IStructureBagForModelCtrlContext<
      TModel,
      TStructureCriteriaInstance,
      TModelMutateInstance["dfDiccActionConfig"],
      TModelValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TStructureHookInstance["dfDiccActionConfig"],
      TStructureProviderInstance["dfDiccActionConfig"]
    >
  ): Promise<IStructureResponse> {
    const keyActionRequest: TKeyStructureReadRequestController = "readAll";
    //criterios obligatorios para esta accion de peticion
    bagCtrl.criteriaHandler.mutateProps({
      type: "read",
      keyActionRequest,
      query: [], //se leen todos (no hay condicion de filtrador)
      expectedDataType: "array",
    });
    const res = await this.runGenericModelRequest(
      keyActionRequest as any,
      bagCtrl
    );
    return res;
  }
  public async readMany(
    bagCtrl: IStructureBagForModelCtrlContext<
      TModel,
      TStructureCriteriaInstance,
      TModelMutateInstance["dfDiccActionConfig"],
      TModelValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TStructureHookInstance["dfDiccActionConfig"],
      TStructureProviderInstance["dfDiccActionConfig"]
    >
  ): Promise<IStructureResponse> {
    const keyActionRequest: TKeyStructureReadRequestController = "readMany";
    //criterios obligatorios para esta accion de peticion
    bagCtrl.criteriaHandler.mutateProps({
      type: "read",
      keyActionRequest,
      expectedDataType: "array",
    });
    const res = await this.runGenericModelRequest(
      keyActionRequest as any,
      bagCtrl
    );
    return res;
  }
  public async readOne(
    bagCtrl: IStructureBagForModelCtrlContext<
      TModel,
      TStructureCriteriaInstance,
      TModelMutateInstance["dfDiccActionConfig"],
      TModelValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TStructureHookInstance["dfDiccActionConfig"],
      TStructureProviderInstance["dfDiccActionConfig"]
    >
  ): Promise<IStructureResponse> {
    const keyActionRequest: TKeyStructureReadRequestController = "readMany";
    //criterios obligatorios para esta accion de peticion
    bagCtrl.criteriaHandler.mutateProps({
      type: "read",
      keyActionRequest,
      expectedDataType: "object", //se espera solo un literal (modelo)
      limit: 1,
      sort: [],
    });
    const res = await this.runGenericModelRequest(
      keyActionRequest as any,
      bagCtrl
    );
    return res;
  }
  public async readById(
    bagCtrl: IStructureBagForModelCtrlContext<
      TModel,
      TStructureCriteriaInstance,
      TModelMutateInstance["dfDiccActionConfig"],
      TModelValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TStructureHookInstance["dfDiccActionConfig"],
      TStructureProviderInstance["dfDiccActionConfig"]
    >
  ): Promise<IStructureResponse> {
    const keyActionRequest: TKeyStructureReadRequestController = "readMany";
    //criterios obligatorios para esta accion de peticion
    const key_id = "_id" as keyof Model;
    const find_id = bagCtrl.data[key_id];
    bagCtrl.criteriaHandler.mutateProps({
      type: "read",
      keyActionRequest,
      expectedDataType: "object", //se espera solo un literal (modelo)
      limit: 1,
      sort: [],
      query: [{ op: ELogicOperatorForCondition.eq, vCond: find_id }],
    });
    const res = await this.runGenericModelRequest(
      keyActionRequest as any,
      bagCtrl
    );
    return res;
  }
  public async create(
    bagCtrl: IStructureBagForModelCtrlContext<
      TModel,
      TStructureCriteriaInstance,
      TModelMutateInstance["dfDiccActionConfig"],
      TModelValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TStructureHookInstance["dfDiccActionConfig"],
      TStructureProviderInstance["dfDiccActionConfig"]
    >
  ): Promise<IStructureResponse> {
    const keyActionRequest: TKeyStructureModifyRequestController = "create";
    //criterios obligatorios para esta accion de peticion
    bagCtrl.criteriaHandler.mutateProps({
      type: "modify",
      modifyType: "create",
      keyActionRequest,
      expectedDataType: "object",
    });
    const res = await this.runGenericModelRequest(
      keyActionRequest as any,
      bagCtrl
    );
    return res;
  }
  public async update(
    bagCtrl: IStructureBagForModelCtrlContext<
      TModel,
      TStructureCriteriaInstance,
      TModelMutateInstance["dfDiccActionConfig"],
      TModelValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TStructureHookInstance["dfDiccActionConfig"],
      TStructureProviderInstance["dfDiccActionConfig"]
    >
  ): Promise<IStructureResponse> {
    const keyActionRequest: TKeyStructureModifyRequestController = "update";
    //criterios obligatorios para esta accion de peticion
    bagCtrl.criteriaHandler.mutateProps({
      type: "modify",
      modifyType: "update",
      keyActionRequest,
      expectedDataType: "object",
    });
    const res = await this.runGenericModelRequest(
      keyActionRequest as any,
      bagCtrl
    );
    return res;
  }
  public async delete(
    bagCtrl: IStructureBagForModelCtrlContext<
      TModel,
      TStructureCriteriaInstance,
      TModelMutateInstance["dfDiccActionConfig"],
      TModelValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TStructureHookInstance["dfDiccActionConfig"],
      TStructureProviderInstance["dfDiccActionConfig"]
    >
  ): Promise<IStructureResponse> {
    const keyActionRequest: TKeyStructureModifyRequestController = "delete";
    //criterios obligatorios para esta accion de peticion
    bagCtrl.criteriaHandler.mutateProps({
      type: "modify",
      modifyType: "delete",
      keyActionRequest,
      expectedDataType: "object",
    });
    const res = await this.runGenericModelRequest(
      keyActionRequest as any,
      bagCtrl
    );
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
