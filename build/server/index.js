import { jsx, Fragment, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable, createCookieSessionStorage, redirect, json } from "@remix-run/node";
import { RemixServer, Meta, Links, Outlet, ScrollRestoration, Scripts, useRouteError, isRouteErrorResponse, useLoaderData, Form, useFetcher, useSearchParams, Link, redirect as redirect$1, useSubmit, json as json$1, createSearchParams } from "@remix-run/react";
import * as isbotModule from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { useEffect, useState, Suspense, Children, useRef, createContext, useContext } from "react";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import fs, { WriteStream } from "fs";
import path from "path";
import { finished } from "stream/promises";
import { Readable } from "stream";
import { S3Client, GetObjectCommand, PutBucketCorsCommand, CompleteMultipartUploadCommand, UploadPartCommand, CreateMultipartUploadCommand, HeadObjectCommand, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Agenda } from "@hokify/agenda";
import Ffmpeg from "fluent-ffmpeg";
import { fork } from "child_process";
import invariant from "tiny-invariant";
import { motion, LayoutGroup, useDragControls } from "motion/react";
import Stripe from "stripe";
import { z } from "zod";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { createTw } from "react-pdf-tailwind";
import { FaFacebookF, FaLinkedinIn, FaGoogle, FaReact, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FaXTwitter, FaLinkedin, FaGithub, FaYoutube, FaSquareXTwitter, FaPlay, FaGooglePlay } from "react-icons/fa6";
import { PiLinkSimpleBold } from "react-icons/pi";
import { IoMdLogOut, IoLogoWhatsapp, IoIosArrowDown, IoMdLock, IoIosClose } from "react-icons/io";
import { LuTicket } from "react-icons/lu";
import { useAnimate, stagger, motion as motion$1, useAnimationControls, useSpring, AnimatePresence, useScroll, useMotionValueEvent, useMotionValue, useVelocity, useTransform, useAnimationFrame, useMotionTemplate } from "framer-motion";
import { useSignal } from "@preact/signals-react";
import { RiTailwindCssFill } from "react-icons/ri";
import { Tab } from "@headlessui/react";
import { BsMenuButtonWide } from "react-icons/bs";
import { MdOutlineRadioButtonChecked, MdOutlineRadioButtonUnchecked, MdMenuOpen, MdOutlineAutoAwesomeMotion } from "react-icons/md";
import Hls from "hls.js";
import JSConfetti from "js-confetti";
import { IoClose, IoDocumentsOutline } from "react-icons/io5";
import { GrGithub, GrDrag } from "react-icons/gr";
import { HiOutlineDocumentSearch } from "react-icons/hi";
import { initializeApp } from "firebase/app";
import { signInWithPopup, getAuth, GoogleAuthProvider } from "firebase/auth";
import slugify from "slugify";
import { useForm } from "react-hook-form";
import require$$0 from "retry";
const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  let prohibitOutOfOrderStreaming = isBotRequest(request.headers.get("user-agent")) || remixContext.isSpaMode;
  return prohibitOutOfOrderStreaming ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function isBotRequest(userAgent) {
  if (!userAgent) {
    return false;
  }
  if ("isbot" in isbotModule && typeof isbotModule.isbot === "function") {
    return isbotModule.isbot(userAgent);
  }
  if ("default" in isbotModule && typeof isbotModule.default === "function") {
    return isbotModule.default(userAgent);
  }
  return false;
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
const useGoogleTM = (id) => {
  const tag = "G-BN504Z5FBK";
  useEffect(() => {
    const script1 = document.createElement("script");
    const script2 = document.createElement("script");
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${tag}`;
    script2.innerText = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${tag}');
        `;
    document.head.appendChild(script1);
    document.head.appendChild(script2);
  }, []);
};
const useHotjar = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.innerText = `
        (function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:5220566,hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `;
    document.head.appendChild(script);
  }, []);
};
const links = () => {
  return [
    {
      rel: "icon",
      href: "/icon.svg",
      type: "image/svg"
    }
  ];
};
function App() {
  useGoogleTM();
  useHotjar();
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("html", { suppressHydrationWarning: true, children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { suppressHydrationWarning: true, children: [
      /* @__PURE__ */ jsx(Outlet, {}),
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] }) });
}
function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return /* @__PURE__ */ jsxs("html", { children: [
      /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx("meta", { charset: "UTF-8" }) }),
      /* @__PURE__ */ jsx("body", { children: /* @__PURE__ */ jsx(
        "div",
        {
          style: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            textAlign: "center"
          },
          children: /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("img", { style: { width: "180px" }, src: "/404.svg" }),
            /* @__PURE__ */ jsx("h1", { style: { fontFamily: "monospace" }, children: "Ups ¡Esta página no existe!" }),
            /* @__PURE__ */ jsx("a", { href: "/", children: /* @__PURE__ */ jsx(
              "button",
              {
                style: {
                  height: "48px",
                  borderRadius: "24px",
                  backgroundColor: "#5158F6",
                  padding: "0 16px",
                  color: "white",
                  border: "none",
                  marginTop: "32px",
                  cursor: "pointer"
                },
                children: "Volver a la página principal"
              }
            ) })
          ] })
        }
      ) })
    ] });
  } else if (error instanceof Error) {
    return /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { children: "como estan" }),
      /* @__PURE__ */ jsxs("p", { children: [
        "hola",
        error.message
      ] }),
      /* @__PURE__ */ jsx("p", { children: "The stack trace is:" }),
      /* @__PURE__ */ jsx("pre", { children: error.stack })
    ] });
  } else {
    return /* @__PURE__ */ jsx("h1", { children: "Unknown Error" });
  }
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  default: App,
  links
}, Symbol.toStringTag, { value: "Module" }));
let db;
if (process.env.NODE_ENV === "production") {
  db = new PrismaClient();
} else {
  if (!global.__db) {
    global.__db = new PrismaClient();
  }
  db = global.__db;
}
const sendgridTransport = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 465,
  auth: {
    user: "apikey",
    pass: process.env.SENDGRID_KEY
  }
});
const magicLinkTemplate = ({ link }) => `

<html>
<head>
  <title> ¡Bienvenid@ de nuevo geek! 🔥</title>
</head>
<body style="font-family:Arial; background-color:#F8F8F8;padding:24px; ">
<div style="min-width:360px; max-width:480px; margin:0 auto;padding:24px; background-color:#ffffff; border-radius:24px;">
  <div >
    <img alt="logo" style="width:160px;" src="https://i.imgur.com/CSOCrRV.png"/>
  </div>
  <div style="text-align:left; background:white; border-radius:16px; margin-top:16px; ">
    <h2 style="color:#15191E; font-size:20px; margin-top:24px; line-height:140%">
    ¡Bienvenid@ de nuevo geek! 🤓
    </h2>
    <p style="margin-top:14px; color:#495466"> 
      Vuelve a entrar al curso: <strong>"Animaciones con React" </strong>   
    </p>
    <p style="margin-top:14px;color:#495466;"> 
       Aquí tienes tu magic link. <strong style="color:#5158f6;">
                                    Nos vemos dentro 🪄✨🎩🐰🤩
                                      </strong>
    </p> 
    <a href="${link}" target="_blank" rel="noreferrer" style="margin-top:24px;padding:12px 16px;border-radius:50px;background:#5158f6;color:white;font-weight:bold;text-decoration:none;display:inline-block;" >
    Abrir curso
    </a>
   <p style="margin-top:14px; color:#495466; margin-top:48px;"> 
     
    </p> 
    <p style="font-size:12px; color:#8391A1; margin-top:48px;">Si tienes alguna duda o pregunta, no dudes en responder este correo. </p>
  </div>
  
   <div style="text-align:left; margin-top:8px; margin-bottom:16px">
        <a href="https://www.facebook.com/fixterme" target="blank" style="text-decoration:none; "> 
          <img alt="facebook" style="width:24px; height:24px" src="https://i.imgur.com/JvkVAdP.png"/>
        </a>
           <a href="https://www.linkedin.com/company/28982942" target="blank" style="text-decoration:none;"> 
           <img alt="linkedin" style="width:24px; height:24px" src="https://i.imgur.com/Y8zd5tO.png"/>
        </a>
        <a href="https://twitter.com/FixterGeek" target="blank" style="text-decoration:none;"> 
           <img alt="twitter"  style="width:24px; height:24px" src="https://i.imgur.com/kGOfcQP.png"/>
        </a>
        </a>
            <a href="https://www.instagram.com/fixtergeek/" target="blank" style="text-decoration:none;"> 
           <img alt="instagram"  style="width:24px; height:24px" src="https://i.imgur.com/cqGKCq6.png"/>
        </a>
       <a href="https://www.youtube.com/@fixtergeek8057" target="blank" style="text-decoration:none;"> 
           <img alt="youtube"  style="width:24px; height:24px" src="https://i.imgur.com/S92vVcz.png"/>
      </a>
      </div>
  </div>
</body>
</html>


`;
const welcomeTemplate = ({ link }) => `

<html>
<head>
  <title>¡Todos los tutoriales son tuyos! 🔥</title>
</head>
<body style="font-family:Arial; background-color:#F8F8F8;padding:24px; ">
<div style="min-width:360px; max-width:480px; margin:0 auto;padding:24px; background-color:#ffffff; border-radius:24px;">
  <div >
    <img alt="logo" style="width:160px;" src="https://i.imgur.com/CSOCrRV.png"/>
  </div>
  <div style="text-align:left; background:white; border-radius:16px; margin-top:16px; ">
    <h2 style="color:#15191E; font-size:20px; margin-top:24px; line-height:140%">
    ¡Bienvenid@ geek! 👩🏻‍💻🧑🏻‍💻
    </h2>
    <p style="margin-top:14px; color:#495466"> 
      Ahora, ya puedes ver todos los tutoriales del curso <strong>"Animaciones con React" </strong>   🥳 
    </p>
<p style="margin-top:14px;color:#495466;"> 
        Nos vemos adentro, para construir componentes animados. 
    </p>
    <p>
         <strong style="color:#5158F6;">¡Qué empiece la magia! 🪄✨🎩🐰
  </strong>
    </p>
 
    <a href="${link}" target="_blank" rel="noreferrer" style="margin-top:24px;padding:12px 16px;border-radius:50px;background:#5158f6;color:white;font-weight:bold;text-decoration:none;display:inline-block;" >
    Comenzar curso
    </a>
   <p style="font-size:12px; color:#8391A1; margin-top:48px;">No olvides que las unidades 6 y 7 se estrenan en Enero.</p>
    <p style="font-size:12px; color:#8391A1; margin-top:12px;">Si tienes alguna duda o pregunta, no dudes en responder este correo. </p>
  </div>
  
   <div style="text-align:left; margin-top:8px; margin-bottom:16px">
        <a href="https://www.facebook.com/fixterme" target="blank" style="text-decoration:none; "> 
          <img alt="facebook" style="width:24px; height:24px" src="https://i.imgur.com/JvkVAdP.png"/>
        </a>
           <a href="https://www.linkedin.com/company/28982942" target="blank" style="text-decoration:none;"> 
           <img alt="linkedin" style="width:24px; height:24px" src="https://i.imgur.com/Y8zd5tO.png"/>
        </a>
        <a href="https://twitter.com/FixterGeek" target="blank" style="text-decoration:none;"> 
           <img alt="twitter"  style="width:24px; height:24px" src="https://i.imgur.com/kGOfcQP.png"/>
        </a>
        </a>
            <a href="https://www.instagram.com/fixtergeek/" target="blank" style="text-decoration:none;"> 
           <img alt="instagram"  style="width:24px; height:24px" src="https://i.imgur.com/cqGKCq6.png"/>
        </a>
       <a href="https://www.youtube.com/@fixtergeek8057" target="blank" style="text-decoration:none;"> 
           <img alt="youtube"  style="width:24px; height:24px" src="https://i.imgur.com/S92vVcz.png"/>
      </a>
      </div>
  </div>
</body>
</html>



`;
const brendiTemplate = ({
  title,
  slug,
  date,
  userName,
  userMail,
  isModule
}) => {
  return `
        <html>
      <head>
        <title>Una nueva compra</title>
      </head>
      <body style="font-family:Arial;">
      <div style="padding:80px 16px;font-family:sans-serif;font-size:18px;max-width:420px;margin:0 auto;">
      <img style="max-width:180px;margin-bottom:16px;" src="https://i.imgur.com/YPzE4Ks.png" alt="logo" />
      <h2 style="font-size:38px;margin:0;font-size:38px">
        👋🏼 Hola brendi 💁🏻‍♀️
      </h2>
      <p>
        ¡Hubo una nueva compra del curso!
        
        <br/><code style="color:#4b0082;margin-top:4px;display:inline-block;padding:2px 4px;background:#FFD966;border-radius:5px;" >${title ? title : slug}</code> 🥳
      </p>
      <ul>
        <li>Usuario: <strong>${userName}</strong></li>
         <li>Correo: <strong>${userMail}</strong></li>
          <li>¿Es módulo?: <strong> ${isModule ? "Si" : "No"}</strong></li>
           <li>Fecha: <strong>${date}</strong></li>
      </ul>
      <a href="https://fixtergeek.com/admin" style="border-radius:9px;text-decoration:none;background:#7c60f4;padding:16px;font-size:18px;margin-top:32px 0;display:block;max-width:150px;text-align:center;cursor:pointer;color:#fff;">
        Abrir admin
        </a>
        <a style="color:#7c60f4;margin-top:18px;display:block;font-size:16px;" href="https://fixtergeek.com/admin/blog"  target="_blank">También puedes administrar el blog</a>
    </div>
      </body>
    </html>
        `;
};
const generateURL = (options) => {
  const uri = new URL(
    process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://animaciones.fixtergeek.com"
  );
  uri.pathname = options.pathname || "";
  options.token && uri.searchParams.set("token", options.token);
  options.next && uri.searchParams.set("next", options.next);
  return uri;
};
const sendMagicLinkEmail = (user, token) => {
  const url = new URL(
    process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://animaciones.fixtergeek.com"
  );
  url.pathname = "/portal";
  url.searchParams.set("token", token);
  return sendgridTransport.sendMail({
    from: "contacto@fixter.org",
    subject: "🪄 Aquí está tu magic link 🎩",
    bcc: [user.email],
    html: magicLinkTemplate({ link: url.toString() })
  }).then((result) => console.log(result)).catch((e) => console.error(e));
};
const notifyBrendi = ({
  user,
  courseTitle
}) => {
  return sendgridTransport.sendMail({
    from: "contacto@fixter.org",
    subject: "🪄 Nueva compra! 🎫",
    bcc: ["brenda@fixter.org"],
    html: brendiTemplate({
      userMail: user.email,
      title: courseTitle,
      date: (/* @__PURE__ */ new Date()).toLocaleDateString()
      // @todo save the date somewhere!
    })
  });
};
const sendWelcomeEmail = (email, token) => {
  const url = generateURL({
    pathname: "/portal",
    token,
    next: "/player?videoSlug=bienvenida-al-curso"
  });
  return sendgridTransport.sendMail({
    from: "contacto@fixter.org",
    subject: "🪄 Aquí está tu acceso 🎫",
    bcc: [email],
    html: welcomeTemplate({ link: url.toString() })
  }).then((result) => console.log(result)).catch((e) => console.error(e));
};
const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    maxAge: 604800,
    // one week
    path: "/",
    sameSite: "lax",
    secrets: ["pelusina69"],
    secure: true
  }
});
const secret$1 = "yutuSecret";
const COURSE_ID$1 = "645d3dbd668b73b34443789c";
const ROLE$1 = "CAN_SHARE_50_DISCOUNT";
const checkIfUserIsEnrolledOrRedirect = async (request, video) => {
  const user = await getUserOrRedirect({ request });
  const includes = video.courseIds.find(
    (courseId2) => user.courses.includes(courseId2)
  );
  if (!includes) {
    throw redirect("/404");
  }
  return true;
};
const throwRedirect = async (redirectURL, session) => {
  throw redirect(redirectURL, {
    headers: {
      "Set-Cookie": await destroySession(session)
    }
  });
};
const getUserOrRedirect = async ({
  request,
  redirectURL = "/"
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
const getUserORNull = async (request) => {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userEmail")) return null;
  const email = session.get("userEmail");
  return await db.user.findUnique({ where: { email } });
};
const getAdminUserOrRedirect = async (request, redirectURL = "/") => {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userEmail")) return throwRedirect(redirectURL, session);
  const email = session.get("userEmail");
  const admin = await db.user.findUnique({ where: { email, role: "ADMIN" } });
  if (!admin) return throwRedirect(redirectURL, session);
  return admin;
};
const getCanShareUserORNull = async (courseId2, request) => {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userEmail")) return null;
  const email = session.get("userEmail");
  return await db.user.findUnique({
    where: {
      email,
      OR: [
        {
          roles: {
            has: "CAN_SHARE_50_DISCOUNT"
          }
        },
        {
          courses: {
            has: COURSE_ID$1
          }
        }
      ]
    }
  });
};
const confirmUser = async (email) => await db.user.update({ where: { email }, data: { confirmed: true } });
const setSessionWithEmailAndRedirect = async (email, {
  request,
  redirectURL = "/player"
}) => {
  const session = await getSession(request.headers.get("Cookie"));
  session.set("userEmail", email);
  throw redirect(redirectURL, {
    headers: {
      "Set-Cookie": await commitSession(session)
    }
  });
};
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, secret$1);
    return {
      success: true,
      decoded
    };
  } catch (e) {
    console.error(e);
    return {
      success: false
    };
  }
};
const sendWelcome = async (email) => {
  const token = jwt.sign({ email }, secret$1, { expiresIn: "365d" });
  await sendWelcomeEmail(email, token);
};
const sendMagicLink = async (email) => {
  const user = await db.user.findUnique({
    where: {
      email
    }
  });
  if (!user) return { error: "No existe una cuenta con este correo" };
  const token = jwt.sign({ email }, secret$1, { expiresIn: "365d" });
  await sendMagicLinkEmail(user, token);
  return { error: false };
};
const getOrCreateUser = async ({
  email,
  displayName,
  username,
  phoneNumber,
  photoURL,
  uid,
  confirmed: confirmed2
}) => {
  const exist = await db.user.findUnique({
    where: {
      email
    }
  });
  if (exist) {
    return exist;
  }
  return await db.user.create({
    data: {
      confirmed: confirmed2,
      photoURL,
      phoneNumber,
      email,
      displayName,
      username: username || email,
      uid
    }
  });
};
const getOrCreateAndUpdate = async ({
  email,
  displayName,
  username,
  phoneNumber,
  photoURL,
  uid,
  isConfirmed,
  isRole,
  isEnrolled
}) => {
  const exist = await db.user.findUnique({
    where: {
      email
    }
  });
  if (exist) {
    return await db.user.update({
      where: { email },
      data: {
        confirmed: isConfirmed,
        courses: isEnrolled ? { push: COURSE_ID$1 } : exist.courses.filter((id) => COURSE_ID$1 !== id),
        // @todo improve
        roles: isRole ? { push: ROLE$1 } : exist.roles.filter((rol) => ROLE$1 !== rol)
        // @todo improve
      }
    });
  }
  return await db.user.create({
    data: {
      confirmed,
      photoURL,
      phoneNumber,
      email,
      displayName,
      username: username || email,
      uid,
      courses: courseId ? { push: courseId } : void 0,
      roles: role ? { push: role } : void 0
      // @todo improve
    }
  });
};
const getMasterFileResponse = ({
  sizes = ["360p", "480p", "720p", "1080p"],
  storageKey
}) => {
  let content = "#EXTM3U\n";
  if (sizes.includes("360p")) {
    content += `#EXT-X-STREAM-INF:BANDWIDTH=375000,RESOLUTION=640x360
/playlist/${storageKey}/360p.m3u8
`;
  }
  if (sizes.includes("480p")) {
    content += `#EXT-X-STREAM-INF:BANDWIDTH=750000,RESOLUTION=854x480
/playlist/${storageKey}/480p.m3u8
`;
  }
  if (sizes.includes("720p")) {
    content += `#EXT-X-STREAM-INF:BANDWIDTH=2000000,RESOLUTION=1280x720
/playlist/${storageKey}/720p.m3u8
`;
  }
  if (sizes.includes("1080p")) {
    content += `#EXT-X-STREAM-INF:BANDWIDTH=3500000,RESOLUTION=1920x1080
/playlist/${storageKey}/1080p.m3u8`;
  }
  return new Response(content, {
    headers: {
      "content-type": "application/x-mpegURL"
    }
  });
};
const loader$8 = async ({ request, params }) => {
  const storageKey = params["storageKey"];
  const video = await db.video.findFirst({
    where: { storageKey },
    select: {
      m3u8: true,
      courseIds: true,
      isPublic: true
    }
  });
  let sizes = ["480p", "720p"];
  if (video == null ? void 0 : video.m3u8.includes("1080p")) {
    sizes.push("1080p");
  }
  if (video == null ? void 0 : video.m3u8.includes("360p")) {
    sizes.push("360p");
  }
  if (video && !video.isPublic) {
    await checkIfUserIsEnrolledOrRedirect(request, video);
  }
  if (!storageKey) {
    throw json("Not found", { status: 404 });
  }
  return getMasterFileResponse({ storageKey, sizes });
};
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$8
}, Symbol.toStringTag, { value: "Module" }));
const Bucket = process.env.BUCKET_NAME || "blissmo";
const getReadURL$1 = async (Key, expiresIn = 3600) => {
  await setCors$1();
  return await getSignedUrl(
    S3$1,
    new GetObjectCommand({
      Bucket,
      Key
    }),
    { expiresIn }
  );
};
const completeMultipart$1 = ({
  ETags,
  UploadId,
  Key
}) => {
  return S3$1.send(
    new CompleteMultipartUploadCommand({
      Bucket,
      Key,
      UploadId,
      MultipartUpload: {
        Parts: ETags.map((ETag, i) => ({
          ETag,
          PartNumber: i + 1
        }))
      }
    })
  );
};
const getPutPartUrl$1 = async (options) => {
  const { Key, UploadId, partNumber, expiresIn = 60 * 15 } = options || {};
  await setCors$1();
  return getSignedUrl(
    S3$1,
    new UploadPartCommand({
      Bucket,
      Key,
      UploadId,
      PartNumber: partNumber
    }),
    {
      expiresIn
    }
  );
};
const createMultipart = async (directory) => {
  let Key = randomUUID();
  Key = directory ? directory + Key : Key;
  const { UploadId } = await S3$1.send(
    new CreateMultipartUploadCommand({
      Bucket,
      Key
    })
  );
  if (!UploadId)
    throw new Error("Error trying to create a multipart upload 🚨");
  return {
    uploadId: UploadId,
    key: Key
  };
};
const setCors$1 = (options) => {
  const { MaxAgeSeconds = 3600, AllowedOrigins = ["*"] } = {};
  const input = {
    Bucket: process.env.BUCKET_NAME,
    CORSConfiguration: {
      CORSRules: [
        {
          MaxAgeSeconds,
          AllowedOrigins,
          AllowedHeaders: ["*"],
          ExposeHeaders: ["ETag"],
          // important for multipart
          AllowedMethods: ["PUT", "DELETE", "GET"]
        }
      ]
    }
  };
  const command = new PutBucketCorsCommand(input);
  return S3$1.send(command);
};
const S3$1 = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT_URL_S3
});
const CREATE_MULTIPART_STRING = "create_multipart_upload";
const CREATE_PUT_PART_URL_STRING = "create_put_part_url";
const COMPLETE_MULTIPART_STRING = "complete_multipart_upload";
const handler = async (request, cb) => {
  const body = await request.json();
  switch (body.intent) {
    case CREATE_MULTIPART_STRING:
      return new Response(
        JSON.stringify(await createMultipart(body.directory))
      );
    case CREATE_PUT_PART_URL_STRING:
      return new Response(
        await getPutPartUrl$1({
          Key: body.key,
          UploadId: body.uploadId,
          partNumber: body.partNumber
        })
      );
    case COMPLETE_MULTIPART_STRING:
      const completedData = await completeMultipart$1({
        ETags: body.etags,
        Key: body.key,
        UploadId: body.uploadId
      });
      const complete = {
        ...body,
        completedData,
        intent: void 0
      };
      return typeof cb === "function" ? cb(complete) : new Response(JSON.stringify(complete));
    default:
      return new Response(null);
  }
};
const fetchVideo = async (storageKey) => {
  const tempPath = `conversiones/${randomUUID()}/${storageKey}`;
  const getURL = await getReadURL$1(storageKey);
  const response2 = await fetch(getURL).catch((e) => console.error(e));
  console.log("FILE_FETCHED::", response2 == null ? void 0 : response2.ok, storageKey);
  if (!response2.ok) {
    console.log("BAD URL:", getURL);
  }
  if (!(response2 == null ? void 0 : response2.body)) {
    return {
      contentLength: "",
      contentType: "",
      ok: false,
      tempPath: "",
      fileStream: new WriteStream()
      // XD
    };
  }
  const __dirname = path.dirname(tempPath);
  if (!fs.existsSync(__dirname)) {
    fs.mkdirSync(__dirname, { recursive: true });
  }
  const fileStream = fs.createWriteStream(tempPath);
  await finished(Readable.fromWeb(response2.body).pipe(fileStream));
  return {
    contentLength: response2.headers.get("content-length") || "",
    contentType: response2.headers.get("content-type") || "",
    ok: response2.ok,
    tempPath,
    fileStream
    // @todo no files?
  };
};
const PREFIX = "animaciones/";
process.env.NODE_ENV === "development";
const S3 = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT_URL_S3
});
const setCors = (options) => {
  const { MaxAgeSeconds = 3600, AllowedOrigins = ["*"] } = {};
  const input = {
    Bucket: process.env.BUCKET_NAME,
    CORSConfiguration: {
      CORSRules: [
        {
          MaxAgeSeconds,
          AllowedOrigins,
          AllowedHeaders: ["*"],
          ExposeHeaders: ["ETag"],
          // important for multipart
          AllowedMethods: ["PUT", "DELETE", "GET"]
        }
      ]
    }
  };
  const command = new PutBucketCorsCommand(input);
  return S3.send(command);
};
const fileExist = async (key) => {
  return await S3.send(
    new HeadObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: PREFIX + key
    })
  ).then((r) => {
    console.log("::FILE_EXIST:: ", r.ContentType);
    return true;
  }).catch((err) => {
    console.error("FILE_MAY_NOT_EXIST", key, err.message);
    return false;
  });
};
const getReadURL = async (key, expiresIn = 3600) => {
  await setCors();
  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: PREFIX + key
  });
  return await getSignedUrl(S3, command, { expiresIn });
};
const getPutFileUrl = async (key) => {
  await setCors();
  return await getSignedUrl(
    S3,
    new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: PREFIX + key
    }),
    { expiresIn: 3600 }
  );
};
const getRemoveFileUrl = async (key) => {
  await setCors();
  return await getSignedUrl(
    S3,
    new DeleteObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: "animaciones/" + key
      // @TODO: update when prod beta
    }),
    { expiresIn: 3600 }
  );
};
const getComboURLs = async (key) => ({
  putURL: await getPutFileUrl(key),
  readURL: await getReadURL(key),
  deleteURL: await getRemoveFileUrl(key)
});
const removeFilesFor = async (id) => {
  const posterDelete = await getRemoveFileUrl("poster-" + id);
  const videoDelete = await getRemoveFileUrl("video-" + id);
  await fetch(posterDelete, { method: "DELETE" });
  await fetch(videoDelete, { method: "DELETE" });
  return true;
};
const CHUNKS_FOLDER$1 = "chunks";
const forkChild = (scriptPath, args = [], cb) => {
  const child = fork(scriptPath, ["niño", ...args]);
  child.on("error", (e) => console.error(e));
  child.on("exit", (exit) => {
    console.log("Terminó", exit);
  });
};
const uploadHLS = async ({
  contentType,
  storageKey
}) => {
  const path2 = `./conversiones/playlist/${storageKey}/`;
  const files = fs.readdirSync(path2).map((fileName) => path2 + fileName);
  const fetchPromises = files.map(async (path3) => {
    const arr = path3.split("/");
    const fileName = arr[arr.length - 1];
    const newStorageKey = `${storageKey}/${fileName}`;
    if (fileName.split(".").reverse()[0] === "m3u8") {
      console.log("New Key Asigned", newStorageKey);
    }
    const putURL = await getPutFileUrl(newStorageKey);
    const file = fs.readFileSync(path3);
    return await put({
      file,
      contentType: "application/x-mpegURL",
      contentLength: Buffer.byteLength(file).toString(),
      putURL
    });
  });
  await Promise.all(fetchPromises);
  const link = await replaceLinks(storageKey);
  return link;
};
function put({
  file,
  contentType = "application/x-mpegURL",
  putURL
}) {
  return fetch(putURL, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Length": Buffer.byteLength(file),
      "Content-Type": contentType
    }
  }).catch((e) => console.error(e));
}
const generateHSL = async (storageKey) => {
  const { tempPath } = await fetchVideo(storageKey);
  console.log("Por convertir: ", tempPath);
  await convertToHLS(tempPath, storageKey);
  return await uploadHLS({
    storageKey,
    contentType: "application/x-mpegURL"
  });
};
const updateVideoVersions = async (storageKey, size) => {
  const video = await db.video.findFirst({
    where: {
      storageKey
    }
  });
  if (!video) return;
  await db.video.update({
    where: { id: video.id },
    data: { m3u8: [.../* @__PURE__ */ new Set([...video.m3u8, size])] }
  });
};
const createHLSChunks = async ({
  sizeName = "720p",
  storageKey,
  cb,
  checkExistance,
  when = "in 1 second",
  onError
}) => {
  if (checkExistance) {
    const listPath = path.join(CHUNKS_FOLDER$1, storageKey, `${sizeName}.m3u8`);
    const exist = await fileExist(listPath);
    if (exist) {
      console.log("AVOIDING_VERSION::", sizeName);
      cb == null ? void 0 : cb(null);
      return;
    }
  }
  const agenda = new Agenda({ db: { address: process.env.DATABASE_URL } });
  agenda.define("generate_hls_chunks", async (job) => {
    const size = sizeName === "360p" ? "640x360" : sizeName === "480p" ? "800x480" : sizeName === "720p" ? "1280x720" : "1920x1080";
    const { storageKey: storageKey2 } = job.attrs.data;
    console.log(`CREATING::HLS_FOR::${sizeName}::`, storageKey2);
    const outputFolder = `media/${CHUNKS_FOLDER$1}/${storageKey2}/${sizeName}`;
    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder, { recursive: true });
    }
    const hlsSegmentFilename = `${outputFolder}/${sizeName}_%03d.ts`;
    const playListPath = `${outputFolder}/${sizeName}.m3u8`;
    const { tempPath } = await fetchVideo(storageKey2);
    const command = Ffmpeg(tempPath, { timeout: 432e3 }).size(size).addOption("-profile:v", "baseline").addOption("-level", "3.0").addOption("-start_number", "0").addOption("-hls_list_size", "0").addOption("-hls_time", "6").addOption("-f", "hls").addOption(`-hls_segment_filename ${hlsSegmentFilename}`);
    return await command.clone().on("progress", function({ frames, percent }) {
      console.log(
        "PROCESSING:: " + frames + "::::" + (percent == null ? void 0 : percent.toFixed(0)) + "%::::"
      );
    }).on("error", function(err) {
      console.log("ERROR_ON_MEDIA_PROCESSING: " + err.message);
      onError == null ? void 0 : onError();
    }).on("end", function() {
      console.log(`::VERSION_${sizeName}_CREATED::`);
      cb == null ? void 0 : cb(outputFolder);
    }).save(playListPath);
  });
  await agenda.start();
  await agenda.schedule(when, "generate_hls_chunks", { storageKey });
};
const uploadChunks = async (tempFolder, cleanUp2 = true, cb) => {
  if (!fs.existsSync(tempFolder)) {
    return console.error("FOLDER_NOT_FOUND::", tempFolder);
  }
  const chunkPaths = fs.readdirSync(tempFolder).map((fileName) => path.join(tempFolder, fileName));
  console.log("UPLOADING_FILES::", chunkPaths, chunkPaths.length);
  for await (let chunkPath of chunkPaths) {
    let cloudPath = chunkPath.split("/").slice(1);
    cloudPath.splice(cloudPath.length - 2, 1);
    cloudPath = cloudPath.join("/");
    const putURL = await getPutFileUrl(cloudPath);
    const file = fs.readFileSync(chunkPath);
    await put({
      file,
      contentType: "application/x-mpegURL",
      putURL
    });
    if (cleanUp2) {
      fs.rmSync(chunkPath, { recursive: true, force: true });
    }
  }
  console.log(`All chunks uploaded ${chunkPaths.length} for: ${tempFolder}`);
  await (cb == null ? void 0 : cb());
};
const convertToHLS = async (tempPath, storageKey) => {
  if (!fs.existsSync(`./conversiones/playlist/${storageKey}/`)) {
    fs.mkdirSync(`./conversiones/playlist/${storageKey}/`, { recursive: true });
  }
  const outputPath = `./conversiones/playlist/${storageKey}`;
  const hslSegmentFilename = `${outputPath}/segment%03d.ts`;
  const hslPath = `${outputPath}/index.m3u8`;
  const command = Ffmpeg(tempPath, { timeout: 432e3 }).videoBitrate(1024).videoCodec("libx264").audioBitrate("128k").audioCodec("aac").audioChannels(2).addOption("-hls_time", "5").addOption("-hls_list_size", "0").addOption(`-hls_segment_filename ${hslSegmentFilename}`).on("end", function() {
    console.log("file has been converted succesfully");
  }).on("error", function(err) {
    console.log("an error happened: " + err.message);
  });
  return await command.clone().save(hslPath);
};
const createVideoVersion = async (storageKey, size = "320x?") => {
  return forkChild("./child_process/experiment.js", [
    "detached_generateVideoVersion",
    JSON.stringify({
      storageKey,
      size
    })
  ]);
};
const replaceLinks = async (storageKey, playlist) => {
  const { tempPath, ok } = await fetchVideo(
    path.join("animaciones/", CHUNKS_FOLDER$1, storageKey, playlist)
  );
  if (!ok) return console.error("::PLAYLIST_NOT_FOUND::");
  const content = fs.readFileSync(tempPath, "utf8");
  const c = content.split("\n");
  const segmentNames = content.split("\n").filter((text) => text.includes(".ts"));
  const links2 = segmentNames.map((name) => {
    return `/playlist/${storageKey}/${name}`;
  });
  segmentNames.forEach((name, index) => {
    const i = c.findIndex((text) => text === name);
    c[i] = links2[index];
  });
  const joined = c.join("\n");
  return joined;
};
const CHUNKS_FOLDER = "chunks";
const loader$7 = async ({ request, params }) => {
  var _a;
  const storageKey = params["storageKey"];
  if (!storageKey) throw json("Not found", { status: 404 });
  let string = null;
  console.info("::SEGMENT::REQUIRED::", params.segment);
  if (((_a = params.segment) == null ? void 0 : _a.split(".")[1]) === "m3u8") {
    string = await replaceLinks(storageKey, params.segment);
    return new Response(string, {
      headers: {
        "Content-Type": "application/x-mpegURL"
      }
    });
  } else {
    invariant(params.segment);
    string = await getReadURL$1(
      path.join("animaciones/", CHUNKS_FOLDER, storageKey, params.segment)
    );
    return redirect(string);
  }
};
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$7
}, Symbol.toStringTag, { value: "Module" }));
function Route$7() {
  const [rotate, setRotate] = useState(0);
  return /* @__PURE__ */ jsx("article", { className: "h-screen flex justify-center items-center bg-gray-200", children: /* @__PURE__ */ jsxs("section", { className: "flex flex-col gap-6", children: [
    /* @__PURE__ */ jsxs("label", { className: "flex flex-col items-center gap-6 mb-8", children: [
      /* @__PURE__ */ jsxs("span", { className: "text-2xl", children: [
        "Rotación: ",
        rotate,
        "degs"
      ] }),
      /* @__PURE__ */ jsx(
        "input",
        {
          defaultValue: "180",
          min: "0",
          max: "180",
          type: "checkbox",
          onChange: (e) => setRotate(e.target.checked ? 200 : 0)
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0, x: 100, filter: "blur(4px)" },
        animate: { opacity: 1, x: 0, filter: "blur(0px)", rotate },
        transition: { type: "spring" },
        className: "h-40 aspect-square bg-pink-500 rounded-xl"
      }
    )
  ] }) });
}
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Route$7
}, Symbol.toStringTag, { value: "Module" }));
const isDev$2 = process.env.NODE_ENV === "development";
const stripe = new Stripe(
  isDev$2 ? process.env.STRIPE_SECRET_KEY_DEV || "" : process.env.STRIPE_SECRET_KEY,
  {
    // apiVersion: "2020-08-27",
  }
);
const action$8 = async ({ request }) => {
  var _a, _b, _c, _d, _e, _f;
  if (request.method !== "POST") return json(null, { status: 400 });
  const payload = await request.text();
  const webhookStripeSignatureHeader = request.headers.get("stripe-signature") || "";
  const endpointSecret = isDev$2 ? process.env.STRIPE_SIGN_DEV || "" : process.env.STRIPE_SIGN || "";
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      webhookStripeSignatureHeader,
      endpointSecret
    );
    console.log("STRIPE_PARSED_CORRECTLY");
  } catch (error) {
    console.error(`Stripe event construct error: ${error}`);
    return json(error, { status: 401 });
  }
  switch (event.type) {
    case "checkout.session.async_payment_failed":
    default:
      break;
    case "checkout.session.async_payment_succeeded":
    case "checkout.session.completed":
      const session = event.data.object;
      const email = session.customer_email || ((_a = session.customer_details) == null ? void 0 : _a.email);
      const courseId2 = ((_b = session.metadata) == null ? void 0 : _b.courseId) || "645d3dbd668b73b34443789c";
      if (!email || !courseId2) {
        return json(
          "customer_email or courseId are missing from webhook event",
          {
            status: 403
          }
        );
      }
      const user = await getOrCreateUser({
        username: email,
        email,
        displayName: ((_c = session.customer_details) == null ? void 0 : _c.name) || ""
      });
      console.log("USER_ACQUIRED::", user.email);
      const courses = [.../* @__PURE__ */ new Set([...user.courses, courseId2])];
      await db.user.update({
        where: { id: user.id },
        data: { courses }
      });
      await sendWelcome(user.email);
      const course = await db.course.findUnique({
        where: { id: courseId2 },
        select: { slug: true, title: true }
      });
      await notifyBrendi({
        user,
        courseTitle: (course == null ? void 0 : course.title) || (course == null ? void 0 : course.slug) || courseId2
      });
      if (!((_d = session.metadata) == null ? void 0 : _d.host)) break;
      await db.stat.upsert({
        where: { name: "share_discount_link", giver: (_e = session.metadata) == null ? void 0 : _e.host },
        create: {
          name: "share_discount_link",
          count: 1,
          giver: (_f = session.metadata) == null ? void 0 : _f.host,
          friends: [user.email]
        },
        update: { count: { increment: 1 }, friends: { push: user.email } }
      });
      break;
  }
  return json(null, { status: 200 });
};
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$8
}, Symbol.toStringTag, { value: "Module" }));
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const COURSE_ID = "645d3dbd668b73b34443789c";
const action$7 = async ({ request }) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "new") {
    const email = formData.get("email");
    z.string().email().parse(email);
    const isRole = formData.get("isRole") ? true : void 0;
    const isConfirmed = formData.get("isConfirmed") ? true : void 0;
    const isEnrolled = formData.get("isEnrolled") ? true : void 0;
    const data = {
      email,
      isConfirmed,
      isRole,
      isEnrolled
    };
    console.log("Received: ", data);
    await getOrCreateAndUpdate(data);
    throw redirect("/admin/users?search=" + email);
  }
  return null;
};
const loader$6 = async ({ request }) => {
  await getAdminUserOrRedirect(request);
  const url = new URL(request.url);
  const { searchParams } = url;
  const search = searchParams.has("search") ? searchParams.get("search") : void 0;
  const confirmed2 = searchParams.has("confirmed") ? true : void 0;
  const users = await db.user.findMany({
    where: {
      confirmed: confirmed2,
      email: search ? { contains: search } : void 0
    },
    take: search ? void 0 : 10,
    orderBy: { createdAt: "desc" }
  });
  return { users, search };
};
function Route$6() {
  const { users, search = "" } = useLoaderData();
  const [mode2, setMode] = useState("default");
  return /* @__PURE__ */ jsxs("article", { className: "bg-gray-950 min-h-screen text-gray-200 p-20", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-3xl mb-8", children: "Administrar estudiantes y usuarios" }),
    /* @__PURE__ */ jsx(SearchBar, { defaultValue: search || void 0 }),
    /* @__PURE__ */ jsx(AccessTable, { mode: mode2, setMode, users })
  ] });
}
const SearchBar = ({ defaultValue }) => {
  return /* @__PURE__ */ jsxs(Form, { className: "flex mb-2", children: [
    /* @__PURE__ */ jsx(
      "input",
      {
        defaultValue,
        name: "search",
        type: "search",
        className: "w-3/4 text-black",
        placeholder: "Busca un usuario por email"
      }
    ),
    /* @__PURE__ */ jsx("button", { className: "py-2 px-4 border w-1/4", children: "Buscar" })
  ] });
};
const AccessTable = ({
  mode: mode2 = "default",
  users,
  setMode
}) => {
  const fetcher = useFetcher();
  const setDefaultMode = () => setMode("default");
  const onAdd = () => setMode("new");
  const handleSubmit = (e) => {
    setMode("default");
    fetcher.submit(
      { intent: "new", email: e.currentTarget.email.value },
      { method: "POST" }
    );
  };
  return /* @__PURE__ */ jsxs("section", { className: "bg-gray-900 text-gray-200 pb-2 pt-2 px-2 group flex flex-col", children: [
    /* @__PURE__ */ jsx(Headers, {}),
    mode2 === "default" && /* @__PURE__ */ jsx(
      "button",
      {
        onClick: onAdd,
        className: "bg-indigo-500 invisible group-hover:visible px-4 py-2 font-bold rounded-full ml-auto mb-2",
        children: "Añadir"
      }
    ),
    mode2 === "new" && /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs(Form, { method: "POST", onSubmit: handleSubmit, children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-5 items-center gap-2", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            required: true,
            type: "email",
            name: "email",
            placeholder: "escribe el correo",
            className: "col-span-2 text-black"
          }
        ),
        /* @__PURE__ */ jsxs("label", { className: "cursor-pointer", children: [
          /* @__PURE__ */ jsx("span", { children: "Encender: " }),
          /* @__PURE__ */ jsx(
            "input",
            {
              name: "isRole",
              value: "CAN_SHARE_50_DISCOUNT",
              type: "checkbox"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "cursor-pointer", children: [
          /* @__PURE__ */ jsx("span", { children: "Encender: " }),
          /* @__PURE__ */ jsx("input", { name: "isEnrolled", value: COURSE_ID, type: "checkbox" })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "cursor-pointer", children: [
          /* @__PURE__ */ jsx("span", { children: "Encender: " }),
          /* @__PURE__ */ jsx("input", { name: "isConfirmed", type: "checkbox" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex py-2 gap-1", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            className: "font-bold text-lg py-2 border w-full active:bg-gray-950 transition-all",
            name: "intent",
            value: "new",
            children: "Guardar"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: setDefaultMode,
            className: "w-full border bg-gray-800",
            children: "Cancelar"
          }
        )
      ] })
    ] }) }),
    users.map((user, index) => /* @__PURE__ */ jsxs(Row, { className: "", children: [
      /* @__PURE__ */ jsx("p", { className: "col-span-2", children: user.email }),
      /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsxs("label", { className: "cursor-pointer", children: [
        /* @__PURE__ */ jsx("span", { children: " " }),
        /* @__PURE__ */ jsx(
          "input",
          {
            name: "role",
            checked: user.roles.includes("CAN_SHARE_50_DISCOUNT"),
            onChange: () => false,
            className: "rounded-full",
            type: "checkbox"
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsxs("label", { className: "cursor-pointer", children: [
        /* @__PURE__ */ jsx("span", { children: " " }),
        /* @__PURE__ */ jsx(
          "input",
          {
            name: "course",
            checked: user.courses.includes("645d3dbd668b73b34443789c"),
            onChange: () => false,
            className: "rounded-full",
            type: "checkbox"
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxs("p", { children: [
        " ",
        /* @__PURE__ */ jsxs("label", { className: "cursor-pointer", children: [
          /* @__PURE__ */ jsx("span", { children: " " }),
          /* @__PURE__ */ jsx(
            "input",
            {
              name: "confirmed",
              checked: user.confirmed,
              onChange: () => false,
              className: "rounded-full",
              type: "checkbox"
            }
          )
        ] })
      ] })
    ] }, index)),
    /* @__PURE__ */ jsx(
      "button",
      {
        className: "py-2 px-4 border mt-4 ml-auto disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed",
        disabled: true,
        children: "Cargar todo"
      }
    )
  ] });
};
const Headers = () => {
  const [searchParams] = useSearchParams();
  return /* @__PURE__ */ jsxs("header", { className: "grid grid-cols-5", children: [
    /* @__PURE__ */ jsx("h3", { className: "col-span-2", children: "Email" }),
    /* @__PURE__ */ jsx("h3", { children: "Puede compartir descuento" }),
    /* @__PURE__ */ jsx("h3", { children: "Tiene acceso al curso" }),
    /* @__PURE__ */ jsx(
      Link,
      {
        className: cn("flex items-center justify-center", {
          "bg-gray-500 ": searchParams.has("confirmed")
        }),
        to: searchParams.has("confirmed") ? `/admin/users` : `/admin/users?confirmed=true`,
        children: /* @__PURE__ */ jsx("h3", { children: "Cuenta confirmada" })
      }
    )
  ] });
};
const Row = ({
  className,
  ...props
}) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(
        "grid grid-cols-5 gap-2 py-4 border px-4 bg-gray-800",
        "hover:bg-gray-900",
        className
      ),
      ...props
    }
  );
};
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Row,
  action: action$7,
  default: Route$6,
  loader: loader$6
}, Symbol.toStringTag, { value: "Module" }));
const PDFViewer = void 0;
createTw({});
function Route$5() {
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs(Suspense, { fallback: /* @__PURE__ */ jsx(Fragment, { children: "cargando..." }), children: [
    /* @__PURE__ */ jsx(PDFViewer, {}),
    ";"
  ] }) });
}
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Route$5
}, Symbol.toStringTag, { value: "Module" }));
async function action$6({ request }) {
  return await handler(request);
}
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$6
}, Symbol.toStringTag, { value: "Module" }));
const ToggleButton = () => {
  const [enabled, setEnabled] = useState(false);
  const toggle = () => {
    const val = !enabled;
    const main = document.documentElement;
    if (val) {
      main == null ? void 0 : main.classList.add("dark");
    } else {
      main == null ? void 0 : main.classList.remove("dark");
    }
    setEnabled(val);
  };
  return /* @__PURE__ */ jsxs(
    "label",
    {
      htmlFor: "check",
      className: "cursor-pointer bg-lightGray dark:bg-[#242424] px-1 py-1 w-[52px] rounded-full transition-all has-[checked]:pl-6 ",
      children: [
        /* @__PURE__ */ jsx("div", { className: "size-4 w-6 h-6 dark:bg-[url('/moon.svg')] translate-x-0 rounded-full bg-[url('/sun.svg')] bg-cover  bg-white transition dark:translate-x-5 group-data-[checked]:translate-x-5" }),
        /* @__PURE__ */ jsx("input", { onChange: toggle, id: "check", type: "checkbox", className: "hidden" })
      ]
    }
  );
};
const NavBar = ({
  mode: mode2,
  className
}) => {
  var _a;
  const fetcher = useFetcher();
  useEffect(() => {
    fetcher.submit(
      {
        intent: "self"
      },
      { method: "POST", action: "/api" }
    );
  }, []);
  const [userEmail, setUserEmail] = useState("");
  const handleSignOut = () => {
    fetcher.submit(
      { intent: "sign-out" },
      { method: "DELETE", action: "/portal" }
    );
  };
  useEffect(() => {
    if (fetcher.data) {
      setUserEmail(fetcher.data.email);
    }
  }, [fetcher.data]);
  const canShare = (_a = fetcher.data) == null ? void 0 : _a.roles.includes(ROLE);
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(
    "nav",
    {
      className: cn(
        "fixed top-0 h-16  bg-white/10 dark:bg-dark/40 backdrop-blur-md z-[20] w-full  px-6 md:px-[6%] lg:px-0",
        {
          "text-white bg-dark": mode2 === "player"
        },
        className
      ),
      children: /* @__PURE__ */ jsxs("div", { className: "xl:max-w-7xl justify-between items-center h-16 mx-auto flex", children: [
        /* @__PURE__ */ jsx(Link, { to: "/", children: /* @__PURE__ */ jsx("img", { className: "h-10", src: "/Logo.png", alt: "logo" }) }),
        mode2 !== "player" && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/portal",
              className: cn(
                "transition-all text-dark dark:text-white hover:text-gray-500 ml-auto mr-4",
                {
                  "font-bold text-fish/80 hover:text-fish": userEmail
                }
              ),
              children: userEmail ? "Seguir viendo" : "Iniciar sesión"
            }
          ),
          /* @__PURE__ */ jsx(ToggleButton, {})
        ] }),
        mode2 === "player" && userEmail && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
          canShare && /* @__PURE__ */ jsx(Link, { to: "/comunidad", children: /* @__PURE__ */ jsx(LuTicket, { className: "text-2xl hover:scale-110" }) }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: handleSignOut,
              className: "flex items-center gap-2 text-base transition-all hover:scale-105 py-1 px-2 rounded-full text-white  active:scale-100",
              children: [
                "Cerrar sesión",
                /* @__PURE__ */ jsx(IoMdLogOut, { className: "text-xl" })
              ]
            }
          )
        ] })
      ] })
    }
  ) });
};
const isDev$1 = process.env.NODE_ENV === "development";
const location = isDev$1 ? "http://localhost:3000" : "https://animaciones.fixtergeek.com";
const PRICE_1499 = "price_1QKLfhJ7Zwl77LqnZw5iaY1V";
const PRICE_999 = "price_1QKRbEJ7Zwl77Lqn0O8rRwrN";
const DEV_PRICE = "price_1KBnlPJ7Zwl77LqnixoYRahN";
const DEV_COUPON = "rXOpoqJe";
const COUPON_40 = "EphZ17Lv";
const COUPON_50 = "yYMKDuTC";
const get40Checkout = async () => {
  return await getStripeCheckout({
    coupon: isDev$1 ? DEV_COUPON : COUPON_40
  });
};
const get50CheckoutWithShirt = async (tokenEmail) => {
  return await getStripeCheckout({
    price: PRICE_1499,
    coupon: isDev$1 ? DEV_COUPON : COUPON_50,
    // -50%
    metadata: {
      host: tokenEmail
    }
  });
};
const get50Checkout = async (tokenEmail) => {
  return await getStripeCheckout({
    // price: PRICE_999,
    coupon: isDev$1 ? DEV_COUPON : COUPON_50,
    // -50%
    metadata: {
      host: tokenEmail
    }
  });
};
const getStripeCheckout = async (options = { metadata: {} }) => {
  const stripe2 = new Stripe(
    isDev$1 ? process.env.STRIPE_SECRET_KEY_DEV || "" : process.env.STRIPE_SECRET_KEY,
    {}
  );
  const session = await stripe2.checkout.sessions.create({
    metadata: {
      courseId: "645d3dbd668b73b34443789c",
      // others?
      ...options.metadata
    },
    customer_email: options == null ? void 0 : options.customer_email,
    mode: "payment",
    line_items: [
      {
        price: options.price ? options.price : isDev$1 ? "price_1KBnlPJ7Zwl77LqnixoYRahN" : PRICE_999,
        // prod
        quantity: 1
      }
    ],
    success_url: `${location}/player?success=1`,
    cancel_url: `${location}/player?videoIndex=10`,
    discounts: options.coupon ? [{ coupon: options.coupon }] : void 0,
    allow_promotion_codes: options.coupon ? void 0 : true
    // <= @todo multi moneda?
  });
  return session.url || "/";
};
const PrimaryButton = ({
  className,
  children,
  isDisabled,
  isLoading,
  as,
  to = "",
  onClick,
  ...props
}) => {
  const Element = as === "Link" ? Link : "button";
  return /* @__PURE__ */ jsxs(
    Element,
    {
      onClick,
      to,
      disabled: isDisabled,
      ...props,
      className: twMerge(
        "rounded-full md:enabled:hover:px-8  transition-all bg-fish text-base md:text-lg text-white h-12 md:h-14 px-6 flex gap-2 items-center justify-center font-light",
        "disabled:bg-slate-300 disabled:pointer-events-none",
        className
      ),
      children: [
        !isLoading && children,
        isLoading && /* @__PURE__ */ jsx("div", { className: "w-6 h-6 rounded-full animate-spin border-4 border-t-indigo-500" })
      ]
    }
  );
};
const sleep$1 = (s) => new Promise((r) => setTimeout(r, s * 1e3));
const useToast = () => {
  const setInitial = (toast) => {
    toast.style.transition = "all .3s ease";
    toast.style.position = "fixed";
    toast.style.bottom = "64px";
    toast.style.right = "40px";
    toast.style.transform = "translateY(20px)";
    toast.style.opacity = 0;
  };
  const setAnimate = (toast) => {
    toast.style.transform = "translateY(0px)";
    toast.style.opacity = "1";
  };
  const setExit = (toast) => {
    toast.style.transform = "translateY(-20px)";
    toast.style.opacity = "0";
  };
  const success = async ({
    text,
    icon = "✅"
  }) => {
    const toast = document.createElement("section");
    setInitial(toast);
    toast.innerHTML = `
    <div class="pl-4 pr-4 py-4 h-16 bg-[#ECF2EB]  rounded-full text-green-800 flex items-center justify-center " >
    <div class="flex items-center gap-3"><span class="w-12 h-12 text-4xl flex items-center justify-center rounded-full">${icon}</span>
    <p class="text-xl text-[#32472F] "> ${text}</p></div>
    </div>
    `;
    document.body.appendChild(toast);
    await sleep$1(0.01);
    setAnimate(toast);
    setTimeout(async () => {
      setExit(toast);
      await sleep$1(0.3);
      toast.remove();
    }, 3e3);
  };
  const error = async ({
    text,
    icon = "😰"
  }) => {
    const toast = document.createElement("section");
    setInitial(toast);
    toast.innerHTML = `
    <div class="pl-4 pr-4 py-4 h-16 bg-red-300  rounded-full text-red-900 flex items-center justify-center " >
    <div class="flex items-center gap-3"><span class="w-12 h-12 text-4xl flex items-center justify-center rounded-full">${icon}</span>
    <p class="text-xl text-[#32472F] "> ${text}</p></div>
    </div>
    `;
    document.body.appendChild(toast);
    await sleep$1(0.01);
    setAnimate(toast);
    setTimeout(async () => {
      setExit(toast);
      await sleep$1(0.3);
      toast.remove();
    }, 2e3);
  };
  return {
    success,
    error
  };
};
const getMetaTags = ({
  title = "Fixtergeek.com",
  description = "Cursos para programadores latinoamericanos reales",
  image = "https://i.imgur.com/kP5Rrjt.png",
  // || "/full-logo.svg",
  url = "https://fixtergeek.com",
  video,
  audio
}) => [
  { title },
  {
    property: "og:title",
    content: title
  },
  {
    name: "description",
    content: description
  },
  {
    property: "og:description",
    content: description
  },
  {
    property: "og:site_name",
    content: title
  },
  {
    property: "og:url",
    content: url
  },
  {
    property: "og:type",
    content: "video.courses"
  },
  {
    property: "og:image",
    content: image
  },
  {
    property: "og:image:alt",
    content: "fixtergeek.com logo"
  },
  {
    property: "og:locale",
    content: "es_MX"
  },
  {
    property: "og:video",
    content: video
  },
  {
    property: "og:audio",
    content: audio
  },
  {
    property: "twitter:card",
    content: "summary_large_image"
  },
  {
    property: "twitter:description",
    content: description
  },
  {
    property: "twitter:title",
    content: title
  },
  {
    property: "twitter:image",
    content: image
  }
];
const meta$2 = () => getMetaTags({
  title: "Andas de suerte ¡eh! 🍀",
  description: "Te comparto mi descuento del 50%",
  image: "https://i.imgur.com/cqJVvjK.png"
});
const isDev = process.env.NODE_ENV === "development";
const secret = "fixtergeek2024" + isDev;
const ROLE = "CAN_SHARE_50_DISCOUNT";
const generateLink = (token) => (isDev ? `http://localhost:3000` : `https://animaciones.fixtergeek.com`) + "/comunidad?token=" + token;
const getToken = (email) => {
  return jwt.sign({ email }, secret, { expiresIn: "30d" });
};
const validateToken = (token) => {
  let result;
  try {
    const r = jwt.verify(token, secret);
    result = { ...r, success: true };
  } catch (e) {
    result = { success: false };
  }
  return result;
};
const action$5 = async ({ request }) => {
  const url = new URL(request.url);
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === ROLE) {
    const token = url.searchParams.get("token");
    const result = validateToken(token);
    const playera = formData.get("playera");
    let stripeURL;
    if (playera === "1") {
      stripeURL = await get50CheckoutWithShirt(result.email);
    } else {
      stripeURL = await get50Checkout(result.email);
    }
    return redirect(stripeURL);
  }
  if (intent === "checkout") {
    const stripeURL = await getStripeCheckout();
    throw redirect(stripeURL);
  }
  return null;
};
const loader$5 = async ({ request }) => {
  const url = new URL(request.url);
  const { searchParams } = url;
  if (searchParams.has("token")) {
    const token = searchParams.get("token");
    const tokenResult = validateToken(token);
    if (tokenResult.success) {
      return {
        screen: "discount",
        link: generateLink(token)
      };
    } else {
      return { screen: "bad_token", link: token, courseTitle: "" };
    }
  }
  const user = await getCanShareUserORNull("645d3dbd668b73b34443789c", request);
  if (user == null ? void 0 : user.email) {
    const token = getToken(user.email);
    return {
      screen: "default",
      link: generateLink(token)
    };
  }
  return redirect("/");
};
function Route$4() {
  const {
    screen,
    link,
    courseTitle = "Construye más de 14 componentes animados con React y Motion"
  } = useLoaderData();
  switch (screen) {
    case "discount":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(NavBar, {}),
        /* @__PURE__ */ jsx(Invite, { courseTitle })
      ] });
    case "bad_token":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(NavBar, {}),
        /* @__PURE__ */ jsx(BadToken, {})
      ] });
    default:
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(NavBar, {}),
        /* @__PURE__ */ jsx(Sharing, { link })
      ] });
  }
}
const BadToken = () => {
  const fetcher = useFetcher();
  const handleSubmit = () => {
    fetcher.submit(
      {
        intent: "checkout"
      },
      { method: "POST" }
    );
  };
  return /* @__PURE__ */ jsxs("section", { className: "flex flex-col items-center h-screen justify-center gap-4 dark:bg-dark/90 bg-white/40 dark:text-white", children: [
    /* @__PURE__ */ jsx("img", { className: "w-52 h-auto", src: "/robot-llora.png" }),
    /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-5xl font-semibold text-center", children: "¡Hoy no hay suerte!" }),
    /* @__PURE__ */ jsxs("p", { className: "text-xl text-center dark:text-metal text-iron font-light mt-0 mb-8", children: [
      "Tu amig@ te ha compartido un descuento del 50% para un curso,",
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("strong", { className: "font-bold", children: "pero el token ya no sirve" })
    ] }),
    /* @__PURE__ */ jsxs("p", { className: " text-xl md:text-3xl text-center mb-12 text-fish", children: [
      "El Token es ",
      /* @__PURE__ */ jsx("strong", { children: "inutilizable" })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-xl text-center dark:text-metal text-iron font-light mt-0 mb-8", children: "Los tokens solo viven unas horas 😭" }),
    /* @__PURE__ */ jsxs(
      Form,
      {
        onSubmit: handleSubmit,
        method: "POST",
        className: "flex-wrap md:flex-nowrap justify-center items-center flex gap-4 md:gap-6",
        children: [
          /* @__PURE__ */ jsx(
            PrimaryButton,
            {
              isDisabled: fetcher.state !== "idle",
              className: "active:shadow",
              name: "intent",
              type: "submit",
              value: "checkout",
              children: "Comprar de todas formas 🪄"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: "bg-[#F5F5F5] md:mt-0 mx-auto font-normal text-gray-400 rounded-full enabled:hover:px-8 transition-all text-base md:text-lg  h-12 md:h-14 px-6 flex gap-2 items-center justify-center cursor-not-allowed",
              children: "Reclamar a tu amig@"
            }
          ),
          /* @__PURE__ */ jsx(Link, { to: "/", children: /* @__PURE__ */ jsx("button", { className: "bg-[#F5F5F5] md:mt-0 mx-auto font-normal text-gray-600 rounded-full enabled:hover:px-8 transition-all text-base md:text-lg  h-12 md:h-14 px-6 flex gap-2 items-center justify-center ", children: "Ver detalle del curso" }) })
        ]
      }
    )
  ] });
};
const Invite = ({ courseTitle }) => {
  const fetcher = useFetcher();
  const handleClick = (event, playera) => {
    fetcher.submit(
      {
        playera,
        intent: ROLE
      },
      { method: "POST" }
    );
  };
  return /* @__PURE__ */ jsxs("section", { className: "flex flex-col items-center min-h-screen justify-center gap-4 dark:bg-dark bg-white/40 dark:text-white px-4 md:px-0", children: [
    /* @__PURE__ */ jsx("img", { className: "w-44 md:w-52 h-auto", src: "/congrats.png" }),
    /* @__PURE__ */ jsx("h2", { className: "text-2xl md:text-5xl font-semibold text-center", children: "¡Andas de suerte eh! 🍀" }),
    /* @__PURE__ */ jsxs("p", { className: "text-base md:text-xl text-center dark:text-metal text-iron font-light mt-0 mb-0 md:mb-8", children: [
      "Tu amig@ te ha compartido un descuento del",
      /* @__PURE__ */ jsxs("strong", { className: "font-bold", children: [
        " ",
        "50% para el curso ",
        /* @__PURE__ */ jsx("br", {}),
        "«",
        courseTitle,
        "»"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap md:flex-nowrap justify-center gap-4 md:gap-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "border border-dark/10 rounded-3xl w-full md:w-56 h-fit text-center p-4", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-base md:text-xl font-medium text-dark dark:text-white", children: "Animaciones con React" }),
        /* @__PURE__ */ jsx("p", { className: "text-iron font-light dark:text-metal text-sm mt-1 mb-2", children: "Full course" }),
        /* @__PURE__ */ jsx("span", { className: "line-through	font-semibold", children: "$999 " }),
        " ",
        /* @__PURE__ */ jsxs("span", { className: " text-[#FF4B4B] dark:text-[#C8496C] font-semibold ml-2", children: [
          "$499",
          " "
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "text-xs font-normal text-iron dark:text-metal/70  ", children: [
          "/ MXN",
          " "
        ] }),
        /* @__PURE__ */ jsx(
          PrimaryButton,
          {
            onClick: handleClick,
            isDisabled: fetcher.state !== "idle",
            className: "active:shadow mx-auto mt-3 md:mt-6 w-40",
            children: "Canjear"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "border border-dark/10 rounded-3xl w-full md:w-56 h-fit text-center p-4", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-base md:text-xl font-medium text-dark dark:text-white", children: "Animaciones con React" }),
        /* @__PURE__ */ jsx("p", { className: "text-iron font-light dark:text-metal text-sm mt-1 mb-2", children: "Full course + playera" }),
        /* @__PURE__ */ jsx("span", { className: "line-through	font-semibold", children: "$1,499 " }),
        " ",
        /* @__PURE__ */ jsxs("span", { className: " text-[#FF4B4B] dark:text-[#C8496C] font-semibold ml-2", children: [
          "$750",
          " "
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "text-xs font-normal text-iron dark:text-metal/70  ", children: [
          "/ MXN",
          " "
        ] }),
        /* @__PURE__ */ jsx(
          PrimaryButton,
          {
            onClick: (event) => handleClick(event, 1),
            isDisabled: fetcher.state !== "idle",
            className: "active:shadow mx-auto mt-3 md:mt-6 w-40",
            children: "Canjear 👕"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-base md:text-lg text-center dark:text-metal text-iron font-light mt-0 mb-8", children: "¡Apresúrate! Recuerda que los tokens solo viven un ratito 🕣" }),
    /* @__PURE__ */ jsx("div", { className: "flex-wrap md:flex-nowrap justify-center items-center flex gap-4 md:gap-6", children: /* @__PURE__ */ jsx(Link, { to: "/", children: /* @__PURE__ */ jsx("button", { className: "bg-[#F5F5F5] md:mt-0 mx-auto font-normal text-gray-600 rounded-full enabled:hover:px-8 transition-all text-base md:text-lg  h-12 md:h-14 px-6 flex gap-2 items-center justify-center ", children: "Ver detalle del curso" }) }) })
  ] });
};
const Sharing = ({ link }) => {
  const toast = useToast();
  const handleSocialClick = () => {
    navigator.clipboard.writeText(link);
    toast.success({ text: "Link copiado", icon: "🪄" });
  };
  return /* @__PURE__ */ jsxs("section", { className: "flex flex-col items-center h-screen px-4 md:px-0 justify-center gap-4 dark:bg-dark bg-white/40 dark:text-white", children: [
    /* @__PURE__ */ jsx("img", { className: "w-52 h-auto", src: "/like.png", alt: "logo " }),
    /* @__PURE__ */ jsxs("h2", { className: "text-3xl md:text-5xl  text-center font-semibold", children: [
      "Comparte este súper descuento ",
      /* @__PURE__ */ jsx("br", {}),
      "con tus amigos 💪🏻"
    ] }),
    /* @__PURE__ */ jsxs("p", { className: "text-xl text-center dark:text-metal text-iron font-light mt-0 mb-8", children: [
      "Todos tus amigos obtienen",
      " ",
      /* @__PURE__ */ jsx("strong", { className: "font-bold", children: " 50% de descuento" }),
      " con tu link.",
      " ",
      /* @__PURE__ */ jsx("br", {}),
      " De eso se trata la comunidad ¡de compartir! 🫂"
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: handleSocialClick,
        className: "dark:bg-lightGray/5 bg-lightGray/20 dark:border-lightGray/20  flex relative w-full md:w-[480px] gap-2 h-16 rounded-full border border-lightGray active:scale-95 transition-all",
        children: /* @__PURE__ */ jsx(
          "input",
          {
            defaultValue: link,
            disabled: true,
            name: "email",
            type: "email",
            placeholder: "brendi@ejemplo.com",
            className: cn(
              "  py-2 px-6 w-full h-full bg-transparent rounded-full border-none focus:border-none focus:ring-indigo-500 truncate pointer-events-none"
            )
          }
        )
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-3 mt-3", children: [
      /* @__PURE__ */ jsx(
        SocialMedia,
        {
          onClick: handleSocialClick,
          name: "Link",
          className: "bg-[#F0A13A] text-[#ffffff] hover:bg-[#F0A13A] hover:text-white",
          children: /* @__PURE__ */ jsx(PiLinkSimpleBold, {})
        }
      ),
      /* @__PURE__ */ jsx(
        SocialMedia,
        {
          name: "Facebook",
          link: `https://www.facebook.com/sharer/sharer.php?u=${link}`,
          className: "bg-[#357BEB] text-[#ffffff] hover:bg-[#357BEB] hover:text-white",
          children: /* @__PURE__ */ jsx(FaFacebookF, {})
        }
      ),
      /* @__PURE__ */ jsx(
        SocialMedia,
        {
          name: "X",
          link: `https://twitter.com/intent/tweet?url=${link}&text=¡Te comparto mi link de descuento!`,
          className: "bg-[#171717] text-[#ffffff] hover:bg-[#171717] hover:text-white",
          children: /* @__PURE__ */ jsx(FaXTwitter, {})
        }
      ),
      /* @__PURE__ */ jsx(
        SocialMedia,
        {
          name: "Linkedin",
          link: `http://www.linkedin.com/shareArticle?mini=true&url=${link}&title=¡Te comparto mi link de descuento!`,
          className: "bg-[#2967BC] text-[#ffffff] hover:bg-[#2967BC] hover:text-white",
          children: /* @__PURE__ */ jsx(FaLinkedinIn, {})
        }
      ),
      /* @__PURE__ */ jsx(
        SocialMedia,
        {
          name: "Gmail",
          link: `https://mail.google.com/mail/?view=cm&fs=1&to=tu_amiga@example.com&su=¡Te comparto mi descueto!&body=Este es mi link de descuento para el curso de Animaciones con React: 
 ${link}`,
          className: "bg-[#F47353] text-white hover:bg-[#F47353] hover:text-white",
          children: /* @__PURE__ */ jsx(FaGoogle, {})
        }
      ),
      /* @__PURE__ */ jsx(
        SocialMedia,
        {
          link: `https://api.whatsapp.com/send/?text=¡Te+comparto+mi+link+de+descuento!${link}&type=phone_number&app_absent=0`,
          name: "Whatsapp",
          className: "bg-[#73C56B] text-white hover:bg-[#73C56B] hover:text-white",
          children: /* @__PURE__ */ jsx(IoLogoWhatsapp, {})
        }
      )
    ] })
  ] });
};
const SocialMedia = ({
  className,
  children,
  name,
  link,
  onClick
}) => {
  return /* @__PURE__ */ jsx("a", { rel: "noreferrer", target: "_blank", href: link, children: /* @__PURE__ */ jsxs(
    "button",
    {
      onClick,
      className: twMerge(
        "group rounded-full w-12 hover:scale-125 transition-all h-12 text-xl flex items-center justify-center relative active:scale-95",
        className
      ),
      children: [
        children,
        /* @__PURE__ */ jsx(
          "span",
          {
            className: twMerge(
              "absolute bg-dark dark:bg-[#1B1D22] -bottom-8 text-xs text-white px-2 py-1 rounded hidden group-hover:block"
            ),
            children: name
          }
        )
      ]
    }
  ) });
};
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ROLE,
  action: action$5,
  default: Route$4,
  loader: loader$5,
  meta: meta$2
}, Symbol.toStringTag, { value: "Module" }));
const TextGenerateEffect = ({
  words: words2,
  className,
  filter = true,
  duration = 0.5
}) => {
  const [scope, animate] = useAnimate();
  let wordsArray = words2.split(" ");
  useEffect(() => {
    animate(
      "span",
      {
        opacity: 1,
        filter: filter ? "blur(0px)" : "none"
      },
      {
        duration: duration ? duration : 1,
        delay: stagger(0.2)
      }
    );
  }, [scope.current]);
  const renderWords = () => {
    return /* @__PURE__ */ jsx(motion$1.div, { ref: scope, children: wordsArray.map((word, idx) => {
      return /* @__PURE__ */ jsxs(
        motion$1.span,
        {
          className: twMerge(
            "text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-dark dark:text-white gabarito-extrabold md:gabarito-bold leading-[110%]",
            className
          ),
          style: {
            filter: filter ? "blur(10px)" : "none"
          },
          children: [
            word,
            " "
          ]
        },
        word + idx
      );
    }) });
  };
  return /* @__PURE__ */ jsx("div", { className: cn("font-bold", className), children: /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx("div", { className: " dark:text-white text-center  text-black text-2xl leading-snug tracking-wide", children: renderWords() }) }) });
};
const Flipper = ({
  children,
  twColor = "white"
}) => {
  const borderColor = `border-${twColor}`;
  const nodes = Children.toArray(children);
  const timeout = useRef();
  const containerRef = useRef(null);
  const prevIndex = useSignal(0);
  const nextIndex = useSignal(1);
  const flipper = useAnimationControls();
  const [topItem, setTopItem] = useState(nodes[1]);
  const [flipItem, setFlipItem] = useState(nodes[0]);
  const [bottomItem, setBottomItem] = useState(nodes[0]);
  useEffect(() => {
    start();
    return () => stop();
  }, []);
  const getNextIndex = (current) => (current + 1) % nodes.length;
  const moveIdexesToNext = () => {
    prevIndex.value = getNextIndex(prevIndex.value);
    nextIndex.value = getNextIndex(prevIndex.value);
  };
  const stop = () => {
    timeout.current && clearTimeout(timeout.current);
  };
  const start = async () => {
    timeout.current && clearTimeout(timeout.current);
    timeout.current = setTimeout(start, 3e3);
    await flipper.start({ rotateX: -90 }, { duration: 0.5, ease: "easeIn" });
    moveIdexesToNext();
    setFlipItem(nodes[prevIndex.value]);
    flipper.set({ rotateX: -270 });
    await flipper.start({ rotateX: -360 }, { duration: 0.5, ease: "easeOut" });
    setTopItem(nodes[nextIndex.value]);
    setBottomItem(nodes[prevIndex.value]);
    flipper.set({ rotateX: 0 });
  };
  const z1 = useSpring(0, { bounce: 0 });
  const z2 = useSpring(0, { bounce: 0 });
  const rotateY = useSpring(-20, { bounce: 0 });
  const rotateX = useSpring(0, { bounce: 0 });
  useState(false);
  return /* @__PURE__ */ jsxs(
    motion$1.section,
    {
      ref: containerRef,
      className: cn(
        "p-0 rounded-3xl aspect-video bg-white dark:bg-dark relative w-[420px] h-[320px]"
      ),
      style: {
        // perspective: 5000,
        transformStyle: "preserve-3d",
        rotateY,
        rotateX
      },
      children: [
        /* @__PURE__ */ jsx(
          motion$1.div,
          {
            style: {
              z: z1
            },
            className: " overflow-hidden rounded-2xl absolute inset-12 z-0",
            children: topItem
          }
        ),
        /* @__PURE__ */ jsx(
          motion$1.div,
          {
            animate: flipper,
            className: "absolute inset-12 z-20 overflow-hidden rounded-2xl",
            children: flipItem
          }
        ),
        /* @__PURE__ */ jsx(
          motion$1.div,
          {
            style: {
              z: z2,
              // 🪄
              clipPath: "polygon(0px 50%, 100% 50%, 100% 100%, 0px 100%)"
            },
            className: "absolute inset-12 z-10 overflow-hidden rounded-2xl",
            children: bottomItem
          }
        ),
        /* @__PURE__ */ jsx(
          "hr",
          {
            className: cn(
              "w-full absolute border !border-white dark:!border-dark border-px top-[49.9%] z-30 left-0",
              borderColor
            )
          }
        )
      ]
    }
  );
};
const Tools = () => {
  return /* @__PURE__ */ jsx("section", { className: "", children: /* @__PURE__ */ jsxs(Flipper, { children: [
    /* @__PURE__ */ jsx("div", { className: "bg-[#F4BC7F] w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsx("img", { className: "w-[50%]", src: "/css2.svg" }) }),
    /* @__PURE__ */ jsx("div", { className: "bg-[#F7DF1E] w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsx("img", { className: "w-[50%]", src: "/js2.svg" }) }),
    /* @__PURE__ */ jsx("div", { className: "bg-[#9CD2E1] w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsx(FaReact, { className: "text-[160px] text-[#1C6C82]" }) }),
    /* @__PURE__ */ jsx("div", { className: "bg-[#C7CEDB] w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsx("img", { className: "w-[50%]", src: "/framer.svg" }) }),
    /* @__PURE__ */ jsx("div", { className: "bg-[#D2E1E2] w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsx(RiTailwindCssFill, { className: "text-[160px] text-[#00ACC1]" }) })
  ] }) });
};
const words = `  Aprende animaciones web con React`;
const Hero = ({ children }) => {
  return /* @__PURE__ */ jsx("section", { className: "bg-magic flex flex-wrap md:flex-nowrap  bg-contain bg-no-repeat bg-right pt-12 md:pt-[120px] min-h-[90vh] lg:min-h-[95vh]  ", children: /* @__PURE__ */ jsxs("div", { className: "w-full px-6 pt-0 md:px-0 lg:max-w-7xl mx-auto flex flex-col items-center justify-center ", children: [
    /* @__PURE__ */ jsx(Tools, {}),
    /* @__PURE__ */ jsxs("div", { className: "w-full lg:w-[70%] mx-auto -mt-8 md:mt-12 ", children: [
      /* @__PURE__ */ jsx(TextGenerateEffect, { words }),
      /* @__PURE__ */ jsx("p", { className: "text-iron dark:text-metal text-center text-lg lg:text-2xl font-light dark:font-extralight mt-3 mb-12", children: "construyendo más de 14 componentes con Motion" }),
      children ? children : /* @__PURE__ */ jsxs(PrimaryButton, { className: "w-full md:w-auto mx-auto", children: [
        "Comprar ",
        /* @__PURE__ */ jsx("img", { src: "/cursor.svg" })
      ] })
    ] })
  ] }) });
};
const ScrollReveal = ({ children }) => {
  return /* @__PURE__ */ jsx(
    motion$1.div,
    {
      whileInView: {
        y: 0,
        opacity: 1,
        filter: "blur(0px)"
      },
      initial: {
        y: 100,
        opacity: 0,
        filter: "blur(4px)"
      },
      children
    }
  );
};
const Animations = () => {
  return /* @__PURE__ */ jsx(ScrollReveal, { children: /* @__PURE__ */ jsxs("section", { className: "my-[80px] lg:my-[120px]", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-dark dark:text-white text-3xl md:text-4xl lg:text-5xl	text-evil font-bold text-center", children: "¿Qué componentes vamos a construir? 🎨" }),
    /* @__PURE__ */ jsx("p", { className: "text-iron dark:text-metal font-light text-lg md:text-xl lg:text-2xl  text-center mt-4", children: "A lo largo de 7 unidades y más de 30 lecciones, construirás más de 14 componentes" }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-16 mt-12 md:mt-20", children: [
      /* @__PURE__ */ jsx(
        Card,
        {
          title: "Flip words",
          className: "bg-flipWords hover:bg-flipWordsGif"
        }
      ),
      /* @__PURE__ */ jsx(
        Card,
        {
          title: "Swipe Gallery",
          className: "bg-draggable hover:bg-draggableGif"
        }
      ),
      /* @__PURE__ */ jsx(Card, { title: "3D card", className: "bg-cards hover:bg-cardsGif" }),
      /* @__PURE__ */ jsx(
        Card,
        {
          title: "Hero highlight",
          className: "bg-highlight hover:bg-highlightGif"
        }
      ),
      /* @__PURE__ */ jsx(Card, { title: "Basic Scroll", className: "bg-scroll hover:bg-scrollGif" }),
      /* @__PURE__ */ jsx(Card, { title: "3d animations", className: "bg-image hover:bg-imageGif" }),
      /* @__PURE__ */ jsx(Card, { title: "Grid Modal", className: "bg-zoom hover:bg-zoomGif" }),
      /* @__PURE__ */ jsx(Card, { title: "Link preview", className: "bg-link hover:bg-linkGif" }),
      /* @__PURE__ */ jsx(
        Card,
        {
          title: "Moving border",
          className: "bg-border hover:bg-borderGif"
        }
      ),
      /* @__PURE__ */ jsx(
        Card,
        {
          title: "Images slider",
          className: "bg-slider hover:bg-sliderGif"
        }
      ),
      /* @__PURE__ */ jsx(Card, { title: "Draggable list", className: "bg-list hover:bg-listGif" }),
      /* @__PURE__ */ jsx(
        Card,
        {
          title: "Infinite moving items",
          className: "bg-infinite hover:bg-infiniteGif"
        }
      )
    ] })
  ] }) });
};
const Card = ({
  title,
  image,
  className
}) => {
  return /* @__PURE__ */ jsxs("section", { className: "col-span-1 group emoji", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: twMerge(
          "bg-cover bg-center bg-dark w-full h-[240px] md:h-[280px] rounded-lg transition-all  dark:border dark:border-lightGray/10",
          className
        )
      }
    ),
    /* @__PURE__ */ jsx("h3", { className: "font-semibold text-dark dark:text-white  mt-3 text-2xl group-hover:translate-x-6 transition-all", children: title })
  ] });
};
const Faq = () => /* @__PURE__ */ jsx(ScrollReveal, { children: /* @__PURE__ */ jsxs("section", { className: "lg:pt-[120px] lg:pb-[160px] pt-20 pb-[120px]", children: [
  /* @__PURE__ */ jsxs("h2", { className: " text-dark  dark:text-white text-3xl md:text-4xl lg:text-5xl font-bold text-center", children: [
    " ",
    "¿Tienes alguna duda ? 🎨"
  ] }),
  /* @__PURE__ */ jsxs("p", { className: "text-base md:text-lg text-iron dark:text-metal dark:font-extralight font-light mt-6 mb-16 text-center", children: [
    "Si no encuentras la respuesta que buscas por favor escríbenos por",
    " ",
    /* @__PURE__ */ jsx(
      "a",
      {
        href: "https://wa.me/525539599400",
        target: "_blank",
        className: "text-[#777DF7] underline",
        children: "whatsapp"
      }
    ),
    "."
  ] }),
  /* @__PURE__ */ jsxs("div", { className: "mt-12 lg:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 ", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-8", children: [
      /* @__PURE__ */ jsx(
        Question,
        {
          question: "¿Cómo se imparte el curso?",
          answer: "La modalidad del curso es 100% en línea, por lo que todo el contenido del curso (videos y learnings) se encuentra disponible desde tu perfil de forma permanente. Podrás verlos a tu ritmo: cuando quieras y desde donde quieras."
        }
      ),
      /* @__PURE__ */ jsx(
        Question,
        {
          question: "¿Necesito conocimientos previos?",
          answer: "Este curso es de nivel intermedio, por lo que sí requieres conocimientos en JavaScript y ReactJs. "
        }
      ),
      /* @__PURE__ */ jsx(
        Question,
        {
          question: "¿Cómo funcionan los cursos? ¿Debo seguir un horario específico?",
          answer: "No, los cursos son 100% online y offline, puedes cursarlos a tu ritmo: cuando quieras y desde donde quieras."
        }
      ),
      /* @__PURE__ */ jsx(
        Question,
        {
          question: "¿Cómo puedo obtener futuras actualizaciones?",
          answer: "Al comprar el curso tendrás acceso permanente a él, y a sus futuras actualizaciones sin pagos adicionales."
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-8", children: [
      /* @__PURE__ */ jsx(
        Question,
        {
          question: "¿Cómo compro el curso?",
          answer: "Al dar clic en el botón Comprar curso, serás redirigido a flujo de compra con Stripe. Al completar la compra, recibirás en tu correo el link de acceso al curso."
        }
      ),
      /* @__PURE__ */ jsx(
        Question,
        {
          question: "¿Qué formas de pago aceptan?",
          answer: "Aceptamos todo tipo de tarjetas de crédito o tarjetas débito internacionales (Visa, MasterCard o AMEX) que estén habilitadas para pagos online al extranjero. Si no te es posible pagar por este medio, escríbenos a hola@fixtergeek.com y buscaremos otras opciones."
        }
      ),
      /* @__PURE__ */ jsx(
        Question,
        {
          question: "¿Cuál es la diferencia entre el Full course y el Full course + Playera?",
          answer: "El contenido de ambos cursos es el mismo, la única diferencia es que el Full course + Playera incluye la playera oficial de fixter. Después de tu compra, nos pondremos en contacto contigo para enviarla hasta la puerta de tu casa."
        }
      ),
      " ",
      /* @__PURE__ */ jsx(
        Question,
        {
          question: "¿Emiten factura fiscal?",
          answer: "Sí, despues de suscribirte al Plan PRO completa tus datos fiscales desde tu perfil>Administrar plan y te haremos llegar tu fatura vía email, si tienes alguna duda escríbenos a brenda@fixter.org"
        }
      )
    ] })
  ] })
] }) });
const Question = ({
  question,
  answer
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref,
      className: "border-lightgray dark:border-lightGray/20   border-[1px] rounded-2xl",
      children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            className: "w-full px-6 py-6 text-base md:text-xl font-medium text-left flex justify-between items-center",
            onClick: () => {
              setOpen((o) => !o);
            },
            children: [
              /* @__PURE__ */ jsx("p", { className: "w-[90%]  text-dark dark:text-white  ", children: question }),
              open ? /* @__PURE__ */ jsx(IoIosArrowDown, { className: "rotate-180 transition-all text-dark  dark:text-white " }) : /* @__PURE__ */ jsx(IoIosArrowDown, { className: "transition-all text-dark  dark:text-white " })
            ]
          }
        ),
        /* @__PURE__ */ jsx(AnimatePresence, { initial: false, children: open && /* @__PURE__ */ jsx(
          motion$1.div,
          {
            initial: { opacity: 0, height: 0 },
            animate: { opacity: 1, height: "auto" },
            exit: { opacity: 0, height: 0 },
            transition: { type: "spring", duration: 0.4, bounce: 0 },
            children: /* @__PURE__ */ jsx("p", { className: "text-base md:text-lg text-iron dark:text-metal  font-light px-6 pb-8", children: answer })
          }
        ) })
      ]
    }
  );
};
const Footer = () => {
  return /* @__PURE__ */ jsx("section", { className: " bg-dark  pt-10 pb-10 md:py-20   ", children: /* @__PURE__ */ jsxs("div", { className: "w-full px-6 md:px-[6%] xl:px-0 lg:max-w-7xl mx-auto flex flex-wrap md:flex-nowrap justify-between items-center", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-white text-3xl md:text-5xl font-bold ", children: "Escríbenos." }),
      /* @__PURE__ */ jsx("a", { href: "mailto:hola@fixtergeek.com", children: /* @__PURE__ */ jsx("p", { className: "text-metal dark:font-extralight text-lg md:text-xl font-light mt-4", children: "hola@fixtergeek.com" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-4 mt-6 md:mt-0", children: [
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "https://www.facebook.com/fixterme",
          target: "_blank ",
          rel: "noreferrer",
          children: /* @__PURE__ */ jsx(
            "img",
            {
              className: "hover:opacity-50 transition-all grayscale",
              src: "/face.svg"
            }
          )
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "https://www.linkedin.com/company/28982942/admin/feed/posts/",
          target: "_blank ",
          rel: "noreferrer",
          children: /* @__PURE__ */ jsx(
            "img",
            {
              className: "hover:opacity-50 transition-all",
              src: "/linkedin.svg"
            }
          )
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "https://twitter.com/FixterGeek",
          target: "_blank ",
          rel: "noreferrer",
          children: /* @__PURE__ */ jsx(
            "img",
            {
              className: "hover:opacity-50 transition-all",
              src: "/twitter.svg"
            }
          )
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "https://www.instagram.com/fixtergeek/",
          target: "_blank ",
          rel: "noreferrer",
          children: /* @__PURE__ */ jsx("img", { className: "hover:opacity-50 transition-all", src: "/insta.svg" })
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "https://wa.me/527757609276",
          target: "_blank ",
          rel: "noreferrer",
          children: /* @__PURE__ */ jsx("img", { className: "hover:opacity-50 transition-all", src: "/whats.svg" })
        }
      )
    ] })
  ] }) });
};
const Pricing = ({
  rightButton,
  leftButton
}) => {
  return /* @__PURE__ */ jsx(ScrollReveal, { children: /* @__PURE__ */ jsxs("section", { className: "text-center py-[80px] lg:py-[120px] ", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl lg:text-5xl	text-evil text-dark dark:text-white font-bold", children: "¿Qué incluye el curso? 🚀" }),
    /* @__PURE__ */ jsx("p", { className: "text-lg md:text-2xl text-iron dark:text-metal dark:font-extralight font-light mt-6 mb-16", children: "Elige tu pack" }),
    /* @__PURE__ */ jsx(MyTabs, { leftButton, rightButton })
  ] }) });
};
const MyTabs = ({
  rightButton,
  leftButton
}) => {
  return /* @__PURE__ */ jsxs(Tab.Group, { children: [
    /* @__PURE__ */ jsxs(Tab.List, { className: "flex gap-0 md:gap-10 justify-between md:justify-center w-full md:w-[560px] mx-auto", children: [
      /* @__PURE__ */ jsx(
        Tab,
        {
          "data-headlessui-state": "selected",
          className: "border focus:outline-none data-[selected]:outline-fish data-[selected]:border-fish  data-[hover]:bg-transparent  dark:data-[hover]:bg-[#131316] data-[focus]:outline-1 data-[focus]:outline-white   bg-[#ffffff] dark:bg-transparent border-lightGray dark:border-lightGray/20 w-[48%] md:w-[260px] h-[160px] rounded-3xl flex items-center justify-center",
          children: /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-base md:text-2xl font-medium text-dark dark:text-white", children: [
              "Animaciones ",
              /* @__PURE__ */ jsx("br", {}),
              " con React"
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-iron font-light dark:text-metal text-sm mt-2", children: "Full course" })
          ] })
        }
      ),
      /* @__PURE__ */ jsx(Tab, { className: "border focus:outline-none data-[selected]:outline-fish data-[selected]:border-fish  data-[hover]:bg-transparent  dark:data-[hover]:bg-[#131316] data-[focus]:outline-1 data-[focus]:outline-white   bg-[#ffffff] dark:bg-transparent border-lightGray dark:border-lightGray/20 w-[48%] md:w-[260px] h-[160px] rounded-3xl flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            className: "w-16 absolute -right-3 -top-14 md:-right-10 ",
            src: "/best-seller.svg"
          }
        ),
        /* @__PURE__ */ jsxs("h3", { className: "text-base md:text-2xl text-dark dark:text-white font-medium", children: [
          "Animaciones ",
          /* @__PURE__ */ jsx("br", {}),
          " con React"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-iron font-light dark:text-metal text-sm mt-2", children: "Full course + Playera oficial" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs(Tab.Panels, { className: "flex justify-center mt-8 md:mt-10", children: [
      /* @__PURE__ */ jsx(AnimatePresence, { children: /* @__PURE__ */ jsx(Tab.Panel, { "data-selected": true, children: /* @__PURE__ */ jsxs(
        motion$1.div,
        {
          initial: { opacity: 0, scale: 0.5 },
          animate: { opacity: 1, scale: 1 },
          transition: {
            duration: 0.3,
            delay: 0.2,
            ease: [0, 0.71, 0.2, 1.01]
          },
          className: "w-full md:w-[560px] bg-white dark:bg-[#1B1D22]  rounded-3xl p-6 md:p-12 text-left border-[1px] border-lightGray dark:border-none ",
          children: [
            /* @__PURE__ */ jsxs("h4", { className: "text-dark dark:text-white text-4xl md:text-5xl font-bold	", children: [
              /* @__PURE__ */ jsx("span", { className: "line-through	", children: "$999 " }),
              " ",
              /* @__PURE__ */ jsxs("span", { className: " text-[#FF4B4B] dark:text-[#C8496C] ml-2", children: [
                "$599",
                " "
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "text-xl font-normal text-iron dark:text-metal/70 ", children: [
                "/ MXN",
                " "
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-base font-light text-iron dark:text-metal  flex flex-col gap-4 mt-10", children: [
              /* @__PURE__ */ jsxs("p", { children: [
                "📹",
                " ",
                /* @__PURE__ */ jsx("strong", { className: "font-semibold text-iron dark:text-white/60", children: "7 unidades" }),
                " ",
                "con más de 30 tutoriales en video"
              ] }),
              /* @__PURE__ */ jsx("p", { children: "💪🏻 Learnings y ejercicios por lección" }),
              /* @__PURE__ */ jsxs("p", { children: [
                "📚 Recopilación de",
                " ",
                /* @__PURE__ */ jsxs("strong", { className: "font-semibold text-iron dark:text-white/60", children: [
                  "recursos extra",
                  " "
                ] })
              ] }),
              /* @__PURE__ */ jsx("p", { children: "💀 Acceso de por vida" }),
              /* @__PURE__ */ jsxs("p", { children: [
                "🚀",
                " ",
                /* @__PURE__ */ jsx("strong", { className: "font-semibold text-iron dark:text-white/60", children: "Actualizaciones futuras" }),
                " ",
                "del curso"
              ] }),
              /* @__PURE__ */ jsx("p", { children: "🫶🏻 Acceso a la comunidad de Disscord" })
            ] }),
            leftButton
          ]
        }
      ) }) }),
      /* @__PURE__ */ jsxs(Tab.Panel, { children: [
        " ",
        /* @__PURE__ */ jsxs(
          motion$1.div,
          {
            initial: { opacity: 0, scale: 0.5 },
            animate: { opacity: 1, scale: 1 },
            transition: {
              duration: 0.3,
              delay: 0.2,
              ease: [0, 0.71, 0.2, 1.01]
            },
            className: "w-full md:w-[560px] bg-white dark:bg-[#1B1D22]  rounded-3xl p-6 md:p-12 text-left border-[1px] border-lightGray dark:border-none ",
            children: [
              " ",
              /* @__PURE__ */ jsxs("h4", { className: "text-dark dark:text-white text-4xl md:text-5xl font-bold	", children: [
                /* @__PURE__ */ jsx("span", { className: "line-through	", children: "$1,499 " }),
                " ",
                /* @__PURE__ */ jsxs("span", { className: " text-[#FF4B4B] dark:text-[#C8496C] ml-2", children: [
                  "$999",
                  " "
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "text-xl font-normal text-iron dark:text-metal/70  ", children: [
                  "/ MXN",
                  " "
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-base font-light text-iron dark:text-metal flex flex-col gap-4 mt-10", children: [
                /* @__PURE__ */ jsxs("p", { children: [
                  "📹",
                  " ",
                  /* @__PURE__ */ jsx("strong", { className: "font-semibold text-iron dark:text-white/60", children: "7 unidades" }),
                  " ",
                  "con más de 30 tutoriales en video"
                ] }),
                /* @__PURE__ */ jsx("p", { children: "💪🏻 Learnings y ejercicios por lección" }),
                /* @__PURE__ */ jsxs("p", { children: [
                  "📚 Recopilación de",
                  " ",
                  /* @__PURE__ */ jsxs("strong", { className: "font-semibold text-iron dark:text-white/60", children: [
                    "recursos extra",
                    " "
                  ] })
                ] }),
                /* @__PURE__ */ jsx("p", { children: "💀 Acceso de por vida" }),
                /* @__PURE__ */ jsxs("p", { children: [
                  "🚀",
                  " ",
                  /* @__PURE__ */ jsx("strong", { className: "font-semibold text-iron dark:text-white/60", children: "Actualizaciones futuras" }),
                  " ",
                  "del curso"
                ] }),
                /* @__PURE__ */ jsx("p", { children: "🫶🏻 Acceso a la comunidad de Disscord" }),
                /* @__PURE__ */ jsxs("p", { children: [
                  "👕",
                  " ",
                  /* @__PURE__ */ jsx("strong", { className: "font-semibold text-iron dark:text-white/60", children: "Playera oficial" }),
                  " ",
                  "de Fixtergeek"
                ] })
              ] }),
              rightButton
            ]
          }
        )
      ] })
    ] })
  ] });
};
const useScrollDirection = () => {
  const prev = useRef(0);
  const [direction, setDirection] = useState(1);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (val) => {
    if (val < prev.current) {
      setDirection(-1);
    } else if (val > prev.current) {
      setDirection(1);
    }
    prev.current = val;
  });
  return direction;
};
const useMarquee = (reversed = false) => {
  const direction = useScrollDirection();
  const x = useMotionValue(0);
  const ref = useRef();
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    bounce: 0
  });
  const velocityFactor = useTransform(
    smoothVelocity,
    [-600, 0, 600],
    [10, 1, 10]
  );
  const move = () => {
    var _a;
    const factor = reversed ? direction * -1 : direction;
    const moveBy = factor * -velocityFactor.get();
    const rect1 = (_a = ref.current) == null ? void 0 : _a.getBoundingClientRect();
    const v = x.get();
    x.set(v + moveBy);
    if (rect1 && v > 0) {
      x.set(-rect1.width / 2);
      return;
    }
    if (rect1 && v < -(rect1.width / 2)) {
      x.set(0);
      return;
    }
  };
  useAnimationFrame(move);
  return { ref, x };
};
const Marquee = ({
  children,
  reversed,
  className = "bg-dark "
}) => {
  const { x, ref } = useMarquee(reversed);
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("article", { className: cn("flex justify-center items-center", className), children: /* @__PURE__ */ jsx("div", { className: "h-16 md:h-20 flex items-center text-gray-100  text-2xl lg:text-3xl font-extrabold overflow-hidden", children: /* @__PURE__ */ jsxs(motion$1.div, { style: { x }, className: "whitespace-nowrap", ref, children: [
    children,
    " ",
    children
  ] }) }) }) });
};
const ScrollBanner = () => {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Marquee, { className: "jolly-lodger-regular bg-dark", children: [
      "No más sitios web estáticos ",
      /* @__PURE__ */ jsx("span", { className: "mx-3", children: "🪄" }),
      " Agrega animaciones a tu sitio web",
      /* @__PURE__ */ jsx("span", { className: "mx-3", children: "🧙🏻" }),
      " Personaliza tus animaciones",
      /* @__PURE__ */ jsx("span", { className: "mx-3", children: "🎃" }),
      " Crea tus propios componentes",
      /* @__PURE__ */ jsx("span", { className: "mx-3", children: "🎛️" }),
      "No más sitios web estáticos ",
      /* @__PURE__ */ jsx("span", { className: "mx-3", children: "🪄" }),
      " Agrega animaciones a tu sitio web",
      /* @__PURE__ */ jsx("span", { className: "mx-3", children: "🧙🏻" }),
      " Personaliza tus animaciones",
      /* @__PURE__ */ jsx("span", { className: "mx-3", children: "🤩" }),
      " Crea tus propios componentes",
      /* @__PURE__ */ jsx("span", { className: "mx-3", children: "🎛️" })
    ] }),
    /* @__PURE__ */ jsxs(Marquee, { reversed: true, className: "bg-fish jolly-lodger-regular", children: [
      "Scroll Animations",
      /* @__PURE__ */ jsx("span", { className: "mx-3", children: "🎐" }),
      " Parallax",
      /* @__PURE__ */ jsx("span", { className: "mx-3", children: "💻" }),
      " Efectos 3d",
      " ",
      /* @__PURE__ */ jsx("span", { className: "mx-3", children: "🎯" }),
      " Drawers",
      /* @__PURE__ */ jsx("span", { className: "mx-3", children: "👀" }),
      " ",
      "Galerías",
      /* @__PURE__ */ jsx("span", { className: "mx-3", children: "🏞️" }),
      " Dynamic cards",
      " ",
      /* @__PURE__ */ jsx("span", { className: "mx-3", children: "🚀" }),
      "Text effects",
      " ",
      /* @__PURE__ */ jsx("span", { className: "mx-3", children: "💬" }),
      " Modals ",
      /* @__PURE__ */ jsx("span", { className: "mx-3", children: "🔥" }),
      "Scroll Animations",
      /* @__PURE__ */ jsx("span", { className: "mx-3", children: "🎐" }),
      " Parallax",
      /* @__PURE__ */ jsx("span", { className: "mx-3", children: "💻" }),
      " Efectos 3d",
      " ",
      /* @__PURE__ */ jsx("span", { className: "mx-3", children: "🎯" }),
      " Drawers",
      /* @__PURE__ */ jsx("span", { className: "mx-3", children: "👀" }),
      " ",
      "Galerías",
      /* @__PURE__ */ jsx("span", { className: "mx-3", children: "🏞️" }),
      " Dynamic cards",
      " ",
      /* @__PURE__ */ jsx("span", { className: "mx-3", children: "🚀" }),
      "Text effects",
      " ",
      /* @__PURE__ */ jsx("span", { className: "mx-3", children: "💬" }),
      " Modals ",
      /* @__PURE__ */ jsx("span", { className: "mx-3", children: "🔥" })
    ] })
  ] });
};
const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName
}) => {
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(FloatingDockDesktop, { items, className: desktopClassName }) });
};
const FloatingDockDesktop = ({
  items,
  className
}) => {
  let mouseX = useMotionValue(Infinity);
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
    motion$1.div,
    {
      onMouseMove: (e) => mouseX.set(e.pageX),
      onMouseLeave: () => mouseX.set(Infinity),
      className: cn(
        " flex   h-16 gap-10 lg:gap-4 items-end justify-start rounded-2xl   pb-3",
        className
      ),
      children: items.map((item, idx) => /* @__PURE__ */ jsx(IconContainer, { mouseX, ...item }, item.title + idx))
    }
  ) });
};
function IconContainer({
  mouseX,
  title,
  icon,
  href
}) {
  let ref = useRef(null);
  let distance = useTransform(mouseX, (val) => {
    var _a;
    let bounds = ((_a = ref.current) == null ? void 0 : _a.getBoundingClientRect()) ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });
  let widthTransform = useTransform(distance, [-60, 0, 60], [32, 60, 32]);
  let heightTransform = useTransform(distance, [-60, 0, 60], [32, 60, 32]);
  let widthTransformIcon = useTransform(distance, [-60, 0, 60], [20, 40, 20]);
  let heightTransformIcon = useTransform(
    distance,
    [-150, 0, 150],
    [20, 40, 20]
  );
  let width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12
  });
  let height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12
  });
  useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12
  });
  useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12
  });
  const [hovered, setHovered] = useState(false);
  return /* @__PURE__ */ jsx("a", { href, target: "_blank", children: /* @__PURE__ */ jsxs(
    motion$1.div,
    {
      ref,
      style: { width, height },
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      className: "aspect-square  flex items-center gap-0 justify-center relative",
      children: [
        /* @__PURE__ */ jsx(AnimatePresence, { children: hovered && /* @__PURE__ */ jsx(
          motion$1.div,
          {
            initial: { opacity: 0, y: 10, x: "-30%" },
            animate: { opacity: 1, y: 0, x: "-30%" },
            exit: { opacity: 0, y: 2, x: "-30%" },
            className: "px-2 py-0.5 whitespace-pre rounded-md bg-dark border dark:bg-[#141518] dark:border-white/20 dark:text-white border-gray-200 text-white absolute left-1/2 -translate-x-1/2 -top-8 w-fit text-xs",
            children: title
          }
        ) }),
        /* @__PURE__ */ jsx(motion$1.div, { className: "flex items-center justify-center ", children: icon })
      ]
    }
  ) });
}
const Teacher = () => {
  return /* @__PURE__ */ jsx(ScrollReveal, { children: /* @__PURE__ */ jsxs("section", { className: "flex overflow-hidden flex-wrap lg:flex-nowrap bg-[#FAFAFF] dark:bg-transparent dark:border dark:border-white/10 px-6  md:pr-0 md:pl-12 gap-12 justify-between rounded-[40px] my-10 md:my-20 lg:my-[120px]", children: [
    /* @__PURE__ */ jsxs("div", { className: "w-full lg:w-[45%] pt-8 pb-6 md:py-12", children: [
      /* @__PURE__ */ jsx("span", { className: "text-dark dark:text-metal font-light dark:font-extralight  text-xl", children: "¿Quien será tu instructor? 🧑🏻‍🏫" }),
      /* @__PURE__ */ jsx("h2", { className: "font-semibold text-2xl md:text-5xl dark:text-white mb-2 mt-6 text-dark", children: "Héctor Bliss" }),
      /* @__PURE__ */ jsx("span", { className: "dark:text-metal/80 dark:font-extralight font-light text-iron", children: "Software Engineer & Lead Teacher" }),
      /* @__PURE__ */ jsxs("p", { className: "mt-12 text-iron dark:text-metal dark:font-extralight font-light ", children: [
        "Con más de 10 años de experiencia como desarrollador de software profesional e instructor tecnológico, Héctor Bliss disfruta de simplificar temas complejos para que sus estudiantes puedan",
        " ",
        /* @__PURE__ */ jsxs("strong", { className: "text-gray-800 dark:text-white/60 font-medium", children: [
          " ",
          "aprender de la forma más práctica, rápida y divertida."
        ] }),
        " ",
        "Héctor ha sido instructor en diferentes bootcamps internacionales, y ha grabado infinidad de cursos en línea. Por medio de su canal de youtube",
        " ",
        /* @__PURE__ */ jsx("strong", { className: "text-gray-800 dark:text-white/60  font-medium", children: "enseña los temas más actualizados de la industria tecnológica," }),
        " ",
        "acercando las herramientas que usan los profesionales nivel mundial a sus estudiantes de habla hispana.",
        " "
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "mt-6 text-iron dark:text-metal dark:font-extralight font-light ", children: [
        " ",
        "Si no has experimentado una clase con Héctor Bliss,",
        " ",
        /* @__PURE__ */ jsx("strong", { className: "text-gray-800 dark:text-white/60 font-medium ", children: "es tu momento de comprobar que aprender no tiene que ser ni díficil ni aburrido." })
      ] }),
      /* @__PURE__ */ jsx(FloatingMedia, {})
    ] }),
    /* @__PURE__ */ jsx(
      "img",
      {
        className: "hidden lg:block dark:hidden w-full rounded-full md:rounded-none  lg:w-[50%] md:object-contain bg-left",
        src: "/titor.png"
      }
    ),
    /* @__PURE__ */ jsx(
      "img",
      {
        className: "w-full lg:w-[50%] object-cover object-left hidden dark:hidden dark:lg:block ",
        src: "/titor-w.png"
      }
    )
  ] }) });
};
const media = [
  {
    title: "@Héctorbliss",
    icon: /* @__PURE__ */ jsx(FaLinkedin, { className: "text-3xl text-dark dark:text-metal" }),
    href: "https://www.linkedin.com/in/hectorbliss/"
  },
  {
    title: "@blissito",
    icon: /* @__PURE__ */ jsx(FaGithub, { className: "text-3xl text-dark dark:text-metal" }),
    href: "https://github.com/blissito"
  },
  {
    title: "@blissito",
    icon: /* @__PURE__ */ jsx(FaYoutube, { className: "text-3xl text-dark dark:text-metal" }),
    href: "https://www.youtube.com/@blissito"
  },
  {
    title: "@HéctorBliss",
    icon: /* @__PURE__ */ jsx(FaSquareXTwitter, { className: "text-3xl text-dark dark:text-metal" }),
    href: "https://twitter.com/HectorBlisS"
  }
];
const FloatingMedia = () => {
  return /* @__PURE__ */ jsx("div", { className: "mt-12", children: /* @__PURE__ */ jsx(
    FloatingDock,
    {
      mobileClassName: "translate-y-20",
      items: media
    }
  ) });
};
const MouseEnterContext = createContext(void 0);
const CardContainer = ({
  children,
  className,
  containerClassName
}) => {
  const containerRef = useRef(null);
  const [isMouseEntered, setIsMouseEntered] = useState(false);
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 25;
    const y = (e.clientY - top - height / 2) / 25;
    containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
  };
  const handleMouseEnter = (e) => {
    setIsMouseEntered(true);
    if (!containerRef.current) return;
  };
  const handleMouseLeave = (e) => {
    if (!containerRef.current) return;
    setIsMouseEntered(false);
    containerRef.current.style.transform = `rotateY(0deg) rotateX(0deg)`;
  };
  return /* @__PURE__ */ jsx(MouseEnterContext.Provider, { value: [isMouseEntered, setIsMouseEntered], children: /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(" flex items-center justify-center", containerClassName),
      style: {
        perspective: "1000px"
      },
      children: /* @__PURE__ */ jsx(
        "div",
        {
          ref: containerRef,
          onMouseEnter: handleMouseEnter,
          onMouseMove: handleMouseMove,
          onMouseLeave: handleMouseLeave,
          className: cn(
            "flex items-center justify-center relative transition-all duration-200 ease-linear",
            className
          ),
          style: {
            transformStyle: "preserve-3d"
          },
          children
        }
      )
    }
  ) });
};
const CardBody = ({
  children,
  className
}) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(
        " xl:h-96 lg:h-[368px] md:h-[424px] h-auto md:w-full lg:w-96 [transform-style:preserve-3d]  [&>*]:[transform-style:preserve-3d]",
        className
      ),
      children
    }
  );
};
const CardItem = ({
  as: Tag = "div",
  children,
  className,
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  ...rest
}) => {
  const ref = useRef(null);
  const [isMouseEntered] = useMouseEnter();
  useEffect(() => {
    handleAnimations();
  }, [isMouseEntered]);
  const handleAnimations = () => {
    if (!ref.current) return;
    if (isMouseEntered) {
      ref.current.style.transform = `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
    } else {
      ref.current.style.transform = `translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`;
    }
  };
  return /* @__PURE__ */ jsx(
    Tag,
    {
      ref,
      className: cn("w-fit transition duration-200 ease-linear", className),
      ...rest,
      children
    }
  );
};
const useMouseEnter = () => {
  const context = useContext(MouseEnterContext);
  if (context === void 0) {
    throw new Error("useMouseEnter must be used within a MouseEnterProvider");
  }
  return context;
};
const Testimonials = () => {
  return /* @__PURE__ */ jsxs("section", { className: "py-20 md:py-20 xl:py-[120px]", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-dark dark:text-white text-3xl md:text-4xl lg:text-5xl text-center 	text-evil font-bold", children: "Qué dicen nuestros estudiantes" }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3  mt-12 md:mt-16 gap-8 lg:gap-y-12 xl:gap-12", children: [
      /* @__PURE__ */ jsx(
        Comment,
        {
          image: "https://pbs.twimg.com/profile_images/456497156975644673/QmpE5sMs_400x400.jpeg",
          name: "Rodrigo",
          tag: "@Alientres",
          comment: "Hola, tomé un curso con @FixterGeek Desarrollo Web Full-Stack, me gusto la forma de explicar del profesor y las mentorías personalizadas, también las tecnologías aprendidas son de vanguardia. ¡Se los recomiendo!"
        }
      ),
      /* @__PURE__ */ jsx(
        Comment,
        {
          image: "https://pbs.twimg.com/profile_images/1640439802104369153/P4m1BLS7_400x400.jpg",
          name: "Jonathan",
          tag: "@johnxgear",
          comment: "Creo que una de las mejores decisiones ha sido tomar un curso en @FixterGeek es una buena forma de aprender / retomar la programación sin duda una gran experiencia, gracias por dejarme ser parte de esta comunidad. 😎🔥🙌🏼"
        }
      ),
      /* @__PURE__ */ jsx(
        Comment,
        {
          image: "https://pbs.twimg.com/profile_images/1363555823138590724/BSg51cKM_400x400.jpg",
          name: "Brenda Ortega",
          tag: "@brendaojs",
          comment: "En 2016, aprendí frontend en @FixterGeek, era la primera vez que veía la terminal así que fue un poco doloroso pero satisfactorio. 6 años más tarde, después de varios empleos y mucho aprendizaje puedo decir que fue la mejor decisión que he tomado. 👩🏻‍💻😊"
        }
      ),
      /* @__PURE__ */ jsx(
        Comment,
        {
          image: "https://pbs.twimg.com/profile_images/1605726489055334400/olSwWtH8_400x400.jpg",
          name: "David Duran Valdes",
          tag: "@DavidDuranVal",
          comment: "La forma de enseñar de @HectorBlisS @FixterGeek junto con la documentación y los lerning's son de gran ayuda para resolver los ejercicios y proyectos del curso, los temas parecen mas faciles de lo que son y te motivan a seguir aprendiendo, practicando y mejorar tus conocimientos."
        }
      ),
      /* @__PURE__ */ jsx(
        Comment,
        {
          image: "https://pbs.twimg.com/profile_images/1509233081194004490/hwUK6HvV_400x400.jpg",
          name: "Sandy",
          tag: "@SandHv",
          comment: "@FixterGeek ha sido una experiencia agradable y nutritiva técnicamente hablando, continuaré con los siguientes cursos para seguir retroalimentando y aprendiendo las nuevas técnicas del mundo de desarrollo web, gracias fixter ✨🐥👩🏻‍💻\n"
        }
      ),
      /* @__PURE__ */ jsx(
        Comment,
        {
          image: "https://pbs.twimg.com/profile_images/1659370175546765314/NQtKyiWa_400x400.jpg",
          name: "Gustavo",
          tag: "@kinxori",
          comment: "Hi everyone! As you may know, I am in the journey to become a former web developer! I've started taking bootcamps with \n@FixterGeek\n and it's been a great experience. We have access to mentorships through all the course lapse and to be fair, Bliss has a natural talent to teach! 👨‍💻"
        }
      )
    ] })
  ] });
};
const Comment = ({
  image,
  comment,
  name,
  tag,
  className
}) => {
  return /* @__PURE__ */ jsx(ScrollReveal, { children: /* @__PURE__ */ jsx(CardContainer, { className: "inter-var ", children: /* @__PURE__ */ jsxs(
    CardBody,
    {
      className: twMerge(
        "col-span-1 border border-lightGray dark:border-lightGray/10 rounded-2xl p-4 relative cursor-pointer hover:shadow-[0_16px_16px_rgba(0,0,0,0.05)] dark:hover:shadow-lg transition-all",
        className
      ),
      children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            className: "absolute right-3 w-8 md:w-12 opacity-50 dark:brightness-100 dark:hidden	",
            src: "/x.png"
          }
        ),
        /* @__PURE__ */ jsx(
          "img",
          {
            className: "absolute right-3 w-8 md:w-12 opacity-20 dark:block 	",
            src: "/x-w.png"
          }
        ),
        /* @__PURE__ */ jsx(CardItem, { as: "p", translateZ: "100", className: "mt-14", children: /* @__PURE__ */ jsxs("span", { className: "text-base md:text-lg text-iron dark:text-metal font-light mt-8 md:mt-12 xl:mt-16", children: [
          '"',
          comment,
          '"'
        ] }) }),
        /* @__PURE__ */ jsxs(
          CardItem,
          {
            translateZ: "40",
            className: "mt-6 md:mt-10 flex gap-3 items-center",
            children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  className: "w-12 h-12 rounded-full object-cover",
                  src: image ? image : "https://images.pexels.com/photos/1181352/pexels-photo-1181352.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                }
              ),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h4", { className: "text-dark dark:text-metal", children: name }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-iron dark:text-white/30 font-light", children: tag })
              ] })
            ]
          }
        )
      ]
    }
  ) }) });
};
const Why = () => {
  return /* @__PURE__ */ jsxs(ScrollReveal, { children: [
    " ",
    /* @__PURE__ */ jsxs("section", { className: "	flex flex-wrap-reverse xl:flex-nowrap gap-[64px] pt-[120px] pb-[80px] lg:pt-[160px] lg:pb-[120px]", children: [
      /* @__PURE__ */ jsx(
        "img",
        {
          className: "h-[240px] w-full xl:w-[42%] object-cover rounded-xl md:h-[320px] xl:h-auto",
          src: "https://images.pexels.com/photos/7437487/pexels-photo-7437487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "w-full lg:w-[58%]", children: [
        /* @__PURE__ */ jsx("h2", { className: "dark:text-white  text-3xl md:text-4xl lg:text-5xl	text-dark font-bold", children: "Porqué tomar este curso 🎯" }),
        /* @__PURE__ */ jsx("p", { className: "text-lg  dark:text-metal text-iron font-light mt-6", children: "Aprenderás de forma teórica y práctica a crear componentes de React animados con motion. Y como es característico de cada uno de nuestros cursos, no estarás solo en este proceso, aprenderás los fundamentos de motion, además de una repasadita de los fundamentos de React para después empezar a construir animaciones declarativas y automáticas, sencillas y complejas, vistosas y sutiles para aplicarlas a tus componentes, aprenderás a definir animaciones con scroll o con el mouse, y mucho más." }),
        /* @__PURE__ */ jsx("p", { className: "text-lg  dark:text-metal text-iron font-light mt-4", children: "Después del curso, tus sitios web no volverán a ser los mismos. Podrás agregar animaciones que le den un toque dinámico y diferenciador." }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap md:flex-nowrap gap-12 mt-12", children: [
          /* @__PURE__ */ jsxs("div", { className: "w-full md:w-[50%] ", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-2xl text-wvil text-dark dark:text-white font-semibold", children: "Únete a la comunidad 👨‍👩‍👦‍👦" }),
            /* @__PURE__ */ jsxs("p", { className: "  dark:text-metal text-iron font-light mt-2", children: [
              "Al ser parte del curso, también eres parte de la comunidad de Discord, en donde puedes conversar con otros estudiantes o con el instructor para",
              " ",
              /* @__PURE__ */ jsxs("span", { className: "text-iron dark:text-white/70 font-semibold", children: [
                " ",
                "colaborar, pedir feedback o recibir ayuda."
              ] }),
              " "
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "w-full md:w-[50%]", children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-2xl text-wvil text-dark dark:text-white font-semibold", children: [
              "Aprende de forma flexible ⌛️",
              " "
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "  dark:text-metal text-iron font-light mt-2", children: [
              "No es necesario un horario fijo para tomar el curso, hazlo",
              " ",
              /* @__PURE__ */ jsx("span", { className: "text-iron dark:text-white/70 font-semibold", children: "cuando quieras desde donde quieras." }),
              " "
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap md:flex-nowrap gap-12 mt-12", children: [
          /* @__PURE__ */ jsxs("div", { className: "w-full md:w-[50%] ", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-2xl text-wvil text-dark dark:text-white font-semibold", children: "Recibe feedback personal 🔥" }),
            /* @__PURE__ */ jsxs("p", { className: "  dark:text-metal text-iron font-light mt-2", children: [
              "Los ejercicios prácticos que realices durante el curso serán revisados por el instructor y",
              " ",
              /* @__PURE__ */ jsx("span", { className: "text-iron dark:text-white/70 font-semibold", children: "recibirás feedback personalizado." })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "w-full md:w-[50%]", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-2xl text-wvil text-dark dark:text-white font-semibold", children: "Con acceso permanente 🛟" }),
            /* @__PURE__ */ jsxs("p", { className: "  dark:text-metal text-iron font-light mt-2", children: [
              "Al comprar el curso tienes",
              " ",
              /* @__PURE__ */ jsx("span", { className: "text-iron dark:text-white/70 font-semibold", children: "acceso de por vida" }),
              " ",
              "desde tu cuenta, además de acceso a todas las futuras actualizaciones."
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
};
const action$4 = async ({ request }) => {
  const isDev2 = process.env.NODE_ENV === "development";
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "cheap_checkout") {
    const url = await getStripeCheckout({
      price: isDev2 ? DEV_PRICE : PRICE_999,
      // 999
      coupon: isDev2 ? DEV_COUPON : COUPON_40
    });
    throw redirect$1(url);
  }
  if (intent === "premium_checkout") {
    const url = await getStripeCheckout({
      price: isDev2 ? DEV_PRICE : PRICE_1499,
      // 1499
      coupon: isDev2 ? DEV_COUPON : COUPON_40
    });
    throw redirect$1(url);
  }
  if (intent === "checkout") {
    const url = await get40Checkout();
    return redirect$1(url);
  }
  if (intent === "self") {
    const user = await getUserORNull(request);
    return { user: { email: user == null ? void 0 : user.email } };
  }
  return null;
};
const meta$1 = () => getMetaTags({
  title: "Curso de animaciones con React | Fixtergeek ",
  description: "Crea tus propios componentes animados con React, Vite y Motion"
});
function Route$3({ children }) {
  const [isLoading, setISLoading] = useState(false);
  return /* @__PURE__ */ jsxs("section", { id: "main", className: "  bg-white dark:bg-dark overflow-hidden", children: [
    /* @__PURE__ */ jsx(NavBar, {}),
    /* @__PURE__ */ jsx(Hero, { children: /* @__PURE__ */ jsxs(Form, { method: "post", className: "flex justify-center gap-2", children: [
      /* @__PURE__ */ jsxs(
        PrimaryButton,
        {
          onClick: () => setISLoading(true),
          isLoading,
          name: "intent",
          value: "checkout",
          type: "submit",
          children: [
            "Comprar ",
            /* @__PURE__ */ jsx("img", { src: "/cursor.svg" })
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        PrimaryButton,
        {
          as: "Link",
          to: "/player",
          type: "button",
          className: "bg-pink-600 enabled:hover:px-8 text-center",
          children: "Comenzar gratis 🪄📺"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx(ScrollBanner, {}),
    /* @__PURE__ */ jsxs("section", { className: "w-full px-6 md:px-[6%] xl:px-0 xl:max-w-7xl mx-auto ", children: [
      /* @__PURE__ */ jsx(Why, {}),
      /* @__PURE__ */ jsx(Animations, {}),
      /* @__PURE__ */ jsx(Testimonials, {}),
      /* @__PURE__ */ jsx(
        Pricing,
        {
          rightButton: /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(Form, { method: "POST", children: /* @__PURE__ */ jsxs(
            PrimaryButton,
            {
              onClick: () => setISLoading(true),
              isLoading,
              name: "intent",
              value: "premium_checkout",
              type: "submit",
              className: "w-full my-4 mt-12",
              children: [
                "Comprar ",
                /* @__PURE__ */ jsx("img", { src: "/cursor.svg" })
              ]
            }
          ) }) }),
          leftButton: /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(Form, { method: "POST", children: /* @__PURE__ */ jsxs(
            PrimaryButton,
            {
              onClick: () => setISLoading(true),
              isLoading,
              name: "intent",
              value: "cheap_checkout",
              type: "submit",
              className: "w-full my-4 mt-12",
              children: [
                "Comprar ",
                /* @__PURE__ */ jsx("img", { src: "/cursor.svg" })
              ]
            }
          ) }) })
        }
      ),
      /* @__PURE__ */ jsx(Teacher, {}),
      /* @__PURE__ */ jsx(Faq, {})
    ] }),
    /* @__PURE__ */ jsx(Footer, {}),
    children
  ] });
}
const route9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$4,
  default: Route$3,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
const useClickOutside = ({
  isActive,
  onOutsideClick,
  includeEscape
}) => {
  const ref = useRef(null);
  const handleClick = (e) => {
    var _a;
    return !((_a = ref.current) == null ? void 0 : _a.contains(e.target)) && (onOutsideClick == null ? void 0 : onOutsideClick(e));
  };
  const handleKey = (e) => {
    if (e.key === "Escape") {
      onOutsideClick == null ? void 0 : onOutsideClick(e);
    }
  };
  useEffect(() => {
    if (!isActive) return;
    document.addEventListener("click", handleClick);
    if (includeEscape) {
      addEventListener("keydown", handleKey);
    }
    return () => {
      document.removeEventListener("click", handleClick);
      removeEventListener("keydown", handleKey);
    };
  }, [isActive]);
  return ref;
};
const VideosMenu = ({
  isLocked,
  videos,
  defaultOpen,
  moduleNames,
  currentVideoSlug,
  isOpen,
  setIsOpen
}) => {
  const x = useMotionValue(0);
  const springX = useSpring(x, { bounce: 0.2 });
  const buttonX = useTransform(springX, [-400, 0], [0, 394]);
  const [completed, setCompleted] = useState([]);
  const [videosCompleted, setVideosCompleted] = useState([]);
  useEffect(() => {
    isOpen ? x.set(0) : x.set(-400);
  }, [isOpen, x]);
  const checkIfWatched = (slug) => {
    if (typeof window === "undefined") return;
    let list = localStorage.getItem("watched") || "[]";
    list = JSON.parse(list);
    return list.includes(slug);
  };
  useEffect(() => {
    const list = [];
    moduleNames.map((moduleName) => {
      const allCompleted = videos.filter((vi) => vi.moduleName === moduleName).every((v) => checkIfWatched(v.slug));
      allCompleted && list.push(moduleName);
    });
    setCompleted(list);
    let otraList = localStorage.getItem("watched") || "[]";
    otraList = JSON.parse(otraList);
    setVideosCompleted(otraList);
  }, []);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      MenuButton$1,
      {
        x: buttonX,
        onToggle: () => setIsOpen((o) => !o),
        isOpen
      }
    ),
    /* @__PURE__ */ jsxs(
      MenuListContainer$1,
      {
        isOpen,
        x: springX,
        onOutsideClick: () => setIsOpen(false),
        children: [
          moduleNames.map((moduleName, index) => {
            return /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(
                ModuleHeader,
                {
                  title: moduleName,
                  subtitle: "unidad 0" + (index + 1),
                  isCompleted: completed.includes(moduleName)
                }
              ),
              videos.filter((vid) => vid.moduleName === moduleName).sort((a, b) => a.index < b.index ? -1 : 1).map((v) => /* @__PURE__ */ jsx(
                ListItem,
                {
                  isLocked: v.isPublic ? false : isLocked,
                  isCompleted: videosCompleted.includes(v.slug),
                  isCurrent: currentVideoSlug === v.slug,
                  slug: v.slug || "",
                  title: v.title || "",
                  duration: v.duration || 60
                },
                v.id
              ))
            ] }, index);
          }),
          /* @__PURE__ */ jsx("div", { className: "h-40" })
        ]
      }
    )
  ] });
};
const ListItem = ({
  isCompleted,
  duration,
  title,
  isCurrent,
  slug,
  isLocked
}) => {
  const formatDuration = (mins) => {
    const duration2 = String(mins).split(".");
    const m = duration2[0];
    const s = duration2[1] ? `.${Math.floor(Number(`.${duration2[1]}`) * 60)}` : "";
    return m + s + "m";
  };
  const ref = useRef(null);
  useEffect(() => {
    if (isCurrent && ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "center"
        // inline: "center",
      });
    }
  }, [isCurrent, slug]);
  return /* @__PURE__ */ jsxs(
    Link,
    {
      ref,
      to: `/player?videoSlug=${slug}`,
      className: cn(
        "group text-metal/50 overflow-hidden w-[90%] mx-auto relative pl-4 flex py-4  hover:brightness-100 rounded-2xl hover:text-metal/80 transition-all items-center",
        {
          "bg-[#1B1C20]  hover:text-white text-white ": isCurrent,
          "cursor-pointer": !isLocked,
          "cursor-not-allowed": isLocked
        }
      ),
      children: [
        /* @__PURE__ */ jsx("div", { className: "absolute w-0 group-hover:w-[120%] transition-all duration-700 bg-[rgba(35,35,44,.3)] h-full rounded-3xl -left-4" }),
        /* @__PURE__ */ jsx(
          "span",
          {
            className: cn("text-2xl ", {
              "text-green-500": isCompleted,
              "p-2 bg-fish w-6 h-6 rounded-full flex items-center justify-center": isCurrent
            }),
            children: isCurrent ? /* @__PURE__ */ jsx(FaPlay, { className: "text-base" }) : isCompleted ? /* @__PURE__ */ jsx(MdOutlineRadioButtonChecked, {}) : /* @__PURE__ */ jsx(MdOutlineRadioButtonUnchecked, {})
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "capitalize text-sm pl-4 z-20", children: title }),
        isLocked ? /* @__PURE__ */ jsx("span", { className: "ml-auto pr-8", children: /* @__PURE__ */ jsx(IoMdLock, {}) }) : /* @__PURE__ */ jsx("div", { className: "text-xs pl-auto ml-auto pr-4", children: formatDuration(duration) })
      ]
    }
  );
};
const MenuListContainer$1 = ({
  children,
  x = 0,
  onOutsideClick,
  isOpen: isActive = false
}) => {
  const ref = useClickOutside({ isActive, onOutsideClick });
  const maskImage = useMotionTemplate`linear-gradient(to bottom, white 80%, transparent 100%`;
  return /* @__PURE__ */ jsx(
    motion$1.div,
    {
      ref,
      style: {
        x,
        scrollbarWidth: "none",
        maskImage
      },
      className: "md:w-[380px] w-[300px] fixed z-10 rounded-xl overflow-y-scroll h-[88%] bg-dark top-0 left-0 pt-20 z-20",
      children
    }
  );
};
const ModuleHeader = ({
  title,
  subtitle,
  isCompleted
}) => {
  return /* @__PURE__ */ jsx("header", { className: "text-fish rounded-3xl pl-9 py-3 bg-[#141518] flex items-center gap-4 mb-2", children: /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("p", { className: "font-sans capitalize font-semibold text-white", children: subtitle }),
    /* @__PURE__ */ jsx(
      "h3",
      {
        className: cn("text-lg md:text-2xl font-bold font-sans", {
          "text-green-500": isCompleted
        }),
        children: title
      }
    )
  ] }) });
};
const MenuButton$1 = ({
  isOpen,
  x = 0,
  onToggle
}) => {
  return /* @__PURE__ */ jsx(
    motion$1.button,
    {
      whileHover: { scale: 1.05 },
      style: { x },
      onClick: onToggle,
      className: cn(
        "fixed bg-[#141518] text-4xl w-14 h-14 text-white top-0 mt-20 p-2 z-20 flex items-center justify-center rounded-r-2xl hover:bg-[rgba(35,35,44)]",
        {
          "left-[-80px] md:left-auto": isOpen,
          "rounded-2xl": isOpen
        }
      ),
      children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "popLayout", children: isOpen ? /* @__PURE__ */ jsx(
        motion$1.span,
        {
          initial: { filter: "blur(9px)", opacity: 0 },
          animate: { filter: "blur(0px)", opacity: 1 },
          exit: { filter: "blur(9px)", opacity: 0 },
          children: /* @__PURE__ */ jsx(MdMenuOpen, {})
        },
        "open"
      ) : /* @__PURE__ */ jsx(
        motion$1.span,
        {
          initial: { filter: "blur(9px)", opacity: 0 },
          animate: { filter: "blur(0px)", opacity: 1 },
          exit: { filter: "blur(9px)", opacity: 0 },
          children: /* @__PURE__ */ jsx(BsMenuButtonWide, { className: "text-3xl " })
        },
        "close"
      ) })
    }
  );
};
const POSTER = "https://i.imgur.com/kP5Rrjt.png";
const VideoPlayer = ({
  video,
  onPlay,
  onPause,
  onClickNextVideo,
  onEnd,
  nextVideo,
  autoPlay,
  isPurchased
}) => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const togglePlay = () => {
    const controls = videoRef.current || null;
    if (!controls) return;
    if (controls.paused) {
      controls.play();
      onPlay == null ? void 0 : onPlay();
    } else {
      controls.pause();
    }
    setIsPlaying(!controls.paused);
  };
  const setListeners = () => {
    const controls = videoRef.current || null;
    if (!controls) return;
    controls.onplaying = () => {
      onPlay == null ? void 0 : onPlay();
      setIsPlaying(true);
    };
    controls.onplay = () => setIsPlaying(true);
    controls.onpause = () => {
      setIsPlaying(false);
      onPause == null ? void 0 : onPause();
    };
    controls.onended = () => onEnd == null ? void 0 : onEnd();
    controls.ontimeupdate = () => {
      if (controls.duration - controls.currentTime < 15) {
        setIsEnding(true);
        updateWatchedList();
      } else {
        setIsEnding(false);
      }
    };
  };
  const updateWatchedList = () => {
    if (typeof window === "undefined") return;
    let list = localStorage.getItem("watched") || "[]";
    list = JSON.parse(list);
    list = [.../* @__PURE__ */ new Set([...list, video == null ? void 0 : video.slug])];
    localStorage.setItem("watched", JSON.stringify(list));
  };
  useEffect(() => {
    if (!videoRef.current) return;
    const hlsSupport = (videoNode) => videoNode.canPlayType("application/vnd.apple.mpegURL");
    if (hlsSupport(videoRef.current)) {
      console.info(`Native HLS Supported ✅::`);
      videoRef.current.src = "/playlist/" + (video == null ? void 0 : video.storageKey) + "/index.m3u8";
    } else {
      if (!(video == null ? void 0 : video.isPublic) && !isPurchased) return;
      console.info("Native HLS Not supported. 😢 Fallbacking to hls.js::");
      const exampleSrc = `/playlist/${video == null ? void 0 : video.storageKey}/index.m3u8`;
      console.log("HLS.JS_IS_UP::", Hls.isSupported());
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(exampleSrc);
        hls.attachMedia(videoRef.current);
      }
    }
  }, [video]);
  useEffect(() => {
    setListeners();
  }, []);
  return /* @__PURE__ */ jsxs(
    "section",
    {
      className: "h-[calc(100vh-80px)] relative overflow-x-hidden",
      ref: containerRef,
      children: [
        /* @__PURE__ */ jsxs(AnimatePresence, { children: [
          !isPlaying && /* @__PURE__ */ jsx(
            motion$1.button,
            {
              onClick: togglePlay,
              initial: { backdropFilter: "blur(9px)" },
              animate: { backdropFilter: "blur(0px)" },
              exit: { backdropFilter: "blur(0px)", opacity: 0 },
              transition: { duration: 0.2 },
              className: "absolute inset-0 bottom-16 flex justify-center items-center cursor-pointer z-10",
              children: /* @__PURE__ */ jsx("span", { className: " bg-white/10 backdrop-blur	 flex items-center justify-center text-6xl text-white rounded-full  w-[120px] h-[90px]", children: /* @__PURE__ */ jsx(FaGooglePlay, {}) })
            },
            "play_button"
          ),
          nextVideo && isEnding && /* @__PURE__ */ jsxs(
            motion$1.div,
            {
              onClick: onClickNextVideo,
              whileTap: { scale: 0.99 },
              transition: { type: "spring", bounce: 0.2 },
              whileHover: { scale: 1.05 },
              exit: { opacity: 0, filter: "blur(9px)", x: 50 },
              initial: { opacity: 0, filter: "blur(9px)", x: 50 },
              animate: { opacity: 1, filter: "blur(0px)", x: 0 },
              className: "absolute right-2 bg-gray-100 z-20 bottom-20 md:top-4 md:right-4 md:left-auto md:bottom-auto left-2 md:w-[500px] px-6 md:pt-6 pt-10 pb-6 rounded-3xl flex gap-4 shadow-sm items-end",
              children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => setIsEnding(false),
                    className: "self-end text-4xl active:scale-95 md:hidden absolute right-4 top-1",
                    children: /* @__PURE__ */ jsx(IoIosClose, {})
                  }
                ),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-left dark:text-metal text-iron", children: "Siguiente video" }),
                  /* @__PURE__ */ jsx("h4", { className: "text-2xl text-dark md:w-[280px] md:truncate text-left", children: nextVideo.title })
                ] }),
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    alt: "poster",
                    src: nextVideo.poster || POSTER,
                    onError: (e) => {
                      e.target.onerror = null;
                      e.target.src = POSTER;
                    },
                    className: "aspect-video w-40 rounded-xl object-cover"
                  }
                )
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "video",
          {
            autoPlay,
            "data-nombre": video.slug,
            poster: (video == null ? void 0 : video.poster) || POSTER,
            controlsList: "nodownload",
            ref: videoRef,
            className: "w-full h-full",
            controls: true,
            src: video == null ? void 0 : video.storageLink,
            type: "video/mp4",
            children: /* @__PURE__ */ jsx("track", { kind: "captions" })
          }
        )
      ]
    }
  );
};
const sleep = (t = 1) => new Promise((r) => setTimeout(r, t * 1e3));
const shotBlueConfetti = (trigger) => trigger.addConfetti({
  confettiRadius: 6,
  confettiColors: ["rgb(81 88 246)"]
});
const EmojiConfetti = ({
  mode: mode2 = "default",
  emojis = ["🎉", "👾", "🎊", "🚀", "🥳", "🎈", "🪅"],
  repeat = 2,
  confettiColors = [
    "#ff0a54",
    "#ff477e",
    "#ff7096",
    "#ff85a1",
    "#fbb1bd",
    "#f9bec7"
  ]
}) => {
  useEffect(() => {
    const jsConfetti = new JSConfetti();
    const start = async () => {
      if (mode2 === "emojis") {
        jsConfetti.addConfetti({
          emojis
        });
        await sleep(2);
        jsConfetti.addConfetti({
          emojis
        });
        return;
      }
      let counter = 0;
      while (counter < repeat) {
        counter++;
        await sleep(1);
        shotBlueConfetti(jsConfetti);
        await sleep(1);
      }
    };
    start();
  }, []);
  return null;
};
const Drawer = ({
  children,
  isOpen = false,
  onClose,
  title = "Título",
  subtitle,
  cta,
  className,
  header,
  mode: mode2
}) => {
  const body = useRef();
  const handleKeys = (event) => {
    if (event.key === "Escape") {
      onClose == null ? void 0 : onClose();
    }
  };
  useEffect(() => {
    if (document.body) {
      body.current = document.body;
    }
    addEventListener("keydown", handleKeys);
    if (document.body && isOpen) {
      document.body.style.overflow = "hidden";
    } else if (document.body && !isOpen) {
      document.body.style.overflow = "";
    }
    return () => {
      removeEventListener("keydown", handleKeys);
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  const jsx2 = /* @__PURE__ */ jsxs("article", { className: cn("relative ", className), children: [
    /* @__PURE__ */ jsx(
      motion$1.button,
      {
        onClick: onClose,
        id: "overlay",
        className: "fixed inset-0 bg-dark/60  z-10",
        animate: { backdropFilter: "blur(4px)" },
        exit: { backdropFilter: "blur(0)", opacity: 0 }
      }
    ),
    /* @__PURE__ */ jsxs(
      motion$1.section,
      {
        initial: { x: "100%" },
        animate: { x: 0 },
        exit: { x: "120%" },
        transition: { type: "spring", bounce: 0.2, duration: 0.5 },
        className: cn(
          "bg-dark border border-white/10 z-10 h-screen fixed top-0 right-0 shadow-xl rounded-tl-3xl rounded-bl-3xl py-8 px-4 flex flex-col lg:w-[40%] md:w-[60%] w-[95%]",
          {
            "md:w-[95%] w-[95%]": mode2 === "big"
          }
        ),
        children: [
          /* @__PURE__ */ jsxs("header", { className: "flex items-start justify-end mb-6 ", children: [
            header ? header : /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h4", { className: "text-2xl font-semibold md:text-4xl text-white", children: title }),
              /* @__PURE__ */ jsx("p", { className: "text-brand_gray", children: subtitle })
            ] }),
            /* @__PURE__ */ jsx(
              Link,
              {
                to: "/player",
                tabIndex: 0,
                onClick: onClose,
                className: "w-10 h-10 flex items-center justify-center bg-gray-200/10 rounded-full p-1 active:scale-95",
                children: /* @__PURE__ */ jsx(IoClose, { className: "text-white text-2xl" })
              }
            )
          ] }),
          /* @__PURE__ */ jsx("section", { className: "overflow-y-scroll h-[95%]", children }),
          /* @__PURE__ */ jsx("nav", { className: "flex justify-end gap-4  mt-auto", children: cta ? cta : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: onClose,
                className: "bg-brand_blue text-white hover:scale-95 rounded-full px-8 py-2 transition-all",
                children: "Aceptar"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: onClose,
                className: "text-red-500 bg-transparent px-8 py-2 hover:scale-95 transition-all",
                children: "Cancelar"
              }
            )
          ] }) })
        ]
      }
    )
  ] });
  return /* @__PURE__ */ jsx(AnimatePresence, { mode: "popLayout", children: isOpen && jsx2 });
};
const SuccessDrawer = ({
  isOpen,
  onClose
}) => {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(EmojiConfetti, {}),
    /* @__PURE__ */ jsx(
      Drawer,
      {
        header: /* @__PURE__ */ jsx(Fragment, {}),
        cta: /* @__PURE__ */ jsx(Fragment, {}),
        className: "z-[100]",
        title: "Desbloquea todo el curso",
        isOpen,
        onClose,
        mode: "big",
        children: /* @__PURE__ */ jsx("div", { className: "h-full flex items-center", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto", children: [
          /* @__PURE__ */ jsx("img", { src: "/congrats.png", alt: "logo", className: "mx-auto w-[240px]" }),
          /* @__PURE__ */ jsx("h2", { className: "text-2xl dark:text-white font-semibold md:text-4xl text-center pt-10 md:pt-20 text-white max-w-xl", children: "¡Tu acceso está listo! 🪄✨🎩🐰🤩 Ve por él, está en tu correo." }),
          /* @__PURE__ */ jsxs("p", { className: "md:max-w-xl text-lg text-metal dark:text-metal text-center font-light mt-6", children: [
            "Nos da gusto que seas parte de este curso. ",
            /* @__PURE__ */ jsx("br", {}),
            "A partir de hoy, tus páginas web nunca volverán a ser las mismas. ",
            /* @__PURE__ */ jsx("br", {}),
            /* @__PURE__ */ jsx("strong", { children: "¡Que comience la magia! 🧙🏻🪄" })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm  dark:text-metal text-metal text-center font-light mt-6", children: [
            "Pd. Si aún no recibiste tu acceso, escribenos:",
            " ",
            /* @__PURE__ */ jsx(
              "a",
              {
                className: "text-blue-500 hover:text-blue-600",
                rel: "noreferrer",
                target: "_blank",
                href: "mailto:brenda@fixter.org",
                children: "brenda@fixter.org"
              }
            ),
            " "
          ] })
        ] }) })
      }
    )
  ] });
};
const PurchaseDrawer = () => {
  const [isLoading, setIsLoading] = useState(false);
  return /* @__PURE__ */ jsx(
    Drawer,
    {
      header: /* @__PURE__ */ jsx(Fragment, {}),
      cta: /* @__PURE__ */ jsx(Fragment, {}),
      className: "z-50",
      title: "Desbloquea todo el curso",
      isOpen: true,
      children: /* @__PURE__ */ jsxs("div", { className: "pt-20 px-8  pb-8 flex flex-col justify-between h-full", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-4xl text-white", children: "¿List@ para crear animaciones? Prepárate porque apenas estamos comenzando 🚀🧙🏻" }),
          /* @__PURE__ */ jsxs("p", { className: "text-xl font-light mt-16 text-metal", children: [
            "¡Desbloquea el curso completo! 🫶🏻 Construye conmigo todos los componentes paso a paso y conviértete en un@ PRO de las animaciones.",
            " ",
            /* @__PURE__ */ jsx("br", {})
          ] })
        ] }),
        /* @__PURE__ */ jsx(Form, { method: "POST", children: /* @__PURE__ */ jsx(
          PrimaryButton,
          {
            onClick: () => setIsLoading(true),
            isLoading,
            name: "intent",
            value: "checkout",
            type: "submit",
            className: "font-semibold w-full mt-20 hover:tracking-wide",
            children: "¡Que siga la magia! 🎩🪄"
          }
        ) }),
        " "
      ] })
    }
  );
};
const VideosResources = ({
  isOpen,
  setIsOpen
}) => {
  const x = useMotionValue(0);
  const springX = useSpring(x, { bounce: 0.2 });
  const buttonX = useTransform(springX, [-400, 0], [0, 394]);
  useEffect(() => {
    isOpen ? x.set(0) : x.set(-400);
  }, [isOpen, x]);
  return /* @__PURE__ */ jsxs("div", { className: "bg-[#141518] h-full ", children: [
    /* @__PURE__ */ jsx(
      MenuButton,
      {
        x: buttonX,
        onToggle: () => setIsOpen((o) => !o),
        isOpen
      }
    ),
    /* @__PURE__ */ jsxs(
      MenuListContainer,
      {
        isOpen,
        x: springX,
        onOutsideClick: () => setIsOpen(false),
        children: [
          /* @__PURE__ */ jsxs("div", { className: "px-6 bg-[#141518] py-10 rounded-r-3xl", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-white text-2xl font-bold", children: "Esta es la lista de recursos o links que ocuparás durante el curso:" }),
            /* @__PURE__ */ jsxs("ul", { className: "text-metal mt-12 flex flex-col gap-3", children: [
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: "https://github.com/FixterGeek/Animaciones.git",
                  target: "_blank",
                  children: /* @__PURE__ */ jsxs("li", { className: "flex gap-3 items-center hover:text-fish", children: [
                    /* @__PURE__ */ jsx(GrGithub, {}),
                    " Link al repo"
                  ] })
                }
              ),
              /* @__PURE__ */ jsx("a", { href: "https://motion.dev/", target: "_blank", children: /* @__PURE__ */ jsxs("li", { className: "flex gap-3 items-center hover:text-fish", children: [
                /* @__PURE__ */ jsx(MdOutlineAutoAwesomeMotion, {}),
                " Documentación oficial de Motion"
              ] }) }),
              /* @__PURE__ */ jsx("a", { href: "https://react.dev/://motion.dev/", target: "_blank", children: /* @__PURE__ */ jsxs("li", { className: "flex gap-3 items-center hover:text-fish", children: [
                /* @__PURE__ */ jsx(FaReact, {}),
                " Documentación oficial de React"
              ] }) })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-metal mt-12", children: [
              "Recuerda que los componentes",
              " ",
              /* @__PURE__ */ jsx("span", { className: "text-white/80 font-semibold", children: "son tuyos, puedes empezar a usarlos desde ahora en tus proyectos." })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "h-40" })
        ]
      }
    )
  ] });
};
const MenuListContainer = ({
  children,
  x = 0,
  onOutsideClick,
  isOpen: isActive = false
}) => {
  const ref = useClickOutside({ isActive, onOutsideClick });
  const maskImage = useMotionTemplate`linear-gradient(to bottom, white 80%, transparent 100%`;
  return /* @__PURE__ */ jsx(
    motion$1.div,
    {
      ref,
      style: {
        x,
        scrollbarWidth: "none",
        maskImage
      },
      className: "md:w-[380px] w-[300px] fixed  rounded-xl overflow-y-scroll h-[88%] bg-[#141518] top-0 left-0 pt-20 z-20",
      children
    }
  );
};
const MenuButton = ({
  isOpen,
  x = 0,
  onToggle
}) => {
  return /* @__PURE__ */ jsx(
    motion$1.button,
    {
      whileHover: { scale: 1.05 },
      style: { x },
      onClick: onToggle,
      className: cn(
        "fixed bg-[#141518] text-4xl w-14 h-14 text-white top-0 mt-36 p-2 z-20 flex items-center justify-center rounded-r-2xl hover:bg-[rgba(35,35,44)]",
        {
          "left-[-80px] md:left-auto": isOpen,
          "rounded-2xl": isOpen
        }
      ),
      children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "popLayout", children: isOpen ? /* @__PURE__ */ jsx(
        motion$1.span,
        {
          initial: { filter: "blur(9px)", opacity: 0 },
          animate: { filter: "blur(0px)", opacity: 1 },
          exit: { filter: "blur(9px)", opacity: 0 },
          children: /* @__PURE__ */ jsx(HiOutlineDocumentSearch, {})
        },
        "open"
      ) : /* @__PURE__ */ jsx(
        motion$1.span,
        {
          initial: { filter: "blur(9px)", opacity: 0 },
          animate: { filter: "blur(0px)", opacity: 1 },
          exit: { filter: "blur(9px)", opacity: 0 },
          children: /* @__PURE__ */ jsx(IoDocumentsOutline, { className: "text-3xl " })
        },
        "close"
      ) })
    }
  );
};
const courseId$1 = "645d3dbd668b73b34443789c";
const meta = () => getMetaTags({
  title: "Visualizador del curso de animaciones con React",
  description: "Mira todos los videos del curso en alta definición."
});
const action$3 = async ({ request }) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "checkout") {
    const url = await get40Checkout();
    return redirect$1(url);
  }
  return null;
};
const loader$4 = async ({ request }) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const videos = await db.video.findMany({
    where: {
      courseIds: {
        has: "645d3dbd668b73b34443789c"
      }
    },
    orderBy: { index: "asc" },
    // good!
    select: {
      title: true,
      id: true,
      slug: true,
      moduleName: true,
      duration: true,
      index: true,
      poster: true,
      isPublic: true
    }
  });
  const video = await db.video.findUnique({
    where: {
      slug: searchParams.get("videoSlug") || "bienvenida-al-curso"
      // @todo better sorting
    }
  });
  if (!video) throw json$1(null, { status: 404 });
  const nextVideo = await db.video.findFirst({
    where: {
      index: video.index + 1,
      courseIds: { has: courseId$1 }
    }
  });
  const moduleNames = [...new Set(videos.map((video2) => video2.moduleName))];
  const user = await getUserORNull(request);
  const isPurchased = user ? user.courses.includes("645d3dbd668b73b34443789c") : false;
  return {
    nextVideo,
    user,
    isPurchased,
    video: !isPurchased && !video.isPublic ? { ...video, storageLink: "" } : video,
    videos,
    moduleNames,
    searchParams: {
      success: searchParams.get("success") === "1"
    }
  };
};
function Route$2() {
  const { nextVideo, isPurchased, video, videos, searchParams, moduleNames } = useLoaderData();
  const [successIsOpen] = useState(searchParams.success);
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isTabOpen, setIsTabOpen] = useState(true);
  const submit = useSubmit();
  const [autoPlay, setAutoPlay] = useState(false);
  const handleClickEnding = (_, slug) => {
    const searchParams2 = createSearchParams();
    searchParams2.set("videoSlug", slug || (nextVideo == null ? void 0 : nextVideo.slug));
    setAutoPlay(true);
    setIsMenuOpen(false);
    submit(searchParams2);
  };
  useEffect(() => {
    let list = localStorage.getItem("watched") || "[]";
    list = JSON.parse(list);
    list[list.length - 1];
  }, []);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(NavBar, { mode: "player", className: "m-0" }),
    /* @__PURE__ */ jsxs("article", { className: "bg-dark relative overflow-x-hidden pt-20", children: [
      /* @__PURE__ */ jsx(
        VideoPlayer,
        {
          isPurchased,
          autoPlay,
          video,
          onClickNextVideo: handleClickEnding,
          nextVideo: nextVideo || void 0,
          onPlay: () => {
            setIsMenuOpen(false);
          }
        }
      ),
      /* @__PURE__ */ jsx(
        VideosMenu,
        {
          isOpen: isMenuOpen,
          setIsOpen: setIsMenuOpen,
          currentVideoSlug: video.slug,
          videos,
          moduleNames: moduleNames.filter((n) => typeof n === "string"),
          defaultOpen: !searchParams.success,
          isLocked: !isPurchased
        }
      ),
      isPurchased ? /* @__PURE__ */ jsx(VideosResources, { isOpen: isTabOpen, setIsOpen: setIsTabOpen }) : null
    ] }),
    searchParams.success && /* @__PURE__ */ jsx(SuccessDrawer, { isOpen: successIsOpen }),
    !isPurchased && !video.isPublic && /* @__PURE__ */ jsx(PurchaseDrawer, {})
  ] });
}
const route10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$3,
  default: Route$2,
  loader: loader$4,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const firebaseConfig = {
  apiKey: "AIzaSyBazg8vpK1JMpOtS9nOEYzfsVMSTJ_BPxk",
  authDomain: "fixter-67253.firebaseapp.com",
  databaseURL: "https://fixter-67253.firebaseio.com",
  projectId: "fixter-67253",
  // storageBucket: "fixter-67253.appspot.com",
  // messagingSenderId: "590084716663",
  appId: "1:590084716663:web:3c3c704a3f37078c"
};
initializeApp(firebaseConfig);
const googleLogin = async () => (await signInWithPopup(getAuth(), new GoogleAuthProvider())).user;
const MagicLink = () => {
  var _a, _b;
  const fetcher = useFetcher();
  const isLoading = fetcher.state !== "idle";
  const error = (_a = fetcher.data) == null ? void 0 : _a.error;
  const success = (_b = fetcher.data) == null ? void 0 : _b.success;
  const onSubmit = (event) => {
    fetcher.submit(
      {
        intent: "magic_link",
        email: event.currentTarget.email.value
      },
      { method: "POST" }
    );
  };
  const toast = useToast();
  useEffect(() => {
    var _a2;
    if (((_a2 = fetcher.data) == null ? void 0 : _a2.error) && fetcher.state === "idle") {
      toast.error({ text: fetcher.data.error });
    }
  }, [fetcher]);
  const handleGoogleLogin = async () => {
    const user = await googleLogin();
    const data = {
      displayName: user.displayName,
      email: user.email,
      confirmed: user.emailVerified,
      phoneNumber: user.phoneNumber,
      photoURL: user.photoURL,
      uid: user.uid
    };
    fetcher.submit(
      {
        intent: "google_login",
        data: JSON.stringify(data)
      },
      { method: "POST" }
    );
  };
  return /* @__PURE__ */ jsxs("article", { className: "bg-white bg-magic text-dark dark:text-white  bg-no-repeat bg-right dark:bg-dark h-screen flex pt-[120px] justify-center items-center  gap-2", children: [
    /* @__PURE__ */ jsx(NavBar, {}),
    /* @__PURE__ */ jsxs("div", { className: "-mt-20 w-[90%] md:w-fit mx-auto", children: [
      /* @__PURE__ */ jsx("img", { className: "w-52 mx-auto", src: "/hat.png", alt: "logo" }),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl text-center font-semibold md:text-4xl mt-8 ", children: "Inicia sesión" }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-center dark:text-metal text-iron font-light mt-0 mb-8", children: "Continua con tu cuenta de Google o con Magic link" }),
      !success && /* @__PURE__ */ jsxs(Form, { onSubmit, method: "POST", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            disabled: isLoading,
            onClick: handleGoogleLogin,
            type: "button",
            className: "w-full md:w-[480px] h-16 rounded-full  dark:bg-dark bg-white border border-lightGray dark:border-lightGray/20  my-2 p-2 flex justify-center items-center hover:scale-105 transition-all active:scale-100 hover:shadow-sm disabled:pointer-events-none",
            children: /* @__PURE__ */ jsx(
              "img",
              {
                className: "h-12 object-cover",
                src: "https://preview.redd.it/u5xicew35ps51.png?auto=webp&s=60d75f170b4b57c4210ed8ccb3f5e5f93350a8d9",
                alt: "gmail logo"
              }
            )
          }
        ),
        /* @__PURE__ */ jsx("hr", { className: "dark:bg-lightGray/10 bg-lightGray/30 h-[1px] border-none w-full my-8" }),
        /* @__PURE__ */ jsxs("div", { className: "flex relative w-full md:w-[480px] gap-2 h-16 rounded-full border border-lightGray  dark:border-lightGray/20  ", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              disabled: isLoading,
              "aria-disabled": isLoading,
              name: "email",
              type: "email",
              placeholder: "brendi@ejemplo.com",
              className: cn(
                " py-2 px-6 w-full h-full bg-transparent rounded-full border-none focus:border-none focus:ring-indigo-500",
                {
                  "ring-fish ring-4": error,
                  "disabled:bg-lightGray/30": isLoading
                }
              )
            }
          ),
          error && /* @__PURE__ */ jsx("p", { className: "text-red-500 mt-2 text-xs", children: error }),
          /* @__PURE__ */ jsx(
            "button",
            {
              disabled: isLoading,
              type: "submit",
              className: cn(
                "absolute right-0 h-full not-disabled:hover:bg-indigo-600 rounded-full bg-fish  py-2 px-2 md:px-6 text-white not-disabled:active:scale-95 disabled:cursor-not-allowed w-[180px] md:w-[220px] flex justify-center items-center"
              ),
              children: isLoading ? /* @__PURE__ */ jsx("div", { className: "border-4 border-gray-700 border-t-white rounded-full animate-spin h-6 w-6" }) : " Enviar magic link 🪄"
            }
          )
        ] })
      ] }),
      success && /* @__PURE__ */ jsxs("section", { className: "text-lg text-center text-iron", children: [
        /* @__PURE__ */ jsx("p", { children: "Ya te hemos enviado el token de acceso a tu cuenta. ✅" }),
        /* @__PURE__ */ jsxs("p", { children: [
          "Revisa tu",
          " ",
          /* @__PURE__ */ jsx(
            "a",
            {
              rel: "noreferrer",
              target: "_blank",
              href: "http://gmail.com",
              className: "text-blue-500 hover:text-blue-400",
              children: "mail."
            }
          ),
          " ",
          "(y tu bandeja de spam 😉)."
        ] })
      ] })
    ] })
  ] });
};
const action$2 = async ({ request }) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "magic_link") {
    const email = String(formData.get("email"));
    const parsed = z.string().email().safeParse(email);
    if (!parsed.success) return { error: "El email es incorrecto" };
    const { error } = await sendMagicLink(email);
    return { error, success: !error };
  }
  if (intent === "sign-out") {
    const session = await getSession(request.headers.get("Cookie"));
    throw redirect("/", {
      headers: { "Set-Cookie": await destroySession(session) }
    });
  }
  if (intent === "google_login") {
    const data = JSON.parse(formData.get("data"));
    if (!data.email)
      return {
        error: "Google no quiere compartirnos tu correo. 🙃 Intenta con el magic link"
      };
    const user = await getOrCreateUser(data);
    await setSessionWithEmailAndRedirect(user.email, { request });
  }
  return null;
};
const loader$3 = async ({ request }) => {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const next = url.searchParams.get("next");
  if (token) {
    const verified = verifyToken(token);
    if (!verified.success || !verified.decoded)
      return { screen: "wrong_token" };
    const { email } = verified.decoded;
    await confirmUser(email);
    return await setSessionWithEmailAndRedirect(email, {
      request,
      redirectURL: next || void 0
    });
  }
  const user = await getUserORNull(request);
  if (user) {
    return redirect("/player");
  }
  return { screen: "login" };
};
function Route$1() {
  const { screen } = useLoaderData();
  switch (screen) {
    case "wrong_token":
      return /* @__PURE__ */ jsxs("article", { className: "flex flex-col items-center h-screen justify-center gap-4 bg-slate-200", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl", children: "Este token no sirve más. 👩🏻‍🔧" }),
        /* @__PURE__ */ jsx(Link, { to: "/portal", children: /* @__PURE__ */ jsx(PrimaryButton, { children: "Solicitar uno nuevo" }) })
      ] });
    default:
      return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(MagicLink, {}) });
  }
}
const route11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$2,
  default: Route$1,
  loader: loader$3
}, Symbol.toStringTag, { value: "Module" }));
const loader$2 = async ({ request }) => {
  const url = new URL(request.url);
  const storageKey = url.searchParams.get("storageKey");
  if (!storageKey || storageKey === "undefined" || storageKey === "null")
    throw json(void 0, { status: 404 });
  const readURL = await getReadURL$1("animaciones/" + storageKey);
  console.log("direct-video-reading-url FOR: ", storageKey);
  return redirect(readURL);
};
const route12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$2
}, Symbol.toStringTag, { value: "Module" }));
const ImageInput = ({
  label,
  storageKey,
  setValue,
  name,
  defaultValue,
  register,
  className,
  ...props
}) => {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState("");
  const [urls, setUrls] = useState({});
  const fetcher = useFetcher();
  const handleChange = async (event) => {
    var _a, _b;
    const file = (_b = (_a = event.currentTarget) == null ? void 0 : _a.files) == null ? void 0 : _b[0];
    if (!file) return console.error("No file selected");
    const url = URL.createObjectURL(file);
    setPreview(url);
    await fetch(urls.putURL, {
      method: "PUT",
      body: file,
      headers: {
        "content-type": file.type,
        "content-size": file.size
      }
    }).catch((e) => console.error(e));
    setValue == null ? void 0 : setValue(name, "/files?storageKey=" + storageKey);
  };
  const getStorageKey = () => {
    fetcher.submit(
      {
        intent: "get_combo_urls",
        storageKey
      },
      { method: "POST" }
    );
  };
  useEffect(() => {
    if (fetcher.data) {
      setUrls(fetcher.data);
    } else {
      getStorageKey();
    }
  }, [fetcher.data]);
  const src = preview || defaultValue;
  const handleInputChange = (e) => {
    setPreview(e.currentTarget.value);
  };
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("section", { className: cn("max-w-[30vw]", className), children: [
    /* @__PURE__ */ jsx("p", { className: "", children: label }),
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "text",
        name,
        defaultValue,
        className: "my-2 w-full rounded-lg disabled:bg-gray-200 text-gray-500",
        ...register(name),
        onChange: handleInputChange
      }
    ),
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: () => {
          var _a;
          (_a = inputRef.current) == null ? void 0 : _a.click();
        },
        className: cn(
          "border-indigo-500 border-2 rounded-3xl border-dotted flex items-center justify-center text-indigo-500 cursor-pointer text-lg hover:text-xl transition-all w-full aspect-video",
          {
            "border-none": src
          }
        ),
        children: [
          !src && /* @__PURE__ */ jsx("h2", { children: "Selecciona un archivo 📂 " }),
          src && /* @__PURE__ */ jsx(
            "img",
            {
              className: "object-cover w-full aspect-video rounded-3xl",
              src,
              alt: "preview"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      "input",
      {
        onChange: handleChange,
        ref: inputRef,
        hidden: true,
        type: "file",
        accept: "image/*"
      }
    )
  ] }) });
};
const Spinner = () => /* @__PURE__ */ jsx("div", { className: "border-4 rounded-full border-gray-200 animate-spin w-6 h-6 border-t-indigo-800" });
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var retrier = require$$0;
function retry(fn, opts) {
  function run(resolve, reject) {
    var options = opts || {};
    var op;
    if (!("randomize" in options)) {
      options.randomize = true;
    }
    op = retrier.operation(options);
    function bail(err) {
      reject(err || new Error("Aborted"));
    }
    function onError(err, num) {
      if (err.bail) {
        bail(err);
        return;
      }
      if (!op.retry(err)) {
        reject(op.mainError());
      } else if (options.onRetry) {
        options.onRetry(err, num);
      }
    }
    function runAttempt(num) {
      var val;
      try {
        val = fn(bail, num);
      } catch (err) {
        onError(err, num);
        return;
      }
      Promise.resolve(val).then(resolve).catch(function catchIt(err) {
        onError(err, num);
      });
    }
    op.attempt(runAttempt);
  }
  return new Promise(run);
}
var lib = retry;
const retry$1 = /* @__PURE__ */ getDefaultExportFromCjs(lib);
const MB = 1024 * 1024;
const PART_SIZE = 8 * MB;
const createMultipartUpload = async (handler2 = "/api/upload", directory) => {
  const init = {
    method: "POST",
    body: JSON.stringify({
      intent: CREATE_MULTIPART_STRING,
      directory
    }),
    headers: {
      "content-type": "application/json"
    }
  };
  let response2;
  try {
    response2 = await fetch(handler2, init).then((res) => res.json());
  } catch (error) {
    throw error instanceof Error ? error : new Error("Error on post to handler");
  }
  return response2;
};
const getPutPartUrl = async ({
  partNumber,
  uploadId,
  handler: handler2 = "/api/upload",
  key
}) => {
  return retry$1(
    async () => {
      const response2 = await fetch(handler2, {
        method: "POST",
        body: JSON.stringify({
          partNumber,
          uploadId,
          key,
          intent: CREATE_PUT_PART_URL_STRING
        })
      });
      return await response2.text();
    },
    { retries: 5 }
  );
};
const uploadOnePartRetry = async ({
  attempts = 5,
  url,
  blob
}) => {
  let retryCount = 0;
  return await retry$1(
    async (bail) => {
      const response2 = await fetch(url, {
        method: "PUT",
        body: blob
      });
      if (403 === response2.status) {
        bail(new Error("Unauthorized"));
        return;
      } else if (response2.ok) {
        return response2;
      } else {
        throw new Error("Unknown error");
      }
    },
    {
      retries: attempts,
      onRetry: (error) => {
        retryCount = retryCount + 1;
        if (error instanceof Error) {
          console.log(`retrying #${retryCount} Put request of ${url}`);
        }
      }
    }
  );
};
const uploadAllParts = async (options) => {
  const { file, numberOfParts, uploadId, key, onUploadProgress, handler: handler2 } = options;
  let loaded = 0;
  const uploadPromises = Array.from({ length: numberOfParts }).map(
    async (_, i) => {
      const url = await getPutPartUrl({
        partNumber: i + 1,
        uploadId,
        key,
        handler: handler2
      });
      const start = i * PART_SIZE;
      const end = Math.min(start + PART_SIZE, file.size);
      const blob = file.slice(start, end);
      const response2 = await uploadOnePartRetry({ url, blob });
      loaded += blob.size;
      const percentage = loaded / file.size * 100;
      onUploadProgress == null ? void 0 : onUploadProgress({ total: file.size, loaded, percentage });
      const str = response2.headers.get("ETag");
      return String(str).replaceAll('"', "");
    }
  );
  return await Promise.all(uploadPromises);
};
const completeMultipart = async (args) => {
  const { key, etags, uploadId, metadata, handler: handler2 = "/api/upload" } = args;
  return await retry$1(async () => {
    const res = await fetch(handler2, {
      method: "POST",
      body: JSON.stringify({
        intent: COMPLETE_MULTIPART_STRING,
        contentType: metadata.type,
        size: metadata.size,
        metadata,
        uploadId,
        etags,
        key
      })
    });
    return await res.json();
  });
};
const useUploadMultipart = (options) => {
  const {
    access = "public",
    // @todo implement ACL
    handler: handler2,
    onUploadProgress,
    multipart
  } = options || {};
  const upload = async (directory, file) => {
    const metadata = {
      name: file.name,
      size: file.size,
      type: file.type
    };
    const numberOfParts = Math.ceil(file.size / PART_SIZE);
    const { uploadId, key } = await createMultipartUpload(handler2, directory);
    const etags = await uploadAllParts({
      file,
      handler: handler2,
      key,
      numberOfParts,
      uploadId,
      onUploadProgress
    });
    const completedData = await completeMultipart({
      metadata,
      key,
      uploadId,
      etags,
      handler: handler2
    });
    return {
      uploadId,
      key,
      metadata,
      url: "",
      // @todo with ACL public
      access,
      completedData
    };
  };
  return { upload };
};
const VideoFileInput = ({
  video,
  setValue,
  label,
  name,
  register,
  className,
  onVideoLoads
}) => {
  const [urls, setURLs] = useState(null);
  const videoRef = useRef(null);
  const fetcher = useFetcher();
  const [videoSrc, setVideoSrc] = useState(video.storageLink || "");
  const [storageKey, setStorageKey] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const getStorageKey = () => {
    const storageKey2 = "video-" + video.id;
    fetcher.submit(
      {
        intent: "get_combo_urls",
        storageKey: storageKey2
      },
      { method: "POST" }
    );
    setStorageKey(storageKey2);
    return storageKey2;
  };
  const handleFileSelection = async (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return console.error("No file selected");
    setVideoSrc(URL.createObjectURL(file));
    uploadFile(file);
  };
  const { upload } = useUploadMultipart({
    onUploadProgress: ({ percentage }) => setProgress(percentage)
  });
  const uploadFile = async (file) => {
    setUploading(true);
    const { key } = await upload("animaciones/", file);
    const modKey = key.replace("animaciones/", "");
    setValue("storageKey", modKey);
    setValue("storageLink", "/files?storageKey=" + modKey);
    setUploading(false);
  };
  useEffect(() => {
    if (fetcher.data) {
      setURLs({ ...fetcher.data });
    } else {
      getStorageKey();
    }
  }, [fetcher.data]);
  return /* @__PURE__ */ jsxs(
    "section",
    {
      className: cn("my-2 grid gap-2 max-w-[50vw] md:max-w-[30vw]", className),
      children: [
        /* @__PURE__ */ jsx("p", { children: label }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            name,
            className: "disabled:pointer-events-none rounded-lg disabled:text-gray-500 disabled:bg-gray-200",
            disabled: true,
            ...register(name)
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "file",
            onChange: handleFileSelection,
            accept: "video/*",
            className: "mb-2"
          }
        ),
        " ",
        uploading && /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(Spinner, {}),
          " ",
          /* @__PURE__ */ jsxs("span", { children: [
            "Subiendo video ",
            progress.toFixed(0),
            "% no cierre la ventana"
          ] })
        ] }),
        videoSrc && /* @__PURE__ */ jsx(
          "video",
          {
            onCanPlay: (event) => onVideoLoads == null ? void 0 : onVideoLoads(videoRef, event),
            ref: videoRef,
            src: videoSrc,
            className: "border rounded-xl my-2 aspect-video w-full",
            controls: true
          }
        )
      ]
    }
  );
};
const VideoForm = ({
  onSubmit,
  video,
  videosLength
}) => {
  var _a, _b;
  const fetcher = useFetcher();
  const isLoading = fetcher.state !== "idle";
  const {
    handleSubmit,
    register,
    formState: { isValid },
    setValue
  } = useForm({
    defaultValues: {
      storageLink: `/videos?storageKey=${video.storageKey || `video-${video.id}`}`,
      storageKey: video.storageKey,
      title: video.title || "",
      isPublic: video.isPublic || false,
      duration: video.duration,
      moduleName: video.moduleName,
      id: video.id,
      slug: video.slug,
      index: Number(video.index) || videosLength,
      // @todo remove default
      poster: video.poster
    }
  });
  const handleVideoLoad = (videoRef) => {
    setValue("duration", String(Number(videoRef.current.duration) / 60));
  };
  const onSubmition = (values) => {
    fetcher.submit(
      {
        intent: "update_video",
        data: JSON.stringify(values)
      },
      { method: "POST" }
    );
    onSubmit == null ? void 0 : onSubmit(values);
  };
  const handleDelete = () => {
    if (!confirm("¿Seguro que quieres elminar?") || !video.id) return;
    fetcher.submit(
      {
        intent: "delete_video",
        videoId: video.id
      },
      { method: "POST" }
    );
    onSubmit == null ? void 0 : onSubmit();
  };
  const handleGenerateVersions = () => {
    return fetcher.submit(
      { intent: "experiment", storageKey: video.storageKey },
      { method: "POST" }
    );
  };
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs(
    Form,
    {
      className: "flex flex-col h-full",
      onSubmit: handleSubmit(onSubmition),
      children: [
        /* @__PURE__ */ jsxs("h3", { className: "mb-2 text-gray-100 text-xl", children: [
          "Nombre del modulo: ",
          video.moduleName
        ] }),
        /* @__PURE__ */ jsxs("h3", { className: "mb-2 text-gray-400 text-xl", children: [
          " ",
          video.slug
        ] }),
        /* @__PURE__ */ jsx(
          TextField,
          {
            type: "number",
            placeholder: "posición en la lista",
            label: "Índice",
            register: register("index", { required: true })
          }
        ),
        /* @__PURE__ */ jsx(
          TextField,
          {
            placeholder: "Título del nuevo video",
            label: "Título del video",
            register: register("title", { required: true })
          }
        ),
        video.id && /* @__PURE__ */ jsx(
          VideoFileInput,
          {
            className: "text-white",
            label: "Link del video",
            name: "storageLink",
            video,
            setValue,
            register,
            onVideoLoads: handleVideoLoad
          }
        ),
        ((_a = fetcher.data) == null ? void 0 : _a.playListURL) && /* @__PURE__ */ jsx("video", { controls: true, className: "aspect-video", children: /* @__PURE__ */ jsx(
          "source",
          {
            src: fetcher.data.playListURL,
            type: "application/x-mpegURL"
          }
        ) }),
        video.storageKeys && video.storageKeys.length > 0 && /* @__PURE__ */ jsxs("div", { className: "text-white dark:text-black mb-2", children: [
          /* @__PURE__ */ jsx("p", { children: "Otras versiones:" }),
          /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: (_b = video.m3u8) == null ? void 0 : _b.map((k) => /* @__PURE__ */ jsx("p", { children: k }, k)) })
        ] }),
        video.storageKey && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleGenerateVersions,
            type: "button",
            className: "dark:text-black text-white border rounded-md py-2 active:bg-gray-800 mb-4",
            children: "Generar Todas las Versiones"
          }
        ),
        video.id && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("label", { className: "flex justify-between cursor-pointer my-4 text-white", children: [
            /* @__PURE__ */ jsx("span", { children: "¿Este video es público?" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                ...register("isPublic"),
                name: "isPublic",
                className: "size-4 text-green-500",
                type: "checkbox"
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            TextField,
            {
              placeholder: "60",
              type: "text",
              label: "Duración del video en minutos",
              register: register("duration", { required: false })
            }
          )
        ] }),
        video.id && /* @__PURE__ */ jsx(
          ImageInput,
          {
            className: "text-white",
            setValue,
            defaultValue: video.poster,
            name: "poster",
            storageKey: "poster-" + video.id,
            label: "Link del poster",
            register
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2 pt-4 sticky bottom-0 bg-black", children: [
          /* @__PURE__ */ jsx(
            PrimaryButton,
            {
              isDisabled: !isValid || isLoading,
              className: "w-full",
              type: "submit",
              children: "Guardar"
            }
          ),
          video.id && /* @__PURE__ */ jsx(
            PrimaryButton,
            {
              onClick: handleDelete,
              className: "w-full bg-red-500",
              type: "button",
              children: "Eliminar"
            }
          )
        ] })
      ]
    }
  ) });
};
const TextField = ({
  error,
  name,
  label,
  placeholder,
  register,
  isDisabled,
  type = "text",
  ...props
}) => {
  return /* @__PURE__ */ jsxs("label", { className: "flex flex-col gap-2 mb-4 text-white", children: [
    /* @__PURE__ */ jsx("p", { className: "", children: label }),
    /* @__PURE__ */ jsx(
      "input",
      {
        disabled: isDisabled,
        placeholder,
        className: cn(
          "shadow rounded-md py-2 px-4 border w-full",
          "text-black",
          {
            "bg-gray-200 text-gray-500 pointer-events-none": isDisabled
          }
        ),
        type,
        name,
        ...props,
        ...register
      }
    ),
    error && /* @__PURE__ */ jsx("p", { children: error })
  ] });
};
const MACHINES_API_URL = "https://api.machines.dev/v1/apps/animations/machines";
const generateVersion = async ({
  machineId,
  storageKey,
  size
}) => {
  if (!machineId) return console.error("NO MACHINE ID FOUND");
  return await createHLSChunks({
    onError: () => stopMachine(machineId),
    storageKey,
    sizeName: size,
    checkExistance: false,
    cb: (path2) => {
      uploadChunks(path2, true, async () => {
        await updateVideoVersions(storageKey, size);
        stopMachine(machineId)();
      });
    }
  });
};
const createVersionDetached = async (storageKey, size) => {
  const exist = await fileExist(`chunks/${storageKey}/${size}.m3u8`);
  if (exist) {
    return console.info("VERSION_ALREADY_EXIST_ABORTING", size);
  }
  const agenda = new Agenda({ db: { address: process.env.DATABASE_URL } });
  agenda.define("create_chunks", async (job) => {
    console.log("CREATING::PERFORMANCE::MACHINE::");
    const machineId = await createMachine({
      image: await listMachinesAndFindImage()
    });
    if (!machineId) return console.error("ERROR_ON_MACHINE_CREATION");
    await waitForMachineToStart(machineId);
    await delegateToPerformanceMachine({
      size,
      machineId,
      storageKey,
      intent: "generate_video_version"
    });
  });
  await agenda.start();
  await agenda.schedule("in 2 seconds", "create_chunks");
};
const createMachine = async ({ image }) => {
  const init = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.FLY_BEARER_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      config: {
        image,
        guest: { cpu_kind: "performance", cpus: 1, memory_mb: 2048 },
        auto_destroy: true
      }
    })
  };
  const response2 = await fetch(MACHINES_API_URL, init);
  if (!response2.ok)
    return console.error("LA MAQUINA NO SE CREO", await response2.json());
  const { name, id } = await response2.json();
  console.log("::MAQUINA_CREADA::", name, id);
  return id;
};
const stopMachine = (machineId) => async () => {
  if (!machineId) return;
  const id = machineId;
  const init = {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.FLY_BEARER_TOKEN}` }
  };
  const response2 = await fetch(`${MACHINES_API_URL}/${id}/stop`, init);
  if (!response2.ok) return console.error("La maquina no se detuvo", response2);
  console.log("PERFORMANCE_MACHINE_STOPED");
  return true;
};
const delegateToPerformanceMachine = async ({
  machineId,
  storageKey,
  path: path2 = "/admin",
  intent = "experiment",
  size
}) => {
  const body = new FormData();
  body.append("intent", intent);
  body.append("storageKey", storageKey);
  const init = {
    method: "POST",
    body
  };
  const internal_host = `http://${machineId}.vm.animations.internal:3000`;
  try {
    const response2 = await fetch(
      `${internal_host}${path2}?machineId=${machineId}&size=${size}`,
      init
    );
    if (!response2.ok) {
      console.error("::ERROR_ON_INTERNAL_REQUEST::", response2);
      stopMachine(machineId);
    }
  } catch (e) {
  }
  console.log("::RESPONSE_OK::", response.ok);
};
const waitForMachineToStart = async (id) => {
  const init = {
    method: "GET",
    headers: { Authorization: `Bearer ${process.env.FLY_BEARER_TOKEN}` }
  };
  const response2 = await fetch(
    `${MACHINES_API_URL}/${id}/wait?state=started`,
    init
  );
  if (!response2.ok) console.error("MACHINE_NOT_WAITED", response2);
  return new Promise(
    (res) => setTimeout(() => {
      console.log("::PERFORMANCE_MACHINE_READY::");
      res(response2.ok);
    }, 1e4)
  );
};
const listMachinesAndFindImage = async () => {
  const init = {
    method: "GET",
    headers: { Authorization: `Bearer ${process.env.FLY_BEARER_TOKEN}` }
  };
  const list = await fetch(MACHINES_API_URL, init).then((r) => r.json());
  return list[0].config.image;
};
const action$1 = async ({ request }) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const url = new URL(request.url);
  const storageKey = String(formData.get("storageKey"));
  if (intent === "update_modules_order") {
    const moduleNamesOrder = JSON.parse(
      formData.get("moduleNamesOrder")
    );
    const courseId2 = formData.get("courseId");
    if (!moduleNamesOrder.length || !courseId2) return null;
    await db.course.update({
      where: {
        id: courseId2
      },
      data: {
        moduleNamesOrder
      }
    });
  }
  if (intent === "generate_video_version") {
    console.info("INSIDE_WORKER_PERFORMANCE_MACHINE");
    generateVersion({
      machineId: url.searchParams.get("machineId"),
      size: url.searchParams.get("size"),
      storageKey
    });
  }
  if (intent === "experiment") {
    await createVersionDetached(storageKey, "360p");
    await createVersionDetached(storageKey, "480p");
    await createVersionDetached(storageKey, "720p");
    await createVersionDetached(storageKey, "1080p");
    return json$1(null, { status: 200 });
  }
  if (intent === "get_combo_urls") {
    const storageKey2 = String(formData.get("storageKey"));
    return await getComboURLs(storageKey2);
  }
  if (intent === "delete_video") {
    const id = String(formData.get("videoId"));
    await db.video.delete({ where: { id } });
    removeFilesFor(id);
  }
  if (intent === "update_modulename") {
    const oldModuleName = String(formData.get("oldModuleName"));
    const newModuleName = String(formData.get("newModuleName"));
    await db.video.updateMany({
      where: {
        moduleName: oldModuleName
      },
      data: { moduleName: newModuleName }
    });
  }
  if (intent === "update_video") {
    const data = JSON.parse(formData.get("data"));
    data.courseIds = ["645d3dbd668b73b34443789c"];
    data.slug = slugify(data.title, { lower: true });
    data.index = data.index ? Number(data.index) : void 0;
    data.storageLink = "/videos?storageKey=" + data.storageKey;
    if (data.id) {
      const id = data.id;
      delete data.id;
      await db.video.update({
        where: {
          id
        },
        data
        // data includes storageKey
      });
      return null;
    }
    await db.video.create({ data });
  }
  return null;
};
const loader$1 = async ({ request }) => {
  const user = await getUserOrRedirect({ request });
  if (user.role !== "ADMIN") throw redirect("/");
  const course = await db.course.findUnique({
    where: { id: "645d3dbd668b73b34443789c" }
  });
  const videos = await db.video.findMany({
    where: {
      courseIds: {
        has: "645d3dbd668b73b34443789c"
      }
    },
    orderBy: { index: "asc" }
  });
  if (!course) throw json$1(null, { status: 404 });
  const moduleNamesOrder = course.moduleNamesOrder.length ? [...course.moduleNamesOrder] : [...new Set(videos.map((video) => video.moduleName))];
  return { course, videos, moduleNamesOrder };
};
const initialVideo = {
  title: "Nuevo video",
  moduleName: ""
};
function Route() {
  const fetcher = useFetcher();
  const { course, moduleNamesOrder, videos } = useLoaderData();
  const [video, setVideo] = useState(initialVideo);
  const [showVideoDrawer, setShowVideoDrawer] = useState(false);
  const [modules, setModules] = useState(moduleNamesOrder);
  const handleModuleSubmit = (e) => {
    e.preventDefault();
    const name = e.currentTarget.name.value;
    e.currentTarget.name.value = "";
    if (!name) return;
    setModules((ms) => [...ms, name]);
  };
  const handleAddVideo = (moduleName) => {
    setShowVideoDrawer(true);
    setVideo((v) => ({ ...v, moduleName }));
  };
  const handleVideoEdit = (video2) => {
    setVideo(video2);
    setShowVideoDrawer(true);
  };
  const handleModuleTitleUpdate = (prev, nuevo) => {
    setModules((m) => m.map((mod) => mod === prev ? nuevo : mod));
  };
  const handleModuleOrderUpdate = (oldIndex, newIndex) => {
    const names = [...modules];
    const moving = names.splice(oldIndex, 1)[0];
    names.splice(newIndex, 0, moving);
    setModules(names);
    fetcher.submit(
      {
        intent: "update_modules_order",
        moduleNamesOrder: JSON.stringify(names),
        courseId: course.id
      },
      { method: "post" }
    );
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("article", { className: "bg-gradient-to-tr from-slate-950 to-indigo-950 min-h-screen py-20 px-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-gray-50 text-2xl mb-6", children: course.title }),
      /* @__PURE__ */ jsxs(
        "form",
        {
          onSubmit: handleModuleSubmit,
          className: "flex items-center justify-end gap-4",
          children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                name: "name",
                type: "text",
                placeholder: "Nombre del nuevo módulo",
                className: "py-3 px-6 text-lg rounded-full"
              }
            ),
            /* @__PURE__ */ jsx(PrimaryButton, { type: "submit", className: "bg-green-500", children: "Añadir módulo" })
          ]
        }
      ),
      /* @__PURE__ */ jsx(LayoutGroup, { children: /* @__PURE__ */ jsx("section", { className: "my-8 grid gap-4 max-w-7xl mx-auto grid-cols-1 lg:grid-cols-3", children: modules.map((moduleTitle, i) => /* @__PURE__ */ jsx(
        Module,
        {
          onModuleOrderUpdate: handleModuleOrderUpdate,
          index: i,
          onModuleTitleUpdate: handleModuleTitleUpdate,
          onVideoSelect: handleVideoEdit,
          onAddVideo: () => moduleTitle && handleAddVideo(moduleTitle),
          title: moduleTitle || "",
          videos: videos.filter(
            (video2) => video2.moduleName === moduleTitle
          )
        },
        moduleTitle
      )) }) })
    ] }),
    /* @__PURE__ */ jsx(
      Drawer,
      {
        onClose: () => {
          setShowVideoDrawer(false);
          setVideo({});
        },
        isOpen: showVideoDrawer,
        title: video.id ? "Editar video" : "Añadir video",
        cta: /* @__PURE__ */ jsx(Fragment, {}),
        children: /* @__PURE__ */ jsx(
          VideoForm,
          {
            onSubmit: () => {
              setVideo(initialVideo);
              setShowVideoDrawer(false);
            },
            video,
            videosLength: videos.length
          }
        )
      }
    )
  ] });
}
const Module = ({
  title,
  videos = [],
  onAddVideo,
  onVideoSelect,
  onModuleTitleUpdate,
  onModuleOrderUpdate,
  index
}) => {
  const fetcher = useFetcher();
  const [isOpen, setIsOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const ref = useClickOutside({
    isActive: isEditing,
    includeEscape: true,
    onOutsideClick: () => {
      setIsEditing(false);
    }
  });
  const handleAddVideo = () => {
    onAddVideo == null ? void 0 : onAddVideo(title);
  };
  const handleModuleTitleUpdate = (event) => {
    const value = event.currentTarget.title.value;
    if (!value) return;
    onModuleTitleUpdate == null ? void 0 : onModuleTitleUpdate(title, value);
    fetcher.submit(
      {
        intent: "update_modulename",
        oldModuleName: title,
        newModuleName: value
      },
      { method: "post" }
    );
  };
  const controls = useDragControls();
  const handleDragEnd = (event) => {
    const all = document.elementsFromPoint(event.clientX, event.clientY);
    const found = all.find(
      (node) => node.dataset.index && node.dataset.index !== String(index)
    );
    if (found) {
      onModuleOrderUpdate == null ? void 0 : onModuleOrderUpdate(Number(index), Number(found.dataset.index));
    }
  };
  return /* @__PURE__ */ jsxs(
    motion.article,
    {
      layout: true,
      layoutId: title,
      className: "relative",
      drag: true,
      dragControls: controls,
      dragSnapToOrigin: true,
      onDragEnd: handleDragEnd,
      "data-index": index,
      dragListener: false,
      children: [
        /* @__PURE__ */ jsxs("section", { className: "bg-slate-600 py-2 px-4 flex justify-between items-center mt-2 ", children: [
          /* @__PURE__ */ jsx(Dragger, { onPointerDown: (ev) => controls.start(ev) }),
          isEditing ? /* @__PURE__ */ jsx("form", { ref, onSubmit: handleModuleTitleUpdate, children: /* @__PURE__ */ jsx(
            "input",
            {
              defaultValue: title,
              autoFocus: true,
              className: "rounded py-1 px-2",
              placeholder: "Escribe un nuevo titulo",
              name: "title"
            }
          ) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("p", { className: "text-gray-400 w-10 text-center", children: [
              " ",
              index + 1
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setIsEditing(true),
                className: "text-white font-bold capitalize text-left",
                children: title ? title : "Sin título"
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "flex-grow flex justify-end",
              onClick: () => setIsOpen((o) => !o),
              children: isOpen ? /* @__PURE__ */ jsx(FaChevronDown, {}) : /* @__PURE__ */ jsx(FaChevronUp, {})
            }
          )
        ] }),
        isOpen && /* @__PURE__ */ jsxs("section", { className: "min-h-20 bg-slate-300 p-4 flex flex-col gap-2 group", children: [
          videos.length < 1 && /* @__PURE__ */ jsx("p", { className: "text-center py-6", children: "No hay videos" }),
          videos.sort((a, b) => a.index < b.index ? -1 : 1).map((video, index2) => /* @__PURE__ */ jsx(
            Video,
            {
              onClick: () => onVideoSelect == null ? void 0 : onVideoSelect(video),
              video
            },
            video.id
          )),
          /* @__PURE__ */ jsx(
            PrimaryButton,
            {
              onClick: handleAddVideo,
              className: "group-hover:visible invisible ml-auto",
              children: "Añadir video"
            }
          )
        ] })
      ]
    },
    title
  );
};
const Video = ({
  video,
  onClick,
  onReorder
}) => {
  const fetcher = useFetcher();
  const controls = useDragControls();
  const handleDragEnd = (event) => {
    const all = document.elementsFromPoint(event.clientX, event.clientY);
    const found = all.find(
      (node) => node.dataset.videoindex && node.dataset.videoindex !== String(video.index)
    );
    if (found) {
      onReorder == null ? void 0 : onReorder(Number(video.index), Number(found.dataset.videoindex));
      fetcher.submit(
        {
          intent: "update_video",
          data: JSON.stringify([{}])
        },
        { method: "POST" }
      );
    }
  };
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      "data-videoindex": video.index,
      onDragEnd: handleDragEnd,
      dragListener: false,
      drag: true,
      dragControls: controls,
      dragSnapToOrigin: true,
      onClick,
      className: cn(
        "hover:scale-[1.02] text-left py-1 px-4 rounded",
        // video.isPublic ? "bg-green-500" : "bg-slate-400",
        "bg-slate-400",
        "flex gap-2"
      ),
      children: [
        /* @__PURE__ */ jsx(Dragger, { onPointerDown: (event) => controls.start(event) }),
        /* @__PURE__ */ jsx("p", { className: "truncate", children: video.title }),
        /* @__PURE__ */ jsxs("div", { className: "ml-auto flex gap-2 items-center", children: [
          video.isPublic && /* @__PURE__ */ jsx("span", { children: "🌎" }),
          /* @__PURE__ */ jsx("span", { children: video.storageKey ? "📼" : "🫥" }),
          [...new Set(video.m3u8 || [])].map((version) => /* @__PURE__ */ jsx(
            "span",
            {
              className: "text-xs text-white bg-blue-500 py-px px-2 rounded-full",
              children: version
            },
            version
          ))
        ] })
      ]
    }
  );
};
const Dragger = ({
  onPointerDown
}) => {
  return /* @__PURE__ */ jsx(
    motion.button,
    {
      whileTap: { cursor: "grabbing", boxShadow: "0px 0px 24px 0px gray" },
      className: "cursor-grab py-px pr-px shadow-[unset] text-xl text-gray-900",
      onPointerDown: (e) => {
        e.stopPropagation();
        onPointerDown == null ? void 0 : onPointerDown(e);
      },
      children: /* @__PURE__ */ jsx(GrDrag, {})
    }
  );
};
const route13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$1,
  default: Route,
  loader: loader$1
}, Symbol.toStringTag, { value: "Module" }));
const loader = async ({ request }) => {
  const url = new URL(request.url);
  const storageKey = url.searchParams.get("storageKey");
  if (!storageKey) throw json(null, { status: 404 });
  const readURL = await getReadURL(storageKey);
  return redirect(readURL);
};
const route14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader
}, Symbol.toStringTag, { value: "Module" }));
const action = async ({ request }) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "self") {
    return await getUserORNull(request);
  }
  if (intent === "generate_hsl") {
    const storageKey = String(formData.get("storageKey"));
    console.log("Generating... HSL::", storageKey);
    await generateHSL(storageKey);
    console.log(`/playlist/${storageKey}/index.m3u8`);
    return { playListURL: `/playlist/${storageKey}/index.m3u8` };
  }
  if (intent === "generate_video_versions") {
    const videoId = String(formData.get("videoId"));
    const storageKey = String(formData.get("storageKey"));
    if (!storageKey || !videoId) return null;
    console.log("Generating multiple versions... for", storageKey);
    createVideoVersion(storageKey, "640x?");
    createVideoVersion(storageKey, "320x?");
    return null;
  }
  return null;
};
const route15 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-CCGzSxVf.js", "imports": ["/assets/jsx-runtime-DYkViK2L.js", "/assets/components-BMN4foKF.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/root-Dh7q1qcu.js", "imports": ["/assets/jsx-runtime-DYkViK2L.js", "/assets/components-BMN4foKF.js"], "css": ["/assets/root-ZWg_3INu.css"] }, "routes/playlist.$storageKey.index[.]m3u8": { "id": "routes/playlist.$storageKey.index[.]m3u8", "parentId": "root", "path": "playlist/:storageKey/index.m3u8", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/playlist._storageKey.index_._m3u8-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/playlist.$storageKey.$segment": { "id": "routes/playlist.$storageKey.$segment", "parentId": "root", "path": "playlist/:storageKey/:segment", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/playlist._storageKey._segment-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/learnings.primer_ejemplo": { "id": "routes/learnings.primer_ejemplo", "parentId": "root", "path": "learnings/primer_ejemplo", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/learnings.primer_ejemplo-BP6EnT0i.js", "imports": ["/assets/jsx-runtime-DYkViK2L.js", "/assets/proxy-CV3wXh37.js"], "css": [] }, "routes/stripe.webhook": { "id": "routes/stripe.webhook", "parentId": "root", "path": "stripe/webhook", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/stripe.webhook-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/admin_.users": { "id": "routes/admin_.users", "parentId": "root", "path": "admin/users", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/admin_.users-BeA8G82C.js", "imports": ["/assets/jsx-runtime-DYkViK2L.js", "/assets/utils-D7At0r7h.js", "/assets/components-BMN4foKF.js"], "css": [] }, "routes/ebook[.]pdf": { "id": "routes/ebook[.]pdf", "parentId": "root", "path": "ebook.pdf", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/ebook_._pdf-BIKnfy03.js", "imports": ["/assets/jsx-runtime-DYkViK2L.js", "/assets/tslib.es6-mnf4cu7N.js"], "css": [] }, "routes/api.upload": { "id": "routes/api.upload", "parentId": "routes/api", "path": "upload", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.upload-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/comunidad": { "id": "routes/comunidad", "parentId": "root", "path": "comunidad", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/comunidad-BsEbSyH1.js", "imports": ["/assets/comunidad-8qaXiqkO.js", "/assets/jsx-runtime-DYkViK2L.js", "/assets/PrimaryButton-BuUOKRux.js", "/assets/utils-D7At0r7h.js", "/assets/components-BMN4foKF.js"], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-p1shnnDF.js", "imports": ["/assets/jsx-runtime-DYkViK2L.js", "/assets/utils-D7At0r7h.js", "/assets/PrimaryButton-BuUOKRux.js", "/assets/index-MSxA10Hv.js", "/assets/use-spring-Bdr5e5lf.js", "/assets/comunidad-8qaXiqkO.js", "/assets/components-BMN4foKF.js"], "css": [] }, "routes/player": { "id": "routes/player", "parentId": "root", "path": "player", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/player-8HDJ8QpR.js", "imports": ["/assets/jsx-runtime-DYkViK2L.js", "/assets/comunidad-8qaXiqkO.js", "/assets/PrimaryButton-BuUOKRux.js", "/assets/index-BoL28IBb.js", "/assets/utils-D7At0r7h.js", "/assets/use-spring-Bdr5e5lf.js", "/assets/components-BMN4foKF.js", "/assets/index-MSxA10Hv.js"], "css": ["/assets/player-8Qs7Jhiv.css"] }, "routes/portal": { "id": "routes/portal", "parentId": "root", "path": "portal", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/portal-t4aPDzyD.js", "imports": ["/assets/jsx-runtime-DYkViK2L.js", "/assets/tslib.es6-mnf4cu7N.js", "/assets/utils-D7At0r7h.js", "/assets/comunidad-8qaXiqkO.js", "/assets/components-BMN4foKF.js", "/assets/PrimaryButton-BuUOKRux.js"], "css": [] }, "routes/videos": { "id": "routes/videos", "parentId": "root", "path": "videos", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/videos-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/admin": { "id": "routes/admin", "parentId": "root", "path": "admin", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/admin-Bx3M1lVF.js", "imports": ["/assets/jsx-runtime-DYkViK2L.js", "/assets/PrimaryButton-BuUOKRux.js", "/assets/index-BoL28IBb.js", "/assets/utils-D7At0r7h.js", "/assets/components-BMN4foKF.js", "/assets/proxy-CV3wXh37.js", "/assets/index-MSxA10Hv.js"], "css": [] }, "routes/files": { "id": "routes/files", "parentId": "root", "path": "files", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/files-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api": { "id": "routes/api", "parentId": "root", "path": "api", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api-l0sNRNKZ.js", "imports": [], "css": [] } }, "url": "/assets/manifest-ec267cc5.js", "version": "ec267cc5" };
const mode = "production";
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "v3_fetcherPersist": true, "v3_relativeSplatPath": true, "v3_throwAbortReason": true, "v3_singleFetch": true, "v3_lazyRouteDiscovery": true, "unstable_optimizeDeps": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/playlist.$storageKey.index[.]m3u8": {
    id: "routes/playlist.$storageKey.index[.]m3u8",
    parentId: "root",
    path: "playlist/:storageKey/index.m3u8",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/playlist.$storageKey.$segment": {
    id: "routes/playlist.$storageKey.$segment",
    parentId: "root",
    path: "playlist/:storageKey/:segment",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/learnings.primer_ejemplo": {
    id: "routes/learnings.primer_ejemplo",
    parentId: "root",
    path: "learnings/primer_ejemplo",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/stripe.webhook": {
    id: "routes/stripe.webhook",
    parentId: "root",
    path: "stripe/webhook",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/admin_.users": {
    id: "routes/admin_.users",
    parentId: "root",
    path: "admin/users",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/ebook[.]pdf": {
    id: "routes/ebook[.]pdf",
    parentId: "root",
    path: "ebook.pdf",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/api.upload": {
    id: "routes/api.upload",
    parentId: "routes/api",
    path: "upload",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "routes/comunidad": {
    id: "routes/comunidad",
    parentId: "root",
    path: "comunidad",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route9
  },
  "routes/player": {
    id: "routes/player",
    parentId: "root",
    path: "player",
    index: void 0,
    caseSensitive: void 0,
    module: route10
  },
  "routes/portal": {
    id: "routes/portal",
    parentId: "root",
    path: "portal",
    index: void 0,
    caseSensitive: void 0,
    module: route11
  },
  "routes/videos": {
    id: "routes/videos",
    parentId: "root",
    path: "videos",
    index: void 0,
    caseSensitive: void 0,
    module: route12
  },
  "routes/admin": {
    id: "routes/admin",
    parentId: "root",
    path: "admin",
    index: void 0,
    caseSensitive: void 0,
    module: route13
  },
  "routes/files": {
    id: "routes/files",
    parentId: "root",
    path: "files",
    index: void 0,
    caseSensitive: void 0,
    module: route14
  },
  "routes/api": {
    id: "routes/api",
    parentId: "root",
    path: "api",
    index: void 0,
    caseSensitive: void 0,
    module: route15
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
