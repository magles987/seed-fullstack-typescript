import {
  ELogicResStatusCode,
  TKeyActionModule,
  TKeyHandlerModule,
} from "../config/shared-modules";
import { ELogicCodeError, LogicError } from "../errors/logic-error";
import { Util_Module } from "../util/util-module";
import {
  Trf_IResponseForMiddleware,
  Trf_IStructureEmbResponseForMiddleware,
  Trf_IStructureResponseForMiddleware,
} from "./module/shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *Singleton*
 *
 * ...
 */
export class Util_Middleware extends Util_Module {
  /**  Almacena la instancia única de esta clase */
  private static Util_Middleware_instance: Util_Middleware;
  /**caracter separador de la clave identificadora
   * de la funcion de middleware en el Map:
   *
   * Ejemplo:
   * ````
   * const moduleContext = "fieldVal";
   * const cKMS = "-"; //abreviado de chartKeyMiddlewareSeparator
   * //cualquier subtipo de identificacion segun el modulo
   * const keyActionConfig = "isTypeOf";
   *
   * const fullKeyMiddleware =
   *  `${moduleContext}${cKMS}${keyActionConfig}`;
   * ````
   */
  public readonly chartKeyMiddlewareSeparator = "_";
  /**...*/
  constructor() {
    super();
  }
  /** devuelve la instancia única de esta clase
   * ya sea que la crea o la que ya a sido creada
   */
  public static getInstance(): Util_Middleware {
    Util_Middleware.Util_Middleware_instance =
      Util_Middleware.Util_Middleware_instance === undefined ||
      Util_Middleware.Util_Middleware_instance == null
        ? new Util_Middleware()
        : Util_Middleware.Util_Middleware_instance;
    return Util_Middleware.Util_Middleware_instance;
  }
}
