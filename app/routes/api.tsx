import { ActionFunctionArgs } from "@remix-run/node";
import { db } from "~/.server/db";
import { getUserORNull } from "~/.server/user";
import { createVideoVersions, generateHSL } from "~/.server/videoProcessing";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "self") {
    return await getUserORNull(request);
  }

  if (intent === "generate_hsl") {
    const storageKey = String(formData.get("storageKey"));
    console.log("Generating... HSL::", storageKey);
    const playListURL = await generateHSL(storageKey);
    console.log(`/playlist/${storageKey}/index.m3u8`);
    return { playListURL: `/playlist/${storageKey}/index.m3u8` }; // @todo maybe
  }

  if (intent === "generate_video_versions") {
    const videoId = String(formData.get("videoId"));
    const originalKey = String(formData.get("storageKey"));
    if (!originalKey || !videoId) return null;
    console.log("Generating... for", originalKey);
    const newStorageKeys = await createVideoVersions({
      originalKey,
    });
    console.log("TOOOODO para: ", newStorageKeys, "funciona!");
    // @todo notify how? - maybe, a list of notifications [{text,viewed}]
    // update db
    await db.video.update({
      where: { id: videoId },
      data: { storageKeys: newStorageKeys },
    });
    console.log("Video Updated"); // @todo notify
  }
  return null;
};
