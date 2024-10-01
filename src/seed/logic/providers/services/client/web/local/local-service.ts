import { TKeyLogicContext } from "../../../../../config/shared-modules";
import {
  IPrimitiveResponse,
  IStructureResponse,
} from "../../../../../reports/shared";
import { WebClientService } from "../_web-service-client";
import {
  localRepositoryFactoryFn,
  TKeyLocalRepositoryInstance,
} from "./repositories/local-repository-factory";
import { ILocalResponse } from "./repositories/shared";
import { TExpectedDataType } from "../../../../../criterias/shared";
import { IPrimitiveBag, IStructureBag } from "../../../../../bag-module/shared";
import { ILocalWebClientServiceRequestC } from "./shared";
import { IGenericDriver, IServiceRequestConfig } from "../../../shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**refactorizacion de la clase */
export type Trf_LocalWebClientService = LocalWebClientService;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** */
export class LocalWebClientService extends WebClientService {
  public static override readonly getDefault = () => {
    const superDF = WebClientService.getDefault();
    return {
      ...superDF,
      client: {
        ...(superDF.client as any),
        web: {
          ...(superDF.client.web as any),
          local: {
            ...(superDF.client.web.local as any),
            diccRepositoryConfig: {
              static: {},
              cookie: {},
              idb: {},
              storage: {},
            },
            keyLocalRepository: "cookie",
            customLocalRepositoryFn: localRepositoryFactoryFn,
          },
        },
      },
    } as IServiceRequestConfig;
  };
  protected get config(): ILocalWebClientServiceRequestC {
    return this.fullConfig.client.web.local;
  }
  /**
   * @param _keyLogicContext contexto lógico (estructural o primitivo)
   * @param _keySrc indentificadora del recurso asociado a modulo
   * @param serviceConfigBase configuracion base para el servicio
   */
  constructor(
    keyLogicContext: TKeyLogicContext,
    keySrc: string,
    serviceConfigBase: Partial<IServiceRequestConfig>,
    customDeepConfig: any = {}
  ) {
    super(keyLogicContext, keySrc);
    this.fullConfig = this.buildConfig(serviceConfigBase, customDeepConfig);
  }
  protected override getDefault() {
    return LocalWebClientService.getDefault();
  }
  protected override buildConfig(
    configBase: Partial<IServiceRequestConfig>,
    customDeepConfig: object
  ): IServiceRequestConfig {
    const df = this.getDefault();
    const cB = configBase;
    customDeepConfig = this.util.isObject(customDeepConfig)
      ? customDeepConfig
      : {};
    let rConfig: IServiceRequestConfig;
    if (!this.util.isObject(cB)) {
      rConfig = df;
    } else {
      rConfig = {
        ...cB,
        client: this.util.isObject(cB.client)
          ? {
              ...cB.client,
              web: this.util.isObject(cB.client.web)
                ? {
                    ...cB.client.web,
                    local: this.util.isObject(cB.client.web.local)
                      ? {
                          ...cB.client.web.local,
                          ...customDeepConfig, //agrega personalizacion
                        }
                      : {
                          ...df.client.web.local,
                          ...customDeepConfig, //agrega personalizacion
                        },
                  }
                : df.client.web,
            }
          : df.client,
      };
    }
    return rConfig;
  }
  protected override buildDriver(): IGenericDriver<ILocalResponse> {
    const { keyLocalRepository } = this.config;
    const diccConfig = this.config.diccRepositoryConfig;
    const driver = localRepositoryFactoryFn(
      keyLocalRepository,
      this.keyLogicContext,
      diccConfig
    );
    return driver;
  }
  public override async runRequestForPrimitive(
    iBag: IPrimitiveBag<any>
  ): Promise<IPrimitiveResponse> {
    const repo = this.buildDriver();
    const bagService = this.convertBagToBagService(iBag);
    const driverResponse = await repo.runRequestFromDrive(bagService);
    const rBag = this.adaptDriverResponseToPrimitiveLogicResponse(
      driverResponse,
      {
        expectedDataType: iBag.literalCriteria.expectedDataType,
      }
    );
    return rBag;
  }
  public override async runRequestForStructure(
    iBag: IStructureBag<any>
  ): Promise<IStructureResponse> {
    const repo = this.buildDriver();
    const bagService = this.convertBagToBagService(iBag);
    const driverResponse = await repo.runRequestFromDrive(bagService);
    const rBag = this.adaptDriverResponseToStructureLogicResponse(
      driverResponse,
      {
        expectedDataType: iBag.literalCriteria.expectedDataType,
      }
    );
    return rBag;
  }
  protected override adaptDriverResponseToPrimitiveLogicResponse(
    driverResponse: ILocalResponse,
    option: {
      expectedDataType: TExpectedDataType;
    }
  ): IPrimitiveResponse {
    const { body, httpStatus, ok, statusText, error } = driverResponse;
    const rH = this.reportPrimitiveHandler;
    let res = rH.mutateResponse(undefined, {
      data: this.reBuildRxDataFromHttpResponse(body, option.expectedDataType),
      status: this.convertHttpStatusCodeToLogicStatusCode(httpStatus),
      extResponse: error,
      msn: statusText,
    });
    return res;
  }
  protected override adaptDriverResponseToStructureLogicResponse(
    driverResponse: ILocalResponse,
    option: {
      expectedDataType: TExpectedDataType;
    }
  ): IStructureResponse {
    const { body, httpStatus, ok, statusText, error } = driverResponse;
    const rH = this.reportStructureHandler;
    let res = rH.mutateResponse(undefined, {
      data: this.reBuildRxDataFromHttpResponse(body, option.expectedDataType),
      status: this.convertHttpStatusCodeToLogicStatusCode(httpStatus),
      extResponse: error,
      msn: statusText,
    });
    return res;
  }
}
