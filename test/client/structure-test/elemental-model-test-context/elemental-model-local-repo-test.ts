import { runToLocalCookie } from "./elemental-model-cookie-web-test";
import { runToLocalStorage } from "./elemental-model-storage-web-test";
import { runToLocalIdb } from "./elemental-model-idb-web-test";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**... */
export async function runModelTestBrowserContext() {
  await runToLocalCookie();
  await runToLocalStorage();
  await runToLocalIdb();
  return;
}
