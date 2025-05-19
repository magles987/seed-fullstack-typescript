import { ClientRepository } from "../_client-repository";
import { TKeyGroupRepository as TKeyRepository } from "./shared-types";
import { TKeyRepositoryPrefix as TSuperKeyPrefix } from "../shared-types"; //❗Desde el padre❗
import {
  IGenericRepositoryCriteria,
  TPrimitiveLiteralCriteriaUnion,
  TStructureLiteralCriteriaUnion,
} from "../../../../criterias/shared-types";
import {
  IRepositoryResponse,
  IGenericRepositoryResponse,
} from "../../../../reports/shared-types";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████

/** *selfcontructor*
 *
 * ...
 */
export abstract class AppRepository
  extends ClientRepository
  implements ReturnType<AppRepository["getDefault"]>
{
  public static override readonly getDefault = () => {
    const superDf = ClientRepository.getDefault();
    return {
      ...superDf,
      //...aquí las propiedades
      // exampleField: "hello", //tipo string dedicudo
    };
  };
  protected static override readonly getCONSTANTS = () => {
    const superCONST = ClientRepository.getCONSTANTS();
    return {
      ...superCONST,
    };
  };
  /**
   * @param keyLogicRepository clave identificadora del repository.
   * @param base objeto literal con valores personalizados para inicializar las propiedades
   * @param isInit `= true` ❕Solo para herencia❕, indica si esta clase debe iniciar las propiedaes
   */
  constructor(
    keyLogicRepository: TKeyRepository,
    base: Partial<ReturnType<AppRepository["getDefault"]>> = {},
    isInit = true
  ) {
    super(`${"client-" as TSuperKeyPrefix}${keyLogicRepository}`, base, false);
    if (isInit) this.initProps(base);
  }
  protected override getDefault() {
    return AppRepository.getDefault();
  }
  protected override getCONST() {
    return AppRepository.getCONSTANTS();
  }

  //❗normalmente definidas en el padre, salvo que se quieran sobreescribir❗
  // /**inicializa las propiedades de manera dinamica
  //  *
  //  * @param base objeto literal con valores personalizados para iniicalizar las propiedades
  //  */
  // protected override initProps(base: Partial<ReturnType<AppRepository["getDefault"]>>): void {
  //   for (const key in this.getDefault()) {
  //     this[key] = base[key];
  //   }
  //   return;
  // }
  // /**reinicia una propiedad al valor predefinido
  //  *
  //  * @param key clave identificadora de la propiedad a reiniciar
  //  */
  // public override resetPropByKey(key: keyof ReturnType<AppRepository["getDefault"]>): void {
  //   const df = this.getDefault();
  //   this[key] = df[key];
  //   return;
  // }
  public override mutateProps(
    base: Partial<ReturnType<AppRepository["getDefault"]>>
  ): void {
    super.mutateProps(base);
    return;
  }
  public override getLiteral(): ReturnType<AppRepository["getDefault"]> {
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
