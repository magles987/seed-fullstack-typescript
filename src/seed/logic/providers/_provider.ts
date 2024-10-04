import { BagModule } from "../bag-module/_bag";
import { ActionModule } from "../config/module";
import { TKeyLogicContext } from "../config/shared-modules";
import { LogicError, ELogicCodeError } from "../errors/logic-error";
import { ReportHandler } from "../reports/_reportHandler";
import {
  ELogicResStatusCode,
  IResponse,
  TResponseForMutate,
} from "../reports/shared";
import { Util_Provider } from "./_util-provider";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** */
export abstract class LogicProvider<TIDiccAC> extends ActionModule<TIDiccAC> {
  /** configuracion de valores predefinidos para el modulo*/
  public static readonly getDefault = () => {
    const superDf = ActionModule.getDefault();
    return {
      ...superDf,
      globalTolerance: ELogicResStatusCode.INVALID_DATA, //personalizada para provider
    };
  };
  protected override readonly util = Util_Provider.getInstance();
  /**
   * @param keyLogicContext el contexto logico de esta libreria
   * @param keySrc indentificadora del recurso asociado a modulo
   */
  constructor(keyLogicContext: TKeyLogicContext, keySrc: string) {
    super("provider", keyLogicContext, keySrc);
    this.util = Util_Provider.getInstance();
  }
  protected override getDefault() {
    return LogicProvider.getDefault();
  }
  /**
   * diccionario de configuracion de acciones predefinido
   * para este modulo
   * ____
   * ⚠ Requiere ser de alcance publico para
   * tipar los diccionarios de acciones de
   * configuracion fuera de este modulo.
   */
  public get dfDiccActionConfig(): TIDiccAC {
    const df = this.getDefault();
    const r = df.dfDiccActionConfig as TIDiccAC;
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
