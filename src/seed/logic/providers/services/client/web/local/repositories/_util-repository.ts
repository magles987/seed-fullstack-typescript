import { Util_Logic } from "../../../../../../util/util-logic";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *Singleton*
 *
 * ...
 */
export class Util_LocalRepository extends Util_Logic {
  /**  Almacena la instancia única de esta clase */
  private static Util_LocalRepository_instance: Util_LocalRepository;
  /** */
  constructor() {
    super();
  }
  /** devuelve la instancia única de esta clase
   * ya sea que la crea o la que ya a sido creada
   */
  public static getInstance(): Util_LocalRepository {
    Util_LocalRepository.Util_LocalRepository_instance =
      Util_LocalRepository.Util_LocalRepository_instance === undefined ||
      Util_LocalRepository.Util_LocalRepository_instance == null
        ? new Util_LocalRepository()
        : Util_LocalRepository.Util_LocalRepository_instance;
    return Util_LocalRepository.Util_LocalRepository_instance;
  }
}
