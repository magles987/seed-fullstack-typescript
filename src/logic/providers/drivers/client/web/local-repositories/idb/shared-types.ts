import {
  TPrimitiveLocalRepositoryCustomQueryDriverFn,
  TStructureLocalRepositoryCustomQueryDriverFn,
} from "../shared-types";
import { IdbDriver } from "./idb-driver";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**Tipo de función especial para el driver */
export type TPrimitiveLocalIdbCustomQueryDriverFn<TValue> =
  TPrimitiveLocalRepositoryCustomQueryDriverFn<IdbDriver, TValue>;
/**Tipo de función especial para el driver */
export type TStructureLocalIdbCustomQueryDriverFn<TModel> =
  TStructureLocalRepositoryCustomQueryDriverFn<IdbDriver, TModel>;
/** */
export type TTIdbDriverBaseConfig = [
  string,
  Partial<ReturnType<IdbDriver["getDefault"]>>? //debe ser opcional
];
