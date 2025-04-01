import {
  IPrimitiveBagForDriver,
  IStructureBagForDriver,
} from "../../../shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**Tipo de función especial para el driver */
export type TPrimitiveLocalRepositoryCustomQueryDriverFn<
  TDriverInstance,
  TValue
> = (
  thisDriver: TDriverInstance,
  literalBag: IPrimitiveBagForDriver,
  registers: TValue[]
) => Promise<any>;
/**Tipo de función especial para el driver */
export type TStructureLocalRepositoryCustomQueryDriverFn<
  TDriverInstance,
  TModel
> = (
  thisDriver: TDriverInstance,
  literalBag: IStructureBagForDriver<TModel>,
  registers: TModel[]
) => Promise<any>;
