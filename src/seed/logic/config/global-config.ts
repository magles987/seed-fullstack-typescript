import {
  IDiccStrategyGeneratorsIdFn,
  TKeyDiccStrategyGeneratorsIdFn,
  TStrategyGeneratorsIdFn,
} from "../util/default-generators-id-fn";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**... */
export interface IGlobalConfig {
  /**clave identificadora del campo que
   * se tomará como identificador */
  keyId: string;
  /**estrategia para construcción interna de un  identificador estándar*/
  strategyForIdBuild: TKeyDiccStrategyGeneratorsIdFn | TStrategyGeneratorsIdFn;
  /**valor que se asume como predefinido
   * para toda la semilla */
  globalDefaultValue: undefined | null;
  /** */
}
const DF: IGlobalConfig = {
  globalDefaultValue: undefined,
  keyId: "_id",
  strategyForIdBuild: "df_uuid",
};
/**contiene la configuración */
let globalConfig: IGlobalConfig = DF;
/**asignación las variables de entorno de la semilla
 *
 * @param custom configuración personalizada para las variables de entorno
 */
export function setGlobalConfig(custom: Partial<IGlobalConfig>): void {
  if (typeof custom === "object" && custom !== null && !Array.isArray(custom)) {
    const df = DF;
    const c = custom;
    globalConfig = {
      ...c,
      keyId: typeof c.keyId === "string" ? c.keyId : df.keyId,
      globalDefaultValue:
        c.globalDefaultValue === undefined || c.globalDefaultValue === null
          ? c.globalDefaultValue
          : df.globalDefaultValue,
      strategyForIdBuild:
        typeof c.strategyForIdBuild === "string" ||
        typeof c.strategyForIdBuild === "function"
          ? c.strategyForIdBuild
          : df.strategyForIdBuild,
    };
  } else {
    globalConfig = DF;
  }
  return;
}
/**... */
export function getGlobalConfig(): IGlobalConfig {
  return globalConfig;
}
