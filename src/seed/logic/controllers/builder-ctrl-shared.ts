import { TPrimitiveFull, TStructureFull } from "../meta/metadata-shared";
import { PrimitiveLogicMutater } from "../mutaters/primitive-mutater";
import { PrimitiveLogicValidation } from "../validators/primitive-validation";
import { RequestLogicValidation } from "../validators/request-validation";
import {
  IDiccPrimitiveModuleInstanceContext,
  IDiccStructureModuleInstanceContext,
} from "../meta/shared";
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
export interface IBuilderBaseCtrl<
  TICustomBaseMetadata,
  TICustomDiccModuleInstance
> {
  /**clave identificadora del recurso */
  keySrc: string;
  /**configuración base de los metadatos para este contexto*/
  customBaseMetadata: TICustomBaseMetadata;
  /**diccionario con instancias de modulo
   * personalizadas para este contexto*/
  customDiccModuleInstance?: TICustomDiccModuleInstance;
}
/**refactorización de la interfaz de construcción*/
export type Trf_IBuilderBaseCtrl = IBuilderBaseCtrl<any, any>;

//████ PRIMITIVE ████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**esquema para construir los metadatos base en contexto *primitive* */
export interface IPrimitiveBuilderBaseCtrl<
  TValue,
  TPrimitiveMutateInstance extends PrimitiveLogicMutater = PrimitiveLogicMutater,
  TPrimitiveValInstance extends PrimitiveLogicValidation = PrimitiveLogicValidation,
  TRequestValInstance extends RequestLogicValidation = RequestLogicValidation,
  TPrimitiveHookInstance extends PrimitiveLogicHook = PrimitiveLogicHook,
  TPrimitiveProviderInstance extends PrimitiveLogicProvider = PrimitiveLogicProvider,
  TKeyDiccActionRequest extends string = string
> extends IBuilderBaseCtrl<
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
export type Trf_IBasePrimitiveCtrl = IPrimitiveBuilderBaseCtrl<any>;
/**tipado para la lista de instancias de drivers a usar en el controller */
export type TPrimitiveBaseDriversList =
  IDiccStructureModuleInstanceContext["driversList"];
/**esquema tipo diccionario que almacena las instancias de módulos
 * personalizados para el controller (incluye la lista de instancia de drives)
 */
export type TPrimitiveBaseDiccModuleInstance<
  TPrimitiveMutateInstance extends PrimitiveLogicMutater = PrimitiveLogicMutater,
  TPrimitiveValInstance extends PrimitiveLogicValidation = PrimitiveLogicValidation,
  TRequestValInstance extends RequestLogicValidation = RequestLogicValidation,
  TPrimitiveHookInstance extends PrimitiveLogicHook = PrimitiveLogicHook,
  TPrimitiveProviderInstance extends PrimitiveLogicProvider = PrimitiveLogicProvider
> = Partial<
  IDiccPrimitiveModuleInstanceContext<
    TPrimitiveMutateInstance,
    TPrimitiveValInstance,
    TRequestValInstance,
    TPrimitiveHookInstance,
    TPrimitiveProviderInstance
  >
> &
  Pick<IDiccPrimitiveModuleInstanceContext, "driversList">;
/**esquema de metadatos esenciales para construir el manejador
 * de metadatos del cual se basará el controller
 */
export type TPrimitiveBaseMetadata<
  TValue,
  TPrimitiveMutateInstance extends PrimitiveLogicMutater = PrimitiveLogicMutater,
  TPrimitiveValInstance extends PrimitiveLogicValidation = PrimitiveLogicValidation,
  TRequestValInstance extends RequestLogicValidation = RequestLogicValidation,
  TPrimitiveHookInstance extends PrimitiveLogicHook = PrimitiveLogicHook,
  TPrimitiveProviderInstance extends PrimitiveLogicProvider = PrimitiveLogicProvider,
  TKeyDiccActionRequest extends string = string
> = TPrimitiveFull<
  TPrimitiveMutateInstance,
  TPrimitiveValInstance,
  TRequestValInstance,
  TPrimitiveHookInstance,
  TPrimitiveProviderInstance,
  TKeyDiccActionRequest
>;
//████ STRUCTURE ████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**esquema para construir los metadatos base en contexto *structure* */
export interface IStructureBuilderBaseCtrl<
  TModel,
  TFieldMutateInstance extends FieldLogicMutater = FieldLogicMutater,
  TModelMutateInstance extends ModelLogicMutater = ModelLogicMutater,
  TFieldValInstance extends FieldLogicValidation = FieldLogicValidation,
  TModelValInstance extends ModelLogicValidation = ModelLogicValidation,
  TRequestValInstance extends RequestLogicValidation = RequestLogicValidation,
  TStructureHookInstance extends StructureLogicHook = StructureLogicHook,
  TStructureProviderInstance extends StructureLogicProvider = StructureLogicProvider,
  TKeyDiccActionRequest extends string = string
> extends IBuilderBaseCtrl<
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
      Pick<IDiccStructureModuleInstanceContext, "driversList">
  > {}
/**refactorización del tipo */
export type Trf_IBaseStructureCtrl = IStructureBuilderBaseCtrl<any>;
/**tipado para la lista de instancias de drivers a usar en el controller */
export type TStructureBaseDriversList =
  IDiccStructureModuleInstanceContext["driversList"];
/**esquema tipo diccionario que almacena las instancias de módulos
 * personalizados para el controller (incluye la lista de instancia de drives)
 */
export type TStructureBaseDiccModuleInstance<
  TFieldMutateInstance extends FieldLogicMutater = FieldLogicMutater,
  TModelMutateInstance extends ModelLogicMutater = ModelLogicMutater,
  TFieldValInstance extends FieldLogicValidation = FieldLogicValidation,
  TModelValInstance extends ModelLogicValidation = ModelLogicValidation,
  TRequestValInstance extends RequestLogicValidation = RequestLogicValidation,
  TStructureHookInstance extends StructureLogicHook = StructureLogicHook,
  TStructureProviderInstance extends StructureLogicProvider = StructureLogicProvider
> = Partial<
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
  Pick<IDiccStructureModuleInstanceContext, "driversList">;
/**esquema de metadatos esenciales para construir el manejador
 * de metadatos del cual se basará el controller
 */
export type TStructureBaseMetadata<
  TModel,
  TFieldMutateInstance extends FieldLogicMutater = FieldLogicMutater,
  TModelMutateInstance extends ModelLogicMutater = ModelLogicMutater,
  TFieldValInstance extends FieldLogicValidation = FieldLogicValidation,
  TModelValInstance extends ModelLogicValidation = ModelLogicValidation,
  TRequestValInstance extends RequestLogicValidation = RequestLogicValidation,
  TStructureHookInstance extends StructureLogicHook = StructureLogicHook,
  TStructureProviderInstance extends StructureLogicProvider = StructureLogicProvider,
  TKeyDiccActionRequest extends string = string
> = TStructureFull<
  TModel,
  TFieldMutateInstance,
  TModelMutateInstance,
  TFieldValInstance,
  TModelValInstance,
  TRequestValInstance,
  TStructureHookInstance,
  TStructureProviderInstance,
  TKeyDiccActionRequest
>;
