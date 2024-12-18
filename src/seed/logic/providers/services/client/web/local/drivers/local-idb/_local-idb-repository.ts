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
import { IDBConnection, TSchemaConfig } from "./_connection";
import { ILocalIDBRepositoryConfig } from "./shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**refactorizacion de la clase */
export type Trf_LocalIDBRepository = LocalIDBRepository<any>;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *selfconstructor*
 *
 * ...
 */
export abstract class LocalIDBRepository<TKeyActionRequest>
  extends LocalRepositoryDriver
  implements ReturnType<LocalIDBRepository<TKeyActionRequest>["getDefault"]>
{
  /**@returns todos los campos con sus valores predefinidos para instancias de esta clase*/
  public static readonly getDefault = () => {
    return {
      db_name: "logic",
      db_version: 1,
      srcSelector: "plural",
    } as ILocalIDBRepositoryConfig;
  };
  /**@returns todas las constantes a usar en instancias de esta clase*/
  protected static readonly getCONSTANTS = () => {
    return {
      //..aqui las constantes
    };
  };
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
  private _keySrcSelector: TKeySrcSelector;
  public get srcSelector(): TKeySrcSelector {
    return this._keySrcSelector;
  }
  protected set srcSelector(v: TKeySrcSelector) {
    this._keySrcSelector =
      v === "plural" || v === "singular"
        ? v
        : this._keySrcSelector !== undefined
        ? this._keySrcSelector
        : this.getDefault().srcSelector;
  }
  /**conexion a IndexableDB  base de datos del navegador*/
  protected connection = IDBConnection.getInstance();
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
      ReturnType<LocalIDBRepository<TKeyActionRequest>["getDefault"]>
    > = {},
    isInit = true
  ) {
    super("idb", keyLogicContext, queryJsAdaptator);
    if (isInit) this.initProps(base);
  }
  /**@returns todos los campos con sus valores predefinidos*/
  protected getDefault() {
    return LocalIDBRepository.getDefault();
  }
  /**@returns todas las constantes de la clase para las instancias*/
  protected getCONST() {
    return LocalIDBRepository.getCONSTANTS();
  }
  /**inicializa las propiedades de manera dinámica
   *
   * @param base objeto literal con valores personalizados para iniicalizar las propiedades
   */
  protected initProps(
    base: Partial<
      ReturnType<LocalIDBRepository<TKeyActionRequest>["getDefault"]>
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
    key: keyof ReturnType<LocalIDBRepository<TKeyActionRequest>["getDefault"]>
  ): void {
    const df = this.getDefault();
    this[key as any] = df[key];
    return;
  }
  /**muta las propiedades masivamente */
  public mutateProps(
    base: Partial<
      Omit<
        ReturnType<LocalIDBRepository<TKeyActionRequest>["getDefault"]>,
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
    txData: any,
    partialSchemaConfig: Partial<
      Pick<TSchemaConfig, "keysIndexable" | "prefixIndexable">
    > = {}
  ): Promise<any> {
    if (!this.util.isString(keyGenericSrc)) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${keyGenericSrc} is not generic src key valid`,
      });
    }
    const fullSchemaConfig = this.connection.buildSchemaConfig({
      ...partialSchemaConfig,
      keyCollection: keyGenericSrc, //obligatorio sobrescrita
      keyPrimary: "_id", //❗Obligatorio, esta primary key universal❗
      autoIncrement: true, //❕necesario para la automatización❕
    });
    const _findIdxFn = (dt) => {
      //desempaquetar solo para comparación
      const modDt = dt[keyGenericSrc];
      const r = this.util.isEquivalentTo([modDt, txData], {});
      return r;
    };
    const tx = await this.getTransaction(fullSchemaConfig, "readwrite");
    let rxData: any;
    if (keyBasicCRUD === "read") {
      rxData = await tx.store.getAll();
      //desempaquetar objeto almacenado
      rxData = (rxData as any[]).map((dt) => dt[keyGenericSrc]);
    } else if (keyBasicCRUD === "create") {
      const aData = await tx.store.getAll();
      const fIdx = aData.findIndex(_findIdxFn);
      const keyId = fullSchemaConfig.keyPrimary;
      //empaquetar data a almacenar
      let modTxData = {};
      modTxData[keyGenericSrc] = txData;
      if (fIdx === -1) {
        modTxData[keyId] = undefined; //el autoincremento se encarga de esto.
        await tx.store.add(modTxData); //creación
      } else {
        modTxData[keyId] = aData[fIdx][keyId]; //retomar el id ya almacenado.
        await tx.store.put(modTxData); //actualización forzada
      }
      rxData = txData;
    } else if (keyBasicCRUD === "update") {
      const aData = await tx.store.getAll();
      const fIdx = aData.findIndex(_findIdxFn);
      const keyId = fullSchemaConfig.keyPrimary;
      //empaquetar data a almacenar
      let modTxData = {};
      modTxData[keyGenericSrc] = txData;
      if (fIdx === -1) {
        modTxData[keyId] = undefined; //el autoincremento se encarga de esto.
        await tx.store.add(txData); //crearlo forzado
      } else {
        modTxData[keyId] = aData[fIdx][keyId]; //retomar el id ya almacenado.
        await tx.store.put(txData); //actualización
      }
      rxData = txData;
    } else if (keyBasicCRUD === "delete") {
      const aData = await tx.store.getAll();
      const fIdx = aData.findIndex(_findIdxFn);
      const keyId = fullSchemaConfig.keyPrimary;
      //empaquetar data a almacenar
      let modTxData = {};
      modTxData[keyGenericSrc] = txData;
      if (fIdx >= 0) {
        modTxData[keyId] = aData[fIdx][keyId];
        tx.store.delete(modTxData[keyId]); //Eliminación
      }
      rxData = txData;
    } else {
      await tx.done; //cerrar la transacción
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${keyBasicCRUD} is not basic CRUD key valid`,
      });
    }
    await tx.done; //cerrar la transacción
    return rxData;
  }
  /**
   * ____
   * @param keyCollection la clave
   * identificadora de la coleccion
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
   * @returns la conexion abierta a la BD
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
  public static async deleteCurrentDataBase(
    db_name = LocalIDBRepository.getDefault().db_name
  ): Promise<void> {
    const connection = IDBConnection.getInstance();
    await connection.deleteDB(db_name);
    return;
  }
}
