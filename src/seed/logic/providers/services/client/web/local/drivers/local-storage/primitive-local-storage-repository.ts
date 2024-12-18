import { LocalStorageRepository } from "./_local-storage-repository";
import {
  TKeyPrimitiveModifyRequestController,
  TKeyPrimitiveReadRequestController,
} from "../../../../../../../controllers/_primitive-ctrl";
import { TActionFn } from "../shared";
import { IBagForService } from "../../../../../shared";
import {
  ELogicCodeError,
  LogicError,
} from "../../../../../../../errors/logic-error";
import {
  IPrimitiveModifyCriteria,
  IPrimitiveReadCriteria,
} from "../../../../../../../criterias/shared";
import { PrimitiveQueryJsAdaptator } from "../_query-js-adaptador";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**claves identificadoras de todas las acciones de request */
type TKeyFullRequest =
  | TKeyPrimitiveReadRequestController
  | TKeyPrimitiveModifyRequestController;
/** */
export type Trf_PrimitiveLocalStorageRepository =
  PrimitiveLocalStorageRepository<any>;

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *selfcontructor*
 *
 * ...
 */
export class PrimitiveLocalStorageRepository<
    TKeyActionRequest extends TKeyFullRequest
  >
  extends LocalStorageRepository<TKeyActionRequest>
  implements
    ReturnType<
      PrimitiveLocalStorageRepository<TKeyActionRequest>["getDefault"]
    >,
    Record<TKeyFullRequest, TActionFn>
{
  public static override readonly getDefault = () => {
    const superDf = LocalStorageRepository.getDefault();
    return {
      ...superDf,
      //...aqui las propiedades
    };
  };
  protected static override readonly getCONSTANTS = () => {
    const superCONST = LocalStorageRepository.getCONSTANTS();
    return {
      ...superCONST,
      //..aquí las constantes
    };
  };
  protected override get queryJsAdaptator(): PrimitiveQueryJsAdaptator {
    return super.queryJsAdaptator;
  }
  /**
   * @param base objeto literal con valores personalizados para iniicalizar las propiedades
   * @param isInit `= true` ❕Solo para herencia❕, indica si esta clase debe iniciar las propiedaes
   */
  constructor(
    base: Partial<
      ReturnType<
        PrimitiveLocalStorageRepository<TKeyActionRequest>["getDefault"]
      >
    > = {},
    isInit = true
  ) {
    super("primitive", PrimitiveQueryJsAdaptator.getInstance(), base, false);
    if (isInit) this.initProps(base);
  }
  protected override getDefault() {
    return PrimitiveLocalStorageRepository.getDefault();
  }
  protected override getCONST() {
    return PrimitiveLocalStorageRepository.getCONSTANTS();
  }
  public override mutateProps(
    base: Partial<
      Omit<
        ReturnType<
          PrimitiveLocalStorageRepository<TKeyActionRequest>["getDefault"]
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
  // public override resetPropByKey(key: keyof ReturnType<PrimitiveLocalStorageRepository<TKeyActionRequest>["getDefault"]>): void {
  //   const df = this.getDefault();
  //   this[key] = df[key];
  //   return;
  // }
  //████ common snippet for action request  ████████████████████████
  protected override async readCommon(
    criteria: IBagForService["literalCriteria"]
  ) {
    const keySrcContext = this.util.getKeySrcContext(
      this.srcSelector,
      criteria
    );
    let data = await this.getData(keySrcContext);
    data = this.util.isNotUndefinedAndNotNull(data)
      ? Array.isArray(data)
        ? data
        : [data]
      : [];
    //desempaquetar primitive data
    data = (data as any[]).map((data) => data[keySrcContext]);
    return data;
  }
  protected override async createCommon(
    data: any,
    criteria: IBagForService["literalCriteria"]
  ) {
    const keySrcContext = this.util.getKeySrcContext(
      this.srcSelector,
      criteria
    );
    let currentData = (await this.getData(keySrcContext)) as any[];
    currentData = Array.isArray(currentData) ? currentData : [currentData];
    const idxCData = currentData.findIndex((dt) =>
      this.util.isEquivalentTo([dt, data], {})
    );
    if (idxCData > -1) return undefined; //❗ no se creó porque ya existe ❗
    currentData.push(data);
    await this.setData(currentData, keySrcContext);
    return data;
  }
  protected override async updateCommon(
    data: any,
    criteria: IBagForService["literalCriteria"]
  ) {
    const keySrcContext = this.util.getKeySrcContext(
      this.srcSelector,
      criteria
    );
    let currentData = await this.getData(keySrcContext);
    const idxCData = currentData.findIndex((dt) =>
      this.util.isEquivalentTo([dt, data], {})
    );
    if (idxCData === -1) return undefined; //❗no existe❗
    currentData[idxCData] = data;
    this.setData(currentData, keySrcContext);
    return data;
  }
  protected override async deleteCommon(
    data: any,
    criteria: IBagForService["literalCriteria"]
  ) {
    const keySrcContext = this.util.getKeySrcContext(
      this.srcSelector,
      criteria
    );
    let currentData = (await this.getData(keySrcContext)) as any[];
    currentData = Array.isArray(currentData) ? currentData : [currentData];
    const fIdx = currentData.findIndex((dt) =>
      this.util.isEquivalentTo([dt, data], {})
    );
    if (fIdx >= 0) currentData.splice(fIdx, 1); //Eliminación
    await this.setData(currentData, keySrcContext);
    return data;
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
  public async create(bagService: IBagForService) {
    const { data, literalCriteria } = bagService;
    const { modifyType, isCreateOrUpdate } =
      literalCriteria as IPrimitiveModifyCriteria;
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
      literalCriteria as IPrimitiveModifyCriteria;
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
    const { modifyType } = literalCriteria as IPrimitiveModifyCriteria;
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
}
