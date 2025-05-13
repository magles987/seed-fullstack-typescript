import {
  PrimitiveLogicController,
  StructureLogicController,
  TPrimitiveCtrlBaseConfig,
  TStructureCtrlBaseConfig,
} from "../controllers/index-barrel";
import { ELogicCodeError, LogicError } from "../errors/index-barrel";
import {
  PrimitiveLogicHook,
  StructureLogicHook,
  TPrimitiveHookBaseConfig,
  TStructureHookBaseConfig,
} from "../hooks/index-barrel";
import {
  TKeyFieldInternalACModuleContext,
  TKeyModelInternalModuleContext,
  TKeyPrimitiveInternalACModuleContext,
} from "../meta/index-barrel";
import {
  FieldLogicMutater,
  ModelLogicMutater,
  PrimitiveLogicMutater,
  TFieldMutateBaseConfig,
  TPrimitiveMutateBaseConfig,
} from "../mutaters/index-barrel";
import {
  AxiosDriver,
  CookieDriver,
  Driver,
  FetchDriver,
  IdbDriver,
  StorageDriver,
} from "../providers/_drivers/index-barrel";
import {
  PrimitiveLogicProvider,
  StructureLogicProvider,
  TPrimitiveProviderBaseConfig,
  TStructureProviderBaseConfig,
} from "../providers/index-barrel";
import { Util_Module } from "../util/index-barrel";
import {
  FieldLogicValidation,
  ModelLogicValidation,
  PrimitiveLogicValidation,
  RequestLogicValidation,
  TFieldValBaseConfig,
  TKeyRequestValModuleContext,
  TModelValBaseConfig,
  TPrimitiveValBaseConfig,
  TRequestValBaseConfig,
} from "../validators/index-barrel";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *abstract*
 *
 * ...
 */
export abstract class Modulefactory {
  /**... */
  constructor() {}
  /**... */
  protected abstract makeModuleInstance(
    keyModuleContext: unknown,
    baseConfig: unknown
  ): unknown;
  /**... */
  public makeDriverInstance(nameDriver: string, baseConfig?: unknown): Driver {
    const util = Util_Module.getInstance(); //❗Debe ser inicializado aquí OBLIGATORIAMENTE❗
    let driver: Driver;
    const isBaseConfig = util.isObject(baseConfig);
    if (nameDriver === CookieDriver.getNameLogicDriver()) {
      driver = isBaseConfig ? new CookieDriver(baseConfig) : new CookieDriver();
    } else if (nameDriver === StorageDriver.getNameLogicDriver()) {
      driver = isBaseConfig
        ? new StorageDriver()
        : new StorageDriver(baseConfig);
    } else if (nameDriver === IdbDriver.getNameLogicDriver()) {
      driver = isBaseConfig ? new IdbDriver(baseConfig) : new IdbDriver();
    } else if (nameDriver === FetchDriver.getNameLogicDriver()) {
      driver = isBaseConfig ? new FetchDriver(baseConfig) : new FetchDriver();
    } else if (nameDriver === AxiosDriver.getNameLogicDriver()) {
      driver = isBaseConfig ? new AxiosDriver(baseConfig) : new AxiosDriver();
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${nameDriver} is not driver name valid`,
      });
    }
    return driver;
  }
}
/** *Singleton*
 *
 * ...
 */
export class PrimitiveModuleFactory extends Modulefactory {
  /**  Almacena la instancia única de esta clase */
  private static PrimitiveModuleFactory_instance: PrimitiveModuleFactory;
  /**
   * descrip...
   *
   */
  protected constructor() {
    super();
  }
  /** @returns la instancia única de la clase*/
  public static getInstance(): PrimitiveModuleFactory {
    PrimitiveModuleFactory.PrimitiveModuleFactory_instance =
      typeof PrimitiveModuleFactory.PrimitiveModuleFactory_instance ===
        "object" &&
      PrimitiveModuleFactory.PrimitiveModuleFactory_instance !== null
        ? PrimitiveModuleFactory.PrimitiveModuleFactory_instance
        : new PrimitiveModuleFactory();
    return PrimitiveModuleFactory.PrimitiveModuleFactory_instance;
  }
  public override makeModuleInstance(
    keyModuleContext: "primitiveMutate",
    baseConfig?: TPrimitiveMutateBaseConfig
  ): PrimitiveLogicMutater;
  public override makeModuleInstance(
    keyModuleContext: "primitiveVal",
    baseConfig?: TPrimitiveValBaseConfig
  ): PrimitiveLogicValidation;
  public override makeModuleInstance(
    keyModuleContext: "requestVal",
    baseConfig?: TRequestValBaseConfig
  ): RequestLogicValidation;
  public override makeModuleInstance(
    keyModuleContext: "primitiveHook",
    baseConfig?: TPrimitiveHookBaseConfig
  ): PrimitiveLogicHook;
  public override makeModuleInstance(
    keyModuleContext: "primitiveProvider",
    baseConfig?: TPrimitiveProviderBaseConfig
  ): PrimitiveLogicProvider;
  public override makeModuleInstance<
    TValue,
    TPrimitiveMutateInstance extends PrimitiveLogicMutater = PrimitiveLogicMutater,
    TPrimitiveValInstance extends PrimitiveLogicValidation = PrimitiveLogicValidation,
    TRequestValInstance extends RequestLogicValidation = RequestLogicValidation,
    TPrimitiveHookInstance extends PrimitiveLogicHook = PrimitiveLogicHook,
    TPrimitiveProviderInstance extends PrimitiveLogicProvider = PrimitiveLogicProvider,
    TKeyDiccActionRequest extends string = string
  >(
    keyModuleContext: "primitiveCtrl",
    baseConfig?: TPrimitiveCtrlBaseConfig<
      TPrimitiveMutateInstance,
      TPrimitiveValInstance,
      TRequestValInstance,
      TPrimitiveHookInstance,
      TPrimitiveProviderInstance,
      TKeyDiccActionRequest
    >
  ): PrimitiveLogicController<
    TValue,
    TPrimitiveMutateInstance,
    TPrimitiveValInstance,
    TRequestValInstance,
    TPrimitiveHookInstance,
    TPrimitiveProviderInstance,
    TKeyDiccActionRequest
  >;
  public override makeModuleInstance(
    keyModuleContext:
      | TKeyPrimitiveInternalACModuleContext
      | TKeyRequestValModuleContext,
    baseConfig?: unknown
  ): unknown {
    const util = Util_Module.getInstance(); //❗Debe ser inicializado aquí OBLIGATORIAMENTE❗
    let moduleInstance: unknown;
    const isBaseConfig = util.isObject(baseConfig, true);
    if (keyModuleContext === "primitiveMutate") {
      moduleInstance = isBaseConfig
        ? new PrimitiveLogicMutater(baseConfig)
        : new PrimitiveLogicMutater();
    } else if (keyModuleContext === "primitiveVal") {
      moduleInstance = isBaseConfig
        ? new PrimitiveLogicValidation(baseConfig)
        : new PrimitiveLogicValidation();
    } else if (keyModuleContext === "requestVal") {
      moduleInstance = isBaseConfig
        ? new RequestLogicValidation("primitive", baseConfig)
        : new RequestLogicValidation("primitive");
    } else if (keyModuleContext === "primitiveHook") {
      moduleInstance = isBaseConfig
        ? new PrimitiveLogicHook(baseConfig)
        : new PrimitiveLogicHook();
    } else if (keyModuleContext === "primitiveProvider") {
      const dfDriverList: Driver[] = [
        CookieDriver.getNameLogicDriver(),
        StorageDriver.getNameLogicDriver(),
        IdbDriver.getNameLogicDriver(),
        FetchDriver.getNameLogicDriver(),
        AxiosDriver.getNameLogicDriver(),
      ].map((nameDriver) => this.makeDriverInstance(nameDriver));
      moduleInstance = isBaseConfig
        ? new PrimitiveLogicProvider({
            ...(baseConfig as any),
            driverList: util.isArray(baseConfig["driverList"])
              ? baseConfig["driverList"]
              : dfDriverList,
          })
        : new PrimitiveLogicProvider({
            driverList: dfDriverList,
          });
    } else if (keyModuleContext === "primitiveCtrl") {
      moduleInstance = isBaseConfig
        ? new PrimitiveLogicController(baseConfig)
        : new PrimitiveLogicController();
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${keyModuleContext} is not module context key valid`,
      });
    }
    return moduleInstance;
  }
}
/** *Singleton*
 *
 * ...
 */
export class StructureModuleFactory extends Modulefactory {
  /**  Almacena la instancia única de esta clase */
  private static StructureModuleFactory_instance: StructureModuleFactory;
  /**... */
  protected constructor() {
    super();
  }
  /** @returns la instancia única de la clase*/
  public static getInstance(): StructureModuleFactory {
    StructureModuleFactory.StructureModuleFactory_instance =
      typeof StructureModuleFactory.StructureModuleFactory_instance ===
        "object" &&
      StructureModuleFactory.StructureModuleFactory_instance !== null
        ? StructureModuleFactory.StructureModuleFactory_instance
        : new StructureModuleFactory();
    return StructureModuleFactory.StructureModuleFactory_instance;
  }

  public override makeModuleInstance(
    keyModuleContext: "fieldMutate",
    baseConfig?: TFieldMutateBaseConfig
  ): FieldLogicMutater;
  public override makeModuleInstance(
    keyModuleContext: "modelMutate",
    baseConfig?: TModelValBaseConfig
  ): ModelLogicMutater;
  public override makeModuleInstance(
    keyModuleContext: "fieldVal",
    baseConfig?: TFieldValBaseConfig
  ): FieldLogicValidation;
  public override makeModuleInstance(
    keyModuleContext: "modelVal",
    baseConfig?: TModelValBaseConfig
  ): ModelLogicValidation;
  public override makeModuleInstance(
    keyModuleContext: "requestVal",
    baseConfig?: TRequestValBaseConfig
  ): RequestLogicValidation;
  public override makeModuleInstance(
    keyModuleContext: "structureHook",
    baseConfig?: TStructureHookBaseConfig
  ): StructureLogicHook;
  public override makeModuleInstance(
    keyModuleContext: "structureProvider",
    baseConfig?: TStructureProviderBaseConfig
  ): StructureLogicProvider;
  public override makeModuleInstance<
    TModel,
    TFieldMutateInstance extends FieldLogicMutater = FieldLogicMutater,
    TModelMutateInstance extends ModelLogicMutater = ModelLogicMutater,
    TFieldValInstance extends FieldLogicValidation = FieldLogicValidation,
    TModelValInstance extends ModelLogicValidation = ModelLogicValidation,
    TRequestValInstance extends RequestLogicValidation = RequestLogicValidation,
    TStructureHookInstance extends StructureLogicHook = StructureLogicHook,
    TStructureProviderInstance extends StructureLogicProvider = StructureLogicProvider,
    TKeyDiccActionRequest extends string = string
  >(
    keyModuleContext: "structureCtrl",
    baseConfig?: TStructureCtrlBaseConfig<
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
  ): StructureLogicController<
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
  public override makeModuleInstance(
    keyModuleContext:
      | TKeyModelInternalModuleContext
      | TKeyFieldInternalACModuleContext
      | TKeyRequestValModuleContext,
    baseConfig?: unknown
  ): unknown {
    const util = Util_Module.getInstance(); //❗Debe ser inicializado aquí OBLIGATORIAMENTE❗
    let moduleInstance: unknown;
    const isBaseConfig = util.isObject(baseConfig, true);
    if (keyModuleContext === "fieldMutate") {
      moduleInstance = isBaseConfig
        ? new FieldLogicMutater(baseConfig)
        : new FieldLogicMutater();
    } else if (keyModuleContext === "modelMutate") {
      moduleInstance = isBaseConfig
        ? new ModelLogicMutater(baseConfig)
        : new ModelLogicMutater();
    } else if (keyModuleContext === "fieldVal") {
      moduleInstance = isBaseConfig
        ? new FieldLogicValidation(baseConfig)
        : new FieldLogicValidation();
    } else if (keyModuleContext === "modelVal") {
      moduleInstance = isBaseConfig
        ? new ModelLogicValidation(baseConfig)
        : new ModelLogicValidation();
    } else if (keyModuleContext === "requestVal") {
      moduleInstance = isBaseConfig
        ? new RequestLogicValidation("structure", baseConfig)
        : new RequestLogicValidation("structure");
    } else if (keyModuleContext === "structureHook") {
      moduleInstance = isBaseConfig
        ? new StructureLogicHook(baseConfig)
        : new StructureLogicHook();
    } else if (keyModuleContext === "structureProvider") {
      const dfDriverList: Driver[] = [
        CookieDriver.getNameLogicDriver(),
        StorageDriver.getNameLogicDriver(),
        IdbDriver.getNameLogicDriver(),
        FetchDriver.getNameLogicDriver(),
        AxiosDriver.getNameLogicDriver(),
      ].map((nameDriver) => this.makeDriverInstance(nameDriver));
      moduleInstance = isBaseConfig
        ? new StructureLogicProvider({
            ...(baseConfig as any),
            driverList: util.isArray(baseConfig["driverList"])
              ? baseConfig["driverList"]
              : dfDriverList,
          })
        : new StructureLogicProvider({
            driverList: dfDriverList,
          });
    } else if (keyModuleContext === "structureCtrl") {
      moduleInstance = isBaseConfig
        ? new StructureLogicController(baseConfig)
        : new StructureLogicController();
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${keyModuleContext} is not module context key valid`,
      });
    }
    return moduleInstance;
  }
}
