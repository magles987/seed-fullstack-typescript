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
import { StructureMockServerHandler } from "../../mocks/structure/structure-mock-server";
import { ModelTestCtrl__full } from "./model-test-ctrl__full";
import { bd_valid } from "./model-test-static-dummy-data";
import { IRunProvider } from "../../../../src/seed/logic/providers/shared-for-external-module";
import { ModelTest } from "./model-test";
import {
  ELogicResStatusCode,
  IStructureResponse,
} from "../../../../src/seed/logic/reports/shared";
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
      const serviceToRun: IRunProvider["serviceToRun"] = {
        keyService: "http",
        keyDriver: "fetch",
      };
      it("action: readAll", async () => {
        const txData = undefined;
        const vExp = {
          data: db,
          status: ELogicResStatusCode.VALID_DATA,
        } as IStructureResponse;
        const res = await ctrl.readAll({
          diccGlobalAC: {
            structureProvider: { runProvider: { serviceToRun } },
          },
        });
        expect(res).toMatchObject(vExp);
      });
    });
  });
});
