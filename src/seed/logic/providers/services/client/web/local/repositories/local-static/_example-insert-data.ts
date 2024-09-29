/**Ejemplo de como cargar datos estaticos a la BD, este 
 * archivo aunque es funcional lo ideal es que este 
 * codigo de ejecucion se tomo como ejemplo para realizar 
 * un archivo mas especifico para la aplicacion*/
import { TKeyModel } from "../../../../../meta/_model-meta";
import { ModelTest, get_MODEL_META } from "../../../../../models/model-test";
import { LocalStaticRepository } from "./_local-static-repository";
import { ISchemaSrcBDGeneric } from "./db";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**contiene todos los valores estaticos a asignar */
const values :Array<[string, ISchemaSrcBDGeneric]> = [
    [<TKeyModel>"modelTest", {
        df : new  ModelTest(),
        meta : get_MODEL_META(),
    }],
];
//insercion de datos
const localCtrl = LocalStaticRepository.getInstance();
localCtrl.insert_into_Src(values);


