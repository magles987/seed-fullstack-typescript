//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** define un interfaz con las propiedades comunes
 *  de los modelos para propositos generales*/
//🛑 la interfaz debe permanecer **vacia**
export interface IModel<TExtend> extends Record<keyof Model, TExtend> {}

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** Define las propiedades comunes de los modelos*/
//🛑 esta clase NO esta pensada en instanciacion
//sino en referencia, por tal razon **no debe
//tener metodos asignados, ni constructor**
export class Model implements IModel<any> {
  /**identificador del doc*/
  _id: string = "";
  /**fecha de modificacion*/
  // _modAt: number;//Date; ///Date.now();
  /**estado activo*/
  // _isActive: number;
}
