import { ELogicCodeError, LogicError } from "../errors/logic-error";
import { Trf_StructureLogicMetadataHandler } from "../meta/structure-metadata-handler";
import { CriteriaHandler } from "./_criteria-handler";
import {
  ISingleCondition,
  IStructureModifyCriteria,
  IStructureReadCriteria,
  TAConds,
  TKeyCriteriaType,
  TKeyStructureCriteriaModuleContext,
} from "./shared";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *selfconstructor*
 *
 */
export class StructureCriteriaHandler<TModel> extends CriteriaHandler {
  public static override readonly getDefault = () => {
    const superDf = CriteriaHandler.getDefault();
    return {
      ...superDf,
      sort: {},
      keysPath: [],
    } as IStructureReadCriteria<any> & IStructureModifyCriteria<any>;
  };
  public static override getCONSTANTS = () => {
    const superCONST = CriteriaHandler.getCONSTANTS();
    return {
      ...superCONST,
    };
  };
  public override get metadataHandler(): Trf_StructureLogicMetadataHandler {
    return super.metadataHandler as Trf_StructureLogicMetadataHandler;
  }
  public override set metadataHandler(mH: Trf_StructureLogicMetadataHandler) {
    super.metadataHandler = mH;
  }
  public override get keyModuleContext(): TKeyStructureCriteriaModuleContext {
    return "structureCriteria";
  }
  public override get sort(): IStructureReadCriteria<TModel>["sort"] {
    return super.sort as any;
  }
  public override set sort(v: IStructureReadCriteria<TModel>["sort"]) {
    super.sort = this.util.isObject(v) ? v : super.sort;
    return;
  }
  public override get s_Key(): string {
    const mH = this.metadataHandler;
    const metadata = mH.getExtractMetadataByStructureContext("structureModel");
    return metadata.__S_Key;
  }
  public override get p_Key(): string {
    const mH = this.metadataHandler;
    const metadata = mH.getExtractMetadataByStructureContext("structureModel");
    return metadata.__P_Key;
  }
  private _keysPath: string[];
  public get keysPath(): string[] {
    return this._keysPath;
  }
  public set keysPath(value: string[]) {
    this._keysPath = value;
  }
  /**
   * @param pCursor propiedades opcionales para
   * personalizar la inicializacion del cursor
   */
  constructor(
    keySrc: string,
    base: Partial<
      IStructureReadCriteria<TModel> & IStructureModifyCriteria<TModel>
    > &
      Pick<
        IStructureReadCriteria<TModel> & IStructureModifyCriteria<TModel>,
        "type"
      > = { type: "read" },
    isInit = true
  ) {
    super("structure", keySrc, base, false);
    if (isInit) this.initProps(base);
  }
  protected override getDefault() {
    return StructureCriteriaHandler.getDefault();
  }
  protected override getCONST() {
    return CriteriaHandler.getCONSTANTS();
  }
  public override resetPropByKey(
    key: keyof ReturnType<StructureCriteriaHandler<TModel>["getDefault"]>
  ): void {
    return super.resetPropByKey(key as any);
  }
  protected override checkQueryConds(conds: TAConds): void {
    const len = conds.length;
    //verificaciones solo cuando esta poblado
    if (len > 0) {
      //verificar cada subCondicion
      for (let idx = 0; idx < len; idx++) {
        const cond = conds[idx];
        //verificar que el ultimo elemento no sea operador logico
        if (idx === len - 1 && (typeof cond !== "object" || cond === null)) {
          throw new LogicError({
            code: ELogicCodeError.MODULE_ERROR,
            msn: `${cond} the last condition should not be logic operator`,
          });
        } else if (this.util.isArray(cond)) {
          this.checkQueryConds(cond as TAConds);
        } else if (
          !this.util.isObjectAndExistEveryProperty(
            cond as ISingleCondition,
            false,
            ["op", "vCond", "keyPathForCond"],
            "is-not-undefined-and-not-null"
          )
        ) {
          throw new LogicError({
            code: ELogicCodeError.MODULE_ERROR,
            msn: `${cond} is not condition object or not properties valid`,
          });
        } else {
          throw new LogicError({
            code: ELogicCodeError.MODULE_ERROR,
            msn: `${cond} is not condition valid`,
          });
        }
      }
    }
    return;
  }
  public override getCriteriaByContext():
    | IStructureReadCriteria<TModel>
    | IStructureModifyCriteria<TModel> {
    return super.getCriteriaByContext() as any;
  }
}
