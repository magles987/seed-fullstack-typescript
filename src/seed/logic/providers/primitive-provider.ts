import { PrimitiveBag, Trf_PrimitiveBag } from "../bag-module/primitive-bag";
import {
  IPrimitiveBagForActionModuleContext,
  TPrimitiveFnBagForActionModule,
} from "../bag-module/shared-for-external-module";
import { ELogicCodeError, LogicError } from "../errors/logic-error";
import { TPrimitiveMetaAndProvider } from "../meta/metadata-shared";
import { Trf_PrimitiveLogicMetadataHandler } from "../meta/primitive-metadata-handler";
import {
  PrimitiveReportHandler,
  Trf_PrimitiveReportHandler,
} from "../reports/primitive-report-handler";
import { ELogicResStatusCode, IPrimitiveResponse } from "../reports/shared";
import { LogicProvider } from "./_provider";
import { httpClientDriverFactoryFn } from "./services/client/web/http/drive/http-driver-factory";
import { localRepositoryFactoryFn } from "./services/client/web/local/repositories/local-repository-factory";
import { serviceFactory } from "./services/service-factory";
import {
  TKeyPrimitiveProviderModuleContext,
  TPrimitiveConfigForProvider,
  TPrimitiveProviderModuleConfigForPrimitive,
} from "./shared";
import { IRunProvider } from "./shared-for-external-module";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**define el diccionario de configuraciones de acciones del provider */
export interface IDiccPrimitiveProviderActionConfigG {
  runProvider: IRunProvider;
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
  > {
  /** configuracion de valores predefinidos para el modulo*/
  public static readonly getDefault = () => {
    const superDf = LogicProvider.getDefault();
    return {
      ...superDf,
      dfDiccActionConfig: {
        ...(superDf.dfDiccActionConfig as any),
        runProvider: {
          customServiceFactoryFn: serviceFactory,
          serviceConfig: {
            client: {
              app: {},
              web: {
                local: {
                  keyLocalRepository: "cookie",
                  customLocalRepositoryFn: localRepositoryFactoryFn,
                  diccRepositoryConfig: {
                    static: {},
                    cookie: {},
                    storage: {},
                    idb: {},
                  },
                },
                http: {
                  keyHttpDriver: "fetch",
                  customHttpClientFactoryFn: httpClientDriverFactoryFn,
                  urlConfig: {
                    urlRoot: "",
                    urlPostfix: "",
                    urlPrefix: "",
                  },
                  diccDriverConfig: {
                    fetch: {},
                    axios: {},
                  },
                },
              },
            },
            //server:{},
          },
          serviceToRun: {
            //❗❗Obligatorio definirlo en los metadatos❗❗
            keyService: undefined,
            keyDriver: undefined,
            customDeepServiceConfig: {}
          },
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
  /**
   * @param keySrc indentificadora del recurso asociado a modulo
   */
  constructor(keySrc: string) {
    super("structure", keySrc);
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
        diccActionsConfig: this.util.isObject(
          nCC.diccActionsConfig
        )
          ? this.util.mergeDiccActionConfig(
            [
              cCC.diccActionsConfig,
              nCC.diccActionsConfig,
            ],
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
  protected override getMetadataWithContextModule(): TPrimitiveMetaAndProvider<TIDiccAC> {
    let extractMetadataByContext: TPrimitiveMetaAndProvider<TIDiccAC>;
    extractMetadataByContext =
      this.metadataHandler.getExtractMetadataByModuleContext("provider") as any;
    return extractMetadataByContext;
  }
  protected override getMetadataOnlyModuleConfig(): TPrimitiveConfigForProvider<TIDiccAC> {
    const metadata =
      this.getMetadataWithContextModule() as TPrimitiveMetaAndProvider<TIDiccAC>;
    const config =
      metadata.__providerConfig as TPrimitiveConfigForProvider<TIDiccAC>;
    return config;
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
  protected override adapBagForContext<TKey extends keyof TIDiccAC>(
    bag: PrimitiveBag<any>,
    keyAction: TKey
  ): IPrimitiveBagForActionModuleContext<TIDiccAC, TKey> {
    const tGlobalAC = bag.findTupleGlobalActionConfig([
      this.keyModule as any,
      this.keyModuleContext,
      keyAction as never,
    ]);
    const tupleAC = bag.retrieveTupleActionConfig<TIDiccAC, any>(tGlobalAC);
    let actionConfig = this.retriveActionConfigFromTuple(tupleAC);
    if (actionConfig === undefined) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${actionConfig} is not action configuration valid`,
      });
    }
    if (actionConfig === undefined) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${actionConfig} is not action configuration valid`,
      });
    }
    actionConfig = this.buildSingleActionConfig(
      "toActionConfig" as any,
      keyAction as any,
      actionConfig as any,
      { mergeMode: "soft" }
    );
    const bagFC: IPrimitiveBagForActionModuleContext<TIDiccAC, any> = {
      data: bag.data,
      keyAction,
      actionConfig,
      responses: bag.responses,
      criteriaHandler: bag.criteriaHandler,
    };
    return bagFC;
  }
  public override buildReportHandler(
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
      fisrtCtrlData: firstData,
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
  public async runProvider(
    bag: PrimitiveBag<any>
  ): Promise<IPrimitiveResponse> {
    const { data, keyAction, actionConfig, responses } = this.adapBagForContext(
      bag,
      "runProvider"
    );
    let { customServiceFactoryFn, serviceConfig, serviceToRun } = actionConfig;
    const rH = this.buildReportHandler(bag, keyAction);
    let res = rH.mutateResponse(undefined, { data });
    let { keyService, keyDriver, customDeepServiceConfig } = serviceToRun;
    if (!this.util.isString(keyService)) {
      res = rH.mutateResponse(res, {
        status: ELogicResStatusCode.ERROR,
        msn: `${keyService} is not key service instance valid`
      });
      return res;
    }
    if (!this.util.isString(keyDriver)) {
      res = rH.mutateResponse(res, {
        status: ELogicResStatusCode.ERROR,
        msn: `${keyDriver} is not key driver for service instance valid`
      });
      return res;
    }
    const serviceInstance = customServiceFactoryFn(
      keyService,
      keyDriver,
      this.keyLogicContext,
      this.keySrc,
      serviceConfig,
      customDeepServiceConfig
    );
    const serviceRes = await serviceInstance.runRequestFromService(
      bag.getLiteralBag()
    );
    res = rH.mutateResponse(res, serviceRes as any);
    return res;
  }
}
