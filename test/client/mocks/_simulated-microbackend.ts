import { getGlobalConfig } from "../../../src/seed/logic/config/global-config";
import { TKeyLogicContext } from "../../../src/seed/logic/config/shared-modules";
import { QueryJsAdaptator } from "../../../src/seed/logic/providers/services/client/web/local/drivers/_query-js-adaptador";
import { IBagForService } from "../../../src/seed/logic/providers/services/shared";
import {
  ELogicResStatusCode,
  IDriverResponse,
} from "../../../src/seed/logic/reports/shared";
import { Util_Mock } from "./_util-mock";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**... */
export interface ISimulatedMicroBackend {
  receiveMockRequest: (
    criteria: IBagForService["literalCriteria"],
    data: any
  ) => Promise<unknown>;
}
export type Trf_SimulatedMicroBackend = SimulatedMicroBackend;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *selfconstructor*
 *
 * ...
 */
export abstract class SimulatedMicroBackend
  implements
    ReturnType<SimulatedMicroBackend["getDefault"]>,
    ISimulatedMicroBackend
{
  /**configuración global */
  protected readonly _globalConfig_ = getGlobalConfig();
  /**@returns todos los campos con sus valores predefinidos para instancias de esta clase*/
  public static readonly getDefault = () => {
    return {
      bd_collection: [] as any[],
    };
  };
  /**@returns todas las constantes a usar en instancias de esta clase*/
  protected static readonly getCONSTANTS = () => {
    return {
      //..aqui las constantes
    };
  };
  private _bd_collection: any[];
  public get bd_collection(): any[] {
    return this._bd_collection ?? this.getDefault().bd_collection;
  }
  protected set bd_collection(v: any[]) {
    this._bd_collection = this.util.isArray(v)
      ? v
      : this._bd_collection !== undefined
      ? this._bd_collection
      : this.getDefault().bd_collection;
  }
  /**clave identificadora del contexto lógico ya sea *primitive* o *structure* */
  protected get keyLogicContext(): TKeyLogicContext {
    return this._keyLogicContext;
  }
  /**... */
  protected get queryJsAdaptator(): QueryJsAdaptator {
    return this._queryJsAdaptator;
  }
  /**utilidades */
  protected util = Util_Mock.getInstance();
  /**
   * @param _keyLogicContext clave identificadora del contexto lógico de esta clase
   * @param _queryJsAdaptator adaptador para consultas
   * @param base objeto literal con valores personalizados para inicializar las propiedades
   * @param isInit `= true` ❕Solo para herencia❕, indica si esta clase debe iniciar las propiedades
   */
  constructor(
    private _keyLogicContext: TKeyLogicContext,
    private _queryJsAdaptator: QueryJsAdaptator,
    base: Partial<ReturnType<SimulatedMicroBackend["getDefault"]>> = {},
    isInit = true
  ) {
    this.util = Util_Mock.getInstance();
    if (isInit) this.initProps(base);
  }
  /**@returns todos los campos con sus valores predefinidos*/
  protected getDefault() {
    return SimulatedMicroBackend.getDefault();
  }
  /**@returns todas las constantes de la clase para las instancias*/
  protected getCONST() {
    return SimulatedMicroBackend.getCONSTANTS();
  }
  /**inicializa las propiedades de manera dinámica
   *
   * @param base objeto literal con valores personalizados para iniicalizar las propiedades
   */
  protected initProps(
    base: Partial<ReturnType<SimulatedMicroBackend["getDefault"]>>
  ): void {
    base = typeof base === "object" && base !== null ? base : {};
    for (const key in this.getDefault()) {
      this[key] = base[key];
    }
    return;
  }
  /**⚠ Reinicia todas las propiedades al valor predefinido ⚠ */
  public resetProps(): void {
    const df = this.getDefault();
    for (const key in df) {
      this[key] = df[key];
    }
    return;
  }
  /**reinicia una propiedad al valor predefinido
   *
   * @param key clave identificadora de la propiedad a reiniciar
   */
  public resetPropByKey(
    key: keyof ReturnType<SimulatedMicroBackend["getDefault"]>
  ): void {
    const df = this.getDefault();
    this[key] = df[key];
    return;
  }
  /**muta masivamente propiedades de manera dinámica
   *
   * @param base objeto literal con valores personalizados a mutar en las propiedades
   */
  public mutateProps(
    base: Partial<ReturnType<SimulatedMicroBackend["getDefault"]>>
  ): void {
    base = typeof base === "object" && base !== null ? base : ({} as any);
    for (const key in base) {
      this[key] = base[key];
    }
    return;
  }
  /**... */
  public async receiveMockRequest(
    literalCriteria: IBagForService["literalCriteria"],
    data: any
  ): Promise<IDriverResponse> {
    let driverRes: IDriverResponse;
    try {
      let actionFn = this.util.getActionRequestFn(this, literalCriteria);
      const rxData = await actionFn(data, literalCriteria);
      driverRes = this.buildDriverResponse(literalCriteria, rxData);
    } catch (error) {
      driverRes = this.buildDriverResponse(
        literalCriteria,
        this.util.dfValue,
        error
      );
    }
    return driverRes;
  }
  /**... */
  protected buildDriverResponse(
    literalCriteria: IBagForService["literalCriteria"],
    rxData: any,
    error?: any
  ): IDriverResponse {
    let driverRes = {
      data: rxData,
      status: ELogicResStatusCode.SUCCESS,
      msn: ``,
      error,
    } as IDriverResponse;
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
    criteria: IBagForService["literalCriteria"],
    data: any
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
    criteria: IBagForService["literalCriteria"],
    data: any
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
    criteria: IBagForService["literalCriteria"],
    data: any
  ): Promise<any>;
}
