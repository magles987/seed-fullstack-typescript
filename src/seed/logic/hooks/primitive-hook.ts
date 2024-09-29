import { ELogicCodeError, LogicError } from "../errors/logic-error";
import {
  PrimitiveLogicMetadataHandler,
  Trf_PrimitiveLogicMetadataHandler,
} from "../meta/primitive-metadata-handler";
import { LogicHook } from "./_hook";
import {
  TStructureConfigForHook,
  TKeyPrimitiveHookModuleContext,
  TPrimitiveConfigForHook,
} from "./shared";
import {
  IPrimitiveBagForActionModuleContext,
  TPrimitiveFnBagForActionModule,
} from "../bag-module/shared-for-external-module";
import { ELogicResStatusCode, IPrimitiveResponse } from "../reports/shared";
import {
  PrimitiveReportHandler,
  Trf_PrimitiveReportHandler,
} from "../reports/primitive-report-handler";
import { TPrimitiveMetaAndHook } from "../meta/metadata-shared";
import { PrimitiveBag } from "../bag-module/primitive-bag";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**define el diccionario de configuraciones de acciones del hook */
export interface IDiccPrimitiveHookActionConfigG {
  /**hook generico para la lectura de documentos de un modelo*/
  read: boolean | undefined;
  /**hook generico para la modificacion de documentos de un modelo*/
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
  public override get metadataHandler(): Trf_PrimitiveLogicMetadataHandler {
    const mH = super.metadataHandler as Trf_PrimitiveLogicMetadataHandler;
    return mH;
  }
  public override set metadataHandler(mH: Trf_PrimitiveLogicMetadataHandler) {
    super.metadataHandler = mH;
  }
  public override get reportHandler(): Trf_PrimitiveReportHandler {
    const rH = super.reportHandler as Trf_PrimitiveReportHandler;
    return rH;
  }
  public override set reportHandler(rH: Trf_PrimitiveReportHandler) {
    super.reportHandler = rH;
  }
  public override get keyModuleContext(): TKeyPrimitiveHookModuleContext {
    return "primitiveHook";
  }
  /**
   * @param _keyPrimitiveModuleContext contexto de acciones para este modulo estructurado
   * @param keySrc indentificadora del recurso asociado a modulo
   */
  constructor(keySrc: string) {
    super("primitive", keySrc);
    this.reportHandler = new PrimitiveReportHandler(this.keySrc, {
      keyModule: this.keyModule,
      keyModuleContext: this.keyModuleContext,
      status: this.globalStatus,
      tolerance: this.globalTolerance,
    });
  }
  protected override getDefault() {
    return PrimitiveLogicHook.getDefault();
  }
  protected override getMetadataWithContextModule(): TPrimitiveMetaAndHook<TIDiccAC> {
    const metadata =
      this.metadataHandler.getExtractMetadataByModuleContext("hook");
    return metadata as any;
  }
  protected override getMetadataOnlyModuleConfig(): TPrimitiveConfigForHook<TIDiccAC> {
    const metadata =
      this.getMetadataWithContextModule() as TPrimitiveMetaAndHook<TIDiccAC>;
    let config = metadata.__hookConfig as TPrimitiveConfigForHook<TIDiccAC>;
    return config;
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
  protected override adapBagForContext<TKey extends keyof TIDiccAC>(
    bag: PrimitiveBag<any>,
    keyAction: TKey
  ): IPrimitiveBagForActionModuleContext<TIDiccAC, TKey> {
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
      { mergeMode: "soft" }
    );
    const bagFC: IPrimitiveBagForActionModuleContext<TIDiccAC, any> = {
      data: bag.data,
      keyAction,
      actionConfig,
      responses: bag.responses,
      criteriaHandler: bag.criteriaHandler,
      middlewareReportStatus: bag.middlewareReportStatus,
    };
    return bagFC;
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
