import { Util_Logic } from "../../../../../../util/util-logic";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *Singleton*
 *
 * ...
 */
export class Util_HttpDriver extends Util_Logic {
  /**  Almacena la instancia única de esta clase */
  private static Util_HttpDriver_instance: Util_HttpDriver;
  /** */
  constructor() {
    super();
  }
  /** devuelve la instancia única de esta clase
   * ya sea que la crea o la que ya a sido creada
   */
  public static getInstance(): Util_HttpDriver {
    Util_HttpDriver.Util_HttpDriver_instance =
      Util_HttpDriver.Util_HttpDriver_instance === undefined ||
      Util_HttpDriver.Util_HttpDriver_instance == null
        ? new Util_HttpDriver()
        : Util_HttpDriver.Util_HttpDriver_instance;
    return Util_HttpDriver.Util_HttpDriver_instance;
  }
}
