import { runTestClient } from "../test/client/index-client";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
var keyEnviroment: "client" | "server" = "client";
if (keyEnviroment === "client") {
  document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <div>
      <h1> > SEED ${keyEnviroment} </h1>
    </div>
  `;
  await runTestClient();
} else if (keyEnviroment === "server") {
} else {
  throw new Error(`${keyEnviroment} is not enviroment valid`);
}
