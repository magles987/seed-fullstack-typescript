import { GlobalConfig } from "./config/global-config";
import { TDeepPartial } from "./util/shared-types";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**determina si ya esta inicializado */
let globalConfig: GlobalConfig = undefined;
/**inicializa la configuración del gemelo */
export default function startTwinBee( //❗❗Debe ser exportación default❗❗
  baseConfig: TDeepPartial<ReturnType<GlobalConfig["getDefault"]>>
): GlobalConfig {
  if (globalConfig !== undefined) globalConfig;
  globalConfig = GlobalConfig.getInstance(baseConfig);
  return globalConfig;
}
