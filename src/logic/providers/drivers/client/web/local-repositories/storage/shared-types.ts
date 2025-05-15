import {
  TPrimitiveLocalRepositoryCustomQueryDriverFn,
  TStructureLocalRepositoryCustomQueryDriverFn,
} from "../shared-types";
import { StorageDriver } from "./storage-driver";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**Tipo de función especial para el driver */
export type TPrimitiveLocalStorageCustomQueryDriverFn<TValue> =
  TPrimitiveLocalRepositoryCustomQueryDriverFn<StorageDriver, TValue>;
/**Tipo de función especial para el driver */
export type TStructureLocalStorageCustomQueryDriverFn<TModel> =
  TStructureLocalRepositoryCustomQueryDriverFn<StorageDriver, TModel>;
/**entornos de almacenamiento */
export type TStorageType = "local" | "session";
/** */
export type TTStorageDriverBaseConfig = [
  string,
  Partial<ReturnType<StorageDriver["getDefault"]>>? //debe ser opcional
];
