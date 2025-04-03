import { reconfigure } from "../../../../src/seed/start-seed";
import {
  describe,
  expect,
  test,
  it,
  afterAll,
  afterEach,
  beforeAll,
} from "vitest";
import { bd_valid, dataValid } from "./elemental-model-static-dummy-data-test";
import {
  ELogicResStatusCode,
  IStructureResponse,
} from "../../../../src/seed/logic/reports/shared";
import { FetchDriver } from "../../../../src/seed/logic/providers/_drivers/client/web/https/fetch/fetch-driver";
import { Util_Test } from "../../../util-test";
import {
  buildElementalModelTestCtrl,
  ElementalModelTest,
} from "./elemental-model-test";
import { MockServerHandler } from "../../mocks/mock-server";
import { HttpDriver } from "../../../../src/seed/logic/providers/_drivers/client/web/https/_https-driver";
import { StructureLibraryMockQueryFn } from "../../mocks/library-mock-query-fn";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
reconfigure({
  envSeed: {
    envTest: "test-node",
  },
});
const util = Util_Test.getInstance();
const ctrl = buildElementalModelTestCtrl();
const nameLogicDriver = FetchDriver.getNameLogicDriver();
const commonBaseCriteria = ctrl.getEmptyBaseModelCritera();
commonBaseCriteria.diccGlobalAC = {
  structureProvider: { singleRunDriver: { nameLogicDriver } },
};
describe("GLobal test (modelTest)", async () => {
  describe("base: data valid", async () => {
    const mSH = new MockServerHandler<ElementalModelTest>(ctrl, {
      srcSelector: "plural",
      db_collection: bd_valid,
      nameLogicDriver,
    });
    const db = mSH.getDBCollection();
    it("action: readAll", async () => {
      mSH.microBackend.customQueryFn = undefined as any;
      const txData = undefined;
      const vExp = {
        data: db,
        status: ELogicResStatusCode.VALID_DATA,
      } as IStructureResponse;
      const res = await ctrl.readRequest("readAll", {
        ...commonBaseCriteria,
      });
      expect(res).toMatchObject(vExp);
    });
    it("action: readAll (paged ang limited)", async () => {
      mSH.microBackend.customQueryFn = undefined as any;
      const txData = undefined;
      const vExp = {
        data: [db[2], db[3]], //pagina 2 (el tercer y cuarto registro)
        status: ELogicResStatusCode.VALID_DATA,
      } as IStructureResponse;
      const res = await ctrl.readRequest("readAll", {
        ...commonBaseCriteria,
        limit: 2, //solo 2
        targetPageLogic: 1, //lógica de inicio de paginación en 1
        targetPage: 2, //pagina 2 (serian los _id === '3' y _id === '4')
      });
      expect(res).toMatchObject(vExp);
    });
    it("action: exists ", async () => {
      mSH.microBackend.customQueryFn =
        StructureLibraryMockQueryFn.getInstance().existByQueryParam;
      const txData = undefined;
      const vExp = {
        data: true,
        status: ELogicResStatusCode.VALID_DATA,
      } as IStructureResponse;
      const res = await ctrl.readRequest("exist", {
        ...commonBaseCriteria,
        diccQueryParam: { _pathDoc: "/1/" }, //buscar si existe este path
      });
      expect(res).toMatchObject(vExp);
    });
    it("action: count ", async () => {
      mSH.microBackend.customQueryFn =
        StructureLibraryMockQueryFn.getInstance().countByQueryParam;
      const txData = undefined;
      const vExp = {
        data: 1, //pagina 2 (el tercer y cuarto registro)
        status: ELogicResStatusCode.VALID_DATA,
      } as IStructureResponse;
      const res = await ctrl.readRequest("count", {
        ...commonBaseCriteria,
        diccQueryParam: { _pathDoc: "/1/" }, //buscar si existe este path
      });
      expect(res).toMatchObject(vExp);
    });
    it("action: create ", async () => {
      mSH.microBackend.customQueryFn = undefined as any;
      const txData = { ...dataValid };
      const vExp = {
        data: { ...txData },
        status: ELogicResStatusCode.VALID_DATA,
      } as IStructureResponse;
      const res = await ctrl.modifyRequest("create", txData, {
        ...commonBaseCriteria,
      });
      expect(res).toMatchObject(vExp);
    });
    it("action: update ", async () => {
      mSH.microBackend.customQueryFn = undefined as any;
      const txData = { ...dataValid, _pathDoc: "     /100/       " }; //espacios para comprobar mutación
      const vExp = {
        data: { ...txData, _pathDoc: "/100/" }, //sin espacios (se mutó)
        status: ELogicResStatusCode.VALID_DATA,
      } as IStructureResponse;
      const res = await ctrl.modifyRequest("update", txData, {
        ...commonBaseCriteria,
      });
      expect(res).toMatchObject(vExp);
    });
    it("action: delete ", async () => {
      mSH.microBackend.customQueryFn = undefined as any;
      const txData = { _id: dataValid._id };
      const vExp = {
        data: { ...txData },
        status: ELogicResStatusCode.VALID_DATA,
      } as IStructureResponse;
      const res = await ctrl.modifyRequest("delete", txData, {
        ...commonBaseCriteria,
      });
      expect(res).toMatchObject(vExp);
    });
  });
});
