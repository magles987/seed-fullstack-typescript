import { v4 as uuidv4 } from "uuid";
import lodash from "lodash";
import {
  ELogicCodeError,
  LogicError,
} from "../../../../../../../errors/logic-error";
import { LocalStorageRepository } from "./_local-storage-repository";
import {
  TKeyStructureModifyRequestController,
  TKeyStructureReadRequestController,
} from "../../../../../../../controllers/_structure-ctrl";
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
  | TKeyStructureModifyRequestController; /**refactorizacion de la clase */
export type Trf_StructureLocalStorageRepository =
  StructureLocalStorageRepository<any>;

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *selfcontructor*
 *
 * ...
 */
export class StructureLocalStorageRepository<
    TKeyActionRequest extends TKeyFullRequest
  >
  extends LocalStorageRepository<TKeyActionRequest>
  implements
    ReturnType<
      StructureLocalStorageRepository<TKeyActionRequest>["getDefault"]
    >,
    Record<TKeyFullRequest, TActionFn>
{
  public static override readonly getDefault = () => {
    const superDf = LocalStorageRepository.getDefault();
    return {
      ...superDf,
      /**clave identificadora del campo de identificacion del registro */
      keyId: "_id",
    };
  };
  protected static override readonly getCONSTANTS = () => {
    const superCONST = LocalStorageRepository.getCONSTANTS();
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
   * @param keySrc clave identificadora del recurso
   * @param base objeto literal con valores personalizados para iniicalizar las propiedades
   * @param isInit `= true` ❕Solo para herencia❕, indica si esta clase debe iniciar las propiedaes
   */
  constructor(
    keySrc: string,
    base: Partial<
      ReturnType<
        StructureLocalStorageRepository<TKeyActionRequest>["getDefault"]
      >
    > = {},
    isInit = true
  ) {
    super("structure", keySrc, base, false);
    if (isInit) this.initProps(base);
  }
  protected override getDefault() {
    return StructureLocalStorageRepository.getDefault();
  }
  protected override getCONST() {
    return StructureLocalStorageRepository.getCONSTANTS();
  }
  //❗normalmente definidas en el padre, salvo que se quieran sobreescribir❗
  // /**reinicia una propiedad al valor predefinido
  //  *
  //  * @param key clave identificadora de la propiedad a reiniciar
  //  */
  // public override resetPropByKey(key: keyof ReturnType<StructureLocalStorageRepository<TKeyActionRequest>["getDefault"]>): void {
  //   const df = this.getDefault();
  //   this[key] = df[key];
  //   return;
  // }
  //████ common snippet for action request  ████████████████████████
  protected override async readCommon() {
    let data = await this.getData();
    data = this.util.isNotUndefinedAndNotNull(data)
      ? Array.isArray(data)
        ? data
        : [data]
      : [];
    return data;
  }
  protected override async createCommon(data: any) {
    const kId = this.keyId;
    let currentData = await this.getData();
    const idxCData = currentData.findIndex((dt) => {
      const r = dt[kId] === data[kId];
      return r;
    });
    if (idxCData > -1) return undefined; //❗ no se creó porque ya existe ❗
    //creacion de id:
    data[kId] = this.generateID(data);
    currentData.push(data);
    await this.setData(currentData);
    return data;
  }
  protected override async updateCommon(data: any) {
    const kId = this.keyId;
    let currentData = await this.getData();
    const idxCData = currentData.findIndex((dt) => {
      const r = dt[kId] === data[kId];
      return r;
    });
    if (idxCData === -1) return undefined; //❗no existe❗
    currentData[idxCData] = data;
    await this.setData(currentData);
    return data;
  }
  protected override async deleteCommon(data: any) {
    const kId = this.keyId;
    let currentData = await this.getData();
    const idxCData = currentData.findIndex((dt) => {
      const r = dt[kId] === data[kId];
      return r;
    });
    if (idxCData > 0) {
      //elimina solo si existe
      currentData.splice(idxCData, 1);
      await this.setData(currentData);
    }
    return data;
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
    const registers = await this.readCommon();
    const data = await this.getAll(registers, literalCriteria);
    return data;
  }
  /**... */
  public async readMany(bagService: IBagForService): Promise<any[]> {
    const { literalCriteria } = bagService;
    const registers = await this.readCommon();
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
    const registers = await this.readCommon();
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
    const registers = await this.readCommon();
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
    if (modifyType === "create") {
      throw new LogicError({
        code: ELogicCodeError.NOT_VALID,
        msn: `${modifyType} is not modify type valid`,
      });
    }
    let rxData = await this.createCommon(data);
    if (this.util.isUndefinedOrNull(rxData)) {
      if (isCreateOrUpdate) {
        rxData = await this.updateCommon(data);
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
    if (modifyType === "update") {
      throw new LogicError({
        code: ELogicCodeError.NOT_VALID,
        msn: `${modifyType} is not modify type valid`,
      });
    }
    let rxData = await this.updateCommon(data);
    if (this.util.isUndefinedOrNull(rxData)) {
      if (isCreateOrUpdate) {
        rxData = await this.createCommon(data);
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
    if (modifyType === "delete") {
      throw new LogicError({
        code: ELogicCodeError.NOT_VALID,
        msn: `${modifyType} is not modify type valid`,
      });
    }
    let rxData = await this.deleteCommon(data);
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
