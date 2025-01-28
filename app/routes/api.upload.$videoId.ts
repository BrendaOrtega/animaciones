import { ActionFunctionArgs } from "@remix-run/node";
import { handler } from "react-hook-multipart";
import { db } from "~/.server/db";
import { getAdminUserOrRedirect } from "~/.server/user";

export async function action({ request, params }: ActionFunctionArgs) {
  await getAdminUserOrRedirect(request);
  return await handler(request, async ({ key }: { key: string }) => {
    console.log("The final key", key);
    const storageKey = key.replace("animaciones/", ""); // weird hack 🙄🤢
    const updated = await db.video.update({
      where: {
        id: params.videoId,
      },
      data: {
        storageKey,
        storageLink: "/videos?storageKey=" + storageKey,
      },
    });
    console.log("UPDATED", updated);
    return new Response(JSON.stringify(updated));
  });
}
