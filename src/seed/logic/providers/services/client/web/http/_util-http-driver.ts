import { Util_Logic } from "../../../../../util/util-logic";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *Singleton*
 *
 * ...
 */
export class Util_HttpLocalDriver extends Util_Logic {
  /**  Almacena la instancia única de esta clase */
  private static Util_HttpLocalDriver_instance: Util_HttpLocalDriver;
  /** */
  constructor() {
    super();
  }
  /** devuelve la instancia única de esta clase
   * ya sea que la crea o la que ya a sido creada
   */
  public static getInstance(): Util_HttpLocalDriver {
    Util_HttpLocalDriver.Util_HttpLocalDriver_instance =
      Util_HttpLocalDriver.Util_HttpLocalDriver_instance === undefined ||
      Util_HttpLocalDriver.Util_HttpLocalDriver_instance == null
        ? new Util_HttpLocalDriver()
        : Util_HttpLocalDriver.Util_HttpLocalDriver_instance;
    return Util_HttpLocalDriver.Util_HttpLocalDriver_instance;
  }
}
