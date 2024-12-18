import { HandlerModule } from "../config/module";
import { TKeyLogicContext } from "../config/shared-modules";
import { ELogicCodeError, LogicError } from "../errors/logic-error";
import { IResponse } from "../reports/shared";
import { Util_Bag } from "./_util-bag";
import { IBagModule } from "./shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**refactorizacion de la clase */
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
      literalCriteria: undefined,
      responses: [],
    } as IBagModule<any>;
  };
  /**clave identificadora del contexto del modulo */
  public abstract get keyModuleContext(): unknown;
  private _data: any;
  public get data(): any {
    return this._data;
  }
  public set data(value: any) {
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
  private _responses: IResponse[];
  public get responses(): IResponse[] {
    const r = [...this._responses]; //clonacion sencilla
    return r;
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
    baseBag: Partial<Pick<BagModule, "data" | "criteriaHandler" | "responses">>
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
    const { data, responses } = baseBag;
    this._data = data;
    this._firstData = data;
    this._criteriaHandler = baseBag.criteriaHandler;
    this._responses = this.util.isArray(responses) ? responses : df.responses;
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
}
