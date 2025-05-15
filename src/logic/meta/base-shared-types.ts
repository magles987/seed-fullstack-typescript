import { PrimitiveLogicController } from "../controllers/primitive-ctrl";
import {
  TKeyPrimitiveReadRequestCtrl,
  TKeyPrimitiveModifyRequestCtrl,
  IPrimitiveCtrlContext,
  TPrimitiveCtrlBaseConfig,
  TKeyStructureReadRequestCtrl,
  TKeyStructureModifyRequestCtrl,
  IStructureCtrlContext,
  TFieldCtrlBaseConfig,
  TModelCtrlBaseConfig,
  IStructureCtrlContextInstance,
} from "../controllers/shared-types";
import { StructureLogicController } from "../controllers/structure-ctrl";
import { PrimitiveLogicHook } from "../hooks/primitive-hook";
import {
  IPrimitiveHookContext,
  TPrimitiveHookBaseConfig,
  IStructureHookContext,
  TStructureHookBaseConfig,
  IStructureHookContextInstance,
} from "../hooks/shared-types";
import { StructureLogicHook } from "../hooks/structure-hook";
import { FieldLogicMutater } from "../mutaters/field-mutater";
import { ModelLogicMutater } from "../mutaters/model-mutater";
import { PrimitiveLogicMutater } from "../mutaters/primitive-mutater";
import {
  IPrimitiveMutateContext,
  TPrimitiveMutateBaseConfig,
  IStructureDeepMutateContext,
  TFieldMutateBaseConfig,
  TModelMutateBaseConfig,
  IStructureMutateContextInstance,
} from "../mutaters/shared-types";
import { AxiosDriver } from "../providers/drivers/client/web/https/axios/axios-driver";
import { FetchDriver } from "../providers/drivers/client/web/https/fetch/fetch-driver";
import { CookieDriver } from "../providers/drivers/client/web/local-repositories/cookie/cookie-driver";
import { IdbDriver } from "../providers/drivers/client/web/local-repositories/idb/idb-driver";
import { StorageDriver } from "../providers/drivers/client/web/local-repositories/storage/storage-driver";
import { TDriverList } from "../providers/drivers/shared-types";
import { PrimitiveLogicProvider } from "../providers/primitive-provider";
import {
  IPrimitiveProviderContext,
  TPrimitiveProviderBaseConfig,
  IStructureProviderContext,
  TStructureProviderBaseConfig,
  IStructureProviderContextInstance,
} from "../providers/shared-types";
import { StructureLogicProvider } from "../providers/structure-provider";
import { FieldLogicValidation } from "../validators/field-validation";
import { ModelLogicValidation } from "../validators/model-validation";
import { PrimitiveLogicValidation } from "../validators/primitive-validation";
import { RequestLogicValidation } from "../validators/request-validation";
import {
  IPrimitiveValContext,
  TPrimitiveValBaseConfig,
  TRequestValBaseConfig,
  IStructureDeepValContext,
  TFieldValBaseConfig,
  TModelValBaseConfig,
  IStructureValContextInstance,
} from "../validators/shared-types";
import { TStructureFull } from "./schema-shared-types";
import {
  TPrimitiveMetadataModuleConfigForPrimitive,
  IPrimitiveMetadataModuleConfig,
  TStructureMetadataModuleConfigForField,
  IStructureMetadataModuleConfig,
  TStructureMetadataModuleConfigForModel,
} from "./shared-types";

//████GLOBAL████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**tipo para unir ambos diccionarios (read y modify) de claves de peticiones */
export type TKeyFullDiccRequestAction<
  TKeyCustomReadRequestCtrl,
  TKeyCustomModifyRequestCtrl
> = TKeyCustomReadRequestCtrl | TKeyCustomModifyRequestCtrl;
export type TRequestValInstance<
  TRequestVal extends RequestLogicValidation = RequestLogicValidation
> = TRequestVal;
export type TCookieDriverInstance<
  TCookieDriver extends CookieDriver = CookieDriver
> = TCookieDriver;
export type TStorageDriverInstance<
  TStorageDriver extends StorageDriver = StorageDriver
> = TStorageDriver;
export type TIdbDriverInstance<TIdbDriver extends IdbDriver = IdbDriver> =
  TIdbDriver;
export type TFetchDriverInstance<
  TFetchDriver extends FetchDriver = FetchDriver
> = TFetchDriver;
export type TAxiosDriverInstance<
  TAxiosDriver extends AxiosDriver = AxiosDriver
> = TAxiosDriver;
/**tipado para la lista de instancias de drivers a usar en el controller */
export type TBaseDriversList = TDriverList;
//████ PRIMITIVE ████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████

export type TPrimitiveMutateInstance<
  TPrimitiveMutate extends PrimitiveLogicMutater = PrimitiveLogicMutater
> = TPrimitiveMutate;
export type TPrimitiveValInstance<
  TPrimitiveVal extends PrimitiveLogicValidation = PrimitiveLogicValidation
> = TPrimitiveVal;
export type TPrimitiveHookInstance<
  TPrimitiveHook extends PrimitiveLogicHook = PrimitiveLogicHook
> = TPrimitiveHook;
export type TPrimitiveProviderInstance<
  TPrimitiveProvider extends PrimitiveLogicProvider = PrimitiveLogicProvider
> = TPrimitiveProvider;
/**tipo para unir ambos diccionarios (read y modify) de claves de peticiones */
export type TKeyPrimitiveDiccActionRequest<
  TKeyCustomReadRequestCtrl,
  TKeyCustomModifyRequestCtrl
> =
  | TKeyPrimitiveReadRequestCtrl
  | TKeyPrimitiveModifyRequestCtrl
  | TKeyCustomReadRequestCtrl
  | TKeyCustomModifyRequestCtrl;
/** */
export type TPrimitiveCtrlInstance<
  TValue,
  TPrimitiveMutateInstance extends PrimitiveLogicMutater,
  TPrimitiveValInstance extends PrimitiveLogicValidation,
  TRequestValInstance extends RequestLogicValidation,
  TPrimitiveHookInstance extends PrimitiveLogicHook,
  TPrimitiveProviderInstance extends PrimitiveLogicProvider,
  TKeyDiccActionRequest extends string,
  TPrimitiveCtrl extends PrimitiveLogicController<
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
> = TPrimitiveCtrl;
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
      Partial<
        IPrimitiveMutateContext<
          | TPrimitiveMutateInstance // o la instancia
          | TPrimitiveMutateBaseConfig // o la base de configuración
        >["primitiveMutate"]
      >
    > &
      //se reasigna la propiedad del modulo sin cambiar su nombre de identificacion
      Record<
        keyof Pick<
          IPrimitiveMetadataModuleConfig<TValue>["primitiveMeta"],
          "__valInstance"
        >,
        IPrimitiveValContext<
          | TPrimitiveValInstance // o la instancia
          | TPrimitiveValBaseConfig, // o la base de configuración
          any
        >["primitiveVal"]
      > &
      //se reasigna la propiedad del modulo sin cambiar su nombre de identificacion
      Record<
        keyof Pick<
          IPrimitiveMetadataModuleConfig<TValue>["primitiveMeta"],
          "__requestValInstance"
        >,
        IPrimitiveValContext<
          any,
          | TRequestValInstance // o la instancia
          | TRequestValBaseConfig // o la base de configuración
        >["requestVal"]
      > &
      //se reasigna la propiedad del modulo sin cambiar su nombre de identificacion
      Record<
        keyof Pick<
          IPrimitiveMetadataModuleConfig<TValue>["primitiveMeta"],
          "__hookInstance"
        >,
        IPrimitiveHookContext<
          | TPrimitiveHookInstance // o la instancia
          | TPrimitiveHookBaseConfig // o la base de configuración
        >["primitiveHook"]
      > &
      //se reasigna la propiedad del modulo sin cambiar su nombre de identificación
      Record<
        keyof Pick<
          IPrimitiveMetadataModuleConfig<TValue>["primitiveMeta"],
          "__providerInstance"
        >,
        IPrimitiveProviderContext<
          | TPrimitiveProviderInstance // o la instancia
          | TPrimitiveProviderBaseConfig // o la base de configuración
        >["primitiveProvider"]
      > &
      Record<
        keyof Pick<
          IPrimitiveMetadataModuleConfig<TValue>["primitiveMeta"],
          "__ctrlInstance"
        >,
        IPrimitiveCtrlContext<
          | TPrimitiveCtrlInstance
          | TPrimitiveCtrlBaseConfig<
              TPrimitiveMutateInstance,
              TPrimitiveValInstance,
              TRequestValInstance,
              TPrimitiveHookInstance,
              TPrimitiveProviderInstance,
              TKeyDiccActionRequest
            >
        >
      >
  >;

//████ STRUCTURE ████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████

export type TFieldMutateInstance<
  TFieldMutate extends FieldLogicMutater = FieldLogicMutater
> = TFieldMutate;
export type TModelMutateInstance<
  TModelMutate extends ModelLogicMutater = ModelLogicMutater
> = TModelMutate;
export type TFieldValInstance<
  TFieldVal extends FieldLogicValidation = FieldLogicValidation
> = TFieldVal;
export type TModelValInstance<
  TModelVal extends ModelLogicValidation = ModelLogicValidation
> = TModelVal;
export type TStructureHookInstance<
  TStructureHook extends StructureLogicHook = StructureLogicHook
> = TStructureHook;
export type TStructureProviderInstance<
  TStructureProvider extends StructureLogicProvider = StructureLogicProvider
> = TStructureProvider;
/**tipo para unir ambos diccionarios (read y modify) de claves de peticiones */
export type TKeyStructureDiccActionRequest<
  TKeyCustomReadRequestCtrl,
  TKeyCustomModifyRequestCtrl
> =
  | TKeyStructureReadRequestCtrl
  | TKeyStructureModifyRequestCtrl
  | TKeyCustomReadRequestCtrl
  | TKeyCustomModifyRequestCtrl;
export type TStructureCtrlInstance<
  TModel,
  TFieldMutateInstance extends FieldLogicMutater,
  TModelMutateInstance extends ModelLogicMutater,
  TFieldValInstance extends FieldLogicValidation,
  TModelValInstance extends ModelLogicValidation,
  TRequestValInstance extends RequestLogicValidation,
  TStructureHookInstance extends StructureLogicHook,
  TStructureProviderInstance extends StructureLogicProvider,
  TKeyDiccActionRequest extends string,
  TStructureCtrl extends StructureLogicController<
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
> = TStructureCtrl;
/**... */
export type TStructureBaseMetadataForField<
  TFieldMutateInstance extends FieldLogicMutater = FieldLogicMutater,
  TFieldValInstance extends FieldLogicValidation = FieldLogicValidation,
  TStructureHookInstance extends StructureLogicHook = StructureLogicHook,
  TStructureCtrlInstance extends StructureLogicController<
    //❗dejarlo para posibles actualizaciones❗
    any,
    TFieldMutateInstance,
    any,
    TFieldValInstance,
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
  TEmbStructureHookInstance extends StructureLogicHook = StructureLogicHook,
  TEmbStructureCtrlInstance extends StructureLogicController<
    TEmbModel,
    TEmbFieldMutateInstance,
    TEmbModelMutateInstance,
    TEmbFieldValInstance,
    TEmbModelValInstance,
    any,
    any,
    any,
    any
  > = StructureLogicController<
    TEmbModel,
    TEmbFieldMutateInstance,
    TEmbModelMutateInstance,
    TEmbFieldValInstance,
    TEmbModelValInstance,
    any,
    any,
    any,
    any
  >
> = TStructureMetadataModuleConfigForField &
  Partial<
    Record<
      keyof Pick<
        IStructureMetadataModuleConfig<any>["fieldMeta"],
        "__mutateInstance"
      >,
      IStructureDeepMutateContext<
        | TFieldMutateInstance // o la instancia
        | TFieldMutateBaseConfig // o la base de configuración
      >["fieldMutate"]
    > &
      Record<
        keyof Pick<
          IStructureMetadataModuleConfig<any>["fieldMeta"],
          "__valInstance"
        >,
        IStructureDeepValContext<
          | TFieldValInstance // o la instancia
          | TFieldValBaseConfig // o la base de configuración
        >["fieldVal"]
      > &
      Record<
        keyof Pick<
          IStructureMetadataModuleConfig<any>["fieldMeta"],
          "__hookInstance"
        >,
        IStructureHookContext<
          | TStructureHookInstance // o la instancia
          | TStructureHookBaseConfig // o la base de configuración
        >["structureHook"]
      > &
      Record<
        keyof Pick<
          IStructureMetadataModuleConfig<any>["fieldMeta"],
          "__ctrlInstance"
        >,
        IStructureCtrlContext<
          //❗la instancia es la misma que el modelo❗, por eso no se permite instanciar aquí
          //| TStructureCtrlInstance
          TFieldCtrlBaseConfig<TFieldMutateInstance, TFieldValInstance>
        >["structureCtrl"]
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
      string,
      TEmbStructureCtrlInstance
    >;
  };
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
      IStructureDeepMutateContext<
        any,
        | TModelMutateInstance // o la instancia
        | TModelMutateBaseConfig // o la base de configuración
      >["modelMutate"]
    > &
      Record<
        keyof Pick<
          IStructureMetadataModuleConfig<any>["modelMeta"],
          "__valInstance"
        >,
        IStructureDeepValContext<
          any,
          | TModelValInstance // o la instancia
          | TModelValBaseConfig, // o la base de configuración
          any
        >["modelVal"]
      > &
      Record<
        keyof Pick<
          IStructureMetadataModuleConfig<any>["modelMeta"],
          "__requestValInstance"
        >,
        IStructureDeepValContext<
          any,
          any,
          | TRequestValInstance // o la instancia
          | TRequestValBaseConfig // o la base de configuración
        >["requestVal"]
      > &
      //se reasigna la propiedad del modulo sin cambiar su nombre de identificación
      Record<
        keyof Pick<
          IStructureMetadataModuleConfig<any>["modelMeta"],
          "__hookInstance"
        >,
        IStructureHookContext<
          | TStructureHookInstance // o la instancia
          | TStructureHookBaseConfig // o la base de configuración
        >["structureHook"]
      > &
      //se reasigna la propiedad del modulo sin cambiar su nombre de identificacion
      Record<
        keyof Pick<
          IStructureMetadataModuleConfig<any>["modelMeta"],
          "__providerInstance"
        >,
        IStructureProviderContext<
          | TStructureProviderInstance // o la instancia
          | TStructureProviderBaseConfig // o la base de configuración
        >["structureProvider"]
      > &
      Record<
        keyof Pick<
          IStructureMetadataModuleConfig<any>["modelMeta"],
          "__ctrlInstance"
        >,
        IStructureCtrlContext<
          | TStructureCtrlInstance // o la instancia
          | TModelCtrlBaseConfig<
              // o la base de configuración
              TModel,
              TModelMutateInstance,
              TModelValInstance,
              TRequestValInstance,
              TStructureHookInstance,
              TStructureProviderInstance,
              TKeyDiccActionRequest
            >
        >["structureCtrl"]
      >
  > &
  //adaptación para los campos del modelo
  Record<
    keyof TModel,
    TStructureBaseMetadataForField<
      TFieldMutateInstance,
      TFieldValInstance,
      TStructureHookInstance,
      TStructureCtrlInstance
      //en este nivel es imposible tipar todos los modelos embebidos de cada campo
    >
  >;
/**... */
export type TStructureDiccModuleInstance<
  TModel,
  TFieldMutateInstance extends FieldLogicMutater = FieldLogicMutater,
  TModelMutateInstance extends ModelLogicMutater = ModelLogicMutater,
  TFieldValInstance extends FieldLogicValidation = FieldLogicValidation,
  TModelValInstance extends ModelLogicValidation = ModelLogicValidation,
  TRequestValInstance extends RequestLogicValidation = RequestLogicValidation,
  TStructureHookInstance extends StructureLogicHook = StructureLogicHook,
  TStructureProviderInstance extends StructureLogicProvider = StructureLogicProvider,
  TKeyDiccActionRequest extends string = string
> = IStructureMutateContextInstance<
  TFieldMutateInstance,
  TModelMutateInstance
> &
  IStructureValContextInstance<
    TFieldValInstance,
    TModelValInstance,
    TRequestValInstance
  > &
  IStructureHookContextInstance<TStructureHookInstance> &
  IStructureProviderContextInstance<TStructureProviderInstance> &
  IStructureCtrlContextInstance<
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
