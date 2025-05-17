import { IDriverResponse } from "../../reports/shared-types";
import { Driver } from "./_driver";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**... */
export type TDriverList = [Driver, ...Driver[]];
/**Tipo de función para el selector de datos del driver
 * @param driverResponses array con las respuestas de los drivers ejecutados
 * @returns el dato que se desea mantener
 */
export type TSelectorDataDriverFn = (driverResponses: IDriverResponse[]) => any;
/**Tipos de selectores para los datos de los drivers
 * (comúnmente cuando hay varios drivers ejecutados
 * en una misma petición)*/
export type TSelectorDataDriver =
  | "first"
  | "last"
  | "first-success"
  | "last-success"
  | "merge-success"
  | number
  | TSelectorDataDriverFn;
