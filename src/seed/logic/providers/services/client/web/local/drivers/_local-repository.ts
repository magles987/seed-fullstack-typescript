import {
  TKeyBasicCRUD,
  TKeyLogicContext,
} from "../../../../../../config/shared-modules";
import { TKeyDiccLocalRepository } from "./shared";
import { Util_LocalRepository } from "./_util-repository";
import { QueryJsAdaptator } from "./_query-js-adaptador";
import { IBagForService, IGenericDriver } from "../../../../shared";
import { getGlobalConfig } from "../../../../../../config/global-config";
import {
  ELogicResStatusCode,
  IExtResponse,
} from "../../../../../../reports/shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**
 *
 */
export abstract class LocalRepositoryDriver implements IGenericDriver {
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
  /**envía la petición a partir de un servicio
   *
   */
  public async sendRequestFromService(
    bagService: IBagForService
  ): Promise<IExtResponse> {
    let driverRes: IExtResponse;
    try {
      let actionFn = this.util.getActionRequestFn(this, bagService);
      const rxData = await actionFn(bagService);
      driverRes = this.buildDriverResponse(bagService.literalCriteria, rxData);
    } catch (error) {
      driverRes = this.buildDriverResponse(
        bagService.literalCriteria,
        this.util.dfValue,
        error
      );
    }
    return driverRes;
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
  /**... */
  protected buildDriverResponse(
    literalCriteria: IBagForService["literalCriteria"],
    rxData: any,
    error?: any
  ): IExtResponse {
    let driverRes = {
      data: rxData,
      status: ELogicResStatusCode.SUCCESS,
      msn: ``,
      error,
    } as IExtResponse;
    const { expectedDataType } = literalCriteria;
    const dfValue = this.util.dfValue;
    if (this.util.isUndefinedOrNull(error)) {
      //verificación de data recibida
      if (this.util.checkRxData(rxData, expectedDataType)) {
        driverRes.data = rxData;
        driverRes.status = ELogicResStatusCode.SUCCESS;
        driverRes.msn = `ok`;
      } else {
        driverRes.data = dfValue;
        driverRes.status = ELogicResStatusCode.BAD;
        driverRes.msn = `data has not been as expected`;
      }
    } else {
      driverRes.data = dfValue;
      driverRes.status = ELogicResStatusCode.ERROR;
      driverRes.error = error;
      driverRes.msn = this.util.isObject(error)
        ? (error as Error).message ?? `internal error in local driver`
        : this.util.isString(error)
        ? error
        : `internal error in local driver`;
    }
    return driverRes;
  }
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
    let data = await this.queryJsAdaptator.filterByCondition(
      registers,
      criteria
    );
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
  protected abstract readCommon(literalBag: IBagForService): Promise<any>;
  /**
   * descrip...
   * ____
   * @param
   * ____
   * @returns ``
   *
   */
  protected abstract createCommon(literalBag: IBagForService): Promise<any>;
  /**
   * descrip...
   * ____
   * @param
   * ____
   * @returns ``
   *
   */
  protected abstract updateCommon(literalBag: IBagForService): Promise<any>;
  /**
   * descrip...
   * ____
   * @param
   * ____
   * @returns ``
   *
   */
  protected abstract deleteCommon(literalBag: IBagForService): Promise<any>;
}
