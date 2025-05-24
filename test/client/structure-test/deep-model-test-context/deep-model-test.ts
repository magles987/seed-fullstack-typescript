import { TwinBeeModule } from "../../../../src/logic/modules/module";
import { ModelWith_id } from "../../../../src/logic/models/model-with-_id";
import { IStructureModelReadCriteria } from "../../../../src/logic/criterias/shared-types";
import {
  TFieldMutateInstance,
  TModelMutateInstance,
  TFieldValInstance,
  TModelValInstance,
  TRequestValInstance,
  TStructureHookInstance,
  TStructureProviderInstance,
  TKeyStructureDiccActionRequest,
  TStructureCtrlInstance,
} from "../../../../src/logic/meta/base-shared-types";
import { StructureLogicMetadataHandler } from "../../../../src/logic/meta/structure-metadata-handler";
import { FetchRepository } from "../../../../src/logic/providers/repositories/client/web/https/fetch/fetch-repository";
import { CookieRepository } from "../../../../src/logic/providers/repositories/client/web/local-repositories/cookie/cookie-repository";
import { TStructureCookieCustomQueryRepositoryFn } from "../../../../src/logic/providers/repositories/client/web/local-repositories/cookie/shared-types";
import { IdbRepository } from "../../../../src/logic/providers/repositories/client/web/local-repositories/idb/idb-repository";
import { StorageRepository } from "../../../../src/logic/providers/repositories/client/web/local-repositories/storage/storage-repository";

//████ Tipos personalizados ████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
type TModel = DeepModelTest;
type TFMI = TFieldMutateInstance;
type TMMI = TModelMutateInstance;
type TFVI = TFieldValInstance;
type TMVI = TModelValInstance;
type TRVI = TRequestValInstance;
type TSHI = TStructureHookInstance;
type TSPI = TStructureProviderInstance;
type TKeyDAR = TKeyStructureDiccActionRequest<
  never, //aquí los tipo read personalizados (reemplazar `never`)
  never //aquí los tipo modify personalizados (reemplazar `never`)
>;
type TSCI = TStructureCtrlInstance<
  TModel,
  TFMI,
  TMMI,
  TFVI,
  TMVI,
  TRVI,
  TSHI,
  TSPI,
  TKeyDAR
>;
/** interfaz de este modelo para propósitos generales*/
//⚠ la interfaz debe permanecer **vacía**
export interface IDeepModelTest<TExtend>
  extends Partial<Record<keyof DeepModelTest, TExtend>> {}
/**Tipado de las claves identificadoras de cada campo del modelo */
export type TKeyFieldDeepModelTest = keyof IDeepModelTest<any>;
//███ Modelo █████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** Define las propiedades del modelo
 * ❗esta clase está pensada para definición de
 * campos, no para ejecución de métodos❗
 */
export class DeepModelTest extends ModelWith_id {
  //...aquí las propiedades
  public myAnonymObject = { a: 0, b: "", c: true };
  public myAnonymArray = [] as string[];
}
//███ Constructor de Metadatos █████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
const baseModel = new DeepModelTest();
const keySrc = StructureLogicMetadataHandler.checkKeySrc(baseModel);
/**@returns un manejador de metadatos personalizado para este modelo*/
const defineMetadataHandler = () => {
  const util = TwinBeeModule.util;
  return new StructureLogicMetadataHandler<
    TModel,
    TFMI,
    TMMI,
    TFVI,
    TMVI,
    TRVI,
    TSHI,
    TSPI,
    TKeyDAR,
    TSCI
  >({
    keySrc,
    baseMeta: {
      __dfData: baseModel,
      __structureType: "structureModel",
      // __mutateInstance: {}, //configuración personalizada o instancia personalizada
      // __valInstance: {}, //configuración personalizada o instancia personalizada
      // __requestValInstance: {}, //configuración personalizada o instancia personalizada
      // __hookInstance: {}, //configuración personalizada o instancia personalizada
      __providerInstance: {
        repositoryList: [
          //new CookieRepository(),
          //new StorageRepository(),
          //new IdbRepository(),
          new FetchRepository({
            urlRoot: "http://www.mytest.com",
            srcSelector: "plural",
          }),
        ],
      },
      __ctrlInstance: {
        diccCriteriaRequestConfig: {
          readAll: {
            type: "read",
            keyActionRequest: "readAll",
            expectedDataType: "array",
            limit: 5,
            aTGlobalActionConfig: [
              [
                "structureProvider",
                "singleRunRepository",
                {
                  nameLogicRepository:
                    CookieRepository.getNameLogicRepository(),
                },
              ],
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
            aTGlobalActionConfig: [
              [
                "structureProvider",
                "singleRunRepository",
                {
                  nameLogicRepository:
                    CookieRepository.getNameLogicRepository(),
                },
              ],
            ],
            aTCustomQueryRepositoryFn: [
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
            aTGlobalActionConfig: [
              [
                "structureProvider",
                "singleRunRepository",
                {
                  nameLogicRepository:
                    CookieRepository.getNameLogicRepository(),
                },
              ],
            ],
            aTCustomQueryRepositoryFn: [
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
            aTGlobalActionConfig: [
              [
                "structureProvider",
                "singleRunRepository",
                {
                  nameLogicRepository:
                    CookieRepository.getNameLogicRepository(),
                },
              ],
            ],
            aTCustomQueryRepositoryFn: [
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
            aTGlobalActionConfig: [
              [
                "structureProvider",
                "singleRunRepository",
                {
                  nameLogicRepository:
                    CookieRepository.getNameLogicRepository(),
                },
              ],
            ],
            aTCustomQueryRepositoryFn: [
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
            aTGlobalActionConfig: [
              [
                "structureProvider",
                "singleRunRepository",
                {
                  nameLogicRepository:
                    CookieRepository.getNameLogicRepository(),
                },
              ],
            ],
            aTCustomQueryRepositoryFn: [
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
          create: {
            type: "modify",
            modifyType: "create",
            keyActionRequest: "create",
            expectedDataType: "object",
            isCreateOrUpdate: true,
            aTGlobalActionConfig: [
              //["modelMutate", "mutateModel", { modelForDiccAC: undefined }],
              ["modelVal", "isTypeOfModel", true],
              ["structureCtrl", "checkAllFields", true],
              [
                "structureProvider",
                "singleRunRepository",
                {
                  nameLogicRepository:
                    CookieRepository.getNameLogicRepository(),
                },
              ],
            ],
          },
          update: {
            type: "modify",
            modifyType: "update",
            keyActionRequest: "update",
            expectedDataType: "object",
            isCreateOrUpdate: true,
            aTGlobalActionConfig: [
              //["modelMutate", "mutateModel", { modelForDiccAC: undefined }],
              ["modelVal", "isTypeOfModel", true],
              ["structureCtrl", "checkAllFields", true],
              [
                "structureProvider",
                "singleRunRepository",
                {
                  nameLogicRepository:
                    CookieRepository.getNameLogicRepository(),
                },
              ],
            ],
          },
          delete: {
            type: "modify",
            modifyType: "delete",
            keyActionRequest: "delete",
            expectedDataType: "object",
            //isCreateOrUpdate: true,
            aTGlobalActionConfig: [
              //["modelMutate", "mutateModel", {modelForDiccAC: undefined}],
              //["modelVal", "isTypeOfModel", true],
              //["modelVal", "isModel", {modelForDiccAC: undefined}],
              [
                "structureProvider",
                "singleRunRepository",
                {
                  nameLogicRepository:
                    CookieRepository.getNameLogicRepository(),
                },
              ],
            ],
          },
        },
      },
      _id: {
        __dfData: baseModel._id,
        __fieldType: "string",
        __emb: undefined,
        __isArray: false,
        __isVirtual: false,
        __ctrlInstance: {
          criteriaFieldRequestConfig: {
            aTGlobalActionConfig: [
              ["fieldMutate", "anyTrim", true],
              ["fieldVal", "isTypeOf", true],
              ["fieldVal", "isRequired", true],
            ],
          },
        },
      },
      myAnonymObject: {
        __dfData: baseModel.myAnonymObject,
        __fieldType: "object",
        __ctrlInstance: {
          criteriaFieldRequestConfig: {},
        },
      },
      myAnonymArray: {
        __dfData: baseModel.myAnonymArray,
        __fieldType: "string",
        __isArray: true,
      },
    },
  });
};
/**@returns la instancia de manejador actual de metadatos para este modelo */
export const getDeepModelTestMetadataHandler = () =>
  StructureLogicMetadataHandler.buildMetadataHandlerAndSetRegister(
    keySrc,
    defineMetadataHandler
  );
/**@returns la instancia del controlador asociado a este modelo */
export const getDeepModelTestCtrl = () =>
  getDeepModelTestMetadataHandler().getRootCtrlInstance();
