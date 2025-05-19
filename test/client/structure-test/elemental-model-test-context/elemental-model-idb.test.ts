import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
  beforeAll,
  afterAll,
} from "vitest";
import startTwinBee from "../../../../src/start-twinbee";
import { getElementalModelTestCtrl } from "./elemental-model-test";
import { bd_valid, dataValid } from "./elemental-model-static-dummy-data-test";
import {
  ELogicResStatusCode,
  IStructureResponse,
} from "../../../../src/logic/reports/shared-types";
import { IdbRepository } from "../../../../src/logic/providers/repositories/client/web/local-repositories/idb/idb-repository";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
const GC = startTwinBee({
  environment: {
    envTest: "test-node",
    envGlobalLayout: "client",
    envStandard: "dev",
  },
});

//ERROR de simulación

// describe("IndexedDB CRUD Operations", () => {
//   let mockDB: {
//     [storeName: string]: {
//       [key: string]: any;
//     };
//   } = {};

//   beforeEach(() => {
//     mockDB = {};

//     vi.stubGlobal("indexedDB", {
//       open: vi.fn().mockImplementation((dbName: string, version?: number) => {
//         const request: any = {
//           onupgradeneeded: null,
//           onsuccess: null,
//           onerror: null,
//           result: {
//             name: dbName,
//             version: version || 1,
//             createObjectStore: vi
//               .fn()
//               .mockImplementation((storeName: string) => {
//                 mockDB[storeName] = {};
//                 return {
//                   createIndex: vi.fn(),
//                 };
//               }),
//             transaction: vi
//               .fn()
//               .mockImplementation(
//                 (storeNames: string | string[], mode?: IDBTransactionMode) => {
//                   const stores = Array.isArray(storeNames)
//                     ? storeNames
//                     : [storeNames];
//                   return {
//                     objectStore: vi
//                       .fn()
//                       .mockImplementation((storeName: string) => {
//                         if (!stores.includes(storeName)) {
//                           throw new Error(
//                             `Store ${storeName} not in transaction`
//                           );
//                         }

//                         return {
//                           put: (value: any) => {
//                             const request: any = {
//                               onsuccess: null,
//                               onerror: null,
//                             };

//                             setTimeout(() => {
//                               mockDB[storeName][value.id] = value;
//                               if (request.onsuccess) {
//                                 request.onsuccess(new Event("success"));
//                               }
//                             }, 0);

//                             return request;
//                           },
//                           get: (key: string) => {
//                             const request: any = {
//                               onsuccess: null,
//                               onerror: null,
//                               result: undefined,
//                             };

//                             setTimeout(() => {
//                               request.result = mockDB[storeName][key];
//                               if (request.onsuccess) {
//                                 request.onsuccess(new Event("success"));
//                               }
//                             }, 0);

//                             return request;
//                           },
//                           delete: (key: string) => {
//                             const request: any = {
//                               onsuccess: null,
//                               onerror: null,
//                             };

//                             setTimeout(() => {
//                               delete mockDB[storeName][key];
//                               if (request.onsuccess) {
//                                 request.onsuccess(new Event("success"));
//                               }
//                             }, 0);

//                             return request;
//                           },
//                           getAll: () => {
//                             const request: any = {
//                               onsuccess: null,
//                               onerror: null,
//                               result: undefined,
//                             };

//                             setTimeout(() => {
//                               request.result = Object.values(mockDB[storeName]);
//                               if (request.onsuccess) {
//                                 request.onsuccess(new Event("success"));
//                               }
//                             }, 0);

//                             return request;
//                           },
//                         };
//                       }),
//                     oncomplete: null,
//                     onerror: null,
//                     abort: vi.fn(),
//                     commit: vi.fn(),
//                   };
//                 }
//               ),
//             close: vi.fn(),
//           },
//         };

//         // Simular éxito de apertura
//         setTimeout(() => {
//           if (request.onsuccess) {
//             request.onsuccess({ target: { result: request.result } });
//           }
//         }, 0);

//         return request;
//       }),
//     });
//   });

//   afterEach(() => {
//     vi.unstubAllGlobals();
//   });

//   it("should perform full CRUD operations", async () => {
//     // 1. Crear la base de datos
//     const db = await new Promise<IDBDatabase>((resolve, reject) => {
//       const request = indexedDB.open("testDB", 1);

//       request.onupgradeneeded = (event: any) => {
//         const db = event.target.result;
//         db.createObjectStore("items", { keyPath: "id" });
//       };

//       request.onsuccess = (event: any) => resolve(event.target.result);
//       request.onerror = () => reject(new Error("Failed to open DB"));
//     });

//     // 2. Operación CREATE (put)
//     await new Promise<void>((resolve, reject) => {
//       const tx = db.transaction("items", "readwrite");
//       const store = tx.objectStore("items");
//       const request = store.put({ id: "1", name: "Test Item" });

//       request.onsuccess = () => resolve();
//       request.onerror = () => reject(new Error("Put failed"));
//     });

//     // 3. Operación READ (get)
//     const item = await new Promise<any>((resolve, reject) => {
//       const tx = db.transaction("items", "readonly");
//       const store = tx.objectStore("items");
//       const request = store.get("1");

//       request.onsuccess = () => resolve(request.result);
//       request.onerror = () => reject(new Error("Get failed"));
//     });

//     expect(item).toEqual({ id: "1", name: "Test Item" });

//     // 4. Operación UPDATE (put)
//     await new Promise<void>((resolve, reject) => {
//       const tx = db.transaction("items", "readwrite");
//       const store = tx.objectStore("items");
//       const request = store.put({ id: "1", name: "Updated Item" });

//       request.onsuccess = () => resolve();
//       request.onerror = () => reject(new Error("Update failed"));
//     });

//     // 5. Verificar UPDATE
//     const updatedItem = await new Promise<any>((resolve) => {
//       const tx = db.transaction("items", "readonly");
//       const store = tx.objectStore("items");
//       const request = store.get("1");

//       request.onsuccess = () => resolve(request.result);
//     });

//     expect(updatedItem).toEqual({ id: "1", name: "Updated Item" });

//     // 6. Operación DELETE
//     await new Promise<void>((resolve, reject) => {
//       const tx = db.transaction("items", "readwrite");
//       const store = tx.objectStore("items");
//       const request = store.delete("1");

//       request.onsuccess = () => resolve();
//       request.onerror = () => reject(new Error("Delete failed"));
//     });

//     // 7. Verificar DELETE
//     const deletedItem = await new Promise<any>((resolve) => {
//       const tx = db.transaction("items", "readonly");
//       const store = tx.objectStore("items");
//       const request = store.get("1");

//       request.onsuccess = () => resolve(request.result);
//     });

//     expect(deletedItem).toBeUndefined();
//   });

//   // //inicial test
//   // const ctrl = getElementalModelTestCtrl();
//   // const util = ctrl.twinBeeUtil;
//   // const nameLogicRepository = IdbRepository.getNameLogicRepository();
//   // const commonBaseCriteria = ctrl.getEmptyBaseModelCriteria();
//   // commonBaseCriteria.diccGlobalAC = {
//   //   structureProvider: { singleRunRepository: { nameLogicRepository } },
//   // };
//   // describe("base: data valid", async () => {
//   //   const db = bd_valid;
//   //   //████ Creación y comprobación inicial ████████████████████████████████████████████████████████████
//   //   //====Crear todos los registros===========================
//   //   //debe ser for clásico para que haga las esperas correspondientes a cada creación
//   //   for (let idx = 0; idx < db.length; idx++) {
//   //     const data = db[idx];
//   //     it(`action request: create (register[${idx}])`, async () => {
//   //       const vExp = {
//   //         data: { ...data },
//   //         status: ELogicResStatusCode.VALID_DATA,
//   //       } as IStructureResponse;
//   //       let res = await ctrl.modifyRequest({
//   //         ...commonBaseCriteria,
//   //         data,
//   //         keyActionRequest: "create",
//   //       });
//   //       expect(res).toMatchObject(vExp);
//   //     });
//   //   }
//   //   //====Leer todos los registros (para verificar) ===========================
//   //   it("action request: readAll", async () => {
//   //     //const txData = { ...dataValid };
//   //     const vExp = {
//   //       data: [...db],
//   //       status: ELogicResStatusCode.VALID_DATA,
//   //     } as IStructureResponse;
//   //     let res = await ctrl.readRequest({
//   //       ...commonBaseCriteria,
//   //       keyActionRequest: "readAll",
//   //     });
//   //     expect(res).toMatchObject(vExp);
//   //   });
//   //   it("action request: readAll (paged ang limited)", async () => {
//   //     const txData = undefined;
//   //     const vExp = {
//   //       data: [db[2], db[3]], //pagina 2 (el tercer y cuarto registro)
//   //       status: ELogicResStatusCode.VALID_DATA,
//   //     } as IStructureResponse;
//   //     const res = await ctrl.readRequest({
//   //       ...commonBaseCriteria,
//   //       keyActionRequest: "readAll",
//   //       limit: 2, //solo 2
//   //       targetPageLogic: 1, //lógica de inicio de paginación en 1
//   //       targetPage: 2, //pagina 2 (serian los _id === '3' y _id === '4')
//   //     });
//   //     expect(res).toMatchObject(vExp);
//   //   });
//   //   it("action request: exists ", async () => {
//   //     const txData = undefined;
//   //     const vExp = {
//   //       data: true,
//   //       status: ELogicResStatusCode.VALID_DATA,
//   //     } as IStructureResponse;
//   //     const res = await ctrl.readRequest({
//   //       ...commonBaseCriteria,
//   //       keyActionRequest: "exist",
//   //       diccQueryParam: { pathDoc: "/1/" }, //buscar si existe este path
//   //     });
//   //     expect(res).toMatchObject(vExp);
//   //   });
//   //   it("action request: count ", async () => {
//   //     const txData = undefined;
//   //     const vExp = {
//   //       data: 1, //pagina 2 (el tercer y cuarto registro)
//   //       status: ELogicResStatusCode.VALID_DATA,
//   //     } as IStructureResponse;
//   //     const res = await ctrl.readRequest({
//   //       ...commonBaseCriteria,
//   //       keyActionRequest: "count",
//   //       diccQueryParam: { pathDoc: "/1/" }, //buscar si existe este path
//   //     });
//   //     expect(res).toMatchObject(vExp);
//   //   });
//   //   it("action request: create ", async () => {
//   //     const txData = { ...dataValid };
//   //     const vExp = {
//   //       data: { ...txData },
//   //       status: ELogicResStatusCode.VALID_DATA,
//   //     } as IStructureResponse;
//   //     const res = await ctrl.modifyRequest({
//   //       ...commonBaseCriteria,
//   //       keyActionRequest: "create",
//   //       data: txData,
//   //     });
//   //     expect(res).toMatchObject(vExp);
//   //   });
//   //   it("action request: update ", async () => {
//   //     const txData = { ...dataValid, pathDoc: "     /100/       " }; //espacios para comprobar mutación
//   //     const vExp = {
//   //       data: { ...txData, pathDoc: "/100/" }, //sin espacios (se mutó)
//   //       status: ELogicResStatusCode.VALID_DATA,
//   //     } as IStructureResponse;
//   //     const res = await ctrl.modifyRequest({
//   //       ...commonBaseCriteria,
//   //       keyActionRequest: "update",
//   //       data: txData,
//   //     });
//   //     expect(res).toMatchObject(vExp);
//   //   });
//   //   it("action request: delete ", async () => {
//   //     const txData = { _id: dataValid._id };
//   //     const vExp = {
//   //       data: { ...txData },
//   //       status: ELogicResStatusCode.VALID_DATA,
//   //     } as IStructureResponse;
//   //     const res = await ctrl.modifyRequest({
//   //       ...commonBaseCriteria,
//   //       keyActionRequest: "delete",
//   //       data: txData as any,
//   //     });
//   //     expect(res).toMatchObject(vExp);
//   //   });
//   // });
// });
