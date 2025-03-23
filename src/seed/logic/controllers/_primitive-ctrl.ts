import {
  LogicController,
  TKeyModifyRequestController,
  TKeyReadRequestController,
} from "./_controller";
import { PrimitiveBag, Trf_PrimitiveBag } from "../bag/primitive-bag";
import { ActionModule, Module } from "../config/module";
import { IPrimitiveBuilderBaseMetadata } from "../meta/builder-shared";
import { PrimitiveLogicMutater } from "../mutaters/primitive-mutater";
import { PrimitiveLogicValidation } from "../validators/primitive-validation";
import { RequestLogicValidation } from "../validators/request-validation";
import { PrimitiveLogicHook } from "../hooks/primitive-hook";
import {
  EKeyActionGroupForRes,
  ELogicResStatusCode,
  IPrimitiveResponse,
} from "../reports/shared";
import {
  PrimitiveLogicMetadataHandler,
  Trf_PrimitiveLogicMetadataHandler,
} from "../meta/primitive-metadata-handler";
import { PrimitiveReportHandler } from "../reports/primitive-report-handler";
import {
  TKeyPrimitiveCtrlModuleContext,
  TPrimitiveConfigForCtrl,
  TPrimitiveCtrlActionFn,
} from "./shared";
import { PrimitiveCriteriaHandler } from "../criterias/primitive-criteria-handler";
import { PrimitiveLogicProvider } from "../providers/primitive-provider";
import {
  TKeyPrimitiveInternalACModuleContext,
  TPrimitiveMetaAndCtrl,
} from "../meta/metadata-shared";
import {
  TPrimitiveBaseModifyCriteria,
  TPrimitiveBaseReadCriteria,
} from "../criterias/shared";
import { TFnBagForActionModule } from "../bag/shared";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
export type TKeyPrimitiveReadRequestController = TKeyReadRequestController;
export type TKeyPrimitiveModifyRequestController = TKeyModifyRequestController;
/**tipado refactorizado de la clase*/
export type Trf_PrimitiveLogicController = PrimitiveLogicController<any>;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**... */
export abstract class PrimitiveLogicController<
    TValue,
    TPrimitiveCriteriaInstance extends PrimitiveCriteriaHandler<TValue> = PrimitiveCriteriaHandler<TValue>,
    TPrimitiveMutateInstance extends PrimitiveLogicMutater = PrimitiveLogicMutater,
    TPrimitiveValInstance extends PrimitiveLogicValidation = PrimitiveLogicValidation,
    TRequestValInstance extends RequestLogicValidation = RequestLogicValidation,
    TPrimitiveHookInstance extends PrimitiveLogicHook = PrimitiveLogicHook,
    TPrimitiveProviderInstance extends PrimitiveLogicProvider = PrimitiveLogicProvider,
    TKeyDiccActionRequest extends
      | TKeyPrimitiveReadRequestController
      | TKeyPrimitiveModifyRequestController =
      | TKeyPrimitiveReadRequestController
      | TKeyPrimitiveModifyRequestController
  >
  extends LogicController
  implements
    Record<
      TKeyPrimitiveReadRequestController | TKeyPrimitiveModifyRequestController,
      TPrimitiveCtrlActionFn<
        TValue,
        TPrimitiveMutateInstance,
        TPrimitiveValInstance,
        TRequestValInstance,
        TPrimitiveHookInstance,
        TPrimitiveProviderInstance
      >
    >
{
  public static override getDefault = () => {
    const superDf = LogicController.getDefault();
    return {
      ...superDf,
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
  /**... */
  protected get primitiveMutateModuleInstance() {
    const r = this.metadataHandler.diccModuleInstanceContext.primitiveMutate;
    return r;
  }
  /**... */
  protected get primitiveValModuleInstance() {
    const r = this.metadataHandler.diccModuleInstanceContext.primitiveVal;
    return r;
  }
  /**... */
  protected get requestValModuleInstance() {
    const r = this.metadataHandler.diccModuleInstanceContext.requestVal;
    return r;
  }
  /**... */
  protected get primitiveHookModuleInstance() {
    const r = this.metadataHandler.diccModuleInstanceContext.primitiveHook;
    return r;
  }
  /**... */
  protected get primitiveProviderModuleInstance() {
    const r = this.metadataHandler.diccModuleInstanceContext.primitiveProvider;
    return r;
  }
  /**
   * @param baseConfigMetadata configuracion base de metadatos
   * (es un objeto literal no el manejador)
   */
  constructor(
    baseConfigMetadata: IPrimitiveBuilderBaseMetadata<
      TValue,
      TPrimitiveMutateInstance,
      TPrimitiveValInstance,
      TRequestValInstance,
      TPrimitiveHookInstance,
      TPrimitiveProviderInstance,
      TKeyDiccActionRequest
    >
  ) {
    super("primitive", baseConfigMetadata);
    this.metadataHandler = new PrimitiveLogicMetadataHandler(
      baseConfigMetadata
    );
  }
  protected override getDefault() {
    return PrimitiveLogicController.getDefault();
  }
  public static rebuildCustomConfigFromModuleContext(
    //estática obligatoria
    currentContextConfig: TPrimitiveConfigForCtrl<any, any>["primitiveCtrl"],
    newContextConfig: TPrimitiveConfigForCtrl<any, any>["primitiveCtrl"]
  ): TPrimitiveConfigForCtrl<any, any>["primitiveCtrl"] {
    const util = Module.util;
    let rConfig: TPrimitiveConfigForCtrl<any, any>["primitiveCtrl"];
    const cCC = currentContextConfig;
    const nCC = newContextConfig;
    if (!util.isObject(nCC)) {
      rConfig = cCC;
    } else {
      rConfig = {
        ...nCC,
        diccCriteriaRequestConfig:
          PrimitiveLogicController.rebuildCustomDiccActionRequestConfig(
            nCC.diccCriteriaRequestConfig as any,
            cCC.diccCriteriaRequestConfig as any
          ),
      };
    }
    //reordenar tuplas de diccionario global
    //...falta
    //...aqui configuracion refinada:
    return rConfig;
  }
  /**... */
  protected static rebuildCustomDiccActionRequestConfig(
    currentDiccCRC: TPrimitiveConfigForCtrl["primitiveCtrl"]["diccCriteriaRequestConfig"],
    newDiccCRC: TPrimitiveConfigForCtrl["primitiveCtrl"]["diccCriteriaRequestConfig"]
  ): TPrimitiveConfigForCtrl["primitiveCtrl"]["diccCriteriaRequestConfig"] {
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
      {} as TPrimitiveConfigForCtrl["primitiveCtrl"]["diccCriteriaRequestConfig"];
    for (const keyCRC of keysMerged) {
      const cCRC = currentDiccCRC[keyCRC];
      const newCRC = newDiccCRC[keyCRC];
      diccCRC[keyCRC] =
        PrimitiveCriteriaHandler.rebuildCustomConfigFromModuleContext(
          cCRC as any,
          newCRC as any
        ) as any;
    }
    return diccCRC;
  }
  public override getDiccModuleInstance() {
    return super.getDiccModuleInstance() as typeof this.metadataHandler.diccModuleInstanceContext;
  }
  protected getMetadataWithContextModule(): TPrimitiveMetaAndCtrl<
    TPrimitiveMutateInstance,
    TPrimitiveValInstance,
    TRequestValInstance,
    TPrimitiveHookInstance,
    TPrimitiveProviderInstance,
    TKeyDiccActionRequest
  > {
    let extractMetadataByContext =
      this.metadataHandler.getExtractMetadataByModuleContext(
        "controller"
      ) as any;
    return extractMetadataByContext;
  }
  protected getMetadataOnlyModuleConfig(): TPrimitiveConfigForCtrl<
    TPrimitiveMutateInstance,
    TPrimitiveValInstance,
    TRequestValInstance,
    TPrimitiveHookInstance,
    TPrimitiveProviderInstance,
    TKeyDiccActionRequest
  > {
    const metadata = this.getMetadataWithContextModule();
    const metadataInPrimitive = metadata;
    const config = metadataInPrimitive.__ctrlConfig;
    return config;
  }
  protected override getActionRequestFn(
    keyActionRequest: TKeyDiccActionRequest
  ): TPrimitiveCtrlActionFn<
    TValue,
    TPrimitiveMutateInstance,
    TPrimitiveValInstance,
    TRequestValInstance,
    TPrimitiveHookInstance,
    TPrimitiveProviderInstance
  > {
    return super.getActionRequestFn(keyActionRequest) as any;
  }
  protected override buildReportHandler(
    bag: Trf_PrimitiveBag,
    keyAction: unknown
  ): PrimitiveReportHandler {
    const { data, criteriaHandler, firstData } = bag;
    const { type, modifyType, keyActionRequest } = criteriaHandler;
    let rH = new PrimitiveReportHandler(this.keySrc, {
      keyRepModule: this.keyModule as any,
      keyRepModuleContext: this.keyModuleContext,
      keyRepLogicContext: this.keyLogicContext,
      keyActionRequest: keyActionRequest,
      keyAction: keyAction as any,
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
  protected override preRunAction(
    bag: Trf_PrimitiveBag,
    keyAction: unknown
  ): void {
    super.preRunAction(bag, keyAction as any) as any;
    return;
  }
  protected override postRunAction(
    bag: Trf_PrimitiveBag,
    res: IPrimitiveResponse
  ): void {
    super.postRunAction(bag, res) as any;
    return;
  }
  //████ runs commons ████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
  /**... */
  protected async runCommonPrimitiveRequest(
    keyActionRequest: TKeyDiccActionRequest,
    data: TValue,
    baseCriteria:
      | TPrimitiveBaseReadCriteria<
          TPrimitiveMutateInstance["dfDiccActionConfig"],
          TPrimitiveValInstance["dfDiccActionConfig"],
          TRequestValInstance["dfDiccActionConfig"],
          TPrimitiveHookInstance["dfDiccActionConfig"],
          TPrimitiveProviderInstance["dfDiccActionConfig"],
          TKeyDiccActionRequest
        >
      | TPrimitiveBaseModifyCriteria<
          TPrimitiveMutateInstance["dfDiccActionConfig"],
          TPrimitiveValInstance["dfDiccActionConfig"],
          TRequestValInstance["dfDiccActionConfig"],
          TPrimitiveHookInstance["dfDiccActionConfig"],
          TPrimitiveProviderInstance["dfDiccActionConfig"],
          TKeyDiccActionRequest
        >
  ): Promise<IPrimitiveResponse> {
    const mH = this.metadataHandler;
    const cH = new PrimitiveCriteriaHandler(this.metadataHandler, {
      ...(baseCriteria as any),
      keyActionRequest, //❗Obligatorio❗
    });
    let bag = new PrimitiveBag<
      TValue,
      TPrimitiveCriteriaInstance,
      TPrimitiveMutateInstance["dfDiccActionConfig"],
      TPrimitiveValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TPrimitiveHookInstance["dfDiccActionConfig"],
      TPrimitiveProviderInstance["dfDiccActionConfig"]
    >(this.keySrc, {
      data,
      criteriaHandler: cH as any,
    });
    const res = (await this.runActionRequest(
      this as any as ActionModule<any>,
      bag,
      undefined //en controller la acción es interna
    )) as IPrimitiveResponse;
    return res;
  }
  //====Acción especial para controller============================================================
  protected override actionCtrl: TFnBagForActionModule = async (
    bag: PrimitiveBag<any>
  ) => {
    const { data, criteriaHandler } = bag;
    const { aTKeysGlobalActionConfig, diccGlobalAC } = criteriaHandler;
    let keyActionForCtrl: EKeyActionGroupForRes =
      EKeyActionGroupForRes.ctrlPrimitive;
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
        keyModuleContext as TKeyPrimitiveInternalACModuleContext
      );
      if (this.isAllowRunAction(tKeyGAC, diccGlobalAC as object)) {
        const resForAction = (await this.runActionRequest(
          mFX,
          bag,
          keyAction
        )) as IPrimitiveResponse;
        res.responses.push(resForAction);
        if (resForAction.status > this.globalTolerance) break;
      }
    }
    res = rH.mutateResponse(res);
    return res;
  };
  //████ Acciones de petición ████████████████████████████████████████████████████████████
  /**... */
  public async exist(
    baseCriteria: TPrimitiveBaseReadCriteria<
      TPrimitiveMutateInstance["dfDiccActionConfig"],
      TPrimitiveValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TPrimitiveHookInstance["dfDiccActionConfig"],
      TPrimitiveProviderInstance["dfDiccActionConfig"],
      TKeyDiccActionRequest
    >
  ): Promise<IPrimitiveResponse> {
    const keyActionRequest = "exist" as TKeyDiccActionRequest;
    const res = await this.runCommonPrimitiveRequest(
      keyActionRequest,
      this.util.dfValue,
      baseCriteria
    );
    return res;
  }
  public async count(
    baseCriteria: TPrimitiveBaseReadCriteria<
      TPrimitiveMutateInstance["dfDiccActionConfig"],
      TPrimitiveValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TPrimitiveHookInstance["dfDiccActionConfig"],
      TPrimitiveProviderInstance["dfDiccActionConfig"],
      TKeyDiccActionRequest
    >
  ): Promise<IPrimitiveResponse> {
    const keyActionRequest = "count" as TKeyDiccActionRequest;
    const res = await this.runCommonPrimitiveRequest(
      keyActionRequest,
      this.util.dfValue,
      baseCriteria
    );
    return res;
  }
  public async inform(
    baseCriteria: TPrimitiveBaseReadCriteria<
      TPrimitiveMutateInstance["dfDiccActionConfig"],
      TPrimitiveValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TPrimitiveHookInstance["dfDiccActionConfig"],
      TPrimitiveProviderInstance["dfDiccActionConfig"],
      TKeyDiccActionRequest
    >
  ): Promise<IPrimitiveResponse> {
    const keyActionRequest = "inform" as TKeyDiccActionRequest;
    const res = await this.runCommonPrimitiveRequest(
      keyActionRequest,
      this.util.dfValue,
      baseCriteria
    );
    return res;
  }
  public async readAll(
    baseCriteria: TPrimitiveBaseReadCriteria<
      TPrimitiveMutateInstance["dfDiccActionConfig"],
      TPrimitiveValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TPrimitiveHookInstance["dfDiccActionConfig"],
      TPrimitiveProviderInstance["dfDiccActionConfig"],
      TKeyDiccActionRequest
    >
  ): Promise<IPrimitiveResponse> {
    const keyActionRequest = "readAll" as TKeyDiccActionRequest;
    const res = await this.runCommonPrimitiveRequest(
      keyActionRequest,
      this.util.dfValue,
      baseCriteria
    );
    return res;
  }
  public async readMany(
    baseCriteria: TPrimitiveBaseReadCriteria<
      TPrimitiveMutateInstance["dfDiccActionConfig"],
      TPrimitiveValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TPrimitiveHookInstance["dfDiccActionConfig"],
      TPrimitiveProviderInstance["dfDiccActionConfig"],
      TKeyDiccActionRequest
    >
  ): Promise<IPrimitiveResponse> {
    const keyActionRequest = "readMany" as TKeyDiccActionRequest;
    const res = await this.runCommonPrimitiveRequest(
      keyActionRequest,
      this.util.dfValue,
      baseCriteria
    );
    return res;
  }
  public async readOne(
    baseCriteria: TPrimitiveBaseReadCriteria<
      TPrimitiveMutateInstance["dfDiccActionConfig"],
      TPrimitiveValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TPrimitiveHookInstance["dfDiccActionConfig"],
      TPrimitiveProviderInstance["dfDiccActionConfig"],
      TKeyDiccActionRequest
    >
  ): Promise<IPrimitiveResponse> {
    const keyActionRequest = "readOne" as TKeyDiccActionRequest;
    const res = await this.runCommonPrimitiveRequest(
      keyActionRequest,
      this.util.dfValue,
      baseCriteria
    );
    return res;
  }
  public async create(
    baseCriteria: TPrimitiveBaseModifyCriteria<
      TPrimitiveMutateInstance["dfDiccActionConfig"],
      TPrimitiveValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TPrimitiveHookInstance["dfDiccActionConfig"],
      TPrimitiveProviderInstance["dfDiccActionConfig"],
      TKeyDiccActionRequest
    >,
    data: Partial<TValue>
  ): Promise<IPrimitiveResponse> {
    const keyActionRequest = "readAll" as TKeyDiccActionRequest;
    const res = await this.runCommonPrimitiveRequest(
      keyActionRequest,
      data as TValue,
      baseCriteria
    );
    return res;
  }
  public async update(
    baseCriteria: TPrimitiveBaseModifyCriteria<
      TPrimitiveMutateInstance["dfDiccActionConfig"],
      TPrimitiveValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TPrimitiveHookInstance["dfDiccActionConfig"],
      TPrimitiveProviderInstance["dfDiccActionConfig"],
      TKeyDiccActionRequest
    >,
    data: Partial<TValue>
  ): Promise<IPrimitiveResponse> {
    const keyActionRequest = "update" as TKeyDiccActionRequest;
    const res = await this.runCommonPrimitiveRequest(
      keyActionRequest,
      data as TValue,
      baseCriteria
    );
    return res;
  }
  public async delete(
    baseCriteria: TPrimitiveBaseModifyCriteria<
      TPrimitiveMutateInstance["dfDiccActionConfig"],
      TPrimitiveValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TPrimitiveHookInstance["dfDiccActionConfig"],
      TPrimitiveProviderInstance["dfDiccActionConfig"],
      TKeyDiccActionRequest
    >,
    data: Partial<TValue>
  ): Promise<IPrimitiveResponse> {
    const keyActionRequest = "delete" as TKeyDiccActionRequest;
    const res = await this.runCommonPrimitiveRequest(
      keyActionRequest,
      data as TValue,
      baseCriteria
    );
    return res;
  }
}
