import { MetaFunction } from "@remix-run/node";
import { ActionFunctionArgs } from "@remix-run/node";
import { Form, redirect } from "@remix-run/react";
import React, { useState } from "react";
import {
  COUPON_40,
  DEV_COUPON,
  DEV_PRICE,
  get40Checkout,
  getStripeCheckout,
  PRICE_1499,
  PRICE_999,
} from "~/.server/stripe";
import { getUserORNull } from "~/.server/user";
import { Animations } from "~/components/Animations";
import { NavBar } from "~/components/NavBar";
import { Faq } from "~/home/Faq";
import { Footer } from "~/home/Footer";
import { Hero } from "~/home/Hero";
import { Pricing } from "~/home/Pricing";
import { ScrollBanner } from "~/home/ScrollBanenr";
import { Teacher } from "~/home/Teacher";
import { Testimonials } from "~/home/Testimonial";
import { Why } from "~/home/Why";
import { PrimaryButton } from "~/components/PrimaryButton";
import { getMetaTags } from "~/utils/getMetaTags";

export const action = async ({ request }: ActionFunctionArgs) => {
  const isDev = process.env.NODE_ENV === "development";
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "cheap_checkout") {
    const url = await getStripeCheckout({
      price: isDev ? DEV_PRICE : PRICE_999, // 999
      coupon: isDev ? DEV_COUPON : COUPON_40,
    }); // @todo apply 40% coupon no shirt
    throw redirect(url);
  }
  if (intent === "premium_checkout") {
    const url = await getStripeCheckout({
      price: isDev ? DEV_PRICE : PRICE_1499, // 1499
      coupon: isDev ? DEV_COUPON : COUPON_40,
    }); // @todo apply 40% coupon with shirt
    throw redirect(url);
  }
  if (intent === "checkout") {
    const url = await get40Checkout();
    return redirect(url);
  }
  if (intent === "self") {
    const user = await getUserORNull(request);
    return { user: { email: user?.email } };
  }
  return null;
};

export const meta: MetaFunction = () =>
  getMetaTags({
    title: "Curso de animaciones con React | Fixtergeek ",
    description:
      "Crea tus propios componentes animados con React, Vite y Motion",
  });

export default function Route({ children }: { children: React.ReactNode }) {
  const [isLoading, setISLoading] = useState(false);
  return (
    <section id="main" className="  bg-white dark:bg-dark overflow-hidden">
      <NavBar />
      <Hero>
        <Form method="post" className="flex justify-center gap-2">
          <PrimaryButton
            onClick={() => setISLoading(true)}
            isLoading={isLoading}
            name="intent"
            value="checkout"
            type="submit"
          >
            Comprar <img src="/cursor.svg" />
          </PrimaryButton>
          <PrimaryButton
            as="Link"
            to="/player"
            type="button"
            className="bg-pink-600 enabled:hover:px-8"
          >
            Comenzar gratis 🪄📺
          </PrimaryButton>
        </Form>
        {/* <DialogButton className="mx-auto">
          Únete a la lista de espera <FaRegClock />
        </DialogButton> */}
      </Hero>
      <ScrollBanner />
      <section className="w-full px-6 md:px-[6%] xl:px-0 xl:max-w-7xl mx-auto ">
        <Why />
        <Animations />
        <Testimonials />
        <Pricing
          rightButton={
            <>
              {/* <DialogButton className="mx-auto mt-12 w-full">
                Únete a la lista de espera <FaRegClock />
              </DialogButton> */}

              <Form method="POST">
                <PrimaryButton
                  onClick={() => setISLoading(true)}
                  isLoading={isLoading}
                  name="intent"
                  value="premium_checkout"
                  type="submit"
                  className="w-full my-4 mt-12"
                >
                  Comprar <img src="/cursor.svg" />
                </PrimaryButton>
              </Form>
            </>
          }
          leftButton={
            <>
              {/* <DialogButton className="mx-auto mt-12 w-full">
                Únete a la lista de espera <FaRegClock />
              </DialogButton> */}
              <Form method="POST">
                <PrimaryButton
                  onClick={() => setISLoading(true)}
                  isLoading={isLoading}
                  name="intent"
                  value="cheap_checkout"
                  type="submit"
                  className="w-full my-4 mt-12"
                >
                  Comprar <img src="/cursor.svg" />
                </PrimaryButton>
              </Form>
            </>
          }
        />
        <Teacher />
        <Faq />
      </section>
      <Footer />
      {children}
    </section>
  );
}
