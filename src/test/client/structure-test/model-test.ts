import { Model } from "../../../seed/logic/models/_model";
//██ Modelo tipo clase ████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** Define las propiedades del modelo*/
//🛑 esta clase NO esta pensada en instanciacion
//sino en referencia, por tal razon **no debe
//tener metodos asignados, ni constructor**,
//se pueden inicializar las propiedades aunque
//es mejor incializarlas (especialmente si
//dependen de otros docs o fuentes) en el
export class ModelTest extends Model {
  //boleano: boolean = false;
  // texto :string = "";
  // texto_tel: string;
  // texto_email: string;
  // texto_url: string;
  // texto_pw: string;
  // v_text_c_pw: string;
  // texto_radio: string;
  // texto_checkbox: string[];
  // texto_switch: string[];
  // texto_select: string;
  // numero: number = 5;
  // numero_range: number = 8;
  // numero_especial_counter: number = 0;
  // numero_especial_rating: number = 3;
  // numero_radio: number[] = [5];
  // numero_checkbox: number[] = [1, 3];
  // numero_switch: number = 3;
  // numero_select: number[] = [1];
  // objeto_radio:Object = {};
  // objeto_checkbox:Object[] = [];
  // objeto_switch: Object[] = [];
  // a_texto:string[] = [];
  // a_numero:number[] = [];
  // a_boleano:boolean[] = [];
  // a_objeto:Object[] = [];
}
//████ Modelo tipo Interfaz ██████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** interfaz de este modelo para propositos generales*/
//🛑 la interfaz debe permanecer **vacia** y agregar
//al extends `Partial<>` si se desean opcionales
export interface IModelTest<TExtend> extends Record<keyof ModelTest, TExtend> {}
/**Tipado de las claves identificadoras de cada campo del modelo */
export type TKeyFieldModelTest = keyof IModelTest<any>;
