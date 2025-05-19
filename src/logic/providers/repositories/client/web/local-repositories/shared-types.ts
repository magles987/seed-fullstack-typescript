//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**Tipo de función especial para el repository */
export type TLocalRepositoryCustomQueryRepositoryFn<
  TModelOrValue,
  TRepositoryInstance,
  TLiteralCriteria
> = (
  thisRepository: TRepositoryInstance,
  literalCriteria: TLiteralCriteria,
  registers: TModelOrValue[]
) => Promise<any>;
