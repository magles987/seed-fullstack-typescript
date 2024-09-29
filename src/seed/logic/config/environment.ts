import { TTypeAuthProviders, TTypeRESTProviders, TTypeRESTProvidersOffline } from "../providers/factory-provider";
import { fbKey_dev, fbKey_prod } from "./firestore/_firebase-key-config";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** 
 * Almacena el entono en el que se esta ejecutando la 
 * aplicacion para poder configurar globalmente.  
 * 
*/
//especificar las posibles opciones en forma de tipado
var ENV_SELECTOR:"dev" | "prod";  //puede haber mas opciones
    //seleccionar
    ENV_SELECTOR = "dev"; 

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** @info <hr>  
 * *interface*
 * se debe implementar para cada objeto de 
 * configuracion de ENVIROMENT
 * ____
 */
interface IENV {
    /** asignacion de local lenguaje en formato "xx-XX"*/
    localLa2 : string;
    /** asignacion de local lenguaje en formato "xx"*/
    localLa : string;
    /** determina el proveedor principal del REST  */
    RESTProvider:TTypeRESTProviders;
    /**determina el proveedor offline de REST */
    RESTProviderOffline:TTypeRESTProvidersOffline;
    /**determina el proveedor de auth */
    authProvider:TTypeAuthProviders;
    /**determina la url del backend que sirve la api */
    urlServerApi?:string;
    /**determina que framework principal se esta usando para los estilos de html y css */
    keyMainFrameworkView : "none" | "own" | "bootstrap" | "materializecss"; 
    /**Contiene la configuracion de 
     * Entorno para la suite de firebase 
     */
    firebase:{
        
        /**Contien la key de acceso al proyecto de firebase */
        fbKey : any;

        //banderas para emuladores:
        isLocalFirebase:boolean;
        isLocalFirestore:boolean;
        isLocalCloudFunctions:boolean;
        isLocalStorage:boolean;        
    }
}

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/*Objetos ENV de acuerdo al entorno*/
/**Configuracion de desarrolo estandar */
var ENV_dev:IENV = {
    localLa2 : "es-ES",
    localLa : "es",
    firebase : {
        fbKey : fbKey_dev,

        isLocalCloudFunctions : true,
        isLocalFirebase : false,
        isLocalFirestore :false,
        isLocalStorage : false,
    },
    RESTProvider:"Dummy",
    RESTProviderOffline : "Dummy",
    authProvider : "Dummy",
    keyMainFrameworkView : "materializecss",
}
/**Configuracion de  produccion estandar */
var ENV_prod:IENV = {
    localLa2 : "es-ES",
    localLa : "es",
    firebase : {
        fbKey : fbKey_prod,

        isLocalCloudFunctions : false,
        isLocalFirebase : false,
        isLocalFirestore :false,
        isLocalStorage : false,
    },
    RESTProvider:"appscript",
    RESTProviderOffline : "indexedDB",
    authProvider : "auth-firestore",
    keyMainFrameworkView : "materializecss",
}

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** 
 * Contiene la funcion que devuelve la configuracion 
 * de acuerdo al entorno seleccionado
 * 
*/
export var ENV = function ():IENV {

    switch (ENV_SELECTOR) {
        case "dev":
            return ENV_dev
            break;
        case "prod":
            return ENV_prod
            break;            
    
        default:
            return ENV_dev
            break;
    }
}