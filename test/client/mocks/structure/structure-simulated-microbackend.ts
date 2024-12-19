import { SimulatedMicroBackend } from "../_simulated-microbackend";
import { IBagForService } from "../../../../src/seed/logic/providers/services/shared";
import {
  TKeyStructureModifyRequestController,
  TKeyStructureReadRequestController,
} from "../../../../src/seed/logic/controllers/_structure-ctrl";
import {
  ELogicOperatorForCondition,
  ISingleCondition,
  IStructureModifyCriteria,
  IStructureReadCriteria,
} from "../../../../src/seed/logic/criterias/shared";
import { StructureQueryJsAdaptator } from "../../../../src/seed/logic/providers/services/client/web/local/drivers/_query-js-adaptador";
import { getGlobalConfig } from "../../../../src/seed/logic/config/global-config";
import { getStrategyGeneratorIdFnByKey } from "../../../../src/seed/logic/util/default-generators-id-fn";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**claves identificadoras de todas las acciones de request */
export type TStructureKeyFullRequest =
  | TKeyStructureReadRequestController
  | TKeyStructureModifyRequestController; /**refactorización de la clase */
export type Trf_StructureSimulatedMicroBackend =
  StructureSimulatedMicroBackend<any>;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *selfcontructor*
 *
 * ...
 */
export class StructureSimulatedMicroBackend<
    TKeyActionRequest extends TStructureKeyFullRequest
  >
  extends SimulatedMicroBackend
  implements
    ReturnType<StructureSimulatedMicroBackend<TKeyActionRequest>["getDefault"]>
{
  public static override readonly getDefault = () => {
    const superDf = SimulatedMicroBackend.getDefault();
    return {
      ...superDf,
      /**clave identificadora del campo de identificación del registro */
      keyId: getGlobalConfig().keyId,
    };
  };
  protected static override readonly getCONSTANTS = () => {
    const superCONST = SimulatedMicroBackend.getCONSTANTS();
    return {
      ...superCONST,
      //..aquí las constantes
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
   * @param base objeto literal con valores personalizados para inicializa las propiedades
   * @param isInit `= true` ❕Solo para herencia❕, indica si esta clase debe iniciar las propiedades
   */
  constructor(
    base: Partial<
      ReturnType<
        StructureSimulatedMicroBackend<TKeyActionRequest>["getDefault"]
      >
    > = {},
    isInit = true
  ) {
    super("structure", StructureQueryJsAdaptator.getInstance(), base, false);
    if (isInit) this.initProps(base);
  }
  protected override getDefault() {
    return StructureSimulatedMicroBackend.getDefault();
  }
  protected override getCONST() {
    return StructureSimulatedMicroBackend.getCONSTANTS();
  }
  //❗normalmente definidas en el padre, salvo que se quieran sobreescribir❗
  // /**inicializa las propiedades de manera dinamica
  //  *
  //  * @param base objeto literal con valores personalizados para iniicalizar las propiedades
  //  */
  // protected override initProps(base: Partial<ReturnType<StructureSimulatedMicroBackend["getDefault"]>>): void {
  //   for (const key in this.getDefault()) {
  //     this[key] = base[key];
  //   }
  //   return;
  // }
  // /**reinicia una propiedad al valor predefinido
  //  *
  //  * @param key clave identificadora de la propiedad a reiniciar
  //  */
  // public override resetPropByKey(key: keyof ReturnType<StructureSimulatedMicroBackend["getDefault"]>): void {
  //   const df = this.getDefault();
  //   this[key] = df[key];
  //   return;
  // }
  public override mutateProps(
    base: Partial<
      ReturnType<
        StructureSimulatedMicroBackend<TKeyActionRequest>["getDefault"]
      >
    >
  ): void {
    super.mutateProps(base);
    return;
  }

  //████ common snippet for action request  ████████████████████████
  protected override async readCommon(
    literalCriteria: IBagForService["literalCriteria"]
  ) {
    let data = this.bd_collection;
    return data;
  }
  protected override async createCommon(
    literalCriteria: IBagForService["literalCriteria"],
    data: any
  ) {
    const kId = this.keyId;
    const idxCData = this.bd_collection.findIndex((dt) => {
      const r = dt[kId] === data[kId];
      return r;
    });
    if (idxCData > -1) return undefined; //❗ no se creó porque ya existe ❗
    //creacion de id:
    const { strategyForIdBuild } = this._globalConfig_;
    const buildIDFn = getStrategyGeneratorIdFnByKey(strategyForIdBuild);
    data[kId] = buildIDFn(data[kId]);
    this.bd_collection.push(data);
    return data;
  }
  protected override async updateCommon(
    literalCriteria: IBagForService["literalCriteria"],
    data: any
  ) {
    const kId = this.keyId;
    const idxCData = this.bd_collection.findIndex((dt) => {
      const r = dt[kId] === data[kId];
      return r;
    });
    if (idxCData === -1) return undefined; //❗no existe❗
    this.bd_collection[idxCData] = data;
    return data;
  }
  protected override async deleteCommon(
    literalCriteria: IBagForService["literalCriteria"],
    data: any
  ) {
    const kId = this.keyId;
    const idxCData = this.bd_collection.findIndex((dt) => {
      const r = dt[kId] === data[kId];
      return r;
    });
    if (idxCData !== -1) this.bd_collection.splice(idxCData, 1);
    //mutar data para la eliminacion:
    let dData = {};
    dData[kId] = data[kId]; //solo envia id
    return dData;
  }
  //████ Request Actions ████████████████████████████████████████████████████████████
  public async exist(
    literalCriteria: IBagForService["literalCriteria"]
  ): Promise<boolean> {
    const registers = await this.readCommon(literalCriteria);
    const aData = await this.getMany(registers, literalCriteria);
    let rxData = aData.length > 0;
    return rxData;
  }
  public async count(
    literalCriteria: IBagForService["literalCriteria"]
  ): Promise<number> {
    const registers = await this.readCommon(literalCriteria);
    const aData = await this.getMany(registers, literalCriteria);
    let rxData = aData.length;
    return rxData;
  }
  public async inform(
    data: any,
    literalCriteria: IBagForService["literalCriteria"]
  ): Promise<string> {
    const registers = await this.readCommon(literalCriteria);
    const aData = await this.getMany(registers, literalCriteria);
    data = aData.length > 0 ? "exist" : "no exist";
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
  public async readAll(
    literalCriteria: IBagForService["literalCriteria"]
  ): Promise<any[]> {
    const registers = await this.readCommon(literalCriteria);
    let rxData = await this.getAll(registers, literalCriteria);
    return rxData;
  }
  /**... */
  public async readMany(
    literalCriteria: IBagForService["literalCriteria"]
  ): Promise<any[]> {
    const registers = await this.readCommon(literalCriteria);
    let rxData = await this.getMany(registers, literalCriteria);
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
  public async readOne(literalCriteria: IBagForService["literalCriteria"]) {
    const registers = await this.readCommon(literalCriteria);
    let rxData = await this.getOne(registers, literalCriteria);
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
  public async readById(literalCriteria: IBagForService["literalCriteria"]) {
    const kId = this.keyId;
    const { query } = literalCriteria as IStructureReadCriteria<any>;
    const extractQ = query!.find((q) => {
      const oQ = q as ISingleCondition;
      const r =
        this.util.isObject(oQ) &&
        oQ.op === ELogicOperatorForCondition.eq &&
        oQ.keyPathForCond!.includes(kId);
      return r;
    }) as ISingleCondition;
    if (extractQ === undefined) {
      throw new Error(`is not valid query, because not 'id' valid`);
    }
    const registers = await this.readCommon(literalCriteria);
    let rxData = await this.getOne(registers, literalCriteria);
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
  public async create(
    literalCriteria: IBagForService["literalCriteria"],
    data: any
  ) {
    const { modifyType, isCreateOrUpdate } =
      literalCriteria as IStructureModifyCriteria<any>;
    if (!this.util.isLiteralObject(data)) {
      throw new Error(`document with data = ${data} is not valid`);
    }
    if (modifyType !== "create") {
      throw new Error(`${modifyType} is not modify type valid`);
    }
    let rxData = await this.createCommon(literalCriteria, data);
    if (this.util.isUndefinedOrNull(rxData)) {
      if (isCreateOrUpdate) {
        rxData = await this.updateCommon(literalCriteria, data);
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
  public async update(
    literalCriteria: IBagForService["literalCriteria"],
    data: any
  ) {
    const { modifyType, isCreateOrUpdate } =
      literalCriteria as IStructureModifyCriteria<any>;
    if (!this.util.isObject(data)) {
      throw new Error(`document with data = ${data} does not valid`);
    }
    if (modifyType !== "update") {
      throw new Error(`${modifyType} is not modify type valid`);
    }
    let rxData = await this.updateCommon(literalCriteria, data);
    if (this.util.isUndefinedOrNull(rxData)) {
      if (isCreateOrUpdate) {
        rxData = await this.createCommon(literalCriteria, data);
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
  public async delete(
    literalCriteria: IBagForService["literalCriteria"],
    data: any
  ) {
    const { modifyType } = literalCriteria as IStructureModifyCriteria<any>;
    if (!this.util.isObject(data)) {
      throw new Error(`document with data = ${data} does not valid`);
    }
    if (modifyType !== "delete") {
      throw new Error(`${modifyType} is not modify type valid`);
    }
    let rxData = await this.deleteCommon(literalCriteria, data);
    return rxData;
  }
}
