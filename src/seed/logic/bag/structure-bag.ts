import { StructureCriteriaHandler } from "../criterias/structure-criteria-handler";
import { FieldLogicMutater } from "../mutaters/field-mutater";
import { ModelLogicMutater } from "../mutaters/model-mutater";
import { StructureLogicHook } from "../hooks/structure-hook";
import { StructureLogicProvider } from "../providers/structure-provider";
import { IStructureResponse } from "../reports/shared";
import { FieldLogicValidation } from "../validators/field-validation";
import { ModelLogicValidation } from "../validators/model-validation";
import { RequestLogicValidation } from "../validators/request-validation";
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
  TIDiccFieldMutateAC extends FieldLogicMutater["dfDiccActionConfig"] = FieldLogicMutater["dfDiccActionConfig"],
  TIDiccModelMutateAC extends ModelLogicMutater["dfDiccActionConfig"] = ModelLogicMutater["dfDiccActionConfig"],
  TIDiccFieldValAC extends FieldLogicValidation["dfDiccActionConfig"] = FieldLogicValidation["dfDiccActionConfig"],
  TIDiccModelValAC extends ModelLogicValidation["dfDiccActionConfig"] = ModelLogicValidation["dfDiccActionConfig"],
  TIDiccRequestValAC extends RequestLogicValidation["dfDiccActionConfig"] = RequestLogicValidation["dfDiccActionConfig"],
  TIDiccStructureHookAC extends StructureLogicHook["dfDiccActionConfig"] = StructureLogicHook["dfDiccActionConfig"],
  TIDiccStructureProviderAC extends StructureLogicProvider["dfDiccActionConfig"] = StructureLogicProvider["dfDiccActionConfig"],
  TStructureCriteriaHandler extends StructureCriteriaHandler<
    TModel,
    TIDiccFieldMutateAC,
    TIDiccModelMutateAC,
    TIDiccFieldValAC,
    TIDiccModelValAC,
    TIDiccRequestValAC,
    TIDiccStructureHookAC,
    TIDiccStructureProviderAC
  > = StructureCriteriaHandler<
    TModel,
    TIDiccFieldMutateAC,
    TIDiccModelMutateAC,
    TIDiccFieldValAC,
    TIDiccModelValAC,
    TIDiccRequestValAC,
    TIDiccStructureHookAC,
    TIDiccStructureProviderAC
  >
> extends BagModule {
  /** configuracion de valores predefinidos para el modulo*/
  public static readonly getDefault = () => {
    const superDf = BagModule.getDefault();
    return {
      ...superDf,
    } as typeof superDf & IStructureBag<any>;
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
          TIDiccFieldMutateAC,
          TIDiccModelMutateAC,
          TIDiccFieldValAC,
          TIDiccModelValAC,
          TIDiccRequestValAC,
          TIDiccStructureHookAC,
          TIDiccStructureProviderAC,
          TStructureCriteriaHandler
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
      literalCriteria: this.criteriaHandler.getLiteral() as any,
      responses: this.responses,
    };
    return literalBag;
  }
  public override addEmbResponse(embResponse: IStructureResponse): void {
    super.addEmbResponse(embResponse);
    return;
  }
}
