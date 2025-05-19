import {
  ELogicCodeError,
  LogicError,
} from "../../../../../../errors/logic-error";
import { TwinBeeModule } from "../../../../../../modules/module";
import {
  IGenericRepositoryCriteria,
  TPrimitiveLiteralCriteriaUnion,
  TPrimitiveModifyLiteralCriteria,
  TPrimitiveReadLiteralCriteria,
  TStructureLiteralCriteriaUnion,
  TStructureModifyLiteralCriteria,
  TStructureReadLiteralCriteria,
} from "../../../../../../criterias/shared-types";
import { LocalRepository } from "../_local-repository";
import {
  TGenericCookieCustomQueryRepositoryFn,
  TPrimitiveCookieCustomQueryRepositoryFn,
  TStructureCookieCustomQueryRepositoryFn,
} from "./shared-types"; //❗Desde el padre❗
import {
  PrimitiveLibraryCookieQueryFn,
  StructureLibraryCookieQueryFn,
} from "./library-cookie-query-fn";
import {
  IRepositoryResponse,
  IGenericRepositoryResponse,
} from "../../../../../../reports/shared-types";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *selfcontructor*
 *
 * ...
 */
export class CookieRepository
  extends LocalRepository
  implements ReturnType<CookieRepository["getDefault"]>
{
  public static readonly getNameLogicRepository = () => {
    const util = TwinBeeModule.util;
    //const sp = util.charSeparatorLogicName;
    const prefixGroupName = LocalRepository.getNameLogicRepository();
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
    const superDf = LocalRepository.getDefault();
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
    const superCONST = LocalRepository.getCONSTANTS();
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
  public override nameLogicRepository =
    CookieRepository.getNameLogicRepository();
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
    base: Partial<ReturnType<CookieRepository["getDefault"]>> = {},
    isInit = true
  ) {
    super(base, false);
    if (isInit) this.initProps(base);
  }
  protected override getDefault() {
    return CookieRepository.getDefault();
  }
  protected override getCONST() {
    return CookieRepository.getCONSTANTS();
  }
  //❗normalmente definidas en el padre, salvo que se quieran sobreescribir❗
  // /**inicializa las propiedades de manera dinamica
  //  *
  //  * @param base objeto literal con valores personalizados para iniicalizar las propiedades
  //  */
  // protected override initProps(base: Partial<ReturnType<CookieRepository["getDefault"]>>): void {
  //   for (const key in this.getDefault()) {
  //     this[key] = base[key];
  //   }
  //   return;
  // }
  // /**reinicia una propiedad al valor predefinido
  //  *
  //  * @param key clave identificadora de la propiedad a reiniciar
  //  */
  // public override resetPropByKey(key: keyof ReturnType<CookieRepository["getDefault"]>): void {
  //   const df = this.getDefault();
  //   this[key] = df[key];
  //   return;
  // }
  public override mutateProps(
    base: Partial<ReturnType<CookieRepository["getDefault"]>>
  ): void {
    super.mutateProps(base);
    return;
  }
  public override getLiteral(): ReturnType<CookieRepository["getDefault"]> {
    return super.getLiteral() as any;
  }
  protected override preRequestByCriteria(
    literalCriteria: IGenericRepositoryCriteria
  ): void {
    super.preRequestByCriteria(literalCriteria);
    return;
  }
  protected override postRequestByResponse(
    repositoryRes: IGenericRepositoryResponse
  ): void {
    super.postRequestByResponse(repositoryRes);
    return;
  }
  protected override preRequestByCriteriaModule(
    literalCriteria:
      | TPrimitiveLiteralCriteriaUnion
      | TStructureLiteralCriteriaUnion<any>
  ): void {
    super.preRequestByCriteriaModule(literalCriteria);
    return;
  }
  protected override postRequestByResponseModule(
    repositoryRes: IRepositoryResponse
  ): void {
    super.postRequestByResponseModule(repositoryRes);
    return;
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
    return CookieRepository.primitiveLibraryQueryFn as TCustomLibrary;
  }
  /**asignar librería totalmente personalizada a la propiedad
   * que almacena dicha librería */
  public static setPrimitiveLibraryQueryFn<
    TCustomLibrary extends PrimitiveLibraryCookieQueryFn<any>
  >(v: TCustomLibrary): void {
    const util = TwinBeeModule.util;
    if (!util.isInstance(v)) return;
    CookieRepository.primitiveLibraryQueryFn = v;
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
    return CookieRepository.structureLibraryQueryFn as TCustomLibrary;
  }
  /**asignar librería totalmente personalizada a la propiedad
   * que almacena dicha librería */
  public static setStructureLibraryQueryFn<
    TCustomLibrary extends StructureLibraryCookieQueryFn<any>
  >(v: TCustomLibrary): void {
    const util = TwinBeeModule.util;
    if (!util.isInstance(v)) return;
    CookieRepository.structureLibraryQueryFn = v;
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
    const sp_c = CookieRepository.getCONSTANTS().COOKIE_CHART_SEPARATE;
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
    await CookieRepository.emptyAllCookies();
    return;
  }
  /**🛑Elimina todas las cookies de la aplicación🛑 */
  public static async emptyAllCookies(): Promise<void> {
    const sp_c = CookieRepository.getCONSTANTS().COOKIE_CHART_SEPARATE;
    const cookies = document.cookie.split(sp_c);
    for (const cookie of cookies) {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
    return;
  }
  //████ CRUD ██████████████████████████████████████████████████████████████████████
  protected override async readByLiteralCriteria(
    literalCriteria: IGenericRepositoryCriteria
  ) {
    let { data, keySrc: keySrcContext } = literalCriteria;
    let registers = await this.getData(keySrcContext);
    registers = this.util.isNotUndefinedAndNotNull(registers)
      ? Array.isArray(registers)
        ? registers
        : [registers]
      : [];
    //❓Desempaquetar data❓
    //registers = (registers as any[]).map((data) => data[keySrcContext]);
    //selecciona el tipo de lectura:
    const customQueryRepositoryFn = this.getCustomQueryFn(literalCriteria);
    if (this.util.isFunction(customQueryRepositoryFn)) {
      //personalizada
      const fn =
        customQueryRepositoryFn as TGenericCookieCustomQueryRepositoryFn<any>;
      registers = await fn(this, literalCriteria, registers);
    } else {
      //estándar
    }
    //verificación para ordenamiento y paginado
    if (this.util.isArray(registers)) {
      registers = await this.queryTool.orderByCriteria(
        registers,
        literalCriteria
      );
      registers = await this.queryTool.pageByCriteria(
        registers,
        literalCriteria
      );
    }
    data = registers;
    return data;
  }
  protected override async createByLiteralCriteria(
    literalCriteria: IGenericRepositoryCriteria
  ) {
    let { data, keySrc: keySrcContext } = literalCriteria;
    let registers = (await this.getData(keySrcContext)) as any[];
    registers = Array.isArray(registers) ? registers : [registers];
    const idxCData = registers.findIndex((dt) =>
      this.util.isEquivalentTo([dt, data], {})
    );
    //verificar si ya esta creado
    const isExist = idxCData > -1;
    if (isExist) {
      const { isCreateOrUpdate } = literalCriteria;
      if (!isCreateOrUpdate) {
        //ya esta creado y no se permite su actualización
        throw new LogicError({
          code: ELogicCodeError.EXIST,
          msn: `document with data : ${LogicError.valueToString(
            data
          )} id has not created because exist`,
        });
      }
      return await this.updateByLiteralCriteria(literalCriteria);
    }
    //selecciona el tipo de creación:
    const customQueryRepositoryFn = this.getCustomQueryFn(literalCriteria);
    if (this.util.isFunction(customQueryRepositoryFn)) {
      //personalizada
      const fn =
        customQueryRepositoryFn as TGenericCookieCustomQueryRepositoryFn<any>;
      registers = await fn(this, literalCriteria, registers);
    } else {
      //estándar
      registers.push(data);
    }
    await this.setData(registers, keySrcContext);
    return data;
  }
  protected override async updateByLiteralCriteria(
    literalCriteria: IGenericRepositoryCriteria
  ) {
    let { data, keySrc: keySrcContext } = literalCriteria;
    let registers = await this.getData(keySrcContext);
    const idxCData = registers.findIndex((dt) =>
      this.util.isEquivalentTo([dt, data], {})
    );
    //verificar si no esta creado
    const isExist = idxCData > -1;
    if (!isExist) {
      const { isCreateOrUpdate } = literalCriteria;
      if (!isCreateOrUpdate) {
        //no esta creado y no se permite su creación
        throw new LogicError({
          code: ELogicCodeError.NOT_EXIST,
          msn: `document with data : ${LogicError.valueToString(
            data
          )} id has not updated because not exist`,
        });
      }
      return await this.createByLiteralCriteria(literalCriteria);
    }
    //selecciona el tipo de actualización:
    const customQueryRepositoryFn = this.getCustomQueryFn(literalCriteria);
    if (this.util.isFunction(customQueryRepositoryFn)) {
      //personalizada
      const fn =
        customQueryRepositoryFn as TGenericCookieCustomQueryRepositoryFn<any>;
      registers = await fn(this, literalCriteria, registers);
    } else {
      //estándar
      registers[idxCData] = data;
    }
    await this.setData(registers, keySrcContext);
    return data;
  }
  protected override async deleteByLiteralCriteria(
    literalCriteria: IGenericRepositoryCriteria
  ) {
    let { data, keySrc: keySrcContext } = literalCriteria;
    let registers = (await this.getData(keySrcContext)) as any[];
    registers = Array.isArray(registers) ? registers : [registers];
    const fIdx = registers.findIndex((dt) =>
      this.util.isEquivalentTo([dt, data], {})
    );
    const isExist = fIdx >= 0;
    if (!isExist) return data;
    //selecciona el tipo de eliminación:
    const customQueryRepositoryFn = this.getCustomQueryFn(literalCriteria);
    if (this.util.isFunction(customQueryRepositoryFn)) {
      //personalizada
      const fn =
        customQueryRepositoryFn as TGenericCookieCustomQueryRepositoryFn<any>;
      registers = await fn(this, literalCriteria, registers);
    } else {
      //estándar
      registers.splice(fIdx, 1); //Eliminación
    }
    await this.setData(registers, keySrcContext);
    return data;
  }
  //████ CRUD BY MODULE ████████████████████████████████████████████████████████████
  protected override async primitiveReadByLiteralCriteriaModule(
    literalCriteria: TPrimitiveReadLiteralCriteria
  ) {
    let { data } = literalCriteria;
    const keySrcContext = this.getKeySrcContextFromModule(
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
    const customQueryRepositoryFn =
      this.getCustomQueryFnModule(literalCriteria);
    if (this.util.isFunction(customQueryRepositoryFn)) {
      //personalizada
      const fn =
        customQueryRepositoryFn as TPrimitiveCookieCustomQueryRepositoryFn<any>;
      registers = await fn(this, literalCriteria, registers);
    } else {
      //estándar
    }
    //verificación para ordenamiento y paginado
    if (
      this.util.isArray(registers) &&
      literalCriteria.expectedDataType === "array"
    ) {
      registers = await this.queryTool.primitiveOrderByCriteriaModule(
        registers,
        literalCriteria
      );
      registers = await this.queryTool.primitivePageByCriteriaModule(
        registers,
        literalCriteria
      );
    }
    data = registers;
    return data;
  }
  protected override async primitiveCreateByLiteralCriteriaModule(
    literalCriteria: TPrimitiveModifyLiteralCriteria
  ) {
    let { data } = literalCriteria;
    const keySrcContext = this.getKeySrcContextFromModule(
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
      return await this.primitiveUpdateByLiteralCriteriaModule(literalCriteria);
    }
    //selecciona el tipo de creación:
    const customQueryRepositoryFn =
      this.getCustomQueryFnModule(literalCriteria);
    if (this.util.isFunction(customQueryRepositoryFn)) {
      //personalizada
      const fn =
        customQueryRepositoryFn as TPrimitiveCookieCustomQueryRepositoryFn<any>;
      registers = await fn(this, literalCriteria, registers);
    } else {
      //estándar
      registers.push(data);
    }
    await this.setData(registers, keySrcContext);
    return data;
  }
  protected override async primitiveUpdateByLiteralCriteriaModule(
    literalCriteria: TPrimitiveModifyLiteralCriteria
  ) {
    let { data } = literalCriteria;
    const keySrcContext = this.getKeySrcContextFromModule(
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
      return await this.primitiveCreateByLiteralCriteriaModule(literalCriteria);
    }
    //selecciona el tipo de actualización:
    const customQueryRepositoryFn =
      this.getCustomQueryFnModule(literalCriteria);
    if (this.util.isFunction(customQueryRepositoryFn)) {
      //personalizada
      const fn =
        customQueryRepositoryFn as TPrimitiveCookieCustomQueryRepositoryFn<any>;
      registers = await fn(this, literalCriteria, registers);
    } else {
      //estándar
      registers[idxCData] = data;
    }
    await this.setData(registers, keySrcContext);
    return data;
  }
  protected override async primitiveDeleteByLiteralCriteriaModule(
    literalCriteria: TPrimitiveModifyLiteralCriteria
  ) {
    let { data } = literalCriteria;
    const keySrcContext = this.getKeySrcContextFromModule(
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
    const customQueryRepositoryFn =
      this.getCustomQueryFnModule(literalCriteria);
    if (this.util.isFunction(customQueryRepositoryFn)) {
      //personalizada
      const fn =
        customQueryRepositoryFn as TPrimitiveCookieCustomQueryRepositoryFn<any>;
      registers = await fn(this, literalCriteria, registers);
    } else {
      //estándar
      registers.splice(fIdx, 1); //Eliminación
    }
    await this.setData(registers, keySrcContext);
    return data;
  }
  protected override async structureReadByLiteralCriteriaModule(
    literalCriteria: TStructureReadLiteralCriteria<any>
  ) {
    let { data } = literalCriteria;
    const keySrcContext = this.getKeySrcContextFromModule(
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
    const customQueryRepositoryFn =
      this.getCustomQueryFnModule(literalCriteria);
    if (this.util.isFunction(customQueryRepositoryFn)) {
      //personalizada
      const fn =
        customQueryRepositoryFn as TStructureCookieCustomQueryRepositoryFn<any>;
      registers = await fn(this, literalCriteria, registers);
    } else {
      //estándar
    }
    //verificación para ordenamiento y paginado
    if (
      this.util.isArray(registers) &&
      literalCriteria.expectedDataType === "array"
    ) {
      registers = await this.queryTool.structureOrderByCriteriaModule(
        registers,
        literalCriteria
      );
      registers = await this.queryTool.structurePageByCriteriaModule(
        registers,
        literalCriteria
      );
    }
    data = registers;
    return data;
  }
  protected override async structureCreateByLiteralCriteriaModule(
    literalCriteria: TStructureModifyLiteralCriteria<any>
  ) {
    let { data } = literalCriteria;
    const kId = this.keyId;
    const keySrcContext = this.getKeySrcContextFromModule(
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
      return await this.structureUpdateByLiteralCriteriaModule(literalCriteria);
    }
    //selecciona el tipo de creación:
    const customQueryRepositoryFn =
      this.getCustomQueryFnModule(literalCriteria);
    if (this.util.isFunction(customQueryRepositoryFn)) {
      //personalizada
      const fn =
        customQueryRepositoryFn as TStructureCookieCustomQueryRepositoryFn<any>;
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
  protected override async structureUpdateByLiteralCriteriaModule(
    literalCriteria: TStructureModifyLiteralCriteria<any>
  ) {
    let { data } = literalCriteria;
    const kId = this.keyId;
    const keySrcContext = this.getKeySrcContextFromModule(
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
      return await this.structureCreateByLiteralCriteriaModule(literalCriteria);
    }
    //selecciona el tipo de actualización:
    const customQueryRepositoryFn =
      this.getCustomQueryFnModule(literalCriteria);
    if (this.util.isFunction(customQueryRepositoryFn)) {
      //personalizada
      const fn =
        customQueryRepositoryFn as TStructureCookieCustomQueryRepositoryFn<any>;
      registers = await fn(this, literalCriteria, registers);
    } else {
      //estándar
      registers[idxCData] = data;
    }
    await this.setData(registers, keySrcContext);
    return data;
  }
  protected override async structureDeleteByLiteralCriteriaModule(
    literalCriteria: TStructureModifyLiteralCriteria<any>
  ) {
    let { data } = literalCriteria;
    const kId = this.keyId;
    const keySrcContext = this.getKeySrcContextFromModule(
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
    const customQueryRepositoryFn =
      this.getCustomQueryFnModule(literalCriteria);
    if (this.util.isFunction(customQueryRepositoryFn)) {
      //personalizada
      const fn =
        customQueryRepositoryFn as TStructureCookieCustomQueryRepositoryFn<any>;
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
