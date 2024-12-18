import { IModifyCriteria } from "../../../../../../criterias/shared";
import {
  ELogicCodeError,
  LogicError,
} from "../../../../../../errors/logic-error";
import { ELogicResStatusCode } from "../../../../../../reports/shared";
import {
  EHttpRangeStatusCode,
  EHttpStatusCode,
  TKeyHttpMethod,
} from "../../../../../../util/http-utilities";
import { Util_Logic } from "../../../../../../util/util-logic";
import { IBagForService } from "../../../../shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *Singleton*
 *
 * ...
 */
export class Util_HttpDriver extends Util_Logic {
  /**  Almacena la instancia única de esta clase */
  private static Util_HttpDriver_instance: Util_HttpDriver;
  /** */
  constructor() {
    super();
  }
  /** devuelve la instancia única de esta clase
   * ya sea que la crea o la que ya a sido creada
   */
  public static getInstance(): Util_HttpDriver {
    Util_HttpDriver.Util_HttpDriver_instance =
      Util_HttpDriver.Util_HttpDriver_instance === undefined ||
      Util_HttpDriver.Util_HttpDriver_instance == null
        ? new Util_HttpDriver()
        : Util_HttpDriver.Util_HttpDriver_instance;
    return Util_HttpDriver.Util_HttpDriver_instance;
  }
  /**verifica que el bag recibido este optimo para el
   * driver, de lo contrario lanza error */
  public checkBag(bagService: IBagForService): void {
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
    return;
  }
  /**convierte código de estado http a código de esta api
   * @param httpStatusCode el código http a convertir
   * @returns el código ya convertido
   */
  public convertHttpStatusCodeToLogicStatusCode(
    httpStatusCode: EHttpStatusCode
  ): ELogicResStatusCode {
    let logicStatusCode: ELogicResStatusCode;
    if (
      httpStatusCode >= EHttpRangeStatusCode.INFO &&
      httpStatusCode < EHttpRangeStatusCode.SUCCESS
    ) {
      //especificaciones para rango de codigo (si las hay)
      logicStatusCode =
        httpStatusCode === EHttpStatusCode.PROCESSING
          ? ELogicResStatusCode.PROCESSING
          : ELogicResStatusCode.INFO;
    } else if (
      httpStatusCode >= EHttpRangeStatusCode.SUCCESS &&
      httpStatusCode < EHttpRangeStatusCode.REDIRECT
    ) {
      //especificaciones para rango de codigo (si las hay)
      logicStatusCode =
        httpStatusCode === EHttpStatusCode.CREATED
          ? ELogicResStatusCode.VALID_DATA
          : httpStatusCode === EHttpStatusCode.ACCEPTED
          ? ELogicResStatusCode.VALID_DATA
          : httpStatusCode === EHttpStatusCode.NON_AUTHORITATIVE_INFORMATION
          ? ELogicResStatusCode.WARNING
          : httpStatusCode === EHttpStatusCode.NO_CONTENT
          ? ELogicResStatusCode.VALID_DATA //❓❓WARNING_DATA❓❓
          : httpStatusCode === EHttpStatusCode.RESET_CONTENT
          ? ELogicResStatusCode.WARNING_DATA
          : httpStatusCode === EHttpStatusCode.PARTIAL_CONTENT
          ? ELogicResStatusCode.WARNING_DATA
          : ELogicResStatusCode.SUCCESS;
    } else if (
      httpStatusCode >= EHttpRangeStatusCode.REDIRECT &&
      httpStatusCode < EHttpRangeStatusCode.BAD
    ) {
      //especificaciones para rango de codigo (si las hay)
      logicStatusCode = ELogicResStatusCode.REDIRECT;
    } else if (
      httpStatusCode >= EHttpRangeStatusCode.BAD &&
      httpStatusCode < EHttpRangeStatusCode.ERROR
    ) {
      //especificaciones para rango de codigo (si las hay)
      logicStatusCode =
        httpStatusCode === EHttpStatusCode.UNAUTHORIZED
          ? ELogicResStatusCode.INVALID_USER
          : httpStatusCode === EHttpStatusCode.NOT_FOUND
          ? ELogicResStatusCode.INVALID_DATA
          : ELogicResStatusCode.BAD;
    } else {
      logicStatusCode = ELogicResStatusCode.ERROR;
    }
    return logicStatusCode;
  }
  /**convierte los datos a transferir en string para body
   *
   * @param txData
   */
  public dataToBody(txData: any): string {
    let body: string = undefined;
    if (
      typeof txData !== "undefined" &&
      typeof txData !== "function" &&
      typeof txData !== "symbol"
    ) {
      body = JSON.stringify(txData);
    }
    return body;
  }
  /**obtiene el método http correspondiente a la solicitud
   * @param criteria el objeto literal con los criterios de la solicitud
   * @returns el método http correspondiente a la solicitud
   */
  public getHttpMethodFromCriteria(
    criteria: IBagForService["literalCriteria"]
  ): TKeyHttpMethod {
    let httpMethod: TKeyHttpMethod;
    const { type } = criteria;
    if (type === "read") {
      httpMethod = "GET";
    } else if (type === "modify") {
      const { modifyType } = criteria as IModifyCriteria;
      if (modifyType === "create") httpMethod = "POST";
      else if (modifyType === "update") httpMethod = "PUT";
      else if (modifyType === "delete") httpMethod = "DELETE";
      else {
        throw new LogicError({
          code: ELogicCodeError.MODULE_ERROR,
          msn: `${modifyType} is not modify type request valid`,
        });
      }
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${type} is not type request valid`,
      });
    }
    return httpMethod;
  }
}
