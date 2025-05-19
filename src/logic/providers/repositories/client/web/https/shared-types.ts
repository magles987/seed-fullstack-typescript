import { TGenericContainerHttpApiResponse } from "../../../../../reports/shared-types";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**Tipo de función especial para el repository en contexto primitive */
export type THttpCustomQueryRepositoryFn<
  TRepositoryInstance,
  TLiteralCriteria,
  TCQFnReturn = Object
> = (
  thisRepository: TRepositoryInstance,
  literalCriteria: TLiteralCriteria
) => Promise<TCQFnReturn>;

/**tipo de acción para la construcción de la url
 *
 * - `"basic"` indica que será con las acciones CRUD básicas ("read", "create", "update", "delete").
 * - `"custom"` indica que será con acciones personalizadas
 */
export type TUrlActionType = "basic" | "custom";
/**tipo de contenedor en que la api externa retorna los datos de respuesta
 * - `"none"` sin contenedor
 * - `"twinbee"` contenedor de respuesta de twinbee (definido en `TGenericContainerHttpApiResponse` )
 * - Una función que extraiga y convierta el contenedor desconocido a un tipo `TGenericContainerHttpApiResponse`
 * ejemplo:
 * ````
 * //el contenedor que se recibió
 * const unknownContainer = {
 *   datitos: {} //blablabla datos,
 *   cosas: {} //blablabla mas cosas
 *   status: 200
 * }
 * //función que desempaqueta el contenedor desconocido
 * const unknownContainerFn = (unknownContainer)=> {
 *   return {
 *      ...unknownContainer,
 *      data: unknownContainer.datitos,
 *      msn: unknownContainer.message,//no se envío nada
 *      status: unknownContainer.status,
 *   }
 * }
 * unknownContainerFn(unknownContainer); //retorna los datos del contenedor en un esquema de tipo `TGenericContainerHttpApiResponse`
 * ````
 */
export type TTypeResponseContainer =
  | "none"
  | "twinBee"
  | ((unknownContainer: any) => TGenericContainerHttpApiResponse);
