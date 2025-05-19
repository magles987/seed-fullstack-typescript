import { WebRepository } from "../_web-repository";
import { EncryptAndCompressDataHandler } from "../../../../../util/encripter-handler";
import { CriteriaHandler } from "../../../../../criterias/_criteria-handler";
import { ELogicCodeError, LogicError } from "../../../../../errors/logic-error";
import {
  ELogicResStatusCode,
  IRepositoryResponse,
  IGenericRepositoryResponse,
} from "../../../../../reports/shared-types";
import { TTypeResponseContainer, TUrlActionType } from "./shared-types";
import {
  EHttpRangeStatusCode,
  EHttpStatusCode,
  TKeyHttpMethod,
} from "../../../../../util/http-tool";
import {
  IGenericRepositoryCriteria,
  TPrimitiveLiteralCriteriaUnion,
  TStructureLiteralCriteriaUnion,
  TStructureModifyLiteralCriteria,
} from "../../../../../criterias/shared-types";
import { TwinBeeModule } from "../../../../../modules/module";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *selfcontructor*
 *
 * ...
 */
export abstract class HttpRepository
  extends WebRepository
  implements ReturnType<HttpRepository["getDefault"]>
{
  public static readonly getNameLogicRepository = () => {
    const util = TwinBeeModule.util;
    const sp = util.charSeparatorLogicName;
    const prefixGroupName = WebRepository.getNameLogicRepository();
    let name = "http";
    name = `${prefixGroupName}${name}${sp}`;
    return name;
  };
  public static override readonly getDefault = () => {
    const superDf = WebRepository.getDefault();
    return {
      ...superDf,
      /**url raíz del recurso */
      urlRoot: "",
      /**prefijo de la url (después del root)
       *
       * Ejemplo:
       * ````
       * `${urlRoot}/${urlPrefix}....`
       * ````
       *
       */
      urlPostfix: "",
      /**prefijo de la url (después del root)
       *
       * Ejemplo:
       * ````
       * `${urlRoot}/${urlPrefix}..../${urlPostfix}`
       * ````
       *
       */
      urlPrefix: "",
      /**acción para la construcción de la url
       *
       * - `"basic"` indica que será con las acciones CRUD básicas ("read", "create", "update", "delete").
       * - `"custom"` indica que será con acciones personalizadas
       */
      urlActionType: "basic" as TUrlActionType,
      /**palabra para encriptado y desencriptado con JWT */
      urlSecretKeyJWT: "#d3f4ult*",
      /**tipo de contenedor en que la api externa retorna los datos de respuesta*/
      typeResponseContainer: "twinBee" as TTypeResponseContainer,
    };
  };
  protected static override readonly getCONSTANTS = () => {
    const superCONST = WebRepository.getCONSTANTS();
    return {
      ...superCONST,
      URL_LIMIT: 2000, //máximo 2000 caracteres
    };
  };
  private _urlRoot: string;
  public get urlRoot(): string {
    return this._urlRoot;
  }
  protected set urlRoot(v: string) {
    this._urlRoot = this.util.isString(v)
      ? v
      : this._urlRoot !== undefined
      ? this._urlRoot
      : this.getDefault().urlRoot;
  }
  private _urlPrefix?: string;
  public get urlPrefix(): string {
    return this._urlPrefix;
  }
  protected set urlPrefix(v: string) {
    this._urlPrefix = this.util.isString(v)
      ? v
      : this._urlPrefix !== undefined
      ? this._urlPrefix
      : this.getDefault().urlPrefix;
  }
  private _urlPostfix?: string;
  public get urlPostfix(): string {
    return this._urlPostfix;
  }
  protected set urlPostfix(v: string) {
    this._urlPostfix = this.util.isString(v)
      ? v
      : this._urlPostfix !== undefined
      ? this._urlPostfix
      : this.getDefault().urlPostfix;
  }
  /**... */
  private _urlActionType: TUrlActionType;
  public get urlActionType(): TUrlActionType {
    return this._urlActionType;
  }
  protected set urlActionType(v: TUrlActionType) {
    this._urlActionType =
      v === "basic" || v === "custom"
        ? v
        : this.urlActionType !== undefined
        ? this._urlActionType
        : this.getDefault().urlActionType;
  }
  private _urlSecretKeyJWT: string;
  public get urlSecretKeyJWT(): string {
    return this._urlSecretKeyJWT;
  }
  protected set urlSecretKeyJWT(v: string) {
    this._urlSecretKeyJWT = this.util.isString(v)
      ? v
      : this._urlSecretKeyJWT !== undefined
      ? this._urlSecretKeyJWT
      : this.getDefault().urlSecretKeyJWT;
  }
  private _typeResponseContainer: ReturnType<
    HttpRepository["getDefault"]
  >["typeResponseContainer"];
  public get typeResponseContainer(): ReturnType<
    HttpRepository["getDefault"]
  >["typeResponseContainer"] {
    return this._typeResponseContainer;
  }
  protected set typeResponseContainer(
    v: ReturnType<HttpRepository["getDefault"]>["typeResponseContainer"]
  ) {
    this._typeResponseContainer = this.util.isString(v)
      ? v
      : this.util.isString(this._typeResponseContainer)
      ? this._typeResponseContainer
      : this.getDefault().typeResponseContainer;
  }
  /**
   * @param base objeto literal con valores personalizados para iniicalizar las propiedades
   * @param isInit `= true` ❕Solo para herencia❕, indica si esta clase debe iniciar las propiedaes
   */
  constructor(
    base: Partial<ReturnType<HttpRepository["getDefault"]>> = {},
    isInit = true
  ) {
    super(base, false);
    if (isInit) this.initProps(base);
  }
  protected override getDefault() {
    return HttpRepository.getDefault();
  }
  protected override getCONST() {
    return HttpRepository.getCONSTANTS();
  }
  //❗normalmente definidas en el padre, salvo que se quieran sobreescribir❗
  // /**inicializa las propiedades de manera dinamica
  //  *
  //  * @param base objeto literal con valores personalizados para iniicalizar las propiedades
  //  */
  // protected override initProps(base: Partial<ReturnType<HttpRepository["getDefault"]>>): void {
  //   for (const key in this.getDefault()) {
  //     this[key] = base[key];
  //   }
  //   return;
  // }
  // /**reinicia una propiedad al valor predefinido
  //  *
  //  * @param key clave identificadora de la propiedad a reiniciar
  //  */
  // public override resetPropByKey(key: keyof ReturnType<HttpRepository["getDefault"]>): void {
  //   const df = this.getDefault();
  //   this[key] = df[key];
  //   return;
  // }
  public override mutateProps(
    base: Partial<ReturnType<HttpRepository["getDefault"]>>
  ): void {
    super.mutateProps(base);
    return;
  }
  public override getLiteral(): ReturnType<HttpRepository["getDefault"]> {
    return super.getLiteral() as any;
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
  protected override buildRepositoryResponse(
    literalCriteria: IGenericRepositoryCriteria,
    anyResponse: {
      /**data recibida */
      rxData: any;
      /**estado de la petición */
      status: any;
      /** mensaje descriptivo corto de la respuesta a la petición*/
      msn?: string;
      /** mensaje descriptivo corto*/
      detail?: any;
      /**objeto literal de posible error */
      error?: any;
    }
  ): IGenericRepositoryResponse {
    const { rxData, status, msn, detail, error } = anyResponse;
    const dfValue = this.util.dfValue;
    let repositoryRes = {} as IGenericRepositoryResponse;
    if (this.util.isUndefinedOrNull(error)) {
      repositoryRes = {
        data: rxData,
        details: {
          status,
          msn,
          detail,
        },
      };
    } else {
      repositoryRes = {
        data: dfValue,
        details: {
          status,
          msn,
          detail,
        },
        error,
      };
    }
    return repositoryRes;
  }
  protected override buildRepositoryResponseModule(
    literalCriteria:
      | TPrimitiveLiteralCriteriaUnion
      | TStructureLiteralCriteriaUnion<any>,
    anyResponse: {
      /**data recibida */
      rxData: any;
      /**estado de la petición */
      status: any;
      /** mensaje descriptivo corto de la respuesta a la petición*/
      msn?: string;
      /** mensaje descriptivo corto*/
      detail?: any;
      /**objeto literal de posible error */
      error?: any;
    },
    isVerificableData = true //normalmente se recibe JSON asi que se puede verificar
  ): IRepositoryResponse {
    const { expectedDataType } = literalCriteria;
    const { rxData, status, msn, detail, error } = anyResponse;
    const dfValue = this.util.dfValue;
    let repositoryRes = {} as IRepositoryResponse;
    //verificar si hubo error interno en el repository o en su servicio interno
    if (this.util.isUndefinedOrNull(error)) {
      if (isVerificableData) {
        //verificar integridad de datos recibidos
        const isCheckData =
          !isVerificableData || //negado, si no es verificable asuma que fue "checkeado"
          this.checkRxDataByCriteriaModule(rxData, expectedDataType);
        if (isCheckData) {
          repositoryRes = {
            data: rxData,
            status,
            msn,
            details: {
              rxData,
              detail,
            },
            error: undefined,
          };
        } else {
          repositoryRes = {
            data: dfValue,
            status: ELogicResStatusCode.BAD,
            msn: `${rxData} has not been as expected`,
            details: {
              rxData,
              detail,
            },
            error: undefined,
          };
        }
      } else {
        //acepta lso datos sin verificar expectativa❗❗
        repositoryRes = {
          data: rxData,
          status,
          msn,
          details: {
            rxData,
            detail,
          },
          error: undefined,
        };
      }
    } else {
      repositoryRes.data = dfValue;
      repositoryRes.status = ELogicResStatusCode.ERROR;
      repositoryRes.error = error;
      repositoryRes.msn = this.util.isObject(error)
        ? (error as Error).message ?? `internal error in local repository`
        : this.util.isString(error)
        ? error
        : `internal error in local repository`;
      repositoryRes = {
        data: dfValue,
        status: status ?? ELogicResStatusCode.ERROR,
        msn: this.util.isString(msn)
          ? msn
          : this.util.isObject(error)
          ? (error as Error).message ?? `internal error in local repository`
          : this.util.isString(error)
          ? error
          : `internal error in local repository`,
        details: {
          rxData: dfValue,
          detail,
        },
        error,
      };
    }
    return repositoryRes;
  }
  /**
   * obtiene un string con la acción CRUD genérica que se añadirá a la url
   * @param literalCriteria el objeto literal con los criterios de la solicutud
   * @returns string de la accion
   */
  private getUrlActionFromLiteralCriteriaModule(
    literalCriteria:
      | TPrimitiveLiteralCriteriaUnion
      | TStructureLiteralCriteriaUnion<any>
  ): string {
    const { type, keyActionRequest } = literalCriteria;
    let urlAction: string = undefined;
    if (this.urlActionType === "basic") {
      if (type === "read") {
        urlAction = type;
      } else if (type === "modify") {
        const { modifyType } =
          literalCriteria as TStructureModifyLiteralCriteria<any>;
        if (!this.util.isString(modifyType)) {
          throw new LogicError({
            code: ELogicCodeError.MODULE_ERROR,
            msn: `${modifyType} is not modify type request valid`,
          });
        }
        urlAction = modifyType;
      } else {
        throw new LogicError({
          code: ELogicCodeError.MODULE_ERROR,
          msn: `${type} is not type request valid`,
        });
      }
    } else if (this.urlActionType === "custom") {
      urlAction = keyActionRequest;
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${this.urlActionType} is not url action type valid`,
      });
    }
    return urlAction;
  }
  /**... */
  private getUrlSrcFromLiteralCriteriaModule(
    criteria:
      | TPrimitiveLiteralCriteriaUnion
      | TStructureLiteralCriteriaUnion<any>
  ): string {
    const { p_Key, s_Key } = criteria;
    let urlSrc = "";
    if (this.srcSelector === "singular") urlSrc = s_Key;
    else if (this.srcSelector === "plural") urlSrc = p_Key;
    else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${this.srcSelector} is not url resource type valid`,
      });
    }
    return urlSrc;
  }
  /**... */
  private getUrlCriteriaFromLiteralCriteriaModule(
    literalCriteria:
      | TPrimitiveLiteralCriteriaUnion
      | TStructureLiteralCriteriaUnion<any>
  ): string {
    const eH = EncryptAndCompressDataHandler.getInstance();
    let slimLC = CriteriaHandler.toSlimLiteralCriteriaForSend(
      literalCriteria as any
    );
    let urlCriteria = eH.encryptAndCompressObjectToUrlBase64(slimLC); //comprimir y encriptar
    return urlCriteria;
  }
  /**... */
  protected getUrlBodyPartsFromLiteralCriteriaModule(
    literalCriteria:
      | TPrimitiveLiteralCriteriaUnion
      | TStructureLiteralCriteriaUnion<any>
  ): string[] {
    const urlSrc = this.getUrlSrcFromLiteralCriteriaModule(literalCriteria);
    const urlAction =
      this.getUrlActionFromLiteralCriteriaModule(literalCriteria);
    const urlCriteria =
      this.getUrlCriteriaFromLiteralCriteriaModule(literalCriteria);
    let urlBodyParts: string[] = [urlSrc, urlAction, urlCriteria];
    return urlBodyParts;
  }
  /**
   * @param urlBodyParts  el array con todas las partes del body
   */
  protected buildUrl(urlBodyParts: string[] = []): string {
    /**
     * - `urlParts[0]`: la url raíz
     * - `urlParts[1]`: el prefijo inmediatamente después de la url raiz
     * - `urlParts[2]`: el array con todas las partes del body
     * - `urlParts[3]`: el sufijo final de la url
     */
    const urlParts = [
      this.urlRoot,
      this.urlPrefix,
      ...urlBodyParts,
      this.urlPostfix,
    ];
    let urlBase = this.util.buildPath(urlParts, {
      charSeparator: this.util.charSeparatorUrlPath,
    });
    const urlLen = urlBase.length;
    const URL_LIMIT = this.getCONST().URL_LIMIT;
    if (urlLen > URL_LIMIT)
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${urlLen} is is greater than ${URL_LIMIT} url limit`,
      });
    return urlBase;
  }
  /**convierte los datos a transferir en string para body
   *
   * @param txData
   */
  protected dataToBody(txData: any): string {
    let body: string = undefined; //❗❗debe ser undefined si no existe datos para el body❗❗
    if (
      !this.util.isFunction(txData) &&
      !this.util.isUndefined(txData) &&
      typeof txData !== "symbol"
    ) {
      body = JSON.stringify(txData);
    }
    return body;
  }
  /**... */
  protected abstract adaptHttpResponseToIDriveResponseByCriteria(
    literalCriteria: IGenericRepositoryCriteria,
    responseToAdapt: unknown,
    error?: any
  ): Promise<IGenericRepositoryResponse>;
  /**... */
  protected abstract adaptHttpResponseToIDriveResponseByCriteriaModule(
    literalCriteria:
      | TPrimitiveLiteralCriteriaUnion
      | TStructureLiteralCriteriaUnion<any>,
    responseToAdapt: unknown,
    error?: any
  ): Promise<IRepositoryResponse>;
  /**convierte código de estado http a código de esta api
   * @param httpStatusCode el código http a convertir
   * @returns el código ya convertido
   */
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
  /**obtiene el método http correspondiente a la solicitud
   * @param literalCriteria el objeto literal con los criterios de la solicitud
   * @returns el método http correspondiente a la solicitud
   */
  protected getHttpMethodFromLiteralCriteria(
    literalCriteria: IGenericRepositoryCriteria
  ): TKeyHttpMethod {
    let httpMethod: TKeyHttpMethod;
    const { type } = literalCriteria;
    if (type === "read") {
      httpMethod = "GET";
    } else if (type === "modify") {
      const { modifyType } = literalCriteria;
      if (modifyType === "create") httpMethod = "POST";
      else if (modifyType === "update") httpMethod = "PUT";
      else if (modifyType === "delete") httpMethod = "DELETE";
      else {
        throw new LogicError({
          code: ELogicCodeError.MODULE_ERROR,
          msn: `${modifyType} is not modify type request valid`,
        });
      }
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${type} is not type request valid`,
      });
    }
    return httpMethod;
  }
  /**obtiene el método http correspondiente a la solicitud
   * @param literalCriteria el objeto literal con los criterios de la solicitud
   * @returns el método http correspondiente a la solicitud
   */
  protected getHttpMethodFromLiteralCriteriaModule(
    literalCriteria:
      | TPrimitiveLiteralCriteriaUnion
      | TStructureLiteralCriteriaUnion<any>
  ): TKeyHttpMethod {
    let httpMethod: TKeyHttpMethod;
    const { type } = literalCriteria;
    if (type === "read") {
      httpMethod = "GET";
    } else if (type === "modify") {
      const { modifyType } =
        literalCriteria as TStructureModifyLiteralCriteria<any>;
      if (modifyType === "create") httpMethod = "POST";
      else if (modifyType === "update") httpMethod = "PUT";
      else if (modifyType === "delete") httpMethod = "DELETE";
      else {
        throw new LogicError({
          code: ELogicCodeError.MODULE_ERROR,
          msn: `${modifyType} is not modify type request valid`,
        });
      }
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${type} is not type request valid`,
      });
    }
    return httpMethod;
  }
}
