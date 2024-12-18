import {
  TKeyPrimitiveModifyRequestController,
  TKeyPrimitiveReadRequestController,
} from "../../../../../../../controllers/_primitive-ctrl";
import {
  IPrimitiveModifyCriteria,
  IPrimitiveReadCriteria,
} from "../../../../../../../criterias/shared";
import {
  ELogicCodeError,
  LogicError,
} from "../../../../../../../errors/logic-error";
import { IBagForService } from "../../../../../shared";
import { PrimitiveQueryJsAdaptator } from "../_query-js-adaptador";
import { TActionFn } from "../shared";
import { LocalIDBRepository } from "./_local-idb-repository";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**claves identificadoras de todas las acciones de request */
type TKeyFullRequest =
  | TKeyPrimitiveReadRequestController
  | TKeyPrimitiveModifyRequestController;
/**Refactorizacion de la clase */
export type Trf_PrimitiveLocalIDBRepository = PrimitiveLocalIDBRepository<any>;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *selfcontructor*
 *
 * ...
 */
export class PrimitiveLocalIDBRepository<
    TKeyActionRequest extends TKeyFullRequest
  >
  extends LocalIDBRepository<TKeyActionRequest>
  implements
    ReturnType<PrimitiveLocalIDBRepository<TKeyActionRequest>["getDefault"]>,
    Record<TKeyFullRequest, TActionFn>
{
  public static override readonly getDefault = () => {
    const superDf = LocalIDBRepository.getDefault();
    return {
      ...superDf,
      //...aqui las propiedades
    };
  };
  protected static override readonly getCONSTANTS = () => {
    const superCONST = LocalIDBRepository.getCONSTANTS();
    return {
      ...superCONST,
      keyId: "_Id", //❗Obligatoria para empaquetar el primitivo❗
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
      ReturnType<PrimitiveLocalIDBRepository<TKeyActionRequest>["getDefault"]>
    > = {},
    isInit = true
  ) {
    super("primitive", PrimitiveQueryJsAdaptator.getInstance(), base, false);
    if (isInit) this.initProps(base);
  }
  protected override getDefault() {
    return PrimitiveLocalIDBRepository.getDefault();
  }
  protected override getCONST() {
    return PrimitiveLocalIDBRepository.getCONSTANTS();
  }

  //❗normalmente definidas en el padre, salvo que se quieran sobreescribir❗
  // /**reinicia una propiedad al valor predefinido
  //  *
  //  * @param key clave identificadora de la propiedad a reiniciar
  //  */
  // public override resetPropByKey(key: keyof ReturnType<PrimitiveLocalIDBRepository<TKeyActionRequest>["getDefault"]>): void {
  //   const df = this.getDefault();
  //   this[key] = df[key];
  //   return;
  // }
  public override mutateProps(
    base: Partial<
      Omit<
        ReturnType<
          PrimitiveLocalIDBRepository<TKeyActionRequest>["getDefault"]
        >,
        "" //se deja la opción de omitir abierta
      >
    >
  ): void {
    super.mutateProps(base);
    return;
  }
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
        keyPrimary: this.getCONST().keyId,
        autoIncrement: true,
      },
      "readonly"
    );
    let data = await tx.store.getAll();
    await tx.done;
    //desempaquetar
    data = data.map((dt) => dt[keySrcContext]);
    return data;
  }
  protected override async createCommon(
    data: any,
    criteria: IBagForService["literalCriteria"]
  ) {
    const kId = this.getCONST().keyId;
    const keySrcContext = this.util.getKeySrcContext(
      this.srcSelector,
      criteria
    );
    const tx = await this.getTransaction(
      {
        keyCollection: keySrcContext,
        keyPrimary: this.getCONST().keyId,
        autoIncrement: true,
      },
      "readwrite"
    );
    const cDataIdx = (await tx.store.getAll()).findIndex((dt) => {
      //desempaquetar:
      const cData = dt[keySrcContext];
      const r = this.util.isEquivalentTo([cData, data], {});
      return r;
    });
    if (cDataIdx > -1) return undefined; //❗ no se creó porque ya existe ❗
    //empaquetar
    let modData = {};
    modData[kId] = undefined; //el autoincrementar se encarga "de esa vuelta"
    modData[keySrcContext] = data;
    await tx.store.add(modData);
    await tx.done; //cerrar la transacción
    return data;
  }
  protected override async updateCommon(
    data: any,
    criteria: IBagForService["literalCriteria"]
  ) {
    const kId = this.getCONST().keyId;
    const keySrcContext = this.util.getKeySrcContext(
      this.srcSelector,
      criteria
    );
    const tx = await this.getTransaction(
      {
        keyCollection: keySrcContext,
        keyPrimary: this.getCONST().keyId,
        autoIncrement: true,
      },
      "readwrite"
    );
    const cDataIdx = (await tx.store.getAll()).findIndex((dt) => {
      //desempaquetar:
      const cData = dt[keySrcContext];
      const r = this.util.isEquivalentTo([cData, data], {});
      return r;
    });
    if (cDataIdx === -1) return undefined; //❗ no se actualizó porque no existe ❗
    //empaquetar
    let modData = {};
    modData[kId] = data[cDataIdx][kId];
    modData[keySrcContext] = data;
    await tx.store.put(modData);
    await tx.done; //cerrar la transacción
    return data;
  }
  protected override async deleteCommon(
    data: any,
    criteria: IBagForService["literalCriteria"]
  ) {
    const kId = this.getCONST().keyId;
    const keySrcContext = this.util.getKeySrcContext(
      this.srcSelector,
      criteria
    );
    const tx = await this.getTransaction(
      {
        keyCollection: keySrcContext,
        keyPrimary: this.getCONST().keyId,
        autoIncrement: true,
      },
      "readwrite"
    );
    const cDataIdx = (await tx.store.getAll()).findIndex((dt) => {
      //desempaquetar:
      const cData = dt[keySrcContext];
      const r = this.util.isEquivalentTo([cData, data], {});
      return r;
    });
    if (cDataIdx > -1) await tx.store.delete(cDataIdx);
    await tx.done;
    //mutar data para la eliminación:
    let modData = {};
    modData[kId] = cDataIdx; //solo envía id
    return modData;
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
    await this.deleteCommon(data, literalCriteria);
    return null; //⚠Que retorna el primitivo❓❓
  }
  //████ Util Registers █████████████████████████████████████████████████████
}
