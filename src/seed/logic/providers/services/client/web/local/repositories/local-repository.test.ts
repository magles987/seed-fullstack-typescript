import { describe, it, expect, beforeEach } from "vitest";
import { StructureLocalCookieRepository } from "./local-cookie/structure-local-cookie-repository";
import { IBagForService, IDiccLocalRepositoryConfig } from "./shared";

const repoConfig: Partial<IDiccLocalRepositoryConfig> = {
  cookie: {},
};

describe("case: Hola Mundo", () => {
  const keySrc = "test1";
  const repo = new StructureLocalCookieRepository(keySrc, repoConfig);

  it("case: Hola Mundo", async () => {
    const bagRepository: IBagForService = {
      data: undefined,
      literalCriteria: {
        type: "read",
        keySrc,
        limit: 2,
        expectedDataType: "array",
        keyActionRequest: "readAll",
        keyLogicContext: "structure",
      },
    };
    const d = await repo.readAll(bagRepository);
    expect("hola").toBe("hola");
  });
});
