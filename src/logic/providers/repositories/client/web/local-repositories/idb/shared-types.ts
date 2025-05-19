import {
  IGenericRepositoryCriteria,
  TPrimitiveLiteralCriteriaUnion,
  TStructureLiteralCriteriaUnion,
} from "../../../../../../criterias/shared-types";
import { TLocalRepositoryCustomQueryRepositoryFn } from "../shared-types";
import { IdbRepository } from "./idb-repository";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**Tipo de función especial para el repository */
export type TGenericLocalIdbCustomQueryRepositoryFn<TValue> =
  TLocalRepositoryCustomQueryRepositoryFn<
    TValue,
    IdbRepository,
    IGenericRepositoryCriteria
  >;
/**Tipo de función especial para el repository */
export type TPrimitiveLocalIdbCustomQueryRepositoryFn<TValue> =
  TLocalRepositoryCustomQueryRepositoryFn<
    TValue,
    IdbRepository,
    TPrimitiveLiteralCriteriaUnion
  >;
/**Tipo de función especial para el repository */
export type TStructureLocalIdbCustomQueryRepositoryFn<TModel> =
  TLocalRepositoryCustomQueryRepositoryFn<
    TModel,
    IdbRepository,
    TStructureLiteralCriteriaUnion<TModel>
  >;
/** */
export type TTIdbRepositoryBaseConfig = [
  string,
  Partial<ReturnType<IdbRepository["getDefault"]>>? //debe ser opcional
];
