import {
  TPrimitiveLiteralCriteriaUnion,
  TStructureLiteralCriteriaUnion,
} from "../../../shared-types";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**Tipo de función especial para el driver */
export type TPrimitiveLocalRepositoryCustomQueryDriverFn<
  TDriverInstance,
  TValue
> = (
  thisDriver: TDriverInstance,
  literalCriteria: TPrimitiveLiteralCriteriaUnion,
  registers: TValue[]
) => Promise<any>;
/**Tipo de función especial para el driver */
export type TStructureLocalRepositoryCustomQueryDriverFn<
  TDriverInstance,
  TModel
> = (
  thisDriver: TDriverInstance,
  literalCriteria: TStructureLiteralCriteriaUnion<TModel>,
  registers: TModel[]
) => Promise<any>;
