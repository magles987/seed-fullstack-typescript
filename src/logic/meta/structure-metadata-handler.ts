import {
  TFieldCtrlBaseConfig,
  IStructureCtrlContextInstance,
  TModelCtrlBaseConfig,
  TKeyStructureDeepCtrlModuleContext,
} from "../controllers/shared-types";
import { StructureLogicController } from "../controllers/structure-ctrl";
import { LogicError, ELogicCodeError } from "../errors/logic-error";
import { IStructureHookContextInstance } from "../hooks/shared-types";
import { StructureLogicHook } from "../hooks/structure-hook";
import { TwinBeeModule } from "../modules/module";
import {
  TKeyStructureContextFull,
  TKeyActionModule,
  TKeyHandlerModule,
} from "../modules/shared-types";
import { FieldLogicMutater } from "../mutaters/field-mutater";
import { ModelLogicMutater } from "../mutaters/model-mutater";
import {
  IStructureMutateContextInstance,
  TKeyStructureDeepMutateModuleContext,
} from "../mutaters/shared-types";
import { IStructureProviderContextInstance } from "../providers/shared-types";
import { StructureLogicProvider } from "../providers/structure-provider";
import { TSchemaNotFunction } from "../util/util-twinbee-interface";
import { FieldLogicValidation } from "../validators/field-validation";
import { ModelLogicValidation } from "../validators/model-validation";
import { RequestLogicValidation } from "../validators/request-validation";
import {
  IStructureValContextInstance,
  TKeyStructureDeepValModuleContext,
} from "../validators/shared-types";
import { LogicMetadataHandler } from "./_metadata-handler";
import {
  TStructureBaseMetadataForField,
  TStructureBaseMetadata,
} from "./base-shared-types";
import {
  TStructureFull,
  TStructureFieldMeta,
  TStructureMeta,
  TStructureFieldFull,
  TStructureFieldMetaAndMutater,
  TStructureFieldMetaAndValidator,
  TStructureFieldMetaAndHook,
  TStructureFieldMetaAndCtrl,
  TStructureMetaAndMutater,
  TStructureMetaAndValidator,
  TStructureMetaAndCtrl,
  TStructureMetaAndRequestVal,
  TStructureMetaAndHook,
  TStructureMetaAndProvider,
  TKeyStructureInternalACModuleContext,
} from "./schema-shared-types";
import {
  Trf_TStructureMetadataModuleConfigForModel,
  IStructureMetadataModuleConfig,
  TKeyStructureMetadataModuleContext,
} from "./shared-types";

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
  TKeyDiccActionRequest extends string = string,
  TStructureCtrlInstance extends StructureLogicController<
    TModel,
    TFieldMutateInstance,
    TModelMutateInstance,
    TFieldValInstance,
    TModelValInstance,
    TRequestValInstance,
    TStructureHookInstance,
    TStructureProviderInstance,
    TKeyDiccActionRequest
  > = StructureLogicController<
    TModel,
    TFieldMutateInstance,
    TModelMutateInstance,
    TFieldValInstance,
    TModelValInstance,
    TRequestValInstance,
    TStructureHookInstance,
    TStructureProviderInstance,
    TKeyDiccActionRequest
  >
> extends LogicMetadataHandler {
  /** configuración de valores predefinidos para el modulo*/
  public static override readonly getDefault = () => {
    const superDf = LogicMetadataHandler.getDefault();
    const util = TwinBeeModule.util;
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
          __dfData: util.dfValue, //❗ OBLIGATORIO en la definición de cada metadato
          __keysProp: [],
          __emb: <any>{},
          __mutateInstance: undefined,
          __valInstance: undefined,
          __ctrlInstance: undefined,
        },
        modelMeta: {
          __keyPath: undefined,
          __structureType: "structureModel",
          __keyInstance: undefined,
          __dfData: util.dfValue, //❗ OBLIGATORIO en la definición de cada metadato
          __S_Key: undefined,
          __P_Key: undefined,
          __keysProp: [],
          __mutateInstance: undefined,
          __valInstance: undefined,
          __requestValInstance: undefined,
          __hookInstance: undefined,
          __providerInstance: undefined,
          __ctrlInstance: undefined,
        },
      } as IStructureMetadataModuleConfig<any>,
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
  protected override set metadata(v: TStructureFull<any>) {
    super.metadata = v;
  }
  /**la keypath inicial (correspondiente a este modelo)*/
  public get keyModelPath(): string {
    return this.metadata.__keyPath;
  }
  /**... */
  private _aKeysPath: string[] = [];
  /**array con todos los posibles keyPath del metadato */
  public get aKeysPath(): string[] {
    return [...this._aKeysPath]; //clonacion sencilla
  }
  /**buffer que almacena parcialmente la base de metadatos*/
  private bf_baseFieldMetadata: TStructureBaseMetadataForField<any> = undefined;
  private bf_baseEmbModelMetadata: TStructureBaseMetadata<any> = undefined;
  private bf_baseModelMetadata: TStructureBaseMetadata<any> = undefined;
  /**
   * @param baseConfig configuración de metadatos inicial
   * - `keySrc` : clave identificadora del recurso,
   * - `baseMeta` : esquema base para construir los metadatos
   */
  constructor(baseConfig: {
    keySrc: string;
    baseMeta: TStructureBaseMetadata<
      TModel,
      TFieldMutateInstance,
      TModelMutateInstance,
      TFieldValInstance,
      TModelValInstance,
      TRequestValInstance,
      TStructureHookInstance,
      TStructureProviderInstance
    >;
  }) {
    super("structure", baseConfig.keySrc);
    this.metadata = this.buildMetadata(baseConfig.baseMeta as any);
  }
  protected override getDefault() {
    return StructureLogicMetadataHandler.getDefault();
  }
  protected override buildMetadata(
    newMetadata: TStructureBaseMetadata<TModel>
  ): TStructureFull<TModel> {
    let metadata = this.buildStructureMetadata(
      "structureModel",
      newMetadata as any
    ) as any as TStructureFull<TModel>;
    //this._aKeysPath = this.buildStructureAKeysPath(metadata as any);
    this.cleanBf();
    return metadata;
  }
  /**... */
  private cleanBf(): void {
    this.bf_baseFieldMetadata = undefined;
    this.bf_baseEmbModelMetadata = undefined;
    this.bf_baseModelMetadata = undefined;
    return;
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
    newFieldMetadata: TStructureFieldMeta<any>,
    progressiveKeyPath: string
  ): TStructureFieldMeta<any>;
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
    newEmbModelMetadata: TStructureMeta<TModel>,
    progressiveKeyPath: string
  ): TStructureMeta<TModel>;
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
    newModelMetadata: TStructureMeta<TModel>
  ): TStructureMeta<TModel>;
  private buildStructureMetadata(
    keyStructureContext: TKeyStructureContextFull,
    newMetadata: TStructureMeta<TModel> | TStructureFieldMeta<any>,
    progressiveKeyPath?: string
  ): TStructureMeta<TModel> | TStructureFieldMeta<any> {
    const dfHC = this.getDefault().handlerConfig;
    if (keyStructureContext === "structureField") {
      const nFM = newMetadata as TStructureFieldMeta<any>;
      newMetadata = this.buildMetadataHandlerConfig(
        "fieldMeta",
        nFM,
        progressiveKeyPath
      ) as TStructureFieldMeta<any>;
      //actualizar el path progresivo de acuerdo a la ultima verificación
      this.addkeyPathByContext(keyStructureContext, progressiveKeyPath);
      //❕asignación parcial de metadatos para uso interno en contextos de embebidos
      this.bf_baseFieldMetadata = newMetadata as any;
      if (!this.util.isObject(nFM.__emb)) {
        const nEmbM = nFM.__emb;
        //actualizar el path progresivo de acuerdo a la ultima verificacion
        progressiveKeyPath = newMetadata.__keyPath;
        newMetadata.__emb = this.buildStructureMetadata(
          "structureEmbedded",
          nEmbM as any,
          progressiveKeyPath
        );
      } else {
        newMetadata.__emb = dfHC.fieldMeta.__emb as any;
      }
    } else if (keyStructureContext === "structureEmbedded") {
      let nEmbM = newMetadata as TStructureMeta<TModel>;
      if (this.util.isInstance(nEmbM)) {
        //verificar si es un manejador de metadatos ya instanciado
        nEmbM = (nEmbM as any as StructureLogicMetadataHandler<any>)[
          "metadata"
        ] as any; //❗la propiedad es protegida pero la hackeo 🐱‍👤❗
      }
      newMetadata = this.buildMetadataHandlerConfig(
        "modelMeta",
        nEmbM,
        progressiveKeyPath
      ) as TStructureMeta<TModel>;
      //actualizar el path progresivo de acuerdo a la ultima verificación
      progressiveKeyPath = newMetadata.__keyPath;
      this.addkeyPathByContext(keyStructureContext, progressiveKeyPath);
      //❕asignación parcial de metadatos para uso interno en contextos de campos❕
      this.bf_baseEmbModelMetadata = newMetadata as any;
      for (const keyLogicField of newMetadata.__keysProp) {
        const f_nM = newMetadata[keyLogicField];
        newMetadata[keyLogicField] = this.buildStructureMetadata(
          "structureField",
          f_nM as any,
          this.util.buildPath([progressiveKeyPath, keyLogicField as string])
        ) as any;
      }
    } else if (keyStructureContext === "structureModel") {
      const nM = newMetadata as TStructureMeta<TModel>;
      newMetadata = this.buildMetadataHandlerConfig(
        "modelMeta",
        nM,
        progressiveKeyPath
      ) as TStructureMeta<TModel>;
      //actualizar el path progresivo de acuerdo a la ultima verificación
      progressiveKeyPath = newMetadata.__keyPath;
      this.addkeyPathByContext(keyStructureContext, progressiveKeyPath);
      //❕asignación parcial de metadatos para uso interno en contextos de campos❕
      this.bf_baseModelMetadata = newMetadata as any;
      for (const keyLogicField of newMetadata.__keysProp) {
        const f_nM = newMetadata[keyLogicField];
        newMetadata[keyLogicField] = this.buildStructureMetadata(
          "structureField",
          f_nM as any,
          this.util.buildPath([progressiveKeyPath, keyLogicField as string])
        ) as any;
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
    metadataHC: TStructureFieldMeta<any>,
    progressiveKeyPath: string //permitirá extraer el keyField
  ): TStructureFieldMeta<any>;
  private buildMetadataHandlerConfig(
    keyModuleContext: "modelMeta",
    metadataHC: TStructureMeta<TModel>,
    progressiveKeyPath?: string //si se recibe indica que es un embebido
  ): TStructureMeta<TModel>;
  private buildMetadataHandlerConfig(
    keyModuleContext: TKeyStructureMetadataModuleContext,
    metadataHC: unknown,
    progressiveKeyPath?: string
  ): unknown {
    const sp = this.util.charSeparatorLogicPath;
    const dfHC = this.getDefault().handlerConfig;
    if (keyModuleContext === "fieldMeta") {
      const mHC = metadataHC as TStructureFieldFull;
      if (!this.util.isObject(mHC)) {
        //❗❗❗No debería entrar aquí, la configuración
        // de metadatos no puede ser totalmente predefinida❗❗❗
        metadataHC = dfHC.fieldMeta;
      } else {
        const dfData = this.buildDfData(keyModuleContext, mHC.__dfData);
        //construir configuración general
        metadataHC = {
          ...mHC, // garantiza otras propiedades adiccionales
          __keyPath: progressiveKeyPath,
          __keysProp: this.util.isLiteralObject(dfData)
            ? Object.keys(dfData)
            : dfHC.fieldMeta.__keysProp,
          __structureType: "structureField",
          __fieldType: this.util.isString(mHC.__fieldType)
            ? mHC.__fieldType
            : dfHC.fieldMeta.__fieldType,
          __isArray: this.util.isBoolean(mHC.__isArray)
            ? mHC.__isArray
            : dfHC.fieldMeta.__isArray,
          __isVirtual: this.util.isBoolean(mHC.__isVirtual)
            ? mHC.__isVirtual
            : dfHC.fieldMeta.__isVirtual,
          __dfData: dfData,
          __mutateInstance: this.buildMutateInstance(
            "fieldMeta",
            mHC.__mutateInstance
          ) as any,
          __valInstance: this.buildValInstance(
            "fieldMeta",
            mHC.__valInstance
          ) as any,
          __hookInstance: this.buildHookInstance(
            "fieldMeta",
            mHC.__hookInstance
          ),
          __ctrlInstance: this.buildMCtrlInstance(
            "fieldMeta",
            mHC.__ctrlInstance as any,
            progressiveKeyPath
          ),
        } as TStructureFieldFull;
      }
    } else if (keyModuleContext === "modelMeta") {
      const mHC = metadataHC as TStructureFull<TModel>;
      if (!this.util.isObject(mHC)) {
        //❗❗❗No debería entrar aquí, la configuración
        // de metadatos no puede ser totalmente predefinida❗❗❗
        metadataHC = dfHC.modelMeta;
      } else {
        let keyLogic: string;
        let structureType: Extract<
          TKeyStructureContextFull,
          "structureEmbedded" | "structureModel"
        >;
        //verificar la instancia predefinida
        const dfData = this.buildDfData(keyModuleContext, mHC.__dfData);
        //verificar keyLogic y el tipo de estructura de los metadatos
        if (!this.util.isString(progressiveKeyPath)) {
          if (this.util.isInstance(dfData)) {
            keyLogic = this.util.getClassName(dfData);
          } else {
            keyLogic = this.keySrc;
          }
          progressiveKeyPath = keyLogic;
          structureType = "structureModel";
        } else {
          keyLogic = progressiveKeyPath.split(sp).slice(-1)[0];
          structureType = "structureEmbedded";
        }
        //construir configuración general
        metadataHC = {
          ...mHC, // garantiza otras propiedades adicionales
          __keyPath: progressiveKeyPath,
          __structureType: structureType,
          __dfData: dfData,
          __keyInstance: keyLogic,
          __keysProp: Object.keys(dfData).filter(
            (k) => !this.util.isFunction(dfData[k])
          ),
          __P_Key: this.util.isString(mHC.__P_Key) ? mHC.__P_Key : keyLogic, //⚠Se usa la misma key en caso no tener personalizacion
          __S_Key: this.util.isString(mHC.__S_Key) ? mHC.__S_Key : keyLogic, //⚠Se usa la misma key en caso no tener personalizacion
          __mutateInstance: this.buildMutateInstance(
            "modelMeta",
            mHC.__mutateInstance
          ),
          __valInstance: this.buildValInstance("modelMeta", mHC.__valInstance),
          __requestValInstance: this.buildRequestValInstance(
            "modelMeta",
            mHC.__requestValInstance
          ),
          __hookInstance: this.buildHookInstance(
            "modelMeta",
            mHC.__hookInstance
          ),
          __providerInstance: this.buildProviderInstance(
            "modelMeta",
            mHC.__providerInstance
          ),
          __ctrlInstance: this.buildMCtrlInstance(
            "modelMeta",
            mHC.__ctrlInstance,
            progressiveKeyPath
          ),
        } as TStructureFull<any>;
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
    newDfData: any
  ): any {
    const dfHC = this.getDefault().handlerConfig;
    let dfData;
    if (keyModuleContext === "fieldMeta") {
      dfData = newDfData !== undefined ? newDfData : dfHC.fieldMeta.__dfData;
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
        : dfHC.modelMeta.__dfData;
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
  private buildMutateInstance(
    keyModuleContext: "fieldMeta",
    metadataMutateC: IStructureMutateContextInstance["fieldMutate"]
  ): IStructureMutateContextInstance["fieldMutate"];
  private buildMutateInstance(
    keyModuleContext: "modelMeta",
    metadataMutateC: IStructureMutateContextInstance["modelMutate"]
  ): IStructureMutateContextInstance["modelMutate"];
  private buildMutateInstance(
    keyModuleContext: TKeyStructureMetadataModuleContext,
    metadataMutateC: unknown
  ): unknown {
    let rMetadataMutateC: unknown = {}; //de diferentes contextos
    if (keyModuleContext === "fieldMeta") {
      const buildFn = FieldLogicMutater["buildInstanceForMetadata"]; //❗Èl método es protegido pero lo hackeo 🐱‍👤❗
      const fC =
        metadataMutateC as IStructureMutateContextInstance["fieldMutate"];
      let rFieldConfig = buildFn(fC);
      //agregar contexto de manejador de metadata y al diccionario de instancias
      rFieldConfig.metadataHandler = this;
      rMetadataMutateC = rFieldConfig;
    } else if (keyModuleContext === "modelMeta") {
      const buildFn = ModelLogicMutater["buildInstanceForMetadata"]; //❗Èl método es protegido pero lo hackeo 🐱‍👤❗
      const mC =
        metadataMutateC as IStructureMutateContextInstance["modelMutate"];
      let rModelConfig = buildFn(mC);
      //agregar contexto de manejador de metadata y al diccionario de instancias
      rModelConfig.metadataHandler = this;
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
  private buildValInstance(
    keyModuleContext: "fieldMeta",
    metadataValC: IStructureValContextInstance["fieldVal"]
  ): IStructureValContextInstance["fieldVal"];
  private buildValInstance(
    keyModuleContext: "modelMeta",
    metadataValC: IStructureValContextInstance["modelVal"]
  ): IStructureValContextInstance["modelVal"];
  private buildValInstance(
    keyModuleContext: TKeyStructureMetadataModuleContext,
    metadataValC: unknown
  ): unknown {
    let rMetadataValC: unknown = {}; //de diferentes contextos
    if (keyModuleContext === "fieldMeta") {
      const buildFn = FieldLogicValidation["buildInstanceForMetadata"]; //❗Èl método es protegido pero lo hackeo 🐱‍👤❗
      const fC = metadataValC as IStructureValContextInstance["fieldVal"];
      let rFieldConfig = buildFn(fC);
      //agregar contexto de manejador de metadata
      rFieldConfig.metadataHandler = this;
      rMetadataValC = rFieldConfig;
    } else if (keyModuleContext === "modelMeta") {
      const buildFn = ModelLogicValidation["buildInstanceForMetadata"]; //❗Èl método es protegido pero lo hackeo 🐱‍👤❗
      const mC = metadataValC as IStructureValContextInstance["modelVal"];
      let rModelConfig = buildFn(mC);
      //agregar contexto de manejador de metadata
      rModelConfig.metadataHandler = this;
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
  // private buildMetadataForRequestValModule(
  //   keyModuleContext: "fieldMeta",
  //   metadataValC: IStructureValContextInstance["requestVal"]
  // ): IStructureValContextInstance["requestVal"];
  private buildRequestValInstance(
    keyModuleContext: "modelMeta",
    metadataValC: IStructureValContextInstance["requestVal"]
  ): IStructureValContextInstance["requestVal"];
  private buildRequestValInstance(
    keyModuleContext: TKeyStructureMetadataModuleContext,
    metadataValC: unknown
  ): unknown {
    let rMetadataValC: unknown = {}; //de diferentes contextos
    if (keyModuleContext === "modelMeta") {
      const buildFn = RequestLogicValidation["buildInstanceForMetadata"]; //❗Èl método es protegido pero lo hackeo 🐱‍👤❗
      const mC = metadataValC as IStructureValContextInstance["requestVal"];
      let rModelConfig = buildFn("structure", mC);
      //agregar contexto de manejador de metadata
      rModelConfig.metadataHandler = this;
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
  private buildHookInstance(
    keyModuleContext: "fieldMeta",
    metadataHookC: IStructureHookContextInstance["structureHook"]
  ): IStructureHookContextInstance["structureHook"];
  private buildHookInstance(
    keyModuleContext: "modelMeta",
    metadataHookC: IStructureHookContextInstance["structureHook"]
  ): IStructureHookContextInstance["structureHook"];
  private buildHookInstance(
    keyModuleContext: TKeyStructureMetadataModuleContext,
    metadataHookC: unknown
  ): unknown {
    let rMetadataHookC: unknown = {};
    if (keyModuleContext === "fieldMeta") {
      //⚠ Hook no tiene contexto field pero es necesario crear
      // instancias diferentes de StructureLogicHook para los campos ⚠
      const buildFn = StructureLogicHook["buildInstanceForMetadata"]; //❗Èl método es protegido pero lo hackeo 🐱‍👤❗
      const fC =
        metadataHookC as IStructureHookContextInstance["structureHook"];
      let rFieldConfig = buildFn(fC);
      //agregar contexto de manejador de metadata y al diccionario de instancias
      rFieldConfig.metadataHandler = this;
      rMetadataHookC = rFieldConfig;
    } else if (keyModuleContext === "modelMeta") {
      const buildFn = StructureLogicHook["buildInstanceForMetadata"]; //❗Èl método es protegido pero lo hackeo 🐱‍👤❗
      const mC =
        metadataHookC as IStructureHookContextInstance["structureHook"];
      let rModelConfig = buildFn(mC);
      //agregar contexto de manejador de metadata
      rModelConfig.metadataHandler = this;
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
  // metadataProviderC: IStructureProviderContextInstance["structureProvider"]
  //): IStructureProviderContextInstance["structureProvider"];
  private buildProviderInstance(
    handlerContext: "modelMeta",
    metadataProviderC: IStructureProviderContextInstance["structureProvider"]
  ): IStructureProviderContextInstance["structureProvider"];
  private buildProviderInstance(
    keyModuleContext: Extract<TKeyStructureMetadataModuleContext, "modelMeta">,
    metadataProviderC: unknown
  ): unknown {
    let rMetadataProviderC: unknown = {};
    if (keyModuleContext === "modelMeta") {
      const buildFn = StructureLogicProvider["buildInstanceForMetadata"]; //❗Èl método es protegido pero lo hackeo 🐱‍👤❗
      const mC =
        metadataProviderC as IStructureProviderContextInstance["structureProvider"];
      let rModelConfig = buildFn(mC);
      //agregar contexto de manejador de metadata
      rModelConfig.metadataHandler = this;
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
  private buildMCtrlInstance(
    keyModuleContext: "fieldMeta",
    metadataCtrlC: TFieldCtrlBaseConfig,
    progressiveKeyPath: string
  ): IStructureCtrlContextInstance<TModel>["structureCtrl"];
  private buildMCtrlInstance(
    keyModuleContext: "modelMeta",
    metadataCtrlC: IStructureCtrlContextInstance<TModel>["structureCtrl"],
    progressiveKeyPath: string
  ): IStructureCtrlContextInstance<TModel>["structureCtrl"];
  private buildMCtrlInstance(
    keyModuleContext: TKeyStructureMetadataModuleContext,
    metadataCtrlC: unknown,
    progressiveKeyPath: string
  ): unknown {
    let rMetadataCtrlC: unknown = {}; //de diferentes contextos
    if (keyModuleContext === "fieldMeta") {
      const keyLogic = this.util.getKeyLogicByKeyPath(progressiveKeyPath);
      let sBf_metadata: typeof this.bf_baseModelMetadata;
      sBf_metadata = this.util.isEmbeddedFieldFromKeyPath(progressiveKeyPath)
        ? this.bf_baseEmbModelMetadata
        : this.bf_baseModelMetadata;
      let rFieldConfig = sBf_metadata.__ctrlInstance;
      //garantizar instancia o crear y almacenar
      if (!this.util.isInstance(rFieldConfig)) {
        rFieldConfig = this.util.isObject(rFieldConfig)
          ? this.buildMCtrlInstance(
              "modelMeta",
              rFieldConfig as any,
              progressiveKeyPath
            )
          : this.buildMCtrlInstance("modelMeta", {} as any, progressiveKeyPath);
      }
      const newCRC = this.util.isObject(metadataCtrlC)
        ? (metadataCtrlC as TFieldCtrlBaseConfig).criteriaFieldRequestConfig
        : ({} as TFieldCtrlBaseConfig["criteriaFieldRequestConfig"]);
      rFieldConfig["criteriaFieldRequestConfig"] = newCRC; //❗la propiedad es protegida pero lo hackeo 🐱‍👤❗
      let preDiccCRC =
        {} as TModelCtrlBaseConfig<TModel>["diccCriteriaRequestConfig"];
      preDiccCRC[keyLogic] = rFieldConfig["criteriaFieldRequestConfig"];
      rFieldConfig["diccCriteriaFieldRequestConfig"] = preDiccCRC;
      (
        rFieldConfig as IStructureCtrlContextInstance<TModel>["structureCtrl"]
      ).metadataHandler = this;
      rMetadataCtrlC = rFieldConfig;
    } else if (keyModuleContext === "modelMeta") {
      const buildFn = StructureLogicController["buildInstanceForMetadata"]; //❗Èl método es protegido pero lo hackeo 🐱‍👤❗
      const mC =
        metadataCtrlC as IStructureCtrlContextInstance<TModel>["structureCtrl"];
      let rModelConfig = buildFn(mC as any);
      //agregar contexto de manejador de metadata y al diccionario de instancias
      rModelConfig.metadataHandler = this;
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
  private addkeyPathByContext(
    keyStructureContext: TKeyStructureContextFull,
    progressiveKeyPath: string
  ): void {
    if (keyStructureContext === "structureField") {
      this._aKeysPath.push(progressiveKeyPath);
    } else if (keyStructureContext === "structureEmbedded") {
      //❔No hace nada❔
    } else if (keyStructureContext === "structureModel") {
      this._aKeysPath.push(progressiveKeyPath);
    } else {
      throw new LogicError({
        code: ELogicCodeError.NOT_VALID,
        msn: `context structure = ${keyStructureContext} does not valid`,
      });
    }
  }
  //====Métodos de obtención de metadatos============================================================================================================================
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
    TFieldMutateInstance,
    TFieldValInstance,
    TStructureHookInstance,
    TStructureCtrlInstance
  >;
  public getExtractMetadataByStructureContext<
    TEmbFieldMutateInstance extends TFieldMutateInstance = TFieldMutateInstance,
    TEmbFieldValInstance extends TFieldValInstance = TFieldValInstance,
    TEmbStructureHookInstance extends TStructureHookInstance = TStructureHookInstance,
    TEmbStructureCtrlInstance extends StructureLogicController<
      any,
      TEmbFieldMutateInstance,
      any,
      TEmbFieldValInstance,
      any,
      any,
      TEmbStructureHookInstance,
      any
    > = StructureLogicController<
      any,
      TEmbFieldMutateInstance,
      any,
      TEmbFieldValInstance,
      any,
      any,
      TEmbStructureHookInstance,
      any
    >,
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
    TEmbStructureHookInstance,
    TEmbStructureCtrlInstance,
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
    TEmbModelValInstance extends TModelValInstance = TModelValInstance,
    // TEmbRequestValInstance extends TRequestValInstance = TRequestValInstance
    // TEmbStructureHookInstance extends TStructureHookInstance = TStructureHookInstance
    // TEmbStructureProviderInstance extends TStructureProviderInstance = TStructureProviderInstance
    TEmbStructureCtrlInstance extends StructureLogicController<
      TEmbModel,
      TEmbFieldMutateInstance,
      TEmbModelMutateInstance,
      TEmbFieldValInstance,
      TEmbModelValInstance,
      any,
      any,
      any
    > = StructureLogicController<
      TEmbModel,
      TEmbFieldMutateInstance,
      TEmbModelMutateInstance,
      TEmbFieldValInstance,
      TEmbModelValInstance,
      any,
      any,
      any
    >
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
    const keyEC: keyof IStructureMetadataModuleConfig<TModel>["fieldMeta"] =
      "__emb";
    let metadataSchema = this.metadata;
    const sp = this.util.charSeparatorLogicPath;
    const aPath = keyPath.split(sp);
    const lenAPath = aPath.length;
    for (let idx = 0; idx < lenAPath; idx++) {
      const key = aPath[idx];
      //posible procedencia de array
      if (this.util.isNumber(key, true)) continue; //ignorar profundidades en array
      if (keyStructureContext === "structureField") {
        if (idx === 0) continue; //el primero es la key del modelo raiz, se ignora
        //determinar si existe mayor profundidad
        if (idx > 1) {
          if (!this.util.isObject(metadataSchema[keyEC])) {
            throw new LogicError({
              code: ELogicCodeError.NOT_VALID,
              msn: `${metadataSchema} is not deep metadata field valid`,
            });
          }
          metadataSchema = metadataSchema[keyEC];
        }
        //agregar los metadatos correspondientes
        metadataSchema = metadataSchema[key];
        if (!this.util.isObject(metadataSchema)) {
          throw new LogicError({
            code: ELogicCodeError.NOT_VALID,
            msn: `${metadataSchema} is not deep metadata field valid`,
          });
          break;
        }
      } else if (keyStructureContext === "structureEmbedded") {
        //el primero es la key del modelo raiz, se ignora
        if (idx === 0) continue;
        if (
          !this.util.isObject(metadataSchema[key]) ||
          !this.util.isObject(metadataSchema[key][keyEC])
        ) {
          throw new LogicError({
            code: ELogicCodeError.NOT_VALID,
            msn: `${metadataSchema} is not embedded metadata model valid`,
          });
        }
        metadataSchema = metadataSchema[key][keyEC];
      } else if (keyStructureContext === "structureModel") {
        if (!this.util.isObject(metadataSchema)) {
          throw new LogicError({
            code: ELogicCodeError.NOT_VALID,
            msn: `${metadataSchema} is not metadata model valid`,
          });
        }
        //la raiz no puede tener niveles de profundidad (posible embebido)
        if (lenAPath > 1) {
          metadataSchema = this.getExtractMetadataByStructureContext(
            "structureEmbedded",
            keyPath
          ) as any;
        }
        break; //frene y devuelva el actual metadata
      } else {
        throw new LogicError({
          code: ELogicCodeError.NOT_VALID,
          msn: `${keyStructureContext} does not valid context of selection`,
        });
      }
    }
    return metadataSchema;
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
    TEmbStructureHookInstance extends TStructureHookInstance = TStructureHookInstance
  >(
    keyStructureContext: "structureField",
    keyModule: "hook", //❗Solo para tipar el retorno❗
    keyPath: string
  ): TStructureFieldMetaAndHook<TEmbStructureHookInstance>;
  public getExtractMetadataByModuleContext<
    TEmbFieldMutateInstance extends TFieldMutateInstance = TFieldMutateInstance,
    TEmbFieldValInstance extends TFieldValInstance = TFieldValInstance,
    TEmbStructureHookInstance extends TStructureHookInstance = TStructureHookInstance
  >(
    keyStructureContext: "structureField",
    keyModule: "controller", //❗Solo para tipar el retorno❗
    keyPath: string
  ): TStructureFieldMetaAndCtrl<
    TEmbFieldMutateInstance,
    TEmbFieldValInstance,
    TEmbStructureHookInstance
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
    TEmbFieldMutateInstance extends TFieldMutateInstance = TFieldMutateInstance,
    TEmbModelMutateInstance extends TModelMutateInstance = TModelMutateInstance,
    TEmbFieldValInstance extends TFieldValInstance = TFieldValInstance,
    TEmbModelValInstance extends TModelValInstance = TModelValInstance,
    TEmbStructureHookInstance extends TStructureHookInstance = TStructureHookInstance,
    TEmbStructureCtrlInstance extends StructureLogicController<
      TEmbModel,
      TEmbFieldMutateInstance,
      TEmbModelMutateInstance,
      TEmbFieldValInstance,
      TEmbModelValInstance,
      any,
      TEmbStructureHookInstance,
      any
    > = StructureLogicController<
      TEmbModel,
      TEmbFieldMutateInstance,
      TEmbModelMutateInstance,
      TEmbFieldValInstance,
      TEmbModelValInstance,
      any,
      TEmbStructureHookInstance,
      any
    >
  >(
    keyStructureContext: "structureEmbedded",
    keyModule: "controller", //❗Solo para tipar el retorno❗
    keyPath: string
  ): TStructureMetaAndCtrl<
    TEmbModel,
    TEmbFieldMutateInstance,
    TEmbModelMutateInstance,
    TEmbFieldValInstance,
    TEmbModelValInstance,
    any,
    TEmbStructureHookInstance,
    any
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
  ): TStructureMetaAndValidator<TModel, TFieldValInstance, TModelValInstance> &
    TStructureMetaAndRequestVal<TModel, TRequestValInstance>;
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
    TFieldMutateInstance,
    TModelMutateInstance,
    TFieldValInstance,
    TModelValInstance,
    TRequestValInstance,
    TStructureHookInstance,
    TStructureProviderInstance,
    TKeyDiccActionRequest,
    TStructureCtrlInstance
  >;
  public getExtractMetadataByModuleContext(
    keyStructureContext: TKeyStructureContextFull,
    keyModule: TKeyActionModule | Extract<TKeyHandlerModule, "metadata">, //❗Solo para tipar el retorno❗
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
  public getInstanceModuleByModuleContext(
    keyStructureContext: "structureField",
    keyModule: "mutater",
    keyModuleContext: "fieldMutate",
    keyPath: string
  ): TFieldMutateInstance;
  public getInstanceModuleByModuleContext(
    keyStructureContext: "structureField",
    keyModule: "validator",
    keyModuleContext: "fieldVal",
    keyPath: string
  ): TFieldValInstance;
  public getInstanceModuleByModuleContext(
    keyStructureContext: "structureField",
    keyModule: "hook",
    keyModuleContext: undefined,
    keyPath: string
  ): TStructureHookInstance;
  public getInstanceModuleByModuleContext(
    keyStructureContext: "structureField",
    keyModule: "controller",
    keyModuleContext: undefined,
    keyPath: string
  ): TStructureCtrlInstance;
  public getInstanceModuleByModuleContext<
    TEmbFieldMutateInstance extends TFieldMutateInstance = TFieldMutateInstance
  >(
    keyStructureContext: "structureField",
    keyModule: "mutater",
    keyModuleContext: "fieldMutate",
    keyPath: string
  ): TEmbFieldMutateInstance;
  public getInstanceModuleByModuleContext<
    TEmbFieldValInstance extends TFieldValInstance = TFieldValInstance
  >(
    keyStructureContext: "structureField",
    keyModule: "validator",
    keyModuleContext: "fieldVal",
    keyPath: string
  ): TEmbFieldValInstance;
  public getInstanceModuleByModuleContext<
    TEmbStructureHookInstance extends TStructureHookInstance = TStructureHookInstance
  >(
    keyStructureContext: "structureField",
    keyModule: "hook",
    keyModuleContext: undefined,
    keyPath: string
  ): TEmbStructureHookInstance;
  public getInstanceModuleByModuleContext<
    TEmbStructureCtrlInstance extends TStructureCtrlInstance = TStructureCtrlInstance
  >(
    keyStructureContext: "structureField",
    keyModule: "controller",
    keyModuleContext: undefined,
    keyPath: string
  ): TEmbStructureCtrlInstance;
  public getInstanceModuleByModuleContext<
    TEmbModelMutateInstance extends TModelMutateInstance = TModelMutateInstance
  >(
    keyStructureContext: "structureEmbedded",
    keyModule: "mutater",
    keyModuleContext: "modelMutate",
    keyPath: string
  ): TEmbModelMutateInstance;
  public getInstanceModuleByModuleContext<
    TEmbModelValInstance extends TModelValInstance = TModelValInstance
  >(
    keyStructureContext: "structureEmbedded",
    keyModule: "validator",
    keyModuleContext: "modelVal",
    keyPath: string
  ): TEmbModelValInstance;
  public getInstanceModuleByModuleContext<
    TEmbStructureCtrlInstance extends TStructureCtrlInstance = TStructureCtrlInstance
  >(
    keyStructureContext: "structureEmbedded",
    keyModule: "controller",
    keyModuleContext: undefined,
    keyPath: string
  ): TEmbStructureCtrlInstance;
  public getInstanceModuleByModuleContext(
    keyStructureContext: "structureModel",
    keyModule: "mutater",
    keyModuleContext: "modelMutate"
  ): TModelMutateInstance;
  public getInstanceModuleByModuleContext(
    keyStructureContext: "structureModel",
    keyModule: "validator",
    keyModuleContext: "modelVal"
  ): TModelValInstance;
  public getInstanceModuleByModuleContext(
    keyStructureContext: "structureModel",
    keyModule: "validator",
    keyModuleContext: "requestVal"
  ): TRequestValInstance;
  public getInstanceModuleByModuleContext(
    keyStructureContext: "structureModel",
    keyModule: "hook"
  ): TStructureHookInstance;
  public getInstanceModuleByModuleContext(
    keyStructureContext: "structureModel",
    keyModule: "provider"
  ): TStructureProviderInstance;
  public getInstanceModuleByModuleContext(
    keyStructureContext: "structureModel",
    keyModule: "controller"
  ): TStructureCtrlInstance;
  public getInstanceModuleByModuleContext(
    keyStructureContext: TKeyStructureContextFull,
    keyModule: TKeyActionModule,
    keyModuleContext?:
      | TKeyStructureDeepMutateModuleContext
      | TKeyStructureDeepValModuleContext
      | TKeyStructureDeepCtrlModuleContext,
    keyPath = this.keySrc
  ): unknown {
    let rModuleInstance: unknown;
    if (keyStructureContext === "structureField") {
      if (keyModuleContext === "fieldMutate") {
        const metadataByModuleContext = this.getExtractMetadataByModuleContext(
          keyStructureContext,
          "mutater",
          keyPath
        );
        rModuleInstance = metadataByModuleContext.__mutateInstance;
      } else if (keyModuleContext === "fieldVal") {
        const metadataByModuleContext = this.getExtractMetadataByModuleContext(
          keyStructureContext,
          "validator",
          keyPath
        );
        rModuleInstance = metadataByModuleContext.__valInstance;
      } else if (keyModule === "hook") {
        const metadataByModuleContext = this.getExtractMetadataByModuleContext(
          keyStructureContext,
          "hook",
          keyPath
        );
        rModuleInstance = metadataByModuleContext.__hookInstance; // el mismo del padre (sea modelo o modelo embebido)
      } else if (keyModule === "controller") {
        const metadataByModuleContext = this.getExtractMetadataByModuleContext(
          keyStructureContext,
          "controller",
          keyPath
        );
        rModuleInstance = metadataByModuleContext.__ctrlInstance; // el mismo del padre (sea modelo o modelo embebido)
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
          rModuleInstance = metadataByModuleContext.__mutateInstance;
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
          rModuleInstance = metadataByModuleContext.__valInstance;
          // }else if(keyModuleContext === "requestVal"){
          //   const metadataByModuleContext = this.getExtractMetadataByModuleContext(
          //     keyStructureContext,
          //     keyModule,
          //     keyPath,
          //   );
          //   diccAC = metadataByModuleContext.__requestValInstance;
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
        rModuleInstance = metadataByModuleContext.__ctrlInstance;
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
          rModuleInstance = metadataByModuleContext.__mutateInstance;
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
              keyModule
            );
          rModuleInstance = metadataByModuleContext.__valInstance;
        } else if (keyModuleContext === "requestVal") {
          const metadataByModuleContext =
            this.getExtractMetadataByModuleContext(
              keyStructureContext,
              keyModule
            );
          rModuleInstance = metadataByModuleContext.__requestValInstance;
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
        rModuleInstance = metadataByModuleContext.__hookInstance;
      } else if (keyModule === "provider") {
        const metadataByModuleContext = this.getExtractMetadataByModuleContext(
          keyStructureContext,
          keyModule
        );
        rModuleInstance = metadataByModuleContext.__providerInstance;
      } else if (keyModule === "controller") {
        const metadataByModuleContext = this.getExtractMetadataByModuleContext(
          keyStructureContext,
          keyModule
        );
        rModuleInstance = metadataByModuleContext.__ctrlInstance;
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
    return rModuleInstance;
  }
  /**... */
  public getDiccActionConfigByModuleContext(
    keyStructureContext: "structureField",
    keyModule: "mutater",
    keyModuleContext: "fieldMutate",
    keyPath: string
  ): TModelMutateInstance["diccActionConfig"];
  public getDiccActionConfigByModuleContext(
    keyStructureContext: "structureField",
    keyModule: "validator",
    keyModuleContext: "fieldVal",
    keyPath: string
  ): TModelMutateInstance["diccActionConfig"];
  public getDiccActionConfigByModuleContext(
    keyStructureContext: "structureField",
    keyModule: "controller",
    keyModuleContext: "fieldCtrl",
    keyPath: string
  ): TStructureCtrlInstance["criteriaFieldRequestConfig"];
  public getDiccActionConfigByModuleContext<
    TIDiccEmbFieldMutateAC extends TFieldMutateInstance["diccActionConfig"] = TFieldMutateInstance["diccActionConfig"]
  >(
    keyStructureContext: "structureField",
    keyModule: "mutater",
    keyModuleContext: "fieldMutate",
    keyPath: string
  ): TIDiccEmbFieldMutateAC;
  public getDiccActionConfigByModuleContext<
    TIDiccEmbFieldValAC extends TFieldValInstance["diccActionConfig"] = TFieldValInstance["diccActionConfig"]
  >(
    keyStructureContext: "structureField",
    keyModule: "validator",
    keyModuleContext: "fieldVal",
    keyPath: string
  ): TIDiccEmbFieldValAC;
  public getDiccActionConfigByModuleContext<
    TIDiccEmbModelMutateAC extends TModelMutateInstance["diccActionConfig"] = TModelMutateInstance["diccActionConfig"]
  >(
    keyStructureContext: "structureEmbedded",
    keyModule: "mutater",
    keyModuleContext: "modelMutate",
    keyPath: string
  ): TIDiccEmbModelMutateAC;
  public getDiccActionConfigByModuleContext<
    TIDiccEmbModelValAC extends TModelValInstance["diccActionConfig"] = TModelValInstance["diccActionConfig"]
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
  ): TStructureCtrlInstance["criteriaEmbModelRequestConfig"];
  public getDiccActionConfigByModuleContext(
    keyStructureContext: "structureModel",
    keyModule: "mutater",
    keyModuleContext: "modelMutate"
  ): TModelMutateInstance["diccActionConfig"];
  public getDiccActionConfigByModuleContext(
    keyStructureContext: "structureModel",
    keyModule: "validator",
    keyModuleContext: "modelVal"
  ): TModelValInstance["diccActionConfig"];
  public getDiccActionConfigByModuleContext(
    keyStructureContext: "structureModel",
    keyModule: "validator",
    keyModuleContext: "requestVal"
  ): TRequestValInstance["diccActionConfig"];
  public getDiccActionConfigByModuleContext(
    keyStructureContext: "structureModel",
    keyModule: "hook"
  ): TStructureHookInstance["diccActionConfig"];
  public getDiccActionConfigByModuleContext(
    keyStructureContext: "structureModel",
    keyModule: "provider"
  ): TStructureProviderInstance["diccActionConfig"];
  public getDiccActionConfigByModuleContext(
    keyStructureContext: "structureModel",
    keyModule: "controller"
  ): TStructureCtrlInstance["diccCriteriaRequestConfig"];
  public getDiccActionConfigByModuleContext(
    keyStructureContext: TKeyStructureContextFull,
    keyModule: TKeyActionModule,
    keyModuleContext?:
      | TKeyStructureDeepMutateModuleContext
      | TKeyStructureDeepValModuleContext
      | TKeyStructureDeepCtrlModuleContext,
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
        diccAC = metadataByModuleContext.__mutateInstance.diccActionConfig;
      } else if (keyModuleContext === "fieldVal") {
        const metadataByModuleContext = this.getExtractMetadataByModuleContext(
          keyStructureContext,
          "validator",
          keyPath
        );
        diccAC = metadataByModuleContext.__valInstance.diccActionConfig;
      } else if (keyModule === "controller") {
        const metadataByModuleContext = this.getExtractMetadataByModuleContext(
          keyStructureContext,
          "controller",
          keyPath
        );
        diccAC =
          metadataByModuleContext.__ctrlInstance.criteriaFieldRequestConfig;
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
          diccAC = metadataByModuleContext.__mutateInstance.diccActionConfig;
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
          diccAC = metadataByModuleContext.__valInstance.diccActionConfig;
          // }else if(keyModuleContext === "requestVal"){
          //   const metadataByModuleContext = this.getExtractMetadataByModuleContext(
          //     keyStructureContext,
          //     keyModule,
          //     keyPath,
          //   );
          //   diccAC = metadataByModuleContext.__requestValInstance.diccActionConfig;
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
          metadataByModuleContext.__ctrlInstance.criteriaEmbModelRequestConfig;
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
          diccAC = metadataByModuleContext.__mutateInstance.diccActionConfig;
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
          diccAC = metadataByModuleContext.__valInstance.diccActionConfig;
        } else if (keyModuleContext === "requestVal") {
          const metadataByModuleContext =
            this.getExtractMetadataByModuleContext(
              keyStructureContext,
              keyModule
            );
          diccAC =
            metadataByModuleContext.__requestValInstance.diccActionConfig;
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
        diccAC = metadataByModuleContext.__hookInstance.diccActionConfig;
      } else if (keyModule === "provider") {
        const metadataByModuleContext = this.getExtractMetadataByModuleContext(
          keyStructureContext,
          keyModule
        );
        diccAC = metadataByModuleContext.__providerInstance.diccActionConfig;
      } else if (keyModule === "controller") {
        const metadataByModuleContext = this.getExtractMetadataByModuleContext(
          keyStructureContext,
          keyModule
        );
        diccAC =
          metadataByModuleContext.__ctrlInstance.diccCriteriaRequestConfig;
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
  /**
   *
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
  public getExtractMetadataStructureOnlyField<TEmbModel>(
    keyStructureContext: "structureEmbedded",
    keyModule: "metadata",
    keyPath: string
  ): Record<keyof TEmbModel, TStructureFieldMeta<TEmbModel>>;
  public getExtractMetadataStructureOnlyField<
    TEmbModel = TModel,
    TEmbFieldMutateInstance extends TFieldMutateInstance = TFieldMutateInstance
  >(
    keyStructureContext: "structureEmbedded",
    keyModule: "mutater",
    keyPath: string
  ): Record<
    keyof TEmbModel,
    TStructureFieldMetaAndMutater<TEmbFieldMutateInstance>
  >;
  public getExtractMetadataStructureOnlyField<
    TEmbModel = TModel,
    TEmbFieldValInstance extends TFieldValInstance = TFieldValInstance
  >(
    keyStructureContext: "structureEmbedded",
    keyModule: "validator",
    keyPath: string
  ): Record<
    keyof TEmbModel,
    TStructureFieldMetaAndValidator<TEmbFieldValInstance>
  >;
  public getExtractMetadataStructureOnlyField<
    TEmbModel = TModel,
    TEmbStructureHookInstance extends TStructureHookInstance = TStructureHookInstance
  >(
    keyStructureContext: "structureEmbedded",
    keyModule: "hook",
    keyPath: string
  ): Record<
    keyof TEmbModel,
    TStructureFieldMetaAndHook<TEmbStructureHookInstance>
  >;
  public getExtractMetadataStructureOnlyField<
    TEmbModel = TModel,
    TEmbFieldMutateInstance extends TFieldMutateInstance = TFieldMutateInstance,
    TEmbFieldValInstance extends TFieldValInstance = TFieldValInstance,
    TEmbStructureHookInstance extends TStructureHookInstance = TStructureHookInstance,
    TEmbStructureCtrlInstance extends StructureLogicController<
      TEmbModel,
      TEmbFieldMutateInstance,
      any,
      TEmbFieldValInstance,
      any,
      any,
      TEmbStructureHookInstance,
      any
    > = StructureLogicController<
      TEmbModel,
      TEmbFieldMutateInstance,
      any,
      TEmbFieldValInstance,
      any,
      any,
      TEmbStructureHookInstance,
      any
    >
  >(
    keyStructureContext: "structureEmbedded",
    keyModule: "controller",
    keyPath: string
  ): Record<
    keyof TEmbModel,
    TStructureFieldMetaAndCtrl<
      TEmbFieldMutateInstance,
      TEmbFieldValInstance,
      TEmbStructureHookInstance,
      TEmbStructureCtrlInstance
    >
  >;
  /**
   *
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
    keyStructureContext: "structureModel",
    keyModule: "validator"
  ): Record<keyof TModel, TStructureFieldMetaAndHook<TStructureHookInstance>>;
  public getExtractMetadataStructureOnlyField(
    keyStructureContext: "structureModel",
    keyModule: "controller"
  ): Record<
    keyof TModel,
    TStructureFieldMetaAndCtrl<
      TFieldMutateInstance,
      TFieldValInstance,
      TStructureHookInstance
    >
  >;
  public getExtractMetadataStructureOnlyField(
    keyStructureContext: Extract<
      TKeyStructureContextFull,
      "structureEmbedded" | "structureModel"
    >,
    keyModule: TKeyActionModule | Extract<TKeyHandlerModule, "metadata">, //❗Solo para tipar el retorno❗
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
    const structureMeta = this.getExtractMetadataByStructureContext(
      keyStructureContext as any,
      keyPath
    );
    let metadataOnlyField = {} as Record<any, TStructureFieldMeta<any>>;
    metadataOnlyField =
      this.util.selectOnlyProperties<typeof metadataOnlyField>(structureMeta);
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
    data = this.util.clone(data, "stringify");
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
    customizeValue: TValue = this.util.dfValue
  ): unknown {
    let modelGP = {} as any;
    const dataDf = this.getDataDefault(
      keyStructureContext as any,
      keyPath
    ) as object;
    if (!this.util.isObject(dataDf)) return modelGP;
    const setDeepFn = (subDataDf, valueDf) => {
      let r = {};
      for (const keyProp in subDataDf) {
        if (Object.prototype.hasOwnProperty.call(subDataDf, keyProp)) {
          const prop = subDataDf[keyProp];
          if ((this.util.isObject(prop), true)) {
            //aqui si se permite objeto vacio
            r[keyProp] = setDeepFn(prop, valueDf);
          } else {
            r[keyProp] = valueDf;
          }
        }
      }
      return r;
    };
    modelGP = setDeepFn(dataDf, customizeValue);
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
  public override getKeyModuleFromKeyModuleContext(
    keyModuleContext: TKeyStructureInternalACModuleContext
  ): TKeyActionModule {
    let keyModule: TKeyActionModule;
    if (
      keyModuleContext === "fieldMutate" ||
      keyModuleContext === "modelMutate"
    ) {
      keyModule = "mutater";
    } else if (
      keyModuleContext === "fieldVal" ||
      keyModuleContext === "modelVal" ||
      keyModuleContext === "requestVal"
    ) {
      keyModule = "validator";
    } else if (keyModuleContext === "structureHook") {
      keyModule = "hook";
    } else if (keyModuleContext === "structureProvider") {
      keyModule = "provider";
    } else if (keyModuleContext === "structureCtrl") {
      keyModule = "controller";
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${keyModuleContext} is not module context key valid`,
      });
    }
    return keyModule;
  }
  /**... */
  public getRootCtrlInstance(): TStructureCtrlInstance {
    const ctrl = this.getInstanceModuleByModuleContext(
      "structureModel",
      "controller"
    );
    return ctrl;
  }
}
