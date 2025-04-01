import {
  IPrimitiveReadCriteria,
  IPrimitiveModifyCriteria,
  IStructureModelReadCriteria,
  IStructureModelModifyCriteria,
} from "../../criterias/shared";
//import { TKeyGroupDriver as TKeyGroupServerDriver } from "./server/shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**esquema de bag exclusivo para driver */
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

//==== Primitive ======================================================================================================================
/**esquema de bag exclusivo para driver */
export interface IPrimitiveBagForDriver {
  /**objeto literal de criterios */
  literalCriteria: IPrimitiveReadCriteria | IPrimitiveModifyCriteria;
  /**datos */
  data: any;
}
//==== Structure ======================================================================================================================
/**esquema de bag exclusivo para driver */
export interface IStructureBagForDriver<TModel> {
  /**objeto literal de criterios */
  literalCriteria:
    | IStructureModelReadCriteria<TModel>
    | IStructureModelModifyCriteria<TModel>;
  /**datos */
  data: any;
}
