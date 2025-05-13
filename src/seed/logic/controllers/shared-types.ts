import {
  TPrimitiveBaseModifyCriteria,
  TPrimitiveBaseReadCriteria,
  TStructureEmbModelBaseCriteria,
  TStructureFieldBaseCriteria,
  TStructureModelBaseModifyCriteria,
  TStructureModelBaseReadCriteria,
} from "../criterias/index-barrel";
import { StructureLogicHook, PrimitiveLogicHook } from "../hooks/index-barrel";
import {
  PrimitiveLogicMutater,
  ModelLogicMutater,
  FieldLogicMutater,
} from "../mutaters/index-barrel";
import {
  StructureLogicProvider,
  PrimitiveLogicProvider,
} from "../providers/index-barrel";
import {
  RequestLogicValidation,
  PrimitiveLogicValidation,
  ModelLogicValidation,
  FieldLogicValidation,
} from "../validators/index-barrel";
import { PrimitiveLogicController } from "./primitive-ctrl";
import { StructureLogicController } from "./structure-ctrl";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**claves identificadoras de acciones de petición para lectura de datos */
export type TKeyReadRequestCtrl =
  | "readAll"
  | "readOne"
  | "readMany"
  | "exist"
  | "count";
/**claves identificadoras de acciones de petición para modificación de datos */
export type TKeyModifyRequestCtrl = "create" | "update" | "delete";
//| "createMany"
//| "updateMany"
//| "deleteMany"

//====Primitive===================================================================================================================

/** */
export interface IPrimitiveCtrlContext<
  TPrimitiveCtrl = unknown //puede ser cualquier interfaz o tipado
> {
  primitiveCtrl: TPrimitiveCtrl;
}
/**claves identificadoras para el contexto de ejecucion para el modulo primitive*/
export type TKeyPrimitiveCtrlModuleContext = keyof IPrimitiveCtrlContext;
/** */
export interface IPrimitiveCtrlContextInstance<
  TValue,
  TPrimitiveMutateInstance extends PrimitiveLogicMutater = PrimitiveLogicMutater,
  TPrimitiveValInstance extends PrimitiveLogicValidation = PrimitiveLogicValidation,
  TRequestValInstance extends RequestLogicValidation = RequestLogicValidation,
  TPrimitiveHookInstance extends PrimitiveLogicHook = PrimitiveLogicHook,
  TPrimitiveProviderInstance extends PrimitiveLogicProvider = PrimitiveLogicProvider,
  TKeyDiccActionRequest extends string = string
> extends IPrimitiveCtrlContext<
    PrimitiveLogicController<
      TValue,
      TPrimitiveMutateInstance,
      TPrimitiveValInstance,
      TRequestValInstance,
      TPrimitiveHookInstance,
      TPrimitiveProviderInstance,
      TKeyDiccActionRequest
    >
  > {}
/**... */
export type Trf_IPrimitiveCtrlContextInstance =
  IPrimitiveCtrlContextInstance<any>;
/** */
export type TPrimitiveCtrlBaseConfig<
  TPrimitiveMutateInstance extends PrimitiveLogicMutater = PrimitiveLogicMutater,
  TPrimitiveValInstance extends PrimitiveLogicValidation = PrimitiveLogicValidation,
  TRequestValInstance extends RequestLogicValidation = RequestLogicValidation,
  TPrimitiveHookInstance extends PrimitiveLogicHook = PrimitiveLogicHook,
  TPrimitiveProviderInstance extends PrimitiveLogicProvider = PrimitiveLogicProvider,
  TKeyDiccActionRequest extends string = string
> = {
  /**diccionario de acciones de petición (configuración para criterios) */
  diccCriteriaRequestConfig?: Record<
    TKeyDiccActionRequest,
    TPrimitiveBaseReadCriteria<
      TPrimitiveMutateInstance["diccActionConfig"],
      TPrimitiveValInstance["diccActionConfig"],
      TRequestValInstance["diccActionConfig"],
      TPrimitiveHookInstance["diccActionConfig"],
      TPrimitiveProviderInstance["diccActionConfig"],
      TKeyDiccActionRequest
    > &
      TPrimitiveBaseModifyCriteria<
        TPrimitiveMutateInstance["diccActionConfig"],
        TPrimitiveValInstance["diccActionConfig"],
        TRequestValInstance["diccActionConfig"],
        TPrimitiveHookInstance["diccActionConfig"],
        TPrimitiveProviderInstance["diccActionConfig"],
        TKeyDiccActionRequest
      >
  >;
};
/** */
export type TPrimitiveCtrlDiccACForCriteria<TIDiccPrimitiveCtrlAC> =
  IPrimitiveCtrlContext<
    Partial<
      | TIDiccPrimitiveCtrlAC
      //❗Tipado que permite desactivar la acción, controller no la ejecuta❗
      | Record<keyof TIDiccPrimitiveCtrlAC, null>
    >
  >;
/**claves identificadoras de acciones de petición para lectura de datos en contexto primitivo */
export type TKeyPrimitiveReadRequestCtrl = TKeyReadRequestCtrl; //opción ampliable
/**claves identificadoras de acciones de petición para lectura de datos en contexto primitivo */
export type TKeyPrimitiveModifyRequestCtrl = TKeyModifyRequestCtrl; //opción ampliable

//====Strcuture====================================================================================================================

/**esquema de propósito general con los contextos estructurales del modulo*/
export interface IStructureCtrlContext<
  TStructureCtrl = unknown //puede ser cualquier interfaz o tipado
> {
  structureCtrl: TStructureCtrl;
}
/**contexto de ejecución del modulo para structure*/
export type TKeyStructureCtrlModuleContext = keyof IStructureCtrlContext;
/**esquema de propósito general con los contextos estructurales del modulo*/
export interface IStructureDeepCtrlContext<
  TFieldCtrl = unknown, //puede ser cualquier interfaz o tipado
  TModelCtrl = unknown //puede ser cualquier interfaz o tipado
> {
  /** */
  fieldCtrl: TFieldCtrl;
  /** */
  modelCtrl: TModelCtrl;
}
/**clave identificadora para el contexto profundo de la estructura*/
export type TKeyStructureDeepCtrlModuleContext =
  keyof IStructureDeepCtrlContext;
/** */
export interface IStructureCtrlContextInstance<
  TModel,
  TFieldMutateInstance extends FieldLogicMutater = FieldLogicMutater,
  TModelMutateInstance extends ModelLogicMutater = ModelLogicMutater,
  TFieldValInstance extends FieldLogicValidation = FieldLogicValidation,
  TModelValInstance extends ModelLogicValidation = ModelLogicValidation,
  TRequestValInstance extends RequestLogicValidation = RequestLogicValidation,
  TStructureHookInstance extends StructureLogicHook = StructureLogicHook,
  TStructureProviderInstance extends StructureLogicProvider = StructureLogicProvider,
  TKeyDiccActionRequest extends string = string
> extends IStructureCtrlContext<
    StructureLogicController<
      TModel,
      TFieldMutateInstance,
      TModelMutateInstance,
      TFieldValInstance,
      TModelValInstance,
      TRequestValInstance,
      TStructureHookInstance,
      TStructureProviderInstance,
      TKeyDiccActionRequest
    >
  > {}
/**... */
export type Trf_IStructureCtrlContextInstance = IStructureCtrlContextInstance<
  any,
  any,
  any
>;
export type TFieldCtrlBaseConfig<
  TFieldMutateInstance extends FieldLogicMutater = FieldLogicMutater,
  TFieldValInstance extends FieldLogicValidation = FieldLogicValidation
> = {
  criteriaFieldRequestConfig: TStructureFieldBaseCriteria<
    any,
    TFieldMutateInstance["diccActionConfig"],
    TFieldValInstance["diccActionConfig"]
  >;
};
/** */
export type TModelCtrlBaseConfig<
  TModel,
  TModelMutateInstance extends ModelLogicMutater = ModelLogicMutater,
  TModelValInstance extends ModelLogicValidation = ModelLogicValidation,
  TRequestValInstance extends RequestLogicValidation = RequestLogicValidation,
  TStructureHookInstance extends StructureLogicHook = StructureLogicHook,
  TStructureProviderInstance extends StructureLogicProvider = StructureLogicProvider,
  TKeyDiccActionRequest extends string = string
> = {
  /**diccionario de acciones de petición (configuración para criterios) */
  diccCriteriaRequestConfig?: Record<
    TKeyDiccActionRequest,
    TStructureModelBaseReadCriteria<
      TModel,
      TModelMutateInstance["diccActionConfig"],
      TModelValInstance["diccActionConfig"],
      TRequestValInstance["diccActionConfig"],
      TStructureHookInstance["diccActionConfig"],
      TStructureProviderInstance["diccActionConfig"],
      TKeyDiccActionRequest
    > &
      TStructureModelBaseModifyCriteria<
        TModel,
        TModelMutateInstance["diccActionConfig"],
        TModelValInstance["diccActionConfig"],
        TRequestValInstance["diccActionConfig"],
        TStructureHookInstance["diccActionConfig"],
        TStructureProviderInstance["diccActionConfig"],
        TKeyDiccActionRequest
      >
  >;
  criteriaEmbModelRequestConfig?: TStructureEmbModelBaseCriteria<
    TModel,
    TModelMutateInstance["diccActionConfig"], //no se necesita contexto embebido en este nivel
    TModelValInstance["diccActionConfig"], //no se necesita contexto embebido en este nivel
    TStructureHookInstance["diccActionConfig"]
  >;
};
/** */
export type TStructureCtrlBaseConfig<
  TModel,
  TFieldMutateInstance extends FieldLogicMutater = FieldLogicMutater,
  TModelMutateInstance extends ModelLogicMutater = ModelLogicMutater,
  TFieldValInstance extends FieldLogicValidation = FieldLogicValidation,
  TModelValInstance extends ModelLogicValidation = ModelLogicValidation,
  TRequestValInstance extends RequestLogicValidation = RequestLogicValidation,
  TStructureHookInstance extends StructureLogicHook = StructureLogicHook,
  TStructureProviderInstance extends StructureLogicProvider = StructureLogicProvider,
  TKeyDiccActionRequest extends string = string
> = Partial<
  TModelCtrlBaseConfig<
    TModel,
    TModelMutateInstance,
    TModelValInstance,
    TRequestValInstance,
    TStructureHookInstance,
    TStructureProviderInstance,
    TKeyDiccActionRequest
  > & {
    diccCriteriaFieldRequestConfig?: Record<
      keyof TModel,
      TFieldCtrlBaseConfig<
        TFieldMutateInstance,
        TFieldValInstance
      >["criteriaFieldRequestConfig"]
    >;
  }
  //por tipado no se puede asignar directamente del
  // Pick<
  //   ReturnType<
  //     StructureLogicController<
  //       TModel,
  //       TFieldMutateInstance,
  //       TModelMutateInstance,
  //       TFieldValInstance,
  //       TModelValInstance,
  //       TRequestValInstance,
  //       TStructureHookInstance,
  //       TStructureProviderInstance,
  //       TKeyDiccActionRequest
  //     >["getDefault"]
  //   >,
  //   | "diccCriteriaRequestConfig"
  //   | "criteriaEmbModelRequestConfig"
  //   | "criteriaFieldRequestConfig"
  // >
>;
/** */
export type TStructureCtrlDiccACForCriteria<TIDiccStructureCtrlAC> =
  IStructureCtrlContext<
    Partial<
      | TIDiccStructureCtrlAC
      //❗Tipado que permite desactivar la acción, controller no la ejecuta❗
      | Record<keyof TIDiccStructureCtrlAC, null>
    >
  >;
/**claves identificadoras de acciones de petición para lectura de datos en contexto estructurado */
export type TKeyStructureReadRequestCtrl = "readById" | TKeyReadRequestCtrl; //opción ampliable y personalizable a este contexto
/**claves identificadoras de acciones de petición para lectura de datos en contexto estructurado */
export type TKeyStructureModifyRequestCtrl = TKeyModifyRequestCtrl; //opción ampliable y personalizable a este contexto
