import {
  localRepositoryFactoryFn,
  TKeyLocalRepositoryInstance,
} from "./repositories/local-repository-factory";
import { IDiccLocalRepositoryConfig } from "./repositories/shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**esquema con parametros de configuracion de un servicio en contexto *client* */
export interface ILocalWebClientServiceRequestC<
  TKeyLRI extends TKeyLocalRepositoryInstance = TKeyLocalRepositoryInstance
> {
  /**clave identificadora del repositorio local a usar*/
  keyLocalRepository: TKeyLRI;
  /** */
  diccRepositoryConfig?: IDiccLocalRepositoryConfig;
  customLocalRepositoryFn?: typeof localRepositoryFactoryFn;
}
/**refactorizacion de la interfaz */
export type Trf_ILocalWebClientServiceRequestC = ILocalWebClientServiceRequestC;
/**... */
export type TKeyLocalWebClientServiceRequestC =
  keyof ILocalWebClientServiceRequestC;
