import { Trf_BagModule } from "../bag/_bag";
import { ActionModule } from "../config/module";
import { TKeyLogicContext } from "../config/shared-modules";
import { ELogicResStatusCode, IResponse } from "../reports/shared";
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
   * @param keyLogicContext el contexto logico de esta libreria
   */
  constructor(keyLogicContext: TKeyLogicContext) {
    super("hook", keyLogicContext);
  }
  protected override getDefault() {
    return LogicHook.getDefault();
  }
  public override preRunAction(
    bag: Trf_BagModule,
    keyAction: keyof TIDiccAC
  ): void {
    return;
  }
  public override postRunAction(bag: Trf_BagModule, res: IResponse): void {
    //mutar data de res a bag
    bag.data = res.data;
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
