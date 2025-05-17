import {
  GenericLibraryLocalRepositoryQueryFn,
  PrimitiveLibraryLocalRepositoryQueryFn,
  StructureLibraryLocalRepositoryQueryFn,
} from "../library-local-repository-query-fn";
import { IdbDriver } from "./idb-driver";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *Singleton*
 *
 * ...
 */
export class GenericLibraryIdbQueryFn<
  TModelOrValue
> extends GenericLibraryLocalRepositoryQueryFn<TModelOrValue, IdbDriver> {
  /**  Almacena la instancia única de esta clase */
  private static GenericLibraryIdbQueryFn_instance: GenericLibraryIdbQueryFn<any>;
  /**
   * descrip...
   *
   */
  protected constructor() {
    super();
  }
  /** @returns la instancia única de la clase*/
  public static getInstance<
    TModelOrValue
  >(): GenericLibraryIdbQueryFn<TModelOrValue> {
    GenericLibraryIdbQueryFn.GenericLibraryIdbQueryFn_instance =
      typeof GenericLibraryIdbQueryFn.GenericLibraryIdbQueryFn_instance ===
        "object" &&
      GenericLibraryIdbQueryFn.GenericLibraryIdbQueryFn_instance !== null
        ? GenericLibraryIdbQueryFn.GenericLibraryIdbQueryFn_instance
        : new GenericLibraryIdbQueryFn();
    return GenericLibraryIdbQueryFn.GenericLibraryIdbQueryFn_instance;
  }
}
/** *Singleton*
 *
 * ...
 */
export class PrimitiveLibraryIdbQueryFn<
  TValue
> extends PrimitiveLibraryLocalRepositoryQueryFn<TValue, IdbDriver> {
  /**  Almacena la instancia única de esta clase */
  private static PrimitiveLibraryIdbQueryFn_instance: PrimitiveLibraryIdbQueryFn<any>;
  /**
   * descrip...
   *
   */
  protected constructor() {
    super();
  }
  /** @returns la instancia única de la clase*/
  public static getInstance(): PrimitiveLibraryIdbQueryFn<any> {
    PrimitiveLibraryIdbQueryFn.PrimitiveLibraryIdbQueryFn_instance =
      typeof PrimitiveLibraryIdbQueryFn.PrimitiveLibraryIdbQueryFn_instance ===
        "object" &&
      PrimitiveLibraryIdbQueryFn.PrimitiveLibraryIdbQueryFn_instance !== null
        ? PrimitiveLibraryIdbQueryFn.PrimitiveLibraryIdbQueryFn_instance
        : new PrimitiveLibraryIdbQueryFn();
    return PrimitiveLibraryIdbQueryFn.PrimitiveLibraryIdbQueryFn_instance;
  }
}
/** *Singleton*
 *
 * ...
 */
export class StructureLibraryIdbQueryFn<
  TModel
> extends StructureLibraryLocalRepositoryQueryFn<TModel, IdbDriver> {
  /**  Almacena la instancia única de esta clase */
  private static StructureLibraryIdbQueryFn_instance: StructureLibraryIdbQueryFn<any>;
  /**
   * descrip...
   *
   */
  protected constructor() {
    super();
  }
  /** @returns la instancia única de la clase*/
  public static getInstance(): StructureLibraryIdbQueryFn<any> {
    StructureLibraryIdbQueryFn.StructureLibraryIdbQueryFn_instance =
      typeof StructureLibraryIdbQueryFn.StructureLibraryIdbQueryFn_instance ===
        "object" &&
      StructureLibraryIdbQueryFn.StructureLibraryIdbQueryFn_instance !== null
        ? StructureLibraryIdbQueryFn.StructureLibraryIdbQueryFn_instance
        : new StructureLibraryIdbQueryFn();
    return StructureLibraryIdbQueryFn.StructureLibraryIdbQueryFn_instance;
  }
}
