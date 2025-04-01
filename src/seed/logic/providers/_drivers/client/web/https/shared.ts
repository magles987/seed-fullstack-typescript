import {
  IPrimitiveBagForDriver,
  IStructureBagForDriver,
} from "../../../shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**Tipo de función especial para el driver */
export type TPrimitiveHttpCustomQueryDriverFn<
  TDriverInstance,
  TCQFnReturn = Object
> = (
  thisDriver: TDriverInstance,
  literalBag: IPrimitiveBagForDriver
) => Promise<TCQFnReturn>;
/**Tipo de función especial para el driver */
export type TStructureHttpCustomQueryDriverFn<
  TDriverInstance,
  TModel,
  TCQFnReturn = Object
> = (
  thisDriver: TDriverInstance,
  literalBag: IStructureBagForDriver<TModel>
) => Promise<TCQFnReturn>;
/**tipo de acción para la construcción de la url
 *
 * - `"basic"` indica que será con las acciones CRUD básicas ("read", "create", "update", "delete").
 * - `"custom"` indica que será con acciones personalizadas
 */
export type TUrlActionType = "basic" | "custom";
