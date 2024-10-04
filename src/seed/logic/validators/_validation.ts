import { z as zodLib } from "zod";
import { TKeyLogicContext } from "../config/shared-modules";
import { Util_Validator } from "./_util-validator";
import { ActionModule } from "../config/module";
import { ELogicCodeError, LogicError } from "../errors/logic-error";
import {
  ELogicResStatusCode,
  IResponse,
  TResponseForMutate,
} from "../reports/shared";
import { ReportHandler } from "../reports/_reportHandler";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**calves identificadoras del los
 * drivers (librerias) a usar
 * para validaciones genericas */
type TKeyGenericValDrivers = "Util" | "Lodash" | "Zod";
/**tipado exclusivo para cerrar el cursor de zod
 * (permite llamar los metodos parse y safeparse
 * y sus derivados) */
export type TZodSchemaForClose = zodLib.ZodSchema;
/**refactorizacion de la clase */
export type Trf_LogicValidation = LogicValidation<any>;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *abstract*
 *
 * clase para el modulo de validacion
 */
export abstract class LogicValidation<TIDiccAC> extends ActionModule<TIDiccAC> {
  /** configuracion de valores predefinidos para el modulo*/
  public static readonly getDefault = () => {
    const superDf = ActionModule.getDefault();
    return {
      ...superDf,
      status: ELogicResStatusCode.VALID_DATA, //personalizada para validacion
      globalTolerance: ELogicResStatusCode.INVALID_DATA, //personalizada para validacion
    };
  };
  /**libreria externa para manejo exclusivo de validaciones */
  protected zod = zodLib;
  protected override readonly util = Util_Validator.getInstance();
  /**
   * @param keyLogicContext el contexto logico de esta libreria
   * @param keySrc indentificadora del recurso asociado a modulo
   */
  constructor(keyLogicContext: TKeyLogicContext, keySrc: string) {
    super("validator", keyLogicContext, keySrc);
    this.util = Util_Validator.getInstance();
  }
  protected override getDefault() {
    return LogicValidation.getDefault();
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
  public static getDiccGenericVal(dfKeyDriver: TKeyGenericValDrivers = "Zod") {
    const util = Util_Validator.getInstance();
    const lodash = util.lodash;
    const zod = zodLib;
    return {
      /**valida si es `undefined`
       * @param v el valor a validar
       * @param keyDriver la clave identificadora de
       * la libreria a usar para validar
       * @returns si es valido
       */
      isUndefined: (v: any, keyDriver: TKeyGenericValDrivers = dfKeyDriver) => {
        let r = false;
        if (keyDriver === "Util") {
          r = v === undefined;
        } else if (keyDriver === "Lodash") {
          r = lodash.isUndefined(v);
        } else if (keyDriver === "Zod") {
          r = zod.undefined().safeParse(v).success;
        } else {
          throw new LogicError({
            code: ELogicCodeError.MODULE_ERROR,
            msn: `${keyDriver} is not key driver valid`,
          });
        }
        return r;
      },
      /**valida si es `null`
       * @param v el valor a validar
       * @param keyDriver la clave identificadora de
       * la libreria a usar para validar
       * @returns si es valido
       */
      isNull: (v: any, keyDriver: TKeyGenericValDrivers = dfKeyDriver) => {
        let r = false;
        if (keyDriver === "Util") {
          r = v === null;
        } else if (keyDriver === "Lodash") {
          r = lodash.isNull(v);
        } else if (keyDriver === "Zod") {
          r = zod.null().safeParse(v).success;
        } else {
          throw new LogicError({
            code: ELogicCodeError.MODULE_ERROR,
            msn: `${keyDriver} is not key driver valid`,
          });
        }
        return r;
      },
      /**valida si es `boleano`
       * @param v el valor a validar
       * @param keyDriver la clave identificadora de
       * la libreria a usar para validar
       * @returns si es valido
       */
      isBolean: (v: any, keyDriver: TKeyGenericValDrivers = dfKeyDriver) => {
        let r = false;
        if (keyDriver === "Util") {
          r = util.isBoolean(v);
        } else if (keyDriver === "Lodash") {
          r = lodash.isBoolean(v);
        } else if (keyDriver === "Zod") {
          r = zod.boolean().safeParse(v).success;
        } else {
          throw new LogicError({
            code: ELogicCodeError.MODULE_ERROR,
            msn: `${keyDriver} is not key driver valid`,
          });
        }
        return r;
      },
      /**valida si es `number`
       * @param v el valor a validar
       * @param keyDriver la clave identificadora de
       * la libreria a usar para validar
       * @returns si es valido
       */
      isNumber: (v: any, keyDriver: TKeyGenericValDrivers = dfKeyDriver) => {
        let r = false;
        if (keyDriver === "Util") {
          r = util.isNumber(v, false); // no se acepta el string-number
        } else if (keyDriver === "Lodash") {
          r = lodash.isNumber(v);
        } else if (keyDriver === "Zod") {
          r = zod.number().safeParse(v).success;
        } else {
          throw new LogicError({
            code: ELogicCodeError.MODULE_ERROR,
            msn: `${keyDriver} is not key driver valid`,
          });
        }
        return r;
      },
      /**valida si es `number` y que tipo de signo
       * (direccion  o polaridad) tiene
       * @param v el valor a validar
       * @param sign el signo (direccion  o polaridad) que deberia tener
       * @param isZeroIncluded `= false` si en la validacion incluye al 0 en ese signo
       * @param keyDriver la clave identificadora de
       * la libreria a usar para validar
       * @returns si es valido
       */
      isSignNumber: (
        v: any,
        sign: "+" | "-",
        isZeroIncluded = false,
        keyDriver: TKeyGenericValDrivers = dfKeyDriver
      ) => {
        let r = false;
        if (keyDriver === "Util") {
          r = util.isNumberSign(v, sign, isZeroIncluded); //
        } else if (keyDriver === "Lodash") {
          r = util.isNumberSign(v, sign, isZeroIncluded); // Lodash no tiene el metodo
        } else if (keyDriver === "Zod") {
          if (sign === "+") {
            r = isZeroIncluded
              ? zod.number().nonpositive().safeParse(v).success
              : zod.number().positive().safeParse(v).success;
          } else if (sign === "-") {
            r = isZeroIncluded
              ? zod.number().nonnegative().safeParse(v).success
              : zod.number().negative().safeParse(v).success;
          } else {
            throw new LogicError({
              code: ELogicCodeError.MODULE_ERROR,
              msn: `${sign} is not sign valid`,
            });
          }
        } else {
          throw new LogicError({
            code: ELogicCodeError.MODULE_ERROR,
            msn: `${keyDriver} is not key driver valid`,
          });
        }
        return r;
      },
      /**validar si es `number` y se pertenece a un rango definido
       *
       * @param v el valor a validar
       * @param range tupla de tipo `[number, number]` donde:
       *  - `range[0]` es el mínimo
       *  - `range[1]` es el máximo
       * @param isInclusive determinar si el rango es incluyente o excluyente
       * @param keyDriver la clave identificadora de
       * la libreria a usar para validar
       * @returns si es valido
       */
      isRangeNumber: (
        v: any,
        range: [number, number],
        isInclusive: boolean,
        keyDriver: TKeyGenericValDrivers = dfKeyDriver
      ) => {
        let r = false;
        let min = range[0];
        let max = range[1];
        if (keyDriver === "Util") {
          r = util.isNumberInRange(v, range, isInclusive); // rango inclusivo, no se acepta el string-number
        } else if (keyDriver === "Lodash") {
          if (isInclusive) {
            const factor = 0.0000000001; //base 10 decimales
            //modificar para que sea inclusivo (lodash no es inclusivo)
            min = min - factor;
            max = max + factor;
          }
          r = lodash.inRange(v, min, max);
        } else if (keyDriver === "Zod") {
          r = isInclusive
            ? zod.number().gte(min).lte(max).safeParse(v).success
            : zod.number().gt(min).lt(max).safeParse(v).success;
        } else {
          throw new LogicError({
            code: ELogicCodeError.MODULE_ERROR,
            msn: `${keyDriver} is not key driver valid`,
          });
        }
        return r;
      },
      /**valida si es `timestamp`
       * @param v el valor a validar
       * @param keyDriver la clave identificadora de
       * la libreria a usar para validar
       * @returns si es valido
       */
      isTimestamp: (v: any, keyDriver: TKeyGenericValDrivers = dfKeyDriver) => {
        let r = false;
        if (keyDriver === "Util") {
          r = util.isTimestamp(v);
        } else if (keyDriver === "Lodash") {
          r = util.isTimestamp(v); //lodash no tiene un metodo
        } else if (keyDriver === "Zod") {
          r = zod.number().positive().min(0).safeParse(v).success;
        } else {
          throw new LogicError({
            code: ELogicCodeError.MODULE_ERROR,
            msn: `${keyDriver} is not key driver valid`,
          });
        }
        return r;
      },
      /**valida si es `string`
       * @param v el valor a validar
       * @param keyDriver la clave identificadora de
       * la libreria a usar para validar
       * @returns si es valido
       */
      isString: (v: any, keyDriver: TKeyGenericValDrivers = dfKeyDriver) => {
        let r = false;
        if (keyDriver === "Util") {
          r = util.isString(v, true); //se acepta el string vacio
        } else if (keyDriver === "Lodash") {
          r = lodash.isString(v);
        } else if (keyDriver === "Zod") {
          r = zod.string().safeParse(v).success;
        } else {
          throw new LogicError({
            code: ELogicCodeError.MODULE_ERROR,
            msn: `${keyDriver} is not key driver valid`,
          });
        }
        return r;
      },
      /**valida si es `object`
       * @param v el valor a validar
       * @param keyDriver la clave identificadora de
       * la libreria a usar para validar
       * @returns si es valido
       */
      isObject: (v: any, keyDriver: TKeyGenericValDrivers = dfKeyDriver) => {
        let r = false;
        if (keyDriver === "Util") {
          r = util.isObject(v, true); //se acepta el objeto vacio
        } else if (keyDriver === "Lodash") {
          r = lodash.isObject(v) && !lodash.isArray();
        } else if (keyDriver === "Zod") {
          r = zod.object({}).safeParse(v).success;
        } else {
          throw new LogicError({
            code: ELogicCodeError.MODULE_ERROR,
            msn: `${keyDriver} is not key driver valid`,
          });
        }
        return r;
      },
      /**valida si es `string`
       * @param v el valor a validar
       * @param keyDriver la clave identificadora de
       * la libreria a usar para validar
       * @returns si es valido
       */
      isArray: (v: any, keyDriver: TKeyGenericValDrivers = dfKeyDriver) => {
        let r = false;
        if (keyDriver === "Util") {
          r = util.isArray(v, true); //se acepta el array vacio
        } else if (keyDriver === "Lodash") {
          r = lodash.isArray(v);
        } else if (keyDriver === "Zod") {
          r = zod.array(zod.any()).safeParse(v).success;
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
