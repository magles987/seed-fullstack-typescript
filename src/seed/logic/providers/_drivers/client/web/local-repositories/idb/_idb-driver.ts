import { Module } from "../../../../../../config/module";
import {
  IPrimitiveModifyCriteria,
  IStructureModelModifyCriteria,
} from "../../../../../../criterias/shared";
import {
  ELogicCodeError,
  LogicError,
} from "../../../../../../errors/logic-error";
import { getStrategyGeneratorIdFnByKey } from "../../../../../../util/default-generators-id-fn";
import {
  IPrimitiveBagForDriver,
  IStructureBagForDriver,
} from "../../../../shared";
import { LocalRepositoryDriver } from "../_local-repository-driver";
import {
  TPrimitiveLocalRepositoryCustomQueryDriverFn,
  TStructureLocalRepositoryCustomQueryDriverFn,
} from "../shared"; //❗Desde el padre❗
import { IDBConnection, TSchemaConfig } from "./_connection";
import {
  PrimitiveLibraryIdbQueryFn,
  StructureLibraryIdbQueryFn,
} from "./library-idb-query-fn";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *selfcontructor*
 *
 * ...
 */
export class IdbDriver
  extends LocalRepositoryDriver
  implements ReturnType<IdbDriver["getDefault"]>
{
  public static readonly getNameLogicDriver = () => {
    const util = Module.util;
    //const sp = util.charSeparatorLogicName;
    const prefixGroupName = LocalRepositoryDriver.getNameLogicDriver();
    let name = "idb";
    name = `${prefixGroupName}${name}`;
    return name;
  };
  /**librería de funciones para consulta*/
  protected static primitiveLibraryQueryFn =
    PrimitiveLibraryIdbQueryFn.getInstance(); //❗Solo set para acceder❗, el get es personalizado
  /**librería de funciones para consulta*/
  protected static structureLibraryQueryFn =
    StructureLibraryIdbQueryFn.getInstance(); //❗Solo set para acceder❗, el get es personalizado
  public static override readonly getDefault = () => {
    const superDf = LocalRepositoryDriver.getDefault();
    return {
      ...superDf,
      /**nombre de la base de datos simulada en local*/
      db_name: "logic",
      /**numero de version de la base de datos*/
      db_version: 1,
    };
  };
  protected static override readonly getCONSTANTS = () => {
    const superCONST = LocalRepositoryDriver.getCONSTANTS();
    return {
      ...superCONST,
      //..aquí las constantes
    };
  };
  public override nameLogicDriver = IdbDriver.getNameLogicDriver();
  private _db_name: string;
  public get db_name(): string {
    return this._db_name;
  }
  protected set db_name(v: string) {
    this._db_name = this.util.isString(v)
      ? v
      : this._db_name !== undefined
      ? this._db_name
      : this.getDefault().db_name;
  }
  private _db_version: number;
  public get db_version(): number {
    return this._db_version;
  }
  protected set db_version(v: number) {
    this._db_version = this.util.isNumber(v)
      ? v
      : this._db_version !== undefined
      ? this._db_version
      : this.getDefault().db_version;
  }
  /**conexión a IndexableDB  base de datos del navegador*/
  protected connection = IDBConnection.getInstance();
  /**
   * @param base objeto literal con valores personalizados para inicializar las propiedades
   * @param isInit `= true` ❕Solo para herencia❕, indica si esta clase debe iniciar las propiedaes
   */
  constructor(
    base: Partial<ReturnType<IdbDriver["getDefault"]>> = {},
    isInit = true
  ) {
    super(base, false);
    if (isInit) this.initProps(base);
  }
  protected override getDefault() {
    return IdbDriver.getDefault();
  }
  protected override getCONST() {
    return IdbDriver.getCONSTANTS();
  }
  //❗normalmente definidas en el padre, salvo que se quieran sobreescribir❗
  // /**inicializa las propiedades de manera dinamica
  //  *
  //  * @param base objeto literal con valores personalizados para iniicalizar las propiedades
  //  */
  // protected override initProps(base: Partial<ReturnType<IdbDriver["getDefault"]>>): void {
  //   for (const key in this.getDefault()) {
  //     this[key] = base[key];
  //   }
  //   return;
  // }
  // /**reinicia una propiedad al valor predefinido
  //  *
  //  * @param key clave identificadora de la propiedad a reiniciar
  //  */
  // public override resetPropByKey(key: keyof ReturnType<IdbDriver["getDefault"]>): void {
  //   const df = this.getDefault();
  //   this[key] = df[key];
  //   return;
  // }
  public override mutateProps(
    base: Partial<ReturnType<IdbDriver["getDefault"]>>
  ): void {
    super.mutateProps(base);
    return;
  }
  public override getLiteral(): ReturnType<IdbDriver["getDefault"]> {
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
    TCustomLibrary extends PrimitiveLibraryIdbQueryFn<TValue> = PrimitiveLibraryIdbQueryFn<TValue>
  >(): TCustomLibrary {
    return IdbDriver.primitiveLibraryQueryFn as TCustomLibrary;
  }
  /**asignar librería totalmente personalizada a la propiedad
   * que almacena dicha librería */
  public static setPrimitiveLibraryQueryFn<
    TCustomLibrary extends PrimitiveLibraryIdbQueryFn<any>
  >(v: TCustomLibrary): void {
    const util = Module.util;
    if (!util.isInstance(v)) return;
    IdbDriver.primitiveLibraryQueryFn = v;
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
    TCustomLibrary extends StructureLibraryIdbQueryFn<TModel> = StructureLibraryIdbQueryFn<TModel>
  >(): TCustomLibrary {
    return IdbDriver.structureLibraryQueryFn as TCustomLibrary;
  }
  /**asignar librería totalmente personalizada a la propiedad
   * que almacena dicha librería */
  public static setStructureLibraryQueryFn<
    TCustomLibrary extends StructureLibraryIdbQueryFn<any>
  >(v: TCustomLibrary): void {
    const util = Module.util;
    if (!util.isInstance(v)) return;
    IdbDriver.structureLibraryQueryFn = v;
  }
  /**
   * ____
   * @param keyCollection la clave
   * identificadora de la colección
   * @param keyPrimary (predefinido `"_id"`)
   * la clave identificadora del campo
   * identificador
   *
   */
  protected createAndSetSchemaConfig(schemaConfig: Partial<TSchemaConfig>) {
    this.connection.setSchemaConfig(schemaConfig);
  }
  /**
   * verifica si el esquema esta registrado
   * ____
   */
  private isSchemaRegistered(keySchema: string) {
    const mapSch = this.connection.mapSchemaConfig;
    const r = mapSch.has(keySchema);
    return r;
  }
  /**
   * ____
   * @returns la conexión abierta a la BD
   */
  protected async getDB(schemaConfig: Partial<TSchemaConfig>) {
    const { keyCollection } = schemaConfig;
    const isRegistered = this.isSchemaRegistered(keyCollection);
    if (!isRegistered) this.createAndSetSchemaConfig(schemaConfig);
    const db = await this.connection.openConnect(this.db_name, this.db_version);
    return db;
  }
  /**
   * ____
   * @param keySrc la clave identificadora
   * del recurso
   * @param transactionType tipo de
   * transaccion
   * ____
   * @returns una trasaccion abierta de la
   * base de datos.
   *
   * ❗NO olvidar cerrarla cunado termine la trasaccion❗
   * se cierra con `tx.done`
   *
   */
  protected async getTransaction(
    schemaConfig: Partial<TSchemaConfig> &
      Pick<TSchemaConfig, "keyCollection" | "keyPrimary">,
    transactionType: "readonly" | "readwrite" | "versionchange"
  ) {
    const db = await this.getDB(schemaConfig);
    const { keyCollection } = schemaConfig;
    const tx = db.transaction(keyCollection, transactionType);
    return tx;
  }
  /**... */
  public async deleteCurrentDataBase(
    db_name = IdbDriver.getDefault().db_name
  ): Promise<void> {
    await IdbDriver.deleteCurrentDataBase(db_name);
    return;
  }
  /**... */
  public static async deleteCurrentDataBase(
    db_name = IdbDriver.getDefault().db_name
  ): Promise<void> {
    const connection = IDBConnection.getInstance();
    await connection.deleteDB(db_name);
    return;
  }
  //████ CRUD by Bag ████████████████████████████████████████████████████████████
  protected override async primitiveReadByBag(
    literalBag: IPrimitiveBagForDriver
  ) {
    let { data, literalCriteria } = literalBag;
    const keySrcContext = this.getKeySrcContext(
      this.srcSelector,
      literalCriteria
    );
    const tx = await this.getTransaction(
      {
        keyCollection: keySrcContext,
        keyPrimary: this.keyId,
        autoIncrement: true,
      },
      "readonly"
    );
    let registers = await tx.store.getAll();
    await tx.done;
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
        customQueryDriverFn as TPrimitiveLocalRepositoryCustomQueryDriverFn<
          this,
          any
        >;
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
  protected override async primitiveCreateByBag(
    literalBag: IPrimitiveBagForDriver
  ) {
    const { data, literalCriteria } = literalBag;
    const kId = this.keyId;
    const keySrcContext = this.getKeySrcContext(
      this.srcSelector,
      literalCriteria
    );
    const tx = await this.getTransaction(
      {
        keyCollection: keySrcContext,
        keyPrimary: this.keyId,
        autoIncrement: true,
      },
      "readwrite"
    );
    const cDataIdx = (await tx.store.getAll()).findIndex((dt) => {
      //desempaquetar:
      const cData = dt[keySrcContext];
      const r = this.util.isEquivalentTo([cData, data], {});
      return r;
    });
    //verificar si ya esta creado
    const isExist = cDataIdx > -1;
    if (isExist) {
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
      await tx.done; //cerrar la transacción
      return await this.primitiveUpdateByBag(literalBag);
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
      let registers = await tx.store.getAll();
      registers = await fn(this, literalBag, registers);
      //⚠ proceso extremadamente lento ⚠
      const proms = registers.map((register) => {
        if (!this.util.isObjectWithProperties(register, [kId, keySrcContext])) {
          //empaquetar el registro que no esta formateado
          const subData = register;
          register = {};
          register[kId] = undefined; //el autoincrementar se encarga "de esa vuelta"
          register[keySrcContext] = subData;
        }
        return tx.store.put(register);
      }); //❗actualiza toda la tabla❗
      await Promise.all(proms);
    } else {
      //estándar
      //empaquetar
      let modData = {};
      modData[kId] = undefined; //el autoincrementar se encarga "de esa vuelta"
      modData[keySrcContext] = data;
      await tx.store.add(modData);
    }
    await tx.done; //cerrar la transacción
    return data;
  }
  protected override async primitiveUpdateByBag(
    literalBag: IPrimitiveBagForDriver
  ) {
    const { data, literalCriteria } = literalBag;
    const kId = this.keyId;
    const keySrcContext = this.getKeySrcContext(
      this.srcSelector,
      literalCriteria
    );
    const tx = await this.getTransaction(
      {
        keyCollection: keySrcContext,
        keyPrimary: this.keyId,
        autoIncrement: true,
      },
      "readwrite"
    );
    const cDataIdx = (await tx.store.getAll()).findIndex((dt) => {
      //desempaquetar:
      const cData = dt[keySrcContext];
      const r = this.util.isEquivalentTo([cData, data], {});
      return r;
    });
    //verificar si no esta creado
    const isExist = cDataIdx > -1;
    if (!isExist) {
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
      await tx.done; //cerrar la transacción
      return await this.primitiveCreateByBag(literalBag);
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
      let registers = await tx.store.getAll();
      registers = await fn(this, literalBag, registers);
      //⚠ proceso extremadamente lento ⚠
      const proms = registers.map((register) => {
        if (!this.util.isObjectWithProperties(register, [kId, keySrcContext])) {
          //empaquetar el registro que no esta formateado
          const subData = register;
          register = {};
          register[kId] = undefined; //el autoincrementar se encarga "de esa vuelta"
          register[keySrcContext] = subData;
        }
        return tx.store.put(register);
      }); //❗actualiza toda la tabla❗
      await Promise.all(proms);
    } else {
      //estándar
      //empaquetar
      let modData = {};
      modData[kId] = data[cDataIdx][kId];
      modData[keySrcContext] = data;
      await tx.store.put(modData);
    }
    await tx.done; //cerrar la transacción
    return data;
  }
  protected override async primitiveDeleteByBag(
    literalBag: IPrimitiveBagForDriver
  ) {
    const { data, literalCriteria } = literalBag;
    const kId = this.keyId;
    const keySrcContext = this.getKeySrcContext(
      this.srcSelector,
      literalCriteria
    );
    const tx = await this.getTransaction(
      {
        keyCollection: keySrcContext,
        keyPrimary: this.keyId,
        autoIncrement: true,
      },
      "readwrite"
    );
    const cDataIdx = (await tx.store.getAll()).findIndex((dt) => {
      //desempaquetar:
      const cData = dt[keySrcContext];
      const r = this.util.isEquivalentTo([cData, data], {});
      return r;
    });
    const isExist = cDataIdx > -1;
    if (!isExist) {
      await tx.done;
      return data;
    }
    //selecciona el tipo de eliminación:
    const customQueryDriverFn = this.getCustomQueryFn(literalCriteria);
    if (this.util.isFunction(customQueryDriverFn)) {
      //personalizada
      const fn =
        customQueryDriverFn as TPrimitiveLocalRepositoryCustomQueryDriverFn<
          this,
          any
        >;
      let registers = await tx.store.getAll();
      registers = await fn(this, literalBag, registers);
      //⚠ proceso extremadamente lento ⚠
      const proms = registers.map((register) => tx.store.put(register)); //❗actualiza toda la tabla❗
      await Promise.all(proms);
    } else {
      //estándar
      await tx.store.delete(cDataIdx);
    }
    await tx.done;
    return data;
  }
  protected override async structureReadByBag(
    literalBag: IStructureBagForDriver<any>
  ) {
    let { data, literalCriteria } = literalBag;
    const keySrcContext = this.getKeySrcContext(
      this.srcSelector,
      literalCriteria
    );
    const tx = await this.getTransaction(
      {
        keyCollection: keySrcContext,
        keyPrimary: this.keyId,
      },
      "readonly"
    );
    let registers = await tx.store.getAll();
    await tx.done;
    //selecciona el tipo de lectura:
    const customQueryDriverFn = this.getCustomQueryFn(literalCriteria);
    if (this.util.isFunction(customQueryDriverFn)) {
      //personalización
      const fn =
        customQueryDriverFn as TStructureLocalRepositoryCustomQueryDriverFn<
          this,
          any
        >;
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
  protected override async structureCreateByBag(
    literalBag: IStructureBagForDriver<any>
  ) {
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
    const tx = await this.getTransaction(
      {
        keyCollection: keySrcContext,
        keyPrimary: this.keyId,
      },
      "readwrite"
    );
    //verificar si ya esta creado
    const isExist = this.util.isObject(await tx.store.get(data[kId]));
    if (isExist) {
      const { isCreateOrUpdate } =
        literalCriteria as IStructureModelModifyCriteria<any>;
      if (!isCreateOrUpdate) {
        await tx.done; //cerrar la transacción
        //ya esta creado y no se permite su actualización
        throw new LogicError({
          code: ELogicCodeError.EXIST,
          msn: `document with data : ${LogicError.valueToString(
            data
          )} id has not created because exist`,
        });
      }
      await tx.done; //cerrar la transacción
      return await this.structureUpdateByBag(literalBag);
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
      let registers = await tx.store.getAll();
      registers = await fn(this, literalBag, registers);
      //⚠ proceso extremadamente lento ⚠
      const proms = registers.map((register) => tx.store.put(register)); //❗actualiza toda la tabla❗
      await Promise.all(proms);
    } else {
      //estándar
      const { strategyForIdBuild } = this._globalConfig_;
      const buildIDFn = getStrategyGeneratorIdFnByKey(strategyForIdBuild);
      data[kId] = buildIDFn(data[kId]);
      data[kId] = await tx.store.add(data);
    }
    await tx.done; //cerrar la transacción
    return data;
  }
  protected override async structureUpdateByBag(
    literalBag: IStructureBagForDriver<any>
  ) {
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
    const tx = await this.getTransaction(
      {
        keyCollection: keySrcContext,
        keyPrimary: this.keyId,
      },
      "readwrite"
    );
    //verificar si no esta creado
    const isExist = this.util.isObject(await tx.store.get(data[kId]));
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
        customQueryDriverFn as TStructureLocalRepositoryCustomQueryDriverFn<
          this,
          any
        >;
      let registers = await tx.store.getAll();
      registers = await fn(this, literalBag, registers);
      //⚠ proceso extremadamente lento ⚠
      const proms = registers.map((register) => tx.store.put(register)); //❗actualiza toda la tabla❗
      await Promise.all(proms);
    } else {
      //estándar
      data[kId] = await tx.store.put(data);
    }
    await tx.done; //cerrar la transacción
    return data;
  }
  protected override async structureDeleteByBag(
    literalBag: IStructureBagForDriver<any>
  ) {
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
    const tx = await this.getTransaction(
      {
        keyCollection: keySrcContext,
        keyPrimary: this.keyId,
      },
      "readwrite"
    );
    const isExist = this.util.isObject(await tx.store.get(data[kId]));
    /**data especial de eliminación */
    let dData = {};
    dData[kId] = data[kId]; //solo envía id
    if (!isExist) {
      //ya está eliminado
      await tx.done;
      return dData;
    }
    //selecciona el tipo de eliminación:
    const customQueryDriverFn = this.getCustomQueryFn(literalCriteria);
    if (this.util.isFunction(customQueryDriverFn)) {
      //personalizada
      const fn =
        customQueryDriverFn as TStructureLocalRepositoryCustomQueryDriverFn<
          this,
          any
        >;
      let registers = await tx.store.getAll();
      registers = await fn(this, literalBag, registers);
      //⚠ proceso extremadamente lento ⚠
      const proms = registers.map((register) => tx.store.put(register)); //❗actualiza toda la tabla❗
      await Promise.all(proms);
    } else {
      //estándar
      await tx.store.delete(data[kId]);
    }
    await tx.done;
    data = dData; //mutar data ya eliminada
    return data;
  }

  // public async readById(bagDriver: IBagForDriver) {
  //   const { literalCriteria } = bagDriver;
  //   const keySrcContext = this.getKeySrcContext(
  //     this.srcSelector,
  //     literalCriteria
  //   );
  //   const tx = await this.getTransaction(
  //     {
  //       keyCollection: keySrcContext,
  //       keyPrimary: this.keyId,
  //     },
  //     "readonly"
  //   );
  //   const { query } = literalCriteria as IStructureReadCriteria<any>;
  //   const kId = this.keyId;
  //   const extractQ = query.find((q) => {
  //     const oQ = q as ISingleCondition;
  //     const r =
  //       this.util.isObject(oQ) &&
  //       oQ.op === ELogicOperatorForCondition.eq &&
  //       oQ.keyPathForCond.includes(kId);
  //     return r;
  //   }) as ISingleCondition;
  //   if (extractQ === undefined) {
  //     throw new LogicError({
  //       code: ELogicCodeError.NOT_VALID,
  //       msn: `${LogicError.valueToString(
  //         query
  //       )} is not valid query, because not 'id' valid`,
  //     });
  //   }
  //   const id = extractQ.vCond;
  //   const rxData = await tx.store.get(id);
  //   return rxData;
  // }
}
