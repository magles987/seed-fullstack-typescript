import {
  GenericLibraryLocalRepositoryQueryFn,
  PrimitiveLibraryLocalRepositoryQueryFn,
  StructureLibraryLocalRepositoryQueryFn,
} from "../library-local-repository-query-fn";
import { StorageRepository } from "./storage-repository";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *Singleton*
 *
 * ...
 */
export class GenericLibraryStorageQueryFn<
  TModelOrValue
> extends GenericLibraryLocalRepositoryQueryFn<
  TModelOrValue,
  StorageRepository
> {
  /**  Almacena la instancia única de esta clase */
  private static GenericLibraryStorageQueryFn_instance: GenericLibraryStorageQueryFn<any>;
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
  >(): GenericLibraryStorageQueryFn<TModelOrValue> {
    GenericLibraryStorageQueryFn.GenericLibraryStorageQueryFn_instance =
      typeof GenericLibraryStorageQueryFn.GenericLibraryStorageQueryFn_instance ===
        "object" &&
      GenericLibraryStorageQueryFn.GenericLibraryStorageQueryFn_instance !==
        null
        ? GenericLibraryStorageQueryFn.GenericLibraryStorageQueryFn_instance
        : new GenericLibraryStorageQueryFn();
    return GenericLibraryStorageQueryFn.GenericLibraryStorageQueryFn_instance;
  }
}
/** *Singleton*
 *
 * ...
 */
export class PrimitiveLibraryStorageQueryFn<
  TValue
> extends PrimitiveLibraryLocalRepositoryQueryFn<StorageRepository, TValue> {
  /**  Almacena la instancia única de esta clase */
  private static PrimitiveLibraryStorageQueryFn_instance: PrimitiveLibraryStorageQueryFn<any>;
  /**
   * descrip...
   *
   */
  protected constructor() {
    super();
  }
  /** @returns la instancia única de la clase*/
  public static getInstance(): PrimitiveLibraryStorageQueryFn<any> {
    PrimitiveLibraryStorageQueryFn.PrimitiveLibraryStorageQueryFn_instance =
      typeof PrimitiveLibraryStorageQueryFn.PrimitiveLibraryStorageQueryFn_instance ===
        "object" &&
      PrimitiveLibraryStorageQueryFn.PrimitiveLibraryStorageQueryFn_instance !==
        null
        ? PrimitiveLibraryStorageQueryFn.PrimitiveLibraryStorageQueryFn_instance
        : new PrimitiveLibraryStorageQueryFn();
    return PrimitiveLibraryStorageQueryFn.PrimitiveLibraryStorageQueryFn_instance;
  }
}
/** *Singleton*
 *
 * ...
 */
export class StructureLibraryStorageQueryFn<
  TModel
> extends StructureLibraryLocalRepositoryQueryFn<StorageRepository, TModel> {
  /**  Almacena la instancia única de esta clase */
  private static StructureLibraryStorageQueryFn_instance: StructureLibraryStorageQueryFn<any>;
  /**
   * descrip...
   *
   */
  protected constructor() {
    super();
  }
  /** @returns la instancia única de la clase*/
  public static getInstance(): StructureLibraryStorageQueryFn<any> {
    StructureLibraryStorageQueryFn.StructureLibraryStorageQueryFn_instance =
      typeof StructureLibraryStorageQueryFn.StructureLibraryStorageQueryFn_instance ===
        "object" &&
      StructureLibraryStorageQueryFn.StructureLibraryStorageQueryFn_instance !==
        null
        ? StructureLibraryStorageQueryFn.StructureLibraryStorageQueryFn_instance
        : new StructureLibraryStorageQueryFn();
    return StructureLibraryStorageQueryFn.StructureLibraryStorageQueryFn_instance;
  }
}
