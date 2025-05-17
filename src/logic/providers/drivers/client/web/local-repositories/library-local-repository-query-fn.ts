import {
  IGenericDriverCriteria,
  TPrimitiveLiteralCriteriaUnion,
  TStructureLiteralCriteriaUnion,
} from "../../../../../criterias/shared-types";
import { TwinBeeModule } from "../../../../../modules/module";
import { LocalRepositoryDriver } from "./_local-repository-driver";
import { TLocalRepositoryCustomQueryDriverFn } from "./shared-types";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *abstract*
 *
 * ...
 */
export abstract class GenericLibraryLocalRepositoryQueryFn<
  TModelOrValue,
  TDriverInstance extends LocalRepositoryDriver,
  TLiteralCriteria extends IGenericDriverCriteria = IGenericDriverCriteria
> {
  /**... */
  public readonly readByQueryParam: TLocalRepositoryCustomQueryDriverFn<
    TModelOrValue,
    TDriverInstance,
    TLiteralCriteria
  > = async (driver, literalCriteria, registers) => {
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
  TDriverInstance extends LocalRepositoryDriver,
  TLiteralCriteria extends TPrimitiveLiteralCriteriaUnion = TPrimitiveLiteralCriteriaUnion
> {
  /**... */
  public readonly readByQueryParam: TLocalRepositoryCustomQueryDriverFn<
    TValue,
    TDriverInstance,
    TLiteralCriteria
  > = async (driver, literalCriteria, registers) => {
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
  TDriverInstance extends LocalRepositoryDriver,
  TLiteralCriteria extends TStructureLiteralCriteriaUnion<TModel> = TStructureLiteralCriteriaUnion<TModel>
> {
  /**... */
  public readonly readById: TLocalRepositoryCustomQueryDriverFn<
    TModel,
    TDriverInstance,
    TLiteralCriteria
  > = async (driver, literalCriteria, registers) => {
    const util = TwinBeeModule.util;
    const keyId = driver.keyId;
    const { diccQueryParam } = literalCriteria;
    const f_register = registers.find((reg) =>
      util.isEquivalentTo([diccQueryParam[keyId], reg[keyId]], {})
    ); //SOLO 1
    return f_register;
  };
  /**... */
  public readonly existByQueryParam: TLocalRepositoryCustomQueryDriverFn<
    TModel,
    TDriverInstance,
    TLiteralCriteria
  > = async (driver, literalCriteria, registers) => {
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
  public readonly countByQueryParam: TLocalRepositoryCustomQueryDriverFn<
    TModel,
    TDriverInstance,
    TLiteralCriteria
  > = async (driver, literalCriteria, registers) => {
    const util = TwinBeeModule.util;
    const { diccQueryParam } = literalCriteria;
    const f_registers = registers.filter((reg) =>
      util.isEquivalentTo([diccQueryParam, reg], {})
    ); //todas las coincidencias
    const f_count = f_registers.length;
    return f_count;
  };
  /**... */
  public readonly readByQueryParam: TLocalRepositoryCustomQueryDriverFn<
    TModel,
    TDriverInstance,
    TLiteralCriteria
  > = async (driver, literalCriteria, registers) => {
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
