import { TDataType, TKeyStructureContextFull } from "../config/shared-modules";
import { FieldLogicMutater } from "../mutaters/field-mutater";
import { ModelLogicMutater } from "../mutaters/model-mutater";
import { PrimitiveLogicMutater } from "../mutaters/primitive-mutater";
import {
  IPrimitiveMutateContext,
  IStructureDeepMutateContext,
  Trf_TFieldConfigForMutate,
  Trf_TModelConfigForMutate,
  Trf_TPrimitiveConfigForMutate,
} from "../mutaters/shared";
import { PrimitiveLogicHook } from "../hooks/primitive-hook";
import { StructureLogicHook } from "../hooks/structure-hook";
import {
  Trf_TStructureConfigForHook,
  Trf_TPrimitiveConfigForHook,
  IStructureHookContext,
  IPrimitiveHookContext,
} from "../hooks/shared";
import { LogicValidation } from "../validators/_validation";
import { FieldLogicValidation } from "../validators/field-validation";
import { ModelLogicValidation } from "../validators/model-validation";
import { PrimitiveLogicValidation } from "../validators/primitive-validation";
import { RequestLogicValidation } from "../validators/request-validation";
import {
  IPrimitiveValContext,
  IStructureDeepValContext,
  Trf_TFieldConfigForVal,
  Trf_TModelConfigForVal,
  Trf_TPrimitiveConfigForVal,
} from "../validators/shared";
import {
  IPrimitiveProviderContext,
  IStructureProviderContext,
  Trf_TModelConfigForProvider,
  Trf_TPrimitiveConfigForProvider,
} from "../providers/shared";
import { StructureLogicProvider } from "../providers/structure-provider";
import { PrimitiveLogicProvider } from "../providers/primitive-provider";
import {
  Trf_TFieldConfigForCtrl,
  Trf_TModelConfigForCtrl,
  Trf_TPrimitiveConfigForCtrl,
} from "../controllers/_shared";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████

//====Primitive===================================================================================================================
/** tipos de datos aplicables a un primitivo.
 *
 * ❗los tipos vacios (`undefined` o `null`)
 * en los metadatos se deben reemplazar
 * con una flag que indique que el campo
 * puede estar vacio❗. Ya que declarar
 * que un campo que **solo** permite `undefined`
 * no tiene sentido
 */
export type TPrimitiveType = Exclude<TDataType, "undefined" | "null">;
/**esquema de instancias de modulos (de accion como de cursor) */
export interface IDiccPrimitiveModuleInstanceContext<
  TPrimitiveFormatInstance extends PrimitiveLogicMutater<any> = PrimitiveLogicMutater,
  TPrimitiveValInstance extends PrimitiveLogicValidation<any> = PrimitiveLogicValidation,
  TRequestValInstance extends LogicValidation<any> = RequestLogicValidation,
  TPrimitiveHookInstance extends PrimitiveLogicHook<any> = PrimitiveLogicHook,
  TPrimitiveProviderInstance extends PrimitiveLogicProvider = PrimitiveLogicProvider
> extends IPrimitiveMutateContext<TPrimitiveFormatInstance>,
    IPrimitiveValContext<TPrimitiveValInstance, TRequestValInstance>,
    IPrimitiveHookContext<TPrimitiveHookInstance>,
    IPrimitiveProviderContext<TPrimitiveProviderInstance> {}
/**refactorizacion del tipo*/
export type Trf_IDiccPrimitiveModuleInstanceContext =
  IDiccPrimitiveModuleInstanceContext<any>;
/**esquema de proposito general con los contextos primitivos del modulo*/
export interface IPrimitiveMetadataContext<
  TPrimitiveMeta = unknown //puede ser cualquier interfaz o tipado
> {
  primitiveMeta: TPrimitiveMeta;
}
/**claves identificadoras para el contexto de ejecucion para el modulo primitive*/
export type TKeyPrimitiveMetadataModuleContext =
  keyof IPrimitiveMetadataContext;
/**... */
export interface IPrimitiveMetadataModuleConfig
  extends IPrimitiveMetadataContext {
  /**configuracion en contexto primitivo */
  primitiveMeta: {
    //❗Todos deben iniciar con __❗
    /**clave identificadora del recurso
     * para el proveedor (en singular)*/
    __S_Key: string;
    /**clave identificadora del recurso
     * para el proveedor (en plural)*/
    __P_Key: string;
    /**
     * el tipo dato que almacenara este primitivo,
     * de acuerdo a las agrupaciones que recibe la
     * base de datos
     */
    __type: TFieldType;
    /**
     * Determina si es array,
     * util tanto para primitivos como
     * para embebidos o incrustados,
     * tambien ayuda determinar la cardinalidad
     * en embebidos:
     *
     * ❗ ver propiedad `isMany`
     */
    __isArray: boolean;
    /**Determina si es un primitivo virtiual*/
    __isVirtual: boolean;
    /**dato predefinido para el primitivo
     *
     * ❗❗OBLIGATORIO definirlo en los metadatos❗❗❗
     */
    __dfData: any;
    /**Si el campo es de tipo objeto literal y anonimo
     * (no array) se almacena las claves identificadoras
     * de este objeto, de lo contrario es un arrya vacio
     *
     * ❕asignacion Automatica❕
     */
    __keysProp?: string[];
    /**configuracion de formateo*/
    __mutateConfig: Trf_TPrimitiveConfigForMutate;
    /**configuracion de validacion*/
    __valConfig: Trf_TPrimitiveConfigForVal;
    /**configuracion de hooks*/
    __hookConfig: Trf_TPrimitiveConfigForHook;
    /**configuracion de proveedor de servicios para las peticiones*/
    __providerConfig: Trf_TPrimitiveConfigForProvider;
    /** */
    __ctrlConfig: Trf_TPrimitiveConfigForCtrl;
  };
}
/**refactorizacion del tipo */
export type Trf_IPrimitiveMetadataModuleConfig = IPrimitiveMetadataModuleConfig;
/**esquema de configuracion para metadatos
 * en contexto primitivo*/
export type TPrimitiveMetadataModuleConfigForPrimitive = Partial<
  Omit<
    IPrimitiveMetadataModuleConfig["primitiveMeta"],
    | "__mutateConfig"
    | "__valConfig"
    | "__hookConfig"
    | "__providerConfig"
    | "__ctrlConfig"
  >
> &
  Pick<IPrimitiveMetadataModuleConfig["primitiveMeta"], "__type" | "__dfData">;
/**refactorizacion del tipo */
export type Trf_TPrimitiveMetadataModuleConfigForPrimitive =
  TPrimitiveMetadataModuleConfigForPrimitive;
//====Strcuture====================================================================================================================
/** tipos de datos aplicables a un campo.
 *
 * ❗los tipos vacios (`undefined` o `null`)
 * en los metadatos se deben reemplazar
 * con una flag que indique que el campo
 * puede estar vacio❗. Ya que declarar
 * que un campo que **solo** permite `undefined`
 * no tiene sentido
 */
export type TFieldType = Exclude<TDataType, "undefined" | "null">;
/**esquema de instancias de modulos (de accion como de cursor) */
export interface IDiccStructureModuleInstanceContext<
  TFieldMutateInstance extends FieldLogicMutater = FieldLogicMutater,
  TModelMutateInstance extends ModelLogicMutater = ModelLogicMutater,
  TFieldValInstance extends FieldLogicValidation = FieldLogicValidation,
  TModelValInstance extends ModelLogicValidation = ModelLogicValidation,
  TRequestValInstance extends RequestLogicValidation = RequestLogicValidation,
  TStructureHookInstance extends StructureLogicHook = StructureLogicHook,
  TStructureProviderInstance extends StructureLogicProvider = StructureLogicProvider
> extends IStructureDeepValContext<
      TFieldValInstance,
      TModelValInstance,
      TRequestValInstance
    >,
    IStructureDeepMutateContext<TFieldMutateInstance, TModelMutateInstance>,
    IStructureHookContext<TStructureHookInstance>,
    IStructureProviderContext<TStructureProviderInstance> {}
/**refactorizacion del tipo*/
export type Trf_IDiccStructureModuleInstanceContext =
  IDiccStructureModuleInstanceContext<any>;
/**esquema de proposito general con los contextos estructurales del modulo*/
export interface IStructureMetadataContext<
  TFieldMeta = unknown, //puede ser cualquier interfaz o tipado
  TModelMeta = unknown //puede ser cualquier interfaz o tipado
> {
  fieldMeta: TFieldMeta;
  modelMeta: TModelMeta;
}
/**claves identificadoras para el contexto de ejecucion para el modulo structure*/
export type TKeyStructureMetadataModuleContext =
  keyof IStructureMetadataContext;
/**... */
export interface IStructureMetadataModuleConfig<TModelOrEmbModel>
  extends IStructureMetadataContext {
  /**configuracion en contexto de campo */
  fieldMeta: {
    //❗Todos deben iniciar con __❗
    /**ruta con clave identificadora unica de este campo (o campo de modelo embebido)*/
    __keyPath: string;
    /**tipo de estructura que corresponde */
    __structureType: Extract<TKeyStructureContextFull, "structureField">;
    /**
     * el tipo dato que almacenara este campo, de
     * acuerdo a las agrupaciones que recibe la
     * base de datos
     */
    __fieldType: TFieldType;
    /**
     * Determina si es un campo array,
     * util tanto para primitivos como
     * para embebidos o incrustados,
     * tambien ayuda determinar la cardinalidad
     * en embebidos:
     *
     * ❗ ver propiedad `isMany`
     */
    __isArray: boolean;
    /**
     * esta propiedad es para determinar
     *  cardinalidad en campos con metapropiedad
     * `isArray`
     *
     * ````
     * //⚠ SOLO SI esta configuracion
     * fieldType = EFieldType.objEmbedded
     *
     * //🚫 no puede existir esta configuracion:
     * configValidator.diccValidators.isRequired = {...//configuracion};
     * isMany = false || undefined || null;
     *
     * //=========================================
     * //es cardinalidad 0a1
     * isArray = false;
     * isMany = true;
     * //=========================================
     * //es cardinalidad 1a1
     * isArray = false;
     * isMany = false;
     * //=========================================
     * //es cardinalidad 0aM
     * isArray = true;
     * isMany = true;
     * //=========================================
     * //es cardinalidad 1aM
     * isArray = true;
     * isMany = false;
     * ````
     */
    __isMany: boolean;
    /**
     * Determina si es un campo para pre
     * procesamiento pero no será enviado
     * en peticiones o servicios
     */
    __isVirtual: boolean;
    /**dato predefinido para el campo
     *
     * ❗❗OBLIGATORIO definirlo en los metadatos❗❗❗
     */
    __dfData: any;
    /**Si el campo es de tipo objeto literal y anonimo
     * (no array) se almacena las claves identificadoras
     * de este objeto, de lo contrario es un arrya vacio
     *
     * ❕asignacion Automatica❕
     */
    __keysProp?: string[];
    /**configuracion adicional para estructura embebida */
    __emb?: any;
    /**configuracion de mutacion para un campo*/
    __mutateConfig: Trf_TFieldConfigForMutate;
    /**configuracion de validacion para un campo*/
    __valConfig: Trf_TFieldConfigForVal;
    /** */
    __ctrlConfig: Trf_TFieldConfigForCtrl;
  };
  /**configuracion en contexto de modelo raiz */
  modelMeta: {
    //❗Todos deben iniciar con __❗
    /**ruta con clave identificadora unica
     * de este modelo (o modelo embebido)*/
    __keyPath: string;
    /**tipo de estructura que corresponde */
    __structureType: Extract<
      TKeyStructureContextFull,
      "structureEmbedded" | "structureModel"
    >;
    /**clave identificadora de la instancia
     * a que corresponde el modelo*/
    __keyInstance: string;
    /**clave identificadora del recurso
     * para el proveedor (en singular)*/
    __S_Key: string;
    /**clave identificadora del recurso
     * para el proveedor (en plural)*/
    __P_Key: string;
    /**dato predefinido para la estructura
     *
     * puede ser una instnacia de un modelo o modelo embebido
     * o un objeto literal (en caso de los anonimos)
     *
     * ❗❗❗OBLIGATORIO definirlo en los metadatos❗❗❗
     */
    __dfData: TModelOrEmbModel;
    /**array con los identificadores de los campos
     * de este modelo.
     *
     * ❕asignacion Automatica❕
     */
    __keysProp?: Array<keyof TModelOrEmbModel>; //debe ser keysProp (no keysField para garantizar integridad)
    /**configuracion de mutacion*/
    __mutateConfig: Trf_TModelConfigForMutate;
    /**configuracion de validacion para un campo*/
    __valConfig: Trf_TModelConfigForVal;
    /**configuracion de hooks*/
    __hookConfig: Trf_TStructureConfigForHook;
    /**configuracion de proveedor de servicios para las peticiones*/
    __providerConfig: Trf_TModelConfigForProvider;
    /**configuracion de controller */
    __ctrlConfig: Trf_TModelConfigForCtrl;
  };
}
/**refactorizacion del tipo */
export type Trf_IStructureMetadataModuleConfig =
  IStructureMetadataModuleConfig<any>;
/**esquema de configuracion para metadatos
 * en contexto campo*/
export type TStructureMetadataModuleConfigForField = Partial<
  Omit<
    IStructureMetadataModuleConfig<any>["fieldMeta"],
    "__emb" | "__mutateConfig" | "__valConfig" | "__ctrlConfig"
  >
> &
  Pick<
    IStructureMetadataModuleConfig<any>["fieldMeta"],
    "__fieldType" | "__dfData"
  >;
/**refactorizacion del tipo */
export type Trf_TStructureMetadataModuleConfigForField =
  TStructureMetadataModuleConfigForField;
/**extracto de esquema de configuracion
 * para metadatos en contexto estructura */
export type TStructureMetadataModuleConfigForModel<TModel> = Partial<
  Omit<
    IStructureMetadataModuleConfig<TModel>["modelMeta"],
    | "__mutateConfig"
    | "__valConfig"
    | "__hookConfig"
    | "__providerConfig"
    | "__ctrlConfig"
  >
> &
  Pick<IStructureMetadataModuleConfig<TModel>["modelMeta"], "__dfData">;
/**refactorizacion del tipo */
export type Trf_TStructureMetadataModuleConfigForModel =
  TStructureMetadataModuleConfigForModel<any>;
