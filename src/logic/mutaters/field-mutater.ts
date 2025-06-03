import {
  TStructureActionConfigFn,
  TTGlobalActionConfig,
} from "../criterias/shared-types";
import { StructureCriteriaHandler } from "../criterias/structure-criteria-handler";
import { ELogicCodeError, LogicError } from "../errors/logic-error";
import { TwinBeeModule } from "../modules/module";
import {
  EKeyActionGroupForRes,
  ELogicResStatusCode,
  IStructureResponse,
} from "../reports/shared-types";
import { StructureLogicMutater } from "./_structure-mutater";
import {
  TFieldMutateBaseConfig,
  TStructureFieldMutateDiccACForCriteria,
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
export interface IDiccFieldMutateActionConfig {
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
  /** */
  mutateAnonymousObject: {
    /**esquema recursivo para asignar acciones de configuración a
     * cada subcampo, las acciones de configuración
     * son asignadas a traves de una array de tuplas
     *
     * ⚠ Por complejidad aun no es posible tener acceso a
     * diccionarios de acciones de configuración personalizados ⚠
     */
    schemaForATActionConfig: Record<
      any,
      Array<
        TTGlobalActionConfig<
          TStructureFieldMutateDiccACForCriteria<IDiccFieldMutateActionConfig>
        >
      >
    >;
  };
  /** */
  mutateAnonymousArray: {
    /**array de diccionarios de acciones para cada elemento del array del dato*/
    aTGlobalActionConfig: Array<
      TTGlobalActionConfig<
        TStructureFieldMutateDiccACForCriteria<IDiccFieldMutateActionConfig>
      >
    >;
  };
}
/**claves identificadoras del diccionario de
 * acciones de configuracion */
export type TKeysDiccFieldMutateActionConfig =
  keyof IDiccFieldMutateActionConfig;
/**tipado refactorizado de la clase */
export type Trf_FieldLogicMutater = FieldLogicMutater;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** */
export class FieldLogicMutater<
    TIDiccAC extends IDiccFieldMutateActionConfig = IDiccFieldMutateActionConfig
  >
  extends StructureLogicMutater<TIDiccAC>
  implements
    Record<TKeysDiccFieldMutateActionConfig, TStructureActionConfigFn<any>>
{
  /** configuración de valores predefinidos para el modulo*/
  public static override readonly getDefault = () => {
    const superDf = StructureLogicMutater.getDefault();
    return {
      ...superDf,
      diccActionConfig: {
        ...(superDf.diccActionConfig as any),
        anyTrim: false,
        mutateAnonymousObject: {
          schemaForATActionConfig: undefined,
        },
        mutateAnonymousArray: {
          aTGlobalActionConfig: [],
        },
      } as IDiccFieldMutateActionConfig,
      topPriorityKeysAction: [
        ...superDf.topPriorityKeysAction,
        "anyTrim",
      ] as Array<TKeysDiccFieldMutateActionConfig>,
      topMandatoryKeysAction: [
        ...superDf.topMandatoryKeysAction,
      ] as Array<TKeysDiccFieldMutateActionConfig>,
    };
  };
  /** */
  constructor(baseConfig?: TFieldMutateBaseConfig) {
    super("fieldMutate", baseConfig);
    baseConfig = this.util.isObject(baseConfig) ? baseConfig : ({} as any);
  }
  protected override getDefault() {
    return FieldLogicMutater.getDefault();
  }
  /**... */
  protected static buildInstanceForMetadata<
    TFieldMutateInstance extends FieldLogicMutater = FieldLogicMutater
  >(preInstance: TFieldMutateInstance): TFieldMutateInstance {
    const util = TwinBeeModule.util;
    let inst: TFieldMutateInstance;
    if (util.isInstance(preInstance)) {
      inst = preInstance;
    } else {
      const { structureModuleFactory } =
        TwinBeeModule._globalConfig_.diccModuleFactory;
      inst = structureModuleFactory.makeModuleInstance(
        "fieldMutate",
        preInstance as any
      ) as any;
    }
    return inst;
  }
  //================================================================================================================================
  public async anyTrim(
    criteriaHandler: StructureCriteriaHandler<any>
  ): Promise<IStructureResponse> {
    //Desempaquetar la accion e inicializar
    const { data } = criteriaHandler;
    const [keyAction, actionConfig] =
      this.getTupleActionConfigFromCriteriaHandler(criteriaHandler, "anyTrim");
    const rH = this.buildReportHandler(criteriaHandler, keyAction);
    let res = rH.mutateResponse(undefined, { data });
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
    let newData = (data as string).trim();
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
  public async mutateAnonymousObject(
    criteriaHandler: StructureCriteriaHandler<any>
  ): Promise<IStructureResponse> {
    const { data, keyPath } = criteriaHandler;
    const [keyAction, actionConfig] =
      this.getTupleActionConfigFromCriteriaHandler(
        criteriaHandler,
        "mutateAnonymousObject"
      );
    const rH = this.buildReportHandler(criteriaHandler, keyAction);
    let res = rH.mutateResponse(undefined, { data });
    let { schemaForATActionConfig } = actionConfig;
    const mH = this.metadataHandler;
    //bandera de tipo por seguridad
    const isObject = this.util.isObject(data);
    //determinar si hay esquema de propiedades para mutar
    if (!this.util.isObject(schemaForATActionConfig)) {
      //al no haber esquema, solo se puede verificar el tipo general
      if (isObject) {
        res = rH.mutateResponse(res, {
          status: ELogicResStatusCode.SUCCESS,
        });
      } else {
        throw new LogicError({
          code: ELogicCodeError.MODULE_ERROR,
          msn: `${schemaForATActionConfig} is not schema for action config valid`,
        });
      }
      return res;
    }
    //si hay esquema de propiedades a mutar, data debe ser objeto
    if (!isObject) {
      res = rH.mutateResponse(res, {
        status: ELogicResStatusCode.WARNING,
      });
      return res;
    }
    const keysPropSchema = Object.keys(schemaForATActionConfig);
    //muta propiedades de esquema (las adicionales no se validan)
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
  public async mutateAnonymousArray(
    criteriaHandler: StructureCriteriaHandler<any>
  ): Promise<IStructureResponse> {
    // //Desempaquetar la accion e inicializar
    const { data, keyPath } = criteriaHandler;
    const [keyAction, actionConfig] =
      this.getTupleActionConfigFromCriteriaHandler(
        criteriaHandler,
        "mutateAnonymousArray"
      );
    const rH = this.buildReportHandler(criteriaHandler, keyAction);
    let res = rH.mutateResponse(undefined, { data });
    let { aTGlobalActionConfig } = actionConfig;
    const mH = this.metadataHandler;
    //bandera de tipo por seguridad
    const isArray = this.util.isArray(data);
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
