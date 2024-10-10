import { ModelTest } from "./module-context/model/model-test";
import { ModelTestCtrl__full } from "./module-context/controller/ctrl-test__full";

export function getClientConfig() {
  const ctrl = new ModelTestCtrl__full();
  return {
    ctrl,
    diccTestData: {
      _undefined_: {
        _id: undefined,
        _pathDoc: undefined,
      } as Record<keyof ModelTest, undefined>,
      _null_: {
        _id: null,
        _pathDoc: null,
      } as Record<keyof ModelTest, null>,
      _bool_: {
        _id: true,
        _pathDoc: true,
      } as Record<keyof ModelTest, boolean>,
      _number_: {
        _id: 0,
        _pathDoc: 1,
      } as Record<keyof ModelTest, number>,
      _string_: {
        _id: "  cualquier cosa  ",
        _pathDoc: "1/cualquiercosa/",
      } as Record<keyof ModelTest, string>,
      _emptyObject_: {
        _id: {},
        _pathDoc: {},
      } as Record<keyof ModelTest, {}>,
      _object_: {
        _id: { p1: 1, p2: "  cualquier cosa  " },
        _pathDoc: { p1: 1, p2: "1/cualquiercosa/" },
      } as Record<keyof ModelTest, object>,
      _emptyArray_: {
        _id: [],
        _pathDoc: [],
      } as Record<keyof ModelTest, Array<any>>,
      _array_: {
        _id: [1, 2, 3],
        _pathDoc: ["4", "5", "6"],
      } as Record<keyof ModelTest, any[]>,
      valid: {
        _id: "  1  ", //espacios para mutar
        _pathDoc: "   /1/    ",
      } as ModelTest,
      valids: [
        { _id: "1", _pathDoc: "/1/" },
        { _id: "2", _pathDoc: "/2/" },
        { _id: "3", _pathDoc: "/3/" },
      ] as Array<ModelTest>,
      invalids: [
        { _id: "1", _pathDoc: 1 },
        { _id: null, _pathDoc: "/2/" },
        { _id: "3", _pathDoc: true as any },
      ] as Array<ModelTest>,
    },
  }
}
