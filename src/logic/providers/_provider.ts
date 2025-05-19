import { CriteriaHandler } from "../criterias/_criteria-handler";
import { ELogicCodeError, LogicError } from "../errors/logic-error";
import { ActionTwinBeeModule } from "../modules/module";
import { TKeyLogicContext } from "../modules/shared-types";
import { ELogicResStatusCode, IResponse } from "../reports/shared-types";
import { Repository } from "./repositories/_repository";
import { TRepositoryList } from "./repositories/shared-types";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** */
export abstract class LogicProvider<
  TIDiccAC
> extends ActionTwinBeeModule<TIDiccAC> {
  /** configuración de valores predefinidos para el modulo*/
  public static readonly getDefault = () => {
    const superDf = ActionTwinBeeModule.getDefault();
    return {
      ...superDf,
      globalTolerance: ELogicResStatusCode.INVALID_DATA, //personalizada para provider
      repositoryList: [] as Array<Repository | [string, object?]>, //tipado de array especial que indica NO se permite inicializar con vacíos
    };
  };
  /**... */
  private _repositoryList: TRepositoryList; //tipado de array especial que indica NO se permite inicializar con vacíos
  public get repositoryList(): typeof this._repositoryList {
    return this._repositoryList;
  }
  /**... */
  protected set repositoryList(v: typeof this._repositoryList) {
    this._repositoryList = this.util.isArray(v)
      ? v
      : this._repositoryList !== undefined
      ? this._repositoryList
      : (this.getDefault().repositoryList as any);
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
        | "repositoryList"
      >
    >
  ) {
    super("provider", keyLogicContext, baseConfig);
    baseConfig = this.util.isObject(baseConfig) ? baseConfig : ({} as any);
    //construcción de repositorylist
    this.repositoryList = this.buildRepositoryList(baseConfig.repositoryList);
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
  /**crear un nuevo repository a partir de una tupla `[nameRepository, baseConfig]` */
  protected buildRepositoryByTupleBase(
    tBaseConfig: [string, object]
  ): Repository {
    const GC = this._globalConfig_;
    const { diccModuleFactory } = GC;
    const { primitiveModuleFactory, structureModuleFactory } =
      diccModuleFactory;
    const [nameRepository, baseConfig] = tBaseConfig;
    let newRepository: Repository;
    if (this.keyLogicContext === "primitive") {
      newRepository = primitiveModuleFactory.makeRepositoryInstance(
        nameRepository,
        baseConfig
      );
    } else if (this.keyLogicContext === "structure") {
      newRepository = structureModuleFactory.makeRepositoryInstance(
        nameRepository,
        baseConfig
      );
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${this.keyLogicContext} is not logic context key valid`,
      });
    }
    return newRepository;
  }
  /**... */
  private buildRepositoryList(
    preList: Array<Repository | [string, object?]>
  ): typeof this._repositoryList {
    if (!this.util.isArray(preList, true)) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${preList} is not array list of repositories valid`,
      });
    }
    let rRepositoryList = [] as unknown as typeof this._repositoryList;
    preList.forEach((repositoryOrTBase) => {
      if (this.util.isInstance(repositoryOrTBase)) {
        rRepositoryList.push(repositoryOrTBase as Repository);
      } else if (this.util.isTuple(repositoryOrTBase, [1, 2])) {
        const newRepository = this.buildRepositoryByTupleBase(
          repositoryOrTBase as [string, object]
        );
        rRepositoryList.push(newRepository);
      } else {
        throw new LogicError({
          code: ELogicCodeError.MODULE_ERROR,
          msn: `${repositoryOrTBase} is not repository valid`,
        });
      }
    });
    return rRepositoryList;
  }
  /**... */
  public getRepositoryList(): typeof this._repositoryList {
    let drList = [] as any as typeof this._repositoryList;
    //clonación especial para garantizar no modificar la lista de repositories original
    this._repositoryList.forEach((repository) => drList.push(repository));
    return drList;
  }
  /**obtiene la lista de repositories seleccionados
   * @param namesLogicRepositoryToFind array de nombres de
   * Repositories para usar
   * @returns listado de repositories seleccionados
   */
  public getRepositoryByNameLogicRepository(
    namesLogicRepositoryToFind: string[]
  ): typeof this._repositoryList;
  /**obtiene la lista de repositories seleccionados
   * @param nameLogicRepositoryToFind array de nombres de
   * Repositories para usar
   * @returns el repository seleccionado
   */
  public getRepositoryByNameLogicRepository(
    nameLogicRepositoryToFind: string
  ): Repository;
  public getRepositoryByNameLogicRepository(
    namesLogicRepositoryToFind: string | string[]
  ): unknown {
    namesLogicRepositoryToFind = Array.isArray(namesLogicRepositoryToFind)
      ? namesLogicRepositoryToFind
      : [namesLogicRepositoryToFind];
    let repositoriesListFound: Repository | typeof this._repositoryList =
      [] as any;
    if (namesLogicRepositoryToFind.length === 1) {
      repositoriesListFound = this._repositoryList.find((d) =>
        namesLogicRepositoryToFind.includes(d.nameLogicRepository)
      ) as any;
    } else {
      repositoriesListFound = this._repositoryList.filter((d) =>
        namesLogicRepositoryToFind.includes(d.nameLogicRepository)
      ) as any;
    }
    return repositoriesListFound;
  }
  /**... */
  public static getControlReduceStatusRepositoryResponse(
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
