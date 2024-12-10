import { json, LoaderFunctionArgs } from "@remix-run/node";
import { getUserOrRedirect } from "~/.server/user";
import { getMasterFileResponse } from "~/.server/virtualM3U8";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  //   await getUserOrRedirect({ request }); // off in dev only
  const storageKey = params["storageKey"];
  if (!storageKey) throw json("Not found", { status: 404 });
  console.log("STORAGEKEY::FOUND::", storageKey);
  return getMasterFileResponse({ storageKey });
};
