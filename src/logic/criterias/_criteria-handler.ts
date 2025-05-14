import { ELogicCodeError, LogicError } from "../errors/logic-error";
import { Trf_LogicMetadataHandler } from "../meta/_metadata-handler";
import { HandlerTwinBeeModule, TwinBeeModule } from "../modules/module";
import {
  TKeyLogicContext,
  TKeyRequestModifyType,
  TKeyRequestType,
} from "../modules/shared-types";
import {
  ICriteria,
  IModifyCriteria,
  IReadCriteria,
  TAConds,
  TExpectedDataType,
} from "./shared-types";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**refactorizacion de la clase */
export type Trf_CriteriaCursor = CriteriaHandler;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *selfconstructor*
 *
 * ...
 */
export abstract class CriteriaHandler<
    TKeyDiccActionRequest extends string = string
  >
  extends HandlerTwinBeeModule
  implements ReturnType<CriteriaHandler["getDefault"]>
{
  /**@returns todos los campos con sus valores predefinidos para instancias de esta clase*/
  public static readonly getDefault = () => {
    const util = TwinBeeModule.util;
    const superDf = HandlerTwinBeeModule.getDefault();
    return {
      ...superDf,
      data: util.dfValue,
      expectedDataType: "any",
      keyActionRequest: undefined,
      limit: 5,
      sort: undefined,
      type: "read",
      targetPage: 0,
      targetPageLogic: 0,
      modifyType: undefined,
      isCreateOrUpdate: false,
      p_Key: undefined,
      s_Key: undefined,
      urlsExtended: [],
      diccGlobalAC: {},
      aTGlobalActionConfig: [],
      diccQueryParam: {},
      aTCustomQueryDriverFunctions: [],
    } as typeof superDf & IModifyCriteria<any> & IReadCriteria<any>;
  };
  /**@returns todas las constantes a usar en instancias de esta clase*/
  protected static readonly getCONSTANTS = () => {
    return {
      /**limite maximo permitido */
      MAX_LIMIT_ALLOW: 100,
      /**limite minimo permitido */
      MIN_LIMIT_ALLOW: 0,
      /**si el literal debe ser clonado */
      IS_LITERAL_CLONE: true,
      /**array con claves identificadoras de propiedades
       * de un objeto criteria literal que no deben ser
       * transmitidas fuera del entorno */
      KEYPROPS_DO_NOT_SEND_AT_EXTERNAL: [
        "diccGlobalAC",
        "aTKeysGlobalActionConfig",
        "aTCustomQueryDriverFunctions",
        "data",
        "firstData",
      ] as Array<keyof (IReadCriteria<any> & IModifyCriteria<any>)>,
    };
  };
  /**instancia de manejador de metadatos de este recurso */
  private _metadataHandler: unknown;
  /**instancia de manejador de metadatos de este recurso */
  public get metadataHandler(): unknown {
    return this._metadataHandler;
  }
  /**instancia de manejador de metadatos de este recurso
   *
   * ⚠ Solo puede modificarse si previamente no se ha
   * asignado una instancia
   */
  protected set metadataHandler(metadataHandler: unknown) {
    if (
      !this.util.isInstance(metadataHandler) ||
      this.util.isInstance(this._metadataHandler)
    )
      return; //❗garantiza solo 1 vez inicializar❗
    this._metadataHandler = metadataHandler;
  }
  /**clave identificadora del contexto del modulo */
  public abstract get keyModuleContext(): unknown;
  private _data: ReturnType<CriteriaHandler["getDefault"]>["data"];
  public get data(): ReturnType<CriteriaHandler["getDefault"]>["data"] {
    return this._data;
  }
  public set data(v: ReturnType<CriteriaHandler["getDefault"]>["data"]) {
    this._data = v;
  }
  /**... */
  private _firstData: any;
  public get firstData(): any {
    return this._firstData;
  }
  protected set firstData(v: any) {
    //❗Simulado, la asignación se hace internamente❗
    if (this.util.isNotUndefinedAndNotNull(this._firstData)) return; //solo se permite una vez
    this._firstData = this.util.clone(this.data, "stringify");
  }
  private _limit: number;
  public get limit(): number {
    return this._limit;
  }
  public set limit(v: number) {
    const { MIN_LIMIT_ALLOW, MAX_LIMIT_ALLOW } = this.getCONST();
    this._limit =
      this.util.isNumber(v) && MIN_LIMIT_ALLOW < v && v <= MAX_LIMIT_ALLOW
        ? v
        : this._limit !== undefined
        ? this._limit
        : this.getDefault().limit;
  }
  private _sort: unknown;
  public get sort(): unknown {
    return this._sort;
  }
  public set sort(v: unknown) {
    this._sort = this.util.isNotUndefinedAndNotNull(v)
      ? v
      : this._sort !== undefined
      ? this._sort
      : this.getDefault().sort;
  }
  public abstract get s_Key(): string;
  public abstract get p_Key(): string;
  private _targetPage?: number;
  public get targetPage(): number {
    return this._targetPage;
  }
  public set targetPage(v: number) {
    this._targetPage = this.util.isNumber(v)
      ? v
      : this._targetPage !== undefined
      ? this._targetPage
      : this.getDefault().targetPage;
  }
  private _targetPageLogic: 0 | 1;
  public get targetPageLogic(): 0 | 1 {
    return this._targetPageLogic;
  }
  public set targetPageLogic(v: 0 | 1) {
    this._targetPageLogic =
      this.util.isNumber(v) && (v === 0 || v === 1)
        ? v
        : this._targetPageLogic !== undefined
        ? this._targetPageLogic
        : this.getDefault().targetPageLogic;
  }
  private _type?: TKeyRequestType;
  public get type(): TKeyRequestType {
    return this._type;
  }
  protected set type(v: TKeyRequestType) {
    this._type =
      this.util.isString(v) && (v === "read" || v === "modify")
        ? v
        : this._type !== undefined
        ? this._type
        : this.getDefault().type;
  }
  private _keyActionRequest: TKeyDiccActionRequest;
  public get keyActionRequest(): TKeyDiccActionRequest {
    return this._keyActionRequest;
  }
  public set keyActionRequest(v: TKeyDiccActionRequest) {
    this._keyActionRequest = this.util.isString(v)
      ? (v as any)
      : this._keyActionRequest !== undefined
      ? this._keyActionRequest
      : this.getDefault().keyActionRequest;
  }
  private _expectedDataType: TExpectedDataType;
  public get expectedDataType(): TExpectedDataType {
    return this._expectedDataType;
  }
  public set expectedDataType(v: TExpectedDataType) {
    this._expectedDataType =
      this.util.isString(v) &&
      (v === "any" ||
        v === "boolean" ||
        v === "number" ||
        v === "string" ||
        v === "array" ||
        v === "object")
        ? v
        : this._expectedDataType !== undefined
        ? this._expectedDataType
        : this.getDefault().expectedDataType;
  }
  private _modifyType?: TKeyRequestModifyType;
  public get modifyType(): TKeyRequestModifyType {
    return this._modifyType;
  }
  public set modifyType(v: TKeyRequestModifyType) {
    this._modifyType =
      this.util.isString(v) &&
      (v === "create" || v === "update" || v === "delete")
        ? v
        : this._modifyType !== undefined
        ? this._modifyType
        : this.getDefault().modifyType;
  }
  private _isCreateOrUpdate: boolean;
  public get isCreateOrUpdate(): boolean {
    return this._isCreateOrUpdate;
  }
  public set isCreateOrUpdate(v: boolean) {
    this._isCreateOrUpdate = this.util.isBoolean(v)
      ? v
      : this._isCreateOrUpdate !== undefined
      ? this._isCreateOrUpdate
      : this.getDefault().isCreateOrUpdate;
  }
  private _aTGlobalActionConfig: any;
  public get aTGlobalActionConfig(): any {
    return this._aTGlobalActionConfig;
  }
  public set aTGlobalActionConfig(v: any) {
    this._aTGlobalActionConfig = this.util.isArrayTuple(v, 3)
      ? v
      : this._aTGlobalActionConfig !== undefined
      ? this._aTGlobalActionConfig
      : (this.getDefault().aTGlobalActionConfig as Array<
          [string, string, any]
        >);
  }
  /**... */
  private _diccQueryParam: ICriteria<any>["diccQueryParam"];
  public get diccQueryParam(): ICriteria<any>["diccQueryParam"] {
    return this._diccQueryParam;
  }
  public set diccQueryParam(v: ICriteria<any>["diccQueryParam"]) {
    this._diccQueryParam = this.util.isObject(v)
      ? v
      : this._diccQueryParam !== undefined
      ? this._diccQueryParam
      : this.getDefault().diccQueryParam;
  }
  /**... */
  private _aTCustomQueryDriverFunctions: ICriteria<any>["aTCustomQueryDriverFunctions"];
  public get aTCustomQueryDriverFunctions(): ICriteria<any>["aTCustomQueryDriverFunctions"] {
    return this._aTCustomQueryDriverFunctions;
  }
  public set aTCustomQueryDriverFunctions(
    v: ICriteria<any>["aTCustomQueryDriverFunctions"]
  ) {
    this._aTCustomQueryDriverFunctions = this.util.isArrayTuple(v, 2)
      ? v
      : this._aTCustomQueryDriverFunctions !== undefined
      ? this._aTCustomQueryDriverFunctions
      : this.getDefault().aTCustomQueryDriverFunctions;
  }
  /**
   * @param base objeto literal con valores personalizados para iniicalizar las propiedades
   * @param [isInit=true] ❕Solo para herencia❕, indica si esta clase debe iniciar las propiedaes
   */
  constructor(
    keyLogicContext: TKeyLogicContext,
    metadataHandler: unknown,
    base: any,
    isInit = true
  ) {
    super("criteria", keyLogicContext);
    //asignación a propiedades especiales
    this._metadataHandler = metadataHandler;
    this.keySrc = (this.metadataHandler as Trf_LogicMetadataHandler).keySrc;
    this.keyLogicContext = (
      this.metadataHandler as Trf_LogicMetadataHandler
    ).keyLogicContext;
    if (isInit) this.initProps(base);
  }
  /**@returns todos los campos con sus valores predefinidos*/
  protected override getDefault() {
    return CriteriaHandler.getDefault();
  }
  /**@returns todos las constantes para las instancias*/
  protected getCONST() {
    return CriteriaHandler.getCONSTANTS();
  }
  /**inicializa las propiedades de manera dinámica
   *
   * @param base objeto literal con valores personalizados para iniicalizar las propiedades
   */
  protected initProps(base: any): void {
    base = this.mergeBaseCriteriaWithPriority(base);
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
    key: keyof ReturnType<CriteriaHandler["getDefault"]>
  ): void {
    const df = this.getDefault();
    this[key as any] = df[key];
    return;
  }
  /**muta las propiedades masivamente */
  public mutateProps(
    base: Partial<
      Omit<
        ReturnType<CriteriaHandler["getDefault"]>,
        "keyLogicContext" | "keySrc" | "p_Key" | "s_Key"
      >
    >
  ): void {
    base = typeof base === "object" && base !== null ? base : ({} as any);
    for (const key in base) {
      this[key] = base[key];
    }
    return;
  }
  /**@returns un objeto literal con las propiedades base */
  public getLiteral(): unknown {
    let literal = {} as IReadCriteria<any> | IModifyCriteria<any>;
    const df = this.getDefault();
    for (const key in df) {
      literal[key] = this[key];
    }
    const isClone = this.getCONST().IS_LITERAL_CLONE;
    if (isClone) {
      literal = this.util.clone(literal, "lodash");
    }
    return literal;
  }
  /**.. */
  protected abstract mergeBaseCriteriaWithPriority(baseCRC: unknown): unknown;
  /**... */
  public findGlobalActionByKeyModuleAndKeyAction(
    tKeyGlobalAC: [string, string]
  ): unknown {
    if (!this.util.isTuple(tKeyGlobalAC, 2)) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${tKeyGlobalAC} is not global key tuple valid`,
      });
    }
    const [keyModuleContext, keyAction] = tKeyGlobalAC;
    const aTGAC = this
      .aTGlobalActionConfig as ICriteria<any>["aTGlobalActionConfig"];
    const tGlobalActionConfig = aTGAC.find((tGAC) => {
      const [_keyModuleContext, _keyAction] = tGAC;
      const r =
        keyModuleContext === _keyModuleContext && keyAction === _keyAction;
      return r;
    });
    let action = [];
    if (!this.util.isTuple(tGlobalActionConfig, 3)) return action; //vacio
    action = tGlobalActionConfig[2]; //la accion
    return action;
  }
  /**... */
  public filterGlobalActionByKeyModule(keysModuleContext: unknown): unknown {
    keysModuleContext = Array.isArray(keysModuleContext)
      ? keysModuleContext
      : [keysModuleContext];
    const aTGAC = this
      .aTGlobalActionConfig as ICriteria<any>["aTGlobalActionConfig"];
    const f_tAGC = aTGAC.filter((tGAC) => {
      const [_keysModuleContext] = tGAC;
      const r = (keysModuleContext as string[]).includes(_keysModuleContext);
      return r;
    });
    return f_tAGC;
  }
  /**construye un query sencillo a partir de una base
   *
   * @param baseQuery  la base de la cual construir
   *
   * @returns el query ya construido
   */
  // public buildQuery(baseQuery: TAConds): TAConds {
  //   const dfQ = this.getDefault().query;
  //   let query = this.util.isArray(baseQuery) ? baseQuery : dfQ;
  //   this.checkQueryConds(query);
  //   return query;
  // }
  /**verifica si las condiciones son coherentes
   *
   * @param conds las condiciones del query
   */
  protected abstract checkQueryConds(conds: TAConds): void;
  /**"adelgazar" el objeto literal de
   * criterios para poder ser
   * enviado fuera del entorno*/
  public static toSlimLiteralCriteriaForSend(
    literalCriteria: IReadCriteria<any> & IModifyCriteria<any>
  ) {
    const util = TwinBeeModule.util;
    const keysNotSend =
      CriteriaHandler.getCONSTANTS().KEYPROPS_DO_NOT_SEND_AT_EXTERNAL;
    let slimLC = util.clone(literalCriteria, "lodash");
    for (const key in slimLC) {
      const isExist = keysNotSend.includes(key as any);
      if (isExist) delete slimLC[key];
    }
    return slimLC;
  }
}
