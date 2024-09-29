/**
 * @author MAG
 */
import lodash from "lodash";
import { UtilNative } from "./native-util";
import { TStrCase } from "./shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** @info <hr>
 *
 * *Singleton*
 * utilidades comunes para la logica de aplicacion
 * ____
 */
export class UtilExtension extends UtilNative {
  /**Utilidades de lodash */
  public readonly lodash = lodash;
  /**
   * Almacena la instancia única de esta clase
   * ____
   */
  private static UtilExtension_instance: UtilExtension;
  /** */
  constructor(dfValue: null | undefined) {
    super(dfValue);
  }
  /**
   * devuelve la instancia única de esta clase
   * ya sea que la crea o la que ya a sido creada
   * @param dfValue es el valor que se va a asumir como valor
   * predefinido cuando haya ausencia de valor
   */
  public static getInstance(dfValue: null | undefined): UtilExtension {
    UtilExtension.UtilExtension_instance =
      UtilExtension.UtilExtension_instance === undefined ||
      UtilExtension.UtilExtension_instance === null
        ? new UtilExtension(dfValue)
        : UtilExtension.UtilExtension_instance;
    return UtilExtension.UtilExtension_instance;
  }
  //████Booleanos████████████████████████████████████████████████████
  //...aqui personalizacion
  //████Numeros██████████████████████████████████████████████████████
  //...aqui personalizacion
  //████Textos█████████████████████████████████████████████████████
  public override convertStringToCase(str: string, caseType: TStrCase): string {
    if (!this.isString(str)) return str; //no usar throw
    if (!this.isString(caseType))
      throw new Error(`${caseType} is not case convertion type valid`);
    switch (caseType) {
      //convertir a snakeCase
      case "Snake":
        return this.lodash.snakeCase(str);
        break;
      case "Kebab":
        return this.lodash.kebabCase(str);
        break;
      case "Camel":
        return this.lodash.camelCase(str);
        break;
      case "Pascal":
        return super.convertStringToCase(str, caseType);
        break;
      default:
        return str;
        break;
    }
  }
  //████Objetos██████████████████████████████████████████████████████
  //...personalizacion
  //█████Arrays██████████████████████████████████████████████████████
  //...personalizacion
  //████Fechas███████████████████████████████████████████████████████
  //...personalizacion
  //████Genericos████████████████████████████████████████████████████
  /**
   * Realiza la clonación de objetos JSON o Arrays de JSONs a diferentes niveles de profundidad.
   *
   * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
   * ⚠ **SOLO** se puede clonar instancias de clase con "lodash" ⚠
   * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
   *
   * @param {T} objOrArray El objeto a clonar. El tipo `T` se asume implícitamente al enviar el parámetro.
   * @param {"stringify" | "structuredClone" | "lodash"} driver `= "lodash"` el driver o libreria para hacer clonación.
   * @returns {T} Retorna el objeto (o array) clonado. Si no es un objeto (o array), el retorno es el mismo valor.
   *
   * @example
   * ```typescript
   * const obj = { a: 1, b: 2 };
   * const clonedObj = clone(obj);
   * console.log(clonedObj); // salida: { a: 1, b: 2 }
   * ```
   */
  public override clone<T>(
    objOrArray: T,
    driver: "stringify" | "structuredClone" | "lodash" = "lodash"
  ): T {
    if (
      typeof objOrArray != "object" || //❗solo clona los objetos (incluye array)❗
      objOrArray === null
    ) {
      return objOrArray;
    }
    let dataCopia: T;
    if (driver === "lodash") {
      dataCopia = this.lodash.cloneDeep(objOrArray);
    } else {
      dataCopia = super.clone(objOrArray, driver);
    }
    return dataCopia;
  }
}
