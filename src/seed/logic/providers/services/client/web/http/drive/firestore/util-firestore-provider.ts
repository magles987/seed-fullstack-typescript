import { UtilProvider } from "../../../../../../_util-provider";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████

/** @info <hr>
 * *Singleton*
 *
 * utilidades para firestore
 * ____
 * @extends
 * ____
 */
export class UtilFirestoreProvider extends UtilProvider {
  /**
   * Almacena la instancia única de esta clase
   * ____
   */
  private static instance: UtilFirestoreProvider;
  /**
   * descrip...
   *
   * @param
   * ____
   */
  constructor() {
    super();
  }
  /**
   * devuelve la instancia única de esta clase
   * ya sea que la crea o la que ya a sido creada
   * ____
   */
  public static getInstance(): UtilFirestoreProvider {
    UtilFirestoreProvider.instance =
      !UtilFirestoreProvider.instance || UtilFirestoreProvider.instance == null
        ? new UtilFirestoreProvider()
        : UtilFirestoreProvider.instance;
    return UtilFirestoreProvider.instance;
  }

  /**
   * *public*
   * obtener el path de la coleccion o subcoleccion, en las
   * colecciones devuelve el mismo nom ya que son Raiz
   *
   * *Param:*
   * `modelMeta` : la metadata del modelo para
   * usar como referencia.
   * `pathBase` : path complemento para construir
   * el el path completoutil para las subcolecciones
   * ____
   */
  public getPathCollection(modelMeta: unknown, pathBase = ""): string {
    //en caso de recibir null
    if (pathBase == null) {
      pathBase = "";
    }

    //cast obligado:
    const mMeta = <ModelMetadata>modelMeta;

    const r =
      mMeta.__typeCollection == ETypeCollection.subCollection && pathBase != ""
        ? `${pathBase}/${mMeta.__nomColeccion}`
        : `${mMeta.__nomColeccion}`;

    return r;
  }
}
