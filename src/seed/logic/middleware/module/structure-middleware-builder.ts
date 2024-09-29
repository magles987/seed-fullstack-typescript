import { TFnLogicMiddleware } from "../shared";
import {
  IStructureMiddlewareBag,
  IStructureResponseForMiddleware,
  Trf_IStructureMiddlewareBag,
  Trf_IStructureResponseForMiddleware,
  TStructureMiddlewareModuleContext,
  TFnModuleMiddleware,
  Trf_IResponseForMiddleware,
  IMiddlewareBag,
  IStructureMiddlewareFinalReport,
} from "./shared";
import { MiddlewareModuleBuilder } from "./_middleware-builder";
import { Util_Middleware } from "../_util-middleware";
import { InFieldLogicFormatter } from "../../mutaters/inField-formatter";
import { OutFieldLogicFormatter } from "../../mutaters/outField-formatter";
import { InModelLogicFormatter } from "../../mutaters/inModel-formatter";
import { OutModelLogicFormatter } from "../../mutaters/outModel-formatter";
import { FieldLogicValidation } from "../../validators/field-validation";
import { ModelLogicValidation } from "../../validators/model-validation";
import { RequestLogicValidation } from "../../validators/request-validation";
import { StructurePreLogicHook } from "../../hooks/structure-pre-hook";
import { StructurePostLogicHook } from "../../hooks/structure-post-hook";
import { ELogicCodeError, LogicError } from "../../errors/logic-error";
import { TKeyStructureDeepMutateModuleContext } from "../../mutaters/shared";
import { TKeyStructureDeepValModuleContext } from "../../validators/shared";
import { TKeyStructureHookModuleContext } from "../../hooks/shared";
import {
  IDiccStructureModuleInstanceContext,
  Trf_IDiccStructureModuleInstanceContext,
} from "../../meta/metadata-handler-shared";
import { StructureLogicMetadataHandler } from "../../meta/structure-metadata-handler";
import {
  ELogicResStatusCode,
  TKeyStructureContextFull,
} from "../../config/shared-modules";
import { LogicValidation } from "../../validators/_validation";
import { LogicMutater } from "../../mutaters/_mutater";
import { LogicHook } from "../../hooks/_hook";
import { StructureMiddlewareReportHandler } from "./structure-middleware-report-handler";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**... */
export class StructureMiddlewareBuilder<
  TCriteriaInstance = any,
  TInFieldFormatInstance extends InFieldLogicFormatter = InFieldLogicFormatter,
  TOutFieldFormatInstance extends OutFieldLogicFormatter = OutFieldLogicFormatter,
  TInModelFormatInstance extends InModelLogicFormatter = InModelLogicFormatter,
  TOutModelFormatInstance extends OutModelLogicFormatter = OutModelLogicFormatter,
  TFieldValInstance extends FieldLogicValidation = FieldLogicValidation,
  TModelValInstance extends ModelLogicValidation = ModelLogicValidation,
  TRequestValInstance extends RequestLogicValidation = RequestLogicValidation,
  TPreHookInstance extends StructurePreLogicHook = StructurePreLogicHook,
  TPostHookInstance extends StructurePostLogicHook = StructurePostLogicHook,
  TProviderInstance = any
> extends MiddlewareModuleBuilder {
  /** configuracion de valores predefinidos para el modulo*/
  public static readonly getDefault = () => {
    const superDf = MiddlewareModuleBuilder.getDefault();
    return {
      ...superDf,
      bag: {
        ...superDf.bag,
        keyPath: undefined,
      } as IStructureMiddlewareBag,
    };
  };
  /**... */
  constructor() {
    super("structure");
  }
  /**@returns los valores de configuracion predefinidos */
  protected override getDefault() {
    return StructureMiddlewareBuilder.getDefault();
  }
  /**caracter separador de la clave identificadora
   * de la funcion de middleware en el Map:
   *
   * Ejemplo:
   * ````
   * const moduleContext = "fieldVal";
   * const cKMS = "-"; //abreviado de chartKeyMiddlewareSeparator
   * //cualquier subtipo de identificacion segun el modulo
   * const keyActionConfig = "isTypeOf";
   *
   * const fullKeyMiddleware =
   *  `${moduleContext}${cKMS}${keyActionConfig}`;
   * ````
   */
  public static get chartKeyMiddlewareSeparator(): string {
    return Util_Middleware.getInstance().chartKeyMiddlewareSeparator;
  }
  protected override getMetaHandler<TModel>(
    keyPath: string
  ): StructureLogicMetadataHandler<
    TModel,
    TCriteriaInstance,
    TInFieldFormatInstance,
    TOutFieldFormatInstance,
    TInModelFormatInstance,
    TOutModelFormatInstance,
    TFieldValInstance,
    TModelValInstance,
    TRequestValInstance,
    TPreHookInstance,
    TPostHookInstance,
    TProviderInstance
  > {
    const r = StructureLogicMetadataHandler.getMetaHandler(keyPath) as any;
    return r;
  }
  /**... */
  public useCriteria(moduleContext: "criteria", keyPath: string): this {
    return this.use(moduleContext);
  }
  /**... */
  public useFormatter(
    moduleContext: "inFieldFormat",
    keyMiddlewareFn: keyof TInFieldFormatInstance["dfActionConfig"],
    keyPath: string
  ): this;
  public useFormatter(
    moduleContext: "outFieldFormat",
    keyMiddlewareFn: keyof TOutFieldFormatInstance["dfDiccActionConfig"],
    keyPath: string
  ): this;
  public useFormatter(
    moduleContext: "inModelFormat",
    keyMiddlewareFn: keyof TInModelFormatInstance["dfDiccActionConfig"],
    keyPath: string
  ): this;
  public useFormatter(
    moduleContext: "outModelFormat",
    keyMiddlewareFn: keyof TInModelFormatInstance["dfDiccActionConfig"],
    keyPath: string
  ): this;
  public useFormatter(
    moduleContext: TKeyStructureDeepMutateModuleContext,
    keyMiddlewareFn:
      | keyof TInFieldFormatInstance["dfDiccActionConfig"]
      | keyof TOutFieldFormatInstance["dfDiccActionConfig"]
      | keyof TInModelFormatInstance["dfDiccActionConfig"]
      | keyof TOutModelFormatInstance["dfDiccActionConfig"],
    keyPath: string
  ): this {
    return this.use(moduleContext, keyMiddlewareFn, keyPath);
  }
  /**... */
  public useValidator(
    moduleContext: "fieldVal",
    keyMiddlewareFn: keyof TFieldValInstance["dfDiccActionConfig"],
    keyPath: string
  ): this;
  public useValidator(
    moduleContext: "modelVal",
    keyMiddlewareFn: keyof TModelValInstance["dfDiccActionConfig"],
    keyPath: string
  ): this;
  public useValidator(
    moduleContext: "requestVal",
    keyMiddlewareFn: keyof TRequestValInstance["dfDiccActionConfig"],
    keyPath: string
  ): this;
  public useValidator(
    moduleContext: TKeyStructureDeepValModuleContext,
    keyMiddlewareFn:
      | keyof TFieldValInstance["dfDiccActionConfig"]
      | keyof TModelValInstance["dfDiccActionConfig"]
      | keyof TRequestValInstance["dfDiccActionConfig"],
    keyPath: string
  ): this {
    return this.use(moduleContext, keyMiddlewareFn, keyPath);
  }
  /**... */
  public useHook(
    moduleContext: "preHook",
    keyMiddlewareFn: keyof TPreHookInstance["dfDiccActionConfig"],
    keyPath: string
  ): this;
  public useHook(
    moduleContext: "postHook",
    keyMiddlewareFn: keyof TPostHookInstance["dfDiccActionConfig"],
    keyPath: string
  ): this;
  public useHook(
    moduleContext: TKeyStructureHookModuleContext,
    keyMiddlewareFn:
      | keyof TPreHookInstance["dfDiccActionConfig"]
      | keyof TPostHookInstance["dfDiccActionConfig"],
    keyPath: string
  ): this {
    return this.use(moduleContext, keyMiddlewareFn, keyPath);
  }
  /**... */
  public useProvider(moduleContext: "provider", keyPath: string): this {
    return this.use(moduleContext);
  }
  /** */
  public override use(
    moduleContext: TStructureMiddlewareModuleContext,
    keyMiddlewareFn:
      | keyof TInFieldFormatInstance["dfActionConfig"]
      | keyof TOutFieldFormatInstance["dfActionConfig"]
      | keyof TInModelFormatInstance["dfActionConfig"]
      | keyof TOutModelFormatInstance["dfActionConfig"]
      | keyof TFieldValInstance["dfActionConfig"]
      | keyof TModelValInstance["dfActionConfig"]
      | keyof TRequestValInstance["dfActionConfig"]
      | keyof TPreHookInstance["dfActionConfig"]
      | keyof TPostHookInstance["dfActionConfig"],
    keyPath: string
  ): this {
    let middlewareFn: TFnModuleMiddleware<any>;
    const mH = this.getMetaHandler(keyPath);
    const {
      criteriaInstance,
      inFieldFormatInstance,
      outFieldFormatInstance,
      inModelFormatInstance,
      outModelFormatInstance,
      fieldValInstance,
      modelValInstance,
      requestValInstance,
      preHookInstance: preHookInstcane,
      postHookInstance,
      providerInstance: providerInstnace,
    } = mH.getDiccModuleInstanceContext("structureModel");
    if (moduleContext === "criteria") {
    } else if (moduleContext === "inFieldFormat") {
      const inst = inFieldFormatInstance;
      middlewareFn = inst.getActionConfigFnByKey(keyMiddlewareFn as any);
    } else if (moduleContext === "outFieldFormat") {
      const inst = outFieldFormatInstance;
      middlewareFn = inst.getActionConfigFnByKey(keyMiddlewareFn as any);
    } else if (moduleContext === "inModelFormat") {
      const inst = inModelFormatInstance;
      middlewareFn = inst.getActionConfigFnByKey(keyMiddlewareFn as any);
    } else if (moduleContext === "outModelFormat") {
      const inst = outModelFormatInstance;
      middlewareFn = inst.getActionConfigFnByKey(keyMiddlewareFn as any);
    } else if (moduleContext === "fieldVal") {
      const inst = fieldValInstance;
      middlewareFn = inst.getActionFnByKey(keyMiddlewareFn as any);
    } else if (moduleContext === "modelVal") {
      const inst = modelValInstance;
      middlewareFn = inst.getActionFnByKey(keyMiddlewareFn as any);
    } else if (moduleContext === "requestVal") {
      const inst = requestValInstance;
      middlewareFn = inst.getActionConfigFnByKey(keyMiddlewareFn as any);
    } else if (moduleContext === "preHook") {
      const inst = preHookInstcane;
      middlewareFn = inst.getActionConfigFnByKey(keyMiddlewareFn as any);
    } else if (moduleContext === "postHook") {
      const inst = postHookInstance;
      middlewareFn = inst.getActionConfigFnByKey(keyMiddlewareFn as any);
    } else if (moduleContext === "provider") {
    } else {
      throw new LogicError({
        code: ELogicCodeError.MODULE_ERROR,
        msn: `${moduleContext} does not module context valid`,
      });
    }
    //asignacion de clave para el map
    const sp = this.util.chartKeyMiddlewareSeparator;
    const keyFullMiddleware = `${moduleContext}${sp}${
      keyMiddlewareFn as string
    }`;
    this.middlewareMap.set(keyFullMiddleware, middlewareFn);
    return this;
  }
  protected override buildBag(
    param?: Partial<Trf_IStructureMiddlewareBag>,
    preParam?: Trf_IStructureMiddlewareBag
  ): Trf_IStructureMiddlewareBag {
    const bag = StructureMiddlewareBuilder.buildBag(param, preParam);
    return bag;
  }
  /**... */
  protected static buildBag(
    param?: Partial<Trf_IStructureMiddlewareBag>,
    preParam?: Trf_IStructureMiddlewareBag
  ): Trf_IStructureMiddlewareBag {
    const util = Util_Middleware.getInstance();
    let bag: Trf_IStructureMiddlewareBag;
    const df = util.isObject(preParam)
      ? preParam
      : StructureMiddlewareBuilder.getDefault().bag;
    const pa = param;
    if (!util.isObject(pa)) {
      bag = df;
    } else {
      bag = {
        data: pa.data,
        keySrc: pa.keySrc,
        keyPath: pa.keyPath,
        cursorCriteria: util.isObject(pa.cursorCriteria)
          ? pa.cursorCriteria
          : df.cursorCriteria,
        diccInFieldFormatAC: util.isObject(pa.diccInFieldFormatAC)
          ? pa.diccInFieldFormatAC
          : df.diccInFieldFormatAC,
        diccOutFieldFormatAC: util.isObject(pa.diccOutFieldFormatAC)
          ? pa.diccOutFieldFormatAC
          : df.diccOutFieldFormatAC,
        diccInModelFormatAC: util.isObject(pa.diccInModelFormatAC)
          ? pa.diccInModelFormatAC
          : df.diccInModelFormatAC,
        diccOutModelFormatAC: util.isObject(pa.diccOutModelFormatAC)
          ? pa.diccOutModelFormatAC
          : df.diccOutModelFormatAC,
        diccFieldValAC: util.isObject(pa.diccFieldValAC)
          ? pa.diccFieldValAC
          : df.diccFieldValAC,
        diccModelValAC: util.isObject(pa.diccModelValAC)
          ? pa.diccModelValAC
          : df.diccModelValAC,
        diccRequestValAC: util.isObject(pa.diccRequestValAC)
          ? pa.diccRequestValAC
          : df.diccRequestValAC,
        diccPreHookAC: util.isObject(pa.diccPreHookAC)
          ? pa.diccPreHookAC
          : df.diccPreHookAC,
        diccPostHookAC: util.isObject(pa.diccPostHookAC)
          ? pa.diccPostHookAC
          : df.diccPostHookAC,
        cursorProvider: util.isObject(pa.cursorProvider)
          ? pa.cursorProvider
          : df.cursorProvider,
        responses: util.isArray(pa.responses, true) //❗Acpetar vacios para poder reiniciarlo❗
          ? pa.responses
          : df.responses,
      };
    }
    return bag;
  }
  public override mutateBag(
    bag: Trf_IStructureMiddlewareBag | undefined,
    param: Partial<Trf_IStructureMiddlewareBag>
  ): IStructureMiddlewareBag<
    TCriteriaInstance["any"],
    TInFieldFormatInstance["dfDiccActionConfig"],
    TOutFieldFormatInstance["dfDiccActionConfig"],
    TInModelFormatInstance["dfDiccActionConfig"],
    TOutModelFormatInstance["dfDiccActionConfig"],
    TFieldValInstance["dfDiccActionConfig"],
    TModelValInstance["dfDiccActionConfig"],
    TRequestValInstance["dfDiccActionConfig"],
    TPreHookInstance["dfDiccActionConfig"],
    TPostHookInstance["dfDiccActionConfig"],
    TProviderInstance["any"]
  > {
    bag = StructureMiddlewareBuilder.mutateBag(bag, param) as any;
    return bag as any;
  }
  /**... */
  public static mutateBag(
    bag: Trf_IStructureMiddlewareBag | undefined,
    param: Partial<Trf_IStructureMiddlewareBag>
  ): IStructureMiddlewareBag<
    any,
    InFieldLogicFormatter,
    OutFieldLogicFormatter,
    InModelLogicFormatter,
    OutModelLogicFormatter,
    FieldLogicValidation,
    ModelLogicValidation,
    RequestLogicValidation,
    StructurePreLogicHook,
    StructurePostLogicHook,
    any
  > {
    const util = Util_Middleware.getInstance();
    bag = !util.isObject(bag)
      ? StructureMiddlewareBuilder.buildBag(param, undefined)
      : StructureMiddlewareBuilder.buildBag(param, bag);
    return bag as any;
  }
  /** */
  public async run(
    bag: IStructureMiddlewareBag,
    keyMdrInit?: string
  ): Promise<StructureMiddlewareReportHandler> {
    this.setMiddlewareToTuple(keyMdrInit);
    const len = this.middlewareTuple[0].length;
    let idx = this.idxInit;
    const next = async () => {
      if (len <= 0) return; //no hay middlewares que ejecutar
      this.updateCurrentKeyByIdx(idx);
      const middlewareStatus = this.currentMiddlewareStatus;
      const keyMiddleware = middlewareStatus.currentKey;
      const middlewareFn = this.getMiddlewareFnByKey(keyMiddleware);
      const res = await middlewareFn(bag, middlewareStatus);
      bag.responses.push(res as IStructureResponseForMiddleware);
      if (res.tolerance <= res.status) return; //no se pueden ejecutar los demas middlewares
      idx++;
      if (idx < len) await next();
    };
    await next(); //ejecuta next fantasma (inicia trampolin)
    const report = new StructureMiddlewareReportHandler({
      middlewareFinalStatus: this.getMiddlewareFinalStatus(),
      responses: bag.responses,
    });
    this.clearMiddlewareStack("soft");
    return report;
  }
}
