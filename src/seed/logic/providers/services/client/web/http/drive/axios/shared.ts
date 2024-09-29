import { TKeyHttpMethod } from "../../../../../../../util/http-utilities";
/**... */
export interface IAxiosConfig {
  //method: TKeyHttpMethod;
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
