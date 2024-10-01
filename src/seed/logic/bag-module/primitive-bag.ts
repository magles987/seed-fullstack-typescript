import { TGenericTupleActionConfig } from "../config/shared-modules";
import { PrimitiveCriteriaHandler } from "../criterias/primitive-criteria-handler";
import { IDiccPrimitiveMutateActionConfigG } from "../mutaters/primitive-mutater";
import { IDiccPrimitiveHookActionConfigG } from "../hooks/primitive-hook";
import { IDiccPrimitiveProviderActionConfigG } from "../providers/primitive-provider";
import { IPrimitiveResponse } from "../reports/shared";
import { IDiccPrimitiveValActionConfigG } from "../validators/primitive-validation";
import { IDiccRequestValActionConfigG } from "../validators/request-validation";
import { BagModule } from "./_bag";
import {
  IPrimitiveBag,
  IPrimitiveDiccKeyGlobalContextAction,
  ISchemaSingleBuildGlobalAction,
  TKeyPrimitiveBagModuleContext,
  TPrimitiveATupleGlobalDiccAC,
  TPrimitiveKeysGlobal,
} from "./shared";

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
  public override get aTupleGlobalActionConfig(): TPrimitiveATupleGlobalDiccAC<
    TIDiccPrimitiveMutateAC,
    TIDiccPrimitiveValAC,
    TIDiccRequestValAC,
    TIDiccPrimitiveHookAC,
    TIDiccPrimitiveProviderAC
  > {
    return super.aTupleGlobalActionConfig as any;
  }
  protected override set aTupleGlobalActionConfig(
    aTGAC: TPrimitiveATupleGlobalDiccAC<
      TIDiccPrimitiveMutateAC,
      TIDiccPrimitiveValAC,
      TIDiccRequestValAC,
      TIDiccPrimitiveHookAC,
      TIDiccPrimitiveProviderAC
    >
  ) {
    super.aTupleGlobalActionConfig = aTGAC;
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
      PrimitiveBag<
        TValue,
        TPrimitiveCriteriaHandler,
        TIDiccPrimitiveMutateAC,
        TIDiccPrimitiveValAC,
        TIDiccRequestValAC,
        TIDiccPrimitiveHookAC,
        TIDiccPrimitiveProviderAC
      >
    >
  ) {
    super("primitive", keySrc, baseBag);
    this.criteriaHandler = this.util.isInstance(this.criteriaHandler)
      ? this.criteriaHandler
      : (new PrimitiveCriteriaHandler(this.keySrc, { type: "read" }) as any);
  }
  protected override getDefault() {
    return PrimitiveBag.getDefault();
  }
  public getLiteralBag(): IPrimitiveBag<TValue> {
    const literalBag: IPrimitiveBag<TValue> = {
      data: this.data,
      keySrc: this.keySrc,
      literalCriteria: this.criteriaHandler.getCriteriaByContext(),
      aTupleGlobalActionConfig: this.aTupleGlobalActionConfig as any,
      responses: this.responses,
      middlewareReportStatus: this.middlewareReportStatus,
    };
    return literalBag;
  }
  public override getDiccKeysGlobalFromTupleGlobal(
    tGlobalAC: [string, any]
  ): IPrimitiveDiccKeyGlobalContextAction<
    | TIDiccPrimitiveMutateAC
    | TIDiccPrimitiveValAC
    | TIDiccRequestValAC
    | TIDiccPrimitiveHookAC
    | TIDiccPrimitiveProviderAC
  > {
    return super.getDiccKeysGlobalFromTupleGlobal(tGlobalAC) as any;
  }
  public override extractKeyContextFromKeyGlobalAction(
    keyContext: "keyModule",
    tGlobalAC: [string, any]
  ): IPrimitiveDiccKeyGlobalContextAction<any>["keyModule"];
  public override extractKeyContextFromKeyGlobalAction(
    keyContext: "keyModuleContext",
    tGlobalAC: [string, any]
  ): IPrimitiveDiccKeyGlobalContextAction<any>["keyModuleContext"];
  public override extractKeyContextFromKeyGlobalAction(
    keyContext: "keyAction",
    tGlobalAC: [string, any]
  ): IPrimitiveDiccKeyGlobalContextAction<
    | TIDiccPrimitiveMutateAC
    | TIDiccPrimitiveValAC
    | TIDiccRequestValAC
    | TIDiccPrimitiveHookAC
    | TIDiccPrimitiveProviderAC
  >["keyAction"];
  public override extractKeyContextFromKeyGlobalAction(
    keyContext: TPrimitiveKeysGlobal,
    tGlobalAC: [string, any]
  ): unknown {
    return super.extractKeyContextFromKeyGlobalAction(keyContext, tGlobalAC);
  }
  public override buildTupleGlobalActionConfig<
    TDiccAC extends
      | TIDiccPrimitiveMutateAC
      | TIDiccPrimitiveValAC
      | TIDiccRequestValAC
      | TIDiccPrimitiveHookAC
      | TIDiccPrimitiveProviderAC,
    TKeyAction extends keyof (
      | TIDiccPrimitiveMutateAC
      | TIDiccPrimitiveValAC
      | TIDiccRequestValAC
      | TIDiccPrimitiveHookAC
      | TIDiccPrimitiveProviderAC
    )
  >(
    schemaGlobalAC: ISchemaSingleBuildGlobalAction<
      TKeyAction,
      TDiccAC[TKeyAction]
    >
  ): [string, [TKeyAction, TDiccAC[TKeyAction]]] {
    return super.buildATupleGlobalActionConfig(schemaGlobalAC as any) as any;
  }
  public override buildATupleGlobalActionConfig<
    TDiccAC extends
      | TIDiccPrimitiveMutateAC
      | TIDiccPrimitiveValAC
      | TIDiccRequestValAC
      | TIDiccPrimitiveHookAC
      | TIDiccPrimitiveProviderAC,
    TKeyAction extends keyof (
      | TIDiccPrimitiveMutateAC
      | TIDiccPrimitiveValAC
      | TIDiccRequestValAC
      | TIDiccPrimitiveHookAC
      | TIDiccPrimitiveProviderAC
    )
  >(
    aSchemaGlobalAC: Array<
      ISchemaSingleBuildGlobalAction<TKeyAction, TDiccAC[TKeyAction]>
    >
  ): Array<[string, [TKeyAction, TDiccAC[TKeyAction]]]> {
    return super.buildATupleGlobalActionConfig(aSchemaGlobalAC) as any;
  }
  public override buildATupleModuleContextActionConfigFromATupleAC<
    TDiccAC extends
      | TIDiccPrimitiveMutateAC
      | TIDiccPrimitiveValAC
      | TIDiccRequestValAC
      | TIDiccPrimitiveHookAC
      | TIDiccPrimitiveProviderAC,
    TKeyAction extends keyof (
      | TIDiccPrimitiveMutateAC
      | TIDiccPrimitiveValAC
      | TIDiccRequestValAC
      | TIDiccPrimitiveHookAC
      | TIDiccPrimitiveProviderAC
    )
  >(
    actionModule: ISchemaSingleBuildGlobalAction<any, any>["actionModule"],
    aTupleAC: Array<[any, any]>,
    builderACOption?: ISchemaSingleBuildGlobalAction<
      any,
      any
    >["builderACOption"]
  ): Array<[string, [TKeyAction, TDiccAC[TKeyAction]]]> {
    return super.buildATupleModuleContextActionConfigFromATupleAC(
      actionModule,
      aTupleAC,
      builderACOption
    ) as any;
  }
  public override filterATupleGlobalActionConfig(
    aTKeysFilter: Array<
      [
        IPrimitiveDiccKeyGlobalContextAction<any>["keyModule"],
        IPrimitiveDiccKeyGlobalContextAction<any>["keyModuleContext"]?,
        IPrimitiveDiccKeyGlobalContextAction<
          | TIDiccPrimitiveMutateAC
          | TIDiccPrimitiveValAC
          | TIDiccRequestValAC
          | TIDiccPrimitiveHookAC
          | TIDiccPrimitiveProviderAC
        >["keyAction"]?
      ]
    >,
    customATupleGlobalActionConfig = this.aTupleGlobalActionConfig
  ): typeof this.aTupleGlobalActionConfig {
    return super.filterATupleGlobalActionConfig(
      aTKeysFilter,
      customATupleGlobalActionConfig
    ) as any;
  }
  public override findTupleGlobalActionConfig(
    tKeyFind: [
      IPrimitiveDiccKeyGlobalContextAction<any>["keyModule"],
      IPrimitiveDiccKeyGlobalContextAction<any>["keyModuleContext"],
      IPrimitiveDiccKeyGlobalContextAction<
        | TIDiccPrimitiveMutateAC
        | TIDiccPrimitiveValAC
        | TIDiccRequestValAC
        | TIDiccPrimitiveHookAC
        | TIDiccPrimitiveProviderAC
      >["keyAction"]
    ],
    customATupleGlobalActionConfig = this.aTupleGlobalActionConfig
  ): [
    string,
    TGenericTupleActionConfig<
      | TIDiccPrimitiveMutateAC
      | TIDiccPrimitiveValAC
      | TIDiccRequestValAC
      | TIDiccPrimitiveHookAC
      | TIDiccPrimitiveProviderAC
    >
  ] {
    return super.findTupleGlobalActionConfig(
      tKeyFind,
      customATupleGlobalActionConfig
    ) as any;
  }
}
