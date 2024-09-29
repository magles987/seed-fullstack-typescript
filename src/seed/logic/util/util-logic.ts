import { UtilExtension } from "../../util/extension-util";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** @info <hr>
 *
 * *Singleton*
 * utilidades comunes para la logica de aplicacion
 * ____
 */
export class Util_Logic extends UtilExtension {
  /**
   * Almacena la instancia única de esta clase
   * ____
   */
  private static Util_Logic_instance: Util_Logic;
  /** */
  constructor() {
    super(undefined);
  }
  /**
   * devuelve la instancia única de esta clase
   * ya sea que la crea o la que ya a sido creada
   * ____
   */
  public static getInstance(): Util_Logic {
    Util_Logic.Util_Logic_instance =
      Util_Logic.Util_Logic_instance === undefined ||
      Util_Logic.Util_Logic_instance === null
        ? new Util_Logic()
        : Util_Logic.Util_Logic_instance;
    return Util_Logic.Util_Logic_instance;
  }
}
