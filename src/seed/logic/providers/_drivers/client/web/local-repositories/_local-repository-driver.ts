import { getGlobalConfig } from "../../../../../config/global-config";
import { Module } from "../../../../../config/module";
import {
  IModifyCriteria,
  IReadCriteria,
} from "../../../../../criterias/shared";
import { ELogicCodeError, LogicError } from "../../../../../errors/logic-error";
import {
  ELogicResStatusCode,
  IDriverResponse,
} from "../../../../../reports/shared";
import { QueryTool } from "../../../../../util/query-tool";
import { IBagForDriver } from "../../../shared";
import { WebDriver } from "../_web-driver";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *selfcontructor*
 *
 * ...
 */
export abstract class LocalRepositoryDriver
  extends WebDriver
  implements ReturnType<LocalRepositoryDriver["getDefault"]>
{
  public static readonly getNameLogicDriver = () => {
    const util = Module.util;
    const sp = util.charSeparatorLogicName;
    const prefixGroupName = WebDriver.getNameLogicDriver();
    let name = "localRepository";
    name = `${prefixGroupName}${name}${sp}`;
    return name;
  };
  public static override readonly getDefault = () => {
    const superDf = WebDriver.getDefault();
    return {
      ...superDf,
      /**nombre de la propiedad que contiene la clave identificadora */
      keyId: getGlobalConfig().keyId,
    };
  };
  protected static override readonly getCONSTANTS = () => {
    const superCONST = WebDriver.getCONSTANTS();
    return {
      ...superCONST,
      //..aqui las constantes
    };
  };
  /**herramientas para las queries */
  protected readonly queryTool = QueryTool.getInstance();
  /**
   * @param base objeto literal con valores personalizados para iniicalizar las propiedades
   * @param isInit `= true` ❕Solo para herencia❕, indica si esta clase debe iniciar las propiedaes
   */
  constructor(
    base: Partial<ReturnType<LocalRepositoryDriver["getDefault"]>> = {},
    isInit = true
  ) {
    super(base, false);
    if (isInit) this.initProps(base);
  }
  protected override getDefault() {
    return LocalRepositoryDriver.getDefault();
  }
  protected override getCONST() {
    return LocalRepositoryDriver.getCONSTANTS();
  }
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
  //❗normalmente definidas en el padre, salvo que se quieran sobrescribir❗
  // /**inicializa las propiedades de manera dinamica
  //  *
  //  * @param base objeto literal con valores personalizados para iniicalizar las propiedades
  //  */
  // protected override initProps(base: Partial<ReturnType<LocalRepositoryDriver["getDefault"]>>): void {
  //   for (const key in this.getDefault()) {
  //     this[key] = base[key];
  //   }
  //   return;
  // }
  // /**reinicia una propiedad al valor predefinido
  //  *
  //  * @param key clave identificadora de la propiedad a reiniciar
  //  */
  // public override resetPropByKey(key: keyof ReturnType<LocalRepositoryDriver["getDefault"]>): void {
  //   const df = this.getDefault();
  //   this[key] = df[key];
  //   return;
  // }
  public override mutateProps(
    base: Partial<ReturnType<LocalRepositoryDriver["getDefault"]>>
  ): void {
    super.mutateProps(base);
    return;
  }
  public override getLiteral(): ReturnType<
    LocalRepositoryDriver["getDefault"]
  > {
    return super.getLiteral() as any;
  }
  /**verifica si la data recibida corresponde la expectativa esperada*/
  protected checkRxData(
    rxData: any,
    expectDataType: IBagForDriver["literalCriteria"]["expectedDataType"]
  ): boolean {
    if (expectDataType === "boolean" && !this.util.isBoolean(rxData))
      return false;
    else if (expectDataType === "number" && !this.util.isNumber(rxData))
      return false;
    else if (expectDataType === "string" && !this.util.isString(rxData, true))
      return false;
    else if (expectDataType === "object" && !this.util.isObject(rxData, true))
      return false;
    else if (expectDataType === "array" && !this.util.isArray(rxData, true))
      return false;
    else return true;
  }
  protected override buildDriverResponse(
    literalCriteria: IBagForDriver["literalCriteria"],
    rxData: any,
    error?: any
  ): IDriverResponse {
    let driverRes = {
      data: rxData,
      status: ELogicResStatusCode.SUCCESS,
      msn: ``,
      error,
    } as IDriverResponse;
    const { expectedDataType } = literalCriteria;
    const dfValue = this.util.dfValue;
    //verificar si hubo error interno en el driver o en su servicio interno
    if (this.util.isUndefinedOrNull(error)) {
      //verificar integrida de datos recibidos
      const isCheckData = this.checkRxData(rxData, expectedDataType);
      if (isCheckData) {
        driverRes.data = rxData;
        driverRes.status = ELogicResStatusCode.SUCCESS;
        driverRes.msn = `ok`;
      } else {
        driverRes.data = dfValue;
        driverRes.status = ELogicResStatusCode.BAD;
        driverRes.msn = `data has not been as expected`;
      }
    } else {
      driverRes.data = dfValue;
      driverRes.status = ELogicResStatusCode.ERROR;
      driverRes.error = error;
      driverRes.msn = this.util.isObject(error)
        ? (error as Error).message ?? `internal error in local driver`
        : this.util.isString(error)
        ? error
        : `internal error in local driver`;
    }
    return driverRes;
  }
  public override async sendRequestFromService(
    bagDriver: IBagForDriver
  ): Promise<IDriverResponse> {
    let driverRes: IDriverResponse;
    try {
      this.preRequestFromService(bagDriver);
      let rxData = await this.selectCRUDRunByBag(bagDriver);
      driverRes = this.buildDriverResponse(bagDriver.literalCriteria, rxData);
    } catch (error) {
      driverRes = this.buildDriverResponse(
        bagDriver.literalCriteria,
        this.util.dfValue,
        error
      );
    }
    this.postRequestFromService(driverRes);
    return driverRes;
  }
  protected override preRequestFromService(bagDriver: IBagForDriver): void {
    super.preRequestFromService(bagDriver);
    return;
  }
  protected override postRequestFromService(driverRes: IDriverResponse): void {
    super.postRequestFromService(driverRes);
    return;
  }
  //████ CRUD by Bag ████████████████████████████████████████████████████████████
  /**... */
  protected async selectCRUDRunByBag(
    literalBagDriver: IBagForDriver
  ): Promise<any> {
    const { literalCriteria } = literalBagDriver;
    const { type, keyLogicContext } = literalCriteria;
    let rxData: any;
    if (keyLogicContext === "primitive") {
      if (type === "read") {
        const {} = literalCriteria as IReadCriteria;
        rxData = await this.primitiveReadByBag(literalBagDriver);
      } else if (type === "modify") {
        const { modifyType } = literalCriteria as IModifyCriteria;
        if (modifyType === "create") {
          rxData = await this.primitiveCreateByBag(literalBagDriver);
        } else if (modifyType === "update") {
          rxData = await this.primitiveUpdateByBag(literalBagDriver);
        } else if (modifyType === "delete") {
          rxData = await this.primitiveDeleteByBag(literalBagDriver);
        } else {
          throw new LogicError({
            code: ELogicCodeError.MODULE_ERROR,
            msn: `${modifyType} is not modify type request valid`,
          });
        }
      } else {
        throw new LogicError({
          code: ELogicCodeError.MODULE_ERROR,
          msn: `${type} is not type request valid`,
        });
      }
    } else if (keyLogicContext === "structure") {
      if (type === "read") {
        const {} = literalCriteria as IReadCriteria;
        rxData = await this.structureReadByBag(literalBagDriver);
      } else if (type === "modify") {
        const { modifyType } = literalCriteria as IModifyCriteria;
        if (modifyType === "create") {
          rxData = await this.structureCreateByBag(literalBagDriver);
        } else if (modifyType === "update") {
          rxData = await this.structureUpdateByBag(literalBagDriver);
        } else if (modifyType === "delete") {
          rxData = await this.structureDeleteByBag(literalBagDriver);
        } else {
          throw new LogicError({
            code: ELogicCodeError.MODULE_ERROR,
            msn: `${modifyType} is not modify type request valid`,
          });
        }
      } else {
        throw new LogicError({
          code: ELogicCodeError.MODULE_ERROR,
          msn: `${type} is not type request valid`,
        });
      }
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${keyLogicContext} is not  type request`,
      });
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
  protected abstract primitiveReadByBag(
    literalBagDriver: IBagForDriver
  ): Promise<any>;
  /**
   * descrip...
   * ____
   * @param
   * ____
   * @returns ``
   *
   */
  protected abstract primitiveCreateByBag(
    literalBagDriver: IBagForDriver
  ): Promise<any>;
  /**
   * descrip...
   * ____
   * @param
   * ____
   * @returns ``
   *
   */
  protected abstract primitiveUpdateByBag(
    literalBagDriver: IBagForDriver
  ): Promise<any>;
  /**
   * descrip...
   * ____
   * @param
   * ____
   * @returns ``
   *
   */
  protected abstract primitiveDeleteByBag(
    literalBagDriver: IBagForDriver
  ): Promise<any>;
  /**
   * descrip...
   * ____
   * @param
   * ____
   * @returns ``
   *
   */
  protected abstract structureReadByBag(
    literalBagDriver: IBagForDriver
  ): Promise<any>;
  /**
   * descrip...
   * ____
   * @param
   * ____
   * @returns ``
   *
   */
  protected abstract structureCreateByBag(
    literalBagDriver: IBagForDriver
  ): Promise<any>;
  /**
   * descrip...
   * ____
   * @param
   * ____
   * @returns ``
   *
   */
  protected abstract structureUpdateByBag(
    literalBagDriver: IBagForDriver
  ): Promise<any>;
  /**
   * descrip...
   * ____
   * @param
   * ____
   * @returns ``
   *
   */
  protected abstract structureDeleteByBag(
    literalBagDriver: IBagForDriver
  ): Promise<any>;
}
