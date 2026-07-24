import { NextResponse } from "next/server";
import crypto from "crypto";
import { getPlanById } from "@/lib/constants";

export async function POST(request: Request) {
  try {
    // CSRF: Require Origin header and validate against allowed origin
    const origin = request.headers.get("origin");
    const allowedOrigin = process.env.NEXT_PUBLIC_SITE_BASE_URL;
    if (!origin || !allowedOrigin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const allowed = new URL(allowedOrigin).hostname.replace(/^www\./, "");
    const incoming = new URL(origin).hostname.replace(/^www\./, "");
    if (allowed !== incoming) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
      // Sanitize subscription ID (returned separately, not in the URL)
      const safeSubscriptionId = razorpay_subscription_id.replace(/[^a-zA-Z0-9_]/g, "");

      // No server-side Purchase is fired here on purpose. The
      // subscription.charged webhook is the authoritative server event and its
      // payload is a strict superset of anything this route can build: it
      // carries the same fbp/fbc/ip/ua (stashed into subscription notes at
      // creation) PLUS hashed email and phone from the payment object.
      //
      // Firing here as well was worse than redundant. Both used
      // event_id = subscription_id, and Meta keeps the FIRST event it receives
      // for an id — so this route, which runs immediately and has no hashed
      // identifiers, reliably beat the webhook and threw away the better match
      // data. The browser pixel on /thank-you still provides the instant
      // client-side signal.
      return NextResponse.json({
        verified: true,
        planId: plan.id,
        subscriptionId: safeSubscriptionId,
        redirectUrl: "/thank-you",
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
