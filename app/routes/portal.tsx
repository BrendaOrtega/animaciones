import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { MagicLink } from "~/components/MagicLink";
import { PrimaryButton } from "~/components/PrimaryButton";
import { z } from "zod";
import {
  confirmUser,
  getOrCreateUser,
  getUserORNull,
  sendMagicLink,
  setSessionWithEmailAndRedirect,
  verifyToken,
} from "~/.server/user";
import { destroySession, getSession } from "~/sessions";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "magic_link") {
    const email = String(formData.get("email"));
    const parsed = z.string().email().safeParse(email);
    if (!parsed.success) return { error: "El email es incorrectoS" };
    const { error } = await sendMagicLink(email);
    return { error, success: !error };
  }
  if (intent === "sign-out") {
    const session = await getSession(request.headers.get("Cookie"));
    throw redirect("/", {
      headers: { "Set-Cookie": await destroySession(session) },
    });
  }
  // @todo we could add extra validation with checking on google api
  if (intent === "google_login") {
    const data = JSON.parse(formData.get("data") as string);
    const user = await getOrCreateUser(data);
    await setSessionWithEmailAndRedirect(user.email, { request });
  }
  return null;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const next = url.searchParams.get("next");
  if (token) {
    const verified = verifyToken(token as string);
    if (!verified.success || !verified.decoded)
      return { screen: "wrong_token" };
    const { email } = verified.decoded;
    // confirm account
    await confirmUser(email);
    // set cookie
    return await setSessionWithEmailAndRedirect(email, {
      request,
      redirectURL: next || undefined,
    });
  }
  const user = await getUserORNull(request);
  if (user) {
    return redirect("/player");
  }
  return { screen: "login" }; // 'wrong_token', 'welcome?', 'unsiscribe?'
};

export default function Route() {
  const { screen } = useLoaderData<typeof loader>();

  switch (screen) {
    case "wrong_token":
      return (
        <article className="flex flex-col items-center h-screen justify-center gap-4 bg-slate-200">
          <h2 className="text-2xl">Este token no sirve más. 👩🏻‍🔧</h2>
          <Link to="/portal">
            <PrimaryButton>Solicitar uno nuevo</PrimaryButton>
          </Link>
        </article>
      );
    default:
      return (
        <>
          <MagicLink />
        </>
      );
  }
}
