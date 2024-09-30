import { TKeySrcSelector } from "../../../../../../../config/shared-modules";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**define el tipo de almacenamiento a usar */
export type TStorageType = "local" | "session";
/**esquema de configuracion para el repositorio */
export interface ILocalStorageRepositoryConfig {
  /**tipo de storages a utilizar*/
  storageType?: TStorageType;
  /**tamaño del storage a utlizar (entre 1KB y 2MB)*/
  size?: number;
  /**??? */
  isURIEncodeDecode?: boolean;
  /**determina que tipo de clave identificadora de recurso usar */
  srcSelector: TKeySrcSelector;
}
