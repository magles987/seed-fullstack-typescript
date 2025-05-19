import { ClientRepository } from "../_client-repository";
import {
  IRepositoryResponse,
  IGenericRepositoryResponse,
} from "../../../../reports/shared-types";
import {
  IGenericRepositoryCriteria,
  TPrimitiveLiteralCriteriaUnion,
  TStructureLiteralCriteriaUnion,
} from "../../../../criterias/shared-types";
import { TwinBeeModule } from "../../../../modules/module";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *selfcontructor*
 *
 * ...
 */
export abstract class WebRepository
  extends ClientRepository
  implements ReturnType<WebRepository["getDefault"]>
{
  public static readonly getNameLogicRepository = () => {
    const util = TwinBeeModule.util;
    const sp = util.charSeparatorLogicName;
    const prefixGroupName = ClientRepository.getNameLogicRepository();
    let name = "web";
    name = `${prefixGroupName}${name}${sp}`;
    return name;
  };
  public static override readonly getDefault = () => {
    const superDf = ClientRepository.getDefault();
    return {
      ...superDf,
      //...aqui las propiedades
      // exampleField: "hello", //tipo string dedicudo
    };
  };
  protected static override readonly getCONSTANTS = () => {
    const superCONST = ClientRepository.getCONSTANTS();
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
    base: Partial<ReturnType<WebRepository["getDefault"]>> = {},
    isInit = true
  ) {
    super(base, false);
    if (isInit) this.initProps(base);
  }
  protected override getDefault() {
    return WebRepository.getDefault();
  }
  protected override getCONST() {
    return WebRepository.getCONSTANTS();
  }
  //❗normalmente definidas en el padre, salvo que se quieran sobreescribir❗
  // /**inicializa las propiedades de manera dinamica
  //  *
  //  * @param base objeto literal con valores personalizados para iniicalizar las propiedades
  //  */
  // protected override initProps(base: Partial<ReturnType<WebRepository["getDefault"]>>): void {
  //   for (const key in this.getDefault()) {
  //     this[key] = base[key];
  //   }
  //   return;
  // }
  // /**reinicia una propiedad al valor predefinido
  //  *
  //  * @param key clave identificadora de la propiedad a reiniciar
  //  */
  // public override resetPropByKey(key: keyof ReturnType<WebRepository["getDefault"]>): void {
  //   const df = this.getDefault();
  //   this[key] = df[key];
  //   return;
  // }
  public override mutateProps(
    base: Partial<ReturnType<WebRepository["getDefault"]>>
  ): void {
    super.mutateProps(base);
    return;
  }
  public override getLiteral(): ReturnType<WebRepository["getDefault"]> {
    return super.getLiteral() as any;
  }
  protected override preRequestByCriteria(
    literalCriteria: IGenericRepositoryCriteria
  ): void {
    super.preRequestByCriteria(literalCriteria);
    return;
  }
  protected override postRequestByResponse(
    repositoryRes: IGenericRepositoryResponse
  ): void {
    super.postRequestByResponse(repositoryRes);
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
    repositoryRes: IRepositoryResponse
  ): void {
    super.postRequestByResponseModule(repositoryRes);
    return;
  }
}
