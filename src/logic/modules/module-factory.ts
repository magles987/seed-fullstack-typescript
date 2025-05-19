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
import { Repository } from "../providers/repositories/_repository";
import { AxiosRepository } from "../providers/repositories/client/web/https/axios/axios-repository";
import { FetchRepository } from "../providers/repositories/client/web/https/fetch/fetch-repository";
import { CookieRepository } from "../providers/repositories/client/web/local-repositories/cookie/cookie-repository";
import { IdbRepository } from "../providers/repositories/client/web/local-repositories/idb/idb-repository";
import { StorageRepository } from "../providers/repositories/client/web/local-repositories/storage/storage-repository";
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
  /**array con los nombres de repositories predefinidos */
  private get dfNameRepositoryList() {
    //❗Debe ser en get virtual OBLIGATORIO❗
    return [
      CookieRepository.getNameLogicRepository(),
      StorageRepository.getNameLogicRepository(),
      IdbRepository.getNameLogicRepository(),
      FetchRepository.getNameLogicRepository(),
      AxiosRepository.getNameLogicRepository(),
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
  public makeRepositoryInstance(
    nameRepository: string,
    baseConfig?: unknown
  ): Repository {
    const util = TwinBeeModule.util;
    let repository: Repository;
    const isBaseConfig = util.isObject(baseConfig);
    if (nameRepository === CookieRepository.getNameLogicRepository()) {
      repository = isBaseConfig
        ? new CookieRepository(baseConfig)
        : new CookieRepository();
    } else if (nameRepository === StorageRepository.getNameLogicRepository()) {
      repository = isBaseConfig
        ? new StorageRepository()
        : new StorageRepository(baseConfig);
    } else if (nameRepository === IdbRepository.getNameLogicRepository()) {
      repository = isBaseConfig
        ? new IdbRepository(baseConfig)
        : new IdbRepository();
    } else if (nameRepository === FetchRepository.getNameLogicRepository()) {
      repository = isBaseConfig
        ? new FetchRepository(baseConfig)
        : new FetchRepository();
    } else if (nameRepository === AxiosRepository.getNameLogicRepository()) {
      repository = isBaseConfig
        ? new AxiosRepository(baseConfig)
        : new AxiosRepository();
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${nameRepository} is not repository name valid`,
      });
    }
    return repository;
  }

  /**... */
  protected makeRepositoriesFromList(
    repositoryList: Repository[] | Array<[string, object]> | string[]
  ): Repository[] {
    const util = TwinBeeModule.util;
    const dfNameList = this.dfNameRepositoryList;
    const dfRepositoryList = dfNameList.map((nameRepository) =>
      this.makeRepositoryInstance(nameRepository)
    );
    let mergedRepositoryList: Repository[] = [];
    if (!util.isArray(repositoryList)) {
      mergedRepositoryList = dfRepositoryList;
    } else {
      mergedRepositoryList = repositoryList.map((dr) => {
        if (util.isInstance(dr)) {
          return dr;
        } else if (util.isTuple(dr, [1, 2])) {
          const [nameRepository, baseConfig] = dr;
          return this.makeRepositoryInstance(nameRepository, baseConfig);
        } else if (util.isString(dr)) {
          return this.makeRepositoryInstance(dr);
        } else {
          throw new LogicError({
            code: ELogicCodeError.MODULE_ERROR,
            msn: `${dr} is not repository or repository name valid`,
          });
        }
      });
      //eliminar duplicados comparados con los default
      const dfRepository_f = dfRepositoryList.filter(
        (dfDr) =>
          !mergedRepositoryList.some(
            (mDr) => mDr.nameLogicRepository === dfDr.nameLogicRepository
          )
      );
      mergedRepositoryList = [...mergedRepositoryList, ...dfRepository_f];
    }
    return mergedRepositoryList;
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
            repositoryList: this.makeRepositoriesFromList(
              baseConfig["repositoryList"]
            ),
          })
        : new PrimitiveLogicProvider({
            repositoryList: this.makeRepositoriesFromList(undefined),
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
            repositoryList: this.makeRepositoriesFromList(
              baseConfig["repositoryList"]
            ),
          })
        : new StructureLogicProvider({
            repositoryList: this.makeRepositoriesFromList(undefined),
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
