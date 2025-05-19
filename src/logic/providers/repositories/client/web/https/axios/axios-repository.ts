import {
  IGenericRepositoryCriteria,
  TPrimitiveLiteralCriteriaUnion,
  TStructureLiteralCriteriaUnion,
} from "../../../../../../criterias/shared-types";
import { TwinBeeModule } from "../../../../../../modules/module";
import {
  IRepositoryResponse,
  IGenericRepositoryResponse,
} from "../../../../../../reports/shared-types";
import { HttpRepository } from "../_https-repository";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *selfcontructor*
 *
 * ...
 */
export class AxiosRepository
  extends HttpRepository
  implements ReturnType<AxiosRepository["getDefault"]>
{
  public static readonly getNameLogicRepository = () => {
    const util = TwinBeeModule.util;
    //const sp = util.charSeparatorLogicName;
    const prefixGroupName = HttpRepository.getNameLogicRepository();
    let name = "axios";
    name = `${prefixGroupName}${name}`;
    return name;
  };
  public static override readonly getDefault = () => {
    const superDf = HttpRepository.getDefault();
    return {
      ...superDf,
      //...aquí las propiedades
      // exampleField: "hello", //tipo string deducido
    };
  };
  protected static override readonly getCONSTANTS = () => {
    const superCONST = HttpRepository.getCONSTANTS();
    return {
      ...superCONST,
      //..aquí las constantes
    };
  };
  public override nameLogicRepository =
    AxiosRepository.getNameLogicRepository();
  /**
   * @param base objeto literal con valores personalizados para inicalizar las propiedades
   * @param isInit `= true` ❕Solo para herencia❕, indica si esta clase debe iniciar las propiedaes
   */
  constructor(
    base: Partial<ReturnType<AxiosRepository["getDefault"]>> = {},
    isInit = true
  ) {
    super(base, false);
    if (isInit) this.initProps(base);
  }
  protected override getDefault() {
    return AxiosRepository.getDefault();
  }
  protected override getCONST() {
    return AxiosRepository.getCONSTANTS();
  }

  //❗normalmente definidas en el padre, salvo que se quieran sobreescribir❗
  // /**inicializa las propiedades de manera dinamica
  //  *
  //  * @param base objeto literal con valores personalizados para inicalizar las propiedades
  //  */
  // protected override initProps(base: Partial<ReturnType<AxiosRepository["getDefault"]>>): void {
  //   for (const key in this.getDefault()) {
  //     this[key] = base[key];
  //   }
  //   return;
  // }
  // /**reinicia una propiedad al valor predefinido
  //  *
  //  * @param key clave identificadora de la propiedad a reiniciar
  //  */
  // public override resetPropByKey(key: keyof ReturnType<AxiosRepository["getDefault"]>): void {
  //   const df = this.getDefault();
  //   this[key] = df[key];
  //   return;
  // }
  public override mutateProps(
    base: Partial<ReturnType<AxiosRepository["getDefault"]>>
  ): void {
    super.mutateProps(base);
    return;
  }
  public override getLiteral(): ReturnType<AxiosRepository["getDefault"]> {
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
