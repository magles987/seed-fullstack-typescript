import { Util_Module } from "../util/util-module";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** @info <hr>
 *
 * *Singleton*
 *
 * utilidades para el controlador
 * ____
 */
export class Util_Ctrl extends Util_Module {
  /**Almacena la instancia única de esta clase*/
  private static instance: Util_Ctrl;
  /** */
  constructor() {
    super();
  }
  /**
   * devuelve la instancia única de esta clase
   * ya sea que la crea o la que ya a sido creada
   */
  public static getInstance(): Util_Ctrl {
    Util_Ctrl.instance =
      typeof Util_Ctrl.instance === "undefined" || Util_Ctrl.instance === null
        ? new Util_Ctrl()
        : Util_Ctrl.instance;
    return Util_Ctrl.instance;
  }
}
