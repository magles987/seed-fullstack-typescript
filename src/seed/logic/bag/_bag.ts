import { HandlerModule } from "../config/module";
import { TKeyLogicContext } from "../config/shared-modules";
import { CriteriaHandler } from "../criterias/_criteria-handler";
import { ELogicCodeError, LogicError } from "../errors/logic-error";
import { IBagForDriver } from "../providers/_drivers/shared";
import { IResponse } from "../reports/shared";
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
    const superDf = HandlerModule.getDefault();
    return {
      //...superDf as any,
      data: undefined,
      literalCriteria: undefined,
      responses: [],
    } as typeof superDf & IBagModule<any>;
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
  private _criteriaHandler: CriteriaHandler;
  public get criteriaHandler(): CriteriaHandler {
    return this._criteriaHandler;
  }
  protected set criteriaHandler(criteriaHandler: CriteriaHandler) {
    this._criteriaHandler = criteriaHandler;
  }
  private _responses: IResponse[];
  public get responses(): IResponse[] {
    const r = [...this._responses]; //clonacion sencilla
    return r;
  }
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
    super("bag", keyLogicContext);
    this.keySrc = keySrc; //❗Obligatorio en el constructor❗
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
  public getLiteralBagDriver(): IBagForDriver {
    let literalBagDriver = {
      data: this.data,
      literalCriteria: this.criteriaHandler.getLiteral(),
    } as IBagForDriver;
    return literalBagDriver;
  }
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
