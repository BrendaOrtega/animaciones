import { ActionFunctionArgs } from "@remix-run/node";
import { db } from "~/.server/db";
import { getUserORNull } from "~/.server/user";
import { createVideoVersions } from "~/.server/videoProcessing";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "self") {
    return await getUserORNull(request);
  }

  // video experiment
  // const formData = await request.formData();
  // const intent = formData.get("intent");
  if (intent === "generate_video_versions") {
    const videoId = String(formData.get("videoId"));
    const originalKey = String(formData.get("storageKey"));
    if (!originalKey || !videoId) return null;
    console.log("Generating... for", originalKey);
    const newStorageKeys = await createVideoVersions({
      originalKey,
    });
    console.log("TOOOODO para: ", newStorageKeys, "funciona!");
    // update db
    await db.video.update({
      where: { id: videoId },
      data: { storageKeys: newStorageKeys },
    });
    console.log("Video Updated");
  }
  return null;
};
