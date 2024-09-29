/**
 * @author MAG magles978@gmail.com]
 *
 */
import Util_Node from "util";
import { TStrCase, TExtPrimitiveTypes, IConfigEqGtLt } from "./shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**
 *
 * utilidades nativas sin extensiones ni librerias
 */
export class UtilNative {
  /**Utilidades implicitas en Node JS*/
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
  /**
   * Almacena la instancia única de esta clase
   * ____
   */
  private static UtilNative_instance: UtilNative;
  /**
   * @param _dfValue es el valor que se va a asumir
   * como valor predefinido cuando haya ausencia de valor
   */
  constructor(
    /**es el valor que se va a asumir como valor
     * predefinido cuando haya ausencia de valor */
    public readonly dfValue: null | undefined
  ) {}
  /**
   * devuelve la instancia única de esta clase
   * ya sea que la crea o la que ya a sido creada
   * @param dfValue es el valor que se va a asumir como valor
   * predefinido cuando haya ausencia de valor
   */
  public static getInstance(defaultValue: null | undefined): UtilNative {
    UtilNative.UtilNative_instance =
      UtilNative.UtilNative_instance === undefined ||
      UtilNative.UtilNative_instance === null
        ? new UtilNative(defaultValue)
        : UtilNative.UtilNative_instance;
    return UtilNative.UtilNative_instance;
  }
  //████Booleanos███████████████████████████████████████████████████
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
  public isBoolean(bool: any): boolean {
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
   */
  public anyToBoolean(
    anyToCast: any,
    castExceptions: Array<"isEmptyAsTrue" | "isZeroAsTrue" | "isNullAsTrue"> = [
      "isZeroAsTrue",
    ]
  ): boolean {
    let r = false;
    if (!this.isArray(castExceptions, true))
      throw new Error(
        `${castExceptions} is not array of cast exceptions valid`
      );
    castExceptions = [...new Set(castExceptions)]; // eliminacion basica de duplicados primitivos
    if (typeof anyToCast === "string") {
      r =
        anyToCast !== "" ||
        (anyToCast === "" && castExceptions.includes("isEmptyAsTrue"));
    } else if (typeof anyToCast === "object" && anyToCast !== null) {
      //incluye arrays
      const isNotEmpty = Object.keys(anyToCast).length > 0;
      r =
        isNotEmpty || (!isNotEmpty && castExceptions.includes("isEmptyAsTrue"));
    } else if (anyToCast === 0) {
      //el caso especial de numero 0
      r = castExceptions.includes("isZeroAsTrue");
    } else if (anyToCast === null) {
      //el caso especial de numero 0
      r = castExceptions.includes("isNullAsTrue");
    } else {
      //lo demas
      r = !!anyToCast; //cast
    }
    return r;
  }
  //████Numeros██████████████████████████████████████████████████████
  /**
   * Determina si el valor proporcionado es un número.
   *
   * @param {any} num El valor a verificar.
   * @param {boolean} allowString `= false`. Determina si se permite que el número se reciba en tipo string.
   * @returns {boolean} Retorna `true` si el valor es un número, `false` de lo contrario.
   */
  public isNumber(num: any, allowString = false): boolean {
    const parse = parseFloat(num);
    allowString = this.anyToBoolean(allowString);
    const r =
      (typeof num === "number" || (typeof num === "string" && allowString)) &&
      !isNaN(parse) &&
      isFinite(parse);
    return r;
  }
  /**dertermina si el número proporcionado corresponde a
   * la polaridad deseada (positiva o negativa)
   *
   * @param {any} num el número a verificar (no se acepta string-number  `"1"`)
   * @param {"+" | "-"} sign el signo (direccion o polaridad) que deberia tener el número
   * @param {boolean} isZeroIncluded `= false`. Si se debe incluir el 0 en la verificacion
   *
   * @return Retorna `true` si corresponde al signo o `false` si no corresponde a signo o no es un número
   */
  public isSignNumber(
    num: any,
    sign: "+" | "-",
    isZeroIncluded = false
  ): boolean {
    let r = this.isNumber(num, false);
    if (!r) return r; //no es numero
    if (sign === "+") r = isZeroIncluded ? num >= 0 : num > 0;
    else if (sign === "-") r = isZeroIncluded ? num <= 0 : num < 0;
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
   *   - `estrictType`: Indica si el número es un "int", "bigInt" o "float".
   *
   * @example
   * ```typescript
   * let report = getTypeNumber("123");
   * console.log(report);
   * // Salida: { polarity: "positive", genericType: "string-number", estrictType: "int" }
   *
   * report = getTypeNumber(-321.654);
   * console.log(report);
   * // Salida: { polarity: "negative", genericType: "number", estrictType: "float" }
   * ```
   */
  public getTypeNumber(num: number | string): {
    polarity: "positive" | "negative";
    genericType: "number" | "string-number";
    estrictType: "int" | "bigInt" | "float";
  } {
    let r = {
      polarity: "" as "positive" | "negative",
      genericType: "" as "number" | "string-number",
      estrictType: "" as "int" | "bigInt" | "float",
    };
    let n = this.stringToNumber(num);
    r.polarity = n < 0 ? "negative" : "positive"; //el `0` se considera positivo
    r.genericType = this.isString(num) ? "string-number" : "number";
    r.estrictType = !Number.isInteger(n)
      ? "float"
      : typeof n !== "bigint"
      ? "int"
      : "bigInt";
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
  public stringToNumber(strNum: string | number): number {
    if (!this.isNumber(strNum, true))
      throw new Error(`${strNum} is not number or string-number valid`);
    if (this.isNumber(strNum, false)) return strNum as number; //ya es un numero no haga nada mas
    //determinar si es un flotante
    const floatNum = parseFloat(strNum as string);
    if (!isNaN(floatNum)) return floatNum;
    //determinar si es un entero
    const intNum = parseInt(strNum as string, 10);
    if (!isNaN(intNum)) return intNum;
    //normalmente no retornaria por aqui, se deja por protocolo
    return strNum as number;
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
    if (this.getTypeNumber(exp).estrictType !== "int")
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
   * r = adaptNumberByRange(num, [0,10]);
   * console.log(r);// Salida: 5
   *
   * //Fuera del rango, por encima:
   * num = 11;
   * r = adaptNumberByRange(num, [0,10]);
   * console.log(r);// Salida: 10
   *
   * //Fuera del rango, por debajo:
   * num = -2;
   * r = adaptNumberByRange(num, [0,10]);
   * console.log(r);// Salida: 0
   * ````
   */
  public adaptNumberByRange(
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
  //████Textos█████████████████████████████████████████████████████
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
  public isString(str: any, allowEmpty = false): boolean {
    allowEmpty = this.anyToBoolean(allowEmpty);
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
   * const result = isStringWhereLike(str, strToSearch, { likeType: "start" });
   * console.log(result); // salida: true
   *
   * const result2 = isStringWhereLike(str, "world", { likeType: "end" });
   * console.log(result2); // salida: false , termina en "world!"
   *
   * const result3 = isStringWhereLike(str, "lo, wo", { likeType: "between" });
   * console.log(result3); // salida: true
   *
   * const result4 = isStringWhereLike(str, "test", { likeType: "between" });
   * console.log(result4); // salida: false
   * ```
   */
  public isStringWhereLike(
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
    const adaptCasesForSnakeAndKebabFn = (
      type: Extract<TStrCase, "Snake" | "Kebab">,
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
    const adaptCasesForCamelAndPascalFn = (
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
        str = adaptCasesForSnakeAndKebabFn(
          "Snake",
          str,
          /[\s.:,;#*/><\-]/g,
          "_"
        );
        return str;
        break;

      case "Kebab":
        str = adaptCasesForSnakeAndKebabFn(
          "Kebab",
          str,
          /[\s.:,;#*/><_]/g,
          "-"
        );
        return str;
        break;

      case "Camel":
        str = adaptCasesForCamelAndPascalFn("Camel", str);
        return str;
        break;

      case "Pascal":
        str = str = adaptCasesForCamelAndPascalFn("Pascal", str);
        return str;
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
   *
   * ````
   */
  public capitalizeWordFirstLetter(word: string): string {
    if (!this.isString(word, true))
      // "" no lanza throw
      throw new Error(`${word} is not a valid string`);
    const r = word.charAt(0).toUpperCase() + word.slice(1);
    return r;
  }
  /**
   * construye un string path generico a partir de un array de strings
   *
   * @param {string[]} aKeys - El array de strings que se utilizará para construir el path.
   * @param {object} [option] - Opciones para personalizar la construcción del path:
   *  - `charSeparator` (string) `= "."`: El carácter separador a utilizar entre los elementos del path.
   *  - `isInitWithSeparator` (boolean) `= false`: Determina si el path debe iniciar con el carácter separador.
   *  - `isEndtWithSeparator` (boolean) `= false` : Determina si el path debe terminar con el carácter separador.
   *  - `pathInit` (string) `= ""`: El prefijo a añadir al inicio del path.
   *  - `pathEnd` (string) `= ""`: El sufijo a añadir al final del path.
   * @returns el string del path ya construido
   * @throws {Error} - Lanza un error si `aKeys` no es un array válido de strings.
   *
   * @example
   * ```typescript
   * const keys = ["home", "user", "documents"];
   * let path: string;
   * //ejemplo 1:
   * path = buildGenericPathFromArray(keys, { charSeparator: "/", isInitWithSeparator: true });
   * console.log(path); // salida: "/home/user/documents"
   *
   * //ejemplo 2:
   * path = buildGenericPathFromArray(keys, {
   *   charSeparator: "/",
   *   isInitWithSeparator: true,
   *   isEndtWithSeparator: true
   * });
   * console.log(path); // salida: "/home/user/documents/"
   *
   * //ejemplo 3:
   * path = buildGenericPathFromArray(keys, {
   *   charSeparator: "/",
   *   isInitWithSeparator: true,
   *   isEndtWithSeparator: true,
   *   pathInit: ".."
   * });
   * console.log(path); // salida: "../home/user/documents/"
   * ```
   */
  public buildGenericPathFromArray(
    aKeys: string[],
    option?: {
      /** `= "."`: El carácter separador a utilizar entre los elementos del path. */
      charSeparator?: string;
      /** `= false`: Determina si el path debe iniciar con el carácter separador. */
      isInitWithSeparator?: boolean;
      /** `= false` : Determina si el path debe terminar con el carácter separador. */
      isEndtWithSeparator?: boolean;
      /** `= ""`: El prefijo a añadir al inicio del path. */
      pathInit?: string;
      /** `= ""`: El sufijo a añadir al final del path.*/
      pathEnd?: string;
    }
  ): string {
    const dfOp: typeof option = {
      charSeparator: this.charSeparatorLogicPath,
      isInitWithSeparator: false, //❗No inicia con caracter separador❗,
      isEndtWithSeparator: false, //❗No termina con caracter separador❗,
      pathInit: "",
      pathEnd: "",
    };
    const op = option;
    if (!this.isArray(aKeys, true))
      throw new Error(`${aKeys} is not array of keys for path valid`);
    if (!this.isObject(op)) {
      option = dfOp;
    } else {
      option = {
        charSeparator: this.isString(op.charSeparator)
          ? op.charSeparator
          : dfOp.charSeparator,
        isInitWithSeparator: this.isBoolean(op.isInitWithSeparator)
          ? op.isInitWithSeparator
          : dfOp.isInitWithSeparator,
        isEndtWithSeparator: this.isBoolean(op.isEndtWithSeparator)
          ? op.isEndtWithSeparator
          : dfOp.isEndtWithSeparator,
        pathInit:
          this.isString(op.pathInit) || this.isNumber(op.pathInit, true)
            ? op.pathInit
            : dfOp.pathInit,
        pathEnd:
          this.isString(op.pathEnd) || this.isNumber(op.pathEnd, true)
            ? op.pathEnd
            : dfOp.pathEnd,
      };
    }
    const {
      charSeparator: sp,
      isInitWithSeparator,
      isEndtWithSeparator,
      pathEnd,
      pathInit,
    } = option;
    let path = aKeys.reduce((prePath, cKey, idx) => {
      let r: string;
      if (idx === 0 && !isInitWithSeparator) r = `${prePath}${cKey}`;
      else r = `${prePath}${sp}${cKey}`;
      return r;
    }, pathInit);
    if (pathEnd !== "") path = `${path}${sp}${pathEnd}`;
    if (isEndtWithSeparator) path = `${path}${sp}`;
    return path;
  }
  //████Objetos████████████████████████████████████████████████████
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
  public isObject(value: any, allowEmpty = false): boolean {
    allowEmpty = this.anyToBoolean(allowEmpty);
    const r =
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value) &&
      (allowEmpty || Object.keys(value).length > 0);
    return r;
  }
  /**
   * Verifica si un valor es un objeto y si determinadas propiedades cumplen la condicion `"propCondition"`.
   *
   * ⚠ Solo verifica propiedades del primer nivel del elemento.
   *
   * ⚠ **no** reconoce arrays, solo objetos
   *
   * @param {T} obj El objeto a verificar.
   * @param {boolean} allowEmpty `= false`, Determina si se permite que el objeto vacío sea válido.
   * @param {string | string[]} keyOrKeys = `[]` Las claves identificadoras de las propiedades a verificar (❕No deben ser rutas solo claves de las propiedades de primer nivel❕).
   * @param {"it-exist" | "is-not-undefined" | "is-not-null" | "is-not-undefined-and-not-null"} propCondition `= "is-not-undefined-and-not-null"` determina la condición que debe cumplir cada propiedad referenciada en `keyOrKeys`
   * - `"it-exist"` verifica si la propiedad existe (asi tenga asignado valor undefined o null).
   * - `"is-not-undefined"` verifica que la propiedad no sea undefined.
   * - `"is-not-null"` verifica que la propiedad no sea null.
   * - `"is-not-undefined-and-not-null"` (predefinidio) verifica que la propiedad no sea undefined o null.
   * @returns {boolean} Retorna `true` si es un objeto y tiene dichas propiedades, `false` de lo contrario.
   *
   * @example
   * ````typescript
   * let obj;
   * let r;
   *
   * //ejemplo básico (evalua como `isObject()`):
   * obj = { p1: "hola", p2: 31 };
   * r = util.isObjectAndExistEveryProperty(data);
   * console.log(r); //salida: `true`, es un objeto
   *
   * //ejemplo verificando propiedad (no undefined y no null):
   * obj = { p1: "hola", p2: 31 };
   * r = util.isObjectAndExistEveryProperty(data, "p1", "is-not-undefined-and-not-null");
   * console.log(r); //salida: `true`, es un objeto y `p1` no es undefined o null
   *
   * //ejemplo verificando propiedad (es undefined o es null):
   * obj = { p1: "hola", p2: 31 };
   * r = util.isObjectAndExistEveryProperty(data, "p3", "is-not-undefined-and-not-null");
   * console.log(r); //salida: `false`, es un objeto pero `p3`es undefined
   *
   * //ejemplo diferencias de comprobacion ("it-exist"):
   * obj = { p1: "hola", p2: 31 p3: undefined};
   * r = util.isObjectAndExistEveryProperty(data, "p3", "it-exist");
   * console.log(r); //salida: `true`, es un objeto y `p3` existe (apesar de tener asignado undefined)
   *
   * //ejemplo diferencias de comprobacion ("is-not-undefined"):
   * obj = { p1: "hola", p2: 31 p3: undefined};
   * r = util.isObjectAndExistEveryProperty(data, "p3", "is-not-undefined");
   * console.log(r); //salida: `false`, es un objeto y `p3` tiene asignado undefined
   *
   * //ejemplo comprobacion profunda:
   * obj = { p1: "hola", p2:{p21:3}};
   * r = util.isObjectAndExistEveryProperty(data, "p2.p21", "is-not-undefined-and-not-null");
   * console.log(r); //salida: `false`, 🚫 **NO** esta habilitada la verificacion profunda
   * ````
   */
  public isObjectAndExistEveryProperty<TObj extends object>(
    obj: TObj,
    allowEmpty = false,
    keyOrKeys?: keyof TObj | Array<keyof TObj>,
    propCondition:
      | "it-exist"
      | "is-not-undefined"
      | "is-not-null"
      | "is-not-undefined-and-not-null" = "is-not-undefined-and-not-null"
  ): boolean {
    if (
      this.isNotUndefinedAndNotNull(keyOrKeys) &&
      !this.isString(keyOrKeys) && //❗Obligario negar string vacio❗
      !this.isArray(keyOrKeys, true) //❗Obligario permitir array vacio❗
    )
      throw new Error(`${keyOrKeys as any} is not key or keys valid`);
    if (!this.isString(propCondition))
      throw new Error(`${propCondition} is not property condition mode valid`);
    let keys = this.isArray(keyOrKeys, true)
      ? ([...(keyOrKeys as any)] as string[])
      : this.isString(keyOrKeys)
      ? ([keyOrKeys as any] as string[])
      : ([] as string[]);
    keys = [...new Set(keys)]; //eliminacion de repetidos sencilla
    let r = false;
    if (!this.isObject(obj, allowEmpty)) {
      r = false;
    } else {
      if (keys.length > 0) {
        r = keys.every((key) => {
          let r =
            propCondition === "it-exist"
              ? key in obj
              : propCondition === "is-not-undefined"
              ? obj[key] !== undefined
              : propCondition === "is-not-null"
              ? obj[key] !== null
              : this.isNotUndefinedAndNotNull(obj[key]);
          return r;
        });
      } else {
        r = true;
      }
    }
    return r;
  }
  /**
   * Verifica si un valor es un objeto y si determinadas propiedades cumplen la condicion `"propCondition"`.
   *
   * ⚠ **no** reconoce arrays, solo objetos
   *
   * @param {T} obj El objeto a verificar.
   * @param {boolean} allowEmpty `= false`, Determina si se permite que el objeto vacío sea válido.
   * @param {string | string[]} keyOrKeysPath = `[]` Las claves identificadoras de las propiedades a verificar.
   * @param {"it-exist" | "is-not-undefined" | "is-not-null"| "is-not-undefined-and-not-null"} propCondition `= "is-not-undefined-and-not-null"` determina la condición que debe cumplir cada propiedad referenciada en `keyOrKeys`
   * - `"it-exist"` verifica si la propiedad existe (asi tenga asignado valor undefined o null).
   * - `"is-not-undefined"` verifica que la propiedad no sea undefined.
   * - `"is-not-null"` verifica que la propiedad no sea null.
   * - `"is-not-undefined-and-not-null"` (predefinidio) verifica que la propiedad no sea undefined o null.
   * @returns {boolean} Retorna `true` si es un objeto y tiene dichas propiedades, `false` de lo contrario.
   *
   * @example
   * ````typescript
   * let obj;
   * let r;
   *
   * //ejemplo básico (evalua como `isObject()`):
   * obj = { p1: "hola", p2: 31 };
   * r = util.isObjectAndExistEveryProperty(data);
   * console.log(r); //salida: `true`, es un objeto
   *
   * //ejemplo verificando propiedad (no undefined y no null):
   * obj = { p1: "hola", p2: 31 };
   * r = util.isObjectAndExistEveryProperty(data, "p1", "is-not-undefined-and-not-null");
   * console.log(r); //salida: `true`, es un objeto y `p1` no es undefined o null
   *
   * //ejemplo verificando propiedad (es undefined o es null):
   * obj = { p1: "hola", p2: 31 };
   * r = util.isObjectAndExistEveryProperty(data, "p3", "is-not-undefined-and-not-null");
   * console.log(r); //salida: `false`, es un objeto pero `p3`es undefined
   *
   * //ejemplo diferencias de comprobacion ("it-exist"):
   * obj = { p1: "hola", p2: 31 p3: undefined};
   * r = util.isObjectAndExistEveryProperty(data, "p3", "it-exist");
   * console.log(r); //salida: `true`, es un objeto y `p3` existe (apesar de tener asignado undefined)
   *
   * //ejemplo diferencias de comprobacion ("is-not-undefined"):
   * obj = { p1: "hola", p2: 31 p3: undefined};
   * r = util.isObjectAndExistEveryProperty(data, "p3", "is-not-undefined");
   * console.log(r); //salida: `false`, es un objeto y `p3` tiene asignado undefined
   *
   * //ejemplo comprobacion profunda:
   * obj = { p1: "hola", p2:{p21:3}};
   * r = util.isObjectAndExistEveryProperty(data, "p2.p21", "is-not-undefined-and-not-null");
   * console.log(r); //salida: `true`, permite verificacion profunda (hasta 16 niveles probados)
   * ````
   */
  public isObjectAndExistEveryDeepProperty(
    obj: any,
    allowEmpty = false,
    keyOrKeysPath?: string | string[],
    propCondition:
      | "it-exist"
      | "is-not-undefined"
      | "is-not-null"
      | "is-not-undefined-and-not-null" = "is-not-undefined-and-not-null"
  ): boolean {
    if (
      this.isNotUndefinedAndNotNull(keyOrKeysPath) &&
      !this.isString(keyOrKeysPath) && //❗Obligario negar string vacio❗
      !this.isArray(keyOrKeysPath, true) //❗Obligario permitir array vacio❗
    )
      throw new Error(`${keyOrKeysPath} is not key or keys path valid`);
    if (!this.isString(propCondition))
      throw new Error(`${propCondition} is not property condition mode valid`);
    let keysPath = this.isArray(keyOrKeysPath, true)
      ? ([...keyOrKeysPath] as string[])
      : this.isString(keyOrKeysPath)
      ? ([keyOrKeysPath as any] as string[])
      : ([] as string[]);
    keysPath = [...new Set(keysPath)]; //eliminacion de repetidos sencilla
    let r = false;
    if (!this.isObject(obj, allowEmpty)) {
      r = false;
    } else {
      const sp = this.charSeparatorLogicPath;
      if (keysPath.length > 0) {
        r = keysPath.every((key) => {
          const keysSplitPath = key.split(sp);
          const cKey = keysSplitPath[0];
          let lenKP = keysSplitPath.length;
          //seleccion de condicion de propiedad
          let r =
            propCondition === "it-exist"
              ? key in obj
              : propCondition === "is-not-undefined"
              ? obj[cKey] !== undefined
              : propCondition === "is-not-null"
              ? obj[cKey] !== null
              : this.isNotUndefinedAndNotNull(obj[cKey]);
          //determinar si recorre profundidad
          if (r && lenKP > 1) {
            keysSplitPath.shift();
            lenKP = keysSplitPath.length; //actualiza
            const subKeyOrKeysPath = lenKP > 0 ? [keysSplitPath.join(sp)] : [];
            const sObj = obj[cKey];
            r = this.isObjectAndExistEveryDeepProperty(
              sObj,
              allowEmpty,
              subKeyOrKeysPath,
              propCondition
            );
          }
          return r;
        });
      } else {
        r = true;
      }
    }
    return r;
  }
  /**
   * Determina si un objeto es literal (no es instanciado o fue creado por medio de `new`).
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
   * ```
   */
  public isLiteralObject(obj: any) {
    let r = false;
    //vacios validos
    if (!this.isObject(obj, true)) return r;
    if (obj.constructor === Object) r = true;
    return r;
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
   * const obj = new MyClass();
   * const r = isInstance(obj);
   * console.log(r); // salida: true
   *
   * //comprobando literal
   * const obj = {p1:"hola"};
   * const r = isInstance(obj);
   * console.log(r); // salida: false
   * ```
   */
  public isInstance(obj: any) {
    let r = false;
    if (!this.isObject(obj, true)) return r;
    if (obj.constructor !== Object) r = true;
    return r;
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
  public getClassName(instance: object): string {
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
   * ⚠ Realiza la conversión en profundidad (tener cuidado con el stack si no es muy profundo).
   *
   * @param {object} objBase El objeto a convertir sus claves identificadoras.
   * @param {string} caseType El tipo de case al cual se desea convertir las claves (Camel, Snake, Kebab o Pascal).
   * @returns {object} Retorna el objeto con las claves de propiedades modificadas.
   *
   * @example
   * ```typescript
   * const objBase = {
   *   campo_a: "dato a",
   *   _campo_b: "dato b",
   *   campo_c: "dato c.1", // Sin prefijo
   *   _campo_c: "dato c.2",
   * };
   * const objCase = objCastKeyPropertiesToCase(objBase, "Camel");
   * console.log(objCase);
   * // Salida:
   * // {
   * //   campoA: "dato a",
   * //   campoB: "dato b", // ❗ Quitó el prefijo "_" ❗
   * //   campoC: "dato c.2", // ❗ Quitó el prefijo "_" ❗
   * //                      // y ❗ sobrescribió la propiedad sin prefijo ❗
   * // }
   * ```
   */
  public objectKeyPropertiesToCase(
    objBase: object,
    caseType: TStrCase
  ): object {
    if (!this.isObject(objBase))
      throw new Error(`${objBase} is not object valid`);
    let objCase = {} as object;
    for (let key in objBase) {
      const keyC = this.convertStringToCase(key, caseType);
      objCase[keyC] = this.isObject(objBase[key])
        ? this.objectKeyPropertiesToCase(objBase[key], caseType)
        : objBase[key];
    }
    return objCase;
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
   * @param {object} config - Configuración opcional para el proceso de conversión:
   *   - `isDeletePrivates`: Determina si se eliminan propiedades (privadas) con prefijo `"_"`
   *   - `keyOrKeysPathForDelete`: claves identificadoras de propiedades que deben eliminarse.
   * @returns {object} - Retorna la instancia literal.
   *
   * @example
   * ````typescript
   * let obj;
   * let r;
   * //mutación basica (eliminar funciones y privados):
   * obj = {b:true, n:1, s:"hola", f:()=>"loquesea", _p:15};
   * r = mutateToLiteralObject(obj, {
   *   isDeletePrivates: true,
   * });
   * console.log(r); //Salida: `{b:true, n:1, s:"hola"}`
   *
   * //mutación basica con propiedades seleccionada:
   * obj = {b:true, n:1, s:"hola", f:()=>"loquesea", _p:15};
   * r = mutateToLiteralObject(obj, {
   *   isDeletePrivates: true,
   *   keyOrKeysPathForDelete: ["b", "s"]
   * });
   * console.log(r); //Salida: `{n:1}` las funciones siempre se eliminaran
   *                 //y los privados dependen de `isDeletePrivates`.
   *
   * //mutación subObjetos:
   * obj = {
   *   b:true,
   *   n:1,
   *   s:"hola",
   *   p1Obj: {p11b: false, p11n: 1 p11Obj:{p111s: "otro dato"}},
   *   p2Obj: {p2S:"adios"}
   * };
   * r = mutateToLiteralObject(obj, {
   *   keyOrKeysPathForDelete: [
   *     "b", //referencia al primer nivel
   *     "n", //referencia al primer nivel
   *     "p2Obj",
   *     "p1Obj.p11Obj.p11b" //referencia al segundo nivel
   *     "p1Obj.p11Obj.p111s" //referencia al tercer nivel
   *   ]
   * });
   * console.log(r); //Salida:
   *               //`{s:"hola", p1Obj: { p11n: 1, p11Obj:{}}}`
   * ````
   *
   */
  public mutateToLiteralObject(
    obj: object,
    config: {
      /**
       * predefinido en `false`
       *
       * Determina si se eliminan propiedades (privadas) con prefijo `"_"`
       *
       */
      isDeletePrivates?: boolean;
      /**rutas de claves identificadoras de propiedades que deben eliminarse.*/
      keyOrKeysPathForDelete?: string | string[];
    }
  ): object {
    if (!this.isObject(obj, true))
      throw new Error(`${obj} is not object valid`);
    if (!this.isObject(config, true))
      throw new Error(`${config} is not object of configuration valid`);
    if (
      this.isNotUndefinedAndNotNull(config.keyOrKeysPathForDelete) &&
      !this.isString(config.keyOrKeysPathForDelete) && //❗Obligario negar string vacio❗
      !this.isArray(config.keyOrKeysPathForDelete, true) //❗Obligario permitir array vacio❗
    )
      throw new Error(
        `${config.keyOrKeysPathForDelete} is not key or keys path valid`
      );
    let { isDeletePrivates = false, keyOrKeysPathForDelete } = config;
    let keysPathForDelete = this.isArray(keyOrKeysPathForDelete, true)
      ? ([...keyOrKeysPathForDelete] as string[])
      : this.isString(keyOrKeysPathForDelete)
      ? ([keyOrKeysPathForDelete] as string[])
      : ([] as string[]);
    isDeletePrivates = this.anyToBoolean(isDeletePrivates);
    const sp = this.charSeparatorLogicPath;
    //eliminar claves identificadoras repetidas
    const isKPTCArray = this.isArray(keysPathForDelete, false); //❗no se aceptan vacios
    if (isKPTCArray)
      keysPathForDelete = [...new Set(keysPathForDelete as string[])];
    let r = {};
    for (const keyProp in obj) {
      //eliminar funciones
      if (typeof obj[keyProp] === "function") continue;
      //eliminar propiedades con prefijo "_" (si esta habilitado)
      if (isDeletePrivates && /^_/.test(keyProp)) continue;
      //verificar que la propiedad al ser objeto elimine las propiedades seleccionadas por keyOrKeysPath
      if (keysPathForDelete.length > 0) {
        if (this.isObject(obj[keyProp], false)) {
          let isDeletedDeepProp = false;
          for (const keyP of keysPathForDelete) {
            const keysSplitPath = keyP.split(sp);
            const keySP = keysSplitPath[0];
            keysSplitPath.shift();
            const subKeyOrKeysPath =
              keysSplitPath.length > 0 ? [keysSplitPath.join(sp)] : [];
            if (keyProp === keySP) {
              if (subKeyOrKeysPath.length > 0 && this.isObject(obj[keyProp])) {
                //posiblemente profundo
                r[keyProp] = this.mutateToLiteralObject(obj[keyProp], {
                  keyOrKeysPathForDelete: subKeyOrKeysPath,
                  isDeletePrivates,
                });
              }
              isDeletedDeepProp = true;
              break;
            }
          }
          if (isDeletedDeepProp) continue;
        } else {
          //⚠ Solo para primer nivel (claves con ruta como "p1.p11"
          //no funcionarán porque deberia estar activado `isDeepLevel`)
          if (keyOrKeysPathForDelete.includes(keyProp)) continue;
        }
      }
      //copiar el valor de la propiedad
      r[keyProp] = obj[keyProp];
    }
    return r;
  }
  /**
   * Obtiene un nuevo objeto **literal** con solo las propiedades de un objeto
   * que son de tipo función.
   *
   * ⚠ Si el objeto es una instancia de una clase, los métodos (o funciones
   * en caso de JavaScript normal) **NO** son tomados en cuenta. Si se requiere
   * obtenerlos, es **obligatorio** convertir esos métodos (funciones) a propiedades
   * de tipo `function`.
   *
   * ⚠ No toma en cuenta el constructor.
   *
   *
   * @param {object} obj El objeto del cual se extraerán solo las propiedades tipo `Function`.
   * @param {any} thisBind (opcional) Si se quiere adicionar el contexto para la función
   * con el método `.bind()`.
   * @returns {object} - Retorna un nuevo objeto con solo las propiedades de función.
   *
   * @example
   * ```typescript
   * class MiClase {
   *   prop = "texto";
   *   metodoHacer() { ... }
   *   propFn = () => { ... }
   * }
   * let inst;
   * let r;
   *
   * const inst = new MiClase();
   * const r = mutateToObjectLiteralOnlyFn(inst);
   * console.log(r["prop"]); // es `undefined` ❌
   * console.log(r["metodoHacer"]); // es `undefined` ❌
   * console.log(r["propFn"]); // es `function` ✅
   * ```
   */
  public mutateToObjectLiteralOnlyFn(obj: any, thisBind?: any): object {
    if (!this.isObject(obj)) throw new Error(`${obj} is not object valid`);
    let newObj = {};
    for (const keyFn in obj) {
      if (typeof obj[keyFn] === "function" && keyFn !== "constructor") {
        newObj[keyFn] = obj[keyFn];
        newObj[keyFn] = this.isObject(thisBind)
          ? (<Function>newObj[keyFn]).bind(thisBind)
          : newObj[keyFn];
        continue;
      }
      if (this.isObject(obj[keyFn])) {
        newObj[keyFn] = this.mutateToObjectLiteralOnlyFn(obj[keyFn]);
      }
    }
    return newObj;
  }
  /**
   * A partir de un objeto dado (normalmente un diccionario),
   * extrae el primer subObjeto que se encuentre a partir de
   * la clave identificadora para la propiedad que contiene
   * dicho subObjeto
   *
   * ⚠ No busca en los niveles de tipo `Array`.
   *
   * ⚠ Posible desbordamiento de stack, usar con diccionarios
   * poco profundos (16 niveles probados).
   *
   * ⚠ el objeto o subobjeto internamente ejecuta el metodo
   * `Object.keys()` lo que hará que las propiedades queden
   * organizadas segun ese metodo por lo tanto el primer
   * sub objeto que encuentre con la propiedad `key` proporcionada
   * dependera de dicho ordenamiento
   *
   * @param {any} objBase Objeto base sobre el cual se hará la búsqueda y extraccion.
   * @param {string} keyPath El identificador de la propiedad a encontrar (puede ser una ruta de clave).
   * @param {object} defaultReturnObj `= undefined` el valor predefinido a retornar en caso de que `keyOrKeyPath` no sea una clave existente en la estructura del objeto base
   * @returns {any} Retorna el contenido de la propiedad que esté identificada
   * con el `keyOrKeyPath` recibida. De no encontrarse, se retorna el valor de `defaultReturnObj`.
   *
   */
  public findPropByKeyPath(
    objBase: object,
    keyPath: string,
    defaultReturnObj: object = undefined
  ): any {
    if (!this.isObject(objBase))
      throw new Error(`${keyPath} is not object valid`);
    if (!this.isString(keyPath))
      //"" lanza throw
      throw new Error(`${keyPath} is not key valid`);
    let subObj: any = defaultReturnObj;
    const sp = this.charSeparatorLogicPath;
    const aKekysPath = keyPath.split(sp);
    const kPLen = aKekysPath.length;
    //estrategia con ruta
    if (kPLen > 1) {
      subObj = { ...objBase };
      for (const key of aKekysPath) {
        if (
          subObj === null || //subpropiedades inexistentes no lancen error al intentar `null[key]`
          subObj[key] === undefined //❗abarca todos los primitivo ej: `1[key] === undefined`❗
        ) {
          subObj = defaultReturnObj;
          break;
        }
        subObj = subObj[key];
      }
      //estrategia con busqueda profunda
    } else {
      let findDeepFn = (deepObj: object, subKeys: string[], keyTF: string) => {
        if (keyTF in deepObj) return deepObj[keyTF];
        subKeys = [...subKeys]; //clonacion superficial
        let objF: object = undefined;
        for (const sKey of subKeys) {
          if (this.isObject(deepObj[sKey])) {
            const subObj = deepObj[sKey];
            objF =
              keyTF in subObj
                ? { ...subObj[keyTF] } //❗encontrada❗
                : findDeepFn(subObj, Object.keys(subObj), keyTF);
            if (objF !== undefined) break;
          }
        }
        return objF;
      };
      findDeepFn = findDeepFn.bind(this);
      subObj = findDeepFn(objBase, Object.keys(objBase), keyPath);
    }
    return subObj;
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
   * @param {object} config - Configuración para el proceso de fusión:
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
   * r = objectDeepMerge([baseObj, newObj], {mode: "soft"});
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
   * r = objectDeepMerge([baseObj, newObj], {mode: "hard"});
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
  public objectDeepMerge<T>(
    tObjToMerge: [T, T?],
    config: {
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
    let [objBase, objNew] = tObjToMerge;
    const isObjBase = this.isObject(objBase, true);
    const isObjNew = this.isObject(objNew, true);
    if (!this.isObject(config, true))
      throw new Error(
        `${config} is not object of configuration to deep merge valid`
      );
    if (!this.isString(config.mode))
      throw new Error(`${config.mode} is not mode for merge valid`);
    //casos especiales (alguno o ambos no son objetos)
    if (!isObjBase || !isObjNew) {
      if (!isObjBase && isObjNew) return objNew;
      if (!isObjNew && isObjBase) return objBase;
      return objBase;
    }
    let {
      mode,
      isNullAsUndefined = false, //predefinido
    } = config;
    const uKeys = [
      ...new Set([...Object.keys(objBase), ...Object.keys(objNew)]),
    ];
    let rObj: any = {};
    for (const key of uKeys) {
      const propB = objBase[key];
      const propN = objNew[key];
      if (this.isObject(propB, true) && this.isObject(propN, true)) {
        if (Object.keys(propB).length === 0) {
          //caso especial objeto vacio en propiedad base
          if (mode === "soft") {
            rObj[key] =
              propN === undefined || (isNullAsUndefined && propN === null)
                ? propB
                : propN;
          } else if (mode === "hard") {
            rObj[key] = propN;
          } else {
            throw new Error(`${mode} is not mode for merge valid`);
          }
        } else if (Object.keys(propN).length === 0) {
          //caso especial objeto vacio en propiedad nuevo
          rObj[key] = mode === "hard" ? propN : propB;
        } else {
          rObj[key] = this.objectDeepMerge([propB, propN], {
            mode,
            isNullAsUndefined,
          });
        }
      } else {
        if (mode === "soft") {
          rObj[key] =
            propB === undefined || (isNullAsUndefined && propB === null)
              ? propN
              : propN === undefined || (isNullAsUndefined && propN === null)
              ? propB
              : propN;
        } else if (mode === "hard") {
          //comprobacion de existencia de propiedad
          const isPropB = key in (objBase as object);
          const isPropN = key in (objNew as object);
          rObj[key] = isPropN ? propN : propB;
        } else {
          throw new Error(`${mode} is not mode for merge valid`);
        }
      }
    }
    return rObj;
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
   * const obj = arrayOfEntriesToObject(arrayOfEntries);
   * console.log(obj); // salida: { key1: "value1", key2: "value2" }
   * ```
   */
  public aEntryTupleToObject(aEntryTuple: Array<[any, any]>): object {
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
   * @param {IterableIterator<[any, any]>} entries - El iterable de tuplas que se va a convertir en un objeto.
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
  public entriesToObjetc(entries: IterableIterator<[any, any]>): object {
    //⚠ Obligatorio el testeo primitivo
    if (typeof entries !== "object")
      throw new Error(`${entries} is not entries (:IterableIterator) valid`);
    const arrayOfEntries = Array.from(entries);
    const obj = this.aEntryTupleToObject(arrayOfEntries);
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
    const obj = this.entriesToObjetc(entries);
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
  public freezeObject<TObject>(obj: TObject, isAllowDeepLevel = true): TObject {
    //❗❗❗ debe ser verificacion primitiva❗❗❗ (incluye arrays)
    if (typeof obj !== "object" || obj === null) return obj; // no hace ningun congelado
    //profundizar (si es permitido)
    if (isAllowDeepLevel) {
      for (let entry of Object.entries(obj)) {
        const key = entry[0];
        const value = entry[1];
        obj[key] = this.freezeObject(value);
      }
    }
    const fObj = Object.freeze(obj);
    return fObj;
  }
  //█████Arrays██████████████████████████████████████████████████████
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
  public isArray(value: any, allowEmpty = false): boolean {
    const r = Array.isArray(value) && (allowEmpty || value.length > 0);
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
   * - `function`
   * - `boolean`
   * - `number`
   * - `string-number` cuando esta activada `isCompareStringToNumber`
   * - `string`
   * - `object`
   * - `array`
   *
   * los pesos son estrictos y tienen en cuenta el tipo. Ejemplo:
   *  - `A` es mas pesado que `a` //cuando es case sensitive
   *  - `0` es mas pesado que `true`.
   *  - `true` es mas pesado que `false`.
   *  - `false` es mas pesado que null
   *  - `null` es mas pesado que `undefined`
   *
   * @param {T} arrayToSort el array a ordenar
   * @param {object} config configuracion para el ordenamiento
   * - `direction = "asc"`, direccion de ordenamiento
   * - `isRemoveDuplicate = fasle`, si se desea eliminar duplicados antes de retornar el array ordenado
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
   * r = anyArraySort(aToSort, {direction: "asc"})
   * console.log(r); //salida: `[false, false, true, true, true]`
   *
   * //array de numeros
   * aToSort = [-1,2,1,0,-2];
   * r = anyArraySort(aToSort, {direction: "asc"})
   * console.log(r); //salida: `[-2,-1,0,1,2]`
   * ````
   *
   * //array de string (direccion "asc" y sesnsitivo)
   * aToSort = ["A", "B", "a", "b"];
   * r = anyArraySort(aToSort, {
   *  direction: "asc",
   *  isCaseSensitiveForString: true
   * });
   * console.log(r); //salida: `["a", "A", "b", "B"]`
   *
   * //array de string (direccion "desc" y no sesnsitivo)
   * aToSort = ["A", "B", "a", "b"];
   * r = anyArraySort(aToSort, {
   *  direction: "desc",
   *  isCaseSensitiveForString: false
   * });
   * console.log(r); //salida: `["b", "B", "a", "A"]`
   *
   * //array de string (direccion "desc" y sesnsitivo)
   * aToSort = ["A", "B", "a", "b"];
   * r = anyArraySort(aToSort, {
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
   * r = anyArraySort(aToSort, {
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
  public anyArraySort<T extends Array<any>>(
    arrayToSort: T,
    config: Omit<IConfigEqGtLt, "isAllowEquivalent"> & {
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
    if (!this.isObject(config, true))
      throw new Error(`${config} is not object of configuration to sort valid`);
    if (
      this.isNotUndefinedAndNotNull(config.direction) &&
      !this.isString(config.direction)
    )
      throw new Error(
        `${config.direction} is not configuration's direction to sort valid`
      );
    //INICIO
    let {
      direction = "asc", //predefinido
      isRemoveDuplicate = false,
      isCaseSensitiveForString,
      isCompareLength,
      isCompareSize,
      isCompareStringToNumber,
      keyOrKeysPath,
    } = config;
    isRemoveDuplicate = this.anyToBoolean(isRemoveDuplicate);
    const nDirection = direction === "asc" ? 1 : -1;
    //tratamiento de arrays internos
    let arrayToSortClone = [] as T;
    let aUndefined = [] as T;
    for (const item of [...arrayToSort]) {
      //clonacion sencilla ya que no se modifican valores internamente
      //caso especial array
      if (this.isArray(item)) {
        arrayToSortClone.push(
          this.anyArraySort(item as any[], {
            direction,
            isCaseSensitiveForString,
            isCompareLength,
            isCompareStringToNumber,
            isRemoveDuplicate,
            keyOrKeysPath,
          })
        );
      }
      //caso especial undefined
      else if (item === undefined) {
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
      if (Array.isArray(a) && Array.isArray(b) && a.length != b.length) {
        r = a.length - b.length;
      } else {
        //casos normales
        r = this.anyCompareTo([a, b], {
          isCaseSensitiveForString,
          isCompareLength,
          isCompareSize,
          isCompareStringToNumber,
          keyOrKeysPath,
        });
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
      arrayToSortClone = this.arrayRemoveDuplicate(arrayToSortClone, {
        keyOrKeysPath,
        itemConflictMode: "last",
        isCaseSensitiveForString,
        isCompareLength,
        isCompareSize,
        isCompareStringToNumber,
      });
    }
    return arrayToSortClone;
  }
  /**
   *
   * Elimina los elementos duplicados de un array.
   *
   * @param {Array} arrayToRemove El array del cual se eliminarán los duplicados.
   * @param {object} config configuracion para el metodo
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
   * r = arrayRemoveDuplicate(a, {
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
   * r = arrayRemoveDuplicate(a, {
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
   * r = arrayRemoveDuplicate(a, {
   *   itemConflictMode: "first"
   * });
   * console.log(r) //Salida: ["a","B","C"]
   *
   * //caso strings (modo "last", no sensitivo)
   * a = ["a","A","B","C","A","B"];
   * r = arrayRemoveDuplicate(a, {
   *   itemConflictMode: "last"
   * });
   * console.log(r) //Salida: ["C","A","B"]
   *
   * //caso strings (modo "first", sensitivo)
   * a = ["a","A","B","C","A","B"];
   * r = arrayRemoveDuplicate(a, {
   *   itemConflictMode: "first",
   *   isCaseSensitiveForString
   * });
   * console.log(r) //Salida: ["a","A","B","C"]
   *
   * //caso strings (modo "last", sensitivo)
   * a = ["a","A","B","C","A","B"];
   * r = arrayRemoveDuplicate(a, {
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
   * r = arrayRemoveDuplicate(a, {
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
   * r = arrayRemoveDuplicate(a, {
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
   * r = arrayRemoveDuplicate(a, {
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
  public arrayRemoveDuplicate<T extends Array<any>>(
    arrayToRemove: T,
    config: Omit<IConfigEqGtLt, "isAllowEquivalent"> & {
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
    if (!this.isObject(config, true))
      throw new Error(
        `${config} is not object of configuration to remove duplicate valid`
      );
    if (
      this.isNotUndefinedAndNotNull(config.itemConflictMode) &&
      !this.isString(config.itemConflictMode)
    )
      throw new Error(
        `${config.itemConflictMode} is not configuration's item conflict mode to remove duplicate valid`
      );
    let {
      itemConflictMode = "last", //predefinido
      keyOrKeysPath,
      isCaseSensitiveForString,
      isCompareLength,
      isCompareSize,
      isCompareStringToNumber,
    } = config;
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
          this.isEquivalentTo([itemBase, item], {
            keyOrKeysPath,
            isCaseSensitiveForString,
            isCompareLength,
            isCompareSize,
            isCompareStringToNumber,
          })
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
          const r = this.isEquivalentTo([itemBase, item], {
            keyOrKeysPath,
            isCaseSensitiveForString,
            isCompareLength,
            isCompareSize,
            isCompareStringToNumber,
          });
          return r;
        });
      } else {
        throw new Error(
          `${config.itemConflictMode} is not configuration's item conflict mode to remove duplicate valid`
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
   * @param {object} config Configuración para el proceso de eliminación de duplicados. Las opciones son las mismas que para el método `arrayRemoveDuplicate`.
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
    config: Parameters<typeof this.arrayRemoveDuplicate>[1] = {}
  ): TArray {
    if (!this.isArray(tArraysToUnion) || tArraysToUnion.length > 2)
      throw new Error(`${tArraysToUnion} is not array of set valid`);
    let [aAU, bAU] = tArraysToUnion;
    let aR = [...aAU, ...bAU] as TArray;
    aR = this.arrayRemoveDuplicate(aR, config);
    return aR;
  }
  /**
   * Obtiene la intersección de dos arrays, eliminando los elementos duplicados.
   *
   * @param {[TArray, TArray]} tArraysToUnion Tupla con los dos arrays a unir, donde:
   * - `tArraysToUnion[0]` es el array "A" a unir.
   * - `tArraysToUnion[1]` es el array "B" a unir.
   * @param {object} config Configuración para el proceso de eliminación de duplicados. Las opciones son las mismas que para el método `arrayRemoveDuplicate`.
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
    config: Parameters<typeof this.arrayRemoveDuplicate>[1] = {}
  ): T {
    if (
      !this.isArray(tArraysToIntersection) ||
      tArraysToIntersection.length > 2
    )
      throw new Error(`${tArraysToIntersection} is not array of set valid`);
    let [aAI, bAI] = tArraysToIntersection;
    let aR = aAI.filter((a) => {
      const r = bAI.some((b) => this.isEquivalentTo([a, b], config));
      return r;
    }) as T;
    aR = this.arrayRemoveDuplicate(aR, config);
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
   * @param {object} config Configuración para el proceso de eliminación de duplicados. Las opciones son las mismas que para el método `arrayRemoveDuplicate`.
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
    config: Parameters<typeof this.arrayRemoveDuplicate>[1] = {}
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
        const r = !bAD.some((b) => this.isEquivalentTo([a, b], config));
        return r;
      }) as T;
    } else if (selector === "difference_B") {
      aR = bAD.filter((b) => {
        const r = !aAD.some((a) => this.isEquivalentTo([a, b], config));
        return r;
      }) as T;
    } else {
      throw new Error(`${selector} is not selector valid`);
    }
    aR = this.arrayRemoveDuplicate(aR, config);
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
   * const r = findArrayIntoArray(mainArray, searchArray);
   * console.log(r); //-> [{id: "1", nombre:"Alan", edad:12}, {id: "4", nombre:"Manuel", edad:16},]
   * ````
   *
   * ➡Ejemplo busqueda OR y AND:
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
   * const r = findArrayIntoArray(mainArray, searchArray);
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
   * const searchArray = [ //buscar los objetos en mainArray (se envian los objetos completos)`
   *  {id: "2", nombre:"Marta", edad:14},
   *  {id: "3", nombre:"Maria", edad:16},
   * ];
   * const diccKeyId = ["edad"];  // SOLO buscar por nombre
   * const r = findArrayIntoArray(mainArray, searchArray, diccKeyId);
   * console.log(r); //-> [
   *                  //{id: "2", nombre:"Marta", edad:14},
   *                  //{id: "3", nombre:"Maria", edad:16},
   *                  //{id: "4", nombre:"Manuel", edad:16},
   *                  //]
   * ````
   *
   * ____
   * @param rootArray el array base del cual se desea buscar
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
  public findArrayIntoArray<TArray extends Array<any>>(
    rootArray: TArray,
    searchArray: TArray,
    config: Omit<IConfigEqGtLt, "isAllowEquivalent"> & {}
  ): TArray {
    if (!this.isArray(rootArray))
      throw new Error(`${rootArray} is not root array valid`);
    if (!this.isArray(searchArray))
      throw new Error(`${searchArray} is not search array valid`);
    if (!this.isObject(config, true))
      throw new Error(`${config} is not object of configuration to find valid`);
    if (
      this.isNotUndefinedAndNotNull(config.keyOrKeysPath) &&
      !this.isString(config.keyOrKeysPath) && //❗Obligario negar string vacio❗
      !this.isArray(config.keyOrKeysPath, true) //❗Obligario permitir array vacio❗
    )
      throw new Error(`${config.keyOrKeysPath} is not key path valid`);
    const {
      keyOrKeysPath,
      isCaseSensitiveForString,
      isCompareLength,
      isCompareSize,
      isCompareStringToNumber,
    } = config;
    let keysPath = this.isArray(keyOrKeysPath, true)
      ? ([...keyOrKeysPath] as string[])
      : this.isNotUndefinedAndNotNull(keyOrKeysPath)
      ? ([keyOrKeysPath] as string[])
      : [];
    let findArray = rootArray.filter((mAi) => {
      const r = searchArray.find((sAi) => {
        let r = this.isEquivalentTo([mAi, sAi], {
          keyOrKeysPath: keysPath,
          isCaseSensitiveForString,
          isCompareLength,
          isCompareSize,
          isCompareStringToNumber,
        });
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
    //❗❗❗ debe ser verificacion primitiva ❗❗❗
    if (!Array.isArray(arr)) return this.freezeObject(arr); //se intentará con tipo objeto
    //profundizar (si es permitido)
    if (isAllowDeepLevel) {
      for (let idx = 0; idx < (arr as any[]).length; idx++) {
        arr[idx] = this.freezeArray(arr[idx]);
      }
    }
    const fArr = Object.freeze(arr);
    return fArr;
  }
  //████tuple███████████████████████████████████████████████████████
  /**
   * Determina si un valor es una tupla de un tamaño específico o dentro de un rango de tamaños.
   *
   * @param {any} tuple - El valor que se va a verificar.
   * @param {number | [number, number]} length - El tamaño esperado de la tupla o un rango de tamaños válidos. Si es un número, la tupla debe tener exactamente ese tamaño. Si es una tupla de dos números, el tamaño de la tupla debe estar dentro de ese rango (inclusive).
   * @throws {Error} - Lanza un error si `length` no es un número o una tupla de dos números.
   * @returns {boolean} - Retorna `true` si el valor es una tupla del tamaño especificado o dentro del rango de tamaños, de lo contrario retorna `false`.
   *
   * @example
   * ```typescript
   * const value = [1, 2, 3];
   * const isTuple = isTuple(value, 3);
   * console.log(isTuple); // salida: true
   * ```
   */
  public isTuple<TTuple>(
    tuple: TTuple,
    length: number | [number, number]
  ): boolean {
    if (!this.isNumber(length) && !this.isTuple(length, 2))
      throw new Error(`${length} is not number or range tuple number valid`);
    if (!this.isArray(tuple, true)) return false;
    const tp = tuple as any[];
    if (!Array.isArray(length)) {
      if (tp.length !== length) return false;
    } else {
      if (!this.isNumberInRange(tp.length, length, true)) return false;
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
  ) {
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
   * const array = literalObjectToArrayTuple(obj);
   * console.log(array); // salida: [["a", 1], ["b", 2], ["c", 3]]
   * ```
   */
  public literalObjectToArrayTuple<TObj>(obj: TObj) {
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
   * const newArray = removeDuplicateOfArrayTupleByKey(array);
   * console.log(newArray); // salida: [["key1", "value3"], ["key2", "value2"]]
   * ```
   */
  public removeDuplicateOfArrayTupleByKey<TATuple>(
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
  //████Fechas███████████████████████████████████████████████████████
  /**determina si el numero es un timestamp valido
   * @param {any} timestamp el numero a validar como timestamp, se puede recibir como number o como string-number
   * @returns si es un timestamp valido
   */
  public isTimestamp(timestamp: any): boolean {
    if (!this.isNumber(timestamp, true)) return false;
    const timestampReduced = this.stringToNumber(timestamp) / 1000; //reducirlo a segundos para evitar problemas de memoria (en año 2038)
    if (this.isSignNumber(timestampReduced, "-", false)) return false; //un timestamp SIEMPRE será positivo
    return true;
  }
  /** convierte de string de fecha a timestamp
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
  //████Generales████████████████████████████████████████████████████
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
      objOrArray === null
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
  public async nestPromises(
    fns: ((value: any) => Promise<any>)[],
    options?: any
  ): Promise<any> {
    if (!Array.isArray(fns)) {
      throw new Error("No Array Promise"); //---falta definir ERROR--
    }
    return await this._nestPromises(fns, options);
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
  private async _nestPromises(
    fns: ((value: any) => Promise<any>)[],
    options?: any,
    rValues = []
  ): Promise<any> {
    if (fns.length > 0) {
      const currentFn: (param?) => Promise<any> = fns[0].bind(this);
      rValues.push(await currentFn(options));
      await this._nestPromises(fns.slice(1), options, rValues);
    }
    return rValues;
  }
  /**
   * @param v variable a comprobar
   * ____
   * @returns `true` si es `undefined` o `null`
   * `false` si no no lo es
   * ____
   */
  public isUndefinedOrNull(v: any) {
    return v === undefined || v === null;
  }
  /**
   * @param v variable a comprobar
   * ____
   * @returns `true` si NO es `undefined` ni `null`
   * `false` si lo es
   * ____
   */
  public isNotUndefinedAndNotNull(v: any) {
    return v != undefined && v != null;
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
    if (typeof value !== "object") return value === undefined ? null : value;
    //caso null directo
    if (value === null) return null;
    //caso objetos o arrays
    isDeep = this.anyToBoolean(isDeep);
    let newObjOrArray = !Array.isArray(value)
      ? { ...(value as object) } //clonacion superficial objeto
      : [...(value as any[])]; //clonacion superficial array

    Object.keys(newObjOrArray).forEach((key) => {
      if (newObjOrArray[key] === undefined) {
        newObjOrArray[key] = null;
      } else if (
        isDeep &&
        typeof newObjOrArray[key] === "object" && //acepta arrays
        newObjOrArray[key] !== null
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
    if (typeof value !== "object" || value === null)
      return value === null ? undefined : value;
    //caso objetos o arrays
    isDeep = this.anyToBoolean(isDeep);
    let newObjOrArray = !Array.isArray(value)
      ? { ...(value as object) } //clonacion superficial objeto
      : [...(value as any[])]; //clonacion superficial array

    Object.keys(newObjOrArray).forEach((key) => {
      if (newObjOrArray[key] === null) {
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
  /**
   * Comprueba si un valor corresponde a un tipo definido.
   *
   * ❗Aunque puede comparar valores primitivos (y objetos), su eso es
   * mas enfocado para arrays❗
   *
   * @param {any} anyValue Valor a comprobar el tipo.
   * @param {"is" | "is-not"} condition `= "is"`  Determina si corresponde al tipo o a uno de los tipos, `"is-not"` determina que no es ninguno de los tipos.
   * @param {TExtPrimitiveTypes | TExtPrimitiveTypes[]} types Los tipos a comprobar.
   * @param {"allow-empty" | "deny-empty"} emptyMode `= "allow-empty"` Solo se aplica a valores estructurados (objetos o arrays), determina si se consideran los objetos o arrays vacíos. Para el caso de la condición `"is"`, es lógica positiva mientras que para la condición `"is-not"`, la configuración `"deny-empty"` indicaría que un valor como `[]` no corresponde a un array válido.
   * @param {TExtPrimitiveTypes[] | TExtPrimitiveTypes | undefined} subTypes (Opcional y solo para estructuras objeto o arrays) Determina qué subtipos debe comprobar en cada elemento (para los arrays) o cada propiedad (para los objetos).
   * @returns {boolean} - Retorna un booleano indicando si corresponde al tipo y sus características.
   *
   * @example
   *
   * ````typescript
   * let v;
   * let r;
   *
   * //primitivos basicos
   * v = 2;
   * r = isValueType(v, "is-not", "number");
   * console.log(r); //Salida: false (por que numero)
   *
   * //primitivos basicos (string-number)
   * v = "2";
   * r = isValueType(v, "is", "number");
   * console.log(r); //Salida: false (por que es un string, antes que un numero)
   *
   * //primitivos basicos (varios tipos)
   * v = "hola";
   * r = isValueType(v, "is", ["number", "string"]); //funciona como OR
   * console.log(r); //Salida: true (por que es string)
   *
   * //objetos
   * v = {id:1, name: "juan"};
   * r = isValueType(v, "is", ["boolean", "number", "string"]); //funciona como OR
   * console.log(r); //Salida: false
   *
   * //array (de numeros)
   * v = [1, 2];
   * r = isValueType(v, "is", "array", "allow-empty", ["boolean", "string"]); //funciona como OR
   * console.log(r); //Salida: false (es un array de numbers)
   *
   * //array (vacio)
   * v = [];
   * r = isValueType(v, "is", "array", "allow-empty", ["boolean", "string"]); //funciona como OR
   * console.log(r); //Salida: true (se permite vacio)
   *
   * //array (varios tipos)
   * v = [1, "hola"];
   * r = isValueType(v, "is", "array", "allow-empty", ["number", "string"]); //funciona como OR
   * console.log(r); //Salida: true (es un arryay de numeros o strings)
   *
   * //array (varios tipos (2))
   * v = [1, "hola", false];
   * r = isValueType(v, "is", "array", "allow-empty", ["number", "string"]); //funciona como OR
   * console.log(r); //Salida: false (uno o mas de los elementos no es number o string)
   *
   * ````
   *
   */
  public isValueType(
    anyValue: any,
    condition: "is" | "is-not",
    types: TExtPrimitiveTypes | TExtPrimitiveTypes[],
    emptyMode: "allow-empty" | "deny-empty" = "allow-empty",
    subTypes?: TExtPrimitiveTypes | TExtPrimitiveTypes[]
  ): boolean {
    if (!this.isString(condition))
      throw new Error(`${condition} is not condition valid`);
    if (!this.isString(types) && !this.isArray(types))
      throw new Error(
        `${types} is not selector types valid (must be key-type or must be array of keys-type)`
      );
    if (!this.isString(emptyMode))
      throw new Error(`${emptyMode} is not empty mode valid`);
    if (
      this.isNotUndefinedAndNotNull(subTypes) &&
      !this.isString(subTypes) &&
      !this.isArray(subTypes)
    )
      throw new Error(
        `${subTypes} is not selector subTypes valid (must be key-type or must be array of keys-type)`
      );
    //cast arrays
    types = Array.isArray(types) ? types : [types];
    if (this.isNotUndefinedAndNotNull(subTypes)) {
      subTypes = Array.isArray(subTypes) ? subTypes : ([subTypes] as any);
    }
    // callback de verificacion de tipo
    const validateTypeFn: (
      anyValue: any,
      type: TExtPrimitiveTypes,
      subTypes: TExtPrimitiveTypes | TExtPrimitiveTypes[]
    ) => boolean = ((
      anyValue: any,
      type: TExtPrimitiveTypes,
      subTypes: TExtPrimitiveTypes | TExtPrimitiveTypes[]
    ) => {
      let r = false;
      switch (type) {
        case "array":
          r =
            Array.isArray(anyValue) &&
            (emptyMode === "allow-empty" ||
              (emptyMode === "deny-empty" && anyValue.length > 0));
          if (r && this.isArray(subTypes, false)) {
            r = (<any[]>anyValue).every((aV) =>
              this.isValueType(aV, "is", subTypes as any[], emptyMode)
            );
          }
          break;
        case "bigint":
          r = typeof anyValue === "bigint";
          break;
        case "boolean":
          r = typeof anyValue === "boolean";
          break;
        case "function":
          r = typeof anyValue === "function";
          break;
        case "number":
          r = typeof anyValue === "number"; //extricto no se admite string de numero Ej: ("45") es false
          break;
        case "object":
          r =
            typeof anyValue === "object" &&
            anyValue != null &&
            (emptyMode === "allow-empty" ||
              (emptyMode === "deny-empty" && Object.keys(anyValue).length > 0));
          if (r && this.isArray(subTypes, false)) {
            r = Object.values(anyValue).every((pV) =>
              this.isValueType(pV, "is", subTypes, emptyMode)
            );
          }
          break;
        case "string":
          r =
            typeof anyValue === "string" &&
            (emptyMode === "allow-empty" ||
              (emptyMode === "deny-empty" && anyValue !== ""));
          break;
        case "symbol":
          r = typeof anyValue === "symbol";
          break;
        case "undefined":
          r = anyValue === undefined;
          break;
        case "null":
          r = anyValue === null;
          break;
        default:
          r = false;
          break;
      }
      return r;
    }).bind(this);

    let r = false;
    if (condition === "is") {
      r = types.some((type) => validateTypeFn(anyValue, type, subTypes));
    }
    if (condition === "is-not") {
      //❗invertir la configuracion para logica negativa❗
      emptyMode = emptyMode === "allow-empty" ? "deny-empty" : "deny-empty";
      r = types.every((type) => !validateTypeFn(anyValue, type, subTypes));
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
   * - `function`
   * - `boolean`
   * - `number`
   * - `string-number` cuando esta activada `isCompareStringToNumber`
   * - `string`
   * - `object`
   * - `array`
   *
   * los pesos son estrictos y tienen en cuenta el tipo. Ejemplo:
   *  - `A` es mas pesado que `a` //cuando es case sensitive
   *  - `0` es mas pesado que `true`.
   *  - `true` es mas pesado que `false`.
   *  - `false` es mas pesado que null
   *  - `null` es mas pesado que `undefined`
   *
   * @param {[any, any]} compareValues Tupla con los valores a comparar.
   * @param {object} config Configuración para realizar la comparación:
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
    config: Omit<IConfigEqGtLt, "isAllowEquivalent">
  ): boolean {
    if (!this.isArray(compareValues, true) || compareValues.length > 2)
      throw new Error(`${config} is not tuple of compare values valid`);
    //si es vacio es como comparar `undefined === undefined`
    if ((compareValues as any[]).length === 0) return true;
    //si solo tiene un elemento es como si comparara a `any === undefined`
    if ((compareValues as any[]).length === 1) return false;
    if (!this.isObject(config, true))
      throw new Error(`${config} is not object of configuration valid`);
    if (
      this.isNotUndefinedAndNotNull(config.keyOrKeysPath) &&
      !this.isString(config.keyOrKeysPath) && //❗Obligario negar string vacio❗
      !this.isArray(config.keyOrKeysPath, true) //❗Obligario permitir array vacio❗
    )
      throw new Error(`${config.keyOrKeysPath} is not key or keys path valid`);
    let {
      isCompareLength = false, //❗Obligatorio `false` predefinido❗
      isCompareSize = false, //❗Obligatorio `false` predefinido❗
      keyOrKeysPath,
      isCompareStringToNumber = false, //predefinido
      isCaseSensitiveForString = true, //predefinido
    } = config;
    //Inicio de proceso
    const [valueBase, valueToCompare] = compareValues;
    let keysPath = this.isArray(keyOrKeysPath, true)
      ? ([...keyOrKeysPath] as string[])
      : this.isString(keyOrKeysPath)
      ? ([keyOrKeysPath] as string[])
      : ([] as string[]);
    isCompareLength = this.anyToBoolean(isCompareLength);
    isCompareSize = this.anyToBoolean(isCompareSize);
    isCompareStringToNumber = this.anyToBoolean(isCompareStringToNumber);
    isCaseSensitiveForString = this.anyToBoolean(isCaseSensitiveForString);
    let isEquivalent = true; //obligatorio iniciar con true
    //eliminar claves identificadoras repetidas
    const isKPTCArray = this.isArray(keysPath, false); //❗no se aceptan vacios
    if (isKPTCArray) keysPath = [...new Set(keysPath as string[])];
    const sp = this.charSeparatorLogicPath;
    //comparar array
    if (this.isArray(valueBase, true) && this.isArray(valueToCompare, true)) {
      const lenItemBase = (valueBase as any[]).length;
      const lenItemToCompare = (valueToCompare as any[]).length;
      const isEmpty = lenItemBase === 0 && lenItemToCompare === 0;
      //comparar tamaños
      if ((isCompareLength && lenItemBase != lenItemToCompare) || isEmpty) {
        isEquivalent = isEmpty;
      } else {
        //el len a usar como base de recorrido
        let lenItemRun =
          lenItemBase <= lenItemToCompare ? lenItemBase : lenItemToCompare;
        //comprobar elemento por elemento
        for (let sIdx = 0; sIdx < lenItemRun; sIdx++) {
          const sValueBase = valueBase[sIdx];
          const sValueToCompare = valueToCompare[sIdx];
          isEquivalent = this.isEquivalentTo([sValueBase, sValueToCompare], {
            keyOrKeysPath: isKPTCArray ? keysPath : undefined,
            isCompareLength,
            isCompareSize,
            isCaseSensitiveForString,
            isCompareStringToNumber,
          });
          if (isEquivalent === false) break;
        }
      }
    }
    //comparar objeto
    else if (
      this.isObject(valueBase, true) &&
      this.isObject(valueToCompare, true)
    ) {
      if (isKPTCArray) {
        const lenVB = Object.keys(valueBase).length;
        const lenVC = Object.keys(valueToCompare).length;
        if (lenVB === 0 && lenVC === 0) {
          isEquivalent = true;
        } else {
          for (const itemKeyPath of keysPath) {
            const keysSplitPath = itemKeyPath.split(sp);
            const key = keysSplitPath[0];
            keysSplitPath.shift();
            const subKeyOrKeysPath =
              keysSplitPath.length > 0 ? [keysSplitPath.join(sp)] : [];
            const sValueBase = valueBase[key];
            const sValueToCompare = valueToCompare[key];
            isEquivalent = this.isEquivalentTo([sValueBase, sValueToCompare], {
              keyOrKeysPath: subKeyOrKeysPath,
              isCompareLength,
              isCompareSize,
              isCaseSensitiveForString,
              isCompareStringToNumber,
            });
            if (isEquivalent === false) break;
          }
        }
      } else {
        const keysVB = Object.keys(valueBase).sort();
        const keysVC = Object.keys(valueToCompare).sort();
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
              keyOrKeysPath: undefined,
              isCompareLength,
              isCompareSize,
              isCaseSensitiveForString,
              isCompareStringToNumber,
            });
            if (isEquivalent === false) break;
          }
        }
      }
    }
    //comparar funciones
    else if (
      typeof valueBase === "function" &&
      typeof valueToCompare === "function"
    ) {
      const regExpCompress = /(\r\n|\n|\r| |;)/gm; //quitar caracteres
      const str_fnItemBase = (valueBase as Function)
        .toString()
        .replace(regExpCompress, "");
      const str_fnItem = (valueToCompare as Function)
        .toString()
        .replace(regExpCompress, "");
      isEquivalent = str_fnItemBase === str_fnItem;
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
   * - `function`
   * - `boolean`
   * - `number`
   * - `string-number` cuando esta activada `isCompareStringToNumber`
   * - `string`
   * - `object`
   * - `array`
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
   * @param {object} config Configuración para realizar la comparación:
   *   - `isAllowEquivalent` (**Obligatorio**) determina si se permite la equivalencia en la compracion
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
    config: IConfigEqGtLt
  ): boolean {
    if (!this.isArray(compareValues, true) || compareValues.length > 2)
      throw new Error(`${config} is not tuple of compare values valid`);
    if (!this.isObject(config, true))
      throw new Error(`${config} is not object of configuration valid`);
    //si es vacio es como comparar `undefined > undefined` (no es mayor a si mismo, puede ser equivalente)
    if ((compareValues as any[]).length === 0) return config.isAllowEquivalent;
    //si solo tiene un elemento es como si comparara a `any > undefined` (si es mayord)
    if ((compareValues as any[]).length === 1)
      return (
        compareValues[0] !== undefined || //solo si no es `undefined`
        (compareValues[0] === undefined && config.isAllowEquivalent)
      );
    if (
      this.isNotUndefinedAndNotNull(config.keyOrKeysPath) &&
      !this.isString(config.keyOrKeysPath) && //❗Obligario negar string vacio❗
      !this.isArray(config.keyOrKeysPath, true) //❗Obligario permitir array vacio❗
    )
      throw new Error(`${config.keyOrKeysPath} is not key or keys path valid`);
    let {
      isCompareLength = false, //❗Obligatorio `false` predefinido❗
      isCompareSize = false, //❗Obligatorio `false` predefinido❗
      keyOrKeysPath,
      isAllowEquivalent = false, //predefinidos
      isCompareStringToNumber = false, //predefinidos
      isCaseSensitiveForString = true, //predefinidos
    } = config;
    //Inicio de proceso
    const [valueBase, valueToCompare] = compareValues;
    let keysPath = this.isArray(keyOrKeysPath, true)
      ? ([...keyOrKeysPath] as string[])
      : this.isString(keyOrKeysPath)
      ? ([keyOrKeysPath] as string[])
      : ([] as string[]);
    isCompareLength = this.anyToBoolean(isCompareLength);
    isCompareSize = this.anyToBoolean(isCompareSize);
    isAllowEquivalent = this.anyToBoolean(isAllowEquivalent);
    isCompareStringToNumber = this.anyToBoolean(isCompareStringToNumber);
    let isGreater = true; //obligatorio iniciar con true
    //eliminar claves identificadoras repetidas
    const isKPTCArray = this.isArray(keysPath, false); //❗no se aceptan vacios
    if (isKPTCArray) keysPath = [...new Set(keysPath as string[])];
    const sp = this.charSeparatorLogicPath;
    //comparar arrays
    if (this.isArray(valueBase, true) && this.isArray(valueToCompare, true)) {
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
        //comparar todos loes elementos
        for (let idx = 0; idx < lenItemRun; idx++) {
          const sValueBase = valueBase[idx];
          const sValueToCompare = valueToCompare[idx];
          const isEquivalent = this.isEquivalentTo(
            [sValueBase, sValueToCompare],
            {
              isCaseSensitiveForString,
              isCompareLength,
              isCompareSize,
              isCompareStringToNumber,
              keyOrKeysPath: keysPath,
            }
          );
          //tratamiento de equivalencias (para seguir al siguinte objeto)
          if (isEquivalent) {
            if (idx < lenItemRun - 1) continue; //solo continuará si esquivalente y no el ultimo
            isGreater = isAllowEquivalent;
            break;
          }
          isGreater = this.isGreaterTo([sValueBase, sValueToCompare], {
            isAllowEquivalent,
            keyOrKeysPath: isKPTCArray ? keysPath : undefined,
            isCompareLength,
            isCompareSize,
            isCompareStringToNumber,
            isCaseSensitiveForString,
          });
          break;
        }
      }
    }
    //comparar objetos
    else if (
      this.isObject(valueBase, true) &&
      this.isObject(valueToCompare, true)
    ) {
      if (isKPTCArray) {
        const lenKP = keysPath.length;
        const lenVB = Object.keys(valueBase).length; //no necesitan ordenarse
        const lenVC = Object.keys(valueToCompare).length; //no necesitan ordenarse
        if (lenVB === 0 && lenVC === 0) {
          isGreater = isAllowEquivalent;
        } else {
          for (let idx = 0; idx < lenKP; idx++) {
            const itemKeyPath = keysPath[idx];
            const keysSplitPath = itemKeyPath.split(sp);
            const key = keysSplitPath[0];
            keysSplitPath.shift();
            const subKeysPathToCompare =
              keysSplitPath.length > 0 ? [keysSplitPath.join(sp)] : [];
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
              isGreater = isAllowEquivalent;
              break;
            }
            //compare mayor
            isGreater = this.isGreaterTo([sValueBase, sValueToCompare], {
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
        const keysVB = Object.keys(valueBase).sort();
        const keysVC = Object.keys(valueToCompare).sort();
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
              isGreater = isAllowEquivalent;
              break;
            }
            isGreater = this.isGreaterTo([sValueBase, sValueToCompare], {
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
      isGreater = modulus > 0 ? true : isAllowEquivalent && modulus === 0;
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
    //comparar funciones
    else if (
      typeof valueBase === "function" &&
      typeof valueToCompare === "function"
    ) {
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
    //comparar caso especial null
    else if (valueBase === null && valueToCompare === null) {
      isGreater = isAllowEquivalent;
    }
    //comparar caso especial undefined
    else if (valueBase === undefined && valueToCompare === undefined) {
      isGreater = isAllowEquivalent;
    }
    //comparar primitivos
    else {
      if (valueBase === undefined) {
        isGreater = false;
      } else if (valueBase === null) {
        isGreater = valueToCompare === undefined;
      } else if (typeof valueBase === "function") {
        isGreater = valueToCompare === undefined || valueToCompare === null;
      } else if (this.isBoolean(valueBase)) {
        isGreater =
          valueToCompare === undefined ||
          valueToCompare === null ||
          typeof valueToCompare === "function";
      } else if (this.isNumber(valueBase, false)) {
        isGreater =
          valueToCompare === undefined ||
          valueToCompare === null ||
          typeof valueToCompare === "function" ||
          this.isBoolean(valueToCompare);
      } else if (this.isString(valueBase, true)) {
        isGreater =
          valueToCompare === undefined ||
          valueToCompare === null ||
          typeof valueToCompare === "function" ||
          this.isBoolean(valueToCompare) ||
          this.isNumber(valueToCompare);
      } else if (this.isObject(valueBase, true)) {
        isGreater =
          valueToCompare === undefined ||
          valueToCompare === null ||
          typeof valueToCompare === "function" ||
          this.isBoolean(valueToCompare) ||
          this.isNumber(valueToCompare) ||
          this.isString(valueToCompare, true);
      } else if (this.isArray(valueBase, true)) {
        isGreater =
          valueToCompare === undefined ||
          valueToCompare === null ||
          typeof valueToCompare === "function" ||
          this.isBoolean(valueToCompare) ||
          this.isNumber(valueToCompare) ||
          this.isString(valueToCompare, true) ||
          this.isObject(valueToCompare, true);
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
   * - `function`
   * - `boolean`
   * - `number`
   * - `string-number` cuando esta activada `isCompareStringToNumber`
   * - `string`
   * - `object`
   * - `array`
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
   * @param {object} config Configuración para realizar la comparación:
   *   - `isAllowEquivalent` (**Obligatorio**) determina si se permite la equivalencia en la compracion
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
  public isLesserTo(compareValues: [any, any], config: IConfigEqGtLt): boolean {
    if (!this.isArray(compareValues, true) || compareValues.length > 2)
      throw new Error(`${config} is not tuple of compare values valid`);
    if (!this.isObject(config, true))
      throw new Error(`${config} is not object of configuration valid`);
    //si es vacio es como comparar `undefined < undefined` (no es menor a si mismo, puede ser equivalente)
    if ((compareValues as any[]).length === 0) return config.isAllowEquivalent;
    //si solo tiene un elemento es como si comparara a `any < undefined`
    if ((compareValues as any[]).length === 1)
      return compareValues[0] === undefined && config.isAllowEquivalent;
    if (
      this.isNotUndefinedAndNotNull(config.keyOrKeysPath) &&
      !this.isString(config.keyOrKeysPath) && //❗Obligario negar string vacio❗
      !this.isArray(config.keyOrKeysPath, true) //❗Obligario permitir array vacio❗
    )
      throw new Error(`${config.keyOrKeysPath} is not key or keys path valid`);
    let {
      isCompareLength = false, //❗Obligatorio `false` predefinido❗
      isCompareSize = false, //❗Obligatorio `false` predefinido❗
      keyOrKeysPath,
      isAllowEquivalent = false, //predefinidos
      isCompareStringToNumber = false, //predefinidos
      isCaseSensitiveForString = true, //predefinidos
    } = config;
    //Inicio de proceso
    const [valueBase, valueToCompare] = compareValues;
    let keysPath = this.isArray(keyOrKeysPath, true)
      ? ([...keyOrKeysPath] as string[])
      : this.isString(keyOrKeysPath)
      ? ([keyOrKeysPath] as string[])
      : ([] as string[]);
    isCompareLength = this.anyToBoolean(isCompareLength);
    isCompareSize = this.anyToBoolean(isCompareSize);
    isAllowEquivalent = this.anyToBoolean(isAllowEquivalent);
    isCompareStringToNumber = this.anyToBoolean(isCompareStringToNumber);
    let isLesser = true; //obligatorio iniciar con true
    //eliminar claves identificadoras repetidas
    const isKPTCArray = this.isArray(keysPath, false); //❗no se aceptan vacios
    if (isKPTCArray) keysPath = [...new Set(keysPath as string[])];
    const sp = this.charSeparatorLogicPath;
    //comparar arrays
    if (this.isArray(valueBase, true) && this.isArray(valueToCompare, true)) {
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
        //comparar todos loes elementos
        for (let idx = 0; idx < lenItemRun; idx++) {
          const sValueBase = valueBase[idx];
          const sValueToCompare = valueToCompare[idx];
          const isEquivalent = this.isEquivalentTo(
            [sValueBase, sValueToCompare],
            {
              isCaseSensitiveForString,
              isCompareLength,
              isCompareSize,
              isCompareStringToNumber,
              keyOrKeysPath: keysPath,
            }
          );
          //tratamiento de equivalencias (para seguir al siguinte objeto)
          if (isEquivalent) {
            if (idx < lenItemRun - 1) continue; //solo continuará si esquivalente y no el ultimo
            isLesser = isAllowEquivalent;
            break;
          }
          isLesser = this.isLesserTo([sValueBase, sValueToCompare], {
            isAllowEquivalent,
            keyOrKeysPath: isKPTCArray ? keysPath : undefined,
            isCompareLength,
            isCompareSize,
            isCompareStringToNumber,
            isCaseSensitiveForString,
          });
          break;
        }
      }
    }
    //comparar objetos
    else if (
      this.isObject(valueBase, true) &&
      this.isObject(valueToCompare, true)
    ) {
      if (isKPTCArray) {
        const lenKP = keysPath.length;
        const lenVB = Object.keys(valueBase).length; //no necesitan ordenarse
        const lenVC = Object.keys(valueToCompare).length; //no necesitan ordenarse
        if (lenVB === 0 && lenVC === 0) {
          isLesser = isAllowEquivalent;
        } else {
          for (let idx = 0; idx < lenKP; idx++) {
            const itemKeyPath = keysPath[idx];
            const keysSplitPath = itemKeyPath.split(sp);
            const key = keysSplitPath[0];
            keysSplitPath.shift();
            const subKeysPathToCompare =
              keysSplitPath.length > 0 ? [keysSplitPath.join(sp)] : [];
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
        const keysVB = Object.keys(valueBase).sort();
        const keysVC = Object.keys(valueToCompare).sort();
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
    //comparar funciones
    else if (
      typeof valueBase === "function" &&
      typeof valueToCompare === "function"
    ) {
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
    //comparar caso especial null
    else if (valueBase === null && valueToCompare === null) {
      isLesser = isAllowEquivalent;
    }
    //comparar caso especial undefined
    else if (valueBase === undefined && valueToCompare === undefined) {
      isLesser = isAllowEquivalent;
    }
    //comparar primitivos
    else {
      if (valueBase === undefined) {
        isLesser = true;
      } else if (valueBase === null) {
        isLesser = valueToCompare !== undefined;
      } else if (typeof valueBase === "function") {
        isLesser = valueToCompare !== undefined && valueToCompare !== null;
      } else if (this.isBoolean(valueBase)) {
        isLesser =
          valueToCompare !== undefined &&
          valueToCompare !== null &&
          typeof valueToCompare !== "function";
      } else if (this.isNumber(valueBase, false)) {
        isLesser =
          valueToCompare !== undefined &&
          valueToCompare !== null &&
          typeof valueToCompare !== "function" &&
          !this.isBoolean(valueToCompare);
      } else if (this.isString(valueBase, true)) {
        isLesser =
          valueToCompare !== undefined &&
          valueToCompare !== null &&
          typeof valueToCompare !== "function" &&
          !this.isBoolean(valueToCompare) &&
          !this.isNumber(valueToCompare);
      } else if (this.isObject(valueBase, true)) {
        isLesser =
          valueToCompare !== undefined &&
          valueToCompare !== null &&
          typeof valueToCompare !== "function" &&
          !this.isBoolean(valueToCompare) &&
          !this.isNumber(valueToCompare) &&
          !this.isString(valueToCompare, true);
      } else if (this.isArray(valueBase, true)) {
        isLesser =
          valueToCompare !== undefined &&
          valueToCompare !== null &&
          typeof valueToCompare !== "function" &&
          !this.isBoolean(valueToCompare) &&
          !this.isNumber(valueToCompare) &&
          !this.isString(valueToCompare, true) &&
          !this.isObject(valueToCompare, true);
      } else {
        isLesser = false;
      }
    }
    return isLesser;
  }
  /**... */
  public anyCompareTo(
    compareValues: [any, any],
    config: Omit<IConfigEqGtLt, "isAllowEquivalent">
  ): number {
    const isEquivalent = this.isEquivalentTo(compareValues, { ...config });
    if (isEquivalent) return 0;
    const isGreater = this.isGreaterTo(compareValues, {
      ...(config as IConfigEqGtLt),
      isAllowEquivalent: true, //❗Obligatorio true
    });
    if (isGreater) return 1;
    const isLesser = this.isLesserTo(compareValues, {
      ...(config as IConfigEqGtLt),
      isAllowEquivalent: true, //❗Obligatorio true
    });
    if (isLesser) return -1;
    throw new Error(`Internal Errror in anyCompareTo() method`);
  }
}
