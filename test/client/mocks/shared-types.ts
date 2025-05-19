import {
  IPrimitiveReadCriteria,
  IPrimitiveModifyCriteria,
  IStructureModelReadCriteria,
  IStructureModelModifyCriteria,
} from "../../../src/logic/criterias/shared-types";
import { MicroBackend } from "./microbackend";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
export type TPrimitiveMockCustomQueryRepositoryFn = (
  microBE: MicroBackend,
  literalCriteria: IPrimitiveReadCriteria | IPrimitiveModifyCriteria,
  //| IStructureModelReadCriteria<any>
  //| IStructureModelModifyCriteria<any>,
  registers: any[]
) => Promise<any>;
export type TStructureMockCustomQueryRepositoryFn = (
  microBE: MicroBackend,
  literalCriteria:
    | IStructureModelReadCriteria<any>
    | IStructureModelModifyCriteria<any>,
  registers: any[]
) => Promise<any>;
