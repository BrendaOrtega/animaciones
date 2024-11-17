import { ActionFunctionArgs } from "@remix-run/node";
import { Form, redirect } from "@remix-run/react";
import React, { useState } from "react";
import { getStripeCheckout } from "~/.server/stripe";
import { getUserORNull } from "~/.server/user";
import { Animations } from "~/components/Animations";
import { NavBar } from "~/components/NavBar";
import { PrimaryButton } from "~/components/PrimaryButton";
import { Faq } from "~/home/Faq";
import { Footer } from "~/home/Footer";
import { Hero } from "~/home/Hero";
import { Pricing } from "~/home/Pricing";
import { ScrollBanner } from "~/home/ScrollBanenr";
import { Teacher } from "~/home/Teacher";
import { Testimonials } from "~/home/Testimonial";
import { Why } from "~/home/Why";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "checkout") {
    const url = await getStripeCheckout();
    return redirect(url);
  }
  if (intent === "self") {
    const user = await getUserORNull(request);
    return { user: { email: user?.email } };
  }
  return null;
};

export default function Route({ children }: { children: React.ReactNode }) {
  const [isLoading, setISLoading] = useState(false);
  return (
    <main id="main" className="  bg-white dark:bg-dark overflow-hidden">
      <NavBar />
      <Hero>
        <Form method="POST" className="flex justify-center gap-2">
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
            className="bg-pink-600 hover:h-16"
          >
            Comenzar a mirar gratis 🪄📺
          </PrimaryButton>
        </Form>
      </Hero>
      <ScrollBanner />
      <section className="w-full px-6 md:px-[6%] xl:px-0 xl:max-w-7xl mx-auto ">
        <Why />
        <Animations />
        <Testimonials />
        <Pricing
          leftButton={
            <>
              <Form method="POST">
                <PrimaryButton
                  onClick={() => setISLoading(true)}
                  isLoading={isLoading}
                  name="intent"
                  value="cheap_checkout"
                  type="submit"
                  className="w-full md:w-auto mx-auto"
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
    </main>
  );
}
