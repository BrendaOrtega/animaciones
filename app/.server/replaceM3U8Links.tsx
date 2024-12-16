import fs from "fs";
import path from "path";
import { fetchVideo } from "./fetchVideo";
import { CHUNKS_FOLDER } from "./videoProcessing";

export const replaceLinks = async (storageKey: string, playlist: string) => {
  const { tempPath, ok } = await fetchVideo(
    path.join(CHUNKS_FOLDER, storageKey, playlist)
  ); // @todo fetchFile instead
  if (!ok) return console.error("::PLAYLIST_NOT_FOUND::");

  const content = fs.readFileSync(tempPath, "utf8");

  const segmentNames = content
    .split("\n")
    .filter((text) => text.includes(".ts"));
  const links = segmentNames.map((name) => {
    return `/playlist/${storageKey}/${name}`;
  });

  const c = content.split("\n");
  segmentNames.forEach((name, index) => {
    const i = c.findIndex((text) => text === name);
    c[i] = links[index];
  });

  return c.join("\n") as string;
};
