import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll } from "vitest";
import { LogicController } from "../../../src/logic/controllers/_controller";
import { MicroBackend } from "./microbackend";
import { PrimitiveLogicController } from "../../../src/logic/controllers/primitive-ctrl";
import { StructureLogicController } from "../../../src/logic/controllers/structure-ctrl";
import {
  TKeySrcSelector,
  TKeyLogicContext,
} from "../../../src/logic/modules/shared-types";
import { HttpRepository } from "../../../src/logic/providers/repositories/client/web/https/_https-repository";

import { EncryptAndCompressDataHandler } from "../../../src/logic/util/encripter-handler";
import { TwinBeeModule } from "../../../src/logic/modules/module";
import {
  TPrimitiveReadLiteralCriteria,
  TStructureReadLiteralCriteria,
} from "../../../src/logic/criterias/shared-types";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**... */
export interface IMockServerOption {
  /**selección de nombre de la fuente (singular o plural) */
  srcSelector: TKeySrcSelector;
  db_collection: any[];
  nameLogicRepository: string;
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
    ReturnType<HttpRepository["getDefault"]>,
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
          //const data = await request.json(); //get NO recibe body
          let literalCriteria = eH.unencryptAndUncompressUrlBase64ToObject(
            params[idxCriteriaParam] as string
          ) as
            | TPrimitiveReadLiteralCriteria
            | TStructureReadLiteralCriteria<any>;
          //fusionar la data a los criterios
          //literalCriteria = { ...literalCriteria, data };
          const repositoryResponse = await mBackend.receiveMockRequest(
            literalCriteria
          );
          return HttpResponse.json(repositoryResponse);
        }
      ),
      http.post(
        `${this.urlBase}/${this.keyUrlSrc}/${_create_}/*`,
        async ({ request, params, cookies }) => {
          const data = await request.json();
          let literalCriteria = eH.unencryptAndUncompressUrlBase64ToObject(
            params[idxCriteriaParam] as string
          ) as
            | TPrimitiveReadLiteralCriteria
            | TStructureReadLiteralCriteria<any>;
          //fusionar la data a los criterios
          literalCriteria = { ...literalCriteria, data };
          const repositoryResponse = await mBackend.receiveMockRequest(
            literalCriteria
          );
          return HttpResponse.json(repositoryResponse);
        }
      ),
      http.put(
        `${this.urlBase}/${this.keyUrlSrc}/${_update_}/*`,
        async ({ request, params, cookies }) => {
          const data = await request.json();
          let literalCriteria = eH.unencryptAndUncompressUrlBase64ToObject(
            params[idxCriteriaParam] as string
          ) as
            | TPrimitiveReadLiteralCriteria
            | TStructureReadLiteralCriteria<any>;
          //fusionar la data a los criterios
          literalCriteria = { ...literalCriteria, data };
          const repositoryResponse = await mBackend.receiveMockRequest(
            literalCriteria
          );
          return HttpResponse.json(repositoryResponse);
        }
      ),
      http.delete(
        `${this.urlBase}/${this.keyUrlSrc}/${_delete_}/*`,
        async ({ request, params, cookies }) => {
          const data = await request.json();
          let literalCriteria = eH.unencryptAndUncompressUrlBase64ToObject(
            params[idxCriteriaParam] as string
          ) as
            | TPrimitiveReadLiteralCriteria
            | TStructureReadLiteralCriteria<any>;
          //fusionar la data a los criterios
          literalCriteria = { ...literalCriteria, data };
          const repositoryResponse = await mBackend.receiveMockRequest(
            literalCriteria
          );
          return HttpResponse.json(repositoryResponse);
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
  protected util = TwinBeeModule.util;
  /**... */
  constructor(
    protected ctrl: LogicController<any>,
    protected option: IMockServerOption
  ) {
    this.util = TwinBeeModule.util;
    this.initConfig();
    this.selectRunServer();
  }
  /**... */
  protected initConfig(): void {
    const { srcSelector, db_collection, nameLogicRepository } = this.option;
    this.keyLogicContext = this.ctrl.keyLogicContext;
    this.db_collection = db_collection;
    if (this.keyLogicContext === "primitive") {
      const ctrl = this.ctrl as unknown as PrimitiveLogicController<any>;
      const mH = ctrl.metadataHandler;
      const pH = mH.getInstanceModuleByModuleContext("provider");
      const repository = pH.getRepositoryByNameLogicRepository(
        nameLogicRepository
      ) as HttpRepository;
      this.urlConfig = {
        urlActionType: repository.urlActionType,
        urlPrefix: repository.urlPrefix,
        urlPostfix: repository.urlPostfix,
        urlRoot: repository.urlRoot,
        urlSecretKeyJWT: repository.urlSecretKeyJWT,
      };
      const metadata = mH.getExtractMetadataByModuleContext("metadata");
      this.keyUrlSrc =
        srcSelector === "singular"
          ? (metadata.__S_Key as string)
          : srcSelector === "plural"
          ? (metadata.__P_Key as string)
          : (metadata.__S_Key as string);
    } else if (this.keyLogicContext === "structure") {
      const ctrl = this.ctrl as unknown as StructureLogicController<any>;
      const mH = ctrl.metadataHandler;
      const pH = mH.getInstanceModuleByModuleContext(
        "structureModel",
        "provider"
      );
      const repository = pH.getRepositoryByNameLogicRepository(
        nameLogicRepository
      ) as HttpRepository;
      this.urlConfig = {
        urlActionType: repository.urlActionType,
        urlPrefix: repository.urlPrefix,
        urlPostfix: repository.urlPostfix,
        urlRoot: repository.urlRoot,
        urlSecretKeyJWT: repository.urlSecretKeyJWT,
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
    const { envTest } = TwinBeeModule._globalConfig_.environment;
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
