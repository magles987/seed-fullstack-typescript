import { TwinBeeModule } from "../../../../src/logic/modules/module";
import { ModelWith_id } from "../../../../src/logic/models/model-with-_id";
import { StructureLogicMetadataHandler } from "../../../../src/logic/meta/structure-metadata-handler";
import { FetchRepository } from "../../../../src/logic/providers/repositories/client/web/https/fetch/fetch-repository";
import { CookieRepository } from "../../../../src/logic/providers/repositories/client/web/local-repositories/cookie/cookie-repository";
import { IdbRepository } from "../../../../src/logic/providers/repositories/client/web/local-repositories/idb/idb-repository";
import { StorageRepository } from "../../../../src/logic/providers/repositories/client/web/local-repositories/storage/storage-repository";

//████ Tipos personalizados ████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
type TModel = ElementalModelTest;
/** interfaz de este modelo para propósitos generales*/
//⚠ la interfaz debe permanecer **vacía**
export interface IElementalModelTest<TExtend>
  extends Partial<Record<keyof ElementalModelTest, TExtend>> {}
/**Tipado de las claves identificadoras de cada campo del modelo */
export type TKeyFieldElementalModelTest = keyof IElementalModelTest<any>;

//███ Modelo █████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** Define las propiedades del modelo
 * ❗esta clase está pensada para definición de
 * campos, no para ejecución de métodos❗
 */
export class ElementalModelTest extends ModelWith_id {
  //...aquí las propiedades
  /**ruta de acceso*/
  pathDoc: string = "";
}
//███ Constructor de Metadatos █████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
const baseModel = new ElementalModelTest();
const keySrc = StructureLogicMetadataHandler.checkKeySrc(baseModel);
/**@returns un manejador de metadatos personalizado para este modelo*/
const defineMetadataHandler = () => {
  const util = TwinBeeModule.util;
  return new StructureLogicMetadataHandler<TModel>({
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
      pathDoc: {
        __dfData: baseModel.pathDoc,
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
    },
  });
};
/**@returns la instancia de manejador actual de metadatos para este modelo */
export const getElementalModelTestMetadataHandler = () =>
  StructureLogicMetadataHandler.buildMetadataHandlerAndSetRegister(
    keySrc,
    defineMetadataHandler
  );

/**@returns la instancia del controlador asociado a este modelo */
export const getElementalModelTestCtrl = () =>
  getElementalModelTestMetadataHandler().getRootCtrlInstance();
