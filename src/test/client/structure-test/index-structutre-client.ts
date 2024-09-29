import { StructureCriteriaHandler } from "../../../seed/logic/criterias/structure-criteria-handler";
import { ModelTestCtrl } from "./ctrl-test";
import { ModelTest } from "./model-test";
const modelTestCtrl = new ModelTestCtrl();
const ctrl = modelTestCtrl;
const data: ModelTest = {
  _id: "1",
  _pathDoc: "/1/",
};
ctrl.runGenericModelRequest("create", {
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

export function runStructureTestClient() {
  return {
    modelTestCtrl,
  };
}
