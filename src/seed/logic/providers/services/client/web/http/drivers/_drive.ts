import { IBagForService, IGenericDriver } from "../../../../shared";
import {
  IModifyCriteria,
  IReadCriteria,
} from "../../../../../../criterias/shared";
import { IUrlConfig, TKeyDiccHttpDrive } from "./shared";
import { Util_HttpDriver } from "./_util-http-driver";
import { TKeyHttpMethod } from "../../../../../../util/http-utilities";
import {
  LogicError,
  ELogicCodeError,
} from "../../../../../../errors/logic-error";
import { EncryptAndCompressDataHandler } from "../../../../../../util/encripter-handler";
import { getGlobalConfig } from "../../../../../../config/global-config";
import { IExtResponse } from "../../../../../../reports/shared";
import { CriteriaHandler } from "../../../../../../criterias/_criteria-handler";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**
 *
 */
export abstract class HttpDrive implements IGenericDriver {
  /**configuración global */
  protected readonly _globalConfig_ = getGlobalConfig();
  /**@returns todos los campos con sus valores predefinidos para instancias de esta clase*/
  public static readonly getDefault = () => {
    return {
      urlRoot: "",
      urlPostfix: "",
      urlPrefix: "",
      urlActionType: "basic",
      urlSrcType: "plural",
      urlSecretKeyJWT: "#d3f4ult*",
    } as IUrlConfig;
  };
  /**limite de caracteres para la url */
  protected readonly URL_LIMIT = 2000; //máximo 2000 caracteres
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
  private _urlActionType: IUrlConfig["urlActionType"];
  public get urlActionType(): IUrlConfig["urlActionType"] {
    return this._urlActionType;
  }
  protected set urlActionType(v: IUrlConfig["urlActionType"]) {
    this._urlActionType =
      v === "basic" || v === "custom"
        ? v
        : this.urlActionType !== undefined
        ? this._urlActionType
        : this.getDefault().urlActionType;
  }
  private _urlSrcType: IUrlConfig["urlSrcType"];
  public get urlSrcType(): IUrlConfig["urlSrcType"] {
    return this._urlSrcType;
  }
  protected set urlSrcType(v: IUrlConfig["urlSrcType"]) {
    this._urlSrcType =
      v === "singular" || v === "plural"
        ? v
        : this._urlSrcType !== undefined
        ? this._urlSrcType
        : this.getDefault().urlSrcType;
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
  /**... */
  protected get keyDriver(): TKeyDiccHttpDrive {
    return this._keyDriver;
  }
  /** utilidades */
  protected util: Util_HttpDriver = Util_HttpDriver.getInstance();
  /** */
  constructor(private _keyDriver: TKeyDiccHttpDrive) {
    this.util = Util_HttpDriver.getInstance();
  }
  /**@returns todos los campos con sus valores predefinidos*/
  protected getDefault() {
    return HttpDrive.getDefault();
  }
  /**
   *
   *
   */
  public abstract sendRequestFromService(
    bagService: IBagForService
  ): Promise<IExtResponse>;
  /** envío genérico de petición a traves de del driver seleccionado
   *
   * @param url  url completa a cual enviar la petición.
   * @param httpMethod  método http a usar.
   * @param txData datos a enviar.
   * @returns los datos obtenidos.
   *
   * ⚠ Las excepciones **no** son manejadas internamente ⚠
   */
  public abstract sendRequest(
    url: string,
    httpMethod: TKeyHttpMethod,
    txData?: any
  ): Promise<unknown>;
  /**obtiene un string con la accion CRUD generica que se añadirá a la url
   * @param criteria el objeto literal con los criterios de la solicutud
   * @returns string de la accion
   */
  private getUrlActionFromBag(
    criteria: IBagForService["literalCriteria"]
  ): string {
    const { type, modifyType, keyActionRequest } = criteria as IReadCriteria &
      IModifyCriteria;
    let urlAction: string = undefined;
    if (this.urlActionType === "basic") {
      if (type === "read") {
        urlAction = type;
      } else if (type === "modify") {
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
  private getUrlSrcFromBag(
    criteria: IBagForService["literalCriteria"]
  ): string {
    const { p_Key, s_Key } = criteria;
    let urlSrc = "";
    if (this.urlSrcType === "singular") urlSrc = s_Key;
    else if (this.urlSrcType === "plural") urlSrc = p_Key;
    else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${this.urlSrcType} is not url resource type valid`,
      });
    }
    return urlSrc;
  }
  /**... */
  private getUrlCriteriaFromBag(
    literalCriteria: IBagForService["literalCriteria"]
  ): string {
    const eH = EncryptAndCompressDataHandler.getInstance();
    let slimLC = CriteriaHandler.toSlimLiteralCriteriaForSend(
      literalCriteria as any
    );
    let urlCriteria = eH.encryptAndCompressObjectToUrlBase64(slimLC); //comprimir y encriptar
    return urlCriteria;
  }
  /**... */
  protected getUrlBodyPartsFromBag(
    criteria: IBagForService["literalCriteria"]
  ): string[] {
    const urlSrc = this.getUrlSrcFromBag(criteria);
    const urlAction = this.getUrlActionFromBag(criteria);
    const urlCriteria = this.getUrlCriteriaFromBag(criteria);
    let urlBodyParts: string[] = [urlSrc, urlAction, urlCriteria];
    return urlBodyParts;
  }
  /**
   * @param urlBodyParts  el array con todas las partes del body
   */
  protected buildUrl(urlBodyParts: string[]): string {
    const sp = this.util.charSeparatorUrlPath;
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
    let urlBase = this.util.buildPath(urlParts, { charSeparator: sp });
    const urlLen = urlBase.length;
    if (urlLen > this.URL_LIMIT)
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${urlLen} is is greater than ${this.URL_LIMIT} url limit`,
      });
    return urlBase;
  }
  /**... */
  protected abstract adaptHttpResponseToIDriveResponse(
    responseToAdapt: unknown
  ): Promise<IExtResponse>;
}
