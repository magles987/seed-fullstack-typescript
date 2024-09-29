import lodash from "lodash";
import {
  IModAction,
  IReadAction,
} from "../../../../../controllers/_shared-primitive";
import {
  IPrimitiveModifyCriteria,
  IPrimitiveReadCriteria,
} from "../../../../../criterias/_shared-primitive";
import {
  ELogicCodeError,
  LogicError,
} from "../../../../../../../errors/logic-error";
import { Model } from "../../../../../../../models/_model";
import { PrimitiveRegistersHandler } from "../_registers-handler";
import { TActionFn } from "../_local-repository";
import {
  LocalIDBRepository,
  IConfig as ISuperConfig,
  TProtectedKeyConfig as TSuperProtectedKeyConfig,
  TInitKeyConfig as TSuperInitKeyConfig,
  TPublicKeyConfig as TSuperPublicKeyConfig,
} from "./_local-idb-repository";
import {
  Tpl_TInitConfig,
  Tpl_TInitKeyConfig,
  Tpl_TProtectedKeyConfig,
  Tpl_TPublicConfig,
  Tpl_TPublicKeyConfig,
} from "../../../../../config/shared-config-class-module";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**Acciones de controlador CRUD */
interface IAction extends IModAction<TActionFn>, IReadAction<TActionFn> {}
/**Refactorizacion de la clase */
export type Trf_PrimitiveLocalIDBRepository = PrimitiveLocalIDBRepository;
/**esquema de configuracion general */
export interface IConfig extends ISuperConfig {}
/**Configuracion opcional y accesible
 * desde el exterior del modulo */
export type TProtectedKeyConfig = Tpl_TProtectedKeyConfig<
  IConfig,
  TSuperProtectedKeyConfig | ""
>;
/**propiedades de configuracion publicas y
 * **obligatorias** a asignar fuera de
 * la clase modularizada*/
export type TInitKeyConfig = Tpl_TInitKeyConfig<
  IConfig,
  TSuperInitKeyConfig | "",
  TProtectedKeyConfig
>;
/**propiedades de configuracion publicas y
 * **obligatorias** a asignar fuera de
 * la clase modularizada*/
export type TPublicKeyConfig = Tpl_TPublicKeyConfig<
  IConfig,
  TSuperPublicKeyConfig | "",
  TProtectedKeyConfig
>;
/**Configuracion inicial de esta clase
 * modularizada (semi opcional) */
export type TInitConfig = Tpl_TInitConfig<
  IConfig,
  TInitKeyConfig,
  TProtectedKeyConfig
>;
/**Configuracion publica de esta clase
 * modularizada (semi opcional) */
export type TPublicConfig = Tpl_TPublicConfig<
  IConfig,
  TPublicKeyConfig,
  TProtectedKeyConfig
>;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**
 * descrip...
 * ____
 * @extends
 *
 */
export class PrimitiveLocalIDBRepository
  extends LocalIDBRepository
  implements IAction
{
  protected override dataHandler = PrimitiveRegistersHandler.getInstance();
  protected static override readonly getDefault: () => IConfig = () => {
    const superDF = LocalIDBRepository.getDefault();
    return {
      ...superDF,
      logicContext: "primitive", //sobreasignacion interna
    };
  };
  /**
   * @param iConfig configuracion de
   * inicialización
   */
  constructor(iConfig: TInitConfig) {
    super(iConfig);
    this.initConfig(iConfig);
  }
  protected override getDefault() {
    return PrimitiveLocalIDBRepository.getDefault();
  }
  protected override initConfig(iConfig: TInitConfig) {
    if (!this.__isNotInit) return;
    if (this.__config === undefined) this.__config = this.getDefault();
    if (typeof iConfig != "object") return;
    super.initConfig(iConfig);
    this.setPublicConfig(iConfig, false);
  }
  public override setPublicConfig(pConfig: TPublicConfig, isUpCascade = true) {
    if (!this.util.isObject(pConfig)) return;
    if (isUpCascade) super.setPublicConfig(pConfig);
    const v = <IConfig>pConfig; //tipado real
  }
  protected override get config() {
    return <IConfig>this.__config;
  }
  protected override createAndSetSchemaConfig(
    keyCollection: string,
    keyPrimary: string
  ) {
    throw new Error("NO IMPLEMENTADO");
  }
}
