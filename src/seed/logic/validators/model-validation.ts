import { TZodSchemaForClose } from "./_validation";
import { StructureLogicValidation } from "./_structure-validation";
import { TStructureMetaAndValidator } from "../meta/metadata-shared";
import { TModelConfigForVal } from "./shared";
import {
  IStructureBagForActionModuleContext,
  TStructureFnBagForActionModule,
} from "../bag-module/shared-for-external-module";
import {
  EKeyActionGroupForRes,
  ELogicResStatusCode,
  IStructureResponse,
} from "../reports/shared";
import { StructureBag } from "../bag-module/structure-bag";
import { IDiccFieldValActionConfigG } from "./field-validation";
import { TGenericTupleActionConfig } from "../config/shared-modules";
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
        modelForATupleAC: Record<
          any,
          Array<TGenericTupleActionConfig<TIDiccFieldValAC>>
        >;
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
  /**
   * @param keySrc indentificadora del recurso asociado a modulo
   */
  constructor(keySrc: string) {
    super("modelVal", keySrc);
  }
  protected override getDefault() {
    return ModelLogicValidation.getDefault();
  }
  protected override getMetadataWithContextModule(
    keyPath?: string
  ): TStructureMetaAndValidator<any, any, TIDiccAC> {
    return super.getMetadataWithContextModule(keyPath) as any;
  }
  protected override getMetadataOnlyModuleConfig(
    keyPath?: string
  ): TModelConfigForVal<TIDiccAC, any> {
    return super.getMetadataOnlyModuleConfig(keyPath);
  }
  protected override adapBagForContext<TKey extends keyof TIDiccAC>(
    bag: StructureBag<any>,
    keyAction: TKey
  ): IStructureBagForActionModuleContext<TIDiccAC, TKey> {
    const r = super.adapBagForContext(bag, keyAction);
    return r;
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
  /**verificacion de si el dato es vacio (estado en
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
    bag: StructureBag<any>,
    data: object,
    res: IStructureResponse
  ): IStructureResponse {
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
    //comprobacion de vacio
    if (isEmpty) {
      const rH = this.reportHandler;
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
    const {
      data,
      keyAction,
      keyPath,
      actionConfig,
      responses,
      middlewareReportStatus,
    } = this.adapBagForContext(bag, "isTypeOfModel");
    const rH = this.reportHandler;
    let res = rH.mutateResponse(undefined, {
      data,
      keyAction,
      keyPath,
    });
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
    const {
      data,
      keyAction,
      keyPath,
      actionConfig,
      responses,
      middlewareReportStatus,
    } = this.adapBagForContext(bag, "isRequired");
    const rH = this.reportHandler;
    let res = rH.mutateResponse(undefined, {
      data,
      keyAction,
      keyPath,
    });
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
    const {
      data,
      keyAction,
      keyPath,
      actionConfig,
      responses,
      middlewareReportStatus,
    } = this.adapBagForContext(bag, "isModel");
    const rH = this.reportHandler;
    let res = rH.mutateResponse(undefined, {
      data,
      keyAction,
      keyPath,
    });
    let { modelForATupleAC } = actionConfig;
    if (!this.util.isObject(modelForATupleAC)) {
      res = rH.mutateResponse(res, {
        status: ELogicResStatusCode.ERROR,
        msn: `${modelForATupleAC} is not schema of array of tuples of action config configure valid`,
      });
      return res;
    }
    const promForField = Object.entries(modelForATupleAC).map(
      async ([keyField, aTupleAC]) => {
        const subData = data[keyField];
        const subKeyPath = this.util.buildProgresiveKeyPath(keyPath, keyField);
        let resForField = rH.mutateResponse(undefined, {
          data: subData,
          keyAction: EKeyActionGroupForRes.fields,
          keyPath: subKeyPath,
        });
        if (this.util.isArrayTuple(aTupleAC, [1, 2], true)) {
          aTupleAC = this.buildContainerActionsConfig(
            "toTupleActionConfig",
            aTupleAC as Array<[any, any]>,
            { keyPath } // la ruta identificadora de modelo
          ) as Array<[any, any]>;
          const subBag = new StructureBag(this.keySrc, "fieldBag", {
            //❗el contexto es campo fieldBag❗
            data: subData,
            keyPath: subKeyPath,
            aTupleGlobalActionConfig:
              bag.buildATupleModuleContextActionConfigFromATupleAC(
                this,
                aTupleAC as any[],
                { keyPath: resForField.keyPath }
              ),
            criteriaHandler: bag.criteriaHandler,
            middlewareReportStatus,
          });
          let resesForAction: IStructureResponse[] = [];
          for (const tupleAC of aTupleAC) {
            const keyAction = tupleAC[0];
            let aFn = this.getActionFnByKey(keyAction as any);
            const resForAction = await aFn(subBag);
            resesForAction.push(resForAction);
            if (resForAction.status >= res.tolerance) break;
          }
          resForField = rH.mutateResponse(resForField, {
            //❕Deberia ser fieldVal y no this pero el metodo es protegido❕
            responses: resesForAction,
          });
        } else {
          //respuesta fachada
          resForField = rH.mutateResponse(resForField, {
            status: ELogicResStatusCode.ERROR,
          });
        }
        return resForField;
      }
    );
    const resesForField = await Promise.all(promForField);
    res = rH.mutateResponse(res, {
      responses: resesForField,
    });
    return res;
  }
}
