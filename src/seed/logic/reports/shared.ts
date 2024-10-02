import {
  TKeyPrimitiveCtrlModuleContext,
  TKeyStructureDeepCtrlModuleContext,
} from "../controllers/_shared";
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
  TKeyPrimitiveProviderModuleContext,
  TKeyStructureProviderModuleContext,
} from "../providers/shared";
import {
  TKeyPrimitiveValModuleContext,
  TKeyStructureDeepValModuleContext,
} from "../validators/shared";
import {
  TKeyPrimitiveServiceModuleContext,
  TKeyStructureServiceModuleContext,
} from "../providers/services/shared";
import { TKeyLogicContext, TKeyRequestType } from "../config/shared-modules";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** Define los codigos de esdtado retornados
 * despues de la ejecucion de una accion en
 * un modluo de la aplicacion (`"Controller"`,
 * `"Mutater"`, `"Hook"`, `"Provider"`,
 * `"Validate"`)
 */
export enum ELogicResStatusCode {
  /**codigo inicial de grupo informativo*/
  INFO = 10,
  /**codigo de recepcion de  informacion
   * para el usuario*/
  INFO_USER = 11,
  /**Peticion procesandose */
  PROCESSING = 12,
  /** codigo inicial de grupo cuando
   * una peticion o ejecucion de accion
   * fue exitosa*/
  SUCCESS = 20,
  /** Codigo que indica que la informacion
   * registrada por el usuario es valida*/
  VALID_DATA = 21,
  /**codigo inicial de grupo de advertencia recibida */
  WARNING = 25,
  /**codigo que indica que la informacion
   * de usuario presenta advertencias */
  WARNING_DATA = 26,
  /**redireccionamiento*/
  REDIRECT = 30,
  /**codigo inicial de grupo de accion
   * invalida recibida*/
  BAD = 40,
  /**codigo que indica no tiene autorizacion */
  INVALID_USER = 41,
  /**codigo que indica que el usuario ingresó
   * informacion invalida que no se puede
   * almacenar o consultar */
  INVALID_DATA = 44,
  /**codigo inicial de grupo de error
   * en algun modulo que impide la
   * cualquier ejecucion*/
  ERROR = 50,
}
/**tipado de keys alternas para los codigos
 * de estado de respuesta
 *
 * ⚠ NO usar para comparacion es solo
 * para armado de estructuras como la
 * de msnCode, para procesamiento y
 * asignacion de codigos **debe**
 * usarse `EResStatusCode`
 */
type TKeyStatus =
  | "info"
  | "infoUser"
  | "success"
  | "validUser"
  | "warning"
  | "warningUser"
  | "invalid"
  | "invalidUser"
  | "error";
/**Enumeracion de Acciones especiales no registradas
 * en ningun diccionario y que indican sub acciones
 * agrupadas
 *
 * ❗todas estan nombradas en mayuscula e
 * inician y terminan con el caracter "#"❗
 */
export enum EKeyActionGroupForRes {
  //==== contexto Profundos ============================================
  /**indica grupo de subacciones ejecutadas*/
  actions = "#ACTIONS#",
  /**indica grupo de subacciones ejecutadas de las
   *  propiedades correspondientes a un objeto anonimo
   */
  props = "#PROPS#",
  /**indica grupo de subacciones ejecutadas de las
   *  propiedades correspondientes a un array de
   * elementos (cualquiera que sea)
   */
  items = "#ITEMS#",
  /**indica grupo de subacciones ejecutadas de las
   *  campos correspondientes a un modelo
   * ❕Exclusivo para contexto estructurado❕
   */
  fields = "#FIELDS#",
  /**indica grupo de subacciones ejecutadas de las
   *  modelos embebidos correspondientes a un modelo
   * ❕Exclusivo para contexto estructurado❕
   */
  embModel = "#EMB_MODELS#",
  //==== contexto Modulos ============================================
  /**indica grupo de sub acciones ejecutadas en el modulo
   * *controller*, del contexto *primitive* */
  ctrlPrimitive = "#CTRL_PRIMITIVE#",
  /**indica grupo de sub acciones ejecutadas en el modulo
   * *controller*, del contexto *structure*, en el contexto
   * profundo *field* */
  ctrlField = "#CTRL_FIELD#",
  /**indica grupo de sub acciones ejecutadas en el modulo
   * *controller*, del contexto *structure*, en el contexto
   * profundo *model* */
  ctrlModel = "#CTRL_MODEL#",
  /**indica grupo de sub acciones ejecutadas en el modulo
   * *mutate*, del contexto *primitive* */
  mutatePrimitive = "#MUTATE_PRIMITIVE#",
  /**indica grupo de sub acciones ejecutadas en el modulo
   * *mutate*, del contexto *structure* */
  mutateStructure = "#MUTATE_STRUCTURE#",
  /**indica grupo de sub acciones ejecutadas en el modulo
   * *mutate*, del contexto *structure*, en el contexto
   * profundo *field* */
  mutateField = "#MUTATE_FIELD#",
  /**indica grupo de sub acciones ejecutadas en el modulo
   * *mutate*, del contexto *structure*, en el contexto
   * profundo *model* */
  mutateModel = "#MUTATE_MODEL#",
  /**indica grupo de sub acciones ejecutadas en el modulo
   * *validation*, del contexto *primitive* */
  valPrimitive = "#VAL_PRIMITIVE#",
  /**indica grupo de sub acciones ejecutadas en el modulo
   * *mutate*, del contexto *structure* */
  valStructure = "#VAL_STRUCTURE#",
  /**indica grupo de sub acciones ejecutadas en el modulo
   * *validation*, del contexto *structure*, en el contexto
   * profundo *field* */
  valField = "#VAL_FIELD#",
  /**indica grupo de sub acciones ejecutadas en el modulo
   * *validation*, del contexto *structure*, en el contexto
   * profundo *model* */
  valModel = "#VAL_MODEL#",
  /**indica grupo de sub acciones ejecutadas en el modulo
   * *hook*, del contexto *primitive* */
  hookPrimitive = "#HOOK_PRIMITIVE#",
  /**indica grupo de sub acciones ejecutadas en el modulo
   * *hook*, del contexto *structure* */
  hookStructure = "#HOOK_STRUCTURE#",
  /**indica grupo de sub acciones ejecutadas en el modulo
   * *provider*, del contexto *primitive* */
  providerPrimitive = "#PROVIDER_PRIMITIVE#",
  /**indica grupo de sub acciones ejecutadas en el modulo
   * *provider*, del contexto *structure* */
  providerStructure = "#PROVIDER_STRUCTURE#",
}
/** */
export interface IResponse {
  /**datos */
  data: any;
  /**clave identificadora del modulo */
  keyModule: string;
  /**clave identificadora del contexto logico que se usó para la petición */
  keyLogicContext: TKeyLogicContext;
  /**clave identificadora del contexto de modulo interno */
  keyModuleContext: unknown;
  /**clave identificadora del recurso(modelo o campo), sin ruta */
  keyLogic?: string;
  /**clave identificadora del recurso*/
  keySrc: string;
  /**clave identificadora del tipo de request */
  keyTypeRequest: TKeyRequestType;
  /**clave identificadora de la accion que ejecutó el middleware
   *
   * ❕Existen acciones especiales que agrupan subAcciones, no
   * pertenecen a ningun diccionario dfe acciones y estan nombradas
   * en mayuscula y comienzan y terminan con el caracter `"#"` ❕
   */
  keyAction: string | EKeyActionGroupForRes;
  /**clave identificadora de l apeticion de request */
  keyActionRequest: string;
  /**el dato inicial con el que se inició la peticion en el controller*/
  fisrtCtrlData?: any;
  /**estado despues de la ejecucion del middleware */
  status: ELogicResStatusCode;
  /**mensaje auxiliar (Lógico) */
  msn: string;
  /**contiene un reporte producido por
   * libreria o mudulo externo a la logica */
  extResponse?: object;
  /**tolerancia maxima de respuesta
   * con la que se evaluo este middleware*/
  tolerance: ELogicResStatusCode;
  /**reportes embebidos si los hay */
  responses: IResponse[];
  /**tupla que indica (en caso de haber mutacion),
   * el estado anterio `recordMutate[0]` y el estado
   * posterior `recordMutate[1]` del dato cuando
   * este ah mutado*/
  tRecordMutate?: [any, any];
}
/**refactorizacion de la interfaz */
export type Trf_IResponse = IResponse;
/**tipado especial para la inicializaciuon del manejador */
export type TBaseResponse = Pick<
  IResponse,
  "keyModule" | "keyModuleContext" | "status" | "tolerance"
>;
//====Primitive============================================================================================================================
/**clave identificadora de este modulo segun su contexto */
export type TKeyPrimitiveResponseModuleContext = "primitiveResponse";
/** */
export type TPrimitiveModuleContext =
  | TKeyPrimitiveCriteriaModuleContext
  | TKeyPrimitiveCtrlModuleContext
  | TKeyPrimitiveMutateModuleContext
  | TKeyPrimitiveValModuleContext
  | TKeyPrimitiveHookModuleContext
  | TKeyPrimitiveProviderModuleContext
  | TKeyPrimitiveServiceModuleContext;
/**... */
export interface IPrimitiveResponse extends IResponse {
  keyModuleContext: TPrimitiveModuleContext;
  responses: IPrimitiveResponse[];
}
/**refactorizacion del tipo */
export type Trf_IPrimitiveResponse = IPrimitiveResponse;
/**tipado especial para la inicializaciuon del manejador */
export type TBasePrimitiveResponse = Pick<
  IPrimitiveResponse,
  "keyModule" | "keyModuleContext" | "status" | "tolerance"
>;
//====Structure============================================================================================================================
/**clave identificadora de este modulo segun su contexto */
export type TKeyStructureResponseModuleContext = "structureResponse";
/**clave identificadora profunda para el contexto estructural */
export type TKeyStructureDeepResponseModuleContext =
  | "fieldResponse"
  | "modelResponse";
/** */
export type TStructureModuleContext =
  | TKeyStructureDeepCtrlModuleContext
  | TKeyStructureCriteriaModuleContext
  | TKeyStructureDeepMutateModuleContext
  | TKeyStructureDeepValModuleContext
  | TKeyStructureHookModuleContext
  | TKeyStructureProviderModuleContext
  | TKeyStructureServiceModuleContext;
/**... */
export interface IStructureResponse extends IResponse {
  keyModuleContext: TStructureModuleContext;
  /**ruta del recurso */
  keyPath: string;
  responses: IStructureResponse[];
}
/**refactorizacion del tipo */
export type Trf_IStructureResponse = IStructureResponse;
/**tipado especial para la inicializaciuon del manejador */
export type TBaseStructureResponse = Pick<
  IStructureResponse,
  "keyModule" | "keyModuleContext" | "status" | "tolerance"
>;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**retorna la clave identificadora
 * en texto que corresponde al status */
export function statusToKeyStatus(status: ELogicResStatusCode): TKeyStatus {
  let r: TKeyStatus;
  r =
    status === ELogicResStatusCode.INFO
      ? "info"
      : status === ELogicResStatusCode.INFO_USER
      ? "infoUser"
      : status === ELogicResStatusCode.SUCCESS
      ? "success"
      : status === ELogicResStatusCode.VALID_DATA
      ? "validUser"
      : status === ELogicResStatusCode.WARNING
      ? "warning"
      : status === ELogicResStatusCode.WARNING_DATA
      ? "warningUser"
      : status === ELogicResStatusCode.BAD
      ? "invalid"
      : status === ELogicResStatusCode.INVALID_DATA
      ? "invalidUser"
      : status === ELogicResStatusCode.ERROR
      ? "error"
      : "success";

  return r;
}
