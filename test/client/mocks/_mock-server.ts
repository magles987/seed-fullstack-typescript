import { http, HttpHandler, HttpResponse, RequestHandler } from "msw";
import { setupServer } from "msw/node";
import { beforeAll, afterEach, afterAll } from "vitest";
import {
  TKeyLogicContext,
  TKeySrcSelector,
} from "../../../src/seed/logic/config/shared-modules";
import { LogicController } from "../../../src/seed/logic/controllers/_controller";
import { IUrlConfig } from "../../../src/seed/logic/providers/services/client/web/http/drivers/shared";
import { getSeedEnvironment } from "../../../src/seed/logic/config/seed-environment";
import { IRunProvider } from "../../../src/seed/logic/providers/shared-for-external-module";
import { SimulatedMicroBackend } from "./_simulated-microbackend";
import { Util_Mock } from "./_util-mock";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**... */
export interface IMockServerOption {
  /**selección de nombre de la fuente (singular o plural) */
  keySrcSelector: TKeySrcSelector;
  bd_collection: any[];
}
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *abstract*
 *
 */
export abstract class MockServerHandler<TData> {
  /**clave identificadora del contexto lógico */
  protected keyLogicContext: TKeyLogicContext;
  /**tabla, documento o array que representa los datos almacenados */
  protected db_collection: Array<TData>;
  protected urlConfig = {} as IUrlConfig;
  protected keyUrlSrc: string;
  protected get urlBase(): string {
    const { urlRoot, urlPrefix } = this.urlConfig;
    const sp = this.util.charSeparatorUrlPath;
    let urlBase = `${urlRoot}`;
    urlBase = this.util.isString(urlPrefix)
      ? `${urlBase}${sp}${urlPrefix}`
      : urlBase;
    return urlBase;
  }
  /**... */
  protected readonly diccKeyCRUDBasicAction = {
    _read_: "read",
    _create_: "create",
    _update_: "update",
    _delete_: "delete", //delete como propiedad no se puede, delete es palabra reservada
  };
  /**manejádores de llegada de petición http */
  protected abstract getHttpHandlers: () => Array<HttpHandler>;
  /**instancia del micro backend simulado para pruebas*/
  protected abstract microBackend: SimulatedMicroBackend;
  /**utilidades */
  protected util = Util_Mock.getInstance();
  /**... */
  constructor(
    protected ctrl: LogicController,
    protected option: IMockServerOption
  ) {
    this.util = Util_Mock.getInstance();
  }
  /**... */
  protected abstract initConfig(): void;
  /**... */
  protected initUrlConfig(runProviderConfig: IRunProvider) {
    const { serviceToRun, serviceConfig } = runProviderConfig;
    const { keyDriver } = serviceToRun;
    if (keyDriver === "axios")
      this.urlConfig = serviceConfig?.client?.web?.http?.diccDriverConfig
        ?.axios as IUrlConfig;
    else if (keyDriver === "fetch")
      this.urlConfig = serviceConfig?.client?.web?.http?.diccDriverConfig
        ?.fetch as IUrlConfig;
    else {
      throw new Error(`${keyDriver} is not drive key valid`);
    }
  }
  /**... */
  protected initKeyUrlSrc(keySrcSelector: TKeySrcSelector, metadata): void {
    this.keyUrlSrc =
      keySrcSelector === "singular"
        ? (metadata.__S_Key as string)
        : keySrcSelector === "plural"
        ? (metadata.__P_Key as string)
        : (metadata.__S_Key as string);
    return;
  }
  /**... */
  protected selectRunServer(): void {
    const { envTest } = getSeedEnvironment();
    if (envTest === "test-node") this.runMockServerByVitestNode();
    else if (envTest === "test-browser") this.runMockServerByBrowser();
    else {
      throw new Error(`${envTest} is not env test context valid`);
    }
  }
  /**... */
  protected runMockServerByVitestNode(): void {
    const httpsHandlers = this.getHttpHandlers();
    const server = setupServer(...httpsHandlers);
    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());
    return;
  }
  /**... */
  protected runMockServerByBrowser(): void {
    return;
  }
  /**... */
  public getDBCollection(): Array<TData> {
    return this.db_collection;
  }
}
