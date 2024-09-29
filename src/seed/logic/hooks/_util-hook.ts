import { Util_Module } from "../util/util-module";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** @info <hr>
 *
 * *Singleton*
 *
 * utilidades para manejadores de Hooks
 * ____
 */
export class Util_Hook extends Util_Module {
  /**
   * Almacena la instancia única de esta clase
   * ____
   */
  private static instance: Util_Hook;
  /**
   */
  constructor() {
    super();
  }
  /**
   * devuelve la instancia única de esta clase
   * ya sea que la crea o la que ya a sido creada
   * ____
   */
  public static getInstance(): Util_Hook {
    Util_Hook.instance =
      typeof Util_Hook.instance === "undefined" || Util_Hook.instance === null
        ? new Util_Hook()
        : Util_Hook.instance;
    return Util_Hook.instance;
  }
}
