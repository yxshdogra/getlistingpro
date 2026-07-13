// Server-side Meta Conversions API sender (server-only, like razorpay-plans.server.ts).
//
// Inert until META_CAPI_ACCESS_TOKEN is set: generate one in Events Manager →
// Data sources → the pixel → Settings → Conversions API, then set it on the
// Cloud Run service. The event_id matches the browser pixel's eventID
// (subscription id), so Meta dedupes the browser/server pair automatically.

const GRAPH_API_VERSION = "v21.0";

interface PurchaseCapiInput {
  subscriptionId: string;
  planId: string;
  value: number;
  clientIp?: string;
  userAgent?: string;
  fbp?: string;
  fbc?: string;
  eventSourceUrl: string;
}

export function readCookie(cookieHeader: string | null, name: string): string | undefined {
  if (!cookieHeader) return undefined;
  for (const part of cookieHeader.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name && rest.length > 0) return rest.join("=");
  }
  return undefined;
}

export async function sendPurchaseCapiEvent(input: PurchaseCapiInput): Promise<void> {
  const token = process.env.META_CAPI_ACCESS_TOKEN;
  const rawPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const pixelId = rawPixelId && /^\d+$/.test(rawPixelId) ? rawPixelId : null;
  if (!token || !pixelId) return;

  // For action_source "website" Meta requires event_source_url and at least
  // one user_data identifier; client_ip_address + client_user_agent qualify
  // and are sent raw (only PII fields like em/ph require hashing — none collected).
  const userData: Record<string, string> = {};
  if (input.clientIp) userData.client_ip_address = input.clientIp;
  if (input.userAgent) userData.client_user_agent = input.userAgent;
  if (input.fbp) userData.fbp = input.fbp;
  if (input.fbc) userData.fbc = input.fbc;
  if (Object.keys(userData).length === 0) return;

  const body: Record<string, unknown> = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: input.subscriptionId,
        action_source: "website",
        event_source_url: input.eventSourceUrl,
        user_data: userData,
        custom_data: {
          content_name: input.planId,
          value: input.value,
          currency: "INR",
          order_id: input.subscriptionId,
        },
      },
    ],
    access_token: token,
  };
  if (process.env.META_CAPI_TEST_EVENT_CODE) {
    body.test_event_code = process.env.META_CAPI_TEST_EVENT_CODE;
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_API_VERSION}/${pixelId}/events`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(3000),
      }
    );
    if (!res.ok) {
      const text = await res.text();
      console.error(`Meta CAPI error: HTTP ${res.status} ${text.slice(0, 300)}`);
    }
  } catch (error) {
    console.error(
      "Meta CAPI error:",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}
