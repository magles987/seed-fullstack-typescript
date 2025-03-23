import {
  IPrimitiveReadCriteria,
  IPrimitiveModifyCriteria,
  IStructureModelReadCriteria,
  IStructureModelModifyCriteria,
} from "../../criterias/shared";
//import { TKeyGroupDriver as TKeyGroupServerDriver } from "./server/shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**esquema de bag exclusivo para servicio */
export interface IBagForDriver {
  /**objeto literal de criterios */
  literalCriteria:
    | IPrimitiveReadCriteria
    | IPrimitiveModifyCriteria
    | IStructureModelReadCriteria<any>
    | IStructureModelModifyCriteria<any>;
  /**datos */
  data: any;
}
/**función base para acciones de consulta en local
 *
 * @param bagDriver el bag en contexto de este driver
 * @returns promesa de dato recibido una vez ejecutada
 * la acción (sea lectura o modificación de datos)
 */
export type TActionFn = (bagDriver: IBagForDriver) => Promise<any>;
