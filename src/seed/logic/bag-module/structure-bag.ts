import { TGenericTupleActionConfig } from "../config/shared-modules";
import { StructureCriteriaHandler } from "../criterias/structure-criteria-handler";
import { ELogicCodeError, LogicError } from "../errors/logic-error";
import { IDiccFieldMutateActionConfigG } from "../mutaters/field-mutater";
import { IDiccModelMutateActionConfigG } from "../mutaters/model-mutater";
import { IDiccStructureHookActionConfigG } from "../hooks/structure-hook";
import { IDiccStructureProviderActionConfigG } from "../providers/structure-provider";
import { IStructureResponse } from "../reports/shared";
import { IDiccFieldValActionConfigG } from "../validators/field-validation";
import { IDiccModelValActionConfigG } from "../validators/model-validation";
import { IDiccRequestValActionConfigG } from "../validators/request-validation";
import { BagModule } from "./_bag";
import { Util_Bag } from "./_util-bag";
import {
  IDiccKeyGlobalContextAction,
  ISchemaSingleBuildGlobalAction,
  IStructureBag,
  IStructureDiccKeyGlobalContextAction,
  TKeyStructureBagModuleContext,
  TKeyStructureDeepBagModuleContext,
  TStructureATupleGlobalDiccAC,
  TStructureKeysGlobal,
} from "./shared";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**
 * ...
 */
export class StructureBag<
  TModel,
  TStructureCriteriaHandler extends StructureCriteriaHandler<TModel> = StructureCriteriaHandler<TModel>,
  TIDiccFieldMutateAC extends IDiccFieldMutateActionConfigG = IDiccFieldMutateActionConfigG,
  TIDiccModelMutateAC extends IDiccModelMutateActionConfigG = IDiccModelMutateActionConfigG,
  TIDiccFieldValAC extends IDiccFieldValActionConfigG = IDiccFieldValActionConfigG,
  TIDiccModelValAC extends IDiccModelValActionConfigG = IDiccModelValActionConfigG,
  TIDiccRequestValAC extends IDiccRequestValActionConfigG = IDiccRequestValActionConfigG,
  TIDiccStructureHookAC extends IDiccStructureHookActionConfigG = IDiccStructureHookActionConfigG,
  TIDiccStructureProviderAC extends IDiccStructureProviderActionConfigG = IDiccStructureProviderActionConfigG
> extends BagModule {
  /** configuracion de valores predefinidos para el modulo*/
  public static readonly getDefault = () => {
    const superDf = BagModule.getDefault();
    return {
      ...superDf,
      keyPath: undefined,
      aTupleGlobalActionConfig: [],
    } as IStructureBag<any>;
  };
  public override get keyModuleContext(): TKeyStructureBagModuleContext {
    return "structureBag";
  }
  public override get criteriaHandler(): TStructureCriteriaHandler {
    return super.criteriaHandler as any;
  }
  protected override set criteriaHandler(
    criteriaHandler: TStructureCriteriaHandler
  ) {
    super.criteriaHandler = criteriaHandler;
  }
  public override get aTupleGlobalActionConfig(): TStructureATupleGlobalDiccAC<
    TIDiccFieldMutateAC,
    TIDiccModelMutateAC,
    TIDiccFieldValAC,
    TIDiccModelValAC,
    TIDiccRequestValAC,
    TIDiccStructureHookAC,
    TIDiccStructureProviderAC
  > {
    return super.aTupleGlobalActionConfig as any;
  }
  protected override set aTupleGlobalActionConfig(
    aTGAC: TStructureATupleGlobalDiccAC<
      TIDiccFieldMutateAC,
      TIDiccModelMutateAC,
      TIDiccFieldValAC,
      TIDiccModelValAC,
      TIDiccRequestValAC,
      TIDiccStructureHookAC,
      TIDiccStructureProviderAC
    >
  ) {
    super.aTupleGlobalActionConfig = aTGAC;
  }
  public override get responses(): IStructureResponse[] {
    return super.responses as IStructureResponse[];
  }
  /**... */
  private _keyPath: string;
  public get keyPath(): string {
    return this._keyPath;
  }
  /**
   * @param keySrc indentificadora del recurso asociado a modulo
   * @param baseBag parametros iniciales (si se desea personalizar) para construir el bag
   */
  constructor(
    keySrc: string,
    public readonly keyStructureDeepModelContext: TKeyStructureDeepBagModuleContext,
    baseBag: Partial<
      StructureBag<
        TModel,
        TStructureCriteriaHandler,
        TIDiccFieldMutateAC,
        TIDiccModelMutateAC,
        TIDiccFieldValAC,
        TIDiccModelValAC,
        TIDiccRequestValAC,
        TIDiccStructureHookAC,
        TIDiccStructureProviderAC
      >
    >
  ) {
    super("structure", keySrc, baseBag);
    const df = this.getDefault();
    this._keyPath = baseBag.keyPath;
    this.criteriaHandler = this.util.isInstance(this.criteriaHandler)
      ? this.criteriaHandler
      : (new StructureCriteriaHandler(this.keySrc, "read", {}) as any);
    this.aTupleGlobalActionConfig =
      this.filterATupleGlobalActionConfigByDeepModelContext();
  }
  protected override getDefault() {
    return StructureBag.getDefault();
  }
  public override getLiteralBag(): IStructureBag<TModel> {
    const literalBag: IStructureBag<TModel> = {
      data: this.data,
      keyPath: this.keyPath,
      keySrc: this.keySrc,
      literalCriteria: this.criteriaHandler.getCriteriaByContext(),
      aTupleGlobalActionConfig: this.aTupleGlobalActionConfig as any,
      responses: this.responses,
      middlewareReportStatus: this.middlewareReportStatus,
    };
    return literalBag;
  }
  public override addEmbResponse(embResponse: IStructureResponse): void {
    super.addEmbResponse(embResponse);
    return;
  }
  public override getDiccKeysGlobalFromTupleGlobal(
    tGlobalAC: [string, any]
  ): IStructureDiccKeyGlobalContextAction<
    | TIDiccFieldMutateAC
    | TIDiccModelMutateAC
    | TIDiccFieldValAC
    | TIDiccModelValAC
    | TIDiccRequestValAC
    | TIDiccStructureHookAC
    | TIDiccStructureProviderAC
  > {
    return super.getDiccKeysGlobalFromTupleGlobal(tGlobalAC) as any;
  }
  public override extractKeyContextFromKeyGlobalAction(
    keyContext: "keyModule",
    tGlobalAC: [string, any]
  ): IStructureDiccKeyGlobalContextAction<any>["keyModule"];
  public override extractKeyContextFromKeyGlobalAction(
    keyContext: "keyModuleContext",
    tGlobalAC: [string, any]
  ): IStructureDiccKeyGlobalContextAction<any>["keyModuleContext"];
  public override extractKeyContextFromKeyGlobalAction(
    keyContext: "keyAction",
    tGlobalAC: [string, any]
  ): IStructureDiccKeyGlobalContextAction<
    | TIDiccFieldMutateAC
    | TIDiccModelMutateAC
    | TIDiccFieldValAC
    | TIDiccModelValAC
    | TIDiccRequestValAC
    | TIDiccStructureHookAC
    | TIDiccStructureProviderAC
  >["keyAction"];
  public override extractKeyContextFromKeyGlobalAction(
    keyContext: TStructureKeysGlobal,
    tGlobalAC: [string, any]
  ): unknown {
    return super.extractKeyContextFromKeyGlobalAction(keyContext, tGlobalAC);
  }
  /**... */
  public override buildTupleGlobalActionConfig<
    TDiccAC extends TIDiccFieldMutateAC &
      TIDiccModelMutateAC &
      TIDiccFieldValAC &
      TIDiccModelValAC &
      TIDiccRequestValAC &
      TIDiccStructureHookAC &
      TIDiccStructureProviderAC,
    TKeyAction extends keyof TDiccAC
  >(
    schemaGlobalAC: ISchemaSingleBuildGlobalAction<
      TKeyAction,
      TDiccAC[TKeyAction]
    >
  ): [string, [TKeyAction, TDiccAC[TKeyAction]]] {
    return super.buildTupleGlobalActionConfig(schemaGlobalAC as any) as any;
  }
  public override buildATupleGlobalActionConfig<
    TDiccAC extends
      | TIDiccFieldMutateAC
      | TIDiccModelMutateAC
      | TIDiccFieldValAC
      | TIDiccModelValAC
      | TIDiccRequestValAC
      | TIDiccStructureHookAC
      | TIDiccStructureProviderAC,
    TKeyAction extends keyof (
      | TIDiccFieldMutateAC
      | TIDiccModelMutateAC
      | TIDiccFieldValAC
      | TIDiccModelValAC
      | TIDiccRequestValAC
      | TIDiccStructureHookAC
      | TIDiccStructureProviderAC
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
      | TIDiccFieldMutateAC
      | TIDiccModelMutateAC
      | TIDiccFieldValAC
      | TIDiccModelValAC
      | TIDiccRequestValAC
      | TIDiccStructureHookAC
      | TIDiccStructureProviderAC,
    TKeyAction extends keyof (
      | TIDiccFieldMutateAC
      | TIDiccModelMutateAC
      | TIDiccFieldValAC
      | TIDiccModelValAC
      | TIDiccRequestValAC
      | TIDiccStructureHookAC
      | TIDiccStructureProviderAC
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
        IStructureDiccKeyGlobalContextAction<any>["keyModule"],
        IStructureDiccKeyGlobalContextAction<any>["keyModuleContext"]?,
        IStructureDiccKeyGlobalContextAction<
          | TIDiccFieldMutateAC
          | TIDiccModelMutateAC
          | TIDiccFieldValAC
          | TIDiccModelValAC
          | TIDiccRequestValAC
          | TIDiccStructureHookAC
          | TIDiccStructureProviderAC
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
  /**... */
  private filterATupleGlobalActionConfigByDeepModelContext(): typeof this.aTupleGlobalActionConfig {
    const keyContext = this.keyStructureDeepModelContext;
    let aTKeys: Array<
      [
        IStructureDiccKeyGlobalContextAction<any>["keyModule"],
        IStructureDiccKeyGlobalContextAction<any>["keyModuleContext"]?
      ]
    >;
    if (keyContext === "fieldBag") {
      aTKeys = [
        ["mutater", "fieldMutate"],
        ["validator", "fieldVal"],
      ];
    } else if (keyContext === "modelBag") {
      aTKeys = [
        ["mutater", "modelMutate"],
        ["validator", "modelVal"],
        ["hook", "structureHook"],
        ["provider", "structureProvider"],
      ];
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${keyContext} is not key structure deep context valid`,
      });
    }
    return this.filterATupleGlobalActionConfig(
      aTKeys,
      this.aTupleGlobalActionConfig
    );
  }
  public override findTupleGlobalActionConfig(
    tKeyFind: [
      IStructureDiccKeyGlobalContextAction<any>["keyModule"],
      IStructureDiccKeyGlobalContextAction<any>["keyModuleContext"],
      IStructureDiccKeyGlobalContextAction<
        | TIDiccFieldMutateAC
        | TIDiccModelMutateAC
        | TIDiccFieldValAC
        | TIDiccModelValAC
        | TIDiccRequestValAC
        | TIDiccStructureHookAC
        | TIDiccStructureProviderAC
      >["keyAction"]
    ],
    customATupleGlobalActionConfig = this.aTupleGlobalActionConfig
  ): [
    string,
    TGenericTupleActionConfig<
      | TIDiccFieldMutateAC
      | TIDiccModelMutateAC
      | TIDiccFieldValAC
      | TIDiccModelValAC
      | TIDiccRequestValAC
      | TIDiccStructureHookAC
      | TIDiccStructureProviderAC
    >
  ] {
    return super.findTupleGlobalActionConfig(
      tKeyFind,
      customATupleGlobalActionConfig
    ) as any;
  }
}
