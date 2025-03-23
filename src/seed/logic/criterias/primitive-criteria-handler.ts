import { Module } from "../config/module";
import { ELogicCodeError, LogicError } from "../errors/logic-error";
import { IDiccPrimitiveHookActionConfigG } from "../hooks/primitive-hook";
import { TKeyPrimitiveHookModuleContext } from "../hooks/shared";
import { TKeyPrimitiveInternalACModuleContext } from "../meta/metadata-shared";
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
  TPrimitiveDiccGlobalAC,
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
  TIDiccPrimitiveProviderAC extends IDiccPrimitiveProviderActionConfigG = IDiccPrimitiveProviderActionConfigG,
  TKeyDiccActionRequest extends string = string
> extends CriteriaHandler<TKeyDiccActionRequest> {
  public static override getDefault = () => {
    const superDf = CriteriaHandler.getDefault();
    return {
      ...superDf,
      diccGlobalAC: {
        primitiveMutate: {},
        primitiveVal: {},
        requestVal: {},
        primitiveHook: {},
        primitiveProvider: {},
      },
    } as typeof superDf & IPrimitiveReadCriteria & IPrimitiveModifyCriteria;
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
  public override get diccGlobalAC(): TPrimitiveDiccGlobalAC<
    TIDiccPrimitiveMutateAC,
    TIDiccPrimitiveValAC,
    TIDiccRequestValAC,
    TIDiccPrimitiveHookAC,
    TIDiccPrimitiveProviderAC
  > {
    return super.diccGlobalAC;
  }
  public override set diccGlobalAC(
    v: TPrimitiveDiccGlobalAC<
      TIDiccPrimitiveMutateAC,
      TIDiccPrimitiveValAC,
      TIDiccRequestValAC,
      TIDiccPrimitiveHookAC,
      TIDiccPrimitiveProviderAC
    >
  ) {
    super.diccGlobalAC = v;
  }
  /**... */
  constructor(
    metadataHandler: Trf_PrimitiveLogicMetadataHandler,
    base: TPrimitiveBaseCriteria<
      TIDiccPrimitiveMutateAC,
      TIDiccPrimitiveValAC,
      TIDiccRequestValAC,
      TIDiccPrimitiveHookAC,
      TIDiccPrimitiveProviderAC,
      TKeyDiccActionRequest
    > = {
      type: "read",
      keyActionRequest: undefined,
    },
    isInit = true
  ) {
    super("primitive", metadataHandler, base, false);
    //asignación a propiedades especiales
    //...
    if (isInit) this.initProps(base);
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
  public static rebuildCustomConfigFromModuleContext(
    currentContextConfig: IPrimitiveReadCriteria<any> &
      IPrimitiveModifyCriteria<any>,
    newContextConfig: IPrimitiveReadCriteria<any> &
      IPrimitiveModifyCriteria<any>
  ): IPrimitiveReadCriteria<any> & IPrimitiveModifyCriteria<any> {
    const util = Module.util;
    let rConfig: IPrimitiveReadCriteria<any> & IPrimitiveModifyCriteria<any>;
    const dfCC = PrimitiveCriteriaHandler.getDefault();
    const cCC = (
      util.isObject(currentContextConfig) ? currentContextConfig : dfCC
    ) as IPrimitiveReadCriteria<any> & IPrimitiveModifyCriteria<any>;
    const nCC = newContextConfig as IPrimitiveReadCriteria<any> &
      IPrimitiveModifyCriteria<any>;
    if (!util.isObject(nCC)) {
      rConfig = cCC;
    } else {
      rConfig = {
        ...nCC,
        keySrc: util.isString(nCC.keySrc) ? nCC.keySrc : cCC.keySrc,
        p_Key: util.isString(nCC.p_Key) ? nCC.p_Key : cCC.p_Key,
        s_Key: util.isString(nCC.s_Key) ? nCC.s_Key : cCC.s_Key,
        keyLogicContext: util.isString(nCC.keyLogicContext)
          ? nCC.keyLogicContext
          : cCC.keyLogicContext,
        keyActionRequest: util.isString(nCC.keyActionRequest)
          ? nCC.keyActionRequest
          : cCC.keyActionRequest,
        type: util.isString(nCC.type) ? nCC.type : cCC.type,
        modifyType: util.isString(nCC.modifyType)
          ? nCC.modifyType
          : cCC.modifyType,
        diccGlobalAC: util.isObject(nCC.diccGlobalAC)
          ? {
              primitiveMutate: util.mergeDiccActionConfig(
                [
                  nCC.diccGlobalAC.primitiveMutate,
                  cCC.diccGlobalAC.primitiveMutate,
                ],
                { mode: "hard" }
              ),
              primitiveVal: util.mergeDiccActionConfig(
                [nCC.diccGlobalAC.primitiveVal, cCC.diccGlobalAC.primitiveVal],
                { mode: "hard" }
              ),
              requestVal: util.mergeDiccActionConfig(
                [nCC.diccGlobalAC.requestVal, cCC.diccGlobalAC.requestVal],
                { mode: "hard" }
              ),
              primitiveHook: util.mergeDiccActionConfig(
                [
                  nCC.diccGlobalAC.primitiveHook,
                  cCC.diccGlobalAC.primitiveHook,
                ],
                { mode: "hard" }
              ),
              primitiveProvider: util.mergeDiccActionConfig(
                [
                  nCC.diccGlobalAC.primitiveProvider,
                  cCC.diccGlobalAC.primitiveProvider,
                ],
                { mode: "hard" }
              ),
            }
          : cCC.diccGlobalAC,
        diccQueryParam: util.deepMergeObjects(
          [nCC.diccQueryParam, cCC.diccQueryParam],
          { mode: "soft", isNullAsUndefined: true }
        ),
        aTCustomQueryDriverFunctions: util.isArray(
          nCC.aTCustomQueryDriverFunctions,
          true
        )
          ? nCC.aTCustomQueryDriverFunctions
          : cCC.aTCustomQueryDriverFunctions,
        aTKeysGlobalActionConfig: util.isArray(
          nCC.aTKeysGlobalActionConfig,
          true
        )
          ? nCC.aTKeysGlobalActionConfig
          : cCC.aTKeysGlobalActionConfig,
        isCreateOrUpdate: util.isBoolean(nCC.isCreateOrUpdate)
          ? nCC.isCreateOrUpdate
          : cCC.isCreateOrUpdate,
        sort: util.isArray(nCC.sort) ? nCC.sort : cCC.sort,
        limit: util.isNumber(nCC.limit) ? nCC.limit : cCC.limit,
        targetPage: util.isNumber(nCC.targetPage)
          ? nCC.targetPage
          : cCC.targetPage,
        targetPageLogic: util.isNumber(nCC.targetPageLogic)
          ? nCC.targetPageLogic
          : cCC.targetPageLogic,
        expectedDataType: util.isString(nCC.expectedDataType)
          ? nCC.expectedDataType
          : cCC.expectedDataType,
        urlsExtended: util.isArray(nCC.urlsExtended)
          ? nCC.urlsExtended
          : cCC.urlsExtended,
      };
    }
    return rConfig;
  }
  protected override mergeBaseCriteriaWithPriority(): IPrimitiveReadCriteria<any> &
    IPrimitiveModifyCriteria<any> {
    const mH = this.metadataHandler;
    let rCriteria: IPrimitiveReadCriteria<any> & IPrimitiveModifyCriteria<any>;
    const keyAR = this.keyActionRequest;
    const modelCtrlC = mH.getExtractMetadataByModuleContext("controller");
    const { diccCriteriaRequestConfig } = modelCtrlC.__ctrlConfig.primitiveCtrl;
    const baseCRC = diccCriteriaRequestConfig[
      keyAR
    ] as IPrimitiveReadCriteria<any> & IPrimitiveModifyCriteria<any>;
    const newCRC = this.getLiteral() as IPrimitiveReadCriteria<any> &
      IPrimitiveModifyCriteria<any>;
    rCriteria = PrimitiveCriteriaHandler.rebuildCustomConfigFromModuleContext(
      baseCRC as any,
      newCRC as any
    );
    return rCriteria;
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
  public extractDiccByKeyModuleContext(
    keysModuleContext:
      | TKeyPrimitiveInternalACModuleContext
      | TKeyPrimitiveInternalACModuleContext[]
  ): void {
    super.extractDiccByKeyModuleContext(keysModuleContext);
    return;
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
            ["op", "vCond"],
            { propCondition: "is-not-undefined-and-not-null" }
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
