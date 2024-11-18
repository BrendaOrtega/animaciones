import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { NavBar } from "~/components/NavBar";
import { cn } from "~/lib/utils";
import { getEnrolledUserORNull, getUserORNull } from "~/.server/user";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getStripeCheckout } from "~/.server/stripe";

const isDev = process.env.NODE_ENV === "development";
const secret = "fixtergeek2024" + isDev;

const generateLink = (token: string) =>
  (isDev ? `http://localhost:3000` : `https://animations.fly.dev`) +
  "/comunidad?token=" +
  token;

const getToken = (email: string) => {
  // @todo no expiration?
  return jwt.sign({ email }, secret, { expiresIn: "24h" });
};

const validateToken = (token: string) => {
  let result;
  try {
    const r = jwt.verify(token, secret) as JwtPayload;
    result = { ...r, success: true };
  } catch (e) {
    result = { success: false };
  }
  console.log("result: ", result);
  return result;
};

// apply discount
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "checkout") {
    const stripeURL = await getStripeCheckout({
      coupon: "CUPON007",
    });
    return redirect(stripeURL);
  }
  return null;
};

// this is just a personalized checkout
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const { searchParams } = url;
  if (searchParams.has("token")) {
    const token = searchParams.get("token") as string;
    const tokenResult = validateToken(token);
    if (tokenResult.success) {
      return {
        screen: "discount",
        link: generateLink(token),
      };
    } else {
      return { screen: "bad_token", link: token };
    }
  }
  // default
  // animaciones course: @todo dynamic?
  const user = await getEnrolledUserORNull("645d3dbd668b73b34443789c", request);
  if (user?.email) {
    const token = getToken(user.email);
    return {
      screen: "default",
      link: generateLink(token),
    };
  }
  return redirect("/");
};

export default function Route() {
  const { link, screen } = useLoaderData<typeof loader>();
  switch (screen) {
    case "discount":
      return <Discount />;
    default:
      return (
        <article className="flex flex-col items-center h-screen justify-center gap-4 ">
          <NavBar />
          <h2 className="text-4xl font-semibold">
            Comparte este súper descuento con tus amigos 💪🏻
          </h2>
          <div className="flex relative w-full gap-2 h-16 rounded-full border border-lightGray  ">
            <input
              defaultValue={link}
              name="email"
              type="email"
              placeholder="brendi@ejemplo.com"
              className={cn(
                " py-2 px-6 w-full h-full bg-transparent rounded-full border-none focus:border-none focus:ring-indigo-500"
              )}
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(link);
              }}
              type="submit"
              className={cn(
                "absolute right-0 h-full not-disabled:hover:bg-indigo-600 rounded-full bg-indigo-500  py-1 px-2 md:px-6 text-white not-disabled:active:scale-95 disabled:cursor-not-allowed md:w-[220px] flex justify-center items-center text-md font-bold"
              )}
            >
              Copiar descuento 🪄
            </button>
          </div>
          <Discount />
        </article>
      );
  }
}

const Discount = ({ name }: { name?: string }) => {
  return (
    <>
      <h2>comprale con descuento gracias a {name ? name : "La comunidad"}</h2>
      <form method="POST">
        <button type="submit" name="intent" value="checkout">
          Comprar
        </button>
      </form>
    </>
  );
};
