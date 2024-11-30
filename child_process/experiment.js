import Ffmpeg from "fluent-ffmpeg";
import { dirname } from "path";
import fs, { WriteStream } from "fs";
import {
  S3Client,
  GetObjectCommand,
  PutBucketCorsCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { finished } from "node:stream/promises";
import fetch from "node-fetch";
import { randomUUID } from "node:crypto";

const isDev = process.env.NODE_ENV === "development";

const S3 = new S3Client({
  region: "auto",
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
});
let isChild = false;

async function streamToBuffer(readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on("data", (data) => {
      if (typeof data === "string") {
        // Convert string to Buffer assuming UTF-8 encoding
        chunks.push(Buffer.from(data, "utf-8"));
      } else if (data instanceof Buffer) {
        chunks.push(data);
      } else {
        // Convert other data types to JSON and then to a Buffer
        const jsonData = JSON.stringify(data);
        chunks.push(Buffer.from(jsonData, "utf-8"));
      }
    });
    readableStream.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
    readableStream.on("error", reject);
  });
}

export const fetchObject = async (storageKey) => {
  const getURL = await getReadURL(storageKey, 3600);
  const response = await fetch(getURL).catch((e) => console.error(e));
  console.log("FILE_FETCHED::", storageKey, response.ok);
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
  createFolderIfDoesntExist("./conversiones/");
  const tempPath = `./conversiones/${storageKey}`;

  // @todo try with a Buffer
  const fileStream = fs.createWriteStream(tempPath);
  //   await finished(Readable.fromWeb(response.body).pipe(fileStream)); // webStreams
  finished(response.body.pipe(fileStream)); // node-fetch version
  // console.log("FILE STATS: ", fs.statSync(tempPath));
  return {
    contentLength: response.headers.get("content-length") || "",
    contentType: response.headers.get("content-type") || "",
    ok: response.ok,
    tempPath,
    fileStream, // @todo no files?
  };
};

// util
export const createFolderIfDoesntExist = (folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
};

// local version
const setCors = async () => {
  const input = {
    Bucket: process.env.BUCKET_NAME,
    CORSConfiguration: {
      CORSRules: [
        {
          AllowedHeaders: ["*"],
          AllowedMethods: ["PUT", "DELETE", "GET"],
          AllowedOrigins: isDev
            ? ["http://localhost:3000"]
            : ["https://animaciones.fixtergeek.com"],
          MaxAgeSeconds: 3600,
        },
      ],
    },
  };
  const command = new PutBucketCorsCommand(input);
  return await S3.send(command);
};

const getPutFileUrl = async (Key) => {
  await setCors();
  return await getSignedUrl(
    S3,
    new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key,
    }),
    { expiresIn: 3600 }
  );
};

const getReadURL = async (key, expiresIn = 3600) =>
  await getSignedUrl(
    S3,
    new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: "animaciones/" + key,
    }),
    { expiresIn }
  );

// MAIN FUNCTIONS
const cleanUp = (dir) => {
  fs.rmSync(dir, { recursive: true, force: true });
};

const putObject = async ({
  storageKey,
  filePath,
  contentType = "video/mp4",
}) => {
  const exist = fs.existsSync(filePath);

  if (!exist) {
    console.error("El archivo no existe 🤷🏻 ", fs.existsSync(filePath));
    return;
  }
  // the uploads
  const body = fs.readFileSync(filePath);
  const putURL = await getPutFileUrl(storageKey); // @todo: real prefix
  console.log("PUT_URL_ACCQIRED");
  const response = await fetch(putURL, {
    method: "PUT",
    body,
    // @todo: improve content_type source
    headers: {
      "content-type": contentType,
      //   "content-length": Buff,
    },
  }).catch((e) => console.error(e));
  console.log("FILE_UPLOADED_TO_S3", storageKey, response.ok);
};
const detached_generateVideoVersion = async (storageKey, size = "320x?") => {
  if (!storageKey) return console.log("ABORTED", storageKey);

  // this ensures ./conversions/ folder
  const { tempPath, contentType } = await fetchObject(storageKey);
  const __dirname = dirname(tempPath);
  // se necesita la extensión para que no se confunda con un folder 🤯
  const outputFilePath = [__dirname, "/", randomUUID(), ".mp4"].join("");
  console.log("CREATING_TEMP_FILE_FROM::", tempPath);
  const command = Ffmpeg(tempPath).videoCodec("libx264").audioCodec("aac");
  await command
    .clone()
    .size(size)
    .aspect("16:9") // maybe not needed
    .autopad("black")
    .on("end", () => {
      console.log("EXIST_TEMP_FILE:::", fs.existsSync(outputFilePath));
      putObject({
        filePath: outputFilePath,
        contentType,
        storageKey: `animaciones/${storageKey}_${size}`,
      }); // async
    })
    .save(outputFilePath);
};

// main call
if (process.argv[2] === "niño") {
  isChild = true;
  console.log("Saludos desde el niño 👦🏻 :: IS:CHILD?", isChild);
  //   main();
}
if (process.argv[3] === "detached_generateVideoVersion") {
  const data = JSON.parse(process.argv[4]);
  console.log("DATA:", data);
  if (!data.size || !data.storageKey) console.error("Missing args");
  detached_generateVideoVersion(data.storageKey, data.size);
}
