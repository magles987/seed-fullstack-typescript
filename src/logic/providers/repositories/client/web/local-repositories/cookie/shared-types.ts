import {
  IGenericRepositoryCriteria,
  TPrimitiveLiteralCriteriaUnion,
  TStructureLiteralCriteriaUnion,
} from "../../../../../../criterias/shared-types";
import { TLocalRepositoryCustomQueryRepositoryFn } from "../shared-types";
import { CookieRepository } from "./cookie-repository";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**Tipo de función especial para el repository */
export type TGenericCookieCustomQueryRepositoryFn<TValue> =
  TLocalRepositoryCustomQueryRepositoryFn<
    TValue,
    CookieRepository,
    IGenericRepositoryCriteria
  >;
/**Tipo de función especial para el repository */
export type TPrimitiveCookieCustomQueryRepositoryFn<TValue> =
  TLocalRepositoryCustomQueryRepositoryFn<
    TValue,
    CookieRepository,
    TPrimitiveLiteralCriteriaUnion
  >;
/**Tipo de función especial para el repository */
export type TStructureCookieCustomQueryRepositoryFn<TModel> =
  TLocalRepositoryCustomQueryRepositoryFn<
    TModel,
    CookieRepository,
    TStructureLiteralCriteriaUnion<TModel>
  >;
/** */
export type TTCookieRepositoryBaseConfig = [
  string,
  Partial<ReturnType<CookieRepository["getDefault"]>>? //debe ser opcional
];
