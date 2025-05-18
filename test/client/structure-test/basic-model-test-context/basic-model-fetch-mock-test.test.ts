//❗❗Imports que deben iniciar❗❗
import { describe, expect, it } from "vitest";
import startTwinBee from "../../../../src/start-twinbee";
//imports secundarios
import { FetchDriver } from "../../../../src/logic/providers/drivers/client/web/https/fetch/fetch-driver";
import {
  ELogicResStatusCode,
  IStructureResponse,
} from "../../../../src/logic/reports/shared-types";
import { StructureLibraryMockQueryFn } from "../../mocks/library-mock-query-fn";
import { MockServerHandler } from "../../mocks/mock-server";
import { bd_valid, dataValid } from "./basic-model-static-dummy-data-test";
import { BasicModelTest, getBasicModelTestCtrl } from "./basic-model-test";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
const GC = startTwinBee({
  environment: {
    envTest: "test-node",
    envGlobalLayout: "client",
    envStandard: "dev",
  },
});
describe("Model: basic-model-test", async () => {
  const ctrl = getBasicModelTestCtrl();
  const util = ctrl.twinBeeUtil;
  const nameLogicDriver = FetchDriver.getNameLogicDriver();
  const commonBaseCriteria = ctrl.getEmptyBaseModelCriteria();
  commonBaseCriteria.diccGlobalAC = {
    structureProvider: { singleRunDriver: { nameLogicDriver } },
  };
  describe("base: data valid", async () => {
    const mSH = new MockServerHandler<BasicModelTest>(ctrl as any, {
      srcSelector: "plural",
      db_collection: bd_valid,
      nameLogicDriver,
    });
    const db = mSH.getDBCollection();
    it("action request: readAll", async () => {
      mSH.microBackend.customQueryFn = undefined as any;
      const txData = undefined;
      const vExp = {
        data: db,
        status: ELogicResStatusCode.VALID_DATA,
      } as IStructureResponse;
      const res = await ctrl.readRequest({
        ...commonBaseCriteria,
        keyActionRequest: "readAll",
      });
      expect(res).toMatchObject(vExp);
    });
    it("action request: readAll (paged ang limited)", async () => {
      mSH.microBackend.customQueryFn = undefined as any;
      const txData = undefined;
      const vExp = {
        data: [db[2], db[3]], //pagina 2 (el tercer y cuarto registro)
        status: ELogicResStatusCode.VALID_DATA,
      } as IStructureResponse;
      const res = await ctrl.readRequest({
        ...commonBaseCriteria,
        keyActionRequest: "readAll",
        limit: 2, //solo 2
        targetPageLogic: 1, //lógica de inicio de paginación en 1
        targetPage: 2, //pagina 2 (serian los _id === '3' y _id === '4')
      });
      expect(res).toMatchObject(vExp);
    });
    it("action request: exists ", async () => {
      mSH.microBackend.customQueryFn =
        StructureLibraryMockQueryFn.getInstance().existByQueryParam;
      const txData = undefined;
      const vExp = {
        data: true,
        status: ELogicResStatusCode.VALID_DATA,
      } as IStructureResponse;
      const res = await ctrl.readRequest({
        ...commonBaseCriteria,
        keyActionRequest: "exist",
        diccQueryParam: { _pathDoc: "/1/" }, //buscar si existe este path
      });
      expect(res).toMatchObject(vExp);
    });
    it("action request: count ", async () => {
      mSH.microBackend.customQueryFn =
        StructureLibraryMockQueryFn.getInstance().countByQueryParam;
      const txData = undefined;
      const vExp = {
        data: 1, //pagina 2 (el tercer y cuarto registro)
        status: ELogicResStatusCode.VALID_DATA,
      } as IStructureResponse;
      const res = await ctrl.readRequest({
        ...commonBaseCriteria,
        keyActionRequest: "count",
        diccQueryParam: { _pathDoc: "/1/" }, //buscar si existe este path
      });
      expect(res).toMatchObject(vExp);
    });
    it("action request: create ", async () => {
      mSH.microBackend.customQueryFn = undefined as any;
      const txData = { ...dataValid };
      const vExp = {
        data: { ...txData },
        status: ELogicResStatusCode.VALID_DATA,
      } as IStructureResponse;
      const res = await ctrl.modifyRequest({
        ...commonBaseCriteria,
        keyActionRequest: "create",
        data: txData,
      });
      expect(res).toMatchObject(vExp);
    });
    it("action request: update ", async () => {
      mSH.microBackend.customQueryFn = undefined as any;
      const txData = { ...dataValid, _pathDoc: "     /100/       " }; //espacios para comprobar mutación
      const vExp = {
        data: { ...txData, _pathDoc: "/100/" }, //sin espacios (se mutó)
        status: ELogicResStatusCode.VALID_DATA,
      } as IStructureResponse;
      const res = await ctrl.modifyRequest({
        ...commonBaseCriteria,
        keyActionRequest: "update",
        data: txData,
      });
      expect(res).toMatchObject(vExp);
    });
    it("action request: delete ", async () => {
      mSH.microBackend.customQueryFn = undefined as any;
      const txData = { _id: dataValid._id };
      const vExp = {
        data: { ...txData },
        status: ELogicResStatusCode.VALID_DATA,
      } as IStructureResponse;
      const res = await ctrl.modifyRequest({
        ...commonBaseCriteria,
        keyActionRequest: "delete",
        data: txData as any,
      });
      expect(res).toMatchObject(vExp);
    });
  });
});
