import {
  ELogicCodeError,
  LogicError,
} from "../../../../../../errors/logic-error";
import { Util_Module } from "../../../../../../util/util-module";
import {
  TPrimitiveModifyLiteralCriteria,
  TPrimitiveReadLiteralCriteria,
  TStructureModifyLiteralCriteria,
  TStructureReadLiteralCriteria,
} from "../../../../shared-types";
import { LocalRepositoryDriver } from "../_local-repository-driver";
import {
  TPrimitiveLocalRepositoryCustomQueryDriverFn,
  TStructureLocalRepositoryCustomQueryDriverFn,
} from "../shared-types"; //❗Desde el padre❗
import {
  PrimitiveLibraryCookieQueryFn,
  StructureLibraryCookieQueryFn,
} from "./library-cookie-query-fn";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *selfcontructor*
 *
 * ...
 */
export class CookieDriver
  extends LocalRepositoryDriver
  implements ReturnType<CookieDriver["getDefault"]>
{
  public static readonly getNameLogicDriver = () => {
    const util = Util_Module.getInstance();
    //const sp = util.charSeparatorLogicName;
    const prefixGroupName = LocalRepositoryDriver.getNameLogicDriver();
    let name = "cookie";
    name = `${prefixGroupName}${name}`;
    return name;
  };
  /**librería de funciones para consulta*/
  protected static primitiveLibraryQueryFn =
    PrimitiveLibraryCookieQueryFn.getInstance(); //❗Solo set para acceder❗, el get es personalizado
  /**librería de funciones para consulta*/
  protected static structureLibraryQueryFn =
    StructureLibraryCookieQueryFn.getInstance(); //❗Solo set para acceder❗, el get es personalizado
  public static override readonly getDefault = () => {
    const superDf = LocalRepositoryDriver.getDefault();
    return {
      ...superDf,
      /**tamaño máximo que aceptara la cookie (predefinido en 3Kb)*/
      maxSize: 2048,
      /**Dias en que expirará la cookie (predefinido 1 dia)*/
      expirationDay: 1,
      /**??? */
      isURIEncodeDecode: false,
    };
  };
  protected static override readonly getCONSTANTS = () => {
    const superCONST = LocalRepositoryDriver.getCONSTANTS();
    return {
      ...superCONST,
      /**tamaño máximo de la cookie permitido */
      MAX_SIZE_ALLOW: 3096,
      /**tamaño mínimo de la cookie permitido */
      MIN_SIZE_ALLOW: 128,
      /** */
      MAX_EXPIRATION_DAY: 365, //un año
      /** */
      MIN_EXPIRATION_DAY: 0,
      /**carácter separador de cookies */
      COOKIE_CHART_SEPARATE: ";",
    };
  };
  public override nameLogicDriver = CookieDriver.getNameLogicDriver();
  private _maxSize: number;
  public get maxSize(): number {
    return this._maxSize;
  }
  protected set maxSize(v: number) {
    const { MAX_SIZE_ALLOW: maxSizeAllow, MIN_SIZE_ALLOW: minSizeAllow } =
      this.getCONST();
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
    const {
      MAX_EXPIRATION_DAY: maxExpirationDay,
      MIN_EXPIRATION_DAY: minExpirationDay,
    } = this.getCONST();
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
  /**
   * @param base objeto literal con valores personalizados para inicializar las propiedades
   * @param isInit `= true` ❕Solo para herencia❕, indica si esta clase debe iniciar las propiedaes
   */
  constructor(
    base: Partial<ReturnType<CookieDriver["getDefault"]>> = {},
    isInit = true
  ) {
    super(base, false);
    if (isInit) this.initProps(base);
  }
  protected override getDefault() {
    return CookieDriver.getDefault();
  }
  protected override getCONST() {
    return CookieDriver.getCONSTANTS();
  }
  //❗normalmente definidas en el padre, salvo que se quieran sobreescribir❗
  // /**inicializa las propiedades de manera dinamica
  //  *
  //  * @param base objeto literal con valores personalizados para iniicalizar las propiedades
  //  */
  // protected override initProps(base: Partial<ReturnType<CookieDriver["getDefault"]>>): void {
  //   for (const key in this.getDefault()) {
  //     this[key] = base[key];
  //   }
  //   return;
  // }
  // /**reinicia una propiedad al valor predefinido
  //  *
  //  * @param key clave identificadora de la propiedad a reiniciar
  //  */
  // public override resetPropByKey(key: keyof ReturnType<CookieDriver["getDefault"]>): void {
  //   const df = this.getDefault();
  //   this[key] = df[key];
  //   return;
  // }
  public override mutateProps(
    base: Partial<ReturnType<CookieDriver["getDefault"]>>
  ): void {
    super.mutateProps(base);
    return;
  }
  public override getLiteral(): ReturnType<CookieDriver["getDefault"]> {
    return super.getLiteral() as any;
  }
  /**obtienen la librería de funciones de consultas
   *
   * @type `TValue` el tipo de dato a procesar
   * @type `TCustomLibrary` si la librería es totalmente
   * personalizada se debe definir en nombre de la clase de
   * la librería personalizada (esta librería debió ser asignada
   * a por medio del método `setPrimitiveLibraryQueryFn()` antes de poderse usar)
   */
  public static getPrimitiveLibraryQueryFn<
    TValue,
    TCustomLibrary extends PrimitiveLibraryCookieQueryFn<TValue> = PrimitiveLibraryCookieQueryFn<TValue>
  >(): TCustomLibrary {
    return CookieDriver.primitiveLibraryQueryFn as TCustomLibrary;
  }
  /**asignar librería totalmente personalizada a la propiedad
   * que almacena dicha librería */
  public static setPrimitiveLibraryQueryFn<
    TCustomLibrary extends PrimitiveLibraryCookieQueryFn<any>
  >(v: TCustomLibrary): void {
    const util = Util_Module.getInstance();
    if (!util.isInstance(v)) return;
    CookieDriver.primitiveLibraryQueryFn = v;
  }
  /**obtienen la librería de funciones de consultas
   *
   * @type `TModel` el tipo de dato a procesar
   * @type `TCustomLibrary` si la librería es totalmente
   * personalizada se debe definir en nombre de la clase de
   * la librería personalizada (esta librería debió ser asignada
   * a por medio del método `setStructureLibraryQueryFn()` antes de poderse usar)
   */
  public static getStructureLibraryQueryFn<
    TModel,
    TCustomLibrary extends StructureLibraryCookieQueryFn<TModel> = StructureLibraryCookieQueryFn<TModel>
  >(): TCustomLibrary {
    return CookieDriver.structureLibraryQueryFn as TCustomLibrary;
  }
  /**asignar librería totalmente personalizada a la propiedad
   * que almacena dicha librería */
  public static setStructureLibraryQueryFn<
    TCustomLibrary extends StructureLibraryCookieQueryFn<any>
  >(v: TCustomLibrary): void {
    const util = Util_Module.getInstance();
    if (!util.isInstance(v)) return;
    CookieDriver.structureLibraryQueryFn = v;
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
    const sp_c = CookieDriver.getCONSTANTS().COOKIE_CHART_SEPARATE;
    const cookies = document.cookie.split(sp_c);
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
  public async emptyAllCookies(): Promise<void> {
    await CookieDriver.emptyAllCookies();
    return;
  }
  /**🛑Elimina todas las cookies de la aplicación🛑 */
  public static async emptyAllCookies(): Promise<void> {
    const sp_c = CookieDriver.getCONSTANTS().COOKIE_CHART_SEPARATE;
    const cookies = document.cookie.split(sp_c);
    for (const cookie of cookies) {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
    return;
  }
  //████ CRUD by Bag ████████████████████████████████████████████████████████████
  protected override async primitiveReadByLiteralCriteria(
    literalCriteria: TPrimitiveReadLiteralCriteria
  ) {
    let { data } = literalCriteria;
    const keySrcContext = this.getKeySrcContext(
      this.srcSelector,
      literalCriteria
    );
    let registers = await this.getData(keySrcContext);
    registers = this.util.isNotUndefinedAndNotNull(registers)
      ? Array.isArray(registers)
        ? registers
        : [registers]
      : [];
    //desempaquetar primitive data
    registers = (registers as any[]).map((data) => data[keySrcContext]);
    //selecciona el tipo de lectura:
    const customQueryDriverFn = this.getCustomQueryFn(literalCriteria);
    if (this.util.isFunction(customQueryDriverFn)) {
      //personalizada
      const fn =
        customQueryDriverFn as TPrimitiveLocalRepositoryCustomQueryDriverFn<
          this,
          any
        >;
      registers = await fn(this, literalCriteria, registers);
    } else {
      //estándar
    }
    //verificación para ordenamiento y paginado
    if (
      this.util.isArray(registers) &&
      literalCriteria.expectedDataType === "array"
    ) {
      registers = await this.queryTool.primitiveOrderByBagCriteria(
        registers,
        literalCriteria
      );
      registers = await this.queryTool.primitivePageByBagCriteria(
        registers,
        literalCriteria
      );
    }
    data = registers;
    return data;
  }
  protected override async primitiveCreateByLiteralCriteria(
    literalCriteria: TPrimitiveModifyLiteralCriteria
  ) {
    let { data } = literalCriteria;
    const keySrcContext = this.getKeySrcContext(
      this.srcSelector,
      literalCriteria
    );
    let registers = (await this.getData(keySrcContext)) as any[];
    registers = Array.isArray(registers) ? registers : [registers];
    const idxCData = registers.findIndex((dt) =>
      this.util.isEquivalentTo([dt, data], {})
    );
    //verificar si ya esta creado
    const isExist = idxCData > -1;
    if (isExist) {
      const { isCreateOrUpdate } =
        literalCriteria as TPrimitiveModifyLiteralCriteria;
      if (!isCreateOrUpdate) {
        //ya esta creado y no se permite su actualización
        throw new LogicError({
          code: ELogicCodeError.EXIST,
          msn: `document with data : ${LogicError.valueToString(
            data
          )} id has not created because exist`,
        });
      }
      return await this.primitiveUpdateByLiteralCriteria(literalCriteria);
    }
    //selecciona el tipo de creación:
    const customQueryDriverFn = this.getCustomQueryFn(literalCriteria);
    if (this.util.isFunction(customQueryDriverFn)) {
      //personalizada
      const fn =
        customQueryDriverFn as TPrimitiveLocalRepositoryCustomQueryDriverFn<
          this,
          any
        >;
      registers = await fn(this, literalCriteria, registers);
    } else {
      //estándar
      registers.push(data);
    }
    await this.setData(registers, keySrcContext);
    return data;
  }
  protected override async primitiveUpdateByLiteralCriteria(
    literalCriteria: TPrimitiveModifyLiteralCriteria
  ) {
    let { data } = literalCriteria;
    const keySrcContext = this.getKeySrcContext(
      this.srcSelector,
      literalCriteria
    );
    let registers = await this.getData(keySrcContext);
    const idxCData = registers.findIndex((dt) =>
      this.util.isEquivalentTo([dt, data], {})
    );
    //verificar si no esta creado
    const isExist = idxCData > -1;
    if (!isExist) {
      const { isCreateOrUpdate } =
        literalCriteria as TPrimitiveModifyLiteralCriteria;
      if (!isCreateOrUpdate) {
        //no esta creado y no se permite su creación
        throw new LogicError({
          code: ELogicCodeError.NOT_EXIST,
          msn: `document with data : ${LogicError.valueToString(
            data
          )} id has not updated because not exist`,
        });
      }
      return await this.primitiveCreateByLiteralCriteria(literalCriteria);
    }
    //selecciona el tipo de actualización:
    const customQueryDriverFn = this.getCustomQueryFn(literalCriteria);
    if (this.util.isFunction(customQueryDriverFn)) {
      //personalizada
      const fn =
        customQueryDriverFn as TPrimitiveLocalRepositoryCustomQueryDriverFn<
          this,
          any
        >;
      registers = await fn(this, literalCriteria, registers);
    } else {
      //estándar
      registers[idxCData] = data;
    }
    await this.setData(registers, keySrcContext);
    return data;
  }
  protected override async primitiveDeleteByLiteralCriteria(
    literalCriteria: TPrimitiveModifyLiteralCriteria
  ) {
    let { data } = literalCriteria;
    const keySrcContext = this.getKeySrcContext(
      this.srcSelector,
      literalCriteria
    );
    let registers = (await this.getData(keySrcContext)) as any[];
    registers = Array.isArray(registers) ? registers : [registers];
    const fIdx = registers.findIndex((dt) =>
      this.util.isEquivalentTo([dt, data], {})
    );
    const isExist = fIdx >= 0;
    if (!isExist) return data;
    //selecciona el tipo de eliminación:
    const customQueryDriverFn = this.getCustomQueryFn(literalCriteria);
    if (this.util.isFunction(customQueryDriverFn)) {
      //personalizada
      const fn =
        customQueryDriverFn as TPrimitiveLocalRepositoryCustomQueryDriverFn<
          this,
          any
        >;
      registers = await fn(this, literalCriteria, registers);
    } else {
      //estándar
      registers.splice(fIdx, 1); //Eliminación
    }
    await this.setData(registers, keySrcContext);
    return data;
  }
  protected override async structureReadByLiteralCriteria(
    literalCriteria: TStructureReadLiteralCriteria<any>
  ) {
    let { data } = literalCriteria;
    const keySrcContext = this.getKeySrcContext(
      this.srcSelector,
      literalCriteria
    );
    let registers = await this.getData(keySrcContext);
    registers = this.util.isNotUndefinedAndNotNull(registers)
      ? Array.isArray(registers)
        ? registers
        : [registers]
      : [];
    //selecciona el tipo de lectura:
    const customQueryDriverFn = this.getCustomQueryFn(literalCriteria);
    if (this.util.isFunction(customQueryDriverFn)) {
      //personalizada
      const fn =
        customQueryDriverFn as TStructureLocalRepositoryCustomQueryDriverFn<
          this,
          any
        >;
      registers = await fn(this, literalCriteria, registers);
    } else {
      //estándar
    }
    //verificación para ordenamiento y paginado
    if (
      this.util.isArray(registers) &&
      literalCriteria.expectedDataType === "array"
    ) {
      registers = await this.queryTool.structureOrderByBagCriteria(
        registers,
        literalCriteria
      );
      registers = await this.queryTool.structurePageByBagCriteria(
        registers,
        literalCriteria
      );
    }
    data = registers;
    return data;
  }
  protected override async structureCreateByLiteralCriteria(
    literalCriteria: TStructureModifyLiteralCriteria<any>
  ) {
    let { data } = literalCriteria;
    const kId = this.keyId;
    const keySrcContext = this.getKeySrcContext(
      this.srcSelector,
      literalCriteria
    );
    if (!this.util.isObject(data)) {
      throw new LogicError({
        code: ELogicCodeError.NOT_VALID,
        msn: `document with data = ${LogicError.valueToString(
          data
        )} does not valid`,
      });
    }
    let registers = (await this.getData(keySrcContext)) as any[];
    registers = Array.isArray(registers) ? registers : [registers];
    const idxCData = registers.findIndex((dt) => dt[kId] === data[kId]);
    //verificar si ya esta creado
    const isExist = idxCData > -1;
    if (isExist) {
      const { isCreateOrUpdate } =
        literalCriteria as TStructureModifyLiteralCriteria<any>;
      if (!isCreateOrUpdate) {
        //ya esta creado y no se permite su actualización
        throw new LogicError({
          code: ELogicCodeError.EXIST,
          msn: `document with data : ${LogicError.valueToString(
            data
          )} id has not created because exist`,
        });
      }
      return await this.structureUpdateByLiteralCriteria(literalCriteria);
    }
    //selecciona el tipo de creación:
    const customQueryDriverFn = this.getCustomQueryFn(literalCriteria);
    if (this.util.isFunction(customQueryDriverFn)) {
      //personalizada
      const fn =
        customQueryDriverFn as TStructureLocalRepositoryCustomQueryDriverFn<
          this,
          any
        >;
      registers = await fn(this, literalCriteria, registers);
    } else {
      //estándar
      //creación de id:
      data[kId] = this.buildStructureLocalId(registers, data[kId]);
      registers.push(data);
    }
    await this.setData(registers, keySrcContext);
    return data;
  }
  protected override async structureUpdateByLiteralCriteria(
    literalCriteria: TStructureModifyLiteralCriteria<any>
  ) {
    let { data } = literalCriteria;
    const kId = this.keyId;
    const keySrcContext = this.getKeySrcContext(
      this.srcSelector,
      literalCriteria
    );
    if (!this.util.isObject(data)) {
      throw new LogicError({
        code: ELogicCodeError.NOT_VALID,
        msn: `document with data = ${LogicError.valueToString(
          data
        )} does not valid`,
      });
    }
    let registers = (await this.getData(keySrcContext)) as any[];
    registers = Array.isArray(registers) ? registers : [registers];
    const idxCData = registers.findIndex((dt) => dt[kId] === data[kId]);
    const isExist = idxCData > -1;
    //verificar si no esta creado
    if (!isExist) {
      const { isCreateOrUpdate } =
        literalCriteria as TStructureModifyLiteralCriteria<any>;
      if (!isCreateOrUpdate) {
        //no esta creado y no se permite su creación
        throw new LogicError({
          code: ELogicCodeError.NOT_EXIST,
          msn: `document with data : ${LogicError.valueToString(
            data
          )} id has not updated because not exist`,
        });
      }
      return await this.structureCreateByLiteralCriteria(literalCriteria);
    }
    //selecciona el tipo de actualización:
    const customQueryDriverFn = this.getCustomQueryFn(literalCriteria);
    if (this.util.isFunction(customQueryDriverFn)) {
      //personalizada
      const fn =
        customQueryDriverFn as TStructureLocalRepositoryCustomQueryDriverFn<
          this,
          any
        >;
      registers = await fn(this, literalCriteria, registers);
    } else {
      //estándar
      registers[idxCData] = data;
    }
    await this.setData(registers, keySrcContext);
    return data;
  }
  protected override async structureDeleteByLiteralCriteria(
    literalCriteria: TStructureModifyLiteralCriteria<any>
  ) {
    let { data } = literalCriteria;
    const kId = this.keyId;
    const keySrcContext = this.getKeySrcContext(
      this.srcSelector,
      literalCriteria
    );
    if (!this.util.isObject(data)) {
      throw new LogicError({
        code: ELogicCodeError.NOT_VALID,
        msn: `document with data = ${LogicError.valueToString(
          data
        )} does not valid`,
      });
    }
    let registers = (await this.getData(keySrcContext)) as any[];
    registers = Array.isArray(registers) ? registers : [registers];
    const idxCData = registers.findIndex((dt) => dt[kId] === data[kId]);
    const isExist = idxCData > -1;
    /**data especial de eliminación */
    let dData = {};
    dData[kId] = data[kId]; //solo envía id
    if (!isExist) return dData; //ya está eliminado
    //selecciona el tipo de eliminación:
    const customQueryDriverFn = this.getCustomQueryFn(literalCriteria);
    if (this.util.isFunction(customQueryDriverFn)) {
      //personalizada
      const fn =
        customQueryDriverFn as TStructureLocalRepositoryCustomQueryDriverFn<
          this,
          any
        >;
      registers = await fn(this, literalCriteria, registers);
    } else {
      //estándar
      registers.splice(idxCData, 1);
    }
    await this.setData(registers, keySrcContext);
    data = dData; //mutar data ya eliminada
    return data;
  }
}
