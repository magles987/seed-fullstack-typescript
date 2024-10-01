import {
  ELogicCodeError,
  LogicError,
} from "../../../../../../../errors/logic-error";
import { LocalRepository } from "../_local-repository";
import {
  TKeyLogicContext,
  TKeySrcSelector,
} from "../../../../../../../config/shared-modules";
import { ILocalStorageRepositoryConfig, TStorageType } from "./shared";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**Refactorizacion de la clase */
export type Trf_LocalStorageRepository = LocalStorageRepository<any>;

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *selfconstructor*
 *
 * ...
 */
export abstract class LocalStorageRepository<TKeyActionRequest>
  extends LocalRepository
  implements
    ReturnType<LocalStorageRepository<TKeyActionRequest>["getDefault"]>
{
  /**@returns todos los campos con sus valores predefinidos para instancias de esta clase*/
  public static readonly getDefault = () => {
    return {
      storageType: "session" as TStorageType,
      size: 1000000, //1MB
      isURIEncodeDecode: false,
      srcSelector: "plural",
    } as ILocalStorageRepositoryConfig;
  };
  /**@returns todas las constantes a usar en instancias de esta clase*/
  protected static readonly getCONSTANTS = () => {
    return {
      maxStorageSizeAllow: 2000000, //2MB (los storage dicen soportar hasta 5MB pero ocupan doble byte de almacenamiento, por lo tanto son 2.5MB reales)
      minStorageSizeAllow: 1000, //1KB
    };
  };
  private _storageType: TStorageType;
  public get storageType(): TStorageType {
    return this._storageType;
  }
  protected set storageType(v: TStorageType) {
    this._storageType =
      this.util.isString(v) && (v === "local" || v === "session")
        ? v
        : this._storageType !== undefined
        ? this._storageType
        : this.getDefault().storageType;
  }
  private _size: number;
  public get size(): number {
    return this._size;
  }
  protected set size(v: number) {
    const {
      maxStorageSizeAllow: maxStorageAllow,
      minStorageSizeAllow: minStorageAllow,
    } = this.getCONST();
    this._size =
      this.util.isNumber(v) && minStorageAllow < v && maxStorageAllow >= v
        ? v
        : this._size !== undefined
        ? this._size
        : this.getDefault().size;
  }
  private _isURIEncodeDecode: boolean;
  public get isURIEncodeDecode(): boolean {
    return this._isURIEncodeDecode;
  }
  public set isURIEncodeDecode(v: boolean) {
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
   * @param base objeto literal con valores personalizados para iniicalizar las propiedades
   * @param isInit `= true` ❕Solo para herencia❕, indica si esta clase debe iniciar las propiedaes
   */
  constructor(
    keyLogicContext: TKeyLogicContext,
    base: Partial<
      ReturnType<LocalStorageRepository<TKeyActionRequest>["getDefault"]>
    > = {},
    isInit = true
  ) {
    super("storage", keyLogicContext);
    if (isInit) this.initProps(base);
  }
  /**@returns todos los campos con sus valores predefinidos*/
  protected getDefault() {
    return LocalStorageRepository.getDefault();
  }
  /**@returns todas las constantes de la clase para las instancias*/
  protected getCONST() {
    return LocalStorageRepository.getCONSTANTS();
  }
  /**inicializa las propiedades de manera dinamica
   *
   * @param base objeto literal con valores personalizados para iniicalizar las propiedades
   */
  protected initProps(
    base: Partial<
      ReturnType<LocalStorageRepository<TKeyActionRequest>["getDefault"]>
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
      LocalStorageRepository<TKeyActionRequest>["getDefault"]
    >
  ): void {
    const df = this.getDefault();
    this[key as any] = df[key];
    return;
  }
  /**caulcular el tamaño actual del storage */
  private async calcStorageSize(): Promise<number> {
    let size = 0;
    const utf_factor = 2; //los storages almacenan en utf-16 (2 bytes) por caracter
    if (this.storageType === "local") {
      const len = localStorage.length;
      for (let idx = 0; idx < len; idx++) {
        const keyItem = localStorage.key(idx);
        const item = localStorage.getItem(keyItem);
        size += (keyItem.length + item.length) * utf_factor;
      }
    } else if (this.storageType === "session") {
      const len = sessionStorage.length;
      for (let idx = 0; idx < len; idx++) {
        const keyItem = sessionStorage.key(idx);
        const item = sessionStorage.getItem(keyItem);
        size += (keyItem.length + item.length) * utf_factor;
      }
    } else {
      throw new LogicError({
        code: ELogicCodeError.NOT_EXIST,
        msn: `${this.storageType} does not valid storage type`,
      });
    }
    return size;
  }
  /**
   * descrip...
   * ____
   * @param
   * ____
   * @returns ``
   *
   */
  private async setStorage(keyStorage: string, strValue: string) {
    if (this.isURIEncodeDecode) {
      strValue = encodeURIComponent(strValue); //la convierte en caracteres de URI para en via por http
    }
    //analizar tamaño a futuro que quedaria despues de almacenar
    const postStorageSize = (await this.calcStorageSize()) + strValue.length;
    if (postStorageSize > this.size) {
      throw new LogicError({
        code: ELogicCodeError.OVERFLOW,
        msn: `${postStorageSize} exceds the allowed capacity of the storage, max allow is ${this.size} Bytes`,
      });
    }
    if (this.storageType === "local") {
      localStorage.setItem(keyStorage, strValue);
    } else if (this.storageType === "session") {
      sessionStorage.setItem(keyStorage, strValue);
    } else {
      throw new LogicError({
        code: ELogicCodeError.NOT_EXIST,
        msn: `${this.storageType} does not valid storage type`,
      });
    }
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
    await this.setStorage(keySrcContext, strData);
    return data;
  }
  /**
   * @param localCookieConfig
   * @param keyStorage
   * @returns
   */
  private async getStorage(keyStorage: string) {
    let strValue: string;
    if (this.storageType === "local") {
      strValue = localStorage.getItem(keyStorage);
    } else if (this.storageType === "session") {
      strValue = sessionStorage.getItem(keyStorage);
    } else {
      throw new LogicError({
        code: ELogicCodeError.NOT_EXIST,
        msn: `${this.storageType} does not valid storage type`,
      });
    }
    if (this.isURIEncodeDecode) {
      strValue = decodeURIComponent(strValue); //decodifica el string URI
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
    let strData = await this.getStorage(keySrcContext);
    strData = strData != "" && strData != undefined ? strData : "[]";
    const data = JSON.parse(strData);
    return data;
  }
  /**... */
  public static async emptyAllStorage(
    keyScope: "session" | "local" | "both" = "both"
  ): Promise<void> {
    if (keyScope === "session") {
      sessionStorage.clear();
    } else if (keyScope === "local") {
      localStorage.clear();
    } else if (keyScope === "both") {
      localStorage.clear();
      sessionStorage.clear();
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${keyScope} is not scope key valid`,
      });
    }
    return;
  }
}
