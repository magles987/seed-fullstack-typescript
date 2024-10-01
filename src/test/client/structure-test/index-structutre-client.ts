import { StructureCriteriaHandler } from "../../../seed/logic/criterias/structure-criteria-handler";
import { LocalCookieRepository } from "../../../seed/logic/providers/services/client/web/local/repositories/local-cookie/_local-cookie-repository";
import { ModelTestCtrl } from "./ctrl-test";
import { ModelTest } from "./model-test";
const modelTestCtrl = new ModelTestCtrl();
const ctrl = modelTestCtrl;
const data: ModelTest = {
  _id: "1",
  _pathDoc: "/1/",
};
await LocalCookieRepository.emptyAllCookies();
let r = await ctrl.runGenericModelRequest("create", {
  data: data,
  criteriaHandler: new StructureCriteriaHandler(ctrl.metadataHandler.keySrc, {
    type: "modify",
    isCreateOrUpdate: false,
    modifyType: "create",
    keyActionRequest: "create",
  }),
  diccGlobalAC: {},
  keyPath: ctrl.metadataHandler.keyModelPath,
});
r = await ctrl.runGenericModelRequest("readAll", {
  data: data,
  criteriaHandler: new StructureCriteriaHandler(ctrl.metadataHandler.keySrc, {
    type: "read",
    keyActionRequest: "readAll",
  }),
  diccGlobalAC: {},
  keyPath: ctrl.metadataHandler.keyModelPath,
});
console.log("hola");
export function runStructureTestClient() {
  return {
    modelTestCtrl,
  };
}
