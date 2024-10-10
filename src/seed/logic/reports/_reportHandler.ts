import { HandlerModule } from "../config/module";
import {
  TKeyLogicContext,
  TKeyModuleWithReport,
  TKeyRequestModifyType,
  TKeyRequestType,
} from "../config/shared-modules";
import { ELogicCodeError, LogicError } from "../errors/logic-error";
import { Util_Report } from "./_util-report";
import { ELogicResStatusCode, IResponse, TResponseForMutate } from "./shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**refactorizacion de la clase */
export type Trf_ReportHandler = ReportHandler;
//████MANEJADOR RESPUESTAS ████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *selfconstructor*
 *
 * ...
 */
export abstract class ReportHandler
  extends HandlerModule
  implements ReturnType<ReportHandler["getDefault"]> {
  /**@returns todos los campos con sus valores predefinidos para instancias de esta clase*/
  public static readonly getDefault = () => {
    return {
      data: undefined,
      keyRepModule: undefined,
      keyRepLogicContext: undefined,
      keyRepModuleContext: undefined,
      keyLogic: undefined,
      keyRepSrc: undefined,
      keyTypeRequest: undefined,
      keyModifyTypeRequest: undefined,
      keyAction: undefined,
      keyActionRequest: undefined,
      responses: [],
      extResponse: undefined,
      status: ELogicResStatusCode.SUCCESS,
      msn: "",
      tolerance: ELogicResStatusCode.ERROR,
    } as IResponse;
  };
  /**@returns todas las constantes a usar en instancias de esta clase*/
  protected static readonly getCONSTANTS = () => {
    return {
      /**si el literal debe ser clonado */
      IS_LITERAL_CLONE: false,
    };
  };
  private _data: any;
  public get data(): any {
    return this._data;
  }
  protected set data(v: any) {
    this._data = v; //❗ todo permitido ❗
  }
  private _keyRepModule: TKeyModuleWithReport;
  public get keyRepModule(): TKeyModuleWithReport {
    return this._keyRepModule;
  }
  public set keyRepModule(v: TKeyModuleWithReport) {
    this._keyRepModule =
      v === "controller" ||
        v === "mutater" ||
        v === "validator" ||
        v === "hook" ||
        v === "provider" ||
        v === "service"
        ? v
        : this._keyRepModule !== undefined
          ? this._keyRepModule
          : this.getDefault().keyRepModule;
  }
  private _keyRepLogicContext: TKeyLogicContext;
  public get keyRepLogicContext(): TKeyLogicContext {
    return this._keyRepLogicContext;
  }
  public set keyRepLogicContext(v: TKeyLogicContext) {
    this._keyRepLogicContext =
      v === "primitive" || v === "structure"
        ? v
        : this._keyRepLogicContext !== undefined
          ? this._keyRepLogicContext
          : this.getDefault().keyRepLogicContext;
  }
  private _keyRepModuleContext: unknown;
  public get keyRepModuleContext(): unknown {
    return this._keyRepModuleContext;
  }
  protected set keyRepModuleContext(v: unknown) {
    this._keyRepModuleContext = this.util.isString(v)
      ? v
      : this._keyRepModuleContext !== undefined
        ? this._keyRepModuleContext
        : this.getDefault().keyRepModuleContext;
  }
  private _keyLogic?: string;
  public get keyLogic(): string {
    return this._keyLogic;
  }
  protected set keyLogic(v: string) {
    this._keyLogic = this.util.isString(v)
      ? v
      : this._keyLogic !== undefined
        ? this._keyLogic
        : this.getDefault().keyLogic;
  }
  private _keyRepSrc: string;
  public get keyRepSrc(): string {
    return this._keyRepSrc;
  }
  protected set keyRepSrc(v: string) {
    this._keyRepSrc = this.keySrc; // 🚫 la asignacion externa, ❗pero es necesario permitir el llamado a este set❗
  }
  private _keyTypeRequest: TKeyRequestType;
  public get keyTypeRequest(): TKeyRequestType {
    return this._keyTypeRequest;
  }
  protected set keyTypeRequest(v: TKeyRequestType) {
    this._keyTypeRequest =
      v === "read" || v === "modify"
        ? v
        : this._keyTypeRequest !== undefined
          ? this._keyTypeRequest
          : this.getDefault().keyTypeRequest;
  }
  private _keyModifyTypeRequest?: TKeyRequestModifyType;
  public get keyModifyTypeRequest(): TKeyRequestModifyType {
    return this._keyModifyTypeRequest;
  }
  protected set keyModifyTypeRequest(v: TKeyRequestModifyType) {
    this._keyModifyTypeRequest =
      v === "create" || v === "update" || v === "delete"
        ? v
        : this._keyModifyTypeRequest !== undefined
          ? this._keyModifyTypeRequest
          : this.getDefault().keyModifyTypeRequest;
  }
  private _keyAction: string;
  public get keyAction(): string {
    return this._keyAction;
  }
  protected set keyAction(v: string) {
    this._keyAction = this.util.isString(v)
      ? v
      : this._keyAction !== undefined
        ? this._keyAction
        : this.getDefault().keyAction;
  }
  private _keyActionRequest: string;
  public get keyActionRequest(): string {
    return this._keyActionRequest;
  }
  protected set keyActionRequest(v: string) {
    this._keyActionRequest = this.util.isString(v)
      ? v
      : this._keyActionRequest !== undefined
        ? this._keyActionRequest
        : this.getDefault().keyActionRequest;
  }
  private _tolerance: ELogicResStatusCode;
  public get tolerance(): ELogicResStatusCode {
    return this._tolerance;
  }
  protected set tolerance(v: ELogicResStatusCode) {
    this._tolerance = this.util.isNumber(v)
      ? v
      : this._tolerance !== undefined
        ? this._tolerance
        : this.getDefault().tolerance;
  }
  private _status: ELogicResStatusCode;
  public get status(): ELogicResStatusCode {
    return this._status;
  }
  protected set status(v: ELogicResStatusCode) {
    this._status = this.util.isNumber(v)
      ? v
      : this._status !== undefined
        ? this._status
        : this.getDefault().status;
  }
  private _responses: IResponse[];
  public get responses(): IResponse[] {
    return this._responses;
  }
  protected set responses(v: IResponse[]) {
    this._responses = this.util.isArray(v)
      ? v
      : this._responses !== undefined
        ? this._responses
        : this.getDefault().responses;
  }
  private _extResponse?: object;
  public get extResponse(): object {
    return this._extResponse;
  }
  protected set extResponse(v: object) {
    this._extResponse =
      v !== undefined
        ? v
        : this._extResponse !== undefined
          ? this._extResponse
          : this.getDefault().extResponse;
  }
  private _fisrtCtrlData?: any;
  public get fisrtCtrlData(): any {
    return this._fisrtCtrlData;
  }
  protected set fisrtCtrlData(v: any) {
    this._fisrtCtrlData = v; //❗Permite todo❗
  }
  private _msn: string;
  public get msn(): string {
    return this._msn;
  }
  protected set msn(v: string) {
    this._msn = this.util.isString(v)
      ? v
      : this._msn !== undefined
        ? this._msn
        : this.getDefault().msn;
  }
  protected override readonly util = Util_Report.getInstance();
  /**
   * @param keyLogicContext contexto logico (estructural o primitivo)
   * @param keySrc indentificadora del recurso asociado a modulo
   * @param base objeto literal con valores personalizados para iniicalizar las propiedades
   * @param isInit `= true` ❕Solo para herencia❕, indica si esta clase debe iniciar las propiedaes
   */
  constructor(
    keyLogicContext: TKeyLogicContext,
    keySrc: string,
    base: Partial<ReturnType<ReportHandler["getDefault"]>> = {},
    isInit = true
  ) {
    super("report", keyLogicContext, keySrc);
    this.util = Util_Report.getInstance();
    if (isInit) this.initProps(base);
  }
  /**@returns todos los campos con sus valores predefinidos*/
  protected getDefault() {
    return ReportHandler.getDefault();
  }
  /**@returns todas las constantes de la clase para las instancias*/
  protected getCONST() {
    return ReportHandler.getCONSTANTS();
  }
  /**inicializa las propiedades de manera dinamica
   *
   * @param base objeto literal con valores personalizados para iniicalizar las propiedades
   */
  protected initProps(
    base: Partial<ReturnType<ReportHandler["getDefault"]>>
  ): void {
    base = typeof base === "object" && base !== null ? base : {};
    for (const key in this.getDefault()) {
      this[key] = base[key];
    }
    return;
  }
  /**⚠ Reinicia todas las propiedades al valor predefinido ⚠ */
  protected resetProps(): void {
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
    key: keyof ReturnType<ReportHandler["getDefault"]>
  ): void {
    const df = this.getDefault();
    this[key as any] = df[key];
    return;
  }
  /**@returns un objeto literal con las propiedades base */
  // protected getLiteral(): ReturnType<ReportHandler["getDefault"]> {
  //   let literal = {};
  //   for (const key in this.getDefault()) {
  //     literal[key] = this[key];
  //   }
  //   const isClone = this.getCONST().IS_LITERAL_CLONE;
  //   if (isClone) {
  //     literal = this.util.clone(literal, "stringify");
  //   }
  //   return literal as any;
  // }
  public startResponse(param?: Partial<IResponse>): IResponse {
    const df = this.getDefault();
    param = this.util.isObject(param) ? param : {};
    let res = {} as IResponse;
    for (const key in df) {
      this[key] = df[key]; //reinicia
      this[key] = param[key]; //actualiza
      res[key] = this[key]; //a literal
    }
    return res;
  }
  /**... */
  public mutateResponse(
    res: IResponse | undefined,
    param?: TResponseForMutate
  ): unknown {
    const isResObject = this.util.isObject(res);
    const isParamObject = this.util.isObject(param);
    const df = this.getDefault();
    const keysDf = Object.keys(df);
    let eachFn: (key: string) => void;
    if (!isResObject && !isParamObject) {
      res = {} as any;
      eachFn = (key: string) => {
        res[key] = this[key];
      };
    } else if (isResObject && !isParamObject) {
      eachFn = (key: string) => {
        this[key] = res[key]; //actualizacion al manejador
        res[key] = this[key]; //se completa res (por si no está completo)
      };
    } else if (!isResObject && isParamObject) {
      res = {} as any;
      eachFn = (key: string) => {
        this[key] = param[key]; //actualizacion al manejador
        res[key] = this[key]; //se completa res (por si no está completo)        
      };
    } else if (isResObject && isParamObject) {
      eachFn = (key: string) => {
        this[key] = key in param ? param[key] : res[key]; //actualizacion al manejador
        res[key] = this[key]; //se completa res (por si no está completo)        
      }
    } else {
      res = {} as any;
      eachFn = (key: string) => {
        res[key] = this[key];
      }
    }
    eachFn = eachFn.bind(this);
    keysDf.forEach(eachFn);
    res = this.reduceResponses(res);
    return res;
  }
  /**... */
  protected mutateData(newData: any, res: IResponse): void {
    //modulos prohibidos para mutar dato
    if (this.keyRepModule === "validator"
      || this.keyRepModule === "hook"
    ) return;
    if (res.data !== newData) res.data = newData;
    if (this.data !== res.data) {
      this.data = res.data;
    }
    return;
  }
  /**... */
  protected abstract reduceResponses(response: IResponse): IResponse;
}
