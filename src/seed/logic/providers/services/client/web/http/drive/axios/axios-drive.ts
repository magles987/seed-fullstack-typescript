import { HttpDrive } from "./_drive";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████

/** *Singleton*
 *
 * descrip...
 *
 */
export class AxiosHttpDrive extends HttpDrive {
  /**  Almacena la instancia única de esta clase */
  private static AxiosHttpDrive_instance: AxiosHttpDrive;
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
  public static getInstance(): AxiosHttpDrive {
    AxiosHttpDrive.AxiosHttpDrive_instance =
      AxiosHttpDrive.AxiosHttpDrive_instance == undefined ||
      AxiosHttpDrive.AxiosHttpDrive_instance == null
        ? new AxiosHttpDrive()
        : AxiosHttpDrive.AxiosHttpDrive_instance;
    return AxiosHttpDrive.AxiosHttpDrive_instance;
  }
}
