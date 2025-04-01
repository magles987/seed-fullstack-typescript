import {
  TCapitalizeFirstLetter,
  TExtractOnlyKeyString,
} from "../../util/shared";
import {
  TPrimitiveBaseModifyCriteria,
  TPrimitiveBaseReadCriteria,
  TStructureFieldBaseCriteria,
  TStructureModelBaseModifyCriteria,
  TStructureModelBaseReadCriteria,
} from "../criterias/shared";
import { PrimitiveLogicHook } from "../hooks/primitive-hook";
import { StructureLogicHook } from "../hooks/structure-hook";
import { FieldLogicMutater } from "../mutaters/field-mutater";
import { ModelLogicMutater } from "../mutaters/model-mutater";
import { PrimitiveLogicMutater } from "../mutaters/primitive-mutater";
import { PrimitiveLogicProvider } from "../providers/primitive-provider";
import { StructureLogicProvider } from "../providers/structure-provider";
import { IPrimitiveResponse, IStructureResponse } from "../reports/shared";
import { FieldLogicValidation } from "../validators/field-validation";
import { ModelLogicValidation } from "../validators/model-validation";
import { PrimitiveLogicValidation } from "../validators/primitive-validation";
import { RequestLogicValidation } from "../validators/request-validation";

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
export interface IPrimitiveCtrlModuleConfig<
  TPrimitiveMutateInstance extends PrimitiveLogicMutater = PrimitiveLogicMutater,
  TPrimitiveValInstance extends PrimitiveLogicValidation = PrimitiveLogicValidation,
  TRequestValInstance extends RequestLogicValidation = RequestLogicValidation,
  TPrimitiveHookInstance extends PrimitiveLogicHook = PrimitiveLogicHook,
  TPrimitiveProviderInstance extends PrimitiveLogicProvider = PrimitiveLogicProvider,
  TKeyDiccActionRequest extends string = string
> extends IPrimitiveCtrlContext {
  primitiveCtrl: {
    diccCriteriaRequestConfig: Record<
      TKeyDiccActionRequest,
      TPrimitiveBaseReadCriteria<
        TPrimitiveMutateInstance["dfDiccActionConfig"],
        TPrimitiveValInstance["dfDiccActionConfig"],
        TRequestValInstance["dfDiccActionConfig"],
        TPrimitiveHookInstance["dfDiccActionConfig"],
        TPrimitiveProviderInstance["dfDiccActionConfig"],
        TKeyDiccActionRequest
      > &
        TPrimitiveBaseModifyCriteria<
          TPrimitiveMutateInstance["dfDiccActionConfig"],
          TPrimitiveValInstance["dfDiccActionConfig"],
          TRequestValInstance["dfDiccActionConfig"],
          TPrimitiveHookInstance["dfDiccActionConfig"],
          TPrimitiveProviderInstance["dfDiccActionConfig"],
          TKeyDiccActionRequest
        >
    >;
  };
}
/**... */
export type Trf_IPrimitiveCtrlModuleConfig = IPrimitiveCtrlModuleConfig<
  any,
  any
>;
/**... */
export type TPrimitiveCtrlModuleConfigForPrimitive<
  TPrimitiveMutateInstance extends PrimitiveLogicMutater = PrimitiveLogicMutater,
  TPrimitiveValInstance extends PrimitiveLogicValidation = PrimitiveLogicValidation,
  TRequestValInstance extends RequestLogicValidation = RequestLogicValidation,
  TPrimitiveHookInstance extends PrimitiveLogicHook = PrimitiveLogicHook,
  TPrimitiveProviderInstance extends PrimitiveLogicProvider = PrimitiveLogicProvider,
  TKeyDiccActionRequest extends string = string
> = IPrimitiveCtrlModuleConfig<
  TPrimitiveMutateInstance,
  TPrimitiveValInstance,
  TRequestValInstance,
  TPrimitiveHookInstance,
  TPrimitiveProviderInstance,
  TKeyDiccActionRequest
>["primitiveCtrl"];
/**refactorización del tipo */
export type Trf_TPrimitiveMutateModuleConfigForPrimitive =
  TPrimitiveCtrlModuleConfigForPrimitive<any, any>;
/**esquema de configuración para metadatos
 * en contexto primitivo*/
export type TPrimitiveConfigForCtrl<
  TPrimitiveMutateInstance extends PrimitiveLogicMutater = PrimitiveLogicMutater,
  TPrimitiveValInstance extends PrimitiveLogicValidation = PrimitiveLogicValidation,
  TRequestValInstance extends RequestLogicValidation = RequestLogicValidation,
  TPrimitiveHookInstance extends PrimitiveLogicHook = PrimitiveLogicHook,
  TPrimitiveProviderInstance extends PrimitiveLogicProvider = PrimitiveLogicProvider,
  TKeyDiccActionRequest extends string = string
> = Pick<
  Partial<
    IPrimitiveCtrlModuleConfig<
      TPrimitiveMutateInstance,
      TPrimitiveValInstance,
      TRequestValInstance,
      TPrimitiveHookInstance,
      TPrimitiveProviderInstance,
      TKeyDiccActionRequest
    >
  >,
  "primitiveCtrl"
>;
/**refactorizacion del tipo */
export type Trf_TPrimitiveConfigForCtrl = TPrimitiveConfigForCtrl<any, any>;
/**claves identificadoras de acciones de petición para lectura de datos en contexto primitivo */
export type TKeyPrimitiveReadRequestCtrl = TKeyReadRequestCtrl; //opción ampliable
/**claves identificadoras de acciones de petición para lectura de datos en contexto primitivo */
export type TKeyPrimitiveModifyRequestCtrl = TKeyModifyRequestCtrl; //opción ampliable
/**tipo para unir ambos diccionarios (read y modify) de claves de peticiones */
export type TKeyPrimitiveDiccRequestCtrl<
  TKeyCustomReadRequestCtrl,
  TKeyCustomModifyRequestCtrl
> = TKeyCustomReadRequestCtrl | TKeyCustomModifyRequestCtrl;

//====Strcuture====================================================================================================================

/**contexto de ejecucion del modulo para structure*/
export type TKeyStructureCtrlModuleContext = "structureCtrl";
/**esquema de proposito general con los contextos estructurales del modulo*/
export interface IStructureDeepCtrlContext<
  TFieldCtrl = unknown, //puede ser cualquier interfaz o tipado
  TModelCtrl = unknown //puede ser cualquier interfaz o tipado
> {
  fieldCtrl: TFieldCtrl;
  modelCtrl: TModelCtrl;
}
/**clave identificadora para el contexto profundo de la estructura*/
export type TKeyStructureDeepCtrlModuleContext =
  keyof IStructureDeepCtrlContext;
/** */
export interface IStructureCtrlModuleConfig<
  TFieldMutateInstance extends FieldLogicMutater = FieldLogicMutater,
  TModelMutateInstance extends ModelLogicMutater = ModelLogicMutater,
  TFieldValInstance extends FieldLogicValidation = FieldLogicValidation,
  TModelValInstance extends ModelLogicValidation = ModelLogicValidation,
  TRequestValInstance extends RequestLogicValidation = RequestLogicValidation,
  TStructureHookInstance extends StructureLogicHook = StructureLogicHook,
  TStructureProviderInstance extends StructureLogicProvider = StructureLogicProvider,
  TKeyDiccActionRequest extends string = string
> extends IStructureDeepCtrlContext {
  /**configuración **general** para contexto de campo */
  fieldCtrl: {
    criteriaRequestConfig: TStructureFieldBaseCriteria<
      any,
      TFieldMutateInstance["dfDiccActionConfig"],
      TFieldValInstance["dfDiccActionConfig"]
    >;
  };
  /**configuracion **general** para contexto de modelo */
  modelCtrl: {
    diccCriteriaRequestConfig: Record<
      TKeyDiccActionRequest,
      TStructureModelBaseReadCriteria<
        any,
        TModelMutateInstance["dfDiccActionConfig"],
        TModelValInstance["dfDiccActionConfig"],
        TRequestValInstance["dfDiccActionConfig"],
        TStructureHookInstance["dfDiccActionConfig"],
        TStructureProviderInstance["dfDiccActionConfig"],
        TKeyDiccActionRequest
      > &
        TStructureModelBaseModifyCriteria<
          any,
          TModelMutateInstance["dfDiccActionConfig"],
          TModelValInstance["dfDiccActionConfig"],
          TRequestValInstance["dfDiccActionConfig"],
          TStructureHookInstance["dfDiccActionConfig"],
          TStructureProviderInstance["dfDiccActionConfig"],
          TKeyDiccActionRequest
        >
    >;
  };
}
/**... */
export type Trf_IStructureCtrlModuleConfig = IStructureCtrlModuleConfig<
  any,
  any,
  any
>;
/**... */
export type TStructureCtrlModuleConfigForField<
  TFieldMutateInstance extends FieldLogicMutater = FieldLogicMutater,
  TFieldValInstance extends FieldLogicValidation = FieldLogicValidation
> = IStructureCtrlModuleConfig<
  TFieldMutateInstance,
  any,
  TFieldValInstance
>["fieldCtrl"];
/**refactorizacion del tipo */
export type Trf_TStructureCtrlModuleConfigForField =
  TStructureCtrlModuleConfigForField<any>;
/**esquema de configuracion para metadatos
 * en contexto campo*/
export type TFieldConfigForCtrl<
  TFieldMutateInstance extends FieldLogicMutater = FieldLogicMutater,
  TFieldValInstance extends FieldLogicValidation = FieldLogicValidation
> = Pick<
  Partial<
    IStructureCtrlModuleConfig<TFieldMutateInstance, any, TFieldValInstance>
  >,
  "fieldCtrl"
>;
/**refactorizacion del tipo */
export type Trf_TFieldConfigForCtrl = TFieldConfigForCtrl<any>;
/**claves identificadoras de acciones de petición para lectura de datos en contexto estructurado */
export type TKeyStructureReadRequestCtrl = "readById" | TKeyReadRequestCtrl; //opción ampliable y personalizable a este contexto
/**claves identificadoras de acciones de petición para lectura de datos en contexto estructurado */
export type TKeyStructureModifyRequestCtrl = TKeyModifyRequestCtrl; //opción ampliable y personalizable a este contexto
/**tipo para unir ambos diccionarios (read y modify) de claves de peticiones */
export type TKeyStructureDiccRequestCtrl<
  TKeyCustomReadRequestCtrl,
  TKeyCustomModifyRequestCtrl
> = TKeyCustomReadRequestCtrl | TKeyCustomModifyRequestCtrl;
/**esquema de configuracion para metadatos
 * en contexto campo*/
export type TModelConfigForCtrl<
  TModelMutateInstance extends ModelLogicMutater = ModelLogicMutater,
  TModelValInstance extends ModelLogicValidation = ModelLogicValidation,
  TRequestValInstance extends RequestLogicValidation = RequestLogicValidation,
  TStructureHookInstance extends StructureLogicHook = StructureLogicHook,
  TStructureProviderInstance extends StructureLogicProvider = StructureLogicProvider,
  TKeyDiccActionRequest extends string = string
> = Pick<
  Partial<
    IStructureCtrlModuleConfig<
      any,
      TModelMutateInstance,
      any,
      TModelValInstance,
      TRequestValInstance,
      TStructureHookInstance,
      TStructureProviderInstance,
      TKeyDiccActionRequest
    >
  >,
  "modelCtrl"
>;
/**refactorizacion del tipo */
export type Trf_TModelConfigForCtrl = TModelConfigForCtrl<any, any>;
