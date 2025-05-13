import { ActionModule, TKeyLogicContext } from "../modules/index-barrel";
import { CriteriaHandler } from "../criterias/index-barrel";
import { ELogicCodeError, LogicError } from "../errors/index-barrel";
import { ELogicResStatusCode, IResponse } from "../reports/index-barrel";
import { Driver, TDriverList } from "./_drivers/index-barrel";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** */
export abstract class LogicProvider<TIDiccAC> extends ActionModule<TIDiccAC> {
  /** configuración de valores predefinidos para el modulo*/
  public static readonly getDefault = () => {
    const superDf = ActionModule.getDefault();
    return {
      ...superDf,
      globalTolerance: ELogicResStatusCode.INVALID_DATA, //personalizada para provider
      driverList: [] as Array<Driver | [string, object?]>, //tipado de array especial que indica NO se permite inicializar con vacíos
    };
  };
  /**... */
  private _driverList: TDriverList; //tipado de array especial que indica NO se permite inicializar con vacíos
  public get driverList(): typeof this._driverList {
    return this._driverList;
  }
  /**... */
  protected set driverList(v: typeof this._driverList) {
    this._driverList = this.util.isArray(v)
      ? v
      : this._driverList !== undefined
      ? this._driverList
      : (this.getDefault().driverList as any);
    return;
  }
  /**
   * @param keyLogicContext el contexto lógico de esta librería
   */
  constructor(
    keyLogicContext: TKeyLogicContext,
    baseConfig?: Partial<
      Pick<
        ReturnType<LogicProvider<TIDiccAC>["getDefault"]>,
        | "diccActionConfig"
        | "topMandatoryKeysAction"
        | "topPriorityKeysAction"
        | "driverList"
      >
    >
  ) {
    super("provider", keyLogicContext, baseConfig);
    baseConfig = this.util.isObject(baseConfig) ? baseConfig : ({} as any);
    //construcción de driverlist
    this.driverList = this.buildDriverList(baseConfig.driverList);
  }
  protected override getDefault() {
    return LogicProvider.getDefault();
  }
  public override preRunAction(
    criteriaHandler: CriteriaHandler,
    keyActionConfig: keyof TIDiccAC
  ): void {
    return;
  }
  public override postRunAction(
    criteriaHandler: CriteriaHandler,
    res: IResponse
  ): void {
    //mutar data de res a criteriaHandler
    criteriaHandler.data = res.data;
    return;
  }
  /**crear un nuevo driver a partir de una tupla `[nameDriver, baseConfig]` */
  protected buildDriverByTupleBase(tBaseConfig: [string, object]): Driver {
    const GC = this._globalConfig_;
    const { diccModuleFactory } = GC;
    const { primitiveModuleFactory, structureModuleFactory } =
      diccModuleFactory;
    const [nameDriver, baseConfig] = tBaseConfig;
    let newDriver: Driver;
    if (this.keyLogicContext === "primitive") {
      newDriver = primitiveModuleFactory.makeDriverInstance(
        nameDriver,
        baseConfig
      );
    } else if (this.keyLogicContext === "structure") {
      newDriver = structureModuleFactory.makeDriverInstance(
        nameDriver,
        baseConfig
      );
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${this.keyLogicContext} is not logic context key valid`,
      });
    }
    return newDriver;
  }
  /**... */
  private buildDriverList(
    preList: Array<Driver | [string, object?]>
  ): typeof this._driverList {
    if (!this.util.isArray(preList, true)) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${preList} is not array list of drivers valid`,
      });
    }
    let rDriverList = [] as unknown as typeof this._driverList;
    preList.forEach((driverOrTBase) => {
      if (this.util.isInstance(driverOrTBase)) {
        rDriverList.push(driverOrTBase as Driver);
      } else if (this.util.isTuple(driverOrTBase, [1, 2])) {
        const newDriver = this.buildDriverByTupleBase(
          driverOrTBase as [string, object]
        );
        rDriverList.push(newDriver);
      } else {
        throw new LogicError({
          code: ELogicCodeError.MODULE_ERROR,
          msn: `${driverOrTBase} is not driver valid`,
        });
      }
    });
    return rDriverList;
  }
  /**... */
  public getDriverList(): typeof this._driverList {
    let drList = [] as any as typeof this._driverList;
    //clonación especial para garantizar no modificar la lista de drivers original
    this._driverList.forEach((driver) => drList.push(driver));
    return drList;
  }
  /**obtiene la lista de drivers seleccionados
   * @param namesLogicDriverToFind array de nombres de
   * Drivers para usar
   * @returns listado de drivers seleccionados
   */
  public getDriverByNameLogicDriver(
    namesLogicDriverToFind: string[]
  ): typeof this._driverList;
  /**obtiene la lista de drivers seleccionados
   * @param nameLogicDriverToFind array de nombres de
   * Drivers para usar
   * @returns el driver seleccionado
   */
  public getDriverByNameLogicDriver(nameLogicDriverToFind: string): Driver;
  public getDriverByNameLogicDriver(
    namesLogicDriverToFind: string | string[]
  ): unknown {
    namesLogicDriverToFind = Array.isArray(namesLogicDriverToFind)
      ? namesLogicDriverToFind
      : [namesLogicDriverToFind];
    this._driverList;
    let driversListFound: Driver | typeof this._driverList = [] as any;
    if (namesLogicDriverToFind.length === 1) {
      driversListFound = this._driverList.find((d) =>
        namesLogicDriverToFind.includes(d.nameLogicDriver)
      ) as any;
    } else {
      driversListFound = this._driverList.filter((d) =>
        namesLogicDriverToFind.includes(d.nameLogicDriver)
      ) as any;
    }
    return driversListFound;
  }
  /**... */
  public static getControlReduceStatusDriverResponse(
    cStt: ELogicResStatusCode,
    nStt: ELogicResStatusCode
  ): ELogicResStatusCode {
    let stateStatus: ELogicResStatusCode;
    if (
      cStt === ELogicResStatusCode.ERROR ||
      nStt >= ELogicResStatusCode.ERROR
    ) {
      stateStatus = ELogicResStatusCode.ERROR;
    } else if (
      cStt === ELogicResStatusCode.BAD ||
      nStt >= ELogicResStatusCode.BAD
    ) {
      stateStatus = ELogicResStatusCode.BAD;
    } else if (
      cStt === ELogicResStatusCode.WARNING ||
      nStt >= ELogicResStatusCode.WARNING
    ) {
      stateStatus = ELogicResStatusCode.WARNING;
    } else {
      stateStatus = ELogicResStatusCode.SUCCESS;
    }
    return stateStatus;
  }
  /**
   * @returns el estado de respuesta reducido
   * segun criterio de este modulo
   */
  public static getControlReduceStatusResponse(
    cStt: ELogicResStatusCode,
    nStt: ELogicResStatusCode
  ): ELogicResStatusCode {
    let stateStatus: ELogicResStatusCode;
    if (
      cStt === ELogicResStatusCode.ERROR ||
      nStt >= ELogicResStatusCode.ERROR
    ) {
      stateStatus = ELogicResStatusCode.ERROR;
    } else if (
      cStt === ELogicResStatusCode.BAD ||
      nStt >= ELogicResStatusCode.BAD
    ) {
      stateStatus = ELogicResStatusCode.BAD;
    } else if (
      cStt === ELogicResStatusCode.WARNING ||
      nStt >= ELogicResStatusCode.WARNING
    ) {
      stateStatus = ELogicResStatusCode.WARNING;
    } else {
      stateStatus = ELogicResStatusCode.SUCCESS;
    }
    return stateStatus;
  }
}
