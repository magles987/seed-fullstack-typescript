import { ELogicCodeError, LogicError } from "../errors/logic-error";
import { ELogicResStatusCode } from "../reports/shared";
import { Util_Module } from "../util/util-module";
import {
  TKeyActionModule,
  TKeyModule,
  TKeyLogicContext,
  TKeyHandlerModule,
} from "./shared-modules";
import { TFnBagForActionModule } from "../bag-module/shared-for-external-module";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**interfaz especial para las opciones de
 * contruccion de una accion de configuracion */
export interface IBuildACOption {
  /**modo de fusion de las acciones de configuracion*/
  mergeMode?: "soft" | "hard";
  /**ruta del recurso solicitado
   *
   * **⚠** necesario y obligatorio si el recurso es estructurado
   * (los primitivos no lo requieren).
   *
   * **⚠** si no se asigna una ruta correcta simplemente se asume
   * que cualquier tipo de consulta o fusion se hará
   */
  keyPath?: string;
  /**la fuente para obtiene diccionario de configuracion de acciones
   *
   * - `"default"` el diccionario predefinido para este modulo y sus variantes
   * - `"metadata"` el diccionario definido en los metadatos especificamente
   * para cada contexto (primitivo o estructurado).
   */
  sourceDiccBase?: "default" | "metadata";
}
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *abstract*
 *
 * clase estructural para  representar un modulo genérico
 */
export abstract class Module {
  /** configuracion de valores predefinidos para el modulo*/
  public static readonly getDefault = () => {
    //const superDf = Module.getDefault(); //no tiene padre
    return {};
  };
  /**utilidades de este modulo */
  protected abstract readonly util: unknown; //su tipo sera asignado en cada clase materializada de modulo
  /**
   * @param _keyModule clave identificadora del modulo
   */
  constructor(private readonly _keyModule: TKeyModule) {}
  /**@returns los valores de configuracion predefinidos */
  protected getDefault() {
    return Module.getDefault();
  }
  /**clave identificadora del modulo*/
  public get keyModule(): TKeyModule {
    return this._keyModule;
  }
}
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *abstract*
 *
 * clase estructural para un modulo de tipo lógico
 */
export abstract class LogicModule extends Module {
  /** configuracion de valores predefinidos para el modulo*/
  public static readonly getDefault = () => {
    const superDf = Module.getDefault();
    return {
      ...superDf,
    };
  };
  /**
   * @param keyModule clave identificadora del modulo
   * @param _keyLogicContext contexto lógico (estructural o primitivo)
   * @param _keySrc indentificadora del recurso asociado a modulo
   */
  constructor(
    keyModule: TKeyModule,
    private readonly _keyLogicContext: TKeyLogicContext,
    private readonly _keySrc: string
  ) {
    super(keyModule);
  }
  protected override getDefault() {
    return LogicModule.getDefault();
  }
  /**el contexto logico de esta libreria */
  public get keyLogicContext() {
    return this._keyLogicContext;
  }
  /**clave indentificadora del recurso asociado a modulo*/
  public get keySrc(): string {
    return this._keySrc;
  }
}
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *abstract*
 *
 * clase estructural para modulos cuyo funcionamiento
 * se base manejadores
 *
 */
export abstract class HandlerModule extends LogicModule {
  /** configuracion de valores predefinidos para el modulo*/
  public static readonly getDefault = () => {
    const superDf = LogicModule.getDefault();
    return {
      ...superDf,
    };
  };
  /**
   * @param keyModule clave identificadora del modulo
   * @param keyLogicContext contexto logico (primitivo o estructurado).
   * @param keySrc indentificadora del recurso asociado a modulo
   */
  constructor(
    keyModule: TKeyHandlerModule,
    keyLogicContext: TKeyLogicContext,
    keySrc: string
  ) {
    super(keyModule, keyLogicContext, keySrc);
  }
  protected override getDefault() {
    return HandlerModule.getDefault();
  }
}
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *abstract*
 *
 */
export abstract class LogicModuleWithReport extends LogicModule {
  /** configuracion de valores predefinidos para el modulo*/
  public static readonly getDefault = () => {
    return {
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
  /**instance de manejador de reporte de respuestas */
  private _reportHandler: unknown;
  /**
   * @param keyModule clave identificadora del modulo
   * @param keyLogicContext contexto logico (primitivo o estructurado).
   * @param keySrc indentificadora del recurso asociado a modulo
   */
  constructor(
    keyModule: TKeyModule,
    keyLogicContext: TKeyLogicContext,
    keySrc: string
  ) {
    super(keyModule, keyLogicContext, keySrc);
  }
  protected override getDefault() {
    return LogicModuleWithReport.getDefault();
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
    const util = Util_Module.getInstance();
    if (
      !util.isInstance(metadataHandler) ||
      util.isInstance(this._metadataHandler)
    )
      return; //❗garantiza solo 1 vez inicializar❗
    this._metadataHandler = metadataHandler;
  }
  /**instancia del manejador de reportes de respuestas para este modulo */
  public get reportHandler(): unknown {
    return this._reportHandler;
  }
  /**instancia del manejador de reportes de respuestas para este modulo */
  public set reportHandler(reportHandler: unknown) {
    const util = Util_Module.getInstance();
    if (!util.isInstance(reportHandler) || util.isInstance(this._reportHandler))
      return; //❗garantiza solo 1 vez inicializar❗
    this._reportHandler = reportHandler;
    return;
  }
}
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *abstract*
 *
 * clase estructural para modulos cuyo funcionamiento
 * se base acciones controladas por middlewares
 */
export abstract class ActionModule<TIDiccAC> extends LogicModuleWithReport {
  /** configuracion de valores predefinidos para el modulo*/
  public static readonly getDefault = () => {
    const superDf = LogicModuleWithReport.getDefault();
    return {
      ...superDf,
      dfDiccActionConfig: {} as unknown,
      /**claves identificadoras que deben tener prioridad de ejecucion
       * (siempre y cuando se requieran, de lo contrario ignorarlas) */
      topPriorityKeysAction: [] as any[],
      /**claves identificadoras de acciones OBLIGATORIAS de ejecucion */
      topMandatoryKeysAction: [] as any,
    };
  };
  /**diccionario con todas los metodos (funciones)
   * ejecutables por medio del middleware*/
  private _diccActionFn: Record<keyof TIDiccAC, TFnBagForActionModule<any>>;
  /**predefinido las opciones de contruccion de acciones de configuracion*/
  private _dfBuilderACOption: IBuildACOption = {
    mergeMode: "soft",
    keyPath: undefined,
    sourceDiccBase: "metadata",
  };
  /**
   * @param keyModule clave identificadora del modulo
   * @param keyLogicContext contexto logico (primitivo o estructurado).
   * @param keySrc indentificadora del recurso asociado a modulo
   */
  constructor(
    keyModule: TKeyActionModule,
    keyLogicContext: TKeyLogicContext,
    keySrc: string
  ) {
    super(keyModule, keyLogicContext, keySrc);
    this.initDiccActionFn();
  }
  protected override getDefault() {
    return ActionModule.getDefault();
  }
  /**inicializa el diccionario de funciones (metodos) de accion
   *
   * ⚠ permite ser inicializado una unica vez, los demas llamados
   * a este metodo serán ignorados
   */
  private initDiccActionFn(): void {
    const util = Util_Module.getInstance();
    if (util.isObject(this._diccActionFn)) return; //solo se puede inicializar 1 vez
    const _that_ = this as any;
    const keysAC = this.allKeysActionConfig;
    let r_diccAFn = {} as any;
    for (const keyAC of keysAC) {
      let acFn = _that_[keyAC] as Function;
      if (typeof acFn === "function") {
        acFn = acFn.bind(_that_);
        r_diccAFn[keyAC] = acFn as any;
      }
    }
    this._diccActionFn = r_diccAFn;
    return;
  }
  /**
   * diccionario de configuracion de acciones predefinido
   * para este modulo
   * ____
   * ⚠ Requiere ser de alcance publico para
   * tipar los diccionarios de acciones de
   * configuracion fuera de este modulo.
   */
  public get dfDiccActionConfig(): TIDiccAC {
    const df = this.getDefault();
    const r = df.dfDiccActionConfig as TIDiccAC;
    return r;
  }
  /**
   * @returns las claves identificadoras con prioridad alta de ejecucion
   * (se ejecutaran primero siempre) */
  public get dfTopPriorityKeysAction() {
    return this.getDefault().topPriorityKeysAction;
  }
  /**
   * @returns las claves identificadoras obligatorias de ejecucion
   * (se ejecutaran primero siempre) */
  public get dfTopMandatoryKeysAction() {
    return this.getDefault().topMandatoryKeysAction;
  }
  /**Obtiene un extracto de metadatos con la
   * configuracion exclusiva para este modulo
   *
   * @param keyPath: (solo para contexto "structure") la ruta de la
   * clave identificadora del recurso
   */
  protected abstract getMetadataWithContextModule(
    keyPath?: string //solo para los structurados, los primitivos lo deben asumir como undefined
  ): unknown;
  /**Obtiene la configuracion registrada en los
   * metadatos exclusiva para este modulo
   *
   * @param keyPath: (solo para contexto "structure") la ruta de la
   * clave identificadora del recurso
   */
  protected abstract getMetadataOnlyModuleConfig(
    keyPath?: string //solo para los structurados, los primitivos lo deben asumir como undefined
  ): unknown;
  /**Obtener el diccionario de acciones
   * de configuracion directamente desde
   * los metadatos
   *
   * @param keyPath: (solo para contexto "structure") la ruta de la
   * clave identificadora del recurso
   */
  protected abstract getDiccMetadataActionConfig(
    keyPath?: string //solo para los structurados, los primitivos lo deben asumir como undefined
  ): TIDiccAC;
  /**Obtener el diccionario de configuración de acciones base
   *
   * ❕Diccionario *base* es el resultado de fusionar el diccionario predefinido
   * del modulo con el diccionario configurado inicialmente
   * en los metadatos❕
   *
   * @param acOption - opciones para solicitar el diccionario
   *
   * @returns el diccionario de configuracion de acciones
   */
  protected getDiccBaseActionConfig(
    acOption?: Pick<IBuildACOption, "keyPath" | "sourceDiccBase">
  ): TIDiccAC {
    const util = this.util as Util_Module;
    let diccBaseAC: TIDiccAC = undefined;
    if (util.isInstance(this.metadataHandler)) {
      if (acOption.sourceDiccBase === "default") {
        diccBaseAC = this.dfDiccActionConfig;
      } else if (acOption.sourceDiccBase === "metadata") {
        diccBaseAC = this.getDiccMetadataActionConfig(acOption.keyPath);
      } else {
        throw new LogicError({
          code: ELogicCodeError.MODULE_ERROR,
          msn: `${acOption.sourceDiccBase} is not source dicc selector valid`,
        });
      }
    } else {
      diccBaseAC = this.dfDiccActionConfig;
    }
    return { ...diccBaseAC }; //clonacion sencilla necesaria
  }
  /**Obtener una configuracion de accion base
   *
   * ❕Diccionario *base* es el resultado de fusionar el diccionario predefinido
   * del modulo con el diccionario configurado inicialmente
   * en los metadatos❕
   *
   * @param keyAction - clave identificadora de la accion solicitada
   * @param acOption - opciones para solicitar el diccionario
   *
   * @returns la configuracion de accion solicitada
   */
  protected getBaseActionConfigByKeyAction<TKey extends keyof TIDiccAC>(
    keyAction: TKey,
    acOption?: Pick<IBuildACOption, "keyPath" | "sourceDiccBase">
  ): TIDiccAC[TKey] {
    const diccBaseAC = this.getDiccBaseActionConfig(acOption);
    let baseAC = diccBaseAC[keyAction] as TIDiccAC[TKey];
    return baseAC;
  }
  /**Obtener un array con tuplas de tipo Entry de configuracion de acciones
   *
   * ❕Diccionario *base* es el resultado de fusionar el
   * diccionario predefinido del modulo con el diccionario
   * configurado inicialmente en los metadatos❕
   *
   * @param acOption - opciones para solicitar el diccionario que
   * se transformará en array de tuplas de tipo Entry.
   *
   * @returns el array de tuplas
   *
   */
  protected getATupleBaseActionConfig(
    acOption?: Pick<IBuildACOption, "keyPath" | "sourceDiccBase">
  ): Array<[keyof TIDiccAC, TIDiccAC[keyof TIDiccAC]]> {
    const util = this.util as Util_Module;
    const diccBaseAC = this.getDiccBaseActionConfig(acOption);
    const aTupleBaseAC = util.convertObjectToArrayOfTuples(diccBaseAC);
    return [...aTupleBaseAC]; //clonacion sencilla necesaria
  }
  /**Obtener una tupla de tipo Entry de configuracion de acciones
   * solicitada de acuerdo a su identificador.
   *
   * @param keyAction la clave identificadora de la accion
   * @param acOption - opciones para solicitar el diccionario que
   * se transformará en array de tuplas de tipo Entry.
   *
   * @returns la tupla
   *
   */
  protected getTBaseActionConfigByKeyAction<TKey extends keyof TIDiccAC>(
    keyAction: TKey,
    acOption?: Pick<IBuildACOption, "keyPath" | "sourceDiccBase">
  ): [keyof TIDiccAC, TIDiccAC[keyof TIDiccAC]] {
    const util = this.util as Util_Module;
    const aTupleBaseAC = this.getATupleBaseActionConfig(acOption);
    const tBaseAC = aTupleBaseAC.find((tBAC) => tBAC[0] === keyAction);
    return tBaseAC;
  }
  /**clave identificadora del contexto del modulo */
  public abstract get keyModuleContext(): unknown;
  /**un array con todas las claves identificadoras
   * de todas las acciones*/
  protected get allKeysActionConfig(): Array<keyof TIDiccAC> {
    const keys = Object.keys(this.dfDiccActionConfig) as Array<keyof TIDiccAC>;
    return keys;
  }
  /**array de acciones con prioridad de ejecucion */
  protected get topKeyActionConfigCriteria(): Array<keyof TIDiccAC> {
    let r = this.getDefault().topPriorityKeysAction;
    return r;
  }
  /**obtiene el diccionario con todas los metodos
   * (acciones) a ejecutar en este modulo
   * @returns el diccionario
   */
  public getDiccActionFn() {
    return { ...this._diccActionFn };
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
  ): TFnBagForActionModule<any>;
  /**obtiene un array de funciones de accion de acuerdo a sus claves identificadoras
   * preparadas para ser inyectadas en el middleware
   *
   * @param keysAction el array de las claves identificadoras de las funciones de accion solicitadas
   *
   * @returns el array de funciones de accion
   */
  public getActionFnByKey<TKeys = keyof TIDiccAC>(
    keysAction: TKeys[]
  ): Array<TFnBagForActionModule<any>>;
  /**... */
  public getActionFnByKey(keyOrKeys: unknown): unknown {
    const util = this.util as Util_Module;
    let fFnOrAFFn:
      | TFnBagForActionModule<any>
      | Array<TFnBagForActionModule<any>>;
    const diccACFn = this.getDiccActionFn();
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
  /**obtiene una tupla de tipo Entry (`[keyAction, actionFn]`)
   * de funcion de accion de acuerdo a su clave identificadora
   * preparada para ser inyectada en el middleware
   *
   * @param key la clave identificadora de la funcion de accion solicitada
   *
   * @returns la tupla de funcion de accion
   */
  public getTupleActionFnByKey<TKeys = keyof TIDiccAC>(
    key: TKeys
  ): [TKeys, TFnBagForActionModule<any>];
  /**obtiene un array de tuplas de tipo Entry (`[keyAction, actionFn]`)
   * de funcion de accion de acuerdo a sus claves identificadoras
   * preparadas para ser inyectada en el middleware
   *
   * @param keys el array de las claves identificadoras de las
   * funciones de accion solicitadas
   *
   * @returns el array de tuplas de funciones de accion
   */
  public getTupleActionFnByKey<TKeys = keyof TIDiccAC>(
    keys: TKeys[]
  ): Array<[TKeys, TFnBagForActionModule<any>]>;
  public getTupleActionFnByKey(keyOrKeys: unknown): unknown {
    const util = this.util as Util_Module;
    let tFnOrATFFn:
      | [keyof TIDiccAC, TFnBagForActionModule<any>]
      | Array<[keyof TIDiccAC, TFnBagForActionModule<any>]>;
    if (!Array.isArray(keyOrKeys)) {
      tFnOrATFFn = [
        keyOrKeys as keyof TIDiccAC,
        this._diccActionFn[keyOrKeys as keyof TIDiccAC],
      ];
    } else {
      let tFnOrATFFn = [];
      for (const key of keyOrKeys as Array<keyof TIDiccAC>) {
        const fFn = this._diccActionFn[key];
        if (typeof fFn === "function") {
          tFnOrATFFn.push([key, fFn]);
        }
      }
    }
    return tFnOrATFFn;
  }
  /**Construye objeto de opciones o configuraciones para
   * solicitar un diccionario base de configuracion de acciones
   *
   * @param builderACOption - personalizacion previa del objeto
   *
   * @returns el objeto de opciones ya contruido
   */
  private buildBACOption(
    builderACOption: Partial<IBuildACOption> | undefined
  ): IBuildACOption {
    const util = this.util as Util_Module;
    let rbACOption: IBuildACOption;
    const bACO = builderACOption;
    const df: IBuildACOption = this._dfBuilderACOption;
    if (!util.isObject(builderACOption)) {
      rbACOption = df;
    } else {
      rbACOption = {
        mergeMode:
          bACO.mergeMode === "hard" || bACO.mergeMode === "soft"
            ? bACO.mergeMode
            : df.mergeMode,
        keyPath: util.isString(bACO.keyPath) ? bACO.keyPath : df.keyPath,
        sourceDiccBase: util.isString(bACO.sourceDiccBase)
          ? bACO.sourceDiccBase
          : df.sourceDiccBase,
      };
    }
    return rbACOption;
  }
  /** Construye una configuracion de accion sencilla a partir de una
   * nueva configuracion de accion y referenciada a su clave identificadora
   *
   * @param buildToMode - el modo de creacion (si es o no envuelta y
   * si es envuelta en que envoltura (dicc o tupla))
   * @param keyAction -  la clave identificadora de la configuracion de accion
   * @param actionConfig - la nueva configuracion a fusionar con la base
   * @param builderACOption -  las opciones de cosntruccion y fusion
   *
   * @returns la configuracion de accion deacuerdo al modo seleccionado
   *
   * **Ejemplo accion `typeOf`:**
   *
   * accion no envuelta:
   * - `{isArray: false, fieldType: "string"}`
   *
   * accion envuelta (Dicc):
   * - `{typeOf: {isArray: false, fieldType: "string"}}`
   *
   * accion envuelta (tuple):
   * - `["typeOf", {isArray: false, fieldType: "string"}]`
   *
   */
  public buildSingleActionConfig<TKey extends keyof TIDiccAC>(
    buildToMode: "toActionConfig",
    keyAction: TKey,
    actionConfig: TIDiccAC[TKey],
    builderACOption: IBuildACOption
  ): TIDiccAC[TKey];
  public buildSingleActionConfig<TKey extends keyof TIDiccAC>(
    buildToMode: "toActionConfig_DiccWrapped",
    keyAction: TKey,
    actionConfig: TIDiccAC[TKey],
    builderACOption: IBuildACOption
  ): Partial<TIDiccAC>;
  public buildSingleActionConfig<TKey extends keyof TIDiccAC>(
    buildToMode: "toTupleActionConfig",
    keyAction: TKey,
    actionConfig: TIDiccAC[TKey],
    builderACOption: IBuildACOption
  ): [TKey, TIDiccAC[TKey]];
  public buildSingleActionConfig<TKey extends keyof TIDiccAC>(
    buildToMode:
      | "toActionConfig"
      | "toActionConfig_DiccWrapped"
      | "toTupleActionConfig",
    keyAction: TKey,
    actionConfig: TIDiccAC[TKey],
    builderACOption: IBuildACOption
  ): unknown {
    const util = this.util as Util_Module;
    if (!util.isString(keyAction, true)) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${keyAction as string} is not keyAction valid`,
      });
    }
    builderACOption = this.buildBACOption(builderACOption);
    const baseActionConfig = this.getBaseActionConfigByKeyAction(
      keyAction,
      builderACOption
    );
    const tAC = [baseActionConfig, actionConfig] as [any, any];
    let rACBuild = util.mergeActionConfig(tAC, {
      mode: builderACOption.mergeMode,
    });
    //convertir segun modo:
    if (buildToMode === "toActionConfig") {
      rACBuild = rACBuild; //no hace conversion
    } else if (buildToMode === "toActionConfig_DiccWrapped") {
      let bfBUild = {};
      bfBUild[keyAction as any] = rACBuild;
      rACBuild = bfBUild;
    } else if (buildToMode === "toTupleActionConfig") {
      rACBuild = [keyAction, rACBuild];
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${buildToMode} is not build-convert mode valid`,
      });
    }
    return rACBuild;
  }
  /**construye una configuracion de accion sencilla
   *  (sin fusionar) y la retorna en el formato de
   * contenedor deseado*/
  public static buildSingleActionConfig<TIDiccAC, TKey extends keyof TIDiccAC>(
    buildToMode:
      | "toActionConfig"
      | "toActionConfig_DiccWrapped"
      | "toTupleActionConfig",
    keyAction: TKey,
    actionConfig: TIDiccAC[TKey]
  ): unknown {
    let rACBuild;
    //convertir segun modo:
    if (buildToMode === "toActionConfig") {
      rACBuild = actionConfig; //no hace conversion
    } else if (buildToMode === "toActionConfig_DiccWrapped") {
      let bfBUild = {};
      bfBUild[keyAction as any] = actionConfig;
      rACBuild = bfBUild;
    } else if (buildToMode === "toTupleActionConfig") {
      rACBuild = [keyAction, actionConfig];
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${buildToMode} is not build-convert mode valid`,
      });
    }
    return rACBuild;
  }
  /**convierte una accion de configuracion (envuelta en diccionario
   * parcial o en tupla) a una configuracion de accion sin envolver
   *
   * @param convertToMode modo de conversion
   * @param actionConfigContainer el contenedor que contiene la
   * configuracion de accion (puede ser envuelta en diccionario
   * o sin envolver)
   * @param keyAction la clave identificadora de la accion
   * (necesaria para esta conversion)
   *
   * @returns la configuracion de accion ya convertida
   */
  public convertSingleActionConfig<TKey extends keyof TIDiccAC>(
    convertToMode: "toActionConfig",
    keyAction: TKey,
    actionConfigContainer: Partial<TIDiccAC> | [TKey, TIDiccAC[TKey]]
  ): TIDiccAC[TKey];
  /**convierte una accion de configuracion a un diccionario
   * parcial de configuracion de accion con solo esa accion
   *
   * @param convertToMode modo de conversion
   * @param actionConfigContainer contiene la
   * configuracion de accion (puede ser envuelta en tupla
   * o sin envolver)
   * @param keyAction la clave identificadora de la accion
   * (necesaria para esta conversion)
   *
   * @returns la configuracion de accion ya convertida
   */
  public convertSingleActionConfig<TKey extends keyof TIDiccAC>(
    convertToMode: "toActionConfig_DiccWrapped",
    keyAction: TKey,
    actionConfigContainer: TIDiccAC[TKey] | [TKey, TIDiccAC[TKey]]
  ): Partial<TIDiccAC>;
  /**convierte una accion de configuracion (puede esta envuelta
   * en diccionario) a una tupla de configuracion de accion
   *
   * @param convertToMode modo de conversion
   * @param actionConfigContainer contiene la
   * configuracion de accion (puede ser envuelta en diccionario
   * o sin envolver)
   * @param keyAction la clave identificadora de la accion
   * (necesaria para esta conversion)
   *
   * @returns la configuracion de accion ya convertida
   */
  public convertSingleActionConfig<TKey extends keyof TIDiccAC>(
    convertToMode: "toTupleActionConfig",
    keyAction: TKey,
    actionConfigContainer: Partial<TIDiccAC> | TIDiccAC[TKey]
  ): [TKey, TIDiccAC[TKey]];
  public convertSingleActionConfig<TKey extends keyof TIDiccAC>(
    convertToMode:
      | "toActionConfig"
      | "toActionConfig_DiccWrapped"
      | "toTupleActionConfig",
    keyAction: TKey,
    actionConfigContainer: unknown
  ): unknown {
    const util = Util_Module.getInstance();
    let rACConverted = actionConfigContainer as any;
    if (convertToMode === "toActionConfig") {
      if (util.isArrayTuple(rACConverted, [1, 2])) {
        const tuple = rACConverted as [any, any];
        rACConverted = tuple[1]; //extraer la configuracion unicamente, sin envoltura
      } else if (util.isLiteralObject(rACConverted)) {
        rACConverted =
          keyAction in rACConverted ? rACConverted[keyAction] : undefined; //no hay configuracion asociada
      } else {
        throw new LogicError({
          code: ELogicCodeError.MODULE_ERROR,
          msn: `${rACConverted} is not convertible value`,
        });
      }
    } else if (convertToMode === "toActionConfig_DiccWrapped") {
      if (util.isArrayTuple(rACConverted, [1, 2])) {
        const tuple = rACConverted as [any, any];
        let bfPartialDicc = {};
        bfPartialDicc[tuple[0]] = tuple[1]; //extraer la configuracion y la envuelve
        rACConverted = bfPartialDicc;
      } else if (util.isLiteralObject(rACConverted)) {
        rACConverted = rACConverted[keyAction];
      } else {
        throw new LogicError({
          code: ELogicCodeError.MODULE_ERROR,
          msn: `${rACConverted} is not convertible value`,
        });
      }
    } else if (convertToMode === "toTupleActionConfig") {
      if (util.isLiteralObject(rACConverted)) {
        //determinar si se recibió envuelto en diccionario
        if (keyAction in rACConverted) {
          rACConverted = [keyAction, rACConverted[keyAction]];
        } else {
          rACConverted = [keyAction, rACConverted];
        }
      } else {
        throw new LogicError({
          code: ELogicCodeError.MODULE_ERROR,
          msn: `${rACConverted} is not convertible value`,
        });
      }
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${convertToMode} is not convert mode valid`,
      });
    }
    return rACConverted;
  }
  /** Construiye un diccionario todas las configuraciones de accion
   * a partir de un diccionarios nuevo (probablemente incompleto)
   *
   * @param buildToMode el modo de creacion (que tipo de envoltura)
   * @param containerOfActionsConfig contenedor de las configuraciones de accion
   * @param builderACOption opciones de construccion adicionales
   *
   * @returns las configuraciones de acciones ya construidas y envueltas
   */
  public buildContainerActionsConfig<TKey extends keyof TIDiccAC>(
    buildToMode: "toActionConfig_DiccWrapped",
    containerOfActionsConfig: Partial<TIDiccAC>,
    builderACOption: IBuildACOption
  ): Partial<TIDiccAC>;
  /** Construiye un array de tuplas con todas las configuraciones de accion
   * a partir de un array de tuplas nuevo (probablemente incompleto)
   *
   * @param buildToMode el modo de creacion (que tipo de envoltura)
   * @param containerOfActionsConfig contenedor de las configuraciones de accion
   * @param builderACOption opciones de construccion adicionales
   *
   * @returns las configuraciones de acciones ya construidas y envueltas
   */
  public buildContainerActionsConfig<TKey extends keyof TIDiccAC>(
    buildToMode: "toTupleActionConfig",
    containerOfActionsConfig: Array<[TKey, TIDiccAC[TKey]]>,
    builderACOption: IBuildACOption
  ): Array<[TKey, TIDiccAC[TKey]]>;
  public buildContainerActionsConfig<TKey extends keyof TIDiccAC>(
    buildToMode: "toActionConfig_DiccWrapped" | "toTupleActionConfig",
    containerOfActionsConfig: Partial<TIDiccAC> | Array<[TKey, TIDiccAC[TKey]]>,
    builderACOption: IBuildACOption
  ): Partial<TIDiccAC> | Array<[TKey, TIDiccAC[TKey]]> {
    const util = this.util as Util_Module;
    builderACOption = this.buildBACOption(builderACOption);
    let rACBuild = containerOfActionsConfig;
    if (buildToMode === "toActionConfig_DiccWrapped") {
      let diccActionConfig = containerOfActionsConfig as Partial<TIDiccAC>;
      let baseDiccAC = this.getDiccBaseActionConfig(builderACOption);
      //retirar acciones no requeridas y agrega las obligatorias (si no estan incluidas)
      const selectionKeysAction = util.removeArrayDuplicate(
        [
          ...this.dfTopMandatoryKeysAction, //obligatorias
          ...Object.keys(diccActionConfig),
        ],
        { itemConflictMode: "first" }
      );
      //❕se debe recorrer por keys ya que internamente se elimina la propiedad❕
      Object.keys(baseDiccAC).forEach((baseKeyAction) => {
        if (!selectionKeysAction.includes(baseKeyAction)) {
          delete baseDiccAC[baseKeyAction]; //❗Peligrosa pero necesaria❗
        }
      });
      //fusionar
      rACBuild = util.mergeDiccActionConfig([baseDiccAC, diccActionConfig], {
        mode: builderACOption.mergeMode,
      }) as Partial<TIDiccAC>;
    } else if (buildToMode === "toTupleActionConfig") {
      if (
        !util.isArrayTuple(
          containerOfActionsConfig as Array<[any, any]>,
          [1, 2]
        )
      ) {
        throw new LogicError({
          code: ELogicCodeError.MODULE_ERROR,
          msn: `${
            containerOfActionsConfig as any as string
          } is not array of tuple of action config valid`,
        });
      }
      let aTupleActionConfig = containerOfActionsConfig as Array<
        [TKey, TIDiccAC[TKey]]
      >;
      aTupleActionConfig =
        util.removeTupleArrayDuplicateByKey(aTupleActionConfig);
      let aTupleBaseActionConfig =
        this.getATupleBaseActionConfig(builderACOption);
      //retirar acciones no requeridas y agrega las obligatorias (si no estan incluidas)
      const selectionKeysAction = util.removeArrayDuplicate(
        [
          ...this.dfTopMandatoryKeysAction, //obligatorias
          ...aTupleActionConfig.map((tuple) => tuple[0]),
        ],
        { itemConflictMode: "first" }
      );
      //se filtra las acciones que no son seleccionadas
      aTupleBaseActionConfig = aTupleBaseActionConfig.filter((tuple) => {
        const keyAction = tuple[0];
        const r = selectionKeysAction.includes(keyAction);
        return r;
      });
      //fusionar
      rACBuild = util.mergeTupleArrayOfTupleActionConfig(
        [aTupleBaseActionConfig, aTupleActionConfig as Array<[any, any]>],
        { mode: builderACOption.mergeMode }
      ) as Array<[TKey, TIDiccAC[TKey]]>;
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${buildToMode} is not build-convert mode valid`,
      });
    }
    return rACBuild;
  }
  /**convertir entre tipos de colecciones los grupos de configuraciones de accion
   *
   * @param collectionActionConfig - coleccion a convertir
   * @param convertMode - modo de conversion:
   * - `"toDicc"` convierte la coleccion en formato array de tuplas a diccionario
   * - `"toArrayTuple"` convierte la coleccion en formato diccionario a array de tuplas
   *
   * @param la coleccion ya convertida
   */
  public convertCollectionActionConfig(
    convertToMode: "toDicc",
    containerOfActionsConfig: Array<
      [keyof TIDiccAC, TIDiccAC[keyof TIDiccAC]?]
    >, //❗❗❗ POSIBLE problemas de tipado ❗❗❗ pero es necesario que no sea envuelto en diccionario
    allowUndefinedOrNull?: boolean
  ): TIDiccAC;
  public convertCollectionActionConfig(
    convertToMode: "toArrayTuple",
    containerOfActionsConfig: TIDiccAC,
    allowUndefinedOrNull?: boolean,
    keysActionToSort?: Array<keyof TIDiccAC>
  ): Array<[keyof TIDiccAC, TIDiccAC[keyof TIDiccAC]]>;
  public convertCollectionActionConfig(
    convertToMode: "toDicc" | "toArrayTuple",
    containerOfActionsConfig: any,
    allowUndefinedOrNull = true,
    keysActionToSort: Array<keyof TIDiccAC> = []
  ): any {
    const util = this.util as Util_Module;
    let rConverted = containerOfActionsConfig as
      | TIDiccAC
      | Array<[keyof Partial<TIDiccAC>, Partial<TIDiccAC>]>;
    if (convertToMode === "toArrayTuple") {
      if (util.isLiteralObject(rConverted)) {
        rConverted = util.sortDiccActionConfigBySortKeys(rConverted, [
          ...this.dfTopPriorityKeysAction,
          ...keysActionToSort,
        ]) as Array<[keyof Partial<TIDiccAC>, Partial<TIDiccAC>]>;
        //filtrar las acciones con configuracion undefined (si es necesario)
        if (!allowUndefinedOrNull) {
          rConverted = (
            rConverted as Array<[keyof Partial<TIDiccAC>, Partial<TIDiccAC>]>
          ).filter((tuple) => {
            const config = tuple[1];
            return config !== undefined;
          });
        }
      } else {
        //si tampoco es array de tupla lanzar error
        if (!util.isArrayTuple(rConverted as any[], [1, 2])) {
          throw new LogicError({
            code: ELogicCodeError.MODULE_ERROR,
            msn: `${rConverted} is not convertible value`,
          });
        }
      }
    } else if (convertToMode === "toDicc") {
      if (util.isArrayTuple(rConverted as any[], [1, 2])) {
        for (const tDiccAC of rConverted as any[]) {
          const keyAction = tDiccAC[0];
          const actionConfig = tDiccAC[1];
          if (util.isUndefinedOrNull(actionConfig) && !allowUndefinedOrNull)
            continue;
          rConverted[keyAction] = actionConfig;
        }
      } else {
        //si tampoco es diccionario de acciones lanzar error
        if (!util.isLiteralObject(rConverted)) {
          throw new LogicError({
            code: ELogicCodeError.MODULE_ERROR,
            msn: `${rConverted} is not convertible value`,
          });
        }
      }
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${convertToMode} is not convert mode valid`,
      });
    }
    return rConverted;
  }
  /**
   *
   */
  public findActionConfigIntoATuple<TKey extends keyof TIDiccAC>(
    convertToMode: "toActionConfig",
    keyAction: TKey,
    aTupleAC: [keyof TIDiccAC, TIDiccAC[keyof TIDiccAC]]
  ): TIDiccAC[TKey];
  public findActionConfigIntoATuple<TKey extends keyof TIDiccAC>(
    convertToMode: "toActionConfig_DiccWrapped",
    keyAction: TKey,
    aTupleAC: [keyof TIDiccAC, TIDiccAC[keyof TIDiccAC]]
  ): Partial<TIDiccAC>;
  public findActionConfigIntoATuple<TKey extends keyof TIDiccAC>(
    convertToMode: "toTupleActionConfig",
    keyAction: TKey,
    aTupleAC: [keyof TIDiccAC, TIDiccAC[keyof TIDiccAC]]
  ): [TKey, TIDiccAC[TKey]];
  public findActionConfigIntoATuple<TKey extends keyof TIDiccAC>(
    convertToMode:
      | "toActionConfig"
      | "toActionConfig_DiccWrapped"
      | "toTupleActionConfig",
    keyAction: TKey,
    aTupleAC: [keyof TIDiccAC, TIDiccAC[keyof TIDiccAC]]
  ): unknown {
    const tuple = aTupleAC.find((tupleAC) => tupleAC[0] === keyAction);
    const isUndefined = tuple === undefined;
    let r;
    if (convertToMode === "toActionConfig") {
      r = !isUndefined ? tuple[0] : undefined;
    } else if (convertToMode === "toActionConfig_DiccWrapped") {
      let bfTuple = {};
      bfTuple[keyAction as any] = !isUndefined ? tuple[0] : undefined;
      r = bfTuple;
    } else if (convertToMode === "toTupleActionConfig") {
      r = !isUndefined ? [tuple[0], tuple[1]] : [];
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${convertToMode} is not convert mode valid`,
      });
    }
    return r;
  }
  /**recuperar un configuracion de accion (sin envolver) de una tupla
   * @param tupleAC la tupla con la configuracion
   * @returns la configuracion sin envolver
   */
  public retriveActionConfigFromTuple<TKey extends keyof TIDiccAC>(
    tupleAC: [TKey, TIDiccAC[TKey]]
  ): TIDiccAC[TKey] {
    const r = tupleAC[1];
    return r;
  }
  /**
   * @param bag
   * @param keyAction
   * ____
   */
  protected abstract adapBagForContext(
    bag: unknown,
    keyAction: unknown
  ): unknown;
  /**micro hook embebido que se ejecuta antes de ejecutar la accion
   *
   * @param bag
   * @param keyAction
   * @returns el objeto bag (posiblemente mutado)
   */
  public abstract preRunAction(bag: unknown, keyAction: string): unknown;
  /**micro hook embebido que se ejecuta despues de ejecutar la accion
   *
   * @param bag
   * @param res
   * @returns el objeto res (posiblemente mutado), el bag puede tambien mutarse
   */
  public abstract postRunAction(bag: unknown, res: unknown): unknown;
}
