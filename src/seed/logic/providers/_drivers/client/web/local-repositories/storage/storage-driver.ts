import { Module } from "../../../../../../config/module";
import {
  TKeyLogicContext,
  TKeySrcSelector,
} from "../../../../../../config/shared-modules";
import {
  IPrimitiveModifyCriteria,
  IStructureModelModifyCriteria,
} from "../../../../../../criterias/shared";
import {
  ELogicCodeError,
  LogicError,
} from "../../../../../../errors/logic-error";
import { getStrategyGeneratorIdFnByKey } from "../../../../../../util/default-generators-id-fn";
import { IBagForDriver } from "../../../../shared";
import { LocalRepositoryDriver } from "../_local-repository-driver";
import { TLocalRepositoryCustomQueryDriverFn } from "../shared"; //❗Desde el padre❗
import { TStorageType } from "./shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *selfcontructor*
 *
 * ...
 */
export class StorageDriver
  extends LocalRepositoryDriver
  implements ReturnType<StorageDriver["getDefault"]>
{
  public static readonly getNameLogicDriver = () => {
    const util = Module.util;
    //const sp = util.charSeparatorLogicName;
    const prefixGroupName = LocalRepositoryDriver.getNameLogicDriver();
    let name = "storage";
    name = `${prefixGroupName}${name}`;
    return name;
  };
  public static override readonly getDefault = () => {
    const superDf = LocalRepositoryDriver.getDefault();
    return {
      ...superDf,
      /**tipo de storages a utilizar*/
      storageType: "session" as TStorageType,
      /**tamaño del storage a utilizar (entre 1KB y 2MB)*/
      size: 1000000, //1MB
      /**??? */
      isURIEncodeDecode: false,
    };
  };
  protected static override readonly getCONSTANTS = () => {
    const superCONST = LocalRepositoryDriver.getCONSTANTS();
    return {
      ...superCONST,
      maxStorageSizeAllow: 2000000, //2MB (los storage dicen soportar hasta 5MB pero ocupan doble byte de almacenamiento, por lo tanto son 2.5MB reales)
      minStorageSizeAllow: 1000, //1KB
    };
  };
  public override nameLogicDriver = StorageDriver.getNameLogicDriver();
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
  /**
   * @param base objeto literal con valores personalizados para inicializar las propiedades
   * @param isInit `= true` ❕Solo para herencia❕, indica si esta clase debe iniciar las propiedaes
   */
  constructor(
    base: Partial<ReturnType<StorageDriver["getDefault"]>> = {},
    isInit = true
  ) {
    super(base, false);
    if (isInit) this.initProps(base);
  }
  protected override getDefault() {
    return StorageDriver.getDefault();
  }
  protected override getCONST() {
    return StorageDriver.getCONSTANTS();
  }
  //❗normalmente definidas en el padre, salvo que se quieran sobreescribir❗
  // /**inicializa las propiedades de manera dinamica
  //  *
  //  * @param base objeto literal con valores personalizados para iniicalizar las propiedades
  //  */
  // protected override initProps(base: Partial<ReturnType<StorageDriver["getDefault"]>>): void {
  //   for (const key in this.getDefault()) {
  //     this[key] = base[key];
  //   }
  //   return;
  // }
  // /**reinicia una propiedad al valor predefinido
  //  *
  //  * @param key clave identificadora de la propiedad a reiniciar
  //  */
  // public override resetPropByKey(key: keyof ReturnType<StorageDriver["getDefault"]>): void {
  //   const df = this.getDefault();
  //   this[key] = df[key];
  //   return;
  // }
  public override mutateProps(
    base: Partial<ReturnType<StorageDriver["getDefault"]>>
  ): void {
    super.mutateProps(base);
    return;
  }
  public override getLiteral(): ReturnType<StorageDriver["getDefault"]> {
    return super.getLiteral() as any;
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
  /**calcular el tamaño actual del storage */
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
  /**... */
  public async emptyAllStorage(
    keyScope: "session" | "local" | "both" = "both"
  ): Promise<void> {
    await StorageDriver.emptyAllStorage(keyScope);
    return;
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
  //████ CRUD by Bag ████████████████████████████████████████████████████████████
  protected override async primitiveReadByBag(literalBag: IBagForDriver) {
    let { data, literalCriteria } = literalBag;
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
      //personalización
      const fn =
        customQueryDriverFn as TLocalRepositoryCustomQueryDriverFn<this>;
      registers = await fn(this, literalBag, registers);
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
  protected override async primitiveCreateByBag(literalBag: IBagForDriver) {
    let { data, literalCriteria } = literalBag;
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
    if (idxCData > -1) {
      const { isCreateOrUpdate } = literalCriteria as IPrimitiveModifyCriteria;
      if (!isCreateOrUpdate) {
        //ya esta creado y no se permite su actualización
        throw new LogicError({
          code: ELogicCodeError.EXIST,
          msn: `document with data : ${LogicError.valueToString(
            data
          )} id has not created because exist`,
        });
      }
      return await this.primitiveUpdateByBag(literalBag);
    }
    //selecciona el tipo de creación:
    const customQueryDriverFn = this.getCustomQueryFn(literalCriteria);
    if (this.util.isFunction(customQueryDriverFn)) {
      //personalizada
      const fn =
        customQueryDriverFn as TLocalRepositoryCustomQueryDriverFn<this>;
      registers = await fn(this, literalBag, registers);
    } else {
      //estándar
      registers.push(data);
    }
    await this.setData(registers, keySrcContext);
    return data;
  }
  protected override async primitiveUpdateByBag(literalBag: IBagForDriver) {
    let { data, literalCriteria } = literalBag;
    const keySrcContext = this.getKeySrcContext(
      this.srcSelector,
      literalCriteria
    );
    let registers = await this.getData(keySrcContext);
    const idxCData = registers.findIndex((dt) =>
      this.util.isEquivalentTo([dt, data], {})
    );
    //verificar si no esta creado
    if (idxCData === -1) {
      const { isCreateOrUpdate } =
        literalCriteria as IPrimitiveModifyCriteria<any>;
      if (!isCreateOrUpdate) {
        //no esta creado y no se permite su creación
        throw new LogicError({
          code: ELogicCodeError.NOT_EXIST,
          msn: `document with data : ${LogicError.valueToString(
            data
          )} id has not updated because not exist`,
        });
      }
      return await this.primitiveCreateByBag(literalBag);
    }
    //selecciona el tipo de actualización:
    const customQueryDriverFn = this.getCustomQueryFn(literalCriteria);
    if (this.util.isFunction(customQueryDriverFn)) {
      //personalizada
      const fn =
        customQueryDriverFn as TLocalRepositoryCustomQueryDriverFn<this>;
      registers = await fn(this, literalBag, registers);
    } else {
      //estándar
      registers[idxCData] = data;
    }
    await this.setData(registers, keySrcContext);
    return data;
  }
  protected override async primitiveDeleteByBag(literalBag: IBagForDriver) {
    let { data, literalCriteria } = literalBag;
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
        customQueryDriverFn as TLocalRepositoryCustomQueryDriverFn<this>;
      registers = await fn(this, literalBag, registers);
    } else {
      //estándar
      registers.splice(fIdx, 1); //Eliminación
    }
    await this.setData(registers, keySrcContext);
    return data;
  }
  protected override async structureReadByBag(literalBag: IBagForDriver) {
    let { data, literalCriteria } = literalBag;

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
        customQueryDriverFn as TLocalRepositoryCustomQueryDriverFn<this>;
      registers = await fn(this, literalBag, registers);
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
  protected override async structureCreateByBag(literalBag: IBagForDriver) {
    let { data, literalCriteria } = literalBag;
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
    const idxCData = registers.findIndex((dt) => {
      const r = dt[kId] === data[kId];
      return r;
    });
    //verificar si ya esta creado
    const isExist = idxCData > -1;
    if (isExist) {
      const { isCreateOrUpdate } =
        literalCriteria as IStructureModelModifyCriteria<any>;
      if (!isCreateOrUpdate) {
        //ya esta creado y no se permite su actualización
        throw new LogicError({
          code: ELogicCodeError.EXIST,
          msn: `document with data : ${LogicError.valueToString(
            data
          )} id has not created because exist`,
        });
      }
      return await this.structureUpdateByBag(literalBag);
    }
    //selecciona el tipo de actualización:
    const customQueryDriverFn = this.getCustomQueryFn(literalCriteria);
    if (this.util.isFunction(customQueryDriverFn)) {
      //personalizada
      const fn =
        customQueryDriverFn as TLocalRepositoryCustomQueryDriverFn<this>;
      registers = await fn(this, literalBag, registers);
    } else {
      //estándar
      const { strategyForIdBuild } = this._globalConfig_;
      const buildIDFn = getStrategyGeneratorIdFnByKey(strategyForIdBuild);
      data[kId] = buildIDFn(data[kId]);
      registers.push(data);
    }
    await this.setData(registers, keySrcContext);
    return data;
  }
  protected override async structureUpdateByBag(literalBag: IBagForDriver) {
    let { data, literalCriteria } = literalBag;
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
    const idxCData = registers.findIndex((dt) => {
      const r = dt[kId] === data[kId];
      return r;
    });
    //verificar si no esta creado
    const isExist = idxCData > -1;
    if (!isExist) {
      const { isCreateOrUpdate } =
        literalCriteria as IStructureModelModifyCriteria<any>;
      if (!isCreateOrUpdate) {
        //no esta creado y no se permite su creación
        throw new LogicError({
          code: ELogicCodeError.NOT_EXIST,
          msn: `document with data : ${LogicError.valueToString(
            data
          )} id has not updated because not exist`,
        });
      }
      return await this.structureCreateByBag(literalBag);
    }
    //selecciona el tipo de actualización:
    const customQueryDriverFn = this.getCustomQueryFn(literalCriteria);
    if (this.util.isFunction(customQueryDriverFn)) {
      //personalizada
      const fn =
        customQueryDriverFn as TLocalRepositoryCustomQueryDriverFn<this>;
      registers = await fn(this, literalBag, registers);
    } else {
      //estándar
      registers[idxCData] = data;
    }
    await this.setData(registers, keySrcContext);
    return data;
  }
  protected override async structureDeleteByBag(literalBag: IBagForDriver) {
    let { data, literalCriteria } = literalBag;
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
    const idxCData = registers.findIndex((dt) => {
      const r = dt[kId] === data[kId];
      return r;
    });
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
        customQueryDriverFn as TLocalRepositoryCustomQueryDriverFn<this>;
      registers = await fn(this, literalBag, registers);
    } else {
      //estándar
      registers.splice(idxCData, 1);
    }
    await this.setData(registers, keySrcContext);
    data = dData; //mutar data ya eliminada
    return data;
  }
}
