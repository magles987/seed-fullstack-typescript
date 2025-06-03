import { AnonymousDeepModelTest } from "./anonymous-deep-model-test";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**interfaz para diccionario de datos invalido */
interface IDiccDataInvalidForModify {
  _undefined_: AnonymousDeepModelTest;
  _null_: AnonymousDeepModelTest;
  _boolean_: AnonymousDeepModelTest;
  _number_: AnonymousDeepModelTest;
  _string_: AnonymousDeepModelTest;
  _object_: AnonymousDeepModelTest;
  _array_: AnonymousDeepModelTest;
}
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**obtener el backup de los datos válidos */
function getBkAData_valid() {
  return [
    {
      _id: "1",
      myAnonymousObject: {
        a: 1,
        b: "uno",
        c: false,
        d: {
          d1: 11,
          d2: "once",
        },
        e: ["item11", "item12"],
        f: [1, "uno"],
      },
    },
    {
      _id: "2",
      myAnonymousObject: {
        a: 2,
        b: "dos",
        c: true,
        d: {
          d1: 21,
          d2: "veintiuno",
        },
        e: ["item21", "item22"],
        f: [2, "dos"],
      },
    },
    {
      _id: "3",
      myAnonymousObject: {
        a: 3,
        b: "tres",
        c: false,
        d: {
          d1: 31,
          d2: "treintayuno",
        },
        e: ["item31", "item32"],
        f: [3, "tres"],
      },
    },
    {
      _id: "4",
      myAnonymousObject: {
        a: 4,
        b: "cuatro",
        c: true,
        d: {
          d1: 41,
          d2: "cuarentayuno",
        },
        e: ["item41", "item42"],
        f: [4, "cuatro"],
      },
    },
    {
      _id: "5",
      myAnonymousObject: {
        a: 5,
        b: "cinco",
        c: false,
        d: {
          d1: 51,
          d2: "cincuentayuno",
        },
        e: ["item51", "item52"],
        f: [5, "cinco"],
      },
    },
  ] as Array<AnonymousDeepModelTest>;
}
/**... */
function getSingleDataValid() {
  return {
    _id: "10",
    myAnonymousObject: {
      a: 10,
      b: "diez",
      c: false,
      d: {
        d1: 101,
        d2: "cientouno",
      },
      e: ["item101", "item102"],
      f: [10, "diez"],
    },
  } as AnonymousDeepModelTest;
}
/**obtener el backup de los datos inválidos */
function getBkAData_invalid() {
  return [
    {
      _id: "1",
      myAnonymousObject: undefined as any,
    },
    {
      _id: "2",
      myAnonymousObject: null as any,
    },
    {
      _id: "3",
      myAnonymousObject: {
        a: 3,
        b: 3, //debería ser string
      },
    },
    {
      _id: "4",
      myAnonymousObject: {
        a: 3,
        b: 3, //debería ser string
      },
    },
    {
      _id: "5",
    },
  ] as Array<AnonymousDeepModelTest>;
}
/**base de datos (en memoria) ficticia con datos válidos para pruebas*/
export var bd_valid = getBkAData_valid();
/**base de datos (en memoria) ficticia con datos inválidos para pruebas*/
export var bd_invalid = getBkAData_invalid();
/**dato valido para acción de modificación */
export var dataValid = getSingleDataValid();
