import { LogicMetadataHandler } from "./_metadata-handler";
import { TSchemaNotFunction } from "../util/util-interface";
import {
  TStructureFull,
  TStructureMeta,
  TStructureMetaAndMutater,
  TStructureMetaAndHook,
  TStructureMetaAndProvider,
  TStructureMetaAndValidator,
  Trf_TStructureFull,
  Trf_TStructureMeta,
  TStructureFieldFull,
  TStructureFieldMeta,
  TStructureFieldMetaAndMutater,
  TStructureFieldMetaAndValidator,
  Trf_TStructureFieldFull,
  Trf_TStructureFieldMeta,
  TStructureMetaAndCtrl,
  TKeyStructureInternalACModuleContext,
  TStructureFieldMetaAndCtrl,
} from "./metadata-shared";
import {
  IDiccStructureModuleInstanceContext,
  Trf_TStructureMetadataModuleConfigForModel,
  Trf_IStructureMetadataModuleConfig,
  IStructureMetadataContext,
} from "./shared";
import { ELogicCodeError, LogicError } from "../errors/logic-error";
import {
  TKeyHandlerModule,
  TKeyModuleWithReport,
  TKeyStructureContextFull,
} from "../config/shared-modules";
import { TKeyStructureMetadataModuleContext } from "./shared";
import {
  TKeyStructureDeepValModuleContext,
  Trf_TFieldConfigForVal,
  Trf_TModelConfigForVal,
} from "../validators/shared";
import {
  TKeyStructureDeepMutateModuleContext,
  Trf_TFieldConfigForMutate,
  Trf_TModelConfigForMutate,
} from "../mutaters/shared";
import { Trf_TStructureConfigForHook } from "../hooks/shared";
import { FieldLogicMutater } from "../mutaters/field-mutater";
import { ModelLogicMutater } from "../mutaters/model-mutater";
import { FieldLogicValidation } from "../validators/field-validation";
import { ModelLogicValidation } from "../validators/model-validation";
import { RequestLogicValidation } from "../validators/request-validation";
import { StructureLogicHook } from "../hooks/structure-hook";
import { StructureLogicProvider } from "../providers/structure-provider";
import { Trf_TModelConfigForProvider } from "../providers/shared";
import {
  TFieldConfigForCtrl,
  TModelConfigForCtrl,
  Trf_TFieldConfigForCtrl,
  Trf_TModelConfigForCtrl,
} from "../controllers/shared";
import { ActionModule, Module } from "../config/module";
import { StructureLogicController } from "../controllers/_structure-ctrl";
import { Driver } from "../providers/_drivers/_driver";
import { IStructureBuilderBaseMetadata } from "./builder-shared";
import { StructureCriteriaHandler } from "../criterias/structure-criteria-handler";
import {
  IStructureFieldCriteria,
  TStructureModelBaseReadCriteria,
  TStructureModelBaseModifyCriteria,
  TStructureFieldBaseCriteria,
} from "../criterias/shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**tipado especial que elimina las propiedades
 * del modelo de metadatos que no hagan parte
 * del modelo en general (normalmeten son las
 * propiedades con prefijo `"__"` y que hacen
 * parte de las configuraciones comunes)
 */
export type TModelMetaOnlyField<TIModelMeta> = Omit<
  TIModelMeta,
  | TSchemaNotFunction<TIModelMeta>
  | keyof Trf_TStructureMetadataModuleConfigForModel
>;
/**tipado de los nombres (keys) del modelo a partir de los metadatos*/
export type TKeyFromModelMetaOnlyField<TIModelMeta> =
  keyof TModelMetaOnlyField<TIModelMeta>;
/**tipado refactorizado del manejador */
export type Trf_StructureLogicMetadataHandler = StructureLogicMetadataHandler<
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any
>;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**
 * Manejador de metadatos
 *
 */
export class StructureLogicMetadataHandler<
  TModel,
  TFieldMutateInstance extends FieldLogicMutater = FieldLogicMutater,
  TModelMutateInstance extends ModelLogicMutater = ModelLogicMutater,
  TFieldValInstance extends FieldLogicValidation = FieldLogicValidation,
  TModelValInstance extends ModelLogicValidation = ModelLogicValidation,
  TRequestValInstance extends RequestLogicValidation = RequestLogicValidation,
  TStructureHookInstance extends StructureLogicHook = StructureLogicHook,
  TStructureProviderInstance extends StructureLogicProvider = StructureLogicProvider,
  TKeyDiccActionRequest extends string = string
> extends LogicMetadataHandler {
  /** configuración de valores predefinidos para el modulo*/
  public static override readonly getDefault = () => {
    const superDf = LogicMetadataHandler.getDefault();
    return {
      ...superDf,
      handlerConfig: {
        ...superDf.handlerConfig,
        fieldMeta: {
          __keyPath: undefined,
          __structureType: "structureField",
          __fieldType: "string",
          __isArray: false,
          __isVirtual: false,
          __dfData: undefined, //❗ OBLIGATORIO en la definición de cada metadato
          __keysProp: [],
          __emb: <any>{},
          __mutateConfig: {
            fieldMutate: {
              diccActionsConfig: FieldLogicMutater.getDefault()
                .dfDiccActionConfig as any,
            },
          },
          __valConfig: {
            fieldVal: {
              diccActionsConfig: FieldLogicValidation.getDefault()
                .dfDiccActionConfig as any,
            },
          },
          __ctrlConfig: {
            fieldCtrl: {},
          },
        },
        modelMeta: {
          __keyPath: undefined,
          __structureType: "structureModel",
          __keyInstance: undefined,
          __dfData: undefined, //❗ OBLIGATORIO en la definicion de cada metadato
          __S_Key: undefined,
          __P_Key: undefined,
          __keysProp: [],
          __mutateConfig: {
            modelMutate: {
              diccActionsConfig: ModelLogicMutater.getDefault()
                .dfDiccActionConfig as any,
            },
          },
          __valConfig: {
            modelVal: {
              diccActionsConfig: ModelLogicValidation.getDefault()
                .dfDiccActionConfig as any,
            },
            requestVal: {
              diccActionsConfig: RequestLogicValidation.getDefault()
                .dfDiccActionConfig as any,
            },
          },
          __hookConfig: {
            structureHook: {
              diccActionsConfig: StructureLogicHook.getDefault()
                .dfDiccActionConfig as any,
            },
          },
          __providerConfig: {
            structureProvider: {
              diccActionsConfig: StructureLogicProvider.getDefault()
                .dfDiccActionConfig as any,
            },
          },
          __ctrlConfig: {
            modelCtrl: {
              //diccionario no profundizable sin saber las propiedades
              diccCriteriaRequestConfig: {},
            },
          },
        },
      } as IStructureMetadataContext<
        Trf_TStructureFieldFull,
        Trf_TStructureFull
      >,
      diccModuleInstanceContext: {
        fieldMutate: new FieldLogicMutater(),
        modelMutate: new ModelLogicMutater(),
        fieldVal: new FieldLogicValidation(),
        modelVal: new ModelLogicValidation(),
        requestVal: new RequestLogicValidation("structure"),
        structureHook: new StructureLogicHook(),
        structureProvider: new StructureLogicProvider(),
        driversList: [...superDf.driverList],
      } as IDiccStructureModuleInstanceContext,
    };
  };
  protected override get metadata(): TStructureFull<
    TModel,
    TFieldMutateInstance,
    TModelMutateInstance,
    TFieldValInstance,
    TModelValInstance,
    TRequestValInstance,
    TStructureHookInstance,
    TStructureProviderInstance,
    TKeyDiccActionRequest
  > {
    return super.metadata as any;
  }
  protected override set metadata(v: Trf_TStructureFull) {
    super.metadata = v;
  }
  /**la keypath inicial (correspondiente a este modelo)*/
  public get keyModelPath(): string {
    return this.metadata.__keyPath;
  }
  public override get diccModuleInstanceContext(): IDiccStructureModuleInstanceContext<
    TFieldMutateInstance,
    TModelMutateInstance,
    TFieldValInstance,
    TModelValInstance,
    TRequestValInstance,
    TStructureHookInstance,
    TStructureProviderInstance
  > {
    return super.diccModuleInstanceContext as any;
  }
  protected override set diccModuleInstanceContext(
    dicc: IDiccStructureModuleInstanceContext
  ) {
    super.diccModuleInstanceContext = dicc;
  }
  /**... */
  private _aKeysPath: string[];
  /**array con todos los posibles keyPath del metadato */
  public get aKeysPath(): string[] {
    return [...this._aKeysPath]; //clonacion sencilla
  }
  /**
   * @param keySrc clave identificadora del recurso,
   * @param baseConfigMeta esquema base para construir los metadatos
   * @param diccModuleContextInstance (opcional) diccionario de instancias de modulos
   */
  constructor(
    baseConfigMeta: IStructureBuilderBaseMetadata<
      TModel,
      TFieldMutateInstance,
      TModelMutateInstance,
      TFieldValInstance,
      TModelValInstance,
      TRequestValInstance,
      TStructureHookInstance,
      TStructureProviderInstance
    >
  ) {
    super("structure", baseConfigMeta);
    const { customBase, customDiccModuleInstance } = baseConfigMeta;
    this.diccModuleInstanceContext = this.buildDiccModuleContextInstance(
      customDiccModuleInstance as any
    );
    this.metadata = this.buildMetadata(customBase as any, undefined);
  }
  protected override getDefault() {
    return StructureLogicMetadataHandler.getDefault();
  }
  protected override buildDiccModuleContextInstance(
    diccMIContext: IDiccStructureModuleInstanceContext
  ): IDiccStructureModuleInstanceContext {
    let rDiccMIContext = {} as IDiccStructureModuleInstanceContext;
    const diccDf = this.getDefault().diccModuleInstanceContext;
    if (!this.util.isObject(diccMIContext)) {
      rDiccMIContext = diccDf;
    } else {
      rDiccMIContext = {
        fieldMutate: this.util.isInstance(diccMIContext.fieldMutate)
          ? diccMIContext.fieldMutate
          : diccDf.fieldMutate,
        modelMutate: this.util.isInstance(diccMIContext.modelMutate)
          ? diccMIContext.modelMutate
          : diccDf.modelMutate,
        fieldVal: this.util.isInstance(diccMIContext.fieldVal)
          ? diccMIContext.fieldVal
          : diccDf.fieldVal,
        modelVal: this.util.isInstance(diccMIContext.modelVal)
          ? diccMIContext.modelVal
          : diccDf.modelVal,
        requestVal: this.util.isInstance(diccMIContext.requestVal)
          ? diccMIContext.requestVal
          : diccDf.requestVal,
        structureHook: this.util.isInstance(diccMIContext.structureHook)
          ? diccMIContext.structureHook
          : diccDf.structureHook,
        structureProvider: this.util.isInstance(diccMIContext.structureProvider)
          ? diccMIContext.structureProvider
          : diccDf.structureProvider,
        driversList: this.mergeDriversList([
          diccMIContext.driversList,
          diccDf.driversList,
        ]) as IStructureBuilderBaseMetadata<any>["customDiccModuleInstance"]["driversList"],
      };
    }
    //inyectar Instancia de metadatos:
    rDiccMIContext.fieldMutate.metadataHandler = this;
    rDiccMIContext.modelMutate.metadataHandler = this;
    rDiccMIContext.fieldVal.metadataHandler = this;
    rDiccMIContext.modelVal.metadataHandler = this;
    rDiccMIContext.requestVal.metadataHandler = this;
    rDiccMIContext.structureHook.metadataHandler = this;
    rDiccMIContext.structureProvider.metadataHandler = this;
    return rDiccMIContext;
  }
  public override buildMetadata(
    newMetadata: Partial<Trf_TStructureFull>,
    currentMetadata?: Trf_TStructureFull
  ): Trf_TStructureFull {
    let metadata = this.buildStructureMetadata(
      "structureModel",
      newMetadata as any,
      currentMetadata as any
    ) as any as Trf_TStructureFull;
    this._aKeysPath = this.buildStructureAKeysPath(metadata as any);
    return metadata;
  }
  /**verifica la estructura de configuracion
   * (metadatos) de un campo del modelo
   * ____
   * @param structureContext contexto de la
   * estructura a verificar
   * @param structureConfig estructura de
   * configuracion a verificar.
   * @param currentStructureConfig estructura
   * actual para fusionar en caso que la
   * estructura a verificar no este completa.
   * @param progressiveKeyPath path de ruta
   * embebida en caso que dicha la estructura
   * de configuracion de campo corresponda a
   * un embebido.
   * ____
   * @returns la estructura ya verificada y actualizada.
   */
  private buildStructureMetadata(
    keyStructureContext: "structureField",
    structureConfig: Trf_TStructureFieldMeta,
    currentStructureConfig: Trf_TStructureFieldMeta,
    progressiveKeyPath: string
  ): Trf_TStructureFieldMeta;
  /**verifica la estructura de configuracion
   * (metadatos) de un modelo embebido
   * ____
   * @param keyStructureContext contexto de la
   * estructura a verificar.
   * @param structureConfig estructura de
   * configuracion a verificar.
   * @param currentStructureConfig estructura
   * actual para fusionar en caso que la
   * estructura a verificar no este completa.
   * @param progressiveKeyPath path de ruta
   * embebida
   * ____
   * @returns la estructura ya verificada y actualizada
   */
  private buildStructureMetadata(
    keyStructureContext: "structureEmbedded",
    structureConfig: Trf_TStructureMeta,
    currentStructureConfig: Trf_TStructureMeta,
    progressiveKeyPath: string
  ): Trf_TStructureMeta;
  /**verifica la estructura de configuracion
   * (metadatos) de un modelo
   * ____
   * @param keyStructureContext contexto de la
   * estructura a verificar.
   * @param structureConfig estructura de
   * configuracion a verificar.
   * @param currentStructureConfig estructura
   * actual para fusionar en caso que la
   * estructura a verificar no este completa.
   * ____
   * @returns la estructura ya verificada y actualizada.
   */
  private buildStructureMetadata(
    keyStructureContext: "structureModel",
    structureConfig: Trf_TStructureMeta,
    currentStructureConfig: Trf_TStructureMeta
  ): Trf_TStructureMeta;
  private buildStructureMetadata(
    keyStructureContext: TKeyStructureContextFull,
    newMetadata: Trf_TStructureMeta | Trf_TStructureFieldMeta,
    currentMetadata: Trf_TStructureMeta | Trf_TStructureFieldMeta,
    progressiveKeyPath?: string
  ): Trf_TStructureMeta | Trf_TStructureFieldMeta {
    const dfHC = this.getDefault().handlerConfig;
    const sp = this.util.charSeparatorLogicPath;
    if (keyStructureContext === "structureField") {
      const nFM = newMetadata as Trf_TStructureFieldMeta;
      const cFM = (
        this.util.isObject(currentMetadata) ? currentMetadata : dfHC.fieldMeta
      ) as Trf_TStructureFieldMeta;
      newMetadata = this.buildMetadataHandlerConfig(
        "fieldMeta",
        nFM,
        cFM,
        progressiveKeyPath
      ) as Trf_TStructureFieldMeta;
      if (!this.util.isObject(nFM.__emb)) {
        newMetadata.__emb = dfHC.fieldMeta.__emb as any;
      } else {
        const cE = nFM.__emb;
        const cEC = cFM.__emb;
        //actualizar el path progresivo de acuerdo a la ultima verificacion
        progressiveKeyPath = newMetadata.__keyPath;
        newMetadata.__emb = this.buildStructureMetadata(
          "structureEmbedded",
          cE,
          cEC,
          progressiveKeyPath
        );
      }
      //adaptación de criterios con prioridad
      newMetadata = this.buildMetadataForCriteriaPriority(
        "fieldMeta",
        newMetadata as any
      ) as any;
    } else if (
      keyStructureContext === "structureEmbedded" ||
      keyStructureContext === "structureModel"
    ) {
      const nM = newMetadata as Trf_TStructureMeta;
      const cM = (
        this.util.isObject(currentMetadata) ? currentMetadata : dfHC.modelMeta
      ) as Trf_TStructureMeta;
      newMetadata = this.buildMetadataHandlerConfig(
        "modelMeta",
        nM,
        cM,
        progressiveKeyPath
      ) as Trf_TStructureMeta;
      //actualizar el path progresivo de acuerdo a la ultima verificacion
      progressiveKeyPath = newMetadata.__keyPath;
      for (const keyLogicField of newMetadata.__keysProp) {
        const f_nM = nM[keyLogicField];
        const f_cM = cM[keyLogicField];
        newMetadata[keyLogicField] = this.buildStructureMetadata(
          "structureField",
          f_nM,
          f_cM,
          this.util.buildPath([progressiveKeyPath, keyLogicField as string])
        );
      }
      //adaptación de criterios con prioridad
      newMetadata = this.buildMetadataForCriteriaPriority(
        "modelMeta",
        newMetadata as any
      ) as any;
    } else {
      throw new LogicError({
        code: ELogicCodeError.NOT_VALID,
        msn: `context structure = ${keyStructureContext} does not valid`,
      });
    }
    return newMetadata;
  }
  /**... */
  private buildMetadataHandlerConfig(
    keyModuleContext: "fieldMeta",
    metadataHC: Trf_TStructureFieldMeta,
    currentMetadataHC: Trf_TStructureFieldMeta,
    progressiveKeyPath: string //permitirá extraer el keyField
  ): Trf_TStructureFieldMeta;
  private buildMetadataHandlerConfig(
    keyModuleContext: "modelMeta",
    metadataHC: Trf_TStructureMeta,
    currentMetadataHC: Trf_TStructureMeta,
    progressiveKeyPath?: string //si se recibe indica que es un embebido
  ): Trf_TStructureMeta;
  private buildMetadataHandlerConfig(
    keyModuleContext: TKeyStructureMetadataModuleContext,
    metadataHC: unknown,
    currentMetadataHC: unknown,
    progressiveKeyPath?: string
  ): unknown {
    const sp = this.util.charSeparatorLogicPath;
    const dfHC = StructureLogicMetadataHandler.getDefault().handlerConfig;
    if (keyModuleContext === "fieldMeta") {
      const mHC = metadataHC as Trf_TStructureFieldFull;
      const cMHC = (
        this.util.isObject(currentMetadataHC)
          ? currentMetadataHC
          : dfHC.fieldMeta
      ) as Trf_TStructureFieldFull;
      if (!this.util.isObject(mHC)) {
        metadataHC = cMHC; //❕no deberia nunca entrar aqui❕
      } else {
        const currentDfData = this.buildDfData(
          keyModuleContext,
          mHC.__dfData,
          cMHC.__dfData
        );
        //construir configuracion general
        metadataHC = {
          ...mHC, // garantiza otras propiedades adiccionales
          __keyPath: progressiveKeyPath,
          __keysProp: this.util.isLiteralObject(currentDfData)
            ? Object.keys(currentDfData)
            : cMHC.__keysProp,
          __structureType: "structureField",
          __fieldType: this.util.isString(mHC.__fieldType)
            ? mHC.__fieldType
            : cMHC.__fieldType,
          __isArray: this.util.isNotUndefinedAndNotNull(mHC.__isArray)
            ? mHC.__isArray
            : cMHC.__isArray,
          __isVirtual: this.util.isNotUndefinedAndNotNull(mHC.__isVirtual)
            ? mHC.__isVirtual
            : cMHC.__isVirtual,
          __dfData: currentDfData,
          __mutateConfig: this.buildMetadataForMutateModule(
            "fieldMeta",
            mHC.__mutateConfig,
            cMHC.__mutateConfig
          ),
          __valConfig: this.buildMetadataForValModule(
            "fieldMeta",
            mHC.__valConfig,
            cMHC.__valConfig
          ),
          __ctrlConfig: this.buildMetadataForCtrlModule(
            "fieldMeta",
            mHC.__ctrlConfig,
            cMHC.__ctrlConfig
          ),
        } as Trf_TStructureFieldFull;
      }
    } else if (keyModuleContext === "modelMeta") {
      const mHC = metadataHC as Trf_TStructureFull;
      const cMHC = (
        this.util.isObject(currentMetadataHC)
          ? currentMetadataHC
          : dfHC.modelMeta
      ) as Trf_TStructureFull;
      if (!this.util.isObject(mHC)) {
        metadataHC = cMHC; //❕no deberia nunca entrar aqui❕
      } else {
        let keyLogic: string;
        let structureType: Extract<
          TKeyStructureContextFull,
          "structureEmbedded" | "structureModel"
        >;
        //verificar la instancia predefinida
        const currentDfData = this.buildDfData(
          keyModuleContext,
          mHC.__dfData,
          cMHC.__dfData
        );
        //verificar keyLogic y el tipo de estructura de los metadatos
        if (!this.util.isString(progressiveKeyPath)) {
          if (this.util.isInstance(currentDfData)) {
            keyLogic = this.util.getClassName(currentDfData);
          } else {
            keyLogic = this.keySrc;
          }
          progressiveKeyPath = keyLogic;
          structureType = "structureModel";
        } else {
          keyLogic = progressiveKeyPath.split(sp).slice(-1)[0];
          structureType = "structureEmbedded";
        }
        //construir configuracion general
        metadataHC = {
          ...mHC, // garantiza otras propiedades adicionales
          __keyPath: progressiveKeyPath,
          __structureType: structureType,
          __dfData: currentDfData,
          __keyInstance: keyLogic,
          __keysProp: Object.keys(currentDfData), //❕⚠Tambien obtiene las propiedades tipo Funcion si la instancia las llega a tener❕
          __P_Key: this.util.isString(mHC.__P_Key) ? mHC.__P_Key : keyLogic, //⚠Se usa la misma key en caso no tener personalizacion
          __S_Key: this.util.isString(mHC.__S_Key) ? mHC.__S_Key : keyLogic, //⚠Se usa la misma key en caso no tener personalizacion
          __mutateConfig: this.buildMetadataForMutateModule(
            "modelMeta",
            mHC.__mutateConfig,
            cMHC.__mutateConfig
          ),
          __valConfig: this.buildMetadataForValModule(
            "modelMeta",
            mHC.__valConfig,
            cMHC.__valConfig
          ),
          __hookConfig: this.buildMetadataForHookModule(
            "modelMeta",
            mHC.__hookConfig,
            cMHC.__hookConfig
          ),
          __providerConfig: this.buildMetadataForProviderModule(
            "modelMeta",
            mHC.__providerConfig,
            cMHC.__providerConfig
          ),
          __ctrlConfig: this.buildMetadataForCtrlModule(
            "modelMeta",
            mHC.__ctrlConfig,
            cMHC.__ctrlConfig
          ),
        } as Trf_TStructureFull;
      }
    } else {
      throw new LogicError({
        code: ELogicCodeError.NOT_VALID,
        msn: `${keyModuleContext} does not context handler valid`,
      });
    }
    return metadataHC;
  }
  /**construye un dato predefinido para
   * los metadatos segun el contexto*/
  private buildDfData(
    keyModuleContext: TKeyStructureMetadataModuleContext,
    newDfData: any,
    currentDfData: any
  ): any {
    let dfData;
    if (keyModuleContext === "fieldMeta") {
      dfData =
        newDfData !== undefined
          ? newDfData
          : currentDfData !== undefined
          ? currentDfData
          : undefined;
      //❓❓Que hacer si el valor predefinido si es undefined❓❓
      // if (dfValue === undefined) {
      //   throw new LogicError({
      //     code: ELogicCodeError.MODULE_ERROR,
      //     msn: `${currentBuildDfValue} is not builder function of value valid `,
      //   });
      // }
    } else if (keyModuleContext === "modelMeta") {
      dfData = this.util.isObject(newDfData)
        ? newDfData
        : this.util.isObject(currentDfData)
        ? currentDfData
        : undefined;
      if (dfData === undefined) {
        throw new LogicError({
          code: ELogicCodeError.MODULE_ERROR,
          msn: `${dfData} is not builder function of instance valid `,
        });
      }
    } else {
      throw new LogicError({
        code: ELogicCodeError.NOT_VALID,
        msn: `${keyModuleContext} does not context handler valid`,
      });
    }
    return dfData;
  }
  /**... */
  private buildMetadataForMutateModule(
    keyModuleContext: "fieldMeta",
    metadataMutateC: Trf_TFieldConfigForMutate,
    currentMetadataMutateC: Trf_TFieldConfigForMutate
  ): Trf_TFieldConfigForMutate;
  private buildMetadataForMutateModule(
    keyModuleContext: "modelMeta",
    metadataMutateC: Trf_TModelConfigForMutate,
    currentMetadataMutateC: Trf_TModelConfigForMutate
  ): Trf_TModelConfigForMutate;
  private buildMetadataForMutateModule(
    keyModuleContext: TKeyStructureMetadataModuleContext,
    metadataMutateC: unknown,
    currentMetadataMutateC: unknown
  ): unknown {
    const df = this.getDefault().handlerConfig;
    const {
      fieldMutate: fieldMutateInstance,
      modelMutate: modelMutateInstance,
    } = this.diccModuleInstanceContext;
    let rMetadataMutateC: unknown = {}; //de diferentes contextos
    if (keyModuleContext === "fieldMeta") {
      //😉 trampa `rebuildCustomConfigFromModuleContext`
      //es protected pero se llama asi para saltarse la proteccion
      let reBuildFieldFn =
        fieldMutateInstance["rebuildCustomConfigFromModuleContext"];
      reBuildFieldFn = reBuildFieldFn.bind(fieldMutateInstance);
      const dfMC = df.fieldMeta.__mutateConfig;
      const mMC = metadataMutateC as Trf_TFieldConfigForMutate;
      const cMMC = (
        this.util.isObject(currentMetadataMutateC)
          ? {
              ...(currentMetadataMutateC as Trf_TFieldConfigForMutate),
              fieldMutate: reBuildFieldFn(
                dfMC.fieldMutate,
                (currentMetadataMutateC as Trf_TFieldConfigForMutate)
                  .fieldMutate,
                "hard"
              ),
            }
          : {
              ...dfMC,
            }
      ) as Trf_TFieldConfigForMutate;
      let rFieldConfig = {} as Trf_TFieldConfigForMutate;
      if (!this.util.isObject(mMC)) {
        rFieldConfig = {
          ...cMMC,
          fieldMutate: reBuildFieldFn(cMMC.fieldMutate, undefined, "hard"),
        };
      } else {
        rFieldConfig = {
          ...mMC,
          fieldMutate: reBuildFieldFn(
            cMMC.fieldMutate,
            mMC.fieldMutate,
            this.util.isObject(currentMetadataMutateC) ? "soft" : "hard"
          ),
        };
      }
      rMetadataMutateC = rFieldConfig;
    } else if (keyModuleContext === "modelMeta") {
      //😉 trampa `rebuildCustomConfigFromModuleContext`
      //es protected pero se llama asi para saltarse la proteccion
      let reBuildModelFn =
        modelMutateInstance["rebuildCustomConfigFromModuleContext"];
      reBuildModelFn = reBuildModelFn.bind(modelMutateInstance);
      const dfMC = df.modelMeta.__mutateConfig;
      const mMC = metadataMutateC as Trf_TModelConfigForMutate;
      const cMMC = (
        this.util.isObject(currentMetadataMutateC)
          ? {
              ...(currentMetadataMutateC as Trf_TModelConfigForMutate),
              modelMutate: reBuildModelFn(
                dfMC.modelMutate,
                (currentMetadataMutateC as Trf_TModelConfigForMutate)
                  .modelMutate,
                "hard"
              ),
            }
          : {
              ...dfMC,
            }
      ) as Trf_TModelConfigForMutate;
      let rModelConfig = {} as Trf_TModelConfigForMutate;
      if (!this.util.isObject(mMC)) {
        rModelConfig = {
          ...cMMC,
          modelMutate: reBuildModelFn(cMMC.modelMutate, undefined, "hard"),
        };
      } else {
        rModelConfig = {
          ...mMC,
          modelMutate: reBuildModelFn(
            cMMC.modelMutate,
            mMC.modelMutate,
            this.util.isObject(currentMetadataMutateC) ? "soft" : "hard"
          ),
        };
      }
      rMetadataMutateC = rModelConfig;
    } else {
      throw new LogicError({
        code: ELogicCodeError.NOT_VALID,
        msn: `context handler = ${keyModuleContext} does not valid`,
      });
    }
    return rMetadataMutateC;
  }
  /**... */
  private buildMetadataForValModule(
    keyModuleContext: "fieldMeta",
    metadataValC: Trf_TFieldConfigForVal,
    currentMetadataValC: Trf_TFieldConfigForVal
  ): Trf_TFieldConfigForVal;
  private buildMetadataForValModule(
    keyModuleContext: "modelMeta",
    metadataValC: Trf_TModelConfigForVal,
    currentMetadataValC: Trf_TModelConfigForVal
  ): Trf_TModelConfigForVal;
  private buildMetadataForValModule(
    keyModuleContext: TKeyStructureMetadataModuleContext,
    metadataValC: unknown,
    currentMetadataValC: unknown
  ): unknown {
    const df = this.getDefault().handlerConfig;
    const {
      fieldVal: fieldValInstance,
      modelVal: modelValInstance,
      requestVal: requestValInstance,
    } = this.diccModuleInstanceContext;
    let rMetadataValC: unknown = {}; //de diferentes contextos
    if (keyModuleContext === "fieldMeta") {
      //😉 trampa `rebuildCustomConfigFromModuleContext`
      //es protected pero se llama asi para saltarse la proteccion
      let reBuildFieldFn =
        fieldValInstance["rebuildCustomConfigFromModuleContext"];
      reBuildFieldFn = reBuildFieldFn.bind(fieldValInstance);
      const dfVC = df.fieldMeta.__valConfig;
      const mVC = metadataValC as Trf_TFieldConfigForVal;
      const cMVC = (
        this.util.isObject(currentMetadataValC)
          ? {
              ...(currentMetadataValC as Trf_TFieldConfigForVal),
              fieldVal: reBuildFieldFn(
                dfVC.fieldVal,
                (currentMetadataValC as Trf_TFieldConfigForVal).fieldVal,
                "hard"
              ),
            }
          : {
              ...dfVC,
            }
      ) as Trf_TFieldConfigForVal;
      let rFieldConfig = {} as Trf_TFieldConfigForVal;
      if (!this.util.isObject(mVC)) {
        rFieldConfig = {
          ...cMVC,
          fieldVal: reBuildFieldFn(cMVC.fieldVal, undefined, "hard"),
        };
      } else {
        rFieldConfig = {
          ...mVC,
          fieldVal: reBuildFieldFn(
            cMVC.fieldVal,
            mVC.fieldVal,
            this.util.isObject(currentMetadataValC) ? "soft" : "hard"
          ),
        };
      }
      rMetadataValC = rFieldConfig;
    } else if (keyModuleContext === "modelMeta") {
      //😉 trampa `rebuildCustomConfigFromModuleContext`
      //es protected pero se llama asi para saltarse la protección
      let reBuildModelFn =
        modelValInstance["rebuildCustomConfigFromModuleContext"];
      reBuildModelFn = reBuildModelFn.bind(modelValInstance);
      let reBuildRequestFn =
        requestValInstance["rebuildCustomConfigFromModuleContext"];
      reBuildRequestFn = reBuildRequestFn.bind(requestValInstance);
      const dfVC = df.modelMeta.__valConfig;
      const mVC = metadataValC as Trf_TModelConfigForVal;
      const cMVC = (
        this.util.isObject(currentMetadataValC)
          ? {
              ...(currentMetadataValC as Trf_TModelConfigForVal),
              modelVal: reBuildModelFn(
                dfVC.modelVal,
                (currentMetadataValC as Trf_TModelConfigForVal).modelVal,
                "hard"
              ),
              requestVal: reBuildRequestFn(
                dfVC.requestVal,
                (currentMetadataValC as Trf_TModelConfigForVal).requestVal,
                "hard"
              ),
            }
          : {
              ...dfVC,
            }
      ) as Trf_TModelConfigForVal;
      let rModelConfig = {} as Trf_TModelConfigForVal;
      if (!this.util.isObject(mVC)) {
        rModelConfig = {
          ...cMVC,
          modelVal: reBuildModelFn(cMVC.modelVal, undefined, "hard"),
          requestVal: reBuildRequestFn(cMVC.requestVal, undefined, "hard"),
        };
      } else {
        rModelConfig = {
          ...mVC,
          modelVal: reBuildModelFn(
            cMVC.modelVal,
            mVC.modelVal,
            this.util.isObject(currentMetadataValC) ? "soft" : "hard"
          ),
          requestVal: reBuildRequestFn(
            cMVC.requestVal,
            mVC.requestVal,
            this.util.isObject(currentMetadataValC) ? "soft" : "hard"
          ),
        };
      }
      rMetadataValC = rModelConfig;
    } else {
      throw new LogicError({
        code: ELogicCodeError.NOT_VALID,
        msn: `context handler = ${keyModuleContext} does not valid`,
      });
    }
    return rMetadataValC;
  }
  /**... */
  // private buildMetadataForHookModule(
  //   handlerContext: "fieldMeta",
  //   config: Trf_TFieldConfigForHook,
  //   currentConfig: Trf_TFieldConfigForHook
  // ): Trf_TFieldConfigForHook;
  private buildMetadataForHookModule(
    keyModuleContext: "modelMeta",
    config: Trf_TStructureConfigForHook,
    currentConfig: Trf_TStructureConfigForHook
  ): Trf_TStructureConfigForHook;
  private buildMetadataForHookModule(
    keyModuleContext: Extract<TKeyStructureMetadataModuleContext, "modelMeta">,
    metadataHookC: unknown,
    currentMetadataHookC: unknown
  ): unknown {
    const df = this.getDefault().handlerConfig;
    const { structureHook: structureHookInstance } =
      this.diccModuleInstanceContext;
    //😉 trampa `rebuildCustomConfigFromModuleContext`
    //es protected pero se llama asi para saltarse la proteccion
    let reBuildStructureFn =
      structureHookInstance["rebuildCustomConfigFromModuleContext"];
    reBuildStructureFn = reBuildStructureFn.bind(structureHookInstance);
    let rMetadataHookC: unknown = {};
    if (keyModuleContext === "modelMeta") {
      const dfHC = df.modelMeta.__hookConfig;
      const mHC = metadataHookC as Trf_TStructureConfigForHook;
      const cMHC = (
        this.util.isObject(currentMetadataHookC)
          ? {
              ...(currentMetadataHookC as Trf_TStructureConfigForHook),
              structureHook: reBuildStructureFn(
                dfHC.structureHook as any,
                (currentMetadataHookC as Trf_TStructureConfigForHook)
                  .structureHook,
                "hard"
              ),
            }
          : {
              ...dfHC,
            }
      ) as Trf_TStructureConfigForHook;
      let rModelConfig = {} as Trf_TStructureConfigForHook;
      if (!this.util.isObject(mHC)) {
        rModelConfig = {
          ...cMHC,
          structureHook: reBuildStructureFn(
            cMHC.structureHook,
            undefined,
            "hard"
          ),
        };
      } else {
        rModelConfig = {
          ...mHC,
          structureHook: reBuildStructureFn(
            cMHC.structureHook,
            mHC.structureHook,
            this.util.isObject(currentMetadataHookC) ? "soft" : "hard"
          ),
        } as Trf_TStructureConfigForHook;
      }
      rMetadataHookC = rModelConfig;
    } else {
      throw new LogicError({
        code: ELogicCodeError.NOT_VALID,
        msn: `context handler = ${keyModuleContext} does not valid`,
      });
    }
    return rMetadataHookC;
  }
  /**... */
  // private buildMetadataForProviderModule(
  //   handlerContext: "fieldMeta",
  //   config: Trf_TFieldConfigForHook,
  //   currentConfig: Trf_TFieldConfigForHook
  // ): Trf_TFieldConfigForHook;
  private buildMetadataForProviderModule(
    handlerContext: "modelMeta",
    config: Trf_TModelConfigForProvider,
    currentConfig: Trf_TModelConfigForProvider
  ): Trf_TModelConfigForProvider;
  private buildMetadataForProviderModule(
    keyModuleContext: Extract<TKeyStructureMetadataModuleContext, "modelMeta">,
    metadataProviderC: unknown,
    currentMetadataProviderC: unknown
  ): unknown {
    const df = this.getDefault().handlerConfig;
    const { structureProvider: structureProviderInstance } =
      this.diccModuleInstanceContext;
    let rMetadataProviderC: unknown = {};
    if (keyModuleContext === "modelMeta") {
      //😉 trampa `rebuildCustomConfigFromModuleContext`
      //es protected pero se llama asi para saltarse la protección
      let reBuildStructureFn =
        structureProviderInstance["rebuildCustomConfigFromModuleContext"];
      reBuildStructureFn = reBuildStructureFn.bind(structureProviderInstance);
      const dfPC = df.modelMeta.__providerConfig;
      const mPC = metadataProviderC as Trf_TModelConfigForProvider;
      const cMPC = (
        this.util.isObject(currentMetadataProviderC)
          ? {
              ...(currentMetadataProviderC as Trf_TModelConfigForProvider),
              structureProvider: reBuildStructureFn(
                dfPC.structureProvider,
                (currentMetadataProviderC as Trf_TModelConfigForProvider)
                  .structureProvider,
                "hard"
              ),
            }
          : {
              ...dfPC,
            }
      ) as Trf_TModelConfigForProvider;
      let rModelConfig = {} as Trf_TModelConfigForProvider;
      if (!this.util.isObject(mPC)) {
        rModelConfig = {
          ...cMPC,
          structureProvider: reBuildStructureFn(
            cMPC.structureProvider,
            undefined,
            "hard"
          ),
        };
      } else {
        rModelConfig = {
          ...mPC,
          structureProvider: reBuildStructureFn(
            cMPC.structureProvider,
            mPC.structureProvider,
            this.util.isObject(currentMetadataProviderC) ? "soft" : "hard"
          ),
        } as Trf_TModelConfigForProvider;
      }
      rMetadataProviderC = rModelConfig;
    } else {
      throw new LogicError({
        code: ELogicCodeError.NOT_VALID,
        msn: `context handler = ${keyModuleContext} does not valid`,
      });
    }
    return rMetadataProviderC;
  }
  /**... */
  private buildMetadataForCtrlModule(
    keyModuleContext: "fieldMeta",
    metadataCtrlC: Trf_TFieldConfigForCtrl,
    currentMetadataCtrlC: Trf_TFieldConfigForCtrl
  ): Trf_TFieldConfigForCtrl;
  private buildMetadataForCtrlModule(
    keyModuleContext: "modelMeta",
    metadataCtrlC: Trf_TModelConfigForCtrl,
    currentMetadataCtrlC: Trf_TModelConfigForCtrl
  ): Trf_TModelConfigForCtrl;
  private buildMetadataForCtrlModule(
    keyModuleContext: TKeyStructureMetadataModuleContext,
    metadataCtrlC: unknown,
    currentMetadataCtrlC: unknown
  ): unknown {
    const df = this.getDefault().handlerConfig;
    let rMetadataCtrlC: unknown = {}; //de diferentes contextos
    if (keyModuleContext === "fieldMeta") {
      const reBuildFieldFn =
        StructureLogicController.rebuildCustomConfigFromModuleContext;
      const dfCC = df.fieldMeta.__ctrlConfig;
      const mCC = metadataCtrlC as Trf_TFieldConfigForCtrl;
      const cMCC = (
        this.util.isObject(currentMetadataCtrlC)
          ? {
              ...(currentMetadataCtrlC as Trf_TFieldConfigForCtrl),
              fieldCtrl: reBuildFieldFn(
                "fieldCtrl",
                dfCC.fieldCtrl,
                (currentMetadataCtrlC as Trf_TFieldConfigForCtrl).fieldCtrl
              ),
            }
          : {
              ...dfCC,
            }
      ) as Trf_TFieldConfigForCtrl;
      let rFieldConfig = {} as Trf_TFieldConfigForCtrl;
      if (!this.util.isObject(mCC)) {
        rFieldConfig = {
          ...cMCC,
          fieldCtrl: reBuildFieldFn("fieldCtrl", cMCC.fieldCtrl, mCC.fieldCtrl),
        };
      } else {
        rFieldConfig = {
          ...mCC,
          fieldCtrl: reBuildFieldFn("fieldCtrl", cMCC.fieldCtrl, mCC.fieldCtrl),
        };
      }
      rMetadataCtrlC = rFieldConfig;
    } else if (keyModuleContext === "modelMeta") {
      const reBuildModelFn =
        StructureLogicController.rebuildCustomConfigFromModuleContext;
      const dfCC = df.modelMeta.__ctrlConfig;
      const mCC = metadataCtrlC as Trf_TModelConfigForCtrl;
      const cMCC = (
        this.util.isObject(currentMetadataCtrlC)
          ? {
              ...(currentMetadataCtrlC as Trf_TModelConfigForCtrl),
              modelCtrl: reBuildModelFn(
                "modelCtrl",
                dfCC.modelCtrl,
                (currentMetadataCtrlC as Trf_TModelConfigForCtrl).modelCtrl
              ),
            }
          : {
              modelCtrl: dfCC.modelCtrl,
            }
      ) as Trf_TModelConfigForCtrl;
      let rModelConfig = {} as Trf_TModelConfigForCtrl;
      if (!this.util.isObject(mCC)) {
        rModelConfig = {
          ...cMCC,
          modelCtrl: reBuildModelFn("modelCtrl", cMCC.modelCtrl, mCC.modelCtrl),
        };
      } else {
        rModelConfig = {
          ...mCC,
          modelCtrl: reBuildModelFn("modelCtrl", cMCC.modelCtrl, mCC.modelCtrl),
        };
      }
      rMetadataCtrlC = rModelConfig;
    } else {
      throw new LogicError({
        code: ELogicCodeError.NOT_VALID,
        msn: `context handler = ${keyModuleContext} does not valid`,
      });
    }
    return rMetadataCtrlC;
  }
  /**... */
  private buildMetadataForCriteriaPriority(
    keyModuleContext: "fieldMeta",
    metaData: Trf_TStructureFieldFull
  ): Trf_TStructureFieldFull;
  private buildMetadataForCriteriaPriority(
    keyModuleContext: "modelMeta",
    metaData: Trf_TStructureFull
  ): Trf_TStructureFull;
  private buildMetadataForCriteriaPriority(
    keyModuleContext: TKeyStructureMetadataModuleContext,
    metaData: unknown
  ): unknown {
    if (keyModuleContext === "fieldMeta") {
      const fieldMeta = metaData as Trf_TStructureFieldFull;
      const { __ctrlConfig, __valConfig, __mutateConfig } = fieldMeta;
      const baseCRC = {
        diccGlobalAC: {
          fieldMutate: __mutateConfig.fieldMutate.diccActionsConfig,
          fieldVal: __valConfig.fieldVal.diccActionsConfig,
        },
      } as TStructureFieldBaseCriteria<any>;
      let { fieldCtrl } = __ctrlConfig;
      const newCRC = fieldCtrl.criteriaRequestConfig as IStructureFieldCriteria<
        any,
        any,
        any
      >;
      fieldCtrl.criteriaRequestConfig =
        StructureCriteriaHandler.rebuildCustomConfigFromModuleContext(
          "structureField",
          baseCRC as any,
          newCRC as any
        ) as any;
    } else if (keyModuleContext === "modelMeta") {
      const modelMeta = metaData as Trf_TStructureFull;
      const { diccCriteriaRequestConfig } = modelMeta.__ctrlConfig.modelCtrl;
      const baseCRC = {
        diccGlobalAC: {
          modelMutate: modelMeta.__mutateConfig.modelMutate.diccActionsConfig,
          modelVal: modelMeta.__valConfig.modelVal.diccActionsConfig,
          requestVal: modelMeta.__valConfig.requestVal.diccActionsConfig,
          structureHook: modelMeta.__hookConfig.structureHook.diccActionsConfig,
          structureProvider:
            modelMeta.__providerConfig.structureProvider.diccActionsConfig,
        },
      } as TStructureModelBaseReadCriteria<any> &
        TStructureModelBaseModifyCriteria<any>;
      for (const keyAction in diccCriteriaRequestConfig) {
        const newCRC = diccCriteriaRequestConfig[keyAction];
        diccCriteriaRequestConfig[keyAction] =
          StructureCriteriaHandler.rebuildCustomConfigFromModuleContext(
            "structureModel",
            baseCRC as any,
            newCRC as any
          );
      }
      //organizar por campos
      // const modelMetaOnlyField =
      //   this.util.selectOnlyProperties<Trf_TStructureFull>(modelMeta);
      // Object.keys(modelMetaOnlyField).forEach((keyField) => {
      //   const fieldMeta = modelMetaOnlyField[keyField];
      //   modelMetaOnlyField[keyField] = this.buildMetadataForCriteriaPriority(
      //     "fieldMeta",
      //     fieldMeta
      //   );
      // });
    } else {
      throw new LogicError({
        code: ELogicCodeError.NOT_VALID,
        msn: `${keyModuleContext} does not context handler valid`,
      });
    }
    return metaData;
  }
  /**construye el array de claves identificadoras a partir de los metadatos */
  private buildStructureAKeysPath(metadata: Trf_TStructureFull): string[] {
    let aKeysPath: string[] = [];
    let addKeysPathFn = (metadataContext: Trf_TStructureFull) => {
      const mt = metadataContext;
      aKeysPath.push(mt.__keyPath);
      const keysProp = mt.__keysProp;
      for (const keyProp of keysProp) {
        const mtProp = mt[keyProp];
        aKeysPath.push(mtProp.__keyPath);
        if (this.util.isObject(mtProp.__emb)) {
          const sub_emb = mtProp.__emb as any as Trf_TStructureFull;
          addKeysPathFn(sub_emb); //push interno recursivo
        }
      }
    };
    addKeysPathFn(metadata);
    return aKeysPath;
  }
  //====Métodos de obtención de metadatos============================================================================================================================
  /**
   * obtener un extracto (segmento) de metadatos
   * ____
   * @param rootSchema estructura raiz de la
   * cual extraer el segmento de metadatos
   * @param keyStructureContext el tipo de estructura
   * a extraer.
   * @param keyPath ruta clave identificadora
   * que indica el segmento de metadatos a extraer
   * @param keyEmbEncapsulator (default = `"__emb"`)
   * la clave de la propiedad que encapsula los
   * modelos embebidos
   * ____
   * @return el segmento de metadato extraido
   * o `defaultVSchema` si no se pudo extraer
   */
  public static getExtractMetadata(
    rootSchema: object,
    keyStructureContext: TKeyStructureContextFull,
    keyPath: string,
    keyEmbEncapsulator: keyof Trf_TStructureFieldMeta = "__emb"
  ): object {
    const util = Module.util;
    const dfFieldMeta =
      StructureLogicMetadataHandler.getDefault().handlerConfig.fieldMeta;
    const dfModelMeta =
      StructureLogicMetadataHandler.getDefault().handlerConfig.modelMeta;
    let metadataSchema = rootSchema;
    let keyEC = keyEmbEncapsulator;
    const sp = util.charSeparatorLogicPath;
    const aPath = keyPath.split(sp);
    const lenAPath = aPath.length;
    for (let idx = 0; idx < lenAPath; idx++) {
      const key = aPath[idx];
      //posible procedencia de array
      if (util.isNumber(key, true)) continue; //ignorar profundidades en array
      if (keyStructureContext === "structureField") {
        if (idx === 0) continue; //el primero es la key del modelo raiz, se ignora
        //determinar si existe mayor profundidad
        if (idx > 1) {
          if (!util.isObject(metadataSchema[keyEC])) {
            metadataSchema = dfFieldMeta;
            break;
          }
          metadataSchema = metadataSchema[keyEC];
        }
        //agregar los metadatos correspondientes
        metadataSchema = metadataSchema[key];
        if (!util.isObject(metadataSchema)) {
          metadataSchema = dfModelMeta;
          break;
        }
      } else if (keyStructureContext === "structureEmbedded") {
        if (idx === 0) continue; //el primero es la key del modelo raiz, se ignora
        if (
          !util.isObject(metadataSchema[key]) ||
          !util.isObject(metadataSchema[key][keyEC])
        ) {
          metadataSchema = dfModelMeta;
          break;
        }
        metadataSchema = metadataSchema[key][keyEC];
      } else if (keyStructureContext === "structureModel") {
        if (
          !util.isObject(metadataSchema) ||
          lenAPath > 1 //la raiz no puede tener niveles de profundidad
        ) {
          metadataSchema = dfModelMeta;
        }
        break;
      } else {
        throw new LogicError({
          code: ELogicCodeError.NOT_VALID,
          msn: `${keyStructureContext} does not valid context of selection`,
        });
      }
    }
    //clonacion por seguridad
    //metadataSchema = util.clone(metadataSchema); //consume muchos recursos
    return metadataSchema;
  }
  /**
   * obtener la configuracion de acuerdo al contexto
   * ____
   * @param keyStructureContext el contexto del cual se
   * desea obtener el extracto de la estrucura de
   * solo campos
   * @param keyField la clave identificadora del campo
   * ____
   * @returns objeto literal con la estructura
   * de configuracion de acuerdo al contexto
   * solicitado
   */
  public getExtractMetadataByStructureContext(
    keyStructureContext: "structureField",
    keyPath: string
  ): TStructureFieldFull<TFieldMutateInstance, TFieldValInstance>;
  public getExtractMetadataByStructureContext<
    TEmbFieldMutateInstance extends TFieldMutateInstance = TFieldMutateInstance,
    TEmbFieldValInstance extends TFieldValInstance = TFieldValInstance,
    TEmbEmbModel = unknown,
    TEmbEmbFieldMutateInstance extends TFieldMutateInstance = TFieldMutateInstance,
    TEmbEmbModelMutateInstance extends TModelMutateInstance = TModelMutateInstance,
    TEmbEmbFieldValInstance extends TFieldValInstance = TFieldValInstance,
    TEmbEmbModelValInstance extends TModelValInstance = TModelValInstance
  >(
    keyStructureContext: "structureField", //❕es el mismo pero para embebido❕
    keyPath: string
  ): TStructureFieldFull<
    TEmbFieldMutateInstance,
    TEmbFieldValInstance,
    TEmbEmbModel,
    TEmbEmbFieldMutateInstance,
    TEmbEmbModelMutateInstance,
    TEmbEmbFieldValInstance,
    TEmbEmbModelValInstance
  >;
  public getExtractMetadataByStructureContext<
    TEmbModel,
    TEmbFieldMutateInstance extends TFieldMutateInstance = TFieldMutateInstance,
    TEmbModelMutateInstance extends TModelMutateInstance = TModelMutateInstance,
    TEmbFieldValInstance extends TFieldValInstance = TFieldValInstance,
    TEmbModelValInstance extends TModelValInstance = TModelValInstance
    // TEmbRequestValInstance extends TRequestValInstance = TRequestValInstance
    // TEmbStructureHookInstance extends TStructureHookInstance = TStructureHookInstance
    // TEmbStructureProviderInstance extends TStructureProviderInstance = TStructureProviderInstance
  >(
    keyStructureContext: "structureEmbedded",
    keyPath: string
  ): TStructureFull<
    TEmbModel,
    TEmbFieldMutateInstance,
    TEmbModelMutateInstance,
    TEmbFieldValInstance,
    TEmbModelValInstance
    //TEmbRequestValInstance,
    //TEmbStructureHookInstance,
    //TEmbStructureProviderInstance
  >;
  public getExtractMetadataByStructureContext(
    keyStructureContext: "structureModel"
  ): TStructureFull<
    TModel,
    TFieldMutateInstance,
    TModelMutateInstance,
    TFieldValInstance,
    TModelValInstance,
    TRequestValInstance,
    TStructureHookInstance,
    TStructureProviderInstance,
    TKeyDiccActionRequest
  >;
  public getExtractMetadataByStructureContext(
    keyStructureContext: TKeyStructureContextFull,
    keyPath = this.keySrc
  ): unknown {
    const rootMetadata = this.metadata;
    const keyEC: keyof Trf_IStructureMetadataModuleConfig["fieldMeta"] =
      "__emb";
    let metadata = StructureLogicMetadataHandler.getExtractMetadata(
      rootMetadata,
      keyStructureContext,
      keyPath,
      keyEC
    );
    return metadata;
  }
  /**... */
  public getExtractMetadataByModuleContext(
    keyStructureContext: "structureField",
    keyModule: "metadata", //❗Solo para tipar el retorno❗
    keyPath: string
  ): TStructureFieldMeta<any>;
  public getExtractMetadataByModuleContext<
    TEmbFieldMutateInstance extends TFieldMutateInstance = TFieldMutateInstance
  >(
    keyStructureContext: "structureField",
    keyModule: "mutater", //❗Solo para tipar el retorno❗
    keyPath: string
  ): TStructureFieldMetaAndMutater<TEmbFieldMutateInstance>;
  public getExtractMetadataByModuleContext<
    TEmbFieldValInstance extends TFieldValInstance = TFieldValInstance
  >(
    keyStructureContext: "structureField",
    keyModule: "validator", //❗Solo para tipar el retorno❗
    keyPath: string
  ): TStructureFieldMetaAndValidator<TEmbFieldValInstance>;
  public getExtractMetadataByModuleContext<
    TEmbFieldMutateInstance extends TFieldMutateInstance = TFieldMutateInstance,
    TEmbFieldValInstance extends TFieldValInstance = TFieldValInstance
  >(
    keyStructureContext: "structureField",
    keyModule: "controller", //❗Solo para tipar el retorno❗
    keyPath: string
  ): TStructureFieldMetaAndCtrl<TEmbFieldMutateInstance, TEmbFieldValInstance>;
  public getExtractMetadataByModuleContext<TEmbModel>(
    keyStructureContext: "structureField",
    keyModule: "metadata", //❗Solo para tipar el retorno❗
    keyPath: string
  ): TStructureFieldMeta<TEmbModel>;
  public getExtractMetadataByModuleContext<
    TEmbFieldMutateInstance extends TFieldMutateInstance = TFieldMutateInstance,
    TEmbEmbModel = unknown, //❗nivel aun mas profundo❗
    TEmbEmbFieldMutateInstance extends TFieldMutateInstance = TFieldMutateInstance,
    TEmbEmbModelMutateInstance extends TModelMutateInstance = TModelMutateInstance
  >(
    keyStructureContext: "structureField",
    keyModule: "mutater", //❗Solo para tipar el retorno❗
    keyPath: string
  ): TStructureFieldMetaAndMutater<
    TEmbFieldMutateInstance,
    TEmbEmbModel,
    TEmbEmbFieldMutateInstance,
    TEmbEmbModelMutateInstance
  >;
  public getExtractMetadataByModuleContext<
    TEmbFieldValInstance extends TFieldValInstance = TFieldValInstance,
    TEmbEmbModel = unknown, //❗nivel aun mas profundo❗
    TEmbEmbFieldValInstance extends TFieldValInstance = TFieldValInstance,
    TEmbEmbModelValInstance extends TModelValInstance = TModelValInstance
    // TEmbRequestValInstance extends TRequestValInstance = TRequestValInstance
  >(
    keyStructureContext: "structureField",
    keyModule: "validator", //❗Solo para tipar el retorno❗
    keyPath: string
  ): TStructureFieldMetaAndValidator<
    TEmbFieldValInstance,
    TEmbEmbModel,
    TEmbEmbFieldValInstance,
    TEmbEmbModelValInstance
  >;
  public getExtractMetadataByModuleContext<
    TEmbFieldMutateInstance extends TFieldMutateInstance = TFieldMutateInstance,
    TEmbFieldValInstance extends TFieldValInstance = TFieldValInstance,
    TEmbEmbModel = unknown, //❗nivel aun mas profundo❗
    TEmbEmbModelMutateInstance extends TModelMutateInstance = TModelMutateInstance,
    TEmbEmbModelValInstance extends TModelValInstance = TModelValInstance
  >(
    keyStructureContext: "structureField",
    keyModule: "controller", //❗Solo para tipar el retorno❗
    keyPath: string
  ): TStructureFieldMetaAndCtrl<
    TEmbFieldMutateInstance,
    TEmbFieldValInstance,
    TEmbEmbModel,
    TEmbEmbModelMutateInstance,
    TEmbEmbModelValInstance
  >;
  public getExtractMetadataByModuleContext<TEmbModel>(
    keyStructureContext: "structureEmbedded",
    keyModule: "metadata", //❗Solo para tipar el retorno❗
    keyPath: string
  ): TStructureMeta<TEmbModel>;
  public getExtractMetadataByModuleContext<
    TEmbModel,
    TEmbFieldMutateInstance extends TFieldMutateInstance = TFieldMutateInstance,
    TEmbModelMutateInstance extends TModelMutateInstance = TModelMutateInstance
  >(
    keyStructureContext: "structureEmbedded",
    keyModule: "mutater", //❗Solo para tipar el retorno❗
    keyPath: string
  ): TStructureMetaAndMutater<
    TEmbModel,
    TEmbFieldMutateInstance,
    TEmbModelMutateInstance
  >;
  public getExtractMetadataByModuleContext<
    TEmbModel,
    TEmbFieldValInstance extends TFieldValInstance = TFieldValInstance,
    TEmbModelValInstance extends TModelValInstance = TModelValInstance
    // TEmbRequestValInstance extends TRequestValInstance = TRequestValInstance
  >(
    keyStructureContext: "structureEmbedded",
    keyModule: "validator", //❗Solo para tipar el retorno❗
    keyPath: string
  ): TStructureMetaAndValidator<
    TEmbModel,
    TEmbFieldValInstance,
    TEmbModelValInstance
    //TEmbRequestValInstance
  >;
  // public getExtractMetadataByModuleContext<
  //   TEmbModel,
  //   TIDiccEmbHookAC = TStructureHookInstance["dfDiccActionConfig"]
  // >(
  //   keyStructureContext: "structureEmbedded",
  //   keyModule: "hook", //❗Solo para tipar el retorno❗
  //   keyPath: string
  // ): TStructureMetaAndHook<TEmbModel, TIDiccEmbHookAC>;
  // public getExtractMetadataByModuleContext<
  //   TEmbModel,
  //   TIDiccEmbProviderAC = TStructureProviderInstance["dfDiccActionConfig"]
  // >(
  //   keyStructureContext: "structureEmbedded",
  //   keyModule: "provider", //❗Solo para tipar el retorno❗
  //   keyPath: string
  // ): TStructureMetaAndProvider<TEmbModel, TIDiccEmbProviderAC>;
  public getExtractMetadataByModuleContext<
    TEmbModel,
    TEmbModelMutateInstance extends TModelMutateInstance = TModelMutateInstance,
    TEmbModelValInstance extends TModelValInstance = TModelValInstance
  >(
    keyStructureContext: "structureEmbedded",
    keyModule: "controller", //❗Solo para tipar el retorno❗
    keyPath: string
  ): TStructureMetaAndCtrl<
    TEmbModel,
    TEmbModelMutateInstance,
    TEmbModelValInstance
  >;
  public getExtractMetadataByModuleContext(
    keyStructureContext: "structureModel",
    keyModule: "metadata" //❗Solo para tipar el retorno❗
  ): TStructureMeta<TModel>;
  public getExtractMetadataByModuleContext(
    keyStructureContext: "structureModel",
    keyModule: "mutater" //❗Solo para tipar el retorno❗
  ): TStructureMetaAndMutater<
    TModel,
    TFieldMutateInstance,
    TModelMutateInstance
  >;
  public getExtractMetadataByModuleContext(
    keyStructureContext: "structureModel",
    keyModule: "validator" //❗Solo para tipar el retorno❗
  ): TStructureMetaAndValidator<
    TModel,
    TFieldValInstance,
    TModelValInstance,
    TRequestValInstance
  >;
  public getExtractMetadataByModuleContext(
    keyStructureContext: "structureModel",
    keyModule: "hook" //❗Solo para tipar el retorno❗
  ): TStructureMetaAndHook<TModel, TStructureHookInstance>;
  public getExtractMetadataByModuleContext(
    keyStructureContext: "structureModel",
    keyModule: "provider" //❗Solo para tipar el retorno❗
  ): TStructureMetaAndProvider<TModel, TStructureProviderInstance>;
  public getExtractMetadataByModuleContext(
    keyStructureContext: "structureModel",
    keyModule: "controller" //❗Solo para tipar el retorno❗
  ): TStructureMetaAndCtrl<
    TModel,
    TModelMutateInstance,
    TModelValInstance,
    TRequestValInstance,
    TStructureHookInstance,
    TStructureProviderInstance,
    TKeyDiccActionRequest
  >;
  public getExtractMetadataByModuleContext(
    keyStructureContext: TKeyStructureContextFull,
    keyModule: TKeyModuleWithReport | Extract<TKeyHandlerModule, "metadata">, //❗Solo para tipar el retorno❗
    keyPath = this.keySrc
  ): unknown {
    //❗❗❗Es solo una fachada para tipar, ya que en
    //si devuelve todos los metadatos del segmento❗❗❗
    const rMetadata = this.getExtractMetadataByStructureContext(
      keyStructureContext as never,
      keyPath
    );
    return rMetadata;
  }
  /**... */
  public getDiccActionConfigByModuleContext(
    keyStructureContext: "structureField",
    keyModule: "mutater",
    keyModuleContext: "fieldMutate",
    keyPath: string
  ): TModelMutateInstance["dfDiccActionConfig"];
  public getDiccActionConfigByModuleContext(
    keyStructureContext: "structureField",
    keyModule: "validator",
    keyModuleContext: "fieldVal",
    keyPath: string
  ): TModelMutateInstance["dfDiccActionConfig"];
  public getDiccActionConfigByModuleContext(
    keyStructureContext: "structureField",
    keyModule: "controller",
    keyModuleContext: undefined,
    keyPath: string
  ): TFieldConfigForCtrl<TFieldMutateInstance, TFieldValInstance>["fieldCtrl"];
  public getDiccActionConfigByModuleContext<
    TIDiccEmbFieldMutateAC extends TFieldMutateInstance["dfDiccActionConfig"] = TFieldMutateInstance["dfDiccActionConfig"]
  >(
    keyStructureContext: "structureField",
    keyModule: "mutater",
    keyModuleContext: "fieldMutate",
    keyPath: string
  ): TIDiccEmbFieldMutateAC;
  public getDiccActionConfigByModuleContext<
    TIDiccEmbFieldValAC extends TFieldValInstance["dfDiccActionConfig"] = TFieldValInstance["dfDiccActionConfig"]
  >(
    keyStructureContext: "structureField",
    keyModule: "validator",
    keyModuleContext: "fieldVal",
    keyPath: string
  ): TIDiccEmbFieldValAC;
  public getDiccActionConfigByModuleContext<
    TIDiccEmbModelMutateAC extends TModelMutateInstance["dfDiccActionConfig"] = TModelMutateInstance["dfDiccActionConfig"]
  >(
    keyStructureContext: "structureEmbedded",
    keyModule: "mutater",
    keyModuleContext: "modelMutate",
    keyPath: string
  ): TIDiccEmbModelMutateAC;
  public getDiccActionConfigByModuleContext<
    TIDiccEmbModelValAC extends TModelValInstance["dfDiccActionConfig"] = TModelValInstance["dfDiccActionConfig"]
  >(
    keyStructureContext: "structureEmbedded",
    keyModule: "validator",
    keyModuleContext: "modelVal",
    keyPath: string
  ): TIDiccEmbModelValAC;
  public getDiccActionConfigByModuleContext<
    TIDiccEmbModelMutateAC extends TModelMutateInstance = TModelMutateInstance,
    TIDiccEmbModelValAC extends TModelValInstance = TModelValInstance,
    TKeyDiccEmbActionRequest extends string = string
  >(
    keyStructureContext: "structureEmbedded",
    keyModule: "controller",
    keyModuleContext: undefined,
    keyPath: string
  ): TModelConfigForCtrl<
    TIDiccEmbModelMutateAC,
    TIDiccEmbModelValAC,
    any,
    any,
    any,
    TKeyDiccEmbActionRequest
  >["modelCtrl"]["diccCriteriaRequestConfig"];
  public getDiccActionConfigByModuleContext(
    keyStructureContext: "structureModel",
    keyModule: "mutater",
    keyModuleContext: "modelMutate"
  ): TModelMutateInstance["dfDiccActionConfig"];
  public getDiccActionConfigByModuleContext(
    keyStructureContext: "structureModel",
    keyModule: "validator",
    keyModuleContext: "modelVal"
  ): TModelValInstance["dfDiccActionConfig"];
  public getDiccActionConfigByModuleContext(
    keyStructureContext: "structureModel",
    keyModule: "validator",
    keyModuleContext: "requestVal"
  ): TRequestValInstance["dfDiccActionConfig"];
  public getDiccActionConfigByModuleContext(
    keyStructureContext: "structureModel",
    keyModule: "hook"
  ): TStructureHookInstance["dfDiccActionConfig"];
  public getDiccActionConfigByModuleContext(
    keyStructureContext: "structureModel",
    keyModule: "provider"
  ): TStructureProviderInstance["dfDiccActionConfig"];
  public getDiccActionConfigByModuleContext(
    keyStructureContext: "structureModel",
    keyModule: "controller"
  ): TModelConfigForCtrl<
    TModelMutateInstance,
    TModelValInstance,
    TRequestValInstance,
    TStructureHookInstance,
    TStructureProviderInstance,
    TKeyDiccActionRequest
  >["modelCtrl"]["diccCriteriaRequestConfig"];
  public getDiccActionConfigByModuleContext(
    keyStructureContext: TKeyStructureContextFull,
    keyModule: Exclude<TKeyModuleWithReport, "service">,
    keyModuleContext?:
      | TKeyStructureDeepMutateModuleContext
      | TKeyStructureDeepValModuleContext,
    keyPath = this.keySrc
  ): unknown {
    let diccAC: unknown;
    if (keyStructureContext === "structureField") {
      if (keyModuleContext === "fieldMutate") {
        const metadataByModuleContext = this.getExtractMetadataByModuleContext(
          keyStructureContext,
          "mutater",
          keyPath
        );
        diccAC =
          metadataByModuleContext.__mutateConfig.fieldMutate.diccActionsConfig;
      } else if (keyModuleContext === "fieldVal") {
        const metadataByModuleContext = this.getExtractMetadataByModuleContext(
          keyStructureContext,
          "validator",
          keyPath
        );
        diccAC = metadataByModuleContext.__valConfig.fieldVal.diccActionsConfig;
      } else if (keyModule === "controller") {
        const metadataByModuleContext = this.getExtractMetadataByModuleContext(
          keyStructureContext,
          "controller",
          keyPath
        );
        diccAC = metadataByModuleContext.__ctrlConfig.fieldCtrl; //no está envuelto
      } else {
        throw new LogicError({
          code: ELogicCodeError.MODULE_ERROR,
          msn: `${keyModuleContext} is not module context key valid into ${keyStructureContext} context`,
        });
      }
    } else if (keyStructureContext === "structureEmbedded") {
      if (keyModule === "mutater") {
        if (keyModuleContext === "modelMutate") {
          const metadataByModuleContext =
            this.getExtractMetadataByModuleContext(
              keyStructureContext,
              keyModule,
              keyPath
            );
          diccAC =
            metadataByModuleContext.__mutateConfig.modelMutate
              .diccActionsConfig;
        } else {
          throw new LogicError({
            code: ELogicCodeError.MODULE_ERROR,
            msn: `${keyModuleContext} is not module context key valid into ${keyModule} module`,
          });
        }
      } else if (keyModule === "validator") {
        if (keyModuleContext === "modelVal") {
          const metadataByModuleContext =
            this.getExtractMetadataByModuleContext(
              keyStructureContext,
              keyModule,
              keyPath
            );
          diccAC =
            metadataByModuleContext.__valConfig.modelVal.diccActionsConfig;
          // }else if(keyModuleContext === "requestVal"){
          //   const metadataByModuleContext = this.getExtractMetadataByModuleContext(
          //     keyStructureContext,
          //     keyModule,
          //     keyPath,
          //   );
          //   diccAC = metadataByModuleContext.__valConfig.requestVal.diccActionsConfig;
        } else {
          throw new LogicError({
            code: ELogicCodeError.MODULE_ERROR,
            msn: `${keyModuleContext} is not module context key valid into ${keyModule} module`,
          });
        }
      } else if (keyModule === "controller") {
        const metadataByModuleContext = this.getExtractMetadataByModuleContext(
          keyStructureContext,
          keyModule,
          keyPath
        );
        diccAC =
          metadataByModuleContext.__ctrlConfig.modelCtrl
            .diccCriteriaRequestConfig;
      } else {
        throw new LogicError({
          code: ELogicCodeError.MODULE_ERROR,
          msn: `${keyModule} is not module key valid`,
        });
      }
    } else if (keyStructureContext === "structureModel") {
      if (keyModule === "mutater") {
        if (keyModuleContext === "modelMutate") {
          const metadataByModuleContext =
            this.getExtractMetadataByModuleContext(
              keyStructureContext,
              keyModule
            );
          diccAC =
            metadataByModuleContext.__mutateConfig.modelMutate
              .diccActionsConfig;
        } else {
          throw new LogicError({
            code: ELogicCodeError.MODULE_ERROR,
            msn: `${keyModuleContext} is not module context key valid into ${keyModule} module`,
          });
        }
      } else if (keyModule === "validator") {
        if (keyModuleContext === "modelMutate") {
          const metadataByModuleContext =
            this.getExtractMetadataByModuleContext(
              keyStructureContext,
              keyModule
            );
          diccAC =
            metadataByModuleContext.__valConfig.modelVal.diccActionsConfig;
        } else if (keyModuleContext === "requestVal") {
          const metadataByModuleContext =
            this.getExtractMetadataByModuleContext(
              keyStructureContext,
              keyModule
            );
          diccAC =
            metadataByModuleContext.__valConfig.requestVal.diccActionsConfig;
        } else {
          throw new LogicError({
            code: ELogicCodeError.MODULE_ERROR,
            msn: `${keyModuleContext} is not module context key valid into ${keyModule} module`,
          });
        }
      } else if (keyModule === "hook") {
        const metadataByModuleContext = this.getExtractMetadataByModuleContext(
          keyStructureContext,
          keyModule
        );
        diccAC =
          metadataByModuleContext.__hookConfig.structureHook.diccActionsConfig;
      } else if (keyModule === "provider") {
        const metadataByModuleContext = this.getExtractMetadataByModuleContext(
          keyStructureContext,
          keyModule
        );
        diccAC =
          metadataByModuleContext.__providerConfig.structureProvider
            .diccActionsConfig;
      } else if (keyModule === "controller") {
        const metadataByModuleContext = this.getExtractMetadataByModuleContext(
          keyStructureContext,
          keyModule
        );
        diccAC =
          metadataByModuleContext.__ctrlConfig.modelCtrl
            .diccCriteriaRequestConfig;
      } else {
        throw new LogicError({
          code: ELogicCodeError.MODULE_ERROR,
          msn: `${keyModule} is not module key valid`,
        });
      }
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${keyStructureContext} is not structure context key valid`,
      });
    }
    return diccAC;
  }
  /**... */
  public static getDfMetadataHandlerByContext(
    keyModuleContext: "fieldMeta"
  ): Trf_IStructureMetadataModuleConfig["fieldMeta"];
  public static getDfMetadataHandlerByContext(
    keyModuleContext: "modelMeta"
  ): Trf_IStructureMetadataModuleConfig["modelMeta"];
  public static getDfMetadataHandlerByContext(
    keyModuleContext: TKeyStructureMetadataModuleContext
  ): unknown {
    const dfHC = StructureLogicMetadataHandler.getDefault().handlerConfig;
    let dfMetadata: unknown;
    if (keyModuleContext === "fieldMeta") {
      dfMetadata = dfHC.fieldMeta;
    } else if (keyModuleContext === "modelMeta") {
      dfMetadata = dfHC.modelMeta;
    } else {
      throw new LogicError({
        code: ELogicCodeError.NOT_VALID,
        msn: `context handler = ${keyModuleContext} does not valid`,
      });
    }
    return dfMetadata;
  }
  /**
   * @facade
   * obtener la estructura de configuracion solo
   * para campos (en base a un modelo o un embebido)
   * ____
   * @param keyStructureContext el contexto del cual se
   * desea obtener el extracto de la estrucura de
   * solo campos
   * @param embAbsolutePath la ruta del embebido
   * ____
   * @returns un objeto literal con la estructura
   * de configuracion **unicamente** de los campos
   * de acuerdo al contexto.
   */
  public getExtractMetadataStructureOnlyField<
    TEmbFieldMutateInstance extends TFieldMutateInstance = TFieldMutateInstance,
    TEmbFieldValInstance extends TFieldValInstance = TFieldValInstance,
    TEmbEmbModel = unknown
  >(
    keyStructureContext: "structureEmbedded",
    keyModule: "controller",
    keyPath: string
  ): Record<
    keyof TEmbEmbModel,
    TStructureFieldMetaAndCtrl<
      TEmbFieldMutateInstance,
      TEmbFieldValInstance,
      TEmbEmbModel
    >
  >;
  public getExtractMetadataStructureOnlyField<TEmbModel>(
    keyStructureContext: "structureEmbedded",
    keyModule: "metadata",
    keyPath: string
  ): Record<keyof TEmbModel, TStructureFieldMeta<TEmbModel>>;
  public getExtractMetadataStructureOnlyField<
    TEmbFieldMutateInstance extends TFieldMutateInstance = TFieldMutateInstance,
    TEmbFieldValInstance extends TFieldValInstance = TFieldValInstance,
    TEmbEmbModel = unknown
  >(
    keyStructureContext: "structureEmbedded",
    keyModule: "mutater",
    keyPath: string
  ): Record<
    keyof TEmbEmbModel,
    TStructureFieldMetaAndCtrl<
      TEmbFieldMutateInstance,
      TEmbFieldValInstance,
      TEmbEmbModel
    >
  >;
  public getExtractMetadataStructureOnlyField<
    TEmbFieldMutateInstance extends TFieldMutateInstance = TFieldMutateInstance,
    TEmbFieldValInstance extends TFieldValInstance = TFieldValInstance,
    TEmbEmbModel = unknown
  >(
    keyStructureContext: "structureEmbedded",
    keyModule: "validator",
    keyPath: string
  ): Record<
    keyof TEmbEmbModel,
    TStructureFieldMetaAndCtrl<
      TEmbFieldMutateInstance,
      TEmbFieldValInstance,
      TEmbEmbModel
    >
  >;
  /**
   * @facade
   * obtener la estructura de configuracion solo
   * para campos (en base a un modelo o un embebido)
   * ____
   * @param keyStructureContext el contexto del cual se
   * desea obtener el extracto de la estrucura de
   * solo campos
   * ____
   * @returns un objeto literal con la estructura
   * de configuracion **unicamente** de los campos
   * de acuerdo al contexto.
   */
  public getExtractMetadataStructureOnlyField(
    keyStructureContext: "structureModel",
    keyModule: "controller"
  ): Record<
    keyof TModel,
    TStructureFieldMetaAndCtrl<TFieldMutateInstance, TFieldValInstance>
  >;
  public getExtractMetadataStructureOnlyField(
    keyStructureContext: "structureModel",
    keyModule: "metadata"
  ): Record<keyof TModel, TStructureFieldMeta<any>>;
  public getExtractMetadataStructureOnlyField(
    keyStructureContext: "structureModel",
    keyModule: "mutater"
  ): Record<keyof TModel, TStructureFieldMetaAndMutater<TFieldMutateInstance>>;
  public getExtractMetadataStructureOnlyField(
    keyStructureContext: "structureModel",
    keyModule: "validator"
  ): Record<keyof TModel, TStructureFieldMetaAndValidator<TFieldValInstance>>;
  public getExtractMetadataStructureOnlyField(
    keyStructureContext: Extract<
      TKeyStructureContextFull,
      "structureEmbedded" | "structureModel"
    >,
    keyModule: TKeyModuleWithReport | Extract<TKeyHandlerModule, "metadata">, //❗Solo para tipar el retorno❗
    keyPath?: string
  ): unknown {
    if (
      //solo se puede las estructuras de modelo y embebidos (los campos no)
      keyStructureContext !== "structureEmbedded" &&
      keyStructureContext !== "structureModel"
    ) {
      throw new LogicError({
        code: ELogicCodeError.NOT_VALID,
        msn: `${keyStructureContext} does not valid context of selection`,
      });
    }
    const structureConfig = this.getExtractMetadataByStructureContext(
      keyStructureContext as any,
      keyPath
    );
    const structureOnlyField =
      StructureLogicMetadataHandler.getExtractMetadataStructureOnlyField(
        keyStructureContext as any,
        structureConfig
      ) as Record<any, TStructureFieldMeta<any>>;
    return structureOnlyField;
  }
  /**
   * @real
   * obtener la estructura de configuracion solo
   * para campos (en base a un modelo o un embebido)
   * ____
   * @param keyStructureContext contexto de la estructura
   * a partir de la cua se selecciona
   * @param structureConfig la estructura raiz de
   * la cual se selecciona
   * ____
   * @returns un objeto literal con la estructura
   * de configuracion **unicamente** de los campos
   * de acuerdo al contexto.
   *
   */
  public static getExtractMetadataStructureOnlyField<TEmbModel>(
    keyStructureContext: "structureEmbedded",
    baseMetadata: any
  ): Record<keyof TEmbModel, TStructureFieldMeta<any>>;
  /**
   * @real
   * obtener la estructura de configuracion solo
   * para campos (en base a un modelo o un embebido)
   * ____
   * @param keyStructureContext contexto de la estructura
   * a partir de la cua se selecciona
   * @param structureConfig la estructura raiz de
   * la cual se selecciona
   * ____
   * @returns un objeto literal con la estructura
   * de configuracion **unicamente** de los campos
   * de acuerdo al contexto.
   *
   */
  public static getExtractMetadataStructureOnlyField<TModel>(
    keyStructureContext: "structureModel",
    baseMetadata: any
  ): Record<keyof TModel, TStructureFieldMeta<any>>;
  public static getExtractMetadataStructureOnlyField(
    keyStructureContext: Extract<
      TKeyStructureContextFull,
      "structureEmbedded" | "structureModel"
    >, //❗Solo para definir diferentes retornos❗
    baseMetadata: unknown
  ): unknown {
    const util = Module.util;
    let metadataOnlyField = {} as Record<any, Trf_TStructureFieldMeta>;
    metadataOnlyField =
      util.selectOnlyProperties<typeof metadataOnlyField>(baseMetadata);
    return metadataOnlyField;
  }
  /** */
  public getDataDefault<TKey extends keyof TModel>(
    keyStructureContext: "structureField",
    keyPath: string,
    keyField: TKey //❗solo util para retornar el tipo del campo❗
  ): TModel[TKey];
  public getDataDefault<TEmbModel, TKey extends keyof TEmbModel>(
    keyStructureContext: "structureField", //❕el mismo pero para campo embebido❕
    keyPath: string,
    KeyEmbField: TKey //❗solo util para retornar el tipo del campo❗
  ): TEmbModel[TKey];
  public getDataDefault<TEmbModel>(
    keyStructureContext: "structureEmbedded",
    keyPath: string
  ): TEmbModel;
  public getDataDefault(keyStructureContext: "structureModel"): TModel;
  public getDataDefault(
    keyStructureContext: TKeyStructureContextFull,
    keyPath?: string,
    keyNever?: never //❗solo sirve para refinar el tipo de retorno❗
  ): unknown {
    let data: unknown;
    if (keyStructureContext === "structureField") {
      const fieldMetadata = this.getExtractMetadataByStructureContext(
        "structureField",
        keyPath
      );
      data = fieldMetadata.__dfData;
    } else if (
      keyStructureContext === "structureEmbedded" ||
      keyStructureContext === "structureModel"
    ) {
      const modelOrEmbModelMetadata = this.getExtractMetadataByStructureContext(
        "structureEmbedded",
        keyPath
      );
      data = modelOrEmbModelMetadata.__dfData;
    } else {
      throw new LogicError({
        code: ELogicCodeError.NOT_VALID,
        msn: `${keyStructureContext} does not valid context of selection`,
      });
    }
    //❗Obligatorio la clonacion❗
    data = this.util.clone(data);
    return data;
  }
  /**
   * obtener un objeto en base al modelo para propositos
   * generales.
   * ____
   * @param structureContext el tipo de estructura que
   * representa el modelo o modelo embebido.
   * @param keyPath la ruta de la clave identificadora
   * @param customizeValue (defualt = `undefined`) el
   * valor a asignara todas las propiedades
   * ____
   * @returns un objeto como modelo para proposito
   * general, los campos tendran el valor de `customizeValue`
   */
  public getSchemaDataForGenericPurpose<TValue, TAnonimeField>(
    keyStructureContext: "structureField", //❗solo sirve si el campo es de tipo objeto anonimo (NO array)❗
    keyPath: string,
    customizeValue?: TValue
  ): Record<keyof TAnonimeField, TValue>;
  public getSchemaDataForGenericPurpose<TValue, TEmbModel>(
    keyStructureContext: "structureEmbedded",
    keyPath: string,
    customizeValue?: TValue
  ): Record<keyof TEmbModel, TValue>;
  public getSchemaDataForGenericPurpose<TValue>(
    keyStructureContext: "structureModel",
    keyPath: undefined,
    customizeValue?: TValue
  ): Record<keyof TModel, TValue>;
  public getSchemaDataForGenericPurpose<TValue>(
    keyStructureContext: TKeyStructureContextFull,
    keyPath: string,
    customizeValue: TValue = undefined
  ): unknown {
    let modelGP = {} as any;
    const extractMetadata = this.getExtractMetadataByStructureContext(
      keyStructureContext as any,
      keyPath
    );
    const keysProp = extractMetadata.__keysProp;
    for (const key of keysProp) {
      modelGP[key] = customizeValue;
    }
    return modelGP;
  }
  public override getModuleInstanceForActionContext(
    keyModuleContext: TKeyStructureInternalACModuleContext
  ): ActionModule<any> {
    const {
      fieldMutate: mFM,
      modelMutate: mMM,
      fieldVal: mFV,
      modelVal: mMV,
      requestVal: mRV,
      structureHook: mSH,
      structureProvider: mSP,
    } = this.diccModuleInstanceContext;
    let actionModule: ActionModule<any>;
    if (keyModuleContext === "fieldMutate") actionModule = mFM;
    else if (keyModuleContext === "fieldVal") actionModule = mFV;
    else if (keyModuleContext === "modelMutate") actionModule = mMM;
    else if (keyModuleContext === "modelVal") actionModule = mMV;
    else if (keyModuleContext === "requestVal") actionModule = mRV;
    else if (keyModuleContext === "structureHook") actionModule = mSH;
    else if (keyModuleContext === "structureProvider")
      actionModule = mSP as any; //provider es un modulo de accion especial
    else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${keyModuleContext} is not key action module context valid`,
      });
    }
    return actionModule;
  }
  /**encuentar el primer keypath que concuerde
   * con el extracto de keyPath que servira
   * para la busqueda
   *
   * @param keyPathExtract el estracto del keyPath
   * a buscar (se recomienda asignar un extracto lo
   * mas parecido al keyPath que se desea encontrar
   * en caso que existan dentro del modelo (o embebido)
   * varias propiedaes con el mismo nombre)
   *
   * @returns el primer keypath que concuerda con el
   * estracto, si no concuerda con ninguno retorna `undefined`
   */
  public findKeyPathByExtract(keyPathExtract: string): string {
    if (!this.util.isString(keyPathExtract)) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${keyPathExtract} is not extract of keypath valid`,
      });
    }
    const re = new RegExp(keyPathExtract);
    const aKeysPath = this.aKeysPath;
    const keyPath = aKeysPath.find((keyPath) => re.test(keyPath));
    return keyPath;
  }
  public override getDriverByName(name: string): Driver {
    const driversList = this.diccModuleInstanceContext.driversList;
    const dr = driversList.find((driver) => driver.nameLogicDriver === name);
    return dr;
  }
}
