import { StructureCriteriaHandler } from "../criterias/structure-criteria-handler";
import { IDiccFieldMutateActionConfigG } from "../mutaters/field-mutater";
import { IDiccModelMutateActionConfigG } from "../mutaters/model-mutater";
import { IDiccStructureHookActionConfigG } from "../hooks/structure-hook";
import { IDiccStructureProviderActionConfigG } from "../providers/structure-provider";
import { IStructureResponse } from "../reports/shared";
import { IDiccFieldValActionConfigG } from "../validators/field-validation";
import { IDiccModelValActionConfigG } from "../validators/model-validation";
import { IDiccRequestValActionConfigG } from "../validators/request-validation";
import { BagModule } from "./_bag";
import {
  IStructureBag,
  TKeyStructureBagModuleContext,
  TKeyStructureDeepBagModuleContext,
} from "./shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**refactorización de la clase*/
export type Trf_StructureBag = StructureBag<any>;
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
  public override get responses(): IStructureResponse[] {
    return super.responses as IStructureResponse[];
  }
  /**
   * @param keySrc indentificadora del recurso asociado a modulo
   * @param baseBag parametros iniciales (si se desea personalizar) para construir el bag
   */
  constructor(
    keySrc: string,
    public readonly keyStructureDeepModelContext: TKeyStructureDeepBagModuleContext,
    baseBag: Partial<
      Pick<
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
        >,
        "data" | "criteriaHandler" | "responses"
      >
    >
  ) {
    super("structure", keySrc, baseBag);
  }
  protected override getDefault() {
    return StructureBag.getDefault();
  }
  public override getLiteralBag(): IStructureBag<TModel> {
    const literalBag: IStructureBag<TModel> = {
      data: this.data,
      literalCriteria: this.criteriaHandler.getLiteral(),
      responses: this.responses,
    };
    return literalBag;
  }
  public override addEmbResponse(embResponse: IStructureResponse): void {
    super.addEmbResponse(embResponse);
    return;
  }
}
