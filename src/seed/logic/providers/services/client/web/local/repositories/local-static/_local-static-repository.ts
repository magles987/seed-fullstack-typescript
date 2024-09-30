import { LocalRepository } from "../_local-repository";
import {} from "../shared";
import {
  TKeyLogicContext,
  TKeySrcSelector,
} from "../../../../../../../config/shared-modules";
import { ILocalStaticRepositoryConfig } from "./shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**refactorizacion de la clase */
export type Trf_LocalStaticRepository = LocalStaticRepository<any>;

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *selfconstructor*
 *
 * ...
 */
export abstract class LocalStaticRepository<TKeyActionRequest>
  extends LocalRepository
  implements ReturnType<LocalStaticRepository<TKeyActionRequest>["getDefault"]>
{
  /**@returns todos los campos con sus valores predefinidos para instancias de esta clase*/
  public static readonly getDefault = () => {
    return {
      getDB: () => {},
      srcSelector: "plural",
    } as ILocalStaticRepositoryConfig;
  };
  /**@returns todas las constantes a usar en instancias de esta clase*/
  protected static readonly getCONSTANTS = () => {
    return {};
  };
  private _getDB: () => object;
  public get getDB(): () => object {
    return this._getDB;
  }
  public set getDB(v: () => object) {
    this._getDB =
      typeof v === "function"
        ? v
        : this._getDB !== undefined
        ? this._getDB
        : this.getDefault().getDB;
  }
  private _srcSelector: TKeySrcSelector;
  public get srcSelector(): TKeySrcSelector {
    return this._srcSelector;
  }
  protected set srcSelector(v: TKeySrcSelector) {
    this._srcSelector =
      v === "plural" || v === "singular"
        ? v
        : this._srcSelector !== undefined
        ? this._srcSelector
        : this.getDefault().srcSelector;
  }
  /**
   * @param keyLogicContext clave identificadora del contexto logico
   * @param keySrc clave identificadora del recurso
   * @param base objeto literal con valores personalizados para iniicalizar las propiedades
   * @param isInit `= true` ❕Solo para herencia❕, indica si esta clase debe iniciar las propiedaes
   */
  constructor(
    keyLogicContext: TKeyLogicContext,
    base: Partial<
      ReturnType<LocalStaticRepository<TKeyActionRequest>["getDefault"]>
    > = {},
    isInit = true
  ) {
    super("static", keyLogicContext);
    if (isInit) this.initProps(base);
  }
  /**@returns todos los campos con sus valores predefinidos*/
  protected getDefault() {
    return LocalStaticRepository.getDefault();
  }
  /**@returns todas las constantes de la clase para las instancias*/
  protected getCONST() {
    return LocalStaticRepository.getCONSTANTS();
  }
  /**inicializa las propiedades de manera dinamica
   *
   * @param base objeto literal con valores personalizados para iniicalizar las propiedades
   */
  protected initProps(
    base: Partial<
      ReturnType<LocalStaticRepository<TKeyActionRequest>["getDefault"]>
    >
  ): void {
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
    key: keyof ReturnType<
      LocalStaticRepository<TKeyActionRequest>["getDefault"]
    >
  ): void {
    const df = this.getDefault();
    this[key as any] = df[key];
    return;
  }
}
