import { getDeleteFileUrl } from "react-hook-multipart";

export const removeFilesFor = async (id: string) => {
  const posterDelete = await getDeleteFileUrl("poster-" + id);
  const videoDelete = await getDeleteFileUrl("video-" + id);
  await fetch(posterDelete, { method: "DELETE" });
  await fetch(videoDelete, { method: "DELETE" });
  return true;
};
