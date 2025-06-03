import {
  PrimitiveCriteriaHandler,
  Trf_PrimitiveCriteriaHandler,
} from "../criterias/primitive-criteria-handler";
import { TPrimitiveActionConfigFn } from "../criterias/shared-types";
import { Trf_PrimitiveLogicMetadataHandler } from "../meta/primitive-metadata-handler";
import { TDataType } from "../meta/shared-types";
import { TwinBeeModule } from "../modules/module";
import { PrimitiveReportHandler } from "../reports/primitive-report-handler";
import {
  EKeyActionGroupForRes,
  ELogicResStatusCode,
  IPrimitiveResponse,
} from "../reports/shared-types";
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
  type: TDataType;
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
          type: "string",
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
    const util = TwinBeeModule.util;
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
    // configuración (metadatos (normalmente) o anónimos)❗
    let dataType: TDataType;
    let isArray: boolean;
    if (this.util.isObject(actionConfig)) {
      dataType = (actionConfig as TITypeOf).type;
      isArray = (actionConfig as TITypeOf).isArray;
    } else {
      const mH = this.metadataHandler;
      const primitiveMeta = mH.getExtractMetadataByModuleContext("metadata");
      isArray = primitiveMeta.__isArray;
      dataType = primitiveMeta.__type;
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
}
