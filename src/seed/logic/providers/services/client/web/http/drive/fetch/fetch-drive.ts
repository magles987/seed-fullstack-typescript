import { HttpDrive } from "../_drive";
import { IDiccHttpDriveConfig } from "../shared";
import { IFetchConfig } from "./shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *singleton*
 * *selfconstructor*
 *
 * ...
 */
export class FetchHttpDrive
  extends HttpDrive
  implements ReturnType<FetchHttpDrive["getDefault"]>
{
  /**@returns todos los campos con sus valores predefinidos para instancias de esta clase*/
  public static readonly getDefault = () => {
    return {
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      credentials: "same-origin",
      cache: "default",
      redirect: "follow",
      referrer: "client",
      integrity: "",
      keepalive: false,
    } as IFetchConfig;
  };
  /**@returns todas las constantes a usar en instancias de esta clase*/
  protected static readonly getCONSTANTS = () => {
    return {
      //..aqui las constantes
    };
  };
  private _headers?: ReturnType<FetchHttpDrive["getDefault"]>["headers"];
  public get headers(): ReturnType<FetchHttpDrive["getDefault"]>["headers"] {
    return this._headers;
  }
  public set headers(v: ReturnType<FetchHttpDrive["getDefault"]>["headers"]) {
    this._headers = this.util.isObject(v)
      ? this.util.deepMergeObjects([this._headers ?? {}, v], { mode: "soft" })
      : this._headers !== undefined
      ? this._headers
      : this.getDefault().headers;
  }
  /**
   * @param base objeto literal con valores personalizados para iniicalizar las propiedades
   * @param isInit `= true` ❕Solo para herencia❕, indica si esta clase debe iniciar las propiedaes
   */
  constructor(
    base: Partial<ReturnType<FetchHttpDrive["getDefault"]>> = {},
    isInit = true
  ) {
    super("fetch");
    if (isInit) this.initProps(base);
  }
  /**@returns todos los campos con sus valores predefinidos*/
  protected getDefault() {
    return FetchHttpDrive.getDefault();
  }
  /**@returns todas las constantes de la clase para las instancias*/
  protected getCONST() {
    return FetchHttpDrive.getCONSTANTS();
  }
  /**inicializa las propiedades de manera dinamica
   *
   * @param base objeto literal con valores personalizados para iniicalizar las propiedades
   */
  protected initProps(
    base: Partial<ReturnType<FetchHttpDrive["getDefault"]>>
  ): void {
    base = typeof base === "object" && base !== null ? base : {};
    for (const key in this.getDefault()) {
      this[key] = base[key];
    }
    return;
  }
  /**⚠ Reinicia todas las propiedades al valor predefinido ⚠ */
  // public resetProps(): void {
  //   const df = this.getDefault();
  //   for (const key in df) {
  //     this[key] = df[key];
  //   }
  //   return;
  // }
  /**reinicia una propiedad al valor predefinido
   *
   * @param key clave identificadora de la propiedad a reiniciar
   */
  public resetPropByKey(
    key: keyof ReturnType<FetchHttpDrive["getDefault"]>
  ): void {
    const df = this.getDefault();
    this[key] = df[key];
    return;
  }
}
