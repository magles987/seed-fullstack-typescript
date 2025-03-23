import { Trf_BagModule } from "../bag/_bag";
import { ActionModule } from "../config/module";
import { TKeyLogicContext } from "../config/shared-modules";
import { ELogicCodeError, LogicError } from "../errors/logic-error";
import { Trf_LogicMetadataHandler } from "../meta/_metadata-handler";
import { IDiccCommonModuleInstance } from "../meta/shared";
import { ELogicResStatusCode, IResponse } from "../reports/shared";
import { Driver } from "./_drivers/_driver";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** */
export abstract class LogicProvider<TIDiccAC> extends ActionModule<TIDiccAC> {
  /** configuración de valores predefinidos para el modulo*/
  public static readonly getDefault = () => {
    const superDf = ActionModule.getDefault();
    return {
      ...superDf,
      globalTolerance: ELogicResStatusCode.INVALID_DATA, //personalizada para provider
    };
  };
  /**
   * @param keyLogicContext el contexto lógico de esta librería
   */
  constructor(keyLogicContext: TKeyLogicContext) {
    super("provider", keyLogicContext);
  }
  protected override getDefault() {
    return LogicProvider.getDefault();
  }
  /**
   * diccionario de configuracion de acciones predefinido
   * para este modulo
   * ____
   * ⚠ Requiere ser de alcance publico para
   * tipar los diccionarios de acciones de
   * configuracion fuera de este modulo.
   */
  public get dfDiccActionConfig(): TIDiccAC {
    const df = this.getDefault();
    const r = df.dfDiccActionConfig as TIDiccAC;
    return r;
  }
  public override preRunAction(
    bag: Trf_BagModule,
    keyAction: keyof TIDiccAC
  ): void {
    return;
  }
  public override postRunAction(bag: Trf_BagModule, res: IResponse): void {
    //mutar data de res a bag
    bag.data = res.data;
    return;
  }
  /**obtiene la lista de drivers disponibles
   * @param namesLogicDriverToFind array de nombres de
   * Drivers para usar
   * @returns el listado
   */
  protected getListDriver(): Driver[] {
    const mH = this.metadataHandler as Trf_LogicMetadataHandler;
    const diccMIC = mH.diccModuleInstanceContext;
    if (!this.util.isObject(diccMIC)) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${diccMIC} is not module instance dictionary valid`,
      });
    }
    const { driversList } =
      mH.diccModuleInstanceContext as IDiccCommonModuleInstance;
    if (!this.util.isArray(driversList, false)) {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${driversList} is not driver instances list valid`,
      });
    }
    return driversList;
  }
  /**obtiene la lista de drivers seleccionados
   * @param namesLogicDriverToFind array de nombres de
   * Drivers para usar
   * @returns listado de drivers seleccionados
   */
  protected getDriverByNameLogicDriver(
    namesLogicDriverToFind: string[]
  ): Driver[];
  /**obtiene la lista de drivers seleccionados
   * @param nameLogicDriverToFind array de nombres de
   * Drivers para usar
   * @returns el driver seleccionado
   */
  protected getDriverByNameLogicDriver(nameLogicDriverToFind: string): Driver;
  protected getDriverByNameLogicDriver(
    namesLogicDriverToFind: string | string[]
  ): unknown {
    namesLogicDriverToFind = Array.isArray(namesLogicDriverToFind)
      ? namesLogicDriverToFind
      : [namesLogicDriverToFind];
    const driversList = this.getListDriver() ?? [];
    let driversListFound: Driver | Driver[] = [];
    if (namesLogicDriverToFind.length === 1) {
      driversListFound = driversList.find((d) =>
        namesLogicDriverToFind.includes(d.nameLogicDriver)
      );
    } else {
      driversListFound = driversList.filter((d) =>
        namesLogicDriverToFind.includes(d.nameLogicDriver)
      );
    }
    return driversListFound;
  }
  /**... */
  public static getControlReduceStatusDriverResponse(
    cStt: ELogicResStatusCode,
    nStt: ELogicResStatusCode
  ): ELogicResStatusCode {
    let stateStatus: ELogicResStatusCode;
    if (
      cStt === ELogicResStatusCode.ERROR ||
      nStt >= ELogicResStatusCode.ERROR
    ) {
      stateStatus = ELogicResStatusCode.ERROR;
    } else if (
      cStt === ELogicResStatusCode.BAD ||
      nStt >= ELogicResStatusCode.BAD
    ) {
      stateStatus = ELogicResStatusCode.BAD;
    } else if (
      cStt === ELogicResStatusCode.WARNING ||
      nStt >= ELogicResStatusCode.WARNING
    ) {
      stateStatus = ELogicResStatusCode.WARNING;
    } else {
      stateStatus = ELogicResStatusCode.SUCCESS;
    }
    return stateStatus;
  }
  /**
   * @returns el estado de respuesta reducido
   * segun criterio de este modulo
   */
  public static getControlReduceStatusResponse(
    cStt: ELogicResStatusCode,
    nStt: ELogicResStatusCode
  ): ELogicResStatusCode {
    let stateStatus: ELogicResStatusCode;
    if (
      cStt === ELogicResStatusCode.ERROR ||
      nStt >= ELogicResStatusCode.ERROR
    ) {
      stateStatus = ELogicResStatusCode.ERROR;
    } else if (
      cStt === ELogicResStatusCode.BAD ||
      nStt >= ELogicResStatusCode.BAD
    ) {
      stateStatus = ELogicResStatusCode.BAD;
    } else if (
      cStt === ELogicResStatusCode.WARNING ||
      nStt >= ELogicResStatusCode.WARNING
    ) {
      stateStatus = ELogicResStatusCode.WARNING;
    } else {
      stateStatus = ELogicResStatusCode.SUCCESS;
    }
    return stateStatus;
  }
}
