"use server";

import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function createCheckout() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!dbUser) {
    return { error: "User not found" };
  }

  if (dbUser.plan === "PRO") {
    return { error: "Already on PRO plan" };
  }

  const prices = await stripe.prices.list({
    product: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID!,
    active: true,
    limit: 1,
  });

  if (prices.data.length === 0) {
    return { error: "No active price found" };
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: prices.data[0].id, quantity: 1 }],
    client_reference_id: user.id,
    customer_email: dbUser.stripeCustomerId ? undefined : user.email!,
    customer: dbUser.stripeCustomerId ?? undefined,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`,
  });

  return { url: session.url };
}
