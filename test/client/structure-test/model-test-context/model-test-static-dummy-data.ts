import { ModelTest } from "./model-test_full";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**interfaz para diccionario de datos invalido */
interface IDiccDataInvalidForModify {
  _undefined_: ModelTest;
  _null_: ModelTest;
  _boolean_: ModelTest;
  _number_: ModelTest;
  _string_: ModelTest;
  _object_: ModelTest;
  _array_: ModelTest;
}
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**obtener el backup de los datos válidos */
function getBkAData_valid() {
  return [
    {
      _id: "1",
      _pathDoc: "/1/",
    },
    {
      _id: "2",
      _pathDoc: "/2/",
    },
    {
      _id: "3",
      _pathDoc: "/3/",
    },
    {
      _id: "4",
      _pathDoc: "/4/",
    },
    {
      _id: "5",
      _pathDoc: "/5/",
    },
  ] as Array<ModelTest>;
}
/**... */
function getSingleDataValid() {
  return {
    _id: "10",
    _pathDoc: "/10/",
  } as ModelTest;
}
/**obtener el backup de los datos inválidos */
function getBkAData_invalid() {
  return [
    {
      _id: "1",
      _pathDoc: null,
    },
    {
      _id: "2",
      _pathDoc: undefined,
    },
    {
      _id: "3",
      _pathDoc: 3,
    },
    {
      _id: "4",
      _pathDoc: "alguna cosa",
    },
    {
      _id: "5",
      _pathDoc: {},
    },
  ] as Array<ModelTest>;
}
/**... */
function getDiccDataForModify() {
  return {
    _undefined_: {
      _id: undefined as any,
      _pathDoc: undefined as any,
    },
    _null_: {
      _id: undefined as any,
      _pathDoc: undefined as any,
    },
    _boolean_: {
      _id: false as any,
      _pathDoc: true as any,
    },
    _number_: {
      _id: 1 as any,
      _pathDoc: 0 as any,
    },
    _string_: {
      _id: "lo que sea",
      _pathDoc: "lo que sea",
    },
    _object_: {
      _id: { a: 1, b: "2", c: true } as any,
      _pathDoc: { a: 1, b: "2", c: true } as any,
    },
    _array_: {
      _id: [1, 2, 3] as any,
      _pathDoc: ["1", "2", "3"] as any,
    },
  } as IDiccDataInvalidForModify;
}
/**base de datos (en memoria) ficticia con datos válidos para pruebas*/
export var bd_valid = getBkAData_valid();
/**base de datos (en memoria) ficticia con datos inválidos para pruebas*/
export var bd_invalid = getBkAData_invalid();
/**dato valido para acción de modificación */
export var dataValid = getSingleDataValid();
/**diccionario de datos inválidos agrupados */
export var diccDataInvalidForModify = getDiccDataForModify();
