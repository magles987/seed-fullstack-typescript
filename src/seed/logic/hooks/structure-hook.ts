import { Trf_StructureLogicMetadataHandler } from "../meta/structure-metadata-handler";
import { LogicHook } from "./_hook";
import {
  TStructureConfigForHook,
  TKeyStructureHookModuleContext,
  TStructureHookModuleConfigForStructure,
} from "./shared";
import { IStructureResponse } from "../reports/shared";
import { StructureReportHandler } from "../reports/structure-report-handler";
import {
  Trf_TStructureMetaAndHook,
  TStructureMetaAndHook,
} from "../meta/metadata-shared";
import { StructureBag, Trf_StructureBag } from "../bag/structure-bag";
import { Trf_StructureCriteriaHandler } from "../criterias/structure-criteria-handler";
import { TStructureFnBagForActionModule } from "../bag/shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**define el diccionario de configuraciones de acciones del hook */
export interface IDiccStructureHookActionConfigG {
  /**hook generico para la lectura de documentos de un modelo*/
  read: boolean | undefined;
  /**hook generico para la modificacion de documentos de un modelo*/
  modify: boolean | undefined;
}
/**claves identificadoras del diccionario
 * de acciones de configuracion */
export type TKeysDiccStructureHookActionConfigG =
  keyof IDiccStructureHookActionConfigG;
/**refactorizacion de la clase */
export type Trf_StructureLogicHook = StructureLogicHook<any>;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** */
export class StructureLogicHook<
    TIDiccAC extends IDiccStructureHookActionConfigG = IDiccStructureHookActionConfigG
  >
  extends LogicHook<TIDiccAC>
  implements
    Record<TKeysDiccStructureHookActionConfigG, TStructureFnBagForActionModule>
{
  /** configuracion de valores predefinidos para el modulo*/
  public static readonly getDefault = () => {
    const superDf = LogicHook.getDefault();
    return {
      ...superDf,
      dfDiccActionConfig: {
        ...(superDf.dfDiccActionConfig as any),
        modify: false,
        read: false,
      } as IDiccStructureHookActionConfigG,
      topPriorityKeysAction: [
        ...superDf.topPriorityKeysAction,
      ] as Array<TKeysDiccStructureHookActionConfigG>,
      topMandatoryKeysAction: [
        ...superDf.topMandatoryKeysAction,
      ] as Array<TKeysDiccStructureHookActionConfigG>,
    };
  };
  public override get metadataHandler(): Trf_StructureLogicMetadataHandler {
    const mH = super.metadataHandler as Trf_StructureLogicMetadataHandler;
    return mH;
  }
  public override set metadataHandler(mH: Trf_StructureLogicMetadataHandler) {
    super.metadataHandler = mH;
  }
  public override get keyModuleContext(): TKeyStructureHookModuleContext {
    return "structureHook";
  }
  /** */
  constructor() {
    super("structure");
  }
  protected override getDefault() {
    return StructureLogicHook.getDefault();
  }
  protected override rebuildCustomConfigFromModuleContext(
    currentContextConfig: TStructureHookModuleConfigForStructure<TIDiccAC>,
    newContextConfig: TStructureHookModuleConfigForStructure<TIDiccAC>,
    mergeMode: Parameters<typeof this.util.deepMergeObjects>[1]["mode"]
  ): TStructureHookModuleConfigForStructure<TIDiccAC> {
    const cCC = currentContextConfig;
    const nCC = newContextConfig;
    let rConfig: TStructureHookModuleConfigForStructure<TIDiccAC>;
    if (!this.util.isObject(nCC)) {
      rConfig = cCC;
    } else {
      rConfig = {
        ...nCC,
        diccActionsConfig: this.util.isObject(nCC.diccActionsConfig)
          ? this.util.mergeDiccActionConfig(
              [cCC.diccActionsConfig, nCC.diccActionsConfig],
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
  protected override getMetadataWithContextModule(): TStructureMetaAndHook<
    any,
    StructureLogicHook
  > {
    let extractMetadataByContext: Trf_TStructureMetaAndHook;
    extractMetadataByContext =
      this.metadataHandler.getExtractMetadataByModuleContext(
        "structureModel",
        "hook"
      ) as any;
    return extractMetadataByContext;
  }
  protected override getMetadataOnlyModuleConfig(): TStructureConfigForHook<TIDiccAC> {
    const metadata =
      this.getMetadataWithContextModule() as TStructureMetaAndHook<
        any,
        StructureLogicHook
      >;
    const config = metadata.__hookConfig as TStructureConfigForHook<TIDiccAC>;
    return config as TStructureConfigForHook<TIDiccAC>;
  }
  protected override getDiccMetadataActionConfig(): TIDiccAC {
    const config = this.getMetadataOnlyModuleConfig();
    const diccAC = config.structureHook.diccActionsConfig as TIDiccAC;
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
  protected override getTupleActionConfigFromCriteriaHandler<
    TKey extends keyof TIDiccAC
  >(
    criteriaHandler: Trf_StructureCriteriaHandler,
    keyAction: TKey
  ): [TKey, TIDiccAC[TKey]] {
    const tKeyGlobalAC = [this.keyModuleContext, keyAction];
    const actionConfig = criteriaHandler.getGlobalActionByTKeyGlobalAC(
      tKeyGlobalAC as any
    );
    return [keyAction, actionConfig];
  }
  protected override buildReportHandler(
    bag: Trf_StructureBag,
    keyAction: keyof TIDiccAC
  ): StructureReportHandler {
    const { data, criteriaHandler, firstData } = bag;
    const { type, modifyType, keyPath, keyActionRequest } = criteriaHandler;
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
      firstCtrlData: firstData,
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
  //================================================================
  public async read(bag: StructureBag<any>): Promise<IStructureResponse> {
    return res;
    // //Desempaquetar la accion e inicializar
    // const { data, keyAction, keyPath, actionConfig } = this.adapBagForContext(
    //   bag,
    //   "isTypeOf"
    // );
    // const { isArray, fieldType } = actionConfig;
    // let res = this.mutateResponseForMiddleware(undefined, {
    //   data,
    //   keyAction,
    //   keyPath,
    // });
    // return await this.preNext(bag, res, next);
  }
  public async modify(bag: StructureBag<any>): Promise<IStructureResponse> {
    return res;
    // //Desempaquetar la accion e inicializar
    // const { data, keyAction, keyPath, actionConfig } = this.adapBagForContext(
    //   bag,
    //   "isTypeOf"
    // );
    // //const { } = actionConfig;
    // let res = this.mutateResponseForMiddleware(undefined, {
    //   data,
    //   keyAction,
    //   keyPath,
    // });
    // return await this.preNext(bag, res, next);
  }
}
