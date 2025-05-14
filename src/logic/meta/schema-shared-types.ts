import { PrimitiveLogicController } from "../controllers/primitive-ctrl";
import {
  TKeyPrimitiveCtrlModuleContext,
  TKeyStructureCtrlModuleContext,
} from "../controllers/shared-types";
import { StructureLogicController } from "../controllers/structure-ctrl";
import {
  TKeyPrimitiveCriteriaModuleContext,
  TKeyStructureCriteriaModuleContext,
} from "../criterias/shared-types";
import { PrimitiveLogicHook } from "../hooks/primitive-hook";
import {
  TKeyPrimitiveHookModuleContext,
  TKeyStructureHookModuleContext,
} from "../hooks/shared-types";
import { StructureLogicHook } from "../hooks/structure-hook";
import { FieldLogicMutater } from "../mutaters/field-mutater";
import { ModelLogicMutater } from "../mutaters/model-mutater";
import { PrimitiveLogicMutater } from "../mutaters/primitive-mutater";
import {
  TKeyPrimitiveMutateModuleContext,
  TKeyStructureDeepMutateModuleContext,
} from "../mutaters/shared-types";
import { PrimitiveLogicProvider } from "../providers/primitive-provider";
import {
  TKeyPrimitiveProviderModuleContext,
  TKeyStructureProviderModuleContext,
} from "../providers/shared-types";
import { StructureLogicProvider } from "../providers/structure-provider";
import {
  TKeyPrimitiveResponseModuleContext,
  TKeyStructureResponseModuleContext,
} from "../reports/shared-types";
import { FieldLogicValidation } from "../validators/field-validation";
import { ModelLogicValidation } from "../validators/model-validation";
import { PrimitiveLogicValidation } from "../validators/primitive-validation";
import { RequestLogicValidation } from "../validators/request-validation";
import {
  TKeyPrimitiveValModuleContext,
  TKeyStructureDeepValModuleContext,
} from "../validators/shared-types";
import {
  TPrimitiveMetadataModuleConfigForPrimitive,
  IPrimitiveMetadataModuleConfig,
  TKeyPrimitiveMetadataModuleContext,
  TStructureMetadataModuleConfigForField,
  IStructureMetadataModuleConfig,
  TStructureMetadataModuleConfigForModel,
  TKeyStructureMetadataModuleContext,
} from "./shared-types";

//████PRIMITIVE████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**... */
export type TPrimitiveMeta<TValue> =
  TPrimitiveMetadataModuleConfigForPrimitive<TValue>;
/**... */
export type Trf_TPrimitiveMeta = TPrimitiveMeta<any>;
/**... */
export type TPrimitiveMetaAndMutater<
  TValue,
  TPrimitiveMutateInstance extends PrimitiveLogicMutater = PrimitiveLogicMutater
> = TPrimitiveMetadataModuleConfigForPrimitive<TValue> &
  Partial<
    //se reasigna la propiedad del modulo sin cambiar su nombre de identificación
    Record<
      keyof Pick<
        IPrimitiveMetadataModuleConfig<TValue>["primitiveMeta"],
        "__mutateInstance"
      >,
      TPrimitiveMutateInstance
    >
  >;
/**refactorizacion del tipo */
export type Trf_TPrimitiveMetaAndMutater = TPrimitiveMetaAndMutater<any>;
/**... */
export type TPrimitiveMetaAndValidator<
  TValue,
  TPrimitiveValInstance extends PrimitiveLogicValidation = PrimitiveLogicValidation
> = TPrimitiveMetadataModuleConfigForPrimitive<TValue> &
  Partial<
    //se reasigna la propiedad del modulo sin cambiar su nombre de identificación
    Record<
      keyof Pick<
        IPrimitiveMetadataModuleConfig<TValue>["primitiveMeta"],
        "__valInstance"
      >,
      TPrimitiveValInstance
    >
  >;
/**refactorización del tipo */
export type Trf_TPrimitiveMetaAndValidator = TPrimitiveMetaAndValidator<any>;
/**... */
export type TPrimitiveMetaAndRequestVal<
  TValue,
  TRequestValInstance extends RequestLogicValidation = RequestLogicValidation
> = TPrimitiveMetadataModuleConfigForPrimitive<TValue> &
  Partial<
    //se reasigna la propiedad del modulo sin cambiar su nombre de identificación
    Record<
      keyof Pick<
        IPrimitiveMetadataModuleConfig<TValue>["primitiveMeta"],
        "__requestValInstance"
      >,
      TRequestValInstance
    >
  >;
/**refactorización del tipo */
export type Trf_TPrimitiveMetaAndRequestVal = TPrimitiveMetaAndRequestVal<any>;
/** */
export type TPrimitiveMetaAndHook<
  TValue,
  TPrimitiveHookInstance extends PrimitiveLogicHook = PrimitiveLogicHook
> = TPrimitiveMetadataModuleConfigForPrimitive<TValue> &
  Partial<
    //se reasigna la propiedad del modulo sin cambiar su nombre de identificacion
    Record<
      keyof Pick<
        IPrimitiveMetadataModuleConfig<TValue>["primitiveMeta"],
        "__hookInstance"
      >,
      TPrimitiveHookInstance
    >
  >;
/**Refactorizacion del tipo */
export type Trf_TPrimitiveMetaAndHook = TPrimitiveMetaAndHook<any>;
/** */
export type TPrimitiveMetaAndProvider<
  TValue,
  TPrimitiveProviderInstance extends PrimitiveLogicProvider = PrimitiveLogicProvider
> = TPrimitiveMetadataModuleConfigForPrimitive<TValue> &
  Partial<
    //se reasigna la propiedad del modulo sin cambiar su nombre de identificacion
    Record<
      keyof Pick<
        IPrimitiveMetadataModuleConfig<TValue>["primitiveMeta"],
        "__providerInstance"
      >,
      TPrimitiveProviderInstance
    >
  >;
/**Refactorizacion del tipo */
export type Trf_TPrimitiveMetaAndProvider = TPrimitiveMetaAndProvider<any>;
/** */
export type TPrimitiveMetaAndCtrl<
  TValue,
  TPrimitiveMutateInstance extends PrimitiveLogicMutater = PrimitiveLogicMutater,
  TPrimitiveValInstance extends PrimitiveLogicValidation = PrimitiveLogicValidation,
  TRequestValInstance extends RequestLogicValidation = RequestLogicValidation,
  TPrimitiveHookInstance extends PrimitiveLogicHook = PrimitiveLogicHook,
  TPrimitiveProviderInstance extends PrimitiveLogicProvider = PrimitiveLogicProvider,
  TKeyDiccActionRequest extends string = string,
  TPrimitiveCtrlInstance extends PrimitiveLogicController<
    TValue,
    TPrimitiveMutateInstance,
    TPrimitiveValInstance,
    TRequestValInstance,
    TPrimitiveHookInstance,
    TPrimitiveProviderInstance,
    TKeyDiccActionRequest
  > = PrimitiveLogicController<
    TValue,
    TPrimitiveMutateInstance,
    TPrimitiveValInstance,
    TRequestValInstance,
    TPrimitiveHookInstance,
    TPrimitiveProviderInstance,
    TKeyDiccActionRequest
  >
> = TPrimitiveMetadataModuleConfigForPrimitive<TValue> &
  Partial<
    //se reasigna la propiedad del modulo sin cambiar su nombre de identificacion
    Record<
      keyof Pick<
        IPrimitiveMetadataModuleConfig<TValue>["primitiveMeta"],
        "__ctrlInstance"
      >,
      TPrimitiveCtrlInstance
    >
  >;
/**Refactorizacion del tipo */
export type Trf_TPrimitiveMetaAndCtrl = TPrimitiveMetaAndCtrl<any>;
/** */
export type TPrimitiveFull<
  TValue,
  TPrimitiveMutateInstance extends PrimitiveLogicMutater = PrimitiveLogicMutater,
  TPrimitiveValInstance extends PrimitiveLogicValidation = PrimitiveLogicValidation,
  TRequestValInstance extends RequestLogicValidation = RequestLogicValidation,
  TPrimitiveHookInstance extends PrimitiveLogicHook = PrimitiveLogicHook,
  TPrimitiveProviderInstance extends PrimitiveLogicProvider = PrimitiveLogicProvider,
  TKeyDiccActionRequest extends string = string,
  TPrimitiveCtrlInstance extends PrimitiveLogicController<
    TValue,
    TPrimitiveMutateInstance,
    TPrimitiveValInstance,
    TRequestValInstance,
    TPrimitiveHookInstance,
    TPrimitiveProviderInstance,
    TKeyDiccActionRequest
  > = PrimitiveLogicController<
    TValue,
    TPrimitiveMutateInstance,
    TPrimitiveValInstance,
    TRequestValInstance,
    TPrimitiveHookInstance,
    TPrimitiveProviderInstance,
    TKeyDiccActionRequest
  >
> = TPrimitiveMetadataModuleConfigForPrimitive<TValue> &
  Partial<
    //se reasigna la propiedad del modulo sin cambiar su nombre de identificacion
    Record<
      keyof Pick<
        IPrimitiveMetadataModuleConfig<TValue>["primitiveMeta"],
        "__mutateInstance"
      >,
      TPrimitiveMutateInstance
    > &
      //se reasigna la propiedad del modulo sin cambiar su nombre de identificación
      Record<
        keyof Pick<
          IPrimitiveMetadataModuleConfig<TValue>["primitiveMeta"],
          "__valInstance"
        >,
        TPrimitiveValInstance
      > &
      //se reasigna la propiedad del modulo sin cambiar su nombre de identificación
      Record<
        keyof Pick<
          IPrimitiveMetadataModuleConfig<TValue>["primitiveMeta"],
          "__requestValInstance"
        >,
        TRequestValInstance
      > &
      //se reasigna la propiedad del modulo sin cambiar su nombre de identificacion
      Record<
        keyof Pick<
          IPrimitiveMetadataModuleConfig<TValue>["primitiveMeta"],
          "__hookInstance"
        >,
        TPrimitiveHookInstance
      > &
      //se reasigna la propiedad del modulo sin cambiar su nombre de identificación
      Record<
        keyof Pick<
          IPrimitiveMetadataModuleConfig<TValue>["primitiveMeta"],
          "__providerInstance"
        >,
        TPrimitiveProviderInstance
      > &
      Record<
        keyof Pick<
          IPrimitiveMetadataModuleConfig<TValue>["primitiveMeta"],
          "__ctrlInstance"
        >,
        TPrimitiveCtrlInstance
      >
  >;
/**Refactorización del tipo */
export type Trf_TPrimitiveFull = TPrimitiveFull<any>;
/**claves identificadoras de todos los contextos
 * de módulos internos */
export type TKeyPrimitiveInternalModuleContext =
  | TKeyPrimitiveResponseModuleContext
  | TKeyPrimitiveMetadataModuleContext
  | TKeyPrimitiveCriteriaModuleContext
  | TKeyPrimitiveMutateModuleContext
  | TKeyPrimitiveValModuleContext
  | TKeyPrimitiveHookModuleContext
  | TKeyPrimitiveProviderModuleContext
  | TKeyPrimitiveCtrlModuleContext; //adición especial;
/**claves identificadoras de todos los contextos
 * de módulos internos */
export type TKeyPrimitiveInternalACModuleContext =
  | TKeyPrimitiveMutateModuleContext
  | TKeyPrimitiveValModuleContext
  | TKeyPrimitiveHookModuleContext
  | TKeyPrimitiveProviderModuleContext
  | TKeyPrimitiveCtrlModuleContext; //adición especial;

//████STRUCTURED████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████

//====Contexto FIELD============================================================================================================================

//❗se debe usar tipo y no interfaz para poder hacer interseccion
//con los subtipos (modelo, campos o embebidos)❗

/**... */
export type TStructureFieldMeta<TEmbModel> =
  TStructureMetadataModuleConfigForField & {
    /**configuracion adicional para estructura embebida */
    __emb?: TStructureMeta<TEmbModel>;
  };
/**... */
export type Trf_TStructureFieldMeta = TStructureFieldMeta<any>;
/**... */
export type TStructureFieldMetaAndMutater<
  TFieldMutateInstance extends FieldLogicMutater = FieldLogicMutater,
  TEmbModel = unknown, //❕una estructura embebida mas profunda (si la hay)❕
  TEmbFieldMutateInstance extends FieldLogicMutater = FieldLogicMutater,
  TEmbModelMutateInstance extends ModelLogicMutater = ModelLogicMutater
> = TStructureMetadataModuleConfigForField &
  Partial<
    Record<
      keyof Pick<
        IStructureMetadataModuleConfig<any>["fieldMeta"],
        "__mutateInstance"
      >,
      TFieldMutateInstance
    >
  > & {
    /**configuracion adicional para estructura embebida */
    __emb?: TStructureMetaAndMutater<
      TEmbModel,
      TEmbFieldMutateInstance,
      TEmbModelMutateInstance
    >;
  };
/**refactorización del tipo */
export type Trf_TStructureFieldMetaAndMutater =
  TStructureFieldMetaAndMutater<any>;
/**... */
export type TStructureFieldMetaAndValidator<
  TFieldValInstance extends FieldLogicValidation = FieldLogicValidation,
  TEmbModel = unknown, //❕una estructura embebida mas profunda (si la hay)❕
  TEmbFieldValInstance extends FieldLogicValidation = FieldLogicValidation,
  TEmbModelValInstance extends ModelLogicValidation = ModelLogicValidation
  //TEmbRequestValInstance extends RequestLogicValidation = RequestLogicValidation,
> = TStructureMetadataModuleConfigForField &
  Partial<
    Record<
      keyof Pick<
        IStructureMetadataModuleConfig<any>["fieldMeta"],
        "__valInstance"
      >,
      TFieldValInstance
    >
  > & {
    /**configuración adicional para estructura embebida */
    __emb?: TStructureMetaAndValidator<
      TEmbModel,
      TEmbFieldValInstance,
      TEmbModelValInstance
    >;
  };
/**refactorización del tipo */
export type Trf_TStructureFieldMetaAndValidator =
  TStructureFieldMetaAndValidator<any>;
/**... */
export type TStructureFieldMetaAndHook<
  TStructureHookInstance extends StructureLogicHook = StructureLogicHook,
  TEmbStructureHookInstance extends StructureLogicHook = StructureLogicHook
  //TEmbRequestValInstance extends RequestLogicValidation = RequestLogicValidation,
> = TStructureMetadataModuleConfigForField &
  Partial<
    Record<
      keyof Pick<
        IStructureMetadataModuleConfig<any>["fieldMeta"],
        "__hookInstance"
      >,
      TStructureHookInstance
    >
  > & {
    /**configuración adicional para estructura embebida */
    __emb?: TStructureMetaAndHook<TEmbStructureHookInstance>;
  };
/**refactorización del tipo */
export type Trf_TStructureFieldMetaAndHook = TStructureFieldMetaAndHook<any>;
/**... */
export type TStructureFieldMetaAndCtrl<
  TFieldMutateInstance extends FieldLogicMutater = FieldLogicMutater,
  TFieldValInstance extends FieldLogicValidation = FieldLogicValidation,
  TStructureHookInstance extends StructureLogicHook = StructureLogicHook,
  TStructureCtrlInstance extends StructureLogicController<
    any,
    TFieldMutateInstance,
    any,
    any,
    any,
    any,
    TStructureHookInstance,
    any,
    any
  > = StructureLogicController<
    any,
    TFieldMutateInstance,
    any,
    TFieldValInstance,
    any,
    any,
    TStructureHookInstance,
    any,
    any
  >,
  TEmbStructureCtrlInstance extends StructureLogicController<any> = StructureLogicController<any>
> = TStructureMetadataModuleConfigForField &
  Partial<
    Record<
      keyof Pick<
        IStructureMetadataModuleConfig<any>["fieldMeta"],
        "__ctrlInstance"
      >,
      TStructureCtrlInstance
    >
  > & {
    /**configuración adicional para estructura embebida */
    __emb?: TEmbStructureCtrlInstance;
  };
/**refactorización del tipo */
export type Trf_TStructureFieldMetaAndCtrl = TStructureFieldMetaAndCtrl<any>;
/**... */
export type TStructureFieldFull<
  TFieldMutateInstance extends FieldLogicMutater = FieldLogicMutater,
  TFieldValInstance extends FieldLogicValidation = FieldLogicValidation,
  TStructureHookInstance extends StructureLogicHook = StructureLogicHook,
  TStructureCtrlInstance extends StructureLogicController<
    any,
    TFieldMutateInstance,
    any,
    any,
    any,
    any,
    TStructureHookInstance,
    any,
    any
  > = StructureLogicController<
    any,
    TFieldMutateInstance,
    any,
    TFieldValInstance,
    any,
    any,
    TStructureHookInstance,
    any,
    any
  >,
  TEmbModel = unknown, //❕una estructura embebida mas profunda (si la hay)❕
  TEmbFieldMutateInstance extends FieldLogicMutater = FieldLogicMutater,
  TEmbModelMutateInstance extends ModelLogicMutater = ModelLogicMutater,
  TEmbFieldValInstance extends FieldLogicValidation = FieldLogicValidation,
  TEmbModelValInstance extends ModelLogicValidation = ModelLogicValidation,
  //TEmbRequestValInstance extends RequestLogicValidation = RequestLogicValidation,
  TEmbStructureHookInstance extends StructureLogicHook = StructureLogicHook
> = TStructureMetadataModuleConfigForField &
  Partial<
    Record<
      keyof Pick<
        IStructureMetadataModuleConfig<any>["fieldMeta"],
        "__mutateInstance"
      >,
      TFieldMutateInstance
    > &
      Record<
        keyof Pick<
          IStructureMetadataModuleConfig<any>["fieldMeta"],
          "__valInstance"
        >,
        TFieldValInstance
      > &
      Record<
        keyof Pick<
          IStructureMetadataModuleConfig<any>["fieldMeta"],
          "__hookInstance"
        >,
        TStructureHookInstance
      > &
      Record<
        keyof Pick<
          IStructureMetadataModuleConfig<any>["fieldMeta"],
          "__ctrlInstance"
        >,
        TStructureCtrlInstance
      >
  > & {
    /**configuración adicional para estructura embebida */
    __emb?: TStructureFull<
      TEmbModel,
      TEmbFieldMutateInstance,
      TEmbModelMutateInstance,
      TEmbFieldValInstance,
      TEmbModelValInstance,
      any, //❕Los embebidos no tienen acceso a validación por request❕
      TEmbStructureHookInstance,
      any, //❕Los embebidos no tienen acceso a providers❕
      any //❕Los embebidos no tienen acceso a keyRequest
    >;
  };
/**refactorizacion del tipo */
export type Trf_TStructureFieldFull = TStructureFieldFull<any>;
/**
 * Estructura o esquema de un modelo con las propiedades
 * generales y campos (puede usarse como embebido)
 */
export type TStructureMeta<TModel> =
  TStructureMetadataModuleConfigForModel<TModel> &
    Record<
      keyof TModel,
      TStructureFieldMeta<any> //en este nivel es imposible tipar todos los modelos embebidos de cada campo
    >;
/**Refactorizacion del tipo */
export type Trf_TStructureMeta = TStructureMeta<any>;
/**
 * Estructura o esquema de un modelo con los campos
 * (puede usarse como embebido).
 *
 * ❗NO incluye propiedades generales con prefijo `"__"` ❗
 */
export type TStructureMetaOnlyField<TModel> = Omit<
  TStructureMeta<TModel>,
  keyof TStructureMetadataModuleConfigForModel<TModel>
>;
/**
 * Estructura o esquema de un modelo con los campos
 * (puede usarse como embebido)
 *
 * adiciona la configuracion del modulo de
 * mutacion de datos o docs (a nivel modelo
 * y a nivel campo)
 */
export type TStructureMetaAndMutater<
  TModel,
  TFieldMutateInstance extends FieldLogicMutater = FieldLogicMutater,
  TModelMutateInstance extends ModelLogicMutater = ModelLogicMutater
> = TStructureMetadataModuleConfigForModel<TModel> &
  //se reasigna la propiedad del modulo sin cambiar su nombre de identificación
  Partial<
    Record<
      keyof Pick<
        IStructureMetadataModuleConfig<any>["modelMeta"],
        "__mutateInstance"
      >,
      TModelMutateInstance
    >
  > &
  //adaptación para los campos del modelo
  Record<
    keyof TModel,
    TStructureFieldMetaAndMutater<TFieldMutateInstance>
    //en este nivel es imposible tipar todos los modelos embebidos de cada campo
  >;
/**Refactorizacion del tipo */
export type Trf_TStructureMetaAndMutater = TStructureMetaAndMutater<any>;
/** */
export type TStructureMetaAndValidator<
  TModel,
  TFieldValInstance extends FieldLogicValidation = FieldLogicValidation,
  TModelValInstance extends ModelLogicValidation = ModelLogicValidation
> = TStructureMetadataModuleConfigForModel<TModel> &
  //se reasigna la propiedad del modulo sin cambiar su nombre de identificacion
  Partial<
    Record<
      keyof Pick<
        IStructureMetadataModuleConfig<any>["modelMeta"],
        "__valInstance"
      >,
      TModelValInstance
    >
  > &
  //adaptación para los campos del modelo
  Record<
    keyof TModel,
    TStructureFieldMetaAndValidator<TFieldValInstance>
    //en este nivel es imposible tipar todos los modelos embebidos de cada campo
  >;
/**Refactorización del tipo */
export type Trf_TStructureMetaAndValidator = TStructureMetaAndValidator<any>;
/** */
export type TStructureMetaAndRequestVal<
  TModel,
  TRequestValInstance extends RequestLogicValidation = RequestLogicValidation
> = TStructureMetadataModuleConfigForModel<TModel> &
  //se reasigna la propiedad del modulo sin cambiar su nombre de identificacion
  Partial<
    Record<
      keyof Pick<
        IStructureMetadataModuleConfig<any>["modelMeta"],
        "__requestValInstance"
      >,
      TRequestValInstance
    >
  >;
/**Refactorización del tipo */
export type Trf_TStructureMetaAndRequestVal = TStructureMetaAndRequestVal<any>;
/** */
export type TStructureMetaAndHook<
  TModel,
  TStructureHookInstance extends StructureLogicHook = StructureLogicHook
> = TStructureMetadataModuleConfigForModel<TModel> &
  //se reasigna la propiedad del modulo sin cambiar su nombre de identificacion
  Partial<
    Record<
      keyof Pick<
        IStructureMetadataModuleConfig<any>["modelMeta"],
        "__hookInstance"
      >,
      TStructureHookInstance
    >
  >;
/**Refactorizacion del tipo */
export type Trf_TStructureMetaAndHook = TStructureMetaAndHook<any>;
/** */
export type TStructureMetaAndProvider<
  TModel,
  TStructureProviderInstance extends StructureLogicProvider = StructureLogicProvider
> = TStructureMetadataModuleConfigForModel<TModel> &
  //se reasigna la propiedad del modulo sin cambiar su nombre de identificacion
  Partial<
    Record<
      keyof Pick<
        IStructureMetadataModuleConfig<any>["modelMeta"],
        "__providerInstance"
      >,
      TStructureProviderInstance
    >
  >;
/**Refactorizacion del tipo */
export type Trf_TStructureMetaAndProvider = TStructureMetaAndProvider<any>;
/** */
export type TStructureMetaAndCtrl<
  TModel,
  TFieldMutateInstance extends FieldLogicMutater = FieldLogicMutater,
  TModelMutateInstance extends ModelLogicMutater = ModelLogicMutater,
  TFieldValInstance extends FieldLogicValidation = FieldLogicValidation,
  TModelValInstance extends ModelLogicValidation = ModelLogicValidation,
  TRequestValInstance extends RequestLogicValidation = RequestLogicValidation,
  TStructureHookInstance extends StructureLogicHook = StructureLogicHook,
  TStructureProviderInstance extends StructureLogicProvider = StructureLogicProvider,
  TKeyDiccActionRequest extends string = string,
  TStructureCtrlInstance extends StructureLogicController<
    TModel,
    TFieldMutateInstance,
    TModelMutateInstance,
    TFieldValInstance,
    TModelValInstance,
    TRequestValInstance,
    TStructureHookInstance,
    TStructureProviderInstance,
    TKeyDiccActionRequest
  > = StructureLogicController<
    TModel,
    TFieldMutateInstance,
    TModelMutateInstance,
    TFieldValInstance,
    TModelValInstance,
    TRequestValInstance,
    TStructureHookInstance,
    TStructureProviderInstance,
    TKeyDiccActionRequest
  >
> = TStructureMetadataModuleConfigForModel<TModel> &
  Partial<
    Record<
      keyof Pick<
        IStructureMetadataModuleConfig<any>["modelMeta"],
        "__ctrlInstance"
      >,
      TStructureCtrlInstance
    >
  >;
/**... */
export type Trf_TStructureMetaAndCtrl = TStructureMetaAndCtrl<any>;
/** */
export type TStructureFull<
  TModel,
  TFieldMutateInstance extends FieldLogicMutater = FieldLogicMutater,
  TModelMutateInstance extends ModelLogicMutater = ModelLogicMutater,
  TFieldValInstance extends FieldLogicValidation = FieldLogicValidation,
  TModelValInstance extends ModelLogicValidation = ModelLogicValidation,
  TRequestValInstance extends RequestLogicValidation = RequestLogicValidation,
  TStructureHookInstance extends StructureLogicHook = StructureLogicHook,
  TStructureProviderInstance extends StructureLogicProvider = StructureLogicProvider,
  TKeyDiccActionRequest extends string = string,
  TStructureCtrlInstance extends StructureLogicController<
    TModel,
    TFieldMutateInstance,
    TModelMutateInstance,
    TFieldValInstance,
    TModelValInstance,
    TRequestValInstance,
    TStructureHookInstance,
    TStructureProviderInstance,
    TKeyDiccActionRequest
  > = StructureLogicController<
    TModel,
    TFieldMutateInstance,
    TModelMutateInstance,
    TFieldValInstance,
    TModelValInstance,
    TRequestValInstance,
    TStructureHookInstance,
    TStructureProviderInstance,
    TKeyDiccActionRequest
  >
> = TStructureMetadataModuleConfigForModel<TModel> &
  //se reasigna la propiedad del modulo sin cambiar su nombre de identificación
  Partial<
    Record<
      keyof Pick<
        IStructureMetadataModuleConfig<any>["modelMeta"],
        "__mutateInstance"
      >,
      TModelMutateInstance
    > &
      Record<
        keyof Pick<
          IStructureMetadataModuleConfig<any>["modelMeta"],
          "__valInstance"
        >,
        TModelValInstance
      > &
      Record<
        keyof Pick<
          IStructureMetadataModuleConfig<any>["modelMeta"],
          "__requestValInstance"
        >,
        TRequestValInstance
      > &
      //se reasigna la propiedad del modulo sin cambiar su nombre de identificación
      Record<
        keyof Pick<
          IStructureMetadataModuleConfig<any>["modelMeta"],
          "__hookInstance"
        >,
        TStructureHookInstance
      > &
      //se reasigna la propiedad del modulo sin cambiar su nombre de identificación
      Record<
        keyof Pick<
          IStructureMetadataModuleConfig<any>["modelMeta"],
          "__providerInstance"
        >,
        TStructureProviderInstance
      > &
      Record<
        keyof Pick<
          IStructureMetadataModuleConfig<any>["modelMeta"],
          "__ctrlInstance"
        >,
        TStructureCtrlInstance
      >
  > &
  //adaptación para los campos del modelo
  Record<
    keyof TModel,
    TStructureFieldFull<
      TFieldMutateInstance,
      TFieldValInstance,
      TStructureHookInstance,
      TStructureCtrlInstance
      //en este nivel es imposible tipar todos los modelos embebidos de cada campo
    >
  >;
/**Refactorización del tipo */
export type Trf_TStructureFull = TStructureFull<any>;
/**claves identificadoras de todos los contextos
 * de módulos internos */
export type TKeyStructureInternalModuleContext =
  | TKeyStructureResponseModuleContext
  | TKeyStructureMetadataModuleContext
  | TKeyStructureCriteriaModuleContext
  | TKeyStructureDeepMutateModuleContext
  | TKeyStructureDeepValModuleContext
  | TKeyStructureHookModuleContext
  | TKeyStructureProviderModuleContext;

/**claves identificadoras de todos los contextos
 * de módulos internos usados en el controller */
export type TKeyStructureInternalACModuleContext =
  | TKeyStructureDeepMutateModuleContext
  | TKeyStructureDeepValModuleContext
  | TKeyStructureHookModuleContext
  | TKeyStructureProviderModuleContext
  | TKeyStructureCtrlModuleContext; //adición especial
/**claves identificadoras de todos los contextos
 * de módulos internos usados en el controller
 * en contexto model */
export type TKeyFieldInternalModuleContext =
  | TKeyStructureResponseModuleContext
  | TKeyStructureMetadataModuleContext
  | Extract<TKeyStructureDeepMutateModuleContext, "fieldMutate">
  | Extract<TKeyStructureDeepValModuleContext, "fieldVal">;
/**claves identificadoras de todos los contextos
 * de módulos internos usados en el controller
 * en contexto model*/
export type TKeyFieldInternalACModuleContext =
  | Extract<TKeyStructureDeepMutateModuleContext, "fieldMutate">
  | Extract<TKeyStructureDeepValModuleContext, "fieldVal">;
/**claves identificadoras de todos los contextos
 * de módulos internos usados en el controller
 * en contexto model */
export type TKeyModelInternalModuleContext =
  | TKeyStructureResponseModuleContext
  | Extract<TKeyStructureMetadataModuleContext, "modelMeta">
  | TKeyStructureCriteriaModuleContext
  | Extract<TKeyStructureDeepMutateModuleContext, "modelMutate">
  | Extract<TKeyStructureDeepValModuleContext, "modelVal">
  | TKeyStructureHookModuleContext
  | TKeyStructureProviderModuleContext
  | TKeyStructureCtrlModuleContext; //adición especial
/**claves identificadoras de todos los contextos
 * de módulos internos usados en el controller
 * en contexto model*/
export type TKeyModelInternalACModuleContext =
  | Extract<TKeyStructureDeepMutateModuleContext, "modelMutate">
  | Extract<TKeyStructureDeepValModuleContext, "modelVal">
  | TKeyStructureHookModuleContext
  | TKeyStructureProviderModuleContext
  | TKeyStructureCtrlModuleContext; //adición especial
