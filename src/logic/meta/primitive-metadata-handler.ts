import { PrimitiveLogicController } from "../controllers/primitive-ctrl";
import { IPrimitiveCtrlContextInstance } from "../controllers/shared-types";
import { LogicError, ELogicCodeError } from "../errors/logic-error";
import { PrimitiveLogicHook } from "../hooks/primitive-hook";
import { IPrimitiveHookContextInstance } from "../hooks/shared-types";
import { TwinBeeModule } from "../modules/module";
import { TKeyActionModule, TKeyHandlerModule } from "../modules/shared-types";
import { PrimitiveLogicMutater } from "../mutaters/primitive-mutater";
import { IPrimitiveMutateContextInstance } from "../mutaters/shared-types";
import { PrimitiveLogicProvider } from "../providers/primitive-provider";
import { IPrimitiveProviderContextInstance } from "../providers/shared-types";
import { PrimitiveLogicValidation } from "../validators/primitive-validation";
import { RequestLogicValidation } from "../validators/request-validation";
import {
  IPrimitiveValContextInstance,
  TKeyPrimitiveValModuleContext,
} from "../validators/shared-types";
import { LogicMetadataHandler } from "./_metadata-handler";
import {
  TKeyPrimitiveDiccActionRequest,
  TPrimitiveBaseMetadata,
} from "./base-shared-types";
import {
  TPrimitiveFull,
  TPrimitiveMeta,
  TPrimitiveMetaAndMutater,
  TPrimitiveMetaAndValidator,
  TPrimitiveMetaAndRequestVal,
  TPrimitiveMetaAndHook,
  TPrimitiveMetaAndProvider,
  TPrimitiveMetaAndCtrl,
  TKeyPrimitiveInternalACModuleContext,
} from "./schema-shared-types";
import { IPrimitiveMetadataModuleConfig } from "./shared-types";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**tipado refactorizado del manejador */
export type Trf_PrimitiveLogicMetadataHandler = PrimitiveLogicMetadataHandler<
  any,
  any,
  any,
  any,
  any,
  any,
  any
>;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**... */
export class PrimitiveLogicMetadataHandler<
  TValue,
  TPrimitiveMutateInstance extends PrimitiveLogicMutater = PrimitiveLogicMutater,
  TPrimitiveValInstance extends PrimitiveLogicValidation = PrimitiveLogicValidation,
  TRequestValInstance extends RequestLogicValidation = RequestLogicValidation,
  TPrimitiveHookInstance extends PrimitiveLogicHook = PrimitiveLogicHook,
  TPrimitiveProviderInstance extends PrimitiveLogicProvider = PrimitiveLogicProvider,
  TKeyDiccActionRequest extends TKeyPrimitiveDiccActionRequest<
    string,
    string
  > = TKeyPrimitiveDiccActionRequest<never, never>,
  TPrimitiveCtrlInstance extends PrimitiveLogicController<
    TValue,
    TPrimitiveMutateInstance,
    TPrimitiveValInstance,
    TRequestValInstance,
    TPrimitiveHookInstance,
    TPrimitiveProviderInstance,
    TKeyDiccActionRequest
  > = PrimitiveLogicController<
    TValue,
    TPrimitiveMutateInstance,
    TPrimitiveValInstance,
    TRequestValInstance,
    TPrimitiveHookInstance,
    TPrimitiveProviderInstance,
    TKeyDiccActionRequest
  >
> extends LogicMetadataHandler {
  /** configuración de valores predefinidos para el modulo*/
  public static override readonly getDefault = () => {
    const superDf = LogicMetadataHandler.getDefault();
    return {
      ...superDf,
      handlerConfig: {
        ...superDf.handlerConfig,
        primitiveMeta: {
          __type: "string",
          __isArray: false,
          __isVirtual: false,
          __dfData: undefined, //❗ OBLIGATORIO en la definicion de cada metadato
          __keysProp: [],
          __mutateInstance: undefined,
          __valInstance: undefined,
          __requestValInstance: undefined,
          __hookInstance: undefined,
          __providerInstance: undefined,
          __ctrlInstance: undefined,
        },
      } as IPrimitiveMetadataModuleConfig<any>,
    };
  };
  protected override get metadata(): TPrimitiveFull<
    TValue,
    TPrimitiveMutateInstance,
    TPrimitiveValInstance,
    TRequestValInstance,
    TPrimitiveHookInstance,
    TPrimitiveProviderInstance,
    TKeyDiccActionRequest
  > {
    return super.metadata as any;
  }
  protected override set metadata(v: TPrimitiveFull<TValue>) {
    super.metadata = v;
  }
  /**
   * @param baseConfig configuración de metadatos inicial
   * - `keySrc` : clave identificadora del recurso,
   * - `baseMeta` : esquema base para construir los metadatos
   */
  constructor(baseConfig: {
    keySrc: string;
    baseMeta: TPrimitiveBaseMetadata<
      TValue,
      TPrimitiveMutateInstance,
      TPrimitiveValInstance,
      TRequestValInstance,
      TPrimitiveHookInstance,
      TPrimitiveProviderInstance,
      TKeyDiccActionRequest,
      TPrimitiveCtrlInstance
    >;
  }) {
    super("primitive", baseConfig.keySrc);
    this.metadata = this.buildMetadata(baseConfig.baseMeta as any);
  }
  protected override getDefault() {
    return PrimitiveLogicMetadataHandler.getDefault();
  }
  public static override checkKeySrc(baseKeySrc: string): string {
    const util = TwinBeeModule.util;
    const isString = util.isString(baseKeySrc);
    if (!isString) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${baseKeySrc} is not resource base key valid`,
      });
    }
    return LogicMetadataHandler.checkKeySrc(baseKeySrc as string);
  }
  public static override buildMetadataHandlerAndSetRegister<
    TPrimitiveLogicMetadataHandler
  >(
    keySrc: string,
    builderMetadataHandlerFn: () => TPrimitiveLogicMetadataHandler
  ): TPrimitiveLogicMetadataHandler {
    return LogicMetadataHandler.buildMetadataHandlerAndSetRegister<TPrimitiveLogicMetadataHandler>(
      keySrc,
      builderMetadataHandlerFn
    );
  }
  protected override buildMetadata(
    newMetadata: TPrimitiveBaseMetadata<TValue>
  ): TPrimitiveFull<TValue> {
    let metadata = this.buildPrimitiveMetadata(
      newMetadata as TPrimitiveMeta<TValue>
    ) as any as TPrimitiveFull<TValue>;
    return metadata;
  }
  private buildPrimitiveMetadata(
    newMetadata: TPrimitiveMeta<TValue>
  ): TPrimitiveMeta<TValue> {
    const nM = newMetadata as TPrimitiveMeta<TValue>;
    newMetadata = this.buildMetadataHandlerConfig(nM) as TPrimitiveMeta<TValue>;
    return newMetadata;
  }
  private buildMetadataHandlerConfig(metadataHC: unknown): unknown {
    const dfHC = this.getDefault().handlerConfig;
    const mHC = metadataHC as TPrimitiveFull<TValue>;
    if (!this.util.isObject(mHC)) {
      //❗❗❗No debería entrar aquí, la configuración
      // de metadatos no puede ser totalmente predefinida❗❗❗
      metadataHC = dfHC.primitiveMeta;
    } else {
      const dfData = this.buildDfData(mHC.__dfData);
      //construir configuración general
      metadataHC = {
        ...mHC, // garantiza otras propiedades adiccionales
        __P_Key: this.util.isString(mHC.__P_Key) ? mHC.__P_Key : this.keySrc, //⚠Se usa la misma key en caso no no terner personalizacion
        __S_Key: this.util.isString(mHC.__S_Key) ? mHC.__S_Key : this.keySrc, //⚠Se usa la misma key en caso no no terner personalizacion
        __keysProp: this.util.isLiteralObject(dfData)
          ? Object.keys(dfData)
          : dfHC.primitiveMeta.__keysProp,
        __type: this.util.isString(mHC.__type)
          ? mHC.__type
          : dfHC.primitiveMeta.__type,
        __isArray: this.util.isBoolean(mHC.__isArray)
          ? mHC.__isArray
          : dfHC.primitiveMeta.__isArray,
        __isVirtual: this.util.isBoolean(mHC.__isVirtual)
          ? mHC.__isVirtual
          : dfHC.primitiveMeta.__isVirtual,
        __dfData: dfData,
        __mutateInstance: this.buildMutateInstance(mHC.__mutateInstance),
        __valInstance: this.buildValInstance(mHC.__valInstance),
        __requestValInstance: this.buildRequestValInstance(
          mHC.__requestValInstance
        ),
        __hookInstance: this.buildHookInstance(mHC.__hookInstance),
        __providerInstance: this.buildProviderInstance(mHC.__providerInstance),
        __ctrlInstance: this.buildCtrlInstance(mHC.__ctrlInstance),
      } as TPrimitiveFull<TValue>;
    }
    return metadataHC;
  }
  /**construye un dato predefinido para
   * los metadatos segun el contexto*/
  private buildDfData(newDfData: any): any {
    const dfHC = this.getDefault().handlerConfig;
    let dfData = newDfData !== undefined ? newDfData : dfHC.primitiveMeta;
    //❓❓Que hacer si el valor predefinido si es undefined❓❓
    // if (dfValue === undefined) {
    //   throw new LogicError({
    //     code: ELogicCodeError.MODULE_ERROR,
    //     msn: `${currentBuildDfValue} is not builder function of value valid `,
    //   });
    // }
    return dfData;
  }
  /** */
  private buildMutateInstance(
    metadataMutateC: IPrimitiveMutateContextInstance["primitiveMutate"]
  ): IPrimitiveMutateContextInstance["primitiveMutate"] {
    const buildFn = PrimitiveLogicMutater["buildInstanceForMetadata"]; //❗Èl método es protegido pero lo hackeo 🐱‍👤❗
    let rMetadataMutateC: IPrimitiveMutateContextInstance["primitiveMutate"];
    const pC = metadataMutateC;
    let rPrimitiveConfig = buildFn(pC);
    //agregar contexto de manejador de metadata y al diccionario de instancias
    rPrimitiveConfig.metadataHandler = this;
    rMetadataMutateC = rPrimitiveConfig;
    return rMetadataMutateC as any;
  }
  /** */
  private buildValInstance(
    metadataValC: IPrimitiveValContextInstance["primitiveVal"]
  ): IPrimitiveValContextInstance["primitiveVal"] {
    const buildFn = PrimitiveLogicValidation["buildInstanceForMetadata"]; //❗Èl método es protegido pero lo hackeo 🐱‍👤❗
    let rMetadataValC: IPrimitiveValContextInstance["primitiveVal"];
    const pC = metadataValC;
    let rPrimitiveConfig = buildFn(pC);
    //agregar contexto de manejador de metadata y al diccionario de instancias
    rPrimitiveConfig.metadataHandler = this;
    rMetadataValC = rPrimitiveConfig;
    return rMetadataValC;
  }
  /** */
  private buildRequestValInstance(
    metadataValC: IPrimitiveValContextInstance["requestVal"]
  ): IPrimitiveValContextInstance["requestVal"] {
    const buildFn = RequestLogicValidation["buildInstanceForMetadata"]; //❗Èl método es protegido pero lo hackeo 🐱‍👤❗
    let rMetadataValC: IPrimitiveValContextInstance["requestVal"];
    const pC = metadataValC;
    let rPrimitiveConfig = buildFn("primitive", pC);
    //agregar contexto de manejador de metadata y al diccionario de instancias
    rPrimitiveConfig.metadataHandler = this;
    rMetadataValC = rPrimitiveConfig;
    return rMetadataValC;
  }
  /** */
  private buildHookInstance(
    metadataHookC: IPrimitiveHookContextInstance["primitiveHook"]
  ): IPrimitiveHookContextInstance["primitiveHook"] {
    const buildFn = PrimitiveLogicHook["buildInstanceForMetadata"]; //❗Èl método es protegido pero lo hackeo 🐱‍👤❗
    let rMetadataHookC: IPrimitiveHookContextInstance["primitiveHook"];
    const pC = metadataHookC;
    let rPrimitiveConfig = buildFn(pC);
    //agregar contexto de manejador de metadata y al diccionario de instancias
    rPrimitiveConfig.metadataHandler = this;
    rMetadataHookC = rPrimitiveConfig;
    return rMetadataHookC as any;
  }
  private buildProviderInstance(
    metadataProviderC: IPrimitiveProviderContextInstance["primitiveProvider"]
  ): IPrimitiveProviderContextInstance["primitiveProvider"] {
    const buildFn = PrimitiveLogicProvider["buildInstanceForMetadata"]; //❗Èl método es protegido pero lo hackeo 🐱‍👤❗
    let rMetadataProviderC: IPrimitiveProviderContextInstance["primitiveProvider"];
    const pC = metadataProviderC;
    let rPrimitiveConfig = buildFn(pC);
    //agregar contexto de manejador de metadata y al diccionario de instancias
    rPrimitiveConfig.metadataHandler = this;
    rMetadataProviderC = rPrimitiveConfig;
    return rMetadataProviderC as any;
  }
  private buildCtrlInstance(
    metadataCtrlC: IPrimitiveCtrlContextInstance<TValue>["primitiveCtrl"]
  ): IPrimitiveCtrlContextInstance<TValue>["primitiveCtrl"] {
    const buildFn = PrimitiveLogicController["buildInstanceForMetadata"]; //❗Èl método es protegido pero lo hackeo 🐱‍👤❗
    let rMetadataCtrlC: IPrimitiveCtrlContextInstance<TValue>["primitiveCtrl"];
    const pC = metadataCtrlC;
    let rPrimitiveConfig = buildFn(pC as any);
    //agregar contexto de manejador de metadata y al diccionario de instancias
    rPrimitiveConfig.metadataHandler = this;
    rMetadataCtrlC = rPrimitiveConfig;
    return rMetadataCtrlC as any;
  }
  //====Metodos de obtencion de metadatos============================================================================================================================

  public getMetadata(): TPrimitiveFull<
    TValue,
    TPrimitiveMutateInstance,
    TPrimitiveValInstance,
    TRequestValInstance,
    TPrimitiveHookInstance
  > {
    const primitiveMetadata = this.metadata;
    if (!this.util.isObject(primitiveMetadata)) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${primitiveMetadata} is not metadata valid`,
      });
    }
    return primitiveMetadata as any;
  }
  public getExtractMetadataByModuleContext(
    keyModule: "metadata" //❗Solo para tipar el retorno❗
  ): TPrimitiveMeta<TValue>;
  public getExtractMetadataByModuleContext(
    keyModule: "mutater" //❗Solo para tipar el retorno❗
  ): TPrimitiveMetaAndMutater<TValue, TPrimitiveMutateInstance>;
  public getExtractMetadataByModuleContext(
    keyModule: "validator" //❗Solo para tipar el retorno❗
  ): TPrimitiveMetaAndValidator<TValue, TPrimitiveValInstance> &
    TPrimitiveMetaAndRequestVal<TValue, TRequestValInstance>;
  public getExtractMetadataByModuleContext(
    keyModule: "hook" //❗Solo para tipar el retorno❗
  ): TPrimitiveMetaAndHook<TValue, TPrimitiveHookInstance>;
  public getExtractMetadataByModuleContext(
    keyModule: "provider" //❗Solo para tipar el retorno❗
  ): TPrimitiveMetaAndProvider<TValue, TPrimitiveProviderInstance>;
  public getExtractMetadataByModuleContext(
    keyModule: "controller" //❗Solo para tipar el retorno❗
  ): TPrimitiveMetaAndCtrl<
    TValue,
    TPrimitiveMutateInstance,
    TPrimitiveValInstance,
    TRequestValInstance,
    TPrimitiveHookInstance,
    TPrimitiveProviderInstance,
    TKeyDiccActionRequest,
    TPrimitiveCtrlInstance
  >;
  public getExtractMetadataByModuleContext(
    keyModule: TKeyActionModule | Extract<TKeyHandlerModule, "metadata"> //❗Solo para tipar el retorno❗
  ): unknown {
    //❗❗❗Es solo una fachada para tipar, ya que en
    //si devuelve todos los metadatos del segmento❗❗❗
    const rMetadata = this.getMetadata();
    return rMetadata;
  }
  /**... */
  public getInstanceModuleByModuleContext(
    keyModule: "mutater"
  ): TPrimitiveMutateInstance;
  public getInstanceModuleByModuleContext(
    keyModule: "validator",
    keyModuleContext: "primitiveVal"
  ): TPrimitiveValInstance;
  public getInstanceModuleByModuleContext(
    keyModule: "validator",
    keyModuleContext: "requestVal"
  ): TPrimitiveValInstance;
  public getInstanceModuleByModuleContext(
    keyModule: "hook"
  ): TPrimitiveHookInstance;
  public getInstanceModuleByModuleContext(
    keyModule: "provider"
  ): TPrimitiveProviderInstance;
  public getInstanceModuleByModuleContext(
    keyModule: "controller"
  ): TPrimitiveCtrlInstance;
  public getInstanceModuleByModuleContext(
    keyModule: TKeyActionModule,
    keyModuleContext?: TKeyPrimitiveValModuleContext
  ): unknown {
    let rModuleInstance: unknown;
    if (keyModule === "mutater") {
      const metadataByModuleContext =
        this.getExtractMetadataByModuleContext(keyModule);
      rModuleInstance = metadataByModuleContext.__mutateInstance;
    } else if (keyModule === "validator") {
      const metadataByModuleContext =
        this.getExtractMetadataByModuleContext(keyModule);
      if (keyModuleContext === "primitiveVal") {
        rModuleInstance = metadataByModuleContext.__valInstance;
      } else if (keyModuleContext === "requestVal") {
        rModuleInstance = metadataByModuleContext.__requestValInstance;
      } else {
        throw new LogicError({
          code: ELogicCodeError.MODULE_ERROR,
          msn: `${keyModuleContext} is not module context key valid into ${keyModule} module`,
        });
      }
    } else if (keyModule === "hook") {
      const metadataByModuleContext =
        this.getExtractMetadataByModuleContext(keyModule);
      rModuleInstance = metadataByModuleContext.__hookInstance;
    } else if (keyModule === "provider") {
      const metadataByModuleContext =
        this.getExtractMetadataByModuleContext(keyModule);
      rModuleInstance = metadataByModuleContext.__providerInstance;
    } else if (keyModule === "controller") {
      const metadataByModuleContext =
        this.getExtractMetadataByModuleContext(keyModule);
      rModuleInstance = metadataByModuleContext.__ctrlInstance;
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${keyModule} is not module key valid`,
      });
    }
    return rModuleInstance;
  }
  /**... */
  public getDiccActionConfigByModuleContext(
    keyModule: "mutater"
  ): TPrimitiveMutateInstance["diccActionConfig"];
  public getDiccActionConfigByModuleContext(
    keyModule: "validator",
    keyModuleContext: "primitiveVal"
  ): TPrimitiveValInstance["diccActionConfig"];
  public getDiccActionConfigByModuleContext(
    keyModule: "validator",
    keyModuleContext: "requestVal"
  ): TPrimitiveValInstance["diccActionConfig"];
  public getDiccActionConfigByModuleContext(
    keyModule: "hook"
  ): TPrimitiveHookInstance["diccActionConfig"];
  public getDiccActionConfigByModuleContext(
    keyModule: "provider"
  ): TPrimitiveProviderInstance["diccActionConfig"];
  public getDiccActionConfigByModuleContext(
    keyModule: "controller"
  ): TPrimitiveCtrlInstance["diccCriteriaRequestConfig"];
  public getDiccActionConfigByModuleContext(
    keyModule: TKeyActionModule,
    keyModuleContext?: TKeyPrimitiveValModuleContext
  ): unknown {
    let diccAC: unknown;
    if (keyModule === "mutater") {
      const metadataByModuleContext =
        this.getExtractMetadataByModuleContext(keyModule);
      diccAC = metadataByModuleContext.__mutateInstance;
    } else if (keyModule === "validator") {
      const metadataByModuleContext =
        this.getExtractMetadataByModuleContext(keyModule);
      if (keyModuleContext === "primitiveVal") {
        diccAC = metadataByModuleContext.__valInstance.diccActionConfig;
      } else if (keyModuleContext === "requestVal") {
        diccAC = metadataByModuleContext.__requestValInstance.diccActionConfig;
      } else {
        throw new LogicError({
          code: ELogicCodeError.MODULE_ERROR,
          msn: `${keyModuleContext} is not module context key valid into ${keyModule} module`,
        });
      }
    } else if (keyModule === "hook") {
      const metadataByModuleContext =
        this.getExtractMetadataByModuleContext(keyModule);
      diccAC = metadataByModuleContext.__hookInstance.diccActionConfig;
    } else if (keyModule === "provider") {
      const metadataByModuleContext =
        this.getExtractMetadataByModuleContext(keyModule);
      diccAC = metadataByModuleContext.__providerInstance.diccActionConfig;
    } else if (keyModule === "controller") {
      const metadataByModuleContext =
        this.getExtractMetadataByModuleContext(keyModule);
      diccAC = metadataByModuleContext.__ctrlInstance.diccCriteriaRequestConfig;
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${keyModule} is not module key valid`,
      });
    }
    return diccAC;
  }
  /** */
  public getDataDefault() {
    const metadata = this.getMetadata();
    let data = metadata.__dfData;
    //❗Obligatorio la clonacion❗
    data = this.util.clone(data);
    return data;
  }
  /**
   * obtener un objeto en base al modelo para propositos
   * generales.
   *
   * en contexto primitivo es utilizado solo si el
   * primitivo es un objeto literal y anonimo (no array)
   *
   * @param customizeValue un valor de personalizacion
   * que tendrá cada propiedad de ese objeto anonimo
   *
   * @returns un objeto de propositos generales con
   * las propiedades asignandole el valor
   * predefinido, si el primitivo no es un
   * objeto anonimo retornará un objeto literal
   * vacio `{}`
   */
  public getSchemaDataForGenericPurpose(customizeValue = undefined) {
    let modelGP = {};
    const metadata = this.getMetadata();
    const keysProp = metadata.__keysProp;
    if (this.util.isArray(keysProp)) {
      for (const key of keysProp) {
        modelGP[key] = customizeValue;
      }
    }
    return modelGP;
  }
  public override getKeyModuleFromKeyModuleContext(
    keyModuleContext: TKeyPrimitiveInternalACModuleContext
  ): TKeyActionModule {
    let keyModule: TKeyActionModule;
    if (keyModuleContext === "primitiveMutate") {
      keyModule = "mutater";
    } else if (
      keyModuleContext === "primitiveVal" ||
      keyModuleContext === "requestVal"
    ) {
      keyModule = "validator";
    } else if (keyModuleContext === "primitiveHook") {
      keyModule = "hook";
    } else if (keyModuleContext === "primitiveProvider") {
      keyModule = "provider";
    } else if (keyModuleContext === "primitiveCtrl") {
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
  public getRootCtrlInstance(): TPrimitiveCtrlInstance {
    const ctrl = this.getInstanceModuleByModuleContext("controller");
    return ctrl;
  }
}
