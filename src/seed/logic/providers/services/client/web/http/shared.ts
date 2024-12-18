import { httpClientDriverFactoryFn } from "./drivers/http-driver-factory";
import { IDiccHttpDriveConfig, TKeyDiccHttpDrive } from "./drivers/shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**... */
export interface IHttpWebClientServiceRequestC {
  /** */
  diccDriverConfig?: IDiccHttpDriveConfig;
  /** */
  customHttpClientFactoryFn?: typeof httpClientDriverFactoryFn;
}
