import { TKeySrcSelector } from "../../../../../../../config/shared-modules";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**esquema de configuracion para el repositorio */
export interface ILocalStaticRepositoryConfig {
  /**callback para leer **toda** la base de datos estatica */
  getDB: () => object;
  /**determina que tipo de clave identificadora de recurso usar */
  srcSelector: TKeySrcSelector;
}
