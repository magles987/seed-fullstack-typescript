import { TStructureActionConfigFn } from "../criterias/shared-types";
import {
  Trf_StructureCriteriaHandler,
  StructureCriteriaHandler,
} from "../criterias/structure-criteria-handler";
import { Trf_StructureLogicMetadataHandler } from "../meta/structure-metadata-handler";
import { IStructureResponse } from "../reports/shared-types";
import { StructureReportHandler } from "../reports/structure-report-handler";
import { LogicValidation } from "./_validation";
import { TKeyStructureDeepValModuleContext } from "./shared-types";
//████Interfaz y tipo████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**refactorización de la clase */
export type Trf_StructureLogicValidation = StructureLogicValidation<any>;
//████Clases████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**... */
export abstract class StructureLogicValidation<
  TIDiccAC
> extends LogicValidation<TIDiccAC> {
  /** configuración de valores predefinidos para el modulo*/
  public static readonly getDefault = () => {
    const superDf = LogicValidation.getDefault();
    return {
      ...superDf,
      isRequiredSpecialConfig: undefined,
    };
  };
  public override get metadataHandler(): Trf_StructureLogicMetadataHandler {
    return super.metadataHandler as any;
  }
  public override set metadataHandler(mH: Trf_StructureLogicMetadataHandler) {
    super.metadataHandler = mH;
  }
  public override get keyModuleContext(): Trf_StructureLogicValidation["_keyStructureModuleContext"] {
    return this._keyStructureModuleContext;
  }
  /**... */
  private _isRequiredSpecialConfig: unknown;
  public get isRequiredSpecialConfig(): unknown {
    return this._isRequiredSpecialConfig;
  }
  protected set isRequiredSpecialConfig(v: unknown) {
    this._isRequiredSpecialConfig = this.util.isObject(v)
      ? v
      : this._isRequiredSpecialConfig !== undefined
      ? this._isRequiredSpecialConfig
      : this.getDefault().isRequiredSpecialConfig;
  }
  /**
   * @param _keyStructureModuleContext contexto de acciones para este modulo estructurado
   */
  constructor(
    private readonly _keyStructureModuleContext: Extract<
      TKeyStructureDeepValModuleContext,
      "fieldVal" | "modelVal"
    >,
    baseConfig?: Partial<
      Pick<
        ReturnType<StructureLogicValidation<TIDiccAC>["getDefault"]>,
        "diccActionConfig" | "topMandatoryKeysAction" | "topPriorityKeysAction"
      >
    >
  ) {
    super("structure", baseConfig);
    baseConfig = this.util.isObject(baseConfig) ? baseConfig : ({} as any);
  }
  protected override getDefault() {
    return StructureLogicValidation.getDefault();
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
    keyActionConfig: keyof TIDiccAC
  ): void {
    super.preRunAction(criteriaHandler, keyActionConfig) as any;

    return;
  }
  public override postRunAction(
    criteriaHandler: StructureCriteriaHandler<any>,
    res: IStructureResponse
  ): void {
    super.postRunAction(criteriaHandler, res) as any;
    return;
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
    reportHandler: StructureReportHandler,
    criteriaHandler: StructureCriteriaHandler<any>,
    data: any
  ): IStructureResponse;
}
