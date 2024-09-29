import { TKeyLogicContext } from "../../../../../../../config/shared-modules";
import { LocalRepository } from "../_local-repository";
import { IDBConnection } from "./_connection";
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
  extends LocalRepository
  implements ReturnType<LocalIDBRepository<TKeyActionRequest>["getDefault"]>
{
  /**@returns todos los campos con sus valores predefinidos para instancias de esta clase*/
  public static readonly getDefault = () => {
    return {
      db_name: "logic",
      db_version: 1,
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
  /**conexion a IndexableDB  base de datos del navegador*/
  protected connection = IDBConnection.getInstance();
  /**
   * @param keyLogicContext clave identificadora del contexto logico
   * @param keySrc clave identificadora del recurso
   * @param base objeto literal con valores personalizados para iniicalizar las propiedades
   * @param isInit `= true` ❕Solo para herencia❕, indica si esta clase debe iniciar las propiedaes
   */
  constructor(
    keyLogicContext: TKeyLogicContext,
    keySrc: string,
    base: Partial<
      ReturnType<LocalIDBRepository<TKeyActionRequest>["getDefault"]>
    > = {},
    isInit = true
  ) {
    super("idb", keyLogicContext, keySrc);
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
  /**inicializa las propiedades de manera dinamica
   *
   * @param base objeto literal con valores personalizados para iniicalizar las propiedades
   */
  protected initProps(
    base: Partial<
      ReturnType<LocalIDBRepository<TKeyActionRequest>["getDefault"]>
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
    key: keyof ReturnType<LocalIDBRepository<TKeyActionRequest>["getDefault"]>
  ): void {
    const df = this.getDefault();
    this[key as any] = df[key];
    return;
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
  protected abstract createAndSetSchemaConfig(
    keyCollection: string,
    keyPrimary?: string
  ): void;
  /**
   * verifica si el esquema esta registrado
   * ____
   */
  protected checkSchema() {
    const mapSch = this.connection.mapSchemaConfig;
    const isRegistered = mapSch.has(this.keySrc);
    if (!isRegistered) {
      this.createAndSetSchemaConfig(this.keySrc);
    }
  }
  /**
   * ____
   * @returns la conexion abierta a la BD
   */
  protected async getDB() {
    this.checkSchema();
    let db = await this.connection.openConnect(this.db_name, this.db_version);
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
    transactionType: "readonly" | "readwrite" | "versionchange"
  ) {
    const db = await this.getDB();
    const tx = db.transaction(this.keySrc, transactionType);
    return tx;
  }
}
