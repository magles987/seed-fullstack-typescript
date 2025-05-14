import { PrimitiveLogicHook } from "./primitive-hook";
import { StructureLogicHook } from "./structure-hook";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████

//====Primitive===================================================================================================================

/**esquema de propósito general con los contextos primitivos del modulo*/
export interface IPrimitiveHookContext<
  TPrimitiveHook = unknown //puede ser cualquier interfaz o tipado
> {
  /** */
  primitiveHook: TPrimitiveHook;
}
/**claves identificadoras para el contexto de ejecución para el modulo en primitive*/
export type TKeyPrimitiveHookModuleContext = keyof IPrimitiveHookContext;
/**esquema exclusivo de configuración para el manejador */
export interface IPrimitiveHookContextInstance<
  TPrimitiveHookInstance extends PrimitiveLogicHook = PrimitiveLogicHook
> extends IPrimitiveHookContext<TPrimitiveHookInstance> {}
/**refactorización del tipo */
export type Trf_IPrimitiveHookContextInstance =
  IPrimitiveHookContextInstance<any>;
/** */
export type TPrimitiveHookBaseConfig = Partial<
  Pick<
    ReturnType<PrimitiveLogicHook["getDefault"]>,
    "diccActionConfig" | "topMandatoryKeysAction" | "topPriorityKeysAction"
  >
>;
/** */
export type TPrimitiveHookDiccACForCriteria<TIDiccPrimitiveHookAC> =
  IPrimitiveHookContext<
    Partial<
      | TIDiccPrimitiveHookAC
      //❗Tipado que permite desactivar la acción, controller no la ejecuta❗
      | Record<keyof TIDiccPrimitiveHookAC, null>
    >
  >;

//====Structure===================================================================================================================

/**esquema de propósito general con los contextos estructurales del modulo*/
export interface IStructureHookContext<
  TStructureHook = unknown //puede ser cualquier interfaz o tipado
> {
  structureHook: TStructureHook;
}
/**claves identificadoras para el contexto de ejecucion para el modulo en structure*/
export type TKeyStructureHookModuleContext = keyof IStructureHookContext;
/**clave identificadora profunda para el contexto estructural */
export type TKeyStructureDeepHookModuleContext = "fieldHook" | "modelHook";
/**esquema exclusivo de configuración base
 * (tanto para los default del modulo como
 * los metadatos) */
export interface IStructureHookContextInstance<
  TStructureHookInstance extends StructureLogicHook = StructureLogicHook
> extends IStructureHookContext<TStructureHookInstance> {}
/**refactorización del tipo */
export type Trf_IStructureHookContextInstance =
  IStructureHookContextInstance<any>;
/** */
export type TStructureHookBaseConfig = Partial<
  Pick<
    ReturnType<StructureLogicHook["getDefault"]>,
    "diccActionConfig" | "topMandatoryKeysAction" | "topPriorityKeysAction"
  >
>;
/** */
export type TStructureModelHookDiccACForCriteria<TIDiccStructureHookAC> = Pick<
  IStructureHookContext<
    Partial<
      | TIDiccStructureHookAC
      //❗Tipado que permite desactivar la acción, controller no la ejecuta❗
      | Record<keyof TIDiccStructureHookAC, null>
    >
  >,
  "structureHook"
>;
