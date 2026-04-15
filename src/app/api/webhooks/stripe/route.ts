import { NextResponse } from "next/server";
import { getStripeClient } from "@/shared/lib/stripe";
import { prisma } from "@/shared/lib/prisma";
import Stripe from "stripe";

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Webhook secret is not configured" },
      { status: 500 }
    );
  }

  const stripe = getStripeClient();

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session.client_reference_id;
    const customerEmail = session.customer_details?.email;
    const customerId =
      typeof session.customer === "string"
        ? session.customer
        : session.customer?.id;

    if (userId) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          plan: "PRO",
          stripeCustomerId: customerId ?? undefined,
        },
      });
    } else if (customerEmail) {
      await prisma.user.update({
        where: { email: customerEmail },
        data: {
          plan: "PRO",
          stripeCustomerId: customerId ?? undefined,
        },
      });
    }
  }

  return NextResponse.json({ received: true });
}
