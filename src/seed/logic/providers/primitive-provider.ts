import { PrimitiveBag, Trf_PrimitiveBag } from "../bag/primitive-bag";
import { TPrimitiveFnBagForActionModule } from "../bag/shared";
import { Trf_PrimitiveCriteriaHandler } from "../criterias/primitive-criteria-handler";
import {
  TPrimitiveMetaAndProvider,
  Trf_TPrimitiveMetaAndProvider,
} from "../meta/metadata-shared";
import { Trf_PrimitiveLogicMetadataHandler } from "../meta/primitive-metadata-handler";
import { PrimitiveReportHandler } from "../reports/primitive-report-handler";
import { IPrimitiveResponse, TSelectorDataDriver } from "../reports/shared";
import { Driver } from "./_drivers/_driver";
import { LogicProvider } from "./_provider";
import {
  TKeyPrimitiveProviderModuleContext,
  TPrimitiveConfigForProvider,
  TPrimitiveProviderModuleConfigForPrimitive,
} from "./shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**define el diccionario de configuraciones de acciones del provider */
export interface IDiccPrimitiveProviderActionConfigG {
  singleRunDriver: {
    nameLogicDriver: string;
    opDriver?: Partial<Driver["getDefault"]>;
  };
}
/**claves identificadoras del diccionario
 * de acciones de configuracion */
export type TKeysDiccPrimitiveProviderActionConfigG =
  keyof IDiccPrimitiveProviderActionConfigG;
/**refactorizacion de la clase */
export type Trf_PrimitiveLogicProvider = PrimitiveLogicProvider<any>;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**... */
export class PrimitiveLogicProvider<
    TIDiccAC extends IDiccPrimitiveProviderActionConfigG = IDiccPrimitiveProviderActionConfigG
  >
  extends LogicProvider<TIDiccAC>
  implements
    Record<
      TKeysDiccPrimitiveProviderActionConfigG,
      TPrimitiveFnBagForActionModule
    >
{
  /** configuracion de valores predefinidos para el modulo*/
  public static readonly getDefault = () => {
    const superDf = LogicProvider.getDefault();
    return {
      ...superDf,
      dfDiccActionConfig: {
        ...(superDf.dfDiccActionConfig as any),
        singleRunDriver: {
          nameLogicDriver: "",
          opDriver: {},
        },
      } as IDiccPrimitiveProviderActionConfigG,
      topPriorityKeysAction: [
        ...superDf.topPriorityKeysAction,
      ] as Array<TKeysDiccPrimitiveProviderActionConfigG>,
      topMandatoryKeysAction: [
        ...superDf.topMandatoryKeysAction,
      ] as Array<TKeysDiccPrimitiveProviderActionConfigG>,
    };
  };
  public override get metadataHandler(): Trf_PrimitiveLogicMetadataHandler {
    return super.metadataHandler as any;
  }
  public override set metadataHandler(mH: Trf_PrimitiveLogicMetadataHandler) {
    super.metadataHandler = mH;
  }
  public override get keyModuleContext(): TKeyPrimitiveProviderModuleContext {
    return "primitiveProvider";
  }
  /** */
  constructor() {
    super("structure");
  }
  protected override getDefault() {
    return PrimitiveLogicProvider.getDefault();
  }
  protected override rebuildCustomConfigFromModuleContext(
    currentContextConfig: TPrimitiveProviderModuleConfigForPrimitive<TIDiccAC>,
    newContextConfig: TPrimitiveProviderModuleConfigForPrimitive<TIDiccAC>,
    mergeMode: Parameters<typeof this.util.deepMergeObjects>[1]["mode"]
  ): TPrimitiveProviderModuleConfigForPrimitive<TIDiccAC> {
    const cCC = currentContextConfig;
    const nCC = newContextConfig;
    let rConfig: TPrimitiveProviderModuleConfigForPrimitive<TIDiccAC>;
    if (!this.util.isObject(nCC)) {
      rConfig = cCC;
    } else {
      rConfig = {
        ...nCC,
        diccActionsConfig: this.util.isObject(nCC.diccActionsConfig)
          ? this.util.mergeDiccActionConfig(
              [cCC.diccActionsConfig, nCC.diccActionsConfig],
              {
                mode: mergeMode,
              }
            )
          : cCC.diccActionsConfig,
      };
    }
    //...aqui configuracion refinada:
    return rConfig;
  }
  protected override getMetadataWithContextModule(): TPrimitiveMetaAndProvider<PrimitiveLogicProvider> {
    let extractMetadataByContext: Trf_TPrimitiveMetaAndProvider;
    extractMetadataByContext =
      this.metadataHandler.getExtractMetadataByModuleContext("provider") as any;
    return extractMetadataByContext;
  }
  protected override getMetadataOnlyModuleConfig(): TPrimitiveConfigForProvider<TIDiccAC> {
    const metadata =
      this.getMetadataWithContextModule() as Trf_TPrimitiveMetaAndProvider;
    const config =
      metadata.__providerConfig as TPrimitiveConfigForProvider<TIDiccAC>;
    return config as TPrimitiveConfigForProvider<TIDiccAC>;
  }
  protected override getDiccMetadataActionConfig(): TIDiccAC {
    const config = this.getMetadataOnlyModuleConfig();
    const configPrimitive = config.primitiveProvider;
    const diccAC = configPrimitive.diccActionsConfig as TIDiccAC;
    return diccAC;
  }
  /**obtiene una funcion de accion de acuerdo a su clave identificadora
   * preparada para ser inyectada en el middleware
   *
   * @param keyAction la clave identificadora de la funcion de accion solicitada
   *
   * @returns la funcion de accion
   */
  public override getActionFnByKey<
    TKeys extends keyof TIDiccAC = keyof TIDiccAC
  >(keyAction: TKeys): TPrimitiveFnBagForActionModule;
  /**obtiene un array de funciones de accion de acuerdo a sus claves identificadoras
   * preparadas para ser inyectadas en el middleware
   *
   * @param keysAction el array de las claves identificadoras de las funciones de accion solicitadas
   *
   * @returns el array de funciones de accion
   */
  public override getActionFnByKey<
    TKeys extends keyof TIDiccAC = keyof TIDiccAC
  >(keysAction: TKeys[]): Array<TPrimitiveFnBagForActionModule>;
  public override getActionFnByKey(keyOrKeysAction: unknown): unknown {
    return super.getActionFnByKey(keyOrKeysAction);
  }
  protected override getTupleActionConfigFromCriteriaHandler<
    TKey extends keyof TIDiccAC
  >(
    criteriaHandler: Trf_PrimitiveCriteriaHandler,
    keyAction: TKey
  ): [TKey, TIDiccAC[TKey]] {
    const tKeyGlobalAC = [this.keyModuleContext, keyAction];
    const actionConfig = criteriaHandler.getGlobalActionByTKeyGlobalAC(
      tKeyGlobalAC as any
    );
    return [keyAction, actionConfig];
  }
  protected override buildReportHandler(
    bag: Trf_PrimitiveBag,
    keyAction: keyof TIDiccAC
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
    keyAction: keyof TIDiccAC
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
  //================================================================
  public async singleRunDriver(
    bag: PrimitiveBag<any>
  ): Promise<IPrimitiveResponse> {
    const { data, criteriaHandler } = bag;
    const [keyAction, actionConfig] =
      this.getTupleActionConfigFromCriteriaHandler(
        criteriaHandler,
        "singleRunDriver"
      );
    let driverInstance = actionConfig;
    const rH = this.buildReportHandler(bag, keyAction);
    let res = rH.mutateResponse(undefined, { data });
    const selectorDataDriver: TSelectorDataDriver = "first";
    let driverResponse = await driverInstance.sendRequestFromService(
      bag.getLiteralBag()
    );
    res = rH.mutateResponse(res, {
      ...rH.adaptDriverResponseToResponse(
        driverResponse,
        res,
        selectorDataDriver
      ),
    });
    return res;
  }
}
