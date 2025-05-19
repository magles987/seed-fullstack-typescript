import { Repository } from "../_repository";
import {
  IRepositoryResponse,
  IGenericRepositoryResponse,
} from "../../../reports/shared-types";
import {
  IGenericRepositoryCriteria,
  TPrimitiveLiteralCriteriaUnion,
  TStructureLiteralCriteriaUnion,
} from "../../../criterias/shared-types";
import { TwinBeeModule } from "../../../modules/module";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████

/** *selfcontructor*
 *
 * ...
 */
export abstract class ClientRepository
  extends Repository
  implements ReturnType<ClientRepository["getDefault"]>
{
  public static readonly getNameLogicRepository = () => {
    const util = TwinBeeModule.util;
    const sp = util.charSeparatorLogicName;
    const prefixGroupName = Repository.getNameLogicRepository();
    let name = "client";
    name = `${prefixGroupName}${name}${sp}`;
    return name;
  };
  public static override readonly getDefault = () => {
    const superDf = Repository.getDefault();
    return {
      ...superDf,
      //...aqui las propiedades
      // exampleField: "hello", //tipo string deducido
    };
  };
  protected static override readonly getCONSTANTS = () => {
    const superCONST = Repository.getCONSTANTS();
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
    base: Partial<ReturnType<ClientRepository["getDefault"]>> = {},
    isInit = true
  ) {
    super(base, false);
    if (isInit) this.initProps(base);
  }
  protected override getDefault() {
    return ClientRepository.getDefault();
  }
  protected override getCONST() {
    return ClientRepository.getCONSTANTS();
  }
  public override mutateProps(
    base: Partial<ReturnType<ClientRepository["getDefault"]>>
  ): void {
    super.mutateProps(base);
    return;
  }
  public override getLiteral(): ReturnType<ClientRepository["getDefault"]> {
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
