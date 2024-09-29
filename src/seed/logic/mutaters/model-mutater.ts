import { StructureLogicMutater } from "./_structure-mutater";
import { TModelConfigForMutate } from "./shared";
import {
  IStructureBagForActionModuleContext,
  TStructureFnBagForActionModule,
} from "../bag-module/shared-for-external-module";
import { IStructureResponse } from "../reports/shared";
import { TStructureMetaAndMutater } from "../meta/metadata-shared";
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
export interface IDiccModelMutateActionConfigG {
  /**formatear todos los campos del registro */
  mutateForModel:
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
        modelForDicc: object | undefined; //⚠ deberia ser un `Record<keyof Modelo, TIDiccFieldFormatAction>`
        //muy complicado para definirlo aquí
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
        mutateForModel: {},
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
  /**
   * @param keySrc indentificadora del recurso asociado a modulo
   */
  constructor(keySrc: string) {
    super("modelMutate", keySrc);
  }
  protected override getDefault() {
    return ModelLogicMutater.getDefault();
  }
  protected override getMetadataWithContextModule(
    keyPath?: string
  ): TStructureMetaAndMutater<any, any, TIDiccAC> {
    return super.getMetadataWithContextModule(keyPath) as any;
  }
  protected override getMetadataOnlyModuleConfig(
    keyPath?: string
  ): TModelConfigForMutate<TIDiccAC> {
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
  public async mutateForModel(
    bag: StructureBag<any>
  ): Promise<IStructureResponse> {
    return res;
    // //Desempaquetar la accion e inicializar
    // const keyAction: TLibKeyAction = "isFormatAllField";
    // const actionConfig = diccActionConfig[keyAction];
    // //const {  } = this.getModelMetaByKey(keyModel);
    // const { modelForDicc } = actionConfig;
    // const allFieldConfig = this.handler.getAllFieldConfig();
    // let res = this.mutateResponseForAction(undefined, {
    //   data,
    //   keyAction,
    //   status: ELogicResStatusCode.SUCCESS,
    // });
    // const { _isValModel } = ValLib.getDiccValHelper(false);
    // if (_isValModel(data, true) == false) {
    //   //se permite el vacio para obtener reporte de formateo de cada campo (aunque no existan)
    //   res = this.mutateResponseForAction(res, {
    //     data,
    //     status: ELogicResStatusCode.WARNING,
    //   });
    //   return res;
    // }
    // let promisesResponses = Object.keys(allFieldConfig).map(
    //   async (keySubField) => {
    //     let fieldHandlerContext: TStructureFieldHandlerContext;
    //     if (modelHandlerContext === "inModel") {
    //       fieldHandlerContext = "inField";
    //     }
    //     if (modelHandlerContext === "outModel") {
    //       fieldHandlerContext = "outField";
    //     }
    //     const subData = data[keySubField];
    //     let aDiccAC = this.util.isObject(modelForDicc)
    //       ? this.handler.mergeADiccFieldActionsConfig(
    //           fieldHandlerContext,
    //           keySubField,
    //           modelForDicc[keySubField]
    //         )
    //       : this.handler.getADiccFieldActionsConfig(
    //           fieldHandlerContext,
    //           keySubField
    //         );
    //     let subRes = this.mutateResponseForAction(undefined, {
    //       data: subData,
    //       keyAction,
    //       status: ELogicResStatusCode.SUCCESS,
    //     });
    //     //carga la libreria de campos de forma embebida
    //     const fieldLibContext = new FieldFormatLibGeneric();
    //     fieldLibContext.handler = this.handler; //❗Inmediatamente despues de la instancia de libreria❗
    //     subRes.embeddedResponses = await fieldLibContext.runFieldActionSequence(
    //       fieldHandlerContext,
    //       subData,
    //       aDiccAC,
    //       bag,
    //       keySubField
    //     );
    //     subRes = this.mutateResponseForAction(subRes, { data: subData });
    //     //garantizar integridad de dato;
    //     data[keySubField] = subRes.data;
    //     return subRes;
    //   }
    // );
    // res.embeddedResponses = await Promise.all(promisesResponses);
    // res = this.mutateResponseForAction(res, { data });
    // return res;
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
