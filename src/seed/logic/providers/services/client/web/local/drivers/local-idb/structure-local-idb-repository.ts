import {
  ELogicCodeError,
  LogicError,
} from "../../../../../../../errors/logic-error";
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
import { StructureQueryJsAdaptator } from "../_query-js-adaptador";
import { getGlobalConfig } from "../../../../../../../config/global-config";
import { getStrategyGeneratorIdFnByKey } from "../../../../../../../util/default-generators-id-fn";
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
    Record<TKeyFullRequest, TActionFn>
{
  public static override readonly getDefault = () => {
    const superDf = LocalIDBRepository.getDefault();
    return {
      ...superDf,
      keyId: getGlobalConfig().keyId,
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
  protected override get queryJsAdaptator(): StructureQueryJsAdaptator {
    return super.queryJsAdaptator;
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
    super("structure", StructureQueryJsAdaptator.getInstance(), base, false);
    if (isInit) this.initProps(base);
  }
  protected override getDefault() {
    return StructureLocalIDBRepository.getDefault();
  }
  protected override getCONST() {
    return StructureLocalIDBRepository.getCONSTANTS();
  }
  public override mutateProps(
    base: Partial<
      Omit<
        ReturnType<
          StructureLocalIDBRepository<TKeyActionRequest>["getDefault"]
        >,
        "" //se deja la opción de omitir abierta
      >
    >
  ): void {
    super.mutateProps(base);
    return;
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
  protected override async readCommon(
    criteria: IBagForService["literalCriteria"]
  ) {
    const keySrcContext = this.util.getKeySrcContext(
      this.srcSelector,
      criteria
    );
    const tx = await this.getTransaction(
      {
        keyCollection: keySrcContext,
        keyPrimary: this.keyId,
      },
      "readonly"
    );
    let data = await tx.store.getAll();
    await tx.done;
    return data;
  }
  protected override async createCommon(
    data: any,
    criteria: IBagForService["literalCriteria"]
  ) {
    const kId = this.keyId;
    const keySrcContext = this.util.getKeySrcContext(
      this.srcSelector,
      criteria
    );
    const tx = await this.getTransaction(
      {
        keyCollection: keySrcContext,
        keyPrimary: this.keyId,
      },
      "readwrite"
    );
    const isExist = this.util.isObject(await tx.store.get(data[kId]));
    if (isExist) return undefined; //❗ no se creó porque ya existe ❗
    //❗creacion de id:❗
    const { strategyForIdBuild } = this._globalConfig_;
    const buildIDFn = getStrategyGeneratorIdFnByKey(strategyForIdBuild);
    data[kId] = buildIDFn(data[kId]);
    data[kId] = await tx.store.add(data);
    await tx.done; //cerrar la transacción
    return data;
  }
  protected override async updateCommon(
    data: any,
    criteria: IBagForService["literalCriteria"]
  ) {
    const kId = this.keyId;
    const keySrcContext = this.util.getKeySrcContext(
      this.srcSelector,
      criteria
    );
    const tx = await this.getTransaction(
      {
        keyCollection: keySrcContext,
        keyPrimary: this.keyId,
      },
      "readwrite"
    );
    const isExist = this.util.isObject(await tx.store.get(data[kId]));
    if (!isExist) return undefined; //❗no existe❗
    data[kId] = await tx.store.put(data);
    await tx.done; //cerrar la transacción
    return data;
  }
  protected override async deleteCommon(
    data: any,
    criteria: IBagForService["literalCriteria"]
  ) {
    const kId = this.keyId;
    const keySrcContext = this.util.getKeySrcContext(
      this.srcSelector,
      criteria
    );
    const tx = await this.getTransaction(
      {
        keyCollection: keySrcContext,
        keyPrimary: this.keyId,
      },
      "readwrite"
    );
    const isExist = this.util.isObject(await tx.store.get(data[kId]));
    if (isExist) await tx.store.delete(data[kId]);
    await tx.done;
    //mutar data para la eliminacion:
    let dData = {};
    dData[kId] = data[kId]; //solo envia id
    return dData;
  }
  //████ Request Actions ████████████████████████████████████████████████████████████
  public async exist(bagService: IBagForService): Promise<boolean> {
    const { literalCriteria } = bagService;
    const registers = await this.readCommon(literalCriteria);
    const aData = await this.getMany(registers, literalCriteria);
    const data = aData.length > 0;
    return data;
  }
  public async count(bagService: IBagForService): Promise<number> {
    const { literalCriteria } = bagService;
    const registers = await this.readCommon(literalCriteria);
    const aData = await this.getMany(registers, literalCriteria);
    const data = aData.length;
    return data;
  }
  public async inform(bagService: IBagForService): Promise<string> {
    const { literalCriteria } = bagService;
    const registers = await this.readCommon(literalCriteria);
    const aData = await this.getMany(registers, literalCriteria);
    const data = aData.length > 0 ? "exist" : "no exist";
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
    const keySrcContext = this.util.getKeySrcContext(
      this.srcSelector,
      literalCriteria
    );
    const tx = await this.getTransaction(
      {
        keyCollection: keySrcContext,
        keyPrimary: this.keyId,
      },
      "readonly"
    );
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
}
