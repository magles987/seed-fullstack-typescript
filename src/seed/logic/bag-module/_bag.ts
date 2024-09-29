import { HandlerModule } from "../config/module";
import { TKeyLogicContext } from "../config/shared-modules";
import { ELogicCodeError, LogicError } from "../errors/logic-error";
import { IMiddlewareReportStatus } from "../middleware/module/shared";
import { IResponse } from "../reports/shared";
import { Util_Bag } from "./_util-bag";
import {
  IBagModule,
  IDiccKeyGlobalContextAction,
  ISchemaSingleBuildGlobalAction,
  TKeysGlobal,
} from "./shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**... */
export type Trf_BagModule = BagModule;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *abstract*
 * clase bag para crear instancia que será
 * enviada a traves de toda la peticion
 */
export abstract class BagModule extends HandlerModule {
  /** configuracion de valores predefinidos para el modulo*/
  public static readonly getDefault = () => {
    return {
      data: undefined,
      keySrc: undefined,
      literalCriteria: undefined,
      aTupleGlobalActionConfig: [],
      responses: [],
      middlewareReportStatus: undefined,
    } as IBagModule<any>;
  };
  /**clave identificadora del contexto del modulo */
  public abstract get keyModuleContext(): unknown;
  private _data: any;
  public get data(): any {
    return this._data;
  }
  public set data(value: any) {
    this._snapShotsdata.push(value); //❓Realmente se necesita❓, porque consume mucho recurso
    this._data = value;
  }
  /**... */
  private _firstData: any;
  /**contiene el primer dato recibido
   * al momento de contruir el bag, este
   * dato nunca se muta ni valida, ni se
   * toma para realizar proceso, solo es
   *  referencial */
  public get firstData(): any {
    return this._firstData;
  }
  private _criteriaHandler: unknown;
  public get criteriaHandler(): unknown {
    return this._criteriaHandler;
  }
  protected set criteriaHandler(criteriaHandler: unknown) {
    this._criteriaHandler = criteriaHandler;
  }
  private _aTupleGlobalActionConfig: Array<[string, unknown]>;
  public get aTupleGlobalActionConfig(): Array<[string, unknown]> {
    return [...this._aTupleGlobalActionConfig];
  }
  protected set aTupleGlobalActionConfig(v: Array<[string, unknown]>) {
    this._aTupleGlobalActionConfig = v;
  }
  private _responses: IResponse[];
  public get responses(): IResponse[] {
    const r = [...this._responses]; //clonacion sencilla
    return r;
  }
  /**reporte del estado actual del middleware */
  private _middlewareReportStatus = {} as IMiddlewareReportStatus;
  public get middlewareReportStatus(): IMiddlewareReportStatus {
    const r = this.util.clone(this._middlewareReportStatus, "lodash"); //clonacion fuerte
    return r;
  }
  public set middlewareReportStatus(value: IMiddlewareReportStatus) {
    if (!this.util.isObject(value)) return;
    this._middlewareReportStatus = value;
  }
  /**almacena instantaneas de las diferentes modificaciones
   * que sufrió el dato durante la peticions */
  private _snapShotsdata: any[] = [];
  public get snapShotsData(): any[] {
    return [...this._snapShotsdata];
  }
  protected override readonly util = Util_Bag.getInstance();
  /**
   * @param keyLogicContext contexto logico (primitivo o estructurado).
   * @param keySrc indentificadora del recurso asociado a modulo
   * @param baseBag parametros iniciales (si se desea personalizar) para construir el bag
   *
   */
  constructor(
    keyLogicContext: TKeyLogicContext,
    keySrc: string,
    baseBag: Partial<BagModule>
  ) {
    super("bag", keyLogicContext, keySrc);
    this.util = Util_Bag.getInstance();
    if (!this.util.isObject(baseBag)) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${baseBag} is not base bag valid`,
      });
    }
    const df = this.getDefault();
    const {
      data,
      responses,
      aTupleGlobalActionConfig,
      middlewareReportStatus,
    } = baseBag;
    this._data = data;
    this._firstData = data;
    this._criteriaHandler = baseBag.criteriaHandler;
    this._aTupleGlobalActionConfig = this.util.isArrayTuple(
      aTupleGlobalActionConfig,
      [1, 2]
    )
      ? aTupleGlobalActionConfig
      : df.aTupleGlobalActionConfig;
    this._responses = this.util.isArray(responses) ? responses : df.responses;
    this._middlewareReportStatus = this.util.isObject(middlewareReportStatus)
      ? middlewareReportStatus
      : df.middlewareReportStatus;
  }
  /**@returns los valores de configuracion predefinidos */
  protected override getDefault() {
    return BagModule.getDefault();
  }
  /**obtener un objeto bag literal (solo para resultados) */
  public abstract getLiteralBag(): unknown;
  /**adiciona un nuevo reporte (al array de reportes embebidos)
   *
   * @param embResponse el reporte enbebido a adicionar
   */
  public addEmbResponse(embResponse: IResponse): void {
    this._responses.push(embResponse);
    this.util.charSeparatorLogicPath;
    return;
  }
  /**... */
  public addTupleGlobalActionConfig(
    aTupleGlobalAC: [string, [unknown, unknown]]
  ): void {
    if (!this.util.isTuple(aTupleGlobalAC, 2)) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${aTupleGlobalAC} is not tuple global action config valid`,
      });
    }
    if (!this.util.isTuple(aTupleGlobalAC[1], 2)) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${aTupleGlobalAC[1]} is not tuple action config valid`,
      });
    }
    this._aTupleGlobalActionConfig.push(aTupleGlobalAC);
    return;
  }
  /**... */
  public getDiccKeysGlobalFromTupleGlobal(tGlobalAC: [string, any]): unknown {
    if (!this.util.isTuple(tGlobalAC, [1, 2])) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${tGlobalAC} is not valid tuple action config`,
      });
    }
    const [keyGlobalFull, tAC] = tGlobalAC;
    const tKeysFull = this.util.getTKeysFullGlobalAction(keyGlobalFull);
    const [keyModule, keyModuleContext, keyAction] = tKeysFull;
    const diccKey = {
      keyModule,
      keyModuleContext,
      keyAction,
    } as IDiccKeyGlobalContextAction<any>;
    return diccKey as any;
  }
  /**... */
  public extractKeyContextFromKeyGlobalAction(
    keyContext: TKeysGlobal,
    tGlobalAC: [string, any]
  ): string {
    if (!this.util.isTuple(tGlobalAC, [1, 2])) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${tGlobalAC} is not valid tuple action config`,
      });
    }
    const keyGlobalFull = tGlobalAC[0];
    const tKeysFull = this.util.getTKeysFullGlobalAction(keyGlobalFull);
    let extractKey = "";
    if (keyContext === "keyModule") extractKey = tKeysFull[0];
    else if (keyContext === "keyModuleContext") extractKey = tKeysFull[1];
    else if (keyContext === "keyAction") extractKey = tKeysFull[2];
    else
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${keyContext} is not valid context for extract key`,
      });
    return extractKey;
  }
  /** */
  public buildTupleGlobalActionConfig(
    schemaGlobalAC: ISchemaSingleBuildGlobalAction<any, any>
  ): [string, [any, any]] {
    const r = BagModule.buildTupleGlobalActionConfig(schemaGlobalAC);
    return r;
  }
  /**... */
  public static buildTupleGlobalActionConfig(
    schemaGlobalAC: ISchemaSingleBuildGlobalAction<any, any>
  ): [string, [any, any]] {
    const util = Util_Bag.getInstance();
    if (!util.isObject(schemaGlobalAC)) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${schemaGlobalAC} is not schema global action config valid`,
      });
    }
    const { actionModule, keyAction, actionConfig, builderACOption } =
      schemaGlobalAC;
    if (!util.isInstance(actionModule)) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${actionModule} is not action module instance valid`,
      });
    }
    if (!util.isString(keyAction)) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${keyAction} is not key action valid`,
      });
    }
    const sp = util.charSeparatorBagGlobalKeyAction;
    const keyModule = actionModule.keyModule;
    const keyActionModuleContext = actionModule.keyModuleContext;
    let keyGlobal = util.buildGenericPathFromArray(
      [keyModule, keyActionModuleContext, keyAction],
      { charSeparator: sp }
    );
    const tupleAC = actionModule.buildSingleActionConfig(
      "toTupleActionConfig",
      keyAction as any,
      actionConfig as any,
      builderACOption
    );
    const tGlobalAC = [keyGlobal, tupleAC] as [string, [unknown, unknown]];
    return tGlobalAC;
  }
  /**... */
  public buildATupleGlobalActionConfig(
    aSquemaGlobalAC: Array<ISchemaSingleBuildGlobalAction<any, any>>
  ): Array<[string, [any, any]]> {
    const r = BagModule.buildATupleGlobalActionConfig(aSquemaGlobalAC);
    return r;
  }
  /**... */
  public static buildATupleGlobalActionConfig(
    aSquemaGlobalAC: Array<ISchemaSingleBuildGlobalAction<any, any>>
  ): Array<[string, [any, any]]> {
    const util = Util_Bag.getInstance();
    if (!util.isArray(aSquemaGlobalAC)) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${aSquemaGlobalAC} is not array of global action config schema valid`,
      });
    }
    const aTGlobalAC = aSquemaGlobalAC.map((sGAC) => {
      if (!util.isObject(sGAC)) {
        throw new LogicError({
          code: ELogicCodeError.MODULE_ERROR,
          msn: `${sGAC} is not global action config schema valid`,
        });
      }
      return BagModule.buildTupleGlobalActionConfig(sGAC);
    });
    return aTGlobalAC;
  }
  /**
   * construye un array de tuplas de configuracion
   * de accion en contexto de modulo, a partir de un array de tuplas
   * de acciones de configuracion
   *
   * ⚠Internamente **reconstruye** el array de tuplas de accion⚠
   * esto garantiza que habrá fusion de acciones de configuracion
   * pero consume mas recursos
   *
   * @param actionModule la instancia del modulo de
   * accion son el cual se reconstruye el array de
   * tuplas de accion
   *
   * @param aTupleAC el array de tuplas de accion
   * correspondiente al modulo
   *
   * @returns un array de tuplas global de acciones de configuracion
   */
  public buildATupleModuleContextActionConfigFromATupleAC(
    actionModule: ISchemaSingleBuildGlobalAction<any, any>["actionModule"],
    aTupleAC: Array<[any, any]>,
    builderACOption?: ISchemaSingleBuildGlobalAction<
      any,
      any
    >["builderACOption"]
  ): Array<[string, [any, any]]> {
    return BagModule.buildATupleModuleContextActionConfigFromATupleAC(
      actionModule,
      aTupleAC,
      builderACOption
    );
  }
  /**
   * construye un array de tuplas de configuracion
   * de accion en contexto de modulo, a partir de un array de tuplas
   * de acciones de configuracion
   *
   * ⚠Internamente **reconstruye** el array de tuplas de accion⚠
   * esto garantiza que habrá fusion de acciones de configuracion
   * pero consume mas recursos
   *
   * @param actionModule la instancia del modulo de
   * accion son el cual se reconstruye el array de
   * tuplas de accion
   *
   * @param aTupleAC el array de tuplas de accion
   * correspondiente al modulo
   *
   * @returns un array de tuplas global de acciones de configuracion
   */
  public static buildATupleModuleContextActionConfigFromATupleAC(
    actionModule: ISchemaSingleBuildGlobalAction<any, any>["actionModule"],
    aTupleAC: Array<[any, any]>,
    builderACOption?: ISchemaSingleBuildGlobalAction<
      any,
      any
    >["builderACOption"]
  ): Array<[string, [any, any]]> {
    const util = Util_Bag.getInstance();
    if (!util.isInstance(actionModule)) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${actionModule} is not instance of action module valid`,
      });
    }
    if (!util.isTuple(aTupleAC, 2)) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${aTupleAC} is not array of tuple of action config valid`,
      });
    }
    const r = aTupleAC.map((tupleAC) => {
      //necesario desarmarla, para enviarla al otro constructor
      const keyAction = tupleAC[0] as string;
      const actionConfig = tupleAC[1];
      const r = BagModule.buildTupleGlobalActionConfig({
        actionModule,
        keyAction,
        actionConfig,
        builderACOption,
      });
      return r;
    });
    return r;
  }
  /**... */
  public filterATupleGlobalActionConfig(
    aTKeysFilter: Array<[any, any?, any?]>,
    customATupleGlobalActionConfig = this.aTupleGlobalActionConfig
  ): Array<[string, unknown]> {
    return BagModule.filterATupleGlobalActionConfig(
      aTKeysFilter,
      customATupleGlobalActionConfig
    );
  }
  /**... */
  public static filterATupleGlobalActionConfig(
    aTKeysFilter: Array<[any, any?, any?]>,
    customATupleGlobalActionConfig: Array<[string, unknown]>
  ): Array<[string, unknown]> {
    const util = Util_Bag.getInstance();
    if (!util.isArrayTuple(aTKeysFilter, [1, 3])) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${aTKeysFilter} is not valid array of tuple for filter`,
      });
    }
    const sp = util.charSeparatorBagGlobalKeyAction;
    const aTGAC = customATupleGlobalActionConfig;
    const rATGAC = aTGAC.filter((tGAC) => {
      const r = aTKeysFilter.some((tKeyF) => {
        const strForRe = util.buildGenericPathFromArray(tKeyF as string[], {
          charSeparator: sp,
          isInitWithSeparator: false,
          pathInit: "^",
        });
        const keyGlobal = tGAC[0];
        const re = new RegExp(strForRe);
        const r = re.test(keyGlobal);
        return r;
      });
      return r;
    });
    return rATGAC;
  }
  /**... */
  public findTupleGlobalActionConfig(
    tKeyFind: [any, any, any?],
    customATupleGlobalActionConfig = this.aTupleGlobalActionConfig
  ): [string, unknown] {
    const rATGAC = this.filterATupleGlobalActionConfig(
      [tKeyFind],
      customATupleGlobalActionConfig
    );
    const rTGAC = this.util.isArrayTuple(rATGAC, 2)
      ? rATGAC[0]
      : (["unknow", null] as [any, any]);
    return rTGAC;
  }
  /**... */
  public static findTupleGlobalActionConfig(
    tKeyFind: [any, any, any?],
    customATupleGlobalActionConfig: Array<[string, unknown]>
  ): [string, unknown] {
    const util = Util_Bag.getInstance();
    const rATGAC = BagModule.filterATupleGlobalActionConfig(
      [tKeyFind],
      customATupleGlobalActionConfig
    );
    const rTGAC = util.isArrayTuple(rATGAC, 2)
      ? rATGAC[0]
      : (["unknow", null] as [any, any]);
    return rTGAC;
  }
  /**recupera una tupla sin envolver desde el array de tuplas global */
  public retrieveTupleActionConfig<TDiccAC, TKeyAction extends keyof TDiccAC>(
    tGlobalAC: [string, [TKeyAction, TDiccAC[TKeyAction]]]
  ): [TKeyAction, TDiccAC[TKeyAction]] {
    const r = tGlobalAC[1];
    return r;
  }
  /**recupera una tupla sin envolver desde el array de tuplas global */
  public retrieveATupleActionConfig<TDiccAC, TKeyAction extends keyof TDiccAC>(
    aTGlobalAC: Array<[string, [TKeyAction, TDiccAC[TKeyAction]]]> = this
      .aTupleGlobalActionConfig as any
  ): Array<[TKeyAction, TDiccAC[TKeyAction]]> {
    const r = aTGlobalAC.map((tGlobalAC) =>
      this.retrieveTupleActionConfig(tGlobalAC)
    );
    return r;
  }
}
