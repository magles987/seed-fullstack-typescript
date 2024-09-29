//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**esquema de configuracion para acciones */
interface IActionConfig<TIDiccAC> {
  /**define undiccionario de acciones disponibles
   * para este modulo y contexto
   *
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
export interface IPrimitiveValContext<
  TPrimitiveVal = unknown, //puede ser cualquier interfaz o tipado
  TRequestVal = unknown //puede ser cualquier interfaz o tipado
> {
  primitiveVal: TPrimitiveVal;
  requestVal: TRequestVal;
}
/**claves identificadoras para el contexto de ejecucion para el modulo primitive*/
export type TKeyPrimitiveValModuleContext = keyof IPrimitiveValContext;
/**esquema exclusivo de configuracion base
 * (tanto para los default del modulo como
 * los metadatos) */
export interface IPrimitiveValModuleConfig<TIDiccPrimitiveAC, TIDiccRequestAC>
  extends IPrimitiveValContext {
  /**configuracion **general** para contexto de campo */
  primitiveVal: IActionConfig<TIDiccPrimitiveAC> & {
    //...personalizacion
  };
  /**configuracion **general** para contexto de petición */
  requestVal: IActionConfig<TIDiccRequestAC> & {
    //...personalizacion
  };
}
/**refactorizacion del tipo */
export type Trf_IPrimitiveValModuleConfig = IPrimitiveValModuleConfig<any, any>;
/**... */
export type TPrimitiveValModuleConfigForPrimitive<TIDiccPrimitiveAC> =
  IPrimitiveValModuleConfig<TIDiccPrimitiveAC, any>["primitiveVal"];
/**refactorizacion del tipo */
export type Trf_TPrimitiveValModuleConfigForPrimitive =
  TPrimitiveValModuleConfigForPrimitive<any>;
/**... */
export type TPrimitiveValModuleConfigForRequest<TIDiccRequestAC> =
  IPrimitiveValModuleConfig<any, TIDiccRequestAC>["requestVal"];
/**refactorizacion del tipo */
export type Trf_TPrimitiveValModuleConfigForRequest =
  TPrimitiveValModuleConfigForRequest<any>;
/**... */
export type TPrimitiveConfigForVal<TIDiccPrimitiveAC, TIDiccRequestAC> = Pick<
  Partial<IPrimitiveValModuleConfig<TIDiccPrimitiveAC, TIDiccRequestAC>>,
  "primitiveVal" | "requestVal"
>;
/**refactorizacion del tipo */
export type Trf_TPrimitiveConfigForVal = TPrimitiveConfigForVal<any, any>;
//====Structure===================================================================================================================
/**clave identificadora de este modulo segun su contexto */
export type TKeyStructureValModuleContext = "structureVal";
/**esquema de proposito general con los contextos profundos estructurales del modulo*/
export interface IStructureDeepValContext<
  TFieldVal = unknown, //puede ser cualquier interfaz o tipado
  TModelVal = unknown, //puede ser cualquier interfaz o tipado
  TRequestVal = unknown //puede ser cualquier interfaz o tipado
> {
  fieldVal: TFieldVal;
  modelVal: TModelVal;
  requestVal: TRequestVal;
}
/**claves identificadoras para el contexto profundo de ejecucion para el modulo structure*/
export type TKeyStructureDeepValModuleContext = keyof IStructureDeepValContext;
/**esquema exclusivo de configuracion base
 * (tanto para los default del modulo como
 * los metadatos) */
export interface IStructureValModuleConfig<
  TIDiccFieldAC,
  TIDiccModelAC,
  TIDiccRequestAC
> extends IStructureDeepValContext {
  /**configuracion **general** para contexto de campo */
  fieldVal: IActionConfig<TIDiccFieldAC> & {
    //...personalizacion
  };
  /**configuracion **general** para contexto de modelo */
  modelVal: IActionConfig<TIDiccModelAC> & {
    //...personalizacion
  };
  /**configuracion **general** para contexto de petición */
  requestVal: IActionConfig<TIDiccRequestAC> & {
    //...personalizacion
  };
}
/**refactorizacion del tipo */
export type Trf_IStructureValModuleConfig = IStructureValModuleConfig<
  any,
  any,
  any
>;

/**... */
export type TStructureValModuleConfigForField<TIDiccFieldAC> =
  IStructureValModuleConfig<TIDiccFieldAC, any, any>["fieldVal"];
/**refactorizacion del tipo */
export type Trf_TStructureValModuleConfigForField =
  TStructureValModuleConfigForField<any>;
/**... */
export type TStructureValModuleConfigForModel<TIDiccModelAC> =
  IStructureValModuleConfig<any, TIDiccModelAC, any>["modelVal"];
/**refactorizacion del tipo */
export type Trf_TStructureValModuleConfigForModel =
  TStructureValModuleConfigForModel<any>;
/**... */
export type TStructureValModuleConfigForRequest<TIDiccRequestAC> =
  IStructureValModuleConfig<any, any, TIDiccRequestAC>["requestVal"];
/**refactorizacion del tipo */
export type Trf_TStructureValModuleConfigForRequest =
  TStructureValModuleConfigForRequest<any>;
/**esquema de configuracion para metadatos
 * en contexto campo*/
export type TFieldConfigForVal<TIDiccFieldAC> = Pick<
  Partial<IStructureValModuleConfig<TIDiccFieldAC, any, any>>,
  "fieldVal"
>;
/**refactorizacion del tipo */
export type Trf_TFieldConfigForVal = TFieldConfigForVal<any>;
/**... */
export type TModelConfigForVal<TIDiccModelAC, TIDiccRequestAC> = Pick<
  Partial<IStructureValModuleConfig<any, TIDiccModelAC, TIDiccRequestAC>>,
  "modelVal" | "requestVal"
>;
/**refactorizacion del tipo */
export type Trf_TModelConfigForVal = TModelConfigForVal<any, any>;
