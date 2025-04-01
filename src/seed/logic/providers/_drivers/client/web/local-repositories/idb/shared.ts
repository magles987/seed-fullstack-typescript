import {
  TPrimitiveLocalRepositoryCustomQueryDriverFn,
  TStructureLocalRepositoryCustomQueryDriverFn,
} from "../shared";
import { IdbDriver } from "./_idb-driver";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**Tipo de función especial para el driver */
export type TPrimitiveLocalIdbCustomQueryDriverFn<TValue> =
  TPrimitiveLocalRepositoryCustomQueryDriverFn<IdbDriver, TValue>;
/**Tipo de función especial para el driver */
export type TStructureLocalIdbCustomQueryDriverFn<TModel> =
  TStructureLocalRepositoryCustomQueryDriverFn<IdbDriver, TModel>;
