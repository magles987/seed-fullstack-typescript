import { ELogicResStatusCode } from "../../config/shared-modules";
import { IDiccInFieldFormatActionConfigG } from "../../mutaters/inField-formatter";
import { IDiccInModelFormatActionConfigG } from "../../mutaters/inModel-formatter";
import { IDiccOutFieldFormatActionConfigG } from "../../mutaters/outField-formatter";
import { IDiccOutModelFormatActionConfigG } from "../../mutaters/outModel-formatter";
import { TKeyStructureDeepMutateModuleContext } from "../../mutaters/shared";
import { TKeyStructureHookModuleContext } from "../../hooks/shared";
import { IDiccStructurePostHookActionConfigG } from "../../hooks/structure-post-hook";
import { IDiccStructurePreHookActionConfigG } from "../../hooks/structure-pre-hook";
import { IDiccFieldValActionConfigG } from "../../validators/field-validation";
import { IDiccModelValActionConfigG } from "../../validators/model-validation";
import { IDiccRequestValActionConfigG } from "../../validators/request-validation";
import { TKeyStructureDeepValModuleContext } from "../../validators/shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
export interface IMiddlewareReportStatus {
  /**clave identificadora del middleware
   * que actualmente se esta ejecutando*/
  currentKey: string;
  /**claves identificadoras del middleware
   * ya ejecutadas (no incluye la actual)*/
  previousKeys: string[];
  /**claves identificadoras del middleware
   * que se ejecutaran despues de la actual
   *  (no incluye la actual) */
  nextKeys: string[];
}

// /** */
// export interface IMiddlewareBag {
//   /**clave identificadora del recurso*/
//   keySrc: string;
//   data: any; //actualizable
//   responses?: Array<IResponseForMiddleware>;
// }
// /**Enumeracion de Acciones especiales no registradas
//  * en ningun diccionario y que indican sub acciones
//  * agrupadas
//  *
//  * ❗todas estan nombradas en mayuscula e
//  * inician y terminan con el caracter "#"❗
//  */
// export enum EKeyActionGroupForRes {
//   /**indica grupo de subacciones ejecutadas*/
//   actions = "#ACTIONS#",
//   /**indica grupo de subacciones ejecutadas de las
//    *  propiedades correspondientes a un objeto anonimo
//    */
//   props = "#PROPS#",
//   /**indica grupo de subacciones ejecutadas de las
//    *  propiedades correspondientes a un array de
//    * elementos (cualquiera que sea)
//    */
//   items = "#ITEMS#",
//   /**indica grupo de subacciones ejecutadas de las
//    *  campos correspondientes a un modelo
//    * ❕Exclusivo para contexto estructurado❕
//    */
//   fields = "#FIELDS#",
//   /**indica grupo de subacciones ejecutadas de las
//    *  modelos embebidos correspondientes a un modelo
//    * ❕Exclusivo para contexto estructurado❕
//    */
//   embModel = "#EMB_MODELS#",
// }
// /** */
// export interface IResponseForMiddleware {
//   /**clave identificadora del recurso(modelo o campo), sin ruta */
//   keyLogic?: string;
//   /**clave identificadora del recurso*/
//   keySrc: string;
//   /**clave identificadora del modulo que ejecutó el middleware */
//   keyModule: string;
//   /**clave identificadora de la accion que ejecutó el middleware
//    *
//    * ❕Existen acciones especiales que agrupan subAcciones, no
//    * pertenecen a ningun diccionario dfe acciones y estan nombradas
//    * en mayuscula y comienzan y terminan con el caracter `"#"` ❕
//    */
//   keyAction: string | EKeyActionGroupForRes;
//   /**clave identificadora del middlaware */
//   keyModuleContext: unknown;
//   /**datos */
//   data: any;
//   /**estado despues de la ejecucion del middleware */
//   status: ELogicResStatusCode;
//   /**mensaje auxiliar (Lógico) */
//   msn: string;
//   /**contiene un reporte producido por
//    * libreria o mudulo externo a la logica */
//   extResponse?: object;
//   /**tolerancia maxima de respuesta
//    * con la que se evaluo este middleware*/
//   tolerance: ELogicResStatusCode;
//   /**reportes embebidos si los hay */
//   responses: IResponseForMiddleware[];
// }
// /**refactorizacion de la interfaz */
// export type Trf_IResponseForMiddleware = IResponseForMiddleware;
// /**funcion asyncrona generica que representa la
//  * construccion de un middleware
//  * ____
//  * @param bag el objeto contenedor de
//  * toda la configuracion necesaria para
//  * la ejecucion interna del middleware
//  * @param utilMiddleware utilidades para
//  * la ejecucion del middleware, ⚠ son
//  * procesadas internamente asi que no
//  * es necesario asignarle ningun valor
//  * ____
//  * @return Promesa vacia
//  */
// export type TFnModuleMiddleware<
//   TIBag extends IMiddlewareBag,
//   TIResponseForMiddleware extends IResponseForMiddleware = IResponseForMiddleware
// > = (
//   bag: TIBag,
//   middlewareStatus?: IMiddlewareReportStatus
// ) => Promise<TIResponseForMiddleware>;
// /**esquema de reporte final despues de la ejecucion
//  * de todos los middlewares (si fue posible) */
// export interface IMiddlewareFinalReport {
//   /**array de respuestas de cada middleware ejecutado */
//   responses: IResponseForMiddleware[];
//   /**reporte de middleware (ejecutados y no ejecutados) */
//   middlewareFinalStatus: {
//     /**claves identificadoras de middlewares que fueron ejecutados */
//     keysMiddlewareRunned: string[];
//     /**claves identificadoras de middlewares faltantes */
//     keysMiddlewareMissing: string[];
//   };
// }
// //====Primitivos============================================================================================================================

// //====Structurados============================================================================================================================
// /** */
// export type TStructureMiddlewareModuleContext =
//   | "criteria"
//   | TStructureFormatModuleContext
//   | TStructureValModuleContext
//   | TStructureHookModuleContext
//   | "provider";
// /**claves identificadoras del contexto
//  * de respuesta de middleware */
// export type TKeyStructureMiddlewareResponseContext =
//   | "responses"
//   | "embResponses";
// /**... */
// export interface IStructureMiddlewareBag<
//   TCursorCriteria = any, //debe asignar el tipo correcto
//   TIDiccInFieldFormatAC = IDiccInFieldFormatActionConfigG,
//   TIDiccOutFieldFormatAC = IDiccOutFieldFormatActionConfigG,
//   TIDiccInModelFormatAC = IDiccInModelFormatActionConfigG,
//   TIDiccOutModelFormatAC = IDiccOutModelFormatActionConfigG,
//   TIDiccFieldValAC = IDiccFieldValActionConfigG,
//   TIDiccModelValAC = IDiccModelValActionConfigG,
//   TIDiccRequestValAC = IDiccRequestValActionConfigG,
//   TIDiccPreHookAC = IDiccStructurePreHookActionConfigG,
//   TIDiccPostHookAC = IDiccStructurePostHookActionConfigG,
//   TCursorProvider = any //debe asignar el tipo correcto
// > extends IMiddlewareBag {
//   keyPath: string;
//   cursorCriteria: TCursorCriteria;
//   diccInFieldFormatAC: Partial<TIDiccInFieldFormatAC>;
//   diccOutFieldFormatAC: Partial<TIDiccOutFieldFormatAC>;
//   diccInModelFormatAC: Partial<TIDiccInModelFormatAC>;
//   diccOutModelFormatAC: Partial<TIDiccOutModelFormatAC>;
//   diccFieldValAC: Partial<TIDiccFieldValAC>;
//   diccModelValAC: Partial<TIDiccModelValAC>;
//   diccRequestValAC: Partial<TIDiccRequestValAC>;
//   diccPreHookAC: Partial<TIDiccPreHookAC>;
//   diccPostHookAC: Partial<TIDiccPostHookAC>;
//   cursorProvider: Partial<TCursorProvider>;
//   responses?: Array<IStructureResponseForMiddleware>;
// }
// /**... */
// export type Trf_IStructureMiddlewareBag = IStructureMiddlewareBag;
// /**estructura de bag por contexto para modulo de acciones*/
// export type TStructureBagForActionModuleContext<
//   TIDiccAC,
//   TKey extends keyof TIDiccAC
// > = {
//   actionConfig: TIDiccAC[TKey];
//   keyAction: TKey;
// } & Pick<IStructureMiddlewareBag, "data" | "keyPath" | "responses">;
// /**... */
// export interface IStructureResponseForMiddleware
//   extends IResponseForMiddleware {
//   keyModuleContext: TStructureMiddlewareModuleContext;
//   /**ruta del recurso */
//   keyPath: string;
//   responses: IStructureResponseForMiddleware[];
// }
// /**refactorizacion del tipo */
// export type Trf_IStructureResponseForMiddleware =
//   IStructureResponseForMiddleware;
// /**esquema de reporte final despues de la ejecucion
//  * de todos los middlewares (si fue posible) */
// export interface IStructureMiddlewareFinalReport
//   extends IMiddlewareFinalReport {
//   responses: IStructureResponseForMiddleware[];
// }
