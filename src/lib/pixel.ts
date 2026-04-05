declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
    _fbq: (...args: unknown[]) => void;
  }
}

export function trackPageView() {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "PageView");
  }
}

export function trackViewContent(planId: string, value: number) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "ViewContent", {
      content_name: planId,
      content_type: "product",
      value,
      currency: "INR",
    });
  }
}

export function trackInitiateCheckout(planId: string, value: number) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "InitiateCheckout", {
      content_name: planId,
      value,
      currency: "INR",
    });
  }
}

export function trackPurchase(
  planId: string,
  value: number,
  orderId: string
) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Purchase", {
      content_name: planId,
      value,
      currency: "INR",
      order_id: orderId,
    });
  }
}
