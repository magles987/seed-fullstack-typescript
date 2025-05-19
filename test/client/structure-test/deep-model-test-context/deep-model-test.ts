import { StructureLogicController } from "../../../../src/seed/logic/controllers/structure-ctrl";
import {
  TStructureBaseDiccModuleInstance,
  TStructureBaseRepositoriesList,
  TStructureBaseMetadata,
} from "../../../../src/seed/logic/controllers/builder-ctrl-shared";
import { StructureCriteriaHandler } from "../../../../src/seed/logic/criterias/structure-criteria-handler";
import { StructureLogicHook } from "../../../../src/seed/logic/hooks/structure-hook";
import { FieldLogicMutater } from "../../../../src/seed/logic/mutaters/field-mutater";
import { ModelLogicMutater } from "../../../../src/seed/logic/mutaters/model-mutater";
import { StructureLogicProvider } from "../../../../src/seed/logic/providers/structure-provider";
import { FieldLogicValidation } from "../../../../src/seed/logic/validators/field-validation";
import { ModelLogicValidation } from "../../../../src/seed/logic/validators/model-validation";
import { RequestLogicValidation } from "../../../../src/seed/logic/validators/request-validation";
import {
  TKeyStructureDiccRequestCtrl,
  TKeyStructureModifyRequestCtrl,
  TKeyStructureReadRequestCtrl,
} from "../../../../src/seed/logic/controllers/shared";
import { CookieRepository } from "../../../../src/seed/logic/providers/_repositories/client/web/local-repositories/cookie/cookie-repository";
import { TStructureCookieCustomQueryRepositoryFn } from "../../../../src/seed/logic/providers/_repositories/client/web/local-repositories/cookie/shared";
import {
  IStructureModelReadCriteria,
  TStructureModelDiccGlobalAC,
} from "../../../../src/seed/logic/criterias/shared";
import { Module } from "../../../../src/seed/logic/config/module";
import { IdbRepository } from "../../../../src/seed/logic/providers/_repositories/client/web/local-repositories/idb/_idb-repository";
import { StorageRepository } from "../../../../src/seed/logic/providers/_repositories/client/web/local-repositories/storage/storage-repository";
import { FetchRepository } from "../../../../src/seed/logic/providers/_repositories/client/web/https/fetch/fetch-repository";
import { Model } from "../../../../src/seed/logic/models/_model";
import { buildIdByStrategy } from "../../../../src/seed/logic/util/default-generators-id-fn";
import { IStructureDeepMutateContext } from "../../../../src/seed/logic/mutaters/shared";
import { IStructureDeepValContext } from "../../../../src/seed/logic/validators/shared";
import { IStructureHookContext } from "../../../../src/seed/logic/hooks/shared";
import { IStructureProviderContext } from "../../../../src/seed/logic/providers/shared";
//████ Tipos personalizados ████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
type TKeyReadRequestCtrl =
  // aquí las claves identificadoras personalizadas de peticiones para este controller
  "inform" | TKeyStructureReadRequestCtrl;
type TKeyModifyRequestCtrl =
  //  aquí las claves identificadoras personalizadas de peticiones para este controller
  TKeyStructureModifyRequestCtrl;
type TKeyDiccActionRequest = TKeyStructureDiccRequestCtrl<
  TKeyReadRequestCtrl,
  TKeyModifyRequestCtrl
>;
type TFieldMutateInstance = FieldLogicMutater;
type TModelMutateInstance = ModelLogicMutater;
type TFieldValInstance = FieldLogicValidation;
type TModelValInstance = ModelLogicValidation;
type TRequestValInstance = RequestLogicValidation;
type TStructureHookInstance = StructureLogicHook;
type TStructureProviderInstance = StructureLogicProvider;
type TStructureCriteriaInstance = StructureCriteriaHandler<
  TModel,
  TFieldMutateInstance["dfDiccActionConfig"],
  TModelMutateInstance["dfDiccActionConfig"],
  TFieldValInstance["dfDiccActionConfig"],
  TModelValInstance["dfDiccActionConfig"],
  TRequestValInstance["dfDiccActionConfig"],
  TStructureHookInstance["dfDiccActionConfig"],
  TStructureProviderInstance["dfDiccActionConfig"],
  TKeyDiccActionRequest
>;
type TModel = DeepModelTest;
/** interfaz de este modelo para propósitos generales*/
//⚠ la interfaz debe permanecer **vacía**
export interface IDeepModelTest<TExtend>
  extends Partial<Record<keyof DeepModelTest, TExtend>> {}
/**Tipado de las claves identificadoras de cada campo del modelo */
export type TKeyFieldDeepModelTest = keyof IDeepModelTest<any>;
//███ definición modelo █████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** Define las propiedades del modelo
 * ❗esta clase está pensada para definición de
 * campos, no para ejecución de métodos❗
 */
export class DeepModelTest extends Model {
  _id: string = buildIdByStrategy("df_micro_uuid");
  anonObject: { pStr: string; pNum: number } = { pNum: 2, pStr: "hola" };
  //boleano: boolean = false;
  // texto :string = "";
  // texto_tel: string;
  // texto_email: string;
  // texto_url: string;
  // texto_pw: string;
  // v_text_c_pw: string;
  // texto_radio: string;
  // texto_checkbox: string[];
  // texto_switch: string[];
  // texto_select: string;
  // numero: number = 5;
  // numero_range: number = 8;
  // numero_especial_counter: number = 0;
  // numero_especial_rating: number = 3;
  // numero_radio: number[] = [5];
  // numero_checkbox: number[] = [1, 3];
  // numero_switch: number = 3;
  // numero_select: number[] = [1];
  // objeto_radio:Object = {};
  // objeto_checkbox:Object[] = [];
  // objeto_switch: Object[] = [];
  // a_texto:string[] = [];
  // a_numero:number[] = [];
  // a_boleano:boolean[] = [];
  // a_objeto:Object[] = [];
}
//███ configuración controlador █████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
const util = Module.util;
/**
 * @real
 * Construye el controlador configurado para este modelo
 * @returns instancia del controlador ya configurado
 */
function buildCtrlInstance() {
  const baseModel = new DeepModelTest();
  const repositoriesList: TStructureBaseRepositoriesList = [
    new CookieRepository(),
    new StorageRepository(),
    new IdbRepository(),
    new FetchRepository({
      urlRoot: "http://www.mytest.com",
      srcSelector: "plural",
    }),
  ];
  const customDiccModuleInstance: TStructureBaseDiccModuleInstance<
    TFieldMutateInstance,
    TModelMutateInstance,
    TFieldValInstance,
    TModelValInstance,
    TRequestValInstance,
    TStructureHookInstance,
    TStructureProviderInstance
  > = {
    repositoriesList,
    //...aquí instancias de módulos personalizados si se requieren
  };
  const customBaseMetadata: TStructureBaseMetadata<
    TModel,
    TFieldMutateInstance,
    TModelMutateInstance,
    TFieldValInstance,
    TModelValInstance,
    TRequestValInstance,
    TStructureHookInstance,
    TStructureProviderInstance,
    TKeyDiccActionRequest
  > = {
    __dfData: baseModel,
    __valConfig: {
      modelVal: {
        diccActionsConfig: {
          isRequired: true,
          isModel: {
            modelForDiccAC: undefined as any, //automatico
          },
        },
      },
    },
    __providerConfig: {
      structureProvider: {
        diccActionsConfig: {
          singleRunRepository: {
            nameLogicRepository: CookieRepository.getNameLogicRepository(),
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
              ["structureProvider", "singleRunRepository"],
            ],
          },
          readOne: {
            type: "read",
            keyActionRequest: "readOne",
            expectedDataType: "object", //solo puede ser 1
            diccGlobalAC: {
              structureProvider: {
                singleRunRepository: {
                  nameLogicRepository:
                    CookieRepository.getNameLogicRepository(),
                },
              },
            },
            aTKeysGlobalActionConfig: [
              ["structureProvider", "singleRunRepository"],
            ],
            aTCustomQueryRepositoryFunctions: [
              [
                CookieRepository.getNameLogicRepository(),
                CookieRepository.getStructureLibraryQueryFn<TModel>()
                  .readByQueryParam,
              ],
              [
                StorageRepository.getNameLogicRepository(),
                StorageRepository.getStructureLibraryQueryFn().readByQueryParam,
              ],
              [
                IdbRepository.getNameLogicRepository(),
                IdbRepository.getStructureLibraryQueryFn().readByQueryParam,
              ],
            ],
          },
          readMany: {
            type: "read",
            keyActionRequest: "readMany",
            expectedDataType: "array",
            limit: 5,
            aTKeysGlobalActionConfig: [
              ["structureProvider", "singleRunRepository"],
            ],
            aTCustomQueryRepositoryFunctions: [
              [
                CookieRepository.getNameLogicRepository(),
                CookieRepository.getStructureLibraryQueryFn<TModel>()
                  .readByQueryParam,
              ],
              [
                StorageRepository.getNameLogicRepository(),
                StorageRepository.getStructureLibraryQueryFn().readByQueryParam,
              ],
              [
                IdbRepository.getNameLogicRepository(),
                IdbRepository.getStructureLibraryQueryFn().readByQueryParam,
              ],
            ],
          },
          readById: {
            type: "read",
            keyActionRequest: "readById",
            expectedDataType: "object", //solo puede ser 1
            aTKeysGlobalActionConfig: [
              ["structureProvider", "singleRunRepository"],
            ],
            aTCustomQueryRepositoryFunctions: [
              [
                CookieRepository.getNameLogicRepository(),
                CookieRepository.getStructureLibraryQueryFn<TModel>().readById,
              ],
              [
                StorageRepository.getNameLogicRepository(),
                StorageRepository.getStructureLibraryQueryFn().readById,
              ],
              [
                IdbRepository.getNameLogicRepository(),
                IdbRepository.getStructureLibraryQueryFn().readById,
              ],
            ],
          },
          exist: {
            type: "read",
            keyActionRequest: "exist",
            expectedDataType: "boolean",
            aTKeysGlobalActionConfig: [
              ["structureProvider", "singleRunRepository"],
            ],
            aTCustomQueryRepositoryFunctions: [
              [
                CookieRepository.getNameLogicRepository(),
                CookieRepository.getStructureLibraryQueryFn<TModel>()
                  .existByQueryParam,
              ],
              [
                StorageRepository.getNameLogicRepository(),
                StorageRepository.getStructureLibraryQueryFn()
                  .existByQueryParam,
              ],
              [
                IdbRepository.getNameLogicRepository(),
                IdbRepository.getStructureLibraryQueryFn().existByQueryParam,
              ],
            ],
          },
          count: {
            type: "read",
            keyActionRequest: "count",
            expectedDataType: "number",
            aTKeysGlobalActionConfig: [
              ["structureProvider", "singleRunRepository"],
            ],
            aTCustomQueryRepositoryFunctions: [
              [
                CookieRepository.getNameLogicRepository(),
                CookieRepository.getStructureLibraryQueryFn<TModel>()
                  .countByQueryParam,
              ],
              [
                StorageRepository.getNameLogicRepository(),
                StorageRepository.getStructureLibraryQueryFn()
                  .countByQueryParam,
              ],
              [
                IdbRepository.getNameLogicRepository(),
                IdbRepository.getStructureLibraryQueryFn().countByQueryParam,
              ],
            ],
          },
          inform: {
            type: "read",
            keyActionRequest: "inform",
            expectedDataType: "string",
            aTKeysGlobalActionConfig: [
              ["structureProvider", "singleRunRepository"],
            ],
            aTCustomQueryRepositoryFunctions: [
              [
                CookieRepository.getNameLogicRepository(),
                (async (repository, literalBag, registers) => {
                  const util = Module.util; //mejor usar una genérica
                  const { literalCriteria } = literalBag;
                  const { diccQueryParam } =
                    literalCriteria as IStructureModelReadCriteria<TModel>;
                  const regs = registers as TModel[];
                  const f_regs = regs.filter((reg) =>
                    util.isEquivalentTo([reg, diccQueryParam])
                  );
                  const counter = f_regs.length;
                  return counter;
                }) as TStructureCookieCustomQueryRepositoryFn<TModel>,
              ],
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
              ["structureProvider", "singleRunRepository"],
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
              ["structureProvider", "singleRunRepository"],
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
              ["structureProvider", "singleRunRepository"],
            ],
          },
        },
      },
    },
    _id: {
      __dfData: baseModel._id,
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
            isTypeOf: true,
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
      __dfData: baseModel._pathDoc ?? "/1/",
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
            isTypeOf: true,
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
    anonObject: {
      __dfData: baseModel.anonObject,
      __fieldType: "object",
      __emb: util.dfValue as any,
      __isArray: false,
      __valConfig: {
        fieldVal: {
          diccActionsConfig: {
            isTypeOf: true,
            isAnonymusObject: {
              isAllowedExtraProp: false,
              schemaForATActionConfig: {
                pStr: [
                  ["isTypeOf", { fieldType: "string", isArray: false }],
                  ["isRequired", true],
                ],
                pNum: [
                  ["isTypeOf", { fieldType: "number", isArray: false }],
                  ["isRequired", true],
                ],
              },
            },
          },
        },
      },
    },
  };
  return new StructureLogicController<
    TModel,
    TFieldMutateInstance,
    TModelMutateInstance,
    TFieldValInstance,
    TModelValInstance,
    TRequestValInstance,
    TStructureHookInstance,
    TStructureProviderInstance,
    TKeyDiccActionRequest,
    TStructureCriteriaInstance
  >({
    keySrc: util.getClassName(baseModel),
    customDiccModuleInstance,
    customBaseMetadata,
  });
}
/** almacena la instancia actual del controller de este modelo
 * (funciona como un singleton artesanal, sin clase) */
let currentCtrl = undefined as unknown as ReturnType<typeof buildCtrlInstance>;
/**
 * @facade
 * Construye el controlador configurado para este modelo
 * @returns instancia del controlador ya configurado
 */
export function buildElementalModelTestCtrl() {
  if (util.isInstance(currentCtrl)) return currentCtrl;
  currentCtrl = buildCtrlInstance();
  return currentCtrl;
}

/*--------------------------------*/
/*--------------------------------*/
/*--------------------------------*/
/*--------------------------------*/
/*--------------------------------*/
/*---- <INICIO CONSTRUCCION> -----*/
export type TStructureModelDiccGlobalAC2<
  TIDiccModelMutateAC,
  TIDiccModelValAC,
  TIDiccRequestValAC,
  TIDiccStructureHookAC,
  TIDiccStructureProviderAC
> = Pick<
  IStructureDeepMutateContext<any, Partial<TIDiccModelMutateAC>>,
  "modelMutate"
> &
  Pick<
    IStructureDeepValContext<
      any,
      Partial<TIDiccModelValAC>,
      Partial<TIDiccRequestValAC>
    >,
    "modelVal" | "requestVal"
  > & //no necesita Pick
  IStructureHookContext<Partial<TIDiccStructureHookAC>> & //no necesita Pick
  IStructureProviderContext<Partial<TIDiccStructureProviderAC>>;

type TSchema = TStructureModelDiccGlobalAC2<
  TModelMutateInstance["dfDiccActionConfig"],
  TModelValInstance["dfDiccActionConfig"],
  TRequestValInstance["dfDiccActionConfig"],
  TStructureHookInstance["dfDiccActionConfig"],
  TStructureProviderInstance["dfDiccActionConfig"]
>;
const d: TSchema = {
  modelVal: { isRequired: null },
};
type TKeysSort = Array<
  {
    [K1 in keyof TSchema]: {
      [K2 in keyof TSchema[K1]]: [K1, K2, TSchema[K1][K2]];
    }[keyof TSchema[K1]];
  }[keyof TSchema]
>;
const caso1: TKeysSort = [["modelVal", "isModel", { isNullAsModel: true }]];
/*---- <FIN CONSTRUCCION> --------*/
/*--------------------------------*/
/*--------------------------------*/
/*--------------------------------*/
/*--------------------------------*/
/*--------------------------------*/
