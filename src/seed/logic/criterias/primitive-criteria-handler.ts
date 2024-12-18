import { ActionModule, IBuildACOption } from "../config/module";
import { ELogicCodeError, LogicError } from "../errors/logic-error";
import { IDiccPrimitiveHookActionConfigG } from "../hooks/primitive-hook";
import { TKeyPrimitiveHookModuleContext } from "../hooks/shared";
import { Trf_PrimitiveLogicMetadataHandler } from "../meta/primitive-metadata-handler";
import { IDiccPrimitiveMutateActionConfigG } from "../mutaters/primitive-mutater";
import { TKeyPrimitiveMutateModuleContext } from "../mutaters/shared";
import { IDiccPrimitiveProviderActionConfigG } from "../providers/primitive-provider";
import { TKeyPrimitiveProviderModuleContext } from "../providers/shared";
import { IDiccPrimitiveValActionConfigG } from "../validators/primitive-validation";
import { IDiccRequestValActionConfigG } from "../validators/request-validation";
import { TKeyPrimitiveValModuleContext } from "../validators/shared";
import { CriteriaHandler } from "./_criteria-handler";
import {
  IPrimitiveModifyCriteria,
  IPrimitiveReadCriteria,
  ISingleCondition,
  TAConds,
  TKeyPrimitiveCriteriaModuleContext,
  TPrimitiveBaseCriteria,
} from "./shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**refactorización de la clase*/
export type Trf_PrimitiveCriteriaHandler = PrimitiveCriteriaHandler<any>;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *selfconstructor*
 *
 */
export class PrimitiveCriteriaHandler<
  TValue,
  TIDiccPrimitiveMutateAC extends IDiccPrimitiveMutateActionConfigG = IDiccPrimitiveMutateActionConfigG,
  TIDiccPrimitiveValAC extends IDiccPrimitiveValActionConfigG = IDiccPrimitiveValActionConfigG,
  TIDiccRequestValAC extends IDiccRequestValActionConfigG = IDiccRequestValActionConfigG,
  TIDiccPrimitiveHookAC extends IDiccPrimitiveHookActionConfigG = IDiccPrimitiveHookActionConfigG,
  TIDiccPrimitiveProviderAC extends IDiccPrimitiveProviderActionConfigG = IDiccPrimitiveProviderActionConfigG
> extends CriteriaHandler {
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
      KEYS_GLOBAL_AC: [
        "primitiveMutate",
        "primitiveVal",
        "requestVal",
        "primitiveHook",
        "primitiveProvider",
      ] as Array<
        | TKeyPrimitiveMutateModuleContext
        | TKeyPrimitiveValModuleContext
        | TKeyPrimitiveHookModuleContext
        | TKeyPrimitiveProviderModuleContext
      >,
    };
  };
  public override get metadataHandler(): Trf_PrimitiveLogicMetadataHandler {
    return super.metadataHandler as Trf_PrimitiveLogicMetadataHandler;
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
    metadataHandler: Trf_PrimitiveLogicMetadataHandler,
    base: TPrimitiveBaseCriteria<
      TIDiccPrimitiveMutateAC,
      TIDiccPrimitiveValAC,
      TIDiccRequestValAC,
      TIDiccPrimitiveHookAC,
      TIDiccPrimitiveProviderAC
    > = {
      type: "read",
    },
    isInit = true
  ) {
    super("primitive", keySrc, metadataHandler, base, false);
    if (isInit) this.initProps(base);
    this.initMergeDiccGlobalAC();
    this.initAKeysGlobalAC();
  }
  protected override getDefault() {
    return PrimitiveCriteriaHandler.getDefault();
  }
  protected override getCONST() {
    return PrimitiveCriteriaHandler.getCONSTANTS();
  }
  public override resetPropByKey(
    key: keyof ReturnType<PrimitiveCriteriaHandler<TValue>["getDefault"]>
  ): void {
    return super.resetPropByKey(key as any);
  }
  public override mutateProps(
    base: Partial<
      Omit<
        ReturnType<PrimitiveCriteriaHandler<TValue>["getDefault"]>,
        "keyLogicContext" | "keySrc" | "keysPath" | "p_Key" | "s_Key"
      >
    >
  ): void {
    super.mutateProps(base);
    return;
  }
  public override getLiteral():
    | IPrimitiveReadCriteria
    | IPrimitiveModifyCriteria {
    return super.getLiteral() as any;
  }
  protected override initMergeDiccGlobalAC(): void {
    let bf_diccGlobalAC = {};
    const keysModuleContext = this.getCONST().KEYS_GLOBAL_AC;
    const mH = this.metadataHandler;
    if (this.util.isObject(this.diccGlobalAC)) {
      const bACOption: IBuildACOption = {
        mergeMode: "soft",
      };
      for (const keyModuleContext of keysModuleContext) {
        if (
          keyModuleContext !== "primitiveMutate" &&
          keyModuleContext !== "primitiveVal" &&
          keyModuleContext !== "requestVal" &&
          keyModuleContext !== "primitiveHook" &&
          keyModuleContext === "primitiveProvider"
        )
          continue;
        let actionModule =
          mH.getModuleInstanceForActionContext(keyModuleContext);
        const newDicc = this.util.isObject(this.diccGlobalAC[keyModuleContext])
          ? this.diccGlobalAC[keyModuleContext]
          : {};
        bf_diccGlobalAC[keyModuleContext] =
          actionModule.buildContainerActionsConfig(
            "toActionConfig_DiccWrapped",
            newDicc,
            bACOption
          );
      }
    } else {
      const diccModelMutate = mH.getDiccActionConfigByModuleContext("mutater");
      const diccModelVal = mH.getDiccActionConfigByModuleContext(
        "validator",
        "primitiveVal"
      );
      const diccReqVal = mH.getDiccActionConfigByModuleContext(
        "validator",
        "requestVal"
      );
      const diccStructureHook = mH.getDiccActionConfigByModuleContext("hook");
      const diccStructureProvider =
        mH.getDiccActionConfigByModuleContext("provider");
      for (const keyModuleContext of keysModuleContext) {
        if (keyModuleContext === "primitiveMutate") {
          bf_diccGlobalAC[keyModuleContext] = diccModelMutate;
        } else if (keyModuleContext === "primitiveVal") {
          bf_diccGlobalAC[keyModuleContext] = diccModelVal;
        } else if (keyModuleContext === "requestVal") {
          bf_diccGlobalAC[keyModuleContext] = diccReqVal;
        } else if (keyModuleContext === "primitiveHook") {
          bf_diccGlobalAC[keyModuleContext] = diccStructureHook;
        } else if (keyModuleContext === "primitiveProvider") {
          bf_diccGlobalAC[keyModuleContext] = diccStructureProvider;
        } else {
          continue;
        }
      }
      this.diccGlobalAC = bf_diccGlobalAC;
    }
    return;
  }
  protected override initAKeysGlobalAC(): void {
    const mH = this.metadataHandler;
    const diccACtrl = mH.getDiccActionConfigByModuleContext("controller");
    this.aTKeysGlobalActionConfig = diccACtrl[this.keyActionRequest] as Array<
      [string, string]
    >;
    return;
  }
  public override getGlobalActionByTKeyGlobalAC<TKeyActionConfig>(
    tKeyGlobalAC: Array<
      [
        (
          | TKeyPrimitiveMutateModuleContext
          | TKeyPrimitiveValModuleContext
          | TKeyPrimitiveHookModuleContext
          | TKeyPrimitiveProviderModuleContext
        ),
        TKeyActionConfig
      ]
    >
  ): any {
    return super.getGlobalActionByTKeyGlobalAC(tKeyGlobalAC);
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
}
