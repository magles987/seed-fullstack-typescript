import { IBagForDriver } from "../../../shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**tipo de acción para la construcción de la url
 *
 * - `"basic"` indica que será con las acciones CRUD básicas ("read", "create", "update", "delete").
 * - `"custom"` indica que será con acciones personalizadas
 */
export type TUrlActionType = "basic" | "custom";
/**Tipo de función especial para el driver */
export type THttpCustomQueryDriverFn<TDriverInstance, TCQFnReturn = Object> = (
  thisDriver: TDriverInstance,
  literalBag: IBagForDriver
) => Promise<TCQFnReturn>;
