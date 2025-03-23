import { TLocalRepositoryCustomQueryDriverFn } from "../shared";
import { StorageDriver } from "./storage-driver";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**Tipo de función especial para el driver */
export type TLocalStorageCustomQueryDriverFn =
  TLocalRepositoryCustomQueryDriverFn<StorageDriver>; /**define el tipo de almacenamiento a usar */
export type TStorageType = "local" | "session";
