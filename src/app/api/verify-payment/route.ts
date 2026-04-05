import { NextResponse } from "next/server";
import crypto from "crypto";
import { getPlanById } from "@/lib/constants";

export async function POST(request: Request) {
  try {
    // CSRF: Validate Origin header
    const origin = request.headers.get("origin");
    const allowedOrigin = process.env.NEXT_PUBLIC_SITE_BASE_URL;
    if (allowedOrigin && origin && origin !== allowedOrigin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = body;

    // Input validation: all fields must be strings with expected formats
    if (
      typeof planId !== "string" ||
      typeof razorpay_order_id !== "string" ||
      typeof razorpay_payment_id !== "string" ||
      typeof razorpay_signature !== "string" ||
      !razorpay_order_id.startsWith("order_") ||
      !razorpay_payment_id.startsWith("pay_") ||
      razorpay_signature.length !== 64 ||
      !/^[a-f0-9]{64}$/.test(razorpay_signature)
    ) {
      return NextResponse.json({ error: "Invalid payment data" }, { status: 400 });
    }

    const plan = getPlanById(planId);
    if (!plan) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // Verify HMAC SHA256 signature using timing-safe comparison
    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(payload)
      .digest("hex");

    // Constant-time comparison to prevent timing side-channel attacks
    const verified = crypto.timingSafeEqual(
      Buffer.from(expectedSignature, "hex"),
      Buffer.from(razorpay_signature, "hex")
    );

    if (verified) {
      // Sanitize order ID before including in redirect URL
      const safeOrderId = razorpay_order_id.replace(/[^a-zA-Z0-9_]/g, "");
      return NextResponse.json({
        verified: true,
        redirectUrl: `/thank-you?order_id=${safeOrderId}&plan=${plan.id}&amount=${plan.amountDisplay}`,
      });
    }

    return NextResponse.json({ verified: false }, { status: 400 });
  } catch (error) {
    // Sanitize logged errors — don't log full error objects
    console.error("Verify payment error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
