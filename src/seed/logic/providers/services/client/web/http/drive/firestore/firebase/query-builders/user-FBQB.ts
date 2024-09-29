/**
 * Adaptador necesario para REST usando firebase compo proveedor
 */
 import { QueryBuilder } from "./_query-bulder";
 import { IUserCtrl_Read } from "../../../../controllers/user-ctrl";
 
 //████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
 /** @info <hr>  
  * *Singleton*  
  * 
  * construye los Query de este controller de firebase a partir 
  * de los diferentes tipos de consulta
  * 
  * ⚠ Solo visible para el controller de este modelo
  * ____
  */
 export class User_FBQB extends QueryBuilder<any,any> implements IUserCtrl_Read<Function> {
    /**  
     * Almacena la instancia única de esta clase
     * ____
     */
    private static instance: User_FBQB;
    protected get diccQueryBuilder(){
        return <IUserCtrl_Read<String>>{
            readAll:"readAll",
            readById:"readById",
            readBynameUser:"readBynameUser",
        };
    }


    /** 
     * descrip...
     * ____
     */
    constructor() {
        super();
    }
    /**  
     * devuelve la instancia única de esta clase  
     * ya sea que la crea o la que ya a sido creada
     * ____
     */
    public static getInstance():User_FBQB{
        User_FBQB.instance = (!User_FBQB.instance || User_FBQB.instance == null) ?
                    new User_FBQB() : User_FBQB.instance;
        return User_FBQB.instance;
    }
    /** @override
     */
    protected configTypeCollectionQuery(
        cursorQuery:firebase.firestore.Query<firebase.firestore.DocumentData>,
        filter:IFilter<TIModel>        
    ){

        cursorQuery = super.configTypeCollectionQuery(cursorQuery);
        return cursorQuery;
    }
    /** @override
     */
    protected setOrderQuery(
        cursorQuery:firebase.firestore.Query<firebase.firestore.DocumentData>,
        filter:unknown
    ){

        cursorQuery = super.setOrderQuery(cursorQuery);
        return cursorQuery;
    }
    /** @override
     */
    protected configLimitAndPaginateQuery(
        cursorQuery:firebase.firestore.Query<firebase.firestore.DocumentData>,
        filter:IFilter<TIModel>  
    ){
        cursorQuery = super.configLimitAndPaginateQuery(cursorQuery);
        return cursorQuery;
    }
    //================================================================
    //constructor de cursor de acuerdo a la consulta

    readBynameUser: Function;

 }