import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getPlanById, SUBSCRIPTION_TOTAL_COUNT } from "@/lib/constants";

function getRazorpay() {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
}

export async function POST(request: Request) {
  try {
    // CSRF: Validate Origin header (accept both www and non-www)
    const origin = request.headers.get("origin");
    const allowedOrigin = process.env.NEXT_PUBLIC_SITE_BASE_URL;
    if (allowedOrigin && origin) {
      const allowed = new URL(allowedOrigin).hostname.replace(/^www\./, "");
      const incoming = new URL(origin).hostname.replace(/^www\./, "");
      if (allowed !== incoming) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const body = await request.json();
    const { planId } = body;

    // Input validation: planId must be a non-empty string
    if (typeof planId !== "string" || planId.length === 0) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const plan = getPlanById(planId);
    if (!plan) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const razorpay = getRazorpay();
    const subscription = await razorpay.subscriptions.create({
      plan_id: plan.razorpayPlanId,
      total_count: SUBSCRIPTION_TOTAL_COUNT,
      quantity: 1,
      customer_notify: 1,
    });

    return NextResponse.json({
      subscriptionId: subscription.id,
      planId: plan.id,
      planName: plan.name,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Create subscription error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 }
    );
  }
}
