import { TKeySrcSelector } from "../../../src/seed/logic/config/shared-modules";
import {
  ELogicCodeError,
  LogicError,
} from "../../../src/seed/logic/errors/logic-error";
import { IBagForService } from "../../../src/seed/logic/providers/services/shared";
import { Util_Module } from "../../../src/seed/logic/util/util-module";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**
 * *Singleton*
 *
 * Utilidades comunes para los proveedores de servicio
 *
 */
export class Util_Mock extends Util_Module {
  /**  Almacena la instancia única de esta clase */
  private static Util_Mock_instance: Util_Mock;
  /** */
  constructor() {
    super();
  }
  /** devuelve la instancia única de esta clase
   * ya sea que la crea o la que ya a sido creada
   *
   */
  public static getInstance(): Util_Mock {
    Util_Mock.Util_Mock_instance =
      Util_Mock.Util_Mock_instance === undefined ||
      Util_Mock.Util_Mock_instance === null
        ? new Util_Mock()
        : Util_Mock.Util_Mock_instance;
    return Util_Mock.Util_Mock_instance;
  }
  /**verifica y obtiene al función de acción de petición a ejecutar en le repositorio
   * @param repoInstance instancia del repositorio que permite la verificación
   * @param bagService el bag del servicio a verificar
   * @returns la función de acción de petición siempre y cuando la verificación
   * pase, de lo contrario lanza excepciones
   */
  public getActionRequestFn(
    repoInstance: object,
    literalCriteria: IBagForService["literalCriteria"]
  ): (
    data: any,
    literalCriteria: IBagForService["literalCriteria"]
  ) => Promise<any> {
    if (!this.isObject(literalCriteria)) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${literalCriteria} is not criteria valid`,
      });
    }
    if (!this.isString(literalCriteria.keyActionRequest)) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${literalCriteria.keyActionRequest} is not key request action valid`,
      });
    }
    const keyActionFn = literalCriteria.keyActionRequest;
    let actionFn = repoInstance[keyActionFn] as Function;
    if (typeof actionFn !== "function") {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: ` ${keyActionFn} is not request action key function valid`,
      });
    }
    actionFn = actionFn.bind(repoInstance);
    return actionFn as any;
  }
  /**verifica si la data recibida corresponde la expectativa esperada*/
  public checkRxData(
    rxData: any,
    expectDataType: IBagForService["literalCriteria"]["expectedDataType"]
  ): boolean {
    if (expectDataType === "boolean" && !this.isNumber(rxData)) return false;
    else if (expectDataType === "number" && !this.isNumber(rxData))
      return false;
    else if (expectDataType === "string" && !this.isString(rxData, true))
      return false;
    else if (expectDataType === "object" && !this.isObject(rxData, true))
      return false;
    else if (expectDataType === "array" && !this.isArray(rxData, true))
      return false;
    else return true;
  }
  /*obtiene la clave identificadora del recurso según el requerimiento (plural o singular)*/
  public getKeySrcContext(
    srcSelector: TKeySrcSelector,
    literalCriteria: IBagForService["literalCriteria"]
  ): string {
    const { p_Key, s_Key, keySrc } = literalCriteria;
    let keySrcContext: string;
    if (srcSelector === "singular") keySrcContext = s_Key as string;
    else if (srcSelector === "plural") keySrcContext = p_Key as string;
    else keySrcContext = keySrc;
    return keySrcContext;
  }
}
