import { LogicController } from "../controllers/_controller";
import {
  TKeyStructureDeepCtrlModuleContext,
  TKeyStructureCtrlModuleContext,
} from "../controllers/shared-types";
import { LogicError, ELogicCodeError } from "../errors/logic-error";
import { LogicHook } from "../hooks/_hook";
import {
  TKeyStructureDeepHookModuleContext,
  TKeyStructureHookModuleContext,
} from "../hooks/shared-types";
import {
  TKeyStructureContextFull,
  TKeyActionModule,
} from "../modules/shared-types";
import { LogicMutater } from "../mutaters/_mutater";
import { LogicProvider } from "../providers/_provider";
import { TSelectorDataRepository } from "../providers/repositories/shared-types";
import {
  TKeyStructureDeepProviderModuleContext,
  TKeyStructureProviderModuleContext,
} from "../providers/shared-types";
import { LogicValidation } from "../validators/_validation";
import { ReportHandler } from "./_reportHandler";
import {
  IStructureResponse,
  TStructureModuleContext,
  TStructureResponseForMutate,
  Trf_IStructureResponse,
  ELogicResStatusCode,
  IRepositoryResponse,
} from "./shared-types";
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
      res = this.mutateData(res, embRes);
    }
    return res;
  }
  protected override mutateData(
    rootRes: IStructureResponse,
    embRes: IStructureResponse
  ): IStructureResponse {
    let newData: any;
    const {
      keyRepModuleContext: root_keyRepModuleContext,
      data: root_data,
      keyLogic: root_keyLogic,
    } = rootRes;
    const {
      keyRepModuleContext: emb_keyRepModuleContext,
      data: emb_data,
      keyLogic: emb_keyLogic,
    } = embRes;
    //banderas raiz
    const isRootFieldMutater = root_keyRepModuleContext === "fieldMutate";
    const isRootModelMutater = root_keyRepModuleContext === "modelMutate";
    const isRootFieldVal = root_keyRepModuleContext === "fieldVal";
    const isRootModelVal = root_keyRepModuleContext === "modelVal";
    const isRootRequestVal = root_keyRepModuleContext === "requestVal";
    const isRootFieldHook = root_keyRepModuleContext === "fieldHook";
    const isRootModelHook = root_keyRepModuleContext === "modelHook";
    const isRootFieldProvider = root_keyRepModuleContext === "fieldProvider";
    const isRootModelProvider = root_keyRepModuleContext === "modelProvider";
    const isRootFieldCtrl = root_keyRepModuleContext === "fieldCtrl";
    const isRootModelCtrl = root_keyRepModuleContext === "modelCtrl";
    //banderas embebido
    const isEmbFieldMutater = emb_keyRepModuleContext === "fieldMutate";
    const isEmbModelMutater = emb_keyRepModuleContext === "modelMutate";
    const isEmbFieldVal = emb_keyRepModuleContext === "fieldVal";
    const isEmbModelVal = emb_keyRepModuleContext === "modelVal";
    const isEmbRequestVal = emb_keyRepModuleContext === "requestVal";
    const isEmbFieldHook = emb_keyRepModuleContext === "fieldHook";
    const isEmbModelHook = emb_keyRepModuleContext === "modelHook";
    const isEmbFieldProvider = emb_keyRepModuleContext === "fieldProvider";
    const isEmbModelProvider = emb_keyRepModuleContext === "modelProvider";
    const isEmbFieldCtrl = emb_keyRepModuleContext === "fieldCtrl";
    const isEmbModelCtrl = emb_keyRepModuleContext === "modelCtrl";
    //mutar dato según combinaciones:
    if (
      (isRootModelMutater && isEmbFieldMutater) ||
      (isRootModelVal && isEmbFieldVal) ||
      (isRootModelHook && isEmbFieldHook) ||
      (isRootModelProvider && isEmbFieldProvider) ||
      (isRootModelCtrl && isEmbFieldCtrl)
    ) {
      //mutación de campo a modelo (o embebido)
      newData = this.util.isObject(root_data) ? root_data : {};
      newData[emb_keyLogic] = emb_data;
    } else if (
      (isRootFieldMutater && isEmbModelMutater) ||
      (isRootFieldVal && isEmbModelVal) ||
      (isRootFieldHook && isEmbModelHook) ||
      (isRootFieldProvider && isEmbModelProvider) ||
      (isRootFieldCtrl && isEmbModelCtrl)
    ) {
      //mutación de modelo embebido a campo
      //❗Reemplaza todo sin verificación❗
      newData = emb_data;
    } else {
      //❗Reemplaza todo sin verificación❗
      newData = emb_data; //❓Verificaiones entre modulos❓
    }
    rootRes.data = newData;
    return rootRes;
  }
  public override adaptRepositoryResponseToResponse(
    repositoryResponses: IRepositoryResponse | IRepositoryResponse[],
    response: IStructureResponse,
    selectorDataRepository: TSelectorDataRepository
  ): IStructureResponse {
    return super.adaptRepositoryResponseToResponse(
      repositoryResponses,
      response,
      selectorDataRepository
    ) as IStructureResponse;
  }
  /**... */
  public static adapatKeyStructureContextToDeepKeyModuleContext(
    keyModule: "hook",
    keyStructureContext: TKeyStructureContextFull
  ): TKeyStructureDeepHookModuleContext;
  public static adapatKeyStructureContextToDeepKeyModuleContext(
    keyModule: "provider",
    keyStructureContext: TKeyStructureContextFull
  ): TKeyStructureDeepProviderModuleContext;
  public static adapatKeyStructureContextToDeepKeyModuleContext(
    keyModule: "controller",
    keyStructureContext: TKeyStructureContextFull
  ): TKeyStructureDeepCtrlModuleContext;
  public static adapatKeyStructureContextToDeepKeyModuleContext(
    keyModule: Extract<TKeyActionModule, "hook" | "provider" | "controller">,
    keyStructureContext: TKeyStructureContextFull
  ): unknown {
    let deep_keyModuleContext: unknown;
    if (keyModule === "hook") {
      let deep_hKMC: TKeyStructureDeepHookModuleContext;
      if (keyStructureContext === "structureField") deep_hKMC = "fieldHook";
      else if (keyStructureContext === "structureEmbedded")
        deep_hKMC = "modelHook";
      else if (keyStructureContext === "structureModel")
        deep_hKMC = "modelHook";
      else {
        throw new LogicError({
          code: ELogicCodeError.MODULE_ERROR,
          msn: `${keyStructureContext} is not structure context key valid from criteria`,
        });
      }
      deep_keyModuleContext = deep_hKMC;
    } else if (keyModule === "provider") {
      let deep_hKMC: TKeyStructureDeepProviderModuleContext;
      if (keyStructureContext === "structureField") deep_hKMC = "fieldProvider";
      else if (keyStructureContext === "structureEmbedded")
        deep_hKMC = "modelProvider";
      else if (keyStructureContext === "structureModel")
        deep_hKMC = "modelProvider";
      else {
        throw new LogicError({
          code: ELogicCodeError.MODULE_ERROR,
          msn: `${keyStructureContext} is not structure context key valid from criteria`,
        });
      }
      deep_keyModuleContext = deep_hKMC;
    } else if (keyModule === "controller") {
      let deep_hKMC: TKeyStructureDeepCtrlModuleContext;
      if (keyStructureContext === "structureField") deep_hKMC = "fieldCtrl";
      else if (keyStructureContext === "structureEmbedded")
        deep_hKMC = "modelCtrl";
      else if (keyStructureContext === "structureModel")
        deep_hKMC = "modelCtrl";
      else {
        throw new LogicError({
          code: ELogicCodeError.MODULE_ERROR,
          msn: `${keyStructureContext} is not structure context key valid from criteria`,
        });
      }
      deep_keyModuleContext = deep_hKMC;
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${keyModule} is not module context key valid from criteria`,
      });
    }
    return deep_keyModuleContext;
  }
  /**... */
  public static adaptDeepKeyModuleContextToStructureKeyModuleContext(
    deepKeyModuleContext: TKeyStructureDeepHookModuleContext
  ): TKeyStructureHookModuleContext;
  public static adaptDeepKeyModuleContextToStructureKeyModuleContext(
    deepKeyModuleContext: TKeyStructureDeepHookModuleContext
  ): TKeyStructureProviderModuleContext;
  public static adaptDeepKeyModuleContextToStructureKeyModuleContext(
    deepKeyModuleContext: TKeyStructureDeepCtrlModuleContext
  ): TKeyStructureCtrlModuleContext;
  public static adaptDeepKeyModuleContextToStructureKeyModuleContext(
    deepKeyModuleContext:
      | TKeyStructureDeepHookModuleContext
      | TKeyStructureDeepProviderModuleContext
      | TKeyStructureDeepCtrlModuleContext
  ): unknown {
    let structure_keyModuleContext: unknown;
    if (
      deepKeyModuleContext === "fieldHook" ||
      deepKeyModuleContext === "modelHook"
    ) {
      structure_keyModuleContext =
        "structureHook" as TKeyStructureHookModuleContext;
    } else if (
      deepKeyModuleContext === "fieldProvider" ||
      deepKeyModuleContext === "modelProvider"
    ) {
      structure_keyModuleContext =
        "structureProvider" as TKeyStructureProviderModuleContext;
    } else if (
      deepKeyModuleContext === "fieldCtrl" ||
      deepKeyModuleContext === "modelCtrl"
    ) {
      structure_keyModuleContext =
        "structureCtrl" as TKeyStructureCtrlModuleContext;
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${deepKeyModuleContext} is not deep module context key valid from criteria`,
      });
    }
    return structure_keyModuleContext;
  }
}
