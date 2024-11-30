import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { replaceLinks } from "~/.server/replaceM3U8Links";
import { getReadURL } from "~/.server/tigris";

// @todo members only?
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  // @todo add security check
  const storageKey = params["storageKey"];
  if (!storageKey) throw json("Not found", { status: 404 });

  let string = null;
  if (params.segment?.split(".")[1] === "m3u8") {
    string = await replaceLinks(storageKey); // generate m3u8 on the fly with signedUrl (1h)
    return new Response(string, {
      headers: {
        "Content-Type": "application/x-mpegURL",
        // "Content-Disposition": "attachment",
      },
    });
  } else {
    string = await getReadURL(storageKey + `/${params.segment}`);
    console.log("segment required", params.segment);
    return redirect(string);
  }
  // return redirect(readURL);
};
