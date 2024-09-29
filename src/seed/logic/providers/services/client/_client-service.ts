import { IPrimitiveBag, IStructureBag } from "../../../bag-module/shared";
import { TKeyLogicContext } from "../../../config/shared-modules";
import { Service } from "../_service";
import { IServiceRequestConfig } from "../shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**... */
export abstract class ClientService extends Service {
  public static override readonly getDefault = () => {
    const superDF = Service.getDefault();
    return {
      ...superDF,
      client: {
        ...(superDF.client as any),
      },
    } as IServiceRequestConfig;
  };
  /**
   * @param _keyLogicContext contexto lógico (estructural o primitivo)
   * @param _keySrc indentificadora del recurso asociado a modulo
   */
  constructor(keyLogicContext: TKeyLogicContext, keySrc: string) {
    super(keyLogicContext, keySrc);
  }
  protected override getDefault() {
    return ClientService.getDefault();
  }
}
