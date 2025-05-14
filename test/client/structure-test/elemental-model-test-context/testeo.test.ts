import { describe, expect, it } from "vitest";
//import { reconfigure } from "../../../../src/seed/start-seed";

import { FetchDriver } from "../../../../src/logic/providers/_drivers/client/web/https/fetch/fetch-driver";
import {
  ELogicResStatusCode,
  IStructureResponse,
} from "../../../../src/logic/reports/shared-types";
import { Util_Test } from "../../../util-test";
import { GlobalConfig } from "../../../../src/config/global-config";

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
