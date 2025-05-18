import { ELogicCodeError, LogicError } from "../errors/logic-error";
import { LogicTwinBeeModule, TwinBeeModule } from "../modules/module";
import {
  TKeyLogicContext,
  TKeyModuleWithReport,
} from "../modules/shared-types";
import { UtilGeneratorId } from "../util/util-generator-id";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**refactorizacion de la clase */
export type Trf_LogicMetadataHandler = LogicMetadataHandler;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *abstract*
 *
 */
export abstract class LogicMetadataHandler extends LogicTwinBeeModule {
  /** configuración de valores predefinidos para el modulo*/
  public static readonly getDefault = () => {
    const superDf = LogicTwinBeeModule.getDefault();
    return {
      ...superDf,
      handlerConfig: {},
    };
  };
  /**... */
  private static _diccRegister: Record<any, LogicMetadataHandler> = {};
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
  /**... */
  protected static checkKeySrc(baseKeySrc: string): string {
    const util = TwinBeeModule.util;
    const isExist = util.isInstance(
      LogicMetadataHandler._diccRegister[baseKeySrc]
    );
    if (isExist) {
      throw new LogicError({
        code: ELogicCodeError.EXIST,
        msn: `resource key as ${baseKeySrc} already exists`,
      });
    }
    return baseKeySrc;
  }
  /**... */
  protected static buildMetadataHandlerAndSetRegister<TLogicMetadataHandler>(
    keySrc: string,
    builderMetadataHandlerFn: () => TLogicMetadataHandler
  ): TLogicMetadataHandler {
    const util = TwinBeeModule.util;
    if (!util.isString(keySrc)) {
      throw new LogicError({
        code: ELogicCodeError.NOT_EXIST,
        msn: `${keySrc} is not resource key valid`,
      });
    }
    if (!util.isFunction(builderMetadataHandlerFn)) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${builderMetadataHandlerFn} is not builder function valid`,
      });
    }
    //asegurar inicialización de diccionario de registros
    if (!util.isObject(LogicMetadataHandler._diccRegister))
      LogicMetadataHandler._diccRegister = {};
    //determina si ya existe para no reconstruirlo
    let mH = LogicMetadataHandler._diccRegister[
      keySrc
    ] as TLogicMetadataHandler;
    mH = util.isInstance(mH) ? mH : builderMetadataHandlerFn();
    return mH;
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
