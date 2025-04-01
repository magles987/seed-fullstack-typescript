import {
  TPrimitiveLocalRepositoryCustomQueryDriverFn,
  TStructureLocalRepositoryCustomQueryDriverFn,
} from "../shared";
import { CookieDriver } from "./cookie-driver";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**Tipo de función especial para el driver */
export type TPrimitiveCookieCustomQueryDriverFn<TValue> =
  TPrimitiveLocalRepositoryCustomQueryDriverFn<CookieDriver, TValue>;
/**Tipo de función especial para el driver */
export type TStructureCookieCustomQueryDriverFn<TModel> =
  TStructureLocalRepositoryCustomQueryDriverFn<CookieDriver, TModel>;
