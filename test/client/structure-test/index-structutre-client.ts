import { runModelTestBrowserContext } from "./model-test-context/model-test-browser-test-context";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**... */
export async function runStructureTestClient() {
  await runModelTestBrowserContext();
  return;
}
