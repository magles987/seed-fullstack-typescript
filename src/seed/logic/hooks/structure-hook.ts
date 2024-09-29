import { ELogicCodeError, LogicError } from "../errors/logic-error";
import { Trf_StructureLogicMetadataHandler } from "../meta/structure-metadata-handler";
import { LogicHook } from "./_hook";
import {
  TStructureConfigForHook,
  TKeyStructureHookModuleContext,
} from "./shared";
import {
  IStructureBagForActionModuleContext,
  TStructureFnBagForActionModule,
} from "../bag-module/shared-for-external-module";
import { IStructureResponse } from "../reports/shared";
import {
  StructureReportHandler,
  Trf_StructureReportHandler,
} from "../reports/structure-report-handler";
import { TStructureMetaAndHook } from "../meta/metadata-shared";
import { StructureBag } from "../bag-module/structure-bag";
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
  public override get reportHandler(): Trf_StructureReportHandler {
    const rH = super.reportHandler as Trf_StructureReportHandler;
    return rH;
  }
  public override set reportHandler(rH: Trf_StructureReportHandler) {
    super.reportHandler = rH;
  }
  public override get keyModuleContext(): TKeyStructureHookModuleContext {
    return "structureHook";
  }
  /**
   * @param keySrc indentificadora del recurso asociado a modulo
   */
  constructor(keySrc: string) {
    super("structure", keySrc);
    this.reportHandler = new StructureReportHandler(this.keySrc, {
      keyModule: this.keyModule,
      keyModuleContext: this.keyModuleContext,
      status: this.globalStatus,
      tolerance: this.globalTolerance,
    });
  }
  protected override getDefault() {
    return StructureLogicHook.getDefault();
  }
  protected override getMetadataWithContextModule(): TStructureMetaAndHook<
    any,
    TIDiccAC
  > {
    let extractMetadataByContext: TStructureMetaAndHook<any, TIDiccAC>;
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
        TIDiccAC
      >;
    const config = metadata.__hookConfig as TStructureConfigForHook<TIDiccAC>;
    return config;
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
  protected override adapBagForContext<TKey extends keyof TIDiccAC>(
    bag: StructureBag<any>,
    keyAction: TKey
  ): IStructureBagForActionModuleContext<TIDiccAC, TKey> {
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
