import {
  TKeyPrimitiveModifyRequestController,
  TKeyPrimitiveReadRequestController,
} from "../../../../src/seed/logic/controllers/_primitive-ctrl";
import {
  IPrimitiveModifyCriteria,
  IPrimitiveReadCriteria,
} from "../../../../src/seed/logic/criterias/shared";
import { PrimitiveQueryJsAdaptator } from "../../../../src/seed/logic/providers/services/client/web/local/repositories/_query-js-adaptador";
import { IBagForService } from "../../../../src/seed/logic/providers/services/shared";
import { SimulatedMicroBackend } from "../_simulated-microbackend";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**claves identificadoras de todas las acciones de request */
type TKeyFullRequest =
  | TKeyPrimitiveReadRequestController
  | TKeyPrimitiveModifyRequestController; /**refactorización de la clase */
export type Trf_PrimitiveSimulatedMicroBackend =
  PrimitiveSimulatedMicroBackend<any>;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *selfcontructor*
 *
 * ...
 */
export class PrimitiveSimulatedMicroBackend<
    TKeyActionRequest extends TKeyFullRequest
  >
  extends SimulatedMicroBackend
  implements
    ReturnType<PrimitiveSimulatedMicroBackend<TKeyActionRequest>["getDefault"]>
{
  public static override readonly getDefault = () => {
    const superDf = SimulatedMicroBackend.getDefault();
    return {
      ...superDf,
      //...aqui las propiedades
    };
  };
  protected static override readonly getCONSTANTS = () => {
    const superCONST = SimulatedMicroBackend.getCONSTANTS();
    return {
      ...superCONST,
      //..aqui las constantes
    };
  };
  protected override get queryJsAdaptator(): PrimitiveQueryJsAdaptator {
    return super.queryJsAdaptator;
  }
  /**
   * @param base objeto literal con valores personalizados para inicializar las propiedades
   * @param isInit `= true` ❕Solo para herencia❕, indica si esta clase debe iniciar las propiedades
   */
  constructor(
    base: Partial<
      ReturnType<
        PrimitiveSimulatedMicroBackend<TKeyActionRequest>["getDefault"]
      >
    > = {},
    isInit = true
  ) {
    super("primitive", PrimitiveQueryJsAdaptator.getInstance(), base, false);
    if (isInit) this.initProps(base);
  }
  protected override getDefault() {
    return PrimitiveSimulatedMicroBackend.getDefault();
  }
  protected override getCONST() {
    return PrimitiveSimulatedMicroBackend.getCONSTANTS();
  }
  //❗normalmente definidas en el padre, salvo que se quieran sobreescribir❗
  // /**inicializa las propiedades de manera dinamica
  //  *
  //  * @param base objeto literal con valores personalizados para iniicalizar las propiedades
  //  */
  // protected override initProps(base: Partial<ReturnType<PrimitiveSimulatedMicroBackend["getDefault"]>>): void {
  //   for (const key in this.getDefault()) {
  //     this[key] = base[key];
  //   }
  //   return;
  // }
  // /**reinicia una propiedad al valor predefinido
  //  *
  //  * @param key clave identificadora de la propiedad a reiniciar
  //  */
  // public override resetPropByKey(key: keyof ReturnType<PrimitiveSimulatedMicroBackend["getDefault"]>): void {
  //   const df = this.getDefault();
  //   this[key] = df[key];
  //   return;
  // }
  public override mutateProps(
    base: Partial<
      ReturnType<
        PrimitiveSimulatedMicroBackend<TKeyActionRequest>["getDefault"]
      >
    >
  ): void {
    super.mutateProps(base);
    return;
  }
  public override async receiveRequest(
    data: any,
    criteria: IBagForService["literalCriteria"]
  ): Promise<any> {
    const { keyActionRequest } = criteria;
    const _that_ = this;
    let actionFn = _that_[keyActionRequest] as Function;
    if (typeof actionFn !== "function")
      throw new Error(`${actionFn} is not function`);
    actionFn = actionFn.bind(this);
  }
  //████ common snippet for action request  ████████████████████████
  protected override async readCommon(
    criteria: IBagForService["literalCriteria"]
  ) {
    let data = this.bd_collection;
    return data;
  }
  protected override async createCommon(
    data: any,
    criteria: IBagForService["literalCriteria"]
  ) {
    const idxCData = this.bd_collection.findIndex((dt) =>
      this.util.isEquivalentTo([dt, data], {})
    );
    if (idxCData > -1) return undefined; //❗ no se creó porque ya existe ❗
    this.bd_collection.push(data);
    return data;
  }
  protected override async updateCommon(
    data: any,
    criteria: IBagForService["literalCriteria"]
  ) {
    const idxCData = this.bd_collection.findIndex((dt) =>
      this.util.isEquivalentTo([dt, data], {})
    );
    if (idxCData === -1) return undefined; //❗no existe❗
    this.bd_collection[idxCData] = data; //⚠ modifica this.bd_collection
    return data;
  }
  protected override async deleteCommon(
    data: any,
    criteria: IBagForService["literalCriteria"]
  ) {
    const fIdx = this.bd_collection.findIndex((dt) =>
      this.util.isEquivalentTo([dt, data], {})
    );
    if (fIdx >= 0) this.bd_collection.splice(fIdx, 1); //Eliminación
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
      throw new Error(`document with data = ${data} is not valid`);
    }
    if (modifyType !== "create") {
      throw new Error(`${modifyType} is not modify type valid`);
    }
    let rxData = await this.createCommon(data, literalCriteria);
    if (this.util.isUndefinedOrNull(rxData)) {
      if (isCreateOrUpdate) {
        rxData = await this.updateCommon(data, literalCriteria);
      } else {
        throw new Error(
          `document with data : ${data} id has not created because exist`
        );
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
      throw new Error(`document with data = ${data} does not valid`);
    }
    if (modifyType !== "update") {
      throw new Error(`${modifyType} is not modify type valid`);
    }
    let rxData = await this.updateCommon(data, literalCriteria);
    if (this.util.isUndefinedOrNull(rxData)) {
      if (isCreateOrUpdate) {
        rxData = await this.createCommon(data, literalCriteria);
      } else {
        throw new Error(
          `document with data : ${data} id has not updated because not exist`
        );
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
      throw new Error(`document with data = ${data} does not valid`);
    }
    if (modifyType !== "delete") {
      throw new Error(`${modifyType} is not modify type valid`);
    }
    let rxData = await this.deleteCommon(data, literalCriteria);
    return rxData;
  }
  //████ Util Registers █████████████████████████████████████████████████████
}
