import { TStructureActionConfigFn } from "../criterias/shared-types";
import { StructureCriteriaHandler } from "../criterias/structure-criteria-handler";
import { TwinBeeModule } from "../modules/module";
import {
  ELogicResStatusCode,
  IStructureResponse,
} from "../reports/shared-types";
import { StructureReportHandler } from "../reports/structure-report-handler";
import { StructureLogicValidation } from "./_structure-validation";
import { TModelValBaseConfig } from "./shared-types";
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
export interface IDiccModelValActionConfig {
  /**configuracion para validar si es un modelo valido*/
  isTypeOfModel: true; //❗Siempre activa❗
  /**configuracion para validar si el modelo es requerido */
  isRequired: boolean | TisRequiredConfig | undefined;
}
/**claves identificadoras del diccionario de acciones de configuracion */
export type TKeysDiccModelValActionConfig = keyof IDiccModelValActionConfig;
/**tipado refactorizado de la clase */
export type Trf_ModelLogicValidation = ModelLogicValidation;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**
 *
 * libreria de validadores para el model
 */
export class ModelLogicValidation<
    TIDiccAC extends IDiccModelValActionConfig = IDiccModelValActionConfig
  >
  extends StructureLogicValidation<TIDiccAC>
  implements
    Record<TKeysDiccModelValActionConfig, TStructureActionConfigFn<any>>
{
  /** configuracion de valores predefinidos para el modulo*/
  public static override readonly getDefault = () => {
    const superDf = StructureLogicValidation.getDefault();
    return {
      ...superDf,
      diccActionConfig: {
        ...(superDf.diccActionConfig as any),
        isRequired: false,
        isTypeOfModel: true, //siempre activa
      } as IDiccModelValActionConfig,
      topPriorityKeysAction: [
        ...superDf.topPriorityKeysAction,
        "isRequired",
      ] as Array<TKeysDiccModelValActionConfig>,
      topMandatoryKeysAction: [
        ...superDf.topMandatoryKeysAction,
      ] as Array<TKeysDiccModelValActionConfig>,
      dfIsRequiredSpecialConfig: {
        isNullAsValue: false,
        isEmptyObjectAsValue: false,
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
  constructor(baseConfig?: TModelValBaseConfig) {
    super("modelVal", baseConfig);
    baseConfig = this.util.isObject(baseConfig) ? baseConfig : ({} as any);
  }
  protected override getDefault() {
    return ModelLogicValidation.getDefault();
  }
  /**... */
  protected static buildInstanceForMetadata<
    TModelValInstance extends ModelLogicValidation = ModelLogicValidation
  >(preInstance: TModelValInstance): TModelValInstance {
    const util = TwinBeeModule.util;
    let inst: TModelValInstance;
    if (util.isInstance(preInstance)) {
      inst = preInstance;
    } else {
      const { structureModuleFactory } =
        TwinBeeModule._globalConfig_.diccModuleFactory;
      inst = structureModuleFactory.makeModuleInstance(
        "modelVal",
        preInstance as any
      ) as any;
    }
    return inst;
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
    criteriaHandler: StructureCriteriaHandler<any>
  ): Promise<IStructureResponse> {
    const { data } = criteriaHandler;
    const [keyAction, actionConfig] =
      this.getTupleActionConfigFromCriteriaHandler(
        criteriaHandler,
        "isTypeOfModel"
      );
    const rH = this.buildReportHandler(criteriaHandler, keyAction);
    let res = rH.mutateResponse(undefined, { data });
    const isValid = this.util.isValueType(data, [
      "undefined",
      "null",
      "object",
    ]);
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
    //❗se verifica el vacion sin res❗
    const isEmptyData = this.checkEmptyData(
      data,
      actionConfig as TisRequiredConfig
    );
    const isValid = !isEmptyData;
    //finalizar, siguiente accion o reportar
    if (isValid === false) {
      res = rH.mutateResponse(res, {
        status: ELogicResStatusCode.INVALID_DATA,
      });
    }
    return res;
  }
}
