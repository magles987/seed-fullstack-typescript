import { HandlerModule } from "../config/module";
import { TKeyLogicContext } from "../config/shared-modules";
import { ELogicCodeError, LogicError } from "../errors/logic-error";
import { Util_Report } from "./_util-report";
import { ELogicResStatusCode, IResponse, TBaseResponse } from "./shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**refactorizacion de la clase */
export type Trf_ReportHandler = ReportHandler;
//████MANEJADOR RESPUESTAS ████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *abstract*
 *
 */
export abstract class ReportHandler extends HandlerModule {
  /** configuracion de valores predefinidos para el modulo*/
  public static readonly getDefault = () => {
    return {
      response: {
        data: undefined,
        keyModule: undefined,
        keyModuleContext: undefined,
        keyLogicContext: undefined,
        keyLogic: undefined,
        keySrc: undefined,
        keyAction: undefined,
        keyActionRequest: undefined,
        keyTypeRequest: undefined,
        responses: [],
        extResponse: undefined,
        status: ELogicResStatusCode.SUCCESS,
        msn: "",
        tolerance: ELogicResStatusCode.ERROR,
        tRecordMutate: undefined,
      } as IResponse,
    };
  };
  /**clave identificadora del contexto del modulo */
  public abstract get keyModuleContext(): unknown;

  /**configuracion predefinida para el modulo
   * que utilizará este manejador de reporte */
  private _dfReportConfigForModule: IResponse;
  /**configuracion predefinida para el modulo
   * que utilizará este manejador de reporte */
  protected get dfReportConfigForModule(): IResponse {
    return this._dfReportConfigForModule;
  }
  /**configuracion predefinida para el modulo
   * que utilizará este manejador de reporte */
  protected set dfReportConfigForModule(newDfReport: IResponse) {
    const util = Util_Report.getInstance();
    if (
      !util.isObject(newDfReport, true) ||
      util.isObject(this._dfReportConfigForModule, false) //si ya es un objeto no se puede reasignar
    ) {
      return;
    }
    this._dfReportConfigForModule = newDfReport;
  }
  protected override readonly util = Util_Report.getInstance();
  /**
   * @param logicContext contexto logico (estructural o primitivo)
   * @param keySrc indentificadora del recurso asociado a modulo
   * @param baseResponse configuracion base  de acuerdo al
   * contexto del modulo que requiera el manejador de
   * reporte
   */
  constructor(logicContext: TKeyLogicContext, keySrc: string) {
    super("report", logicContext, keySrc);
    this.util = Util_Report.getInstance();
  }
  /**@returns los valores de configuracion predefinidos */
  protected getDefault() {
    return ReportHandler.getDefault();
  }
  /**... */
  protected abstract buildDfReportConfig(
    baseResponse: TBaseResponse
  ): IResponse;
  /**verifica si las propiedades requeridas para
   * construir un objeto respuesta de accion estan
   * definidas
   * ____
   * @param resParam parametros iniciales para construir
   * @param keys claves identificadoras de los parametros
   * (requerido y obligatorios solo para inicialiar)
   * ____
   */
  public checkInitResponseKeyMissing(
    resParam: Partial<IResponse>,
    keys: Array<keyof IResponse>
  ): void {
    const pa = resParam as object;
    const keyMissing = keys.find((keyPR) => pa[keyPR as string] in pa);
    if (keyMissing != undefined) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${
          keyMissing as string
        } property does missing initialize in response for middleware`,
      });
    }
    return;
  }
  /**... */
  protected abstract buildResponse(param?: unknown, dfParam?: unknown): unknown;
  /**... */
  public abstract mutateResponse(res: unknown, param?: unknown): unknown;
  /**... */
  protected abstract reduceResponses(response: unknown): unknown;
}
