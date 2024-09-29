import { LogicModule } from "../config/module";
import { TKeyLogicContext } from "../config/shared-modules";
import { Util_Meta } from "./_util-meta";
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
    return {
      handlerConfig: undefined,
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
  private _diccModuleIntanceContext: unknown;
  /**diccionario con todas las instancias de todos los modulos
   * necesarios para la logica en contexto de este recurso*/
  public get diccModuleIntanceContext() {
    let rDicc = {};
    // evitar modificaciones al diccionario actual
    const keysDicc = Object.keys(this._diccModuleIntanceContext);
    for (const keyDicc of keysDicc) {
      rDicc[keyDicc] = this._diccModuleIntanceContext[keyDicc];
    }
    return rDicc;
  }
  /**diccionario con todas las instancias de todos los modulos
   * necesarios para la logica en contexto de este recurso*/
  protected set diccModuleIntanceContext(v: unknown) {
    this._diccModuleIntanceContext = v;
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
  protected override readonly util = Util_Meta.getInstance();
  /**
   * @param keyLogicContext contexto logico (primitivo o estructurado).
   * @param keySrc clave indentificadora del recurso asociado a modulo
   */
  constructor(keyLogicContext: TKeyLogicContext, keySrc: string) {
    super("metadata", keyLogicContext, keySrc);
    this.util = Util_Meta.getInstance();
  }
  /**construye un diccionario de instancias de modulos de
   * accion y cursor.
   *
   * @param diccMIContext un diccionario personalizado
   *
   * @returns el diccionario ya contruido
   */
  protected abstract buildDiccModuleContextIntance(
    diccMIContext?: unknown
  ): unknown;
  /**en el diccionario de instancias de modulo, se inyecta
   * este manejador de metadatos en cada modulo requerido
   *
   * @param diccModuleInstContext el diccionario de instancias de modulos a los
   * cuales se desea inyectar este manejador de metadatos
   *
   * @returns el diccionario con las instancias
   * ya inyectadas de este manejador de metadatos
   */
  protected abstract injectThisHandlerIntoModuleInstance(
    diccModuleInstContext: unknown
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
}
