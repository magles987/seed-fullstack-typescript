import { TKeyLogicContext } from "../../../../../../config/shared-modules";
import {
  ELogicCodeError,
  LogicError,
} from "../../../../../../errors/logic-error";
import { IGenericDriver } from "../../../../shared";
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
  ILocalResponse,
  TKeyDiccLocalRepository,
} from "./shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**claves identificadoras de las instancias
 * de servicio disponibles para fabricar */
export type TKeyLocalRepositoryInstance = TKeyDiccLocalRepository;
/**... */
export function localRepositoryFactoryFn(
  keyInstance: TKeyLocalRepositoryInstance,
  keyLogicContext: TKeyLogicContext,
  diccConfig: IDiccLocalRepositoryConfig
): IGenericDriver<ILocalResponse> {
  let instance: IGenericDriver<ILocalResponse>;
  if (keyInstance === "static") {
    if (keyLogicContext === "primitive") {
      instance = new PrimitiveLocalStaticRepository(diccConfig.static);
    } else if (keyLogicContext === "structure") {
      instance = new StructureLocalStaticRepository(diccConfig.static);
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${keyLogicContext}is not valid key logic context valid`,
      });
    }
  } else if (keyInstance === "cookie") {
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
  } else if (keyInstance === "storage") {
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
  } else if (keyInstance === "idb") {
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
