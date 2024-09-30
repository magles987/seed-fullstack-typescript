import {
  TKeyPrimitiveModifyRequestController,
  TKeyPrimitiveReadRequestController,
} from "../../../../../../../controllers/_primitive-ctrl";
import { TActionFn } from "../shared";
import { LocalStaticRepository } from "./_local-static-repository";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**claves identificadoras de todas las acciones de request */
type TKeyFullRequest =
  | TKeyPrimitiveReadRequestController
  | TKeyPrimitiveModifyRequestController;
/**refactorizacion de la clase */
export type Trf_PrimitiveLocalStaticRepository =
  PrimitiveLocalStaticRepository<any>;
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *selfcontructor*
 *
 * ...
 */
export class PrimitiveLocalStaticRepository<
    TKeyActionRequest extends TKeyFullRequest
  >
  extends LocalStaticRepository<TKeyActionRequest>
  implements
    ReturnType<PrimitiveLocalStaticRepository<TKeyActionRequest>["getDefault"]>,
    Record<TKeyFullRequest, TActionFn>
{
  public static override readonly getDefault = () => {
    const superDf = LocalStaticRepository.getDefault();
    return {
      ...superDf,
      //...aqui las propiedades
    };
  };
  protected static override readonly getCONSTANTS = () => {
    const superCONST = LocalStaticRepository.getCONSTANTS();
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
        PrimitiveLocalStaticRepository<TKeyActionRequest>["getDefault"]
      >
    > = {},
    isInit = true
  ) {
    super("primitive", base, false);
    if (isInit) this.initProps(base);
  }
  protected override getDefault() {
    return PrimitiveLocalStaticRepository.getDefault();
  }
  protected override getCONST() {
    return PrimitiveLocalStaticRepository.getCONSTANTS();
  }

  //❗normalmente definidas en el padre, salvo que se quieran sobreescribir❗
  // /**reinicia una propiedad al valor predefinido
  //  *
  //  * @param key clave identificadora de la propiedad a reiniciar
  //  */
  // public override resetPropByKey(key: keyof ReturnType<PrimitiveLocalStaticRepository<TKeyActionRequest>["getDefault"]>): void {
  //   const df = this.getDefault();
  //   this[key] = df[key];
  //   return;
  // }
}
