import { TTGlobalActionConfig } from "../criterias/shared-types";
import { ActionTwinBeeModule } from "../modules/module";
import { TKeyLogicContext } from "../modules/shared-types";
import { ELogicResStatusCode } from "../reports/shared-types";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** define todas las propiedades de configuración
 * de cada acción  para este modulo
 */
export interface IDiccCtrlActionConfig {
  /** */
  readRequest: boolean;
  /** */
  modifyRequest: boolean;
}
/**claves identificadoras del diccionario de acciones de configuración */
export type TKeysDiccCtrlActionConfig = keyof IDiccCtrlActionConfig;
/**refactorización de la clase*/
export type Trf_LogicController = LogicController<any>;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**
 * base controller
 */
export abstract class LogicController<
  TIDiccAC
> extends ActionTwinBeeModule<TIDiccAC> {
  public static getDefault = () => {
    const superDf = ActionTwinBeeModule.getDefault();
    return {
      ...superDf,
      status: ELogicResStatusCode.VALID_DATA, //personalizada para validación
      globalTolerance: ELogicResStatusCode.INVALID_DATA, //tolerancia a partir de invalida para validaciones
      diccActionConfig: {
        ...(superDf.diccActionConfig as any),
        readRequest: true,
        modifyRequest: true,
      } as IDiccCtrlActionConfig,
    };
  };
  /**clave identificadora del contexto */
  public abstract get keyModuleContext(): unknown;
  /**acceso externo a las utilidades de twinbee */
  public get twinBeeUtil() {
    return this.util;
  }
  /**
   * @param keyLogicContext configuración de
   * inicialización
   */
  constructor(
    keyLogicContext: TKeyLogicContext,
    baseConfig?: Partial<
      Pick<
        ReturnType<LogicController<TIDiccAC>["getDefault"]>,
        "diccActionConfig" | "topMandatoryKeysAction" | "topPriorityKeysAction"
      >
    >
  ) {
    super("controller", keyLogicContext);
    baseConfig = this.util.isObject(baseConfig) ? baseConfig : ({} as any);
  }
  protected override getDefault() {
    return LogicController.getDefault();
  }
  public override preRunAction(
    criteriaHandler: unknown,
    keyActionConfig: unknown
  ): void {
    return;
  }
  public override postRunAction(criteriaHandler: unknown, res: unknown): void {
    //mutar data de res a criteriaHandler
    criteriaHandler["data"] = res["data"];
    return;
  }
  /**propiedad especial que simula una acción genérica para el controller */
  protected abstract runCommonActionRequest(
    keyActionConfig: unknown,
    criteriaHandler: unknown
  ): Promise<unknown>;
  /**verifica si la acción es permitida ejecutarla, se gun las condiciones necesarias
   *
   *  - Debe existir la tupla de `[keyModuleContext, keyActionConfig]` bien configurada.
   *  - El diccionario de configuraciones debe estar bien configurado
   *  - La configuración asignada a esa acción no puede ser `undefined` o `null`
   *
   * @param tGlobalActionConfig tupla formada conformada por:
   *  - `[0]` clave identificadora del modulo en contexto (`keyModuleContext`).
   *  - `[1]` clave identificadora de la acción (`keyActionConfig`)
   *  - `[2]` acoin de configuración
   *
   * @returns si es o no permitido la ejecución de la acción
   */
  protected isAllowRunAction(
    tGlobalActionConfig: TTGlobalActionConfig<any>
  ): boolean {
    let r = false;
    if (!this.util.isTuple(tGlobalActionConfig, 3)) return r;
    const [keyModuleContext, keyActionConfig, actionConfig] =
      tGlobalActionConfig;
    r = this.util.isNotUndefinedAndNotNull(actionConfig);
    return r;
  }
  /**
   * @returns el estado de respuesta reducido
   * segun criterio de este modulo
   */
  public static getControlReduceStatusResponse(
    cStt: ELogicResStatusCode,
    nStt: ELogicResStatusCode
  ): ELogicResStatusCode {
    let stateStatus: ELogicResStatusCode;
    if (
      cStt === ELogicResStatusCode.ERROR ||
      nStt >= ELogicResStatusCode.ERROR
    ) {
      stateStatus = ELogicResStatusCode.ERROR;
    } else if (
      cStt === ELogicResStatusCode.INVALID_DATA ||
      nStt >= ELogicResStatusCode.BAD
    ) {
      stateStatus = ELogicResStatusCode.INVALID_DATA;
    } else if (
      cStt === ELogicResStatusCode.WARNING_DATA ||
      nStt >= ELogicResStatusCode.WARNING
    ) {
      stateStatus = ELogicResStatusCode.WARNING_DATA;
    } else {
      stateStatus = ELogicResStatusCode.VALID_DATA;
    }
    return stateStatus;
  }
}
