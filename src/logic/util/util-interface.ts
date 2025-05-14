/**define un generador de esquemas de objetos 
 * a partir de una interfaz base
 * ____
 * @type
 * `TMapSchema` la definicion de esquema de los 
 * tipos (`interface` o `type`) que deberá ser 
 * asignado a la defincion base, ⚠ este mapa debe 
 * contener **TODOS** los tipos que se asignan a 
 * **cada propiedad** de la definicion base (el oreden importa), 
 * no puede faltar ninguno. Se sugiere que los 
 * identificadores de las propiedades de este 
 * mapa sean entre comillas y que el identificador 
 * sea realacionado al tipo.
 *  
 * Ejemplo: 
 * `'stringA' : string[]` 
 * que indica que el tipo es un Array de strings
 * 
 * `TBase` la definicion base con los indentificadores 
 * reales del modelo, cada generico corresponderá a 
 * cada tipo de cada propiedad.
 * 
 * ____ 
 * ejemplo:
 * 
 * ````
 * //define las `key` comunes 
 * type TBase<Ta1, Ta2> = {
 *     a1 : Ta1;
 *     a2 : Ta2;
 * }
 * //define tipos a usar en IA 
 * type TMapSchema_IA = {
 *   'string' : string;
 *   'number' : number;
 * }
 * //define tipos a usar en IB
 * type TMapSchema_IB = {
 *   'object': object; //---???Que pasa si 2 o mas propiedades tienen el mismo tipo???---
 *   'stringA': string[];
 * }
 * //Definicion de alto nivel de los tipos:
 * type IA = TSchemaGenerator<TMapSchema_IA, TBase<'string', 'number'>>;
 * type IB = TSchemaGenerator<TMapSchema_IB, TBase<'object', 'stringA'>>;
 * 
 * //implementacion:
 * let a:IA = {a1:"Hola", a2:3};
 * let b:IB = {a1:{}, a2:["Hola Array"]};
 * ````
 * 
*/
export type TSchemaGenerator<TMapSchema , TBase extends Record<string, keyof TMapSchema>> = {
    -readonly [K in keyof TBase]: TMapSchema[TBase[K]]
}
/**tipado auxiliar que permite eliminar las propiedades 
 * tipo `function` de un esquema o definicion dado
 * ____
 * @type
 * `TSchemaBase` el esquema o definicion a procesar
 * 
*/
export type TSchemaNotFunction<TSchemaBase> = { 
    [TProp in keyof TSchemaBase] : TSchemaBase[TProp] extends Function ? TProp : never;
}[keyof TSchemaBase];

//----en construccion----
/**ejemplo para reconstruir tipo de esquema propiedad a propiedad */
type TSchemaG<TBase, TProp> = {[TKey in keyof TBase] : TProp}; //asi como esta funciona como un Record<>, se buscan utilidades en la asignacion ed cada tipo en la propiedad