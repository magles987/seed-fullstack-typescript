import { StructureLogicMutater } from "./_structure-mutater";
import { TFieldConfigForMutate } from "./shared";
import {
  IStructureBagForActionModuleContext,
  TStructureFnBagForActionModule,
} from "../bag-module/shared-for-external-module";
import { ELogicResStatusCode, IStructureResponse } from "../reports/shared";
import { TStructureFieldMetaAndMutater } from "../meta/metadata-shared";
import { StructureBag } from "../bag-module/structure-bag";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** define las propiedades de cada formateo
 * que puede configurar y ejecutar un campo
 *
 * ⚠ todas las propiedades raiz hacen referencia
 * a un formato, ya que un campo puede tener
 * asignados varias de estos formatos, estas
 * propiedades deben ser **opcionales**
 */
export interface IDiccFieldMutateActionConfigG {
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
  //  * valueField = undefined;
  //  * valueField = null;
  //  * valueField = 0; //o negativo
  //  * valueField = "";
  //  * valueField = []; //vacio
  //  * valueField = {}; //sin propiedades
  //  * //se formatea a:
  //  * valueField = false;
  //  *
  //  * //=========================
  //  * //Caso true
  //  *
  //  * //antes de formatear:
  //  * valueField = 1; //cualquier positivo
  //  * valueField = "any";
  //  * valueField = [anyItems]; //NO vacio
  //  * valueField = {anyItems:any}; //con propiedades
  //  * valueField = ()=>{}; //cualquier tipo Function
  //  * //se formatea a:
  //  * valueField = true;
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
  //       aDiccActionsConfig: TADiccActionConfig<IDiccFieldFormatActionConfigG>;
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
  //       aDiccActionsConfig?: TADiccActionConfig<IDiccFieldFormatActionConfigG>;
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
export type TKeysDiccFieldMutateActionConfigG =
  keyof IDiccFieldMutateActionConfigG;
/**tipado refactorizado de la clase */
export type Trf_FieldLogicMutater = FieldLogicMutater;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** */
export class FieldLogicMutater<
    TIDiccAC extends IDiccFieldMutateActionConfigG = IDiccFieldMutateActionConfigG
  >
  extends StructureLogicMutater<TIDiccAC>
  implements
    Record<TKeysDiccFieldMutateActionConfigG, TStructureFnBagForActionModule>
{
  /** configuracion de valores predefinidos para el modulo*/
  public static override readonly getDefault = () => {
    const superDf = StructureLogicMutater.getDefault();
    return {
      ...superDf,
      dfDiccActionConfig: {
        ...(superDf.dfDiccActionConfig as any),
        anyTrim: false,
      } as IDiccFieldMutateActionConfigG,
      topPriorityKeysAction: [
        ...superDf.topPriorityKeysAction,
        "anyTrim",
      ] as Array<TKeysDiccFieldMutateActionConfigG>,
      topMandatoryKeysAction: [
        ...superDf.topMandatoryKeysAction,
      ] as Array<TKeysDiccFieldMutateActionConfigG>,
    };
  };
  /**
   * @param keySrc indentificadora del recurso asociado a modulo
   */
  constructor(keySrc: string) {
    super("fieldMutate", keySrc);
  }
  protected override getDefault() {
    return FieldLogicMutater.getDefault();
  }
  protected override getMetadataWithContextModule(
    keyPath?: string
  ): TStructureFieldMetaAndMutater<TIDiccAC> {
    return super.getMetadataWithContextModule(keyPath) as any;
  }
  protected override getMetadataOnlyModuleConfig(
    keyPath?: string
    //❕Retorno <TIDiccAC, TIDiccAC> para simplificar el tipado sin sobreescribir el metodo en las hijas❕
  ): TFieldConfigForMutate<TIDiccAC> {
    return super.getMetadataOnlyModuleConfig(keyPath);
  }
  protected override adapBagForContext<TKey extends keyof TIDiccAC>(
    bag: StructureBag<any>,
    keyAction: TKey
  ): IStructureBagForActionModuleContext<TIDiccAC, TKey> {
    const r = super.adapBagForContext(bag, keyAction);
    return r;
  }
  //================================================================================================================================
  public async anyTrim(bag: StructureBag<any>): Promise<IStructureResponse> {
    //Desempaquetar la accion e inicializar
    const {
      data,
      keyAction,
      keyPath,
      actionConfig,
      responses,
      middlewareReportStatus,
    } = this.adapBagForContext(bag, "anyTrim");
    const rH = this.reportHandler;
    let res = rH.mutateResponse(undefined, {
      data,
      keyAction,
      keyPath,
    });
    //const {} = actionConfig;
    if (
      !actionConfig ||
      (!this.util.isString(data) && !this.util.isNumber(data, true))
    ) {
      res = rH.mutateResponse(res, {
        status: ELogicResStatusCode.WARNING,
        msn: `${keyAction} is not applicable to ${data}`,
      });
    }
    ////❗❗❗MUTACION❗❗❗
    let newData = (data as string).trim();
    this.mutateDataIntoBag(newData, bag, res);
    res = rH.mutateResponse(res, {
      data: newData,
    });
    return res;
  }
  // public async booleanIsFormat(
  //   bag: Trf_IStructureMiddlewareBag,
  //   middlewareStatus?: IMiddlewareReportStatus
  // ): Promise<IStructureResponseForMiddleware> {
  //   // //Desempaquetar la accion e inicializar
  //   // const keyAction: TLibKeyAction = "boolean_isFormat";
  //   // const actionConfig = diccActionConfig[keyAction];
  //   // // const {  } = this.getFieldOrEmbFieldConfig(keyField, embAbsolutePath);
  //   // const pVL = new PrimitiveFormatLib();
  //   // const pRes = await pVL.boolean_isFormat(
  //   //   data,
  //   //   { boolean_isFormat: actionConfig },
  //   //   bag
  //   // );
  //   // let res = this.mutateResponseForAction(undefined, {
  //   //   data: pRes.data,
  //   //   keyAction,
  //   //   key: keyFieldOrKeyEmbField,
  //   //   status: pRes.status,
  //   // });
  //   // return res;
  // }
  // public async numberIsBoolean(
  //   bag: Trf_IStructureMiddlewareBag,
  //   middlewareStatus?: IMiddlewareReportStatus
  // ): Promise<IStructureResponseForMiddleware> {
  //   // //Desempaquetar la accion e inicializar
  //   // const keyAction: TLibKeyAction = "number_isBoolean";
  //   // const actionConfig = diccActionConfig[keyAction];
  //   // // const {  } = this.getFieldOrEmbFieldConfig(keyField, embAbsolutePath);
  //   // const pVL = new PrimitiveFormatLib();
  //   // const pRes = await pVL.number_isBoolean(
  //   //   data,
  //   //   { number_isBoolean: actionConfig },
  //   //   bag
  //   // );
  //   // let res = this.mutateResponseForAction(undefined, {
  //   //   data: pRes.data,
  //   //   keyAction,
  //   //   key: keyFieldOrKeyEmbField,
  //   //   status: pRes.status,
  //   // });
  //   // return res;
  // }
  // public async numberTypeZ(
  //   bag: Trf_IStructureMiddlewareBag,
  //   middlewareStatus?: IMiddlewareReportStatus
  // ): Promise<IStructureResponseForMiddleware> {
  //   // //Desempaquetar la accion e inicializar
  //   // const keyAction: TLibKeyAction = "number_typeZ";
  //   // const actionConfig = diccActionConfig[keyAction];
  //   // // const {  } = this.getFieldMetaByKey(keyModel, keyField);
  //   // const pVL = new PrimitiveFormatLib();
  //   // const pRes = await pVL.number_typeZ(
  //   //   data,
  //   //   { number_typeZ: actionConfig },
  //   //   bag
  //   // );
  //   // let res = this.mutateResponseForAction(undefined, {
  //   //   data: pRes.data,
  //   //   keyAction,
  //   //   key: keyFieldOrKeyEmbField,
  //   //   status: pRes.status,
  //   // });
  //   // return res;
  // }
  // public async numberRound(
  //   bag: Trf_IStructureMiddlewareBag,
  //   middlewareStatus?: IMiddlewareReportStatus
  // ): Promise<IStructureResponseForMiddleware> {
  //   // //Desempaquetar la accion e inicializar
  //   // const keyAction: TLibKeyAction = "number_round";
  //   // const actionConfig = diccActionConfig[keyAction];
  //   // // const {  } = this.getFieldOrEmbFieldConfig(keyField, embAbsolutePath);
  //   // const pVL = new PrimitiveFormatLib();
  //   // const pRes = await pVL.number_round(
  //   //   data,
  //   //   { number_round: actionConfig },
  //   //   bag
  //   // );
  //   // let res = this.mutateResponseForAction(undefined, {
  //   //   data: pRes.data,
  //   //   keyAction,
  //   //   key: keyFieldOrKeyEmbField,
  //   //   status: pRes.status,
  //   // });
  //   // return res;
  // }
  // public async numberStringToNumber(
  //   bag: Trf_IStructureMiddlewareBag,
  //   middlewareStatus?: IMiddlewareReportStatus
  // ): Promise<IStructureResponseForMiddleware> {
  //   // //Desempaquetar la accion e inicializar
  //   // const keyAction: TLibKeyAction = "number_stringToNumber";
  //   // const actionConfig = diccActionConfig[keyAction];
  //   // // const {  } = this.getFieldOrEmbFieldConfig(keyField, embAbsolutePath);
  //   // const pVL = new PrimitiveFormatLib();
  //   // const pRes = await pVL.number_stringToNumber(
  //   //   data,
  //   //   { number_stringToNumber: actionConfig },
  //   //   bag
  //   // );
  //   // let res = this.mutateResponseForAction(undefined, {
  //   //   data: pRes.data,
  //   //   keyAction,
  //   //   key: keyFieldOrKeyEmbField,
  //   //   status: pRes.status,
  //   // });
  //   // return res;
  // }
  // public async stringSetFix(
  //   bag: Trf_IStructureMiddlewareBag,
  //   middlewareStatus?: IMiddlewareReportStatus
  // ): Promise<IStructureResponseForMiddleware> {
  //   // //Desempaquetar la accion e inicializar
  //   // const keyAction: TLibKeyAction = "string_setFix";
  //   // const actionConfig = diccActionConfig[keyAction];
  //   // // const {  } = this.getFieldOrEmbFieldConfig(keyField, embAbsolutePath);
  //   // const pVL = new PrimitiveFormatLib();
  //   // const pRes = await pVL.string_setFix(
  //   //   data,
  //   //   { string_setFix: actionConfig },
  //   //   bag
  //   // );
  //   // let res = this.mutateResponseForAction(undefined, {
  //   //   data: pRes.data,
  //   //   keyAction,
  //   //   key: keyFieldOrKeyEmbField,
  //   //   status: pRes.status,
  //   // });
  //   // return res;
  // }
  // public async stringCaseType(
  //   bag: Trf_IStructureMiddlewareBag,
  //   middlewareStatus?: IMiddlewareReportStatus
  // ): Promise<IStructureResponseForMiddleware> {
  //   // //Desempaquetar la accion e inicializar
  //   // const keyAction: TLibKeyAction = "string_caseType";
  //   // const actionConfig = diccActionConfig[keyAction];
  //   // // const {  } = this.getFieldOrEmbFieldConfig(keyField, embAbsolutePath);
  //   // const pVL = new PrimitiveFormatLib();
  //   // const pRes = await pVL.string_caseType(
  //   //   data,
  //   //   { string_caseType: actionConfig },
  //   //   bag
  //   // );
  //   // let res = this.mutateResponseForAction(undefined, {
  //   //   data: pRes.data,
  //   //   key: keyFieldOrKeyEmbField,
  //   //   keyAction,
  //   //   status: pRes.status,
  //   // });
  //   // return res;
  // }
  // public async arrayStringToArray(
  //   bag: Trf_IStructureMiddlewareBag,
  //   middlewareStatus?: IMiddlewareReportStatus
  // ): Promise<IStructureResponseForMiddleware> {
  //   // //Desempaquetar la accion e inicializar
  //   // const keyAction: TLibKeyAction = "array_stringToArray";
  //   // const actionConfig = diccActionConfig[keyAction];
  //   // // const {  } = this.getFieldOrEmbFieldConfig(keyField, embAbsolutePath);
  //   // const { charSeparator } = actionConfig;
  //   // const pVL = new PrimitiveFormatLib();
  //   // const pRes = await pVL.array_stringToArray(
  //   //   data,
  //   //   { array_stringToArray: actionConfig },
  //   //   bag
  //   // );
  //   // let res = this.mutateResponseForAction(undefined, {
  //   //   data: pRes.data,
  //   //   keyAction,
  //   //   key: keyFieldOrKeyEmbField,
  //   //   status: pRes.status,
  //   // });
  //   // return res;
  // }
  public async arrayItemFormat(
    bag: StructureBag<any>
  ): Promise<IStructureResponse> {
    // //Desempaquetar la accion e inicializar
    // const keyAction: TLibKeyAction = "array_itemFormat";
    // const actionConfig = diccActionConfig[keyAction];
    // // const {  } = this.getFieldOrEmbFieldConfig(keyField, embAbsolutePath);
    // const { aDiccActionsConfig } = actionConfig;
    // let res = this.mutateResponseForAction(undefined, {
    //   data,
    //   keyAction,
    //   key: keyFieldOrKeyEmbField,
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
    //   let sub_aDiccAC: TADiccActionConfig<IDiccFieldFormatActionConfigG>;
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
    //     subRes.embeddedResponses = await this.runFieldActionSequence(
    //       fieldHandlerContext,
    //       subData,
    //       sub_aDiccAC,
    //       bag,
    //       keyFieldOrKeyEmbField,
    //       `${idx}`
    //     );
    //   } else {
    //     //apoyarse de la validacion de objeto
    //     subRes = await this.objectFormatter(
    //       fieldHandlerContext,
    //       subData,
    //       { objectFormatter: { aDiccActionsConfig: sub_aDiccAC } }, //se envia la configuracion del aDicc del array como si fuera la del objeto
    //       bag,
    //       keyFieldOrKeyEmbField
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
    bag: StructureBag<any>
  ): Promise<IStructureResponse> {
    // //Desempaquetar la accion e inicializar
    // const keyAction: TLibKeyAction = "objectFormatter";
    // const actionConfig = diccActionConfig[keyAction];
    // const { key, embMeta } = this.getFieldOrEmbFieldConfig(
    //   keyFieldOrKeyEmbField,
    //   embAbsolutePath
    // );
    // const { aDiccActionsConfig } = actionConfig;
    // let res = this.mutateResponseForAction(undefined, {
    //   data,
    //   keyAction,
    //   key: keyFieldOrKeyEmbField,
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
    //   const embAllFieldConfig =
    //     this.handler.getEmbAllFieldConfig(sub_embAbsolutePath);
    //   promisesResponses = Object.keys(embAllFieldConfig).map(
    //     async (keySubField) => {
    //       const subData = data[keySubField];
    //       const embFieldConfig = embAllFieldConfig[keySubField];
    //       let embFieldContextConfig: Trf_IStructureFieldFormatConfig;
    //       if (fieldHandlerContext == "inField") {
    //         embFieldContextConfig = <any>embFieldConfig.formatConfig.inField;
    //       }
    //       if (fieldHandlerContext == "outField") {
    //         embFieldContextConfig = <any>embFieldConfig.formatConfig.outField;
    //       }
    //       let subRes = this.mutateResponseForAction(undefined, {
    //         data: subData,
    //         keyAction,
    //         status: ELogicResStatusCode.SUCCESS,
    //       });
    //       let sub_aDiccAC = embFieldContextConfig.aDiccActionsConfig;
    //       if (this.util.isNotArray(sub_aDiccAC)) {
    //         subRes = this.mutateResponseForAction(subRes, {
    //           data: subData,
    //           status: ELogicResStatusCode.ERROR,
    //         });
    //         return subRes;
    //       }
    //       subRes.embeddedResponses = await this.runFieldActionSequence(
    //         fieldHandlerContext,
    //         subData,
    //         sub_aDiccAC,
    //         bag,
    //         keyFieldOrKeyEmbField,
    //         embAbsolutePath,
    //         keySubField
    //       );
    //       //garantizar integridad de dato;
    //       data[keySubField] = subRes.data;
    //       subRes = this.mutateResponseForAction(subRes, { data: subData });
    //       return subRes;
    //     }
    //   );
    // } else {
    //   promisesResponses = Object.keys(data).map(async (keySubField) => {
    //     const subData = data[keySubField];
    //     let subRes = this.mutateResponseForAction(undefined, {
    //       data,
    //       keyAction,
    //       status: ELogicResStatusCode.SUCCESS,
    //     });
    //     let sub_aDiccAC = aDiccActionsConfig;
    //     subRes.embeddedResponses = await this.runFieldActionSequence(
    //       fieldHandlerContext,
    //       subData,
    //       sub_aDiccAC,
    //       bag,
    //       keyFieldOrKeyEmbField,
    //       embAbsolutePath,
    //       keySubField
    //     );
    //     //garantizar integridad de dato;
    //     data[keySubField] = subRes.data;
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
