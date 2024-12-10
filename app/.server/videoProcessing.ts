import fs from "fs";
import { Agenda } from "@hokify/agenda";
import { fileExist, getPutFileUrl } from "./tigris";
import Ffmpeg from "fluent-ffmpeg";
import { randomUUID } from "crypto";
import { db } from "./db";
import { replaceLinks } from "./replaceM3U8Links";
import { fork } from "child_process";
import path, { dirname } from "path";
import { fetchVideo } from "./fetchVideo";
import { TbRuler2 } from "react-icons/tb";

export const CHUNKS_FOLDER = "chunks";

// EXPERIMENTS 🚧
export const forkChild = (
  scriptPath: string,
  args: string[] = [],
  cb?: (arg0: unknown) => void
) => {
  // const __filename = fileURLToPath(import.meta.url);
  // const __dirname = dirname(__filename);

  const child = fork(scriptPath, ["niño", ...args]);
  child.on("error", (e) => console.error(e));
  child.on("exit", (exit) => {
    console.log("Terminó", exit);
    cb?.(exit);
  });
};

export const print_detached = (text: string = "Blissmo") => {
  const worker = spawnWorker(
    async (args) => {
      console.log("Inside child", args.db);
      const u = await db.user.findFirst();
      console.log("USER: ", user);
      // Aquí podemos hacer lo que sea (DB) 🤓
      setTimeout(() => {
        console.log("BLISSMO_EXPERIMENT", " delay: 3s");
      }, 3000);
    },
    // arg === [text]
    { text }
  );
  console.log("Spawnded! :: ", worker);
};

const spawnWorker = (
  arg: Promise<() => void | string> | (() => void | string),
  args = {},
  options: {
    cwd: string;
    onerror?: unknown;
    onmessage?: unknown;
  } = {
    cwd: process.cwd(),
    onerror: () => 1,
    onmessage: () => 0,
  }
) => {
  const worker = path.join("./child_process", "worker.js"); // use a cdn?
  let isfn = typeof arg === "function";
  let input = isfn ? arg.toString() : arg; // 🪄
  if (!options.cwd) {
    options.cwd = process.cwd();
  }
  // @todo. testing & debug stuff?
  // Aquí comienza el truco 🎩🐰
  const child = fork(worker, args, options);
  child.on("error", (err) => options.onerror?.(err));
  child.on("message", (msg: string) => {
    const message = JSON.parse(msg);
    // @ts-ignore
    message.error ? onerror?.(new Error(message.error)) : undefined;
    !message.error ? options.onmessage?.(message) : undefined;
  });
  // @todo aborting?
  child.on("exit", (code) => options.onerror?.("Interupted::" + code));
  // finally! ✨ sending to the worker 👷🏼‍♂️
  child.send({
    input,
    isfn,
    cwd: options.cwd,
    esm: options.esm,
    args,
  });
  // methods
  return {
    terminate() {
      child.kill("SIGINT");
      // @todo update onerror listeners
    },
    // onmessage(data: Record<string, unknown>) {
    //   child.send(JSON.stringify({ data }, null, 0));
    // },
    // addEventListener(event, fn) {
    //   if (EventSource.test(event)) {
    //     options["on" + event] = fn;
    //   }
    // },
  };
};

export const uploadHLS = async ({
  contentType,
  storageKey,
}: {
  storageKey?: string;
  contentLength?: string;
  contentType: string;
}) => {
  const path = `./conversiones/playlist/${storageKey}/`;
  // const hslPath = `${path}index.m3u8`;
  const files = fs.readdirSync(path).map((fileName) => path + fileName);

  const fetchPromises = files.map(async (path) => {
    const arr = path.split("/");
    const fileName = arr[arr.length - 1];
    const newStorageKey = `${storageKey}/${fileName}`;
    if (fileName.split(".").reverse()[0] === "m3u8") {
      console.log("New Key Asigned", newStorageKey);
    }
    const putURL = await getPutFileUrl(newStorageKey);
    const file = fs.readFileSync(path);
    return await put({
      file,
      contentType: "application/x-mpegURL",
      contentLength: Buffer.byteLength(file).toString(),
      putURL,
    });
  });
  await Promise.all(fetchPromises);
  // return m3u8 getURL
  // return await getReadURL(`${storageKey}/index.m3u8`);
  const link = await replaceLinks(storageKey as string);
  return link;

  // cleanUp(storageKey); // @todo not working
};

export const experiment__legacy = async (
  storageKey: string,
  data: any = {}
) => {
  const { fileStream } = await fetchVideo(storageKey);
  console.log("SIZE: ", fileStream.bytesWritten / 1_024 / 1_024 + "mb");
  forkChild("./child_process/experiment.js", [JSON.stringify(data)], (exit) =>
    console.log("FORK_FINISHED_WITH_EXIT_CODE::", exit)
  );
};

// EXPERIMENTS 🚧

export const createFolderIfDoesntExist = (folder: string) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
};

export const detached_generateVideoVersion = async ({
  // for ref only, this function should be placed in child_process folder
  storageKey,
  size = "800x600",
}: {
  storageKey: string;
  size?: "800x600";
}) => {
  const { tempPath } = await fetchVideo(storageKey);
  const __dirname = dirname(tempPath);
  const outputFilePath = path.join(__dirname, "temp.mp4");
  createFolderIfDoesntExist(__dirname);
  const command = Ffmpeg(tempPath).videoCodec("libx264").audioCodec("aac");
  await command.clone().size(size).save(outputFilePath);
  // the uploads
  console.log(
    "FILE_SIZE::",
    fs.statSync(outputFilePath).size / 1024 / 1024 + "mb"
  );
};

export const getVideoFileSizedTo = async (
  size: "SD" | "HD" = "SD",
  tempPath: string
) => {
  const outputFilePath = `./conversiones/temp.mp4`;
  if (!fs.existsSync("conversiones")) {
    fs.mkdirSync("conversiones", { recursive: true }); // this is gold
  }
  const command = Ffmpeg(tempPath).videoCodec("libx264").audioCodec("aac");
  await command.clone().size("320x?").save(outputFilePath); // espera!
  return fs.readFileSync(outputFilePath); // @todo can we do streams? instead of sync.
};

export const cleanUp = async (storageKey: string) => {
  const path = `./conversiones/${storageKey}`;
  //@todo remove temp files (child process)
  try {
    fs.stat(path, (err) => {
      if (err) return console.error(err);
      fs.unlinkSync(path);
    });
  } catch (e) {}
};

function put({
  file,
  contentType = "application/x-mpegURL",
  putURL,
}: {
  file: Buffer<ArrayBufferLike>;
  contentType?: string;
  putURL: string;
}) {
  return fetch(putURL, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Length": Buffer.byteLength(file),
      "Content-Type": contentType,
    },
  }).catch((e) => console.error(e));
}

// m3u8 experiment (HSL)
export const generateHSL = async (storageKey: string) => {
  const { tempPath } = await fetchVideo(storageKey);
  console.log("Por convertir: ", tempPath);
  await convertToHLS(tempPath, storageKey);
  return await uploadHLS({
    storageKey,
    contentType: "application/x-mpegURL",
  });
};

// Dic 2024
const generateMasterFile = async (storageKey: string) => {
  const content = `#EXTM3U\n
  #EXT-X-STREAM-INF:BANDWIDTH=375000,RESOLUTION=640x360\n
  /playlist/${storageKey}/360.m3u8\n
  #EXT-X-STREAM-INF:BANDWIDTH=750000,RESOLUTION=854x480\n
  /playlist/${storageKey}/480.m3u8\n
  #EXT-X-STREAM-INF:BANDWIDTH=2000000,RESOLUTION=1280x720\n
  /playlist/${storageKey}/720.m3u8\n
  #EXT-X-STREAM-INF:BANDWIDTH=3500000,RESOLUTION=1920x1080\n
  /playlist/${storageKey}/1080.m3u8`;
  const masterFilePath = `chunks/${storageKey}/index.m3u8`;
  const masterFileStorageKey = `chunks/${storageKey}/index.m3u8`;
  if (!fs.existsSync(`chunks/${storageKey}`)) {
    fs.mkdirSync(`chunks/${storageKey}`, { recursive: true });
  }
  fs.writeFileSync(masterFilePath, content);
  // const file = fs.readFileSync(masterFilePath);
  // const putURL = await getPutFileUrl(masterFileStorageKey);
  // await put({
  //   file,
  //   putURL,
  // });
  // console.log("MASTER_FILE::UPLOADED ✅");
};

export const experiment = (storageKey: string) => {
  // @todo: update DB with success state
  createHLSChunks({
    sizeName: "720p",
    storageKey,
    checkExistance: true,
    when: "in 1 seconds",
  });
  createHLSChunks({
    sizeName: "480p",
    storageKey,
    checkExistance: true,
    when: "in 2 seconds",
  });
  createHLSChunks({
    sizeName: "360p",
    storageKey,
    checkExistance: true,
    when: "in 3 seconds",
  });
  createHLSChunks({
    storageKey,
    checkExistance: false,
    when: "in 4 seconds",
    cb: uploadChunks, // uploading at the end
  });
};

// first version 360p
export const createHLSChunks = async ({
  sizeName = "1080p",
  storageKey,
  cb,
  checkExistance,
  when = "in 1 second",
}: {
  when: string;
  checkExistance?: boolean;
  sizeName?: "360p" | "480p" | "720p" | "1080p";
  storageKey: string;
  cb?: (playListPath: string) => void;
}) => {
  if (checkExistance) {
    // will avoid everything if exists
    // but we want to check for the m3u8 playlist
    const listPath = path.join(CHUNKS_FOLDER, storageKey, `${sizeName}.m3u8`);
    const exist = await fileExist(listPath);
    if (exist) {
      console.log("AVOIDING_VERSION::", sizeName);
      return;
    }
  }
  const agenda = new Agenda({ db: { address: process.env.DATABASE_URL } });
  // define
  agenda.define("generate_hls_chunks", async (job) => {
    const size =
      sizeName === "360p"
        ? "640x360"
        : sizeName === "480p"
        ? "800x480"
        : sizeName === "720p"
        ? "1280x720"
        : "1920x1080";
    const { storageKey } = job.attrs.data;
    console.log(`HLS::${sizeName}::`, storageKey);
    const outputFolder = `media/${CHUNKS_FOLDER}/${storageKey}`;
    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder, { recursive: true }); // this is gold
    }
    const hlsSegmentFilename = `${outputFolder}/${sizeName}_%03d.ts`;
    const playListPath = `${outputFolder}/${sizeName}.m3u8`;
    const { tempPath } = await fetchVideo(storageKey);
    const command = Ffmpeg(tempPath, { timeout: 432000 })
      .size(size)
      .addOption("-profile:v", "baseline")
      .addOption("-level", "3.0")
      .addOption("-start_number", "0")
      .addOption("-hls_list_size", "0")
      // .addOption("-hls_time", "3") we need to force keyframes
      .addOption("-f", "hls")
      .addOption(`-hls_segment_filename ${hlsSegmentFilename}`);

    return await command
      .clone()
      .on("error", function (err) {
        console.log("an error happened: " + err.message);
      })
      .on("end", function () {
        console.log(`::VERSION_${sizeName}_CREATED::`);
        // update main file?
        cb?.(outputFolder); // chunks/:storageKey
      })
      .save(playListPath);
  }); // defined

  await agenda.start();
  await agenda.schedule(when, "generate_hls_chunks", { storageKey });
};

export const uploadChunks = async (
  tempFolder: string,
  cleanUp: boolean = true
) => {
  if (!fs.existsSync(tempFolder)) {
    return console.error("FOLDER_NOT_FOUND::", tempFolder);
  }
  const chunkPaths = fs
    .readdirSync(tempFolder)
    .map((fileName) => path.join(tempFolder, fileName));
  console.log("UPLOADING_FILES::", chunkPaths);
  for await (let chunkPath of chunkPaths) {
    // @todo, try/catch
    const putURL = await getPutFileUrl(chunkPath.replace("media/", "")); // bridge
    const file = fs.readFileSync(chunkPath);
    const r = await put({
      file,
      contentType: "application/x-mpegURL",
      putURL,
    });
    console.log("chunk uploaded::", r.ok);
    if (cleanUp) {
      fs.rmSync(chunkPath, { recursive: true, force: true });
    }
  }
  console.log(`All chunks uploaded total: ${chunkPaths.length}`);
  if (cleanUp) {
    // @todo: use uuid for unique folder
    // fs.rmSync(dirname(chunkPaths[0]), { recursive: true, force: true });
  }
};

// @todo This should accept streams
export const convertToHLS = async (tempPath: string, storageKey: string) => {
  if (!fs.existsSync(`./conversiones/playlist/${storageKey}/`)) {
    fs.mkdirSync(`./conversiones/playlist/${storageKey}/`, { recursive: true });
  }
  const outputPath = `./conversiones/playlist/${storageKey}`;
  // const outputPath = "./conversiones";
  const hslSegmentFilename = `${outputPath}/segment%03d.ts`;
  const hslPath = `${outputPath}/index.m3u8`;
  const command = Ffmpeg(tempPath, { timeout: 432000 })
    // set video bitrate
    .videoBitrate(1024)
    // set h264 preset
    // .addOption("preset", "superfast")
    // set target codec
    .videoCodec("libx264")
    // set audio bitrate
    .audioBitrate("128k")
    // set audio codec
    .audioCodec("aac")
    // set number of audio channels
    .audioChannels(2)
    // set hls segments time
    .addOption("-hls_time", "5")
    // include all the segments in the list
    .addOption("-hls_list_size", "0")
    .addOption(`-hls_segment_filename ${hslSegmentFilename}`)
    // setup event handlers
    .on("end", function () {
      console.log("file has been converted succesfully");
    })
    .on("error", function (err) {
      console.log("an error happened: " + err.message);
    });
  // save to file
  // .save(hslPath);

  return await command.clone().save(hslPath); // espera!
  // return fs.readFileSync(outputPath); // @todo can we do streams? instead of sync.
};

export const createVideoVersions = async ({
  version = "all",

  originalKey,
}: {
  originalKey: string;
  version?: "small" | "medium" | "all" | "large";
}) => {
  // first download original file
  const { tempPath, contentType, contentLength } = await fetchVideo(
    originalKey
  );
  const fileVersions = [];
  if (version === "all" || version === "small") {
    const file = await getVideoFileSizedTo("SD", tempPath); // 640x480
    fileVersions.push({ file, size: "SD" });
  }
  if (version === "all" || version === "medium") {
    const file = await getVideoFileSizedTo("HD", tempPath); //800x600
    fileVersions.push({ file, size: "HD" });
  }
  // if (version === "all" || version === "large") {
  //   const file = await getVideoFileSizedTo("1920x?", tempPath); //800x600
  //   console.log("Medium version: Done");
  //   fileVersions.push({ file, size: "1080p" });
  // }
  return await uploadVideos({
    originalKey,
    fileVersions,
    contentLength,
    contentType,
  });
};

export const databaseUpdate = async ({
  videoId,
  storageKeys,
}: {
  storageKeys: string[];
  videoId: string;
}) => {
  // what else? update DB (we should check successes :/)
  //   if(putResponses.every(r=>r.ok)){} // algo así?
  if (!storageKeys.length) return; // notify?
  await db.video.update({
    where: { id: videoId },
    data: { storageKeys }, // more sizes
  });
};

export const uploadVideos = async ({
  fileVersions,
  contentLength,
  contentType,
  originalKey,
}: {
  originalKey?: string;
  fileVersions: { file: Buffer<ArrayBufferLike>; size: string }[];
  contentLength: string;
  contentType: string;
}) => {
  // we have videos, now storage them all in parallel.
  return await Promise.all(
    fileVersions.map(async ({ file, size }) => {
      const newStorageKey = (originalKey || randomUUID()) + "_" + size;
      const putURL = await getPutFileUrl(newStorageKey);
      return await put({ file, contentLength, contentType, putURL }).then(
        () => newStorageKey
      );
    })
  ); // returns storageKeys
};

// DETACHED FUNCTIONS
export const createVideoVersion = async (
  storageKey: string,
  size: string = "320x?"
) => {
  return forkChild("./child_process/experiment.js", [
    "detached_generateVideoVersion",
    JSON.stringify({
      storageKey,
      size,
    }),
  ]);
};
