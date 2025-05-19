import {
  ELogicResStatusCode,
  IRepositoryResponse,
  IGenericRepositoryResponse,
  TGenericContainerHttpApiResponse,
} from "../../../../../../reports/shared-types";
import { EHttpStatusCode } from "../../../../../../util/http-tool";
import {
  IGenericRepositoryCriteria,
  TPrimitiveLiteralCriteriaUnion,
  TStructureLiteralCriteriaUnion,
} from "../../../../../../criterias/shared-types";
import { HttpRepository } from "../_https-repository";
import { THttpCustomQueryRepositoryFn } from "../shared-types";
import { IFetchOption, TFetchCustomQueryFnReturn } from "./shared-types";
//❗❗❗Importacion Fuertemente acoplada, debe estar al final❗❗❗
import { TwinBeeModule } from "../../../../../../modules/module";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *selfcontructor*
 *
 * ...
 */
export class FetchRepository
  extends HttpRepository
  implements ReturnType<FetchRepository["getDefault"]>
{
  public static readonly getNameLogicRepository = () => {
    const util = TwinBeeModule.util;
    //const sp = util.charSeparatorLogicName;
    const prefixGroupName = HttpRepository.getNameLogicRepository();
    let name = "fetch";
    name = `${prefixGroupName}${name}`;
    return name;
  };
  public static override readonly getDefault = () => {
    const superDf = HttpRepository.getDefault();
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
    const superCONST = HttpRepository.getCONSTANTS();
    return {
      ...superCONST,
      //..aquí las constantes
    };
  };
  public override nameLogicRepository =
    FetchRepository.getNameLogicRepository();
  private _option: ReturnType<FetchRepository["getDefault"]>["option"];
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
    base: Partial<ReturnType<FetchRepository["getDefault"]>> = {},
    isInit = true
  ) {
    super(base, false);
    if (isInit) this.initProps(base);
  }
  protected override getDefault() {
    return FetchRepository.getDefault();
  }
  protected override getCONST() {
    return FetchRepository.getCONSTANTS();
  }
  //❗normalmente definidas en el padre, salvo que se quieran sobreescribir❗
  // /**inicializa las propiedades de manera dinamica
  //  *
  //  * @param base objeto literal con valores personalizados para inicalizar las propiedades
  //  */
  // protected override initProps(base: Partial<ReturnType<FetchRepository["getDefault"]>>): void {
  //   for (const key in this.getDefault()) {
  //     this[key] = base[key];
  //   }
  //   return;
  // }
  // /**reinicia una propiedad al valor predefinido
  //  *
  //  * @param key clave identificadora de la propiedad a reiniciar
  //  */
  // public override resetPropByKey(key: keyof ReturnType<FetchRepository["getDefault"]>): void {
  //   const df = this.getDefault();
  //   this[key] = df[key];
  //   return;
  // }
  public override mutateProps(
    base: Partial<ReturnType<FetchRepository["getDefault"]>>
  ): void {
    super.mutateProps(base);
    return;
  }
  public override getLiteral(): ReturnType<FetchRepository["getDefault"]> {
    return super.getLiteral() as any;
  }
  public override async sendRequestByCriteria(
    literalCriteria: IGenericRepositoryCriteria
  ): Promise<IGenericRepositoryResponse> {
    this.preRequestByCriteria(literalCriteria);
    let option = this.util.clone(this.option); //❗Posible error❗, option puede tener instancias en sus propiedades
    let response: Response;
    let repositoryResponse: IGenericRepositoryResponse;
    //try-catch especializado para fetch
    try {
      const { data: txData } = literalCriteria;
      //configuración de opciones obligatorias
      option.method = this.getHttpMethodFromLiteralCriteria(literalCriteria);
      option.body = this.dataToBody(txData);
      let url = this.buildUrl();
      //selección tipo de ejecución de la api de envío http
      const customQueryRepositoryFn = this.getCustomQueryFn(literalCriteria);
      if (this.util.isFunction(customQueryRepositoryFn)) {
        //personalizada
        const fn = customQueryRepositoryFn as THttpCustomQueryRepositoryFn<
          this,
          IGenericRepositoryCriteria,
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
      repositoryResponse =
        await this.adaptHttpResponseToIDriveResponseByCriteria(
          literalCriteria,
          response
        );
    } catch (error) {
      response = {
        ok: false,
        headers: option.headers,
        status: EHttpStatusCode.CONFLICT,
      } as Response;
      repositoryResponse =
        await this.adaptHttpResponseToIDriveResponseByCriteria(
          literalCriteria,
          response,
          error
        );
    } finally {
      this.postRequestByResponse(repositoryResponse);
    }
    return repositoryResponse;
  }
  public override async sendRequestByCriteriaModule(
    literalCriteria:
      | TPrimitiveLiteralCriteriaUnion
      | TStructureLiteralCriteriaUnion<any>
  ): Promise<IRepositoryResponse> {
    this.preRequestByCriteriaModule(literalCriteria);
    let option = this.util.clone(this.option); //❗Posible error❗, option puede tener instancias en sus propiedades
    let response: Response;
    let repositoryResponse: IRepositoryResponse;
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
      const customQueryRepositoryFn =
        this.getCustomQueryFnModule(literalCriteria);
      if (this.util.isFunction(customQueryRepositoryFn)) {
        //personalizada
        const fn = customQueryRepositoryFn as THttpCustomQueryRepositoryFn<
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
      repositoryResponse =
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
      repositoryResponse =
        await this.adaptHttpResponseToIDriveResponseByCriteriaModule(
          literalCriteria,
          response,
          error
        );
    } finally {
      this.postRequestByResponseModule(repositoryResponse);
    }
    return repositoryResponse;
  }
  protected override preRequestByCriteria(
    literalCriteria: IGenericRepositoryCriteria
  ): void {
    super.preRequestByCriteria(literalCriteria);
    return;
  }
  protected override postRequestByResponse(
    repositoryRes: IGenericRepositoryResponse
  ): void {
    super.postRequestByResponse(repositoryRes);
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
    repositoryRes: IRepositoryResponse
  ): void {
    super.postRequestByResponseModule(repositoryRes);
    return;
  }
  protected override async adaptHttpResponseToIDriveResponseByCriteria(
    literalCriteria: IGenericRepositoryCriteria,
    responseToAdapt: Response,
    error?: any
  ): Promise<IGenericRepositoryResponse> {
    let repositoryRes: IGenericRepositoryResponse;
    const { status, statusText, headers } = responseToAdapt;
    if (this.util.isUndefinedOrNull(error)) {
      const contentType = headers.get("Content-Type");
      if (contentType.includes("application/json")) {
        repositoryRes =
          await this.processApplicationJsonResponseByRequestCriteria(
            literalCriteria,
            responseToAdapt
          );
      } else if (contentType.includes("text/")) {
        repositoryRes = await this.processTextResponseByRequestCriteria(
          literalCriteria,
          responseToAdapt
        );
      } else if (contentType.includes("image/")) {
        repositoryRes = await this.processImageResponseByRequestCriteria(
          literalCriteria,
          responseToAdapt
        );
      } else if (contentType.includes("application/pdf")) {
        repositoryRes =
          await this.processApplicationPdfResponseByRequestCriteria(
            literalCriteria,
            responseToAdapt
          );
      } else if (contentType.includes("application/octet-stream")) {
        repositoryRes =
          await this.processApplicationOctetStreamResponseByRequestCriteria(
            literalCriteria,
            responseToAdapt
          );
      } else if (contentType.includes("multipart/form-data")) {
        repositoryRes =
          await this.processMultipartFormDataResponseByRequestCriteria(
            literalCriteria,
            responseToAdapt
          );
      } else {
        repositoryRes = this.buildRepositoryResponse(literalCriteria, {
          rxData: this.util.dfValue,
          msn: `${contentType} is a content type unknown`,
          status: ELogicResStatusCode.ERROR,
          detail: responseToAdapt,
        });
      }
    } else {
      repositoryRes = this.buildRepositoryResponse(literalCriteria, {
        rxData: this.util.dfValue,
        msn: statusText,
        status: status ?? ELogicResStatusCode.ERROR,
        detail: responseToAdapt,
        error,
      }); //no verificar dato
    }
    return repositoryRes;
  }
  /**... */
  protected async processApplicationJsonResponseByRequestCriteria(
    literalCriteria: IGenericRepositoryCriteria,
    responseToAdapt: Response
  ): Promise<IGenericRepositoryResponse> {
    const { status, statusText } = responseToAdapt;
    let repositoryRes: IGenericRepositoryResponse;
    if (this.typeResponseContainer === "none") {
      //en respuesta `application/json` ❗sin contenedor❗
      const fetchData = await responseToAdapt.json();
      repositoryRes = this.buildRepositoryResponse(literalCriteria, {
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
        repositoryRes = this.buildRepositoryResponse(literalCriteria, {
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
        repositoryRes = this.buildRepositoryResponse(literalCriteria, {
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
      repositoryRes = this.buildRepositoryResponse(literalCriteria, {
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
      repositoryRes = this.buildRepositoryResponse(literalCriteria, {
        rxData: this.util.dfValue,
        status: ELogicResStatusCode.ERROR,
        msn: `unexpected response data (container unknown)`,
        detail: responseToAdapt,
      });
    }
    return repositoryRes;
  }
  /**... */
  protected async processTextResponseByRequestCriteria(
    literalCriteria: IGenericRepositoryCriteria,
    responseToAdapt: Response
  ): Promise<IGenericRepositoryResponse> {
    const { status, statusText } = responseToAdapt;
    let repositoryRes: IGenericRepositoryResponse;
    //en respuesta `text`
    const fetchData = await responseToAdapt.text();
    repositoryRes = this.buildRepositoryResponse(literalCriteria, {
      rxData: fetchData,
      msn: statusText,
      status: this.convertHttpStatusCodeToLogicStatusCode(status),
      detail: responseToAdapt,
    });
    return repositoryRes;
  }
  /**... */
  protected async processImageResponseByRequestCriteria(
    literalCriteria: IGenericRepositoryCriteria,
    responseToAdapt: Response
  ): Promise<IGenericRepositoryResponse> {
    const { status, statusText } = responseToAdapt;
    let repositoryRes: IGenericRepositoryResponse;
    //en respuesta `image` en `blob`
    const fetchData = await responseToAdapt.blob();
    repositoryRes = this.buildRepositoryResponse(literalCriteria, {
      rxData: fetchData,
      msn: statusText,
      status: this.convertHttpStatusCodeToLogicStatusCode(status),
      detail: responseToAdapt,
    });
    return repositoryRes;
  }
  /**... */
  protected async processApplicationPdfResponseByRequestCriteria(
    literalCriteria: IGenericRepositoryCriteria,
    responseToAdapt: Response
  ): Promise<IGenericRepositoryResponse> {
    const { status, statusText } = responseToAdapt;
    let repositoryRes: IGenericRepositoryResponse;
    //en respuesta `pdf` en `blob`
    const fetchData = await responseToAdapt.blob();
    repositoryRes = this.buildRepositoryResponse(literalCriteria, {
      rxData: fetchData,
      msn: statusText,
      status: this.convertHttpStatusCodeToLogicStatusCode(status),
      detail: responseToAdapt,
    });
    return repositoryRes;
  }
  /**... */
  protected async processApplicationOctetStreamResponseByRequestCriteria(
    literalCriteria: IGenericRepositoryCriteria,
    responseToAdapt: Response
  ): Promise<IGenericRepositoryResponse> {
    const { status, statusText } = responseToAdapt;
    let repositoryRes: IGenericRepositoryResponse;
    const fetchData = await responseToAdapt.arrayBuffer();
    repositoryRes = this.buildRepositoryResponse(literalCriteria, {
      rxData: fetchData,
      msn: statusText,
      status: this.convertHttpStatusCodeToLogicStatusCode(status),
      detail: responseToAdapt,
    }); //arrayBuffer no puede verificarse dato
    return repositoryRes;
  }
  /**... */
  protected async processMultipartFormDataResponseByRequestCriteria(
    literalCriteria: IGenericRepositoryCriteria,
    responseToAdapt: Response
  ): Promise<IGenericRepositoryResponse> {
    const { status, statusText } = responseToAdapt;
    let repositoryRes: IGenericRepositoryResponse;
    const fetchData = await responseToAdapt.formData();
    repositoryRes = this.buildRepositoryResponse(literalCriteria, {
      rxData: fetchData,
      msn: statusText,
      status: this.convertHttpStatusCodeToLogicStatusCode(status),
      detail: responseToAdapt,
    });
    return repositoryRes;
  }
  protected override async adaptHttpResponseToIDriveResponseByCriteriaModule(
    literalCriteria:
      | TPrimitiveLiteralCriteriaUnion
      | TStructureLiteralCriteriaUnion<any>,
    responseToAdapt: Response,
    error?: any
  ): Promise<IRepositoryResponse> {
    let repositoryRes: IRepositoryResponse;
    const { status, statusText, headers } = responseToAdapt;
    if (this.util.isUndefinedOrNull(error)) {
      const contentType = headers.get("Content-Type");
      if (contentType.includes("application/json")) {
        repositoryRes =
          await this.processApplicationJsonResponseByRequestCriteriaModule(
            literalCriteria,
            responseToAdapt
          );
      } else if (contentType.includes("text/")) {
        repositoryRes = await this.processTextResponseByRequestCriteriaModule(
          literalCriteria,
          responseToAdapt
        );
      } else if (contentType.includes("image/")) {
        repositoryRes = await this.processImageResponseByRequestCriteriaModule(
          literalCriteria,
          responseToAdapt
        );
      } else if (contentType.includes("application/pdf")) {
        repositoryRes =
          await this.processApplicationPdfResponseByRequestCriteriaModule(
            literalCriteria,
            responseToAdapt
          );
      } else if (contentType.includes("application/octet-stream")) {
        repositoryRes =
          await this.processApplicationOctetStreamResponseByRequestCriteriaModule(
            literalCriteria,
            responseToAdapt
          );
      } else if (contentType.includes("multipart/form-data")) {
        repositoryRes =
          await this.processMultipartFormDataResponseByRequestCriteriaModule(
            literalCriteria,
            responseToAdapt
          );
      } else {
        repositoryRes = this.buildRepositoryResponseModule(
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
      repositoryRes = this.buildRepositoryResponseModule(
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
    return repositoryRes;
  }
  /**... */
  protected async processApplicationJsonResponseByRequestCriteriaModule(
    literalCriteria:
      | TPrimitiveLiteralCriteriaUnion
      | TStructureLiteralCriteriaUnion<any>,
    responseToAdapt: Response
  ): Promise<IRepositoryResponse> {
    const { status, statusText } = responseToAdapt;
    let repositoryRes: IRepositoryResponse;
    if (this.typeResponseContainer === "none") {
      //en respuesta `application/json` ❗sin contenedor❗
      const fetchData = await responseToAdapt.json();
      repositoryRes = this.buildRepositoryResponseModule(
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
        repositoryRes = this.buildRepositoryResponseModule(
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
        repositoryRes = this.buildRepositoryResponseModule(
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
      repositoryRes = this.buildRepositoryResponseModule(
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
      repositoryRes = this.buildRepositoryResponseModule(
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
    return repositoryRes;
  }
  /**... */
  protected async processTextResponseByRequestCriteriaModule(
    literalCriteria:
      | TPrimitiveLiteralCriteriaUnion
      | TStructureLiteralCriteriaUnion<any>,
    responseToAdapt: Response
  ): Promise<IRepositoryResponse> {
    const { status, statusText } = responseToAdapt;
    let repositoryRes: IRepositoryResponse;
    //en respuesta `text`
    const fetchData = await responseToAdapt.text();
    repositoryRes = this.buildRepositoryResponseModule(
      literalCriteria,
      {
        rxData: fetchData,
        msn: statusText,
        status: this.convertHttpStatusCodeToLogicStatusCode(status),
        detail: responseToAdapt,
      },
      true
    );
    return repositoryRes;
  }
  /**... */
  protected async processImageResponseByRequestCriteriaModule(
    literalCriteria:
      | TPrimitiveLiteralCriteriaUnion
      | TStructureLiteralCriteriaUnion<any>,
    responseToAdapt: Response
  ): Promise<IRepositoryResponse> {
    const { status, statusText } = responseToAdapt;
    let repositoryRes: IRepositoryResponse;
    //en respuesta `image` en `blob`
    const fetchData = await responseToAdapt.blob();
    repositoryRes = this.buildRepositoryResponseModule(
      literalCriteria,
      {
        rxData: fetchData,
        msn: statusText,
        status: this.convertHttpStatusCodeToLogicStatusCode(status),
        detail: responseToAdapt,
      },
      false
    ); //blob no puede verificarse dato
    return repositoryRes;
  }
  /**... */
  protected async processApplicationPdfResponseByRequestCriteriaModule(
    literalCriteria:
      | TPrimitiveLiteralCriteriaUnion
      | TStructureLiteralCriteriaUnion<any>,
    responseToAdapt: Response
  ): Promise<IRepositoryResponse> {
    const { status, statusText } = responseToAdapt;
    let repositoryRes: IRepositoryResponse;
    //en respuesta `pdf` en `blob`
    const fetchData = await responseToAdapt.blob();
    repositoryRes = this.buildRepositoryResponseModule(
      literalCriteria,
      {
        rxData: fetchData,
        msn: statusText,
        status: this.convertHttpStatusCodeToLogicStatusCode(status),
        detail: responseToAdapt,
      },
      false
    ); //blob no puede verificarse dato
    return repositoryRes;
  }
  /**... */
  protected async processApplicationOctetStreamResponseByRequestCriteriaModule(
    literalCriteria:
      | TPrimitiveLiteralCriteriaUnion
      | TStructureLiteralCriteriaUnion<any>,
    responseToAdapt: Response
  ): Promise<IRepositoryResponse> {
    const { status, statusText } = responseToAdapt;
    let repositoryRes: IRepositoryResponse;
    const fetchData = await responseToAdapt.arrayBuffer();
    repositoryRes = this.buildRepositoryResponseModule(
      literalCriteria,
      {
        rxData: fetchData,
        msn: statusText,
        status: this.convertHttpStatusCodeToLogicStatusCode(status),
        detail: responseToAdapt,
      },
      false
    ); //arrayBuffer no puede verificarse dato
    return repositoryRes;
  }
  /**... */
  protected async processMultipartFormDataResponseByRequestCriteriaModule(
    literalCriteria:
      | TPrimitiveLiteralCriteriaUnion
      | TStructureLiteralCriteriaUnion<any>,
    responseToAdapt: Response
  ): Promise<IRepositoryResponse> {
    const { status, statusText } = responseToAdapt;
    let repositoryRes: IRepositoryResponse;
    const fetchData = await responseToAdapt.formData();
    repositoryRes = this.buildRepositoryResponseModule(
      literalCriteria,
      {
        rxData: fetchData,
        msn: statusText,
        status: this.convertHttpStatusCodeToLogicStatusCode(status),
        detail: responseToAdapt,
      },
      false
    ); //formData no puede verificarse dato
    return repositoryRes;
  }
}
