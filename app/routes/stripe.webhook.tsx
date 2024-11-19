import { ActionFunctionArgs, json } from "@remix-run/node";
import Stripe from "stripe";
import { db } from "~/.server/db";
import { notifyBrendi } from "~/.server/emails";
import { getOrCreateUser, sendWelcome } from "~/.server/user";

const isDev = process.env.NODE_ENV === "development";

const stripe = new Stripe(
  isDev
    ? process.env.STRIPE_SECRET_KEY_DEV || ""
    : (process.env.STRIPE_SECRET_KEY as string),
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
  const endpointSecret = isDev
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
      // this query is only because of create a human readable email to brendi.
      const course = await db.course.findUnique({
        where: { id: courseId },
        select: { slug: true, title: true },
      });
      await notifyBrendi({
        user,
        courseTitle: course?.title || course?.slug || courseId,
      });
      // stats
      await db.stat.upsert({
        where: { name: "share_discount_link", giver: session.metadata.host },
        create: {
          name: "share_discount_link",
          count: 1,
          giver: session.metadata.host,
          friends: [user.email],
        },
        update: { count: { increment: 1 }, friends: { push: user.email } },
      });
      break;
  }
  return json(null, { status: 200 });
};

// https://docs.stripe.com/cli/trigger
