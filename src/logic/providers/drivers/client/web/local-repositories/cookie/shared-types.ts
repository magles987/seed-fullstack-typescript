import {
  IGenericDriverCriteria,
  TPrimitiveLiteralCriteriaUnion,
  TStructureLiteralCriteriaUnion,
} from "../../../../../../criterias/shared-types";
import { TLocalRepositoryCustomQueryDriverFn } from "../shared-types";
import { CookieDriver } from "./cookie-driver";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**Tipo de función especial para el driver */
export type TGenericCookieCustomQueryDriverFn<TValue> =
  TLocalRepositoryCustomQueryDriverFn<
    TValue,
    CookieDriver,
    IGenericDriverCriteria
  >;
/**Tipo de función especial para el driver */
export type TPrimitiveCookieCustomQueryDriverFn<TValue> =
  TLocalRepositoryCustomQueryDriverFn<
    TValue,
    CookieDriver,
    TPrimitiveLiteralCriteriaUnion
  >;
/**Tipo de función especial para el driver */
export type TStructureCookieCustomQueryDriverFn<TModel> =
  TLocalRepositoryCustomQueryDriverFn<
    TModel,
    CookieDriver,
    TStructureLiteralCriteriaUnion<TModel>
  >;
/** */
export type TTCookieDriverBaseConfig = [
  string,
  Partial<ReturnType<CookieDriver["getDefault"]>>? //debe ser opcional
];
