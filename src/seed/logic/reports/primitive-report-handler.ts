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
  TPrimitiveModuleContext,
  TPrimitiveResponseForMutate,
  Trf_IPrimitiveResponse,
} from "./shared";
import { LogicService } from "../providers/services/_service";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**refactorizacion de la clase */
export type Trf_PrimitiveReportHandler = PrimitiveReportHandler;

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *selfcontructor*
 *
 * ...
 */
export class PrimitiveReportHandler
  extends ReportHandler
  implements ReturnType<PrimitiveReportHandler["getDefault"]>
{
  public static override readonly getDefault = () => {
    const superDf = ReportHandler.getDefault();
    return {
      ...superDf,
    } as IPrimitiveResponse;
  };
  protected static override readonly getCONSTANTS = () => {
    const superCONST = ReportHandler.getCONSTANTS();
    return {
      ...superCONST,
      //..aqui las constantes
    };
  };
  public override get keyRepModuleContext(): TPrimitiveModuleContext {
    return super.keyRepModuleContext as any;
  }
  protected override set keyRepModuleContext(v: TPrimitiveModuleContext) {
    super.keyRepModuleContext = v;
  }
  public override get responses(): IPrimitiveResponse[] {
    return super.responses as any;
  }
  protected override set responses(v: IPrimitiveResponse[]) {
    super.responses = v;
  }
  /**
   * @param keySrc indentificadora del recurso asociado a modulo
   * @param base objeto literal con valores personalizados para iniicalizar las propiedades
   * @param isInit `= true` ❕Solo para herencia❕, indica si esta clase debe iniciar las propiedaes
   */
  constructor(
    keySrc: string,
    base: Partial<ReturnType<PrimitiveReportHandler["getDefault"]>> = {},
    isInit = true
  ) {
    super("primitive", keySrc, base, false);
    if (isInit) this.initProps(base);
  }
  protected override getDefault() {
    return PrimitiveReportHandler.getDefault();
  }
  protected override getCONST() {
    return PrimitiveReportHandler.getCONSTANTS();
  }
  //❗normalmente definidas en el padre, salvo que se quieran sobreescribir❗
  // /**reinicia una propiedad al valor predefinido
  //  *
  //  * @param key clave identificadora de la propiedad a reiniciar
  //  */
  // public override resetPropByKey(key: keyof ReturnType<PrimitiveReportHandler["getDefault"]>): void {
  //   const df = this.getDefault();
  //   this[key] = df[key];
  //   return;
  // }
  // protected override getLiteral(): ReturnType<
  //   PrimitiveReportHandler["getDefault"]
  // > {
  //   return super.getLiteral() as any;
  // }
  public override startResponse(
    param?: Partial<IPrimitiveResponse>
  ): IPrimitiveResponse {
    return super.startResponse(param) as IPrimitiveResponse;
  }
  public override mutateResponse(
    res: IPrimitiveResponse,
    param?: TPrimitiveResponseForMutate
  ): IPrimitiveResponse {
    return super.mutateResponse(res, param) as IPrimitiveResponse;
  }
  protected override reduceResponses(
    response: IPrimitiveResponse
  ): IPrimitiveResponse {
    const { keyRepModule: keyModule } = response;
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
      else if (keyModule === "service")
        stateStatus = LogicService.getControlReduceStatusResponse(
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
