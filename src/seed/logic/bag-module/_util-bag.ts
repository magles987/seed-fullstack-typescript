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
  /**... */
  public readonly charSeparatorBagGlobalKeyAction = ".";
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
  /**obtener una tupla de las 3 claves
   * identificadoras de la tupla de acciones globales */
  public getTKeysFullGlobalAction(
    fullKeyGlobal: string
  ): [string, string, string?] {
    const sp = this.charSeparatorBagGlobalKeyAction;
    const tKeys = fullKeyGlobal.split(sp) as [string, string, string?];
    //❗Debe estar compuesta de entre 2 (primitive) y 3 (structure) claves SIEMPRE❗
    if (!this.isTuple(tKeys, [2, 3])) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${tKeys} is no valid global key action`,
      });
    }
    return tKeys;
  }
}
