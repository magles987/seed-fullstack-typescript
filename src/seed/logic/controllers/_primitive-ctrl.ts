import {
  LogicController,
  TKeyModifyRequestController,
  TKeyReadRequestController,
} from "./_controller";
import { PrimitiveBag } from "../bag-module/primitive-bag";
import { ELogicCodeError, LogicError } from "../errors/logic-error";
import { ActionModule, IBuildACOption } from "../config/module";
import { IPrimitiveBuilderbaseMetadata } from "../meta/metadata-builder-shared";
import { PrimitiveLogicMutater } from "../mutaters/primitive-mutater";
import { PrimitiveLogicValidation } from "../validators/primitive-validation";
import { RequestLogicValidation } from "../validators/request-validation";
import { PrimitiveLogicHook } from "../hooks/primitive-hook";
import { EKeyActionGroupForRes, IPrimitiveResponse } from "../reports/shared";
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
    TKeyDiccCtrlCRUD extends string = string
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
    >
{
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
  public override get reportHandler(): PrimitiveReportHandler {
    return super.reportHandler as any;
  }
  public override set reportHandler(reportHandler: PrimitiveReportHandler) {
    super.reportHandler = reportHandler;
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
    this.reportHandler = new PrimitiveReportHandler(this.keySrc, {
      keyModule: this.keyModule,
      keyModuleContext: this.keyModuleContext,
      status: df.status,
      tolerance: df.globalTolerance,
    });
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
        criteriaHandler: new PrimitiveCriteriaHandler(this.keySrc, "read", {}),
      };
    } else {
      rBagCtrl = {
        data: bBC.data,
        criteriaHandler: this.util.isInstance(bBC.criteriaHandler)
          ? bBC.criteriaHandler
          : new PrimitiveCriteriaHandler(this.keySrc, "read", {}),
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
    //asignar el manejador de metadatos:
    rBagCtrl.criteriaHandler.metadataHandler = this.metadataHandler;
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
    const {
      primitiveMutate: mPM,
      primitiveVal: mPV,
      requestVal: mRV,
      primitiveHook: mPH,
      primitiveProvider: mPP,
    } = this.metadataHandler.diccModuleIntanceContext;
    let keyCtrlAction: EKeyActionGroupForRes =
      EKeyActionGroupForRes.ctrlPrimitive;
    const rH = this.reportHandler;
    let res = rH.mutateResponse(undefined, {
      data: bag.data,
      fisrtCtrlData: bag.data,
      keyAction: keyCtrlAction,
    });
    for (const tGAC of bag.aTupleGlobalActionConfig) {
      const { keyModule, keyModuleContext, keyAction } =
        bag.getDiccKeysGlobalFromTupleGlobal(tGAC);
      let resForAction: IPrimitiveResponse;
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
      if (this.isAllowRunAction(tGAC)) {
        resForAction = await this.runRequestForAction(mFX, bag, keyAction);
        res.responses.push(resForAction);
      }
    }
    res = rH.mutateResponse(res, {
      data: bag.data,
    });
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
    const schemaATKeyGlobal = this.getDiccATKeyCRUD();
    const aTKeyGlobal = schemaATKeyGlobal[keyActionRequest];
    const aTGlobalAC = this.buildATupleForRequestCtrlFromBagCtrl(
      bagCtrl,
      aTKeyGlobal
    );
    let bag = this.buildBag(bagCtrl, aTGlobalAC as any);
    return this.runRequest(bag);
  }

  /*----------------------------------------------------------------*/
  /*----------------------------------------------------------------*/
  /*----------------------------------------------------------------*/
  /*----------------------------------------------------------------*/
  /*----------------------------------------------------------------*/
  /*----------------------------------------------------------------*/
  /*----------------------------------------------------------------*/
  /*----------------------------------------------------------------*/
  /*----------------------------------------------------------------*/
  /*---- <INICIO CONSTRUCCION> -------------------------------------*/
  public async read(
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
    const aTGlobalAC = this.buildATupleForRequestCtrlFromBagCtrl(bagCtrl, [
      ["primitiveVal", "isRequired"],
    ]);
    const bag = this.buildBag(bagCtrl, aTGlobalAC as any);

    return;
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
    return;
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
    return;
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
    return;
  }
  /*---- <FIN CONSTRUCCION> ----------------------------------------*/
  /*----------------------------------------------------------------*/
  /*----------------------------------------------------------------*/
  /*----------------------------------------------------------------*/
  /*----------------------------------------------------------------*/
  /*----------------------------------------------------------------*/
  /*----------------------------------------------------------------*/
  /*----------------------------------------------------------------*/
  /*----------------------------------------------------------------*/
  /*----------------------------------------------------------------*/
}
