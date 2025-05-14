import {
  PrimitiveCriteriaHandler,
  Trf_PrimitiveCriteriaHandler,
} from "../criterias/primitive-criteria-handler";
import {
  TPrimitiveActionConfigFn,
  TStructureActionConfigFn,
} from "../criterias/shared-types";
import {
  StructureCriteriaHandler,
  Trf_StructureCriteriaHandler,
} from "../criterias/structure-criteria-handler";
import { ELogicCodeError, LogicError } from "../errors/logic-error";
import { Trf_PrimitiveLogicMetadataHandler } from "../meta/primitive-metadata-handler";
import { Trf_StructureLogicMetadataHandler } from "../meta/structure-metadata-handler";
import { Module } from "../modules/module";
import { TKeyLogicContext } from "../modules/shared-types";
import { PrimitiveReportHandler } from "../reports/primitive-report-handler";
import {
  IPrimitiveResponse,
  IStructureResponse,
} from "../reports/shared-types";
import { StructureReportHandler } from "../reports/structure-report-handler";
import { Util_Module } from "../util/util-module";
import { LogicValidation } from "./_validation";
import {
  TKeyPrimitiveValModuleContext,
  TKeyStructureDeepValModuleContext,
  TRequestValBaseConfig,
} from "./shared-types";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** define todas las propiedades de configuracion
 * de cada accion de validacion para un registro
 * completo del modelo en peticion de **lectura de datos**
 */
export interface IDiccRequestValActionConfig {
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
export type TKeysDiccRequestValActionConfig = keyof IDiccRequestValActionConfig;
/**tipado refactorizado de la clase */
export type Trf_RequestValLibGeneric = RequestLogicValidation;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**
 *
 */
export class RequestLogicValidation<
    TIDiccAC extends IDiccRequestValActionConfig = IDiccRequestValActionConfig
  >
  extends LogicValidation<TIDiccAC>
  implements
    Record<
      TKeysDiccRequestValActionConfig,
      TPrimitiveActionConfigFn<any> | TStructureActionConfigFn<any>
    >
{
  /** configuracion de valores predefinidos para el modulo*/
  public static override readonly getDefault = () => {
    const superDf = LogicValidation.getDefault();
    return {
      ...superDf,
      diccActionConfig: {
        ...(superDf.diccActionConfig as any),
        isReadAllowed: true,
        isModifyAllowed: true,
      } as IDiccRequestValActionConfig,
      topKeyActionCriteria: [
        ...superDf.topPriorityKeysAction,
        "isReadAllowed",
        "isModifyAllowed",
      ] as Array<TKeysDiccRequestValActionConfig>,
      topMandatoryKeysAction: [
        ...superDf.topMandatoryKeysAction,
      ] as Array<TKeysDiccRequestValActionConfig>,
    };
  };
  /**instancia común predefinida para el builder */
  protected static dfCommonInstance: RequestLogicValidation;
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
   */
  constructor(
    keyLogicContext: TKeyLogicContext,
    baseConfig?: TRequestValBaseConfig
  ) {
    super(keyLogicContext, baseConfig);
    baseConfig = this.util.isObject(baseConfig) ? baseConfig : ({} as any);
  }
  protected override getDefault() {
    return RequestLogicValidation.getDefault();
  }
  /**... */
  protected static buildInstanceForMetadata<
    TFieldValInstance extends RequestLogicValidation = RequestLogicValidation
  >(
    keyLogicContext: TKeyLogicContext,
    preInstance: TFieldValInstance
  ): TFieldValInstance {
    const util = Util_Module.getInstance();
    let inst: TFieldValInstance;
    if (util.isInstance(preInstance)) {
      inst = preInstance;
    } else {
      const { structureModuleFactory, primitiveModuleFactory } =
        Module._globalConfig_.diccModuleFactory;
      if (keyLogicContext === "primitive") {
        inst = primitiveModuleFactory.makeModuleInstance(
          "requestVal",
          preInstance as any
        ) as any;
      } else if (keyLogicContext === "structure") {
        inst = structureModuleFactory.makeModuleInstance(
          "requestVal",
          preInstance as any
        ) as any;
      } else {
        throw new LogicError({
          code: ELogicCodeError.MODULE_ERROR,
          msn: `${keyLogicContext} is not logic context key valid`,
        });
      }
    }
    return inst;
  }
  protected override getTupleActionConfigFromCriteriaHandler<
    TKey extends keyof TIDiccAC
  >(
    criteriaHandler:
      | Trf_PrimitiveCriteriaHandler
      | Trf_StructureCriteriaHandler,
    keyAction: TKey
  ): [TKey, TIDiccAC[TKey]] {
    const tKeyGlobalAC = [this.keyModuleContext, keyAction];
    const actionConfig =
      criteriaHandler.findGlobalActionByKeyModuleAndKeyAction(
        tKeyGlobalAC as any
      );
    return [keyAction, actionConfig];
  }
  protected override buildReportHandler(
    criteriaHandler:
      | PrimitiveCriteriaHandler<any>
      | StructureCriteriaHandler<any>,
    keyAction: keyof TIDiccAC
  ): StructureReportHandler | PrimitiveReportHandler {
    let rH: StructureReportHandler | PrimitiveReportHandler;
    if (this.keyLogicContext === "primitive") {
      const { data, firstData, type, modifyType, keyActionRequest } =
        criteriaHandler as PrimitiveCriteriaHandler<any>;
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
        firstCtrlData: firstData,
        data,
      });
    } else if (this.keyLogicContext === "structure") {
      const { data, firstData, type, modifyType, keyActionRequest, keyPath } =
        criteriaHandler as StructureCriteriaHandler<any>;
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
        firstCtrlData: firstData,
        data,
      });
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${this.keyLogicContext} is not key logic context valid`,
      });
    }
    return rH;
  }
  public override preRunAction(
    criteriaHandler:
      | PrimitiveCriteriaHandler<any>
      | StructureCriteriaHandler<any>,
    keyAction: keyof TIDiccAC
  ): PrimitiveCriteriaHandler<any> | StructureCriteriaHandler<any> {
    super.preRunAction(criteriaHandler, keyAction as any) as any;
    return;
  }
  public override postRunAction(
    criteriaHandler:
      | PrimitiveCriteriaHandler<any>
      | StructureCriteriaHandler<any>,
    res: IPrimitiveResponse | IStructureResponse
  ): IStructureResponse {
    super.postRunAction(criteriaHandler, res) as any;
    return;
  }
  //================================================================================================================================
  public async isReadAllowed(
    criteriaHandler:
      | PrimitiveCriteriaHandler<any>
      | StructureCriteriaHandler<any>
  ): Promise<IStructureResponse & IPrimitiveResponse> {
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
    bag: PrimitiveCriteriaHandler<any> | StructureCriteriaHandler<any>
  ): Promise<IStructureResponse & IPrimitiveResponse> {
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
