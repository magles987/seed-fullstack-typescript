/**tipos de conversiones de estandares de nomenclatura en codigo*/
export type TStrCase =
  | "Snake"
  | "Kebab"
  | "Camel"
  | "Pascal"
  | "Constant"
  | "Dot";
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
  | "tuple"
  | "function";
/**tipos de redondeo de número */
export type TRoundType = "round" | "floor" | "ceil";
/**tipado interno para permitir la recursividad en el método isValueType */
interface IRecursiveObjectForTypes {
  [key: string]: TAExtValueType;
}
/**tipado base para recursividad de tipos en el método isValueType */
export type TExtValueType =
  | TExtPrimitiveTypes
  | IRecursiveObjectForTypes
  | TAExtValueType;
/**tipado para agrupación de tipos  */
export type TAExtValueType = Array<TExtValueType>;
/**opciones para evaluar tipo en grupo */
export interface IValueTypeOption {
  /** `allowNumber_String = false`: Permite que un string numérico sea validado como un número (por ejemplo, `"123"` siendo string, se permite analizar y validar como número). */
  allowNumber_String?: boolean;
  /** `allowBigint_String = false`: Permite que un string numérico gigante sea validado como un bigint. */
  allowBigint_String?: boolean;
  /** `allowStringEmpty = false`: Permite que un string vacío ( `""` ) sea considerado válido. */
  allowStringEmpty?: boolean;
  /** `allowObjectEmpty = false`: Permite que un string vacío ( `{}` ) sea considerado válido. */
  allowObjectEmpty?: boolean;
  /** `allowArrayEmpty = false`: Permite que un string vacío ( `[]` ) sea considerado válido.*/
  allowArrayEmpty?: boolean;
  /**`tupleSize = undefined`: Define el tamaño esperado de una tupla. Puede ser un número (tamaño fijo)
   * o un array de dos números `[min, max]` (tamaño variable).
   *
   * ❗este argumento es indispensable en caso que en algún nivel del esquema de `types` se verifique
   * el tipo `"tuple"` (asi explicitamente en texto), por el contrario si la verificacion de la
   * tupla se hace implicitamente (con varios items array), este argumento es opcional, pero si
   * se asigna tendrá prioridad de verificación❗.
   *
   */
  tupleSize?: number | [number, number];
}
/**estructura de configuración de opciones para métodos
 * `isEquevalentTo()`,
 * `isGreaterTo()`,
 * `isLesserTo()`
 * y sub métodos que dependan de estos
 * */
export interface IOptionEqGtLt {
  /**
   * Predefinido en `false`
   *
   * determina si la comparación permite
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
  /**Predefinido en `this.charSeparatorLogicPath`
   * El carácter separador a utilizar entre los elementos del path.
   */
  charSeparator?: string;
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
   * Predefinido en `true`
   *
   * ❗Aplica solamente para equivalencia de arrays❗
   *
   * determina si entre los arrays se
   * debe comparar en orden estricto los elementos
   * o los elementos pueden estar en orden aleatorio
   * (lo importante es que sean comparables)
   */
  isStrictArrayOrder?: boolean;
  /**
   *
   * Predefinido en `false`
   *
   * ❗Aplica solamente para mayor y menor que de arrays❗
   *
   * determina que debe compararen orden matricial
   * cada uno de los elementos sin tener en cuenta
   * el orden.
   *
   * @example
   * ````
   * let a = ["a", 2, true];
   * let b = ["b", 1, false];
   * //¿cual es mayor o cual el menor?
   *
   * ````
   * Sin orden matricial se evalua elemento contra
   * elemento en el orden que se encuentren por lo tanto
   * el elemento `a[0]` que es `"a"` en comparación con
   * `b[0]` que es `"b"` entonces el array `a` es mayor
   * que el array `b` (los demás elementos se ignoran).
   *
   * Con orden matricial se evalua cada elemento del array
   * `a` contra todos los elemento del array `b`, cada
   * resultado de comparación se le asigna un valor:
   *
   * `1` si es mayor, `0` si es igual, `-1` si es menor
   *
   * luego se suman los resultados de cada comparación y
   * si el resultado es *positivo* significa que es mayor,
   * si es *negativo* significa que es menor y si es *0*
   * indica que es igual
   */
  isMatrixCompared?: boolean;
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
/**tipado especial para definir un `Partial<>` profundo
 *
 * @example
 * ````
 * interface IZ{
 *   p1: string;
 *   p2: {p21: number; p22: string}
 * }
 * const n:TDeepPartial<IZ> = {};
 * //todas las propiedades de todos
 * // los niveles de `IZ` son opcionales
 * ````
 */
export type TDeepPartial<TSchema> = {
  [P in keyof TSchema]?: TSchema[P] extends object
    ? TDeepPartial<TSchema[P]>
    : TSchema[P];
};
/**tipado auxiliar para filtrar cada propiedad del esquema  extrayendo su tipo*/
type TFilterStringKeys<TSchema> = keyof {
  [K in keyof TSchema as K extends string | number ? K : never]: TSchema[K];
};
/**tipado que selecciona el tipo string de todas las propiedades de un esquema proporcionado */
export type TExtractOnlyKeyString<TSchema> = Extract<
  TFilterStringKeys<TSchema>,
  string
>;
