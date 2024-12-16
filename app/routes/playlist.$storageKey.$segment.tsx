import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { replaceLinks } from "~/.server/replaceM3U8Links";
import { getReadURL } from "~/.server/tigris";
import path from "path";
import { getUserORNull, getUserOrRedirect } from "~/.server/user";

const CHUNKS_FOLDER = "chunks";
// @todo members only?
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  // await getUserORNull({ request }); // @todo a way of validating?
  const storageKey = params["storageKey"];
  if (!storageKey) throw json("Not found", { status: 404 });

  let string = null;
  console.log("::SEGMENT::REQUIRED::", params.segment);
  if (params.segment?.split(".")[1] === "m3u8") {
    string = (await replaceLinks(storageKey, params.segment)) as string;
    return new Response(string, {
      headers: {
        "Content-Type": "application/x-mpegURL",
      },
    });
  } else {
    string = await getReadURL(
      path.join(CHUNKS_FOLDER, storageKey, params.segment)
    );
    return redirect(string);
  }
  // return redirect(readURL);
};
