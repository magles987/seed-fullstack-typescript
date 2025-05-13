import { reconfigure } from "./seed/start-seed";
import { getSeedEnvironment } from "./seed/logic/config/index-barrel";
import { runTestClient } from "../test/client/index-client";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
reconfigure({
  envSeed: {
    envTest: "test-browser",
    envGlobalLayout: "client",
    envStandard: "dev",
  },
});
const { envGlobalLayout } = getSeedEnvironment();
if (envGlobalLayout === "client") {
  document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <div>
      <h1> > SEED ${envGlobalLayout} </h1>
    </div>
  `;
  await runTestClient();
} else if (envGlobalLayout === "server") {
} else {
  throw new Error(`${envGlobalLayout} is not environment valid`);
}
