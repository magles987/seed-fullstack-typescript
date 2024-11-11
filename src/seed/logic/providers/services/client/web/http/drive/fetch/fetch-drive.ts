import { IBagForService } from "../../../../../shared";
import { IHttpResponse } from "../../shared";
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
    option.body = this.getBodyForFetch(txData);
    option.method = httpMethod;
    //ejecutar el envío
    let response: Response;
    response = await fetch(url, option);
    const rxData = await this.getDataFromFetch(response);
    return rxData;
  }
  /**... */
  protected override async _sendRequestFromService(
    iBag: IBagForService
  ): Promise<IHttpResponse> {
    const { data, literalCriteria: criteria } = iBag;
    //configuracion de opciones obligatorias
    let option = this.util.clone(this.option);
    option.method = this.getHttpMethodFromBag(criteria);
    option.body = this.getBodyForFetch(data);
    //try-catch especializado para fetch
    let response: Response;
    let httpBasicResponse: IHttpResponse;
    try {
      const urlBodyParts = this.getUrlBodyPartsFromBag(criteria);
      const url = this.buildUrl(urlBodyParts);
      response = await fetch(url, option);
      httpBasicResponse = await this.adaptToHttpResponseBasic(response);
    } catch (error) {
      response = {
        ok: false,
        headers: option.headers,
        status: EHttpStatusCode.CONFLICT,
      } as Response;
      httpBasicResponse = await this.adaptToHttpResponseBasic(response, error);
    }
    return httpBasicResponse;
  }
  /**... */
  protected getBodyForFetch(txData: any): string {
    let body: string = undefined;
    if (
      typeof txData !== "undefined" &&
      typeof txData !== "function" &&
      typeof txData !== "symbol"
    ) {
      body = JSON.stringify(txData);
    }
    return body;
  }
  /**... */
  protected async getDataFromFetch(
    response: Response //es el response del fetch
  ): Promise<any> {
    const contentType = response.headers.get("Content-Type");
    let data;
    if (contentType.includes("application/json")) {
      data = await response.json();
    } else if (contentType.includes("text/")) {
      data = await response.text();
    } else if (contentType.includes("image/")) {
      data = await response.blob();
    } else if (contentType.includes("application/pdf")) {
      data = await response.blob();
    } else if (contentType.includes("application/octet-stream")) {
      data = await response.arrayBuffer();
    } else if (contentType.includes("multipart/form-data")) {
      data = await response.formData();
    } else {
      throw new LogicError({
        code: ELogicCodeError.NOT_EXIST,
        msn: `${contentType} is not http header content type valid`,
      });
    }
    return data;
  }
  protected override async adaptToHttpResponseBasic(
    responseToAdapt: Response,
    error?: any
  ): Promise<IHttpResponse> {
    let httpBasicResponse: IHttpResponse;
    const { ok, status, statusText, headers } = responseToAdapt;
    if (this.util.isUndefinedOrNull(error)) {
      const rxData = await this.getDataFromFetch(responseToAdapt);
      httpBasicResponse = {
        ok,
        body: JSON.stringify(rxData), //conversion a string 😥 no debería tener que volverse a convertir
        httpStatus: status,
        statusText,
        header: headers,
      };
    } else {
      httpBasicResponse = {
        body: undefined,
        ok,
        httpStatus: status,
        statusText,
        header: headers,
        error,
      };
    }
    return httpBasicResponse;
  }
}
