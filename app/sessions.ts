import { createCookieSessionStorage } from "@remix-run/node";

type SessionData = {
  userEmail: string;
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: "__session",
      httpOnly: true,
      maxAge: 604_800,
      path: "/",
      sameSite: "lax",
      secrets: ["pelusina69"],
      secure: true,
    },
  });

export { getSession, commitSession, destroySession };
