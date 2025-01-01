import { TKeyLogicContext } from "../../../../../config/shared-modules";
import {
  IExtResponse,
  IPrimitiveResponse,
  IStructureResponse,
} from "../../../../../reports/shared";
import { WebClientService } from "../_web-service-client";
import {
  localRepositoryFactoryFn,
  TKeyLocalRepositoryInstance,
} from "./drivers/local-repository-factory";
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
   * @param keyLogicContext contexto lógico (estructural o primitivo)
   * @param keySrc indentificadora del recurso asociado a modulo
   * @param keyDrive clave identificadora del drive a instanciar para este servicio
   * @param serviceConfigBase configuracion base para el servicio
   */
  constructor(
    keyLogicContext: TKeyLogicContext,
    keySrc: string,
    keyDrive: unknown,
    serviceConfigBase: Partial<IServiceRequestConfig>,
    customDeepConfig: any = {}
  ) {
    super(keyLogicContext, keySrc, keyDrive);
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
  protected override buildDriver(): IGenericDriver {
    const diccConfig = this.config.diccRepositoryConfig;
    const driver = localRepositoryFactoryFn(
      this.keyDrive as TKeyLocalRepositoryInstance,
      this.keyLogicContext,
      diccConfig
    );
    return driver;
  }
  public override async runRequestForPrimitive(
    iBag: IPrimitiveBag<any>
  ): Promise<IPrimitiveResponse> {
    const drive = this.buildDriver();
    const bagService = this.convertBagToBagService(iBag);
    const driverResponse = await drive.sendRequestFromService(bagService);
    const res = this.adaptDriverResponseToPrimitiveLogicResponse(
      driverResponse,
      iBag
    );
    return res;
  }
  public override async runRequestForStructure(
    iBag: IStructureBag<any>
  ): Promise<IStructureResponse> {
    const drive = this.buildDriver();
    const bagService = this.convertBagToBagService(iBag);
    const driverResponse = await drive.sendRequestFromService(bagService);
    const res = this.adaptDriverResponseToStructureLogicResponse(
      driverResponse,
      iBag
    );
    return res;
  }
}
