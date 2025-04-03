import { runToLocalCookie } from "./elemental-model-cookie-test";
import { runToLocalStorage } from "./elemental-model-storage-test";
import { runToLocalIdb } from "./elemental-model-idb-test";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**... */
export async function runModelTestBrowserContext() {
  await runToLocalCookie();
  await runToLocalStorage();
  await runToLocalIdb();
  return;
}
