import { Util_Module } from "../util/util-module";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** @info <hr>
 *
 * *Singleton*
 *
 * utilidades para los manejadores de formateos
 * ____
 */
export class Util_Mutater extends Util_Module {
  /**Almacena la instancia única de esta clase*/
  private static instance: Util_Mutater;
  /** */
  constructor() {
    super();
  }
  /**devuelve la instancia única de esta clase
   * ya sea que la crea o la que ya a sido creada
   */
  public static getInstance(): Util_Mutater {
    Util_Mutater.instance =
      !Util_Mutater.instance || Util_Mutater.instance === null
        ? new Util_Mutater()
        : Util_Mutater.instance;
    return Util_Mutater.instance;
  }
}
