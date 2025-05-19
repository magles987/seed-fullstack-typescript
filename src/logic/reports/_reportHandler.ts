import { ELogicCodeError, LogicError } from "../errors/logic-error";
import { HandlerTwinBeeModule } from "../modules/module";
import {
  TKeyActionModule,
  TKeyLogicContext,
  TKeyRequestModifyType,
  TKeyRequestType,
} from "../modules/shared-types";
import {
  TSelectorDataRepository,
  TSelectorDataRepositoryFn,
} from "../providers/repositories/shared-types";
import {
  EKeyActionGroupForRes,
  ELogicResStatusCode,
  IRepositoryResponse,
  IResponse,
  TResponseForMutate,
} from "./shared-types";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**refactorizacion de la clase */
export type Trf_ReportHandler = ReportHandler;
//████MANEJADOR RESPUESTAS ████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *selfconstructor*
 *
 * ...
 */
export abstract class ReportHandler
  extends HandlerTwinBeeModule
  implements ReturnType<ReportHandler["getDefault"]>
{
  /**@returns todos los campos con sus valores predefinidos para instancias de esta clase*/
  public static readonly getDefault = () => {
    const superDf = HandlerTwinBeeModule.getDefault();
    return {
      ...superDf,
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
    } as typeof superDf & IResponse;
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
  private _keyRepModule: TKeyActionModule;
  public get keyRepModule(): TKeyActionModule {
    return this._keyRepModule;
  }
  public set keyRepModule(v: TKeyActionModule) {
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
  public get firstCtrlData(): any {
    return this._fisrtCtrlData;
  }
  protected set firstCtrlData(v: any) {
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
  /**
   * @param keyLogicContext contexto lógico (estructural o primitivo)
   * @param keySrc identificadora del recurso asociado a modulo
   * @param base objeto literal con valores personalizados para inicializar las propiedades
   * @param isInit `= true` ❕Solo para herencia❕, indica si esta clase debe iniciar las propiedaes
   */
  constructor(
    keyLogicContext: TKeyLogicContext,
    keySrc: string,
    base: Partial<ReturnType<ReportHandler["getDefault"]>> = {},
    isInit = true
  ) {
    super("report", keyLogicContext);
    this.keySrc = keySrc; //❗Obligatorio en el constructor❗
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
      };
    } else {
      res = {} as any;
      eachFn = (key: string) => {
        res[key] = this[key];
      };
    }
    eachFn = eachFn.bind(this);
    keysDf.forEach(eachFn);
    res = this.reduceResponses(res);
    return res;
  }
  /**... */
  protected abstract mutateData(
    rootRes: IResponse,
    embRes: IResponse
  ): IResponse;
  /**... */
  protected abstract reduceResponses(response: IResponse): IResponse;
  /**... */
  public adaptRepositoryResponseToResponse(
    repositoryResponses: IRepositoryResponse | IRepositoryResponse[],
    response: IResponse,
    selectorDataRepository: TSelectorDataRepository
  ): IResponse {
    repositoryResponses = Array.isArray(repositoryResponses)
      ? repositoryResponses
      : [repositoryResponses];
    response = {
      ...response,
      data: this.reduceDataRepository(
        repositoryResponses,
        selectorDataRepository
      ),
      responses: repositoryResponses.map((dR) => {
        const { data, msn, status, details, error } = dR;
        return {
          ...response,
          data,
          msn,
          status,
          extResponse: { details, error },
          keyAction: EKeyActionGroupForRes.repository,
        } as IResponse;
      }),
    } as IResponse;
    response = this.reduceResponses(response);
    return response;
  }
  /**... */
  protected reduceDataRepository(
    repositoryResponses: IRepositoryResponse[],
    selectorDataRepository: TSelectorDataRepository
  ): any {
    let data: any = this.util.dfValue;
    if (this.util.isNumber(selectorDataRepository, false)) {
      const idx = selectorDataRepository as number;
      data = repositoryResponses[idx].data;
    } else if (this.util.isString(selectorDataRepository)) {
      if (selectorDataRepository === "first") {
        const idx = 0;
        data = repositoryResponses[idx].data;
      } else if (selectorDataRepository === "last") {
        const idx = repositoryResponses.length - 1;
        data = repositoryResponses[idx].data;
      } else if (selectorDataRepository === "first-success") {
        const idxF = repositoryResponses.findIndex(
          (dR) => dR.status < ELogicResStatusCode.BAD
        );
        data = repositoryResponses[idxF].data;
      } else if (selectorDataRepository === "last-success") {
        const idxF = repositoryResponses.findLastIndex(
          (dR) => dR.status < ELogicResStatusCode.BAD
        );
        data = repositoryResponses[idxF].data;
      } else if (selectorDataRepository === "merge-success") {
        for (const repositoryRes of repositoryResponses) {
          //omite los errores
          if (repositoryRes.status >= ELogicResStatusCode.BAD) continue;
          //verifica si la data del repository es objeto fusionar (admite arrays)
          if (
            typeof repositoryRes.data === "object" &&
            repositoryRes.data !== null
          ) {
            data = this.util.deepMergeObjects([data, repositoryRes.data], {
              mode: "soft",
            });
          } else {
            data = repositoryRes.data;
          }
        }
      } else {
        throw new LogicError({
          code: ELogicCodeError.MODULE_ERROR,
          msn: `${selectorDataRepository} is not selector data repository valid`,
        });
      }
    } else if (this.util.isFunction(selectorDataRepository)) {
      const fn = selectorDataRepository as TSelectorDataRepositoryFn;
      data = fn(repositoryResponses);
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${selectorDataRepository} is not selector data repository valid`,
      });
    }
    return data;
  }
}
