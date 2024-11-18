import Stripe from "stripe";

const isDev = process.env.NODE_ENV === "development";

export const getStripeCheckout = async (
  options: {
    coupon?: string;
    customer_email?: string;
  } = {}
) => {
  const stripe = new Stripe(
    isDev
      ? process.env.STRIPE_SECRET_KEY_DEV || ""
      : (process.env.STRIPE_SECRET_KEY as string),
    {}
  );

  const session = await stripe.checkout.sessions.create({
    metadata: {
      courseId: "645d3dbd668b73b34443789c", // others?
    },
    customer_email: options?.customer_email,
    mode: "payment",
    line_items: [
      {
        price: isDev
          ? "price_1KBnlPJ7Zwl77LqnixoYRahN"
          : "price_1QKLfhJ7Zwl77LqnZw5iaY1V", // prod
        quantity: 1,
      },
    ],
    success_url: `${process.env.CURRENT_URL}/player?success=1`,
    cancel_url: `${process.env.CURRENT_URL}/player?videoSlug=bienvenida-al-curso`,
    discounts: options.coupon ? [{ coupon: options.coupon }] : undefined,
    // <= @todo multi moneda?
  });
  return session.url || "/";
};
