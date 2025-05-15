import { ClientDriver } from "../_client-driver";
import { TKeyGroupDriver as TKeyDriver } from "./shared-types";
import { TKeyDriverPrefix as TSuperKeyPrefix } from "../shared-types"; //❗Desde el padre❗
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████

/** *selfcontructor*
 *
 * ...
 */
export abstract class AppDriver
  extends ClientDriver
  implements ReturnType<AppDriver["getDefault"]>
{
  public static override readonly getDefault = () => {
    const superDf = ClientDriver.getDefault();
    return {
      ...superDf,
      //...aquí las propiedades
      // exampleField: "hello", //tipo string dedicudo
    };
  };
  protected static override readonly getCONSTANTS = () => {
    const superCONST = ClientDriver.getCONSTANTS();
    return {
      ...superCONST,
    };
  };
  /**
   * @param keyLogicDriver clave identificadora del driver.
   * @param base objeto literal con valores personalizados para inicializar las propiedades
   * @param isInit `= true` ❕Solo para herencia❕, indica si esta clase debe iniciar las propiedaes
   */
  constructor(
    keyLogicDriver: TKeyDriver,
    base: Partial<ReturnType<AppDriver["getDefault"]>> = {},
    isInit = true
  ) {
    super(`${"client-" as TSuperKeyPrefix}${keyLogicDriver}`, base, false);
    if (isInit) this.initProps(base);
  }
  protected override getDefault() {
    return AppDriver.getDefault();
  }
  protected override getCONST() {
    return AppDriver.getCONSTANTS();
  }

  //❗normalmente definidas en el padre, salvo que se quieran sobreescribir❗
  // /**inicializa las propiedades de manera dinamica
  //  *
  //  * @param base objeto literal con valores personalizados para iniicalizar las propiedades
  //  */
  // protected override initProps(base: Partial<ReturnType<AppDriver["getDefault"]>>): void {
  //   for (const key in this.getDefault()) {
  //     this[key] = base[key];
  //   }
  //   return;
  // }
  // /**reinicia una propiedad al valor predefinido
  //  *
  //  * @param key clave identificadora de la propiedad a reiniciar
  //  */
  // public override resetPropByKey(key: keyof ReturnType<AppDriver["getDefault"]>): void {
  //   const df = this.getDefault();
  //   this[key] = df[key];
  //   return;
  // }
  public override mutateProps(
    base: Partial<ReturnType<AppDriver["getDefault"]>>
  ): void {
    super.mutateProps(base);
    return;
  }
  public override getLiteral(): ReturnType<AppDriver["getDefault"]> {
    return super.getLiteral() as any;
  }
}
