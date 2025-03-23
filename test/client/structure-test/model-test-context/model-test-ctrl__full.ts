import { ModelTest } from "./model-test";
import {
  StructureLogicController,
  TKeyStructureModifyRequestController,
  TKeyStructureReadRequestController,
} from "../../../../src/seed/logic/controllers/_structure-ctrl";
import { IStructureBuilderBaseMetadata } from "../../../../src/seed/logic/meta/builder-shared";
import { StructureCriteriaHandler } from "../../../../src/seed/logic/criterias/structure-criteria-handler";
import { StructureLogicHook } from "../../../../src/seed/logic/hooks/structure-hook";
import { FieldLogicMutater } from "../../../../src/seed/logic/mutaters/field-mutater";
import { ModelLogicMutater } from "../../../../src/seed/logic/mutaters/model-mutater";
import { StructureLogicProvider } from "../../../../src/seed/logic/providers/structure-provider";
import { FieldLogicValidation } from "../../../../src/seed/logic/validators/field-validation";
import { ModelLogicValidation } from "../../../../src/seed/logic/validators/model-validation";
import { RequestLogicValidation } from "../../../../src/seed/logic/validators/request-validation";
import {
  TFieldCtrlActionFn,
  TModelCtrlActionFn,
} from "../../../../src/seed/logic/controllers/shared";
import { TCapitalizeFirstLetter } from "../../../../src/seed/util/shared";
import { CookieDriver } from "../../../../src/seed/logic/providers/_drivers/client/web/local-repositories/cookie/cookie-driver";
import { TLocalCookieCustomQueryDriverFn } from "../../../../src/seed/logic/providers/_drivers/client/web/local-repositories/cookie/shared";
import { Util_Module } from "../../../../src/seed/logic/util/util-module";
import { IStructureModelReadCriteria } from "../../../../src/seed/logic/criterias/shared";
import { Module } from "../../../../src/seed/logic/config/module";
//████ REQUEST ACTIONS ████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**claves identificadoras de las acciones de petición para el modo lectura de datos */
export type TKeyModelTestReadRequestController =
  //...aqui los nombres de las acciones de petición a usar en este controller
  TKeyStructureReadRequestController;
/**claves identificadoras de las acciones de petición para el modo modificación de datos */
export type TKeyModelTestModifyRequestController =
  //...aqui los nombres de las acciones de petición a usar en este controller
  TKeyStructureModifyRequestController;
type TModel = ModelTest;
type TStructureCriteriaInstance = StructureCriteriaHandler<TModel>;
type TFieldMutateInstance = FieldLogicMutater;
type TModelMutateInstance = ModelLogicMutater;
type TFieldValInstance = FieldLogicValidation;
type TModelValInstance = ModelLogicValidation;
type TRequestValInstance = RequestLogicValidation;
type TStructureHookInstance = StructureLogicHook;
type TStructureProviderInstance = StructureLogicProvider;
type TKeyDiccActionRequest =
  | TKeyModelTestReadRequestController
  | TKeyModelTestModifyRequestController;
type TRecordModelRequestController = Record<
  TKeyStructureReadRequestController | TKeyStructureModifyRequestController,
  TModelCtrlActionFn<
    TModel,
    TModelMutateInstance,
    TModelValInstance,
    TRequestValInstance,
    TStructureHookInstance,
    TStructureProviderInstance
  >
>;
type TRecordFieldRequestController = Record<
  `checkField${TCapitalizeFirstLetter<keyof ModelTest>}`,
  TFieldCtrlActionFn<TModel, TFieldMutateInstance, TFieldValInstance>
>;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**... */
export class ModelTestCtrl__full
  extends StructureLogicController<
    TModel,
    TStructureCriteriaInstance,
    TFieldMutateInstance,
    TModelMutateInstance,
    TFieldValInstance,
    TModelValInstance,
    TRequestValInstance,
    TStructureHookInstance,
    TStructureProviderInstance,
    TKeyDiccActionRequest
  >
  implements TRecordModelRequestController, TRecordFieldRequestController
{
  /**... */
  private static buildBaseMetadata(): IStructureBuilderBaseMetadata<
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
    const util = Module.util;
    const dfModel = new ModelTest();
    return {
      keySrc: util.getClassName(dfModel),
      customBase: {
        __dfData: dfModel,
        _id: {
          __dfData: dfModel._id ?? "1",
          __fieldType: "string",
          __emb: undefined,
          __isArray: false,
          __isVirtual: false,
          __keyPath: undefined,
          __keysProp: undefined,
          __structureType: undefined,
          __mutateConfig: {
            fieldMutate: {
              diccActionsConfig: {
                anyTrim: true,
              },
            },
          },
          __valConfig: {
            fieldVal: {
              diccActionsConfig: {
                isTypeOf: {
                  fieldType: "string",
                  isArray: false,
                },
                isRequired: true,
              },
            },
          },
          __ctrlConfig: {
            fieldCtrl: {
              criteriaRequestConfig: {
                aTKeysGlobalActionConfig: [
                  ["fieldMutate", "anyTrim"],
                  ["fieldVal", "isTypeOf"],
                  ["fieldVal", "isRequired"],
                ],
              },
            },
          },
        },
        _pathDoc: {
          __dfData: dfModel._pathDoc ?? "/1/",
          __fieldType: "string",
          __emb: undefined,
          __isArray: false,
          __isVirtual: false,
          __keyPath: undefined,
          __keysProp: undefined,
          __structureType: undefined,
          __mutateConfig: {
            fieldMutate: {
              diccActionsConfig: { anyTrim: true },
            },
          },
          __valConfig: {
            fieldVal: {
              diccActionsConfig: {
                isTypeOf: { fieldType: "string" },
                isRequired: true,
              },
            },
          },
          __ctrlConfig: {
            fieldCtrl: {
              criteriaRequestConfig: {
                aTKeysGlobalActionConfig: [
                  ["fieldMutate", "anyTrim"],
                  ["fieldVal", "isTypeOf"],
                  ["fieldVal", "isRequired"],
                ],
              },
            },
          },
        },
        __valConfig: {
          modelVal: {
            diccActionsConfig: {
              isRequired: true,
              isModel: {
                modelForDiccAC: undefined, //automatico
              },
            },
          },
        },
        __providerConfig: {
          structureProvider: {
            diccActionsConfig: {
              singleRunDriver: {
                nameLogicDriver: CookieDriver.getNameLogicDriver(),
              },
            },
          },
        },
        __ctrlConfig: {
          modelCtrl: {
            diccCriteriaRequestConfig: {
              readAll: {
                type: "read",
                keyActionRequest: "readAll",
                expectedDataType: "array",
                limit: 5,
                aTKeysGlobalActionConfig: [
                  ["structureProvider", "singleRunDriver"],
                ],
              },
              readOne: {
                type: "read",
                keyActionRequest: "readOne",
                expectedDataType: "object", //solo puede ser 1
                diccGlobalAC: {
                  structureProvider: {
                    singleRunDriver: {
                      nameLogicDriver: CookieDriver.getNameLogicDriver(),
                    },
                  },
                },
                aTKeysGlobalActionConfig: [
                  ["structureProvider", "singleRunDriver"],
                ],
                aTCustomQueryDriverFunctions: [
                  [
                    CookieDriver.getNameLogicDriver(),
                    (async (driver, literalBag, registers) => {
                      const regs = registers as TModel[];
                      const f_reg = regs.find((reg) => reg._id === "5"); //SOLO 1
                      return f_reg;
                    }) as TLocalCookieCustomQueryDriverFn,
                  ],
                ],
              },
              readMany: {
                type: "read",
                keyActionRequest: "readMany",
                expectedDataType: "array",
                limit: 5,
                aTKeysGlobalActionConfig: [
                  ["structureProvider", "singleRunDriver"],
                ],
                aTCustomQueryDriverFunctions: [
                  [
                    CookieDriver.getNameLogicDriver(),
                    (async (driver, literalBag, registers) => {
                      const regs = registers as TModel[];
                      const f_regs = regs.filter((reg) => reg._id === "5");
                      return f_regs;
                    }) as TLocalCookieCustomQueryDriverFn,
                  ],
                ],
              },
              readById: {
                type: "read",
                keyActionRequest: "readById",
                expectedDataType: "object", //solo puede ser 1
                aTKeysGlobalActionConfig: [
                  ["structureProvider", "singleRunDriver"],
                ],
                aTCustomQueryDriverFunctions: [
                  [
                    CookieDriver.getNameLogicDriver(),
                    (async (driver, literalBag, registers) => {
                      const util = Util_Module.getInstance(); //mejor usar una genérica
                      const regs = registers as TModel[];
                      const f_reg = regs.find((r) => r._id === "5"); //SOLO 1
                      return f_reg;
                    }) as TLocalCookieCustomQueryDriverFn,
                  ],
                ],
              },
              exist: {
                type: "read",
                keyActionRequest: "exist",
                expectedDataType: "boolean",
                aTKeysGlobalActionConfig: [
                  ["structureProvider", "singleRunDriver"],
                ],
                aTCustomQueryDriverFunctions: [
                  [
                    CookieDriver.getNameLogicDriver(),
                    (async (driver, literalBag, registers) => {
                      const util = Util_Module.getInstance(); //mejor usar una genérica
                      const { literalCriteria } = literalBag;
                      const { diccQueryParam } =
                        literalCriteria as IStructureModelReadCriteria<TModel>;
                      const { _pathDoc } = diccQueryParam; //los parámetros para construir la consulta o filtración
                      const regs = registers as TModel[];
                      const f_reg = regs.find(
                        (reg) => reg._pathDoc === _pathDoc
                      );
                      const isExist = util.isNotUndefinedAndNotNull(f_reg);
                      return isExist;
                    }) as TLocalCookieCustomQueryDriverFn,
                  ],
                ],
              },
              count: {
                type: "read",
                keyActionRequest: "count",
                expectedDataType: "number",
                aTKeysGlobalActionConfig: [
                  ["structureProvider", "singleRunDriver"],
                ],
                aTCustomQueryDriverFunctions: [
                  [
                    CookieDriver.getNameLogicDriver(),
                    (async (driver, literalBag, registers) => {
                      const util = Util_Module.getInstance(); //mejor usar una genérica
                      const { literalCriteria } = literalBag;
                      const { diccQueryParam } =
                        literalCriteria as IStructureModelReadCriteria<TModel>;
                      const { _id_range } = diccQueryParam; //los parámetros para construir la consulta o filtración
                      const regs = registers as TModel[];
                      const f_regs = regs.filter((reg) => {
                        const r = (_id_range as any[]).includes(reg._id);
                        return r;
                      });
                      const counter = util.isNotUndefinedAndNotNull(f_regs);
                      return counter;
                    }) as TLocalCookieCustomQueryDriverFn,
                  ],
                ],
              },
              inform: {
                type: "read",
                keyActionRequest: "inform",
                expectedDataType: "string",
                aTKeysGlobalActionConfig: [
                  ["structureProvider", "singleRunDriver"],
                ],
              },
              create: {
                type: "modify",
                modifyType: "create",
                keyActionRequest: "create",
                expectedDataType: "object",
                isCreateOrUpdate: true,
                aTKeysGlobalActionConfig: [
                  ["modelMutate", "mutateModel"],
                  ["modelVal", "isTypeOfModel"],
                  ["modelVal", "isModel"],
                  ["structureProvider", "singleRunDriver"],
                ],
              },
              update: {
                type: "modify",
                modifyType: "update",
                keyActionRequest: "update",
                expectedDataType: "object",
                isCreateOrUpdate: true,
                aTKeysGlobalActionConfig: [
                  ["modelMutate", "mutateModel"],
                  ["modelVal", "isTypeOfModel"],
                  ["modelVal", "isModel"],
                  ["structureProvider", "singleRunDriver"],
                ],
              },
              delete: {
                type: "modify",
                modifyType: "delete",
                keyActionRequest: "delete",
                expectedDataType: "object",
                //isCreateOrUpdate: true,
                aTKeysGlobalActionConfig: [
                  //["modelMutate", "mutateModel"],
                  //["modelVal", "isTypeOfModel"],
                  //["modelVal", "isModel"],
                  ["structureProvider", "singleRunDriver"],
                ],
              },
            },
          },
        },
      },
      customDiccModuleInstance: {
        //...aqui instancias de módulos personalizados
        driversList: [new CookieDriver()],
      },
    };
  }
  /***/
  constructor() {
    super(ModelTestCtrl__full.buildBaseMetadata());
  }
  //████ Field Actions ████████████████████████████████████████████████████████████

  //████ Request Actions ████████████████████████████████████████████████████████████
}
