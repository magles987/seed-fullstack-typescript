import { ModelTest } from "./model-test";
import {
  StructureLogicController,
  TKeyStructureModifyRequestController,
  TKeyStructureReadRequestController,
} from "../../../../src/seed/logic/controllers/_structure-ctrl";
import { IStructureBuilderBaseMetadata } from "../../../../src/seed/logic/meta/metadata-builder-shared";
import { StructureCriteriaHandler } from "../../../../src/seed/logic/criterias/structure-criteria-handler";
import { StructureLogicHook } from "../../../../src/seed/logic/hooks/structure-hook";
import { FieldLogicMutater } from "../../../../src/seed/logic/mutaters/field-mutater";
import { ModelLogicMutater } from "../../../../src/seed/logic/mutaters/model-mutater";
import { StructureLogicProvider } from "../../../../src/seed/logic/providers/structure-provider";
import { FieldLogicValidation } from "../../../../src/seed/logic/validators/field-validation";
import { ModelLogicValidation } from "../../../../src/seed/logic/validators/model-validation";
import { RequestLogicValidation } from "../../../../src/seed/logic/validators/request-validation";
import { Util_Ctrl } from "../../../../src/seed/logic/controllers/_util-ctrl";
import {
  TFieldCtrlActionFn,
  TModelCtrlActionFn,
} from "../../../../src/seed/logic/controllers/_shared";
import { TCapitalizeFirstLetter } from "../../../../src/seed/util/shared";
//████ REQUEST ACTIONS ████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**claves identificadoras de las acciones de petición para el modo lectura de datos */
export type TKeyModelTestReadRequestController =
  //...aqui los nombres de las acciones de petición a usar en este controller
  TKeyStructureReadRequestController;
/**claves identificadoras de las acciones de peticion para el modo modificacion de datos */
export type TKeyModelTestModifyRequestController =
  //...aqui los nombres de las acciones de peticion a usar en este controller
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
    TModelMutateInstance["dfDiccActionConfig"],
    TModelValInstance["dfDiccActionConfig"],
    TRequestValInstance["dfDiccActionConfig"],
    TStructureHookInstance["dfDiccActionConfig"],
    TStructureProviderInstance["dfDiccActionConfig"]
  >
>;
type TRecordFieldRequestController = Record<
  `checkField${TCapitalizeFirstLetter<keyof ModelTest>}`,
  TFieldCtrlActionFn<
    TModel,
    TFieldMutateInstance["dfDiccActionConfig"],
    TFieldValInstance["dfDiccActionConfig"]
  >
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
    const util = Util_Ctrl.getInstance();
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
              aTKeysActionRequest: [
                ["fieldMutate", "anyTrim"],
                ["fieldVal", "isTypeOf"],
                ["fieldVal", "isRequired"],
              ],
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
              aTKeysActionRequest: [
                ["fieldMutate", "anyTrim"],
                ["fieldVal", "isTypeOf"],
                ["fieldVal", "isRequired"],
              ],
            },
          },
        },
        __valConfig: {
          modelVal: {
            diccActionsConfig: {
              isRequired: true,
              isModel: {
                modelOnlyFieldDiccAC: undefined, //automatico
              },
            },
          },
        },
        __providerConfig: {
          structureProvider: {
            diccActionsConfig: {
              runProvider: {
                serviceToRun: { keyService: "http", keyDriver: "fetch" },
                serviceConfig: {
                  client: {
                    web: {
                      http: {
                        diccDriverConfig: {
                          axios: {
                            urlRoot: "http://www.mytest.com",
                          },
                          fetch: {
                            urlRoot: "http://www.mytest.com",
                          },
                        },
                      },
                    },
                    app: {},
                  },
                },
              },
            },
          },
        },
        __ctrlConfig: {
          modelCtrl: {
            diccATKeysActionRequest: {
              readAll: [["structureProvider", "runProvider"]],
              count: [["structureProvider", "runProvider"]],
              create: [
                ["modelMutate", "mutateModel"],
                ["modelVal", "isTypeOfModel"],
                ["modelVal", "isRequired"],
                ["modelVal", "isModel"],
                ["structureProvider", "runProvider"],
              ],
              update: [
                ["modelMutate", "mutateModel"],
                ["modelVal", "isTypeOfModel"],
                ["modelVal", "isRequired"],
                ["modelVal", "isModel"],
                ["structureProvider", "runProvider"],
              ],
              delete: [["structureProvider", "runProvider"]],
              //createMany: [[]],
              //updateMany: [],
              //deleteMany: [],
            },
          },
        },
      },
      customDiccModuleInstance: {
        //...aqui instancias de modulos personalizados
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
