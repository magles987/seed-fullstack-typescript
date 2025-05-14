import { LogicError, ELogicCodeError } from "../errors/logic-error";
import { PrimitiveLogicHook } from "../hooks/primitive-hook";
import { TKeyPrimitiveHookModuleContext } from "../hooks/shared-types";
import { Trf_PrimitiveLogicMetadataHandler } from "../meta/primitive-metadata-handler";
import { TKeyPrimitiveInternalACModuleContext } from "../meta/schema-shared-types";
import { TwinBeeModule } from "../modules/module";
import { PrimitiveLogicMutater } from "../mutaters/primitive-mutater";
import { TKeyPrimitiveMutateModuleContext } from "../mutaters/shared-types";
import { PrimitiveLogicProvider } from "../providers/primitive-provider";
import { TKeyPrimitiveProviderModuleContext } from "../providers/shared-types";
import { PrimitiveLogicValidation } from "../validators/primitive-validation";
import { RequestLogicValidation } from "../validators/request-validation";
import { TKeyPrimitiveValModuleContext } from "../validators/shared-types";
import { CriteriaHandler } from "./_criteria-handler";
import {
  IPrimitiveReadCriteria,
  IPrimitiveModifyCriteria,
  TKeyPrimitiveCriteriaModuleContext,
  IPrimitiveCriteria,
  TPrimitiveBaseCriteria,
  TAConds,
  ISingleCondition,
} from "./shared-types";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**refactorización de la clase*/
export type Trf_PrimitiveCriteriaHandler = PrimitiveCriteriaHandler<any>;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *selfconstructor*
 *
 */
export class PrimitiveCriteriaHandler<
  TValue,
  TIDiccPrimitiveMutateAC extends PrimitiveLogicMutater["diccActionConfig"] = PrimitiveLogicMutater["diccActionConfig"],
  TIDiccPrimitiveValAC extends PrimitiveLogicValidation["diccActionConfig"] = PrimitiveLogicValidation["diccActionConfig"],
  TIDiccRequestValAC extends RequestLogicValidation["diccActionConfig"] = RequestLogicValidation["diccActionConfig"],
  TIDiccPrimitiveHookAC extends PrimitiveLogicHook["diccActionConfig"] = PrimitiveLogicHook["diccActionConfig"],
  TIDiccPrimitiveProviderAC extends PrimitiveLogicProvider["diccActionConfig"] = PrimitiveLogicProvider["diccActionConfig"],
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
  public override get aTGlobalActionConfig(): IPrimitiveCriteria<
    TIDiccPrimitiveMutateAC,
    TIDiccPrimitiveValAC,
    TIDiccRequestValAC,
    TIDiccPrimitiveHookAC,
    TIDiccPrimitiveProviderAC,
    TKeyDiccActionRequest
  >["aTGlobalActionConfig"] {
    return super.aTGlobalActionConfig as any;
  }
  public override set aTGlobalActionConfig(
    v: IPrimitiveCriteria<
      TIDiccPrimitiveMutateAC,
      TIDiccPrimitiveValAC,
      TIDiccRequestValAC,
      TIDiccPrimitiveHookAC,
      TIDiccPrimitiveProviderAC,
      TKeyDiccActionRequest
    >["aTGlobalActionConfig"]
  ) {
    super.aTGlobalActionConfig = v as any;
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
    const util = TwinBeeModule.util;
    let baseRebuildCriteria: IPrimitiveReadCriteria<any> &
      IPrimitiveModifyCriteria<any>;
    const dfCC = PrimitiveCriteriaHandler.getDefault();
    const cCC = (
      util.isObject(currentContextConfig) ? currentContextConfig : dfCC
    ) as IPrimitiveReadCriteria<any> & IPrimitiveModifyCriteria<any>;
    const nCC = newContextConfig as IPrimitiveReadCriteria<any> &
      IPrimitiveModifyCriteria<any>;
    if (!util.isObject(nCC)) {
      baseRebuildCriteria = cCC;
    } else {
      baseRebuildCriteria = {
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
        aTGlobalActionConfig: util.isArray(nCC.aTGlobalActionConfig)
          ? nCC.aTGlobalActionConfig
          : cCC.aTGlobalActionConfig,
        diccQueryParam: util.deepMergeObjects(
          [cCC.diccQueryParam, nCC.diccQueryParam],
          { mode: "soft", isNullAsUndefined: true }
        ),
        aTCustomQueryDriverFunctions: util.isArray(
          nCC.aTCustomQueryDriverFunctions,
          true
        )
          ? nCC.aTCustomQueryDriverFunctions
          : cCC.aTCustomQueryDriverFunctions,
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
    baseRebuildCriteria =
      PrimitiveCriteriaHandler.mergeDiccGACToATGAC(baseRebuildCriteria);
    return baseRebuildCriteria;
  }
  /**... */
  protected static mergeDiccGACToATGAC<TBaseRC>(
    baseRebuildCriteria: TBaseRC
  ): TBaseRC {
    const util = TwinBeeModule.util;
    const bC = baseRebuildCriteria as IPrimitiveReadCriteria &
      IPrimitiveModifyCriteria &
      TPrimitiveBaseCriteria;
    let diccGAC = bC.diccGlobalAC;
    let aGAC = bC.aTGlobalActionConfig;
    diccGAC = (
      util.isObject(diccGAC)
        ? {
            ...diccGAC,
            primitiveMutate: util.isObject(diccGAC.primitiveMutate)
              ? diccGAC.primitiveMutate
              : {},
            primitiveVal: util.isObject(diccGAC.primitiveVal)
              ? diccGAC.primitiveVal
              : {},
            requestVal: util.isObject(diccGAC.requestVal)
              ? diccGAC.requestVal
              : {},
            primitiveHook: util.isObject(diccGAC.primitiveHook)
              ? diccGAC.primitiveHook
              : {},
            primitiveProvider: util.isObject(diccGAC.primitiveProvider)
              ? diccGAC.primitiveProvider
              : {},
          }
        : {
            primitiveMutate: {},
            primitiveVal: {},
            requestVal: {},
            primitiveHook: {},
            primitiveProvider: {},
          }
    ) as typeof diccGAC;
    (
      baseRebuildCriteria as IPrimitiveReadCriteria &
        IPrimitiveModifyCriteria &
        TPrimitiveBaseCriteria
    ).aTGlobalActionConfig = aGAC.map((tGAC) => {
      const [keyModuleContext, keyAction, baseAC] = tGAC;
      const mCC = diccGAC[keyModuleContext];
      const newAC = mCC[keyAction];
      tGAC[2] = util.mergeActionConfig([baseAC, newAC], { mode: "soft" });
      //❗Las acciones de configuración en el diccionario que no estén en la tupla son ignoradas❗
      return tGAC;
    });
    return baseRebuildCriteria;
  }
  protected override mergeBaseCriteriaWithPriority(
    newCRC: IPrimitiveReadCriteria & IPrimitiveModifyCriteria
  ): IPrimitiveReadCriteria<any> & IPrimitiveModifyCriteria<any> {
    if (!this.util.isObject(newCRC)) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${newCRC} is not criteria request configuration valid`,
      });
    }
    const mH = this.metadataHandler;
    const { keyActionRequest } = newCRC;
    const diccActionRequest =
      mH.getDiccActionConfigByModuleContext("controller");
    const baseCRC = diccActionRequest[
      keyActionRequest
    ] as IPrimitiveReadCriteria<any> & IPrimitiveModifyCriteria<any>;
    newCRC = PrimitiveCriteriaHandler.rebuildCustomConfigFromModuleContext(
      baseCRC as any,
      newCRC as any
    ) as any;
    return newCRC;
  }
  public override findGlobalActionByKeyModuleAndKeyAction<TKeyActionConfig>(
    tKeyGlobalAC: [TKeyPrimitiveInternalACModuleContext, TKeyActionConfig]
  ): any {
    return super.findGlobalActionByKeyModuleAndKeyAction(tKeyGlobalAC as any);
  }
  public override filterGlobalActionByKeyModule(
    keysModuleContext:
      | Array<TKeyPrimitiveInternalACModuleContext>
      | TKeyPrimitiveInternalACModuleContext
  ): typeof this.aTGlobalActionConfig {
    return super.filterGlobalActionByKeyModule(keysModuleContext) as any;
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
