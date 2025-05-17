//❗❗Imports que deben iniciar❗❗
import startTwinBee from "./src/start-twinbee";
import { runTestClient } from "./test/client/index-client";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
const GC = startTwinBee({
  environment: {
    envGlobalLayout: "client",
    envStandard: "dev",
    envTest: "test-browser",
  },
});
const { envGlobalLayout } = GC.environment;
if (envGlobalLayout === "client") {
  document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <div>
      <h1> > SEED ${envGlobalLayout} </h1>
    </div>
  `;
  await runTestClient();
} else if (envGlobalLayout === "server") {
  document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <div>
      <h1> > SEED ${envGlobalLayout} </h1>
      <h2 color="red"> > context not valid </h1>
    </div>
  `;
  throw new Error("twin is not context valid");
} else {
  throw new Error(`${envGlobalLayout} is not environment valid`);
}
