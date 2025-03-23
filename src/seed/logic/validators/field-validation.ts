import { StructureLogicValidation } from "./_structure-validation";
import { TFieldType } from "../meta/shared";
import { TZodSchemaForClose } from "./_validation";
import { TStructureFieldMetaAndValidator } from "../meta/metadata-shared";
import {
  TFieldConfigForVal,
  TModelConfigForVal,
  TStructureValModuleConfigForField,
} from "./shared";
import {
  EKeyActionGroupForRes,
  ELogicResStatusCode,
  IStructureResponse,
} from "../reports/shared";
import { StructureBag } from "../bag/structure-bag";
import { StructureReportHandler } from "../reports/structure-report-handler";
import { TStructureFnBagForActionModule } from "../bag/shared";
import {
  IDiccModelValActionConfigG,
  ModelLogicValidation,
} from "./model-validation";
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
/** define todas las propiedades de configuracion
 * de cada accion de validacion para  un campo
 * del modelo
 */
export interface IDiccFieldValActionConfigG {
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
  isTypeOf: {
    /**tipo de campo */
    fieldType: TFieldType;
    /**si el campo es array de tipos
     * de campo (`fieldType`) */
    isArray?: boolean;
  }; //❗Siempre activa❗ por eso no se permite booleano
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
  /**
   * establece una configuracion de validacion
   * embebida para cada elementos del array
   *
   * ⚠ SOLO para arrays de tipos primitivos, NO
   * usar con modelos embebidos
   */
  isAnonimusObject: {
    //❓POSIBLES ERRORES DE CONFIGURACION❓
    //se aplicará a cada propiedad del objeto por
    //lo que deben ser validaciones muy genericas
    /**recursivo para los subcampos */
    anonimuSchemaForATupleAC: Record<
      any,
      Array<
        [
          keyof IDiccFieldValActionConfigG,
          IDiccFieldValActionConfigG[keyof IDiccFieldValActionConfigG]
        ]
      > //tupla de acciones [keyAction, ActionConfig]
    >; //Modelo o esquema con los campos asinando a cada uno un array de diccionarios de acciones de configuracion (ADiccAC)
    /**determina si se permite propiedades
     * adicionales en el dato que no esten
     * en la configuracion de `schemaADiccActionsConfig`
     *
     * Ejemplo:
     * ````
     * isObjectAnonimus = {
     *   isEmbbeded: false,
     *   schemaADiccActionsConfig: {
     *     field1: [
     *       { isTypeOf: { fieldType: "string" } },
     *       { isRequired: true }
     *     ],
     *   },
     *   isAllowedExtraProp: true
     * }
     *
     * data = {
     *   field1: "algun dato",
     *   field2: 99,
     * }
     * //`data` es valido aunque tenga
     * //una propiedad extra `field2`
     *
     * **⚠Importante:** el permitir propiedades
     * extras estas no se validan asi que
     * pueden incluir cualquier tipo de información
     * ````
     *
     */
    isAllowedExtraProp?: boolean;
  };
  /** */
  isAnonimusArray: {
    /**array de diccionarios de acciones para cada elemento del array del dato*/
    aTupleAC: Array<
      [
        keyof IDiccFieldValActionConfigG,
        IDiccFieldValActionConfigG[keyof IDiccFieldValActionConfigG]
      ]
    >;
  };
  /**determina si es un modelo embebido y lo valida internamente */
  isEmbModel:
    | {
        embModelDiccAC: Partial<
          TModelConfigForVal<IDiccModelValActionConfigG, any>["modelVal"]
        >;
      }
    | undefined;
  /**determina si es un array de modelos embebidos y los valida internamente */
  isArrayEmbModel:
    | {
        embModelDiccAC: Partial<
          TModelConfigForVal<IDiccModelValActionConfigG, any>["modelVal"]
        >;
      }
    | undefined;
}
/**claves identificadoras del diccionario
 * de acciones de configuracion */
export type TKeysDiccFieldValActionConfigG = keyof IDiccFieldValActionConfigG;
/**tipado refactorizado de la clase */
export type Trf_FieldLogicValidation = FieldLogicValidation;
//████Clases████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**... */
export class FieldLogicValidation<
    TIDiccAC extends IDiccFieldValActionConfigG = IDiccFieldValActionConfigG
  >
  extends StructureLogicValidation<TIDiccAC>
  implements
    Record<TKeysDiccFieldValActionConfigG, TStructureFnBagForActionModule>
{
  /** configuración de valores predefinidos para el modulo*/
  public static override readonly getDefault = () => {
    const superDf = StructureLogicValidation.getDefault();
    return {
      ...superDf,
      dfDiccActionConfig: {
        ...(superDf.dfDiccActionConfig as any),
        isTypeOf: {
          isArray: false,
          fieldType: "string",
        },
        isRequired: false,
        isEmbModel: { embModelDiccAC: {} },
        isArrayEmbModel: { embModelDiccAC: {} },
        isAnonimusObject: {
          anonimuSchemaForATupleAC: undefined,
          isAllowedExtraProp: true,
          isEmbModel: false,
        },
        isAnonimusArray: {
          aTupleAC: [],
        },
      } as IDiccFieldValActionConfigG,
      topPriorityKeysAction: [
        ...superDf.topPriorityKeysAction,
        "isTypeOf",
        "isRequired",
      ] as Array<TKeysDiccFieldValActionConfigG>,
      topMandatoryKeysAction: [
        ...superDf.topMandatoryKeysAction,
      ] as Array<TKeysDiccFieldValActionConfigG>,
      dfIsRequiredSpecialConfig: {
        isNullAsValue: false,
        isEmptyObjectOrArrayAsValue: false,
      } as TisRequiredConfig,
    };
  };
  /** */
  constructor() {
    super("fieldVal");
  }
  protected override getDefault() {
    return FieldLogicValidation.getDefault();
  }
  protected override rebuildCustomConfigFromModuleContext(
    currentContextConfig: TStructureValModuleConfigForField<TIDiccAC>,
    newContextConfig: TStructureValModuleConfigForField<TIDiccAC>,
    mergeMode: Parameters<typeof this.util.deepMergeObjects>[1]["mode"]
  ): TStructureValModuleConfigForField<TIDiccAC> {
    const cCC = currentContextConfig;
    const nCC = newContextConfig;
    let rConfig: TStructureValModuleConfigForField<TIDiccAC>;
    if (!this.util.isObject(nCC)) {
      rConfig = cCC;
    } else {
      rConfig = {
        ...nCC,
        diccActionsConfig: this.util.isObject(nCC.diccActionsConfig)
          ? this.util.mergeDiccActionConfig(
              [cCC.diccActionsConfig, nCC.diccActionsConfig],
              {
                mode: mergeMode,
                //isNullAsUndefined: fieldContextInst.g,❓❓como insertar las configuraciones especiales como null como undefined❓❓
              }
            )
          : cCC.diccActionsConfig,
      };
    }
    //...aqui configuracion refinada:
    const { diccActionsConfig } = rConfig;
    return rConfig;
  }
  protected override getMetadataWithContextModule(
    keyPath?: string
  ): TStructureFieldMetaAndValidator<FieldLogicValidation> {
    return super.getMetadataWithContextModule(keyPath) as any;
  }
  protected override getMetadataOnlyModuleConfig(
    keyPath?: string
  ): TFieldConfigForVal<TIDiccAC> {
    return super.getMetadataOnlyModuleConfig(keyPath);
  }
  protected override checkEmptyData(
    data: any,
    specialEmptyConfig: TisRequiredConfig
  ): boolean {
    specialEmptyConfig = this.util.isObject(specialEmptyConfig)
      ? specialEmptyConfig
      : this.getDefault().dfIsRequiredSpecialConfig;
    const { isNullAsValue, isEmptyObjectOrArrayAsValue } = specialEmptyConfig;
    let isEmpty = false;
    //posibilidades de falta de datos
    const isUndefined = data === undefined;
    const isNull = data === null;
    const isEmptyString = data === "";
    const isEmptyObjectOrArray =
      typeof data === "object" &&
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
    bag: StructureBag<any>
  ): IStructureResponse {
    const { criteriaHandler, data } = bag;
    const tKeyGlobalAC = [this.keyModuleContext, "isRequired"];
    const isRequired = criteriaHandler.getGlobalActionByTKeyGlobalAC(
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
  public async isTypeOf(bag: StructureBag<any>): Promise<IStructureResponse> {
    //Desempaquetar la accion e inicializar
    const { data, criteriaHandler: cH } = bag;
    const [keyAction, actionConfig] =
      this.getTupleActionConfigFromCriteriaHandler(cH, "isTypeOf");
    const rH = this.buildReportHandler(bag, keyAction);
    let res = rH.mutateResponse(undefined, { data });
    const { isArray, fieldType } = actionConfig;
    //❗❗❗isTypeof no necesita saber si es dato vacio o no❗❗❗
    //validaciones primitivas con zod:
    let zodCursor: TZodSchemaForClose;
    if (isArray === true)
      zodCursor = this.zod.optional(this.zod.array(this.zod.any())).nullable();
    else if (fieldType === "boolean")
      zodCursor = this.zod.optional(this.zod.boolean()).nullable();
    else if (fieldType === "number")
      zodCursor = this.zod.optional(this.zod.number()).nullable();
    else if (fieldType === "bigint")
      zodCursor = this.zod.optional(this.zod.bigint()).nullable();
    else if (fieldType === "string")
      zodCursor = this.zod.optional(this.zod.string()).nullable();
    else if (fieldType === "string-RegExp")
      zodCursor = this.zod.optional(this.zod.string()).nullable();
    else if (fieldType === "string-Date")
      zodCursor = this.zod.optional(this.zod.string()).nullable();
    else if (fieldType === "timestamp")
      zodCursor = this.zod.optional(this.zod.number()).nullable();
    else if (fieldType === "symbol")
      zodCursor = this.zod.optional(this.zod.symbol()).nullable();
    //else if(__fieldType === "undefined") zodCursor = this.zod.undefined();
    //else if(__fieldType === "null") zodCursor = this.zod.null();
    else if (fieldType === "object")
      zodCursor = this.zod.optional(this.zod.object({})).nullable();
    else if (fieldType === "structure")
      zodCursor = this.zod.optional(this.zod.object({})).nullable();
    else if (fieldType === "_system")
      zodCursor = this.zod.any(); //❗Aqui es generico❗
    else zodCursor = data === null ? this.zod.null() : this.zod.undefined(); //❗Por default solo aceptaria `undefined` y `null` rechazando todo lo demas ❗
    let isValid = zodCursor.safeParse(data).success;
    //finalizar, siguiente accion o reportar
    if (isValid === false) {
      res = rH.mutateResponse(res, {
        status: ELogicResStatusCode.INVALID_DATA,
      });
    }
    return res;
  }
  public async isRequired(bag: StructureBag<any>): Promise<IStructureResponse> {
    //Desempaquetar la accion e inicializar
    const { data, criteriaHandler: cH } = bag;
    const [keyAction, actionConfig] =
      this.getTupleActionConfigFromCriteriaHandler(cH, "isRequired");
    const rH = this.buildReportHandler(bag, keyAction);
    let res = rH.mutateResponse(undefined, { data });
    //❗se verifica el vacion sin res❗
    const isEmptyData = this.checkEmptyData(
      data,
      actionConfig as TisRequiredConfig
    );
    //validacion personalizada con zod para requerido:
    let zodCursor = this.zod.unknown().refine(() => !isEmptyData);
    let isValid = zodCursor.safeParse(data).success;
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
  public async isAnonimusObject(
    bag: StructureBag<any>
  ): Promise<IStructureResponse> {
    //Desempaquetar la accion e inicializar
    const { data, criteriaHandler: cH } = bag;
    const [keyAction, actionConfig] =
      this.getTupleActionConfigFromCriteriaHandler(cH, "isAnonimusObject");
    const rH = this.buildReportHandler(bag, keyAction);
    let res = rH.mutateResponse(undefined, { data });
    let { anonimuSchemaForATupleAC, isAllowedExtraProp } = actionConfig;
    const { keyPath } = cH;
    //===============================================
    //❗Obligatorio verificar que se pueda validar el dato❗
    res = this.checkEmptyDataWithRes(rH, bag);
    if (res.status > ELogicResStatusCode.VALID_DATA) return res;
    //===============================================
    //determinar la fuente de las acciones de configuracion (embebido o anonimo)
    if (!this.util.isObject(anonimuSchemaForATupleAC)) {
      res = rH.mutateResponse(res, {
        status: ELogicResStatusCode.ERROR,
        msn: `${anonimuSchemaForATupleAC} is not schema of array of tuples of action config configure valid`,
      });
      return res;
    }
    const keysPropSchema = Object.keys(anonimuSchemaForATupleAC);
    //analisis de propiedades adicionales al esquema
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
      const aTupleAC = anonimuSchemaForATupleAC[keyProp];
      const subData = data[keyProp];
      const keyPseudoPath = this.util.buildPath([keyPath, keyProp]);
      let embResForProp = rH.mutateResponse(undefined, {
        data: subData,
        keyLogic: keyProp,
        keyPath: keyPseudoPath,
        keyAction: EKeyActionGroupForRes.props,
      });
      const subCriteriaHandler = cH.buildSubCriteriaHandler("structureAnonym", {
        ...cH.getSubAnonymSchemaForGlobalActionConfig(
          "fieldVal",
          aTupleAC as any
        ),
        keyPath: keyPseudoPath,
      });
      const subBag = new StructureBag(this.keySrc, "fieldBag", {
        data: subData,
        criteriaHandler: subCriteriaHandler,
      });
      for (const tupleAC of aTupleAC) {
        const keyAction = tupleAC[0];
        let actionFn = this.getActionFnByKey(keyAction as any);
        const resForAction = await actionFn(subBag);
        embResForProp.responses.push(resForAction);
        if (resForAction.status >= res.tolerance) break; //comprobar si se superó la tolerancia
      }
      embResForProp = rH.mutateResponse(embResForProp);
      res.responses.push(embResForProp);
    }
    res = rH.mutateResponse(res);
    return res;
  }
  public async isAnonimusArray(
    bag: StructureBag<any>
  ): Promise<IStructureResponse> {
    //Desempaquetar la accion e inicializar
    const { data, criteriaHandler: cH } = bag;
    const [keyAction, actionConfig] =
      this.getTupleActionConfigFromCriteriaHandler(cH, "isAnonimusArray");
    const rH = this.buildReportHandler(bag, keyAction);
    let res = rH.mutateResponse(undefined, { data });
    let { aTupleAC } = actionConfig;
    const { keyPath } = cH;
    //===============================================
    //❗Obligatorio verificar que se pueda validar el dato❗
    res = this.checkEmptyDataWithRes(rH, bag);
    if (res.status > ELogicResStatusCode.VALID_DATA) return res;
    //===============================================
    if (!this.util.isArray(data, true)) {
      res = rH.mutateResponse(res, {
        status: ELogicResStatusCode.INVALID_DATA,
      });
      return res;
    }
    //validar cada item del array de datos
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
      const subCriteriaHandler = cH.buildSubCriteriaHandler("structureAnonym", {
        ...cH.getSubAnonymSchemaForGlobalActionConfig(
          "fieldVal",
          aTupleAC as any
        ),
        keyPath: keyPseudoPath,
      });
      const subBag = new StructureBag(this.keySrc, "fieldBag", {
        data: subData,
        criteriaHandler: subCriteriaHandler,
      });
      for (const tupleAC of aTupleAC) {
        const keyAction = tupleAC[0];
        let actionFn = this.getActionFnByKey(keyAction as any);
        const resForAction = await actionFn(subBag);
        embResForItem.responses.push(resForAction);
        if (resForAction.status >= res.tolerance) break; //comprobar si se superó la tolerancia
      }
      embResForItem = rH.mutateResponse(embResForItem);
      res.responses.push(embResForItem);
    }
    res = rH.mutateResponse(res);
    return res;
  }
  /**... */
  public async isEmbModel(bag: StructureBag<any>): Promise<IStructureResponse> {
    //Desempaquetar la accion e inicializar
    const { data, criteriaHandler: cH } = bag;
    const [keyAction, actionConfig] =
      this.getTupleActionConfigFromCriteriaHandler(cH, "isEmbModel");
    const rH = this.buildReportHandler(bag, keyAction);
    let res = rH.mutateResponse(undefined, { data });
    const { keyPath } = cH;
    let { embModelDiccAC } = actionConfig;
    //===============================================
    //❗Obligatorio verificar que se pueda validar el dato❗
    res = this.checkEmptyDataWithRes(rH, bag);
    if (res.status > ELogicResStatusCode.VALID_DATA) return res;
    //===============================================
    embModelDiccAC = this.util.isObject(embModelDiccAC) ? embModelDiccAC : {};
    const sub_cH = cH.buildSubCriteriaHandler("structureEmbedded", {
      diccGlobalAC: {
        modelVal: embModelDiccAC as any,
      },
      keyPath,
    });
    const subBag = new StructureBag(this.keySrc, "modelBag", {
      data,
      criteriaHandler: sub_cH,
    });
    const mH = this.metadataHandler;
    const modelMetadata = mH.getExtractMetadataByStructureContext(
      "structureEmbedded",
      keyPath
    );
    const modelValInst = mH.diccModuleInstanceContext
      .fieldVal as ModelLogicValidation;
    //... falata
    return res;
  }
  /**... */
  public async isArrayEmbModel(
    bag: StructureBag<any>
  ): Promise<IStructureResponse> {
    //Desempaquetar la accion e inicializar
    const { data, criteriaHandler: cH } = bag;
    const [keyAction, actionConfig] =
      this.getTupleActionConfigFromCriteriaHandler(cH, "isEmbModel");
    const rH = this.buildReportHandler(bag, keyAction);
    let res = rH.mutateResponse(undefined, { data });
    const { keyPath } = cH;
    let { embModelDiccAC } = actionConfig;
    //===============================================
    //❗Obligatorio verificar que se pueda validar el dato❗
    res = this.checkEmptyDataWithRes(rH, bag);
    if (res.status > ELogicResStatusCode.VALID_DATA) return res;
    //===============================================
    embModelDiccAC = this.util.isObject(embModelDiccAC) ? embModelDiccAC : {};
    const sub_cH = cH.buildSubCriteriaHandler("structureEmbedded", {
      diccGlobalAC: {
        modelVal: embModelDiccAC as any,
      },
      keyPath,
    });

    const subBag = new StructureBag(this.keySrc, "modelBag", {
      data,
      criteriaHandler: sub_cH,
    });
    const mH = this.metadataHandler;
    const modelMetadata = mH.getExtractMetadataByStructureContext(
      "structureEmbedded",
      keyPath
    );
    const modelValInst = mH.diccModuleInstanceContext
      .fieldVal as ModelLogicValidation;
    //... falata
    return res;
  }
}
