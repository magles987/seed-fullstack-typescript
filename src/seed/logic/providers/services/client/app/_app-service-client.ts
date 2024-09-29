import { IPrimitiveBag, IStructureBag } from "../../../../bag-module/shared";
import { TKeyLogicContext } from "../../../../config/shared-modules";
import { IServiceRequestConfig } from "../../shared";
import { ClientService } from "../_client-service";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *abstract*
 *
 * ...
 */
export abstract class AppClientService extends ClientService {
  public static override readonly getDefault = () => {
    const superDF = ClientService.getDefault();
    return {
      ...superDF,
      client: {
        ...(superDF.client as any),
        app: {
          ...(superDF.client.app as any),
        },
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
    return AppClientService.getDefault();
  }
  /**... */
  protected getPrimitiveAppClientServiceConfig(iBag: IPrimitiveBag<any>) {
    const config = this.getPrimitiveClientServiceConfig(iBag);
    const webConfig = this.util.isObject(config.web)
      ? config.web
      : AppClientService.getDefault().client.web; //❗Obligatorio el static❗
    return webConfig;
  }
  /**... */
  protected getStructureAppClientServiceConfig(iBag: IStructureBag<any>) {
    const config = this.getStructureClientServiceConfig(iBag);
    const webConfig = this.util.isObject(config.web)
      ? config.web
      : AppClientService.getDefault().client.web; //❗Obligatorio el static❗
    return webConfig;
  }
}
