import { v4 as uuidv4 } from "uuid";
import lodash from "lodash";
import {
  ELogicCodeError,
  LogicError,
} from "../../../../../../../errors/logic-error";
import { Model } from "../../../../../../../models/_model";
import { LocalIDBRepository } from "./_local-idb-repository";
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
  | TKeyStructureModifyRequestController;
/**Refactorizacion de la clase */
export type Trf_StructureLocalIDBRepository = StructureLocalIDBRepository<any>;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *selfcontructor*
 *
 * ...
 */
export class StructureLocalIDBRepository<
  TKeyActionRequest extends TKeyFullRequest
>
  extends LocalIDBRepository<TKeyActionRequest>
  implements
  ReturnType<StructureLocalIDBRepository<TKeyActionRequest>["getDefault"]>,
  Record<TKeyFullRequest, TActionFn> {
  public static override readonly getDefault = () => {
    const superDf = LocalIDBRepository.getDefault();
    return {
      ...superDf,
      keyId: "_id",
    };
  };
  protected static override readonly getCONSTANTS = () => {
    const superCONST = LocalIDBRepository.getCONSTANTS();
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
      ReturnType<StructureLocalIDBRepository<TKeyActionRequest>["getDefault"]>
    > = {},
    isInit = true
  ) {
    super("structure", base, false);
    if (isInit) this.initProps(base);
  }
  protected override getDefault() {
    return StructureLocalIDBRepository.getDefault();
  }
  protected override getCONST() {
    return StructureLocalIDBRepository.getCONSTANTS();
  }
  //❗normalmente definidas en el padre, salvo que se quieran sobreescribir❗
  // /**reinicia una propiedad al valor predefinido
  //  *
  //  * @param key clave identificadora de la propiedad a reiniciar
  //  */
  // public override resetPropByKey(key: keyof ReturnType<StructureLocalIDBRepository["getDefault"]>): void {
  //   const df = this.getDefault();
  //   this[key] = df[key];
  //   return;
  // }
  protected override createAndSetSchemaConfig(
    keyCollection: string,
    keyPrimary = this._keyId,
  ) {
    this.connection.setSchemaConfig({
      keyCollection,
      keyPrimary: keyPrimary as any,
    });
  }
  protected override async readCommon(
    criteria: IBagForService["literalCriteria"]
  ) {
    const keySrcContext = this.getKeySrcContext(this.srcSelector, criteria);
    const tx = await this.getTransaction(keySrcContext, "readonly");
    let data = await tx.store.getAll();
    await tx.done;
    return data;
  }
  protected override async createCommon(
    data: any,
    criteria: IBagForService["literalCriteria"]
  ) {
    const kId = this.keyId;
    const keySrcContext = this.getKeySrcContext(this.srcSelector, criteria);
    const tx = await this.getTransaction(keySrcContext, "readwrite");
    const isExist = this.util.isObject(await tx.store.get(data[kId]));
    if (isExist) return undefined; //❗ no se creó porque ya existe ❗
    //❗creacion de id:❗
    data[kId] = this.generateID(data);
    data[kId] = await tx.store.add(data);
    await tx.done; //cerrar la trasaccion
    return data;
  }
  protected override async updateCommon(
    data: any,
    criteria: IBagForService["literalCriteria"]
  ) {
    const kId = this.keyId;
    const keySrcContext = this.getKeySrcContext(this.srcSelector, criteria);
    const tx = await this.getTransaction(keySrcContext, "readwrite");
    const isExist = this.util.isObject(await tx.store.get(data[kId]));
    if (!isExist) return undefined; //❗no existe❗
    data[kId] = await tx.store.put(data);
    await tx.done; //cerrar la trasaccion
    return data;
  }
  protected override async deleteCommon(
    data: any,
    criteria: IBagForService["literalCriteria"]
  ) {
    const kId = this.keyId;
    const keySrcContext = this.getKeySrcContext(this.srcSelector, criteria);
    const tx = await this.getTransaction(keySrcContext, "readwrite");
    const isExist = this.util.isObject(await tx.store.get(data[kId]));
    if (isExist) {
      await tx.store.delete(data[kId]);
      await tx.done;
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
  public async readAll(bagService: IBagForService) {
    const { literalCriteria } = bagService;
    const registers = await this.readCommon(literalCriteria);
    const rxData = await this.getAll(registers, literalCriteria);
    return rxData;
  }
  /**... */
  public async readMany(bagService: IBagForService): Promise<any[]> {
    const { literalCriteria } = bagService;
    const registers = await this.readCommon(literalCriteria);
    const rxData = await this.getMany(registers, literalCriteria);
    return rxData;
  }
  /** */
  public async readOne(bagService: IBagForService) {
    const { literalCriteria } = bagService;
    const registers = await this.readCommon(literalCriteria);
    const rxData = await this.getOne(registers, literalCriteria);
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
  public async readById(bagService: IBagForService) {
    const { literalCriteria } = bagService;
    const keySrcContext = this.getKeySrcContext(
      this.srcSelector,
      literalCriteria
    );
    const tx = await this.getTransaction(keySrcContext, "readonly");
    const { query } = literalCriteria as IStructureReadCriteria<any>;
    const kId = this.keyId;
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
    const id = extractQ.vCond;
    const rxData = await tx.store.get(id);
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
        rxData = await this.createCommon(data, literalCriteria);
      } else {
        throw new LogicError({
          code: ELogicCodeError.NOT_EXIST,
          msn: `document with data : ${LogicError.valueToString(
            data
          )} id has not created because not exist`,
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
    const kId = this.keyId;
    let rxData = {};
    await this.deleteCommon(data, literalCriteria);
    rxData[kId] = data[kId];
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
