import {
  TKeyBasicCRUD,
  TKeyLogicContext,
  TKeySrcSelector,
} from "../../../../../../../config/shared-modules";
import {
  ELogicCodeError,
  LogicError,
} from "../../../../../../../errors/logic-error";
import { LocalRepositoryDriver } from "../_local-repository";
import { QueryJsAdaptator } from "../_query-js-adaptador";
import { ILocalCookieRepositoryConfig } from "./shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**refactorizacion de la clase */
export type Trf_LocalCookieRepository = LocalCookieRepository<any>; //
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *selfconstructor*
 *
 * ...
 */
export abstract class LocalCookieRepository<TKeyActionRequest>
  extends LocalRepositoryDriver
  implements ReturnType<LocalCookieRepository<TKeyActionRequest>["getDefault"]>
{
  /**@returns todos los campos con sus valores predefinidos para instancias de esta clase*/
  public static readonly getDefault = () => {
    return {
      maxSize: 2048,
      expirationDay: 1,
      isURIEncodeDecode: false,
      srcSelector: "plural",
    } as ILocalCookieRepositoryConfig;
  };
  private _maxSize: number;
  public get maxSize(): number {
    return this._maxSize;
  }
  /**@returns todas las constantes a usar en instancias de esta clase*/
  protected static readonly getCONSTANTS = () => {
    return {
      /**tamaño maximo de la cookie permitido */
      maxSizeAllow: 3096,
      /**tamaño minimo de la cookie permitido */
      minSizeAllow: 128,
      /** */
      maxExpirationDay: 365, //un año
      /** */
      minExpirationDay: 0,
    };
  };
  protected set maxSize(v: number) {
    const { maxSizeAllow, minSizeAllow } = this.getCONST();
    this._maxSize =
      this.util.isNumber(v) && minSizeAllow < v && v >= maxSizeAllow
        ? v
        : this._maxSize !== undefined
        ? this._maxSize
        : this.getDefault().maxSize;
  }
  private _expirationDay: number;
  public get expirationDay(): number {
    return this._expirationDay;
  }
  protected set expirationDay(v: number) {
    const { maxExpirationDay, minExpirationDay } = this.getCONST();
    this._expirationDay =
      this.util.isNumber(v) && minExpirationDay < v && v >= maxExpirationDay
        ? v
        : this._expirationDay !== undefined
        ? this._expirationDay
        : this.getDefault().expirationDay;
  }
  private _isURIEncodeDecode: boolean;
  public get isURIEncodeDecode(): boolean {
    return this._isURIEncodeDecode;
  }
  protected set isURIEncodeDecode(v: boolean) {
    this._isURIEncodeDecode = this.util.isBoolean(v)
      ? v
      : this._isURIEncodeDecode !== undefined
      ? this._isURIEncodeDecode
      : this.getDefault().isURIEncodeDecode;
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
   * @param queryJsAdaptator adaptador para consultas
   * @param base objeto literal con valores personalizados para iniicalizar las propiedades
   * @param isInit `= true` ❕Solo para herencia❕, indica si esta clase debe iniciar las propiedaes
   */
  constructor(
    keyLogicContext: TKeyLogicContext,
    queryJsAdaptator: QueryJsAdaptator,
    base: Partial<
      ReturnType<LocalCookieRepository<TKeyActionRequest>["getDefault"]>
    > = {},
    isInit = true
  ) {
    super("cookie", keyLogicContext, queryJsAdaptator);
    if (isInit) this.initProps(base);
  }
  /**@returns todos los campos con sus valores predefinidos*/
  protected getDefault() {
    return LocalCookieRepository.getDefault();
  }
  /**@returns todas las constantes de la clase para las instancias*/
  protected getCONST() {
    return LocalCookieRepository.getCONSTANTS();
  }
  /**inicializa las propiedades de manera dinamica
   *
   * @param base objeto literal con valores personalizados para iniicalizar las propiedades
   */
  protected initProps(
    base: Partial<
      ReturnType<LocalCookieRepository<TKeyActionRequest>["getDefault"]>
    >
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
    key: keyof ReturnType<
      LocalCookieRepository<TKeyActionRequest>["getDefault"]
    >
  ): void {
    const df = this.getDefault();
    this[key as any] = df[key];
    return;
  }
  /**muta las propiedades masivamente */
  public mutateProps(
    base: Partial<
      Omit<
        ReturnType<LocalCookieRepository<TKeyActionRequest>["getDefault"]>,
        "" //se deja la opción de omitir abierta
      >
    >
  ): void {
    base = typeof base === "object" && base !== null ? base : ({} as any);
    for (const key in base) {
      this[key] = base[key];
    }
    return;
  }
  public override async sendRequest(
    keyGenericSrc: string,
    keyBasicCRUD: TKeyBasicCRUD,
    txData: any
  ): Promise<any> {
    if (!this.util.isString(keyGenericSrc)) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${keyGenericSrc} is not generic src key valid`,
      });
    }
    const _findIdxFn = (dt) => {
      const r = this.util.isEquivalentTo([dt, txData], {});
      return r;
    };
    let rxData: any;
    if (keyBasicCRUD === "read") {
      rxData = await this.getData(keyGenericSrc);
    } else if (keyBasicCRUD === "create") {
      let aData = (await this.getData(keyGenericSrc)) as any[];
      const fIdx = aData.findIndex(_findIdxFn);
      if (fIdx === -1) aData.push(txData); //crearlo
      else aData[fIdx] = txData; //actualizarlo forzado
      await this.setData(aData, keyBasicCRUD);
      rxData = txData;
    } else if (keyBasicCRUD === "update") {
      let aData = (await this.getData(keyGenericSrc)) as any[];
      const fIdx = aData.findIndex(_findIdxFn);
      if (fIdx === -1) aData.push(txData); //crearlo forzado
      else aData[fIdx] = txData; //actualizarlo
      await this.setData(aData, keyBasicCRUD);
      rxData = txData;
    } else if (keyBasicCRUD === "delete") {
      let aData = (await this.getData(keyGenericSrc)) as any[];
      const fIdx = aData.findIndex(_findIdxFn);
      if (fIdx >= 0) aData.splice(fIdx, 1); //Eliminación
      await this.setData(aData, keyBasicCRUD);
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${keyBasicCRUD} is not basic CRUD key valid`,
      });
    }
    return rxData;
  }
  /**
   * descrip...
   * ____
   * @param
   * ____
   * @returns ``
   *
   */
  private async setCookie(keyCookie: string, strValue: string) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + this.expirationDay);
    const strED = `expires=${expirationDate.toUTCString()}`;
    const path = `path=/`;
    if (this.isURIEncodeDecode) {
      strValue = encodeURIComponent(strValue); //la convierte en caracteres de URI para en via por http
    }
    strValue = `${keyCookie}=${strValue}`;
    const cookie = `${strValue}; ${strED}; ${path}`;
    //analizar tamaño
    const cookieSize = cookie.length;
    if (cookieSize > this.maxSize) {
      throw new LogicError({
        code: ELogicCodeError.OVERFLOW,
        msn: `${cookieSize} exceds the allowed capacity of the cookie, max allow is ${this.maxSize} Bytes`,
      });
    }
    document.cookie = cookie;
    return;
  }
  /**
   * descrip...
   * ____
   * @param
   * ____
   * @returns ``
   *
   */
  protected async setData(data: any, keySrcContext: string) {
    const strData = JSON.stringify(data);
    await this.setCookie(keySrcContext, strData);
    return data;
  }
  /**
   * @param keyCookie
   * @returns
   */
  private async getCookie(keyCookie: string) {
    const cookies = document.cookie.split(";");
    const strKeyCookie = `${keyCookie}=`;
    let strValue = "";
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.indexOf(strKeyCookie) === 0) {
        strValue = cookie.substring(strKeyCookie.length);
        if (this.isURIEncodeDecode) {
          strValue = decodeURIComponent(strValue); //decodifica el string URI
        }
      }
    }
    return strValue;
  }
  /**
   * descrip...
   * ____
   * @param
   * ____
   * @returns ``
   *
   */
  protected async getData(keySrcContext: string): Promise<any> {
    let strData = await this.getCookie(keySrcContext);
    strData = strData != "" && strData != undefined ? strData : "[]";
    const data = JSON.parse(strData);
    return data;
  }
  /**🛑Elimina todas las cookies de la aplicación🛑 */
  public static async emptyAllCookies(): Promise<void> {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
    return;
  }
}
