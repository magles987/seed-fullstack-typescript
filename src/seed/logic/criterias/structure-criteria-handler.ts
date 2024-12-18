import { ActionModule, IBuildACOption } from "../config/module";
import { TKeyStructureContextFull } from "../config/shared-modules";
import { ELogicCodeError, LogicError } from "../errors/logic-error";
import { TKeyStructureHookModuleContext } from "../hooks/shared";
import { IDiccStructureHookActionConfigG } from "../hooks/structure-hook";
import { TKeyStructureInternalACModuleContext } from "../meta/metadata-shared";
import { Trf_StructureLogicMetadataHandler } from "../meta/structure-metadata-handler";
import { IDiccFieldMutateActionConfigG } from "../mutaters/field-mutater";
import { IDiccModelMutateActionConfigG } from "../mutaters/model-mutater";
import { TKeyStructureDeepMutateModuleContext } from "../mutaters/shared";
import { TKeyStructureProviderModuleContext } from "../providers/shared";
import { IDiccStructureProviderActionConfigG } from "../providers/structure-provider";
import { IDiccFieldValActionConfigG } from "../validators/field-validation";
import { IDiccModelValActionConfigG } from "../validators/model-validation";
import { IDiccRequestValActionConfigG } from "../validators/request-validation";
import { TKeyStructureDeepValModuleContext } from "../validators/shared";
import { CriteriaHandler } from "./_criteria-handler";
import {
  IFieldCriteria,
  ISingleCondition,
  IStructureModifyCriteria,
  IStructureReadCriteria,
  TAConds,
  TKeyStructureCriteriaModuleContext,
  TKeyStructureDeepCriteriaModuleContext,
  TStructureBaseCriteria,
  TStructureBaseCriteriaForCtrlField,
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
  TIDiccFieldMutateAC extends IDiccFieldMutateActionConfigG = IDiccFieldMutateActionConfigG,
  TIDiccModelMutateAC extends IDiccModelMutateActionConfigG = IDiccModelMutateActionConfigG,
  TIDiccFieldValAC extends IDiccFieldValActionConfigG = IDiccFieldValActionConfigG,
  TIDiccModelValAC extends IDiccModelValActionConfigG = IDiccModelValActionConfigG,
  TIDiccRequestValAC extends IDiccRequestValActionConfigG = IDiccRequestValActionConfigG,
  TIDiccStructureHookAC extends IDiccStructureHookActionConfigG = IDiccStructureHookActionConfigG,
  TIDiccStructureProviderAC extends IDiccStructureProviderActionConfigG = IDiccStructureProviderActionConfigG
> extends CriteriaHandler {
  public static override readonly getDefault = () => {
    const superDf = CriteriaHandler.getDefault();
    return {
      ...superDf,
      sort: {},
      keysPath: [],
      keyPath: "",
      keyStructureContext: "structureModel",
    } as IStructureReadCriteria<any> & IStructureModifyCriteria<any>;
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
  public set keysPath(value: string[]) {
    this._keysPath = value;
  }

  private _keyStructureContext: TKeyStructureContextFull;
  public get keyStructureContext(): TKeyStructureContextFull {
    return this._keyStructureContext;
  }
  protected set keyStructureContext(v: TKeyStructureContextFull) {
    this._keyStructureContext =
      v === "structureField" ||
      v === "structureEmbedded" ||
      v === "structureModel"
        ? v
        : this._keyStructureContext !== undefined
        ? this._keyStructureContext
        : this.getDefault().keyStructureContext;
  }
  /**
   * @param pCursor propiedades opcionales para
   * personalizar la inicializacion del cursor
   */
  constructor(
    keySrc: string,
    metadataHandler: Trf_StructureLogicMetadataHandler,
    base: TStructureBaseCriteria<
      TModel,
      TIDiccFieldMutateAC,
      TIDiccModelMutateAC,
      TIDiccFieldValAC,
      TIDiccModelValAC,
      TIDiccRequestValAC,
      TIDiccStructureHookAC,
      TIDiccStructureProviderAC
    > = { type: "read" },
    isInit = true
  ) {
    super("structure", keySrc, metadataHandler, base, false);
    if (isInit) this.initProps(base);
    this.initMergeDiccGlobalAC();
    this.initAKeysGlobalAC();
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
            TIDiccStructureProviderAC
          >["getDefault"]
        >,
        "keyLogicContext" | "keySrc" | "keysPath" | "p_Key" | "s_Key"
      >
    >
  ): void {
    super.mutateProps(base);
    return;
  }
  public override getLiteral(): IStructureReadCriteria<
    TModel,
    TIDiccModelMutateAC,
    TIDiccModelValAC,
    TIDiccRequestValAC,
    TIDiccStructureHookAC,
    TIDiccStructureProviderAC
  > &
    IStructureModifyCriteria<
      TModel,
      TIDiccModelMutateAC,
      TIDiccModelValAC,
      TIDiccRequestValAC,
      TIDiccStructureHookAC,
      TIDiccStructureProviderAC
    > {
    return super.getLiteral() as any;
  }
  protected override initMergeDiccGlobalAC(): void {
    let bf_diccGlobalAC = {};
    const keysModuleContext = this.getCONST().KEYS_GLOBAL_AC;
    const mH = this.metadataHandler;
    if (this.util.isObject(this.diccGlobalAC)) {
      const bACOption: IBuildACOption = {
        keyPath: this.keyPath,
        mergeMode: "soft",
      };
      if (this.keyStructureContext === "structureField") {
        for (const keyModuleContext of keysModuleContext) {
          if (
            keyModuleContext !== "fieldMutate" &&
            keyModuleContext !== "fieldVal"
          )
            continue;
          let actionModule =
            mH.getModuleInstanceForActionContext(keyModuleContext);
          const newDicc = this.diccGlobalAC[keyModuleContext];
          bf_diccGlobalAC[keyModuleContext] =
            actionModule.buildContainerActionsConfig(
              "toActionConfig_DiccWrapped",
              newDicc,
              bACOption
            );
        }
      } else if (this.keyStructureContext === "structureEmbedded") {
        for (const keyModuleContext of keysModuleContext) {
          if (
            keyModuleContext !== "modelMutate" &&
            keyModuleContext !== "modelVal"
          )
            continue;
          let actionModule =
            mH.getModuleInstanceForActionContext(keyModuleContext);
          const newDicc = this.diccGlobalAC[keyModuleContext];
          bf_diccGlobalAC[keyModuleContext] =
            actionModule.buildContainerActionsConfig(
              "toActionConfig_DiccWrapped",
              newDicc,
              bACOption
            );
        }
      } else if (this.keyStructureContext === "structureModel") {
        for (const keyModuleContext of keysModuleContext) {
          if (
            keyModuleContext !== "modelMutate" &&
            keyModuleContext !== "modelVal" &&
            keyModuleContext !== "requestVal" &&
            keyModuleContext !== "structureHook" &&
            keyModuleContext !== "structureProvider"
          )
            continue;
          let actionModule =
            mH.getModuleInstanceForActionContext(keyModuleContext);
          const newDicc = this.diccGlobalAC[keyModuleContext];
          bf_diccGlobalAC[keyModuleContext] =
            actionModule.buildContainerActionsConfig(
              "toActionConfig_DiccWrapped",
              newDicc,
              bACOption
            );
        }
      } else {
        throw new LogicError({
          code: ELogicCodeError.MODULE_ERROR,
          msn: `${this.keyStructureContext} is not structure context key valid`,
        });
      }
    } else {
      if (this.keyStructureContext === "structureField") {
        const diccFieldMutate = mH.getDiccActionConfigByModuleContext(
          this.keyStructureContext,
          "mutater",
          "fieldMutate",
          this.keyPath
        );
        const diccFieldVal = mH.getDiccActionConfigByModuleContext(
          this.keyStructureContext,
          "validator",
          "fieldVal",
          this.keyPath
        );
        for (const keyModuleContext of keysModuleContext) {
          if (keyModuleContext === "fieldMutate") {
            bf_diccGlobalAC[keyModuleContext] = diccFieldMutate;
          } else if (keyModuleContext === "fieldVal") {
            bf_diccGlobalAC[keyModuleContext] = diccFieldVal;
          } else {
            continue;
          }
        }
      } else if (this.keyStructureContext === "structureEmbedded") {
        const diccModelMutate = mH.getDiccActionConfigByModuleContext(
          this.keyStructureContext,
          "mutater",
          "modelMutate",
          this.keyPath
        );
        const diccModelVal = mH.getDiccActionConfigByModuleContext(
          this.keyStructureContext,
          "validator",
          "modelVal",
          this.keyPath
        );
        // const diccReqVal = mH.getDiccActionConfigByModuleContext(
        //   this.keyStructureContext,
        //   "validator",
        //   "requestVal",
        //   this.keyPath
        // );
        // const diccStructureHook = mH.getDiccActionConfigByModuleContext(
        //   this.keyStructureContext,
        //   "hook"
        // );
        // const diccStructureProvider = mH.getDiccActionConfigByModuleContext(
        //   this.keyStructureContext,
        //   "provider"
        // );
        for (const keyModuleContext of keysModuleContext) {
          if (keyModuleContext === "modelMutate") {
            bf_diccGlobalAC[keyModuleContext] = diccModelMutate;
          } else if (keyModuleContext === "modelVal") {
            bf_diccGlobalAC[keyModuleContext] = diccModelVal;
            // } else if (keyModuleContext === "requestVal") {
            //   bf_diccGlobalAC[keyModuleContext] = diccReqVal;
            // } else if (keyModuleContext === "structureHook") {
            //   bf_diccGlobalAC[keyModuleContext] = diccStructureHook;
            // } else if (keyModuleContext === "structureProvider") {
            //   bf_diccGlobalAC[keyModuleContext] = diccStructureProvider;
          } else {
            continue;
          }
        }
      } else if (this.keyStructureContext === "structureModel") {
        const diccModelMutate = mH.getDiccActionConfigByModuleContext(
          this.keyStructureContext,
          "mutater",
          "modelMutate"
        );
        const diccModelVal = mH.getDiccActionConfigByModuleContext(
          this.keyStructureContext,
          "validator",
          "modelVal"
        );
        const diccReqVal = mH.getDiccActionConfigByModuleContext(
          this.keyStructureContext,
          "validator",
          "requestVal"
        );
        const diccStructureHook = mH.getDiccActionConfigByModuleContext(
          this.keyStructureContext,
          "hook"
        );
        const diccStructureProvider = mH.getDiccActionConfigByModuleContext(
          this.keyStructureContext,
          "provider"
        );
        for (const keyModuleContext of keysModuleContext) {
          if (keyModuleContext === "modelMutate") {
            bf_diccGlobalAC[keyModuleContext] = diccModelMutate;
          } else if (keyModuleContext === "modelVal") {
            bf_diccGlobalAC[keyModuleContext] = diccModelVal;
          } else if (keyModuleContext === "requestVal") {
            bf_diccGlobalAC[keyModuleContext] = diccReqVal;
          } else if (keyModuleContext === "structureHook") {
            bf_diccGlobalAC[keyModuleContext] = diccStructureHook;
          } else if (keyModuleContext === "structureProvider") {
            bf_diccGlobalAC[keyModuleContext] = diccStructureProvider;
          } else {
            continue;
          }
        }
      } else {
        throw new LogicError({
          code: ELogicCodeError.MODULE_ERROR,
          msn: `${this.keyStructureContext} is not structure context key valid`,
        });
      }
    }
    this.diccGlobalAC = bf_diccGlobalAC;
    return;
  }
  protected override initAKeysGlobalAC(): void {
    const mH = this.metadataHandler;
    let bf_aTKeysGlobalActionConfig = [];
    if (this.keyStructureContext === "structureField") {
      bf_aTKeysGlobalActionConfig = mH.getDiccActionConfigByModuleContext(
        this.keyStructureContext,
        "controller",
        undefined,
        this.keyPath
      );
    } else if (this.keyStructureContext === "structureEmbedded") {
      const diccACtrl = mH.getDiccActionConfigByModuleContext(
        this.keyStructureContext,
        "controller",
        undefined,
        this.keyPath
      );
      bf_aTKeysGlobalActionConfig = diccACtrl[this.keyActionRequest] as Array<
        [string, string]
      >;
    } else if (this.keyStructureContext === "structureModel") {
      const diccACtrl = mH.getDiccActionConfigByModuleContext(
        this.keyStructureContext,
        "controller"
      );
      bf_aTKeysGlobalActionConfig = diccACtrl[this.keyActionRequest] as Array<
        [string, string]
      >;
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${this.keyStructureContext} is not structure context key valid`,
      });
    }
    this.aTKeysGlobalActionConfig = bf_aTKeysGlobalActionConfig;
    return;
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
  /**construye un sub manejador de criteria enfocado a un campo en base a este mismo manejador*/
  public buildSubCriteriaHandler(
    keyStructureContextExt: TKeyStructureContextFull | "structureAnonym",
    base: Partial<
      TStructureBaseCriteria<
        TModel,
        TIDiccFieldMutateAC,
        TIDiccModelMutateAC,
        TIDiccFieldValAC,
        TIDiccModelValAC,
        TIDiccRequestValAC,
        TIDiccStructureHookAC,
        TIDiccStructureProviderAC
      >
    >
  ): this {
    base = this.util.isObject(base) ? base : {};
    //se debe clonar NO instanciar porque un sub criteria
    //demás de compartir la mayoría de propiedades, el array de tupla
    //del claves identificadoras puede ser anonimo lo cual no esta en los metadatos
    let subCriteriaHandler: Trf_StructureCriteriaHandler;
    if (
      keyStructureContextExt === "structureField" ||
      keyStructureContextExt === "structureEmbedded" ||
      keyStructureContextExt === "structureModel"
    ) {
      subCriteriaHandler = new StructureCriteriaHandler(
        this.keySrc,
        this.metadataHandler,
        {
          ...(base as any),
          type: this.type,
          keySrc: this.keySrc,
          keyLogicContext: "structure",
          keyStructureContext: keyStructureContextExt,
          keyActionRequest: this.keyActionRequest,
        }
      );
      this.initMergeDiccGlobalAC();
      this.initAKeysGlobalAC();
    } else if (keyStructureContextExt === "structureAnonym") {
      subCriteriaHandler = new StructureCriteriaHandler(
        this.keySrc,
        this.metadataHandler,
        {
          ...(base as any),
          keySrc: this.keySrc,
          keyLogicContext: "structure",
          keyStructureContext: keyStructureContextExt,
          keyActionRequest: this.keyActionRequest,
        }
      );
    } else {
      if (!this.util.isArrayTuple(base.aTKeysGlobalActionConfig, 2, true)) {
        throw new LogicError({
          code: ELogicCodeError.MODULE_ERROR,
          msn: `${base.aTKeysGlobalActionConfig} is not array of key global AC tuples valid`,
        });
      }
      subCriteriaHandler.mutateProps({
        ...(base as any),
        keyStructureContext: keyStructureContextExt,
      });
    }
    return subCriteriaHandler as this;
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
}
