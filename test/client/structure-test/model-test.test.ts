import { describe, expect, test, it } from "vitest";
import { ModelTestCtrl } from "./module-context/controller/ctrl-test";
import { StructureCriteriaHandler } from "../../../src/seed/logic/criterias/structure-criteria-handler";

const ctrl = new ModelTestCtrl();
const keyPath = ctrl.metadataHandler.findKeyPathByExtract("_id");
const bagCtrl = ctrl.buildBagCtrl("fieldCtrl", {
  data: "  hola ",
  keyPath,
  diccGlobalAC: {
    // fieldMutate: {
    //   anyTrim: true,
    // },
    // fieldVal: {
    //   //isTypeOf: true,
    //   isRequired: true,
    // },
  },
  criteriaHandler: new StructureCriteriaHandler(ctrl.keySrc, {
    type: "read",
  }),
});
const d = ctrl.runGenericFieldRequest(bagCtrl);
d.then((response) => {
  console.log(response);
}).catch((error) => {
  console.log(error);
});
describe("case: Hola Mundo", () => {
  it("case: Hola Mundo", () => {
    expect("hola").toBe("hola");
  });
});
