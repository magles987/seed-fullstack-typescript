/**esquema de Environment para la semilla */
export interface ISeedEnvironment {
  /**la capa de entorno donde se esta ejecutando esta semilla*/
  envGlobalLayout: "client" | "server";
  /**el entorno estándar de ejecución */
  envStandard: "dev" | "prod";
  /**el entorno de pruebas (totalmente ignorado
   * si el entorno standard es `"prod"`) */
  envTest: "test-node" | "test-browser";
}
const DF: ISeedEnvironment = {
  envGlobalLayout: "server",
  envStandard: "dev",
  envTest: "test-node",
};
/**contiene la configuración de entorno */
let seedEnvironment: ISeedEnvironment = DF;
/**asignación las variables de entorno de la semilla
 *
 * @param custom configuración personalizada para las variables de entorno
 */
export function setSeedEnvironment(custom: Partial<ISeedEnvironment>): void {
  if (typeof custom === "object" && custom !== null && !Array.isArray(custom)) {
    const df = DF;
    const c = custom;
    seedEnvironment = {
      ...c,
      envGlobalLayout:
        c.envGlobalLayout === "client" || c.envGlobalLayout === "server"
          ? c.envGlobalLayout
          : df.envGlobalLayout,
      envStandard:
        c.envStandard === "dev" || c.envStandard === "prod"
          ? c.envStandard
          : df.envStandard,
      envTest:
        c.envTest === "test-node" || c.envTest === "test-browser"
          ? c.envTest
          : df.envTest,
    };
  } else {
    seedEnvironment = DF;
  }
  return;
}
/**obtener las variable sde entorno para la semilla*/
export function getSeedEnvironment(): ISeedEnvironment {
  return seedEnvironment;
}
