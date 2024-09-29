import { IAppClientServiceRequestC } from "./app/shared";
import { IWebClientServiceRequestC } from "./web/shared";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**esquema con parametros de configuracion de un servicio en contexto *client* */
export interface IClientServiceRequestC {
  app?: IAppClientServiceRequestC;
  web?: IWebClientServiceRequestC;
}
/**refactorizacion de la interfaz */
export type Trf_IClientServiceRequestC = IClientServiceRequestC;
/**... */
export type TKeyClientServiceRequestC = keyof IClientServiceRequestC;
