import { IGenericDriver, IServiceRequestConfig } from "../../../shared";
import { WebClientService } from "../_web-service-client";
import { IHttpResponse, IHttpWebClientServiceRequestC } from "./shared";
import { TKeyLogicContext } from "../../../../../config/shared-modules";
import { IPrimitiveBag, IStructureBag } from "../../../../../bag-module/shared";
import {
  IPrimitiveResponse,
  IStructureResponse,
} from "../../../../../reports/shared";
import { TExpectedDataType } from "../../../../../criterias/shared";
import { httpClientDriverFactoryFn, TKeyHttpClientDriverInstance } from "./drive/http-driver-factory";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**refactorizacion de la clase */
export type Trf_HttpService = HttpWebClientService;

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**
 * descrip...
 *
 */
export class HttpWebClientService extends WebClientService {
  public static override readonly getDefault = () => {
    const superDF = WebClientService.getDefault();
    return {
      ...(superDF.client as any),
      client: {
        ...(superDF.client as any),
        web: {
          ...(superDF.client.web as any),
          http: {
            keyHttpDriver: undefined, //⚠ Debe ser definido en metadatos ⚠
            urlRoot: "",
            urlsExtended: [],
          },
        },
      },
    } as IServiceRequestConfig;
  };
  protected get config(): IHttpWebClientServiceRequestC {
    return this.fullConfig.client.web.http;
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
    return HttpWebClientService.getDefault();
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
                http: this.util.isObject(cB.client.web.http)
                  ? {
                    ...cB.client.web.http,
                    ...customDeepConfig, //agrega personalizacion
                  }
                  : {
                    ...df.client.web.http,
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
  protected override buildDriver(): IGenericDriver<IHttpResponse> {
    const diccConfig = this.config.diccDriverConfig;
    const driver = httpClientDriverFactoryFn(
      this.keyDrive as TKeyHttpClientDriverInstance,
      diccConfig
    );
    return driver;
  }
  public override async runRequestForPrimitive(
    iBag: IPrimitiveBag<any>
  ): Promise<IPrimitiveResponse> {
    const repo = this.buildDriver();
    const bagRepository = this.convertBagToBagService(iBag);
    const localResponse = await repo.runRequestFromDrive(bagRepository);
    const res = this.adaptDriverResponseToPrimitiveLogicResponse(
      localResponse,
      iBag
    );
    return res;
  }
  public override async runRequestForStructure(
    iBag: IStructureBag<any>
  ): Promise<IStructureResponse> {
    const repo = this.buildDriver();
    const bagRepository = this.convertBagToBagService(iBag);
    const localResponse = await repo.runRequestFromDrive(bagRepository);
    const res = this.adaptDriverResponseToStructureLogicResponse(
      localResponse,
      iBag
    );
    return res;
  }
  protected override adaptDriverResponseToPrimitiveLogicResponse(
    driverResponse: IHttpResponse,
    iBag: IPrimitiveBag<any>
  ): IPrimitiveResponse {
    const { body, httpStatus, ok, statusText, error } = driverResponse;
    const rH = this.buildPrimitiveReportHandler(iBag);
    let res = rH.mutateResponse(undefined, {
      data: this.reBuildRxDataFromHttpResponse(body, iBag.literalCriteria.expectedDataType),
      status: this.convertHttpStatusCodeToLogicStatusCode(httpStatus),
      extResponse: error,
      msn: statusText,
    });
    return res;
  }
  protected override adaptDriverResponseToStructureLogicResponse(
    driverResponse: IHttpResponse,
    iBag: IStructureBag<any>
  ): IStructureResponse {
    const { body, httpStatus, ok, statusText, error } = driverResponse;
    const rH = this.buildStructureReportHandler(iBag);
    let res = rH.mutateResponse(undefined, {
      data: this.reBuildRxDataFromHttpResponse(body, iBag.literalCriteria.expectedDataType),
      status: this.convertHttpStatusCodeToLogicStatusCode(httpStatus),
      extResponse: error,
      msn: statusText,
    });
    return res;
  }
}
