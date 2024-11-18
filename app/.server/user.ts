import { db } from "./db";
import jwt from "jsonwebtoken";
import { sendMagicLinkEmail, sendWelcomeEmail } from "./emails";
import { commitSession, destroySession, getSession } from "~/sessions";
import { redirect, Session } from "@remix-run/node";

const secret = "yutuSecret"; // @todo from .env file

const COURSE_ID = "645d3dbd668b73b34443789c";

const ROLE = "CAN_SHARE_50_DISCOUNT";

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

// getAdminUser
export const getAdminUserOrRedirect = async (
  request: Request,
  redirectURL: string = "/"
) => {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userEmail")) return null;
  const email = session.get("userEmail");
  const admin = await db.user.findUnique({ where: { email, role: "ADMIN" } });
  if (!admin) return throwRedirect(redirectURL, session);
  return admin;
};

// getProUserOrNull
export const getEnrolledUserORNull = async (
  courseId: string,
  request: Request
) => {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userEmail")) return null;
  const email = session.get("userEmail");
  return await db.user.findUnique({
    where: {
      email,
      courses: {
        has: courseId,
      },
    },
  });
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
  phoneNumber,
  photoURL,
  uid,
  confirmed,
  role,
  courseId,
}: {
  email: string;
  role?: string;
  courseId?: string;
  confirmed?: boolean;
  phoneNumber?: string;
  photoURL?: string;
  uid?: string;
  displayName?: string;
  username?: string;
}) => {
  const exist = await db.user.findUnique({
    where: {
      email,
    },
  });
  if (exist) {
    return await db.user.update({
      where: { email },
      data: {
        confirmed: confirmed,
        courses: courseId
          ? { push: courseId }
          : exist.courses.filter((rol) => COURSE_ID !== rol), // @todo improve
        roles: role
          ? { push: role }
          : exist.roles.filter((rol) => ROLE !== rol), // @todo improve
      },
    });
  }
  // @todo? we could update existing...
  return await db.user.create({
    data: {
      confirmed,
      photoURL,
      phoneNumber,
      email,
      displayName,
      username: username || email,
      uid,
      courses: courseId ? { push: courseId } : undefined,
      roles: role ? { push: role } : undefined, // @todo improve
    },
  });
};
