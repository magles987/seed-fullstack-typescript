//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**esquema de configuracion para acciones */
interface IActionConfig<TIDiccAC> {
  /**define undiccionario de acciones disponibles
   * para este modulo y contexto
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
export interface IPrimitiveProviderContext<
  TPrimitiveProvider = unknown //puede ser cualquier interfaz o tipado
> {
  primitiveProvider: TPrimitiveProvider;
}
/**claves identificadoras para el contexto de ejecucion para el modulo en primitive*/
export type TKeyPrimitiveProviderModuleContext =
  keyof IPrimitiveProviderContext;
/**esquema exclusivo de configuracion para el manejador */
export interface IPrimitiveProviderModuleConfig<TIDiccPrimitiveAC>
  extends IPrimitiveProviderContext {
  primitiveProvider: IActionConfig<TIDiccPrimitiveAC> & {
    //...personalizacion
  };
}
/**refactorizacion del tipo */
export type Trf_IPrimitiveValModuleConfig = IPrimitiveProviderModuleConfig<any>;
/**... */
export type TPrimitiveProviderModuleConfigForPrimitive<TIDiccPrimitiveAC> =
  IPrimitiveProviderModuleConfig<TIDiccPrimitiveAC>["primitiveProvider"];
/**refactorizacion del tipo */
export type Trf_TPrimitiveProviderModuleConfigForPrimitive =
  TPrimitiveProviderModuleConfigForPrimitive<any>;
/**... */
export type TPrimitiveConfigForProvider<TIDiccPrimitiveAC> = Pick<
  Partial<IPrimitiveProviderModuleConfig<TIDiccPrimitiveAC>>,
  "primitiveProvider"
>;
/**refactorizacion del tipo */
export type Trf_TPrimitiveConfigForProvider = TPrimitiveConfigForProvider<any>;

//====Structure===================================================================================================================
/**esquema de proposito general con los contextos estructurales del modulo*/
export interface IStructureProviderContext<
  TStructureProvider = unknown //puede ser cualquier interfaz o tipado
> {
  structureProvider: TStructureProvider;
}
/**claves identificadoras para el contexto de ejecucion para el modulo en structure*/
export type TKeyStructureProviderModuleContext =
  keyof IStructureProviderContext;
/**clave identificadora profunda para el contexto estructural */
export type TKeyStructureDeeProviderkModuleContext =
  | "fieldProvider"
  | "modelProvider";
/**esquema exclusivo de configuracion para el manejador */
export interface IStructureProviderModuleConfig<TIStructureDiccAC>
  extends IStructureProviderContext {
  structureProvider: IActionConfig<TIStructureDiccAC> & {
    //...personalizacion
  };
}
/**refactorizacion del tipo */
export type Trf_IStructureValModuleConfig = IStructureProviderModuleConfig<any>;
/** */
export type TStructureProviderModuleConfigForStructure<TIDiccPrimitiveAC> =
  IStructureProviderModuleConfig<TIDiccPrimitiveAC>["structureProvider"];
/**refactorizacion del tipo */
export type Trf_TStructureProviderModuleConfigForStructure =
  TStructureProviderModuleConfigForStructure<any>;
/**... */
export type TModelConfigForProvider<TIStructureDiccAC> = Partial<
  IStructureProviderModuleConfig<TIStructureDiccAC>
>;
/**refactorizacion del tipo */
export type Trf_TModelConfigForProvider = TModelConfigForProvider<any>;
