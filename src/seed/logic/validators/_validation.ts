import { ActionModule, TKeyLogicContext } from "../modules/index-barrel";
import { CriteriaHandler } from "../criterias/index-barrel";
import { ELogicResStatusCode, IResponse } from "../reports/index-barrel";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**refactorización de la clase */
export type Trf_LogicValidation = LogicValidation<any>;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *abstract*
 *
 * clase para el modulo de validación
 */
export abstract class LogicValidation<TIDiccAC> extends ActionModule<TIDiccAC> {
  /** configuración de valores predefinidos para el modulo*/
  public static readonly getDefault = () => {
    const superDf = ActionModule.getDefault();
    return {
      ...superDf,
      status: ELogicResStatusCode.VALID_DATA, //personalizada para validación
      globalTolerance: ELogicResStatusCode.INVALID_DATA, //personalizada para validación
    };
  };
  /**
   * @param keyLogicContext el contexto lógico de esta librería
   */
  constructor(
    keyLogicContext: TKeyLogicContext,
    baseConfig?: Partial<
      Pick<
        ReturnType<LogicValidation<TIDiccAC>["getDefault"]>,
        "diccActionConfig" | "topMandatoryKeysAction" | "topPriorityKeysAction"
      >
    >
  ) {
    super("validator", keyLogicContext, baseConfig);
    baseConfig = this.util.isObject(baseConfig) ? baseConfig : ({} as any);
  }
  protected override getDefault() {
    return LogicValidation.getDefault();
  }
  public override preRunAction(
    criteriaHandler: CriteriaHandler,
    keyActionConfig: keyof TIDiccAC
  ): void {
    return;
  }
  public override postRunAction(
    criteriaHandler: CriteriaHandler,
    res: IResponse
  ): void {
    //mutar data de res a bag
    criteriaHandler.data = res.data;
    return;
  }
  /**
   * @returns el estado de respuesta reducido
   * según criterio de este modulo
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
