import { Module } from "../modules/index-barrel";
import {
  PrimitiveCriteriaHandler,
  TPrimitiveActionConfigFn,
  Trf_PrimitiveCriteriaHandler,
} from "../criterias/index-barrel";
import { Trf_PrimitiveLogicMetadataHandler } from "../meta/index-barrel";
import { TPrimitiveType } from "../meta/shared-types";
import {
  EKeyActionGroupForRes,
  ELogicResStatusCode,
  IPrimitiveResponse,
  PrimitiveReportHandler,
} from "../reports/index-barrel";
import { LogicValidation } from "./_validation";
import {
  TKeyPrimitiveValModuleContext,
  TPrimitiveValBaseConfig,
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
  primitiveType: TPrimitiveType;
  /**si se debe considerar como array */
  isArray: boolean;
};
/** define todas las propiedades de configuracion
 * de cada accion de validacion para  un campo
 * del modelo
 */
export interface IDiccPrimitiveValActionConfig {
  /**determina si el valor del campo
   * corresponde a el tipo configurado
   * en metadatos o si es de estos
   * tipos: `null`, `undefined`.
   *
   * ❗esta validación **SIEMPRE**
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
  /**
   * establece una configuracion de validacion
   * embebida para cada elementos del array
   *
   * ⚠ SOLO para arrays de tipos primitivos, NO
   * usar con modelos embebidos
   */
  isAnonimusObject:
    | {
        //❓POSIBLES ERRORES DE CONFIGURACION❓
        //se aplicará a cada propiedad del objeto por
        //lo que deben ser validaciones muy genericas
        /**recursivo para los subcampos */
        anonimuSchemaForATupleAC: Record<
          any,
          Array<
            [
              keyof IDiccPrimitiveValActionConfig,
              IDiccPrimitiveValActionConfig[keyof IDiccPrimitiveValActionConfig]
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
      }
    | undefined;
  /** */
  isAnonimusArray:
    | {
        /**array de diccionarios de acciones para cada elemento del array del dato*/
        aTupleAC: Array<
          [
            keyof IDiccPrimitiveValActionConfig,
            IDiccPrimitiveValActionConfig[keyof IDiccPrimitiveValActionConfig]
          ]
        >;
      }
    | undefined;
}
/**claves identificadoras del diccionario
 * de acciones de configuracion */
export type TKeysDiccPrimitiveValActionConfig =
  keyof IDiccPrimitiveValActionConfig;
/**tipado refactorizado de la clase */
export type Trf_PrimitiveLogicValidation = PrimitiveLogicValidation;
//████Clases████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**... */
export class PrimitiveLogicValidation<
    TIDiccAC extends IDiccPrimitiveValActionConfig = IDiccPrimitiveValActionConfig
  >
  extends LogicValidation<TIDiccAC>
  implements
    Record<TKeysDiccPrimitiveValActionConfig, TPrimitiveActionConfigFn<any>>
{
  /** configuracion de valores predefinidos para el modulo*/
  public static override readonly getDefault = () => {
    const superDf = LogicValidation.getDefault();
    return {
      ...superDf,
      diccActionConfig: {
        ...(superDf.diccActionConfig as any),
        isTypeOf: {
          isArray: false,
          primitiveType: "string",
        },
        isRequired: false,
        isAnonimusObject: {
          anonimuSchemaForATupleAC: undefined,
          isAllowedExtraProp: true,
          isEmbModel: false,
        },
        isAnonimusArray: {
          aTupleAC: [],
        },
      } as IDiccPrimitiveValActionConfig,
      topPriorityKeysAction: [
        ...superDf.topPriorityKeysAction,
        "isTypeOf",
        "isRequired",
      ] as Array<TKeysDiccPrimitiveValActionConfig>,
      topMandatoryKeysAction: [
        ...superDf.topMandatoryKeysAction,
      ] as Array<TKeysDiccPrimitiveValActionConfig>,
      isRequiredSpecialConfig: {
        isNullAsValue: false,
        isEmptyObjectOrArrayAsValue: false,
      } as TisRequiredConfig,
    };
  };
  /**... */
  private _isRequiredSpecialConfig: TisRequiredConfig;
  public get isRequiredSpecialConfig(): TisRequiredConfig {
    return this._isRequiredSpecialConfig;
  }
  protected set isRequiredSpecialConfig(v: TisRequiredConfig) {
    this._isRequiredSpecialConfig = this.util.isObject(v)
      ? v
      : this._isRequiredSpecialConfig !== undefined
      ? this._isRequiredSpecialConfig
      : this.getDefault().isRequiredSpecialConfig;
  }
  /** */
  constructor(baseConfig?: TPrimitiveValBaseConfig) {
    super("primitive", baseConfig);
    baseConfig = this.util.isObject(baseConfig) ? baseConfig : ({} as any);
  }
  protected override getDefault() {
    return PrimitiveLogicValidation.getDefault();
  }
  /** */
  protected static buildInstanceForMetadata<
    TPrimitiveValInstance extends PrimitiveLogicValidation = PrimitiveLogicValidation
  >(preInstance: TPrimitiveValInstance): TPrimitiveValInstance {
    const util = Module.util;
    let inst: TPrimitiveValInstance;
    if (util.isInstance(preInstance)) {
      inst = preInstance;
    } else if (util.isObject(preInstance, true)) {
      inst = new PrimitiveLogicValidation(preInstance) as TPrimitiveValInstance;
    } else {
      inst = new PrimitiveLogicValidation() as TPrimitiveValInstance;
    }
    return inst;
  }
  public override get metadataHandler(): Trf_PrimitiveLogicMetadataHandler {
    const mH = super.metadataHandler as Trf_PrimitiveLogicMetadataHandler;
    return mH;
  }
  public override set metadataHandler(mH: Trf_PrimitiveLogicMetadataHandler) {
    super.metadataHandler = mH;
  }
  public override get keyModuleContext(): TKeyPrimitiveValModuleContext {
    return "primitiveVal";
  }
  /**obtiene una función de acción de acuerdo a su clave identificadora
   * preparada para ser inyectada en el middleware
   *
   * @param keyAction la clave identificadora de la funcion de accion solicitada
   *
   * @returns la funcion de accion
   */
  public override getActionFnByKey<
    TKeys extends keyof TIDiccAC = keyof TIDiccAC
  >(keyAction: TKeys): TPrimitiveActionConfigFn<any>;
  /**obtiene un array de funciones de accion de acuerdo a sus claves identificadoras
   * preparadas para ser inyectadas en el middleware
   *
   * @param keysAction el array de las claves identificadoras de las funciones de accion solicitadas
   *
   * @returns el array de funciones de accion
   */
  public override getActionFnByKey<
    TKeys extends keyof TIDiccAC = keyof TIDiccAC
  >(keysAction: TKeys[]): Array<TPrimitiveActionConfigFn<any>>;
  public override getActionFnByKey(keyOrKeysAction: unknown): unknown {
    return super.getActionFnByKey(keyOrKeysAction);
  }
  protected override getTupleActionConfigFromCriteriaHandler<
    TKey extends keyof TIDiccAC
  >(
    criteriaHandler: Trf_PrimitiveCriteriaHandler,
    keyAction: TKey
  ): [TKey, TIDiccAC[TKey]] {
    const tKeyGlobalAC = [this.keyModuleContext, keyAction];
    const actionConfig =
      criteriaHandler.findGlobalActionByKeyModuleAndKeyAction(
        tKeyGlobalAC as any
      );
    return [keyAction, actionConfig];
  }
  protected override buildReportHandler(
    criteriaHandler: PrimitiveCriteriaHandler<any>,
    keyAction: keyof TIDiccAC
  ): PrimitiveReportHandler {
    const { data, firstData, type, modifyType, keyActionRequest } =
      criteriaHandler;
    let rH = new PrimitiveReportHandler(this.keySrc, {
      keyRepModule: this.keyModule as any,
      keyRepModuleContext: this.keyModuleContext,
      keyRepLogicContext: this.keyLogicContext,
      keyActionRequest: keyActionRequest,
      keyAction: keyAction as any,
      keyTypeRequest: type,
      keyModifyTypeRequest: modifyType,
      keyLogic: this.keySrc,
      keyRepSrc: this.keySrc,
      status: this.globalStatus,
      tolerance: this.globalTolerance,
      firstCtrlData: firstData,
      data,
    });
    return rH;
  }
  public override preRunAction(
    criteriaHandler: PrimitiveCriteriaHandler<any>,
    keyAction: keyof TIDiccAC
  ): void {
    super.preRunAction(criteriaHandler, keyAction as any) as any;
    return;
  }
  public override postRunAction(
    criteriaHandler: PrimitiveCriteriaHandler<any>,
    res: IPrimitiveResponse
  ): void {
    super.postRunAction(criteriaHandler, res) as any;
    return;
  }
  protected checkEmptyData(
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
  protected checkEmptyDataWithRes(
    reportHandler: PrimitiveReportHandler,
    criteriaHandler: PrimitiveCriteriaHandler<any>
  ): IPrimitiveResponse {
    const { data } = criteriaHandler;
    const tKeyGlobalAC = [this.keyModuleContext, "isRequired"];
    const isRequired = criteriaHandler.findGlobalActionByKeyModuleAndKeyAction(
      tKeyGlobalAC as any
    );
    const isEmpty = this.checkEmptyData(data, isRequired as any);
    let res: IPrimitiveResponse = undefined;
    //comprobacion de vacio
    if (isEmpty) {
      const rH = reportHandler;
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
    criteriaHandler: PrimitiveCriteriaHandler<any>
  ): Promise<IPrimitiveResponse> {
    //Desempaquetar la accion e inicializar
    const { data } = criteriaHandler;
    const [keyAction, actionConfig] =
      this.getTupleActionConfigFromCriteriaHandler(criteriaHandler, "isTypeOf");
    const rH = this.buildReportHandler(criteriaHandler, keyAction);
    let res = rH.mutateResponse(undefined, { data });
    //❗tratamiento especial, dependiendo de la fuente de
    // configuración (metadatos (normalemnte) o anonimos)❗
    let primitiveType: TPrimitiveType;
    let isArray: boolean;
    if (this.util.isObject(actionConfig)) {
      primitiveType = (actionConfig as TITypeOf).primitiveType;
      isArray = (actionConfig as TITypeOf).isArray;
    } else {
      const mH = this.metadataHandler;
      const fieldMeta = mH.getExtractMetadataByModuleContext("metadata");
      isArray = fieldMeta.__isArray;
      primitiveType = fieldMeta.__type;
    }
    //❗❗❗isTypeof no necesita saber si es dato vacio o no❗❗❗
    let isValid: boolean;
    //❗OBLIGATORIO iniciar las evaluación con array❗
    if (isArray === true)
      isValid = this.util.isValueType(data, ["undefined", "null", "array"]);
    else if (primitiveType === "boolean")
      isValid = this.util.isValueType(data, ["undefined", "null", "boolean"]);
    else if (primitiveType === "number")
      isValid = this.util.isValueType(data, ["undefined", "null", "number"]);
    else if (primitiveType === "bigint")
      isValid = this.util.isValueType(data, ["undefined", "null", "bigint"]);
    else if (primitiveType === "string")
      isValid = this.util.isValueType(data, ["undefined", "null", "string"]);
    else if (primitiveType === "string-RegExp")
      isValid = this.util.isValueType(data, ["undefined", "null", "string"]);
    else if (primitiveType === "string-Date")
      isValid = this.util.isValueType(data, ["undefined", "null", "string"]);
    else if (primitiveType === "timestamp")
      isValid = this.util.isValueType(data, ["undefined", "null", "number"]);
    else if (primitiveType === "symbol")
      isValid = this.util.isValueType(data, ["undefined", "null", "symbol"]);
    else if (primitiveType === "object")
      isValid = this.util.isValueType(data, ["undefined", "null", "object"]);
    else if (primitiveType === "structure")
      isValid = this.util.isValueType(data, ["undefined", "null", "object"]);
    // else if (fieldType === "function")
    //   isValid = this.util.isValueType(data, ["undefined", "null", "function"]);
    else if (primitiveType === "_system")
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
    criteriaHandler: PrimitiveCriteriaHandler<any>
  ): Promise<IPrimitiveResponse> {
    //Desempaquetar la accion e inicializar
    const { data } = criteriaHandler;
    const [keyAction, actionConfig] =
      this.getTupleActionConfigFromCriteriaHandler(
        criteriaHandler,
        "isRequired"
      );
    const rH = this.buildReportHandler(criteriaHandler, keyAction);
    let res = rH.mutateResponse(undefined, { data });
    //❗se verifica el vacion sin res❗
    const isEmptyData = this.checkEmptyData(
      data,
      actionConfig as TisRequiredConfig
    );
    let isValid = !isEmptyData;
    //finalizar, siguiente accion o reportar
    if (isValid === false) {
      res = rH.mutateResponse(res, {
        status: ELogicResStatusCode.INVALID_DATA,
      });
    }
    return res;
  }
  public async isAnonimusObject(
    criteriaHandler: PrimitiveCriteriaHandler<any>
  ): Promise<IPrimitiveResponse> {
    //Desempaquetar la accion e inicializar
    const { data } = criteriaHandler;
    const [keyAction, actionConfig] =
      this.getTupleActionConfigFromCriteriaHandler(
        criteriaHandler,
        "isAnonimusObject"
      );
    const rH = this.buildReportHandler(criteriaHandler, keyAction);
    let res = rH.mutateResponse(undefined, { data });
    let { anonimuSchemaForATupleAC, isAllowedExtraProp } = actionConfig;
    //===============================================
    //❗Obligatorio verificar que se pueda validar el dato❗
    res = this.checkEmptyDataWithRes(rH, criteriaHandler);
    if (res.status > ELogicResStatusCode.VALID_DATA) return res;
    //===============================================
    if (!this.util.isObject(anonimuSchemaForATupleAC)) {
      res = rH.mutateResponse(res, {
        status: ELogicResStatusCode.ERROR,
        msn: `${anonimuSchemaForATupleAC} is not schema of array of tuples of action config configure valid`,
      });
      return res;
    }
    const keysPropSchema = Object.keys(anonimuSchemaForATupleAC);
    //análisis de propiedades adicionales al esquema
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
      let embResForProp = rH.mutateResponse(undefined, {
        data: subData,
        keyLogic: keyProp,
        keyAction: EKeyActionGroupForRes.props,
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
    criteriaHandler: PrimitiveCriteriaHandler<any>
  ): Promise<IPrimitiveResponse> {
    //Desempaquetar la accion e inicializar
    const { data } = criteriaHandler;
    const [keyAction, actionConfig] =
      this.getTupleActionConfigFromCriteriaHandler(
        criteriaHandler,
        "isAnonimusArray"
      );
    const rH = this.buildReportHandler(criteriaHandler, keyAction);
    let res = rH.mutateResponse(undefined, { data });
    let { aTupleAC } = actionConfig;
    //===============================================
    //❗Obligatorio verificar que se pueda validar el dato❗
    res = this.checkEmptyDataWithRes(rH, criteriaHandler);
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
      let embResForItem = rH.mutateResponse(undefined, {
        data: subData,
        keyLogic: keyIdx,
        keyAction: EKeyActionGroupForRes.items,
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
}
