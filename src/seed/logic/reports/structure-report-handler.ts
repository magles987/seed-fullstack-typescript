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
  Trf_IStructureResponse,
  TStructureModuleContext,
  TStructureResponseForMutate,
} from "./shared";
import { LogicService } from "../providers/services/_service";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**refactorizacion de la clase */
export type Trf_StructureReportHandler = StructureReportHandler;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *selfcontructor*
 *
 * ...
 */
export class StructureReportHandler
  extends ReportHandler
  implements ReturnType<StructureReportHandler["getDefault"]>
{
  public static override readonly getDefault = () => {
    const superDf = ReportHandler.getDefault();
    return {
      ...superDf,
      keyPath: undefined,
    } as IStructureResponse;
  };
  protected static override readonly getCONSTANTS = () => {
    const superCONST = ReportHandler.getCONSTANTS();
    return {
      ...superCONST,
      //..aqui las constantes
    };
  };
  private _keyPath: string;
  public get keyPath(): string {
    return this._keyPath;
  }
  public set keyPath(v: string) {
    this._keyPath = this.util.isString(v)
      ? v
      : this._keyPath !== undefined
      ? this._keyPath
      : this.getDefault().keyPath;
  }
  public override get keyRepModuleContext(): TStructureModuleContext {
    return super.keyRepModuleContext as any;
  }
  protected override set keyRepModuleContext(v: TStructureModuleContext) {
    super.keyRepModuleContext = v;
  }
  public override get responses(): IStructureResponse[] {
    return super.responses as any;
  }
  protected override set responses(v: IStructureResponse[]) {
    super.responses = v;
  }
  /**
   * @param keySrc indentificadora del recurso asociado a modulo
   * @param base objeto literal con valores personalizados para iniicalizar las propiedades
   * @param isInit `= true` ❕Solo para herencia❕, indica si esta clase debe iniciar las propiedaes
   */
  constructor(
    keySrc: string,
    base: Partial<ReturnType<StructureReportHandler["getDefault"]>> = {},
    isInit = true
  ) {
    super("structure", keySrc, base, false);
    if (isInit) this.initProps(base);
  }
  protected override getDefault() {
    return StructureReportHandler.getDefault();
  }
  protected override getCONST() {
    return StructureReportHandler.getCONSTANTS();
  }
  //❗normalmente definidas en el padre, salvo que se quieran sobreescribir❗
  // /**reinicia una propiedad al valor predefinido
  //  *
  //  * @param key clave identificadora de la propiedad a reiniciar
  //  */
  // public override resetPropByKey(key: keyof ReturnType<StructureReportHandler["getDefault"]>): void {
  //   const df = this.getDefault();
  //   this[key] = df[key];
  //   return;
  // }
  // protected override getLiteral(): ReturnType<
  //   StructureReportHandler["getDefault"]
  // > {
  //   return super.getLiteral() as any;
  // }
  public override startResponse(
    param?: Partial<IStructureResponse>
  ): IStructureResponse {
    return super.startResponse(param) as IStructureResponse;
  }
  public override mutateResponse(
    res: IStructureResponse,
    param?: TStructureResponseForMutate
  ): IStructureResponse {
    return super.mutateResponse(res, param) as IStructureResponse;
  }
  protected override reduceResponses(
    response: IStructureResponse
  ): IStructureResponse {
    const { keyRepModule: keyModule } = response;
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
      else if (keyModule === "service")
        stateStatus = LogicService.getControlReduceStatusResponse(
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
