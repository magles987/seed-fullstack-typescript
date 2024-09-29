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
export interface IPrimitiveHookContext<
  TPrimitiveHook = unknown //puede ser cualquier interfaz o tipado
> {
  primitiveHook: TPrimitiveHook;
}
/**claves identificadoras para el contexto de ejecucion para el modulo en primitive*/
export type TKeyPrimitiveHookModuleContext = keyof IPrimitiveHookContext;
/**esquema exclusivo de configuracion para el manejador */
export interface IPrimitiveHookModuleConfig<TIDiccPrimitiveAC>
  extends IPrimitiveHookContext {
  primitiveHook: IActionConfig<TIDiccPrimitiveAC> & {
    //...personalizacion
  };
}
/**refactorizacion del tipo */
export type Trf_IPrimitiveValModuleConfig = IPrimitiveHookModuleConfig<any>;
/**... */
export type TPrimitiveHookModuleConfigForPrimitive<TIDiccPrimitiveAC> =
  IPrimitiveHookModuleConfig<TIDiccPrimitiveAC>["primitiveHook"];
/**refactorizacion del tipo */
export type Trf_TPrimitiveHookModuleConfigForPrimitive =
  TPrimitiveHookModuleConfigForPrimitive<any>;
/**esquema de configuracion para metadatos
 * en contexto campo*/
export type TPrimitiveConfigForHook<TIDiccPrimitiveAC> = Pick<
  Partial<IPrimitiveHookModuleConfig<TIDiccPrimitiveAC>>,
  "primitiveHook"
>;
/**refactorizacion del tipo */
export type Trf_TPrimitiveConfigForHook = TPrimitiveConfigForHook<any>;
//====Structure===================================================================================================================
/**esquema de proposito general con los contextos estructurales del modulo*/
export interface IStructureHookContext<
  TStructureHook = unknown //puede ser cualquier interfaz o tipado
> {
  structureHook: TStructureHook;
}
/**claves identificadoras para el contexto de ejecucion para el modulo en structure*/
export type TKeyStructureHookModuleContext = keyof IStructureHookContext;
/**clave identificadora profunda para el contexto estructural */
export type TKeyStructureDeepHookModuleContext = "fieldHook" | "modelHook";
/**esquema exclusivo de configuracion base
 * (tanto para los default del modulo como
 * los metadatos) */
export interface IStructureHookModuleConfig<TIStructureDiccAC>
  extends IStructureHookContext {
  structureHook: IActionConfig<TIStructureDiccAC> & {
    //...personalizacion
  };
}
/**refactorizacion del tipo */
export type Trf_IStructureValModuleConfig = IStructureHookModuleConfig<any>;
/** */
export type TStructureHookModuleConfigForStructure<TIDiccPrimitiveAC> =
  IStructureHookModuleConfig<TIDiccPrimitiveAC>["structureHook"];
/**refactorizacion del tipo */
export type Trf_TStructureHookModuleConfigForStructure =
  TStructureHookModuleConfigForStructure<any>;
/**... */
export type TStructureConfigForHook<TIStructureDiccAC> = Partial<
  IStructureHookModuleConfig<TIStructureDiccAC>
>;
/**refactorizacion del tipo */
export type Trf_TStructureConfigForHook = TStructureConfigForHook<any>;
