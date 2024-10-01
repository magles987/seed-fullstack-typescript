import { HandlerModule } from "../config/module";
import {
  TKeyLogicContext,
  TKeyRequestModifyType,
  TKeyRequestType,
} from "../config/shared-modules";
import { ELogicCodeError, LogicError } from "../errors/logic-error";
import { Util_Criteria } from "./_util-criteria";
import {
  IModifyCriteria,
  IReadCriteria,
  TAConds,
  TExpectedDataType,
} from "./shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**refactorizacion de la clase */
export type Trf_CriteriaCursor = CriteriaHandler;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *selfconstructor*
 *
 * ...
 */
export abstract class CriteriaHandler
  extends HandlerModule
  implements ReturnType<CriteriaHandler["getDefault"]>
{
  /**@returns todos los campos con sus valores predefinidos para instancias de esta clase*/
  public static readonly getDefault = () => {
    return {
      expectedDataType: "single",
      keyActionRequest: undefined,
      //keyLogicContext: undefined,
      //keySrc: undefined,
      limit: 5,
      sort: undefined,
      type: "read",
      targetPage: 0,
      targetPageLogic: 0,
      modifyType: "update",
      isCreateOrUpdate: false,
      query: [],
      p_Key: undefined,
      s_Key: undefined,
      urlsExtended: [],
    } as IReadCriteria & IModifyCriteria;
  };
  /**@returns todas las constantes a usar en instancias de esta clase*/
  protected static readonly getCONSTANTS = () => {
    return {
      /**limite maximo permitido */
      MAX_LIMIT_ALLOW: 100,
      /**limite minimo permitido */
      MIN_LIMIT_ALLOW: 0,
    };
  };
  /**instancia de manejador de metadatos de este recurso */
  private _metadataHandler: unknown;
  /**instancia de manejador de metadatos de este recurso */
  public get metadataHandler(): unknown {
    return this._metadataHandler;
  }
  /**clave identificadora del contexto del modulo */
  public abstract get keyModuleContext(): unknown;
  /**instancia de manejador de metadatos de este recurso
   *
   * ⚠ Solo puede modificarse si previamente no se ha
   * asignado una instancia
   */
  public set metadataHandler(metadataHandler: unknown) {
    const util = Util_Criteria.getInstance();
    if (
      !util.isInstance(metadataHandler) ||
      util.isInstance(this._metadataHandler)
    )
      return; //❗garantiza solo 1 vez inicializar❗
    this._metadataHandler = metadataHandler;
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
  private _targetPageLogic?: 0 | 1;
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
  private _query?: TAConds;
  public get query(): TAConds {
    return this._query;
  }
  public set query(v: TAConds) {
    this._query = this.util.isArray(v)
      ? v
      : this._query !== undefined
      ? this._query
      : this.getDefault().query;
    this.checkQueryConds(this._query);
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
  private _keyActionRequest: string;
  public get keyActionRequest(): string {
    return this._keyActionRequest;
  }
  public set keyActionRequest(v: string) {
    this._keyActionRequest = this.util.isString(v)
      ? v
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
      (v === "single" || v === "array" || v === "object")
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
  protected override util: Util_Criteria = Util_Criteria.getInstance();
  /**
   * @param base objeto literal con valores personalizados para iniicalizar las propiedades
   * @param [isInit=true] ❕Solo para herencia❕, indica si esta clase debe iniciar las propiedaes
   */
  constructor(
    keyLogicContext: TKeyLogicContext,
    keySrc: string,
    base: Partial<ReturnType<CriteriaHandler["getDefault"]>> = {},
    isInit = true
  ) {
    super("criteria", keyLogicContext, keySrc);
    this.util = Util_Criteria.getInstance();
    if (isInit) this.initProps(base);
  }
  /**@returns todos los campos con sus valores predefinidos*/
  protected getDefault() {
    return CriteriaHandler.getDefault();
  }
  /**@returns todos las constantes para las instancias*/
  protected getCONST() {
    return CriteriaHandler.getCONSTANTS();
  }
  /**inicializa las propiedades de manera dinamica
   *
   * @param base objeto literal con valores personalizados para iniicalizar las propiedades
   */
  protected initProps(
    base: Partial<ReturnType<CriteriaHandler["getDefault"]>>
  ): void {
    base = typeof base === "object" && base !== null ? base : {};
    for (const key in this.getDefault()) {
      this[key] = base[key];
    }
    return;
  }
  /**⚠ Reinicia todas las propiedades al valor predefinido ⚠ */
  public resetProps(): void {
    const df = this.getDefault();
    for (const key in df) {
      this[key] = df[key];
    }
    return;
  }
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
  /**construye un query sencillo a partir de una base
   *
   * @param baseQuery  la base de la cual construir
   *
   * @returns el query ya construido
   */
  public buildQuery(baseQuery: TAConds): TAConds {
    const dfQ = this.getDefault().query;
    let query = this.util.isArray(baseQuery) ? baseQuery : dfQ;
    this.checkQueryConds(query);
    return query;
  }
  /**verifica si las condiciones son coherentes
   *
   * @param conds las condiciones del query
   */
  protected abstract checkQueryConds(conds: TAConds): void;
  /**... */
  public getCriteriaByContext(): IReadCriteria | IModifyCriteria {
    let criteria: IReadCriteria | IModifyCriteria;
    if (this.type === "read")
      criteria = this.util.clone({
        keyLogicContext: this.keyLogicContext,
        keySrc: this.keySrc,
        keyActionRequest: this.keyActionRequest,
        type: this.type,
        p_Key: this.p_Key,
        s_Key: this.s_Key,
        expectedDataType: this.expectedDataType,
        limit: this.limit,
        sort: this.sort,
        query: this.query,
        targetPage: this.targetPage,
        targetPageLogic: this.targetPageLogic,
      } as IReadCriteria);
    else if (this.type === "modify")
      criteria = this.util.clone({
        keyLogicContext: this.keyLogicContext,
        keySrc: this.keySrc,
        keyActionRequest: this.keyActionRequest,
        type: this.type,
        p_Key: this.p_Key,
        s_Key: this.s_Key,
        expectedDataType: this.expectedDataType,
        modifyType: this.modifyType,
        isCreateOrUpdate: this.isCreateOrUpdate,
      } as IModifyCriteria);
    else
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${this.type} is not criteria key type criteria valid`,
      });
    return criteria;
  }
}
