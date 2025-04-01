/**
 * @author MAG magles978@gmail.com]
 *
 */
import Util_Node from "util";
import {
  TStrCase,
  IOptionEqGtLt,
  TAExtValueType,
  IValueTypeOption,
  TExtValueType,
} from "./shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**
 *
 * utilidades nativas sin extensiones ni librerías
 */
export class UtilNative {
  /**Utilidades implícitas en Node JS*/
  public readonly util_Node = Util_Node;
  /**
   * Carácter separador de ruta lógica.
   *
   * @example
   * ```typescript
   * const charSeparatorLogicPath = ".";
   * const sp = charSeparatorLogicPath;
   * const path = `root${sp}object${sp}subObject`;
   * console.log(path); // salida "root.object.subobject"
   * ```
   */
  public readonly charSeparatorLogicPath = ".";
  /**
   * Carácter de separador de ruta para URL.
   *
   * @example
   * ```typescript
   * const charSeparatorUrlPath = "/";
   * const sp = charSeparatorUrlPath;
   * const path = `root${sp}object${sp}subObject`;
   * console.log(path); // salida "root/object/subobject"
   * ```
   */
  public readonly charSeparatorUrlPath = "/";
  /**
   * Carácter comodín especial que expresa cualquier indice en
   * un array, util para construir rutas (paths) con arrays
   * profundos
   *
   * @example
   * ```typescript
   * const charSeparatorLogicPath = ".";
   * const sp = charSeparatorLogicPath;
   * const charWildcardArrayItem = "#";
   * const cw = charWildcardArrayItem;
   * const path = `root${sp}object${sp}arrayProp${sp}${cw}${sp}subPropN`;
   * console.log(path); // salida "root.object.arrayProp.#.subPropN" ,
   *                    //donde ese # indica que puede ser cualquier elemento de arrayProp
   * ```
   */
  public readonly charWildcardArrayItem = "#";
  /**
   * expresion regular para dividir un string
   * de fecha con separadores:
   *
   * `"-"` ej. formato: `"dd-mm-yyyy"`
   *
   * `"/"` ej. formato: `dd/mm/yyyy`
   *
   * `"_"` ej. formato: `dd_mm_yyyy`
   *
   * `"#"` ej. formato: `dd#mm#yyyy`
   *
   * `"."` ej. formato: `dd.mm.yyyy`
   */
  public readonly sepDateRegExp = /\-|\/|\.|\#|\_|\:/;
  /**determina si ya esta definido el valor predefinido*/
  private static _isDfValue: boolean = false;
  /**valor predefinido global */
  private static _dfValue: null | undefined = undefined;
  /**valor predefinido global*/ //para uso de instancia
  public get dfValue(): null | undefined {
    return UtilNative._dfValue;
  }
  /**
   * Almacena la instancia única de esta clase
   */
  private static UtilNative_instance: UtilNative;
  /**
   * @param dfValue es el valor que se va a asumir
   * como valor predefinido cuando haya ausencia de valor
   */
  constructor(
    /**es el valor que se va a asumir como valor
     * predefinido cuando haya ausencia de valor */
    dfValue: null | undefined
  ) {
    //❗solo se puede modificar una vez❗
    if (!UtilNative._isDfValue) {
      UtilNative._dfValue = dfValue;
      UtilNative._isDfValue = true;
    }
  }
  /**
   * devuelve la instancia única de esta clase
   * ya sea que la crea o la que ya a sido creada
   * @param dfValue es el valor que se va a asumir como valor
   * predefinido cuando haya ausencia de valor
   */
  public static getInstance(dfValue: null | undefined): UtilNative {
    UtilNative.UtilNative_instance =
      UtilNative.UtilNative_instance === undefined ||
      UtilNative.UtilNative_instance === null
        ? new UtilNative(dfValue)
        : UtilNative.UtilNative_instance;
    return UtilNative.UtilNative_instance;
  }
  //████ undefined and Null ██████████████████████████████████████████
  /**
   * @param value variable a comprobar
   * ____
   * @returns `true` si es `undefined`
   * `false` si no no lo es
   * ____
   */
  public isUndefined(value: any): boolean {
    return value === undefined;
  }
  /**
   * @param value variable a comprobar
   * ____
   * @returns `true` si es `null`
   * `false` si no no lo es
   * ____
   */
  public isNull(value: any): boolean {
    return value === null;
  }
  /**
   * @param value variable a comprobar
   * ____
   * @returns `true` si es `undefined` o `null`
   * `false` si no no lo es
   * ____
   */
  public isUndefinedOrNull(value: any) {
    return this.isUndefined(value) || this.isNull(value);
  }
  /**
   * @param value variable a comprobar
   * ____
   * @returns `true` si NO es `undefined` ni `null`
   * `false` si lo es
   * ____
   */
  public isNotUndefinedAndNotNull(value: any) {
    return !this.isUndefined(value) && !this.isNull(value);
  }
  /**
   * Este método convierte para:
   *  - primitivos: valor `undefined` a `null`
   *  - objetos (incluidos arrays): las propiedades con valor `undefined` de un objeto o array en valor `null`.
   *
   * @param {object | any[]} value El primitivo, objeto o array que se va a procesar.
   * @param {boolean} isDeep `= false`, (solo para objetos o arrays) Si es `true`, el método procesará el objeto o array de forma recursiva. Si es `false` solo se procesará el primer nivel del objeto.
   * @returns {object | any[]}
   *  -Si `value` tiene asignado el valor `undefined` entonces retorna `null`, de lo contrario retorna el valor actual de `value`
   *  -Si `value`es un objeto o array, retorna todas su propiedas (o items) que hallan tenido valor `undefined` en valor `null`, las demas propiedades no son modificadas
   *
   * @example
   * ```typescript
   * const obj = { a: undefined, b: { c: undefined } };
   * const result = undefinedToNull(obj, true);
   * console.log(result); // salida { a: null, b: { c: null } }
   * ```
   */
  public undefinedToNull<T>(value: T, isDeep = false): T {
    //caso primitiv
    if (typeof value !== "object")
      //debe analizarse objeto (incluyendo null y arrays)
      return this.isUndefined(value) ? null : value;
    //caso null directo
    if (this.isNull(value)) return null;
    //caso objetos o arrays
    isDeep = this.convertToBoolean(isDeep);
    let newObjOrArray = !Array.isArray(value)
      ? { ...(value as object) } //clonacion superficial objeto
      : [...(value as any[])]; //clonacion superficial array
    Object.keys(newObjOrArray).forEach((key) => {
      if (this.isUndefined(newObjOrArray[key])) {
        newObjOrArray[key] = null;
      } else if (
        isDeep &&
        typeof newObjOrArray[key] === "object" && //acepta arrays
        !this.isNull(newObjOrArray[key])
      ) {
        newObjOrArray[key] = this.undefinedToNull(newObjOrArray[key], isDeep);
      } else {
      }
    });
    return newObjOrArray as T;
  }
  /**
   * Este método convierte para:
   *  - primitivos: valor `null` a `undefined`
   *  - objetos (incluidos arrays): las propiedades con valor `null` de un objeto o array en valor `undefined`.
   *
   * @param {object | any[]} value El primitivo, objeto o array que se va a procesar.
   * @param {boolean} isDeep `= false`, (solo para objetos o arrays) Si es `true`, el método procesará el objeto o array de forma recursiva. Si es `false` solo se procesará el primer nivel del objeto.
   * @returns {object | any[]}
   *  -Si `value` tiene asignado el valor `null` entonces retorna `undefined`, de lo contrario retorna el valor actual de `value`
   *  -Si `value`es un objeto o array, retorna todas su propiedas (o items) que hallan tenido valor `null` en valor `undefined`, las demas propiedades no son modificadas
   *
   * @example
   * ```typescript
   * const obj = { a: null, b: { c: null } };
   * const result = undefinedToNull(obj, true);
   * console.log(result); // salida { a: undefined, b: { c: undefined } }
   * ```
   */
  public nullToUndefined<T>(
    value: T,
    isDeep = false //solo permite el primer nivel
  ): T {
    //caso primitivo
    if (typeof value !== "object" || this.isNull(value))
      return this.isNull(value) ? undefined : value;
    //caso objetos o arrays
    isDeep = this.convertToBoolean(isDeep);
    let newObjOrArray = !Array.isArray(value)
      ? { ...(value as object) } //clonacion superficial objeto
      : [...(value as any[])]; //clonacion superficial array
    Object.keys(newObjOrArray).forEach((key) => {
      if (this.isNull(newObjOrArray[key])) {
        newObjOrArray[key] = undefined;
      } else if (
        isDeep &&
        typeof newObjOrArray[key] === "object" //acepta arrays
      ) {
        newObjOrArray[key] = this.nullToUndefined(newObjOrArray[key], isDeep);
      } else {
      }
    });
    return newObjOrArray as T;
  }
  //████ Booleanos ███████████████████████████████████████████████████
  /**
   * Determina si un valor es booleano.
   *
   * @param {any} bool - El valor que se va a verificar.
   * @returns {boolean} - Retorna `true` si el valor es booleano, de lo contrario retorna `false`.
   *
   * @example
   * ```typescript
   * const value = true;
   * const result = isBoolean(value);
   * console.log(result); // salida: true
   * ```
   */
  public isBoolean(bool: unknown): boolean {
    return typeof bool === "boolean";
  }
  /**
   * Convierte cualquier valor a un tipo booleano.
   *
   * @param {any} anyToCast El valor a cambiar (castear).
   * @param {Array<"isEmptyAsTrue" | "isZeroAsTrue" | "isNullAsTrue">} castExceptions `= ["isZeroAsTrue"]` Array con configuración de excepciones para hacer el cast. Las opciones son:
   *   - `"isEmptyAsTrue"`: Los objetos vacíos (incluyendo arrays) son `true`.
   *   - `"isZeroAsTrue"`: El valor `0` se asume como `true`.
   *   - `"isNullAsTrue"`: El valor `null` se asume como `true`.
   * @returns {boolean} Retorna el booleano correspondiente al valor recibido.
   *
   * @example
   * ```typescript
   * const value1 = "hello";
   * const result1 = convertToBoolean(value1);
   * console.log(result1); // salida: true
   *
   * const value2 = "";
   * const result2 = convertToBoolean(value2, ["isEmptyAsTrue"]);
   * console.log(result2); // salida: true
   *
   * const value3 = 0;
   * const result3 = convertToBoolean(value3, ["isZeroAsTrue"]);
   * console.log(result3); // salida: true
   *
   * const value4 = null;
   * const result4 = convertToBoolean(value4, ["isNullAsTrue"]);
   * console.log(result4); // salida: true
   * ```
   */
  public convertToBoolean(
    anyToCast: any,
    castExceptions: Array<"isEmptyAsTrue" | "isZeroAsTrue" | "isNullAsTrue"> = [
      "isZeroAsTrue",
    ]
  ): boolean {
    let r = false;
    if (!Array.isArray(castExceptions))
      //❗❗❗Debe ser nativo❗❗❗
      throw new Error(
        `${castExceptions} is not array of cast exceptions valid`
      );
    castExceptions = [...new Set(castExceptions)]; // eliminación básica de duplicados primitivos
    if (typeof anyToCast === "string") {
      r =
        anyToCast !== "" ||
        (anyToCast === "" && castExceptions.includes("isEmptyAsTrue"));
    } else if (typeof anyToCast === "object" && !this.isNull(anyToCast)) {
      //incluye arrays
      const isNotEmpty = Object.keys(anyToCast).length > 0;
      r =
        isNotEmpty || (!isNotEmpty && castExceptions.includes("isEmptyAsTrue"));
    } else if (anyToCast === 0) {
      //el caso especial de numero 0
      r = castExceptions.includes("isZeroAsTrue");
    } else if (this.isNull(anyToCast)) {
      //el caso especial de null
      r = castExceptions.includes("isNullAsTrue");
    } else {
      //lo demás
      r = !!anyToCast; //cast
    }
    return r;
  }
  //████ Números ██████████████████████████████████████████████████████
  /**
   * Determina si el valor proporcionado es un número.
   *
   * @param {any} num El valor a verificar.
   * @param {boolean} allowString `= false`. Determina si se permite que el número se reciba en tipo string.
   * @param {boolean} allowBigInt `= false`. Determina si se permite que el número se reciba en tipo bigInt.
   * @returns {boolean} Retorna `true` si el valor es un número, `false` de lo contrario.
   */
  public isNumber(
    num: unknown,
    allowString = false,
    allowBigInt = false
  ): boolean {
    allowString = this.convertToBoolean(allowString);
    allowBigInt = this.convertToBoolean(allowBigInt);
    let r: boolean;
    if (typeof num === "number") {
      r = !isNaN(num) && isFinite(num);
    } else if (typeof num === "string" && allowString) {
      const parse = parseFloat(num as string);
      r = !isNaN(parse) && isFinite(parse);
    } else if (typeof num === "bigint" && allowBigInt) {
      r = true;
    } else {
      r = false;
    }
    return r;
  }
  /**
   * Determina si el valor proporcionado es un entero gigante.
   *
   * @param {any} bigNum El valor a verificar.
   * @param {boolean} allowString `= false`. Determina si se permite que el entero gigante se reciba en tipo string.
   * @returns {boolean} Retorna `true` si el valor es un entero gigante, `false` de lo contrario.
   */
  public isBigint(bigNum: unknown, allowString = false): boolean {
    allowString = this.convertToBoolean(allowString);
    let r = false;
    if (typeof bigNum === "bigint") {
      r = true;
    } else if (typeof bigNum === "string" && allowString) {
      try {
        BigInt(bigNum);
        r = true;
      } catch (error) {
        //❗❗❗No importa el error❗❗❗
        r = false;
      }
    } else {
      r = false;
    }
    return r;
  }
  /**
   * determina si el número proporcionado corresponde a
   * la polaridad deseada (positiva o negativa)
   *
   * @param {any} num el número a verificar (no se acepta string-number  `"1"`)
   * @param {"+" | "-"} sign el signo (direccion o polaridad) que deberia tener el número
   * @param {boolean} isZeroIncluded `= false`. Si se debe incluir el 0 en la verificacion
   *
   * @return Retorna `true` si corresponde al signo o `false` si no corresponde a signo o no es un número
   */
  public isNumberSign(
    num: unknown,
    sign: "+" | "-",
    isZeroIncluded = false
  ): boolean {
    let r = false;
    // Verificar si el valor es un número
    if (!this.isNumber(num, false)) {
      return r;
    }
    const _num = num as number; //número garantizado
    if (sign === "+") r = isZeroIncluded ? _num >= 0 : _num > 0;
    else if (sign === "-") r = isZeroIncluded ? _num <= 0 : _num < 0;
    else {
      throw new Error(`${sign} is not sign valid`);
    }
    return r;
  }
  /**
   * Obtiene un reporte básico del tipo de número.
   *
   * @param {number | string} num - El número o cadena numérica a analizar.
   * @returns {object} - Retorna un objeto con las siguientes propiedades:
   *   - `polarity`: Indica si el número es "positive" o "negative".
   *   - `genericType`: Indica si el valor es un "number" o un "string-number".
   *   - `strictType`: Indica si el número es un "int", "bigInt" o "float".
   *
   * @example
   * ```typescript
   * let report = getTypeNumber("123");
   * console.log(report);
   * // Salida: { polarity: "positive", genericType: "string-number", strictType: "int" }
   *
   * report = getTypeNumber(-321.654);
   * console.log(report);
   * // Salida: { polarity: "negative", genericType: "number", strictType: "float" }
   * ```
   */
  public getNumberReport(num: number | string): {
    polarity: "positive" | "negative";
    genericType: "number" | "string-number";
    strictType: "int" | "bigInt" | "float";
  } {
    let r = {
      polarity: "" as "positive" | "negative",
      genericType: "" as "number" | "string-number",
      strictType: "" as "int" | "bigInt" | "float",
    };
    let n = this.stringToNumber(num);
    r.polarity = n < 0 ? "negative" : "positive"; //el `0` se considera positivo
    r.genericType = this.isString(num) ? "string-number" : "number";
    if (typeof n === "bigint") {
      r.strictType = "bigInt";
    } else {
      r.strictType = !Number.isInteger(n) ? "float" : "int";
    }
    return r;
  }
  /**
   * Convierte un string a número si es posible.
   *
   * @param {string | number} strNum El string numérico a convertir. Si se recibe un número, se retornará sin hacer proceso.
   * @returns {number} Retorna el número ya convertido.
   * @throws {Error} Lanza un error si `strNum` no es un número válido o no se puede convertir.
   * El mensaje de error es `${strNum} is not a valid number or string-number`.
   */
  public stringToNumber(strNum: string | number | bigint): number {
    //verificar que el valor sea o numérico o texto-numérico o bigint
    if (!this.isNumber(strNum, true, true))
      throw new Error(`${strNum} is not number or string-number valid`);
    //especificamente bigInt no se permite su conversion aquí
    if (typeof strNum === "bigint")
      throw new Error(
        `${strNum} is bigint type and is not cast process, please use \` .stringToBigint() \` method`
      );
    // Si el valor ya es un número, devolverlo sin cambios
    if (this.isNumber(strNum, false)) return strNum as any as number;
    // Verificar si el string es demasiado grande para ser manejado como number
    const maxLenSafeInteger = Number.MAX_SAFE_INTEGER.toString().length;
    const strLen = (strNum as string).length;
    if (maxLenSafeInteger < strLen)
      throw new Error(
        `${strNum} is too large string-number for number, please use \` .stringToBigint() \` method`
      );
    //determinar si es un flotante
    const floatNum = parseFloat(strNum as string);
    if (!isNaN(floatNum)) return floatNum;
    //determinar si es un entero
    const intNum = parseInt(strNum as string, 10);
    if (!isNaN(intNum)) return intNum;
    //normalmente no retornaria por aqui, se deja por protocolo
    return strNum as any as number;
  }
  /**
   * Convierte un string numérico o un `bigint` a `bigint`.
   *
   * @param {string | bigint} strBigNum - El string numérico o `bigint` a convertir.
   * @returns {bigint} - El valor convertido a `bigint`.
   * @throws {Error} - Lanza un error si el valor no es un `bigint` o un string numérico válido.
   *
   * @example
   * ```typescript
   *
   * console.log(util.stringToBigint("123")); // Salida: 123n
   * console.log(util.stringToBigint(456n)); // Salida: 456n
   * console.log(util.stringToBigint("abc")); // Lanza un error: "abc is not bigint or string-bigint valid"
   * ```
   */
  public stringToBigint(strBigNum: string | bigint): bigint {
    //verificar que el valor sea o bigint o texto-bigint o bigint
    if (!this.isBigint(strBigNum, true))
      throw new Error(`${strBigNum} is not bigint or string-bigint valid`);
    let r = BigInt(strBigNum);
    return r;
  }
  /**
   * Convierte un número o un string numérico a `bigint`.
   *
   * @param {number | string} num - El número o string numérico a convertir.
   * @returns {bigint} - El valor convertido a `bigint`.
   * @throws {Error} - Lanza un error si el valor no es un número o un string numérico válido.
   *
   * @example
   * ```typescript
   * const util = new UtilNative(null);
   *
   * console.log(util.numberToBigint(123)); // Salida: 123n
   * console.log(util.numberToBigint("456")); // Salida: 456n
   * console.log(util.numberToBigint("abc")); // Lanza un error: "abc is not number or string-number valid"
   * ```
   */
  public numberToBigint(num: number): bigint {
    //verificar que el valor sea o numérico o texto-numérico o bigint
    if (!this.isNumber(num, true, true))
      throw new Error(`${num} is not number or string-number valid`);
    let r = BigInt(num);
    return r;
  }
  /**
   * Convierte un `bigint` a `number`.
   *
   * ⚠ **Advertencia**: Si el `bigint` es demasiado grande para ser manejado como `number`,
   * la conversión puede resultar en una pérdida de precisión.
   *
   * @param {bigint} bigNum - El `bigint` a convertir.
   * @returns {number} - El valor convertido a `number`.
   * @throws {Error} - Lanza un error si el valor no es un `bigint` válido.
   *
   * @example
   * ```typescript
   * const util = new UtilNative(null);
   *
   * console.log(util.bigintToNumber(123n)); // Salida: 123
   * console.log(util.bigintToNumber(BigInt(Number.MAX_SAFE_INTEGER))); // Salida: 9007199254740991
   * console.log(util.bigintToNumber(BigInt(Number.MAX_SAFE_INTEGER) + 1n)); // Salida: 9007199254740992 (con advertencia de pérdida de precisión)
   * ```
   */
  public bigintToNumber(bigNum: bigint): number {
    //verificar que el valor sea o bigint o texto-bigint o bigint
    if (!this.isBigint(bigNum, true))
      throw new Error(`${bigNum} is not number or string-number valid`);
    // Advertencia si el bigint es demasiado grande para ser manejado como number
    if (
      bigNum > BigInt(Number.MAX_SAFE_INTEGER) ||
      bigNum < BigInt(Number.MIN_SAFE_INTEGER)
    ) {
      console.warn(
        `${bigNum} is too large to be safely converted to number. Precision may be lost.`
      );
    }
    let r = Number(bigNum);
    return r;
  }
  /**
   * Invierte el signo de un número dado.
   *
   * Este método toma un número o una cadena numérica como entrada y devuelve el mismo valor con el signo invertido.
   * Si el número es positivo, se devuelve negativo, y si es negativo, se devuelve positivo.
   * Si el número es `0`, se devuelve `0`.
   * Si el valor recibido no es numérico (o cadena numérica y `allowString` es `false`), retorna ese valor sin alterar.
   * Si `allowString` es `true` y el valor es una cadena numérica, se convierte a número antes de invertir el signo y se devuelve como cadena.
   *
   * @param {number | string} num El número o la cadena numérica cuyo signo se va a invertir.
   * @param {boolean} allowString `= false` Indica si se permiten cadenas numéricas como entrada.
   * @returns {number | string} El número o la cadena con el signo invertido.
   *
   * @example
   * ```typescript
   * const numP = 5;
   * const numN = -10;
   * const stringNum = "-1";
   * const stringNotNum = "abc";
   *
   * console.log(toggleNumberSign(numP, false)); // Salida: -5
   * console.log(toggleNumberSign(numN, false)); // Salida: 10
   * console.log(toggleNumberSign(0, false)); // Salida: 0
   * console.log(toggleNumberSign(stringNum, true)); // Salida: "1"
   * console.log(toggleNumberSign(stringNotNum, false)); // Salida: "abc"
   * console.log(toggleNumberSign(stringNotNum, true)); // Salida: "abc"
   * ```
   */
  public toggleNumberSign(
    num: number | string,
    allowString = false
  ): number | string {
    allowString = this.convertToBoolean(allowString);
    if (!this.isNumber(num, allowString)) num;
    let r: number | string;
    if (!allowString) r = -num;
    else r = `${-this.stringToNumber(num)}`;
    return r;
  }
  /**
   * Redondea un número y ajusta los decimales. Esta implementación se basa en la documentación oficial de Mozilla:
   * MDN Web Docs - Math.round
   *
   * @param {"round" | "floor" | "ceil"} type - Define el tipo de redondeo:
   * - `"none"`: Sin redondeo.
   * - `"round"`: Redondeo estándar (arriba si es >=5 y abajo si es <5).
   * - `"floor"`: Redondeo hacia abajo.
   * - `"ceil"`: Redondeo hacia arriba.
   *
   * @param {number | string} num - El número a redondear. Si no es un número válido, se retorna este valor.
   *
   * @param {number} exponential - El factor exponencial a redondear. El formato es el siguiente:
   * - Enteros Positivos:
   *   - `exp = 0`: Redondeo predefinido por la librería Math.
   *   - `exp = 1`: Redondeo en decenas.
   *   - `exp = 2`: Redondeo en centenas.
   *   - `exp = 3`: Redondeo en miles.
   *   - ...
   * - Enteros Negativos:
   *   - `exp = -1`: Redondeo en décimas.
   *   - `exp = -2`: Redondeo en centésimas.
   *   - `exp = -3`: Redondeo en milésimas.
   *   - ...
   * @example
   * ````typescript
   * //Ejemplo básico (no hay diferencia con `Math.round()`):
   * let data;
   * let exp;
   * let r;
   * data = 10.555555555555;
   * exp = 0; //redondeo estandar (al entero mas cercano)
   * r = roundNumber("round", data, exp);
   * console.log(r); //Salida 11
   * //Ejemplo redondeando decimas (x.0):
   * data = 10.12;
   * exp = -1; //decimas
   * r = roundNumber("round", data, exp);
   * console.log(r); //Salida 10.1
   * //Ejemplo redondeando centesimas (x.x0):
   * data = 10.163;
   * exp = -2; //centesimas
   * r = roundNumber("round", data, exp);
   * console.log(r); //Salida 10.17
   * //Ejemplo redondeando milesimas (x.xx0):
   * data = 10.1639;
   * exp = -3; //milesimas
   * r = roundNumber("round", data, exp);
   * console.log(r); //Salida 10.164
   * //===============================
   * //Ejemplo redondeando decenas (x0):
   * data = 12;
   * exp = 1; //decenas
   * r = roundNumber("round", data, exp);
   * console.log(r); //Salida 10 (el mas cercano a 12 de mitad hacia abajo)
   * //Ejemplo redondeando centenas (x00):
   * data = 160;
   * exp = 2; //centenas
   * r = roundNumber("round", data, exp);
   * console.log(r); //Salida 200 (el mas cercano a 160 de mitad hacia arriba)
   * //Ejemplo redondeando miles (x000):
   * data = 1611;
   * exp = 3; //miles
   * r = roundNumber("round", data, exp);
   * console.log(r); //Salida 2000 (el mas cercano a 1611 de mitad hacia arriba)
   * //===============================
   * //Ejemplo redondeando estandar (hacia abajo `"floor"`) (x.0):
   * data = 1.6;
   * exp = 0; //estandar
   * r = roundNumber("floor", data, exp);
   * console.log(r); //Salida 1 (el mas cercano a 1.6 hacia abajo)
   * //Ejemplo redondeando decimas (hacia abajo `"floor"`) (x.0):
   * data = 1.66;
   * exp = -1; //decimas
   * r = roundNumber("floor", data, exp);
   * console.log(r); //Salida 1.6 (el mas cercano a 1.66 hacia abajo)
   * //===============================
   * //Ejemplo redondeando estandar (hacia arriba `"ceil"`) (x.0):
   * data = 1.2;
   * exp = 0; //estandar
   * r = roundNumber("ceil", data, exp);
   * console.log(r); //Salida 2 (el mas cercano a 1.6 hacia arriba)
   * //Ejemplo redondeando decimas (hacia abajo `"ceil"`) (x.0):
   * data = 1.62;
   * exp = -1; //decimas
   * r = roundNumber("ceil", data, exp);
   * console.log(r); //Salida 1.7 (el mas cercano a 1.62 hacia arriba)
   *
   * ````
   *
   * @returns {number} Retorna el número redondeado si fue posible redondearlo, de lo contrario retorna el mismo número.
   * @throws instancia `Error`, mensajes casos:
   * - `${type} is not type valid`
   * - `${exponential} is not exponential factor valid`
   * - `${num} is not number or string-number valid`
   */
  public roundNumber(
    type: "round" | "floor" | "ceil",
    num: number | string,
    exponential: number
  ): number {
    let n = this.stringToNumber(num); //garantizar que es un numero
    let exp = this.stringToNumber(exponential); //garantizar que es un numero
    if (!this.isString(type, true))
      throw new Error(`${type} is not type valid`);
    if (this.getNumberReport(exp).strictType !== "int")
      throw new Error(`${exponential} is not exponential factor valid`);
    //caso especial si es 0 (no hay forma de redondear)
    if (n === 0) return n;
    // Si el exp es cero...
    if (+exp === 0) return Math[type](n);
    n = +n; //+num intentar convertir a numero cualquier cosa
    exp = +exp; //+exp intentar convertir a numero culaquier cosa
    // Si  el exp no es un entero
    if (!this.isNumber(exp) || exp % 1 !== 0) throw new Error("not round" + n);
    // Shift
    let aStrN = n.toString().split("e");
    n = Math[type](+(aStrN[0] + "e" + (aStrN[1] ? +aStrN[1] - exp : -exp)));
    // Shift back
    aStrN = n.toString().split("e");
    n = +(aStrN[0] + "e" + (aStrN[1] ? +aStrN[1] + exp : exp));
    return n;
  }
  /**
   * Determina si un número está en el rango solicitado.
   *
   * @param {number} num El número a verificar.
   * @param {[number, number]} range Tupla que contiene el rango definido.
   *   - `range[0]`: Valor mínimo del rango.
   *   - `range[1]`: Valor máximo del rango.
   * @param {boolean} isInclusive Determina si el rango es incluyente o excluyente.
   *
   * @example
   * ```typescript
   * const num = 1;
   * let r: boolean;
   * r = isNumberInRange(num, [1,5], true); // Salida: true (es incluyente)
   * r = isNumberInRange(num, [1,5], false); // Salida: false (es excluyente)
   * ```
   * @returns {boolean} Retorna `true` si el número está dentro del rango, `false` de lo contrario.
   */
  public isNumberInRange(
    num: number,
    range: [number, number],
    isInclusive: boolean
  ): boolean {
    let r = false;
    if (!this.isNumber(num)) return r;
    if (!Array.isArray(range) || range.length !== 2) return r;
    let [min, max] = range;
    if (!this.isNumber(min) || !this.isNumber(max)) return r;
    r = isInclusive
      ? min <= num && num <= max // incluyente
      : min < num && num < max; //excluyente
    return r;
  }
  /**
   * Adapta un número al rango definido.
   *
   * @param {number} num El número a adaptar al rango.
   * @param {[number, number]} range Tupla que contiene el rango definido para adaptar el número.
   *   - `range[0]`: Valor mínimo del rango.
   *   - `range[1]`: Valor máximo del rango.
   * @returns {number} Retorna el número adaptado a los límites del rango (límites incluyentes).
   *
   * @example
   * ````typescript
   * let num;
   * let r;
   *
   * //Dentro del rango:
   * num = 5;
   * r = adaptNumberToRange(num, [0,10]);
   * console.log(r);// Salida: 5
   *
   * //Fuera del rango, por encima:
   * num = 11;
   * r = adaptNumberToRange(num, [0,10]);
   * console.log(r);// Salida: 10
   *
   * //Fuera del rango, por debajo:
   * num = -2;
   * r = adaptNumberToRange(num, [0,10]);
   * console.log(r);// Salida: 0
   * ````
   */
  public adaptNumberToRange(
    num: number | string,
    range: [number | string, number | string]
  ): number {
    num = this.stringToNumber(num); //garantizar que es un numero
    if (!Array.isArray(range) || range.length != 2)
      throw new Error(`${range} is not tuple [number, number] valid`);
    let [min, max] = range;
    min = this.stringToNumber(min); //garantizar que es un numero
    max = this.stringToNumber(max); //garantizar que es un numero
    if (num < min || num > max) {
      num = num < min ? min : num;
      num = num > max ? max : num;
    }
    return num;
  }
  //████ Textos █████████████████████████████████████████████████████
  /**
   * Determina si un valor es un string, con la opción de aceptar o no string vacíos.
   *
   * @param {any} str El valor a analizar.
   * @param {boolean} allowEmpty = `false` Determina si se permite que el string vacío sea válido.
   * @returns {boolean} Retorna `true` si el valor es un string, `false` de lo contrario.
   *
   * @example
   * ```typescript
   * let a;
   * a = "";
   * console.log(isString(a, true)); // salida `true` (es un string válido aunque está vacío)
   * console.log((a, false)); // salida `false` (no es un string válido porque está vacío)
   * console.log(!isString(a)); // salida `true` permite vacios y cualquier tipo de valor menos string
   * console.log(!isString(a, true)); // salida `false` negar vacios
   * console.log(!isString(a, false)); // salida `true` niega el negar vacios (vacios prmitidos)
   * ```
   */
  public isString(str: unknown, allowEmpty = false): boolean {
    allowEmpty = this.convertToBoolean(allowEmpty);
    const r = typeof str === "string" && (allowEmpty || str !== "");
    return r;
  }
  /**
   * Verifica si una cadena contiene otra cadena según el tipo de coincidencia especificado.
   *
   * @param {string} str - La cadena completa en la que se buscará.
   * @param {string} strToSearch - La subcadena que se buscará dentro de `str`.
   * @param {object} option - Opciones de configuración para la búsqueda:
   *   - `likeType`: El tipo de coincidencia a utilizar. Puede ser `"start"` para coincidencia al inicio, `"end"` para coincidencia al final, o `"between"` para coincidencia en cualquier parte de la cadena.
   * @returns {boolean} - Retorna `true` si se encuentra la subcadena según el tipo de coincidencia especificado, de lo contrario retorna `false`.
   * @throws {Error} - Lanza un error si `likeType` no es válido.
   *
   * @example
   * ```typescript
   * const str = "Hello, world!";
   * const strToSearch = "Hello";
   * const result = isStringLike(str, strToSearch, { likeType: "start" });
   * console.log(result); // salida: true
   *
   * const result2 = isStringLike(str, "world", { likeType: "end" });
   * console.log(result2); // salida: false , termina en "world!"
   *
   * const result3 = isStringLike(str, "lo, wo", { likeType: "between" });
   * console.log(result3); // salida: true
   *
   * const result4 = isStringLike(str, "test", { likeType: "between" });
   * console.log(result4); // salida: false
   * ```
   */
  public isStringLike(
    str: string,
    strToSearch: string,
    option: { likeType: "start" | "end" | "between" }
  ): boolean {
    let r = false;
    if (!this.isString(str, true) || !this.isString(strToSearch, true))
      return r;
    //construir option
    const dfOp: typeof option = {
      likeType: "between",
    };
    const op = option;
    if (!this.isObject(op)) {
      option = dfOp;
    } else {
      option = {
        ...op,
        likeType: this.isString(op.likeType) ? op.likeType : dfOp.likeType,
      };
    }
    const { likeType } = option;
    let re: RegExp;
    if (likeType === "start") {
      re = new RegExp(`^${strToSearch}`);
    } else if (likeType === "end") {
      re = new RegExp(`${strToSearch}$`);
    } else if (likeType === "between") {
      re = new RegExp(`${strToSearch}`);
    } else {
      throw new Error(`${likeType} is not like-type valid`);
    }
    r = re.test(str);
    return r;
  }
  /**
   * Convierte un string a un formato de *case* utilizado en programación para nombrar variables, métodos, clases, interfaces u objetos.
   *
   * @param {string} str El string a convertir.
   * @param {TStrCase} caseType El tipo de case a convertir. Las opciones son:
   *   - "Snake": snake_case
   *   - "Kebab": kebab-case
   *   - "Camel": camelCase
   *   - "Pascal": PascalCase
   * @returns {string} Retorna el string convertido al tipo de case deseado
   * (si no es un string se retorna ese valor sin modificacion).
   *
   * @example
   * ```typescript
   * let a;
   * let r;
   * a = "hola como estas";
   * r = convertStringToCase(a, "Snake");
   * console.log(r); // salida "hola_como_estas"
   * r = convertStringToCase(a, "Kebab");
   * console.log(r); // salida "hola-como-estas"
   * r = convertStringToCase(a, "Camel");
   * console.log(r); // salida "holaComoEstas"
   * r = convertStringToCase(a, "Pascal");
   * console.log(r); // salida "HolaComoEstas"
   * ```
   */
  public convertStringToCase(str: string, caseType: TStrCase): string {
    if (!this.isString(str)) return str; //no usar throw
    if (!this.isString(caseType))
      throw new Error(`${caseType} is not case convertion type valid`);
    //adapta casos especial como snake o kebab
    const adaptCasesWithSeparateChart = (
      type: Extract<TStrCase, "Snake" | "Kebab" | "Constant" | "Dot">,
      str: string,
      reOtherCase: RegExp,
      sp: string
    ) => {
      str = str.replace(reOtherCase, sp); //reemplaza todos los caracteres de otros case
      const reUpper = /([A-ZÑ])/g;
      str = str.replace(reUpper, (char) => `${sp}${char.toLocaleLowerCase()}`); //reemplaza mayusculas por minusculas y antepone el `sp`
      const reDeleteDuplicate = new RegExp(`(${sp})\\1+`, "g");
      str = str.replace(reDeleteDuplicate, "$1"); //reemplaza (elimina) los caracteres `sp` repetidos consecutivamente
      const reInit = new RegExp(`^${sp}`);
      str = str.replace(reInit, ""); //reemplaza si inicia con el caracter `sp`
      const reEnd = new RegExp(`${sp}$`);
      str = str.replace(reEnd, ""); //reemplaza si finaliza con el caracter `sp`
      return str;
    };
    //adapta caso especiales de camel y Pascal
    const adaptCasesWithoutSeparateChart = (
      type: Extract<TStrCase, "Camel" | "Pascal">,
      str: string
    ) => {
      let isInitialCamelWord = true; //flag especial para camel, determina si es la palabara inicial (NO vacia)
      str = str
        .split(/[\s.:,;#*/><\-_]/g) //caracteres separadores de otros Case
        .map((word) => {
          let charts = word.split("");
          if (type === "Pascal") {
            if (charts.length <= 0) return ""; //este caso se da cuando el separador esta repetido y hace que la palabra sea vacia
            charts[0] = charts[0].toLocaleUpperCase();
          } else if (type === "Camel") {
            if (charts.length <= 0) return "";
            if (isInitialCamelWord) {
              //determina si es la palabra inicial
              charts[0] = charts[0].toLocaleLowerCase();
              isInitialCamelWord = false;
            } else {
              charts[0] = charts[0].toLocaleUpperCase();
            }
          } else {
          }
          word = charts.join(""); //reconstruir la palabra
          return word;
        })
        .reduce((preWord, currentWord) => {
          const r = `${preWord}${currentWord}`;
          return r;
        }, "");
      return str;
    };
    switch (caseType) {
      //convertir a snakeCase
      case "Snake":
        str = adaptCasesWithSeparateChart(
          "Snake",
          str,
          /[\s.:,;#*/><\-]/g,
          "_"
        );
        return str;
        break;

      case "Kebab":
        str = adaptCasesWithSeparateChart("Kebab", str, /[\s.:,;#*/><_]/g, "-");
        return str;
        break;

      case "Camel":
        str = adaptCasesWithoutSeparateChart("Camel", str);
        return str;
        break;

      case "Pascal":
        str = str = adaptCasesWithoutSeparateChart("Pascal", str);
        return str;
        break;
      //convertir a CONSTANT_CASE
      case "Constant":
        str = adaptCasesWithSeparateChart(
          "Constant",
          str,
          /[\s.:,;#*/><\-]/g,
          "_"
        );
        return str.toUpperCase(); // Convertimos todo a mayúsculas
        break;
      //convertir a dot.case
      case "Dot":
        str = adaptCasesWithSeparateChart("Dot", str, /[\s.:,;#*/><\-_]/g, ".");
        return str.toLowerCase(); // Convertimos todo a minúsculas
        break;
      default:
        return str;
        break;
    }
  }
  /**
   * Permite capitalizar una palabra (la primera letra en mayúscula).
   *
   * ⚠ Importante:
   * Debe ser una palabra, si es una frase solo capitaliza la primera palabra.
   *
   * @param {string} word La palabra a transformar.
   * @returns {string} Retorna la palabra ya transformada con la primera letra en mayúscula,
   * si la `word` no es un string valido es retornado sin modificaciones.
   *
   * @example
   * ````typescript
   * const txt = "hola mundo"
   * const r = capitalizeString(txt);
   * console.log(r); // "Hola mundo"
   * ````
   */
  public capitalizeString(word: string): string {
    if (!this.isString(word, true))
      // "" no lanza throw
      throw new Error(`${word} is not a valid string`);
    const r = word.charAt(0).toUpperCase() + word.slice(1);
    return r;
  }
  /**
   * construye un string path genérico a partir de un array de strings
   *
   * @param {string[]} aKeys - El array de strings que se utilizará para construir el path.
   * @param {object} [option] - Opciones para personalizar la construcción del path:
   *  - `charSeparator` (string) `= "."`: El carácter separador a utilizar entre los elementos del path.
   *  - `pathInit` (string) `= ""`: El prefijo a añadir al inicio del path.
   *  - `pathEnd` (string) `= ""`: El sufijo a añadir al final del path.
   *  - `isStartWithSeparator` (boolean) `= false` Determina si el path debe iniciar con el caracter separador.
   *  - `isStartWithSeparator` (boolean) `= false` Determina si el path debe iniciar con el caracter separador.
   *  - `isInitWithSeparator` (boolean) `= false`: Determina si el `pathInit` debe unirse al path con caracter separador.
   *  - `isEndtWithSeparator` (boolean) `= false` : Determina si el `pathEnd` debe unirse al path con caracter separador.
   * @returns el string del path ya construido
   * @throws {Error} - Lanza un error si `aKeys` no es un array válido de strings.
   *
   * @example
   * ```typescript
   * const keys = ["home", "user", "documents"];
   * let path: string;
   * //ejemplo 1:
   * path = buildPath(keys, { charSeparator: "/", isStartWithSeparator: true });
   * console.log(path); // salida: "/home/user/documents"
   *
   * //ejemplo 2:
   * path = buildPath(keys, {
   *   charSeparator: "/",
   *   isStartWithSeparator: false, //no inicializar con "/"
   *   isFinishWithSeparator: true, //si finalizar con "/"
   * });
   * console.log(path); // salida: "home/user/documents/"
   *
   * //ejemplo 3:
   * path = buildPath(keys, {
   *   charSeparator: "/",
   *   isStartWithSeparator: false, //no inicializar con "/"
   *   isFinishWithSeparator: true, //si finalizar con "/"
   *   pathInit: "..",
   *   isJoinInitWithSeparator: true //unir ".." al path con "/"
   * });
   * console.log(path); // salida: "../home/user/documents/"
   * ```
   */
  public buildPath(
    aKeys: string[],
    option?: {
      /**`= this.charSeparatorLogicPath` El carácter separador a utilizar entre los elementos del path. */
      charSeparator?: string;
      /** `= ""` El prefijo a añadir al inicio del path.*/
      pathInit?: string;
      /** `= ""` El sufijo a añadir al final del path.*/
      pathEnd?: string;
      /** `= false` Determina si el path debe iniciar con el caracter separador */
      isStartWithSeparator?: boolean;
      /**`= false` Determina si el path debe terminar con el caracter separador */
      isFinishWithSeparator?: boolean;
      /**`= false` Determina si el `pathInit` debe unirse al path con caracter separador.*/
      isJoinInitWithSeparator?: boolean;
      /**`= false` Determina si el `pathEnd` debe unirse al path con caracter separador.*/
      isJoinEndtWithSeparator?: boolean;
    }
  ): string {
    if (
      !this.isValueType(aKeys, [["string"]], {
        allowArrayEmpty: true,
        allowStringEmpty: true,
      })
    ) {
      throw new Error(`${aKeys} is not array of strings valid`);
    }
    //constructor de opciones
    let op = this.isObject(option, true) ? option : ({} as typeof option); //default vacio
    op = {
      ...op, //opciones adicionales no documentadas (si las hay)
      charSeparator: this.isString(op.charSeparator)
        ? op.charSeparator
        : this.charSeparatorLogicPath, //❗default❗
      isStartWithSeparator: this.isBoolean(op.isStartWithSeparator)
        ? op.isStartWithSeparator
        : false, //default, ❗No inicia con caracter separador❗,
      isFinishWithSeparator: this.isBoolean(op.isFinishWithSeparator)
        ? op.isFinishWithSeparator
        : false, //default, ❗No termina con caracter separador❗
      isJoinInitWithSeparator: this.isBoolean(op.isJoinInitWithSeparator)
        ? op.isJoinInitWithSeparator
        : false, //default, no une con caracter separador
      isJoinEndtWithSeparator: this.isBoolean(op.isJoinEndtWithSeparator)
        ? op.isJoinEndtWithSeparator
        : false, //default, no une con caracter separador
      pathInit: this.isValueType(op.pathInit, ["number", "string"])
        ? op.pathInit
        : "",
      pathEnd: this.isValueType(op.pathEnd, ["number", "string"])
        ? op.pathEnd
        : "",
    };
    const {
      charSeparator: sp,
      isStartWithSeparator,
      isFinishWithSeparator,
      isJoinInitWithSeparator,
      isJoinEndtWithSeparator,
      pathEnd,
      pathInit,
    } = op;
    // Escapar el separador si es un carácter especial en regex
    const eSp = sp.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`^${eSp}+|${eSp}+$`, "g");
    let aKeys_clon = [...aKeys]; //clonacion sencilla
    //reducir:
    let path = aKeys_clon.reduce((prePath, cKey, idx) => {
      const keyCC = cKey.replace(re, "");
      let r = prePath;
      if (keyCC !== "") {
        r = idx !== 0 ? `${prePath}${sp}${keyCC}` : `${prePath}${keyCC}`;
      }
      return r;
    }, "");
    //formateo adicional:
    // Agregar prefijo y sufijo (eliminando separadores duplicados)
    if (pathInit !== "") {
      const cleanPathInit = pathInit.replace(re, "");
      path = isJoinInitWithSeparator
        ? `${cleanPathInit}${sp}${path}`
        : `${cleanPathInit}${path}`;
    }
    if (pathEnd !== "") {
      const cleanPathEnd = pathEnd.replace(re, "");
      path = isJoinEndtWithSeparator
        ? `${path}${sp}${cleanPathEnd}`
        : `${path}${cleanPathEnd}`;
    }
    // Agregar separadores al inicio y final si es necesario
    if (isStartWithSeparator) path = `${sp}${path}`;
    if (isFinishWithSeparator) path = `${path}${sp}`;
    return path;
  }
  /**
   * Valida si un una ruta (path) (o un array de paths) está construido correctamente.
   *
   * Un path válido no debe comenzar ni terminar con el separador,
   * no debe contener separadores consecutivos, y cada segmento debe ser una cadena no vacía.
   *
   * @param {string | string[]} keyOrKeysPath path o array de paths a validar
   * @param {string} separator `= this.charSeparatorLogicPath` El separador utilizado en el `keyPath` (por defecto es ".").
   * @returns {boolean} Retorna `true` si el `keyPath` es válido, `false` de lo contrario.
   *
   * @example
   * ```typescript
   * _validateKeyPath("prop1.prop2.propN"); // true
   * _validateKeyPath(".prop1..prop2"); // false
   * _validateKeyPath(["prop1.prop2", "prop3.prop4"]); // true
   * _validateKeyPath(["prop1.prop2", ".prop3..prop4"]); // false
   * ```
   */
  public isKeyPath(
    keyOrKeysPath: string | string[],
    separator: string = this.charSeparatorLogicPath
  ): boolean {
    if (!this.isString(separator))
      //el separador no puede ser "" vacio
      throw new Error(`${separator} is not char separator valid`);
    keyOrKeysPath = this.castArrayByConditionType(keyOrKeysPath, "string", []);
    if (keyOrKeysPath.length === 0) return false;
    // Función auxiliar para validar un `keyPath` individual
    const isValidSingleKeyPath = (path: string): boolean => {
      // Verificar que no comience ni termine con el separador
      if (path.startsWith(separator) || path.endsWith(separator)) return false;
      // Verificar que no contenga separadores consecutivos
      if (path.includes(`${separator}${separator}`)) return false;
      // Verificar que cada segmento sea una cadena no vacía
      const segments = path.split(separator);
      return segments.every((segment) => segment.trim() !== "");
    };
    let r = keyOrKeysPath.every(isValidSingleKeyPath);
    return r;
  }
  //████ Objetos ████████████████████████████████████████████████████
  /**
   * Determina si el valor recibido corresponde a un objeto.
   *
   * @param {any} value El valor a analizar.
   * @param {boolean} allowEmpty = `false`, determina si se permite que el objeto esté vacio `{}`
   * @returns {boolean} Retorna `true` si es un objeto, de lo contrario retorna `false`.
   *
   * @example
   * ```typescript
   * let a;
   *
   * //objeto vacio
   * a = {};
   * console.log(isObject(a, true)); // salida `true` (es un objeto válido aunque esté vacío)
   * console.log(isObject(a, false)); // salida `false` (NO es un objeto válido porque está vacío)
   * console.log(!isObject(a)); // salida `true` permite vacíos y cualquier tipo de valor menos object
   * console.log(!isObject(a, true)); // salida `false` niega vacíos
   * console.log(!isObject(a, false)); // salida `true` niega negar vacíos (vacíos aprobados)
   *
   * //ejemplo array:
   * a = [];
   * console.log(isObject(a)); // salida `false` (un array (vacío o poblado) no lo considera objeto literal)
   * ```
   */
  public isObject(value: unknown, allowEmpty = false): boolean {
    allowEmpty = this.convertToBoolean(allowEmpty);
    // Verificar si es un objeto (excluyendo null y arrays)
    const isObj =
      typeof value === "object" && !this.isNull(value) && !Array.isArray(value);
    if (!isObj) return false;
    // Si allowEmpty es true, no es necesario verificar si el objeto está vacío
    if (allowEmpty) return true;
    // Verificar si el objeto tiene propiedades (incluyendo no enumerables)
    return Object.getOwnPropertyNames(value).length > 0;
  }
  /**
   * Obtiene un array con todos los paths (rutas) de las propiedades de un objeto, incluyendo propiedades anidadas.
   *
   * @param {TObj} obj - El objeto del cual se obtendrán los paths de las propiedades.
   * @param {object} [option] - Opciones para personalizar la obtención de paths:
   *   - `charSeparator` (string) `= "."`: El carácter separador a utilizar entre los elementos del path.
   *   - `includeFunctionProps` (boolean) `= true`: Determina si se incluyen las propiedades de tipo función en los paths.
   *   - `includePrivateProps` (boolean) `= true`: Determina si se incluyen las propiedades consideradas privadas (que tienen prefijo "_") en los paths.
   *
   * @returns {string[]} - Retorna un array de strings, donde cada string es un path que representa la ruta completa hasta una propiedad del objeto.
   *
   * @throws {Error} - Lanza un error si `obj` no es un objeto válido.
   *
   * @example
   * ```typescript
   * const obj = {
   *   a: {
   *     b: {
   *       c: 42,
   *       d: "hola",
   *     },
   *     e: [1, 2, 3],
   *   },
   *   f: "mundo",
   *   _privateProp: "secreto",
   *   g: () => console.log("función"),
   * };
   *
   * const util = new UtilNative(null);
   *
   * // Obtener todos los paths (incluyendo funciones y propiedades privadas)
   * const paths1 = util.getPropertyPathsOfObject(obj);
   * console.log(paths1);
   * // Salida esperada:
   * // [
   * //   "a",
   * //   "a.b",
   * //   "a.b.c",
   * //   "a.b.d",
   * //   "a.e",
   * //   "f",
   * //   "_privateProp",
   * //   "g"
   * // ]
   *
   * // Obtener todos los paths (excluyendo funciones y propiedades privadas)
   * const paths2 = util.getPropertyPathsOfObject(obj, {
   *   includeFunctionProps: false,
   *   includePrivateProps: false,
   * });
   * console.log(paths2);
   * // Salida esperada:
   * // [
   * //   "a",
   * //   "a.b",
   * //   "a.b.c",
   * //   "a.b.d",
   * //   "a.e",
   * //   "f"
   * // ]
   *
   * // Obtener todos los paths con un separador personalizado
   * const paths3 = util.getPropertyPathsOfObject(obj, {
   *   charSeparator: "/",
   * });
   * console.log(paths3);
   * // Salida esperada:
   * // [
   * //   "a",
   * //   "a/b",
   * //   "a/b/c",
   * //   "a/b/d",
   * //   "a/e",
   * //   "f",
   * //   "_privateProp",
   * //   "g"
   * // ]
   * ```
   */
  public getPropertyPathsOfObject<TObj extends object>(
    obj: TObj,
    option?: {
      /** `= "."` El carácter separador a utilizar entre los elementos del path. */
      charSeparator?: string;
      /** `= true` Incluir paths de propiedades de tipo Function. */
      includeFunctionProps?: boolean;
      /** `= true` Incluir paths de propiedades consideradas privadas (que tienen prefijo "_") */
      includePrivateProps?: boolean;
    }
  ): string[] {
    if (!this.isObject(obj)) throw new Error(`${obj} is not object valid`);
    //constructor de opciones
    let op = this.isObject(option, true) ? option : ({} as typeof option); //default vacio
    op = {
      ...op, //opciones adicionales no documentadas (si las hay)
      charSeparator: this.isString(op.charSeparator)
        ? op.charSeparator
        : this.charSeparatorLogicPath,
      includeFunctionProps: this.isBoolean(op.includeFunctionProps)
        ? op.includeFunctionProps
        : true,
      includePrivateProps: this.isBoolean(op.includePrivateProps)
        ? op.includePrivateProps
        : true,
    };
    const { charSeparator, includeFunctionProps, includePrivateProps } = op;
    const paths: string[] = [];
    const stack: Array<{ obj: any; currentPath: string }> = [];
    // Inicializar la pila con el objeto base
    stack.push({ obj, currentPath: "" });
    while (stack.length > 0) {
      const { obj: currentObj, currentPath } = stack.pop()!;
      // Obtener todas las claves del objeto (incluyendo Symbols si está habilitado)
      const keys = Object.keys(currentObj);
      for (const key of keys) {
        const value = currentObj[key];
        const newPath = currentPath
          ? `${currentPath}${charSeparator}${key.toString()}`
          : key.toString();
        // Si el valor es un objeto y no es null, lo agregamos a la pila para seguir recorriendo
        if (this.isObject(value, true)) {
          stack.push({ obj: value, currentPath: newPath });
        } else if (this.isArray(value)) {
          value.forEach((item, index) => {
            const arrayPath = `${newPath}${charSeparator}${index}`;
            if (this.isObject(item, true)) {
              stack.push({ obj: item, currentPath: arrayPath });
            }
            if (this.isFunction(item) && !includeFunctionProps) return;
            if (key.startsWith("_") && !includePrivateProps) return;
            paths.push(arrayPath);
          });
        }
        //restricciones:
        if (this.isFunction(value) && !includeFunctionProps) continue;
        if (key.startsWith("_") && !includePrivateProps) continue;
        // Agregar el path actual al array de paths
        paths.push(newPath);
      }
    }
    return paths;
  }
  /**
   * Verifica si un valor es un objeto y si determinadas propiedades cumplen una condición específica.
   *
   * ⚠ Solo verifica propiedades del primer nivel del objeto.
   *
   * ⚠ **No** reconoce arrays, solo objetos.
   *
   * @param {TObj} obj El objeto a verificar.
   * @param {keyof TObj | Array<keyof TObj>} keyOrKeys Las claves identificadoras de las propiedades a verificar (❕No deben ser rutas, solo claves de las propiedades de primer nivel❕).
   * @param {object} [option] Objeto de opciones para configurar la verificación con las siguientes propiedades:
   *  - `charSeparator = "is-not-undefined-and-not-null"` Determina la condición que debe cumplir cada propiedad referenciada en `keyOrKeys`
   * @returns {boolean} Retorna `true` si es un objeto y las propiedades cumplen la condición, `false` de lo contrario.
   *
   * @example
   * ```typescript
   * let obj;
   * let r;
   *
   * // Ejemplo básico (evalúa como `isObject()`):
   * obj = { p1: "hola", p2: 31 };
   * r = util.isObjectWithProperties(obj);
   * console.log(r); // Salida: `true`, es un objeto
   *
   * // Ejemplo verificando propiedad (no undefined y no null):
   * obj = { p1: "hola", p2: 31 };
   * r = util.isObjectWithProperties(obj, ["p1"], { propCondition: "is-not-undefined-and-not-null" });
   * console.log(r); // Salida: `true`, es un objeto y `p1` no es undefined o null
   *
   * // Ejemplo verificando propiedad (es undefined o es null):
   * obj = { p1: "hola", p2: 31 };
   * r = util.isObjectWithProperties(obj, ["p3"], { propCondition: "is-not-undefined-and-not-null" });
   * console.log(r); // Salida: `false`, es un objeto pero `p3` es undefined
   *
   * // Ejemplo diferencias de comprobación ("it-exist"):
   * obj = { p1: "hola", p2: 31, p3: undefined };
   * r = util.isObjectWithProperties(obj, ["p3"], { propCondition: "it-exist" });
   * console.log(r); // Salida: `true`, es un objeto y `p3` existe (a pesar de tener asignado undefined)
   *
   * // Ejemplo diferencias de comprobación ("is-not-undefined"):
   * obj = { p1: "hola", p2: 31, p3: undefined };
   * r = util.isObjectWithProperties(obj, ["p3"], { propCondition: "is-not-undefined" });
   * console.log(r); // Salida: `false`, es un objeto y `p3` tiene asignado undefined
   *
   * // Ejemplo comprobación profunda (NO habilitada):
   * obj = { p1: "hola", p2: { p21: 3 } };
   * r = util.isObjectWithProperties(obj, ["p2.p21"], { propCondition: "is-not-undefined-and-not-null" });
   * console.log(r); // Salida: `false`, 🚫 NO está habilitada la verificación profunda, usar el método isObjectWithDeepProperties()
   * ```
   */
  public isObjectWithProperties<TObj extends object>(
    obj: TObj,
    keyOrKeys: keyof TObj | Array<keyof TObj>,
    option?: {
      /** `= "is-not-undefined-and-not-null"` Determina la condición que debe cumplir cada propiedad referenciada en `keyOrKeys` */
      propCondition?:
        | "it-exist"
        | "is-not-undefined"
        | "is-not-null"
        | "is-not-undefined-and-not-null";
      /**`= false`, Determina si se permite que un objeto vacío sea válido. */
      allowEmpty?: boolean;
    }
  ): boolean {
    if (
      this.isNotUndefinedAndNotNull(keyOrKeys) &&
      !this.isString(keyOrKeys) && //❗Obligario negar string vacio❗
      !this.isArray(keyOrKeys, true) //❗Obligario permitir array vacio❗
    )
      throw new Error(`${keyOrKeys as any} is not key or keys valid`);
    //constructor de opciones
    let op = this.isObject(option, true) ? option : ({} as typeof option); //default vacio
    op = {
      ...op, //opciones adicionales no documentadas (si las hay)
      propCondition:
        op.propCondition === "is-not-null" ||
        op.propCondition === "is-not-undefined" ||
        op.propCondition === "it-exist" ||
        op.propCondition === "is-not-undefined-and-not-null"
          ? op.propCondition
          : "is-not-undefined-and-not-null", //default
      allowEmpty: this.isBoolean(op.allowEmpty) ? op.allowEmpty : false,
    };
    const { propCondition, allowEmpty } = op;
    let keys = this.castArrayByConditionType(keyOrKeys, "string", []);
    keys = [...new Set(keys)]; //eliminacion de repetidos sencilla
    //validación del objeto vacio
    if (!this.isObject(obj, allowEmpty)) return false;
    let r = false;
    if (keys.length > 0) {
      r = keys.every((key) => {
        let r =
          propCondition === "it-exist"
            ? key in obj
            : propCondition === "is-not-undefined"
            ? !this.isUndefined(obj[key])
            : propCondition === "is-not-null"
            ? !this.isNull(obj[key])
            : this.isNotUndefinedAndNotNull(obj[key]);
        return r;
      });
    } else {
      r = true;
    }
    return r;
  }
  /**
   * Verifica si un valor es un objeto y si determinadas propiedades cumplen una condición específica, permitiendo rutas profundas.
   *
   * ⚠ **No** reconoce arrays directamente como objetos, pero permite el uso de comodines para verificar elementos dentro de arrays.
   *
   * @param {any} obj El objeto a verificar.
   * @param {string | string[]} keyOrKeysPath Las claves identificadoras de las propiedades a verificar, permitiendo rutas profundas separadas por `charSeparator`.
   * @param {object} [option] Objeto de opciones para configurar la verificación con las siguientes propiedades:
   * - `propCondition = "is-not-undefined-and-not-null"` Determina la condición que debe cumplir cada propiedad referenciada en `keyOrKeysPath`.
   * - `"it-exist"` verifica si la propiedad existe (aunque tenga asignado `undefined` o `null`).
   * - `"is-not-undefined"` verifica que la propiedad no sea `undefined`.
   * - `"is-not-null"` verifica que la propiedad no sea `null`.
   * - `"is-not-undefined-and-not-null"` (predefinido) verifica que la propiedad no sea `undefined` ni `null`.
   * - `charSeparator = "."` El carácter separador a utilizar entre los elementos del path.
   * - `charWildcard = "#"` El carácter comodín para las rutas con profundidad en arrays cuando no se conoce el índice específico.
   * @returns {boolean} Retorna `true` si es un objeto y las propiedades cumplen la condición, `false` de lo contrario.
   *
   * @example
   * ```typescript
   * const util = util.getInstance();
   * let obj;
   * let r;
   *
   * // Ejemplo básico (evalúa como `isObject()`):
   * obj = { p1: "hola", p2: 31 };
   * r = util.isObjectWithDeepProperties(obj);
   * console.log(r); // Salida: `true`, es un objeto
   *
   * // Ejemplo verificando propiedad (no undefined y no null):
   * obj = { p1: "hola", p2: 31 };
   * r = util.isObjectWithDeepProperties(obj, "p1", { propCondition: "is-not-undefined-and-not-null" });
   * console.log(r); // Salida: `true`, es un objeto y `p1` no es undefined o null
   *
   * // Ejemplo verificando propiedad (es undefined o es null):
   * obj = { p1: "hola", p2: 31 };
   * r = util.isObjectWithDeepProperties(obj, "p3", { propCondition: "is-not-undefined-and-not-null" });
   * console.log(r); // Salida: `false`, es un objeto pero `p3` es undefined
   *
   * // Ejemplo diferencias de comprobación ("it-exist"):
   * obj = { p1: "hola", p2: 31, p3: undefined };
   * r = util.isObjectWithDeepProperties(obj, "p3", { propCondition: "it-exist" });
   * console.log(r); // Salida: `true`, es un objeto y `p3` existe (a pesar de tener asignado undefined)
   *
   * // Ejemplo diferencias de comprobación ("is-not-undefined"):
   * obj = { p1: "hola", p2: 31, p3: undefined };
   * r = util.isObjectWithDeepProperties(obj, "p3", { propCondition: "is-not-undefined" });
   * console.log(r); // Salida: `false`, es un objeto y `p3` tiene asignado undefined
   *
   * // Ejemplo comprobación profunda:
   * obj = { p1: "hola", p2: { p21: 3 } };
   * r = util.isObjectWithDeepProperties(obj, "p2.p21", { propCondition: "is-not-undefined-and-not-null" });
   * console.log(r); // Salida: `true`, permite verificación profunda (hasta 16 niveles probados)
   * ```
   */
  public isObjectWithDeepProperties(
    obj: any,
    keyOrKeysPath: string | string[],
    option?: {
      /** `= "is-not-undefined-and-not-null"` Determina la condición que debe cumplir cada propiedad referenciada en `keyOrKeys` */
      propCondition?:
        | "it-exist"
        | "is-not-undefined"
        | "is-not-null"
        | "is-not-undefined-and-not-null";
      /**`= "."` El carácter separador a utilizar entre los elementos del path. */
      charSeparator?: string;
      /**`= "#"` El carácter comodín para las rutas con profundidad en array
       * y no se conoce el indice donde la continuación de las sub propiedades.
       *
       * @example
       * ````
       * const util = util.getInstance();
       * const obj = {
       *  a:{
       *    b:[ //b es un array de sub objetos que pueden contener la propiedad c
       *      {d: "d1"},
       *      {e: "e2"},
       *      {c: "c1"},
       *      2,
       *      "lo que sea"
       *    ]
       *  }
       * };
       * const keyPath = "a.b.#.c";//al ser b array entonces "#" indica que puede ser
       *                          //cualquier indice de elemento de ese array que cumpla la condición
       * util.isObjectWithDeepProperties(
       *  obj,
       *  false,
       *  keyPath
       * ); // retorna true, al menos un elemento de b es objeto y tiene la propiedad c.
       *
       * ````
       */
      charWildcard?: string;
      /**`= false`, Determina si se permite que un objeto vacío sea válido. */
      allowEmpty?: boolean;
    }
  ): boolean {
    // Validación de keyOrKeysPath
    if (
      this.isNotUndefinedAndNotNull(keyOrKeysPath) &&
      !this.isString(keyOrKeysPath) && //❗Obligario negar string vacio❗
      !this.isArray(keyOrKeysPath, true) //❗Obligario permitir array vacio❗
    ) {
      throw new Error(`${keyOrKeysPath} is not key or keys path valid`);
    }
    //constructor de opciones
    let op = this.isObject(option, true) ? option : ({} as typeof option); //default vacio
    op = {
      ...op, //opciones adicionales no documentadas (si las hay)
      propCondition:
        op.propCondition === "is-not-null" ||
        op.propCondition === "is-not-undefined" ||
        op.propCondition === "it-exist" ||
        op.propCondition === "is-not-undefined-and-not-null"
          ? op.propCondition
          : "is-not-undefined-and-not-null", //default
      charSeparator: this.isString(op.charSeparator)
        ? op.charSeparator
        : this.charSeparatorLogicPath,
      charWildcard: this.isString(op.charWildcard)
        ? op.charWildcard
        : this.charWildcardArrayItem,
      allowEmpty: this.isBoolean(op.allowEmpty) ? op.allowEmpty : false,
    };
    const { propCondition, allowEmpty, charSeparator, charWildcard } = op;
    // Convertir keyOrKeysPath a un array de rutas
    let keysPath = this.castArrayByConditionType(keyOrKeysPath, "string", []);
    // Eliminar duplicados
    keysPath = [...new Set(keysPath)];
    // Validación del objeto vacio
    if (!this.isObject(obj, allowEmpty)) return false;
    // Verificar cada ruta
    for (const keyPath of keysPath) {
      const keys = keyPath.split(charSeparator);
      let currentObj = obj;
      // Recorrer la ruta de claves
      for (let idx = 0; idx < keys.length; idx++) {
        const key = keys[idx];
        // Si es un comodín, verificar todos los elementos del array
        if (key === charWildcard) {
          // Si no es un array, no se puede aplicar el comodín
          if (!Array.isArray(currentObj)) return false;
          // Verificar cada elemento del array
          for (const element of currentObj) {
            const remainingPath = keys.slice(idx + 1).join(charSeparator);
            if (
              this.isObjectWithDeepProperties(element, remainingPath, { ...op })
            ) {
              return true; // Al menos un elemento cumple la condición
            }
          }
          return false; // Ningún elemento cumple la condición
        }
        // Verificar si la clave existe en el objeto actual
        if (
          this.isUndefinedOrNull(currentObj) ||
          !this.isObject(currentObj, true) ||
          !(key in currentObj)
        )
          return false; // La ruta no existe
        // Verificar la condición de la propiedad
        if (idx === keys.length - 1) {
          const value = currentObj[key];
          switch (propCondition) {
            case "it-exist":
              if (!(key in currentObj)) return false;
              break;
            case "is-not-undefined":
              if (this.isUndefined(value)) return false;
              break;
            case "is-not-null":
              if (this.isNull(value)) return false;
              break;
            case "is-not-undefined-and-not-null":
              if (this.isUndefinedOrNull(value)) return false;
              break;
          }
        }
        // Mover al siguiente nivel del objeto
        currentObj = currentObj[key];
      }
    }
    return true; // Todas las rutas son válidas
  }
  /**
   * Determina si un objeto es literal (no es instanciado o fue creado por medio de `new`).
   *
   * ⚠ se asume incluso si el objeto es vacio ⚠
   *
   * @param {any} obj El objeto a analizar.
   * @returns {boolean} Retorna `true` si el objeto es literal, de lo contrario retorna `false`.
   *
   * @example
   * ```typescript
   * let obj;
   * let r;
   *
   * //comprobando literal
   * obj = { a: 1, b: 2 };
   * r = isLiteralObject(obj);
   * console.log(r); // salida: true
   *
   * //comprobando instancia
   * class MyClass{};
   * obj = new MyClass();
   * r = isLiteralObject(obj);
   * console.log(r); // salida: false
   *
   * //comprobando literal
   * obj = {}; //vacío
   * r = isLiteralObject(obj);
   * console.log(r); // salida: true
   *
   * obj = Object.create(null);
   * r = util.isLiteralObject(obj); // true
   * console.log(r); // salida: true
   * ```
   */
  public isLiteralObject(obj: unknown) {
    // Verificar si es un objeto (incluyendo objetos vacíos)
    if (!this.isObject(obj, true)) return false;
    // Verificar que no sea una instancia creada con `new`
    if (obj.constructor && obj.constructor !== Object) return false;
    // Verificar que el prototipo sea el prototipo base de Object
    const proto = Object.getPrototypeOf(obj);
    return proto === Object.prototype || this.isNull(proto);
  }
  /**
   * Determina si un objeto es instanciado o fue creado por medio de `new`.
   *
   * @param {any} obj El objeto a analizar.
   * @returns {boolean} Retorna `true` si el objeto es una instancia, de lo contrario retorna `false`.
   *
   * @example
   * ```typescript
   * let obj;
   * let r;
   * class MyClass {};
   *
   * //comprobando instancia
   * obj = new MyClass();
   * r = isInstance(obj);
   * console.log(r); // salida: true
   *
   * //comprobando literal
   * obj = {p1:"hola"};
   * r = isInstance(obj);
   * console.log(r); // salida: false
   *
   * //comprobando literal vacio
   * obj = {};
   * r = isInstance(obj);
   * console.log(r); // salida: false
   *
   * //comprobando instancia por Object
   * obj = Object.create(null);
   * r = isInstance(obj);
   * console.log(r); // salida: false
   * ```
   */
  public isInstance(obj: unknown) {
    if (!this.isObject(obj, true)) return false;
    if (obj.constructor && obj.constructor !== Object) return true;
    return false;
  }
  /**
   * Obtiene el nombre de la clase de la instancia recibida.
   *
   * @param {object} instance - La instancia de la cual se desea obtener el nombre.
   * @returns {string} - Retorna el nombre de la instancia a la que corresponde el objeto o `undefined` si no fue posible obtener el nombre (porque no es un objeto, o es un objeto literal o anónimo).
   * @throws {Error} - Lanza un error si la instancia no es una instancia de una clase.
   *
   * @example
   * ```typescript
   * class MyClass {};
   * const obj = new MyClass();
   * const className = getClassName(obj);
   * console.log(className); // salida: "MyClass"
   * ```
   */
  public getClassName<TInst extends object>(instance: TInst): string {
    if (!this.isInstance(instance))
      throw new Error(`${instance} is not instance of class`);
    let name = instance.constructor.name;
    return name;
  }
  /**
   * Convierte las claves identificadoras de un objeto literal a un formato específico (snakeCase, kebabCase, camelCase o pascalCase).
   *
   * ⚠ Las claves identificadoras que tienen el prefijo "_" serán eliminadas.
   *
   * @param {object} objBase El objeto a convertir sus claves identificadoras.
   * @param {string} caseType El tipo de case al cual se desea convertir las claves (Camel, Snake, Kebab o Pascal).
   * @returns {object} Retorna el objeto con las claves de propiedades modificadas.
   *
   * @example
   * @example
   * ```typescript
   * const obj = {
   *   user_name: "John",
   *   user_details: {
   *     first_name: "John",
   *     last_name: "Doe",
   *     addresses: [
   *       { street_name: "Main St", city_name: "Metropolis" },
   *       { street_name: "Second St", city_name: "Gotham" },
   *     ],
   *   },
   * };
   *
   * // Convertir a camelCase
   * const camelCaseObj = util.objectKeysToCase(obj, "Camel");
   * console.log(camelCaseObj);
   * // Salida:
   * // {
   * //   userName: "John",
   * //   userDetails: {
   * //     firstName: "John",
   * //     lastName: "Doe",
   * //     addresses: [
   * //       { streetName: "Main St", cityName: "Metropolis" },
   * //       { streetName: "Second St", cityName: "Gotham" },
   * //     ],
   * //   },
   * // }
   *
   * // Convertir a snake_case
   * const snakeCaseObj = util.objectKeysToCase(obj, "Snake");
   * console.log(snakeCaseObj);
   * // Salida:
   * // {
   * //   user_name: "John",
   * //   user_details: {
   * //     first_name: "John",
   * //     last_name: "Doe",
   * //     addresses: [
   * //       { street_name: "Main St", city_name: "Metropolis" },
   * //       { street_name: "Second St", city_name: "Gotham" },
   * //     ],
   * //   },
   * // }
   *
   * // Convertir a kebab-case
   * const kebabCaseObj = util.objectKeysToCase(obj, "Kebab");
   * console.log(kebabCaseObj);
   * // Salida:
   * // {
   * //   "user-name": "John",
   * //   "user-details": {
   * //     "first-name": "John",
   * //     "last-name": "Doe",
   * //     addresses: [
   * //       { "street-name": "Main St", "city-name": "Metropolis" },
   * //       { "street-name": "Second St", "city-name": "Gotham" },
   * //     ],
   * //   },
   * // }
   *
   * // Convertir a PascalCase
   * const pascalCaseObj = util.objectKeysToCase(obj, "Pascal");
   * console.log(pascalCaseObj);
   * // Salida:
   * // {
   * //   UserName: "John",
   * //   UserDetails: {
   * //     FirstName: "John",
   * //     LastName: "Doe",
   * //     Addresses: [
   * //       { StreetName: "Main St", CityName: "Metropolis" },
   * //       { StreetName: "Second St", CityName: "Gotham" },
   * //     ],
   * //   },
   * // }
   *
   * // Convertir a CONSTANT_CASE
   * const constantCaseObj = util.objectKeysToCase(obj, "Constant");
   * console.log(constantCaseObj);
   * // Salida:
   * // {
   * //   USER_NAME: "John",
   * //   USER_DETAILS: {
   * //     FIRST_NAME: "John",
   * //     LAST_NAME: "Doe",
   * //     ADDRESSES: [
   * //       { STREET_NAME: "Main St", CITY_NAME: "Metropolis" },
   * //       { STREET_NAME: "Second St", CITY_NAME: "Gotham" },
   * //     ],
   * //   },
   * // }
   *
   * // Convertir a dot.case
   * const dotCaseObj = util.objectKeysToCase(obj, "Dot");
   * console.log(dotCaseObj);
   * // Salida:
   * // {
   * //   "user.name": "John",
   * //   "user.details": {
   * //     "first.name": "John",
   * //     "last.name": "Doe",
   * //     addresses: [
   * //       { "street.name": "Main St", "city.name": "Metropolis" },
   * //       { "street.name": "Second St", "city.name": "Gotham" },
   * //     ],
   * //   },
   * // }
   *
   * // Ejemplo con allowDuplicates activado
   * const objWithDuplicates = {
   *   user_name: "John",
   *   userName: "Jane", // Clave que se convertirá a "userName" (duplicada)
   * };
   *
   * const convertedObjWithDuplicates = util.objectKeysToCase(objWithDuplicates, "Camel", true);
   * console.log(convertedObjWithDuplicates);
   * // Salida:
   * // {
   * //   userName: "Jane", // El último valor sobrescribe al primero
   * // }
   *
   * // Ejemplo con allowDuplicates desactivado (lanzará un error)
   * try {
   *   const convertedObjWithoutDuplicates = util.objectKeysToCase(objWithDuplicates, "Camel");
   * } catch (error) {
   *   console.error(error.message); // Salida: "Duplicate key detected after conversion: userName"
   * }
   * ```
   */
  public objectKeysToCase(
    objBase: object,
    caseType: TStrCase,
    allowDuplicates: boolean = false
  ): object {
    if (!this.isObject(objBase, false))
      throw new Error(`${objBase} is not object valid`);
    // Usamos una pila para manejar la iteración en lugar de recursión
    const stack: Array<{ obj: object; result: object }> = [];
    const result = {} as object;
    // Inicializamos la pila con el objeto base
    stack.push({ obj: objBase, result });
    while (stack.length > 0) {
      const { obj, result: currentResult } = stack.pop()!;
      for (const key in obj) {
        //solo se aplica a propiedades definidas en el objeto (no prototipos ni herencias artesanales)
        if (obj.hasOwnProperty(key)) {
          const keyC = this.convertStringToCase(key, caseType);
          // Verificamos si la clave ya existe en el resultado
          if (!allowDuplicates && currentResult.hasOwnProperty(keyC)) {
            throw new Error(`Duplicate key detected after conversion: ${keyC}`);
          }
          const value = obj[key];
          if (this.isObject(value)) {
            // Si el valor es un objeto, lo agregamos a la pila para procesarlo después
            const nestedResult = {} as object;
            currentResult[keyC] = nestedResult;
            stack.push({ obj: value, result: nestedResult });
          } else if (Array.isArray(value)) {
            // Si el valor es un array, procesamos cada elemento
            currentResult[keyC] = value.map((item) =>
              this.isObject(item)
                ? this.objectKeysToCase(item, caseType, allowDuplicates)
                : item
            );
          } else {
            // Si el valor es un primitivo, lo copiamos directamente
            currentResult[keyC] = value;
          }
        }
      }
    }
    return result;
  }
  /**
   * Convierte una instancia en un objeto literal, eliminando funciones,
   * constructores y propiedades que tengan el prefijo `"_"` (que indica privado),
   * así como las propiedades especificadas en la configuración `keyOrKeysPathForDelete`.
   *
   * ❗ Este método está diseñado para la conversión de instancias, pero también puede
   * usarse para convertir objetos literales a objetos literales, sin clonación. ❗
   *
   * @param {object} obj - La instancia a convertir.
   * @param {object} [option] - Configuración opcional para el proceso de conversión con las siguientes propiedades:
   * - `isDeletePrivates = false` Determina si se eliminan propiedades (privadas) con prefijo `"_"`
   * - `keyOrKeysPathForDelete = []` claves identificadoras de propiedades que deben eliminarse.
   * - `charSeparator = "."` El carácter separador a utilizar entre los elementos del path.
   * @returns {object} - Retorna la instancia literal.
   *
   * @example
   * ```typescript
   * const obj = {
   * a: 1,
   * _b: 2,
   * c: () => {},
   * d: [1, () => {}, Symbol("test")],
   * e: { f: 3, g: () => {} }
   * };
   *
   * const result = mutateToLiteralObject(obj, {
   * isDeletePrivates: true,
   * keyOrKeysPathForDelete: ["e.f"]
   * });
   *
   * console.log(result);
   * // Salida: { a: 1, d: [1], e: { g: () => {} } }
   * ```
   *
   */
  public mutateToLiteralObject<TObj extends object, TExtractObj extends object>(
    obj: TObj,
    option: {
      /**`= false` Determina si se eliminan propiedades (privadas) con prefijo `"_"` */
      isDeletePrivates?: boolean;
      /**`= []` claves identificadoras de propiedades que deben eliminarse. */
      keyOrKeysPathForDelete?: string | string[];
      /**`= "."` El carácter separador a utilizar entre los elementos del path. */
      charSeparator?: string;
    }
  ): TExtractObj {
    if (!this.isObject(obj, true)) {
      throw new Error(`${obj} is not object valid`);
    }
    //constructor de opciones
    let op = this.isObject(option, true) ? option : ({} as typeof option); //default vacio
    op = {
      ...op, //opciones adicionales no documentadas (si las hay)
      isDeletePrivates: this.convertToBoolean(op.isDeletePrivates),
      keyOrKeysPathForDelete: this.isArray(op.keyOrKeysPathForDelete, true)
        ? [...new Set(op.keyOrKeysPathForDelete as string[])] // Eliminar duplicados
        : this.isString(op.keyOrKeysPathForDelete)
        ? [op.keyOrKeysPathForDelete]
        : ([] as any[]), //predefinido []
      charSeparator: this.isString(op.charSeparator)
        ? op.charSeparator
        : this.charSeparatorLogicPath,
    };
    const { isDeletePrivates, keyOrKeysPathForDelete, charSeparator: sp } = op;
    const keysPathForDelete = keyOrKeysPathForDelete as string[]; //para dejar tipado de array
    // Crear una pila para manejar la iteración
    const stack: Array<{ target: any; source: any; path: string }> = [];
    const result = {};
    // Inicializar la pila con el objeto raíz
    stack.push({ target: result, source: obj, path: "" });
    while (stack.length > 0) {
      const { target, source, path } = stack.pop()!;
      for (const key in source) {
        if (this.isFunction(source[key]) || typeof source[key] === "symbol") {
          continue; // Eliminar funciones y símbolos
        }
        if (isDeletePrivates && key.startsWith("_")) {
          continue; // Eliminar propiedades privadas
        }
        // Verificar si la clave está en keyOrKeysPathForDelete
        const fullPath = path ? `${path}${sp}${key}` : key;
        const shouldDelete = keysPathForDelete.some((keyPath) => {
          return keyPath === fullPath;
        });
        if (shouldDelete) {
          continue; // Eliminar propiedades específicas
        }
        // Manejar arrays
        if (Array.isArray(source[key])) {
          target[key] = (source[key] as any[]).filter(
            (item) => !this.isFunction(item) && typeof item !== "symbol"
          );
        } else if (this.isObject(source[key], true)) {
          // Crear un nuevo objeto para el subobjeto
          target[key] = {};
          // Agregar el subobjeto a la pila para procesarlo después
          stack.push({
            target: target[key],
            source: source[key],
            path: fullPath,
          });
        } else {
          // Copiar el valor de la propiedad
          target[key] = source[key];
        }
      }
    }
    return result as any;
  }
  /**
   * Extrae todas las propiedades de tipo función de un objeto (o subobjetos) y devuelve un nuevo objeto literal
   * que contiene solo esas funciones. Opcionalmente, permite vincular un contexto (`thisBind`) a las funciones extraídas.
   *
   * ⚠ **Importante**:
   * - Este método no modifica el objeto original.
   * - Las funciones extraídas pueden ser vinculadas a un contexto específico usando `thisBind`.
   * - El método maneja objetos anidados de forma iterativa, evitando problemas de desbordamiento de pila (`stack overflow`).
   *
   * @param {object} obj - El objeto del cual se extraerán las propiedades de tipo función.
   * @param {any} thisBind - (Opcional) El contexto al cual se vincularán las funciones extraídas.
   *                         Si se proporciona, las funciones se vincularán a este contexto usando `.bind(thisBind)`.
   * @returns {object} - Un nuevo objeto literal que contiene solo las propiedades de tipo función del objeto original.
   *                     Si el objeto original contiene subobjetos, estos se procesarán recursivamente.
   *
   * @throws {Error} - Lanza un error si `obj` no es un objeto válido.
   *
   * @example
   * ```typescript
   * const obj = {
   *     name: "John",
   *     age: 30,
   *     greet() {
   *         console.log(`Hello, my name is ${this.name}`);
   *     },
   *     address: {
   *         city: "New York",
   *         getCity() {
   *             return this.city;
   *         }
   *     }
   * };
   *
   * const context = { name: "Alice" };
   * const functionsOnly = util.mutateToObjectLiteralOnlyFn(obj, context);
   *
   * console.log(functionsOnly);
   * // Salida:
   * // {
   * //   greet: [Function: bound greet],
   * //   address: {
   * //     getCity: [Function: bound getCity]
   * //   }
   * // }
   *
   * functionsOnly.greet(); // "Hello, my name is Alice"
   * console.log(functionsOnly.address.getCity()); // "New York"
   * ```
   *
   * @example
   * ```typescript
   * // Ejemplo sin contexto (`thisBind`)
   * const obj = {
   *     sayHello() {
   *         console.log("Hello!");
   *     }
   * };
   *
   * const functionsOnly = util.mutateToObjectLiteralOnlyFn(obj);
   * functionsOnly.sayHello(); // "Hello!"
   * ```
   *
   * @example
   * ```typescript
   * // Ejemplo con subobjetos
   * const obj = {
   *     utils: {
   *         add(a: number, b: number) {
   *             return a + b;
   *         },
   *         multiply(a: number, b: number) {
   *             return a * b;
   *         }
   *     }
   * };
   *
   * const functionsOnly = util.mutateToObjectLiteralOnlyFn(obj);
   * console.log(functionsOnly.utils.add(2, 3)); // 5
   * console.log(functionsOnly.utils.multiply(2, 3)); // 6
   * ```
   */
  public mutateToObjectLiteralOnlyFn<
    TObj extends object,
    TExtractObj extends object
  >(obj: TObj, thisBind?: any): TExtractObj {
    if (!this.isObject(obj)) throw new Error(`${obj} is not object valid`);
    const stack: Array<{ target: any; source: any }> = [];
    const result = {};
    // Inicializar la pila con el objeto raíz
    stack.push({ target: result, source: obj });
    while (stack.length > 0) {
      const { target, source } = stack.pop()!;
      for (const key in source) {
        if (this.isFunction(source[key]) && key !== "constructor") {
          // Si es una función, agregarla al objeto target
          target[key] = this.isObject(thisBind)
            ? (source[key] as Function).bind(thisBind)
            : source[key];
        } else if (this.isObject(source[key])) {
          // Si es un objeto, crear un nuevo objeto en target y agregarlo a la pila
          target[key] = {};
          stack.push({ target: target[key], source: source[key] });
        }
      }
    }
    return result as any;
  }
  /**
   * verificar si un path coincide con el keyPath (soporta comodines),
   * para los métodos de búsqueda de subpropiedades como `findObjectProperty()`
   *  y `findAllObjectProperties()`
   *
   * @param charSeparator El carácter separador a utilizar entre los elementos del path.
   * @param wildcard El carácter que representa el comodín.
   * @param useWildcards si está habilitado el comodín
   * @param path Fragmento de la ruta (según iteración)
   * @param keyPath Fragmento de la ruta sin iterar
   * @returns si el path coincidió
   */
  private isPathMatch(
    charSeparator: string,
    wildcard: string,
    useWildcards: boolean,
    path: string,
    keyPath: string
  ): boolean {
    // Determinar búsqueda básica
    if (!useWildcards) return path.includes(keyPath);
    // Eliminar todas las ocurrencias de *0 en el keyPath
    keyPath = keyPath
      .replace(
        new RegExp(
          `\\${charSeparator}\\${wildcard}0(\\${charSeparator}|$)`,
          "g"
        ),
        `${charSeparator}`
      )
      .replace(new RegExp(`^\\${wildcard}0\\${charSeparator}`, "g"), "");
    // Convertir el keyPath con comodines en una expresión regular
    const regexPattern = keyPath
      .replace(/\./g, `\\${charSeparator}`)
      .replace(new RegExp(`\\${wildcard}\\d*`, "g"), (match) => {
        const num = parseInt(match.substring(1));
        if (isNaN(num) || num === 1) return `[^\\${charSeparator}]+`; // Comodín sin número, cualquier cosa
        return `(?:[^\\${charSeparator}]+\\${charSeparator}){${
          num - 1
        }}[^\\${charSeparator}]+`;
        //return `(?:[^\\${charSeparator}]+\\${charSeparator}){${num}}[^\\${charSeparator}]+`;
      });
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(path);
  }
  /**
   * verifica la fiabilidad del path con comodines para los métodos de
   * búsqueda de subpropiedades como `findObjectProperty()` y `findAllObjectProperties()`
   *
   * @param charSeparator El carácter separador a utilizar entre los elementos del path.
   * @param wildcard El carácter que representa el comodín.
   * @param keyPath Fragmento de la ruta sin iterar
   * @returns si los comodines en el path tienen formato valido
   */
  private isWildcardValid(
    charSeparator: string,
    wildcard: string,
    keyPath: string
  ): boolean {
    const segments = keyPath.split(charSeparator);
    for (const segment of segments) {
      // Verificar si el segmento contiene un comodín
      if (segment.includes(wildcard)) {
        // Es Comodín0 al inicio del path
        if (segment === `${wildcard}0` && segments.indexOf(segment) === 0)
          throw new Error(
            `Invalid use of wildcard '${wildcard}' at the start of the keyPath: ${keyPath}`
          );
        // Es Número antes del comodín (por ejemplo, "2*")
        if (new RegExp(`^\d+\\${wildcard}`).test(segment))
          throw new Error(
            `Invalid use of wildcard '${wildcard}' with number before it in segment '${segment}': ${keyPath}`
          );
        // Es Comodín con número negativo (por ejemplo, "*-1")
        const numStr = segment.substring(1); // Extraer el número después del *
        if (numStr.length > 0) {
          const num = parseInt(numStr);
          if (isNaN(num) || num < 0)
            throw new Error(
              `Invalid use of wildcard '${wildcard}' with invalid number '${numStr}' in segment '${segment}': ${keyPath}`
            );
        }
      }
    }
    return true; // Si pasa todas las validaciones, retornar true
  }
  /**
   * Busca una propiedad en un objeto (o subobjetos) usando una ruta de claves (`keyPath`).
   * Si la propiedad no se encuentra, devuelve un valor predeterminado (`option.defaultReturnObj`).
   *
   * ⚠ **Importante**:
   * - La búsqueda se basa en una ruta (path) parcial de la subpropiedad. Si se desconoce el nombre de alguna propiedad padre (también llamado subnivel), se puede usar el comodín `"*"`. Si son varios subniveles desconocidos, se puede usar un multiplicador de comodín como `"*3"` (significa 3 niveles desconocidos).
   * - El uso del multiplicador siempre debe ser un número entero positivo. Si se usa `"*0"`, esto anula el comodín. Por ejemplo, si el fragmento de path es `"a.b.*0.d"`, se asume como `"a.b.d"` (omitiéndose el comodín).
   * - El comodín `"*0"` **no puede inicializar el path**. Por ejemplo, el path `"0*.b.c.d"` es inválido.
   * - El comodín utilizado es `"*"`, y el `charSeparator` no puede asignársele el mismo carácter.
   * - Si existen varias subpropiedades con el mismo fragmento de path, se selecciona la última de acuerdo al orden del array de todos los paths del objeto. **Recuerda**: no se toma en cuenta el nivel de profundidad, sino el orden del array de los paths.
   *
   * @param {object} objBase  El objeto en el cual se buscará la propiedad.
   * @param {string} keyPath  La ruta de claves que identifica la propiedad a buscar (por ejemplo, `"a.b.c"`).
   * @param {object} [option]  Configuración opcional para la búsqueda:
   *   - `defaultReturnObj = this.dfValue`   El valor predeterminado a devolver si la propiedad no se encuentra.
   *   - `charSeparator = this.charSeparatorLogicPath` - El carácter separador a utilizar entre los elementos del path.
   *   - `allPathsBase = this.getPropertyPathsOfObject(objBase, {charSeparator})`  Array completo de paths en caso de ya tenerlos para no procesar nuevamente. Por defecto, se calcula automáticamente usando `getPropertyPathsOfObject()`.
   * @returns {any} - Retorna el valor de la propiedad si se encuentra, o `option.defaultReturnObj` si no se encuentra.
   * @throws {Error} - Lanza un error si `objBase` no es un objeto válido o si `keyPath` no es una cadena válida.
   * @throws {Error} - Lanza un error si `charSeparator` es igual al comodín `"*"`.
   * @throws {Error} - Lanza un error si el comodín `"*0"` se usa al inicio del path.
   * @throws {Error} - Lanza un error si el multiplicador del comodín no es un número entero positivo.
   *
   * @example
   * ```typescript
   * const obj = {
   *   a: {
   *     b: {
   *       c: 42
   *     }
   *   }
   * };
   *
   * // Ejemplo básico:
   * const value = util.findObjectProperty(obj, "a.b.c");
   * console.log(value); // Salida: 42
   *
   * // Ejemplo con valor predeterminado:
   * const notFound = util.findObjectProperty(obj, "x.y.z", { defaultReturnObj: "Not found" });
   * console.log(notFound); // Salida: "Not found"
   *
   * // Ejemplo con comodín:
   * const obj2 = {
   *   a: {
   *     b: [
   *       { c: 1 },
   *       { c: 2 },
   *       { c: 3 }
   *     ]
   *   }
   * };
   *
   * const valueWithWildcard = util.findObjectProperty(obj2, "a.b.*.c");
   * console.log(valueWithWildcard); // Salida: 3 (último elemento que coincide con el path)
   *
   * // Ejemplo con multiplicador de comodín:
   * const obj3 = {
   *   a: {
   *     b: {
   *       c: {
   *         d: 100
   *       }
   *     }
   *   }
   * };
   *
   * const valueWithMultiplier = util.findObjectProperty(obj3, "a.*2.d");
   * console.log(valueWithMultiplier); // Salida: 100
   * ```
   */
  public findObjectProperty(
    objBase: object,
    keyPath: string,
    option?: {
      /** `= this.dfValue` El valor retornado en caso de no encontrar la propiedad en el objeto. */
      defaultReturnObj?: any;
      /** `= "."` El carácter separador a utilizar entre los elementos del path. */
      charSeparator?: string;
      /**`= this.getPropertyPathsOfObject(objBase, {charSeparator})` Array completo de paths en caso de ya tenerlos para no procesar nuevamente*/
      allPathsBase?: string[];
    }
  ): any {
    if (!this.isObject(objBase))
      throw new Error(`${objBase} is not object valid`);
    if (!this.isString(keyPath))
      throw new Error(`${keyPath} is not key path valid`);
    // Constructor de opciones
    let op = this.isObject(option, true) ? option : ({} as typeof option);
    op = {
      defaultReturnObj: !this.isUndefined(op.defaultReturnObj)
        ? op.defaultReturnObj
        : this.dfValue,
      charSeparator: this.isString(op.charSeparator)
        ? op.charSeparator
        : this.charSeparatorLogicPath,
      allPathsBase: this.isArray(op.allPathsBase)
        ? op.allPathsBase
        : this.getPropertyPathsOfObject(objBase, {
            charSeparator: this.isString(op.charSeparator)
              ? op.charSeparator
              : this.charSeparatorLogicPath,
          }),
    };
    const {
      defaultReturnObj: dfValue,
      charSeparator,
      allPathsBase: allPaths,
    } = op;
    //configuración comodín
    const wildcard = "*";
    if (charSeparator === wildcard)
      throw new Error(`character separator cannot be ${wildcard} `);
    const useWildcard =
      new RegExp(`\\${wildcard}`).test(keyPath) &&
      this.isWildcardValid(charSeparator, wildcard, keyPath);
    // Buscar el path que coincida con el keyPath
    const foundPath = allPaths.find((path) =>
      this.isPathMatch(charSeparator, wildcard, useWildcard, path, keyPath)
    );
    // Si se encuentra el path, obtener el valor de la propiedad
    if (foundPath) {
      const keys = foundPath.split(charSeparator);
      let currentObj = objBase;
      // Recorrer el path para obtener el valor
      for (const key of keys) {
        if (currentObj && key in currentObj) {
          currentObj = currentObj[key];
        } else {
          return dfValue; // Si no existe la propiedad, devolver el valor predeterminado
        }
      }
      return currentObj; // Devolver el valor encontrado
    }
    return dfValue; // Si no se encuentra el path, devolver el valor predeterminado
  }
  /**
   * Busca todas las propiedades en un objeto (o subobjetos) que coincidan con uno o más fragmentos de paths (`keyPaths`).
   * Retorna un array con los valores de todas las propiedades que coinciden.
   *
   * ⚠ **Importante**:
   * - La búsqueda se basa en rutas (paths) parciales de las subpropiedades. Si se desconoce el nombre de alguna propiedad padre (también llamado subnivel), se puede usar el comodín `"*"`. Si son varios subniveles desconocidos, se puede usar un multiplicador de comodín como `"*3"` (significa 3 niveles desconocidos).
   * - El uso del multiplicador siempre debe ser un número entero positivo. Si se usa `"*0"`, esto anula el comodín. Por ejemplo, si el fragmento de path es `"a.b.*0.d"`, se asume como `"a.b.d"` (omitiéndose el comodín).
   * - El comodín `"*0"` **no puede inicializar el path**. Por ejemplo, el path `"0*.b.c.d"` es inválido.
   * - El comodín utilizado es `"*"`, y el `charSeparator` no puede asignársele el mismo carácter.
   * - Si existen varias subpropiedades con el mismo fragmento de path, se incluyen todas en el array de resultados.
   *
   * @param {object} objBase - El objeto en el cual se buscarán las propiedades.
   * @param {string | string[]} keyPaths - La ruta o rutas de claves que identifican las propiedades a buscar (por ejemplo, `"a.b.c"` o `["a.b.c", "x.y.z"]`).
   * @param {object} [option] - Configuración opcional para la búsqueda:
   *   - `defaultReturnObj = this.dfValue`   El valor predeterminado a devolver si la propiedad no se encuentra.
   *   - `charSeparator = this.charSeparatorLogicPath` - El carácter separador a utilizar entre los elementos del path.
   *   - `allPathsBase = this.getPropertyPathsOfObject(objBase, {charSeparator})`  Array completo de paths en caso de ya tenerlos para no procesar nuevamente. Por defecto, se calcula automáticamente usando `getPropertyPathsOfObject()`.
   * @returns {any[]} - Retorna un array con los valores de todas las propiedades que coinciden con los fragmentos de paths proporcionados.
   * @throws {Error} - Lanza un error si `objBase` no es un objeto válido o si `keyPaths` no es una cadena o un array de cadenas válido.
   * @throws {Error} - Lanza un error si `charSeparator` es igual al comodín `"*"`.
   * @throws {Error} - Lanza un error si el comodín `"*0"` se usa al inicio del path.
   * @throws {Error} - Lanza un error si el multiplicador del comodín no es un número entero positivo.
   *
   * @example
   * ```typescript
   * const obj = {
   *   a: {
   *     b: {
   *       c: 42,
   *       d: 100
   *     },
   *     x: {
   *       y: {
   *         z: 200
   *       }
   *     }
   *   }
   * };
   *
   * // Ejemplo básico:
   * const values = util.findAllObjectProperties(obj, "a.b.*");
   * console.log(values); // Salida: [42, 100] (todas las propiedades bajo "a.b")
   *
   * // Ejemplo con múltiples fragmentos:
   * const valuesMultiple = util.findAllObjectProperties(obj, ["a.b.c", "a.x.y.z"]);
   * console.log(valuesMultiple); // Salida: [42, 200] (coincidencias para ambos fragmentos)
   *
   * // Ejemplo con comodín:
   * const obj2 = {
   *   a: {
   *     b: [
   *       { c: 1 },
   *       { c: 2 },
   *       { c: 3 }
   *     ]
   *   }
   * };
   *
   * const valuesWithWildcard = util.findAllObjectProperties(obj2, "a.b.*.c");
   * console.log(valuesWithWildcard); // Salida: [1, 2, 3] (todas las coincidencias)
   * ```
   */
  public findAllObjectProperties(
    objBase: object,
    keyPaths: string | string[],
    option?: {
      /** `= this.dfValue` El valor retornado en caso de no encontrar la propiedad en el objeto. */
      defaultReturnObj?: any;
      /** `= "."` El carácter separador a utilizar entre los elementos del path. */
      charSeparator?: string;
      /**`= this.getPropertyPathsOfObject(objBase, {charSeparator})` Array completo de paths en caso de ya tenerlos para no procesar nuevamente*/
      allPathsBase?: string[];
    }
  ): any[] {
    if (!this.isObject(objBase))
      throw new Error(`${objBase} is not object valid`);
    if (!this.isArray(keyPaths) && !this.isString(keyPaths))
      throw new Error(`${keyPaths} is not key or keys path valid`);
    keyPaths = Array.isArray(keyPaths) ? keyPaths : [keyPaths];
    // Constructor de opciones
    let op = this.isObject(option, true) ? option : ({} as typeof option);
    op = {
      defaultReturnObj: !this.isUndefined(op.defaultReturnObj)
        ? op.defaultReturnObj
        : this.dfValue,
      charSeparator: this.isString(op.charSeparator)
        ? op.charSeparator
        : this.charSeparatorLogicPath,
      allPathsBase: this.isArray(op.allPathsBase)
        ? op.allPathsBase
        : this.getPropertyPathsOfObject(objBase, {
            charSeparator: this.isString(op.charSeparator)
              ? op.charSeparator
              : this.charSeparatorLogicPath,
          }),
    };
    const {
      defaultReturnObj: dfValue,
      charSeparator,
      allPathsBase: allPaths,
    } = op;
    //configuración comodín
    const wildcard = "*";
    if (charSeparator === wildcard)
      throw new Error(`character separator cannot be ${wildcard} `);
    return keyPaths.flatMap((keyPath) => {
      const useWildcard =
        new RegExp(`\\${wildcard}`).test(keyPath) &&
        this.isWildcardValid(charSeparator, wildcard, keyPath);
      // Buscar el path que coincida con el keyPath
      const foundPaths = allPaths.filter((path) =>
        this.isPathMatch(charSeparator, wildcard, useWildcard, path, keyPath)
      );
      return foundPaths.map((foundPath) => {
        // Si se encuentra el path, obtener el valor de la propiedad
        if (foundPath) {
          const keys = foundPath.split(charSeparator);
          let currentObj = objBase;
          // Recorrer el path para obtener el valor
          for (const key of keys) {
            if (currentObj && key in currentObj) {
              currentObj = currentObj[key];
            } else {
              return dfValue; // Si no existe la propiedad, devolver el valor predeterminado
            }
          }
          return currentObj; // Devolver el valor encontrado
        }
        return dfValue; // Si no se encuentra el path, devolver el valor predeterminado
      });
    });
  }
  /**
   * Fusiona 2 objetos a nivel profundo, donde el nuevo objeto será fusionado
   * al objeto base. Las propiedades de nuevo objeto serán sobreescritas en las
   * propiedades de en el objeto base de acuerdo a la configuración `mode`.
   *
   * ⚠ **No** aplica para profundidad en arrays (ni en propiedades ni subpropiedades).
   *
   * @param {[T, T?]} tObjToMerge Tupla que representa:
   *   - `tObjToMerge[0]`: Objeto base al cual se fusionará el nuevo objeto.
   *   - `tObjToMerge[1]`: Objeto a fusionar con el objeto base.
   * @param {object} option - Configuración para el proceso de fusión:
   *   - `mode`: Modo de fusión par alos objetos
   *   - `isNullAsUndefined` Determina si se debe asumir que
   *     el valor `null` tiene el mismo peso comparativo que el valor `undefined`.
   * @returns {T} Retorna el objeto fusionado.
   *
   * **⚠** casos especiales de retorno:
   * - Si el objeto base no es de tipo objeto retorna el objeto a fusionar
   * - Si el objeto a fusionar no es de tipo objeto retorna el base
   * - Si ninguno es de tipo objeto, retorna el contenido de objeto base
   *
   * @example
   * ````typescript
   * let baseObj;
   * let newObj;
   * let r;
   *
   * // fusion en modo "soft"
   * baseObj = {
   *   p1: "does not spanish",
   *   p2: 31,
   *   p3: true,
   *   p4: 255,
   *   p5: "A",
   * },
   * newObj = {
   *   p1: "ahora si es español",
   *   p2: 31,
   *   p3: false,
   *   p4: undefined,
   *   p5: null,
   * }
   * r = deepMergeObjects([baseObj, newObj], {mode: "soft"});
   * console.log(r); //Salida:
   * //{
   * //  p1: "ahora si es español", //se fusionó
   * //  p2: 31, //se fusionó
   * //  p3: false, //se fusionó
   * //  p4: 255, //al ser "soft" no lo debe fusionar
   * //  p5: null, //al ser "soft" y no esta habilitado `isNullAsUndefined` si debe fusionarlo
   * //}
   *
   * // fusion en modo "hard"
   * baseObj = {
   *   p1: "does not spanish",
   *   p2: 31,
   *   p3: true,
   *   p4: 255,
   *   p5: "A",
   * },
   * newObj = {
   *   p1: "ahora si es español",
   *   p2: 31,
   *   p3: false,
   *   p4: undefined,
   *   p5: null,
   * }
   * r = deepMergeObjects([baseObj, newObj], {mode: "hard"});
   * console.log(r); //Salida:
   * //{
   * //  p1: "ahora si es español", //se fusionó
   * //  p2: 31, //se fusionó
   * //  p3: false, //se fusionó
   * //  p4: undefined, //al ser "hard" lo fusiona
   * //  p5: null, //al ser "hard" lo fusiona
   * //}
   *
   * ````
   *
   */
  public deepMergeObjects<T>(
    tObjToMerge: [T, T?],
    option: {
      /**
       * determina el modo de fusion
       *
       * - modo `"soft"`: sobreescribe la propiedad en
       * `objBase` solo si esta misma propiedad
       * en `objNew` **no** tiene valor como
       * `undefined` o `null`
       *
       * - modo `"hard"`: sobreescribe la propiedad en
       * `objBase` sin importar si el valor es
       * `undefined` o `null`
       */
      mode: "soft" | "hard";
      /**( solo en modo `"soft"`) determina
       * si se debe asumir que el valor `null` tiene el mismo peso
       * comparativo que el valor `undefined`
       */
      isNullAsUndefined?: boolean;
    }
  ): T {
    if (!this.isTuple(tObjToMerge, 2))
      throw new Error(`${tObjToMerge} is not tuple of objects valid`);
    // Constructor de opciones
    let op = this.isObject(option, true) ? option : ({} as typeof option);
    op = {
      mode: op.mode === "soft" || op.mode === "hard" ? op.mode : "hard",
      isNullAsUndefined: this.isBoolean(op.isNullAsUndefined)
        ? op.isNullAsUndefined
        : false,
    };
    const { mode, isNullAsUndefined } = op;
    // Iniciar proceso
    let [objBase, objNew] = tObjToMerge;
    const isObjBase = this.isObject(objBase, true);
    const isObjNew = this.isObject(objNew, true);
    // Casos especiales (alguno o ambos no son objetos)
    if (!isObjBase || !isObjNew) {
      if (!isObjBase && isObjNew) return objNew;
      if (!isObjNew && isObjBase) return objBase;
      return objBase;
    }
    // Pila para manejar la recursividad
    const stack: Array<{ base: any; new: any; target: any }> = [];
    const result = {} as T;
    stack.push({ base: objBase, new: objNew, target: result });
    while (stack.length > 0) {
      const { base, new: newObj, target } = stack.pop()!;
      const keysB = Object.keys(base);
      const keysN = Object.keys(newObj);
      const uKeys = [...new Set([...keysB, ...keysN])];
      for (const key of uKeys) {
        const propB = base[key];
        const propN = newObj[key];
        if (this.isObject(propB, true) && this.isObject(propN, true)) {
          target[key] = {};
          stack.push({ base: propB, new: propN, target: target[key] });
        } else {
          if (mode === "soft") {
            target[key] =
              this.isUndefined(propB) ||
              (isNullAsUndefined && this.isNull(propB))
                ? propN
                : this.isUndefined(propN) ||
                  (isNullAsUndefined && this.isNull(propN))
                ? propB
                : propN;
          } else if (mode === "hard") {
            const isPropB = key in base;
            const isPropN = key in newObj;
            target[key] = isPropN ? propN : propB;
          } else {
            throw new Error(`${mode} is not mode for merge valid`);
          }
        }
      }
    }
    return result;
  }
  /**
   * Convierte un array de tuplas tipo entry (`[key, value]`) en un objeto.
   *
   * - la tupla debe ser de tipo `[key, value]` donde `key` es un tipo derivado de string.
   * - ❗el array de tuplas puede estar vacio❗, en ese caso retorná un objeto literal `{}`
   *
   * @param {Array<[any, any]>} aEntryTuple - El array de tuplas que se va a convertir en un objeto. Cada tupla consta de dos elementos de tipo `[key, value]`.
   * @throws {Error} - Lanza un error si `arrayOfEntries` no es un array de tuplas válido.
   * @throws {Error} - Lanza un error si `arrayOfEntries` contiene tuplas no validas (las tuplas deben ser: `[key, value]`).
   * @returns {object} - Retorna un nuevo objeto donde cada propiedad es una tupla del array de entrada.
   *
   * @example
   * ```
   * const arrayOfEntries = [["key1", "value1"], ["key2", "value2"]];
   * const obj = arrayEntriesToObject(arrayOfEntries);
   * console.log(obj); // salida: { key1: "value1", key2: "value2" }
   * ```
   */
  public arrayEntriesToObject(aEntryTuple: Array<[any, any]>): object {
    //❗ se permite arrays vacios❗
    if (!this.isArrayTuple(aEntryTuple, 2, true))
      throw new Error(`${aEntryTuple} contain tuples not valid`);
    const obj = aEntryTuple.reduce((a_obj, [key, value]) => {
      // la key debe ser un identificador
      if (this.isUndefinedOrNull(key))
        throw new Error(`${key} contain tuples not valid`);
      a_obj[key] = value;
      return a_obj;
    }, {}); //si el array es vacio retornaria un objeto literal vacio
    return obj;
  }
  /**
   * Convierte un iterable de tuplas en un objeto.
   *
   * @param {IterableIterator<[any, any]>} entry - El iterable de tuplas que se va a convertir en un objeto.
   * @throws {Error} - Lanza un error si `entries` no es un iterable de tuplas válido.
   * @returns {object} - Retorna un nuevo objeto donde cada propiedad es una tupla del iterable de entrada.
   *
   * @example
   * ```typescript
   * const map = new Map([["key1", "value1"], ["key2", "value2"]]);
   * const entries = map.entries();
   * const obj = entriesToObject(entries);
   * console.log(obj); // salida: { key1: "value1", key2: "value2" }
   * ```
   */
  public entriesToObject(entry: IterableIterator<[any, any]>): object {
    //⚠ Obligatorio el testeo primitivo
    if (typeof entry !== "object")
      throw new Error(`${entry} is not entries (:IterableIterator) valid`);
    const arrayOfEntries = Array.from(entry);
    const obj = this.arrayEntriesToObject(arrayOfEntries);
    return obj;
  }
  /**
   * Convierte un objeto Map en un objeto literal.
   *
   * @param {Map<any, any>} map - El objeto Map que se va a convertir en un objeto literal.
   * @throws {Error} - Lanza un error si `map` no es una instancia de Map.
   * @returns {object} - Retorna un nuevo objeto literal que tiene las mismas propiedades que el objeto Map de entrada.
   *
   * @example
   * ```typescript
   * const map = new Map([["key1", "value1"], ["key2", "value2"]]);
   * const obj = mapToObject(map);
   * console.log(obj); // salida: { key1: "value1", key2: "value2" }
   * ```
   */
  public mapToObject(map: Map<any, any>): object {
    if (!(map instanceof Map)) throw new Error(`${map} is not map valid`);
    const entries = map.entries();
    const obj = this.entriesToObject(entries);
    return obj;
  }
  /**
   * Congela un objeto para prevenir modificaciones en sus propiedades, con opcion de niveles profundos si sus propiedades son a su vez objetos.
   *
   * ⚠ Puede ser usado con array pero se aconseja usar el metodo `freezeArray()`
   *
   * @param {TObject} obj - El objeto que se va a congelar.
   * @param {boolean} isAllowDeepLevel - Determina si se debe congelar el objeto a nivel profundo. Por defecto es `true`, lo que significa que se congelarán todas las propiedades del objeto que sean objetos.
   * @returns {TObject} - Retorna el objeto congelado, si no es un objeto, retorna el valor sin modificaciones.
   *
   * @example
   * ```typescript
   * const obj = { a: 1, b: { c: 2 } };
   * const frozenObj = freezeObject(obj);
   * //verifica si esta congelado
   * console.log(Object.isFrozen(frozenObj)); // salida: true
   * console.log(Object.isFrozen(frozenObj.b)); // salida: true
   * ```
   */
  public freezeObject<TObject extends object | any[]>(
    obj: TObject,
    isAllowDeepLevel = true
  ): TObject {
    // Verificación primitiva (incluye arrays)
    if (typeof obj !== "object" || this.isNull(obj)) return obj;
    // Congelar arrays directamente si no se requiere recursividad
    if (Array.isArray(obj) && !isAllowDeepLevel)
      return Object.freeze(obj) as TObject;
    // Pila para manejar la congelación profunda de manera iterativa
    const stack: Array<{ obj: any; parent: any; key: string | number | null }> =
      [];
    stack.push({ obj, parent: null, key: null });
    while (stack.length > 0) {
      const { obj: currentObj, parent, key } = stack.pop()!;
      // Congelar el objeto actual
      Object.freeze(currentObj);
      // Si se requiere congelación profunda, agregar propiedades al stack
      if (isAllowDeepLevel) {
        for (const key in currentObj) {
          if (currentObj.hasOwnProperty(key)) {
            const value = currentObj[key];
            if (this.isObject(value)) {
              stack.push({ obj: value, parent: currentObj, key });
            }
          }
        }
        // Manejo específico para arrays
        if (Array.isArray(currentObj)) {
          for (let i = 0; i < currentObj.length; i++) {
            if (this.isObject(currentObj[i])) {
              stack.push({ obj: currentObj[i], parent: currentObj, key: i });
            }
          }
        }
      }
      // Si hay un padre, asignar el objeto congelado a la propiedad correspondiente
      if (!this.isNull(parent) && !this.isNull(key)) parent[key] = currentObj;
    }
    return obj;
  }
  //█████ Arreglos ██████████████████████████████████████████████████████
  /**
   * Determina si es un array, con la opción de aceptar o no arrays vacíos.`
   *
   * @param {any} value El valor a analizar.
   * @param {boolean} allowEmpty = `false`, Determina si se permite que el array esté vacio `[]`
   * @returns {boolean} Retorna `true` si el valor es un array, `false` de lo contrario.
   *
   * @example
   * ```typescript
   * let a;
   *
   * //array vacio
   * a = [];
   * isArray(a, true); // salida `true` (es un array válido aunque esté vacío)
   * isArray(a, false); // salida `false` (NO es un array válido porque está vacío)
   * !isArray(a); // salida `true` permite vacios y cualquier tipo de valor menos array
   * !isArray(a, true) //salida `false` niega permitir vacios
   * !isArray(a, false) //salida `true` niega a negar vacios (vacios aprobados)
   *
   * //ejemplo objeto:
   * a = {};
   * console.log(isObject(a)); // salida `false` (un objeto (vacío o poblado) no lo considera array)
   * ```
   */
  public isArray(value: unknown, allowEmpty = false): boolean {
    allowEmpty = this.convertToBoolean(allowEmpty);
    const r = Array.isArray(value) && (allowEmpty || value.length > 0);
    return r;
  }
  /**
   * Permite verificar y transformar (si aún no está transformado) un valor en un array
   * de ese mismo valor, a partir del extracto de esquema de tipo de datos.
   *
   * @param value El valor a transformar.
   * @param extractType El esquema (sencillo o extracto) del tipo de array que
   *        se debe verificar para poder transformar.
   * @param defaultValue `= this.dfValue` Valor por defecto que se asignará si el `value` no
   *        cumple con las condiciones.
   * @param option Opciones adicionales para la validación de tipo de datos.
   *
   * @throws Error `"${extractType} is not extract of types valid"`
   *         Si el esquema proporcionado no es válido.
   *
   * @example
   * ````typescript
   *
   * let result;
   *
   * // Transformando un string a un array de strings
   * result = instance.castArrayByConditionType("hello", "string");
   * console.log(result); // Salida: ["hello"]
   *
   * // Manteniendo un array existente si cumple con el tipo
   * result = instance.castArrayByConditionType(["item1", "item2"], "string");
   * console.log(result); // Salida: ["item1", "item2"]
   *
   * // Retornando el valor por defecto si el tipo no es adecuado
   * result = instance.castArrayByConditionType(42, "string");
   * console.log(result); // Salida: this.dfValue
   *
   * // Retornando el valor por defecto (personalizado) si el tipo no es adecuado
   * result = instance.castArrayByConditionType(true, "string", ["hola"]);
   * console.log(result); // Salida: ["hola"]
   * ````
   */
  public castArrayByConditionType<TItem>(
    value: TItem | TItem[],
    extractType: TExtValueType,
    defaultValue: TItem[] = this.dfValue,
    option?: IValueTypeOption
  ): TItem[] {
    let r: TItem[];
    if (
      !this.isValueType(extractType, ["string", "array", "object"], {
        allowObjectEmpty: true,
        allowArrayEmpty: true,
      })
    )
      throw new Error(`${extractType} is not extract of types valid`);
    //convertir el extracto a tipo sencillo y array
    const fullTypes: TAExtValueType = [extractType, [extractType]];
    if (this.isValueType(value, fullTypes, option)) {
      const allowArrayEmpty = this.isObject(option)
        ? option.allowArrayEmpty
        : false;
      r = (this.isArray(value, allowArrayEmpty) ? value : [value]) as TItem[];
    } else {
      r = defaultValue;
    }
    return r;
  }
  /**
   * permite ordenar un array de booleanos, numeros, cadenas de texto o objetos, con opciones de direccion, eliminacion de duplicados entre otras
   *
   * **⚠⚠ Importante los pesos de los tipos ⚠⚠**
   *
   * Lista de pesos (de menor a mayor peso):
   *
   * - `undefined`
   * - `null`
   * - `boolean`
   * - `number`
   * - `string-number` cuando esta activada `isCompareStringToNumber`
   * - `string`
   * - `object`
   * - `array`
   * - `function`
   *
   * los pesos son estrictos y tienen en cuenta el tipo. Ejemplo:
   *  - `A` es mas pesado que `a` //cuando es case sensitive
   *  - `0` es mas pesado que `true`.
   *  - `true` es mas pesado que `false`.
   *  - `false` es mas pesado que null
   *  - `null` es mas pesado que `undefined`
   *
   * @param {T} arrayToSort el array a ordenar
   * @param {object} option configuracion para el ordenamiento
   * - `direction = "asc"`, direccion de ordenamiento
   * - `isRemoveDuplicate = false`, si se desea eliminar duplicados antes de retornar el array ordenado
   * - `keyOrKeysPath` (solo para elementos de tipo objeto) rutas de claves identificadoras para las propiedades que se usaran como base para la comparación
   * - `isCompareLength = false`, determina si debe comprar tamaños de lso arrays
   * - `isCompareSize = false`, determina si debe comparar cantidad de propiedades de los objetos
   * - `isCompareStringToNumber = false`, determina si debe comparar strings numericos como numeros
   * - `isCaseSensitiveForString = false`, determina si la comparacion es sensitiva a minusculas y mayusculas (solo string)
   * @returns el array ya ordenado
   *
   * @example
   * ````typescript
   * let aToSort;
   * let r;
   *
   * //array de booleanos
   * aToSort = [false, true, true, false, true];
   * r = sortMixedArray(aToSort, {direction: "asc"})
   * console.log(r); //salida: `[false, false, true, true, true]`
   *
   * //array de numeros
   * aToSort = [-1,2,1,0,-2];
   * r = sortMixedArray(aToSort, {direction: "asc"})
   * console.log(r); //salida: `[-2,-1,0,1,2]`
   * ````
   *
   * //array de string (direccion "asc" y sesnsitivo)
   * aToSort = ["A", "B", "a", "b"];
   * r = sortMixedArray(aToSort, {
   *  direction: "asc",
   *  isCaseSensitiveForString: true
   * });
   * console.log(r); //salida: `["a", "A", "b", "B"]`
   *
   * //array de string (direccion "desc" y no sesnsitivo)
   * aToSort = ["A", "B", "a", "b"];
   * r = sortMixedArray(aToSort, {
   *  direction: "desc",
   *  isCaseSensitiveForString: false
   * });
   * console.log(r); //salida: `["b", "B", "a", "A"]`
   *
   * //array de string (direccion "desc" y sesnsitivo)
   * aToSort = ["A", "B", "a", "b"];
   * r = sortMixedArray(aToSort, {
   *  direction: "desc",
   *  isCaseSensitiveForString: true
   * });
   * console.log(r); //salida: `["B", "b", "A", "a"]`
   *
   * //array de objetos ()
   * aToSort = [
   *   {code: "C", age:14, name: "juan"},
   *   {code: "C", age:13, name: "ana"},
   *   {code: "a", age:3, name: "pedro"},
   *   {code: "B", age:20, name: "pablo"},
   * ];
   * r = sortMixedArray(aToSort, {
   *  direction: "asc",
   *  isCaseSensitiveForString: false,
   *  keyOrKeysPath: ["code", "age"] //el orden de las keys influye en el orden
   * });
   * console.log(r); //salida:
   * // `[
   * //   {code: "a", age:3, name: "pedro"},
   * //   {code: "B", age:20, name: "pablo"},
   * //   {code: "C", age:13, name: "ana"}, //code "C" es igual, asi que se ordena por age
   * //   {code: "C", age:14, name: "juan"},
   * // ]`
   *
   * ````
   */
  public sortMixedArray<T extends Array<any>>(
    arrayToSort: T,
    option?: Omit<IOptionEqGtLt, "isAllowEquivalent"> & {
      /**direccion de orden
       *
       * - `"asc"` para ascendente
       *
       * - `"desc"` para descendente
       *
       * predefinido en `"asc"`
       */
      direction: "asc" | "desc";
      /**determina si el array ordenado antes
       * de retornarlo se le eliminen los items
       * duplicados.
       *
       * predefinido en `false`
       *
       * ⚠ Aumenta el costo de rendimiento
       */
      isRemoveDuplicate?: boolean;
    }
  ): T {
    if (!this.isArray(arrayToSort, true))
      throw new Error(`${arrayToSort} is not array to sort valid`);
    //constructor de opciones
    let op = this.isObject(option, true) ? option : ({} as typeof option); //default vacio
    op = {
      ...op, //opciones adicionales no documentadas (si las hay)
      //las opciones de comparación se asignan en sus respectivos métodos
      direction:
        op.direction === "asc" || op.direction === "desc"
          ? op.direction
          : "asc",
      isRemoveDuplicate: this.isBoolean(op.isRemoveDuplicate)
        ? op.isRemoveDuplicate
        : false,
    };
    let { direction, isRemoveDuplicate } = op;
    //Iniciar proceso
    const nDirection = direction === "asc" ? 1 : -1;
    //tratamiento de arrays internos
    let arrayToSortClone = [] as T;
    let aUndefined = [] as T;
    for (const item of [...arrayToSort]) {
      //clonacion sencilla ya que no se modifican valores internamente
      //caso especial array
      if (this.isArray(item)) {
        arrayToSortClone.push(this.sortMixedArray(item as any[], { ...op }));
      }
      //caso especial undefined
      else if (this.isUndefined(item)) {
        aUndefined.push(item);
      }
      //casos normales
      else {
        arrayToSortClone.push(item);
      }
    }
    //ORGANIZAR
    arrayToSortClone.sort((a, b) => {
      let r = 0;
      //caso especial diferente tamaño de arrays
      if (Array.isArray(a) && Array.isArray(b) && a.length !== b.length) {
        r = a.length - b.length;
      } else {
        //casos normales
        r = this.compareTo([a, b], { ...op });
      }
      return r * nDirection;
    });
    //reacomodar elementos undefined
    arrayToSortClone =
      direction === "asc"
        ? ([...aUndefined, ...arrayToSortClone] as T)
        : ([...arrayToSortClone, ...aUndefined] as T);
    //tratamiento de repetidos
    if (isRemoveDuplicate) {
      arrayToSortClone = this.removeArrayDuplicate(arrayToSortClone, {
        ...op,
        itemConflictMode: "last",
      });
    }
    return arrayToSortClone;
  }
  /**
   *
   * Elimina los elementos duplicados de un array.
   *
   * @param {Array} arrayToRemove El array del cual se eliminarán los duplicados.
   * @param {object} option configuracion para el metodo
   * - `itemConflictMode` al encontrar un elemento repetido define el modo de resolver el conflicto de si se queda con el primero o el ultimo de los repetidos
   * - `keyOrKeysPath` (solo para elementos de tipo objeto) rutas de claves identificadoras para las propiedades que se usaran como base para la comparacion
   * - `isCompareLength = false`, determina si debe comprar tamaños de lso arrays
   * - `isCompareSize = false`, determina si debe comparar cantidad de propiedades de los objetos
   * - `isCompareStringToNumber = false`, determina si debe comparar strings numericos como numeros
   * - `isCaseSensitiveForString = false`, determina si la comparacion es sensitiva a minusculas y mayusculas (solo string)
   * - `isStringLocaleMode = false`, determina si la comparacion de strings es en modo region del sistema
   * @param {"first" | "last"} [itemConflictMode = "last"] - En caso de encontrar un duplicado, determina con cuál elemento se queda. Por defecto es `"last"`.
   * @returns {Array} - Retorna un nuevo array con los elementos repetidos o duplicados eliminados.
   *
   * @example
   *
   * ````typescript
   * let a;
   * let r;
   *
   * //caso primitivos sencillos (modo "first")
   * a = [
   *   true,
   *   false,
   *   true,
   *   null,
   *   2,
   *   undefined,
   *   2,
   *   undefined,
   *   1,
   *   "Juan",
   *   "juan",
   *   null,
   * ];
   * r = removeArrayDuplicate(a, {
   *   itemConflictMode: "first"
   * });
   * console.log(r) //Salida:
   * //[
   * //  true,
   * //  false,
   * //  null,
   * //  2,
   * //  undefined,
   * //  1,
   * //  "Juan", //son diferentes si es sensitivo
   * //  "juan", //son diferentes si es sensitivo
   * //]
   *
   * //caso primitivos sencillos (modo "last")
   * a = [
   *   true,
   *   false,
   *   true,
   *   null,
   *   2,
   *   undefined,
   *   2,
   *   undefined,
   *   1,
   *   "Juan",
   *   "juan",
   *   null,
   * ];
   * r = removeArrayDuplicate(a, {
   *   itemConflictMode: "last"
   * });
   * console.log(r) //Salida:
   * //[
   * //  false,
   * //  true,
   * //  2,
   * //  undefined,
   * //  1,
   * //  "Juan", //son diferentes si es sensitivo
   * //  "juan", //son diferentes si es sensitivo
   * //  null
   * //]
   *
   * //caso strings (modo "first", no sensitivo)
   * a = ["a","A","B","C","A","B"];
   * r = removeArrayDuplicate(a, {
   *   itemConflictMode: "first"
   * });
   * console.log(r) //Salida: ["a","B","C"]
   *
   * //caso strings (modo "last", no sensitivo)
   * a = ["a","A","B","C","A","B"];
   * r = removeArrayDuplicate(a, {
   *   itemConflictMode: "last"
   * });
   * console.log(r) //Salida: ["C","A","B"]
   *
   * //caso strings (modo "first", sensitivo)
   * a = ["a","A","B","C","A","B"];
   * r = removeArrayDuplicate(a, {
   *   itemConflictMode: "first",
   *   isCaseSensitiveForString
   * });
   * console.log(r) //Salida: ["a","A","B","C"]
   *
   * //caso strings (modo "last", sensitivo)
   * a = ["a","A","B","C","A","B"];
   * r = removeArrayDuplicate(a, {
   *   itemConflictMode: "last"
   * });
   * console.log(r) //Salida: ["a","C","A","B"]
   *
   * //caso object (modo "first", sin keysPath)
   * a = [
   *   {name: "Ana", age:12},
   *   {name: "Juan", age:13},
   *   {name: "Ana", age:13},
   *   {name: "Juan", age:12},
   * ];
   * r = removeArrayDuplicate(a, {
   *   itemConflictMode: "first"
   * });
   * console.log(r) //Salida: (no hay repetidos porque no hubo keysPath)
   * //[
   * //  {name: "Ana", age:12},
   * //  {name: "Juan", age:13},
   * //  {name: "Ana", age:13},
   * //  {name: "Juan", age:12},
   * //]
   *
   * //caso object (modo "first", con keysPath)
   * a = [
   *   {name: "Ana", age:12},
   *   {name: "Juan", age:13},
   *   {name: "Ana", age:13},
   *   {name: "Juan", age:12},
   * ];
   * r = removeArrayDuplicate(a, {
   *   itemConflictMode: "first",
   *   keyOrKeysPath: ["name"]
   * });
   * console.log(r) //Salida:
   * //[
   * //  {name: "Ana", age:12},
   * //  {name: "Juan", age:13},
   * //]
   *
   * //caso object (modo "last", con keysPath)
   * a = [
   *   {name: "Ana", age:12},
   *   {name: "Juan", age:13},
   *   {name: "Ana", age:13},
   *   {name: "Juan", age:12},
   * ];
   * r = removeArrayDuplicate(a, {
   *   itemConflictMode: "last",
   *   keyOrKeysPath: ["name"]
   * });
   * console.log(r) //Salida:
   * //[
   * //  {name: "Ana", age:13},
   * //  {name: "Juan", age:12},
   * //]
   * ````
   *
   */
  public removeArrayDuplicate<T extends Array<any>>(
    arrayToRemove: T,
    option?: Omit<IOptionEqGtLt, "isAllowEquivalent"> & {
      /**Si existe un elemento equivalente
       * a otros determinar si mantiene el
       * primero o el ultimo
       *
       * ⚠ se recomienda que `arrayToRemove`
       * este ordenado antes de eliminar los
       * elementos duplicados
       *
       * - `"first"` mantiene el primer elemento encontrado
       *
       * - `"last"` mantiene el ultimo elemento encontrado
       *
       * predefinido en `"last"`
       */
      itemConflictMode?: "first" | "last";
    }
  ): T {
    if (!this.isArray(arrayToRemove, true))
      throw new Error(
        `${arrayToRemove} is not array to remove duplicates valid`
      );
    //constructor de opciones
    let op = this.isObject(option, true) ? option : ({} as typeof option); //default vacio
    op = {
      ...op, //opciones adicionales no documentadas (si las hay)
      //las opciones de comparación se asignan en sus respectivos métodos
      itemConflictMode:
        op.itemConflictMode === "first" || op.itemConflictMode === "last"
          ? op.itemConflictMode
          : "last",
    };
    let { itemConflictMode } = op;
    //Iniciar proceso
    let fArray = arrayToRemove.filter((itemBase, idxBase) => {
      let idx: number;
      if (itemConflictMode === "first") {
        //reescritura de las funciones findIndex (por motivos de ES2020)
        const findIndexFn = <T>(
          arr: T[],
          cb: (element: T, index?: number, array?: T[]) => boolean
        ) => {
          for (let i = 0; i < arr.length; i++) {
            if (cb(arr[i], i, arr)) {
              return i;
            }
          }
          return -1;
        };
        idx = findIndexFn(arrayToRemove, (item) =>
          this.isEquivalentTo([itemBase, item], { ...op })
        );
      } else if (itemConflictMode === "last") {
        //reescritura de las funciones findLastIndex (por motivos de ES2020)
        const findLastIndexFn = <T>(
          arr: T[],
          cb: (element: T, index?: number, array?: T[]) => boolean
        ) => {
          let idxLast = -1;
          for (let i = arr.length - 1; i >= 0; i--) {
            if (cb(arr[i], i, arr)) {
              idxLast = i;
              break;
            }
          }
          return idxLast;
        };
        idx = findLastIndexFn(arrayToRemove, (item) => {
          const r = this.isEquivalentTo([itemBase, item], { ...op });
          return r;
        });
      } else {
        throw new Error(
          `${itemConflictMode} is not configuration's item conflict mode to remove duplicate valid`
        );
      }
      const r = idxBase === idx;
      return r;
    });
    return fArray as T;
  }
  /**
   * Obtiene la unión de dos arrays, eliminando los elementos duplicados.
   *
   * @param {[TArray, TArray]} tArraysToUnion Tupla con los dos arrays a unir, donde:
   * - `tArraysToUnion[0]` es el array "A" a unir.
   * - `tArraysToUnion[1]` es el array "B" a unir.
   * @param {object} option Configuración para el proceso de eliminación de duplicados. Las opciones son las mismas que para el método `arrayRemoveDuplicate`.
   * - `itemConflictMode` al encontrar un elemento repetido define el modo de resolver el conflicto de si se queda con el primero o el ultimo de los repetidos
   * - `keyOrKeysPath` (solo para elementos de tipo objeto) rutas de claves identificadoras para las propiedades que se usaran como base para la comparacion
   * - `isCompareLength = false`, determina si debe comprar tamaños de lso arrays
   * - `isCompareSize = false`, determina si debe comparar cantidad de propiedades de los objetos
   * - `isCompareStringToNumber = false`, determina si debe comparar strings numericos como numeros
   * - `isCaseSensitiveForString = false`, determina si la comparacion es sensitiva a minusculas y mayusculas (solo string)
   * - `isStringLocaleMode = false`, determina si la comparacion de strings es en modo region del sistema
   * @returns {TArray} Retorna un nuevo array que es la unión de los dos arrays de entrada, sin duplicados.
   * @throws {Error} Lanza un error si `tArraysToUnion` no es un array de dos elementos.
   *
   * @example
   * ```typescript
   * let arrA;
   * let arrB;
   * let r;
   *
   * //union:
   * arrA = [1, 2, 3];
   * arrB = [3, 4, 5];
   * r = getArrayUnion([arrA, arrB], {});
   * console.log(r); // salida: [1, 2, 3, 4, 5]
   * ```
   *
   */
  public getArrayUnion<TArray extends Array<any>>(
    tArraysToUnion: [TArray, TArray],
    option?: Parameters<typeof this.removeArrayDuplicate>[1]
  ): TArray {
    if (!this.isValueType(tArraysToUnion, [[], []]))
      throw new Error(`${tArraysToUnion} is not tuple to union valid`);
    let [aAU, bAU] = tArraysToUnion;
    let aR = [...aAU, ...bAU] as TArray;
    aR = this.removeArrayDuplicate(aR, option);
    return aR;
  }
  /**
   * Obtiene la intersección de dos arrays, eliminando los elementos duplicados.
   *
   * @param {[TArray, TArray]} tArraysToUnion Tupla con los dos arrays a unir, donde:
   * - `tArraysToUnion[0]` es el array "A" a unir.
   * - `tArraysToUnion[1]` es el array "B" a unir.
   * @param {object} option Configuración para el proceso de eliminación de duplicados. Las opciones son las mismas que para el método `arrayRemoveDuplicate`.
   * - `itemConflictMode` al encontrar un elemento repetido define el modo de resolver el conflicto de si se queda con el primero o el ultimo de los repetidos
   * - `keyOrKeysPath` (solo para elementos de tipo objeto) rutas de claves identificadoras para las propiedades que se usaran como base para la comparacion
   * - `isCompareLength = false`, determina si debe comprar tamaños de lso arrays
   * - `isCompareSize = false`, determina si debe comparar cantidad de propiedades de los objetos
   * - `isCompareStringToNumber = false`, determina si debe comparar strings numericos como numeros
   * - `isCaseSensitiveForString = false`, determina si la comparacion es sensitiva a minusculas y mayusculas (solo string)
   * - `isStringLocaleMode = false`, determina si la comparacion de strings es en modo region del sistema
   * @returns {TArray} Retorna un nuevo array que es la unión de los dos arrays de entrada, sin duplicados.
   * @throws {Error} Lanza un error si `tArraysToUnion` no es un array de dos elementos.
   *
   * @example
   * ```typescript
   * let arrA;
   * let arrB;
   * let r;
   *
   * //intersección:
   * arrA = [1, 2, 3, 4, 5];
   * arrB = [3, 4, 5, 6, 7, 8, 9];
   * r = getArrayIntersection([arrA, arrB], {});
   * console.log(r); // salida: [3, 4, 5]
   * ```
   *
   */
  public getArrayIntersection<T extends Array<any>>(
    tArraysToIntersection: [T, T],
    option?: Parameters<typeof this.removeArrayDuplicate>[1]
  ): T {
    if (!this.isValueType(tArraysToIntersection, [[], []]))
      throw new Error(`${tArraysToIntersection} is not tuple to union valid`);
    let [aAI, bAI] = tArraysToIntersection;
    let aR = aAI.filter((a) => {
      const r = bAI.some((b) => this.isEquivalentTo([a, b], option));
      return r;
    }) as T;
    aR = this.removeArrayDuplicate(aR, option);
    return aR;
  }
  /**
   *
   * Obtiene la diferencia de dos arrays, eliminando los elementos duplicados.
   *
   * @param {[TArray, TArray]} tArraysToUnion Tupla con los dos arrays a unir, donde:
   * - `tArraysToUnion[0]` es el array *A* a unir.
   * - `tArraysToUnion[1]` es el array *B* a unir.
   * @param {"difference_A" | "difference_B"} selector seleccion de array al cual se le aplica la diferencia (al array `tArraysToUnion[0]` que representa *A* o al array `tArraysToUnion[1]` que representa *B*).
   * @param {object} option Configuración para el proceso de eliminación de duplicados. Las opciones son las mismas que para el método `arrayRemoveDuplicate`.
   * - `itemConflictMode` al encontrar un elemento repetido define el modo de resolver el conflicto de si se queda con el primero o el ultimo de los repetidos
   * - `keyOrKeysPath` (solo para elementos de tipo objeto) rutas de claves identificadoras para las propiedades que se usaran como base para la comparacion
   * - `isCompareLength = false`, determina si debe comprar tamaños de lso arrays
   * - `isCompareSize = false`, determina si debe comparar cantidad de propiedades de los objetos
   * - `isCompareStringToNumber = false`, determina si debe comparar strings numericos como numeros
   * - `isCaseSensitiveForString = false`, determina si la comparacion es sensitiva a minusculas y mayusculas (solo string)
   * - `isStringLocaleMode = false`, determina si la comparacion de strings es en modo region del sistema
   * @returns {TArray} Retorna un nuevo array que es la unión de los dos arrays de entrada, sin duplicados.
   * @throws {Error} Lanza un error si `tArraysToUnion` no es un array de dos elementos.
   *
   * @example
   * ```typescript
   * let arrA;
   * let arrB;
   * let r;
   *
   * //diferencia *A*:
   * arrA = [1, 2, 3];
   * arrB = [3, 4, 5];
   * r = getArrayDifference([arrA, arrB], "difference_A");
   * console.log(r); // salida: [1, 2]
   *
   * //diferencia *B*:
   * arrA = [1, 2, 3];
   * arrB = [3, 4, 5];
   * r = getArrayDifference([arrA, arrB], "difference_B");
   * console.log(r); // salida: [4, 5]
   * ```
   *
   */
  public getArrayDifference<T extends Array<any>>(
    tArraysToDifference: [T, T],
    selector: "difference_A" | "difference_B",
    option?: Parameters<typeof this.removeArrayDuplicate>[1]
  ): T {
    if (!this.isArray(tArraysToDifference) || tArraysToDifference.length > 2)
      throw new Error(`${tArraysToDifference} is not array of set valid`);
    if (!this.isString(selector)) {
      throw new Error(`${selector} is not selector valid`);
    }
    let [aAD, bAD] = tArraysToDifference;
    let aR = [] as T;
    if (selector === "difference_A") {
      aR = aAD.filter((a) => {
        const r = !bAD.some((b) => this.isEquivalentTo([a, b], option));
        return r;
      }) as T;
    } else if (selector === "difference_B") {
      aR = bAD.filter((b) => {
        const r = !aAD.some((a) => this.isEquivalentTo([a, b], option));
        return r;
      }) as T;
    } else {
      throw new Error(`${selector} is not selector valid`);
    }
    aR = this.removeArrayDuplicate(aR, option);
    return aR;
  }
  /**
   * busca elementos de un array
   * dentro de otro
   *
   * ➡Ejemplo de consulta de objetos por un campo:
   * ````
   * const mainArray = [
   *  {id: "1", nombre:"Alan", edad:12},
   *  {id: "2", nombre:"Marta", edad:14},
   *  {id: "3", nombre:"Maria", edad:16},
   *  {id: "4", nombre:"Manuel", edad:16},
   * ];
   * const searchArray = [ //buscar los objetos en mainArray con `id === 1 || id == 4`
   *  {id:1},
   *  {id:4}
   * ];
   *
   * const r = searchItemsInArray(mainArray, searchArray);
   * console.log(r); //-> [{id: "1", nombre:"Alan", edad:12}, {id: "4", nombre:"Manuel", edad:16},]
   * ````
   *
   * ➡Ejemplo búsqueda OR y AND:
   * ````
   * const mainArray = [
   *  {id: "1", nombre:"Alan", edad:12},
   *  {id: "2", nombre:"Marta", edad:14},
   *  {id: "3", nombre:"Maria", edad:16},
   *  {id: "4", nombre:"Manuel", edad:16},
   * ];
   * const searchArray = [ //buscar los objetos en mainArray que: `id===2 || (nombre === "Maria" && edad === 16)`
   *  {nombre: "Maria", edad: 16}, //se busca nombre && edad
   *  {id:2}
   * ];
   *
   * const r = searchItemsInArray(mainArray, searchArray);
   * console.log(r); //-> [{id: "2", nombre:"Marta", edad:14}, {id: "3", nombre:"Maria", edad:16},]
   * ````
   *
   * ➡Ejemplo con propiedades seleccionadas:
   * ````
   * const mainArray = [
   *  {id: "1", nombre:"Alan", edad:12},
   *  {id: "2", nombre:"Marta", edad:14},
   *  {id: "3", nombre:"Maria", edad:16},
   *  {id: "4", nombre:"Manuel", edad:16},
   * ];
   * const searchArray = [ //buscar los objetos en mainArray (se envían los objetos completos)`
   *  {id: "2", nombre:"Marta", edad:14},
   *  {id: "3", nombre:"Maria", edad:16},
   * ];
   * const diccKeyId = ["edad"];  // SOLO buscar por nombre
   * const r = searchItemsInArray(mainArray, searchArray, diccKeyId);
   * console.log(r); //-> [
   *                  //{id: "2", nombre:"Marta", edad:14},
   *                  //{id: "3", nombre:"Maria", edad:16},
   *                  //{id: "4", nombre:"Manuel", edad:16},
   *                  //]
   * ````
   *
   * ____
   * @param aData el array de datos donde se desea buscar
   *
   * @param searchArray el array con elementos a buscar, si
   * son objetos pueden ser extractos de objetos que almenos
   * contengan las propiedades que los identifican
   *
   * ⚠ las propiedaes que se envien aqui
   *
   * @param keysForObj (opcional) array con identificadores
   * de los objetos `searchArray` que seran usados para
   * la comparacion, si no se reciben se asume que todos
   * los propiedades de estos objetos seran comparados
   *
   * ____
   * @returns un array con los elementos que se
   * encontraron (que son equivalentes)
   * ____
   */
  public searchItemsInArray<TArray extends Array<any>>(
    aData: TArray,
    searchArray: TArray,
    option: Omit<IOptionEqGtLt, "isAllowEquivalent"> & {}
  ): TArray {
    if (!this.isArray(aData))
      throw new Error(`${aData} is not root array valid`);
    if (!this.isArray(searchArray))
      throw new Error(`${searchArray} is not search array valid`);
    //constructor de opciones
    let op = this.isObject(option, true) ? option : ({} as typeof option); //default vacio
    op = {
      ...op, //opciones adicionales no documentadas (si las hay)
      //las opciones de comparación se asignan en sus respectivos métodos
    };
    let {} = op;
    //iniciar proceso
    let findArray = aData.filter((mAi) => {
      const r = searchArray.find((sAi) => {
        let r = this.isEquivalentTo([mAi, sAi], { ...op });
        return r;
      });
      return r;
    });
    return findArray as TArray;
  }
  /**
   * Congela un array para prevenir modificaciones en sus elementos, con opcion de niveles profundos si sus elementos son a su vez arrays.
   *
   * @param {TArray} arr - El array que se va a congelar.
   * @param {boolean} isAllowDeepLevel - Determina si se debe congelar el array a nivel profundo. Por defecto es `true`, lo que significa que se congelarán todos los elementos del array que sean, a su vez, arrays.
   * @returns {TArray} - Retorna el array congelado, si no es un array, retorna el valor sin modificaciones.
   *
   * @example
   * ```typescript
   * const arr = ["hola", {b:["1"]}];
   * const frozenArr = freezeArray(arr);
   * //verifica si esta congelado
   * console.log(Object.isFrozen(frozenArr)); // salida: true
   * console.log(Object.isFrozen(frozenArr[1])); // salida: true
   * ```
   */
  public freezeArray<TArray>(arr: TArray, isAllowDeepLevel = true): TArray {
    const isArray = Array.isArray(arr);
    if (!isArray) return arr;
    // Congelar arrays directamente si no se requiere recursividad
    if (isArray && !isAllowDeepLevel) return Object.freeze(arr);
    arr = (arr as any[]).map((item) => {
      return this.freezeObject(item, isAllowDeepLevel);
    }) as TArray;
    arr = Object.freeze(arr);
    return arr;
  }
  //████ tuplas ███████████████████████████████████████████████████████
  /**
   * Determina si un valor es una tupla de un tamaño específico o dentro de un rango de tamaños.
   *
   * @param {any} tuple - El valor que se va a verificar.
   * @param {number | [number, number]} size - El tamaño esperado de la tupla o un rango de tamaños válidos. Si es un número, la tupla debe tener exactamente ese tamaño. Si es una tupla de dos números, el tamaño de la tupla debe estar dentro de ese rango (inclusive).
   * @throws {Error} - Lanza un error si `length` no es un número o una tupla de dos números.
   * @returns {boolean} - Retorna `true` si el valor es una tupla del tamaño especificado o dentro del rango de tamaños, de lo contrario retorna `false`.
   *
   * @example
   * ```typescript
   *
   * let value = [1, 2, 3];
   * let isTuple = isTuple(value, 3);
   *
   * //caso básico
   * value = [1, 2, 3];
   * isTuple = isTuple(value, 3); //tupla con tamaño exacto de 3 elementos
   * console.log(isTuple); // salida: true
   *
   * //caso tupla con tamaño variable
   * isTuple = isTuple(value, [1,2]); //la tupla puede tener entre 1 y 2 elementos
   * console.log(isTuple); // salida: false, porque tiene 3 elementos
   *
   * ```
   */
  public isTuple<TTuple>(
    tuple: TTuple,
    size: number | [number, number]
  ): boolean {
    if (
      (!this.isNumber(size) || this.isNumberSign(size, "-")) &&
      (!this.isValueType(size, [["number"], ["number"]]) || //this.isTuple(size, 2) ||
        (size as number[]).some((s) => this.isNumberSign(s, "-")))
    )
      throw new Error(`${size} is not number or range tuple number valid`);
    if (!this.isArray(tuple, true)) return false;
    const tp = tuple as any[];
    if (!Array.isArray(size)) {
      if (tp.length !== size) return false;
    } else {
      if (!this.isNumberInRange(tp.length, size, true)) return false;
    }
    return true;
  }
  /**
   * Determina si es un array de tuplas
   *
   * @param {Array<TTuple>} aTuple - El array de tuplas que se va a verificar.
   * @param {number | [number, number]} length - El tamaño esperado de las tuplas o un rango de tamaños válidos. Si es un número, todas las tuplas deben tener exactamente ese tamaño. Si es una tupla de dos números, el tamaño de las tuplas debe estar dentro de ese rango (inclusivo).
   * @param {boolean} allowEmpty - Determina si se permite asumir que el array está vacío como válido. Por defecto es `false`, lo que significa que no se permite asumirlo como válido si está vacío.
   * @returns {boolean} - Retorna `true` si todas las tuplas cumplen con las condiciones de tamaño, de lo contrario retorna `false`.
   *
   * @example
   * ```typescript
   * const array = [[1, 2], [3, 4], [5, 6]];
   * const isValid = isArrayTuple(array, 2); //en esta caso, las tuplas deben tener un tamaño exacto de 2 elementos
   * console.log(isValid); // salida: true
   * ```
   */
  public isArrayTuple<TTuple>(
    aTuple: Array<TTuple>,
    length: number | [number, number],
    allowEmpty = false
  ): boolean {
    if (!this.isArray(aTuple, allowEmpty)) return false;
    const r = aTuple.every((tuple) => this.isTuple(tuple, length));
    return r;
  }
  /**
   * Convierte un objeto literal en un array de tuplas.
   *
   * @param {TObj} obj El objeto literal que se va a convertir.
   * @returns {Array<[keyof TObj, (typeof obj)[keyof TObj]]>} Retorna un array de tuplas. Cada tupla consta de una clave y un valor del objeto de entrada.
   *
   * ⚠ si el parametro no es de tipo objeto **literal**  se retornará un array vacio, ademas al ser un conversión de objeto a tupla esta siempre será de tipo clave-valor (`[key, value]`)
   *
   * @example
   * ```typescript
   * const obj = { a: 1, b: 2, c: 3 };
   * const array = convertObjectToArrayOfTuples(obj);
   * console.log(array); // salida: [["a", 1], ["b", 2], ["c", 3]]
   * ```
   */
  public convertObjectToArrayOfTuples<TObj>(obj: TObj) {
    if (!this.isLiteralObject(obj)) return [];
    let aT = Object.keys(obj).map((k) => {
      const key = k as keyof TObj;
      const r = [key, obj[key]] as [keyof TObj, (typeof obj)[keyof TObj]];
      return r;
    });
    return aT;
  }
  /**
   * Elimina los duplicados de un array de tuplas basándose en la clave de cada tupla.
   *
   * **⚠** la tupla **debe** ser de tipo clave-valor (`[key, value]`) obligatoriamente
   *
   * @param {TATuple} arrayTupleToRemove El array de tuplas que puede contener duplicados.
   * @returns {TATuple} Retorna un nuevo array de tuplas sin duplicados.
   *
   * **⚠** si se encuentran duplicados, seleccionara el último de los elementos duplicados
   *
   * @example
   * ```typescript
   * const array = [["key1", "value1"], ["key2", "value2"], ["key1", "value3"]];
   * const newArray = removeTupleArrayDuplicateByKey(array);
   * console.log(newArray); // salida: [["key1", "value3"], ["key2", "value2"]]
   * ```
   */
  public removeTupleArrayDuplicateByKey<TATuple>(
    arrayTupleToRemove: TATuple
  ): TATuple {
    if (
      !this.isArray(arrayTupleToRemove) ||
      !(arrayTupleToRemove as any[]).every((t) => this.isTuple(t, 2))
    ) {
      throw new Error(
        `${arrayTupleToRemove} is not array of tuple to remove duplicates valid`
      );
    }
    const mapBf = new Map(arrayTupleToRemove as Array<[any, any]>);
    let aT = Array.from(mapBf.keys()).map((key) => {
      const r = [key, mapBf.get(key)];
      return r;
    });
    return aT as TATuple;
  }
  //████ Fechas ███████████████████████████████████████████████████████
  /**
   * determina si el numero es un timestamp valido
   * @param {any} timestamp el numero a validar como timestamp, se puede recibir como number o como string-number
   * @returns si es un timestamp valido
   */
  public isTimestamp(timestamp: any): boolean {
    if (!this.isNumber(timestamp, true)) return false;
    const timestampReduced = this.stringToNumber(timestamp) / 1000; //reducirlo a segundos para evitar problemas de memoria (en año 2038)
    if (this.isNumberSign(timestampReduced, "-", false)) return false; //un timestamp SIEMPRE será positivo
    return true;
  }
  /**
   * convierte de string de fecha a timestamp
   *
   * @param dateString el string de la fecha en formato dd-mm-yyyy
   * ____
   * @returns el timestamp de dicha fecha
   * ____
   */
  public dateToTimestamp(dateString: string): number {
    const dd_mm_yyyy = dateString.split(this.sepDateRegExp);
    const day = parseInt(dd_mm_yyyy[0], 10);
    const month = parseInt(dd_mm_yyyy[1], 10) - 1; //los meses se cuentan de 0 a 11
    const year = parseInt(dd_mm_yyyy[2], 10); //año completo yyyy
    let rDate = new Date(year, month, day);
    return rDate.getTime();
  }
  //████ Funciones ████████████████████████████████████████████████████
  /**
   * Determina si un valor es una función.
   *
   * @param {any} fn - El valor que se va a verificar.
   * @returns {boolean} - Retorna `true` si el valor es una función, de lo contrario retorna `false`.
   *
   * @example
   * ```typescript
   * const result = isFunction(() => {});
   * console.log(result); // salida: true
   *
   * const result2 = isFunction(123);
   * console.log(result2); // salida: false
   * ```
   */
  public isFunction(fn: unknown): boolean {
    const r = typeof fn === "function";
    return r;
  }
  /**
   * Construye una función vinculada a un contexto específico.
   *
   * @param {TFn} fn - La función que se va a vincular.
   * @param {object} context - El contexto al cual se va a vincular la función.
   * @returns {TFn} - Retorna la función vinculada.
   * @throws {Error} - Lanza un error si `fn` no es una función válida.
   *
   * @example
   * ```typescript
   * const context = { value: 42 };
   * const fn = function() { return this.value; };
   * const boundFn = buildFn(fn, context);
   * console.log(boundFn()); // salida: 42
   *
   * const invalidFn = 123;
   * try {
   *   const result = buildFn(invalidFn, context);
   * } catch (e) {
   *   console.error(e); // salida: 123 is not function valid
   * }
   * ```
   */
  public buildFn<TFn>(fn: TFn, context: object): TFn {
    if (!this.isFunction(fn)) throw new Error(`${fn} is not function valid`);
    fn = (fn as Function).bind(context);
    return fn;
  }
  //████ Generales ████████████████████████████████████████████████████
  /**
   * Realiza la clonación de objetos JSON o Arrays de JSONs a diferentes niveles de profundidad.
   *
   * xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   * ⚠ **NO** se puede clonar instancias de clase ⚠
   * xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   *
   *
   * @param {T} objOrArray El objeto a clonar. El tipo `T` se asume implícitamente al enviar el parámetro.
   * @param {"stringify" | "structuredClone"} driver `= "structuredClone"` el driver o libreria para hacer clonación.
   * @returns {T} Retorna el objeto (o array) clonado. Si no es un objeto (o array), el retorno es el mismo valor.
   *
   * @example
   * ```typescript
   * const obj = { a: 1, b: 2 };
   * const clonedObj = clone(obj);
   * console.log(clonedObj); // salida: { a: 1, b: 2 }
   * ```
   */
  public clone<T>(
    objOrArray: T,
    driver: "stringify" | "structuredClone" = "structuredClone"
  ): T {
    if (
      typeof objOrArray != "object" || //❗solo clona los objetos (incluye array)❗
      this.isNull(objOrArray)
    ) {
      return objOrArray;
    }
    let dataCopia: T;
    if (driver === "stringify") {
      dataCopia = JSON.parse(JSON.stringify(objOrArray)); //metodo antiguo
    } else if (driver === "structuredClone") {
      dataCopia = structuredClone(objOrArray); //Se implementará en typescript ^4.7.x
    } else {
      throw new Error(`${driver} does not driver valid`);
    }
    return dataCopia;
  }
  /**
   * @facade
   *
   * anida las promesas en forma serial,
   * se ejecuta secuencialmente en el
   * orden del array
   * ____
   * @param fns  array con las funciones a
   * ejecutar y que entregan una promesa
   *
   * @param options (optional) opciones o parametros para
   * cada funcion de promesa
   * ____
   * @returns un array con cada resultado de
   * cada promesa
   * ____
   */
  public async runPromisesSequentially(
    fns: ((value: any) => Promise<any>)[],
    options?: any
  ): Promise<any> {
    if (!Array.isArray(fns)) {
      throw new Error("No Array Promise"); //---falta definir ERROR--
    }
    return await this._runPromisesSequentially(fns, options);
  }
  /**
   * @real
   *
   * anida las promesas en forma serial,
   * se ejecuta secuencialmente en el
   * orden del array
   * ____
   * @param fns  array con las funciones a
   * ejecutar y que entregan una promesa
   *
   * @param options (optional) opciones o parametros para
   * cada funcion de promesa
   *
   * @param rValues un array con los resultados
   * de cada Promesa anidadad una vez resuelta
   * ____
   * @returns un array con cada resultado de
   * cada promesa
   * ____
   */
  private async _runPromisesSequentially(
    fns: ((value: any) => Promise<any>)[],
    options?: any,
    rValues = []
  ): Promise<any> {
    if (fns.length > 0) {
      const currentFn: (param?) => Promise<any> = fns[0].bind(this);
      rValues.push(await currentFn(options));
      await this._runPromisesSequentially(fns.slice(1), options, rValues);
    }
    return rValues;
  }
  /**
   * Verifica si un valor (`anyValue`) coincide con al menos uno de los tipos especificados en `types`.
   * Este método es altamente flexible y permite la validación de tipos básicos, objetos, arrays, tuplas y tipos anidados.
   *
   * @param anyValue El valor que se desea validar.
   * @param types Un array de tipos o esquemas de tipos que `anyValue` debe cumplir.
   *                Puede contener tipos básicos como:
   *                `"string"`,
   *                `"number"`,
   *                `"boolean"`,
   *                `"undefined"`,
   *                `"null"`,
   *                `"function"`,
   *                `"object"`,
   *                `"array"`,
   *                `"tuple"`,
   *                etc o estructuras más complejas como objetos y arrays anidados que definen esquemas de validación.
   *                - Si `types` es un array vacío (`[]`), se asume que cualquier valor es válido.
   *                - Si `types` en uno o varios de sus items contiene objetos, se valida que `anyValue` sea un objeto y que sus propiedades cumplan con los tipos especificados en el esquema, si ese item es `{}` se asume que puede tener cualquier cantidad de propiedades y de cualquier tipo.
   *                - Si `types` en uno de sus items contiene un array, se valida que `anyValue` sea un array y que cada uno de sus elementos cumplan con los tipos especificados en el esquema, si ese item es `[]` se asume que cada uno de los elementos puede ser de cualquier tipo.
   *                - Si `types` contiene `"tuple"`, se valida que `anyValue` sea una tupla con el tamaño especificado en `option.tupleSize`.
   *                - Si `types` en varios de sus items contiene arrays, implicitamente asume que validará una tupla, ❕Tiene en cuenta el orden en que esten esos item de tipo array, porque ese será el mismo orden en que verifique la tupla❕
   * @param option - Opciones adicionales para la validación:
   *                 - `allowNumber_String = false`: Permite que un string numérico sea validado como un número (por ejemplo, `"123"` siendo string, se permite analizar y validar como número).
   *                 - `allowBigint_String = false`: Permite que un string numérico gigante sea validado como un bigint.
   *                 - `allowStringEmpty = false`: Permite que un string vacío ( `""` ) sea considerado válido.
   *                 - `allowObjectEmpty = false`: Permite que un string vacío ( `{}` ) sea considerado válido.
   *                 - `allowArrayEmpty = false`: Permite que un string vacío ( `[]` ) sea considerado válido.
   *                 - `tupleSize = undefined`: Define el tamaño esperado de una tupla. Puede ser un número (tamaño fijo) o un array de dos números `[min, max]` (tamaño variable), ❗este argumento es indispensable en caso que en algún nivel del esquema de `types` se verifique el tipo `"tuple"` (asi explicitamente en texto), por el contrario si la verificacion de la tupla se hace implicitamente (con varios items array), este argumento es opcional, pero si se asigna tendrá prioridad de verificación❗.
   *
   * @returns {boolean} - `true` si `anyValue` coincide con al menos uno de los tipos especificados en `types`, de lo contrario `false`.
   *
   * @example
   *
   * ````typescript
   * const util = UtilNative.getInstance();
   * let v: any;
   * let r: boolean;
   *
   * //casos de control:
   *
   * v = null;
   * r = util.isValueType(v, ["undefined"]);
   * console.log(r); //Salida: false, no es undefined
   *
   * v = 2;
   * r = util.isValueType(v, ["null"]);
   * console.log(r); //Salida: false, no es null
   *
   * v = ()=>consle.log("lo que sea");
   * r = util.isValueType(v, ["function"]);
   * console.log(r); //Salida: true
   *
   * //primitivos basicos
   *
   * v = false;
   * r = util.isValueType(v, ["boolean"]);
   * console.log(r); //Salida: true
   *
   * v = 15;
   * r = util.isValueType(v, ["number"]);
   * console.log(r); //Salida: true
   *
   * v = 10;
   * r = util.isValueType(v, ["boolean", "number"]);
   * console.log(r); //Salida: true, es almenos número
   *
   * v = "10";
   * r = util.isValueType(v, ["number"]);
   * console.log(r); //Salida: false, es un string
   *
   * v = "10";
   * r = util.isValueType(v, ["number", "string"]);
   * console.log(r); //Salida: true, es almenos string
   *
   * v = "10";
   * r = util.isValueType(v, ["number"], {allowNumber_String: true});
   * console.log(r); //Salida: true, por que se permite analizar string numérico
   *
   * v = "lo que sea";
   * r = util.isValueType(v, ["null", "string"]);
   * console.log(r); //Salida: true
   *
   * v = "";
   * r = util.isValueType(v, ["string"]);
   * console.log(r); //Salida: false, No se permite string vácios ❗Comportamiento predefinido❗
   *
   * v = "";
   * r = util.isValueType(v, ["string"], {allowStringEmpty: true});
   * console.log(r); //Salida: true, se permite string vácios
   *
   * v = "";
   * r = util.isValueType(v, ["undefined", "null", "string"]);
   * console.log(r); //Salida: false, NO se permite string vácios
   *
   * v = null;
   * r = util.isValueType(v, ["undefined", "null", "string"]);
   * console.log(r); //Salida: true, al menos es nulo
   *
   * //agrupaciones (objetos y arrays)
   *
   * v = {};
   * r = util.isValueType(v, ["undefined", "null", "object"]);
   * console.log(r); //Salida: false, No se permite objeto vácio ❗Comportamiento predefinido❗
   *
   * v = {};
   * r = util.isValueType(v, ["undefined", "null", "object"], {allowObjectEmpty: true});
   * console.log(r); //Salida: true
   *
   * v = {};
   * r = util.isValueType(v, ["undefined", "null", {}]);
   * console.log(r); //Salida: false, No se permite objeto vácio ❗Comportamiento predefinido❗
   *
   * v = {};
   * r = util.isValueType(v, ["undefined", "null", {}], {allowObjectEmpty: true});
   * console.log(r); //Salida: true
   *
   * v = {};
   * r = util.isValueType(v, ["undefined", "null", {a: ["string", "number"]}], {allowObjectEmpty: true});
   * console.log(r); //Salida: true
   *
   * v = { a: 1 };
   * r = util.isValueType(v, ["undefined", "null", {a: ["string", "number"]}]);
   * console.log(r); //Salida: true, la propiedad `a` es almenos es un número
   *
   * v = { a: { aa: 1 }};
   * r = util.isValueType(v, ["undefined", "null", {a: ["string", {}]}]);
   * console.log(r); //Salida: true, la propiedad `a` es almenos es un objeto que puede tener cualquier propiedad ❗El objeto `{}` en el esquema `types` no significa que se permita vacio, indica que se permite cualquier tipo de propiedad❗
   *
   * v = { a: 1, b: "lo que sea" };
   * r = util.isValueType(v, ["undefined", "null", {a: ["string", "number"]}]);
   * console.log(r); //Salida: true, la propiedad `a` es almenos es un número y `b` es ignoraqda en la validación
   *
   * v = "hola";
   * r = util.isValueType(v, ["string", {a: ["boolean", "number"]}]);
   * console.log(r); //Salida: true, es almenos un texto
   *
   * v = { a: {aa: 1, ab: "hola"} };
   * r = util.isValueType(v, ["boolean", {a: [{aa: ["string", "number"]}, "number"]}]);
   * console.log(r); //Salida: true, la propiedad `aa` es almenos es un número, `ab` es ignorada en la validación
   *
   * v = [];
   * r = util.isValueType(v, ["undefined", "null", "array"]);
   * console.log(r); //Salida: false, No se permite array vácio ❗Comportamiento predefinido❗
   *
   * v = [];
   * r = util.isValueType(v, ["undefined", "null", "array"], {allowObjectEmpty: true});
   * console.log(r); //Salida: true
   *
   * v = [];
   * r = util.isValueType(v, ["undefined", "null", []]);
   * console.log(r); //Salida: false, No se permite array vácio ❗Comportamiento predefinido❗
   *
   * v = [];
   * r = util.isValueType(v, ["undefined", "null", []], {allowObjectEmpty: true});
   * console.log(r); //Salida: true
   *
   * v = [1,2,3];
   * r = util.isValueType(v, ["undefined", "null", []]);
   * console.log(r); //Salida: true, ❗[] en el esquema de `types` no significa que se permita arryas vacios, indica que los elementos del array pueden ser de cualquier tipo❗
   *
   * v = [1,2,3];
   * r = util.isValueType(v, ["null", ["boolean", "string"]]);
   * console.log(r); //Salida: false, los elementos del array son solo números
   *
   * v = [1,"hola",3];
   * r = util.isValueType(v, ["null", ["boolean", "string"]]);
   * console.log(r); //Salida: false, solo un elemento del array es string, para que sea valido todos los elementos del array deben ser "boolean" o "string"
   *
   * v = [1,["a", "b", "c"], {a: "hola"}];
   * r = util.isValueType(v, [["number", ["string"], {a: ["string"]}]]);
   * console.log(r); //Salida: true, cumple con elemento de tipo number o elemento de tipo array de strings o elemento de tipo objeto `{a: string}`
   *
   * v = ["clave", "valor"]; //tupla
   * r = util.isValueType(v, ["null", "tuple"], {tupleSize: 2}); //❗si se verifica explicitamente "tuple", es obligatorio asignar el tamaño de la tupla❗
   * console.log(r); //Salida: true, almenos es una tupla de 2 elementos, no importa el tipo de cada elemento
   *
   * v = ["clave", "valor"]; //tupla
   * r = util.isValueType(v, ["null", ["string", "number"], ["string"]]); //❗si en el mismo nivel del esquema de `types` (en cualquier nivel pero que sea el mismo), se detecta que hay 2 o mas array internamente el metodo asume validacion de tupla❗
   * console.log(r); //Salida: true, almenos es una tupla de 2 elementos (el primero es o number o string, el segundo es string)
   *
   * v = ["clave", "valor"]; //tupla
   * r = util.isValueType(v, ["null", ["string", "number"], ["string"]], {tupleSize: 3}); //❗Prioridad de tamaño❗
   * console.log(r); //Salida: false, la tupla a verificar debe tener 3 elementos
   *
   * ````
   *
   */
  public isValueType(
    anyValue: any,
    types: TAExtValueType,
    option?: IValueTypeOption
  ): boolean {
    if (!this.isArray(types, true))
      throw new Error(`${types} is not array types valid`);
    //constructor de opciones
    let op = this.isObject(option, true) ? option : ({} as typeof option); //default vacio
    op = {
      ...op, //opciones adicionales no documentadas (si las hay)
      allowNumber_String: this.isBoolean(op.allowNumber_String)
        ? op.allowNumber_String
        : false,
      allowBigint_String: this.isBoolean(op.allowBigint_String)
        ? op.allowBigint_String
        : false,
      allowStringEmpty: this.isBoolean(op.allowStringEmpty)
        ? op.allowStringEmpty
        : false,
      allowObjectEmpty: this.isBoolean(op.allowObjectEmpty)
        ? op.allowObjectEmpty
        : false,
      allowArrayEmpty: this.isBoolean(op.allowArrayEmpty)
        ? op.allowArrayEmpty
        : false,
      tupleSize:
        this.isNumber(op.tupleSize) || this.isTuple(op.tupleSize, 2)
          ? op.tupleSize
          : undefined,
    };
    const {
      allowNumber_String,
      allowBigint_String,
      allowStringEmpty,
      allowObjectEmpty,
      allowArrayEmpty,
      tupleSize,
    } = op;
    //eliminacion básica de duplicados (❗No toma encuenta, arrays ni objetos❗)
    types = [...new Set(types)];
    //si no hay tipos se asume que se permite cualquier valor
    if (types.length === 0) return true;
    let r = false;
    for (const type of types) {
      if (r) break; //se encontró almenos una validación
      //banderas para casos especiales
      const isTypeObject = this.isObject(type, true); //se debe permitir vacio
      const isTypeArray = this.isArray(type, true); //se debe permitir vacio
      if (type === "undefined") {
        r = this.isUndefined(anyValue);
      } else if (type === "null") {
        r = this.isNull(anyValue);
      } else if (type === "function") {
        r = this.isFunction(anyValue);
      } else if (type === "boolean") {
        r = this.isBoolean(anyValue);
      } else if (type === "number") {
        r = this.isNumber(anyValue, allowNumber_String);
      } else if (type === "bigint") {
        r = this.isBigint(anyValue, allowBigint_String);
      } else if (type === "string") {
        r = this.isString(anyValue, allowStringEmpty);
      } else if (type === "object" || isTypeObject) {
        r = this.isObject(anyValue, allowObjectEmpty);
        if (r && !allowObjectEmpty && isTypeObject) {
          //casos profundos
          const entTypes = Object.entries(type);
          if (entTypes.length > 0) {
            r = entTypes.reduce((accV, currV) => {
              if (accV === false) return false; //si algun type no se cumplió, inabilita la reducción
              const [key, typesForObjProp] = currV;
              const subAnyValue = anyValue[key];
              const r = this.isValueType(subAnyValue, typesForObjProp, op);
              return r;
            }, true);
          }
        }
      } else if (type === "array" || isTypeArray) {
        r = this.isArray(anyValue, allowArrayEmpty);
        if (
          r &&
          !allowArrayEmpty &&
          isTypeArray &&
          (type as any[]).length > 0
        ) {
          if ((anyValue as any[]).length > 0) {
            //verificar si dentro de type existe mas de un elemento array (posbile tuple)
            let aIdxSubArrayType: number[] = [];
            for (let idx = 0; idx < (types as any[]).length; idx++) {
              if (this.isArray(types[idx], true)) aIdxSubArrayType.push(idx);
            }
            const maxLimitArray = 1;
            if (aIdxSubArrayType.length <= maxLimitArray && !tupleSize) {
              r = (anyValue as any[]).reduce((accV, currV, idx) => {
                if (accV === false) return accV; //si algun type no se cumplió, inabilita la reducción
                const subAnyValue = anyValue[idx];
                const r = this.isValueType(subAnyValue, type as any[], op);
                return r;
              }, true);
            } else {
              //verificador de tupla especial
              const logicTupleSize =
                this.isNumber(op.tupleSize) || this.isTuple(op.tupleSize, 2)
                  ? op.tupleSize
                  : aIdxSubArrayType.length;
              r = this.isTuple(anyValue, logicTupleSize);
              if (r) {
                r = aIdxSubArrayType.reduce((accV, idxSAT, idx) => {
                  if (accV === false) return accV;
                  const subAnyValue = anyValue[idx];
                  const subTType = types[idxSAT] as any[];
                  const r = this.isValueType(subAnyValue, subTType, op);
                  return r;
                }, r as boolean);
              }
            }
          } else {
            r = false;
          }
        }
      } else if (type === "tuple") {
        if (
          !(
            this.isNumber(tupleSize) ||
            (this.isTuple(tupleSize, 2) &&
              (tupleSize as any[]).every((tValue) => this.isNumber(tValue)))
          )
        )
          throw new Error(`${tupleSize} is not tuple size valid`);
        r = this.isTuple(anyValue, tupleSize);
      } else {
        throw new Error(`${type} is not selector type valid`);
      }
    }
    return r;
  }
  /**
   * Permite comparar dos valores para determinar si son equivalentes.
   *
   * ⚠ funciona en base a equivalencia (no igualdad),
   * porque los objetos no se igualan `{} === {}` ya que eso
   * compara referencia no contenido.
   *
   * **⚠⚠ Importante los pesos de los tipos ⚠⚠**
   *
   * Lista de pesos (de menor a mayor peso):
   *
   * - `undefined`
   * - `null`
   * - `boolean`
   * - `number`
   * - `string-number` cuando esta activada `isCompareStringToNumber`
   * - `bigint`
   * - `string`
   * - `object`
   * - `array`
   * - `function`
   *
   * los pesos son estrictos y tienen en cuenta el tipo. Ejemplo:
   *  - `A` es mas pesado que `a` //cuando es case sensitive
   *  - `0` es mas pesado que `true`.
   *  - `true` es mas pesado que `false`.
   *  - `false` es mas pesado que null
   *  - `null` es mas pesado que `undefined`
   *
   * @param {[any, any]} compareValues Tupla con los valores a comparar.
   * @param {object} option Configuración para realizar la comparación:
   *   - `keyOrKeysPath`: (solo para objetos o array de objetos) claves identificadoras de las propiedades que se usarán para comparar.
   *   - `isCompareLength`: (solo arrays) determina si se compara el tamaño de los arrays.
   *   - `isCompareSize`: (solo para objetos) determina si se comparan la cantidad de objetos.
   *   - `isCompareStringToNumber`: (solo para string posiblemente numérico) determina que en la comparación los string numéricos sean comparados como si fueran números (`2` sería equivalente a `"2"`).
   *   - `isCaseSensitiveForString`: (solo para string) si la comparación es sensitiva a mayúsculas y minúsculas.
   *   - `isStringLocaleMode`: (solo para string) si se usan métodos de comparación asumiendo la configuración regional del sistema.
   * @returns {boolean} Retorna `true` si los valores son equivalentes según los criterios definidos, `false` de lo contrario.
   *
   * @example
   * ````typescript
   * let a;
   * let b;
   * let r;
   *
   * //comparacion basica de primitivos (mismo tipo (1))
   * a = 1;
   * b = 1;
   * r = isEquivalentTo([a, b], {}); //sin configuracion
   * console.log(r); // Salida: true
   *
   * //comparacion basica de primitivos (mismo tipo (2))
   * a = -1;
   * b = 1;
   * r = isEquivalentTo([a, b], {}); //sin configuracion
   * console.log(r); // Salida: false
   *
   * //comparacion basica de primitivos (mismo tipo (3))
   * a = ()=>"hola";
   * b = (p)=>p;
   * r = isEquivalentTo([a, b], {}); //sin configuracion
   * console.log(r); // Salida: false (son diferentes funciones)
   *
   * //comparacion basica de primitivos (diferente tipo (1))
   * a = undefined;
   * b = null;
   * r = isEquivalentTo([a, b], {}); //sin configuracion
   * console.log(r); // Salida: false
   *
   * //comparacion basica de primitivos (diferente tipo (2))
   * a = "1";
   * b = 1;
   * r = isEquivalentTo([a, b], {}); //sin configuracion
   * console.log(r); // Salida: false ("1" es string y es diferente a number)
   *
   * //comparacion basica de primitivos
   * //(diferente tipo, con `isCompareStringToNumber` (3))
   * a = "1";
   * b = 1;
   * r = isEquivalentTo([a, b], {
   *   isCompareStringToNumber: true
   * });
   * console.log(r); // Salida: true
   *
   * //comparacion basica de objetos
   * a = {a: "hola", b:31};
   * b = {a: "hola", b:15};
   * r = isEquivalentTo([a, b], {}); //sin configuracion
   * console.log(r); // Salida: false (la propiedad `b` es diferente)
   *
   * //comparacion basica de objetos (con keysOrKeysPath)
   * a = {a: "hola", b:31};
   * b = {a: "hola", b:15};
   * r = isEquivalentTo([a, b], {
   *   keyOrKeysPath: "a" //comparar por esta propiedad
   * }); //sin configuracion
   * console.log(r); // Salida: true (la propiedad `b` es diferente,
   * //pero se esta comparando solo por la propiedad `a`)
   *
   * //comparacion de objetos (con keysOrKeysPath y profundidad)
   * a = {a: "hola", b:{c: 31, d: 15}};
   * b = {a: "hola", b:{c: 0, d: 15}};
   * r = isEquivalentTo([a, b], {
   *   keyOrKeysPath: ["a", "b.d"] //comparar por estas propiedades (recordar "b.d" es la ruta a la propiedad profunda)
   * });
   * console.log(r); // Salida: true
   *
   * //comparacion basica de arrays
   * a = ["a", 1, false];
   * b = ["a", 1, true];
   * r = isEquivalentTo([a, b], {}); //sin configuracion
   * console.log(r); // Salida: false (el ultimo elemento es diferente)
   *
   * //comparacion basica de arrays
   * a = ["a", 1, false];
   * b = ["a", 1, false];
   * r = isEquivalentTo([a, b], {}); //sin configuracion
   * console.log(r); // Salida: true
   *
   * //comparacion basica de arrays (no tamaños)
   * a = ["a", 1, false, 2];
   * b = ["a", 1, false];
   * r = isEquivalentTo([a, b], {}); //sin configuracion
   * console.log(r); // Salida: true (porque no se esta comprando tamaños y
   * //se compararán los elementos del array mas pequeño con el mas grande
   * //en la misma posicion donde estan)
   *
   * //comparacion basica de arrays (no tamaños)
   * a = ["a", 1, 2, false,];
   * b = ["a", 1, false];
   * r = isEquivalentTo([a, b], {}); //sin configuracion
   * console.log(r); // Salida: false (porque no se esta comprando tamaños pero
   * //se compararán los elementos del array mas pequeño con el mas grande
   * //en la misma posicion donde estan (`2` es diferente a `false`))
   *
   * //comparacion basica de arrays (si tamaños)
   * a = ["a", 1, false, 2];
   * b = ["a", 1, false];
   * r = isEquivalentTo([a, b], {
   *   isCompareLength: true
   * }); //sin configuracion
   * console.log(r); // Salida: fasle (los tamaños son difernetes,
   * //las demas comparaciones internas se ignoran)
   *
   * ````
   */
  public isEquivalentTo(
    compareValues: [any, any],
    option?: Omit<IOptionEqGtLt, "isAllowEquivalent" | "isMatrixCompared">
  ): boolean {
    if (!this.isTuple(compareValues, [0, 2])) {
      //verificar si almenos se intentó un array
      if (this.isArray(compareValues, true)) {
        //si es vacio es como comparar `undefined === undefined`
        if ((compareValues as any[]).length === 0) return true;
        //si solo tiene un elemento es como si comparara a `any === undefined`
        if ((compareValues as any[]).length === 1) return false;
      }
      throw new Error(`${option} is not tuple of compare values valid`);
    }
    //constructor de opciones
    let op = this.isObject(option, true) ? option : ({} as typeof option); //default vacio
    op = {
      ...op, //opciones adicionales no documentadas (si las hay)
      isCompareLength: this.isBoolean(op.isCompareLength)
        ? op.isCompareLength
        : false,
      isStrictArrayOrder: this.isBoolean(op.isStrictArrayOrder)
        ? op.isStrictArrayOrder
        : true,
      isCompareSize: this.isBoolean(op.isCompareSize)
        ? op.isCompareSize
        : false,
      keyOrKeysPath: this.castArrayByConditionType(
        op.keyOrKeysPath,
        "string",
        []
      ),
      charSeparator: this.isString(op.charSeparator)
        ? op.charSeparator
        : this.charSeparatorLogicPath,
      isCompareStringToNumber: this.isBoolean(op.isCompareStringToNumber)
        ? op.isCompareStringToNumber
        : false,
      isCaseSensitiveForString: this.isBoolean(op.isCaseSensitiveForString)
        ? op.isCaseSensitiveForString
        : true,
    };
    let {
      isCompareLength,
      isStrictArrayOrder,
      isCompareSize,
      keyOrKeysPath,
      charSeparator,
      isCompareStringToNumber,
      isCaseSensitiveForString,
    } = op;
    //Inicio de proceso
    const [valueBase, valueToCompare] = compareValues;
    let isEquivalent = true; //obligatorio iniciar con true
    //eliminar claves identificadoras repetidas
    let keysPath = keyOrKeysPath as string[];
    keysPath = [...new Set(keysPath as string[])];
    //comparar function
    if (this.isFunction(valueBase) && this.isFunction(valueToCompare)) {
      const regExpCompress = /(\r\n|\n|\r| |;)/gm; //quitar caracteres
      const str_fnItemBase = (valueBase as Function)
        .toString()
        .replace(regExpCompress, "");
      const str_fnItem = (valueToCompare as Function)
        .toString()
        .replace(regExpCompress, "");
      isEquivalent = str_fnItemBase === str_fnItem;
    }
    //comparar array
    else if (
      this.isArray(valueBase, true) &&
      this.isArray(valueToCompare, true)
    ) {
      const lenItemBase = (valueBase as any[]).length;
      const lenItemToCompare = (valueToCompare as any[]).length;
      const isEmpty = lenItemBase === 0 && lenItemToCompare === 0;
      //comparar tamaños
      if ((isCompareLength && lenItemBase !== lenItemToCompare) || isEmpty) {
        isEquivalent = isEmpty;
      } else {
        //el len a usar como base de recorrido
        let lenItemRun =
          lenItemBase <= lenItemToCompare ? lenItemBase : lenItemToCompare;
        //comprobar elemento por elemento
        for (let sIdx = 0; sIdx < lenItemRun; sIdx++) {
          if (isStrictArrayOrder) {
            //comporbacion ordenada (menos costosa)
            const itemVB = valueBase[sIdx];
            const itemVC = valueToCompare[sIdx];
            isEquivalent = this.isEquivalentTo([itemVB, itemVC], {
              ...op,
              keyOrKeysPath: keysPath,
            });
          } else {
            //comporbacion desordenada (muy muy costosa)
            const itemVB = valueBase[sIdx];
            isEquivalent = (valueToCompare as any[]).some((itemVC) => {
              return this.isEquivalentTo([itemVB, itemVC], {
                ...op,
                keyOrKeysPath: keysPath,
              });
            });
          }
          if (isEquivalent === false) break;
        }
      }
    }
    //comparar objeto
    else if (
      this.isObject(valueBase, true) &&
      this.isObject(valueToCompare, true)
    ) {
      let keysVB = Object.keys(valueBase);
      let keysVC = Object.keys(valueToCompare);
      if (keysPath.length > 0) {
        const lenVB = keysVB.length;
        const lenVC = keysVC.length;
        if (lenVB === 0 && lenVC === 0) {
          isEquivalent = true;
        } else {
          for (const itemKeyPath of keysPath) {
            const keysSplitPath = itemKeyPath.split(charSeparator);
            const key = keysSplitPath[0];
            keysSplitPath.shift();
            const subKeyOrKeysPath =
              keysSplitPath.length > 0
                ? [keysSplitPath.join(charSeparator)]
                : [];
            const sValueBase = valueBase[key];
            const sValueToCompare = valueToCompare[key];
            isEquivalent = this.isEquivalentTo([sValueBase, sValueToCompare], {
              ...op,
              keyOrKeysPath: subKeyOrKeysPath,
            });
            if (isEquivalent === false) break;
          }
        }
      } else {
        keysVB = keysVB.sort();
        keysVC = keysVC.sort();
        const lenVB = keysVB.length;
        const lenVC = keysVC.length;
        const isEmpty = lenVB === 0 && lenVC === 0;
        if ((isCompareSize && lenVB != lenVC) || isEmpty) {
          isEquivalent = isEmpty;
        } else {
          //las claves identificadoras a recorrer
          let keysRun = lenVB <= lenVC ? keysVB : keysVC;
          //comprobar subobjeto por subobjeto
          for (const keyR of keysRun) {
            const sValueBase = valueBase[keyR];
            const sValueToCompare = valueToCompare[keyR];
            isEquivalent = this.isEquivalentTo([sValueBase, sValueToCompare], {
              ...op,
            });
            if (isEquivalent === false) break;
          }
        }
      }
    }
    //comparar strings
    else if (this.isString(valueBase) && this.isString(valueToCompare)) {
      let strVB = valueBase;
      let strVC = valueToCompare;
      if (!isCaseSensitiveForString) {
        strVB = (valueBase as string).toLocaleLowerCase();
        strVC = (valueToCompare as string).toLocaleLowerCase();
      }
      isEquivalent = strVB === strVC;
    }
    //comparar isBigint
    else if (this.isBigint(valueBase) && this.isBigint(valueToCompare)) {
      isEquivalent = valueBase === valueToCompare;
    }
    //comparar number
    else if (this.isNumber(valueBase) && this.isNumber(valueToCompare)) {
      isEquivalent = valueBase === valueToCompare;
    }
    //comparar caso especial string a number
    else if (
      isCompareStringToNumber &&
      this.isNumber(valueBase, true) &&
      this.isNumber(valueToCompare, true)
    ) {
      isEquivalent =
        this.stringToNumber(valueBase) === this.stringToNumber(valueToCompare);
    }
    //comparar primitivos
    else {
      isEquivalent = valueBase === valueToCompare;
    }
    return isEquivalent;
  }
  /**
   * Permite comparar dos valores para determinar si el primero es mayor que el segundo.
   *
   * ⚠ funciona en base a equivalencia (no igualdad),
   * porque los objetos no se comparan como `{} > {}` ya que eso
   * compara que una referencia sea mayor a la otra, mas no su contenido.
   *
   * **⚠⚠ Importante los pesos de los tipos ⚠⚠**
   *
   * Lista de pesos (de menor a mayor peso):
   *
   * - `undefined`
   * - `null`
   * - `boolean`
   * - `number`
   * - `string-number` cuando esta activada `isCompareStringToNumber`
   * - `bigint`
   * - `string`
   * - `object`
   * - `array`
   * - `function`
   *
   * los pesos son estrictos y tienen en cuenta el tipo. Ejemplo:
   *  - `A` es mas pesado que `a` //cuando es case sensitive
   *  - `0` es mas pesado que `true`.
   *  - `true` es mas pesado que `false`.
   *  - `false` es mas pesado que null
   *  - `null` es mas pesado que `undefined`
   *
   * @param {[any, any]} compareValues Tupla con los valores a comparar donde:
   * - `compareValues[0]` el supuesto valor mayor.
   * - `compareValues[1]` el supuesto valor menor.
   * @param {object} option Configuración para realizar la comparación:
   *   - `isAllowEquivalent` (**Obligatorio**) determina si se permite la equivalencia en la compracion
   *   - `keyOrKeysPath`: (solo para objetos o array de objetos) claves identificadoras de las propiedades que se usarán para comparar.
   *   - `isCompareLength`: (solo arrays) determina si se compara el tamaño de los arrays.
   *   - `isCompareSize`: (solo para objetos) determina si se comparan la cantidad de objetos.
   *   - `isCompareStringToNumber`: (solo para string posiblemente numérico) determina que en la comparación los string numéricos sean comparados como si fueran números (`2` sería equivalente a `"2"`).
   *   - `isCaseSensitiveForString`: (solo para string) si la comparación es sensitiva a mayúsculas y minúsculas.
   *   - `isStringLocaleMode`: (solo para string) si se usan métodos de comparación asumiendo la configuración regional del sistema.
   *   - `isMatrixCompared` : (solo arrays) comparación matricial
   * @returns {boolean} Retorna `true` si los valores son equivalentes según los criterios definidos, `false` de lo contrario.
   *
   * @example
   * ````typescript
   * let a;
   * let b;
   * let r;
   *
   * //comparacion basica de primitivos (mismo tipo (1))
   * a = 1;
   * b = -1;
   * r = isGreaterTo([a, b], {
   *   isAllowEquivalent: false
   * });
   * console.log(r); // Salida: true
   *
   * //comparacion basica de primitivos
   * //(mismo tipo (2), sin permitir equivalencia)
   * a = 1;
   * b = 1;
   * r = isGreaterTo([a, b], {
   *   isAllowEquivalent: false
   * });
   * console.log(r); // Salida: false (la equivalencia no esta permitida)
   *
   * //comparacion basica de primitivos
   * //(mismo tipo (2), con permitir equivalencia)
   * a = 1;
   * b = 1;
   * r = isGreaterTo([a, b], {
   *   isAllowEquivalent: true
   * });
   * console.log(r); // Salida: true (la equivalencia si esta permitida)
   *
   * //comparacion basica de primitivos (mismo tipo (3))
   * a = ()=>"hola";
   * b = (p)=>p;
   * r = isGreaterTo([a, b], {
   *   isAllowEquivalent: false
   * });
   * console.log(r); // Salida: true (internamente las
   * //funciones se comparan transformandolas en
   * //string y comparando sus tamaños, esta trasformacion
   * //elimina caracteres no necesarios para la comparacion
   * //(saltos de linea, tabulaciones y demas))
   *
   * //comparacion basica de primitivos (mismo tipo (4))
   * a = "Edificio";
   * b = "Casa";
   * r = isGreaterTo([a, b], {
   *   isAllowEquivalent: false
   * });
   * console.log(r); // Salida: true (`"E"` de `"Edificio"` pesa mas que `"C"` de casa)
   *
   * //comparacion de primitivos (mismo tipo (5))
   * a = "Edificio";
   * b = "Edificacion";
   * r = isGreaterTo([a, b], {
   *   isAllowEquivalent: false
   * });
   * console.log(r); // Salida: true
   * // (`"Edifici"` pesa mas que `"Edifica"`)
   *
   * //comparacion de primitivos (mismo tipo (6), si sensitivo)
   * a = "juan";
   * b = "Juan";
   * r = isGreaterTo([a, b], {
   *   isAllowEquivalent: false,
   *   isCaseSensitiveForString: true,
   * });
   * console.log(r); // Salida: false (`"j"` pesa menos que `"J"`)
   *
   * //comparacion de primitivos (mismo tipo (7),si equivalencia y no sensitivo)
   * a = "juan";
   * b = "Juan";
   * r = isGreaterTo([a, b], {
   *   isAllowEquivalent: true,
   *   isCaseSensitiveForString: false,
   * });
   * console.log(r); // Salida: true (`"j"` pesa menos que `"J"`
   * //pero al no se sensitivo, se asume que pesan igual)
   *
   * //comparacion basica de primitivos (diferente tipo (1))
   * a = undefined;
   * b = null;
   * r = isGreaterTo([a, b], {
   *   isAllowEquivalent: false
   * });
   * console.log(r); // Salida: false (por que undefined es menos pesado que null)
   *
   * //comparacion basica de primitivos (diferente tipo (2))
   * a = "1";
   * b = 2;
   * r = isGreaterTo([a, b], {
   *   isAllowEquivalent: false,
   * });
   * console.log(r); // Salida: true (`"1"` es string es mas pesado que `2` number)
   *
   * //comparacion basica de primitivos
   * //(diferente tipo, con `isCompareStringToNumber` (3))
   * a = "1";
   * b = 2;
   * r = isGreaterTo([a, b], {
   *   isCompareStringToNumber: true
   * });
   * console.log(r); // Salida: false (`"1"` se comparará a`2` como si ambos fueran number)
   *
   * //comparacion basica de objetos
   * a = {a: "hola", b:31};
   * b = {a: "hola", b:15};
   * r = isGreaterTo([a, b], {
   *   isAllowEquivalent: false,
   * });
   * console.log(r); // Salida: true (la propiedad `b` es mayor en el primer objeto)
   *
   * //comparacion basica de objetos (con keysOrKeysPath)
   * a = {a: "hola", b:31};
   * b = {a: "hola", b:15};
   * r = isGreaterTo([a, b], {
   *   isAllowEquivalent: false,
   *   keyOrKeysPath: "a" //comparar por esta propiedad
   * });
   * console.log(r); // Salida: false (la propiedad `b` es mayor
   * //pero se esta comparando solo por la propiedad `a`)
   *
   * //comparacion basica de objetos (con keysOrKeysPath y equivalencia permitida)
   * a = {a: "hola", b:15, c:1};
   * b = {a: "hola", b:15, c:6};
   * r = isGreaterTo([a, b], {
   *   isAllowEquivalent: true,
   *   keyOrKeysPath: ["a", "b"] //comparar por estas propiedades
   * });
   * console.log(r); // Salida: true (las propiedades `a` y `b` que
   * //se estan comparando son equivalentes)
   *
   * //comparacion basica de objetos (con keysOrKeysPath y equivalencia permitida)
   * a = {a: "adios", b:15000, c: 1000};
   * b = {a: "hola", b:15, c: 6};
   * r = isGreaterTo([a, b], {
   *   isAllowEquivalent: true,
   *   keyOrKeysPath: ["a", "b"] //comparar por estas propiedades ❗El orden es IMPORTANTE❗
   * });
   * console.log(r); // Salida: false (si bien la propiedad `b` es mayor en el primer objeto
   * //la primera comparacion se hace en la propiedad `a` y la letra `"a"` es pesa menos que la letra `"h"`)
   *
   * //comparacion de objetos (con keysOrKeysPath y profundidad)
   * a = {a: "Que Mas", b:{c: 31, d: 15}};
   * b = {a: "hola", b:{c: 0, d: 15}};
   * r = isGreaterTo([a, b], {
   *   isAllowEquivalent: false,
   *   keyOrKeysPath: ["a", "b.d"] //comparar por estas propiedades (recordar "b.d" es la ruta a la propiedad profunda)
   *                               //❗el orden es IMPORTANTE❗
   * });
   * console.log(r); // Salida: true
   *
   * //comparacion basica de arrays
   * a = ["a", 1, false];
   * b = ["a", 1, true];
   * r = isGreaterTo([a, b], {
   *   isAllowEquivalent: false,
   * });
   * console.log(r); // Salida: false (el ultimo elemento `false`
   * //del primer array pesa menos que el ultimo elemento `true`
   * //del segundo array)
   *
   * //comparacion basica de arrays
   * a = ["a", 1, false];
   * b = ["a", 1, false];
   * r = isGreaterTo([a, b], {
   *   isAllowEquivalent: false,
   * });
   * console.log(r); // Salida: false (no se permite la equivalencia)
   *
   * //comparacion basica de arrays (no tamaños)
   * a = ["a", 1, true];
   * b = ["a", 1, false, 2];
   * r = isGreaterTo([a, b], {
   *   isAllowEquivalent: false,
   * });
   * console.log(r); // Salida: true (porque no se esta comparando tamaños y
   * //se compararán los elementos del array mas pequeño con el mas grande
   * //en la misma posicion donde se encuentran)
   *
   * //comparacion basica de arrays (no tamaños)
   * a = ["a", 1, null, false];
   * b = ["a", 1, false];
   * r = isGreaterTo([a, b], {
   *   isAllowEquivalent: false,
   * });
   * console.log(r); // Salida: false (porque no se esta comprando tamaños pero
   * //se compararán los elementos del array mas pequeño con el mas grande
   * //en la misma posicion donde se encuentran (`null` pesa menos que `false`))
   *
   * //comparacion basica de arrays (si tamaños)
   * a = ["a", 1, false, 2];
   * b = ["a", 1, false];
   * r = isGreaterTo([a, b], {,
   *   isAllowEquivalent: false,
   *   isCompareLength: true
   * }); //sin configuracion
   * console.log(r); // Salida: true (el primer array es mas grande que el segundo,
   * //las demas comparaciones internas se ignoran)
   *
   * ````
   */
  public isGreaterTo(
    compareValues: [any, any],
    option?: IOptionEqGtLt
  ): boolean {
    if (!this.isTuple(compareValues, [0, 2]))
      throw new Error(`${option} is not tuple of compare values valid`);
    //constructor de opciones
    let op = this.isObject(option, true) ? option : ({} as typeof option); //default vacio
    op = {
      ...op, //opciones adicionales no documentadas (si las hay)
      isAllowEquivalent: this.isBoolean(op.isAllowEquivalent)
        ? op.isAllowEquivalent
        : false,
      isCompareLength: this.isBoolean(op.isCompareLength)
        ? op.isCompareLength
        : false,
      isStrictArrayOrder: op.isStrictArrayOrder, //isEquivaletnTo se encarga de asignarla
      isMatrixCompared: this.isBoolean(op.isMatrixCompared)
        ? op.isMatrixCompared
        : false,
      isCompareSize: this.isBoolean(op.isCompareSize)
        ? op.isCompareSize
        : false,
      keyOrKeysPath: this.castArrayByConditionType(
        op.keyOrKeysPath,
        "string",
        []
      ),
      charSeparator: this.isString(op.charSeparator)
        ? op.charSeparator
        : this.charSeparatorLogicPath,
      isCompareStringToNumber: this.isBoolean(op.isCompareStringToNumber)
        ? op.isCompareStringToNumber
        : false,
      isCaseSensitiveForString: this.isBoolean(op.isCaseSensitiveForString)
        ? op.isCaseSensitiveForString
        : true,
    };
    let {
      isAllowEquivalent,
      isCompareLength,
      isMatrixCompared,
      isCompareSize,
      keyOrKeysPath,
      charSeparator,
      isCompareStringToNumber,
      isCaseSensitiveForString,
    } = op;
    // casos especiales (evitan comprobaciones innecesarias)
    //si es vacio es como comparar `undefined > undefined` (no es mayor a si mismo, puede ser equivalente)
    if ((compareValues as any[]).length === 0) return isAllowEquivalent;
    //si solo tiene un elemento es como si comparara a `any > undefined` (si es mayor)
    if ((compareValues as any[]).length === 1)
      return (
        !this.isUndefined(compareValues[0]) || //solo si no es `undefined`
        (this.isUndefined(compareValues[0]) && isAllowEquivalent)
      );
    //Inicio de proceso
    const [valueBase, valueToCompare] = compareValues;
    let isGreater = true; //obligatorio iniciar con true
    //eliminar claves identificadoras repetidas
    let keysPath = keyOrKeysPath as string[];
    keysPath = [...new Set(keysPath as string[])];
    //comparar funciones
    if (this.isFunction(valueBase) && this.isFunction(valueToCompare)) {
      const regExpCompress = /(\r\n|\n|\r| |;)/gm; //quitar caracteres
      const str_fnItemBase = (valueBase as Function)
        .toString()
        .replace(regExpCompress, "");
      const str_fnItem = (valueToCompare as Function)
        .toString()
        .replace(regExpCompress, "");
      const modulus = str_fnItemBase.length - str_fnItem.length;
      isGreater = modulus > 0 ? true : isAllowEquivalent && modulus === 0;
    }
    //comparar arrays
    else if (
      this.isArray(valueBase, true) &&
      this.isArray(valueToCompare, true)
    ) {
      const lenItemBase = (valueBase as any[]).length;
      const lenItemToCompare = (valueToCompare as any[]).length;
      //comparar tamaños
      if (
        (isCompareLength && lenItemBase <= lenItemToCompare) ||
        (lenItemBase === 0 && lenItemToCompare === 0)
      ) {
        isGreater = lenItemBase < lenItemToCompare ? false : isAllowEquivalent;
      } else {
        let lenItemRun =
          lenItemBase <= lenItemToCompare
            ? //se selecciona el len mas pequeño para recorrer
              lenItemBase
            : lenItemToCompare;
        let matrixResult = 0;
        //comparar todos los elementos
        for (let idx = 0; idx < lenItemRun; idx++) {
          if (!isMatrixCompared) {
            //comparación ordenada (menos costosa)
            const itemVB = valueBase[idx];
            const itemVC = valueToCompare[idx];
            const isEquivalent = this.isEquivalentTo([itemVB, itemVC], {
              ...op,
            });
            //tratamiento de equivalencias (para seguir al siguinte objeto)
            if (isEquivalent) {
              if (idx < lenItemRun - 1) continue; //solo continuará si esquivalente y no el último
              isGreater = isAllowEquivalent;
              break;
            }
            isGreater = this.isGreaterTo([itemVB, itemVC], {
              ...op,
            });
            break;
          } else {
            //comparación matricial (muy muy costosa)
            const itemVB = valueBase[idx];
            matrixResult = (valueToCompare as any[]).reduce((accMR, itemVC) => {
              const isEq = this.isEquivalentTo([itemVB, itemVC], { ...op });
              const isGr = this.isGreaterTo([itemVB, itemVC], { ...op });
              const result = isEq ? 0 : isGr ? 1 : -1;
              accMR = accMR + result;
              return accMR;
            }, matrixResult);
            if (idx < lenItemRun - 1) continue;
            isGreater =
              matrixResult === 0
                ? isAllowEquivalent
                : matrixResult > 0
                ? true
                : false;
            break;
          }
        }
      }
    }
    //comparar objetos
    else if (
      this.isObject(valueBase, true) &&
      this.isObject(valueToCompare, true)
    ) {
      let keysVB = Object.keys(valueBase);
      let keysVC = Object.keys(valueToCompare);
      if (keysPath.length > 0) {
        const lenKP = keysPath.length;
        const lenVB = keysVB.length; //no necesitan ordenarse
        const lenVC = keysVC.length; //no necesitan ordenarse
        if (lenVB === 0 && lenVC === 0) {
          isGreater = isAllowEquivalent;
        } else {
          for (let idx = 0; idx < lenKP; idx++) {
            const itemKeyPath = keysPath[idx];
            const keysSplitPath = itemKeyPath.split(charSeparator);
            const key = keysSplitPath[0];
            keysSplitPath.shift();
            const subKeysPathToCompare =
              keysSplitPath.length > 0
                ? [keysSplitPath.join(charSeparator)]
                : [];
            const sValueBase = valueBase[key];
            const sValueToCompare = valueToCompare[key];
            //obligatoria para seguir al otro objeto (si son equivalentes)
            const isEquivalent = this.isEquivalentTo(
              [sValueBase, sValueToCompare],
              {
                ...op,
                keyOrKeysPath: subKeysPathToCompare,
              }
            );
            //tratamiento de equivalencias (para seguir al siguinte objeto)
            if (isEquivalent) {
              if (idx < lenKP - 1) continue; //solo continuará si esquivalente y no el último
              isGreater = isAllowEquivalent;
              break;
            }
            //compare mayor
            isGreater = this.isGreaterTo([sValueBase, sValueToCompare], {
              ...op,
              keyOrKeysPath: subKeysPathToCompare,
            });
            break;
          }
        }
      } else {
        keysVB = keysVB.sort();
        keysVC = keysVC.sort();
        const lenVB = keysVB.length;
        const lenVC = keysVC.length;
        if ((isCompareSize && lenVB <= lenVC) || (lenVB === 0 && lenVC === 0)) {
          isGreater = keysVB.length < keysVC.length ? false : isAllowEquivalent;
        } else {
          //las claves identificadoras a recorrer
          let keysRun = lenVB <= lenVC ? keysVB : keysVC;
          const lenKR = keysRun.length;
          //comprobar subobjeto por subobjeto
          for (let idx = 0; idx < lenKR; idx++) {
            const keyR = keysRun[idx];
            const sValueBase = valueBase[keyR];
            const sValueToCompare = valueToCompare[keyR];
            //obligatoria para seguir al otro objeto (si son equivalentes)
            const isEquivalent = this.isEquivalentTo(
              [sValueBase, sValueToCompare],
              {
                ...op,
              }
            );
            //tratamiento de equivalencias (para seguir al siguinte objeto)
            if (isEquivalent) {
              if (idx < lenKR - 1) continue;
              isGreater = isAllowEquivalent;
              break;
            }
            isGreater = this.isGreaterTo([sValueBase, sValueToCompare], {
              ...op,
            });
            break;
          }
        }
      }
    }
    //comparar strings
    else if (this.isString(valueBase) && this.isString(valueToCompare)) {
      let strVB = valueBase;
      let strVC = valueToCompare;
      if (!isCaseSensitiveForString) {
        strVB = (valueBase as string).toLocaleLowerCase();
        strVC = (valueToCompare as string).toLocaleLowerCase();
      }
      const modulus = (strVB as string).localeCompare(strVC, undefined, {
        caseFirst: "lower",
      });
      isGreater = modulus > 0 ? true : isAllowEquivalent && modulus === 0;
    }
    //comparar isBigint
    else if (this.isBigint(valueBase) && this.isBigint(valueToCompare)) {
      const modulus = (valueBase as bigint) - (valueToCompare as bigint);
      isGreater = modulus > 0 ? true : isAllowEquivalent && modulus === 0n;
    }
    //comparar number
    else if (this.isNumber(valueBase) && this.isNumber(valueToCompare)) {
      const modulus = (valueBase as number) - (valueToCompare as number);
      isGreater = modulus > 0 ? true : isAllowEquivalent && modulus === 0;
    }
    //comparar caso especial string a number
    else if (
      this.isNumber(valueBase, isCompareStringToNumber) &&
      this.isNumber(valueToCompare, isCompareStringToNumber)
    ) {
      const modulus =
        this.stringToNumber(valueBase) - this.stringToNumber(valueToCompare);
      isGreater = modulus > 0 ? true : isAllowEquivalent && modulus === 0;
    }
    //comparar caso especial boolean (true pesa mas que false)
    else if (this.isBoolean(valueBase) && this.isBoolean(valueToCompare)) {
      const modulus =
        (valueBase as any as number) - (valueToCompare as any as number); //que locura javascript 🤯
      isGreater = modulus > 0 ? true : isAllowEquivalent && modulus === 0;
    }
    //comparar caso especial null
    else if (this.isNull(valueBase) && this.isNull(valueToCompare)) {
      isGreater = isAllowEquivalent;
    }
    //comparar caso especial undefined
    else if (this.isUndefined(valueBase) && this.isUndefined(valueToCompare)) {
      isGreater = isAllowEquivalent;
    }
    //comparar primitivos
    else {
      if (this.isUndefined(valueBase)) {
        isGreater = false;
      } else if (this.isNull(valueBase)) {
        isGreater = this.isUndefined(valueToCompare);
      } else if (this.isBoolean(valueBase)) {
        isGreater =
          this.isUndefined(valueToCompare) || this.isNull(valueToCompare);
      } else if (this.isNumber(valueBase, false)) {
        isGreater =
          this.isUndefined(valueToCompare) ||
          this.isNull(valueToCompare) ||
          this.isBoolean(valueToCompare);
      } else if (this.isBigint(valueBase, false)) {
        isGreater =
          this.isUndefined(valueToCompare) ||
          this.isNull(valueToCompare) ||
          this.isBoolean(valueToCompare) ||
          this.isNumber(valueToCompare);
      } else if (this.isString(valueBase, true)) {
        isGreater =
          this.isUndefined(valueToCompare) ||
          this.isNull(valueToCompare) ||
          this.isBoolean(valueToCompare) ||
          this.isNumber(valueToCompare) ||
          this.isBigint(valueToCompare);
      } else if (this.isObject(valueBase, true)) {
        isGreater =
          this.isUndefined(valueToCompare) ||
          this.isNull(valueToCompare) ||
          this.isBoolean(valueToCompare) ||
          this.isNumber(valueToCompare) ||
          this.isBigint(valueToCompare) ||
          this.isString(valueToCompare, true);
      } else if (this.isArray(valueBase, true)) {
        isGreater =
          this.isUndefined(valueToCompare) ||
          this.isNull(valueToCompare) ||
          this.isBoolean(valueToCompare) ||
          this.isNumber(valueToCompare) ||
          this.isBigint(valueToCompare) ||
          this.isString(valueToCompare, true) ||
          this.isObject(valueToCompare, true);
      } else if (this.isFunction(valueBase)) {
        isGreater =
          this.isUndefined(valueToCompare) ||
          this.isNull(valueToCompare) ||
          this.isBoolean(valueToCompare) ||
          this.isNumber(valueToCompare) ||
          this.isBigint(valueToCompare) ||
          this.isString(valueToCompare, true) ||
          this.isObject(valueToCompare, true) ||
          this.isArray(valueToCompare, true);
      } else {
        isGreater = true;
      }
    }
    return isGreater;
  }
  /**
   * Permite comparar dos valores para determinar si el primero es menor que el segundo.
   *
   * ⚠ funciona en base a equivalencia (no igualdad),
   * porque los objetos no se comparan como `{} < {}` ya que eso
   * compara que una referencia sea menor a la otra, mas no su contenido.
   *
   * **⚠⚠ Importante los pesos de los tipos ⚠⚠**
   *
   * Lista de pesos (de menor a mayor peso):
   *
   * - `undefined`
   * - `null`
   * - `boolean`
   * - `number`
   * - `string-number` cuando esta activada `isCompareStringToNumber`
   * - `string`
   * - `object`
   * - `array`
   * - `function`
   *
   * los pesos son estrictos y tienen en cuenta el tipo. Ejemplo:
   *  - `A` es mas pesado que `a` //cuando es case sensitive
   *  - `0` es mas pesado que `true`.
   *  - `true` es mas pesado que `false`.
   *  - `false` es mas pesado que null
   *  - `null` es mas pesado que `undefined`
   *
   * @param {[any, any]} compareValues Tupla con los valores a comparar donde:
   * - `compareValues[0]` el supuesto valor menor.
   * - `compareValues[1]` el supuesto valor mayor.
   * @param {object} option Configuración para realizar la comparación:
   *   - `isAllowEquivalent` (**Obligatorio**) determina si se permite la equivalencia en la compracion
   *   - `keyOrKeysPath`: (solo para objetos o array de objetos) claves identificadoras de las propiedades que se usarán para comparar.
   *   - `isCompareLength`: (solo arrays) determina si se compara el tamaño de los arrays.
   *   - `isCompareSize`: (solo para objetos) determina si se comparan la cantidad de objetos.
   *   - `isCompareStringToNumber`: (solo para string posiblemente numérico) determina que en la comparación los string numéricos sean comparados como si fueran números (`2` sería equivalente a `"2"`).
   *   - `isCaseSensitiveForString`: (solo para string) si la comparación es sensitiva a mayúsculas y minúsculas.
   *   - `isStringLocaleMode`: (solo para string) si se usan métodos de comparación asumiendo la configuración regional del sistema.
   *   - `isMatrixCompared` : (solo arrays) comparación matricial
   * @returns {boolean} Retorna `true` si los valores son equivalentes según los criterios definidos, `false` de lo contrario.
   *
   * @example
   * ````typescript
   * let a;
   * let b;
   * let r;
   *
   * //comparacion basica de primitivos (mismo tipo (1))
   * a = -1;
   * b = 1;
   * r = isLesserTo([a, b], {
   *   isAllowEquivalent: false
   * });
   * console.log(r); // Salida: true
   *
   * //comparacion basica de primitivos
   * //(mismo tipo (2), sin permitir equivalencia)
   * a = 1;
   * b = 1;
   * r = isLesserTo([a, b], {
   *   isAllowEquivalent: false
   * });
   * console.log(r); // Salida: false (la equivalencia no esta permitida)
   *
   * //comparacion basica de primitivos
   * //(mismo tipo (2), con permitir equivalencia)
   * a = 1;
   * b = 1;
   * r = isLesserTo([a, b], {
   *   isAllowEquivalent: true
   * });
   * console.log(r); // Salida: true (la equivalencia si esta permitida)
   *
   * //comparacion basica de primitivos (mismo tipo (3))
   * a = ()=>"hola";
   * b = (p)=>p;
   * r = isLesserTo([a, b], {
   *   isAllowEquivalent: false
   * });
   * console.log(r); // Salida: false (internamente las
   * //funciones se comparan transformandolas en
   * //string y comparando sus tamaños, esta trasformacion
   * //elimina caracteres no necesarios para la comparacion
   * //(saltos de linea, tabulaciones y demas))
   *
   * //comparacion basica de primitivos (mismo tipo (4))
   * a = "Casa";
   * b = "Edificio";
   * r = isLesserTo([a, b], {
   *   isAllowEquivalent: false
   * });
   * console.log(r); // Salida: true (`"C"` de casa` pesa menos que "E"` de `"Edificio"`)
   *
   * //comparacion de primitivos (mismo tipo (5))
   * a = "Edificio";
   * b = "Edificacion";
   * r = isLesserTo([a, b], {
   *   isAllowEquivalent: false
   * });
   * console.log(r); // Salida: false
   * // (`"Edifici"` pesa mas que `"Edifica"`)
   *
   * //comparacion de primitivos (mismo tipo (6), si sensitivo)
   * a = "Juan";
   * b = "juan";
   * r = isLesserTo([a, b], {
   *   isAllowEquivalent: false,
   *   isCaseSensitiveForString: true,
   * });
   * console.log(r); // Salida: false (`"J"` pesa mas que `"j"`)
   *
   * //comparacion de primitivos (mismo tipo (7),si equivalencia y no sensitivo)
   * a = "Juan";
   * b = "juan";
   * r = isLesserTo([a, b], {
   *   isAllowEquivalent: true,
   *   isCaseSensitiveForString: false,
   * });
   * console.log(r); // Salida: true (`"J"` pesa mas que `"j"`
   * //pero al no se sensitivo, se asume que pesan igual)
   *
   * //comparacion basica de primitivos (diferente tipo (1))
   * a = undefined;
   * b = null;
   * r = isLesserTo([a, b], {
   *   isAllowEquivalent: false
   * });
   * console.log(r); // Salida: true (por que `undefined` es pesa menos que `null`)
   *
   * //comparacion basica de primitivos (diferente tipo (2))
   * a = "1";
   * b = 2;
   * r = isLesserTo([a, b], {
   *   isAllowEquivalent: false,
   * });
   * console.log(r); // Salida: false (`"1"` es string es mas pesado que `2` number)
   *
   * //comparacion basica de primitivos
   * //(diferente tipo, con `isCompareStringToNumber` (3))
   * a = "1";
   * b = 2;
   * r = isLesserTo([a, b], {
   *   isCompareStringToNumber: true
   * });
   * console.log(r); // Salida: true (`"1"` se comparará a`2` como si ambos fueran number)
   *
   * //comparacion basica de objetos
   * a = {a: "hola", b:31};
   * b = {a: "hola", b:15};
   * r = isLesserTo([a, b], {
   *   isAllowEquivalent: false,
   * });
   * console.log(r); // Salida: false (la propiedad `b` es mayor en el primer objeto)
   *
   * //comparacion basica de objetos (con keysOrKeysPath)
   * a = {a: "hola", b:15};
   * b = {a: "hola", b:31};
   * r = isLesserTo([a, b], {
   *   isAllowEquivalent: false,
   *   keyOrKeysPath: "a" //comparar por esta propiedad
   * });
   * console.log(r); // Salida: false (la propiedad `b` es menor
   * //pero se esta comparando solo por la propiedad `a`)
   *
   * //comparacion basica de objetos (con keysOrKeysPath y equivalencia permitida)
   * a = {a: "hola", b:15, c:1};
   * b = {a: "hola", b:15, c:6};
   * r = isLesserTo([a, b], {
   *   isAllowEquivalent: true,
   *   keyOrKeysPath: ["a", "b"] //comparar por estas propiedades
   * });
   * console.log(r); // Salida: true (las propiedades `a` y `b` que
   * //se estan comparando son equivalentes)
   *
   * //comparacion basica de objetos (con keysOrKeysPath y equivalencia permitida)
   * a = {a: "adios", b:15000, c: 1000};
   * b = {a: "hola", b:15, c: 6};
   * r = isLesserTo([a, b], {
   *   isAllowEquivalent: true,
   *   keyOrKeysPath: ["a", "b"] //comparar por estas propiedades ❗El orden es IMPORTANTE❗
   * });
   * console.log(r); // Salida: true (si bien la propiedad `b` es mayor en el primer objeto
   * //la primera comparacion se hace en la propiedad `a` y la letra `"a"` es pesa menos que la letra `"h"`)
   *
   * //comparacion de objetos (con keysOrKeysPath y profundidad)
   * a = {a: "hola", b:{c: 31, d: 15}};
   * b = {a: "que Mas", b:{c: 0, d: 15}};
   * r = isLesserTo([a, b], {
   *   isAllowEquivalent: false,
   *   keyOrKeysPath: ["a", "b.d"] //comparar por estas propiedades (recordar "b.d" es la ruta a la propiedad profunda)
   *                               //❗el orden es IMPORTANTE❗
   * });
   * console.log(r); // Salida: true
   *
   * //comparacion basica de arrays
   * a = ["a", 1, false];
   * b = ["a", 1, true];
   * r = isLesserTo([a, b], {
   *   isAllowEquivalent: false,
   * });
   * console.log(r); // Salida: true (el ultimo elemento `false`
   * //del primer array pesa menos que el ultimo elemento `true`
   * //del segundo array)
   *
   * //comparacion basica de arrays
   * a = ["a", 1, false];
   * b = ["a", 1, false];
   * r = isLesserTo([a, b], {
   *   isAllowEquivalent: false,
   * });
   * console.log(r); // Salida: false (no se permite la equivalencia)
   *
   * //comparacion basica de arrays (no tamaños)
   * a = ["a", 1, true];
   * b = ["a", 1, false, 2];
   * r = isLesserTo([a, b], {
   *   isAllowEquivalent: false,
   * });
   * console.log(r); // Salida: true (porque no se esta comparando tamaños y
   * //se compararán los elementos del array mas pequeño con el mas grande
   * //en la misma posicion donde se encuentran)
   *
   * //comparacion basica de arrays (no tamaños)
   * a = ["a", 1, null, false];
   * b = ["a", 1, false];
   * r = isLesserTo([a, b], {
   *   isAllowEquivalent: false,
   * });
   * console.log(r); // Salida: true (porque no se esta comprando tamaños pero
   * //se compararán los elementos del array mas pequeño con el mas grande
   * //en la misma posicion donde se encuentran (`null` pesa menos que `false`))
   *
   * //comparacion basica de arrays (si tamaños)
   * a = ["a", 1, false, 2];
   * b = ["a", 1, false];
   * r = isLesserTo([a, b], {,
   *   isAllowEquivalent: false,
   *   isCompareLength: true
   * }); //sin configuracion
   * console.log(r); // Salida: false (el primer array es mas grande que el segundo,
   * //las demas comparaciones internas se ignoran)
   *
   * ````
   */
  public isLesserTo(
    compareValues: [any, any],
    option?: IOptionEqGtLt
  ): boolean {
    if (!this.isTuple(compareValues, [0, 2]))
      throw new Error(`${option} is not tuple of compare values valid`);
    //constructor de opciones
    let op = this.isObject(option, true) ? option : ({} as typeof option); //default vacio
    op = {
      ...op, //opciones adicionales no documentadas (si las hay)
      isAllowEquivalent: this.isBoolean(op.isAllowEquivalent)
        ? op.isAllowEquivalent
        : false,
      isCompareLength: this.isBoolean(op.isCompareLength)
        ? op.isCompareLength
        : false,
      isStrictArrayOrder: op.isStrictArrayOrder, //isEquivaletnTo se encarga de asignarla
      isMatrixCompared: this.isBoolean(op.isMatrixCompared)
        ? op.isMatrixCompared
        : false,
      isCompareSize: this.isBoolean(op.isCompareSize)
        ? op.isCompareSize
        : false,
      keyOrKeysPath: this.castArrayByConditionType(
        op.keyOrKeysPath,
        "string",
        []
      ),
      charSeparator: this.isString(op.charSeparator)
        ? op.charSeparator
        : this.charSeparatorLogicPath,
      isCompareStringToNumber: this.isBoolean(op.isCompareStringToNumber)
        ? op.isCompareStringToNumber
        : false,
      isCaseSensitiveForString: this.isBoolean(op.isCaseSensitiveForString)
        ? op.isCaseSensitiveForString
        : true,
    };
    let {
      isAllowEquivalent,
      isCompareLength,
      isMatrixCompared,
      isCompareSize,
      keyOrKeysPath,
      charSeparator,
      isCompareStringToNumber,
      isCaseSensitiveForString,
    } = op;
    // casos especiales (evitan comprobaciones innecesarias)
    //si es vacio es como comparar `undefined < undefined` (no es menor a si mismo, puede ser equivalente)
    if ((compareValues as any[]).length === 0) return op.isAllowEquivalent;
    //si solo tiene un elemento es como si comparara a `any < undefined`
    if ((compareValues as any[]).length === 1)
      return this.isUndefined(compareValues[0]) && op.isAllowEquivalent;
    //Inicio de proceso
    const [valueBase, valueToCompare] = compareValues;
    let isLesser = true; //obligatorio iniciar con true
    //eliminar claves identificadoras repetidas
    let keysPath = keyOrKeysPath as string[];
    keysPath = [...new Set(keysPath as string[])];
    //comparar funciones
    if (this.isFunction(valueBase) && this.isFunction(valueToCompare)) {
      const regExpCompress = /(\r\n|\n|\r| |;)/gm; //quitar caracteres
      const str_fnItemBase = (valueBase as Function)
        .toString()
        .replace(regExpCompress, "");
      const str_fnItem = (valueToCompare as Function)
        .toString()
        .replace(regExpCompress, "");
      const modulus = str_fnItemBase.length - str_fnItem.length;
      isLesser = modulus < 0 ? true : isAllowEquivalent && modulus === 0;
    }
    //comparar arrays
    else if (
      this.isArray(valueBase, true) &&
      this.isArray(valueToCompare, true)
    ) {
      const lenItemBase = (valueBase as any[]).length;
      const lenItemToCompare = (valueToCompare as any[]).length;
      //comparar tamaños
      if (
        (isCompareLength && lenItemBase >= lenItemToCompare) ||
        (lenItemBase === 0 && lenItemToCompare === 0)
      ) {
        isLesser = lenItemBase > lenItemToCompare ? false : isAllowEquivalent;
      } else {
        let lenItemRun =
          lenItemBase <= lenItemToCompare
            ? //se selecciona el len mas pequeño para recorrer
              lenItemBase
            : lenItemToCompare;
        let matrixResult = 0;
        //comparar todos loes elementos
        for (let idx = 0; idx < lenItemRun; idx++) {
          if (!isMatrixCompared) {
            const itemVB = valueBase[idx];
            const itemVC = valueToCompare[idx];
            const isEquivalent = this.isEquivalentTo([itemVB, itemVC], {
              isCaseSensitiveForString,
              isCompareLength,
              isCompareSize,
              isCompareStringToNumber,
              keyOrKeysPath: keysPath,
            });
            //tratamiento de equivalencias (para seguir al siguinte objeto)
            if (isEquivalent) {
              if (idx < lenItemRun - 1) continue; //solo continuará si esquivalente y no el ultimo
              isLesser = isAllowEquivalent;
              break;
            }
            isLesser = this.isLesserTo([itemVB, itemVC], {
              ...op,
            });
            break;
          } else {
            //comparación matricial (muy muy costosa)
            const itemVB = valueBase[idx];
            matrixResult = (valueToCompare as any[]).reduce((accMR, itemVC) => {
              const isEq = this.isEquivalentTo([itemVB, itemVC], { ...op });
              const isLe = this.isLesserTo([itemVB, itemVC], { ...op });
              const result = isEq ? 0 : isLe ? -1 : 1;
              accMR = accMR + result;
              return accMR;
            }, matrixResult);
            if (idx < lenItemRun - 1) continue;
            isLesser =
              matrixResult === 0
                ? isAllowEquivalent
                : matrixResult < 0
                ? true
                : false;
            break;
          }
        }
      }
    }
    //comparar objetos
    else if (
      this.isObject(valueBase, true) &&
      this.isObject(valueToCompare, true)
    ) {
      let keysVB = Object.keys(valueBase);
      let keysVC = Object.keys(valueToCompare);
      if (keysPath.length > 0) {
        const lenKP = keysPath.length;
        const lenVB = keysVB.length; //no necesitan ordenarse
        const lenVC = keysVC.length; //no necesitan ordenarse
        if (lenVB === 0 && lenVC === 0) {
          isLesser = isAllowEquivalent;
        } else {
          for (let idx = 0; idx < lenKP; idx++) {
            const itemKeyPath = keysPath[idx];
            const keysSplitPath = itemKeyPath.split(charSeparator);
            const key = keysSplitPath[0];
            keysSplitPath.shift();
            const subKeysPathToCompare =
              keysSplitPath.length > 0
                ? [keysSplitPath.join(charSeparator)]
                : [];
            const sValueBase = valueBase[key];
            const sValueToCompare = valueToCompare[key];
            //obligatoria para seguir al otro objeto (si son equivalentes)
            const isEquivalent = this.isEquivalentTo(
              [sValueBase, sValueToCompare],
              {
                isCaseSensitiveForString,
                isCompareLength,
                isCompareSize,
                isCompareStringToNumber,
                keyOrKeysPath: subKeysPathToCompare,
              }
            );
            //tratamiento de equivalencias (para seguir al siguinte objeto)
            if (isEquivalent) {
              if (idx < lenKP - 1) continue; //solo continuará si esquivalente y no el ultmo
              isLesser = isAllowEquivalent;
              break;
            }
            //compare mayor
            isLesser = this.isLesserTo([sValueBase, sValueToCompare], {
              isAllowEquivalent,
              keyOrKeysPath: subKeysPathToCompare,
              isCompareLength,
              isCompareSize,
              isCompareStringToNumber,
              isCaseSensitiveForString,
            });
            break;
          }
        }
      } else {
        keysVB = keysVB.sort();
        keysVC = keysVC.sort();
        const lenVB = keysVB.length;
        const lenVC = keysVC.length;
        if ((isCompareSize && lenVB >= lenVC) || (lenVC === 0 && lenVC === 0)) {
          isLesser = keysVB.length > keysVC.length ? false : isAllowEquivalent;
        } else {
          //las claves identificadoras a recorrer
          let keysRun = lenVB <= lenVC ? keysVB : keysVC;
          const lenKR = keysRun.length;
          //comprobar subobjeto por subobjeto
          for (let idx = 0; idx < lenKR; idx++) {
            const keyR = keysRun[idx];
            const sValueBase = valueBase[keyR];
            const sValueToCompare = valueToCompare[keyR];
            //obligatoria para seguir al otro objeto (si son equivalentes)
            const isEquivalent = this.isEquivalentTo(
              [sValueBase, sValueToCompare],
              {
                isCaseSensitiveForString,
                isCompareLength,
                isCompareSize,
                isCompareStringToNumber,
                keyOrKeysPath,
              }
            );
            //tratamiento de equivalencias (para seguir al siguinte objeto)
            if (isEquivalent) {
              if (idx < lenKR - 1) continue;
              isLesser = isAllowEquivalent;
              break;
            }
            isLesser = this.isLesserTo([sValueBase, sValueToCompare], {
              isAllowEquivalent,
              keyOrKeysPath: undefined,
              isCompareLength,
              isCompareSize,
              isCaseSensitiveForString,
              isCompareStringToNumber,
            });
            break;
          }
        }
      }
    }
    //comparar strings
    else if (this.isString(valueBase) && this.isString(valueToCompare)) {
      let strVB = valueBase;
      let strVC = valueToCompare;
      if (!isCaseSensitiveForString) {
        strVB = (valueBase as string).toLocaleLowerCase();
        strVC = (valueToCompare as string).toLocaleLowerCase();
      }
      const modulus = (strVB as string).localeCompare(strVC, undefined, {
        caseFirst: "lower",
      });
      isLesser = modulus < 0 ? true : isAllowEquivalent && modulus === 0;
    }
    //comparar isBigint
    else if (this.isBigint(valueBase) && this.isBigint(valueToCompare)) {
      const modulus = (valueBase as bigint) - (valueToCompare as bigint);
      isLesser = modulus < 0 ? true : isAllowEquivalent && modulus === 0n;
    }
    //comparar number
    else if (this.isNumber(valueBase) && this.isNumber(valueToCompare)) {
      const modulus = (valueBase as number) - (valueToCompare as number);
      isLesser = modulus < 0 ? true : isAllowEquivalent && modulus === 0;
    }
    //comparar caso especial string a number
    else if (
      this.isNumber(valueBase, isCompareStringToNumber) &&
      this.isNumber(valueToCompare, isCompareStringToNumber)
    ) {
      const modulus =
        this.stringToNumber(valueBase) - this.stringToNumber(valueToCompare);
      isLesser = modulus < 0 ? true : isAllowEquivalent && modulus === 0;
    }
    //comparar caso especial boolean (true pesa mas que false)
    else if (this.isBoolean(valueBase) && this.isBoolean(valueToCompare)) {
      const modulus =
        (valueBase as any as number) - (valueToCompare as any as number);
      isLesser = modulus < 0 ? true : isAllowEquivalent && modulus === 0;
    }
    //comparar caso especial null
    else if (this.isNull(valueBase) && this.isNull(valueToCompare)) {
      isLesser = isAllowEquivalent;
    }
    //comparar caso especial undefined
    else if (this.isUndefined(valueBase) && this.isUndefined(valueToCompare)) {
      isLesser = isAllowEquivalent;
    }
    //comparar primitivos
    else {
      if (this.isUndefined(valueBase)) {
        isLesser = true;
      } else if (this.isNull(valueBase)) {
        isLesser = !this.isUndefined(valueToCompare);
      } else if (this.isBoolean(valueBase)) {
        isLesser =
          !this.isUndefined(valueToCompare) && !this.isNull(valueToCompare);
      } else if (this.isNumber(valueBase, false)) {
        isLesser =
          !this.isUndefined(valueToCompare) &&
          !this.isNull(valueToCompare) &&
          !this.isBoolean(valueToCompare);
      } else if (this.isBigint(valueBase, false)) {
        isLesser =
          !this.isUndefined(valueToCompare) &&
          !this.isNull(valueToCompare) &&
          !this.isBoolean(valueToCompare) &&
          !this.isNumber(valueToCompare);
      } else if (this.isString(valueBase, true)) {
        isLesser =
          !this.isUndefined(valueToCompare) &&
          !this.isNull(valueToCompare) &&
          !this.isBoolean(valueToCompare) &&
          !this.isNumber(valueToCompare) &&
          !this.isBigint(valueToCompare);
      } else if (this.isObject(valueBase, true)) {
        isLesser =
          !this.isUndefined(valueToCompare) &&
          !this.isNull(valueToCompare) &&
          !this.isBoolean(valueToCompare) &&
          !this.isNumber(valueToCompare) &&
          !this.isBigint(valueToCompare) &&
          !this.isString(valueToCompare, true);
      } else if (this.isArray(valueBase, true)) {
        isLesser =
          !this.isUndefined(valueToCompare) &&
          !this.isNull(valueToCompare) &&
          !this.isBoolean(valueToCompare) &&
          !this.isNumber(valueToCompare) &&
          !this.isBigint(valueToCompare) &&
          !this.isString(valueToCompare, true) &&
          !this.isObject(valueToCompare, true);
      } else if (this.isFunction(valueBase)) {
        isLesser =
          !this.isUndefined(valueToCompare) &&
          !this.isNull(valueToCompare) &&
          !this.isBoolean(valueToCompare) &&
          !this.isNumber(valueToCompare) &&
          !this.isBigint(valueToCompare) &&
          !this.isString(valueToCompare, true) &&
          !this.isObject(valueToCompare, true) &&
          !this.isArray(valueToCompare, true);
      } else {
        isLesser = false;
      }
    }
    return isLesser;
  }
  /**
   * Permite comparar dos valores y determinar la relación entre ellos, devolviendo un número que indica si el primer valor es menor, igual o mayor que el segundo.
   *
   * Este método es una combinación de `isEquivalentTo`, `isGreaterTo` y `isLesserTo`, y devuelve un valor numérico que representa la relación entre los dos valores:
   * - `-1` si el primer valor es menor que el segundo.
   * - `0` si los valores son equivalentes.
   * - `1` si el primer valor es mayor que el segundo.
   *
   * ⚠ Funciona en base a equivalencia (no igualdad), porque los objetos no se comparan directamente (`{} === {}` compara referencias, no contenido).
   *
   * **⚠⚠ Importante los pesos de los tipos ⚠⚠**
   *
   * Lista de pesos (de menor a mayor peso):
   *
   * - `undefined`
   * - `null`
   * - `boolean`
   * - `number`
   * - `string-number` cuando está activada `isCompareStringToNumber`
   * - `bigint`
   * - `string`
   * - `object`
   * - `array`
   * - `function`
   *
   * Los pesos son estrictos y tienen en cuenta el tipo. Ejemplo:
   *  - `A` es más pesado que `a` (cuando es case sensitive).
   *  - `0` es más pesado que `true`.
   *  - `true` es más pesado que `false`.
   *  - `false` es más pesado que `null`.
   *  - `null` es más pesado que `undefined`.
   *
   * @param {[any, any]} compareValues Tupla con los valores a comparar donde:
   * - `compareValues[0]` es el primer valor a comparar.
   * - `compareValues[1]` es el segundo valor a comparar.
   * @param {object} option Configuración para realizar la comparación:
   *   - `keyOrKeysPath`: (solo para objetos o array de objetos) claves identificadoras de las propiedades que se usarán para comparar.
   *   - `isCompareLength`: (solo arrays) determina si se compara el tamaño de los arrays.
   *   - `isCompareSize`: (solo para objetos) determina si se comparan la cantidad de objetos.
   *   - `isCompareStringToNumber`: (solo para string posiblemente numérico) determina que en la comparación los string numéricos sean comparados como si fueran números (`2` sería equivalente a `"2"`).
   *   - `isCaseSensitiveForString`: (solo para string) si la comparación es sensitiva a mayúsculas y minúsculas.
   *   - `isStringLocaleMode`: (solo para string) si se usan métodos de comparación asumiendo la configuración regional del sistema.
   * @returns {number} Retorna:
   * - `-1` si el primer valor es menor que el segundo.
   * - `0` si los valores son equivalentes.
   * - `1` si el primer valor es mayor que el segundo.
   *
   * @example
   * ```typescript
   * let a;
   * let b;
   * let r;
   *
   * // Comparación básica de primitivos (mismo tipo)
   * a = 1;
   * b = 2;
   * r = anyCompareTo([a, b], {}); // Sin configuración
   * console.log(r); // Salida: -1 (1 es menor que 2)
   *
   * // Comparación básica de primitivos (mismo tipo, equivalentes)
   * a = 1;
   * b = 1;
   * r = anyCompareTo([a, b], {});
   * console.log(r); // Salida: 0 (1 es equivalente a 1)
   *
   * // Comparación básica de primitivos (diferente tipo)
   * a = "1";
   * b = 1;
   * r = anyCompareTo([a, b], { isCompareStringToNumber: true });
   * console.log(r); // Salida: 0 ("1" es equivalente a 1 cuando se compara como número)
   *
   * // Comparación de objetos (con keysOrKeysPath)
   * a = {a: "hola", b: 31};
   * b = {a: "hola", b: 15};
   * r = anyCompareTo([a, b], { keyOrKeysPath: "b" });
   * console.log(r); // Salida: 1 (31 es mayor que 15)
   *
   * // Comparación de arrays (con isCompareLength)
   * a = [1, 2, 3];
   * b = [1, 2];
   * r = anyCompareTo([a, b], { isCompareLength: true });
   * console.log(r); // Salida: 1 (el primer array es más largo que el segundo)
   * ```
   */
  public compareTo(
    compareValues: [any, any],
    option?: Omit<IOptionEqGtLt, "isAllowEquivalent">
  ): number {
    option = this.isObject(option) ? option : {};
    const isEquivalent = this.isEquivalentTo(compareValues, { ...option });
    if (isEquivalent) return 0;
    const isGreater = this.isGreaterTo(compareValues, {
      ...(option as IOptionEqGtLt),
    });
    if (isGreater) return 1;
    const isLesser = this.isLesserTo(compareValues, {
      ...(option as IOptionEqGtLt),
    });
    if (isLesser) return -1;
    throw new Error(`Internal Error in anyCompareTo() method`);
  }
}
