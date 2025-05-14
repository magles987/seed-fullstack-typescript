import { Module } from "../../../../src/logic/modules/module";
import { Model } from "../../../../src/logic/models/_model";
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
import { FetchDriver } from "../../../../src/logic/providers/_drivers/client/web/https/fetch/fetch-driver";
import { CookieDriver } from "../../../../src/logic/providers/_drivers/client/web/local-repositories/cookie/cookie-driver";
import { TStructureCookieCustomQueryDriverFn } from "../../../../src/logic/providers/_drivers/client/web/local-repositories/cookie/shared-types";
import { IdbDriver } from "../../../../src/logic/providers/_drivers/client/web/local-repositories/idb/idb-driver";
import { StorageDriver } from "../../../../src/logic/providers/_drivers/client/web/local-repositories/storage/storage-driver";

//████ Tipos personalizados ████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
type TModel = ElementalModelTest;
type TFMI = TFieldMutateInstance;
type TMMI = TModelMutateInstance;
type TFVI = TFieldValInstance;
type TMVI = TModelValInstance;
type TRVI = TRequestValInstance;
type TSHI = TStructureHookInstance;
type TSPI = TStructureProviderInstance;
type TKeyDAR = TKeyStructureDiccActionRequest<
  "inform", //aquí los tipo read personalizados (reemplazar `never`)
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
export interface IElementalModelTest<TExtend>
  extends Partial<Record<keyof ElementalModelTest, TExtend>> {}
/**Tipado de las claves identificadoras de cada campo del modelo */
export type TKeyFieldElementalModelTest = keyof IElementalModelTest<any>;
//███ definición modelo █████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** Define las propiedades del modelo
 * ❗esta clase está pensada para definición de
 * campos, no para ejecución de métodos❗
 */
export class ElementalModelTest extends Model {
  //...aquí las propiedades
}
//███ Constructor de Metadatos █████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**utilidades de módulos */
const util = Module.util;
/**@returns un manejador de metadatos personalizado para este modelo*/
function buildMetadataHandler() {
  const baseModel = new ElementalModelTest();
  const keySrc = util.getClassName(baseModel);
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
        driverList: [
          new CookieDriver(),
          new StorageDriver(),
          new IdbDriver(),
          new FetchDriver({
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
                "singleRunDriver",
                { nameLogicDriver: CookieDriver.getNameLogicDriver() },
              ],
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
            aTGlobalActionConfig: [
              [
                "structureProvider",
                "singleRunDriver",
                { nameLogicDriver: CookieDriver.getNameLogicDriver() },
              ],
            ],
            aTCustomQueryDriverFunctions: [
              [
                CookieDriver.getNameLogicDriver(),
                CookieDriver.getStructureLibraryQueryFn<TModel>()
                  .readByQueryParam,
              ],
              [
                StorageDriver.getNameLogicDriver(),
                StorageDriver.getStructureLibraryQueryFn().readByQueryParam,
              ],
              [
                IdbDriver.getNameLogicDriver(),
                IdbDriver.getStructureLibraryQueryFn().readByQueryParam,
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
                "singleRunDriver",
                { nameLogicDriver: CookieDriver.getNameLogicDriver() },
              ],
            ],
            aTCustomQueryDriverFunctions: [
              [
                CookieDriver.getNameLogicDriver(),
                CookieDriver.getStructureLibraryQueryFn<TModel>()
                  .readByQueryParam,
              ],
              [
                StorageDriver.getNameLogicDriver(),
                StorageDriver.getStructureLibraryQueryFn().readByQueryParam,
              ],
              [
                IdbDriver.getNameLogicDriver(),
                IdbDriver.getStructureLibraryQueryFn().readByQueryParam,
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
                "singleRunDriver",
                { nameLogicDriver: CookieDriver.getNameLogicDriver() },
              ],
            ],
            aTCustomQueryDriverFunctions: [
              [
                CookieDriver.getNameLogicDriver(),
                CookieDriver.getStructureLibraryQueryFn<TModel>().readById,
              ],
              [
                StorageDriver.getNameLogicDriver(),
                StorageDriver.getStructureLibraryQueryFn().readById,
              ],
              [
                IdbDriver.getNameLogicDriver(),
                IdbDriver.getStructureLibraryQueryFn().readById,
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
                "singleRunDriver",
                { nameLogicDriver: CookieDriver.getNameLogicDriver() },
              ],
            ],
            aTCustomQueryDriverFunctions: [
              [
                CookieDriver.getNameLogicDriver(),
                CookieDriver.getStructureLibraryQueryFn<TModel>()
                  .existByQueryParam,
              ],
              [
                StorageDriver.getNameLogicDriver(),
                StorageDriver.getStructureLibraryQueryFn().existByQueryParam,
              ],
              [
                IdbDriver.getNameLogicDriver(),
                IdbDriver.getStructureLibraryQueryFn().existByQueryParam,
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
                "singleRunDriver",
                { nameLogicDriver: CookieDriver.getNameLogicDriver() },
              ],
            ],
            aTCustomQueryDriverFunctions: [
              [
                CookieDriver.getNameLogicDriver(),
                CookieDriver.getStructureLibraryQueryFn<TModel>()
                  .countByQueryParam,
              ],
              [
                StorageDriver.getNameLogicDriver(),
                StorageDriver.getStructureLibraryQueryFn().countByQueryParam,
              ],
              [
                IdbDriver.getNameLogicDriver(),
                IdbDriver.getStructureLibraryQueryFn().countByQueryParam,
              ],
            ],
          },
          inform: {
            type: "read",
            keyActionRequest: "inform",
            expectedDataType: "string",
            aTGlobalActionConfig: [
              [
                "structureProvider",
                "singleRunDriver",
                { nameLogicDriver: CookieDriver.getNameLogicDriver() },
              ],
            ],
            aTCustomQueryDriverFunctions: [
              [
                CookieDriver.getNameLogicDriver(),
                (async (driver, literalCriteria, registers) => {
                  const util = Module.util; //mejor usar una genérica
                  const { diccQueryParam } =
                    literalCriteria as IStructureModelReadCriteria<TModel>;
                  const regs = registers as TModel[];
                  const f_regs = regs.filter((reg) =>
                    util.isEquivalentTo([reg, diccQueryParam])
                  );
                  const counter = f_regs.length;
                  return counter;
                }) as TStructureCookieCustomQueryDriverFn<TModel>,
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
                "singleRunDriver",
                { nameLogicDriver: CookieDriver.getNameLogicDriver() },
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
                "singleRunDriver",
                { nameLogicDriver: CookieDriver.getNameLogicDriver() },
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
                "singleRunDriver",
                { nameLogicDriver: CookieDriver.getNameLogicDriver() },
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
      _pathDoc: {
        __dfData: baseModel._pathDoc,
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
}
/**instancia actual del manejador de metadatos */
let metadataHandlerInstance = undefined as unknown as ReturnType<
  typeof buildMetadataHandler
>;
/**@returns la instancia de manejador actual de metadatos para este modelo */
export function getElementalModelTestMetadataHandler() {
  if (!util.isInstance(metadataHandlerInstance))
    metadataHandlerInstance = buildMetadataHandler();
  return metadataHandlerInstance;
}
/**@returns la instancia del controlador asociado a este modelo */
export function getElementalModelTestCtrl() {
  return getElementalModelTestMetadataHandler().getRootCtrlInstance();
}
