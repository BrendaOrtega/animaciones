import { json, redirect } from "@remix-run/react";
import { db } from "./db";

export const getOrCreateUser = async ({
  email,
  displayName,
  username,
}: Record<string, string | null | undefined>) => {
  const exist = await db.user.findUnique({
    where: {
      email,
    },
  });
  if (exist) return exist;
  return await db.create({ data: { email, displayName, username } });
};
