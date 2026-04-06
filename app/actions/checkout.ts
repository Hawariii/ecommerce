"use server";

import { redirect } from "next/navigation";
import Stripe from "stripe";

export async function checkoutAction(formData: FormData) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const fullName = String(formData.get("fullName") ?? "");

  if (!fullName) {
    redirect("/checkout?error=1");
  }

  if (stripeKey) {
    const stripe = new Stripe(stripeKey);
    await stripe.paymentIntents.create({
      amount: 199000,
      currency: "idr",
      automatic_payment_methods: { enabled: true },
      metadata: { checkoutSource: "hawari-commerce" },
    });
  }

  redirect("/checkout/success");
}
