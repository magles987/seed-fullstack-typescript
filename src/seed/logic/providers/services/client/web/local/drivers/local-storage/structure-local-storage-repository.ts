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
import { StructureQueryJsAdaptator } from "../_query-js-adaptador";
import { getGlobalConfig } from "../../../../../../../config/global-config";
import { getStrategyGeneratorIdFnByKey } from "../../../../../../../util/default-generators-id-fn";
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
      /**clave identificadora del campo de identificación del registro */
      keyId: getGlobalConfig().keyId,
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
  protected override get queryJsAdaptator(): StructureQueryJsAdaptator {
    return super.queryJsAdaptator;
  }
  /**
   * @param base objeto literal con valores personalizados para iniicalizar las propiedades
   * @param isInit `= true` ❕Solo para herencia❕, indica si esta clase debe iniciar las propiedaes
   */
  constructor(
    base: Partial<
      ReturnType<
        StructureLocalStorageRepository<TKeyActionRequest>["getDefault"]
      >
    > = {},
    isInit = true
  ) {
    super("structure", StructureQueryJsAdaptator.getInstance(), base, false);
    if (isInit) this.initProps(base);
  }
  protected override getDefault() {
    return StructureLocalStorageRepository.getDefault();
  }
  protected override getCONST() {
    return StructureLocalStorageRepository.getCONSTANTS();
  }
  public override mutateProps(
    base: Partial<
      Omit<
        ReturnType<
          StructureLocalStorageRepository<TKeyActionRequest>["getDefault"]
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
  // public override resetPropByKey(key: keyof ReturnType<StructureLocalStorageRepository<TKeyActionRequest>["getDefault"]>): void {
  //   const df = this.getDefault();
  //   this[key] = df[key];
  //   return;
  // }
  //████ common snippet for action request  ████████████████████████
  protected override async readCommon(literalBag: IBagForService) {
    const { literalCriteria } = literalBag;
    const keySrcContext = this.util.getKeySrcContext(
      this.srcSelector,
      literalCriteria
    );
    let data = await this.getData(keySrcContext);
    data = this.util.isNotUndefinedAndNotNull(data)
      ? Array.isArray(data)
        ? data
        : [data]
      : [];
    return data;
  }
  protected override async createCommon(literalBag: IBagForService) {
    const { data, literalCriteria } = literalBag;
    const kId = this.keyId;
    const keySrcContext = this.util.getKeySrcContext(
      this.srcSelector,
      literalCriteria
    );
    let currentData = (await this.getData(keySrcContext)) as any[];
    currentData = Array.isArray(currentData) ? currentData : [currentData];
    const idxCData = currentData.findIndex((dt) => {
      const r = dt[kId] === data[kId];
      return r;
    });
    if (idxCData > -1) return undefined; //❗ no se creó porque ya existe ❗
    //creación de id:
    const { strategyForIdBuild } = this._globalConfig_;
    const buildIDFn = getStrategyGeneratorIdFnByKey(strategyForIdBuild);
    data[kId] = buildIDFn(data[kId]);
    currentData.push(data);
    await this.setData(currentData, keySrcContext);
    return data;
  }
  protected override async updateCommon(literalBag: IBagForService) {
    const { data, literalCriteria } = literalBag;
    const kId = this.keyId;
    const keySrcContext = this.util.getKeySrcContext(
      this.srcSelector,
      literalCriteria
    );
    let currentData = (await this.getData(keySrcContext)) as any[];
    currentData = Array.isArray(currentData) ? currentData : [currentData];
    const idxCData = currentData.findIndex((dt) => {
      const r = dt[kId] === data[kId];
      return r;
    });
    if (idxCData === -1) return undefined; //❗no existe❗
    currentData[idxCData] = data;
    await this.setData(currentData, keySrcContext);
    return data;
  }
  protected override async deleteCommon(literalBag: IBagForService) {
    const { data, literalCriteria } = literalBag;
    const kId = this.keyId;
    const keySrcContext = this.util.getKeySrcContext(
      this.srcSelector,
      literalCriteria
    );
    let currentData = (await this.getData(keySrcContext)) as any[];
    currentData = Array.isArray(currentData) ? currentData : [currentData];
    const idxCData = currentData.findIndex((dt) => {
      const r = dt[kId] === data[kId];
      return r;
    });
    if (idxCData !== -1) {
      //elimina solo si existe
      currentData.splice(idxCData, 1);
      await this.setData(currentData, keySrcContext);
    }
    //mutar data para la eliminacion:
    let dData = {};
    dData[kId] = data[kId]; //solo envia id
    return dData;
  }
  //████ Request Actions ████████████████████████████████████████████████████████████
  public async exist(bagService: IBagForService): Promise<boolean> {
    const { literalCriteria } = bagService;
    const registers = await this.readCommon(bagService);
    const aData = await this.getMany(registers, literalCriteria);
    const data = aData.length > 0;
    return data;
  }
  public async count(bagService: IBagForService): Promise<number> {
    const { literalCriteria } = bagService;
    const registers = await this.readCommon(bagService);
    const aData = await this.getMany(registers, literalCriteria);
    const data = aData.length;
    return data;
  }
  public async inform(bagService: IBagForService): Promise<string> {
    const { literalCriteria } = bagService;
    const registers = await this.readCommon(bagService);
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
  public async readAll(bagService: IBagForService): Promise<any[]> {
    const { literalCriteria } = bagService;
    const registers = await this.readCommon(bagService);
    const data = await this.getAll(registers, literalCriteria);
    return data;
  }
  /**... */
  public async readMany(bagService: IBagForService): Promise<any[]> {
    const { literalCriteria } = bagService;
    const registers = await this.readCommon(bagService);
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
    const registers = await this.readCommon(bagService);
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
    const registers = await this.readCommon(bagService);
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
    let rxData = await this.createCommon(bagService);
    if (this.util.isUndefinedOrNull(rxData)) {
      if (isCreateOrUpdate) {
        rxData = await this.updateCommon(bagService);
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
    let rxData = await this.updateCommon(bagService);
    if (this.util.isUndefinedOrNull(rxData)) {
      if (isCreateOrUpdate) {
        rxData = await this.createCommon(bagService);
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
    let rxData = await this.deleteCommon(bagService);
    return rxData;
  }
}
