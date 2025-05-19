import {
  IGenericRepositoryCriteria,
  TPrimitiveLiteralCriteriaUnion,
  TStructureLiteralCriteriaUnion,
} from "../../../../../criterias/shared-types";
import { TwinBeeModule } from "../../../../../modules/module";
import { LocalRepository } from "./_local-repository";
import { TLocalRepositoryCustomQueryRepositoryFn } from "./shared-types";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *abstract*
 *
 * ...
 */
export abstract class GenericLibraryLocalRepositoryQueryFn<
  TModelOrValue,
  TRepositoryInstance extends LocalRepository,
  TLiteralCriteria extends IGenericRepositoryCriteria = IGenericRepositoryCriteria
> {
  /**... */
  public readonly readByQueryParam: TLocalRepositoryCustomQueryRepositoryFn<
    TModelOrValue,
    TRepositoryInstance,
    TLiteralCriteria
  > = async (repository, literalCriteria, registers) => {
    const util = TwinBeeModule.util;
    const { diccQueryParam } = literalCriteria;
    let f_registers;
    f_registers = registers.filter((reg) =>
      util.isEquivalentTo([diccQueryParam, reg], {})
    ); //todas las coincidencias
    return f_registers;
  };
  /**... */
  constructor() {}
}
/** *abstract*
 *
 * ...
 */
export abstract class PrimitiveLibraryLocalRepositoryQueryFn<
  TValue,
  TRepositoryInstance extends LocalRepository,
  TLiteralCriteria extends TPrimitiveLiteralCriteriaUnion = TPrimitiveLiteralCriteriaUnion
> {
  /**... */
  public readonly readByQueryParam: TLocalRepositoryCustomQueryRepositoryFn<
    TValue,
    TRepositoryInstance,
    TLiteralCriteria
  > = async (repository, literalCriteria, registers) => {
    const util = TwinBeeModule.util;
    const { diccQueryParam, expectedDataType } = literalCriteria;
    let f_registers;
    if (expectedDataType !== "array") {
      f_registers = registers.find((reg) =>
        util.isEquivalentTo([diccQueryParam, reg], {})
      ); //el primero
    } else {
      f_registers = registers.filter((reg) =>
        util.isEquivalentTo([diccQueryParam, reg], {})
      ); //todas las coincidencias
    }
    return f_registers;
  };
  /**... */
  constructor() {}
}
/** *abstract*
 *
 * ...
 */
export abstract class StructureLibraryLocalRepositoryQueryFn<
  TModel,
  TRepositoryInstance extends LocalRepository,
  TLiteralCriteria extends TStructureLiteralCriteriaUnion<TModel> = TStructureLiteralCriteriaUnion<TModel>
> {
  /**... */
  public readonly readById: TLocalRepositoryCustomQueryRepositoryFn<
    TModel,
    TRepositoryInstance,
    TLiteralCriteria
  > = async (repository, literalCriteria, registers) => {
    const util = TwinBeeModule.util;
    const keyId = repository.keyId;
    const { diccQueryParam } = literalCriteria;
    const f_register = registers.find((reg) =>
      util.isEquivalentTo([diccQueryParam[keyId], reg[keyId]], {})
    ); //SOLO 1
    return f_register;
  };
  /**... */
  public readonly existByQueryParam: TLocalRepositoryCustomQueryRepositoryFn<
    TModel,
    TRepositoryInstance,
    TLiteralCriteria
  > = async (repository, literalCriteria, registers) => {
    const util = TwinBeeModule.util;
    const { diccQueryParam } = literalCriteria;
    const f_registers = registers.find((reg) =>
      util.isEquivalentTo([diccQueryParam, reg], {})
    ); //todas las coincidencias
    const f_exist = util.convertToBoolean(f_registers, [
      "isEmptyAsTrue",
      "isZeroAsTrue",
    ]);
    return f_exist;
  };
  /**... */
  public readonly countByQueryParam: TLocalRepositoryCustomQueryRepositoryFn<
    TModel,
    TRepositoryInstance,
    TLiteralCriteria
  > = async (repository, literalCriteria, registers) => {
    const util = TwinBeeModule.util;
    const { diccQueryParam } = literalCriteria;
    const f_registers = registers.filter((reg) =>
      util.isEquivalentTo([diccQueryParam, reg], {})
    ); //todas las coincidencias
    const f_count = f_registers.length;
    return f_count;
  };
  /**... */
  public readonly readByQueryParam: TLocalRepositoryCustomQueryRepositoryFn<
    TModel,
    TRepositoryInstance,
    TLiteralCriteria
  > = async (repository, literalCriteria, registers) => {
    const util = TwinBeeModule.util;
    const { diccQueryParam, expectedDataType } = literalCriteria;
    let f_registers;
    if (expectedDataType !== "array") {
      f_registers = registers.find((reg) =>
        util.isEquivalentTo([diccQueryParam, reg], {})
      ); //el primero
    } else {
      f_registers = registers.filter((reg) =>
        util.isEquivalentTo([diccQueryParam, reg], {})
      ); //todas las coincidencias
    }
    return f_registers;
  };
  /**... */
  constructor() {}
}
