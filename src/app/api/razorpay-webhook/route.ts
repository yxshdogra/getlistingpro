import { NextResponse } from "next/server";
import { after } from "next/server";
import crypto from "crypto";
import { getPlanById } from "@/lib/constants";
import { RAZORPAY_PLAN_MAP } from "@/lib/razorpay-plans.server";
import {
  normalizePhone,
  sendPurchaseCapiEvent,
  sha256Lower,
} from "@/lib/meta-capi.server";

// Razorpay webhook — the out-of-band Purchase path. The browser pixel only
// fires when the checkout modal's success handler runs in-tab; async mandate
// authorizations (UPI AutoPay) and renewals never reach it. This route catches
// every successful charge via `subscription.charged` and sends a server-side
// Meta Purchase.
//
// Dedup: first charge uses event_id = subscription id, the same key the
// browser pixel and verify-payment CAPI use, so Meta collapses all three into
// one Purchase. Renewals use event_id = payment id (unique per charge, stable
// across Razorpay redeliveries). No local storage needed — Meta dedupes
// identical (event_name, event_id) pairs within its 48h window, which covers
// Razorpay's automatic retry schedule.
//
// The Razorpay account is shared across House of Tech products (~thousands of
// subscription events/day), so events are filtered to ListingPro plan ids
// before any logging or work.

const MAX_EVENT_AGE_SECONDS = 2 * 24 * 60 * 60;

interface WebhookSubscription {
  id?: string;
  plan_id?: string;
  paid_count?: number;
  notes?: Record<string, unknown>;
}

interface WebhookPayment {
  id?: string;
  amount?: number;
  email?: string;
  contact?: string | number;
}

function noteString(notes: Record<string, unknown>, key: string): string | undefined {
  const value = notes[key];
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

export async function POST(request: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    console.warn("razorpay-webhook: RAZORPAY_WEBHOOK_SECRET unset — ignoring delivery");
    return NextResponse.json({ ok: true, ignored: "unconfigured" });
  }

  // HMAC is computed over the raw request body — read it before any parsing.
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature") ?? "";
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  if (
    !/^[a-f0-9]{64}$/.test(signature) ||
    !crypto.timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(signature, "hex"))
  ) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: {
    event?: string;
    created_at?: number;
    payload?: {
      subscription?: { entity?: WebhookSubscription };
      payment?: { entity?: WebhookPayment };
    };
  };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // Always 2xx past this point (except the guards above): Razorpay auto-disables
  // endpoints with sustained failures, and none of these conditions are retryable.
  if (event.event !== "subscription.charged") {
    return NextResponse.json({ ok: true, ignored: "event" });
  }

  const sub = event.payload?.subscription?.entity;
  const payment = event.payload?.payment?.entity;

  // Shared account: only react to ListingPro plans. No logging on the ignore
  // path — sibling products' events would flood Cloud Run logs.
  const planEntry = Object.entries(RAZORPAY_PLAN_MAP).find(
    ([, rzpPlanId]) => rzpPlanId !== "" && rzpPlanId === sub?.plan_id
  );
  if (!planEntry || !sub?.id) {
    return NextResponse.json({ ok: true, ignored: "plan" });
  }

  // Stale redeliveries (and replayed captures) fall outside Meta's 48h dedup
  // window and would re-count a Purchase — drop them.
  if (
    typeof event.created_at === "number" &&
    Date.now() / 1000 - event.created_at > MAX_EVENT_AGE_SECONDS
  ) {
    console.warn(`razorpay-webhook: stale event dropped (sub=${sub.id})`);
    return NextResponse.json({ ok: true, ignored: "stale" });
  }

  const planId = planEntry[0];
  const plan = getPlanById(planId);
  if (!plan) {
    return NextResponse.json({ ok: true, ignored: "plan" });
  }

  // paid_count on the charged payload includes the charge that triggered it.
  const isFirstCharge = sub.paid_count === 1;
  const eventId = isFirstCharge ? sub.id : payment?.id ?? sub.id;
  const notes = sub.notes ?? {};

  const capiInput = {
    eventId,
    orderId: sub.id,
    planId,
    value: (typeof payment?.amount === "number" ? payment.amount : plan.amount) / 100,
    eventSourceUrl: process.env.NEXT_PUBLIC_SITE_BASE_URL ?? "https://www.getlistingpro.com",
    clientIp: noteString(notes, "lp_ip"),
    userAgent: noteString(notes, "lp_ua"),
    fbp: noteString(notes, "lp_fbp"),
    fbc: noteString(notes, "lp_fbc"),
    emailSha256: payment?.email ? sha256Lower(payment.email) : undefined,
    phoneSha256: payment?.contact ? sha256Lower(normalizePhone(String(payment.contact))) : undefined,
  };

  console.log(
    `razorpay-webhook: Purchase ${eventId} plan=${planId} first=${isFirstCharge}`
  );
  // Respond immediately; the CAPI call (3s timeout) runs post-response.
  after(() => sendPurchaseCapiEvent(capiInput));
  return NextResponse.json({ ok: true });
}
