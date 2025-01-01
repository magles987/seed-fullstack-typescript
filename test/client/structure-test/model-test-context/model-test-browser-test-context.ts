import { LocalCookieRepository } from "../../../../src/seed/logic/providers/services/client/web/local/drivers/local-cookie/_local-cookie-repository";
import { LocalIDBRepository } from "../../../../src/seed/logic/providers/services/client/web/local/drivers/local-idb/_local-idb-repository";
import { LocalStorageRepository } from "../../../../src/seed/logic/providers/services/client/web/local/drivers/local-storage/_local-storage-repository";
import { IRunProvider } from "../../../../src/seed/logic/providers/shared-for-external-module";
import { IStructureResponse } from "../../../../src/seed/logic/reports/shared";
import { ModelTestCtrl__full } from "./model-test-ctrl__full";
import { dataValid } from "./model-test-static-dummy-data";
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
const ctrl = new ModelTestCtrl__full();

function show(res: IStructureResponse) {
  console.log(`
    ████ ${res.keyActionRequest} ████████████████████████████    
    data: ${JSON.stringify(res.data, null, 2)}
    status: ${res.status}
  `);
}

/**... */
async function runToLocalCookie() {
  await LocalCookieRepository.emptyAllCookies();
  const serviceToRun: IRunProvider["serviceToRun"] = {
    keyService: "local",
    keyDriver: "cookie",
  };
  let res: IStructureResponse;
  res = await ctrl.readAll({
    diccGlobalAC: { structureProvider: { runProvider: { serviceToRun } } },
  });
  show(res);
  res = await ctrl.create(
    {
      diccGlobalAC: { structureProvider: { runProvider: { serviceToRun } } },
    },
    {
      ...dataValid,
      _id: `    ${dataValid._id}     `, //para probar trim de la mutacion
    }
  );
  show(res);
  res = await ctrl.update(
    {
      diccGlobalAC: { structureProvider: { runProvider: { serviceToRun } } },
    },
    {
      ...dataValid,
      _id: res.data._id,
      _pathDoc: "/20/",
    }
  );
  show(res);
  res = await ctrl.delete(
    {
      diccGlobalAC: { structureProvider: { runProvider: { serviceToRun } } },
    },
    { ...res.data }
  );
  show(res);
  return;
}
async function runToLocalStorage() {
  await LocalStorageRepository.emptyAllStorage();
  const serviceToRun: IRunProvider["serviceToRun"] = {
    keyService: "local",
    keyDriver: "storage",
  };
  let res: IStructureResponse;
  res = await ctrl.readAll({
    diccGlobalAC: { structureProvider: { runProvider: { serviceToRun } } },
  });
  show(res);
  res = await ctrl.create(
    {
      diccGlobalAC: { structureProvider: { runProvider: { serviceToRun } } },
    },
    {
      ...dataValid,
    }
  );
  show(res);
  res = await ctrl.update(
    {
      diccGlobalAC: {
        structureProvider: { runProvider: { serviceToRun } },
      },
    },
    {
      ...dataValid,
      _id: res.data._id,
      _pathDoc: "/20/",
    }
  );
  show(res);
  res = await ctrl.delete(
    {
      diccGlobalAC: {
        structureProvider: { runProvider: { serviceToRun } },
      },
    },
    {
      ...res.data,
    }
  );
  console.log(res.status);
  show(res);
  return;
}
async function runToLocalIDB() {
  await LocalIDBRepository.deleteCurrentDataBase();
  const serviceToRun: IRunProvider["serviceToRun"] = {
    keyService: "local",
    keyDriver: "idb",
  };
  let res: IStructureResponse;
  res = await ctrl.readAll({
    diccGlobalAC: {
      structureProvider: { runProvider: { serviceToRun } },
    },
  });
  show(res);
  res = await ctrl.create(
    {
      diccGlobalAC: {
        structureProvider: { runProvider: { serviceToRun } },
      },
    },
    {
      ...dataValid,
    }
  );
  show(res);
  res = await ctrl.update(
    {
      diccGlobalAC: {
        structureProvider: { runProvider: { serviceToRun } },
      },
    },
    {
      ...dataValid,
      _id: res.data._id,
      _pathDoc: "/20/",
    }
  );
  show(res);
  res = await ctrl.delete(
    {
      diccGlobalAC: {
        structureProvider: { runProvider: { serviceToRun } },
      },
    },
    {
      ...res.data,
    }
  );
  show(res);
  return;
}
/**... */
export async function runModelTestBrowserContext() {
  await runToLocalCookie();
  await runToLocalStorage();
  await runToLocalIDB();
  return;
}
