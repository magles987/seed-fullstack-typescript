import { ActionModule, LogicModule } from "../config/module";
import { TKeyLogicContext } from "../config/shared-modules";
import { ELogicCodeError, LogicError } from "../errors/logic-error";
import { Driver } from "../providers/_drivers/_driver";
import { FetchDriver } from "../providers/_drivers/client/web/https/fetch/fetch-driver";
import { CookieDriver } from "../providers/_drivers/client/web/local-repositories/cookie/cookie-driver";
import { IdbDriver } from "../providers/_drivers/client/web/local-repositories/idb/_idb-driver";
import { StorageDriver } from "../providers/_drivers/client/web/local-repositories/storage/storage-driver";
import { Trf_IBuilderBaseMetadata } from "./builder-shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**refactorizacion de la clase */
export type Trf_LogicMetadataHandler = LogicMetadataHandler;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *abstract*
 *
 */
export abstract class LogicMetadataHandler extends LogicModule {
  /** configuracion de valores predefinidos para el modulo*/
  public static readonly getDefault = () => {
    const superDf = LogicModule.getDefault();
    return {
      ...superDf,
      handlerConfig: {},
      driverList: [
        new CookieDriver(),
        new StorageDriver(),
        new IdbDriver(),
        new FetchDriver(),
        //
      ] as [Driver, ...Driver[]],
    };
  };
  /**metadatos de este recurso */
  private _metadata: unknown;
  /**metadatos de este recurso*/
  protected get metadata() {
    return this._metadata;
  }
  /**metadatos de este recurso*/
  protected set metadata(v: unknown) {
    this._metadata = v;
  }
  /**diccionario con todas las instancias de todos los modulos
   * necesarios para la logica en contexto de este recurso*/
  private _diccModuleInstanceContext: unknown;
  /**diccionario con todas las instancias de todos los modulos
   * necesarios para la logica en contexto de este recurso*/
  public get diccModuleInstanceContext() {
    let rDicc = {};
    // evitar modificaciones al diccionario actual
    const keysDicc = Object.keys(this._diccModuleInstanceContext);
    for (const keyDicc of keysDicc) {
      rDicc[keyDicc] = this._diccModuleInstanceContext[keyDicc];
    }
    return rDicc;
  }
  /**diccionario con todas las instancias de todos los modulos
   * necesarios para la logica en contexto de este recurso*/
  protected set diccModuleInstanceContext(v: unknown) {
    this._diccModuleInstanceContext = v;
  }
  /**Array con prefijos de propiedades que
   * corresponden a configuracion comun
   * de los metadatos, en formato de `RegExp`*/
  public static readonly prefixesConfigKeyMetaProperties: RegExp[] = [
    /^_/,
    /^__/,
  ];
  /**determina que un metodo esta obligado
   * a recibir este token para gantarizar
   * que su llamado fue desde un modulo
   * permitido*/
  protected pseudoTokent = "#0nly-C0ntr0ll3r#";
  /**
   * @param keyLogicContext contexto lógico (primitivo o estructurado).
   * @param baseConfigMeta
   *
   */
  constructor(
    keyLogicContext: TKeyLogicContext,
    baseConfigMeta: Trf_IBuilderBaseMetadata
  ) {
    super("metadata", keyLogicContext);
    if (!this.util.isObject(baseConfigMeta)) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${baseConfigMeta} is no base metadata valid`,
      });
    }
    this.keySrc = baseConfigMeta.keySrc;
  }
  /**construye un diccionario de instancias de modulos de
   * accion y cursor.
   *
   * @param diccMIContext un diccionario personalizado
   *
   * @returns el diccionario ya contruido
   */
  protected abstract buildDiccModuleContextInstance(
    diccMIContext?: unknown
  ): unknown;
  /**construye un nuevo metadato */
  public abstract buildMetadata(
    newMetadata: unknown,
    currentMetadata?: unknown
  ): unknown;
  /**@returns los metadatos clonados
   *
   * ⚠Consume muchos recursos, por que es clonacion completa⚠
   */
  public getMetadataClone(): typeof this.metadata {
    const metadataClon = this.util.clone(this.metadata, "lodash");
    return metadataClon;
  }
  /**obtiene una instancia de un modulo de tipo `actionModule`
   * @param keyModuleContext clave identificadora del modulo (específicamente su contexto)
   * @returns la instancia del modulo de acciones correspondiente
   */
  public abstract getModuleInstanceForActionContext(
    keyModuleContext: unknown
  ): ActionModule<any>;
  /**fusionador de instancias de drivers para inicializar los metadatos */
  protected mergeDriversList(tDriversList: [Driver[], Driver[]]): Driver[] {
    if (!this.util.isTuple(tDriversList, 2)) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${tDriversList} is not driver list tuple valid`,
      });
    }
    const [baseDriverList, newDriverList] = tDriversList;
    const isBase = this.util.isArray(baseDriverList, true);
    const isNew = this.util.isArray(newDriverList, true);
    if (!isBase || !isNew) {
      if (isBase && !isNew)
        return baseDriverList.filter((driver) => this.util.isInstance(driver));
      if (!isBase && isNew)
        return newDriverList.filter((driver) => this.util.isInstance(driver));
      return [];
    }
    //fusión fuerte implícita
    let driverList_merged = [...baseDriverList, ...newDriverList].filter(
      (driver) => this.util.isInstance(driver) //solo los items que sean instancias
    );
    const keyPropName: keyof Driver = "nameLogicDriver";
    driverList_merged = this.util.removeArrayDuplicate(driverList_merged, {
      keyOrKeysPath: keyPropName,
      itemConflictMode: "last",
    });
    return driverList_merged;
  }
  /**obtiene el driver asociado a partir de su nombre de grupo
   *
   * @param name  el nombre del driver a buscar
   * @returns el driver asociado
   */
  public abstract getDriverByName(name: string): Driver;
}
