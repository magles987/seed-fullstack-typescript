import {
  IPrimitiveResponse,
  IResponse,
  IStructureResponse,
} from "../reports/shared";
import { IDiccFieldMutateActionConfigG } from "../mutaters/field-mutater";
import { IDiccModelMutateActionConfigG } from "../mutaters/model-mutater";
import { IDiccFieldValActionConfigG } from "../validators/field-validation";
import { IDiccModelValActionConfigG } from "../validators/model-validation";
import { IDiccRequestValActionConfigG } from "../validators/request-validation";
import { IMiddlewareReportStatus } from "../middleware/module/shared";
import {
  TGenericTupleActionConfig,
  TKeyActionModule,
} from "../config/shared-modules";
import {
  TKeyPrimitiveMutateModuleContext,
  TKeyStructureDeepMutateModuleContext,
} from "../mutaters/shared";
import {
  TKeyPrimitiveValModuleContext,
  TKeyStructureDeepValModuleContext,
} from "../validators/shared";
import {
  TKeyPrimitiveHookModuleContext,
  TKeyStructureHookModuleContext,
} from "../hooks/shared";
import { IDiccPrimitiveHookActionConfigG } from "../hooks/primitive-hook";
import { IDiccPrimitiveMutateActionConfigG } from "../mutaters/primitive-mutater";
import { IDiccPrimitiveValActionConfigG } from "../validators/primitive-validation";
import { IDiccStructureHookActionConfigG } from "../hooks/structure-hook";
import { PrimitiveCriteriaHandler } from "../criterias/primitive-criteria-handler";
import { StructureCriteriaHandler } from "../criterias/structure-criteria-handler";
import { IDiccStructureProviderActionConfigG } from "../providers/structure-provider";
import {
  TKeyPrimitiveProviderModuleContext,
  TKeyStructureProviderModuleContext,
} from "../providers/shared";
import { IDiccPrimitiveProviderActionConfigG } from "../providers/primitive-provider";
import { ActionModule, IBuildACOption } from "../config/module";
import {
  IModifyCriteria,
  IPrimitiveModifyCriteria,
  IPrimitiveReadCriteria,
  IReadCriteria,
  IStructureModifyCriteria,
  IStructureReadCriteria,
} from "../criterias/shared";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** */
export interface IBagModule<TData> {
  /**clave identificadora del recurso*/
  keySrc: string;
  /**dato a procesar en cada modulo ⚠Posiblemente mutable⚠ */
  data: TData; //actualizable
  /**respuestas embebidas */
  responses: Array<IResponse>;
  /**objeto literal de criterios de peticion (no es el manejador) */
  literalCriteria: IReadCriteria | IModifyCriteria;
  /**array con el global de las acciones de todos los
   * modulos en orden de ejecucion */
  aTupleGlobalActionConfig: Array<[string, unknown]>;
  /**reporte del estado actual del middleware */
  middlewareReportStatus: IMiddlewareReportStatus;
}
/**... */
export interface ISchemaSingleBuildGlobalAction<TKeyGlobalAction, TGlobalAC> {
  actionModule?: ActionModule<any>;
  keyAction: TKeyGlobalAction;
  actionConfig: TGlobalAC;
  builderACOption: IBuildACOption;
}
/**tipado especial para almacenamiento de tuplas
 * ⚠ Es debilmente tipado usar con precaucion
 */
export type TATupleGlobalDiccAC<TDiccAC> = Array<
  [string, TGenericTupleActionConfig<TDiccAC>]
>;
/**diccionario de claves identificadoras que componen
 * la clave global de una accion */
export interface IDiccKeyGlobalContextAction<TIDiccGlobalAC> {
  keyModule: TKeyActionModule;
  keyModuleContext: unknown;
  keyAction: keyof TIDiccGlobalAC;
}
/**claves identificadoras que componen la clave global de una accion */
export type TKeysGlobal = keyof IDiccKeyGlobalContextAction<any>;
//====Primitive============================================================================================================================
/**clave identificadora de este modulo segun su contexto */
export type TKeyPrimitiveBagModuleContext = "primitiveBag";
/** */
export interface IPrimitiveDiccKeyGlobalContextAction<TIDiccGlobalAC>
  extends IDiccKeyGlobalContextAction<TIDiccGlobalAC> {
  keyModuleContext:
    | TKeyPrimitiveMutateModuleContext
    | TKeyPrimitiveValModuleContext
    | TKeyPrimitiveHookModuleContext
    | TKeyPrimitiveProviderModuleContext;
}
/** */
export type TPrimitiveKeysGlobal =
  keyof IPrimitiveDiccKeyGlobalContextAction<any>;
/**refactorizacion especial del array
 * de acciones globales para el contexto
 * estructurado */
export type TPrimitiveATupleGlobalDiccAC<
  TIDiccPrimitiveMutateAC extends IDiccPrimitiveMutateActionConfigG = IDiccPrimitiveMutateActionConfigG,
  TIDiccPrimitiveValAC extends IDiccPrimitiveValActionConfigG = IDiccPrimitiveValActionConfigG,
  TIDiccRequestValAC extends IDiccRequestValActionConfigG = IDiccRequestValActionConfigG,
  TIDiccPrimitiveHookAC extends IDiccPrimitiveHookActionConfigG = IDiccPrimitiveHookActionConfigG,
  TIDiccPrimitiveProviderAC extends IDiccPrimitiveProviderActionConfigG = IDiccPrimitiveProviderActionConfigG
> = TATupleGlobalDiccAC<
  TIDiccPrimitiveMutateAC &
    TIDiccPrimitiveValAC &
    TIDiccRequestValAC &
    TIDiccPrimitiveHookAC &
    TIDiccPrimitiveProviderAC
>;
/**... */
export interface IPrimitiveBag<
  TValue,
  TIDiccPrimitiveMutateAC extends IDiccPrimitiveMutateActionConfigG = IDiccPrimitiveMutateActionConfigG,
  TIDiccPrimitiveValAC extends IDiccPrimitiveValActionConfigG = IDiccPrimitiveValActionConfigG,
  TIDiccRequestValAC extends IDiccRequestValActionConfigG = IDiccRequestValActionConfigG,
  TIDiccPrimitiveHookAC extends IDiccPrimitiveHookActionConfigG = IDiccPrimitiveHookActionConfigG,
  TIDiccPrimitiveProviderAC extends IDiccPrimitiveProviderActionConfigG = IDiccPrimitiveProviderActionConfigG
> extends IBagModule<TValue> {
  literalCriteria: IPrimitiveReadCriteria | IPrimitiveModifyCriteria;
  aTupleGlobalActionConfig: TPrimitiveATupleGlobalDiccAC<
    TIDiccPrimitiveMutateAC,
    TIDiccPrimitiveValAC,
    TIDiccRequestValAC,
    TIDiccPrimitiveHookAC,
    TIDiccPrimitiveProviderAC
  >;
  responses: Array<IPrimitiveResponse>;
}
/**... */
export type Trf_IPrimitiveBag = IPrimitiveBag<any, any, any, any, any, any>;

//====Structure============================================================================================================================
/**clave identificadora de este modulo segun su contexto */
export type TKeyStructureBagModuleContext = "structureBag";
/**clave identificadora profunda para el contexto estructural */
export type TKeyStructureDeepBagModuleContext = "fieldBag" | "modelBag";
/** */
export interface IStructureDiccKeyGlobalContextAction<TIDiccGlobalAC>
  extends IDiccKeyGlobalContextAction<TIDiccGlobalAC> {
  keyModuleContext:
    | TKeyStructureDeepMutateModuleContext
    | TKeyStructureDeepValModuleContext
    | TKeyStructureHookModuleContext
    | TKeyStructureProviderModuleContext;
}
/** */
export type TStructureKeysGlobal =
  keyof IStructureDiccKeyGlobalContextAction<any>;
/**refactorizacion especial del array
 * de acciones globales para el contexto
 * estructurado */
export type TStructureATupleGlobalDiccAC<
  TIDiccFieldMutateAC extends IDiccFieldMutateActionConfigG = IDiccFieldMutateActionConfigG,
  TIDiccModelMutateAC extends IDiccModelMutateActionConfigG = IDiccModelMutateActionConfigG,
  TIDiccFieldValAC extends IDiccFieldValActionConfigG = IDiccFieldValActionConfigG,
  TIDiccModelValAC extends IDiccModelValActionConfigG = IDiccModelValActionConfigG,
  TIDiccRequestValAC extends IDiccRequestValActionConfigG = IDiccRequestValActionConfigG,
  TIDiccStructureHookAC extends IDiccStructureHookActionConfigG = IDiccStructureHookActionConfigG,
  TIDiccStructureProviderAC extends IDiccStructureProviderActionConfigG = IDiccStructureProviderActionConfigG
> = TATupleGlobalDiccAC<
  TIDiccFieldMutateAC &
    TIDiccModelMutateAC &
    TIDiccFieldValAC &
    TIDiccModelValAC &
    TIDiccRequestValAC &
    TIDiccStructureHookAC &
    TIDiccStructureProviderAC
>;
/**... */
export interface IStructureBag<
  TModel,
  TIDiccFieldMutateAC extends IDiccFieldMutateActionConfigG = IDiccFieldMutateActionConfigG,
  TIDiccModelMutateAC extends IDiccModelMutateActionConfigG = IDiccModelMutateActionConfigG,
  TIDiccFieldValAC extends IDiccFieldValActionConfigG = IDiccFieldValActionConfigG,
  TIDiccModelValAC extends IDiccModelValActionConfigG = IDiccModelValActionConfigG,
  TIDiccRequestValAC extends IDiccRequestValActionConfigG = IDiccRequestValActionConfigG,
  TIDiccStructureHookAC extends IDiccStructureHookActionConfigG = IDiccStructureHookActionConfigG,
  TIDiccStructureProviderAC extends IDiccStructureProviderActionConfigG = IDiccStructureProviderActionConfigG
> extends IBagModule<TModel> {
  keyPath: string;
  literalCriteria:
    | IStructureReadCriteria<TModel>
    | IStructureModifyCriteria<TModel>;
  aTupleGlobalActionConfig: TStructureATupleGlobalDiccAC<
    TIDiccFieldMutateAC,
    TIDiccModelMutateAC,
    TIDiccFieldValAC,
    TIDiccModelValAC,
    TIDiccRequestValAC,
    TIDiccStructureHookAC,
    TIDiccStructureProviderAC
  >;
  responses: Array<IStructureResponse>;
}
/**... */
export type Trf_IStructureBag = IStructureBag<any>;
