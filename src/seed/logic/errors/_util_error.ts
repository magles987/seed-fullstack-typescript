import { Util_Module } from "../util/util-module";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *Singleton*
 *
 * utilidades del manejador de errores
 */
export class Util_Error extends Util_Module {
  /**  Almacena la instancia única de esta clase */
  private static Util_Error_instance: Util_Error;
  /** */
  constructor() {
    super();
  }
  /** devuelve la instancia única de esta clase
   * ya sea que la crea o la que ya a sido creada
   */
  public static getInstance(): Util_Error {
    Util_Error.Util_Error_instance =
      Util_Error.Util_Error_instance === undefined ||
      Util_Error.Util_Error_instance === null
        ? new Util_Error()
        : Util_Error.Util_Error_instance;
    return Util_Error.Util_Error_instance;
  }
}
