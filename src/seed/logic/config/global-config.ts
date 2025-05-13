import {
  TKeyDiccStrategyGeneratorsIdFn,
  TCustomGenerateIdFn,
} from "../util/default-generators-id-fn";
import {
  PrimitiveModuleFactory,
  StructureModuleFactory,
} from "../modules/module-factory";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
const DF = {
  /**valor que se asume como predefinido para toda la semilla */
  globalDefaultValue: undefined as undefined | null,
  /**clave identificadora del campo que se tomará como identificador */
  keyId: "_id",
  /**estrategia para construcción interna de un  identificador estándar*/
  strategyForIdBuild: "df_uuid" as
    | TKeyDiccStrategyGeneratorsIdFn
    | TCustomGenerateIdFn,
  /**factorías*/
  diccModuleFactory: {
    /**factoría para módulos primitivos */
    primitiveModuleFactory: PrimitiveModuleFactory.getInstance(),
    /**factoría para módulos estructurados */
    structureModuleFactory: StructureModuleFactory.getInstance(),
  },
};
/**contiene la configuración */
let globalConfig = DF;
/**asignación las variables de entorno de la semilla
 *
 * @param custom configuración personalizada para las variables de entorno
 */
export function setGlobalConfig(custom: Partial<typeof DF>): void {
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
      diccModuleFactory:
        typeof c.diccModuleFactory === "object" && c.diccModuleFactory !== null
          ? {
              ...c.diccModuleFactory,
              primitiveModuleFactory:
                typeof c.diccModuleFactory.primitiveModuleFactory ===
                  "object" &&
                c.diccModuleFactory.primitiveModuleFactory !== null
                  ? c.diccModuleFactory.primitiveModuleFactory
                  : df.diccModuleFactory.primitiveModuleFactory,
              structureModuleFactory:
                typeof c.diccModuleFactory.structureModuleFactory ===
                  "object" &&
                c.diccModuleFactory.structureModuleFactory !== null
                  ? c.diccModuleFactory.structureModuleFactory
                  : df.diccModuleFactory.structureModuleFactory,
            }
          : df.diccModuleFactory,
    };
  } else {
    globalConfig = DF;
  }
  return;
}
/**... */
export function getGlobalConfig(): typeof DF {
  return globalConfig;
}
