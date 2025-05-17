import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
  beforeAll,
  afterAll,
} from "vitest";
import startTwinBee from "../../../../src/start-twinbee";
import { getElementalModelTestCtrl } from "./elemental-model-test";
import { bd_valid, dataValid } from "./elemental-model-static-dummy-data-test";
import {
  ELogicResStatusCode,
  IStructureResponse,
} from "../../../../src/logic/reports/shared-types";
import { StorageDriver } from "../../../../src/logic/providers/drivers/client/web/local-repositories/storage/storage-driver";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
const GC = startTwinBee({
  environment: {
    envTest: "test-node",
    envGlobalLayout: "client",
    envStandard: "dev",
  },
});
describe("Model: elemental-model-test", async () => {
  // Creador de Mocks compartidos (para local y session)
  const createStorageMock = () => {
    const store: Record<string, string> = {};
    return {
      _store: store,
      getItem(key: string) {
        return this._store[key] || null;
      },
      setItem(key: string, value: string) {
        this._store[key] = value.toString();
      },
      removeItem(key: string) {
        delete this._store[key];
      },
      clear() {
        this._store = {};
      },
      get length() {
        return Object.keys(this._store).length;
      },
      key(index: number) {
        return Object.keys(this._store)[index] || null;
      },
    };
  };
  //hook que se ejecuta antes de todas las pruebas de este archivo
  beforeAll(() => {
    // Mock localStorage
    vi.stubGlobal("localStorage", createStorageMock());
    // Mock sessionStorage
    vi.stubGlobal("sessionStorage", createStorageMock());
    // Mock adicional para navegadores antiguos (opcional)
    vi.stubGlobal("window", {
      localStorage: global.localStorage,
      sessionStorage: global.sessionStorage,
    });
  });
  //hook que se ejecuta después de todas las pruebas de este archivo
  afterAll(() => {
    //desmockear
    vi.unstubAllGlobals();
  });
  //inicial test
  const ctrl = getElementalModelTestCtrl();
  const util = ctrl.twinBeeUtil;
  const nameLogicDriver = StorageDriver.getNameLogicDriver();
  const commonBaseCriteria = ctrl.getEmptyBaseModelCriteria();
  commonBaseCriteria.diccGlobalAC = {
    structureProvider: { singleRunDriver: { nameLogicDriver } },
  };
  describe("base: data valid", async () => {
    const db = bd_valid;
    //████ Creación y comprobación inicial ████████████████████████████████████████████████████████████
    //====Crear todos los registros===========================
    //debe ser for clásico para que haga las esperas correspondientes a cada creación
    for (let idx = 0; idx < db.length; idx++) {
      const data = db[idx];
      it(`action request: create (register[${idx}])`, async () => {
        const vExp = {
          data: { ...data },
          status: ELogicResStatusCode.VALID_DATA,
        } as IStructureResponse;
        let res = await ctrl.modifyRequest({
          ...commonBaseCriteria,
          data,
          keyActionRequest: "create",
        });
        expect(res).toMatchObject(vExp);
      });
    }
    //====Leer todos los registros (para verificar) ===========================
    it("action request: readAll", async () => {
      //const txData = { ...dataValid };
      const vExp = {
        data: [...db],
        status: ELogicResStatusCode.VALID_DATA,
      } as IStructureResponse;
      let res = await ctrl.readRequest({
        ...commonBaseCriteria,
        keyActionRequest: "readAll",
      });
      expect(res).toMatchObject(vExp);
    });
    it("action request: readAll (paged ang limited)", async () => {
      const txData = undefined;
      const vExp = {
        data: [db[2], db[3]], //pagina 2 (el tercer y cuarto registro)
        status: ELogicResStatusCode.VALID_DATA,
      } as IStructureResponse;
      const res = await ctrl.readRequest({
        ...commonBaseCriteria,
        keyActionRequest: "readAll",
        limit: 2, //solo 2
        targetPageLogic: 1, //lógica de inicio de paginación en 1
        targetPage: 2, //pagina 2 (serian los _id === '3' y _id === '4')
      });
      expect(res).toMatchObject(vExp);
    });
    it("action request: exists ", async () => {
      const txData = undefined;
      const vExp = {
        data: true,
        status: ELogicResStatusCode.VALID_DATA,
      } as IStructureResponse;
      const res = await ctrl.readRequest({
        ...commonBaseCriteria,
        keyActionRequest: "exist",
        diccQueryParam: { _pathDoc: "/1/" }, //buscar si existe este path
      });
      expect(res).toMatchObject(vExp);
    });
    it("action request: count ", async () => {
      const txData = undefined;
      const vExp = {
        data: 1, //pagina 2 (el tercer y cuarto registro)
        status: ELogicResStatusCode.VALID_DATA,
      } as IStructureResponse;
      const res = await ctrl.readRequest({
        ...commonBaseCriteria,
        keyActionRequest: "count",
        diccQueryParam: { _pathDoc: "/1/" }, //buscar si existe este path
      });
      expect(res).toMatchObject(vExp);
    });
    it("action request: create ", async () => {
      const txData = { ...dataValid };
      const vExp = {
        data: { ...txData },
        status: ELogicResStatusCode.VALID_DATA,
      } as IStructureResponse;
      const res = await ctrl.modifyRequest({
        ...commonBaseCriteria,
        keyActionRequest: "create",
        data: txData,
      });
      expect(res).toMatchObject(vExp);
    });
    it("action request: update ", async () => {
      const txData = { ...dataValid, _pathDoc: "     /100/       " }; //espacios para comprobar mutación
      const vExp = {
        data: { ...txData, _pathDoc: "/100/" }, //sin espacios (se mutó)
        status: ELogicResStatusCode.VALID_DATA,
      } as IStructureResponse;
      const res = await ctrl.modifyRequest({
        ...commonBaseCriteria,
        keyActionRequest: "update",
        data: txData,
      });
      expect(res).toMatchObject(vExp);
    });
    it("action request: delete ", async () => {
      const txData = { _id: dataValid._id };
      const vExp = {
        data: { ...txData },
        status: ELogicResStatusCode.VALID_DATA,
      } as IStructureResponse;
      const res = await ctrl.modifyRequest({
        ...commonBaseCriteria,
        keyActionRequest: "delete",
        data: txData as any,
      });
      expect(res).toMatchObject(vExp);
    });
  });
});
