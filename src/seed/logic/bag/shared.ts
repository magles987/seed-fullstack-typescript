import {
  IPrimitiveResponse,
  IResponse,
  IStructureResponse,
} from "../reports/shared";
import { FieldLogicMutater } from "../mutaters/field-mutater";
import { ModelLogicMutater } from "../mutaters/model-mutater";
import { FieldLogicValidation } from "../validators/field-validation";
import { ModelLogicValidation } from "../validators/model-validation";
import { RequestLogicValidation } from "../validators/request-validation";
import { PrimitiveLogicMutater } from "../mutaters/primitive-mutater";
import { PrimitiveLogicValidation } from "../validators/primitive-validation";
import { StructureLogicHook } from "../hooks/structure-hook";
import { StructureLogicProvider } from "../providers/structure-provider";
import {
  IModifyCriteria,
  IPrimitiveModifyCriteria,
  IPrimitiveReadCriteria,
  IReadCriteria,
  IStructureFieldCriteria,
  IStructureModelModifyCriteria,
  IStructureModelReadCriteria,
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
  TIDiccPrimitiveMutateAC extends PrimitiveLogicMutater["dfDiccActionConfig"] = PrimitiveLogicMutater["dfDiccActionConfig"],
  TIDiccPrimitiveValAC extends PrimitiveLogicValidation["dfDiccActionConfig"] = PrimitiveLogicValidation["dfDiccActionConfig"],
  TIDiccRequestValAC extends RequestLogicValidation["dfDiccActionConfig"] = RequestLogicValidation["dfDiccActionConfig"],
  TIDiccPrimitiveHookAC extends StructureLogicHook["dfDiccActionConfig"] = StructureLogicHook["dfDiccActionConfig"],
  TIDiccPrimitiveProviderAC extends StructureLogicProvider["dfDiccActionConfig"] = StructureLogicProvider["dfDiccActionConfig"]
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
  TIDiccFieldMutateAC extends FieldLogicMutater["dfDiccActionConfig"] = FieldLogicMutater["dfDiccActionConfig"],
  TIDiccModelMutateAC extends ModelLogicMutater["dfDiccActionConfig"] = ModelLogicMutater["dfDiccActionConfig"],
  TIDiccFieldValAC extends FieldLogicValidation["dfDiccActionConfig"] = FieldLogicValidation["dfDiccActionConfig"],
  TIDiccModelValAC extends ModelLogicValidation["dfDiccActionConfig"] = ModelLogicValidation["dfDiccActionConfig"],
  TIDiccRequestValAC extends RequestLogicValidation["dfDiccActionConfig"] = RequestLogicValidation["dfDiccActionConfig"],
  TIDiccStructureHookAC extends StructureLogicHook["dfDiccActionConfig"] = StructureLogicHook["dfDiccActionConfig"],
  TIDiccStructureProviderAC extends StructureLogicProvider["dfDiccActionConfig"] = StructureLogicProvider["dfDiccActionConfig"]
> extends IBagModule<TModel> {
  literalCriteria: IStructureModelReadCriteria<
    TModel,
    TIDiccModelMutateAC,
    TIDiccModelValAC,
    TIDiccRequestValAC,
    TIDiccStructureHookAC,
    TIDiccStructureProviderAC
  > &
    IStructureModelModifyCriteria<
      TModel,
      TIDiccModelMutateAC,
      TIDiccModelValAC,
      TIDiccRequestValAC,
      TIDiccStructureHookAC,
      TIDiccStructureProviderAC
    > &
    IStructureFieldCriteria<TModel, TIDiccFieldMutateAC, TIDiccFieldValAC>;
  responses: Array<IStructureResponse>;
}
/**... */
export type Trf_IStructureBag = IStructureBag<any>;
/**tipo de función que ejecuta la acción */
export type TStructureFnBagForActionModule = (
  bag: Trf_StructureBag
) => Promise<IStructureResponse>;
