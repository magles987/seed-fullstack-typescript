import { ClientDriver } from "../_client-driver";
import {
  IDriverResponse,
  IGenericDriverResponse,
} from "../../../../reports/shared-types";
import {
  IGenericDriverCriteria,
  TPrimitiveLiteralCriteriaUnion,
  TStructureLiteralCriteriaUnion,
} from "../../../../criterias/shared-types";
import { TwinBeeModule } from "../../../../modules/module";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *selfcontructor*
 *
 * ...
 */
export abstract class WebDriver
  extends ClientDriver
  implements ReturnType<WebDriver["getDefault"]>
{
  public static readonly getNameLogicDriver = () => {
    const util = TwinBeeModule.util;
    const sp = util.charSeparatorLogicName;
    const prefixGroupName = ClientDriver.getNameLogicDriver();
    let name = "web";
    name = `${prefixGroupName}${name}${sp}`;
    return name;
  };
  public static override readonly getDefault = () => {
    const superDf = ClientDriver.getDefault();
    return {
      ...superDf,
      //...aqui las propiedades
      // exampleField: "hello", //tipo string dedicudo
    };
  };
  protected static override readonly getCONSTANTS = () => {
    const superCONST = ClientDriver.getCONSTANTS();
    return {
      ...superCONST,
      //..aqui las constantes
    };
  };
  /**
   * @param base objeto literal con valores personalizados para iniicalizar las propiedades
   * @param isInit `= true` ❕Solo para herencia❕, indica si esta clase debe iniciar las propiedaes
   */
  constructor(
    base: Partial<ReturnType<WebDriver["getDefault"]>> = {},
    isInit = true
  ) {
    super(base, false);
    if (isInit) this.initProps(base);
  }
  protected override getDefault() {
    return WebDriver.getDefault();
  }
  protected override getCONST() {
    return WebDriver.getCONSTANTS();
  }
  //❗normalmente definidas en el padre, salvo que se quieran sobreescribir❗
  // /**inicializa las propiedades de manera dinamica
  //  *
  //  * @param base objeto literal con valores personalizados para iniicalizar las propiedades
  //  */
  // protected override initProps(base: Partial<ReturnType<WebDriver["getDefault"]>>): void {
  //   for (const key in this.getDefault()) {
  //     this[key] = base[key];
  //   }
  //   return;
  // }
  // /**reinicia una propiedad al valor predefinido
  //  *
  //  * @param key clave identificadora de la propiedad a reiniciar
  //  */
  // public override resetPropByKey(key: keyof ReturnType<WebDriver["getDefault"]>): void {
  //   const df = this.getDefault();
  //   this[key] = df[key];
  //   return;
  // }
  public override mutateProps(
    base: Partial<ReturnType<WebDriver["getDefault"]>>
  ): void {
    super.mutateProps(base);
    return;
  }
  public override getLiteral(): ReturnType<WebDriver["getDefault"]> {
    return super.getLiteral() as any;
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
}
