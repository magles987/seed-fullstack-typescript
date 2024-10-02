import { ELogicCodeError, LogicError } from "../errors/logic-error";
import { Trf_PrimitiveLogicMetadataHandler } from "../meta/primitive-metadata-handler";
import { CriteriaHandler } from "./_criteria-handler";
import {
  IPrimitiveModifyCriteria,
  IPrimitiveReadCriteria,
  ISingleCondition,
  TAConds,
  TKeyPrimitiveCriteriaModuleContext,
} from "./shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *selfconstructor*
 *
 */
export class PrimitiveCriteriaHandler<TValue> extends CriteriaHandler {
  public static override getDefault = () => {
    const superDf = CriteriaHandler.getDefault();
    return {
      ...superDf,
    } as IPrimitiveReadCriteria & IPrimitiveModifyCriteria;
  };
  public static override getCONSTANTS = () => {
    const superCONST = CriteriaHandler.getCONSTANTS();
    return {
      ...superCONST,
    };
  };
  public override get metadataHandler(): Trf_PrimitiveLogicMetadataHandler {
    return super.metadataHandler as Trf_PrimitiveLogicMetadataHandler;
  }
  public override set metadataHandler(mH: Trf_PrimitiveLogicMetadataHandler) {
    super.metadataHandler = mH;
  }
  public override get keyModuleContext(): TKeyPrimitiveCriteriaModuleContext {
    return "primitiveCriteria";
  }
  public override get s_Key(): string {
    const mH = this.metadataHandler;
    const metadata = mH.getMetadata();
    return metadata.__S_Key;
  }
  protected set s_Key(v: string) {} //❗NO ASIGNABLE❗, pero es necesario para el selfconstructor
  public override get p_Key(): string {
    const mH = this.metadataHandler;
    const metadata = mH.getMetadata();
    return metadata.__P_Key;
  }
  protected set p_Key(v: string) {} //❗NO ASIGNABLE❗, pero es necesario para el selfconstructor
  /**... */
  constructor(
    keySrc: string,
    base: Partial<IPrimitiveReadCriteria & IPrimitiveModifyCriteria> &
      Pick<IPrimitiveReadCriteria & IPrimitiveModifyCriteria, "type"> = {
      type: "read",
    },
    isInit = true
  ) {
    super("primitive", keySrc, base);
    if (isInit) this.initProps(base);
  }
  protected override getDefault() {
    return PrimitiveCriteriaHandler.getDefault();
  }
  protected override getCONST() {
    return CriteriaHandler.getCONSTANTS();
  }
  public override resetPropByKey(
    key: keyof ReturnType<PrimitiveCriteriaHandler<TValue>["getDefault"]>
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
          !this.util.isObjectWithProperties(
            cond as ISingleCondition,
            false,
            ["op", "vCond"],
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
  public getCriteriaByContext():
    | IPrimitiveReadCriteria
    | IPrimitiveModifyCriteria {
    return super.getCriteriaByContext();
  }
}
