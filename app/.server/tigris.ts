import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  PutBucketCorsCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const isDev = process.env.NODE_ENV === "development";

const S3 = new S3Client({
  region: "auto",
  endpoint: `https://fly.storage.tigris.dev`,
});

// @TODO: confirm production bucket/folder names
const setCors = async () => {
  const input = {
    Bucket: "wild-bird-2039",
    CORSConfiguration: {
      CORSRules: [
        {
          AllowedHeaders: ["*"],
          AllowedMethods: ["PUT", "DELETE"],
          AllowedOrigins: isDev
            ? ["http://localhost:3000"]
            : ["https://animations.fly.dev"],
          MaxAgeSeconds: 3600,
        },
      ],
    },
  };
  const command = new PutBucketCorsCommand(input);
  return await S3.send(command);
};

export const getReadURL = async (key: string, expiresIn = 900) => {
  return await getSignedUrl(
    S3,
    new GetObjectCommand({
      Bucket: "wild-bird-2039",
      Key: "animaciones/" + key,
    }),
    { expiresIn }
  );
};

export const getImageURL = async (key: string, expiresIn = 900) =>
  await getSignedUrl(
    S3,
    new GetObjectCommand({
      Bucket: "wild-bird-2039",
      Key: "animaciones/" + key, // @TODO: update when prod beta
    }),
    { expiresIn }
  );

export const getPutFileUrl = async (key: string) => {
  await setCors();
  return await getSignedUrl(
    S3,
    new PutObjectCommand({
      Bucket: "wild-bird-2039",
      Key: "animaciones/" + key, // @TODO: update when prod beta
    }),
    { expiresIn: 3600 }
  );
};

export const getRemoveFileUrl = async (key: string) => {
  await setCors();
  return await getSignedUrl(
    S3,
    new DeleteObjectCommand({
      Bucket: "wild-bird-2039",
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

// @todo now is using prefix keys, we can improve
export const removeFilesFor = async (id: string) => {
  const posterDelete = await getRemoveFileUrl("poster-" + id);
  const videoDelete = await getRemoveFileUrl("video-" + id);
  await await fetch(posterDelete, { method: "DELETE" });
  await await fetch(videoDelete, { method: "DELETE" });
  return true;
};
