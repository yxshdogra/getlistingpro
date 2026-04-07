import { NextResponse } from "next/server";
import crypto from "crypto";
import { getPlanById } from "@/lib/constants";

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
    const { razorpay_subscription_id, razorpay_payment_id, razorpay_signature, planId } = body;

    // Input validation: all fields must be strings with expected formats
    if (
      typeof planId !== "string" ||
      typeof razorpay_subscription_id !== "string" ||
      typeof razorpay_payment_id !== "string" ||
      typeof razorpay_signature !== "string" ||
      !razorpay_subscription_id.startsWith("sub_") ||
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

    // Verify HMAC SHA256 signature: payload is payment_id|subscription_id for subscriptions
    const payload = `${razorpay_payment_id}|${razorpay_subscription_id}`;
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
      // Sanitize subscription ID before including in redirect URL
      const safeSubscriptionId = razorpay_subscription_id.replace(/[^a-zA-Z0-9_]/g, "");
      return NextResponse.json({
        verified: true,
        redirectUrl: `/thank-you?subscription_id=${safeSubscriptionId}&plan=${plan.id}&amount=${plan.amountDisplay}`,
      });
    }

    return NextResponse.json({ verified: false }, { status: 400 });
  } catch (error) {
    console.error("Verify payment error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
