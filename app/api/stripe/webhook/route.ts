import Stripe from "stripe";
import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function toIsoFromUnix(unixSeconds?: number | null) {
  if (!unixSeconds) return null;
  return new Date(unixSeconds * 1000).toISOString();
}

export async function POST(req: Request) {
  const sig = (await headers()).get("stripe-signature");
  if (!sig) return new Response("Missing stripe-signature", { status: 400 });

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session.client_reference_id;
      const customerId = typeof session.customer === "string" ? session.customer : null;
      const subscriptionId =
        typeof session.subscription === "string" ? session.subscription : null;

      if (userId && customerId && subscriptionId) {
        const sub = await stripe.subscriptions.retrieve(subscriptionId);

        await supabaseAdmin.from("subscriptions").upsert(
          {
            user_id: userId,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            status: sub.status,
            current_period_end: toIsoFromUnix(sub.current_period_end),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );
      }
    }

    return new Response("ok", { status: 200 });
  } catch (e: any) {
    return new Response(`Server Error: ${e.message}`, { status: 500 });
  }
}
