import {
  TKeyLogicContext,
  TKeyRequestModifyType,
  TKeyRequestType,
  TKeyStructureContextFull,
} from "../config/shared-modules";
import { IDiccPrimitiveHookActionConfigG } from "../hooks/primitive-hook";
import { IPrimitiveHookContext, IStructureHookContext } from "../hooks/shared";
import { IDiccStructureHookActionConfigG } from "../hooks/structure-hook";
import {
  TKeyFieldInternalACModuleContext,
  TKeyModelInternalACModuleContext,
  TKeyPrimitiveInternalACModuleContext,
} from "../meta/metadata-shared";
import { IDiccFieldMutateActionConfigG } from "../mutaters/field-mutater";
import { IDiccModelMutateActionConfigG } from "../mutaters/model-mutater";
import { IDiccPrimitiveMutateActionConfigG } from "../mutaters/primitive-mutater";
import {
  IPrimitiveMutateContext,
  IStructureDeepMutateContext,
} from "../mutaters/shared";
import { IDiccPrimitiveProviderActionConfigG } from "../providers/primitive-provider";
import {
  IPrimitiveProviderContext,
  IStructureProviderContext,
} from "../providers/shared";
import { IDiccStructureProviderActionConfigG } from "../providers/structure-provider";
import { IDiccFieldValActionConfigG } from "../validators/field-validation";
import { IDiccModelValActionConfigG } from "../validators/model-validation";
import { IDiccPrimitiveValActionConfigG } from "../validators/primitive-validation";
import { IDiccRequestValActionConfigG } from "../validators/request-validation";
import {
  IPrimitiveValContext,
  IStructureDeepValContext,
} from "../validators/shared";

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
export interface ICriteria<
  TKeyDiccActionRequest extends string = string,
  TKeyACModuleContext extends string = string,
  TKeyIDiccGlobalModelAC extends string = string
> {
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
  /**diccionario con acciones globales
   *
   * ⚠ no se tiene en cuenta el modulo provider ⚠
   */
  diccGlobalAC?: unknown;
  /**array de tuplas de claves identificadoras de
   * acciones de configuración globales y sus
   * respectivos módulos
   * en orden de ejecución
   *
   * para cada tupla el esquema es:
   *
   * `[0]` : key del modulo correspondiente.
   *
   * `[1]` : key de la acción correspondiente
   */
  aTKeysGlobalActionConfig: Array<
    [TKeyACModuleContext, TKeyIDiccGlobalModelAC]
  >;
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
  TKeyDiccActionRequest extends string = string,
  TKeyACModuleContext extends string = string,
  TKeyIDiccGlobalModelAC extends string = string
> extends ICriteria<
    TKeyDiccActionRequest,
    TKeyACModuleContext,
    TKeyIDiccGlobalModelAC
  > {
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
  TKeyDiccActionRequest extends string = string,
  TKeyACModuleContext extends string = string,
  TKeyIDiccGlobalModelAC extends string = string
> extends ICriteria<
    TKeyDiccActionRequest,
    TKeyACModuleContext,
    TKeyIDiccGlobalModelAC
  > {
  /**el tipo de criterio de modificación a realizar */
  modifyType?: TKeyRequestModifyType;
  /**determina en caso de crear un doc o
   * registro si este ya existe actualizarlo
   *  o no (si no se configura se asume
   * que NO se puede actualizar) */
  isCreateOrUpdate?: boolean;
}

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
export type TPrimitiveDiccGlobalAC<
  TIDiccPrimitiveMutateAC,
  TIDiccPrimitiveValAC,
  TIDiccRequestValAC,
  TIDiccPrimitiveHookAC,
  TIDiccPrimitiveProviderAC
> = Partial<
  IPrimitiveMutateContext<
    Partial<
      | TIDiccPrimitiveMutateAC
      //❗Tipado que permite desactivar la acción, controller no la ejecuta❗
      | Record<keyof TIDiccPrimitiveMutateAC, null>
    >
  > &
    IPrimitiveValContext<
      Partial<
        | TIDiccPrimitiveValAC
        //❗Tipado que permite desactivar la acción, controller no la ejecuta❗
        | Record<keyof TIDiccPrimitiveValAC, null>
      >,
      Partial<
        | TIDiccRequestValAC
        //❗Tipado que permite desactivar la acción, controller no la ejecuta❗
        | Record<keyof TIDiccRequestValAC, null>
      >
    > &
    IPrimitiveHookContext<
      Partial<
        | TIDiccPrimitiveHookAC
        //❗Tipado que permite desactivar la acción, controller no la ejecuta❗
        | Record<keyof TIDiccPrimitiveHookAC, null>
      >
    > &
    IPrimitiveProviderContext<
      Partial<
        | TIDiccPrimitiveProviderAC
        //❗Tipado que permite desactivar la acción, controller no la ejecuta❗
        | Record<keyof TIDiccPrimitiveProviderAC, null>
      >
    >
>;
/** */
export interface IPrimitiveCriteria<
  TIDiccPrimitiveMutateAC extends IDiccPrimitiveMutateActionConfigG = IDiccPrimitiveMutateActionConfigG,
  TIDiccPrimitiveValAC extends IDiccPrimitiveValActionConfigG = IDiccPrimitiveValActionConfigG,
  TIDiccRequestValAC extends IDiccRequestValActionConfigG = IDiccRequestValActionConfigG,
  TIDiccPrimitiveHookAC extends IDiccPrimitiveHookActionConfigG = IDiccPrimitiveHookActionConfigG,
  TIDiccPrimitiveProviderAC extends IDiccPrimitiveProviderActionConfigG = IDiccPrimitiveProviderActionConfigG,
  TKeyDiccActionRequest extends string = string
> extends ICriteria<
    TKeyDiccActionRequest,
    TKeyPrimitiveInternalACModuleContext,
    | Extract<keyof TIDiccPrimitiveMutateAC, string>
    | Extract<keyof TIDiccPrimitiveValAC, string>
    | Extract<keyof TIDiccRequestValAC, string>
    | Extract<keyof TIDiccPrimitiveHookAC, string>
    | Extract<keyof TIDiccPrimitiveProviderAC, string> //sugerido por copilot, para asegurar solo el string que representa la key
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
  TIDiccPrimitiveMutateAC extends IDiccPrimitiveMutateActionConfigG = IDiccPrimitiveMutateActionConfigG,
  TIDiccPrimitiveValAC extends IDiccPrimitiveValActionConfigG = IDiccPrimitiveValActionConfigG,
  TIDiccRequestValAC extends IDiccRequestValActionConfigG = IDiccRequestValActionConfigG,
  TIDiccPrimitiveHookAC extends IDiccPrimitiveHookActionConfigG = IDiccPrimitiveHookActionConfigG,
  TIDiccPrimitiveProviderAC extends IDiccPrimitiveProviderActionConfigG = IDiccPrimitiveProviderActionConfigG,
  TKeyDiccActionRequest extends string = string
> extends IReadCriteria<
      TKeyDiccActionRequest,
      TKeyPrimitiveInternalACModuleContext,
      | Extract<keyof TIDiccPrimitiveMutateAC, string>
      | Extract<keyof TIDiccPrimitiveValAC, string>
      | Extract<keyof TIDiccRequestValAC, string>
      | Extract<keyof TIDiccPrimitiveHookAC, string>
      | Extract<keyof TIDiccPrimitiveProviderAC, string> //sugerido por copilot, para asegurar solo el string que representa la key
    >,
    IPrimitiveCriteria<
      TIDiccPrimitiveMutateAC,
      TIDiccPrimitiveValAC,
      TIDiccRequestValAC,
      TIDiccPrimitiveHookAC,
      TIDiccPrimitiveProviderAC,
      TKeyDiccActionRequest
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
  TIDiccPrimitiveMutateAC extends IDiccPrimitiveMutateActionConfigG = IDiccPrimitiveMutateActionConfigG,
  TIDiccPrimitiveValAC extends IDiccPrimitiveValActionConfigG = IDiccPrimitiveValActionConfigG,
  TIDiccRequestValAC extends IDiccRequestValActionConfigG = IDiccRequestValActionConfigG,
  TIDiccPrimitiveHookAC extends IDiccPrimitiveHookActionConfigG = IDiccPrimitiveHookActionConfigG,
  TIDiccPrimitiveProviderAC extends IDiccPrimitiveProviderActionConfigG = IDiccPrimitiveProviderActionConfigG,
  TKeyDiccActionRequest extends string = string
> extends IModifyCriteria<
      TKeyDiccActionRequest,
      TKeyPrimitiveInternalACModuleContext,
      | Extract<keyof TIDiccPrimitiveMutateAC, string>
      | Extract<keyof TIDiccPrimitiveValAC, string>
      | Extract<keyof TIDiccRequestValAC, string>
      | Extract<keyof TIDiccPrimitiveHookAC, string>
      | Extract<keyof TIDiccPrimitiveProviderAC, string> //sugerido por copilot, para asegurar solo el string que representa la key
    >,
    IPrimitiveCriteria<
      TIDiccPrimitiveMutateAC,
      TIDiccPrimitiveValAC,
      TIDiccRequestValAC,
      TIDiccPrimitiveHookAC,
      TIDiccPrimitiveProviderAC,
      TKeyDiccActionRequest
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
  TIDiccPrimitiveMutateAC extends IDiccPrimitiveMutateActionConfigG = IDiccPrimitiveMutateActionConfigG,
  TIDiccPrimitiveValAC extends IDiccPrimitiveValActionConfigG = IDiccPrimitiveValActionConfigG,
  TIDiccRequestValAC extends IDiccRequestValActionConfigG = IDiccRequestValActionConfigG,
  TIDiccPrimitiveHookAC extends IDiccPrimitiveHookActionConfigG = IDiccPrimitiveHookActionConfigG,
  TIDiccPrimitiveProviderAC extends IDiccPrimitiveProviderActionConfigG = IDiccPrimitiveProviderActionConfigG,
  TKeyDiccActionRequest extends string = string
> = Partial<
  IPrimitiveCriteria<
    TIDiccPrimitiveMutateAC,
    TIDiccPrimitiveValAC,
    TIDiccRequestValAC,
    TIDiccPrimitiveHookAC,
    TIDiccPrimitiveProviderAC,
    TKeyDiccActionRequest
  >
> &
  Pick<
    IPrimitiveCriteria<
      TIDiccPrimitiveMutateAC,
      TIDiccPrimitiveValAC,
      TIDiccRequestValAC,
      TIDiccPrimitiveHookAC,
      TIDiccPrimitiveProviderAC,
      TKeyDiccActionRequest
    >,
    "type" | "keyActionRequest"
  >;
/**... */
export type TPrimitiveBaseReadCriteria<
  TIDiccPrimitiveMutateAC extends IDiccPrimitiveMutateActionConfigG = IDiccPrimitiveMutateActionConfigG,
  TIDiccPrimitiveValAC extends IDiccPrimitiveValActionConfigG = IDiccPrimitiveValActionConfigG,
  TIDiccRequestValAC extends IDiccRequestValActionConfigG = IDiccRequestValActionConfigG,
  TIDiccPrimitiveHookAC extends IDiccPrimitiveHookActionConfigG = IDiccPrimitiveHookActionConfigG,
  TIDiccPrimitiveProviderAC extends IDiccPrimitiveProviderActionConfigG = IDiccPrimitiveProviderActionConfigG,
  TKeyDiccActionRequest extends string = string
> = Partial<
  Omit<
    IPrimitiveReadCriteria<
      TIDiccPrimitiveMutateAC,
      TIDiccPrimitiveValAC,
      TIDiccRequestValAC,
      TIDiccPrimitiveHookAC,
      TIDiccPrimitiveProviderAC,
      TKeyDiccActionRequest
    >,
    "keyLogicContext" | "keySrc" | "p_Key" | "s_Key"
  >
>;
/**... */
export type TPrimitiveBaseModifyCriteria<
  TIDiccPrimitiveMutateAC extends IDiccPrimitiveMutateActionConfigG = IDiccPrimitiveMutateActionConfigG,
  TIDiccPrimitiveValAC extends IDiccPrimitiveValActionConfigG = IDiccPrimitiveValActionConfigG,
  TIDiccRequestValAC extends IDiccRequestValActionConfigG = IDiccRequestValActionConfigG,
  TIDiccPrimitiveHookAC extends IDiccPrimitiveHookActionConfigG = IDiccPrimitiveHookActionConfigG,
  TIDiccPrimitiveProviderAC extends IDiccPrimitiveProviderActionConfigG = IDiccPrimitiveProviderActionConfigG,
  TKeyDiccActionRequest extends string = string
> = Partial<
  Omit<
    IPrimitiveModifyCriteria<
      TIDiccPrimitiveMutateAC,
      TIDiccPrimitiveValAC,
      TIDiccRequestValAC,
      TIDiccPrimitiveHookAC,
      TIDiccPrimitiveProviderAC,
      TKeyDiccActionRequest
    >,
    "keyLogicContext" | "keySrc" | "p_Key" | "s_Key"
  >
>;

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
/**... */
export type TStructureModelDiccGlobalAC<
  TIDiccModelMutateAC,
  TIDiccModelValAC,
  TIDiccRequestValAC,
  TIDiccStructureHookAC,
  TIDiccStructureProviderAC
> = Partial<
  Pick<
    IStructureDeepMutateContext<
      any,
      Partial<
        | TIDiccModelMutateAC
        //❗Tipado que permite desactivar la accion, controller no la ejecuta❗
        | Record<keyof TIDiccModelMutateAC, null>
      >
    >,
    "modelMutate"
  > &
    Pick<
      IStructureDeepValContext<
        any,
        Partial<
          | TIDiccModelValAC
          //❗Tipado que permite desactivar la accion, controller no la ejecuta❗
          | Record<keyof TIDiccModelValAC, null>
        >,
        Partial<
          | TIDiccRequestValAC
          //❗Tipado que permite desactivar la accion, controller no la ejecuta❗
          | Record<keyof TIDiccRequestValAC, null>
        >
      >,
      "modelVal" | "requestVal"
    > & //no necesita Pick
    IStructureHookContext<
      Partial<
        | TIDiccStructureHookAC
        //❗Tipado que permite desactivar la accion, controller no la ejecuta❗
        | Record<keyof TIDiccStructureHookAC, null>
      >
    > & //no necesita Pick
    IStructureProviderContext<
      Partial<
        | TIDiccStructureProviderAC
        //❗Tipado que permite desactivar la accion, controller no la ejecuta❗
        | Record<keyof TIDiccStructureProviderAC, null>
      >
    >
>;
/** */
export interface IStructureModelCriteria<
  TModel,
  TIDiccModelMutateAC extends IDiccModelMutateActionConfigG = IDiccModelMutateActionConfigG,
  TIDiccModelValAC extends IDiccModelValActionConfigG = IDiccModelValActionConfigG,
  TIDiccRequestValAC extends IDiccRequestValActionConfigG = IDiccRequestValActionConfigG,
  TIDiccStructureHookAC extends IDiccStructureHookActionConfigG = IDiccStructureHookActionConfigG,
  TIDiccStructureProviderAC extends IDiccStructureProviderActionConfigG = IDiccStructureProviderActionConfigG,
  TKeyDiccActionRequest extends string = string
> extends ICriteria<
    TKeyDiccActionRequest,
    TKeyModelInternalACModuleContext,
    | Extract<keyof TIDiccModelMutateAC, string>
    | Extract<keyof TIDiccModelValAC, string>
    | Extract<keyof TIDiccRequestValAC, string>
    | Extract<keyof TIDiccStructureHookAC, string>
    | Extract<keyof TIDiccStructureProviderAC, string> //sugerido por copilot, para asegurar solo el string que representa la key
  > {
  /**array con todas las rutas keyPath de este modulo */
  keysPath: string[];
  /** */
  keyPath: string;
  /** */
  keyStructureContext: TKeyStructureContextFull;
  diccGlobalAC?: TStructureModelDiccGlobalAC<
    TIDiccModelMutateAC,
    TIDiccModelValAC,
    TIDiccRequestValAC,
    TIDiccStructureHookAC,
    TIDiccStructureProviderAC
  >;
  sort: Array<Record<keyof TModel, TSortDirection>>;
}
/**... */
export interface IStructureModelReadCriteria<
  TModel,
  TIDiccModelMutateAC extends IDiccModelMutateActionConfigG = IDiccModelMutateActionConfigG,
  TIDiccModelValAC extends IDiccModelValActionConfigG = IDiccModelValActionConfigG,
  TIDiccRequestValAC extends IDiccRequestValActionConfigG = IDiccRequestValActionConfigG,
  TIDiccStructureHookAC extends IDiccStructureHookActionConfigG = IDiccStructureHookActionConfigG,
  TIDiccStructureProviderAC extends IDiccStructureProviderActionConfigG = IDiccStructureProviderActionConfigG,
  TKeyDiccActionRequest extends string = string
> extends IReadCriteria<
      TKeyDiccActionRequest,
      TKeyModelInternalACModuleContext,
      | Extract<keyof TIDiccModelMutateAC, string>
      | Extract<keyof TIDiccModelValAC, string>
      | Extract<keyof TIDiccRequestValAC, string>
      | Extract<keyof TIDiccStructureHookAC, string>
      | Extract<keyof TIDiccStructureProviderAC, string> //sugerido por copilot, para asegurar solo el string que representa la key
    >,
    IStructureModelCriteria<
      TModel,
      TIDiccModelMutateAC,
      TIDiccModelValAC,
      TIDiccRequestValAC,
      TIDiccStructureHookAC,
      TIDiccStructureProviderAC,
      TKeyDiccActionRequest
    > {
  sort: Array<Record<keyof TModel, TSortDirection>>; //❗OBLIGATORIO redefinir❗
  diccGlobalAC?: TStructureModelDiccGlobalAC<
    TIDiccModelMutateAC,
    TIDiccModelValAC,
    TIDiccRequestValAC,
    TIDiccStructureHookAC,
    TIDiccStructureProviderAC
  >; //❗OBLIGATORIO redefinir❗
}
/** */
export interface IStructureModelModifyCriteria<
  TModel,
  TIDiccModelMutateAC extends IDiccModelMutateActionConfigG = IDiccModelMutateActionConfigG,
  TIDiccModelValAC extends IDiccModelValActionConfigG = IDiccModelValActionConfigG,
  TIDiccRequestValAC extends IDiccRequestValActionConfigG = IDiccRequestValActionConfigG,
  TIDiccStructureHookAC extends IDiccStructureHookActionConfigG = IDiccStructureHookActionConfigG,
  TIDiccStructureProviderAC extends IDiccStructureProviderActionConfigG = IDiccStructureProviderActionConfigG,
  TKeyDiccActionRequest extends string = string
> extends IModifyCriteria<
      TKeyDiccActionRequest,
      TKeyModelInternalACModuleContext,
      | Extract<keyof TIDiccModelMutateAC, string>
      | Extract<keyof TIDiccModelValAC, string>
      | Extract<keyof TIDiccRequestValAC, string>
      | Extract<keyof TIDiccStructureHookAC, string>
      | Extract<keyof TIDiccStructureProviderAC, string> //sugerido por copilot, para asegurar solo el string que representa la key
    >,
    IStructureModelCriteria<
      TModel,
      TIDiccModelMutateAC,
      TIDiccModelValAC,
      TIDiccRequestValAC,
      TIDiccStructureHookAC,
      TIDiccStructureProviderAC,
      TKeyDiccActionRequest
    > {
  diccGlobalAC?: TStructureModelDiccGlobalAC<
    TIDiccModelMutateAC,
    TIDiccModelValAC,
    TIDiccRequestValAC,
    TIDiccStructureHookAC,
    TIDiccStructureProviderAC
  >; //❗OBLIGATORIO redefinir❗
}
/**... */
export type TStructureDiccGlobalACForField<
  TIDiccFieldMutateAC,
  TIDiccFieldValAC
> = Partial<
  Pick<
    IStructureDeepMutateContext<
      Partial<
        | TIDiccFieldMutateAC
        //❗Tipado que permite desactivar la accion, controller no la ejecuta❗
        | Record<keyof TIDiccFieldMutateAC, null>
      >,
      any
    >,
    "fieldMutate"
  > &
    Pick<
      IStructureDeepValContext<
        Partial<
          | TIDiccFieldValAC
          //❗Tipado que permite desactivar la accion, controller no la ejecuta❗
          | Record<keyof TIDiccFieldValAC, null>
        >,
        any,
        any
      >,
      "fieldVal"
    >
>;
/**... */
export interface IStructureFieldCriteria<
  TModel,
  TIDiccFieldMutateAC extends IDiccFieldMutateActionConfigG = IDiccFieldMutateActionConfigG,
  TIDiccFieldValAC extends IDiccFieldValActionConfigG = IDiccFieldValActionConfigG
> extends Pick<
    ICriteria<
      any,
      TKeyFieldInternalACModuleContext,
      | Extract<keyof TIDiccFieldMutateAC, string>
      | Extract<keyof TIDiccFieldValAC, string>
    >,
    "aTKeysGlobalActionConfig"
  > {
  /**array con todas las rutas keyPath de este modulo */
  keysPath: string[];
  /** */
  keyPath: string;
  diccGlobalAC?: TStructureDiccGlobalACForField<
    TIDiccFieldMutateAC,
    TIDiccFieldValAC
  >;
}
/**... */
export type TStructureModelBaseCriteria<
  TModel,
  TIDiccModelMutateAC extends IDiccModelMutateActionConfigG = IDiccModelMutateActionConfigG,
  TIDiccModelValAC extends IDiccModelValActionConfigG = IDiccModelValActionConfigG,
  TIDiccRequestValAC extends IDiccRequestValActionConfigG = IDiccRequestValActionConfigG,
  TIDiccStructureHookAC extends IDiccStructureHookActionConfigG = IDiccStructureHookActionConfigG,
  TIDiccStructureProviderAC extends IDiccStructureProviderActionConfigG = IDiccStructureProviderActionConfigG,
  TKeyDiccActionRequest extends string = string
> = Partial<
  IStructureModelCriteria<
    TModel,
    TIDiccModelMutateAC,
    TIDiccModelValAC,
    TIDiccRequestValAC,
    TIDiccStructureHookAC,
    TIDiccStructureProviderAC,
    TKeyDiccActionRequest
  >
>;
/**... */
export type TStructureModelBaseReadCriteria<
  TModel,
  TIDiccModelMutateAC extends IDiccModelMutateActionConfigG = IDiccModelMutateActionConfigG,
  TIDiccModelValAC extends IDiccModelValActionConfigG = IDiccModelValActionConfigG,
  TIDiccRequestValAC extends IDiccRequestValActionConfigG = IDiccRequestValActionConfigG,
  TIDiccStructureHookAC extends IDiccStructureHookActionConfigG = IDiccStructureHookActionConfigG,
  TIDiccStructureProviderAC extends IDiccStructureProviderActionConfigG = IDiccStructureProviderActionConfigG,
  TKeyDiccActionRequest extends string = string
> = Partial<
  Omit<
    IStructureModelReadCriteria<
      TModel,
      TIDiccModelMutateAC,
      TIDiccModelValAC,
      TIDiccRequestValAC,
      TIDiccStructureHookAC,
      TIDiccStructureProviderAC,
      TKeyDiccActionRequest
    >,
    | "keyLogicContext"
    | "keySrc"
    | "p_Key"
    | "s_Key"
    | "keysPath"
    | "keyPath"
    | "keyStructureContext"
  >
>;
/**... */
export type TStructureModelBaseModifyCriteria<
  TModel,
  TIDiccModelMutateAC extends IDiccModelMutateActionConfigG = IDiccModelMutateActionConfigG,
  TIDiccModelValAC extends IDiccModelValActionConfigG = IDiccModelValActionConfigG,
  TIDiccRequestValAC extends IDiccRequestValActionConfigG = IDiccRequestValActionConfigG,
  TIDiccStructureHookAC extends IDiccStructureHookActionConfigG = IDiccStructureHookActionConfigG,
  TIDiccStructureProviderAC extends IDiccStructureProviderActionConfigG = IDiccStructureProviderActionConfigG,
  TKeyDiccActionRequest extends string = string
> = Partial<
  Omit<
    IStructureModelModifyCriteria<
      TModel,
      TIDiccModelMutateAC,
      TIDiccModelValAC,
      TIDiccRequestValAC,
      TIDiccStructureHookAC,
      TIDiccStructureProviderAC,
      TKeyDiccActionRequest
    >,
    | "keyLogicContext"
    | "keySrc"
    | "p_Key"
    | "s_Key"
    | "keysPath"
    | "keyPath"
    | "keyStructureContext"
  >
>;
/**... */
export type TStructureFieldBaseCriteria<
  TModel,
  TIDiccFieldMutateAC extends IDiccFieldMutateActionConfigG = IDiccFieldMutateActionConfigG,
  TIDiccFieldValAC extends IDiccFieldValActionConfigG = IDiccFieldValActionConfigG
> = Partial<
  Pick<
    IStructureFieldCriteria<TModel, TIDiccFieldMutateAC, TIDiccFieldValAC>,
    "aTKeysGlobalActionConfig" | "diccGlobalAC"
  >
>;
