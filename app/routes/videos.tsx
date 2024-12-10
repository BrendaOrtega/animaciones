import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getReadURL } from "~/.server/tigris";
import { getUserOrRedirect } from "~/.server/user";

// @todo members only?
export const loader = async ({ request }: LoaderFunctionArgs) => {
  await getUserOrRedirect({ request }); // auth only
  // @todo check for permissions
  const url = new URL(request.url);
  const storageKey = url.searchParams.get("storageKey");
  if (!storageKey) throw json(null, { status: 404 });
  console.log("DELIVERING direct-video-reading-url FOR: ", storageKey);
  const readURL = await getReadURL(storageKey);
  return redirect(readURL);
};
