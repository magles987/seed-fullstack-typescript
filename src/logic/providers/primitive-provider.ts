import {
  PrimitiveCriteriaHandler,
  Trf_PrimitiveCriteriaHandler,
} from "../criterias/primitive-criteria-handler";
import { TPrimitiveActionConfigFn } from "../criterias/shared-types";
import { ELogicCodeError, LogicError } from "../errors/logic-error";
import { Trf_PrimitiveLogicMetadataHandler } from "../meta/primitive-metadata-handler";
import { TwinBeeModule } from "../modules/module";
import { PrimitiveReportHandler } from "../reports/primitive-report-handler";
import {
  IPrimitiveResponse,
  TSelectorDataDriver,
} from "../reports/shared-types";
import { Driver } from "./_drivers/_driver";
import { LogicProvider } from "./_provider";
import {
  TKeyPrimitiveProviderModuleContext,
  TPrimitiveProviderBaseConfig,
} from "./shared-types";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**define el diccionario de configuraciones de acciones del provider */
export interface IDiccPrimitiveProviderActionConfig {
  singleRunDriver: {
    nameLogicDriver: string;
    opDriver?: Partial<Driver["getDefault"]>;
  };
}
/**claves identificadoras del diccionario
 * de acciones de configuracion */
export type TKeysDiccPrimitiveProviderActionConfig =
  keyof IDiccPrimitiveProviderActionConfig;
/**refactorizacion de la clase */
export type Trf_PrimitiveLogicProvider = PrimitiveLogicProvider<any>;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**... */
export class PrimitiveLogicProvider<
    TIDiccAC extends IDiccPrimitiveProviderActionConfig = IDiccPrimitiveProviderActionConfig
  >
  extends LogicProvider<TIDiccAC>
  implements
    Record<
      TKeysDiccPrimitiveProviderActionConfig,
      TPrimitiveActionConfigFn<any>
    >
{
  /** configuracion de valores predefinidos para el modulo*/
  public static readonly getDefault = () => {
    const superDf = LogicProvider.getDefault();
    return {
      ...superDf,
      driverList: [...superDf.driverList] as Driver[], //tipado de array especial que indica NO se permite inicializar con vacíos,
      diccActionConfig: {
        ...(superDf.diccActionConfig as any),
        singleRunDriver: {
          nameLogicDriver: "",
          opDriver: {},
        },
      } as IDiccPrimitiveProviderActionConfig,
      topPriorityKeysAction: [
        ...superDf.topPriorityKeysAction,
      ] as Array<TKeysDiccPrimitiveProviderActionConfig>,
      topMandatoryKeysAction: [
        ...superDf.topMandatoryKeysAction,
      ] as Array<TKeysDiccPrimitiveProviderActionConfig>,
    };
  };
  public override get metadataHandler(): Trf_PrimitiveLogicMetadataHandler {
    return super.metadataHandler as any;
  }
  public override set metadataHandler(mH: Trf_PrimitiveLogicMetadataHandler) {
    super.metadataHandler = mH;
  }
  public override get keyModuleContext(): TKeyPrimitiveProviderModuleContext {
    return "primitiveProvider";
  }
  /** */
  constructor(baseConfig?: TPrimitiveProviderBaseConfig) {
    super("structure", baseConfig);
    baseConfig = this.util.isObject(baseConfig) ? baseConfig : ({} as any);
  }
  protected override getDefault() {
    return PrimitiveLogicProvider.getDefault();
  }
  /**... */
  protected static buildInstanceForMetadata<
    TPrimitivePrimitiveInstance extends PrimitiveLogicProvider = PrimitiveLogicProvider
  >(preInstance: TPrimitivePrimitiveInstance): TPrimitivePrimitiveInstance {
    const util = TwinBeeModule.util;
    let inst: TPrimitivePrimitiveInstance;
    if (util.isInstance(preInstance)) {
      inst = preInstance;
    } else {
      const { primitiveModuleFactory } =
        TwinBeeModule._globalConfig_.diccModuleFactory;
      inst = primitiveModuleFactory.makeModuleInstance(
        "primitiveProvider",
        preInstance as any
      ) as any;
    }
    return inst;
  }
  /**obtiene una función de acción de acuerdo a su clave identificadora
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
  //================================================================
  public async singleRunDriver(
    criteriaHandler: PrimitiveCriteriaHandler<any>
  ): Promise<IPrimitiveResponse> {
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
