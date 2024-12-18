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
} from "./metadata-handler-shared";
import { IDiccFieldMutateActionConfigG } from "../mutaters/field-mutater";
import { IDiccModelMutateActionConfigG } from "../mutaters/model-mutater";
import { IDiccFieldValActionConfigG } from "../validators/field-validation";
import { IDiccModelValActionConfigG } from "../validators/model-validation";
import { IDiccRequestValActionConfigG } from "../validators/request-validation";
import { IDiccPrimitiveValActionConfigG } from "../validators/primitive-validation";
import { IDiccPrimitiveMutateActionConfigG } from "../mutaters/primitive-mutater";
import { IDiccStructureHookActionConfigG } from "../hooks/structure-hook";
import { IDiccPrimitiveHookActionConfigG } from "../hooks/primitive-hook";
import { IDiccStructureProviderActionConfigG } from "../providers/structure-provider";
import { IDiccPrimitiveProviderActionConfigG } from "../providers/primitive-provider";
import {
  TFieldConfigForCtrl,
  TModelConfigForCtrl,
  TPrimitiveConfigForCtrl,
} from "../controllers/_shared";
import {
  TKeyPrimitiveBagModuleContext,
  TKeyStructureBagModuleContext,
} from "../bag-module/shared";
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
  TIDiccPrimitiveMutateAC = IDiccPrimitiveMutateActionConfigG
> = TPrimitiveMetadataModuleConfigForPrimitive &
  Partial<
    //se reasigna la propiedad del modulo sin cambiar su nombre de identificacion
    Record<
      keyof Pick<
        IPrimitiveMetadataModuleConfig["primitiveMeta"],
        "__mutateConfig"
      >,
      TPrimitiveConfigForMutate<TIDiccPrimitiveMutateAC>
    >
  >;
/**refactorizacion del tipo */
export type Trf_TPrimitiveMetaAndMutater = TPrimitiveMetaAndMutater<any>;
/**... */
export type TPrimitiveMetaAndValidator<
  TIDiccPrimitiveValAC = IDiccPrimitiveValActionConfigG,
  TIDiccRequestValAC = IDiccRequestValActionConfigG
> = TPrimitiveMetadataModuleConfigForPrimitive &
  Partial<
    //se reasigna la propiedad del modulo sin cambiar su nombre de identificacion
    Record<
      keyof Pick<
        IPrimitiveMetadataModuleConfig["primitiveMeta"],
        "__valConfig"
      >,
      TPrimitiveConfigForVal<TIDiccPrimitiveValAC, TIDiccRequestValAC>
    >
  >;
/**refactorizacion del tipo */
export type Trf_TPrimitiveMetaAndValidator = TPrimitiveMetaAndValidator<any>;
/** */
export type TPrimitiveMetaAndHook<
  TIDiccPrimitiveHookAC = IDiccPrimitiveHookActionConfigG
> = TPrimitiveMetadataModuleConfigForPrimitive &
  Partial<
    //se reasigna la propiedad del modulo sin cambiar su nombre de identificacion
    Record<
      keyof Pick<
        IPrimitiveMetadataModuleConfig["primitiveMeta"],
        "__hookConfig"
      >,
      TPrimitiveConfigForHook<TIDiccPrimitiveHookAC>
    >
  >;
/**Refactorizacion del tipo */
export type Trf_TPrimitiveMetaAndHook = TPrimitiveMetaAndHook<any>;
/** */
export type TPrimitiveMetaAndProvider<
  TIDiccPrimitiveProviderAC = IDiccPrimitiveProviderActionConfigG
> = TPrimitiveMetadataModuleConfigForPrimitive &
  Partial<
    //se reasigna la propiedad del modulo sin cambiar su nombre de identificacion
    Record<
      keyof Pick<
        IPrimitiveMetadataModuleConfig["primitiveMeta"],
        "__providerConfig"
      >,
      TPrimitiveConfigForProvider<TIDiccPrimitiveProviderAC>
    >
  >;
/**Refactorizacion del tipo */
export type Trf_TPrimitiveMetaAndProvider = TPrimitiveMetaAndProvider;
/** */
export type TPrimitiveMetaAndCtrl<
  TIDiccPrimitiveMutateAC = IDiccPrimitiveMutateActionConfigG,
  TIDiccPrimitiveValAC = IDiccPrimitiveValActionConfigG,
  TIDiccRequestValAC = IDiccRequestValActionConfigG,
  TIDiccPrimitiveHookAC = IDiccPrimitiveHookActionConfigG,
  TIDiccPrimitiveProviderAC = IDiccPrimitiveProviderActionConfigG,
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
        TIDiccPrimitiveMutateAC &
          TIDiccPrimitiveValAC &
          TIDiccRequestValAC &
          TIDiccPrimitiveHookAC &
          TIDiccPrimitiveProviderAC,
        TKeyDiccActionRequest
      >
    >
  >;
/**Refactorizacion del tipo */
export type Trf_TPrimitiveMetaAndCtrl = TPrimitiveMetaAndCtrl;
/** */
export type TPrimitiveFull<
  TIDiccPrimitiveMutateAC = IDiccPrimitiveMutateActionConfigG,
  TIDiccPrimitiveValAC = IDiccPrimitiveValActionConfigG,
  TIDiccRequestValAC = IDiccRequestValActionConfigG,
  TIDiccPrimitiveHookAC = IDiccPrimitiveHookActionConfigG,
  TIDiccPrimitiveProviderAC = IDiccPrimitiveProviderActionConfigG,
  TKeyDiccActionRequest extends string = string
> = TPrimitiveMetadataModuleConfigForPrimitive &
  Partial<
    //se reasigna la propiedad del modulo sin cambiar su nombre de identificacion
    Record<
      keyof Pick<
        IPrimitiveMetadataModuleConfig["primitiveMeta"],
        "__mutateConfig"
      >,
      TPrimitiveConfigForMutate<TIDiccPrimitiveMutateAC>
    > &
      //se reasigna la propiedad del modulo sin cambiar su nombre de identificacion
      Record<
        keyof Pick<
          IPrimitiveMetadataModuleConfig["primitiveMeta"],
          "__valConfig"
        >,
        TPrimitiveConfigForVal<TIDiccPrimitiveValAC, TIDiccRequestValAC>
      > &
      //se reasigna la propiedad del modulo sin cambiar su nombre de identificacion
      Record<
        keyof Pick<
          IPrimitiveMetadataModuleConfig["primitiveMeta"],
          "__hookConfig"
        >,
        TPrimitiveConfigForHook<TIDiccPrimitiveHookAC>
      > &
      //se reasigna la propiedad del modulo sin cambiar su nombre de identificacion
      Record<
        keyof Pick<
          IPrimitiveMetadataModuleConfig["primitiveMeta"],
          "__providerConfig"
        >,
        TPrimitiveConfigForProvider<TIDiccPrimitiveProviderAC>
      > &
      Record<
        keyof Pick<
          IPrimitiveMetadataModuleConfig["primitiveMeta"],
          "__ctrlConfig"
        >,
        TPrimitiveConfigForCtrl<
          TIDiccPrimitiveMutateAC &
            TIDiccPrimitiveValAC &
            TIDiccRequestValAC &
            TIDiccPrimitiveHookAC &
            TIDiccPrimitiveProviderAC,
          TKeyDiccActionRequest
        >
      >
  >;
/**Refactorizacion del tipo */
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
  TIDiccFieldMutateAC = IDiccFieldMutateActionConfigG,
  TEmbModel = unknown, //❕una estructura embebida mas profunda (si la hay)❕
  TIDiccEmbFieldMutateAC = IDiccFieldMutateActionConfigG,
  TIDiccEmbModelMutateAC = IDiccModelMutateActionConfigG
> = TStructureMetadataModuleConfigForField &
  Partial<
    Record<
      keyof Pick<
        IStructureMetadataModuleConfig<any>["fieldMeta"],
        "__mutateConfig"
      >,
      TFieldConfigForMutate<TIDiccFieldMutateAC>
    >
  > & {
    /**configuracion adicional para estructura embebida */
    __emb?: TStructureMetaAndMutater<
      TEmbModel,
      TIDiccEmbFieldMutateAC,
      TIDiccEmbModelMutateAC
    >;
  };
/**refactorizacion del tipo */
export type Trf_TStructureFieldMetaAndMutater = TStructureFieldMetaAndMutater<
  any,
  any,
  any,
  any
>;
/**... */
export type TStructureFieldMetaAndValidator<
  TIDiccFieldValAC = IDiccFieldValActionConfigG,
  TEmbModel = unknown, //❕una estructura embebida mas profunda (si la hay)❕
  TIDiccEmbFieldValAC = IDiccFieldValActionConfigG,
  TIDiccEmbModelValAC = IDiccModelValActionConfigG
  // TIDiccEmbRequestValAC = IDiccRequestValActionConfigG
> = TStructureMetadataModuleConfigForField &
  Partial<
    Record<
      keyof Pick<
        IStructureMetadataModuleConfig<any>["fieldMeta"],
        "__valConfig"
      >,
      TFieldConfigForVal<TIDiccFieldValAC>
    >
  > & {
    /**configuracion adicional para estructura embebida */
    __emb?: TStructureMetaAndValidator<
      TEmbModel,
      TIDiccEmbFieldValAC,
      TIDiccEmbModelValAC,
      any //❕Los embebidos no tienen acceso a validacion por request❕
    >;
  };
/**refactorizacion del tipo */
export type Trf_TStructureFieldMetaAndValidator =
  TStructureFieldMetaAndValidator<any, any, any, any>;
/**... */
export type TStructureFieldMetaAndCtrl<
  TIDiccFieldMutateAC = IDiccFieldMutateActionConfigG,
  TIDiccFieldValAC = IDiccFieldValActionConfigG,
  TEmbModel = unknown, //❕una estructura embebida mas profunda (si la hay)❕
  TIDiccEmbModelMutateAC = IDiccModelMutateActionConfigG,
  TIDiccEmbModelValAC = IDiccModelValActionConfigG
  // TIDiccEmbRequestValAC = IDiccRequestValActionConfigG
> = TStructureMetadataModuleConfigForField &
  Partial<
    Record<
      keyof Pick<
        IStructureMetadataModuleConfig<any>["fieldMeta"],
        "__ctrlConfig"
      >,
      TFieldConfigForCtrl<TIDiccFieldMutateAC & TIDiccFieldValAC>
    >
  > & {
    /**configuracion adicional para estructura embebida */
    __emb?: TStructureMetaAndCtrl<
      TEmbModel,
      TIDiccEmbModelMutateAC,
      TIDiccEmbModelValAC,
      any //❕Los embebidos no tienen acceso a validacion por request❕
    >;
  };
/**refactorizacion del tipo */
export type Trf_TStructureFieldMetaAndCtrl = TStructureFieldMetaAndCtrl<
  any,
  any,
  any,
  any
>;
/**... */
export type TStructureFieldFull<
  TIDiccFieldMutateAC = IDiccFieldMutateActionConfigG,
  TIDiccFieldValAC = IDiccFieldValActionConfigG,
  TEmbModel = unknown, //❕una estructura embebida mas profunda (si la hay)❕
  TIDiccEmbFieldMutateAC = IDiccFieldMutateActionConfigG,
  TIDiccEmbModelMutateAC = IDiccModelMutateActionConfigG,
  TIDiccEmbFieldValAC = IDiccFieldValActionConfigG,
  TIDiccEmbModelValAC = IDiccModelValActionConfigG
  // TIDiccEmbRequestValAC = IDiccRequestValActionConfigG
> = TStructureMetadataModuleConfigForField &
  Partial<
    Record<
      keyof Pick<
        IStructureMetadataModuleConfig<any>["fieldMeta"],
        "__mutateConfig"
      >,
      TFieldConfigForMutate<TIDiccFieldMutateAC>
    > &
      Record<
        keyof Pick<
          IStructureMetadataModuleConfig<any>["fieldMeta"],
          "__valConfig"
        >,
        TFieldConfigForVal<TIDiccFieldValAC>
      > &
      Record<
        keyof Pick<
          IStructureMetadataModuleConfig<any>["fieldMeta"],
          "__ctrlConfig"
        >,
        TFieldConfigForCtrl<TIDiccFieldMutateAC & TIDiccFieldValAC>
      >
  > & {
    /**configuracion adicional para estructura embebida */
    __emb?: TStructureFull<
      TEmbModel,
      TIDiccEmbFieldMutateAC,
      TIDiccEmbModelMutateAC,
      TIDiccEmbFieldValAC,
      TIDiccEmbModelValAC,
      any, //❕Los embebidos no tienen acceso a validacion por request❕
      any //❕Los embebidos no tienen acceso a hook❕
    >;
  };
/**refactorizacion del tipo */
export type Trf_TStructureFieldFull = TStructureFieldFull<
  any,
  any,
  any,
  any,
  any,
  any,
  any
>;
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
  TIDiccFieldMutateAC = IDiccFieldMutateActionConfigG,
  TIDiccModelMutateAC = IDiccModelMutateActionConfigG
> = TStructureMetadataModuleConfigForModel<TModel> &
  //se reasigna la propiedad del modulo sin cambiar su nombre de identificacion
  Partial<
    Record<
      keyof Pick<
        IStructureMetadataModuleConfig<any>["modelMeta"],
        "__mutateConfig"
      >,
      TModelConfigForMutate<TIDiccModelMutateAC>
    >
  > &
  //adaptacion para los campos del modelo
  Record<
    keyof TModel,
    TStructureFieldMetaAndMutater<
      TIDiccFieldMutateAC,
      any, //en este nivel es imposible tipar todos los modelos embebidos de cada campo
      any, //en este nivel es imposible tipar todos los modelos embebidos de cada campo
      any //en este nivel es imposible tipar todos los modelos embebidos de cada campo
    >
  >;
/**Refactorizacion del tipo */
export type Trf_TStructureMetaAndMutater = TStructureMetaAndMutater<
  any,
  any,
  any
>;
/** */
export type TStructureMetaAndValidator<
  TModel,
  TIDiccFieldValAC = IDiccFieldValActionConfigG,
  TIDiccModelValAC = IDiccModelValActionConfigG,
  TIDiccRequestValAC = IDiccRequestValActionConfigG
> = TStructureMetadataModuleConfigForModel<TModel> &
  //se reasigna la propiedad del modulo sin cambiar su nombre de identificacion
  Partial<
    Record<
      keyof Pick<
        IStructureMetadataModuleConfig<any>["modelMeta"],
        "__valConfig"
      >,
      TModelConfigForVal<TIDiccModelValAC, TIDiccRequestValAC>
    >
  > &
  //adaptacion para los campos del modelo
  Record<
    keyof TModel,
    TStructureFieldMetaAndValidator<
      TIDiccFieldValAC,
      any, //en este nivel es imposible tipar todos los modelos embebidos de cada campo
      any, //en este nivel es imposible tipar todos los modelos embebidos de cada campo
      any //en este nivel es imposible tipar todos los modelos embebidos de cada campo
    >
  >;
/**Refactorizacion del tipo */
export type Trf_TStructureMetaAndValidator = TStructureMetaAndValidator<
  any,
  any,
  any,
  any
>;
/** */
export type TStructureMetaAndHook<
  TModel,
  TIDiccStructureHookAC = IDiccStructureHookActionConfigG
> = TStructureMetadataModuleConfigForModel<TModel> &
  //se reasigna la propiedad del modulo sin cambiar su nombre de identificacion
  Partial<
    Record<
      keyof Pick<
        IStructureMetadataModuleConfig<any>["modelMeta"],
        "__hookConfig"
      >,
      TStructureConfigForHook<TIDiccStructureHookAC>
    >
  >;
/**Refactorizacion del tipo */
export type Trf_TStructureMetaAndHook = TStructureMetaAndHook<any, any>;
/** */
export type TStructureMetaAndProvider<
  TModel,
  TIDiccStructureProviderAC = IDiccStructureProviderActionConfigG
> = TStructureMetadataModuleConfigForModel<TModel> &
  //se reasigna la propiedad del modulo sin cambiar su nombre de identificacion
  Partial<
    Record<
      keyof Pick<
        IStructureMetadataModuleConfig<any>["modelMeta"],
        "__providerConfig"
      >,
      TModelConfigForProvider<TIDiccStructureProviderAC>
    >
  >;
/**Refactorizacion del tipo */
export type Trf_TStructureMetaAndProvider = TStructureMetaAndProvider<any>;
/** */
export type TStructureMetaAndCtrl<
  TModel,
  TIDiccModelMutateAC = IDiccModelMutateActionConfigG,
  TIDiccModelValAC = IDiccModelValActionConfigG,
  TIDiccRequestValAC = IDiccRequestValActionConfigG,
  TIDiccStructureHookAC = IDiccStructureHookActionConfigG,
  TIDiccStructureProviderAC = IDiccStructureProviderActionConfigG,
  TKeyDiccActionRequest extends string = string
> = TStructureMetadataModuleConfigForModel<TModel> &
  //se reasigna la propiedad del modulo sin cambiar su nombre de identificacion
  Partial<
    Record<
      keyof Pick<
        IStructureMetadataModuleConfig<any>["modelMeta"],
        "__ctrlConfig"
      >,
      TModelConfigForCtrl<
        TIDiccModelMutateAC &
          TIDiccModelValAC &
          TIDiccRequestValAC &
          TIDiccStructureHookAC &
          TIDiccStructureProviderAC,
        TKeyDiccActionRequest
      >
    >
  >;
/**... */
export type Trf_TStructureMetaAndCtrl = TStructureMetaAndCtrl<any>;
/** */
export type TStructureFull<
  TModel,
  TIDiccFieldMutateAC = IDiccFieldMutateActionConfigG,
  TIDiccModelMutateAC = IDiccModelMutateActionConfigG,
  TIDiccFieldValAC = IDiccFieldValActionConfigG,
  TIDiccModelValAC = IDiccModelValActionConfigG,
  TIDiccRequestValAC = IDiccRequestValActionConfigG,
  TIDiccStructureHookAC = IDiccStructureHookActionConfigG,
  TIDiccStructureProviderAC = IDiccStructureProviderActionConfigG,
  TKeyDiccActionRequest extends string = string
> = TStructureMetadataModuleConfigForModel<TModel> &
  //se reasigna la propiedad del modulo sin cambiar su nombre de identificacion
  Partial<
    Record<
      keyof Pick<
        IStructureMetadataModuleConfig<any>["modelMeta"],
        "__mutateConfig"
      >,
      TModelConfigForMutate<TIDiccModelMutateAC>
    > &
      //se reasigna la propiedad del modulo sin cambiar su nombre de identificacion
      Record<
        keyof Pick<
          IStructureMetadataModuleConfig<any>["modelMeta"],
          "__valConfig"
        >,
        TModelConfigForVal<TIDiccModelValAC, TIDiccRequestValAC>
      > &
      //se reasigna la propiedad del modulo sin cambiar su nombre de identificacion
      Record<
        keyof Pick<
          IStructureMetadataModuleConfig<any>["modelMeta"],
          "__hookConfig"
        >,
        TStructureConfigForHook<TIDiccStructureHookAC>
      > &
      //se reasigna la propiedad del modulo sin cambiar su nombre de identificacion
      Record<
        keyof Pick<
          IStructureMetadataModuleConfig<any>["modelMeta"],
          "__providerConfig"
        >,
        TModelConfigForProvider<TIDiccStructureProviderAC>
      > &
      Record<
        keyof Pick<
          IStructureMetadataModuleConfig<any>["modelMeta"],
          "__ctrlConfig"
        >,
        TModelConfigForCtrl<
          TIDiccModelMutateAC &
            TIDiccModelValAC &
            TIDiccRequestValAC &
            TIDiccStructureHookAC &
            TIDiccStructureProviderAC,
          TKeyDiccActionRequest
        >
      >
  > &
  //adaptacion para los campos del modelo
  Record<
    keyof TModel,
    TStructureFieldFull<
      TIDiccFieldMutateAC,
      TIDiccFieldValAC,
      any, //en este nivel es imposible tipar todos los modelos embebidos de cada campo
      any, //en este nivel es imposible tipar todos los modelos embebidos de cada campo
      any, //en este nivel es imposible tipar todos los modelos embebidos de cada campo
      any, //en este nivel es imposible tipar todos los modelos embebidos de cada campo
      any //en este nivel es imposible tipar todos los modelos embebidos de cada campo
    >
  >;
/**Refactorizacion del tipo */
export type Trf_TStructureFull = TStructureFull<
  any,
  any,
  any,
  any,
  any,
  any,
  any
>;
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
