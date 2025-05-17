import lodash from "lodash";
import { TKeyLogicContext } from "../modules/shared-types";
import {
  ELogicOperatorForCondition,
  ELogicOperatorForGroup,
  IGenericDriverCriteria,
  IModifyCriteria,
  IPrimitiveModifyCriteria,
  IPrimitiveReadCriteria,
  IReadCriteria,
  ISingleCondition,
  IStructureModelModifyCriteria,
  IStructureModelReadCriteria,
  TAConds,
} from "../criterias/shared-types";
import { TwinBeeModule } from "../modules/module";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *Singleton*
 *
 * ...
 */
export class QueryTool {
  /**  Almacena la instancia única de esta clase */
  private static QueryTool_instance: QueryTool;
  protected get diccOperatorFn(): Record<
    ELogicOperatorForCondition,
    (value: any, vCond: any) => boolean
  > {
    const util = TwinBeeModule.util;
    return {
      eq: (value, vCond) => util.isEquivalentTo([value, vCond], {}),
      gt: (value, vCond) =>
        util.isGreaterTo([value, vCond], { isAllowEquivalent: false }),
      gte: (value, vCond) =>
        util.isGreaterTo([value, vCond], { isAllowEquivalent: true }),
      lt: (value, vCond) =>
        util.isLesserTo([value, vCond], { isAllowEquivalent: false }),
      lte: (value, vCond) =>
        util.isLesserTo([value, vCond], { isAllowEquivalent: true }),
      bto: (value, vCond) => util.isNumberInRange(value, vCond, false),
      bti: (value, vCond) => util.isNumberInRange(value, vCond, true),
      like_: (value, vCond) =>
        util.isStringLike(value, vCond, { likeType: "end" }),
      _like: (value, vCond) =>
        util.isStringLike(value, vCond, { likeType: "start" }),
      _like_: (value, vCond) =>
        util.isStringLike(value, vCond, { likeType: "between" }),
      a_ctn: (value, vCond) => {
        const isVCArray = util.isArray(vCond);
        let r = false;
        if (!isVCArray) return r;
        value = Array.isArray(value) ? value : [value];
        const aF = util.searchItemsInArray<any[]>(vCond, value, {});
        r = aF.length !== 0;
        return r;
      },
    };
  }
  /**utilidades */
  protected util = TwinBeeModule.util;
  /**... */
  constructor() {}
  /** devuelve la instancia única de esta clase
   * ya sea que la crea o la que ya a sido creada
   *
   */
  public static getInstance(): QueryTool {
    QueryTool.QueryTool_instance =
      QueryTool.QueryTool_instance === undefined ||
      QueryTool.QueryTool_instance == null
        ? new QueryTool()
        : QueryTool.QueryTool_instance;
    return QueryTool.QueryTool_instance;
  }
  /**... */
  protected adaptPrimitiveSingleCondition(
    data: any,
    cond: ISingleCondition
  ): boolean {
    const { op, vCond } = cond;
    const diccCondFn = this.diccOperatorFn;
    const condFn = diccCondFn[op];
    const r = condFn(data, vCond);
    return r;
  }
  /**... */
  protected adaptStructureSingleCondition(
    register: object,
    cond: ISingleCondition
  ): boolean {
    const { op, vCond, keyPathForCond } = cond;
    const diccCondFn = this.diccOperatorFn;
    let r = false;
    if (!this.util.isString(keyPathForCond)) return r;
    //excluir del path el segmento raiz (modelo)
    const sp = this.util.charSeparatorLogicPath;
    let keys = keyPathForCond.split(sp);
    keys.shift();
    const logicPath = keys.join(sp); //sin modelo
    if (
      !this.util.isString(logicPath, false) ||
      !this.util.isObjectWithDeepProperties(register, logicPath, {
        propCondition: "it-exist",
      })
    )
      return r;
    const data = this.util.findObjectProperty(register, logicPath);
    const condFn = diccCondFn[op];
    r = condFn(data, vCond);
    return r;
  }
  /**... */
  protected checkAndReduceQuery(
    keyLogicContext: TKeyLogicContext,
    register: any, //solo 1
    query: TAConds,
    preResult?: boolean
  ): boolean {
    let r = preResult;
    let op = undefined;
    for (let idx = 0; idx < query.length; idx++) {
      const cond = query[idx];
      if (
        cond === ELogicOperatorForGroup.and ||
        cond === ELogicOperatorForGroup.or ||
        cond === ELogicOperatorForGroup.not
      ) {
        //operador de grupo:
        op = cond;
        if (
          idx === 0 &&
          (cond === ELogicOperatorForGroup.and ||
            cond === ELogicOperatorForGroup.or)
        ) {
          op = undefined; //anular operador inicial no permitido, la query no puede empezar con AND u OR
        }
      } else if (this.util.isObject(cond, false)) {
        //condicion sencilla
        let r_sc: boolean;
        if (keyLogicContext === "primitive") {
          r_sc = this.adaptPrimitiveSingleCondition(
            register,
            cond as ISingleCondition
          );
        } else if (keyLogicContext === "structure") {
          r_sc = this.adaptStructureSingleCondition(
            register,
            cond as ISingleCondition
          );
        } else {
          r_sc = false;
        }
        //verificar operador grupal
        if (op === ELogicOperatorForGroup.and) r = r_sc && r;
        else if (op === ELogicOperatorForGroup.or) r = r_sc || r;
        else if (op === ELogicOperatorForGroup.not) r = !r_sc;
        else r = r_sc;
      } else if (this.util.isArray(cond, false)) {
        const subQuery = cond as TAConds;
        const r_sc = this.checkAndReduceQuery(
          keyLogicContext,
          register,
          subQuery,
          r
        );
        //verificar operador grupal
        if (op === ELogicOperatorForGroup.and) r = r_sc && r;
        else if (op === ELogicOperatorForGroup.or) r = r_sc || r;
        else if (op === ELogicOperatorForGroup.not) r = !r_sc;
        else r = r_sc;
      } else {
        r = false;
      }
    }
    return r;
  }
  /**... */
  public async adaptQuery(
    keyLogicContext: TKeyLogicContext,
    registers: any, //puede ser un solo registor o varios
    query: TAConds
  ): Promise<any[]> {
    registers = Array.isArray(registers) ? registers : [registers];
    let rData = registers;
    if (!this.util.isArray(query)) return rData;
    rData = (registers as any[]).filter((register) => {
      let r = this.checkAndReduceQuery(keyLogicContext, register, query);
      return r;
    });
    return rData;
  }
  /**
   * ordenamiento de datos
   * ____
   * @param registers registers recibida del repositorio ❗distinta a la recibida en *bag repository*❗
   * @param literalCriteria el bag con los datos y configuracion a procesar
   * @returns los datos ya ordenados
   */
  public async orderByCriteria(
    registers: any[],
    literalCriteria: IGenericDriverCriteria
  ): Promise<any[]> {
    if (!this.util.isArray(registers)) return registers;
    const { sort } = literalCriteria;
    registers = this.util.sortMixedArray(registers, { direction: sort });
    //registers = lodash.orderBy(registers, keysField, aSorts); //como se hace con lodash???
    return registers;
  }
  /**
   * ordenamiento de datos
   * ____
   * @param registers registers recibida del repositorio ❗distinta a la recibida en *bag repository*❗
   * @param literalCriteria el bag con los datos y configuracion a procesar
   * @returns los datos ya ordenados
   */
  public async primitiveOrderByCriteriaModule(
    registers: any[],
    literalCriteria: IPrimitiveReadCriteria | IPrimitiveModifyCriteria
  ): Promise<any[]> {
    if (!this.util.isArray(registers)) return registers;
    const { sort } = literalCriteria as IPrimitiveReadCriteria;
    registers = this.util.sortMixedArray(registers, { direction: sort });
    //registers = lodash.orderBy(registers, keysField, aSorts); //como se hace con lodash???
    return registers;
  }
  /**
   * ordenamiento de datos
   * ____
   * @param registers registers recibida del repositorio ❗distinta a la recibida en *bag repository*❗
   * @param literalCriteria el bag con los datos y configuracion a procesar
   * @returns los datos ya ordenados
   */
  public async structureOrderByCriteriaModule(
    registers: any[],
    literalCriteria:
      | IStructureModelReadCriteria<any>
      | IStructureModelModifyCriteria<any>
  ): Promise<any[]> {
    if (!this.util.isArray(registers)) return registers;
    const { sort } = literalCriteria as IStructureModelReadCriteria<any>;
    if (!this.util.isArray(sort)) return registers;
    let keysField: string[] = [];
    let aSorts: any[] = [];
    sort.forEach((s) => {
      keysField.push(s[0]);
      aSorts.push(s[1]);
    });
    registers = lodash.orderBy(registers, keysField, aSorts);
    return registers;
  }
  /**
   * @facade
   *
   * paginado básico de datos
   * ____
   * @param registers registers recibida del repositorio ❗distinta a la recibida en *bag repository*❗
   * @param literalCriteria el bag con los datos y configuracion a procesar
   * ____
   * @returns los datos segmentados
   * por pagina
   */
  public async pageByCriteria(
    registers: any[],
    literalCriteria: IGenericDriverCriteria
  ): Promise<any[]> {
    return await this.pageByCriteriaModule(registers, literalCriteria);
  }
  /**
   * @facade
   *
   * paginado básico de datos
   * ____
   * @param registers registers recibida del repositorio ❗distinta a la recibida en *bag repository*❗
   * @param literalCriteria el bag con los datos y configuracion a procesar
   * ____
   * @returns los datos segmentados
   * por pagina
   */
  public async primitivePageByCriteriaModule(
    registers: any[],
    literalCriteria: IPrimitiveReadCriteria | IPrimitiveModifyCriteria
  ): Promise<any[]> {
    return await this.pageByCriteriaModule(registers, literalCriteria);
  }
  /**
   * @facade
   *
   * paginado básico de datos
   * ____
   * @param registers registers recibida del repositorio ❗distinta a la recibida en *bag repository*❗
   * @param literalCriteria el bag con los datos y configuracion a procesar
   * ____
   * @returns los datos segmentados
   * por pagina
   */
  public async structurePageByCriteriaModule(
    registers: any[],
    literalCriteria:
      | IStructureModelReadCriteria<any>
      | IStructureModelModifyCriteria<any>
  ): Promise<any[]> {
    return await this.pageByCriteriaModule(registers, literalCriteria);
  }
  /**
   * @real
   * paginado básico de datos
   * ____
   * @param registers registers recibida del repositorio ❗distinta a la recibida en *bag repository*❗
   * @param literalCriteria el bag con los datos y configuracion a procesar
   * ____
   * @returns los datos segmentados
   * por pagina
   *
   */
  private async pageByCriteriaModule(
    registers: any[],
    literalCriteria:
      | IReadCriteria<any>
      | IModifyCriteria<any>
      | IGenericDriverCriteria
  ): Promise<any[]> {
    if (!this.util.isArray(registers)) return registers;
    const {
      limit,
      targetPage: targetPageBase,
      targetPageLogic,
    } = literalCriteria as IReadCriteria<any>;
    let targetPage = targetPageBase;
    if (limit <= 0) {
      return []; //el limite debe ser positivo
    }
    const registersLen = registers.length;
    if (targetPageLogic === 1) {
      //convertir a logica 0
      targetPage = targetPage - 1;
    }
    targetPage =
      targetPage <= 0
        ? 0 //no puede ser menor al inicial
        : targetPage > Math.floor(registersLen / limit)
        ? Math.floor(registersLen / limit)
        : targetPage;
    let startIdx = targetPage * limit;
    let endIdx = Math.min(startIdx + limit, registersLen);
    const pageData = registers.slice(startIdx, endIdx);
    return pageData;
  }
  //❗❗❗ TODAVÍA NO VIABLE ❗❗❗
  /**... */
  // public async primitiveFilterByBagCriteria(
  //   registers: any[],
  //   literalCriteria: IBagForDriver["literalCriteria"]
  // ): Promise<any[]> {
  //   const { query, keyLogicContext } =
  //     literalCriteria as IPrimitiveReadCriteria;
  //   const data = await this.adaptQuery(keyLogicContext, registers, query);
  //   return data;
  // }
  //❗❗❗ TODAVÍA NO VIABLE ❗❗❗
  /**... */
  // public async primitiveFindByBagCriteria(
  //   registers: any[],
  //   literalCriteria: IBagForDriver["literalCriteria"]
  // ): Promise<any> {
  //   const { query, keyLogicContext } =
  //     literalCriteria as IPrimitiveReadCriteria;
  //   const data = await this.adaptQuery(keyLogicContext, registers, query);
  //   const dataOne = data[0]; //❗Solo se permite el primero❗
  //   return dataOne;
  // }
  //❗❗❗ TODAVÍA NO VIABLE ❗❗❗
  /**... */
  // public async structureFilterByBagCriteria(
  //   registers: any[],
  //   literalCriteria: IBagForDriver["literalCriteria"]
  // ): Promise<any[]> {
  //   const { query, keyLogicContext } =
  //     literalCriteria as IStructureModelReadCriteria<any>;
  //   const data = await this.adaptQuery(keyLogicContext, registers, query);
  //   return data;
  // }
  //❗❗❗ TODAVÍA NO VIABLE ❗❗❗
  // /**... */
  // public async structureFindByBagCriteria(
  //   registers: any[],
  //   literalCriteria: IBagForDriver["literalCriteria"]
  // ): Promise<any> {
  //   const { query, keyLogicContext } =
  //     literalCriteria as IStructureModelReadCriteria<any>;
  //   const data = await this.adaptQuery(keyLogicContext, registers, query);
  //   const dataOne = data[0]; //❗Solo se permite el primero❗
  //   return dataOne;
  // }
}
