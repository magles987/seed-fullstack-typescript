import { TKeyLogicContext } from "../../../../config/shared-modules";
import { TExpectedDataType } from "../../../../criterias/shared";
import { ELogicResStatusCode } from "../../../../reports/shared";
import {
  EHttpRangeStatusCode,
  EHttpStatusCode,
} from "../../../../util/http-utilities";
import { IServiceRequestConfig } from "../../shared";
import { ClientService } from "../_client-service";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *abstract*
 *
 * ...
 */
export abstract class WebClientService extends ClientService {
  public static override readonly getDefault = () => {
    const superDF = ClientService.getDefault();
    return {
      ...superDF,
      client: {
        ...(superDF.client as any),
        web: {
          ...(superDF.client.web as any),
        },
      },
    } as IServiceRequestConfig;
  };
  /**
   * @param keyLogicContext contexto lógico (estructural o primitivo)
   * @param keySrc indentificadora del recurso asociado a modulo
   * @param keyDrive clave identificadora del drive a instanciar para este servicio
   */
  constructor(
    keyLogicContext: TKeyLogicContext,
    keySrc: string,
    keyDrive: unknown
  ) {
    super(keyLogicContext, keySrc, keyDrive);
  }
  protected override getDefault() {
    return WebClientService.getDefault();
  }
}
