/**
 * https://www.npmjs.com/package/idb?activeTab=versions
 */
import { openDB, deleteDB, wrap, unwrap, DBSchema, IDBPDatabase } from "idb";
import { Util_Provider } from "../../../../../../_util-provider";
import { Model } from "../../../../../../../models/_model";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**define tipo configuracion para un esquema de datos */
type TSchemaConfig = ReturnType<
  (typeof IDBConnection)["getDefault"]
>["schemaConfig"];
/**Refactorizacion de la clase */
export type Trf_IDBConnection = IDBConnection;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** @info <hr>  

 * *Singleton*  
 * descrip... 
 * ____
*/
export class IDBConnection {
  protected static readonly getDefault = () => {
    return {
      schemaConfig: {
        /**determina si la llave primaria es
         * autoincremental
         *
         * ⚠ SOLO aceptable cuando es una
         * llave primaria de tipo `number`
         */
        autoIncrement: false,
        /**el identificador de la coleccion
         * (si se habla en esquema de modelos
         * seria el identificador en **plural**
         * del modelo).
         */
        keyCollection: <string>undefined,
        /**la llave primaria de la coleccion
         * o tabla
         */
        keyPrimary: <keyof Model>"_id",
        /**los identificadores de los campos
         * que serán a configurar como indexables
         * (que se usan para consultas)
         */
        keysIndexable: <string[]>[],
        /**??? un prefijo que identifica al campo
         * de busqueda ???Lo solicita la libreria
         * `idb` pero no se conoce bien el porque
         * de su uso
         *
         * ⚠ dejar que la conexion lo asigne por
         * si mismo hasta que se le encuentre
         * funcionamiento
         */
        prefixIndexable: `by-`,
      },
    };
  };
  /**map de esquemas de configuracion activos
   * (la `key` del mapa serán los mismos
   * `keyCollection` de la configuracion) */
  private static readonly mapSchemaConfig: Map<string, TSchemaConfig> =
    new Map();
  /** utilidades*/
  protected util = Util_Provider.getInstance();
  /**Almacena la instancia única de esta clase*/
  private static instance: IDBConnection;
  /** */
  constructor() {}
  /**devuelve la instancia única de esta clase
   * ya sea que la crea o la que ya a sido creada
   */
  public static getInstance(): IDBConnection {
    IDBConnection.instance =
      !IDBConnection.instance || IDBConnection.instance == null
        ? new IDBConnection()
        : IDBConnection.instance;
    return IDBConnection.instance;
  }
  /**
   * @returns mapa con todos los equemas
   * de configuracion registrados
   */
  get mapSchemaConfig() {
    return IDBConnection.mapSchemaConfig;
  }
  /**
   * construye un esquema de configuracion
   * para settear un db
   * ____
   * @returns el schema ya construido
   *
   */
  private buildSchemaConfig(param?: Partial<TSchemaConfig>) {
    let schemaConfig: TSchemaConfig;
    const df = IDBConnection.getDefault().schemaConfig;
    if (!this.util.isObject(param)) {
      schemaConfig = df;
    } else {
      const {
        keyCollection,
        keyPrimary,
        autoIncrement,
        keysIndexable,
        prefixIndexable,
      } = param;
      schemaConfig = {
        keyCollection: this.util.isNotUndefinedAndNotNull(keyCollection)
          ? keyCollection
          : df.keyCollection,
        keyPrimary: this.util.isNotUndefinedAndNotNull(keyPrimary)
          ? keyPrimary
          : df.keyPrimary,
        autoIncrement: this.util.isNotUndefinedAndNotNull(autoIncrement)
          ? autoIncrement
          : df.autoIncrement,
        keysIndexable: this.util.isNotUndefinedAndNotNull(keysIndexable)
          ? keysIndexable
          : df.keysIndexable,
        prefixIndexable: this.util.isNotUndefinedAndNotNull(prefixIndexable)
          ? prefixIndexable
          : df.prefixIndexable,
      };
    }
    return schemaConfig;
  }
  /**
   * abrir la coneccion a la BD
   * ____
   * @param aSchemasConfig el array
   * con todos los esquemas disponibles
   * para settearlos
   * ____
   * @returns una conexion lista a la DB
   */
  public openConnect<TIScheme>(
    db_name: string,
    db_version: number
  ): Promise<IDBPDatabase<TIScheme>> {
    //descarga todos los esquemas configurados
    const aSchemasConfig = Array.from(this.mapSchemaConfig.values());
    return openDB(db_name, db_version, {
      //HOOKs de conexion, su llamado es autogestionado por la misma conexion
      upgrade: ((
        db: IDBPDatabase<any>,
        oldVersion: number,
        newVersion: number,
        transaction
      ) => {
        aSchemasConfig.forEach((sC) => this.setSchemaAtDB(db, sC));
      }).bind(this),
      blocked: ((currentVersion: number, blockedVersion: number) => {}).bind(
        this
      ),
      blocking: ((currentVersion: number, blockedVersion: number) => {}).bind(
        this
      ),
      terminated: (() => {
        //...se dispara este hook si inesperadamente termina la conexion
        throw new Error(
          `Connection IDB from provider local-idb has terminated`
        );
      }).bind(this),
    });
  }
  /**eliminar la base de datos*/
  public async deleteDB(db_name: string) {
    await deleteDB(db_name);
    return;
  }

  /**
   * setea un schema de configuracion
   * para una coleccion
   * ____
   * @param db la base de datos actual
   * @param schemaConfig el esquema de
   * configuracion a settear
   *
   */
  private setSchemaAtDB(
    db: IDBPDatabase<any>,
    schemaConfig: Partial<TSchemaConfig>
  ) {
    const {
      autoIncrement,
      keyCollection,
      keyPrimary,
      keysIndexable,
      prefixIndexable,
    } = this.buildSchemaConfig(schemaConfig);
    const store = db.createObjectStore(keyCollection, {
      keyPath: keyPrimary,
      autoIncrement,
    });
    keysIndexable.forEach((key) => {
      const nameIdx = `${prefixIndexable}${key}`;
      store.createIndex(nameIdx, key);
    });
    return;
  }
  /**
   * descrip...
   * ____
   * @returns ``
   *
   */
  public setSchemaConfig(newSchemaConfig: Partial<TSchemaConfig>) {
    const mapSch = this.mapSchemaConfig;
    mapSch.set(
      newSchemaConfig.keyCollection,
      this.buildSchemaConfig(newSchemaConfig)
    );
    return;
  }
  /**
   * crea un nuevo esquema de configuracion
   * y lo registra en el mapa
   *
   */
  protected createSchema(keyCollection: string) {}
}
