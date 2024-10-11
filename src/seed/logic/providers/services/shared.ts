import { IBagModule } from "../../bag-module/shared";
import {
  IPrimitiveReadCriteria,
  IPrimitiveModifyCriteria,
  IStructureReadCriteria,
  IStructureModifyCriteria,
} from "../../criterias/shared";
import { IResponse } from "../../reports/shared";
import { IServerServiceRequestC } from "./server/shared";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**claves identificadoras para el contexto de ejecucion para el modulo en primitive*/
export type TKeyPrimitiveServiceModuleContext = "primitiveService";
/**claves identificadoras para el contexto de ejecucion para el modulo en structure*/
export type TKeyStructureServiceModuleContext = "structureService";
/**esquema de bag exclusivo para servicio */
export interface IBagForService {
  literalCriteria:
  | IPrimitiveReadCriteria
  | IPrimitiveModifyCriteria
  | IStructureReadCriteria<any>
  | IStructureModifyCriteria<any>;
  data: any;
}
/**... */
export interface IGenericService {
  /**ejecutar la peticion en el servicio */
  runRequestFromService(iBag: IBagModule<any>): Promise<IResponse>;
}
/**... */
export interface IGenericDriver<TIResponseForDrive> {
  runRequestFromDrive(bagService: IBagForService): Promise<TIResponseForDrive>;
}
/**esquema con parametros de configuracion de un servicio */
export interface IServiceRequestConfig {
  server?: IServerServiceRequestC;
}
/**refactorizacion de la interfaz */
export type Trf_IServiceRequestConfig = IServiceRequestConfig;
/**... */
export type TKeyServiceRequestConfig = keyof IServiceRequestConfig;
