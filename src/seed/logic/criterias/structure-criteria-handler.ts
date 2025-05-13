import { Module, TKeyStructureContextFull } from "../modules/index-barrel";
import { ELogicCodeError, LogicError } from "../errors/index-barrel";
import {
  StructureLogicHook,
  TKeyStructureHookModuleContext,
} from "../hooks/index-barrel";
import {
  TKeyStructureInternalACModuleContext,
  Trf_StructureLogicMetadataHandler,
} from "../meta/index-barrel";
import {
  FieldLogicMutater,
  ModelLogicMutater,
  TKeyStructureDeepMutateModuleContext,
} from "../mutaters/index-barrel";
import {
  StructureLogicProvider,
  TKeyStructureProviderModuleContext,
} from "../providers/index-barrel";
import {
  FieldLogicValidation,
  ModelLogicValidation,
  RequestLogicValidation,
  TKeyStructureDeepValModuleContext,
} from "../validators/index-barrel";
import { CriteriaHandler } from "./_criteria-handler";
import {
  ISingleCondition,
  IStructureEmbModelCriteria,
  IStructureFieldCriteria,
  IStructureModelCriteria,
  IStructureModelModifyCriteria,
  IStructureModelReadCriteria,
  TAConds,
  TKeyStructureCriteriaModuleContext,
  TStructureEmbModelBaseCriteria,
  TStructureFieldBaseCriteria,
  TStructureModelBaseCriteria,
} from "./shared-types";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**refactorización de la clase*/
export type Trf_StructureCriteriaHandler = StructureCriteriaHandler<any>;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *selfconstructor*
 *
 */
export class StructureCriteriaHandler<
  TModel,
  TIDiccFieldMutateAC extends FieldLogicMutater["diccActionConfig"] = FieldLogicMutater["diccActionConfig"],
  TIDiccModelMutateAC extends ModelLogicMutater["diccActionConfig"] = ModelLogicMutater["diccActionConfig"],
  TIDiccFieldValAC extends FieldLogicValidation["diccActionConfig"] = FieldLogicValidation["diccActionConfig"],
  TIDiccModelValAC extends ModelLogicValidation["diccActionConfig"] = ModelLogicValidation["diccActionConfig"],
  TIDiccRequestValAC extends RequestLogicValidation["diccActionConfig"] = RequestLogicValidation["diccActionConfig"],
  TIDiccStructureHookAC extends StructureLogicHook["diccActionConfig"] = StructureLogicHook["diccActionConfig"],
  TIDiccStructureProviderAC extends StructureLogicProvider["diccActionConfig"] = StructureLogicProvider["diccActionConfig"],
  TKeyDiccActionRequest extends string = string
> extends CriteriaHandler<TKeyDiccActionRequest> {
  public static override readonly getDefault = () => {
    const superDf = CriteriaHandler.getDefault();
    return {
      ...superDf,
      sort: {},
      keysPath: [],
      keyPath: "",
      keyStructureContext: "structureModel",
    } as typeof superDf &
      IStructureModelReadCriteria<any> &
      IStructureModelModifyCriteria<any>;
  };
  public static override getCONSTANTS = () => {
    const superCONST = CriteriaHandler.getCONSTANTS();
    return {
      ...superCONST,
      KEYS_GLOBAL_AC: [
        "fieldMutate",
        "modelMutate",
        "fieldVal",
        "modelVal",
        "requestVal",
        "structureHook",
        "structureProvider",
      ] as Array<
        | TKeyStructureDeepMutateModuleContext
        | TKeyStructureDeepValModuleContext
        | TKeyStructureHookModuleContext
        | TKeyStructureProviderModuleContext
      >,
    };
  };
  public override get metadataHandler(): Trf_StructureLogicMetadataHandler {
    return super.metadataHandler as Trf_StructureLogicMetadataHandler;
  }
  public override get keyModuleContext(): TKeyStructureCriteriaModuleContext {
    return "structureCriteria";
  }
  private _keyStructureContext: TKeyStructureContextFull;
  public get keyStructureContext(): TKeyStructureContextFull {
    return this._keyStructureContext;
  }
  protected set keyStructureContext(v: TKeyStructureContextFull) {
    //solo se permite 1 vez la asignacion
    if (this._keyStructureContext !== undefined) return;
    this._keyStructureContext =
      v === "structureField" ||
      v === "structureEmbedded" ||
      v === "structureModel"
        ? v
        : this._keyStructureContext !== undefined
        ? this._keyStructureContext
        : this.getDefault().keyStructureContext;
  }
  public override get aTGlobalActionConfig(): IStructureModelCriteria<
    TModel,
    TIDiccModelMutateAC,
    TIDiccModelValAC,
    TIDiccRequestValAC,
    TIDiccStructureHookAC,
    TIDiccStructureProviderAC,
    TKeyDiccActionRequest
  >["aTGlobalActionConfig"] {
    return super.aTGlobalActionConfig as any;
  }
  public override set aTGlobalActionConfig(
    v: IStructureModelCriteria<
      TModel,
      TIDiccModelMutateAC,
      TIDiccModelValAC,
      TIDiccRequestValAC,
      TIDiccStructureHookAC,
      TIDiccStructureProviderAC,
      TKeyDiccActionRequest
    >["aTGlobalActionConfig"]
  ) {
    super.aTGlobalActionConfig = v as any;
  }
  public override get sort(): IStructureModelReadCriteria<TModel>["sort"] {
    return super.sort as any;
  }
  public override set sort(v: IStructureModelReadCriteria<TModel>["sort"]) {
    super.sort = this.util.isObject(v) ? v : super.sort;
    return;
  }
  public override get s_Key(): string {
    const mH = this.metadataHandler;
    const metadata = mH.getExtractMetadataByStructureContext("structureModel");
    return metadata.__S_Key;
  }
  protected set s_Key(v: string) {} //❗NO ASIGNABLE❗, pero es necesario para el selfconstructor
  public override get p_Key(): string {
    const mH = this.metadataHandler;
    const metadata = mH.getExtractMetadataByStructureContext("structureModel");
    return metadata.__P_Key;
  }
  protected set p_Key(v: string) {} //❗NO ASIGNABLE❗, pero es necesario para el selfconstructor
  private _keyPath: string;
  public get keyPath(): string {
    return this._keyPath;
  }
  public set keyPath(v: string) {
    this._keyPath = this.util.isString(v)
      ? v
      : this._keyPath !== undefined
      ? this._keyPath
      : this.getDefault().keyPath;
  }
  private _keysPath: string[];
  public get keysPath(): string[] {
    return this._keysPath;
  }
  public set keysPath(v: string[]) {
    this._keysPath = this.util.isArray(v)
      ? v
      : this._keysPath !== undefined
      ? this._keysPath
      : this.getDefault().keysPath;
  }
  /**
   * @param pCursor propiedades opcionales para
   * personalizar la inicializacion del cursor
   */
  constructor(
    metadataHandler: Trf_StructureLogicMetadataHandler,
    keyStructureContext: TKeyStructureContextFull,
    base: TStructureModelBaseCriteria<
      TModel,
      TIDiccModelMutateAC,
      TIDiccModelValAC,
      TIDiccRequestValAC,
      TIDiccStructureHookAC,
      TIDiccStructureProviderAC,
      TKeyDiccActionRequest
    >,
    isInit = true
  ) {
    super("structure", metadataHandler, base, false);
    //asignación a propiedades especiales
    this.keyStructureContext = keyStructureContext;
    if (isInit) this.initProps(base);
  }
  protected override getDefault() {
    return StructureCriteriaHandler.getDefault();
  }
  protected override getCONST() {
    return StructureCriteriaHandler.getCONSTANTS();
  }
  public override resetPropByKey(
    key: keyof ReturnType<StructureCriteriaHandler<TModel>["getDefault"]>
  ): void {
    return super.resetPropByKey(key as any);
  }
  public override mutateProps(
    base: Partial<
      Omit<
        ReturnType<
          StructureCriteriaHandler<
            TModel,
            TIDiccFieldMutateAC,
            TIDiccModelMutateAC,
            TIDiccFieldValAC,
            TIDiccModelValAC,
            TIDiccRequestValAC,
            TIDiccStructureHookAC,
            TIDiccStructureProviderAC,
            TKeyDiccActionRequest
          >["getDefault"]
        >,
        "keyLogicContext" | "keySrc" | "keysPath" | "p_Key" | "s_Key"
      >
    >
  ): void {
    super.mutateProps(base);
    return;
  }
  public override getLiteral(): IStructureModelReadCriteria<
    TModel,
    TIDiccModelMutateAC,
    TIDiccModelValAC,
    TIDiccRequestValAC,
    TIDiccStructureHookAC,
    TIDiccStructureProviderAC,
    TKeyDiccActionRequest
  > &
    IStructureModelModifyCriteria<
      TModel,
      TIDiccModelMutateAC,
      TIDiccModelValAC,
      TIDiccRequestValAC,
      TIDiccStructureHookAC,
      TIDiccStructureProviderAC,
      TKeyDiccActionRequest
    > {
    return super.getLiteral() as any;
  }
  /**... */
  public static rebuildCustomConfigFromModuleContext(
    keyStructureContext: "structureField",
    currentContextConfig: IStructureFieldCriteria<any>,
    newContextConfig: IStructureFieldCriteria<any>
  ): IStructureFieldCriteria<any>;
  public static rebuildCustomConfigFromModuleContext(
    keyStructureContext: "structureEmbedded",
    currentContextConfig: IStructureEmbModelCriteria<any>,
    newContextConfig: IStructureEmbModelCriteria<any>
  ): IStructureEmbModelCriteria<any>;
  public static rebuildCustomConfigFromModuleContext(
    keyStructureContext: "structureModel",
    currentContextConfig: IStructureModelReadCriteria<any> &
      IStructureModelModifyCriteria<any>,
    newContextConfig: IStructureModelReadCriteria<any> &
      IStructureModelModifyCriteria<any>
  ): IStructureModelReadCriteria<any> & IStructureModelModifyCriteria<any>;
  public static rebuildCustomConfigFromModuleContext(
    keyStructureContext: TKeyStructureContextFull,
    currentContextConfig: unknown,
    newContextConfig: unknown
  ): unknown {
    const util = Module.util;
    let baseRebuildCriteria: unknown;
    if (keyStructureContext === "structureField") {
      const df = StructureCriteriaHandler.getDefault();
      const dfCC = {
        keyPath: df.keyPath,
        keysPath: df.keysPath,
        aTGlobalActionConfig: df.aTGlobalActionConfig,
      } as IStructureFieldCriteria<any>;
      const cCC = (
        util.isObject(currentContextConfig) ? currentContextConfig : dfCC
      ) as IStructureFieldCriteria<any>;
      const nCC = newContextConfig as IStructureFieldCriteria<any>;
      let baseRebuildFieldConfig: IStructureFieldCriteria<any>;
      if (!util.isObject(nCC)) {
        baseRebuildFieldConfig = cCC;
      } else {
        baseRebuildFieldConfig = {
          ...nCC,
          aTGlobalActionConfig: util.isArray(nCC.aTGlobalActionConfig)
            ? nCC.aTGlobalActionConfig
            : cCC.aTGlobalActionConfig,
          keyPath: util.isString(nCC.keyPath) ? nCC.keyPath : cCC.keyPath,
          keysPath: util.isArray(nCC.keysPath) ? nCC.keysPath : cCC.keysPath,
        };
      }
      baseRebuildCriteria = baseRebuildFieldConfig;
    } else if (keyStructureContext === "structureEmbedded") {
      const df = StructureCriteriaHandler.getDefault();
      const dfCC = {
        keyPath: df.keyPath,
        keysPath: df.keysPath,
        aTGlobalActionConfig: df.aTGlobalActionConfig,
      } as IStructureEmbModelCriteria<any>;
      const cCC = (
        util.isObject(currentContextConfig) ? currentContextConfig : dfCC
      ) as IStructureEmbModelCriteria<any>;
      const nCC = newContextConfig as IStructureEmbModelCriteria<any>;
      let baseRebuildEmbModelConfig: IStructureEmbModelCriteria<any>;
      if (!util.isObject(nCC)) {
        baseRebuildEmbModelConfig = cCC;
      } else {
        baseRebuildEmbModelConfig = {
          ...nCC,
          aTGlobalActionConfig: util.isArray(nCC.aTGlobalActionConfig)
            ? nCC.aTGlobalActionConfig
            : cCC.aTGlobalActionConfig,
          keyPath: util.isString(nCC.keyPath) ? nCC.keyPath : cCC.keyPath,
          keysPath: util.isArray(nCC.keysPath) ? nCC.keysPath : cCC.keysPath,
        };
      }
      baseRebuildCriteria = baseRebuildEmbModelConfig;
    } else if (keyStructureContext === "structureModel") {
      const dfCC = StructureCriteriaHandler.getDefault();
      const cCC = (
        util.isObject(currentContextConfig) ? currentContextConfig : dfCC
      ) as IStructureModelReadCriteria<any> &
        IStructureModelModifyCriteria<any> &
        TStructureModelBaseCriteria<any>;
      const nCC = newContextConfig as IStructureModelReadCriteria<any> &
        IStructureModelModifyCriteria<any> &
        TStructureModelBaseCriteria<any>;
      let baseRebuildModelConfig: IStructureModelReadCriteria<any> &
        IStructureModelModifyCriteria<any>;
      if (!util.isObject(nCC)) {
        baseRebuildModelConfig = cCC;
      } else {
        baseRebuildModelConfig = {
          ...nCC,
          keySrc: util.isString(nCC.keySrc) ? nCC.keySrc : cCC.keySrc,
          keyPath: util.isString(nCC.keyPath) ? nCC.keyPath : cCC.keyPath,
          keysPath: util.isString(nCC.keysPath) ? nCC.keysPath : cCC.keysPath,
          keyStructureContext: util.isString(nCC.keyStructureContext)
            ? nCC.keyStructureContext
            : cCC.keyStructureContext,
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
      baseRebuildCriteria = baseRebuildModelConfig;
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${keyStructureContext} is not structure context key valid`,
      });
    }
    baseRebuildCriteria = StructureCriteriaHandler.mergeDiccGACToATGAC(
      keyStructureContext,
      baseRebuildCriteria
    );
    return baseRebuildCriteria;
  }
  /**... */
  protected static mergeDiccGACToATGAC<TBaseRC>(
    keyStructureContext: TKeyStructureContextFull,
    baseRebuildCriteria: TBaseRC
  ): TBaseRC {
    const util = Module.util;
    if (keyStructureContext === "structureField") {
      const bC = baseRebuildCriteria as IStructureFieldCriteria<any> &
        TStructureFieldBaseCriteria<any>;
      let diccGAC = bC.diccGlobalAC;
      let aGAC = bC.aTGlobalActionConfig;
      diccGAC = (
        util.isObject(diccGAC)
          ? {
              ...diccGAC,
              fieldMutate: util.isObject(diccGAC.fieldMutate)
                ? diccGAC.fieldMutate
                : {}, //❕Asumir la predefinida en la fusion❕
              fieldVal: util.isObject(diccGAC.fieldVal) ? diccGAC.fieldVal : {}, //❕Asumir la predefinida en la fusion❕
              structureHook: util.isObject(diccGAC.structureHook)
                ? diccGAC.structureHook
                : {}, //❕Asumir la predefinida en la fusion❕
              structureCtrl: util.isObject(diccGAC.structureCtrl)
                ? diccGAC.structureCtrl
                : {}, //❕Asumir la predefinida en la fusion❕
            }
          : {
              fieldMutate: {}, //❕Asumir la predefinida en la fusion❕
              fieldVal: {}, //❕Asumir la predefinida en la fusion❕
              structureHook: {}, //❕Asumir la predefinida en la fusion❕
              structureCtrl: {}, //❕Asumir la predefinida en la fusion❕
            }
      ) as typeof diccGAC;
      (
        baseRebuildCriteria as IStructureFieldCriteria<any> &
          TStructureFieldBaseCriteria<any>
      ).aTGlobalActionConfig = aGAC.map((tGAC) => {
        const [keyModuleContext, keyAction, baseAC] = tGAC;
        const mCC = diccGAC[keyModuleContext];
        const newAC = mCC[keyAction];
        tGAC[2] = util.mergeActionConfig([baseAC, newAC], { mode: "soft" });
        //❗Las acciones de configuración en el diccionario que no estén en la tupla son ignoradas❗
        return tGAC;
      });
    } else if (keyStructureContext === "structureEmbedded") {
      const bC = baseRebuildCriteria as IStructureEmbModelCriteria<any> &
        TStructureEmbModelBaseCriteria<any>;
      let diccGAC = bC.diccGlobalAC;
      let aGAC = bC.aTGlobalActionConfig;
      diccGAC = (
        util.isObject(diccGAC)
          ? {
              ...diccGAC,
              modelMutate: util.isObject(diccGAC.modelMutate)
                ? diccGAC.modelMutate
                : {}, //❕Asumir la predefinida en la fusion❕
              modelVal: util.isObject(diccGAC.modelVal) ? diccGAC.modelVal : {}, //❕Asumir la predefinida en la fusion❕
              structureHook: util.isObject(diccGAC.structureHook)
                ? diccGAC.structureHook
                : {}, //❕Asumir la predefinida en la fusion❕
              structureCtrl: util.isObject(diccGAC.structureCtrl)
                ? diccGAC.structureCtrl
                : {}, //❕Asumir la predefinida en la fusion❕
            }
          : {
              modelMutate: {}, //❕Asumir la predefinida en la fusion❕
              modelVal: {}, //❕Asumir la predefinida en la fusion❕
              structureHook: {}, //❕Asumir la predefinida en la fusion❕
              structureCtrl: {}, //❕Asumir la predefinida en la fusion❕
            }
      ) as typeof diccGAC;
      (
        baseRebuildCriteria as IStructureEmbModelCriteria<any> &
          TStructureEmbModelBaseCriteria<any>
      ).aTGlobalActionConfig = aGAC.map((tGAC) => {
        const [keyModuleContext, keyAction, baseAC] = tGAC;
        const mCC = diccGAC[keyModuleContext];
        const newAC = mCC[keyAction];
        tGAC[2] = util.mergeActionConfig([baseAC, newAC], { mode: "soft" });
        //❗Las acciones de configuración en el diccionario que no estén en la tupla son ignoradas❗
        return tGAC;
      });
    } else if (keyStructureContext === "structureModel") {
      const bC = baseRebuildCriteria as IStructureModelReadCriteria<any> &
        IStructureModelModifyCriteria<any> &
        TStructureModelBaseCriteria<any>;
      let diccGAC = bC.diccGlobalAC;
      let aGAC = bC.aTGlobalActionConfig;
      diccGAC = (
        util.isObject(diccGAC)
          ? {
              ...diccGAC,
              modelMutate: util.isObject(diccGAC.modelMutate)
                ? diccGAC.modelMutate
                : {}, //❕Asumir la predefinida en la fusion❕
              modelVal: util.isObject(diccGAC.modelVal) ? diccGAC.modelVal : {}, //❕Asumir la predefinida en la fusion❕
              requestVal: util.isObject(diccGAC.requestVal)
                ? diccGAC.requestVal
                : {}, //❕Asumir la predefinida en la fusion❕
              structureHook: util.isObject(diccGAC.structureHook)
                ? diccGAC.structureHook
                : {}, //❕Asumir la predefinida en la fusion❕
              structureProvider: util.isObject(diccGAC.structureProvider)
                ? diccGAC.structureProvider
                : {}, //❕Asumir la predefinida en la fusion❕
              structureCtrl: util.isObject(diccGAC.structureCtrl)
                ? diccGAC.structureCtrl
                : {}, //❕Asumir la predefinida en la fusion❕
            }
          : {
              modelMutate: {}, //❕Asumir la predefinida en la fusion❕
              modelVal: {}, //❕Asumir la predefinida en la fusion❕
              requestVal: {}, //❕Asumir la predefinida en la fusion❕
              structureHook: {}, //❕Asumir la predefinida en la fusion❕
              structureProvider: {}, //❕Asumir la predefinida en la fusion❕
              structureCtrl: {}, //❕Asumir la predefinida en la fusion❕
            }
      ) as typeof diccGAC;
      (
        baseRebuildCriteria as IStructureModelReadCriteria<any> &
          IStructureModelModifyCriteria<any> &
          TStructureModelBaseCriteria<any>
      ).aTGlobalActionConfig = aGAC.map((tGAC) => {
        const [keyModuleContext, keyAction, baseAC] = tGAC;
        const mCC = diccGAC[keyModuleContext];
        const newAC = mCC[keyAction];
        tGAC[2] = util.mergeActionConfig([baseAC, newAC], { mode: "soft" });
        //❗Las acciones de configuración en el diccionario que no estén en la tupla son ignoradas❗
        return tGAC;
      });
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${keyStructureContext} is not structure context key valid`,
      });
    }
    return baseRebuildCriteria;
  }
  protected override mergeBaseCriteriaWithPriority(
    newCRC:
      | (IStructureModelReadCriteria<any> & IStructureModelModifyCriteria<any>)
      | IStructureFieldCriteria<any>
  ):
    | (IStructureModelReadCriteria<any> & IStructureModelModifyCriteria<any>)
    | IStructureFieldCriteria<any> {
    if (!this.util.isObject(newCRC)) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${newCRC} is not criteria request configuration valid`,
      });
    }
    const mH = this.metadataHandler;
    if (this.keyStructureContext === "structureField") {
      const { keyPath } = newCRC;
      const criteriaFieldRequestConfig = mH.getDiccActionConfigByModuleContext(
        this.keyStructureContext,
        "controller",
        "fieldCtrl",
        keyPath
      );
      const baseCRC = criteriaFieldRequestConfig;
      newCRC = StructureCriteriaHandler.rebuildCustomConfigFromModuleContext(
        this.keyStructureContext,
        baseCRC as any,
        newCRC as any
      );
    } else if (this.keyStructureContext === "structureEmbedded") {
      const { keyPath } = newCRC;
      const criteriaEmbModelRequestConfig =
        mH.getDiccActionConfigByModuleContext(
          this.keyStructureContext,
          "controller",
          undefined,
          keyPath
        );
      const baseCRC = criteriaEmbModelRequestConfig;
      newCRC = StructureCriteriaHandler.rebuildCustomConfigFromModuleContext(
        this.keyStructureContext,
        baseCRC as any,
        newCRC as any
      ) as any;
    } else if (this.keyStructureContext === "structureModel") {
      const { keyActionRequest } = newCRC as IStructureModelReadCriteria<any> &
        IStructureModelModifyCriteria<any>;
      const diccActionRequest = mH.getDiccActionConfigByModuleContext(
        this.keyStructureContext,
        "controller"
      );
      const baseCRC = diccActionRequest[
        keyActionRequest
      ] as IStructureModelReadCriteria<any> &
        IStructureModelModifyCriteria<any>;
      newCRC = StructureCriteriaHandler.rebuildCustomConfigFromModuleContext(
        this.keyStructureContext,
        baseCRC as any,
        newCRC as any
      );
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${this.keyStructureContext} is not structure context key valid`,
      });
    }
    return newCRC;
  }
  public override findGlobalActionByKeyModuleAndKeyAction<TKeyActionConfig>(
    tKeyGlobalAC: [TKeyStructureInternalACModuleContext, TKeyActionConfig]
  ): any {
    return super.findGlobalActionByKeyModuleAndKeyAction(tKeyGlobalAC as any);
  }
  public override filterGlobalActionByKeyModule(
    keysModuleContext:
      | Array<TKeyStructureInternalACModuleContext>
      | TKeyStructureInternalACModuleContext
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
            ["op", "vCond", "keyPathForCond"],
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
