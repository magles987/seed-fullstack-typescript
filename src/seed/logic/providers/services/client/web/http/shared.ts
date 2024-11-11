import { EHttpStatusCode } from "../../../../../util/http-utilities";
import { httpClientDriverFactoryFn } from "./drive/http-driver-factory";
import { IDiccHttpDriveConfig, TKeyDiccHttpDrive } from "./drive/shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**... */
export interface IHttpResponse {
  /**cuerpo de la respuesta */
  body: string;
  /**estado básico de la petición */
  ok: boolean;
  /**mensaje adicional de estado de la petición */
  statusText: string;
  /**simula un codigo HTTP response */
  httpStatus: EHttpStatusCode;
  /**error generico */
  error?: any;
  /**cabecera de respuesta generica */
  header?: any;
}
/**... */
export interface IHttpWebClientServiceRequestC {
  /** */
  diccDriverConfig?: IDiccHttpDriveConfig;
  /** */
  customHttpClientFactoryFn?: typeof httpClientDriverFactoryFn;
}
