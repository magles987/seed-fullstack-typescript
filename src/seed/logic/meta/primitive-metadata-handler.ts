import {
  TKeyHandlerModule,
  TKeyModuleWithReport,
} from "../config/shared-modules";
import { PrimitiveLogicMutater } from "../mutaters/primitive-mutater";
import { Trf_TPrimitiveConfigForMutate } from "../mutaters/shared";
import { PrimitiveLogicHook } from "../hooks/primitive-hook";
import { Trf_TPrimitiveConfigForHook } from "../hooks/shared";
import { PrimitiveLogicProvider } from "../providers/primitive-provider";
import { Trf_TPrimitiveConfigForProvider } from "../providers/shared";
import { PrimitiveLogicValidation } from "../validators/primitive-validation";
import { RequestLogicValidation } from "../validators/request-validation";
import { Trf_TPrimitiveConfigForVal } from "../validators/shared";
import { LogicMetadataHandler } from "./_metadata-handler";
import { Util_Meta } from "./_util-meta";
import {
  IDiccPrimitiveModuleInstanceContext,
  IPrimitiveMetadataContext,
  Trf_IPrimitiveMetadataModuleConfig,
} from "./metadata-handler-shared";
import {
  TPrimitiveFull,
  TPrimitiveMeta,
  TPrimitiveMetaAndMutater,
  TPrimitiveMetaAndHook,
  TPrimitiveMetaAndProvider,
  TPrimitiveMetaAndValidator,
  Trf_TPrimitiveFull,
  Trf_TPrimitiveMeta,
  TPrimitiveMetaAndCtrl,
} from "./metadata-shared";
import { Trf_TPrimitiveConfigForCtrl } from "../controllers/_shared";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**tipado refactorizado del manejador */
export type Trf_PrimitiveLogicMetadataHandler = PrimitiveLogicMetadataHandler<
  any,
  any,
  any,
  any,
  any,
  any,
  any
>;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**... */
export class PrimitiveLogicMetadataHandler<
  TValue,
  TPrimitiveMutateInstance extends PrimitiveLogicMutater = PrimitiveLogicMutater,
  TPrimitiveValInstance extends PrimitiveLogicValidation = PrimitiveLogicValidation,
  TRequestValInstance extends RequestLogicValidation = RequestLogicValidation,
  TPrimitiveHookInstance extends PrimitiveLogicHook = PrimitiveLogicHook,
  TPrimitiveProviderInstance extends PrimitiveLogicProvider = PrimitiveLogicProvider,
  TKeyDiccCtrlCRUD extends string = string
> extends LogicMetadataHandler {
  /** configuracion de valores predefinidos para el modulo*/
  public static override readonly getDefault = () => {
    const superDf = LogicMetadataHandler.getDefault();
    return {
      ...superDf,
      handlerConfig: {
        primitiveMeta: {
          __type: "string",
          __isArray: false,
          __isVirtual: false,
          __dfData: undefined, //❗ OBLIGATORIO en la definicion de cada metadato
          __keysProp: [],
          __mutateConfig: {
            primitiveMutate: {
              diccActionsConfig: {},
            },
          },
          __valConfig: {
            primitiveVal: {
              diccActionsConfig: {},
            },
            requestVal: {
              diccActionsConfig: {},
            },
          },
          __hookConfig: {
            primitiveHook: {
              diccActionsConfig: {},
            },
          },
          __providerConfig: {
            primitiveProvider: {
              diccActionsConfig: {},
            },
          },
          __ctrlConfig: {
            primitiveCtrl: {
              diccATKeyCRUD: {},
            },
          },
        },
      } as IPrimitiveMetadataContext<Trf_TPrimitiveFull>,
    };
  };
  protected override get metadata(): TPrimitiveFull<
    TPrimitiveMutateInstance["dfDiccActionConfig"],
    TPrimitiveValInstance["dfDiccActionConfig"],
    TRequestValInstance["dfDiccActionConfig"],
    TPrimitiveHookInstance["dfDiccActionConfig"],
    TPrimitiveProviderInstance["dfDiccActionConfig"],
    TKeyDiccCtrlCRUD
  > {
    return super.metadata as any;
  }
  protected override set metadata(v: Trf_TPrimitiveFull) {
    super.metadata = v;
  }
  public override get diccModuleIntanceContext(): IDiccPrimitiveModuleInstanceContext<
    TPrimitiveMutateInstance,
    TPrimitiveValInstance,
    TRequestValInstance,
    TPrimitiveHookInstance,
    TPrimitiveProviderInstance
  > {
    return super.diccModuleIntanceContext as any;
  }
  protected override set diccModuleIntanceContext(
    v: IDiccPrimitiveModuleInstanceContext
  ) {
    super.diccModuleIntanceContext = v;
  }
  /**
   * @param keySrc clave identificadora del recurso,
   * @param diccModuleContextInstance diccionario de instancias de modulos
   * @param baseMetadata esquema base para construir los metadatos
   */
  constructor(
    keySrc: string,
    baseMetadata: TPrimitiveFull<
      TPrimitiveMutateInstance["dfDiccActionConfig"],
      TPrimitiveValInstance["dfDiccActionConfig"],
      TRequestValInstance["dfDiccActionConfig"],
      TPrimitiveHookInstance["dfDiccActionConfig"],
      TPrimitiveProviderInstance["dfDiccActionConfig"],
      TKeyDiccCtrlCRUD
    >,
    diccModuleContextInstance?: IDiccPrimitiveModuleInstanceContext
  ) {
    super("structure", keySrc);
    this.diccModuleIntanceContext = this.buildDiccModuleContextIntance(
      diccModuleContextInstance
    );
    this.metadata = this.buildMetadata(baseMetadata, undefined);
  }
  protected override getDefault() {
    return PrimitiveLogicMetadataHandler.getDefault();
  }
  protected override buildDiccModuleContextIntance(
    diccMIContext?: IDiccPrimitiveModuleInstanceContext
  ): IDiccPrimitiveModuleInstanceContext {
    let rDiccMIContext = {} as IDiccPrimitiveModuleInstanceContext;
    const diccDf: IDiccPrimitiveModuleInstanceContext = {
      primitiveMutate: new PrimitiveLogicMutater(this.keySrc),
      primitiveVal: new PrimitiveLogicValidation(this.keySrc),
      requestVal: new RequestLogicValidation("structure", this.keySrc),
      primitiveHook: new PrimitiveLogicHook(this.keySrc),
      primitiveProvider: new PrimitiveLogicProvider(this.keySrc),
    };
    if (!this.util.isObject(diccMIContext)) {
      rDiccMIContext = diccDf;
    } else {
      rDiccMIContext = {
        primitiveMutate: this.util.isInstance(diccMIContext.primitiveMutate)
          ? diccMIContext.primitiveMutate
          : diccDf.primitiveMutate,
        primitiveVal: this.util.isInstance(diccMIContext.primitiveVal)
          ? diccMIContext.primitiveVal
          : diccDf.primitiveVal,
        requestVal: this.util.isInstance(diccMIContext.requestVal)
          ? diccMIContext.requestVal
          : diccDf.requestVal,
        primitiveHook: this.util.isInstance(diccMIContext.primitiveHook)
          ? diccMIContext.primitiveHook
          : diccDf.primitiveHook,
        primitiveProvider: this.util.isInstance(diccMIContext.primitiveProvider)
          ? diccMIContext.primitiveProvider
          : diccDf.primitiveProvider,
      };
    }
    rDiccMIContext = this.injectThisHandlerIntoModuleInstance(rDiccMIContext);
    return rDiccMIContext;
  }
  protected override injectThisHandlerIntoModuleInstance(
    diccModuleInstContext: IDiccPrimitiveModuleInstanceContext
  ): IDiccPrimitiveModuleInstanceContext {
    diccModuleInstContext.primitiveMutate.metadataHandler = this;
    diccModuleInstContext.primitiveVal.metadataHandler = this;
    diccModuleInstContext.requestVal.metadataHandler = this;
    diccModuleInstContext.primitiveHook.metadataHandler = this;
    diccModuleInstContext.primitiveProvider.metadataHandler = this;
    return diccModuleInstContext;
  }
  public override buildMetadata(
    newMetadata: Partial<Trf_TPrimitiveFull>,
    currentMetadata?: Trf_TPrimitiveFull
  ): Trf_TPrimitiveFull {
    let metadatos = this.buildPrimitiveMetadata(
      newMetadata as Trf_TPrimitiveFull,
      currentMetadata
    );
    return metadatos as any as Trf_TPrimitiveFull;
  }
  private buildPrimitiveMetadata(
    newMetadata: Trf_TPrimitiveMeta,
    currentMetadata: Trf_TPrimitiveMeta
  ): Trf_TPrimitiveMeta {
    const dfHC = this.getDefault().handlerConfig;
    const nM = newMetadata as Trf_TPrimitiveMeta;
    const cM = (
      this.util.isObject(currentMetadata) ? currentMetadata : dfHC.primitiveMeta
    ) as Trf_TPrimitiveMeta;
    newMetadata = this.buildMetadataHandlerConfig(nM, cM) as Trf_TPrimitiveMeta;
    return newMetadata;
  }
  private buildMetadataHandlerConfig(
    metadataHC: unknown,
    currentMetadataHC: unknown
  ): unknown {
    const dfHC = PrimitiveLogicMetadataHandler.getDefault().handlerConfig;
    const mHC = metadataHC as Trf_TPrimitiveFull;
    const cMHC = (
      this.util.isObject(currentMetadataHC)
        ? currentMetadataHC
        : dfHC.primitiveMeta
    ) as Trf_TPrimitiveFull;
    if (!this.util.isObject(mHC)) {
      metadataHC = cMHC; //❕no deberia nunca entrar aqui❕
    } else {
      const currentDfData = this.buildDfData(mHC.__dfData, cMHC.__dfData);
      //construir configuracion general
      metadataHC = {
        ...mHC, // garantiza otras propiedades adiccionales
        __P_Key: this.util.isString(mHC.__P_Key) ? mHC.__P_Key : this.keySrc, //⚠Se usa la misma key en caso no no terner personalizacion
        __S_Key: this.util.isString(mHC.__S_Key) ? mHC.__S_Key : this.keySrc, //⚠Se usa la misma key en caso no no terner personalizacion
        __type: this.util.isString(mHC.__type) ? mHC.__type : cMHC.__type,
        __isArray: this.util.isNotUndefinedAndNotNull(mHC.__isArray)
          ? mHC.__isArray
          : cMHC.__isArray,
        __isVirtual: this.util.isNotUndefinedAndNotNull(mHC.__isVirtual)
          ? mHC.__isVirtual
          : cMHC.__isVirtual,
        __dfData: currentDfData,
        __keysProp: this.util.isLiteralObject(currentDfData)
          ? Object.keys(currentDfData)
          : cMHC.__keysProp,
        __mutateConfig: this.buildMetadataForMutateModule(
          mHC.__mutateConfig,
          cMHC.__mutateConfig
        ),
        __valConfig: this.buildMetadataForValModule(
          mHC.__valConfig,
          cMHC.__valConfig
        ),
        __hookConfig: this.buildMetadataForHookModule(
          mHC.__hookConfig,
          cMHC.__hookConfig
        ),
        __providerConfig: this.buildMetadataForProviderModule(
          mHC.__providerConfig,
          cMHC.__providerConfig
        ),
        __ctrlConfig: this.buildMetadataForCtrlModule(
          mHC.__ctrlConfig,
          cMHC.__ctrlConfig
        ),
      } as Trf_TPrimitiveFull;
    }
    return metadataHC;
  }
  /**construye un dato predefinido para
   * los metadatos segun el contexto*/
  private buildDfData(newDfData: any, currentDfData: any): any {
    let dfData =
      newDfData !== undefined
        ? newDfData
        : currentDfData !== undefined
        ? currentDfData
        : undefined;
    //❓❓Que hacer si el valor predefinido si es undefined❓❓
    // if (dfValue === undefined) {
    //   throw new LogicError({
    //     code: ELogicCodeError.MODULE_ERROR,
    //     msn: `${currentBuildDfValue} is not builder function of value valid `,
    //   });
    // }
    return dfData;
  }
  /** */
  private buildMetadataForMutateModule(
    metadataMutateC: Trf_TPrimitiveConfigForMutate,
    currentMetadataMutateC: Trf_TPrimitiveConfigForMutate
  ): Trf_TPrimitiveConfigForMutate {
    const { primitiveMutate: primitiveMutateInstance } =
      this.diccModuleIntanceContext;
    let rMetadataMutateC: Trf_TPrimitiveConfigForMutate = {}; //de diferentes contextos
    const mFC = metadataMutateC as Trf_TPrimitiveConfigForMutate;
    const cMFC = (
      this.util.isObject(currentMetadataMutateC)
        ? {
            ...(currentMetadataMutateC as Trf_TPrimitiveConfigForMutate),
            primitiveMutate: this.util.isObject(
              (currentMetadataMutateC as Trf_TPrimitiveConfigForMutate)
                .primitiveMutate
            )
              ? {
                  ...(currentMetadataMutateC as Trf_TPrimitiveConfigForMutate)
                    .primitiveMutate,
                  diccActionsConfig: this.util.isObject(
                    (currentMetadataMutateC as Trf_TPrimitiveConfigForMutate)
                      .primitiveMutate.diccActionsConfig
                  )
                    ? (currentMetadataMutateC as Trf_TPrimitiveConfigForMutate)
                        .primitiveMutate.diccActionsConfig
                    : primitiveMutateInstance.dfDiccActionConfig,
                }
              : {
                  diccActionsConfig: primitiveMutateInstance.dfDiccActionConfig,
                },
          }
        : {
            primitiveMutate: {
              diccActionsConfig: primitiveMutateInstance.dfDiccActionConfig,
            },
          }
    ) as Trf_TPrimitiveConfigForMutate;
    if (!this.util.isObject(mFC)) {
      rMetadataMutateC = cMFC;
    } else {
      rMetadataMutateC = {
        ...mFC,
        primitiveMutate: this.util.isObject(mFC.primitiveMutate)
          ? {
              ...mFC.primitiveMutate,
              diccActionsConfig: this.util.isObject(
                mFC.primitiveMutate.diccActionsConfig
              )
                ? this.util.mergeDiccActionConfig(
                    [
                      cMFC.primitiveMutate.diccActionsConfig,
                      mFC.primitiveMutate.diccActionsConfig,
                    ],
                    {
                      //si no existe metadatos actualmente la fusion debe ser "hard"
                      //ya que la prioridad maxima seria los nuevos metadatos
                      mode: this.util.isObject(currentMetadataMutateC)
                        ? "soft"
                        : "hard",
                    }
                  )
                : cMFC.primitiveMutate.diccActionsConfig,
            }
          : cMFC.primitiveMutate,
      };
    }
    return rMetadataMutateC;
  }
  /** */
  private buildMetadataForValModule(
    metadataValC: Trf_TPrimitiveConfigForVal,
    currentMetadataValC: Trf_TPrimitiveConfigForVal
  ): Trf_TPrimitiveConfigForVal {
    const {
      primitiveVal: primitiveValInstance,
      requestVal: requestValInstance,
    } = this.diccModuleIntanceContext;
    let rMetadataValC: Trf_TPrimitiveConfigForVal = {}; //de diferentes contextos
    const mVC = metadataValC as Trf_TPrimitiveConfigForVal;
    const cMVC = (
      this.util.isObject(currentMetadataValC)
        ? {
            ...(currentMetadataValC as Trf_TPrimitiveConfigForVal),
            primitiveVal: this.util.isObject(
              (currentMetadataValC as Trf_TPrimitiveConfigForVal).primitiveVal
            )
              ? {
                  ...(currentMetadataValC as Trf_TPrimitiveConfigForVal)
                    .primitiveVal,
                  diccActionsConfig: this.util.isObject(
                    (currentMetadataValC as Trf_TPrimitiveConfigForVal)
                      .primitiveVal.diccActionsConfig
                  )
                    ? (currentMetadataValC as Trf_TPrimitiveConfigForVal)
                        .primitiveVal.diccActionsConfig
                    : primitiveValInstance.dfDiccActionConfig,
                }
              : {
                  diccActionsConfig: primitiveValInstance.dfDiccActionConfig,
                },
            requestVal: this.util.isObject(
              (currentMetadataValC as Trf_TPrimitiveConfigForVal).requestVal
            )
              ? {
                  ...(currentMetadataValC as Trf_TPrimitiveConfigForVal)
                    .requestVal,
                  diccActionsConfig: this.util.isObject(
                    (currentMetadataValC as Trf_TPrimitiveConfigForVal)
                      .requestVal.diccActionsConfig
                  )
                    ? (currentMetadataValC as Trf_TPrimitiveConfigForVal)
                        .requestVal.diccActionsConfig
                    : requestValInstance.dfDiccActionConfig,
                }
              : {
                  diccActionsConfig: requestValInstance.dfDiccActionConfig,
                },
          }
        : {
            primitiveVal: {
              diccActionsConfig: primitiveValInstance.dfDiccActionConfig,
            },
            requestVal: {
              diccActionsConfig: requestValInstance.dfDiccActionConfig,
            },
          }
    ) as Trf_TPrimitiveConfigForVal;
    if (!this.util.isObject(mVC)) {
      rMetadataValC = cMVC;
    } else {
      rMetadataValC = {
        ...mVC,
        primitiveVal: this.util.isObject(mVC.primitiveVal)
          ? {
              ...mVC.primitiveVal,
              diccActionsConfig: this.util.isObject(
                mVC.primitiveVal.diccActionsConfig
              )
                ? this.util.mergeDiccActionConfig(
                    [
                      cMVC.primitiveVal.diccActionsConfig,
                      mVC.primitiveVal.diccActionsConfig,
                    ],
                    {
                      //si no existe metadatos actualmente la fusion debe ser "hard"
                      //ya que la prioridad maxima seria los nuevos metadatos
                      mode: this.util.isObject(currentMetadataValC)
                        ? "soft"
                        : "hard",
                    }
                  )
                : cMVC.primitiveVal.diccActionsConfig,
            }
          : cMVC.primitiveVal,
        requestVal: this.util.isObject(mVC.requestVal)
          ? {
              ...mVC.requestVal,
              diccActionsConfig: this.util.isObject(
                mVC.requestVal.diccActionsConfig
              )
                ? this.util.mergeDiccActionConfig(
                    [
                      cMVC.requestVal.diccActionsConfig,
                      mVC.requestVal.diccActionsConfig,
                    ],
                    {
                      //si no existe metadatos actualmente la fusion debe ser "hard"
                      //ya que la prioridad maxima seria los nuevos metadatos
                      mode: this.util.isObject(currentMetadataValC)
                        ? "soft"
                        : "hard",
                    }
                  )
                : cMVC.requestVal.diccActionsConfig,
            }
          : cMVC.requestVal,
      };
    }
    return rMetadataValC;
  }
  /** */
  private buildMetadataForHookModule(
    metadataHookC: Trf_TPrimitiveConfigForHook,
    currentMetadataHookC: Trf_TPrimitiveConfigForHook
  ): Trf_TPrimitiveConfigForHook {
    const { primitiveHook: primitiveHookInstance } =
      this.diccModuleIntanceContext;
    let rMetadataHookC: Trf_TPrimitiveConfigForHook = {};
    const mHC = metadataHookC as Trf_TPrimitiveConfigForHook;
    const cMHC = (
      this.util.isObject(currentMetadataHookC)
        ? {
            ...(currentMetadataHookC as Trf_TPrimitiveConfigForHook),
            primitiveHook: this.util.isObject(
              (currentMetadataHookC as Trf_TPrimitiveConfigForHook)
                .primitiveHook
            )
              ? {
                  ...(currentMetadataHookC as Trf_TPrimitiveConfigForHook)
                    .primitiveHook,
                  diccActionsConfig: this.util.isObject(
                    (currentMetadataHookC as Trf_TPrimitiveConfigForHook)
                      .primitiveHook.diccActionsConfig
                  )
                    ? (currentMetadataHookC as Trf_TPrimitiveConfigForHook)
                        .primitiveHook.diccActionsConfig
                    : primitiveHookInstance.dfDiccActionConfig,
                }
              : {
                  diccActionsConfig: primitiveHookInstance,
                },
          }
        : {
            primitiveHook: {
              diccActionsConfig: primitiveHookInstance.dfDiccActionConfig,
            },
          }
    ) as Trf_TPrimitiveConfigForHook;
    if (!this.util.isObject(mHC)) {
      rMetadataHookC = cMHC;
    } else {
      rMetadataHookC = {
        ...mHC,
        primitiveHook: this.util.isObject(mHC.primitiveHook)
          ? {
              ...mHC.primitiveHook,
              diccActionsConfig: this.util.isObject(
                mHC.primitiveHook.diccActionsConfig
              )
                ? this.util.mergeDiccActionConfig(
                    [
                      cMHC.primitiveHook.diccActionsConfig,
                      mHC.primitiveHook.diccActionsConfig,
                    ],
                    {
                      //si no existe metadatos actualmente la fusion debe ser "hard"
                      //ya que la prioridad maxima seria los nuevos metadatos
                      mode: this.util.isObject(currentMetadataHookC)
                        ? "soft"
                        : "hard",
                    }
                  )
                : cMHC.primitiveHook.diccActionsConfig,
            }
          : cMHC.primitiveHook,
      } as Trf_TPrimitiveConfigForHook;
    }
    return rMetadataHookC;
  }
  private buildMetadataForProviderModule(
    metadataProviderC: Trf_TPrimitiveConfigForProvider,
    currentMetadataProviderC: Trf_TPrimitiveConfigForProvider
  ): Trf_TPrimitiveConfigForProvider {
    const { primitiveProvider: primitiveProviderInstance } =
      this.diccModuleIntanceContext;
    let rMetadataProviderC: Trf_TPrimitiveConfigForProvider = {};
    const mPC = metadataProviderC as Trf_TPrimitiveConfigForProvider;
    const cMPC = (
      this.util.isObject(currentMetadataProviderC)
        ? {
            ...(currentMetadataProviderC as Trf_TPrimitiveConfigForProvider),
            primitiveProvider: this.util.isObject(
              (currentMetadataProviderC as Trf_TPrimitiveConfigForProvider)
                .primitiveProvider
            )
              ? {
                  ...(
                    currentMetadataProviderC as Trf_TPrimitiveConfigForProvider
                  ).primitiveProvider,
                  diccActionsConfig: this.util.isObject(
                    (
                      currentMetadataProviderC as Trf_TPrimitiveConfigForProvider
                    ).primitiveProvider.diccActionsConfig
                  )
                    ? (
                        currentMetadataProviderC as Trf_TPrimitiveConfigForProvider
                      ).primitiveProvider.diccActionsConfig
                    : primitiveProviderInstance.dfDiccActionConfig,
                }
              : {
                  diccActionsConfig:
                    primitiveProviderInstance.dfDiccActionConfig,
                },
          }
        : {
            primitiveProvider: {
              diccActionsConfig: primitiveProviderInstance.dfDiccActionConfig,
            },
          }
    ) as Trf_TPrimitiveConfigForProvider;
    let rModelConfig = {} as Trf_TPrimitiveConfigForProvider;
    if (!this.util.isObject(mPC)) {
      rModelConfig = cMPC;
    } else {
      rModelConfig = {
        ...mPC,
        primitiveProvider: this.util.isObject(mPC.primitiveProvider)
          ? {
              ...mPC.primitiveProvider,
              diccActionsConfig: this.util.isObject(
                mPC.primitiveProvider.diccActionsConfig
              )
                ? this.util.mergeDiccActionConfig(
                    [
                      cMPC.primitiveProvider.diccActionsConfig,
                      mPC.primitiveProvider.diccActionsConfig,
                    ],
                    {
                      //si no existe metadatos actualmente la fusion debe ser "hard"
                      //ya que la prioridad maxima seria los nuevos metadatos
                      mode: this.util.isObject(currentMetadataProviderC)
                        ? "soft"
                        : "hard",
                    }
                  )
                : cMPC.primitiveProvider.diccActionsConfig,
            }
          : cMPC.primitiveProvider,
      } as Trf_TPrimitiveConfigForProvider;
    }
    return rMetadataProviderC;
  }
  private buildMetadataForCtrlModule(
    metadataCtrlC: Trf_TPrimitiveConfigForCtrl,
    currentMetadataCtrlC: Trf_TPrimitiveConfigForCtrl
  ): Trf_TPrimitiveConfigForCtrl {
    const df = this.getDefault().handlerConfig;
    let rMetadataCtrlC: Trf_TPrimitiveConfigForCtrl = {}; //de diferentes contextos
    const dfCC = df.primitiveMeta.__ctrlConfig;
    const mCC = metadataCtrlC as Trf_TPrimitiveConfigForCtrl;
    const cMCC = (
      this.util.isObject(currentMetadataCtrlC)
        ? {
            ...(currentMetadataCtrlC as Trf_TPrimitiveConfigForCtrl),
            primitiveCtrl: this.util.isObject(
              (currentMetadataCtrlC as Trf_TPrimitiveConfigForCtrl)
                .primitiveCtrl
            )
              ? {
                  ...(currentMetadataCtrlC as Trf_TPrimitiveConfigForCtrl)
                    .primitiveCtrl,
                  diccATKeyCRUD: this.util.isObject(
                    (currentMetadataCtrlC as Trf_TPrimitiveConfigForCtrl)
                      .primitiveCtrl.diccATKeyCRUD
                  )
                    ? (currentMetadataCtrlC as Trf_TPrimitiveConfigForCtrl)
                        .primitiveCtrl.diccATKeyCRUD
                    : dfCC.primitiveCtrl.diccATKeyCRUD,
                }
              : {
                  diccATKeyCRUD: dfCC.primitiveCtrl.diccATKeyCRUD,
                },
          }
        : {
            primitiveCtrl: dfCC.primitiveCtrl,
          }
    ) as Trf_TPrimitiveConfigForCtrl;

    if (!this.util.isObject(mCC)) {
      rMetadataCtrlC = cMCC;
    } else {
      rMetadataCtrlC = {
        ...mCC,
        primitiveCtrl: this.util.isObject(mCC.primitiveCtrl)
          ? {
              ...mCC.primitiveCtrl,
              diccATKeyCRUD: this.util.isObject(mCC.primitiveCtrl.diccATKeyCRUD)
                ? mCC.primitiveCtrl.diccATKeyCRUD
                : cMCC.primitiveCtrl.diccATKeyCRUD,
            }
          : cMCC.primitiveCtrl,
      };
    }
    return rMetadataCtrlC;
  }
  //====Metodos de obtencion de metadatos============================================================================================================================
  /**
   * obtener un extracto (segmento) de metadatos
   * ____
   * @param rootSchema estructura raiz de la
   * cual extraer el segmento de metadatos
   * @return el segmento de metadato extraido
   * o `defaultVSchema` si no se pudo extraer
   */
  public static getExtractMetadata(rootSchema: object): object {
    const util = Util_Meta.getInstance();
    const dfPrimitiveMeta =
      PrimitiveLogicMetadataHandler.getDefault().handlerConfig.primitiveMeta;
    //❗en contexto primitivo no se tienen extractos
    //asi que se retorna todo el esquema❗
    let metadataSchema = util.isObject(rootSchema, false)
      ? rootSchema
      : dfPrimitiveMeta;
    //clonacion por seguridad
    //metadataSchema = util.clone(metadataSchema); //consume muchos recursos
    return metadataSchema;
  }
  public getMetadata(): TPrimitiveFull<
    TPrimitiveMutateInstance["dfDiccActionConfig"],
    TPrimitiveValInstance["dfDiccActionConfig"],
    TRequestValInstance["dfDiccActionConfig"],
    TPrimitiveHookInstance["dfDiccActionConfig"]
  > {
    const rootMetadata = this.metadata;
    let metadata =
      PrimitiveLogicMetadataHandler.getExtractMetadata(rootMetadata);
    return metadata as any;
  }
  public getExtractMetadataByModuleContext(
    keyModule: "metadata" //❗Solo para tipar el retorno❗
  ): TPrimitiveMeta;
  public getExtractMetadataByModuleContext(
    keyModule: "mutater" //❗Solo para tipar el retorno❗
  ): TPrimitiveMetaAndMutater<TPrimitiveMutateInstance["dfDiccActionConfig"]>;
  public getExtractMetadataByModuleContext(
    keyModule: "validator" //❗Solo para tipar el retorno❗
  ): TPrimitiveMetaAndValidator<
    TPrimitiveValInstance["dfDiccActionConfig"],
    TRequestValInstance["dfDiccActionConfig"]
  >;
  public getExtractMetadataByModuleContext(
    keyModule: "hook" //❗Solo para tipar el retorno❗
  ): TPrimitiveMetaAndHook<TPrimitiveHookInstance["dfDiccActionConfig"]>;
  public getExtractMetadataByModuleContext(
    keyModule: "provider" //❗Solo para tipar el retorno❗
  ): TPrimitiveMetaAndProvider;
  public getExtractMetadataByModuleContext(
    keyModule: "controller" //❗Solo para tipar el retorno❗
  ): TPrimitiveMetaAndCtrl<
    TPrimitiveMutateInstance["dfDiccActionConfig"],
    TPrimitiveValInstance["dfDiccActionConfig"],
    TRequestValInstance["dfDiccActionConfig"],
    TPrimitiveHookInstance["dfDiccActionConfig"],
    TPrimitiveProviderInstance["dfDiccActionConfig"],
    TKeyDiccCtrlCRUD
  >;
  public getExtractMetadataByModuleContext(
    keyModule: TKeyModuleWithReport | Extract<TKeyHandlerModule, "metadata"> //❗Solo para tipar el retorno❗
  ): unknown {
    //❗❗❗Es solo una fachada para tipar, ya que en
    //si devuelve todos los metadatos del segmento❗❗❗
    const rMetadata = this.getMetadata();
    return rMetadata;
  }
  /**... */
  public static getDfMetadataHandlerByContext(): Trf_IPrimitiveMetadataModuleConfig["primitiveMeta"] {
    const dfHC = PrimitiveLogicMetadataHandler.getDefault().handlerConfig;
    let dfMetadata = dfHC.primitiveMeta as any;
    return dfMetadata;
  }
  /** */
  public getDataDefault() {
    const metadata = this.getMetadata();
    let data = metadata.__dfData;
    //❗Obligatorio la clonacion❗
    data = this.util.clone(data);
    return data;
  }
  /**
   * obtener un objeto en base al modelo para propositos
   * generales.
   *
   * en contexto primitivo es utilizado solo si el
   * primitivo es un objeto literal y anonimo (no array)
   *
   * @param customizeValue un valor de personalizacion
   * que tendrá cada propiedad de ese objeto anonimo
   *
   * @returns un objeto de propositos generales con
   * las propiedades asignandole el valor
   * predefinido, si el primitivo no es un
   * objeto anonimo retornará un objeto literal
   * vacio `{}`
   */
  public getSchemaDataForGenericPurpose(customizeValue = undefined) {
    let modelGP = {};
    const metadata = this.getMetadata();
    const keysProp = metadata.__keysProp;
    if (this.util.isArray(keysProp)) {
      for (const key of keysProp) {
        modelGP[key] = customizeValue;
      }
    }
    return modelGP;
  }
}
