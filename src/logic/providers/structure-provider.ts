import { TStructureActionConfigFn } from "../criterias/shared-types";
import {
  StructureCriteriaHandler,
  Trf_StructureCriteriaHandler,
} from "../criterias/structure-criteria-handler";
import { ELogicCodeError, LogicError } from "../errors/logic-error";
import { Trf_StructureLogicMetadataHandler } from "../meta/structure-metadata-handler";
import { Module } from "../modules/module";
import {
  IStructureResponse,
  TSelectorDataDriver,
} from "../reports/shared-types";
import { StructureReportHandler } from "../reports/structure-report-handler";
import { Util_Module } from "../util/util-module";
import { Driver } from "./_drivers/_driver";
import { LogicProvider } from "./_provider";
import {
  TKeyStructureProviderModuleContext,
  TStructureProviderBaseConfig,
} from "./shared-types";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**define el diccionario de configuraciones de acciones del provider */
export interface IDiccStructureProviderActionConfig {
  singleRunDriver: {
    nameLogicDriver: string;
    opDriver?: Partial<Driver["getDefault"]>;
  };
}
/**claves identificadoras del diccionario
 * de acciones de configuración */
export type TKeysDiccStructureProviderActionConfig =
  keyof IDiccStructureProviderActionConfig;
/**refactorización de la clase */
export type Trf_StructureLogicProvider = StructureLogicProvider<any>;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**... */
export class StructureLogicProvider<
    TIDiccAC extends IDiccStructureProviderActionConfig = IDiccStructureProviderActionConfig
  >
  extends LogicProvider<TIDiccAC>
  implements
    Record<
      TKeysDiccStructureProviderActionConfig,
      TStructureActionConfigFn<any>
    >
{
  /** configuración de valores predefinidos para el modulo*/
  public static readonly getDefault = () => {
    const superDf = LogicProvider.getDefault();
    return {
      ...superDf,
      driverList: [...superDf.driverList], //as [Driver, ...Driver[]], //tipado de array especial que indica NO se permite inicializar con vacíos,
      diccActionConfig: {
        ...(superDf.diccActionConfig as any),
        singleRunDriver: {
          nameLogicDriver: "",
          opDriver: {},
        },
      } as IDiccStructureProviderActionConfig,
      topPriorityKeysAction: [
        ...superDf.topPriorityKeysAction,
      ] as Array<TKeysDiccStructureProviderActionConfig>,
      topMandatoryKeysAction: [
        ...superDf.topMandatoryKeysAction,
      ] as Array<TKeysDiccStructureProviderActionConfig>,
    };
  };
  public override get metadataHandler(): Trf_StructureLogicMetadataHandler {
    return super.metadataHandler as any;
  }
  public override set metadataHandler(mH: Trf_StructureLogicMetadataHandler) {
    super.metadataHandler = mH;
  }
  public override get keyModuleContext(): TKeyStructureProviderModuleContext {
    return "structureProvider";
  }
  /** */
  constructor(baseConfig?: TStructureProviderBaseConfig) {
    super("structure", baseConfig);
    baseConfig = this.util.isObject(baseConfig) ? baseConfig : ({} as any);
  }
  protected override getDefault() {
    return StructureLogicProvider.getDefault();
  }
  /**... */
  protected static buildInstanceForMetadata<
    TStructureProviderInstance extends StructureLogicProvider = StructureLogicProvider
  >(preInstance: TStructureProviderInstance): TStructureProviderInstance {
    const util = Util_Module.getInstance();
    let inst: TStructureProviderInstance;
    if (util.isInstance(preInstance)) {
      inst = preInstance;
    } else {
      const { structureModuleFactory } =
        Module._globalConfig_.diccModuleFactory;
      inst = structureModuleFactory.makeModuleInstance(
        "structureProvider",
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
  >(keyAction: TKeys): TStructureActionConfigFn<any>;
  /**obtiene un array de funciones de accion de acuerdo a sus claves identificadoras
   * preparadas para ser inyectadas en el middleware
   *
   * @param keysAction el array de las claves identificadoras de las funciones de accion solicitadas
   *
   * @returns el array de funciones de accion
   */
  public override getActionFnByKey<
    TKeys extends keyof TIDiccAC = keyof TIDiccAC
  >(keysAction: TKeys[]): Array<TStructureActionConfigFn<any>>;
  public override getActionFnByKey(keyOrKeysAction: unknown): unknown {
    return super.getActionFnByKey(keyOrKeysAction);
  }
  protected override getTupleActionConfigFromCriteriaHandler<
    TKey extends keyof TIDiccAC
  >(
    criteriaHandler: Trf_StructureCriteriaHandler,
    keyAction: TKey
  ): [TKey, TIDiccAC[TKey]] {
    const tKeyGlobalAC = [this.keyModuleContext, keyAction];
    const actionConfig =
      criteriaHandler.findGlobalActionByKeyModuleAndKeyAction(
        tKeyGlobalAC as any
      );
    return [keyAction, actionConfig];
  }
  protected override buildReportHandler(
    criteriaHandler: StructureCriteriaHandler<any>,
    keyAction: keyof TIDiccAC
  ): StructureReportHandler {
    const {
      data,
      firstData,
      type,
      modifyType,
      keyPath,
      keyActionRequest,
      keyStructureContext,
    } = criteriaHandler;
    //adapta clave de contexto general a profundo
    const deep_keyModuleContext =
      StructureReportHandler.adapatKeyStructureContextToDeepKeyModuleContext(
        this.keyModule as any,
        keyStructureContext
      );
    let rH = new StructureReportHandler(this.keySrc, {
      keyRepModule: this.keyModule as any,
      keyRepModuleContext: deep_keyModuleContext as any,
      keyRepLogicContext: this.keyLogicContext,
      keyActionRequest: keyActionRequest,
      keyAction: keyAction as any,
      keyTypeRequest: type,
      keyModifyTypeRequest: modifyType,
      keyPath,
      keyLogic: this.util.getKeyLogicByKeyPath(keyPath),
      keyRepSrc: this.keySrc,
      status: this.globalStatus,
      tolerance: this.globalTolerance,
      firstCtrlData: firstData,
      data,
    });
    return rH;
  }
  public override preRunAction(
    criteriaHandler: StructureCriteriaHandler<any>,
    keyAction: keyof TIDiccAC
  ): void {
    super.preRunAction(criteriaHandler, keyAction) as any;
    return;
  }
  public override postRunAction(
    criteriaHandler: StructureCriteriaHandler<any>,
    res: IStructureResponse
  ): void {
    super.postRunAction(criteriaHandler, res) as any;
    return;
  }
  //================================================================
  public async singleRunDriver(
    criteriaHandler: StructureCriteriaHandler<any>
  ): Promise<IStructureResponse> {
    const { data } = criteriaHandler;
    const [keyAction, actionConfig] =
      this.getTupleActionConfigFromCriteriaHandler(
        criteriaHandler,
        "singleRunDriver"
      );
    let { nameLogicDriver, opDriver } = actionConfig;
    const selectorDataDriver: TSelectorDataDriver = "first";
    const driver = this.getDriverByNameLogicDriver(nameLogicDriver);
    if (!this.util.isInstance(driver)) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${driver} is not driver valid`,
      });
    }
    if (this.util.isObject(opDriver)) driver.mutateProps(opDriver);
    const rH = this.buildReportHandler(criteriaHandler, keyAction);
    let res = rH.mutateResponse(undefined, { data });
    let driverResponse = await driver.sendRequestFromService(
      criteriaHandler.getLiteral()
    );
    res = rH.mutateResponse(res, {
      ...rH.adaptDriverResponseToResponse(
        driverResponse,
        res,
        selectorDataDriver
      ),
    });
    return res;
  }
}
