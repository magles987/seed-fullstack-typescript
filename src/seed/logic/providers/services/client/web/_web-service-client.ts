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
    keyDrive: unknown,
  ) {
    super(keyLogicContext, keySrc, keyDrive);
  }
  protected override getDefault() {
    return WebClientService.getDefault();
  }
  /**... */
  protected convertHttpStatusCodeToLogicStatusCode(
    httpStatusCode: EHttpStatusCode
  ): ELogicResStatusCode {
    let logicStatusCode: ELogicResStatusCode;
    if (
      httpStatusCode >= EHttpRangeStatusCode.INFO &&
      httpStatusCode < EHttpRangeStatusCode.SUCCESS
    ) {
      //especificaciones para rango de codigo (si las hay)
      logicStatusCode =
        httpStatusCode === EHttpStatusCode.PROCESSING
          ? ELogicResStatusCode.PROCESSING
          : ELogicResStatusCode.INFO;
    } else if (
      httpStatusCode >= EHttpRangeStatusCode.SUCCESS &&
      httpStatusCode < EHttpRangeStatusCode.REDIRECT
    ) {
      //especificaciones para rango de codigo (si las hay)
      logicStatusCode =
        httpStatusCode === EHttpStatusCode.CREATED
          ? ELogicResStatusCode.VALID_DATA
          : httpStatusCode === EHttpStatusCode.ACCEPTED
            ? ELogicResStatusCode.VALID_DATA
            : httpStatusCode === EHttpStatusCode.NON_AUTHORITATIVE_INFORMATION
              ? ELogicResStatusCode.WARNING
              : httpStatusCode === EHttpStatusCode.NO_CONTENT
                ? ELogicResStatusCode.VALID_DATA //❓❓WARNING_DATA❓❓
                : httpStatusCode === EHttpStatusCode.RESET_CONTENT
                  ? ELogicResStatusCode.WARNING_DATA
                  : httpStatusCode === EHttpStatusCode.PARTIAL_CONTENT
                    ? ELogicResStatusCode.WARNING_DATA
                    : ELogicResStatusCode.SUCCESS;
    } else if (
      httpStatusCode >= EHttpRangeStatusCode.REDIRECT &&
      httpStatusCode < EHttpRangeStatusCode.BAD
    ) {
      //especificaciones para rango de codigo (si las hay)
      logicStatusCode = ELogicResStatusCode.REDIRECT;
    } else if (
      httpStatusCode >= EHttpRangeStatusCode.BAD &&
      httpStatusCode < EHttpRangeStatusCode.ERROR
    ) {
      //especificaciones para rango de codigo (si las hay)
      logicStatusCode =
        httpStatusCode === EHttpStatusCode.UNAUTHORIZED
          ? ELogicResStatusCode.INVALID_USER
          : httpStatusCode === EHttpStatusCode.NOT_FOUND
            ? ELogicResStatusCode.INVALID_DATA
            : ELogicResStatusCode.BAD;
    } else {
      logicStatusCode = ELogicResStatusCode.ERROR;
    }
    return logicStatusCode;
  }
  /**reconstruye la data a partir de
   * body recibido en la respuesta http
   *
   * @param body el body a analizar (recibido
   * desde http)
   * @param expectedDataType el tipo de data esperado,
   * para seleccionar un valor default adecuado en
   * caso de ausencia de body
   *
   * @returns el dato
   */
  protected reBuildRxDataFromHttpResponse(
    body: string,
    expectedDataType: TExpectedDataType
  ): any {
    const dfSingleValue = undefined;
    let dfData =
      expectedDataType === "single"
        ? dfSingleValue
        : expectedDataType === "object"
          ? {}
          : expectedDataType === "array"
            ? []
            : undefined;
    if (!this.util.isString(body)) return dfData;
    let data = dfData;
    try {
      data = JSON.parse(body);
      //analiza si debe reafirmar el default
      if (this.util.isUndefinedOrNull(data)) data = dfData;
    } catch (error) {
      data = dfData;
    }
    return data;
  }
}
