import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Requires Supabase auth cookies/session to be set in the app
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return new Response(`Auth error: ${error.message}`, { status: 401 });
  }

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    client_reference_id: user.id,
    customer_email: user.email ?? undefined,
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
  });

  return Response.json({ url: session.url });
}