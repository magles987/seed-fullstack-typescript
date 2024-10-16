import { TKeyLogicContext } from "../../config/shared-modules";
import { ELogicCodeError, LogicError } from "../../errors/logic-error";
import { LocalWebClientService } from "./client/web/local/local-service";
import { IGenericService, IServiceRequestConfig } from "./shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
//====Client===========================
type TKeyWebService = "local" | "http";
//type TKeyAppService = "";
type TKeyClientService = TKeyWebService;
//| TKeyAppService
//====Server===========================
//type TKeyServerService = "";
//====Full===========================
/**claves identificadoras de las instancias
 * de servicio disponibles para fabricar */
export type TKeyServiceInstance = TKeyClientService;
//| TKeyServerService;
/**factoria de servicios
 * @param keyService clave identificadora del servicio a construir
 * @param keyLogicContext clave identificadora del contexto logico a construir
 * @param keySrc clave identificadora del recurso
 * @param configBase configuracion base completa de los servicios
 * @param customDeepConfig configuracion personalizada profunda para este un contexto de servicio especifico(si se requiere)
 */
export function serviceFactory(
  keyService: TKeyServiceInstance,
  keyLogicContext: TKeyLogicContext,
  keySrc: string,
  configBase: Partial<IServiceRequestConfig>,
  customDeepConfig: any = {}
): IGenericService {
  let instance: IGenericService;
  if (keyService === "local")
    instance = new LocalWebClientService(
      keyLogicContext,
      keySrc,
      configBase,
      customDeepConfig
    );
  else if (keyService === "http")
    instance = new LocalHttpClientService(
      keyLogicContext,
      keySrc,
      configBase,
      customDeepConfig
    );
  else
    throw new LogicError({
      code: ELogicCodeError.MODULE_ERROR,
      msn: `keyInstance does no valid key for factory`,
    });
  return instance;
}
