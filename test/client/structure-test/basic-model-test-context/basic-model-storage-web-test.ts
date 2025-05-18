import { StorageDriver } from "../../../../src/logic/providers/drivers/client/web/local-repositories/storage/storage-driver";
import { BasicModelTest, getBasicModelTestCtrl } from "./basic-model-test";
import {
  ELogicResStatusCode,
  IStructureResponse,
} from "../../../../src/logic/reports/shared-types";
import { bd_valid, dataValid } from "./basic-model-static-dummy-data-test";
import { ScreenBrowserResponseUtil } from "../../../util/screen-browser-response-util";
import { TwinBeeModule } from "../../../../src/logic/modules/module";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/**... */
export async function runToLocalStorage() {
  const screenBrowserLog = ScreenBrowserResponseUtil.getInstance();
  const ctrl = getBasicModelTestCtrl();
  const util = ctrl.twinBeeUtil;
  const nameLogicDriver = StorageDriver.getNameLogicDriver();
  const commonBaseCriteria = ctrl.getEmptyBaseModelCriteria();
  commonBaseCriteria.diccGlobalAC = {
    structureProvider: { singleRunDriver: { nameLogicDriver } },
  };
  await StorageDriver.emptyAllStorage();
  let res: IStructureResponse;
  //████ Creación y comprobación inicial ████████████████████████████████████████████████████████████
  //====Crear todos los registros===========================
  //debe ser for clásico para que haga las esperas correspondientes a cada creación
  for (const data of bd_valid) {
    res = await ctrl.modifyRequest({
      ...commonBaseCriteria,
      keyActionRequest: "create",
      data,
    });
    screenBrowserLog.showStructureResponseTest(
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
  res = await ctrl.readRequest({
    ...commonBaseCriteria,
    keyActionRequest: "readAll",
  });
  screenBrowserLog.showStructureResponseTest(
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
  //████ Lecturas generales ████████████████████████████████████████████████████████████
  //====Leer todos los registros (con limite) ===========================
  res = await ctrl.readRequest({
    ...commonBaseCriteria,
    keyActionRequest: "readAll",
    limit: 2, //solo 2
  });
  screenBrowserLog.showStructureResponseTest(
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
  res = await ctrl.readRequest({
    ...commonBaseCriteria,
    keyActionRequest: "readAll",
    limit: 2, //solo 2
    targetPageLogic: 1, //lógica de inicio de paginación en 1
    targetPage: 2, //pagina 2 (serian los _id === '3' y _id === '4')
  });
  screenBrowserLog.showStructureResponseTest(
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
  res = await ctrl.readRequest({
    ...commonBaseCriteria,
    keyActionRequest: "exist",
    diccQueryParam: { _pathDoc: "/1/" }, //buscar si existe este path?
  });
  screenBrowserLog.showStructureResponseTest(
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
  //====verificar conteo de registro (según diccionario de parámetros de consulta) ==============
  res = await ctrl.readRequest({
    ...commonBaseCriteria,
    keyActionRequest: "count",
    diccQueryParam: { _pathDoc: "/1/" }, //buscar si existe este path?
  });
  screenBrowserLog.showStructureResponseTest(
    {
      data: res.data,
      status: res.status,
      responses: res.responses,
    },
    {
      data: 1,
      status: ELogicResStatusCode.SUCCESS,
    },
    {
      keyAction: `count`,
      detail: `count the search by _pathDoc`,
    }
  );
  res = await ctrl.readRequest({
    ...commonBaseCriteria,
    keyActionRequest: "readById",
    diccQueryParam: { _id: "1" }, //buscar si existe este id?
  });
  screenBrowserLog.showStructureResponseTest(
    {
      data: res.data,
      status: res.status,
      responses: res.responses,
    },
    {
      data: bd_valid[0],
      status: ELogicResStatusCode.SUCCESS,
    },
    {
      keyAction: `exist`,
      detail: `exists for the search by _pathDoc`,
    }
  );
  //████ Modificaciones generales ████████████████████████████████████████████████████████████
  let dt = dataValid;
  res = await ctrl.modifyRequest({
    ...commonBaseCriteria,
    keyActionRequest: "create",
    data: dt,
  });
  screenBrowserLog.showStructureResponseTest(
    {
      data: res.data,
      status: res.status,
      responses: res.responses,
    },
    {
      data: { ...dt },
      status: ELogicResStatusCode.SUCCESS,
    },
    {
      keyAction: `exist`,
      detail: `exists for the search by _pathDoc`,
    }
  );
  res = await ctrl.modifyRequest({
    ...commonBaseCriteria,
    keyActionRequest: "update",
    data: { ...dt, _pathDoc: "      /100/       " }, //modificación con espacios para probar el modulo de mutación
  });
  screenBrowserLog.showStructureResponseTest(
    {
      data: res.data,
      status: res.status,
      responses: res.responses,
    },
    {
      data: { ...dt, _pathDoc: "/100/" } as BasicModelTest,
      status: ELogicResStatusCode.SUCCESS,
    },
    {
      keyAction: `exist`,
      detail: `exists for the search by _pathDoc`,
    }
  );
  res = await ctrl.modifyRequest({
    ...commonBaseCriteria,
    keyActionRequest: "delete",
    data: { _id: dt._id, _pathDoc: undefined as any },
  });
  screenBrowserLog.showStructureResponseTest(
    {
      data: res.data,
      status: res.status,
      responses: res.responses,
    },
    {
      data: { _id: dt._id } as BasicModelTest,
      status: ELogicResStatusCode.SUCCESS,
    },
    {
      keyAction: `exist`,
      detail: `exists for the search by _pathDoc`,
    }
  );
  //████ Modificaciones invalidas ████████████████████████████████████████████████████████████
  res = await ctrl.modifyRequest({
    ...commonBaseCriteria,
    keyActionRequest: "create",
    data: dt,
  });
  return;
}
