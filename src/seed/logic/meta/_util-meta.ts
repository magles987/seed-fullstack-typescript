/**
 * @author MAG
 */
import { Util_Module } from "../util/util-module";
import { Model } from "../models/_model";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**@return un objeto con metadatos utilitarios generales */
export function getDiccUtilMeta() {
  return {
    /**determina el valor que representa
     * **un solo** registro o documento vacio
     *
     * Caso de uso: cuando una peticion no
     * pueda retornar un documento o registro
     *  (porque no lo encontró o cualquier
     * otra razon), este será valor estandar
     * a asignar.
     *
     * Las opciones de configuracion para
     * este valor pueden ser:
     *
     * `undefined`
     * `null`
     * `{}`
     *
     */
    emptyDoc: {},
    /** caracter (o grupo de caracteres) que
     * separan cada `key` identificador del
     * codigo del mensaje */
    msnCodeChartSeparatorPath: ".",
    /**
     * caracter separador de parametros
     * auxiliares al `msnCode`
     */
    msnCodeChartSeparatorParam: "#",
  };
}
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**
 * Utilidades para los metadatos
 */
export class Util_Meta extends Util_Module {
  /**
   * Almacena la instancia única de esta clase
   * ____
   */
  private static Util_Meta_instance: Util_Meta;
  /**
   */
  constructor() {
    super();
  }
  /**
   * devuelve la instancia única de esta clase
   * ya sea que la crea o la que ya a sido creada
   * ____
   */
  public static getInstance(): Util_Meta {
    Util_Meta.Util_Meta_instance =
      Util_Meta.Util_Meta_instance === undefined ||
      Util_Meta.Util_Meta_instance === null
        ? new Util_Meta()
        : Util_Meta.Util_Meta_instance;
    return Util_Meta.Util_Meta_instance;
  }
  /**
   * @returns el nombre del campo con que
   * normalmente se identificará cualquier
   * modelo
   * ____
   */
  public getKeyId(): string {
    const m: keyof Model = "_id";
    return m;
  }
}
