import { TKeyLogicContext } from "../config/shared-modules";
import { Util_Mutater } from "./_util-mutater";
import { ActionModule } from "../config/module";
import { ELogicCodeError, LogicError } from "../errors/logic-error";
import {
  ELogicResStatusCode,
  IResponse,
  TResponseForMutate,
} from "../reports/shared";
import { BagModule } from "../bag-module/_bag";
import { ReportHandler } from "../reports/_reportHandler";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**calves identificadoras del los
 * drivers (librerias) a usar
 * para validaciones genericas */
type TKeyGenericMutateDrivers = "Util" | "Lodash";
/**refactorizacion de la clase */
export type Trf_LogicMutater = LogicMutater<any>;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *abstracta*
 *
 * ...
 */
export abstract class LogicMutater<TIDiccAC> extends ActionModule<TIDiccAC> {
  /** configuracion de valores predefinidos para el modulo*/
  public static readonly getDefault = () => {
    const superDf = ActionModule.getDefault();
    return {
      ...superDf,
    };
  };
  protected override readonly util = Util_Mutater.getInstance();
  /**
   * @param keyLogicContext el contexto logico de esta libreria
   * @param keySrc indentificadora del recurso asociado a modulo
   */
  constructor(keyLogicContext: TKeyLogicContext, keySrc: string) {
    super("mutater", keyLogicContext, keySrc);
    this.util = Util_Mutater.getInstance();
  }
  protected getDefault() {
    return LogicMutater.getDefault();
  }
  /**obtenie un diccionario con funciones de validacion basicas con tipo de retorno booleano, para se usadas en modulos de accion.
   *
   * ❕Es muy recomendable usar estas funciones
   * de validacion en lugar de las que vienen
   * en la libreria util en caso de requerir
   * modificar la libreria de validacion❕
   *
   * ⚠Aqui se usa
   * @returns el diccionario con las funciones
   */
  public static getDiccGenericMutate(
    dfKeyDriver: TKeyGenericMutateDrivers = "Util"
  ) {
    const util = Util_Mutater.getInstance();
    const lodash = util.lodash;
    return {
      /**formate con trim
       * @param v el dato a formatear
       * @param keyDriver la clave identificadora de
       * la libreria a usar para validar
       * @returns el dato formateado
       */
      stringTrim: <TData>(
        v: TData,
        keyDriver: TKeyGenericMutateDrivers = dfKeyDriver
      ) => {
        let r = v as string;
        if (!util.isString(v, true)) return r;
        if (keyDriver === "Util") {
          r = r.trim();
        } else if (keyDriver === "Lodash") {
          r = r.trim();
        } else {
          throw new LogicError({
            code: ELogicCodeError.MODULE_ERROR,
            msn: `${keyDriver} is not key driver valid`,
          });
        }
        return r;
      },
    };
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
      stateStatus = ELogicResStatusCode.INVALID_DATA;
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
