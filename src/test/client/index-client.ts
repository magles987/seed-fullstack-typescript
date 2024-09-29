import { runPrimitiveTestClient } from "./primitive-test/index-primitive-client";
import { runStructureTestClient } from "./structure-test/index-structutre-client";
export function runTestClient() {
  return {
    ...runPrimitiveTestClient(),
    ...runStructureTestClient(),
  };
}
