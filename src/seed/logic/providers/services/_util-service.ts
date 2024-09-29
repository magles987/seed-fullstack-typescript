import { Util_Module } from "../../util/util-module";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**
 * *Singleton*
 *
 * Utilidades comunes para los servicios
 *
 */
export class Util_Service extends Util_Module {
  /**  Almacena la instancia única de esta clase */
  private static Util_Service_instance: Util_Service;
  /** */
  constructor() {
    super();
  }
  /** devuelve la instancia única de esta clase
   * ya sea que la crea o la que ya a sido creada
   *
   */
  public static getInstance(): Util_Service {
    Util_Service.Util_Service_instance =
      Util_Service.Util_Service_instance === undefined ||
      Util_Service.Util_Service_instance === null
        ? new Util_Service()
        : Util_Service.Util_Service_instance;
    return Util_Service.Util_Service_instance;
  }
}
