import {
  serviceFactory,
  TKeyServiceInstance,
} from "./services/service-factory";
import { IServiceRequestConfig } from "./services/shared";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
export type TKeyRunProvider = "runProvider";
/**Accion de configuracion especial para el modulo provider */
/**... */
export interface IServiceConfigToRun<TKeySI> {
  /**clave identificadora del servicio a utilizar para la peticion  */
  keyService: TKeySI; //es un tipado muy profundo
  /**configuraciona adicionales personalizadas para el servicio */
  customDeepServiceConfig?: object; //demasiado profundo
}
/**... */
export interface IRunProvider<
  TKeySI extends TKeyServiceInstance = TKeyServiceInstance
> {
  /**funcion factoria personalizada para crea la instancia del servicio */
  customServiceFactoryFn?: typeof serviceFactory | undefined;
  servicesToRun: Array<IServiceConfigToRun<TKeySI>>;
  /**configuraciones generales de **todos** los servicios disponibles */
  serviceConfig?: IServiceRequestConfig;
}
