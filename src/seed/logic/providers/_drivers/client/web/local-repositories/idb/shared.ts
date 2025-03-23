import { TLocalRepositoryCustomQueryDriverFn } from "../shared";
import { IdbDriver } from "./_idb-driver";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**Tipo de función especial para el driver */
export type TLocalIdbCustomQueryDriverFn =
  TLocalRepositoryCustomQueryDriverFn<IdbDriver>;
