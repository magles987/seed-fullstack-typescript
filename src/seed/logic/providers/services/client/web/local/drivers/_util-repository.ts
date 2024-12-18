import { TKeySrcSelector } from "../../../../../../config/shared-modules";
import { IModifyCriteria } from "../../../../../../criterias/shared";
import {
  ELogicCodeError,
  LogicError,
} from "../../../../../../errors/logic-error";
import { EHttpStatusCode } from "../../../../../../util/http-utilities";
import { Util_Logic } from "../../../../../../util/util-logic";
import { IBagForService } from "../../../../shared";
import { TActionFn } from "./shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *Singleton*
 *
 * ...
 */
export class Util_LocalRepository extends Util_Logic {
  /**  Almacena la instancia única de esta clase */
  private static Util_LocalRepository_instance: Util_LocalRepository;
  /** */
  constructor() {
    super();
  }
  /** devuelve la instancia única de esta clase
   * ya sea que la crea o la que ya a sido creada
   */
  public static getInstance(): Util_LocalRepository {
    Util_LocalRepository.Util_LocalRepository_instance =
      Util_LocalRepository.Util_LocalRepository_instance === undefined ||
      Util_LocalRepository.Util_LocalRepository_instance == null
        ? new Util_LocalRepository()
        : Util_LocalRepository.Util_LocalRepository_instance;
    return Util_LocalRepository.Util_LocalRepository_instance;
  }
  /**verifica y obtiene al función de acción de petición a ejecutar en le repositorio
   * @param repoInstance instancia del repositorio que permite la verificación
   * @param bagService el bag del servicio a verificar
   * @returns la función de acción de petición siempre y cuando la verificación
   * pase, de lo contrario lanza excepciones
   */
  public getActionRequestFn(
    repoInstance: object,
    bagService: IBagForService
  ): TActionFn {
    if (!this.isObject(bagService)) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${bagService} is not bag repository valid`,
      });
    }
    if (!this.isObject(bagService.literalCriteria)) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${bagService.literalCriteria} is not criteria valid`,
      });
    }
    if (!this.isString(bagService.literalCriteria.keyActionRequest)) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${bagService.literalCriteria.keyActionRequest} is not key request action valid`,
      });
    }
    const keyActionFn = bagService.literalCriteria.keyActionRequest;
    let actionFn = repoInstance[keyActionFn] as TActionFn;
    if (typeof actionFn !== "function") {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: ` ${keyActionFn} is not request action key function valid`,
      });
    }
    actionFn = actionFn.bind(repoInstance);
    return actionFn;
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
    if (srcSelector === "singular") keySrcContext = s_Key;
    else if (srcSelector === "plural") keySrcContext = p_Key;
    else keySrcContext = keySrc;
    return keySrcContext;
  }
}
