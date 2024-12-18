import { LogicProvider } from "./_provider";
import { StructureBag, Trf_StructureBag } from "../bag-module/structure-bag";
import { TStructureMetaAndProvider } from "../meta/metadata-shared";
import { Trf_StructureLogicMetadataHandler } from "../meta/structure-metadata-handler";
import { ELogicResStatusCode, IStructureResponse } from "../reports/shared";
import { StructureReportHandler } from "../reports/structure-report-handler";
import { localRepositoryFactoryFn } from "./services/client/web/local/drivers/local-repository-factory";
import { httpClientDriverFactoryFn } from "./services/client/web/http/drivers/http-driver-factory";
import { serviceFactory } from "./services/service-factory";
import {
  TKeyStructureProviderModuleContext,
  TModelConfigForProvider,
  TStructureProviderModuleConfigForStructure,
} from "./shared";
import { IRunProvider } from "./shared-for-external-module";
import { Trf_StructureCriteriaHandler } from "../criterias/structure-criteria-handler";
import { TStructureFnBagForActionModule } from "../bag-module/shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**define el diccionario de configuraciones de acciones del provider */
export interface IDiccStructureProviderActionConfigG {
  runProvider: IRunProvider;
}
/**claves identificadoras del diccionario
 * de acciones de configuracion */
export type TKeysDiccStructureProviderActionConfigG =
  keyof IDiccStructureProviderActionConfigG;
/**refactorizacion de la clase */
export type Trf_StructureLogicProvider = StructureLogicProvider<any>;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**... */
export class StructureLogicProvider<
    TIDiccAC extends IDiccStructureProviderActionConfigG = IDiccStructureProviderActionConfigG
  >
  extends LogicProvider<TIDiccAC>
  implements
    Record<
      TKeysDiccStructureProviderActionConfigG,
      TStructureFnBagForActionModule
    >
{
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
                  customLocalRepositoryFn: localRepositoryFactoryFn,
                  diccRepositoryConfig: {
                    static: {},
                    cookie: {},
                    storage: {},
                    idb: {},
                  },
                },
                http: {
                  customHttpClientFactoryFn: httpClientDriverFactoryFn,
                  diccDriverConfig: {
                    fetch: {
                      urlRoot: "",
                      urlPostfix: "",
                      urlPrefix: "",
                      option: {},
                    },
                    axios: {
                      urlRoot: "",
                      urlPostfix: "",
                      urlPrefix: "",
                      option: {},
                    },
                  },
                },
              },
            },
          },
          serviceToRun: {
            //❗❗Obligatorio definirlo en los metadatos❗❗
            keyService: undefined,
            keyDriver: undefined,
            customDeepServiceConfig: {},
          },
        },
      } as IDiccStructureProviderActionConfigG,
      topPriorityKeysAction: [
        ...superDf.topPriorityKeysAction,
      ] as Array<TKeysDiccStructureProviderActionConfigG>,
      topMandatoryKeysAction: [
        ...superDf.topMandatoryKeysAction,
      ] as Array<TKeysDiccStructureProviderActionConfigG>,
    };
  };
  public override get metadataHandler(): Trf_StructureLogicMetadataHandler {
    return super.metadataHandler as any;
  }
  public override set metadataHandler(mH: Trf_StructureLogicMetadataHandler) {
    super.metadataHandler = mH;
  }
  public override get keyModuleContext(): TKeyStructureProviderModuleContext {
    return "structureProvider";
  }
  /**
   * @param keySrc indentificadora del recurso asociado a modulo
   */
  constructor(keySrc: string) {
    super("structure", keySrc);
  }
  protected override getDefault() {
    return StructureLogicProvider.getDefault();
  }
  protected override rebuildCustomConfigFromModuleContext(
    currentContextConfig: TStructureProviderModuleConfigForStructure<TIDiccAC>,
    newContextConfig: TStructureProviderModuleConfigForStructure<TIDiccAC>,
    mergeMode: Parameters<typeof this.util.deepMergeObjects>[1]["mode"]
  ): TStructureProviderModuleConfigForStructure<TIDiccAC> {
    const cCC = currentContextConfig;
    const nCC = newContextConfig;
    let rConfig: TStructureProviderModuleConfigForStructure<TIDiccAC>;
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
  protected override getMetadataWithContextModule(): TStructureMetaAndProvider<
    any,
    TIDiccAC
  > {
    let extractMetadataByContext: TStructureMetaAndProvider<any, TIDiccAC>;
    extractMetadataByContext =
      this.metadataHandler.getExtractMetadataByModuleContext(
        "structureModel",
        "provider"
      ) as any;
    return extractMetadataByContext;
  }
  protected override getMetadataOnlyModuleConfig(): TModelConfigForProvider<TIDiccAC> {
    const metadata =
      this.getMetadataWithContextModule() as TStructureMetaAndProvider<
        any,
        TIDiccAC
      >;
    const config =
      metadata.__providerConfig as TModelConfigForProvider<TIDiccAC>;
    return config;
  }
  protected override getDiccMetadataActionConfig(): TIDiccAC {
    const config = this.getMetadataOnlyModuleConfig();
    const configStructure = config.structureProvider;
    const diccAC = configStructure.diccActionsConfig as TIDiccAC;
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
  >(keyAction: TKeys): TStructureFnBagForActionModule;
  /**obtiene un array de funciones de accion de acuerdo a sus claves identificadoras
   * preparadas para ser inyectadas en el middleware
   *
   * @param keysAction el array de las claves identificadoras de las funciones de accion solicitadas
   *
   * @returns el array de funciones de accion
   */
  public override getActionFnByKey<
    TKeys extends keyof TIDiccAC = keyof TIDiccAC
  >(keysAction: TKeys[]): Array<TStructureFnBagForActionModule>;
  public override getActionFnByKey(keyOrKeysAction: unknown): unknown {
    return super.getActionFnByKey(keyOrKeysAction);
  }
  protected override getTupleActionConfigFromCriteriaHandler<
    TKey extends keyof TIDiccAC
  >(
    criteriaHandler: Trf_StructureCriteriaHandler,
    keyAction: TKey
  ): [TKey, TIDiccAC[TKey]] {
    const tKeyGlobalAC = [this.keyModuleContext, keyAction];
    const actionConfig = criteriaHandler.getGlobalActionByTKeyGlobalAC(
      tKeyGlobalAC as any
    );
    return [keyAction, actionConfig];
  }
  public override buildReportHandler(
    bag: Trf_StructureBag,
    keyAction: keyof TIDiccAC
  ): StructureReportHandler {
    const { data, criteriaHandler, firstData } = bag;
    const { type, modifyType, keyPath, keyActionRequest } = criteriaHandler;
    let rH = new StructureReportHandler(this.keySrc, {
      keyRepModule: this.keyModule as any,
      keyRepModuleContext: this.keyModuleContext,
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
    keyAction: keyof TIDiccAC
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
  //================================================================
  public async runProvider(
    bag: StructureBag<any>
  ): Promise<IStructureResponse> {
    const { data, criteriaHandler } = bag;
    const [keyAction, actionConfig] =
      this.getTupleActionConfigFromCriteriaHandler(
        criteriaHandler,
        "runProvider"
      );
    let { customServiceFactoryFn, serviceConfig, serviceToRun } = actionConfig;
    const rH = this.buildReportHandler(bag, keyAction);
    let res = rH.mutateResponse(undefined, { data });
    let { keyService, keyDriver, customDeepServiceConfig } = serviceToRun;
    if (!this.util.isString(keyService)) {
      res = rH.mutateResponse(res, {
        status: ELogicResStatusCode.ERROR,
        msn: `${keyService} is not key service instance valid`,
      });
      return res;
    }
    if (!this.util.isString(keyDriver)) {
      res = rH.mutateResponse(res, {
        status: ELogicResStatusCode.ERROR,
        msn: `${keyDriver} is not key driver for service instance valid`,
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
    const serviceRes = await serviceInstance.sendRequestInService(
      bag.getLiteralBag()
    );
    res.responses.push(serviceRes as any);
    res = rH.mutateResponse(res);
    return res;
  }
}
