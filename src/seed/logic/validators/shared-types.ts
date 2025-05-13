import { FieldLogicValidation } from "./field-validation";
import { ModelLogicValidation } from "./model-validation";
import { PrimitiveLogicValidation } from "./primitive-validation";
import { RequestLogicValidation } from "./request-validation";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**... */
export interface IRequestValContext<
  TRequestVal = unknown //puede ser cualquier interfaz o tipado
> {
  /**configuración **general** para contexto de petición */
  requestVal: TRequestVal;
}
/**claves identificadoras para el contexto de ejecucion para el modulo primitive*/
export type TKeyRequestValModuleContext = keyof IRequestValContext;
export interface IRequestValModuleConfig<
  TRequestInstance extends RequestLogicValidation = RequestLogicValidation
> {
  /**configuración **general** para contexto de petición */
  requestVal: TRequestInstance;
}
/**... */
export type TRequestConfigForVal<
  TRequestInstance extends RequestLogicValidation = RequestLogicValidation
> = IRequestValModuleConfig<TRequestInstance>["requestVal"];

/** */
export type TRequestValBaseConfig = Partial<
  Pick<
    ReturnType<RequestLogicValidation["getDefault"]>,
    "diccActionConfig" | "topMandatoryKeysAction" | "topPriorityKeysAction"
  >
>;

//====Primitive===================================================================================================================

/**esquema de propósito general con los contextos primitivos del modulo*/
export interface IPrimitiveValContext<
  TPrimitiveVal = unknown, //puede ser cualquier interfaz o tipado
  TRequestVal = unknown //puede ser cualquier interfaz o tipado
> extends IRequestValContext<TRequestVal> {
  /**configuración **general** para contexto de campo */
  primitiveVal: TPrimitiveVal;
}
/**claves identificadoras para el contexto de ejecucion para el modulo primitive*/
export type TKeyPrimitiveValModuleContext = keyof IPrimitiveValContext;
/**esquema exclusivo de configuración base
 * (tanto para los default del modulo como
 * los metadatos) */
export interface IPrimitiveValContextInstance<
  TPrimitiveValInstance extends PrimitiveLogicValidation = PrimitiveLogicValidation,
  TRequestInstance extends RequestLogicValidation = RequestLogicValidation
> extends Omit<IPrimitiveValContext<TPrimitiveValInstance>, "requestVal">,
    IRequestValModuleConfig<TRequestInstance> {}
/**refactorización del tipo */
export type Trf_IPrimitiveValContextInstance = IPrimitiveValContextInstance<
  any,
  any
>;
/** */
export type TPrimitiveValBaseConfig = Partial<
  Pick<
    ReturnType<PrimitiveLogicValidation["getDefault"]>,
    | "diccActionConfig"
    | "topMandatoryKeysAction"
    | "topPriorityKeysAction"
    | "isRequiredSpecialConfig"
  >
>;
/** */
export type TPrimitiveValDiccACForCriteria<
  TIDiccPrimitiveValAC,
  TIDiccRequestValAC
> = Pick<
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
  >,
  "primitiveVal" | "requestVal"
>;

//====Structure===================================================================================================================

/**clave identificadora de este modulo segun su contexto */
export type TKeyStructureValModuleContext = "structureVal";
/**esquema de proposito general con los contextos profundos estructurales del modulo*/
export interface IStructureDeepValContext<
  TFieldVal = unknown, //puede ser cualquier interfaz o tipado
  TModelVal = unknown, //puede ser cualquier interfaz o tipado
  TRequestVal = unknown //puede ser cualquier interfaz o tipado
> extends IRequestValContext<TRequestVal> {
  /**configuración **general** para contexto de campo */
  fieldVal: TFieldVal;
  /**configuración **general** para contexto de modelo */
  modelVal: TModelVal;
}
/**claves identificadoras para el contexto profundo de ejecución para el modulo structure*/
export type TKeyStructureDeepValModuleContext = keyof IStructureDeepValContext;
/**esquema exclusivo de configuración base (tanto para los default del modulo como los metadatos) */
export interface IStructureValContextInstance<
  TFieldValInstance extends FieldLogicValidation = FieldLogicValidation,
  TModelValInstance extends ModelLogicValidation = ModelLogicValidation,
  TRequestInstance extends RequestLogicValidation = RequestLogicValidation
> extends Omit<
      IStructureDeepValContext<TFieldValInstance, TModelValInstance>,
      "requestVal"
    >,
    IRequestValModuleConfig<TRequestInstance> {}
/**refactorización del tipo */
export type Trf_IStructureValContextInstance = IStructureValContextInstance<
  any,
  any,
  any
>;
/** */
export type TFieldValBaseConfig = Partial<
  Pick<
    ReturnType<FieldLogicValidation["getDefault"]>,
    | "diccActionConfig"
    | "topMandatoryKeysAction"
    | "topPriorityKeysAction"
    | "isRequiredSpecialConfig"
  >
>;
/** */
export type TModelValBaseConfig = Partial<
  Pick<
    ReturnType<ModelLogicValidation["getDefault"]>,
    | "diccActionConfig"
    | "topMandatoryKeysAction"
    | "topPriorityKeysAction"
    | "isRequiredSpecialConfig"
  >
>;
/** */
export type TStructureModelValDiccACForCriteria<
  TIDiccModelValAC,
  TIDiccRequestValAC
> = Pick<
  IStructureDeepValContext<
    any,
    Partial<
      | TIDiccModelValAC
      //❗Tipado que permite desactivar la acción, controller no la ejecuta❗
      | Record<keyof TIDiccModelValAC, null>
    >,
    Partial<
      | TIDiccRequestValAC
      //❗Tipado que permite desactivar la acción, controller no la ejecuta❗
      | Record<keyof TIDiccRequestValAC, null>
    >
  >,
  "modelVal" | "requestVal"
>;
/** */
export type TStructureEmbModelValDiccACForCriteria<TIDiccEmbModelValAC> = Pick<
  IStructureDeepValContext<
    any,
    Partial<
      | TIDiccEmbModelValAC
      //❗Tipado que permite desactivar la acción, controller no la ejecuta❗
      | Record<keyof TIDiccEmbModelValAC, null>
    >
  >,
  "modelVal" //se usa el contexto de modelo para embebido
>;
/** */
export type TStructureFieldValDiccACForCriteria<TIDiccFieldValAC> = Pick<
  IStructureDeepValContext<
    Partial<
      | TIDiccFieldValAC
      //❗Tipado que permite desactivar la acción, controller no la ejecuta❗
      | Record<keyof TIDiccFieldValAC, null>
    >,
    any,
    any
  >,
  "fieldVal"
>;
