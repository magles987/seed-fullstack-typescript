import { TPrimitiveFull, TStructureFull } from "./metadata-shared";
import { PrimitiveLogicMutater } from "../mutaters/primitive-mutater";
import { PrimitiveLogicValidation } from "../validators/primitive-validation";
import { RequestLogicValidation } from "../validators/request-validation";
import {
  IDiccPrimitiveModuleInstanceContext,
  IDiccStructureModuleInstanceContext,
} from "./shared";
import { FieldLogicMutater } from "../mutaters/field-mutater";
import { ModelLogicMutater } from "../mutaters/model-mutater";
import { FieldLogicValidation } from "../validators/field-validation";
import { ModelLogicValidation } from "../validators/model-validation";
import { PrimitiveLogicHook } from "../hooks/primitive-hook";
import { StructureLogicHook } from "../hooks/structure-hook";
import { StructureLogicProvider } from "../providers/structure-provider";
import { PrimitiveLogicProvider } from "../providers/primitive-provider";

//████GLOBAL████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**esquema para construir los metadatos base*/
export interface IBuilderBaseMetadata<
  TICustomBaseMetadata,
  TICustomDiccModuleInstance
> {
  /**clave identificadora del recurso */
  keySrc: string;
  /**configuración base de los metadatos para este contexto*/
  customBase: TICustomBaseMetadata;
  /**diccionario con instancias de modulo
   * personalizadas para este contexto*/
  customDiccModuleInstance?: TICustomDiccModuleInstance;
}
/**refactorización de la interfaz de construcción*/
export type Trf_IBuilderBaseMetadata = IBuilderBaseMetadata<any, any>;

//████ PRIMITIVE ████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**esquema para construir los metadatos base en contexto *primitive* */
export interface IPrimitiveBuilderBaseMetadata<
  TValue,
  TPrimitiveMutateInstance extends PrimitiveLogicMutater = PrimitiveLogicMutater,
  TPrimitiveValInstance extends PrimitiveLogicValidation = PrimitiveLogicValidation,
  TRequestValInstance extends RequestLogicValidation = RequestLogicValidation,
  TPrimitiveHookInstance extends PrimitiveLogicHook = PrimitiveLogicHook,
  TPrimitiveProviderInstance extends PrimitiveLogicProvider = PrimitiveLogicProvider,
  TKeyDiccActionRequest extends string = string
> extends IBuilderBaseMetadata<
    TPrimitiveFull<
      TPrimitiveMutateInstance,
      TPrimitiveValInstance,
      TRequestValInstance,
      TPrimitiveHookInstance,
      TPrimitiveProviderInstance,
      TKeyDiccActionRequest
    >,
    Partial<
      IDiccPrimitiveModuleInstanceContext<
        TPrimitiveMutateInstance,
        TPrimitiveValInstance,
        TRequestValInstance,
        TPrimitiveHookInstance,
        TPrimitiveProviderInstance
      >
    > &
      Pick<IDiccPrimitiveModuleInstanceContext, "driversList">
  > {}
/**... */
export type Trf_IBasePrimitiveMetadata = IPrimitiveBuilderBaseMetadata<any>;
//████ STRUCTURE ████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**esquema para construir los metadatos base en contexto *structure* */
export interface IStructureBuilderBaseMetadata<
  TModel,
  TFieldMutateInstance extends FieldLogicMutater = FieldLogicMutater,
  TModelMutateInstance extends ModelLogicMutater = ModelLogicMutater,
  TFieldValInstance extends FieldLogicValidation = FieldLogicValidation,
  TModelValInstance extends ModelLogicValidation = ModelLogicValidation,
  TRequestValInstance extends RequestLogicValidation = RequestLogicValidation,
  TStructureHookInstance extends StructureLogicHook = StructureLogicHook,
  TStructureProviderInstance extends StructureLogicProvider = StructureLogicProvider,
  TKeyDiccActionRequest extends string = string
> extends IBuilderBaseMetadata<
    TStructureFull<
      TModel,
      TFieldMutateInstance,
      TModelMutateInstance,
      TFieldValInstance,
      TModelValInstance,
      TRequestValInstance,
      TStructureHookInstance,
      TStructureProviderInstance,
      TKeyDiccActionRequest
    >,
    Partial<
      IDiccStructureModuleInstanceContext<
        TFieldMutateInstance,
        TModelMutateInstance,
        TFieldValInstance,
        TModelValInstance,
        TRequestValInstance,
        TStructureHookInstance,
        TStructureProviderInstance
      >
    > &
      Pick<IDiccPrimitiveModuleInstanceContext, "driversList">
  > {}
/**... */
export type Trf_IBaseStructureMetadata = IStructureBuilderBaseMetadata<any>;
