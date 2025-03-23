import { Util_Test } from "../../../../util-test";
import { CookieDriver } from "../../../../../src/seed/logic/providers/_drivers/client/web/local-repositories/cookie/cookie-driver";
import {
  ELogicResStatusCode,
  IStructureResponse,
} from "../../../../../src/seed/logic/reports/shared";
import { ModelTestCtrl__full } from "../model-test-ctrl__full";
import { bd_valid } from "../model-test-static-dummy-data";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
const util = Util_Test.getInstance();
const ctrl = new ModelTestCtrl__full();
const nameLogicDriver = CookieDriver.getNameLogicDriver();
/**... */
export async function runToLocalCookie() {
  await CookieDriver.emptyAllCookies();
  let res: IStructureResponse;
  //████ Creación y comprobación inicial ████████████████████████████████████████████████████████████
  //====Crear todos los registros===========================
  //debe ser for clásico para que haga las esperas correspondientes a cada creación
  for (const data of bd_valid) {
    res = await ctrl.create(
      {
        diccGlobalAC: {
          structureProvider: {
            singleRunDriver: {
              nameLogicDriver,
            },
          },
        },
      },
      data
    );
    util.showStructureResponseTest(
      {
        data: res.data,
        status: res.status,
        responses: res.responses,
      },
      {
        data: { ...data },
        status: ELogicResStatusCode.SUCCESS,
      },
      {
        keyAction: `create`,
        detail: `creating full database, current data id: ${data._id}`,
      }
    );
  }
  //====Leer todos los registros (para verificar) ===========================
  res = await ctrl.readAll({
    diccGlobalAC: {
      structureProvider: {
        singleRunDriver: {
          nameLogicDriver,
        },
      },
    },
  });
  util.showStructureResponseTest(
    {
      data: res.data,
      status: res.status,
      responses: res.responses,
    },
    {
      data: [...bd_valid],
      status: ELogicResStatusCode.SUCCESS,
    },
    {
      keyAction: `readAll`,
      detail: `first read, should de empty array`,
    }
  );
  //████ consultas generales ████████████████████████████████████████████████████████████
  //====Leer todos los registros (con limite) ===========================
  res = await ctrl.readAll({
    diccGlobalAC: {
      structureProvider: {
        singleRunDriver: {
          nameLogicDriver,
        },
      },
    },
    limit: 2, //solo 2
  });
  util.showStructureResponseTest(
    {
      data: res.data,
      status: res.status,
      responses: res.responses,
    },
    {
      data: [bd_valid[0], bd_valid[1]], //solo los 2 primeros elementos
      status: ELogicResStatusCode.SUCCESS,
    },
    {
      keyAction: `readAll`,
      detail: `read with defined limit`,
    }
  );
  //====Leer todos los registros (con limite y paginación) ==============
  res = await ctrl.readAll({
    diccGlobalAC: {
      structureProvider: {
        singleRunDriver: {
          nameLogicDriver,
        },
      },
    },
    limit: 2, //solo 2
    targetPageLogic: 1, //lógica de inicio de paginación en 1
    targetPage: 2, //pagina 2 (serian los _id === '3' y _id === '4')
  });
  util.showStructureResponseTest(
    {
      data: res.data,
      status: res.status,
      responses: res.responses,
    },
    {
      data: [bd_valid[2], bd_valid[3]], //pagina 2 (el tercer y cuarto registro)
      status: ELogicResStatusCode.SUCCESS,
    },
    {
      keyAction: `readAll`,
      detail: `read with defined limit and pagination`,
    }
  );
  //====verificar existencia de registro (según diccionario de parámetros de consulta) ==============
  res = await ctrl.exist({
    diccGlobalAC: {
      structureProvider: {
        singleRunDriver: {
          nameLogicDriver,
        },
      },
    },
    diccQueryParam: { _pathDoc: "/1/" }, //buscar si existe este id?
  });
  util.showStructureResponseTest(
    {
      data: res.data,
      status: res.status,
      responses: res.responses,
    },
    {
      data: true,
      status: ELogicResStatusCode.SUCCESS,
    },
    {
      keyAction: `exist`,
      detail: `exists for the search by _pathDoc`,
    }
  );
  //====verificar existencia de registro (según diccionario de parámetros de consulta) ==============
  res = await ctrl.count({
    diccGlobalAC: {
      structureProvider: {
        singleRunDriver: {
          nameLogicDriver,
        },
      },
    },
    diccQueryParam: { _pathDoc: "/1/" }, //buscar si existe este id?
  });
  util.showStructureResponseTest(
    {
      data: res.data,
      status: res.status,
      responses: res.responses,
    },
    {
      data: true,
      status: ELogicResStatusCode.SUCCESS,
    },
    {
      keyAction: `exist`,
      detail: `exists for the search by _pathDoc`,
    }
  );
  return;
}
