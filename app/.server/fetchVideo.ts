import fs, { WriteStream } from "fs";
import { finished } from "stream/promises";
import { Readable } from "stream";
import { getReadURL } from "./tigris";
import path from "path";

export type VideoFetched = {
  contentLength: string;
  contentType: string;
  ok: boolean;
  tempPath: string;
  fileStream?: WriteStream;
};

export const fetchVideo = async (storageKey: string): Promise<VideoFetched> => {
  const existPath = `conversiones/${storageKey}`;
  if (fs.existsSync(existPath)) {
    // @todo: damage files can be found
    const f = fs.readFileSync(existPath);
    console.log("AVOIDING_FILE_FETCH");
    return Promise.resolve({
      contentLength: Buffer.byteLength(f).toString(),
      contentType: "video/mp4",
      ok: true,
      tempPath: existPath,
    });
  }
  const getURL = await getReadURL(storageKey, 3600);
  const response = await fetch(getURL).catch((e) => console.error(e));
  console.log("FILE_FETCHED::", response.ok, storageKey);
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
  const tempPath = `conversiones/${storageKey}`;
  const __dirname = path.dirname(tempPath);
  if (!fs.existsSync(__dirname)) {
    fs.mkdirSync(__dirname, { recursive: true });
  }

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
