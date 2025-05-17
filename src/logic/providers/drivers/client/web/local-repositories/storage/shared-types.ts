import {
  IGenericDriverCriteria,
  TPrimitiveLiteralCriteriaUnion,
  TStructureLiteralCriteriaUnion,
} from "../../../../../../criterias/shared-types";
import { TLocalRepositoryCustomQueryDriverFn } from "../shared-types";
import { StorageDriver } from "./storage-driver";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**Tipo de función especial para el driver */
export type TGenericLocalStorageCustomQueryDriverFn<TValue> =
  TLocalRepositoryCustomQueryDriverFn<
    TValue,
    StorageDriver,
    IGenericDriverCriteria
  >;
/**Tipo de función especial para el driver */
export type TPrimitiveLocalStorageCustomQueryDriverFn<TValue> =
  TLocalRepositoryCustomQueryDriverFn<
    TValue,
    StorageDriver,
    TPrimitiveLiteralCriteriaUnion
  >;
/**Tipo de función especial para el driver */
export type TStructureLocalStorageCustomQueryDriverFn<TModel> =
  TLocalRepositoryCustomQueryDriverFn<
    TModel,
    StorageDriver,
    TStructureLiteralCriteriaUnion<TModel>
  >;
/**entornos de almacenamiento */
export type TStorageType = "local" | "session";
/** */
export type TTStorageDriverBaseConfig = [
  string,
  Partial<ReturnType<StorageDriver["getDefault"]>>? //debe ser opcional
];
