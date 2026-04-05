import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getPlanById } from "@/lib/constants";

function getRazorpay() {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
}

export async function POST(request: Request) {
  try {
    // CSRF: Validate Origin header
    const origin = request.headers.get("origin");
    const allowedOrigin = process.env.NEXT_PUBLIC_SITE_BASE_URL;
    if (allowedOrigin && origin && origin !== allowedOrigin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
    const order = await razorpay.orders.create({
      amount: plan.amount,
      currency: "INR",
      receipt: `receipt_${plan.id}_${Date.now()}`,
    });

    return NextResponse.json({
      orderId: order.id,
      amount: plan.amount,
      planId: plan.id,
      planName: plan.name,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error) {
    // Sanitize logged errors — don't log full error objects
    console.error("Create order error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
