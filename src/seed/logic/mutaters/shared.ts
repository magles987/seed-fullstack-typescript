import { PrimitiveLogicMutater } from "./primitive-mutater";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**esquema de configuracion para acciones */
interface IActionConfig<TIDiccAC> {
  /**define un array con las configuraciones
   * predefinidas para las acciones de formateo
   *
   * ____
   * ````
   * diccAcionsConfig = {
   *   accion1: true, //accion activada que no necesita configuracion
   *   accion2: { //la accion 2 esta activa
   *     //aqui la configuracion de la accion
   *   },
   *   accion3: undefined //esta accion que requiere configuracion esta deshabilitada
   *   accion4: esta
   * }
   * ````
   */
  diccActionsConfig?: Partial<TIDiccAC>;
}

//====Primitive===================================================================================================================
/**esquema de proposito general con los contextos primitivos del modulo*/
export interface IPrimitiveMutateContext<
  TPrimitiveMutate = unknown //puede ser cualquier interfaz o tipado
> {
  primitiveMutate: TPrimitiveMutate;
}
/**claves identificadoras para el contexto de ejecucion para el modulo primitive*/
export type TKeyPrimitiveMutateModuleContext = keyof IPrimitiveMutateContext;
/**esquema exclusivo de configuracion para el manejador */
export interface IPrimitiveMutateModuleConfig<TIDiccPrimitiveAC>
  extends IPrimitiveMutateContext {
  /**configuracion **general** para contexto de campo */
  primitiveMutate: IActionConfig<TIDiccPrimitiveAC> & {
    //...personalizacion
  };
}
/**refactorizacion del tipo */
export type Trf_IPrimitiveMutateModuleConfig =
  IPrimitiveMutateModuleConfig<any>;
/**... */
export type TPrimitiveMutateModuleConfigForPrimitive<TIDiccPrimitiveAC> =
  IPrimitiveMutateModuleConfig<TIDiccPrimitiveAC>["primitiveMutate"];
/**refactorizacion del tipo */
export type Trf_TPrimitiveMutateModuleConfigForPrimitive =
  TPrimitiveMutateModuleConfigForPrimitive<any>;
/**esquema de configuracion para metadatos
 * en contexto campo*/
export type TPrimitiveConfigForMutate<TIDiccPrimitiveAC> = Pick<
  Partial<IPrimitiveMutateModuleConfig<TIDiccPrimitiveAC>>,
  "primitiveMutate"
>;
/**refactorizacion del tipo */
export type Trf_TPrimitiveConfigForMutate = TPrimitiveConfigForMutate<any>;

//====Strcuture====================================================================================================================
/**clave identificadora de este modulo segun su contexto */
export type TKeyStructureMutateModuleContext = "structureMutate";
/**esquema de proposito general con los contextos profundos estructurales del modulo*/
export interface IStructureDeepMutateContext<
  TFieldMutate = unknown, //puede ser cualquier interfaz o tipado
  TModelMutate = unknown //puede ser cualquier interfaz o tipado
> {
  fieldMutate: TFieldMutate;
  modelMutate: TModelMutate;
}
/**claves identificadoras profunda para el contexto de ejecucion para el modulo structure*/
export type TKeyStructureDeepMutateModuleContext =
  keyof IStructureDeepMutateContext;
/**esquema exclusivo de configuracion base
 * (tanto para los default del modulo como
 * los metadatos) */
export interface IStructureMutateModuleConfig<TIDiccFieldAC, TIDiccModelAC>
  extends IStructureDeepMutateContext {
  /**configuracion **general** para contexto de campo */
  fieldMutate: IActionConfig<TIDiccFieldAC> & {
    //...personalizacion
  };
  /**configuracion **general** para contexto de modelo */
  modelMutate: IActionConfig<TIDiccModelAC> & {
    //...personalizacion
  };
}
/**refactorizacion del tipo */
export type Trf_IStructureMutateModuleConfig = IStructureMutateModuleConfig<
  any,
  any
>;
/**... */
export type TStructureMutateModuleConfigForField<TIDiccFieldAC> =
  IStructureMutateModuleConfig<TIDiccFieldAC, any>["fieldMutate"];
/**refactorizacion del tipo */
export type Trf_TStructureMutateModuleConfigForField =
  TStructureMutateModuleConfigForField<any>;
/**... */
export type TStructureMutateModuleConfigForModel<TIDiccModelAC> =
  IStructureMutateModuleConfig<any, TIDiccModelAC>["modelMutate"];
/**refactorizacion del tipo */
export type Trf_TStructureMutateModuleConfigForModel =
  TStructureMutateModuleConfigForModel<any>;

//Empaquetados para configuracion global:

/**esquema de configuracion para metadatos
 * en contexto campo*/
export type TFieldConfigForMutate<TIDiccFieldAC> = Pick<
  Partial<IStructureMutateModuleConfig<TIDiccFieldAC, any>>,
  "fieldMutate"
>;
/**refactorizacion del tipo */
export type Trf_TFieldConfigForMutate = TFieldConfigForMutate<any>;
/**... */
/**esquema de configuracion para metadatos
 * en contexto campo*/
export type TModelConfigForMutate<TIDiccModelAC> = Pick<
  Partial<IStructureMutateModuleConfig<any, TIDiccModelAC>>,
  "modelMutate"
>;
/**refactorizacion del tipo */
export type Trf_TModelConfigForMutate = TModelConfigForMutate<any>;
