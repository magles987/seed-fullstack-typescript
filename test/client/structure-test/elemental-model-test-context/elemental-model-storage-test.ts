import { Util_Test } from "../../../util-test";
import { StorageDriver } from "../../../../src/seed/logic/providers/_drivers/client/web/local-repositories/storage/storage-driver";
import {
  buildElementalModelTestCtrl,
  ElementalModelTest,
} from "./elemental-model-test";
import {
  ELogicResStatusCode,
  IStructureResponse,
} from "../../../../src/seed/logic/reports/shared";
import { bd_valid, dataValid } from "./elemental-model-static-dummy-data-test";

//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
const util = Util_Test.getInstance();
const ctrl = buildElementalModelTestCtrl();
const nameLogicDriver = StorageDriver.getNameLogicDriver();
const commonBaseCriteria = ctrl.getEmptyBaseModelCritera();
commonBaseCriteria.diccGlobalAC = {
  structureProvider: { singleRunDriver: { nameLogicDriver } },
};
/**... */
export async function runToLocalStorage() {
  await StorageDriver.emptyAllStorage();
  let res: IStructureResponse;
  //████ Creación y comprobación inicial ████████████████████████████████████████████████████████████
  //====Crear todos los registros===========================
  //debe ser for clásico para que haga las esperas correspondientes a cada creación
  for (const data of bd_valid) {
    res = await ctrl.modifyRequest("create", data, {
      ...commonBaseCriteria,
    });
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
  res = await ctrl.readRequest("readAll", {
    ...commonBaseCriteria,
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
  //████ Lecturas generales ████████████████████████████████████████████████████████████
  //====Leer todos los registros (con limite) ===========================
  res = await ctrl.readRequest("readAll", {
    ...commonBaseCriteria,
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
  res = await ctrl.readRequest("readAll", {
    ...commonBaseCriteria,
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
  res = await ctrl.readRequest("exist", {
    ...commonBaseCriteria,
    diccQueryParam: { _pathDoc: "/1/" }, //buscar si existe este path?
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
  //====verificar conteo de registro (según diccionario de parámetros de consulta) ==============
  res = await ctrl.readRequest("count", {
    ...commonBaseCriteria,
    diccQueryParam: { _pathDoc: "/1/" }, //buscar si existe este path?
  });
  util.showStructureResponseTest(
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
  res = await ctrl.readRequest("readById", {
    ...commonBaseCriteria,
    diccQueryParam: { _id: "1" }, //buscar si existe este id?
  });
  util.showStructureResponseTest(
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
  res = await ctrl.modifyRequest("create", dt, {
    ...commonBaseCriteria,
  });
  util.showStructureResponseTest(
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
  res = await ctrl.modifyRequest(
    "update",
    { ...dt, _pathDoc: "      /100/       " }, //modificación con espacios para probar el modulo de mutación
    {
      ...commonBaseCriteria,
    }
  );
  util.showStructureResponseTest(
    {
      data: res.data,
      status: res.status,
      responses: res.responses,
    },
    {
      data: { ...dt, _pathDoc: "/100/" } as ElementalModelTest,
      status: ELogicResStatusCode.SUCCESS,
    },
    {
      keyAction: `exist`,
      detail: `exists for the search by _pathDoc`,
    }
  );
  res = await ctrl.modifyRequest(
    "delete",
    { _id: dt._id, _pathDoc: undefined as any },
    {
      ...commonBaseCriteria,
    }
  );
  util.showStructureResponseTest(
    {
      data: res.data,
      status: res.status,
      responses: res.responses,
    },
    {
      data: { _id: dt._id } as ElementalModelTest,
      status: ELogicResStatusCode.SUCCESS,
    },
    {
      keyAction: `exist`,
      detail: `exists for the search by _pathDoc`,
    }
  );
  //████ Modificaciones invalidas ████████████████████████████████████████████████████████████
  res = await ctrl.modifyRequest("create", dt, {
    ...commonBaseCriteria,
  });
  return;
}
