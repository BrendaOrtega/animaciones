import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getReadURL } from "react-hook-multipart";

// @todo members only?
export const loader = async ({ request }: LoaderFunctionArgs) => {
  // @todo check for permissions ??
  // const canRead = canReadFile(request) // user is implicit, agains enrolled and storageKey
  // const user = await getUserORNull(request); // auth only
  const url = new URL(request.url);
  const storageKey = url.searchParams.get("storageKey");
  if (!storageKey || storageKey === "undefined" || storageKey === "null")
    throw Response.json("::VIDEO_NOT_FOUND::", { status: 404 });
  const readURL = await getReadURL("animaciones/" + storageKey); // bridge animaciones/
  console.log("direct-video-reading-url FOR: ", storageKey);
  // console.log("URL_ADQUIRED", readURL);
  return redirect(readURL);
};
