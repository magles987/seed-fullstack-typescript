import { IHttpWebClientServiceRequestC } from "./http/shared";
import { ILocalWebClientServiceRequestC } from "./local/shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**esquema con parametros de configuracion de un servicio en contexto *client* */
export interface IWebClientServiceRequestC {
  http?: IHttpWebClientServiceRequestC;
  local?: ILocalWebClientServiceRequestC;
}
/**refactorizacion de la interfaz */
export type Trf_IWebClientServiceRequestC = IWebClientServiceRequestC;
/**... */
export type TKeyWebClientServiceRequestC = keyof IWebClientServiceRequestC;
