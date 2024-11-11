import { v4 as uuidv4 } from "uuid";
import { Util_Logic } from "./util-logic";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**tipado para función básica de generador de ids
 *
 * @param current_id: si ya existe un id previo, puede recibirse `undefined` o `null`
 * @param option: las opciones para construirlo
 */
export type TStrategyGeneratorsIdFn = (current_id: any, option?: object) => any;
/**diccionario de funciones de generación de id con diferentes estrategias */
export interface IDiccStrategyGeneratorsIdFn {
  /**id completo con la libreria uuid v4 */
  df_uuid: TStrategyGeneratorsIdFn;
  /**id pequeño, solo la ultima sección de un uuid completo */
  df_micro_uuid: TStrategyGeneratorsIdFn;
  /**id numerico basado en ele tamaño de la colección */
  df_autoincrement: TStrategyGeneratorsIdFn;
  /**genera una cadena de caracteres aleatorios */
  df_strRandom: TStrategyGeneratorsIdFn;
  /**id basado en tiempo (es un timestamp pero en string) */
  df_strTimestamp: TStrategyGeneratorsIdFn;
}
/**... */
function isCurrentIdValid(current_id: any): boolean {
  const util = Util_Logic.getInstance();
  return (
    util.isNotUndefinedAndNotNull(current_id) && !util.isBoolean(current_id)
  );
}
/**... */
export type TKeyDiccStrategyGeneratorsIdFn = keyof IDiccStrategyGeneratorsIdFn;
const DICC_GENERATORS_ID: IDiccStrategyGeneratorsIdFn = {
  df_uuid: (current_id: any, op?: object) => {
    const util = Util_Logic.getInstance();
    if (isCurrentIdValid) return current_id; //es un id bueno
    let id = uuidv4();
    return id;
  },
  df_micro_uuid: (current_id: any, op?: object) => {
    const util = Util_Logic.getInstance();
    if (isCurrentIdValid) return current_id; //es un id bueno
    let id = uuidv4() as string;
    id = id.split("-").pop(); //del formato completo de uuid ( xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx ) solo selecciono la ultima sección
    return id;
  },
  df_autoincrement: (current_id: any, option?: { size: number }) => {
    const util = Util_Logic.getInstance();
    if (isCurrentIdValid && util.isNumber(current_id, true)) return current_id; //es un id bueno
    option = util.isObject(option) ? option : ({} as typeof option);
    let { size } = option;
    size = util.isNumber(size) ? size : 0;
    let id = size;
    id++; //incrementa en uno
    return id;
  },
  df_strRandom: (current_id: any, option?: { len: number }) => {
    const util = Util_Logic.getInstance();
    if (isCurrentIdValid && util.isString(current_id)) return current_id; //es un id bueno
    option = util.isObject(option) ? option : ({} as typeof option);
    let { len } = option;
    len = util.isNumber(len) ? len : 16; //16 es tamaño predefinido del id
    let id = "";
    const charts =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < len; i++) {
      id += charts.charAt(Math.floor(Math.random() * charts.length));
    }
    return id;
  },
  df_strTimestamp: (current_id: any, option?: object) => {
    const util = Util_Logic.getInstance();
    if (isCurrentIdValid && util.isString(current_id)) return current_id; //es un id bueno
    const timestamp = Date.now().toString(36); // Convierte el timestamp a base 36 para comprimir
    const random = Math.random().toString(36).substring(2, 8); // Genera una parte aleatoria
    let id = `${timestamp}${random}`;
    return id;
  },
};
/**obtiene una función de generación de id,
 * de acuerdo a la clave identificadora de la
 * estrategia, si se recibe una función personalizada
 * se le da prioridad a esta
 *
 * @param keyStrategyOrFn clave identificadora de la estrategia o una función personalizada
 * @returns la función generadora de ids
 */
export function getStrategyGeneratorIdFnByKey(
  keyStrategyOrFn: TKeyDiccStrategyGeneratorsIdFn | TStrategyGeneratorsIdFn
): TStrategyGeneratorsIdFn {
  let generatorFn: TStrategyGeneratorsIdFn;
  if (typeof keyStrategyOrFn === "function") {
    generatorFn = keyStrategyOrFn; //función personalizada
  } else if (typeof keyStrategyOrFn === "string") {
    generatorFn = DICC_GENERATORS_ID[keyStrategyOrFn];
    if (typeof generatorFn !== "function")
      throw new Error(`${keyStrategyOrFn} is not strategy key valid`);
  } else {
    throw new Error(
      `${keyStrategyOrFn}is not strategy key or not function generator valid`
    );
  }
  return generatorFn;
}
