import { LogicModule } from "../../config/module";
import {
  ELogicResStatusCode,
  TKeyLogicContext,
} from "../../config/shared-modules";
import { ELogicCodeError, LogicError } from "../../errors/logic-error";
import { Util_Middleware } from "../_util-middleware";
import { ILogicMiddlewarBuilder } from "../shared";
import {
  IMiddlewareBag,
  IMiddlewareFinalReport,
  IMiddlewareReportStatus,
  IResponseForMiddleware,
  TFnModuleMiddleware,
} from "./shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *abstract*
 *
 */
export abstract class MiddlewareModuleBuilder
  extends LogicModule
  implements ILogicMiddlewarBuilder
{
  /** configuracion de valores predefinidos para el modulo*/
  public static readonly getDefault = () => {
    return {
      bag: {
        data: undefined,
        keySrc: undefined,
        responses: [],
      } as IMiddlewareBag,
      middlewareStatus: {
        currentKey: "",
        previousKeys: [],
        nextKeys: [],
      } as IMiddlewareReportStatus,
      /**array de middlewares (procesados y en proceso) */
      middlewares: [] as TFnModuleMiddleware<IMiddlewareBag>[],
      /**el indice inicial de ejecucion de los middleware */
      idxInit: 0,
    };
  };
  /**mapa acumulador de middleware preparados para ejecutar */
  protected middlewareMap: Map<string, TFnModuleMiddleware<any>> = new Map();
  /**estado actual de los middlewares (ejecutados,
   * actualmente ejecutandose y siguientes) */
  private _currentMiddlewareStatus = {} as IMiddlewareReportStatus;
  /**estado actual de los middlewares (ejecutados,
   * actualmente ejecutandose y siguientes) */
  protected get currentMiddlewareStatus() {
    if (!this.util.isObject(this._currentMiddlewareStatus)) {
      this._currentMiddlewareStatus = this.getDefault().middlewareStatus;
    }
    return this._currentMiddlewareStatus;
  }
  private _middlewareTuple: [string[], TFnModuleMiddleware<any>[]];
  /**middlewares y keys convertidasa tupla */
  protected get middlewareTuple(): [string[], TFnModuleMiddleware<any>[]] {
    return this._middlewareTuple;
  }
  private _idxInit: number;
  /**Indice inicial para la ejecución
   * de middlewares */
  protected get idxInit(): number {
    if (!this.util.isNumber(this._idxInit)) {
      this._idxInit = this.getDefault().idxInit;
    }
    return this._idxInit;
  }
  protected override util = Util_Middleware.getInstance();
  /**@param logicContext contexto logico (estructural o primitivo)*/
  constructor(logicContext: TKeyLogicContext) {
    super("middleware", logicContext);
  }
  /**@returns los valores de configuracion predefinidos */
  protected getDefault() {
    return MiddlewareModuleBuilder.getDefault();
  }
  /**caracter separador de la clave identificadora
   * de la funcion de middleware en el Map:
   *
   * Ejemplo:
   * ````
   * const moduleContext = "fieldVal";
   * const cKMS = "-"; //abreviado de chartKeyMiddlewareSeparator
   * //cualquier subtipo de identificacion segun el modulo
   * const keyActionConfig = "isTypeOf";
   *
   * const fullKeyMiddleware =
   *  `${moduleContext}${cKMS}${keyActionConfig}`;
   * ````
   */
  public static get chartKeyMiddlewareSeparator(): string {
    return Util_Middleware.getInstance().chartKeyMiddlewareSeparator;
  }
  /**... */
  protected abstract getMetaHandler(keySrc: string): unknown;
  public abstract use(
    moduleContext: unknown,
    keyMiddleware: unknown,
    keySrc: string
  ): this;
  /**... */
  protected abstract buildBag(param?: unknown, preParam?: unknown): unknown;
  /**... */
  public abstract mutateBag(bag: unknown | undefined, param: unknown): unknown;
  /**... */
  protected setMiddlewareToTuple(keyMdrInit?: string): void {
    let middlewares = Array.from(this.middlewareMap.values());
    let keysMiddlewares = Array.from(this.middlewareMap.keys());
    keyMdrInit = this.util.isString(keyMdrInit) ? keyMdrInit : "";
    let idxInit = keysMiddlewares.findIndex((keyM) => keyMdrInit === keyM);
    if (idxInit >= 0) {
      //punto inicial personalizado
      middlewares = middlewares.slice(idxInit);
      keysMiddlewares = keysMiddlewares.slice(idxInit);
      this._idxInit = idxInit; //❗Modifica el indice inicial❗
    }
    this._middlewareTuple = [keysMiddlewares, middlewares];
    return;
  }
  /**... */
  protected getMiddlewareFnByKey(
    key: string
  ): TFnModuleMiddleware<IMiddlewareBag> {
    const keys = this.middlewareTuple[0];
    const idx = keys.findIndex((k) => k === key);
    if (idx < 0) return undefined;
    const r = this.middlewareTuple[1][idx];
    return r;
  }
  /**... */
  protected updateCurrentKeyByIdx(currentIdx: number): void {
    const currentKey = this.middlewareTuple[0][currentIdx];
    this.updateCurrentKey(currentKey);
    return;
  }
  /**... */
  protected updateCurrentKey(currentKey: string): void {
    if (!this.util.isString(currentKey)) return;
    const keysMiddlewares = this.middlewareTuple[0];
    const len = keysMiddlewares.length;
    const currentIdx = keysMiddlewares.findIndex((k) => k === currentKey);
    if (currentIdx === -1) return;
    let dicc = this.currentMiddlewareStatus;
    dicc.currentKey = currentKey;
    //actualizar previos
    dicc.previousKeys =
      currentIdx > 0
        ? keysMiddlewares.slice(0, currentIdx) //el actual NO SE CUENTA
        : [];
    //actualizar faltantes (siguientes)
    dicc.nextKeys =
      currentIdx + 1 < len ? keysMiddlewares.slice(currentIdx + 1, len) : [];
    return;
  }
  /**@returns un estado final de la ejecucion de los middleware */
  protected getMiddlewareFinalStatus(): IMiddlewareFinalReport["middlewareFinalStatus"] {
    const dicc = this.currentMiddlewareStatus;
    let finalReport: IMiddlewareFinalReport["middlewareFinalStatus"] = {
      keysMiddlewareRunned: [...dicc.previousKeys, dicc.currentKey],
      keysMiddlewareMissing: [...dicc.nextKeys],
    };
    finalReport = this.util.clone(finalReport, "structuredClone"); //obligatorio clonar
    return finalReport;
  }
  /**
   * ____
   * @param bag el objeto contenedor de
   * toda la configuracion necesaria para
   * la ejecucion interna del middleware
   * @param keyMdrInit (opcional) una clave
   * identificadora del middlware desde
   * donde se desea inicial la ejecucion,
   * si se omite todos los middlewares
   * se ejecutaran
   * ____
   * @returns lun array con las respuestas
   * de ejecucion de todos los middlewares
   * (que pudieron ejecutarse)
   */
  public abstract run(bag?: unknown, keyMdrInit?: unknown): Promise<unknown>;
  /**elimina todos los registros middleware
   * dependiendo del tipo de limpieza elimina
   * ciertos registros adicionales, pero lo comun
   * es limpieza en la tupla que contiene los
   * middlewares y en el estado actual
   * del middleware
   * ____
   * @param clearType define el tipo de limpieza:
   *
   * `"soft"`: no hace nada mas
   *
   * `"hard"` elminina el mapa que contienen
   * todos los middleware ⚠Usar con precaucion⚠
   */
  public clearMiddlewareStack(clearType: "soft" | "hard"): void {
    if (clearType === "hard") {
      this.middlewareMap.clear();
    } else if (clearType === "soft") {
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${clearType} does not clear type valid`,
      });
    }
    this._middlewareTuple = [[], []];
    this._currentMiddlewareStatus = {} as any;
    return;
  }
}
