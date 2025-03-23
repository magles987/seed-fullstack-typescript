import { TKeySrcSelector } from "../src/seed/logic/config/shared-modules";
import {
  ELogicCodeError,
  LogicError,
} from "../src/seed/logic/errors/logic-error";
import { IBagForDriver } from "../src/seed/logic/providers/_drivers/shared";
import {
  IPrimitiveResponse,
  IResponse,
  IStructureResponse,
} from "../src/seed/logic/reports/shared";
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

  /**verifica y obtiene al función de acción de petición a ejecutar en le repositorio
   * @param repoInstance instancia del repositorio que permite la verificación
   * @param bagService el bag del servicio a verificar
   * @returns la función de acción de petición siempre y cuando la verificación
   * pase, de lo contrario lanza excepciones
   */
  public getActionRequestFn(
    repoInstance: object,
    literalCriteria: IBagForDriver["literalCriteria"]
  ): (
    literalCriteria: IBagForDriver["literalCriteria"],
    data: any
  ) => Promise<any> {
    if (!this.isObject(literalCriteria)) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${literalCriteria} is not criteria valid`,
      });
    }
    if (!this.isString(literalCriteria.keyActionRequest)) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${literalCriteria.keyActionRequest} is not key request action valid`,
      });
    }
    const keyActionFn = literalCriteria.keyActionRequest;
    let actionFn = repoInstance[keyActionFn] as Function;
    if (typeof actionFn !== "function") {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: ` ${keyActionFn} is not request action key function valid`,
      });
    }
    actionFn = actionFn.bind(repoInstance);
    return actionFn as any;
  }
  /**verifica si la data recibida corresponde la expectativa esperada*/
  public checkRxData(
    rxData: any,
    expectDataType: IBagForDriver["literalCriteria"]["expectedDataType"]
  ): boolean {
    if (expectDataType === "boolean" && !this.isNumber(rxData)) return false;
    else if (expectDataType === "number" && !this.isNumber(rxData))
      return false;
    else if (expectDataType === "string" && !this.isString(rxData, true))
      return false;
    else if (expectDataType === "object" && !this.isObject(rxData, true))
      return false;
    else if (expectDataType === "array" && !this.isArray(rxData, true))
      return false;
    else return true;
  }
  /*obtiene la clave identificadora del recurso según el requerimiento (plural o singular)*/
  public getKeySrcContext(
    srcSelector: TKeySrcSelector,
    literalCriteria: IBagForDriver["literalCriteria"]
  ): string {
    const { p_Key, s_Key, keySrc } = literalCriteria;
    let keySrcContext: string;
    if (srcSelector === "singular") keySrcContext = s_Key as string;
    else if (srcSelector === "plural") keySrcContext = p_Key as string;
    else keySrcContext = keySrc;
    return keySrcContext;
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
