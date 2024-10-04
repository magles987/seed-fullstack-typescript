import { ActionModule } from "../config/module";
import { TKeyLogicContext } from "../config/shared-modules";
import { LogicError, ELogicCodeError } from "../errors/logic-error";
import { ReportHandler } from "../reports/_reportHandler";
import {
  ELogicResStatusCode,
  IResponse,
  TResponseForMutate,
} from "../reports/shared";
import { Util_Hook } from "./_util-hook";
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
  protected override readonly util = Util_Hook.getInstance();
  /**
   * @param keyLogicContext el contexto logico de esta libreria
   * @param keySrc indentificadora del recurso asociado a modulo
   */
  constructor(keyLogicContext: TKeyLogicContext, keySrc: string) {
    super("hook", keyLogicContext, keySrc);
    this.util = Util_Hook.getInstance();
  }
  protected override getDefault() {
    return LogicHook.getDefault();
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
