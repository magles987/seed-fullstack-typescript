import { ELogicCodeError, LogicError } from "../../../../../errors/logic-error";
import {
  ELogicResStatusCode,
  IDriverResponse,
  IGenericDriverResponse,
} from "../../../../../reports/shared-types";
import {
  buildIdByStrategy,
  isIdValid,
  TOptionForAutoincrement,
} from "../../../../../util/default-generators-id-fn";
import { QueryTool } from "../../../../../util/query-tool";
import {
  IGenericDriverCriteria,
  TPrimitiveLiteralCriteriaUnion,
  TPrimitiveModifyLiteralCriteria,
  TPrimitiveReadLiteralCriteria,
  TStructureLiteralCriteriaUnion,
  TStructureModifyLiteralCriteria,
  TStructureReadLiteralCriteria,
} from "../../../../../criterias/shared-types";
import { WebDriver } from "../_web-driver";
import { TwinBeeModule } from "../../../../../modules/module";

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
    const util = TwinBeeModule.util;
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
      keyId: TwinBeeModule._globalConfig_.keyId,
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
  protected override buildDriverResponse(
    literalCriteria: IGenericDriverCriteria,
    anyResponse: {
      /**data recibida */
      rxData: any;
      /**objeto literal de posible error */
      error?: any;
    }
  ): IGenericDriverResponse {
    const { rxData, error } = anyResponse;
    const dfValue = this.util.dfValue;
    let driverRes = {} as IGenericDriverResponse;
    if (this.util.isUndefinedOrNull(error)) {
      driverRes = {
        data: rxData,
        details: {
          status: ELogicResStatusCode.SUCCESS,
        },
      };
    } else {
      driverRes = {
        data: dfValue,
        details: {
          status: ELogicResStatusCode.ERROR,
        },
        error,
      };
    }
    return driverRes;
  }
  protected override buildDriverResponseModule(
    literalCriteria:
      | TPrimitiveLiteralCriteriaUnion
      | TStructureLiteralCriteriaUnion<any>,
    anyResponse: {
      /**data recibida */
      rxData: any;
      /**objeto literal de posible error */
      error?: any;
    }
  ): IDriverResponse {
    const { expectedDataType } = literalCriteria;
    const { rxData, error } = anyResponse;
    const dfValue = this.util.dfValue;
    let driverRes = {} as IDriverResponse;
    //verificar si hubo error interno en el driver o en su servicio interno
    if (this.util.isUndefinedOrNull(error)) {
      //verificar integrida de datos recibidos
      const isCheckData = this.checkRxDataByCriteriaModule(
        rxData,
        expectedDataType
      );
      if (isCheckData) {
        driverRes = {
          data: rxData,
          status: ELogicResStatusCode.SUCCESS,
          msn: `ok`,
        };
      } else {
        driverRes = {
          data: dfValue,
          status: ELogicResStatusCode.BAD,
          msn: `data has not been as expected`,
          details: { rxData, detail: `data has not been as expected` },
          error,
        };
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
      driverRes = {
        data: dfValue,
        status: ELogicResStatusCode.ERROR,
        msn: this.util.isObject(error)
          ? (error as Error).message ?? `internal error in local driver`
          : this.util.isString(error)
          ? error
          : `internal error in local driver`,
        details: {
          rxData: dfValue,
          detail: `data has not been as expected`,
        },
        error,
      };
    }
    return driverRes;
  }
  public override async sendRequestByCriteria(
    literalCriteria: IGenericDriverCriteria
  ): Promise<IGenericDriverResponse> {
    let driverRes: IGenericDriverResponse;
    this.preRequestByCriteria(literalCriteria);
    try {
      let rxData = await this.selectCRUDRunByLiteralCriteria(literalCriteria);
      driverRes = this.buildDriverResponse(literalCriteria, {
        rxData,
      });
    } catch (error) {
      driverRes = this.buildDriverResponse(literalCriteria, {
        rxData: this.util.dfValue,
        error,
      });
    } finally {
      this.postRequestByResponse(driverRes);
    }
    return driverRes;
  }
  public override async sendRequestByCriteriaModule(
    literalCriteria:
      | TPrimitiveLiteralCriteriaUnion
      | TStructureLiteralCriteriaUnion<any>
  ): Promise<IDriverResponse> {
    let driverRes: IDriverResponse;
    this.preRequestByCriteriaModule(literalCriteria);
    try {
      let rxData = await this.selectCRUDRunByLiteralCriteriaModule(
        literalCriteria
      );
      driverRes = this.buildDriverResponseModule(literalCriteria, {
        rxData,
      });
    } catch (error) {
      driverRes = this.buildDriverResponseModule(literalCriteria, {
        rxData: this.util.dfValue,
        error,
      });
    } finally {
      this.postRequestByResponseModule(driverRes);
    }
    return driverRes;
  }
  protected override preRequestByCriteria(
    literalCriteria: IGenericDriverCriteria
  ): void {
    super.preRequestByCriteria(literalCriteria);
    return;
  }
  protected override postRequestByResponse(
    driverRes: IGenericDriverResponse
  ): void {
    super.postRequestByResponse(driverRes);
    return;
  }
  protected override preRequestByCriteriaModule(
    literalCriteria:
      | TPrimitiveLiteralCriteriaUnion
      | TStructureLiteralCriteriaUnion<any>
  ): void {
    super.preRequestByCriteriaModule(literalCriteria);
    return;
  }
  protected override postRequestByResponseModule(
    driverRes: IDriverResponse
  ): void {
    super.postRequestByResponseModule(driverRes);
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
  //████ CRUD ██████████████████████████████████████████████████████████████████████
  /**... */
  protected async selectCRUDRunByLiteralCriteria(
    literalCriteria: IGenericDriverCriteria
  ): Promise<any> {
    const { type } = literalCriteria;
    let rxData: any;
    if (type === "read") {
      const {} = literalCriteria as TPrimitiveReadLiteralCriteria;
      rxData = await this.readByLiteralCriteria(
        literalCriteria as TPrimitiveReadLiteralCriteria
      );
    } else if (type === "modify") {
      const { modifyType } = literalCriteria as TPrimitiveModifyLiteralCriteria;
      if (modifyType === "create") {
        rxData = await this.createByLiteralCriteria(
          literalCriteria as TPrimitiveModifyLiteralCriteria
        );
      } else if (modifyType === "update") {
        rxData = await this.updateByLiteralCriteria(
          literalCriteria as TPrimitiveModifyLiteralCriteria
        );
      } else if (modifyType === "delete") {
        rxData = await this.deleteByLiteralCriteria(
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
  protected abstract readByLiteralCriteria(
    literalCriteria: IGenericDriverCriteria
  ): Promise<any>;
  /**
   * descrip...
   * ____
   * @param
   * ____
   * @returns ``
   *
   */
  protected abstract createByLiteralCriteria(
    literalCriteria: IGenericDriverCriteria
  ): Promise<any>;
  /**
   * descrip...
   * ____
   * @param
   * ____
   * @returns ``
   *
   */
  protected abstract updateByLiteralCriteria(
    literalCriteria: IGenericDriverCriteria
  ): Promise<any>;
  /**
   * descrip...
   * ____
   * @param
   * ____
   * @returns ``
   *
   */
  protected abstract deleteByLiteralCriteria(
    literalCriteria: IGenericDriverCriteria
  ): Promise<any>;
  //████ CRUD BY MODULE ████████████████████████████████████████████████████████████
  /**... */
  protected async selectCRUDRunByLiteralCriteriaModule(
    literalCriteria:
      | TPrimitiveLiteralCriteriaUnion
      | TStructureLiteralCriteriaUnion<any>
  ): Promise<any> {
    const { type, keyLogicContext } = literalCriteria;
    let rxData: any;
    if (keyLogicContext === "primitive") {
      if (type === "read") {
        const {} = literalCriteria as TPrimitiveReadLiteralCriteria;
        rxData = await this.primitiveReadByLiteralCriteriaModule(
          literalCriteria as TPrimitiveReadLiteralCriteria
        );
      } else if (type === "modify") {
        const { modifyType } =
          literalCriteria as TPrimitiveModifyLiteralCriteria;
        if (modifyType === "create") {
          rxData = await this.primitiveCreateByLiteralCriteriaModule(
            literalCriteria as TPrimitiveModifyLiteralCriteria
          );
        } else if (modifyType === "update") {
          rxData = await this.primitiveUpdateByLiteralCriteriaModule(
            literalCriteria as TPrimitiveModifyLiteralCriteria
          );
        } else if (modifyType === "delete") {
          rxData = await this.primitiveDeleteByLiteralCriteriaModule(
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
        rxData = await this.structureReadByLiteralCriteriaModule(
          literalCriteria as TStructureModifyLiteralCriteria<any>
        );
      } else if (type === "modify") {
        const { modifyType } =
          literalCriteria as TStructureModifyLiteralCriteria<any>;
        if (modifyType === "create") {
          rxData = await this.structureCreateByLiteralCriteriaModule(
            literalCriteria as TStructureModifyLiteralCriteria<any>
          );
        } else if (modifyType === "update") {
          rxData = await this.structureUpdateByLiteralCriteriaModule(
            literalCriteria as TStructureModifyLiteralCriteria<any>
          );
        } else if (modifyType === "delete") {
          rxData = await this.structureDeleteByLiteralCriteriaModule(
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
  protected abstract primitiveReadByLiteralCriteriaModule(
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
  protected abstract primitiveCreateByLiteralCriteriaModule(
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
  protected abstract primitiveUpdateByLiteralCriteriaModule(
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
  protected abstract primitiveDeleteByLiteralCriteriaModule(
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
  protected abstract structureReadByLiteralCriteriaModule(
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
  protected abstract structureCreateByLiteralCriteriaModule(
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
  protected abstract structureUpdateByLiteralCriteriaModule(
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
  protected abstract structureDeleteByLiteralCriteriaModule(
    literalCriteria: TStructureModifyLiteralCriteria<any>
  ): Promise<any>;
}
