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
import { ModelTestCtrl } from "./model-test-ctrl";
import { bd_valid } from "./model-test-static-dummy-data";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
reconfigure({
  envSeed: {
    envTest: "test-node",
  },
});
const ctrl = new ModelTestCtrl();
const mSH = new StructureMockServerHandler(ctrl, {
  keySrcSelector: "plural",
  bd_collection: bd_valid,
});
describe("case: Hola Mundo", async () => {
  it("case: Hola Mundo", async () => {
    // const getFn = async () => {
    //   try {
    //     const response = await fetch(`http://www.mytest.com/${keySrc}/read`);
    //     if (!response.ok) {
    //       throw new Error(`Response status: ${response.status}`);
    //     }
    //     const json = await response.json();
    //     // const a = await response.text();
    //     const c = response.headers.get("Content-Type");
    //     const d = await response.status;
    //     const e = await response.statusText;

    //     return json;
    //   } catch (error) {
    //     console.error(error.message);
    //   }
    // };
    // const f = await getFn();
    const keyPath = ctrl.metadataHandler.keyModelPath;
    let res = await ctrl.runGenericModelRequest("readAll", {
      data: undefined,
      criteriaHandler: ctrl.buildCriteriaHandler("read", "readAll", {
        expectedDataType: "array",
      }),
      diccGlobalAC: {
        structureProvider: {
          runProvider: {
            serviceToRun: { keyDriver: "fetch", keyService: "http" },
          },
        },
      },
      keyPath,
    });
    expect("hola").toBe("hola");
  });
});
