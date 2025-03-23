import { TZodSchemaForClose } from "./_validation";
import { StructureLogicValidation } from "./_structure-validation";
import { TStructureMetaAndValidator } from "../meta/metadata-shared";
import {
  TModelConfigForVal,
  TStructureValModuleConfigForModel,
} from "./shared";
import {
  EKeyActionGroupForRes,
  ELogicResStatusCode,
  IStructureResponse,
} from "../reports/shared";
import { StructureBag } from "../bag/structure-bag";
import {
  FieldLogicValidation,
  IDiccFieldValActionConfigG,
} from "./field-validation";
import { LogicController } from "../controllers/_controller";
import { StructureReportHandler } from "../reports/structure-report-handler";
import { TStructureFnBagForActionModule } from "../bag/shared";
import { StructureCriteriaHandler } from "../criterias/structure-criteria-handler";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**tipo exclusivo para adicionar una configuracion
 * a la accion isRequired */
type TisRequiredConfig = {
  /**
   * predefinido como `false`
   *
   * determina si el valor `null` debe asumirse
   * como ausencia de modelo (`false`) o
   * como un modelo nulo pero valido (`true`)
   *
   */
  isNullAsModel?: boolean;
  /**
   * predefinido como `false`
   *
   * determina si el valor `{}` se asume como modelo
   * vacio pero valido
   */
  isEmptyObjectAsModel?: boolean;
};
/** define todas las propiedades de configuracion
 * de cada accion de validacion para un registro
 * completo del modelo
 */
export interface IDiccModelValActionConfigG<
  TIDiccFieldValAC extends IDiccFieldValActionConfigG = IDiccFieldValActionConfigG
> {
  /**configuracion para validar si es un modelo valido*/
  isTypeOfModel: true; //❗Siempre activa❗
  /**configuracion para validar si el modelo es requerido */
  isRequired: boolean | TisRequiredConfig | undefined;
  /**configuracion para validar campos del modelo*/
  isModel:
    | {
        /**representa un modelo de diccionario
         * de configuracion de acciones de validacion
         * para cada campo
         *
         *
         * ⚠ El tipo debería ser:
         *
         * `Record<keyof Model, TIDiccFieldValAction>`
         *
         * donde `TIADiccFieldValActionsConfig` es el diccionario personalizado
         */
        modelForDiccAC: Partial<Record<any, Partial<TIDiccFieldValAC>>>;
      }
    | undefined;
}
/**claves identificadoras del diccionario de acciones de configuracion */
export type TKeysDiccModelValActionConfigG =
  keyof IDiccModelValActionConfigG<any>;
/**tipado refactorizado de la clase */
export type Trf_ModelLogicValidation = ModelLogicValidation;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**
 *
 * libreria de validadores para el model
 */
export class ModelLogicValidation<
    TIDiccAC extends IDiccModelValActionConfigG = IDiccModelValActionConfigG
  >
  extends StructureLogicValidation<TIDiccAC>
  implements
    Record<TKeysDiccModelValActionConfigG, TStructureFnBagForActionModule>
{
  /** configuracion de valores predefinidos para el modulo*/
  public static override readonly getDefault = () => {
    const superDf = StructureLogicValidation.getDefault();
    return {
      ...superDf,
      dfDiccActionConfig: {
        ...(superDf.dfDiccActionConfig as any),
        isRequired: false,
        isTypeOfModel: true, //siempre activa
        isModel: { modelForDiccAC: {} },
      } as IDiccModelValActionConfigG,
      topPriorityKeysAction: [
        ...superDf.topPriorityKeysAction,
        "isRequired",
      ] as Array<TKeysDiccModelValActionConfigG>,
      topMandatoryKeysAction: [
        ...superDf.topMandatoryKeysAction,
      ] as Array<TKeysDiccModelValActionConfigG>,
      dfIsRequiredSpecialConfig: {
        isNullAsValue: false,
        isEmptyObjectAsValue: false,
      } as TisRequiredConfig,
    };
  };
  /** */
  constructor() {
    super("modelVal");
  }
  protected override getDefault() {
    return ModelLogicValidation.getDefault();
  }
  protected override rebuildCustomConfigFromModuleContext(
    currentContextConfig: TStructureValModuleConfigForModel<TIDiccAC>,
    newContextConfig: TStructureValModuleConfigForModel<TIDiccAC>,
    mergeMode: Parameters<typeof this.util.deepMergeObjects>[1]["mode"]
  ): TStructureValModuleConfigForModel<TIDiccAC> {
    const cCC = currentContextConfig;
    const nCC = newContextConfig;
    let rConfig: TStructureValModuleConfigForModel<TIDiccAC>;
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
              }
            )
          : cCC.diccActionsConfig,
      };
    }
    //...aqui configuracion refinada:
    return rConfig;
  }
  protected override getMetadataWithContextModule(
    keyPath?: string
  ): TStructureMetaAndValidator<any, any, ModelLogicValidation> {
    return super.getMetadataWithContextModule(keyPath) as any;
  }
  protected override getMetadataOnlyModuleConfig(
    keyPath?: string
  ): TModelConfigForVal<TIDiccAC, any> {
    return super.getMetadataOnlyModuleConfig(keyPath);
  }
  /**... */
  protected override checkEmptyData(
    data: any,
    specialEmptyConfig: TisRequiredConfig
  ): boolean {
    specialEmptyConfig = this.util.isObject(specialEmptyConfig)
      ? specialEmptyConfig
      : this.getDefault().dfIsRequiredSpecialConfig;
    const { isNullAsModel, isEmptyObjectAsModel } = specialEmptyConfig;
    let isEmpty = false;
    //posibilidades de falta de datos
    const isUndefined = data === undefined;
    const isNull = data === null;
    const isEmptyObjectOrArray =
      typeof data === "object" &&
      data !== null &&
      Object.keys(data).length === 0; //SI VACIO
    isEmpty =
      isUndefined ||
      (isNull && !isNullAsModel) ||
      (isEmptyObjectOrArray && !isEmptyObjectAsModel);
    return isEmpty;
  }
  /**verificación de si el dato es vacio (estado en
   * que puede estar y afecta a todas las validacion
   * dependiendo si es requerido o no)
   *
   * @param data - el dato a verificar
   * @param res - la respuesta actual de la validación
   * @param middlewareStatus - reporte de los middlewares
   * (actual, ejecutados y por ejecutarse).
   *
   */
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
    //comprobación de vació
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
  //================================================================================================================================
  public async isTypeOfModel(
    bag: StructureBag<any>
  ): Promise<IStructureResponse> {
    const { data, criteriaHandler } = bag;
    const [keyAction, actionConfig] =
      this.getTupleActionConfigFromCriteriaHandler(
        criteriaHandler,
        "isTypeOfModel"
      );
    const rH = this.buildReportHandler(bag, keyAction);
    let res = rH.mutateResponse(undefined, { data });
    let zodCursor: TZodSchemaForClose = this.zod
      .optional(this.zod.object({}))
      .nullable();
    const isValid = zodCursor.safeParse(data).success;
    if (isValid === false) {
      res = rH.mutateResponse(res, {
        status: ELogicResStatusCode.INVALID_DATA,
      });
    }
    return res;
  }
  public async isRequired(bag: StructureBag<any>): Promise<IStructureResponse> {
    //Desempaquetar la accion e inicializar
    const { data, criteriaHandler } = bag;
    const [keyAction, actionConfig] =
      this.getTupleActionConfigFromCriteriaHandler(
        criteriaHandler,
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
  public async isModel(bag: StructureBag<any>): Promise<IStructureResponse> {
    const { data, criteriaHandler: cH } = bag;
    const [keyAction, actionConfig] =
      this.getTupleActionConfigFromCriteriaHandler(cH, "isModel");
    const rH = this.buildReportHandler(bag, keyAction);
    let res = rH.mutateResponse(undefined, { data });
    let { modelForDiccAC } = actionConfig;
    //===============================================
    //❗Obligatorio verificar que se pueda validar el dato❗
    res = this.checkEmptyDataWithRes(rH, bag);
    if (res.status > ELogicResStatusCode.VALID_DATA) return res;
    //===============================================
    modelForDiccAC = this.util.isObject(modelForDiccAC) ? modelForDiccAC : {};
    const mH = this.metadataHandler;
    const modelMetadata =
      mH.getExtractMetadataByStructureContext("structureModel");
    const keysField = modelMetadata.__keysProp;
    const promForField = keysField.map(async (keyField) => {
      const fieldData = data[keyField];
      const fieldMetadata = modelMetadata[keyField];
      const fieldKeyPath = fieldMetadata.__keyPath;
      const fieldValInst = mH.diccModuleInstanceContext
        .fieldVal as FieldLogicValidation;
      const sub_cH = new StructureCriteriaHandler(mH, "structureField", {
        keyPath: fieldKeyPath,
        diccGlobalAC: modelForDiccAC[keyField as any] as any,
      });
      sub_cH.extractDiccByKeyModuleContext("fieldVal");
      const sub_Bag = new StructureBag(this.keySrc, "fieldBag", {
        //❗el contexto es campo fieldBag❗
        data: fieldData,
        criteriaHandler: sub_cH,
      });
      const sub_rH = (fieldValInst as any as this) //❗hack❗ permite acceder a la propiedad protegida a las malas 🐱‍👤
        .buildReportHandler(sub_Bag, EKeyActionGroupForRes.fields as any);
      let resForField = sub_rH.mutateResponse(undefined, { data: fieldData });
      for (const tKeysForReq of sub_cH.aTKeysGlobalActionConfig) {
        const [keyModuleContext, sub_keyAction] = tKeysForReq;
        const resForFieldForAction = (await LogicController.runActionRequest(
          fieldValInst,
          sub_Bag,
          sub_keyAction
        )) as IStructureResponse;
        resForField.responses.push(resForFieldForAction);
        if (resForFieldForAction.status > fieldValInst["globalTolerance"])
          break; //😉 trampa `globalTolerance` es protected pero se llama asi para saltarse la proteccion
      }
      resForField = sub_rH.mutateResponse(resForField);
      return resForField;
    });
    const resesForField = await Promise.all(promForField);
    res = rH.mutateResponse(res, {
      responses: resesForField,
    });
    return res;
  }
}
