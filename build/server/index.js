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
import fs, { lstatSync, fstatSync, readFileSync, promises, WriteStream } from "fs";
import path, { join, sep } from "path";
import { finished } from "stream/promises";
import { Readable, Writable } from "stream";
import crypto, { randomUUID, createHmac, createHash } from "crypto";
import { Buffer as Buffer$1 } from "buffer";
import { Agent, request as request$1 } from "http";
import { Agent as Agent$1, request } from "https";
import { TextDecoder as TextDecoder$1, promisify } from "util";
import { platform, release, homedir } from "os";
import { parse } from "url";
import { exec, fork } from "child_process";
import { versions, env } from "process";
import { Agenda } from "@hokify/agenda";
import { S3Client as S3Client$1, GetObjectCommand as GetObjectCommand$1, PutBucketCorsCommand, HeadObjectCommand, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl as getSignedUrl$1 } from "@aws-sdk/s3-request-presigner";
import Ffmpeg from "fluent-ffmpeg";
import invariant from "tiny-invariant";
import { motion, useDragControls, LayoutGroup } from "motion/react";
import Stripe from "stripe";
import { z as z$1 } from "zod";
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
function handleRequest(request2, responseStatusCode, responseHeaders, remixContext, loadContext) {
  let prohibitOutOfOrderStreaming = isBotRequest(request2.headers.get("user-agent")) || remixContext.isSpaMode;
  return prohibitOutOfOrderStreaming ? handleBotRequest(
    request2,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request2,
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
function handleBotRequest(request2, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request2.url,
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
function handleBrowserRequest(request2, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request2.url,
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
  }).then((result) => console.log(result)).catch((e5) => console.error(e5));
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
  }).then((result) => console.log(result)).catch((e5) => console.error(e5));
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
const checkIfUserIsEnrolledOrRedirect = async (request2, video) => {
  const user = await getUserOrRedirect({ request: request2 });
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
  request: request2,
  redirectURL = "/"
}) => {
  const session = await getSession(request2.headers.get("Cookie"));
  if (!session.has("userEmail")) {
    return throwRedirect(redirectURL, session);
  }
  const email = session.get("userEmail");
  const user = await db.user.findUnique({ where: { email } });
  if (!user) throw throwRedirect(redirectURL, session);
  return user;
};
const getUserORNull = async (request2) => {
  const session = await getSession(request2.headers.get("Cookie"));
  if (!session.has("userEmail")) return null;
  const email = session.get("userEmail");
  return await db.user.findUnique({ where: { email } });
};
const getAdminUserOrRedirect = async (request2, redirectURL = "/") => {
  const session = await getSession(request2.headers.get("Cookie"));
  if (!session.has("userEmail")) return throwRedirect(redirectURL, session);
  const email = session.get("userEmail");
  const admin = await db.user.findUnique({ where: { email, role: "ADMIN" } });
  if (!admin) return throwRedirect(redirectURL, session);
  return admin;
};
const getCanShareUserORNull = async (courseId2, request2) => {
  const session = await getSession(request2.headers.get("Cookie"));
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
  request: request2,
  redirectURL = "/player"
}) => {
  const session = await getSession(request2.headers.get("Cookie"));
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
  } catch (e5) {
    console.error(e5);
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
const loader$8 = async ({ request: request2, params }) => {
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
    await checkIfUserIsEnrolledOrRedirect(request2, video);
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
var module = { exports: {} };
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x3) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x3, {
  get: (a5, b5) => (typeof require !== "undefined" ? require : a5)[b5]
}) : x3)(function(x3) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x3 + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb2, mod) => function __require2() {
  return mod || (0, cb2[__getOwnPropNames(cb2)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var tslib_es6_exports = {};
__export(tslib_es6_exports, {
  __assign: () => __assign,
  __asyncDelegator: () => __asyncDelegator,
  __asyncGenerator: () => __asyncGenerator,
  __asyncValues: () => __asyncValues,
  __await: () => __await,
  __awaiter: () => __awaiter,
  __classPrivateFieldGet: () => __classPrivateFieldGet,
  __classPrivateFieldSet: () => __classPrivateFieldSet,
  __createBinding: () => __createBinding,
  __decorate: () => __decorate,
  __exportStar: () => __exportStar,
  __extends: () => __extends,
  __generator: () => __generator,
  __importDefault: () => __importDefault,
  __importStar: () => __importStar,
  __makeTemplateObject: () => __makeTemplateObject,
  __metadata: () => __metadata,
  __param: () => __param,
  __read: () => __read,
  __rest: () => __rest,
  __spread: () => __spread,
  __spreadArrays: () => __spreadArrays,
  __values: () => __values
});
function __extends(d5, b5) {
  extendStatics(d5, b5);
  function __() {
    this.constructor = d5;
  }
  d5.prototype = b5 === null ? Object.create(b5) : (__.prototype = b5.prototype, new __());
}
function __rest(s5, e5) {
  var t3 = {};
  for (var p5 in s5) if (Object.prototype.hasOwnProperty.call(s5, p5) && e5.indexOf(p5) < 0)
    t3[p5] = s5[p5];
  if (s5 != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i5 = 0, p5 = Object.getOwnPropertySymbols(s5); i5 < p5.length; i5++) {
      if (e5.indexOf(p5[i5]) < 0 && Object.prototype.propertyIsEnumerable.call(s5, p5[i5]))
        t3[p5[i5]] = s5[p5[i5]];
    }
  return t3;
}
function __decorate(decorators, target, key, desc) {
  var c5 = arguments.length, r5 = c5 < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d5;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r5 = Reflect.decorate(decorators, target, key, desc);
  else for (var i5 = decorators.length - 1; i5 >= 0; i5--) if (d5 = decorators[i5]) r5 = (c5 < 3 ? d5(r5) : c5 > 3 ? d5(target, key, r5) : d5(target, key)) || r5;
  return c5 > 3 && r5 && Object.defineProperty(target, key, r5), r5;
}
function __param(paramIndex, decorator) {
  return function(target, key) {
    decorator(target, key, paramIndex);
  };
}
function __metadata(metadataKey, metadataValue) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}
function __awaiter(thisArg, _arguments, P2, generator) {
  function adopt(value) {
    return value instanceof P2 ? value : new P2(function(resolve) {
      resolve(value);
    });
  }
  return new (P2 || (P2 = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e5) {
        reject(e5);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e5) {
        reject(e5);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
function __generator(thisArg, body) {
  var _ = { label: 0, sent: function() {
    if (t3[0] & 1) throw t3[1];
    return t3[1];
  }, trys: [], ops: [] }, f5, y3, t3, g5;
  return g5 = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g5[Symbol.iterator] = function() {
    return this;
  }), g5;
  function verb(n5) {
    return function(v3) {
      return step([n5, v3]);
    };
  }
  function step(op) {
    if (f5) throw new TypeError("Generator is already executing.");
    while (_) try {
      if (f5 = 1, y3 && (t3 = op[0] & 2 ? y3["return"] : op[0] ? y3["throw"] || ((t3 = y3["return"]) && t3.call(y3), 0) : y3.next) && !(t3 = t3.call(y3, op[1])).done) return t3;
      if (y3 = 0, t3) op = [op[0] & 2, t3.value];
      switch (op[0]) {
        case 0:
        case 1:
          t3 = op;
          break;
        case 4:
          _.label++;
          return { value: op[1], done: false };
        case 5:
          _.label++;
          y3 = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t3 = _.trys, t3 = t3.length > 0 && t3[t3.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t3 || op[1] > t3[0] && op[1] < t3[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t3[1]) {
            _.label = t3[1];
            t3 = op;
            break;
          }
          if (t3 && _.label < t3[2]) {
            _.label = t3[2];
            _.ops.push(op);
            break;
          }
          if (t3[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e5) {
      op = [6, e5];
      y3 = 0;
    } finally {
      f5 = t3 = 0;
    }
    if (op[0] & 5) throw op[1];
    return { value: op[0] ? op[1] : void 0, done: true };
  }
}
function __createBinding(o5, m5, k5, k22) {
  if (k22 === void 0) k22 = k5;
  o5[k22] = m5[k5];
}
function __exportStar(m5, exports) {
  for (var p5 in m5) if (p5 !== "default" && !exports.hasOwnProperty(p5)) exports[p5] = m5[p5];
}
function __values(o5) {
  var s5 = typeof Symbol === "function" && Symbol.iterator, m5 = s5 && o5[s5], i5 = 0;
  if (m5) return m5.call(o5);
  if (o5 && typeof o5.length === "number") return {
    next: function() {
      if (o5 && i5 >= o5.length) o5 = void 0;
      return { value: o5 && o5[i5++], done: !o5 };
    }
  };
  throw new TypeError(s5 ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __read(o5, n5) {
  var m5 = typeof Symbol === "function" && o5[Symbol.iterator];
  if (!m5) return o5;
  var i5 = m5.call(o5), r5, ar2 = [], e5;
  try {
    while ((n5 === void 0 || n5-- > 0) && !(r5 = i5.next()).done) ar2.push(r5.value);
  } catch (error) {
    e5 = { error };
  } finally {
    try {
      if (r5 && !r5.done && (m5 = i5["return"])) m5.call(i5);
    } finally {
      if (e5) throw e5.error;
    }
  }
  return ar2;
}
function __spread() {
  for (var ar2 = [], i5 = 0; i5 < arguments.length; i5++)
    ar2 = ar2.concat(__read(arguments[i5]));
  return ar2;
}
function __spreadArrays() {
  for (var s5 = 0, i5 = 0, il = arguments.length; i5 < il; i5++) s5 += arguments[i5].length;
  for (var r5 = Array(s5), k5 = 0, i5 = 0; i5 < il; i5++)
    for (var a5 = arguments[i5], j5 = 0, jl = a5.length; j5 < jl; j5++, k5++)
      r5[k5] = a5[j5];
  return r5;
}
function __await(v3) {
  return this instanceof __await ? (this.v = v3, this) : new __await(v3);
}
function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g5 = generator.apply(thisArg, _arguments || []), i5, q5 = [];
  return i5 = {}, verb("next"), verb("throw"), verb("return"), i5[Symbol.asyncIterator] = function() {
    return this;
  }, i5;
  function verb(n5) {
    if (g5[n5]) i5[n5] = function(v3) {
      return new Promise(function(a5, b5) {
        q5.push([n5, v3, a5, b5]) > 1 || resume(n5, v3);
      });
    };
  }
  function resume(n5, v3) {
    try {
      step(g5[n5](v3));
    } catch (e5) {
      settle(q5[0][3], e5);
    }
  }
  function step(r5) {
    r5.value instanceof __await ? Promise.resolve(r5.value.v).then(fulfill, reject) : settle(q5[0][2], r5);
  }
  function fulfill(value) {
    resume("next", value);
  }
  function reject(value) {
    resume("throw", value);
  }
  function settle(f5, v3) {
    if (f5(v3), q5.shift(), q5.length) resume(q5[0][0], q5[0][1]);
  }
}
function __asyncDelegator(o5) {
  var i5, p5;
  return i5 = {}, verb("next"), verb("throw", function(e5) {
    throw e5;
  }), verb("return"), i5[Symbol.iterator] = function() {
    return this;
  }, i5;
  function verb(n5, f5) {
    i5[n5] = o5[n5] ? function(v3) {
      return (p5 = !p5) ? { value: __await(o5[n5](v3)), done: n5 === "return" } : f5 ? f5(v3) : v3;
    } : f5;
  }
}
function __asyncValues(o5) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m5 = o5[Symbol.asyncIterator], i5;
  return m5 ? m5.call(o5) : (o5 = typeof __values === "function" ? __values(o5) : o5[Symbol.iterator](), i5 = {}, verb("next"), verb("throw"), verb("return"), i5[Symbol.asyncIterator] = function() {
    return this;
  }, i5);
  function verb(n5) {
    i5[n5] = o5[n5] && function(v3) {
      return new Promise(function(resolve, reject) {
        v3 = o5[n5](v3), settle(resolve, reject, v3.done, v3.value);
      });
    };
  }
  function settle(resolve, reject, d5, v3) {
    Promise.resolve(v3).then(function(v5) {
      resolve({ value: v5, done: d5 });
    }, reject);
  }
}
function __makeTemplateObject(cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", { value: raw });
  } else {
    cooked.raw = raw;
  }
  return cooked;
}
function __importStar(mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) {
    for (var k5 in mod) if (Object.hasOwnProperty.call(mod, k5)) result[k5] = mod[k5];
  }
  result.default = mod;
  return result;
}
function __importDefault(mod) {
  return mod && mod.__esModule ? mod : { default: mod };
}
function __classPrivateFieldGet(receiver, privateMap) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to get private field on non-instance");
  }
  return privateMap.get(receiver);
}
function __classPrivateFieldSet(receiver, privateMap, value) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to set private field on non-instance");
  }
  privateMap.set(receiver, value);
  return value;
}
var extendStatics, __assign;
var init_tslib_es6 = __esm({
  "node_modules/.pnpm/tslib@1.14.1/node_modules/tslib/tslib.es6.js"() {
    extendStatics = function(d5, b5) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d6, b6) {
        d6.__proto__ = b6;
      } || function(d6, b6) {
        for (var p5 in b6) if (b6.hasOwnProperty(p5)) d6[p5] = b6[p5];
      };
      return extendStatics(d5, b5);
    };
    __assign = function() {
      __assign = Object.assign || function __assign2(t3) {
        for (var s5, i5 = 1, n5 = arguments.length; i5 < n5; i5++) {
          s5 = arguments[i5];
          for (var p5 in s5) if (Object.prototype.hasOwnProperty.call(s5, p5)) t3[p5] = s5[p5];
        }
        return t3;
      };
      return __assign.apply(this, arguments);
    };
  }
});
var fromUtf8, toUtf8;
var init_pureJs = __esm({
  "node_modules/.pnpm/@aws-sdk+util-utf8-browser@3.259.0/node_modules/@aws-sdk/util-utf8-browser/dist-es/pureJs.js"() {
    fromUtf8 = (input) => {
      const bytes = [];
      for (let i5 = 0, len = input.length; i5 < len; i5++) {
        const value = input.charCodeAt(i5);
        if (value < 128) {
          bytes.push(value);
        } else if (value < 2048) {
          bytes.push(value >> 6 | 192, value & 63 | 128);
        } else if (i5 + 1 < input.length && (value & 64512) === 55296 && (input.charCodeAt(i5 + 1) & 64512) === 56320) {
          const surrogatePair = 65536 + ((value & 1023) << 10) + (input.charCodeAt(++i5) & 1023);
          bytes.push(surrogatePair >> 18 | 240, surrogatePair >> 12 & 63 | 128, surrogatePair >> 6 & 63 | 128, surrogatePair & 63 | 128);
        } else {
          bytes.push(value >> 12 | 224, value >> 6 & 63 | 128, value & 63 | 128);
        }
      }
      return Uint8Array.from(bytes);
    };
    toUtf8 = (input) => {
      let decoded = "";
      for (let i5 = 0, len = input.length; i5 < len; i5++) {
        const byte = input[i5];
        if (byte < 128) {
          decoded += String.fromCharCode(byte);
        } else if (192 <= byte && byte < 224) {
          const nextByte = input[++i5];
          decoded += String.fromCharCode((byte & 31) << 6 | nextByte & 63);
        } else if (240 <= byte && byte < 365) {
          const surrogatePair = [byte, input[++i5], input[++i5], input[++i5]];
          const encoded = "%" + surrogatePair.map((byteValue) => byteValue.toString(16)).join("%");
          decoded += decodeURIComponent(encoded);
        } else {
          decoded += String.fromCharCode((byte & 15) << 12 | (input[++i5] & 63) << 6 | input[++i5] & 63);
        }
      }
      return decoded;
    };
  }
});
function fromUtf82(input) {
  return new TextEncoder().encode(input);
}
function toUtf82(input) {
  return new TextDecoder("utf-8").decode(input);
}
var init_whatwgEncodingApi = __esm({
  "node_modules/.pnpm/@aws-sdk+util-utf8-browser@3.259.0/node_modules/@aws-sdk/util-utf8-browser/dist-es/whatwgEncodingApi.js"() {
  }
});
var dist_es_exports = {};
__export(dist_es_exports, {
  fromUtf8: () => fromUtf83,
  toUtf8: () => toUtf83
});
var fromUtf83, toUtf83;
var init_dist_es = __esm({
  "node_modules/.pnpm/@aws-sdk+util-utf8-browser@3.259.0/node_modules/@aws-sdk/util-utf8-browser/dist-es/index.js"() {
    init_pureJs();
    init_whatwgEncodingApi();
    fromUtf83 = (input) => typeof TextEncoder === "function" ? fromUtf82(input) : fromUtf8(input);
    toUtf83 = (input) => typeof TextDecoder === "function" ? toUtf82(input) : toUtf8(input);
  }
});
var require_convertToBuffer = __commonJS({
  "node_modules/.pnpm/@aws-crypto+util@3.0.0/node_modules/@aws-crypto/util/build/convertToBuffer.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.convertToBuffer = void 0;
    var util_utf8_browser_1 = (init_dist_es(), __toCommonJS(dist_es_exports));
    var fromUtf85 = typeof Buffer !== "undefined" && Buffer.from ? function(input) {
      return Buffer.from(input, "utf8");
    } : util_utf8_browser_1.fromUtf8;
    function convertToBuffer(data) {
      if (data instanceof Uint8Array)
        return data;
      if (typeof data === "string") {
        return fromUtf85(data);
      }
      if (ArrayBuffer.isView(data)) {
        return new Uint8Array(data.buffer, data.byteOffset, data.byteLength / Uint8Array.BYTES_PER_ELEMENT);
      }
      return new Uint8Array(data);
    }
    exports.convertToBuffer = convertToBuffer;
  }
});
var require_isEmptyData = __commonJS({
  "node_modules/.pnpm/@aws-crypto+util@3.0.0/node_modules/@aws-crypto/util/build/isEmptyData.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isEmptyData = void 0;
    function isEmptyData(data) {
      if (typeof data === "string") {
        return data.length === 0;
      }
      return data.byteLength === 0;
    }
    exports.isEmptyData = isEmptyData;
  }
});
var require_numToUint8 = __commonJS({
  "node_modules/.pnpm/@aws-crypto+util@3.0.0/node_modules/@aws-crypto/util/build/numToUint8.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.numToUint8 = void 0;
    function numToUint8(num) {
      return new Uint8Array([
        (num & 4278190080) >> 24,
        (num & 16711680) >> 16,
        (num & 65280) >> 8,
        num & 255
      ]);
    }
    exports.numToUint8 = numToUint8;
  }
});
var require_uint32ArrayFrom = __commonJS({
  "node_modules/.pnpm/@aws-crypto+util@3.0.0/node_modules/@aws-crypto/util/build/uint32ArrayFrom.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.uint32ArrayFrom = void 0;
    function uint32ArrayFrom(a_lookUpTable) {
      if (!Uint32Array.from) {
        var return_array = new Uint32Array(a_lookUpTable.length);
        var a_index = 0;
        while (a_index < a_lookUpTable.length) {
          return_array[a_index] = a_lookUpTable[a_index];
          a_index += 1;
        }
        return return_array;
      }
      return Uint32Array.from(a_lookUpTable);
    }
    exports.uint32ArrayFrom = uint32ArrayFrom;
  }
});
var require_build = __commonJS({
  "node_modules/.pnpm/@aws-crypto+util@3.0.0/node_modules/@aws-crypto/util/build/index.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.uint32ArrayFrom = exports.numToUint8 = exports.isEmptyData = exports.convertToBuffer = void 0;
    var convertToBuffer_1 = require_convertToBuffer();
    Object.defineProperty(exports, "convertToBuffer", { enumerable: true, get: function() {
      return convertToBuffer_1.convertToBuffer;
    } });
    var isEmptyData_1 = require_isEmptyData();
    Object.defineProperty(exports, "isEmptyData", { enumerable: true, get: function() {
      return isEmptyData_1.isEmptyData;
    } });
    var numToUint8_1 = require_numToUint8();
    Object.defineProperty(exports, "numToUint8", { enumerable: true, get: function() {
      return numToUint8_1.numToUint8;
    } });
    var uint32ArrayFrom_1 = require_uint32ArrayFrom();
    Object.defineProperty(exports, "uint32ArrayFrom", { enumerable: true, get: function() {
      return uint32ArrayFrom_1.uint32ArrayFrom;
    } });
  }
});
var require_aws_crc32 = __commonJS({
  "node_modules/.pnpm/@aws-crypto+crc32@3.0.0/node_modules/@aws-crypto/crc32/build/aws_crc32.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AwsCrc32 = void 0;
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    var util_1 = require_build();
    var index_1 = require_build2();
    var AwsCrc322 = (
      /** @class */
      function() {
        function AwsCrc323() {
          this.crc32 = new index_1.Crc32();
        }
        AwsCrc323.prototype.update = function(toHash) {
          if ((0, util_1.isEmptyData)(toHash))
            return;
          this.crc32.update((0, util_1.convertToBuffer)(toHash));
        };
        AwsCrc323.prototype.digest = function() {
          return tslib_1.__awaiter(this, void 0, void 0, function() {
            return tslib_1.__generator(this, function(_a) {
              return [2, (0, util_1.numToUint8)(this.crc32.digest())];
            });
          });
        };
        AwsCrc323.prototype.reset = function() {
          this.crc32 = new index_1.Crc32();
        };
        return AwsCrc323;
      }()
    );
    exports.AwsCrc32 = AwsCrc322;
  }
});
var require_build2 = __commonJS({
  "node_modules/.pnpm/@aws-crypto+crc32@3.0.0/node_modules/@aws-crypto/crc32/build/index.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AwsCrc32 = exports.Crc32 = exports.crc32 = void 0;
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    var util_1 = require_build();
    function crc32(data) {
      return new Crc323().update(data).digest();
    }
    exports.crc32 = crc32;
    var Crc323 = (
      /** @class */
      function() {
        function Crc324() {
          this.checksum = 4294967295;
        }
        Crc324.prototype.update = function(data) {
          var e_1, _a;
          try {
            for (var data_1 = tslib_1.__values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
              var byte = data_1_1.value;
              this.checksum = this.checksum >>> 8 ^ lookupTable[(this.checksum ^ byte) & 255];
            }
          } catch (e_1_1) {
            e_1 = { error: e_1_1 };
          } finally {
            try {
              if (data_1_1 && !data_1_1.done && (_a = data_1.return)) _a.call(data_1);
            } finally {
              if (e_1) throw e_1.error;
            }
          }
          return this;
        };
        Crc324.prototype.digest = function() {
          return (this.checksum ^ 4294967295) >>> 0;
        };
        return Crc324;
      }()
    );
    exports.Crc32 = Crc323;
    var a_lookUpTable = [
      0,
      1996959894,
      3993919788,
      2567524794,
      124634137,
      1886057615,
      3915621685,
      2657392035,
      249268274,
      2044508324,
      3772115230,
      2547177864,
      162941995,
      2125561021,
      3887607047,
      2428444049,
      498536548,
      1789927666,
      4089016648,
      2227061214,
      450548861,
      1843258603,
      4107580753,
      2211677639,
      325883990,
      1684777152,
      4251122042,
      2321926636,
      335633487,
      1661365465,
      4195302755,
      2366115317,
      997073096,
      1281953886,
      3579855332,
      2724688242,
      1006888145,
      1258607687,
      3524101629,
      2768942443,
      901097722,
      1119000684,
      3686517206,
      2898065728,
      853044451,
      1172266101,
      3705015759,
      2882616665,
      651767980,
      1373503546,
      3369554304,
      3218104598,
      565507253,
      1454621731,
      3485111705,
      3099436303,
      671266974,
      1594198024,
      3322730930,
      2970347812,
      795835527,
      1483230225,
      3244367275,
      3060149565,
      1994146192,
      31158534,
      2563907772,
      4023717930,
      1907459465,
      112637215,
      2680153253,
      3904427059,
      2013776290,
      251722036,
      2517215374,
      3775830040,
      2137656763,
      141376813,
      2439277719,
      3865271297,
      1802195444,
      476864866,
      2238001368,
      4066508878,
      1812370925,
      453092731,
      2181625025,
      4111451223,
      1706088902,
      314042704,
      2344532202,
      4240017532,
      1658658271,
      366619977,
      2362670323,
      4224994405,
      1303535960,
      984961486,
      2747007092,
      3569037538,
      1256170817,
      1037604311,
      2765210733,
      3554079995,
      1131014506,
      879679996,
      2909243462,
      3663771856,
      1141124467,
      855842277,
      2852801631,
      3708648649,
      1342533948,
      654459306,
      3188396048,
      3373015174,
      1466479909,
      544179635,
      3110523913,
      3462522015,
      1591671054,
      702138776,
      2966460450,
      3352799412,
      1504918807,
      783551873,
      3082640443,
      3233442989,
      3988292384,
      2596254646,
      62317068,
      1957810842,
      3939845945,
      2647816111,
      81470997,
      1943803523,
      3814918930,
      2489596804,
      225274430,
      2053790376,
      3826175755,
      2466906013,
      167816743,
      2097651377,
      4027552580,
      2265490386,
      503444072,
      1762050814,
      4150417245,
      2154129355,
      426522225,
      1852507879,
      4275313526,
      2312317920,
      282753626,
      1742555852,
      4189708143,
      2394877945,
      397917763,
      1622183637,
      3604390888,
      2714866558,
      953729732,
      1340076626,
      3518719985,
      2797360999,
      1068828381,
      1219638859,
      3624741850,
      2936675148,
      906185462,
      1090812512,
      3747672003,
      2825379669,
      829329135,
      1181335161,
      3412177804,
      3160834842,
      628085408,
      1382605366,
      3423369109,
      3138078467,
      570562233,
      1426400815,
      3317316542,
      2998733608,
      733239954,
      1555261956,
      3268935591,
      3050360625,
      752459403,
      1541320221,
      2607071920,
      3965973030,
      1969922972,
      40735498,
      2617837225,
      3943577151,
      1913087877,
      83908371,
      2512341634,
      3803740692,
      2075208622,
      213261112,
      2463272603,
      3855990285,
      2094854071,
      198958881,
      2262029012,
      4057260610,
      1759359992,
      534414190,
      2176718541,
      4139329115,
      1873836001,
      414664567,
      2282248934,
      4279200368,
      1711684554,
      285281116,
      2405801727,
      4167216745,
      1634467795,
      376229701,
      2685067896,
      3608007406,
      1308918612,
      956543938,
      2808555105,
      3495958263,
      1231636301,
      1047427035,
      2932959818,
      3654703836,
      1088359270,
      936918e3,
      2847714899,
      3736837829,
      1202900863,
      817233897,
      3183342108,
      3401237130,
      1404277552,
      615818150,
      3134207493,
      3453421203,
      1423857449,
      601450431,
      3009837614,
      3294710456,
      1567103746,
      711928724,
      3020668471,
      3272380065,
      1510334235,
      755167117
    ];
    var lookupTable = (0, util_1.uint32ArrayFrom)(a_lookUpTable);
    var aws_crc32_1 = require_aws_crc32();
    Object.defineProperty(exports, "AwsCrc32", { enumerable: true, get: function() {
      return aws_crc32_1.AwsCrc32;
    } });
  }
});
var require_util = __commonJS({
  "node_modules/.pnpm/fast-xml-parser@4.2.5/node_modules/fast-xml-parser/src/util.js"(exports) {
    var nameStartChar = ":A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD";
    var nameChar = nameStartChar + "\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040";
    var nameRegexp = "[" + nameStartChar + "][" + nameChar + "]*";
    var regexName = new RegExp("^" + nameRegexp + "$");
    var getAllMatches = function(string, regex) {
      const matches = [];
      let match = regex.exec(string);
      while (match) {
        const allmatches = [];
        allmatches.startIndex = regex.lastIndex - match[0].length;
        const len = match.length;
        for (let index = 0; index < len; index++) {
          allmatches.push(match[index]);
        }
        matches.push(allmatches);
        match = regex.exec(string);
      }
      return matches;
    };
    var isName = function(string) {
      const match = regexName.exec(string);
      return !(match === null || typeof match === "undefined");
    };
    exports.isExist = function(v3) {
      return typeof v3 !== "undefined";
    };
    exports.isEmptyObject = function(obj) {
      return Object.keys(obj).length === 0;
    };
    exports.merge = function(target, a5, arrayMode) {
      if (a5) {
        const keys = Object.keys(a5);
        const len = keys.length;
        for (let i5 = 0; i5 < len; i5++) {
          if (arrayMode === "strict") {
            target[keys[i5]] = [a5[keys[i5]]];
          } else {
            target[keys[i5]] = a5[keys[i5]];
          }
        }
      }
    };
    exports.getValue = function(v3) {
      if (exports.isExist(v3)) {
        return v3;
      } else {
        return "";
      }
    };
    exports.isName = isName;
    exports.getAllMatches = getAllMatches;
    exports.nameRegexp = nameRegexp;
  }
});
var require_validator = __commonJS({
  "node_modules/.pnpm/fast-xml-parser@4.2.5/node_modules/fast-xml-parser/src/validator.js"(exports) {
    var util = require_util();
    var defaultOptions = {
      allowBooleanAttributes: false,
      //A tag can have attributes without any value
      unpairedTags: []
    };
    exports.validate = function(xmlData, options) {
      options = Object.assign({}, defaultOptions, options);
      const tags = [];
      let tagFound = false;
      let reachedRoot = false;
      if (xmlData[0] === "\uFEFF") {
        xmlData = xmlData.substr(1);
      }
      for (let i5 = 0; i5 < xmlData.length; i5++) {
        if (xmlData[i5] === "<" && xmlData[i5 + 1] === "?") {
          i5 += 2;
          i5 = readPI(xmlData, i5);
          if (i5.err) return i5;
        } else if (xmlData[i5] === "<") {
          let tagStartPos = i5;
          i5++;
          if (xmlData[i5] === "!") {
            i5 = readCommentAndCDATA(xmlData, i5);
            continue;
          } else {
            let closingTag = false;
            if (xmlData[i5] === "/") {
              closingTag = true;
              i5++;
            }
            let tagName = "";
            for (; i5 < xmlData.length && xmlData[i5] !== ">" && xmlData[i5] !== " " && xmlData[i5] !== "	" && xmlData[i5] !== "\n" && xmlData[i5] !== "\r"; i5++) {
              tagName += xmlData[i5];
            }
            tagName = tagName.trim();
            if (tagName[tagName.length - 1] === "/") {
              tagName = tagName.substring(0, tagName.length - 1);
              i5--;
            }
            if (!validateTagName(tagName)) {
              let msg;
              if (tagName.trim().length === 0) {
                msg = "Invalid space after '<'.";
              } else {
                msg = "Tag '" + tagName + "' is an invalid name.";
              }
              return getErrorObject("InvalidTag", msg, getLineNumberForPosition(xmlData, i5));
            }
            const result = readAttributeStr(xmlData, i5);
            if (result === false) {
              return getErrorObject("InvalidAttr", "Attributes for '" + tagName + "' have open quote.", getLineNumberForPosition(xmlData, i5));
            }
            let attrStr = result.value;
            i5 = result.index;
            if (attrStr[attrStr.length - 1] === "/") {
              const attrStrStart = i5 - attrStr.length;
              attrStr = attrStr.substring(0, attrStr.length - 1);
              const isValid = validateAttributeString(attrStr, options);
              if (isValid === true) {
                tagFound = true;
              } else {
                return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, attrStrStart + isValid.err.line));
              }
            } else if (closingTag) {
              if (!result.tagClosed) {
                return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' doesn't have proper closing.", getLineNumberForPosition(xmlData, i5));
              } else if (attrStr.trim().length > 0) {
                return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' can't have attributes or invalid starting.", getLineNumberForPosition(xmlData, tagStartPos));
              } else {
                const otg = tags.pop();
                if (tagName !== otg.tagName) {
                  let openPos = getLineNumberForPosition(xmlData, otg.tagStartPos);
                  return getErrorObject(
                    "InvalidTag",
                    "Expected closing tag '" + otg.tagName + "' (opened in line " + openPos.line + ", col " + openPos.col + ") instead of closing tag '" + tagName + "'.",
                    getLineNumberForPosition(xmlData, tagStartPos)
                  );
                }
                if (tags.length == 0) {
                  reachedRoot = true;
                }
              }
            } else {
              const isValid = validateAttributeString(attrStr, options);
              if (isValid !== true) {
                return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, i5 - attrStr.length + isValid.err.line));
              }
              if (reachedRoot === true) {
                return getErrorObject("InvalidXml", "Multiple possible root nodes found.", getLineNumberForPosition(xmlData, i5));
              } else if (options.unpairedTags.indexOf(tagName) !== -1) ;
              else {
                tags.push({ tagName, tagStartPos });
              }
              tagFound = true;
            }
            for (i5++; i5 < xmlData.length; i5++) {
              if (xmlData[i5] === "<") {
                if (xmlData[i5 + 1] === "!") {
                  i5++;
                  i5 = readCommentAndCDATA(xmlData, i5);
                  continue;
                } else if (xmlData[i5 + 1] === "?") {
                  i5 = readPI(xmlData, ++i5);
                  if (i5.err) return i5;
                } else {
                  break;
                }
              } else if (xmlData[i5] === "&") {
                const afterAmp = validateAmpersand(xmlData, i5);
                if (afterAmp == -1)
                  return getErrorObject("InvalidChar", "char '&' is not expected.", getLineNumberForPosition(xmlData, i5));
                i5 = afterAmp;
              } else {
                if (reachedRoot === true && !isWhiteSpace(xmlData[i5])) {
                  return getErrorObject("InvalidXml", "Extra text at the end", getLineNumberForPosition(xmlData, i5));
                }
              }
            }
            if (xmlData[i5] === "<") {
              i5--;
            }
          }
        } else {
          if (isWhiteSpace(xmlData[i5])) {
            continue;
          }
          return getErrorObject("InvalidChar", "char '" + xmlData[i5] + "' is not expected.", getLineNumberForPosition(xmlData, i5));
        }
      }
      if (!tagFound) {
        return getErrorObject("InvalidXml", "Start tag expected.", 1);
      } else if (tags.length == 1) {
        return getErrorObject("InvalidTag", "Unclosed tag '" + tags[0].tagName + "'.", getLineNumberForPosition(xmlData, tags[0].tagStartPos));
      } else if (tags.length > 0) {
        return getErrorObject("InvalidXml", "Invalid '" + JSON.stringify(tags.map((t3) => t3.tagName), null, 4).replace(/\r?\n/g, "") + "' found.", { line: 1, col: 1 });
      }
      return true;
    };
    function isWhiteSpace(char) {
      return char === " " || char === "	" || char === "\n" || char === "\r";
    }
    function readPI(xmlData, i5) {
      const start = i5;
      for (; i5 < xmlData.length; i5++) {
        if (xmlData[i5] == "?" || xmlData[i5] == " ") {
          const tagname = xmlData.substr(start, i5 - start);
          if (i5 > 5 && tagname === "xml") {
            return getErrorObject("InvalidXml", "XML declaration allowed only at the start of the document.", getLineNumberForPosition(xmlData, i5));
          } else if (xmlData[i5] == "?" && xmlData[i5 + 1] == ">") {
            i5++;
            break;
          } else {
            continue;
          }
        }
      }
      return i5;
    }
    function readCommentAndCDATA(xmlData, i5) {
      if (xmlData.length > i5 + 5 && xmlData[i5 + 1] === "-" && xmlData[i5 + 2] === "-") {
        for (i5 += 3; i5 < xmlData.length; i5++) {
          if (xmlData[i5] === "-" && xmlData[i5 + 1] === "-" && xmlData[i5 + 2] === ">") {
            i5 += 2;
            break;
          }
        }
      } else if (xmlData.length > i5 + 8 && xmlData[i5 + 1] === "D" && xmlData[i5 + 2] === "O" && xmlData[i5 + 3] === "C" && xmlData[i5 + 4] === "T" && xmlData[i5 + 5] === "Y" && xmlData[i5 + 6] === "P" && xmlData[i5 + 7] === "E") {
        let angleBracketsCount = 1;
        for (i5 += 8; i5 < xmlData.length; i5++) {
          if (xmlData[i5] === "<") {
            angleBracketsCount++;
          } else if (xmlData[i5] === ">") {
            angleBracketsCount--;
            if (angleBracketsCount === 0) {
              break;
            }
          }
        }
      } else if (xmlData.length > i5 + 9 && xmlData[i5 + 1] === "[" && xmlData[i5 + 2] === "C" && xmlData[i5 + 3] === "D" && xmlData[i5 + 4] === "A" && xmlData[i5 + 5] === "T" && xmlData[i5 + 6] === "A" && xmlData[i5 + 7] === "[") {
        for (i5 += 8; i5 < xmlData.length; i5++) {
          if (xmlData[i5] === "]" && xmlData[i5 + 1] === "]" && xmlData[i5 + 2] === ">") {
            i5 += 2;
            break;
          }
        }
      }
      return i5;
    }
    var doubleQuote = '"';
    var singleQuote = "'";
    function readAttributeStr(xmlData, i5) {
      let attrStr = "";
      let startChar = "";
      let tagClosed = false;
      for (; i5 < xmlData.length; i5++) {
        if (xmlData[i5] === doubleQuote || xmlData[i5] === singleQuote) {
          if (startChar === "") {
            startChar = xmlData[i5];
          } else if (startChar !== xmlData[i5]) ;
          else {
            startChar = "";
          }
        } else if (xmlData[i5] === ">") {
          if (startChar === "") {
            tagClosed = true;
            break;
          }
        }
        attrStr += xmlData[i5];
      }
      if (startChar !== "") {
        return false;
      }
      return {
        value: attrStr,
        index: i5,
        tagClosed
      };
    }
    var validAttrStrRegxp = new RegExp(`(\\s*)([^\\s=]+)(\\s*=)?(\\s*(['"])(([\\s\\S])*?)\\5)?`, "g");
    function validateAttributeString(attrStr, options) {
      const matches = util.getAllMatches(attrStr, validAttrStrRegxp);
      const attrNames = {};
      for (let i5 = 0; i5 < matches.length; i5++) {
        if (matches[i5][1].length === 0) {
          return getErrorObject("InvalidAttr", "Attribute '" + matches[i5][2] + "' has no space in starting.", getPositionFromMatch(matches[i5]));
        } else if (matches[i5][3] !== void 0 && matches[i5][4] === void 0) {
          return getErrorObject("InvalidAttr", "Attribute '" + matches[i5][2] + "' is without value.", getPositionFromMatch(matches[i5]));
        } else if (matches[i5][3] === void 0 && !options.allowBooleanAttributes) {
          return getErrorObject("InvalidAttr", "boolean attribute '" + matches[i5][2] + "' is not allowed.", getPositionFromMatch(matches[i5]));
        }
        const attrName = matches[i5][2];
        if (!validateAttrName(attrName)) {
          return getErrorObject("InvalidAttr", "Attribute '" + attrName + "' is an invalid name.", getPositionFromMatch(matches[i5]));
        }
        if (!attrNames.hasOwnProperty(attrName)) {
          attrNames[attrName] = 1;
        } else {
          return getErrorObject("InvalidAttr", "Attribute '" + attrName + "' is repeated.", getPositionFromMatch(matches[i5]));
        }
      }
      return true;
    }
    function validateNumberAmpersand(xmlData, i5) {
      let re = /\d/;
      if (xmlData[i5] === "x") {
        i5++;
        re = /[\da-fA-F]/;
      }
      for (; i5 < xmlData.length; i5++) {
        if (xmlData[i5] === ";")
          return i5;
        if (!xmlData[i5].match(re))
          break;
      }
      return -1;
    }
    function validateAmpersand(xmlData, i5) {
      i5++;
      if (xmlData[i5] === ";")
        return -1;
      if (xmlData[i5] === "#") {
        i5++;
        return validateNumberAmpersand(xmlData, i5);
      }
      let count = 0;
      for (; i5 < xmlData.length; i5++, count++) {
        if (xmlData[i5].match(/\w/) && count < 20)
          continue;
        if (xmlData[i5] === ";")
          break;
        return -1;
      }
      return i5;
    }
    function getErrorObject(code, message, lineNumber) {
      return {
        err: {
          code,
          msg: message,
          line: lineNumber.line || lineNumber,
          col: lineNumber.col
        }
      };
    }
    function validateAttrName(attrName) {
      return util.isName(attrName);
    }
    function validateTagName(tagname) {
      return util.isName(tagname);
    }
    function getLineNumberForPosition(xmlData, index) {
      const lines = xmlData.substring(0, index).split(/\r?\n/);
      return {
        line: lines.length,
        // column number is last line's length + 1, because column numbering starts at 1:
        col: lines[lines.length - 1].length + 1
      };
    }
    function getPositionFromMatch(match) {
      return match.startIndex + match[1].length;
    }
  }
});
var require_OptionsBuilder = __commonJS({
  "node_modules/.pnpm/fast-xml-parser@4.2.5/node_modules/fast-xml-parser/src/xmlparser/OptionsBuilder.js"(exports) {
    var defaultOptions = {
      preserveOrder: false,
      attributeNamePrefix: "@_",
      attributesGroupName: false,
      textNodeName: "#text",
      ignoreAttributes: true,
      removeNSPrefix: false,
      // remove NS from tag name or attribute name if true
      allowBooleanAttributes: false,
      //a tag can have attributes without any value
      //ignoreRootElement : false,
      parseTagValue: true,
      parseAttributeValue: false,
      trimValues: true,
      //Trim string values of tag and attributes
      cdataPropName: false,
      numberParseOptions: {
        hex: true,
        leadingZeros: true,
        eNotation: true
      },
      tagValueProcessor: function(tagName, val2) {
        return val2;
      },
      attributeValueProcessor: function(attrName, val2) {
        return val2;
      },
      stopNodes: [],
      //nested tags will not be parsed even for errors
      alwaysCreateTextNode: false,
      isArray: () => false,
      commentPropName: false,
      unpairedTags: [],
      processEntities: true,
      htmlEntities: false,
      ignoreDeclaration: false,
      ignorePiTags: false,
      transformTagName: false,
      transformAttributeName: false,
      updateTag: function(tagName, jPath, attrs) {
        return tagName;
      }
      // skipEmptyListItem: false
    };
    var buildOptions = function(options) {
      return Object.assign({}, defaultOptions, options);
    };
    exports.buildOptions = buildOptions;
    exports.defaultOptions = defaultOptions;
  }
});
var require_xmlNode = __commonJS({
  "node_modules/.pnpm/fast-xml-parser@4.2.5/node_modules/fast-xml-parser/src/xmlparser/xmlNode.js"(exports, module2) {
    var XmlNode2 = class {
      constructor(tagname) {
        this.tagname = tagname;
        this.child = [];
        this[":@"] = {};
      }
      add(key, val2) {
        if (key === "__proto__") key = "#__proto__";
        this.child.push({ [key]: val2 });
      }
      addChild(node) {
        if (node.tagname === "__proto__") node.tagname = "#__proto__";
        if (node[":@"] && Object.keys(node[":@"]).length > 0) {
          this.child.push({ [node.tagname]: node.child, [":@"]: node[":@"] });
        } else {
          this.child.push({ [node.tagname]: node.child });
        }
      }
    };
    module2.exports = XmlNode2;
  }
});
var require_DocTypeReader = __commonJS({
  "node_modules/.pnpm/fast-xml-parser@4.2.5/node_modules/fast-xml-parser/src/xmlparser/DocTypeReader.js"(exports, module2) {
    var util = require_util();
    function readDocType(xmlData, i5) {
      const entities = {};
      if (xmlData[i5 + 3] === "O" && xmlData[i5 + 4] === "C" && xmlData[i5 + 5] === "T" && xmlData[i5 + 6] === "Y" && xmlData[i5 + 7] === "P" && xmlData[i5 + 8] === "E") {
        i5 = i5 + 9;
        let angleBracketsCount = 1;
        let hasBody = false, comment = false;
        let exp = "";
        for (; i5 < xmlData.length; i5++) {
          if (xmlData[i5] === "<" && !comment) {
            if (hasBody && isEntity(xmlData, i5)) {
              i5 += 7;
              [entityName, val, i5] = readEntityExp(xmlData, i5 + 1);
              if (val.indexOf("&") === -1)
                entities[validateEntityName(entityName)] = {
                  regx: RegExp(`&${entityName};`, "g"),
                  val
                };
            } else if (hasBody && isElement(xmlData, i5)) i5 += 8;
            else if (hasBody && isAttlist(xmlData, i5)) i5 += 8;
            else if (hasBody && isNotation(xmlData, i5)) i5 += 9;
            else if (isComment) comment = true;
            else throw new Error("Invalid DOCTYPE");
            angleBracketsCount++;
            exp = "";
          } else if (xmlData[i5] === ">") {
            if (comment) {
              if (xmlData[i5 - 1] === "-" && xmlData[i5 - 2] === "-") {
                comment = false;
                angleBracketsCount--;
              }
            } else {
              angleBracketsCount--;
            }
            if (angleBracketsCount === 0) {
              break;
            }
          } else if (xmlData[i5] === "[") {
            hasBody = true;
          } else {
            exp += xmlData[i5];
          }
        }
        if (angleBracketsCount !== 0) {
          throw new Error(`Unclosed DOCTYPE`);
        }
      } else {
        throw new Error(`Invalid Tag instead of DOCTYPE`);
      }
      return { entities, i: i5 };
    }
    function readEntityExp(xmlData, i5) {
      let entityName2 = "";
      for (; i5 < xmlData.length && (xmlData[i5] !== "'" && xmlData[i5] !== '"'); i5++) {
        entityName2 += xmlData[i5];
      }
      entityName2 = entityName2.trim();
      if (entityName2.indexOf(" ") !== -1) throw new Error("External entites are not supported");
      const startChar = xmlData[i5++];
      let val2 = "";
      for (; i5 < xmlData.length && xmlData[i5] !== startChar; i5++) {
        val2 += xmlData[i5];
      }
      return [entityName2, val2, i5];
    }
    function isComment(xmlData, i5) {
      if (xmlData[i5 + 1] === "!" && xmlData[i5 + 2] === "-" && xmlData[i5 + 3] === "-") return true;
      return false;
    }
    function isEntity(xmlData, i5) {
      if (xmlData[i5 + 1] === "!" && xmlData[i5 + 2] === "E" && xmlData[i5 + 3] === "N" && xmlData[i5 + 4] === "T" && xmlData[i5 + 5] === "I" && xmlData[i5 + 6] === "T" && xmlData[i5 + 7] === "Y") return true;
      return false;
    }
    function isElement(xmlData, i5) {
      if (xmlData[i5 + 1] === "!" && xmlData[i5 + 2] === "E" && xmlData[i5 + 3] === "L" && xmlData[i5 + 4] === "E" && xmlData[i5 + 5] === "M" && xmlData[i5 + 6] === "E" && xmlData[i5 + 7] === "N" && xmlData[i5 + 8] === "T") return true;
      return false;
    }
    function isAttlist(xmlData, i5) {
      if (xmlData[i5 + 1] === "!" && xmlData[i5 + 2] === "A" && xmlData[i5 + 3] === "T" && xmlData[i5 + 4] === "T" && xmlData[i5 + 5] === "L" && xmlData[i5 + 6] === "I" && xmlData[i5 + 7] === "S" && xmlData[i5 + 8] === "T") return true;
      return false;
    }
    function isNotation(xmlData, i5) {
      if (xmlData[i5 + 1] === "!" && xmlData[i5 + 2] === "N" && xmlData[i5 + 3] === "O" && xmlData[i5 + 4] === "T" && xmlData[i5 + 5] === "A" && xmlData[i5 + 6] === "T" && xmlData[i5 + 7] === "I" && xmlData[i5 + 8] === "O" && xmlData[i5 + 9] === "N") return true;
      return false;
    }
    function validateEntityName(name) {
      if (util.isName(name))
        return name;
      else
        throw new Error(`Invalid entity name ${name}`);
    }
    module2.exports = readDocType;
  }
});
var require_strnum = __commonJS({
  "node_modules/.pnpm/strnum@1.0.5/node_modules/strnum/strnum.js"(exports, module2) {
    var hexRegex = /^[-+]?0x[a-fA-F0-9]+$/;
    var numRegex = /^([\-\+])?(0*)(\.[0-9]+([eE]\-?[0-9]+)?|[0-9]+(\.[0-9]+([eE]\-?[0-9]+)?)?)$/;
    if (!Number.parseInt && window.parseInt) {
      Number.parseInt = window.parseInt;
    }
    if (!Number.parseFloat && window.parseFloat) {
      Number.parseFloat = window.parseFloat;
    }
    var consider = {
      hex: true,
      leadingZeros: true,
      decimalPoint: ".",
      eNotation: true
      //skipLike: /regex/
    };
    function toNumber(str, options = {}) {
      options = Object.assign({}, consider, options);
      if (!str || typeof str !== "string") return str;
      let trimmedStr = str.trim();
      if (options.skipLike !== void 0 && options.skipLike.test(trimmedStr)) return str;
      else if (options.hex && hexRegex.test(trimmedStr)) {
        return Number.parseInt(trimmedStr, 16);
      } else {
        const match = numRegex.exec(trimmedStr);
        if (match) {
          const sign = match[1];
          const leadingZeros = match[2];
          let numTrimmedByZeros = trimZeros(match[3]);
          const eNotation = match[4] || match[6];
          if (!options.leadingZeros && leadingZeros.length > 0 && sign && trimmedStr[2] !== ".") return str;
          else if (!options.leadingZeros && leadingZeros.length > 0 && !sign && trimmedStr[1] !== ".") return str;
          else {
            const num = Number(trimmedStr);
            const numStr = "" + num;
            if (numStr.search(/[eE]/) !== -1) {
              if (options.eNotation) return num;
              else return str;
            } else if (eNotation) {
              if (options.eNotation) return num;
              else return str;
            } else if (trimmedStr.indexOf(".") !== -1) {
              if (numStr === "0" && numTrimmedByZeros === "") return num;
              else if (numStr === numTrimmedByZeros) return num;
              else if (sign && numStr === "-" + numTrimmedByZeros) return num;
              else return str;
            }
            if (leadingZeros) {
              if (numTrimmedByZeros === numStr) return num;
              else if (sign + numTrimmedByZeros === numStr) return num;
              else return str;
            }
            if (trimmedStr === numStr) return num;
            else if (trimmedStr === sign + numStr) return num;
            return str;
          }
        } else {
          return str;
        }
      }
    }
    function trimZeros(numStr) {
      if (numStr && numStr.indexOf(".") !== -1) {
        numStr = numStr.replace(/0+$/, "");
        if (numStr === ".") numStr = "0";
        else if (numStr[0] === ".") numStr = "0" + numStr;
        else if (numStr[numStr.length - 1] === ".") numStr = numStr.substr(0, numStr.length - 1);
        return numStr;
      }
      return numStr;
    }
    module2.exports = toNumber;
  }
});
var require_OrderedObjParser = __commonJS({
  "node_modules/.pnpm/fast-xml-parser@4.2.5/node_modules/fast-xml-parser/src/xmlparser/OrderedObjParser.js"(exports, module2) {
    var util = require_util();
    var xmlNode = require_xmlNode();
    var readDocType = require_DocTypeReader();
    var toNumber = require_strnum();
    "<((!\\[CDATA\\[([\\s\\S]*?)(]]>))|((NAME:)?(NAME))([^>]*)>|((\\/)(NAME)\\s*>))([^<]*)".replace(/NAME/g, util.nameRegexp);
    var OrderedObjParser = class {
      constructor(options) {
        this.options = options;
        this.currentNode = null;
        this.tagsNodeStack = [];
        this.docTypeEntities = {};
        this.lastEntities = {
          "apos": { regex: /&(apos|#39|#x27);/g, val: "'" },
          "gt": { regex: /&(gt|#62|#x3E);/g, val: ">" },
          "lt": { regex: /&(lt|#60|#x3C);/g, val: "<" },
          "quot": { regex: /&(quot|#34|#x22);/g, val: '"' }
        };
        this.ampEntity = { regex: /&(amp|#38|#x26);/g, val: "&" };
        this.htmlEntities = {
          "space": { regex: /&(nbsp|#160);/g, val: " " },
          // "lt" : { regex: /&(lt|#60);/g, val: "<" },
          // "gt" : { regex: /&(gt|#62);/g, val: ">" },
          // "amp" : { regex: /&(amp|#38);/g, val: "&" },
          // "quot" : { regex: /&(quot|#34);/g, val: "\"" },
          // "apos" : { regex: /&(apos|#39);/g, val: "'" },
          "cent": { regex: /&(cent|#162);/g, val: "¢" },
          "pound": { regex: /&(pound|#163);/g, val: "£" },
          "yen": { regex: /&(yen|#165);/g, val: "¥" },
          "euro": { regex: /&(euro|#8364);/g, val: "€" },
          "copyright": { regex: /&(copy|#169);/g, val: "©" },
          "reg": { regex: /&(reg|#174);/g, val: "®" },
          "inr": { regex: /&(inr|#8377);/g, val: "₹" }
        };
        this.addExternalEntities = addExternalEntities;
        this.parseXml = parseXml;
        this.parseTextData = parseTextData;
        this.resolveNameSpace = resolveNameSpace;
        this.buildAttributesMap = buildAttributesMap;
        this.isItStopNode = isItStopNode;
        this.replaceEntitiesValue = replaceEntitiesValue;
        this.readStopNodeData = readStopNodeData;
        this.saveTextToParentTag = saveTextToParentTag;
        this.addChild = addChild;
      }
    };
    function addExternalEntities(externalEntities) {
      const entKeys = Object.keys(externalEntities);
      for (let i5 = 0; i5 < entKeys.length; i5++) {
        const ent = entKeys[i5];
        this.lastEntities[ent] = {
          regex: new RegExp("&" + ent + ";", "g"),
          val: externalEntities[ent]
        };
      }
    }
    function parseTextData(val2, tagName, jPath, dontTrim, hasAttributes, isLeafNode, escapeEntities) {
      if (val2 !== void 0) {
        if (this.options.trimValues && !dontTrim) {
          val2 = val2.trim();
        }
        if (val2.length > 0) {
          if (!escapeEntities) val2 = this.replaceEntitiesValue(val2);
          const newval = this.options.tagValueProcessor(tagName, val2, jPath, hasAttributes, isLeafNode);
          if (newval === null || newval === void 0) {
            return val2;
          } else if (typeof newval !== typeof val2 || newval !== val2) {
            return newval;
          } else if (this.options.trimValues) {
            return parseValue(val2, this.options.parseTagValue, this.options.numberParseOptions);
          } else {
            const trimmedVal = val2.trim();
            if (trimmedVal === val2) {
              return parseValue(val2, this.options.parseTagValue, this.options.numberParseOptions);
            } else {
              return val2;
            }
          }
        }
      }
    }
    function resolveNameSpace(tagname) {
      if (this.options.removeNSPrefix) {
        const tags = tagname.split(":");
        const prefix = tagname.charAt(0) === "/" ? "/" : "";
        if (tags[0] === "xmlns") {
          return "";
        }
        if (tags.length === 2) {
          tagname = prefix + tags[1];
        }
      }
      return tagname;
    }
    var attrsRegx = new RegExp(`([^\\s=]+)\\s*(=\\s*(['"])([\\s\\S]*?)\\3)?`, "gm");
    function buildAttributesMap(attrStr, jPath, tagName) {
      if (!this.options.ignoreAttributes && typeof attrStr === "string") {
        const matches = util.getAllMatches(attrStr, attrsRegx);
        const len = matches.length;
        const attrs = {};
        for (let i5 = 0; i5 < len; i5++) {
          const attrName = this.resolveNameSpace(matches[i5][1]);
          let oldVal = matches[i5][4];
          let aName = this.options.attributeNamePrefix + attrName;
          if (attrName.length) {
            if (this.options.transformAttributeName) {
              aName = this.options.transformAttributeName(aName);
            }
            if (aName === "__proto__") aName = "#__proto__";
            if (oldVal !== void 0) {
              if (this.options.trimValues) {
                oldVal = oldVal.trim();
              }
              oldVal = this.replaceEntitiesValue(oldVal);
              const newVal = this.options.attributeValueProcessor(attrName, oldVal, jPath);
              if (newVal === null || newVal === void 0) {
                attrs[aName] = oldVal;
              } else if (typeof newVal !== typeof oldVal || newVal !== oldVal) {
                attrs[aName] = newVal;
              } else {
                attrs[aName] = parseValue(
                  oldVal,
                  this.options.parseAttributeValue,
                  this.options.numberParseOptions
                );
              }
            } else if (this.options.allowBooleanAttributes) {
              attrs[aName] = true;
            }
          }
        }
        if (!Object.keys(attrs).length) {
          return;
        }
        if (this.options.attributesGroupName) {
          const attrCollection = {};
          attrCollection[this.options.attributesGroupName] = attrs;
          return attrCollection;
        }
        return attrs;
      }
    }
    var parseXml = function(xmlData) {
      xmlData = xmlData.replace(/\r\n?/g, "\n");
      const xmlObj = new xmlNode("!xml");
      let currentNode = xmlObj;
      let textData = "";
      let jPath = "";
      for (let i5 = 0; i5 < xmlData.length; i5++) {
        const ch2 = xmlData[i5];
        if (ch2 === "<") {
          if (xmlData[i5 + 1] === "/") {
            const closeIndex = findClosingIndex(xmlData, ">", i5, "Closing Tag is not closed.");
            let tagName = xmlData.substring(i5 + 2, closeIndex).trim();
            if (this.options.removeNSPrefix) {
              const colonIndex = tagName.indexOf(":");
              if (colonIndex !== -1) {
                tagName = tagName.substr(colonIndex + 1);
              }
            }
            if (this.options.transformTagName) {
              tagName = this.options.transformTagName(tagName);
            }
            if (currentNode) {
              textData = this.saveTextToParentTag(textData, currentNode, jPath);
            }
            const lastTagName = jPath.substring(jPath.lastIndexOf(".") + 1);
            if (tagName && this.options.unpairedTags.indexOf(tagName) !== -1) {
              throw new Error(`Unpaired tag can not be used as closing tag: </${tagName}>`);
            }
            let propIndex = 0;
            if (lastTagName && this.options.unpairedTags.indexOf(lastTagName) !== -1) {
              propIndex = jPath.lastIndexOf(".", jPath.lastIndexOf(".") - 1);
              this.tagsNodeStack.pop();
            } else {
              propIndex = jPath.lastIndexOf(".");
            }
            jPath = jPath.substring(0, propIndex);
            currentNode = this.tagsNodeStack.pop();
            textData = "";
            i5 = closeIndex;
          } else if (xmlData[i5 + 1] === "?") {
            let tagData = readTagExp(xmlData, i5, false, "?>");
            if (!tagData) throw new Error("Pi Tag is not closed.");
            textData = this.saveTextToParentTag(textData, currentNode, jPath);
            if (this.options.ignoreDeclaration && tagData.tagName === "?xml" || this.options.ignorePiTags) ;
            else {
              const childNode = new xmlNode(tagData.tagName);
              childNode.add(this.options.textNodeName, "");
              if (tagData.tagName !== tagData.tagExp && tagData.attrExpPresent) {
                childNode[":@"] = this.buildAttributesMap(tagData.tagExp, jPath, tagData.tagName);
              }
              this.addChild(currentNode, childNode, jPath);
            }
            i5 = tagData.closeIndex + 1;
          } else if (xmlData.substr(i5 + 1, 3) === "!--") {
            const endIndex = findClosingIndex(xmlData, "-->", i5 + 4, "Comment is not closed.");
            if (this.options.commentPropName) {
              const comment = xmlData.substring(i5 + 4, endIndex - 2);
              textData = this.saveTextToParentTag(textData, currentNode, jPath);
              currentNode.add(this.options.commentPropName, [{ [this.options.textNodeName]: comment }]);
            }
            i5 = endIndex;
          } else if (xmlData.substr(i5 + 1, 2) === "!D") {
            const result = readDocType(xmlData, i5);
            this.docTypeEntities = result.entities;
            i5 = result.i;
          } else if (xmlData.substr(i5 + 1, 2) === "![") {
            const closeIndex = findClosingIndex(xmlData, "]]>", i5, "CDATA is not closed.") - 2;
            const tagExp = xmlData.substring(i5 + 9, closeIndex);
            textData = this.saveTextToParentTag(textData, currentNode, jPath);
            if (this.options.cdataPropName) {
              currentNode.add(this.options.cdataPropName, [{ [this.options.textNodeName]: tagExp }]);
            } else {
              let val2 = this.parseTextData(tagExp, currentNode.tagname, jPath, true, false, true);
              if (val2 == void 0) val2 = "";
              currentNode.add(this.options.textNodeName, val2);
            }
            i5 = closeIndex + 2;
          } else {
            let result = readTagExp(xmlData, i5, this.options.removeNSPrefix);
            let tagName = result.tagName;
            let tagExp = result.tagExp;
            let attrExpPresent = result.attrExpPresent;
            let closeIndex = result.closeIndex;
            if (this.options.transformTagName) {
              tagName = this.options.transformTagName(tagName);
            }
            if (currentNode && textData) {
              if (currentNode.tagname !== "!xml") {
                textData = this.saveTextToParentTag(textData, currentNode, jPath, false);
              }
            }
            const lastTag = currentNode;
            if (lastTag && this.options.unpairedTags.indexOf(lastTag.tagname) !== -1) {
              currentNode = this.tagsNodeStack.pop();
              jPath = jPath.substring(0, jPath.lastIndexOf("."));
            }
            if (tagName !== xmlObj.tagname) {
              jPath += jPath ? "." + tagName : tagName;
            }
            if (this.isItStopNode(this.options.stopNodes, jPath, tagName)) {
              let tagContent = "";
              if (tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1) {
                i5 = result.closeIndex;
              } else if (this.options.unpairedTags.indexOf(tagName) !== -1) {
                i5 = result.closeIndex;
              } else {
                const result2 = this.readStopNodeData(xmlData, tagName, closeIndex + 1);
                if (!result2) throw new Error(`Unexpected end of ${tagName}`);
                i5 = result2.i;
                tagContent = result2.tagContent;
              }
              const childNode = new xmlNode(tagName);
              if (tagName !== tagExp && attrExpPresent) {
                childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
              }
              if (tagContent) {
                tagContent = this.parseTextData(tagContent, tagName, jPath, true, attrExpPresent, true, true);
              }
              jPath = jPath.substr(0, jPath.lastIndexOf("."));
              childNode.add(this.options.textNodeName, tagContent);
              this.addChild(currentNode, childNode, jPath);
            } else {
              if (tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1) {
                if (tagName[tagName.length - 1] === "/") {
                  tagName = tagName.substr(0, tagName.length - 1);
                  tagExp = tagName;
                } else {
                  tagExp = tagExp.substr(0, tagExp.length - 1);
                }
                if (this.options.transformTagName) {
                  tagName = this.options.transformTagName(tagName);
                }
                const childNode = new xmlNode(tagName);
                if (tagName !== tagExp && attrExpPresent) {
                  childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
                }
                this.addChild(currentNode, childNode, jPath);
                jPath = jPath.substr(0, jPath.lastIndexOf("."));
              } else {
                const childNode = new xmlNode(tagName);
                this.tagsNodeStack.push(currentNode);
                if (tagName !== tagExp && attrExpPresent) {
                  childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
                }
                this.addChild(currentNode, childNode, jPath);
                currentNode = childNode;
              }
              textData = "";
              i5 = closeIndex;
            }
          }
        } else {
          textData += xmlData[i5];
        }
      }
      return xmlObj.child;
    };
    function addChild(currentNode, childNode, jPath) {
      const result = this.options.updateTag(childNode.tagname, jPath, childNode[":@"]);
      if (result === false) ;
      else if (typeof result === "string") {
        childNode.tagname = result;
        currentNode.addChild(childNode);
      } else {
        currentNode.addChild(childNode);
      }
    }
    var replaceEntitiesValue = function(val2) {
      if (this.options.processEntities) {
        for (let entityName2 in this.docTypeEntities) {
          const entity = this.docTypeEntities[entityName2];
          val2 = val2.replace(entity.regx, entity.val);
        }
        for (let entityName2 in this.lastEntities) {
          const entity = this.lastEntities[entityName2];
          val2 = val2.replace(entity.regex, entity.val);
        }
        if (this.options.htmlEntities) {
          for (let entityName2 in this.htmlEntities) {
            const entity = this.htmlEntities[entityName2];
            val2 = val2.replace(entity.regex, entity.val);
          }
        }
        val2 = val2.replace(this.ampEntity.regex, this.ampEntity.val);
      }
      return val2;
    };
    function saveTextToParentTag(textData, currentNode, jPath, isLeafNode) {
      if (textData) {
        if (isLeafNode === void 0) isLeafNode = Object.keys(currentNode.child).length === 0;
        textData = this.parseTextData(
          textData,
          currentNode.tagname,
          jPath,
          false,
          currentNode[":@"] ? Object.keys(currentNode[":@"]).length !== 0 : false,
          isLeafNode
        );
        if (textData !== void 0 && textData !== "")
          currentNode.add(this.options.textNodeName, textData);
        textData = "";
      }
      return textData;
    }
    function isItStopNode(stopNodes, jPath, currentTagName) {
      const allNodesExp = "*." + currentTagName;
      for (const stopNodePath in stopNodes) {
        const stopNodeExp = stopNodes[stopNodePath];
        if (allNodesExp === stopNodeExp || jPath === stopNodeExp) return true;
      }
      return false;
    }
    function tagExpWithClosingIndex(xmlData, i5, closingChar = ">") {
      let attrBoundary;
      let tagExp = "";
      for (let index = i5; index < xmlData.length; index++) {
        let ch2 = xmlData[index];
        if (attrBoundary) {
          if (ch2 === attrBoundary) attrBoundary = "";
        } else if (ch2 === '"' || ch2 === "'") {
          attrBoundary = ch2;
        } else if (ch2 === closingChar[0]) {
          if (closingChar[1]) {
            if (xmlData[index + 1] === closingChar[1]) {
              return {
                data: tagExp,
                index
              };
            }
          } else {
            return {
              data: tagExp,
              index
            };
          }
        } else if (ch2 === "	") {
          ch2 = " ";
        }
        tagExp += ch2;
      }
    }
    function findClosingIndex(xmlData, str, i5, errMsg) {
      const closingIndex = xmlData.indexOf(str, i5);
      if (closingIndex === -1) {
        throw new Error(errMsg);
      } else {
        return closingIndex + str.length - 1;
      }
    }
    function readTagExp(xmlData, i5, removeNSPrefix, closingChar = ">") {
      const result = tagExpWithClosingIndex(xmlData, i5 + 1, closingChar);
      if (!result) return;
      let tagExp = result.data;
      const closeIndex = result.index;
      const separatorIndex = tagExp.search(/\s/);
      let tagName = tagExp;
      let attrExpPresent = true;
      if (separatorIndex !== -1) {
        tagName = tagExp.substr(0, separatorIndex).replace(/\s\s*$/, "");
        tagExp = tagExp.substr(separatorIndex + 1);
      }
      if (removeNSPrefix) {
        const colonIndex = tagName.indexOf(":");
        if (colonIndex !== -1) {
          tagName = tagName.substr(colonIndex + 1);
          attrExpPresent = tagName !== result.data.substr(colonIndex + 1);
        }
      }
      return {
        tagName,
        tagExp,
        closeIndex,
        attrExpPresent
      };
    }
    function readStopNodeData(xmlData, tagName, i5) {
      const startIndex = i5;
      let openTagCount = 1;
      for (; i5 < xmlData.length; i5++) {
        if (xmlData[i5] === "<") {
          if (xmlData[i5 + 1] === "/") {
            const closeIndex = findClosingIndex(xmlData, ">", i5, `${tagName} is not closed`);
            let closeTagName = xmlData.substring(i5 + 2, closeIndex).trim();
            if (closeTagName === tagName) {
              openTagCount--;
              if (openTagCount === 0) {
                return {
                  tagContent: xmlData.substring(startIndex, i5),
                  i: closeIndex
                };
              }
            }
            i5 = closeIndex;
          } else if (xmlData[i5 + 1] === "?") {
            const closeIndex = findClosingIndex(xmlData, "?>", i5 + 1, "StopNode is not closed.");
            i5 = closeIndex;
          } else if (xmlData.substr(i5 + 1, 3) === "!--") {
            const closeIndex = findClosingIndex(xmlData, "-->", i5 + 3, "StopNode is not closed.");
            i5 = closeIndex;
          } else if (xmlData.substr(i5 + 1, 2) === "![") {
            const closeIndex = findClosingIndex(xmlData, "]]>", i5, "StopNode is not closed.") - 2;
            i5 = closeIndex;
          } else {
            const tagData = readTagExp(xmlData, i5, ">");
            if (tagData) {
              const openTagName = tagData && tagData.tagName;
              if (openTagName === tagName && tagData.tagExp[tagData.tagExp.length - 1] !== "/") {
                openTagCount++;
              }
              i5 = tagData.closeIndex;
            }
          }
        }
      }
    }
    function parseValue(val2, shouldParse, options) {
      if (shouldParse && typeof val2 === "string") {
        const newval = val2.trim();
        if (newval === "true") return true;
        else if (newval === "false") return false;
        else return toNumber(val2, options);
      } else {
        if (util.isExist(val2)) {
          return val2;
        } else {
          return "";
        }
      }
    }
    module2.exports = OrderedObjParser;
  }
});
var require_node2json = __commonJS({
  "node_modules/.pnpm/fast-xml-parser@4.2.5/node_modules/fast-xml-parser/src/xmlparser/node2json.js"(exports) {
    function prettify(node, options) {
      return compress(node, options);
    }
    function compress(arr, options, jPath) {
      let text;
      const compressedObj = {};
      for (let i5 = 0; i5 < arr.length; i5++) {
        const tagObj = arr[i5];
        const property = propName(tagObj);
        let newJpath = "";
        if (jPath === void 0) newJpath = property;
        else newJpath = jPath + "." + property;
        if (property === options.textNodeName) {
          if (text === void 0) text = tagObj[property];
          else text += "" + tagObj[property];
        } else if (property === void 0) {
          continue;
        } else if (tagObj[property]) {
          let val2 = compress(tagObj[property], options, newJpath);
          const isLeaf = isLeafTag(val2, options);
          if (tagObj[":@"]) {
            assignAttributes(val2, tagObj[":@"], newJpath, options);
          } else if (Object.keys(val2).length === 1 && val2[options.textNodeName] !== void 0 && !options.alwaysCreateTextNode) {
            val2 = val2[options.textNodeName];
          } else if (Object.keys(val2).length === 0) {
            if (options.alwaysCreateTextNode) val2[options.textNodeName] = "";
            else val2 = "";
          }
          if (compressedObj[property] !== void 0 && compressedObj.hasOwnProperty(property)) {
            if (!Array.isArray(compressedObj[property])) {
              compressedObj[property] = [compressedObj[property]];
            }
            compressedObj[property].push(val2);
          } else {
            if (options.isArray(property, newJpath, isLeaf)) {
              compressedObj[property] = [val2];
            } else {
              compressedObj[property] = val2;
            }
          }
        }
      }
      if (typeof text === "string") {
        if (text.length > 0) compressedObj[options.textNodeName] = text;
      } else if (text !== void 0) compressedObj[options.textNodeName] = text;
      return compressedObj;
    }
    function propName(obj) {
      const keys = Object.keys(obj);
      for (let i5 = 0; i5 < keys.length; i5++) {
        const key = keys[i5];
        if (key !== ":@") return key;
      }
    }
    function assignAttributes(obj, attrMap, jpath, options) {
      if (attrMap) {
        const keys = Object.keys(attrMap);
        const len = keys.length;
        for (let i5 = 0; i5 < len; i5++) {
          const atrrName = keys[i5];
          if (options.isArray(atrrName, jpath + "." + atrrName, true, true)) {
            obj[atrrName] = [attrMap[atrrName]];
          } else {
            obj[atrrName] = attrMap[atrrName];
          }
        }
      }
    }
    function isLeafTag(obj, options) {
      const { textNodeName } = options;
      const propCount = Object.keys(obj).length;
      if (propCount === 0) {
        return true;
      }
      if (propCount === 1 && (obj[textNodeName] || typeof obj[textNodeName] === "boolean" || obj[textNodeName] === 0)) {
        return true;
      }
      return false;
    }
    exports.prettify = prettify;
  }
});
var require_XMLParser = __commonJS({
  "node_modules/.pnpm/fast-xml-parser@4.2.5/node_modules/fast-xml-parser/src/xmlparser/XMLParser.js"(exports, module2) {
    var { buildOptions } = require_OptionsBuilder();
    var OrderedObjParser = require_OrderedObjParser();
    var { prettify } = require_node2json();
    var validator = require_validator();
    var XMLParser3 = class {
      constructor(options) {
        this.externalEntities = {};
        this.options = buildOptions(options);
      }
      /**
       * Parse XML dats to JS object 
       * @param {string|Buffer} xmlData 
       * @param {boolean|Object} validationOption 
       */
      parse(xmlData, validationOption) {
        if (typeof xmlData === "string") ;
        else if (xmlData.toString) {
          xmlData = xmlData.toString();
        } else {
          throw new Error("XML data is accepted in String or Bytes[] form.");
        }
        if (validationOption) {
          if (validationOption === true) validationOption = {};
          const result = validator.validate(xmlData, validationOption);
          if (result !== true) {
            throw Error(`${result.err.msg}:${result.err.line}:${result.err.col}`);
          }
        }
        const orderedObjParser = new OrderedObjParser(this.options);
        orderedObjParser.addExternalEntities(this.externalEntities);
        const orderedResult = orderedObjParser.parseXml(xmlData);
        if (this.options.preserveOrder || orderedResult === void 0) return orderedResult;
        else return prettify(orderedResult, this.options);
      }
      /**
       * Add Entity which is not by default supported by this library
       * @param {string} key 
       * @param {string} value 
       */
      addEntity(key, value) {
        if (value.indexOf("&") !== -1) {
          throw new Error("Entity value can't have '&'");
        } else if (key.indexOf("&") !== -1 || key.indexOf(";") !== -1) {
          throw new Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");
        } else if (value === "&") {
          throw new Error("An entity with value '&' is not permitted");
        } else {
          this.externalEntities[key] = value;
        }
      }
    };
    module2.exports = XMLParser3;
  }
});
var require_orderedJs2Xml = __commonJS({
  "node_modules/.pnpm/fast-xml-parser@4.2.5/node_modules/fast-xml-parser/src/xmlbuilder/orderedJs2Xml.js"(exports, module2) {
    var EOL = "\n";
    function toXml(jArray, options) {
      let indentation = "";
      if (options.format && options.indentBy.length > 0) {
        indentation = EOL;
      }
      return arrToStr(jArray, options, "", indentation);
    }
    function arrToStr(arr, options, jPath, indentation) {
      let xmlStr = "";
      let isPreviousElementTag = false;
      for (let i5 = 0; i5 < arr.length; i5++) {
        const tagObj = arr[i5];
        const tagName = propName(tagObj);
        let newJPath = "";
        if (jPath.length === 0) newJPath = tagName;
        else newJPath = `${jPath}.${tagName}`;
        if (tagName === options.textNodeName) {
          let tagText = tagObj[tagName];
          if (!isStopNode(newJPath, options)) {
            tagText = options.tagValueProcessor(tagName, tagText);
            tagText = replaceEntitiesValue(tagText, options);
          }
          if (isPreviousElementTag) {
            xmlStr += indentation;
          }
          xmlStr += tagText;
          isPreviousElementTag = false;
          continue;
        } else if (tagName === options.cdataPropName) {
          if (isPreviousElementTag) {
            xmlStr += indentation;
          }
          xmlStr += `<![CDATA[${tagObj[tagName][0][options.textNodeName]}]]>`;
          isPreviousElementTag = false;
          continue;
        } else if (tagName === options.commentPropName) {
          xmlStr += indentation + `<!--${tagObj[tagName][0][options.textNodeName]}-->`;
          isPreviousElementTag = true;
          continue;
        } else if (tagName[0] === "?") {
          const attStr2 = attr_to_str(tagObj[":@"], options);
          const tempInd = tagName === "?xml" ? "" : indentation;
          let piTextNodeName = tagObj[tagName][0][options.textNodeName];
          piTextNodeName = piTextNodeName.length !== 0 ? " " + piTextNodeName : "";
          xmlStr += tempInd + `<${tagName}${piTextNodeName}${attStr2}?>`;
          isPreviousElementTag = true;
          continue;
        }
        let newIdentation = indentation;
        if (newIdentation !== "") {
          newIdentation += options.indentBy;
        }
        const attStr = attr_to_str(tagObj[":@"], options);
        const tagStart = indentation + `<${tagName}${attStr}`;
        const tagValue = arrToStr(tagObj[tagName], options, newJPath, newIdentation);
        if (options.unpairedTags.indexOf(tagName) !== -1) {
          if (options.suppressUnpairedNode) xmlStr += tagStart + ">";
          else xmlStr += tagStart + "/>";
        } else if ((!tagValue || tagValue.length === 0) && options.suppressEmptyNode) {
          xmlStr += tagStart + "/>";
        } else if (tagValue && tagValue.endsWith(">")) {
          xmlStr += tagStart + `>${tagValue}${indentation}</${tagName}>`;
        } else {
          xmlStr += tagStart + ">";
          if (tagValue && indentation !== "" && (tagValue.includes("/>") || tagValue.includes("</"))) {
            xmlStr += indentation + options.indentBy + tagValue + indentation;
          } else {
            xmlStr += tagValue;
          }
          xmlStr += `</${tagName}>`;
        }
        isPreviousElementTag = true;
      }
      return xmlStr;
    }
    function propName(obj) {
      const keys = Object.keys(obj);
      for (let i5 = 0; i5 < keys.length; i5++) {
        const key = keys[i5];
        if (key !== ":@") return key;
      }
    }
    function attr_to_str(attrMap, options) {
      let attrStr = "";
      if (attrMap && !options.ignoreAttributes) {
        for (let attr in attrMap) {
          let attrVal = options.attributeValueProcessor(attr, attrMap[attr]);
          attrVal = replaceEntitiesValue(attrVal, options);
          if (attrVal === true && options.suppressBooleanAttributes) {
            attrStr += ` ${attr.substr(options.attributeNamePrefix.length)}`;
          } else {
            attrStr += ` ${attr.substr(options.attributeNamePrefix.length)}="${attrVal}"`;
          }
        }
      }
      return attrStr;
    }
    function isStopNode(jPath, options) {
      jPath = jPath.substr(0, jPath.length - options.textNodeName.length - 1);
      let tagName = jPath.substr(jPath.lastIndexOf(".") + 1);
      for (let index in options.stopNodes) {
        if (options.stopNodes[index] === jPath || options.stopNodes[index] === "*." + tagName) return true;
      }
      return false;
    }
    function replaceEntitiesValue(textValue, options) {
      if (textValue && textValue.length > 0 && options.processEntities) {
        for (let i5 = 0; i5 < options.entities.length; i5++) {
          const entity = options.entities[i5];
          textValue = textValue.replace(entity.regex, entity.val);
        }
      }
      return textValue;
    }
    module2.exports = toXml;
  }
});
var require_json2xml = __commonJS({
  "node_modules/.pnpm/fast-xml-parser@4.2.5/node_modules/fast-xml-parser/src/xmlbuilder/json2xml.js"(exports, module2) {
    var buildFromOrderedJs = require_orderedJs2Xml();
    var defaultOptions = {
      attributeNamePrefix: "@_",
      attributesGroupName: false,
      textNodeName: "#text",
      ignoreAttributes: true,
      cdataPropName: false,
      format: false,
      indentBy: "  ",
      suppressEmptyNode: false,
      suppressUnpairedNode: true,
      suppressBooleanAttributes: true,
      tagValueProcessor: function(key, a5) {
        return a5;
      },
      attributeValueProcessor: function(attrName, a5) {
        return a5;
      },
      preserveOrder: false,
      commentPropName: false,
      unpairedTags: [],
      entities: [
        { regex: new RegExp("&", "g"), val: "&amp;" },
        //it must be on top
        { regex: new RegExp(">", "g"), val: "&gt;" },
        { regex: new RegExp("<", "g"), val: "&lt;" },
        { regex: new RegExp("'", "g"), val: "&apos;" },
        { regex: new RegExp('"', "g"), val: "&quot;" }
      ],
      processEntities: true,
      stopNodes: [],
      // transformTagName: false,
      // transformAttributeName: false,
      oneListGroup: false
    };
    function Builder(options) {
      this.options = Object.assign({}, defaultOptions, options);
      if (this.options.ignoreAttributes || this.options.attributesGroupName) {
        this.isAttribute = function() {
          return false;
        };
      } else {
        this.attrPrefixLen = this.options.attributeNamePrefix.length;
        this.isAttribute = isAttribute;
      }
      this.processTextOrObjNode = processTextOrObjNode;
      if (this.options.format) {
        this.indentate = indentate;
        this.tagEndChar = ">\n";
        this.newLine = "\n";
      } else {
        this.indentate = function() {
          return "";
        };
        this.tagEndChar = ">";
        this.newLine = "";
      }
    }
    Builder.prototype.build = function(jObj) {
      if (this.options.preserveOrder) {
        return buildFromOrderedJs(jObj, this.options);
      } else {
        if (Array.isArray(jObj) && this.options.arrayNodeName && this.options.arrayNodeName.length > 1) {
          jObj = {
            [this.options.arrayNodeName]: jObj
          };
        }
        return this.j2x(jObj, 0).val;
      }
    };
    Builder.prototype.j2x = function(jObj, level) {
      let attrStr = "";
      let val2 = "";
      for (let key in jObj) {
        if (typeof jObj[key] === "undefined") ;
        else if (jObj[key] === null) {
          if (key[0] === "?") val2 += this.indentate(level) + "<" + key + "?" + this.tagEndChar;
          else val2 += this.indentate(level) + "<" + key + "/" + this.tagEndChar;
        } else if (jObj[key] instanceof Date) {
          val2 += this.buildTextValNode(jObj[key], key, "", level);
        } else if (typeof jObj[key] !== "object") {
          const attr = this.isAttribute(key);
          if (attr) {
            attrStr += this.buildAttrPairStr(attr, "" + jObj[key]);
          } else {
            if (key === this.options.textNodeName) {
              let newval = this.options.tagValueProcessor(key, "" + jObj[key]);
              val2 += this.replaceEntitiesValue(newval);
            } else {
              val2 += this.buildTextValNode(jObj[key], key, "", level);
            }
          }
        } else if (Array.isArray(jObj[key])) {
          const arrLen = jObj[key].length;
          let listTagVal = "";
          for (let j5 = 0; j5 < arrLen; j5++) {
            const item = jObj[key][j5];
            if (typeof item === "undefined") ;
            else if (item === null) {
              if (key[0] === "?") val2 += this.indentate(level) + "<" + key + "?" + this.tagEndChar;
              else val2 += this.indentate(level) + "<" + key + "/" + this.tagEndChar;
            } else if (typeof item === "object") {
              if (this.options.oneListGroup) {
                listTagVal += this.j2x(item, level + 1).val;
              } else {
                listTagVal += this.processTextOrObjNode(item, key, level);
              }
            } else {
              listTagVal += this.buildTextValNode(item, key, "", level);
            }
          }
          if (this.options.oneListGroup) {
            listTagVal = this.buildObjectNode(listTagVal, key, "", level);
          }
          val2 += listTagVal;
        } else {
          if (this.options.attributesGroupName && key === this.options.attributesGroupName) {
            const Ks = Object.keys(jObj[key]);
            const L2 = Ks.length;
            for (let j5 = 0; j5 < L2; j5++) {
              attrStr += this.buildAttrPairStr(Ks[j5], "" + jObj[key][Ks[j5]]);
            }
          } else {
            val2 += this.processTextOrObjNode(jObj[key], key, level);
          }
        }
      }
      return { attrStr, val: val2 };
    };
    Builder.prototype.buildAttrPairStr = function(attrName, val2) {
      val2 = this.options.attributeValueProcessor(attrName, "" + val2);
      val2 = this.replaceEntitiesValue(val2);
      if (this.options.suppressBooleanAttributes && val2 === "true") {
        return " " + attrName;
      } else return " " + attrName + '="' + val2 + '"';
    };
    function processTextOrObjNode(object, key, level) {
      const result = this.j2x(object, level + 1);
      if (object[this.options.textNodeName] !== void 0 && Object.keys(object).length === 1) {
        return this.buildTextValNode(object[this.options.textNodeName], key, result.attrStr, level);
      } else {
        return this.buildObjectNode(result.val, key, result.attrStr, level);
      }
    }
    Builder.prototype.buildObjectNode = function(val2, key, attrStr, level) {
      if (val2 === "") {
        if (key[0] === "?") return this.indentate(level) + "<" + key + attrStr + "?" + this.tagEndChar;
        else {
          return this.indentate(level) + "<" + key + attrStr + this.closeTag(key) + this.tagEndChar;
        }
      } else {
        let tagEndExp = "</" + key + this.tagEndChar;
        let piClosingChar = "";
        if (key[0] === "?") {
          piClosingChar = "?";
          tagEndExp = "";
        }
        if (attrStr && val2.indexOf("<") === -1) {
          return this.indentate(level) + "<" + key + attrStr + piClosingChar + ">" + val2 + tagEndExp;
        } else if (this.options.commentPropName !== false && key === this.options.commentPropName && piClosingChar.length === 0) {
          return this.indentate(level) + `<!--${val2}-->` + this.newLine;
        } else {
          return this.indentate(level) + "<" + key + attrStr + piClosingChar + this.tagEndChar + val2 + this.indentate(level) + tagEndExp;
        }
      }
    };
    Builder.prototype.closeTag = function(key) {
      let closeTag = "";
      if (this.options.unpairedTags.indexOf(key) !== -1) {
        if (!this.options.suppressUnpairedNode) closeTag = "/";
      } else if (this.options.suppressEmptyNode) {
        closeTag = "/";
      } else {
        closeTag = `></${key}`;
      }
      return closeTag;
    };
    Builder.prototype.buildTextValNode = function(val2, key, attrStr, level) {
      if (this.options.cdataPropName !== false && key === this.options.cdataPropName) {
        return this.indentate(level) + `<![CDATA[${val2}]]>` + this.newLine;
      } else if (this.options.commentPropName !== false && key === this.options.commentPropName) {
        return this.indentate(level) + `<!--${val2}-->` + this.newLine;
      } else if (key[0] === "?") {
        return this.indentate(level) + "<" + key + attrStr + "?" + this.tagEndChar;
      } else {
        let textValue = this.options.tagValueProcessor(key, val2);
        textValue = this.replaceEntitiesValue(textValue);
        if (textValue === "") {
          return this.indentate(level) + "<" + key + attrStr + this.closeTag(key) + this.tagEndChar;
        } else {
          return this.indentate(level) + "<" + key + attrStr + ">" + textValue + "</" + key + this.tagEndChar;
        }
      }
    };
    Builder.prototype.replaceEntitiesValue = function(textValue) {
      if (textValue && textValue.length > 0 && this.options.processEntities) {
        for (let i5 = 0; i5 < this.options.entities.length; i5++) {
          const entity = this.options.entities[i5];
          textValue = textValue.replace(entity.regex, entity.val);
        }
      }
      return textValue;
    };
    function indentate(level) {
      return this.options.indentBy.repeat(level);
    }
    function isAttribute(name) {
      if (name.startsWith(this.options.attributeNamePrefix)) {
        return name.substr(this.attrPrefixLen);
      } else {
        return false;
      }
    }
    module2.exports = Builder;
  }
});
var require_fxp = __commonJS({
  "node_modules/.pnpm/fast-xml-parser@4.2.5/node_modules/fast-xml-parser/src/fxp.js"(exports, module2) {
    var validator = require_validator();
    var XMLParser3 = require_XMLParser();
    var XMLBuilder = require_json2xml();
    module2.exports = {
      XMLParser: XMLParser3,
      XMLValidator: validator,
      XMLBuilder
    };
  }
});
var require_aws_crc32c = __commonJS({
  "node_modules/.pnpm/@aws-crypto+crc32c@3.0.0/node_modules/@aws-crypto/crc32c/build/aws_crc32c.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AwsCrc32c = void 0;
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    var util_1 = require_build();
    var index_1 = require_build3();
    var AwsCrc32c2 = (
      /** @class */
      function() {
        function AwsCrc32c3() {
          this.crc32c = new index_1.Crc32c();
        }
        AwsCrc32c3.prototype.update = function(toHash) {
          if ((0, util_1.isEmptyData)(toHash))
            return;
          this.crc32c.update((0, util_1.convertToBuffer)(toHash));
        };
        AwsCrc32c3.prototype.digest = function() {
          return tslib_1.__awaiter(this, void 0, void 0, function() {
            return tslib_1.__generator(this, function(_a) {
              return [2, (0, util_1.numToUint8)(this.crc32c.digest())];
            });
          });
        };
        AwsCrc32c3.prototype.reset = function() {
          this.crc32c = new index_1.Crc32c();
        };
        return AwsCrc32c3;
      }()
    );
    exports.AwsCrc32c = AwsCrc32c2;
  }
});
var require_build3 = __commonJS({
  "node_modules/.pnpm/@aws-crypto+crc32c@3.0.0/node_modules/@aws-crypto/crc32c/build/index.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AwsCrc32c = exports.Crc32c = exports.crc32c = void 0;
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    var util_1 = require_build();
    function crc32c(data) {
      return new Crc32c().update(data).digest();
    }
    exports.crc32c = crc32c;
    var Crc32c = (
      /** @class */
      function() {
        function Crc32c2() {
          this.checksum = 4294967295;
        }
        Crc32c2.prototype.update = function(data) {
          var e_1, _a;
          try {
            for (var data_1 = tslib_1.__values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
              var byte = data_1_1.value;
              this.checksum = this.checksum >>> 8 ^ lookupTable[(this.checksum ^ byte) & 255];
            }
          } catch (e_1_1) {
            e_1 = { error: e_1_1 };
          } finally {
            try {
              if (data_1_1 && !data_1_1.done && (_a = data_1.return)) _a.call(data_1);
            } finally {
              if (e_1) throw e_1.error;
            }
          }
          return this;
        };
        Crc32c2.prototype.digest = function() {
          return (this.checksum ^ 4294967295) >>> 0;
        };
        return Crc32c2;
      }()
    );
    exports.Crc32c = Crc32c;
    var a_lookupTable = [
      0,
      4067132163,
      3778769143,
      324072436,
      3348797215,
      904991772,
      648144872,
      3570033899,
      2329499855,
      2024987596,
      1809983544,
      2575936315,
      1296289744,
      3207089363,
      2893594407,
      1578318884,
      274646895,
      3795141740,
      4049975192,
      51262619,
      3619967088,
      632279923,
      922689671,
      3298075524,
      2592579488,
      1760304291,
      2075979607,
      2312596564,
      1562183871,
      2943781820,
      3156637768,
      1313733451,
      549293790,
      3537243613,
      3246849577,
      871202090,
      3878099393,
      357341890,
      102525238,
      4101499445,
      2858735121,
      1477399826,
      1264559846,
      3107202533,
      1845379342,
      2677391885,
      2361733625,
      2125378298,
      820201905,
      3263744690,
      3520608582,
      598981189,
      4151959214,
      85089709,
      373468761,
      3827903834,
      3124367742,
      1213305469,
      1526817161,
      2842354314,
      2107672161,
      2412447074,
      2627466902,
      1861252501,
      1098587580,
      3004210879,
      2688576843,
      1378610760,
      2262928035,
      1955203488,
      1742404180,
      2511436119,
      3416409459,
      969524848,
      714683780,
      3639785095,
      205050476,
      4266873199,
      3976438427,
      526918040,
      1361435347,
      2739821008,
      2954799652,
      1114974503,
      2529119692,
      1691668175,
      2005155131,
      2247081528,
      3690758684,
      697762079,
      986182379,
      3366744552,
      476452099,
      3993867776,
      4250756596,
      255256311,
      1640403810,
      2477592673,
      2164122517,
      1922457750,
      2791048317,
      1412925310,
      1197962378,
      3037525897,
      3944729517,
      427051182,
      170179418,
      4165941337,
      746937522,
      3740196785,
      3451792453,
      1070968646,
      1905808397,
      2213795598,
      2426610938,
      1657317369,
      3053634322,
      1147748369,
      1463399397,
      2773627110,
      4215344322,
      153784257,
      444234805,
      3893493558,
      1021025245,
      3467647198,
      3722505002,
      797665321,
      2197175160,
      1889384571,
      1674398607,
      2443626636,
      1164749927,
      3070701412,
      2757221520,
      1446797203,
      137323447,
      4198817972,
      3910406976,
      461344835,
      3484808360,
      1037989803,
      781091935,
      3705997148,
      2460548119,
      1623424788,
      1939049696,
      2180517859,
      1429367560,
      2807687179,
      3020495871,
      1180866812,
      410100952,
      3927582683,
      4182430767,
      186734380,
      3756733383,
      763408580,
      1053836080,
      3434856499,
      2722870694,
      1344288421,
      1131464017,
      2971354706,
      1708204729,
      2545590714,
      2229949006,
      1988219213,
      680717673,
      3673779818,
      3383336350,
      1002577565,
      4010310262,
      493091189,
      238226049,
      4233660802,
      2987750089,
      1082061258,
      1395524158,
      2705686845,
      1972364758,
      2279892693,
      2494862625,
      1725896226,
      952904198,
      3399985413,
      3656866545,
      731699698,
      4283874585,
      222117402,
      510512622,
      3959836397,
      3280807620,
      837199303,
      582374963,
      3504198960,
      68661723,
      4135334616,
      3844915500,
      390545967,
      1230274059,
      3141532936,
      2825850620,
      1510247935,
      2395924756,
      2091215383,
      1878366691,
      2644384480,
      3553878443,
      565732008,
      854102364,
      3229815391,
      340358836,
      3861050807,
      4117890627,
      119113024,
      1493875044,
      2875275879,
      3090270611,
      1247431312,
      2660249211,
      1828433272,
      2141937292,
      2378227087,
      3811616794,
      291187481,
      34330861,
      4032846830,
      615137029,
      3603020806,
      3314634738,
      939183345,
      1776939221,
      2609017814,
      2295496738,
      2058945313,
      2926798794,
      1545135305,
      1330124605,
      3173225534,
      4084100981,
      17165430,
      307568514,
      3762199681,
      888469610,
      3332340585,
      3587147933,
      665062302,
      2042050490,
      2346497209,
      2559330125,
      1793573966,
      3190661285,
      1279665062,
      1595330642,
      2910671697
    ];
    var lookupTable = (0, util_1.uint32ArrayFrom)(a_lookupTable);
    var aws_crc32c_1 = require_aws_crc32c();
    Object.defineProperty(exports, "AwsCrc32c", { enumerable: true, get: function() {
      return aws_crc32c_1.AwsCrc32c;
    } });
  }
});
var SelectorType;
(function(SelectorType2) {
  SelectorType2["ENV"] = "env";
  SelectorType2["CONFIG"] = "shared config entry";
})(SelectorType || (SelectorType = {}));
var booleanSelector = (obj, key, type) => {
  if (!(key in obj))
    return void 0;
  if (obj[key] === "true")
    return true;
  if (obj[key] === "false")
    return false;
  throw new Error(`Cannot load ${type} "${key}". Expected "true" or "false", got ${obj[key]}.`);
};
var ENV_USE_DUALSTACK_ENDPOINT = "AWS_USE_DUALSTACK_ENDPOINT";
var CONFIG_USE_DUALSTACK_ENDPOINT = "use_dualstack_endpoint";
var NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS = {
  environmentVariableSelector: (env2) => booleanSelector(env2, ENV_USE_DUALSTACK_ENDPOINT, SelectorType.ENV),
  configFileSelector: (profile) => booleanSelector(profile, CONFIG_USE_DUALSTACK_ENDPOINT, SelectorType.CONFIG),
  default: false
};
var ENV_USE_FIPS_ENDPOINT = "AWS_USE_FIPS_ENDPOINT";
var CONFIG_USE_FIPS_ENDPOINT = "use_fips_endpoint";
var NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS = {
  environmentVariableSelector: (env2) => booleanSelector(env2, ENV_USE_FIPS_ENDPOINT, SelectorType.ENV),
  configFileSelector: (profile) => booleanSelector(profile, CONFIG_USE_FIPS_ENDPOINT, SelectorType.CONFIG),
  default: false
};
var normalizeProvider = (input) => {
  if (typeof input === "function")
    return input;
  const promisified = Promise.resolve(input);
  return () => promisified;
};
var REGION_ENV_NAME = "AWS_REGION";
var REGION_INI_NAME = "region";
var NODE_REGION_CONFIG_OPTIONS = {
  environmentVariableSelector: (env2) => env2[REGION_ENV_NAME],
  configFileSelector: (profile) => profile[REGION_INI_NAME],
  default: () => {
    throw new Error("Region is missing");
  }
};
var NODE_REGION_CONFIG_FILE_OPTIONS = {
  preferredFile: "credentials"
};
var isFipsRegion = (region) => typeof region === "string" && (region.startsWith("fips-") || region.endsWith("-fips"));
var getRealRegion = (region) => isFipsRegion(region) ? ["fips-aws-global", "aws-fips"].includes(region) ? "us-east-1" : region.replace(/fips-(dkr-|prod-)?|-fips/, "") : region;
var resolveRegionConfig = (input) => {
  const { region, useFipsEndpoint } = input;
  if (!region) {
    throw new Error("Region is missing");
  }
  return {
    ...input,
    region: async () => {
      if (typeof region === "string") {
        return getRealRegion(region);
      }
      const providedRegion = await region();
      return getRealRegion(providedRegion);
    },
    useFipsEndpoint: async () => {
      const providedRegion = typeof region === "string" ? region : await region();
      if (isFipsRegion(providedRegion)) {
        return true;
      }
      return typeof useFipsEndpoint !== "function" ? Promise.resolve(!!useFipsEndpoint) : useFipsEndpoint();
    }
  };
};
var resolveEventStreamSerdeConfig = (input) => ({
  ...input,
  eventStreamMarshaller: input.eventStreamSerdeProvider(input)
});
var FieldPosition;
(function(FieldPosition3) {
  FieldPosition3[FieldPosition3["HEADER"] = 0] = "HEADER";
  FieldPosition3[FieldPosition3["TRAILER"] = 1] = "TRAILER";
})(FieldPosition || (FieldPosition = {}));
var HttpRequest = class _HttpRequest {
  constructor(options) {
    this.method = options.method || "GET";
    this.hostname = options.hostname || "localhost";
    this.port = options.port;
    this.query = options.query || {};
    this.headers = options.headers || {};
    this.body = options.body;
    this.protocol = options.protocol ? options.protocol.slice(-1) !== ":" ? `${options.protocol}:` : options.protocol : "https:";
    this.path = options.path ? options.path.charAt(0) !== "/" ? `/${options.path}` : options.path : "/";
    this.username = options.username;
    this.password = options.password;
    this.fragment = options.fragment;
  }
  static isInstance(request2) {
    if (!request2)
      return false;
    const req = request2;
    return "method" in req && "protocol" in req && "hostname" in req && "path" in req && typeof req["query"] === "object" && typeof req["headers"] === "object";
  }
  clone() {
    const cloned = new _HttpRequest({
      ...this,
      headers: { ...this.headers }
    });
    if (cloned.query)
      cloned.query = cloneQuery(cloned.query);
    return cloned;
  }
};
function cloneQuery(query) {
  return Object.keys(query).reduce((carry, paramName) => {
    const param = query[paramName];
    return {
      ...carry,
      [paramName]: Array.isArray(param) ? [...param] : param
    };
  }, {});
}
var HttpResponse = class {
  constructor(options) {
    this.statusCode = options.statusCode;
    this.reason = options.reason;
    this.headers = options.headers || {};
    this.body = options.body;
  }
  static isInstance(response2) {
    if (!response2)
      return false;
    const resp = response2;
    return typeof resp.statusCode === "number" && typeof resp.headers === "object";
  }
};
var CONTENT_LENGTH_HEADER = "content-length";
function contentLengthMiddleware(bodyLengthChecker) {
  return (next) => async (args) => {
    const request2 = args.request;
    if (HttpRequest.isInstance(request2)) {
      const { body, headers } = request2;
      if (body && Object.keys(headers).map((str) => str.toLowerCase()).indexOf(CONTENT_LENGTH_HEADER) === -1) {
        try {
          const length = bodyLengthChecker(body);
          request2.headers = {
            ...request2.headers,
            [CONTENT_LENGTH_HEADER]: String(length)
          };
        } catch (error) {
        }
      }
    }
    return next({
      ...args,
      request: request2
    });
  };
}
var contentLengthMiddlewareOptions = {
  step: "build",
  tags: ["SET_CONTENT_LENGTH", "CONTENT_LENGTH"],
  name: "contentLengthMiddleware",
  override: true
};
var getContentLengthPlugin = (options) => ({
  applyToStack: (clientStack) => {
    clientStack.add(contentLengthMiddleware(options.bodyLengthChecker), contentLengthMiddlewareOptions);
  }
});
var resolveParamsForS3 = async (endpointParams) => {
  const bucket = (endpointParams == null ? void 0 : endpointParams.Bucket) || "";
  if (typeof endpointParams.Bucket === "string") {
    endpointParams.Bucket = bucket.replace(/#/g, encodeURIComponent("#")).replace(/\?/g, encodeURIComponent("?"));
  }
  if (isArnBucketName(bucket)) {
    if (endpointParams.ForcePathStyle === true) {
      throw new Error("Path-style addressing cannot be used with ARN buckets");
    }
  } else if (!isDnsCompatibleBucketName(bucket) || bucket.indexOf(".") !== -1 && !String(endpointParams.Endpoint).startsWith("http:") || bucket.toLowerCase() !== bucket || bucket.length < 3) {
    endpointParams.ForcePathStyle = true;
  }
  if (endpointParams.DisableMultiRegionAccessPoints) {
    endpointParams.disableMultiRegionAccessPoints = true;
    endpointParams.DisableMRAP = true;
  }
  return endpointParams;
};
var DOMAIN_PATTERN = /^[a-z0-9][a-z0-9\.\-]{1,61}[a-z0-9]$/;
var IP_ADDRESS_PATTERN = /(\d+\.){3}\d+/;
var DOTS_PATTERN = /\.\./;
var isDnsCompatibleBucketName = (bucketName) => DOMAIN_PATTERN.test(bucketName) && !IP_ADDRESS_PATTERN.test(bucketName) && !DOTS_PATTERN.test(bucketName);
var isArnBucketName = (bucketName) => {
  const [arn, partition2, service, region, account, typeOrId] = bucketName.split(":");
  const isArn = arn === "arn" && bucketName.split(":").length >= 6;
  const isValidArn = [arn, partition2, service, account, typeOrId].filter(Boolean).length === 5;
  if (isArn && !isValidArn) {
    throw new Error(`Invalid ARN: ${bucketName} was an invalid ARN.`);
  }
  return arn === "arn" && !!partition2 && !!service && !!account && !!typeOrId;
};
var createConfigValueProvider = (configKey, canonicalEndpointParamKey, config) => {
  const configProvider = async () => {
    const configValue = config[configKey] ?? config[canonicalEndpointParamKey];
    if (typeof configValue === "function") {
      return configValue();
    }
    return configValue;
  };
  if (configKey === "endpoint" || canonicalEndpointParamKey === "endpoint") {
    return async () => {
      const endpoint = await configProvider();
      if (endpoint && typeof endpoint === "object") {
        if ("url" in endpoint) {
          return endpoint.url.href;
        }
        if ("hostname" in endpoint) {
          const { protocol, hostname, port, path: path2 } = endpoint;
          return `${protocol}//${hostname}${port ? ":" + port : ""}${path2}`;
        }
      }
      return endpoint;
    };
  }
  return configProvider;
};
var getEndpointFromInstructions = async (commandInput, instructionsSupplier, clientConfig, context) => {
  const endpointParams = await resolveParams(commandInput, instructionsSupplier, clientConfig);
  if (typeof clientConfig.endpointProvider !== "function") {
    throw new Error("config.endpointProvider is not set.");
  }
  const endpoint = clientConfig.endpointProvider(endpointParams, context);
  return endpoint;
};
var resolveParams = async (commandInput, instructionsSupplier, clientConfig) => {
  var _a;
  const endpointParams = {};
  const instructions = ((_a = instructionsSupplier == null ? void 0 : instructionsSupplier.getEndpointParameterInstructions) == null ? void 0 : _a.call(instructionsSupplier)) || {};
  for (const [name, instruction] of Object.entries(instructions)) {
    switch (instruction.type) {
      case "staticContextParams":
        endpointParams[name] = instruction.value;
        break;
      case "contextParams":
        endpointParams[name] = commandInput[instruction.name];
        break;
      case "clientContextParams":
      case "builtInParams":
        endpointParams[name] = await createConfigValueProvider(instruction.name, name, clientConfig)();
        break;
      default:
        throw new Error("Unrecognized endpoint parameter instruction: " + JSON.stringify(instruction));
    }
  }
  if (Object.keys(instructions).length === 0) {
    Object.assign(endpointParams, clientConfig);
  }
  if (String(clientConfig.serviceId).toLowerCase() === "s3") {
    await resolveParamsForS3(endpointParams);
  }
  return endpointParams;
};
function parseQueryString(querystring) {
  const query = {};
  querystring = querystring.replace(/^\?/, "");
  if (querystring) {
    for (const pair of querystring.split("&")) {
      let [key, value = null] = pair.split("=");
      key = decodeURIComponent(key);
      if (value) {
        value = decodeURIComponent(value);
      }
      if (!(key in query)) {
        query[key] = value;
      } else if (Array.isArray(query[key])) {
        query[key].push(value);
      } else {
        query[key] = [query[key], value];
      }
    }
  }
  return query;
}
var parseUrl = (url) => {
  if (typeof url === "string") {
    return parseUrl(new URL(url));
  }
  const { hostname, pathname, port, protocol, search } = url;
  let query;
  if (search) {
    query = parseQueryString(search);
  }
  return {
    hostname,
    port: port ? parseInt(port) : void 0,
    protocol,
    path: pathname,
    query
  };
};
var toEndpointV1 = (endpoint) => {
  if (typeof endpoint === "object") {
    if ("url" in endpoint) {
      return parseUrl(endpoint.url);
    }
    return endpoint;
  }
  return parseUrl(endpoint);
};
var endpointMiddleware = ({ config, instructions }) => {
  return (next, context) => async (args) => {
    var _a, _b;
    const endpoint = await getEndpointFromInstructions(args.input, {
      getEndpointParameterInstructions() {
        return instructions;
      }
    }, { ...config }, context);
    context.endpointV2 = endpoint;
    context.authSchemes = (_a = endpoint.properties) == null ? void 0 : _a.authSchemes;
    const authScheme = (_b = context.authSchemes) == null ? void 0 : _b[0];
    if (authScheme) {
      context["signing_region"] = authScheme.signingRegion;
      context["signing_service"] = authScheme.signingName;
    }
    return next({
      ...args
    });
  };
};
var deserializerMiddleware = (options, deserializer) => (next, context) => async (args) => {
  const { response: response2 } = await next(args);
  try {
    const parsed = await deserializer(response2, options);
    return {
      response: response2,
      output: parsed
    };
  } catch (error) {
    Object.defineProperty(error, "$response", {
      value: response2
    });
    if (!("$metadata" in error)) {
      const hint = `Deserialization error: to see the raw response, inspect the hidden field {error}.$response on this object.`;
      error.message += "\n  " + hint;
    }
    throw error;
  }
};
var serializerMiddleware = (options, serializer) => (next, context) => async (args) => {
  var _a;
  const endpoint = ((_a = context.endpointV2) == null ? void 0 : _a.url) && options.urlParser ? async () => options.urlParser(context.endpointV2.url) : options.endpoint;
  if (!endpoint) {
    throw new Error("No valid endpoint provider available.");
  }
  const request2 = await serializer(args.input, { ...options, endpoint });
  return next({
    ...args,
    request: request2
  });
};
var deserializerMiddlewareOption = {
  name: "deserializerMiddleware",
  step: "deserialize",
  tags: ["DESERIALIZER"],
  override: true
};
var serializerMiddlewareOption = {
  name: "serializerMiddleware",
  step: "serialize",
  tags: ["SERIALIZER"],
  override: true
};
function getSerdePlugin(config, serializer, deserializer) {
  return {
    applyToStack: (commandStack) => {
      commandStack.add(deserializerMiddleware(config, deserializer), deserializerMiddlewareOption);
      commandStack.add(serializerMiddleware(config, serializer), serializerMiddlewareOption);
    }
  };
}
var endpointMiddlewareOptions = {
  step: "serialize",
  tags: ["ENDPOINT_PARAMETERS", "ENDPOINT_V2", "ENDPOINT"],
  name: "endpointV2Middleware",
  override: true,
  relation: "before",
  toMiddleware: serializerMiddlewareOption.name
};
var getEndpointPlugin = (config, instructions) => ({
  applyToStack: (clientStack) => {
    clientStack.addRelativeTo(endpointMiddleware({
      config,
      instructions
    }), endpointMiddlewareOptions);
  }
});
var resolveEndpointConfig = (input) => {
  const tls = input.tls ?? true;
  const { endpoint } = input;
  const customEndpointProvider = endpoint != null ? async () => toEndpointV1(await normalizeProvider(endpoint)()) : void 0;
  const isCustomEndpoint = !!endpoint;
  return {
    ...input,
    endpoint: customEndpointProvider,
    tls,
    isCustomEndpoint,
    useDualstackEndpoint: normalizeProvider(input.useDualstackEndpoint ?? false),
    useFipsEndpoint: normalizeProvider(input.useFipsEndpoint ?? false)
  };
};
function addExpectContinueMiddleware(options) {
  return (next) => async (args) => {
    const { request: request2 } = args;
    if (HttpRequest.isInstance(request2) && request2.body && options.runtime === "node") {
      request2.headers = {
        ...request2.headers,
        Expect: "100-continue"
      };
    }
    return next({
      ...args,
      request: request2
    });
  };
}
var addExpectContinueMiddlewareOptions = {
  step: "build",
  tags: ["SET_EXPECT_HEADER", "EXPECT_HEADER"],
  name: "addExpectContinueMiddleware",
  override: true
};
var getAddExpectContinuePlugin = (options) => ({
  applyToStack: (clientStack) => {
    clientStack.add(addExpectContinueMiddleware(options), addExpectContinueMiddlewareOptions);
  }
});
function resolveHostHeaderConfig(input) {
  return input;
}
var hostHeaderMiddleware = (options) => (next) => async (args) => {
  if (!HttpRequest.isInstance(args.request))
    return next(args);
  const { request: request2 } = args;
  const { handlerProtocol = "" } = options.requestHandler.metadata || {};
  if (handlerProtocol.indexOf("h2") >= 0 && !request2.headers[":authority"]) {
    delete request2.headers["host"];
    request2.headers[":authority"] = "";
  } else if (!request2.headers["host"]) {
    let host = request2.hostname;
    if (request2.port != null)
      host += `:${request2.port}`;
    request2.headers["host"] = host;
  }
  return next(args);
};
var hostHeaderMiddlewareOptions = {
  name: "hostHeaderMiddleware",
  step: "build",
  priority: "low",
  tags: ["HOST"],
  override: true
};
var getHostHeaderPlugin = (options) => ({
  applyToStack: (clientStack) => {
    clientStack.add(hostHeaderMiddleware(options), hostHeaderMiddlewareOptions);
  }
});
var loggerMiddleware = () => (next, context) => async (args) => {
  var _a, _b;
  try {
    const response2 = await next(args);
    const { clientName, commandName, logger: logger2, dynamoDbDocumentClientOptions = {} } = context;
    const { overrideInputFilterSensitiveLog, overrideOutputFilterSensitiveLog } = dynamoDbDocumentClientOptions;
    const inputFilterSensitiveLog = overrideInputFilterSensitiveLog ?? context.inputFilterSensitiveLog;
    const outputFilterSensitiveLog = overrideOutputFilterSensitiveLog ?? context.outputFilterSensitiveLog;
    const { $metadata, ...outputWithoutMetadata } = response2.output;
    (_a = logger2 == null ? void 0 : logger2.info) == null ? void 0 : _a.call(logger2, {
      clientName,
      commandName,
      input: inputFilterSensitiveLog(args.input),
      output: outputFilterSensitiveLog(outputWithoutMetadata),
      metadata: $metadata
    });
    return response2;
  } catch (error) {
    const { clientName, commandName, logger: logger2, dynamoDbDocumentClientOptions = {} } = context;
    const { overrideInputFilterSensitiveLog } = dynamoDbDocumentClientOptions;
    const inputFilterSensitiveLog = overrideInputFilterSensitiveLog ?? context.inputFilterSensitiveLog;
    (_b = logger2 == null ? void 0 : logger2.error) == null ? void 0 : _b.call(logger2, {
      clientName,
      commandName,
      input: inputFilterSensitiveLog(args.input),
      error,
      metadata: error.$metadata
    });
    throw error;
  }
};
var loggerMiddlewareOptions = {
  name: "loggerMiddleware",
  tags: ["LOGGER"],
  step: "initialize",
  override: true
};
var getLoggerPlugin = (options) => ({
  applyToStack: (clientStack) => {
    clientStack.add(loggerMiddleware(), loggerMiddlewareOptions);
  }
});
var TRACE_ID_HEADER_NAME = "X-Amzn-Trace-Id";
var ENV_LAMBDA_FUNCTION_NAME = "AWS_LAMBDA_FUNCTION_NAME";
var ENV_TRACE_ID = "_X_AMZN_TRACE_ID";
var recursionDetectionMiddleware = (options) => (next) => async (args) => {
  const { request: request2 } = args;
  if (!HttpRequest.isInstance(request2) || options.runtime !== "node" || request2.headers.hasOwnProperty(TRACE_ID_HEADER_NAME)) {
    return next(args);
  }
  const functionName = process.env[ENV_LAMBDA_FUNCTION_NAME];
  const traceId = process.env[ENV_TRACE_ID];
  const nonEmptyString = (str) => typeof str === "string" && str.length > 0;
  if (nonEmptyString(functionName) && nonEmptyString(traceId)) {
    request2.headers[TRACE_ID_HEADER_NAME] = traceId;
  }
  return next({
    ...args,
    request: request2
  });
};
var addRecursionDetectionMiddlewareOptions = {
  step: "build",
  tags: ["RECURSION_DETECTION"],
  name: "recursionDetectionMiddleware",
  override: true,
  priority: "low"
};
var getRecursionDetectionPlugin = (options) => ({
  applyToStack: (clientStack) => {
    clientStack.add(recursionDetectionMiddleware(options), addRecursionDetectionMiddlewareOptions);
  }
});
var RETRY_MODES;
(function(RETRY_MODES2) {
  RETRY_MODES2["STANDARD"] = "standard";
  RETRY_MODES2["ADAPTIVE"] = "adaptive";
})(RETRY_MODES || (RETRY_MODES = {}));
var DEFAULT_MAX_ATTEMPTS = 3;
var DEFAULT_RETRY_MODE = RETRY_MODES.STANDARD;
var THROTTLING_ERROR_CODES = [
  "BandwidthLimitExceeded",
  "EC2ThrottledException",
  "LimitExceededException",
  "PriorRequestNotComplete",
  "ProvisionedThroughputExceededException",
  "RequestLimitExceeded",
  "RequestThrottled",
  "RequestThrottledException",
  "SlowDown",
  "ThrottledException",
  "Throttling",
  "ThrottlingException",
  "TooManyRequestsException",
  "TransactionInProgressException"
];
var TRANSIENT_ERROR_CODES = ["AbortError", "TimeoutError", "RequestTimeout", "RequestTimeoutException"];
var TRANSIENT_ERROR_STATUS_CODES = [500, 502, 503, 504];
var NODEJS_TIMEOUT_ERROR_CODES = ["ECONNRESET", "ECONNREFUSED", "EPIPE", "ETIMEDOUT"];
var isThrottlingError = (error) => {
  var _a, _b;
  return ((_a = error.$metadata) == null ? void 0 : _a.httpStatusCode) === 429 || THROTTLING_ERROR_CODES.includes(error.name) || ((_b = error.$retryable) == null ? void 0 : _b.throttling) == true;
};
var isTransientError = (error) => {
  var _a;
  return TRANSIENT_ERROR_CODES.includes(error.name) || NODEJS_TIMEOUT_ERROR_CODES.includes((error == null ? void 0 : error.code) || "") || TRANSIENT_ERROR_STATUS_CODES.includes(((_a = error.$metadata) == null ? void 0 : _a.httpStatusCode) || 0);
};
var isServerError = (error) => {
  var _a;
  if (((_a = error.$metadata) == null ? void 0 : _a.httpStatusCode) !== void 0) {
    const statusCode = error.$metadata.httpStatusCode;
    if (500 <= statusCode && statusCode <= 599 && !isTransientError(error)) {
      return true;
    }
    return false;
  }
  return false;
};
var DefaultRateLimiter = class {
  constructor(options) {
    this.currentCapacity = 0;
    this.enabled = false;
    this.lastMaxRate = 0;
    this.measuredTxRate = 0;
    this.requestCount = 0;
    this.lastTimestamp = 0;
    this.timeWindow = 0;
    this.beta = (options == null ? void 0 : options.beta) ?? 0.7;
    this.minCapacity = (options == null ? void 0 : options.minCapacity) ?? 1;
    this.minFillRate = (options == null ? void 0 : options.minFillRate) ?? 0.5;
    this.scaleConstant = (options == null ? void 0 : options.scaleConstant) ?? 0.4;
    this.smooth = (options == null ? void 0 : options.smooth) ?? 0.8;
    const currentTimeInSeconds = this.getCurrentTimeInSeconds();
    this.lastThrottleTime = currentTimeInSeconds;
    this.lastTxRateBucket = Math.floor(this.getCurrentTimeInSeconds());
    this.fillRate = this.minFillRate;
    this.maxCapacity = this.minCapacity;
  }
  getCurrentTimeInSeconds() {
    return Date.now() / 1e3;
  }
  async getSendToken() {
    return this.acquireTokenBucket(1);
  }
  async acquireTokenBucket(amount) {
    if (!this.enabled) {
      return;
    }
    this.refillTokenBucket();
    if (amount > this.currentCapacity) {
      const delay = (amount - this.currentCapacity) / this.fillRate * 1e3;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    this.currentCapacity = this.currentCapacity - amount;
  }
  refillTokenBucket() {
    const timestamp = this.getCurrentTimeInSeconds();
    if (!this.lastTimestamp) {
      this.lastTimestamp = timestamp;
      return;
    }
    const fillAmount = (timestamp - this.lastTimestamp) * this.fillRate;
    this.currentCapacity = Math.min(this.maxCapacity, this.currentCapacity + fillAmount);
    this.lastTimestamp = timestamp;
  }
  updateClientSendingRate(response2) {
    let calculatedRate;
    this.updateMeasuredRate();
    if (isThrottlingError(response2)) {
      const rateToUse = !this.enabled ? this.measuredTxRate : Math.min(this.measuredTxRate, this.fillRate);
      this.lastMaxRate = rateToUse;
      this.calculateTimeWindow();
      this.lastThrottleTime = this.getCurrentTimeInSeconds();
      calculatedRate = this.cubicThrottle(rateToUse);
      this.enableTokenBucket();
    } else {
      this.calculateTimeWindow();
      calculatedRate = this.cubicSuccess(this.getCurrentTimeInSeconds());
    }
    const newRate = Math.min(calculatedRate, 2 * this.measuredTxRate);
    this.updateTokenBucketRate(newRate);
  }
  calculateTimeWindow() {
    this.timeWindow = this.getPrecise(Math.pow(this.lastMaxRate * (1 - this.beta) / this.scaleConstant, 1 / 3));
  }
  cubicThrottle(rateToUse) {
    return this.getPrecise(rateToUse * this.beta);
  }
  cubicSuccess(timestamp) {
    return this.getPrecise(this.scaleConstant * Math.pow(timestamp - this.lastThrottleTime - this.timeWindow, 3) + this.lastMaxRate);
  }
  enableTokenBucket() {
    this.enabled = true;
  }
  updateTokenBucketRate(newRate) {
    this.refillTokenBucket();
    this.fillRate = Math.max(newRate, this.minFillRate);
    this.maxCapacity = Math.max(newRate, this.minCapacity);
    this.currentCapacity = Math.min(this.currentCapacity, this.maxCapacity);
  }
  updateMeasuredRate() {
    const t3 = this.getCurrentTimeInSeconds();
    const timeBucket = Math.floor(t3 * 2) / 2;
    this.requestCount++;
    if (timeBucket > this.lastTxRateBucket) {
      const currentRate = this.requestCount / (timeBucket - this.lastTxRateBucket);
      this.measuredTxRate = this.getPrecise(currentRate * this.smooth + this.measuredTxRate * (1 - this.smooth));
      this.requestCount = 0;
      this.lastTxRateBucket = timeBucket;
    }
  }
  getPrecise(num) {
    return parseFloat(num.toFixed(8));
  }
};
var DEFAULT_RETRY_DELAY_BASE = 100;
var MAXIMUM_RETRY_DELAY = 20 * 1e3;
var THROTTLING_RETRY_DELAY_BASE = 500;
var INITIAL_RETRY_TOKENS = 500;
var RETRY_COST = 5;
var TIMEOUT_RETRY_COST = 10;
var NO_RETRY_INCREMENT = 1;
var INVOCATION_ID_HEADER = "amz-sdk-invocation-id";
var REQUEST_HEADER = "amz-sdk-request";
var getDefaultRetryBackoffStrategy = () => {
  let delayBase = DEFAULT_RETRY_DELAY_BASE;
  const computeNextBackoffDelay = (attempts) => {
    return Math.floor(Math.min(MAXIMUM_RETRY_DELAY, Math.random() * 2 ** attempts * delayBase));
  };
  const setDelayBase = (delay) => {
    delayBase = delay;
  };
  return {
    computeNextBackoffDelay,
    setDelayBase
  };
};
var createDefaultRetryToken = ({ retryDelay, retryCount, retryCost }) => {
  const getRetryCount = () => retryCount;
  const getRetryDelay = () => Math.min(MAXIMUM_RETRY_DELAY, retryDelay);
  const getRetryCost = () => retryCost;
  return {
    getRetryCount,
    getRetryDelay,
    getRetryCost
  };
};
var StandardRetryStrategy = class {
  constructor(maxAttempts) {
    this.maxAttempts = maxAttempts;
    this.mode = RETRY_MODES.STANDARD;
    this.capacity = INITIAL_RETRY_TOKENS;
    this.retryBackoffStrategy = getDefaultRetryBackoffStrategy();
    this.maxAttemptsProvider = typeof maxAttempts === "function" ? maxAttempts : async () => maxAttempts;
  }
  async acquireInitialRetryToken(retryTokenScope) {
    return createDefaultRetryToken({
      retryDelay: DEFAULT_RETRY_DELAY_BASE,
      retryCount: 0
    });
  }
  async refreshRetryTokenForRetry(token, errorInfo) {
    const maxAttempts = await this.getMaxAttempts();
    if (this.shouldRetry(token, errorInfo, maxAttempts)) {
      const errorType = errorInfo.errorType;
      this.retryBackoffStrategy.setDelayBase(errorType === "THROTTLING" ? THROTTLING_RETRY_DELAY_BASE : DEFAULT_RETRY_DELAY_BASE);
      const delayFromErrorType = this.retryBackoffStrategy.computeNextBackoffDelay(token.getRetryCount());
      const retryDelay = errorInfo.retryAfterHint ? Math.max(errorInfo.retryAfterHint.getTime() - Date.now() || 0, delayFromErrorType) : delayFromErrorType;
      const capacityCost = this.getCapacityCost(errorType);
      this.capacity -= capacityCost;
      return createDefaultRetryToken({
        retryDelay,
        retryCount: token.getRetryCount() + 1,
        retryCost: capacityCost
      });
    }
    throw new Error("No retry token available");
  }
  recordSuccess(token) {
    this.capacity = Math.max(INITIAL_RETRY_TOKENS, this.capacity + (token.getRetryCost() ?? NO_RETRY_INCREMENT));
  }
  getCapacity() {
    return this.capacity;
  }
  async getMaxAttempts() {
    try {
      return await this.maxAttemptsProvider();
    } catch (error) {
      console.warn(`Max attempts provider could not resolve. Using default of ${DEFAULT_MAX_ATTEMPTS}`);
      return DEFAULT_MAX_ATTEMPTS;
    }
  }
  shouldRetry(tokenToRenew, errorInfo, maxAttempts) {
    const attempts = tokenToRenew.getRetryCount() + 1;
    return attempts < maxAttempts && this.capacity >= this.getCapacityCost(errorInfo.errorType) && this.isRetryableError(errorInfo.errorType);
  }
  getCapacityCost(errorType) {
    return errorType === "TRANSIENT" ? TIMEOUT_RETRY_COST : RETRY_COST;
  }
  isRetryableError(errorType) {
    return errorType === "THROTTLING" || errorType === "TRANSIENT";
  }
};
var AdaptiveRetryStrategy = class {
  constructor(maxAttemptsProvider, options) {
    this.maxAttemptsProvider = maxAttemptsProvider;
    this.mode = RETRY_MODES.ADAPTIVE;
    const { rateLimiter } = options ?? {};
    this.rateLimiter = rateLimiter ?? new DefaultRateLimiter();
    this.standardRetryStrategy = new StandardRetryStrategy(maxAttemptsProvider);
  }
  async acquireInitialRetryToken(retryTokenScope) {
    await this.rateLimiter.getSendToken();
    return this.standardRetryStrategy.acquireInitialRetryToken(retryTokenScope);
  }
  async refreshRetryTokenForRetry(tokenToRenew, errorInfo) {
    this.rateLimiter.updateClientSendingRate(errorInfo);
    return this.standardRetryStrategy.refreshRetryTokenForRetry(tokenToRenew, errorInfo);
  }
  recordSuccess(token) {
    this.rateLimiter.updateClientSendingRate({});
    this.standardRetryStrategy.recordSuccess(token);
  }
};
var rnds8Pool = new Uint8Array(256);
var poolPtr = rnds8Pool.length;
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    crypto.randomFillSync(rnds8Pool);
    poolPtr = 0;
  }
  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}
var regex_default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
function validate(uuid) {
  return typeof uuid === "string" && regex_default.test(uuid);
}
var validate_default = validate;
var byteToHex = [];
for (let i5 = 0; i5 < 256; ++i5) {
  byteToHex.push((i5 + 256).toString(16).substr(1));
}
function stringify(arr, offset = 0) {
  const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
  if (!validate_default(uuid)) {
    throw TypeError("Stringified UUID is invalid");
  }
  return uuid;
}
var stringify_default = stringify;
function v4(options, buf, offset) {
  options = options || {};
  const rnds = options.random || (options.rng || rng)();
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    for (let i5 = 0; i5 < 16; ++i5) {
      buf[offset + i5] = rnds[i5];
    }
    return buf;
  }
  return stringify_default(rnds);
}
var v4_default = v4;
var asSdkError = (error) => {
  if (error instanceof Error)
    return error;
  if (error instanceof Object)
    return Object.assign(new Error(), error);
  if (typeof error === "string")
    return new Error(error);
  return new Error(`AWS SDK error wrapper for ${error}`);
};
var ENV_MAX_ATTEMPTS = "AWS_MAX_ATTEMPTS";
var CONFIG_MAX_ATTEMPTS = "max_attempts";
var NODE_MAX_ATTEMPT_CONFIG_OPTIONS = {
  environmentVariableSelector: (env2) => {
    const value = env2[ENV_MAX_ATTEMPTS];
    if (!value)
      return void 0;
    const maxAttempt = parseInt(value);
    if (Number.isNaN(maxAttempt)) {
      throw new Error(`Environment variable ${ENV_MAX_ATTEMPTS} mast be a number, got "${value}"`);
    }
    return maxAttempt;
  },
  configFileSelector: (profile) => {
    const value = profile[CONFIG_MAX_ATTEMPTS];
    if (!value)
      return void 0;
    const maxAttempt = parseInt(value);
    if (Number.isNaN(maxAttempt)) {
      throw new Error(`Shared config file entry ${CONFIG_MAX_ATTEMPTS} mast be a number, got "${value}"`);
    }
    return maxAttempt;
  },
  default: DEFAULT_MAX_ATTEMPTS
};
var resolveRetryConfig = (input) => {
  const { retryStrategy } = input;
  const maxAttempts = normalizeProvider(input.maxAttempts ?? DEFAULT_MAX_ATTEMPTS);
  return {
    ...input,
    maxAttempts,
    retryStrategy: async () => {
      if (retryStrategy) {
        return retryStrategy;
      }
      const retryMode = await normalizeProvider(input.retryMode)();
      if (retryMode === RETRY_MODES.ADAPTIVE) {
        return new AdaptiveRetryStrategy(maxAttempts);
      }
      return new StandardRetryStrategy(maxAttempts);
    }
  };
};
var ENV_RETRY_MODE = "AWS_RETRY_MODE";
var CONFIG_RETRY_MODE = "retry_mode";
var NODE_RETRY_MODE_CONFIG_OPTIONS = {
  environmentVariableSelector: (env2) => env2[ENV_RETRY_MODE],
  configFileSelector: (profile) => profile[CONFIG_RETRY_MODE],
  default: DEFAULT_RETRY_MODE
};
var retryMiddleware = (options) => (next, context) => async (args) => {
  let retryStrategy = await options.retryStrategy();
  const maxAttempts = await options.maxAttempts();
  if (isRetryStrategyV2(retryStrategy)) {
    retryStrategy = retryStrategy;
    let retryToken = await retryStrategy.acquireInitialRetryToken(context["partition_id"]);
    let lastError = new Error();
    let attempts = 0;
    let totalRetryDelay = 0;
    const { request: request2 } = args;
    if (HttpRequest.isInstance(request2)) {
      request2.headers[INVOCATION_ID_HEADER] = v4_default();
    }
    while (true) {
      try {
        if (HttpRequest.isInstance(request2)) {
          request2.headers[REQUEST_HEADER] = `attempt=${attempts + 1}; max=${maxAttempts}`;
        }
        const { response: response2, output } = await next(args);
        retryStrategy.recordSuccess(retryToken);
        output.$metadata.attempts = attempts + 1;
        output.$metadata.totalRetryDelay = totalRetryDelay;
        return { response: response2, output };
      } catch (e5) {
        const retryErrorInfo = getRetryErrorInfo(e5);
        lastError = asSdkError(e5);
        try {
          retryToken = await retryStrategy.refreshRetryTokenForRetry(retryToken, retryErrorInfo);
        } catch (refreshError) {
          if (!lastError.$metadata) {
            lastError.$metadata = {};
          }
          lastError.$metadata.attempts = attempts + 1;
          lastError.$metadata.totalRetryDelay = totalRetryDelay;
          throw lastError;
        }
        attempts = retryToken.getRetryCount();
        const delay = retryToken.getRetryDelay();
        totalRetryDelay += delay;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  } else {
    retryStrategy = retryStrategy;
    if (retryStrategy == null ? void 0 : retryStrategy.mode)
      context.userAgent = [...context.userAgent || [], ["cfg/retry-mode", retryStrategy.mode]];
    return retryStrategy.retry(next, args);
  }
};
var isRetryStrategyV2 = (retryStrategy) => typeof retryStrategy.acquireInitialRetryToken !== "undefined" && typeof retryStrategy.refreshRetryTokenForRetry !== "undefined" && typeof retryStrategy.recordSuccess !== "undefined";
var getRetryErrorInfo = (error) => {
  const errorInfo = {
    errorType: getRetryErrorType(error)
  };
  const retryAfterHint = getRetryAfterHint(error.$response);
  if (retryAfterHint) {
    errorInfo.retryAfterHint = retryAfterHint;
  }
  return errorInfo;
};
var getRetryErrorType = (error) => {
  if (isThrottlingError(error))
    return "THROTTLING";
  if (isTransientError(error))
    return "TRANSIENT";
  if (isServerError(error))
    return "SERVER_ERROR";
  return "CLIENT_ERROR";
};
var retryMiddlewareOptions = {
  name: "retryMiddleware",
  tags: ["RETRY"],
  step: "finalizeRequest",
  priority: "high",
  override: true
};
var getRetryPlugin = (options) => ({
  applyToStack: (clientStack) => {
    clientStack.add(retryMiddleware(options), retryMiddlewareOptions);
  }
});
var getRetryAfterHint = (response2) => {
  if (!HttpResponse.isInstance(response2))
    return;
  const retryAfterHeaderName = Object.keys(response2.headers).find((key) => key.toLowerCase() === "retry-after");
  if (!retryAfterHeaderName)
    return;
  const retryAfter = response2.headers[retryAfterHeaderName];
  const retryAfterSeconds = Number(retryAfter);
  if (!Number.isNaN(retryAfterSeconds))
    return new Date(retryAfterSeconds * 1e3);
  const retryAfterDate = new Date(retryAfter);
  return retryAfterDate;
};
var resolveS3Config = (input) => ({
  ...input,
  forcePathStyle: input.forcePathStyle ?? false,
  useAccelerateEndpoint: input.useAccelerateEndpoint ?? false,
  disableMultiregionAccessPoints: input.disableMultiregionAccessPoints ?? false
});
var throw200ExceptionsMiddleware = (config) => (next) => async (args) => {
  const result = await next(args);
  const { response: response2 } = result;
  if (!HttpResponse.isInstance(response2))
    return result;
  const { statusCode, body } = response2;
  if (statusCode < 200 || statusCode >= 300)
    return result;
  const bodyBytes = await collectBody(body, config);
  const bodyString = await collectBodyString(bodyBytes, config);
  if (bodyBytes.length === 0) {
    const err = new Error("S3 aborted request");
    err.name = "InternalError";
    throw err;
  }
  if (bodyString && bodyString.match("<Error>")) {
    response2.statusCode = 400;
  }
  response2.body = bodyBytes;
  return result;
};
var collectBody = (streamBody = new Uint8Array(), context) => {
  if (streamBody instanceof Uint8Array) {
    return Promise.resolve(streamBody);
  }
  return context.streamCollector(streamBody) || Promise.resolve(new Uint8Array());
};
var collectBodyString = (streamBody, context) => collectBody(streamBody, context).then((body) => context.utf8Encoder(body));
var throw200ExceptionsMiddlewareOptions = {
  relation: "after",
  toMiddleware: "deserializerMiddleware",
  tags: ["THROW_200_EXCEPTIONS", "S3"],
  name: "throw200ExceptionsMiddleware",
  override: true
};
var getThrow200ExceptionsPlugin = (config) => ({
  applyToStack: (clientStack) => {
    clientStack.addRelativeTo(throw200ExceptionsMiddleware(config), throw200ExceptionsMiddlewareOptions);
  }
});
var validate2 = (str) => typeof str === "string" && str.indexOf("arn:") === 0 && str.split(":").length >= 6;
function validateBucketNameMiddleware() {
  return (next) => async (args) => {
    const { input: { Bucket: Bucket2 } } = args;
    if (typeof Bucket2 === "string" && !validate2(Bucket2) && Bucket2.indexOf("/") >= 0) {
      const err = new Error(`Bucket name shouldn't contain '/', received '${Bucket2}'`);
      err.name = "InvalidBucketName";
      throw err;
    }
    return next({ ...args });
  };
}
var validateBucketNameMiddlewareOptions = {
  step: "initialize",
  tags: ["VALIDATE_BUCKET_NAME"],
  name: "validateBucketNameMiddleware",
  override: true
};
var getValidateBucketNamePlugin = (unused) => ({
  applyToStack: (clientStack) => {
    clientStack.add(validateBucketNameMiddleware(), validateBucketNameMiddlewareOptions);
  }
});
var ProviderError = class _ProviderError extends Error {
  constructor(message, tryNextLink = true) {
    super(message);
    this.tryNextLink = tryNextLink;
    this.name = "ProviderError";
    Object.setPrototypeOf(this, _ProviderError.prototype);
  }
  static from(error, tryNextLink = true) {
    return Object.assign(new this(error.message, tryNextLink), error);
  }
};
var CredentialsProviderError = class _CredentialsProviderError extends ProviderError {
  constructor(message, tryNextLink = true) {
    super(message, tryNextLink);
    this.tryNextLink = tryNextLink;
    this.name = "CredentialsProviderError";
    Object.setPrototypeOf(this, _CredentialsProviderError.prototype);
  }
};
var TokenProviderError = class _TokenProviderError extends ProviderError {
  constructor(message, tryNextLink = true) {
    super(message, tryNextLink);
    this.tryNextLink = tryNextLink;
    this.name = "TokenProviderError";
    Object.setPrototypeOf(this, _TokenProviderError.prototype);
  }
};
var chain = (...providers) => async () => {
  if (providers.length === 0) {
    throw new ProviderError("No providers in chain");
  }
  let lastProviderError;
  for (const provider of providers) {
    try {
      const credentials = await provider();
      return credentials;
    } catch (err) {
      lastProviderError = err;
      if (err == null ? void 0 : err.tryNextLink) {
        continue;
      }
      throw err;
    }
  }
  throw lastProviderError;
};
var fromStatic = (staticValue) => () => Promise.resolve(staticValue);
var memoize = (provider, isExpired, requiresRefresh) => {
  let resolved;
  let pending;
  let hasResult;
  let isConstant = false;
  const coalesceProvider = async () => {
    if (!pending) {
      pending = provider();
    }
    try {
      resolved = await pending;
      hasResult = true;
      isConstant = false;
    } finally {
      pending = void 0;
    }
    return resolved;
  };
  if (isExpired === void 0) {
    return async (options) => {
      if (!hasResult || (options == null ? void 0 : options.forceRefresh)) {
        resolved = await coalesceProvider();
      }
      return resolved;
    };
  }
  return async (options) => {
    if (!hasResult || (options == null ? void 0 : options.forceRefresh)) {
      resolved = await coalesceProvider();
    }
    if (isConstant) {
      return resolved;
    }
    if (requiresRefresh && !requiresRefresh(resolved)) {
      isConstant = true;
      return resolved;
    }
    if (isExpired(resolved)) {
      await coalesceProvider();
      return resolved;
    }
    return resolved;
  };
};
var import_crc322 = __toESM(require_build2());
var SHORT_TO_HEX = {};
var HEX_TO_SHORT = {};
for (let i5 = 0; i5 < 256; i5++) {
  let encodedByte = i5.toString(16).toLowerCase();
  if (encodedByte.length === 1) {
    encodedByte = `0${encodedByte}`;
  }
  SHORT_TO_HEX[i5] = encodedByte;
  HEX_TO_SHORT[encodedByte] = i5;
}
function fromHex(encoded) {
  if (encoded.length % 2 !== 0) {
    throw new Error("Hex encoded strings must have an even number length");
  }
  const out = new Uint8Array(encoded.length / 2);
  for (let i5 = 0; i5 < encoded.length; i5 += 2) {
    const encodedByte = encoded.slice(i5, i5 + 2).toLowerCase();
    if (encodedByte in HEX_TO_SHORT) {
      out[i5 / 2] = HEX_TO_SHORT[encodedByte];
    } else {
      throw new Error(`Cannot decode unrecognized sequence ${encodedByte} as hexadecimal`);
    }
  }
  return out;
}
function toHex(bytes) {
  let out = "";
  for (let i5 = 0; i5 < bytes.byteLength; i5++) {
    out += SHORT_TO_HEX[bytes[i5]];
  }
  return out;
}
var Int64 = class _Int64 {
  constructor(bytes) {
    this.bytes = bytes;
    if (bytes.byteLength !== 8) {
      throw new Error("Int64 buffers must be exactly 8 bytes");
    }
  }
  static fromNumber(number) {
    if (number > 9223372036854776e3 || number < -9223372036854776e3) {
      throw new Error(`${number} is too large (or, if negative, too small) to represent as an Int64`);
    }
    const bytes = new Uint8Array(8);
    for (let i5 = 7, remaining = Math.abs(Math.round(number)); i5 > -1 && remaining > 0; i5--, remaining /= 256) {
      bytes[i5] = remaining;
    }
    if (number < 0) {
      negate(bytes);
    }
    return new _Int64(bytes);
  }
  valueOf() {
    const bytes = this.bytes.slice(0);
    const negative = bytes[0] & 128;
    if (negative) {
      negate(bytes);
    }
    return parseInt(toHex(bytes), 16) * (negative ? -1 : 1);
  }
  toString() {
    return String(this.valueOf());
  }
};
function negate(bytes) {
  for (let i5 = 0; i5 < 8; i5++) {
    bytes[i5] ^= 255;
  }
  for (let i5 = 7; i5 > -1; i5--) {
    bytes[i5]++;
    if (bytes[i5] !== 0)
      break;
  }
}
var HeaderMarshaller = class {
  constructor(toUtf85, fromUtf85) {
    this.toUtf8 = toUtf85;
    this.fromUtf8 = fromUtf85;
  }
  format(headers) {
    const chunks = [];
    for (const headerName of Object.keys(headers)) {
      const bytes = this.fromUtf8(headerName);
      chunks.push(Uint8Array.from([bytes.byteLength]), bytes, this.formatHeaderValue(headers[headerName]));
    }
    const out = new Uint8Array(chunks.reduce((carry, bytes) => carry + bytes.byteLength, 0));
    let position = 0;
    for (const chunk of chunks) {
      out.set(chunk, position);
      position += chunk.byteLength;
    }
    return out;
  }
  formatHeaderValue(header) {
    switch (header.type) {
      case "boolean":
        return Uint8Array.from([header.value ? 0 : 1]);
      case "byte":
        return Uint8Array.from([2, header.value]);
      case "short":
        const shortView = new DataView(new ArrayBuffer(3));
        shortView.setUint8(0, 3);
        shortView.setInt16(1, header.value, false);
        return new Uint8Array(shortView.buffer);
      case "integer":
        const intView = new DataView(new ArrayBuffer(5));
        intView.setUint8(0, 4);
        intView.setInt32(1, header.value, false);
        return new Uint8Array(intView.buffer);
      case "long":
        const longBytes = new Uint8Array(9);
        longBytes[0] = 5;
        longBytes.set(header.value.bytes, 1);
        return longBytes;
      case "binary":
        const binView = new DataView(new ArrayBuffer(3 + header.value.byteLength));
        binView.setUint8(0, 6);
        binView.setUint16(1, header.value.byteLength, false);
        const binBytes = new Uint8Array(binView.buffer);
        binBytes.set(header.value, 3);
        return binBytes;
      case "string":
        const utf8Bytes = this.fromUtf8(header.value);
        const strView = new DataView(new ArrayBuffer(3 + utf8Bytes.byteLength));
        strView.setUint8(0, 7);
        strView.setUint16(1, utf8Bytes.byteLength, false);
        const strBytes = new Uint8Array(strView.buffer);
        strBytes.set(utf8Bytes, 3);
        return strBytes;
      case "timestamp":
        const tsBytes = new Uint8Array(9);
        tsBytes[0] = 8;
        tsBytes.set(Int64.fromNumber(header.value.valueOf()).bytes, 1);
        return tsBytes;
      case "uuid":
        if (!UUID_PATTERN.test(header.value)) {
          throw new Error(`Invalid UUID received: ${header.value}`);
        }
        const uuidBytes = new Uint8Array(17);
        uuidBytes[0] = 9;
        uuidBytes.set(fromHex(header.value.replace(/\-/g, "")), 1);
        return uuidBytes;
    }
  }
  parse(headers) {
    const out = {};
    let position = 0;
    while (position < headers.byteLength) {
      const nameLength = headers.getUint8(position++);
      const name = this.toUtf8(new Uint8Array(headers.buffer, headers.byteOffset + position, nameLength));
      position += nameLength;
      switch (headers.getUint8(position++)) {
        case 0:
          out[name] = {
            type: BOOLEAN_TAG,
            value: true
          };
          break;
        case 1:
          out[name] = {
            type: BOOLEAN_TAG,
            value: false
          };
          break;
        case 2:
          out[name] = {
            type: BYTE_TAG,
            value: headers.getInt8(position++)
          };
          break;
        case 3:
          out[name] = {
            type: SHORT_TAG,
            value: headers.getInt16(position, false)
          };
          position += 2;
          break;
        case 4:
          out[name] = {
            type: INT_TAG,
            value: headers.getInt32(position, false)
          };
          position += 4;
          break;
        case 5:
          out[name] = {
            type: LONG_TAG,
            value: new Int64(new Uint8Array(headers.buffer, headers.byteOffset + position, 8))
          };
          position += 8;
          break;
        case 6:
          const binaryLength = headers.getUint16(position, false);
          position += 2;
          out[name] = {
            type: BINARY_TAG,
            value: new Uint8Array(headers.buffer, headers.byteOffset + position, binaryLength)
          };
          position += binaryLength;
          break;
        case 7:
          const stringLength = headers.getUint16(position, false);
          position += 2;
          out[name] = {
            type: STRING_TAG,
            value: this.toUtf8(new Uint8Array(headers.buffer, headers.byteOffset + position, stringLength))
          };
          position += stringLength;
          break;
        case 8:
          out[name] = {
            type: TIMESTAMP_TAG,
            value: new Date(new Int64(new Uint8Array(headers.buffer, headers.byteOffset + position, 8)).valueOf())
          };
          position += 8;
          break;
        case 9:
          const uuidBytes = new Uint8Array(headers.buffer, headers.byteOffset + position, 16);
          position += 16;
          out[name] = {
            type: UUID_TAG,
            value: `${toHex(uuidBytes.subarray(0, 4))}-${toHex(uuidBytes.subarray(4, 6))}-${toHex(uuidBytes.subarray(6, 8))}-${toHex(uuidBytes.subarray(8, 10))}-${toHex(uuidBytes.subarray(10))}`
          };
          break;
        default:
          throw new Error(`Unrecognized header type tag`);
      }
    }
    return out;
  }
};
var HEADER_VALUE_TYPE;
(function(HEADER_VALUE_TYPE2) {
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["boolTrue"] = 0] = "boolTrue";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["boolFalse"] = 1] = "boolFalse";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["byte"] = 2] = "byte";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["short"] = 3] = "short";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["integer"] = 4] = "integer";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["long"] = 5] = "long";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["byteArray"] = 6] = "byteArray";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["string"] = 7] = "string";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["timestamp"] = 8] = "timestamp";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["uuid"] = 9] = "uuid";
})(HEADER_VALUE_TYPE || (HEADER_VALUE_TYPE = {}));
var BOOLEAN_TAG = "boolean";
var BYTE_TAG = "byte";
var SHORT_TAG = "short";
var INT_TAG = "integer";
var LONG_TAG = "long";
var BINARY_TAG = "binary";
var STRING_TAG = "string";
var TIMESTAMP_TAG = "timestamp";
var UUID_TAG = "uuid";
var UUID_PATTERN = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
var import_crc32 = __toESM(require_build2());
var PRELUDE_MEMBER_LENGTH = 4;
var PRELUDE_LENGTH = PRELUDE_MEMBER_LENGTH * 2;
var CHECKSUM_LENGTH = 4;
var MINIMUM_MESSAGE_LENGTH = PRELUDE_LENGTH + CHECKSUM_LENGTH * 2;
function splitMessage({ byteLength, byteOffset, buffer }) {
  if (byteLength < MINIMUM_MESSAGE_LENGTH) {
    throw new Error("Provided message too short to accommodate event stream message overhead");
  }
  const view = new DataView(buffer, byteOffset, byteLength);
  const messageLength = view.getUint32(0, false);
  if (byteLength !== messageLength) {
    throw new Error("Reported message length does not match received message length");
  }
  const headerLength = view.getUint32(PRELUDE_MEMBER_LENGTH, false);
  const expectedPreludeChecksum = view.getUint32(PRELUDE_LENGTH, false);
  const expectedMessageChecksum = view.getUint32(byteLength - CHECKSUM_LENGTH, false);
  const checksummer = new import_crc32.Crc32().update(new Uint8Array(buffer, byteOffset, PRELUDE_LENGTH));
  if (expectedPreludeChecksum !== checksummer.digest()) {
    throw new Error(`The prelude checksum specified in the message (${expectedPreludeChecksum}) does not match the calculated CRC32 checksum (${checksummer.digest()})`);
  }
  checksummer.update(new Uint8Array(buffer, byteOffset + PRELUDE_LENGTH, byteLength - (PRELUDE_LENGTH + CHECKSUM_LENGTH)));
  if (expectedMessageChecksum !== checksummer.digest()) {
    throw new Error(`The message checksum (${checksummer.digest()}) did not match the expected value of ${expectedMessageChecksum}`);
  }
  return {
    headers: new DataView(buffer, byteOffset + PRELUDE_LENGTH + CHECKSUM_LENGTH, headerLength),
    body: new Uint8Array(buffer, byteOffset + PRELUDE_LENGTH + CHECKSUM_LENGTH + headerLength, messageLength - headerLength - (PRELUDE_LENGTH + CHECKSUM_LENGTH + CHECKSUM_LENGTH))
  };
}
var EventStreamCodec = class {
  constructor(toUtf85, fromUtf85) {
    this.headerMarshaller = new HeaderMarshaller(toUtf85, fromUtf85);
    this.messageBuffer = [];
    this.isEndOfStream = false;
  }
  feed(message) {
    this.messageBuffer.push(this.decode(message));
  }
  endOfStream() {
    this.isEndOfStream = true;
  }
  getMessage() {
    const message = this.messageBuffer.pop();
    const isEndOfStream = this.isEndOfStream;
    return {
      getMessage() {
        return message;
      },
      isEndOfStream() {
        return isEndOfStream;
      }
    };
  }
  getAvailableMessages() {
    const messages = this.messageBuffer;
    this.messageBuffer = [];
    const isEndOfStream = this.isEndOfStream;
    return {
      getMessages() {
        return messages;
      },
      isEndOfStream() {
        return isEndOfStream;
      }
    };
  }
  encode({ headers: rawHeaders, body }) {
    const headers = this.headerMarshaller.format(rawHeaders);
    const length = headers.byteLength + body.byteLength + 16;
    const out = new Uint8Array(length);
    const view = new DataView(out.buffer, out.byteOffset, out.byteLength);
    const checksum = new import_crc322.Crc32();
    view.setUint32(0, length, false);
    view.setUint32(4, headers.byteLength, false);
    view.setUint32(8, checksum.update(out.subarray(0, 8)).digest(), false);
    out.set(headers, 12);
    out.set(body, headers.byteLength + 12);
    view.setUint32(length - 4, checksum.update(out.subarray(8, length - 4)).digest(), false);
    return out;
  }
  decode(message) {
    const { headers, body } = splitMessage(message);
    return { headers: this.headerMarshaller.parse(headers), body };
  }
  formatHeaders(rawHeaders) {
    return this.headerMarshaller.format(rawHeaders);
  }
};
var MessageDecoderStream = class {
  constructor(options) {
    this.options = options;
  }
  [Symbol.asyncIterator]() {
    return this.asyncIterator();
  }
  async *asyncIterator() {
    for await (const bytes of this.options.inputStream) {
      const decoded = this.options.decoder.decode(bytes);
      yield decoded;
    }
  }
};
var MessageEncoderStream = class {
  constructor(options) {
    this.options = options;
  }
  [Symbol.asyncIterator]() {
    return this.asyncIterator();
  }
  async *asyncIterator() {
    for await (const msg of this.options.messageStream) {
      const encoded = this.options.encoder.encode(msg);
      yield encoded;
    }
    if (this.options.includeEndFrame) {
      yield new Uint8Array(0);
    }
  }
};
var SmithyMessageDecoderStream = class {
  constructor(options) {
    this.options = options;
  }
  [Symbol.asyncIterator]() {
    return this.asyncIterator();
  }
  async *asyncIterator() {
    for await (const message of this.options.messageStream) {
      const deserialized = await this.options.deserializer(message);
      if (deserialized === void 0)
        continue;
      yield deserialized;
    }
  }
};
var SmithyMessageEncoderStream = class {
  constructor(options) {
    this.options = options;
  }
  [Symbol.asyncIterator]() {
    return this.asyncIterator();
  }
  async *asyncIterator() {
    for await (const chunk of this.options.inputStream) {
      const payloadBuf = this.options.serializer(chunk);
      yield payloadBuf;
    }
  }
};
var isArrayBuffer = (arg) => typeof ArrayBuffer === "function" && arg instanceof ArrayBuffer || Object.prototype.toString.call(arg) === "[object ArrayBuffer]";
var fromArrayBuffer = (input, offset = 0, length = input.byteLength - offset) => {
  if (!isArrayBuffer(input)) {
    throw new TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof input} (${input})`);
  }
  return Buffer$1.from(input, offset, length);
};
var fromString = (input, encoding) => {
  if (typeof input !== "string") {
    throw new TypeError(`The "input" argument must be of type string. Received type ${typeof input} (${input})`);
  }
  return encoding ? Buffer$1.from(input, encoding) : Buffer$1.from(input);
};
var fromUtf84 = (input) => {
  const buf = fromString(input, "utf8");
  return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength / Uint8Array.BYTES_PER_ELEMENT);
};
var toUint8Array = (data) => {
  if (typeof data === "string") {
    return fromUtf84(data);
  }
  if (ArrayBuffer.isView(data)) {
    return new Uint8Array(data.buffer, data.byteOffset, data.byteLength / Uint8Array.BYTES_PER_ELEMENT);
  }
  return new Uint8Array(data);
};
var toUtf84 = (input) => fromArrayBuffer(input.buffer, input.byteOffset, input.byteLength).toString("utf8");
var ALGORITHM_QUERY_PARAM = "X-Amz-Algorithm";
var CREDENTIAL_QUERY_PARAM = "X-Amz-Credential";
var AMZ_DATE_QUERY_PARAM = "X-Amz-Date";
var SIGNED_HEADERS_QUERY_PARAM = "X-Amz-SignedHeaders";
var EXPIRES_QUERY_PARAM = "X-Amz-Expires";
var SIGNATURE_QUERY_PARAM = "X-Amz-Signature";
var TOKEN_QUERY_PARAM = "X-Amz-Security-Token";
var AUTH_HEADER = "authorization";
var AMZ_DATE_HEADER = AMZ_DATE_QUERY_PARAM.toLowerCase();
var DATE_HEADER = "date";
var GENERATED_HEADERS = [AUTH_HEADER, AMZ_DATE_HEADER, DATE_HEADER];
var SIGNATURE_HEADER = SIGNATURE_QUERY_PARAM.toLowerCase();
var SHA256_HEADER = "x-amz-content-sha256";
var TOKEN_HEADER = TOKEN_QUERY_PARAM.toLowerCase();
var ALWAYS_UNSIGNABLE_HEADERS = {
  authorization: true,
  "cache-control": true,
  connection: true,
  expect: true,
  from: true,
  "keep-alive": true,
  "max-forwards": true,
  pragma: true,
  referer: true,
  te: true,
  trailer: true,
  "transfer-encoding": true,
  upgrade: true,
  "user-agent": true,
  "x-amzn-trace-id": true
};
var PROXY_HEADER_PATTERN = /^proxy-/;
var SEC_HEADER_PATTERN = /^sec-/;
var ALGORITHM_IDENTIFIER = "AWS4-HMAC-SHA256";
var EVENT_ALGORITHM_IDENTIFIER = "AWS4-HMAC-SHA256-PAYLOAD";
var UNSIGNED_PAYLOAD = "UNSIGNED-PAYLOAD";
var MAX_CACHE_SIZE = 50;
var KEY_TYPE_IDENTIFIER = "aws4_request";
var MAX_PRESIGNED_TTL = 60 * 60 * 24 * 7;
var signingKeyCache = {};
var cacheQueue = [];
var createScope = (shortDate, region, service) => `${shortDate}/${region}/${service}/${KEY_TYPE_IDENTIFIER}`;
var getSigningKey = async (sha256Constructor, credentials, shortDate, region, service) => {
  const credsHash = await hmac(sha256Constructor, credentials.secretAccessKey, credentials.accessKeyId);
  const cacheKey = `${shortDate}:${region}:${service}:${toHex(credsHash)}:${credentials.sessionToken}`;
  if (cacheKey in signingKeyCache) {
    return signingKeyCache[cacheKey];
  }
  cacheQueue.push(cacheKey);
  while (cacheQueue.length > MAX_CACHE_SIZE) {
    delete signingKeyCache[cacheQueue.shift()];
  }
  let key = `AWS4${credentials.secretAccessKey}`;
  for (const signable of [shortDate, region, service, KEY_TYPE_IDENTIFIER]) {
    key = await hmac(sha256Constructor, key, signable);
  }
  return signingKeyCache[cacheKey] = key;
};
var hmac = (ctor, secret2, data) => {
  const hash = new ctor(secret2);
  hash.update(toUint8Array(data));
  return hash.digest();
};
var getCanonicalHeaders = ({ headers }, unsignableHeaders, signableHeaders) => {
  const canonical = {};
  for (const headerName of Object.keys(headers).sort()) {
    if (headers[headerName] == void 0) {
      continue;
    }
    const canonicalHeaderName = headerName.toLowerCase();
    if (canonicalHeaderName in ALWAYS_UNSIGNABLE_HEADERS || (unsignableHeaders == null ? void 0 : unsignableHeaders.has(canonicalHeaderName)) || PROXY_HEADER_PATTERN.test(canonicalHeaderName) || SEC_HEADER_PATTERN.test(canonicalHeaderName)) {
      if (!signableHeaders || signableHeaders && !signableHeaders.has(canonicalHeaderName)) {
        continue;
      }
    }
    canonical[canonicalHeaderName] = headers[headerName].trim().replace(/\s+/g, " ");
  }
  return canonical;
};
var escapeUri = (uri) => encodeURIComponent(uri).replace(/[!'()*]/g, hexEncode);
var hexEncode = (c5) => `%${c5.charCodeAt(0).toString(16).toUpperCase()}`;
var getCanonicalQuery = ({ query = {} }) => {
  const keys = [];
  const serialized = {};
  for (const key of Object.keys(query).sort()) {
    if (key.toLowerCase() === SIGNATURE_HEADER) {
      continue;
    }
    keys.push(key);
    const value = query[key];
    if (typeof value === "string") {
      serialized[key] = `${escapeUri(key)}=${escapeUri(value)}`;
    } else if (Array.isArray(value)) {
      serialized[key] = value.slice(0).sort().reduce((encoded, value2) => encoded.concat([`${escapeUri(key)}=${escapeUri(value2)}`]), []).join("&");
    }
  }
  return keys.map((key) => serialized[key]).filter((serialized2) => serialized2).join("&");
};
var getPayloadHash = async ({ headers, body }, hashConstructor) => {
  for (const headerName of Object.keys(headers)) {
    if (headerName.toLowerCase() === SHA256_HEADER) {
      return headers[headerName];
    }
  }
  if (body == void 0) {
    return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
  } else if (typeof body === "string" || ArrayBuffer.isView(body) || isArrayBuffer(body)) {
    const hashCtor = new hashConstructor();
    hashCtor.update(toUint8Array(body));
    return toHex(await hashCtor.digest());
  }
  return UNSIGNED_PAYLOAD;
};
var hasHeader = (soughtHeader, headers) => {
  soughtHeader = soughtHeader.toLowerCase();
  for (const headerName of Object.keys(headers)) {
    if (soughtHeader === headerName.toLowerCase()) {
      return true;
    }
  }
  return false;
};
var cloneRequest = ({ headers, query, ...rest }) => ({
  ...rest,
  headers: { ...headers },
  query: query ? cloneQuery2(query) : void 0
});
var cloneQuery2 = (query) => Object.keys(query).reduce((carry, paramName) => {
  const param = query[paramName];
  return {
    ...carry,
    [paramName]: Array.isArray(param) ? [...param] : param
  };
}, {});
var moveHeadersToQuery = (request2, options = {}) => {
  var _a;
  const { headers, query = {} } = typeof request2.clone === "function" ? request2.clone() : cloneRequest(request2);
  for (const name of Object.keys(headers)) {
    const lname = name.toLowerCase();
    if (lname.slice(0, 6) === "x-amz-" && !((_a = options.unhoistableHeaders) == null ? void 0 : _a.has(lname))) {
      query[name] = headers[name];
      delete headers[name];
    }
  }
  return {
    ...request2,
    headers,
    query
  };
};
var prepareRequest = (request2) => {
  request2 = typeof request2.clone === "function" ? request2.clone() : cloneRequest(request2);
  for (const headerName of Object.keys(request2.headers)) {
    if (GENERATED_HEADERS.indexOf(headerName.toLowerCase()) > -1) {
      delete request2.headers[headerName];
    }
  }
  return request2;
};
var iso8601 = (time) => toDate(time).toISOString().replace(/\.\d{3}Z$/, "Z");
var toDate = (time) => {
  if (typeof time === "number") {
    return new Date(time * 1e3);
  }
  if (typeof time === "string") {
    if (Number(time)) {
      return new Date(Number(time) * 1e3);
    }
    return new Date(time);
  }
  return time;
};
var SignatureV4 = class {
  constructor({ applyChecksum, credentials, region, service, sha256, uriEscapePath = true }) {
    this.headerMarshaller = new HeaderMarshaller(toUtf84, fromUtf84);
    this.service = service;
    this.sha256 = sha256;
    this.uriEscapePath = uriEscapePath;
    this.applyChecksum = typeof applyChecksum === "boolean" ? applyChecksum : true;
    this.regionProvider = normalizeProvider(region);
    this.credentialProvider = normalizeProvider(credentials);
  }
  async presign(originalRequest, options = {}) {
    const { signingDate = /* @__PURE__ */ new Date(), expiresIn = 3600, unsignableHeaders, unhoistableHeaders, signableHeaders, signingRegion, signingService } = options;
    const credentials = await this.credentialProvider();
    this.validateResolvedCredentials(credentials);
    const region = signingRegion ?? await this.regionProvider();
    const { longDate, shortDate } = formatDate(signingDate);
    if (expiresIn > MAX_PRESIGNED_TTL) {
      return Promise.reject("Signature version 4 presigned URLs must have an expiration date less than one week in the future");
    }
    const scope = createScope(shortDate, region, signingService ?? this.service);
    const request2 = moveHeadersToQuery(prepareRequest(originalRequest), { unhoistableHeaders });
    if (credentials.sessionToken) {
      request2.query[TOKEN_QUERY_PARAM] = credentials.sessionToken;
    }
    request2.query[ALGORITHM_QUERY_PARAM] = ALGORITHM_IDENTIFIER;
    request2.query[CREDENTIAL_QUERY_PARAM] = `${credentials.accessKeyId}/${scope}`;
    request2.query[AMZ_DATE_QUERY_PARAM] = longDate;
    request2.query[EXPIRES_QUERY_PARAM] = expiresIn.toString(10);
    const canonicalHeaders = getCanonicalHeaders(request2, unsignableHeaders, signableHeaders);
    request2.query[SIGNED_HEADERS_QUERY_PARAM] = getCanonicalHeaderList(canonicalHeaders);
    request2.query[SIGNATURE_QUERY_PARAM] = await this.getSignature(longDate, scope, this.getSigningKey(credentials, region, shortDate, signingService), this.createCanonicalRequest(request2, canonicalHeaders, await getPayloadHash(originalRequest, this.sha256)));
    return request2;
  }
  async sign(toSign, options) {
    if (typeof toSign === "string") {
      return this.signString(toSign, options);
    } else if (toSign.headers && toSign.payload) {
      return this.signEvent(toSign, options);
    } else if (toSign.message) {
      return this.signMessage(toSign, options);
    } else {
      return this.signRequest(toSign, options);
    }
  }
  async signEvent({ headers, payload }, { signingDate = /* @__PURE__ */ new Date(), priorSignature, signingRegion, signingService }) {
    const region = signingRegion ?? await this.regionProvider();
    const { shortDate, longDate } = formatDate(signingDate);
    const scope = createScope(shortDate, region, signingService ?? this.service);
    const hashedPayload = await getPayloadHash({ headers: {}, body: payload }, this.sha256);
    const hash = new this.sha256();
    hash.update(headers);
    const hashedHeaders = toHex(await hash.digest());
    const stringToSign = [
      EVENT_ALGORITHM_IDENTIFIER,
      longDate,
      scope,
      priorSignature,
      hashedHeaders,
      hashedPayload
    ].join("\n");
    return this.signString(stringToSign, { signingDate, signingRegion: region, signingService });
  }
  async signMessage(signableMessage, { signingDate = /* @__PURE__ */ new Date(), signingRegion, signingService }) {
    const promise = this.signEvent({
      headers: this.headerMarshaller.format(signableMessage.message.headers),
      payload: signableMessage.message.body
    }, {
      signingDate,
      signingRegion,
      signingService,
      priorSignature: signableMessage.priorSignature
    });
    return promise.then((signature) => {
      return { message: signableMessage.message, signature };
    });
  }
  async signString(stringToSign, { signingDate = /* @__PURE__ */ new Date(), signingRegion, signingService } = {}) {
    const credentials = await this.credentialProvider();
    this.validateResolvedCredentials(credentials);
    const region = signingRegion ?? await this.regionProvider();
    const { shortDate } = formatDate(signingDate);
    const hash = new this.sha256(await this.getSigningKey(credentials, region, shortDate, signingService));
    hash.update(toUint8Array(stringToSign));
    return toHex(await hash.digest());
  }
  async signRequest(requestToSign, { signingDate = /* @__PURE__ */ new Date(), signableHeaders, unsignableHeaders, signingRegion, signingService } = {}) {
    const credentials = await this.credentialProvider();
    this.validateResolvedCredentials(credentials);
    const region = signingRegion ?? await this.regionProvider();
    const request2 = prepareRequest(requestToSign);
    const { longDate, shortDate } = formatDate(signingDate);
    const scope = createScope(shortDate, region, signingService ?? this.service);
    request2.headers[AMZ_DATE_HEADER] = longDate;
    if (credentials.sessionToken) {
      request2.headers[TOKEN_HEADER] = credentials.sessionToken;
    }
    const payloadHash = await getPayloadHash(request2, this.sha256);
    if (!hasHeader(SHA256_HEADER, request2.headers) && this.applyChecksum) {
      request2.headers[SHA256_HEADER] = payloadHash;
    }
    const canonicalHeaders = getCanonicalHeaders(request2, unsignableHeaders, signableHeaders);
    const signature = await this.getSignature(longDate, scope, this.getSigningKey(credentials, region, shortDate, signingService), this.createCanonicalRequest(request2, canonicalHeaders, payloadHash));
    request2.headers[AUTH_HEADER] = `${ALGORITHM_IDENTIFIER} Credential=${credentials.accessKeyId}/${scope}, SignedHeaders=${getCanonicalHeaderList(canonicalHeaders)}, Signature=${signature}`;
    return request2;
  }
  createCanonicalRequest(request2, canonicalHeaders, payloadHash) {
    const sortedHeaders = Object.keys(canonicalHeaders).sort();
    return `${request2.method}
${this.getCanonicalPath(request2)}
${getCanonicalQuery(request2)}
${sortedHeaders.map((name) => `${name}:${canonicalHeaders[name]}`).join("\n")}

${sortedHeaders.join(";")}
${payloadHash}`;
  }
  async createStringToSign(longDate, credentialScope, canonicalRequest) {
    const hash = new this.sha256();
    hash.update(toUint8Array(canonicalRequest));
    const hashedRequest = await hash.digest();
    return `${ALGORITHM_IDENTIFIER}
${longDate}
${credentialScope}
${toHex(hashedRequest)}`;
  }
  getCanonicalPath({ path: path2 }) {
    if (this.uriEscapePath) {
      const normalizedPathSegments = [];
      for (const pathSegment of path2.split("/")) {
        if ((pathSegment == null ? void 0 : pathSegment.length) === 0)
          continue;
        if (pathSegment === ".")
          continue;
        if (pathSegment === "..") {
          normalizedPathSegments.pop();
        } else {
          normalizedPathSegments.push(pathSegment);
        }
      }
      const normalizedPath = `${(path2 == null ? void 0 : path2.startsWith("/")) ? "/" : ""}${normalizedPathSegments.join("/")}${normalizedPathSegments.length > 0 && (path2 == null ? void 0 : path2.endsWith("/")) ? "/" : ""}`;
      const doubleEncoded = encodeURIComponent(normalizedPath);
      return doubleEncoded.replace(/%2F/g, "/");
    }
    return path2;
  }
  async getSignature(longDate, credentialScope, keyPromise, canonicalRequest) {
    const stringToSign = await this.createStringToSign(longDate, credentialScope, canonicalRequest);
    const hash = new this.sha256(await keyPromise);
    hash.update(toUint8Array(stringToSign));
    return toHex(await hash.digest());
  }
  getSigningKey(credentials, region, shortDate, service) {
    return getSigningKey(this.sha256, credentials, shortDate, region, service || this.service);
  }
  validateResolvedCredentials(credentials) {
    if (typeof credentials !== "object" || typeof credentials.accessKeyId !== "string" || typeof credentials.secretAccessKey !== "string") {
      throw new Error("Resolved credential object is not valid");
    }
  }
};
var formatDate = (now) => {
  const longDate = iso8601(now).replace(/[\-:]/g, "");
  return {
    longDate,
    shortDate: longDate.slice(0, 8)
  };
};
var getCanonicalHeaderList = (headers) => Object.keys(headers).sort().join(";");
var CREDENTIAL_EXPIRE_WINDOW = 3e5;
var resolveAwsAuthConfig = (input) => {
  const normalizedCreds = input.credentials ? normalizeCredentialProvider(input.credentials) : input.credentialDefaultProvider(input);
  const { signingEscapePath = true, systemClockOffset = input.systemClockOffset || 0, sha256 } = input;
  let signer;
  if (input.signer) {
    signer = normalizeProvider(input.signer);
  } else if (input.regionInfoProvider) {
    signer = () => normalizeProvider(input.region)().then(async (region) => [
      await input.regionInfoProvider(region, {
        useFipsEndpoint: await input.useFipsEndpoint(),
        useDualstackEndpoint: await input.useDualstackEndpoint()
      }) || {},
      region
    ]).then(([regionInfo, region]) => {
      const { signingRegion, signingService } = regionInfo;
      input.signingRegion = input.signingRegion || signingRegion || region;
      input.signingName = input.signingName || signingService || input.serviceId;
      const params = {
        ...input,
        credentials: normalizedCreds,
        region: input.signingRegion,
        service: input.signingName,
        sha256,
        uriEscapePath: signingEscapePath
      };
      const SignerCtor = input.signerConstructor || SignatureV4;
      return new SignerCtor(params);
    });
  } else {
    signer = async (authScheme) => {
      authScheme = Object.assign({}, {
        name: "sigv4",
        signingName: input.signingName || input.defaultSigningName,
        signingRegion: await normalizeProvider(input.region)(),
        properties: {}
      }, authScheme);
      const signingRegion = authScheme.signingRegion;
      const signingService = authScheme.signingName;
      input.signingRegion = input.signingRegion || signingRegion;
      input.signingName = input.signingName || signingService || input.serviceId;
      const params = {
        ...input,
        credentials: normalizedCreds,
        region: input.signingRegion,
        service: input.signingName,
        sha256,
        uriEscapePath: signingEscapePath
      };
      const SignerCtor = input.signerConstructor || SignatureV4;
      return new SignerCtor(params);
    };
  }
  return {
    ...input,
    systemClockOffset,
    signingEscapePath,
    credentials: normalizedCreds,
    signer
  };
};
var normalizeCredentialProvider = (credentials) => {
  if (typeof credentials === "function") {
    return memoize(credentials, (credentials2) => credentials2.expiration !== void 0 && credentials2.expiration.getTime() - Date.now() < CREDENTIAL_EXPIRE_WINDOW, (credentials2) => credentials2.expiration !== void 0);
  }
  return normalizeProvider(credentials);
};
var getSkewCorrectedDate = (systemClockOffset) => new Date(Date.now() + systemClockOffset);
var isClockSkewed = (clockTime, systemClockOffset) => Math.abs(getSkewCorrectedDate(systemClockOffset).getTime() - clockTime) >= 3e5;
var getUpdatedSystemClockOffset = (clockTime, currentSystemClockOffset) => {
  const clockTimeInMs = Date.parse(clockTime);
  if (isClockSkewed(clockTimeInMs, currentSystemClockOffset)) {
    return clockTimeInMs - Date.now();
  }
  return currentSystemClockOffset;
};
var awsAuthMiddleware = (options) => (next, context) => async function(args) {
  var _a, _b, _c, _d;
  if (!HttpRequest.isInstance(args.request))
    return next(args);
  const authScheme = (_c = (_b = (_a = context.endpointV2) == null ? void 0 : _a.properties) == null ? void 0 : _b.authSchemes) == null ? void 0 : _c[0];
  const multiRegionOverride = (authScheme == null ? void 0 : authScheme.name) === "sigv4a" ? (_d = authScheme == null ? void 0 : authScheme.signingRegionSet) == null ? void 0 : _d.join(",") : void 0;
  const signer = await options.signer(authScheme);
  const output = await next({
    ...args,
    request: await signer.sign(args.request, {
      signingDate: getSkewCorrectedDate(options.systemClockOffset),
      signingRegion: multiRegionOverride || context["signing_region"],
      signingService: context["signing_service"]
    })
  }).catch((error) => {
    const serverTime = error.ServerTime ?? getDateHeader(error.$response);
    if (serverTime) {
      options.systemClockOffset = getUpdatedSystemClockOffset(serverTime, options.systemClockOffset);
    }
    throw error;
  });
  const dateHeader = getDateHeader(output.response);
  if (dateHeader) {
    options.systemClockOffset = getUpdatedSystemClockOffset(dateHeader, options.systemClockOffset);
  }
  return output;
};
var getDateHeader = (response2) => {
  var _a, _b;
  return HttpResponse.isInstance(response2) ? ((_a = response2.headers) == null ? void 0 : _a.date) ?? ((_b = response2.headers) == null ? void 0 : _b.Date) : void 0;
};
var awsAuthMiddlewareOptions = {
  name: "awsAuthMiddleware",
  tags: ["SIGNATURE", "AWSAUTH"],
  relation: "after",
  toMiddleware: "retryMiddleware",
  override: true
};
var getAwsAuthPlugin = (options) => ({
  applyToStack: (clientStack) => {
    clientStack.addRelativeTo(awsAuthMiddleware(options), awsAuthMiddlewareOptions);
  }
});
function resolveUserAgentConfig(input) {
  return {
    ...input,
    customUserAgent: typeof input.customUserAgent === "string" ? [[input.customUserAgent]] : input.customUserAgent
  };
}
var partitions_default = {
  partitions: [{
    id: "aws",
    outputs: {
      dnsSuffix: "amazonaws.com",
      dualStackDnsSuffix: "api.aws",
      name: "aws",
      supportsDualStack: true,
      supportsFIPS: true
    },
    regionRegex: "^(us|eu|ap|sa|ca|me|af)\\-\\w+\\-\\d+$",
    regions: {
      "af-south-1": {
        description: "Africa (Cape Town)"
      },
      "ap-east-1": {
        description: "Asia Pacific (Hong Kong)"
      },
      "ap-northeast-1": {
        description: "Asia Pacific (Tokyo)"
      },
      "ap-northeast-2": {
        description: "Asia Pacific (Seoul)"
      },
      "ap-northeast-3": {
        description: "Asia Pacific (Osaka)"
      },
      "ap-south-1": {
        description: "Asia Pacific (Mumbai)"
      },
      "ap-south-2": {
        description: "Asia Pacific (Hyderabad)"
      },
      "ap-southeast-1": {
        description: "Asia Pacific (Singapore)"
      },
      "ap-southeast-2": {
        description: "Asia Pacific (Sydney)"
      },
      "ap-southeast-3": {
        description: "Asia Pacific (Jakarta)"
      },
      "ap-southeast-4": {
        description: "Asia Pacific (Melbourne)"
      },
      "aws-global": {
        description: "AWS Standard global region"
      },
      "ca-central-1": {
        description: "Canada (Central)"
      },
      "eu-central-1": {
        description: "Europe (Frankfurt)"
      },
      "eu-central-2": {
        description: "Europe (Zurich)"
      },
      "eu-north-1": {
        description: "Europe (Stockholm)"
      },
      "eu-south-1": {
        description: "Europe (Milan)"
      },
      "eu-south-2": {
        description: "Europe (Spain)"
      },
      "eu-west-1": {
        description: "Europe (Ireland)"
      },
      "eu-west-2": {
        description: "Europe (London)"
      },
      "eu-west-3": {
        description: "Europe (Paris)"
      },
      "me-central-1": {
        description: "Middle East (UAE)"
      },
      "me-south-1": {
        description: "Middle East (Bahrain)"
      },
      "sa-east-1": {
        description: "South America (Sao Paulo)"
      },
      "us-east-1": {
        description: "US East (N. Virginia)"
      },
      "us-east-2": {
        description: "US East (Ohio)"
      },
      "us-west-1": {
        description: "US West (N. California)"
      },
      "us-west-2": {
        description: "US West (Oregon)"
      }
    }
  }, {
    id: "aws-cn",
    outputs: {
      dnsSuffix: "amazonaws.com.cn",
      dualStackDnsSuffix: "api.amazonwebservices.com.cn",
      name: "aws-cn",
      supportsDualStack: true,
      supportsFIPS: true
    },
    regionRegex: "^cn\\-\\w+\\-\\d+$",
    regions: {
      "aws-cn-global": {
        description: "AWS China global region"
      },
      "cn-north-1": {
        description: "China (Beijing)"
      },
      "cn-northwest-1": {
        description: "China (Ningxia)"
      }
    }
  }, {
    id: "aws-us-gov",
    outputs: {
      dnsSuffix: "amazonaws.com",
      dualStackDnsSuffix: "api.aws",
      name: "aws-us-gov",
      supportsDualStack: true,
      supportsFIPS: true
    },
    regionRegex: "^us\\-gov\\-\\w+\\-\\d+$",
    regions: {
      "aws-us-gov-global": {
        description: "AWS GovCloud (US) global region"
      },
      "us-gov-east-1": {
        description: "AWS GovCloud (US-East)"
      },
      "us-gov-west-1": {
        description: "AWS GovCloud (US-West)"
      }
    }
  }, {
    id: "aws-iso",
    outputs: {
      dnsSuffix: "c2s.ic.gov",
      dualStackDnsSuffix: "c2s.ic.gov",
      name: "aws-iso",
      supportsDualStack: false,
      supportsFIPS: true
    },
    regionRegex: "^us\\-iso\\-\\w+\\-\\d+$",
    regions: {
      "aws-iso-global": {
        description: "AWS ISO (US) global region"
      },
      "us-iso-east-1": {
        description: "US ISO East"
      },
      "us-iso-west-1": {
        description: "US ISO WEST"
      }
    }
  }, {
    id: "aws-iso-b",
    outputs: {
      dnsSuffix: "sc2s.sgov.gov",
      dualStackDnsSuffix: "sc2s.sgov.gov",
      name: "aws-iso-b",
      supportsDualStack: false,
      supportsFIPS: true
    },
    regionRegex: "^us\\-isob\\-\\w+\\-\\d+$",
    regions: {
      "aws-iso-b-global": {
        description: "AWS ISOB (US) global region"
      },
      "us-isob-east-1": {
        description: "US ISOB East (Ohio)"
      }
    }
  }, {
    id: "aws-iso-e",
    outputs: {
      dnsSuffix: "cloud.adc-e.uk",
      dualStackDnsSuffix: "cloud.adc-e.uk",
      name: "aws-iso-e",
      supportsDualStack: false,
      supportsFIPS: true
    },
    regionRegex: "^eu\\-isoe\\-\\w+\\-\\d+$",
    regions: {}
  }, {
    id: "aws-iso-f",
    outputs: {
      dnsSuffix: "csp.hci.ic.gov",
      dualStackDnsSuffix: "csp.hci.ic.gov",
      name: "aws-iso-f",
      supportsDualStack: false,
      supportsFIPS: true
    },
    regionRegex: "^us\\-isof\\-\\w+\\-\\d+$",
    regions: {}
  }],
  version: "1.1"
};
var selectedPartitionsInfo = partitions_default;
var selectedUserAgentPrefix = "";
var partition = (value) => {
  const { partitions } = selectedPartitionsInfo;
  for (const partition2 of partitions) {
    const { regions, outputs } = partition2;
    for (const [region, regionData] of Object.entries(regions)) {
      if (region === value) {
        return {
          ...outputs,
          ...regionData
        };
      }
    }
  }
  for (const partition2 of partitions) {
    const { regionRegex, outputs } = partition2;
    if (new RegExp(regionRegex).test(value)) {
      return {
        ...outputs
      };
    }
  }
  const DEFAULT_PARTITION = partitions.find((partition2) => partition2.id === "aws");
  if (!DEFAULT_PARTITION) {
    throw new Error("Provided region was not found in the partition array or regex, and default partition with id 'aws' doesn't exist.");
  }
  return {
    ...DEFAULT_PARTITION.outputs
  };
};
var setPartitionInfo = (partitionsInfo, userAgentPrefix = "") => {
  selectedPartitionsInfo = partitionsInfo;
  selectedUserAgentPrefix = userAgentPrefix;
};
var useDefaultPartitionInfo = () => {
  setPartitionInfo(partitions_default, "");
};
var getUserAgentPrefix = () => selectedUserAgentPrefix;
var debugId = "endpoints";
function toDebugString(input) {
  if (typeof input !== "object" || input == null) {
    return input;
  }
  if ("ref" in input) {
    return `$${toDebugString(input.ref)}`;
  }
  if ("fn" in input) {
    return `${input.fn}(${(input.argv || []).map(toDebugString).join(", ")})`;
  }
  return JSON.stringify(input, null, 2);
}
var EndpointError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "EndpointError";
  }
};
var lib_exports = {};
__export(lib_exports, {
  aws: () => aws_exports,
  booleanEquals: () => booleanEquals,
  getAttr: () => getAttr,
  isSet: () => isSet,
  isValidHostLabel: () => isValidHostLabel,
  not: () => not,
  parseURL: () => parseURL,
  stringEquals: () => stringEquals,
  substring: () => substring,
  uriEncode: () => uriEncode
});
var aws_exports = {};
__export(aws_exports, {
  getUserAgentPrefix: () => getUserAgentPrefix,
  isVirtualHostableS3Bucket: () => isVirtualHostableS3Bucket,
  parseArn: () => parseArn,
  partition: () => partition,
  setPartitionInfo: () => setPartitionInfo,
  useDefaultPartitionInfo: () => useDefaultPartitionInfo
});
var IP_V4_REGEX = new RegExp(`^(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}$`);
var isIpAddress = (value) => IP_V4_REGEX.test(value) || value.startsWith("[") && value.endsWith("]");
var VALID_HOST_LABEL_REGEX = new RegExp(`^(?!.*-$)(?!-)[a-zA-Z0-9-]{1,63}$`);
var isValidHostLabel = (value, allowSubDomains = false) => {
  if (!allowSubDomains) {
    return VALID_HOST_LABEL_REGEX.test(value);
  }
  const labels = value.split(".");
  for (const label of labels) {
    if (!isValidHostLabel(label)) {
      return false;
    }
  }
  return true;
};
var isVirtualHostableS3Bucket = (value, allowSubDomains = false) => {
  if (allowSubDomains) {
    for (const label of value.split(".")) {
      if (!isVirtualHostableS3Bucket(label)) {
        return false;
      }
    }
    return true;
  }
  if (!isValidHostLabel(value)) {
    return false;
  }
  if (value.length < 3 || value.length > 63) {
    return false;
  }
  if (value !== value.toLowerCase()) {
    return false;
  }
  if (isIpAddress(value)) {
    return false;
  }
  return true;
};
var parseArn = (value) => {
  const segments = value.split(":");
  if (segments.length < 6)
    return null;
  const [arn, partition2, service, region, accountId, ...resourceId] = segments;
  if (arn !== "arn" || partition2 === "" || service === "" || resourceId[0] === "")
    return null;
  return {
    partition: partition2,
    service,
    region,
    accountId,
    resourceId: resourceId[0].includes("/") ? resourceId[0].split("/") : resourceId
  };
};
var booleanEquals = (value1, value2) => value1 === value2;
var getAttrPathList = (path2) => {
  const parts = path2.split(".");
  const pathList = [];
  for (const part of parts) {
    const squareBracketIndex = part.indexOf("[");
    if (squareBracketIndex !== -1) {
      if (part.indexOf("]") !== part.length - 1) {
        throw new EndpointError(`Path: '${path2}' does not end with ']'`);
      }
      const arrayIndex = part.slice(squareBracketIndex + 1, -1);
      if (Number.isNaN(parseInt(arrayIndex))) {
        throw new EndpointError(`Invalid array index: '${arrayIndex}' in path: '${path2}'`);
      }
      if (squareBracketIndex !== 0) {
        pathList.push(part.slice(0, squareBracketIndex));
      }
      pathList.push(arrayIndex);
    } else {
      pathList.push(part);
    }
  }
  return pathList;
};
var getAttr = (value, path2) => getAttrPathList(path2).reduce((acc, index) => {
  if (typeof acc !== "object") {
    throw new EndpointError(`Index '${index}' in '${path2}' not found in '${JSON.stringify(value)}'`);
  } else if (Array.isArray(acc)) {
    return acc[parseInt(index)];
  }
  return acc[index];
}, value);
var isSet = (value) => value != null;
var not = (value) => !value;
var HttpAuthLocation;
(function(HttpAuthLocation3) {
  HttpAuthLocation3["HEADER"] = "header";
  HttpAuthLocation3["QUERY"] = "query";
})(HttpAuthLocation || (HttpAuthLocation = {}));
var HostAddressType;
(function(HostAddressType2) {
  HostAddressType2["AAAA"] = "AAAA";
  HostAddressType2["A"] = "A";
})(HostAddressType || (HostAddressType = {}));
var EndpointURLScheme;
(function(EndpointURLScheme3) {
  EndpointURLScheme3["HTTP"] = "http";
  EndpointURLScheme3["HTTPS"] = "https";
})(EndpointURLScheme || (EndpointURLScheme = {}));
var RequestHandlerProtocol;
(function(RequestHandlerProtocol3) {
  RequestHandlerProtocol3["HTTP_0_9"] = "http/0.9";
  RequestHandlerProtocol3["HTTP_1_0"] = "http/1.0";
  RequestHandlerProtocol3["TDS_8_0"] = "tds/8.0";
})(RequestHandlerProtocol || (RequestHandlerProtocol = {}));
var DEFAULT_PORTS = {
  [EndpointURLScheme.HTTP]: 80,
  [EndpointURLScheme.HTTPS]: 443
};
var parseURL = (value) => {
  const whatwgURL = (() => {
    try {
      if (value instanceof URL) {
        return value;
      }
      if (typeof value === "object" && "hostname" in value) {
        const { hostname: hostname2, port, protocol: protocol2 = "", path: path2 = "", query = {} } = value;
        const url = new URL(`${protocol2}//${hostname2}${port ? `:${port}` : ""}${path2}`);
        url.search = Object.entries(query).map(([k5, v3]) => `${k5}=${v3}`).join("&");
        return url;
      }
      return new URL(value);
    } catch (error) {
      return null;
    }
  })();
  if (!whatwgURL) {
    console.error(`Unable to parse ${JSON.stringify(value)} as a whatwg URL.`);
    return null;
  }
  const urlString = whatwgURL.href;
  const { host, hostname, pathname, protocol, search } = whatwgURL;
  if (search) {
    return null;
  }
  const scheme = protocol.slice(0, -1);
  if (!Object.values(EndpointURLScheme).includes(scheme)) {
    return null;
  }
  const isIp = isIpAddress(hostname);
  const inputContainsDefaultPort = urlString.includes(`${host}:${DEFAULT_PORTS[scheme]}`) || typeof value === "string" && value.includes(`${host}:${DEFAULT_PORTS[scheme]}`);
  const authority = `${host}${inputContainsDefaultPort ? `:${DEFAULT_PORTS[scheme]}` : ``}`;
  return {
    scheme,
    authority,
    path: pathname,
    normalizedPath: pathname.endsWith("/") ? pathname : `${pathname}/`,
    isIp
  };
};
var stringEquals = (value1, value2) => value1 === value2;
var substring = (input, start, stop, reverse) => {
  if (start >= stop || input.length < stop) {
    return null;
  }
  if (!reverse) {
    return input.substring(start, stop);
  }
  return input.substring(input.length - stop, input.length - start);
};
var uriEncode = (value) => encodeURIComponent(value).replace(/[!*'()]/g, (c5) => `%${c5.charCodeAt(0).toString(16).toUpperCase()}`);
var evaluateTemplate = (template, options) => {
  const evaluatedTemplateArr = [];
  const templateContext = {
    ...options.endpointParams,
    ...options.referenceRecord
  };
  let currentIndex = 0;
  while (currentIndex < template.length) {
    const openingBraceIndex = template.indexOf("{", currentIndex);
    if (openingBraceIndex === -1) {
      evaluatedTemplateArr.push(template.slice(currentIndex));
      break;
    }
    evaluatedTemplateArr.push(template.slice(currentIndex, openingBraceIndex));
    const closingBraceIndex = template.indexOf("}", openingBraceIndex);
    if (closingBraceIndex === -1) {
      evaluatedTemplateArr.push(template.slice(openingBraceIndex));
      break;
    }
    if (template[openingBraceIndex + 1] === "{" && template[closingBraceIndex + 1] === "}") {
      evaluatedTemplateArr.push(template.slice(openingBraceIndex + 1, closingBraceIndex));
      currentIndex = closingBraceIndex + 2;
    }
    const parameterName = template.substring(openingBraceIndex + 1, closingBraceIndex);
    if (parameterName.includes("#")) {
      const [refName, attrName] = parameterName.split("#");
      evaluatedTemplateArr.push(getAttr(templateContext[refName], attrName));
    } else {
      evaluatedTemplateArr.push(templateContext[parameterName]);
    }
    currentIndex = closingBraceIndex + 1;
  }
  return evaluatedTemplateArr.join("");
};
var getReferenceValue = ({ ref }, options) => {
  const referenceRecord = {
    ...options.endpointParams,
    ...options.referenceRecord
  };
  return referenceRecord[ref];
};
var evaluateExpression = (obj, keyName, options) => {
  if (typeof obj === "string") {
    return evaluateTemplate(obj, options);
  } else if (obj["fn"]) {
    return callFunction(obj, options);
  } else if (obj["ref"]) {
    return getReferenceValue(obj, options);
  }
  throw new EndpointError(`'${keyName}': ${String(obj)} is not a string, function or reference.`);
};
var callFunction = ({ fn, argv }, options) => {
  const evaluatedArgs = argv.map((arg) => ["boolean", "number"].includes(typeof arg) ? arg : evaluateExpression(arg, "arg", options));
  return fn.split(".").reduce((acc, key) => acc[key], lib_exports)(...evaluatedArgs);
};
var evaluateCondition = ({ assign, ...fnArgs }, options) => {
  var _a, _b;
  if (assign && assign in options.referenceRecord) {
    throw new EndpointError(`'${assign}' is already defined in Reference Record.`);
  }
  const value = callFunction(fnArgs, options);
  (_b = (_a = options.logger) == null ? void 0 : _a.debug) == null ? void 0 : _b.call(_a, debugId, `evaluateCondition: ${toDebugString(fnArgs)} = ${toDebugString(value)}`);
  return {
    result: value === "" ? true : !!value,
    ...assign != null && { toAssign: { name: assign, value } }
  };
};
var evaluateConditions = (conditions = [], options) => {
  var _a, _b;
  const conditionsReferenceRecord = {};
  for (const condition of conditions) {
    const { result, toAssign } = evaluateCondition(condition, {
      ...options,
      referenceRecord: {
        ...options.referenceRecord,
        ...conditionsReferenceRecord
      }
    });
    if (!result) {
      return { result };
    }
    if (toAssign) {
      conditionsReferenceRecord[toAssign.name] = toAssign.value;
      (_b = (_a = options.logger) == null ? void 0 : _a.debug) == null ? void 0 : _b.call(_a, debugId, `assign: ${toAssign.name} := ${toDebugString(toAssign.value)}`);
    }
  }
  return { result: true, referenceRecord: conditionsReferenceRecord };
};
var getEndpointHeaders = (headers, options) => Object.entries(headers).reduce((acc, [headerKey, headerVal]) => ({
  ...acc,
  [headerKey]: headerVal.map((headerValEntry) => {
    const processedExpr = evaluateExpression(headerValEntry, "Header value entry", options);
    if (typeof processedExpr !== "string") {
      throw new EndpointError(`Header '${headerKey}' value '${processedExpr}' is not a string`);
    }
    return processedExpr;
  })
}), {});
var getEndpointProperty = (property, options) => {
  if (Array.isArray(property)) {
    return property.map((propertyEntry) => getEndpointProperty(propertyEntry, options));
  }
  switch (typeof property) {
    case "string":
      return evaluateTemplate(property, options);
    case "object":
      if (property === null) {
        throw new EndpointError(`Unexpected endpoint property: ${property}`);
      }
      return getEndpointProperties(property, options);
    case "boolean":
      return property;
    default:
      throw new EndpointError(`Unexpected endpoint property type: ${typeof property}`);
  }
};
var getEndpointProperties = (properties, options) => Object.entries(properties).reduce((acc, [propertyKey, propertyVal]) => ({
  ...acc,
  [propertyKey]: getEndpointProperty(propertyVal, options)
}), {});
var getEndpointUrl = (endpointUrl, options) => {
  const expression = evaluateExpression(endpointUrl, "Endpoint URL", options);
  if (typeof expression === "string") {
    try {
      return new URL(expression);
    } catch (error) {
      console.error(`Failed to construct URL with ${expression}`, error);
      throw error;
    }
  }
  throw new EndpointError(`Endpoint URL must be a string, got ${typeof expression}`);
};
var evaluateEndpointRule = (endpointRule, options) => {
  var _a, _b;
  const { conditions, endpoint } = endpointRule;
  const { result, referenceRecord } = evaluateConditions(conditions, options);
  if (!result) {
    return;
  }
  const endpointRuleOptions = {
    ...options,
    referenceRecord: { ...options.referenceRecord, ...referenceRecord }
  };
  const { url, properties, headers } = endpoint;
  (_b = (_a = options.logger) == null ? void 0 : _a.debug) == null ? void 0 : _b.call(_a, debugId, `Resolving endpoint from template: ${toDebugString(endpoint)}`);
  return {
    ...headers != void 0 && {
      headers: getEndpointHeaders(headers, endpointRuleOptions)
    },
    ...properties != void 0 && {
      properties: getEndpointProperties(properties, endpointRuleOptions)
    },
    url: getEndpointUrl(url, endpointRuleOptions)
  };
};
var evaluateErrorRule = (errorRule, options) => {
  const { conditions, error } = errorRule;
  const { result, referenceRecord } = evaluateConditions(conditions, options);
  if (!result) {
    return;
  }
  throw new EndpointError(evaluateExpression(error, "Error", {
    ...options,
    referenceRecord: { ...options.referenceRecord, ...referenceRecord }
  }));
};
var evaluateTreeRule = (treeRule, options) => {
  const { conditions, rules } = treeRule;
  const { result, referenceRecord } = evaluateConditions(conditions, options);
  if (!result) {
    return;
  }
  return evaluateRules(rules, {
    ...options,
    referenceRecord: { ...options.referenceRecord, ...referenceRecord }
  });
};
var evaluateRules = (rules, options) => {
  for (const rule of rules) {
    if (rule.type === "endpoint") {
      const endpointOrUndefined = evaluateEndpointRule(rule, options);
      if (endpointOrUndefined) {
        return endpointOrUndefined;
      }
    } else if (rule.type === "error") {
      evaluateErrorRule(rule, options);
    } else if (rule.type === "tree") {
      const endpointOrUndefined = evaluateTreeRule(rule, options);
      if (endpointOrUndefined) {
        return endpointOrUndefined;
      }
    } else {
      throw new EndpointError(`Unknown endpoint rule: ${rule}`);
    }
  }
  throw new EndpointError(`Rules evaluation failed`);
};
var resolveEndpoint = (ruleSetObject, options) => {
  var _a, _b, _c, _d, _e;
  const { endpointParams, logger: logger2 } = options;
  const { parameters, rules } = ruleSetObject;
  (_b = (_a = options.logger) == null ? void 0 : _a.debug) == null ? void 0 : _b.call(_a, `${debugId} Initial EndpointParams: ${toDebugString(endpointParams)}`);
  const paramsWithDefault = Object.entries(parameters).filter(([, v3]) => v3.default != null).map(([k5, v3]) => [k5, v3.default]);
  if (paramsWithDefault.length > 0) {
    for (const [paramKey, paramDefaultValue] of paramsWithDefault) {
      endpointParams[paramKey] = endpointParams[paramKey] ?? paramDefaultValue;
    }
  }
  const requiredParams = Object.entries(parameters).filter(([, v3]) => v3.required).map(([k5]) => k5);
  for (const requiredParam of requiredParams) {
    if (endpointParams[requiredParam] == null) {
      throw new EndpointError(`Missing required parameter: '${requiredParam}'`);
    }
  }
  const endpoint = evaluateRules(rules, { endpointParams, logger: logger2, referenceRecord: {} });
  if ((_c = options.endpointParams) == null ? void 0 : _c.Endpoint) {
    try {
      const givenEndpoint = new URL(options.endpointParams.Endpoint);
      const { protocol, port } = givenEndpoint;
      endpoint.url.protocol = protocol;
      endpoint.url.port = port;
    } catch (e5) {
    }
  }
  (_e = (_d = options.logger) == null ? void 0 : _d.debug) == null ? void 0 : _e.call(_d, `${debugId} Resolved endpoint: ${toDebugString(endpoint)}`);
  return endpoint;
};
var USER_AGENT = "user-agent";
var X_AMZ_USER_AGENT = "x-amz-user-agent";
var SPACE = " ";
var UA_NAME_SEPARATOR = "/";
var UA_NAME_ESCAPE_REGEX = /[^\!\$\%\&\'\*\+\-\.\^\_\`\|\~\d\w]/g;
var UA_VALUE_ESCAPE_REGEX = /[^\!\$\%\&\'\*\+\-\.\^\_\`\|\~\d\w\#]/g;
var UA_ESCAPE_CHAR = "-";
var userAgentMiddleware = (options) => (next, context) => async (args) => {
  var _a, _b;
  const { request: request2 } = args;
  if (!HttpRequest.isInstance(request2))
    return next(args);
  const { headers } = request2;
  const userAgent = ((_a = context == null ? void 0 : context.userAgent) == null ? void 0 : _a.map(escapeUserAgent)) || [];
  const defaultUserAgent2 = (await options.defaultUserAgentProvider()).map(escapeUserAgent);
  const customUserAgent = ((_b = options == null ? void 0 : options.customUserAgent) == null ? void 0 : _b.map(escapeUserAgent)) || [];
  const prefix = getUserAgentPrefix();
  const sdkUserAgentValue = (prefix ? [prefix] : []).concat([...defaultUserAgent2, ...userAgent, ...customUserAgent]).join(SPACE);
  const normalUAValue = [
    ...defaultUserAgent2.filter((section) => section.startsWith("aws-sdk-")),
    ...customUserAgent
  ].join(SPACE);
  if (options.runtime !== "browser") {
    if (normalUAValue) {
      headers[X_AMZ_USER_AGENT] = headers[X_AMZ_USER_AGENT] ? `${headers[USER_AGENT]} ${normalUAValue}` : normalUAValue;
    }
    headers[USER_AGENT] = sdkUserAgentValue;
  } else {
    headers[X_AMZ_USER_AGENT] = sdkUserAgentValue;
  }
  return next({
    ...args,
    request: request2
  });
};
var escapeUserAgent = (userAgentPair) => {
  var _a;
  const name = userAgentPair[0].split(UA_NAME_SEPARATOR).map((part) => part.replace(UA_NAME_ESCAPE_REGEX, UA_ESCAPE_CHAR)).join(UA_NAME_SEPARATOR);
  const version = (_a = userAgentPair[1]) == null ? void 0 : _a.replace(UA_VALUE_ESCAPE_REGEX, UA_ESCAPE_CHAR);
  const prefixSeparatorIndex = name.indexOf(UA_NAME_SEPARATOR);
  const prefix = name.substring(0, prefixSeparatorIndex);
  let uaName = name.substring(prefixSeparatorIndex + 1);
  if (prefix === "api") {
    uaName = uaName.toLowerCase();
  }
  return [prefix, uaName, version].filter((item) => item && item.length > 0).reduce((acc, item, index) => {
    switch (index) {
      case 0:
        return item;
      case 1:
        return `${acc}/${item}`;
      default:
        return `${acc}#${item}`;
    }
  }, "");
};
var getUserAgentMiddlewareOptions = {
  name: "getUserAgentMiddleware",
  step: "build",
  priority: "low",
  tags: ["SET_USER_AGENT", "USER_AGENT"],
  override: true
};
var getUserAgentPlugin = (config) => ({
  applyToStack: (clientStack) => {
    clientStack.add(userAgentMiddleware(config), getUserAgentMiddlewareOptions);
  }
});
var NoOpLogger = class {
  trace() {
  }
  debug() {
  }
  info() {
  }
  warn() {
  }
  error() {
  }
};
var constructStack = () => {
  let absoluteEntries = [];
  let relativeEntries = [];
  const entriesNameSet = /* @__PURE__ */ new Set();
  const sort = (entries) => entries.sort((a5, b5) => stepWeights[b5.step] - stepWeights[a5.step] || priorityWeights[b5.priority || "normal"] - priorityWeights[a5.priority || "normal"]);
  const removeByName = (toRemove) => {
    let isRemoved = false;
    const filterCb = (entry2) => {
      if (entry2.name && entry2.name === toRemove) {
        isRemoved = true;
        entriesNameSet.delete(toRemove);
        return false;
      }
      return true;
    };
    absoluteEntries = absoluteEntries.filter(filterCb);
    relativeEntries = relativeEntries.filter(filterCb);
    return isRemoved;
  };
  const removeByReference = (toRemove) => {
    let isRemoved = false;
    const filterCb = (entry2) => {
      if (entry2.middleware === toRemove) {
        isRemoved = true;
        if (entry2.name)
          entriesNameSet.delete(entry2.name);
        return false;
      }
      return true;
    };
    absoluteEntries = absoluteEntries.filter(filterCb);
    relativeEntries = relativeEntries.filter(filterCb);
    return isRemoved;
  };
  const cloneTo = (toStack) => {
    absoluteEntries.forEach((entry2) => {
      toStack.add(entry2.middleware, { ...entry2 });
    });
    relativeEntries.forEach((entry2) => {
      toStack.addRelativeTo(entry2.middleware, { ...entry2 });
    });
    return toStack;
  };
  const expandRelativeMiddlewareList = (from) => {
    const expandedMiddlewareList = [];
    from.before.forEach((entry2) => {
      if (entry2.before.length === 0 && entry2.after.length === 0) {
        expandedMiddlewareList.push(entry2);
      } else {
        expandedMiddlewareList.push(...expandRelativeMiddlewareList(entry2));
      }
    });
    expandedMiddlewareList.push(from);
    from.after.reverse().forEach((entry2) => {
      if (entry2.before.length === 0 && entry2.after.length === 0) {
        expandedMiddlewareList.push(entry2);
      } else {
        expandedMiddlewareList.push(...expandRelativeMiddlewareList(entry2));
      }
    });
    return expandedMiddlewareList;
  };
  const getMiddlewareList = (debug = false) => {
    const normalizedAbsoluteEntries = [];
    const normalizedRelativeEntries = [];
    const normalizedEntriesNameMap = {};
    absoluteEntries.forEach((entry2) => {
      const normalizedEntry = {
        ...entry2,
        before: [],
        after: []
      };
      if (normalizedEntry.name)
        normalizedEntriesNameMap[normalizedEntry.name] = normalizedEntry;
      normalizedAbsoluteEntries.push(normalizedEntry);
    });
    relativeEntries.forEach((entry2) => {
      const normalizedEntry = {
        ...entry2,
        before: [],
        after: []
      };
      if (normalizedEntry.name)
        normalizedEntriesNameMap[normalizedEntry.name] = normalizedEntry;
      normalizedRelativeEntries.push(normalizedEntry);
    });
    normalizedRelativeEntries.forEach((entry2) => {
      if (entry2.toMiddleware) {
        const toMiddleware = normalizedEntriesNameMap[entry2.toMiddleware];
        if (toMiddleware === void 0) {
          if (debug) {
            return;
          }
          throw new Error(`${entry2.toMiddleware} is not found when adding ${entry2.name || "anonymous"} middleware ${entry2.relation} ${entry2.toMiddleware}`);
        }
        if (entry2.relation === "after") {
          toMiddleware.after.push(entry2);
        }
        if (entry2.relation === "before") {
          toMiddleware.before.push(entry2);
        }
      }
    });
    const mainChain = sort(normalizedAbsoluteEntries).map(expandRelativeMiddlewareList).reduce((wholeList, expendedMiddlewareList) => {
      wholeList.push(...expendedMiddlewareList);
      return wholeList;
    }, []);
    return mainChain;
  };
  const stack = {
    add: (middleware, options = {}) => {
      const { name, override } = options;
      const entry2 = {
        step: "initialize",
        priority: "normal",
        middleware,
        ...options
      };
      if (name) {
        if (entriesNameSet.has(name)) {
          if (!override)
            throw new Error(`Duplicate middleware name '${name}'`);
          const toOverrideIndex = absoluteEntries.findIndex((entry22) => entry22.name === name);
          const toOverride = absoluteEntries[toOverrideIndex];
          if (toOverride.step !== entry2.step || toOverride.priority !== entry2.priority) {
            throw new Error(`"${name}" middleware with ${toOverride.priority} priority in ${toOverride.step} step cannot be overridden by same-name middleware with ${entry2.priority} priority in ${entry2.step} step.`);
          }
          absoluteEntries.splice(toOverrideIndex, 1);
        }
        entriesNameSet.add(name);
      }
      absoluteEntries.push(entry2);
    },
    addRelativeTo: (middleware, options) => {
      const { name, override } = options;
      const entry2 = {
        middleware,
        ...options
      };
      if (name) {
        if (entriesNameSet.has(name)) {
          if (!override)
            throw new Error(`Duplicate middleware name '${name}'`);
          const toOverrideIndex = relativeEntries.findIndex((entry22) => entry22.name === name);
          const toOverride = relativeEntries[toOverrideIndex];
          if (toOverride.toMiddleware !== entry2.toMiddleware || toOverride.relation !== entry2.relation) {
            throw new Error(`"${name}" middleware ${toOverride.relation} "${toOverride.toMiddleware}" middleware cannot be overridden by same-name middleware ${entry2.relation} "${entry2.toMiddleware}" middleware.`);
          }
          relativeEntries.splice(toOverrideIndex, 1);
        }
        entriesNameSet.add(name);
      }
      relativeEntries.push(entry2);
    },
    clone: () => cloneTo(constructStack()),
    use: (plugin) => {
      plugin.applyToStack(stack);
    },
    remove: (toRemove) => {
      if (typeof toRemove === "string")
        return removeByName(toRemove);
      else
        return removeByReference(toRemove);
    },
    removeByTag: (toRemove) => {
      let isRemoved = false;
      const filterCb = (entry2) => {
        const { tags, name } = entry2;
        if (tags && tags.includes(toRemove)) {
          if (name)
            entriesNameSet.delete(name);
          isRemoved = true;
          return false;
        }
        return true;
      };
      absoluteEntries = absoluteEntries.filter(filterCb);
      relativeEntries = relativeEntries.filter(filterCb);
      return isRemoved;
    },
    concat: (from) => {
      const cloned = cloneTo(constructStack());
      cloned.use(from);
      return cloned;
    },
    applyToStack: cloneTo,
    identify: () => {
      return getMiddlewareList(true).map((mw) => {
        return mw.name + ": " + (mw.tags || []).join(",");
      });
    },
    resolve: (handler2, context) => {
      for (const middleware of getMiddlewareList().map((entry2) => entry2.middleware).reverse()) {
        handler2 = middleware(handler2, context);
      }
      return handler2;
    }
  };
  return stack;
};
var stepWeights = {
  initialize: 5,
  serialize: 4,
  build: 3,
  finalizeRequest: 2,
  deserialize: 1
};
var priorityWeights = {
  high: 3,
  normal: 2,
  low: 1
};
var Client = class {
  constructor(config) {
    this.middlewareStack = constructStack();
    this.config = config;
  }
  send(command, optionsOrCb, cb2) {
    const options = typeof optionsOrCb !== "function" ? optionsOrCb : void 0;
    const callback = typeof optionsOrCb === "function" ? optionsOrCb : cb2;
    const handler2 = command.resolveMiddleware(this.middlewareStack, this.config, options);
    if (callback) {
      handler2(command).then((result) => callback(null, result.output), (err) => callback(err)).catch(() => {
      });
    } else {
      return handler2(command).then((result) => result.output);
    }
  }
  destroy() {
    if (this.config.requestHandler.destroy)
      this.config.requestHandler.destroy();
  }
};
var BASE64_REGEX = /^[A-Za-z0-9+/]*={0,2}$/;
var fromBase64 = (input) => {
  if (input.length * 3 % 4 !== 0) {
    throw new TypeError(`Incorrect padding on base64 string.`);
  }
  if (!BASE64_REGEX.exec(input)) {
    throw new TypeError(`Invalid base64 string.`);
  }
  const buffer = fromString(input, "base64");
  return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
};
var toBase64 = (input) => fromArrayBuffer(input.buffer, input.byteOffset, input.byteLength).toString("base64");
function transformToString(payload, encoding = "utf-8") {
  if (encoding === "base64") {
    return toBase64(payload);
  }
  return toUtf84(payload);
}
function transformFromString(str, encoding) {
  if (encoding === "base64") {
    return Uint8ArrayBlobAdapter.mutate(fromBase64(str));
  }
  return Uint8ArrayBlobAdapter.mutate(fromUtf84(str));
}
var Uint8ArrayBlobAdapter = class _Uint8ArrayBlobAdapter extends Uint8Array {
  static fromString(source, encoding = "utf-8") {
    switch (typeof source) {
      case "string":
        return transformFromString(source, encoding);
      default:
        throw new Error(`Unsupported conversion from ${typeof source} to Uint8ArrayBlobAdapter.`);
    }
  }
  static mutate(source) {
    Object.setPrototypeOf(source, _Uint8ArrayBlobAdapter.prototype);
    return source;
  }
  transformToString(encoding = "utf-8") {
    return transformToString(this, encoding);
  }
};
var getAwsChunkedEncodingStream = (readableStream, options) => {
  const { base64Encoder, bodyLengthChecker, checksumAlgorithmFn, checksumLocationName, streamHasher } = options;
  const checksumRequired = base64Encoder !== void 0 && checksumAlgorithmFn !== void 0 && checksumLocationName !== void 0 && streamHasher !== void 0;
  const digest = checksumRequired ? streamHasher(checksumAlgorithmFn, readableStream) : void 0;
  const awsChunkedEncodingStream = new Readable({ read: () => {
  } });
  readableStream.on("data", (data) => {
    const length = bodyLengthChecker(data) || 0;
    awsChunkedEncodingStream.push(`${length.toString(16)}\r
`);
    awsChunkedEncodingStream.push(data);
    awsChunkedEncodingStream.push("\r\n");
  });
  readableStream.on("end", async () => {
    awsChunkedEncodingStream.push(`0\r
`);
    if (checksumRequired) {
      const checksum = base64Encoder(await digest);
      awsChunkedEncodingStream.push(`${checksumLocationName}:${checksum}\r
`);
      awsChunkedEncodingStream.push(`\r
`);
    }
    awsChunkedEncodingStream.push(null);
  });
  return awsChunkedEncodingStream;
};
function buildQueryString(query) {
  const parts = [];
  for (let key of Object.keys(query).sort()) {
    const value = query[key];
    key = escapeUri(key);
    if (Array.isArray(value)) {
      for (let i5 = 0, iLen = value.length; i5 < iLen; i5++) {
        parts.push(`${key}=${escapeUri(value[i5])}`);
      }
    } else {
      let qsEntry = key;
      if (value || typeof value === "string") {
        qsEntry += `=${escapeUri(value)}`;
      }
      parts.push(qsEntry);
    }
  }
  return parts.join("&");
}
var NODEJS_TIMEOUT_ERROR_CODES2 = ["ECONNRESET", "EPIPE", "ETIMEDOUT"];
var getTransformedHeaders = (headers) => {
  const transformedHeaders = {};
  for (const name of Object.keys(headers)) {
    const headerValues = headers[name];
    transformedHeaders[name] = Array.isArray(headerValues) ? headerValues.join(",") : headerValues;
  }
  return transformedHeaders;
};
var setConnectionTimeout = (request2, reject, timeoutInMs = 0) => {
  if (!timeoutInMs) {
    return;
  }
  const timeoutId = setTimeout(() => {
    request2.destroy();
    reject(Object.assign(new Error(`Socket timed out without establishing a connection within ${timeoutInMs} ms`), {
      name: "TimeoutError"
    }));
  }, timeoutInMs);
  request2.on("socket", (socket) => {
    if (socket.connecting) {
      socket.on("connect", () => {
        clearTimeout(timeoutId);
      });
    } else {
      clearTimeout(timeoutId);
    }
  });
};
var setSocketKeepAlive = (request2, { keepAlive, keepAliveMsecs }) => {
  if (keepAlive !== true) {
    return;
  }
  request2.on("socket", (socket) => {
    socket.setKeepAlive(keepAlive, keepAliveMsecs || 0);
  });
};
var setSocketTimeout = (request2, reject, timeoutInMs = 0) => {
  request2.setTimeout(timeoutInMs, () => {
    request2.destroy();
    reject(Object.assign(new Error(`Connection timed out after ${timeoutInMs} ms`), { name: "TimeoutError" }));
  });
};
var MIN_WAIT_TIME = 1e3;
async function writeRequestBody(httpRequest2, request2, maxContinueTimeoutMs = MIN_WAIT_TIME) {
  const headers = request2.headers ?? {};
  const expect = headers["Expect"] || headers["expect"];
  let timeoutId = -1;
  let hasError = false;
  if (expect === "100-continue") {
    await Promise.race([
      new Promise((resolve) => {
        timeoutId = Number(setTimeout(resolve, Math.max(MIN_WAIT_TIME, maxContinueTimeoutMs)));
      }),
      new Promise((resolve) => {
        httpRequest2.on("continue", () => {
          clearTimeout(timeoutId);
          resolve();
        });
        httpRequest2.on("error", () => {
          hasError = true;
          clearTimeout(timeoutId);
          resolve();
        });
      })
    ]);
  }
  if (!hasError) {
    writeBody(httpRequest2, request2.body);
  }
}
function writeBody(httpRequest2, body) {
  if (body instanceof Readable) {
    body.pipe(httpRequest2);
  } else if (body) {
    httpRequest2.end(Buffer.from(body));
  } else {
    httpRequest2.end();
  }
}
var NodeHttpHandler = class {
  constructor(options) {
    this.metadata = { handlerProtocol: "http/1.1" };
    this.configProvider = new Promise((resolve, reject) => {
      if (typeof options === "function") {
        options().then((_options) => {
          resolve(this.resolveDefaultConfig(_options));
        }).catch(reject);
      } else {
        resolve(this.resolveDefaultConfig(options));
      }
    });
  }
  resolveDefaultConfig(options) {
    const { requestTimeout, connectionTimeout, socketTimeout, httpAgent, httpsAgent } = options || {};
    const keepAlive = true;
    const maxSockets = 50;
    return {
      connectionTimeout,
      requestTimeout: requestTimeout ?? socketTimeout,
      httpAgent: httpAgent || new Agent({ keepAlive, maxSockets }),
      httpsAgent: httpsAgent || new Agent$1({ keepAlive, maxSockets })
    };
  }
  destroy() {
    var _a, _b, _c, _d;
    (_b = (_a = this.config) == null ? void 0 : _a.httpAgent) == null ? void 0 : _b.destroy();
    (_d = (_c = this.config) == null ? void 0 : _c.httpsAgent) == null ? void 0 : _d.destroy();
  }
  async handle(request2, { abortSignal } = {}) {
    if (!this.config) {
      this.config = await this.configProvider;
    }
    return new Promise((_resolve, _reject) => {
      let writeRequestBodyPromise = void 0;
      const resolve = async (arg) => {
        await writeRequestBodyPromise;
        _resolve(arg);
      };
      const reject = async (arg) => {
        await writeRequestBodyPromise;
        _reject(arg);
      };
      if (!this.config) {
        throw new Error("Node HTTP request handler config is not resolved");
      }
      if (abortSignal == null ? void 0 : abortSignal.aborted) {
        const abortError = new Error("Request aborted");
        abortError.name = "AbortError";
        reject(abortError);
        return;
      }
      const isSSL = request2.protocol === "https:";
      const queryString = buildQueryString(request2.query || {});
      let auth = void 0;
      if (request2.username != null || request2.password != null) {
        const username = request2.username ?? "";
        const password = request2.password ?? "";
        auth = `${username}:${password}`;
      }
      let path2 = request2.path;
      if (queryString) {
        path2 += `?${queryString}`;
      }
      if (request2.fragment) {
        path2 += `#${request2.fragment}`;
      }
      const nodeHttpsOptions = {
        headers: request2.headers,
        host: request2.hostname,
        method: request2.method,
        path: path2,
        port: request2.port,
        agent: isSSL ? this.config.httpsAgent : this.config.httpAgent,
        auth
      };
      const requestFunc = isSSL ? request : request$1;
      const req = requestFunc(nodeHttpsOptions, (res) => {
        const httpResponse = new HttpResponse({
          statusCode: res.statusCode || -1,
          reason: res.statusMessage,
          headers: getTransformedHeaders(res.headers),
          body: res
        });
        resolve({ response: httpResponse });
      });
      req.on("error", (err) => {
        if (NODEJS_TIMEOUT_ERROR_CODES2.includes(err.code)) {
          reject(Object.assign(err, { name: "TimeoutError" }));
        } else {
          reject(err);
        }
      });
      setConnectionTimeout(req, reject, this.config.connectionTimeout);
      setSocketTimeout(req, reject, this.config.requestTimeout);
      if (abortSignal) {
        abortSignal.onabort = () => {
          req.abort();
          const abortError = new Error("Request aborted");
          abortError.name = "AbortError";
          reject(abortError);
        };
      }
      const httpAgent = nodeHttpsOptions.agent;
      if (typeof httpAgent === "object" && "keepAlive" in httpAgent) {
        setSocketKeepAlive(req, {
          keepAlive: httpAgent.keepAlive,
          keepAliveMsecs: httpAgent.keepAliveMsecs
        });
      }
      writeRequestBodyPromise = writeRequestBody(req, request2, this.config.requestTimeout).catch(_reject);
    });
  }
};
var Collector = class extends Writable {
  constructor() {
    super(...arguments);
    this.bufferedBytes = [];
  }
  _write(chunk, encoding, callback) {
    this.bufferedBytes.push(chunk);
    callback();
  }
};
var streamCollector = (stream) => new Promise((resolve, reject) => {
  const collector = new Collector();
  stream.pipe(collector);
  stream.on("error", (err) => {
    collector.end();
    reject(err);
  });
  collector.on("error", reject);
  collector.on("finish", function() {
    const bytes = new Uint8Array(Buffer.concat(this.bufferedBytes));
    resolve(bytes);
  });
});
var ERR_MSG_STREAM_HAS_BEEN_TRANSFORMED = "The stream has already been transformed.";
var sdkStreamMixin = (stream) => {
  var _a, _b;
  if (!(stream instanceof Readable)) {
    const name = ((_b = (_a = stream == null ? void 0 : stream.__proto__) == null ? void 0 : _a.constructor) == null ? void 0 : _b.name) || stream;
    throw new Error(`Unexpected stream implementation, expect Stream.Readable instance, got ${name}`);
  }
  let transformed = false;
  const transformToByteArray = async () => {
    if (transformed) {
      throw new Error(ERR_MSG_STREAM_HAS_BEEN_TRANSFORMED);
    }
    transformed = true;
    return await streamCollector(stream);
  };
  return Object.assign(stream, {
    transformToByteArray,
    transformToString: async (encoding) => {
      const buf = await transformToByteArray();
      if (encoding === void 0 || Buffer.isEncoding(encoding)) {
        return fromArrayBuffer(buf.buffer, buf.byteOffset, buf.byteLength).toString(encoding);
      } else {
        const decoder = new TextDecoder$1(encoding);
        return decoder.decode(buf);
      }
    },
    transformToWebStream: () => {
      if (transformed) {
        throw new Error(ERR_MSG_STREAM_HAS_BEEN_TRANSFORMED);
      }
      if (stream.readableFlowing !== null) {
        throw new Error("The stream has been consumed by other callbacks.");
      }
      if (typeof Readable.toWeb !== "function") {
        throw new Error("Readable.toWeb() is not supported. Please make sure you are using Node.js >= 17.0.0, or polyfill is available.");
      }
      transformed = true;
      return Readable.toWeb(stream);
    }
  });
};
var collectBody2 = async (streamBody = new Uint8Array(), context) => {
  if (streamBody instanceof Uint8Array) {
    return Uint8ArrayBlobAdapter.mutate(streamBody);
  }
  if (!streamBody) {
    return Uint8ArrayBlobAdapter.mutate(new Uint8Array());
  }
  const fromContext = context.streamCollector(streamBody);
  return Uint8ArrayBlobAdapter.mutate(await fromContext);
};
var Command = class {
  constructor() {
    this.middlewareStack = constructStack();
  }
};
var SENSITIVE_STRING = "***SensitiveInformation***";
var parseBoolean = (value) => {
  switch (value) {
    case "true":
      return true;
    case "false":
      return false;
    default:
      throw new Error(`Unable to parse boolean value "${value}"`);
  }
};
var expectNumber = (value) => {
  if (value === null || value === void 0) {
    return void 0;
  }
  if (typeof value === "string") {
    const parsed = parseFloat(value);
    if (!Number.isNaN(parsed)) {
      if (String(parsed) !== String(value)) {
        logger.warn(stackTraceWarning(`Expected number but observed string: ${value}`));
      }
      return parsed;
    }
  }
  if (typeof value === "number") {
    return value;
  }
  throw new TypeError(`Expected number, got ${typeof value}: ${value}`);
};
var MAX_FLOAT = Math.ceil(2 ** 127 * (2 - 2 ** -23));
var expectFloat32 = (value) => {
  const expected = expectNumber(value);
  if (expected !== void 0 && !Number.isNaN(expected) && expected !== Infinity && expected !== -Infinity) {
    if (Math.abs(expected) > MAX_FLOAT) {
      throw new TypeError(`Expected 32-bit float, got ${value}`);
    }
  }
  return expected;
};
var expectLong = (value) => {
  if (value === null || value === void 0) {
    return void 0;
  }
  if (Number.isInteger(value) && !Number.isNaN(value)) {
    return value;
  }
  throw new TypeError(`Expected integer, got ${typeof value}: ${value}`);
};
var expectInt32 = (value) => expectSizedInt(value, 32);
var expectShort = (value) => expectSizedInt(value, 16);
var expectByte = (value) => expectSizedInt(value, 8);
var expectSizedInt = (value, size) => {
  const expected = expectLong(value);
  if (expected !== void 0 && castInt(expected, size) !== expected) {
    throw new TypeError(`Expected ${size}-bit integer, got ${value}`);
  }
  return expected;
};
var castInt = (value, size) => {
  switch (size) {
    case 32:
      return Int32Array.of(value)[0];
    case 16:
      return Int16Array.of(value)[0];
    case 8:
      return Int8Array.of(value)[0];
  }
};
var expectNonNull = (value, location2) => {
  if (value === null || value === void 0) {
    if (location2) {
      throw new TypeError(`Expected a non-null value for ${location2}`);
    }
    throw new TypeError("Expected a non-null value");
  }
  return value;
};
var expectObject = (value) => {
  if (value === null || value === void 0) {
    return void 0;
  }
  if (typeof value === "object" && !Array.isArray(value)) {
    return value;
  }
  const receivedType = Array.isArray(value) ? "array" : typeof value;
  throw new TypeError(`Expected object, got ${receivedType}: ${value}`);
};
var expectString = (value) => {
  if (value === null || value === void 0) {
    return void 0;
  }
  if (typeof value === "string") {
    return value;
  }
  if (["boolean", "number", "bigint"].includes(typeof value)) {
    logger.warn(stackTraceWarning(`Expected string, got ${typeof value}: ${value}`));
    return String(value);
  }
  throw new TypeError(`Expected string, got ${typeof value}: ${value}`);
};
var strictParseFloat32 = (value) => {
  if (typeof value == "string") {
    return expectFloat32(parseNumber(value));
  }
  return expectFloat32(value);
};
var NUMBER_REGEX = /(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)|(-?Infinity)|(NaN)/g;
var parseNumber = (value) => {
  const matches = value.match(NUMBER_REGEX);
  if (matches === null || matches[0].length !== value.length) {
    throw new TypeError(`Expected real number, got implicit NaN`);
  }
  return parseFloat(value);
};
var strictParseLong = (value) => {
  if (typeof value === "string") {
    return expectLong(parseNumber(value));
  }
  return expectLong(value);
};
var strictParseInt32 = (value) => {
  if (typeof value === "string") {
    return expectInt32(parseNumber(value));
  }
  return expectInt32(value);
};
var strictParseShort = (value) => {
  if (typeof value === "string") {
    return expectShort(parseNumber(value));
  }
  return expectShort(value);
};
var strictParseByte = (value) => {
  if (typeof value === "string") {
    return expectByte(parseNumber(value));
  }
  return expectByte(value);
};
var stackTraceWarning = (message) => {
  return String(new TypeError(message).stack || message).split("\n").slice(0, 5).filter((s5) => !s5.includes("stackTraceWarning")).join("\n");
};
var logger = {
  warn: console.warn
};
var DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function dateToUtcString(date) {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const dayOfWeek = date.getUTCDay();
  const dayOfMonthInt = date.getUTCDate();
  const hoursInt = date.getUTCHours();
  const minutesInt = date.getUTCMinutes();
  const secondsInt = date.getUTCSeconds();
  const dayOfMonthString = dayOfMonthInt < 10 ? `0${dayOfMonthInt}` : `${dayOfMonthInt}`;
  const hoursString = hoursInt < 10 ? `0${hoursInt}` : `${hoursInt}`;
  const minutesString = minutesInt < 10 ? `0${minutesInt}` : `${minutesInt}`;
  const secondsString = secondsInt < 10 ? `0${secondsInt}` : `${secondsInt}`;
  return `${DAYS[dayOfWeek]}, ${dayOfMonthString} ${MONTHS[month]} ${year} ${hoursString}:${minutesString}:${secondsString} GMT`;
}
var RFC3339_WITH_OFFSET = new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(([-+]\d{2}\:\d{2})|[zZ])$/);
var parseRfc3339DateTimeWithOffset = (value) => {
  if (value === null || value === void 0) {
    return void 0;
  }
  if (typeof value !== "string") {
    throw new TypeError("RFC-3339 date-times must be expressed as strings");
  }
  const match = RFC3339_WITH_OFFSET.exec(value);
  if (!match) {
    throw new TypeError("Invalid RFC-3339 date-time value");
  }
  const [_, yearStr, monthStr, dayStr, hours, minutes, seconds, fractionalMilliseconds, offsetStr] = match;
  const year = strictParseShort(stripLeadingZeroes(yearStr));
  const month = parseDateValue(monthStr, "month", 1, 12);
  const day = parseDateValue(dayStr, "day", 1, 31);
  const date = buildDate(year, month, day, { hours, minutes, seconds, fractionalMilliseconds });
  if (offsetStr.toUpperCase() != "Z") {
    date.setTime(date.getTime() - parseOffsetToMilliseconds(offsetStr));
  }
  return date;
};
var IMF_FIXDATE = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d{2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/);
var RFC_850_DATE = new RegExp(/^(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d{2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/);
var ASC_TIME = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( [1-9]|\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? (\d{4})$/);
var parseRfc7231DateTime = (value) => {
  if (value === null || value === void 0) {
    return void 0;
  }
  if (typeof value !== "string") {
    throw new TypeError("RFC-7231 date-times must be expressed as strings");
  }
  let match = IMF_FIXDATE.exec(value);
  if (match) {
    const [_, dayStr, monthStr, yearStr, hours, minutes, seconds, fractionalMilliseconds] = match;
    return buildDate(strictParseShort(stripLeadingZeroes(yearStr)), parseMonthByShortName(monthStr), parseDateValue(dayStr, "day", 1, 31), { hours, minutes, seconds, fractionalMilliseconds });
  }
  match = RFC_850_DATE.exec(value);
  if (match) {
    const [_, dayStr, monthStr, yearStr, hours, minutes, seconds, fractionalMilliseconds] = match;
    return adjustRfc850Year(buildDate(parseTwoDigitYear(yearStr), parseMonthByShortName(monthStr), parseDateValue(dayStr, "day", 1, 31), {
      hours,
      minutes,
      seconds,
      fractionalMilliseconds
    }));
  }
  match = ASC_TIME.exec(value);
  if (match) {
    const [_, monthStr, dayStr, hours, minutes, seconds, fractionalMilliseconds, yearStr] = match;
    return buildDate(strictParseShort(stripLeadingZeroes(yearStr)), parseMonthByShortName(monthStr), parseDateValue(dayStr.trimLeft(), "day", 1, 31), { hours, minutes, seconds, fractionalMilliseconds });
  }
  throw new TypeError("Invalid RFC-7231 date-time value");
};
var buildDate = (year, month, day, time) => {
  const adjustedMonth = month - 1;
  validateDayOfMonth(year, adjustedMonth, day);
  return new Date(Date.UTC(year, adjustedMonth, day, parseDateValue(time.hours, "hour", 0, 23), parseDateValue(time.minutes, "minute", 0, 59), parseDateValue(time.seconds, "seconds", 0, 60), parseMilliseconds(time.fractionalMilliseconds)));
};
var parseTwoDigitYear = (value) => {
  const thisYear = (/* @__PURE__ */ new Date()).getUTCFullYear();
  const valueInThisCentury = Math.floor(thisYear / 100) * 100 + strictParseShort(stripLeadingZeroes(value));
  if (valueInThisCentury < thisYear) {
    return valueInThisCentury + 100;
  }
  return valueInThisCentury;
};
var FIFTY_YEARS_IN_MILLIS = 50 * 365 * 24 * 60 * 60 * 1e3;
var adjustRfc850Year = (input) => {
  if (input.getTime() - (/* @__PURE__ */ new Date()).getTime() > FIFTY_YEARS_IN_MILLIS) {
    return new Date(Date.UTC(input.getUTCFullYear() - 100, input.getUTCMonth(), input.getUTCDate(), input.getUTCHours(), input.getUTCMinutes(), input.getUTCSeconds(), input.getUTCMilliseconds()));
  }
  return input;
};
var parseMonthByShortName = (value) => {
  const monthIdx = MONTHS.indexOf(value);
  if (monthIdx < 0) {
    throw new TypeError(`Invalid month: ${value}`);
  }
  return monthIdx + 1;
};
var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var validateDayOfMonth = (year, month, day) => {
  let maxDays = DAYS_IN_MONTH[month];
  if (month === 1 && isLeapYear(year)) {
    maxDays = 29;
  }
  if (day > maxDays) {
    throw new TypeError(`Invalid day for ${MONTHS[month]} in ${year}: ${day}`);
  }
};
var isLeapYear = (year) => {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
};
var parseDateValue = (value, type, lower, upper) => {
  const dateVal = strictParseByte(stripLeadingZeroes(value));
  if (dateVal < lower || dateVal > upper) {
    throw new TypeError(`${type} must be between ${lower} and ${upper}, inclusive`);
  }
  return dateVal;
};
var parseMilliseconds = (value) => {
  if (value === null || value === void 0) {
    return 0;
  }
  return strictParseFloat32("0." + value) * 1e3;
};
var parseOffsetToMilliseconds = (value) => {
  const directionStr = value[0];
  let direction = 1;
  if (directionStr == "+") {
    direction = 1;
  } else if (directionStr == "-") {
    direction = -1;
  } else {
    throw new TypeError(`Offset direction, ${directionStr}, must be "+" or "-"`);
  }
  const hour = Number(value.substring(1, 3));
  const minute = Number(value.substring(4, 6));
  return direction * (hour * 60 + minute) * 60 * 1e3;
};
var stripLeadingZeroes = (value) => {
  let idx = 0;
  while (idx < value.length - 1 && value.charAt(idx) === "0") {
    idx++;
  }
  if (idx === 0) {
    return value;
  }
  return value.slice(idx);
};
var ServiceException = class _ServiceException extends Error {
  constructor(options) {
    super(options.message);
    Object.setPrototypeOf(this, _ServiceException.prototype);
    this.name = options.name;
    this.$fault = options.$fault;
    this.$metadata = options.$metadata;
  }
};
var decorateServiceException = (exception, additions = {}) => {
  Object.entries(additions).filter(([, v3]) => v3 !== void 0).forEach(([k5, v3]) => {
    if (exception[k5] == void 0 || exception[k5] === "") {
      exception[k5] = v3;
    }
  });
  const message = exception.message || exception.Message || "UnknownError";
  exception.message = message;
  delete exception.Message;
  return exception;
};
var throwDefaultError = ({ output, parsedBody, exceptionCtor, errorCode }) => {
  const $metadata = deserializeMetadata(output);
  const statusCode = $metadata.httpStatusCode ? $metadata.httpStatusCode + "" : void 0;
  const response2 = new exceptionCtor({
    name: (parsedBody == null ? void 0 : parsedBody.code) || (parsedBody == null ? void 0 : parsedBody.Code) || errorCode || statusCode || "UnknownError",
    $fault: "client",
    $metadata
  });
  throw decorateServiceException(response2, parsedBody);
};
var withBaseException = (ExceptionCtor) => {
  return ({ output, parsedBody, errorCode }) => {
    throwDefaultError({ output, parsedBody, exceptionCtor: ExceptionCtor, errorCode });
  };
};
var deserializeMetadata = (output) => ({
  httpStatusCode: output.statusCode,
  requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
  extendedRequestId: output.headers["x-amz-id-2"],
  cfId: output.headers["x-amz-cf-id"]
});
var loadConfigsForDefaultMode = (mode2) => {
  switch (mode2) {
    case "standard":
      return {
        retryMode: "standard",
        connectionTimeout: 3100
      };
    case "in-region":
      return {
        retryMode: "standard",
        connectionTimeout: 1100
      };
    case "cross-region":
      return {
        retryMode: "standard",
        connectionTimeout: 3100
      };
    case "mobile":
      return {
        retryMode: "standard",
        connectionTimeout: 3e4
      };
    default:
      return {};
  }
};
var warningEmitted = false;
var emitWarningIfUnsupportedVersion = (version) => {
  if (version && !warningEmitted && parseInt(version.substring(1, version.indexOf("."))) < 14) {
    warningEmitted = true;
  }
};
function extendedEncodeURIComponent(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function(c5) {
    return "%" + c5.charCodeAt(0).toString(16).toUpperCase();
  });
}
var getValueFromTextNode = (obj) => {
  const textNodeName = "#text";
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && obj[key][textNodeName] !== void 0) {
      obj[key] = obj[key][textNodeName];
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      obj[key] = getValueFromTextNode(obj[key]);
    }
  }
  return obj;
};
var StringWrapper = function() {
  const Class = Object.getPrototypeOf(this).constructor;
  const Constructor = Function.bind.apply(String, [null, ...arguments]);
  const instance = new Constructor();
  Object.setPrototypeOf(instance, Class.prototype);
  return instance;
};
StringWrapper.prototype = Object.create(String.prototype, {
  constructor: {
    value: StringWrapper,
    enumerable: false,
    writable: true,
    configurable: true
  }
});
Object.setPrototypeOf(StringWrapper, String);
function map(arg0, arg1, arg2) {
  let target;
  let filter;
  let instructions;
  if (typeof arg1 === "undefined" && typeof arg2 === "undefined") {
    target = {};
    instructions = arg0;
  } else {
    target = arg0;
    if (typeof arg1 === "function") {
      filter = arg1;
      instructions = arg2;
      return mapWithFilter(target, filter, instructions);
    } else {
      instructions = arg1;
    }
  }
  for (const key of Object.keys(instructions)) {
    if (!Array.isArray(instructions[key])) {
      target[key] = instructions[key];
      continue;
    }
    applyInstruction(target, null, instructions, key);
  }
  return target;
}
var take = (source, instructions) => {
  const out = {};
  for (const key in instructions) {
    applyInstruction(out, source, instructions, key);
  }
  return out;
};
var mapWithFilter = (target, filter, instructions) => {
  return map(target, Object.entries(instructions).reduce((_instructions, [key, value]) => {
    if (Array.isArray(value)) {
      _instructions[key] = value;
    } else {
      if (typeof value === "function") {
        _instructions[key] = [filter, value()];
      } else {
        _instructions[key] = [filter, value];
      }
    }
    return _instructions;
  }, {}));
};
var applyInstruction = (target, source, instructions, targetKey) => {
  if (source !== null) {
    let instruction = instructions[targetKey];
    if (typeof instruction === "function") {
      instruction = [, instruction];
    }
    const [filter2 = nonNullish, valueFn = pass, sourceKey = targetKey] = instruction;
    if (typeof filter2 === "function" && filter2(source[sourceKey]) || typeof filter2 !== "function" && !!filter2) {
      target[targetKey] = valueFn(source[sourceKey]);
    }
    return;
  }
  let [filter, value] = instructions[targetKey];
  if (typeof value === "function") {
    let _value;
    const defaultFilterPassed = filter === void 0 && (_value = value()) != null;
    const customFilterPassed = typeof filter === "function" && !!filter(void 0) || typeof filter !== "function" && !!filter;
    if (defaultFilterPassed) {
      target[targetKey] = _value;
    } else if (customFilterPassed) {
      target[targetKey] = value();
    }
  } else {
    const defaultFilterPassed = filter === void 0 && value != null;
    const customFilterPassed = typeof filter === "function" && !!filter(value) || typeof filter !== "function" && !!filter;
    if (defaultFilterPassed || customFilterPassed) {
      target[targetKey] = value;
    }
  }
};
var nonNullish = (_) => _ != null;
var pass = (_) => _;
var resolvedPath = (resolvedPath2, input, memberName, labelValueProvider, uriLabel, isGreedyLabel) => {
  if (input != null && input[memberName] !== void 0) {
    const labelValue = labelValueProvider();
    if (labelValue.length <= 0) {
      throw new Error("Empty value provided for input HTTP label: " + memberName + ".");
    }
    resolvedPath2 = resolvedPath2.replace(uriLabel, isGreedyLabel ? labelValue.split("/").map((segment) => extendedEncodeURIComponent(segment)).join("/") : extendedEncodeURIComponent(labelValue));
  } else {
    throw new Error("No value provided for input HTTP label: " + memberName + ".");
  }
  return resolvedPath2;
};
var _json = (obj) => {
  if (obj == null) {
    return {};
  }
  if (Array.isArray(obj)) {
    return obj.filter((_) => _ != null);
  }
  if (typeof obj === "object") {
    const target = {};
    for (const key of Object.keys(obj)) {
      if (obj[key] == null) {
        continue;
      }
      target[key] = _json(obj[key]);
    }
    return target;
  }
  return obj;
};
var resolveClientEndpointParameters = (options) => {
  return {
    ...options,
    useFipsEndpoint: options.useFipsEndpoint ?? false,
    useDualstackEndpoint: options.useDualstackEndpoint ?? false,
    useAccelerateEndpoint: options.useAccelerateEndpoint ?? false,
    useGlobalEndpoint: options.useGlobalEndpoint ?? false,
    disableMultiregionAccessPoints: options.disableMultiregionAccessPoints ?? false,
    defaultSigningName: "s3"
  };
};
var package_default = {
  name: "@aws-sdk/client-s3",
  description: "AWS SDK for JavaScript S3 Client for Node.js, Browser and React Native",
  version: "3.362.0",
  scripts: {
    build: "concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
    "build:cjs": "tsc -p tsconfig.cjs.json",
    "build:docs": "typedoc",
    "build:es": "tsc -p tsconfig.es.json",
    "build:include:deps": "lerna run --scope $npm_package_name --include-dependencies build",
    "build:types": "tsc -p tsconfig.types.json",
    "build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
    clean: "rimraf ./dist-* && rimraf *.tsbuildinfo",
    "extract:docs": "api-extractor run --local",
    "generate:client": "node ../../scripts/generate-clients/single-service --solo s3",
    test: "yarn test:unit",
    "test:e2e": "ts-mocha test/**/*.ispec.ts && karma start karma.conf.js",
    "test:unit": "ts-mocha test/**/*.spec.ts"
  },
  main: "./dist-cjs/index.js",
  types: "./dist-types/index.d.ts",
  module: "./dist-es/index.js",
  sideEffects: false,
  dependencies: {
    "@aws-crypto/sha1-browser": "3.0.0",
    "@aws-crypto/sha256-browser": "3.0.0",
    "@aws-crypto/sha256-js": "3.0.0",
    "@aws-sdk/client-sts": "3.362.0",
    "@aws-sdk/config-resolver": "3.357.0",
    "@aws-sdk/credential-provider-node": "3.362.0",
    "@aws-sdk/eventstream-serde-browser": "3.357.0",
    "@aws-sdk/eventstream-serde-config-resolver": "3.357.0",
    "@aws-sdk/eventstream-serde-node": "3.357.0",
    "@aws-sdk/fetch-http-handler": "3.357.0",
    "@aws-sdk/hash-blob-browser": "3.357.0",
    "@aws-sdk/hash-node": "3.357.0",
    "@aws-sdk/hash-stream-node": "3.357.0",
    "@aws-sdk/invalid-dependency": "3.357.0",
    "@aws-sdk/md5-js": "3.357.0",
    "@aws-sdk/middleware-bucket-endpoint": "3.357.0",
    "@aws-sdk/middleware-content-length": "3.357.0",
    "@aws-sdk/middleware-endpoint": "3.357.0",
    "@aws-sdk/middleware-expect-continue": "3.357.0",
    "@aws-sdk/middleware-flexible-checksums": "3.357.0",
    "@aws-sdk/middleware-host-header": "3.357.0",
    "@aws-sdk/middleware-location-constraint": "3.357.0",
    "@aws-sdk/middleware-logger": "3.357.0",
    "@aws-sdk/middleware-recursion-detection": "3.357.0",
    "@aws-sdk/middleware-retry": "3.362.0",
    "@aws-sdk/middleware-sdk-s3": "3.357.0",
    "@aws-sdk/middleware-serde": "3.357.0",
    "@aws-sdk/middleware-signing": "3.357.0",
    "@aws-sdk/middleware-ssec": "3.357.0",
    "@aws-sdk/middleware-stack": "3.357.0",
    "@aws-sdk/middleware-user-agent": "3.357.0",
    "@aws-sdk/node-config-provider": "3.357.0",
    "@aws-sdk/node-http-handler": "3.360.0",
    "@aws-sdk/signature-v4-multi-region": "3.357.0",
    "@aws-sdk/smithy-client": "3.360.0",
    "@aws-sdk/types": "3.357.0",
    "@aws-sdk/url-parser": "3.357.0",
    "@aws-sdk/util-base64": "3.310.0",
    "@aws-sdk/util-body-length-browser": "3.310.0",
    "@aws-sdk/util-body-length-node": "3.310.0",
    "@aws-sdk/util-defaults-mode-browser": "3.360.0",
    "@aws-sdk/util-defaults-mode-node": "3.360.0",
    "@aws-sdk/util-endpoints": "3.357.0",
    "@aws-sdk/util-retry": "3.362.0",
    "@aws-sdk/util-stream": "3.360.0",
    "@aws-sdk/util-user-agent-browser": "3.357.0",
    "@aws-sdk/util-user-agent-node": "3.357.0",
    "@aws-sdk/util-utf8": "3.310.0",
    "@aws-sdk/util-waiter": "3.357.0",
    "@aws-sdk/xml-builder": "3.310.0",
    "@smithy/protocol-http": "^1.0.1",
    "@smithy/types": "^1.0.0",
    "fast-xml-parser": "4.2.5",
    tslib: "^2.5.0"
  },
  devDependencies: {
    "@aws-sdk/service-client-documentation-generator": "3.310.0",
    "@tsconfig/node14": "1.0.3",
    "@types/chai": "^4.2.11",
    "@types/mocha": "^8.0.4",
    "@types/node": "^14.14.31",
    concurrently: "7.0.0",
    "downlevel-dts": "0.10.1",
    rimraf: "3.0.2",
    typedoc: "0.23.23",
    typescript: "~4.9.5"
  },
  engines: {
    node: ">=14.0.0"
  },
  typesVersions: {
    "<4.0": {
      "dist-types/*": [
        "dist-types/ts3.4/*"
      ]
    }
  },
  files: [
    "dist-*/**"
  ],
  author: {
    name: "AWS SDK for JavaScript Team",
    url: "https://aws.amazon.com/javascript/"
  },
  license: "Apache-2.0",
  browser: {
    "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.browser"
  },
  "react-native": {
    "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.native"
  },
  homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-s3",
  repository: {
    type: "git",
    url: "https://github.com/aws/aws-sdk-js-v3.git",
    directory: "clients/client-s3"
  }
};
var resolveStsAuthConfig = (input, { stsClientCtor }) => resolveAwsAuthConfig({
  ...input,
  stsClientCtor
});
var resolveClientEndpointParameters2 = (options) => {
  return {
    ...options,
    useDualstackEndpoint: options.useDualstackEndpoint ?? false,
    useFipsEndpoint: options.useFipsEndpoint ?? false,
    useGlobalEndpoint: options.useGlobalEndpoint ?? false,
    defaultSigningName: "sts"
  };
};
var package_default2 = {
  name: "@aws-sdk/client-sts",
  description: "AWS SDK for JavaScript Sts Client for Node.js, Browser and React Native",
  version: "3.362.0",
  scripts: {
    build: "concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
    "build:cjs": "tsc -p tsconfig.cjs.json",
    "build:docs": "typedoc",
    "build:es": "tsc -p tsconfig.es.json",
    "build:include:deps": "lerna run --scope $npm_package_name --include-dependencies build",
    "build:types": "tsc -p tsconfig.types.json",
    "build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
    clean: "rimraf ./dist-* && rimraf *.tsbuildinfo",
    "extract:docs": "api-extractor run --local",
    "generate:client": "node ../../scripts/generate-clients/single-service --solo sts",
    test: "yarn test:unit",
    "test:unit": "jest"
  },
  main: "./dist-cjs/index.js",
  types: "./dist-types/index.d.ts",
  module: "./dist-es/index.js",
  sideEffects: false,
  dependencies: {
    "@aws-crypto/sha256-browser": "3.0.0",
    "@aws-crypto/sha256-js": "3.0.0",
    "@aws-sdk/config-resolver": "3.357.0",
    "@aws-sdk/credential-provider-node": "3.362.0",
    "@aws-sdk/fetch-http-handler": "3.357.0",
    "@aws-sdk/hash-node": "3.357.0",
    "@aws-sdk/invalid-dependency": "3.357.0",
    "@aws-sdk/middleware-content-length": "3.357.0",
    "@aws-sdk/middleware-endpoint": "3.357.0",
    "@aws-sdk/middleware-host-header": "3.357.0",
    "@aws-sdk/middleware-logger": "3.357.0",
    "@aws-sdk/middleware-recursion-detection": "3.357.0",
    "@aws-sdk/middleware-retry": "3.362.0",
    "@aws-sdk/middleware-sdk-sts": "3.357.0",
    "@aws-sdk/middleware-serde": "3.357.0",
    "@aws-sdk/middleware-signing": "3.357.0",
    "@aws-sdk/middleware-stack": "3.357.0",
    "@aws-sdk/middleware-user-agent": "3.357.0",
    "@aws-sdk/node-config-provider": "3.357.0",
    "@aws-sdk/node-http-handler": "3.360.0",
    "@aws-sdk/smithy-client": "3.360.0",
    "@aws-sdk/types": "3.357.0",
    "@aws-sdk/url-parser": "3.357.0",
    "@aws-sdk/util-base64": "3.310.0",
    "@aws-sdk/util-body-length-browser": "3.310.0",
    "@aws-sdk/util-body-length-node": "3.310.0",
    "@aws-sdk/util-defaults-mode-browser": "3.360.0",
    "@aws-sdk/util-defaults-mode-node": "3.360.0",
    "@aws-sdk/util-endpoints": "3.357.0",
    "@aws-sdk/util-retry": "3.362.0",
    "@aws-sdk/util-user-agent-browser": "3.357.0",
    "@aws-sdk/util-user-agent-node": "3.357.0",
    "@aws-sdk/util-utf8": "3.310.0",
    "@smithy/protocol-http": "^1.0.1",
    "@smithy/types": "^1.0.0",
    "fast-xml-parser": "4.2.5",
    tslib: "^2.5.0"
  },
  devDependencies: {
    "@aws-sdk/service-client-documentation-generator": "3.310.0",
    "@tsconfig/node14": "1.0.3",
    "@types/node": "^14.14.31",
    concurrently: "7.0.0",
    "downlevel-dts": "0.10.1",
    rimraf: "3.0.2",
    typedoc: "0.23.23",
    typescript: "~4.9.5"
  },
  engines: {
    node: ">=14.0.0"
  },
  typesVersions: {
    "<4.0": {
      "dist-types/*": [
        "dist-types/ts3.4/*"
      ]
    }
  },
  files: [
    "dist-*/**"
  ],
  author: {
    name: "AWS SDK for JavaScript Team",
    url: "https://aws.amazon.com/javascript/"
  },
  license: "Apache-2.0",
  browser: {
    "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.browser"
  },
  "react-native": {
    "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.native"
  },
  homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-sts",
  repository: {
    type: "git",
    url: "https://github.com/aws/aws-sdk-js-v3.git",
    directory: "clients/client-sts"
  }
};
var STSServiceException = class _STSServiceException extends ServiceException {
  constructor(options) {
    super(options);
    Object.setPrototypeOf(this, _STSServiceException.prototype);
  }
};
var ExpiredTokenException = class _ExpiredTokenException extends STSServiceException {
  constructor(opts) {
    super({
      name: "ExpiredTokenException",
      $fault: "client",
      ...opts
    });
    this.name = "ExpiredTokenException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _ExpiredTokenException.prototype);
  }
};
var MalformedPolicyDocumentException = class _MalformedPolicyDocumentException extends STSServiceException {
  constructor(opts) {
    super({
      name: "MalformedPolicyDocumentException",
      $fault: "client",
      ...opts
    });
    this.name = "MalformedPolicyDocumentException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _MalformedPolicyDocumentException.prototype);
  }
};
var PackedPolicyTooLargeException = class _PackedPolicyTooLargeException extends STSServiceException {
  constructor(opts) {
    super({
      name: "PackedPolicyTooLargeException",
      $fault: "client",
      ...opts
    });
    this.name = "PackedPolicyTooLargeException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _PackedPolicyTooLargeException.prototype);
  }
};
var RegionDisabledException = class _RegionDisabledException extends STSServiceException {
  constructor(opts) {
    super({
      name: "RegionDisabledException",
      $fault: "client",
      ...opts
    });
    this.name = "RegionDisabledException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _RegionDisabledException.prototype);
  }
};
var IDPRejectedClaimException = class _IDPRejectedClaimException extends STSServiceException {
  constructor(opts) {
    super({
      name: "IDPRejectedClaimException",
      $fault: "client",
      ...opts
    });
    this.name = "IDPRejectedClaimException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _IDPRejectedClaimException.prototype);
  }
};
var InvalidIdentityTokenException = class _InvalidIdentityTokenException extends STSServiceException {
  constructor(opts) {
    super({
      name: "InvalidIdentityTokenException",
      $fault: "client",
      ...opts
    });
    this.name = "InvalidIdentityTokenException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _InvalidIdentityTokenException.prototype);
  }
};
var IDPCommunicationErrorException = class _IDPCommunicationErrorException extends STSServiceException {
  constructor(opts) {
    super({
      name: "IDPCommunicationErrorException",
      $fault: "client",
      ...opts
    });
    this.name = "IDPCommunicationErrorException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _IDPCommunicationErrorException.prototype);
  }
};
var CredentialsFilterSensitiveLog = (obj) => ({
  ...obj,
  ...obj.SecretAccessKey && { SecretAccessKey: SENSITIVE_STRING }
});
var AssumeRoleResponseFilterSensitiveLog = (obj) => ({
  ...obj,
  ...obj.Credentials && { Credentials: CredentialsFilterSensitiveLog(obj.Credentials) }
});
var AssumeRoleWithWebIdentityRequestFilterSensitiveLog = (obj) => ({
  ...obj,
  ...obj.WebIdentityToken && { WebIdentityToken: SENSITIVE_STRING }
});
var AssumeRoleWithWebIdentityResponseFilterSensitiveLog = (obj) => ({
  ...obj,
  ...obj.Credentials && { Credentials: CredentialsFilterSensitiveLog(obj.Credentials) }
});
var HttpAuthLocation2;
(function(HttpAuthLocation3) {
  HttpAuthLocation3["HEADER"] = "header";
  HttpAuthLocation3["QUERY"] = "query";
})(HttpAuthLocation2 || (HttpAuthLocation2 = {}));
var EndpointURLScheme2;
(function(EndpointURLScheme3) {
  EndpointURLScheme3["HTTP"] = "http";
  EndpointURLScheme3["HTTPS"] = "https";
})(EndpointURLScheme2 || (EndpointURLScheme2 = {}));
var FieldPosition2;
(function(FieldPosition3) {
  FieldPosition3[FieldPosition3["HEADER"] = 0] = "HEADER";
  FieldPosition3[FieldPosition3["TRAILER"] = 1] = "TRAILER";
})(FieldPosition2 || (FieldPosition2 = {}));
var RequestHandlerProtocol2;
(function(RequestHandlerProtocol3) {
  RequestHandlerProtocol3["HTTP_0_9"] = "http/0.9";
  RequestHandlerProtocol3["HTTP_1_0"] = "http/1.0";
  RequestHandlerProtocol3["TDS_8_0"] = "tds/8.0";
})(RequestHandlerProtocol2 || (RequestHandlerProtocol2 = {}));
var HttpRequest2 = class _HttpRequest2 {
  constructor(options) {
    this.method = options.method || "GET";
    this.hostname = options.hostname || "localhost";
    this.port = options.port;
    this.query = options.query || {};
    this.headers = options.headers || {};
    this.body = options.body;
    this.protocol = options.protocol ? options.protocol.slice(-1) !== ":" ? `${options.protocol}:` : options.protocol : "https:";
    this.path = options.path ? options.path.charAt(0) !== "/" ? `/${options.path}` : options.path : "/";
    this.username = options.username;
    this.password = options.password;
    this.fragment = options.fragment;
  }
  static isInstance(request2) {
    if (!request2)
      return false;
    const req = request2;
    return "method" in req && "protocol" in req && "hostname" in req && "path" in req && typeof req["query"] === "object" && typeof req["headers"] === "object";
  }
  clone() {
    const cloned = new _HttpRequest2({
      ...this,
      headers: { ...this.headers }
    });
    if (cloned.query)
      cloned.query = cloneQuery3(cloned.query);
    return cloned;
  }
};
function cloneQuery3(query) {
  return Object.keys(query).reduce((carry, paramName) => {
    const param = query[paramName];
    return {
      ...carry,
      [paramName]: Array.isArray(param) ? [...param] : param
    };
  }, {});
}
var import_fast_xml_parser = __toESM(require_fxp());
var se_AssumeRoleCommand = async (input, context) => {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString({
    ...se_AssumeRoleRequest(input),
    Action: "AssumeRole",
    Version: "2011-06-15"
  });
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
};
var se_AssumeRoleWithWebIdentityCommand = async (input, context) => {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString({
    ...se_AssumeRoleWithWebIdentityRequest(input),
    Action: "AssumeRoleWithWebIdentity",
    Version: "2011-06-15"
  });
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
};
var de_AssumeRoleCommand = async (output, context) => {
  if (output.statusCode >= 300) {
    return de_AssumeRoleCommandError(output, context);
  }
  const data = await parseBody(output.body, context);
  let contents = {};
  contents = de_AssumeRoleResponse(data.AssumeRoleResult);
  const response2 = {
    $metadata: deserializeMetadata2(output),
    ...contents
  };
  return response2;
};
var de_AssumeRoleCommandError = async (output, context) => {
  const parsedOutput = {
    ...output,
    body: await parseErrorBody(output.body, context)
  };
  const errorCode = loadQueryErrorCode(output, parsedOutput.body);
  switch (errorCode) {
    case "ExpiredTokenException":
    case "com.amazonaws.sts#ExpiredTokenException":
      throw await de_ExpiredTokenExceptionRes(parsedOutput);
    case "MalformedPolicyDocument":
    case "com.amazonaws.sts#MalformedPolicyDocumentException":
      throw await de_MalformedPolicyDocumentExceptionRes(parsedOutput);
    case "PackedPolicyTooLarge":
    case "com.amazonaws.sts#PackedPolicyTooLargeException":
      throw await de_PackedPolicyTooLargeExceptionRes(parsedOutput);
    case "RegionDisabledException":
    case "com.amazonaws.sts#RegionDisabledException":
      throw await de_RegionDisabledExceptionRes(parsedOutput);
    default:
      const parsedBody = parsedOutput.body;
      return throwDefaultError2({
        output,
        parsedBody: parsedBody.Error,
        errorCode
      });
  }
};
var de_AssumeRoleWithWebIdentityCommand = async (output, context) => {
  if (output.statusCode >= 300) {
    return de_AssumeRoleWithWebIdentityCommandError(output, context);
  }
  const data = await parseBody(output.body, context);
  let contents = {};
  contents = de_AssumeRoleWithWebIdentityResponse(data.AssumeRoleWithWebIdentityResult);
  const response2 = {
    $metadata: deserializeMetadata2(output),
    ...contents
  };
  return response2;
};
var de_AssumeRoleWithWebIdentityCommandError = async (output, context) => {
  const parsedOutput = {
    ...output,
    body: await parseErrorBody(output.body, context)
  };
  const errorCode = loadQueryErrorCode(output, parsedOutput.body);
  switch (errorCode) {
    case "ExpiredTokenException":
    case "com.amazonaws.sts#ExpiredTokenException":
      throw await de_ExpiredTokenExceptionRes(parsedOutput);
    case "IDPCommunicationError":
    case "com.amazonaws.sts#IDPCommunicationErrorException":
      throw await de_IDPCommunicationErrorExceptionRes(parsedOutput);
    case "IDPRejectedClaim":
    case "com.amazonaws.sts#IDPRejectedClaimException":
      throw await de_IDPRejectedClaimExceptionRes(parsedOutput);
    case "InvalidIdentityToken":
    case "com.amazonaws.sts#InvalidIdentityTokenException":
      throw await de_InvalidIdentityTokenExceptionRes(parsedOutput);
    case "MalformedPolicyDocument":
    case "com.amazonaws.sts#MalformedPolicyDocumentException":
      throw await de_MalformedPolicyDocumentExceptionRes(parsedOutput);
    case "PackedPolicyTooLarge":
    case "com.amazonaws.sts#PackedPolicyTooLargeException":
      throw await de_PackedPolicyTooLargeExceptionRes(parsedOutput);
    case "RegionDisabledException":
    case "com.amazonaws.sts#RegionDisabledException":
      throw await de_RegionDisabledExceptionRes(parsedOutput);
    default:
      const parsedBody = parsedOutput.body;
      return throwDefaultError2({
        output,
        parsedBody: parsedBody.Error,
        errorCode
      });
  }
};
var de_ExpiredTokenExceptionRes = async (parsedOutput, context) => {
  const body = parsedOutput.body;
  const deserialized = de_ExpiredTokenException(body.Error);
  const exception = new ExpiredTokenException({
    $metadata: deserializeMetadata2(parsedOutput),
    ...deserialized
  });
  return decorateServiceException(exception, body);
};
var de_IDPCommunicationErrorExceptionRes = async (parsedOutput, context) => {
  const body = parsedOutput.body;
  const deserialized = de_IDPCommunicationErrorException(body.Error);
  const exception = new IDPCommunicationErrorException({
    $metadata: deserializeMetadata2(parsedOutput),
    ...deserialized
  });
  return decorateServiceException(exception, body);
};
var de_IDPRejectedClaimExceptionRes = async (parsedOutput, context) => {
  const body = parsedOutput.body;
  const deserialized = de_IDPRejectedClaimException(body.Error);
  const exception = new IDPRejectedClaimException({
    $metadata: deserializeMetadata2(parsedOutput),
    ...deserialized
  });
  return decorateServiceException(exception, body);
};
var de_InvalidIdentityTokenExceptionRes = async (parsedOutput, context) => {
  const body = parsedOutput.body;
  const deserialized = de_InvalidIdentityTokenException(body.Error);
  const exception = new InvalidIdentityTokenException({
    $metadata: deserializeMetadata2(parsedOutput),
    ...deserialized
  });
  return decorateServiceException(exception, body);
};
var de_MalformedPolicyDocumentExceptionRes = async (parsedOutput, context) => {
  const body = parsedOutput.body;
  const deserialized = de_MalformedPolicyDocumentException(body.Error);
  const exception = new MalformedPolicyDocumentException({
    $metadata: deserializeMetadata2(parsedOutput),
    ...deserialized
  });
  return decorateServiceException(exception, body);
};
var de_PackedPolicyTooLargeExceptionRes = async (parsedOutput, context) => {
  const body = parsedOutput.body;
  const deserialized = de_PackedPolicyTooLargeException(body.Error);
  const exception = new PackedPolicyTooLargeException({
    $metadata: deserializeMetadata2(parsedOutput),
    ...deserialized
  });
  return decorateServiceException(exception, body);
};
var de_RegionDisabledExceptionRes = async (parsedOutput, context) => {
  const body = parsedOutput.body;
  const deserialized = de_RegionDisabledException(body.Error);
  const exception = new RegionDisabledException({
    $metadata: deserializeMetadata2(parsedOutput),
    ...deserialized
  });
  return decorateServiceException(exception, body);
};
var se_AssumeRoleRequest = (input, context) => {
  var _a, _b, _c;
  const entries = {};
  if (input.RoleArn != null) {
    entries["RoleArn"] = input.RoleArn;
  }
  if (input.RoleSessionName != null) {
    entries["RoleSessionName"] = input.RoleSessionName;
  }
  if (input.PolicyArns != null) {
    const memberEntries = se_policyDescriptorListType(input.PolicyArns);
    if (((_a = input.PolicyArns) == null ? void 0 : _a.length) === 0) {
      entries.PolicyArns = [];
    }
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `PolicyArns.${key}`;
      entries[loc] = value;
    });
  }
  if (input.Policy != null) {
    entries["Policy"] = input.Policy;
  }
  if (input.DurationSeconds != null) {
    entries["DurationSeconds"] = input.DurationSeconds;
  }
  if (input.Tags != null) {
    const memberEntries = se_tagListType(input.Tags);
    if (((_b = input.Tags) == null ? void 0 : _b.length) === 0) {
      entries.Tags = [];
    }
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `Tags.${key}`;
      entries[loc] = value;
    });
  }
  if (input.TransitiveTagKeys != null) {
    const memberEntries = se_tagKeyListType(input.TransitiveTagKeys);
    if (((_c = input.TransitiveTagKeys) == null ? void 0 : _c.length) === 0) {
      entries.TransitiveTagKeys = [];
    }
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `TransitiveTagKeys.${key}`;
      entries[loc] = value;
    });
  }
  if (input.ExternalId != null) {
    entries["ExternalId"] = input.ExternalId;
  }
  if (input.SerialNumber != null) {
    entries["SerialNumber"] = input.SerialNumber;
  }
  if (input.TokenCode != null) {
    entries["TokenCode"] = input.TokenCode;
  }
  if (input.SourceIdentity != null) {
    entries["SourceIdentity"] = input.SourceIdentity;
  }
  return entries;
};
var se_AssumeRoleWithWebIdentityRequest = (input, context) => {
  var _a;
  const entries = {};
  if (input.RoleArn != null) {
    entries["RoleArn"] = input.RoleArn;
  }
  if (input.RoleSessionName != null) {
    entries["RoleSessionName"] = input.RoleSessionName;
  }
  if (input.WebIdentityToken != null) {
    entries["WebIdentityToken"] = input.WebIdentityToken;
  }
  if (input.ProviderId != null) {
    entries["ProviderId"] = input.ProviderId;
  }
  if (input.PolicyArns != null) {
    const memberEntries = se_policyDescriptorListType(input.PolicyArns);
    if (((_a = input.PolicyArns) == null ? void 0 : _a.length) === 0) {
      entries.PolicyArns = [];
    }
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `PolicyArns.${key}`;
      entries[loc] = value;
    });
  }
  if (input.Policy != null) {
    entries["Policy"] = input.Policy;
  }
  if (input.DurationSeconds != null) {
    entries["DurationSeconds"] = input.DurationSeconds;
  }
  return entries;
};
var se_policyDescriptorListType = (input, context) => {
  const entries = {};
  let counter = 1;
  for (const entry2 of input) {
    if (entry2 === null) {
      continue;
    }
    const memberEntries = se_PolicyDescriptorType(entry2);
    Object.entries(memberEntries).forEach(([key, value]) => {
      entries[`member.${counter}.${key}`] = value;
    });
    counter++;
  }
  return entries;
};
var se_PolicyDescriptorType = (input, context) => {
  const entries = {};
  if (input.arn != null) {
    entries["arn"] = input.arn;
  }
  return entries;
};
var se_Tag = (input, context) => {
  const entries = {};
  if (input.Key != null) {
    entries["Key"] = input.Key;
  }
  if (input.Value != null) {
    entries["Value"] = input.Value;
  }
  return entries;
};
var se_tagKeyListType = (input, context) => {
  const entries = {};
  let counter = 1;
  for (const entry2 of input) {
    if (entry2 === null) {
      continue;
    }
    entries[`member.${counter}`] = entry2;
    counter++;
  }
  return entries;
};
var se_tagListType = (input, context) => {
  const entries = {};
  let counter = 1;
  for (const entry2 of input) {
    if (entry2 === null) {
      continue;
    }
    const memberEntries = se_Tag(entry2);
    Object.entries(memberEntries).forEach(([key, value]) => {
      entries[`member.${counter}.${key}`] = value;
    });
    counter++;
  }
  return entries;
};
var de_AssumedRoleUser = (output, context) => {
  const contents = {};
  if (output["AssumedRoleId"] !== void 0) {
    contents.AssumedRoleId = expectString(output["AssumedRoleId"]);
  }
  if (output["Arn"] !== void 0) {
    contents.Arn = expectString(output["Arn"]);
  }
  return contents;
};
var de_AssumeRoleResponse = (output, context) => {
  const contents = {};
  if (output["Credentials"] !== void 0) {
    contents.Credentials = de_Credentials(output["Credentials"]);
  }
  if (output["AssumedRoleUser"] !== void 0) {
    contents.AssumedRoleUser = de_AssumedRoleUser(output["AssumedRoleUser"]);
  }
  if (output["PackedPolicySize"] !== void 0) {
    contents.PackedPolicySize = strictParseInt32(output["PackedPolicySize"]);
  }
  if (output["SourceIdentity"] !== void 0) {
    contents.SourceIdentity = expectString(output["SourceIdentity"]);
  }
  return contents;
};
var de_AssumeRoleWithWebIdentityResponse = (output, context) => {
  const contents = {};
  if (output["Credentials"] !== void 0) {
    contents.Credentials = de_Credentials(output["Credentials"]);
  }
  if (output["SubjectFromWebIdentityToken"] !== void 0) {
    contents.SubjectFromWebIdentityToken = expectString(output["SubjectFromWebIdentityToken"]);
  }
  if (output["AssumedRoleUser"] !== void 0) {
    contents.AssumedRoleUser = de_AssumedRoleUser(output["AssumedRoleUser"]);
  }
  if (output["PackedPolicySize"] !== void 0) {
    contents.PackedPolicySize = strictParseInt32(output["PackedPolicySize"]);
  }
  if (output["Provider"] !== void 0) {
    contents.Provider = expectString(output["Provider"]);
  }
  if (output["Audience"] !== void 0) {
    contents.Audience = expectString(output["Audience"]);
  }
  if (output["SourceIdentity"] !== void 0) {
    contents.SourceIdentity = expectString(output["SourceIdentity"]);
  }
  return contents;
};
var de_Credentials = (output, context) => {
  const contents = {};
  if (output["AccessKeyId"] !== void 0) {
    contents.AccessKeyId = expectString(output["AccessKeyId"]);
  }
  if (output["SecretAccessKey"] !== void 0) {
    contents.SecretAccessKey = expectString(output["SecretAccessKey"]);
  }
  if (output["SessionToken"] !== void 0) {
    contents.SessionToken = expectString(output["SessionToken"]);
  }
  if (output["Expiration"] !== void 0) {
    contents.Expiration = expectNonNull(parseRfc3339DateTimeWithOffset(output["Expiration"]));
  }
  return contents;
};
var de_ExpiredTokenException = (output, context) => {
  const contents = {};
  if (output["message"] !== void 0) {
    contents.message = expectString(output["message"]);
  }
  return contents;
};
var de_IDPCommunicationErrorException = (output, context) => {
  const contents = {};
  if (output["message"] !== void 0) {
    contents.message = expectString(output["message"]);
  }
  return contents;
};
var de_IDPRejectedClaimException = (output, context) => {
  const contents = {};
  if (output["message"] !== void 0) {
    contents.message = expectString(output["message"]);
  }
  return contents;
};
var de_InvalidIdentityTokenException = (output, context) => {
  const contents = {};
  if (output["message"] !== void 0) {
    contents.message = expectString(output["message"]);
  }
  return contents;
};
var de_MalformedPolicyDocumentException = (output, context) => {
  const contents = {};
  if (output["message"] !== void 0) {
    contents.message = expectString(output["message"]);
  }
  return contents;
};
var de_PackedPolicyTooLargeException = (output, context) => {
  const contents = {};
  if (output["message"] !== void 0) {
    contents.message = expectString(output["message"]);
  }
  return contents;
};
var de_RegionDisabledException = (output, context) => {
  const contents = {};
  if (output["message"] !== void 0) {
    contents.message = expectString(output["message"]);
  }
  return contents;
};
var deserializeMetadata2 = (output) => ({
  httpStatusCode: output.statusCode,
  requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
  extendedRequestId: output.headers["x-amz-id-2"],
  cfId: output.headers["x-amz-cf-id"]
});
var collectBodyString2 = (streamBody, context) => collectBody2(streamBody, context).then((body) => context.utf8Encoder(body));
var throwDefaultError2 = withBaseException(STSServiceException);
var buildHttpRpcRequest = async (context, headers, path2, resolvedHostname, body) => {
  const { hostname, protocol = "https", port, path: basePath } = await context.endpoint();
  const contents = {
    protocol,
    hostname,
    port,
    method: "POST",
    path: basePath.endsWith("/") ? basePath.slice(0, -1) + path2 : basePath + path2,
    headers
  };
  if (body !== void 0) {
    contents.body = body;
  }
  return new HttpRequest2(contents);
};
var SHARED_HEADERS = {
  "content-type": "application/x-www-form-urlencoded"
};
var parseBody = (streamBody, context) => collectBodyString2(streamBody, context).then((encoded) => {
  if (encoded.length) {
    const parser = new import_fast_xml_parser.XMLParser({
      attributeNamePrefix: "",
      htmlEntities: true,
      ignoreAttributes: false,
      ignoreDeclaration: true,
      parseTagValue: false,
      trimValues: false,
      tagValueProcessor: (_, val2) => val2.trim() === "" && val2.includes("\n") ? "" : void 0
    });
    parser.addEntity("#xD", "\r");
    parser.addEntity("#10", "\n");
    const parsedObj = parser.parse(encoded);
    const textNodeName = "#text";
    const key = Object.keys(parsedObj)[0];
    const parsedObjToReturn = parsedObj[key];
    if (parsedObjToReturn[textNodeName]) {
      parsedObjToReturn[key] = parsedObjToReturn[textNodeName];
      delete parsedObjToReturn[textNodeName];
    }
    return getValueFromTextNode(parsedObjToReturn);
  }
  return {};
});
var parseErrorBody = async (errorBody, context) => {
  const value = await parseBody(errorBody, context);
  if (value.Error) {
    value.Error.message = value.Error.message ?? value.Error.Message;
  }
  return value;
};
var buildFormUrlencodedString = (formEntries) => Object.entries(formEntries).map(([key, value]) => extendedEncodeURIComponent(key) + "=" + extendedEncodeURIComponent(value)).join("&");
var loadQueryErrorCode = (output, data) => {
  var _a;
  if (((_a = data.Error) == null ? void 0 : _a.Code) !== void 0) {
    return data.Error.Code;
  }
  if (output.statusCode == 404) {
    return "NotFound";
  }
};
var AssumeRoleCommand = class _AssumeRoleCommand extends Command {
  static getEndpointParameterInstructions() {
    return {
      UseGlobalEndpoint: { type: "builtInParams", name: "useGlobalEndpoint" },
      UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
      Endpoint: { type: "builtInParams", name: "endpoint" },
      Region: { type: "builtInParams", name: "region" },
      UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" }
    };
  }
  constructor(input) {
    super();
    this.input = input;
  }
  resolveMiddleware(clientStack, configuration, options) {
    this.middlewareStack.use(getSerdePlugin(configuration, this.serialize, this.deserialize));
    this.middlewareStack.use(getEndpointPlugin(configuration, _AssumeRoleCommand.getEndpointParameterInstructions()));
    this.middlewareStack.use(getAwsAuthPlugin(configuration));
    const stack = clientStack.concat(this.middlewareStack);
    const { logger: logger2 } = configuration;
    const clientName = "STSClient";
    const commandName = "AssumeRoleCommand";
    const handlerExecutionContext = {
      logger: logger2,
      clientName,
      commandName,
      inputFilterSensitiveLog: (_) => _,
      outputFilterSensitiveLog: AssumeRoleResponseFilterSensitiveLog
    };
    const { requestHandler } = configuration;
    return stack.resolve((request2) => requestHandler.handle(request2.request, options || {}), handlerExecutionContext);
  }
  serialize(input, context) {
    return se_AssumeRoleCommand(input, context);
  }
  deserialize(output, context) {
    return de_AssumeRoleCommand(output, context);
  }
};
var AssumeRoleWithWebIdentityCommand = class _AssumeRoleWithWebIdentityCommand extends Command {
  static getEndpointParameterInstructions() {
    return {
      UseGlobalEndpoint: { type: "builtInParams", name: "useGlobalEndpoint" },
      UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
      Endpoint: { type: "builtInParams", name: "endpoint" },
      Region: { type: "builtInParams", name: "region" },
      UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" }
    };
  }
  constructor(input) {
    super();
    this.input = input;
  }
  resolveMiddleware(clientStack, configuration, options) {
    this.middlewareStack.use(getSerdePlugin(configuration, this.serialize, this.deserialize));
    this.middlewareStack.use(getEndpointPlugin(configuration, _AssumeRoleWithWebIdentityCommand.getEndpointParameterInstructions()));
    const stack = clientStack.concat(this.middlewareStack);
    const { logger: logger2 } = configuration;
    const clientName = "STSClient";
    const commandName = "AssumeRoleWithWebIdentityCommand";
    const handlerExecutionContext = {
      logger: logger2,
      clientName,
      commandName,
      inputFilterSensitiveLog: AssumeRoleWithWebIdentityRequestFilterSensitiveLog,
      outputFilterSensitiveLog: AssumeRoleWithWebIdentityResponseFilterSensitiveLog
    };
    const { requestHandler } = configuration;
    return stack.resolve((request2) => requestHandler.handle(request2.request, options || {}), handlerExecutionContext);
  }
  serialize(input, context) {
    return se_AssumeRoleWithWebIdentityCommand(input, context);
  }
  deserialize(output, context) {
    return de_AssumeRoleWithWebIdentityCommand(output, context);
  }
};
var ASSUME_ROLE_DEFAULT_REGION = "us-east-1";
var decorateDefaultRegion = (region) => {
  if (typeof region !== "function") {
    return region === void 0 ? ASSUME_ROLE_DEFAULT_REGION : region;
  }
  return async () => {
    try {
      return await region();
    } catch (e5) {
      return ASSUME_ROLE_DEFAULT_REGION;
    }
  };
};
var getDefaultRoleAssumer = (stsOptions, stsClientCtor) => {
  let stsClient;
  let closureSourceCreds;
  return async (sourceCreds, params) => {
    closureSourceCreds = sourceCreds;
    if (!stsClient) {
      const { logger: logger2, region, requestHandler } = stsOptions;
      stsClient = new stsClientCtor({
        logger: logger2,
        credentialDefaultProvider: () => async () => closureSourceCreds,
        region: decorateDefaultRegion(region || stsOptions.region),
        ...requestHandler ? { requestHandler } : {}
      });
    }
    const { Credentials } = await stsClient.send(new AssumeRoleCommand(params));
    if (!Credentials || !Credentials.AccessKeyId || !Credentials.SecretAccessKey) {
      throw new Error(`Invalid response from STS.assumeRole call with role ${params.RoleArn}`);
    }
    return {
      accessKeyId: Credentials.AccessKeyId,
      secretAccessKey: Credentials.SecretAccessKey,
      sessionToken: Credentials.SessionToken,
      expiration: Credentials.Expiration
    };
  };
};
var getDefaultRoleAssumerWithWebIdentity = (stsOptions, stsClientCtor) => {
  let stsClient;
  return async (params) => {
    if (!stsClient) {
      const { logger: logger2, region, requestHandler } = stsOptions;
      stsClient = new stsClientCtor({
        logger: logger2,
        region: decorateDefaultRegion(region || stsOptions.region),
        ...requestHandler ? { requestHandler } : {}
      });
    }
    const { Credentials } = await stsClient.send(new AssumeRoleWithWebIdentityCommand(params));
    if (!Credentials || !Credentials.AccessKeyId || !Credentials.SecretAccessKey) {
      throw new Error(`Invalid response from STS.assumeRoleWithWebIdentity call with role ${params.RoleArn}`);
    }
    return {
      accessKeyId: Credentials.AccessKeyId,
      secretAccessKey: Credentials.SecretAccessKey,
      sessionToken: Credentials.SessionToken,
      expiration: Credentials.Expiration
    };
  };
};
var decorateDefaultCredentialProvider = (provider) => (input) => provider({
  roleAssumer: getDefaultRoleAssumer(input, input.stsClientCtor),
  roleAssumerWithWebIdentity: getDefaultRoleAssumerWithWebIdentity(input, input.stsClientCtor),
  ...input
});
var ENV_KEY = "AWS_ACCESS_KEY_ID";
var ENV_SECRET = "AWS_SECRET_ACCESS_KEY";
var ENV_SESSION = "AWS_SESSION_TOKEN";
var ENV_EXPIRATION = "AWS_CREDENTIAL_EXPIRATION";
var fromEnv = () => async () => {
  const accessKeyId = process.env[ENV_KEY];
  const secretAccessKey = process.env[ENV_SECRET];
  const sessionToken = process.env[ENV_SESSION];
  const expiry = process.env[ENV_EXPIRATION];
  if (accessKeyId && secretAccessKey) {
    return {
      accessKeyId,
      secretAccessKey,
      ...sessionToken && { sessionToken },
      ...expiry && { expiration: new Date(expiry) }
    };
  }
  throw new CredentialsProviderError("Unable to find environment variable credentials.");
};
var getHomeDir = () => {
  const { HOME, USERPROFILE, HOMEPATH, HOMEDRIVE = `C:${sep}` } = process.env;
  if (HOME)
    return HOME;
  if (USERPROFILE)
    return USERPROFILE;
  if (HOMEPATH)
    return `${HOMEDRIVE}${HOMEPATH}`;
  return homedir();
};
var ENV_PROFILE = "AWS_PROFILE";
var DEFAULT_PROFILE = "default";
var getProfileName = (init) => init.profile || process.env[ENV_PROFILE] || DEFAULT_PROFILE;
var getSSOTokenFilepath = (id) => {
  const hasher = createHash("sha1");
  const cacheName = hasher.update(id).digest("hex");
  return join(getHomeDir(), ".aws", "sso", "cache", `${cacheName}.json`);
};
var { readFile } = promises;
var getSSOTokenFromFile = async (id) => {
  const ssoTokenFilepath = getSSOTokenFilepath(id);
  const ssoTokenText = await readFile(ssoTokenFilepath, "utf8");
  return JSON.parse(ssoTokenText);
};
var ENV_CONFIG_PATH = "AWS_CONFIG_FILE";
var getConfigFilepath = () => process.env[ENV_CONFIG_PATH] || join(getHomeDir(), ".aws", "config");
var ENV_CREDENTIALS_PATH = "AWS_SHARED_CREDENTIALS_FILE";
var getCredentialsFilepath = () => process.env[ENV_CREDENTIALS_PATH] || join(getHomeDir(), ".aws", "credentials");
var profileKeyRegex = /^profile\s(["'])?([^\1]+)\1$/;
var getProfileData = (data) => Object.entries(data).filter(([key]) => profileKeyRegex.test(key)).reduce((acc, [key, value]) => ({ ...acc, [profileKeyRegex.exec(key)[2]]: value }), {
  ...data.default && { default: data.default }
});
var profileNameBlockList = ["__proto__", "profile __proto__"];
var parseIni = (iniData) => {
  const map2 = {};
  let currentSection;
  for (let line of iniData.split(/\r?\n/)) {
    line = line.split(/(^|\s)[;#]/)[0].trim();
    const isSection = line[0] === "[" && line[line.length - 1] === "]";
    if (isSection) {
      currentSection = line.substring(1, line.length - 1);
      if (profileNameBlockList.includes(currentSection)) {
        throw new Error(`Found invalid profile name "${currentSection}"`);
      }
    } else if (currentSection) {
      const indexOfEqualsSign = line.indexOf("=");
      const start = 0;
      const end = line.length - 1;
      const isAssignment = indexOfEqualsSign !== -1 && indexOfEqualsSign !== start && indexOfEqualsSign !== end;
      if (isAssignment) {
        const [name, value] = [
          line.substring(0, indexOfEqualsSign).trim(),
          line.substring(indexOfEqualsSign + 1).trim()
        ];
        map2[currentSection] = map2[currentSection] || {};
        map2[currentSection][name] = value;
      }
    }
  }
  return map2;
};
var { readFile: readFile2 } = promises;
var filePromisesHash = {};
var slurpFile = (path2, options) => {
  if (!filePromisesHash[path2] || (options == null ? void 0 : options.ignoreCache)) {
    filePromisesHash[path2] = readFile2(path2, "utf8");
  }
  return filePromisesHash[path2];
};
var swallowError = () => ({});
var loadSharedConfigFiles = async (init = {}) => {
  const { filepath = getCredentialsFilepath(), configFilepath = getConfigFilepath() } = init;
  const parsedFiles = await Promise.all([
    slurpFile(configFilepath, {
      ignoreCache: init.ignoreCache
    }).then(parseIni).then(getProfileData).catch(swallowError),
    slurpFile(filepath, {
      ignoreCache: init.ignoreCache
    }).then(parseIni).catch(swallowError)
  ]);
  return {
    configFile: parsedFiles[0],
    credentialsFile: parsedFiles[1]
  };
};
var ssoSessionKeyRegex = /^sso-session\s(["'])?([^\1]+)\1$/;
var getSsoSessionData = (data) => Object.entries(data).filter(([key]) => ssoSessionKeyRegex.test(key)).reduce((acc, [key, value]) => ({ ...acc, [ssoSessionKeyRegex.exec(key)[2]]: value }), {});
var swallowError2 = () => ({});
var loadSsoSessionData = async (init = {}) => slurpFile(init.configFilepath ?? getConfigFilepath()).then(parseIni).then(getSsoSessionData).catch(swallowError2);
var mergeConfigFiles = (...files) => {
  const merged = {};
  for (const file of files) {
    for (const [key, values] of Object.entries(file)) {
      if (merged[key] !== void 0) {
        Object.assign(merged[key], values);
      } else {
        merged[key] = values;
      }
    }
  }
  return merged;
};
var parseKnownFiles = async (init) => {
  const parsedFiles = await loadSharedConfigFiles(init);
  return mergeConfigFiles(parsedFiles.configFile, parsedFiles.credentialsFile);
};
function httpRequest(options) {
  return new Promise((resolve, reject) => {
    var _a;
    const req = request$1({
      method: "GET",
      ...options,
      hostname: (_a = options.hostname) == null ? void 0 : _a.replace(/^\[(.+)\]$/, "$1")
    });
    req.on("error", (err) => {
      reject(Object.assign(new ProviderError("Unable to connect to instance metadata service"), err));
      req.destroy();
    });
    req.on("timeout", () => {
      reject(new ProviderError("TimeoutError from instance metadata service"));
      req.destroy();
    });
    req.on("response", (res) => {
      const { statusCode = 400 } = res;
      if (statusCode < 200 || 300 <= statusCode) {
        reject(Object.assign(new ProviderError("Error response received from instance metadata service"), { statusCode }));
        req.destroy();
      }
      const chunks = [];
      res.on("data", (chunk) => {
        chunks.push(chunk);
      });
      res.on("end", () => {
        resolve(Buffer$1.concat(chunks));
        req.destroy();
      });
    });
    req.end();
  });
}
var isImdsCredentials = (arg) => Boolean(arg) && typeof arg === "object" && typeof arg.AccessKeyId === "string" && typeof arg.SecretAccessKey === "string" && typeof arg.Token === "string" && typeof arg.Expiration === "string";
var fromImdsCredentials = (creds) => ({
  accessKeyId: creds.AccessKeyId,
  secretAccessKey: creds.SecretAccessKey,
  sessionToken: creds.Token,
  expiration: new Date(creds.Expiration)
});
var DEFAULT_TIMEOUT = 1e3;
var DEFAULT_MAX_RETRIES = 0;
var providerConfigFromInit = ({ maxRetries = DEFAULT_MAX_RETRIES, timeout = DEFAULT_TIMEOUT }) => ({ maxRetries, timeout });
var retry$2 = (toRetry, maxRetries) => {
  let promise = toRetry();
  for (let i5 = 0; i5 < maxRetries; i5++) {
    promise = promise.catch(toRetry);
  }
  return promise;
};
var ENV_CMDS_FULL_URI = "AWS_CONTAINER_CREDENTIALS_FULL_URI";
var ENV_CMDS_RELATIVE_URI = "AWS_CONTAINER_CREDENTIALS_RELATIVE_URI";
var ENV_CMDS_AUTH_TOKEN = "AWS_CONTAINER_AUTHORIZATION_TOKEN";
var fromContainerMetadata = (init = {}) => {
  const { timeout, maxRetries } = providerConfigFromInit(init);
  return () => retry$2(async () => {
    const requestOptions = await getCmdsUri();
    const credsResponse = JSON.parse(await requestFromEcsImds(timeout, requestOptions));
    if (!isImdsCredentials(credsResponse)) {
      throw new CredentialsProviderError("Invalid response received from instance metadata service.");
    }
    return fromImdsCredentials(credsResponse);
  }, maxRetries);
};
var requestFromEcsImds = async (timeout, options) => {
  if (process.env[ENV_CMDS_AUTH_TOKEN]) {
    options.headers = {
      ...options.headers,
      Authorization: process.env[ENV_CMDS_AUTH_TOKEN]
    };
  }
  const buffer = await httpRequest({
    ...options,
    timeout
  });
  return buffer.toString();
};
var CMDS_IP = "169.254.170.2";
var GREENGRASS_HOSTS = {
  localhost: true,
  "127.0.0.1": true
};
var GREENGRASS_PROTOCOLS = {
  "http:": true,
  "https:": true
};
var getCmdsUri = async () => {
  if (process.env[ENV_CMDS_RELATIVE_URI]) {
    return {
      hostname: CMDS_IP,
      path: process.env[ENV_CMDS_RELATIVE_URI]
    };
  }
  if (process.env[ENV_CMDS_FULL_URI]) {
    const parsed = parse(process.env[ENV_CMDS_FULL_URI]);
    if (!parsed.hostname || !(parsed.hostname in GREENGRASS_HOSTS)) {
      throw new CredentialsProviderError(`${parsed.hostname} is not a valid container metadata service hostname`, false);
    }
    if (!parsed.protocol || !(parsed.protocol in GREENGRASS_PROTOCOLS)) {
      throw new CredentialsProviderError(`${parsed.protocol} is not a valid container metadata service protocol`, false);
    }
    return {
      ...parsed,
      port: parsed.port ? parseInt(parsed.port, 10) : void 0
    };
  }
  throw new CredentialsProviderError(`The container metadata credential provider cannot be used unless the ${ENV_CMDS_RELATIVE_URI} or ${ENV_CMDS_FULL_URI} environment variable is set`, false);
};
var fromEnv2 = (envVarSelector) => async () => {
  try {
    const config = envVarSelector(process.env);
    if (config === void 0) {
      throw new Error();
    }
    return config;
  } catch (e5) {
    throw new CredentialsProviderError(e5.message || `Cannot load config from environment variables with getter: ${envVarSelector}`);
  }
};
var fromSharedConfigFiles = (configSelector, { preferredFile = "config", ...init } = {}) => async () => {
  const profile = getProfileName(init);
  const { configFile, credentialsFile } = await loadSharedConfigFiles(init);
  const profileFromCredentials = credentialsFile[profile] || {};
  const profileFromConfig = configFile[profile] || {};
  const mergedProfile = preferredFile === "config" ? { ...profileFromCredentials, ...profileFromConfig } : { ...profileFromConfig, ...profileFromCredentials };
  try {
    const configValue = configSelector(mergedProfile);
    if (configValue === void 0) {
      throw new Error();
    }
    return configValue;
  } catch (e5) {
    throw new CredentialsProviderError(e5.message || `Cannot load config for profile ${profile} in SDK configuration files with getter: ${configSelector}`);
  }
};
var isFunction = (func) => typeof func === "function";
var fromStatic2 = (defaultValue) => isFunction(defaultValue) ? async () => await defaultValue() : fromStatic(defaultValue);
var loadConfig = ({ environmentVariableSelector, configFileSelector, default: defaultValue }, configuration = {}) => memoize(chain(fromEnv2(environmentVariableSelector), fromSharedConfigFiles(configFileSelector, configuration), fromStatic2(defaultValue)));
var Endpoint;
(function(Endpoint2) {
  Endpoint2["IPv4"] = "http://169.254.169.254";
  Endpoint2["IPv6"] = "http://[fd00:ec2::254]";
})(Endpoint || (Endpoint = {}));
var ENV_ENDPOINT_NAME = "AWS_EC2_METADATA_SERVICE_ENDPOINT";
var CONFIG_ENDPOINT_NAME = "ec2_metadata_service_endpoint";
var ENDPOINT_CONFIG_OPTIONS = {
  environmentVariableSelector: (env2) => env2[ENV_ENDPOINT_NAME],
  configFileSelector: (profile) => profile[CONFIG_ENDPOINT_NAME],
  default: void 0
};
var EndpointMode;
(function(EndpointMode2) {
  EndpointMode2["IPv4"] = "IPv4";
  EndpointMode2["IPv6"] = "IPv6";
})(EndpointMode || (EndpointMode = {}));
var ENV_ENDPOINT_MODE_NAME = "AWS_EC2_METADATA_SERVICE_ENDPOINT_MODE";
var CONFIG_ENDPOINT_MODE_NAME = "ec2_metadata_service_endpoint_mode";
var ENDPOINT_MODE_CONFIG_OPTIONS = {
  environmentVariableSelector: (env2) => env2[ENV_ENDPOINT_MODE_NAME],
  configFileSelector: (profile) => profile[CONFIG_ENDPOINT_MODE_NAME],
  default: EndpointMode.IPv4
};
var getInstanceMetadataEndpoint = async () => parseUrl(await getFromEndpointConfig() || await getFromEndpointModeConfig());
var getFromEndpointConfig = async () => loadConfig(ENDPOINT_CONFIG_OPTIONS)();
var getFromEndpointModeConfig = async () => {
  const endpointMode = await loadConfig(ENDPOINT_MODE_CONFIG_OPTIONS)();
  switch (endpointMode) {
    case EndpointMode.IPv4:
      return Endpoint.IPv4;
    case EndpointMode.IPv6:
      return Endpoint.IPv6;
    default:
      throw new Error(`Unsupported endpoint mode: ${endpointMode}. Select from ${Object.values(EndpointMode)}`);
  }
};
var STATIC_STABILITY_REFRESH_INTERVAL_SECONDS = 5 * 60;
var STATIC_STABILITY_REFRESH_INTERVAL_JITTER_WINDOW_SECONDS = 5 * 60;
var STATIC_STABILITY_DOC_URL = "https://docs.aws.amazon.com/sdkref/latest/guide/feature-static-credentials.html";
var getExtendedInstanceMetadataCredentials = (credentials, logger2) => {
  const refreshInterval = STATIC_STABILITY_REFRESH_INTERVAL_SECONDS + Math.floor(Math.random() * STATIC_STABILITY_REFRESH_INTERVAL_JITTER_WINDOW_SECONDS);
  const newExpiration = new Date(Date.now() + refreshInterval * 1e3);
  logger2.warn("Attempting credential expiration extension due to a credential service availability issue. A refresh of these credentials will be attempted after ${new Date(newExpiration)}.\nFor more information, please visit: " + STATIC_STABILITY_DOC_URL);
  const originalExpiration = credentials.originalExpiration ?? credentials.expiration;
  return {
    ...credentials,
    ...originalExpiration ? { originalExpiration } : {},
    expiration: newExpiration
  };
};
var staticStabilityProvider = (provider, options = {}) => {
  const logger2 = (options == null ? void 0 : options.logger) || console;
  let pastCredentials;
  return async () => {
    let credentials;
    try {
      credentials = await provider();
      if (credentials.expiration && credentials.expiration.getTime() < Date.now()) {
        credentials = getExtendedInstanceMetadataCredentials(credentials, logger2);
      }
    } catch (e5) {
      if (pastCredentials) {
        logger2.warn("Credential renew failed: ", e5);
        credentials = getExtendedInstanceMetadataCredentials(pastCredentials, logger2);
      } else {
        throw e5;
      }
    }
    pastCredentials = credentials;
    return credentials;
  };
};
var IMDS_PATH = "/latest/meta-data/iam/security-credentials/";
var IMDS_TOKEN_PATH = "/latest/api/token";
var fromInstanceMetadata = (init = {}) => staticStabilityProvider(getInstanceImdsProvider(init), { logger: init.logger });
var getInstanceImdsProvider = (init) => {
  let disableFetchToken = false;
  const { timeout, maxRetries } = providerConfigFromInit(init);
  const getCredentials = async (maxRetries2, options) => {
    const profile = (await retry$2(async () => {
      let profile2;
      try {
        profile2 = await getProfile(options);
      } catch (err) {
        if (err.statusCode === 401) {
          disableFetchToken = false;
        }
        throw err;
      }
      return profile2;
    }, maxRetries2)).trim();
    return retry$2(async () => {
      let creds;
      try {
        creds = await getCredentialsFromProfile(profile, options);
      } catch (err) {
        if (err.statusCode === 401) {
          disableFetchToken = false;
        }
        throw err;
      }
      return creds;
    }, maxRetries2);
  };
  return async () => {
    const endpoint = await getInstanceMetadataEndpoint();
    if (disableFetchToken) {
      return getCredentials(maxRetries, { ...endpoint, timeout });
    } else {
      let token;
      try {
        token = (await getMetadataToken({ ...endpoint, timeout })).toString();
      } catch (error) {
        if ((error == null ? void 0 : error.statusCode) === 400) {
          throw Object.assign(error, {
            message: "EC2 Metadata token request returned error"
          });
        } else if (error.message === "TimeoutError" || [403, 404, 405].includes(error.statusCode)) {
          disableFetchToken = true;
        }
        return getCredentials(maxRetries, { ...endpoint, timeout });
      }
      return getCredentials(maxRetries, {
        ...endpoint,
        headers: {
          "x-aws-ec2-metadata-token": token
        },
        timeout
      });
    }
  };
};
var getMetadataToken = async (options) => httpRequest({
  ...options,
  path: IMDS_TOKEN_PATH,
  method: "PUT",
  headers: {
    "x-aws-ec2-metadata-token-ttl-seconds": "21600"
  }
});
var getProfile = async (options) => (await httpRequest({ ...options, path: IMDS_PATH })).toString();
var getCredentialsFromProfile = async (profile, options) => {
  const credsResponse = JSON.parse((await httpRequest({
    ...options,
    path: IMDS_PATH + profile
  })).toString());
  if (!isImdsCredentials(credsResponse)) {
    throw new CredentialsProviderError("Invalid response received from instance metadata service.");
  }
  return fromImdsCredentials(credsResponse);
};
var resolveCredentialSource = (credentialSource, profileName) => {
  const sourceProvidersMap = {
    EcsContainer: fromContainerMetadata,
    Ec2InstanceMetadata: fromInstanceMetadata,
    Environment: fromEnv
  };
  if (credentialSource in sourceProvidersMap) {
    return sourceProvidersMap[credentialSource]();
  } else {
    throw new CredentialsProviderError(`Unsupported credential source in profile ${profileName}. Got ${credentialSource}, expected EcsContainer or Ec2InstanceMetadata or Environment.`);
  }
};
var isAssumeRoleProfile = (arg) => Boolean(arg) && typeof arg === "object" && typeof arg.role_arn === "string" && ["undefined", "string"].indexOf(typeof arg.role_session_name) > -1 && ["undefined", "string"].indexOf(typeof arg.external_id) > -1 && ["undefined", "string"].indexOf(typeof arg.mfa_serial) > -1 && (isAssumeRoleWithSourceProfile(arg) || isAssumeRoleWithProviderProfile(arg));
var isAssumeRoleWithSourceProfile = (arg) => typeof arg.source_profile === "string" && typeof arg.credential_source === "undefined";
var isAssumeRoleWithProviderProfile = (arg) => typeof arg.credential_source === "string" && typeof arg.source_profile === "undefined";
var resolveAssumeRoleCredentials = async (profileName, profiles, options, visitedProfiles = {}) => {
  const data = profiles[profileName];
  if (!options.roleAssumer) {
    throw new CredentialsProviderError(`Profile ${profileName} requires a role to be assumed, but no role assumption callback was provided.`, false);
  }
  const { source_profile } = data;
  if (source_profile && source_profile in visitedProfiles) {
    throw new CredentialsProviderError(`Detected a cycle attempting to resolve credentials for profile ${getProfileName(options)}. Profiles visited: ` + Object.keys(visitedProfiles).join(", "), false);
  }
  const sourceCredsProvider = source_profile ? resolveProfileData(source_profile, profiles, options, {
    ...visitedProfiles,
    [source_profile]: true
  }) : resolveCredentialSource(data.credential_source, profileName)();
  const params = {
    RoleArn: data.role_arn,
    RoleSessionName: data.role_session_name || `aws-sdk-js-${Date.now()}`,
    ExternalId: data.external_id
  };
  const { mfa_serial } = data;
  if (mfa_serial) {
    if (!options.mfaCodeProvider) {
      throw new CredentialsProviderError(`Profile ${profileName} requires multi-factor authentication, but no MFA code callback was provided.`, false);
    }
    params.SerialNumber = mfa_serial;
    params.TokenCode = await options.mfaCodeProvider(mfa_serial);
  }
  const sourceCreds = await sourceCredsProvider;
  return options.roleAssumer(sourceCreds, params);
};
var getValidatedProcessCredentials = (profileName, data) => {
  if (data.Version !== 1) {
    throw Error(`Profile ${profileName} credential_process did not return Version 1.`);
  }
  if (data.AccessKeyId === void 0 || data.SecretAccessKey === void 0) {
    throw Error(`Profile ${profileName} credential_process returned invalid credentials.`);
  }
  if (data.Expiration) {
    const currentTime = /* @__PURE__ */ new Date();
    const expireTime = new Date(data.Expiration);
    if (expireTime < currentTime) {
      throw Error(`Profile ${profileName} credential_process returned expired credentials.`);
    }
  }
  return {
    accessKeyId: data.AccessKeyId,
    secretAccessKey: data.SecretAccessKey,
    ...data.SessionToken && { sessionToken: data.SessionToken },
    ...data.Expiration && { expiration: new Date(data.Expiration) }
  };
};
var resolveProcessCredentials = async (profileName, profiles) => {
  const profile = profiles[profileName];
  if (profiles[profileName]) {
    const credentialProcess = profile["credential_process"];
    if (credentialProcess !== void 0) {
      const execPromise = promisify(exec);
      try {
        const { stdout } = await execPromise(credentialProcess);
        let data;
        try {
          data = JSON.parse(stdout.trim());
        } catch {
          throw Error(`Profile ${profileName} credential_process returned invalid JSON.`);
        }
        return getValidatedProcessCredentials(profileName, data);
      } catch (error) {
        throw new CredentialsProviderError(error.message);
      }
    } else {
      throw new CredentialsProviderError(`Profile ${profileName} did not contain credential_process.`);
    }
  } else {
    throw new CredentialsProviderError(`Profile ${profileName} could not be found in shared credentials file.`);
  }
};
var fromProcess = (init = {}) => async () => {
  const profiles = await parseKnownFiles(init);
  return resolveProcessCredentials(getProfileName(init), profiles);
};
var isProcessProfile = (arg) => Boolean(arg) && typeof arg === "object" && typeof arg.credential_process === "string";
var resolveProcessCredentials2 = async (options, profile) => fromProcess({
  ...options,
  profile
})();
var isSsoProfile = (arg) => arg && (typeof arg.sso_start_url === "string" || typeof arg.sso_account_id === "string" || typeof arg.sso_session === "string" || typeof arg.sso_region === "string" || typeof arg.sso_role_name === "string");
var resolveClientEndpointParameters3 = (options) => {
  return {
    ...options,
    useDualstackEndpoint: options.useDualstackEndpoint ?? false,
    useFipsEndpoint: options.useFipsEndpoint ?? false,
    defaultSigningName: "awsssoportal"
  };
};
var package_default3 = {
  name: "@aws-sdk/client-sso",
  description: "AWS SDK for JavaScript Sso Client for Node.js, Browser and React Native",
  version: "3.362.0",
  scripts: {
    build: "concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
    "build:cjs": "tsc -p tsconfig.cjs.json",
    "build:docs": "typedoc",
    "build:es": "tsc -p tsconfig.es.json",
    "build:include:deps": "lerna run --scope $npm_package_name --include-dependencies build",
    "build:types": "tsc -p tsconfig.types.json",
    "build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
    clean: "rimraf ./dist-* && rimraf *.tsbuildinfo",
    "extract:docs": "api-extractor run --local",
    "generate:client": "node ../../scripts/generate-clients/single-service --solo sso"
  },
  main: "./dist-cjs/index.js",
  types: "./dist-types/index.d.ts",
  module: "./dist-es/index.js",
  sideEffects: false,
  dependencies: {
    "@aws-crypto/sha256-browser": "3.0.0",
    "@aws-crypto/sha256-js": "3.0.0",
    "@aws-sdk/config-resolver": "3.357.0",
    "@aws-sdk/fetch-http-handler": "3.357.0",
    "@aws-sdk/hash-node": "3.357.0",
    "@aws-sdk/invalid-dependency": "3.357.0",
    "@aws-sdk/middleware-content-length": "3.357.0",
    "@aws-sdk/middleware-endpoint": "3.357.0",
    "@aws-sdk/middleware-host-header": "3.357.0",
    "@aws-sdk/middleware-logger": "3.357.0",
    "@aws-sdk/middleware-recursion-detection": "3.357.0",
    "@aws-sdk/middleware-retry": "3.362.0",
    "@aws-sdk/middleware-serde": "3.357.0",
    "@aws-sdk/middleware-stack": "3.357.0",
    "@aws-sdk/middleware-user-agent": "3.357.0",
    "@aws-sdk/node-config-provider": "3.357.0",
    "@aws-sdk/node-http-handler": "3.360.0",
    "@aws-sdk/smithy-client": "3.360.0",
    "@aws-sdk/types": "3.357.0",
    "@aws-sdk/url-parser": "3.357.0",
    "@aws-sdk/util-base64": "3.310.0",
    "@aws-sdk/util-body-length-browser": "3.310.0",
    "@aws-sdk/util-body-length-node": "3.310.0",
    "@aws-sdk/util-defaults-mode-browser": "3.360.0",
    "@aws-sdk/util-defaults-mode-node": "3.360.0",
    "@aws-sdk/util-endpoints": "3.357.0",
    "@aws-sdk/util-retry": "3.362.0",
    "@aws-sdk/util-user-agent-browser": "3.357.0",
    "@aws-sdk/util-user-agent-node": "3.357.0",
    "@aws-sdk/util-utf8": "3.310.0",
    "@smithy/protocol-http": "^1.0.1",
    "@smithy/types": "^1.0.0",
    tslib: "^2.5.0"
  },
  devDependencies: {
    "@aws-sdk/service-client-documentation-generator": "3.310.0",
    "@tsconfig/node14": "1.0.3",
    "@types/node": "^14.14.31",
    concurrently: "7.0.0",
    "downlevel-dts": "0.10.1",
    rimraf: "3.0.2",
    typedoc: "0.23.23",
    typescript: "~4.9.5"
  },
  engines: {
    node: ">=14.0.0"
  },
  typesVersions: {
    "<4.0": {
      "dist-types/*": [
        "dist-types/ts3.4/*"
      ]
    }
  },
  files: [
    "dist-*/**"
  ],
  author: {
    name: "AWS SDK for JavaScript Team",
    url: "https://aws.amazon.com/javascript/"
  },
  license: "Apache-2.0",
  browser: {
    "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.browser"
  },
  "react-native": {
    "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.native"
  },
  homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-sso",
  repository: {
    type: "git",
    url: "https://github.com/aws/aws-sdk-js-v3.git",
    directory: "clients/client-sso"
  }
};
var Hash = class {
  constructor(algorithmIdentifier, secret2) {
    this.algorithmIdentifier = algorithmIdentifier;
    this.secret = secret2;
    this.reset();
  }
  update(toHash, encoding) {
    this.hash.update(toUint8Array(castSourceData(toHash, encoding)));
  }
  digest() {
    return Promise.resolve(this.hash.digest());
  }
  reset() {
    this.hash = this.secret ? createHmac(this.algorithmIdentifier, castSourceData(this.secret)) : createHash(this.algorithmIdentifier);
  }
};
function castSourceData(toCast, encoding) {
  if (Buffer$1.isBuffer(toCast)) {
    return toCast;
  }
  if (typeof toCast === "string") {
    return fromString(toCast, encoding);
  }
  if (ArrayBuffer.isView(toCast)) {
    return fromArrayBuffer(toCast.buffer, toCast.byteOffset, toCast.byteLength);
  }
  return fromArrayBuffer(toCast);
}
var calculateBodyLength = (body) => {
  if (!body) {
    return 0;
  }
  if (typeof body === "string") {
    return Buffer.from(body).length;
  } else if (typeof body.byteLength === "number") {
    return body.byteLength;
  } else if (typeof body.size === "number") {
    return body.size;
  } else if (typeof body.path === "string" || Buffer.isBuffer(body.path)) {
    return lstatSync(body.path).size;
  } else if (typeof body.fd === "number") {
    return fstatSync(body.fd).size;
  }
  throw new Error(`Body Length computation failed for ${body}`);
};
var isCrtAvailable = () => {
  try {
    if (typeof __require === "function" && typeof module !== "undefined" && __require("aws-crt")) {
      return ["md/crt-avail"];
    }
    return null;
  } catch (e5) {
    return null;
  }
};
var UA_APP_ID_ENV_NAME = "AWS_SDK_UA_APP_ID";
var UA_APP_ID_INI_NAME = "sdk-ua-app-id";
var defaultUserAgent = ({ serviceId, clientVersion }) => {
  const sections = [
    ["aws-sdk-js", clientVersion],
    ["ua", "2.0"],
    [`os/${platform()}`, release()],
    ["lang/js"],
    ["md/nodejs", `${versions.node}`]
  ];
  const crtAvailable = isCrtAvailable();
  if (crtAvailable) {
    sections.push(crtAvailable);
  }
  if (serviceId) {
    sections.push([`api/${serviceId}`, clientVersion]);
  }
  if (env.AWS_EXECUTION_ENV) {
    sections.push([`exec-env/${env.AWS_EXECUTION_ENV}`]);
  }
  const appIdPromise = loadConfig({
    environmentVariableSelector: (env2) => env2[UA_APP_ID_ENV_NAME],
    configFileSelector: (profile) => profile[UA_APP_ID_INI_NAME],
    default: void 0
  })();
  let resolvedUserAgent = void 0;
  return async () => {
    if (!resolvedUserAgent) {
      const appId = await appIdPromise;
      resolvedUserAgent = appId ? [...sections, [`app/${appId}`]] : [...sections];
    }
    return resolvedUserAgent;
  };
};
var p = "required";
var q = "fn";
var r = "argv";
var s = "ref";
var a = "PartitionResult";
var b = "tree";
var c = "error";
var d = "endpoint";
var e = { [p]: false, "type": "String" };
var f = { [p]: true, "default": false, "type": "Boolean" };
var g = { [s]: "Endpoint" };
var h = { [q]: "booleanEquals", [r]: [{ [s]: "UseFIPS" }, true] };
var i = { [q]: "booleanEquals", [r]: [{ [s]: "UseDualStack" }, true] };
var j = {};
var k = { [q]: "booleanEquals", [r]: [true, { [q]: "getAttr", [r]: [{ [s]: a }, "supportsFIPS"] }] };
var l = { [q]: "booleanEquals", [r]: [true, { [q]: "getAttr", [r]: [{ [s]: a }, "supportsDualStack"] }] };
var m = [g];
var n = [h];
var o = [i];
var _data = { version: "1.0", parameters: { Region: e, UseDualStack: f, UseFIPS: f, Endpoint: e }, rules: [{ conditions: [{ [q]: "aws.partition", [r]: [{ [s]: "Region" }], assign: a }], type: b, rules: [{ conditions: [{ [q]: "isSet", [r]: m }, { [q]: "parseURL", [r]: m, assign: "url" }], type: b, rules: [{ conditions: n, error: "Invalid Configuration: FIPS and custom endpoint are not supported", type: c }, { type: b, rules: [{ conditions: o, error: "Invalid Configuration: Dualstack and custom endpoint are not supported", type: c }, { endpoint: { url: g, properties: j, headers: j }, type: d }] }] }, { conditions: [h, i], type: b, rules: [{ conditions: [k, l], type: b, rules: [{ endpoint: { url: "https://portal.sso-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: j, headers: j }, type: d }] }, { error: "FIPS and DualStack are enabled, but this partition does not support one or both", type: c }] }, { conditions: n, type: b, rules: [{ conditions: [k], type: b, rules: [{ type: b, rules: [{ endpoint: { url: "https://portal.sso-fips.{Region}.{PartitionResult#dnsSuffix}", properties: j, headers: j }, type: d }] }] }, { error: "FIPS is enabled but this partition does not support FIPS", type: c }] }, { conditions: o, type: b, rules: [{ conditions: [l], type: b, rules: [{ endpoint: { url: "https://portal.sso.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: j, headers: j }, type: d }] }, { error: "DualStack is enabled but this partition does not support DualStack", type: c }] }, { endpoint: { url: "https://portal.sso.{Region}.{PartitionResult#dnsSuffix}", properties: j, headers: j }, type: d }] }] };
var ruleSet = _data;
var defaultEndpointResolver = (endpointParams, context = {}) => {
  return resolveEndpoint(ruleSet, {
    endpointParams,
    logger: context.logger
  });
};
var getRuntimeConfig = (config) => ({
  apiVersion: "2019-06-10",
  base64Decoder: (config == null ? void 0 : config.base64Decoder) ?? fromBase64,
  base64Encoder: (config == null ? void 0 : config.base64Encoder) ?? toBase64,
  disableHostPrefix: (config == null ? void 0 : config.disableHostPrefix) ?? false,
  endpointProvider: (config == null ? void 0 : config.endpointProvider) ?? defaultEndpointResolver,
  logger: (config == null ? void 0 : config.logger) ?? new NoOpLogger(),
  serviceId: (config == null ? void 0 : config.serviceId) ?? "SSO",
  urlParser: (config == null ? void 0 : config.urlParser) ?? parseUrl,
  utf8Decoder: (config == null ? void 0 : config.utf8Decoder) ?? fromUtf84,
  utf8Encoder: (config == null ? void 0 : config.utf8Encoder) ?? toUtf84
});
var AWS_EXECUTION_ENV = "AWS_EXECUTION_ENV";
var AWS_REGION_ENV = "AWS_REGION";
var AWS_DEFAULT_REGION_ENV = "AWS_DEFAULT_REGION";
var ENV_IMDS_DISABLED = "AWS_EC2_METADATA_DISABLED";
var DEFAULTS_MODE_OPTIONS = ["in-region", "cross-region", "mobile", "standard", "legacy"];
var IMDS_REGION_PATH = "/latest/meta-data/placement/region";
var AWS_DEFAULTS_MODE_ENV = "AWS_DEFAULTS_MODE";
var AWS_DEFAULTS_MODE_CONFIG = "defaults_mode";
var NODE_DEFAULTS_MODE_CONFIG_OPTIONS = {
  environmentVariableSelector: (env2) => {
    return env2[AWS_DEFAULTS_MODE_ENV];
  },
  configFileSelector: (profile) => {
    return profile[AWS_DEFAULTS_MODE_CONFIG];
  },
  default: "legacy"
};
var resolveDefaultsModeConfig = ({ region = loadConfig(NODE_REGION_CONFIG_OPTIONS), defaultsMode = loadConfig(NODE_DEFAULTS_MODE_CONFIG_OPTIONS) } = {}) => memoize(async () => {
  const mode2 = typeof defaultsMode === "function" ? await defaultsMode() : defaultsMode;
  switch (mode2 == null ? void 0 : mode2.toLowerCase()) {
    case "auto":
      return resolveNodeDefaultsModeAuto(region);
    case "in-region":
    case "cross-region":
    case "mobile":
    case "standard":
    case "legacy":
      return Promise.resolve(mode2 == null ? void 0 : mode2.toLocaleLowerCase());
    case void 0:
      return Promise.resolve("legacy");
    default:
      throw new Error(`Invalid parameter for "defaultsMode", expect ${DEFAULTS_MODE_OPTIONS.join(", ")}, got ${mode2}`);
  }
});
var resolveNodeDefaultsModeAuto = async (clientRegion) => {
  if (clientRegion) {
    const resolvedRegion = typeof clientRegion === "function" ? await clientRegion() : clientRegion;
    const inferredRegion = await inferPhysicalRegion();
    if (!inferredRegion) {
      return "standard";
    }
    if (resolvedRegion === inferredRegion) {
      return "in-region";
    } else {
      return "cross-region";
    }
  }
  return "standard";
};
var inferPhysicalRegion = async () => {
  if (process.env[AWS_EXECUTION_ENV] && (process.env[AWS_REGION_ENV] || process.env[AWS_DEFAULT_REGION_ENV])) {
    return process.env[AWS_REGION_ENV] ?? process.env[AWS_DEFAULT_REGION_ENV];
  }
  if (!process.env[ENV_IMDS_DISABLED]) {
    try {
      const endpoint = await getInstanceMetadataEndpoint();
      return (await httpRequest({ ...endpoint, path: IMDS_REGION_PATH })).toString();
    } catch (e5) {
    }
  }
};
var getRuntimeConfig2 = (config) => {
  emitWarningIfUnsupportedVersion(process.version);
  const defaultsMode = resolveDefaultsModeConfig(config);
  const defaultConfigProvider = () => defaultsMode().then(loadConfigsForDefaultMode);
  const clientSharedValues = getRuntimeConfig(config);
  return {
    ...clientSharedValues,
    ...config,
    runtime: "node",
    defaultsMode,
    bodyLengthChecker: (config == null ? void 0 : config.bodyLengthChecker) ?? calculateBodyLength,
    defaultUserAgentProvider: (config == null ? void 0 : config.defaultUserAgentProvider) ?? defaultUserAgent({ serviceId: clientSharedValues.serviceId, clientVersion: package_default3.version }),
    maxAttempts: (config == null ? void 0 : config.maxAttempts) ?? loadConfig(NODE_MAX_ATTEMPT_CONFIG_OPTIONS),
    region: (config == null ? void 0 : config.region) ?? loadConfig(NODE_REGION_CONFIG_OPTIONS, NODE_REGION_CONFIG_FILE_OPTIONS),
    requestHandler: (config == null ? void 0 : config.requestHandler) ?? new NodeHttpHandler(defaultConfigProvider),
    retryMode: (config == null ? void 0 : config.retryMode) ?? loadConfig({
      ...NODE_RETRY_MODE_CONFIG_OPTIONS,
      default: async () => (await defaultConfigProvider()).retryMode || DEFAULT_RETRY_MODE
    }),
    sha256: (config == null ? void 0 : config.sha256) ?? Hash.bind(null, "sha256"),
    streamCollector: (config == null ? void 0 : config.streamCollector) ?? streamCollector,
    useDualstackEndpoint: (config == null ? void 0 : config.useDualstackEndpoint) ?? loadConfig(NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS),
    useFipsEndpoint: (config == null ? void 0 : config.useFipsEndpoint) ?? loadConfig(NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS)
  };
};
var SSOClient = class extends Client {
  constructor(configuration) {
    const _config_0 = getRuntimeConfig2(configuration);
    const _config_1 = resolveClientEndpointParameters3(_config_0);
    const _config_2 = resolveRegionConfig(_config_1);
    const _config_3 = resolveEndpointConfig(_config_2);
    const _config_4 = resolveRetryConfig(_config_3);
    const _config_5 = resolveHostHeaderConfig(_config_4);
    const _config_6 = resolveUserAgentConfig(_config_5);
    super(_config_6);
    this.config = _config_6;
    this.middlewareStack.use(getRetryPlugin(this.config));
    this.middlewareStack.use(getContentLengthPlugin(this.config));
    this.middlewareStack.use(getHostHeaderPlugin(this.config));
    this.middlewareStack.use(getLoggerPlugin(this.config));
    this.middlewareStack.use(getRecursionDetectionPlugin(this.config));
    this.middlewareStack.use(getUserAgentPlugin(this.config));
  }
  destroy() {
    super.destroy();
  }
};
var SSOServiceException = class _SSOServiceException extends ServiceException {
  constructor(options) {
    super(options);
    Object.setPrototypeOf(this, _SSOServiceException.prototype);
  }
};
var InvalidRequestException = class _InvalidRequestException extends SSOServiceException {
  constructor(opts) {
    super({
      name: "InvalidRequestException",
      $fault: "client",
      ...opts
    });
    this.name = "InvalidRequestException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _InvalidRequestException.prototype);
  }
};
var ResourceNotFoundException = class _ResourceNotFoundException extends SSOServiceException {
  constructor(opts) {
    super({
      name: "ResourceNotFoundException",
      $fault: "client",
      ...opts
    });
    this.name = "ResourceNotFoundException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _ResourceNotFoundException.prototype);
  }
};
var TooManyRequestsException = class _TooManyRequestsException extends SSOServiceException {
  constructor(opts) {
    super({
      name: "TooManyRequestsException",
      $fault: "client",
      ...opts
    });
    this.name = "TooManyRequestsException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _TooManyRequestsException.prototype);
  }
};
var UnauthorizedException = class _UnauthorizedException extends SSOServiceException {
  constructor(opts) {
    super({
      name: "UnauthorizedException",
      $fault: "client",
      ...opts
    });
    this.name = "UnauthorizedException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _UnauthorizedException.prototype);
  }
};
var GetRoleCredentialsRequestFilterSensitiveLog = (obj) => ({
  ...obj,
  ...obj.accessToken && { accessToken: SENSITIVE_STRING }
});
var RoleCredentialsFilterSensitiveLog = (obj) => ({
  ...obj,
  ...obj.secretAccessKey && { secretAccessKey: SENSITIVE_STRING },
  ...obj.sessionToken && { sessionToken: SENSITIVE_STRING }
});
var GetRoleCredentialsResponseFilterSensitiveLog = (obj) => ({
  ...obj,
  ...obj.roleCredentials && { roleCredentials: RoleCredentialsFilterSensitiveLog(obj.roleCredentials) }
});
var se_GetRoleCredentialsCommand = async (input, context) => {
  const { hostname, protocol = "https", port, path: basePath } = await context.endpoint();
  const headers = map({}, isSerializableHeaderValue, {
    "x-amz-sso_bearer_token": input.accessToken
  });
  const resolvedPath2 = `${(basePath == null ? void 0 : basePath.endsWith("/")) ? basePath.slice(0, -1) : basePath || ""}/federation/credentials`;
  const query = map({
    role_name: [, expectNonNull(input.roleName, `roleName`)],
    account_id: [, expectNonNull(input.accountId, `accountId`)]
  });
  let body;
  return new HttpRequest2({
    protocol,
    hostname,
    port,
    method: "GET",
    headers,
    path: resolvedPath2,
    query,
    body
  });
};
var de_GetRoleCredentialsCommand = async (output, context) => {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_GetRoleCredentialsCommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata3(output)
  });
  const data = expectNonNull(expectObject(await parseBody2(output.body, context)), "body");
  const doc = take(data, {
    roleCredentials: _json
  });
  Object.assign(contents, doc);
  return contents;
};
var de_GetRoleCredentialsCommandError = async (output, context) => {
  const parsedOutput = {
    ...output,
    body: await parseErrorBody2(output.body, context)
  };
  const errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
  switch (errorCode) {
    case "InvalidRequestException":
    case "com.amazonaws.sso#InvalidRequestException":
      throw await de_InvalidRequestExceptionRes(parsedOutput);
    case "ResourceNotFoundException":
    case "com.amazonaws.sso#ResourceNotFoundException":
      throw await de_ResourceNotFoundExceptionRes(parsedOutput);
    case "TooManyRequestsException":
    case "com.amazonaws.sso#TooManyRequestsException":
      throw await de_TooManyRequestsExceptionRes(parsedOutput);
    case "UnauthorizedException":
    case "com.amazonaws.sso#UnauthorizedException":
      throw await de_UnauthorizedExceptionRes(parsedOutput);
    default:
      const parsedBody = parsedOutput.body;
      return throwDefaultError3({
        output,
        parsedBody,
        errorCode
      });
  }
};
var throwDefaultError3 = withBaseException(SSOServiceException);
var de_InvalidRequestExceptionRes = async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    message: expectString
  });
  Object.assign(contents, doc);
  const exception = new InvalidRequestException({
    $metadata: deserializeMetadata3(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
};
var de_ResourceNotFoundExceptionRes = async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    message: expectString
  });
  Object.assign(contents, doc);
  const exception = new ResourceNotFoundException({
    $metadata: deserializeMetadata3(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
};
var de_TooManyRequestsExceptionRes = async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    message: expectString
  });
  Object.assign(contents, doc);
  const exception = new TooManyRequestsException({
    $metadata: deserializeMetadata3(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
};
var de_UnauthorizedExceptionRes = async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    message: expectString
  });
  Object.assign(contents, doc);
  const exception = new UnauthorizedException({
    $metadata: deserializeMetadata3(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
};
var deserializeMetadata3 = (output) => ({
  httpStatusCode: output.statusCode,
  requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
  extendedRequestId: output.headers["x-amz-id-2"],
  cfId: output.headers["x-amz-cf-id"]
});
var collectBodyString3 = (streamBody, context) => collectBody2(streamBody, context).then((body) => context.utf8Encoder(body));
var isSerializableHeaderValue = (value) => value !== void 0 && value !== null && value !== "" && (!Object.getOwnPropertyNames(value).includes("length") || value.length != 0) && (!Object.getOwnPropertyNames(value).includes("size") || value.size != 0);
var parseBody2 = (streamBody, context) => collectBodyString3(streamBody, context).then((encoded) => {
  if (encoded.length) {
    return JSON.parse(encoded);
  }
  return {};
});
var parseErrorBody2 = async (errorBody, context) => {
  const value = await parseBody2(errorBody, context);
  value.message = value.message ?? value.Message;
  return value;
};
var loadRestJsonErrorCode = (output, data) => {
  const findKey = (object, key) => Object.keys(object).find((k5) => k5.toLowerCase() === key.toLowerCase());
  const sanitizeErrorCode = (rawValue) => {
    let cleanValue = rawValue;
    if (typeof cleanValue === "number") {
      cleanValue = cleanValue.toString();
    }
    if (cleanValue.indexOf(",") >= 0) {
      cleanValue = cleanValue.split(",")[0];
    }
    if (cleanValue.indexOf(":") >= 0) {
      cleanValue = cleanValue.split(":")[0];
    }
    if (cleanValue.indexOf("#") >= 0) {
      cleanValue = cleanValue.split("#")[1];
    }
    return cleanValue;
  };
  const headerKey = findKey(output.headers, "x-amzn-errortype");
  if (headerKey !== void 0) {
    return sanitizeErrorCode(output.headers[headerKey]);
  }
  if (data.code !== void 0) {
    return sanitizeErrorCode(data.code);
  }
  if (data["__type"] !== void 0) {
    return sanitizeErrorCode(data["__type"]);
  }
};
var GetRoleCredentialsCommand = class _GetRoleCredentialsCommand extends Command {
  static getEndpointParameterInstructions() {
    return {
      UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
      Endpoint: { type: "builtInParams", name: "endpoint" },
      Region: { type: "builtInParams", name: "region" },
      UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" }
    };
  }
  constructor(input) {
    super();
    this.input = input;
  }
  resolveMiddleware(clientStack, configuration, options) {
    this.middlewareStack.use(getSerdePlugin(configuration, this.serialize, this.deserialize));
    this.middlewareStack.use(getEndpointPlugin(configuration, _GetRoleCredentialsCommand.getEndpointParameterInstructions()));
    const stack = clientStack.concat(this.middlewareStack);
    const { logger: logger2 } = configuration;
    const clientName = "SSOClient";
    const commandName = "GetRoleCredentialsCommand";
    const handlerExecutionContext = {
      logger: logger2,
      clientName,
      commandName,
      inputFilterSensitiveLog: GetRoleCredentialsRequestFilterSensitiveLog,
      outputFilterSensitiveLog: GetRoleCredentialsResponseFilterSensitiveLog
    };
    const { requestHandler } = configuration;
    return stack.resolve((request2) => requestHandler.handle(request2.request, options || {}), handlerExecutionContext);
  }
  serialize(input, context) {
    return se_GetRoleCredentialsCommand(input, context);
  }
  deserialize(output, context) {
    return de_GetRoleCredentialsCommand(output, context);
  }
};
var EXPIRE_WINDOW_MS = 5 * 60 * 1e3;
var REFRESH_MESSAGE = `To refresh this SSO session run 'aws sso login' with the corresponding profile.`;
var resolveClientEndpointParameters4 = (options) => {
  return {
    ...options,
    useDualstackEndpoint: options.useDualstackEndpoint ?? false,
    useFipsEndpoint: options.useFipsEndpoint ?? false,
    defaultSigningName: "awsssooidc"
  };
};
var package_default4 = {
  name: "@aws-sdk/client-sso-oidc",
  description: "AWS SDK for JavaScript Sso Oidc Client for Node.js, Browser and React Native",
  version: "3.362.0",
  scripts: {
    build: "concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
    "build:cjs": "tsc -p tsconfig.cjs.json",
    "build:docs": "typedoc",
    "build:es": "tsc -p tsconfig.es.json",
    "build:include:deps": "lerna run --scope $npm_package_name --include-dependencies build",
    "build:types": "tsc -p tsconfig.types.json",
    "build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
    clean: "rimraf ./dist-* && rimraf *.tsbuildinfo",
    "extract:docs": "api-extractor run --local",
    "generate:client": "node ../../scripts/generate-clients/single-service --solo sso-oidc"
  },
  main: "./dist-cjs/index.js",
  types: "./dist-types/index.d.ts",
  module: "./dist-es/index.js",
  sideEffects: false,
  dependencies: {
    "@aws-crypto/sha256-browser": "3.0.0",
    "@aws-crypto/sha256-js": "3.0.0",
    "@aws-sdk/config-resolver": "3.357.0",
    "@aws-sdk/fetch-http-handler": "3.357.0",
    "@aws-sdk/hash-node": "3.357.0",
    "@aws-sdk/invalid-dependency": "3.357.0",
    "@aws-sdk/middleware-content-length": "3.357.0",
    "@aws-sdk/middleware-endpoint": "3.357.0",
    "@aws-sdk/middleware-host-header": "3.357.0",
    "@aws-sdk/middleware-logger": "3.357.0",
    "@aws-sdk/middleware-recursion-detection": "3.357.0",
    "@aws-sdk/middleware-retry": "3.362.0",
    "@aws-sdk/middleware-serde": "3.357.0",
    "@aws-sdk/middleware-stack": "3.357.0",
    "@aws-sdk/middleware-user-agent": "3.357.0",
    "@aws-sdk/node-config-provider": "3.357.0",
    "@aws-sdk/node-http-handler": "3.360.0",
    "@aws-sdk/smithy-client": "3.360.0",
    "@aws-sdk/types": "3.357.0",
    "@aws-sdk/url-parser": "3.357.0",
    "@aws-sdk/util-base64": "3.310.0",
    "@aws-sdk/util-body-length-browser": "3.310.0",
    "@aws-sdk/util-body-length-node": "3.310.0",
    "@aws-sdk/util-defaults-mode-browser": "3.360.0",
    "@aws-sdk/util-defaults-mode-node": "3.360.0",
    "@aws-sdk/util-endpoints": "3.357.0",
    "@aws-sdk/util-retry": "3.362.0",
    "@aws-sdk/util-user-agent-browser": "3.357.0",
    "@aws-sdk/util-user-agent-node": "3.357.0",
    "@aws-sdk/util-utf8": "3.310.0",
    "@smithy/protocol-http": "^1.0.1",
    "@smithy/types": "^1.0.0",
    tslib: "^2.5.0"
  },
  devDependencies: {
    "@aws-sdk/service-client-documentation-generator": "3.310.0",
    "@tsconfig/node14": "1.0.3",
    "@types/node": "^14.14.31",
    concurrently: "7.0.0",
    "downlevel-dts": "0.10.1",
    rimraf: "3.0.2",
    typedoc: "0.23.23",
    typescript: "~4.9.5"
  },
  engines: {
    node: ">=14.0.0"
  },
  typesVersions: {
    "<4.0": {
      "dist-types/*": [
        "dist-types/ts3.4/*"
      ]
    }
  },
  files: [
    "dist-*/**"
  ],
  author: {
    name: "AWS SDK for JavaScript Team",
    url: "https://aws.amazon.com/javascript/"
  },
  license: "Apache-2.0",
  browser: {
    "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.browser"
  },
  "react-native": {
    "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.native"
  },
  homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-sso-oidc",
  repository: {
    type: "git",
    url: "https://github.com/aws/aws-sdk-js-v3.git",
    directory: "clients/client-sso-oidc"
  }
};
var p2 = "required";
var q2 = "fn";
var r2 = "argv";
var s2 = "ref";
var a2 = "PartitionResult";
var b2 = "tree";
var c2 = "error";
var d2 = "endpoint";
var e2 = { [p2]: false, "type": "String" };
var f2 = { [p2]: true, "default": false, "type": "Boolean" };
var g2 = { [s2]: "Endpoint" };
var h2 = { [q2]: "booleanEquals", [r2]: [{ [s2]: "UseFIPS" }, true] };
var i2 = { [q2]: "booleanEquals", [r2]: [{ [s2]: "UseDualStack" }, true] };
var j2 = {};
var k2 = { [q2]: "booleanEquals", [r2]: [true, { [q2]: "getAttr", [r2]: [{ [s2]: a2 }, "supportsFIPS"] }] };
var l2 = { [q2]: "booleanEquals", [r2]: [true, { [q2]: "getAttr", [r2]: [{ [s2]: a2 }, "supportsDualStack"] }] };
var m2 = [g2];
var n2 = [h2];
var o2 = [i2];
var _data2 = { version: "1.0", parameters: { Region: e2, UseDualStack: f2, UseFIPS: f2, Endpoint: e2 }, rules: [{ conditions: [{ [q2]: "aws.partition", [r2]: [{ [s2]: "Region" }], assign: a2 }], type: b2, rules: [{ conditions: [{ [q2]: "isSet", [r2]: m2 }, { [q2]: "parseURL", [r2]: m2, assign: "url" }], type: b2, rules: [{ conditions: n2, error: "Invalid Configuration: FIPS and custom endpoint are not supported", type: c2 }, { type: b2, rules: [{ conditions: o2, error: "Invalid Configuration: Dualstack and custom endpoint are not supported", type: c2 }, { endpoint: { url: g2, properties: j2, headers: j2 }, type: d2 }] }] }, { conditions: [h2, i2], type: b2, rules: [{ conditions: [k2, l2], type: b2, rules: [{ endpoint: { url: "https://oidc-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: j2, headers: j2 }, type: d2 }] }, { error: "FIPS and DualStack are enabled, but this partition does not support one or both", type: c2 }] }, { conditions: n2, type: b2, rules: [{ conditions: [k2], type: b2, rules: [{ type: b2, rules: [{ endpoint: { url: "https://oidc-fips.{Region}.{PartitionResult#dnsSuffix}", properties: j2, headers: j2 }, type: d2 }] }] }, { error: "FIPS is enabled but this partition does not support FIPS", type: c2 }] }, { conditions: o2, type: b2, rules: [{ conditions: [l2], type: b2, rules: [{ endpoint: { url: "https://oidc.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: j2, headers: j2 }, type: d2 }] }, { error: "DualStack is enabled but this partition does not support DualStack", type: c2 }] }, { endpoint: { url: "https://oidc.{Region}.{PartitionResult#dnsSuffix}", properties: j2, headers: j2 }, type: d2 }] }] };
var ruleSet2 = _data2;
var defaultEndpointResolver2 = (endpointParams, context = {}) => {
  return resolveEndpoint(ruleSet2, {
    endpointParams,
    logger: context.logger
  });
};
var getRuntimeConfig3 = (config) => ({
  apiVersion: "2019-06-10",
  base64Decoder: (config == null ? void 0 : config.base64Decoder) ?? fromBase64,
  base64Encoder: (config == null ? void 0 : config.base64Encoder) ?? toBase64,
  disableHostPrefix: (config == null ? void 0 : config.disableHostPrefix) ?? false,
  endpointProvider: (config == null ? void 0 : config.endpointProvider) ?? defaultEndpointResolver2,
  logger: (config == null ? void 0 : config.logger) ?? new NoOpLogger(),
  serviceId: (config == null ? void 0 : config.serviceId) ?? "SSO OIDC",
  urlParser: (config == null ? void 0 : config.urlParser) ?? parseUrl,
  utf8Decoder: (config == null ? void 0 : config.utf8Decoder) ?? fromUtf84,
  utf8Encoder: (config == null ? void 0 : config.utf8Encoder) ?? toUtf84
});
var getRuntimeConfig4 = (config) => {
  emitWarningIfUnsupportedVersion(process.version);
  const defaultsMode = resolveDefaultsModeConfig(config);
  const defaultConfigProvider = () => defaultsMode().then(loadConfigsForDefaultMode);
  const clientSharedValues = getRuntimeConfig3(config);
  return {
    ...clientSharedValues,
    ...config,
    runtime: "node",
    defaultsMode,
    bodyLengthChecker: (config == null ? void 0 : config.bodyLengthChecker) ?? calculateBodyLength,
    defaultUserAgentProvider: (config == null ? void 0 : config.defaultUserAgentProvider) ?? defaultUserAgent({ serviceId: clientSharedValues.serviceId, clientVersion: package_default4.version }),
    maxAttempts: (config == null ? void 0 : config.maxAttempts) ?? loadConfig(NODE_MAX_ATTEMPT_CONFIG_OPTIONS),
    region: (config == null ? void 0 : config.region) ?? loadConfig(NODE_REGION_CONFIG_OPTIONS, NODE_REGION_CONFIG_FILE_OPTIONS),
    requestHandler: (config == null ? void 0 : config.requestHandler) ?? new NodeHttpHandler(defaultConfigProvider),
    retryMode: (config == null ? void 0 : config.retryMode) ?? loadConfig({
      ...NODE_RETRY_MODE_CONFIG_OPTIONS,
      default: async () => (await defaultConfigProvider()).retryMode || DEFAULT_RETRY_MODE
    }),
    sha256: (config == null ? void 0 : config.sha256) ?? Hash.bind(null, "sha256"),
    streamCollector: (config == null ? void 0 : config.streamCollector) ?? streamCollector,
    useDualstackEndpoint: (config == null ? void 0 : config.useDualstackEndpoint) ?? loadConfig(NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS),
    useFipsEndpoint: (config == null ? void 0 : config.useFipsEndpoint) ?? loadConfig(NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS)
  };
};
var SSOOIDCClient = class extends Client {
  constructor(configuration) {
    const _config_0 = getRuntimeConfig4(configuration);
    const _config_1 = resolveClientEndpointParameters4(_config_0);
    const _config_2 = resolveRegionConfig(_config_1);
    const _config_3 = resolveEndpointConfig(_config_2);
    const _config_4 = resolveRetryConfig(_config_3);
    const _config_5 = resolveHostHeaderConfig(_config_4);
    const _config_6 = resolveUserAgentConfig(_config_5);
    super(_config_6);
    this.config = _config_6;
    this.middlewareStack.use(getRetryPlugin(this.config));
    this.middlewareStack.use(getContentLengthPlugin(this.config));
    this.middlewareStack.use(getHostHeaderPlugin(this.config));
    this.middlewareStack.use(getLoggerPlugin(this.config));
    this.middlewareStack.use(getRecursionDetectionPlugin(this.config));
    this.middlewareStack.use(getUserAgentPlugin(this.config));
  }
  destroy() {
    super.destroy();
  }
};
var SSOOIDCServiceException = class _SSOOIDCServiceException extends ServiceException {
  constructor(options) {
    super(options);
    Object.setPrototypeOf(this, _SSOOIDCServiceException.prototype);
  }
};
var AccessDeniedException = class _AccessDeniedException extends SSOOIDCServiceException {
  constructor(opts) {
    super({
      name: "AccessDeniedException",
      $fault: "client",
      ...opts
    });
    this.name = "AccessDeniedException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _AccessDeniedException.prototype);
    this.error = opts.error;
    this.error_description = opts.error_description;
  }
};
var AuthorizationPendingException = class _AuthorizationPendingException extends SSOOIDCServiceException {
  constructor(opts) {
    super({
      name: "AuthorizationPendingException",
      $fault: "client",
      ...opts
    });
    this.name = "AuthorizationPendingException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _AuthorizationPendingException.prototype);
    this.error = opts.error;
    this.error_description = opts.error_description;
  }
};
var ExpiredTokenException2 = class _ExpiredTokenException2 extends SSOOIDCServiceException {
  constructor(opts) {
    super({
      name: "ExpiredTokenException",
      $fault: "client",
      ...opts
    });
    this.name = "ExpiredTokenException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _ExpiredTokenException2.prototype);
    this.error = opts.error;
    this.error_description = opts.error_description;
  }
};
var InternalServerException = class _InternalServerException extends SSOOIDCServiceException {
  constructor(opts) {
    super({
      name: "InternalServerException",
      $fault: "server",
      ...opts
    });
    this.name = "InternalServerException";
    this.$fault = "server";
    Object.setPrototypeOf(this, _InternalServerException.prototype);
    this.error = opts.error;
    this.error_description = opts.error_description;
  }
};
var InvalidClientException = class _InvalidClientException extends SSOOIDCServiceException {
  constructor(opts) {
    super({
      name: "InvalidClientException",
      $fault: "client",
      ...opts
    });
    this.name = "InvalidClientException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _InvalidClientException.prototype);
    this.error = opts.error;
    this.error_description = opts.error_description;
  }
};
var InvalidGrantException = class _InvalidGrantException extends SSOOIDCServiceException {
  constructor(opts) {
    super({
      name: "InvalidGrantException",
      $fault: "client",
      ...opts
    });
    this.name = "InvalidGrantException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _InvalidGrantException.prototype);
    this.error = opts.error;
    this.error_description = opts.error_description;
  }
};
var InvalidRequestException2 = class _InvalidRequestException2 extends SSOOIDCServiceException {
  constructor(opts) {
    super({
      name: "InvalidRequestException",
      $fault: "client",
      ...opts
    });
    this.name = "InvalidRequestException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _InvalidRequestException2.prototype);
    this.error = opts.error;
    this.error_description = opts.error_description;
  }
};
var InvalidScopeException = class _InvalidScopeException extends SSOOIDCServiceException {
  constructor(opts) {
    super({
      name: "InvalidScopeException",
      $fault: "client",
      ...opts
    });
    this.name = "InvalidScopeException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _InvalidScopeException.prototype);
    this.error = opts.error;
    this.error_description = opts.error_description;
  }
};
var SlowDownException = class _SlowDownException extends SSOOIDCServiceException {
  constructor(opts) {
    super({
      name: "SlowDownException",
      $fault: "client",
      ...opts
    });
    this.name = "SlowDownException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _SlowDownException.prototype);
    this.error = opts.error;
    this.error_description = opts.error_description;
  }
};
var UnauthorizedClientException = class _UnauthorizedClientException extends SSOOIDCServiceException {
  constructor(opts) {
    super({
      name: "UnauthorizedClientException",
      $fault: "client",
      ...opts
    });
    this.name = "UnauthorizedClientException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _UnauthorizedClientException.prototype);
    this.error = opts.error;
    this.error_description = opts.error_description;
  }
};
var UnsupportedGrantTypeException = class _UnsupportedGrantTypeException extends SSOOIDCServiceException {
  constructor(opts) {
    super({
      name: "UnsupportedGrantTypeException",
      $fault: "client",
      ...opts
    });
    this.name = "UnsupportedGrantTypeException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _UnsupportedGrantTypeException.prototype);
    this.error = opts.error;
    this.error_description = opts.error_description;
  }
};
var se_CreateTokenCommand = async (input, context) => {
  const { hostname, protocol = "https", port, path: basePath } = await context.endpoint();
  const headers = {
    "content-type": "application/json"
  };
  const resolvedPath2 = `${(basePath == null ? void 0 : basePath.endsWith("/")) ? basePath.slice(0, -1) : basePath || ""}/token`;
  let body;
  body = JSON.stringify(take(input, {
    clientId: [],
    clientSecret: [],
    code: [],
    deviceCode: [],
    grantType: [],
    redirectUri: [],
    refreshToken: [],
    scope: (_) => _json(_)
  }));
  return new HttpRequest2({
    protocol,
    hostname,
    port,
    method: "POST",
    headers,
    path: resolvedPath2,
    body
  });
};
var de_CreateTokenCommand = async (output, context) => {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CreateTokenCommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata4(output)
  });
  const data = expectNonNull(expectObject(await parseBody3(output.body, context)), "body");
  const doc = take(data, {
    accessToken: expectString,
    expiresIn: expectInt32,
    idToken: expectString,
    refreshToken: expectString,
    tokenType: expectString
  });
  Object.assign(contents, doc);
  return contents;
};
var de_CreateTokenCommandError = async (output, context) => {
  const parsedOutput = {
    ...output,
    body: await parseErrorBody3(output.body, context)
  };
  const errorCode = loadRestJsonErrorCode2(output, parsedOutput.body);
  switch (errorCode) {
    case "AccessDeniedException":
    case "com.amazonaws.ssooidc#AccessDeniedException":
      throw await de_AccessDeniedExceptionRes(parsedOutput);
    case "AuthorizationPendingException":
    case "com.amazonaws.ssooidc#AuthorizationPendingException":
      throw await de_AuthorizationPendingExceptionRes(parsedOutput);
    case "ExpiredTokenException":
    case "com.amazonaws.ssooidc#ExpiredTokenException":
      throw await de_ExpiredTokenExceptionRes2(parsedOutput);
    case "InternalServerException":
    case "com.amazonaws.ssooidc#InternalServerException":
      throw await de_InternalServerExceptionRes(parsedOutput);
    case "InvalidClientException":
    case "com.amazonaws.ssooidc#InvalidClientException":
      throw await de_InvalidClientExceptionRes(parsedOutput);
    case "InvalidGrantException":
    case "com.amazonaws.ssooidc#InvalidGrantException":
      throw await de_InvalidGrantExceptionRes(parsedOutput);
    case "InvalidRequestException":
    case "com.amazonaws.ssooidc#InvalidRequestException":
      throw await de_InvalidRequestExceptionRes2(parsedOutput);
    case "InvalidScopeException":
    case "com.amazonaws.ssooidc#InvalidScopeException":
      throw await de_InvalidScopeExceptionRes(parsedOutput);
    case "SlowDownException":
    case "com.amazonaws.ssooidc#SlowDownException":
      throw await de_SlowDownExceptionRes(parsedOutput);
    case "UnauthorizedClientException":
    case "com.amazonaws.ssooidc#UnauthorizedClientException":
      throw await de_UnauthorizedClientExceptionRes(parsedOutput);
    case "UnsupportedGrantTypeException":
    case "com.amazonaws.ssooidc#UnsupportedGrantTypeException":
      throw await de_UnsupportedGrantTypeExceptionRes(parsedOutput);
    default:
      const parsedBody = parsedOutput.body;
      return throwDefaultError4({
        output,
        parsedBody,
        errorCode
      });
  }
};
var throwDefaultError4 = withBaseException(SSOOIDCServiceException);
var de_AccessDeniedExceptionRes = async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    error: expectString,
    error_description: expectString
  });
  Object.assign(contents, doc);
  const exception = new AccessDeniedException({
    $metadata: deserializeMetadata4(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
};
var de_AuthorizationPendingExceptionRes = async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    error: expectString,
    error_description: expectString
  });
  Object.assign(contents, doc);
  const exception = new AuthorizationPendingException({
    $metadata: deserializeMetadata4(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
};
var de_ExpiredTokenExceptionRes2 = async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    error: expectString,
    error_description: expectString
  });
  Object.assign(contents, doc);
  const exception = new ExpiredTokenException2({
    $metadata: deserializeMetadata4(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
};
var de_InternalServerExceptionRes = async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    error: expectString,
    error_description: expectString
  });
  Object.assign(contents, doc);
  const exception = new InternalServerException({
    $metadata: deserializeMetadata4(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
};
var de_InvalidClientExceptionRes = async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    error: expectString,
    error_description: expectString
  });
  Object.assign(contents, doc);
  const exception = new InvalidClientException({
    $metadata: deserializeMetadata4(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
};
var de_InvalidGrantExceptionRes = async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    error: expectString,
    error_description: expectString
  });
  Object.assign(contents, doc);
  const exception = new InvalidGrantException({
    $metadata: deserializeMetadata4(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
};
var de_InvalidRequestExceptionRes2 = async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    error: expectString,
    error_description: expectString
  });
  Object.assign(contents, doc);
  const exception = new InvalidRequestException2({
    $metadata: deserializeMetadata4(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
};
var de_InvalidScopeExceptionRes = async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    error: expectString,
    error_description: expectString
  });
  Object.assign(contents, doc);
  const exception = new InvalidScopeException({
    $metadata: deserializeMetadata4(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
};
var de_SlowDownExceptionRes = async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    error: expectString,
    error_description: expectString
  });
  Object.assign(contents, doc);
  const exception = new SlowDownException({
    $metadata: deserializeMetadata4(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
};
var de_UnauthorizedClientExceptionRes = async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    error: expectString,
    error_description: expectString
  });
  Object.assign(contents, doc);
  const exception = new UnauthorizedClientException({
    $metadata: deserializeMetadata4(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
};
var de_UnsupportedGrantTypeExceptionRes = async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    error: expectString,
    error_description: expectString
  });
  Object.assign(contents, doc);
  const exception = new UnsupportedGrantTypeException({
    $metadata: deserializeMetadata4(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
};
var deserializeMetadata4 = (output) => ({
  httpStatusCode: output.statusCode,
  requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
  extendedRequestId: output.headers["x-amz-id-2"],
  cfId: output.headers["x-amz-cf-id"]
});
var collectBodyString4 = (streamBody, context) => collectBody2(streamBody, context).then((body) => context.utf8Encoder(body));
var parseBody3 = (streamBody, context) => collectBodyString4(streamBody, context).then((encoded) => {
  if (encoded.length) {
    return JSON.parse(encoded);
  }
  return {};
});
var parseErrorBody3 = async (errorBody, context) => {
  const value = await parseBody3(errorBody, context);
  value.message = value.message ?? value.Message;
  return value;
};
var loadRestJsonErrorCode2 = (output, data) => {
  const findKey = (object, key) => Object.keys(object).find((k5) => k5.toLowerCase() === key.toLowerCase());
  const sanitizeErrorCode = (rawValue) => {
    let cleanValue = rawValue;
    if (typeof cleanValue === "number") {
      cleanValue = cleanValue.toString();
    }
    if (cleanValue.indexOf(",") >= 0) {
      cleanValue = cleanValue.split(",")[0];
    }
    if (cleanValue.indexOf(":") >= 0) {
      cleanValue = cleanValue.split(":")[0];
    }
    if (cleanValue.indexOf("#") >= 0) {
      cleanValue = cleanValue.split("#")[1];
    }
    return cleanValue;
  };
  const headerKey = findKey(output.headers, "x-amzn-errortype");
  if (headerKey !== void 0) {
    return sanitizeErrorCode(output.headers[headerKey]);
  }
  if (data.code !== void 0) {
    return sanitizeErrorCode(data.code);
  }
  if (data["__type"] !== void 0) {
    return sanitizeErrorCode(data["__type"]);
  }
};
var CreateTokenCommand = class _CreateTokenCommand extends Command {
  static getEndpointParameterInstructions() {
    return {
      UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
      Endpoint: { type: "builtInParams", name: "endpoint" },
      Region: { type: "builtInParams", name: "region" },
      UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" }
    };
  }
  constructor(input) {
    super();
    this.input = input;
  }
  resolveMiddleware(clientStack, configuration, options) {
    this.middlewareStack.use(getSerdePlugin(configuration, this.serialize, this.deserialize));
    this.middlewareStack.use(getEndpointPlugin(configuration, _CreateTokenCommand.getEndpointParameterInstructions()));
    const stack = clientStack.concat(this.middlewareStack);
    const { logger: logger2 } = configuration;
    const clientName = "SSOOIDCClient";
    const commandName = "CreateTokenCommand";
    const handlerExecutionContext = {
      logger: logger2,
      clientName,
      commandName,
      inputFilterSensitiveLog: (_) => _,
      outputFilterSensitiveLog: (_) => _
    };
    const { requestHandler } = configuration;
    return stack.resolve((request2) => requestHandler.handle(request2.request, options || {}), handlerExecutionContext);
  }
  serialize(input, context) {
    return se_CreateTokenCommand(input, context);
  }
  deserialize(output, context) {
    return de_CreateTokenCommand(output, context);
  }
};
var ssoOidcClientsHash = {};
var getSsoOidcClient = (ssoRegion) => {
  if (ssoOidcClientsHash[ssoRegion]) {
    return ssoOidcClientsHash[ssoRegion];
  }
  const ssoOidcClient = new SSOOIDCClient({ region: ssoRegion });
  ssoOidcClientsHash[ssoRegion] = ssoOidcClient;
  return ssoOidcClient;
};
var getNewSsoOidcToken = (ssoToken, ssoRegion) => {
  const ssoOidcClient = getSsoOidcClient(ssoRegion);
  return ssoOidcClient.send(new CreateTokenCommand({
    clientId: ssoToken.clientId,
    clientSecret: ssoToken.clientSecret,
    refreshToken: ssoToken.refreshToken,
    grantType: "refresh_token"
  }));
};
var validateTokenExpiry = (token) => {
  if (token.expiration && token.expiration.getTime() < Date.now()) {
    throw new TokenProviderError(`Token is expired. ${REFRESH_MESSAGE}`, false);
  }
};
var validateTokenKey = (key, value, forRefresh = false) => {
  if (typeof value === "undefined") {
    throw new TokenProviderError(`Value not present for '${key}' in SSO Token${forRefresh ? ". Cannot refresh" : ""}. ${REFRESH_MESSAGE}`, false);
  }
};
var { writeFile } = promises;
var writeSSOTokenToFile = (id, ssoToken) => {
  const tokenFilepath = getSSOTokenFilepath(id);
  const tokenString = JSON.stringify(ssoToken, null, 2);
  return writeFile(tokenFilepath, tokenString);
};
var lastRefreshAttemptTime = /* @__PURE__ */ new Date(0);
var fromSso = (init = {}) => async () => {
  const profiles = await parseKnownFiles(init);
  const profileName = getProfileName(init);
  const profile = profiles[profileName];
  if (!profile) {
    throw new TokenProviderError(`Profile '${profileName}' could not be found in shared credentials file.`, false);
  } else if (!profile["sso_session"]) {
    throw new TokenProviderError(`Profile '${profileName}' is missing required property 'sso_session'.`);
  }
  const ssoSessionName = profile["sso_session"];
  const ssoSessions = await loadSsoSessionData(init);
  const ssoSession = ssoSessions[ssoSessionName];
  if (!ssoSession) {
    throw new TokenProviderError(`Sso session '${ssoSessionName}' could not be found in shared credentials file.`, false);
  }
  for (const ssoSessionRequiredKey of ["sso_start_url", "sso_region"]) {
    if (!ssoSession[ssoSessionRequiredKey]) {
      throw new TokenProviderError(`Sso session '${ssoSessionName}' is missing required property '${ssoSessionRequiredKey}'.`, false);
    }
  }
  ssoSession["sso_start_url"];
  const ssoRegion = ssoSession["sso_region"];
  let ssoToken;
  try {
    ssoToken = await getSSOTokenFromFile(ssoSessionName);
  } catch (e5) {
    throw new TokenProviderError(`The SSO session token associated with profile=${profileName} was not found or is invalid. ${REFRESH_MESSAGE}`, false);
  }
  validateTokenKey("accessToken", ssoToken.accessToken);
  validateTokenKey("expiresAt", ssoToken.expiresAt);
  const { accessToken, expiresAt } = ssoToken;
  const existingToken = { token: accessToken, expiration: new Date(expiresAt) };
  if (existingToken.expiration.getTime() - Date.now() > EXPIRE_WINDOW_MS) {
    return existingToken;
  }
  if (Date.now() - lastRefreshAttemptTime.getTime() < 30 * 1e3) {
    validateTokenExpiry(existingToken);
    return existingToken;
  }
  validateTokenKey("clientId", ssoToken.clientId, true);
  validateTokenKey("clientSecret", ssoToken.clientSecret, true);
  validateTokenKey("refreshToken", ssoToken.refreshToken, true);
  try {
    lastRefreshAttemptTime.setTime(Date.now());
    const newSsoOidcToken = await getNewSsoOidcToken(ssoToken, ssoRegion);
    validateTokenKey("accessToken", newSsoOidcToken.accessToken);
    validateTokenKey("expiresIn", newSsoOidcToken.expiresIn);
    const newTokenExpiration = new Date(Date.now() + newSsoOidcToken.expiresIn * 1e3);
    try {
      await writeSSOTokenToFile(ssoSessionName, {
        ...ssoToken,
        accessToken: newSsoOidcToken.accessToken,
        expiresAt: newTokenExpiration.toISOString(),
        refreshToken: newSsoOidcToken.refreshToken
      });
    } catch (error) {
    }
    return {
      token: newSsoOidcToken.accessToken,
      expiration: newTokenExpiration
    };
  } catch (error) {
    validateTokenExpiry(existingToken);
    return existingToken;
  }
};
var EXPIRE_WINDOW_MS2 = 15 * 60 * 1e3;
var SHOULD_FAIL_CREDENTIAL_CHAIN = false;
var resolveSSOCredentials = async ({ ssoStartUrl, ssoSession, ssoAccountId, ssoRegion, ssoRoleName, ssoClient, profile }) => {
  let token;
  const refreshMessage = `To refresh this SSO session run aws sso login with the corresponding profile.`;
  if (ssoSession) {
    try {
      const _token = await fromSso({ profile })();
      token = {
        accessToken: _token.token,
        expiresAt: new Date(_token.expiration).toISOString()
      };
    } catch (e5) {
      throw new CredentialsProviderError(e5.message, SHOULD_FAIL_CREDENTIAL_CHAIN);
    }
  } else {
    try {
      token = await getSSOTokenFromFile(ssoStartUrl);
    } catch (e5) {
      throw new CredentialsProviderError(`The SSO session associated with this profile is invalid. ${refreshMessage}`, SHOULD_FAIL_CREDENTIAL_CHAIN);
    }
  }
  if (new Date(token.expiresAt).getTime() - Date.now() <= EXPIRE_WINDOW_MS2) {
    throw new CredentialsProviderError(`The SSO session associated with this profile has expired. ${refreshMessage}`, SHOULD_FAIL_CREDENTIAL_CHAIN);
  }
  const { accessToken } = token;
  const sso = ssoClient || new SSOClient({ region: ssoRegion });
  let ssoResp;
  try {
    ssoResp = await sso.send(new GetRoleCredentialsCommand({
      accountId: ssoAccountId,
      roleName: ssoRoleName,
      accessToken
    }));
  } catch (e5) {
    throw CredentialsProviderError.from(e5, SHOULD_FAIL_CREDENTIAL_CHAIN);
  }
  const { roleCredentials: { accessKeyId, secretAccessKey, sessionToken, expiration } = {} } = ssoResp;
  if (!accessKeyId || !secretAccessKey || !sessionToken || !expiration) {
    throw new CredentialsProviderError("SSO returns an invalid temporary credential.", SHOULD_FAIL_CREDENTIAL_CHAIN);
  }
  return { accessKeyId, secretAccessKey, sessionToken, expiration: new Date(expiration) };
};
var validateSsoProfile = (profile) => {
  const { sso_start_url, sso_account_id, sso_region, sso_role_name } = profile;
  if (!sso_start_url || !sso_account_id || !sso_region || !sso_role_name) {
    throw new CredentialsProviderError(`Profile is configured with invalid SSO credentials. Required parameters "sso_account_id", "sso_region", "sso_role_name", "sso_start_url". Got ${Object.keys(profile).join(", ")}
Reference: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html`, false);
  }
  return profile;
};
var fromSSO = (init = {}) => async () => {
  const { ssoStartUrl, ssoAccountId, ssoRegion, ssoRoleName, ssoClient, ssoSession } = init;
  const profileName = getProfileName(init);
  if (!ssoStartUrl && !ssoAccountId && !ssoRegion && !ssoRoleName && !ssoSession) {
    const profiles = await parseKnownFiles(init);
    const profile = profiles[profileName];
    if (!profile) {
      throw new CredentialsProviderError(`Profile ${profileName} was not found.`);
    }
    if (!isSsoProfile(profile)) {
      throw new CredentialsProviderError(`Profile ${profileName} is not configured with SSO credentials.`);
    }
    if (profile == null ? void 0 : profile.sso_session) {
      const ssoSessions = await loadSsoSessionData(init);
      const session = ssoSessions[profile.sso_session];
      const conflictMsg = ` configurations in profile ${profileName} and sso-session ${profile.sso_session}`;
      if (ssoRegion && ssoRegion !== session.sso_region) {
        throw new CredentialsProviderError(`Conflicting SSO region` + conflictMsg, false);
      }
      if (ssoStartUrl && ssoStartUrl !== session.sso_start_url) {
        throw new CredentialsProviderError(`Conflicting SSO start_url` + conflictMsg, false);
      }
      profile.sso_region = session.sso_region;
      profile.sso_start_url = session.sso_start_url;
    }
    const { sso_start_url, sso_account_id, sso_region, sso_role_name, sso_session } = validateSsoProfile(profile);
    return resolveSSOCredentials({
      ssoStartUrl: sso_start_url,
      ssoSession: sso_session,
      ssoAccountId: sso_account_id,
      ssoRegion: sso_region,
      ssoRoleName: sso_role_name,
      ssoClient,
      profile: profileName
    });
  } else if (!ssoStartUrl || !ssoAccountId || !ssoRegion || !ssoRoleName) {
    throw new CredentialsProviderError('Incomplete configuration. The fromSSO() argument hash must include "ssoStartUrl", "ssoAccountId", "ssoRegion", "ssoRoleName"');
  } else {
    return resolveSSOCredentials({
      ssoStartUrl,
      ssoSession,
      ssoAccountId,
      ssoRegion,
      ssoRoleName,
      ssoClient,
      profile: profileName
    });
  }
};
var resolveSsoCredentials = (data) => {
  const { sso_start_url, sso_account_id, sso_session, sso_region, sso_role_name } = validateSsoProfile(data);
  return fromSSO({
    ssoStartUrl: sso_start_url,
    ssoAccountId: sso_account_id,
    ssoSession: sso_session,
    ssoRegion: sso_region,
    ssoRoleName: sso_role_name
  })();
};
var isStaticCredsProfile = (arg) => Boolean(arg) && typeof arg === "object" && typeof arg.aws_access_key_id === "string" && typeof arg.aws_secret_access_key === "string" && ["undefined", "string"].indexOf(typeof arg.aws_session_token) > -1;
var resolveStaticCredentials = (profile) => Promise.resolve({
  accessKeyId: profile.aws_access_key_id,
  secretAccessKey: profile.aws_secret_access_key,
  sessionToken: profile.aws_session_token
});
var fromWebToken = (init) => () => {
  const { roleArn, roleSessionName, webIdentityToken, providerId, policyArns, policy, durationSeconds, roleAssumerWithWebIdentity } = init;
  if (!roleAssumerWithWebIdentity) {
    throw new CredentialsProviderError(`Role Arn '${roleArn}' needs to be assumed with web identity, but no role assumption callback was provided.`, false);
  }
  return roleAssumerWithWebIdentity({
    RoleArn: roleArn,
    RoleSessionName: roleSessionName ?? `aws-sdk-js-session-${Date.now()}`,
    WebIdentityToken: webIdentityToken,
    ProviderId: providerId,
    PolicyArns: policyArns,
    Policy: policy,
    DurationSeconds: durationSeconds
  });
};
var ENV_TOKEN_FILE = "AWS_WEB_IDENTITY_TOKEN_FILE";
var ENV_ROLE_ARN = "AWS_ROLE_ARN";
var ENV_ROLE_SESSION_NAME = "AWS_ROLE_SESSION_NAME";
var fromTokenFile = (init = {}) => async () => {
  const webIdentityTokenFile = (init == null ? void 0 : init.webIdentityTokenFile) ?? process.env[ENV_TOKEN_FILE];
  const roleArn = (init == null ? void 0 : init.roleArn) ?? process.env[ENV_ROLE_ARN];
  const roleSessionName = (init == null ? void 0 : init.roleSessionName) ?? process.env[ENV_ROLE_SESSION_NAME];
  if (!webIdentityTokenFile || !roleArn) {
    throw new CredentialsProviderError("Web identity configuration not specified");
  }
  return fromWebToken({
    ...init,
    webIdentityToken: readFileSync(webIdentityTokenFile, { encoding: "ascii" }),
    roleArn,
    roleSessionName
  })();
};
var isWebIdentityProfile = (arg) => Boolean(arg) && typeof arg === "object" && typeof arg.web_identity_token_file === "string" && typeof arg.role_arn === "string" && ["undefined", "string"].indexOf(typeof arg.role_session_name) > -1;
var resolveWebIdentityCredentials = async (profile, options) => fromTokenFile({
  webIdentityTokenFile: profile.web_identity_token_file,
  roleArn: profile.role_arn,
  roleSessionName: profile.role_session_name,
  roleAssumerWithWebIdentity: options.roleAssumerWithWebIdentity
})();
var resolveProfileData = async (profileName, profiles, options, visitedProfiles = {}) => {
  const data = profiles[profileName];
  if (Object.keys(visitedProfiles).length > 0 && isStaticCredsProfile(data)) {
    return resolveStaticCredentials(data);
  }
  if (isAssumeRoleProfile(data)) {
    return resolveAssumeRoleCredentials(profileName, profiles, options, visitedProfiles);
  }
  if (isStaticCredsProfile(data)) {
    return resolveStaticCredentials(data);
  }
  if (isWebIdentityProfile(data)) {
    return resolveWebIdentityCredentials(data, options);
  }
  if (isProcessProfile(data)) {
    return resolveProcessCredentials2(options, profileName);
  }
  if (isSsoProfile(data)) {
    return resolveSsoCredentials(data);
  }
  throw new CredentialsProviderError(`Profile ${profileName} could not be found or parsed in shared credentials file.`);
};
var fromIni = (init = {}) => async () => {
  const profiles = await parseKnownFiles(init);
  return resolveProfileData(getProfileName(init), profiles, init);
};
var ENV_IMDS_DISABLED2 = "AWS_EC2_METADATA_DISABLED";
var remoteProvider = (init) => {
  if (process.env[ENV_CMDS_RELATIVE_URI] || process.env[ENV_CMDS_FULL_URI]) {
    return fromContainerMetadata(init);
  }
  if (process.env[ENV_IMDS_DISABLED2]) {
    return async () => {
      throw new CredentialsProviderError("EC2 Instance Metadata Service access disabled");
    };
  }
  return fromInstanceMetadata(init);
};
var defaultProvider = (init = {}) => memoize(chain(...init.profile || process.env[ENV_PROFILE] ? [] : [fromEnv()], fromSSO(init), fromIni(init), fromProcess(init), fromTokenFile(init), remoteProvider(init), async () => {
  throw new CredentialsProviderError("Could not load credentials from any providers", false);
}), (credentials) => credentials.expiration !== void 0 && credentials.expiration.getTime() - Date.now() < 3e5, (credentials) => credentials.expiration !== void 0);
var F = "required";
var G = "type";
var H = "fn";
var I = "argv";
var J = "ref";
var a3 = false;
var b3 = true;
var c3 = "booleanEquals";
var d3 = "tree";
var e3 = "stringEquals";
var f3 = "sigv4";
var g3 = "sts";
var h3 = "us-east-1";
var i3 = "endpoint";
var j3 = "https://sts.{Region}.{PartitionResult#dnsSuffix}";
var k3 = "error";
var l3 = "getAttr";
var m3 = { [F]: false, [G]: "String" };
var n3 = { [F]: true, "default": false, [G]: "Boolean" };
var o3 = { [J]: "Endpoint" };
var p3 = { [H]: "isSet", [I]: [{ [J]: "Region" }] };
var q3 = { [J]: "Region" };
var r3 = { [H]: "aws.partition", [I]: [q3], "assign": "PartitionResult" };
var s3 = { [J]: "UseFIPS" };
var t = { [J]: "UseDualStack" };
var u = { "url": "https://sts.amazonaws.com", "properties": { "authSchemes": [{ "name": f3, "signingName": g3, "signingRegion": h3 }] }, "headers": {} };
var v = {};
var w = { "conditions": [{ [H]: e3, [I]: [q3, "aws-global"] }], [i3]: u, [G]: i3 };
var x = { [H]: c3, [I]: [s3, true] };
var y = { [H]: c3, [I]: [t, true] };
var z = { [H]: c3, [I]: [true, { [H]: l3, [I]: [{ [J]: "PartitionResult" }, "supportsFIPS"] }] };
var A = { [J]: "PartitionResult" };
var B = { [H]: c3, [I]: [true, { [H]: l3, [I]: [A, "supportsDualStack"] }] };
var C = [{ [H]: "isSet", [I]: [o3] }];
var D = [x];
var E = [y];
var _data3 = { version: "1.0", parameters: { Region: m3, UseDualStack: n3, UseFIPS: n3, Endpoint: m3, UseGlobalEndpoint: n3 }, rules: [{ conditions: [{ [H]: c3, [I]: [{ [J]: "UseGlobalEndpoint" }, b3] }, { [H]: "not", [I]: C }, p3, r3, { [H]: c3, [I]: [s3, a3] }, { [H]: c3, [I]: [t, a3] }], [G]: d3, rules: [{ conditions: [{ [H]: e3, [I]: [q3, "ap-northeast-1"] }], endpoint: u, [G]: i3 }, { conditions: [{ [H]: e3, [I]: [q3, "ap-south-1"] }], endpoint: u, [G]: i3 }, { conditions: [{ [H]: e3, [I]: [q3, "ap-southeast-1"] }], endpoint: u, [G]: i3 }, { conditions: [{ [H]: e3, [I]: [q3, "ap-southeast-2"] }], endpoint: u, [G]: i3 }, w, { conditions: [{ [H]: e3, [I]: [q3, "ca-central-1"] }], endpoint: u, [G]: i3 }, { conditions: [{ [H]: e3, [I]: [q3, "eu-central-1"] }], endpoint: u, [G]: i3 }, { conditions: [{ [H]: e3, [I]: [q3, "eu-north-1"] }], endpoint: u, [G]: i3 }, { conditions: [{ [H]: e3, [I]: [q3, "eu-west-1"] }], endpoint: u, [G]: i3 }, { conditions: [{ [H]: e3, [I]: [q3, "eu-west-2"] }], endpoint: u, [G]: i3 }, { conditions: [{ [H]: e3, [I]: [q3, "eu-west-3"] }], endpoint: u, [G]: i3 }, { conditions: [{ [H]: e3, [I]: [q3, "sa-east-1"] }], endpoint: u, [G]: i3 }, { conditions: [{ [H]: e3, [I]: [q3, h3] }], endpoint: u, [G]: i3 }, { conditions: [{ [H]: e3, [I]: [q3, "us-east-2"] }], endpoint: u, [G]: i3 }, { conditions: [{ [H]: e3, [I]: [q3, "us-west-1"] }], endpoint: u, [G]: i3 }, { conditions: [{ [H]: e3, [I]: [q3, "us-west-2"] }], endpoint: u, [G]: i3 }, { endpoint: { url: j3, properties: { authSchemes: [{ name: f3, signingName: g3, signingRegion: "{Region}" }] }, headers: v }, [G]: i3 }] }, { conditions: C, [G]: d3, rules: [{ conditions: D, error: "Invalid Configuration: FIPS and custom endpoint are not supported", [G]: k3 }, { [G]: d3, rules: [{ conditions: E, error: "Invalid Configuration: Dualstack and custom endpoint are not supported", [G]: k3 }, { endpoint: { url: o3, properties: v, headers: v }, [G]: i3 }] }] }, { [G]: d3, rules: [{ conditions: [p3], [G]: d3, rules: [{ conditions: [r3], [G]: d3, rules: [{ conditions: [x, y], [G]: d3, rules: [{ conditions: [z, B], [G]: d3, rules: [{ [G]: d3, rules: [{ endpoint: { url: "https://sts-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: v, headers: v }, [G]: i3 }] }] }, { error: "FIPS and DualStack are enabled, but this partition does not support one or both", [G]: k3 }] }, { conditions: D, [G]: d3, rules: [{ conditions: [z], [G]: d3, rules: [{ [G]: d3, rules: [{ conditions: [{ [H]: e3, [I]: ["aws-us-gov", { [H]: l3, [I]: [A, "name"] }] }], endpoint: { url: "https://sts.{Region}.amazonaws.com", properties: v, headers: v }, [G]: i3 }, { endpoint: { url: "https://sts-fips.{Region}.{PartitionResult#dnsSuffix}", properties: v, headers: v }, [G]: i3 }] }] }, { error: "FIPS is enabled but this partition does not support FIPS", [G]: k3 }] }, { conditions: E, [G]: d3, rules: [{ conditions: [B], [G]: d3, rules: [{ [G]: d3, rules: [{ endpoint: { url: "https://sts.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: v, headers: v }, [G]: i3 }] }] }, { error: "DualStack is enabled but this partition does not support DualStack", [G]: k3 }] }, { [G]: d3, rules: [w, { endpoint: { url: j3, properties: v, headers: v }, [G]: i3 }] }] }] }, { error: "Invalid Configuration: Missing Region", [G]: k3 }] }] };
var ruleSet3 = _data3;
var defaultEndpointResolver3 = (endpointParams, context = {}) => {
  return resolveEndpoint(ruleSet3, {
    endpointParams,
    logger: context.logger
  });
};
var getRuntimeConfig5 = (config) => ({
  apiVersion: "2011-06-15",
  base64Decoder: (config == null ? void 0 : config.base64Decoder) ?? fromBase64,
  base64Encoder: (config == null ? void 0 : config.base64Encoder) ?? toBase64,
  disableHostPrefix: (config == null ? void 0 : config.disableHostPrefix) ?? false,
  endpointProvider: (config == null ? void 0 : config.endpointProvider) ?? defaultEndpointResolver3,
  logger: (config == null ? void 0 : config.logger) ?? new NoOpLogger(),
  serviceId: (config == null ? void 0 : config.serviceId) ?? "STS",
  urlParser: (config == null ? void 0 : config.urlParser) ?? parseUrl,
  utf8Decoder: (config == null ? void 0 : config.utf8Decoder) ?? fromUtf84,
  utf8Encoder: (config == null ? void 0 : config.utf8Encoder) ?? toUtf84
});
var getRuntimeConfig6 = (config) => {
  emitWarningIfUnsupportedVersion(process.version);
  const defaultsMode = resolveDefaultsModeConfig(config);
  const defaultConfigProvider = () => defaultsMode().then(loadConfigsForDefaultMode);
  const clientSharedValues = getRuntimeConfig5(config);
  return {
    ...clientSharedValues,
    ...config,
    runtime: "node",
    defaultsMode,
    bodyLengthChecker: (config == null ? void 0 : config.bodyLengthChecker) ?? calculateBodyLength,
    credentialDefaultProvider: (config == null ? void 0 : config.credentialDefaultProvider) ?? decorateDefaultCredentialProvider(defaultProvider),
    defaultUserAgentProvider: (config == null ? void 0 : config.defaultUserAgentProvider) ?? defaultUserAgent({ serviceId: clientSharedValues.serviceId, clientVersion: package_default2.version }),
    maxAttempts: (config == null ? void 0 : config.maxAttempts) ?? loadConfig(NODE_MAX_ATTEMPT_CONFIG_OPTIONS),
    region: (config == null ? void 0 : config.region) ?? loadConfig(NODE_REGION_CONFIG_OPTIONS, NODE_REGION_CONFIG_FILE_OPTIONS),
    requestHandler: (config == null ? void 0 : config.requestHandler) ?? new NodeHttpHandler(defaultConfigProvider),
    retryMode: (config == null ? void 0 : config.retryMode) ?? loadConfig({
      ...NODE_RETRY_MODE_CONFIG_OPTIONS,
      default: async () => (await defaultConfigProvider()).retryMode || DEFAULT_RETRY_MODE
    }),
    sha256: (config == null ? void 0 : config.sha256) ?? Hash.bind(null, "sha256"),
    streamCollector: (config == null ? void 0 : config.streamCollector) ?? streamCollector,
    useDualstackEndpoint: (config == null ? void 0 : config.useDualstackEndpoint) ?? loadConfig(NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS),
    useFipsEndpoint: (config == null ? void 0 : config.useFipsEndpoint) ?? loadConfig(NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS)
  };
};
var STSClient = class _STSClient extends Client {
  constructor(configuration) {
    const _config_0 = getRuntimeConfig6(configuration);
    const _config_1 = resolveClientEndpointParameters2(_config_0);
    const _config_2 = resolveRegionConfig(_config_1);
    const _config_3 = resolveEndpointConfig(_config_2);
    const _config_4 = resolveRetryConfig(_config_3);
    const _config_5 = resolveHostHeaderConfig(_config_4);
    const _config_6 = resolveStsAuthConfig(_config_5, { stsClientCtor: _STSClient });
    const _config_7 = resolveUserAgentConfig(_config_6);
    super(_config_7);
    this.config = _config_7;
    this.middlewareStack.use(getRetryPlugin(this.config));
    this.middlewareStack.use(getContentLengthPlugin(this.config));
    this.middlewareStack.use(getHostHeaderPlugin(this.config));
    this.middlewareStack.use(getLoggerPlugin(this.config));
    this.middlewareStack.use(getRecursionDetectionPlugin(this.config));
    this.middlewareStack.use(getUserAgentPlugin(this.config));
  }
  destroy() {
    super.destroy();
  }
};
var getCustomizableStsClientCtor = (baseCtor, customizations) => {
  return baseCtor;
};
var getDefaultRoleAssumer2 = (stsOptions = {}, stsPlugins) => getDefaultRoleAssumer(stsOptions, getCustomizableStsClientCtor(STSClient));
var getDefaultRoleAssumerWithWebIdentity2 = (stsOptions = {}, stsPlugins) => getDefaultRoleAssumerWithWebIdentity(stsOptions, getCustomizableStsClientCtor(STSClient));
var decorateDefaultCredentialProvider2 = (provider) => (input) => provider({
  roleAssumer: getDefaultRoleAssumer2(input),
  roleAssumerWithWebIdentity: getDefaultRoleAssumerWithWebIdentity2(input),
  ...input
});
function getChunkedStream(source) {
  let currentMessageTotalLength = 0;
  let currentMessagePendingLength = 0;
  let currentMessage = null;
  let messageLengthBuffer = null;
  const allocateMessage = (size) => {
    if (typeof size !== "number") {
      throw new Error("Attempted to allocate an event message where size was not a number: " + size);
    }
    currentMessageTotalLength = size;
    currentMessagePendingLength = 4;
    currentMessage = new Uint8Array(size);
    const currentMessageView = new DataView(currentMessage.buffer);
    currentMessageView.setUint32(0, size, false);
  };
  const iterator = async function* () {
    const sourceIterator = source[Symbol.asyncIterator]();
    while (true) {
      const { value, done } = await sourceIterator.next();
      if (done) {
        if (!currentMessageTotalLength) {
          return;
        } else if (currentMessageTotalLength === currentMessagePendingLength) {
          yield currentMessage;
        } else {
          throw new Error("Truncated event message received.");
        }
        return;
      }
      const chunkLength = value.length;
      let currentOffset = 0;
      while (currentOffset < chunkLength) {
        if (!currentMessage) {
          const bytesRemaining = chunkLength - currentOffset;
          if (!messageLengthBuffer) {
            messageLengthBuffer = new Uint8Array(4);
          }
          const numBytesForTotal = Math.min(4 - currentMessagePendingLength, bytesRemaining);
          messageLengthBuffer.set(value.slice(currentOffset, currentOffset + numBytesForTotal), currentMessagePendingLength);
          currentMessagePendingLength += numBytesForTotal;
          currentOffset += numBytesForTotal;
          if (currentMessagePendingLength < 4) {
            break;
          }
          allocateMessage(new DataView(messageLengthBuffer.buffer).getUint32(0, false));
          messageLengthBuffer = null;
        }
        const numBytesToWrite = Math.min(currentMessageTotalLength - currentMessagePendingLength, chunkLength - currentOffset);
        currentMessage.set(value.slice(currentOffset, currentOffset + numBytesToWrite), currentMessagePendingLength);
        currentMessagePendingLength += numBytesToWrite;
        currentOffset += numBytesToWrite;
        if (currentMessageTotalLength && currentMessageTotalLength === currentMessagePendingLength) {
          yield currentMessage;
          currentMessage = null;
          currentMessageTotalLength = 0;
          currentMessagePendingLength = 0;
        }
      }
    }
  };
  return {
    [Symbol.asyncIterator]: iterator
  };
}
function getMessageUnmarshaller(deserializer, toUtf85) {
  return async function(message) {
    const { value: messageType } = message.headers[":message-type"];
    if (messageType === "error") {
      const unmodeledError = new Error(message.headers[":error-message"].value || "UnknownError");
      unmodeledError.name = message.headers[":error-code"].value;
      throw unmodeledError;
    } else if (messageType === "exception") {
      const code = message.headers[":exception-type"].value;
      const exception = { [code]: message };
      const deserializedException = await deserializer(exception);
      if (deserializedException.$unknown) {
        const error = new Error(toUtf85(message.body));
        error.name = code;
        throw error;
      }
      throw deserializedException[code];
    } else if (messageType === "event") {
      const event = {
        [message.headers[":event-type"].value]: message
      };
      const deserialized = await deserializer(event);
      if (deserialized.$unknown)
        return;
      return deserialized;
    } else {
      throw Error(`Unrecognizable event type: ${message.headers[":event-type"].value}`);
    }
  };
}
var EventStreamMarshaller = class {
  constructor({ utf8Encoder, utf8Decoder }) {
    this.eventStreamCodec = new EventStreamCodec(utf8Encoder, utf8Decoder);
    this.utfEncoder = utf8Encoder;
  }
  deserialize(body, deserializer) {
    const inputStream = getChunkedStream(body);
    return new SmithyMessageDecoderStream({
      messageStream: new MessageDecoderStream({ inputStream, decoder: this.eventStreamCodec }),
      deserializer: getMessageUnmarshaller(deserializer, this.utfEncoder)
    });
  }
  serialize(inputStream, serializer) {
    return new MessageEncoderStream({
      messageStream: new SmithyMessageEncoderStream({ inputStream, serializer }),
      encoder: this.eventStreamCodec,
      includeEndFrame: true
    });
  }
};
async function* readabletoIterable(readStream) {
  let streamEnded = false;
  let generationEnded = false;
  const records = new Array();
  readStream.on("error", (err) => {
    if (!streamEnded) {
      streamEnded = true;
    }
    if (err) {
      throw err;
    }
  });
  readStream.on("data", (data) => {
    records.push(data);
  });
  readStream.on("end", () => {
    streamEnded = true;
  });
  while (!generationEnded) {
    const value = await new Promise((resolve) => setTimeout(() => resolve(records.shift()), 0));
    if (value) {
      yield value;
    }
    generationEnded = streamEnded && records.length === 0;
  }
}
var EventStreamMarshaller2 = class {
  constructor({ utf8Encoder, utf8Decoder }) {
    this.universalMarshaller = new EventStreamMarshaller({
      utf8Decoder,
      utf8Encoder
    });
  }
  deserialize(body, deserializer) {
    const bodyIterable = typeof body[Symbol.asyncIterator] === "function" ? body : readabletoIterable(body);
    return this.universalMarshaller.deserialize(bodyIterable, deserializer);
  }
  serialize(input, serializer) {
    return Readable.from(this.universalMarshaller.serialize(input, serializer));
  }
};
var eventStreamSerdeProvider = (options) => new EventStreamMarshaller2(options);
var HashCalculator = class extends Writable {
  constructor(hash, options) {
    super(options);
    this.hash = hash;
  }
  _write(chunk, encoding, callback) {
    try {
      this.hash.update(toUint8Array(chunk));
    } catch (err) {
      return callback(err);
    }
    callback();
  }
};
var readableStreamHasher = (hashCtor, readableStream) => {
  if (readableStream.readableFlowing !== null) {
    throw new Error("Unable to calculate hash for flowing readable stream");
  }
  const hash = new hashCtor();
  const hashCalculator = new HashCalculator(hash);
  readableStream.pipe(hashCalculator);
  return new Promise((resolve, reject) => {
    readableStream.on("error", (err) => {
      hashCalculator.end();
      reject(err);
    });
    hashCalculator.on("error", reject);
    hashCalculator.on("finish", () => {
      hash.digest().then(resolve).catch(reject);
    });
  });
};
var NODE_USE_ARN_REGION_ENV_NAME = "AWS_S3_USE_ARN_REGION";
var NODE_USE_ARN_REGION_INI_NAME = "s3_use_arn_region";
var NODE_USE_ARN_REGION_CONFIG_OPTIONS = {
  environmentVariableSelector: (env2) => booleanSelector(env2, NODE_USE_ARN_REGION_ENV_NAME, SelectorType.ENV),
  configFileSelector: (profile) => booleanSelector(profile, NODE_USE_ARN_REGION_INI_NAME, SelectorType.CONFIG),
  default: false
};
var SignatureV4MultiRegion = class {
  constructor(options) {
    this.sigv4Signer = new SignatureV4(options);
    this.signerOptions = options;
  }
  async sign(requestToSign, options = {}) {
    if (options.signingRegion === "*") {
      if (this.signerOptions.runtime !== "node")
        throw new Error("This request requires signing with SigV4Asymmetric algorithm. It's only available in Node.js");
      return this.getSigv4aSigner().sign(requestToSign, options);
    }
    return this.sigv4Signer.sign(requestToSign, options);
  }
  async presign(originalRequest, options = {}) {
    if (options.signingRegion === "*") {
      if (this.signerOptions.runtime !== "node")
        throw new Error("This request requires signing with SigV4Asymmetric algorithm. It's only available in Node.js");
      return this.getSigv4aSigner().presign(originalRequest, options);
    }
    return this.sigv4Signer.presign(originalRequest, options);
  }
  getSigv4aSigner() {
    if (!this.sigv4aSigner) {
      let CrtSignerV4;
      try {
        CrtSignerV4 = typeof __require === "function" && __require("@aws-sdk/signature-v4-crt").CrtSignerV4;
        if (typeof CrtSignerV4 !== "function")
          throw new Error();
      } catch (e5) {
        e5.message = `${e5.message}
Please check if you have installed "@aws-sdk/signature-v4-crt" package explicitly. 
For more information please go to https://github.com/aws/aws-sdk-js-v3#functionality-requiring-aws-common-runtime-crt`;
        throw e5;
      }
      this.sigv4aSigner = new CrtSignerV4({
        ...this.signerOptions,
        signingAlgorithm: 1
      });
    }
    return this.sigv4aSigner;
  }
};
var bV = "required";
var bW = "type";
var bX = "rules";
var bY = "conditions";
var bZ = "fn";
var ca = "argv";
var cb = "ref";
var cc = "assign";
var cd = "url";
var ce = "properties";
var cf = "authSchemes";
var cg = "disableDoubleEncoding";
var ch = "signingName";
var ci = "signingRegion";
var cj = "headers";
var a4 = false;
var b4 = true;
var c4 = "tree";
var d4 = "isSet";
var e4 = "substring";
var f4 = "hardwareType";
var g4 = "regionPrefix";
var h4 = "abbaSuffix";
var i4 = "outpostId";
var j4 = "aws.partition";
var k4 = "stringEquals";
var l4 = "isValidHostLabel";
var m4 = "not";
var n4 = "error";
var o4 = "parseURL";
var p4 = "s3-outposts";
var q4 = "endpoint";
var r4 = "booleanEquals";
var s4 = "aws.parseArn";
var t2 = "s3";
var u2 = "aws.isVirtualHostableS3Bucket";
var v2 = "getAttr";
var w2 = "name";
var x2 = "Host override cannot be combined with Dualstack, FIPS, or S3 Accelerate";
var y2 = "https://{Bucket}.s3.{partitionResult#dnsSuffix}";
var z2 = "bucketArn";
var A2 = "arnType";
var B2 = "";
var C2 = "s3-object-lambda";
var D2 = "accesspoint";
var E2 = "accessPointName";
var F2 = "{url#scheme}://{accessPointName}-{bucketArn#accountId}.{url#authority}{url#path}";
var G2 = "mrapPartition";
var H2 = "outpostType";
var I2 = "arnPrefix";
var J2 = "{url#scheme}://{url#authority}{url#path}";
var K = "https://s3.{partitionResult#dnsSuffix}";
var L = { [bV]: false, [bW]: "String" };
var M = { [bV]: true, "default": false, [bW]: "Boolean" };
var N = { [bV]: false, [bW]: "Boolean" };
var O = { [bZ]: d4, [ca]: [{ [cb]: "Bucket" }] };
var P = { [cb]: "Bucket" };
var Q = { [cb]: f4 };
var R = { [bY]: [{ [bZ]: m4, [ca]: [{ [bZ]: d4, [ca]: [{ [cb]: "Endpoint" }] }] }], [n4]: "Expected a endpoint to be specified but no endpoint was found", [bW]: n4 };
var S = { [bZ]: m4, [ca]: [{ [bZ]: d4, [ca]: [{ [cb]: "Endpoint" }] }] };
var T = { [bZ]: d4, [ca]: [{ [cb]: "Endpoint" }] };
var U = { [bZ]: o4, [ca]: [{ [cb]: "Endpoint" }], [cc]: "url" };
var V = { [cf]: [{ [cg]: true, [w2]: "sigv4", [ch]: p4, [ci]: "{Region}" }] };
var W = {};
var X = { [cb]: "ForcePathStyle" };
var Y = { [bY]: [{ [bZ]: "uriEncode", [ca]: [P], [cc]: "uri_encoded_bucket" }], [bW]: c4, [bX]: [{ [bY]: [{ [bZ]: r4, [ca]: [{ [cb]: "UseDualStack" }, true] }, T], [n4]: "Cannot set dual-stack in combination with a custom endpoint.", [bW]: n4 }, { [bW]: c4, [bX]: [{ [bY]: [{ [bZ]: j4, [ca]: [{ [cb]: "Region" }], [cc]: "partitionResult" }], [bW]: c4, [bX]: [{ [bW]: c4, [bX]: [{ [bY]: [{ [bZ]: r4, [ca]: [{ [cb]: "Accelerate" }, false] }], [bW]: c4, [bX]: [{ [bW]: c4, [bX]: [{ [bY]: [{ [bZ]: r4, [ca]: [{ [cb]: "UseDualStack" }, true] }, S, { [bZ]: r4, [ca]: [{ [cb]: "UseFIPS" }, true] }, { [bZ]: k4, [ca]: [{ [cb]: "Region" }, "aws-global"] }], [q4]: { [cd]: "https://s3-fips.dualstack.us-east-1.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [ce]: { [cf]: [{ [cg]: true, [w2]: "sigv4", [ch]: t2, [ci]: "us-east-1" }] }, [cj]: {} }, [bW]: q4 }, { [bY]: [{ [bZ]: r4, [ca]: [{ [cb]: "UseDualStack" }, true] }, S, { [bZ]: r4, [ca]: [{ [cb]: "UseFIPS" }, true] }, { [bZ]: k4, [ca]: [{ [cb]: "Region" }, "aws-global"] }], [q4]: { [cd]: "https://s3-fips.dualstack.us-east-1.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [ce]: { [cf]: [{ [cg]: true, [w2]: "sigv4", [ch]: t2, [ci]: "us-east-1" }] }, [cj]: {} }, [bW]: q4 }, { [bY]: [{ [bZ]: r4, [ca]: [{ [cb]: "UseDualStack" }, true] }, S, { [bZ]: r4, [ca]: [{ [cb]: "UseFIPS" }, true] }, { [bZ]: m4, [ca]: [{ [bZ]: k4, [ca]: [{ [cb]: "Region" }, "aws-global"] }] }, { [bZ]: r4, [ca]: [{ [cb]: "UseGlobalEndpoint" }, true] }], [bW]: c4, [bX]: [{ [q4]: { [cd]: "https://s3-fips.dualstack.{Region}.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [ce]: { [cf]: [{ [cg]: true, [w2]: "sigv4", [ch]: t2, [ci]: "{Region}" }] }, [cj]: {} }, [bW]: q4 }] }, { [bY]: [{ [bZ]: r4, [ca]: [{ [cb]: "UseDualStack" }, true] }, S, { [bZ]: r4, [ca]: [{ [cb]: "UseFIPS" }, true] }, { [bZ]: m4, [ca]: [{ [bZ]: k4, [ca]: [{ [cb]: "Region" }, "aws-global"] }] }, { [bZ]: r4, [ca]: [{ [cb]: "UseGlobalEndpoint" }, false] }], [q4]: { [cd]: "https://s3-fips.dualstack.{Region}.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [ce]: { [cf]: [{ [cg]: true, [w2]: "sigv4", [ch]: t2, [ci]: "{Region}" }] }, [cj]: {} }, [bW]: q4 }, { [bY]: [{ [bZ]: r4, [ca]: [{ [cb]: "UseDualStack" }, false] }, T, U, { [bZ]: r4, [ca]: [{ [cb]: "UseFIPS" }, true] }, { [bZ]: k4, [ca]: [{ [cb]: "Region" }, "aws-global"] }], [q4]: { [cd]: "{url#scheme}://{url#authority}{url#normalizedPath}{uri_encoded_bucket}", [ce]: { [cf]: [{ [cg]: true, [w2]: "sigv4", [ch]: t2, [ci]: "us-east-1" }] }, [cj]: {} }, [bW]: q4 }, { [bY]: [{ [bZ]: r4, [ca]: [{ [cb]: "UseDualStack" }, false] }, T, U, { [bZ]: r4, [ca]: [{ [cb]: "UseFIPS" }, true] }, { [bZ]: k4, [ca]: [{ [cb]: "Region" }, "aws-global"] }], [q4]: { [cd]: "{url#scheme}://{url#authority}{url#normalizedPath}{uri_encoded_bucket}", [ce]: { [cf]: [{ [cg]: true, [w2]: "sigv4", [ch]: t2, [ci]: "us-east-1" }] }, [cj]: {} }, [bW]: q4 }, { [bY]: [{ [bZ]: r4, [ca]: [{ [cb]: "UseDualStack" }, false] }, T, U, { [bZ]: r4, [ca]: [{ [cb]: "UseFIPS" }, true] }, { [bZ]: m4, [ca]: [{ [bZ]: k4, [ca]: [{ [cb]: "Region" }, "aws-global"] }] }, { [bZ]: r4, [ca]: [{ [cb]: "UseGlobalEndpoint" }, true] }], [bW]: c4, [bX]: [{ [q4]: { [cd]: "{url#scheme}://{url#authority}{url#normalizedPath}{uri_encoded_bucket}", [ce]: { [cf]: [{ [cg]: true, [w2]: "sigv4", [ch]: t2, [ci]: "{Region}" }] }, [cj]: {} }, [bW]: q4 }] }, { [bY]: [{ [bZ]: r4, [ca]: [{ [cb]: "UseDualStack" }, false] }, T, U, { [bZ]: r4, [ca]: [{ [cb]: "UseFIPS" }, true] }, { [bZ]: m4, [ca]: [{ [bZ]: k4, [ca]: [{ [cb]: "Region" }, "aws-global"] }] }, { [bZ]: r4, [ca]: [{ [cb]: "UseGlobalEndpoint" }, false] }], [q4]: { [cd]: "{url#scheme}://{url#authority}{url#normalizedPath}{uri_encoded_bucket}", [ce]: { [cf]: [{ [cg]: true, [w2]: "sigv4", [ch]: t2, [ci]: "{Region}" }] }, [cj]: {} }, [bW]: q4 }, { [bY]: [{ [bZ]: r4, [ca]: [{ [cb]: "UseDualStack" }, false] }, S, { [bZ]: r4, [ca]: [{ [cb]: "UseFIPS" }, true] }, { [bZ]: k4, [ca]: [{ [cb]: "Region" }, "aws-global"] }], [q4]: { [cd]: "https://s3-fips.us-east-1.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [ce]: { [cf]: [{ [cg]: true, [w2]: "sigv4", [ch]: t2, [ci]: "us-east-1" }] }, [cj]: {} }, [bW]: q4 }, { [bY]: [{ [bZ]: r4, [ca]: [{ [cb]: "UseDualStack" }, false] }, S, { [bZ]: r4, [ca]: [{ [cb]: "UseFIPS" }, true] }, { [bZ]: k4, [ca]: [{ [cb]: "Region" }, "aws-global"] }], [q4]: { [cd]: "https://s3-fips.us-east-1.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [ce]: { [cf]: [{ [cg]: true, [w2]: "sigv4", [ch]: t2, [ci]: "us-east-1" }] }, [cj]: {} }, [bW]: q4 }, { [bY]: [{ [bZ]: r4, [ca]: [{ [cb]: "UseDualStack" }, false] }, S, { [bZ]: r4, [ca]: [{ [cb]: "UseFIPS" }, true] }, { [bZ]: m4, [ca]: [{ [bZ]: k4, [ca]: [{ [cb]: "Region" }, "aws-global"] }] }, { [bZ]: r4, [ca]: [{ [cb]: "UseGlobalEndpoint" }, true] }], [bW]: c4, [bX]: [{ [q4]: { [cd]: "https://s3-fips.{Region}.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [ce]: { [cf]: [{ [cg]: true, [w2]: "sigv4", [ch]: t2, [ci]: "{Region}" }] }, [cj]: {} }, [bW]: q4 }] }, { [bY]: [{ [bZ]: r4, [ca]: [{ [cb]: "UseDualStack" }, false] }, S, { [bZ]: r4, [ca]: [{ [cb]: "UseFIPS" }, true] }, { [bZ]: m4, [ca]: [{ [bZ]: k4, [ca]: [{ [cb]: "Region" }, "aws-global"] }] }, { [bZ]: r4, [ca]: [{ [cb]: "UseGlobalEndpoint" }, false] }], [q4]: { [cd]: "https://s3-fips.{Region}.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [ce]: { [cf]: [{ [cg]: true, [w2]: "sigv4", [ch]: t2, [ci]: "{Region}" }] }, [cj]: {} }, [bW]: q4 }, { [bY]: [{ [bZ]: r4, [ca]: [{ [cb]: "UseDualStack" }, true] }, S, { [bZ]: r4, [ca]: [{ [cb]: "UseFIPS" }, false] }, { [bZ]: k4, [ca]: [{ [cb]: "Region" }, "aws-global"] }], [q4]: { [cd]: "https://s3.dualstack.us-east-1.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [ce]: { [cf]: [{ [cg]: true, [w2]: "sigv4", [ch]: t2, [ci]: "us-east-1" }] }, [cj]: {} }, [bW]: q4 }, { [bY]: [{ [bZ]: r4, [ca]: [{ [cb]: "UseDualStack" }, true] }, S, { [bZ]: r4, [ca]: [{ [cb]: "UseFIPS" }, false] }, { [bZ]: k4, [ca]: [{ [cb]: "Region" }, "aws-global"] }], [q4]: { [cd]: "https://s3.dualstack.us-east-1.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [ce]: { [cf]: [{ [cg]: true, [w2]: "sigv4", [ch]: t2, [ci]: "us-east-1" }] }, [cj]: {} }, [bW]: q4 }, { [bY]: [{ [bZ]: r4, [ca]: [{ [cb]: "UseDualStack" }, true] }, S, { [bZ]: r4, [ca]: [{ [cb]: "UseFIPS" }, false] }, { [bZ]: m4, [ca]: [{ [bZ]: k4, [ca]: [{ [cb]: "Region" }, "aws-global"] }] }, { [bZ]: r4, [ca]: [{ [cb]: "UseGlobalEndpoint" }, true] }], [bW]: c4, [bX]: [{ [q4]: { [cd]: "https://s3.dualstack.{Region}.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [ce]: { [cf]: [{ [cg]: true, [w2]: "sigv4", [ch]: t2, [ci]: "{Region}" }] }, [cj]: {} }, [bW]: q4 }] }, { [bY]: [{ [bZ]: r4, [ca]: [{ [cb]: "UseDualStack" }, true] }, S, { [bZ]: r4, [ca]: [{ [cb]: "UseFIPS" }, false] }, { [bZ]: m4, [ca]: [{ [bZ]: k4, [ca]: [{ [cb]: "Region" }, "aws-global"] }] }, { [bZ]: r4, [ca]: [{ [cb]: "UseGlobalEndpoint" }, false] }], [q4]: { [cd]: "https://s3.dualstack.{Region}.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [ce]: { [cf]: [{ [cg]: true, [w2]: "sigv4", [ch]: t2, [ci]: "{Region}" }] }, [cj]: {} }, [bW]: q4 }, { [bY]: [{ [bZ]: r4, [ca]: [{ [cb]: "UseDualStack" }, false] }, T, U, { [bZ]: r4, [ca]: [{ [cb]: "UseFIPS" }, false] }, { [bZ]: k4, [ca]: [{ [cb]: "Region" }, "aws-global"] }], [q4]: { [cd]: "{url#scheme}://{url#authority}{url#normalizedPath}{uri_encoded_bucket}", [ce]: { [cf]: [{ [cg]: true, [w2]: "sigv4", [ch]: t2, [ci]: "us-east-1" }] }, [cj]: {} }, [bW]: q4 }, { [bY]: [{ [bZ]: r4, [ca]: [{ [cb]: "UseDualStack" }, false] }, T, U, { [bZ]: r4, [ca]: [{ [cb]: "UseFIPS" }, false] }, { [bZ]: k4, [ca]: [{ [cb]: "Region" }, "aws-global"] }], [q4]: { [cd]: "{url#scheme}://{url#authority}{url#normalizedPath}{uri_encoded_bucket}", [ce]: { [cf]: [{ [cg]: true, [w2]: "sigv4", [ch]: t2, [ci]: "us-east-1" }] }, [cj]: {} }, [bW]: q4 }, { [bY]: [{ [bZ]: r4, [ca]: [{ [cb]: "UseDualStack" }, false] }, T, U, { [bZ]: r4, [ca]: [{ [cb]: "UseFIPS" }, false] }, { [bZ]: m4, [ca]: [{ [bZ]: k4, [ca]: [{ [cb]: "Region" }, "aws-global"] }] }, { [bZ]: r4, [ca]: [{ [cb]: "UseGlobalEndpoint" }, true] }], [bW]: c4, [bX]: [{ [bY]: [{ [bZ]: k4, [ca]: [{ [cb]: "Region" }, "us-east-1"] }], [q4]: { [cd]: "{url#scheme}://{url#authority}{url#normalizedPath}{uri_encoded_bucket}", [ce]: { [cf]: [{ [cg]: true, [w2]: "sigv4", [ch]: t2, [ci]: "{Region}" }] }, [cj]: {} }, [bW]: q4 }, { [q4]: { [cd]: "{url#scheme}://{url#authority}{url#normalizedPath}{uri_encoded_bucket}", [ce]: { [cf]: [{ [cg]: true, [w2]: "sigv4", [ch]: t2, [ci]: "{Region}" }] }, [cj]: {} }, [bW]: q4 }] }, { [bY]: [{ [bZ]: r4, [ca]: [{ [cb]: "UseDualStack" }, false] }, T, U, { [bZ]: r4, [ca]: [{ [cb]: "UseFIPS" }, false] }, { [bZ]: m4, [ca]: [{ [bZ]: k4, [ca]: [{ [cb]: "Region" }, "aws-global"] }] }, { [bZ]: r4, [ca]: [{ [cb]: "UseGlobalEndpoint" }, false] }], [q4]: { [cd]: "{url#scheme}://{url#authority}{url#normalizedPath}{uri_encoded_bucket}", [ce]: { [cf]: [{ [cg]: true, [w2]: "sigv4", [ch]: t2, [ci]: "{Region}" }] }, [cj]: {} }, [bW]: q4 }, { [bY]: [{ [bZ]: r4, [ca]: [{ [cb]: "UseDualStack" }, false] }, S, { [bZ]: r4, [ca]: [{ [cb]: "UseFIPS" }, false] }, { [bZ]: k4, [ca]: [{ [cb]: "Region" }, "aws-global"] }], [q4]: { [cd]: "https://s3.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [ce]: { [cf]: [{ [cg]: true, [w2]: "sigv4", [ch]: t2, [ci]: "us-east-1" }] }, [cj]: {} }, [bW]: q4 }, { [bY]: [{ [bZ]: r4, [ca]: [{ [cb]: "UseDualStack" }, false] }, S, { [bZ]: r4, [ca]: [{ [cb]: "UseFIPS" }, false] }, { [bZ]: k4, [ca]: [{ [cb]: "Region" }, "aws-global"] }], [q4]: { [cd]: "https://s3.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [ce]: { [cf]: [{ [cg]: true, [w2]: "sigv4", [ch]: t2, [ci]: "us-east-1" }] }, [cj]: {} }, [bW]: q4 }, { [bY]: [{ [bZ]: r4, [ca]: [{ [cb]: "UseDualStack" }, false] }, S, { [bZ]: r4, [ca]: [{ [cb]: "UseFIPS" }, false] }, { [bZ]: m4, [ca]: [{ [bZ]: k4, [ca]: [{ [cb]: "Region" }, "aws-global"] }] }, { [bZ]: r4, [ca]: [{ [cb]: "UseGlobalEndpoint" }, true] }], [bW]: c4, [bX]: [{ [bY]: [{ [bZ]: k4, [ca]: [{ [cb]: "Region" }, "us-east-1"] }], [q4]: { [cd]: "https://s3.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [ce]: { [cf]: [{ [cg]: true, [w2]: "sigv4", [ch]: t2, [ci]: "{Region}" }] }, [cj]: {} }, [bW]: q4 }, { [q4]: { [cd]: "https://s3.{Region}.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [ce]: { [cf]: [{ [cg]: true, [w2]: "sigv4", [ch]: t2, [ci]: "{Region}" }] }, [cj]: {} }, [bW]: q4 }] }, { [bY]: [{ [bZ]: r4, [ca]: [{ [cb]: "UseDualStack" }, false] }, S, { [bZ]: r4, [ca]: [{ [cb]: "UseFIPS" }, false] }, { [bZ]: m4, [ca]: [{ [bZ]: k4, [ca]: [{ [cb]: "Region" }, "aws-global"] }] }, { [bZ]: r4, [ca]: [{ [cb]: "UseGlobalEndpoint" }, false] }], [q4]: { [cd]: "https://s3.{Region}.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [ce]: { [cf]: [{ [cg]: true, [w2]: "sigv4", [ch]: t2, [ci]: "{Region}" }] }, [cj]: {} }, [bW]: q4 }] }] }, { [n4]: "Path-style addressing cannot be used with S3 Accelerate", [bW]: n4 }] }] }, { [n4]: "A valid partition could not be determined", [bW]: n4 }] }] };
var Z = { [bZ]: r4, [ca]: [{ [cb]: "UseDualStack" }, true] };
var aa = { [bZ]: r4, [ca]: [{ [cb]: "Accelerate" }, false] };
var ab = { [bZ]: r4, [ca]: [{ [cb]: "UseFIPS" }, true] };
var ac = { [bZ]: m4, [ca]: [{ [bZ]: k4, [ca]: [{ [cb]: "Region" }, "aws-global"] }] };
var ad = { [bZ]: r4, [ca]: [{ [cb]: "UseGlobalEndpoint" }, true] };
var ae = { [cf]: [{ [cg]: true, [w2]: "sigv4", [ch]: t2, [ci]: "{Region}" }] };
var af = { [bZ]: r4, [ca]: [{ [cb]: "UseGlobalEndpoint" }, false] };
var ag = { [bZ]: r4, [ca]: [{ [cb]: "UseDualStack" }, false] };
var ah = { [bZ]: r4, [ca]: [{ [cb]: "UseFIPS" }, false] };
var ai = { [n4]: "A valid partition could not be determined", [bW]: n4 };
var aj = { [bY]: [ab, { [bZ]: k4, [ca]: [{ [bZ]: v2, [ca]: [{ [cb]: "partitionResult" }, w2] }, "aws-cn"] }], [n4]: "Partition does not support FIPS", [bW]: n4 };
var ak = { [bZ]: k4, [ca]: [{ [bZ]: v2, [ca]: [{ [cb]: "partitionResult" }, w2] }, "aws-cn"] };
var al = { [bZ]: r4, [ca]: [{ [cb]: "Accelerate" }, true] };
var am = { [bY]: [Z, ab, aa, S, { [bZ]: k4, [ca]: [{ [cb]: "Region" }, "aws-global"] }], [q4]: { [cd]: "https://{Bucket}.s3-fips.dualstack.us-east-1.{partitionResult#dnsSuffix}", [ce]: { [cf]: [{ [cg]: true, [w2]: "sigv4", [ch]: t2, [ci]: "us-east-1" }] }, [cj]: {} }, [bW]: q4 };
var an = { [cd]: "https://{Bucket}.s3-fips.dualstack.{Region}.{partitionResult#dnsSuffix}", [ce]: ae, [cj]: {} };
var ao = { [bY]: [ag, ab, aa, S, { [bZ]: k4, [ca]: [{ [cb]: "Region" }, "aws-global"] }], [q4]: { [cd]: "https://{Bucket}.s3-fips.us-east-1.{partitionResult#dnsSuffix}", [ce]: { [cf]: [{ [cg]: true, [w2]: "sigv4", [ch]: t2, [ci]: "us-east-1" }] }, [cj]: {} }, [bW]: q4 };
var ap = { [cd]: "https://{Bucket}.s3-fips.{Region}.{partitionResult#dnsSuffix}", [ce]: ae, [cj]: {} };
var aq = { [bY]: [Z, ah, al, S, { [bZ]: k4, [ca]: [{ [cb]: "Region" }, "aws-global"] }], [q4]: { [cd]: "https://{Bucket}.s3-accelerate.dualstack.us-east-1.{partitionResult#dnsSuffix}", [ce]: { [cf]: [{ [cg]: true, [w2]: "sigv4", [ch]: t2, [ci]: "us-east-1" }] }, [cj]: {} }, [bW]: q4 };
var ar = { [cd]: "https://{Bucket}.s3-accelerate.dualstack.{partitionResult#dnsSuffix}", [ce]: ae, [cj]: {} };
var as = { [bY]: [Z, ah, aa, S, { [bZ]: k4, [ca]: [{ [cb]: "Region" }, "aws-global"] }], [q4]: { [cd]: "https://{Bucket}.s3.dualstack.us-east-1.{partitionResult#dnsSuffix}", [ce]: { [cf]: [{ [cg]: true, [w2]: "sigv4", [ch]: t2, [ci]: "us-east-1" }] }, [cj]: {} }, [bW]: q4 };
var at = { [cd]: "https://{Bucket}.s3.dualstack.{Region}.{partitionResult#dnsSuffix}", [ce]: ae, [cj]: {} };
var au = { [bY]: [ag, ah, aa, T, U, { [bZ]: r4, [ca]: [{ [bZ]: v2, [ca]: [{ [cb]: "url" }, "isIp"] }, true] }, { [bZ]: k4, [ca]: [{ [cb]: "Region" }, "aws-global"] }], [q4]: { [cd]: "{url#scheme}://{url#authority}{url#normalizedPath}{Bucket}", [ce]: { [cf]: [{ [cg]: true, [w2]: "sigv4", [ch]: t2, [ci]: "us-east-1" }] }, [cj]: {} }, [bW]: q4 };
var av = { [bZ]: r4, [ca]: [{ [bZ]: v2, [ca]: [{ [cb]: "url" }, "isIp"] }, true] };
var aw = { [cb]: "url" };
var ax = { [bY]: [ag, ah, aa, T, U, { [bZ]: r4, [ca]: [{ [bZ]: v2, [ca]: [aw, "isIp"] }, false] }, { [bZ]: k4, [ca]: [{ [cb]: "Region" }, "aws-global"] }], [q4]: { [cd]: "{url#scheme}://{Bucket}.{url#authority}{url#path}", [ce]: { [cf]: [{ [cg]: true, [w2]: "sigv4", [ch]: t2, [ci]: "us-east-1" }] }, [cj]: {} }, [bW]: q4 };
var ay = { [bZ]: r4, [ca]: [{ [bZ]: v2, [ca]: [aw, "isIp"] }, false] };
var az = { [cd]: "{url#scheme}://{url#authority}{url#normalizedPath}{Bucket}", [ce]: ae, [cj]: {} };
var aA = { [cd]: "{url#scheme}://{Bucket}.{url#authority}{url#path}", [ce]: ae, [cj]: {} };
var aB = { [q4]: aA, [bW]: q4 };
var aC = { [bY]: [ag, ah, al, S, { [bZ]: k4, [ca]: [{ [cb]: "Region" }, "aws-global"] }], [q4]: { [cd]: "https://{Bucket}.s3-accelerate.{partitionResult#dnsSuffix}", [ce]: { [cf]: [{ [cg]: true, [w2]: "sigv4", [ch]: t2, [ci]: "us-east-1" }] }, [cj]: {} }, [bW]: q4 };
var aD = { [cd]: "https://{Bucket}.s3-accelerate.{partitionResult#dnsSuffix}", [ce]: ae, [cj]: {} };
var aE = { [bY]: [ag, ah, aa, S, { [bZ]: k4, [ca]: [{ [cb]: "Region" }, "aws-global"] }], [q4]: { [cd]: y2, [ce]: { [cf]: [{ [cg]: true, [w2]: "sigv4", [ch]: t2, [ci]: "us-east-1" }] }, [cj]: {} }, [bW]: q4 };
var aF = { [cd]: "https://{Bucket}.s3.{Region}.{partitionResult#dnsSuffix}", [ce]: ae, [cj]: {} };
var aG = { [n4]: "Invalid region: region was not a valid DNS name.", [bW]: n4 };
var aH = { [cb]: z2 };
var aI = { [cb]: A2 };
var aJ = { [bZ]: v2, [ca]: [aH, "service"] };
var aK = { [cb]: E2 };
var aL = { [bY]: [Z], [n4]: "S3 Object Lambda does not support Dual-stack", [bW]: n4 };
var aM = { [bY]: [al], [n4]: "S3 Object Lambda does not support S3 Accelerate", [bW]: n4 };
var aN = { [bY]: [{ [bZ]: d4, [ca]: [{ [cb]: "DisableAccessPoints" }] }, { [bZ]: r4, [ca]: [{ [cb]: "DisableAccessPoints" }, true] }], [n4]: "Access points are not supported for this operation", [bW]: n4 };
var aO = { [bY]: [{ [bZ]: d4, [ca]: [{ [cb]: "UseArnRegion" }] }, { [bZ]: r4, [ca]: [{ [cb]: "UseArnRegion" }, false] }, { [bZ]: m4, [ca]: [{ [bZ]: k4, [ca]: [{ [bZ]: v2, [ca]: [aH, "region"] }, "{Region}"] }] }], [n4]: "Invalid configuration: region from ARN `{bucketArn#region}` does not match client region `{Region}` and UseArnRegion is `false`", [bW]: n4 };
var aP = { [bZ]: v2, [ca]: [{ [cb]: "bucketPartition" }, w2] };
var aQ = { [bZ]: v2, [ca]: [aH, "accountId"] };
var aR = { [bY]: [ab, { [bZ]: k4, [ca]: [aP, "aws-cn"] }], [n4]: "Partition does not support FIPS", [bW]: n4 };
var aS = { [cf]: [{ [cg]: true, [w2]: "sigv4", [ch]: C2, [ci]: "{bucketArn#region}" }] };
var aT = { [n4]: "Invalid ARN: The access point name may only contain a-z, A-Z, 0-9 and `-`. Found: `{accessPointName}`", [bW]: n4 };
var aU = { [n4]: "Invalid ARN: The account id may only contain a-z, A-Z, 0-9 and `-`. Found: `{bucketArn#accountId}`", [bW]: n4 };
var aV = { [n4]: "Invalid region in ARN: `{bucketArn#region}` (invalid DNS name)", [bW]: n4 };
var aW = { [n4]: "Client was configured for partition `{partitionResult#name}` but ARN (`{Bucket}`) has `{bucketPartition#name}`", [bW]: n4 };
var aX = { [n4]: "Could not load partition for ARN region `{bucketArn#region}`", [bW]: n4 };
var aY = { [n4]: "Invalid ARN: The ARN may only contain a single resource component after `accesspoint`.", [bW]: n4 };
var aZ = { [n4]: "Invalid ARN: bucket ARN is missing a region", [bW]: n4 };
var ba = { [n4]: "Invalid ARN: Expected a resource of the format `accesspoint:<accesspoint name>` but no name was provided", [bW]: n4 };
var bb = { [cf]: [{ [cg]: true, [w2]: "sigv4", [ch]: t2, [ci]: "{bucketArn#region}" }] };
var bc = { [cf]: [{ [cg]: true, [w2]: "sigv4", [ch]: p4, [ci]: "{bucketArn#region}" }] };
var bd = { [cb]: "UseObjectLambdaEndpoint" };
var be = { [cf]: [{ [cg]: true, [w2]: "sigv4", [ch]: C2, [ci]: "{Region}" }] };
var bf = { [bY]: [ab, Z, T, U, { [bZ]: k4, [ca]: [{ [cb]: "Region" }, "aws-global"] }], [q4]: { [cd]: J2, [ce]: { [cf]: [{ [cg]: true, [w2]: "sigv4", [ch]: t2, [ci]: "us-east-1" }] }, [cj]: {} }, [bW]: q4 };
var bg = { [q4]: { [cd]: J2, [ce]: ae, [cj]: {} }, [bW]: q4 };
var bh = { [cd]: J2, [ce]: ae, [cj]: {} };
var bi = { [bY]: [ab, Z, S, { [bZ]: k4, [ca]: [{ [cb]: "Region" }, "aws-global"] }], [q4]: { [cd]: "https://s3-fips.dualstack.us-east-1.{partitionResult#dnsSuffix}", [ce]: { [cf]: [{ [cg]: true, [w2]: "sigv4", [ch]: t2, [ci]: "us-east-1" }] }, [cj]: {} }, [bW]: q4 };
var bj = { [cd]: "https://s3-fips.dualstack.{Region}.{partitionResult#dnsSuffix}", [ce]: ae, [cj]: {} };
var bk = { [bY]: [ab, ag, T, U, { [bZ]: k4, [ca]: [{ [cb]: "Region" }, "aws-global"] }], [q4]: { [cd]: J2, [ce]: { [cf]: [{ [cg]: true, [w2]: "sigv4", [ch]: t2, [ci]: "us-east-1" }] }, [cj]: {} }, [bW]: q4 };
var bl = { [bY]: [ab, ag, S, { [bZ]: k4, [ca]: [{ [cb]: "Region" }, "aws-global"] }], [q4]: { [cd]: "https://s3-fips.us-east-1.{partitionResult#dnsSuffix}", [ce]: { [cf]: [{ [cg]: true, [w2]: "sigv4", [ch]: t2, [ci]: "us-east-1" }] }, [cj]: {} }, [bW]: q4 };
var bm = { [cd]: "https://s3-fips.{Region}.{partitionResult#dnsSuffix}", [ce]: ae, [cj]: {} };
var bn = { [bY]: [ah, Z, T, U, { [bZ]: k4, [ca]: [{ [cb]: "Region" }, "aws-global"] }], [q4]: { [cd]: J2, [ce]: { [cf]: [{ [cg]: true, [w2]: "sigv4", [ch]: t2, [ci]: "us-east-1" }] }, [cj]: {} }, [bW]: q4 };
var bo = { [bY]: [ah, Z, S, { [bZ]: k4, [ca]: [{ [cb]: "Region" }, "aws-global"] }], [q4]: { [cd]: "https://s3.dualstack.us-east-1.{partitionResult#dnsSuffix}", [ce]: { [cf]: [{ [cg]: true, [w2]: "sigv4", [ch]: t2, [ci]: "us-east-1" }] }, [cj]: {} }, [bW]: q4 };
var bp = { [cd]: "https://s3.dualstack.{Region}.{partitionResult#dnsSuffix}", [ce]: ae, [cj]: {} };
var bq = { [bY]: [ah, ag, T, U, { [bZ]: k4, [ca]: [{ [cb]: "Region" }, "aws-global"] }], [q4]: { [cd]: J2, [ce]: { [cf]: [{ [cg]: true, [w2]: "sigv4", [ch]: t2, [ci]: "us-east-1" }] }, [cj]: {} }, [bW]: q4 };
var br = { [bY]: [ah, ag, S, { [bZ]: k4, [ca]: [{ [cb]: "Region" }, "aws-global"] }], [q4]: { [cd]: K, [ce]: { [cf]: [{ [cg]: true, [w2]: "sigv4", [ch]: t2, [ci]: "us-east-1" }] }, [cj]: {} }, [bW]: q4 };
var bs = { [cd]: "https://s3.{Region}.{partitionResult#dnsSuffix}", [ce]: ae, [cj]: {} };
var bt = [{ [cb]: "Region" }];
var bu = [P];
var bv = [{ [bZ]: l4, [ca]: [{ [cb]: i4 }, false] }];
var bw = [{ [bZ]: k4, [ca]: [{ [cb]: g4 }, "beta"] }];
var bx = [{ [cb]: "Endpoint" }];
var by = [T, U];
var bz = [O];
var bA = [{ [bZ]: s4, [ca]: [P] }];
var bB = [Z, T];
var bC = [{ [bZ]: j4, [ca]: bt, [cc]: "partitionResult" }];
var bD = [{ [bZ]: k4, [ca]: [{ [cb]: "Region" }, "us-east-1"] }];
var bE = [{ [bZ]: l4, [ca]: [{ [cb]: "Region" }, false] }];
var bF = [{ [bZ]: k4, [ca]: [aI, D2] }];
var bG = [{ [bZ]: v2, [ca]: [aH, "resourceId[1]"], [cc]: E2 }, { [bZ]: m4, [ca]: [{ [bZ]: k4, [ca]: [aK, B2] }] }];
var bH = [aH, "resourceId[1]"];
var bI = [Z];
var bJ = [al];
var bK = [{ [bZ]: m4, [ca]: [{ [bZ]: k4, [ca]: [{ [bZ]: v2, [ca]: [aH, "region"] }, B2] }] }];
var bL = [{ [bZ]: m4, [ca]: [{ [bZ]: d4, [ca]: [{ [bZ]: v2, [ca]: [aH, "resourceId[2]"] }] }] }];
var bM = [aH, "resourceId[2]"];
var bN = [{ [bZ]: j4, [ca]: [{ [bZ]: v2, [ca]: [aH, "region"] }], [cc]: "bucketPartition" }];
var bO = [{ [bZ]: k4, [ca]: [aP, { [bZ]: v2, [ca]: [{ [cb]: "partitionResult" }, w2] }] }];
var bP = [{ [bZ]: l4, [ca]: [{ [bZ]: v2, [ca]: [aH, "region"] }, true] }];
var bQ = [{ [bZ]: l4, [ca]: [aQ, false] }];
var bR = [{ [bZ]: l4, [ca]: [aK, false] }];
var bS = [ab];
var bT = [{ [bZ]: l4, [ca]: [{ [cb]: "Region" }, true] }];
var bU = [bg];
var _data4 = { version: "1.0", parameters: { Bucket: L, Region: L, UseFIPS: M, UseDualStack: M, Endpoint: L, ForcePathStyle: N, Accelerate: M, UseGlobalEndpoint: M, UseObjectLambdaEndpoint: N, DisableAccessPoints: N, DisableMultiRegionAccessPoints: M, UseArnRegion: N }, [bX]: [{ [bW]: c4, [bX]: [{ [bY]: [{ [bZ]: d4, [ca]: bt }], [bW]: c4, [bX]: [{ [bW]: c4, [bX]: [{ [bY]: [O, { [bZ]: e4, [ca]: [P, 49, 50, b4], [cc]: f4 }, { [bZ]: e4, [ca]: [P, 8, 12, b4], [cc]: g4 }, { [bZ]: e4, [ca]: [P, 0, 7, b4], [cc]: h4 }, { [bZ]: e4, [ca]: [P, 32, 49, b4], [cc]: i4 }, { [bZ]: j4, [ca]: bt, [cc]: "regionPartition" }, { [bZ]: k4, [ca]: [{ [cb]: h4 }, "--op-s3"] }], [bW]: c4, [bX]: [{ [bY]: bv, [bW]: c4, [bX]: [{ [bW]: c4, [bX]: [{ [bY]: [{ [bZ]: k4, [ca]: [Q, "e"] }], [bW]: c4, [bX]: [{ [bY]: bw, [bW]: c4, [bX]: [R, { [bY]: by, endpoint: { [cd]: "https://{Bucket}.ec2.{url#authority}", [ce]: V, [cj]: W }, [bW]: q4 }] }, { endpoint: { [cd]: "https://{Bucket}.ec2.s3-outposts.{Region}.{regionPartition#dnsSuffix}", [ce]: V, [cj]: W }, [bW]: q4 }] }, { [bY]: [{ [bZ]: k4, [ca]: [Q, "o"] }], [bW]: c4, [bX]: [{ [bY]: bw, [bW]: c4, [bX]: [R, { [bY]: by, endpoint: { [cd]: "https://{Bucket}.op-{outpostId}.{url#authority}", [ce]: V, [cj]: W }, [bW]: q4 }] }, { endpoint: { [cd]: "https://{Bucket}.op-{outpostId}.s3-outposts.{Region}.{regionPartition#dnsSuffix}", [ce]: V, [cj]: W }, [bW]: q4 }] }, { error: 'Unrecognized hardware type: "Expected hardware type o or e but got {hardwareType}"', [bW]: n4 }] }] }, { error: "Invalid ARN: The outpost Id must only contain a-z, A-Z, 0-9 and `-`.", [bW]: n4 }] }, { [bY]: bz, [bW]: c4, [bX]: [{ [bY]: [T, { [bZ]: m4, [ca]: [{ [bZ]: d4, [ca]: [{ [bZ]: o4, [ca]: bx }] }] }], error: "Custom endpoint `{Endpoint}` was not a valid URI", [bW]: n4 }, { [bW]: c4, [bX]: [{ [bY]: [{ [bZ]: d4, [ca]: [X] }, { [bZ]: r4, [ca]: [X, b4] }], [bW]: c4, [bX]: [{ [bW]: c4, [bX]: [{ [bY]: bA, error: "Path-style addressing cannot be used with ARN buckets", [bW]: n4 }, Y] }] }, { [bY]: [{ [bZ]: u2, [ca]: [P, a4] }], [bW]: c4, [bX]: [{ [bY]: bC, [bW]: c4, [bX]: [{ [bW]: c4, [bX]: [{ [bY]: bE, [bW]: c4, [bX]: [{ [bW]: c4, [bX]: [aj, { [bW]: c4, [bX]: [{ [bY]: [al, ab], error: "Accelerate cannot be used with FIPS", [bW]: n4 }, { [bW]: c4, [bX]: [{ [bY]: [al, ak], error: "S3 Accelerate cannot be used in this region", [bW]: n4 }, { [bW]: c4, [bX]: [{ [bY]: [T, Z], error: x2, [bW]: n4 }, { [bW]: c4, [bX]: [{ [bY]: [T, ab], error: x2, [bW]: n4 }, { [bW]: c4, [bX]: [{ [bY]: [T, al], error: x2, [bW]: n4 }, { [bW]: c4, [bX]: [am, am, { [bY]: [Z, ab, aa, S, ac, ad], [bW]: c4, [bX]: [{ endpoint: an, [bW]: q4 }] }, { [bY]: [Z, ab, aa, S, ac, af], endpoint: an, [bW]: q4 }, ao, ao, { [bY]: [ag, ab, aa, S, ac, ad], [bW]: c4, [bX]: [{ endpoint: ap, [bW]: q4 }] }, { [bY]: [ag, ab, aa, S, ac, af], endpoint: ap, [bW]: q4 }, aq, aq, { [bY]: [Z, ah, al, S, ac, ad], [bW]: c4, [bX]: [{ endpoint: ar, [bW]: q4 }] }, { [bY]: [Z, ah, al, S, ac, af], endpoint: ar, [bW]: q4 }, as, as, { [bY]: [Z, ah, aa, S, ac, ad], [bW]: c4, [bX]: [{ endpoint: at, [bW]: q4 }] }, { [bY]: [Z, ah, aa, S, ac, af], endpoint: at, [bW]: q4 }, au, ax, au, ax, { [bY]: [ag, ah, aa, T, U, av, ac, ad], [bW]: c4, [bX]: [{ [bY]: bD, endpoint: az, [bW]: q4 }, { endpoint: az, [bW]: q4 }] }, { [bY]: [ag, ah, aa, T, U, ay, ac, ad], [bW]: c4, [bX]: [{ [bY]: bD, endpoint: aA, [bW]: q4 }, aB] }, { [bY]: [ag, ah, aa, T, U, av, ac, af], endpoint: az, [bW]: q4 }, { [bY]: [ag, ah, aa, T, U, ay, ac, af], endpoint: aA, [bW]: q4 }, aC, aC, { [bY]: [ag, ah, al, S, ac, ad], [bW]: c4, [bX]: [{ [bY]: bD, endpoint: aD, [bW]: q4 }, { endpoint: aD, [bW]: q4 }] }, { [bY]: [ag, ah, al, S, ac, af], endpoint: aD, [bW]: q4 }, aE, aE, { [bY]: [ag, ah, aa, S, ac, ad], [bW]: c4, [bX]: [{ [bY]: bD, endpoint: { [cd]: y2, [ce]: ae, [cj]: W }, [bW]: q4 }, { endpoint: aF, [bW]: q4 }] }, { [bY]: [ag, ah, aa, S, ac, af], endpoint: aF, [bW]: q4 }] }] }] }] }] }] }] }] }, aG] }] }, ai] }, { [bY]: [T, U, { [bZ]: k4, [ca]: [{ [bZ]: v2, [ca]: [aw, "scheme"] }, "http"] }, { [bZ]: u2, [ca]: [P, b4] }, ah, ag, aa], [bW]: c4, [bX]: [{ [bY]: bC, [bW]: c4, [bX]: [{ [bW]: c4, [bX]: [{ [bY]: bE, [bW]: c4, [bX]: [aB] }, aG] }] }, ai] }, { [bY]: [{ [bZ]: s4, [ca]: bu, [cc]: z2 }], [bW]: c4, [bX]: [{ [bY]: [{ [bZ]: v2, [ca]: [aH, "resourceId[0]"], [cc]: A2 }, { [bZ]: m4, [ca]: [{ [bZ]: k4, [ca]: [aI, B2] }] }], [bW]: c4, [bX]: [{ [bW]: c4, [bX]: [{ [bY]: [{ [bZ]: k4, [ca]: [aJ, C2] }], [bW]: c4, [bX]: [{ [bY]: bF, [bW]: c4, [bX]: [{ [bW]: c4, [bX]: [{ [bY]: bG, [bW]: c4, [bX]: [{ [bW]: c4, [bX]: [aL, { [bW]: c4, [bX]: [aM, { [bW]: c4, [bX]: [{ [bY]: bK, [bW]: c4, [bX]: [{ [bW]: c4, [bX]: [aN, { [bW]: c4, [bX]: [{ [bY]: bL, [bW]: c4, [bX]: [{ [bW]: c4, [bX]: [aO, { [bW]: c4, [bX]: [{ [bY]: bN, [bW]: c4, [bX]: [{ [bW]: c4, [bX]: [{ [bY]: bC, [bW]: c4, [bX]: [{ [bW]: c4, [bX]: [{ [bY]: bO, [bW]: c4, [bX]: [{ [bW]: c4, [bX]: [{ [bY]: bP, [bW]: c4, [bX]: [{ [bW]: c4, [bX]: [{ [bY]: [{ [bZ]: k4, [ca]: [aQ, B2] }], error: "Invalid ARN: Missing account id", [bW]: n4 }, { [bW]: c4, [bX]: [{ [bY]: bQ, [bW]: c4, [bX]: [{ [bW]: c4, [bX]: [{ [bY]: bR, [bW]: c4, [bX]: [{ [bW]: c4, [bX]: [aR, { [bW]: c4, [bX]: [{ [bY]: by, endpoint: { [cd]: F2, [ce]: aS, [cj]: W }, [bW]: q4 }, { [bY]: bS, endpoint: { [cd]: "https://{accessPointName}-{bucketArn#accountId}.s3-object-lambda-fips.{bucketArn#region}.{bucketPartition#dnsSuffix}", [ce]: aS, [cj]: W }, [bW]: q4 }, { endpoint: { [cd]: "https://{accessPointName}-{bucketArn#accountId}.s3-object-lambda.{bucketArn#region}.{bucketPartition#dnsSuffix}", [ce]: aS, [cj]: W }, [bW]: q4 }] }] }] }, aT] }] }, aU] }] }] }, aV] }] }, aW] }] }, ai] }] }, aX] }] }] }, aY] }] }] }, aZ] }] }] }] }, ba] }] }, { error: "Invalid ARN: Object Lambda ARNs only support `accesspoint` arn types, but found: `{arnType}`", [bW]: n4 }] }, { [bY]: bF, [bW]: c4, [bX]: [{ [bY]: bG, [bW]: c4, [bX]: [{ [bW]: c4, [bX]: [{ [bY]: bK, [bW]: c4, [bX]: [{ [bY]: bF, [bW]: c4, [bX]: [{ [bY]: bK, [bW]: c4, [bX]: [{ [bW]: c4, [bX]: [aN, { [bW]: c4, [bX]: [{ [bY]: bL, [bW]: c4, [bX]: [{ [bW]: c4, [bX]: [aO, { [bW]: c4, [bX]: [{ [bY]: bN, [bW]: c4, [bX]: [{ [bW]: c4, [bX]: [{ [bY]: bC, [bW]: c4, [bX]: [{ [bW]: c4, [bX]: [{ [bY]: [{ [bZ]: k4, [ca]: [aP, "{partitionResult#name}"] }], [bW]: c4, [bX]: [{ [bW]: c4, [bX]: [{ [bY]: bP, [bW]: c4, [bX]: [{ [bW]: c4, [bX]: [{ [bY]: [{ [bZ]: k4, [ca]: [aJ, t2] }], [bW]: c4, [bX]: [{ [bW]: c4, [bX]: [{ [bY]: bQ, [bW]: c4, [bX]: [{ [bW]: c4, [bX]: [{ [bY]: bR, [bW]: c4, [bX]: [{ [bW]: c4, [bX]: [{ [bY]: bJ, error: "Access Points do not support S3 Accelerate", [bW]: n4 }, { [bW]: c4, [bX]: [aR, { [bW]: c4, [bX]: [{ [bY]: bB, error: "DualStack cannot be combined with a Host override (PrivateLink)", [bW]: n4 }, { [bW]: c4, [bX]: [{ [bY]: [ab, Z], endpoint: { [cd]: "https://{accessPointName}-{bucketArn#accountId}.s3-accesspoint-fips.dualstack.{bucketArn#region}.{bucketPartition#dnsSuffix}", [ce]: bb, [cj]: W }, [bW]: q4 }, { [bY]: [ab, ag], endpoint: { [cd]: "https://{accessPointName}-{bucketArn#accountId}.s3-accesspoint-fips.{bucketArn#region}.{bucketPartition#dnsSuffix}", [ce]: bb, [cj]: W }, [bW]: q4 }, { [bY]: [ah, Z], endpoint: { [cd]: "https://{accessPointName}-{bucketArn#accountId}.s3-accesspoint.dualstack.{bucketArn#region}.{bucketPartition#dnsSuffix}", [ce]: bb, [cj]: W }, [bW]: q4 }, { [bY]: [ah, ag, T, U], endpoint: { [cd]: F2, [ce]: bb, [cj]: W }, [bW]: q4 }, { [bY]: [ah, ag], endpoint: { [cd]: "https://{accessPointName}-{bucketArn#accountId}.s3-accesspoint.{bucketArn#region}.{bucketPartition#dnsSuffix}", [ce]: bb, [cj]: W }, [bW]: q4 }] }] }] }] }] }, aT] }] }, aU] }] }, { error: "Invalid ARN: The ARN was not for the S3 service, found: {bucketArn#service}", [bW]: n4 }] }] }, aV] }] }, aW] }] }, ai] }] }, aX] }] }] }, aY] }] }] }, aZ] }] }, { [bW]: c4, [bX]: [{ [bY]: [{ [bZ]: l4, [ca]: [aK, b4] }], [bW]: c4, [bX]: [{ [bW]: c4, [bX]: [{ [bY]: bI, error: "S3 MRAP does not support dual-stack", [bW]: n4 }, { [bW]: c4, [bX]: [{ [bY]: bS, error: "S3 MRAP does not support FIPS", [bW]: n4 }, { [bW]: c4, [bX]: [{ [bY]: bJ, error: "S3 MRAP does not support S3 Accelerate", [bW]: n4 }, { [bW]: c4, [bX]: [{ [bY]: [{ [bZ]: r4, [ca]: [{ [cb]: "DisableMultiRegionAccessPoints" }, b4] }], error: "Invalid configuration: Multi-Region Access Point ARNs are disabled.", [bW]: n4 }, { [bW]: c4, [bX]: [{ [bY]: [{ [bZ]: j4, [ca]: bt, [cc]: G2 }], [bW]: c4, [bX]: [{ [bW]: c4, [bX]: [{ [bY]: [{ [bZ]: k4, [ca]: [{ [bZ]: v2, [ca]: [{ [cb]: G2 }, w2] }, { [bZ]: v2, [ca]: [aH, "partition"] }] }], [bW]: c4, [bX]: [{ endpoint: { [cd]: "https://{accessPointName}.accesspoint.s3-global.{mrapPartition#dnsSuffix}", [ce]: { [cf]: [{ [cg]: b4, name: "sigv4a", [ch]: t2, signingRegionSet: ["*"] }] }, [cj]: W }, [bW]: q4 }] }, { error: "Client was configured for partition `{mrapPartition#name}` but bucket referred to partition `{bucketArn#partition}`", [bW]: n4 }] }] }, { error: "{Region} was not a valid region", [bW]: n4 }] }] }] }] }] }] }, { error: "Invalid Access Point Name", [bW]: n4 }] }] }] }, ba] }, { [bY]: [{ [bZ]: k4, [ca]: [aJ, p4] }], [bW]: c4, [bX]: [{ [bY]: bI, error: "S3 Outposts does not support Dual-stack", [bW]: n4 }, { [bW]: c4, [bX]: [{ [bY]: bS, error: "S3 Outposts does not support FIPS", [bW]: n4 }, { [bW]: c4, [bX]: [{ [bY]: bJ, error: "S3 Outposts does not support S3 Accelerate", [bW]: n4 }, { [bW]: c4, [bX]: [{ [bY]: [{ [bZ]: d4, [ca]: [{ [bZ]: v2, [ca]: [aH, "resourceId[4]"] }] }], error: "Invalid Arn: Outpost Access Point ARN contains sub resources", [bW]: n4 }, { [bW]: c4, [bX]: [{ [bY]: [{ [bZ]: v2, [ca]: bH, [cc]: i4 }], [bW]: c4, [bX]: [{ [bW]: c4, [bX]: [{ [bY]: bv, [bW]: c4, [bX]: [{ [bW]: c4, [bX]: [aO, { [bW]: c4, [bX]: [{ [bY]: bN, [bW]: c4, [bX]: [{ [bW]: c4, [bX]: [{ [bY]: bC, [bW]: c4, [bX]: [{ [bW]: c4, [bX]: [{ [bY]: bO, [bW]: c4, [bX]: [{ [bW]: c4, [bX]: [{ [bY]: bP, [bW]: c4, [bX]: [{ [bW]: c4, [bX]: [{ [bY]: bQ, [bW]: c4, [bX]: [{ [bW]: c4, [bX]: [{ [bY]: [{ [bZ]: v2, [ca]: bM, [cc]: H2 }], [bW]: c4, [bX]: [{ [bW]: c4, [bX]: [{ [bY]: [{ [bZ]: v2, [ca]: [aH, "resourceId[3]"], [cc]: E2 }], [bW]: c4, [bX]: [{ [bW]: c4, [bX]: [{ [bY]: [{ [bZ]: k4, [ca]: [{ [cb]: H2 }, D2] }], [bW]: c4, [bX]: [{ [bW]: c4, [bX]: [{ [bY]: by, endpoint: { [cd]: "https://{accessPointName}-{bucketArn#accountId}.{outpostId}.{url#authority}", [ce]: bc, [cj]: W }, [bW]: q4 }, { endpoint: { [cd]: "https://{accessPointName}-{bucketArn#accountId}.{outpostId}.s3-outposts.{bucketArn#region}.{bucketPartition#dnsSuffix}", [ce]: bc, [cj]: W }, [bW]: q4 }] }] }, { error: "Expected an outpost type `accesspoint`, found {outpostType}", [bW]: n4 }] }] }, { error: "Invalid ARN: expected an access point name", [bW]: n4 }] }] }, { error: "Invalid ARN: Expected a 4-component resource", [bW]: n4 }] }] }, aU] }] }, aV] }] }, aW] }] }, ai] }] }, { error: "Could not load partition for ARN region {bucketArn#region}", [bW]: n4 }] }] }] }, { error: "Invalid ARN: The outpost Id may only contain a-z, A-Z, 0-9 and `-`. Found: `{outpostId}`", [bW]: n4 }] }] }, { error: "Invalid ARN: The Outpost Id was not set", [bW]: n4 }] }] }] }] }] }, { error: "Invalid ARN: Unrecognized format: {Bucket} (type: {arnType})", [bW]: n4 }] }] }, { error: "Invalid ARN: No ARN type specified", [bW]: n4 }] }, { [bY]: [{ [bZ]: e4, [ca]: [P, 0, 4, a4], [cc]: I2 }, { [bZ]: k4, [ca]: [{ [cb]: I2 }, "arn:"] }, { [bZ]: m4, [ca]: [{ [bZ]: d4, [ca]: bA }] }], error: "Invalid ARN: `{Bucket}` was not a valid ARN", [bW]: n4 }, Y] }] }, { [bY]: [{ [bZ]: d4, [ca]: [bd] }, { [bZ]: r4, [ca]: [bd, b4] }], [bW]: c4, [bX]: [{ [bY]: bC, [bW]: c4, [bX]: [{ [bW]: c4, [bX]: [{ [bY]: bT, [bW]: c4, [bX]: [{ [bW]: c4, [bX]: [aL, { [bW]: c4, [bX]: [aM, { [bW]: c4, [bX]: [aj, { [bW]: c4, [bX]: [{ [bY]: by, endpoint: { [cd]: J2, [ce]: be, [cj]: W }, [bW]: q4 }, { [bY]: bS, endpoint: { [cd]: "https://s3-object-lambda-fips.{Region}.{partitionResult#dnsSuffix}", [ce]: be, [cj]: W }, [bW]: q4 }, { endpoint: { [cd]: "https://s3-object-lambda.{Region}.{partitionResult#dnsSuffix}", [ce]: be, [cj]: W }, [bW]: q4 }] }] }] }] }] }, aG] }] }, ai] }, { [bY]: [{ [bZ]: m4, [ca]: bz }], [bW]: c4, [bX]: [{ [bY]: bC, [bW]: c4, [bX]: [{ [bW]: c4, [bX]: [{ [bY]: bT, [bW]: c4, [bX]: [{ [bW]: c4, [bX]: [aj, { [bW]: c4, [bX]: [bf, bf, { [bY]: [ab, Z, T, U, ac, ad], [bW]: c4, [bX]: bU }, { [bY]: [ab, Z, T, U, ac, af], endpoint: bh, [bW]: q4 }, bi, bi, { [bY]: [ab, Z, S, ac, ad], [bW]: c4, [bX]: [{ endpoint: bj, [bW]: q4 }] }, { [bY]: [ab, Z, S, ac, af], endpoint: bj, [bW]: q4 }, bk, bk, { [bY]: [ab, ag, T, U, ac, ad], [bW]: c4, [bX]: bU }, { [bY]: [ab, ag, T, U, ac, af], endpoint: bh, [bW]: q4 }, bl, bl, { [bY]: [ab, ag, S, ac, ad], [bW]: c4, [bX]: [{ endpoint: bm, [bW]: q4 }] }, { [bY]: [ab, ag, S, ac, af], endpoint: bm, [bW]: q4 }, bn, bn, { [bY]: [ah, Z, T, U, ac, ad], [bW]: c4, [bX]: bU }, { [bY]: [ah, Z, T, U, ac, af], endpoint: bh, [bW]: q4 }, bo, bo, { [bY]: [ah, Z, S, ac, ad], [bW]: c4, [bX]: [{ endpoint: bp, [bW]: q4 }] }, { [bY]: [ah, Z, S, ac, af], endpoint: bp, [bW]: q4 }, bq, bq, { [bY]: [ah, ag, T, U, ac, ad], [bW]: c4, [bX]: [{ [bY]: bD, endpoint: bh, [bW]: q4 }, bg] }, { [bY]: [ah, ag, T, U, ac, af], endpoint: bh, [bW]: q4 }, br, br, { [bY]: [ah, ag, S, ac, ad], [bW]: c4, [bX]: [{ [bY]: bD, endpoint: { [cd]: K, [ce]: ae, [cj]: W }, [bW]: q4 }, { endpoint: bs, [bW]: q4 }] }, { [bY]: [ah, ag, S, ac, af], endpoint: bs, [bW]: q4 }] }] }] }, aG] }] }, ai] }] }] }, { error: "A region must be set when sending requests to S3.", [bW]: n4 }] }] };
var ruleSet4 = _data4;
var defaultEndpointResolver4 = (endpointParams, context = {}) => {
  return resolveEndpoint(ruleSet4, {
    endpointParams,
    logger: context.logger
  });
};
var getRuntimeConfig7 = (config) => ({
  apiVersion: "2006-03-01",
  base64Decoder: (config == null ? void 0 : config.base64Decoder) ?? fromBase64,
  base64Encoder: (config == null ? void 0 : config.base64Encoder) ?? toBase64,
  disableHostPrefix: (config == null ? void 0 : config.disableHostPrefix) ?? false,
  endpointProvider: (config == null ? void 0 : config.endpointProvider) ?? defaultEndpointResolver4,
  getAwsChunkedEncodingStream: (config == null ? void 0 : config.getAwsChunkedEncodingStream) ?? getAwsChunkedEncodingStream,
  logger: (config == null ? void 0 : config.logger) ?? new NoOpLogger(),
  sdkStreamMixin: (config == null ? void 0 : config.sdkStreamMixin) ?? sdkStreamMixin,
  serviceId: (config == null ? void 0 : config.serviceId) ?? "S3",
  signerConstructor: (config == null ? void 0 : config.signerConstructor) ?? SignatureV4MultiRegion,
  signingEscapePath: (config == null ? void 0 : config.signingEscapePath) ?? false,
  urlParser: (config == null ? void 0 : config.urlParser) ?? parseUrl,
  useArnRegion: (config == null ? void 0 : config.useArnRegion) ?? false,
  utf8Decoder: (config == null ? void 0 : config.utf8Decoder) ?? fromUtf84,
  utf8Encoder: (config == null ? void 0 : config.utf8Encoder) ?? toUtf84
});
var getRuntimeConfig8 = (config) => {
  emitWarningIfUnsupportedVersion(process.version);
  const defaultsMode = resolveDefaultsModeConfig(config);
  const defaultConfigProvider = () => defaultsMode().then(loadConfigsForDefaultMode);
  const clientSharedValues = getRuntimeConfig7(config);
  return {
    ...clientSharedValues,
    ...config,
    runtime: "node",
    defaultsMode,
    bodyLengthChecker: (config == null ? void 0 : config.bodyLengthChecker) ?? calculateBodyLength,
    credentialDefaultProvider: (config == null ? void 0 : config.credentialDefaultProvider) ?? decorateDefaultCredentialProvider2(defaultProvider),
    defaultUserAgentProvider: (config == null ? void 0 : config.defaultUserAgentProvider) ?? defaultUserAgent({ serviceId: clientSharedValues.serviceId, clientVersion: package_default.version }),
    eventStreamSerdeProvider: (config == null ? void 0 : config.eventStreamSerdeProvider) ?? eventStreamSerdeProvider,
    maxAttempts: (config == null ? void 0 : config.maxAttempts) ?? loadConfig(NODE_MAX_ATTEMPT_CONFIG_OPTIONS),
    md5: (config == null ? void 0 : config.md5) ?? Hash.bind(null, "md5"),
    region: (config == null ? void 0 : config.region) ?? loadConfig(NODE_REGION_CONFIG_OPTIONS, NODE_REGION_CONFIG_FILE_OPTIONS),
    requestHandler: (config == null ? void 0 : config.requestHandler) ?? new NodeHttpHandler(defaultConfigProvider),
    retryMode: (config == null ? void 0 : config.retryMode) ?? loadConfig({
      ...NODE_RETRY_MODE_CONFIG_OPTIONS,
      default: async () => (await defaultConfigProvider()).retryMode || DEFAULT_RETRY_MODE
    }),
    sha1: (config == null ? void 0 : config.sha1) ?? Hash.bind(null, "sha1"),
    sha256: (config == null ? void 0 : config.sha256) ?? Hash.bind(null, "sha256"),
    streamCollector: (config == null ? void 0 : config.streamCollector) ?? streamCollector,
    streamHasher: (config == null ? void 0 : config.streamHasher) ?? readableStreamHasher,
    useArnRegion: (config == null ? void 0 : config.useArnRegion) ?? loadConfig(NODE_USE_ARN_REGION_CONFIG_OPTIONS),
    useDualstackEndpoint: (config == null ? void 0 : config.useDualstackEndpoint) ?? loadConfig(NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS),
    useFipsEndpoint: (config == null ? void 0 : config.useFipsEndpoint) ?? loadConfig(NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS)
  };
};
var S3Client = class extends Client {
  constructor(configuration) {
    const _config_0 = getRuntimeConfig8(configuration);
    const _config_1 = resolveClientEndpointParameters(_config_0);
    const _config_2 = resolveRegionConfig(_config_1);
    const _config_3 = resolveEndpointConfig(_config_2);
    const _config_4 = resolveRetryConfig(_config_3);
    const _config_5 = resolveHostHeaderConfig(_config_4);
    const _config_6 = resolveAwsAuthConfig(_config_5);
    const _config_7 = resolveS3Config(_config_6);
    const _config_8 = resolveUserAgentConfig(_config_7);
    const _config_9 = resolveEventStreamSerdeConfig(_config_8);
    super(_config_9);
    this.config = _config_9;
    this.middlewareStack.use(getRetryPlugin(this.config));
    this.middlewareStack.use(getContentLengthPlugin(this.config));
    this.middlewareStack.use(getHostHeaderPlugin(this.config));
    this.middlewareStack.use(getLoggerPlugin(this.config));
    this.middlewareStack.use(getRecursionDetectionPlugin(this.config));
    this.middlewareStack.use(getAwsAuthPlugin(this.config));
    this.middlewareStack.use(getValidateBucketNamePlugin(this.config));
    this.middlewareStack.use(getAddExpectContinuePlugin(this.config));
    this.middlewareStack.use(getUserAgentPlugin(this.config));
  }
  destroy() {
    super.destroy();
  }
};
function escapeAttribute(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function escapeElement(value) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\r/g, "&#x0D;").replace(/\n/g, "&#x0A;").replace(/\u0085/g, "&#x85;").replace(/\u2028/, "&#x2028;");
}
var XmlText = class {
  constructor(value) {
    this.value = value;
  }
  toString() {
    return escapeElement("" + this.value);
  }
};
var XmlNode = class _XmlNode {
  static of(name, childText, withName) {
    const node = new _XmlNode(name);
    if (childText !== void 0) {
      node.addChildNode(new XmlText(childText));
    }
    if (withName !== void 0) {
      node.withName(withName);
    }
    return node;
  }
  constructor(name, children = []) {
    this.name = name;
    this.children = children;
    this.attributes = {};
  }
  withName(name) {
    this.name = name;
    return this;
  }
  addAttribute(name, value) {
    this.attributes[name] = value;
    return this;
  }
  addChildNode(child) {
    this.children.push(child);
    return this;
  }
  removeAttribute(name) {
    delete this.attributes[name];
    return this;
  }
  toString() {
    const hasChildren = Boolean(this.children.length);
    let xmlText = `<${this.name}`;
    const attributes = this.attributes;
    for (const attributeName of Object.keys(attributes)) {
      const attribute = attributes[attributeName];
      if (typeof attribute !== "undefined" && attribute !== null) {
        xmlText += ` ${attributeName}="${escapeAttribute("" + attribute)}"`;
      }
    }
    return xmlText += !hasChildren ? "/>" : `>${this.children.map((c5) => c5.toString()).join("")}</${this.name}>`;
  }
};
var import_fast_xml_parser2 = __toESM(require_fxp());
var S3ServiceException = class _S3ServiceException extends ServiceException {
  constructor(options) {
    super(options);
    Object.setPrototypeOf(this, _S3ServiceException.prototype);
  }
};
var AnalyticsFilter;
(function(AnalyticsFilter2) {
  AnalyticsFilter2.visit = (value, visitor) => {
    if (value.Prefix !== void 0)
      return visitor.Prefix(value.Prefix);
    if (value.Tag !== void 0)
      return visitor.Tag(value.Tag);
    if (value.And !== void 0)
      return visitor.And(value.And);
    return visitor._(value.$unknown[0], value.$unknown[1]);
  };
})(AnalyticsFilter || (AnalyticsFilter = {}));
var LifecycleRuleFilter;
(function(LifecycleRuleFilter2) {
  LifecycleRuleFilter2.visit = (value, visitor) => {
    if (value.Prefix !== void 0)
      return visitor.Prefix(value.Prefix);
    if (value.Tag !== void 0)
      return visitor.Tag(value.Tag);
    if (value.ObjectSizeGreaterThan !== void 0)
      return visitor.ObjectSizeGreaterThan(value.ObjectSizeGreaterThan);
    if (value.ObjectSizeLessThan !== void 0)
      return visitor.ObjectSizeLessThan(value.ObjectSizeLessThan);
    if (value.And !== void 0)
      return visitor.And(value.And);
    return visitor._(value.$unknown[0], value.$unknown[1]);
  };
})(LifecycleRuleFilter || (LifecycleRuleFilter = {}));
var MetricsFilter;
(function(MetricsFilter2) {
  MetricsFilter2.visit = (value, visitor) => {
    if (value.Prefix !== void 0)
      return visitor.Prefix(value.Prefix);
    if (value.Tag !== void 0)
      return visitor.Tag(value.Tag);
    if (value.AccessPointArn !== void 0)
      return visitor.AccessPointArn(value.AccessPointArn);
    if (value.And !== void 0)
      return visitor.And(value.And);
    return visitor._(value.$unknown[0], value.$unknown[1]);
  };
})(MetricsFilter || (MetricsFilter = {}));
var ReplicationRuleFilter;
(function(ReplicationRuleFilter2) {
  ReplicationRuleFilter2.visit = (value, visitor) => {
    if (value.Prefix !== void 0)
      return visitor.Prefix(value.Prefix);
    if (value.Tag !== void 0)
      return visitor.Tag(value.Tag);
    if (value.And !== void 0)
      return visitor.And(value.And);
    return visitor._(value.$unknown[0], value.$unknown[1]);
  };
})(ReplicationRuleFilter || (ReplicationRuleFilter = {}));
var InvalidObjectState = class _InvalidObjectState extends S3ServiceException {
  constructor(opts) {
    super({
      name: "InvalidObjectState",
      $fault: "client",
      ...opts
    });
    this.name = "InvalidObjectState";
    this.$fault = "client";
    Object.setPrototypeOf(this, _InvalidObjectState.prototype);
    this.StorageClass = opts.StorageClass;
    this.AccessTier = opts.AccessTier;
  }
};
var NoSuchKey = class _NoSuchKey extends S3ServiceException {
  constructor(opts) {
    super({
      name: "NoSuchKey",
      $fault: "client",
      ...opts
    });
    this.name = "NoSuchKey";
    this.$fault = "client";
    Object.setPrototypeOf(this, _NoSuchKey.prototype);
  }
};
var CompleteMultipartUploadOutputFilterSensitiveLog = (obj) => ({
  ...obj,
  ...obj.SSEKMSKeyId && { SSEKMSKeyId: SENSITIVE_STRING }
});
var CompleteMultipartUploadRequestFilterSensitiveLog = (obj) => ({
  ...obj,
  ...obj.SSECustomerKey && { SSECustomerKey: SENSITIVE_STRING }
});
var CreateMultipartUploadOutputFilterSensitiveLog = (obj) => ({
  ...obj,
  ...obj.SSEKMSKeyId && { SSEKMSKeyId: SENSITIVE_STRING },
  ...obj.SSEKMSEncryptionContext && { SSEKMSEncryptionContext: SENSITIVE_STRING }
});
var CreateMultipartUploadRequestFilterSensitiveLog = (obj) => ({
  ...obj,
  ...obj.SSECustomerKey && { SSECustomerKey: SENSITIVE_STRING },
  ...obj.SSEKMSKeyId && { SSEKMSKeyId: SENSITIVE_STRING },
  ...obj.SSEKMSEncryptionContext && { SSEKMSEncryptionContext: SENSITIVE_STRING }
});
var GetObjectOutputFilterSensitiveLog = (obj) => ({
  ...obj,
  ...obj.SSEKMSKeyId && { SSEKMSKeyId: SENSITIVE_STRING }
});
var GetObjectRequestFilterSensitiveLog = (obj) => ({
  ...obj,
  ...obj.SSECustomerKey && { SSECustomerKey: SENSITIVE_STRING }
});
var SelectObjectContentEventStream;
(function(SelectObjectContentEventStream2) {
  SelectObjectContentEventStream2.visit = (value, visitor) => {
    if (value.Records !== void 0)
      return visitor.Records(value.Records);
    if (value.Stats !== void 0)
      return visitor.Stats(value.Stats);
    if (value.Progress !== void 0)
      return visitor.Progress(value.Progress);
    if (value.Cont !== void 0)
      return visitor.Cont(value.Cont);
    if (value.End !== void 0)
      return visitor.End(value.End);
    return visitor._(value.$unknown[0], value.$unknown[1]);
  };
})(SelectObjectContentEventStream || (SelectObjectContentEventStream = {}));
var UploadPartOutputFilterSensitiveLog = (obj) => ({
  ...obj,
  ...obj.SSEKMSKeyId && { SSEKMSKeyId: SENSITIVE_STRING }
});
var UploadPartRequestFilterSensitiveLog = (obj) => ({
  ...obj,
  ...obj.SSECustomerKey && { SSECustomerKey: SENSITIVE_STRING }
});
var se_CompleteMultipartUploadCommand = async (input, context) => {
  const { hostname, protocol = "https", port, path: basePath } = await context.endpoint();
  const headers = map({}, isSerializableHeaderValue2, {
    "content-type": "application/xml",
    "x-amz-checksum-crc32": input.ChecksumCRC32,
    "x-amz-checksum-crc32c": input.ChecksumCRC32C,
    "x-amz-checksum-sha1": input.ChecksumSHA1,
    "x-amz-checksum-sha256": input.ChecksumSHA256,
    "x-amz-request-payer": input.RequestPayer,
    "x-amz-expected-bucket-owner": input.ExpectedBucketOwner,
    "x-amz-server-side-encryption-customer-algorithm": input.SSECustomerAlgorithm,
    "x-amz-server-side-encryption-customer-key": input.SSECustomerKey,
    "x-amz-server-side-encryption-customer-key-md5": input.SSECustomerKeyMD5
  });
  let resolvedPath2 = `${(basePath == null ? void 0 : basePath.endsWith("/")) ? basePath.slice(0, -1) : basePath || ""}/{Key+}`;
  resolvedPath2 = resolvedPath(resolvedPath2, input, "Bucket", () => input.Bucket, "{Bucket}", false);
  resolvedPath2 = resolvedPath(resolvedPath2, input, "Key", () => input.Key, "{Key+}", true);
  const query = map({
    "x-id": [, "CompleteMultipartUpload"],
    uploadId: [, expectNonNull(input.UploadId, `UploadId`)]
  });
  let body;
  if (input.MultipartUpload !== void 0) {
    body = se_CompletedMultipartUpload(input.MultipartUpload);
  }
  let contents;
  if (input.MultipartUpload !== void 0) {
    contents = se_CompletedMultipartUpload(input.MultipartUpload);
    contents = contents.withName("CompleteMultipartUpload");
    body = '<?xml version="1.0" encoding="UTF-8"?>';
    contents.addAttribute("xmlns", "http://s3.amazonaws.com/doc/2006-03-01/");
    body += contents.toString();
  }
  return new HttpRequest2({
    protocol,
    hostname,
    port,
    method: "POST",
    headers,
    path: resolvedPath2,
    query,
    body
  });
};
var se_CreateMultipartUploadCommand = async (input, context) => {
  const { hostname, protocol = "https", port, path: basePath } = await context.endpoint();
  const headers = map({}, isSerializableHeaderValue2, {
    "x-amz-acl": input.ACL,
    "cache-control": input.CacheControl,
    "content-disposition": input.ContentDisposition,
    "content-encoding": input.ContentEncoding,
    "content-language": input.ContentLanguage,
    "content-type": input.ContentType,
    expires: [() => isSerializableHeaderValue2(input.Expires), () => dateToUtcString(input.Expires).toString()],
    "x-amz-grant-full-control": input.GrantFullControl,
    "x-amz-grant-read": input.GrantRead,
    "x-amz-grant-read-acp": input.GrantReadACP,
    "x-amz-grant-write-acp": input.GrantWriteACP,
    "x-amz-server-side-encryption": input.ServerSideEncryption,
    "x-amz-storage-class": input.StorageClass,
    "x-amz-website-redirect-location": input.WebsiteRedirectLocation,
    "x-amz-server-side-encryption-customer-algorithm": input.SSECustomerAlgorithm,
    "x-amz-server-side-encryption-customer-key": input.SSECustomerKey,
    "x-amz-server-side-encryption-customer-key-md5": input.SSECustomerKeyMD5,
    "x-amz-server-side-encryption-aws-kms-key-id": input.SSEKMSKeyId,
    "x-amz-server-side-encryption-context": input.SSEKMSEncryptionContext,
    "x-amz-server-side-encryption-bucket-key-enabled": [
      () => isSerializableHeaderValue2(input.BucketKeyEnabled),
      () => input.BucketKeyEnabled.toString()
    ],
    "x-amz-request-payer": input.RequestPayer,
    "x-amz-tagging": input.Tagging,
    "x-amz-object-lock-mode": input.ObjectLockMode,
    "x-amz-object-lock-retain-until-date": [
      () => isSerializableHeaderValue2(input.ObjectLockRetainUntilDate),
      () => (input.ObjectLockRetainUntilDate.toISOString().split(".")[0] + "Z").toString()
    ],
    "x-amz-object-lock-legal-hold": input.ObjectLockLegalHoldStatus,
    "x-amz-expected-bucket-owner": input.ExpectedBucketOwner,
    "x-amz-checksum-algorithm": input.ChecksumAlgorithm,
    ...input.Metadata !== void 0 && Object.keys(input.Metadata).reduce((acc, suffix) => {
      acc[`x-amz-meta-${suffix.toLowerCase()}`] = input.Metadata[suffix];
      return acc;
    }, {})
  });
  let resolvedPath2 = `${(basePath == null ? void 0 : basePath.endsWith("/")) ? basePath.slice(0, -1) : basePath || ""}/{Key+}`;
  resolvedPath2 = resolvedPath(resolvedPath2, input, "Bucket", () => input.Bucket, "{Bucket}", false);
  resolvedPath2 = resolvedPath(resolvedPath2, input, "Key", () => input.Key, "{Key+}", true);
  const query = map({
    uploads: [, ""],
    "x-id": [, "CreateMultipartUpload"]
  });
  let body;
  return new HttpRequest2({
    protocol,
    hostname,
    port,
    method: "POST",
    headers,
    path: resolvedPath2,
    query,
    body
  });
};
var se_GetObjectCommand = async (input, context) => {
  const { hostname, protocol = "https", port, path: basePath } = await context.endpoint();
  const headers = map({}, isSerializableHeaderValue2, {
    "if-match": input.IfMatch,
    "if-modified-since": [
      () => isSerializableHeaderValue2(input.IfModifiedSince),
      () => dateToUtcString(input.IfModifiedSince).toString()
    ],
    "if-none-match": input.IfNoneMatch,
    "if-unmodified-since": [
      () => isSerializableHeaderValue2(input.IfUnmodifiedSince),
      () => dateToUtcString(input.IfUnmodifiedSince).toString()
    ],
    range: input.Range,
    "x-amz-server-side-encryption-customer-algorithm": input.SSECustomerAlgorithm,
    "x-amz-server-side-encryption-customer-key": input.SSECustomerKey,
    "x-amz-server-side-encryption-customer-key-md5": input.SSECustomerKeyMD5,
    "x-amz-request-payer": input.RequestPayer,
    "x-amz-expected-bucket-owner": input.ExpectedBucketOwner,
    "x-amz-checksum-mode": input.ChecksumMode
  });
  let resolvedPath2 = `${(basePath == null ? void 0 : basePath.endsWith("/")) ? basePath.slice(0, -1) : basePath || ""}/{Key+}`;
  resolvedPath2 = resolvedPath(resolvedPath2, input, "Bucket", () => input.Bucket, "{Bucket}", false);
  resolvedPath2 = resolvedPath(resolvedPath2, input, "Key", () => input.Key, "{Key+}", true);
  const query = map({
    "x-id": [, "GetObject"],
    "response-cache-control": [, input.ResponseCacheControl],
    "response-content-disposition": [, input.ResponseContentDisposition],
    "response-content-encoding": [, input.ResponseContentEncoding],
    "response-content-language": [, input.ResponseContentLanguage],
    "response-content-type": [, input.ResponseContentType],
    "response-expires": [
      () => input.ResponseExpires !== void 0,
      () => dateToUtcString(input.ResponseExpires).toString()
    ],
    versionId: [, input.VersionId],
    partNumber: [() => input.PartNumber !== void 0, () => input.PartNumber.toString()]
  });
  let body;
  return new HttpRequest2({
    protocol,
    hostname,
    port,
    method: "GET",
    headers,
    path: resolvedPath2,
    query,
    body
  });
};
var se_UploadPartCommand = async (input, context) => {
  const { hostname, protocol = "https", port, path: basePath } = await context.endpoint();
  const headers = map({}, isSerializableHeaderValue2, {
    "content-type": "application/octet-stream",
    "content-length": [() => isSerializableHeaderValue2(input.ContentLength), () => input.ContentLength.toString()],
    "content-md5": input.ContentMD5,
    "x-amz-sdk-checksum-algorithm": input.ChecksumAlgorithm,
    "x-amz-checksum-crc32": input.ChecksumCRC32,
    "x-amz-checksum-crc32c": input.ChecksumCRC32C,
    "x-amz-checksum-sha1": input.ChecksumSHA1,
    "x-amz-checksum-sha256": input.ChecksumSHA256,
    "x-amz-server-side-encryption-customer-algorithm": input.SSECustomerAlgorithm,
    "x-amz-server-side-encryption-customer-key": input.SSECustomerKey,
    "x-amz-server-side-encryption-customer-key-md5": input.SSECustomerKeyMD5,
    "x-amz-request-payer": input.RequestPayer,
    "x-amz-expected-bucket-owner": input.ExpectedBucketOwner
  });
  let resolvedPath2 = `${(basePath == null ? void 0 : basePath.endsWith("/")) ? basePath.slice(0, -1) : basePath || ""}/{Key+}`;
  resolvedPath2 = resolvedPath(resolvedPath2, input, "Bucket", () => input.Bucket, "{Bucket}", false);
  resolvedPath2 = resolvedPath(resolvedPath2, input, "Key", () => input.Key, "{Key+}", true);
  const query = map({
    "x-id": [, "UploadPart"],
    partNumber: [expectNonNull(input.PartNumber, `PartNumber`) != null, () => input.PartNumber.toString()],
    uploadId: [, expectNonNull(input.UploadId, `UploadId`)]
  });
  let body;
  if (input.Body !== void 0) {
    body = input.Body;
  }
  let contents;
  if (input.Body !== void 0) {
    contents = input.Body;
    body = contents;
  }
  return new HttpRequest2({
    protocol,
    hostname,
    port,
    method: "PUT",
    headers,
    path: resolvedPath2,
    query,
    body
  });
};
var de_CompleteMultipartUploadCommand = async (output, context) => {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CompleteMultipartUploadCommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata5(output),
    Expiration: [, output.headers["x-amz-expiration"]],
    ServerSideEncryption: [, output.headers["x-amz-server-side-encryption"]],
    VersionId: [, output.headers["x-amz-version-id"]],
    SSEKMSKeyId: [, output.headers["x-amz-server-side-encryption-aws-kms-key-id"]],
    BucketKeyEnabled: [
      () => void 0 !== output.headers["x-amz-server-side-encryption-bucket-key-enabled"],
      () => parseBoolean(output.headers["x-amz-server-side-encryption-bucket-key-enabled"])
    ],
    RequestCharged: [, output.headers["x-amz-request-charged"]]
  });
  const data = expectNonNull(expectObject(await parseBody4(output.body, context)), "body");
  if (data["Bucket"] !== void 0) {
    contents.Bucket = expectString(data["Bucket"]);
  }
  if (data["ChecksumCRC32"] !== void 0) {
    contents.ChecksumCRC32 = expectString(data["ChecksumCRC32"]);
  }
  if (data["ChecksumCRC32C"] !== void 0) {
    contents.ChecksumCRC32C = expectString(data["ChecksumCRC32C"]);
  }
  if (data["ChecksumSHA1"] !== void 0) {
    contents.ChecksumSHA1 = expectString(data["ChecksumSHA1"]);
  }
  if (data["ChecksumSHA256"] !== void 0) {
    contents.ChecksumSHA256 = expectString(data["ChecksumSHA256"]);
  }
  if (data["ETag"] !== void 0) {
    contents.ETag = expectString(data["ETag"]);
  }
  if (data["Key"] !== void 0) {
    contents.Key = expectString(data["Key"]);
  }
  if (data["Location"] !== void 0) {
    contents.Location = expectString(data["Location"]);
  }
  return contents;
};
var de_CompleteMultipartUploadCommandError = async (output, context) => {
  const parsedOutput = {
    ...output,
    body: await parseErrorBody4(output.body, context)
  };
  const errorCode = loadRestXmlErrorCode(output, parsedOutput.body);
  const parsedBody = parsedOutput.body;
  return throwDefaultError5({
    output,
    parsedBody,
    errorCode
  });
};
var de_CreateMultipartUploadCommand = async (output, context) => {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CreateMultipartUploadCommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata5(output),
    AbortDate: [
      () => void 0 !== output.headers["x-amz-abort-date"],
      () => expectNonNull(parseRfc7231DateTime(output.headers["x-amz-abort-date"]))
    ],
    AbortRuleId: [, output.headers["x-amz-abort-rule-id"]],
    ServerSideEncryption: [, output.headers["x-amz-server-side-encryption"]],
    SSECustomerAlgorithm: [, output.headers["x-amz-server-side-encryption-customer-algorithm"]],
    SSECustomerKeyMD5: [, output.headers["x-amz-server-side-encryption-customer-key-md5"]],
    SSEKMSKeyId: [, output.headers["x-amz-server-side-encryption-aws-kms-key-id"]],
    SSEKMSEncryptionContext: [, output.headers["x-amz-server-side-encryption-context"]],
    BucketKeyEnabled: [
      () => void 0 !== output.headers["x-amz-server-side-encryption-bucket-key-enabled"],
      () => parseBoolean(output.headers["x-amz-server-side-encryption-bucket-key-enabled"])
    ],
    RequestCharged: [, output.headers["x-amz-request-charged"]],
    ChecksumAlgorithm: [, output.headers["x-amz-checksum-algorithm"]]
  });
  const data = expectNonNull(expectObject(await parseBody4(output.body, context)), "body");
  if (data["Bucket"] !== void 0) {
    contents.Bucket = expectString(data["Bucket"]);
  }
  if (data["Key"] !== void 0) {
    contents.Key = expectString(data["Key"]);
  }
  if (data["UploadId"] !== void 0) {
    contents.UploadId = expectString(data["UploadId"]);
  }
  return contents;
};
var de_CreateMultipartUploadCommandError = async (output, context) => {
  const parsedOutput = {
    ...output,
    body: await parseErrorBody4(output.body, context)
  };
  const errorCode = loadRestXmlErrorCode(output, parsedOutput.body);
  const parsedBody = parsedOutput.body;
  return throwDefaultError5({
    output,
    parsedBody,
    errorCode
  });
};
var de_GetObjectCommand = async (output, context) => {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_GetObjectCommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata5(output),
    DeleteMarker: [
      () => void 0 !== output.headers["x-amz-delete-marker"],
      () => parseBoolean(output.headers["x-amz-delete-marker"])
    ],
    AcceptRanges: [, output.headers["accept-ranges"]],
    Expiration: [, output.headers["x-amz-expiration"]],
    Restore: [, output.headers["x-amz-restore"]],
    LastModified: [
      () => void 0 !== output.headers["last-modified"],
      () => expectNonNull(parseRfc7231DateTime(output.headers["last-modified"]))
    ],
    ContentLength: [
      () => void 0 !== output.headers["content-length"],
      () => strictParseLong(output.headers["content-length"])
    ],
    ETag: [, output.headers["etag"]],
    ChecksumCRC32: [, output.headers["x-amz-checksum-crc32"]],
    ChecksumCRC32C: [, output.headers["x-amz-checksum-crc32c"]],
    ChecksumSHA1: [, output.headers["x-amz-checksum-sha1"]],
    ChecksumSHA256: [, output.headers["x-amz-checksum-sha256"]],
    MissingMeta: [
      () => void 0 !== output.headers["x-amz-missing-meta"],
      () => strictParseInt32(output.headers["x-amz-missing-meta"])
    ],
    VersionId: [, output.headers["x-amz-version-id"]],
    CacheControl: [, output.headers["cache-control"]],
    ContentDisposition: [, output.headers["content-disposition"]],
    ContentEncoding: [, output.headers["content-encoding"]],
    ContentLanguage: [, output.headers["content-language"]],
    ContentRange: [, output.headers["content-range"]],
    ContentType: [, output.headers["content-type"]],
    Expires: [
      () => void 0 !== output.headers["expires"],
      () => expectNonNull(parseRfc7231DateTime(output.headers["expires"]))
    ],
    WebsiteRedirectLocation: [, output.headers["x-amz-website-redirect-location"]],
    ServerSideEncryption: [, output.headers["x-amz-server-side-encryption"]],
    SSECustomerAlgorithm: [, output.headers["x-amz-server-side-encryption-customer-algorithm"]],
    SSECustomerKeyMD5: [, output.headers["x-amz-server-side-encryption-customer-key-md5"]],
    SSEKMSKeyId: [, output.headers["x-amz-server-side-encryption-aws-kms-key-id"]],
    BucketKeyEnabled: [
      () => void 0 !== output.headers["x-amz-server-side-encryption-bucket-key-enabled"],
      () => parseBoolean(output.headers["x-amz-server-side-encryption-bucket-key-enabled"])
    ],
    StorageClass: [, output.headers["x-amz-storage-class"]],
    RequestCharged: [, output.headers["x-amz-request-charged"]],
    ReplicationStatus: [, output.headers["x-amz-replication-status"]],
    PartsCount: [
      () => void 0 !== output.headers["x-amz-mp-parts-count"],
      () => strictParseInt32(output.headers["x-amz-mp-parts-count"])
    ],
    TagCount: [
      () => void 0 !== output.headers["x-amz-tagging-count"],
      () => strictParseInt32(output.headers["x-amz-tagging-count"])
    ],
    ObjectLockMode: [, output.headers["x-amz-object-lock-mode"]],
    ObjectLockRetainUntilDate: [
      () => void 0 !== output.headers["x-amz-object-lock-retain-until-date"],
      () => expectNonNull(parseRfc3339DateTimeWithOffset(output.headers["x-amz-object-lock-retain-until-date"]))
    ],
    ObjectLockLegalHoldStatus: [, output.headers["x-amz-object-lock-legal-hold"]],
    Metadata: [
      ,
      Object.keys(output.headers).filter((header) => header.startsWith("x-amz-meta-")).reduce((acc, header) => {
        acc[header.substring(11)] = output.headers[header];
        return acc;
      }, {})
    ]
  });
  const data = output.body;
  context.sdkStreamMixin(data);
  contents.Body = data;
  return contents;
};
var de_GetObjectCommandError = async (output, context) => {
  const parsedOutput = {
    ...output,
    body: await parseErrorBody4(output.body, context)
  };
  const errorCode = loadRestXmlErrorCode(output, parsedOutput.body);
  switch (errorCode) {
    case "InvalidObjectState":
    case "com.amazonaws.s3#InvalidObjectState":
      throw await de_InvalidObjectStateRes(parsedOutput);
    case "NoSuchKey":
    case "com.amazonaws.s3#NoSuchKey":
      throw await de_NoSuchKeyRes(parsedOutput);
    default:
      const parsedBody = parsedOutput.body;
      return throwDefaultError5({
        output,
        parsedBody,
        errorCode
      });
  }
};
var de_UploadPartCommand = async (output, context) => {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_UploadPartCommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata5(output),
    ServerSideEncryption: [, output.headers["x-amz-server-side-encryption"]],
    ETag: [, output.headers["etag"]],
    ChecksumCRC32: [, output.headers["x-amz-checksum-crc32"]],
    ChecksumCRC32C: [, output.headers["x-amz-checksum-crc32c"]],
    ChecksumSHA1: [, output.headers["x-amz-checksum-sha1"]],
    ChecksumSHA256: [, output.headers["x-amz-checksum-sha256"]],
    SSECustomerAlgorithm: [, output.headers["x-amz-server-side-encryption-customer-algorithm"]],
    SSECustomerKeyMD5: [, output.headers["x-amz-server-side-encryption-customer-key-md5"]],
    SSEKMSKeyId: [, output.headers["x-amz-server-side-encryption-aws-kms-key-id"]],
    BucketKeyEnabled: [
      () => void 0 !== output.headers["x-amz-server-side-encryption-bucket-key-enabled"],
      () => parseBoolean(output.headers["x-amz-server-side-encryption-bucket-key-enabled"])
    ],
    RequestCharged: [, output.headers["x-amz-request-charged"]]
  });
  await collectBody2(output.body, context);
  return contents;
};
var de_UploadPartCommandError = async (output, context) => {
  const parsedOutput = {
    ...output,
    body: await parseErrorBody4(output.body, context)
  };
  const errorCode = loadRestXmlErrorCode(output, parsedOutput.body);
  const parsedBody = parsedOutput.body;
  return throwDefaultError5({
    output,
    parsedBody,
    errorCode
  });
};
var throwDefaultError5 = withBaseException(S3ServiceException);
var de_InvalidObjectStateRes = async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  if (data["AccessTier"] !== void 0) {
    contents.AccessTier = expectString(data["AccessTier"]);
  }
  if (data["StorageClass"] !== void 0) {
    contents.StorageClass = expectString(data["StorageClass"]);
  }
  const exception = new InvalidObjectState({
    $metadata: deserializeMetadata5(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
};
var de_NoSuchKeyRes = async (parsedOutput, context) => {
  const contents = map({});
  parsedOutput.body;
  const exception = new NoSuchKey({
    $metadata: deserializeMetadata5(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
};
var se_CompletedMultipartUpload = (input, context) => {
  const bodyNode = new XmlNode("CompletedMultipartUpload");
  if (input.Parts != null) {
    const nodes = se_CompletedPartList(input.Parts);
    nodes.map((node) => {
      node = node.withName("Part");
      bodyNode.addChildNode(node);
    });
  }
  return bodyNode;
};
var se_CompletedPart = (input, context) => {
  const bodyNode = new XmlNode("CompletedPart");
  if (input.ETag != null) {
    const node = XmlNode.of("ETag", input.ETag).withName("ETag");
    bodyNode.addChildNode(node);
  }
  if (input.ChecksumCRC32 != null) {
    const node = XmlNode.of("ChecksumCRC32", input.ChecksumCRC32).withName("ChecksumCRC32");
    bodyNode.addChildNode(node);
  }
  if (input.ChecksumCRC32C != null) {
    const node = XmlNode.of("ChecksumCRC32C", input.ChecksumCRC32C).withName("ChecksumCRC32C");
    bodyNode.addChildNode(node);
  }
  if (input.ChecksumSHA1 != null) {
    const node = XmlNode.of("ChecksumSHA1", input.ChecksumSHA1).withName("ChecksumSHA1");
    bodyNode.addChildNode(node);
  }
  if (input.ChecksumSHA256 != null) {
    const node = XmlNode.of("ChecksumSHA256", input.ChecksumSHA256).withName("ChecksumSHA256");
    bodyNode.addChildNode(node);
  }
  if (input.PartNumber != null) {
    const node = XmlNode.of("PartNumber", String(input.PartNumber)).withName("PartNumber");
    bodyNode.addChildNode(node);
  }
  return bodyNode;
};
var se_CompletedPartList = (input, context) => {
  return input.filter((e5) => e5 != null).map((entry2) => {
    const node = se_CompletedPart(entry2);
    return node.withName("member");
  });
};
var deserializeMetadata5 = (output) => ({
  httpStatusCode: output.statusCode,
  requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
  extendedRequestId: output.headers["x-amz-id-2"],
  cfId: output.headers["x-amz-cf-id"]
});
var collectBodyString5 = (streamBody, context) => collectBody2(streamBody, context).then((body) => context.utf8Encoder(body));
var isSerializableHeaderValue2 = (value) => value !== void 0 && value !== null && value !== "" && (!Object.getOwnPropertyNames(value).includes("length") || value.length != 0) && (!Object.getOwnPropertyNames(value).includes("size") || value.size != 0);
var parseBody4 = (streamBody, context) => collectBodyString5(streamBody, context).then((encoded) => {
  if (encoded.length) {
    const parser = new import_fast_xml_parser2.XMLParser({
      attributeNamePrefix: "",
      htmlEntities: true,
      ignoreAttributes: false,
      ignoreDeclaration: true,
      parseTagValue: false,
      trimValues: false,
      tagValueProcessor: (_, val2) => val2.trim() === "" && val2.includes("\n") ? "" : void 0
    });
    parser.addEntity("#xD", "\r");
    parser.addEntity("#10", "\n");
    const parsedObj = parser.parse(encoded);
    const textNodeName = "#text";
    const key = Object.keys(parsedObj)[0];
    const parsedObjToReturn = parsedObj[key];
    if (parsedObjToReturn[textNodeName]) {
      parsedObjToReturn[key] = parsedObjToReturn[textNodeName];
      delete parsedObjToReturn[textNodeName];
    }
    return getValueFromTextNode(parsedObjToReturn);
  }
  return {};
});
var parseErrorBody4 = async (errorBody, context) => {
  const value = await parseBody4(errorBody, context);
  if (value.Error) {
    value.Error.message = value.Error.message ?? value.Error.Message;
  }
  return value;
};
var loadRestXmlErrorCode = (output, data) => {
  if ((data == null ? void 0 : data.Code) !== void 0) {
    return data.Code;
  }
  if (output.statusCode == 404) {
    return "NotFound";
  }
};
function ssecMiddleware(options) {
  return (next) => async (args) => {
    let input = { ...args.input };
    const properties = [
      {
        target: "SSECustomerKey",
        hash: "SSECustomerKeyMD5"
      },
      {
        target: "CopySourceSSECustomerKey",
        hash: "CopySourceSSECustomerKeyMD5"
      }
    ];
    for (const prop of properties) {
      const value = input[prop.target];
      if (value) {
        const valueView = ArrayBuffer.isView(value) ? new Uint8Array(value.buffer, value.byteOffset, value.byteLength) : typeof value === "string" ? options.utf8Decoder(value) : new Uint8Array(value);
        const encoded = options.base64Encoder(valueView);
        const hash = new options.md5();
        hash.update(valueView);
        input = {
          ...input,
          [prop.target]: encoded,
          [prop.hash]: options.base64Encoder(await hash.digest())
        };
      }
    }
    return next({
      ...args,
      input
    });
  };
}
var ssecMiddlewareOptions = {
  name: "ssecMiddleware",
  step: "initialize",
  tags: ["SSE"],
  override: true
};
var getSsecPlugin = (config) => ({
  applyToStack: (clientStack) => {
    clientStack.add(ssecMiddleware(config), ssecMiddlewareOptions);
  }
});
var CompleteMultipartUploadCommand = class _CompleteMultipartUploadCommand extends Command {
  static getEndpointParameterInstructions() {
    return {
      Bucket: { type: "contextParams", name: "Bucket" },
      ForcePathStyle: { type: "clientContextParams", name: "forcePathStyle" },
      UseArnRegion: { type: "clientContextParams", name: "useArnRegion" },
      DisableMultiRegionAccessPoints: { type: "clientContextParams", name: "disableMultiregionAccessPoints" },
      Accelerate: { type: "clientContextParams", name: "useAccelerateEndpoint" },
      UseGlobalEndpoint: { type: "builtInParams", name: "useGlobalEndpoint" },
      UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
      Endpoint: { type: "builtInParams", name: "endpoint" },
      Region: { type: "builtInParams", name: "region" },
      UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" }
    };
  }
  constructor(input) {
    super();
    this.input = input;
  }
  resolveMiddleware(clientStack, configuration, options) {
    this.middlewareStack.use(getSerdePlugin(configuration, this.serialize, this.deserialize));
    this.middlewareStack.use(getEndpointPlugin(configuration, _CompleteMultipartUploadCommand.getEndpointParameterInstructions()));
    this.middlewareStack.use(getThrow200ExceptionsPlugin(configuration));
    this.middlewareStack.use(getSsecPlugin(configuration));
    const stack = clientStack.concat(this.middlewareStack);
    const { logger: logger2 } = configuration;
    const clientName = "S3Client";
    const commandName = "CompleteMultipartUploadCommand";
    const handlerExecutionContext = {
      logger: logger2,
      clientName,
      commandName,
      inputFilterSensitiveLog: CompleteMultipartUploadRequestFilterSensitiveLog,
      outputFilterSensitiveLog: CompleteMultipartUploadOutputFilterSensitiveLog
    };
    const { requestHandler } = configuration;
    return stack.resolve((request2) => requestHandler.handle(request2.request, options || {}), handlerExecutionContext);
  }
  serialize(input, context) {
    return se_CompleteMultipartUploadCommand(input, context);
  }
  deserialize(output, context) {
    return de_CompleteMultipartUploadCommand(output, context);
  }
};
var CreateMultipartUploadCommand = class _CreateMultipartUploadCommand extends Command {
  static getEndpointParameterInstructions() {
    return {
      Bucket: { type: "contextParams", name: "Bucket" },
      ForcePathStyle: { type: "clientContextParams", name: "forcePathStyle" },
      UseArnRegion: { type: "clientContextParams", name: "useArnRegion" },
      DisableMultiRegionAccessPoints: { type: "clientContextParams", name: "disableMultiregionAccessPoints" },
      Accelerate: { type: "clientContextParams", name: "useAccelerateEndpoint" },
      UseGlobalEndpoint: { type: "builtInParams", name: "useGlobalEndpoint" },
      UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
      Endpoint: { type: "builtInParams", name: "endpoint" },
      Region: { type: "builtInParams", name: "region" },
      UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" }
    };
  }
  constructor(input) {
    super();
    this.input = input;
  }
  resolveMiddleware(clientStack, configuration, options) {
    this.middlewareStack.use(getSerdePlugin(configuration, this.serialize, this.deserialize));
    this.middlewareStack.use(getEndpointPlugin(configuration, _CreateMultipartUploadCommand.getEndpointParameterInstructions()));
    this.middlewareStack.use(getSsecPlugin(configuration));
    const stack = clientStack.concat(this.middlewareStack);
    const { logger: logger2 } = configuration;
    const clientName = "S3Client";
    const commandName = "CreateMultipartUploadCommand";
    const handlerExecutionContext = {
      logger: logger2,
      clientName,
      commandName,
      inputFilterSensitiveLog: CreateMultipartUploadRequestFilterSensitiveLog,
      outputFilterSensitiveLog: CreateMultipartUploadOutputFilterSensitiveLog
    };
    const { requestHandler } = configuration;
    return stack.resolve((request2) => requestHandler.handle(request2.request, options || {}), handlerExecutionContext);
  }
  serialize(input, context) {
    return se_CreateMultipartUploadCommand(input, context);
  }
  deserialize(output, context) {
    return de_CreateMultipartUploadCommand(output, context);
  }
};
var ChecksumAlgorithm;
(function(ChecksumAlgorithm2) {
  ChecksumAlgorithm2["MD5"] = "MD5";
  ChecksumAlgorithm2["CRC32"] = "CRC32";
  ChecksumAlgorithm2["CRC32C"] = "CRC32C";
  ChecksumAlgorithm2["SHA1"] = "SHA1";
  ChecksumAlgorithm2["SHA256"] = "SHA256";
})(ChecksumAlgorithm || (ChecksumAlgorithm = {}));
var ChecksumLocation;
(function(ChecksumLocation2) {
  ChecksumLocation2["HEADER"] = "header";
  ChecksumLocation2["TRAILER"] = "trailer";
})(ChecksumLocation || (ChecksumLocation = {}));
var CLIENT_SUPPORTED_ALGORITHMS = [
  ChecksumAlgorithm.CRC32,
  ChecksumAlgorithm.CRC32C,
  ChecksumAlgorithm.SHA1,
  ChecksumAlgorithm.SHA256
];
var PRIORITY_ORDER_ALGORITHMS = [
  ChecksumAlgorithm.CRC32,
  ChecksumAlgorithm.CRC32C,
  ChecksumAlgorithm.SHA1,
  ChecksumAlgorithm.SHA256
];
var getChecksumAlgorithmForRequest = (input, { requestChecksumRequired, requestAlgorithmMember }) => {
  if (!requestAlgorithmMember || !input[requestAlgorithmMember]) {
    return requestChecksumRequired ? ChecksumAlgorithm.MD5 : void 0;
  }
  const checksumAlgorithm = input[requestAlgorithmMember];
  if (!CLIENT_SUPPORTED_ALGORITHMS.includes(checksumAlgorithm)) {
    throw new Error(`The checksum algorithm "${checksumAlgorithm}" is not supported by the client. Select one of ${CLIENT_SUPPORTED_ALGORITHMS}.`);
  }
  return checksumAlgorithm;
};
var getChecksumLocationName = (algorithm) => algorithm === ChecksumAlgorithm.MD5 ? "content-md5" : `x-amz-checksum-${algorithm.toLowerCase()}`;
var hasHeader2 = (header, headers) => {
  const soughtHeader = header.toLowerCase();
  for (const headerName of Object.keys(headers)) {
    if (soughtHeader === headerName.toLowerCase()) {
      return true;
    }
  }
  return false;
};
var isStreaming = (body) => body !== void 0 && typeof body !== "string" && !ArrayBuffer.isView(body) && !isArrayBuffer(body);
var import_crc323 = __toESM(require_build2());
var import_crc32c = __toESM(require_build3());
var selectChecksumAlgorithmFunction = (checksumAlgorithm, config) => ({
  [ChecksumAlgorithm.MD5]: config.md5,
  [ChecksumAlgorithm.CRC32]: import_crc323.AwsCrc32,
  [ChecksumAlgorithm.CRC32C]: import_crc32c.AwsCrc32c,
  [ChecksumAlgorithm.SHA1]: config.sha1,
  [ChecksumAlgorithm.SHA256]: config.sha256
})[checksumAlgorithm];
var stringHasher = (checksumAlgorithmFn, body) => {
  const hash = new checksumAlgorithmFn();
  hash.update(toUint8Array(body || ""));
  return hash.digest();
};
var getChecksum = async (body, { streamHasher, checksumAlgorithmFn, base64Encoder }) => {
  const digest = isStreaming(body) ? streamHasher(checksumAlgorithmFn, body) : stringHasher(checksumAlgorithmFn, body);
  return base64Encoder(await digest);
};
var getChecksumAlgorithmListForResponse = (responseAlgorithms = []) => {
  const validChecksumAlgorithms = [];
  for (const algorithm of PRIORITY_ORDER_ALGORITHMS) {
    if (!responseAlgorithms.includes(algorithm) || !CLIENT_SUPPORTED_ALGORITHMS.includes(algorithm)) {
      continue;
    }
    validChecksumAlgorithms.push(algorithm);
  }
  return validChecksumAlgorithms;
};
var validateChecksumFromResponse = async (response2, { config, responseAlgorithms }) => {
  const checksumAlgorithms = getChecksumAlgorithmListForResponse(responseAlgorithms);
  const { body: responseBody, headers: responseHeaders } = response2;
  for (const algorithm of checksumAlgorithms) {
    const responseHeader = getChecksumLocationName(algorithm);
    const checksumFromResponse = responseHeaders[responseHeader];
    if (checksumFromResponse) {
      const checksumAlgorithmFn = selectChecksumAlgorithmFunction(algorithm, config);
      const { streamHasher, base64Encoder } = config;
      const checksum = await getChecksum(responseBody, { streamHasher, checksumAlgorithmFn, base64Encoder });
      if (checksum === checksumFromResponse) {
        break;
      }
      throw new Error(`Checksum mismatch: expected "${checksum}" but received "${checksumFromResponse}" in response header "${responseHeader}".`);
    }
  }
};
var flexibleChecksumsMiddleware = (config, middlewareConfig) => (next) => async (args) => {
  if (!HttpRequest.isInstance(args.request)) {
    return next(args);
  }
  const { request: request2 } = args;
  const { body: requestBody, headers } = request2;
  const { base64Encoder, streamHasher } = config;
  const { input, requestChecksumRequired, requestAlgorithmMember } = middlewareConfig;
  const checksumAlgorithm = getChecksumAlgorithmForRequest(input, {
    requestChecksumRequired,
    requestAlgorithmMember
  });
  let updatedBody = requestBody;
  let updatedHeaders = headers;
  if (checksumAlgorithm) {
    const checksumLocationName = getChecksumLocationName(checksumAlgorithm);
    const checksumAlgorithmFn = selectChecksumAlgorithmFunction(checksumAlgorithm, config);
    if (isStreaming(requestBody)) {
      const { getAwsChunkedEncodingStream: getAwsChunkedEncodingStream2, bodyLengthChecker } = config;
      updatedBody = getAwsChunkedEncodingStream2(requestBody, {
        base64Encoder,
        bodyLengthChecker,
        checksumLocationName,
        checksumAlgorithmFn,
        streamHasher
      });
      updatedHeaders = {
        ...headers,
        "content-encoding": headers["content-encoding"] ? `${headers["content-encoding"]},aws-chunked` : "aws-chunked",
        "transfer-encoding": "chunked",
        "x-amz-decoded-content-length": headers["content-length"],
        "x-amz-content-sha256": "STREAMING-UNSIGNED-PAYLOAD-TRAILER",
        "x-amz-trailer": checksumLocationName
      };
      delete updatedHeaders["content-length"];
    } else if (!hasHeader2(checksumLocationName, headers)) {
      const rawChecksum = await stringHasher(checksumAlgorithmFn, requestBody);
      updatedHeaders = {
        ...headers,
        [checksumLocationName]: base64Encoder(rawChecksum)
      };
    }
  }
  const result = await next({
    ...args,
    request: {
      ...request2,
      headers: updatedHeaders,
      body: updatedBody
    }
  });
  const { requestValidationModeMember, responseAlgorithms } = middlewareConfig;
  if (requestValidationModeMember && input[requestValidationModeMember] === "ENABLED") {
    validateChecksumFromResponse(result.response, {
      config,
      responseAlgorithms
    });
  }
  return result;
};
var flexibleChecksumsMiddlewareOptions = {
  name: "flexibleChecksumsMiddleware",
  step: "build",
  tags: ["BODY_CHECKSUM"],
  override: true
};
var getFlexibleChecksumsPlugin = (config, middlewareConfig) => ({
  applyToStack: (clientStack) => {
    clientStack.add(flexibleChecksumsMiddleware(config, middlewareConfig), flexibleChecksumsMiddlewareOptions);
  }
});
var GetObjectCommand = class _GetObjectCommand extends Command {
  static getEndpointParameterInstructions() {
    return {
      Bucket: { type: "contextParams", name: "Bucket" },
      ForcePathStyle: { type: "clientContextParams", name: "forcePathStyle" },
      UseArnRegion: { type: "clientContextParams", name: "useArnRegion" },
      DisableMultiRegionAccessPoints: { type: "clientContextParams", name: "disableMultiregionAccessPoints" },
      Accelerate: { type: "clientContextParams", name: "useAccelerateEndpoint" },
      UseGlobalEndpoint: { type: "builtInParams", name: "useGlobalEndpoint" },
      UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
      Endpoint: { type: "builtInParams", name: "endpoint" },
      Region: { type: "builtInParams", name: "region" },
      UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" }
    };
  }
  constructor(input) {
    super();
    this.input = input;
  }
  resolveMiddleware(clientStack, configuration, options) {
    this.middlewareStack.use(getSerdePlugin(configuration, this.serialize, this.deserialize));
    this.middlewareStack.use(getEndpointPlugin(configuration, _GetObjectCommand.getEndpointParameterInstructions()));
    this.middlewareStack.use(getSsecPlugin(configuration));
    this.middlewareStack.use(getFlexibleChecksumsPlugin(configuration, {
      input: this.input,
      requestChecksumRequired: false,
      requestValidationModeMember: "ChecksumMode",
      responseAlgorithms: ["CRC32", "CRC32C", "SHA256", "SHA1"]
    }));
    const stack = clientStack.concat(this.middlewareStack);
    const { logger: logger2 } = configuration;
    const clientName = "S3Client";
    const commandName = "GetObjectCommand";
    const handlerExecutionContext = {
      logger: logger2,
      clientName,
      commandName,
      inputFilterSensitiveLog: GetObjectRequestFilterSensitiveLog,
      outputFilterSensitiveLog: GetObjectOutputFilterSensitiveLog
    };
    const { requestHandler } = configuration;
    return stack.resolve((request2) => requestHandler.handle(request2.request, options || {}), handlerExecutionContext);
  }
  serialize(input, context) {
    return se_GetObjectCommand(input, context);
  }
  deserialize(output, context) {
    return de_GetObjectCommand(output, context);
  }
};
var UploadPartCommand = class _UploadPartCommand extends Command {
  static getEndpointParameterInstructions() {
    return {
      Bucket: { type: "contextParams", name: "Bucket" },
      ForcePathStyle: { type: "clientContextParams", name: "forcePathStyle" },
      UseArnRegion: { type: "clientContextParams", name: "useArnRegion" },
      DisableMultiRegionAccessPoints: { type: "clientContextParams", name: "disableMultiregionAccessPoints" },
      Accelerate: { type: "clientContextParams", name: "useAccelerateEndpoint" },
      UseGlobalEndpoint: { type: "builtInParams", name: "useGlobalEndpoint" },
      UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
      Endpoint: { type: "builtInParams", name: "endpoint" },
      Region: { type: "builtInParams", name: "region" },
      UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" }
    };
  }
  constructor(input) {
    super();
    this.input = input;
  }
  resolveMiddleware(clientStack, configuration, options) {
    this.middlewareStack.use(getSerdePlugin(configuration, this.serialize, this.deserialize));
    this.middlewareStack.use(getEndpointPlugin(configuration, _UploadPartCommand.getEndpointParameterInstructions()));
    this.middlewareStack.use(getSsecPlugin(configuration));
    this.middlewareStack.use(getFlexibleChecksumsPlugin(configuration, {
      input: this.input,
      requestAlgorithmMember: "ChecksumAlgorithm",
      requestChecksumRequired: false
    }));
    const stack = clientStack.concat(this.middlewareStack);
    const { logger: logger2 } = configuration;
    const clientName = "S3Client";
    const commandName = "UploadPartCommand";
    const handlerExecutionContext = {
      logger: logger2,
      clientName,
      commandName,
      inputFilterSensitiveLog: UploadPartRequestFilterSensitiveLog,
      outputFilterSensitiveLog: UploadPartOutputFilterSensitiveLog
    };
    const { requestHandler } = configuration;
    return stack.resolve((request2) => requestHandler.handle(request2.request, options || {}), handlerExecutionContext);
  }
  serialize(input, context) {
    return se_UploadPartCommand(input, context);
  }
  deserialize(output, context) {
    return de_UploadPartCommand(output, context);
  }
};
function formatUrl(request2) {
  const { port, query } = request2;
  let { protocol, path: path2, hostname } = request2;
  if (protocol && protocol.slice(-1) !== ":") {
    protocol += ":";
  }
  if (port) {
    hostname += `:${port}`;
  }
  if (path2 && path2.charAt(0) !== "/") {
    path2 = `/${path2}`;
  }
  let queryString = query ? buildQueryString(query) : "";
  if (queryString && queryString[0] !== "?") {
    queryString = `?${queryString}`;
  }
  let auth = "";
  if (request2.username != null || request2.password != null) {
    const username = request2.username ?? "";
    const password = request2.password ?? "";
    auth = `${username}:${password}@`;
  }
  let fragment = "";
  if (request2.fragment) {
    fragment = `#${request2.fragment}`;
  }
  return `${protocol}//${auth}${hostname}${path2}${queryString}${fragment}`;
}
var UNSIGNED_PAYLOAD2 = "UNSIGNED-PAYLOAD";
var SHA256_HEADER2 = "X-Amz-Content-Sha256";
var S3RequestPresigner = class {
  constructor(options) {
    const resolvedOptions = {
      service: options.signingName || options.service || "s3",
      uriEscapePath: options.uriEscapePath || false,
      applyChecksum: options.applyChecksum || false,
      ...options
    };
    this.signer = new SignatureV4MultiRegion(resolvedOptions);
  }
  presign(requestToSign, { unsignableHeaders = /* @__PURE__ */ new Set(), unhoistableHeaders = /* @__PURE__ */ new Set(), ...options } = {}) {
    unsignableHeaders.add("content-type");
    Object.keys(requestToSign.headers).map((header) => header.toLowerCase()).filter((header) => header.startsWith("x-amz-server-side-encryption")).forEach((header) => {
      unhoistableHeaders.add(header);
    });
    requestToSign.headers[SHA256_HEADER2] = UNSIGNED_PAYLOAD2;
    const currentHostHeader = requestToSign.headers.host;
    const port = requestToSign.port;
    const expectedHostHeader = `${requestToSign.hostname}${requestToSign.port != null ? ":" + port : ""}`;
    if (!currentHostHeader || currentHostHeader === requestToSign.hostname && requestToSign.port != null) {
      requestToSign.headers.host = expectedHostHeader;
    }
    return this.signer.presign(requestToSign, {
      expiresIn: 900,
      unsignableHeaders,
      unhoistableHeaders,
      ...options
    });
  }
};
var getSignedUrl = async (client, command, options = {}) => {
  var _a, _b;
  let s3Presigner;
  if (typeof client.config.endpointProvider === "function") {
    const endpointV2 = await getEndpointFromInstructions(command.input, command.constructor, client.config);
    const authScheme = (_b = (_a = endpointV2.properties) == null ? void 0 : _a.authSchemes) == null ? void 0 : _b[0];
    s3Presigner = new S3RequestPresigner({
      ...client.config,
      signingName: authScheme == null ? void 0 : authScheme.signingName,
      region: async () => authScheme == null ? void 0 : authScheme.signingRegion
    });
  } else {
    s3Presigner = new S3RequestPresigner(client.config);
  }
  const presignInterceptMiddleware = (next, context) => async (args) => {
    const { request: request2 } = args;
    if (!HttpRequest.isInstance(request2)) {
      throw new Error("Request to be presigned is not an valid HTTP request.");
    }
    delete request2.headers["amz-sdk-invocation-id"];
    delete request2.headers["amz-sdk-request"];
    delete request2.headers["x-amz-user-agent"];
    const presigned2 = await s3Presigner.presign(request2, {
      ...options,
      signingRegion: options.signingRegion ?? context["signing_region"],
      signingService: options.signingService ?? context["signing_service"]
    });
    return {
      response: {},
      output: {
        $metadata: { httpStatusCode: 200 },
        presigned: presigned2
      }
    };
  };
  const middlewareName = "presignInterceptMiddleware";
  const clientStack = client.middlewareStack.clone();
  clientStack.addRelativeTo(presignInterceptMiddleware, {
    name: middlewareName,
    relation: "before",
    toMiddleware: "awsAuthMiddleware",
    override: true
  });
  const handler2 = command.resolveMiddleware(clientStack, client.config, {});
  const { output } = await handler2({ input: command.input });
  const { presigned } = output;
  return formatUrl(presigned);
};
var Bucket = process.env.BUCKET_NAME;
var completeMultipart$1 = ({
  ETags,
  UploadId,
  Key
}) => {
  return getS3Client().send(
    new CompleteMultipartUploadCommand({
      Bucket,
      Key,
      UploadId,
      MultipartUpload: {
        Parts: ETags.map((ETag, i5) => ({
          ETag,
          PartNumber: i5 + 1
        }))
      }
    })
  );
};
var getPutPartUrl$1 = (options) => getSignedUrl(
  getS3Client(),
  new UploadPartCommand({
    Bucket,
    Key: options.Key,
    UploadId: options.UploadId,
    PartNumber: options.PartNumber
  }),
  {
    expiresIn: options.expiresIn
  }
);
var createMultipart = async (directory) => {
  let Key = randomUUID();
  Key = directory ? directory + Key : Key;
  const { UploadId } = await getS3Client().send(
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
var getReadURL$1 = async (Key, expiresIn = 3600) => {
  return getSignedUrl(
    getS3Client(),
    new GetObjectCommand({
      Bucket,
      Key
    }),
    { expiresIn }
  );
};
var s3Client;
function getS3Client() {
  s3Client ?? (s3Client = new S3Client({
    region: process.env.AWS_REGION,
    endpoint: process.env.AWS_ENDPOINT_URL_S3
  }));
  return s3Client;
}
var CREATE_MULTIPART_STRING$1 = "create_multipart_upload";
var CREATE_PUT_PART_URL_STRING$1 = "create_put_part_url";
var COMPLETE_MULTIPART_STRING$1 = "complete_multipart_upload";
var handler = async (request2, cb2) => {
  const body = await request2.json();
  switch (body.intent) {
    case CREATE_MULTIPART_STRING$1:
      return new Response(
        JSON.stringify(await createMultipart(body.directory))
      );
    case CREATE_PUT_PART_URL_STRING$1:
      return new Response(
        await getPutPartUrl$1({
          Key: body.key,
          UploadId: body.uploadId,
          PartNumber: body.partNumber
        })
      );
    case COMPLETE_MULTIPART_STRING$1:
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
      return typeof cb2 === "function" ? cb2(complete) : new Response(JSON.stringify(complete));
    default:
      return new Response(null);
  }
};
/*! Bundled license information:

tslib/tslib.es6.js:
  (*! *****************************************************************************
  Copyright (c) Microsoft Corporation.
  
  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.
  
  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** *)
*/
(module.exports == null ? {} : module.exports).default || module.exports;
(module.exports == null ? {} : module.exports).p5;
(module.exports == null ? {} : module.exports).convertToBuffer;
(module.exports == null ? {} : module.exports).isEmptyData;
(module.exports == null ? {} : module.exports).numToUint8;
(module.exports == null ? {} : module.exports).uint32ArrayFrom;
(module.exports == null ? {} : module.exports).AwsCrc32;
(module.exports == null ? {} : module.exports).crc32;
(module.exports == null ? {} : module.exports).Crc32;
(module.exports == null ? {} : module.exports).isExist;
(module.exports == null ? {} : module.exports).isEmptyObject;
(module.exports == null ? {} : module.exports).merge;
(module.exports == null ? {} : module.exports).getValue;
(module.exports == null ? {} : module.exports).isName;
(module.exports == null ? {} : module.exports).getAllMatches;
(module.exports == null ? {} : module.exports).nameRegexp;
(module.exports == null ? {} : module.exports).validate;
(module.exports == null ? {} : module.exports).buildOptions;
(module.exports == null ? {} : module.exports).defaultOptions;
(module.exports == null ? {} : module.exports).prettify;
(module.exports == null ? {} : module.exports).AwsCrc32c;
(module.exports == null ? {} : module.exports).crc32c;
(module.exports == null ? {} : module.exports).Crc32c;
const fetchVideo = async (storageKey) => {
  const tempPath = `conversiones/${randomUUID()}/${storageKey}`;
  const getURL = await getReadURL$1(storageKey);
  const response2 = await fetch(getURL).catch((e5) => console.error(e5));
  console.log("FILE_FETCHED::", response2 == null ? void 0 : response2.ok, storageKey);
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
const S3 = new S3Client$1({
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
  ).then((r5) => {
    console.log("::FILE_EXIST:: ", r5.ContentType);
    return true;
  }).catch((err) => {
    console.error("FILE_MAY_NOT_EXIST", key, err.message);
    return false;
  });
};
const getReadURL = async (key, expiresIn = 3600) => {
  await setCors();
  const command = new GetObjectCommand$1({
    Bucket: process.env.BUCKET_NAME,
    Key: PREFIX + key
  });
  return await getSignedUrl$1(S3, command, { expiresIn });
};
const getPutFileUrl = async (key) => {
  await setCors();
  return await getSignedUrl$1(
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
  return await getSignedUrl$1(
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
const forkChild = (scriptPath, args = [], cb2) => {
  const child = fork(scriptPath, ["niño", ...args]);
  child.on("error", (e5) => console.error(e5));
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
  }).catch((e5) => console.error(e5));
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
  cb: cb2,
  checkExistance,
  when = "in 1 second",
  onError
}) => {
  if (checkExistance) {
    const listPath = path.join(CHUNKS_FOLDER$1, storageKey, `${sizeName}.m3u8`);
    const exist = await fileExist(listPath);
    if (exist) {
      console.log("AVOIDING_VERSION::", sizeName);
      cb2 == null ? void 0 : cb2(null);
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
      cb2 == null ? void 0 : cb2(outputFolder);
    }).save(playListPath);
  });
  await agenda.start();
  await agenda.schedule(when, "generate_hls_chunks", { storageKey });
};
const uploadChunks = async (tempFolder, cleanUp2 = true, cb2) => {
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
  await (cb2 == null ? void 0 : cb2());
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
  const c5 = content.split("\n");
  const segmentNames = content.split("\n").filter((text) => text.includes(".ts"));
  const links2 = segmentNames.map((name) => {
    return `/playlist/${storageKey}/${name}`;
  });
  segmentNames.forEach((name, index) => {
    const i5 = c5.findIndex((text) => text === name);
    c5[i5] = links2[index];
  });
  const joined = c5.join("\n");
  return joined;
};
const CHUNKS_FOLDER = "chunks";
const loader$7 = async ({ request: request2, params }) => {
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
function Route$6() {
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
          onChange: (e5) => setRotate(e5.target.checked ? 200 : 0)
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
  default: Route$6
}, Symbol.toStringTag, { value: "Module" }));
async function action$8({ request: request2, params }) {
  await getAdminUserOrRedirect(request2);
  return await handler(request2, async ({ key }) => {
    const storageKey = key.replace("animaciones/", "");
    await db.video.update({
      where: {
        id: params.videoId
      },
      data: {
        storageKey,
        storageLink: "/videos?storageKey=" + storageKey
      }
    });
    return new Response("{ok:true}");
  });
}
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$8
}, Symbol.toStringTag, { value: "Module" }));
const isDev$2 = process.env.NODE_ENV === "development";
const stripe = new Stripe(
  isDev$2 ? process.env.STRIPE_SECRET_KEY_DEV || "" : process.env.STRIPE_SECRET_KEY,
  {
    // apiVersion: "2020-08-27",
  }
);
const action$7 = async ({ request: request2 }) => {
  var _a, _b, _c, _d, _e, _f;
  if (request2.method !== "POST") return json(null, { status: 400 });
  const payload = await request2.text();
  const webhookStripeSignatureHeader = request2.headers.get("stripe-signature") || "";
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
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$7
}, Symbol.toStringTag, { value: "Module" }));
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const COURSE_ID = "645d3dbd668b73b34443789c";
const action$6 = async ({ request: request2 }) => {
  const formData = await request2.formData();
  const intent = formData.get("intent");
  if (intent === "new") {
    const email = formData.get("email");
    z$1.string().email().parse(email);
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
const loader$6 = async ({ request: request2 }) => {
  await getAdminUserOrRedirect(request2);
  const url = new URL(request2.url);
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
function Route$5() {
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
  const handleSubmit = (e5) => {
    setMode("default");
    fetcher.submit(
      { intent: "new", email: e5.currentTarget.email.value },
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
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Row,
  action: action$6,
  default: Route$5,
  loader: loader$6
}, Symbol.toStringTag, { value: "Module" }));
const PDFViewer = void 0;
createTw({});
function Route$4() {
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs(Suspense, { fallback: /* @__PURE__ */ jsx(Fragment, { children: "cargando..." }), children: [
    /* @__PURE__ */ jsx(PDFViewer, {}),
    ";"
  ] }) });
}
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Route$4
}, Symbol.toStringTag, { value: "Module" }));
const ToggleButton = () => {
  const [enabled, setEnabled] = useState(false);
  const toggle = () => {
    const val2 = !enabled;
    const main = document.documentElement;
    if (val2) {
      main == null ? void 0 : main.classList.add("dark");
    } else {
      main == null ? void 0 : main.classList.remove("dark");
    }
    setEnabled(val2);
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
  as: as2,
  to = "",
  onClick,
  ...props
}) => {
  const Element = as2 === "Link" ? Link : "button";
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
const sleep$1 = (s5) => new Promise((r5) => setTimeout(r5, s5 * 1e3));
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
    const r5 = jwt.verify(token, secret);
    result = { ...r5, success: true };
  } catch (e5) {
    result = { success: false };
  }
  return result;
};
const action$5 = async ({ request: request2 }) => {
  const url = new URL(request2.url);
  const formData = await request2.formData();
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
const loader$5 = async ({ request: request2 }) => {
  const url = new URL(request2.url);
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
  const user = await getCanShareUserORNull("645d3dbd668b73b34443789c", request2);
  if (user == null ? void 0 : user.email) {
    const token = getToken(user.email);
    return {
      screen: "default",
      link: generateLink(token)
    };
  }
  return redirect("/");
};
function Route$3() {
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
  default: Route$3,
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
  const z22 = useSpring(0, { bounce: 0 });
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
              z: z22,
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
              setOpen((o5) => !o5);
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
  useMotionValueEvent(scrollY, "change", (val2) => {
    if (val2 < prev.current) {
      setDirection(-1);
    } else if (val2 > prev.current) {
      setDirection(1);
    }
    prev.current = val2;
  });
  return direction;
};
const useMarquee = (reversed = false) => {
  const direction = useScrollDirection();
  const x3 = useMotionValue(0);
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
    const v3 = x3.get();
    x3.set(v3 + moveBy);
    if (rect1 && v3 > 0) {
      x3.set(-rect1.width / 2);
      return;
    }
    if (rect1 && v3 < -(rect1.width / 2)) {
      x3.set(0);
      return;
    }
  };
  useAnimationFrame(move);
  return { ref, x: x3 };
};
const Marquee = ({
  children,
  reversed,
  className = "bg-dark "
}) => {
  const { x: x3, ref } = useMarquee(reversed);
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("article", { className: cn("flex justify-center items-center", className), children: /* @__PURE__ */ jsx("div", { className: "h-16 md:h-20 flex items-center text-gray-100  text-2xl lg:text-3xl font-extrabold overflow-hidden", children: /* @__PURE__ */ jsxs(motion$1.div, { style: { x: x3 }, className: "whitespace-nowrap", ref, children: [
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
      onMouseMove: (e5) => mouseX.set(e5.pageX),
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
  let distance = useTransform(mouseX, (val2) => {
    var _a;
    let bounds = ((_a = ref.current) == null ? void 0 : _a.getBoundingClientRect()) ?? { x: 0, width: 0 };
    return val2 - bounds.x - bounds.width / 2;
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
  const handleMouseMove = (e5) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x3 = (e5.clientX - left - width / 2) / 25;
    const y3 = (e5.clientY - top - height / 2) / 25;
    containerRef.current.style.transform = `rotateY(${x3}deg) rotateX(${y3}deg)`;
  };
  const handleMouseEnter = (e5) => {
    setIsMouseEntered(true);
    if (!containerRef.current) return;
  };
  const handleMouseLeave = (e5) => {
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
            /* @__PURE__ */ jsx("h3", { className: "text-2xl text-wvil text-dark dark:text-white font-semibold", children: "Más y más componentes 🔥" }),
            /* @__PURE__ */ jsxs("p", { className: "  dark:text-metal text-iron font-light mt-2", children: [
              "Seguiremos agregado componentes durante el año, así que después de que lo termines",
              " ",
              /* @__PURE__ */ jsx("span", { className: "text-iron dark:text-white/70 font-semibold", children: "regresa de vez en cuando a ver que hay de nuevo." })
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
const action$4 = async ({ request: request2 }) => {
  const isDev2 = process.env.NODE_ENV === "development";
  const formData = await request2.formData();
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
    const user = await getUserORNull(request2);
    return { user: { email: user == null ? void 0 : user.email } };
  }
  return null;
};
const meta$1 = () => getMetaTags({
  title: "Curso de animaciones con React | Fixtergeek ",
  description: "Crea tus propios componentes animados con React, Vite y Motion"
});
function Route$2({ children }) {
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
  default: Route$2,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
const useClickOutside = ({
  isActive,
  onOutsideClick,
  includeEscape
}) => {
  const ref = useRef(null);
  const handleClick = (e5) => {
    var _a;
    return !((_a = ref.current) == null ? void 0 : _a.contains(e5.target)) && (onOutsideClick == null ? void 0 : onOutsideClick(e5));
  };
  const handleKey = (e5) => {
    if (e5.key === "Escape") {
      onOutsideClick == null ? void 0 : onOutsideClick(e5);
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
  const x3 = useMotionValue(0);
  const springX = useSpring(x3, { bounce: 0.2 });
  const buttonX = useTransform(springX, [-400, 0], [0, 394]);
  const [completed, setCompleted] = useState([]);
  const [videosCompleted, setVideosCompleted] = useState([]);
  useEffect(() => {
    isOpen ? x3.set(0) : x3.set(-400);
  }, [isOpen, x3]);
  const checkIfWatched = (slug) => {
    if (typeof window === "undefined") return;
    let list = localStorage.getItem("watched") || "[]";
    list = JSON.parse(list);
    return list.includes(slug);
  };
  useEffect(() => {
    const list = [];
    moduleNames.map((moduleName) => {
      const allCompleted = videos.filter((vi) => vi.moduleName === moduleName).every((v3) => checkIfWatched(v3.slug));
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
        onToggle: () => setIsOpen((o5) => !o5),
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
              videos.filter((vid) => vid.moduleName === moduleName).sort((a5, b5) => a5.index < b5.index ? -1 : 1).map((v3) => /* @__PURE__ */ jsx(
                ListItem,
                {
                  isLocked: v3.isPublic ? false : isLocked,
                  isCompleted: videosCompleted.includes(v3.slug),
                  isCurrent: currentVideoSlug === v3.slug,
                  slug: v3.slug || "",
                  title: v3.title || "",
                  duration: v3.duration || 60
                },
                v3.id
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
    const m5 = duration2[0];
    const s5 = duration2[1] ? `.${Math.floor(Number(`.${duration2[1]}`) * 60)}` : "";
    return m5 + s5 + "m";
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
  x: x3 = 0,
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
        x: x3,
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
  x: x3 = 0,
  onToggle
}) => {
  return /* @__PURE__ */ jsx(
    motion$1.button,
    {
      whileHover: { scale: 1.05 },
      style: { x: x3 },
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
                    onError: (e5) => {
                      e5.target.onerror = null;
                      e5.target.src = POSTER;
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
const sleep = (t3 = 1) => new Promise((r5) => setTimeout(r5, t3 * 1e3));
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
  const x3 = useMotionValue(0);
  const springX = useSpring(x3, { bounce: 0.2 });
  const buttonX = useTransform(springX, [-400, 0], [0, 394]);
  useEffect(() => {
    isOpen ? x3.set(0) : x3.set(-400);
  }, [isOpen, x3]);
  return /* @__PURE__ */ jsxs("div", { className: "bg-[#141518] h-full ", children: [
    /* @__PURE__ */ jsx(
      MenuButton,
      {
        x: buttonX,
        onToggle: () => setIsOpen((o5) => !o5),
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
  x: x3 = 0,
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
        x: x3,
        scrollbarWidth: "none",
        maskImage
      },
      className: "md:w-[380px] w-[300px] fixed  rounded-xl overflow-y-scroll h-[88%] bg-[#141518] top-0 left-0 pt-20 z-10",
      children
    }
  );
};
const MenuButton = ({
  isOpen,
  x: x3 = 0,
  onToggle
}) => {
  return /* @__PURE__ */ jsx(
    motion$1.button,
    {
      whileHover: { scale: 1.05 },
      style: { x: x3 },
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
const action$3 = async ({ request: request2 }) => {
  const formData = await request2.formData();
  const intent = formData.get("intent");
  if (intent === "checkout") {
    const url = await get40Checkout();
    return redirect$1(url);
  }
  return null;
};
const loader$4 = async ({ request: request2 }) => {
  const url = new URL(request2.url);
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
  const user = await getUserORNull(request2);
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
function Route$1() {
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
          moduleNames: moduleNames.filter((n5) => typeof n5 === "string"),
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
  default: Route$1,
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
const action$2 = async ({ request: request2 }) => {
  const formData = await request2.formData();
  const intent = formData.get("intent");
  if (intent === "magic_link") {
    const email = String(formData.get("email"));
    const parsed = z$1.string().email().safeParse(email);
    if (!parsed.success) return { error: "El email es incorrecto" };
    const { error } = await sendMagicLink(email);
    return { error, success: !error };
  }
  if (intent === "sign-out") {
    const session = await getSession(request2.headers.get("Cookie"));
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
    await setSessionWithEmailAndRedirect(user.email, { request: request2 });
  }
  return null;
};
const loader$3 = async ({ request: request2 }) => {
  const url = new URL(request2.url);
  const token = url.searchParams.get("token");
  const next = url.searchParams.get("next");
  if (token) {
    const verified = verifyToken(token);
    if (!verified.success || !verified.decoded)
      return { screen: "wrong_token" };
    const { email } = verified.decoded;
    await confirmUser(email);
    return await setSessionWithEmailAndRedirect(email, {
      request: request2,
      redirectURL: next || void 0
    });
  }
  const user = await getUserORNull(request2);
  if (user) {
    return redirect("/player");
  }
  return { screen: "login" };
};
function Route() {
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
  default: Route,
  loader: loader$3
}, Symbol.toStringTag, { value: "Module" }));
const loader$2 = async ({ request: request2 }) => {
  const url = new URL(request2.url);
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
  } catch (e5) {
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
  const list = await fetch(MACHINES_API_URL, init).then((r5) => r5.json());
  return list[0].config.image;
};
const Dragger = ({
  onPointerDown
}) => {
  return /* @__PURE__ */ jsx(
    motion.button,
    {
      whileTap: { cursor: "grabbing", boxShadow: "0px 0px 24px 0px gray" },
      className: "cursor-grab py-px pr-px shadow-[unset] text-xl text-gray-900",
      onPointerDown: (e5) => {
        e5.stopPropagation();
        onPointerDown == null ? void 0 : onPointerDown(e5);
      },
      children: /* @__PURE__ */ jsx(GrDrag, {})
    }
  );
};
const Video = ({
  video,
  onClick,
  onReorder
}) => {
  const fetcher = useFetcher();
  const controls = useDragControls();
  const handleDragEnd = (event, _) => {
    const all = document.elementsFromPoint(
      event.clientX,
      event.clientY
    );
    const found = all.find(
      (node) => node.dataset.videoindex && node.dataset.videoindex !== String(video.index)
    );
    if (found) {
      onReorder == null ? void 0 : onReorder(Number(video.index), Number(found.dataset.videoindex));
      fetcher.submit(
        {
          intent: "update_video",
          data: JSON.stringify([{}])
          // @todo
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
        /* @__PURE__ */ jsx(
          Dragger,
          {
            onPointerDown: (event) => {
              controls.start(event);
            }
          }
        ),
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
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const value = form.get("title");
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
    const all = document.elementsFromPoint(
      event.clientX,
      event.clientY
    );
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
              onClick: () => setIsOpen((o5) => !o5),
              children: isOpen ? /* @__PURE__ */ jsx(FaChevronDown, {}) : /* @__PURE__ */ jsx(FaChevronUp, {})
            }
          )
        ] }),
        isOpen && /* @__PURE__ */ jsxs("section", { className: "min-h-20 bg-slate-300 p-4 flex flex-col gap-2 group", children: [
          videos.length < 1 && /* @__PURE__ */ jsx("p", { className: "text-center py-6", children: "No hay videos" }),
          videos.sort((a5, b5) => a5.index < b5.index ? -1 : 1).map((video, index2) => /* @__PURE__ */ jsx(
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
    }).catch((e5) => console.error(e5));
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
  const handleInputChange = (e5) => {
    setPreview(e5.currentTarget.value);
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
function getDefaultExportFromCjs(x3) {
  return x3 && x3.__esModule && Object.prototype.hasOwnProperty.call(x3, "default") ? x3["default"] : x3;
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
      var val2;
      try {
        val2 = fn(bail, num);
      } catch (err) {
        onError(err, num);
        return;
      }
      Promise.resolve(val2).then(resolve).catch(function catchIt(err) {
        onError(err, num);
      });
    }
    op.attempt(runAttempt);
  }
  return new Promise(run);
}
var lib = retry;
const retry$1 = /* @__PURE__ */ getDefaultExportFromCjs(lib);
var CREATE_MULTIPART_STRING = "create_multipart_upload";
var CREATE_PUT_PART_URL_STRING = "create_put_part_url";
var COMPLETE_MULTIPART_STRING = "complete_multipart_upload";
var MB = 1024 * 1024;
var PART_SIZE = 8 * MB;
var createMultipartUpload = async (handler2 = "/api/upload", directory) => {
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
var getPutPartUrl = async ({
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
var uploadOnePartRetry = async ({
  attempts = 1,
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
var uploadAllParts = async (options) => {
  const { file, numberOfParts, uploadId, key, onUploadProgress, handler: handler2 } = options;
  let loaded = 0;
  const uploadPromises = Array.from({ length: numberOfParts }).map(
    async (_, i5) => {
      const url = await getPutPartUrl({
        partNumber: i5 + 1,
        uploadId,
        key,
        handler: handler2
      });
      const start = i5 * PART_SIZE;
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
var completeMultipart = async (args) => {
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
var useUploadMultipart = (options) => {
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
  const videoRef = useRef(null);
  const [videoSrc, setVideoSrc] = useState(video.storageLink || "");
  const [uploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const handleFileSelection = async (e5) => {
    var _a;
    if (!((_a = e5.currentTarget.files) == null ? void 0 : _a.length)) return;
    const file = e5.currentTarget.files[0];
    if ("type" in file && (file.type === "video/mp4" || file.type === "video/quicktime")) {
      setVideoSrc(URL.createObjectURL(file));
      uploadFileHandler(file);
    } else {
      return console.error("No file selected");
    }
  };
  const { upload } = useUploadMultipart({
    handler: "/api/upload/" + video.id,
    onUploadProgress: ({ percentage }) => setProgress(percentage)
  });
  const uploadFileHandler = async (file) => {
    setIsUploading(true);
    const { key } = await upload("animaciones/video-", file);
    const modKey = key.replace("animaciones/", "");
    setValue("storageKey", modKey);
    setValue("storageLink", "/files?storageKey=" + modKey);
    setIsUploading(false);
  };
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
            accept: "video/mp4,video/x-m4v,video/*",
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
  var _a;
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
    if (!confirm("Esta operación gasta recursos, ¿estás segura de continuar?"))
      return;
    if (!video.id || !video.storageKey)
      return alert("ABORTANDO::No existe video");
    return fetcher.submit(
      { intent: "experiment", storageKey: video.storageKey },
      { method: "POST" }
      // @todo add action and change for generate_video_versions
    );
  };
  const data = fetcher.data || {
    playListURL: null
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
        data.playListURL && /* @__PURE__ */ jsx("video", { controls: true, className: "aspect-video", children: /* @__PURE__ */ jsx("source", { src: data.playListURL, type: "application/x-mpegURL" }) }),
        video.storageKeys && video.storageKeys.length > 0 && /* @__PURE__ */ jsxs("div", { className: "text-white dark:text-black mb-2", children: [
          /* @__PURE__ */ jsx("p", { children: "Otras versiones:" }),
          /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: (_a = video.m3u8) == null ? void 0 : _a.map((k5) => /* @__PURE__ */ jsx("p", { children: k5 }, k5)) })
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
const VideoFormDrawer = ({
  setShowVideoDrawer,
  setVideo,
  showVideoDrawer,
  video,
  initialVideo: initialVideo2,
  // @review
  videos
}) => {
  return /* @__PURE__ */ jsx(
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
            setVideo(video);
            setShowVideoDrawer(false);
          },
          video: video || initialVideo2,
          videosLength: videos.length
        }
      )
    }
  );
};
const action$1 = async ({ request: request2 }) => {
  const formData = await request2.formData();
  const intent = formData.get("intent");
  const url = new URL(request2.url);
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
const loader$1 = async ({ request: request2 }) => {
  const user = await getUserOrRedirect({ request: request2 });
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
  const moduleNamesOrder = course.moduleNamesOrder.length ? [...course.moduleNamesOrder].filter(Boolean) : [...new Set(videos.filter(Boolean).map((video) => video.moduleName))];
  return { course, videos, moduleNamesOrder };
};
const initialVideo = {
  title: "Nuevo video",
  moduleName: ""
};
function Page() {
  const fetcher = useFetcher();
  const { course, moduleNamesOrder, videos } = useLoaderData();
  const [video, setVideo] = useState(initialVideo);
  const [showVideoDrawer, setShowVideoDrawer] = useState(false);
  const [modules, setModules] = useState(moduleNamesOrder);
  const handleNewModuleNameSubmit = (e5) => {
    e5.preventDefault();
    const elements = new FormData(e5.currentTarget);
    const name = String(elements.get("name"));
    if (!name) return;
    setModules((ms) => [...ms, name]);
  };
  const handleAddVideo = (moduleName) => {
    setShowVideoDrawer(true);
    setVideo((v3) => ({ ...v3, moduleName }));
  };
  const handleVideoEdit = (video2) => {
    setVideo(video2);
    setShowVideoDrawer(true);
  };
  const handleModuleTitleUpdate = (prev, nuevo) => {
    setModules((m5) => m5.map((mod) => mod === prev ? nuevo : mod));
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
    /* @__PURE__ */ jsx(
      VideoFormDrawer,
      {
        setShowVideoDrawer,
        setVideo,
        showVideoDrawer,
        video,
        initialVideo,
        videos
      }
    ),
    /* @__PURE__ */ jsxs("article", { className: "bg-gradient-to-tr from-slate-950 to-indigo-950 min-h-screen py-20 px-8", children: [
      /* @__PURE__ */ jsx(Header, { course, onSubmit: handleNewModuleNameSubmit }),
      /* @__PURE__ */ jsx(LayoutGroup, { children: /* @__PURE__ */ jsx("section", { className: "my-8 grid gap-4 max-w-7xl mx-auto grid-cols-1 lg:grid-cols-3", children: modules.map((moduleTitle, i5) => /* @__PURE__ */ jsx(
        Module,
        {
          onModuleOrderUpdate: handleModuleOrderUpdate,
          index: i5,
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
    ] })
  ] });
}
const Header = ({
  course,
  onSubmit
}) => {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("h1", { className: "text-gray-50 text-2xl mb-6", children: course.title }),
    /* @__PURE__ */ jsxs("form", { onSubmit, className: "flex items-center justify-end gap-4", children: [
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
    ] })
  ] });
};
const route13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$1,
  default: Page,
  loader: loader$1
}, Symbol.toStringTag, { value: "Module" }));
const loader = async ({ request: request2 }) => {
  const url = new URL(request2.url);
  const storageKey = url.searchParams.get("storageKey");
  if (!storageKey) throw json(null, { status: 404 });
  const readURL = await getReadURL(storageKey);
  return redirect(readURL);
};
const route14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader
}, Symbol.toStringTag, { value: "Module" }));
const action = async ({ request: request2 }) => {
  const formData = await request2.formData();
  const intent = formData.get("intent");
  if (intent === "self") {
    return await getUserORNull(request2);
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
const serverManifest = { "entry": { "module": "/assets/entry.client-CCGzSxVf.js", "imports": ["/assets/jsx-runtime-DYkViK2L.js", "/assets/components-BMN4foKF.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/root-Dh7q1qcu.js", "imports": ["/assets/jsx-runtime-DYkViK2L.js", "/assets/components-BMN4foKF.js"], "css": ["/assets/root-ZWg_3INu.css"] }, "routes/playlist.$storageKey.index[.]m3u8": { "id": "routes/playlist.$storageKey.index[.]m3u8", "parentId": "root", "path": "playlist/:storageKey/index.m3u8", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/playlist._storageKey.index_._m3u8-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/playlist.$storageKey.$segment": { "id": "routes/playlist.$storageKey.$segment", "parentId": "root", "path": "playlist/:storageKey/:segment", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/playlist._storageKey._segment-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/learnings.primer_ejemplo": { "id": "routes/learnings.primer_ejemplo", "parentId": "root", "path": "learnings/primer_ejemplo", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/learnings.primer_ejemplo-BP6EnT0i.js", "imports": ["/assets/jsx-runtime-DYkViK2L.js", "/assets/proxy-CV3wXh37.js"], "css": [] }, "routes/api.upload.$videoId": { "id": "routes/api.upload.$videoId", "parentId": "routes/api", "path": "upload/:videoId", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.upload._videoId-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/stripe.webhook": { "id": "routes/stripe.webhook", "parentId": "root", "path": "stripe/webhook", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/stripe.webhook-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/admin_.users": { "id": "routes/admin_.users", "parentId": "root", "path": "admin/users", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/admin_.users-BeA8G82C.js", "imports": ["/assets/jsx-runtime-DYkViK2L.js", "/assets/utils-D7At0r7h.js", "/assets/components-BMN4foKF.js"], "css": [] }, "routes/ebook[.]pdf": { "id": "routes/ebook[.]pdf", "parentId": "root", "path": "ebook.pdf", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/ebook_._pdf-BIKnfy03.js", "imports": ["/assets/jsx-runtime-DYkViK2L.js", "/assets/tslib.es6-mnf4cu7N.js"], "css": [] }, "routes/comunidad": { "id": "routes/comunidad", "parentId": "root", "path": "comunidad", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/comunidad-BsEbSyH1.js", "imports": ["/assets/comunidad-8qaXiqkO.js", "/assets/jsx-runtime-DYkViK2L.js", "/assets/PrimaryButton-BuUOKRux.js", "/assets/utils-D7At0r7h.js", "/assets/components-BMN4foKF.js"], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-BaGJTkhn.js", "imports": ["/assets/jsx-runtime-DYkViK2L.js", "/assets/utils-D7At0r7h.js", "/assets/PrimaryButton-BuUOKRux.js", "/assets/index-MSxA10Hv.js", "/assets/use-spring-Bdr5e5lf.js", "/assets/comunidad-8qaXiqkO.js", "/assets/components-BMN4foKF.js"], "css": [] }, "routes/player": { "id": "routes/player", "parentId": "root", "path": "player", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/player-CYq_FN_x.js", "imports": ["/assets/jsx-runtime-DYkViK2L.js", "/assets/comunidad-8qaXiqkO.js", "/assets/PrimaryButton-BuUOKRux.js", "/assets/index-BoL28IBb.js", "/assets/utils-D7At0r7h.js", "/assets/use-spring-Bdr5e5lf.js", "/assets/components-BMN4foKF.js", "/assets/index-MSxA10Hv.js"], "css": ["/assets/player-8Qs7Jhiv.css"] }, "routes/portal": { "id": "routes/portal", "parentId": "root", "path": "portal", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/portal-t4aPDzyD.js", "imports": ["/assets/jsx-runtime-DYkViK2L.js", "/assets/tslib.es6-mnf4cu7N.js", "/assets/utils-D7At0r7h.js", "/assets/comunidad-8qaXiqkO.js", "/assets/components-BMN4foKF.js", "/assets/PrimaryButton-BuUOKRux.js"], "css": [] }, "routes/videos": { "id": "routes/videos", "parentId": "root", "path": "videos", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/videos-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/admin": { "id": "routes/admin", "parentId": "root", "path": "admin", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/admin-CN9-Pj6P.js", "imports": ["/assets/jsx-runtime-DYkViK2L.js", "/assets/index-BoL28IBb.js", "/assets/PrimaryButton-BuUOKRux.js", "/assets/proxy-CV3wXh37.js", "/assets/utils-D7At0r7h.js", "/assets/components-BMN4foKF.js", "/assets/index-MSxA10Hv.js"], "css": [] }, "routes/files": { "id": "routes/files", "parentId": "root", "path": "files", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/files-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api": { "id": "routes/api", "parentId": "root", "path": "api", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api-l0sNRNKZ.js", "imports": [], "css": [] } }, "url": "/assets/manifest-6e5a5363.js", "version": "6e5a5363" };
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
  "routes/api.upload.$videoId": {
    id: "routes/api.upload.$videoId",
    parentId: "routes/api",
    path: "upload/:videoId",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/stripe.webhook": {
    id: "routes/stripe.webhook",
    parentId: "root",
    path: "stripe/webhook",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/admin_.users": {
    id: "routes/admin_.users",
    parentId: "root",
    path: "admin/users",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/ebook[.]pdf": {
    id: "routes/ebook[.]pdf",
    parentId: "root",
    path: "ebook.pdf",
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
