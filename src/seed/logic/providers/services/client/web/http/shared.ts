import { EHttpStatusCode } from "../../../../../util/http-utilities";
import { httpClientDriverFactoryFn } from "./drive/http-driver-factory";
import { IDiccHttpDriveConfig, TKeyDiccHttpDrive } from "./drive/shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**... */
export interface IHttpResponse {
  /**cuerpo de la respuesta */
  body: string;
  /**estado basico de la peticion */
  ok: boolean;
  /**mensaje adicional de estado de la peticion */
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
  /** */
  urlConfig: {
    /**url raiz del recurso */
    urlRoot: string;
    /**prefijo de la url (despues del root)
     *
     * Ejemplo:
     * ````
     * `${urlRoot}/${urlPrefix}....`
     * ````
     *
     */
    urlPrefix?: string;
    /**prefijo de la url (despues del root)
     *
     * Ejemplo:
     * ````
     * `${urlRoot}/${urlPrefix}..../${urlPostfix}`
     * ````
     *
     */
    urlPostfix?: string;
  };
}
