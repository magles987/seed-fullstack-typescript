import {
  IPrimitiveResponse,
  IResponse,
  IStructureResponse,
} from "../../src/logic/reports/shared-types";
import { Util_Module } from "../../src/logic/util/util-module";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *Singleton*
 *
 * ...
 */
export class ScreenBrowserResponseUtil {
  protected util = Util_Module.getInstance();
  /**  Almacena la instancia única de esta clase */
  private static ScreenBrowserResponseUtil_instance: ScreenBrowserResponseUtil;
  /**... */
  protected constructor() {
    this.util = Util_Module.getInstance();
  }
  /** @returns la instancia única de la clase*/
  public static getInstance(): ScreenBrowserResponseUtil {
    ScreenBrowserResponseUtil.ScreenBrowserResponseUtil_instance =
      typeof ScreenBrowserResponseUtil.ScreenBrowserResponseUtil_instance ===
        "object" &&
      ScreenBrowserResponseUtil.ScreenBrowserResponseUtil_instance !== null
        ? ScreenBrowserResponseUtil.ScreenBrowserResponseUtil_instance
        : new ScreenBrowserResponseUtil();
    return ScreenBrowserResponseUtil.ScreenBrowserResponseUtil_instance;
  }
  /**... */
  private selectShowResByTypeData(response: Partial<IResponse>): void {
    if (this.util.isObject(response, true)) {
      console.dir(response);
    } else if (this.util.isObject(response, true)) {
      console.table(response);
    } else {
      console.log(response);
    }
    return;
  }
  /**... */
  public showStructureResponseTest(
    receivedRes: Partial<IStructureResponse>,
    expectedRes: Partial<IStructureResponse>,
    textFormat: {
      keyAction: string;
      detail: string;
    }
  ): void {
    const { keyAction, detail } = textFormat;
    //armado de mensaje para consola:
    console.log(
      `%c████ Action: ${keyAction} ████████████████████████████`,
      "color: rgb(12,12,240); background-color: rgb(200,200,200)"
    );
    console.log(
      `%c${detail}`,
      "color: rgb(12,12,200); background-color: rgb(200,200,200)"
    );
    console.log(`%cexpectedRes:`, "color: rgb(32,240,32)");
    //selecciona el tipo de consola
    this.selectShowResByTypeData(expectedRes);
    console.log(`%creceivedRes:`, "color: rgb(240,240,32)");
    this.selectShowResByTypeData(receivedRes);
    return;
  }
  /**... */
  public showPrimitiveResponseTest(
    receivedRes: Partial<IPrimitiveResponse>,
    expectedRes: Partial<IPrimitiveResponse>,
    textFormat: {
      keyAction: string;
      detail: string;
    }
  ): void {
    const { keyAction, detail } = textFormat;
    //armado de mensaje para consola:
    console.log(
      `%c████ Action: ${keyAction} ████████████████████████████`,
      "color: rgb(12,12,240)"
    );
    console.log(`%c${detail}`, "color: rgb(6,6,200)");
    console.log(`expectedRes:`);
    //selecciona el tipo de consola
    this.selectShowResByTypeData(expectedRes);
    console.log(`receivedRes:`);
    this.selectShowResByTypeData(receivedRes);
    return;
  }
}
