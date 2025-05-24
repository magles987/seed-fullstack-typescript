import { DeepModelTest } from "./deep-model-test";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**interfaz para diccionario de datos invalido */
interface IDiccDataInvalidForModify {
  _undefined_: DeepModelTest;
  _null_: DeepModelTest;
  _boolean_: DeepModelTest;
  _number_: DeepModelTest;
  _string_: DeepModelTest;
  _object_: DeepModelTest;
  _array_: DeepModelTest;
}
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**obtener el backup de los datos válidos */
function getBkAData_valid() {
  return [
    {
      _id: "1",
    },
    {
      _id: "2",
    },
    {
      _id: "3",
    },
    {
      _id: "4",
    },
    {
      _id: "5",
    },
  ] as Array<DeepModelTest>;
}
/**... */
function getSingleDataValid() {
  return {
    _id: "10",
  } as DeepModelTest;
}
/**obtener el backup de los datos inválidos */
function getBkAData_invalid() {
  return [
    {
      _id: "1",
    },
    {
      _id: "2",
    },
    {
      _id: "3",
    },
    {
      _id: "4",
    },
    {
      _id: "5",
    },
  ] as Array<DeepModelTest>;
}
/**... */
function getDiccDataForModify() {
  return {
    _undefined_: {
      _id: undefined as any,
    },
    _null_: {
      _id: undefined as any,
    },
    _boolean_: {
      _id: false as any,
    },
    _number_: {
      _id: 1 as any,
    },
    _string_: {
      _id: "lo que sea",
    },
    _object_: {
      _id: { a: 1, b: "2", c: true } as any,
    },
    _array_: {
      _id: [1, 2, 3] as any,
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
