import { User } from "@prisma/client";
import { emailTransport } from "./transports";
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
      : "https://animaciones.fixtergeek.com"
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
      : "https://animaciones.fixtergeek.com"
  );
  url.pathname = "/portal";
  url.searchParams.set("token", token);

  console.log("📧 Enviando magic link a:", user.email);

  return emailTransport
    .sendMail({
      from: "no-reply@fixtergeek.com",
      to: user.email,
      subject: "🪄 Aquí está tu magic link 🎩",
      html: magicLinkTemplate({ link: url.toString() }),
    })
    .then((result: unknown) => {
      console.log("✅ Email enviado exitosamente:", result);
      return result;
    })
    .catch((e: Error) => {
      console.error("❌ Error al enviar email:", e);
      throw e;
    });
};

export const notifyBrendi = ({
  user,
  courseTitle,
}: {
  user: User;
  courseTitle: string;
}) => {
  return emailTransport.sendMail({
    from: "no-reply@fixtergeek.com",
    to: "brenda@fixter.org",
    subject: "🪄 Nueva compra! 🎫",
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
    next: "/player?videoSlug=bienvenida-al-curso",
  });

  console.log("📧 Enviando email de bienvenida a:", email);

  return emailTransport
    .sendMail({
      from: "no-reply@fixtergeek.com",
      to: email,
      subject: "🪄 Aquí está tu acceso 🎫",
      html: welcomeTemplate({ link: url.toString() }),
    })
    .then((result: unknown) => {
      console.log("✅ Email de bienvenida enviado exitosamente:", result);
      return result;
    })
    .catch((e: Error) => {
      console.error("❌ Error al enviar email de bienvenida:", e);
      throw e;
    });
};
