import { TKeyLogicContext } from "../../../../../../config/shared-modules";
import {
  ELogicOperatorForGroup,
  ELogicOperatorForCondition,
  ISingleCondition,
  TAConds,
} from "../../../../../../criterias/shared";
import { Util_Logic } from "../../../../../../util/util-logic";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *Singleton*
 *
 * ...
 */
export class QueryJsAdaptator {
  protected get diccOperatorFn(): Record<
    ELogicOperatorForCondition,
    (value: any, vCond: any) => boolean
  > {
    const util = Util_Logic.getInstance();
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
  protected util = Util_Logic.getInstance();
  /**  Almacena la instancia única de esta clase */
  private static QueryAdaptator_instance: QueryJsAdaptator;
  /**... */
  constructor() {}
  /** @returns la instancia unica de la clase*/
  public static getInstance(): QueryJsAdaptator {
    QueryJsAdaptator.QueryAdaptator_instance =
      QueryJsAdaptator.QueryAdaptator_instance === undefined ||
      QueryJsAdaptator.QueryAdaptator_instance === null
        ? new QueryJsAdaptator()
        : QueryJsAdaptator.QueryAdaptator_instance;
    return QueryJsAdaptator.QueryAdaptator_instance;
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
      !this.util.isObjectWithDeepProperties(
        register,
        false,
        logicPath,
        "it-exist"
      )
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
}
