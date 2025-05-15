import {
  IPrimitiveReadCriteria,
  IPrimitiveModifyCriteria,
  IStructureModelReadCriteria,
  IStructureModelModifyCriteria,
} from "../../criterias/shared-types";
import { Driver } from "./_driver";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████

/**función base para acciones de consulta en local
 *
 * @param literalCriteria el diccionario de criterios en contexto de este driver
 * @returns promesa de dato recibido una vez ejecutada
 * la acción (sea lectura o modificación de datos)
 */
export type TActionFn = (
  literalCriteria:
    | IPrimitiveReadCriteria
    | IPrimitiveModifyCriteria
    | IStructureModelReadCriteria<any>
    | IStructureModelModifyCriteria<any>
) => Promise<any>;
/**... */
export type TDriverList = [Driver, ...Driver[]];

//==== Primitive ======================================================================================================================

export type TPrimitiveReadLiteralCriteria = IPrimitiveReadCriteria;
export type TPrimitiveModifyLiteralCriteria = IPrimitiveModifyCriteria;
/**union de tipos de diccionario de criterios */
export type TPrimitiveLiteralCriteriaUnion =
  | TPrimitiveReadLiteralCriteria
  | TPrimitiveModifyLiteralCriteria;

//==== Structure ======================================================================================================================

export type TStructureReadLiteralCriteria<TModel> =
  IStructureModelReadCriteria<TModel>;
export type TStructureModifyLiteralCriteria<TModel> =
  IStructureModelModifyCriteria<TModel>;
/**union de tipos de diccionario de criterios */
export type TStructureLiteralCriteriaUnion<TModel> =
  | TStructureReadLiteralCriteria<TModel>
  | TStructureModifyLiteralCriteria<TModel>;
