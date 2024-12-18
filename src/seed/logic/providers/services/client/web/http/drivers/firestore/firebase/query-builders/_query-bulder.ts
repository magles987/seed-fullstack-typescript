/**
 * base para la construccion de builder de consultas usando firebase
 */

import { IRESTCtrl_Read } from "../../../../controllers/REST-controller";
import { UtilFirestoreProvider } from "../util-firestore-provider";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/** @info <hr>  
 * 
 * construye los Query comunes de firebase a partir 
 * de los diferentes tipos de consulta
 * ____
 * @type
 * ``
 * ____
 */
export abstract class QueryBuilder<TFilter,TMetaModel> implements IRESTCtrl_Read<Function>{

    /** 
     * diccionario con los nombres de metodos para 
     * construir las consultas para el controller 
     * que requiere este proveedor
     * ____
     */
    protected _diccQueryBuilder: unknown;
    
    /** 
     * utilidadest de este proveedor
     * ____
     */
    protected util: UtilFirestoreProvider;
    /** 
     * ____
     */
    constructor() {
        this.util = UtilFirestoreProvider.getInstance();
    }

    /** 
     * configuracion de acuerdo al tipo de consulta 
     * normal o group se puede omitir si se tiene la 
     * seguridad de usar el tipo de consulta por 
     * ejemplo: si es una coleccion raiz es seguro 
     * que NO se necesitará consulta de tipo 
     * collectionGroup
     * ____
     * 
     * @param cursorQuery : cursor constructor de la consulta.  
     * `filter` : objeto con la configuracion del filtro 
     * a usar en la consulta.  
     * ____
     * @returns el cursor ya configurado 
     * ____
     */
     protected configTypeCollectionQuery(
        cursorQuery:firebase.firestore.Query<firebase.firestore.DocumentData>,
        filter:TFilter     
    ){
        //extraer part de modelo meta
        const mMeta = <ModelMetadata><unknown>this.modelMeta;
        
        const pathCollection = this.util.getPathCollection(mMeta, filter._pathBase);
        
        cursorQuery = (!(filter.isCollectionGroup && mMeta.__typeCollection == ETypeCollection.subCollection)) ? 
                this.FBconfig.app_FS.collection(pathCollection) :
                this.FBconfig.app_FS.collectionGroup(pathCollection);
        
        return cursorQuery;
    }
    /** 
     * descrip...
     * 
     * @param cursorQuery : cursor constructor de la consulta.     
     * ____
     * @returns `` 
     * ____
     */
    protected setOrderQuery(
        cursorQuery:firebase.firestore.Query<firebase.firestore.DocumentData>,
        filter:unknown
    ){
        cursorQuery = cursorQuery.orderBy(mMeta._id.nom, filter.order._id);
        return cursorQuery;
    }

    /** 
     * *protected*  
     * configuracion comun de limite y paginacion para 
     * todas las querys para todos lo modelsCtrl
     * 
     * *Param:*  
     * `cursorQuery` : cursor constructor de la consulta.  
     * `filter` : objeto con la configuracion del filtro 
     * a usar en la consulta.  
     * ____
     */
    protected configLimitAndPaginateQuery(
        cursorQuery:firebase.firestore.Query<firebase.firestore.DocumentData>,
        filter:IFilter<TIModel>  
    ):firebase.firestore.Query<firebase.firestore.DocumentData>{
        
        const configPre = this.paginator.configParamsPaginateForQuery(filter);

        /**seleccion de metodo limit a aplicar segun tipo 
         * y direccion de paginacion*/

        if (configPre.typeLimitMethod == "limit-method") {
            cursorQuery = cursorQuery.limit(configPre.limit);
        }
        if (configPre.typeLimitMethod == "limitToLast-method") {
            cursorQuery = cursorQuery.limitToLast(configPre.limit);
        }

        /**seleccion de metodo de paginacion (punto de inicio) */

        /** permite paginacion directa excluyendo en la consulta el snapShotDoc 
         * que se le pase como referencia (normalmente usado con metodo limit)*/        
        if (configPre.initialMethod == "startAfter") {
            cursorQuery = cursorQuery.startAfter(configPre.SSDForQuery)
        }
        
        /** permite paginacion directa incluyendo en la consulta el snapShotDoc 
         * que se le pase como referencia (normalmente usado con metodo limit)*/        
        if (configPre.initialMethod == "startAt") {
            cursorQuery = cursorQuery.startAt(configPre.SSDForQuery)
        }        

        /** permite paginacion reversible excluyendo en la consulta el snapShotDoc 
         * que se le pase como referencia (normalmente usado con limitToLast)*/
        if (configPre.initialMethod == "endBefore") {
            cursorQuery = cursorQuery.endBefore(configPre.SSDForQuery)
        }

        /** permite paginacion reversible incluyendo en la consulta el snapShotDoc 
         * que se le pase como referencia (normalmente usado con limitToLast)*/        
        if (configPre.initialMethod == "endAt") {
            cursorQuery = cursorQuery.endAt(configPre.SSDForQuery)
        }        

        return cursorQuery;
    }
    //================================================================
    //constructor de cursor de acuerdo a la consulta

    public readAll():firebase.firestore.Query<firebase.firestore.DocumentData>{
        let cursorQuery:firebase.firestore.Query<firebase.firestore.DocumentData>;
        cursorQuery = this.configTypeCollectionQuery(cursorQuery);
        cursorQuery = this.setOrderQuery(cursorQuery);
        cursorQuery = this.configLimitAndPaginateQuery(cursorQuery);
        return cursorQuery;
    };
    public readById(
        id:any
    ):firebase.firestore.Query<firebase.firestore.DocumentData>{
        let cursorQuery:firebase.firestore.Query<firebase.firestore.DocumentData>;
        cursorQuery = this.configTypeCollectionQuery(cursorQuery);
        cursorQuery = this.setOrderQuery(cursorQuery);
        cursorQuery = this.configLimitAndPaginateQuery(cursorQuery);

        //..aqui la consulta personalizada
        return cursorQuery;
    }
 

}