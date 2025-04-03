import { LogicController } from "./_controller";
import {
  TFieldConfigForCtrl,
  TKeyStructureCtrlModuleContext,
  TKeyStructureDeepCtrlModuleContext,
  TKeyStructureModifyRequestCtrl,
  TKeyStructureReadRequestCtrl,
  TModelConfigForCtrl,
} from "./shared";
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
import { StructureBag, Trf_StructureBag } from "../bag/structure-bag";
import { ActionModule } from "../config/module";
import { IStructureBuilderBaseCtrl } from "./builder-ctrl-shared";
import { StructureLogicHook } from "../hooks/structure-hook";
import { StructureCriteriaHandler } from "../criterias/structure-criteria-handler";
import { StructureLogicProvider } from "../providers/structure-provider";
import { ELogicCodeError, LogicError } from "../errors/logic-error";
import {
  TKeyStructureInternalACModuleContext,
  Trf_TStructureFieldMetaAndCtrl,
  Trf_TStructureMetaAndCtrl,
  TStructureFieldMetaAndCtrl,
  TStructureMetaAndCtrl,
} from "../meta/metadata-shared";
import {
  TStructureFieldBaseCriteria,
  TStructureModelBaseCriteria,
  TStructureModelBaseModifyCriteria,
  TStructureModelBaseReadCriteria,
} from "../criterias/shared";
import { Model } from "../models/_model";
import { TCapitalizeFirstLetter } from "../../util/shared";
import { TFnBagForActionModule } from "../bag/shared";
import { Module } from "../config/module";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
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
    | TKeyStructureModifyRequestCtrl,
  TStructureCriteriaInstance extends StructureCriteriaHandler<
    TModel,
    TFieldMutateInstance["dfDiccActionConfig"],
    TModelMutateInstance["dfDiccActionConfig"],
    TFieldValInstance["dfDiccActionConfig"],
    TModelValInstance["dfDiccActionConfig"],
    TRequestValInstance["dfDiccActionConfig"],
    TStructureHookInstance["dfDiccActionConfig"],
    TStructureProviderInstance["dfDiccActionConfig"],
    TKeyDiccActionRequest
  > = StructureCriteriaHandler<
    TModel,
    TFieldMutateInstance["dfDiccActionConfig"],
    TModelMutateInstance["dfDiccActionConfig"],
    TFieldValInstance["dfDiccActionConfig"],
    TModelValInstance["dfDiccActionConfig"],
    TRequestValInstance["dfDiccActionConfig"],
    TStructureHookInstance["dfDiccActionConfig"],
    TStructureProviderInstance["dfDiccActionConfig"],
    TKeyDiccActionRequest
  >
> extends LogicController {
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
  protected get fieldMutateModuleInstance() {
    const r = this.metadataHandler.diccModuleInstanceContext.fieldMutate;
    return r;
  }
  /**... */
  protected get modelMutateModuleInstance() {
    const r = this.metadataHandler.diccModuleInstanceContext.modelMutate;
    return r;
  }
  /**... */
  protected get fieldValModuleInstance() {
    const r = this.metadataHandler.diccModuleInstanceContext.fieldVal;
    return r;
  }
  /**... */
  protected get modelValModuleInstance() {
    const r = this.metadataHandler.diccModuleInstanceContext.modelVal;
    return r;
  }
  /**... */
  protected get requestValModuleInstance() {
    const r = this.metadataHandler.diccModuleInstanceContext.requestVal;
    return r;
  }
  /**... */
  protected get structureHookModuleInstance() {
    const r = this.metadataHandler.diccModuleInstanceContext.structureHook;
    return r;
  }
  /**... */
  protected get structureProviderModuleInstance() {
    const r = this.metadataHandler.diccModuleInstanceContext.structureProvider;
    return r;
  }
  /**
   * @param baseConfigMetadata configuracion base de metadatos
   * (es un objeto literal no el manejador)
   */
  constructor(
    baseConfigMetadata: IStructureBuilderBaseCtrl<
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
    super("structure", baseConfigMetadata);
    this.metadataHandler = new StructureLogicMetadataHandler(
      baseConfigMetadata
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
    //estática obligatoria
    keyModuleDeepContext: TKeyStructureDeepCtrlModuleContext,
    currentContextConfig: unknown,
    newContextConfig: unknown
  ): unknown {
    const util = Module.util;
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
          criteriaRequestConfig:
            StructureLogicController.rebuildCustomActionRequestConfigForField(
              nCC.criteriaRequestConfig as any,
              cCC.criteriaRequestConfig as any
            ),
        };
      }
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
          diccCriteriaRequestConfig:
            StructureLogicController.rebuildCustomDiccCriteriaRequestConfig(
              nCC.diccCriteriaRequestConfig as any,
              cCC.diccCriteriaRequestConfig as any
            ),
        };
      }
      rConfig = rModelConfig;
    } else {
      throw new LogicError({
        code: ELogicCodeError.NOT_VALID,
        msn: `${keyModuleDeepContext} is not deep module context key valid`,
      });
    }
    //...aquí configuración refinada:
    return rConfig;
  }
  /**... */
  protected static rebuildCustomDiccCriteriaRequestConfig(
    currentDiccCRC: TModelConfigForCtrl["modelCtrl"]["diccCriteriaRequestConfig"],
    newDiccCRC: TModelConfigForCtrl["modelCtrl"]["diccCriteriaRequestConfig"]
  ): TModelConfigForCtrl["modelCtrl"]["diccCriteriaRequestConfig"] {
    const util = Module.util;
    const keysCCRC = util.isObject(currentDiccCRC)
      ? Object.keys(currentDiccCRC)
      : [];
    const keysNCRC = util.isObject(newDiccCRC) ? Object.keys(newDiccCRC) : [];
    if (keysCCRC.length === 0 && keysNCRC.length === 0) return {};
    const keysMerged = util.removeArrayDuplicate([...keysCCRC, ...keysNCRC], {
      itemConflictMode: "last",
    });
    let diccCRC =
      {} as TModelConfigForCtrl["modelCtrl"]["diccCriteriaRequestConfig"];
    for (const keyCRC of keysMerged) {
      const cCRC = currentDiccCRC[keyCRC];
      const nCRC = newDiccCRC[keyCRC];
      diccCRC[keyCRC] =
        StructureCriteriaHandler.rebuildCustomConfigFromModuleContext(
          "structureModel",
          cCRC as any,
          nCRC as any
        );
    }
    return diccCRC;
  }
  /**... */
  protected static rebuildCustomActionRequestConfigForField(
    currentCRC: TStructureFieldBaseCriteria<any>,
    newCRC: TStructureFieldBaseCriteria<any>
  ): TStructureFieldBaseCriteria<any> {
    const util = Module.util;
    const cCRC = currentCRC;
    const nCRC = newCRC;
    let cRC = StructureCriteriaHandler.rebuildCustomConfigFromModuleContext(
      "structureField",
      cCRC as any,
      nCRC as any
    ) as TStructureFieldBaseCriteria<any>;
    return cRC;
  }
  public override getDiccModuleInstance() {
    return super.getDiccModuleInstance() as typeof this.metadataHandler.diccModuleInstanceContext;
  }
  protected getMetadataWithContextModule(
    keyModuleDeepContext: "fieldCtrl",
    keyPath: string
  ): TStructureFieldMetaAndCtrl<TFieldMutateInstance, TFieldValInstance>;
  protected getMetadataWithContextModule(
    keyModuleDeepContext: "modelCtrl",
    keyPath: string
  ): TStructureMetaAndCtrl<
    TModel,
    TModelMutateInstance,
    TModelValInstance,
    TRequestValInstance,
    TStructureHookInstance,
    TStructureProviderInstance,
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
  ): TFieldConfigForCtrl<TFieldMutateInstance & TFieldValInstance>;
  protected getMetadataOnlyModuleConfig(
    keyModuleDeepContext: "modelCtrl",
    keyPath: string
  ): TModelConfigForCtrl<
    TModelMutateInstance,
    TModelValInstance,
    TRequestValInstance,
    TStructureHookInstance,
    TStructureProviderInstance,
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
  private getKeyPathForField(keyField: keyof TModel): string {
    const mH = this.metadataHandler;
    const sp = this.util.charSeparatorLogicPath;
    const keyPathForField = `${mH.keyModelPath}${sp}${keyField as string}`;
    return keyPathForField;
  }
  protected override buildReportHandler(
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
  protected override preRunAction(
    bag: Trf_StructureBag,
    keyAction: unknown
  ): void {
    super.preRunAction(bag, keyAction) as any;
    return;
  }
  protected override postRunAction(
    bag: Trf_StructureBag,
    res: IStructureResponse
  ): void {
    super.postRunAction(bag, res) as any;
    return;
  }
  /**... */
  public getEmptyBaseModelCritera():
    | TStructureModelBaseReadCriteria<
        TModel,
        TModelMutateInstance["dfDiccActionConfig"],
        TModelValInstance["dfDiccActionConfig"],
        TRequestValInstance["dfDiccActionConfig"],
        TStructureHookInstance["dfDiccActionConfig"],
        TStructureProviderInstance["dfDiccActionConfig"],
        TKeyDiccActionRequest
      >
    | TStructureModelBaseModifyCriteria<
        TModel,
        TModelMutateInstance["dfDiccActionConfig"],
        TModelValInstance["dfDiccActionConfig"],
        TRequestValInstance["dfDiccActionConfig"],
        TStructureHookInstance["dfDiccActionConfig"],
        TStructureProviderInstance["dfDiccActionConfig"],
        TKeyDiccActionRequest
      > {
    return {}; //vació, solo se necesita el tipado, posiblemente se convierta a cursor
  }
  //████ runs commons ████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
  protected async runCommonFieldCheck(
    keyPath: string,
    data: any,
    baseCriteria: TStructureFieldBaseCriteria<
      TModel,
      TFieldMutateInstance["dfDiccActionConfig"],
      TFieldValInstance["dfDiccActionConfig"]
    >
  ): Promise<IStructureResponse> {
    const mH = this.metadataHandler;
    const cH = new StructureCriteriaHandler(mH, "structureField", {
      ...(baseCriteria as any),
      keyPath,
    });
    let bag = new StructureBag(this.keySrc, "fieldBag", {
      data,
      criteriaHandler: cH as any,
    });
    const res = (await this.runActionRequest(
      this as any as ActionModule<any>,
      bag,
      undefined //en controller la acción es interna
    )) as IStructureResponse;
    return res;
  }
  /** */
  protected async runCommonRequest(
    keyActionRequest: TKeyDiccActionRequest,
    data: TModel,
    baseCriteria:
      | TStructureModelBaseReadCriteria<
          TModel,
          TModelMutateInstance["dfDiccActionConfig"],
          TModelValInstance["dfDiccActionConfig"],
          TRequestValInstance["dfDiccActionConfig"],
          TStructureHookInstance["dfDiccActionConfig"],
          TStructureProviderInstance["dfDiccActionConfig"],
          TKeyDiccActionRequest
        >
      | TStructureModelBaseModifyCriteria<
          TModel,
          TModelMutateInstance["dfDiccActionConfig"],
          TModelValInstance["dfDiccActionConfig"],
          TRequestValInstance["dfDiccActionConfig"],
          TStructureHookInstance["dfDiccActionConfig"],
          TStructureProviderInstance["dfDiccActionConfig"],
          TKeyDiccActionRequest
        >
  ): Promise<IStructureResponse> {
    const mH = this.metadataHandler;
    const cH = new StructureCriteriaHandler(mH, "structureModel", {
      ...(baseCriteria as any),
      keyPath: mH.keyModelPath,
      keyActionRequest, //❗Obligatorio❗
    });
    let bag = new StructureBag<
      TModel,
      any,
      TModelMutateInstance["dfDiccActionConfig"],
      any,
      TModelValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TStructureHookInstance["dfDiccActionConfig"],
      TStructureProviderInstance["dfDiccActionConfig"],
      TStructureCriteriaInstance
    >(this.keySrc, "modelBag", {
      data,
      criteriaHandler: cH as any,
    });
    const res = (await this.runActionRequest(
      this as any as ActionModule<any>,
      bag,
      undefined //en controller la acción es interna
    )) as IStructureResponse;
    return res;
  }
  //====Accion especial para controller============================================================
  protected override actionCtrl: TFnBagForActionModule = async (
    bag: StructureBag<any>
  ) => {
    const { data, criteriaHandler } = bag;
    const { keyStructureContext, aTKeysGlobalActionConfig, diccGlobalAC } =
      criteriaHandler;
    let keyActionForCtrl: EKeyActionGroupForRes;
    if (keyStructureContext === "structureField")
      keyActionForCtrl = EKeyActionGroupForRes.ctrlField;
    else if (keyStructureContext === "structureEmbedded")
      keyActionForCtrl = EKeyActionGroupForRes.ctrlModel;
    else if (keyStructureContext === "structureModel")
      keyActionForCtrl = EKeyActionGroupForRes.ctrlModel;
    else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${keyStructureContext} is not structure key context valid`,
      });
    }
    const rH = this.buildReportHandler(bag, keyActionForCtrl);
    let res = rH.mutateResponse(undefined, { data });
    //verificar si hay acciones para ejecutar
    if (aTKeysGlobalActionConfig.length === 0) {
      res = rH.mutateResponse(res, {
        status: ELogicResStatusCode.WARNING,
        msn: `${aTKeysGlobalActionConfig} is array of global action config empty`,
      });
      return res;
    }
    for (const tKeyGAC of aTKeysGlobalActionConfig) {
      const [keyModuleContext, keyAction] = tKeyGAC;
      const mFX = this.metadataHandler.getModuleInstanceForActionContext(
        keyModuleContext as TKeyStructureInternalACModuleContext
      );
      if (this.isAllowRunAction(tKeyGAC, diccGlobalAC as object)) {
        const resForAction = (await this.runActionRequest(
          mFX,
          bag,
          keyAction
        )) as IStructureResponse;
        res.responses.push(resForAction);
        if (resForAction.status > this.globalTolerance) break;
      }
    }
    res = rH.mutateResponse(res);
    return res;
  };
  //████ REQUEST disponibles ████████████████████████████████████████████████████████████
  /**... */
  public async checkField(
    keyField: keyof TModel,
    value: TModel[typeof keyField],
    baseCriteria: TStructureFieldBaseCriteria<
      TModel,
      TFieldMutateInstance["dfDiccActionConfig"],
      TFieldValInstance["dfDiccActionConfig"]
    >
  ): Promise<IStructureResponse> {
    let keyPathForField = this.getKeyPathForField(keyField);
    const res = await this.runCommonFieldCheck(
      keyPathForField,
      value,
      baseCriteria
    );
    return res;
  }
  /**... */
  public async readRequest(
    keyActionRequest: TKeyDiccActionRequest,
    baseCriteria?: TStructureModelBaseReadCriteria<
      TModel,
      TModelMutateInstance["dfDiccActionConfig"],
      TModelValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TStructureHookInstance["dfDiccActionConfig"],
      TStructureProviderInstance["dfDiccActionConfig"],
      TKeyDiccActionRequest
    >
  ): Promise<IStructureResponse> {
    const res = await this.runCommonRequest(
      keyActionRequest,
      this.util.dfValue,
      baseCriteria
    );
    return res;
  }
  /**... */
  public async modifyRequest(
    keyActionRequest: TKeyDiccActionRequest,
    data: Partial<TModel>,
    baseCriteria?: TStructureModelBaseModifyCriteria<
      TModel,
      TModelMutateInstance["dfDiccActionConfig"],
      TModelValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TStructureHookInstance["dfDiccActionConfig"],
      TStructureProviderInstance["dfDiccActionConfig"],
      TKeyDiccActionRequest
    >
  ): Promise<IStructureResponse> {
    const res = await this.runCommonRequest(
      keyActionRequest,
      data as TModel,
      baseCriteria
    );
    return res;
  }
}
