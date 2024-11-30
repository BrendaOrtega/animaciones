import fs, { WriteStream } from "fs";
import { getPutFileUrl, getReadURL } from "./tigris";
import Ffmpeg from "fluent-ffmpeg";
import { randomUUID } from "crypto";
import { db } from "./db";
import { finished } from "stream/promises";
import { Readable } from "stream";
import { redirect } from "@remix-run/node";
import { replaceLinks } from "./replaceM3U8Links";

// @chunk it out with forks @todo
type VideoFetched = {
  contentLength: string;
  contentType: string;
  ok: boolean;
  tempPath: string;
  fileStream: WriteStream;
};
export const fetchVideo = async (
  storageKey: string,
  isPlaylist: boolean = false
): Promise<VideoFetched> => {
  const getURL = await getReadURL(storageKey, 3600);
  const response = await fetch(getURL).catch((e) => console.error(e));
  console.log("File fetched: ", storageKey, response.ok);
  if (!response?.body) {
    return {
      contentLength: "",
      contentType: "",
      ok: false,
      tempPath: "",
      fileStream: new WriteStream(), // XD
    }; // @todo use invariant
  }
  //  save file temp
  // let tempPath = "./conversiones/" + directory + (storageKey || randomUUID());
  if (!fs.existsSync(`./conversiones/`)) {
    fs.mkdirSync(`./conversiones/`, { recursive: true });
  }
  const uuid = randomUUID();
  if (isPlaylist) {
    if (!fs.existsSync(`./conversiones/${uuid}`)) {
      fs.mkdirSync(`./conversiones/${uuid}`, { recursive: true });
    }
  }

  const tempPath = isPlaylist
    ? `./conversiones/${uuid}/index.m3u8`
    : `./conversiones/${storageKey}`;

  // @todo try with a Buffer
  const fileStream = fs.createWriteStream(tempPath); // la cajita (en disco) puede ser un Buffer 🧐
  await finished(Readable.fromWeb(response.body).pipe(fileStream));
  // console.log("FILE STATS: ", fs.statSync(tempPath));
  return {
    contentLength: response.headers.get("content-length") || "",
    contentType: response.headers.get("content-type") || "",
    ok: response.ok,
    tempPath,
    fileStream, // @todo no files?
  };
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

export const uploadHLS = async ({
  contentType,
  storageKey,
}: {
  storageKey?: string;
  contentLength?: string;
  contentType: string;
}) => {
  const path = `./conversiones/playlist/${storageKey}/`;
  const hslPath = `${path}index.m3u8`;
  const files = fs.readdirSync(path).map((fileName) => path + fileName);
  console.log("THE FILES: ", files);
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

function put({
  file,
  contentLength,
  contentType,
  putURL,
}: {
  file: Buffer<ArrayBufferLike>;
  contentLength?: string;
  contentType: string;
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

export const getVideoFileSizedTo = async (
  size: "SD" | "HD" = "SD",
  tempPath: string
) => {
  const outputPath = `./conversiones/temp`;
  const command = Ffmpeg(tempPath).videoCodec("libx264").audioCodec("aac");
  await command.clone().size("320x?").save(outputPath); // espera!
  return fs.readFileSync(outputPath); // @todo can we do streams? instead of sync.
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
