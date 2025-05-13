import { PrimitiveLogicProvider } from "./primitive-provider";
import { StructureLogicProvider } from "./structure-provider";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████

//====Primitive===================================================================================================================
/**esquema de propósito general con los contextos primitivos del modulo*/
export interface IPrimitiveProviderContext<
  TPrimitiveProvider = unknown //puede ser cualquier interfaz o tipado
> {
  primitiveProvider: TPrimitiveProvider;
}
/**claves identificadoras para el contexto de ejecucion para el modulo en primitive*/
export type TKeyPrimitiveProviderModuleContext =
  keyof IPrimitiveProviderContext;
/**esquema exclusivo de configuración para el manejador */
export interface IPrimitiveProviderContextInstance<
  TPrimitiveProviderInstance extends PrimitiveLogicProvider = PrimitiveLogicProvider
> extends IPrimitiveProviderContext<TPrimitiveProviderInstance> {}
/**refactorización del tipo */
export type Trf_IPrimitiveProviderContextInstance =
  IPrimitiveProviderContextInstance<any>;
/** */
export type TPrimitiveProviderBaseConfig = Partial<
  Pick<
    ReturnType<PrimitiveLogicProvider["getDefault"]>,
    "diccActionConfig" | "topMandatoryKeysAction" | "topPriorityKeysAction"
  >
> &
  Pick<
    ReturnType<PrimitiveLogicProvider["getDefault"]>,
    "driverList" //❗obligatorio❗
  >;
/** */
export type TPrimitiveProviderDiccACForCriteria<TIDiccPrimitiveProviderAC> =
  IPrimitiveProviderContext<
    Partial<
      | TIDiccPrimitiveProviderAC
      //❗Tipado que permite desactivar la acción, controller no la ejecuta❗
      | Record<keyof TIDiccPrimitiveProviderAC, null>
    >
  >;

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
export type TKeyStructureDeepProviderModuleContext =
  | "fieldProvider"
  | "modelProvider";
/**esquema exclusivo de configuración para el manejador */
export interface IStructureProviderContextInstance<
  TStructureProviderInstance extends StructureLogicProvider = StructureLogicProvider
> extends IStructureProviderContext<TStructureProviderInstance> {}
/**refactorización del tipo */
export type Trf_IStructureProviderContextInstance =
  IStructureProviderContextInstance<any>;
/** */
export type TStructureProviderBaseConfig = Partial<
  Pick<
    ReturnType<StructureLogicProvider["getDefault"]>,
    "diccActionConfig" | "topMandatoryKeysAction" | "topPriorityKeysAction"
  >
> &
  Pick<
    ReturnType<StructureLogicProvider["getDefault"]>,
    "driverList" //❗obligatorio❗
  >;
/** */
export type TStructureModelProviderDiccACForCriteria<
  TIDiccStructureProviderAC
> = Pick<
  IStructureProviderContext<
    Partial<
      | TIDiccStructureProviderAC
      //❗Tipado que permite desactivar la acción, controller no la ejecuta❗
      | Record<keyof TIDiccStructureProviderAC, null>
    >
  >,
  "structureProvider"
>;
