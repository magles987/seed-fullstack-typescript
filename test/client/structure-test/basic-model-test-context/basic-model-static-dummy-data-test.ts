import { BasicModelTest } from "./basic-model-test";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**interfaz para diccionario de datos invalido */
interface IDiccDataInvalidForModify {
  _undefined_: BasicModelTest;
  _null_: BasicModelTest;
  _boolean_: BasicModelTest;
  _number_: BasicModelTest;
  _string_: BasicModelTest;
  _object_: BasicModelTest;
  _array_: BasicModelTest;
}
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**obtener el backup de los datos válidos */
function getBkAData_valid() {
  return [
    {
      _id: "1",
      pathDoc: "/1/",
    },
    {
      _id: "2",
      pathDoc: "/2/",
    },
    {
      _id: "3",
      pathDoc: "/3/",
    },
    {
      _id: "4",
      pathDoc: "/4/",
    },
    {
      _id: "5",
      pathDoc: "/5/",
    },
  ] as Array<BasicModelTest>;
}
/**... */
function getSingleDataValid() {
  return {
    _id: "10",
    pathDoc: "/10/",
  } as BasicModelTest;
}
/**obtener el backup de los datos inválidos */
function getBkAData_invalid() {
  return [
    {
      _id: "1",
      pathDoc: null,
    },
    {
      _id: "2",
      pathDoc: undefined,
    },
    {
      _id: "3",
      pathDoc: 3,
    },
    {
      _id: "4",
      pathDoc: "alguna cosa",
    },
    {
      _id: "5",
      pathDoc: {},
    },
  ] as Array<BasicModelTest>;
}
/**... */
function getDiccDataForModify() {
  return {
    _undefined_: {
      _id: undefined as any,
      pathDoc: undefined as any,
    },
    _null_: {
      _id: undefined as any,
      pathDoc: undefined as any,
    },
    _boolean_: {
      _id: false as any,
      pathDoc: true as any,
    },
    _number_: {
      _id: 1 as any,
      pathDoc: 0 as any,
    },
    _string_: {
      _id: "lo que sea",
      pathDoc: "lo que sea",
    },
    _object_: {
      _id: { a: 1, b: "2", c: true } as any,
      pathDoc: { a: 1, b: "2", c: true } as any,
    },
    _array_: {
      _id: [1, 2, 3] as any,
      pathDoc: ["1", "2", "3"] as any,
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
