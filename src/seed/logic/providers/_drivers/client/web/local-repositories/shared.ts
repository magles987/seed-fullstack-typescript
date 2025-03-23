import { IBagForDriver } from "../../../shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**Tipo de función especial para el driver */
export type TLocalRepositoryCustomQueryDriverFn<TDriverInstance> = (
  thisDriver: TDriverInstance,
  literalBag: IBagForDriver,
  registers: any[]
) => Promise<any>;
