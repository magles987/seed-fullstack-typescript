import {
  LogicController,
  TKeyModifyRequestController,
  TKeyReadRequestController,
} from "./_controller";
import { PrimitiveBag, Trf_PrimitiveBag } from "../bag-module/primitive-bag";
import { ELogicCodeError, LogicError } from "../errors/logic-error";
import { ActionModule } from "../config/module";
import { IPrimitiveBuilderbaseMetadata } from "../meta/metadata-builder-shared";
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
  TPrimitiveCtrlModuleConfigForPrimitive,
} from "./_shared";
import {
  PrimitiveCriteriaHandler,
  Trf_PrimitiveCriteriaHandler,
} from "../criterias/primitive-criteria-handler";
import { PrimitiveLogicProvider } from "../providers/primitive-provider";
import {
  TKeyPrimitiveInternalACModuleContext,
  TPrimitiveMetaAndCtrl,
} from "../meta/metadata-shared";
import { TKeyRequestType } from "../config/shared-modules";
import {
  TPrimitiveBaseCriteriaForCtrlModify,
  TPrimitiveBaseCriteriaForCtrlRead,
} from "../criterias/shared";
import { Util_Ctrl } from "./_util-ctrl";

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
        TPrimitiveMutateInstance["dfDiccActionConfig"],
        TPrimitiveValInstance["dfDiccActionConfig"],
        TRequestValInstance["dfDiccActionConfig"],
        TPrimitiveHookInstance["dfDiccActionConfig"],
        TPrimitiveProviderInstance["dfDiccActionConfig"]
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
  public get primitiveMutateModuleInstance() {
    const r = this.metadataHandler.diccModuleInstanceContext.primitiveMutate;
    return r;
  }
  /**... */
  public get primitiveValModuleInstance() {
    const r = this.metadataHandler.diccModuleInstanceContext.primitiveVal;
    return r;
  }
  /**... */
  public get requestValModuleInstance() {
    const r = this.metadataHandler.diccModuleInstanceContext.requestVal;
    return r;
  }
  /**... */
  public get primitiveHookModuleInstance() {
    const r = this.metadataHandler.diccModuleInstanceContext.primitiveHook;
    return r;
  }
  /**... */
  public get primitiveProviderModuleInstance() {
    const r = this.metadataHandler.diccModuleInstanceContext.primitiveProvider;
    return r;
  }
  /**
   * @param basePrimitiveMetadata configuracion base de metadatos
   * (es un objeto literal no el manejador)
   */
  constructor(
    basePrimitiveMetadata: IPrimitiveBuilderbaseMetadata<
      TValue,
      TPrimitiveMutateInstance,
      TPrimitiveValInstance,
      TRequestValInstance,
      TPrimitiveHookInstance,
      TPrimitiveProviderInstance,
      TKeyDiccActionRequest
    >
  ) {
    super("primitive", basePrimitiveMetadata);
    const df = this.getDefault();
    const { keySrc, customBase, customDiccModuleInstance } =
      basePrimitiveMetadata;
    this.metadataHandler = new PrimitiveLogicMetadataHandler(
      keySrc,
      customBase,
      customDiccModuleInstance as any
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
    const util = Util_Ctrl.getInstance();
    let rConfig: TPrimitiveConfigForCtrl<any, any>["primitiveCtrl"];
    const cCC = currentContextConfig;
    const nCC = newContextConfig;
    if (!util.isObject(nCC)) {
      rConfig = cCC;
    } else {
      rConfig = {
        ...nCC,
        diccATKeyCRUD: util.isObject(nCC.diccATKeyCRUD)
          ? nCC.diccATKeyCRUD
          : cCC.diccATKeyCRUD,
      };
    }
    //reordenar tuplas de diccionario global
    //...falta
    //...aqui configuracion refinada:
    return rConfig;
  }
  protected getMetadataWithContextModule(): TPrimitiveMetaAndCtrl<
    TPrimitiveMutateInstance["dfDiccActionConfig"],
    TPrimitiveValInstance["dfDiccActionConfig"],
    TRequestValInstance["dfDiccActionConfig"],
    TPrimitiveHookInstance["dfDiccActionConfig"],
    TPrimitiveProviderInstance["dfDiccActionConfig"],
    TKeyDiccActionRequest
  > {
    let extractMetadataByContext =
      this.metadataHandler.getExtractMetadataByModuleContext(
        "controller"
      ) as any;
    return extractMetadataByContext;
  }
  protected getMetadataOnlyModuleConfig(): TPrimitiveConfigForCtrl<
    TPrimitiveMutateInstance["dfDiccActionConfig"] &
      TPrimitiveValInstance["dfDiccActionConfig"] &
      TRequestValInstance["dfDiccActionConfig"] &
      TPrimitiveHookInstance["dfDiccActionConfig"] &
      TPrimitiveProviderInstance["dfDiccActionConfig"],
    TKeyDiccActionRequest
  > {
    const metadata = this.getMetadataWithContextModule();
    const metadataInPrimitive = metadata;
    const config = metadataInPrimitive.__ctrlConfig;
    return config;
  }
  protected getDiccATKeyCRUD(): TPrimitiveCtrlModuleConfigForPrimitive<
    TPrimitiveMutateInstance["dfDiccActionConfig"] &
      TPrimitiveValInstance["dfDiccActionConfig"] &
      TRequestValInstance["dfDiccActionConfig"] &
      TPrimitiveHookInstance["dfDiccActionConfig"] &
      TPrimitiveProviderInstance["dfDiccActionConfig"],
    TKeyDiccActionRequest
  >["diccATKeyCRUD"] {
    const config = this.getMetadataOnlyModuleConfig();
    const diccATKeyCRUD = config.primitiveCtrl.diccATKeyCRUD;
    return diccATKeyCRUD;
  }
  /**... */
  protected getATKeyCRUDByKeyActionRequest(
    keyActionRequest: TKeyDiccActionRequest
  ) {
    const schemaATKeyGlobal = this.getDiccATKeyCRUD();
    const aTKeyGlobal =
      this.util.isObject(schemaATKeyGlobal) &&
      this.util.isArray(schemaATKeyGlobal[keyActionRequest])
        ? schemaATKeyGlobal[keyActionRequest]
        : [];
    return aTKeyGlobal;
  }
  protected override buildCriteriaHandler(
    requestType: "read",
    base?: TPrimitiveBaseCriteriaForCtrlRead,
    customCriteriaInstance?: PrimitiveCriteriaHandler<
      TValue,
      TPrimitiveMutateInstance["dfDiccActionConfig"],
      TPrimitiveValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TPrimitiveHookInstance["dfDiccActionConfig"],
      TPrimitiveProviderInstance["dfDiccActionConfig"]
    >
  ): PrimitiveCriteriaHandler<
    TValue,
    TPrimitiveMutateInstance["dfDiccActionConfig"],
    TPrimitiveValInstance["dfDiccActionConfig"],
    TRequestValInstance["dfDiccActionConfig"],
    TPrimitiveHookInstance["dfDiccActionConfig"],
    TPrimitiveProviderInstance["dfDiccActionConfig"]
  >;
  protected override buildCriteriaHandler(
    requestType: "modify",
    base?: TPrimitiveBaseCriteriaForCtrlModify,
    customCriteriaInstance?: PrimitiveCriteriaHandler<TValue>
  ): PrimitiveCriteriaHandler<
    TValue,
    TPrimitiveMutateInstance["dfDiccActionConfig"],
    TPrimitiveValInstance["dfDiccActionConfig"],
    TRequestValInstance["dfDiccActionConfig"],
    TPrimitiveHookInstance["dfDiccActionConfig"],
    TPrimitiveProviderInstance["dfDiccActionConfig"]
  >;
  protected override buildCriteriaHandler(
    requestType: TKeyRequestType,
    base?:
      | TPrimitiveBaseCriteriaForCtrlRead
      | TPrimitiveBaseCriteriaForCtrlModify,
    customCriteriaInstance?: PrimitiveCriteriaHandler<TValue>
  ): PrimitiveCriteriaHandler<TValue> {
    base = this.util.isObject(base) ? base : {};
    let cH: PrimitiveCriteriaHandler<TValue>;
    if (!this.util.isObject(customCriteriaInstance)) {
      cH = new PrimitiveCriteriaHandler(this.keySrc, this.metadataHandler, {
        ...base,
        type: requestType,
      });
    } else {
      customCriteriaInstance.mutateProps({
        ...base,
        type: requestType,
      });
      cH = customCriteriaInstance;
    }
    return cH;
  }
  public override buildReportHandler(
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
  public override preRunAction(
    bag: Trf_PrimitiveBag,
    keyAction: unknown
  ): void {
    super.preRunAction(bag, keyAction as any) as any;
    return;
  }
  public override postRunAction(
    bag: Trf_PrimitiveBag,
    res: IPrimitiveResponse
  ): void {
    super.postRunAction(bag, res) as any;
    return;
  }
  //████ runs commons ████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
  /**... */
  protected async runPrimitiveRequest(
    data: TValue,
    criteriaHandler: Trf_PrimitiveCriteriaHandler
  ): Promise<IPrimitiveResponse> {
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
      criteriaHandler: criteriaHandler as any,
    });
    return await this.runRequest(bag);
  }
  /**
   * ejecuta las acciones configuradas en el bag completo
   *
   * @param bag
   * @returns
   */
  protected async runRequest(
    bag: PrimitiveBag<
      TValue,
      TPrimitiveCriteriaInstance,
      TPrimitiveMutateInstance["dfDiccActionConfig"],
      TPrimitiveValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TPrimitiveHookInstance["dfDiccActionConfig"],
      TPrimitiveProviderInstance["dfDiccActionConfig"]
    >
  ): Promise<IPrimitiveResponse> {
    let keyCtrlAction: EKeyActionGroupForRes =
      EKeyActionGroupForRes.ctrlPrimitive;
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
        keyModuleContext as TKeyPrimitiveInternalACModuleContext
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
  protected async runRequestForAction(
    actionModuleInstContext: ActionModule<any>,
    bag: PrimitiveBag<TValue>,
    keyAction: any
  ): Promise<IPrimitiveResponse> {
    const res = (await super.runRequestForAction(
      actionModuleInstContext,
      bag,
      keyAction
    )) as IPrimitiveResponse;
    return res;
  }
  //████ Acciones de petición ████████████████████████████████████████████████████████████
  /**... */
  public async exist(
    baseCriteria: TPrimitiveBaseCriteriaForCtrlRead<
      TPrimitiveMutateInstance["dfDiccActionConfig"],
      TPrimitiveValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TPrimitiveHookInstance["dfDiccActionConfig"],
      TPrimitiveProviderInstance["dfDiccActionConfig"]
    >
  ): Promise<IPrimitiveResponse> {
    baseCriteria = this.util.isObject(baseCriteria) ? baseCriteria : {};
    //criterios obligatorios para esta acción de petición
    const cH = this.buildCriteriaHandler("read", {
      ...(baseCriteria as any),
      type: "read",
      keyActionRequest: "exist" as TKeyPrimitiveReadRequestController,
      expectedDataType: "boolean",
    });
    const res = await this.runPrimitiveRequest(this.util.dfValue, cH);
    return res;
  }
  public async count(
    baseCriteria: TPrimitiveBaseCriteriaForCtrlRead<
      TPrimitiveMutateInstance["dfDiccActionConfig"],
      TPrimitiveValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TPrimitiveHookInstance["dfDiccActionConfig"],
      TPrimitiveProviderInstance["dfDiccActionConfig"]
    >
  ): Promise<IPrimitiveResponse> {
    baseCriteria = this.util.isObject(baseCriteria) ? baseCriteria : {};
    //criterios obligatorios para esta acción de petición
    const cH = this.buildCriteriaHandler("read", {
      ...(baseCriteria as any),
      type: "read",
      keyActionRequest: "count" as TKeyPrimitiveReadRequestController,
      expectedDataType: "number",
    });
    const res = await this.runPrimitiveRequest(this.util.dfValue, cH);
    return res;
  }
  public async inform(
    baseCriteria: TPrimitiveBaseCriteriaForCtrlRead<
      TPrimitiveMutateInstance["dfDiccActionConfig"],
      TPrimitiveValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TPrimitiveHookInstance["dfDiccActionConfig"],
      TPrimitiveProviderInstance["dfDiccActionConfig"]
    >
  ): Promise<IPrimitiveResponse> {
    baseCriteria = this.util.isObject(baseCriteria) ? baseCriteria : {};
    //criterios obligatorios para esta acción de petición
    const cH = this.buildCriteriaHandler("read", {
      ...(baseCriteria as any),
      type: "read",
      keyActionRequest: "inform" as TKeyPrimitiveReadRequestController,
      expectedDataType: "string",
    });
    const res = await this.runPrimitiveRequest(this.util.dfValue, cH);
    return res;
  }
  public async readAll(
    baseCriteria: TPrimitiveBaseCriteriaForCtrlRead<
      TPrimitiveMutateInstance["dfDiccActionConfig"],
      TPrimitiveValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TPrimitiveHookInstance["dfDiccActionConfig"],
      TPrimitiveProviderInstance["dfDiccActionConfig"]
    >
  ): Promise<IPrimitiveResponse> {
    baseCriteria = this.util.isObject(baseCriteria) ? baseCriteria : {};
    //criterios obligatorios para esta acción de petición
    const cH = this.buildCriteriaHandler("read", {
      ...(baseCriteria as any),
      type: "read",
      keyActionRequest: "readAll" as TKeyPrimitiveReadRequestController,
      expectedDataType: "array",
      query: [], //❗se leen todos (no hay condición de filtrador)❗
    });
    const res = await this.runPrimitiveRequest(this.util.dfValue, cH);
    return res;
  }
  public async readMany(
    baseCriteria: TPrimitiveBaseCriteriaForCtrlRead<
      TPrimitiveMutateInstance["dfDiccActionConfig"],
      TPrimitiveValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TPrimitiveHookInstance["dfDiccActionConfig"],
      TPrimitiveProviderInstance["dfDiccActionConfig"]
    >
  ): Promise<IPrimitiveResponse> {
    baseCriteria = this.util.isObject(baseCriteria) ? baseCriteria : {};
    //criterios obligatorios para esta acción de petición
    const cH = this.buildCriteriaHandler("read", {
      ...(baseCriteria as any),
      type: "read",
      keyActionRequest: "readMany" as TKeyPrimitiveReadRequestController,
      expectedDataType: "array",
    });
    const res = await this.runPrimitiveRequest(this.util.dfValue, cH);
    return res;
  }
  public async readOne(
    baseCriteria: TPrimitiveBaseCriteriaForCtrlRead<
      TPrimitiveMutateInstance["dfDiccActionConfig"],
      TPrimitiveValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TPrimitiveHookInstance["dfDiccActionConfig"],
      TPrimitiveProviderInstance["dfDiccActionConfig"]
    >
  ): Promise<IPrimitiveResponse> {
    baseCriteria = this.util.isObject(baseCriteria) ? baseCriteria : {};
    //criterios obligatorios para esta acción de petición
    const cH = this.buildCriteriaHandler("read", {
      ...(baseCriteria as any),
      type: "read",
      keyActionRequest: "readOne" as TKeyPrimitiveReadRequestController,
      expectedDataType: "any",
      limit: 1,
    });
    const res = await this.runPrimitiveRequest(this.util.dfValue, cH);
    return res;
  }
  public async create(
    baseCriteria: TPrimitiveBaseCriteriaForCtrlModify<
      TPrimitiveMutateInstance["dfDiccActionConfig"],
      TPrimitiveValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TPrimitiveHookInstance["dfDiccActionConfig"],
      TPrimitiveProviderInstance["dfDiccActionConfig"]
    >,
    data: Partial<TValue>
  ): Promise<IPrimitiveResponse> {
    baseCriteria = this.util.isObject(baseCriteria) ? baseCriteria : {};
    //criterios obligatorios para esta acción de petición
    const cH = this.buildCriteriaHandler("modify", {
      ...(baseCriteria as any),
      type: "modify",
      modifyType: "create",
      keyActionRequest: "create" as TKeyPrimitiveModifyRequestController,
      expectedDataType: "any",
    });
    const res = await this.runPrimitiveRequest(data as TValue, cH);
    return res;
  }
  public async update(
    baseCriteria: TPrimitiveBaseCriteriaForCtrlModify<
      TPrimitiveMutateInstance["dfDiccActionConfig"],
      TPrimitiveValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TPrimitiveHookInstance["dfDiccActionConfig"],
      TPrimitiveProviderInstance["dfDiccActionConfig"]
    >,
    data: Partial<TValue>
  ): Promise<IPrimitiveResponse> {
    baseCriteria = this.util.isObject(baseCriteria) ? baseCriteria : {};
    //criterios obligatorios para esta acción de petición
    const cH = this.buildCriteriaHandler("modify", {
      ...(baseCriteria as any),
      type: "modify",
      modifyType: "update",
      keyActionRequest: "update" as TKeyPrimitiveModifyRequestController,
      expectedDataType: "any",
    });
    const res = await this.runPrimitiveRequest(data as TValue, cH);
    return res;
  }
  public async delete(
    baseCriteria: TPrimitiveBaseCriteriaForCtrlModify<
      TPrimitiveMutateInstance["dfDiccActionConfig"],
      TPrimitiveValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TPrimitiveHookInstance["dfDiccActionConfig"],
      TPrimitiveProviderInstance["dfDiccActionConfig"]
    >,
    data: Partial<TValue>
  ): Promise<IPrimitiveResponse> {
    baseCriteria = this.util.isObject(baseCriteria) ? baseCriteria : {};
    //criterios obligatorios para esta acción de petición
    const cH = this.buildCriteriaHandler("modify", {
      ...(baseCriteria as any),
      type: "modify",
      modifyType: "delete",
      keyActionRequest: "delete" as TKeyPrimitiveModifyRequestController,
      expectedDataType: "any",
    });
    const res = await this.runPrimitiveRequest(data as TValue, cH);
    return res;
  }
}
