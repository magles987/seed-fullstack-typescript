/**esquema de configuracion para el repositorio */
export interface ILocalStaticRepositoryConfig {
  /**callback para leer **toda** la base de datos estatica */
  getDB: () => object;
}
