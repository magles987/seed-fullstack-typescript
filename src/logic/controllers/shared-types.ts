import {
  TPrimitiveBaseReadCriteria,
  TPrimitiveBaseModifyCriteria,
  TStructureFieldBaseCriteria,
  TStructureModelBaseReadCriteria,
  TStructureModelBaseModifyCriteria,
  TStructureEmbModelBaseCriteria,
} from "../criterias/shared-types";
import { PrimitiveLogicHook } from "../hooks/primitive-hook";
import { StructureLogicHook } from "../hooks/structure-hook";
import { FieldLogicMutater } from "../mutaters/field-mutater";
import { ModelLogicMutater } from "../mutaters/model-mutater";
import { PrimitiveLogicMutater } from "../mutaters/primitive-mutater";
import { PrimitiveLogicProvider } from "../providers/primitive-provider";
import { StructureLogicProvider } from "../providers/structure-provider";
import { FieldLogicValidation } from "../validators/field-validation";
import { ModelLogicValidation } from "../validators/model-validation";
import { PrimitiveLogicValidation } from "../validators/primitive-validation";
import { RequestLogicValidation } from "../validators/request-validation";
import { PrimitiveLogicController } from "./primitive-ctrl";
import { StructureLogicController } from "./structure-ctrl";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**claves identificadoras de acciones de petición para lectura de datos */
export type TKeyReadActionRequestCtrl =
  | "readAll"
  | "readOne"
  | "readMany"
  | "exist"
  | "count";
/**claves identificadoras de acciones de petición para modificación de datos */
export type TKeyModifyActionRequestCtrl = "create" | "update" | "delete";
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
export type TKeyPrimitiveReadActionRequestCtrl = TKeyReadActionRequestCtrl; //opción ampliable
/**claves identificadoras de acciones de petición para lectura de datos en contexto primitivo */
export type TKeyPrimitiveModifyActionRequestCtrl = TKeyModifyActionRequestCtrl; //opción ampliable
/**union de calves identificadoras de acciones de petición */
export type TKeyPrimitiveUnionActionRequestCtrl =
  | TKeyPrimitiveReadActionRequestCtrl
  | TKeyPrimitiveModifyActionRequestCtrl;

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
export type TKeyStructureReadActionRequestCtrl =
  | "readById"
  | TKeyReadActionRequestCtrl; //opción ampliable y personalizable a este contexto
/**claves identificadoras de acciones de petición para lectura de datos en contexto estructurado */
export type TKeyStructureModifyActionRequestCtrl = TKeyModifyActionRequestCtrl; //opción ampliable y personalizable a este contexto
/**union de calves identificadoras de acciones de petición */
export type TKeyStructureUnionActionRequestCtrl =
  | TKeyStructureReadActionRequestCtrl
  | TKeyStructureModifyActionRequestCtrl;
