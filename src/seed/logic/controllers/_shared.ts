//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████

import {
  TKeyPrimitiveBagModuleContext,
  TKeyStructureBagModuleContext,
} from "../bag-module/shared";
import {
  TKeyPrimitiveCriteriaModuleContext,
  TKeyStructureCriteriaModuleContext,
} from "../criterias/shared";
import {
  TKeyPrimitiveMutateModuleContext,
  TKeyStructureDeepMutateModuleContext,
} from "../mutaters/shared";
import {
  TKeyPrimitiveHookModuleContext,
  TKeyStructureHookModuleContext,
} from "../hooks/shared";
import {
  TKeyPrimitiveMetadataModuleContext,
  TKeyStructureMetadataModuleContext,
} from "../meta/metadata-handler-shared";
import {
  TKeyPrimitiveProviderModuleContext,
  TKeyStructureProviderModuleContext,
} from "../providers/shared";
import {
  TKeyPrimitiveResponseModuleContext,
  TKeyStructureResponseModuleContext,
} from "../reports/shared";
import {
  TKeyPrimitiveValModuleContext,
  TKeyStructureDeepValModuleContext,
} from "../validators/shared";

//====Primitive===================================================================================================================
/**claves identificadoras de todos los contextos
 * de modulos internos usados en el controller */
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
 * de modulos internos usados en el controller */
export type TKeyPrimitiveInternalACModuleContext =
  | TKeyPrimitiveMutateModuleContext
  | TKeyPrimitiveValModuleContext
  | TKeyPrimitiveHookModuleContext
  | TKeyPrimitiveProviderModuleContext;
/** */
export interface IPrimitiveCtrlContext<
  TPrimitiveCtrl = unknown //puede ser cualquier interfaz o tipado
> {
  primitiveCtrl: TPrimitiveCtrl;
}
/**claves identificadoras para el contexto de ejecucion para el modulo primitive*/
export type TKeyPrimitiveCtrlModuleContext = keyof IPrimitiveCtrlContext;
/** */
export interface IPrimitiveCtrlModuleConfig<
  TIDiccGlobalModelAC,
  TKeyDiccCtrlCRUD extends string
> extends IPrimitiveCtrlContext {
  primitiveCtrl: {
    diccATKeyCRUD: Record<
      TKeyDiccCtrlCRUD,
      Array<
        [
          //keyGlobalModuloContext:
          TKeyPrimitiveInternalACModuleContext,
          keyof TIDiccGlobalModelAC
        ]
      >
    >;
  };
}
/**... */
export type Trf_IPrimitiveCtrlModuleConfig = IPrimitiveCtrlModuleConfig<
  any,
  any
>;
/**... */
export type TPrimitiveCtrlModuleConfigForPrimitive<
  TIDiccGlobalModelAC,
  TKeyDiccCtrlCRUD extends string
> = IPrimitiveCtrlModuleConfig<
  TIDiccGlobalModelAC,
  TKeyDiccCtrlCRUD
>["primitiveCtrl"];
/**refactorizacion del tipo */
export type Trf_TPrimitiveMutateModuleConfigForPrimitive =
  TPrimitiveCtrlModuleConfigForPrimitive<any, any>;
/**esquema de configuracion para metadatos
 * en contexto primitivo*/
export type TPrimitiveConfigForCtrl<
  TIDiccGlobalModelAC,
  TKeyDiccCtrlCRUD extends string
> = Pick<
  Partial<IPrimitiveCtrlModuleConfig<TIDiccGlobalModelAC, TKeyDiccCtrlCRUD>>,
  "primitiveCtrl"
>;
/**refactorizacion del tipo */
export type Trf_TPrimitiveConfigForCtrl = TPrimitiveConfigForCtrl<any, any>;

//====Strcuture====================================================================================================================
/**claves identificadoras de todos los contextos
 * de modulos internos usados en el controller */
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
 * de modulos internos usados en el controller */
export type TKeyStructureInternalACModuleContext =
  | TKeyStructureDeepMutateModuleContext
  | TKeyStructureDeepValModuleContext
  | TKeyStructureHookModuleContext
  | TKeyStructureProviderModuleContext;
/**claves identificadoras de todos los contextos
 * de modulos internos usados en el controller
 * en contexto model */
export type TKeyFieldInternalModuleContext =
  | TKeyStructureBagModuleContext
  | TKeyStructureResponseModuleContext
  | TKeyStructureMetadataModuleContext
  | Extract<TKeyStructureDeepMutateModuleContext, "fieldMutate">
  | Extract<TKeyStructureDeepValModuleContext, "fieldVal">;
/**claves identificadoras de todos los contextos
 * de modulos internos usados en el controller
 * en contexto model*/
export type TKeyFieldInternalACModuleContext =
  | Extract<TKeyStructureDeepMutateModuleContext, "fieldMutate">
  | Extract<TKeyStructureDeepValModuleContext, "fieldVal">;
/**claves identificadoras de todos los contextos
 * de modulos internos usados en el controller
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
 * de modulos internos usados en el controller
 * en contexto model*/
export type TKeyModelInternalACModuleContext =
  | Extract<TKeyStructureDeepMutateModuleContext, "modelMutate">
  | Extract<TKeyStructureDeepValModuleContext, "modelVal">
  | TKeyStructureHookModuleContext
  | TKeyStructureProviderModuleContext;
/**contexto de ejecucion del modulo para structure*/
export type TKeyStructureCtrlModuleContext = "structureCtrl";
/**esquema de proposito general con los contextos estructurales del modulo*/
export interface IStructureDeepCtrlContext<
  TFieldCtrl = unknown, //puede ser cualquier interfaz o tipado
  TModelCtrl = unknown //puede ser cualquier interfaz o tipado
> {
  fieldCtrl: TFieldCtrl;
  modelCtrl: TModelCtrl;
}
/**clave identificadora para el contexto profundo de la estructura*/
export type TKeyStructureDeepCtrlModuleContext =
  keyof IStructureDeepCtrlContext;
/** */
export interface IStructureCtrlModuleConfig<
  TIDiccGlobalFieldAC,
  TIDiccGlobalModelAC,
  TKeyDiccCtrlCRUD extends string
> extends IStructureDeepCtrlContext {
  /**configuracion **general** para contexto de campo */
  fieldCtrl: {
    aTKeysForReq: Array<
      [
        //keyGlobalModuloContext:
        TKeyFieldInternalACModuleContext,
        keyof TIDiccGlobalFieldAC
      ]
    >;
  };
  /**configuracion **general** para contexto de modelo */
  modelCtrl: {
    diccATKeyCRUD: Partial<
      Record<
        TKeyDiccCtrlCRUD,
        Array<
          [
            //keyGlobalModuloContext:
            TKeyModelInternalACModuleContext,
            keyof TIDiccGlobalModelAC
          ]
        >
      >
    >;
  };
}
/**... */
export type Trf_IStructureCtrlModuleConfig = IStructureCtrlModuleConfig<
  any,
  any,
  any
>;
/**... */
export type TStructureCtrlModuleConfigForField<TIDiccGlobalFieldAC> =
  IStructureCtrlModuleConfig<TIDiccGlobalFieldAC, any, any>["fieldCtrl"];
/**refactorizacion del tipo */
export type Trf_TStructureCtrlModuleConfigForField =
  TStructureCtrlModuleConfigForField<any>;
/**... */
export type TStructureCtrlModuleConfigForModel<
  TIDiccGlobalModelAC,
  TKeyDiccCtrlCRUD extends string
> = IStructureCtrlModuleConfig<
  any,
  TIDiccGlobalModelAC,
  TKeyDiccCtrlCRUD
>["modelCtrl"];
/**refactorizacion del tipo */
export type Trf_TStructureMutateModuleConfigForModel =
  TStructureCtrlModuleConfigForModel<any, any>;
/**esquema de configuracion para metadatos
 * en contexto campo*/
export type TFieldConfigForCtrl<TIDiccGlobalFieldAC> = Pick<
  Partial<IStructureCtrlModuleConfig<TIDiccGlobalFieldAC, any, any>>,
  "fieldCtrl"
>;
/**refactorizacion del tipo */
export type Trf_TFieldConfigForCtrl = TFieldConfigForCtrl<any>;
/**... */
/**esquema de configuracion para metadatos
 * en contexto campo*/
export type TModelConfigForCtrl<
  TIDiccGlobalModelAC,
  TKeyDiccCtrlCRUD extends string
> = Pick<
  Partial<
    IStructureCtrlModuleConfig<any, TIDiccGlobalModelAC, TKeyDiccCtrlCRUD>
  >,
  "modelCtrl"
>;
/**refactorizacion del tipo */
export type Trf_TModelConfigForCtrl = TModelConfigForCtrl<any, any>;
