import { IDiccHttpDriveConfig, TKeyDiccHttpDrive } from "./shared";
import { IGenericDriver } from "../../../../shared";
import { IHttpResponse } from "../shared";
import {
  ELogicCodeError,
  LogicError,
} from "../../../../../../errors/logic-error";
import { AxiosHttpDrive } from "./axios/axios-drive";
import { FetchHttpDrive } from "./fetch/fetch-drive";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**claves identificadoras de las instancias
 * de servicio disponibles para fabricar */
export type TKeyHttpClientDriverInstance = TKeyDiccHttpDrive;
/**... */
export function httpClientDriverFactoryFn(
  keyInstance: TKeyHttpClientDriverInstance,
  diccConfig: IDiccHttpDriveConfig
): IGenericDriver<IHttpResponse> {
  let instance: IGenericDriver<IHttpResponse>;
  if (keyInstance === "fetch") instance = new FetchHttpDrive(diccConfig.fetch);
  else if (keyInstance === "axios")
    instance = new AxiosHttpDrive(diccConfig.axios);
  else {
    throw new LogicError({
      code: ELogicCodeError.MODULE_ERROR,
      msn: `${keyInstance} is not key for factory valid`,
    });
  }
  return instance;
}
