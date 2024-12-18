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
import { IDiccPrimitiveHookActionConfigG } from "../hooks/primitive-hook";
import { IDiccPrimitiveMutateActionConfigG } from "../mutaters/primitive-mutater";
import { IDiccPrimitiveValActionConfigG } from "../validators/primitive-validation";
import { IDiccStructureHookActionConfigG } from "../hooks/structure-hook";
import { IDiccStructureProviderActionConfigG } from "../providers/structure-provider";
import { IDiccPrimitiveProviderActionConfigG } from "../providers/primitive-provider";
import {
  IFieldCriteria,
  IModifyCriteria,
  IPrimitiveModifyCriteria,
  IPrimitiveReadCriteria,
  IReadCriteria,
  IStructureModifyCriteria,
  IStructureReadCriteria,
} from "../criterias/shared";
import { Trf_StructureBag } from "./structure-bag";
import { Trf_PrimitiveBag } from "./primitive-bag";
import { Trf_BagModule } from "./_bag";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** */
export interface IBagModule<TData> {
  /**dato a procesar en cada modulo ⚠Posiblemente mutable⚠ */
  data: TData; //actualizable
  /**respuestas embebidas */
  responses: Array<IResponse>;
  /**objeto literal de criterios de peticion (no es el manejador) */
  literalCriteria: IReadCriteria | IModifyCriteria;
}
/**tipo de función que ejecuta la acción */
export type TFnBagForActionModule = (bag: Trf_BagModule) => Promise<IResponse>;

//====Primitive============================================================================================================================
/**clave identificadora de este modulo segun su contexto */
export type TKeyPrimitiveBagModuleContext = "primitiveBag";
/**... */
export interface IPrimitiveBag<
  TValue,
  TIDiccPrimitiveMutateAC extends IDiccPrimitiveMutateActionConfigG = IDiccPrimitiveMutateActionConfigG,
  TIDiccPrimitiveValAC extends IDiccPrimitiveValActionConfigG = IDiccPrimitiveValActionConfigG,
  TIDiccRequestValAC extends IDiccRequestValActionConfigG = IDiccRequestValActionConfigG,
  TIDiccPrimitiveHookAC extends IDiccPrimitiveHookActionConfigG = IDiccPrimitiveHookActionConfigG,
  TIDiccPrimitiveProviderAC extends IDiccPrimitiveProviderActionConfigG = IDiccPrimitiveProviderActionConfigG
> extends IBagModule<TValue> {
  literalCriteria:
    | IPrimitiveReadCriteria<
        TIDiccPrimitiveMutateAC,
        TIDiccPrimitiveValAC,
        TIDiccRequestValAC,
        TIDiccPrimitiveHookAC,
        TIDiccPrimitiveProviderAC
      >
    | IPrimitiveModifyCriteria<
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
/**tipo de función que ejecuta la acción */
export type TPrimitiveFnBagForActionModule = (
  bag: Trf_PrimitiveBag
) => Promise<IPrimitiveResponse>;

//====Structure============================================================================================================================
/**clave identificadora de este modulo segun su contexto */
export type TKeyStructureBagModuleContext = "structureBag";
/**clave identificadora profunda para el contexto estructural */
export type TKeyStructureDeepBagModuleContext = "fieldBag" | "modelBag";
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
  literalCriteria: IStructureReadCriteria<
    TModel,
    TIDiccModelMutateAC,
    TIDiccModelValAC,
    TIDiccRequestValAC,
    TIDiccStructureHookAC,
    TIDiccStructureProviderAC
  > &
    IStructureModifyCriteria<
      TModel,
      TIDiccModelMutateAC,
      TIDiccModelValAC,
      TIDiccRequestValAC,
      TIDiccStructureHookAC,
      TIDiccStructureProviderAC
    > &
    IFieldCriteria<TModel, TIDiccFieldMutateAC, TIDiccFieldValAC>;
  responses: Array<IStructureResponse>;
}
/**... */
export type Trf_IStructureBag = IStructureBag<any>;
/**tipo de función que ejecuta la acción */
export type TStructureFnBagForActionModule = (
  bag: Trf_StructureBag
) => Promise<IStructureResponse>;
