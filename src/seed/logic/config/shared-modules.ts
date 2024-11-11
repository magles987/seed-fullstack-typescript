/**clave identificadora de modulos de alto perfil en base a acciones*/
export type TKeyActionModule = "mutater" | "hook" | "validator" | "provider";
/**clave identificadora de modulos de alto perfil en base a funcion de cursor*/
export type TKeyHandlerModule =
  | "criteria"
  | "metadata"
  | "service"
  | "error"
  | "bag"
  | "report";
/**clave identificadora de modulos de alto perfil en base personalizado*/
export type TKeyExclusiveModule = "controller" | "middleware";
/**clave identificadora de modulos con reportes de respuesta asignados */
export type TKeyModuleWithReport =
  | TKeyActionModule
  | Extract<TKeyExclusiveModule, "controller">
  | Extract<TKeyHandlerModule, "service">;
/**Tipos de modulos para la logica de negocio*/
export type TKeyModule =
  | TKeyActionModule
  | TKeyHandlerModule
  | TKeyExclusiveModule
  | "unknow";
/**Define losnombres de contexto de logica para manejar los datos*/
export type TKeyLogicContext = "structure" | "primitive";
/**define los nombres contextos para una estructura sencilla (solo modelo y campo) */
export type TKeyStructureContextBasic = "structureModel" | "structureField";
/**define los nombres contextos para una estructura completa */
export type TKeyStructureContextFull =
  | TKeyStructureContextBasic
  | "structureEmbedded";
/**agrupa los tipos de consulta en lectura o modificacion */
export type TKeyRequestType = "read" | "modify";
/**sub agrupa los tipos de consulta en contexto de modificacion */
export type TKeyRequestModifyType = "create" | "update" | "delete";
/**clave identificadoras de acciones CRUD básicas */
export type TKeyBasicCRUD = Exclude<TKeyRequestType, "modify"> | TKeyRequestModifyType;
/**tipos de datos usados en la logica
 * de negocio.
 *
 * 🚫 Los Arrays son un "envoltorio" o
 * "agrupador"de estos tipos de datos,
 * por lo tanto **no** son considerados
 * como un tipo especifico de dato y
 * no esta en este type
 *
 */
export type TDataType =
  //Primitivos serializables
  | "boolean"
  | "bigint"
  | "number"
  | "string"
  | "string-RegExp" //❗ string especial para Expresion Regular
  | "string-Date" //❗ un string que representa una fecha (no es el objeto Date)
  | "symbol"
  | "undefined"
  | "null"
  | "timestamp"
  //esquemas
  | "object" //❗ Objeto literal anonimo y serializable
  | "structure" //❗ es un objeto literal fuertemente acoplado a una estructura, esquema, modelo o modelo embebido (comunmente usado en contexto structure)
  //Utilitarios
  | "any" //⚠ Representa cualquier valor **Usar con precaucion**
  | "_system"; //❗ representa un tipo reservado par ael sistema (id, path o cualquier otro)
/**seleccion de nombre del recurso (singular o plural) para
 * la comunicacion con los drivers de gestio de peticion */
export type TKeySrcSelector = "singular" | "plural";
/**tipo generico estandar para una tupla de accion de configuracion
 *
 * `TIDiccAC` el diccionario de acciones
 * ``
 */
export type TGenericTupleActionConfig<
  TIDiccAC,
  TKeyAction extends keyof TIDiccAC = keyof TIDiccAC
> = [TKeyAction, TIDiccAC[TKeyAction]];
