import { http, HttpHandler, HttpResponse, RequestHandler } from "msw";
import { setupServer } from "msw/node";
import { beforeAll, afterEach, afterAll } from "vitest";
import {
  TKeyLogicContext,
  TKeySrcSelector,
} from "../../../src/seed/logic/config/shared-modules";
import { LogicController } from "../../../src/seed/logic/controllers/_controller";
import { getSeedEnvironment } from "../../../src/seed/logic/config/seed-environment";
import { MicroBackend } from "./microbackend";
import { Util_Test } from "../../util-test";
import { HttpDriver } from "../../../src/seed/logic/providers/_drivers/client/web/https/_https-driver";
import { EncryptAndCompressDataHandler } from "../../../src/seed/logic/util/encripter-handler";
import { IBagForDriver } from "../../../src/seed/logic/providers/_drivers/shared";
import { StructureLogicController } from "../../../src/seed/logic/controllers/structure-ctrl";
import { PrimitiveLogicController } from "../../../src/seed/logic/controllers/primitive-ctrl";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**... */
export interface IMockServerOption {
  /**selección de nombre de la fuente (singular o plural) */
  srcSelector: TKeySrcSelector;
  db_collection: any[];
  nameLogicDriver: string;
}
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *abstract*
 *
 */
export class MockServerHandler<TData> {
  /**clave identificadora del contexto lógico */
  protected keyLogicContext: TKeyLogicContext;
  /**tabla, documento o array que representa los datos almacenados */
  protected db_collection: Array<TData>;
  protected urlConfig = {} as Pick<
    ReturnType<HttpDriver["getDefault"]>,
    "urlActionType" | "urlPostfix" | "urlPrefix" | "urlRoot" | "urlSecretKeyJWT"
  >;
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
  /**manejadores de llegada de petición http */
  protected getHttpHandlers = () => {
    const { _read_, _create_, _update_, _delete_ } =
      this.diccKeyCRUDBasicAction;
    const util = this.util;
    const eH = EncryptAndCompressDataHandler.getInstance();
    const mBackend = this.microBackend;
    const idxCriteriaParam = 0; //el identificador de en que posición de los parámetros esta el criteria comprimido y cifrado
    return [
      http.get(`${this.urlBase}/`, ({ request, params, cookies }) => {
        return HttpResponse.html(`<h1>miApp</h1>`);
      }),
      http.get(
        `${this.urlBase}/${this.keyUrlSrc}/${_read_}/*`,
        async ({ request, params, cookies }) => {
          const literalCriteria = eH.unencryptAndUncompressUrlBase64ToObject(
            params[idxCriteriaParam] as string
          ) as IBagForDriver["literalCriteria"];
          const driverResponse = await mBackend.receiveMockRequest(
            literalCriteria,
            undefined
          );
          return HttpResponse.json(driverResponse);
        }
      ),
      http.post(
        `${this.urlBase}/${this.keyUrlSrc}/${_create_}/*`,
        async ({ request, params, cookies }) => {
          const data = await request.json();
          const literalCriteria = eH.unencryptAndUncompressUrlBase64ToObject(
            params[idxCriteriaParam] as string
          ) as IBagForDriver["literalCriteria"];
          const driverResponse = await mBackend.receiveMockRequest(
            literalCriteria,
            data
          );
          return HttpResponse.json(driverResponse);
        }
      ),
      http.put(
        `${this.urlBase}/${this.keyUrlSrc}/${_update_}/*`,
        async ({ request, params, cookies }) => {
          const data = await request.json();
          const literalCriteria = eH.unencryptAndUncompressUrlBase64ToObject(
            params[idxCriteriaParam] as string
          ) as IBagForDriver["literalCriteria"];
          const driverResponse = await mBackend.receiveMockRequest(
            literalCriteria,
            data
          );
          return HttpResponse.json(driverResponse);
        }
      ),
      http.delete(
        `${this.urlBase}/${this.keyUrlSrc}/${_delete_}/*`,
        async ({ request, params, cookies }) => {
          const data = await request.json();
          const literalCriteria = eH.unencryptAndUncompressUrlBase64ToObject(
            params[idxCriteriaParam] as string
          ) as IBagForDriver["literalCriteria"];
          const driverResponse = await mBackend.receiveMockRequest(
            literalCriteria,
            data
          );
          return HttpResponse.json(driverResponse);
        }
      ),
    ];
  };
  /**instancia del micro backend simulado para pruebas*/
  private _microBackend: MicroBackend;
  public get microBackend(): MicroBackend {
    return this._microBackend;
  }
  protected set microBackend(v: MicroBackend) {
    this._microBackend = v;
  }
  /**utilidades */
  protected util = Util_Test.getInstance();
  /**... */
  constructor(
    protected ctrl: LogicController,
    protected option: IMockServerOption
  ) {
    this.util = Util_Test.getInstance();
    this.initConfig();
    this.selectRunServer();
  }
  /**... */
  protected initConfig(): void {
    const { srcSelector, db_collection, nameLogicDriver } = this.option;
    this.keyLogicContext = this.ctrl.keyLogicContext;
    this.db_collection = db_collection;
    if (this.keyLogicContext === "primitive") {
      const ctrl = this.ctrl as PrimitiveLogicController<any>;
      const mH = ctrl.metadataHandler;
      const driver = mH.getDriverByName(nameLogicDriver) as HttpDriver;
      this.urlConfig = {
        urlActionType: driver.urlActionType,
        urlPrefix: driver.urlPrefix,
        urlPostfix: driver.urlPostfix,
        urlRoot: driver.urlRoot,
        urlSecretKeyJWT: driver.urlSecretKeyJWT,
      };
      const metadata = mH.getExtractMetadataByModuleContext("metadata");
      this.keyUrlSrc =
        srcSelector === "singular"
          ? (metadata.__S_Key as string)
          : srcSelector === "plural"
          ? (metadata.__P_Key as string)
          : (metadata.__S_Key as string);
    } else if (this.keyLogicContext === "structure") {
      const ctrl = this.ctrl as StructureLogicController<any>;
      const mH = ctrl.metadataHandler;
      const driver = mH.getDriverByName(nameLogicDriver) as HttpDriver;
      this.urlConfig = {
        urlActionType: driver.urlActionType,
        urlPrefix: driver.urlPrefix,
        urlPostfix: driver.urlPostfix,
        urlRoot: driver.urlRoot,
        urlSecretKeyJWT: driver.urlSecretKeyJWT,
      };
      const metadata = mH.getExtractMetadataByModuleContext(
        "structureModel",
        "metadata"
      );
      this.keyUrlSrc =
        srcSelector === "singular"
          ? (metadata.__S_Key as string)
          : srcSelector === "plural"
          ? (metadata.__P_Key as string)
          : (metadata.__S_Key as string);
    } else {
      throw new Error(`${this.keyLogicContext} is not key logic context valid`);
    }
    this.microBackend = new MicroBackend(this.keyLogicContext, {
      db_collection,
      srcSelector,
    });
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
