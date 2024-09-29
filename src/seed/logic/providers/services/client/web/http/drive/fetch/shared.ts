import { TKeyHttpMethod } from "../../../../../../../util/http-utilities";
/**... */
export interface IFetchConfig {
  //method: TKeyHttpMethod, // Método HTTP: GET, POST, PUT, DELETE, etc.
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
  //body: string, // Cuerpo de la solicitud, generalmente para POST o PUT
  /**Modo de la solicitud*/
  mode?: "cors" | "no-cors" | "same-origin";
  /**Credenciales */
  credentials?: "same-origin" | "same-origin" | "include";
  /**Política de caché:*/
  cache?:
    | "default"
    | "no-store"
    | "reload"
    | "no-cache"
    | "force-cache"
    | "only-if-cached";
  /**Política de redirección */
  redirect?: "follow" | "error" | "manual";
  /**Referente:*/
  referrer?: "client" | "no-referrer";
  /**Integridad de la solicitud */
  integrity?: string;
  /**Mantener viva la conexión (normalmente `false`) */
  keepalive?: boolean;
  //signal: controller.signal // Señal para abortar la solicitud
}
