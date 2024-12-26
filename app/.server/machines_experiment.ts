import { FetchModuleOptions } from "vite";
import { createHLSChunks, uploadChunks } from "./videoProcessing";

const MACHINES_API_URL = "https://api.machines.dev/v1/apps/animations/machines";
const INTERNAL_WORKER_URL = `http://worker.process.animations.internal:3000`;

export const machines_experiment = async ({
  storageKey,
  machineId,
}: {
  storageKey: string;
  machineId: string | null;
}) => {
  if (machineId) {
    console.log("Corriendo en WORKER 🪄✨", storageKey);
    await createHLSChunks({
      storageKey,
      sizeName: "360p",
      checkExistance: false,
      cb: (path: string) => {
        uploadChunks(path, true, stopMachine(machineId)); // @todo: where to get id?
      },
    });
    return;
  }
  console.log("PREPARANDO::PERFORMANCE-1x::MACHINE::");
  const id = await createMachine({
    image: await listMachinesAndFindImage(),
  });
  await waitForMachineToStart(id);
  await delegateToPerformanceMachine(id, storageKey);
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

const stopMachine = (machineId: string | null) => async () => {
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
const delegateToPerformanceMachine = async (
  machineId: string,
  storageKey: string
) => {
  const body = new FormData();
  body.append("intent", "experiment");
  body.append("storageKey", storageKey);
  const init: RequestInit = {
    method: "POST",
    body,
  };
  const internal_host = `http://${machineId}.vm.animations.internal:3000`;
  const response = await fetch(
    `${internal_host}/admin?machineId=${machineId}`,
    init
  ); // @todo revisit to improve
  console.log("::THE_RESPONSE::", response);
  return response.ok;
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
  console.log("RESPONSE_RECEIVED_ON_WAITING");
  if (!response.ok) console.error("MACHINE_NOT_WAITED", response);
  return new Promise((res) =>
    setTimeout(() => {
      console.log("PERFORMANCE_MACHINE_READY::");
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
