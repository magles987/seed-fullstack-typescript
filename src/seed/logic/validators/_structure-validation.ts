import { LogicValidation } from "./_validation";
import { Trf_StructureLogicMetadataHandler } from "../meta/structure-metadata-handler";
import {
  TFieldConfigForVal,
  TModelConfigForVal,
  TKeyStructureDeepValModuleContext,
} from "./shared";
import { ELogicCodeError, LogicError } from "../errors/logic-error";
import {
  IStructureBagForActionModuleContext,
  TStructureFnBagForActionModule,
} from "../bag-module/shared-for-external-module";
import { IStructureResponse } from "../reports/shared";
import {
  StructureReportHandler,
  Trf_StructureReportHandler,
} from "../reports/structure-report-handler";
import {
  TStructureFieldMetaAndValidator,
  TStructureMetaAndValidator,
} from "../meta/metadata-shared";
import { StructureBag } from "../bag-module/structure-bag";
//████Interfaz y tipo████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**refactorizacion de la clase */
export type Trf_StructureLogicValidation = StructureLogicValidation<any>;
//████Clases████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**... */
export abstract class StructureLogicValidation<
  TIDiccAC
> extends LogicValidation<TIDiccAC> {
  /** configuracion de valores predefinidos para el modulo*/
  public static readonly getDefault = () => {
    const superDf = LogicValidation.getDefault();
    return {
      ...superDf,
    };
  };
  public override get metadataHandler(): Trf_StructureLogicMetadataHandler {
    return super.metadataHandler as any;
  }
  public override set metadataHandler(mH: Trf_StructureLogicMetadataHandler) {
    super.metadataHandler = mH;
  }
  public override get reportHandler(): Trf_StructureReportHandler {
    return super.reportHandler as any;
  }
  public override set reportHandler(rH: Trf_StructureReportHandler) {
    super.reportHandler = rH;
  }
  public override get keyModuleContext(): Trf_StructureLogicValidation["_keyStructureModuleContext"] {
    return this._keyStructureModuleContext;
  }
  /**
   * @param _keyStructureModuleContext contexto de acciones para este modulo estructurado
   * @param keySrc indentificadora del recurso asociado a modulo
   */
  constructor(
    private readonly _keyStructureModuleContext: Extract<
      TKeyStructureDeepValModuleContext,
      "fieldVal" | "modelVal"
    >,
    keySrc: string
  ) {
    super("structure", keySrc);
    this.reportHandler = new StructureReportHandler(this.keySrc, {
      keyModule: this.keyModule,
      keyModuleContext: this.keyModuleContext,
      status: this.globalStatus,
      tolerance: this.globalTolerance,
    });
  }
  protected override getDefault() {
    return StructureLogicValidation.getDefault();
  }
  protected override getMetadataWithContextModule(keyPath?: string): unknown {
    let extractMetadataByContext: unknown;
    if (this.keyModuleContext === "fieldVal") {
      extractMetadataByContext =
        this.metadataHandler.getExtractMetadataByModuleContext(
          "structureField",
          "validator",
          keyPath
        ) as any;
    } else if (this.keyModuleContext === "modelVal") {
      if (this.util.isEmbeddedFromKeyPath(keyPath)) {
        extractMetadataByContext =
          this.metadataHandler.getExtractMetadataByModuleContext(
            "structureEmbedded",
            "validator",
            keyPath
          ) as any;
      } else {
        extractMetadataByContext =
          this.metadataHandler.getExtractMetadataByModuleContext(
            "structureModel",
            "validator"
          ) as any;
      }
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${this.keyModuleContext} does not module context valid`,
      });
    }
    return extractMetadataByContext;
  }
  protected override getMetadataOnlyModuleConfig(keyPath?: string): unknown {
    let config: unknown;
    const metadata = this.getMetadataWithContextModule(keyPath);
    if (this.keyModuleContext === "fieldVal") {
      const metadataField =
        metadata as TStructureFieldMetaAndValidator<TIDiccAC>;
      config = metadataField.__valConfig;
    } else if (this.keyModuleContext === "modelVal") {
      const metadataModel = metadata as TStructureMetaAndValidator<
        any,
        any,
        TIDiccAC,
        any
      >;
      config = metadataModel.__valConfig;
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${this.keyModuleContext} does not module context valid`,
      });
    }
    return config;
  }
  protected override getDiccMetadataActionConfig(keyPath?: string): TIDiccAC {
    let diccAC: TIDiccAC;
    const config = this.getMetadataOnlyModuleConfig(keyPath);
    if (this.keyModuleContext === "fieldVal") {
      const configField = (config as TFieldConfigForVal<TIDiccAC>).fieldVal;
      diccAC = configField.diccActionsConfig as TIDiccAC;
    } else if (this.keyModuleContext === "modelVal") {
      const configModel = (config as TModelConfigForVal<TIDiccAC, any>)
        .modelVal;
      diccAC = configModel.diccActionsConfig as TIDiccAC;
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${this.keyModuleContext} does not module context valid`,
      });
    }
    return diccAC;
  }
  /**obtiene una funcion de accion de acuerdo a su clave identificadora
   * preparada para ser inyectada en el middleware
   *
   * @param keyAction la clave identificadora de la funcion de accion solicitada
   *
   * @returns la funcion de accion
   */
  public override getActionFnByKey<
    TKeys extends keyof TIDiccAC = keyof TIDiccAC
  >(keyAction: TKeys): TStructureFnBagForActionModule;
  /**obtiene un array de funciones de accion de acuerdo a sus claves identificadoras
   * preparadas para ser inyectadas en el middleware
   *
   * @param keysAction el array de las claves identificadoras de las funciones de accion solicitadas
   *
   * @returns el array de funciones de accion
   */
  public override getActionFnByKey<
    TKeys extends keyof TIDiccAC = keyof TIDiccAC
  >(keysAction: TKeys[]): Array<TStructureFnBagForActionModule>;
  public override getActionFnByKey(keyOrKeysAction: unknown): unknown {
    return super.getActionFnByKey(keyOrKeysAction);
  }
  protected override adapBagForContext(
    bag: StructureBag<any>,
    keyAction: any
  ): IStructureBagForActionModuleContext<any, any> {
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
      { keyPath: bag.keyPath, mergeMode: "soft" }
    );
    const bagFC: IStructureBagForActionModuleContext<TIDiccAC, any> = {
      data: bag.data,
      keyPath: bag.keyPath,
      keyAction,
      actionConfig,
      responses: bag.responses,
      criteriaHandler: bag.criteriaHandler,
      middlewareReportStatus: bag.middlewareReportStatus,
    };
    return bagFC;
  }
  /**... */
  protected abstract checkEmptyData(
    data: any,
    specialEmptyConfig: unknown
  ): boolean;
  /**
   * verificacion de si el dato es vacio (estado en
   * que puede estar y afecta a todas las validacion
   * dependiendo si es requerido o no)
   *
   * @param data - el dato a verificar
   * @param res - la respuesta actual de la validación
   * @param middlewareStatus - reporte de los middlewares
   * (actual, ejecutados y por ejecutarse).
   */
  protected abstract checkEmptyDataWithRes(
    bag: StructureBag<any>,
    data: any,
    res: IStructureResponse
  ): IStructureResponse;
}
