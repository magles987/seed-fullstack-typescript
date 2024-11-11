import { IAxiosConfig } from "./axios/shared";
import { IFetchConfig } from "./fetch/shared";
/**... */
export interface IUrlConfig {
  /**url raíz del recurso */
  urlRoot: string;
  /**prefijo de la url (después del root)
   *
   * Ejemplo:
   * ````
   * `${urlRoot}/${urlPrefix}....`
   * ````
   *
   */
  urlPrefix?: string;
  /**prefijo de la url (después del root)
   *
   * Ejemplo:
   * ````
   * `${urlRoot}/${urlPrefix}..../${urlPostfix}`
   * ````
   *
   */
  urlPostfix?: string;
  /**tipo de acción para la construcción de la url
   *
   * - `"basic"` indica que será con las acciones CRUD básicas ("read", "create", "update", "delete").
   * - `"custom"` indica que será con acciones personalizadas
   */
  urlActionType?: "basic" | "custom";
  /**tipo de nombre de recurso a utilizar en la url*/
  urlSrcType?: "singular" | "plural";
  /**palabra para encriptado y desencriptado con JWT */
  urlSecretKeyJWT?: string;
}
/**... */
export interface IDiccHttpDriveConfig {
  fetch?: IFetchConfig;
  axios?: IAxiosConfig;
}
/**... */
export type Trf_IDiccHttpDriveConfig = IDiccHttpDriveConfig;
/**... */
export type TKeyDiccHttpDrive = keyof IDiccHttpDriveConfig;
