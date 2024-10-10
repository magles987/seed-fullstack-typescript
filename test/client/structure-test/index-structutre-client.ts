import { LocalCookieRepository } from "../../../src/seed/logic/providers/services/client/web/local/repositories/local-cookie/_local-cookie-repository";
import { LocalIDBRepository } from "../../../src/seed/logic/providers/services/client/web/local/repositories/local-idb/_local-idb-repository";
import { LocalStorageRepository } from "../../../src/seed/logic/providers/services/client/web/local/repositories/local-storage/_local-storage-repository";
import { IRunProvider } from "../../../src/seed/logic/providers/shared-for-external-module";
import { getClientConfig } from "./client-config";
const { ctrl, diccTestData } = getClientConfig();
/**... */
async function runToLocalCookie() {
  await LocalCookieRepository.emptyAllCookies();
  const keyPath = ctrl.metadataHandler.keyModelPath;
  const serviceToRun: IRunProvider["serviceToRun"] = {
    keyService: "local",
    keyDriver: "cookie"
  };
  let res = await ctrl.runGenericModelRequest("readAll", {
    data: undefined,
    criteriaHandler: ctrl.buildCriteriaHandler("read", "readAll", {
      expectedDataType: "array",
    }),
    diccGlobalAC: {
      structureProvider: { runProvider: { serviceToRun } },
    },
    keyPath,
  });
  console.log(res.status);
  res = await ctrl.runGenericModelRequest("create", {
    data: diccTestData.valid,
    criteriaHandler: ctrl.buildCriteriaHandler("modify", "create", {
      modifyType: "create",
      expectedDataType: "single",
      isCreateOrUpdate: false,
    }),
    diccGlobalAC: {
      structureProvider: { runProvider: { serviceToRun } }
    },
    keyPath,
  });
  console.log(res.status);
  res = await ctrl.runGenericModelRequest("update", {
    data: {
      ...diccTestData.valids[1],
      _id: res.data._id
    },
    criteriaHandler: ctrl.buildCriteriaHandler("modify", "update", {
      modifyType: "update",
      expectedDataType: "single",
      isCreateOrUpdate: false,
    }),
    diccGlobalAC: {
      structureProvider: { runProvider: { serviceToRun } }
    },
    keyPath,
  });
  console.log(res.status);
  res = await ctrl.runGenericModelRequest("delete", {
    data: res.data,
    criteriaHandler: ctrl.buildCriteriaHandler("modify", "delete", {
      modifyType: "delete",
      expectedDataType: "single",
    }),
    diccGlobalAC: {
      structureProvider: { runProvider: { serviceToRun } }
    },
    keyPath,
  });
  console.log(res.status);
  return;
}
async function runToLocalStorage() {
  await LocalStorageRepository.emptyAllStorage();
  const keyPath = ctrl.metadataHandler.keyModelPath;
  const serviceToRun: IRunProvider["serviceToRun"] = {
    keyService: "local",
    keyDriver: "storage"
  };
  let res = await ctrl.runGenericModelRequest("readAll", {
    data: undefined,
    criteriaHandler: ctrl.buildCriteriaHandler("read", "readAll", {
      expectedDataType: "array",
    }),
    diccGlobalAC: {
      structureProvider: { runProvider: { serviceToRun } }
    },
    keyPath,
  });
  console.log(res.status);
  res = await ctrl.runGenericModelRequest("create", {
    data: diccTestData.valid,
    criteriaHandler: ctrl.buildCriteriaHandler("modify", "create", {
      modifyType: "create",
      expectedDataType: "single",
      isCreateOrUpdate: false,
    }),
    diccGlobalAC: {
      structureProvider: { runProvider: { serviceToRun } }
    },
    keyPath,
  });
  console.log(res.status);
  res = await ctrl.runGenericModelRequest("update", {
    data: {
      ...diccTestData.valids[1],
      _id: res.data._id
    },
    criteriaHandler: ctrl.buildCriteriaHandler("modify", "update", {
      modifyType: "update",
      expectedDataType: "single",
      isCreateOrUpdate: false,
    }),
    diccGlobalAC: {
      structureProvider: { runProvider: { serviceToRun } }
    },
    keyPath,
  });
  console.log(res.status);
  res = await ctrl.runGenericModelRequest("delete", {
    data: res.data,
    criteriaHandler: ctrl.buildCriteriaHandler("modify", "delete", {
      modifyType: "delete",
      expectedDataType: "single",
    }),
    diccGlobalAC: {
      structureProvider: { runProvider: { serviceToRun } }
    },
    keyPath,
  });
  console.log(res.status);
  return;
}
async function runToLocalIDB() {
  await LocalIDBRepository.deleteCurrentDataBase();
  const keyPath = ctrl.metadataHandler.keyModelPath;
  const serviceToRun: IRunProvider["serviceToRun"] = {
    keyService: "local",
    keyDriver: "idb"
  };
  let res = await ctrl.runGenericModelRequest("readAll", {
    data: undefined,
    criteriaHandler: ctrl.buildCriteriaHandler("read", "readAll", {
      expectedDataType: "array",
    }),
    diccGlobalAC: {
      structureProvider: { runProvider: { serviceToRun } }
    },
    keyPath,
  });
  console.log(res.status);
  res = await ctrl.runGenericModelRequest("create", {
    data: diccTestData.valid,
    criteriaHandler: ctrl.buildCriteriaHandler("modify", "create", {
      modifyType: "create",
      expectedDataType: "single",
      isCreateOrUpdate: false,
    }),
    diccGlobalAC: {
      structureProvider: { runProvider: { serviceToRun } }
    },
    keyPath,
  });
  console.log(res.status);
  res = await ctrl.runGenericModelRequest("update", {
    data: {
      ...diccTestData.valids[1],
      _id: res.data._id
    },
    criteriaHandler: ctrl.buildCriteriaHandler("modify", "update", {
      modifyType: "update",
      expectedDataType: "single",
      isCreateOrUpdate: false,
    }),
    diccGlobalAC: {
      structureProvider: { runProvider: { serviceToRun } }
    },
    keyPath,
  });
  console.log(res.status);
  res = await ctrl.runGenericModelRequest("delete", {
    data: res.data,
    criteriaHandler: ctrl.buildCriteriaHandler("modify", "delete", {
      modifyType: "delete",
      expectedDataType: "single",
    }),
    diccGlobalAC: {
      structureProvider: { runProvider: { serviceToRun } }
    },
    keyPath,
  });
  return;
}
/**... */
export async function runStructureTestClient() {
  await runToLocalCookie();
  await runToLocalStorage();
  await runToLocalIDB();
  return;
}
