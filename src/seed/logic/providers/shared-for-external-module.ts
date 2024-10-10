import { TKeyHttpClientDriverInstance } from "./services/client/web/http/drive/http-driver-factory";
import { TKeyLocalRepositoryInstance } from "./services/client/web/local/repositories/local-repository-factory";
import {
  serviceFactory,
  TKeyAllDefaultServiceInstance,
} from "./services/service-factory";
import { IServiceRequestConfig } from "./services/shared";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**claves identificadoras de las instancias de todos 
 * los drivers para servicio predefinidos disponibles */
export type TKeyAllDefaultServiceDriverInstance = TKeyHttpClientDriverInstance | TKeyLocalRepositoryInstance;
/**... */
export interface IRunProvider<
  TKeyServiceInst extends TKeyAllDefaultServiceInstance = TKeyAllDefaultServiceInstance,
  TKeyDriverInst extends TKeyAllDefaultServiceDriverInstance = TKeyAllDefaultServiceDriverInstance
> {
  /**funcion factoria personalizada para crea la instancia del servicio */
  customServiceFactoryFn?: typeof serviceFactory | undefined;
  /**array con los servicios a ejecutar */
  serviceToRun: {
    /**clave identificadora del servicio a utilizar para la peticion  */
    keyService: TKeyServiceInst;
    /**clave identificadora de driver a instanciar para ser usado por el servicio*/
    keyDriver: TKeyDriverInst;
    /**configuraciona adicionales personalizadas para el servicio */
    customDeepServiceConfig?: object; //demasiado profundo
  };
  /**configuraciones generales de **todos** los servicios disponibles */
  serviceConfig?: IServiceRequestConfig;
}
