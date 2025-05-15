import { ELogicCodeError, LogicError } from "../../errors/logic-error";
import { TwinBeeModule } from "../../modules/module";
import { TKeySrcSelector } from "../../modules/shared-types";
import { IDriverResponse } from "../../reports/shared-types";
import {
  TPrimitiveLiteralCriteriaUnion,
  TStructureLiteralCriteriaUnion,
} from "./shared-types";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *selfconstructor*
 *
 * ...
 */
export abstract class Driver
  extends TwinBeeModule
  implements ReturnType<Driver["getDefault"]>
{
  /**@returns el nombre de identificación del driver (debe ser único entre grupos) */
  public static readonly getNameLogicDriver = () => {
    const util = TwinBeeModule.util;
    const sp = util.charSeparatorLogicName;
    const prefixGroupName = "driver";
    let name = "";
    name = `${prefixGroupName}${sp}`;
    return name;
  };
  /**@returns todos los campos con sus valores predefinidos para instancias de esta clase*/
  public static readonly getDefault = () => {
    const superDf = TwinBeeModule.getDefault();
    return {
      ...superDf,
      /**determina que tipo de clave identificadora de recurso usar */
      srcSelector: "plural" as TKeySrcSelector,
    };
  };
  /**@returns todas las constantes a usar en instancias de esta clase*/
  protected static readonly getCONSTANTS = () => {
    return {
      //..aqui las constantes
    };
  };
  /** el nombre de identificación del driver (debe ser único entre grupos) */
  public abstract readonly nameLogicDriver: string;
  private _srcSelector: TKeySrcSelector;
  public get srcSelector(): TKeySrcSelector {
    return this._srcSelector;
  }
  protected set srcSelector(v: TKeySrcSelector) {
    this._srcSelector =
      v === "plural" || v === "singular"
        ? v
        : this._srcSelector !== undefined
        ? this._srcSelector
        : this.getDefault().srcSelector;
  }
  /**
   * @param base objeto literal con valores personalizados para inicializar las propiedades
   * @param isInit `= true` ❕Solo para herencia❕, indica si esta clase debe iniciar las propiedaes
   */
  constructor(
    base: Partial<ReturnType<Driver["getDefault"]>> = {},
    isInit = true
  ) {
    super("driver");
    if (isInit) this.initProps(base);
  }
  /**@returns todos los campos con sus valores predefinidos*/
  protected getDefault() {
    return Driver.getDefault();
  }
  /**@returns todas las constantes de la clase para las instancias*/
  protected getCONST() {
    return Driver.getCONSTANTS();
  }
  /**inicializa las propiedades de manera dinámica
   *
   * @param base objeto literal con valores personalizados para inicalizar las propiedades
   */
  protected initProps(base: Partial<ReturnType<Driver["getDefault"]>>): void {
    base = typeof base === "object" && base !== null ? base : {};
    for (const key in this.getDefault()) {
      this[key] = base[key];
    }
    return;
  }
  /**⚠ Reinicia todas las propiedades al valor predefinido ⚠ */
  public resetProps(): void {
    const df = this.getDefault();
    for (const key in df) {
      this[key] = df[key];
    }
    return;
  }
  /**reinicia una propiedad al valor predefinido
   *
   * @param key clave identificadora de la propiedad a reiniciar
   */
  public resetPropByKey(key: keyof ReturnType<Driver["getDefault"]>): void {
    const df = this.getDefault();
    this[key as any] = df[key];
    return;
  }
  /**muta masivamente propiedades de manera dinámica
   *
   * @param base objeto literal con valores personalizados a mutar en las propiedades
   */
  public mutateProps(base: Partial<ReturnType<Driver["getDefault"]>>): void {
    base = typeof base === "object" && base !== null ? base : ({} as any);
    for (const key in base) {
      this[key] = base[key];
    }
    return;
  }
  /**@returns un objeto literal con las propiedades base */
  public getLiteral(): ReturnType<Driver["getDefault"]> {
    let literal = {};
    for (const key in this.getDefault()) {
      literal[key] = this[key];
    }
    return literal as any;
  }
  /**... */
  protected abstract buildDriverResponse(
    literalCriteria:
      | TPrimitiveLiteralCriteriaUnion
      | TStructureLiteralCriteriaUnion<any>,
    rxData: any,
    error?: any
  ): IDriverResponse;
  /**verifica que el bag recibido este optimo para el
   * driver, de lo contrario lanza error */
  protected checkLiteralCriteria(
    literalCriteria:
      | TPrimitiveLiteralCriteriaUnion
      | TStructureLiteralCriteriaUnion<any>
  ): void {
    if (!this.util.isObject(literalCriteria)) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${literalCriteria} is not criteria dictionary valid`,
      });
    }
    if (!this.util.isString(literalCriteria.keyActionRequest)) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${literalCriteria.keyActionRequest} is not key request action valid`,
      });
    }
    return;
  }
  /* obtiene la clave identificadora del recurso según 
  el requerimiento (plural o singular)
  */
  protected getKeySrcContext(
    srcSelector: TKeySrcSelector,
    literalCriteria:
      | TPrimitiveLiteralCriteriaUnion
      | TStructureLiteralCriteriaUnion<any>
  ): string {
    const { p_Key, s_Key, keySrc } = literalCriteria;
    let keySrcContext: string;
    if (srcSelector === "singular") keySrcContext = s_Key;
    else if (srcSelector === "plural") keySrcContext = p_Key;
    else keySrcContext = keySrc;
    return keySrcContext;
  }
  /**... */
  public abstract sendRequestFromService(
    literalCriteria:
      | TPrimitiveLiteralCriteriaUnion
      | TStructureLiteralCriteriaUnion<any>
  ): Promise<IDriverResponse>;
  /**... */
  protected preRequestFromService(
    literalCriteria:
      | TPrimitiveLiteralCriteriaUnion
      | TStructureLiteralCriteriaUnion<any>
  ): void {
    this.checkLiteralCriteria(literalCriteria);
  }
  /**... */
  protected postRequestFromService(driverRes: IDriverResponse): void {}
  /**... */
  public abstract sendRequest(): Promise<any>;
  /**... */
  protected getCustomQueryFn(
    literalCriteria:
      | TPrimitiveLiteralCriteriaUnion
      | TStructureLiteralCriteriaUnion<any>
  ) {
    const { aTCustomQueryDriverFn } = literalCriteria;
    const tCustomQueryFn = aTCustomQueryDriverFn.find((tCQDFn) => {
      const [nameLogicDriver] = tCQDFn;
      const r = nameLogicDriver === this.nameLogicDriver;
      return r;
    });
    let customQueryFn = undefined;
    if (this.util.isTuple(tCustomQueryFn, 2)) {
      customQueryFn = tCustomQueryFn[1];
    }
    return customQueryFn;
  }
}
