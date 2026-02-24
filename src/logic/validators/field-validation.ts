import {
  TStructureActionConfigFn,
  TTGlobalActionConfig,
} from "../criterias/shared-types";
import { StructureCriteriaHandler } from "../criterias/structure-criteria-handler";
import { ELogicCodeError, LogicError } from "../errors/logic-error";
import { TDataType } from "../meta/shared-types";
import { TwinBeeModule } from "../modules/module";
import {
  EKeyActionGroupForRes,
  ELogicResStatusCode,
  IStructureResponse,
} from "../reports/shared-types";
import { StructureReportHandler } from "../reports/structure-report-handler";
import { StructureLogicValidation } from "./_structure-validation";
import {
  TFieldValBaseConfig,
  TStructureFieldValDiccACForCriteria,
} from "./shared-types";
//████tipos e interfaces████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**tipo exclusivo para adicionar una configuracion
 * a la accion isRequired */
type TisRequiredConfig = {
  /**
   * predefinido como `false`
   *
   * determina si el valor `null` debe asumirse
   * como ausencia de valor (`false`) o
   * como un valor validable (`true`)
   *
   */
  isNullAsValue?: boolean;
  /**
   * predefinido como `false`
   *
   * ❗Solo para campos de tipo objeto (anonimo o embebido)❗
   * determina si el valor `{}` se asume como valor
   * y no como vacio o ausencia de datos
   */
  isEmptyObjectOrArrayAsValue?: boolean;
};
/**tipado para casos especiales del validador isTypeof
 * (casos anónimos o que no tienen metadatos ) */
type TITypeOf = {
  /**tipo de dato (no array) */
  type: TDataType;
  /**si se debe considerar como array */
  isArray: boolean;
};
/** define todas las propiedades de configuracion
 * de cada accion de validacion para  un campo
 * del modelo
 */
export interface IDiccFieldValActionConfig {
  /**determina si el valor del campo
   * corresponde a el tipo configurado
   * en metadatos o si es de estos
   * tipos: `null`, `undefined`.
   *
   * ❗esta validacion **SIEMPRE**
   * debe ejecutarse inicialmente❗
   *
   *
   */
  isTypeOf:
    | true //❗Siempre activa❗
    | TITypeOf;
  /**determina si el valor actual del campo
   * es vacio
   *
   * Los valores considerados vacios son:
   *
   * `undefined`
   * `null`
   * `""`
   * `[]`
   * `{}`
   */
  isRequired: boolean | TisRequiredConfig;
  // /**determina caracteres minimos y maximos
  //  * que puede tener un campo de tipo
  //  * string
  //  *
  //  * ❗se pueden asignar mensajes personalizados
  //  * para los estados `"invalid"` y `"warning"`
  //  * mediante objetos
  //  *
  //  * Ejemplo:
  //  *
  //  * ````
  //  * isStringRangeLength : {
  //  *      msns : {
  //  *          invalid : {
  //  *              min : "Invalido, es menor que lo permitido",
  //  *              max : "Invalido, es mayor que lo permitido"
  //  *          },
  //  *          warning : {
  //  *              w_min : "precaucion, es menor de lo normal",
  //  *              w_max : "precaucion, es mayor que lo normal"
  //  *          }
  //  *      }
  //  * }
  //  */
  // isStringRangeLength:
  //   | {
  //       /**determina el rango de minimo a maximo
  //        * que se puede ingresar
  //        */
  //       range: [number, number];
  //       /**determina rango especial de
  //        * minimo a maximo para saltar una
  //        * advertencia
  //        */
  //       w_range?: [number, number] | undefined;
  //     }
  //   | undefined;
  // /**determina el rango (minimo y maximo)
  //  * de un campo numerico
  //  *
  //  * ❗se pueden asignar mensajes personalizados
  //  * para los estados `"invalid"` y `"warning"`
  //  * mediante objetos
  //  *
  //  * Ejemplo:
  //  *
  //  * ````
  //  * isRange : {
  //  *      msns : {
  //  *          invalid : {
  //  *              min : "Invalido, es menor que lo permitido",
  //  *              max : "Invalido, es mayor que lo permitido"
  //  *          },
  //  *          warning : {
  //  *              w_min : "precaucion, es menor de lo normal",
  //  *              w_max : "precaucion, es mayor que lo normal"
  //  *          }
  //  *      }
  //  * }
  //  * ````
  //  */
  // isRange:
  //   | {
  //       /**determina el rango de minimo a maximo
  //        * que se puede ingresar*/
  //       range: [number, number];
  //       /**determina rango especial de
  //        * minimo a maximo para saltar una
  //        * advertencia
  //        */
  //       w_range?: [number, number] | undefined;
  //     }
  //   | undefined;
  // /**determina el rango (minimo y maximo)
  //  * de un campo numerico
  //  */
  // isSelectable:
  //   | {
  //       /**determina el rango de minimo a maximo
  //        * que se puede ingresar
  //        */
  //       selectionList: any[];
  //       /**si el campo es de tipo objeto
  //        * para verificar si corresponde
  //        * a los seleccionable sse requiere
  //        * un subcampo de del objeto
  //        */
  //       keyFieldForSelectorList?: string;
  //       /**determina elementos que
  //        * no son permitidos usar
  //        * al usuario
  //        *
  //        * 🛑 esto **NO** indica que dichos
  //        * elementos no sean validos, solamente
  //        * que el usuario no debe tener acceso a
  //        * seleccionarlos
  //        */
  //       noAvailableSelectionList?: any[] | "_all";
  //       /**determina el rango de minimo a maximo
  //        * de elementos que pueden seleccionarse
  //        * antes de activar estado `"invalid"`
  //        *
  //        * ⚠ si el campo esta configurado como
  //        * `isArray === false` es sus metadatos,
  //        * este rango es ignorado ya que se deduce
  //        * que solo se permite una selesccion
  //        */
  //       range: [number, number] | undefined;
  //       /**determina el rango de minimo a maximo
  //        * de elementos que pueden seleccionarse
  //        * antes de activar estado `"warning"`
  //        *
  //        * ⚠ si el campo esta configurado como
  //        * `isArray === false` es sus metadatos,
  //        * este rango es ignorado ya que se deduce
  //        * que solo se permite una selesccion
  //        */
  //       w_range?: [number, number] | undefined;
  //     }
  //   | undefined;
  // /**determina el tipo de archivos aceptados*/
  // isAcceptFile:
  //   | {
  //       /**extenciones aceptadas */
  //       extension: string[];
  //       /**tamaño maximo en bytes del archivo o la suma de archivos*/
  //       size: number;
  //       /**tamaño maximo en bytes del archivo o la suma de archivos*/
  //       w_size: number;
  //       /** la cantidad minimo y maxima de archivos */
  //       rangeFile: [number, number];
  //       /** la cantidad minimo y maxima de archivos para `"warning"`*/
  //       w_rangeFile: [number, number];
  //     }
  //   | undefined;
}
/**claves identificadoras del diccionario
 * de acciones de configuracion */
export type TKeysDiccFieldValActionConfig = keyof IDiccFieldValActionConfig;
/**tipado refactorizado de la clase */
export type Trf_FieldLogicValidation = FieldLogicValidation;
//████Clases████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**... */
export class FieldLogicValidation<
    TIDiccAC extends IDiccFieldValActionConfig = IDiccFieldValActionConfig
  >
  extends StructureLogicValidation<TIDiccAC>
  implements
    Record<TKeysDiccFieldValActionConfig, TStructureActionConfigFn<any>>
{
  /** configuración de valores predefinidos para el modulo*/
  public static override readonly getDefault = () => {
    const superDf = StructureLogicValidation.getDefault();
    return {
      ...superDf,
      diccActionConfig: {
        ...(superDf.diccActionConfig as any),
        isTypeOf: true, //siempre
        isRequired: false,
        isAnonymousObject: {
          schemaForATActionConfig: undefined,
          isAllowedExtraProp: true,
        },
        isAnonymousArray: {
          aTGlobalActionConfig: [],
        },
      } as IDiccFieldValActionConfig,
      topPriorityKeysAction: [
        ...superDf.topPriorityKeysAction,
        "isTypeOf",
        "isRequired",
      ] as Array<TKeysDiccFieldValActionConfig>,
      topMandatoryKeysAction: [
        ...superDf.topMandatoryKeysAction,
      ] as Array<TKeysDiccFieldValActionConfig>,
      isRequiredSpecialConfig: {
        isNullAsValue: false,
        isEmptyObjectOrArrayAsValue: false,
      } as TisRequiredConfig,
    };
  };
  public override get isRequiredSpecialConfig(): TisRequiredConfig {
    return super.isRequiredSpecialConfig;
  }
  protected override set isRequiredSpecialConfig(v: TisRequiredConfig) {
    super.isRequiredSpecialConfig = v;
  }
  /** */
  constructor(baseConfig?: TFieldValBaseConfig) {
    super("fieldVal", baseConfig);
    baseConfig = this.util.isObject(baseConfig) ? baseConfig : ({} as any);
  }
  protected override getDefault() {
    return FieldLogicValidation.getDefault();
  }
  /**... */
  protected static buildInstanceForMetadata<
    TFieldValInstance extends FieldLogicValidation = FieldLogicValidation
  >(preInstance: TFieldValInstance): TFieldValInstance {
    const util = TwinBeeModule.util;
    let inst: TFieldValInstance;
    if (util.isInstance(preInstance)) {
      inst = preInstance;
    } else {
      const { structureModuleFactory } =
        TwinBeeModule._globalConfig_.diccModuleFactory;
      inst = structureModuleFactory.makeModuleInstance(
        "fieldVal",
        preInstance as any
      ) as any;
    }
    return inst;
  }
  protected override checkEmptyData(
    data: any,
    specialEmptyConfig: TisRequiredConfig
  ): boolean {
    specialEmptyConfig = this.util.isObject(specialEmptyConfig)
      ? specialEmptyConfig
      : this.getDefault().isRequiredSpecialConfig;
    const { isNullAsValue, isEmptyObjectOrArrayAsValue } = specialEmptyConfig;
    let isEmpty = false;
    //posibilidades de falta de datos
    const isUndefined = data === undefined;
    const isNull = data === null;
    const isEmptyString = data === "";
    const isEmptyObjectOrArray =
      typeof data === "object" && //❗Incluye arrays❗
      data !== null &&
      Object.keys(data).length === 0; //SI VACIO
    isEmpty =
      isUndefined ||
      (isNull && !isNullAsValue) ||
      isEmptyString ||
      (isEmptyObjectOrArray && !isEmptyObjectOrArrayAsValue);
    return isEmpty;
  }
  protected override checkEmptyDataWithRes(
    reportHandler: StructureReportHandler,
    criteriaHandler: StructureCriteriaHandler<any>
  ): IStructureResponse {
    const { data } = criteriaHandler;
    const tKeyGlobalAC = [this.keyModuleContext, "isRequired"];
    const isRequired = criteriaHandler.findGlobalActionByKeyModuleAndKeyAction(
      tKeyGlobalAC as any
    );
    const isEmpty = this.checkEmptyData(data, isRequired as any);
    const rH = reportHandler;
    let res = rH.mutateResponse(undefined);
    //comprobacion de vacio
    if (isEmpty) {
      if (isRequired === undefined) {
        res = rH.mutateResponse(res, {
          status: ELogicResStatusCode.WARNING_DATA,
          msn: `${res.data} is a value valid because the action "isRequired" is not actived`,
        });
      } else {
        res = rH.mutateResponse(res, {
          status: ELogicResStatusCode.INVALID_DATA,
        });
      }
    }
    return res;
  }
  //================================================================
  public async isTypeOf(
    criteriaHandler: StructureCriteriaHandler<any>
  ): Promise<IStructureResponse> {
    //Desempaquetar la acción e inicializar
    const { data } = criteriaHandler;
    const [keyAction, actionConfig] =
      this.getTupleActionConfigFromCriteriaHandler(criteriaHandler, "isTypeOf");
    const rH = this.buildReportHandler(criteriaHandler, keyAction);
    let res = rH.mutateResponse(undefined, { data });
    //❗tratamiento especial, dependiendo de la fuente de
    // configuración (metadatos (normalemnte) o anonimos)❗
    let dataType: TDataType;
    let isArray: boolean;
    if (this.util.isObject(actionConfig)) {
      dataType = (actionConfig as TITypeOf).type;
      isArray = (actionConfig as TITypeOf).isArray;
    } else {
      const mH = this.metadataHandler;
      const fieldMeta = mH.getExtractMetadataByModuleContext(
        "structureField",
        "metadata",
        criteriaHandler.keyPath
      );
      isArray = fieldMeta.__isArray;
      dataType = fieldMeta.__type;
    }
    //❗❗❗isTypeof no necesita saber si es dato vacio o no❗❗❗
    let isValid: boolean;
    //❗OBLIGATORIO iniciar las evaluación con array❗
    if (isArray === true)
      isValid = this.util.isValueType(data, ["undefined", "null", "array"]);
    else if (dataType === "boolean")
      isValid = this.util.isValueType(data, ["undefined", "null", "boolean"]);
    else if (dataType === "number")
      isValid = this.util.isValueType(data, ["undefined", "null", "number"]);
    else if (dataType === "bigint")
      isValid = this.util.isValueType(data, ["undefined", "null", "bigint"]);
    else if (dataType === "string")
      isValid = this.util.isValueType(data, ["undefined", "null", "string"]);
    else if (dataType === "string-RegExp")
      isValid = this.util.isValueType(data, ["undefined", "null", "string"]);
    else if (dataType === "string-Date")
      isValid = this.util.isValueType(data, ["undefined", "null", "string"]);
    else if (dataType === "timestamp")
      isValid = this.util.isValueType(data, ["undefined", "null", "number"]);
    else if (dataType === "symbol")
      isValid = this.util.isValueType(data, ["undefined", "null", "symbol"]);
    else if (dataType === "object")
      isValid = this.util.isValueType(data, ["undefined", "null", "object"]);
    else if (dataType === "structure")
      isValid = this.util.isValueType(data, ["undefined", "null", "object"]);
    // else if (fieldType === "function")
    //   isValid = this.util.isValueType(data, ["undefined", "null", "function"]);
    else if (dataType === "_system")
      isValid = this.util.isNotUndefinedAndNotNull(data);
    else isValid = this.util.isUndefinedOrNull(data); //❗Por default solo aceptaría `undefined` o `null`, rechazando todo lo demás ❗
    //finalizar, siguiente accion o reportar
    if (isValid === false) {
      res = rH.mutateResponse(res, {
        status: ELogicResStatusCode.INVALID_DATA,
      });
    }
    return res;
  }
  public async isRequired(
    criteriaHandler: StructureCriteriaHandler<any>
  ): Promise<IStructureResponse> {
    //Desempaquetar la accion e inicializar
    const { data } = criteriaHandler;
    const [keyAction, actionConfig] =
      this.getTupleActionConfigFromCriteriaHandler(
        criteriaHandler,
        "isRequired"
      );
    const rH = this.buildReportHandler(criteriaHandler, keyAction);
    let res = rH.mutateResponse(undefined, { data });
    //❗se verifica el vació sin res❗
    const isEmpty = this.checkEmptyData(
      data,
      actionConfig as TisRequiredConfig
    );
    let isValid = !isEmpty;
    //finalizar, siguiente accion o reportar
    if (isValid === false) {
      res = rH.mutateResponse(res, {
        status: ELogicResStatusCode.INVALID_DATA,
      });
    }
    return res;
  }
  // public async isStringRangeLength({
  //   bag = <IBag>{},
  //   data,
  //   diccActionConfig,
  //   key,
  //   embAbsolutePath,
  //   isNullAsValue,
  // }: TParam_FieldValAction<IDiccFieldValActionG>): Promise<IValResponseForAction> {
  //   //Desempaquetar la accion e inicializar
  //   const keyAction: TLibKeyAction = "isStringRangeLength";
  //   const actionConfig = diccActionConfig[keyAction];
  //   //const { } = this.getFieldOrEmbFieldConfig(keyFieldOrKeyEmbField, embAbsolutePath);
  //   const pVL = new PrimitiveValLibGeneric(isNullAsValue);
  //   const pRes = await pVL.isStringRangeLength(
  //     data,
  //     { isRange: actionConfig },
  //     bag,
  //     keyFieldOrKeyEmbField
  //   );
  //   let res = rH.mutateResponseForAction(undefined, {
  //     keyAction,
  //     key: keyFieldOrKeyEmbField,
  //     status: pRes.status,
  //   });
  //   return res;
  // }
  // public async isRange({
  //   bag = <IBag>{},
  //   data,
  //   diccActionConfig,
  //   key,
  //   embAbsolutePath,
  //   isNullAsValue,
  // }: TParam_FieldValAction<IDiccFieldValActionG>): Promise<IValResponseForAction> {
  //   //Desempaquetar la accion e inicializar
  //   const keyAction: TLibKeyAction = "isRange";
  //   const actionConfig = diccActionConfig[keyAction];
  //   //const { } = this.getFieldOrEmbFieldConfig(keyFieldOrKeyEmbField, embAbsolutePath);
  //   const pVL = new PrimitiveValLibGeneric(isNullAsValue);
  //   const pRes = await pVL.isRange(
  //     data,
  //     { isRange: actionConfig },
  //     bag,
  //     keyFieldOrKeyEmbField
  //   );
  //   let res = rH.mutateResponseForAction(undefined, {
  //     keyAction,
  //     key: keyFieldOrKeyEmbField,
  //     status: pRes.status,
  //   });
  //   return res;
  // }
  // public async isSelectable({
  //   bag = <IBag>{},
  //   data,
  //   diccActionConfig,
  //   key,
  //   embAbsolutePath,
  //   isNullAsValue,
  // }: TParam_FieldValAction<IDiccFieldValActionG>): Promise<IValResponseForAction> {
  //   //Desempaquetar la accion e inicializar
  //   const keyAction: TLibKeyAction = "isSelectable";
  //   const actionConfig = diccActionConfig[keyAction];
  //   const { isArray, fieldType } = this.getFieldOrEmbFieldConfig(
  //     keyFieldOrKeyEmbField,
  //     embAbsolutePath
  //   );
  //   const { keyFieldForSelectorList, selectionList, range, w_range } =
  //     actionConfig;
  //   let res = rH.mutateResponseForAction(undefined, {
  //     keyAction,
  //     key: keyFieldOrKeyEmbField,
  //     status: ELogicResStatusCode.VALID_DATA,
  //   });
  //   if (!isArray) {
  //     //si no es array entonces recibe UNIQUE seleccion
  //     if (Array.isArray(data) || isArray) {
  //       //🚫 si son arrays
  //       res = rH.mutateResponseForAction(res, {
  //         status: ELogicResStatusCode.INVALID_DATA,
  //       });
  //       return res;
  //     }
  //     if (fieldType !== "schema") {
  //       if (typeof data === "object") {
  //         //🚫 si son objeto
  //         res = rH.mutateResponseForAction(res, {
  //           status: ELogicResStatusCode.INVALID_DATA,
  //         });
  //         return res;
  //       }
  //       const isInclude = selectionList.includes(data);
  //       if (!isInclude) {
  //         res = rH.mutateResponseForAction(res, {
  //           status: ELogicResStatusCode.INVALID_DATA,
  //         });
  //         return res;
  //       }
  //     } else {
  //       if (this.util.isObject(data, false)) {
  //         //🚫 si NO son objeto
  //         res = rH.mutateResponseForAction(res, {
  //           status: ELogicResStatusCode.INVALID_DATA,
  //         });
  //         return res;
  //       }
  //       if (
  //         keyFieldForSelectorList === undefined ||
  //         keyFieldForSelectorList === null
  //       ) {
  //         //🚫 si NO se recibe un identificador de subcampo
  //         res = rH.mutateResponseForAction(res, {
  //           status: ELogicResStatusCode.ERROR,
  //         });
  //         return res;
  //       }
  //       const isInclude = selectionList.some(
  //         (sel) =>
  //           sel[keyFieldForSelectorList] === data[keyFieldForSelectorList]
  //       );
  //       if (!isInclude) {
  //         res = rH.mutateResponseForAction(res, {
  //           status: ELogicResStatusCode.INVALID_DATA,
  //         });
  //         return res;
  //       }
  //     }
  //   } else {
  //     //si es array entonces recibe MULTIPLE seleccion
  //     if (!Array.isArray(data) || !isArray) {
  //       //🚫 si NO son arrays
  //       res = rH.mutateResponseForAction(res, {
  //         status: ELogicResStatusCode.INVALID_DATA,
  //       });
  //       return res;
  //     }
  //     for (let idx = 0; idx < data.length; idx++) {
  //       if (fieldType !== "schema") {
  //         if (typeof data[idx] === "object") {
  //           //🚫 si son objeto
  //           res = rH.mutateResponseForAction(res, {
  //             status: ELogicResStatusCode.INVALID_DATA,
  //           });
  //           return res;
  //         }
  //         const isInclude = selectionList.includes(data[idx]);
  //         if (!isInclude) {
  //           res = rH.mutateResponseForAction(res, {
  //             status: ELogicResStatusCode.INVALID_DATA,
  //           });
  //           return res;
  //         }
  //       } else {
  //         if (typeof data[idx] !== "object") {
  //           //🚫 si NO son objeto
  //           res = rH.mutateResponseForAction(res, {
  //             status: ELogicResStatusCode.INVALID_DATA,
  //           });
  //           return res;
  //         }
  //         if (
  //           keyFieldForSelectorList === undefined ||
  //           keyFieldForSelectorList === null
  //         ) {
  //           //🚫 si NO se recibe un identificador de subcampo
  //           res = rH.mutateResponseForAction(res, {
  //             status: ELogicResStatusCode.ERROR,
  //           });
  //           return res; //solo referencia porque se genera error
  //         }
  //         const isInclude = selectionList.some(
  //           (sel) =>
  //             sel[keyFieldForSelectorList] ===
  //             data[idx][keyFieldForSelectorList]
  //         );
  //         if (!isInclude) {
  //           res = rH.mutateResponseForAction(res, {
  //             status: ELogicResStatusCode.INVALID_DATA,
  //           });
  //           return res;
  //         }
  //       }
  //     }
  //     //rangos de cantidad de selecciones
  //     if (Array.isArray(range)) {
  //       const min = range[0];
  //       const max = range[1];
  //       const w_min = Array.isArray(w_range) ? w_range[0] : min - 10; //cantidad menor al minimo permitido para no activar warning
  //       const w_max = Array.isArray(w_range) ? w_range[1] : max + 10; //cantidad mayor al maximo permitido para no activar warning

  //       if (min > max || w_min > w_max) {
  //         //rango no computable
  //         res = rH.mutateResponseForAction(res, {
  //           status: ELogicResStatusCode.ERROR,
  //         });
  //         return res;
  //       }
  //       if (data.length < w_min) {
  //         res = rH.mutateResponseForAction(res, {
  //           status: ELogicResStatusCode.WARNING_DATA,
  //         });
  //       }
  //       if (data.length > w_max) {
  //         res = rH.mutateResponseForAction(res, {
  //           status: ELogicResStatusCode.WARNING_DATA,
  //         });
  //       }
  //       if (data.length < min) {
  //         res = rH.mutateResponseForAction(res, {
  //           status: ELogicResStatusCode.INVALID_DATA,
  //         });
  //         return res;
  //       }
  //       if (data.length > max) {
  //         res = rH.mutateResponseForAction(res, {
  //           status: ELogicResStatusCode.INVALID_DATA,
  //         });
  //         return res;
  //       }
  //     }
  //   }
  //   return res;
  // }
  // public async isAcceptFile({
  //   bag = <IBag>{},
  //   data,
  //   diccActionConfig,
  //   key,
  //   embAbsolutePath,
  //   isNullAsValue,
  // }: TParam_FieldValAction<IDiccFieldValActionG>): Promise<IValResponseForAction> {
  //   //Desempaquetar la accion e inicializar
  //   const keyAction: TLibKeyAction = "isAcceptFile";
  //   const actionConfig = diccActionConfig[keyAction];
  //   //const { } = this.getFieldOrEmbFieldConfig(keyFieldOrKeyEmbField, embAbsolutePath);
  //   const pVL = new PrimitiveValLibGeneric(isNullAsValue);
  //   const pRes = await pVL.isAcceptFile(
  //     data,
  //     { isAcceptFile: actionConfig },
  //     bag,
  //     keyFieldOrKeyEmbField
  //   );
  //   let res = rH.mutateResponseForAction(undefined, {
  //     keyAction,
  //     key: keyFieldOrKeyEmbField,
  //     status: pRes.status,
  //   });
  //   return res;
  // }
  public async isAnonymousObject(
    criteriaHandler: StructureCriteriaHandler<any>
  ): Promise<IStructureResponse> {
    //Desempaquetar la acción e inicializar
    const { data, keyPath } = criteriaHandler;
    const [keyAction, actionConfig] =
      this.getTupleActionConfigFromCriteriaHandler(
        criteriaHandler,
        "isAnonymousObject"
      );
    const rH = this.buildReportHandler(criteriaHandler, keyAction);
    let res = rH.mutateResponse(undefined, { data });
    let { schemaForATActionConfig, isAllowedExtraProp } = actionConfig;
    //===============================================
    //❗Obligatorio verificar que se pueda validar el dato❗
    res = this.checkEmptyDataWithRes(rH, criteriaHandler);
    if (res.status > ELogicResStatusCode.VALID_DATA) return res;
    //===============================================
    const mH = this.metadataHandler;
    //bandera de tipo por seguridad (por si no se ejecutó isTypeOf)
    const isObject = this.util.isObject(data);
    //determinar si hay esquema de propiedades para validar cada una
    if (!this.util.isObject(schemaForATActionConfig)) {
      //al no haber esquema, solo se puede verificar el tipo general
      if (isObject) {
        res = rH.mutateResponse(res, {
          status: ELogicResStatusCode.VALID_DATA,
        });
      } else {
        throw new LogicError({
          code: ELogicCodeError.MODULE_ERROR,
          msn: `${schemaForATActionConfig} is not schema for action config valid`,
        });
      }
      return res;
    }
    //si hay esquema de propiedades a validar, data debe ser objeto
    if (!isObject) {
      res = rH.mutateResponse(res, {
        status: ELogicResStatusCode.INVALID_DATA,
      });
      return res;
    }
    const keysPropSchema = Object.keys(schemaForATActionConfig);
    //análisis de propiedades adicionales al esquema
    isAllowedExtraProp = this.util.convertToBoolean(isAllowedExtraProp);
    if (!isAllowedExtraProp) {
      const keysData = Object.keys(data);
      const keysDiff = this.util.getArrayDifference(
        [keysPropSchema, keysData],
        "difference_A"
      );
      if (keysDiff.length > 0) {
        res = rH.mutateResponse(res, {
          status: ELogicResStatusCode.INVALID_DATA,
        });
        return res;
      }
    }
    //validar propiedades de esquema (las adicionales no se validan)
    for (const keyProp of keysPropSchema) {
      const aTupleAC = schemaForATActionConfig[keyProp];
      const subData = data[keyProp];
      const keyPseudoPath = this.util.buildPath([keyPath, keyProp]);
      let embResForProp = rH.mutateResponse(undefined, {
        data: subData,
        keyLogic: keyProp,
        keyPath: keyPseudoPath,
        keyAction: EKeyActionGroupForRes.props,
      });
      //si no es un array de tuplas, indica que permite cualquier valor
      if (
        !this.util.isArray(aTupleAC) ||
        aTupleAC.some((tAC) => !this.util.isTuple(tAC, [2, 3]))
      ) {
        res.responses.push(embResForProp);
        continue;
      }
      const subCriteriaHandler = new StructureCriteriaHandler(
        mH,
        "structureField",
        {
          keyPath: keyPseudoPath,
          data: subData,
          aTGlobalActionConfig: aTupleAC as any,
        }
      );
      for (const tupleAC of aTupleAC) {
        const keyAction = tupleAC[0];
        let actionFn = this.getActionFnByKey(keyAction as any);
        const resForAction = await actionFn(subCriteriaHandler);
        embResForProp.responses.push(resForAction);
        if (resForAction.status >= res.tolerance) break; //comprobar si se superó la tolerancia
      }
      embResForProp = rH.mutateResponse(embResForProp);
      res.responses.push(embResForProp);
    }
    res = rH.mutateResponse(res);
    return res;
  }
  public async isAnonymousArray(
    criteriaHandler: StructureCriteriaHandler<any>
  ): Promise<IStructureResponse> {
    //Desempaquetar la accion e inicializar
    const { data, keyPath } = criteriaHandler;
    const [keyAction, actionConfig] =
      this.getTupleActionConfigFromCriteriaHandler(
        criteriaHandler,
        "isAnonymousArray"
      );
    const rH = this.buildReportHandler(criteriaHandler, keyAction);
    let res = rH.mutateResponse(undefined, { data });
    let { aTGlobalActionConfig } = actionConfig;
    //===============================================
    //❗Obligatorio verificar que se pueda validar el dato❗
    res = this.checkEmptyDataWithRes(rH, criteriaHandler);
    if (res.status > ELogicResStatusCode.VALID_DATA) return res;
    //===============================================
    const mH = this.metadataHandler;
    //bandera de tipo por seguridad (por si no se ejecutó isTypeOf)
    const isArray = this.util.isArray(data);
    //determinar si hay esquema de propiedades para validar cada elemento del array
    if (!this.util.isArray(aTGlobalActionConfig)) {
      //al no haber esquema, solo se puede verificar el tipo general
      if (isArray) {
        res = rH.mutateResponse(res, {
          status: ELogicResStatusCode.VALID_DATA,
        });
      } else {
        throw new LogicError({
          code: ELogicCodeError.MODULE_ERROR,
          msn: `${aTGlobalActionConfig} is not tuple array for action config valid`,
        });
      }
      return res;
    }
    //si hay esquema de propiedades a validar, data debe ser array
    if (!isArray) {
      res = rH.mutateResponse(res, {
        status: ELogicResStatusCode.INVALID_DATA,
      });
      return res;
    }
    //análisis de cada elemento del array
    for (let idx = 0; idx < (data as any[]).length; idx++) {
      const subData = data[idx];
      const keyIdx = `${idx}`;
      const keyPseudoPath = this.util.buildPath([keyPath, keyIdx]);
      let embResForItem = rH.mutateResponse(undefined, {
        data: subData,
        keyLogic: keyIdx,
        keyPath: keyPseudoPath,
        keyAction: EKeyActionGroupForRes.items,
      });
      const subCriteriaHandler = new StructureCriteriaHandler(
        mH,
        "structureField",
        {
          keyPath: keyPseudoPath,
          data: subData,
          aTGlobalActionConfig: aTGlobalActionConfig as any,
        }
      );
      for (const tupleAC of aTGlobalActionConfig) {
        const keyAction = tupleAC[0];
        let actionFn = this.getActionFnByKey(keyAction as any);
        const resForAction = await actionFn(subCriteriaHandler);
        embResForItem.responses.push(resForAction);
        if (resForAction.status >= res.tolerance) break; //comprobar si se superó la tolerancia
      }
      embResForItem = rH.mutateResponse(embResForItem);
      res.responses.push(embResForItem);
    }
    res = rH.mutateResponse(res);
    return res;
  }
}
