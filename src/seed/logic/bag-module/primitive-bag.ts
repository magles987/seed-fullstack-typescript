import { PrimitiveCriteriaHandler } from "../criterias/primitive-criteria-handler";
import { IDiccPrimitiveMutateActionConfigG } from "../mutaters/primitive-mutater";
import { IDiccPrimitiveHookActionConfigG } from "../hooks/primitive-hook";
import { IDiccPrimitiveProviderActionConfigG } from "../providers/primitive-provider";
import { IPrimitiveResponse } from "../reports/shared";
import { IDiccPrimitiveValActionConfigG } from "../validators/primitive-validation";
import { IDiccRequestValActionConfigG } from "../validators/request-validation";
import { BagModule } from "./_bag";
import { IPrimitiveBag, TKeyPrimitiveBagModuleContext } from "./shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**refactorización de la clase*/
export type Trf_PrimitiveBag = PrimitiveBag<any>;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**... */
export class PrimitiveBag<
  TValue,
  TPrimitiveCriteriaHandler extends PrimitiveCriteriaHandler<TValue> = PrimitiveCriteriaHandler<TValue>,
  TIDiccPrimitiveMutateAC extends IDiccPrimitiveMutateActionConfigG = IDiccPrimitiveMutateActionConfigG,
  TIDiccPrimitiveValAC extends IDiccPrimitiveValActionConfigG = IDiccPrimitiveValActionConfigG,
  TIDiccRequestValAC extends IDiccRequestValActionConfigG = IDiccRequestValActionConfigG,
  TIDiccPrimitiveHookAC extends IDiccPrimitiveHookActionConfigG = IDiccPrimitiveHookActionConfigG,
  TIDiccPrimitiveProviderAC extends IDiccPrimitiveProviderActionConfigG = IDiccPrimitiveProviderActionConfigG
> extends BagModule {
  /** configuracion de valores predefinidos para el modulo*/
  public static readonly getDefault = () => {
    const superDf = BagModule.getDefault();
    return {
      ...superDf,
      aTupleGlobalActionConfig: [],
    } as IPrimitiveBag<any>;
  };
  public override get keyModuleContext(): TKeyPrimitiveBagModuleContext {
    return "primitiveBag";
  }
  public override get criteriaHandler(): TPrimitiveCriteriaHandler {
    return super.criteriaHandler as any;
  }
  protected override set criteriaHandler(
    criteriaHandler: TPrimitiveCriteriaHandler
  ) {
    super.criteriaHandler = criteriaHandler;
  }
  public override get responses(): IPrimitiveResponse[] {
    return super.responses as IPrimitiveResponse[];
  }
  /**
   * @param keySrc indentificadora del recurso asociado a modulo
   * @param baseBag parametros iniciales (si se desea personalizar) para construir el bag
   */
  constructor(
    keySrc: string,
    baseBag: Partial<
      Pick<
        PrimitiveBag<
          TValue,
          TPrimitiveCriteriaHandler,
          TIDiccPrimitiveMutateAC,
          TIDiccPrimitiveValAC,
          TIDiccRequestValAC,
          TIDiccPrimitiveHookAC,
          TIDiccPrimitiveProviderAC
        >,
        "data" | "criteriaHandler" | "responses"
      >
    >
  ) {
    super("primitive", keySrc, baseBag);
  }
  protected override getDefault() {
    return PrimitiveBag.getDefault();
  }
  public getLiteralBag(): IPrimitiveBag<TValue> {
    const literalBag: IPrimitiveBag<TValue> = {
      data: this.data,
      literalCriteria: this.criteriaHandler.getLiteral(),
      responses: this.responses,
    };
    return literalBag;
  }
}
