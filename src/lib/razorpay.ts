import { getPlanById } from "./constants";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: { contact?: string; email?: string };
  theme?: { color?: string };
  modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
  open: () => void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
    document.head.appendChild(script);
  });
}

export async function initiateCheckout(planId: string) {
  const plan = getPlanById(planId);
  if (!plan) throw new Error(`Plan not found: ${planId}`);

  // 1. Create order on server
  const res = await fetch("/api/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ planId }),
  });

  if (!res.ok) {
    throw new Error("Failed to create order");
  }

  const { orderId, keyId } = await res.json();

  // 2. Load Razorpay script
  await loadRazorpayScript();

  // 3. Open checkout
  return new Promise<void>((resolve, reject) => {
    const options: RazorpayOptions = {
      key: keyId,
      amount: plan.amount,
      currency: "INR",
      name: "ListingPro",
      description: `${plan.name} Plan — ${plan.amountDisplay}${plan.period}`,
      order_id: orderId,
      handler: async (response: RazorpayResponse) => {
        try {
          // 4. Verify payment on server
          const verifyRes = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planId,
            }),
          });

          const data = await verifyRes.json();

          if (data.verified && typeof data.redirectUrl === "string" && data.redirectUrl.startsWith("/")) {
            window.location.href = data.redirectUrl;
          } else if (!data.verified) {
            window.location.href = `/payment-failed?plan=${planId}`;
          }
          resolve();
        } catch {
          window.location.href = `/payment-failed?plan=${planId}`;
          reject();
        }
      },
      theme: { color: "#213E80" },
      modal: {
        ondismiss: () => {
          window.location.href = `/payment-failed?plan=${planId}`;
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  });
}
