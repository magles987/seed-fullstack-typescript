import { LogicMutater } from "./_mutater";
import { Trf_StructureLogicMetadataHandler } from "../meta/structure-metadata-handler";
import {
  TFieldConfigForMutate,
  TModelConfigForMutate,
  TKeyStructureDeepMutateModuleContext,
} from "./shared";
import { ELogicCodeError, LogicError } from "../errors/logic-error";
import {
  IStructureBagForActionModuleContext,
  TStructureFnBagForActionModule,
} from "../bag-module/shared-for-external-module";
import {
  StructureReportHandler,
  Trf_StructureReportHandler,
} from "../reports/structure-report-handler";
import {
  TStructureFieldMetaAndMutater,
  TStructureMetaAndMutater,
} from "../meta/metadata-shared";
import { StructureBag, Trf_StructureBag } from "../bag-module/structure-bag";
import { IStructureResponse } from "../reports/shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**tipado refactorizado de la clase */
export type Trf_StructureLogicMutater = StructureLogicMutater<any>;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *abstracta*
 *
 */
export abstract class StructureLogicMutater<
  TIDiccAC
> extends LogicMutater<TIDiccAC> {
  /** configuracion de valores predefinidos para el modulo*/
  public static override readonly getDefault = () => {
    const superDf = LogicMutater.getDefault();
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
  public override get keyModuleContext(): Trf_StructureLogicMutater["_keyStructureModuleContext"] {
    return this._keyStructureModuleContext;
  }
  /**
   * @param _keyStructureModuleContext contexto de acciones para este modulo estructurado
   * @param keySrc indentificadora del recurso asociado a modulo
   */
  constructor(
    private readonly _keyStructureModuleContext: TKeyStructureDeepMutateModuleContext,
    keySrc: string
  ) {
    super("structure", keySrc);
  }
  protected override getDefault() {
    return StructureLogicMutater.getDefault();
  }
  protected override getMetadataWithContextModule(keyPath?: string): unknown {
    let extractMetadataByContext: unknown;
    if (this.keyModuleContext === "fieldMutate") {
      extractMetadataByContext =
        this.metadataHandler.getExtractMetadataByModuleContext(
          "structureField",
          "mutater",
          keyPath
        ) as any;
    } else if (this.keyModuleContext === "modelMutate") {
      if (this.util.isEmbeddedFromKeyPath(keyPath)) {
        extractMetadataByContext =
          this.metadataHandler.getExtractMetadataByModuleContext(
            "structureEmbedded",
            "mutater",
            keyPath
          ) as any;
      } else {
        extractMetadataByContext =
          this.metadataHandler.getExtractMetadataByModuleContext(
            "structureModel",
            "mutater"
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
    if (this.keyModuleContext === "fieldMutate") {
      const metadataField = metadata as TStructureFieldMetaAndMutater<TIDiccAC>;
      config = metadataField.__mutateConfig;
    } else if (this.keyModuleContext === "modelMutate") {
      const metadataInModel = metadata as TStructureMetaAndMutater<
        any,
        any,
        TIDiccAC
      >;
      config = metadataInModel.__mutateConfig;
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
    if (this.keyModuleContext === "fieldMutate") {
      const configInField = (config as TFieldConfigForMutate<TIDiccAC>)
        .fieldMutate;
      diccAC = configInField.diccActionsConfig as TIDiccAC;
    } else if (this.keyModuleContext === "modelMutate") {
      const configInModel = (config as TModelConfigForMutate<TIDiccAC>)
        .modelMutate;
      diccAC = configInModel.diccActionsConfig as TIDiccAC;
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
    };
    return bagFC;
  }
  public override buildReportHandler(
    bag: Trf_StructureBag,
    keyAction: keyof TIDiccAC
  ): StructureReportHandler {
    const { data, criteriaHandler, keyPath, firstData } = bag;
    const { type, modifyType, keyActionRequest } = criteriaHandler;
    let rH = new StructureReportHandler(this.keySrc, {
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
    return rH;
  }
  public override preRunAction(
    bag: Trf_StructureBag,
    keyAction: keyof TIDiccAC
  ): void {
    super.preRunAction(bag, keyAction) as any;
    return;
  }
  public override postRunAction(
    bag: Trf_StructureBag,
    res: IStructureResponse
  ): void {
    super.postRunAction(bag, res) as any;
    return;
  }
}
