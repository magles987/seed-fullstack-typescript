import { FieldLogicMutater } from "./field-mutater";
import { ModelLogicMutater } from "./model-mutater";
import { PrimitiveLogicMutater } from "./primitive-mutater";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████

//====Primitive===================================================================================================================
/**esquema de propósito general con los contextos primitivos del modulo*/
export interface IPrimitiveMutateContext<
  TPrimitiveMutate = unknown //puede ser cualquier interfaz o tipado
> {
  /**configuración **general** para contexto de campo */
  primitiveMutate: TPrimitiveMutate;
}
/**claves identificadoras para el contexto de ejecución para el modulo primitive*/
export type TKeyPrimitiveMutateModuleContext = keyof IPrimitiveMutateContext;
/**esquema exclusivo de configuración para el manejador */
export interface IPrimitiveMutateContextInstance<
  TPrimitiveMutaterInstance extends PrimitiveLogicMutater = PrimitiveLogicMutater
> extends IPrimitiveMutateContext<TPrimitiveMutaterInstance> {}
/**refactorización del tipo */
export type Trf_IPrimitiveMutateContextInstance =
  IPrimitiveMutateContextInstance<any>;
/** */
export type TPrimitiveMutateBaseConfig = Partial<
  Pick<
    ReturnType<PrimitiveLogicMutater["getDefault"]>,
    "diccActionConfig" | "topMandatoryKeysAction" | "topPriorityKeysAction"
  >
>;
/** */
export type TPrimitiveMutateDiccACForCriteria<TIDiccPrimitiveMutateAC> =
  IPrimitiveMutateContext<
    Partial<
      | TIDiccPrimitiveMutateAC
      //❗Tipado que permite desactivar la acción, controller no la ejecuta❗
      | Record<keyof TIDiccPrimitiveMutateAC, null>
    >
  >;

//====Strcuture====================================================================================================================
/**clave identificadora de este modulo segun su contexto */
export type TKeyStructureMutateModuleContext = "structureMutate";
/**esquema de propósito general con los contextos profundos estructurales del modulo*/
export interface IStructureDeepMutateContext<
  TFieldMutate = unknown, //puede ser cualquier interfaz o tipado
  TModelMutate = unknown //puede ser cualquier interfaz o tipado
> {
  /**configuración **general** para contexto de campo */
  fieldMutate: TFieldMutate;
  /**configuración **general** para contexto de modelo */
  modelMutate: TModelMutate;
}
/**claves identificadoras profunda para el contexto de ejecucion para el modulo structure*/
export type TKeyStructureDeepMutateModuleContext =
  keyof IStructureDeepMutateContext;
/**esquema exclusivo de configuracion base
 * (tanto para los default del modulo como
 * los metadatos) */
export interface IStructureMutateContextInstance<
  TFieldMutaterInstance extends FieldLogicMutater = FieldLogicMutater,
  TModelMutaterInstance extends ModelLogicMutater = ModelLogicMutater
> extends IStructureDeepMutateContext<
    TFieldMutaterInstance,
    TModelMutaterInstance
  > {}
/**refactorización del tipo */
export type Trf_IStructureMutateContextInstance =
  IStructureMutateContextInstance<any, any>;
/** */
export type TFieldMutateBaseConfig = Partial<
  Pick<
    ReturnType<FieldLogicMutater["getDefault"]>,
    "diccActionConfig" | "topMandatoryKeysAction" | "topPriorityKeysAction"
  >
>;
/** */
export type TModelMutateBaseConfig = Partial<
  Pick<
    ReturnType<ModelLogicMutater["getDefault"]>,
    "diccActionConfig" | "topMandatoryKeysAction" | "topPriorityKeysAction"
  >
>;
/** */
export type TStructureModelMutateDiccACForCriteria<TIDiccModelMutateAC> = Pick<
  IStructureDeepMutateContext<
    any,
    Partial<
      | TIDiccModelMutateAC
      //❗Tipado que permite desactivar la accion, controller no la ejecuta❗
      | Record<keyof TIDiccModelMutateAC, null>
    >
  >,
  "modelMutate"
>;
/** */
export type TStructureEmbModelMutateDiccACForCriteria<TIDiccEmbModelMutateAC> =
  Pick<
    IStructureDeepMutateContext<
      any,
      Partial<
        | TIDiccEmbModelMutateAC
        //❗Tipado que permite desactivar la accion, controller no la ejecuta❗
        | Record<keyof TIDiccEmbModelMutateAC, null>
      >
    >,
    "modelMutate" //se usa el contexto de modelo para embebido
  >;
/** */
export type TStructureFieldMutateDiccACForCriteria<TIDiccFieldMutateAC> = Pick<
  IStructureDeepMutateContext<
    Partial<
      | TIDiccFieldMutateAC
      //❗Tipado que permite desactivar la acción, controller no la ejecuta❗
      | Record<keyof TIDiccFieldMutateAC, null>
    >,
    any
  >,
  "fieldMutate"
>;
