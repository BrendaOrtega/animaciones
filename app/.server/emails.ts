import { User } from "@prisma/client";
import { sendgridTransport } from "./transports";
import { magicLinkTemplate } from "~/email_templates/magicLinkTemplate";

export const sendMagicLinkEmail = (user: User, token: string) => {
  const url = new URL(
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "http://animations.fly.dev"
  );
  url.pathname = "/portal";
  url.searchParams.set("token", token);

  return sendgridTransport
    .sendMail({
      from: "contacto@fixter.org",
      subject: "🪄 Aquí está tu link mágico 🎩",
      bcc: [user.email],
      html: magicLinkTemplate({ link: url.toString() }),
    })
    .catch((e: Error) => console.error(e));
};
