import { json, LoaderFunctionArgs } from "@remix-run/node";
import { db } from "~/.server/db";
import {
  checkIfUserIsEnrolledOrRedirect,
  getUserOrRedirect,
} from "~/.server/user";
import { getMasterFileResponse } from "~/.server/virtualM3U8";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  // @todo check for public videos
  const storageKey = params["storageKey"];
  const video = await db.video.findUnique({ where: { storageKey } });
  let sizes = ["480p", "720p"];
  if (video?.m3u8.includes("1080p")) {
    sizes.push("1080p");
  }
  if (video && !video.isPublic) {
    await checkIfUserIsEnrolledOrRedirect(request, video);
  }
  if (!storageKey) {
    throw json("Not found", { status: 404 });
  }
  //   await getUserOrRedirect({ request }); // off in dev only
  return getMasterFileResponse({ storageKey, sizes }); // @todo others sizes
};
