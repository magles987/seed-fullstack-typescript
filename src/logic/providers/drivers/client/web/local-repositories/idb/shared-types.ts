import {
  IGenericDriverCriteria,
  TPrimitiveLiteralCriteriaUnion,
  TStructureLiteralCriteriaUnion,
} from "../../../../../../criterias/shared-types";
import { TLocalRepositoryCustomQueryDriverFn } from "../shared-types";
import { IdbDriver } from "./idb-driver";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**Tipo de función especial para el driver */
export type TGenericLocalIdbCustomQueryDriverFn<TValue> =
  TLocalRepositoryCustomQueryDriverFn<
    TValue,
    IdbDriver,
    IGenericDriverCriteria
  >;
/**Tipo de función especial para el driver */
export type TPrimitiveLocalIdbCustomQueryDriverFn<TValue> =
  TLocalRepositoryCustomQueryDriverFn<
    TValue,
    IdbDriver,
    TPrimitiveLiteralCriteriaUnion
  >;
/**Tipo de función especial para el driver */
export type TStructureLocalIdbCustomQueryDriverFn<TModel> =
  TLocalRepositoryCustomQueryDriverFn<
    TModel,
    IdbDriver,
    TStructureLiteralCriteriaUnion<TModel>
  >;
/** */
export type TTIdbDriverBaseConfig = [
  string,
  Partial<ReturnType<IdbDriver["getDefault"]>>? //debe ser opcional
];
