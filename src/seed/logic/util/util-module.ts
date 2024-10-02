import { TKeyStructureContextFull } from "../config/shared-modules";
import { ELogicCodeError, LogicError } from "../errors/logic-error";
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
    if (!this.isObject(dicc)) {
      return <any>{}; //diccionario vacio
    }
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
    config: Parameters<typeof this.deepMergeObjects>[1] = { mode: "soft" }
  ): any {
    if (!this.isTuple(tActionConfig, 2)) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${
          tActionConfig as any as string
        } is not tuple of actionConfig valid`,
      });
    }
    if (!this.isObject(config)) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${config as any as string} is not config object valid`,
      });
    }
    const [baseAC, newAC] = tActionConfig;
    let actionConfig: any = undefined;
    if (newAC === undefined) {
      //undefined indica que se asigne la configuracion predefinida
      actionConfig = baseAC;
    } else if (newAC === null) {
      //null EXPLICITO indica que la accion se desactiva
      actionConfig = null;
      //---Posible a futuro-----
      // }else if(newAC === true){
      //   //true puede inidcar que se esta activada pero
      //   //que se requiere la configuracion predefinida
      //   actionConfig = this.isBoolean(baseAC)
      //     ? newAC //se asume explicitamenete la nueva configuracion
      //     : baseAC;
    } else if (this.isObject(newAC)) {
      actionConfig = this.deepMergeObjects([baseAC, newAC], config);
    } else {
      actionConfig = newAC;
    }
    return actionConfig;
  }
  /** fusiona dos diccionarios de acciones de configuracion */
  public mergeDiccActionConfig<TDiccAC>(
    tDiccActionConfig: [TDiccAC, TDiccAC],
    config: Parameters<typeof this.deepMergeObjects>[1] = { mode: "soft" }
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
          config
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
  /**ordena un array de tuplas de accion de configuracion según prioridad */
  public sortArrayOfTupleActionConfigByPriority<TDiccAC>(
    aTuplaAC: Array<[keyof TDiccAC, TDiccAC[keyof TDiccAC]]>,
    keysActionPriority: Array<keyof TDiccAC>
  ): Array<[keyof TDiccAC, TDiccAC[keyof TDiccAC]]> {
    if (!this.isArrayTuple(aTuplaAC, [1, 2])) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${aTuplaAC} is not array of action tuple valid`,
      });
    }
    if (!this.isArray(keysActionPriority, true)) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${keysActionPriority} is not array of priorities key`,
      });
    }
    const keysAction = aTuplaAC.map((t) => t[0]);
    const keysActionPri = keysActionPriority.filter((kP) =>
      keysAction.includes(kP)
    ); //solo usar las prioridades que estan en las tuplas (las demas ignorarlas)
    let bfATAC_Pri = [];
    let bfATAC_leftover = [];
    let rATuplaAC: Array<[keyof TDiccAC, TDiccAC[keyof TDiccAC]]> = [];
    for (const tAC of aTuplaAC) {
      const key = tAC[0];
      const idxPri = keysActionPri.findIndex((kP) => kP === key);
      if (idxPri > -1) {
        bfATAC_Pri[idxPri] = tAC; //conserva la posicion estricta
      } else {
        bfATAC_leftover.push(tAC); //el sobrante tambien conserva la posicion de forma no estricta
      }
    }
    //fusionar conservando orden de prioridad
    rATuplaAC = [...bfATAC_Pri, ...bfATAC_leftover];
    return rATuplaAC;
  }
  /**
   * filtra acciones que estan activas
   * ____
   * @param aDiccActionConfig diccionario con la
   * configuracion de cada accion (sea que
   * se ejecuten o no)
   * ____
   * @returns el diccionario convertido en array
   * ordenado segun prioridad
   * ____
   */
  public filterActiveADAC(aDiccActionConfig: object[]): object[] {
    if (!this.isArray(aDiccActionConfig)) return [];
    const castException: Parameters<typeof this.convertToBoolean>[1] = [
      "isZeroAsTrue",
      "isEmptyAsTrue", //las acciones con configuracion vacia {} se consideran activas
    ];
    aDiccActionConfig = this.clone(aDiccActionConfig);
    aDiccActionConfig = aDiccActionConfig.filter((diccAC) => {
      const actionConfig = Object.values(diccAC)[0];
      const r = this.convertToBoolean(actionConfig, castException);
      return r;
    });
    return aDiccActionConfig;
  }
  /**crea un key path estandar a aprtir de un array
   * de claves identificadoras para propositos generales
   *
   * @param aKeys el array con las clave sidentificadoras
   *
   * @returns el string keyPath ya construido
   */
  public buildKeyPathForGeneralPropuse(aKeys: string[]): string {
    const keyPath = this.buildPath(aKeys, {
      charSeparator: this.charSeparatorLogicPath,
      isInitWithSeparator: false,
      isEndtWithSeparator: false,
      pathInit: "",
      pathEnd: "",
    });
    return keyPath;
  }
  /**crea progresivamente un keyPath
   * @param baseKeyPath la clave identificadora base de la ruta
   * @param keyLogic la clave logica a añadir al final del `keyPath`
   * @returns el `keyPath` ya construido
   */
  public buildProgresiveKeyPath(baseKeyPath: string, keyLogic: string): string {
    const sp = this.charSeparatorLogicPath;
    const keyPath = `${baseKeyPath}${sp}${keyLogic}`;
    return keyPath;
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
