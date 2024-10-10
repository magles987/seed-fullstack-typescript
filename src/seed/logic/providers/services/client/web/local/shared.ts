import { EHttpStatusCode } from "../../../../../util/http-utilities";
import {
  localRepositoryFactoryFn,
} from "./repositories/local-repository-factory";
import { IDiccLocalRepositoryConfig } from "./repositories/shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**... */
export interface ILocalResponse {
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
}
/**esquema con parametros de configuracion de un servicio en contexto *client* */
export interface ILocalWebClientServiceRequestC {
  /** */
  diccRepositoryConfig?: IDiccLocalRepositoryConfig;
  /**funcion de factoria para el local */
  customLocalRepositoryFn?: typeof localRepositoryFactoryFn;
}
/**refactorizacion de la interfaz */
export type Trf_ILocalWebClientServiceRequestC = ILocalWebClientServiceRequestC;


