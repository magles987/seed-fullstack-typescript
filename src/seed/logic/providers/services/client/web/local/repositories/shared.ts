import { IBagForService } from "../../../../shared";
import { ILocalCookieRepositoryConfig } from "./local-cookie/shared";
import { ILocalIDBRepositoryConfig } from "./local-idb/shared";
import { ILocalStaticRepositoryConfig } from "./local-static/shared";
import { ILocalStorageRepositoryConfig } from "./local-storage/shared";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████

/**funcion base para acciones de consulta en local
 *
 * @param bagService el bag en contexto de este driver
 * @returns promesa de dato recibido una vez ejecutada
 * la accion (sea lectura o modificacion de datos)
 */
export type TActionFn = (bagService: IBagForService) => Promise<any>;
/**... */
export interface IDiccLocalRepositoryConfig {
  static?: Partial<ILocalStaticRepositoryConfig>;
  cookie?: Partial<ILocalCookieRepositoryConfig>;
  idb?: Partial<ILocalIDBRepositoryConfig>;
  storage?: Partial<ILocalStorageRepositoryConfig>;
}
/**... */
export type Trf_IDiccLocalRepositoryConfig = IDiccLocalRepositoryConfig;
/**... */
export type TKeyDiccLocalRepository = keyof IDiccLocalRepositoryConfig;
