import {
  TFieldConfigForVal,
  TKeyPrimitiveValModuleContext,
  TKeyStructureDeepValModuleContext,
  TModelConfigForVal,
  TPrimitiveConfigForVal,
} from "../validators/shared";
import {
  TFieldConfigForMutate,
  TKeyPrimitiveMutateModuleContext,
  TKeyStructureDeepMutateModuleContext,
  TModelConfigForMutate,
  TPrimitiveConfigForMutate,
} from "../mutaters/shared";
import {
  TStructureConfigForHook,
  TPrimitiveConfigForHook,
  TKeyPrimitiveHookModuleContext,
  TKeyStructureHookModuleContext,
} from "../hooks/shared";
import {
  TKeyPrimitiveProviderModuleContext,
  TKeyStructureProviderModuleContext,
  TModelConfigForProvider,
  TPrimitiveConfigForProvider,
} from "../providers/shared";
import {
  TStructureMetadataModuleConfigForField,
  TStructureMetadataModuleConfigForModel,
  TPrimitiveMetadataModuleConfigForPrimitive,
  IPrimitiveMetadataModuleConfig,
  IStructureMetadataModuleConfig,
  TKeyPrimitiveMetadataModuleContext,
  TKeyStructureMetadataModuleContext,
} from "./shared";
import { FieldLogicMutater } from "../mutaters/field-mutater";
import { ModelLogicMutater } from "../mutaters/model-mutater";
import { FieldLogicValidation } from "../validators/field-validation";
import { ModelLogicValidation } from "../validators/model-validation";
import { RequestLogicValidation } from "../validators/request-validation";
import { PrimitiveLogicValidation } from "../validators/primitive-validation";
import { PrimitiveLogicMutater } from "../mutaters/primitive-mutater";
import { StructureLogicHook } from "../hooks/structure-hook";
import { PrimitiveLogicHook } from "../hooks/primitive-hook";
import { StructureLogicProvider } from "../providers/structure-provider";
import { PrimitiveLogicProvider } from "../providers/primitive-provider";
import {
  TFieldConfigForCtrl,
  TModelConfigForCtrl,
  TPrimitiveConfigForCtrl,
} from "../controllers/shared";
import {
  TKeyPrimitiveBagModuleContext,
  TKeyStructureBagModuleContext,
} from "../bag/shared";
import {
  TKeyPrimitiveCriteriaModuleContext,
  TKeyStructureCriteriaModuleContext,
} from "../criterias/shared";
import {
  TKeyPrimitiveResponseModuleContext,
  TKeyStructureResponseModuleContext,
} from "../reports/shared";

//████PRIMITIVE████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████

/**... */
export type TPrimitiveMeta = TPrimitiveMetadataModuleConfigForPrimitive;
/**... */
export type Trf_TPrimitiveMeta = TPrimitiveMeta;
/**... */
export type TPrimitiveMetaAndMutater<
  TPrimitiveMutateInstance extends PrimitiveLogicMutater = PrimitiveLogicMutater
> = TPrimitiveMetadataModuleConfigForPrimitive &
  Partial<
    //se reasigna la propiedad del modulo sin cambiar su nombre de identificación
    Record<
      keyof Pick<
        IPrimitiveMetadataModuleConfig["primitiveMeta"],
        "__mutateConfig"
      >,
      TPrimitiveConfigForMutate<TPrimitiveMutateInstance["dfDiccActionConfig"]>
    >
  >;
/**refactorizacion del tipo */
export type Trf_TPrimitiveMetaAndMutater = TPrimitiveMetaAndMutater<any>;
/**... */
export type TPrimitiveMetaAndValidator<
  TPrimitiveValInstance extends PrimitiveLogicValidation = PrimitiveLogicValidation,
  TRequestValInstance extends RequestLogicValidation = RequestLogicValidation
> = TPrimitiveMetadataModuleConfigForPrimitive &
  Partial<
    //se reasigna la propiedad del modulo sin cambiar su nombre de identificación
    Record<
      keyof Pick<
        IPrimitiveMetadataModuleConfig["primitiveMeta"],
        "__valConfig"
      >,
      TPrimitiveConfigForVal<
        TPrimitiveValInstance["dfDiccActionConfig"],
        TRequestValInstance["dfDiccActionConfig"]
      >
    >
  >;
/**refactorizacion del tipo */
export type Trf_TPrimitiveMetaAndValidator = TPrimitiveMetaAndValidator<any>;
/** */
export type TPrimitiveMetaAndHook<
  TPrimitiveHookInstance extends PrimitiveLogicHook = PrimitiveLogicHook
> = TPrimitiveMetadataModuleConfigForPrimitive &
  Partial<
    //se reasigna la propiedad del modulo sin cambiar su nombre de identificacion
    Record<
      keyof Pick<
        IPrimitiveMetadataModuleConfig["primitiveMeta"],
        "__hookConfig"
      >,
      TPrimitiveConfigForHook<TPrimitiveHookInstance["dfDiccActionConfig"]>
    >
  >;
/**Refactorizacion del tipo */
export type Trf_TPrimitiveMetaAndHook = TPrimitiveMetaAndHook<any>;
/** */
export type TPrimitiveMetaAndProvider<
  TPrimitiveProviderInstance extends PrimitiveLogicProvider = PrimitiveLogicProvider
> = TPrimitiveMetadataModuleConfigForPrimitive &
  Partial<
    //se reasigna la propiedad del modulo sin cambiar su nombre de identificacion
    Record<
      keyof Pick<
        IPrimitiveMetadataModuleConfig["primitiveMeta"],
        "__providerConfig"
      >,
      TPrimitiveConfigForProvider<
        TPrimitiveProviderInstance["dfDiccActionConfig"]
      >
    >
  >;
/**Refactorizacion del tipo */
export type Trf_TPrimitiveMetaAndProvider = TPrimitiveMetaAndProvider;
/** */
export type TPrimitiveMetaAndCtrl<
  TPrimitiveMutateInstance extends PrimitiveLogicMutater = PrimitiveLogicMutater,
  TPrimitiveValInstance extends PrimitiveLogicValidation = PrimitiveLogicValidation,
  TRequestValInstance extends RequestLogicValidation = RequestLogicValidation,
  TPrimitiveHookInstance extends PrimitiveLogicHook = PrimitiveLogicHook,
  TPrimitiveProviderInstance extends PrimitiveLogicProvider = PrimitiveLogicProvider,
  TKeyDiccActionRequest extends string = string
> = TPrimitiveMetadataModuleConfigForPrimitive &
  Partial<
    //se reasigna la propiedad del modulo sin cambiar su nombre de identificacion
    Record<
      keyof Pick<
        IPrimitiveMetadataModuleConfig["primitiveMeta"],
        "__ctrlConfig"
      >,
      TPrimitiveConfigForCtrl<
        TPrimitiveMutateInstance,
        TPrimitiveValInstance,
        TRequestValInstance,
        TPrimitiveHookInstance,
        TPrimitiveProviderInstance,
        TKeyDiccActionRequest
      >
    >
  >;
/**Refactorizacion del tipo */
export type Trf_TPrimitiveMetaAndCtrl = TPrimitiveMetaAndCtrl;
/** */
export type TPrimitiveFull<
  TPrimitiveMutateInstance extends PrimitiveLogicMutater = PrimitiveLogicMutater,
  TPrimitiveValInstance extends PrimitiveLogicValidation = PrimitiveLogicValidation,
  TRequestValInstance extends RequestLogicValidation = RequestLogicValidation,
  TPrimitiveHookInstance extends PrimitiveLogicHook = PrimitiveLogicHook,
  TPrimitiveProviderInstance extends PrimitiveLogicProvider = PrimitiveLogicProvider,
  TKeyDiccActionRequest extends string = string
> = TPrimitiveMetadataModuleConfigForPrimitive &
  Partial<
    //se reasigna la propiedad del modulo sin cambiar su nombre de identificacion
    Record<
      keyof Pick<
        IPrimitiveMetadataModuleConfig["primitiveMeta"],
        "__mutateConfig"
      >,
      TPrimitiveConfigForMutate<TPrimitiveMutateInstance["dfDiccActionConfig"]>
    > &
      //se reasigna la propiedad del modulo sin cambiar su nombre de identificacion
      Record<
        keyof Pick<
          IPrimitiveMetadataModuleConfig["primitiveMeta"],
          "__valConfig"
        >,
        TPrimitiveConfigForVal<
          TPrimitiveValInstance["dfDiccActionConfig"],
          TRequestValInstance["dfDiccActionConfig"]
        >
      > &
      //se reasigna la propiedad del modulo sin cambiar su nombre de identificacion
      Record<
        keyof Pick<
          IPrimitiveMetadataModuleConfig["primitiveMeta"],
          "__hookConfig"
        >,
        TPrimitiveConfigForHook<TPrimitiveHookInstance["dfDiccActionConfig"]>
      > &
      //se reasigna la propiedad del modulo sin cambiar su nombre de identificación
      Record<
        keyof Pick<
          IPrimitiveMetadataModuleConfig["primitiveMeta"],
          "__providerConfig"
        >,
        TPrimitiveConfigForProvider<
          TPrimitiveProviderInstance["dfDiccActionConfig"]
        >
      > &
      Record<
        keyof Pick<
          IPrimitiveMetadataModuleConfig["primitiveMeta"],
          "__ctrlConfig"
        >,
        TPrimitiveConfigForCtrl<
          TPrimitiveMutateInstance,
          TPrimitiveValInstance,
          TRequestValInstance,
          TPrimitiveHookInstance,
          TPrimitiveProviderInstance,
          TKeyDiccActionRequest
        >
      >
  >;
/**Refactorización del tipo */
export type Trf_TPrimitiveFull = TPrimitiveFull<any>;
/**claves identificadoras de todos los contextos
 * de módulos internos */
export type TKeyPrimitiveInternalModuleContext =
  | TKeyPrimitiveBagModuleContext
  | TKeyPrimitiveResponseModuleContext
  | TKeyPrimitiveMetadataModuleContext
  | TKeyPrimitiveCriteriaModuleContext
  | TKeyPrimitiveMutateModuleContext
  | TKeyPrimitiveValModuleContext
  | TKeyPrimitiveHookModuleContext
  | TKeyPrimitiveProviderModuleContext;

/**claves identificadoras de todos los contextos
 * de módulos internos */
export type TKeyPrimitiveInternalACModuleContext =
  | TKeyPrimitiveMutateModuleContext
  | TKeyPrimitiveValModuleContext
  | TKeyPrimitiveHookModuleContext
  | TKeyPrimitiveProviderModuleContext;

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
        "__mutateConfig"
      >,
      TFieldConfigForMutate<TFieldMutateInstance["dfDiccActionConfig"]>
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
        "__valConfig"
      >,
      TFieldConfigForVal<TFieldValInstance["dfDiccActionConfig"]>
    >
  > & {
    /**configuración adicional para estructura embebida */
    __emb?: TStructureMetaAndValidator<
      TEmbModel,
      TEmbFieldValInstance,
      TEmbModelValInstance,
      any //❕Los embebidos no tienen acceso a validacion por request❕
    >;
  };
/**refactorización del tipo */
export type Trf_TStructureFieldMetaAndValidator =
  TStructureFieldMetaAndValidator<any>;
/**... */
export type TStructureFieldMetaAndCtrl<
  TFieldMutateInstance extends FieldLogicMutater = FieldLogicMutater,
  TFieldValInstance extends FieldLogicValidation = FieldLogicValidation,
  TEmbModel = unknown, //❕una estructura embebida mas profunda (si la hay)❕
  TEmbModelMutateInstance extends ModelLogicMutater = ModelLogicMutater,
  TEmbModelValInstance extends ModelLogicValidation = ModelLogicValidation
  //TEmbRequestValInstance extends RequestLogicValidation = RequestLogicValidation,
> = TStructureMetadataModuleConfigForField &
  Partial<
    Record<
      keyof Pick<
        IStructureMetadataModuleConfig<any>["fieldMeta"],
        "__ctrlConfig"
      >,
      TFieldConfigForCtrl<TFieldMutateInstance, TFieldValInstance>
    >
  > & {
    /**configuración adicional para estructura embebida */
    __emb?: TStructureMetaAndCtrl<
      TEmbModel,
      TEmbModelMutateInstance,
      TEmbModelValInstance,
      any //❕Los embebidos no tienen acceso a validacion por request❕
    >;
  };
/**refactorizacion del tipo */
export type Trf_TStructureFieldMetaAndCtrl = TStructureFieldMetaAndCtrl<any>;
/**... */
export type TStructureFieldFull<
  TFieldMutateInstance extends FieldLogicMutater = FieldLogicMutater,
  TFieldValInstance extends FieldLogicValidation = FieldLogicValidation,
  TEmbModel = unknown, //❕una estructura embebida mas profunda (si la hay)❕
  TEmbFieldMutateInstance extends FieldLogicMutater = FieldLogicMutater,
  TEmbModelMutateInstance extends ModelLogicMutater = ModelLogicMutater,
  TEmbFieldValInstance extends FieldLogicValidation = FieldLogicValidation,
  TEmbModelValInstance extends ModelLogicValidation = ModelLogicValidation
  //TEmbRequestValInstance extends RequestLogicValidation = RequestLogicValidation,
> = TStructureMetadataModuleConfigForField &
  Partial<
    Record<
      keyof Pick<
        IStructureMetadataModuleConfig<any>["fieldMeta"],
        "__mutateConfig"
      >,
      TFieldConfigForMutate<TFieldMutateInstance["dfDiccActionConfig"]>
    > &
      Record<
        keyof Pick<
          IStructureMetadataModuleConfig<any>["fieldMeta"],
          "__valConfig"
        >,
        TFieldConfigForVal<TFieldValInstance["dfDiccActionConfig"]>
      > &
      Record<
        keyof Pick<
          IStructureMetadataModuleConfig<any>["fieldMeta"],
          "__ctrlConfig"
        >,
        TFieldConfigForCtrl<TFieldMutateInstance, TFieldValInstance>
      >
  > & {
    /**configuración adicional para estructura embebida */
    __emb?: TStructureFull<
      TEmbModel,
      TEmbFieldMutateInstance,
      TEmbModelMutateInstance,
      TEmbFieldValInstance,
      TEmbModelValInstance
      //❕Los embebidos no tienen acceso a validación por request❕
      //❕Los embebidos no tienen acceso a hook❕
      //❕Los embebidos no tienen acceso a providers❕
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
  //se reasigna la propiedad del modulo sin cambiar su nombre de identificacion
  Partial<
    Record<
      keyof Pick<
        IStructureMetadataModuleConfig<any>["modelMeta"],
        "__mutateConfig"
      >,
      TModelConfigForMutate<TModelMutateInstance["dfDiccActionConfig"]>
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
  TModelValInstance extends ModelLogicValidation = ModelLogicValidation,
  TRequestValInstance extends RequestLogicValidation = RequestLogicValidation
> = TStructureMetadataModuleConfigForModel<TModel> &
  //se reasigna la propiedad del modulo sin cambiar su nombre de identificacion
  Partial<
    Record<
      keyof Pick<
        IStructureMetadataModuleConfig<any>["modelMeta"],
        "__valConfig"
      >,
      TModelConfigForVal<
        TModelValInstance["dfDiccActionConfig"],
        TRequestValInstance["dfDiccActionConfig"]
      >
    >
  > &
  //adaptacion para los campos del modelo
  Record<
    keyof TModel,
    TStructureFieldMetaAndValidator<TFieldValInstance>
    //en este nivel es imposible tipar todos los modelos embebidos de cada campo
  >;
/**Refactorización del tipo */
export type Trf_TStructureMetaAndValidator = TStructureMetaAndValidator<any>;
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
        "__hookConfig"
      >,
      TStructureConfigForHook<TStructureHookInstance["dfDiccActionConfig"]>
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
        "__providerConfig"
      >,
      TModelConfigForProvider<TStructureProviderInstance["dfDiccActionConfig"]>
    >
  >;
/**Refactorizacion del tipo */
export type Trf_TStructureMetaAndProvider = TStructureMetaAndProvider<any>;
/** */
export type TStructureMetaAndCtrl<
  TModel,
  TModelMutateInstance extends ModelLogicMutater = ModelLogicMutater,
  TModelValInstance extends ModelLogicValidation = ModelLogicValidation,
  TRequestValInstance extends RequestLogicValidation = RequestLogicValidation,
  TStructureHookInstance extends StructureLogicHook = StructureLogicHook,
  TStructureProviderInstance extends StructureLogicProvider = StructureLogicProvider,
  TKeyDiccActionRequest extends string = string
> = TStructureMetadataModuleConfigForModel<TModel> &
  Partial<
    Record<
      keyof Pick<
        IStructureMetadataModuleConfig<any>["modelMeta"],
        "__ctrlConfig"
      >,
      TModelConfigForCtrl<
        TModelMutateInstance,
        TModelValInstance,
        TRequestValInstance,
        TStructureHookInstance,
        TStructureProviderInstance,
        TKeyDiccActionRequest
      >
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
  TKeyDiccActionRequest extends string = string
> = TStructureMetadataModuleConfigForModel<TModel> &
  //se reasigna la propiedad del modulo sin cambiar su nombre de identificación
  Partial<
    Record<
      keyof Pick<
        IStructureMetadataModuleConfig<any>["modelMeta"],
        "__mutateConfig"
      >,
      TModelConfigForMutate<TModelMutateInstance["dfDiccActionConfig"]>
    > &
      Record<
        keyof Pick<
          IStructureMetadataModuleConfig<any>["modelMeta"],
          "__valConfig"
        >,
        TModelConfigForVal<
          TModelValInstance["dfDiccActionConfig"],
          TRequestValInstance["dfDiccActionConfig"]
        >
      > &
      //se reasigna la propiedad del modulo sin cambiar su nombre de identificación
      Record<
        keyof Pick<
          IStructureMetadataModuleConfig<any>["modelMeta"],
          "__hookConfig"
        >,
        TStructureConfigForHook<TStructureHookInstance["dfDiccActionConfig"]>
      > &
      //se reasigna la propiedad del modulo sin cambiar su nombre de identificacion
      Record<
        keyof Pick<
          IStructureMetadataModuleConfig<any>["modelMeta"],
          "__providerConfig"
        >,
        TModelConfigForProvider<
          TStructureProviderInstance["dfDiccActionConfig"]
        >
      > &
      Record<
        keyof Pick<
          IStructureMetadataModuleConfig<any>["modelMeta"],
          "__ctrlConfig"
        >,
        TModelConfigForCtrl<
          TModelMutateInstance,
          TModelValInstance,
          TRequestValInstance,
          TStructureHookInstance,
          TStructureProviderInstance,
          TKeyDiccActionRequest
        >
      >
  > &
  //adaptacion para los campos del modelo
  Record<
    keyof TModel,
    TStructureFieldFull<
      TFieldMutateInstance,
      TFieldValInstance
      //en este nivel es imposible tipar todos los modelos embebidos de cada campo
    >
  >;
/**Refactorizacion del tipo */
export type Trf_TStructureFull = TStructureFull<any>;
/**claves identificadoras de todos los contextos
 * de módulos internos */
export type TKeyStructureInternalModuleContext =
  | TKeyStructureBagModuleContext
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
  | TKeyStructureProviderModuleContext;
/**claves identificadoras de todos los contextos
 * de módulos internos usados en el controller
 * en contexto model */
export type TKeyFieldInternalModuleContext =
  | TKeyStructureBagModuleContext
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
  | TKeyStructureBagModuleContext
  | TKeyStructureResponseModuleContext
  | Extract<TKeyStructureMetadataModuleContext, "modelMeta">
  | TKeyStructureCriteriaModuleContext
  | Extract<TKeyStructureDeepMutateModuleContext, "modelMutate">
  | Extract<TKeyStructureDeepValModuleContext, "modelVal">
  | TKeyStructureHookModuleContext
  | TKeyStructureProviderModuleContext;
/**claves identificadoras de todos los contextos
 * de módulos internos usados en el controller
 * en contexto model*/
export type TKeyModelInternalACModuleContext =
  | Extract<TKeyStructureDeepMutateModuleContext, "modelMutate">
  | Extract<TKeyStructureDeepValModuleContext, "modelVal">
  | TKeyStructureHookModuleContext
  | TKeyStructureProviderModuleContext;
