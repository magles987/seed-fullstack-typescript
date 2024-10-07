import { HandlerModule } from "../../config/module";
import {
  IBagForService,
  IGenericDriver,
  IGenericService,
  IServiceRequestConfig,
} from "./shared";
import { ELogicCodeError, LogicError } from "../../errors/logic-error";
import { Util_Service } from "./_util-service";
import {
  EKeyActionGroupForRes,
  ELogicResStatusCode,
  IPrimitiveResponse,
  IResponse,
  IStructureResponse,
} from "../../reports/shared";
import { TKeyLogicContext } from "../../config/shared-modules";
import { StructureReportHandler } from "../../reports/structure-report-handler";
import { PrimitiveReportHandler } from "../../reports/primitive-report-handler";
import {
  IBagModule,
  IPrimitiveBag,
  IStructureBag,
} from "../../bag-module/shared";
import {
  IPrimitiveModifyCriteria,
  IPrimitiveReadCriteria,
  IStructureModifyCriteria,
  IStructureReadCriteria,
} from "../../criterias/shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**refactorizacion de la clase */
export type Trf_LogicService = LogicService;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**
 * descrip...
 *
 */
export abstract class LogicService
  extends HandlerModule
  implements IGenericService
{
  /** configuracion predefinida para el manejador */
  public static readonly getDefault = () => {
    return {
      client: {},
      server: {},
    } as IServiceRequestConfig;
  };
  // private _reportPrimitiveHandler: PrimitiveReportHandler;
  // protected get reportPrimitiveHandler(): PrimitiveReportHandler {
  //   return this._reportPrimitiveHandler;
  // }
  // private _reportStructureHandler: StructureReportHandler;
  // protected get reportStructureHandler(): StructureReportHandler {
  //   return this._reportStructureHandler;
  // }
  private _fullConfig: IServiceRequestConfig;
  /**esquema completo de configuracion de servicio */
  protected get fullConfig(): IServiceRequestConfig {
    return this._fullConfig;
  }
  /**esquema completo de configuracion de servicio */
  protected set fullConfig(fullConfig: IServiceRequestConfig) {
    const util = Util_Service.getInstance();
    //❗solo puede asignarse una vez❗
    if (util.isObject(this._fullConfig)) return;
    this._fullConfig = fullConfig;
  }
  /**esquema de configuracion segun el contexto del servicio*/
  protected abstract get config(): unknown;
  /** utilidades */
  protected util = Util_Service.getInstance();
  /**
   * @param _keyLogicContext contexto lógico (estructural o primitivo)
   * @param _keySrc indentificadora del recurso asociado a modulo
   */
  constructor(keyLogicContext: TKeyLogicContext, keySrc: string) {
    super("service", keyLogicContext, keySrc);
  }
  protected override getDefault() {
    return LogicService.getDefault();
  }
  /**ejecutar la peticion en el servicio */
  public async runRequestFromService(
    iBag: IBagModule<any>
  ): Promise<IResponse> {
    let res: IResponse;
    if (this.keyLogicContext === "primitive") {
      const iPrimitiveBag = iBag as IPrimitiveBag<any>;
      const rH = this.buildPrimitiveReportHandler(iPrimitiveBag);
      res = await this.runRequestForPrimitive(iPrimitiveBag);
    } else if (this.keyLogicContext === "structure") {
      const iStructureBag = iBag as IStructureBag<any>;
      const rH = this.buildStructureReportHandler(iStructureBag);
      res = await this.runRequestForStructure(iStructureBag);
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${this.keyLogicContext} is not key logic context valid `,
      });
    }
    return res;
  }
  /**... */
  protected abstract buildConfig(
    fullConfigBase: Partial<IServiceRequestConfig>,
    customDeepConfig: unknown
  ): IServiceRequestConfig;
  /**construye una instancia de driver*/
  protected abstract buildDriver(): IGenericDriver<any>;
  /**ejecutar la peticion del servicio en contexto *primitive* para lectura */
  /**convierte el bag literal completo a un bag especifico para el servicio*/
  protected convertBagToBagService(
    iBag: IPrimitiveBag<any> | IStructureBag<any>
  ) {
    const bagService: IBagForService = {
      data: iBag.data,
      literalCriteria: iBag.literalCriteria,
    };
    return bagService;
  }
  /**construye un reporte de manejador de respuesta para este modulo
   *
   * @param iBag objeto literal con la configuracion final
   * para transmitir la peticion
   *
   * @returns instancia del reporte de manejador de respuesta
   */
  public buildPrimitiveReportHandler(
    iBag: IPrimitiveBag<any>
  ): PrimitiveReportHandler {
    const { data, literalCriteria } = iBag;
    const { keyActionRequest, type, modifyType, keySrc } =
      literalCriteria as IPrimitiveReadCriteria & IPrimitiveModifyCriteria;
    let rH = new PrimitiveReportHandler(this.keySrc, {
      keyRepModule: this.keyModule as any,
      keyRepModuleContext: "primitiveService",
      keyRepLogicContext: this.keyLogicContext,
      keyActionRequest,
      keyAction: EKeyActionGroupForRes.servicePrimitive,
      keyTypeRequest: type,
      keyModifyTypeRequest: modifyType,
      keyLogic: keySrc,
      keyRepSrc: keySrc,
      status: ELogicResStatusCode.VALID_DATA,
      tolerance: ELogicResStatusCode.INVALID_DATA,
      data,
    });
    return rH;
  }
  /**construye un reporte de manejador de respuesta para este modulo
   *
   * @param iBag objeto literal con la configuracion final
   * para transmitir la peticion
   *
   * @returns instancia del reporte de manejador de respuesta
   */
  public buildStructureReportHandler(
    iBag: IStructureBag<any>
  ): StructureReportHandler {
    const { data, literalCriteria, keyPath } = iBag;
    const { keyActionRequest, type, modifyType, keySrc } =
      literalCriteria as IStructureReadCriteria<any> &
        IStructureModifyCriteria<any>;
    let rH = new StructureReportHandler(this.keySrc, {
      keyRepModule: this.keyModule as any,
      keyRepModuleContext: "structureService",
      keyRepLogicContext: this.keyLogicContext,
      keyActionRequest,
      keyAction: EKeyActionGroupForRes.serviceStructure,
      keyTypeRequest: type,
      keyModifyTypeRequest: modifyType,
      keyPath,
      keyLogic: this.util.getKeyLogicByKeyPath(keyPath),
      keyRepSrc: keySrc,
      status: ELogicResStatusCode.VALID_DATA,
      tolerance: ELogicResStatusCode.INVALID_DATA,
      data,
    });
    return rH;
  }
  public abstract runRequestForPrimitive(
    iBag: IPrimitiveBag<any>
  ): Promise<IPrimitiveResponse>;
  /**ejecutar la peticion del servicio en contexto *structure* para lectura */
  public abstract runRequestForStructure(
    iBag: IStructureBag<any>
  ): Promise<IStructureResponse>;
  /**... */
  protected abstract adaptDriverResponseToPrimitiveLogicResponse(
    driverResponse: unknown,
    option: unknown
  ): IPrimitiveResponse;
  /**... */
  protected abstract adaptDriverResponseToStructureLogicResponse(
    driverResponse: unknown,
    option: unknown
  ): IStructureResponse;
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
