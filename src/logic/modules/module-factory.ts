import { PrimitiveLogicController } from "../controllers/primitive-ctrl";
import {
  TPrimitiveCtrlBaseConfig,
  TStructureCtrlBaseConfig,
} from "../controllers/shared-types";
import { StructureLogicController } from "../controllers/structure-ctrl";
import { LogicError, ELogicCodeError } from "../errors/logic-error";
import { PrimitiveLogicHook } from "../hooks/primitive-hook";
import {
  TPrimitiveHookBaseConfig,
  TStructureHookBaseConfig,
} from "../hooks/shared-types";
import { StructureLogicHook } from "../hooks/structure-hook";
import {
  TKeyPrimitiveInternalACModuleContext,
  TKeyModelInternalModuleContext,
  TKeyFieldInternalACModuleContext,
} from "../meta/schema-shared-types";
import { FieldLogicMutater } from "../mutaters/field-mutater";
import { ModelLogicMutater } from "../mutaters/model-mutater";
import { PrimitiveLogicMutater } from "../mutaters/primitive-mutater";
import {
  TPrimitiveMutateBaseConfig,
  TFieldMutateBaseConfig,
} from "../mutaters/shared-types";
import { Driver } from "../providers/drivers/_driver";
import { AxiosDriver } from "../providers/drivers/client/web/https/axios/axios-driver";
import { FetchDriver } from "../providers/drivers/client/web/https/fetch/fetch-driver";
import { CookieDriver } from "../providers/drivers/client/web/local-repositories/cookie/cookie-driver";
import { IdbDriver } from "../providers/drivers/client/web/local-repositories/idb/idb-driver";
import { StorageDriver } from "../providers/drivers/client/web/local-repositories/storage/storage-driver";
import { PrimitiveLogicProvider } from "../providers/primitive-provider";
import {
  TPrimitiveProviderBaseConfig,
  TStructureProviderBaseConfig,
} from "../providers/shared-types";
import { StructureLogicProvider } from "../providers/structure-provider";
import { FieldLogicValidation } from "../validators/field-validation";
import { ModelLogicValidation } from "../validators/model-validation";
import { PrimitiveLogicValidation } from "../validators/primitive-validation";
import { RequestLogicValidation } from "../validators/request-validation";
import {
  TPrimitiveValBaseConfig,
  TRequestValBaseConfig,
  TKeyRequestValModuleContext,
  TModelValBaseConfig,
  TFieldValBaseConfig,
} from "../validators/shared-types";
import { TwinBeeModule } from "./module";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████

/** *abstract*
 *
 * ...
 */
export abstract class ModuleFactory {
  /**array con los nombres de drivers predefinidos */
  private get dfNameDriverList() {
    //❗Debe ser en get virtual OBLIGATORIO❗
    return [
      CookieDriver.getNameLogicDriver(),
      StorageDriver.getNameLogicDriver(),
      IdbDriver.getNameLogicDriver(),
      FetchDriver.getNameLogicDriver(),
      AxiosDriver.getNameLogicDriver(),
    ];
  }
  /**... */
  constructor() {}
  /**... */
  protected abstract makeModuleInstance(
    keyModuleContext: unknown,
    baseConfig: unknown
  ): unknown;
  /**... */
  public makeDriverInstance(nameDriver: string, baseConfig?: unknown): Driver {
    const util = TwinBeeModule.util;
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

  /**... */
  protected makeDriversFromList(
    driverList: Driver[] | Array<[string, object]> | string[]
  ): Driver[] {
    const util = TwinBeeModule.util;
    const dfNameList = this.dfNameDriverList;
    const dfDriverList = dfNameList.map((nameDriver) =>
      this.makeDriverInstance(nameDriver)
    );
    let mergedDriverList: Driver[] = [];
    if (!util.isArray(driverList)) {
      mergedDriverList = dfDriverList;
    } else {
      mergedDriverList = driverList.map((dr) => {
        if (util.isInstance(dr)) {
          return dr;
        } else if (util.isTuple(dr, [1, 2])) {
          const [nameDriver, baseConfig] = dr;
          return this.makeDriverInstance(nameDriver, baseConfig);
        } else if (util.isString(dr)) {
          return this.makeDriverInstance(dr);
        } else {
          throw new LogicError({
            code: ELogicCodeError.MODULE_ERROR,
            msn: `${dr} is not driver or driver name valid`,
          });
        }
      });
      //eliminar duplicados comparados con los default
      const dfDriver_f = dfDriverList.filter(
        (dfDr) =>
          !mergedDriverList.some(
            (mDr) => mDr.nameLogicDriver === dfDr.nameLogicDriver
          )
      );
      mergedDriverList = [...mergedDriverList, ...dfDriver_f];
    }
    return mergedDriverList;
  }
}
/** *Singleton*
 *
 * ...
 */
export class PrimitiveModuleFactory extends ModuleFactory {
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
    const util = TwinBeeModule.util;
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
      moduleInstance = isBaseConfig
        ? new PrimitiveLogicProvider({
            ...(baseConfig as any),
            driverList: this.makeDriversFromList(baseConfig["driverList"]),
          })
        : new PrimitiveLogicProvider({
            driverList: this.makeDriversFromList(undefined),
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
export class StructureModuleFactory extends ModuleFactory {
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
    const util = TwinBeeModule.util;
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
      moduleInstance = isBaseConfig
        ? new StructureLogicProvider({
            ...(baseConfig as any),
            driverList: this.makeDriversFromList(baseConfig["driverList"]),
          })
        : new StructureLogicProvider({
            driverList: this.makeDriversFromList(undefined),
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
