import { CriteriaHandler } from "../criterias/_criteria-handler";
import { ActionModule } from "../modules/module";
import { TKeyLogicContext } from "../modules/shared-types";
import { ELogicResStatusCode, IResponse } from "../reports/shared-types";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**tipado refactorizado de la clase */
export type Trf_HookLib = LogicHook<any>;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *abstracta*
 *
 */
export abstract class LogicHook<TIDiccAC> extends ActionModule<TIDiccAC> {
  /** configuracion de valores predefinidos para el modulo*/
  public static readonly getDefault = () => {
    const superDf = ActionModule.getDefault();
    return {
      ...superDf,
    };
  };
  /**
   * @param keyLogicContext el contexto lógico de esta libreria
   */
  constructor(
    keyLogicContext: TKeyLogicContext,
    baseConfig?: Partial<
      Pick<
        ReturnType<LogicHook<TIDiccAC>["getDefault"]>,
        "diccActionConfig" | "topMandatoryKeysAction" | "topPriorityKeysAction"
      >
    >
  ) {
    super("hook", keyLogicContext, baseConfig);
    baseConfig = this.util.isObject(baseConfig) ? baseConfig : ({} as any);
  }
  protected override getDefault() {
    return LogicHook.getDefault();
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
    //mutar data de res a criteriaHandler
    criteriaHandler.data = res.data;
    return;
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
      cStt === ELogicResStatusCode.BAD ||
      nStt >= ELogicResStatusCode.BAD
    ) {
      stateStatus = ELogicResStatusCode.BAD;
    } else if (
      cStt === ELogicResStatusCode.WARNING ||
      nStt >= ELogicResStatusCode.WARNING
    ) {
      stateStatus = ELogicResStatusCode.WARNING;
    } else {
      stateStatus = ELogicResStatusCode.SUCCESS;
    }
    return stateStatus;
  }
}
