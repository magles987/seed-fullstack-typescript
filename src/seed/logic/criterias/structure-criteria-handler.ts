import { Module } from "../config/module";
import {
  TKeyStructureContextBasic,
  TKeyStructureContextFull,
} from "../config/shared-modules";
import { ELogicCodeError, LogicError } from "../errors/logic-error";
import { TKeyStructureHookModuleContext } from "../hooks/shared";
import { StructureLogicHook } from "../hooks/structure-hook";
import { TKeyStructureInternalACModuleContext } from "../meta/metadata-shared";
import { Trf_StructureLogicMetadataHandler } from "../meta/structure-metadata-handler";
import { FieldLogicMutater } from "../mutaters/field-mutater";
import { ModelLogicMutater } from "../mutaters/model-mutater";
import { TKeyStructureDeepMutateModuleContext } from "../mutaters/shared";
import { TKeyStructureProviderModuleContext } from "../providers/shared";
import { StructureLogicProvider } from "../providers/structure-provider";
import { FieldLogicValidation } from "../validators/field-validation";
import { ModelLogicValidation } from "../validators/model-validation";
import { RequestLogicValidation } from "../validators/request-validation";
import { TKeyStructureDeepValModuleContext } from "../validators/shared";
import { CriteriaHandler } from "./_criteria-handler";
import {
  ISingleCondition,
  IStructureFieldCriteria,
  IStructureModelModifyCriteria,
  IStructureModelReadCriteria,
  TAConds,
  TKeyStructureCriteriaModuleContext,
  TStructureModelBaseCriteria,
  TStructureModelDiccGlobalAC,
} from "./shared";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**refactorización de la clase*/
export type Trf_StructureCriteriaHandler = StructureCriteriaHandler<any>;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *selfconstructor*
 *
 */
export class StructureCriteriaHandler<
  TModel,
  TIDiccFieldMutateAC extends FieldLogicMutater["dfDiccActionConfig"] = FieldLogicMutater["dfDiccActionConfig"],
  TIDiccModelMutateAC extends ModelLogicMutater["dfDiccActionConfig"] = ModelLogicMutater["dfDiccActionConfig"],
  TIDiccFieldValAC extends FieldLogicValidation["dfDiccActionConfig"] = FieldLogicValidation["dfDiccActionConfig"],
  TIDiccModelValAC extends ModelLogicValidation["dfDiccActionConfig"] = ModelLogicValidation["dfDiccActionConfig"],
  TIDiccRequestValAC extends RequestLogicValidation["dfDiccActionConfig"] = RequestLogicValidation["dfDiccActionConfig"],
  TIDiccStructureHookAC extends StructureLogicHook["dfDiccActionConfig"] = StructureLogicHook["dfDiccActionConfig"],
  TIDiccStructureProviderAC extends StructureLogicProvider["dfDiccActionConfig"] = StructureLogicProvider["dfDiccActionConfig"],
  TKeyDiccActionRequest extends string = string
> extends CriteriaHandler<TKeyDiccActionRequest> {
  public static override readonly getDefault = () => {
    const superDf = CriteriaHandler.getDefault();
    return {
      ...superDf,
      sort: {},
      keysPath: [],
      diccGlobalAC: {
        modelMutate: {},
        modelVal: {},
        requestVal: {},
        structureHook: {},
        structureProvider: {},
      },
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
  public override get diccGlobalAC(): TStructureModelDiccGlobalAC<
    TIDiccModelMutateAC,
    TIDiccModelValAC,
    TIDiccRequestValAC,
    TIDiccStructureHookAC,
    TIDiccStructureProviderAC
  > {
    return super.diccGlobalAC;
  }
  public override set diccGlobalAC(
    v: TStructureModelDiccGlobalAC<
      TIDiccModelMutateAC,
      TIDiccModelValAC,
      TIDiccRequestValAC,
      TIDiccStructureHookAC,
      TIDiccStructureProviderAC
    >
  ) {
    super.diccGlobalAC = v;
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
    keyStructureContext: "structureModel",
    currentContextConfig: IStructureModelReadCriteria<any> &
      IStructureModelModifyCriteria<any>,
    newContextConfig: IStructureModelReadCriteria<any> &
      IStructureModelModifyCriteria<any>
  ): IStructureModelReadCriteria<any> & IStructureModelModifyCriteria<any>;
  public static rebuildCustomConfigFromModuleContext(
    keyStructureContext: TKeyStructureContextBasic,
    currentContextConfig: unknown,
    newContextConfig: unknown
  ): unknown {
    const util = Module.util;
    let rConfig: unknown;
    if (keyStructureContext === "structureField") {
      const df = StructureCriteriaHandler.getDefault();
      const dfCC = {
        keyPath: df.keyPath,
        keysPath: df.keysPath,
        aTKeysGlobalActionConfig: df.aTKeysGlobalActionConfig as any[],
        diccGlobalAC: {
          fieldMutate: {},
          fieldVal: {},
        },
      } as IStructureFieldCriteria<any>;
      const cCC = (
        util.isObject(currentContextConfig) ? currentContextConfig : dfCC
      ) as IStructureFieldCriteria<any>;
      const nCC = newContextConfig as IStructureFieldCriteria<any>;
      let rFieldConfig: IStructureFieldCriteria<any>;
      if (!util.isObject(nCC)) {
        rFieldConfig = cCC;
      } else {
        rFieldConfig = {
          ...nCC,
          aTKeysGlobalActionConfig: util.isArray(nCC.aTKeysGlobalActionConfig)
            ? nCC.aTKeysGlobalActionConfig
            : cCC.aTKeysGlobalActionConfig,
          diccGlobalAC: util.isObject(nCC.diccGlobalAC)
            ? {
                fieldMutate: util.mergeDiccActionConfig(
                  [cCC.diccGlobalAC.fieldMutate, nCC.diccGlobalAC.fieldMutate],
                  { mode: "hard" }
                ),
                fieldVal: util.mergeDiccActionConfig(
                  [nCC.diccGlobalAC.fieldVal, cCC.diccGlobalAC.fieldVal],
                  { mode: "hard" }
                ),
              }
            : cCC.diccGlobalAC,
          keyPath: util.isString(nCC.keyPath) ? nCC.keyPath : cCC.keyPath,
          keysPath: util.isArray(nCC.keysPath) ? nCC.keysPath : cCC.keysPath,
        };
      }
      rConfig = rFieldConfig;
    } else if (keyStructureContext === "structureModel") {
      const dfCC = StructureCriteriaHandler.getDefault();
      const cCC = (
        util.isObject(currentContextConfig) ? currentContextConfig : dfCC
      ) as IStructureModelReadCriteria<any> &
        IStructureModelModifyCriteria<any>;
      const nCC = newContextConfig as IStructureModelReadCriteria<any> &
        IStructureModelModifyCriteria<any>;
      let rModelConfig: IStructureModelReadCriteria<any> &
        IStructureModelModifyCriteria<any>;
      if (!util.isObject(nCC)) {
        rModelConfig = cCC;
      } else {
        rModelConfig = {
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
          diccGlobalAC: util.isObject(nCC.diccGlobalAC)
            ? {
                modelMutate: util.mergeDiccActionConfig(
                  [cCC.diccGlobalAC.modelMutate, nCC.diccGlobalAC.modelMutate],
                  { mode: "hard" }
                ),
                modelVal: util.mergeDiccActionConfig(
                  [cCC.diccGlobalAC.modelVal, nCC.diccGlobalAC.modelVal],
                  { mode: "hard" }
                ),
                requestVal: util.mergeDiccActionConfig(
                  [cCC.diccGlobalAC.requestVal, nCC.diccGlobalAC.requestVal],
                  { mode: "hard" }
                ),
                structureHook: util.mergeDiccActionConfig(
                  [
                    cCC.diccGlobalAC.structureHook,
                    nCC.diccGlobalAC.structureHook,
                  ],
                  { mode: "hard" }
                ),
                structureProvider: util.mergeDiccActionConfig(
                  [
                    cCC.diccGlobalAC.structureProvider,
                    nCC.diccGlobalAC.structureProvider,
                  ],
                  { mode: "hard" }
                ),
              }
            : cCC.diccGlobalAC,
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
      rConfig = rModelConfig;
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${keyStructureContext} is not structure context key valid`,
      });
    }
    return rConfig;
  }
  protected override mergeBaseCriteriaWithPriority(
    newCRC:
      | (IStructureModelReadCriteria<any> & IStructureModelModifyCriteria<any>)
      | IStructureFieldCriteria<any>
  ):
    | (IStructureModelReadCriteria<any> & IStructureModelModifyCriteria<any>)
    | IStructureFieldCriteria<any> {
    const mH = this.metadataHandler;
    if (this.keyStructureContext === "structureField") {
      const { keyPath } = newCRC;
      const fieldCtrlC = mH.getExtractMetadataByModuleContext(
        this.keyStructureContext,
        "controller",
        keyPath
      );
      const { criteriaRequestConfig: baseCRC } =
        fieldCtrlC.__ctrlConfig.fieldCtrl;
      newCRC = StructureCriteriaHandler.rebuildCustomConfigFromModuleContext(
        this.keyStructureContext,
        baseCRC as any,
        newCRC as any
      );
    } else if (this.keyStructureContext === "structureEmbedded") {
      const { keyPath } = newCRC;
      const {
        __mutateConfig: embMutateConfig,
        __valConfig: embValConfig,
        __hookConfig: embHookConfig,
        __providerConfig: embProviderConfig,
      } = mH.getExtractMetadataByStructureContext(
        this.keyStructureContext,
        keyPath
      );
      const baseCRC = {
        ...this.getDefault(),
        diccGlobalAC: {
          modelMutate: embMutateConfig.modelMutate.diccActionsConfig,
          modelVal: embValConfig.modelVal.diccActionsConfig,
          requestVal: embValConfig.requestVal.diccActionsConfig,
          structureHook: embHookConfig.structureHook.diccActionsConfig,
          structureProvider:
            embProviderConfig.structureProvider.diccActionsConfig,
        },
      } as IStructureModelReadCriteria<any> &
        IStructureModelModifyCriteria<any>;
      newCRC = StructureCriteriaHandler.rebuildCustomConfigFromModuleContext(
        "structureModel", //❗se debe usar model asi sea embebido❗
        baseCRC as any,
        newCRC as any
      );
    } else if (this.keyStructureContext === "structureModel") {
      const { keyActionRequest } = newCRC as IStructureModelReadCriteria<any> &
        IStructureModelModifyCriteria<any>;
      const modelCtrlC = mH.getExtractMetadataByModuleContext(
        this.keyStructureContext,
        "controller"
      );
      const { diccCriteriaRequestConfig } = modelCtrlC.__ctrlConfig.modelCtrl;
      const baseCRC = diccCriteriaRequestConfig[
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
  public override getGlobalActionByTKeyGlobalAC<TKeyActionConfig>(
    tKeyGlobalAC: Array<
      [
        (
          | TKeyStructureDeepMutateModuleContext
          | TKeyStructureDeepValModuleContext
          | TKeyStructureHookModuleContext
          | TKeyStructureProviderModuleContext
        ),
        TKeyActionConfig
      ]
    >
  ): any {
    return super.getGlobalActionByTKeyGlobalAC(tKeyGlobalAC);
  }
  public override buildATupleKeyGlobalActionConfigFromCommonKeyModule(
    keyModule:
      | TKeyStructureDeepMutateModuleContext
      | TKeyStructureDeepValModuleContext
      | TKeyStructureHookModuleContext
      | TKeyStructureProviderModuleContext,
    aTKeyAC: Array<
      | keyof TIDiccFieldMutateAC
      | keyof TIDiccModelMutateAC
      | keyof TIDiccFieldValAC
      | keyof TIDiccModelValAC
      | keyof TIDiccRequestValAC
      | keyof TIDiccStructureHookAC
      | keyof TIDiccStructureProviderAC
    >
  ): Array<
    [
      (
        | TKeyStructureDeepMutateModuleContext
        | TKeyStructureDeepValModuleContext
        | TKeyStructureHookModuleContext
        | TKeyStructureProviderModuleContext
      ),
      (
        | keyof TIDiccFieldMutateAC
        | keyof TIDiccModelMutateAC
        | keyof TIDiccFieldValAC
        | keyof TIDiccModelValAC
        | keyof TIDiccRequestValAC
        | keyof TIDiccStructureHookAC
        | keyof TIDiccStructureProviderAC
      )
    ]
  > {
    const r = super.buildATupleKeyGlobalActionConfigFromCommonKeyModule(
      keyModule,
      aTKeyAC
    );
    return r as any;
  }
  public getSubAnonymSchemaForGlobalActionConfig(
    keyModule: TKeyStructureInternalACModuleContext,
    aTupleGlobalActionConfig: Array<
      [
        (
          | keyof TIDiccFieldMutateAC
          | keyof TIDiccModelMutateAC
          | keyof TIDiccFieldValAC
          | keyof TIDiccModelValAC
          | keyof TIDiccRequestValAC
          | keyof TIDiccStructureHookAC
          | keyof TIDiccStructureProviderAC
        ),
        (
          | TIDiccFieldMutateAC
          | TIDiccModelMutateAC
          | TIDiccFieldValAC
          | TIDiccModelValAC
          | TIDiccRequestValAC
          | TIDiccStructureHookAC
          | TIDiccStructureProviderAC
        )
      ]
    >
  ) {
    let subSchema = super.getSubAnonymSchemaForGlobalActionConfig(
      keyModule,
      aTupleGlobalActionConfig
    );
    return subSchema;
  }
  public override extractDiccByKeyModuleContext(
    keysModuleContext:
      | TKeyStructureInternalACModuleContext
      | TKeyStructureInternalACModuleContext[]
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
