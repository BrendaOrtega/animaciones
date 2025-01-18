import { ActionFunctionArgs } from "@remix-run/node";
import { createHLSChunks, uploadChunks } from "~/.server/videoProcessing";

export async function action({ request }: ActionFunctionArgs) {
  console.log("ACTION");
  const url = new URL(request.url);
  const intent = url.searchParams.get("intent");
  if (intent === "local_video_processing") {
    const storageKey = url.searchParams.get("storageKey");
    if (!storageKey) return null;

    console.log("::About to process::", storageKey);
    await createHLSChunks({
      storageKey,
      sizeName: "360p",
      checkExistance: true,
      cb: (path) =>
        uploadChunks(path, true, async () => {
          // update db
        }),
    });
  }
  return null;
}

export async function loader() {
  return "Video API";
}
