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
import { TLocalRepositoryCustomQueryRepositoryFn } from "../shared-types"; //❗Desde el padre❗
import { IDBConnection, TSchemaConfig } from "./_connection";
import {
  PrimitiveLibraryIdbQueryFn,
  StructureLibraryIdbQueryFn,
} from "./library-idb-query-fn";
import {
  IGenericRepositoryResponse,
  IRepositoryResponse,
} from "../../../../../../reports/shared-types";
import {
  TGenericLocalIdbCustomQueryRepositoryFn,
  TPrimitiveLocalIdbCustomQueryRepositoryFn,
  TStructureLocalIdbCustomQueryRepositoryFn,
} from "./shared-types";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *selfcontructor*
 *
 * ...
 */
export class IdbRepository
  extends LocalRepository
  implements ReturnType<IdbRepository["getDefault"]>
{
  public static readonly getNameLogicRepository = () => {
    const util = TwinBeeModule.util;
    //const sp = util.charSeparatorLogicName;
    const prefixGroupName = LocalRepository.getNameLogicRepository();
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
    const superDf = LocalRepository.getDefault();
    return {
      ...superDf,
      /**nombre de la base de datos simulada en local*/
      db_name: "logic",
      /**numero de version de la base de datos*/
      db_version: 1,
    };
  };
  protected static override readonly getCONSTANTS = () => {
    const superCONST = LocalRepository.getCONSTANTS();
    return {
      ...superCONST,
      //..aquí las constantes
    };
  };
  public override nameLogicRepository = IdbRepository.getNameLogicRepository();
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
    base: Partial<ReturnType<IdbRepository["getDefault"]>> = {},
    isInit = true
  ) {
    super(base, false);
    if (isInit) this.initProps(base);
  }
  protected override getDefault() {
    return IdbRepository.getDefault();
  }
  protected override getCONST() {
    return IdbRepository.getCONSTANTS();
  }
  //❗normalmente definidas en el padre, salvo que se quieran sobreescribir❗
  // /**inicializa las propiedades de manera dinamica
  //  *
  //  * @param base objeto literal con valores personalizados para iniicalizar las propiedades
  //  */
  // protected override initProps(base: Partial<ReturnType<IdbRepository["getDefault"]>>): void {
  //   for (const key in this.getDefault()) {
  //     this[key] = base[key];
  //   }
  //   return;
  // }
  // /**reinicia una propiedad al valor predefinido
  //  *
  //  * @param key clave identificadora de la propiedad a reiniciar
  //  */
  // public override resetPropByKey(key: keyof ReturnType<IdbRepository["getDefault"]>): void {
  //   const df = this.getDefault();
  //   this[key] = df[key];
  //   return;
  // }
  public override mutateProps(
    base: Partial<ReturnType<IdbRepository["getDefault"]>>
  ): void {
    super.mutateProps(base);
    return;
  }
  public override getLiteral(): ReturnType<IdbRepository["getDefault"]> {
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
    TCustomLibrary extends PrimitiveLibraryIdbQueryFn<TValue> = PrimitiveLibraryIdbQueryFn<TValue>
  >(): TCustomLibrary {
    return IdbRepository.primitiveLibraryQueryFn as TCustomLibrary;
  }
  /**asignar librería totalmente personalizada a la propiedad
   * que almacena dicha librería */
  public static setPrimitiveLibraryQueryFn<
    TCustomLibrary extends PrimitiveLibraryIdbQueryFn<any>
  >(v: TCustomLibrary): void {
    const util = TwinBeeModule.util;
    if (!util.isInstance(v)) return;
    IdbRepository.primitiveLibraryQueryFn = v;
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
    return IdbRepository.structureLibraryQueryFn as TCustomLibrary;
  }
  /**asignar librería totalmente personalizada a la propiedad
   * que almacena dicha librería */
  public static setStructureLibraryQueryFn<
    TCustomLibrary extends StructureLibraryIdbQueryFn<any>
  >(v: TCustomLibrary): void {
    const util = TwinBeeModule.util;
    if (!util.isInstance(v)) return;
    IdbRepository.structureLibraryQueryFn = v;
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
    db_name = IdbRepository.getDefault().db_name
  ): Promise<void> {
    await IdbRepository.deleteCurrentDataBase(db_name);
    return;
  }
  /**... */
  public static async deleteCurrentDataBase(
    db_name = IdbRepository.getDefault().db_name
  ): Promise<void> {
    const connection = IDBConnection.getInstance();
    await connection.deleteDB(db_name);
    return;
  }
  //████ CRUD ████████████████████████████████████████████████████████████
  protected override async readByLiteralCriteria(
    literalCriteria: IGenericRepositoryCriteria
  ) {
    let { data, keySrc: keySrcContext } = literalCriteria;
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
    //❓Desempaquetar data❓
    //registers = (registers as any[]).map((data) => data[keySrcContext]);
    //selecciona el tipo de lectura:
    const customQueryRepositoryFn = this.getCustomQueryFn(literalCriteria);
    if (this.util.isFunction(customQueryRepositoryFn)) {
      //personalización
      const fn =
        customQueryRepositoryFn as TGenericLocalIdbCustomQueryRepositoryFn<any>;
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
    const { data, keySrc: keySrcContext } = literalCriteria;
    const kId = this.keyId;
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
      await tx.done; //cerrar la transacción
      return await this.updateByLiteralCriteria(literalCriteria);
    }
    //selecciona el tipo de creación:
    const customQueryRepositoryFn = this.getCustomQueryFn(literalCriteria);
    if (this.util.isFunction(customQueryRepositoryFn)) {
      //personalizada
      const fn =
        customQueryRepositoryFn as TGenericLocalIdbCustomQueryRepositoryFn<any>;
      let registers = await tx.store.getAll();
      registers = await fn(this, literalCriteria, registers);
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
  protected override async updateByLiteralCriteria(
    literalCriteria: IGenericRepositoryCriteria
  ) {
    const { data, keySrc: keySrcContext } = literalCriteria;
    const kId = this.keyId;
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
      await tx.done; //cerrar la transacción
      return await this.createByLiteralCriteria(literalCriteria);
    }
    //selecciona el tipo de actualización:
    const customQueryRepositoryFn = this.getCustomQueryFn(literalCriteria);
    if (this.util.isFunction(customQueryRepositoryFn)) {
      //personalizada
      const fn =
        customQueryRepositoryFn as TGenericLocalIdbCustomQueryRepositoryFn<any>;
      let registers = await tx.store.getAll();
      registers = await fn(this, literalCriteria, registers);
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
  protected override async deleteByLiteralCriteria(
    literalCriteria: IGenericRepositoryCriteria
  ) {
    const { data, keySrc: keySrcContext } = literalCriteria;
    const kId = this.keyId;
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
    const customQueryRepositoryFn = this.getCustomQueryFn(literalCriteria);
    if (this.util.isFunction(customQueryRepositoryFn)) {
      //personalizada
      const fn =
        customQueryRepositoryFn as TGenericLocalIdbCustomQueryRepositoryFn<any>;
      let registers = await tx.store.getAll();
      registers = await fn(this, literalCriteria, registers);
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
  //████ CRUD BY MODULE ████████████████████████████████████████████████████████████
  protected override async primitiveReadByLiteralCriteriaModule(
    literalCriteria: TPrimitiveReadLiteralCriteria
  ) {
    let { data } = literalCriteria;
    const keySrcContext = this.getKeySrcContextFromModule(
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
    const customQueryRepositoryFn =
      this.getCustomQueryFnModule(literalCriteria);
    if (this.util.isFunction(customQueryRepositoryFn)) {
      //personalización
      const fn =
        customQueryRepositoryFn as TPrimitiveLocalIdbCustomQueryRepositoryFn<any>;
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
    const { data } = literalCriteria;
    const kId = this.keyId;
    const keySrcContext = this.getKeySrcContextFromModule(
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
      await tx.done; //cerrar la transacción
      return await this.primitiveUpdateByLiteralCriteriaModule(literalCriteria);
    }
    //selecciona el tipo de creación:
    const customQueryRepositoryFn =
      this.getCustomQueryFnModule(literalCriteria);
    if (this.util.isFunction(customQueryRepositoryFn)) {
      //personalizada
      const fn =
        customQueryRepositoryFn as TPrimitiveLocalIdbCustomQueryRepositoryFn<any>;
      let registers = await tx.store.getAll();
      registers = await fn(this, literalCriteria, registers);
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
  protected override async primitiveUpdateByLiteralCriteriaModule(
    literalCriteria: TPrimitiveModifyLiteralCriteria
  ) {
    const { data } = literalCriteria;
    const kId = this.keyId;
    const keySrcContext = this.getKeySrcContextFromModule(
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
      await tx.done; //cerrar la transacción
      return await this.primitiveCreateByLiteralCriteriaModule(literalCriteria);
    }
    //selecciona el tipo de actualización:
    const customQueryRepositoryFn =
      this.getCustomQueryFnModule(literalCriteria);
    if (this.util.isFunction(customQueryRepositoryFn)) {
      //personalizada
      const fn =
        customQueryRepositoryFn as TPrimitiveLocalIdbCustomQueryRepositoryFn<any>;
      let registers = await tx.store.getAll();
      registers = await fn(this, literalCriteria, registers);
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
  protected override async primitiveDeleteByLiteralCriteriaModule(
    literalCriteria: TPrimitiveModifyLiteralCriteria
  ) {
    const { data } = literalCriteria;
    const kId = this.keyId;
    const keySrcContext = this.getKeySrcContextFromModule(
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
    const customQueryRepositoryFn =
      this.getCustomQueryFnModule(literalCriteria);
    if (this.util.isFunction(customQueryRepositoryFn)) {
      //personalizada
      const fn =
        customQueryRepositoryFn as TPrimitiveLocalIdbCustomQueryRepositoryFn<any>;
      let registers = await tx.store.getAll();
      registers = await fn(this, literalCriteria, registers);
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
  protected override async structureReadByLiteralCriteriaModule(
    literalCriteria: TStructureReadLiteralCriteria<any>
  ) {
    let { data } = literalCriteria;
    const keySrcContext = this.getKeySrcContextFromModule(
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
    const customQueryRepositoryFn =
      this.getCustomQueryFnModule(literalCriteria);
    if (this.util.isFunction(customQueryRepositoryFn)) {
      //personalización
      const fn =
        customQueryRepositoryFn as TStructureLocalIdbCustomQueryRepositoryFn<any>;
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
    const tx = await this.getTransaction(
      {
        keyCollection: keySrcContext,
        keyPrimary: this.keyId,
      },
      "readwrite"
    );
    let registers = await tx.store.getAll();
    //verificar si ya esta creado
    const isExist = this.util.isObject(await tx.store.get(data[kId]));
    if (isExist) {
      const { isCreateOrUpdate } =
        literalCriteria as TStructureModifyLiteralCriteria<any>;
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
      return await this.structureUpdateByLiteralCriteriaModule(literalCriteria);
    }
    //selecciona el tipo de creación:
    const customQueryRepositoryFn =
      this.getCustomQueryFnModule(literalCriteria);
    if (this.util.isFunction(customQueryRepositoryFn)) {
      //personalizada
      const fn =
        customQueryRepositoryFn as TStructureLocalIdbCustomQueryRepositoryFn<any>;
      registers = await fn(this, literalCriteria, registers);
      //⚠ proceso extremadamente lento ⚠
      const proms = registers.map((register) => tx.store.put(register)); //❗actualiza toda la tabla❗
      await Promise.all(proms);
    } else {
      //estándar
      //creación de id:
      data[kId] = this.buildStructureLocalId(registers, data[kId]);
      data[kId] = await tx.store.add(data);
    }
    await tx.done; //cerrar la transacción
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
    const tx = await this.getTransaction(
      {
        keyCollection: keySrcContext,
        keyPrimary: this.keyId,
      },
      "readwrite"
    );
    let registers = await tx.store.getAll();
    //verificar si no esta creado
    const isExist = this.util.isObject(await tx.store.get(data[kId]));
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
        customQueryRepositoryFn as TStructureLocalIdbCustomQueryRepositoryFn<any>;
      registers = await fn(this, literalCriteria, registers);
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
    const tx = await this.getTransaction(
      {
        keyCollection: keySrcContext,
        keyPrimary: this.keyId,
      },
      "readwrite"
    );
    let registers = await tx.store.getAll();
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
    const customQueryRepositoryFn =
      this.getCustomQueryFnModule(literalCriteria);
    if (this.util.isFunction(customQueryRepositoryFn)) {
      //personalizada
      const fn =
        customQueryRepositoryFn as TStructureLocalIdbCustomQueryRepositoryFn<any>;
      registers = await fn(this, literalCriteria, registers);
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
}
