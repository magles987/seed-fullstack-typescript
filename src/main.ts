import { runTestClient } from "./test/client/index-client";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
var keyEnviroment: "client" | "server" = "client";
if (keyEnviroment === "client") {
} else if (keyEnviroment === "server") {
  document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <div>
      <h1> SEED ${keyEnviroment} </h1>
    </div>
  `;
  runTestClient();
} else {
  throw new Error(`${keyEnviroment} is not enviroment valid`);
}
