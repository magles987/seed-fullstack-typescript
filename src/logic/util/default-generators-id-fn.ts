import { v4 as uuidv4 } from "uuid";
import { Util_Module } from "./util-module";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**tipo de función para personalizar la generación de ids */
export type TCustomGenerateIdFn = (option?: object) => any;
/**claves identificadoras del diccionario de generadores de ids predefinidos */
export type TKeyDiccStrategyGeneratorsIdFn = keyof typeof DICC_GENERATORS_ID;
/**opciones para el constructor de ids por medio de la librería uuid */
export type TOptionForUuidv4 = object;
/**opciones para el constructor de ids por medio autoincrementar básico */
export type TOptionForAutoincrement = {
  /**el ultimo indice conocido para tomarlo como referencia */
  lastId: number;
};
/**opciones para el constructor de ids por medio texto aleatorio */
export type TOptionForStrRandom = {
  /**tamaño del texto aleatorio (en número de caracteres)*/
  len: number;
};
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**... */
const DICC_GENERATORS_ID = {
  /**id completo con la libreria uuid v4 */
  df_uuid: ((option?: TOptionForUuidv4) => {
    const util = Util_Module.getInstance();
    option = util.isObject(option) ? option : {};
    let id = uuidv4();
    return id;
  }) as TCustomGenerateIdFn,
  /**id pequeño, solo la ultima sección de un uuid completo */
  df_micro_uuid: ((option?: object) => {
    const util = Util_Module.getInstance();
    option = util.isObject(option) ? option : {};
    let id = uuidv4() as string;
    id = id.split("-").pop(); //del formato completo de uuid ( xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx ) solo selecciono la ultima sección
    return id;
  }) as TCustomGenerateIdFn,
  /**id numerico basado en ele tamaño de la colección */
  df_autoincrement: ((option?: TOptionForAutoincrement) => {
    const util = Util_Module.getInstance();
    option = util.isObject(option) ? option : ({} as any);
    let { lastId } = option;
    lastId = util.isNumber(lastId) ? lastId : 0;
    let id = lastId + 1;
    return id;
  }) as TCustomGenerateIdFn,
  /**genera una cadena de caracteres aleatorios */
  df_strRandom: ((option?: TOptionForStrRandom) => {
    const util = Util_Module.getInstance();
    option = util.isObject(option) ? option : ({} as any);
    let { len } = option;
    len = util.isNumber(len) ? len : 16; //16 es tamaño predefinido del id
    let id = "";
    const charts =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < len; i++) {
      id += charts.charAt(Math.floor(Math.random() * charts.length));
    }
    return id;
  }) as TCustomGenerateIdFn,
  /**id basado en tiempo (es un timestamp pero en string) */
  df_strTimestamp: (() => {
    const util = Util_Module.getInstance();
    const timestamp = Date.now().toString(36); // Convierte el timestamp a base 36 para comprimir
    const random = Math.random().toString(36).substring(2, 8); // Genera una parte aleatoria
    let id = `${timestamp}${random}`;
    return id;
  }) as TCustomGenerateIdFn,
};
/**construye un id según la estrategia seleccionada (puede ser un constructor predefinido o personalizado)
 * @param keyStrategyOrFn clave identificadora de la estrategia o una función de constructor personalizada
 * @returns la función generadora de ids
 */
export function buildIdByStrategy(
  keyStrategyOrFn: TKeyDiccStrategyGeneratorsIdFn | TCustomGenerateIdFn,
  option?: object
): any {
  let id: any;
  if (typeof keyStrategyOrFn === "function") {
    id = keyStrategyOrFn(); //función personalizada
  } else if (typeof keyStrategyOrFn === "string") {
    const fn = DICC_GENERATORS_ID[keyStrategyOrFn];
    id = fn(option);
    if (typeof id !== "function")
      throw new Error(`${keyStrategyOrFn} is not strategy key valid`);
  } else {
    throw new Error(
      `${keyStrategyOrFn}is not strategy key or not function generator valid`
    );
  }
  return id;
}

/**
 * verificación básica de un posible id, determinando
 * que el valor no sea de tipos no identificables como:
 *
 *  `undefined`, `null`, `boolean`, `function`.
 *
 * Puede ser potenciada usando una función personalizada y opciones
 *
 * @param id a verificar
 * @param customValidFn función personalizada de validación (❗no omite la validación básica de tipos❗)
 * @param option opciones para la función personalizada
 * @returns `true` si el id es potencialmente correcto, de lo contrario `false`
 */
export function isIdValid(
  id: any,
  customValidFn?: (id: any, op?: object) => boolean,
  option?: object
): boolean {
  const util = Util_Module.getInstance();
  const isMinimalValid = !util.isValueType(id, [
    "undefined",
    "null",
    "boolean",
    "function",
  ]); //no puede ser ninguno de estos tipos
  if (!isMinimalValid) return false;
  const isCustomValid = util.isFunction(customValidFn)
    ? customValidFn(id, option)
    : true;
  return isCustomValid;
}
