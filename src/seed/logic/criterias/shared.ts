import {
  TKeyLogicContext,
  TKeyRequestModifyType,
  TKeyRequestType,
} from "../config/shared-modules";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**enumeracion de cada representacion
 * de operador logico para construir
 * la condicion de la consulta */
export enum ELogicOperatorForCondition {
  //operaciones comparativas (numeros)
  /**equivalente */
  eq = "eq",
  /**mayor que */
  gt = "gt",
  /**menor que */
  lt = "lt",
  /**mayor o equivalente a */
  gte = "gte",
  /**mayor o equivalente a */
  lte = "lte",
  /**rango entre, ❗No incluye los limites❗ */
  bto = "bto",
  /**rango entre, ❗incluye los limites❗ */
  bti = "bti",
  //operaciones comparativas (string)
  /**que inicie con el string del filtro */
  like_ = "like_",
  /**que finalice con el string del filtro */
  _like = "_like",
  /**que contenga el string del filtro */
  _like_ = "_like_",
  // operaciones de array
  /** elemento o elementos contenidos en el array*/
  a_ctn = "a_ctn",
}
/**operadores logicos para agrupacion y union de condiciones*/
export enum ELogicOperatorForGroup {
  /**negacion */
  not = "not",
  /**union Y */
  and = "and",
  /**union O */
  or = "or",
}
/**clave identificadora de tipo de criteria */
export type TKeyCriteriaType = TKeyRequestType;
/**direccion de orden */
export type TSortDirection = "asc" | "desc";
/**esquema basico para un condicion sencilla de consulta */
export interface ISingleCondition {
  /**operador  */
  op: ELogicOperatorForCondition;
  /**valor de la condicion (valor al
   * cual comparar el `data`)
   *
   * ⚠ Si `urlVCond` está definido este
   * valor se ignora, ya que se le da
   * prioridad al valor almacenado en
   * el recurso ⚠
   */
  vCond: any;
  /**
   * ruta logica de acceso al dato
   *
   * ⚠ necesario solo para los datos estructurados ⚠
   */
  keyPathForCond?: string;
  /**ubicacion del recurso de donde se extrae
   * el valor de la condicion en caso que `vCond`
   * este almacenado dinamicamente*/
  urlVCond?: string | undefined;
}
/**array de condiciones encadenadas */
export type TAConds = Array<
  | ELogicOperatorForGroup //agrupacion de condiciones
  | ISingleCondition
  | TAConds //sub condiciones agrupadas
>;
/**tipo de agrupacion de dato esperado */
export type TExpectedDataType = "single" | "object" | "array";
/** */
export interface ICriteria {
  /**clave identificadora del contexto lógico */
  keyLogicContext: TKeyLogicContext;
  /**clave identificadora del recurso */
  keySrc: string;
  /**clave identificadora del recurso
   * para el proveedor (en singular)*/
  s_Key?: string;
  /**clave identificadora del recurso
   * para el proveedor (en plural)*/
  p_Key?: string;
  /**tipo de criteria */
  type: TKeyRequestType;
  /**clave identificadora del requerimiento
   * asociado a este criterio */
  keyActionRequest: string;
  /**tipo de agrupacion de dato esperado
   * en la respuesta a la peticion */
  expectedDataType: TExpectedDataType;
  /**adiciones de url **ordenadas**.
   *
   * ejemplo basico:
   * ````
   * `${urlRoot}/${urlPrefix}/${urlExtended[0]}/${urlExtended[1]}.../${urlPostfix}`
   * ````
   */
  urlsExtended?: string[];
}
/**
 * define las propiedades de un criterio
 * de peticion de lectura de datos
 */
export interface IReadCriteria extends ICriteria {
  /**limite de docs o registros a obtener */
  limit: number;
  /**criterio de ordenamiento */
  sort: unknown; //⚠ DEBE redefinirse en interfaces que extiendad de esta
  /**pagina objetivo a obtener
   * (cuando se esta paginando) */
  targetPage?: number;
  /**determina logica de paginado a utilizar
   * (`0` indica que la pagina inicial será
   * `0` o `1` para inidcar que sera con
   * logica de `1`)
   */
  targetPageLogic?: 0 | 1;
  /**esquema de consulta */
  query?: TAConds;
}
/**
 * define las propiedades de un criterio
 * de peticion de lectura de datos
 */
export interface IModifyCriteria extends ICriteria {
  /**el tipo de criterio de modificacion a realizar */
  modifyType?: TKeyRequestModifyType;
  /**determina en caso de crear un doc o
   * registro si este ya existe actualizarlo
   *  o no (si no se configura se asume
   * que NO se puede actualizar) */
  isCreateOrUpdate?: boolean;
}
//====Primitive===================================================================================================================
/**esquema de proposito general con los contextos primitivos del modulo*/
export interface IPrimitiveCriteriaContext<
  TPrimitiveCriteria = unknown //puede ser cualquier interfaz o tipado
> {
  primitiveCriteria: TPrimitiveCriteria;
}
/**claves identificadoras para el contexto de ejecucion para el modulo primitive*/
export type TKeyPrimitiveCriteriaModuleContext =
  keyof IPrimitiveCriteriaContext;
/** */
interface IPrimitiveCriteria extends ICriteria {
  //..aqui mas personalizacion
}
/**... */
export interface IPrimitiveReadCriteria
  extends IPrimitiveCriteria,
  IReadCriteria {
  sort: TSortDirection;
}
/** */
export interface IPrimitiveModifyCriteria
  extends IPrimitiveCriteria,
  IModifyCriteria { }
/**... */
export type TPrimitiveBaseCriteria = Partial<
  IPrimitiveReadCriteria & IPrimitiveModifyCriteria
> &
  Pick<IPrimitiveReadCriteria & IPrimitiveModifyCriteria, "type">;
/**... */
export type TPrimitiveBaseCriteriaForCtrlRead = Partial<IPrimitiveReadCriteria>;
/**... */
export type TPrimitiveBaseCriteriaForCtrlModify =
  Partial<
    Omit<IPrimitiveModifyCriteria, "type" | "keyActionRequest" | "keyLogicContext" | "keySrc" | "p_Key" | "s_Key">
  >;
//====Strcuture====================================================================================================================
/**esquema de proposito general con los contextos estructurales del modulo*/
export interface IStructureCriteriaContext<
  TStructureCriteria = unknown //puede ser cualquier interfaz o tipado
> {
  structureCriteria: TStructureCriteria;
}
/**claves identificadoras para el contexto de ejecucion para el modulo structure*/
export type TKeyStructureCriteriaModuleContext =
  keyof IStructureCriteriaContext;
/**clave identificadora profunda para el contexto estructural */
export type TKeyStructureDeepCriteriaModuleContext =
  | "fieldCriteria"
  | "modelCriteria";
/** */
interface IStructureCriteria extends ICriteria {
  /**array con todas las rutas keyPath de este modulo */
  keysPath: string[];
}
/**... */
export interface IStructureReadCriteria<TModel>
  extends IStructureCriteria,
  IReadCriteria {
  sort: Array<Record<keyof TModel, TSortDirection>>;
}
/** */
export interface IStructureModifyCriteria<TModel>
  extends IStructureCriteria,
  IModifyCriteria { }
/**... */
export type TStructureBaseCriteria<TModel> = Partial<
  IStructureReadCriteria<TModel> & IStructureModifyCriteria<TModel>
>;
/**... */
export type TStructureBaseCriteriaForCtrlRead<TModel> = Partial<
  Omit<IStructureReadCriteria<TModel>, "type" | "keyActionRequest" | "keyLogicContext" | "keySrc" | "p_Key" | "s_Key">
>;
/**... */
export type TStructureBaseCriteriaForCtrlModify<TModel> = Partial<
  Omit<IStructureModifyCriteria<TModel>, "type" | "keyActionRequest" | "keyLogicContext" | "keySrc" | "p_Key" | "s_Key">
>;
