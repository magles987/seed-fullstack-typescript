import { TKeyLogicContext } from "../../config/shared-modules";
import { ELogicCodeError, LogicError } from "../../errors/logic-error";
import { IGenericDriver } from "./shared";
import { TKeyGroupDriver as TKeyDriver } from "./shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**... */
export function driverFactoryFn(
  keyInstance: TKeyDriver,
  keyLogicContext: TKeyLogicContext,
  diccConfig: IDiccLocalRepositoryConfig
): IGenericDriver {
  let instance: IGenericDriver;
  if (keyInstance === "client-web-local-rep-cookie") {
    if (keyLogicContext === "primitive") {
      instance = new PrimitiveLocalCookieRepository(diccConfig.cookie);
    } else if (keyLogicContext === "structure") {
      instance = new StructureLocalCookieRepository(diccConfig.cookie);
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${keyLogicContext}is not valid key logic context valid`,
      });
    }
  } else if (keyInstance === "client-web-local-rep-storage") {
    if (keyLogicContext === "primitive") {
      instance = new PrimitiveLocalStorageRepository(diccConfig.storage);
    } else if (keyLogicContext === "structure") {
      instance = new StructureLocalStorageRepository(diccConfig.storage);
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${keyLogicContext}is not valid key logic context valid`,
      });
    }
  } else if (keyInstance === "client-web-local-rep-idb") {
    if (keyLogicContext === "primitive") {
      instance = new PrimitiveLocalIDBRepository(diccConfig.idb);
    } else if (keyLogicContext === "structure") {
      instance = new StructureLocalIDBRepository(diccConfig.idb);
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${keyLogicContext}is not valid key logic context valid`,
      });
    }
  } else {
    throw new LogicError({
      code: ELogicCodeError.MODULE_ERROR,
      msn: `${keyInstance} is not key for factory valid`,
    });
  }
  return instance;
}
