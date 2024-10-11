import { LogicValidation } from "./_validation";
import { TKeyLogicContext } from "../config/shared-modules";
import {
  TKeyPrimitiveValModuleContext,
  TKeyStructureDeepValModuleContext,
  TModelConfigForVal,
  TPrimitiveValModuleConfigForRequest,
  TStructureValModuleConfigForRequest,
} from "./shared";
import { Trf_StructureLogicMetadataHandler } from "../meta/structure-metadata-handler";
import { ELogicCodeError, LogicError } from "../errors/logic-error";

import {
  TPrimitiveMetaAndValidator,
  Trf_TPrimitiveMetaAndValidator,
  Trf_TStructureMetaAndValidator,
  TStructureMetaAndValidator,
} from "../meta/metadata-shared";
import {
  ELogicResStatusCode,
  IPrimitiveResponse,
  IStructureResponse,
} from "../reports/shared";
import {
  IPrimitiveBagForActionModuleContext,
  IStructureBagForActionModuleContext,
  TFnBagForActionModule,
} from "../bag-module/shared-for-external-module";
import { StructureReportHandler } from "../reports/structure-report-handler";
import { Trf_ReportHandler } from "../reports/_reportHandler";
import { StructureBag, Trf_StructureBag } from "../bag-module/structure-bag";
import { PrimitiveBag, Trf_PrimitiveBag } from "../bag-module/primitive-bag";
import { PrimitiveReportHandler } from "../reports/primitive-report-handler";
import { Trf_PrimitiveLogicMetadataHandler } from "../meta/primitive-metadata-handler";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** define todas las propiedades de configuracion
 * de cada accion de validacion para un registro
 * completo del modelo en peticion de **lectura de datos**
 */
export interface IDiccRequestValActionConfigG {
  /**determina si permite la lectura de datos */
  isReadAllowed: boolean;
  /**determina si permite escribir datos */
  isModifyAllowed: boolean;
  /** */
  //isReadCriteriaAllowed: IStructureReadCriteria;
  /** */
  //isModifyCriteriaAllowed: IStructureModifyCriteria;
}
/**claves identificadoras del diccionario
 * de acciones de configuracion */
export type TKeysDiccRequestValActionConfigG =
  keyof IDiccRequestValActionConfigG;
/**tipado refactorizado de la clase */
export type Trf_RequestValLibGeneric = RequestLogicValidation;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**
 *
 */
export class RequestLogicValidation<
  TIDiccAC extends IDiccRequestValActionConfigG = IDiccRequestValActionConfigG
>
  extends LogicValidation<TIDiccAC>
  implements
  Record<
    TKeysDiccRequestValActionConfigG,
    TFnBagForActionModule<
      //❕se usa TFnBag para poder agrupar❕
      StructureBag<any> | PrimitiveBag<any>,
      IStructureResponse | IPrimitiveResponse
    >
  > {
  /** configuracion de valores predefinidos para el modulo*/
  public static override readonly getDefault = () => {
    const superDf = LogicValidation.getDefault();
    return {
      ...superDf,
      dfDiccActionConfig: {
        ...(superDf.dfDiccActionConfig as any),
        isReadAllowed: true,
        isModifyAllowed: true,
      } as IDiccRequestValActionConfigG,
      topKeyActionCriteria: [
        ...superDf.topPriorityKeysAction,
        "isReadAllowed",
        "isModifyAllowed",
      ] as Array<TKeysDiccRequestValActionConfigG>,
      topMandatoryKeysAction: [
        ...superDf.topMandatoryKeysAction,
      ] as Array<TKeysDiccRequestValActionConfigG>,
    };
  };
  public override get metadataHandler():
    | Trf_StructureLogicMetadataHandler
    | Trf_PrimitiveLogicMetadataHandler {
    return super.metadataHandler as any;
  }
  public override set metadataHandler(
    mH: Trf_StructureLogicMetadataHandler | Trf_PrimitiveLogicMetadataHandler
  ) {
    super.metadataHandler = mH;
  }
  public override get keyModuleContext():
    | Extract<TKeyPrimitiveValModuleContext, "requestVal">
    | Extract<TKeyStructureDeepValModuleContext, "requestVal"> {
    return "requestVal"; //comun para los contextos logicos
  }
  /**
   * @param keyLogicContext diccionario de inicializacion personalizado
   * @param keySrc indentificadora del recurso asociado a modulo
   */
  constructor(keyLogicContext: TKeyLogicContext, keySrc: string) {
    super(keyLogicContext, keySrc);
  }
  protected override getDefault() {
    return RequestLogicValidation.getDefault();
  }
  protected override rebuildCustomConfigFromModuleContext(
    currentContextConfig: TStructureValModuleConfigForRequest<TIDiccAC> | TPrimitiveValModuleConfigForRequest<TIDiccAC>,
    newContextConfig: TStructureValModuleConfigForRequest<TIDiccAC> | TPrimitiveValModuleConfigForRequest<TIDiccAC>,
    mergeMode: Parameters<typeof this.util.deepMergeObjects>[1]["mode"]
  ): TStructureValModuleConfigForRequest<TIDiccAC> | TPrimitiveValModuleConfigForRequest<TIDiccAC> {
    const cCC = currentContextConfig;
    const nCC = newContextConfig;
    let rConfig: TStructureValModuleConfigForRequest<TIDiccAC> | TPrimitiveValModuleConfigForRequest<TIDiccAC>;
    if (!this.util.isObject(nCC)) {
      rConfig = cCC;
    } else {
      rConfig = {
        ...nCC,
        diccActionsConfig: this.util.isObject(
          nCC.diccActionsConfig
        )
          ? this.util.mergeDiccActionConfig(
            [
              cCC.diccActionsConfig,
              nCC.diccActionsConfig,
            ],
            {
              mode: mergeMode,
            }
          )
          : cCC.diccActionsConfig,
      };
    }
    //...aqui configuracion refinada:
    return rConfig;
  }
  protected override getMetadataWithContextModule(
    keyPath?: string
  ):
    | TStructureMetaAndValidator<any, any, any, TIDiccAC>
    | TPrimitiveMetaAndValidator<any, TIDiccAC> {
    let extractMetadataByContext:
      | Trf_TStructureMetaAndValidator
      | Trf_TPrimitiveMetaAndValidator;
    if (this.keyLogicContext === "primitive") {
      extractMetadataByContext = (
        this.metadataHandler as Trf_PrimitiveLogicMetadataHandler
      ).getExtractMetadataByModuleContext("validator");
    } else if (this.keyLogicContext === "structure") {
      if (this.util.isEmbeddedFromKeyPath(keyPath)) {
        extractMetadataByContext = (
          this.metadataHandler as Trf_StructureLogicMetadataHandler
        ).getExtractMetadataByModuleContext(
          "structureEmbedded",
          "validator",
          keyPath
        ) as any;
      } else {
        extractMetadataByContext = (
          this.metadataHandler as Trf_StructureLogicMetadataHandler
        ).getExtractMetadataByModuleContext(
          "structureModel",
          "validator"
        ) as any;
      }
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${this.keyLogicContext} is not key logic context valid`,
      });
    }
    return extractMetadataByContext as any;
  }
  protected override getMetadataOnlyModuleConfig(
    keyPath?: string
  ): TModelConfigForVal<TIDiccAC, any> {
    const config = this.getMetadataWithContextModule(keyPath).__valConfig;
    return config;
  }
  protected override getDiccMetadataActionConfig(keyPath?: string): TIDiccAC {
    const diccAC = this.getMetadataOnlyModuleConfig(keyPath).requestVal
      .diccActionsConfig as TIDiccAC;
    return diccAC;
  }
  //❕sobrecarga necesaria para tipado (todos los hijo deben sobrecargar)❕
  protected override adapBagForContext<TKey extends keyof TIDiccAC>(
    bag: StructureBag<any> | PrimitiveBag<any>,
    keyAction: TKey
  ):
    | IStructureBagForActionModuleContext<TIDiccAC, TKey>
    | IPrimitiveBagForActionModuleContext<TIDiccAC, TKey> {
    const tGlobalAC = bag.findTupleGlobalActionConfig([
      this.keyModule as any,
      this.keyModuleContext,
      keyAction as never,
    ]);
    const tupleAC = bag.retrieveTupleActionConfig<TIDiccAC, any>(tGlobalAC);
    let actionConfig = this.retriveActionConfigFromTuple(tupleAC);
    if (actionConfig === undefined) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${actionConfig} is not action configuration valid`,
      });
    }
    actionConfig = this.buildSingleActionConfig(
      "toActionConfig" as any,
      keyAction as any,
      actionConfig as any,
      { keyPath: (bag as StructureBag<any>).keyPath, mergeMode: "soft" }
    );
    const bagFC:
      | IStructureBagForActionModuleContext<TIDiccAC, TKey>
      | IPrimitiveBagForActionModuleContext<TIDiccAC, TKey> = {
      data: bag.data,
      keyPath: (bag as StructureBag<any>).keyPath, //solo para contexto structure
      keyAction,
      actionConfig,
      responses: bag.responses as any,
      criteriaHandler: bag.criteriaHandler as any,
    };
    return bagFC as any;
  }
  public override buildReportHandler(
    bag: Trf_PrimitiveBag | Trf_StructureBag,
    keyAction: keyof TIDiccAC
  ): StructureReportHandler | PrimitiveReportHandler {
    let rH: StructureReportHandler | PrimitiveReportHandler;
    if (this.keyLogicContext === "primitive") {
      const { data, criteriaHandler, firstData } = bag as Trf_PrimitiveBag;
      const { type, modifyType, keyActionRequest } = criteriaHandler;
      rH = new PrimitiveReportHandler(this.keySrc, {
        keyRepModule: this.keyModule as any,
        keyRepModuleContext: this.keyModuleContext,
        keyRepLogicContext: this.keyLogicContext,
        keyActionRequest: keyActionRequest,
        keyAction: keyAction as any,
        keyTypeRequest: type,
        keyModifyTypeRequest: modifyType,
        keyLogic: this.keySrc,
        keyRepSrc: this.keySrc,
        status: this.globalStatus,
        tolerance: this.globalTolerance,
        fisrtCtrlData: firstData,
        data,
      });
    } else if (this.keyLogicContext === "structure") {
      const { data, criteriaHandler, keyPath, firstData } = bag as Trf_StructureBag;
      const { type, modifyType, keyActionRequest } = criteriaHandler;
      rH = new StructureReportHandler(this.keySrc, {
        keyRepModule: this.keyModule as any,
        keyRepModuleContext: this.keyModuleContext,
        keyRepLogicContext: this.keyLogicContext,
        keyActionRequest: keyActionRequest,
        keyAction: keyAction as any,
        keyTypeRequest: type,
        keyModifyTypeRequest: modifyType,
        keyPath,
        keyLogic: this.util.getKeyLogicByKeyPath(keyPath),
        keyRepSrc: this.keySrc,
        status: this.globalStatus,
        tolerance: this.globalTolerance,
        fisrtCtrlData: firstData,
        data,
      });
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${this.keyLogicContext} is not key logic context valid`
      });
    }
    return rH;
  }
  public override preRunAction(
    bag: Trf_PrimitiveBag | Trf_StructureBag,
    keyAction: keyof TIDiccAC
  ): Trf_PrimitiveBag | Trf_StructureBag {
    super.preRunAction(bag, keyAction as any) as any;
    return;
  }
  public override postRunAction(
    bag: Trf_PrimitiveBag | Trf_StructureBag,
    res: IPrimitiveResponse | IStructureResponse
  ): IStructureResponse {
    super.postRunAction(bag, res) as any;
    return;
  }
  //================================================================================================================================
  public async isReadAllowed(
    bag: StructureBag<any> | PrimitiveBag<any>
  ): Promise<IStructureResponse | IPrimitiveResponse> {
    // //Desempaquetar la accion e inicializar
    // const keyAction: TLibKeyAction = "isReadAllowed";
    // const actionConfig = diccActionConfig[keyAction];
    // //const { } = this.getModelMetaByKey(keyModel);
    // //const { } = this.getConfigValidationMeta(keyModel);
    // let res = this.mutateResponseForAction(undefined, {
    //   keyAction,
    //   status: ELogicResStatusCode.VALID_DATA,
    // });
    // //---falta aqui-----------
    return res;
  }
  public async isModifyAllowed(
    bag: StructureBag<any> | PrimitiveBag<any>
  ): Promise<IStructureResponse | IPrimitiveResponse> {
    // //Desempaquetar la accion e inicializar
    // const keyAction: TLibKeyAction = "isModifyAllowed";
    // const actionConfig = diccActionConfig[keyAction];
    // let res = this.mutateResponseForAction(undefined, {
    //   keyAction,
    //   status: ELogicResStatusCode.VALID_DATA,
    // });
    // //---falta aqui-----------
    return res;
  }
}
