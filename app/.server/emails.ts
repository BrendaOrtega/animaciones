import { User } from "@prisma/client";
import { sendgridTransport } from "./transports";
import { magicLinkTemplate } from "~/email_templates/magicLinkTemplate";
import { welcomeTemplate } from "~/email_templates/welcomeTemplate";

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
    .then((result: unknown) => console.log(result))
    .catch((e: Error) => console.error(e));
};

export const sendWelcomeEmail = (email: string, token: string) => {
  const url = new URL(
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "http://animations.fly.dev"
  );
  url.pathname = "/portal";
  url.searchParams.set("token", token);
  url.searchParams.set("next", "/player?videoSlug=primer-animacion-simple"); // @todo update param

  return sendgridTransport
    .sendMail({
      from: "contacto@fixter.org",
      subject: "🪄 Aquí está tu acceso 🎫",
      bcc: [email],
      html: welcomeTemplate({ link: url.toString() }),
    })
    .then((result: unknown) => console.log(result))
    .catch((e: Error) => console.error(e));
};
