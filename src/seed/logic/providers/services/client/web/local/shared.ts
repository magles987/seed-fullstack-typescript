import { EHttpStatusCode } from "../../../../../util/http-utilities";
import { localRepositoryFactoryFn } from "./drivers/local-repository-factory";
import { IDiccLocalRepositoryConfig } from "./drivers/shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**esquema con parametros de configuracion de un servicio en contexto *client* */
export interface ILocalWebClientServiceRequestC {
  /** */
  diccRepositoryConfig?: IDiccLocalRepositoryConfig;
  /**funcion de factoria para el local */
  customLocalRepositoryFn?: typeof localRepositoryFactoryFn;
}
/**refactorizacion de la interfaz */
export type Trf_ILocalWebClientServiceRequestC = ILocalWebClientServiceRequestC;
