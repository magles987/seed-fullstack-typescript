import { Util_Module } from "../util/util-module";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**
 * *Singleton*
 *
 * Utilidades comunes para los proveedores de servicio
 *
 */
export class Util_Provider extends Util_Module {
  /**  Almacena la instancia única de esta clase */
  private static Util_Provider_instance: Util_Provider;
  /**
   * descrip...
   *
   */
  constructor() {
    super();
  }
  /** devuelve la instancia única de esta clase
   * ya sea que la crea o la que ya a sido creada
   *
   */
  public static getInstance(): Util_Provider {
    Util_Provider.Util_Provider_instance =
      Util_Provider.Util_Provider_instance === undefined ||
      Util_Provider.Util_Provider_instance === null
        ? new Util_Provider()
        : Util_Provider.Util_Provider_instance;
    return Util_Provider.Util_Provider_instance;
  }
}
