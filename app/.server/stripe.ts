import Stripe from "stripe";

const isDev = process.env.NODE_ENV === "development";

export const PRICE_1499 = "price_1QKLfhJ7Zwl77LqnZw5iaY1V";
export const PRICE_999 = "price_1QKRbEJ7Zwl77Lqn0O8rRwrN";

export const DEV_PRICE = "price_1KBnlPJ7Zwl77LqnixoYRahN"; // 1200
export const DEV_COUPON = "rXOpoqJe"; // -25%
export const COUPON_40 = "EphZ17Lv"; // -40%
export const COUPON_50 = "yYMKDuTC"; // -50%

export const get40Checkout = async () => {
  return await getStripeCheckout({
    coupon: isDev ? DEV_COUPON : COUPON_40,
  });
};

export const get50Checkout = async (tokenEmail: string) => {
  return await getStripeCheckout({
    coupon: isDev ? DEV_COUPON : COUPON_50, // -50%
    metadata: {
      host: tokenEmail,
    },
  });
};

export const getStripeCheckout = async (
  options: {
    coupon?: string;
    customer_email?: string;
    metadata?: Record<string, string>;
    price?: string;
  } = { metadata: {} }
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
      ...options.metadata,
    },
    customer_email: options?.customer_email,
    mode: "payment",
    line_items: [
      {
        price: options.price
          ? options.price
          : isDev
          ? "price_1KBnlPJ7Zwl77LqnixoYRahN"
          : "price_1QKLfhJ7Zwl77LqnZw5iaY1V", // prod
        quantity: 1,
      },
    ],
    success_url: `${process.env.CURRENT_URL}/player?success=1`,
    cancel_url: `${process.env.CURRENT_URL}/player?videoIndex=10`,
    discounts: options.coupon ? [{ coupon: options.coupon }] : undefined,
    allow_promotion_codes: options.coupon ? undefined : true,
    // <= @todo multi moneda?
  });
  return session.url || "/";
};
