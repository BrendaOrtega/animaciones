import { ActionFunctionArgs } from "@remix-run/node";
import { handler } from "react-hook-multipart";

export async function action({ request }: ActionFunctionArgs) {
  return await handler(request);
}
