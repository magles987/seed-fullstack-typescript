import { LogicValidation, TZodSchemaForClose } from "./_validation";
import { TPrimitiveType } from "../meta/metadata-handler-shared";
import { TPrimitiveMetaAndValidator } from "../meta/metadata-shared";
import {
  TKeyPrimitiveValModuleContext,
  TPrimitiveConfigForVal,
} from "./shared";
import {
  IPrimitiveBagForActionModuleContext,
  TPrimitiveFnBagForActionModule,
} from "../bag-module/shared-for-external-module";
import {
  EKeyActionGroupForRes,
  ELogicResStatusCode,
  IPrimitiveResponse,
} from "../reports/shared";
import { PrimitiveBag, Trf_PrimitiveBag } from "../bag-module/primitive-bag";
import { TGenericTupleActionConfig } from "../config/shared-modules";
import { Trf_PrimitiveLogicMetadataHandler } from "../meta/primitive-metadata-handler";
import { ELogicCodeError, LogicError } from "../errors/logic-error";
import {
  PrimitiveReportHandler,
  Trf_PrimitiveReportHandler,
} from "../reports/primitive-report-handler";

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
export interface IDiccPrimitiveValActionConfigG {
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
    type: TPrimitiveType;
    /**si el campo es array de tipos
     * de campo (`fieldType`) */
    isArray?: boolean;
  }; //❗Siempre activa❗
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
  isRequired: boolean | TisRequiredConfig | undefined;
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
          Array<TGenericTupleActionConfig<IDiccPrimitiveValActionConfigG>> //tupla de acciones [keyAction, ActionConfig]
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
          TGenericTupleActionConfig<IDiccPrimitiveValActionConfigG>
        >;
      }
    | undefined;
}
/**claves identificadoras del diccionario
 * de acciones de configuracion */
export type TKeysDiccPrimitiveValActionConfigG =
  keyof IDiccPrimitiveValActionConfigG;
/**tipado refactorizado de la clase */
export type Trf_PrimitiveLogicValidation = PrimitiveLogicValidation;
//████Clases████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**... */
export class PrimitiveLogicValidation<
    TIDiccAC extends IDiccPrimitiveValActionConfigG = IDiccPrimitiveValActionConfigG
  >
  extends LogicValidation<TIDiccAC>
  implements
    Record<TKeysDiccPrimitiveValActionConfigG, TPrimitiveFnBagForActionModule>
{
  /** configuracion de valores predefinidos para el modulo*/
  public static override readonly getDefault = () => {
    const superDf = LogicValidation.getDefault();
    return {
      ...superDf,
      dfDiccActionConfig: {
        ...(superDf.dfDiccActionConfig as any),
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
      } as IDiccPrimitiveValActionConfigG,
      topPriorityKeysAction: [
        ...superDf.topPriorityKeysAction,
        "isTypeOf",
        "isRequired",
      ] as Array<TKeysDiccPrimitiveValActionConfigG>,
      topMandatoryKeysAction: [
        ...superDf.topMandatoryKeysAction,
      ] as Array<TKeysDiccPrimitiveValActionConfigG>,
      dfIsRequiredSpecialConfig: {
        isNullAsValue: false,
        isEmptyObjectOrArrayAsValue: false,
      } as TisRequiredConfig,
    };
  };
  /**
   * @param keySrc indentificadora del recurso asociado a modulo
   */
  constructor(keySrc: string) {
    super("primitive", keySrc);
  }
  protected override getDefault() {
    return PrimitiveLogicValidation.getDefault();
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
  protected override getMetadataWithContextModule(): TPrimitiveMetaAndValidator<TIDiccAC> {
    const metadata =
      this.metadataHandler.getExtractMetadataByModuleContext("validator");
    return metadata as any;
  }
  protected override getMetadataOnlyModuleConfig(): TPrimitiveConfigForVal<
    TIDiccAC,
    any
  > {
    const metadata = this.getMetadataWithContextModule();
    const config = metadata.__valConfig;
    return config;
  }
  protected override getDiccMetadataActionConfig(): TIDiccAC {
    const config = this.getMetadataOnlyModuleConfig();
    const configPrimitive = config.primitiveVal;
    const diccAC = configPrimitive.diccActionsConfig as TIDiccAC;
    return diccAC;
  }
  /**obtiene una funcion de accion de acuerdo a su clave identificadora
   * preparada para ser inyectada en el middleware
   *
   * @param keyAction la clave identificadora de la funcion de accion solicitada
   *
   * @returns la funcion de accion
   */
  public override getActionFnByKey<
    TKeys extends keyof TIDiccAC = keyof TIDiccAC
  >(keyAction: TKeys): TPrimitiveFnBagForActionModule<PrimitiveBag<any>>;
  /**obtiene un array de funciones de accion de acuerdo a sus claves identificadoras
   * preparadas para ser inyectadas en el middleware
   *
   * @param keysAction el array de las claves identificadoras de las funciones de accion solicitadas
   *
   * @returns el array de funciones de accion
   */
  public override getActionFnByKey<
    TKeys extends keyof TIDiccAC = keyof TIDiccAC
  >(
    keysAction: TKeys[]
  ): Array<TPrimitiveFnBagForActionModule<PrimitiveBag<any>>>;
  public override getActionFnByKey(keyOrKeysAction: unknown): unknown {
    return super.getActionFnByKey(keyOrKeysAction);
  }
  protected override adapBagForContext<TKey extends keyof TIDiccAC>(
    bag: PrimitiveBag<any>,
    keyAction: TKey
  ): IPrimitiveBagForActionModuleContext<TIDiccAC, TKey> {
    const tGlobalAC = bag.findTupleGlobalActionConfig([
      this.keyModule as any,
      this.keyModuleContext,
      keyAction as never,
    ]);
    const tupleAC = bag.retrieveTupleActionConfig<TIDiccAC, any>(tGlobalAC);
    let actionConfig = this.retriveActionConfigFromTuple(tupleAC);
    if (actionConfig === undefined) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${actionConfig} is not action configuration valid`,
      });
    }
    actionConfig = this.buildSingleActionConfig(
      "toActionConfig" as any,
      keyAction as any,
      actionConfig as any,
      { mergeMode: "soft" }
    );
    const bagFC: IPrimitiveBagForActionModuleContext<TIDiccAC, any> = {
      data: bag.data,
      keyAction,
      actionConfig,
      responses: bag.responses,
      criteriaHandler: bag.criteriaHandler,
    };
    return bagFC;
  }
  public override buildReportHandler(
    bag: Trf_PrimitiveBag,
    keyAction: keyof TIDiccAC
  ): PrimitiveReportHandler {
    const { data, criteriaHandler, firstData } = bag;
    const { type, modifyType, keyActionRequest } = criteriaHandler;
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
      fisrtCtrlData: firstData,
      data,
    });
    return rH;
  }
  public override preRunAction(
    bag: Trf_PrimitiveBag,
    keyAction: keyof TIDiccAC
  ): void {
    super.preRunAction(bag, keyAction as any) as any;
    return;
  }
  public override postRunAction(
    bag: Trf_PrimitiveBag,
    res: IPrimitiveResponse
  ): void {
    super.postRunAction(bag, res) as any;
    return;
  }
  protected checkEmptyData(
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
  protected checkEmptyDataWithRes(
    reportHandler: PrimitiveReportHandler,
    bag: PrimitiveBag<any>,
    data: any
  ): IPrimitiveResponse {
    const tGlobalAC = bag.findTupleGlobalActionConfig([
      this.keyModule as any,
      this.keyModuleContext,
      "isRequired" as never,
    ]);
    const tIsRequired = bag.retrieveTupleActionConfig<TIDiccAC, any>(tGlobalAC);
    const isRequired = this.util.isTuple(tIsRequired, 2)
      ? tIsRequired[1] //la configuracion de la accion sin envoltura
      : undefined;
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
  public async isTypeOf(bag: PrimitiveBag<any>): Promise<IPrimitiveResponse> {
    //Desempaquetar la accion e inicializar
    const { data, keyAction, actionConfig } = this.adapBagForContext(
      bag,
      "isTypeOf"
    );
    const rH = this.buildReportHandler(bag, keyAction);
    let res = rH.mutateResponse(undefined, { data });
    const { isArray, type } = actionConfig;
    //❗❗❗isTypeof no necesita saber si es dato vacio o no❗❗❗
    //validaciones primitivas con zod:
    let zodCursor: TZodSchemaForClose;
    if (isArray === true)
      zodCursor = this.zod.optional(this.zod.array(this.zod.any())).nullable();
    else if (type === "boolean")
      zodCursor = this.zod.optional(this.zod.boolean()).nullable();
    else if (type === "number")
      zodCursor = this.zod.optional(this.zod.number()).nullable();
    else if (type === "bigint")
      zodCursor = this.zod.optional(this.zod.bigint()).nullable();
    else if (type === "string")
      zodCursor = this.zod.optional(this.zod.string()).nullable();
    else if (type === "string-RegExp")
      zodCursor = this.zod.optional(this.zod.string()).nullable();
    else if (type === "string-Date")
      zodCursor = this.zod.optional(this.zod.string()).nullable();
    else if (type === "timestamp")
      zodCursor = this.zod.optional(this.zod.number()).nullable();
    else if (type === "symbol")
      zodCursor = this.zod.optional(this.zod.symbol()).nullable();
    //else if(__fieldType === "undefined") zodCursor = this.zod.undefined();
    //else if(__fieldType === "null") zodCursor = this.zod.null();
    else if (type === "object")
      zodCursor = this.zod.optional(this.zod.object({})).nullable();
    else if (type === "structure")
      zodCursor = this.zod.optional(this.zod.object({})).nullable();
    else if (type === "_system")
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
  public async isRequired(bag: PrimitiveBag<any>): Promise<IPrimitiveResponse> {
    //Desempaquetar la accion e inicializar
    const { data, keyAction, actionConfig } = this.adapBagForContext(
      bag,
      "isRequired"
    );
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
  public async isAnonimusObject(
    bag: PrimitiveBag<any>
  ): Promise<IPrimitiveResponse> {
    //Desempaquetar la accion e inicializar
    const { data, keyAction, actionConfig } = this.adapBagForContext(
      bag,
      "isAnonimusObject"
    );
    const rH = this.buildReportHandler(bag, keyAction);
    let res = rH.mutateResponse(undefined, { data });
    let { anonimuSchemaForATupleAC, isAllowedExtraProp } = actionConfig;
    //===============================================
    //❗Obligatorio verificar que se pueda validar el dato❗
    res = this.checkEmptyDataWithRes(rH, bag, data);
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
      let embResForProp = rH.mutateResponse(undefined, {
        data: subData,
        keyLogic: keyProp,
        keyAction: EKeyActionGroupForRes.props,
      });
      const subBag = new PrimitiveBag(this.keySrc, {
        data: subData,
        aTupleGlobalActionConfig:
          bag.buildATupleModuleContextActionConfigFromATupleAC(
            this,
            aTupleAC as any[]
          ),
        criteriaHandler: bag.criteriaHandler,
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
    bag: PrimitiveBag<any>
  ): Promise<IPrimitiveResponse> {
    //Desempaquetar la accion e inicializar
    const { data, keyAction, actionConfig, responses } = this.adapBagForContext(
      bag,
      "isAnonimusArray"
    );
    const rH = this.buildReportHandler(bag, keyAction);
    let res = rH.mutateResponse(undefined, { data });
    let { aTupleAC } = actionConfig;
    //===============================================
    //❗Obligatorio verificar que se pueda validar el dato❗
    res = this.checkEmptyDataWithRes(rH, bag, data);
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
      const subBag = new PrimitiveBag(this.keySrc, {
        data: subData,
        aTupleGlobalActionConfig:
          bag.buildATupleModuleContextActionConfigFromATupleAC(
            this,
            aTupleAC as any[]
          ),
        criteriaHandler: bag.criteriaHandler,
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
