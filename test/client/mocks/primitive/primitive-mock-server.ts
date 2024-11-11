import { http, HttpHandler, HttpResponse, RequestHandler } from "msw";
import { LogicController } from "../../../../src/seed/logic/controllers/_controller";
import { PrimitiveLogicController } from "../../../../src/seed/logic/controllers/_primitive-ctrl";
import { IUrlConfig } from "../../../../src/seed/logic/providers/services/client/web/http/drive/shared";
import { IMockServerOption, MockServerHandler } from "../_mock-server";
import { EncriptAndCompressDataHandler } from "../../../../src/seed/logic/util/encripter-handler";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**... */
export class PrimitiveMockServerHandler<
  TData
> extends MockServerHandler<TData> {
  protected override getHttpHandlers = () => {
    const { _read_, _create_, _update_, _delete_ } =
      this.diccKeyCRUDBasicAction;
    return [
      http.get(`${this.urlBase}/`, ({ request, params, cookies }) => {
        return HttpResponse.html(`<h1>miApp</h1>`);
      }),
      http.get(
        `${this.urlBase}/${this.keyUrlSrc}/${_read_}/*`,
        ({ request, params, cookies }) => {
          const d = request;
          const eH = EncriptAndCompressDataHandler.getInstance();
          const strCriteria = params[0];
          const f = eH.unencriptAndUncompressUrlBase64ToObject(
            strCriteria as string
          );
          return HttpResponse.json(this.table);
        }
      ),
      http.post(
        `${this.urlBase}/${this.keyUrlSrc}/${_create_}/*`,
        ({ request, params, cookies }) => {
          return HttpResponse.json([]);
        }
      ),
      http.put(
        `${this.urlBase}/${this.keyUrlSrc}/${_update_}/*`,
        ({ request, params, cookies }) => {
          return HttpResponse.json([]);
        }
      ),
      http.delete(
        `${this.urlBase}/${this.keyUrlSrc}/${_delete_}/*`,
        ({ request, params, cookies }) => {
          return HttpResponse.json([]);
        }
      ),
    ];
  };
  /**... */
  constructor(ctrl: LogicController, option: IMockServerOption) {
    super(ctrl, option);
  }
  protected override initConfig(): void {
    this.keyLogicContext = this.ctrl.keyLogicContext;
    const { keySrcSelector, bd_collection } = this.option;
    this.bd_collection = bd_collection;
    if (this.keyLogicContext !== "primitive")
      throw new Error(`${this.keyLogicContext} is not key logic context valid`);
    const ctrl = this.ctrl as PrimitiveLogicController<any>;
    const mH = ctrl.metadataHandler;
    const metadata = mH.getExtractMetadataByModuleContext("metadata");
    const diccProviderAC = mH.getDiccActionConfigByModuleContext("provider");
    this.initUrlConfig(diccProviderAC.runProvider);
    this.initKeyUrlSrc(keySrcSelector, metadata);
  }
}
