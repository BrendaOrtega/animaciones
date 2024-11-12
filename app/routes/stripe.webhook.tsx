import { ActionFunctionArgs, json } from "@remix-run/node";
import Stripe from "stripe";
import { db } from "~/.server/db";
import { getOrCreateUser, sendWelcome } from "~/.server/user";

const isDev = process.env.NODE_ENV === "development";

const stripe = new Stripe(
  isDev
    ? process.env.STRIPE_SECRET_KEY || ""
    : process.env.STRIPE_SECRET_KEY_DEV || "",
  {
    // apiVersion: "2020-08-27",
  }
);

export const action = async ({ request }: ActionFunctionArgs) => {
  // ward to not recognize put, patch, delete
  if (request.method !== "POST") return json(null, { status: 400 });

  const payload = await request.text();
  const webhookStripeSignatureHeader =
    request.headers.get("stripe-signature") || "";
  const endpointSecret =
    process.env.NODE_ENV === "development"
      ? process.env.STRIPE_SIGN_DEV || ""
      : process.env.STRIPE_SIGN || "";
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      webhookStripeSignatureHeader,
      endpointSecret
    );
  } catch (error: unknown) {
    console.error(`Stripe event construct error: ${error}`);
    return json(error, { status: 401 });
  }

  switch (event.type) {
    case "checkout.session.async_payment_failed": // @todo send email
    default:
      break;
    case "checkout.session.async_payment_succeeded":
    case "checkout.session.completed":
      const session = event.data.object;

      const email = session.customer_email || session.customer_details?.email;
      const courseId = session.metadata?.courseId || "645d3dbd668b73b34443789c";
      if (!email || !courseId) {
        return json(
          "customer_email or courseId are missing from webhook event",
          {
            status: 403,
          }
        );
      }
      const user = await getOrCreateUser({
        username: email,
        email,
        displayName: session.customer_details?.name || "",
      });
      const courses = [...new Set([...user.courses, courseId])]; // avoiding repetition
      // assign course
      await db.user.update({
        where: { id: user.id },
        data: { courses },
      });
      await sendWelcome(user.email);
      break;
  }
  return json(null, { status: 200 });
};

// https://docs.stripe.com/cli/trigger
