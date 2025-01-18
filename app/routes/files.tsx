import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getReadURL } from "react-hook-multipart";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const storageKey = url.searchParams.get("storageKey");
  if (!storageKey) throw Response.json("::FILE_NOT_FOUND::", { status: 404 });
  const readURL = await getReadURL(storageKey);
  return redirect(readURL);
};
