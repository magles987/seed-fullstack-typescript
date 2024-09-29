import { Util_Module } from "../util/util-module";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** @info <hr>
 * *Singleton*
 *
 * utilidades del manejador del filtro
 * ____
 */
export class Util_Criteria extends Util_Module {
  /**
   * Almacena la instancia única de esta clase
   * ____
   */
  private static instance: Util_Criteria;
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
  public static getInstance(): Util_Criteria {
    Util_Criteria.instance =
      !Util_Criteria.instance || Util_Criteria.instance === null
        ? new Util_Criteria()
        : Util_Criteria.instance;
    return Util_Criteria.instance;
  }
}
