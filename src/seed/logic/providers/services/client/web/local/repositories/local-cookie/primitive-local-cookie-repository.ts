import { LocalCookieRepository } from "./_local-cookie-repository";
import {
  TKeyPrimitiveModifyRequestController,
  TKeyPrimitiveReadRequestController,
} from "../../../../../../../controllers/_primitive-ctrl";
import { TActionFn } from "../shared";
import { IPrimitiveReadCriteria } from "../../../../../../../criterias/shared";
import { IBagForService } from "../../../../../shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**claves identificadoras de todas las acciones de request */
type TKeyFullRequest =
  | TKeyPrimitiveReadRequestController
  | TKeyPrimitiveModifyRequestController;
/**refactorizacion de la clase */
export type Trf_PrimitiveLocalCookieRepository =
  PrimitiveLocalCookieRepository<any>;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *selfcontructor*
 *
 * ...
 */
export class PrimitiveLocalCookieRepository<
    TKeyActionRequest extends TKeyFullRequest
  >
  extends LocalCookieRepository<TKeyActionRequest>
  implements
    ReturnType<PrimitiveLocalCookieRepository<TKeyActionRequest>["getDefault"]>,
    Record<TKeyFullRequest, TActionFn>
{
  public static override readonly getDefault = () => {
    const superDf = LocalCookieRepository.getDefault();
    return {
      ...superDf,
      //...aqui las propiedades
    };
  };
  protected static override readonly getCONSTANTS = () => {
    const superCONST = LocalCookieRepository.getCONSTANTS();
    return {
      ...superCONST,
      //..aqui las constantes
    };
  };
  /**
   * @param keySrc clave identificadora del recurso
   * @param base objeto literal con valores personalizados para iniicalizar las propiedades
   * @param isInit `= true` ❕Solo para herencia❕, indica si esta clase debe iniciar las propiedaes
   */
  constructor(
    keySrc: string,
    base: Partial<
      ReturnType<
        PrimitiveLocalCookieRepository<TKeyActionRequest>["getDefault"]
      >
    > = {},
    isInit = true
  ) {
    super("primitive", keySrc, base, false);
    if (isInit) this.initProps(base);
  }
  protected override getDefault() {
    return PrimitiveLocalCookieRepository.getDefault();
  }
  protected override getCONST() {
    return PrimitiveLocalCookieRepository.getCONSTANTS();
  }
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
    let currentData = await this.getData();
    currentData.push(data);
    await this.setData(currentData);
    return data;
  }
  protected override async updateCommon(data: any) {
    let currentData = await this.getData();
    currentData = data;
    this.setData(currentData);
    return data;
  }
  protected override async deleteCommon(data: any) {
    let currentData = await this.getData();
    return data;
  }
  //████ Util Registers █████████████████████████████████████████████████████
  public override async orderBy(
    registers: any[],
    criteria: IBagForService["literalCriteria"]
  ): Promise<any[]> {
    if (!this.util.isArray(registers)) return registers;
    const { sort } = criteria as IPrimitiveReadCriteria;
    registers = this.util.anyArraySort(registers, { direction: sort });
    //registers = lodash.orderBy(registers, keysField, aSorts); //como se hace con lodash???
    return registers;
  }
  /**... */
  public override async filterByCondition(
    registers: any[],
    criteria: IBagForService["literalCriteria"]
  ): Promise<any[]> {
    const { query } = criteria as IPrimitiveReadCriteria;
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
    const { query } = criteria as IPrimitiveReadCriteria;
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
