import { Module } from "../modules/index-barrel";
import {
  StructureCriteriaHandler,
  TStructureActionConfigFn,
} from "../criterias/index-barrel";
import { IStructureResponse } from "../reports/index-barrel";
import { StructureLogicMutater } from "./_structure-mutater";
import { TModelMutateBaseConfig } from "./shared-types";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** define las propiedades de cada formateo
 * que puede configurar y ejecutar un campo
 *
 * ⚠ todas las propiedades raiz hacen referencia
 * a un formato, ya que un campo puede tener
 * asignados varias de estos formatos, estas
 * propiedades deben ser **opcionales**
 */
export interface IDiccModelMutateActionConfig {
  /**eliminar los campos virtuales del modelo */
  deleteAllVirtualField: boolean | undefined;
}
/**claves identificadoras del diccionario de
 * acciones de configuracion */
export type TKeysDiccModelMutateActionConfig =
  keyof IDiccModelMutateActionConfig;
/**tipado refactorizado de la clase */
export type Trf_ModelLogicMutater = ModelLogicMutater;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *abstracta*
 *
 */
export class ModelLogicMutater<
    TIDiccAC extends IDiccModelMutateActionConfig = IDiccModelMutateActionConfig
  >
  extends StructureLogicMutater<TIDiccAC>
  implements
    Record<TKeysDiccModelMutateActionConfig, TStructureActionConfigFn<any>>
{
  /** configuración de valores predefinidos para el modulo*/
  public static readonly getDefault = () => {
    const superDf = StructureLogicMutater.getDefault();
    return {
      ...superDf,
      diccActionConfig: {
        ...(superDf.diccActionConfig as any),
        deleteAllVirtualField: true,
      } as IDiccModelMutateActionConfig,
      topPriorityKeysAction: [
        ...superDf.topPriorityKeysAction,
      ] as Array<TKeysDiccModelMutateActionConfig>,
      topMandatoryKeysAction: [
        ...superDf.topMandatoryKeysAction,
      ] as Array<TKeysDiccModelMutateActionConfig>,
    };
  };
  /** */
  constructor(baseConfig?: TModelMutateBaseConfig) {
    super("modelMutate", baseConfig);
    baseConfig = this.util.isObject(baseConfig) ? baseConfig : ({} as any);
  }
  protected override getDefault() {
    return ModelLogicMutater.getDefault();
  }
  /**... */
  protected static buildInstanceForMetadata<
    TModelMutateInstance extends ModelLogicMutater = ModelLogicMutater
  >(preInstance: TModelMutateInstance): TModelMutateInstance {
    const util = Module.util;
    let inst: TModelMutateInstance;
    if (util.isInstance(preInstance)) {
      inst = preInstance;
    } else {
      const { structureModuleFactory } =
        Module._globalConfig_.diccModuleFactory;
      inst = structureModuleFactory.makeModuleInstance(
        "modelMutate",
        preInstance as any
      ) as any;
    }
    return inst;
  }
  //================================================================================================================================
  public async deleteAllVirtualField(
    criteriaHandler: StructureCriteriaHandler<any>
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
