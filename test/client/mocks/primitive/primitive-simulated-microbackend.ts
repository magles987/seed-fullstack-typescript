import {
  TKeyPrimitiveModifyRequestController,
  TKeyPrimitiveReadRequestController,
} from "../../../../src/seed/logic/controllers/_primitive-ctrl";
import {
  IPrimitiveModifyCriteria,
  IPrimitiveReadCriteria,
} from "../../../../src/seed/logic/criterias/shared";
import { IBagForDriver } from "../../../../src/seed/logic/providers/_drivers/shared";
import { IDriverResponse } from "../../../../src/seed/logic/reports/shared";
import { PrimitiveQueryTool } from "../../../../src/seed/logic/util/query-tool";
import { SimulatedMicroBackend } from "../_simulated-microbackend";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**claves identificadoras de todas las acciones de request */
export type TPrimitiveKeyFullRequest =
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
    TKeyActionRequest extends TPrimitiveKeyFullRequest
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
  protected override readonly queryTool = PrimitiveQueryTool.getInstance();
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
    super("primitive", base, false);
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
  //████ common snippet for action request  ████████████████████████
  protected override async readCommon(
    literalCriteria: IBagForDriver["literalCriteria"]
  ) {
    let data = this.bd_collection;
    return data;
  }
  protected override async createCommon(
    literalCriteria: IBagForDriver["literalCriteria"],
    data: any
  ) {
    const idxCData = this.bd_collection.findIndex((dt) =>
      this.util.isEquivalentTo([dt, data], {})
    );
    if (idxCData > -1) return undefined; //❗ no se creó porque ya existe ❗
    this.bd_collection.push(data);
    return data;
  }
  protected override async updateCommon(
    literalCriteria: IBagForDriver["literalCriteria"],
    data: any
  ) {
    const idxCData = this.bd_collection.findIndex((dt) =>
      this.util.isEquivalentTo([dt, data], {})
    );
    if (idxCData === -1) return undefined; //❗no existe❗
    this.bd_collection[idxCData] = data; //⚠ modifica this.bd_collection
    return data;
  }
  protected override async deleteCommon(
    literalCriteria: IBagForDriver["literalCriteria"],
    data: any
  ) {
    const fIdx = this.bd_collection.findIndex((dt) =>
      this.util.isEquivalentTo([dt, data], {})
    );
    if (fIdx >= 0) this.bd_collection.splice(fIdx, 1); //Eliminación
    return data;
  }
  //████ Request Actions ████████████████████████████████████████████████████████████
  public async exist(
    literalCriteria: IBagForDriver["literalCriteria"]
  ): Promise<boolean> {
    const registers = await this.readCommon(literalCriteria);
    const aData = await this.getMany(registers, literalCriteria);
    let rxData = aData.length > 0;
    return rxData;
  }
  public async count(
    literalCriteria: IBagForDriver["literalCriteria"]
  ): Promise<number> {
    const registers = await this.readCommon(literalCriteria);
    const aData = await this.getMany(registers, literalCriteria);
    let rxData = aData.length;
    return rxData;
  }
  public async inform(
    literalCriteria: IBagForDriver["literalCriteria"]
  ): Promise<string> {
    const registers = await this.readCommon(literalCriteria);
    const aData = await this.getMany(registers, literalCriteria);
    let rxData = aData.length > 0 ? "exist" : "no exist";
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
  public async readAll(
    literalCriteria: IBagForDriver["literalCriteria"]
  ): Promise<any[]> {
    const registers = await this.readCommon(literalCriteria);
    let rxData = await this.getAll(registers, literalCriteria);
    return rxData;
  }
  /**... */
  public async readMany(
    literalCriteria: IBagForDriver["literalCriteria"]
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
  public async readOne(literalCriteria: IBagForDriver["literalCriteria"]) {
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
    literalCriteria: IBagForDriver["literalCriteria"],
    data: any
  ) {
    const { modifyType, isCreateOrUpdate } =
      literalCriteria as IPrimitiveModifyCriteria;
    if (!this.util.isLiteralObject(data)) {
      throw new Error(`document with data = ${data} is not valid`);
    }
    if (modifyType !== "create") {
      throw new Error(`${modifyType} is not modify type valid`);
    }
    let rxData = await this.createCommon(literalCriteria, data);
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
  public async update(
    literalCriteria: IBagForDriver["literalCriteria"],
    data: any
  ) {
    const { modifyType, isCreateOrUpdate } =
      literalCriteria as IPrimitiveModifyCriteria;
    if (!this.util.isObject(data)) {
      throw new Error(`document with data = ${data} does not valid`);
    }
    if (modifyType !== "update") {
      throw new Error(`${modifyType} is not modify type valid`);
    }
    let rxData = await this.updateCommon(literalCriteria, data);
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
  public async delete(
    literalCriteria: IBagForDriver["literalCriteria"],
    data: any
  ) {
    const { modifyType } = literalCriteria as IPrimitiveModifyCriteria;
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
