import { ActionFunctionArgs } from "@remix-run/node";
import { getUserORNull } from "~/.server/user";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "self") {
    return await getUserORNull(request);
  }
  return null;
};
