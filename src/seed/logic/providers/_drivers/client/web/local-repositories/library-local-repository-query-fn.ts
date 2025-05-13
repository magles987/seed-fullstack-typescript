import { Module } from "../../../../../modules/module";
import { LocalRepositoryDriver } from "./_local-repository-driver";
import {
  TPrimitiveLocalRepositoryCustomQueryDriverFn,
  TStructureLocalRepositoryCustomQueryDriverFn,
} from "./shared-types";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *abstract*
 *
 * ...
 */
export abstract class PrimitiveLibraryLocalRepositoryQueryFn<
  TDriverInstance extends LocalRepositoryDriver,
  TValue
> {
  /**... */
  public readonly readByQueryParam: TPrimitiveLocalRepositoryCustomQueryDriverFn<
    TDriverInstance,
    TValue
  > = async (driver, literalBag, registers) => {
    const util = Module.util;
    const { diccQueryParam, expectedDataType } = literalBag.literalCriteria;
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
  TDriverInstance extends LocalRepositoryDriver,
  TModel
> {
  /**... */
  public readonly readById: TStructureLocalRepositoryCustomQueryDriverFn<
    TDriverInstance,
    TModel
  > = async (driver, literalBag, registers) => {
    const util = Module.util;
    const keyId = driver.keyId;
    const { diccQueryParam } = literalBag.literalCriteria;
    const f_register = registers.find((reg) =>
      util.isEquivalentTo([diccQueryParam[keyId], reg[keyId]], {})
    ); //SOLO 1
    return f_register;
  };
  /**... */
  public readonly existByQueryParam: TStructureLocalRepositoryCustomQueryDriverFn<
    TDriverInstance,
    TModel
  > = async (driver, literalBag, registers) => {
    const util = Module.util;
    const { diccQueryParam } = literalBag.literalCriteria;
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
  public readonly countByQueryParam: TStructureLocalRepositoryCustomQueryDriverFn<
    TDriverInstance,
    TModel
  > = async (driver, literalBag, registers) => {
    const util = Module.util;
    const { diccQueryParam } = literalBag.literalCriteria;
    const f_registers = registers.filter((reg) =>
      util.isEquivalentTo([diccQueryParam, reg], {})
    ); //todas las coincidencias
    const f_count = f_registers.length;
    return f_count;
  };
  /**... */
  public readonly readByQueryParam: TStructureLocalRepositoryCustomQueryDriverFn<
    TDriverInstance,
    TModel
  > = async (driver, literalBag, registers) => {
    const util = Module.util;
    const { diccQueryParam, expectedDataType } = literalBag.literalCriteria;
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
