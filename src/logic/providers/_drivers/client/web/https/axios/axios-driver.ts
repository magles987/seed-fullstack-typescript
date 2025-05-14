import { Util_Module } from "../../../../../../util/util-module";
import { HttpDriver } from "../_https-driver";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *selfcontructor*
 *
 * ...
 */
export class AxiosDriver
  extends HttpDriver
  implements ReturnType<AxiosDriver["getDefault"]>
{
  public static readonly getNameLogicDriver = () => {
    const util = Util_Module.getInstance();
    //const sp = util.charSeparatorLogicName;
    const prefixGroupName = HttpDriver.getNameLogicDriver();
    let name = "axios";
    name = `${prefixGroupName}${name}`;
    return name;
  };
  public static override readonly getDefault = () => {
    const superDf = HttpDriver.getDefault();
    return {
      ...superDf,
      //...aquí las propiedades
      // exampleField: "hello", //tipo string deducido
    };
  };
  protected static override readonly getCONSTANTS = () => {
    const superCONST = HttpDriver.getCONSTANTS();
    return {
      ...superCONST,
      //..aquí las constantes
    };
  };
  public override nameLogicDriver = AxiosDriver.getNameLogicDriver();
  /**
   * @param base objeto literal con valores personalizados para inicalizar las propiedades
   * @param isInit `= true` ❕Solo para herencia❕, indica si esta clase debe iniciar las propiedaes
   */
  constructor(
    base: Partial<ReturnType<AxiosDriver["getDefault"]>> = {},
    isInit = true
  ) {
    super(base, false);
    if (isInit) this.initProps(base);
  }
  protected override getDefault() {
    return AxiosDriver.getDefault();
  }
  protected override getCONST() {
    return AxiosDriver.getCONSTANTS();
  }

  //❗normalmente definidas en el padre, salvo que se quieran sobreescribir❗
  // /**inicializa las propiedades de manera dinamica
  //  *
  //  * @param base objeto literal con valores personalizados para inicalizar las propiedades
  //  */
  // protected override initProps(base: Partial<ReturnType<AxiosDriver["getDefault"]>>): void {
  //   for (const key in this.getDefault()) {
  //     this[key] = base[key];
  //   }
  //   return;
  // }
  // /**reinicia una propiedad al valor predefinido
  //  *
  //  * @param key clave identificadora de la propiedad a reiniciar
  //  */
  // public override resetPropByKey(key: keyof ReturnType<AxiosDriver["getDefault"]>): void {
  //   const df = this.getDefault();
  //   this[key] = df[key];
  //   return;
  // }
  public override mutateProps(
    base: Partial<ReturnType<AxiosDriver["getDefault"]>>
  ): void {
    super.mutateProps(base);
    return;
  }
  public override getLiteral(): ReturnType<AxiosDriver["getDefault"]> {
    return super.getLiteral() as any;
  }
}
