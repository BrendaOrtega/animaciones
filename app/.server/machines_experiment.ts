import { FetchModuleOptions } from "vite";
import {
  createHLSChunks,
  updateVideoVersions,
  uploadChunks,
  VIDEO_SIZE,
} from "./videoProcessing";
import { Agenda } from "@hokify/agenda";
import { fileExist } from "./tigris";

const MACHINES_API_URL = "https://api.machines.dev/v1/apps/animations/machines";
const INTERNAL_WORKER_URL = `http://worker.process.animations.internal:3000`;

export const generateVersion = async ({
  machineId,
  storageKey,
  size,
}: {
  storageKey: string;
  size: VIDEO_SIZE;
  machineId: string;
}) => {
  if (!machineId) return console.error("NO MACHINE ID FOUND");

  return await createHLSChunks({
    onError: () => stopMachine(machineId as string),
    storageKey,
    sizeName: size,
    checkExistance: false,
    cb: (path: string) => {
      uploadChunks(path, true, async () => {
        await updateVideoVersions(storageKey, size);
        stopMachine(machineId)(); // finish machine
      });
    },
  });
};

export const createVersionDetached = async (
  storageKey: string,
  size: VIDEO_SIZE
) => {
  // @todo: if exists avoid
  const exist = await fileExist(`chunks/${storageKey}/${size}.m3u8`);
  if (exist) {
    return console.info("VERSION_ALREADY_EXIST_ABORTING", size);
  }
  const agenda = new Agenda({ db: { address: process.env.DATABASE_URL } });
  agenda.define("create_chunks", async (job) => {
    console.log("CREATING::PERFORMANCE::MACHINE::");
    const machineId = await createMachine({
      image: await listMachinesAndFindImage(),
    });
    if (!machineId) return console.error("ERROR_ON_MACHINE_CREATION");

    await waitForMachineToStart(machineId);
    await delegateToPerformanceMachine({
      size,
      machineId,
      storageKey,
      intent: "generate_video_version",
    });
  });
  await agenda.start();
  await agenda.schedule("in 2 seconds", "create_chunks");
};

const createMachine = async ({ image }: { image: string }) => {
  const init: RequestInit = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.FLY_BEARER_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      config: {
        image,
        guest: { cpu_kind: "performance", cpus: 1, memory_mb: 2048 },
        auto_destroy: true,
      },
    }),
  }; // @todo init?
  const response = await fetch(MACHINES_API_URL, init);
  if (!response.ok)
    return console.error("LA MAQUINA NO SE CREO", await response.json());
  const { name, id } = await response.json();
  console.log("::MAQUINA_CREADA::", name, id);
  return id;
};

const stopMachine = (machineId: string) => async () => {
  if (!machineId) return;
  const id: string = machineId;
  const init: RequestInit = {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.FLY_BEARER_TOKEN}` },
  }; // @todo
  const response = await fetch(`${MACHINES_API_URL}/${id}/stop`, init);
  if (!response.ok) return console.error("La maquina no se detuvo", response);
  console.log("PERFORMANCE_MACHINE_STOPED");
  return true;
};

// @todo could this be generic?
const delegateToPerformanceMachine = async ({
  machineId,
  storageKey,
  path = "/admin",
  intent = "experiment",
  size,
}: {
  size?: VIDEO_SIZE;
  machineId: string;
  storageKey: string;
  path?: string;
  intent?: string;
}) => {
  const body = new FormData();
  body.append("intent", intent);
  body.append("storageKey", storageKey);
  const init: RequestInit = {
    method: "POST",
    body,
  };
  const internal_host = `http://${machineId}.vm.animations.internal:3000`;
  try {
    const response = await fetch(
      `${internal_host}${path}?machineId=${machineId}&size=${size}`,
      init
    );
    if (!response.ok) {
      console.error("::ERROR_ON_INTERNAL_REQUEST::", response);
      stopMachine(machineId);
    }
  } catch (e) {
    stopMachine(machineId);
  }
  console.log("::RESPONSE_OK::", response.ok);
};

const startMachine = async (id: string) => {
  const init: RequestInit = {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.FLY_BEARER_TOKEN}` },
  }; // @todo
  const response = await fetch(`${MACHINES_API_URL}/${id}/start`, init);
  if (!response.ok) return console.error("La maquina no inició wtf", response);
  console.log("WAITING_FOR_MACHINE_TO_START::");
  return new Promise((res) =>
    setTimeout(() => {
      console.log("PERFORMANCE_MACHINE_READY::");
      res(response.ok);
    }, 10000)
  );
};

const waitForMachineToStart = async (id: string) => {
  const init: RequestInit = {
    method: "GET",
    headers: { Authorization: `Bearer ${process.env.FLY_BEARER_TOKEN}` },
  }; // @todo
  const response = await fetch(
    `${MACHINES_API_URL}/${id}/wait?state=started`,
    init
  );
  if (!response.ok) console.error("MACHINE_NOT_WAITED", response);
  return new Promise((res) =>
    setTimeout(() => {
      console.log("::PERFORMANCE_MACHINE_READY::");
      res(response.ok);
    }, 10000)
  );
};

const listMachinesAndFindImage = async () => {
  const init: RequestInit = {
    method: "GET",
    headers: { Authorization: `Bearer ${process.env.FLY_BEARER_TOKEN}` },
  }; // @todo
  const list = await fetch(MACHINES_API_URL, init).then((r) => r.json());
  return list[0].config.image;
};
