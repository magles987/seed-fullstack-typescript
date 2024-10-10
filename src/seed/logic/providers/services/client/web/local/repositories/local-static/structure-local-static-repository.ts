import { v4 as uuidv4 } from "uuid";
import lodash from "lodash";
import {
  TKeyStructureModifyRequestController,
  TKeyStructureReadRequestController,
} from "../../../../../../../controllers/_structure-ctrl";
import {
  ELogicCodeError,
  LogicError,
} from "../../../../../../../errors/logic-error";
import { LocalStaticRepository } from "./_local-static-repository";
import { TActionFn } from "../shared";
import {
  ELogicOperatorForCondition,
  ISingleCondition,
  IStructureModifyCriteria,
  IStructureReadCriteria,
} from "../../../../../../../criterias/shared";
import { IBagForService } from "../../../../../shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**claves identificadoras de todas las acciones de request */
type TKeyFullRequest =
  | TKeyStructureReadRequestController
  | TKeyStructureModifyRequestController;
/**refactorizacion de la clase */
export type Trf_StructureLocalStaticRepository =
  StructureLocalStaticRepository<any>;

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *selfcontructor*
 *
 * ...
 */
export class StructureLocalStaticRepository<
  TKeyActionRequest extends TKeyFullRequest
>
  extends LocalStaticRepository<TKeyActionRequest>
  implements
  ReturnType<StructureLocalStaticRepository<TKeyActionRequest>["getDefault"]>,
  Record<TKeyFullRequest, TActionFn> {
  public static override readonly getDefault = () => {
    const superDf = LocalStaticRepository.getDefault();
    return {
      ...superDf,
      /**clave identificadora del campo de identificacion del registro */
      keyId: "_id",
    };
  };
  protected static override readonly getCONSTANTS = () => {
    const superCONST = LocalStaticRepository.getCONSTANTS();
    return {
      ...superCONST,
    };
  };
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
  /**
   * @param base objeto literal con valores personalizados para iniicalizar las propiedades
   * @param isInit `= true` ❕Solo para herencia❕, indica si esta clase debe iniciar las propiedaes
   */
  constructor(
    base: Partial<
      ReturnType<
        StructureLocalStaticRepository<TKeyActionRequest>["getDefault"]
      >
    > = {},
    isInit = true
  ) {
    super("structure", base, false);
    if (isInit) this.initProps(base);
  }
  protected override getDefault() {
    return StructureLocalStaticRepository.getDefault();
  }
  protected override getCONST() {
    return StructureLocalStaticRepository.getCONSTANTS();
  }
  //❗normalmente definidas en el padre, salvo que se quieran sobreescribir❗
  // /**reinicia una propiedad al valor predefinido
  //  *
  //  * @param key clave identificadora de la propiedad a reiniciar
  //  */
  // public override resetPropByKey(key: keyof ReturnType<StructureLocalStaticRepository<TKeyActionRequest>["getDefault"]>): void {
  //   const df = this.getDefault();
  //   this[key] = df[key];
  //   return;
  // }
  /**... */
  protected async selectFromTable(keyTable: string): Promise<any[]> {
    const db = this.getDB();
    if (!this.util.isLiteralObject(db)) {
      throw new LogicError({
        code: ELogicCodeError.NOT_EXIST,
        msn: `${db} is not local static data base valid`,
      });
    }
    const table = db[keyTable];
    let registers = this.util.isArray(table) ? table : [];
    return registers;
  }
  /**... */
  protected async insertIntoTable(
    registers: any,
    keyTable: string
  ): Promise<void> {
    let db = this.getDB();
    db[keyTable] = registers;
    return;
  }
  protected override async readCommon(
    criteria: IBagForService["literalCriteria"]
  ) {
    const keySrcContext = this.getKeySrcContext(this.srcSelector, criteria);
    let data = await this.selectFromTable(keySrcContext);
    data = this.util.isNotUndefinedAndNotNull(data)
      ? Array.isArray(data)
        ? data
        : [data]
      : [];
    return data;
  }
  protected override async createCommon(
    data: any,
    criteria: IBagForService["literalCriteria"]
  ) {
    const kId = this.keyId;
    const keySrcContext = this.getKeySrcContext(this.srcSelector, criteria);
    let registers = await this.selectFromTable(keySrcContext);
    const idxCData = registers.findIndex((dt) => {
      const r = dt[kId] === data[kId];
      return r;
    });
    if (idxCData > -1) return undefined; //❗ no se creó porque ya existe ❗
    //creacion de id:
    data[kId] = this.generateID(data);
    registers.push(data);
    await this.insertIntoTable(registers, keySrcContext);
    return data;
  }
  protected override async updateCommon(
    data: any,
    criteria: IBagForService["literalCriteria"]
  ) {
    const kId = this.keyId;
    const keySrcContext = this.getKeySrcContext(this.srcSelector, criteria);
    let registers = await this.selectFromTable(keySrcContext);
    const idxCData = registers.findIndex((dt) => {
      const r = dt[kId] === data[kId];
      return r;
    });
    if (idxCData === -1) return undefined; //❗no existe❗
    registers[idxCData] = data;
    await this.insertIntoTable(registers, keySrcContext);
    return data;
  }
  protected override async deleteCommon(
    data: any,
    criteria: IBagForService["literalCriteria"]
  ) {
    const kId = this.keyId;
    const keySrcContext = this.getKeySrcContext(this.srcSelector, criteria);
    let registers = await this.selectFromTable(keySrcContext);
    const idxCData = registers.findIndex((dt) => {
      const r = dt[kId] === data[kId];
      return r;
    });
    if (idxCData !== -1) {
      //elimina solo si existe
      registers.splice(idxCData, 1);
      await this.insertIntoTable(registers, keySrcContext);
    }
    //mutar data para la eliminacion:
    let dData = {};
    dData[kId] = data[kId]; //solo envia id
    return dData;
  }
  //████ Request Actions ████████████████████████████████████████████████████████████
  /**
   * descrip...
   * ____
   * @param
   * ____
   * @returns ``
   *
   */
  public async readAll(bagService: IBagForService): Promise<any[]> {
    const { literalCriteria } = bagService;
    const registers = await this.readCommon(literalCriteria);
    const data = await this.getAll(registers, literalCriteria);
    return data;
  }
  /**... */
  public async readMany(bagService: IBagForService): Promise<any[]> {
    const { literalCriteria } = bagService;
    const registers = await this.readCommon(literalCriteria);
    const data = await this.getMany(registers, literalCriteria);
    return data;
  }
  /**
   * descrip...
   * ____
   * @param
   * ____
   * @returns ``
   *
   */
  public async readOne(bagService: IBagForService) {
    let { literalCriteria } = bagService;
    const registers = await this.readCommon(literalCriteria);
    const data = await this.getOne(registers, literalCriteria);
    return data;
  }
  /**
   * descrip...
   * ____
   * @param
   * ____
   * @returns ``
   *
   */
  public async readById(bagService: IBagForService) {
    let { literalCriteria } = bagService;
    const kId = this.keyId;
    const { query } = literalCriteria as IStructureReadCriteria<any>;
    const extractQ = query.find((q) => {
      const oQ = q as ISingleCondition;
      const r =
        this.util.isObject(oQ) &&
        oQ.op === ELogicOperatorForCondition.eq &&
        oQ.keyPathForCond.includes(kId);
      return r;
    }) as ISingleCondition;
    if (extractQ === undefined) {
      throw new LogicError({
        code: ELogicCodeError.NOT_VALID,
        msn: `${LogicError.valueToString(
          query
        )} is not valid query, because not 'id' valid`,
      });
    }
    const registers = await this.readCommon(literalCriteria);
    const data = await this.getOne(registers, literalCriteria);
    return data;
  }
  /**
   * descrip...
   * ____
   * @param
   * ____
   * @returns ``
   *
   */
  public async create(bagService: IBagForService) {
    const { data, literalCriteria } = bagService;
    const { modifyType, isCreateOrUpdate } =
      literalCriteria as IStructureModifyCriteria<any>;
    if (!this.util.isLiteralObject(data)) {
      throw new LogicError({
        code: ELogicCodeError.NOT_VALID,
        msn: `document with data = ${LogicError.valueToString(
          data
        )} is not valid`,
      });
    }
    if (modifyType !== "create") {
      throw new LogicError({
        code: ELogicCodeError.NOT_VALID,
        msn: `${modifyType} is not modify type valid`,
      });
    }
    let rxData = await this.createCommon(data, literalCriteria);
    if (this.util.isUndefinedOrNull(rxData)) {
      if (isCreateOrUpdate) {
        rxData = await this.updateCommon(data, literalCriteria);
      } else {
        throw new LogicError({
          code: ELogicCodeError.EXIST,
          msn: `document with data : ${LogicError.valueToString(
            data
          )} id has not created because exist`,
        });
      }
    }
    return rxData;
  }
  /**
   * descrip...
   * ____
   * @param
   * ____
   * @returns ``
   *
   */
  public async update(bagService: IBagForService) {
    const { data, literalCriteria } = bagService;
    const { modifyType, isCreateOrUpdate } =
      literalCriteria as IStructureModifyCriteria<any>;
    if (!this.util.isObject(data)) {
      throw new LogicError({
        code: ELogicCodeError.NOT_VALID,
        msn: `document with data = ${LogicError.valueToString(
          data
        )} does not valid`,
      });
    }
    if (modifyType !== "update") {
      throw new LogicError({
        code: ELogicCodeError.NOT_VALID,
        msn: `${modifyType} is not modify type valid`,
      });
    }
    let rxData = await this.updateCommon(data, literalCriteria);
    if (this.util.isUndefinedOrNull(rxData)) {
      if (isCreateOrUpdate) {
        rxData = this.createCommon(data, literalCriteria);
      } else {
        throw new LogicError({
          code: ELogicCodeError.NOT_EXIST,
          msn: `document with data : ${LogicError.valueToString(
            data
          )} id has not updated because not exist`,
        });
      }
    }
    return rxData;
  }
  /**
   * descrip...
   * ____
   * @param
   * ____
   * @returns ``
   *
   */
  public async delete(bagService: IBagForService) {
    const { data, literalCriteria } = bagService;
    const { modifyType } = literalCriteria as IStructureModifyCriteria<any>;
    if (!this.util.isObject(data)) {
      throw new LogicError({
        code: ELogicCodeError.NOT_VALID,
        msn: `document with data = ${LogicError.valueToString(
          data
        )} does not valid`,
      });
    }
    if (modifyType !== "delete") {
      throw new LogicError({
        code: ELogicCodeError.NOT_VALID,
        msn: `${modifyType} is not modify type valid`,
      });
    }
    let rxData = await this.deleteCommon(data, literalCriteria);
    return rxData;
  }
  //████ Util Registers █████████████████████████████████████████████████████
  /**
   * genera un id de alta precision (para uso de
   * almacenamiento a diferencia del utilizadoe
   * en la clase `Util_Logic` de la logica de
   * negocio)
   *
   * ejemplo del formato que genera:
   * ````
   * "36b8f84d-df4e-4d49-b662-bcde71a8764f"
   * ````
   * ____
   * @param registers registro para verificar
   * si el id ya esta asignado
   * ____
   * @returns el id generado
   *
   */
  public generateID(registers: any) {
    let id: string;
    if (
      registers._id === undefined ||
      registers._id === null ||
      registers._id === ""
    ) {
      id = uuidv4();
    } else {
      id = registers._id;
    }
    return id;
  }
  public override async orderBy(
    registers: any[],
    criteria: IBagForService["literalCriteria"]
  ): Promise<any[]> {
    if (!this.util.isArray(registers)) return registers;
    const { sort } = criteria as IStructureReadCriteria<any>;
    if (!this.util.isArray(sort)) return registers;
    let keysField: string[] = [];
    let aSorts: any[] = [];
    sort.forEach((s) => {
      keysField.push(s[0]);
      aSorts.push(s[1]);
    });
    registers = lodash.orderBy(registers, keysField, aSorts);
    return registers;
  }
  /**... */
  public override async filterByCondition(
    registers: any[],
    criteria: IBagForService["literalCriteria"]
  ): Promise<any[]> {
    const { query } = criteria as IStructureReadCriteria<any>;
    const qAdapt = this.queryJsAdaptator;
    const data = await qAdapt.adaptQuery(
      this.keyLogicContext,
      registers,
      query
    );
    return data;
  }
  /**... */
  public override async findByCondition(
    registers: any[],
    criteria: IBagForService["literalCriteria"]
  ): Promise<any> {
    const { query } = criteria as IStructureReadCriteria<any>;
    const qAdapt = this.queryJsAdaptator;
    const data = await qAdapt.adaptQuery(
      this.keyLogicContext,
      registers,
      query
    );
    const dataOne = data[0]; //❗Solo se permite el primero❗
    return dataOne;
  }
}
