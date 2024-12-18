import { IUrlConfig } from "../shared";

/**... */
export interface IAxiosConfig extends IUrlConfig {
  /** */
  option?: {
    headers: {
      "Content-Type"?: "application/json";
    };
    data?: any;
    timeout?: number;
    responseType?:
    | "arraybuffer"
    | "blob"
    | "document"
    | "json"
    | "text"
    | "stream";
    auth?: {
      username: string;
      password: string;
    };
    proxy?: {
      host: string;
      port: number;
      auth?: {
        username: string;
        password: string;
      };
    };
    onUploadProgress?: (progressEvent: ProgressEvent) => void;
    onDownloadProgress?: (progressEvent: ProgressEvent) => void;
    validateStatus?: (status: number) => boolean;
    maxRedirects?: number;
    socketPath?: string | null;
    httpAgent?: any;
    httpsAgent?: any;
    cancelToken?: any;
    decompress?: boolean;
  }
  //method: TKeyHttpMethod;
  /**url raiz del recurso */
  urlRoot: string
  /**prefijo de la url (despues del root)
   *
   * Ejemplo:
   * ````
   * `${urlRoot}/${urlPrefix}....`
   * ````
   *
   */
  urlPrefix?: string;
  /**prefijo de la url (despues del root)
   *
   * Ejemplo:
   * ````
   * `${urlRoot}/${urlPrefix}..../${urlPostfix}`
   * ````
   *
   */
  urlPostfix?: string;
}
