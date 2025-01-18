import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  PutBucketCorsCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import { v4 as uuidv4 } from "uuid";

const PREFIX = "animaciones/";
const isDev = process.env.NODE_ENV === "development";

const S3 = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
});

const setCors = (options?: {
  MaxAgeSeconds?: number;
  AllowedOrigins?: string[];
}) => {
  const { MaxAgeSeconds = 3600, AllowedOrigins = ["*"] } = options || {};
  const input = {
    Bucket: process.env.BUCKET_NAME,
    CORSConfiguration: {
      CORSRules: [
        {
          MaxAgeSeconds,
          AllowedOrigins,
          AllowedHeaders: ["*"],
          ExposeHeaders: ["ETag"], // important for multipart
          AllowedMethods: ["PUT", "DELETE", "GET"],
        },
      ],
    },
  };
  const command = new PutBucketCorsCommand(input);
  return S3.send(command);
};

/** DEPRECATED */
const __setCors = async () => {
  const input = {
    Bucket: process.env.BUCKET_NAME,
    CORSConfiguration: {
      CORSRules: [
        {
          AllowedHeaders: ["*"],
          AllowedMethods: ["PUT", "DELETE", "GET"],
          AllowedOrigins: isDev
            ? ["http://localhost:3000"] // accepts only one
            : ["https://animaciones.fixtergeek.com"],
          MaxAgeSeconds: 3600,
        },
      ],
    },
  };
  const command = new PutBucketCorsCommand(input);
  return await S3.send(command);
};

export const fileExist = async (key: string) => {
  return await S3.send(
    new HeadObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: PREFIX + key,
    })
  )
    .then((r) => {
      console.log("::FILE_EXIST:: ", r.ContentType);
      return true;
    })
    .catch((err) => {
      console.error("FILE_MAY_NOT_EXIST", key, err.message);
      return false;
    });
};

export const getReadURL = async (key: string, expiresIn = 3600) => {
  await setCors();
  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: PREFIX + key,
  });
  return await getSignedUrl(S3, command, { expiresIn });
};

export const getPutFileUrl = async (key: string) => {
  await setCors();
  return await getSignedUrl(
    S3,
    new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: PREFIX + key,
    }),
    { expiresIn: 3600 }
  );
};

export const getRemoveFileUrl = async (key: string) => {
  await setCors();
  return await getSignedUrl(
    S3,
    new DeleteObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: "animaciones/" + key, // @TODO: update when prod beta
    }),
    { expiresIn: 3600 }
  );
};

export const getComboURLs = async (key: string) => ({
  putURL: await getPutFileUrl(key),
  readURL: await getReadURL(key),
  deleteURL: await getRemoveFileUrl(key),
});

// @todo: now is using prefix keys, we can improve REMOVE THIS?
export const removeFilesFor = async (id: string) => {
  const posterDelete = await getRemoveFileUrl("poster-" + id);
  const videoDelete = await getRemoveFileUrl("video-" + id);
  await fetch(posterDelete, { method: "DELETE" });
  await fetch(videoDelete, { method: "DELETE" });
  return true;
};
