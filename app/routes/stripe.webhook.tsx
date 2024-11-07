import { ActionFunctionArgs } from "@remix-run/node";
import Stripe from "stripe";
import { db } from "~/.server/db";
import { getOrCreateUser } from "~/.server/user";

// @todo 1.test in dev mode 2.send emails

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2020-08-27",
});

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== "POST") return; // to not recognize put, patch, delete
  const webhookSecret = process.env.STRIPE_SIGN || "";
  const webhookStripeSignatureHeader =
    request.headers.get("stripe-signature") || "";
  const payload = await request.text();
  const event = stripe.webhooks.constructEvent(
    payload,
    webhookStripeSignatureHeader,
    webhookSecret
  );
  // @todo catch error
  switch (event.type) {
    case "checkout.session.async_payment_failed": // @todo send email
    default:
      break;
    case "checkout.session.async_payment_succeeded":
    case "checkout.session.completed":
      const session = event.data.object;
      const user = await getOrCreateUser({
        username: session.customer_email || session.customer_details?.email,
        email: session.customer_email || session.customer_details?.email,
        displayName: session.customer_details?.name,
      });
      // assign course
      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          courses: {
            push: [...new Set([...user.courses, session.metadata?.courseSlug])],
          },
        },
      });
      // @todo send email
      break;
  }
  return null;
};
