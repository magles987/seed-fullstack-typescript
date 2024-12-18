/**
 * metodos CRUD de acceso para acceder a firebase
 */

import { FirebaseConfig } from "../../../config/firestore/firebase-config";
import { IRESTFullProvider, Trf_IREST_DTO_Request, Trf_IREST_DTO_Response } from "../../REST-factory-provider";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** @info <hr>  
 * *Singleton*  
 * 
 * descrip... 
 * ____
 */
export class FirebaseRESTHandler
    implements IRESTFullProvider
{

    /**  
     * Almacena la instancia única de esta clase
     * ____
     */
    private static instance: FirebaseRESTHandler;
    /**   
     * intancia de la API para el manejo de firebase
     * ____
     */
    private FBconfig:FirebaseConfig;
    

     /** 
      * ____
      */
    constructor() {
        this.FBconfig = FirebaseConfig.getInstance();
    } 
     /**  
      * devuelve la instancia única de esta clase  
      * ya sea que la crea o la que ya a sido creada
      * ____
      */
    public static getInstance():FirebaseRESTHandler {
        FirebaseRESTHandler.instance = (typeof FirebaseRESTHandler.instance == "undefined"|| FirebaseRESTHandler.instance == null) ?
                    new FirebaseRESTHandler() : FirebaseRESTHandler.instance;
        return <FirebaseRESTHandler>FirebaseRESTHandler.instance;
    }

    public read(request: Trf_IREST_DTO_Request): Promise<Trf_IREST_DTO_Response> {
        throw new Error("Method not implemented.");
    }
    public modify(request: Trf_IREST_DTO_Request): Promise<Trf_IREST_DTO_Response> {
        throw new Error("Method not implemented.");
    }

}
