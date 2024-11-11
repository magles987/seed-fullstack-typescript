import { EHttpStatusCode } from "../../../../../../util/http-utilities";
import {
  TKeyBasicCRUD,
  TKeyLogicContext,
  TKeySrcSelector,
} from "../../../../../../config/shared-modules";
import {
  ELogicCodeError,
  LogicError,
} from "../../../../../../errors/logic-error";
import { TActionFn, TKeyDiccLocalRepository } from "./shared";
import { Util_LocalRepository } from "./_util-repository";
import {
  IModifyCriteria,
  IReadCriteria,
} from "../../../../../../criterias/shared";
import { QueryJsAdaptator } from "./_query-js-adaptador";
import { IBagForService, IGenericDriver } from "../../../../shared";
import { ILocalResponse } from "../shared";
import { getGlobalConfig } from "../../../../../../config/global-config";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**
 *
 */
export abstract class LocalRepository
  implements IGenericDriver<ILocalResponse>
{
  /**configuración global */
  protected readonly _globalConfig_ = getGlobalConfig();
  /**... */
  protected get keyDriver(): TKeyDiccLocalRepository {
    return this._keyDriver;
  }
  /**clave identificadora del contexto lógico ya sea *primitive* o *structure* */
  protected get keyLogicContext(): TKeyLogicContext {
    return this._keyLogicContext;
  }
  /**... */
  protected get queryJsAdaptator(): QueryJsAdaptator {
    return this._queryJsAdaptator;
  }
  /** utilidades */
  protected util: Util_LocalRepository = Util_LocalRepository.getInstance();
  /**
   * @param _keyDriver clave identificadora del tipo de repositorio
   * @param _keyLogicContext clave identificadora del contexto logico de esta clase
   * @param _queryJsAdaptator adaptador para consultas
   */
  constructor(
    private _keyDriver: TKeyDiccLocalRepository,
    private _keyLogicContext: TKeyLogicContext,
    private _queryJsAdaptator: QueryJsAdaptator
  ) {
    this.util = Util_LocalRepository.getInstance();
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
  /**envía la petición a partir de un servicio
   *
   */
  public async sendRequestFromService(
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
          bagService?.literalCriteria,
          error
        ),
        statusText: (<Error>error).message,
      };
    }
    return localRes;
  }
  /** envío genérico de petición a traves de del driver seleccionado
   *
   * @param keyGenericSrc  recurso que identifica la coleccion de datos almacenados
   * @param keyBasicCRUD  clave identificador ade la accion CRUD basica.
   * @param txData datos a enviar.
   * @returns los datos obtenidos.
   *
   * ⚠ Las excepciones **no** son manejadas internamente ⚠
   */
  public abstract sendRequest(
    keyGenericSrc: string,
    keyBasicCRUD: TKeyBasicCRUD,
    txData: any
  ): Promise<unknown>;
  //████ handler method registers ████████████████████████████████████████████████████████████
  /**... */
  protected async getOne(
    registers: any[],
    criteria: IBagForService["literalCriteria"]
  ): Promise<any> {
    registers = Array.isArray(registers) ? registers : [registers];
    const data = await this.queryJsAdaptator.findByCondition(
      registers,
      criteria
    );
    return data;
  }
  /**... */
  protected async getMany(
    registers: any[],
    criteria: IBagForService["literalCriteria"]
  ): Promise<any[]> {
    registers = Array.isArray(registers) ? registers : [registers];
    let data = await this.queryJsAdaptator.findByCondition(registers, criteria);
    data = await this.queryJsAdaptator.orderBy(data, criteria);
    data = await this.queryJsAdaptator.pageBy(data, criteria);
    return data;
  }
  /**... */
  protected async getAll(
    registers: any[],
    criteria: IBagForService["literalCriteria"]
  ): Promise<any[]> {
    registers = Array.isArray(registers) ? registers : [registers];
    let data = await this.queryJsAdaptator.orderBy(registers, criteria);
    data = await this.queryJsAdaptator.pageBy(data, criteria);
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
  protected abstract readCommon(
    criteria: IBagForService["literalCriteria"]
  ): Promise<any>;
  /**
   * descrip...
   * ____
   * @param
   * ____
   * @returns ``
   *
   */
  protected abstract createCommon(
    data: any,
    criteria: IBagForService["literalCriteria"]
  ): Promise<any>;
  /**
   * descrip...
   * ____
   * @param
   * ____
   * @returns ``
   *
   */
  protected abstract updateCommon(
    data: any,
    criteria: IBagForService["literalCriteria"]
  ): Promise<any>;
  /**
   * descrip...
   * ____
   * @param
   * ____
   * @returns ``
   *
   */
  protected abstract deleteCommon(
    data: any,
    criteria: IBagForService["literalCriteria"]
  ): Promise<any>;
  //████ Utilitaries ████████████████████████████████████████████████████████████
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
  protected getKeySrcContext(
    srcSelector: TKeySrcSelector,
    critera: IBagForService["literalCriteria"]
  ): string {
    const { p_Key, s_Key, keySrc } = critera;
    let keySrcContext: string;
    if (srcSelector === "singular") keySrcContext = s_Key;
    else if (srcSelector === "plural") keySrcContext = p_Key;
    else keySrcContext = keySrc;
    return keySrcContext;
  }
}
