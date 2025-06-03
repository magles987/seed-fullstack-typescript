import {
  IPrimitiveCtrlContextInstance,
  IStructureCtrlContextInstance,
} from "../controllers/shared-types";
import {
  IPrimitiveHookContextInstance,
  IStructureHookContextInstance,
} from "../hooks/shared-types";
import { TType, TKeyStructureContextFull } from "../modules/shared-types";
import {
  IPrimitiveMutateContextInstance,
  IStructureMutateContextInstance,
} from "../mutaters/shared-types";
import {
  IPrimitiveProviderContextInstance,
  IStructureProviderContextInstance,
} from "../providers/shared-types";
import {
  IPrimitiveValContextInstance,
  IStructureValContextInstance,
} from "../validators/shared-types";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████

/** tipos de datos aplicables a la lógica de negocio.
 *
 * ❗los tipos vacíos (`undefined` o `null`)
 * en los metadatos se deben reemplazar
 * con una flag que indique puede estar vació❗.
 * Ya que declarar que un dato que **solo** permite `undefined`
 * o `null` no tiene sentido
 */
export type TDataType = Exclude<TType, "undefined" | "null">;

//====Primitive===================================================================================================================
/**esquema de propósito general con los contextos primitivos del modulo*/
export interface IPrimitiveMetadataContext<
  TPrimitiveMeta = unknown //puede ser cualquier interfaz o tipado
> {
  primitiveMeta: TPrimitiveMeta;
}
/**claves identificadoras para el contexto de ejecución para el modulo primitive*/
export type TKeyPrimitiveMetadataModuleContext =
  keyof IPrimitiveMetadataContext;
/**... */
export interface IPrimitiveMetadataModuleConfig<TValue>
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
    __type: TDataType;
    /**
     * Determina si es array,
     * util tanto para primitivos como
     * para embebidos o incrustados,
     * también ayuda determinar la cardinalidad
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
    __dfData: TValue;
    /**Si el campo es de tipo objeto literal y anonimo
     * (no array) se almacena las claves identificadoras
     * de este objeto, de lo contrario es un arrya vacio
     *
     * ❕asignacion Automatica❕
     */
    __keysProp?: string[];
    /**instancia del manejador de mutación*/
    __mutateInstance: IPrimitiveMutateContextInstance["primitiveMutate"];
    /**instancia del manejador de validación*/
    __valInstance: IPrimitiveValContextInstance["primitiveVal"];
    /**instancia del manejador de validación*/
    __requestValInstance: IPrimitiveValContextInstance["requestVal"];
    /**instancia del manejador de hooks*/
    __hookInstance: IPrimitiveHookContextInstance["primitiveHook"];
    /**instancia del manejador de proveedores*/
    __providerInstance: IPrimitiveProviderContextInstance["primitiveProvider"];
    /**instancia del controlador*/
    __ctrlInstance: IPrimitiveCtrlContextInstance<any>["primitiveCtrl"];
  };
}
/**refactorizacion del tipo */
export type Trf_IPrimitiveMetadataModuleConfig =
  IPrimitiveMetadataModuleConfig<any>;
/**esquema de configuración para metadatos
 * en contexto primitivo*/
export type TPrimitiveMetadataModuleConfigForPrimitive<TValue> = Partial<
  Omit<
    IPrimitiveMetadataModuleConfig<TValue>["primitiveMeta"],
    | "__mutateConfig"
    | "__valConfig"
    | "__requestValInstance"
    | "__hookConfig"
    | "__providerConfig"
    | "__ctrlConfig"
  >
> &
  Pick<
    IPrimitiveMetadataModuleConfig<TValue>["primitiveMeta"],
    "__type" | "__dfData"
  >;
/**refactorizacion del tipo */
export type Trf_TPrimitiveMetadataModuleConfigForPrimitive =
  TPrimitiveMetadataModuleConfigForPrimitive<any>;

//====Strcuture====================================================================================================================

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
    __type: TDataType;
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
    __emb?: Omit<
      IStructureMetadataModuleConfig<any>["modelMeta"],
      "__requestValInstance" | "__providerInstance"
    >;
    /**configuración de mutación para un campo*/
    __mutateInstance: IStructureMutateContextInstance["fieldMutate"];
    /**configuración de validación para un campo*/
    __valInstance: IStructureValContextInstance["fieldVal"];
    /**configuración de de hook para un campo*/
    __hookInstance: IStructureHookContextInstance["structureHook"];
    /** */
    __ctrlInstance: IStructureCtrlContextInstance<any>["structureCtrl"];
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
     * puede ser una instancia de un modelo o modelo embebido
     * o un objeto literal (en caso de los anónimos)
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
    /**instancia del manejador de mutación*/
    __mutateInstance: IStructureMutateContextInstance["modelMutate"];
    /**instancia del manejador de validación*/
    __valInstance: IStructureValContextInstance["modelVal"];
    /**instancia del manejador de validación de peticiones*/
    __requestValInstance: IStructureValContextInstance["requestVal"];
    /**instancia del manejador de hook*/
    __hookInstance: IStructureHookContextInstance["structureHook"];
    /**instancia del manejador de proveedores*/
    __providerInstance: IStructureProviderContextInstance["structureProvider"];
    /**instancia del control*/
    __ctrlInstance: IStructureCtrlContextInstance<any>["structureCtrl"];
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
    | "__emb"
    | "__mutateInstance"
    | "__valInstance"
    | "__hookInstance"
    | "__ctrlInstance"
  >
> &
  Pick<IStructureMetadataModuleConfig<any>["fieldMeta"], "__type" | "__dfData">;
/**refactorizacion del tipo */
export type Trf_TStructureMetadataModuleConfigForField =
  TStructureMetadataModuleConfigForField;
/**extracto de esquema de configuracion
 * para metadatos en contexto estructura */
export type TStructureMetadataModuleConfigForModel<TModel> = Partial<
  Omit<
    IStructureMetadataModuleConfig<TModel>["modelMeta"],
    | "__mutateInstance"
    | "__valInstance"
    | "__requestValInstance"
    | "__hookInstance"
    | "__providerInstance"
    | "__ctrlInstance"
  >
> &
  Pick<IStructureMetadataModuleConfig<TModel>["modelMeta"], "__dfData">;
/**refactorizacion del tipo */
export type Trf_TStructureMetadataModuleConfigForModel =
  TStructureMetadataModuleConfigForModel<any>;
