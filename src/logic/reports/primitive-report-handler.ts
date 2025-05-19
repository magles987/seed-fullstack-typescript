import { LogicController } from "../controllers/_controller";
import { LogicHook } from "../hooks/_hook";
import { LogicMutater } from "../mutaters/_mutater";
import { LogicProvider } from "../providers/_provider";
import { TSelectorDataRepository } from "../providers/repositories/shared-types";
import { LogicValidation } from "../validators/_validation";
import { ReportHandler } from "./_reportHandler";
import {
  IPrimitiveResponse,
  TPrimitiveModuleContext,
  TPrimitiveResponseForMutate,
  Trf_IPrimitiveResponse,
  ELogicResStatusCode,
  IRepositoryResponse,
} from "./shared-types";
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
    } as typeof superDf & IPrimitiveResponse;
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
   * @param keySrc identificadora del recurso asociado a modulo
   * @param base objeto literal con valores personalizados para inicializar las propiedades
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
    const { keyRepModule } = response;
    let res = response as Trf_IPrimitiveResponse;
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
      res = this.mutateData(res, embRes);
    }
    return res;
  }
  protected override mutateData(
    rootRes: IPrimitiveResponse,
    embRes: IPrimitiveResponse
  ): IPrimitiveResponse {
    let newData: any;
    const { keyRepModuleContext: root_keyRepModuleContext, data: root_data } =
      rootRes;
    const { keyRepModuleContext: emb_keyRepModuleContext, data: emb_data } =
      embRes;
    //banderas raiz
    const isRootPrimitiveMutater =
      root_keyRepModuleContext === "primitiveMutate";
    const isRootPrimitiveVal = root_keyRepModuleContext === "primitiveVal";
    const isRootRequestVal = root_keyRepModuleContext === "requestVal";
    const isRootPrimitiveHook = root_keyRepModuleContext === "primitiveHook";
    const isRootPrimitiveProvider =
      root_keyRepModuleContext === "primitiveProvider";
    const isRootPrimitiveCtrl = root_keyRepModuleContext === "primitiveCtrl";
    //banderas embebido
    const isEmbPrimitiveMutater = emb_keyRepModuleContext === "primitiveMutate";
    const isEmbPrimitiveVal = emb_keyRepModuleContext === "primitiveVal";
    const isEmbRequestVal = emb_keyRepModuleContext === "requestVal";
    const isEmbPrimitiveHook = emb_keyRepModuleContext === "primitiveHook";
    const isEmbPrimitiveProvider =
      emb_keyRepModuleContext === "primitiveProvider";
    const isEmbPrimitiveCtrl = emb_keyRepModuleContext === "primitiveCtrl";
    //mutar dato según combinaciones:
    //❔...definir aquí combinaciones❔
    newData = emb_data;
    //
    rootRes.data = newData;
    return rootRes;
  }
  public override adaptRepositoryResponseToResponse(
    repositoryResponses: IRepositoryResponse | IRepositoryResponse[],
    response: IPrimitiveResponse,
    selectorDataRepository: TSelectorDataRepository
  ): IPrimitiveResponse {
    return super.adaptRepositoryResponseToResponse(
      repositoryResponses,
      response,
      selectorDataRepository
    ) as IPrimitiveResponse;
  }
}
