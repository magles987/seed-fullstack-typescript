import {
  ELogicResStatusCode,
  IDriverResponse,
  IGenericDriverResponse,
  TGenericContainerHttpApiResponse,
} from "../../../../../../reports/shared-types";
import { EHttpStatusCode } from "../../../../../../util/http-tool";
import {
  IGenericDriverCriteria,
  TPrimitiveLiteralCriteriaUnion,
  TStructureLiteralCriteriaUnion,
} from "../../../../../../criterias/shared-types";
import { HttpDriver } from "../_https-driver";
import { THttpCustomQueryDriverFn } from "../shared-types";
import { IFetchOption, TFetchCustomQueryFnReturn } from "./shared-types";
//❗❗❗Importacion Fuertemente acoplada, debe estar al final❗❗❗
import { TwinBeeModule } from "../../../../../../modules/module";
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
    const util = TwinBeeModule.util;
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
  public get option(): typeof this._option {
    return this._option;
  }
  protected set option(v: typeof this._option) {
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
  public override async sendRequestByCriteria(
    literalCriteria: IGenericDriverCriteria
  ): Promise<IGenericDriverResponse> {
    this.preRequestByCriteria(literalCriteria);
    let option = this.util.clone(this.option); //❗Posible error❗, option puede tener instancias en sus propiedades
    let response: Response;
    let driverResponse: IGenericDriverResponse;
    //try-catch especializado para fetch
    try {
      const { data: txData } = literalCriteria;
      //configuración de opciones obligatorias
      option.method = this.getHttpMethodFromLiteralCriteria(literalCriteria);
      option.body = this.dataToBody(txData);
      let url = this.buildUrl();
      //selección tipo de ejecución de la api de envío http
      const customQueryDriverFn = this.getCustomQueryFn(literalCriteria);
      if (this.util.isFunction(customQueryDriverFn)) {
        //personalizada
        const fn = customQueryDriverFn as THttpCustomQueryDriverFn<
          this,
          IGenericDriverCriteria,
          TFetchCustomQueryFnReturn
        >;
        const { url: mod_url, option: mod_option } = await fn(
          this,
          literalCriteria as any
        );
        url = this.util.isString(mod_url) ? mod_url : url;
        option = this.util.deepMergeObjects([option, mod_option], {
          mode: "soft",
        });
      }
      response = await fetch(url, option);
      driverResponse = await this.adaptHttpResponseToIDriveResponseByCriteria(
        literalCriteria,
        response
      );
    } catch (error) {
      response = {
        ok: false,
        headers: option.headers,
        status: EHttpStatusCode.CONFLICT,
      } as Response;
      driverResponse = await this.adaptHttpResponseToIDriveResponseByCriteria(
        literalCriteria,
        response,
        error
      );
    } finally {
      this.postRequestByResponse(driverResponse);
    }
    return driverResponse;
  }
  public override async sendRequestByCriteriaModule(
    literalCriteria:
      | TPrimitiveLiteralCriteriaUnion
      | TStructureLiteralCriteriaUnion<any>
  ): Promise<IDriverResponse> {
    this.preRequestByCriteriaModule(literalCriteria);
    let option = this.util.clone(this.option); //❗Posible error❗, option puede tener instancias en sus propiedades
    let response: Response;
    let driverResponse: IDriverResponse;
    //try-catch especializado para fetch
    try {
      const { data: txData } = literalCriteria;
      //configuración de opciones obligatorias
      option.method =
        this.getHttpMethodFromLiteralCriteriaModule(literalCriteria);
      option.body = this.dataToBody(txData);
      const urlBodyParts =
        this.getUrlBodyPartsFromLiteralCriteriaModule(literalCriteria);
      let url = this.buildUrl(urlBodyParts);
      //selección tipo de ejecución de la api de envío http
      const customQueryDriverFn = this.getCustomQueryFnModule(literalCriteria);
      if (this.util.isFunction(customQueryDriverFn)) {
        //personalizada
        const fn = customQueryDriverFn as THttpCustomQueryDriverFn<
          this,
          TPrimitiveLiteralCriteriaUnion | TStructureLiteralCriteriaUnion<any>,
          TFetchCustomQueryFnReturn
        >;
        const { url: mod_url, option: mod_option } = await fn(
          this,
          literalCriteria as any
        );
        url = this.util.isString(mod_url) ? mod_url : url;
        option = this.util.deepMergeObjects([option, mod_option], {
          mode: "soft",
        });
      }
      response = await fetch(url, option);
      driverResponse =
        await this.adaptHttpResponseToIDriveResponseByCriteriaModule(
          literalCriteria,
          response
        );
    } catch (error) {
      response = {
        ok: false,
        headers: option.headers,
        status: EHttpStatusCode.CONFLICT,
      } as Response;
      driverResponse =
        await this.adaptHttpResponseToIDriveResponseByCriteriaModule(
          literalCriteria,
          response,
          error
        );
    } finally {
      this.postRequestByResponseModule(driverResponse);
    }
    return driverResponse;
  }
  protected override preRequestByCriteria(
    literalCriteria: IGenericDriverCriteria
  ): void {
    super.preRequestByCriteria(literalCriteria);
    return;
  }
  protected override postRequestByResponse(
    driverRes: IGenericDriverResponse
  ): void {
    super.postRequestByResponse(driverRes);
    return;
  }
  protected override preRequestByCriteriaModule(
    literalCriteria:
      | TPrimitiveLiteralCriteriaUnion
      | TStructureLiteralCriteriaUnion<any>
  ): void {
    super.preRequestByCriteriaModule(literalCriteria);
    return;
  }
  protected override postRequestByResponseModule(
    driverRes: IDriverResponse
  ): void {
    super.postRequestByResponseModule(driverRes);
    return;
  }
  protected override async adaptHttpResponseToIDriveResponseByCriteria(
    literalCriteria: IGenericDriverCriteria,
    responseToAdapt: Response,
    error?: any
  ): Promise<IGenericDriverResponse> {
    let driverRes: IGenericDriverResponse;
    const { status, statusText, headers } = responseToAdapt;
    if (this.util.isUndefinedOrNull(error)) {
      const contentType = headers.get("Content-Type");
      if (contentType.includes("application/json")) {
        driverRes = await this.processApplicationJsonResponseByRequestCriteria(
          literalCriteria,
          responseToAdapt
        );
      } else if (contentType.includes("text/")) {
        driverRes = await this.processTextResponseByRequestCriteria(
          literalCriteria,
          responseToAdapt
        );
      } else if (contentType.includes("image/")) {
        driverRes = await this.processImageResponseByRequestCriteria(
          literalCriteria,
          responseToAdapt
        );
      } else if (contentType.includes("application/pdf")) {
        driverRes = await this.processApplicationPdfResponseByRequestCriteria(
          literalCriteria,
          responseToAdapt
        );
      } else if (contentType.includes("application/octet-stream")) {
        driverRes =
          await this.processApplicationOctetStreamResponseByRequestCriteria(
            literalCriteria,
            responseToAdapt
          );
      } else if (contentType.includes("multipart/form-data")) {
        driverRes =
          await this.processMultipartFormDataResponseByRequestCriteria(
            literalCriteria,
            responseToAdapt
          );
      } else {
        driverRes = this.buildDriverResponse(literalCriteria, {
          rxData: this.util.dfValue,
          msn: `${contentType} is a content type unknown`,
          status: ELogicResStatusCode.ERROR,
          detail: responseToAdapt,
        });
      }
    } else {
      driverRes = this.buildDriverResponse(literalCriteria, {
        rxData: this.util.dfValue,
        msn: statusText,
        status: status ?? ELogicResStatusCode.ERROR,
        detail: responseToAdapt,
        error,
      }); //no verificar dato
    }
    return driverRes;
  }
  /**... */
  protected async processApplicationJsonResponseByRequestCriteria(
    literalCriteria: IGenericDriverCriteria,
    responseToAdapt: Response
  ): Promise<IGenericDriverResponse> {
    const { status, statusText } = responseToAdapt;
    let driverRes: IGenericDriverResponse;
    if (this.typeResponseContainer === "none") {
      //en respuesta `application/json` ❗sin contenedor❗
      const fetchData = await responseToAdapt.json();
      driverRes = this.buildDriverResponse(literalCriteria, {
        rxData: fetchData,
        status: this.convertHttpStatusCodeToLogicStatusCode(status),
        msn: statusText,
        detail: responseToAdapt,
      });
    } else if (this.typeResponseContainer === "twinBee") {
      //en respuesta `application/json` se obtiene un contenedor de datos fetch
      const fetchDataContainer =
        (await responseToAdapt.json()) as TGenericContainerHttpApiResponse;
      if (
        this.util.isObjectWithProperties(fetchDataContainer, ["data"], {
          propCondition: "it-exist",
        })
      ) {
        //desempaquetar el contenedor de data fetch:
        const {
          data: fetchData,
          status: fetchStatus,
          msn: fetchMsn,
        } = fetchDataContainer;
        driverRes = this.buildDriverResponse(literalCriteria, {
          rxData: fetchData,
          status:
            this.util.isNumber(fetchStatus) && fetchStatus < 100
              ? fetchStatus
              : this.convertHttpStatusCodeToLogicStatusCode(status),
          msn: this.util.isString(fetchMsn) ? fetchMsn : statusText,
          detail: responseToAdapt,
        });
      } else {
        //no existe del contenedor data fetch
        driverRes = this.buildDriverResponse(literalCriteria, {
          rxData: this.util.dfValue,
          status: ELogicResStatusCode.BAD,
          msn: this.util.isString(statusText)
            ? statusText
            : `unexpected response data`,
          detail: responseToAdapt,
        });
      }
    } else if (this.util.isFunction(this.typeResponseContainer)) {
      //en respuesta `application/json` se obtiene un contenedor de datos fetch
      let fetchDataContainer =
        (await responseToAdapt.json()) as TGenericContainerHttpApiResponse;
      let fn = this.typeResponseContainer;
      fn = fn.bind(this);
      fetchDataContainer = fn(fetchDataContainer);
      //desempaquetar el contenedor de data fetch:
      const {
        data: fetchData,
        status: fetchStatus,
        msn: fetchMsn,
      } = fetchDataContainer;
      driverRes = this.buildDriverResponse(literalCriteria, {
        rxData: fetchData,
        status:
          this.util.isNumber(fetchStatus) && fetchStatus < 100
            ? fetchStatus
            : this.convertHttpStatusCodeToLogicStatusCode(status),
        msn: this.util.isString(fetchMsn) ? fetchMsn : statusText,
        detail: responseToAdapt,
      });
    } else {
      //no se puede procesar el contenedor recibido
      driverRes = this.buildDriverResponse(literalCriteria, {
        rxData: this.util.dfValue,
        status: ELogicResStatusCode.ERROR,
        msn: `unexpected response data (container unknown)`,
        detail: responseToAdapt,
      });
    }
    return driverRes;
  }
  /**... */
  protected async processTextResponseByRequestCriteria(
    literalCriteria: IGenericDriverCriteria,
    responseToAdapt: Response
  ): Promise<IGenericDriverResponse> {
    const { status, statusText } = responseToAdapt;
    let driverRes: IGenericDriverResponse;
    //en respuesta `text`
    const fetchData = await responseToAdapt.text();
    driverRes = this.buildDriverResponse(literalCriteria, {
      rxData: fetchData,
      msn: statusText,
      status: this.convertHttpStatusCodeToLogicStatusCode(status),
      detail: responseToAdapt,
    });
    return driverRes;
  }
  /**... */
  protected async processImageResponseByRequestCriteria(
    literalCriteria: IGenericDriverCriteria,
    responseToAdapt: Response
  ): Promise<IGenericDriverResponse> {
    const { status, statusText } = responseToAdapt;
    let driverRes: IGenericDriverResponse;
    //en respuesta `image` en `blob`
    const fetchData = await responseToAdapt.blob();
    driverRes = this.buildDriverResponse(literalCriteria, {
      rxData: fetchData,
      msn: statusText,
      status: this.convertHttpStatusCodeToLogicStatusCode(status),
      detail: responseToAdapt,
    });
    return driverRes;
  }
  /**... */
  protected async processApplicationPdfResponseByRequestCriteria(
    literalCriteria: IGenericDriverCriteria,
    responseToAdapt: Response
  ): Promise<IGenericDriverResponse> {
    const { status, statusText } = responseToAdapt;
    let driverRes: IGenericDriverResponse;
    //en respuesta `pdf` en `blob`
    const fetchData = await responseToAdapt.blob();
    driverRes = this.buildDriverResponse(literalCriteria, {
      rxData: fetchData,
      msn: statusText,
      status: this.convertHttpStatusCodeToLogicStatusCode(status),
      detail: responseToAdapt,
    });
    return driverRes;
  }
  /**... */
  protected async processApplicationOctetStreamResponseByRequestCriteria(
    literalCriteria: IGenericDriverCriteria,
    responseToAdapt: Response
  ): Promise<IGenericDriverResponse> {
    const { status, statusText } = responseToAdapt;
    let driverRes: IGenericDriverResponse;
    const fetchData = await responseToAdapt.arrayBuffer();
    driverRes = this.buildDriverResponse(literalCriteria, {
      rxData: fetchData,
      msn: statusText,
      status: this.convertHttpStatusCodeToLogicStatusCode(status),
      detail: responseToAdapt,
    }); //arrayBuffer no puede verificarse dato
    return driverRes;
  }
  /**... */
  protected async processMultipartFormDataResponseByRequestCriteria(
    literalCriteria: IGenericDriverCriteria,
    responseToAdapt: Response
  ): Promise<IGenericDriverResponse> {
    const { status, statusText } = responseToAdapt;
    let driverRes: IGenericDriverResponse;
    const fetchData = await responseToAdapt.formData();
    driverRes = this.buildDriverResponse(literalCriteria, {
      rxData: fetchData,
      msn: statusText,
      status: this.convertHttpStatusCodeToLogicStatusCode(status),
      detail: responseToAdapt,
    });
    return driverRes;
  }
  protected override async adaptHttpResponseToIDriveResponseByCriteriaModule(
    literalCriteria:
      | TPrimitiveLiteralCriteriaUnion
      | TStructureLiteralCriteriaUnion<any>,
    responseToAdapt: Response,
    error?: any
  ): Promise<IDriverResponse> {
    let driverRes: IDriverResponse;
    const { status, statusText, headers } = responseToAdapt;
    if (this.util.isUndefinedOrNull(error)) {
      const contentType = headers.get("Content-Type");
      if (contentType.includes("application/json")) {
        driverRes =
          await this.processApplicationJsonResponseByRequestCriteriaModule(
            literalCriteria,
            responseToAdapt
          );
      } else if (contentType.includes("text/")) {
        driverRes = await this.processTextResponseByRequestCriteriaModule(
          literalCriteria,
          responseToAdapt
        );
      } else if (contentType.includes("image/")) {
        driverRes = await this.processImageResponseByRequestCriteriaModule(
          literalCriteria,
          responseToAdapt
        );
      } else if (contentType.includes("application/pdf")) {
        driverRes =
          await this.processApplicationPdfResponseByRequestCriteriaModule(
            literalCriteria,
            responseToAdapt
          );
      } else if (contentType.includes("application/octet-stream")) {
        driverRes =
          await this.processApplicationOctetStreamResponseByRequestCriteriaModule(
            literalCriteria,
            responseToAdapt
          );
      } else if (contentType.includes("multipart/form-data")) {
        driverRes =
          await this.processMultipartFormDataResponseByRequestCriteriaModule(
            literalCriteria,
            responseToAdapt
          );
      } else {
        driverRes = this.buildDriverResponseModule(
          literalCriteria,
          {
            rxData: this.util.dfValue,
            msn: `${contentType} is a content type unknown`,
            status: ELogicResStatusCode.ERROR,
            detail: responseToAdapt,
          },
          false
        ); //no verificar dato
      }
    } else {
      driverRes = this.buildDriverResponseModule(
        literalCriteria,
        {
          rxData: this.util.dfValue,
          msn: statusText,
          status: status ?? ELogicResStatusCode.ERROR,
          detail: responseToAdapt,
          error,
        },
        false
      ); //no verificar dato
    }
    return driverRes;
  }
  /**... */
  protected async processApplicationJsonResponseByRequestCriteriaModule(
    literalCriteria:
      | TPrimitiveLiteralCriteriaUnion
      | TStructureLiteralCriteriaUnion<any>,
    responseToAdapt: Response
  ): Promise<IDriverResponse> {
    const { status, statusText } = responseToAdapt;
    let driverRes: IDriverResponse;
    if (this.typeResponseContainer === "none") {
      //en respuesta `application/json` ❗sin contenedor❗
      const fetchData = await responseToAdapt.json();
      driverRes = this.buildDriverResponseModule(
        literalCriteria,
        {
          rxData: fetchData,
          status: this.convertHttpStatusCodeToLogicStatusCode(status),
          msn: statusText,
          detail: responseToAdapt,
        },
        true
      );
    } else if (this.typeResponseContainer === "twinBee") {
      //en respuesta `application/json` se obtiene un contenedor de datos fetch
      const fetchDataContainer =
        (await responseToAdapt.json()) as TGenericContainerHttpApiResponse;
      if (
        this.util.isObjectWithProperties(
          fetchDataContainer,
          ["data", "status"],
          {
            propCondition: "it-exist",
          }
        )
      ) {
        //desempaquetar el contenedor de data fetch:
        const {
          data: fetchData,
          status: fetchStatus,
          msn: fetchMsn,
        } = fetchDataContainer;
        driverRes = this.buildDriverResponseModule(
          literalCriteria,
          {
            rxData: fetchData,
            status:
              this.util.isNumber(fetchStatus) && fetchStatus < 100
                ? fetchStatus
                : this.convertHttpStatusCodeToLogicStatusCode(status),
            msn: this.util.isString(fetchMsn) ? fetchMsn : statusText,
            detail: responseToAdapt,
          },
          true
        );
      } else {
        //no existe del contenedor data fetch
        driverRes = this.buildDriverResponseModule(
          literalCriteria,
          {
            rxData: this.util.dfValue,
            status: ELogicResStatusCode.BAD,
            msn: this.util.isString(statusText)
              ? statusText
              : `unexpected response data`,
            detail: responseToAdapt,
          },
          true
        );
      }
    } else if (this.util.isFunction(this.typeResponseContainer)) {
      let fetchDataContainer =
        (await responseToAdapt.json()) as TGenericContainerHttpApiResponse;
      let fn = this.typeResponseContainer;
      fn = fn.bind(this);
      fetchDataContainer = fn(fetchDataContainer);
      //desempaquetar el contenedor de data fetch:
      const {
        data: fetchData,
        status: fetchStatus,
        msn: fetchMsn,
      } = fetchDataContainer;
      driverRes = this.buildDriverResponseModule(
        literalCriteria,
        {
          rxData: fetchData,
          status:
            this.util.isNumber(fetchStatus) && fetchStatus < 100
              ? fetchStatus
              : this.convertHttpStatusCodeToLogicStatusCode(status),
          msn: this.util.isString(fetchMsn) ? fetchMsn : statusText,
          detail: responseToAdapt,
        },
        true
      );
    } else {
      //no existe del contenedor data fetch
      driverRes = this.buildDriverResponseModule(
        literalCriteria,
        {
          rxData: this.util.dfValue,
          status: ELogicResStatusCode.ERROR,
          msn: `unexpected response data (unknown container)`,
          detail: responseToAdapt,
        },
        true
      );
    }
    return driverRes;
  }
  /**... */
  protected async processTextResponseByRequestCriteriaModule(
    literalCriteria:
      | TPrimitiveLiteralCriteriaUnion
      | TStructureLiteralCriteriaUnion<any>,
    responseToAdapt: Response
  ): Promise<IDriverResponse> {
    const { status, statusText } = responseToAdapt;
    let driverRes: IDriverResponse;
    //en respuesta `text`
    const fetchData = await responseToAdapt.text();
    driverRes = this.buildDriverResponseModule(
      literalCriteria,
      {
        rxData: fetchData,
        msn: statusText,
        status: this.convertHttpStatusCodeToLogicStatusCode(status),
        detail: responseToAdapt,
      },
      true
    );
    return driverRes;
  }
  /**... */
  protected async processImageResponseByRequestCriteriaModule(
    literalCriteria:
      | TPrimitiveLiteralCriteriaUnion
      | TStructureLiteralCriteriaUnion<any>,
    responseToAdapt: Response
  ): Promise<IDriverResponse> {
    const { status, statusText } = responseToAdapt;
    let driverRes: IDriverResponse;
    //en respuesta `image` en `blob`
    const fetchData = await responseToAdapt.blob();
    driverRes = this.buildDriverResponseModule(
      literalCriteria,
      {
        rxData: fetchData,
        msn: statusText,
        status: this.convertHttpStatusCodeToLogicStatusCode(status),
        detail: responseToAdapt,
      },
      false
    ); //blob no puede verificarse dato
    return driverRes;
  }
  /**... */
  protected async processApplicationPdfResponseByRequestCriteriaModule(
    literalCriteria:
      | TPrimitiveLiteralCriteriaUnion
      | TStructureLiteralCriteriaUnion<any>,
    responseToAdapt: Response
  ): Promise<IDriverResponse> {
    const { status, statusText } = responseToAdapt;
    let driverRes: IDriverResponse;
    //en respuesta `pdf` en `blob`
    const fetchData = await responseToAdapt.blob();
    driverRes = this.buildDriverResponseModule(
      literalCriteria,
      {
        rxData: fetchData,
        msn: statusText,
        status: this.convertHttpStatusCodeToLogicStatusCode(status),
        detail: responseToAdapt,
      },
      false
    ); //blob no puede verificarse dato
    return driverRes;
  }
  /**... */
  protected async processApplicationOctetStreamResponseByRequestCriteriaModule(
    literalCriteria:
      | TPrimitiveLiteralCriteriaUnion
      | TStructureLiteralCriteriaUnion<any>,
    responseToAdapt: Response
  ): Promise<IDriverResponse> {
    const { status, statusText } = responseToAdapt;
    let driverRes: IDriverResponse;
    const fetchData = await responseToAdapt.arrayBuffer();
    driverRes = this.buildDriverResponseModule(
      literalCriteria,
      {
        rxData: fetchData,
        msn: statusText,
        status: this.convertHttpStatusCodeToLogicStatusCode(status),
        detail: responseToAdapt,
      },
      false
    ); //arrayBuffer no puede verificarse dato
    return driverRes;
  }
  /**... */
  protected async processMultipartFormDataResponseByRequestCriteriaModule(
    literalCriteria:
      | TPrimitiveLiteralCriteriaUnion
      | TStructureLiteralCriteriaUnion<any>,
    responseToAdapt: Response
  ): Promise<IDriverResponse> {
    const { status, statusText } = responseToAdapt;
    let driverRes: IDriverResponse;
    const fetchData = await responseToAdapt.formData();
    driverRes = this.buildDriverResponseModule(
      literalCriteria,
      {
        rxData: fetchData,
        msn: statusText,
        status: this.convertHttpStatusCodeToLogicStatusCode(status),
        detail: responseToAdapt,
      },
      false
    ); //formData no puede verificarse dato
    return driverRes;
  }
}
