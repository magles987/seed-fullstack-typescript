import {
  TKeyDiccStrategyGeneratorsIdFn,
  TCustomGenerateIdFn,
} from "../logic/util/default-generators-id-fn";
import {
  PrimitiveModuleFactory,
  StructureModuleFactory,
} from "../logic/modules/module-factory";
import { UtilExtension } from "../util/extension-util";
import { TDeepPartial } from "../util/shared-types";
import { UtilTwinBee } from "../logic/util/util-twinbee";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████

/** *selfconstructor and singleton*
 *
 * ...
 */
export class GlobalConfig implements ReturnType<GlobalConfig["getDefault"]> {
  /**@returns todos los campos con sus valores predefinidos para instancias de esta clase*/
  public static readonly getDefault = () => {
    return {
      /*--------------------------------*/
      /*--------------------------------*/
      /*---- <INICIO CONSTRUCCION> -----*/
      /*
      //valor que se asume como predefinido para toda la semilla
      //globalDefaultValue: undefined as undefined | null,
      */
      /**instancia de utilidad global a usar */
      globalUtil: UtilTwinBee.getInstance(undefined),
      /*---- <FIN CONSTRUCCION> --------*/
      /*--------------------------------*/
      /*--------------------------------*/
      /**clave identificadora del campo que se tomará como identificador */
      keyId: "_id",
      /**estrategia para construcción interna de un  identificador estándar*/
      strategyForIdBuild: "df_uuid" as
        | TKeyDiccStrategyGeneratorsIdFn
        | TCustomGenerateIdFn,
      /**factorías*/
      diccModuleFactory: {
        /**factoría para módulos primitivos */
        primitiveModuleFactory: PrimitiveModuleFactory.getInstance(),
        /**factoría para módulos estructurados */
        structureModuleFactory: StructureModuleFactory.getInstance(),
      },
      /**variables de entono */
      environment: {
        /**la capa de entorno donde se esta ejecutando esta semilla*/
        envGlobalLayout: "client" as "client" | "server",
        /**el entorno estándar de ejecución */
        envStandard: "dev" as "dev" | "prod",
        /**el entorno de pruebas (totalmente ignorado
         * si el entorno standard es `"prod"`) */
        envTest: "test-node" as "test-node" | "test-browser",
      },
    };
  };
  /**@returns todas las constantes a usar en instancias de esta clase*/
  protected static readonly getCONSTANTS = () => {
    return {
      //..aquí las constantes
    };
  };
  /*------------------------------------------------*/
  /*------------------------------------------------*/
  /*---- <INICIO CONSTRUCCION> ---------------------*/
  /*
  private _globalDefaultValue: ReturnType<
    GlobalConfig["getDefault"]
  >["globalDefaultValue"];
  public get globalDefaultValue(): ReturnType<
    GlobalConfig["getDefault"]
  >["globalDefaultValue"] {
    return this._globalDefaultValue;
  }
  public set globalDefaultValue(
    v: ReturnType<GlobalConfig["getDefault"]>["globalDefaultValue"]
  ) {
    this._globalDefaultValue =
      v === undefined || v === null ? v : this._globalDefaultValue;
  }
*/
  private _globalUtil: ReturnType<GlobalConfig["getDefault"]>["globalUtil"];
  public get globalUtil(): ReturnType<
    GlobalConfig["getDefault"]
  >["globalUtil"] {
    return this._globalUtil;
  }
  public set globalUtil(
    v: ReturnType<GlobalConfig["getDefault"]>["globalUtil"]
  ) {
    this._globalUtil = this.util.isInstance(v)
      ? v
      : this.util.isInstance(this._globalUtil)
      ? this._globalUtil
      : this.getDefault().globalUtil;
  }

  /*---- <FIN CONSTRUCCION> ------------------------*/
  /*------------------------------------------------*/
  /*------------------------------------------------*/
  private _keyId: ReturnType<GlobalConfig["getDefault"]>["keyId"];
  public get keyId(): ReturnType<GlobalConfig["getDefault"]>["keyId"] {
    return this._keyId;
  }
  public set keyId(v: ReturnType<GlobalConfig["getDefault"]>["keyId"]) {
    this._keyId = this.util.isString(v)
      ? v
      : this._keyId !== undefined
      ? this._keyId
      : this.getDefault().keyId;
  }
  private _strategyForIdBuild: ReturnType<
    GlobalConfig["getDefault"]
  >["strategyForIdBuild"];
  public get strategyForIdBuild(): ReturnType<
    GlobalConfig["getDefault"]
  >["strategyForIdBuild"] {
    return this._strategyForIdBuild;
  }
  public set strategyForIdBuild(
    v: ReturnType<GlobalConfig["getDefault"]>["strategyForIdBuild"]
  ) {
    this._strategyForIdBuild = this.util.isString(v)
      ? v
      : this._strategyForIdBuild !== undefined
      ? this._strategyForIdBuild
      : this.getDefault().strategyForIdBuild;
  }
  private _diccModuleFactory: ReturnType<
    GlobalConfig["getDefault"]
  >["diccModuleFactory"];
  public get diccModuleFactory(): ReturnType<
    GlobalConfig["getDefault"]
  >["diccModuleFactory"] {
    return this._diccModuleFactory;
  }
  public set diccModuleFactory(
    v: ReturnType<GlobalConfig["getDefault"]>["diccModuleFactory"]
  ) {
    const df = this.getDefault();
    const c = this._diccModuleFactory;
    this._diccModuleFactory = this.util.isObject(v)
      ? {
          primitiveModuleFactory: this.util.isObject(v.primitiveModuleFactory)
            ? v.primitiveModuleFactory
            : this.util.isObject(c.primitiveModuleFactory)
            ? c.primitiveModuleFactory
            : df.diccModuleFactory.primitiveModuleFactory,
          structureModuleFactory: this.util.isObject(v.structureModuleFactory)
            ? v.structureModuleFactory
            : this.util.isObject(c.structureModuleFactory)
            ? c.structureModuleFactory
            : df.diccModuleFactory.structureModuleFactory,
        }
      : this.util.isObject(c)
      ? c
      : df.diccModuleFactory;
  }
  private _environment: ReturnType<GlobalConfig["getDefault"]>["environment"];
  public get environment(): ReturnType<
    GlobalConfig["getDefault"]
  >["environment"] {
    return this._environment;
  }
  public set environment(
    v: ReturnType<GlobalConfig["getDefault"]>["environment"]
  ) {
    const df = this.getDefault();
    const c = this._environment;
    this._environment = this.util.isObject(v)
      ? {
          envGlobalLayout: this.util.isString(v.envGlobalLayout)
            ? v.envGlobalLayout
            : this.util.isString(c.envGlobalLayout)
            ? c.envGlobalLayout
            : df.environment.envGlobalLayout,
          envStandard: this.util.isString(v.envStandard)
            ? v.envStandard
            : this.util.isString(c.envStandard)
            ? c.envStandard
            : df.environment.envStandard,
          envTest: this.util.isString(v.envTest)
            ? v.envTest
            : this.util.isString(c.envTest)
            ? c.envTest
            : df.environment.envTest,
        }
      : this.util.isObject(c)
      ? c
      : df.environment;
  }
  /**utilidades (exclusivas) */
  protected readonly util = UtilExtension.getInstance(undefined); //el valor predefinido no importa porque es solo para esta clase
  /**  Almacena la instancia única de esta clase */
  private static GlobalConfig_instance: GlobalConfig;
  /**
   * @param base objeto literal con valores personalizados para inicalizar las propiedades
   * @param isInit `= true` ❕Solo para herencia❕, indica si esta clase debe iniciar las propiedaes
   */
  protected constructor(
    base: TDeepPartial<ReturnType<GlobalConfig["getDefault"]>> = {},
    isInit = true
  ) {
    this.util = UtilExtension.getInstance(undefined); //asignación temporal
    if (isInit) this.initProps(base);
    //🐱‍👤la propiedad no es accesible por las buenas, toca a las malas 🐱‍👤
    //this.util["_dfValue" as any] = this.globalDefaultValue;
    this.util = this.globalUtil;
  }
  /** @returns la instancia única de la clase*/
  public static getInstance(
    base: TDeepPartial<ReturnType<GlobalConfig["getDefault"]>> = {}
  ): GlobalConfig {
    GlobalConfig.GlobalConfig_instance =
      typeof GlobalConfig.GlobalConfig_instance === "object" &&
      GlobalConfig.GlobalConfig_instance !== null
        ? GlobalConfig.GlobalConfig_instance
        : new GlobalConfig(base);
    return GlobalConfig.GlobalConfig_instance;
  }
  /**@returns todos los campos con sus valores predefinidos*/
  protected getDefault() {
    return GlobalConfig.getDefault();
  }
  /**@returns todas las constantes de la clase para las instancias*/
  protected getCONST() {
    return GlobalConfig.getCONSTANTS();
  }
  /**inicializa las propiedades de manera dinámica
   *
   * @param base objeto literal con valores personalizados para inicalizar las propiedades
   */
  protected initProps(
    base: TDeepPartial<ReturnType<GlobalConfig["getDefault"]>>
  ): void {
    base = typeof base === "object" && base !== null ? base : {};
    for (const key in this.getDefault()) {
      this[key] = base[key];
    }
    return;
  }
  /**⚠ Reinicia todas las propiedades al valor predefinido ⚠ */
  public resetProps(): void {
    const df = this.getDefault();
    for (const key in df) {
      this[key] = df[key];
    }
    return;
  }
  /**reinicia una propiedad al valor predefinido
   *
   * @param key clave identificadora de la propiedad a reiniciar
   */
  public resetPropByKey(
    key: keyof ReturnType<GlobalConfig["getDefault"]>
  ): void {
    const df = this.getDefault();
    this[key as any] = df[key];
    return;
  }
  /**muta masivamente propiedades de manera dinamica
   *
   * @param base objeto literal con valores personalizados a mutar en las propiedades
   */
  public mutateProps(
    base: TDeepPartial<ReturnType<GlobalConfig["getDefault"]>>
  ): void {
    base = typeof base === "object" && base !== null ? base : ({} as any);
    for (const key in base) {
      this[key] = base[key];
    }
    return;
  }
  /**@returns un objeto literal con las propiedades base */
  public getLiteral(): ReturnType<GlobalConfig["getDefault"]> {
    let literal = {};
    for (const key in this.getDefault()) {
      literal[key] = this[key];
    }
    return literal as any;
  }
}

// const DF = {
//   /**valor que se asume como predefinido para toda la semilla */
//   globalDefaultValue: undefined as undefined | null,
//   /**clave identificadora del campo que se tomará como identificador */
//   keyId: "_id",
//   /**estrategia para construcción interna de un  identificador estándar*/
//   strategyForIdBuild: "df_uuid" as
//     | TKeyDiccStrategyGeneratorsIdFn
//     | TCustomGenerateIdFn,
//   /**factorías*/
//   diccModuleFactory: {
//     /**factoría para módulos primitivos */
//     primitiveModuleFactory: PrimitiveModuleFactory.getInstance(),
//     /**factoría para módulos estructurados */
//     structureModuleFactory: StructureModuleFactory.getInstance(),
//   },
// };
// /**contiene la configuración */
// let globalConfig = DF;
// /**asignación las variables de entorno de la semilla
//  *
//  * @param custom configuración personalizada para las variables de entorno
//  */
// export function setGlobalConfig(custom: Partial<typeof DF>): void {
//   if (typeof custom === "object" && custom !== null && !Array.isArray(custom)) {
//     const df = DF;
//     const c = custom;
//     globalConfig = {
//       ...c,
//       keyId: typeof c.keyId === "string" ? c.keyId : df.keyId,
//       globalDefaultValue:
//         c.globalDefaultValue === undefined || c.globalDefaultValue === null
//           ? c.globalDefaultValue
//           : df.globalDefaultValue,
//       strategyForIdBuild:
//         typeof c.strategyForIdBuild === "string" ||
//         typeof c.strategyForIdBuild === "function"
//           ? c.strategyForIdBuild
//           : df.strategyForIdBuild,
//       diccModuleFactory:
//         typeof c.diccModuleFactory === "object" && c.diccModuleFactory !== null
//           ? {
//               ...c.diccModuleFactory,
//               primitiveModuleFactory:
//                 typeof c.diccModuleFactory.primitiveModuleFactory ===
//                   "object" &&
//                 c.diccModuleFactory.primitiveModuleFactory !== null
//                   ? c.diccModuleFactory.primitiveModuleFactory
//                   : df.diccModuleFactory.primitiveModuleFactory,
//               structureModuleFactory:
//                 typeof c.diccModuleFactory.structureModuleFactory ===
//                   "object" &&
//                 c.diccModuleFactory.structureModuleFactory !== null
//                   ? c.diccModuleFactory.structureModuleFactory
//                   : df.diccModuleFactory.structureModuleFactory,
//             }
//           : df.diccModuleFactory,
//     };
//   } else {
//     globalConfig = DF;
//   }
//   return;
// }
// /**... */
// export function getGlobalConfig(): typeof DF {
//   return globalConfig;
// }
