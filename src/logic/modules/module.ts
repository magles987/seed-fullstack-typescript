import { GlobalConfig } from "../../config/global-config";
import { TActionConfigFn } from "../criterias/shared-types";
import { ELogicResStatusCode } from "../reports/shared-types";
import { UtilTwinBee } from "../util/util-twinbee";
import {
  TKeyModule,
  TKeyLogicContext,
  TKeyHandlerModule,
  TKeyActionModule,
} from "./shared-types";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *abstract*
 *
 * clase estructural para  representar un modulo genérico
 */
export abstract class TwinBeeModule {
  /**configuración global */
  protected readonly _globalConfig_ = TwinBeeModule._globalConfig_;
  /**... */
  public static get _globalConfig_() {
    return GlobalConfig.getInstance();
  }
  /** configuración de valores predefinidos para el modulo*/
  public static readonly getDefault = () => {
    //const superDf = Module.getDefault(); //no tiene padre
    return {
      keyModule: undefined as TKeyModule,
    };
  };
  /**clave identificadora del modulo*/
  public get keyModule(): TKeyModule {
    return this._keyModule;
  }
  public set keyModule(v: TKeyModule) {
    if (
      (this._keyModule !== undefined && this._keyModule !== null) ||
      typeof v !== "string"
    )
      return; //🚫 modificaciones posteriores
    this._keyModule = v;
  }
  /**utilidades de este modulo */
  protected readonly util = TwinBeeModule.util;
  /**.utilidades del modulo*/
  public static get util(): UtilTwinBee {
    return TwinBeeModule._globalConfig_.globalUtil;
  }
  /**
   * @param _keyModule clave identificadora del modulo
   */
  constructor(private _keyModule: TKeyModule) {
    this.util = TwinBeeModule.util;
    this._globalConfig_ = TwinBeeModule._globalConfig_;
  }
  /**@returns los valores de configuracion predefinidos */
  protected getDefault() {
    return TwinBeeModule.getDefault();
  }
}
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *abstract*
 *
 * clase estructural para un modulo de tipo lógico
 */
export abstract class LogicTwinBeeModule extends TwinBeeModule {
  public static override readonly getDefault = () => {
    const superDf = TwinBeeModule.getDefault();
    return {
      ...superDf,
      keySrc: undefined as string,
      keyLogicContext: undefined as TKeyLogicContext,
    };
  };
  /**el contexto lógico de esta librería */
  public get keyLogicContext() {
    return this._keyLogicContext;
  }
  protected set keyLogicContext(v: TKeyLogicContext) {
    if (!this.util.isString(v)) return; //🚫 modificaciones posteriores
    this._keyLogicContext = v;
    return;
  }
  private _keySrc: string;
  /**clave identificadora del recurso asociado a modulo*/
  public get keySrc(): string {
    return this._keySrc;
  }
  /**clave identificadora del recurso asociado a modulo*/
  public set keySrc(v: string) {
    if (!this.util.isString(v)) return; //🚫 modificaciones posteriores
    this._keySrc = v;
    return;
  }
  /**
   * @param keyModule clave identificadora del modulo
   * @param _keyLogicContext contexto lógico (estructural o primitivo)
   * @param _keySrc indentificadora del recurso asociado a modulo
   */
  constructor(
    keyModule: TKeyModule,
    private _keyLogicContext: TKeyLogicContext
  ) {
    super(keyModule);
  }
  protected override getDefault() {
    return LogicTwinBeeModule.getDefault();
  }
}
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *abstract*
 *
 * clase estructural para modulos cuyo funcionamiento
 * se base manejadores
 *
 */
export abstract class HandlerTwinBeeModule extends LogicTwinBeeModule {
  public static override readonly getDefault = () => {
    const superDf = LogicTwinBeeModule.getDefault();
    return {
      ...superDf,
    };
  };
  /**
   * @param keyModule clave identificadora del modulo
   * @param keyLogicContext contexto logico (primitivo o estructurado).
   * @param keySrc indentificadora del recurso asociado a modulo
   */
  constructor(keyModule: TKeyHandlerModule, keyLogicContext: TKeyLogicContext) {
    super(keyModule, keyLogicContext);
  }
  protected override getDefault() {
    return HandlerTwinBeeModule.getDefault();
  }
}
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *abstract*
 *
 */
export abstract class LogicTwinBeeModuleWithReport extends LogicTwinBeeModule {
  public static override readonly getDefault = () => {
    const superDf = LogicTwinBeeModule.getDefault();
    return {
      ...superDf,
      /**tolerancia hacia la respuesta del modulo */
      globalTolerance: ELogicResStatusCode.ERROR,
      /**estado inicial de respuesta */
      status: ELogicResStatusCode.SUCCESS,
    };
  };
  /**la tolerancia del modulo a los estados de la accion */
  protected get globalTolerance() {
    return this.getDefault().globalTolerance;
  }
  /**estado global predefinido de respueta*/
  protected get globalStatus(): ELogicResStatusCode {
    return this.getDefault().status;
  }
  /**instancia de manejador de metadatos de este recurso */
  private _metadataHandler: unknown;
  /**
   * @param keyModule clave identificadora del modulo
   * @param keyLogicContext contexto logico (primitivo o estructurado).
   * @param keySrc indentificadora del recurso asociado a modulo
   */
  constructor(keyModule: TKeyModule, keyLogicContext: TKeyLogicContext) {
    super(keyModule, keyLogicContext);
  }
  protected override getDefault() {
    return LogicTwinBeeModuleWithReport.getDefault();
  }
  /**instancia de manejador de metadatos de este recurso */
  public get metadataHandler(): unknown {
    return this._metadataHandler;
  }
  /**instancia de manejador de metadatos de este recurso
   *
   * ⚠ Solo puede modificarse si previamente no se ha
   * asignado una instancia
   */
  public set metadataHandler(metadataHandler: unknown) {
    if (
      !this.util.isInstance(metadataHandler) ||
      this.util.isInstance(this._metadataHandler)
    )
      return; //❗garantiza solo 1 vez inicializar❗
    this._metadataHandler = metadataHandler;
    this.keySrc = (metadataHandler as HandlerTwinBeeModule).keySrc; //❗Actualizacion obligatoria❗
  }
  /**construye un reporte de manejador de respuesta para este modulo
   *
   * @param criteriaHandler instancia del manejador de criterios actual
   * @param keyAction clave indentificadora de la accion
   *
   * @returns instancia del reporte de manejador de respuesta
   */
  protected abstract buildReportHandler(
    criteriaHandler: unknown,
    keyAction: unknown
  ): unknown;
}
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *abstract*
 *
 * clase estructural para modulos cuyo funcionamiento
 * se base acciones controladas por middlewares
 */
export abstract class ActionTwinBeeModule<
  TIDiccAC
> extends LogicTwinBeeModuleWithReport {
  public static override readonly getDefault = () => {
    const superDf = LogicTwinBeeModuleWithReport.getDefault();
    return {
      ...superDf,
      diccActionConfig: {} as unknown,
      /**claves identificadoras que deben tener prioridad de ejecución
       * (siempre y cuando se requieran, de lo contrario ignorarlas) */
      topPriorityKeysAction: [] as any[],
      /**claves identificadoras de acciones OBLIGATORIAS de ejecución */
      topMandatoryKeysAction: [] as any,
    };
  };
  /**clave identificadora del contexto del modulo */
  public abstract get keyModuleContext(): unknown;
  /**diccionario con los las acciones de configuración actuales */
  private _diccActionConfig: TIDiccAC;
  /**diccionario con los las acciones de configuración actuales */
  public get diccActionConfig(): TIDiccAC {
    return this._diccActionConfig;
  }
  /**diccionario con los las acciones de configuración actuales */
  private set diccActionConfig(v: TIDiccAC) {
    const baseDicc = this.getDefault().diccActionConfig as TIDiccAC;
    const newDicc = v;
    this._diccActionConfig = this.util.mergeDiccActionConfig(
      [baseDicc, newDicc],
      { mode: "soft" }
    );
  }
  /**... */
  private _topPriorityKeysAction: Array<keyof TIDiccAC>;
  /**... */
  public get topPriorityKeysAction(): Array<keyof TIDiccAC> {
    let p = this._topPriorityKeysAction;
    return p;
  }
  /**... */
  private set topPriorityKeysAction(v: Array<keyof TIDiccAC>) {
    this._topPriorityKeysAction = this.util.isValueType(v, ["string"])
      ? v
      : this._topPriorityKeysAction === undefined
      ? this._topPriorityKeysAction
      : this.getDefault().topPriorityKeysAction;
    return;
  }
  private _topMandatoryKeysAction: Array<keyof TIDiccAC>;
  public get topMandatoryKeysAction(): Array<keyof TIDiccAC> {
    return this._topMandatoryKeysAction;
  }
  private set topMandatoryKeysAction(v: Array<keyof TIDiccAC>) {
    this._topMandatoryKeysAction = this.util.isValueType(v, ["string"])
      ? v
      : this._topMandatoryKeysAction === undefined
      ? this._topMandatoryKeysAction
      : this.getDefault().topMandatoryKeysAction;
  }
  /**
   * un array con todas las claves identificadoras de todas las acciones
   */
  protected get allKeysActionConfig(): Array<keyof TIDiccAC> {
    const keys = Object.keys(this.diccActionConfig) as Array<keyof TIDiccAC>;
    return keys;
  }
  /**diccionario con todas los metodos (funciones)
   * ejecutables por medio del middleware*/
  private _diccActionFn: Record<keyof TIDiccAC, TActionConfigFn>;
  public get diccActionFn(): Record<keyof TIDiccAC, TActionConfigFn> {
    return this._diccActionFn;
  }
  private set diccActionFn(v: Record<keyof TIDiccAC, TActionConfigFn>) {
    const _that_ = this as any;
    const keysAC = this.allKeysActionConfig;
    let r_diccAFn = {} as any;
    for (const keyAC of keysAC) {
      let acFn = _that_[keyAC] as Function;
      if (this.util.isFunction(acFn)) {
        acFn = acFn.bind(_that_);
        r_diccAFn[keyAC] = acFn as any;
      }
    }
    this._diccActionFn = r_diccAFn;
  }
  /**
   * @param keyModule clave identificadora del modulo
   * @param keyLogicContext contexto logico (primitivo o estructurado).
   */
  constructor(
    keyModule: TKeyActionModule,
    keyLogicContext: TKeyLogicContext,
    baseConfig?: Partial<
      Pick<
        ReturnType<ActionTwinBeeModule<TIDiccAC>["getDefault"]>,
        "diccActionConfig" | "topMandatoryKeysAction" | "topPriorityKeysAction"
      >
    >
  ) {
    super(keyModule, keyLogicContext);
    baseConfig = this.util.isObject(baseConfig) ? baseConfig : ({} as any);
    const { diccActionConfig, topPriorityKeysAction, topMandatoryKeysAction } =
      baseConfig;
    this.diccActionConfig = diccActionConfig as any;
    this.topPriorityKeysAction = topPriorityKeysAction;
    this.topMandatoryKeysAction = topMandatoryKeysAction;
    this.diccActionFn = undefined; //❗Internamente se procesa❗
  }
  protected override getDefault() {
    return ActionTwinBeeModule.getDefault();
  }
  /**obtiene una funcion de accion de acuerdo a su clave identificadora
   * preparada para ser inyectada en el middleware
   *
   * @param keyAction la clave identificadora de la funcion de accion solicitada
   *
   * @returns la funcion de accion
   */
  public getActionFnByKey<TKeys = keyof TIDiccAC>(
    keyAction: TKeys
  ): TActionConfigFn;
  /**obtiene un array de funciones de accion de acuerdo a sus claves identificadoras
   * preparadas para ser inyectadas en el middleware
   *
   * @param keysAction el array de las claves identificadoras de las funciones de accion solicitadas
   *
   * @returns el array de funciones de accion
   */
  public getActionFnByKey<TKeys = keyof TIDiccAC>(
    keysAction: TKeys[]
  ): Array<TActionConfigFn>;
  /**... */
  public getActionFnByKey(keyOrKeys: unknown): unknown {
    let fFnOrAFFn: TActionConfigFn | Array<TActionConfigFn>;
    const diccACFn = this.diccActionFn;
    if (!Array.isArray(keyOrKeys)) {
      fFnOrAFFn = diccACFn[keyOrKeys as keyof TIDiccAC];
    } else {
      fFnOrAFFn = [];
      for (const key of keyOrKeys as Array<keyof TIDiccAC>) {
        fFnOrAFFn.push(diccACFn[key]);
      }
    }
    return fFnOrAFFn;
  }
  /**
   * obtiene una tupla con la clave identificadora y la configuración
   *  de acción actualizada en el manejador de criterios
   *
   * @param criteriaHandler el manejador de criterios para la petición
   * @param keyActionConfig clave identificadora de la acción
   *
   * @returns la tupla de la configuracion de acción con el siguiente formato:
   *  - `[0]` la clave identificadora de la accion *keyAction*
   *  - `[1]` la conficuracion de accion *actionConfig*
   */
  protected abstract getTupleActionConfigFromCriteriaHandler(
    criteriaHandler: unknown,
    keyActionConfig: unknown
  ): unknown;
  /**micro hook embebido que se ejecuta antes de ejecutar la accion
   *
   * @param criteriaHandler
   * @param keyActionConfig
   * @returns criteriaHandler posiblemente mutado
   */
  public abstract preRunAction(
    criteriaHandler: unknown,
    keyActionConfig: unknown
  ): void;
  /**micro hook embebido que se ejecuta despues de ejecutar la accion
   *
   * @param criteriaHandler
   * @param res
   * @returns el objeto res (posiblemente mutado), el `criteriaHandler` tambien puede ser mutado
   */
  public abstract postRunAction(criteriaHandler: unknown, res: unknown): void;
}
