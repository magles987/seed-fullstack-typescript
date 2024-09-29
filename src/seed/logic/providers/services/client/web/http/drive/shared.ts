import { IAxiosConfig } from "./axios/shared";
import { IFetchConfig } from "./fetch/shared";

/**... */
export interface IDiccHttpDriveConfig {
  fetch?: IFetchConfig;
  axios?: IAxiosConfig;
}
/**... */
export type Trf_IDiccHttpDriveConfig = IDiccHttpDriveConfig;
/**... */
export type TKeyDiccHttpDrive = keyof IDiccHttpDriveConfig;
