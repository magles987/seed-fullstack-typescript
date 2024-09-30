import { EHttpStatusCode } from "../../../../../../util/http-utilities";
import { TKeyLogicContext } from "../../../../../../config/shared-modules";
import {
  ELogicCodeError,
  LogicError,
} from "../../../../../../errors/logic-error";
import { ILocalResponse, TActionFn, TKeyDiccLocalRepository } from "./shared";
import { Util_LocalRepository } from "./_util-repository";
import {
  IModifyCriteria,
  IReadCriteria,
} from "../../../../../../criterias/shared";
import { QueryJsAdaptator } from "./_query-js-adaptador";
import { IBagForService, IGenericDriver } from "../../../../shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**
 *
 */
export abstract class LocalRepository
  implements IGenericDriver<ILocalResponse>
{
  /**... */
  protected get keyDriver(): TKeyDiccLocalRepository {
    return this._keyDriver;
  }
  /**clave identificadora del contexto logico ya sea *primitive* o *structure* */
  protected get keyLogicContext(): TKeyLogicContext {
    return this._keyLogicContext;
  }
  /**clave identificadora del recurso */
  protected get keySrc(): string {
    return this._keySrc;
  }
  /**... */
  protected queryJsAdaptator = QueryJsAdaptator.getInstance();
  /** utilidades */
  protected util: Util_LocalRepository = Util_LocalRepository.getInstance();
  /**
   * @param _keyDriver clave identificadora del tipo de repositorio
   * @param _keyLogicContext clave identificadora del contexto logico de esta clase
   * @param _keySrc clave identificadora del recurso
   */
  constructor(
    private _keyDriver: TKeyDiccLocalRepository,
    private _keyLogicContext: TKeyLogicContext,
    private _keySrc: string
  ) {
    this.util = Util_LocalRepository.getInstance();
  }
  /**... */
  private buildHttpResponseSimulated(
    literalCriteria: IBagForService["literalCriteria"],
    error?: any
  ): EHttpStatusCode {
    let httpCode: EHttpStatusCode;
    if (this.util.isUndefinedOrNull(error)) {
      const keyRequestType = literalCriteria.type;
      const keyModifyRequestType = (literalCriteria as IModifyCriteria)
        .modifyType;
      httpCode =
        keyRequestType === "read"
          ? EHttpStatusCode.OK
          : keyRequestType === "modify"
          ? keyModifyRequestType === "create"
            ? EHttpStatusCode.CREATED
            : keyModifyRequestType === "update"
            ? EHttpStatusCode.OK
            : EHttpStatusCode.NO_CONTENT //delete
          : EHttpStatusCode.NO_CONTENT;
    } else {
      if (error instanceof LogicError) {
        httpCode =
          error.code == ELogicCodeError.NOT_EXIST
            ? EHttpStatusCode.NOT_FOUND
            : error.code == ELogicCodeError.NOT_VALID
            ? EHttpStatusCode.FORBIDDEN
            : error.code == ELogicCodeError.OVERFLOW
            ? EHttpStatusCode.PAYLOAD_TOO_LARGE
            : EHttpStatusCode.BAD_REQUEST;
      } else {
        httpCode = EHttpStatusCode.INTERNAL_SERVER_ERROR;
      }
    }
    return httpCode;
  }
  /**... */
  private buildBodySimulated(data: any): string {
    let body: string = "";
    if (typeof data === "object" && data !== null) {
      //incluye arrays
      body = JSON.stringify(data);
    }
    return body;
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
  ): Promise<ILocalResponse> {
    let localRes = {
      body: "",
      httpStatus: EHttpStatusCode.INTERNAL_SERVER_ERROR, //comienza con logica negativa
    } as ILocalResponse;
    try {
      this.checkBag(bagService);
      const { literalCriteria } = bagService;
      const { keyActionRequest } = literalCriteria;
      let actionFn = (this as any)[keyActionRequest] as TActionFn;
      actionFn = actionFn.bind(this);
      const rxData = await actionFn(bagService);
      localRes = {
        ...localRes,
        body: this.buildBodySimulated(rxData),
        ok: true,
        httpStatus: this.buildHttpResponseSimulated(literalCriteria),
        statusText: `request to ${literalCriteria.keyActionRequest} has Succeeded`,
      };
    } catch (error) {
      localRes = {
        ...localRes,
        //body: this.buildBodySimulated(error), //empaquetado como objeto ???
        ok: false,
        httpStatus: this.buildHttpResponseSimulated(
          bagService?.literalCriteria
        ),
        statusText: (<Error>error).message,
      };
    }
    return localRes;
  }
  /**
   * ordenamiento de datos
   * ____
   * @param registers registers recibida del repositorio ❗distinta a la recibida en *bag repository*❗
   * @param criteria el bag con los datos y configuracion a procesar
   * @returns los datos ya ordenados
   */
  public abstract orderBy(
    registers: any[],
    criteria: IBagForService["literalCriteria"]
  ): Promise<any[]>;
  /**
   * paginacion basica de datos
   * ____
   * @param registers registers recibida del repositorio ❗distinta a la recibida en *bag repository*❗
   * @param criteria el bag con los datos y configuracion a procesar
   * ____
   * @returns los datos segmentados
   * por pagina
   *
   */
  public async pageBy(
    registers: any[],
    criteria: IBagForService["literalCriteria"]
  ): Promise<any[]> {
    if (!this.util.isArray(registers)) return registers;
    const {
      limit,
      targetPage: targetPageBase,
      targetPageLogic,
    } = criteria as IReadCriteria;
    let targetPage = targetPageBase;
    if (limit <= 0) {
      return []; //el limite debe ser positivo
    }
    const registersLen = registers.length;
    if (targetPageLogic === 1) {
      //convertir a logica 0
      targetPage = targetPage - 1;
    }
    targetPage =
      targetPage <= 0
        ? 0 //no puede ser menor al inicial
        : targetPage > Math.floor(registersLen / limit)
        ? Math.floor(registersLen / limit)
        : targetPage;
    let startIdx = targetPage * limit;
    let endIdx = Math.min(startIdx + limit, registersLen);
    const pageData = registers.slice(startIdx, endIdx);
    return pageData;
  }
  /**... */
  public abstract filterByCondition(
    registers: any[],
    criteria: IBagForService["literalCriteria"]
  ): Promise<any[]>;
  /**... */
  public abstract findByCondition(
    registers: any[],
    criteria: IBagForService["literalCriteria"]
  ): Promise<any>;
  //████ handler method registers ████████████████████████████████████████████████████████████

  /**... */
  public async getOne(
    registers: any[],
    criteria: IBagForService["literalCriteria"]
  ): Promise<any> {
    registers = Array.isArray(registers) ? registers : [registers];
    const data = await this.findByCondition(registers, criteria);
    return data;
  }
  /**... */
  public async getMany(
    registers: any[],
    criteria: IBagForService["literalCriteria"]
  ): Promise<any[]> {
    registers = Array.isArray(registers) ? registers : [registers];
    let data = await this.findByCondition(registers, criteria);
    data = await this.orderBy(data, criteria);
    data = await this.pageBy(data, criteria);
    return data;
  }
  /**... */
  public async getAll(
    registers: any[],
    criteria: IBagForService["literalCriteria"]
  ): Promise<any[]> {
    registers = Array.isArray(registers) ? registers : [registers];
    let data = await this.orderBy(registers, criteria);
    data = await this.pageBy(data, criteria);
    return data;
  }
  //████ common CRUD ████████████████████████████████████████████████████████████
  /**
   * descrip...
   * ____
   * @param
   * ____
   * @returns ``
   *
   */
  protected abstract readCommon(): Promise<any>;
  /**
   * descrip...
   * ____
   * @param
   * ____
   * @returns ``
   *
   */
  protected abstract createCommon(data: any): Promise<any>;
  /**
   * descrip...
   * ____
   * @param
   * ____
   * @returns ``
   *
   */
  protected abstract updateCommon(data: any): Promise<any>;
  /**
   * descrip...
   * ____
   * @param
   * ____
   * @returns ``
   *
   */
  protected abstract deleteCommon(data: any): Promise<any>;
}
