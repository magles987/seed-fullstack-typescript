import { runPrimitiveTestClient } from "./primitive-test/index-primitive-client";
import { runStructureTestClient } from "./structure-test/index-structutre-client";
export async function runTestClient() {
  await runPrimitiveTestClient();
  await runStructureTestClient();
  return;
}
