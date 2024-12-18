import { ELogicCodeError, LogicError } from "../errors/logic-error";
import { Util_Module } from "../util/util-module";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** @info <hr>
 * *Singleton*
 *
 * utilidades del objeto bag module
 * ____
 */
export class Util_Bag extends Util_Module {
  /**
   * Almacena la instancia única de esta clase
   * ____
   */
  private static instance: Util_Bag;
  /**
   * descrip...
   * ____
   */
  constructor() {
    super();
  }
  /**
   * devuelve la instancia única de esta clase
   * ya sea que la crea o la que ya a sido creada
   * ____
   */
  public static getInstance(): Util_Bag {
    Util_Bag.instance =
      !Util_Bag.instance || Util_Bag.instance === null
        ? new Util_Bag()
        : Util_Bag.instance;
    return Util_Bag.instance;
  }
}
