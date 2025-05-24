import { Model } from "./_model";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** define un interfaz con las propiedades comunes
 *  de los modelos para propositos generales*/
//🛑 la interfaz debe permanecer **vacia**
export interface IModelWith_id<TExtend>
  extends Record<keyof ModelWith_id, TExtend> {}

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** Define las propiedades comunes de los modelos*/
//🛑 esta clase NO esta pensada en instanciacion
//sino en referencia, por tal razon **no debe
//tener metodos asignados, ni constructor**
export class ModelWith_id extends Model implements IModelWith_id<any> {
  /**identificador del doc*/
  _id: string = "";
  /**fecha de modificacion*/
  // _modAt: number;//Date; ///Date.now();
  /**estado activo*/
  // _isActive: number;
}
