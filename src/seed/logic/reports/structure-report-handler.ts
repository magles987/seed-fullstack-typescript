import { LogicController } from "../controllers/_controller";
import { LogicMutater } from "../mutaters/_mutater";
import { LogicHook } from "../hooks/_hook";
import { LogicProvider } from "../providers/_provider";
import { LogicValidation } from "../validators/_validation";
import { ReportHandler } from "./_reportHandler";
import {
  ELogicResStatusCode,
  IDriverResponse,
  IStructureResponse,
  Trf_IStructureResponse,
  TSelectorDataDriver,
  TStructureModuleContext,
  TStructureResponseForMutate,
} from "./shared";
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
    } as typeof superDf & IStructureResponse;
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
   * @param keySrc identificadora del recurso asociado a modulo
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
    const { keyRepModule } = response;
    let res = response as Trf_IStructureResponse;
    let reses = res.responses;
    for (let idx = 0; idx < reses.length; idx++) {
      const embRes = this.reduceResponses(reses[idx]); //recursivo para res embebidos internos
      if (keyRepModule === "controller") {
        res.status = LogicController.getControlReduceStatusResponse(
          res.status,
          embRes.status
        );
      } else if (keyRepModule === "mutater") {
        res.status = LogicMutater.getControlReduceStatusResponse(
          res.status,
          embRes.status
        );
      } else if (keyRepModule === "validator") {
        res.status = LogicValidation.getControlReduceStatusResponse(
          res.status,
          embRes.status
        );
      } else if (keyRepModule === "hook") {
        res.status = LogicHook.getControlReduceStatusResponse(
          res.status,
          embRes.status
        );
      } else if (keyRepModule === "provider") {
        res.status = LogicProvider.getControlReduceStatusResponse(
          res.status,
          embRes.status
        );
      } else res.status = ELogicResStatusCode.ERROR;
      const isFieldContext =
        embRes.keyRepModuleContext === "fieldCtrl" ||
        embRes.keyRepModuleContext === "fieldMutate" ||
        embRes.keyRepModuleContext === "fieldVal";
      const isModelContext =
        res.keyRepModuleContext === "modelCtrl" ||
        res.keyRepModuleContext === "modelMutate" ||
        res.keyRepModuleContext === "modelVal";
      if (!(isFieldContext && isModelContext)) {
        //solo muta si la reduccion no compromete de campo a modelo
        this.mutateData(embRes.data, res);
      }
    }
    return res;
  }
  public override adaptDriverResponseToResponse(
    driverResponses: IDriverResponse | IDriverResponse[],
    response: IStructureResponse,
    selectorDataDriver: TSelectorDataDriver
  ): IStructureResponse {
    return super.adaptDriverResponseToResponse(
      driverResponses,
      response,
      selectorDataDriver
    ) as IStructureResponse;
  }
}
