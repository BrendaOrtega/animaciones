import { ActionFunctionArgs } from "@remix-run/node";
import { Form, Location, redirect } from "@remix-run/react";
import React from "react";
import { getStripeCheckout } from "~/.server/stripe";
import { Animations } from "~/components/Animations";
import { PrimaryButton } from "~/components/PrimaryButton";
import { ToggleButton } from "~/components/ToggleButton";
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
  return null;
};

export default function Route({ children }: { children: React.ReactNode }) {
  return (
    <main id="main" className="  bg-white dark:bg-dark overflow-hidden">
      <nav className="fixed h-16  bg-white/40 dark:bg-dark/40 backdrop-blur-md z-[100] w-full  px-6 md:px-[6%] lg:px-0 ">
        <div className="xl:max-w-7xl justify-between items-center h-16 mx-auto flex">
          <a>
            <img className="h-10" src="/Logo.png" alt="logo" />
          </a>
          <ToggleButton />
        </div>
      </nav>
      <Hero>
        <Form method="POST">
          <PrimaryButton
            name="intent"
            value="checkout"
            type="submit"
            className="w-full md:w-auto mx-auto"
          >
            Comprar <img src="/cursor.svg" />
          </PrimaryButton>
        </Form>
      </Hero>
      <ScrollBanner />
      <section className="w-full px-6 md:px-[6%] xl:px-0 xl:max-w-7xl mx-auto ">
        <Why />
        <Animations />
        <Testimonials />
        <Pricing />
        <Teacher />
        <Faq />
      </section>
      <Footer />
      {children}
    </main>
  );
}
