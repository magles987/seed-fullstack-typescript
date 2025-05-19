import { IRepositoryResponse } from "../../reports/shared-types";
import { Repository } from "./_repository";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**... */
export type TRepositoryList = [Repository, ...Repository[]];
/**Tipo de función para el selector de datos del repository
 * @param repositoryResponses array con las respuestas de los repositories ejecutados
 * @returns el dato que se desea mantener
 */
export type TSelectorDataRepositoryFn = (
  repositoryResponses: IRepositoryResponse[]
) => any;
/**Tipos de selectores para los datos de los repositories
 * (comúnmente cuando hay varios repositories ejecutados
 * en una misma petición)*/
export type TSelectorDataRepository =
  | "first"
  | "last"
  | "first-success"
  | "last-success"
  | "merge-success"
  | number
  | TSelectorDataRepositoryFn;
