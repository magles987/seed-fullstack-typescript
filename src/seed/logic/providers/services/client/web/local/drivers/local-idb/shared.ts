import { TKeySrcSelector } from "../../../../../../../config/shared-modules";

/**esquema de configuracion para el repositorio */
export interface ILocalIDBRepositoryConfig {
  /**nombre de la base de datos simulada en local*/
  db_name?: string;
  /**numero de version de la base de datos*/
  db_version?: number;
  /**determina que tipo de clave identificadora de recurso usar */
  srcSelector: TKeySrcSelector;
}
