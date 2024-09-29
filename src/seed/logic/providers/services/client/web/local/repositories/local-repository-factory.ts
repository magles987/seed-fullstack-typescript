import { TKeyLogicContext } from "../../../../../../config/shared-modules";
import {
  ELogicCodeError,
  LogicError,
} from "../../../../../../errors/logic-error";
import { PrimitiveLocalCookieRepository } from "./local-cookie/primitive-local-cookie-repository";
import { StructureLocalCookieRepository } from "./local-cookie/structure-local-cookie-repository";
import { PrimitiveLocalIDBRepository } from "./local-idb/primitive-local-idb-repository";
import { StructureLocalIDBRepository } from "./local-idb/structure-local-idb-repository";
import { PrimitiveLocalStaticRepository } from "./local-static/primitive-local-static-repository";
import { StructureLocalStaticRepository } from "./local-static/structure-local-static-repository";
import { PrimitiveLocalStorageRepository } from "./local-storage/primitive-local-storage-repository";
import { StructureLocalStorageRepository } from "./local-storage/structure-local-storage-repository";
import {
  IDiccLocalRepositoryConfig,
  IGenericDriver,
  TKeyDiccLocalRepository,
} from "./shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**claves identificadoras de las instancias
 * de servicio disponibles para fabricar */
export type TKeyLocalRepositoryInstance = TKeyDiccLocalRepository;
/**... */
export function localRepositoryFactoryFn(
  keyLogicContext: TKeyLogicContext,
  keySrc: string,
  keyInstance: TKeyLocalRepositoryInstance,
  diccConfig: IDiccLocalRepositoryConfig
): IGenericDriver {
  let instance: IGenericDriver;
  if (keyInstance === "static") {
    if (keyLogicContext === "primitive") {
      instance = new PrimitiveLocalStaticRepository(keySrc, diccConfig.static);
    } else if (keyLogicContext === "structure") {
      instance = new StructureLocalStaticRepository(keySrc, diccConfig.static);
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${keyLogicContext}is not valid key logic context valid`,
      });
    }
  } else if (keyInstance === "cookie") {
    if (keyLogicContext === "primitive") {
      instance = new PrimitiveLocalCookieRepository(keySrc, diccConfig.cookie);
    } else if (keyLogicContext === "structure") {
      instance = new StructureLocalCookieRepository(keySrc, diccConfig.cookie);
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${keyLogicContext}is not valid key logic context valid`,
      });
    }
  } else if (keyInstance === "storage") {
    if (keyLogicContext === "primitive") {
      instance = new PrimitiveLocalStorageRepository(
        keySrc,
        diccConfig.storage
      );
    } else if (keyLogicContext === "structure") {
      instance = new StructureLocalStorageRepository(
        keySrc,
        diccConfig.storage
      );
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${keyLogicContext}is not valid key logic context valid`,
      });
    }
  } else if (keyInstance === "idb") {
    if (keyLogicContext === "primitive") {
      instance = new PrimitiveLocalIDBRepository(keySrc, diccConfig.idb);
    } else if (keyLogicContext === "structure") {
      instance = new StructureLocalIDBRepository(keySrc, diccConfig.idb);
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
