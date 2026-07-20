import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getPlanById, SUBSCRIPTION_TOTAL_COUNT } from "@/lib/constants";
import { RAZORPAY_PLAN_MAP } from "@/lib/razorpay-plans.server";
import { readCookie } from "@/lib/meta-capi.server";

function getRazorpay() {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
}

// Rate limiter — 5 requests per IP per 60 seconds
const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_MAX = 5;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

// Clean up stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now > entry.resetAt) rateLimitMap.delete(ip);
  }
}, 5 * 60_000);

export async function POST(request: Request) {
  try {
    // Rate limit by IP
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

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
    const { planId } = body;

    // Input validation: planId must be a non-empty string
    if (typeof planId !== "string" || planId.length === 0) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const plan = getPlanById(planId);
    const razorpayPlanId = RAZORPAY_PLAN_MAP[planId];
    if (!plan || !razorpayPlanId) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // Stash browser attribution context in subscription notes: Razorpay echoes
    // them back in every webhook payload, giving the webhook's server-side Meta
    // Purchase browser-grade match keys (webhooks have no cookies of their own).
    // Razorpay limits: ≤15 keys, ≤256 chars per value.
    const cookieHeader = request.headers.get("cookie");
    const ua = request.headers.get("user-agent") ?? "";
    const fbp = readCookie(cookieHeader, "_fbp");
    const fbc = readCookie(cookieHeader, "_fbc");
    const notes: Record<string, string> = { lp_plan: plan.id };
    if (ip !== "unknown") notes.lp_ip = ip;
    if (ua) notes.lp_ua = ua.slice(0, 250);
    if (fbp && fbp.length <= 255) notes.lp_fbp = fbp;
    // Omit rather than truncate — a truncated fbc corrupts attribution.
    if (fbc && fbc.length <= 255) notes.lp_fbc = fbc;

    const razorpay = getRazorpay();
    const subscription = await razorpay.subscriptions.create({
      plan_id: razorpayPlanId,
      total_count: SUBSCRIPTION_TOTAL_COUNT,
      quantity: 1,
      customer_notify: 1,
      notes,
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
