import lodash from "lodash";
import {
  IModAction,
  IReadAction,
} from "../../../../../controllers/_shared-primitive-REST";
import {
  IPrimitiveModifyCriteria,
  IPrimitiveReadCriteria,
} from "../../../../../criterias/_shared-primitive";
import {
  ELogicCodeError,
  LogicError,
} from "../../../../../../../errors/logic-error";
import { Model } from "../../../../../../../models/_model";
import { LocalStorageRepository } from "./_local-storage-repository";
import { PrimitiveRegistersHandler } from "../_registers-handler";
import { TActionFn } from "../_local-repository";
import {
  TKeyPrimitiveModifyRequestController,
  TKeyPrimitiveReadRequestController,
} from "../../../../../../../controllers/_primitive-ctrl";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**claves identificadoras de todas las acciones de request */
type TKeyFullRequest =
  | TKeyPrimitiveReadRequestController
  | TKeyPrimitiveModifyRequestController;
/** */
export type Trf_PrimitiveLocalStorageRepository =
  PrimitiveLocalStorageRepository<any>;

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *selfcontructor*
 *
 * ...
 */
export class PrimitiveLocalStorageRepository<
    TKeyActionRequest extends TKeyFullRequest
  >
  extends LocalStorageRepository<TKeyActionRequest>
  implements
    ReturnType<
      PrimitiveLocalStorageRepository<TKeyActionRequest>["getDefault"]
    >,
    Record<TKeyFullRequest, TActionFn>
{
  public static override readonly getDefault = () => {
    const superDf = LocalStorageRepository.getDefault();
    return {
      ...superDf,
      //...aqui las propiedades
    };
  };
  protected static override readonly getCONSTANTS = () => {
    const superCONST = LocalStorageRepository.getCONSTANTS();
    return {
      ...superCONST,
      //..aqui las constantes
    };
  };

  /**
   * @param base objeto literal con valores personalizados para iniicalizar las propiedades
   * @param isInit `= true` ❕Solo para herencia❕, indica si esta clase debe iniciar las propiedaes
   */
  constructor(
    base: Partial<
      ReturnType<
        PrimitiveLocalStorageRepository<TKeyActionRequest>["getDefault"]
      >
    > = {},
    isInit = true
  ) {
    super("primitive", base, false);
    if (isInit) this.initProps(base);
  }
  protected override getDefault() {
    return PrimitiveLocalStorageRepository.getDefault();
  }
  protected override getCONST() {
    return PrimitiveLocalStorageRepository.getCONSTANTS();
  }

  //❗normalmente definidas en el padre, salvo que se quieran sobreescribir❗
  // /**reinicia una propiedad al valor predefinido
  //  *
  //  * @param key clave identificadora de la propiedad a reiniciar
  //  */
  // public override resetPropByKey(key: keyof ReturnType<PrimitiveLocalStorageRepository<TKeyActionRequest>["getDefault"]>): void {
  //   const df = this.getDefault();
  //   this[key] = df[key];
  //   return;
  // }
}
