import { Util_Module } from "../util/util-module";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *Singleton*
 *
 * ...
 */
export class Util_Report extends Util_Module {
  /**  Almacena la instancia única de esta clase */
  private static Util_Middleware_instance: Util_Report;
  /**...*/
  constructor() {
    super();
  }
  /** devuelve la instancia única de esta clase
   * ya sea que la crea o la que ya a sido creada
   */
  public static getInstance(): Util_Report {
    Util_Report.Util_Middleware_instance =
      Util_Report.Util_Middleware_instance === undefined ||
      Util_Report.Util_Middleware_instance == null
        ? new Util_Report()
        : Util_Report.Util_Middleware_instance;
    return Util_Report.Util_Middleware_instance;
  }
}
