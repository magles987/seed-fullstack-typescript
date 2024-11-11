import {
  getGlobalConfig,
  IGlobalConfig,
  setGlobalConfig,
} from "./logic/config/global-config";
import {
  setSeedEnvironment,
  ISeedEnvironment,
  getSeedEnvironment,
} from "./logic/config/seed-environment";
import { UtilNative } from "./util/native-util";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**... */
export interface IStartConfig {
  envSeed: Partial<ISeedEnvironment>;
  globalConfig: Partial<IGlobalConfig>;
}
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
const CONFIG: IStartConfig = {
  envSeed: getSeedEnvironment(),
  globalConfig: getGlobalConfig(),
};
/**determina si ya esta inicializado */
let isStarted = false;
/**inicializa la configuración de la semilla */
function start(config: IStartConfig): void {
  setCommon(config);
  isStarted = true; //no permitir mas inicializaciones
  return;
}
/**reconfigura la semilla de ser necesario
 *
 * @param config la nueva configuración a asignar
 */
export function reconfigure(config?: Partial<IStartConfig>): void {
  if (typeof config !== "object" || config === null || Array.isArray(config))
    config = {};
  setCommon(config);
  return;
}
/**asignar y ejecutar acciones comunes tanto para `start()` como para `reconfigure()` */
function setCommon(config?: Partial<IStartConfig>) {
  setSeedEnvironment(config.envSeed);
  setGlobalConfig(config.globalConfig);
  UtilNative["_dfValue"] = getGlobalConfig().globalDefaultValue; //actualización forzada para la utilidad global
}
if (!isStarted) start(CONFIG); //inicializa
