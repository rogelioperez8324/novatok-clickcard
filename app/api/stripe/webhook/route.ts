import Stripe from "stripe";
import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  // ✅ Don't crash the build. Only fail when webhook is called.
  if (!/^https?:\/\//.test(url)) return null;
  if (!key) return null;

  return createClient(url, key);
}

function toIsoFromUnix(unixSeconds?: number | null) {
  if (!unixSeconds) return null;
  return new Date(unixSeconds * 1000).toISOString();
}

export async function POST(req: Request) {
  // ✅ Validate Supabase only at request-time
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    return new Response(
      "Missing/invalid Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
      { status: 500 }
    );
  }

  const sig = (await headers()).get("stripe-signature");
  if (!sig) return new Response("Missing stripe-signature", { status: 400 });

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return new Response("Missing STRIPE_WEBHOOK_SECRET", { status: 500 });
  }

  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session.client_reference_id;
      const customerId =
        typeof session.customer === "string" ? session.customer : null;
      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : null;

      if (userId && customerId && subscriptionId) {
        const sub = await stripe.subscriptions.retrieve(subscriptionId);

        const { error } = await supabaseAdmin.from("subscriptions").upsert(
          {
            user_id: userId,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            status: (sub as any).status,
            current_period_end: toIsoFromUnix(
              (sub as any).current_period_end
            ),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );

        if (error) {
          return new Response(`Supabase Error: ${error.message}`, {
            status: 500,
          });
        }
      }
    }

    return new Response("ok", { status: 200 });
  } catch (e: any) {
    return new Response(`Server Error: ${e.message}`, { status: 500 });
  }
}