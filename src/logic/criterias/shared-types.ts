import { PrimitiveLogicController } from "../controllers/primitive-ctrl";
import {
  TPrimitiveCtrlDiccACForCriteria,
  TStructureCtrlDiccACForCriteria,
} from "../controllers/shared-types";
import { StructureLogicController } from "../controllers/structure-ctrl";
import { PrimitiveLogicHook } from "../hooks/primitive-hook";
import {
  TPrimitiveHookDiccACForCriteria,
  TStructureModelHookDiccACForCriteria,
} from "../hooks/shared-types";
import { StructureLogicHook } from "../hooks/structure-hook";
import {
  TKeyRequestType,
  TKeyLogicContext,
  TKeyRequestModifyType,
  TKeyStructureContextFull,
} from "../modules/shared-types";
import { FieldLogicMutater } from "../mutaters/field-mutater";
import { ModelLogicMutater } from "../mutaters/model-mutater";
import { PrimitiveLogicMutater } from "../mutaters/primitive-mutater";
import {
  TPrimitiveMutateDiccACForCriteria,
  TStructureModelMutateDiccACForCriteria,
  TStructureEmbModelMutateDiccACForCriteria,
  TStructureFieldMutateDiccACForCriteria,
} from "../mutaters/shared-types";
import { PrimitiveLogicProvider } from "../providers/primitive-provider";
import {
  TPrimitiveProviderDiccACForCriteria,
  TStructureModelProviderDiccACForCriteria,
} from "../providers/shared-types";
import { StructureLogicProvider } from "../providers/structure-provider";
import {
  IResponse,
  IPrimitiveResponse,
  IStructureResponse,
} from "../reports/shared-types";
import { FieldLogicValidation } from "../validators/field-validation";
import { ModelLogicValidation } from "../validators/model-validation";
import { PrimitiveLogicValidation } from "../validators/primitive-validation";
import { RequestLogicValidation } from "../validators/request-validation";
import {
  TPrimitiveValDiccACForCriteria,
  TStructureModelValDiccACForCriteria,
  TStructureEmbModelValDiccACForCriteria,
  TStructureFieldValDiccACForCriteria,
} from "../validators/shared-types";
import { CriteriaHandler } from "./_criteria-handler";
import { PrimitiveCriteriaHandler } from "./primitive-criteria-handler";
import { StructureCriteriaHandler } from "./structure-criteria-handler";

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
/**operadores lógicos para agrupación y union de condiciones*/
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
/**esquema básico para un condicion sencilla de consulta */
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
   * ruta lógica de acceso al dato
   *
   * ⚠ necesario solo para los datos estructurados ⚠
   */
  keyPathForCond?: string;
  /**ubicación del recurso de donde se extrae
   * el valor de la condición en caso que `vCond`
   * este almacenado dinamicamente*/
  urlVCond?: string | undefined;
}
/**array de condiciones encadenadas */
export type TAConds = Array<
  | ELogicOperatorForGroup //agrupacion de condiciones
  | ISingleCondition
  | TAConds //sub condiciones agrupadas
>;
/**direccion de orden */
export type TSortDirection = "asc" | "desc";
/**tipo de agrupación de dato esperado */
export type TExpectedDataType =
  | "any"
  | "boolean"
  | "number"
  | "string"
  | "object"
  | "array";
/** */
export type TTGlobalActionConfig<TDiccGlobalAC> = {
  [K1 in keyof TDiccGlobalAC]: {
    [K2 in keyof TDiccGlobalAC[K1]]: [K1, K2, TDiccGlobalAC[K1][K2]];
  }[keyof TDiccGlobalAC[K1]];
}[keyof TDiccGlobalAC];
/** */
export interface ICriteria<
  TDiccGlobalAC,
  TKeyDiccActionRequest extends string = string
> {
  /**datos para la petición */
  data: any;
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
  keyActionRequest: TKeyDiccActionRequest;
  /**tipo de agrupación de dato esperado
   * en la respuesta a la petición */
  expectedDataType: TExpectedDataType;
  /**array de tuplas de claves identificadoras asociadas a
   * acciones de configuración globales y sus
   * respectivos módulos
   * en orden de ejecución
   *
   * para cada tupla el esquema es:
   *
   * `[0]` : key del modulo correspondiente.
   *
   * `[1]` : key de la acción correspondiente
   *
   * `[2]` :  la acción de configuración
   */
  aTGlobalActionConfig: TTGlobalActionConfig<TDiccGlobalAC>[];
  /**diccionario con parámetros para construir la query */
  diccQueryParam: any;
  /**array de tuplas con las funciones personalizadas diseñadas
   * específicamente para la consulta de un driver especifico */
  aTCustomQueryDriverFunctions: Array<[string, Function]>;
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
export interface IReadCriteria<
  TDiccGlobalAC,
  TKeyDiccActionRequest extends string = string
> extends ICriteria<TDiccGlobalAC, TKeyDiccActionRequest> {
  /**limite de docs o registros a obtener */
  limit: number;
  /**criterio de ordenamiento */
  sort: unknown; //⚠ DEBE redefinirse en interfaces que extienda de esta
  /**pagina objetivo a obtener
   * (cuando se esta paginando) */
  targetPage?: number;
  /**determina lógica de paginado a utilizar
   * (`0` indica que la pagina inicial será
   * `0` o `1` para inidcar que sera con
   * logica de `1`)
   */
  targetPageLogic?: 0 | 1;
  /**esquema de consulta */
  //query?: TAConds; // //❗❗❗ TODAVÍA NO VIABLE ❗❗❗
}
/**
 * define las propiedades de un criterio
 * de peticion de lectura de datos
 */
export interface IModifyCriteria<
  TDiccGlobalAC,
  TKeyDiccActionRequest extends string = string
> extends ICriteria<TDiccGlobalAC, TKeyDiccActionRequest> {
  /**el tipo de criterio de modificación a realizar */
  modifyType?: TKeyRequestModifyType;
  /**determina en caso de crear un doc o
   * registro si este ya existe actualizarlo
   *  o no (si no se configura se asume
   * que NO se puede actualizar) */
  isCreateOrUpdate?: boolean;
}
/**... */
export type TActionConfigFn = (
  criteriaHandler: CriteriaHandler<any>
) => Promise<IResponse>;

//====Primitive===================================================================================================================
/**esquema de propósito general con los contextos primitivos del modulo*/
export interface IPrimitiveCriteriaContext<
  TPrimitiveCriteria = unknown //puede ser cualquier interfaz o tipado
> {
  primitiveCriteria: TPrimitiveCriteria;
}
/**claves identificadoras para el contexto de ejecución para el modulo primitive*/
export type TKeyPrimitiveCriteriaModuleContext =
  keyof IPrimitiveCriteriaContext;
/**... */
type _TPrimitiveDiccGlobalAC<
  TIDiccPrimitiveMutateAC,
  TIDiccPrimitiveValAC,
  TIDiccRequestValAC,
  TIDiccPrimitiveHookAC,
  TIDiccPrimitiveProviderAC,
  TIDiccPrimitiveCtrlAC
> = TPrimitiveMutateDiccACForCriteria<TIDiccPrimitiveMutateAC> &
  TPrimitiveValDiccACForCriteria<TIDiccPrimitiveValAC, TIDiccRequestValAC> &
  TPrimitiveHookDiccACForCriteria<TIDiccPrimitiveHookAC> &
  TPrimitiveProviderDiccACForCriteria<TIDiccPrimitiveProviderAC> &
  TPrimitiveCtrlDiccACForCriteria<
    Omit<TIDiccPrimitiveCtrlAC, "readRequest" | "modifyRequest">
  >;
/** */
export type TPrimitiveDiccGlobalAC<
  TIDiccPrimitiveMutateAC,
  TIDiccPrimitiveValAC,
  TIDiccRequestValAC,
  TIDiccPrimitiveHookAC,
  TIDiccPrimitiveProviderAC
> = _TPrimitiveDiccGlobalAC<
  TIDiccPrimitiveMutateAC,
  TIDiccPrimitiveValAC,
  TIDiccRequestValAC,
  TIDiccPrimitiveHookAC,
  TIDiccPrimitiveProviderAC,
  never //❗el diccionario de Ctrl no debe ser accesible❗
>;
/** */
export interface IPrimitiveCriteria<
  TIDiccPrimitiveMutateAC extends PrimitiveLogicMutater["diccActionConfig"] = PrimitiveLogicMutater["diccActionConfig"],
  TIDiccPrimitiveValAC extends PrimitiveLogicValidation["diccActionConfig"] = PrimitiveLogicValidation["diccActionConfig"],
  TIDiccRequestValAC extends RequestLogicValidation["diccActionConfig"] = RequestLogicValidation["diccActionConfig"],
  TIDiccPrimitiveHookAC extends PrimitiveLogicHook["diccActionConfig"] = PrimitiveLogicHook["diccActionConfig"],
  TIDiccPrimitiveProviderAC extends PrimitiveLogicProvider["diccActionConfig"] = PrimitiveLogicProvider["diccActionConfig"],
  TKeyDiccActionRequest extends string = string,
  TIDiccPrimitiveCtrlAC extends PrimitiveLogicController<any>["diccActionConfig"] = PrimitiveLogicController<any>["diccActionConfig"]
> extends ICriteria<
    _TPrimitiveDiccGlobalAC<
      TIDiccPrimitiveMutateAC,
      TIDiccPrimitiveValAC,
      TIDiccRequestValAC,
      TIDiccPrimitiveHookAC,
      TIDiccPrimitiveProviderAC,
      TIDiccPrimitiveCtrlAC
    >,
    TKeyDiccActionRequest
  > {
  diccGlobalAC?: TPrimitiveDiccGlobalAC<
    TIDiccPrimitiveMutateAC,
    TIDiccPrimitiveValAC,
    TIDiccRequestValAC,
    TIDiccPrimitiveHookAC,
    TIDiccPrimitiveProviderAC
  >;
}
/**... */
export interface IPrimitiveReadCriteria<
  TIDiccPrimitiveMutateAC extends PrimitiveLogicMutater["diccActionConfig"] = PrimitiveLogicMutater["diccActionConfig"],
  TIDiccPrimitiveValAC extends PrimitiveLogicValidation["diccActionConfig"] = PrimitiveLogicValidation["diccActionConfig"],
  TIDiccRequestValAC extends RequestLogicValidation["diccActionConfig"] = RequestLogicValidation["diccActionConfig"],
  TIDiccPrimitiveHookAC extends PrimitiveLogicHook["diccActionConfig"] = PrimitiveLogicHook["diccActionConfig"],
  TIDiccPrimitiveProviderAC extends PrimitiveLogicProvider["diccActionConfig"] = PrimitiveLogicProvider["diccActionConfig"],
  TKeyDiccActionRequest extends string = string,
  TIDiccPrimitiveCtrlAC extends PrimitiveLogicController<any>["diccActionConfig"] = PrimitiveLogicController<any>["diccActionConfig"]
> extends IReadCriteria<
      _TPrimitiveDiccGlobalAC<
        TIDiccPrimitiveMutateAC,
        TIDiccPrimitiveValAC,
        TIDiccRequestValAC,
        TIDiccPrimitiveHookAC,
        TIDiccPrimitiveProviderAC,
        TIDiccPrimitiveCtrlAC
      >,
      TKeyDiccActionRequest
    >,
    IPrimitiveCriteria<
      TIDiccPrimitiveMutateAC,
      TIDiccPrimitiveValAC,
      TIDiccRequestValAC,
      TIDiccPrimitiveHookAC,
      TIDiccPrimitiveProviderAC,
      TKeyDiccActionRequest,
      TIDiccPrimitiveCtrlAC
    > {
  sort: TSortDirection; //❗OBLIGATORIO redefinir❗
  diccGlobalAC?: TPrimitiveDiccGlobalAC<
    TIDiccPrimitiveMutateAC,
    TIDiccPrimitiveValAC,
    TIDiccRequestValAC,
    TIDiccPrimitiveHookAC,
    TIDiccPrimitiveProviderAC
  >; //❗OBLIGATORIO redefinir❗
}
/** */
export interface IPrimitiveModifyCriteria<
  TIDiccPrimitiveMutateAC extends PrimitiveLogicMutater["diccActionConfig"] = PrimitiveLogicMutater["diccActionConfig"],
  TIDiccPrimitiveValAC extends PrimitiveLogicValidation["diccActionConfig"] = PrimitiveLogicValidation["diccActionConfig"],
  TIDiccRequestValAC extends RequestLogicValidation["diccActionConfig"] = RequestLogicValidation["diccActionConfig"],
  TIDiccPrimitiveHookAC extends PrimitiveLogicHook["diccActionConfig"] = PrimitiveLogicHook["diccActionConfig"],
  TIDiccPrimitiveProviderAC extends PrimitiveLogicProvider["diccActionConfig"] = PrimitiveLogicProvider["diccActionConfig"],
  TKeyDiccActionRequest extends string = string,
  TIDiccPrimitiveCtrlAC extends PrimitiveLogicController<any>["diccActionConfig"] = PrimitiveLogicController<any>["diccActionConfig"]
> extends IModifyCriteria<
      _TPrimitiveDiccGlobalAC<
        TIDiccPrimitiveMutateAC,
        TIDiccPrimitiveValAC,
        TIDiccRequestValAC,
        TIDiccPrimitiveHookAC,
        TIDiccPrimitiveProviderAC,
        TIDiccPrimitiveCtrlAC
      >,
      TKeyDiccActionRequest
    >,
    IPrimitiveCriteria<
      TIDiccPrimitiveMutateAC,
      TIDiccPrimitiveValAC,
      TIDiccRequestValAC,
      TIDiccPrimitiveHookAC,
      TIDiccPrimitiveProviderAC,
      TKeyDiccActionRequest,
      TIDiccPrimitiveCtrlAC
    > {
  diccGlobalAC?: TPrimitiveDiccGlobalAC<
    TIDiccPrimitiveMutateAC,
    TIDiccPrimitiveValAC,
    TIDiccRequestValAC,
    TIDiccPrimitiveHookAC,
    TIDiccPrimitiveProviderAC
  >; //❗OBLIGATORIO redefinir❗
}
/**... */
export type TPrimitiveBaseCriteria<
  TIDiccPrimitiveMutateAC extends PrimitiveLogicMutater["diccActionConfig"] = PrimitiveLogicMutater["diccActionConfig"],
  TIDiccPrimitiveValAC extends PrimitiveLogicValidation["diccActionConfig"] = PrimitiveLogicValidation["diccActionConfig"],
  TIDiccRequestValAC extends RequestLogicValidation["diccActionConfig"] = RequestLogicValidation["diccActionConfig"],
  TIDiccPrimitiveHookAC extends PrimitiveLogicHook["diccActionConfig"] = PrimitiveLogicHook["diccActionConfig"],
  TIDiccPrimitiveProviderAC extends PrimitiveLogicProvider["diccActionConfig"] = PrimitiveLogicProvider["diccActionConfig"],
  TKeyDiccActionRequest extends string = string,
  TIDiccPrimitiveCtrlAC extends PrimitiveLogicController<any>["diccActionConfig"] = PrimitiveLogicController<any>["diccActionConfig"]
> = Partial<
  IPrimitiveCriteria<
    TIDiccPrimitiveMutateAC,
    TIDiccPrimitiveValAC,
    TIDiccRequestValAC,
    TIDiccPrimitiveHookAC,
    TIDiccPrimitiveProviderAC,
    TKeyDiccActionRequest,
    TIDiccPrimitiveCtrlAC
  >
> &
  Pick<
    IPrimitiveCriteria<
      TIDiccPrimitiveMutateAC,
      TIDiccPrimitiveValAC,
      TIDiccRequestValAC,
      TIDiccPrimitiveHookAC,
      TIDiccPrimitiveProviderAC,
      TKeyDiccActionRequest,
      TIDiccPrimitiveCtrlAC
    >,
    "type" | "keyActionRequest"
  >;
/**... */
export type TPrimitiveBaseReadCriteria<
  TIDiccPrimitiveMutateAC extends PrimitiveLogicMutater["diccActionConfig"] = PrimitiveLogicMutater["diccActionConfig"],
  TIDiccPrimitiveValAC extends PrimitiveLogicValidation["diccActionConfig"] = PrimitiveLogicValidation["diccActionConfig"],
  TIDiccRequestValAC extends RequestLogicValidation["diccActionConfig"] = RequestLogicValidation["diccActionConfig"],
  TIDiccPrimitiveHookAC extends PrimitiveLogicHook["diccActionConfig"] = PrimitiveLogicHook["diccActionConfig"],
  TIDiccPrimitiveProviderAC extends PrimitiveLogicProvider["diccActionConfig"] = PrimitiveLogicProvider["diccActionConfig"],
  TKeyDiccActionRequest extends string = string,
  TIDiccPrimitiveCtrlAC extends PrimitiveLogicController<any>["diccActionConfig"] = PrimitiveLogicController<any>["diccActionConfig"]
> = Partial<
  Omit<
    IPrimitiveReadCriteria<
      TIDiccPrimitiveMutateAC,
      TIDiccPrimitiveValAC,
      TIDiccRequestValAC,
      TIDiccPrimitiveHookAC,
      TIDiccPrimitiveProviderAC,
      TKeyDiccActionRequest,
      TIDiccPrimitiveCtrlAC
    >,
    "keyLogicContext" | "keySrc" | "p_Key" | "s_Key"
  >
> & {
  /**diccionario con acciones globales*/
  diccGlobalAC?: TPrimitiveDiccGlobalAC<
    TIDiccPrimitiveMutateAC,
    TIDiccPrimitiveValAC,
    TIDiccRequestValAC,
    TIDiccPrimitiveHookAC,
    TIDiccPrimitiveProviderAC
  >;
};
/**... */
export type TPrimitiveBaseModifyCriteria<
  TIDiccPrimitiveMutateAC extends PrimitiveLogicMutater["diccActionConfig"] = PrimitiveLogicMutater["diccActionConfig"],
  TIDiccPrimitiveValAC extends PrimitiveLogicValidation["diccActionConfig"] = PrimitiveLogicValidation["diccActionConfig"],
  TIDiccRequestValAC extends RequestLogicValidation["diccActionConfig"] = RequestLogicValidation["diccActionConfig"],
  TIDiccPrimitiveHookAC extends PrimitiveLogicHook["diccActionConfig"] = PrimitiveLogicHook["diccActionConfig"],
  TIDiccPrimitiveProviderAC extends PrimitiveLogicProvider["diccActionConfig"] = PrimitiveLogicProvider["diccActionConfig"],
  TKeyDiccActionRequest extends string = string,
  TIDiccPrimitiveCtrlAC extends PrimitiveLogicController<any>["diccActionConfig"] = PrimitiveLogicController<any>["diccActionConfig"]
> = Partial<
  Omit<
    IPrimitiveModifyCriteria<
      TIDiccPrimitiveMutateAC,
      TIDiccPrimitiveValAC,
      TIDiccRequestValAC,
      TIDiccPrimitiveHookAC,
      TIDiccPrimitiveProviderAC,
      TKeyDiccActionRequest,
      TIDiccPrimitiveCtrlAC
    >,
    "keyLogicContext" | "keySrc" | "p_Key" | "s_Key"
  >
> & {
  /**diccionario con acciones globales*/
  diccGlobalAC?: TPrimitiveDiccGlobalAC<
    TIDiccPrimitiveMutateAC,
    TIDiccPrimitiveValAC,
    TIDiccRequestValAC,
    TIDiccPrimitiveHookAC,
    TIDiccPrimitiveProviderAC
  >;
};
/**... */
export type TPrimitiveActionConfigFn<TValue> = (
  criteriaHandler: PrimitiveCriteriaHandler<TValue>
) => Promise<IPrimitiveResponse>;

//====Strcuture====================================================================================================================
/**esquema de proposito general con los contextos estructurales del modulo*/
export interface IStructureCriteriaContext<
  TStructureCriteria = unknown //puede ser cualquier interfaz o tipado
> {
  structureCriteria: TStructureCriteria;
}
/**claves identificadoras para el contexto de ejecución para el modulo structure*/
export type TKeyStructureCriteriaModuleContext =
  keyof IStructureCriteriaContext;
/**clave identificadora profunda para el contexto estructural */
export type TKeyStructureDeepCriteriaModuleContext =
  | "fieldCriteria"
  | "modelCriteria";
/** */
type _TStructureModelDiccGlobalAC<
  TIDiccModelMutateAC,
  TIDiccModelValAC,
  TIDiccRequestValAC,
  TIDiccStructureHookAC,
  TIDiccStructureProviderAC,
  TIDiccStructureCtrlAC
> = TStructureModelMutateDiccACForCriteria<TIDiccModelMutateAC> &
  TStructureModelValDiccACForCriteria<TIDiccModelValAC, TIDiccRequestValAC> &
  TStructureModelHookDiccACForCriteria<TIDiccStructureHookAC> &
  TStructureModelProviderDiccACForCriteria<TIDiccStructureProviderAC> &
  TStructureCtrlDiccACForCriteria<
    Omit<
      TIDiccStructureCtrlAC,
      "checkField" | "checkEmbModel" | "readRequest" | "modifyRequest"
    >
  >;
/** */
export type TStructureModelDiccGlobalAC<
  TIDiccModelMutateAC,
  TIDiccModelValAC,
  TIDiccRequestValAC,
  TIDiccStructureHookAC,
  TIDiccStructureProviderAC,
  TIDiccStructureCtrlAC
> = Partial<
  _TStructureModelDiccGlobalAC<
    TIDiccModelMutateAC,
    TIDiccModelValAC,
    TIDiccRequestValAC,
    TIDiccStructureHookAC,
    TIDiccStructureProviderAC,
    TIDiccStructureCtrlAC
  >
>;
/** */
export interface IStructureModelCriteria<
  TModel,
  TIDiccModelMutateAC extends ModelLogicMutater["diccActionConfig"] = ModelLogicMutater["diccActionConfig"],
  TIDiccModelValAC extends ModelLogicValidation["diccActionConfig"] = ModelLogicValidation["diccActionConfig"],
  TIDiccRequestValAC extends RequestLogicValidation["diccActionConfig"] = RequestLogicValidation["diccActionConfig"],
  TIDiccStructureHookAC extends StructureLogicHook["diccActionConfig"] = StructureLogicHook["diccActionConfig"],
  TIDiccStructureProviderAC extends StructureLogicProvider["diccActionConfig"] = StructureLogicProvider["diccActionConfig"],
  TKeyDiccActionRequest extends string = string,
  TIDiccStructureCtrlAC extends StructureLogicController<TModel>["diccActionConfig"] = StructureLogicController<TModel>["diccActionConfig"]
> extends ICriteria<
    _TStructureModelDiccGlobalAC<
      TIDiccModelMutateAC,
      TIDiccModelValAC,
      TIDiccRequestValAC,
      TIDiccStructureHookAC,
      TIDiccStructureProviderAC,
      TIDiccStructureCtrlAC
    >,
    TKeyDiccActionRequest
  > {
  data: TModel; //❗OBLIGATORIO redefinir❗
  /**array con todas las rutas keyPath de este modulo */
  keysPath: string[];
  /** */
  keyPath: string;
  /** */
  keyStructureContext: TKeyStructureContextFull;
  sort: Array<Record<keyof TModel, TSortDirection>>;
}
/**... */
export interface IStructureModelReadCriteria<
  TModel,
  TIDiccModelMutateAC extends ModelLogicMutater["diccActionConfig"] = ModelLogicMutater["diccActionConfig"],
  TIDiccModelValAC extends ModelLogicValidation["diccActionConfig"] = ModelLogicValidation["diccActionConfig"],
  TIDiccRequestValAC extends RequestLogicValidation["diccActionConfig"] = RequestLogicValidation["diccActionConfig"],
  TIDiccStructureHookAC extends StructureLogicHook["diccActionConfig"] = StructureLogicHook["diccActionConfig"],
  TIDiccStructureProviderAC extends StructureLogicProvider["diccActionConfig"] = StructureLogicProvider["diccActionConfig"],
  TKeyDiccActionRequest extends string = string,
  TIDiccStructureCtrlAC extends StructureLogicController<TModel>["diccActionConfig"] = StructureLogicController<TModel>["diccActionConfig"]
> extends IReadCriteria<
      _TStructureModelDiccGlobalAC<
        TIDiccModelMutateAC,
        TIDiccModelValAC,
        TIDiccRequestValAC,
        TIDiccStructureHookAC,
        TIDiccStructureProviderAC,
        TIDiccStructureCtrlAC
      >,
      TKeyDiccActionRequest
    >,
    IStructureModelCriteria<
      TModel,
      TIDiccModelMutateAC,
      TIDiccModelValAC,
      TIDiccRequestValAC,
      TIDiccStructureHookAC,
      TIDiccStructureProviderAC,
      TKeyDiccActionRequest,
      TIDiccStructureCtrlAC
    > {
  data: TModel; //❗OBLIGATORIO redefinir❗
  sort: Array<Record<keyof TModel, TSortDirection>>; //❗OBLIGATORIO redefinir❗
}
/** */
export interface IStructureModelModifyCriteria<
  TModel,
  TIDiccModelMutateAC extends ModelLogicMutater["diccActionConfig"] = ModelLogicMutater["diccActionConfig"],
  TIDiccModelValAC extends ModelLogicValidation["diccActionConfig"] = ModelLogicValidation["diccActionConfig"],
  TIDiccRequestValAC extends RequestLogicValidation["diccActionConfig"] = RequestLogicValidation["diccActionConfig"],
  TIDiccStructureHookAC extends StructureLogicHook["diccActionConfig"] = StructureLogicHook["diccActionConfig"],
  TIDiccStructureProviderAC extends StructureLogicProvider["diccActionConfig"] = StructureLogicProvider["diccActionConfig"],
  TKeyDiccActionRequest extends string = string,
  TIDiccStructureCtrlAC extends StructureLogicController<TModel>["diccActionConfig"] = StructureLogicController<TModel>["diccActionConfig"]
> extends IModifyCriteria<
      _TStructureModelDiccGlobalAC<
        TIDiccModelMutateAC,
        TIDiccModelValAC,
        TIDiccRequestValAC,
        TIDiccStructureHookAC,
        TIDiccStructureProviderAC,
        TIDiccStructureCtrlAC
      >,
      TKeyDiccActionRequest
    >,
    IStructureModelCriteria<
      TModel,
      TIDiccModelMutateAC,
      TIDiccModelValAC,
      TIDiccRequestValAC,
      TIDiccStructureHookAC,
      TIDiccStructureProviderAC,
      TKeyDiccActionRequest,
      TIDiccStructureCtrlAC
    > {
  data: TModel; //❗OBLIGATORIO redefinir❗
}
/**... */
type _TStructureEmbDiccGlobalAC<
  TIDiccEmbModelMutateAC,
  TIDiccEmbModelValAC,
  TIDiccStructureHookAC,
  TIDiccStructureCtrlAC
> = TStructureEmbModelMutateDiccACForCriteria<TIDiccEmbModelMutateAC> &
  TStructureEmbModelValDiccACForCriteria<TIDiccEmbModelValAC> &
  TStructureModelHookDiccACForCriteria<TIDiccStructureHookAC> &
  TStructureCtrlDiccACForCriteria<
    Omit<TIDiccStructureCtrlAC, "readRequest" | "modifyRequest" | "checkField">
  >;
/**... */
export type TStructureEmbModelDiccGlobalAC<
  TIDiccEmbModelMutateAC,
  TIDiccEmbModelValAC,
  TIDiccStructureHookAC,
  TIDiccStructureCtrlAC
> = Partial<
  _TStructureEmbDiccGlobalAC<
    TIDiccEmbModelMutateAC,
    TIDiccEmbModelValAC,
    TIDiccStructureHookAC,
    TIDiccStructureCtrlAC
  >
>;
/**... */
export interface IStructureEmbModelCriteria<
  TModel,
  TIDiccEmbModelMutateAC extends ModelLogicMutater["diccActionConfig"] = ModelLogicMutater["diccActionConfig"],
  TIDiccEmbModelValAC extends ModelLogicValidation["diccActionConfig"] = ModelLogicValidation["diccActionConfig"],
  TIDiccStructureHookAC extends StructureLogicHook["diccActionConfig"] = StructureLogicHook["diccActionConfig"],
  TIDiccStructureCtrlAC extends StructureLogicController<TModel>["diccActionConfig"] = StructureLogicController<TModel>["diccActionConfig"]
> extends Pick<
    ICriteria<
      _TStructureEmbDiccGlobalAC<
        TIDiccEmbModelMutateAC,
        TIDiccEmbModelValAC,
        TIDiccStructureHookAC,
        TIDiccStructureCtrlAC
      >,
      any
    >,
    "aTGlobalActionConfig" | "data"
  > {
  /**array con todas las rutas keyPath de este modulo */
  keysPath: string[];
  /** */
  keyPath: string;
}
/**... */
type _TStructureFieldDiccGlobalAC<
  TIDiccFieldMutateAC,
  TIDiccFieldValAC,
  TIDiccStructureHookAC,
  TIDiccStructureCtrlAC
> = TStructureFieldMutateDiccACForCriteria<TIDiccFieldMutateAC> &
  TStructureFieldValDiccACForCriteria<TIDiccFieldValAC> &
  TStructureModelHookDiccACForCriteria<TIDiccStructureHookAC> &
  TStructureCtrlDiccACForCriteria<
    Omit<
      TIDiccStructureCtrlAC,
      "readRequest" | "modifyRequest" | "checkField" | "checkAllFields"
    >
  >;
/**... */
export type TStructureFieldDiccGlobalAC<
  TIDiccFieldMutateAC,
  TIDiccFieldValAC,
  TIDiccStructureHookAC,
  TIDiccStructureCtrlAC
> = Partial<
  _TStructureFieldDiccGlobalAC<
    TIDiccFieldMutateAC,
    TIDiccFieldValAC,
    TIDiccStructureHookAC,
    TIDiccStructureCtrlAC
  >
>;
/**... */
export interface IStructureFieldCriteria<
  TModel,
  TIDiccFieldMutateAC extends FieldLogicMutater["diccActionConfig"] = FieldLogicMutater["diccActionConfig"],
  TIDiccFieldValAC extends FieldLogicValidation["diccActionConfig"] = FieldLogicValidation["diccActionConfig"],
  TIDiccStructureHookAC extends StructureLogicHook["diccActionConfig"] = StructureLogicHook["diccActionConfig"],
  TIDiccStructureCtrlAC extends StructureLogicController<TModel>["diccActionConfig"] = StructureLogicController<TModel>["diccActionConfig"]
> extends Pick<
    ICriteria<
      _TStructureFieldDiccGlobalAC<
        TIDiccFieldMutateAC,
        TIDiccFieldValAC,
        TIDiccStructureHookAC,
        TIDiccStructureCtrlAC
      >,
      any
    >,
    "aTGlobalActionConfig" | "data"
  > {
  /**array con todas las rutas keyPath de este modulo */
  keysPath: string[];
  /** */
  keyPath: string;
}
/**... */
export type TStructureModelBaseCriteria<
  TModel,
  TIDiccModelMutateAC extends ModelLogicMutater["diccActionConfig"] = ModelLogicMutater["diccActionConfig"],
  TIDiccModelValAC extends ModelLogicValidation["diccActionConfig"] = ModelLogicValidation["diccActionConfig"],
  TIDiccRequestValAC extends RequestLogicValidation["diccActionConfig"] = RequestLogicValidation["diccActionConfig"],
  TIDiccStructureHookAC extends StructureLogicHook["diccActionConfig"] = StructureLogicHook["diccActionConfig"],
  TIDiccStructureProviderAC extends StructureLogicProvider["diccActionConfig"] = StructureLogicProvider["diccActionConfig"],
  TKeyDiccActionRequest extends string = string,
  TIDiccStructureCtrlAC extends StructureLogicController<TModel>["diccActionConfig"] = StructureLogicController<TModel>["diccActionConfig"]
> = Partial<
  IStructureModelCriteria<
    TModel,
    TIDiccModelMutateAC,
    TIDiccModelValAC,
    TIDiccRequestValAC,
    TIDiccStructureHookAC,
    TIDiccStructureProviderAC,
    TKeyDiccActionRequest,
    TIDiccStructureCtrlAC
  >
> & {
  /**diccionario con acciones globales
   *
   * ⚠ no se tiene en cuenta el modulo provider ⚠
   */
  diccGlobalAC?: TStructureModelDiccGlobalAC<
    TIDiccModelMutateAC,
    TIDiccModelValAC,
    TIDiccRequestValAC,
    TIDiccStructureHookAC,
    TIDiccStructureProviderAC,
    TIDiccStructureCtrlAC
  >;
};
/**... */
export type TStructureModelBaseReadCriteria<
  TModel,
  TIDiccModelMutateAC extends ModelLogicMutater["diccActionConfig"] = ModelLogicMutater["diccActionConfig"],
  TIDiccModelValAC extends ModelLogicValidation["diccActionConfig"] = ModelLogicValidation["diccActionConfig"],
  TIDiccRequestValAC extends RequestLogicValidation["diccActionConfig"] = RequestLogicValidation["diccActionConfig"],
  TIDiccStructureHookAC extends StructureLogicHook["diccActionConfig"] = StructureLogicHook["diccActionConfig"],
  TIDiccStructureProviderAC extends StructureLogicProvider["diccActionConfig"] = StructureLogicProvider["diccActionConfig"],
  TKeyDiccActionRequest extends string = string,
  TIDiccStructureCtrlAC extends StructureLogicController<TModel>["diccActionConfig"] = StructureLogicController<TModel>["diccActionConfig"]
> = Partial<
  Omit<
    IStructureModelReadCriteria<
      TModel,
      TIDiccModelMutateAC,
      TIDiccModelValAC,
      TIDiccRequestValAC,
      TIDiccStructureHookAC,
      TIDiccStructureProviderAC,
      TKeyDiccActionRequest,
      TIDiccStructureCtrlAC
    >,
    | "keyLogicContext"
    | "keySrc"
    | "p_Key"
    | "s_Key"
    | "keysPath"
    | "keyPath"
    | "keyStructureContext"
  >
> & {
  /**diccionario con acciones globales*/
  diccGlobalAC?: TStructureModelDiccGlobalAC<
    TIDiccModelMutateAC,
    TIDiccModelValAC,
    TIDiccRequestValAC,
    TIDiccStructureHookAC,
    TIDiccStructureProviderAC,
    TIDiccStructureCtrlAC
  >;
};
/**... */
export type TStructureModelBaseModifyCriteria<
  TModel,
  TIDiccModelMutateAC extends ModelLogicMutater["diccActionConfig"] = ModelLogicMutater["diccActionConfig"],
  TIDiccModelValAC extends ModelLogicValidation["diccActionConfig"] = ModelLogicValidation["diccActionConfig"],
  TIDiccRequestValAC extends RequestLogicValidation["diccActionConfig"] = RequestLogicValidation["diccActionConfig"],
  TIDiccStructureHookAC extends StructureLogicHook["diccActionConfig"] = StructureLogicHook["diccActionConfig"],
  TIDiccStructureProviderAC extends StructureLogicProvider["diccActionConfig"] = StructureLogicProvider["diccActionConfig"],
  TKeyDiccActionRequest extends string = string,
  TIDiccStructureCtrlAC extends StructureLogicController<TModel>["diccActionConfig"] = StructureLogicController<TModel>["diccActionConfig"]
> = Partial<
  Omit<
    IStructureModelModifyCriteria<
      TModel,
      TIDiccModelMutateAC,
      TIDiccModelValAC,
      TIDiccRequestValAC,
      TIDiccStructureHookAC,
      TIDiccStructureProviderAC,
      TKeyDiccActionRequest,
      TIDiccStructureCtrlAC
    >,
    | "keyLogicContext"
    | "keySrc"
    | "p_Key"
    | "s_Key"
    | "keysPath"
    | "keyPath"
    | "keyStructureContext"
  >
> & {
  /**diccionario con acciones globales
   *
   * ⚠ no se tiene en cuenta el modulo provider ⚠
   */
  diccGlobalAC?: TStructureModelDiccGlobalAC<
    TIDiccModelMutateAC,
    TIDiccModelValAC,
    TIDiccRequestValAC,
    TIDiccStructureHookAC,
    TIDiccStructureProviderAC,
    TIDiccStructureCtrlAC
  >;
};
/**... */
export type TStructureEmbModelBaseCriteria<
  TModel,
  TIDiccEmbModelMutateAC extends ModelLogicMutater["diccActionConfig"] = ModelLogicMutater["diccActionConfig"],
  TIDiccEmbModelValAC extends ModelLogicValidation["diccActionConfig"] = ModelLogicValidation["diccActionConfig"],
  TIDiccStructureHookAC extends StructureLogicHook["diccActionConfig"] = StructureLogicHook["diccActionConfig"],
  TIDiccStructureCtrlAC extends StructureLogicController<TModel>["diccActionConfig"] = StructureLogicController<TModel>["diccActionConfig"]
> = Partial<
  Pick<
    IStructureEmbModelCriteria<
      TModel,
      TIDiccEmbModelMutateAC,
      TIDiccEmbModelValAC,
      TIDiccStructureHookAC,
      TIDiccStructureCtrlAC
    >,
    "aTGlobalActionConfig"
  >
> & {
  /**diccionario con acciones globales
   *
   * ⚠ no se tiene en cuenta el modulo provider ⚠
   */
  diccGlobalAC?: TStructureEmbModelDiccGlobalAC<
    TIDiccEmbModelMutateAC,
    TIDiccEmbModelValAC,
    TIDiccStructureHookAC,
    TIDiccStructureCtrlAC
  >;
};
/**... */
export type TStructureFieldBaseCriteria<
  TModel,
  TIDiccFieldMutateAC extends FieldLogicMutater["diccActionConfig"] = FieldLogicMutater["diccActionConfig"],
  TIDiccFieldValAC extends FieldLogicValidation["diccActionConfig"] = FieldLogicValidation["diccActionConfig"],
  TIDiccStructureHookAC extends StructureLogicHook["diccActionConfig"] = StructureLogicHook["diccActionConfig"],
  TIDiccStructureCtrlAC extends StructureLogicController<TModel>["diccActionConfig"] = StructureLogicController<TModel>["diccActionConfig"]
> = Partial<
  Pick<
    IStructureFieldCriteria<
      TModel,
      TIDiccFieldMutateAC,
      TIDiccFieldValAC,
      TIDiccStructureHookAC,
      TIDiccStructureCtrlAC
    >,
    "aTGlobalActionConfig"
  >
> & {
  /**diccionario con acciones globales
   *
   * ⚠ no se tiene en cuenta el modulo provider ⚠
   */
  diccGlobalAC?: TStructureFieldDiccGlobalAC<
    TIDiccFieldMutateAC,
    TIDiccFieldValAC,
    TIDiccStructureHookAC,
    TIDiccStructureCtrlAC
  >;
};
/**... */
export type TStructureActionConfigFn<TModel> = (
  criteriaHandler: StructureCriteriaHandler<TModel>
) => Promise<IStructureResponse>;
