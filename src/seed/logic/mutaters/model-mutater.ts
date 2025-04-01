import { StructureLogicMutater } from "./_structure-mutater";
import {
  TModelConfigForMutate,
  TStructureMutateModuleConfigForModel,
} from "./shared";
import { EKeyActionGroupForRes, IStructureResponse } from "../reports/shared";
import { TStructureMetaAndMutater } from "../meta/metadata-shared";
import { StructureBag } from "../bag/structure-bag";
import { FieldLogicMutater } from "./field-mutater";
import { LogicController } from "../controllers/_controller";
import { TStructureFnBagForActionModule } from "../bag/shared";
import { StructureCriteriaHandler } from "../criterias/structure-criteria-handler";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** define las propiedades de cada formateo
 * que puede configurar y ejecutar un campo
 *
 * ⚠ todas las propiedades raiz hacen referencia
 * a un formato, ya que un campo puede tener
 * asignados varias de estos formatos, estas
 * propiedades deben ser **opcionales**
 */
export interface IDiccModelMutateActionConfigG<
  TIDiccFieldMutateAC extends FieldLogicMutater["dfDiccActionConfig"] = FieldLogicMutater["dfDiccActionConfig"]
> {
  /**formatear todos los campos del registro */
  mutateModel:
    | {
        /**representa un modelo de diccionario
         * de configuracion de acciones de formateo
         * para cada campo
         *
         * ⚠ El tipo debería ser:
         *
         * `Record<keyof Model, TIDiccFieldFormatAction>`
         *
         * donde `TIADiccFieldFormatActionsConfig` es el diccionario personalizado
         */
        modelForDiccAC: Partial<Record<any, Partial<TIDiccFieldMutateAC>>>;
      }
    | undefined;
  /**eliminar los campos virtuales del modelo */
  deleteAllVirtualField: boolean | undefined;
}
/**claves identificadoras del diccionario de
 * acciones de configuracion */
export type TKeysDiccModelMutateActionConfigG =
  keyof IDiccModelMutateActionConfigG;
/**tipado refactorizado de la clase */
export type Trf_ModelLogicMutater = ModelLogicMutater;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *abstracta*
 *
 */
export class ModelLogicMutater<
    TIDiccAC extends IDiccModelMutateActionConfigG = IDiccModelMutateActionConfigG
  >
  extends StructureLogicMutater<TIDiccAC>
  implements
    Record<TKeysDiccModelMutateActionConfigG, TStructureFnBagForActionModule>
{
  /** configuracion de valores predefinidos para el modulo*/
  public static readonly getDefault = () => {
    const superDf = StructureLogicMutater.getDefault();
    return {
      ...superDf,
      dfDiccActionConfig: {
        ...(superDf.dfDiccActionConfig as any),
        mutateModel: {
          modelForDiccAC: {},
        },
        deleteAllVirtualField: true,
      } as IDiccModelMutateActionConfigG,
      topPriorityKeysAction: [
        ...superDf.topPriorityKeysAction,
      ] as Array<TKeysDiccModelMutateActionConfigG>,
      topMandatoryKeysAction: [
        ...superDf.topMandatoryKeysAction,
      ] as Array<TKeysDiccModelMutateActionConfigG>,
    };
  };
  /** */
  constructor() {
    super("modelMutate");
  }
  protected override getDefault() {
    return ModelLogicMutater.getDefault();
  }
  protected override rebuildCustomConfigFromModuleContext(
    currentContextConfig: TStructureMutateModuleConfigForModel<TIDiccAC>,
    newContextConfig: TStructureMutateModuleConfigForModel<TIDiccAC>,
    mergeMode: Parameters<typeof this.util.deepMergeObjects>[1]["mode"]
  ): TStructureMutateModuleConfigForModel<TIDiccAC> {
    const cCC = currentContextConfig;
    const nCC = newContextConfig;
    let rConfig: TStructureMutateModuleConfigForModel<TIDiccAC>;
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
  ): TStructureMetaAndMutater<any, any, ModelLogicMutater> {
    return super.getMetadataWithContextModule(keyPath) as any;
  }
  protected override getMetadataOnlyModuleConfig(
    keyPath?: string
  ): TModelConfigForMutate<TIDiccAC> {
    return super.getMetadataOnlyModuleConfig(keyPath);
  }
  //================================================================================================================================
  public async mutateModel(
    bag: StructureBag<any>
  ): Promise<IStructureResponse> {
    const { data, criteriaHandler: cH } = bag;
    const [keyAction, actionConfig] =
      this.getTupleActionConfigFromCriteriaHandler(cH, "mutateModel");
    const rH = this.buildReportHandler(bag, keyAction);
    let res = rH.mutateResponse(undefined, { data });
    let { modelForDiccAC } = actionConfig;
    modelForDiccAC = this.util.isObject(modelForDiccAC) ? modelForDiccAC : {};
    const mH = this.metadataHandler;
    const modelMetadata =
      mH.getExtractMetadataByStructureContext("structureModel");
    const keysField = modelMetadata.__keysProp;
    const promForField = keysField.map(async (keyField) => {
      const fieldData = data[keyField];
      const fieldMetadata = modelMetadata[keyField];
      const fieldKeyPath = fieldMetadata.__keyPath;
      const fieldMutateInst = mH.diccModuleInstanceContext
        .fieldMutate as FieldLogicMutater;
      const sub_cH = new StructureCriteriaHandler(mH, "structureField", {
        keyPath: fieldKeyPath,
        diccGlobalAC: modelForDiccAC[keyField as any] as any,
      });
      sub_cH.extractDiccByKeyModuleContext("fieldMutate");
      const sub_Bag = new StructureBag(this.keySrc, "fieldBag", {
        //❗el contexto es campo fieldBag❗
        data: fieldData,
        criteriaHandler: sub_cH as any,
      });
      const sub_rH = (fieldMutateInst as any as this) //❗hack❗ permite acceder a la propiedad protegida a las malas 🐱‍👤
        .buildReportHandler(sub_Bag, EKeyActionGroupForRes.fields as any);
      let resForField = sub_rH.mutateResponse(undefined, { data: fieldData });
      for (const tKeysForReq of sub_cH.aTKeysGlobalActionConfig) {
        const [keyModuleContext, sub_keyAction] = tKeysForReq;
        const resForFieldForAction = (await LogicController.runActionRequest(
          fieldMutateInst,
          sub_Bag,
          sub_keyAction
        )) as IStructureResponse;
        resForField.responses.push(resForFieldForAction);
        if (resForFieldForAction.status > fieldMutateInst["globalTolerance"])
          break; //😉 trampa `globalTolerance` es protected pero se llama asi para saltarse la proteccion
      }
      resForField = sub_rH.mutateResponse(resForField);
      //mutacion de campo a modelo
      res.data[keyField] = resForField.data;
      return resForField;
    });
    const resesForField = await Promise.all(promForField);
    res = rH.mutateResponse(res, {
      responses: resesForField,
    });
    return res;
  }
  public async deleteAllVirtualField(
    bag: StructureBag<any>
  ): Promise<IStructureResponse> {
    return res;
    // //Desempaquetar la accion e inicializar
    // const keyAction: TLibKeyAction = "deleteAllVirtualField";
    // const actionConfig = diccActionConfig[keyAction];
    // //const { } = actionConfig;
    // const allFieldConfig = this.handler.getAllFieldConfig();
    // let res = this.mutateResponseForAction(undefined, {
    //   data,
    //   keyAction,
    // });
    // const { _isValModel } = ValLib.getDiccValHelper(false);
    // if (_isValModel(data, true) == false) {
    //   res = this.mutateResponseForAction(res, {
    //     data,
    //     status: ELogicResStatusCode.WARNING,
    //   });
    //   return res;
    // }
    // let newData = {};
    // bag.__formatterModule[keyAction] = {};
    // for (const keyField in allFieldConfig) {
    //   const fieldConfig = this.handler.getFieldConfig(keyField);
    //   const { isVirtual } = fieldConfig;
    //   if (!isVirtual) {
    //     //reasigna los reales
    //     newData[keyField] = data[keyField];
    //   } else {
    //     //los virtuales van al bag
    //     bag.__formatterModule[keyAction][keyField] = data[keyField];
    //   }
    // }
    // res = this.mutateResponseForAction(res, {
    //   data: newData,
    // });
    // return res;
  }
}
