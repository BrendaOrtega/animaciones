import { jsx, Fragment, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@remix-run/node";
import {
  RemixServer,
  Meta,
  Links,
  Outlet,
  ScrollRestoration,
  Scripts,
  Form,
  redirect,
  useLoaderData,
  json,
  Link,
  useFetcher,
} from "@remix-run/react";
import * as isbotModule from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";
import { twMerge } from "tailwind-merge";
import {
  useEffect,
  Children,
  useRef,
  useState,
  createContext,
  useContext,
} from "react";
import {
  useAnimate,
  stagger,
  motion,
  useAnimationControls,
  useInView,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useMotionValue,
  useVelocity,
  useSpring,
  useTransform,
  useAnimationFrame,
  useMotionTemplate,
} from "framer-motion";
import { clsx } from "clsx";
import { FaReact, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { RiTailwindCssFill } from "react-icons/ri";
import { Switch, Tab } from "@headlessui/react";
import { IoIosArrowDown, IoMdLock, IoIosClose } from "react-icons/io";
import {
  FaLinkedin,
  FaGithub,
  FaYoutube,
  FaSquareXTwitter,
  FaPlay,
  FaGooglePlay,
} from "react-icons/fa6";
import { BsMenuButtonWide } from "react-icons/bs";
import {
  MdOutlineRadioButtonChecked,
  MdOutlineRadioButtonUnchecked,
  MdMenuOpen,
} from "react-icons/md";
import JSConfetti from "js-confetti";
import { IoClose } from "react-icons/io5";
import { useForm } from "react-hook-form";
import slugify from "slugify";
const ABORT_DELAY = 5e3;
function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  remixContext,
  loadContext
) {
  let prohibitOutOfOrderStreaming =
    isBotRequest(request.headers.get("user-agent")) || remixContext.isSpaMode;
  return prohibitOutOfOrderStreaming
    ? handleBotRequest(
        request,
        responseStatusCode,
        responseHeaders,
        remixContext
      )
    : handleBrowserRequest(
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
function handleBotRequest(
  request,
  responseStatusCode,
  responseHeaders,
  remixContext
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(RemixServer, {
        context: remixContext,
        url: request.url,
        abortDelay: ABORT_DELAY,
      }),
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
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
        },
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(
  request,
  responseStatusCode,
  responseHeaders,
  remixContext
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(RemixServer, {
        context: remixContext,
        url: request.url,
        abortDelay: ABORT_DELAY,
      }),
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
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
        },
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ Object.defineProperty(
    {
      __proto__: null,
      default: handleRequest,
    },
    Symbol.toStringTag,
    { value: "Module" }
  )
);
function App() {
  return /* @__PURE__ */ jsx(Fragment, {
    children: /* @__PURE__ */ jsxs("html", {
      suppressHydrationWarning: true,
      children: [
        /* @__PURE__ */ jsxs("head", {
          children: [
            /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
            /* @__PURE__ */ jsx("meta", {
              name: "viewport",
              content: "width=device-width, initial-scale=1",
            }),
            /* @__PURE__ */ jsx(Meta, {}),
            /* @__PURE__ */ jsx(Links, {}),
          ],
        }),
        /* @__PURE__ */ jsxs("body", {
          suppressHydrationWarning: true,
          children: [
            /* @__PURE__ */ jsx(Outlet, {}),
            /* @__PURE__ */ jsx(ScrollRestoration, {}),
            /* @__PURE__ */ jsx(Scripts, {}),
          ],
        }),
      ],
    }),
  });
}
const route0 = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ Object.defineProperty(
    {
      __proto__: null,
      default: App,
    },
    Symbol.toStringTag,
    { value: "Module" }
  )
);
let db;
if (process.env.NODE_ENV === "production") {
  db = new PrismaClient();
} else {
  if (!global.__db) {
    global.__db = new PrismaClient();
  }
  db = global.__db;
}
const getOrCreateUser = async ({ email, displayName, username }) => {
  const exist = await db.user.findUnique({
    where: {
      email,
    },
  });
  if (exist) return exist;
  return await db.create({ data: { email, displayName, username } });
};
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2020-08-27",
});
const action$3 = async ({ request }) => {
  var _a, _b, _c, _d;
  if (request.method !== "POST") return;
  const webhookSecret = process.env.STRIPE_SIGN || "";
  const webhookStripeSignatureHeader =
    request.headers.get("stripe-signature") || "";
  const payload = await request.text();
  const event = stripe.webhooks.constructEvent(
    payload,
    webhookStripeSignatureHeader,
    webhookSecret
  );
  switch (event.type) {
    case "checkout.session.async_payment_failed":
    default:
      break;
    case "checkout.session.async_payment_succeeded":
    case "checkout.session.completed":
      const session = event.data.object;
      const user = await getOrCreateUser({
        username:
          session.customer_email ||
          ((_a = session.customer_details) == null ? void 0 : _a.email),
        email:
          session.customer_email ||
          ((_b = session.customer_details) == null ? void 0 : _b.email),
        displayName: (_c = session.customer_details) == null ? void 0 : _c.name,
      });
      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          courses: {
            push: [
              .../* @__PURE__ */ new Set([
                ...user.courses,
                (_d = session.metadata) == null ? void 0 : _d.courseSlug,
              ]),
            ],
          },
        },
      });
      break;
  }
  return null;
};
const route1 = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ Object.defineProperty(
    {
      __proto__: null,
      action: action$3,
    },
    Symbol.toStringTag,
    { value: "Module" }
  )
);
const getStripeCheckout = async () => {
  const stripe2 = new Stripe(process.env.STRIPE_SECRET_KEY || "", {});
  const session = await stripe2.checkout.sessions.create({
    metadata: {
      courseSlug: "animaciones_react",
    },
    customer_email: void 0,
    // @todo use logged user
    mode: "payment",
    // line_items: [{ price: 'price_1LbSx0J7Zwl77LqnTK9noQRh', quantity: 1 }],
    line_items: [{ price: "price_1LbSx0J7Zwl77LqnTK9noQRh", quantity: 1 }],
    // <= multi moneda
    success_url: `${process.env.CURRENT_URL}/player?success=1`,
    cancel_url: `${process.env.CURRENT_URL}/player?success=0`,
    //   ...discounts,
  });
  return session.url || "/";
};
const PrimaryButton = ({
  className,
  children,
  isDisabled,
  isLoading,
  ...props
}) => {
  return /* @__PURE__ */ jsxs("button", {
    disabled: isDisabled,
    ...props,
    className: twMerge(
      "rounded-full hover:scale-95 transition-all bg-fish text-base md:text-lg text-white h-12 md:h-14 px-6 flex gap-2 items-center justify-center font-light ",
      "disabled:bg-slate-300",
      className
    ),
    children: [
      !isLoading && children,
      isLoading &&
        /* @__PURE__ */ jsx("div", {
          className:
            "w-6 h-6 rounded-full animate-spin border-4 border-t-indigo-500",
        }),
    ],
  });
};
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const TextGenerateEffect = ({
  words: words2,
  className,
  filter = true,
  duration = 0.5,
}) => {
  const [scope, animate] = useAnimate();
  let wordsArray = words2.split(" ");
  useEffect(() => {
    animate(
      "span",
      {
        opacity: 1,
        filter: filter ? "blur(0px)" : "none",
      },
      {
        duration: duration ? duration : 1,
        delay: stagger(0.2),
      }
    );
  }, [scope.current]);
  const renderWords = () => {
    return /* @__PURE__ */ jsx(motion.div, {
      ref: scope,
      children: wordsArray.map((word, idx) => {
        return /* @__PURE__ */ jsx(Fragment, {
          children: /* @__PURE__ */ jsxs(
            motion.span,
            {
              className: twMerge(
                "text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-dark dark:text-white gabarito-extrabold md:gabarito-bold leading-[110%]",
                className
              ),
              style: {
                filter: filter ? "blur(10px)" : "none",
              },
              children: [word, " "],
            },
            word + idx
          ),
        });
      }),
    });
  };
  return /* @__PURE__ */ jsx("div", {
    className: cn("font-bold", className),
    children: /* @__PURE__ */ jsx("div", {
      className: "mt-4",
      children: /* @__PURE__ */ jsx("div", {
        className:
          " dark:text-white text-center  text-black text-2xl leading-snug tracking-wide",
        children: renderWords(),
      }),
    }),
  });
};
function Flipper({ children, color = "white" }) {
  const items = Children.toArray(children);
  const index = useRef(0);
  const timeout = useRef();
  const [currentItem, setCurrenItem] = useState(items[0]);
  const [nextItem, setNextItem] = useState(items[1]);
  const [trickItem, setTrickItem] = useState(items[0]);
  const controls_1 = useAnimationControls();
  const controls_2 = useAnimationControls();
  const controls_3 = useAnimationControls();
  const updateItem = () => {
    index.current = (index.current + 1) % items.length;
    const next = items[index.current];
    setNextItem((n) => {
      setCurrenItem(n);
      return next;
    });
    return next;
  };
  const removeTrickAndUpdate = (next) => {
    controls_3.set({ zIndex: -10 });
    setTrickItem(next);
  };
  const setTrickAndReset = () => {
    controls_3.set({ zIndex: 40 });
    controls_1.set({ rotateX: 0 });
    controls_2.set({ rotateX: -270 });
  };
  const animate = async () => {
    timeout.current && clearTimeout(timeout.current);
    const next = updateItem();
    removeTrickAndUpdate(next);
    await controls_1.start({ rotateX: -90 }, { duration: 0.7, ease: "easeIn" });
    await controls_2.start(
      { rotateX: -360 },
      { duration: 0.7, ease: "easeOut" }
    );
    setTrickAndReset();
    timeout.current = setTimeout(animate, 1e3);
  };
  useEffect(() => {
    animate();
  }, []);
  const generalClass =
    "text-white text-8xl items-center overflow-hidden w-64 md:w-80 h-56 justify-center absolute z-30 flex rounded-xl";
  return /* @__PURE__ */ jsxs("article", {
    style: {
      transformStyle: "preserve-3d",
      transform: "rotateY(-20deg)",
      zIndex: 0,
    },
    className: cn(
      "p-12 flex justify-center h-[320px] relative",
      `bg-white dark:bg-dark`
    ),
    children: [
      /* @__PURE__ */ jsx(motion.div, {
        animate: controls_1,
        id: "target",
        style: {
          backfaceVisibility: "hidden",
        },
        className: generalClass,
        children: currentItem,
      }),
      /* @__PURE__ */ jsx(motion.div, {
        initial: { rotateX: -270 },
        animate: controls_2,
        id: "target_2",
        style: {
          backfaceVisibility: "hidden",
        },
        className: cn(generalClass, "z-30"),
        children: nextItem,
      }),
      /* @__PURE__ */ jsx(motion.div, {
        style: {
          clipPath: "xywh(0 50% 100% 100% round 0 0)",
        },
        className: cn(generalClass, "z-20"),
        children: currentItem,
      }),
      /* @__PURE__ */ jsx(motion.div, {
        className: cn(generalClass, "z-10"),
        children: nextItem,
      }),
      /* @__PURE__ */ jsx(motion.div, {
        animate: controls_3,
        className: cn(generalClass, "relative"),
        children: trickItem,
      }),
      /* @__PURE__ */ jsx("hr", {
        style: {
          zIndex: 50,
          transform: "translateZ(1px)",
          position: "absolute",
          borderTopWidth: "2px",
        },
        className: cn(
          "absolute top-[50%] w-full",
          `border-white dark:border-dark`
        ),
      }),
    ],
  });
}
const Tools = () => {
  return /* @__PURE__ */ jsx("section", {
    className: "",
    children: /* @__PURE__ */ jsxs(Flipper, {
      children: [
        /* @__PURE__ */ jsx("div", {
          className:
            "bg-[#F4BC7F] w-full h-full flex items-center justify-center",
          children: /* @__PURE__ */ jsx("img", {
            className: "w-[50%]",
            src: "/css2.svg",
          }),
        }),
        /* @__PURE__ */ jsx("div", {
          className:
            "bg-[#F7DF1E] w-full h-full flex items-center justify-center",
          children: /* @__PURE__ */ jsx("img", {
            className: "w-[50%]",
            src: "/js2.svg",
          }),
        }),
        /* @__PURE__ */ jsx("div", {
          className:
            "bg-[#9CD2E1] w-full h-full flex items-center justify-center",
          children: /* @__PURE__ */ jsx(FaReact, {
            className: "text-[160px] text-[#1C6C82]",
          }),
        }),
        /* @__PURE__ */ jsx("div", {
          className:
            "bg-[#C7CEDB] w-full h-full flex items-center justify-center",
          children: /* @__PURE__ */ jsx("img", {
            className: "w-[50%]",
            src: "/framer.svg",
          }),
        }),
        /* @__PURE__ */ jsx("div", {
          className:
            "bg-[#D2E1E2] w-full h-full flex items-center justify-center",
          children: /* @__PURE__ */ jsx(RiTailwindCssFill, {
            className: "text-[160px] text-[#00ACC1]",
          }),
        }),
      ],
    }),
  });
};
const words = `  Aprende animaciones web con React`;
const Hero = ({ children }) => {
  return /* @__PURE__ */ jsx("section", {
    className:
      "bg-none md:bg-magic flex flex-wrap md:flex-nowrap  bg-contain bg-no-repeat bg-right pt-12 md:pt-[120px] min-h-[90vh] lg:min-h-[95vh]  ",
    children: /* @__PURE__ */ jsxs("div", {
      className:
        "w-full px-6 pt-0 md:px-0 lg:max-w-7xl mx-auto flex flex-col items-center ",
      children: [
        /* @__PURE__ */ jsx(Tools, {}),
        /* @__PURE__ */ jsxs("div", {
          className: "w-full lg:w-[70%] mx-auto -mt-8 md:mt-12 ",
          children: [
            /* @__PURE__ */ jsx(TextGenerateEffect, { words }),
            /* @__PURE__ */ jsx("p", {
              className:
                "text-iron dark:text-metal text-center text-lg lg:text-2xl font-light dark:font-extralight mt-3 mb-12",
              children:
                "Construye 12 componentes animados para tus proyectos web",
            }),
            children
              ? children
              : /* @__PURE__ */ jsxs(PrimaryButton, {
                  className: "w-full md:w-auto mx-auto",
                  children: [
                    "Comprar ",
                    /* @__PURE__ */ jsx("img", { src: "/cursor.svg" }),
                  ],
                }),
          ],
        }),
      ],
    }),
  });
};
const ScrollReveal = ({ children }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return /* @__PURE__ */ jsx(motion.div, {
    style: {
      opacity: isInView ? 1 : 0,
      transition: "all 0.3s cubic-bezier(0.17, 0.55, 0.55, 1) 0.2s",
      transform: isInView ? "translateY(0)" : "translateY(100px)",
    },
    ref,
    children,
  });
};
const Animations = () => {
  return /* @__PURE__ */ jsx(ScrollReveal, {
    children: /* @__PURE__ */ jsxs("section", {
      className: "my-[80px] lg:my-[120px]",
      children: [
        /* @__PURE__ */ jsx("h2", {
          className:
            "text-dark dark:text-white text-3xl md:text-4xl lg:text-5xl	text-evil font-bold text-center",
          children: "¿Qué componentes vamos a construir? 🎨",
        }),
        /* @__PURE__ */ jsx("p", {
          className:
            "text-iron dark:text-metal font-light text-lg md:text-xl lg:text-2xl  text-center mt-4",
          children:
            "A lo largo de 12 unidades y más de 20 lecciones, construirás",
        }),
        /* @__PURE__ */ jsxs("div", {
          className:
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-16 mt-12 md:mt-20",
          children: [
            /* @__PURE__ */ jsx(Card, {
              title: "Flip words",
              className: "bg-flipWords hover:bg-flipWordsGif",
            }),
            /* @__PURE__ */ jsx(Card, {
              title: "Swipe Gallery",
              className: "bg-draggable hover:bg-draggableGif",
            }),
            /* @__PURE__ */ jsx(Card, {
              title: "3D card",
              className: "bg-cards hover:bg-cardsGif",
            }),
            /* @__PURE__ */ jsx(Card, {
              title: "Hero highlight",
              className: "bg-highlight hover:bg-highlightGif",
            }),
            /* @__PURE__ */ jsx(Card, {
              title: "Basic Scroll",
              className: "bg-scroll hover:bg-scrollGif",
            }),
            /* @__PURE__ */ jsx(Card, {
              title: "3d animations",
              className: "bg-image hover:bg-imageGif",
            }),
            /* @__PURE__ */ jsx(Card, {
              title: "Grid Modal",
              className: "bg-zoom hover:bg-zoomGif",
            }),
            /* @__PURE__ */ jsx(Card, {
              title: "Link preview",
              className: "bg-link hover:bg-linkGif",
            }),
            /* @__PURE__ */ jsx(Card, {
              title: "Moving border",
              className: "bg-border hover:bg-borderGif",
            }),
            /* @__PURE__ */ jsx(Card, {
              title: "Images slider",
              className: "bg-slider hover:bg-sliderGif",
            }),
            /* @__PURE__ */ jsx(Card, {
              title: "Draggable list",
              className: "bg-list hover:bg-listGif",
            }),
            /* @__PURE__ */ jsx(Card, {
              title: "Infinite moving items",
              className: "bg-infinite hover:bg-infiniteGif",
            }),
          ],
        }),
      ],
    }),
  });
};
const Card = ({ title, image, className }) => {
  return /* @__PURE__ */ jsxs("section", {
    className: "col-span-1 group",
    children: [
      /* @__PURE__ */ jsx("div", {
        className: twMerge(
          "bg-cover bg-center w-full h-[240px] md:h-[280px] rounded-lg transition-all cursor-pointer dark:border dark:border-lightGray/10",
          className
        ),
      }),
      /* @__PURE__ */ jsx("h3", {
        className:
          "font-semibold text-dark dark:text-white  mt-3 text-2xl group-hover:translate-x-6 transition-all",
        children: title,
      }),
    ],
  });
};
const ToggleButton = () => {
  const [enabled, setEnabled] = useState(false);
  const toggle = () => {
    const val = !enabled;
    const main = document.querySelector("#main");
    if (val) {
      main == null ? void 0 : main.classList.add("dark");
    } else {
      main == null ? void 0 : main.classList.remove("dark");
    }
    setEnabled(val);
  };
  return /* @__PURE__ */ jsx(Switch, {
    checked: enabled,
    onChange: toggle,
    className:
      "group inline-flex h-8 w-[52px] items-center rounded-full bg-[#F6F6F6] transition data-[checked]:bg-[#242424] ",
    children: /* @__PURE__ */ jsx("span", {
      className:
        "size-4 h-6 w-6 dark:bg-[url('/moon.svg')] translate-x-1 rounded-full bg-[url('/sun.svg')] bg-cover  bg-white transition group-data-[checked]:translate-x-6",
    }),
  });
};
const Faq = () =>
  /* @__PURE__ */ jsx(ScrollReveal, {
    children: /* @__PURE__ */ jsxs("section", {
      className: "lg:pt-[120px] lg:pb-[160px] pt-20 pb-[120px]",
      children: [
        /* @__PURE__ */ jsxs("h2", {
          className:
            " text-dark  dark:text-white text-3xl md:text-4xl lg:text-5xl font-bold text-center",
          children: [" ", "¿Tienes alguna duda ? 🎨"],
        }),
        /* @__PURE__ */ jsxs("p", {
          className:
            "text-base md:text-lg text-iron dark:text-metal dark:font-extralight font-light mt-6 mb-16 text-center",
          children: [
            "Si no encuentras la respuesta que buscas por favor escríbenos por",
            " ",
            /* @__PURE__ */ jsx("a", {
              href: "https://wa.me/525539599400",
              target: "_blank",
              className: "text-[#777DF7] underline",
              children: "whatsapp",
            }),
            ".",
          ],
        }),
        /* @__PURE__ */ jsxs("div", {
          className:
            "mt-12 lg:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 ",
          children: [
            /* @__PURE__ */ jsxs("div", {
              className: "flex flex-col gap-8",
              children: [
                /* @__PURE__ */ jsx(Question, {
                  question: "¿Cómo se imparte el curso?",
                  answer:
                    "La modalidad del curso es 100% en línea, por lo que todo el contenido del curso (videos y learnings) se encuentra disponible desde tu perfil de forma permanente. Podrás verlos a tu ritmo: cuando quieras y desde donde quieras.",
                }),
                /* @__PURE__ */ jsx(Question, {
                  question: "¿Necesito conocimientos previos?",
                  answer:
                    "Este curso es de nivel intermedio, por lo que sí requieres conocimientos en JavaScript y ReactJs. ",
                }),
                /* @__PURE__ */ jsx(Question, {
                  question:
                    "¿Cómo funcionan los cursos? ¿Debo seguir un horario específico?",
                  answer:
                    "No, los cursos son 100% online y offline, puedes cursarlos a tu ritmo: cuando quieras y desde donde quieras.",
                }),
                /* @__PURE__ */ jsx(Question, {
                  question: "¿Cómo puedo obtener futuras actualizaciones?",
                  answer:
                    "Al comprar el curso tendrás acceso permanente a él, y a sus futuras actualizaciones sin pagos adicionales.",
                }),
              ],
            }),
            /* @__PURE__ */ jsxs("div", {
              className: "flex flex-col gap-8",
              children: [
                /* @__PURE__ */ jsx(Question, {
                  question: "¿Cómo compro el curso?",
                  answer:
                    "Al dar clic en el botón Comprar curso, serás redirigido al flujo de compra dentro de nuestra página principal, solo completa tu información de pago. El curso estará disponible en tu cuenta en www.fixtergeek.com",
                }),
                /* @__PURE__ */ jsx(Question, {
                  question: "¿Qué formas de pago aceptan?",
                  answer:
                    "Aceptamos todo tipo de tarjetas de crédito o tarjetas débito internacionales (Visa, MasterCard o AMEX) que estén habilitadas para pagos online al extranjero. Si no te es posible pagar por este medio, escríbenos a hola@fixtergeek.com y buscaremos otras opciones.",
                }),
                /* @__PURE__ */ jsx(Question, {
                  question:
                    "¿Cuál es la diferencia entre el Full course y el Pro Full course?",
                  answer:
                    "El contenido de ambos cursos es el mismo, la única diferencia es que el Pro Full course incluye la playera oficial de fixter. Después de tu compra, nos pondremos en contacto contigo para enviarla hasta la puerta de tu casa.",
                }),
                " ",
                /* @__PURE__ */ jsx(Question, {
                  question: "¿Emiten factura fiscal?",
                  answer:
                    "Sí, despues de suscribirte al Plan PRO completa tus datos fiscales desde tu perfil>Administrar plan y te haremos llegar tu fatura vía email, si tienes alguna duda escríbenos a hola@formmy.app",
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  });
const Question = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return /* @__PURE__ */ jsxs("div", {
    className:
      "border-lightgray dark:border-lightGray/20   border-[1px] rounded-2xl",
    children: [
      /* @__PURE__ */ jsxs("button", {
        className:
          "w-full px-6 py-6 text-base md:text-xl font-medium text-left flex justify-between items-center",
        onClick: () => {
          setOpen((o) => !o);
        },
        children: [
          /* @__PURE__ */ jsx("p", {
            className: "w-[90%]  text-dark dark:text-white  ",
            children: question,
          }),
          open
            ? /* @__PURE__ */ jsx(IoIosArrowDown, {
                className:
                  "rotate-180 transition-all text-dark  dark:text-white ",
              })
            : /* @__PURE__ */ jsx(IoIosArrowDown, {
                className: "transition-all text-dark  dark:text-white ",
              }),
        ],
      }),
      /* @__PURE__ */ jsx(AnimatePresence, {
        initial: false,
        children:
          open &&
          /* @__PURE__ */ jsx(motion.div, {
            initial: { opacity: 0, height: 0 },
            animate: { opacity: 1, height: "auto" },
            exit: { opacity: 0, height: 0 },
            transition: { type: "spring", duration: 0.4, bounce: 0 },
            children: /* @__PURE__ */ jsx("p", {
              className:
                "text-base md:text-lg text-iron dark:text-metal  font-light px-6 pb-8",
              children: answer,
            }),
          }),
      }),
    ],
  });
};
const Footer = () => {
  return /* @__PURE__ */ jsx("section", {
    className: " bg-dark  pt-10 pb-10 md:py-20   ",
    children: /* @__PURE__ */ jsxs("div", {
      className:
        "w-full px-6 md:px-[6%] xl:px-0 lg:max-w-7xl mx-auto flex flex-wrap md:flex-nowrap justify-between items-center",
      children: [
        /* @__PURE__ */ jsxs("div", {
          children: [
            /* @__PURE__ */ jsx("h3", {
              className: "text-white text-3xl md:text-5xl font-bold ",
              children: "Escríbenos.",
            }),
            /* @__PURE__ */ jsx("a", {
              href: "mailto:hola@fixtergeek.com",
              children: /* @__PURE__ */ jsx("p", {
                className:
                  "text-metal dark:font-extralight text-lg md:text-xl font-light mt-4",
                children: "hola@fixtergeek.com",
              }),
            }),
          ],
        }),
        /* @__PURE__ */ jsxs("div", {
          className: "flex gap-4 mt-6 md:mt-0",
          children: [
            /* @__PURE__ */ jsx("a", {
              href: "https://www.facebook.com/fixterme",
              target: "_blank ",
              rel: "noreferrer",
              children: /* @__PURE__ */ jsx("img", {
                className: "hover:opacity-50 transition-all grayscale",
                src: "/face.svg",
              }),
            }),
            /* @__PURE__ */ jsx("a", {
              href: "https://www.linkedin.com/company/28982942/admin/feed/posts/",
              target: "_blank ",
              rel: "noreferrer",
              children: /* @__PURE__ */ jsx("img", {
                className: "hover:opacity-50 transition-all",
                src: "/linkedin.svg",
              }),
            }),
            /* @__PURE__ */ jsx("a", {
              href: "https://twitter.com/FixterGeek",
              target: "_blank ",
              rel: "noreferrer",
              children: /* @__PURE__ */ jsx("img", {
                className: "hover:opacity-50 transition-all",
                src: "/twitter.svg",
              }),
            }),
            /* @__PURE__ */ jsx("a", {
              href: "https://www.facebook.com/fixterme",
              target: "_blank ",
              rel: "noreferrer",
              children: /* @__PURE__ */ jsx("img", {
                className: "hover:opacity-50 transition-all",
                src: "/insta.svg",
              }),
            }),
            /* @__PURE__ */ jsx("a", {
              href: "https://wa.me/527757609276",
              target: "_blank ",
              rel: "noreferrer",
              children: /* @__PURE__ */ jsx("img", {
                className: "hover:opacity-50 transition-all",
                src: "/whats.svg",
              }),
            }),
          ],
        }),
      ],
    }),
  });
};
const Pricing = () => {
  return /* @__PURE__ */ jsx(ScrollReveal, {
    children: /* @__PURE__ */ jsxs("section", {
      className: "text-center py-[80px] lg:py-[120px] ",
      children: [
        /* @__PURE__ */ jsx("h2", {
          className:
            "text-3xl md:text-4xl lg:text-5xl	text-evil text-dark dark:text-white font-bold",
          children: "¿Qué incluye el curso? 🚀",
        }),
        /* @__PURE__ */ jsx("p", {
          className:
            "text-lg md:text-2xl text-iron dark:text-metal dark:font-extralight font-light mt-6 mb-16",
          children: "Elige tu pack",
        }),
        /* @__PURE__ */ jsx(MyTabs, {}),
      ],
    }),
  });
};
const MyTabs = () => {
  return /* @__PURE__ */ jsxs(Tab.Group, {
    children: [
      /* @__PURE__ */ jsxs(Tab.List, {
        className:
          "flex gap-0 md:gap-10 justify-between md:justify-center w-full md:w-[560px] mx-auto",
        children: [
          /* @__PURE__ */ jsx(Tab, {
            "data-headlessui-state": "selected",
            className:
              "border focus:outline-none data-[selected]:outline-fish data-[selected]:border-fish  data-[hover]:bg-transparent  dark:data-[hover]:bg-[#131316] data-[focus]:outline-1 data-[focus]:outline-white   bg-[#ffffff] dark:bg-transparent border-lightGray dark:border-lightGray/20 w-[48%] md:w-[260px] h-[160px] rounded-3xl flex items-center justify-center",
            children: /* @__PURE__ */ jsxs("div", {
              children: [
                /* @__PURE__ */ jsxs("h3", {
                  className:
                    "text-base md:text-2xl font-medium text-dark dark:text-white",
                  children: [
                    "Animaciones ",
                    /* @__PURE__ */ jsx("br", {}),
                    " con React",
                  ],
                }),
                /* @__PURE__ */ jsx("p", {
                  className:
                    "text-iron font-light dark:text-metal text-sm mt-2",
                  children: "Full course",
                }),
              ],
            }),
          }),
          /* @__PURE__ */ jsx(Tab, {
            className:
              "border focus:outline-none data-[selected]:outline-fish data-[selected]:border-fish  data-[hover]:bg-transparent  dark:data-[hover]:bg-[#131316] data-[focus]:outline-1 data-[focus]:outline-white   bg-[#ffffff] dark:bg-transparent border-lightGray dark:border-lightGray/20 w-[48%] md:w-[260px] h-[160px] rounded-3xl flex items-center justify-center",
            children: /* @__PURE__ */ jsxs("div", {
              className: "relative",
              children: [
                /* @__PURE__ */ jsx("img", {
                  className: "w-16 absolute -right-3 -top-14 md:-right-10 ",
                  src: "/best-seller.svg",
                }),
                /* @__PURE__ */ jsxs("h3", {
                  className:
                    "text-base md:text-2xl text-dark dark:text-white font-medium",
                  children: [
                    "Animaciones ",
                    /* @__PURE__ */ jsx("br", {}),
                    " con React",
                  ],
                }),
                /* @__PURE__ */ jsx("p", {
                  className:
                    "text-iron font-light dark:text-metal text-sm mt-2",
                  children: "Full course + Player oficial",
                }),
              ],
            }),
          }),
        ],
      }),
      /* @__PURE__ */ jsxs(Tab.Panels, {
        className: "flex justify-center mt-8 md:mt-10",
        children: [
          /* @__PURE__ */ jsx(AnimatePresence, {
            children: /* @__PURE__ */ jsx(Tab.Panel, {
              "data-selected": true,
              children: /* @__PURE__ */ jsxs(motion.div, {
                initial: { opacity: 0, scale: 0.5 },
                animate: { opacity: 1, scale: 1 },
                transition: {
                  duration: 0.3,
                  delay: 0.2,
                  ease: [0, 0.71, 0.2, 1.01],
                },
                className:
                  "w-full md:w-[560px] bg-white dark:bg-[#1B1D22]  rounded-3xl p-6 md:p-12 text-left border-[1px] border-lightGray dark:border-none ",
                children: [
                  /* @__PURE__ */ jsxs("h4", {
                    className:
                      "text-dark dark:text-white text-4xl md:text-5xl font-bold	",
                    children: [
                      /* @__PURE__ */ jsx("span", {
                        className: "line-through	",
                        children: "$999 ",
                      }),
                      " ",
                      /* @__PURE__ */ jsxs("span", {
                        className: " text-[#FF4B4B] dark:text-[#C8496C] ml-2",
                        children: ["$499", " "],
                      }),
                      /* @__PURE__ */ jsxs("span", {
                        className:
                          "text-xl font-normal text-iron dark:text-metal/70 ",
                        children: ["/ MXN", " "],
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxs("div", {
                    className:
                      "text-base font-light text-iron dark:text-metal  flex flex-col gap-4 mt-10",
                    children: [
                      /* @__PURE__ */ jsx("p", {
                        children:
                          "📹 12 unidades con tutoriales en video (1 por componente)",
                      }),
                      /* @__PURE__ */ jsx("p", {
                        children: "💪🏻 Learnings y ejercicios por lección",
                      }),
                      /* @__PURE__ */ jsx("p", {
                        children: "📚 Recursos extra ",
                      }),
                      /* @__PURE__ */ jsx("p", {
                        children: "💀 Acceso de por vida",
                      }),
                      /* @__PURE__ */ jsx("p", {
                        children: "🚀 Actualizaciones futuras del curso",
                      }),
                      /* @__PURE__ */ jsx("p", {
                        children: "🫶🏻 Acceso a la comunidad de Disscord",
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxs(PrimaryButton, {
                    className: " mt-12 w-full ",
                    children: [
                      "Comprar curso ",
                      /* @__PURE__ */ jsx("img", { src: "/cursor.svg" }),
                    ],
                  }),
                ],
              }),
            }),
          }),
          /* @__PURE__ */ jsxs(Tab.Panel, {
            children: [
              " ",
              /* @__PURE__ */ jsxs(motion.div, {
                initial: { opacity: 0, scale: 0.5 },
                animate: { opacity: 1, scale: 1 },
                transition: {
                  duration: 0.3,
                  delay: 0.2,
                  ease: [0, 0.71, 0.2, 1.01],
                },
                className:
                  "w-full md:w-[560px] bg-white dark:bg-[#1B1D22]  rounded-3xl p-6 md:p-12 text-left border-[1px] border-lightGray dark:border-none ",
                children: [
                  " ",
                  /* @__PURE__ */ jsxs("h4", {
                    className:
                      "text-dark dark:text-white text-4xl md:text-5xl font-bold	",
                    children: [
                      /* @__PURE__ */ jsx("span", {
                        className: "line-through	",
                        children: "$1,499 ",
                      }),
                      " ",
                      /* @__PURE__ */ jsxs("span", {
                        className: " text-[#FF4B4B] dark:text-[#C8496C] ml-2",
                        children: ["$999", " "],
                      }),
                      /* @__PURE__ */ jsxs("span", {
                        className:
                          "text-xl font-normal text-iron dark:text-metal/70  ",
                        children: ["/ MXN", " "],
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxs("div", {
                    className:
                      "text-base font-light text-iron dark:text-metal flex flex-col gap-4 mt-10",
                    children: [
                      /* @__PURE__ */ jsxs("p", {
                        children: [
                          "📹",
                          " ",
                          /* @__PURE__ */ jsx("strong", {
                            className:
                              "font-semibold text-iron dark:text-white/60",
                            children: "12 unidades",
                          }),
                          " ",
                          "con tutoriales en video (1 por componente)",
                        ],
                      }),
                      /* @__PURE__ */ jsx("p", {
                        children: "💪🏻 Learnings y ejercicios por lección",
                      }),
                      /* @__PURE__ */ jsxs("p", {
                        children: [
                          "📚 Recopilación de",
                          " ",
                          /* @__PURE__ */ jsxs("strong", {
                            className:
                              "font-semibold text-iron dark:text-white/60",
                            children: ["recursos extra", " "],
                          }),
                        ],
                      }),
                      /* @__PURE__ */ jsx("p", {
                        children: "💀 Acceso de por vida",
                      }),
                      /* @__PURE__ */ jsxs("p", {
                        children: [
                          "🚀",
                          " ",
                          /* @__PURE__ */ jsx("strong", {
                            className:
                              "font-semibold text-iron dark:text-white/60",
                            children: "Actualizaciones futuras",
                          }),
                          " ",
                          "del curso",
                        ],
                      }),
                      /* @__PURE__ */ jsx("p", {
                        children: "🫶🏻 Acceso a la comunidad de Disscord",
                      }),
                      /* @__PURE__ */ jsxs("p", {
                        children: [
                          "👕",
                          " ",
                          /* @__PURE__ */ jsx("strong", {
                            className:
                              "font-semibold text-iron dark:text-white/60",
                            children: "Playera oficial",
                          }),
                          " ",
                          "de Fixtergeek",
                        ],
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxs(PrimaryButton, {
                    className: " mt-12 w-full ",
                    children: [
                      "Comprar curso ",
                      /* @__PURE__ */ jsx("img", { src: "/cursor.svg" }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
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
    bounce: 0,
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
    const rect1 =
      (_a = ref.current) == null ? void 0 : _a.getBoundingClientRect();
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
const Marquee = ({ children, reversed, className = "bg-dark " }) => {
  const { x, ref } = useMarquee(reversed);
  return /* @__PURE__ */ jsx(Fragment, {
    children: /* @__PURE__ */ jsx("article", {
      className: cn("flex justify-center items-center", className),
      children: /* @__PURE__ */ jsx("div", {
        className:
          "h-16 md:h-20 flex items-center text-gray-100  text-2xl lg:text-3xl font-extrabold overflow-hidden",
        children: /* @__PURE__ */ jsxs(motion.div, {
          style: { x },
          className: "whitespace-nowrap",
          ref,
          children: [children, " ", children],
        }),
      }),
    }),
  });
};
const ScrollBanner = () => {
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [
      /* @__PURE__ */ jsxs(Marquee, {
        className: "jolly-lodger-regular bg-dark",
        children: [
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
          /* @__PURE__ */ jsx("span", { className: "mx-3", children: "🎛️" }),
        ],
      }),
      /* @__PURE__ */ jsxs(Marquee, {
        reversed: true,
        className: "bg-fish jolly-lodger-regular",
        children: [
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
          /* @__PURE__ */ jsx("span", { className: "mx-3", children: "🔥" }),
        ],
      }),
    ],
  });
};
const FloatingDock = ({ items, desktopClassName, mobileClassName }) => {
  return /* @__PURE__ */ jsx(Fragment, {
    children: /* @__PURE__ */ jsx(FloatingDockDesktop, {
      items,
      className: desktopClassName,
    }),
  });
};
const FloatingDockDesktop = ({ items, className }) => {
  let mouseX = useMotionValue(Infinity);
  return /* @__PURE__ */ jsx("div", {
    children: /* @__PURE__ */ jsx(motion.div, {
      onMouseMove: (e) => mouseX.set(e.pageX),
      onMouseLeave: () => mouseX.set(Infinity),
      className: cn(
        " flex   h-16 gap-10 lg:gap-4 items-end justify-start rounded-2xl   pb-3",
        className
      ),
      children: items.map((item) =>
        /* @__PURE__ */ jsx(IconContainer, { mouseX, ...item }, item.title)
      ),
    }),
  });
};
function IconContainer({ mouseX, title, icon, href }) {
  let ref = useRef(null);
  let distance = useTransform(mouseX, (val) => {
    var _a;
    let bounds = ((_a = ref.current) == null
      ? void 0
      : _a.getBoundingClientRect()) ?? { x: 0, width: 0 };
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
    damping: 12,
  });
  let height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const [hovered, setHovered] = useState(false);
  return /* @__PURE__ */ jsx("a", {
    href,
    target: "_blank",
    children: /* @__PURE__ */ jsxs(motion.div, {
      ref,
      style: { width, height },
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      className:
        "aspect-square  flex items-center gap-0 justify-center relative",
      children: [
        /* @__PURE__ */ jsx(AnimatePresence, {
          children:
            hovered &&
            /* @__PURE__ */ jsx(motion.div, {
              initial: { opacity: 0, y: 10, x: "-30%" },
              animate: { opacity: 1, y: 0, x: "-30%" },
              exit: { opacity: 0, y: 2, x: "-30%" },
              className:
                "px-2 py-0.5 whitespace-pre rounded-md bg-dark border dark:bg-[#141518] dark:border-white/20 dark:text-white border-gray-200 text-white absolute left-1/2 -translate-x-1/2 -top-8 w-fit text-xs",
              children: title,
            }),
        }),
        /* @__PURE__ */ jsx(motion.div, {
          className: "flex items-center justify-center ",
          children: icon,
        }),
      ],
    }),
  });
}
const Teacher = () => {
  return /* @__PURE__ */ jsx(ScrollReveal, {
    children: /* @__PURE__ */ jsxs("section", {
      className:
        "flex overflow-hidden flex-wrap lg:flex-nowrap bg-[#FAFAFF] dark:bg-transparent dark:border dark:border-white/10 px-6  md:pr-0 md:pl-12 gap-12 justify-between rounded-[40px] my-10 md:my-20 lg:my-[120px]",
      children: [
        /* @__PURE__ */ jsxs("div", {
          className: "w-full lg:w-[45%] pt-8 pb-6 md:py-12",
          children: [
            /* @__PURE__ */ jsx("span", {
              className:
                "text-dark dark:text-metal font-light dark:font-extralight  text-xl",
              children: "¿Quien será tu instructor? 🧑🏻‍🏫",
            }),
            /* @__PURE__ */ jsx("h2", {
              className:
                "font-semibold text-2xl md:text-5xl dark:text-white mb-2 mt-6 text-dark",
              children: "Héctor Bliss",
            }),
            /* @__PURE__ */ jsx("span", {
              className:
                "dark:text-metal/80 dark:font-extralight font-light text-iron",
              children: "Software Engineer & Lead Teacher",
            }),
            /* @__PURE__ */ jsxs("p", {
              className:
                "mt-12 text-iron dark:text-metal dark:font-extralight font-light ",
              children: [
                "Con más de 10 años de experiencia como desarrollador de software profesional e instructor tecnológico, Héctor Bliss disfruta de simplificar temas complejos para que sus estudiantes puedan",
                " ",
                /* @__PURE__ */ jsxs("strong", {
                  className: "text-gray-800 dark:text-white/60 font-medium",
                  children: [
                    " ",
                    "aprender de la forma más práctica, rápida y divertida.",
                  ],
                }),
                " ",
                "Héctor ha sido instructor en diferentes bootcamps internacionales, y ha grabado infinidad de cursos en línea. Por medio de su canal de youtube",
                " ",
                /* @__PURE__ */ jsx("strong", {
                  className: "text-gray-800 dark:text-white/60  font-medium",
                  children:
                    "enseña los temas más actualizados de la industria tecnológica,",
                }),
                " ",
                "acercando las herramientas que usan los profesionales nivel mundial a sus estudiantes de habla hispana.",
                " ",
              ],
            }),
            /* @__PURE__ */ jsxs("p", {
              className:
                "mt-6 text-iron dark:text-metal dark:font-extralight font-light ",
              children: [
                " ",
                "Si no has experimentado una clase con Héctor Bliss,",
                " ",
                /* @__PURE__ */ jsx("strong", {
                  className: "text-gray-800 dark:text-white/60 font-medium ",
                  children:
                    "es tu momento de comprobar que aprender no tiene que ser ni díficil ni aburrido.",
                }),
              ],
            }),
            /* @__PURE__ */ jsx(FloatingMedia, {}),
          ],
        }),
        /* @__PURE__ */ jsx("img", {
          className:
            "hidden lg:block dark:hidden w-full rounded-full md:rounded-none  lg:w-[50%] md:object-contain bg-left",
          src: "/titor.png",
        }),
        /* @__PURE__ */ jsx("img", {
          className:
            "w-full lg:w-[50%] object-cover object-left hidden dark:hidden dark:lg:block ",
          src: "/titor-w.png",
        }),
      ],
    }),
  });
};
const media = [
  {
    title: "@Héctorbliss",
    icon: /* @__PURE__ */ jsx(FaLinkedin, {
      className: "text-3xl text-dark dark:text-metal",
    }),
    href: "https://www.linkedin.com/in/hectorbliss/",
  },
  {
    title: "@blissito",
    icon: /* @__PURE__ */ jsx(FaGithub, {
      className: "text-3xl text-dark dark:text-metal",
    }),
    href: "https://github.com/blissito",
  },
  {
    title: "@blissito",
    icon: /* @__PURE__ */ jsx(FaYoutube, {
      className: "text-3xl text-dark dark:text-metal",
    }),
    href: "https://www.youtube.com/@blissito",
  },
  {
    title: "@HéctorBliss",
    icon: /* @__PURE__ */ jsx(FaSquareXTwitter, {
      className: "text-3xl text-dark dark:text-metal",
    }),
    href: "https://twitter.com/HectorBlisS",
  },
];
const FloatingMedia = () => {
  return /* @__PURE__ */ jsx("div", {
    className: "mt-12",
    children: /* @__PURE__ */ jsx(FloatingDock, {
      mobileClassName: "translate-y-20",
      items: media,
    }),
  });
};
const MouseEnterContext = createContext(void 0);
const CardContainer = ({ children, className, containerClassName }) => {
  const containerRef = useRef(null);
  const [isMouseEntered, setIsMouseEntered] = useState(false);
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();
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
  return /* @__PURE__ */ jsx(MouseEnterContext.Provider, {
    value: [isMouseEntered, setIsMouseEntered],
    children: /* @__PURE__ */ jsx("div", {
      className: cn(" flex items-center justify-center", containerClassName),
      style: {
        perspective: "1000px",
      },
      children: /* @__PURE__ */ jsx("div", {
        ref: containerRef,
        onMouseEnter: handleMouseEnter,
        onMouseMove: handleMouseMove,
        onMouseLeave: handleMouseLeave,
        className: cn(
          "flex items-center justify-center relative transition-all duration-200 ease-linear",
          className
        ),
        style: {
          transformStyle: "preserve-3d",
        },
        children,
      }),
    }),
  });
};
const CardBody = ({ children, className }) => {
  return /* @__PURE__ */ jsx("div", {
    className: cn(
      " xl:h-96 lg:h-[368px] md:h-[424px] h-auto md:w-full lg:w-96 [transform-style:preserve-3d]  [&>*]:[transform-style:preserve-3d]",
      className
    ),
    children,
  });
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
  return /* @__PURE__ */ jsx(Tag, {
    ref,
    className: cn("w-fit transition duration-200 ease-linear", className),
    ...rest,
    children,
  });
};
const useMouseEnter = () => {
  const context = useContext(MouseEnterContext);
  if (context === void 0) {
    throw new Error("useMouseEnter must be used within a MouseEnterProvider");
  }
  return context;
};
const Testimonials = () => {
  return /* @__PURE__ */ jsxs("section", {
    className: "py-20 md:py-20 xl:py-[120px]",
    children: [
      /* @__PURE__ */ jsx("h2", {
        className:
          "text-dark dark:text-white text-3xl md:text-4xl lg:text-5xl text-center 	text-evil font-bold",
        children: "Qué dicen nuestros estudiantes",
      }),
      /* @__PURE__ */ jsxs("div", {
        className:
          "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3  mt-12 md:mt-16 gap-8 lg:gap-y-12 xl:gap-12",
        children: [
          /* @__PURE__ */ jsx(Comment, {
            image:
              "https://pbs.twimg.com/profile_images/456497156975644673/QmpE5sMs_400x400.jpeg",
            name: "Rodrigo",
            tag: "@Alientres",
            comment:
              "Hola, tomé un curso con @FixterGeek Desarrollo Web Full-Stack, me gusto la forma de explicar del profesor y las mentorías personalizadas, también las tecnologías aprendidas son de vanguardia. ¡Se los recomiendo!",
          }),
          /* @__PURE__ */ jsx(Comment, {
            image:
              "https://pbs.twimg.com/profile_images/1640439802104369153/P4m1BLS7_400x400.jpg",
            name: "Jonathan",
            tag: "@johnxgear",
            comment:
              "Creo que una de las mejores decisiones ha sido tomar un curso en @FixterGeek es una buena forma de aprender / retomar la programación sin duda una gran experiencia, gracias por dejarme ser parte de esta comunidad. 😎🔥🙌🏼",
          }),
          /* @__PURE__ */ jsx(Comment, {
            image:
              "https://pbs.twimg.com/profile_images/1363555823138590724/BSg51cKM_400x400.jpg",
            name: "Brenda Ortega",
            tag: "@brendaojs",
            comment:
              "En 2016, aprendí frontend en @FixterGeek, era la primera vez que veía la terminal así que fue un poco doloroso pero satisfactorio. 6 años más tarde, después de varios empleos y mucho aprendizaje puedo decir que fue la mejor decisión que he tomado. 👩🏻‍💻😊",
          }),
          /* @__PURE__ */ jsx(Comment, {
            image:
              "https://pbs.twimg.com/profile_images/1605726489055334400/olSwWtH8_400x400.jpg",
            name: "David Duran Valdes",
            tag: "@DavidDuranVal",
            comment:
              "La forma de enseñar de @HectorBlisS @FixterGeek junto con la documentación y los lerning's son de gran ayuda para resolver los ejercicios y proyectos del curso, los temas parecen mas faciles de lo que son y te motivan a seguir aprendiendo, practicando y mejorar tus conocimientos.",
          }),
          /* @__PURE__ */ jsx(Comment, {
            image:
              "https://pbs.twimg.com/profile_images/1509233081194004490/hwUK6HvV_400x400.jpg",
            name: "Sandy",
            tag: "@SandHv",
            comment:
              "@FixterGeek ha sido una experiencia agradable y nutritiva técnicamente hablando, continuaré con los siguientes cursos para seguir retroalimentando y aprendiendo las nuevas técnicas del mundo de desarrollo web, gracias fixter ✨🐥👩🏻‍💻\n",
          }),
          /* @__PURE__ */ jsx(Comment, {
            image:
              "https://pbs.twimg.com/profile_images/1659370175546765314/NQtKyiWa_400x400.jpg",
            name: "Gustavo",
            tag: "@kinxori",
            comment:
              "Hi everyone! As you may know, I am in the journey to become a former web developer! I've started taking bootcamps with \n@FixterGeek\n and it's been a great experience. We have access to mentorships through all the course lapse and to be fair, Bliss has a natural talent to teach! 👨‍💻",
          }),
        ],
      }),
    ],
  });
};
const Comment = ({ image, comment, name, tag, className }) => {
  return /* @__PURE__ */ jsx(ScrollReveal, {
    children: /* @__PURE__ */ jsx(CardContainer, {
      className: "inter-var ",
      children: /* @__PURE__ */ jsxs(CardBody, {
        className: twMerge(
          "col-span-1 border border-lightGray dark:border-lightGray/10 rounded-2xl p-4 relative cursor-pointer hover:shadow-[0_16px_16px_rgba(0,0,0,0.05)] dark:hover:shadow-lg transition-all",
          className
        ),
        children: [
          /* @__PURE__ */ jsx("img", {
            className:
              "absolute right-3 w-8 md:w-12 opacity-50 dark:brightness-100 dark:hidden	",
            src: "/x.png",
          }),
          /* @__PURE__ */ jsx("img", {
            className: "absolute right-3 w-8 md:w-12 opacity-20 dark:block 	",
            src: "/x-w.png",
          }),
          /* @__PURE__ */ jsx(CardItem, {
            as: "p",
            translateZ: "100",
            children: /* @__PURE__ */ jsxs("p", {
              className:
                "text-base md:text-lg text-iron dark:text-metal font-light mt-8 md:mt-12 xl:mt-16",
              children: ['"', comment, '"'],
            }),
          }),
          /* @__PURE__ */ jsxs(CardItem, {
            translateZ: "40",
            className: "mt-6 md:mt-10 flex gap-3 items-center",
            children: [
              /* @__PURE__ */ jsx("img", {
                className: "w-12 h-12 rounded-full object-cover",
                src: image
                  ? image
                  : "https://images.pexels.com/photos/1181352/pexels-photo-1181352.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
              }),
              /* @__PURE__ */ jsxs("div", {
                children: [
                  /* @__PURE__ */ jsx("h4", {
                    className: "text-dark dark:text-metal",
                    children: name,
                  }),
                  /* @__PURE__ */ jsx("p", {
                    className:
                      "text-sm text-iron dark:text-white/30 font-light",
                    children: tag,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    }),
  });
};
const Why = () => {
  return /* @__PURE__ */ jsxs(ScrollReveal, {
    children: [
      " ",
      /* @__PURE__ */ jsxs("section", {
        className:
          "	flex flex-wrap-reverse xl:flex-nowrap gap-[64px] pt-[120px] pb-[80px] lg:pt-[160px] lg:pb-[120px]",
        children: [
          /* @__PURE__ */ jsx("img", {
            className:
              "h-[240px] w-full xl:w-[42%] object-cover rounded-xl md:h-[320px] xl:h-auto",
            src: "https://images.pexels.com/photos/7437487/pexels-photo-7437487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          }),
          /* @__PURE__ */ jsxs("div", {
            children: [
              /* @__PURE__ */ jsx("h2", {
                className:
                  "dark:text-white  text-3xl md:text-4xl lg:text-5xl	text-dark font-bold",
                children: "Porqué tomar este curso 🎯",
              }),
              /* @__PURE__ */ jsx("p", {
                className: "text-lg  dark:text-metal text-iron font-light mt-6",
                children:
                  "Aprenderás de forma teórica y práctica a crear componentes de React animados con motion. Y como es característico de cada uno de nuestros cursos, no estarás solo en este proceso, aprenderás los fundamentos de motion, además de una repasadita de los fundamentos de React para después empezar a construir animaciones declarativas y automáticas, sencillas y complejas, vistosas y sutiles para aplicarlas a tus componentes, aprenderás a definir animaciones con scroll o con el mouse, y mucho más.",
              }),
              /* @__PURE__ */ jsx("p", {
                className: "text-lg  dark:text-metal text-iron font-light mt-4",
                children:
                  "Después del curso, tus sitios web no volverán a ser los mismos. Podrás agregar animaciones que le den un toque dinámico y diferenciador.",
              }),
              /* @__PURE__ */ jsxs("div", {
                className: "flex flex-wrap md:flex-nowrap gap-12 mt-12",
                children: [
                  /* @__PURE__ */ jsxs("div", {
                    className: "w-full md:w-[50%] ",
                    children: [
                      /* @__PURE__ */ jsx("h3", {
                        className:
                          "text-2xl text-wvil text-dark dark:text-white font-semibold",
                        children: "Únete a la comunidad 👨‍👩‍👦‍👦",
                      }),
                      /* @__PURE__ */ jsxs("p", {
                        className:
                          "  dark:text-metal text-iron font-light mt-2",
                        children: [
                          "Al ser parte del curso, también eres parte de la comunidad de Discord, en donde puedes conversar con otros estudiantes o con el instructor para",
                          " ",
                          /* @__PURE__ */ jsxs("span", {
                            className:
                              "text-iron dark:text-white/70 font-semibold",
                            children: [
                              " ",
                              "colaborar, pedir feedback o recibir ayuda.",
                            ],
                          }),
                          " ",
                        ],
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxs("div", {
                    className: "w-full md:w-[50%]",
                    children: [
                      /* @__PURE__ */ jsxs("h3", {
                        className:
                          "text-2xl text-wvil text-dark dark:text-white font-semibold",
                        children: ["Aprende de forma flexible ⌛️", " "],
                      }),
                      /* @__PURE__ */ jsxs("p", {
                        className:
                          "  dark:text-metal text-iron font-light mt-2",
                        children: [
                          "No es necesario un horario fijo para tomar el curso, hazlo",
                          " ",
                          /* @__PURE__ */ jsx("span", {
                            className:
                              "text-iron dark:text-white/70 font-semibold",
                            children: "cuando quieras desde donde quieras.",
                          }),
                          " ",
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              /* @__PURE__ */ jsxs("div", {
                className: "flex flex-wrap md:flex-nowrap gap-12 mt-12",
                children: [
                  /* @__PURE__ */ jsxs("div", {
                    className: "w-full md:w-[50%] ",
                    children: [
                      /* @__PURE__ */ jsx("h3", {
                        className:
                          "text-2xl text-wvil text-dark dark:text-white font-semibold",
                        children: "Recibe feedback personal 🔥",
                      }),
                      /* @__PURE__ */ jsxs("p", {
                        className:
                          "  dark:text-metal text-iron font-light mt-2",
                        children: [
                          "Los ejercicios prácticos que realices durante el curso serán revisados por el instructor y",
                          " ",
                          /* @__PURE__ */ jsx("span", {
                            className:
                              "text-iron dark:text-white/70 font-semibold",
                            children: "recibirás feedback personalizado.",
                          }),
                        ],
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxs("div", {
                    className: "w-full md:w-[50%]",
                    children: [
                      /* @__PURE__ */ jsx("h3", {
                        className:
                          "text-2xl text-wvil text-dark dark:text-white font-semibold",
                        children: "Con acceso permanente 🛟",
                      }),
                      /* @__PURE__ */ jsxs("p", {
                        className:
                          "  dark:text-metal text-iron font-light mt-2",
                        children: [
                          "Al comprar el curso tienes",
                          " ",
                          /* @__PURE__ */ jsx("span", {
                            className:
                              "text-iron dark:text-white/70 font-semibold",
                            children: "acceso de por vida",
                          }),
                          " ",
                          "desde tu cuenta, además de acceso a todas las futuras actualizaciones.",
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
};
const action$2 = async ({ request }) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "checkout") {
    const url = await getStripeCheckout();
    return redirect(url);
  }
  return null;
};
function Route$3({ children }) {
  return /* @__PURE__ */ jsxs("main", {
    id: "main",
    className: "  bg-white dark:bg-dark overflow-hidden",
    children: [
      /* @__PURE__ */ jsx("nav", {
        className:
          "fixed h-16  bg-white/40 dark:bg-dark/40 backdrop-blur-md z-[100] w-full  px-6 md:px-[6%] lg:px-0 ",
        children: /* @__PURE__ */ jsxs("div", {
          className:
            "xl:max-w-7xl justify-between items-center h-16 mx-auto flex",
          children: [
            /* @__PURE__ */ jsx("a", {
              children: /* @__PURE__ */ jsx("img", {
                className: "h-10",
                src: "/Logo.png",
                alt: "logo",
              }),
            }),
            /* @__PURE__ */ jsx(ToggleButton, {}),
          ],
        }),
      }),
      /* @__PURE__ */ jsx(Hero, {
        children: /* @__PURE__ */ jsx(Form, {
          method: "POST",
          children: /* @__PURE__ */ jsxs(PrimaryButton, {
            name: "intent",
            value: "checkout",
            type: "submit",
            className: "w-full md:w-auto mx-auto",
            children: [
              "Comprar ",
              /* @__PURE__ */ jsx("img", { src: "/cursor.svg" }),
            ],
          }),
        }),
      }),
      /* @__PURE__ */ jsx(ScrollBanner, {}),
      /* @__PURE__ */ jsxs("section", {
        className: "w-full px-6 md:px-[6%] xl:px-0 xl:max-w-7xl mx-auto ",
        children: [
          /* @__PURE__ */ jsx(Why, {}),
          /* @__PURE__ */ jsx(Animations, {}),
          /* @__PURE__ */ jsx(Testimonials, {}),
          /* @__PURE__ */ jsx(Pricing, {}),
          /* @__PURE__ */ jsx(Teacher, {}),
          /* @__PURE__ */ jsx(Faq, {}),
        ],
      }),
      /* @__PURE__ */ jsx(Footer, {}),
      children,
    ],
  });
}
const route2 = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ Object.defineProperty(
    {
      __proto__: null,
      action: action$2,
      default: Route$3,
    },
    Symbol.toStringTag,
    { value: "Module" }
  )
);
const sleep = (t = 1) => new Promise((r) => setTimeout(r, t * 1e3));
const shotBlueConfetti = (trigger) =>
  trigger.addConfetti({
    confettiRadius: 6,
    confettiColors: ["rgb(81 88 246)"],
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
    "#f9bec7",
  ],
}) => {
  useEffect(() => {
    const jsConfetti = new JSConfetti();
    const start = async () => {
      if (mode2 === "emojis") {
        jsConfetti.addConfetti({
          emojis,
        });
        await sleep(2);
        jsConfetti.addConfetti({
          emojis,
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
const useClickOutside = ({ isActive, onOutsideClick, includeEscape }) => {
  const ref = useRef(null);
  const handleClick = (e) => {
    var _a;
    return (
      !((_a = ref.current) == null ? void 0 : _a.contains(e.target)) &&
      (onOutsideClick == null ? void 0 : onOutsideClick(e))
    );
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
const Drawer = ({
  children,
  isOpen = false,
  onClose,
  title = "Título",
  subtitle,
  cta,
  className,
  header,
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
  const jsx2 = /* @__PURE__ */ jsxs("article", {
    className: cn("relative ", className),
    children: [
      /* @__PURE__ */ jsx(motion.button, {
        onClick: onClose,
        id: "overlay",
        className: "fixed inset-0 bg-slate-200/20 z-10",
        animate: { backdropFilter: "blur(4px)" },
        exit: { backdropFilter: "blur(0)", opacity: 0 },
      }),
      /* @__PURE__ */ jsxs(motion.section, {
        initial: { x: "100%" },
        animate: { x: 0 },
        exit: { x: "120%" },
        transition: { type: "spring", bounce: 0.2, duration: 0.5 },
        className:
          "bg-white lg:w-[40%] md:w-[60%] w-[90%] z-10 h-screen fixed top-0 right-0 shadow-xl rounded-tl-3xl rounded-bl-3xl p-8 flex flex-col",
        children: [
          header
            ? header
            : /* @__PURE__ */ jsxs("header", {
                className: "flex items-start justify-between mb-6",
                children: [
                  /* @__PURE__ */ jsxs("div", {
                    children: [
                      /* @__PURE__ */ jsx("h4", {
                        className: "fot-bold text-2xl",
                        children: title,
                      }),
                      /* @__PURE__ */ jsx("p", {
                        className: "text-brand_gray",
                        children: subtitle,
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsx("button", {
                    tabIndex: 0,
                    onClick: onClose,
                    className:
                      "text-2xl bg-gray-200 rounded-full p-1 active:scale-95",
                    children: /* @__PURE__ */ jsx(IoClose, {}),
                  }),
                ],
              }),
          /* @__PURE__ */ jsx("section", {
            className: "overflow-y-scroll h-[95%]",
            children,
          }),
          /* @__PURE__ */ jsx("nav", {
            className: "flex justify-end gap-4  mt-auto",
            children: cta
              ? cta
              : /* @__PURE__ */ jsxs(Fragment, {
                  children: [
                    /* @__PURE__ */ jsx("button", {
                      onClick: onClose,
                      className:
                        "bg-brand_blue text-white hover:scale-95 rounded-full px-8 py-2 transition-all",
                      children: "Aceptar",
                    }),
                    /* @__PURE__ */ jsx("button", {
                      onClick: onClose,
                      className:
                        "text-red-500 bg-transparent px-8 py-2 hover:scale-95 transition-all",
                      children: "Cancelar",
                    }),
                  ],
                }),
          }),
        ],
      }),
    ],
  });
  return /* @__PURE__ */ jsx(AnimatePresence, {
    mode: "popLayout",
    children: isOpen && jsx2,
  });
};
const video = {
  title: "¿Qué son las future flags?",
  poster: "https://i.imgur.com/nITUzj1.png",
  type: "video/mov",
  src: "https://firebasestorage.googleapis.com/v0/b/fixter-67253.appspot.com/o/fixtergeek.com%2Fmicro-cursos%2Fintrocss%2F1_boxModel.mov?alt=media&token=54cc5e8a-0f90-4df8-9c98-cedfeef6c765",
};
const action$1 = async ({ request }) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "checkout") {
    const url = await getStripeCheckout();
    return redirect(url);
  }
  return null;
};
const loader$2 = async ({ request }) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const videos = await db.video.findMany({
    where: {
      courseIds: {
        has: "645d3dbd668b73b34443789c",
      },
    },
    select: {
      title: true,
      id: true,
      slug: true,
      moduleName: true,
      duration: true,
      index: true,
      poster: true,
      isPublic: true,
    },
  });
  const video2 = await db.video.findUnique({
    where: {
      slug: searchParams.get("videoSlug") || videos[0].slug,
    },
  });
  if (!video2) throw json(null, { status: 404 });
  const moduleNames = [...new Set(videos.map((video3) => video3.moduleName))];
  const user = { courses: ["645d3dbd668b73b34443789cx"] };
  const isPurchased = user.courses.includes("645d3dbd668b73b34443789c");
  return {
    user,
    isPurchased,
    video:
      !isPurchased && !video2.isPublic
        ? { ...video2, storageLink: "" }
        : video2,
    videos,
    moduleNames,
    searchParams: {
      success: searchParams.get("success") === "1",
    },
  };
};
function Route$2() {
  const {
    isPurchased,
    video: video2,
    videos,
    searchParams,
    moduleNames,
  } = useLoaderData();
  const [isLoading, setIsLoading] = useState(false);
  const handleClickEnding = () => {};
  const nextIndex = (video2.index + 1) % videos.length;
  const nextVideo = videos[nextIndex];
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [
      /* @__PURE__ */ jsxs("article", {
        className: "bg-slate-950 relative overflow-x-hidden",
        children: [
          /* @__PURE__ */ jsx(VideoPlayer, {
            onClickNextVideo: handleClickEnding,
            type: video2.type,
            src: video2.storageLink,
            poster: video2.poster,
            nextVideo,
            slug: video2.slug,
          }),
          /* @__PURE__ */ jsx(VideosMenu, {
            currentVideoSlug: video2.slug,
            videos,
            moduleNames,
            defaultOpen: !searchParams.success,
            isLocked: !isPurchased,
          }),
        ],
      }),
      searchParams.success && /* @__PURE__ */ jsx(EmojiConfetti, {}),
      !isPurchased &&
        !video2.isPublic &&
        /* @__PURE__ */ jsxs(Drawer, {
          header: /* @__PURE__ */ jsx(Fragment, {}),
          cta: /* @__PURE__ */ jsx(Fragment, {}),
          className: "z-50",
          title: "Desbloquea todo el curso",
          isOpen: true,
          children: [
            /* @__PURE__ */ jsxs("p", {
              className: "text-2xl text-center pt-20 pb-8",
              children: [
                "Recuerda que el código de los componentes es Open Source y puedes",
                " ",
                /* @__PURE__ */ jsx("a", {
                  className: "text-blue-500 hover:text-blue-600",
                  target: "_blank",
                  rel: "noreferrer",
                  href: "https://github.com/marianaLz/fun-components",
                  children: "copiarlos",
                }),
                " ",
                "libremente para tus proyectos. 😎",
              ],
            }),
            /* @__PURE__ */ jsxs("p", {
              className: "text-3xl text-center",
              children: [
                "Puedes seguir mirando, y construir conmigo todos los componentes paso a paso. ",
                /* @__PURE__ */ jsx("br", {}),
                "¡Desbloquea el curso completo! 🫶🏻",
              ],
            }),
            /* @__PURE__ */ jsx(Form, {
              method: "POST",
              children: /* @__PURE__ */ jsx(PrimaryButton, {
                onClick: () => setIsLoading(true),
                isLoading,
                name: "intent",
                value: "checkout",
                type: "submit",
                className: "font-bold w-full mt-20 hover:text-2xl",
                children: "¡Que siga la mágia! 🎩🪄",
              }),
            }),
          ],
        }),
    ],
  });
}
const VideosMenu = ({ videos, defaultOpen, moduleNames, currentVideoSlug }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const x = useMotionValue(0);
  const springX = useSpring(x, { bounce: 0.2 });
  const buttonX = useTransform(springX, [-400, 0], [0, 394]);
  const [completed, setCompleted] = useState([]);
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
      const allCompleted = videos
        .filter((vi) => vi.moduleName === moduleName)
        .every((v) => checkIfWatched(v.slug));
      allCompleted && list.push(moduleName);
    });
    setCompleted(list);
  }, []);
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [
      /* @__PURE__ */ jsx(MenuButton, {
        x: buttonX,
        onToggle: () => setIsOpen((o) => !o),
        isOpen,
      }),
      /* @__PURE__ */ jsx(MenuListContainer, {
        isOpen,
        x: springX,
        onOutsideClick: () => setIsOpen(false),
        children: moduleNames.map((moduleName, index) => {
          return /* @__PURE__ */ jsxs(
            "div",
            {
              children: [
                /* @__PURE__ */ jsx(ModuleHeader, {
                  title: moduleName,
                  subtitle: "unidad 0" + (index + 1),
                  isCompleted: completed.includes(moduleName),
                }),
                videos
                  .filter((vid) => vid.moduleName === moduleName)
                  .map((v) =>
                    /* @__PURE__ */ jsx(
                      ListItem,
                      {
                        isLocked: !v.isPublic,
                        isCurrent: currentVideoSlug === v.slug,
                        slug: v.slug || "",
                        title: v.title || "",
                        duration: v.duration || 60,
                      },
                      v.id
                    )
                  ),
              ],
            },
            index
          );
        }),
      }),
    ],
  });
};
const ListItem = ({
  isCompleted,
  duration,
  title,
  isCurrent,
  slug,
  isLocked,
}) => {
  return /* @__PURE__ */ jsxs(Link, {
    to: `/player?videoSlug=${slug}`,
    reloadDocument: true,
    className: cn(
      "text-gray-600 pl-2 flex py-4 hover:bg-gray-900 rounded-2xl hover:text-gray-400 transition-all items-center",
      {
        "bg-gray-800 my-1 hover:text-white text-white hover:bg-gray-800":
          isCurrent,
        "cursor-pointer": !isLocked,
        "cursor-not-allowed": isLocked,
      }
    ),
    children: [
      /* @__PURE__ */ jsx("span", {
        className: cn("text-2xl pl-8", {
          "text-green-500": isCompleted,
          "p-2 bg-indigo-500 rounded-full": isCurrent,
        }),
        children: isCurrent
          ? /* @__PURE__ */ jsx(FaPlay, {})
          : isCompleted
          ? /* @__PURE__ */ jsx(MdOutlineRadioButtonChecked, {})
          : /* @__PURE__ */ jsx(MdOutlineRadioButtonUnchecked, {}),
      }),
      /* @__PURE__ */ jsx("div", {
        className: "capitalize text-sm pl-8",
        children: title,
      }),
      isLocked
        ? /* @__PURE__ */ jsx("span", {
            className: "ml-auto pr-8",
            children: /* @__PURE__ */ jsx(IoMdLock, {}),
          })
        : /* @__PURE__ */ jsxs("div", {
            className: "text-xs pl-auto ml-auto pr-8",
            children: [duration, "m"],
          }),
    ],
  });
};
const MenuListContainer = ({
  children,
  x = 0,
  onOutsideClick,
  isOpen: isActive = false,
}) => {
  const ref = useClickOutside({ isActive, onOutsideClick });
  const maskImage = useMotionTemplate`linear-gradient(to bottom, white 80%, transparent 100%`;
  return /* @__PURE__ */ jsx(motion.div, {
    ref,
    style: {
      x,
      scrollbarWidth: "none",
      maskImage,
    },
    className:
      "bg-gray-950 md:w-[380px] w-[300px] absolute z-20 inset-2 rounded-xl overflow-y-scroll h-[88%]",
    children,
  });
};
const ModuleHeader = ({ title, subtitle, isCompleted }) => {
  return /* @__PURE__ */ jsxs("header", {
    className:
      "text-indigo-600 rounded-lg pl-9 py-3 bg-gray-800 flex items-center gap-4 mb-2",
    children: [
      /* @__PURE__ */ jsx("span", {
        className: cn("text-4xl", isCompleted && "text-green-500"),
        children: isCompleted
          ? /* @__PURE__ */ jsx(MdOutlineRadioButtonChecked, {})
          : /* @__PURE__ */ jsx(MdOutlineRadioButtonUnchecked, {}),
      }),
      /* @__PURE__ */ jsxs("div", {
        children: [
          /* @__PURE__ */ jsx("p", {
            className: "font-sans capitalize font-extrabold text-white",
            children: subtitle,
          }),
          /* @__PURE__ */ jsx("h3", {
            className: cn("text-2xl font-bold font-sans capitalize", {
              "text-green-500": isCompleted,
            }),
            children: title,
          }),
        ],
      }),
    ],
  });
};
const MenuButton = ({ isOpen, x = 0, onToggle }) => {
  return /* @__PURE__ */ jsx(motion.button, {
    whileHover: { scale: 1.05 },
    style: { x },
    onClick: onToggle,
    className: cn(
      "absolute bg-gray-900 text-4xl w-20 h-20 text-white top-16 z-20 flex items-center justify-center rounded-r-2xl hover:bg-gray-800",
      {
        "left-[-80px] md:left-auto": isOpen,
        "rounded-2xl": isOpen,
      }
    ),
    children: /* @__PURE__ */ jsx(AnimatePresence, {
      mode: "popLayout",
      children: isOpen
        ? /* @__PURE__ */ jsx(
            motion.span,
            {
              initial: { filter: "blur(4px)", opacity: 0 },
              animate: { filter: "blur(0px)", opacity: 1 },
              exit: { filter: "blur(4px)", opacity: 0 },
              children: /* @__PURE__ */ jsx(MdMenuOpen, {}),
            },
            "open"
          )
        : /* @__PURE__ */ jsx(
            motion.span,
            {
              initial: { filter: "blur(4px)", opacity: 0 },
              animate: { filter: "blur(0px)", opacity: 1 },
              exit: { filter: "blur(4px)", opacity: 0 },
              children: /* @__PURE__ */ jsx(BsMenuButtonWide, {}),
            },
            "close"
          ),
    }),
  });
};
const VideoPlayer = ({
  src,
  type = "video/mov",
  onPlay,
  onClickNextVideo,
  poster,
  onEnd,
  nextVideo = video,
  slug,
}) => {
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
    controls.onplaying = () => setIsPlaying(true);
    controls.onplay = () => setIsPlaying(true);
    controls.onpause = () => setIsPlaying(false);
    controls.onended = () => (onEnd == null ? void 0 : onEnd());
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
    list = [.../* @__PURE__ */ new Set([...list, slug])];
    localStorage.setItem("watched", JSON.stringify(list));
  };
  return /* @__PURE__ */ jsxs("section", {
    className: "h-screen relative overflow-x-hidden",
    children: [
      /* @__PURE__ */ jsxs(AnimatePresence, {
        children: [
          !isPlaying &&
            /* @__PURE__ */ jsx(
              motion.button,
              {
                onClick: togglePlay,
                initial: { backdropFilter: "blur(4px)" },
                animate: { backdropFilter: "blur(4px)" },
                exit: { backdropFilter: "blur(0px)", opacity: 0 },
                transition: { duration: 0.2 },
                className:
                  "absolute inset-0 bottom-16 flex justify-center items-center cursor-pointer z-10",
                children: /* @__PURE__ */ jsx("span", {
                  className:
                    "border flex items-center justify-center text-6xl text-white rounded-full bg-indigo-500 w-[120px] h-[90px]",
                  children: /* @__PURE__ */ jsx(FaGooglePlay, {}),
                }),
              },
              "play_button"
            ),
          nextVideo.index !== 0 &&
            isEnding &&
            /* @__PURE__ */ jsxs(motion.button, {
              onClick: onClickNextVideo,
              whileTap: { scale: 0.99 },
              transition: { type: "spring", bounce: 0.2 },
              whileHover: { scale: 1.05 },
              exit: { opacity: 0, filter: "blur(9px)", x: 50 },
              initial: { opacity: 0, filter: "blur(9px)", x: 50 },
              animate: { opacity: 1, filter: "blur(0px)", x: 0 },
              className:
                "absolute right-2 bg-gray-100 z-20 bottom-20 md:top-4 md:right-4 md:left-auto md:bottom-auto left-2 md:w-[500px] px-6 md:pt-6 pt-10 pb-6 rounded-3xl flex gap-4 shadow-sm items-end",
              children: [
                /* @__PURE__ */ jsx("button", {
                  onClick: () => setIsEnding(false),
                  className:
                    "self-end text-4xl active:scale-95 md:hidden absolute right-4 top-1",
                  children: /* @__PURE__ */ jsx(IoIosClose, {}),
                }),
                /* @__PURE__ */ jsxs("div", {
                  children: [
                    /* @__PURE__ */ jsx("p", {
                      className: "text-left text-lg",
                      children: "Siguiente video",
                    }),
                    /* @__PURE__ */ jsx("h4", {
                      className: "text-2xl md:w-[280px] md:truncate text-left",
                      children: nextVideo.title,
                    }),
                  ],
                }),
                /* @__PURE__ */ jsx("img", {
                  alt: "poster",
                  src: nextVideo.poster || poster,
                  onError: (e) => {
                    e.target.src = poster;
                    e.target.error = false;
                  },
                  className: "aspect-video w-40 rounded-xl",
                }),
              ],
            }),
        ],
      }),
      /* @__PURE__ */ jsxs("video", {
        poster,
        controlsList: "nodownload",
        ref: videoRef,
        className: "w-full h-full",
        controls: true,
        src,
        children: [
          /* @__PURE__ */ jsx("track", { kind: "captions" }),
          /* @__PURE__ */ jsx("source", { src, type }),
        ],
      }),
    ],
  });
};
const route3 = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ Object.defineProperty(
    {
      __proto__: null,
      action: action$1,
      default: Route$2,
      loader: loader$2,
    },
    Symbol.toStringTag,
    { value: "Module" }
  )
);
const loader$1 = async ({ request }) => {
  const url = new URL(request.url);
  url.searchParams.get("token");
  return null;
};
function Route$1() {
  return /* @__PURE__ */ jsxs("article", {
    className:
      "flex flex-col items-center h-screen justify-center gap-4 bg-slate-200",
    children: [
      /* @__PURE__ */ jsx("h2", {
        className: "text-2xl",
        children: "Este token no sirve más. 👩🏻‍🔧",
      }),
      /* @__PURE__ */ jsx(Link, {
        to: "/",
        children: /* @__PURE__ */ jsx(PrimaryButton, {
          children: "Volver al inicio",
        }),
      }),
    ],
  });
}
const route4 = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ Object.defineProperty(
    {
      __proto__: null,
      default: Route$1,
      loader: loader$1,
    },
    Symbol.toStringTag,
    { value: "Module" }
  )
);
const action = async ({ request }) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "delete_video") {
    const id = String(formData.get("videoId"));
    await db.video.delete({ where: { id } });
  }
  if (intent === "update_modulename") {
    const oldModuleName = String(formData.get("oldModuleName"));
    const newModuleName = String(formData.get("newModuleName"));
    await db.video.updateMany({
      where: {
        moduleName: oldModuleName,
      },
      data: { moduleName: newModuleName },
    });
  }
  if (intent === "update_video") {
    const data = JSON.parse(formData.get("data"));
    data.courseIds = ["645d3dbd668b73b34443789c"];
    data.slug = slugify(data.title, { lower: true });
    data.index = data.index ? Number(data.index) : void 0;
    if (data.id) {
      const id = data.id;
      delete data.id;
      await db.video.update({
        where: {
          id,
        },
        data,
      });
      return null;
    }
    await db.video.create({ data });
  }
  return null;
};
const loader = async () => {
  const course = await db.course.findUnique({
    where: { id: "645d3dbd668b73b34443789c" },
  });
  const videos = await db.video.findMany({
    where: {
      courseIds: {
        has: "645d3dbd668b73b34443789c",
      },
    },
  });
  if (!course) throw json(null, { status: 404 });
  const moduleNames = [...new Set(videos.map((video2) => video2.moduleName))];
  return { course, videos, moduleNames };
};
function Route() {
  const { course, moduleNames, videos } = useLoaderData();
  const [video2, setVideo] = useState({
    title: "Nuevo video",
    moduleName: "",
  });
  const [showVideoDrawer, setShowVideoDrawer] = useState(false);
  const [modules, setModules] = useState(moduleNames);
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
  const handleVideoEdit = (video22) => {
    setVideo(video22);
    setShowVideoDrawer(true);
  };
  const handleModuleTitleUpdate = (prev, nuevo) => {
    setModules((m) => m.map((mod) => (mod === prev ? nuevo : mod)));
  };
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [
      /* @__PURE__ */ jsxs("article", {
        className:
          "bg-gradient-to-tr from-slate-950 to-indigo-950 h-screen py-20 px-8",
        children: [
          /* @__PURE__ */ jsx("h1", {
            className: "text-gray-50 text-2xl mb-6",
            children: course.title,
          }),
          /* @__PURE__ */ jsxs("form", {
            onSubmit: handleModuleSubmit,
            className: "flex items-center justify-end gap-4",
            children: [
              /* @__PURE__ */ jsx("input", {
                name: "name",
                type: "text",
                placeholder: "Nombre del nuevo módulo",
                className: "py-3 px-6 text-lg rounded-full",
              }),
              /* @__PURE__ */ jsx(PrimaryButton, {
                type: "submit",
                className: "bg-green-500",
                children: "Añadir módulo",
              }),
            ],
          }),
          /* @__PURE__ */ jsx("section", {
            className: "my-8",
            children: modules.map((moduleTitle, i) =>
              /* @__PURE__ */ jsx(
                Module,
                {
                  index: i,
                  onModuleTitleUpdate: handleModuleTitleUpdate,
                  onVideoSelect: handleVideoEdit,
                  onAddVideo: () => moduleTitle && handleAddVideo(moduleTitle),
                  title: moduleTitle || "",
                  videos: videos.filter(
                    (video22) => video22.moduleName === moduleTitle
                  ),
                },
                moduleTitle
              )
            ),
          }),
        ],
      }),
      /* @__PURE__ */ jsx(Drawer, {
        onClose: () => {
          setShowVideoDrawer(false);
          setVideo({});
        },
        isOpen: showVideoDrawer,
        title: "Añadir video",
        cta: /* @__PURE__ */ jsx(Fragment, {}),
        children: /* @__PURE__ */ jsx(VideoForm, {
          nextIndex: videos.length,
          onSubmit: () => setShowVideoDrawer(false),
          video: video2,
        }),
      }),
    ],
  });
}
const VideoForm = ({ onSubmit, video: video2, nextIndex }) => {
  const fetcher = useFetcher();
  const isLoading = fetcher.state !== "idle";
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      title: video2.title || "",
      isPublic: video2.isPublic || false,
      storageLink: video2.storageLink || "",
      duration: video2.duration || "30",
      moduleName: video2.moduleName,
      id: video2.id,
      slug: video2.slug,
      index: String(video2.index === 0 ? "0" : video2.index || nextIndex),
      // @todo remove default
      poster: video2.poster || "https://i.imgur.com/GdtxiE9.png",
    },
  });
  const onSubmition = (values) => {
    fetcher.submit(
      {
        intent: "update_video",
        data: JSON.stringify(values),
      },
      { method: "POST" }
    );
    onSubmit == null ? void 0 : onSubmit(values);
  };
  const handleDelete = () => {
    if (!confirm("¿Seguro que quieres elminar?") || !video2.id) return;
    fetcher.submit(
      {
        intent: "delete_video",
        videoId: video2.id,
      },
      { method: "POST" }
    );
    onSubmit == null ? void 0 : onSubmit();
  };
  return /* @__PURE__ */ jsx(Fragment, {
    children: /* @__PURE__ */ jsxs(Form, {
      className: "flex flex-col h-full",
      onSubmit: handleSubmit(onSubmition),
      children: [
        /* @__PURE__ */ jsxs("h3", {
          className: "mb-2 text-gray-400 text-xl",
          children: ["Módulo: ", video2.moduleName],
        }),
        /* @__PURE__ */ jsxs("h3", {
          className: "mb-2 text-gray-400 text-xl",
          children: ["Slug: ", video2.slug],
        }),
        /* @__PURE__ */ jsx(TextField, {
          type: "number",
          placeholder: "lugar en la lista: 0",
          label: "Índice de orden",
          register: register("index", { required: true }),
        }),
        /* @__PURE__ */ jsx(TextField, {
          placeholder: "Título del nuevo video",
          label: "Título del video",
          register: register("title", { required: true }),
        }),
        /* @__PURE__ */ jsx(TextField, {
          defaultValue:
            "https://firebasestorage.googleapis.com/v0/b/fixter-67253.appspot.com/o/fixtergeek.com%2Fmicro-cursos%2Fintrocss%2F1_boxModel.mov?alt=media&token=54cc5e8a-0f90-4df8-9c98-cedfeef6c765",
          placeholder: "link del video",
          label: "Fuente del video",
          register: register("storageLink", { required: true }),
        }),
        /* @__PURE__ */ jsx(TextField, {
          placeholder: "poster del video",
          label: "Poster del video",
          register: register("poster", { required: false }),
        }),
        /* @__PURE__ */ jsxs("label", {
          className: "flex justify-between cursor-pointer my-4",
          children: [
            /* @__PURE__ */ jsx("span", {
              children: "¿Este video es público?",
            }),
            /* @__PURE__ */ jsx("input", {
              ...register("isPublic"),
              name: "isPublic",
              className: "size-4",
              type: "checkbox",
            }),
          ],
        }),
        /* @__PURE__ */ jsx(TextField, {
          defaultValue: 10,
          placeholder: "60",
          label: "Duración del video en minutos",
          register: register("duration", { required: true }),
        }),
        /* @__PURE__ */ jsxs("div", {
          className: "flex mt-auto gap-4",
          children: [
            /* @__PURE__ */ jsx(PrimaryButton, {
              isDisabled: !isValid || isLoading,
              className: "w-full",
              type: "submit",
              children: "Guardar",
            }),
            video2.id &&
              /* @__PURE__ */ jsx(PrimaryButton, {
                onClick: handleDelete,
                className: "w-full bg-red-500",
                type: "button",
                children: "Eliminar",
              }),
          ],
        }),
      ],
    }),
  });
};
const TextField = ({ error, name, label, placeholder, register, ...props }) => {
  return /* @__PURE__ */ jsxs("label", {
    className: "flex flex-col gap-2 mb-4",
    children: [
      /* @__PURE__ */ jsx("p", { className: "", children: label }),
      /* @__PURE__ */ jsx("input", {
        placeholder,
        className: "shadow rounded-md py-2 px-4 border w-full",
        type: "text",
        name,
        ...props,
        ...register,
      }),
      error && /* @__PURE__ */ jsx("p", { children: error }),
    ],
  });
};
const Module = ({
  title,
  videos = [],
  onAddVideo,
  onVideoSelect,
  onModuleTitleUpdate,
}) => {
  const fetcher = useFetcher();
  const [isOpen, setIsOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const ref = useClickOutside({
    isActive: isEditing,
    includeEscape: true,
    onOutsideClick: () => {
      setIsEditing(false);
    },
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
        newModuleName: value,
      },
      { method: "post" }
    );
  };
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [
      /* @__PURE__ */ jsxs("section", {
        className:
          "bg-slate-600 py-2 px-4 flex justify-between items-center mt-2",
        children: [
          isEditing
            ? /* @__PURE__ */ jsx("form", {
                ref,
                onSubmit: handleModuleTitleUpdate,
                children: /* @__PURE__ */ jsx("input", {
                  defaultValue: title,
                  autoFocus: true,
                  className: "rounded py-1 px-2",
                  placeholder: "Escribe un nuevo titulo",
                  name: "title",
                }),
              })
            : /* @__PURE__ */ jsx("button", {
                onClick: () => setIsEditing(true),
                className: "text-white font-bold capitalize text-left",
                children: title ? title : "Sin título",
              }),
          /* @__PURE__ */ jsx("button", {
            className: "flex-grow flex justify-end",
            onClick: () => setIsOpen((o) => !o),
            children: isOpen
              ? /* @__PURE__ */ jsx(FaChevronDown, {})
              : /* @__PURE__ */ jsx(FaChevronUp, {}),
          }),
        ],
      }),
      isOpen &&
        /* @__PURE__ */ jsxs("section", {
          className: "min-h-20 bg-slate-300 p-4 flex flex-col gap-2 group",
          children: [
            videos.length < 1 &&
              /* @__PURE__ */ jsx("p", {
                className: "text-center py-6",
                children: "No hay videos",
              }),
            videos.map((video2, index) =>
              /* @__PURE__ */ jsx(
                Video,
                {
                  onClick: () =>
                    onVideoSelect == null ? void 0 : onVideoSelect(video2),
                  video: video2,
                },
                video2.id
              )
            ),
            /* @__PURE__ */ jsx(PrimaryButton, {
              onClick: handleAddVideo,
              className: "group-hover:visible invisible ml-auto",
              children: "Añadir video",
            }),
          ],
        }),
    ],
  });
};
const Video = ({ video: video2, onClick }) => {
  return /* @__PURE__ */ jsx("button", {
    onClick,
    className: cn(
      "transition-all hover:scale-[1.02] text-left py-1 px-4 rounded",
      video2.isPublic ? "bg-green-500" : "bg-slate-400"
    ),
    children: /* @__PURE__ */ jsx("p", { children: video2.title }),
  });
};
const route5 = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ Object.defineProperty(
    {
      __proto__: null,
      action,
      default: Route,
      loader,
    },
    Symbol.toStringTag,
    { value: "Module" }
  )
);
const serverManifest = {
  entry: {
    module: "/assets/entry.client-CqCnjJUM.js",
    imports: ["/assets/components-DPsHuwtA.js"],
    css: [],
  },
  routes: {
    root: {
      id: "root",
      parentId: void 0,
      path: "",
      index: void 0,
      caseSensitive: void 0,
      hasAction: false,
      hasLoader: false,
      hasClientAction: false,
      hasClientLoader: false,
      hasErrorBoundary: false,
      module: "/assets/root-D27Sitk2.js",
      imports: ["/assets/components-DPsHuwtA.js"],
      css: ["/assets/root-Df6IuwBY.css"],
    },
    "routes/stripe.webhook": {
      id: "routes/stripe.webhook",
      parentId: "root",
      path: "stripe/webhook",
      index: void 0,
      caseSensitive: void 0,
      hasAction: true,
      hasLoader: false,
      hasClientAction: false,
      hasClientLoader: false,
      hasErrorBoundary: false,
      module: "/assets/stripe.webhook-l0sNRNKZ.js",
      imports: [],
      css: [],
    },
    "routes/_index": {
      id: "routes/_index",
      parentId: "root",
      path: void 0,
      index: true,
      caseSensitive: void 0,
      hasAction: true,
      hasLoader: false,
      hasClientAction: false,
      hasClientLoader: false,
      hasErrorBoundary: false,
      module: "/assets/_index-CClpmYXA.js",
      imports: [
        "/assets/components-DPsHuwtA.js",
        "/assets/PrimaryButton-B7VohWgc.js",
        "/assets/iconBase-jmq2uqsB.js",
        "/assets/index-DHm8Hqmp.js",
        "/assets/index-DYnYCmOj.js",
      ],
      css: [],
    },
    "routes/player": {
      id: "routes/player",
      parentId: "root",
      path: "player",
      index: void 0,
      caseSensitive: void 0,
      hasAction: true,
      hasLoader: true,
      hasClientAction: false,
      hasClientLoader: false,
      hasErrorBoundary: false,
      module: "/assets/player-mdgSnBvt.js",
      imports: [
        "/assets/components-DPsHuwtA.js",
        "/assets/iconBase-jmq2uqsB.js",
        "/assets/index-DYnYCmOj.js",
        "/assets/SimpleDrawer-BT4iV60b.js",
        "/assets/PrimaryButton-B7VohWgc.js",
      ],
      css: [],
    },
    "routes/portal": {
      id: "routes/portal",
      parentId: "root",
      path: "portal",
      index: void 0,
      caseSensitive: void 0,
      hasAction: false,
      hasLoader: true,
      hasClientAction: false,
      hasClientLoader: false,
      hasErrorBoundary: false,
      module: "/assets/portal-CDtY-IkD.js",
      imports: [
        "/assets/components-DPsHuwtA.js",
        "/assets/PrimaryButton-B7VohWgc.js",
      ],
      css: [],
    },
    "routes/admin": {
      id: "routes/admin",
      parentId: "root",
      path: "admin",
      index: void 0,
      caseSensitive: void 0,
      hasAction: true,
      hasLoader: true,
      hasClientAction: false,
      hasClientLoader: false,
      hasErrorBoundary: false,
      module: "/assets/admin-CFpNnJVz.js",
      imports: [
        "/assets/components-DPsHuwtA.js",
        "/assets/index-DHm8Hqmp.js",
        "/assets/PrimaryButton-B7VohWgc.js",
        "/assets/SimpleDrawer-BT4iV60b.js",
        "/assets/iconBase-jmq2uqsB.js",
      ],
      css: [],
    },
  },
  url: "/assets/manifest-4096d97c.js",
  version: "4096d97c",
};
const mode = "production";
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = {
  v3_fetcherPersist: true,
  v3_relativeSplatPath: true,
  v3_throwAbortReason: true,
  v3_singleFetch: true,
  v3_lazyRouteDiscovery: true,
  unstable_optimizeDeps: false,
};
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  root: {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0,
  },
  "routes/stripe.webhook": {
    id: "routes/stripe.webhook",
    parentId: "root",
    path: "stripe/webhook",
    index: void 0,
    caseSensitive: void 0,
    module: route1,
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route2,
  },
  "routes/player": {
    id: "routes/player",
    parentId: "root",
    path: "player",
    index: void 0,
    caseSensitive: void 0,
    module: route3,
  },
  "routes/portal": {
    id: "routes/portal",
    parentId: "root",
    path: "portal",
    index: void 0,
    caseSensitive: void 0,
    module: route4,
  },
  "routes/admin": {
    id: "routes/admin",
    parentId: "root",
    path: "admin",
    index: void 0,
    caseSensitive: void 0,
    module: route5,
  },
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
  routes,
};
