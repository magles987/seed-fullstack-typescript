import { TKeyModuleWithReport } from "../config/shared-modules";
import { LogicController } from "../controllers/_controller";
import { LogicMutater } from "../mutaters/_mutater";
import { LogicHook } from "../hooks/_hook";
import { LogicProvider } from "../providers/_provider";
import { LogicValidation } from "../validators/_validation";
import { ReportHandler } from "./_reportHandler";
import {
  ELogicResStatusCode,
  IStructureResponse,
  TBaseStructureResponse,
  TKeyStructureResponseModuleContext,
  Trf_IStructureResponse,
} from "./shared";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**refactorizacion de la clase */
export type Trf_StructureReportHandler = StructureReportHandler;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**
 *
 */
export class StructureReportHandler extends ReportHandler {
  /** configuracion de valores predefinidos para el modulo*/
  public static readonly getDefault = () => {
    const superDf = ReportHandler.getDefault();
    return {
      ...superDf,
      response: {
        ...superDf.response,
      } as IStructureResponse,
    };
  };
  public override get keyModuleContext(): TKeyStructureResponseModuleContext {
    return "structureResponse";
  }
  protected override get dfReportConfigForModule(): IStructureResponse {
    return super.dfReportConfigForModule as any;
  }
  /**... */
  protected override set dfReportConfigForModule(
    newDfReport: IStructureResponse
  ) {
    super.dfReportConfigForModule = newDfReport;
    return;
  }
  /**
   * @param keySrc indentificadora del recurso asociado a modulo
   * @param baseResponse configuracion base  de acuerdo al
   * contexto del modulo que requiera el manejador de
   * reporte
   *
   */
  constructor(keySrc: string, baseResponse: TBaseStructureResponse) {
    super("structure", keySrc);
    this.dfReportConfigForModule = this.buildDfReportConfig(baseResponse);
  }
  protected override getDefault() {
    return StructureReportHandler.getDefault();
  }
  protected override buildDfReportConfig(
    baseResponse: TBaseStructureResponse
  ): IStructureResponse {
    const bR = baseResponse;
    const df = this.getDefault().response;
    let rResponse: IStructureResponse;
    if (!this.util.isObject(bR)) {
      rResponse = df;
    } else {
      rResponse = {
        data: df.data,
        keyModule: this.util.isString(bR.keyModule)
          ? bR.keyModule
          : df.keyModule,
        keyModuleContext: this.util.isString(bR.keyModuleContext)
          ? bR.keyModuleContext
          : df.keyModuleContext,
        keyLogicContext: this.keyLogicContext,
        keyTypeRequest: df.keyTypeRequest,
        keyActionRequest: df.keyActionRequest,
        keySrc: this.keySrc,
        status: this.util.isNumber(bR.status) ? bR.status : df.status,
        tolerance: this.util.isNumber(bR.tolerance)
          ? bR.tolerance
          : df.tolerance,
        keyAction: df.keyAction,
        keyPath: df.keyPath,
        keyLogic: this.keyLogicContext,
        msn: df.msn,
        responses: df.responses,
        extResponse: df.extResponse,
        tRecordMutate: df.tRecordMutate,
      };
    }
    return rResponse;
  }
  public override checkInitResponseKeyMissing(
    resParam: Partial<IStructureResponse>,
    keys: Array<keyof IStructureResponse>
  ): void {
    return super.checkInitResponseKeyMissing(resParam, keys as any);
  }
  protected override buildResponse(
    param?: Partial<IStructureResponse>,
    dfParam?: Trf_IStructureResponse
  ): IStructureResponse {
    let res: IStructureResponse;
    const df = this.util.isObject(dfParam)
      ? dfParam
      : this.dfReportConfigForModule;
    const pa = param;
    if (!this.util.isObject(pa)) {
      res = df;
    } else {
      const keyPath = this.util.isString(pa.keyPath) ? pa.keyPath : df.keyPath;
      res = {
        data: "data" in pa ? pa.data : df.data, //verifica existencia ya que los valores undefined y null son validos
        fisrtCtrlData: df.fisrtCtrlData ? df.fisrtCtrlData : pa.fisrtCtrlData, //❗seleccion invertida❗
        keyPath,
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
        tRecordMutate: this.util.isTuple(pa.tRecordMutate, 2)
          ? pa.tRecordMutate
          : df.tRecordMutate,
      };
    }
    return res;
  }
  public override mutateResponse(
    res: IStructureResponse,
    param?: Partial<IStructureResponse>
  ): IStructureResponse {
    //verificacion especial de propiedades
    if (res === undefined && this.util.isObject(param)) {
      this.checkInitResponseKeyMissing(param, ["data", "keyPath"]);
    }
    res = !this.util.isObject(res)
      ? this.buildResponse(param, undefined)
      : this.buildResponse(param, res as IStructureResponse);
    res = this.reduceResponses(res);
    return res;
  }
  protected override reduceResponses(
    response: IStructureResponse
  ): IStructureResponse {
    const keyModule = response.keyModule as TKeyModuleWithReport;
    let aStatus: ELogicResStatusCode[] = [];
    const res = response as Trf_IStructureResponse;
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
      else if (keyModule === "mutater")
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
    (response as Trf_IStructureResponse).status = aStatus.reduce(
      lanchReducerFn,
      res.status
    );
    return response;
  }
}
