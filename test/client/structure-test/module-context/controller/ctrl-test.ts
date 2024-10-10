import { ModelTest } from "../model/model-test";
import {
  StructureLogicController,
} from "../../../../../src/seed/logic/controllers/_structure-ctrl";
import { IStructureBuilderBaseMetadata } from "../../../../../src/seed/logic/meta/metadata-builder-shared";
import { Util_Ctrl } from "../../../../../src/seed/logic/controllers/_util-ctrl";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**... */
export class ModelTestCtrl extends StructureLogicController<ModelTest> {
  /** */
  private static buildBaseMetadata(): IStructureBuilderBaseMetadata<ModelTest> {
    const util = Util_Ctrl.getInstance();
    const dfModel = new ModelTest();
    return {
      keySrc: util.getClassName(dfModel),
      customBase: {
        _id: {
          __dfData: dfModel._id ?? "1",
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
          __dfData: dfModel._pathDoc ?? "/1/",
          __fieldType: "string",
        },
        __dfData: dfModel,
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
                serviceToRun: { keyService: "local", keyDriver: "cookie" },
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
}
