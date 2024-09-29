import { TPrimitiveFull, TStructureFull } from "./metadata-shared";
import { PrimitiveLogicMutater } from "../mutaters/primitive-mutater";
import { PrimitiveLogicValidation } from "../validators/primitive-validation";
import { RequestLogicValidation } from "../validators/request-validation";
import {
  IDiccPrimitiveModuleInstanceContext,
  IDiccStructureModuleInstanceContext,
} from "./metadata-handler-shared";
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
  /**configuracion base de los metadatos para este contexto*/
  customBase: TICustomBaseMetadata;
  /**diccionario con instancias de modulo
   * personalizadas para este contexto*/
  customDiccModuleInstance?: Partial<TICustomDiccModuleInstance>;
}
//████ PRIMITIVE ████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**esquema para construir los metadatos base en contexto *primitive* */
export interface IPrimitiveBuilderbaseMetadata<
  TValue,
  TPrimitiveMutateInstance extends PrimitiveLogicMutater = PrimitiveLogicMutater,
  TPrimitiveValInstance extends PrimitiveLogicValidation = PrimitiveLogicValidation,
  TRequestValInstance extends RequestLogicValidation = RequestLogicValidation,
  TPrimitiveHookInstance extends PrimitiveLogicHook = PrimitiveLogicHook,
  TPrimitiveProviderInstance extends PrimitiveLogicProvider = PrimitiveLogicProvider,
  TKeyDiccCtrlCRUD extends string = string
> extends IBuilderBaseMetadata<
    TPrimitiveFull<
      TPrimitiveMutateInstance["dfDiccActionConfig"],
      TPrimitiveValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TPrimitiveHookInstance["dfDiccActionConfig"],
      TPrimitiveProviderInstance["dfDiccActionConfig"],
      TKeyDiccCtrlCRUD
    >,
    IDiccPrimitiveModuleInstanceContext<
      TPrimitiveMutateInstance,
      TPrimitiveValInstance,
      TRequestValInstance,
      TPrimitiveHookInstance,
      TPrimitiveProviderInstance
    >
  > {}
/**... */
export type Trf_IBasePrimitiveMetadata = IPrimitiveBuilderbaseMetadata<any>;
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
  TKeyDiccCtrlCRUD extends string = string
> extends IBuilderBaseMetadata<
    TStructureFull<
      TModel,
      TFieldMutateInstance["dfDiccActionConfig"],
      TModelMutateInstance["dfDiccActionConfig"],
      TFieldValInstance["dfDiccActionConfig"],
      TModelValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TStructureHookInstance["dfDiccActionConfig"],
      TStructureProviderInstance["dfDiccActionConfig"],
      TKeyDiccCtrlCRUD
    >,
    IDiccStructureModuleInstanceContext<
      TFieldMutateInstance,
      TModelMutateInstance,
      TFieldValInstance,
      TModelValInstance,
      TRequestValInstance,
      TStructureHookInstance,
      TStructureProviderInstance
    >
  > {}
/**... */
export type Trf_IBaseStructureMetadata = IStructureBuilderBaseMetadata<any>;
