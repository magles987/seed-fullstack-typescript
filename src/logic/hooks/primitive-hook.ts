import {
  PrimitiveCriteriaHandler,
  Trf_PrimitiveCriteriaHandler,
} from "../criterias/primitive-criteria-handler";
import { TPrimitiveActionConfigFn } from "../criterias/shared-types";
import { Trf_PrimitiveLogicMetadataHandler } from "../meta/primitive-metadata-handler";
import { TwinBeeModule } from "../modules/module";
import { PrimitiveReportHandler } from "../reports/primitive-report-handler";
import { IPrimitiveResponse } from "../reports/shared-types";
import { LogicHook } from "./_hook";
import {
  TKeyPrimitiveHookModuleContext,
  TPrimitiveHookBaseConfig,
} from "./shared-types";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**define el diccionario de configuraciones de acciones del hook */
export interface IDiccPrimitiveHookActionConfig {
  /**hook genérico para la lectura de documentos de un modelo*/
  read: boolean | undefined;
  /**hook genérico para la modificación de documentos de un modelo*/
  modify: boolean | undefined;
}
/**claves identificadoras del diccionario
 * de acciones de configuración */
export type TKeysDiccPrimitiveHookActionConfig =
  keyof IDiccPrimitiveHookActionConfig;
/**refactorizacion de la clase */
export type Trf_PrimitiveLogicHook = PrimitiveLogicHook<any>;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** */
export class PrimitiveLogicHook<
    TIDiccAC extends IDiccPrimitiveHookActionConfig = IDiccPrimitiveHookActionConfig
  >
  extends LogicHook<TIDiccAC>
  implements
    Record<TKeysDiccPrimitiveHookActionConfig, TPrimitiveActionConfigFn<any>>
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
      } as IDiccPrimitiveHookActionConfig,
      topPriorityKeysAction: [
        ...superDf.topPriorityKeysAction,
      ] as Array<TKeysDiccPrimitiveHookActionConfig>,
      topMandatoryKeysAction: [
        ...superDf.topMandatoryKeysAction,
      ] as Array<TKeysDiccPrimitiveHookActionConfig>,
    };
  };
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
  constructor(baseConfig?: TPrimitiveHookBaseConfig) {
    super("primitive", baseConfig);
    baseConfig = this.util.isObject(baseConfig) ? baseConfig : ({} as any);
  }
  protected override getDefault() {
    return PrimitiveLogicHook.getDefault();
  }
  /**... */
  protected static buildInstanceForMetadata<
    TPrimitiveHookInstance extends PrimitiveLogicHook = PrimitiveLogicHook
  >(preInstance: TPrimitiveHookInstance): TPrimitiveHookInstance {
    const util = TwinBeeModule.util;
    let inst: TPrimitiveHookInstance;
    if (util.isInstance(preInstance)) {
      inst = preInstance;
    } else {
      const { primitiveModuleFactory } =
        TwinBeeModule._globalConfig_.diccModuleFactory;
      inst = primitiveModuleFactory.makeModuleInstance(
        "primitiveHook",
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
  >(keyAction: TKeys): TPrimitiveActionConfigFn<any>;
  /**obtiene un array de funciones de accion de acuerdo a sus claves identificadoras
   * preparadas para ser inyectadas en el middleware
   *
   * @param keysAction el array de las claves identificadoras de las funciones de accion solicitadas
   *
   * @returns el array de funciones de accion
   */
  public override getActionFnByKey<
    TKeys extends keyof TIDiccAC = keyof TIDiccAC
  >(keysAction: TKeys[]): Array<TPrimitiveActionConfigFn<any>>;
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
    const actionConfig =
      criteriaHandler.findGlobalActionByKeyModuleAndKeyAction(
        tKeyGlobalAC as any
      );
    return [keyAction, actionConfig];
  }
  protected override buildReportHandler(
    criteriaHandler: PrimitiveCriteriaHandler<any>,
    keyAction: keyof TIDiccAC
  ): PrimitiveReportHandler {
    const { data, firstData, type, modifyType, keyActionRequest } =
      criteriaHandler;
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
    criteriaHandler: PrimitiveCriteriaHandler<any>,
    keyAction: keyof TIDiccAC
  ): void {
    super.preRunAction(criteriaHandler, keyAction as any) as any;
    return;
  }
  public override postRunAction(
    criteriaHandler: PrimitiveCriteriaHandler<any>,
    res: IPrimitiveResponse
  ): void {
    super.postRunAction(criteriaHandler, res) as any;
    return;
  }
  //================================================================
  public async read(
    criteriaHandler: PrimitiveCriteriaHandler<any>
  ): Promise<IPrimitiveResponse> {
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
    criteriaHandler: PrimitiveCriteriaHandler<any>
  ): Promise<IPrimitiveResponse> {
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
