import {
  IPrimitiveResponse,
  IResponse,
  IStructureResponse,
} from "../src/seed/logic/reports/shared-types";
import { Util_Module } from "../src/seed/logic/util/util-module";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**
 * *Singleton*
 *
 * Utilidades para los test
 *
 */
export class Util_Test extends Util_Module {
  /**  Almacena la instancia única de esta clase */
  private static Util_Test_instance: Util_Test;
  /** */
  constructor() {
    super();
  }
  /** devuelve la instancia única de esta clase
   * ya sea que la crea o la que ya a sido creada
   *
   */
  public static getInstance(): Util_Test {
    Util_Test.Util_Test_instance =
      Util_Test.Util_Test_instance === undefined ||
      Util_Test.Util_Test_instance === null
        ? new Util_Test()
        : Util_Test.Util_Test_instance;
    return Util_Test.Util_Test_instance;
  }
  /**... */
  private selectShowResByTypeData(response: Partial<IResponse>): void {
    if (this.isObject(response, true)) {
      console.dir(response);
    } else if (this.isObject(response, true)) {
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
