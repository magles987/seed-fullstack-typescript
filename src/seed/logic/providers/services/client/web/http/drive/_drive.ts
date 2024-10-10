import { IHttpResponse } from "../shared";
import { IBagForService, IGenericDriver } from "../../../../shared";
import { TKeyLogicContext } from "../../../../../../config/shared-modules";
import { Util_HttpLocalDriver } from "../_util-http-driver";
import {
  LogicError,
  ELogicCodeError,
} from "../../../../../../errors/logic-error";
import { TKeyHttpMethod } from "../../../../../../util/http-utilities";
import {
  IModifyCriteria,
  IReadCriteria,
} from "../../../../../../criterias/shared";
import { TKeyDiccHttpDrive } from "./shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**
 * descrip...
 *
 */
export abstract class HttpDrive implements IGenericDriver<IHttpResponse> {
  /**... */
  protected get keyDriver(): TKeyDiccHttpDrive {
    return this._keyDriver;
  }
  /** utilidades */
  protected util: Util_HttpLocalDriver = Util_HttpLocalDriver.getInstance();
  /** */
  constructor(private _keyDriver: TKeyDiccHttpDrive) {
    this.util = Util_HttpLocalDriver.getInstance();
  }
  /**... */
  private checkBag(bagService: IBagForService): void {
    if (!this.util.isObject(bagService)) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${bagService} is not bag repository valid`,
      });
    }
    if (!this.util.isObject(bagService.literalCriteria)) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${bagService.literalCriteria} is not criteria valid`,
      });
    }
    if (!this.util.isString(bagService.literalCriteria.keyActionRequest)) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${bagService.literalCriteria.keyActionRequest} is not key request action valid`,
      });
    }
    const keyActionFn = bagService.literalCriteria.keyActionRequest;
    if (typeof (this as any)[keyActionFn] !== "function") {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: ` ${keyActionFn} is not request action key funtion valid`,
      });
    }
    return;
  }
  /**... */
  public async runRequestFromDrive(
    bagService: IBagForService
  ): Promise<IHttpResponse> {
    try {
      this.checkBag(bagService);
      const { literalCriteria } = bagService;
      const { keyActionRequest } = literalCriteria;
    } catch (error) {

    }
    return localRes;
  }
  /**obtiene el metodo http correspondiente a la solicitud
   * @param criteria el objeto literal con los criterios de la solicutud
   * @returns el metodo http correspondiente a la solicitud
   */
  public getHttpMethod(
    criteria: IBagForService["literalCriteria"]
  ): TKeyHttpMethod {
    const { type, modifyType } = criteria as IReadCriteria & IModifyCriteria;
    let httpMethod: TKeyHttpMethod;
    if (type === "read") {
      httpMethod = "GET";
    } else if (type === "modify") {
      if (modifyType === "create") {
        httpMethod = "POST";
      } else if (modifyType === "update") {
        httpMethod = "PUT";
      } else if (modifyType === "delete") {
        httpMethod = "DELETE";
      } else {
        throw new LogicError({
          code: ELogicCodeError.MODULE_ERROR,
          msn: `${modifyType} is not modify type request logic valid`,
        });
      }
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${type} is not type request logic valid`,
      });
    }
    return httpMethod;
  }
  /**... */
  public buildUrl(criteria: IBagForService["literalCriteria"]): string { }
}
