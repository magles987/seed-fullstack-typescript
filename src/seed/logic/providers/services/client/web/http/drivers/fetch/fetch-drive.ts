import { IBagForService } from "../../../../../shared";
import { IFetchConfig } from "./shared";
import {
  ELogicCodeError,
  LogicError,
} from "../../../../../../../errors/logic-error";
import { HttpDrive } from "../_drive";
import {
  EHttpStatusCode,
  TKeyHttpMethod,
} from "../../../../../../../util/http-utilities";
import {
  ELogicResStatusCode,
  IExtResponse,
} from "../../../../../../../reports/shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *singleton*
 * *selfconstructor*
 *
 * ...
 */
export class FetchHttpDrive
  extends HttpDrive
  implements ReturnType<FetchHttpDrive["getDefault"]>
{
  /**@returns todos los campos con sus valores predefinidos para instancias de esta clase*/
  public static readonly getDefault = () => {
    const superDf = HttpDrive.getDefault();
    return {
      ...superDf,
      option: {
        headers: {
          "Content-Type": "application/json",
        },
        mode: undefined,
        credentials: undefined,
        cache: undefined,
        redirect: undefined,
        referrer: undefined,
        integrity: undefined,
        keepalive: false,
        body: undefined,
        method: undefined,
        priority: undefined,
        referrerPolicy: undefined,
        signal: undefined,
        window: undefined,
      },
    } as IFetchConfig;
  };
  /**@returns todas las constantes a usar en instancias de esta clase*/
  protected static readonly getCONSTANTS = () => {
    return {
      //..aqui las constantes
    };
  };
  private _option: ReturnType<FetchHttpDrive["getDefault"]>["option"];
  public get option(): ReturnType<FetchHttpDrive["getDefault"]>["option"] {
    return this._option;
  }
  protected set option(v: ReturnType<FetchHttpDrive["getDefault"]>["option"]) {
    this._option = this.util.isObject(v)
      ? v
      : this._option !== undefined
      ? this._option
      : this.getDefault().option;
  }
  /**
   * @param base objeto literal con valores personalizados para iniicalizar las propiedades
   * @param isInit `= true` ❕Solo para herencia❕, indica si esta clase debe iniciar las propiedaes
   */
  constructor(
    base: Partial<ReturnType<FetchHttpDrive["getDefault"]>> = {},
    isInit = true
  ) {
    super("fetch");
    if (isInit) this.initProps(base);
  }
  /**@returns todos los campos con sus valores predefinidos*/
  protected getDefault() {
    return FetchHttpDrive.getDefault();
  }
  /**@returns todas las constantes de la clase para las instancias*/
  protected getCONST() {
    return FetchHttpDrive.getCONSTANTS();
  }
  /**inicializa las propiedades de manera dinámica
   *
   * @param base objeto literal con valores personalizados para iniicalizar las propiedades
   */
  protected initProps(
    base: Partial<ReturnType<FetchHttpDrive["getDefault"]>>
  ): void {
    base = typeof base === "object" && base !== null ? base : {};
    for (const key in this.getDefault()) {
      this[key] = base[key];
    }
    return;
  }
  /**⚠ Reinicia todas las propiedades al valor predefinido ⚠ */
  // public resetProps(): void {
  //   const df = this.getDefault();
  //   for (const key in df) {
  //     this[key] = df[key];
  //   }
  //   return;
  // }
  /**reinicia una propiedad al valor predefinido
   *
   * @param key clave identificadora de la propiedad a reiniciar
   */
  public resetPropByKey(
    key: keyof ReturnType<FetchHttpDrive["getDefault"]>
  ): void {
    const df = this.getDefault();
    this[key as any] = df[key];
    return;
  }
  /**muta las propiedades masivamente */
  public mutateProps(
    base: Partial<
      Omit<ReturnType<FetchHttpDrive["getDefault"]>, "body" | "method">
    >
  ): void {
    base = typeof base === "object" && base !== null ? base : ({} as any);
    for (const key in base) {
      this[key] = base[key];
    }
    return;
  }
  public override async sendRequest(
    url: string,
    httpMethod: TKeyHttpMethod,
    txData: any
  ): Promise<Response> {
    //agregar opciones obligatorias
    let option = this.util.clone(this.option);
    option.body = this.util.dataToBody(txData);
    option.method = httpMethod;
    //ejecutar el envío
    let response: Response;
    response = await fetch(url, option);
    const rxData = await this.getResponseDataFromFetch(response);
    return rxData;
  }
  /**... */
  public override async sendRequestFromService(
    bagService: IBagForService
  ): Promise<IExtResponse> {
    let option = this.util.clone(this.option);
    //try-catch especializado para fetch
    let response: Response;
    let driverResponse: IExtResponse;
    try {
      this.util.checkBag(bagService);
      const { data: txData, literalCriteria: criteria } = bagService;
      //configuración de opciones obligatorias
      option.method = this.util.getHttpMethodFromCriteria(criteria);
      option.body = this.util.dataToBody(txData);
      const urlBodyParts = this.getUrlBodyPartsFromBag(criteria);
      const url = this.buildUrl(urlBodyParts);
      response = await fetch(url, option);
      driverResponse = await this.adaptHttpResponseToIDriveResponse(response);
    } catch (error) {
      response = {
        ok: false,
        headers: option.headers,
        status: EHttpStatusCode.CONFLICT,
      } as Response;
      driverResponse = await this.adaptHttpResponseToIDriveResponse(
        response,
        error
      );
    }
    return driverResponse;
  }
  protected override async adaptHttpResponseToIDriveResponse(
    responseToAdapt: Response,
    error?: any
  ): Promise<IExtResponse> {
    let driverResponse: IExtResponse;
    const { status, statusText, headers } = responseToAdapt;
    if (this.util.isUndefinedOrNull(error)) {
      const contentType = headers.get("Content-Type");
      if (contentType.includes("application/json")) {
        const fetchData = (await responseToAdapt.json()) as IExtResponse;
        if (
          this.util.isObjectWithProperties(
            fetchData,
            false,
            ["data", "status"],
            "it-exist"
          )
        ) {
          driverResponse = {
            ...fetchData,
            status:
              fetchData.status ??
              this.util.convertHttpStatusCodeToLogicStatusCode(status),
            msn: fetchData.msn ?? statusText,
            extResponse: responseToAdapt,
          };
        } else {
          driverResponse = {
            data: fetchData,
            msn: `data is not as expected`,
            status: ELogicResStatusCode.BAD,
            extResponse: responseToAdapt,
          };
        }
      } else if (contentType.includes("text/")) {
        const fetchData = await responseToAdapt.text();
        driverResponse = {
          data: fetchData,
          msn: statusText,
          status: this.util.convertHttpStatusCodeToLogicStatusCode(status),
        };
      } else if (contentType.includes("image/")) {
        const fetchData = await responseToAdapt.blob();
        driverResponse = {
          data: fetchData,
          msn: statusText,
          status: this.util.convertHttpStatusCodeToLogicStatusCode(status),
        };
      } else if (contentType.includes("application/pdf")) {
        const fetchData = await responseToAdapt.blob();
        driverResponse = {
          data: fetchData,
          msn: statusText,
          status: this.util.convertHttpStatusCodeToLogicStatusCode(status),
        };
      } else if (contentType.includes("application/octet-stream")) {
        const fetchData = await responseToAdapt.arrayBuffer();
        driverResponse = {
          data: fetchData,
          msn: statusText,
          status: this.util.convertHttpStatusCodeToLogicStatusCode(status),
        };
      } else if (contentType.includes("multipart/form-data")) {
        const fetchData = await responseToAdapt.formData();
        driverResponse = {
          data: fetchData,
          msn: statusText,
          status: this.util.convertHttpStatusCodeToLogicStatusCode(status),
        };
      } else {
        driverResponse = {
          data: this.util.dfValue,
          msn: `${contentType} is a content type unknown`,
          status: ELogicResStatusCode.ERROR,
          extResponse: responseToAdapt,
        };
      }
    } else {
      driverResponse = {
        data: this.util.dfValue,
        msn: statusText,
        status: status ?? ELogicResStatusCode.ERROR,
        error,
      };
    }
    return driverResponse;
  }
}
