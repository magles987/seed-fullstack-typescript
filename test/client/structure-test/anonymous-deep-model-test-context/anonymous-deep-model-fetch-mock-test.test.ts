//❗❗Imports que deben iniciar❗❗
import { describe, expect, it } from "vitest";
import startTwinBee from "../../../../src/start-twinbee";
//imports secundarios
import { FetchRepository } from "../../../../src/logic/providers/repositories/client/web/https/fetch/fetch-repository";
import {
  ELogicResStatusCode,
  IStructureResponse,
} from "../../../../src/logic/reports/shared-types";
import { StructureLibraryMockQueryFn } from "../../mocks/library-mock-query-fn";
import { MockServerHandler } from "../../mocks/mock-server";
import {
  bd_valid,
  dataValid,
} from "./anonymous-deep-model-static-dummy-data-test";
import {
  AnonymousDeepModelTest,
  getAnonymousDeepModelTestCtrl,
} from "./anonymous-deep-model-test";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
const GC = startTwinBee({
  environment: {
    envTest: "test-node",
    envGlobalLayout: "client",
    envStandard: "dev",
  },
});
describe("Model: elemental-model-test", async () => {
  const ctrl = getAnonymousDeepModelTestCtrl();
  const util = ctrl.twinBeeUtil;
  const nameLogicRepository = FetchRepository.getNameLogicRepository();
  const commonBaseCriteria = ctrl.getEmptyBaseModelCriteria();
  commonBaseCriteria.diccGlobalAC = {
    structureProvider: { singleRunRepository: { nameLogicRepository } },
  };
  describe("base: data valid", async () => {
    const mSH = new MockServerHandler<AnonymousDeepModelTest>(ctrl as any, {
      srcSelector: "plural",
      db_collection: bd_valid,
      nameLogicRepository,
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
      const txData = { ...dataValid, pathDoc: "     /100/       " }; //espacios para comprobar mutación
      const vExp = {
        data: { ...txData, pathDoc: "/100/" }, //sin espacios (se mutó)
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
