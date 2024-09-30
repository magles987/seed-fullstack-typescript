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
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**refactorizacion de la clase */
export type Trf_Service = Service;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**
 * descrip...
 *
 */
export abstract class Service extends HandlerModule implements IGenericService {
  /** configuracion predefinida para el manejador */
  public static readonly getDefault = () => {
    return {
      client: {},
      server: {},
    } as IServiceRequestConfig;
  };
  private _reportPrimitiveHandler: PrimitiveReportHandler;
  protected get reportPrimitiveHandler(): PrimitiveReportHandler {
    return this._reportPrimitiveHandler;
  }
  private _reportStructureHandler: StructureReportHandler;
  protected get reportStructureHandler(): StructureReportHandler {
    return this._reportStructureHandler;
  }
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
    this._reportPrimitiveHandler = new PrimitiveReportHandler(this.keySrc, {
      keyModule: this.keyModule,
      keyModuleContext: "primitiveService",
      status: ELogicResStatusCode.VALID_DATA,
      tolerance: ELogicResStatusCode.INVALID_DATA,
    });
    this._reportStructureHandler = new StructureReportHandler(this.keySrc, {
      keyModule: this.keyModule,
      keyModuleContext: "structureService",
      status: ELogicResStatusCode.VALID_DATA,
      tolerance: ELogicResStatusCode.INVALID_DATA,
    });
  }
  protected override getDefault() {
    return Service.getDefault();
  }
  /**ejecutar la peticion en el servicio */
  public async runRequestFromService(
    iBag: IBagModule<any>
  ): Promise<IResponse> {
    if (this.keyLogicContext === "primitive") {
      const iPrimitiveBag = iBag as IPrimitiveBag<any>;
      return await this.runRequestForPrimitive(iPrimitiveBag);
    } else if (this.keyLogicContext === "structure") {
      const iStructureBag = iBag as IStructureBag<any>;
      return await this.runRequestForStructure(iStructureBag);
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${this.keyLogicContext} is not key logic context valid `,
      });
    }
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
}
