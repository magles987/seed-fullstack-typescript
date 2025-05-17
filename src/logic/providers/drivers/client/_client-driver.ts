import { Driver } from "../_driver";
import {
  IDriverResponse,
  IGenericDriverResponse,
} from "../../../reports/shared-types";
import {
  IGenericDriverCriteria,
  TPrimitiveLiteralCriteriaUnion,
  TStructureLiteralCriteriaUnion,
} from "../../../criterias/shared-types";
import { TwinBeeModule } from "../../../modules/module";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████

/** *selfcontructor*
 *
 * ...
 */
export abstract class ClientDriver
  extends Driver
  implements ReturnType<ClientDriver["getDefault"]>
{
  public static readonly getNameLogicDriver = () => {
    const util = TwinBeeModule.util;
    const sp = util.charSeparatorLogicName;
    const prefixGroupName = Driver.getNameLogicDriver();
    let name = "client";
    name = `${prefixGroupName}${name}${sp}`;
    return name;
  };
  public static override readonly getDefault = () => {
    const superDf = Driver.getDefault();
    return {
      ...superDf,
      //...aqui las propiedades
      // exampleField: "hello", //tipo string deducido
    };
  };
  protected static override readonly getCONSTANTS = () => {
    const superCONST = Driver.getCONSTANTS();
    return {
      ...superCONST,
      //..aqui las constantes
    };
  };
  /**
   * @param base objeto literal con valores personalizados para inicializar las propiedades
   * @param isInit `= true` ❕Solo para herencia❕, indica si esta clase debe iniciar las propiedaes
   */
  constructor(
    base: Partial<ReturnType<ClientDriver["getDefault"]>> = {},
    isInit = true
  ) {
    super(base, false);
    if (isInit) this.initProps(base);
  }
  protected override getDefault() {
    return ClientDriver.getDefault();
  }
  protected override getCONST() {
    return ClientDriver.getCONSTANTS();
  }
  public override mutateProps(
    base: Partial<ReturnType<ClientDriver["getDefault"]>>
  ): void {
    super.mutateProps(base);
    return;
  }
  public override getLiteral(): ReturnType<ClientDriver["getDefault"]> {
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
