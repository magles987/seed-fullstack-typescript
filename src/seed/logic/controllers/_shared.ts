import {
  TPrimitiveBaseCriteriaForCtrlModify,
  TPrimitiveBaseCriteriaForCtrlRead,
  TStructureBaseCriteriaForCtrlField,
  TStructureBaseCriteriaForCtrlModify,
  TStructureBaseCriteriaForCtrlRead,
} from "../criterias/shared";
import { IDiccPrimitiveHookActionConfigG } from "../hooks/primitive-hook";
import { IDiccStructureHookActionConfigG } from "../hooks/structure-hook";
import {
  TKeyFieldInternalACModuleContext,
  TKeyModelInternalACModuleContext,
  TKeyPrimitiveInternalACModuleContext,
} from "../meta/metadata-shared";
import { IDiccFieldMutateActionConfigG } from "../mutaters/field-mutater";
import { IDiccModelMutateActionConfigG } from "../mutaters/model-mutater";
import { IDiccPrimitiveMutateActionConfigG } from "../mutaters/primitive-mutater";
import { IDiccPrimitiveProviderActionConfigG } from "../providers/primitive-provider";
import { IDiccStructureProviderActionConfigG } from "../providers/structure-provider";
import { IPrimitiveResponse, IStructureResponse } from "../reports/shared";
import { IDiccFieldValActionConfigG } from "../validators/field-validation";
import { IDiccModelValActionConfigG } from "../validators/model-validation";
import { IDiccPrimitiveValActionConfigG } from "../validators/primitive-validation";
import { IDiccRequestValActionConfigG } from "../validators/request-validation";

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
  TIDiccGlobalModelAC,
  TKeyDiccActionRequest extends string
> extends IPrimitiveCtrlContext {
  primitiveCtrl: {
    diccATKeyCRUD: Record<
      TKeyDiccActionRequest,
      Array<
        [
          //keyGlobalModuloContext:
          TKeyPrimitiveInternalACModuleContext,
          keyof TIDiccGlobalModelAC
        ]
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
  TIDiccGlobalModelAC,
  TKeyDiccActionRequest extends string
> = IPrimitiveCtrlModuleConfig<
  TIDiccGlobalModelAC,
  TKeyDiccActionRequest
>["primitiveCtrl"];
/**refactorizacion del tipo */
export type Trf_TPrimitiveMutateModuleConfigForPrimitive =
  TPrimitiveCtrlModuleConfigForPrimitive<any, any>;
/**esquema de configuracion para metadatos
 * en contexto primitivo*/
export type TPrimitiveConfigForCtrl<
  TIDiccGlobalModelAC,
  TKeyDiccActionRequest extends string
> = Pick<
  Partial<
    IPrimitiveCtrlModuleConfig<TIDiccGlobalModelAC, TKeyDiccActionRequest>
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
  TIDiccPrimitiveMutateAC extends IDiccPrimitiveMutateActionConfigG = IDiccPrimitiveMutateActionConfigG,
  TIDiccPrimitiveValAC extends IDiccPrimitiveValActionConfigG = IDiccPrimitiveValActionConfigG,
  TIDiccRequestValAC extends IDiccRequestValActionConfigG = IDiccRequestValActionConfigG,
  TIDiccPrimitiveHookAC extends IDiccPrimitiveHookActionConfigG = IDiccPrimitiveHookActionConfigG,
  TIDiccPrimitiveProviderAC extends IDiccPrimitiveProviderActionConfigG = IDiccPrimitiveProviderActionConfigG
> =
  //método para lectura
  | ((
      criteriaHandler:
        | TPrimitiveBaseCriteriaForCtrlRead<
            TIDiccPrimitiveMutateAC,
            TIDiccPrimitiveValAC,
            TIDiccRequestValAC,
            TIDiccPrimitiveHookAC,
            TIDiccPrimitiveProviderAC
          >
        | TPrimitiveBaseCriteriaForCtrlModify<
            TIDiccPrimitiveMutateAC,
            TIDiccPrimitiveValAC,
            TIDiccRequestValAC,
            TIDiccPrimitiveHookAC,
            TIDiccPrimitiveProviderAC
          >,
      singleDataQ?: any //valor no definido para primitivos
    ) => Promise<IPrimitiveResponse>)
  //método para modificación
  | ((
      criteriaHandler:
        | TPrimitiveBaseCriteriaForCtrlRead<
            TIDiccPrimitiveMutateAC,
            TIDiccPrimitiveValAC,
            TIDiccRequestValAC,
            TIDiccPrimitiveHookAC,
            TIDiccPrimitiveProviderAC
          >
        | TPrimitiveBaseCriteriaForCtrlModify<
            TIDiccPrimitiveMutateAC,
            TIDiccPrimitiveValAC,
            TIDiccRequestValAC,
            TIDiccPrimitiveHookAC,
            TIDiccPrimitiveProviderAC
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
  TIDiccGlobalFieldAC,
  TIDiccGlobalModelAC,
  TKeyDiccActionRequest extends string
> extends IStructureDeepCtrlContext {
  /**configuracion **general** para contexto de campo */
  fieldCtrl: {
    aTKeysActionRequest: Array<
      [
        //keyGlobalModuloContext:
        TKeyFieldInternalACModuleContext,
        keyof TIDiccGlobalFieldAC
      ]
    >;
  };
  /**configuracion **general** para contexto de modelo */
  modelCtrl: {
    diccATKeysActionRequest: Partial<
      Record<
        TKeyDiccActionRequest,
        Array<
          [
            //keyGlobalModuloContext:
            TKeyModelInternalACModuleContext,
            keyof TIDiccGlobalModelAC
          ]
        >
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
export type TStructureCtrlModuleConfigForField<TIDiccGlobalFieldAC> =
  IStructureCtrlModuleConfig<TIDiccGlobalFieldAC, any, any>["fieldCtrl"];
/**refactorizacion del tipo */
export type Trf_TStructureCtrlModuleConfigForField =
  TStructureCtrlModuleConfigForField<any>;
/**esquema de configuracion para metadatos
 * en contexto campo*/
export type TFieldConfigForCtrl<TIDiccGlobalFieldAC> = Pick<
  Partial<IStructureCtrlModuleConfig<TIDiccGlobalFieldAC, any, any>>,
  "fieldCtrl"
>;
/**refactorizacion del tipo */
export type Trf_TFieldConfigForCtrl = TFieldConfigForCtrl<any>;
/**... */
/**esquema de configuracion para metadatos
 * en contexto campo*/
export type TModelConfigForCtrl<
  TIDiccGlobalModelAC,
  TKeyDiccActionRequest extends string
> = Pick<
  Partial<
    IStructureCtrlModuleConfig<any, TIDiccGlobalModelAC, TKeyDiccActionRequest>
  >,
  "modelCtrl"
>;
/**refactorizacion del tipo */
export type Trf_TModelConfigForCtrl = TModelConfigForCtrl<any, any>;
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
export type TFieldCtrlActionFn<
  TModel,
  TIDiccFieldMutateAC extends IDiccFieldMutateActionConfigG = IDiccFieldMutateActionConfigG,
  TIDiccFieldValAC extends IDiccFieldValActionConfigG = IDiccFieldValActionConfigG
> = (
  criteriaHandler: TStructureBaseCriteriaForCtrlField<
    TModel,
    TIDiccFieldMutateAC,
    TIDiccFieldValAC
  >,
  data: any
) => Promise<IStructureResponse>;
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
export type TModelCtrlActionFn<
  TModel,
  TIDiccModelMutateAC extends IDiccModelMutateActionConfigG = IDiccModelMutateActionConfigG,
  TIDiccModelValAC extends IDiccModelValActionConfigG = IDiccModelValActionConfigG,
  TIDiccRequestValAC extends IDiccRequestValActionConfigG = IDiccRequestValActionConfigG,
  TIDiccStructureHookAC extends IDiccStructureHookActionConfigG = IDiccStructureHookActionConfigG,
  TIDiccStructureProviderAC extends IDiccStructureProviderActionConfigG = IDiccStructureProviderActionConfigG
> =
  //método para lectura
  | ((
      criteriaHandler:
        | TStructureBaseCriteriaForCtrlRead<
            TModel,
            TIDiccModelMutateAC,
            TIDiccModelValAC,
            TIDiccRequestValAC,
            TIDiccStructureHookAC,
            TIDiccStructureProviderAC
          >
        | TStructureBaseCriteriaForCtrlModify<
            TModel,
            TIDiccModelMutateAC,
            TIDiccModelValAC,
            TIDiccRequestValAC,
            TIDiccStructureHookAC,
            TIDiccStructureProviderAC
          >,
      singleDataQ?: Partial<TModel>
    ) => Promise<IStructureResponse>)
  //método para modificación
  | ((
      criteriaHandler:
        | TStructureBaseCriteriaForCtrlRead<
            TModel,
            TIDiccModelMutateAC,
            TIDiccModelValAC,
            TIDiccRequestValAC,
            TIDiccStructureHookAC,
            TIDiccStructureProviderAC
          >
        | TStructureBaseCriteriaForCtrlModify<
            TModel,
            TIDiccModelMutateAC,
            TIDiccModelValAC,
            TIDiccRequestValAC,
            TIDiccStructureHookAC,
            TIDiccStructureProviderAC
          >,
      data: Partial<TModel>
    ) => Promise<IStructureResponse>);
