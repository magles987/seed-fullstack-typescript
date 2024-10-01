import { HttpDrive } from "../_drive";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *selfconstructor*
 * *Singleton*
 * ...
 */
export class AxiosHttpDrive
  extends HttpDrive
  implements ReturnType<AxiosHttpDrive["getDefault"]>
{
  /**@returns todos los campos con sus valores predefinidos para instancias de esta clase*/
  public static readonly getDefault = () => {
    return {
      //...aqui las propiedades
    };
  };
  /**@returns todas las constantes a usar en instancias de esta clase*/
  protected static readonly getCONSTANTS = () => {
    return {
      //..aqui las constantes
    };
  };
  /**  Almacena la instancia única de esta clase */
  private static AxiosHttpDrive_instance: AxiosHttpDrive;
  /**
   * @param base objeto literal con valores personalizados para iniicalizar las propiedades
   * @param isInit `= true` ❕Solo para herencia❕, indica si esta clase debe iniciar las propiedaes
   */
  constructor(
    base: Partial<ReturnType<AxiosHttpDrive["getDefault"]>> = {},
    isInit = true
  ) {
    super("axios");
    if (isInit) this.initProps(base);
  }
  /** devuelve la instancia única de esta clase
   * ya sea que la crea o la que ya a sido creada
   *
   */
  public static getInstance(
    base: Partial<ReturnType<AxiosHttpDrive["getDefault"]>> = {}
  ): AxiosHttpDrive {
    AxiosHttpDrive.AxiosHttpDrive_instance =
      AxiosHttpDrive.AxiosHttpDrive_instance == undefined ||
      AxiosHttpDrive.AxiosHttpDrive_instance == null
        ? new AxiosHttpDrive(base)
        : AxiosHttpDrive.AxiosHttpDrive_instance;
    return AxiosHttpDrive.AxiosHttpDrive_instance;
  }
  /**@returns todos los campos con sus valores predefinidos*/
  protected getDefault() {
    return AxiosHttpDrive.getDefault();
  }
  /**@returns todas las constantes de la clase para las instancias*/
  protected getCONST() {
    return AxiosHttpDrive.getCONSTANTS();
  }
  /**inicializa las propiedades de manera dinamica
   *
   * @param base objeto literal con valores personalizados para iniicalizar las propiedades
   */
  protected initProps(
    base: Partial<ReturnType<AxiosHttpDrive["getDefault"]>>
  ): void {
    base = typeof base === "object" && base !== null ? base : {};
    for (const key in this.getDefault()) {
      this[key] = base[key];
    }
    return;
  }
  /**⚠ Reinicia todas las propiedades al valor predefinido ⚠ */
  public resetProps(): void {
    const df = this.getDefault();
    for (const key in df) {
      this[key] = df[key];
    }
    return;
  }
  /**reinicia una propiedad al valor predefinido
   *
   * @param key clave identificadora de la propiedad a reiniciar
   */
  public resetPropByKey(
    key: keyof ReturnType<AxiosHttpDrive["getDefault"]>
  ): void {
    const df = this.getDefault();
    this[key] = df[key];
    return;
  }
}
