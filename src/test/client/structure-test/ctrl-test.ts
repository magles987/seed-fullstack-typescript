import { ModelTest } from "./model-test";
import {
  StructureLogicController,
  TKeyStructureModifyRequestController,
  TKeyStructureReadRequestController,
} from "../../../seed/logic/controllers/_structure-ctrl";
import { IStructureBuilderBaseMetadata } from "../../../seed/logic/meta/metadata-builder-shared";
import { StructureCriteriaHandler } from "../../../seed/logic/criterias/structure-criteria-handler";
import { StructureLogicHook } from "../../../seed/logic/hooks/structure-hook";
import { FieldLogicMutater } from "../../../seed/logic/mutaters/field-mutater";
import { ModelLogicMutater } from "../../../seed/logic/mutaters/model-mutater";
import { StructureLogicProvider } from "../../../seed/logic/providers/structure-provider";
import { FieldLogicValidation } from "../../../seed/logic/validators/field-validation";
import { ModelLogicValidation } from "../../../seed/logic/validators/model-validation";
import { RequestLogicValidation } from "../../../seed/logic/validators/request-validation";

//████ REQUEST ACTIONS ████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**claves identificadoras de las acciones de peticion para el modo lectura de datos */
export type TKeyModelTestReadRequestController =
  //...aqui los nombres de las acciones de peticion a usar en este controller
  TKeyStructureReadRequestController;
/**claves identificadoras de las acciones de peticion para el modo modificacion de datos */
export type TKeyModelTestModifyRequestController =
  //...aqui los nombres de las acciones de peticion a usar en este controller
  TKeyStructureModifyRequestController;

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████

/**... */
export class ModelTestCtrl
  //...aqui los tipos de instancia personalizadas de cada modulo
  extends StructureLogicController<
    ModelTest,
    StructureCriteriaHandler<ModelTest>,
    ReturnType<
      (typeof ModelTestCtrl)["buildBaseMetadata"]
    >["customDiccModuleInstance"]["fieldMutate"],
    ReturnType<
      (typeof ModelTestCtrl)["buildBaseMetadata"]
    >["customDiccModuleInstance"]["modelMutate"],
    ReturnType<
      (typeof ModelTestCtrl)["buildBaseMetadata"]
    >["customDiccModuleInstance"]["fieldVal"],
    ReturnType<
      (typeof ModelTestCtrl)["buildBaseMetadata"]
    >["customDiccModuleInstance"]["modelVal"],
    ReturnType<
      (typeof ModelTestCtrl)["buildBaseMetadata"]
    >["customDiccModuleInstance"]["requestVal"],
    ReturnType<
      (typeof ModelTestCtrl)["buildBaseMetadata"]
    >["customDiccModuleInstance"]["structureHook"],
    ReturnType<
      (typeof ModelTestCtrl)["buildBaseMetadata"]
    >["customDiccModuleInstance"]["structureProvider"],
    TKeyModelTestReadRequestController | TKeyModelTestModifyRequestController
  >
{
  // implements
  //   Record<
  //     TKeyModelTestReadRequestController | TKeyModelTestModifyRequestController,
  //     TModelFnBagForCtrl<
  //       //...aqui los tipos de interfaces de acciones personalizadas de cada modulo del modelo
  //       IStructureBagForModelCtrlContext<ModelTest>
  //     >
  //   >,
  //   Record<
  //     `_checkField${TCapitalizeFirstLetter<TKeyFields>}`,
  //     //...aqui los tipos de interfaces de acciones personalizadas de cada modulo del campo
  //     TFieldFnBagForCtrl<IStructureBagForFieldCtrlContext>
  //   >
  /**... */
  private static buildBaseMetadata(): IStructureBuilderBaseMetadata<
    ModelTest,
    FieldLogicMutater,
    ModelLogicMutater,
    FieldLogicValidation,
    ModelLogicValidation,
    RequestLogicValidation,
    StructureLogicHook,
    StructureLogicProvider,
    TKeyModelTestReadRequestController | TKeyModelTestModifyRequestController
  > {
    return {
      keySrc: "ModelTest",
      customBase: {
        _id: {
          __dfData: "1",
          __fieldType: "string",
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
              aTKeysForReq: [
                ["fieldMutate", "anyTrim"],
                ["fieldVal", "isTypeOf"],
                ["fieldVal", "isRequired"],
              ],
            },
          },
        },
        _pathDoc: {
          __dfData: "/1/",
          __fieldType: "string",
        },
        __dfData: new ModelTest(),
        __valConfig: {
          modelVal: {
            diccActionsConfig: {
              isRequired: true,
              isModel: {
                modelForDiccAC: {},
              },
            },
          },
        },
        __providerConfig: {
          structureProvider: {
            diccActionsConfig: {
              runProvider: {
                serviceConfig: {
                  client: {
                    web: {
                      local: {
                        keyLocalRepository: "cookie",
                      },
                      http: {
                        keyHttpDriver: "fetch",
                        urlConfig: {
                          urlRoot: "www.test.com",
                        },
                        diccDriverConfig: {
                          fetch: {},
                        },
                      },
                    },
                  },
                },
                serviceToRun: { keyService: "local" },
              },
            },
          },
        },
        __ctrlConfig: {
          modelCtrl: {
            diccATKeyCRUD: {
              readAll: [["structureProvider", "runProvider"]],
              create: [
                ["modelVal", "isTypeOfModel"],
                ["modelVal", "isRequired"],
                ["modelVal", "isModel"],
                ["structureProvider", "runProvider"],
              ],
              update: [],
              delete: [],

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
    super(ModelTestCtrl.buildBaseMetadata());
  }
  //████ Field Actions ████████████████████████████████████████████████████████████

  //████ Request Actions ████████████████████████████████████████████████████████████
}
