import { PrimitiveCriteriaHandler } from "../criterias/primitive-criteria-handler";
import { PrimitiveLogicMutater } from "../mutaters/primitive-mutater";
import { PrimitiveLogicHook } from "../hooks/primitive-hook";
import { PrimitiveLogicProvider } from "../providers/primitive-provider";
import { IPrimitiveResponse } from "../reports/shared";
import { PrimitiveLogicValidation } from "../validators/primitive-validation";
import { RequestLogicValidation } from "../validators/request-validation";
import { BagModule } from "./_bag";
import { IPrimitiveBag, TKeyPrimitiveBagModuleContext } from "./shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**refactorización de la clase*/
export type Trf_PrimitiveBag = PrimitiveBag<any>;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**... */
export class PrimitiveBag<
  TValue,
  TIDiccPrimitiveMutateAC extends PrimitiveLogicMutater["dfDiccActionConfig"] = PrimitiveLogicMutater["dfDiccActionConfig"],
  TIDiccPrimitiveValAC extends PrimitiveLogicValidation["dfDiccActionConfig"] = PrimitiveLogicValidation["dfDiccActionConfig"],
  TIDiccRequestValAC extends RequestLogicValidation["dfDiccActionConfig"] = RequestLogicValidation["dfDiccActionConfig"],
  TIDiccPrimitiveHookAC extends PrimitiveLogicHook["dfDiccActionConfig"] = PrimitiveLogicHook["dfDiccActionConfig"],
  TIDiccPrimitiveProviderAC extends PrimitiveLogicProvider["dfDiccActionConfig"] = PrimitiveLogicProvider["dfDiccActionConfig"],
  TPrimitiveCriteriaHandler extends PrimitiveCriteriaHandler<
    TValue,
    TIDiccPrimitiveMutateAC,
    TIDiccPrimitiveValAC,
    TIDiccRequestValAC,
    TIDiccPrimitiveHookAC,
    TIDiccPrimitiveProviderAC
  > = PrimitiveCriteriaHandler<
    TValue,
    TIDiccPrimitiveMutateAC,
    TIDiccPrimitiveValAC,
    TIDiccRequestValAC,
    TIDiccPrimitiveHookAC,
    TIDiccPrimitiveProviderAC
  >
> extends BagModule {
  /** configuración de valores predefinidos para el modulo*/
  public static readonly getDefault = () => {
    const superDf = BagModule.getDefault();
    return {
      ...superDf,
      aTupleGlobalActionConfig: [],
    } as typeof superDf & IPrimitiveBag<any>;
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
          TIDiccPrimitiveMutateAC,
          TIDiccPrimitiveValAC,
          TIDiccRequestValAC,
          TIDiccPrimitiveHookAC,
          TIDiccPrimitiveProviderAC,
          TPrimitiveCriteriaHandler
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
