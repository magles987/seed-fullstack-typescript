import pako from "pako";
import { Util_Logic } from "./util-logic";
import { LogicError, ELogicCodeError } from "../errors/logic-error";
import { getSeedEnvironment } from "../config/seed-environment";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *Singleton*
 * manejador de encriptacion y compresion de data
 */
export class EncryptAndCompressDataHandler {
  /**... */
  protected util = Util_Logic.getInstance();
  /**  Almacena la instancia única de esta clase */
  private static encriptAndCompressDataHandler_instance: EncryptAndCompressDataHandler;
  /**... */
  constructor() {
    this.util = Util_Logic.getInstance();
  }
  /** @returns la instancia unica de la clase*/
  public static getInstance(): EncryptAndCompressDataHandler {
    EncryptAndCompressDataHandler.encriptAndCompressDataHandler_instance =
      EncryptAndCompressDataHandler.encriptAndCompressDataHandler_instance ===
        undefined ||
      EncryptAndCompressDataHandler.encriptAndCompressDataHandler_instance ===
        null
        ? new EncryptAndCompressDataHandler()
        : EncryptAndCompressDataHandler.encriptAndCompressDataHandler_instance;
    return EncryptAndCompressDataHandler.encriptAndCompressDataHandler_instance;
  }
  /**convierte buffer de tipo `Uint8Array` a `string` en base 64 */
  private uint8ArrayToBase64(uint8Array: Uint8Array): string {
    const { envStandard, envGlobalLayout, envTest } = getSeedEnvironment();
    let base64: string;
    if (envGlobalLayout === "client") {
      if (envStandard === "dev") {
        if (envTest === "test-node") {
          base64 = Buffer.from(uint8Array).toString("base64");
        } else if (envTest === "test-browser") {
          let binary = "";
          const len = uint8Array.byteLength;
          for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(uint8Array[i]);
          }
          base64 = window.btoa(binary);
        } else {
          throw new LogicError({
            code: ELogicCodeError.MODULE_ERROR,
            msn: `${envTest} is not test environment valid`,
          });
        }
      } else if (envStandard === "prod") {
        let binary = "";
        const len = uint8Array.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(uint8Array[i]);
        }
        base64 = window.btoa(binary);
      } else {
        throw new LogicError({
          code: ELogicCodeError.MODULE_ERROR,
          msn: `${envStandard} is not standard environment valid`,
        });
      }
    } else if (envGlobalLayout === "server") {
      base64 = Buffer.from(uint8Array).toString("base64");
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${envGlobalLayout} is not layout environment  valid`,
      });
    }
    return base64;
  }
  /**convierte `string` en base 64 a buffer de tipo `Uint8Array` */
  private base64ToUint8Array(base64: string): Uint8Array {
    const { envStandard, envGlobalLayout, envTest } = getSeedEnvironment();
    let binaryString: string;

    if (envGlobalLayout === "client") {
      if (envStandard === "dev") {
        if (envTest === "test-node") {
          binaryString = Buffer.from(base64, "base64").toString("binary");
        } else if (envTest === "test-browser") {
          binaryString = window.atob(base64);
        } else {
          throw new LogicError({
            code: ELogicCodeError.MODULE_ERROR,
            msn: `${envTest} is not test environment valid`,
          });
        }
      } else if (envStandard === "prod") {
        binaryString = window.atob(base64);
      } else {
        throw new LogicError({
          code: ELogicCodeError.MODULE_ERROR,
          msn: `${envTest} is not test environment valid`,
        });
      }
    } else if (envGlobalLayout === "server") {
      binaryString = Buffer.from(base64, "base64").toString("binary");
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${envGlobalLayout} is not layout environment  valid`,
      });
    }
    const len = binaryString.length;
    let bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }
  /**... */
  private compressForUrl(strObject: string): Uint8Array {
    const objectCompressU8A = pako.deflate(strObject) as Uint8Array;
    return objectCompressU8A;
  }
  /**... */
  private uncompressForUrl(objectCompressU8A: Uint8Array) {
    const decompressed = pako.inflate(objectCompressU8A, { to: "string" });
    return decompressed;
  }
  /**encripta y comprime un objeto convirtiéndolo en un
   * string para un fragmento de url limpio
   *
   */
  public encryptAndCompressObjectToUrlBase64(
    object: object | Array<any>
  ): string {
    let strObject: string;
    const STR_DEFAULT = "";
    if (this.util.isObject(object, true) || this.util.isArray(object, true)) {
      strObject = JSON.stringify(object);
    } else {
      strObject = STR_DEFAULT;
    }
    const compressObject = this.compressForUrl(strObject);
    //convierte a url y la limpia
    const urlBase64EncodedCompress = this.uint8ArrayToBase64(compressObject)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    return urlBase64EncodedCompress;
  }
  /**a partir de un fragmento de url limpio
   * desencripta y descomprime para convertirlo
   * en un objeto
   */
  public unencryptAndUncompressUrlBase64ToObject(
    urlBase64EncodedCompress: string
  ): object | Array<any> {
    //rearma la url para el formato comprimido
    const urlBase64DecodedCompress = urlBase64EncodedCompress
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    //desencripta
    const objectCompressU8A = this.base64ToUint8Array(urlBase64DecodedCompress);
    //descomprime
    const strObject = this.uncompressForUrl(objectCompressU8A);
    //parsea a objeto
    const object = JSON.parse(strObject);
    return object;
  }
}
