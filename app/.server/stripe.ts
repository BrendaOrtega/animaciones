import { Location } from "@remix-run/react";
import Stripe from "stripe";

export const getStripeCheckout = async () => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {});

  const next = `/player`;
  const session = await stripe.checkout.sessions.create({
    metadata: {
      courseSlug: "animaciones_react",
    },
    customer_email: undefined, // @todo use logged user
    mode: "payment",
    // line_items: [{ price: 'price_1LbSx0J7Zwl77LqnTK9noQRh', quantity: 1 }],
    line_items: [{ price: "price_1LbSx0J7Zwl77LqnTK9noQRh", quantity: 1 }], // <= multi moneda
    success_url: `${process.env.CURRENT_URL}/player?success=1`,
    cancel_url: `${process.env.CURRENT_URL}/player?success=0`,
    //   ...discounts,
  });
  return session.url || "/";
};
