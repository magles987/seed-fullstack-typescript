import { TLocalRepositoryCustomQueryDriverFn } from "../shared";
import { CookieDriver } from "./cookie-driver";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**Tipo de función especial para el driver */
export type TLocalCookieCustomQueryDriverFn =
  TLocalRepositoryCustomQueryDriverFn<CookieDriver>; /**define el tipo de almacenamiento a usar */
