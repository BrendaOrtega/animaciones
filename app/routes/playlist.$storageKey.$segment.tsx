import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getReadURL } from "~/.server/tigris";
import { fetchVideo } from "~/.server/videoProcessing";
import fs from "fs";

export const replaceLinks = async (storageKey: string) => {
  if (fs.existsSync(`./conversiones/playlist/${storageKey}/`)) {
    fs.mkdirSync(`./conversiones/playlist/${storageKey}/`, { recursive: true });
  }
  const { tempPath } = await fetchVideo(`${storageKey}/index.m3u8`, true); // @todo fetchFile instead
  console.log("TEMP::: ", tempPath);
  const content = fs.readFileSync(tempPath, "utf8");
  console.log("ORIGINAL:", content);
  const segmentNames = content
    .split("\n")
    .filter((text) => text.includes("segment"));
  const linkPromises = segmentNames.map((name) => {
    console.log("replacing: ", storageKey + `/${name}`);
    // return getReadURL(storageKey + `/${name}`);
    return `/playlist/${storageKey}/${name}`;
  });
  const links = await Promise.all(linkPromises);

  const c = content.split("\n");
  segmentNames.forEach((name, index) => {
    const i = c.findIndex((text) => text === name);
    c[i] = links[index];
    console.log("UPDATED:", c.join("\n"));
  });

  return c.join("\n");
};

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
