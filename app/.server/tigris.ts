import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  PutBucketCorsCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  CreateMultipartUploadCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

const PREFIX = "animaciones/";
const isDev = process.env.NODE_ENV === "development";

const S3 = new S3Client({
  region: "auto",
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
});

const setCors = async () => {
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

// EXPERIMENTING with parts @todo Asign ACL?

export const getMultipartURLs = ({
  UploadId,
  numberOfParts,
  storageKey,
}: {
  storageKey: string;
  UploadId: string;
  numberOfParts: number;
}) => {
  const promises = [];
  for (let i = 0; i < numberOfParts; i += 1) {
    const promise = getPutFileUrl(storageKey, {
      PartNumber: i,
      UploadId,
    });
    promises.push(promise);
  }
  return Promise.all(promises);
};

export const getUploadWithMultiPart = async (storageKey: string) => {
  return await S3.send(
    new CreateMultipartUploadCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: PREFIX + storageKey,
    })
  ).catch((e) => console.error(e));
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
  return await getSignedUrl(
    S3,
    new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: PREFIX + key,
    }),
    { expiresIn }
  );
};

export const getImageURL = async (key: string, expiresIn = 900) =>
  await getSignedUrl(
    S3,
    new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: "animaciones/" + key, // @TODO: update when prod beta
    }),
    { expiresIn }
  );

// borrame

export const getPutVideoExperiment = async () => {
  const key = "videos_experiment/" + uuidv4();
  await setCors();
  return await getSignedUrl(
    S3,
    new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: key,
    }),
    { expiresIn: 3600 }
  );
};

export const getPutFileUrl = async (
  key: string,
  options?: { UploadId: string; PartNumber: number }
) => {
  const { UploadId, PartNumber } = options || {};
  await setCors();
  return await getSignedUrl(
    S3,
    new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: PREFIX + key,
      UploadId: UploadId || undefined,
      PartNumber: PartNumber || undefined,
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

// @todo: now is using prefix keys, we can improve
export const removeFilesFor = async (id: string) => {
  const posterDelete = await getRemoveFileUrl("poster-" + id);
  const videoDelete = await getRemoveFileUrl("video-" + id);
  await fetch(posterDelete, { method: "DELETE" });
  await fetch(videoDelete, { method: "DELETE" });
  return true;
};

setCors();
