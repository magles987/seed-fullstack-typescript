import { reconfigure } from "../../../../../src/seed/start-seed";
import {
  describe,
  expect,
  test,
  it,
  afterAll,
  afterEach,
  beforeAll,
} from "vitest";
import { StructureMockServerHandler } from "../../../mocks/structure/structure-mock-server";
import { ModelTestCtrl__full } from "../model-test-ctrl__full";
import { bd_valid } from "../model-test-static-dummy-data";
import { ModelTest } from "../model-test";
import {
  ELogicResStatusCode,
  IStructureResponse,
} from "../../../../../src/seed/logic/reports/shared";
import { FetchDriver } from "../../../../../src/seed/logic/providers/_drivers/client/web/https/fetch/fetch-driver";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
reconfigure({
  envSeed: {
    envTest: "test-node",
  },
});

describe("GLobal test (modelTest)", async () => {
  const ctrl = new ModelTestCtrl__full();
  describe("base: data valid", async () => {
    const mSH = new StructureMockServerHandler<ModelTest>(ctrl, {
      keySrcSelector: "plural",
      bd_collection: bd_valid,
    });
    const db = mSH.getDBCollection();
    describe("http Driver: fetch", async () => {
      const driver = new FetchDriver({
        urlRoot: "",
      });
      it("action: readAll", async () => {
        const txData = undefined;
        const vExp = {
          data: db,
          status: ELogicResStatusCode.VALID_DATA,
        } as IStructureResponse;
        const res = await ctrl.readAll({
          diccGlobalAC: {
            structureProvider: { singleRunDriver: driver },
          },
        });
        expect(res).toMatchObject(vExp);
      });
      it("action: create", async () => {
        const txData = {
          _id: "10",
          _pathDoc: "/10/",
        } as ModelTest;
        const vExp = {
          data: db,
          status: ELogicResStatusCode.VALID_DATA,
        } as IStructureResponse;
        const res = await ctrl.create(
          {
            diccGlobalAC: {
              structureProvider: { runProvider: { serviceToRun } },
            },
          },
          {
            ...txData,
          }
        );
        expect(res).toMatchObject(vExp);
      });
    });
  });
});
