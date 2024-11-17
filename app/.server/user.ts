import { db } from "./db";
import jwt from "jsonwebtoken";
import { sendMagicLinkEmail, sendWelcomeEmail } from "./emails";
import { commitSession, destroySession, getSession } from "~/sessions";
import { redirect, Session } from "@remix-run/node";

const secret = "yutuSecret"; // @todo from .env file

// throw redirect
const throwRedirect = async (redirectURL: string, session: Session) => {
  throw redirect(redirectURL, {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};

// getUserOrRedirect
export const getUserOrRedirect = async ({
  request,
  redirectURL = "/",
}: {
  request: Request;
  redirectURL?: string;
}) => {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userEmail")) {
    return throwRedirect(redirectURL, session);
  }
  const email = session.get("userEmail");
  const user = await db.user.findUnique({ where: { email } });
  if (!user) throw throwRedirect(redirectURL, session);
  return user;
};

// getUserORNull
export const getUserORNull = async (request: Request) => {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userEmail")) return null;
  const email = session.get("userEmail");
  return await db.user.findUnique({ where: { email } });
};

// confirm account
export const confirmUser = async (email: string) =>
  await db.user.update({ where: { email }, data: { confirmed: true } });

// set cookie session
export const setSessionWithEmailAndRedirect = async (
  email: string,
  {
    request,
    redirectURL = "/player",
  }: { request: Request; redirectURL?: string }
) => {
  const session = await getSession(request.headers.get("Cookie"));
  // email because is easier
  session.set("userEmail", email);
  throw redirect(redirectURL, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

// verify token
export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, secret) as { email: string };
    return {
      success: true,
      decoded,
    };
  } catch (e: unknown) {
    console.error(e);
    return {
      success: false,
    };
  }
};

// welcome new purchase
export const sendWelcome = async (email: string) => {
  const token = jwt.sign({ email }, secret, { expiresIn: "365d" });
  await sendWelcomeEmail(email, token);
  // return { error: false };
};

// magic link 🪄
export const sendMagicLink = async (
  email: string
): Promise<{
  error: boolean | string;
}> => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) return { error: "No existe una cuenta con este correo" };
  const token = jwt.sign({ email }, secret, { expiresIn: "365d" });
  await sendMagicLinkEmail(user, token);
  return { error: false };
};

// @todo review this
export const getOrCreateUser = async ({
  email,
  displayName,
  username,
  confirmed,
  phoneNumber,
  photoURL,
  uid,
}: {
  confirmed: boolean;
  phoneNumber: string;
  photoURL?: string;
  uid?: string;
  email: string;
  displayName: string;
  username: string;
}) => {
  const exist = await db.user.findUnique({
    where: {
      email,
    },
  });
  if (exist) return exist;
  // @todo? we could update existing...
  return await db.user.create({
    data: {
      confirmed,
      photoURL,
      phoneNumber,
      email,
      displayName,
      username,
      uid,
    },
  });
};
