import {
  LogicController,
  TKeyModifyRequestController,
  TKeyReadRequestController,
} from "./_controller";
import { PrimitiveBag, Trf_PrimitiveBag } from "../bag-module/primitive-bag";
import { ELogicCodeError, LogicError } from "../errors/logic-error";
import { ActionModule, IBuildACOption } from "../config/module";
import { IPrimitiveBuilderbaseMetadata } from "../meta/metadata-builder-shared";
import { PrimitiveLogicMutater } from "../mutaters/primitive-mutater";
import { PrimitiveLogicValidation } from "../validators/primitive-validation";
import { RequestLogicValidation } from "../validators/request-validation";
import { PrimitiveLogicHook } from "../hooks/primitive-hook";
import { EKeyActionGroupForRes, ELogicResStatusCode, IPrimitiveResponse } from "../reports/shared";
import {
  PrimitiveLogicMetadataHandler,
  Trf_PrimitiveLogicMetadataHandler,
} from "../meta/primitive-metadata-handler";
import { PrimitiveReportHandler } from "../reports/primitive-report-handler";
import {
  TKeyPrimitiveCtrlModuleContext,
  TKeyPrimitiveInternalACModuleContext,
  TPrimitiveConfigForCtrl,
  TPrimitiveCtrlModuleConfigForPrimitive,
} from "./_shared";
import { PrimitiveCriteriaHandler } from "../criterias/primitive-criteria-handler";
import { PrimitiveLogicProvider } from "../providers/primitive-provider";
import {
  IPrimitiveBagForCtrlContext,
  TPrimitiveFnBagForCtrl,
  Trf_IPrimitiveBagForCtrlContext,
} from "../bag-module/shared-for-external-module";
import { TPrimitiveMetaAndCtrl } from "../meta/metadata-shared";
import { TKeyRequestType } from "../config/shared-modules";
import {
  TPrimitiveBaseCriteriaForCtrlModify,
  TPrimitiveBaseCriteriaForCtrlRead,
} from "../criterias/shared";

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
  TKeyDiccCtrlCRUD extends TKeyPrimitiveReadRequestController | TKeyPrimitiveModifyRequestController = TKeyPrimitiveReadRequestController | TKeyPrimitiveModifyRequestController
>
  extends LogicController
  implements
  Record<
    TKeyPrimitiveReadRequestController | TKeyPrimitiveModifyRequestController,
    TPrimitiveFnBagForCtrl<
      IPrimitiveBagForCtrlContext<
        TValue,
        TPrimitiveCriteriaInstance,
        TPrimitiveMutateInstance["dfDiccActionConfig"],
        TPrimitiveValInstance["dfDiccActionConfig"],
        TRequestValInstance["dfDiccActionConfig"],
        TPrimitiveHookInstance["dfDiccActionConfig"],
        TPrimitiveProviderInstance["dfDiccActionConfig"]
      >
    >
  > {
  public static override getDefault = () => {
    const superDf = LogicController.getDefault();
    return {
      ...superDf,
      bagCtrl: {
        data: undefined,
        //criteriaHandler: undefined,
        diccGlobalAC: {
          primitiveMutate: {},
          primitiveVal: {},
          requestVal: {},
          primitiveHook: {},
        },
      } as Trf_IPrimitiveBagForCtrlContext,
    };
  };
  public override get metadataHandler(): PrimitiveLogicMetadataHandler<
    TValue,
    TPrimitiveMutateInstance,
    TPrimitiveValInstance,
    TRequestValInstance,
    TPrimitiveHookInstance,
    TPrimitiveProviderInstance,
    TKeyDiccCtrlCRUD
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
    const r = this.metadataHandler.diccModuleIntanceContext.primitiveMutate;
    return r;
  }
  /**... */
  public get primitiveValModuleInstance() {
    const r = this.metadataHandler.diccModuleIntanceContext.primitiveVal;
    return r;
  }
  /**... */
  public get requestValModuleInstance() {
    const r = this.metadataHandler.diccModuleIntanceContext.requestVal;
    return r;
  }
  /**... */
  public get primitiveHookModuleInstance() {
    const r = this.metadataHandler.diccModuleIntanceContext.primitiveHook;
    return r;
  }
  /**... */
  public get primitiveProviderModuleInstance() {
    const r = this.metadataHandler.diccModuleIntanceContext.primitiveProvider;
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
      TKeyDiccCtrlCRUD
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
  protected getMetadataWithContextModule(): TPrimitiveMetaAndCtrl<
    TPrimitiveMutateInstance["dfDiccActionConfig"],
    TPrimitiveValInstance["dfDiccActionConfig"],
    TRequestValInstance["dfDiccActionConfig"],
    TPrimitiveHookInstance["dfDiccActionConfig"],
    TPrimitiveProviderInstance["dfDiccActionConfig"],
    TKeyDiccCtrlCRUD
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
    TKeyDiccCtrlCRUD
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
    TKeyDiccCtrlCRUD
  >["diccATKeyCRUD"] {
    const config = this.getMetadataOnlyModuleConfig();
    const diccATKeyCRUD = config.primitiveCtrl.diccATKeyCRUD;
    return diccATKeyCRUD;
  }
  /**... */
  protected getATKeyCRUDByKeyActionRequest(keyActionRequest: TKeyDiccCtrlCRUD) {
    const schemaATKeyGlobal = this.getDiccATKeyCRUD();
    const aTKeyGlobal = this.util.isObject(schemaATKeyGlobal)
      && this.util.isArray(schemaATKeyGlobal[keyActionRequest])
      ? schemaATKeyGlobal[keyActionRequest]
      : [];
    return aTKeyGlobal;
  }
  public override buildCriteriaHandler(
    requestType: "read",
    keyActionRequest: TKeyDiccCtrlCRUD,
    base?: TPrimitiveBaseCriteriaForCtrlRead
  ): PrimitiveCriteriaHandler<TValue>;
  public override buildCriteriaHandler(
    requestType: "modify",
    keyActionRequest: TKeyDiccCtrlCRUD,
    base?: TPrimitiveBaseCriteriaForCtrlModify
  ): PrimitiveCriteriaHandler<TValue>;
  public override buildCriteriaHandler(
    requestType: TKeyRequestType,
    keyActionRequest: TKeyDiccCtrlCRUD,
    base?:
      | TPrimitiveBaseCriteriaForCtrlRead
      | TPrimitiveBaseCriteriaForCtrlModify
  ): PrimitiveCriteriaHandler<TValue> {
    let cH = new PrimitiveCriteriaHandler(this.keySrc, {
      ...base,
      keySrc: this.keySrc,
      type: requestType,
      keyActionRequest
    });
    cH.metadataHandler = this.metadataHandler;
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
      fisrtCtrlData: firstData,
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
  public buildBagCtrl(
    baseBagCtrl: Partial<
      IPrimitiveBagForCtrlContext<
        TValue,
        TPrimitiveCriteriaInstance,
        TPrimitiveMutateInstance["dfDiccActionConfig"],
        TPrimitiveValInstance["dfDiccActionConfig"],
        TRequestValInstance["dfDiccActionConfig"],
        TPrimitiveHookInstance["dfDiccActionConfig"],
        TPrimitiveProviderInstance["dfDiccActionConfig"]
      > &
      //❗Obligatorias❗
      Pick<
        IPrimitiveBagForCtrlContext<TValue, TPrimitiveCriteriaInstance>,
        "data" | "criteriaHandler"
      >
    >
  ): IPrimitiveBagForCtrlContext<
    TValue,
    TPrimitiveCriteriaInstance,
    TPrimitiveMutateInstance["dfDiccActionConfig"],
    TPrimitiveValInstance["dfDiccActionConfig"],
    TRequestValInstance["dfDiccActionConfig"],
    TPrimitiveHookInstance["dfDiccActionConfig"],
    TPrimitiveProviderInstance["dfDiccActionConfig"]
  > {
    const dfBC = this.getDefault().bagCtrl;
    const bBC = baseBagCtrl;
    let rBagCtrl: Trf_IPrimitiveBagForCtrlContext;
    if (!this.util.isObject(bBC)) {
      rBagCtrl = {
        ...dfBC,
        criteriaHandler: this.buildCriteriaHandler("read", "readOne" as any),
      };
    } else {
      rBagCtrl = {
        data: bBC.data,
        criteriaHandler: this.util.isInstance(bBC.criteriaHandler)
          ? bBC.criteriaHandler
          : this.buildCriteriaHandler("read", "readOne" as any),
        diccGlobalAC: this.util.isObject(bBC.diccGlobalAC)
          ? {
            ...bBC.diccGlobalAC,
            primitiveMutate: this.util.isObject(
              bBC.diccGlobalAC.primitiveMutate
            )
              ? bBC.diccGlobalAC.primitiveMutate
              : dfBC.diccGlobalAC.primitiveMutate,
            primitiveVal: this.util.isObject(bBC.diccGlobalAC.primitiveVal)
              ? bBC.diccGlobalAC.primitiveVal
              : dfBC.diccGlobalAC.primitiveVal,
            requestVal: this.util.isObject(dfBC.diccGlobalAC.requestVal)
              ? bBC.diccGlobalAC.requestVal
              : dfBC.diccGlobalAC.requestVal,
            primitiveHook: this.util.isObject(bBC.diccGlobalAC.primitiveHook)
              ? bBC.diccGlobalAC.primitiveHook
              : dfBC.diccGlobalAC.primitiveHook,
          }
          : dfBC.diccGlobalAC,
      };
    }
    return rBagCtrl as any;
  }
  protected buildBag(
    bagCtrl: IPrimitiveBagForCtrlContext<
      TValue,
      TPrimitiveCriteriaInstance,
      TPrimitiveMutateInstance["dfDiccActionConfig"],
      TPrimitiveValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TPrimitiveHookInstance["dfDiccActionConfig"]
    >,
    aTupleGlobalActionConfig: [string, [any, any]]
  ): PrimitiveBag<
    TValue,
    TPrimitiveCriteriaInstance,
    TPrimitiveMutateInstance["dfDiccActionConfig"],
    TPrimitiveValInstance["dfDiccActionConfig"],
    TRequestValInstance["dfDiccActionConfig"],
    TPrimitiveHookInstance["dfDiccActionConfig"],
    TPrimitiveProviderInstance["dfDiccActionConfig"]
  > {
    if (!this.util.isObject(bagCtrl)) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${bagCtrl} is not bag controller valid`,
      });
    }
    if (!this.util.isArrayTuple(aTupleGlobalActionConfig, [1, 2], true)) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${aTupleGlobalActionConfig} is not array of tuple of action config valid`,
      });
    }
    const { data, criteriaHandler: criteriaCursor } = bagCtrl;
    const bag = new PrimitiveBag<
      TValue,
      TPrimitiveCriteriaInstance,
      TPrimitiveMutateInstance["dfDiccActionConfig"],
      TPrimitiveValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TPrimitiveHookInstance["dfDiccActionConfig"],
      TPrimitiveProviderInstance["dfDiccActionConfig"]
    >(this.keySrc, {
      criteriaHandler: criteriaCursor,
      data,
      keySrc: this.keySrc,
      aTupleGlobalActionConfig: aTupleGlobalActionConfig as any,
    });
    return bag;
  }
  protected override getActionConfigFromBagCtrl(
    bagCtrl: IPrimitiveBagForCtrlContext<any>,
    keyModuleContext: keyof IPrimitiveBagForCtrlContext<any>["diccGlobalAC"],
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
      keyPath: undefined, //this.metadataHandler.keyModelPath, //❗en primitivo NO EXISTE❗
      mergeMode: "soft",
    };
  }
  protected buildATupleForRequestCtrlFromBagCtrl<
    TIDiccAC = TPrimitiveMutateInstance["dfDiccActionConfig"] &
    TPrimitiveValInstance["dfDiccActionConfig"] &
    TRequestValInstance["dfDiccActionConfig"] &
    TPrimitiveHookInstance["dfDiccActionConfig"] &
    TPrimitiveProviderInstance["dfDiccActionConfig"],
    TKeyAction extends keyof TIDiccAC = keyof TIDiccAC
  >(
    bagCtrl: IPrimitiveBagForCtrlContext<
      TValue,
      TPrimitiveCriteriaInstance,
      TPrimitiveMutateInstance["dfDiccActionConfig"],
      TPrimitiveValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TPrimitiveHookInstance["dfDiccActionConfig"],
      TPrimitiveProviderInstance["dfDiccActionConfig"]
    >,
    aTupleKeyModuleCAndAction: Array<
      [TKeyPrimitiveInternalACModuleContext, TKeyAction]
    >
  ): Array<[string, [TKeyAction, TIDiccAC[TKeyAction]]]> {
    let bACOp = {
      ...this.getDefaultBuilderACOption(),
      //...personalizar si se requiere
    } as IBuildACOption;
    let aTGlobalAC: any[] = [];
    for (const itemAny of aTupleKeyModuleCAndAction) {
      const item = itemAny as [
        TKeyPrimitiveInternalACModuleContext,
        TKeyAction
      ];
      const keyModuleContext = item[0];
      const keyAction = item[1];
      let actionModule: ActionModule<any>;
      if (keyModuleContext === "primitiveMutate")
        actionModule = this.primitiveMutateModuleInstance;
      else if (keyModuleContext === "primitiveVal")
        actionModule = this.primitiveValModuleInstance;
      else if (keyModuleContext === "requestVal")
        actionModule = this.requestValModuleInstance;
      else if (keyModuleContext === "primitiveHook")
        actionModule = this.primitiveHookModuleInstance;
      else if (keyModuleContext === "primitiveProvider")
        actionModule = this.primitiveProviderModuleInstance as any;
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
  /**obtiene la instancia de modulo de acuerdo a la clave identificadora
   * 
   * @param keyModuleContext clave identificadora del contexto del submodulo 
   * con la accion a ejecutar
   * 
   * @returns la instancia seleccionada
   */
  private getModuleInstanceForActionContext(keyModuleContext: TKeyPrimitiveInternalACModuleContext): ActionModule<any> {
    const {
      primitiveMutate: mPM,
      primitiveVal: mPV,
      requestVal: mRV,
      primitiveHook: mPH,
      primitiveProvider: mPP,
    } = this.metadataHandler.diccModuleIntanceContext;
    let mFX: ActionModule<any>;
    if (keyModuleContext === "primitiveMutate") mFX = mPM;
    else if (keyModuleContext === "primitiveVal") mFX = mPV;
    else if (keyModuleContext === "requestVal") mFX = mRV;
    else if (keyModuleContext === "primitiveHook") mFX = mPH;
    else if (keyModuleContext === "primitiveProvider") mFX = mPP;
    else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${keyModuleContext} is not key action module context valid`,
      });
    }
    return mFX;
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
    const { data: dataBag, aTupleGlobalActionConfig } = bag;
    const rH = this.buildReportHandler(bag, keyCtrlAction);
    this.preRunAction(bag, keyCtrlAction);
    let res = rH.mutateResponse(undefined, { data: dataBag });
    if (aTupleGlobalActionConfig.length === 0) {
      res = rH.mutateResponse(res, {
        status: ELogicResStatusCode.WARNING,
        msn: `${aTupleGlobalActionConfig} is array of global action config empty`
      });
      this.postRunAction(bag, res);
      return res;
    }
    for (const tGAC of aTupleGlobalActionConfig) {
      const { keyModuleContext, keyAction } =
        bag.getDiccKeysGlobalFromTupleGlobal(tGAC);
      const mFX = this.getModuleInstanceForActionContext(keyModuleContext);
      if (this.isAllowRunAction(tGAC)) {
        const resForAction = await this.runRequestForAction(mFX, bag, keyAction);
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
  //████ Acciones de peticion ████████████████████████████████████████████████████████████
  /**... */
  public async runGenericPrimitiveRequest(
    keyActionRequest: TKeyDiccCtrlCRUD,
    bagCtrl: IPrimitiveBagForCtrlContext<
      TValue,
      TPrimitiveCriteriaInstance,
      TPrimitiveMutateInstance["dfDiccActionConfig"],
      TPrimitiveValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TPrimitiveHookInstance["dfDiccActionConfig"],
      TPrimitiveProviderInstance["dfDiccActionConfig"]
    >
  ): Promise<IPrimitiveResponse> {
    if (!this.util.isString(keyActionRequest)) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${keyActionRequest} is not request action key valid`,
      });
    }
    bagCtrl = this.buildBagCtrl(bagCtrl); //reconstruccion OBLIGATORIA
    const aTKeyGlobal = this.getATKeyCRUDByKeyActionRequest(keyActionRequest);
    const aTGlobalAC = this.buildATupleForRequestCtrlFromBagCtrl(
      bagCtrl,
      aTKeyGlobal
    );
    let bag = this.buildBag(bagCtrl, aTGlobalAC as any);
    return await this.runRequest(bag);
  }
  public async readAll(
    bagCtrl: IPrimitiveBagForCtrlContext<
      TValue,
      TPrimitiveCriteriaInstance,
      TPrimitiveMutateInstance["dfDiccActionConfig"],
      TPrimitiveValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TPrimitiveHookInstance["dfDiccActionConfig"],
      TPrimitiveProviderInstance["dfDiccActionConfig"]
    >
  ): Promise<IPrimitiveResponse> {
    const keyActionRequest: TKeyPrimitiveReadRequestController = "readAll";
    //criterios obligatorios para esta accion de peticion
    bagCtrl.criteriaHandler.mutateProps({
      type: "read",
      keyActionRequest,
      query: [], //se leen todos (no hay condicion de filtrador)
      expectedDataType: "array",
    });
    const res = await this.runGenericPrimitiveRequest(
      keyActionRequest as any,
      bagCtrl
    );
    return res;
  }
  public async readMany(
    bagCtrl: IPrimitiveBagForCtrlContext<
      TValue,
      TPrimitiveCriteriaInstance,
      TPrimitiveMutateInstance["dfDiccActionConfig"],
      TPrimitiveValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TPrimitiveHookInstance["dfDiccActionConfig"],
      TPrimitiveProviderInstance["dfDiccActionConfig"]
    >
  ): Promise<IPrimitiveResponse> {
    const keyActionRequest: TKeyPrimitiveReadRequestController = "readMany";
    //criterios obligatorios para esta accion de peticion
    bagCtrl.criteriaHandler.mutateProps({
      type: "read",
      keyActionRequest,
      expectedDataType: "array",
    });
    const res = await this.runGenericPrimitiveRequest(
      keyActionRequest as any,
      bagCtrl
    );
    return res;
  }
  public async readOne(
    bagCtrl: IPrimitiveBagForCtrlContext<
      TValue,
      TPrimitiveCriteriaInstance,
      TPrimitiveMutateInstance["dfDiccActionConfig"],
      TPrimitiveValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TPrimitiveHookInstance["dfDiccActionConfig"],
      TPrimitiveProviderInstance["dfDiccActionConfig"]
    >
  ): Promise<IPrimitiveResponse> {
    const keyActionRequest: TKeyPrimitiveReadRequestController = "readMany";
    //criterios obligatorios para esta accion de peticion
    bagCtrl.criteriaHandler.mutateProps({
      type: "read",
      keyActionRequest,
      expectedDataType: "single", //se espera solo un primitivo (puede ser un objeto literal anonimo)
      limit: 1,
      sort: undefined,
    });
    const res = await this.runGenericPrimitiveRequest(
      keyActionRequest as any,
      bagCtrl
    );
    return res;
  }
  public async create(
    bagCtrl: IPrimitiveBagForCtrlContext<
      TValue,
      TPrimitiveCriteriaInstance,
      TPrimitiveMutateInstance["dfDiccActionConfig"],
      TPrimitiveValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TPrimitiveHookInstance["dfDiccActionConfig"],
      TPrimitiveProviderInstance["dfDiccActionConfig"]
    >
  ): Promise<IPrimitiveResponse> {
    const keyActionRequest: TKeyPrimitiveModifyRequestController = "create";
    //criterios obligatorios para esta accion de peticion
    bagCtrl.criteriaHandler.mutateProps({
      type: "modify",
      modifyType: "create",
      keyActionRequest,
      expectedDataType: "single", //se espera solo un primitivo (puede ser un objeto literal anonimo)
    });
    const res = await this.runGenericPrimitiveRequest(
      keyActionRequest as any,
      bagCtrl
    );
    return res;
  }
  public async update(
    bagCtrl: IPrimitiveBagForCtrlContext<
      TValue,
      TPrimitiveCriteriaInstance,
      TPrimitiveMutateInstance["dfDiccActionConfig"],
      TPrimitiveValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TPrimitiveHookInstance["dfDiccActionConfig"],
      TPrimitiveProviderInstance["dfDiccActionConfig"]
    >
  ): Promise<IPrimitiveResponse> {
    const keyActionRequest: TKeyPrimitiveModifyRequestController = "update";
    //criterios obligatorios para esta accion de peticion
    bagCtrl.criteriaHandler.mutateProps({
      type: "modify",
      modifyType: "update",
      keyActionRequest,
      expectedDataType: "single", //se espera solo un primitivo (puede ser un objeto literal anonimo)
    });
    const res = await this.runGenericPrimitiveRequest(
      keyActionRequest as any,
      bagCtrl
    );
    return res;
  }
  public async delete(
    bagCtrl: IPrimitiveBagForCtrlContext<
      TValue,
      TPrimitiveCriteriaInstance,
      TPrimitiveMutateInstance["dfDiccActionConfig"],
      TPrimitiveValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TPrimitiveHookInstance["dfDiccActionConfig"],
      TPrimitiveProviderInstance["dfDiccActionConfig"]
    >
  ): Promise<IPrimitiveResponse> {
    const keyActionRequest: TKeyPrimitiveModifyRequestController = "delete";
    //criterios obligatorios para esta accion de peticion
    bagCtrl.criteriaHandler.mutateProps({
      type: "modify",
      modifyType: "delete",
      keyActionRequest,
      expectedDataType: "single", //se espera solo un primitivo (puede ser un objeto literal anonimo)
    });
    const res = await this.runGenericPrimitiveRequest(
      keyActionRequest as any,
      bagCtrl
    );
    return res;
  }
}
