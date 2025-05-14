import { CriteriaHandler } from "../criterias/_criteria-handler";
import { LogicError, ELogicCodeError } from "../errors/logic-error";
import { TKeyLogicContext } from "../modules/shared-types";
import { IResponse, ELogicResStatusCode } from "../reports/shared-types";
import { ActionModule } from "../modules/module";
import { Util_Module } from "../util/util-module";
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
  /**
   * @param keyLogicContext el contexto logico de esta libreria
   */
  constructor(
    keyLogicContext: TKeyLogicContext,
    baseConfig?: Partial<
      Pick<
        ReturnType<LogicMutater<TIDiccAC>["getDefault"]>,
        "diccActionConfig" | "topMandatoryKeysAction" | "topPriorityKeysAction"
      >
    >
  ) {
    super("mutater", keyLogicContext, baseConfig);
    baseConfig = this.util.isObject(baseConfig) ? baseConfig : ({} as any);
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
    const util = Util_Module.getInstance();
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
