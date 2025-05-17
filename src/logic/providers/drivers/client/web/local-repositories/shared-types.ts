//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**Tipo de función especial para el driver */
export type TLocalRepositoryCustomQueryDriverFn<
  TModelOrValue,
  TDriverInstance,
  TLiteralCriteria
> = (
  thisDriver: TDriverInstance,
  literalCriteria: TLiteralCriteria,
  registers: TModelOrValue[]
) => Promise<any>;
