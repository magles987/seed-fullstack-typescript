import { getGlobalConfig } from "../../../../../config/index-barrel";
import { Module } from "../../../../../modules/module";
import { ELogicCodeError, LogicError } from "../../../../../errors/logic-error";
import {
  ELogicResStatusCode,
  IDriverResponse,
} from "../../../../../reports/shared-types";
import {
  buildIdByStrategy,
  isIdValid,
  TOptionForAutoincrement,
} from "../../../../../util/default-generators-id-fn";
import { QueryTool } from "../../../../../util/query-tool";
import {
  TPrimitiveLiteralCriteriaUnion,
  TPrimitiveModifyLiteralCriteria,
  TPrimitiveReadLiteralCriteria,
  TStructureLiteralCriteriaUnion,
  TStructureModifyLiteralCriteria,
  TStructureReadLiteralCriteria,
} from "../../../shared-types";
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
    expectDataType: (
      | TPrimitiveLiteralCriteriaUnion
      | TStructureLiteralCriteriaUnion<any>
    )["expectedDataType"]
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
    literalCriteria:
      | TPrimitiveLiteralCriteriaUnion
      | TStructureLiteralCriteriaUnion<any>,
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
    literalCriteria:
      | TPrimitiveLiteralCriteriaUnion
      | TStructureLiteralCriteriaUnion<any>
  ): Promise<IDriverResponse> {
    let driverRes: IDriverResponse;
    try {
      this.preRequestFromService(literalCriteria);
      let rxData = await this.selectCRUDRunByLiteralCriteria(literalCriteria);
      driverRes = this.buildDriverResponse(literalCriteria, rxData);
    } catch (error) {
      driverRes = this.buildDriverResponse(
        literalCriteria,
        this.util.dfValue,
        error
      );
    }
    this.postRequestFromService(driverRes);
    return driverRes;
  }
  protected override preRequestFromService(
    literalCriteria:
      | TPrimitiveLiteralCriteriaUnion
      | TStructureLiteralCriteriaUnion<any>
  ): void {
    super.preRequestFromService(literalCriteria);
    return;
  }
  protected override postRequestFromService(driverRes: IDriverResponse): void {
    super.postRequestFromService(driverRes);
    return;
  }
  /**construir id si es necesario */
  protected buildStructureLocalId(
    registers: any[],
    possibleId: any,
    customValidFn?: Function
  ): any {
    const { strategyForIdBuild } = this._globalConfig_;
    const isId = isIdValid(possibleId, customValidFn as any);
    if (!isId) {
      let id;
      if (strategyForIdBuild === "df_autoincrement") {
        const kId = this.keyId;
        //autoincremento tiene tratamiento especial
        let ids = registers.map((reg) => reg[kId]).sort(); //ordenamiento básico
        const option = {
          lastId: this.util.getArrayItem(ids, -1),
        } as TOptionForAutoincrement;
        id = buildIdByStrategy(strategyForIdBuild, option);
      } else {
        id = buildIdByStrategy(strategyForIdBuild);
      }
      return id;
    }
    return possibleId;
  }
  //████ CRUD by Bag ████████████████████████████████████████████████████████████
  /**... */
  protected async selectCRUDRunByLiteralCriteria(
    literalCriteria:
      | TPrimitiveLiteralCriteriaUnion
      | TStructureLiteralCriteriaUnion<any>
  ): Promise<any> {
    const { type, keyLogicContext } = literalCriteria;
    let rxData: any;
    if (keyLogicContext === "primitive") {
      if (type === "read") {
        const {} = literalCriteria as TPrimitiveReadLiteralCriteria;
        rxData = await this.primitiveReadByLiteralCriteria(
          literalCriteria as TPrimitiveReadLiteralCriteria
        );
      } else if (type === "modify") {
        const { modifyType } =
          literalCriteria as TPrimitiveModifyLiteralCriteria;
        if (modifyType === "create") {
          rxData = await this.primitiveCreateByLiteralCriteria(
            literalCriteria as TPrimitiveModifyLiteralCriteria
          );
        } else if (modifyType === "update") {
          rxData = await this.primitiveUpdateByLiteralCriteria(
            literalCriteria as TPrimitiveModifyLiteralCriteria
          );
        } else if (modifyType === "delete") {
          rxData = await this.primitiveDeleteByLiteralCriteria(
            literalCriteria as TPrimitiveModifyLiteralCriteria
          );
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
        const {} = literalCriteria as TStructureReadLiteralCriteria<any>;
        rxData = await this.structureReadByLiteralCriteria(
          literalCriteria as TStructureModifyLiteralCriteria<any>
        );
      } else if (type === "modify") {
        const { modifyType } =
          literalCriteria as TStructureModifyLiteralCriteria<any>;
        if (modifyType === "create") {
          rxData = await this.structureCreateByLiteralCriteria(
            literalCriteria as TStructureModifyLiteralCriteria<any>
          );
        } else if (modifyType === "update") {
          rxData = await this.structureUpdateByLiteralCriteria(
            literalCriteria as TStructureModifyLiteralCriteria<any>
          );
        } else if (modifyType === "delete") {
          rxData = await this.structureDeleteByLiteralCriteria(
            literalCriteria as TStructureModifyLiteralCriteria<any>
          );
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
  protected abstract primitiveReadByLiteralCriteria(
    literalCriteria: TPrimitiveReadLiteralCriteria
  ): Promise<any>;
  /**
   * descrip...
   * ____
   * @param
   * ____
   * @returns ``
   *
   */
  protected abstract primitiveCreateByLiteralCriteria(
    literalCriteria: TPrimitiveModifyLiteralCriteria
  ): Promise<any>;
  /**
   * descrip...
   * ____
   * @param
   * ____
   * @returns ``
   *
   */
  protected abstract primitiveUpdateByLiteralCriteria(
    literalCriteria: TPrimitiveModifyLiteralCriteria
  ): Promise<any>;
  /**
   * descrip...
   * ____
   * @param
   * ____
   * @returns ``
   *
   */
  protected abstract primitiveDeleteByLiteralCriteria(
    literalCriteria: TPrimitiveModifyLiteralCriteria
  ): Promise<any>;
  /**
   * descrip...
   * ____
   * @param
   * ____
   * @returns ``
   *
   */
  protected abstract structureReadByLiteralCriteria(
    literalCriteria: TStructureModifyLiteralCriteria<any>
  ): Promise<any>;
  /**
   * descrip...
   * ____
   * @param
   * ____
   * @returns ``
   *
   */
  protected abstract structureCreateByLiteralCriteria(
    literalCriteria: TStructureModifyLiteralCriteria<any>
  ): Promise<any>;
  /**
   * descrip...
   * ____
   * @param
   * ____
   * @returns ``
   *
   */
  protected abstract structureUpdateByLiteralCriteria(
    literalCriteria: TStructureModifyLiteralCriteria<any>
  ): Promise<any>;
  /**
   * descrip...
   * ____
   * @param
   * ____
   * @returns ``
   *
   */
  protected abstract structureDeleteByLiteralCriteria(
    literalCriteria: TStructureModifyLiteralCriteria<any>
  ): Promise<any>;
}
