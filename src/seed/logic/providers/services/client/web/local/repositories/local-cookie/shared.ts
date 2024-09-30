import { TKeySrcSelector } from "../../../../../../../config/shared-modules";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**esquema de configuracion para el repositorio */
export interface ILocalCookieRepositoryConfig {
  /**tamaño maximo que aceptara la cookie (predefinido en 3Kb)*/
  maxSize: number;
  /**dias en que expirará la cookie (predefinido 1 dia)*/
  expirationDay: number;
  /**??? */
  isURIEncodeDecode: boolean;
  /**determina que tipo de clave identificadora de recurso usar */
  srcSelector: TKeySrcSelector;
}
