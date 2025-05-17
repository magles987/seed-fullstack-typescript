import {
  GenericLibraryLocalRepositoryQueryFn,
  PrimitiveLibraryLocalRepositoryQueryFn,
  StructureLibraryLocalRepositoryQueryFn,
} from "../library-local-repository-query-fn";
import { CookieDriver } from "./cookie-driver";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *Singleton*
 *
 * ...
 */
export class GenericLibraryCookieQueryFn<
  TModelOrValue
> extends GenericLibraryLocalRepositoryQueryFn<TModelOrValue, CookieDriver> {
  /**  Almacena la instancia única de esta clase */
  private static GenericLibraryCookieQueryFn_instance: GenericLibraryCookieQueryFn<any>;
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
  >(): GenericLibraryCookieQueryFn<TModelOrValue> {
    GenericLibraryCookieQueryFn.GenericLibraryCookieQueryFn_instance =
      typeof GenericLibraryCookieQueryFn.GenericLibraryCookieQueryFn_instance ===
        "object" &&
      GenericLibraryCookieQueryFn.GenericLibraryCookieQueryFn_instance !== null
        ? GenericLibraryCookieQueryFn.GenericLibraryCookieQueryFn_instance
        : new GenericLibraryCookieQueryFn();
    return GenericLibraryCookieQueryFn.GenericLibraryCookieQueryFn_instance;
  }
}
/** *Singleton*
 *
 * ...
 */
export class PrimitiveLibraryCookieQueryFn<
  TValue
> extends PrimitiveLibraryLocalRepositoryQueryFn<TValue, CookieDriver> {
  /**  Almacena la instancia única de esta clase */
  private static PrimitiveLibraryCookieQueryFn_instance: PrimitiveLibraryCookieQueryFn<any>;
  /**
   * descrip...
   *
   */
  protected constructor() {
    super();
  }
  /** @returns la instancia única de la clase*/
  public static getInstance(): PrimitiveLibraryCookieQueryFn<any> {
    PrimitiveLibraryCookieQueryFn.PrimitiveLibraryCookieQueryFn_instance =
      typeof PrimitiveLibraryCookieQueryFn.PrimitiveLibraryCookieQueryFn_instance ===
        "object" &&
      PrimitiveLibraryCookieQueryFn.PrimitiveLibraryCookieQueryFn_instance !==
        null
        ? PrimitiveLibraryCookieQueryFn.PrimitiveLibraryCookieQueryFn_instance
        : new PrimitiveLibraryCookieQueryFn();
    return PrimitiveLibraryCookieQueryFn.PrimitiveLibraryCookieQueryFn_instance;
  }
}
/** *Singleton*
 *
 * ...
 */
export class StructureLibraryCookieQueryFn<
  TModel
> extends StructureLibraryLocalRepositoryQueryFn<TModel, CookieDriver> {
  /**  Almacena la instancia única de esta clase */
  private static StructureLibraryCookieQueryFn_instance: StructureLibraryCookieQueryFn<any>;
  /**
   * descrip...
   *
   */
  protected constructor() {
    super();
  }
  /** @returns la instancia única de la clase*/
  public static getInstance(): StructureLibraryCookieQueryFn<any> {
    StructureLibraryCookieQueryFn.StructureLibraryCookieQueryFn_instance =
      typeof StructureLibraryCookieQueryFn.StructureLibraryCookieQueryFn_instance ===
        "object" &&
      StructureLibraryCookieQueryFn.StructureLibraryCookieQueryFn_instance !==
        null
        ? StructureLibraryCookieQueryFn.StructureLibraryCookieQueryFn_instance
        : new StructureLibraryCookieQueryFn();
    return StructureLibraryCookieQueryFn.StructureLibraryCookieQueryFn_instance;
  }
}
