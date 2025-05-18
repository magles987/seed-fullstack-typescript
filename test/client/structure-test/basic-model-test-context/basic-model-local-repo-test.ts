import { runToLocalCookie } from "./basic-model-cookie-web-test";
import { runToLocalStorage } from "./basic-model-storage-web-test";
import { runToLocalIdb } from "./basic-model-idb-web-test";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**... */
export async function runBasicModelTestBrowserContext() {
  await runToLocalCookie();
  await runToLocalStorage();
  await runToLocalIdb();
  return;
}
