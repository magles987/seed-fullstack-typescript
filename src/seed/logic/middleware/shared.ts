/**Define la estructura necesaria
 *  para crear un constructor-operador de middleware */
export interface ILogicMiddlewarBuilder {
  /**funcion acumuladora de middleware a ejecutar
   */
  use: Function;
  /**funcion que ejecuta todos los middlewares acumulados
   * ____
   * @param bag el objeto contenedor de
   * toda la configuracion necesaria para
   * la ejecucion interna del middleware
   * ___
   * @return respuesta a la ejecucion de los middlewares
   */
  run<TIBag>(bag: TIBag): Promise<any>;
}
/**funcion asyncrona generica que representa la
 * construccion de un middleware
 * ____
 * @param bag el objeto contenedor de
 * toda la configuracion necesaria para
 * la ejecucion interna del middleware
 * @param next funcion que representa
 * la ejecucion del siguiente middleware
 * ____
 * @return Promesa vacia
 */
export type TFnLogicMiddleware<TIBag> = (
  bag: TIBag,
  next: () => Promise<void>
) => Promise<void>;
