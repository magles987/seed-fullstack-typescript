import { LogicModule } from "../modules/module";
import {
  TKeyLogicContext,
  TKeyModuleWithReport,
} from "../modules/shared-types";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**refactorizacion de la clase */
export type Trf_LogicMetadataHandler = LogicMetadataHandler;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *abstract*
 *
 */
export abstract class LogicMetadataHandler extends LogicModule {
  /** configuración de valores predefinidos para el modulo*/
  public static readonly getDefault = () => {
    const superDf = LogicModule.getDefault();
    return {
      ...superDf,
      handlerConfig: {},
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
   * @param keySrc clave identificadora del recurso
   *
   */
  constructor(keyLogicContext: TKeyLogicContext, keySrc: string) {
    super("metadata", keyLogicContext);
    this.keySrc = keySrc;
  }
  protected override getDefault() {
    return LogicMetadataHandler.getDefault();
  }
  /**construye un nuevo metadato */
  protected abstract buildMetadata(
    newMetadata: unknown,
    currentMetadata?: unknown
  ): unknown;
  /**obtiene la clave identificadora del modulo a
   * partir de una clave identificadora de contexto de modulo
   *
   */
  public abstract getKeyModuleFromKeyModuleContext(
    keyModuleCOntext: unknown
  ): TKeyModuleWithReport;
}
