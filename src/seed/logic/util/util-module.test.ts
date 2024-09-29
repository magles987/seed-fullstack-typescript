import { describe, expect, test, it } from "vitest";
import {} from "./util-logic";
import { Util_Module } from "./util-module";

const util = Util_Module.getInstance();

describe("cases: Utilities", async () => {
  describe("method selectOnlyProperties", async () => {
    it("mutando el diccionario", async () => {
      const dicc = {
        __p1: "es especila",
        __p2: "es especila",
        _id: "no es especial",
        nombre: "si que menos es especial",
      };
      const prefPropsInc = [/^__/];
      const propsExc = ["_id"];
      const vExp = {
        _id: "no es especial",
        nombre: "si que menos es especial",
      };
      const recived = util.selectOnlyProperties(dicc, prefPropsInc, propsExc);
      expect(recived).toMatchObject(vExp);
    });
  });
});
