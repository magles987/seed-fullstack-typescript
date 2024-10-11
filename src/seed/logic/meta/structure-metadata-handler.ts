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
  TStructureFieldMetaAndCtrl,
  TStructureMetaAndCtrl,
} from "./metadata-shared";
import {
  IDiccStructureModuleInstanceContext,
  Trf_TStructureMetadataModuleConfigForModel,
  Trf_IStructureMetadataModuleConfig,
  IStructureMetadataContext,
} from "./metadata-handler-shared";
import { Util_Meta } from "./_util-meta";
import { ELogicCodeError, LogicError } from "../errors/logic-error";
import {
  TKeyHandlerModule,
  TKeyModuleWithReport,
  TKeyStructureContextFull,
} from "../config/shared-modules";
import { TKeyStructureMetadataModuleContext } from "./metadata-handler-shared";
import {
  Trf_TFieldConfigForVal,
  Trf_TModelConfigForVal,
} from "../validators/shared";
import {
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
  Trf_TFieldConfigForCtrl,
  Trf_TModelConfigForCtrl,
} from "../controllers/_shared";
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
  TKeyDiccCtrlCRUD extends string = string
> extends LogicMetadataHandler {
  /** configuracion de valores predefinidos para el modulo*/
  public static override readonly getDefault = () => {
    const superDf = LogicMetadataHandler.getDefault();
    return {
      ...superDf,
      handlerConfig: {
        fieldMeta: {
          __keyPath: undefined,
          __structureType: "structureField",
          __fieldType: "string",
          __isArray: false,
          __isVirtual: false,
          __dfData: undefined, //❗ OBLIGATORIO en la definicion de cada metadato
          __keysProp: [],
          __emb: <any>{},
          __mutateConfig: {
            fieldMutate: {
              diccActionsConfig: {},
            },
          },
          __valConfig: {
            fieldVal: {
              diccActionsConfig: {},
            },
          },
          __ctrlConfig: {
            fieldCtrl: {
              aTKeysForReq: [],
            },
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
              diccActionsConfig: {},
            },
          },
          __valConfig: {
            modelVal: {
              diccActionsConfig: {},
            },
            requestVal: {
              diccActionsConfig: {},
            },
          },
          __hookConfig: {
            structureHook: {
              diccActionsConfig: {},
            },
          },
          __providerConfig: {
            structureProvider: {
              diccActionsConfig: {},
            },
          },
          __ctrlConfig: {
            modelCtrl: {
              diccATKeyCRUD: {},
            },
          },
        },
      } as IStructureMetadataContext<
        Trf_TStructureFieldFull,
        Trf_TStructureFull
      >,
    };
  };
  protected override get metadata(): TStructureFull<
    TModel,
    TFieldMutateInstance["dfDiccActionConfig"],
    TModelMutateInstance["dfDiccActionConfig"],
    TFieldValInstance["dfDiccActionConfig"],
    TModelValInstance["dfDiccActionConfig"],
    TRequestValInstance["dfDiccActionConfig"],
    TStructureHookInstance["dfDiccActionConfig"],
    TStructureProviderInstance["dfDiccActionConfig"],
    TKeyDiccCtrlCRUD
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
  public override get diccModuleIntanceContext(): IDiccStructureModuleInstanceContext<
    TFieldMutateInstance,
    TModelMutateInstance,
    TFieldValInstance,
    TModelValInstance,
    TRequestValInstance,
    TStructureHookInstance,
    TStructureProviderInstance
  > {
    return super.diccModuleIntanceContext as any;
  }
  /**... */
  private _aKeysPath: string[];
  /**array con todos los posibles keyPath del metadato */
  public get aKeysPath(): string[] {
    return [...this._aKeysPath]; //clonacion sencilla
  }
  protected override set diccModuleIntanceContext(
    dicc: IDiccStructureModuleInstanceContext
  ) {
    super.diccModuleIntanceContext = dicc;
  }
  /**
   * @param keySrc clave identificadora del recurso,
   * @param baseMetadata esquema base para construir los metadatos
   * @param diccModuleContextInstance (opcional) diccionario de instancias de modulos
   */
  constructor(
    keySrc: string,
    baseMetadata: TStructureFull<
      TModel,
      TFieldMutateInstance["dfDiccActionConfig"],
      TModelMutateInstance["dfDiccActionConfig"],
      TFieldValInstance["dfDiccActionConfig"],
      TModelValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TStructureHookInstance["dfDiccActionConfig"],
      TStructureProviderInstance["dfDiccActionConfig"],
      TKeyDiccCtrlCRUD
    >,
    diccModuleContextInstance?: IDiccStructureModuleInstanceContext
  ) {
    super("structure", keySrc);
    this.diccModuleIntanceContext = this.buildDiccModuleContextIntance(
      diccModuleContextInstance
    );
    this.metadata = this.buildMetadata(baseMetadata, undefined);
  }
  protected override getDefault() {
    return StructureLogicMetadataHandler.getDefault();
  }
  protected override buildDiccModuleContextIntance(
    diccMIContext: IDiccStructureModuleInstanceContext
  ): IDiccStructureModuleInstanceContext {
    let rDiccMIContext = {} as IDiccStructureModuleInstanceContext;
    const diccDf: IDiccStructureModuleInstanceContext = {
      fieldMutate: new FieldLogicMutater(this.keySrc),
      modelMutate: new ModelLogicMutater(this.keySrc),
      fieldVal: new FieldLogicValidation(this.keySrc),
      modelVal: new ModelLogicValidation(this.keySrc),
      requestVal: new RequestLogicValidation("structure", this.keySrc),
      structureHook: new StructureLogicHook(this.keySrc),
      structureProvider: new StructureLogicProvider(this.keySrc),
    };
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
      };
    }
    rDiccMIContext = this.injectThisHandlerIntoModuleInstance(rDiccMIContext);
    return rDiccMIContext;
  }
  protected override injectThisHandlerIntoModuleInstance(
    diccModuleInstContext: IDiccStructureModuleInstanceContext
  ): IDiccStructureModuleInstanceContext {
    diccModuleInstContext.fieldMutate.metadataHandler = this;
    diccModuleInstContext.modelMutate.metadataHandler = this;
    diccModuleInstContext.fieldVal.metadataHandler = this;
    diccModuleInstContext.modelVal.metadataHandler = this;
    diccModuleInstContext.requestVal.metadataHandler = this;
    diccModuleInstContext.structureHook.metadataHandler = this;
    diccModuleInstContext.structureProvider.metadataHandler = this;
    return diccModuleInstContext;
  }
  public override buildMetadata(
    newMetadata: Partial<Trf_TStructureFull>,
    currentMetadata?: Trf_TStructureFull
  ): Trf_TStructureFull {
    let metadata = this.buildStructureMetadata(
      "structureModel",
      newMetadata as Trf_TStructureFull,
      currentMetadata
    );
    this._aKeysPath = this.buildStructureAKeysPath(metadata);
    return metadata as any as Trf_TStructureFull;
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
        newMetadata.__emb = dfHC.fieldMeta.__emb;
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
          this.util.buildProgresiveKeyPath(
            progressiveKeyPath,
            keyLogicField as string
          )
        );
      }
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
          __keysProp: this.util.isLiteralObject(currentDfData)
            ? Object.keys(currentDfData)
            : cMHC.__keysProp,
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
          __P_Key: this.util.isString(mHC.__P_Key) ? mHC.__P_Key : keyLogic, //⚠Se usa la misma key en caso no no terner personalizacion
          __S_Key: this.util.isString(mHC.__S_Key) ? mHC.__S_Key : keyLogic, //⚠Se usa la misma key en caso no no terner personalizacion
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
    const {
      fieldMutate: fieldMutateInstance,
      modelMutate: modelMutateInstance,
    } = this.diccModuleIntanceContext;
    let rMetadataMutateC: unknown = {}; //de diferentes contextos
    if (keyModuleContext === "fieldMeta") {
      const mMC = metadataMutateC as Trf_TFieldConfigForMutate;
      const cMMC = (
        this.util.isObject(currentMetadataMutateC)
          ? {
            ...(currentMetadataMutateC as Trf_TFieldConfigForMutate),
            fieldMutate: this.util.isObject(
              (currentMetadataMutateC as Trf_TFieldConfigForMutate)
                .fieldMutate
            )
              ? {
                ...(currentMetadataMutateC as Trf_TFieldConfigForMutate)
                  .fieldMutate,
                diccActionsConfig: this.util.isObject(
                  (currentMetadataMutateC as Trf_TFieldConfigForMutate)
                    .fieldMutate.diccActionsConfig
                )
                  ? (currentMetadataMutateC as Trf_TFieldConfigForMutate)
                    .fieldMutate.diccActionsConfig
                  : fieldMutateInstance.dfDiccActionConfig,
              }
              : {
                diccActionsConfig: fieldMutateInstance.dfDiccActionConfig,
              },
          }
          : {
            fieldMutate: {
              diccActionsConfig: fieldMutateInstance.dfDiccActionConfig,
            },
          }
      ) as Trf_TFieldConfigForMutate;
      let rFieldConfig = {} as Trf_TFieldConfigForMutate;
      //😉 trampa `rebuildCustomConfigFromModuleContext` 
      //es protected pero se llama asi para saltarse la proteccion
      let reBuildFieldFn = fieldMutateInstance["rebuildCustomConfigFromModuleContext"];
      reBuildFieldFn = reBuildFieldFn.bind(fieldMutateInstance);
      if (!this.util.isObject(mMC)) {
        rFieldConfig = {
          ...cMMC,
          fieldMutate: reBuildFieldFn(
            cMMC.fieldMutate,
            undefined,
            "hard"
          )
        };
      } else {
        rFieldConfig = {
          ...mMC,
          fieldMutate: reBuildFieldFn(
            cMMC.fieldMutate,
            mMC.fieldMutate,
            (this.util.isObject(currentMetadataMutateC) ? "soft" : "hard")
          ),
        };
      }
      rMetadataMutateC = rFieldConfig;
    } else if (keyModuleContext === "modelMeta") {
      const mMC = metadataMutateC as Trf_TModelConfigForMutate;
      const cMMC = (
        this.util.isObject(currentMetadataMutateC)
          ? {
            ...(currentMetadataMutateC as Trf_TModelConfigForMutate),
            modelMutate: this.util.isObject(
              (currentMetadataMutateC as Trf_TModelConfigForMutate)
                .modelMutate
            )
              ? {
                ...(currentMetadataMutateC as Trf_TModelConfigForMutate)
                  .modelMutate,
                diccActionsConfig: this.util.isObject(
                  (currentMetadataMutateC as Trf_TModelConfigForMutate)
                    .modelMutate.diccActionsConfig
                )
                  ? (currentMetadataMutateC as Trf_TModelConfigForMutate)
                    .modelMutate.diccActionsConfig
                  : modelMutateInstance.dfDiccActionConfig,
              }
              : {
                diccActionsConfig: modelMutateInstance.dfDiccActionConfig,
              },
          }
          : {
            modelMutate: {
              diccActionsConfig: modelMutateInstance.dfDiccActionConfig,
            },
          }
      ) as Trf_TModelConfigForMutate;
      let rModelConfig = {} as Trf_TModelConfigForMutate;
      //😉 trampa `rebuildCustomConfigFromModuleContext` 
      //es protected pero se llama asi para saltarse la proteccion
      let reBuildModelFn = modelMutateInstance["rebuildCustomConfigFromModuleContext"];
      reBuildModelFn = reBuildModelFn.bind(modelMutateInstance);
      if (!this.util.isObject(mMC)) {
        rModelConfig = {
          ...cMMC,
          modelMutate: reBuildModelFn(
            cMMC.modelMutate,
            undefined,
            "hard"
          )
        };
      } else {
        rModelConfig = {
          ...mMC,
          modelMutate: reBuildModelFn(
            cMMC.modelMutate,
            mMC.modelMutate,
            (this.util.isObject(currentMetadataMutateC) ? "soft" : "hard")
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
    const {
      fieldVal: fieldValInstance,
      modelVal: modelValInstance,
      requestVal: requestValInstance,
    } = this.diccModuleIntanceContext;
    let rMetadataValC: unknown = {}; //de diferentes contextos
    if (keyModuleContext === "fieldMeta") {
      const mVC = metadataValC as Trf_TFieldConfigForVal;
      const cMVC = (
        this.util.isObject(currentMetadataValC)
          ? {
            ...(currentMetadataValC as Trf_TFieldConfigForVal),
            fieldVal: this.util.isObject(
              (currentMetadataValC as Trf_TFieldConfigForVal).fieldVal
            )
              ? {
                ...(currentMetadataValC as Trf_TFieldConfigForVal).fieldVal,
                diccActionsConfig: this.util.isObject(
                  (currentMetadataValC as Trf_TFieldConfigForVal).fieldVal
                    .diccActionsConfig
                )
                  ? (currentMetadataValC as Trf_TFieldConfigForVal).fieldVal
                    .diccActionsConfig
                  : fieldValInstance.dfDiccActionConfig,
              }
              : {
                diccActionsConfig: fieldValInstance.dfDiccActionConfig,
              },
          }
          : {
            fieldVal: {
              diccActionsConfig: fieldValInstance.dfDiccActionConfig,
            },
          }
      ) as Trf_TFieldConfigForVal;
      let rFieldConfig = {} as Trf_TFieldConfigForVal;
      //😉 trampa `rebuildCustomConfigFromModuleContext` 
      //es protected pero se llama asi para saltarse la proteccion
      let reBuildFieldFn = fieldValInstance["rebuildCustomConfigFromModuleContext"];
      reBuildFieldFn = reBuildFieldFn.bind(fieldValInstance);
      if (!this.util.isObject(mVC)) {
        rFieldConfig = {
          ...cMVC,
          fieldVal: reBuildFieldFn(
            cMVC.fieldVal,
            undefined,
            "hard"
          )
        };
      } else {
        rFieldConfig = {
          ...mVC,
          fieldVal: reBuildFieldFn(
            cMVC.fieldVal,
            mVC.fieldVal,
            (this.util.isObject(currentMetadataValC) ? "soft" : "hard")
          )
        };
      }
      rMetadataValC = rFieldConfig;
    } else if (keyModuleContext === "modelMeta") {
      const mVC = metadataValC as Trf_TModelConfigForVal;
      const cMVC = (
        this.util.isObject(currentMetadataValC)
          ? {
            ...(currentMetadataValC as Trf_TModelConfigForVal),
            modelVal: this.util.isObject(
              (currentMetadataValC as Trf_TModelConfigForVal).modelVal
            )
              ? {
                ...(currentMetadataValC as Trf_TModelConfigForVal).modelVal,
                diccActionsConfig: this.util.isObject(
                  (currentMetadataValC as Trf_TModelConfigForVal).modelVal
                    .diccActionsConfig
                )
                  ? (currentMetadataValC as Trf_TModelConfigForVal).modelVal
                    .diccActionsConfig
                  : modelValInstance.dfDiccActionConfig,
              }
              : {
                diccActionsConfig: modelValInstance.dfDiccActionConfig,
              },
            requestVal: this.util.isObject(
              (currentMetadataValC as Trf_TModelConfigForVal).requestVal
            )
              ? {
                ...(currentMetadataValC as Trf_TModelConfigForVal)
                  .requestVal,
                diccActionsConfig: this.util.isObject(
                  (currentMetadataValC as Trf_TModelConfigForVal).requestVal
                    .diccActionsConfig
                )
                  ? (currentMetadataValC as Trf_TModelConfigForVal)
                    .requestVal.diccActionsConfig
                  : requestValInstance.dfDiccActionConfig,
              }
              : {
                diccActionsConfig: requestValInstance.dfDiccActionConfig,
              },
          }
          : {
            modelVal: {
              diccActionsConfig: modelValInstance.dfDiccActionConfig,
            },
            requestVal: {
              diccActionsConfig: requestValInstance.dfDiccActionConfig,
            },
          }
      ) as Trf_TModelConfigForVal;
      let rModelConfig = {} as Trf_TModelConfigForVal;
      //😉 trampa `rebuildCustomConfigFromModuleContext` 
      //es protected pero se llama asi para saltarse la proteccion
      let reBuildModelFn = modelValInstance["rebuildCustomConfigFromModuleContext"];
      reBuildModelFn = reBuildModelFn.bind(modelValInstance);
      let reBuildRequestFn = requestValInstance["rebuildCustomConfigFromModuleContext"];
      reBuildRequestFn = reBuildRequestFn.bind(requestValInstance);
      if (!this.util.isObject(mVC)) {
        rModelConfig = {
          ...cMVC,
          modelVal: reBuildModelFn(
            cMVC.modelVal,
            undefined,
            "hard"
          ),
          requestVal: reBuildRequestFn(
            cMVC.requestVal,
            undefined,
            "hard"
          )
        };
      } else {
        rModelConfig = {
          ...mVC,
          modelVal: reBuildModelFn(
            cMVC.modelVal,
            mVC.modelVal,
            (this.util.isObject(currentMetadataValC) ? "soft" : "hard")
          ),
          requestVal: reBuildRequestFn(
            cMVC.requestVal,
            mVC.requestVal,
            (this.util.isObject(currentMetadataValC) ? "soft" : "hard")
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
    const { structureHook: structureHookInstance } =
      this.diccModuleIntanceContext;
    let rMetadataHookC: unknown = {};
    if (keyModuleContext === "modelMeta") {
      const mHC = metadataHookC as Trf_TStructureConfigForHook;
      const cMHC = (
        this.util.isObject(currentMetadataHookC)
          ? {
            ...(currentMetadataHookC as Trf_TStructureConfigForHook),
            structureHook: this.util.isObject(
              (currentMetadataHookC as Trf_TStructureConfigForHook)
                .structureHook
            )
              ? {
                ...(currentMetadataHookC as Trf_TStructureConfigForHook)
                  .structureHook,
                diccActionsConfig: this.util.isObject(
                  (currentMetadataHookC as Trf_TStructureConfigForHook)
                    .structureHook.diccActionsConfig
                )
                  ? (currentMetadataHookC as Trf_TStructureConfigForHook)
                    .structureHook.diccActionsConfig
                  : structureHookInstance.dfDiccActionConfig,
              }
              : {
                diccActionsConfig: structureHookInstance.dfDiccActionConfig,
              },
          }
          : {
            structureHook: {
              diccActionsConfig: structureHookInstance.dfDiccActionConfig,
            },
          }
      ) as Trf_TStructureConfigForHook;
      let rModelConfig = {} as Trf_TStructureConfigForHook;
      //😉 trampa `rebuildCustomConfigFromModuleContext` 
      //es protected pero se llama asi para saltarse la proteccion
      let reBuildStructureFn = structureHookInstance["rebuildCustomConfigFromModuleContext"];
      reBuildStructureFn = reBuildStructureFn.bind(structureHookInstance);
      if (!this.util.isObject(mHC)) {
        rModelConfig = {
          ...cMHC,
          structureHook: reBuildStructureFn(
            cMHC.structureHook,
            undefined,
            "hard"
          )
        };
      } else {
        rModelConfig = {
          ...mHC,
          structureHook: reBuildStructureFn(
            cMHC.structureHook,
            mHC.structureHook,
            (this.util.isObject(currentMetadataHookC) ? "soft" : "hard")
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
    const { structureProvider: structureProviderInstance } =
      this.diccModuleIntanceContext;
    let rMetadataProviderC: unknown = {};
    if (keyModuleContext === "modelMeta") {
      const mPC = metadataProviderC as Trf_TModelConfigForProvider;
      const cMPC = (
        this.util.isObject(currentMetadataProviderC)
          ? {
            ...(currentMetadataProviderC as Trf_TModelConfigForProvider),
            structureProvider: this.util.isObject(
              (currentMetadataProviderC as Trf_TModelConfigForProvider)
                .structureProvider
            )
              ? {
                ...(currentMetadataProviderC as Trf_TModelConfigForProvider)
                  .structureProvider,
                diccActionsConfig: this.util.isObject(
                  (currentMetadataProviderC as Trf_TModelConfigForProvider)
                    .structureProvider.diccActionsConfig
                )
                  ? (
                    currentMetadataProviderC as Trf_TModelConfigForProvider
                  ).structureProvider.diccActionsConfig
                  : structureProviderInstance.dfDiccActionConfig,
              }
              : {
                diccActionsConfig:
                  structureProviderInstance.dfDiccActionConfig,
              },
          }
          : {
            structureProvider: {
              diccActionsConfig: structureProviderInstance.dfDiccActionConfig,
            },
          }
      ) as Trf_TModelConfigForProvider;
      let rModelConfig = {} as Trf_TModelConfigForProvider;
      //😉 trampa `rebuildCustomConfigFromModuleContext` 
      //es protected pero se llama asi para saltarse la proteccion
      let reBuildStructureFn = structureProviderInstance["rebuildCustomConfigFromModuleContext"];
      reBuildStructureFn = reBuildStructureFn.bind(structureProviderInstance);
      if (!this.util.isObject(mPC)) {
        rModelConfig = {
          ...cMPC,
          structureProvider: reBuildStructureFn(
            cMPC.structureProvider,
            undefined,
            "hard"
          )
        };
      } else {
        rModelConfig = {
          ...mPC,
          structureProvider: reBuildStructureFn(
            cMPC.structureProvider,
            mPC.structureProvider,
            (this.util.isObject(currentMetadataProviderC) ? "soft" : "hard")
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
      const dfCC = df.fieldMeta.__ctrlConfig;
      const mCC = metadataCtrlC as Trf_TFieldConfigForCtrl;
      const cMCC = (
        this.util.isObject(currentMetadataCtrlC)
          ? {
            ...(currentMetadataCtrlC as Trf_TFieldConfigForCtrl),
            fieldCtrl: this.util.isObject(
              (currentMetadataCtrlC as Trf_TFieldConfigForCtrl).fieldCtrl
            )
              ? {
                ...(currentMetadataCtrlC as Trf_TFieldConfigForCtrl)
                  .fieldCtrl,
                aTKeysForReq: this.util.isArrayTuple(
                  (currentMetadataCtrlC as Trf_TFieldConfigForCtrl)
                    .fieldCtrl.aTKeysForReq,
                  2
                )
                  ? (currentMetadataCtrlC as Trf_TFieldConfigForCtrl)
                    .fieldCtrl.aTKeysForReq
                  : dfCC.fieldCtrl.aTKeysForReq,
              }
              : {
                aTKeysForReq: dfCC.fieldCtrl.aTKeysForReq,
              },
          }
          : {
            fieldCtrl: dfCC.fieldCtrl,
          }
      ) as Trf_TFieldConfigForCtrl;
      let rFieldConfig = {} as Trf_TFieldConfigForCtrl;
      if (!this.util.isObject(mCC)) {
        rFieldConfig = cMCC;
      } else {
        rFieldConfig = {
          ...mCC,
          fieldCtrl: this.util.isObject(mCC.fieldCtrl)
            ? {
              ...mCC.fieldCtrl,
              aTKeysForReq: this.util.isArrayTuple(
                mCC.fieldCtrl.aTKeysForReq,
                2
              )
                ? mCC.fieldCtrl.aTKeysForReq
                : cMCC.fieldCtrl.aTKeysForReq,
            }
            : cMCC.fieldCtrl,
        };
      }
      rMetadataCtrlC = rFieldConfig;
    } else if (keyModuleContext === "modelMeta") {
      const dfCC = df.modelMeta.__ctrlConfig;
      const mCC = metadataCtrlC as Trf_TModelConfigForCtrl;
      const cMCC = (
        this.util.isObject(currentMetadataCtrlC)
          ? {
            ...(currentMetadataCtrlC as Trf_TModelConfigForCtrl),
            modelCtrl: this.util.isObject(
              (currentMetadataCtrlC as Trf_TModelConfigForCtrl).modelCtrl
            )
              ? {
                ...(currentMetadataCtrlC as Trf_TModelConfigForCtrl)
                  .modelCtrl,
                diccATKeyCRUD: this.util.isObject(
                  (currentMetadataCtrlC as Trf_TModelConfigForCtrl)
                    .modelCtrl.diccATKeyCRUD
                )
                  ? (currentMetadataCtrlC as Trf_TModelConfigForCtrl)
                    .modelCtrl.diccATKeyCRUD
                  : dfCC.modelCtrl.diccATKeyCRUD,
              }
              : {
                diccATKeyCRUD: dfCC.modelCtrl.diccATKeyCRUD,
              },
          }
          : {
            modelCtrl: dfCC.modelCtrl,
          }
      ) as Trf_TModelConfigForCtrl;
      let rModelConfig = {} as Trf_TModelConfigForCtrl;
      if (!this.util.isObject(mCC)) {
        rModelConfig = cMCC;
      } else {
        rModelConfig = {
          ...mCC,
          modelCtrl: this.util.isObject(mCC.modelCtrl)
            ? {
              ...mCC.modelCtrl,
              diccATKeyCRUD: this.util.isObject(mCC.modelCtrl.diccATKeyCRUD)
                ? mCC.modelCtrl.diccATKeyCRUD
                : cMCC.modelCtrl.diccATKeyCRUD,
            }
            : cMCC.modelCtrl,
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
          addKeysPathFn(mtProp.__emb); //push interno recursivo
        }
      }
    };
    addKeysPathFn(metadata);
    return aKeysPath;
  }
  //====Metodos de obtencion de metadatos============================================================================================================================
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
    const util = Util_Meta.getInstance();
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
  ): TStructureFieldFull<
    TFieldMutateInstance["dfDiccActionConfig"],
    TFieldValInstance["dfDiccActionConfig"]
  >;
  public getExtractMetadataByStructureContext<
    TIDiccEmbFieldMutateAC = TFieldMutateInstance["dfDiccActionConfig"],
    TIDiccEmbFieldValAC = TFieldValInstance["dfDiccActionConfig"],
    TEmbEmbModel = unknown,
    TIDiccEmbEmbFieldMutateAC = TFieldMutateInstance["dfDiccActionConfig"],
    TIDiccEmbEmbModelMutateAC = TModelMutateInstance["dfDiccActionConfig"],
    TIDiccEmbEmbFieldValAC = TFieldValInstance["dfDiccActionConfig"],
    TIDiccEmbEmbModelValAC = TModelValInstance["dfDiccActionConfig"]
  >(
    keyStructureContext: "structureField", //❕es el mismo pero para embebido❕
    keyPath: string
  ): TStructureFieldFull<
    TIDiccEmbFieldMutateAC,
    TIDiccEmbFieldValAC,
    TEmbEmbModel,
    TIDiccEmbEmbFieldMutateAC,
    TIDiccEmbEmbModelMutateAC,
    TIDiccEmbEmbFieldValAC,
    TIDiccEmbEmbModelValAC
  >;
  public getExtractMetadataByStructureContext<
    TEmbModel,
    TIDiccEmbFieldMutateAC = TFieldMutateInstance["dfDiccActionConfig"],
    TIDiccEmbModelMutateAC = TFieldMutateInstance["dfDiccActionConfig"],
    TIDiccEmbFieldValAC = TFieldValInstance["dfDiccActionConfig"],
    TIDiccEmbModelValAC = TFieldValInstance["dfDiccActionConfig"]
  //TIDiccEmbRequestValAC = TModelValInstance["dfDiccActionConfig"],
  //TIDiccEmbHookAC = TStructureHookInstance["dfDiccActionConfig"],
  //TIDiccEmbProviderAC = TStructureProviderInstance["dfDiccActionConfig"]
  >(
    keyStructureContext: "structureEmbedded",
    keyPath: string
  ): TStructureFull<
    TEmbModel,
    TIDiccEmbFieldMutateAC,
    TIDiccEmbModelMutateAC,
    TIDiccEmbFieldValAC,
    TIDiccEmbModelValAC
  //TIDiccEmbRequestValAC,
  //TIDiccEmbHookAC,
  //TIDiccEmbProviderAC
  >;
  public getExtractMetadataByStructureContext(
    keyStructureContext: "structureModel"
  ): TStructureFull<
    TModel,
    TFieldMutateInstance["dfDiccActionConfig"],
    TFieldMutateInstance["dfDiccActionConfig"],
    TFieldValInstance["dfDiccActionConfig"],
    TModelValInstance["dfDiccActionConfig"],
    TRequestValInstance["dfDiccActionConfig"],
    TStructureHookInstance["dfDiccActionConfig"],
    TStructureProviderInstance["dfDiccActionConfig"],
    TKeyDiccCtrlCRUD
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
    TIDiccEmbFieldMutateAC = TFieldMutateInstance["dfDiccActionConfig"]
  >(
    keyStructureContext: "structureField",
    keyModule: "mutater", //❗Solo para tipar el retorno❗
    keyPath: string
  ): TStructureFieldMetaAndMutater<TIDiccEmbFieldMutateAC>;
  public getExtractMetadataByModuleContext<
    TIDiccEmbFieldValAC = TFieldValInstance["dfDiccActionConfig"]
  >(
    keyStructureContext: "structureField",
    keyModule: "validator", //❗Solo para tipar el retorno❗
    keyPath: string
  ): TStructureFieldMetaAndValidator<TIDiccEmbFieldValAC>;
  public getExtractMetadataByModuleContext<
    TIDiccEmbFieldMutateAC = TFieldMutateInstance["dfDiccActionConfig"],
    TIDiccEmbFieldValAC = TFieldValInstance["dfDiccActionConfig"]
  >(
    keyStructureContext: "structureField",
    keyModule: "controller", //❗Solo para tipar el retorno❗
    keyPath: string
  ): TStructureFieldMetaAndCtrl<TIDiccEmbFieldMutateAC, TIDiccEmbFieldValAC>;
  public getExtractMetadataByModuleContext<TEmbModel>(
    keyStructureContext: "structureField",
    keyModule: "metadata", //❗Solo para tipar el retorno❗
    keyPath: string
  ): TStructureFieldMeta<TEmbModel>;
  public getExtractMetadataByModuleContext<
    TIDiccEmbFieldMutateAC = TFieldMutateInstance["dfDiccActionConfig"],
    TEmbEmbModel = unknown, //❗nivel aun mas profundo❗
    TIDiccEmbEmbFieldMutateAC = TFieldMutateInstance["dfDiccActionConfig"], //❗nivel aun mas profundo❗
    TIDiccEmbEmbModelMutateAC = TModelMutateInstance["dfDiccActionConfig"] //❗nivel aun mas profundo❗
  >(
    keyStructureContext: "structureField",
    keyModule: "mutater", //❗Solo para tipar el retorno❗
    keyPath: string
  ): TStructureFieldMetaAndMutater<
    TIDiccEmbFieldMutateAC,
    TEmbEmbModel,
    TIDiccEmbEmbFieldMutateAC,
    TIDiccEmbEmbModelMutateAC
  >;
  public getExtractMetadataByModuleContext<
    TIDiccEmbFieldValAC = TFieldValInstance["dfDiccActionConfig"],
    TEmbEmbModel = unknown, //❗nivel aun mas profundo❗
    TIDiccEmbEmbFieldValAC = TFieldValInstance["dfDiccActionConfig"], //❗nivel aun mas profundo❗
    TIDiccEmbEmbModelValAC = TModelValInstance["dfDiccActionConfig"] //❗nivel aun mas profundo❗
  //TIDiccEmbEmbRequestValAC = TRequestValInstance["dfDiccActionConfig"] //los embebidos no tienen request
  >(
    keyStructureContext: "structureField",
    keyModule: "validator", //❗Solo para tipar el retorno❗
    keyPath: string
  ): TStructureFieldMetaAndValidator<
    TIDiccEmbFieldValAC,
    TEmbEmbModel,
    TIDiccEmbEmbFieldValAC,
    TIDiccEmbEmbModelValAC
  >;
  public getExtractMetadataByModuleContext<
    TIDiccEmbFieldMutateAC = TFieldMutateInstance["dfDiccActionConfig"],
    TIDiccEmbFieValAC = TFieldValInstance["dfDiccActionConfig"],
    TEmbEmbModel = unknown, //❗nivel aun mas profundo❗
    TIDiccEmbEmbModelMutateAC = TModelMutateInstance["dfDiccActionConfig"], //❗nivel aun mas profundo❗
    TIDiccEmbEmbModelValAC = TModelValInstance["dfDiccActionConfig"] //❗nivel aun mas profundo❗
  >(
    keyStructureContext: "structureField",
    keyModule: "controller", //❗Solo para tipar el retorno❗
    keyPath: string
  ): TStructureFieldMetaAndCtrl<
    TIDiccEmbFieldMutateAC,
    TIDiccEmbFieValAC,
    TEmbEmbModel,
    TIDiccEmbEmbModelMutateAC,
    TIDiccEmbEmbModelValAC
  >;
  public getExtractMetadataByModuleContext<TEmbModel>(
    keyStructureContext: "structureEmbedded",
    keyModule: "metadata", //❗Solo para tipar el retorno❗
    keyPath: string
  ): TStructureMeta<TEmbModel>;
  public getExtractMetadataByModuleContext<
    TEmbModel,
    TIDiccEmbFieldMutateAC = TFieldMutateInstance["dfDiccActionConfig"],
    TIDiccEmbModelMutateAC = TModelMutateInstance["dfDiccActionConfig"]
  >(
    keyStructureContext: "structureEmbedded",
    keyModule: "mutater", //❗Solo para tipar el retorno❗
    keyPath: string
  ): TStructureMetaAndMutater<
    TEmbModel,
    TIDiccEmbFieldMutateAC,
    TIDiccEmbModelMutateAC
  >;
  public getExtractMetadataByModuleContext<
    TEmbModel,
    TIDiccEmbFieldValAC = TFieldValInstance["dfDiccActionConfig"],
    TIDiccEmbModelValAC = TModelValInstance["dfDiccActionConfig"],
    TIDiccEmbRequestValAC = TRequestValInstance["dfDiccActionConfig"]
  >(
    keyStructureContext: "structureEmbedded",
    keyModule: "validator", //❗Solo para tipar el retorno❗
    keyPath: string
  ): TStructureMetaAndValidator<
    TEmbModel,
    TIDiccEmbFieldValAC,
    TIDiccEmbModelValAC,
    TIDiccEmbRequestValAC
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
  // public getExtractMetadataByModuleContext<
  //   TEmbModel,
  //   TIDiccEmbModelMutateAC = TModelMutateInstance["dfDiccActionConfig"],
  //   TIDiccEmbModelValAC = TModelValInstance["dfDiccActionConfig"],
  // >(
  //   keyStructureContext: "structureEmbedded",
  //   keyModule: "controller", //❗Solo para tipar el retorno❗
  //   keyPath: string
  // ): TStructureMetaAndCtrl<
  //   TEmbModel,
  //   TIDiccEmbModelMutateAC,
  //   TIDiccEmbModelValAC
  // >;
  public getExtractMetadataByModuleContext(
    keyStructureContext: "structureModel",
    keyModule: "metadata" //❗Solo para tipar el retorno❗
  ): TStructureMeta<TModel>;
  public getExtractMetadataByModuleContext(
    keyStructureContext: "structureModel",
    keyModule: "mutater" //❗Solo para tipar el retorno❗
  ): TStructureMetaAndMutater<
    TModel,
    TFieldMutateInstance["dfDiccActionConfig"],
    TModelMutateInstance["dfDiccActionConfig"]
  >;
  public getExtractMetadataByModuleContext(
    keyStructureContext: "structureModel",
    keyModule: "validator" //❗Solo para tipar el retorno❗
  ): TStructureMetaAndValidator<
    TModel,
    TFieldValInstance["dfDiccActionConfig"],
    TModelValInstance["dfDiccActionConfig"],
    TRequestValInstance["dfDiccActionConfig"]
  >;
  public getExtractMetadataByModuleContext(
    keyStructureContext: "structureModel",
    keyModule: "hook" //❗Solo para tipar el retorno❗
  ): TStructureMetaAndHook<
    TModel,
    TStructureHookInstance["dfDiccActionConfig"]
  >;
  public getExtractMetadataByModuleContext(
    keyStructureContext: "structureModel",
    keyModule: "provider" //❗Solo para tipar el retorno❗
  ): TStructureMetaAndProvider<
    TModel,
    TStructureProviderInstance["dfDiccActionConfig"]
  >;
  public getExtractMetadataByModuleContext(
    keyStructureContext: "structureModel",
    keyModule: "controller" //❗Solo para tipar el retorno❗
  ): TStructureMetaAndCtrl<
    TModel,
    TModelMutateInstance["dfDiccActionConfig"],
    TModelValInstance["dfDiccActionConfig"],
    TRequestValInstance["dfDiccActionConfig"],
    TStructureHookInstance["dfDiccActionConfig"],
    TStructureProviderInstance["dfDiccActionConfig"],
    TKeyDiccCtrlCRUD
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
    TIDiccEmbFieldMutateAC = TFieldMutateInstance["dfDiccActionConfig"],
    TIDiccEmbFieldValAC = TFieldValInstance["dfDiccActionConfig"],
    TEmbEmbModel = unknown
  >(
    keyStructureContext: "structureEmbedded",
    keyModule: "controller",
    keyPath: string
  ): Record<
    keyof TEmbEmbModel,
    TStructureFieldMetaAndCtrl<
      TIDiccEmbFieldMutateAC,
      TIDiccEmbFieldValAC,
      TEmbEmbModel
    >
  >;
  public getExtractMetadataStructureOnlyField<TEmbModel>(
    keyStructureContext: "structureEmbedded",
    keyModule: "metadata",
    keyPath: string
  ): Record<keyof TEmbModel, TStructureFieldMeta<TEmbModel>>;
  public getExtractMetadataStructureOnlyField<
    TIDiccEmbFieldMutateAC = TFieldMutateInstance["dfDiccActionConfig"],
    TIDiccEmbFieldValAC = TFieldValInstance["dfDiccActionConfig"],
    TEmbEmbModel = unknown
  >(
    keyStructureContext: "structureEmbedded",
    keyModule: "mutater",
    keyPath: string
  ): Record<
    keyof TEmbEmbModel,
    TStructureFieldMetaAndCtrl<
      TIDiccEmbFieldMutateAC,
      TIDiccEmbFieldValAC,
      TEmbEmbModel
    >
  >;
  public getExtractMetadataStructureOnlyField<
    TIDiccEmbFieldMutateAC = TFieldMutateInstance["dfDiccActionConfig"],
    TIDiccEmbFieldValAC = TFieldValInstance["dfDiccActionConfig"],
    TEmbEmbModel = unknown
  >(
    keyStructureContext: "structureEmbedded",
    keyModule: "validator",
    keyPath: string
  ): Record<
    keyof TEmbEmbModel,
    TStructureFieldMetaAndCtrl<
      TIDiccEmbFieldMutateAC,
      TIDiccEmbFieldValAC,
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
    TStructureFieldMetaAndCtrl<
      TFieldMutateInstance["dfDiccActionConfig"],
      TFieldValInstance["dfDiccActionConfig"]
    >
  >;
  public getExtractMetadataStructureOnlyField(
    keyStructureContext: "structureModel",
    keyModule: "metadata"
  ): Record<keyof TModel, TStructureFieldMeta<any>>;
  public getExtractMetadataStructureOnlyField(
    keyStructureContext: "structureModel",
    keyModule: "mutater"
  ): Record<
    keyof TModel,
    TStructureFieldMetaAndMutater<
      TFieldMutateInstance["dfDiccActionConfig"],
      TFieldValInstance["dfDiccActionConfig"]
    >
  >;
  public getExtractMetadataStructureOnlyField(
    keyStructureContext: "structureModel",
    keyModule: "validator"
  ): Record<
    keyof TModel,
    TStructureFieldMetaAndValidator<
      TFieldMutateInstance["dfDiccActionConfig"],
      TFieldValInstance["dfDiccActionConfig"]
    >
  >;
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
    const util = Util_Meta.getInstance();
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
  /**????? */
  public static selectOnlyFieldDicc(baseMetadata: Trf_TStructureMeta) {
    const util = Util_Meta.getInstance();
    if (!util.isObject(baseMetadata)) {
      throw new LogicError({
        code: ELogicCodeError.NOT_EXIST,
        msn: `${baseMetadata} does not exist`,
      });
    }
    let onlyField: object;
    if (!util.isObject(baseMetadata.__dfData)) {
      //no selecciona
      onlyField = util.selectOnlyProperties<object>(baseMetadata);
    } else {
      //la seleccion se hace en base al mayor numero de campos
      const op1 = util.selectOnlyProperties<object>(baseMetadata);
      const op2 = util.selectOnlyProperties<object>(baseMetadata.__dfData);
      const lOp1 = Object.keys(op1).length;
      const lOp2 = Object.keys(op2).length;
      onlyField = lOp1 > lOp2 ? op1 : op2;
    }
    return onlyField;
  }
}
