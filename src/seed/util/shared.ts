/**tipos de conversiones de estandares de nomenclatura en codigo*/
export type TStrCase = "Snake" | "Kebab" | "Camel" | "Pascal";
/**tipado extendido para los tipos primitivos, function, objeto o array*/
export type TExtPrimitiveTypes =
  | "string"
  | "number"
  | "bigint"
  | "boolean"
  | "symbol"
  | "undefined"
  | "null"
  | "object"
  | "array"
  | "function";
/**estructura de configuracion para metodos
 * `isEquevalentTo()`,
 * `isGreaterTo()`,
 * `isLesserTo()`
 * y sub metodos que dependan de estos
 * */
export interface IConfigEqGtLt {
  /**determina si la comparacion permite
   * incluir equivalencia*/
  isAllowEquivalent: boolean;
  /**
   * Array opcional con las rutas identificadoras de las propiedades a usar como criterio de comparación. Ejemplo (se asume que el caracter separador de ruta es "."):
   *   - `["p1", "p2",..., "pn"]` - Claves identificadoras para el primer nivel de profundidad.
   *   - `["p1", "p2.21"]` - "p1" de primer nivel, "p2.p21" de segundo nivel de profundidad.
   *   - `["p1.p11.p111"]` - Claves identificadoras para el tercer nivel de profundidad.
   *
   * ⚠ Solo para objetos
   */
  keyOrKeysPath?: string | string[];
  /**
   * Predefinido en `false`
   *
   * para arrays, determina si
   * comparan entre si la cantidad de
   * elementos del array
   *
   */
  isCompareLength?: boolean;
  /**
   * Predefinido en `false`
   *
   * para objetos, determina si
   * comparan entre si la cantidad
   * de propiedades del objeto
   */
  isCompareSize?: boolean;
  /**
   * Predefinido en `false`
   *
   * permite comparacion de valores entre un numero y un string
   * siempre y cuando el string pueda transformarse en numero
   *
   * */
  isCompareStringToNumber?: boolean;
  /**
   * Predefinido en `true`
   *
   * Determina si es case sensitive (solo para
   * elementos string), si lo es la comparacion
   * es estricta
   * ````
   */
  isCaseSensitiveForString?: boolean;
}
/**Utilidad exclusiva de Typescript para capitzalizar la primera letra
 *
 * ejemplo:
 * ````
 *  // Utilidad para capitalizar la primera letra
 *  type CapitalizeFirstLetter<S extends string> = S extends `${infer First}${infer Rest}`
 *    ? `${Uppercase<First>}${Rest}`
 *    : S;
 *
 * //claves de los campos
 * type TKeyFields = "campo1" | "campo2";
 * //esquema a partir de los campos:
 * type TSchema = Record<`prefix${CapitalizeFirstLetter<TKeyFields>}`, string>;
 *
 * const s:TSchema = {prefixCampo1: string, prefixCampo2:string}
 * ````
 */
export type TCapitalizeFirstLetter<S extends string> =
  S extends `${infer First}${infer Rest}` ? `${Uppercase<First>}${Rest}` : S;
