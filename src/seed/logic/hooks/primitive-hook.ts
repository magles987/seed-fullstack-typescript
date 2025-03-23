import { Trf_PrimitiveLogicMetadataHandler } from "../meta/primitive-metadata-handler";
import { LogicHook } from "./_hook";
import {
  TKeyPrimitiveHookModuleContext,
  TPrimitiveConfigForHook,
  TPrimitiveHookModuleConfigForPrimitive,
} from "./shared";
import { IPrimitiveResponse } from "../reports/shared";
import { PrimitiveReportHandler } from "../reports/primitive-report-handler";
import { TPrimitiveMetaAndHook } from "../meta/metadata-shared";
import { PrimitiveBag, Trf_PrimitiveBag } from "../bag/primitive-bag";
import { TPrimitiveFnBagForActionModule } from "../bag/shared";
import { Trf_PrimitiveCriteriaHandler } from "../criterias/primitive-criteria-handler";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**define el diccionario de configuraciones de acciones del hook */
export interface IDiccPrimitiveHookActionConfigG {
  /**hook genérico para la lectura de documentos de un modelo*/
  read: boolean | undefined;
  /**hook genérico para la modificación de documentos de un modelo*/
  modify: boolean | undefined;
}
/**claves identificadoras del diccionario
 * de acciones de configuracion */
export type TKeysDiccPrimitiveHookActionConfigG =
  keyof IDiccPrimitiveHookActionConfigG;
/**refactorizacion de la clase */
export type Trf_PrimitiveLogicHook = PrimitiveLogicHook<any>;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** */
export class PrimitiveLogicHook<
    TIDiccAC extends IDiccPrimitiveHookActionConfigG = IDiccPrimitiveHookActionConfigG
  >
  extends LogicHook<TIDiccAC>
  implements
    Record<TKeysDiccPrimitiveHookActionConfigG, TPrimitiveFnBagForActionModule>
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
      } as IDiccPrimitiveHookActionConfigG,
      topPriorityKeysAction: [
        ...superDf.topPriorityKeysAction,
      ] as Array<TKeysDiccPrimitiveHookActionConfigG>,
      topMandatoryKeysAction: [
        ...superDf.topMandatoryKeysAction,
      ] as Array<TKeysDiccPrimitiveHookActionConfigG>,
    };
  };
  protected override rebuildCustomConfigFromModuleContext(
    currentContextConfig: TPrimitiveHookModuleConfigForPrimitive<TIDiccAC>,
    newContextConfig: TPrimitiveHookModuleConfigForPrimitive<TIDiccAC>,
    mergeMode: Parameters<typeof this.util.deepMergeObjects>[1]["mode"]
  ): TPrimitiveHookModuleConfigForPrimitive<TIDiccAC> {
    const cCC = currentContextConfig;
    const nCC = newContextConfig;
    let rConfig: TPrimitiveHookModuleConfigForPrimitive<TIDiccAC>;
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

  public override get metadataHandler(): Trf_PrimitiveLogicMetadataHandler {
    const mH = super.metadataHandler as Trf_PrimitiveLogicMetadataHandler;
    return mH;
  }
  public override set metadataHandler(mH: Trf_PrimitiveLogicMetadataHandler) {
    super.metadataHandler = mH;
  }
  public override get keyModuleContext(): TKeyPrimitiveHookModuleContext {
    return "primitiveHook";
  }
  /**
   * @param _keyPrimitiveModuleContext contexto de acciones para este modulo estructurado
   */
  constructor() {
    super("primitive");
  }
  protected override getDefault() {
    return PrimitiveLogicHook.getDefault();
  }
  protected override getMetadataWithContextModule(): TPrimitiveMetaAndHook<PrimitiveLogicHook> {
    const metadata =
      this.metadataHandler.getExtractMetadataByModuleContext("hook");
    return metadata;
  }
  protected override getMetadataOnlyModuleConfig(): TPrimitiveConfigForHook<TIDiccAC> {
    const metadata =
      this.getMetadataWithContextModule() as TPrimitiveMetaAndHook<PrimitiveLogicHook>;
    let config = metadata.__hookConfig as TPrimitiveConfigForHook<TIDiccAC>;
    return config as TPrimitiveConfigForHook<TIDiccAC>;
  }
  protected override getDiccMetadataActionConfig(): TIDiccAC {
    const config = this.getMetadataOnlyModuleConfig();
    const diccAC = config.primitiveHook.diccActionsConfig as TIDiccAC;
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
  >(keyAction: TKeys): TPrimitiveFnBagForActionModule;
  /**obtiene un array de funciones de accion de acuerdo a sus claves identificadoras
   * preparadas para ser inyectadas en el middleware
   *
   * @param keysAction el array de las claves identificadoras de las funciones de accion solicitadas
   *
   * @returns el array de funciones de accion
   */
  public override getActionFnByKey<
    TKeys extends keyof TIDiccAC = keyof TIDiccAC
  >(keysAction: TKeys[]): Array<TPrimitiveFnBagForActionModule>;
  public override getActionFnByKey(keyOrKeysAction: unknown): unknown {
    return super.getActionFnByKey(keyOrKeysAction);
  }
  protected override getTupleActionConfigFromCriteriaHandler<
    TKey extends keyof TIDiccAC
  >(
    criteriaHandler: Trf_PrimitiveCriteriaHandler,
    keyAction: TKey
  ): [TKey, TIDiccAC[TKey]] {
    const tKeyGlobalAC = [this.keyModuleContext, keyAction];
    const actionConfig = criteriaHandler.getGlobalActionByTKeyGlobalAC(
      tKeyGlobalAC as any
    );
    return [keyAction, actionConfig];
  }
  protected override buildReportHandler(
    bag: Trf_PrimitiveBag,
    keyAction: keyof TIDiccAC
  ): PrimitiveReportHandler {
    const { data, criteriaHandler, firstData } = bag;
    const { type, modifyType, keyActionRequest } = criteriaHandler;
    let rH = new PrimitiveReportHandler(this.keySrc, {
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
    return rH;
  }
  public override preRunAction(
    bag: Trf_PrimitiveBag,
    keyAction: keyof TIDiccAC
  ): void {
    super.preRunAction(bag, keyAction as any) as any;
    return;
  }
  public override postRunAction(
    bag: Trf_PrimitiveBag,
    res: IPrimitiveResponse
  ): void {
    super.postRunAction(bag, res) as any;
    return;
  }
  //================================================================
  public async read(bag: PrimitiveBag<any>): Promise<IPrimitiveResponse> {
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
  public async modify(bag: PrimitiveBag<any>): Promise<IPrimitiveResponse> {
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
