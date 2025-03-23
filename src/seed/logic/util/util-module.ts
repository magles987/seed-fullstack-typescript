import { ELogicCodeError, LogicError } from "../errors/logic-error";
import { Model } from "../models/_model";
import { Driver } from "../providers/_drivers/_driver";
import { Util_Logic } from "./util-logic";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *Singleton*
 *
 * descrip...
 *
 */
export class Util_Module extends Util_Logic {
  /**  Almacena la instancia única de esta clase */
  private static Util_Module_instance: Util_Module;
  /**
   * Array de expresiones regulares de prefijos
   * que identifican propiedades especiales
   * de un objeto (normalmente de
   * configuración). Por ejemplo:
   *````
   * const objeto = {
   *   __prop1: "algo especial",
   *   __prop2: "también especial"
   *   _id: "no es especial"
   *   nombre: "tampoco es especial"
   * }
   *````
   */
  public readonly rePrefixesPropsConfig: RegExp[] = [/^__/];
  /**diccionario de expresiones regulares para validadores */
  public static readonly diccValRE = {
    /**permite todos los caracteres y acentos de los lenguajes
     * (ingles, español, portugues, Frances, italiano, alemán)
     * ademas se signos de puntuación */
    alphaNumFull: /^[0-9A-zÀ-Ÿ\d- ,.:;()$@%*#\'\"+-/=!¡¿?]+$/, //new RegExp("^[0-9A-zÀ-Ÿ\d- ,.:;()$@%*#\'\"+-/=!¡¿?]+$"),
    alphaNumWithSpace: /^[0-9A-zÀ-Ÿ\d- ]+$/,
    alphaNumWithOutSpace: /^[0-9A-zÀ-Ÿ\d-]+$/,
    alpha: /^[A-zÀ-Ÿ\\d-]+$/,
    textNumeric: /^[0-9 ]+$/,
    genericPhone: /^[()0-9 ]+$/,
    genericEmail:
      /^[\w-\.áéíóúÁÉÍÓÚüÜ]{3,}@([\w-áéíóúÁÉÍÓÚüÜ]{2,}\.)*([\w-áéíóúÁÉÍÓÚüÜ]{2,}\.)[\w-áéíóúÁÉÍÓÚüÜ]{2,6}$/,
    /**conmtraseña con Mayuscula miniscula numero y Caracter especial */
    hardPassword:
      /^(?=.*[a-zñáéíóúü])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ])+$/,
    softPassword: /^[0-9A-zÀ-Ÿ]+$/,
    /** */
    dd_mm_yyyy:
      /^([0-2][0-9]|3[0-1])(\/|\-|\\#|\_|\.)(0[1-9]|1[0-2])\2(\d{4})$/,
    /**formato de hora */
    HH_mm_ss: /^([0-1][0-9]|2[0-3])(:)([0-5][0-9])(:)([0-5][0-9])$/,
  };
  /**diccionario de expresiones regulares para validadores */
  public readonly diccValRE = Util_Module.diccValRE;
  /**... */
  public readonly charSeparatorLogicName = "-";
  /** */
  constructor() {
    super();
  }
  /** devuelve la instancia única de esta clase
   * ya sea que la crea o la que ya a sido creada
   */
  public static getInstance(): Util_Module {
    Util_Module.Util_Module_instance =
      Util_Module.Util_Module_instance === undefined ||
      Util_Module.Util_Module_instance === null
        ? new Util_Module()
        : Util_Module.Util_Module_instance;
    return Util_Module.Util_Module_instance;
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
  /**
   * Obtiene un diccionario a partir de otro, solo
   * con las propiedades seleccionadas. Esta
   * selección se hace en base a los identificadores
   * de sus propiedades.
   *
   * ⚠ NO se seleccionan las propiedades que tengan
   * asignados valores de tipo `function` o `symbol`.
   * ____
   * @param dicc El diccionario del cual se
   * seleccionarán las propiedades.
   *
   * @param excludePrefixesPatterns Array con prefijos
   * en formato Expresión Regular de identificadores
   * de propiedades que **no** deben ser seleccionados.
   *
   * @param includeKeyProperties Array con identificadores
   * exactos que serán seleccionables así cumplan con la
   * restricción de los prefijos del parámetro
   * `prefixExcludePatterns`.
   * ____
   * @returns El nuevo diccionario con las propiedades
   * seleccionadas o `{}` si no hay propiedades.
   */
  public selectOnlyProperties<TRDicc>(
    dicc: any,
    excludePrefixesPatterns: RegExp[] = this.rePrefixesPropsConfig,
    includeKeyProperties: string[] = []
  ): TRDicc {
    let r = <TRDicc>{};
    if (!this.isObject(dicc)) return <any>{}; //diccionario vacio
    for (const key in dicc) {
      const isExcludePatterns = excludePrefixesPatterns.some((item) =>
        item.test(key)
      );
      const isIncludeProp = includeKeyProperties.some((item) => item === key);
      if (
        (!isExcludePatterns || isIncludeProp) &&
        typeof dicc[key] != "function" &&
        typeof dicc[key] != "symbol"
      ) {
        r[key] = dicc[key];
      }
    }
    return r;
  }
  /**fusiona dos acciones de configuracion **sencillas**
   *
   */
  public mergeActionConfig(
    tActionConfig: [any, any],
    option: Parameters<typeof this.deepMergeObjects>[1] = { mode: "soft" }
  ): any {
    if (!this.isTuple(tActionConfig, 2)) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${
          tActionConfig as any as string
        } is not tuple of actionConfig valid`,
      });
    }
    const [baseAC, newAC] = tActionConfig;
    let actionConfig: any = undefined;
    if (newAC === undefined) {
      //undefined indica que se asigne la configuración predefinida
      actionConfig = baseAC;
    } else if (newAC === null) {
      //null EXPLICITO indica que la acción se desactiva
      actionConfig = null;
      //---Posible a futuro-----
      // }else if(newAC === true){
      //   //true puede inidcar que se esta activada pero
      //   //que se requiere la configuracion predefinida
      //   actionConfig = this.isBoolean(baseAC)
      //     ? newAC //se asume explicitamenete la nueva configuracion
      //     : baseAC;
    } else if (this.isObject(newAC)) {
      actionConfig = this.deepMergeObjects([baseAC, newAC], option);
    } else {
      actionConfig = newAC;
    }
    return actionConfig;
  }
  /** fusiona dos diccionarios de acciones de configuración */
  public mergeDiccActionConfig<TDiccAC>(
    tDiccActionConfig: [TDiccAC, TDiccAC],
    option: Parameters<typeof this.deepMergeObjects>[1] = { mode: "soft" }
  ): TDiccAC {
    if (!this.isTuple(tDiccActionConfig, 2)) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${
          tDiccActionConfig as any as string
        } is not tuple of actionConfig dictionary valid`,
      });
    }
    const [baseDiccAC, newADiccAC] = tDiccActionConfig;
    let diccAC = {} as TDiccAC;
    if (this.isObject(newADiccAC)) {
      if (this.isObject(baseDiccAC)) {
        const tATuplaAC = [
          this.convertObjectToArrayOfTuples(baseDiccAC),
          this.convertObjectToArrayOfTuples(newADiccAC),
        ] as any as [any[], any[]];
        const aTuplaAC = this.mergeTupleArrayOfTupleActionConfig(
          tATuplaAC,
          option
        );
        diccAC = this.arrayEntriesToObject(aTuplaAC) as TDiccAC;
      } else {
        diccAC = newADiccAC; //si por casualidad base no es un objeto sea asume le nuevo (como esté)
      }
    } else {
      diccAC = baseDiccAC; //si el nuevo no es un objeto se asume el diccionario base
    }
    return diccAC;
  }
  /**... */
  public mergeTupleArrayOfTupleActionConfig<TDiccAC>(
    tArrayTupleActionConfig: [
      Array<[keyof TDiccAC, TDiccAC[keyof TDiccAC]]>, //array tuple base
      Array<[keyof TDiccAC, TDiccAC[keyof TDiccAC]]> //array tuple nuevo
    ],
    config: Parameters<typeof this.deepMergeObjects>[1] = { mode: "soft" }
  ): Array<[keyof TDiccAC, TDiccAC[keyof TDiccAC]]> {
    if (!this.isTuple(tArrayTupleActionConfig, 2)) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${
          tArrayTupleActionConfig as any as string
        } is not tuple of array of tuples of action Config`,
      });
    }
    const [aTupleBaseAC, aTupleNewAC] = tArrayTupleActionConfig;
    if (
      !this.isArray(aTupleBaseAC) ||
      !aTupleBaseAC.every((tBaseAC) => this.isTuple(tBaseAC, 2))
    ) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${
          aTupleBaseAC as any as string
        } is not array of tuples of action Config base valid`,
      });
    }
    if (
      !this.isArray(aTupleNewAC) ||
      !aTupleNewAC.every((tBaseAC) => this.isTuple(tBaseAC, 2))
    ) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${
          aTupleNewAC as any as string
        } is not array of tuples of action Config new valid`,
      });
    }
    let aT_fusion = [
      ...this.removeTupleArrayDuplicateByKey(aTupleBaseAC),
      ...this.removeTupleArrayDuplicateByKey(aTupleNewAC),
    ];
    let aTupleAC = [];
    for (let idx = 0; idx < aT_fusion.length; idx++) {
      const tAC = aT_fusion[idx];
      const [keyAC, aC] = tAC;
      const idxF = aT_fusion.findLastIndex((_tAC) => {
        const _keyAC = _tAC[0];
        const r = keyAC === _keyAC;
        return r;
      });
      if (idxF > idx) {
        const baseAC = aC;
        const newAC = aT_fusion[idxF][1];
        const mAC = this.mergeActionConfig([baseAC, newAC], config);
        aTupleAC.push([keyAC, mAC]);
        continue;
      }
      const cIdx = aTupleAC.findIndex((_tAC) => {
        const _keyAC = _tAC[0];
        const r = keyAC === _keyAC;
        return r;
      });
      if (cIdx === -1) aTupleAC.push(tAC);
    }
    return aTupleAC;
  }
  /**convierte un diccionario de acciones de configuracion
   * a un array de tuplas y lo ordena de acuerdo a las prioridades*/
  public sortDiccActionConfigBySortKeys<TDiccAC>(
    diccAC: TDiccAC,
    keysActionToSort: Array<keyof TDiccAC>
  ): Array<[keyof TDiccAC, TDiccAC[keyof TDiccAC]]> {
    if (!this.isObject(diccAC, true)) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${diccAC} is not action config dictionary valid`,
      });
    }
    if (!this.isArray(keysActionToSort, true)) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${keysActionToSort} is not array of priority keys valid`,
      });
    }
    let rATDiccAC = [] as Array<[keyof TDiccAC, TDiccAC[keyof TDiccAC]]>;
    keysActionToSort = this.removeArrayDuplicate(keysActionToSort, {
      itemConflictMode: "first",
    });
    let bfDicc = { ...diccAC };
    //verificar prioridades y se asignan en los primeros items
    for (const keyAction of keysActionToSort) {
      if (bfDicc.hasOwnProperty(keyAction)) {
        rATDiccAC.push([keyAction, bfDicc[keyAction]]);
        delete bfDicc[keyAction]; // Eliminar la propiedad para no repetir la tupla
      }
    }
    //union de tuplas
    rATDiccAC = [
      ...rATDiccAC, //ordenadas en prioridad
      ...(this.convertObjectToArrayOfTuples(bfDicc) as Array<[any, any]>), //restantes
    ];
    return rATDiccAC;
  }
  /**
   * @param keyPath la ruta de la clave identificadora del recurso
   * @returns si es o no embebido segun su path
   */
  public isEmbeddedFromKeyPath(keyPath: string | undefined): boolean {
    if (!this.isString(keyPath)) return false;
    const cS = this.charSeparatorLogicPath;
    const r = keyPath.split(cS).length > 1; //debe tener mas de un nivel
    return r;
  }
  /**
   * obtener la clave identificadora del recurso
   * a partir de una clave de ruta (campo, modelo,
   * modelo embebido).
   *
   * Ejemplo:
   * ```
   * //structurado:
   * keyPath = "nombreModelo.nombreCampo.nombreSubcampo"
   * keySrc = getKeySrcByKeyPath(); //"nombreModelo"
   * ````
   * ____
   * @param keyPath la ruta de la clave identificadora
   * ____
   * @return la clave identificadora del recurso sin ruta
   */
  public getKeySrcByKeyPath(keyPath: string): string {
    const sp = this.charSeparatorLogicPath;
    const aPath = keyPath.split(sp);
    let r = aPath[0];
    return r;
  }
  /**
   * obtener la clave identificadora del recurso profundo
   * a partir de una clave de ruta (campo, modelo,
   * modelo embebido).
   *
   * Ejemplo:
   * ````
   * //structurado:
   * keyPath = "nombreModelo.nombreCampo.nombreSubcampo"
   * keyLogic = getKeyLogicByKeyPath(); //"nombreSubcampo"
   * ````
   * ____
   * @param keyPath la ruta de la clave identificadora
   * ____
   * @return la clave identificadora (sin ruta)
   */
  public getKeyLogicByKeyPath(keyPath: string): string {
    const sp = this.charSeparatorLogicPath;
    const aPath = keyPath.split(sp);
    const lenAPath = aPath.length;
    let r = aPath[lenAPath - 1];
    return r;
  }
}
