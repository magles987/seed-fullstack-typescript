import { TStructureActionConfigFn } from "../criterias/shared-types";
import {
  StructureCriteriaHandler,
  Trf_StructureCriteriaHandler,
} from "../criterias/structure-criteria-handler";
import { Trf_StructureLogicMetadataHandler } from "../meta/structure-metadata-handler";
import { TwinBeeModule } from "../modules/module";
import { IStructureResponse } from "../reports/shared-types";
import { StructureReportHandler } from "../reports/structure-report-handler";
import { LogicHook } from "./_hook";
import {
  TKeyStructureHookModuleContext,
  TStructureHookBaseConfig,
} from "./shared-types";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**define el diccionario de configuraciones de acciones del hook */
export interface IDiccStructureHookActionConfig {
  /**hook generico para la lectura de documentos de un modelo*/
  read: boolean | undefined;
  /**hook generico para la modificacion de documentos de un modelo*/
  modify: boolean | undefined;
}
/**claves identificadoras del diccionario
 * de acciones de configuracion */
export type TKeysDiccStructureHookActionConfig =
  keyof IDiccStructureHookActionConfig;
/**refactorizacion de la clase */
export type Trf_StructureLogicHook = StructureLogicHook<any>;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** */
export class StructureLogicHook<
    TIDiccAC extends IDiccStructureHookActionConfig = IDiccStructureHookActionConfig
  >
  extends LogicHook<TIDiccAC>
  implements
    Record<TKeysDiccStructureHookActionConfig, TStructureActionConfigFn<any>>
{
  /** configuracion de valores predefinidos para el modulo*/
  public static readonly getDefault = () => {
    const superDf = LogicHook.getDefault();
    return {
      ...superDf,
      diccActionConfig: {
        ...(superDf.diccActionConfig as any),
        modify: false,
        read: false,
      } as IDiccStructureHookActionConfig,
      topPriorityKeysAction: [
        ...superDf.topPriorityKeysAction,
      ] as Array<TKeysDiccStructureHookActionConfig>,
      topMandatoryKeysAction: [
        ...superDf.topMandatoryKeysAction,
      ] as Array<TKeysDiccStructureHookActionConfig>,
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
  constructor(baseConfig?: TStructureHookBaseConfig) {
    super("structure", baseConfig);
    baseConfig = this.util.isObject(baseConfig) ? baseConfig : ({} as any);
  }
  protected override getDefault() {
    return StructureLogicHook.getDefault();
  }
  /**... */
  protected static buildInstanceForMetadata<
    TStructureHookInstance extends StructureLogicHook = StructureLogicHook
  >(preInstance: TStructureHookInstance): TStructureHookInstance {
    const util = TwinBeeModule.util;
    let inst: TStructureHookInstance;
    if (util.isInstance(preInstance)) {
      inst = preInstance;
    } else {
      const { structureModuleFactory } =
        TwinBeeModule._globalConfig_.diccModuleFactory;
      inst = structureModuleFactory.makeModuleInstance(
        "structureHook",
        preInstance as any
      ) as any;
    }
    return inst;
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
  >(keyAction: TKeys): TStructureActionConfigFn<any>;
  /**obtiene un array de funciones de accion de acuerdo a sus claves identificadoras
   * preparadas para ser inyectadas en el middleware
   *
   * @param keysAction el array de las claves identificadoras de las funciones de accion solicitadas
   *
   * @returns el array de funciones de accion
   */
  public override getActionFnByKey<
    TKeys extends keyof TIDiccAC = keyof TIDiccAC
  >(keysAction: TKeys[]): Array<TStructureActionConfigFn<any>>;
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
    const actionConfig =
      criteriaHandler.findGlobalActionByKeyModuleAndKeyAction(
        tKeyGlobalAC as any
      );
    return [keyAction, actionConfig];
  }
  protected override buildReportHandler(
    criteriaHandler: StructureCriteriaHandler<any>,
    keyAction: keyof TIDiccAC
  ): StructureReportHandler {
    const {
      data,
      firstData,
      type,
      modifyType,
      keyPath,
      keyActionRequest,
      keyStructureContext,
    } = criteriaHandler;
    //adapta clave de contexto general a profundo
    const deep_keyModuleContext =
      StructureReportHandler.adapatKeyStructureContextToDeepKeyModuleContext(
        this.keyModule as any,
        keyStructureContext
      );
    let rH = new StructureReportHandler(this.keySrc, {
      keyRepModule: this.keyModule as any,
      keyRepModuleContext: deep_keyModuleContext as any,
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
    criteriaHandler: StructureCriteriaHandler<any>,
    keyAction: keyof TIDiccAC
  ): void {
    super.preRunAction(criteriaHandler, keyAction) as any;
    return;
  }
  public override postRunAction(
    criteriaHandler: StructureCriteriaHandler<any>,
    res: IStructureResponse
  ): void {
    super.postRunAction(criteriaHandler, res) as any;
    return;
  }
  //================================================================
  public async read(
    criteriaHandler: StructureCriteriaHandler<any>
  ): Promise<IStructureResponse> {
    return res;
    // //Desempaquetar la accion e inicializar
    // const { data, keyAction, keyPath, actionConfig } = this.adapBagForContext(
    //   criteriaHandler,
    //   "isTypeOf"
    // );
    // const { isArray, fieldType } = actionConfig;
    // let res = this.mutateResponseForMiddleware(undefined, {
    //   data,
    //   keyAction,
    //   keyPath,
    // });
    // return await this.preNext(criteriaHandler, res, next);
  }
  public async modify(
    criteriaHandler: StructureCriteriaHandler<any>
  ): Promise<IStructureResponse> {
    return res;
    // //Desempaquetar la accion e inicializar
    // const { data, keyAction, keyPath, actionConfig } = this.adapBagForContext(
    //   criteriaHandler,
    //   "isTypeOf"
    // );
    // //const { } = actionConfig;
    // let res = this.mutateResponseForMiddleware(undefined, {
    //   data,
    //   keyAction,
    //   keyPath,
    // });
    // return await this.preNext(criteriaHandler, res, next);
  }
}
