import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getReadURL } from "~/.server/tigris";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const storageKey = url.searchParams.get("storageKey");
  if (!storageKey) throw json(null, { status: 404 });
  const readURL = await getReadURL(storageKey);
  return redirect(readURL);
};
