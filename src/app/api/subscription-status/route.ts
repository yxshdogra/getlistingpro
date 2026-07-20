import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { RAZORPAY_PLAN_MAP } from "@/lib/razorpay-plans.server";

// Coarse subscription status for the checkout ondismiss rescue: UPI-AutoPay
// mandate approvals complete asynchronously, so the modal's success handler
// may never run even though the subscription is authenticated. The client
// calls this once on dismiss to decide thank-you vs payment-failed.

function getRazorpay() {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
}

// Rate limiter — 5 requests per IP per 60 seconds (same pattern as create-subscription)
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

setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now > entry.resetAt) rateLimitMap.delete(ip);
  }
}, 5 * 60_000);

function isSameOrigin(request: Request): boolean {
  // Same-origin GET fetches may omit the Origin header; accept Sec-Fetch-Site
  // (sent by all modern browsers) or fall back to Referer hostname matching.
  const secFetchSite = request.headers.get("sec-fetch-site");
  if (secFetchSite) return secFetchSite === "same-origin";

  const allowedOrigin = process.env.NEXT_PUBLIC_SITE_BASE_URL;
  const source = request.headers.get("origin") ?? request.headers.get("referer");
  if (!source || !allowedOrigin) return false;
  try {
    const allowed = new URL(allowedOrigin).hostname.replace(/^www\./, "");
    const incoming = new URL(source).hostname.replace(/^www\./, "");
    return allowed === incoming;
  } catch {
    return false;
  }
}

export async function GET(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    if (!isSameOrigin(request)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const id = new URL(request.url).searchParams.get("id") ?? "";
    if (!/^sub_[A-Za-z0-9]{8,32}$/.test(id)) {
      return NextResponse.json({ error: "Invalid subscription id" }, { status: 400 });
    }

    // Fetch-by-id only — the list API's ?plan_id= filter hangs on the huge
    // shared Razorpay account.
    const razorpay = getRazorpay();
    const subscription = await razorpay.subscriptions.fetch(id);

    // Shared account: never disclose status of other products' subscriptions.
    const isOurs = Object.values(RAZORPAY_PLAN_MAP).some(
      (rzpPlanId) => rzpPlanId !== "" && rzpPlanId === subscription.plan_id
    );
    const planId = isOurs
      ? Object.entries(RAZORPAY_PLAN_MAP).find(([, v]) => v === subscription.plan_id)?.[0]
      : undefined;
    if (!isOurs || !planId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ status: subscription.status, planId });
  } catch (error) {
    console.error(
      "Subscription status error:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }
}
