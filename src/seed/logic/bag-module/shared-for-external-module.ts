import { StructureBag } from "./structure-bag";
import {
  IPrimitiveResponse,
  IResponse,
  IStructureResponse,
} from "../reports/shared";
import { PrimitiveBag } from "./primitive-bag";
import { IDiccFieldMutateActionConfigG } from "../mutaters/field-mutater";
import { IDiccModelMutateActionConfigG } from "../mutaters/model-mutater";
import { IDiccFieldValActionConfigG } from "../validators/field-validation";
import { IDiccModelValActionConfigG } from "../validators/model-validation";
import { IDiccRequestValActionConfigG } from "../validators/request-validation";
import { IDiccStructureHookActionConfigG } from "../hooks/structure-hook";
import {
  IPrimitiveMutateContext,
  IStructureDeepMutateContext,
} from "../mutaters/shared";
import {
  IPrimitiveValContext,
  IStructureDeepValContext,
} from "../validators/shared";
import { IPrimitiveHookContext, IStructureHookContext } from "../hooks/shared";
import { IDiccPrimitiveMutateActionConfigG } from "../mutaters/primitive-mutater";
import { IDiccPrimitiveValActionConfigG } from "../validators/primitive-validation";
import { IDiccPrimitiveHookActionConfigG } from "../hooks/primitive-hook";
import { StructureCriteriaHandler } from "../criterias/structure-criteria-handler";
import { PrimitiveCriteriaHandler } from "../criterias/primitive-criteria-handler";
import { IDiccPrimitiveProviderActionConfigG } from "../providers/primitive-provider";
import {
  IPrimitiveProviderContext,
  IStructureProviderContext,
} from "../providers/shared";
import { IDiccStructureProviderActionConfigG } from "../providers/structure-provider";
import { BagModule } from "./_bag";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████

/**estructura de bag adaptada (extracto y adaptacion) pa un bag esclusivo para modulos de tipo action*/
export interface IBagForActionModuleContext<
  TIDiccAC,
  TKey extends keyof TIDiccAC
> extends Pick<BagModule, "data" | "responses"> {
  /**clave identificadora de la accion */
  keyAction: TKey;
  /**configuracion de la accion a ejecutar */
  actionConfig: TIDiccAC[TKey];
}
/**... */
export type Trf_IBagForActionModuleContext = IBagForActionModuleContext<
  any,
  any
>;
/**funcion asyncrona generica que recibe el bag de una peticion,
 * esta funcion será implementada en los modulos de accion
 * ____
 * @param bag el objeto contenedor de
 * toda la configuracion necesaria para
 * la ejecucion de la peticion en el modulo
 * de accion al cual se llama
 * ____
 * @return Promesa con el reporte de respuesta de
 * la ejecucion de la accion
 */
export type TFnBagForActionModule<
  TBag extends BagModule = BagModule, //TBag es clase no interface (solo se coloca la interfaz para extenderla)
  TIResponse extends IResponse = IResponse
> = (bag: TBag) => Promise<TIResponse>;

//====Primitive============================================================================================================================

/**estructura de bag adaptada (extracto y adaptacion) pa un bag esclusivo para modulos de tipo action*/
export interface IPrimitiveBagForActionModuleContext<
  TIDiccAC,
  TKey extends keyof TIDiccAC
> extends Pick<PrimitiveBag<any>, "data" | "responses" | "criteriaHandler"> {
  /**clave identificadora de la accion */
  keyAction: TKey;
  /**configuracion de la accion a ejecutar */
  actionConfig: TIDiccAC[TKey];
}
/**... */
export type Trf_IPrimitiveBagForActionModuleContext =
  IPrimitiveBagForActionModuleContext<any, any>;
/**funcion asyncrona generica que recibe el bag de una peticion,
 * esta funcion será implementada en los modulos de accion
 * ____
 * @param bag el objeto contenedor de
 * toda la configuracion necesaria para
 * la ejecucion de la peticion en el modulo
 * de accion al cual se llama
 * ____
 * @return Promesa con el reporte de respuesta de
 * la ejecucion de la accion
 */
export type TPrimitiveFnBagForActionModule<
  TBag extends PrimitiveBag<any> = PrimitiveBag<any>, //TBag es clase no interface (solo se coloca la interfaz para extenderla)
  TIResponse extends IPrimitiveResponse = IPrimitiveResponse
> = (bag: TBag) => Promise<TIResponse>;
/**... */
export interface IPrimitiveBagForCtrlContext<
    TValue,
    TPrimitiveCriteriaHandler extends PrimitiveCriteriaHandler<TValue> = PrimitiveCriteriaHandler<TValue>,
    TIDiccPrimitiveMutateAC extends IDiccPrimitiveMutateActionConfigG = IDiccPrimitiveMutateActionConfigG,
    TIDiccPrimitiveValAC extends IDiccPrimitiveValActionConfigG = IDiccPrimitiveValActionConfigG,
    TIDiccRequestValAC extends IDiccRequestValActionConfigG = IDiccRequestValActionConfigG,
    TIDiccPrimitiveHookAC extends IDiccPrimitiveHookActionConfigG = IDiccPrimitiveHookActionConfigG,
    TIDiccPrimitiveProviderAC extends IDiccPrimitiveProviderActionConfigG = IDiccPrimitiveProviderActionConfigG
  >
  //obligatorias:
  extends Pick<
    PrimitiveBag<
      TValue,
      TPrimitiveCriteriaHandler,
      TIDiccPrimitiveMutateAC,
      TIDiccPrimitiveValAC,
      TIDiccRequestValAC,
      TIDiccPrimitiveHookAC,
      TIDiccPrimitiveProviderAC
    >,
    "data" | "criteriaHandler"
  > {
  //personalizadas:
  /**diccionario con acciones globales
   *
   * ⚠ no se tiene en cuenta el modulo provider ⚠
   */
  diccGlobalAC: Partial<
    IPrimitiveMutateContext<
      Partial<
        | TIDiccPrimitiveMutateAC
        //❗Tipado que permite desactivar la accion, controller no la ejecuta❗
        | Record<keyof TIDiccPrimitiveMutateAC, null>
      >
    > &
      IPrimitiveValContext<
        Partial<
          | TIDiccPrimitiveValAC
          //❗Tipado que permite desactivar la accion, controller no la ejecuta❗
          | Record<keyof TIDiccPrimitiveValAC, null>
        >,
        Partial<
          | TIDiccRequestValAC
          //❗Tipado que permite desactivar la accion, controller no la ejecuta❗
          | Record<keyof TIDiccRequestValAC, null>
        >
      > &
      IPrimitiveHookContext<
        Partial<
          | TIDiccPrimitiveHookAC
          //❗Tipado que permite desactivar la accion, controller no la ejecuta❗
          | Record<keyof TIDiccPrimitiveHookAC, null>
        >
      > &
      IPrimitiveProviderContext<
        Partial<
          | TIDiccPrimitiveProviderAC
          //❗Tipado que permite desactivar la accion, controller no la ejecuta❗
          | Record<keyof TIDiccPrimitiveProviderAC, null>
        >
      >
  >;
}
/**refactoriacion de la interfaz */
export type Trf_IPrimitiveBagForCtrlContext = IPrimitiveBagForCtrlContext<any>;
/**funcion asyncrona generica que recibe el bag de una peticion,
 * esta funcion será implementada en las peticiones del controller
 * ____
 * @param bag el objeto contenedor de
 * toda la configuracion necesaria para
 * construir un bag interno en la peticion
 * ____
 * @return Promesa con el reporte de respuesta de
 * la ejecucion de la accion
 */
export type TPrimitiveFnBagForCtrl<
  TIBag extends IPrimitiveBagForCtrlContext<any> = IPrimitiveBagForCtrlContext<any>, //TBag es clase no interface (solo se coloca la interfaz para extenderla)
  TIResponse extends IPrimitiveResponse = IPrimitiveResponse
> = (bagCtrl: TIBag) => Promise<TIResponse>;

//====Structure============================================================================================================================
/**estructura de bag adaptada (extracto y adaptacion) pare un bag esclusivo para modulos de tipo action*/
export interface IStructureBagForActionModuleContext<
  TIDiccAC,
  TKey extends keyof TIDiccAC
> extends Pick<
    StructureBag<any>,
    "data" | "keyPath" | "responses" | "criteriaHandler"
  > {
  /**clave identificadora de la accion */
  keyAction: TKey;
  /**configuracion de la accion a ejecutar */
  actionConfig: TIDiccAC[TKey];
}
/**... */
export type Trf_IStructureBagForActionModuleContext =
  IStructureBagForActionModuleContext<any, any>;
/**funcion asyncrona generica que recibe el bag de una peticion,
 * esta funcion será implementada en los modulos de accion
 * ____
 * @param bag el objeto contenedor de
 * toda la configuracion necesaria para
 * la ejecucion de la peticion en el modulo
 * de accion al cual se llama
 * ____
 * @return Promesa con el reporte de respuesta de
 * la ejecucion de la accion
 */
export type TStructureFnBagForActionModule<
  TBag extends StructureBag<any> = StructureBag<any>, //TBag es clase no interface (solo se coloca la interfaz para extenderla)
  TIResponse extends IStructureResponse = IStructureResponse
> = (bag: TBag) => Promise<TIResponse>;
/**estructura de bag adaptada (extracto y adaptacion) pare un bag esclusivo para el controller*/
export interface IStructureBagForCtrlContext<
    TModel,
    TStructureCriteriaHandler extends StructureCriteriaHandler<TModel> = StructureCriteriaHandler<TModel>,
    TIDiccFieldMutateAC extends IDiccFieldMutateActionConfigG = IDiccFieldMutateActionConfigG,
    TIDiccModelMutateAC extends IDiccModelMutateActionConfigG = IDiccModelMutateActionConfigG,
    TIDiccFieldValAC extends IDiccFieldValActionConfigG = IDiccFieldValActionConfigG,
    TIDiccModelValAC extends IDiccModelValActionConfigG = IDiccModelValActionConfigG,
    TIDiccRequestValAC extends IDiccRequestValActionConfigG = IDiccRequestValActionConfigG,
    TIDiccStructureHookAC extends IDiccStructureHookActionConfigG = IDiccStructureHookActionConfigG,
    TIDiccStructureProviderAC extends IDiccStructureProviderActionConfigG = IDiccStructureProviderActionConfigG
  >
  //obligatorias:
  extends Pick<
    StructureBag<
      TModel,
      TStructureCriteriaHandler,
      TIDiccFieldMutateAC,
      TIDiccModelMutateAC,
      TIDiccFieldValAC,
      TIDiccModelValAC,
      TIDiccRequestValAC,
      TIDiccStructureHookAC,
      TIDiccStructureProviderAC
    >,
    "data" | "keyPath" | "criteriaHandler"
  > {
  //personalizadas:
  /**diccionario con acciones globales
   *
   * ⚠ no se tiene en cuenta el modulo provider ⚠
   */
  diccGlobalAC: Partial<
    IStructureDeepMutateContext<
      Partial<
        | TIDiccFieldMutateAC
        //❗Tipado que permite desactivar la accion, controller no la ejecuta❗
        | Record<keyof TIDiccFieldMutateAC, null>
      >,
      Partial<
        | TIDiccModelMutateAC
        //❗Tipado que permite desactivar la accion, controller no la ejecuta❗
        | Record<keyof TIDiccModelMutateAC, null>
      >
    > &
      IStructureDeepValContext<
        Partial<
          | TIDiccFieldValAC
          //❗Tipado que permite desactivar la accion, controller no la ejecuta❗
          | Record<keyof TIDiccFieldValAC, null>
        >,
        Partial<
          | TIDiccModelValAC
          //❗Tipado que permite desactivar la accion, controller no la ejecuta❗
          | Record<keyof TIDiccModelValAC, null>
        >,
        Partial<
          | TIDiccRequestValAC
          //❗Tipado que permite desactivar la accion, controller no la ejecuta❗
          | Record<keyof TIDiccRequestValAC, null>
        >
      > &
      IStructureHookContext<
        Partial<
          | TIDiccStructureHookAC
          //❗Tipado que permite desactivar la accion, controller no la ejecuta❗
          | Record<keyof TIDiccStructureHookAC, null>
        >
      > &
      IStructureProviderContext<
        Partial<
          | TIDiccStructureProviderAC
          //❗Tipado que permite desactivar la accion, controller no la ejecuta❗
          | Record<keyof TIDiccStructureProviderAC, null>
        >
      >
  >;
}
/**refactorizacion de la interfaz */
export type Trf_IStructureBagForCtrlContext = IStructureBagForCtrlContext<any>;
/**estructura de bag adaptada (extracto y adaptacion) pare un
 * bag esclusivo para el controller en contexto campo*/
export interface IStructureBagForFieldCtrlContext<
  TIDiccFieldMutateAC extends IDiccFieldMutateActionConfigG = IDiccFieldMutateActionConfigG,
  TIDiccFieldValAC extends IDiccFieldValActionConfigG = IDiccFieldValActionConfigG
> extends IStructureBagForCtrlContext<
    any,
    any,
    TIDiccFieldMutateAC,
    any,
    TIDiccFieldValAC,
    any,
    any,
    any
  > {
  diccGlobalAC: Partial<
    Pick<
      IStructureDeepMutateContext<
        Partial<
          | TIDiccFieldMutateAC
          //❗Tipado que permite desactivar la accion, controller no la ejecuta❗
          | Record<keyof TIDiccFieldMutateAC, null>
        >,
        any
      >,
      "fieldMutate"
    > &
      Pick<
        IStructureDeepValContext<
          Partial<
            | TIDiccFieldValAC
            //❗Tipado que permite desactivar la accion, controller no la ejecuta❗
            | Record<keyof TIDiccFieldValAC, null>
          >,
          any
        >,
        "fieldVal"
      >
  >;
}
/**refactoriacion de la interfaz */
export type Trf_IStructureBagForFieldCtrlContext =
  IStructureBagForFieldCtrlContext<any>;
/**funcion asyncrona generica que recibe el bag de una peticion,
 * esta funcion será implementada en las peticiones del controller
 * ____
 * @param bag el objeto contenedor de
 * toda la configuracion necesaria para
 * construir un bag interno en la peticion
 * ____
 * @return Promesa con el reporte de respuesta de
 * la ejecucion de la accion
 */
export type TFieldFnBagForCtrl<
  TIBag extends IStructureBagForFieldCtrlContext<any> = IStructureBagForFieldCtrlContext<any>,
  TIResponse extends IStructureResponse = IStructureResponse
> = (bagCtrl: TIBag) => Promise<TIResponse>;
/**estructura de bag adaptada (extracto y adaptacion) pare un
 * bag esclusivo para el controller en contexto modelo*/
export interface IStructureBagForModelCtrlContext<
  TModel,
  TStructureCriteriaHandler extends StructureCriteriaHandler<TModel> = StructureCriteriaHandler<TModel>,
  //TIDiccFieldMutateAC extends IDiccFieldMutateActionConfigG = IDiccFieldMutateActionConfigG,
  TIDiccModelMutateAC extends IDiccModelMutateActionConfigG = IDiccModelMutateActionConfigG,
  //TIDiccFieldValAC extends IDiccFieldValActionConfigG = IDiccFieldValActionConfigG,
  TIDiccModelValAC extends IDiccModelValActionConfigG = IDiccModelValActionConfigG,
  TIDiccRequestValAC extends IDiccRequestValActionConfigG = IDiccRequestValActionConfigG,
  TIDiccStructureHookAC extends IDiccStructureHookActionConfigG = IDiccStructureHookActionConfigG,
  TIDiccStructureProviderAC extends IDiccStructureProviderActionConfigG = IDiccStructureProviderActionConfigG
> extends IStructureBagForCtrlContext<
    TModel,
    TStructureCriteriaHandler,
    any,
    TIDiccModelMutateAC,
    any,
    TIDiccModelValAC,
    TIDiccRequestValAC,
    TIDiccStructureHookAC
  > {
  //personalizadas:
  /**diccionario con acciones globales
   *
   * ⚠ no se tiene en cuenta el modulo provider ⚠
   */
  diccGlobalAC: Partial<
    Pick<
      IStructureDeepMutateContext<
        any,
        Partial<
          | TIDiccModelMutateAC
          //❗Tipado que permite desactivar la accion, controller no la ejecuta❗
          | Record<keyof TIDiccModelMutateAC, null>
        >
      >,
      "modelMutate"
    > &
      Pick<
        IStructureDeepValContext<
          any,
          Partial<
            | TIDiccModelValAC
            //❗Tipado que permite desactivar la accion, controller no la ejecuta❗
            | Record<keyof TIDiccModelValAC, null>
          >,
          Partial<
            | TIDiccRequestValAC
            //❗Tipado que permite desactivar la accion, controller no la ejecuta❗
            | Record<keyof TIDiccRequestValAC, null>
          >
        >,
        "modelVal" | "requestVal"
      > &
      IStructureHookContext<
        Partial<
          | TIDiccStructureHookAC
          //❗Tipado que permite desactivar la accion, controller no la ejecuta❗
          | Record<keyof TIDiccStructureHookAC, null>
        >
      > & //no necesita Pick
      IStructureProviderContext<
        Partial<
          | TIDiccStructureProviderAC
          //❗Tipado que permite desactivar la accion, controller no la ejecuta❗
          | Record<keyof TIDiccStructureProviderAC, null>
        >
      > //no necesita Pick
  >;
}
/**refactoriacion de la interfaz */
export type Trf_IStructureBagForModelCtrlContext =
  IStructureBagForModelCtrlContext<any>;

/**funcion asyncrona generica que recibe el bag de una peticion,
 * esta funcion será implementada en las peticiones del controller
 * ____
 * @param bag el objeto contenedor de
 * toda la configuracion necesaria para
 * construir un bag interno en la peticion
 * ____
 * @return Promesa con el reporte de respuesta de
 * la ejecucion de la accion
 */
export type TModelFnBagForCtrl<
  TIBag extends IStructureBagForModelCtrlContext<any> = IStructureBagForModelCtrlContext<any>,
  TIResponse extends IStructureResponse = IStructureResponse
> = (bagCtrl: TIBag) => Promise<TIResponse>;
