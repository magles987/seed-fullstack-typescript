import {
  TStructureActionConfigFn,
  StructureCriteriaHandler,
  Trf_StructureCriteriaHandler,
} from "../criterias/index-barrel";
import { Trf_StructureLogicMetadataHandler } from "../meta/index-barrel";
import { IStructureResponse } from "../reports/shared-types";
import { StructureReportHandler } from "../reports/structure-report-handler";
import { LogicMutater } from "./_mutater";
import { TKeyStructureDeepMutateModuleContext } from "./shared-types";
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
   */
  constructor(
    private readonly _keyStructureModuleContext: TKeyStructureDeepMutateModuleContext,
    baseConfig?: Partial<
      Pick<
        ReturnType<StructureLogicMutater<TIDiccAC>["getDefault"]>,
        "diccActionConfig" | "topMandatoryKeysAction" | "topPriorityKeysAction"
      >
    >
  ) {
    super("structure", baseConfig);
    baseConfig = this.util.isObject(baseConfig) ? baseConfig : ({} as any);
  }
  protected override getDefault() {
    return StructureLogicMutater.getDefault();
  }
  /**obtiene una función de acción de acuerdo a su clave identificadora
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
    const { data, firstData, type, modifyType, keyPath, keyActionRequest } =
      criteriaHandler;
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
}
