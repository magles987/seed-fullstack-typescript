import {
  PrimitiveCriteriaHandler,
  Trf_PrimitiveCriteriaHandler,
} from "../criterias/primitive-criteria-handler";
import { TPrimitiveActionConfigFn } from "../criterias/shared-types";
import { Trf_PrimitiveLogicMetadataHandler } from "../meta/primitive-metadata-handler";
import { Module } from "../modules/module";
import { PrimitiveReportHandler } from "../reports/primitive-report-handler";
import { IPrimitiveResponse } from "../reports/shared-types";
import { Util_Module } from "../util/util-module";
import { LogicMutater } from "./_mutater";
import {
  TKeyPrimitiveMutateModuleContext,
  TPrimitiveMutateBaseConfig,
} from "./shared-types";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** define las propiedades de cada formateo
 * que puede configurar y ejecutar un campo
 *
 * ⚠ todas las propiedades raiz hacen referencia
 * a un formato, ya que un campo puede tener
 * asignados varias de estos formatos, estas
 * propiedades deben ser **opcionales**
 */
export interface IDiccPrimitiveMutateActionConfig {
  // //====formateo booleano===========================
  // /**
  //  * si el campo es booleano determina
  //  * si un campo booleano es formateable
  //  * de acuerdo a su ambiguedad.
  //  *
  //  * Escenarios:
  //  * ````
  //  * //=========================
  //  * //Caso false
  //  *
  //  * //antes de formatear:
  //  * valuePrimitive = undefined;
  //  * valuePrimitive = null;
  //  * valuePrimitive = 0; //o negativo
  //  * valuePrimitive = "";
  //  * valuePrimitive = []; //vacio
  //  * valuePrimitive = {}; //sin propiedades
  //  * //se formatea a:
  //  * valuePrimitive = false;
  //  *
  //  * //=========================
  //  * //Caso true
  //  *
  //  * //antes de formatear:
  //  * valuePrimitive = 1; //cualquier positivo
  //  * valuePrimitive = "any";
  //  * valuePrimitive = [anyItems]; //NO vacio
  //  * valuePrimitive = {anyItems:any}; //con propiedades
  //  * valuePrimitive = ()=>{}; //cualquier tipo Function
  //  * //se formatea a:
  //  * valuePrimitive = true;
  //  * ````
  //  */
  // boolean_isFormat: IDiccPrimitiveFormatActionG["boolean_isFormat"];
  // //================================================
  // //formateo para campo numerico
  // /**
  //  * Determina si se usa como booleano numerico
  //  * (exclusivo para proveedores que no aconsejen
  //  * usar booleanos estandar como firebase).
  //  *
  //  * ⚠ Si es true, se ignorará otros formateos numericos
  //  * con los siguientes resultado
  //  */
  // number_isBoolean: IDiccPrimitiveFormatActionG["number_isBoolean"];
  // /** Determina el rango entre positivos y negativos:
  //  * *Type:*
  //  * `+` : solo positivos.
  //  * `-` : solo negativo.
  //  * `+/-` : ambos
  //  */
  // number_typeZ: IDiccPrimitiveFormatActionG["number_typeZ"];
  // /**determina la forma de redondeo */
  // number_round: IDiccPrimitiveFormatActionG["number_round"];
  // /** convierte el string en número (al menos lo intenta)*/
  // number_stringToNumber: IDiccPrimitiveFormatActionG["number_stringToNumber"];
  // //================================================
  // //formateo para campo string
  // /**
  //  * determina el agregar un texto de prefijo y/o
  //  *  sufijo al valor del campo
  //  */
  // string_setFix: IDiccPrimitiveFormatActionG["string_setFix"];
  // /** Determina si se debe realizar alguna capitalizacion
  //  * en el texto, pasar de mayusculas a minusculas o al
  //  * contrario, o colocar la primera letra en Mayuscula
  //  */
  // string_caseType: IDiccPrimitiveFormatActionG["string_caseType"];
  // /** Formateo Especial a partir de expresiones regulares
  //  * construidas desde string
  //  */
  // //     string_f_RemplaceForRegExp?: {
  // //         strRegExp: string;
  // //         strReplace: string;
  // //     }[];
  // //================================================
  // //formateo para campo array
  // /**divide una cadena de texto en un array */
  // array_stringToArray: IDiccPrimitiveFormatActionG["array_stringToArray"];
  // /**aplica un formateo interno a cada elemento del array */
  // array_itemFormat:
  //   | {
  //       //❓PROSIBLES ERRORES DE CONFIGURACION❓
  //       /**formteadores para cada item del array*/
  //       aDiccActionsConfig: TADiccActionConfig<IDiccPrimitiveFormatActionConfigG>;
  //     }
  //   | undefined;
  // /**
  //  * establece una configuracion de validacion
  //  * embebida para cada elementos del array
  //  *
  //  * ⚠ SOLO para arrays de tipos primitivos, NO
  //  * usar con modelos embebidos
  //  */
  // objectFormatter:
  //   | {
  //       //❓PROSIBLES ERRORES DE CONFIGURACION❓
  //       //se aplicará a cada propiedad del objeto por
  //       //lo que deben ser validaciones muy genericas
  //       /**recursivo para los subcampos */
  //       aDiccActionsConfig?: TADiccActionConfig<IDiccPrimitiveFormatActionConfigG>;
  //     }
  //   | undefined;
  //================================================================
  //formateo para campo
  /**
   * intenta aplica trim() a cualquier tipo de valor
   * recibido desde una entrade de html
   *
   * ⚠ aplicarlo en el primer lugar de prioridad del array
   *
   * ````
   * <input type="number" id="domTextElement" >
   *
   * <script>
   *  let inputValue = document.getElementById("domTextElement").value;
   * </script>
   * ````
   * a pesar que sea de `<input type="number"...>` el tipo de valor es:
   * `typeof inputValue == "string"`
   * esto hace que se requiera trim
   *
   */
  anyTrim: boolean;
}
/**claves identificadoras del diccionario de
 * acciones de configuracion */
export type TKeysDiccPrimitiveMutateActionConfig =
  keyof IDiccPrimitiveMutateActionConfig;
/**tipado refactorizado de la clase */
export type Trf_PrimitiveLogicMutater = PrimitiveLogicMutater;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** */
export class PrimitiveLogicMutater<
    TIDiccAC extends IDiccPrimitiveMutateActionConfig = IDiccPrimitiveMutateActionConfig
  >
  extends LogicMutater<TIDiccAC>
  implements
    Record<TKeysDiccPrimitiveMutateActionConfig, TPrimitiveActionConfigFn<any>>
{
  /** configuracion de valores predefinidos para el modulo*/
  public static override readonly getDefault = () => {
    const superDf = LogicMutater.getDefault();
    return {
      ...superDf,
      diccActionConfig: {
        ...(superDf.diccActionConfig as any),
        anyTrim: false,
      } as IDiccPrimitiveMutateActionConfig,
      topPriorityKeysAction: [
        ...superDf.topPriorityKeysAction,
        "anyTrim",
      ] as Array<TKeysDiccPrimitiveMutateActionConfig>,
      topMandatoryKeysAction: [
        ...superDf.topMandatoryKeysAction,
      ] as Array<TKeysDiccPrimitiveMutateActionConfig>,
    };
  };
  public override get metadataHandler(): Trf_PrimitiveLogicMetadataHandler {
    return super.metadataHandler as any;
  }
  public override set metadataHandler(mH: Trf_PrimitiveLogicMetadataHandler) {
    super.metadataHandler = mH;
  }
  public override get keyModuleContext(): TKeyPrimitiveMutateModuleContext {
    return "primitiveMutate";
  }
  /** */
  constructor(baseConfig?: TPrimitiveMutateBaseConfig) {
    super("primitive", baseConfig);
    baseConfig = this.util.isObject(baseConfig) ? baseConfig : ({} as any);
  }
  protected override getDefault() {
    return PrimitiveLogicMutater.getDefault();
  }
  /** */
  protected static buildInstanceForMetadata<
    TPrimitiveMutateInstance extends PrimitiveLogicMutater = PrimitiveLogicMutater
  >(preInstance: TPrimitiveMutateInstance): TPrimitiveMutateInstance {
    const util = Util_Module.getInstance();
    let inst: TPrimitiveMutateInstance;
    if (util.isInstance(preInstance)) {
      inst = preInstance;
    } else {
      const { primitiveModuleFactory } =
        Module._globalConfig_.diccModuleFactory;
      inst = primitiveModuleFactory.makeModuleInstance(
        "primitiveMutate",
        preInstance as any
      ) as any;
    }
    return inst;
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
  //================================================================================================================================
  public async anyTrim(
    criteriaHandler: PrimitiveCriteriaHandler<any>
  ): Promise<IPrimitiveResponse> {
    //Desempaquetar la accion e inicializar
    const { data } = criteriaHandler;
    const [keyAction, actionConfig] =
      this.getTupleActionConfigFromCriteriaHandler(criteriaHandler, "anyTrim");
    const rH = this.buildReportHandler(criteriaHandler, keyAction);
    let res = rH.mutateResponse(undefined, { data });
    const {} = actionConfig;

    // //Desempaquetar la accion e inicializar
    // const keyAction: TLibKeyAction = "any_trim";
    // const actionConfig = diccActionConfig[keyAction];
    // // const {  } = this.getPrimitiveOrEmbPrimitiveConfig(keyPrimitive, embAbsolutePath);
    // const pVL = new PrimitiveFormatLib();
    // const pRes = await pVL.any_trim(data, { any_trim: actionConfig }, criteriaHandler);
    // let res = this.mutateResponseForAction(undefined, {
    //   data: pRes.data,
    //   keyAction,
    //   key: keyPrimitiveOrKeyEmbPrimitive,
    //   status: pRes.status,
    // });
    return res;
  }
  // public async booleanIsFormat(
  //   criteriaHandler: Trf_IPrimitiveMiddlewareBag,
  //   middlewareStatus?: IMiddlewareReportStatus
  // ): Promise<IPrimitiveResponseForMiddleware> {
  //   // //Desempaquetar la accion e inicializar
  //   // const keyAction: TLibKeyAction = "boolean_isFormat";
  //   // const actionConfig = diccActionConfig[keyAction];
  //   // // const {  } = this.getPrimitiveOrEmbPrimitiveConfig(keyPrimitive, embAbsolutePath);
  //   // const pVL = new PrimitiveFormatLib();
  //   // const pRes = await pVL.boolean_isFormat(
  //   //   data,
  //   //   { boolean_isFormat: actionConfig },
  //   //   criteriaHandler
  //   // );
  //   // let res = this.mutateResponseForAction(undefined, {
  //   //   data: pRes.data,
  //   //   keyAction,
  //   //   key: keyPrimitiveOrKeyEmbPrimitive,
  //   //   status: pRes.status,
  //   // });
  //   // return res;
  // }
  // public async numberIsBoolean(
  //   criteriaHandler: Trf_IPrimitiveMiddlewareBag,
  //   middlewareStatus?: IMiddlewareReportStatus
  // ): Promise<IPrimitiveResponseForMiddleware> {
  //   // //Desempaquetar la accion e inicializar
  //   // const keyAction: TLibKeyAction = "number_isBoolean";
  //   // const actionConfig = diccActionConfig[keyAction];
  //   // // const {  } = this.getPrimitiveOrEmbPrimitiveConfig(keyPrimitive, embAbsolutePath);
  //   // const pVL = new PrimitiveFormatLib();
  //   // const pRes = await pVL.number_isBoolean(
  //   //   data,
  //   //   { number_isBoolean: actionConfig },
  //   //   criteriaHandler
  //   // );
  //   // let res = this.mutateResponseForAction(undefined, {
  //   //   data: pRes.data,
  //   //   keyAction,
  //   //   key: keyPrimitiveOrKeyEmbPrimitive,
  //   //   status: pRes.status,
  //   // });
  //   // return res;
  // }
  // public async numberTypeZ(
  //   criteriaHandler: Trf_IPrimitiveMiddlewareBag,
  //   middlewareStatus?: IMiddlewareReportStatus
  // ): Promise<IPrimitiveResponseForMiddleware> {
  //   // //Desempaquetar la accion e inicializar
  //   // const keyAction: TLibKeyAction = "number_typeZ";
  //   // const actionConfig = diccActionConfig[keyAction];
  //   // // const {  } = this.getPrimitiveMetaByKey(keyModel, keyPrimitive);
  //   // const pVL = new PrimitiveFormatLib();
  //   // const pRes = await pVL.number_typeZ(
  //   //   data,
  //   //   { number_typeZ: actionConfig },
  //   //   criteriaHandler
  //   // );
  //   // let res = this.mutateResponseForAction(undefined, {
  //   //   data: pRes.data,
  //   //   keyAction,
  //   //   key: keyPrimitiveOrKeyEmbPrimitive,
  //   //   status: pRes.status,
  //   // });
  //   // return res;
  // }
  // public async numberRound(
  //   criteriaHandler: Trf_IPrimitiveMiddlewareBag,
  //   middlewareStatus?: IMiddlewareReportStatus
  // ): Promise<IPrimitiveResponseForMiddleware> {
  //   // //Desempaquetar la accion e inicializar
  //   // const keyAction: TLibKeyAction = "number_round";
  //   // const actionConfig = diccActionConfig[keyAction];
  //   // // const {  } = this.getPrimitiveOrEmbPrimitiveConfig(keyPrimitive, embAbsolutePath);
  //   // const pVL = new PrimitiveFormatLib();
  //   // const pRes = await pVL.number_round(
  //   //   data,
  //   //   { number_round: actionConfig },
  //   //   criteriaHandler
  //   // );
  //   // let res = this.mutateResponseForAction(undefined, {
  //   //   data: pRes.data,
  //   //   keyAction,
  //   //   key: keyPrimitiveOrKeyEmbPrimitive,
  //   //   status: pRes.status,
  //   // });
  //   // return res;
  // }
  // public async numberStringToNumber(
  //   criteriaHandler: Trf_IPrimitiveMiddlewareBag,
  //   middlewareStatus?: IMiddlewareReportStatus
  // ): Promise<IPrimitiveResponseForMiddleware> {
  //   // //Desempaquetar la accion e inicializar
  //   // const keyAction: TLibKeyAction = "number_stringToNumber";
  //   // const actionConfig = diccActionConfig[keyAction];
  //   // // const {  } = this.getPrimitiveOrEmbPrimitiveConfig(keyPrimitive, embAbsolutePath);
  //   // const pVL = new PrimitiveFormatLib();
  //   // const pRes = await pVL.number_stringToNumber(
  //   //   data,
  //   //   { number_stringToNumber: actionConfig },
  //   //   criteriaHandler
  //   // );
  //   // let res = this.mutateResponseForAction(undefined, {
  //   //   data: pRes.data,
  //   //   keyAction,
  //   //   key: keyPrimitiveOrKeyEmbPrimitive,
  //   //   status: pRes.status,
  //   // });
  //   // return res;
  // }
  // public async stringSetFix(
  //   criteriaHandler: Trf_IPrimitiveMiddlewareBag,
  //   middlewareStatus?: IMiddlewareReportStatus
  // ): Promise<IPrimitiveResponseForMiddleware> {
  //   // //Desempaquetar la accion e inicializar
  //   // const keyAction: TLibKeyAction = "string_setFix";
  //   // const actionConfig = diccActionConfig[keyAction];
  //   // // const {  } = this.getPrimitiveOrEmbPrimitiveConfig(keyPrimitive, embAbsolutePath);
  //   // const pVL = new PrimitiveFormatLib();
  //   // const pRes = await pVL.string_setFix(
  //   //   data,
  //   //   { string_setFix: actionConfig },
  //   //   criteriaHandler
  //   // );
  //   // let res = this.mutateResponseForAction(undefined, {
  //   //   data: pRes.data,
  //   //   keyAction,
  //   //   key: keyPrimitiveOrKeyEmbPrimitive,
  //   //   status: pRes.status,
  //   // });
  //   // return res;
  // }
  // public async stringCaseType(
  //   criteriaHandler: Trf_IPrimitiveMiddlewareBag,
  //   middlewareStatus?: IMiddlewareReportStatus
  // ): Promise<IPrimitiveResponseForMiddleware> {
  //   // //Desempaquetar la accion e inicializar
  //   // const keyAction: TLibKeyAction = "string_caseType";
  //   // const actionConfig = diccActionConfig[keyAction];
  //   // // const {  } = this.getPrimitiveOrEmbPrimitiveConfig(keyPrimitive, embAbsolutePath);
  //   // const pVL = new PrimitiveFormatLib();
  //   // const pRes = await pVL.string_caseType(
  //   //   data,
  //   //   { string_caseType: actionConfig },
  //   //   criteriaHandler
  //   // );
  //   // let res = this.mutateResponseForAction(undefined, {
  //   //   data: pRes.data,
  //   //   key: keyPrimitiveOrKeyEmbPrimitive,
  //   //   keyAction,
  //   //   status: pRes.status,
  //   // });
  //   // return res;
  // }
  // public async arrayStringToArray(
  //   criteriaHandler: Trf_IPrimitiveMiddlewareBag,
  //   middlewareStatus?: IMiddlewareReportStatus
  // ): Promise<IPrimitiveResponseForMiddleware> {
  //   // //Desempaquetar la accion e inicializar
  //   // const keyAction: TLibKeyAction = "array_stringToArray";
  //   // const actionConfig = diccActionConfig[keyAction];
  //   // // const {  } = this.getPrimitiveOrEmbPrimitiveConfig(keyPrimitive, embAbsolutePath);
  //   // const { charSeparator } = actionConfig;
  //   // const pVL = new PrimitiveFormatLib();
  //   // const pRes = await pVL.array_stringToArray(
  //   //   data,
  //   //   { array_stringToArray: actionConfig },
  //   //   criteriaHandler
  //   // );
  //   // let res = this.mutateResponseForAction(undefined, {
  //   //   data: pRes.data,
  //   //   keyAction,
  //   //   key: keyPrimitiveOrKeyEmbPrimitive,
  //   //   status: pRes.status,
  //   // });
  //   // return res;
  // }
  public async arrayItemFormat(
    criteriaHandler: PrimitiveCriteriaHandler<any>
  ): Promise<IPrimitiveResponse> {
    return res;
    // //Desempaquetar la accion e inicializar
    // const keyAction: TLibKeyAction = "array_itemFormat";
    // const actionConfig = diccActionConfig[keyAction];
    // // const {  } = this.getPrimitiveOrEmbPrimitiveConfig(keyPrimitive, embAbsolutePath);
    // const { aDiccActionsConfig } = actionConfig;
    // let res = this.mutateResponseForAction(undefined, {
    //   data,
    //   keyAction,
    //   key: keyPrimitiveOrKeyEmbPrimitive,
    // });
    // const { isValArray } = ValLib.getDiccValHelper(false);
    // if (!isValArray(data)) {
    //   res = this.mutateResponseForAction(res, {
    //     data,
    //     status: ELogicResStatusCode.WARNING,
    //   });
    //   return res;
    // }
    // //valida si ahi la suficiente configuracion para este tipo de formateo
    // if (this.util.isNotArray(aDiccActionsConfig)) {
    //   res = this.mutateResponseForAction(res, {
    //     data: data,
    //     status: ELogicResStatusCode.WARNING,
    //   });
    //   return res;
    // }
    // const promisesResponses = (<any[]>data).map(async (subData, idx) => {
    //   let subRes = this.mutateResponseForAction(undefined, {
    //     data: subData,
    //     keyAction,
    //     status: ELogicResStatusCode.SUCCESS,
    //   });
    //   //se define un array de diccionarios fachada (o virtual):
    //   let sub_aDiccAC: TADiccActionConfig<IDiccPrimitiveFormatActionConfigG>;
    //   if (this.util.isNotObject(subData)) {
    //     //valida si ahi la suficiente configuracion para este tipo de validacion
    //     sub_aDiccAC = aDiccActionsConfig;
    //     if (this.util.isNotArray(sub_aDiccAC)) {
    //       subRes = this.mutateResponseForAction(subRes, {
    //         data: subData,
    //         status: ELogicResStatusCode.ERROR,
    //       });
    //       return subRes;
    //     }
    //     subRes.embeddedResponses = await this.runPrimitiveActionSequence(
    //       fieldHandlerContext,
    //       subData,
    //       sub_aDiccAC,
    //       criteriaHandler,
    //       keyPrimitiveOrKeyEmbPrimitive,
    //       `${idx}`
    //     );
    //   } else {
    //     //apoyarse de la validacion de objeto
    //     subRes = await this.objectFormatter(
    //       fieldHandlerContext,
    //       subData,
    //       { objectFormatter: { aDiccActionsConfig: sub_aDiccAC } }, //se envia la configuracion del aDicc del array como si fuera la del objeto
    //       criteriaHandler,
    //       keyPrimitiveOrKeyEmbPrimitive
    //     );
    //   }
    //   subRes = this.mutateResponseForAction(subRes, { data: subData });
    //   //garantizar integridad de dato;
    //   data[idx] = subRes.data;
    //   return subRes;
    // });
    // res.embeddedResponses = await Promise.all(promisesResponses);
    // res = this.mutateResponseForAction(res, { data }); //se analizará internamente los reportes embebidos
    // return res;
  }
  public async objectFormatter(
    criteriaHandler: PrimitiveCriteriaHandler<any>
  ): Promise<IPrimitiveResponse> {
    return res;
    // //Desempaquetar la accion e inicializar
    // const keyAction: TLibKeyAction = "objectFormatter";
    // const actionConfig = diccActionConfig[keyAction];
    // const { key, embMeta } = this.getPrimitiveOrEmbPrimitiveConfig(
    //   keyPrimitiveOrKeyEmbPrimitive,
    //   embAbsolutePath
    // );
    // const { aDiccActionsConfig } = actionConfig;
    // let res = this.mutateResponseForAction(undefined, {
    //   data,
    //   keyAction,
    //   key: keyPrimitiveOrKeyEmbPrimitive,
    //   status: ELogicResStatusCode.SUCCESS,
    // });
    // const { isValObject } = ValLib.getDiccValHelper(false);
    // if (!isValObject(data)) {
    //   res = this.mutateResponseForAction(res, {
    //     data,
    //     status: ELogicResStatusCode.WARNING,
    //   });
    //   return res;
    // }
    // //valida si ahi la suficiente configuracion para este tipo de formateo
    // if (this.util.isNotArray(aDiccActionsConfig)) {
    //   res = this.mutateResponseForAction(res, {
    //     data: data,
    //     status: ELogicResStatusCode.WARNING,
    //   });
    //   return res;
    // }
    // let promisesResponses: Promise<IFormatResponseForAction>[] = [];
    // //verificar el tipo de objeto (anonimo o embebido)
    // if (
    //   this.util.isObject(embMeta) ||
    //   this.util.isNotUndefinedAndNotNull(embMeta.__embAbsolutePath)
    // ) {
    //   const sub_embAbsolutePath = embMeta.__embAbsolutePath;
    //   const embAllPrimitiveConfig =
    //     this.handler.getEmbAllPrimitiveConfig(sub_embAbsolutePath);
    //   promisesResponses = Object.keys(embAllPrimitiveConfig).map(
    //     async (keySubPrimitive) => {
    //       const subData = data[keySubPrimitive];
    //       const embPrimitiveConfig = embAllPrimitiveConfig[keySubPrimitive];
    //       let embPrimitiveContextConfig: Trf_IPrimitivePrimitiveFormatConfig;
    //       if (fieldHandlerContext == "inPrimitive") {
    //         embPrimitiveContextConfig = <any>embPrimitiveConfig.formatConfig.inPrimitive;
    //       }
    //       if (fieldHandlerContext == "outPrimitive") {
    //         embPrimitiveContextConfig = <any>embPrimitiveConfig.formatConfig.outPrimitive;
    //       }
    //       let subRes = this.mutateResponseForAction(undefined, {
    //         data: subData,
    //         keyAction,
    //         status: ELogicResStatusCode.SUCCESS,
    //       });
    //       let sub_aDiccAC = embPrimitiveContextConfig.aDiccActionsConfig;
    //       if (this.util.isNotArray(sub_aDiccAC)) {
    //         subRes = this.mutateResponseForAction(subRes, {
    //           data: subData,
    //           status: ELogicResStatusCode.ERROR,
    //         });
    //         return subRes;
    //       }
    //       subRes.embeddedResponses = await this.runPrimitiveActionSequence(
    //         fieldHandlerContext,
    //         subData,
    //         sub_aDiccAC,
    //         criteriaHandler,
    //         keyPrimitiveOrKeyEmbPrimitive,
    //         embAbsolutePath,
    //         keySubPrimitive
    //       );
    //       //garantizar integridad de dato;
    //       data[keySubPrimitive] = subRes.data;
    //       subRes = this.mutateResponseForAction(subRes, { data: subData });
    //       return subRes;
    //     }
    //   );
    // } else {
    //   promisesResponses = Object.keys(data).map(async (keySubPrimitive) => {
    //     const subData = data[keySubPrimitive];
    //     let subRes = this.mutateResponseForAction(undefined, {
    //       data,
    //       keyAction,
    //       status: ELogicResStatusCode.SUCCESS,
    //     });
    //     let sub_aDiccAC = aDiccActionsConfig;
    //     subRes.embeddedResponses = await this.runPrimitiveActionSequence(
    //       fieldHandlerContext,
    //       subData,
    //       sub_aDiccAC,
    //       criteriaHandler,
    //       keyPrimitiveOrKeyEmbPrimitive,
    //       embAbsolutePath,
    //       keySubPrimitive
    //     );
    //     //garantizar integridad de dato;
    //     data[keySubPrimitive] = subRes.data;
    //     subRes = this.mutateResponseForAction(subRes, { data: subData });
    //     return subRes;
    //   });
    // }
    // res.embeddedResponses = await Promise.all(promisesResponses);
    // //se asume que a este punto es valido mientras
    // //no se sepa el estado de los embebidos
    // res = this.mutateResponseForAction(res, { data });
    // return res;
  }
}
