import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getReadURL } from "~/.server/tigris";
import { getUserOrRedirect } from "~/.server/user";

// @todo members only?
export const loader = async ({ request }: LoaderFunctionArgs) => {
  await getUserOrRedirect({ request }); // auth only
  // @todo check for permissions
  const url = new URL(request.url);
  const storageKey = url.searchParams.get("storageKey");
  if (!storageKey || storageKey === "undefined" || storageKey === "null")
    throw json(undefined, { status: 404 });
  const readURL = await getReadURL(storageKey);
  console.log("DELIVERING direct-video-reading-url FOR: ", storageKey);
  // console.log("URL_ADQUIRED", readURL);
  return redirect(readURL);
};
