import { TKeyModuleWithReport } from "../config/shared-modules";
import { LogicController } from "../controllers/_controller";
import { LogicMutater } from "../mutaters/_mutater";
import { LogicHook } from "../hooks/_hook";
import { LogicProvider } from "../providers/_provider";
import { LogicValidation } from "../validators/_validation";
import { ReportHandler } from "./_reportHandler";
import {
  ELogicResStatusCode,
  IPrimitiveResponse,
  TBasePrimitiveResponse,
  TKeyPrimitiveResponseModuleContext,
  Trf_IPrimitiveResponse,
} from "./shared";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**refactorizacion de la clase */
export type Trf_PrimitiveReportHandler = PrimitiveReportHandler;

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████

/**... */
export class PrimitiveReportHandler extends ReportHandler {
  /** configuracion de valores predefinidos para el modulo*/
  public static readonly getDefault = () => {
    const superDf = ReportHandler.getDefault();
    return {
      ...superDf,
      response: {
        ...superDf.response,
      } as IPrimitiveResponse,
    };
  };
  public override get keyModuleContext(): TKeyPrimitiveResponseModuleContext {
    return "primitiveResponse";
  }
  protected override get dfReportConfigForModule(): IPrimitiveResponse {
    return super.dfReportConfigForModule as any;
  }
  /**... */
  protected override set dfReportConfigForModule(
    newDfReport: IPrimitiveResponse
  ) {
    super.dfReportConfigForModule = newDfReport;
  }
  /**
   * @param keySrc indentificadora del recurso asociado a modulo
   * @param baseResponse configuracion base  de acuerdo al
   * contexto del modulo que requiera el manejador de
   * reporte
   *
   */
  constructor(keySrc: string, baseResponse: TBasePrimitiveResponse) {
    super("primitive", keySrc);
    this.dfReportConfigForModule = this.buildDfReportConfig(baseResponse);
  }
  protected override getDefault() {
    return PrimitiveReportHandler.getDefault();
  }
  protected override buildDfReportConfig(
    dfReportConfigForModule: TBasePrimitiveResponse
  ): IPrimitiveResponse {
    const dfRCM = dfReportConfigForModule;
    const df = this.getDefault().response;
    let rResponse: IPrimitiveResponse;
    if (!this.util.isObject(dfRCM)) {
      this.dfReportConfigForModule = df;
    } else {
      this.dfReportConfigForModule = {
        data: df.data,
        keySrc: this.keySrc,
        keyModule: this.util.isString(dfRCM.keyModule)
          ? dfRCM.keyModule
          : df.keyModule,
        keyModuleContext: this.util.isString(dfRCM.keyModuleContext)
          ? dfRCM.keyModuleContext
          : df.keyModuleContext,
        keyLogicContext: this.keyLogicContext,
        keyTypeRequest: df.keyTypeRequest,
        keyActionRequest: df.keyActionRequest,
        status: this.util.isNumber(dfRCM.status) ? dfRCM.status : df.status,
        tolerance: this.util.isNumber(dfRCM.tolerance)
          ? dfRCM.tolerance
          : df.tolerance,
        keyAction: df.keyAction,
        keyLogic: this.keyLogicContext,
        msn: df.msn,
        responses: df.responses,
        extResponse: df.extResponse,
      };
    }
    return rResponse;
  }
  public override checkInitResponseKeyMissing(
    resParam: Partial<IPrimitiveResponse>,
    keys: Array<keyof IPrimitiveResponse>
  ): void {
    return super.checkInitResponseKeyMissing(resParam, keys as any);
  }
  protected override buildResponse(
    param?: Partial<IPrimitiveResponse>,
    dfParam?: Trf_IPrimitiveResponse
  ): IPrimitiveResponse {
    let res: IPrimitiveResponse;
    const df = this.util.isObject(dfParam)
      ? dfParam
      : this.dfReportConfigForModule;
    const pa = param;
    if (!this.util.isObject(pa)) {
      res = df;
    } else {
      res = {
        data: "data" in pa ? pa.data : df.data, //verifica existencia ya que los valores undefined y null son validos
        keySrc: this.keySrc,
        keyLogic: this.dfReportConfigForModule.keyLogic, //obligatorio el predefinido
        keyModule: this.dfReportConfigForModule.keyModule, //obligatorio el predefinido
        keyLogicContext: this.dfReportConfigForModule.keyLogicContext, //obligatorio el predefinido
        keyModuleContext: this.dfReportConfigForModule.keyModuleContext, //obligatorio el predefinido
        keyTypeRequest:
          pa.keyTypeRequest === "read" || pa.keyTypeRequest === "modify"
            ? pa.keyTypeRequest
            : df.keyTypeRequest,
        keyAction: this.util.isString(pa.keyAction)
          ? pa.keyAction
          : df.keyAction,
        keyActionRequest: this.util.isString(pa.keyActionRequest)
          ? pa.keyActionRequest
          : df.keyActionRequest,
        msn: this.util.isString(pa.msn) ? pa.msn : df.msn,
        extResponse: this.util.isObject(pa.extResponse)
          ? pa.extResponse
          : df.extResponse,
        responses: this.util.isArray(pa.responses)
          ? pa.responses
          : df.responses,
        status: this.util.isNotUndefinedAndNotNull(pa.status)
          ? pa.status
          : df.status,
        tolerance: this.util.isNumber(pa.tolerance)
          ? pa.tolerance
          : df.tolerance,
      };
    }
    return res;
  }
  public override mutateResponse(
    res: IPrimitiveResponse,
    param?: Partial<IPrimitiveResponse>
  ): IPrimitiveResponse {
    //verificacion especial de propiedades
    if (res === undefined && this.util.isObject(param)) {
      this.checkInitResponseKeyMissing(param, ["data"]);
    }
    res = !this.util.isObject(res)
      ? this.buildResponse(param, undefined)
      : this.buildResponse(param, res as IPrimitiveResponse);
    res = this.reduceResponses(res);
    return res;
  }
  protected override reduceResponses(
    response: IPrimitiveResponse
  ): IPrimitiveResponse {
    const keyModule = response.keyModule as TKeyModuleWithReport;
    let aStatus: ELogicResStatusCode[] = [];
    const res = response as Trf_IPrimitiveResponse;
    aStatus = res.responses.map((embRes, idx) => {
      embRes = this.reduceResponses(embRes);
      //⚠ muta la respuesta internamente ⚠
      res.responses[idx] = embRes;
      return embRes.status;
    });
    /**funcion lanzadora de reductoras personalizadas */
    let lanchReducerFn = (
      currentStatus: ELogicResStatusCode,
      nextStatus: ELogicResStatusCode
    ) => {
      let stateStatus: ELogicResStatusCode;
      if (keyModule === "controller")
        stateStatus = LogicController.getControlReduceStatusResponse(
          currentStatus,
          nextStatus
        );
      if (keyModule === "mutater")
        stateStatus = LogicMutater.getControlReduceStatusResponse(
          currentStatus,
          nextStatus
        );
      else if (keyModule === "validator")
        stateStatus = LogicValidation.getControlReduceStatusResponse(
          currentStatus,
          nextStatus
        );
      else if (keyModule === "hook")
        stateStatus = LogicHook.getControlReduceStatusResponse(
          currentStatus,
          nextStatus
        );
      else if (keyModule === "provider")
        stateStatus = LogicProvider.getControlReduceStatusResponse(
          currentStatus,
          nextStatus
        );
      else stateStatus = ELogicResStatusCode.ERROR;
      return stateStatus;
    };
    lanchReducerFn.bind(this);
    (response as Trf_IPrimitiveResponse).status = aStatus.reduce(
      lanchReducerFn,
      res.status
    );
    return response;
  }
}
