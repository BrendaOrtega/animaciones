import { db } from "./db";
import jwt from "jsonwebtoken";
import { sendMagicLinkEmail, sendWelcomeEmail } from "./emails";
import { commitSession, destroySession, getSession } from "~/sessions";
import { redirect, Session } from "@remix-run/node";
import { boolean } from "zod";
import { Video } from "@prisma/client";

const secret = "yutuSecret"; // @todo from .env file

const COURSE_ID = "645d3dbd668b73b34443789c";

const ROLE = "CAN_SHARE_50_DISCOUNT";

export const checkIfUserIsEnrolledOrRedirect = async (
  request: Request,
  video: Partial<Video> & { courseIds: string[] }
) => {
  const user = await getUserOrRedirect({ request });
  const includes = video.courseIds.find((courseId) =>
    user.courses.includes(courseId)
  );
  if (!includes) {
    throw redirect("/404");
  }
  return true;
};

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
  if (!session.has("userEmail")) return throwRedirect(redirectURL, session);
  const email = session.get("userEmail");
  const admin = await db.user.findUnique({ where: { email, role: "ADMIN" } });
  if (!admin) return throwRedirect(redirectURL, session);
  return admin;
};

// can share discount CAN_SHARE_50_DISCOUNT
export const getCanShareUserORNull = async (
  courseId: string,
  request: Request
) => {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userEmail")) return null;
  const email = session.get("userEmail");
  return await db.user.findUnique({
    where: {
      email,
      OR: [
        {
          roles: {
            has: "CAN_SHARE_50_DISCOUNT",
          },
        },
        {
          courses: {
            has: COURSE_ID,
          },
        },
      ],
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
  console.log("🔍 Buscando usuario con email:", email);
  const user = await db.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    console.log("❌ No se encontró usuario con email:", email);
    return { error: "No existe una cuenta con este correo" };
  }

  console.log("✅ Usuario encontrado:", user.email);
  const token = jwt.sign({ email }, secret, { expiresIn: "365d" });

  try {
    await sendMagicLinkEmail(user, token);
    console.log("✅ Magic link enviado exitosamente");
    return { error: false };
  } catch (e) {
    console.error("❌ Error al enviar magic link:", e);
    return { error: "Error al enviar el email. Por favor intenta de nuevo." };
  }
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
}: {
  email: string;
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
    return exist;
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
    },
  });
};

export type GetOrCreateAndUpdateType = {
  email: string;
  isConfirmed?: boolean;
  isRole?: boolean;
  isEnrolled?: boolean;
  phoneNumber?: string;
  photoURL?: string;
  uid?: string;
  displayName?: string;
  username?: string;
};
export const getOrCreateAndUpdate = async ({
  email,
  displayName,
  username,
  phoneNumber,
  photoURL,
  uid,
  isConfirmed,
  isRole,
  isEnrolled,
}: GetOrCreateAndUpdateType) => {
  const exist = await db.user.findUnique({
    where: {
      email,
    },
  });
  if (exist) {
    return await db.user.update({
      where: { email },
      data: {
        confirmed: isConfirmed,
        courses: isEnrolled
          ? { push: COURSE_ID }
          : exist.courses.filter((id) => COURSE_ID !== id), // @todo improve
        roles: isRole
          ? { push: ROLE }
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
