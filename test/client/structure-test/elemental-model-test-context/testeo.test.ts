import { describe, expect, it } from "vitest";
//import { reconfigure } from "../../../../src/seed/start-seed";
import { GlobalConfig } from "../../../../src/seed/logic/config/index-barrel";

//import { FetchDriver } from "../../../../src/seed/logic/providers/_drivers/index-barrel";
// import {
//   ELogicResStatusCode,
//   IStructureResponse,
// } from "../../../../src/seed/logic/reports/index-barrel";
// import { Util_Test } from "../../../util-test";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
// reconfigure({
//   envSeed: {
//     envTest: "test-node",
//   },
// });
GlobalConfig.getInstance();
//const util = Util_Test.getInstance();
//const nameLogicDriver = FetchDriver.getNameLogicDriver();

describe("GLobal test (modelTest)", async () => {
  it("action: readAll", async () => {
    expect(1).toBe(1);
  });
});
