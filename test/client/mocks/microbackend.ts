import {
  TKeyLogicContext,
  TKeySrcSelector,
} from "../../../src/logic/modules/shared-types";
import {
  ELogicResStatusCode,
  IDriverResponse,
} from "../../../src/logic/reports/shared-types";
import { QueryTool } from "../../../src/logic/util/query-tool";
import {
  ELogicCodeError,
  LogicError,
} from "../../../src/logic/errors/logic-error";
import {
  buildIdByStrategy,
  isIdValid,
  TOptionForAutoincrement,
} from "../../../src/logic/util/default-generators-id-fn";
import {
  TPrimitiveMockCustomQueryDriverFn,
  TStructureMockCustomQueryDriverFn,
} from "./shared-types";
import {
  TPrimitiveLiteralCriteriaUnion,
  TPrimitiveModifyLiteralCriteria,
  TPrimitiveReadLiteralCriteria,
  TStructureLiteralCriteriaUnion,
  TStructureModifyLiteralCriteria,
  TStructureReadLiteralCriteria,
} from "../../../src/logic/providers/_drivers/shared-types";
import { Module } from "../../../src/logic/modules/module";
import { Util_Module } from "../../../src/logic/util/util-module";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
export type Trf_MicroBackend = MicroBackend;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *selfconstructor*
 *
 * ...
 */
export class MicroBackend
  extends Module
  implements ReturnType<MicroBackend["getDefault"]>
{
  /**@returns todos los campos con sus valores predefinidos para instancias de esta clase*/
  public static readonly getDefault = () => {
    const superDf = Module.getDefault();
    const util = Util_Module.getInstance();
    return {
      ...superDf,
      /**base de datos dummy */
      db_collection: [] as any[],
      /**determina que tipo de clave identificadora de recurso usar */
      srcSelector: "plural" as TKeySrcSelector,
      /**clave identificadora del campo de identificación del registro */
      keyId: Module._globalConfig_.keyId,
      /**función de consulta personalizada */
      customQueryFn: undefined as unknown as
        | TPrimitiveMockCustomQueryDriverFn
        | TStructureMockCustomQueryDriverFn,
    };
  };
  /**@returns todas las constantes a usar en instancias de esta clase*/
  protected static readonly getCONSTANTS = () => {
    return {
      //..aqui las constantes
    };
  };
  /**herramientas para las queries */
  protected queryTool = QueryTool.getInstance();
  private _db_collection: any[];
  public get db_collection(): any[] {
    return this._db_collection ?? this.getDefault().db_collection;
  }
  protected set db_collection(v: any[]) {
    this._db_collection = this.util.isArray(v)
      ? v
      : this._db_collection !== undefined
      ? this._db_collection
      : this.getDefault().db_collection;
  }
  /** el nombre de identificación del driver (debe ser único entre grupos) */
  private _srcSelector: TKeySrcSelector;
  public get srcSelector(): TKeySrcSelector {
    return this._srcSelector;
  }
  protected set srcSelector(v: TKeySrcSelector) {
    this._srcSelector =
      v === "plural" || v === "singular"
        ? v
        : this._srcSelector !== undefined
        ? this._srcSelector
        : this.getDefault().srcSelector;
  }
  private _keyId: string;
  public get keyId(): string {
    return this._keyId;
  }
  protected set keyId(v: string) {
    this._keyId = this.util.isString(v)
      ? v
      : this._keyId !== undefined
      ? this._keyId
      : this.getDefault().keyId;
  }
  private _customQueryFn = undefined as unknown as ReturnType<
    MicroBackend["getDefault"]
  >["customQueryFn"];
  public get customQueryFn() {
    return this._customQueryFn;
  }
  public set customQueryFn(v) {
    this._customQueryFn = this.util.isFunction(v)
      ? v
      : MicroBackend.getDefault().customQueryFn;
  }
  /**clave identificadora del contexto lógico ya sea *primitive* o *structure* */
  protected get keyLogicContext(): TKeyLogicContext {
    return this._keyLogicContext;
  }
  /**
   * @param _keyLogicContext clave identificadora del contexto lógico de esta clase
   * @param base objeto literal con valores personalizados para inicializar las propiedades
   * @param isInit `= true` ❕Solo para herencia❕, indica si esta clase debe iniciar las propiedades
   */
  constructor(
    private _keyLogicContext: TKeyLogicContext,
    base: Partial<ReturnType<MicroBackend["getDefault"]>> = {},
    isInit = true
  ) {
    super("test");
    this.queryTool = QueryTool.getInstance();
    if (isInit) this.initProps(base);
  }
  /**@returns todos los campos con sus valores predefinidos*/
  protected getDefault() {
    return MicroBackend.getDefault();
  }
  /**@returns todas las constantes de la clase para las instancias*/
  protected getCONST() {
    return MicroBackend.getCONSTANTS();
  }
  /**inicializa las propiedades de manera dinámica
   *
   * @param base objeto literal con valores personalizados para iniicalizar las propiedades
   */
  protected initProps(
    base: Partial<ReturnType<MicroBackend["getDefault"]>>
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
    key: keyof ReturnType<MicroBackend["getDefault"]>
  ): void {
    const df = this.getDefault();
    this[key as any] = df[key] as any;
    return;
  }
  /**muta masivamente propiedades de manera dinámica
   *
   * @param base objeto literal con valores personalizados a mutar en las propiedades
   */
  public mutateProps(
    base: Partial<ReturnType<MicroBackend["getDefault"]>>
  ): void {
    base = typeof base === "object" && base !== null ? base : ({} as any);
    for (const key in base) {
      this[key] = base[key];
    }
    return;
  }
  /**... */
  protected async getData(): Promise<typeof this._db_collection> {
    return this._db_collection;
  }
  /**... */
  protected async setData(
    registers: typeof this._db_collection
  ): Promise<void> {
    this._db_collection = registers;
    return;
  }
  /**verifica si la data recibida corresponde la expectativa esperada*/
  protected checkRxData(
    rxData: any,
    expectDataType: (
      | TPrimitiveLiteralCriteriaUnion
      | TStructureLiteralCriteriaUnion<any>
    )["expectedDataType"]
  ): boolean {
    if (expectDataType === "boolean" && !this.util.isBoolean(rxData))
      return false;
    else if (expectDataType === "number" && !this.util.isNumber(rxData))
      return false;
    else if (expectDataType === "string" && !this.util.isString(rxData, true))
      return false;
    else if (expectDataType === "object" && !this.util.isObject(rxData, true))
      return false;
    else if (expectDataType === "array" && !this.util.isArray(rxData, true))
      return false;
    else return true;
  }
  /**... */
  public async receiveMockRequest(
    literalCriteria:
      | TPrimitiveLiteralCriteriaUnion
      | TStructureLiteralCriteriaUnion<any>
  ): Promise<IDriverResponse> {
    let driverRes: IDriverResponse;
    try {
      let rxData = await this.selectCRUDRun(literalCriteria);
      driverRes = this.buildMicrobackendResponse(literalCriteria, rxData);
    } catch (error) {
      driverRes = this.buildMicrobackendResponse(
        literalCriteria,
        this.util.dfValue,
        error
      );
    }
    return driverRes;
  }
  /**construir id si es necesario */
  protected buildStructureMockId(
    registers: any[],
    possibleId: any,
    customValidFn?: Function
  ): any {
    const { strategyForIdBuild } = this._globalConfig_;
    const isId = isIdValid(possibleId, customValidFn as any);
    if (!isId) {
      let id;
      if (strategyForIdBuild === "df_autoincrement") {
        const kId = this.keyId;
        //autoincremento tiene tratamiento especial
        let ids = registers.map((reg) => reg[kId]).sort(); //ordenamiento básico
        const option = {
          lastId: this.util.getArrayItem(ids, -1),
        } as TOptionForAutoincrement;
        id = buildIdByStrategy(strategyForIdBuild, option);
      } else {
        id = buildIdByStrategy(strategyForIdBuild);
      }
      return id;
    }
    return possibleId;
  }
  /**... */
  protected buildMicrobackendResponse(
    literalCriteria:
      | TPrimitiveLiteralCriteriaUnion
      | TStructureLiteralCriteriaUnion<any>,
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
      if (this.checkRxData(rxData, expectedDataType)) {
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
  //████ CRUD by Bag ████████████████████████████████████████████████████████████
  /**... */
  protected async selectCRUDRun(
    literalCriteria:
      | TPrimitiveLiteralCriteriaUnion
      | TStructureLiteralCriteriaUnion<any>
  ): Promise<any> {
    const { type, keyLogicContext } = literalCriteria;
    let rxData: any;
    if (keyLogicContext === "primitive") {
      if (type === "read") {
        const {} = literalCriteria as TPrimitiveReadLiteralCriteria;
        rxData = await this.primitiveReadByLiteralCriteria(
          literalCriteria as TPrimitiveReadLiteralCriteria
        );
      } else if (type === "modify") {
        const { modifyType } =
          literalCriteria as TPrimitiveModifyLiteralCriteria;
        if (modifyType === "create") {
          rxData = await this.primitiveCreateByLiteralCriteria(
            literalCriteria as TPrimitiveModifyLiteralCriteria
          );
        } else if (modifyType === "update") {
          rxData = await this.primitiveUpdateByLiteralCriteria(
            literalCriteria as TPrimitiveModifyLiteralCriteria
          );
        } else if (modifyType === "delete") {
          rxData = await this.primitiveDeleteByLiteralCriteria(
            literalCriteria as TPrimitiveModifyLiteralCriteria
          );
        } else {
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
    } else if (keyLogicContext === "structure") {
      if (type === "read") {
        const {} = literalCriteria as TStructureReadLiteralCriteria<any>;
        rxData = await this.structureReadByBagLiteralCriteria(
          literalCriteria as TStructureReadLiteralCriteria<any>
        );
      } else if (type === "modify") {
        const { modifyType } =
          literalCriteria as TStructureModifyLiteralCriteria<any>;
        if (modifyType === "create") {
          rxData = await this.structureCreateByLiteralCriteria(
            literalCriteria as TStructureModifyLiteralCriteria<any>
          );
        } else if (modifyType === "update") {
          rxData = await this.structureUpdateByLiteralCriteria(
            literalCriteria as TStructureModifyLiteralCriteria<any>
          );
        } else if (modifyType === "delete") {
          rxData = await this.structureDeleteByLiteralCriteria(
            literalCriteria as TStructureModifyLiteralCriteria<any>
          );
        } else {
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
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${keyLogicContext} is not  type request`,
      });
    }
    return rxData;
  }
  protected async primitiveReadByLiteralCriteria(
    literalCriteria: TPrimitiveReadLiteralCriteria
  ) {
    let { data } = literalCriteria;
    let registers = await this.getData();
    registers = this.util.isNotUndefinedAndNotNull(registers)
      ? Array.isArray(registers)
        ? registers
        : [registers]
      : [];
    //selecciona el tipo de lectura:
    if (this.util.isFunction(this.customQueryFn)) {
      //personalizada
      const fn = this.customQueryFn;
      registers = await fn(this, literalCriteria as any, registers);
    } else {
      //estándar
    }
    //verificación para ordenamiento y paginado
    if (
      this.util.isArray(registers) &&
      literalCriteria.expectedDataType === "array"
    ) {
      registers = await this.queryTool.primitiveOrderByBagCriteria(
        registers,
        literalCriteria
      );
      registers = await this.queryTool.primitivePageByBagCriteria(
        registers,
        literalCriteria
      );
    }
    data = registers;
    return data;
  }
  protected async primitiveCreateByLiteralCriteria(
    literalCriteria: TPrimitiveModifyLiteralCriteria
  ) {
    let { data } = literalCriteria;
    let registers = (await this.getData()) as any[];
    registers = Array.isArray(registers) ? registers : [registers];
    const idxCData = registers.findIndex((dt) =>
      this.util.isEquivalentTo([dt, data])
    );
    //verificar si ya esta creado
    const isExist = idxCData > -1;
    if (isExist) {
      const { isCreateOrUpdate } =
        literalCriteria as TPrimitiveModifyLiteralCriteria;
      if (!isCreateOrUpdate) {
        //ya esta creado y no se permite su actualización
        throw new LogicError({
          code: ELogicCodeError.EXIST,
          msn: `document with data : ${LogicError.valueToString(
            data
          )} id has not created because exist`,
        });
      }
      return await this.primitiveUpdateByLiteralCriteria(literalCriteria);
    }
    //selecciona el tipo de creación:
    if (this.util.isFunction(this.customQueryFn)) {
      //personalizada
      const fn = this.customQueryFn;
      registers = await fn(this, literalCriteria as any, registers);
    } else {
      //estándar
      registers.push(data);
    }
    await this.setData(registers);
    return data;
  }
  protected async primitiveUpdateByLiteralCriteria(
    literalCriteria: TPrimitiveModifyLiteralCriteria
  ) {
    let { data } = literalCriteria;
    let registers = await this.getData();
    const idxCData = registers.findIndex((dt) =>
      this.util.isEquivalentTo([dt, data], {})
    );
    //verificar si no esta creado
    const isExist = idxCData > -1;
    if (!isExist) {
      const { isCreateOrUpdate } = literalCriteria;
      if (!isCreateOrUpdate) {
        //no esta creado y no se permite su creación
        throw new LogicError({
          code: ELogicCodeError.NOT_EXIST,
          msn: `document with data : ${LogicError.valueToString(
            data
          )} id has not updated because not exist`,
        });
      }
      return await this.primitiveCreateByLiteralCriteria(literalCriteria);
    }
    //selecciona el tipo de actualización:
    if (this.util.isFunction(this.customQueryFn)) {
      //personalizada
      const fn = this.customQueryFn;
      registers = await fn(this, literalCriteria as any, registers);
    } else {
      //estándar
      registers[idxCData] = data;
    }
    await this.setData(registers);
    return data;
  }
  protected async primitiveDeleteByLiteralCriteria(
    literalCriteria: TPrimitiveModifyLiteralCriteria
  ) {
    let { data } = literalCriteria;
    let registers = (await this.getData()) as any[];
    registers = Array.isArray(registers) ? registers : [registers];
    const fIdx = registers.findIndex((dt) =>
      this.util.isEquivalentTo([dt, data], {})
    );
    const isExist = fIdx >= 0;
    if (!isExist) return data;
    //selecciona el tipo de eliminación:
    if (this.util.isFunction(this.customQueryFn)) {
      //personalizada
      const fn = this.customQueryFn;
      registers = await fn(this, literalCriteria as any, registers);
    } else {
      //estándar
      registers.splice(fIdx, 1); //Eliminación
    }
    await this.setData(registers);
    return data;
  }
  protected async structureReadByBagLiteralCriteria(
    literalCriteria: TStructureReadLiteralCriteria<any>
  ) {
    let { data } = literalCriteria;
    let registers = await this.getData();
    registers = this.util.isNotUndefinedAndNotNull(registers)
      ? Array.isArray(registers)
        ? registers
        : [registers]
      : [];
    //selecciona el tipo de lectura:
    if (this.util.isFunction(this.customQueryFn)) {
      //personalizada
      const fn = this.customQueryFn;
      registers = await fn(this, literalCriteria as any, registers);
    } else {
      //estándar
    }
    //verificación para ordenamiento y paginado
    if (
      this.util.isArray(registers) &&
      literalCriteria.expectedDataType === "array"
    ) {
      registers = await this.queryTool.structureOrderByBagCriteria(
        registers,
        literalCriteria
      );
      registers = await this.queryTool.structurePageByBagCriteria(
        registers,
        literalCriteria
      );
    }
    data = registers;
    return data;
  }
  protected async structureCreateByLiteralCriteria(
    literalCriteria: TStructureModifyLiteralCriteria<any>
  ) {
    let { data } = literalCriteria;
    const kId = this.keyId;
    if (!this.util.isObject(data)) {
      throw new LogicError({
        code: ELogicCodeError.NOT_VALID,
        msn: `document with data = ${LogicError.valueToString(
          data
        )} does not valid`,
      });
    }
    let registers = (await this.getData()) as any[];
    registers = Array.isArray(registers) ? registers : [registers];
    const idxCData = registers.findIndex((dt) => dt[kId] === data[kId]);
    //verificar si ya esta creado
    const isExist = idxCData > -1;
    if (isExist) {
      const { isCreateOrUpdate } = literalCriteria;
      if (!isCreateOrUpdate) {
        //ya esta creado y no se permite su actualización
        throw new LogicError({
          code: ELogicCodeError.EXIST,
          msn: `document with data : ${LogicError.valueToString(
            data
          )} id has not created because exist`,
        });
      }
      return await this.structureUpdateByLiteralCriteria(literalCriteria);
    }
    //selecciona el tipo de creación:
    if (this.util.isFunction(this.customQueryFn)) {
      //personalizada
      const fn = this.customQueryFn;
      registers = await fn(this, literalCriteria as any, registers);
    } else {
      //estándar
      //creación de id:
      data[kId] = this.buildStructureMockId(registers, data[kId]);
      registers.push(data);
    }
    await this.setData(registers);
    return data;
  }
  protected async structureUpdateByLiteralCriteria(
    literalCriteria: TStructureModifyLiteralCriteria<any>
  ) {
    let { data } = literalCriteria;
    const kId = this.keyId;
    if (!this.util.isObject(data)) {
      throw new LogicError({
        code: ELogicCodeError.NOT_VALID,
        msn: `document with data = ${LogicError.valueToString(
          data
        )} does not valid`,
      });
    }
    let registers = (await this.getData()) as any[];
    registers = Array.isArray(registers) ? registers : [registers];
    const idxCData = registers.findIndex((dt) => dt[kId] === data[kId]);
    const isExist = idxCData > -1;
    //verificar si no esta creado
    if (!isExist) {
      const { isCreateOrUpdate } = literalCriteria;
      if (!isCreateOrUpdate) {
        //no esta creado y no se permite su creación
        throw new LogicError({
          code: ELogicCodeError.NOT_EXIST,
          msn: `document with data : ${LogicError.valueToString(
            data
          )} id has not updated because not exist`,
        });
      }
      return await this.structureCreateByLiteralCriteria(literalCriteria);
    }
    //selecciona el tipo de actualización:
    if (this.util.isFunction(this.customQueryFn)) {
      //personalizada
      const fn = this.customQueryFn;
      registers = await fn(this, literalCriteria as any, registers);
    } else {
      //estándar
      registers[idxCData] = data;
    }
    await this.setData(registers);
    return data;
  }
  protected async structureDeleteByLiteralCriteria(
    literalCriteria: TStructureModifyLiteralCriteria<any>
  ) {
    let { data } = literalCriteria;
    const kId = this.keyId;
    if (!this.util.isObject(data)) {
      throw new LogicError({
        code: ELogicCodeError.NOT_VALID,
        msn: `document with data = ${LogicError.valueToString(
          data
        )} does not valid`,
      });
    }
    let registers = (await this.getData()) as any[];
    registers = Array.isArray(registers) ? registers : [registers];
    const idxCData = registers.findIndex((dt) => dt[kId] === data[kId]);
    const isExist = idxCData > -1;
    /**data especial de eliminación */
    let dData = {};
    dData[kId] = data[kId]; //solo envía id
    if (!isExist) return dData; //ya está eliminado
    //selecciona el tipo de eliminación:
    if (this.util.isFunction(this.customQueryFn)) {
      //personalizada
      const fn = this.customQueryFn;
      registers = await fn(this, literalCriteria as any, registers);
    } else {
      //estándar
      registers.splice(idxCData, 1);
    }
    await this.setData(registers);
    data = dData; //mutar data ya eliminada
    return data;
  }
}
