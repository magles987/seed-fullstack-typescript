import {
  ELogicResStatusCode,
  IDriverResponse,
} from "../../../../../../reports/shared";
import {
  EHttpStatusCode,
  TKeyHttpMethod,
} from "../../../../../../util/http-tool";
import { IFetchOption, TFetchCustomQueryFnReturn } from "./shared";
import { IBagForDriver } from "../../../../shared";
import { HttpDriver } from "../_https-driver";
import { THttpCustomQueryDriverFn } from "../shared";
import { Module } from "../../../../../../config/module";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *selfcontructor*
 *
 * ...
 */
export class FetchDriver
  extends HttpDriver
  implements ReturnType<FetchDriver["getDefault"]>
{
  public static readonly getNameLogicDriver = () => {
    const util = Module.util;
    //const sp = util.charSeparatorLogicName;
    const prefixGroupName = HttpDriver.getNameLogicDriver();
    let name = "fetch";
    name = `${prefixGroupName}${name}`;
    return name;
  };
  public static override readonly getDefault = () => {
    const superDf = HttpDriver.getDefault();
    return {
      ...superDf,
      /**opciones de fetch para petición */
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
      } as IFetchOption,
    };
  };
  protected static override readonly getCONSTANTS = () => {
    const superCONST = HttpDriver.getCONSTANTS();
    return {
      ...superCONST,
      //..aquí las constantes
    };
  };
  public override nameLogicDriver = FetchDriver.getNameLogicDriver();
  private _option: ReturnType<FetchDriver["getDefault"]>["option"];
  public get option(): ReturnType<FetchDriver["getDefault"]>["option"] {
    return this._option;
  }
  protected set option(v: ReturnType<FetchDriver["getDefault"]>["option"]) {
    this._option = this.util.isObject(v)
      ? v
      : this._option !== undefined
      ? this._option
      : this.getDefault().option;
  }
  /**
   * @param base objeto literal con valores personalizados para inicalizar las propiedades
   * @param isInit `= true` ❕Solo para herencia❕, indica si esta clase debe iniciar las propiedaes
   */
  constructor(
    base: Partial<ReturnType<FetchDriver["getDefault"]>> = {},
    isInit = true
  ) {
    super(base, false);
    if (isInit) this.initProps(base);
  }
  protected override getDefault() {
    return FetchDriver.getDefault();
  }
  protected override getCONST() {
    return FetchDriver.getCONSTANTS();
  }

  //❗normalmente definidas en el padre, salvo que se quieran sobreescribir❗
  // /**inicializa las propiedades de manera dinamica
  //  *
  //  * @param base objeto literal con valores personalizados para inicalizar las propiedades
  //  */
  // protected override initProps(base: Partial<ReturnType<FetchDriver["getDefault"]>>): void {
  //   for (const key in this.getDefault()) {
  //     this[key] = base[key];
  //   }
  //   return;
  // }
  // /**reinicia una propiedad al valor predefinido
  //  *
  //  * @param key clave identificadora de la propiedad a reiniciar
  //  */
  // public override resetPropByKey(key: keyof ReturnType<FetchDriver["getDefault"]>): void {
  //   const df = this.getDefault();
  //   this[key] = df[key];
  //   return;
  // }
  public override mutateProps(
    base: Partial<ReturnType<FetchDriver["getDefault"]>>
  ): void {
    super.mutateProps(base);
    return;
  }
  public override getLiteral(): ReturnType<FetchDriver["getDefault"]> {
    return super.getLiteral() as any;
  }
  public override async sendRequestFromService(
    literalBag: IBagForDriver
  ): Promise<IDriverResponse> {
    let option = this.util.clone(this.option);
    //try-catch especializado para fetch
    let response: Response;
    let driverResponse: IDriverResponse;
    try {
      this.checkBag(literalBag);
      const { data: txData, literalCriteria } = literalBag;
      //configuración de opciones obligatorias
      option.method = this.getHttpMethodFromCriteria(literalCriteria);
      option.body = this.dataToBody(txData);
      const urlBodyParts = this.getUrlBodyPartsFromBag(literalCriteria);
      let url = this.buildUrl(urlBodyParts);
      //selección tipo de ejecución de la api de envío http
      const customQueryDriverFn = this.getCustomQueryFn(literalCriteria);
      if (this.util.isFunction(customQueryDriverFn)) {
        //personalizada
        const fn = customQueryDriverFn as THttpCustomQueryDriverFn<
          this,
          TFetchCustomQueryFnReturn
        >;
        const { url: mod_url, option: mod_option } = await fn(this, literalBag);
        url = this.util.isString(mod_url) ? mod_url : url;
        option = this.util.deepMergeObjects([option, mod_option], {
          mode: "soft",
        });
      }
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
  ): Promise<IDriverResponse> {
    let driverResponse: IDriverResponse;
    const { status, statusText, headers } = responseToAdapt;
    if (this.util.isUndefinedOrNull(error)) {
      const contentType = headers.get("Content-Type");
      if (contentType.includes("application/json")) {
        const fetchData = (await responseToAdapt.json()) as IDriverResponse;
        if (
          this.util.isObjectWithProperties(fetchData, ["data", "status"], {
            propCondition: "it-exist",
          })
        ) {
          driverResponse = {
            ...fetchData,
            status:
              fetchData.status ??
              this.convertHttpStatusCodeToLogicStatusCode(status),
            msn: fetchData.msn ?? statusText,
            details: responseToAdapt,
          };
        } else {
          driverResponse = {
            data: fetchData,
            msn: `data is not as expected`,
            status: ELogicResStatusCode.BAD,
            details: responseToAdapt,
          };
        }
      } else if (contentType.includes("text/")) {
        const fetchData = await responseToAdapt.text();
        driverResponse = {
          data: fetchData,
          msn: statusText,
          status: this.convertHttpStatusCodeToLogicStatusCode(status),
        };
      } else if (contentType.includes("image/")) {
        const fetchData = await responseToAdapt.blob();
        driverResponse = {
          data: fetchData,
          msn: statusText,
          status: this.convertHttpStatusCodeToLogicStatusCode(status),
        };
      } else if (contentType.includes("application/pdf")) {
        const fetchData = await responseToAdapt.blob();
        driverResponse = {
          data: fetchData,
          msn: statusText,
          status: this.convertHttpStatusCodeToLogicStatusCode(status),
        };
      } else if (contentType.includes("application/octet-stream")) {
        const fetchData = await responseToAdapt.arrayBuffer();
        driverResponse = {
          data: fetchData,
          msn: statusText,
          status: this.convertHttpStatusCodeToLogicStatusCode(status),
        };
      } else if (contentType.includes("multipart/form-data")) {
        const fetchData = await responseToAdapt.formData();
        driverResponse = {
          data: fetchData,
          msn: statusText,
          status: this.convertHttpStatusCodeToLogicStatusCode(status),
        };
      } else {
        driverResponse = {
          data: this.util.dfValue,
          msn: `${contentType} is a content type unknown`,
          status: ELogicResStatusCode.ERROR,
          details: responseToAdapt,
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
