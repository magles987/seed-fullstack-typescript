import { FetchDriver } from "./fetch-driver";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
export interface IFetchOption extends RequestInit {
  /**opciones de cabecera personalizada */
  headers?: {
    /**Tipo de contenido */
    "Content-Type"?:
      | "text/html"
      | "application/json"
      | "application/xml"
      | "text/plain"
      | "multipart/form-data"
      | "application/x-www-form-urlencoded"
      | "image/png"
      | "image/jpeg";
    /**Tipo de respuesta (creo???) */
    Accept?:
      | "text/html"
      | "application/json"
      | "application/xml"
      | "text/plain"
      | "multipart/form-data"
      | "application/x-www-form-urlencoded"
      | "image/png"
      | "image/jpeg"
      | "*/*";
    /**Typically a token or credentials */
    Authorization?: string;
    "Cache-Control"?: "no-cache" | "no-store" | "max-age=0" | "must-revalidate";
    /**Information about the client software */
    "User-Agent"?: string;
    "Accept-Encoding"?:
      | "gzip"
      | "compress"
      | "deflate"
      | "br"
      | "identity"
      | "*";
    /**lenguajes en formato: "en-US", "es-ES" */
    "Accept-Language"?: string;
    Connection?: "keep-alive" | "close";
    /**The domain name of the server */
    Host?: string;
    /**The address of the previous web page */
    Referer?: string;
    /**The origin of the request */
    Origin?: string;
    /**Commonly used for AJAX requests */
    "X-Requested-With"?: string;
    /**The length of the request body in octets (8-bit bytes) */
    "Content-Length"?: string;
    /**Cookies sent by the client to the server */
    Cookie?: string;
  };
}
/**el tipo de retorno que debe tener la función
 * personalizada de este Driver (este tipo será inyectado a)*/
export type TFetchCustomQueryFnReturn = {
  /**url personalizada por la función */
  url?: string;
  /**opciones para el fetch */
  option: IFetchOption;
};
/** */
export type TTFetchDriverBaseConfig = [
  string,
  Partial<ReturnType<FetchDriver["getDefault"]>>? //debe ser opcional
];
