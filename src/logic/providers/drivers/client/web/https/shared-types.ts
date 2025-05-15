import {
  TPrimitiveLiteralCriteriaUnion,
  TStructureLiteralCriteriaUnion,
} from "../../../shared-types";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**Tipo de función especial para el driver */
export type TPrimitiveHttpCustomQueryDriverFn<
  TDriverInstance,
  TCQFnReturn = Object
> = (
  thisDriver: TDriverInstance,
  literalCriteria: TPrimitiveLiteralCriteriaUnion
) => Promise<TCQFnReturn>;
/**Tipo de función especial para el driver */
export type TStructureHttpCustomQueryDriverFn<
  TDriverInstance,
  TModel,
  TCQFnReturn = Object
> = (
  thisDriver: TDriverInstance,
  literalCriteria: TStructureLiteralCriteriaUnion<any>
) => Promise<TCQFnReturn>;
/**tipo de acción para la construcción de la url
 *
 * - `"basic"` indica que será con las acciones CRUD básicas ("read", "create", "update", "delete").
 * - `"custom"` indica que será con acciones personalizadas
 */
export type TUrlActionType = "basic" | "custom";
