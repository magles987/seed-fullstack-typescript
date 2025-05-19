import {
  IGenericRepositoryCriteria,
  TPrimitiveLiteralCriteriaUnion,
  TStructureLiteralCriteriaUnion,
} from "../../../../../../criterias/shared-types";
import { TLocalRepositoryCustomQueryRepositoryFn } from "../shared-types";
import { StorageRepository } from "./storage-repository";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**Tipo de función especial para el repository */
export type TGenericLocalStorageCustomQueryRepositoryFn<TValue> =
  TLocalRepositoryCustomQueryRepositoryFn<
    TValue,
    StorageRepository,
    IGenericRepositoryCriteria
  >;
/**Tipo de función especial para el repository */
export type TPrimitiveLocalStorageCustomQueryRepositoryFn<TValue> =
  TLocalRepositoryCustomQueryRepositoryFn<
    TValue,
    StorageRepository,
    TPrimitiveLiteralCriteriaUnion
  >;
/**Tipo de función especial para el repository */
export type TStructureLocalStorageCustomQueryRepositoryFn<TModel> =
  TLocalRepositoryCustomQueryRepositoryFn<
    TModel,
    StorageRepository,
    TStructureLiteralCriteriaUnion<TModel>
  >;
/**entornos de almacenamiento */
export type TStorageType = "local" | "session";
/** */
export type TTStorageRepositoryBaseConfig = [
  string,
  Partial<ReturnType<StorageRepository["getDefault"]>>? //debe ser opcional
];
