//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
export type TLogicBuildParam = {
  /**codigo generico del error */
  code: ELogicCodeError;
  /**clave identificadora de la accion */
  keyAction?: string;
  /**mensaje base */
  msn: string;
  /**error base o previo */
  preError?: Partial<LogicError>;
};
/**codigo para la construccion de mensajes de error */
export enum ELogicCodeError {
  NOT_EXIST,
  EXIST,
  NOT_CREATE,
  NOT_UPDATE,
  NOT_DELETE,
  NOT_VALID,
  OVERFLOW,
  MODULE_ERROR,
  UNKNOW,
}
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** */
export class LogicError extends Error {
  /**codigo generico del error */
  public readonly code: ELogicCodeError;
  /** descrip... */
  public readonly preError: Partial<LogicError>;
  /**clave identificadora de la accion */
  public readonly keyAction: string;
  /** */
  constructor({ keyAction, msn, code, preError }: TLogicBuildParam) {
    super();
    this.name = this.constructor.name; //se obtiene el nombre de la clase
    this.message = msn;
    this.code = code;
    this.keyAction = keyAction;
    this.preError = preError;
    Object.setPrototypeOf(this, LogicError.prototype);
  }
  /**
   * convierte el valor desencadenador del error a un string
   * ____
   * @param
   * ____
   * @returns ``
   *
   */
  public static valueToString(value: any): string {
    let strValue = "";
    if (typeof value === "object" && value !== null) {
      strValue = JSON.stringify(value);
    } else {
      strValue = `${value}`;
    }
    return strValue;
  }
}
