import {
  IStructureBagForActionModuleContext,
  TStructureFnBagForActionModule,
} from "../bag-module/shared-for-external-module";
import { StructureBag, Trf_StructureBag } from "../bag-module/structure-bag";
import { ELogicCodeError, LogicError } from "../errors/logic-error";
import { TStructureMetaAndProvider } from "../meta/metadata-shared";
import { Trf_StructureLogicMetadataHandler } from "../meta/structure-metadata-handler";
import { IStructureResponse } from "../reports/shared";
import {
  StructureReportHandler,
  Trf_StructureReportHandler,
} from "../reports/structure-report-handler";
import { LogicProvider } from "./_provider";
import { httpClientDriverFactoryFn } from "./services/client/web/http/drive/http-driver-factory";
import { localRepositoryFactoryFn } from "./services/client/web/local/repositories/local-repository-factory";
import { serviceFactory } from "./services/service-factory";
import {
  TKeyStructureProviderModuleContext,
  TModelConfigForProvider,
} from "./shared";
import { IRunProvider } from "./shared-for-external-module";
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
          serviceToRun: {},
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
  public override get reportHandler(): Trf_StructureReportHandler {
    return super.reportHandler as any;
  }
  public override set reportHandler(rH: Trf_StructureReportHandler) {
    super.reportHandler = rH;
  }
  public override get keyModuleContext(): TKeyStructureProviderModuleContext {
    return "structureProvider";
  }
  /**
   * @param keySrc indentificadora del recurso asociado a modulo
   */
  constructor(keySrc: string) {
    super("structure", keySrc);
    this.reportHandler = new StructureReportHandler(this.keySrc, {});
  }
  protected override getDefault() {
    return StructureLogicProvider.getDefault();
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
  protected override adapBagForContext<TKey extends keyof TIDiccAC>(
    bag: StructureBag<any>,
    keyAction: TKey
  ): IStructureBagForActionModuleContext<TIDiccAC, TKey> {
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
      { keyPath: bag.keyPath, mergeMode: "soft" }
    );
    const bagFC: IStructureBagForActionModuleContext<TIDiccAC, any> = {
      data: bag.data,
      keyPath: bag.keyPath,
      keyAction,
      actionConfig,
      responses: bag.responses,
      criteriaHandler: bag.criteriaHandler,
    };
    return bagFC;
  }
  public override preRunAction(
    bag: Trf_StructureBag,
    keyAction: string
  ): Trf_StructureBag {
    const rH = this.reportHandler;
    const { data, criteriaHandler, keyPath, firstData } = bag;
    const { type, modifyType, keyActionRequest } = criteriaHandler;
    rH.startResponse({
      keyRepModule: this.keyModule as any,
      keyRepModuleContext: this.keyModuleContext,
      keyRepLogicContext: this.keyLogicContext,
      keyActionRequest: keyActionRequest,
      keyAction,
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
    return bag;
  }
  public override postRunAction(
    bag: Trf_StructureBag,
    res: IStructureResponse
  ): IStructureResponse {
    //mutacion de data
    bag.data = res.data;
    return res;
  }
  //================================================================
  public async runProvider(
    bag: StructureBag<any>
  ): Promise<IStructureResponse> {
    const { data, keyAction, keyPath, actionConfig, responses } =
      this.adapBagForContext(bag, "runProvider");
    let { customServiceFactoryFn, serviceConfig, serviceToRun } = actionConfig;
    const rH = this.reportHandler;
    let res = rH.mutateResponse(undefined, { data });
    let { keyService, customDeepServiceConfig } = serviceToRun;
    const serviceInstance = customServiceFactoryFn(
      keyService,
      this.keyLogicContext,
      this.keySrc,
      serviceConfig,
      customDeepServiceConfig
    );
    const serviceRes = await serviceInstance.runRequestFromService(
      bag.getLiteralBag()
    );
    res.responses.push(serviceRes as any);
    res = rH.mutateResponse(res);
    return res;
  }
}
