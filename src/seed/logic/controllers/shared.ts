import {
  TPrimitiveBaseCriteria,
  TPrimitiveBaseModifyCriteria,
  TPrimitiveBaseReadCriteria,
  TStructureFieldBaseCriteria,
  TStructureModelBaseCriteria,
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
/**funcion asyncrona generica que recibe el bag de una peticion,
 * esta funcion será implementada en las peticiones del controller
 * ____
 * @param bag el objeto contenedor de
 * toda la configuracion necesaria para
 * construir un bag interno en la peticion
 * ____
 * @return Promesa con el reporte de respuesta de
 * la ejecucion de la accion
 */
export type TPrimitiveCtrlActionFn<
  TValue,
  TPrimitiveMutateInstance extends PrimitiveLogicMutater = PrimitiveLogicMutater,
  TPrimitiveValInstance extends PrimitiveLogicValidation = PrimitiveLogicValidation,
  TRequestValInstance extends RequestLogicValidation = RequestLogicValidation,
  TPrimitiveHookInstance extends PrimitiveLogicHook = PrimitiveLogicHook,
  TPrimitiveProviderInstance extends PrimitiveLogicProvider = PrimitiveLogicProvider,
  TKeyDiccActionRequest extends string = string
> =
  //método para lectura
  | ((
      criteriaHandler:
        | TPrimitiveBaseReadCriteria<
            TPrimitiveMutateInstance["dfDiccActionConfig"],
            TPrimitiveValInstance["dfDiccActionConfig"],
            TRequestValInstance["dfDiccActionConfig"],
            TPrimitiveHookInstance["dfDiccActionConfig"],
            TPrimitiveProviderInstance["dfDiccActionConfig"]
          >
        | TPrimitiveBaseModifyCriteria<
            TPrimitiveMutateInstance["dfDiccActionConfig"],
            TPrimitiveValInstance["dfDiccActionConfig"],
            TRequestValInstance["dfDiccActionConfig"],
            TPrimitiveHookInstance["dfDiccActionConfig"],
            TPrimitiveProviderInstance["dfDiccActionConfig"]
          >,
      singleDataQ?: any //valor no definido para primitivos
    ) => Promise<IPrimitiveResponse>)
  //método para modificación
  | ((
      criteriaHandler:
        | TPrimitiveBaseReadCriteria<
            TPrimitiveMutateInstance["dfDiccActionConfig"],
            TPrimitiveValInstance["dfDiccActionConfig"],
            TRequestValInstance["dfDiccActionConfig"],
            TPrimitiveHookInstance["dfDiccActionConfig"],
            TPrimitiveProviderInstance["dfDiccActionConfig"]
          >
        | TPrimitiveBaseModifyCriteria<
            TPrimitiveMutateInstance["dfDiccActionConfig"],
            TPrimitiveValInstance["dfDiccActionConfig"],
            TRequestValInstance["dfDiccActionConfig"],
            TPrimitiveHookInstance["dfDiccActionConfig"],
            TPrimitiveProviderInstance["dfDiccActionConfig"]
          >,
      data: Partial<TValue>
    ) => Promise<IPrimitiveResponse>);

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
/**... */
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
/**funcion asyncrona genérica que recibe el bag de una peticion,
 * esta función será implementada en las peticiones del controller
 * ____
 * @param bag el objeto contenedor de
 * toda la configuracion necesaria para
 * construir un bag interno en la peticion
 * ____
 * @return Promesa con el reporte de respuesta de
 * la ejecucion de la accion
 */
export type TFieldCtrlActionFn<
  TModel,
  TFieldMutateInstance extends FieldLogicMutater = FieldLogicMutater,
  TFieldValInstance extends FieldLogicValidation = FieldLogicValidation
> = (
  criteriaHandler: TStructureFieldBaseCriteria<
    TModel,
    TFieldMutateInstance["dfDiccActionConfig"],
    TFieldValInstance["dfDiccActionConfig"]
  >,
  data: any
) => Promise<IStructureResponse>;
/**funcion asyncrona generica que recibe el bag de una petición,
 * esta funcion será implementada en las peticiones del controller
 * ____
 * @param bag el objeto contenedor de
 * toda la configuración necesaria para
 * construir un bag interno en la petición
 * ____
 * @return Promesa con el reporte de respuesta de
 * la ejecución de la acción
 */
export type TModelCtrlActionFn<
  TModel,
  TModelMutateInstance extends ModelLogicMutater = ModelLogicMutater,
  TModelValInstance extends ModelLogicValidation = ModelLogicValidation,
  TRequestValInstance extends RequestLogicValidation = RequestLogicValidation,
  TStructureHookInstance extends StructureLogicHook = StructureLogicHook,
  TStructureProviderInstance extends StructureLogicProvider = StructureLogicProvider,
  TKeyDiccActionRequest extends string = string
> =
  //método para lectura
  | ((
      criteriaHandler:
        | TStructureModelBaseReadCriteria<
            TModel,
            TModelMutateInstance["dfDiccActionConfig"],
            TModelValInstance["dfDiccActionConfig"],
            TRequestValInstance["dfDiccActionConfig"],
            TStructureHookInstance["dfDiccActionConfig"],
            TStructureProviderInstance["dfDiccActionConfig"],
            TKeyDiccActionRequest
          >
        | TStructureModelBaseModifyCriteria<
            TModel,
            TModelMutateInstance["dfDiccActionConfig"],
            TModelValInstance["dfDiccActionConfig"],
            TRequestValInstance["dfDiccActionConfig"],
            TStructureHookInstance["dfDiccActionConfig"],
            TStructureProviderInstance["dfDiccActionConfig"],
            TKeyDiccActionRequest
          >,
      singleDataQ?: Partial<TModel>
    ) => Promise<IStructureResponse>)
  //método para modificación
  | ((
      criteriaHandler:
        | TStructureModelBaseReadCriteria<
            TModel,
            TModelMutateInstance["dfDiccActionConfig"],
            TModelValInstance["dfDiccActionConfig"],
            TRequestValInstance["dfDiccActionConfig"],
            TStructureHookInstance["dfDiccActionConfig"],
            TStructureProviderInstance["dfDiccActionConfig"],
            TKeyDiccActionRequest
          >
        | TStructureModelBaseModifyCriteria<
            TModel,
            TModelMutateInstance["dfDiccActionConfig"],
            TModelValInstance["dfDiccActionConfig"],
            TRequestValInstance["dfDiccActionConfig"],
            TStructureHookInstance["dfDiccActionConfig"],
            TStructureProviderInstance["dfDiccActionConfig"],
            TKeyDiccActionRequest
          >,
      data: Partial<TModel>
    ) => Promise<IStructureResponse>);
