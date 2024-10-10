import { TKeyLogicContext } from "../../../config/shared-modules";
import { LogicService } from "../_service";
import { IServiceRequestConfig } from "../shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**... */
export abstract class ClientService extends LogicService {
  public static override readonly getDefault = () => {
    const superDF = LogicService.getDefault();
    return {
      ...superDF,
      client: {
        ...(superDF.client as any),
      },
    } as IServiceRequestConfig;
  };
  /**
   * @param keyLogicContext contexto lógico (estructural o primitivo)
   * @param keySrc indentificadora del recurso asociado a modulo
   * @param keyDrive clave identificadora del drive a instanciar para este servicio
   */
  constructor(keyLogicContext: TKeyLogicContext, keySrc: string, keyDrive: unknown) {
    super(keyLogicContext, keySrc, keyDrive);
  }
  protected override getDefault() {
    return ClientService.getDefault();
  }
}
