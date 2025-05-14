import { Util_Module } from "../../../src/logic/util/util-module";
import {
  TPrimitiveMockCustomQueryDriverFn,
  TStructureMockCustomQueryDriverFn,
} from "./shared-types";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** *Singleton*
 *
 * ...
 */
export class PrimitiveLibraryMockQueryFn {
  public readonly readByQueryParam: TPrimitiveMockCustomQueryDriverFn = async (
    microbackend,
    literalCriteria,
    registers
  ) => {
    const util = Util_Module.getInstance();
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
  /**  Almacena la instancia única de esta clase */
  private static PrimitiveLibraryMockQueryFn_instance: PrimitiveLibraryMockQueryFn;
  /**... */
  protected constructor() {}
  /** @returns la instancia única de la clase*/
  public static getInstance(): PrimitiveLibraryMockQueryFn {
    PrimitiveLibraryMockQueryFn.PrimitiveLibraryMockQueryFn_instance =
      typeof PrimitiveLibraryMockQueryFn.PrimitiveLibraryMockQueryFn_instance ===
        "object" &&
      PrimitiveLibraryMockQueryFn.PrimitiveLibraryMockQueryFn_instance !== null
        ? PrimitiveLibraryMockQueryFn.PrimitiveLibraryMockQueryFn_instance
        : new PrimitiveLibraryMockQueryFn();
    return PrimitiveLibraryMockQueryFn.PrimitiveLibraryMockQueryFn_instance;
  }
}
/** *Singleton*
 *
 * ...
 */
export class StructureLibraryMockQueryFn {
  /**... */
  public readonly readById: TStructureMockCustomQueryDriverFn = async (
    microbackend,
    literalCriteria,
    registers
  ) => {
    const util = Util_Module.getInstance();
    const keyId = microbackend.keyId;
    const { diccQueryParam } = literalCriteria;
    const f_register = registers.find((reg) =>
      util.isEquivalentTo([diccQueryParam[keyId], reg[keyId]], {})
    ); //SOLO 1
    return f_register;
  };
  /**... */
  public readonly existByQueryParam: TStructureMockCustomQueryDriverFn = async (
    microbackend,
    literalCriteria,
    registers
  ) => {
    const util = Util_Module.getInstance();
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
  public readonly countByQueryParam: TStructureMockCustomQueryDriverFn = async (
    microbackend,
    literalCriteria,
    registers
  ) => {
    const util = Util_Module.getInstance();
    const { diccQueryParam } = literalCriteria;
    const f_registers = registers.filter((reg) =>
      util.isEquivalentTo([diccQueryParam, reg], {})
    ); //todas las coincidencias
    const f_count = f_registers.length;
    return f_count;
  };
  /**... */
  public readonly readByQueryParam: TStructureMockCustomQueryDriverFn = async (
    microbackend,
    literalCriteria,
    registers
  ) => {
    const util = Util_Module.getInstance();
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
  /**  Almacena la instancia única de esta clase */
  private static StructureLibraryMockQueryFn_instance: StructureLibraryMockQueryFn;
  /**... */
  protected constructor() {}
  /** @returns la instancia única de la clase*/
  public static getInstance(): StructureLibraryMockQueryFn {
    StructureLibraryMockQueryFn.StructureLibraryMockQueryFn_instance =
      typeof StructureLibraryMockQueryFn.StructureLibraryMockQueryFn_instance ===
        "object" &&
      StructureLibraryMockQueryFn.StructureLibraryMockQueryFn_instance !== null
        ? StructureLibraryMockQueryFn.StructureLibraryMockQueryFn_instance
        : new StructureLibraryMockQueryFn();
    return StructureLibraryMockQueryFn.StructureLibraryMockQueryFn_instance;
  }
}
