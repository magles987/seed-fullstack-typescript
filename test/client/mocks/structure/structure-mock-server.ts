import { http, HttpHandler, HttpResponse, RequestHandler } from "msw";
import { LogicController } from "../../../../src/seed/logic/controllers/_controller";
import { StructureLogicController } from "../../../../src/seed/logic/controllers/_structure-ctrl";
import { EncryptAndCompressDataHandler } from "../../../../src/seed/logic/util/encripter-handler";
import { IMockServerOption, MockServerHandler } from "../_mock-server";
import {
  StructureSimulatedMicroBackend,
  TStructureKeyFullRequest,
} from "./structure-simulated-microbackend";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**  */
export class StructureMockServerHandler<
  TModel
> extends MockServerHandler<TModel> {
  protected override getHttpHandlers = () => {
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
          ) as IBagForService["literalCriteria"];
          const driverResponse = await mBackend.receiveMockRequest(
            literalCriteria
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
          ) as IBagForService["literalCriteria"];
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
          ) as IBagForService["literalCriteria"];
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
          ) as IBagForService["literalCriteria"];
          const driverResponse = await mBackend.receiveMockRequest(
            literalCriteria,
            data
          );
          return HttpResponse.json(driverResponse);
        }
      ),
    ];
  };
  protected override microBackend: StructureSimulatedMicroBackend<TStructureKeyFullRequest>;
  /**... */
  constructor(ctrl: LogicController, option: IMockServerOption) {
    super(ctrl, option);
    this.initConfig();
    this.selectRunServer();
  }
  protected override initConfig(): void {
    this.keyLogicContext = this.ctrl.keyLogicContext;
    const { keySrcSelector, bd_collection } = this.option;
    this.db_collection = bd_collection;
    if (this.keyLogicContext !== "structure")
      throw new Error(`${this.keyLogicContext} is not key logic context valid`);
    const ctrl = this.ctrl as StructureLogicController<any>;
    const mH = ctrl.metadataHandler;
    const metadata = mH.getExtractMetadataByModuleContext(
      "structureModel",
      "metadata"
    );
    const diccProviderAC = mH.getDiccActionConfigByModuleContext(
      "structureModel",
      "provider"
    );
    this.microBackend = new StructureSimulatedMicroBackend({
      bd_collection,
    });
    this.initUrlConfig(diccProviderAC.runProvider);
    this.initKeyUrlSrc(keySrcSelector, metadata);
  }
}
