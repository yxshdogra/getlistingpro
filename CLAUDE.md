# ListingPro

Conversion-focused landing page for ListingPro, a content creation service for Indian e-commerce sellers.

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4** (CSS-first config via `@theme` in `globals.css`)
- **Razorpay** (Subscriptions API with server-side signature verification)
- **Meta Pixel** (PageView, InitiateCheckout, Purchase events)

## Local Development

```bash
npm install
cp .env.example .env.local   # Fill in actual values
npm run dev                   # http://localhost:3000
```

## Build

```bash
npm run build
npm start       # Production server on port 3000
```

## Routes

| Path | Description |
|---|---|
| `/` | Landing page |
| `/thank-you` | Payment success (after server-verified payment) |
| `/payment-failed?plan=Y` | Payment failure with retry |
| `/api/create-subscription` | POST — creates Razorpay subscription (stashes attribution context in notes) |
| `/api/verify-payment` | POST — verifies Razorpay subscription signature (HMAC SHA256) |
| `/api/razorpay-webhook` | POST — Razorpay `subscription.charged` webhook → server-side Meta Purchase (covers async UPI-AutoPay mandates + renewals the browser pixel never sees) |
| `/api/subscription-status` | GET `?id=sub_…` — coarse status for the checkout ondismiss rescue (async mandate approvals) |

## Environment Variables

| Variable | Description |
|---|---|
| `RAZORPAY_KEY_ID` | Server-side Razorpay key |
| `RAZORPAY_KEY_SECRET` | Server-side Razorpay secret |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Client-side Razorpay key (same as above) |
| `RAZORPAY_PLAN_ID_STARTER` | Razorpay plan ID for the Starter ₹499/mo subscription (defines the billed amount) |
| `RAZORPAY_PLAN_ID_GROWTH` | Razorpay plan ID for the Growth ₹999/mo subscription (defines the billed amount) |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta/Facebook Pixel ID |
| `META_CAPI_ACCESS_TOKEN` | Optional — enables server-side Meta Purchase (Conversions API) from verify-payment and the Razorpay webhook; deduped with the browser pixel via `event_id` (subscription id for the first charge, payment id for renewals). Unset = skips are logged with `console.warn` |
| `META_CAPI_TEST_EVENT_CODE` | Optional, verification only — routes server CAPI events to Events Manager → Test Events |
| `RAZORPAY_WEBHOOK_SECRET` | Secret of the `subscription.charged` webhook endpoint registered in the Razorpay Dashboard (its own random string, NOT the key secret). Runtime-only on Cloud Run — never a build arg. Unset = webhook route ignores deliveries |
| `NEXT_PUBLIC_WHATSAPP_ONBOARDING_URL` | WhatsApp deep link for onboarding |
| `NEXT_PUBLIC_SITE_BASE_URL` | Production site URL |

## Project Structure

- `src/app/` — Pages and API routes (App Router)
- `src/components/` — Landing page sections + shared UI
- `src/lib/constants.ts` — Plan definitions (amounts in paise)
- `src/lib/razorpay.ts` — Client-side Razorpay checkout helper
- `src/lib/pixel.ts` — Meta Pixel event helpers
- `src/app/globals.css` — Tailwind v4 theme config with all design tokens

## Design Tokens

All design tokens are defined in `src/app/globals.css` under `@theme inline`. Key values:
- Primary: `#213E80`, Accent: `#F88F24`, Success: `#22C55E`, WhatsApp: `#25D366`
- Fonts: DM Sans (headings), Inter (body)
- Card radius: 12px, Button radius: 8px

## Deployment

Cloud Run (`listingpro-web`, project `jaatpride-05874`, region `asia-south1`) behind
a Firebase Hosting rewrite (site `getlistingpro`). The image is built by Cloud Build;
`NEXT_PUBLIC_*` values are baked in at build time via substitutions, server secrets
are runtime env on the service (never in the image — `.dockerignore`/`.gcloudignore`
exclude `.env*`).

```bash
# Build (NEXT_PUBLIC_* values from .env.local):
gcloud builds submit --project jaatpride-05874 --config cloudbuild.yaml \
  --substitutions _NEXT_PUBLIC_RAZORPAY_KEY_ID=...,_NEXT_PUBLIC_META_PIXEL_ID=...,_NEXT_PUBLIC_WHATSAPP_ONBOARDING_URL=...,_NEXT_PUBLIC_SITE_BASE_URL=https://www.getlistingpro.com

# Deploy (server-only env set on the service):
gcloud run deploy listingpro-web --project jaatpride-05874 --region asia-south1 \
  --image asia-south1-docker.pkg.dev/jaatpride-05874/listingpro/listingpro-web:latest \
  --allow-unauthenticated --memory 512Mi \
  --set-env-vars RAZORPAY_KEY_ID=...,RAZORPAY_KEY_SECRET=...,RAZORPAY_PLAN_ID_STARTER=...,RAZORPAY_PLAN_ID_GROWTH=...,RAZORPAY_WEBHOOK_SECRET=...,NEXT_PUBLIC_SITE_BASE_URL=https://www.getlistingpro.com

# Add/rotate individual runtime secrets without a rebuild:
gcloud run services update listingpro-web --project jaatpride-05874 --region asia-south1 \
  --update-env-vars META_CAPI_ACCESS_TOKEN=...

# Domain: Firebase Hosting rewrite → Cloud Run (firebase.json), custom domains
# getlistingpro.com + www at GoDaddy DNS.
firebase deploy --only hosting:getlistingpro --project jaatpride-05874
```

(Previous PM2+Nginx VPS and Vercel deployments are retired.)

## Notes

- Razorpay amounts are in **paise** (₹10,000 = 1000000 paise)
- Payment verification is stateless — no database needed
- Thank-you plan/subscription context is passed via `sessionStorage`, not URL query params
- Images are placeholders — drop actual assets into `public/images/`
- Meta Pixel only loads when `NEXT_PUBLIC_META_PIXEL_ID` is set
