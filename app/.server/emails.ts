import { User } from "@prisma/client";
import { sendgridTransport } from "./transports";
import { magicLinkTemplate } from "~/email_templates/magicLinkTemplate";
import { welcomeTemplate } from "~/email_templates/welcomeTemplate";
import brendiTemplate from "~/email_templates/brendiTemplate";

const generateURL = (options: {
  pathname?: string;
  token?: string;
  next?: string;
}) => {
  const uri = new URL(
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "http://animations.fly.dev"
  );
  uri.pathname = options.pathname || "";
  options.token && uri.searchParams.set("token", options.token);
  options.next && uri.searchParams.set("next", options.next);
  return uri;
};

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

export const notifyBrendi = ({
  user,
  courseTitle,
}: {
  user: User;
  courseTitle: string;
}) => {
  return sendgridTransport.sendMail({
    from: "contacto@fixter.org",
    subject: "🪄 Aquí está tu acceso 🎫",
    bcc: [user.email],
    html: brendiTemplate({
      userMail: user.email,
      title: courseTitle,
      date: new Date().toLocaleDateString(), // @todo save the date somewhere!
    }),
  });
};

export const sendWelcomeEmail = (email: string, token: string) => {
  const url = generateURL({
    pathname: "/portal",
    token,
    next: "/player?videoSlug=primer-animacion-simple",
  });

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
