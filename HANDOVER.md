# ListingPro - Handover

> Handed over by Yash Dogra to Ayush Jain on 2026-09-23. Master index: house-of-tech-admin/ESTATE_HANDOVER.md

## For Ayush (plain language)

This is the landing page and checkout at **getlistingpro.com** - a paid content-creation
service for Indian e-commerce sellers. It is live today: the domain resolves and serves
the app. Under the hood it is a small Next.js website with a Razorpay subscription
checkout (Starter/Growth plans) and Meta Pixel ad-tracking, running on Google Cloud Run
inside the **same GCP project as JaatPride** (`jaatpride-05874`), not its own project.

Five things only you can do:
1. **GitHub repo access** - the code lives at `github.com/ayush2491/getlistingpro`, a
   private repo with Yash as sole collaborator. It is one of the 8 repos being
   transferred to `ayush2491` today; confirm it landed there.
2. **Razorpay Dashboard access** - this app's checkout keys, webhook secret, and plan
   IDs (Starter Rs499/mo, Growth Rs999/mo) live in the same shared House of Tech
   Razorpay account used by the other apps. Confirm you (or the next engineer) can log
   in and see/rotate them.
3. **Meta Business Manager / Events Manager access** - needed to see or rotate the
   Conversions API token for this app's Pixel. Which Meta ad account owns this pixel is
   not written down anywhere in the repo; only Yash knows today.
4. **GoDaddy DNS for getlistingpro.com** - per the estate context this is already your
   account; just confirm the two records (root + `www`) still point at Firebase
   Hosting.
5. **Decide whether to move secrets into Secret Manager.** Unlike some other House of
   Tech apps, this one's Razorpay/Meta secrets are plain Cloud Run environment
   variables, not Secret Manager entries - a plaintext-in-console exposure, not a repo
   exposure.

Nothing in this repo is broken or blocked; it is small and self-contained. The open
items below are ownership/access handover, not engineering fires.

## What it is

Next.js 16 (App Router, TypeScript) marketing/checkout site for ListingPro. Razorpay
Subscriptions API with server-side HMAC signature verification; Meta Pixel + server-side
Conversions API for ad attribution, deduplicated via `event_id` so a purchase is counted
once whether it comes from the browser pixel or the async webhook. No database - payment
verification is stateless. Full route and env-var reference: [CLAUDE.md](./CLAUDE.md).

## Where it runs

| Component | Where | Identifier/URL |
|---|---|---|
| Compute | Cloud Run | service `listingpro-web`, project `jaatpride-05874`, region `asia-south1` |
| Edge/CDN | Firebase Hosting | site `getlistingpro` (rewrites `**` to the Cloud Run service - `firebase.json`) |
| Image registry | Artifact Registry | path mismatch between docs - see Gotchas |
| Domain | GoDaddy DNS | `getlistingpro.com` and `www.getlistingpro.com`, pointed at Firebase Hosting |
| Source | GitHub | `github.com/ayush2491/getlistingpro` (private; being transferred to `ayush2491`) |
| Payments | Razorpay | Subscriptions API, account shared across House of Tech products |
| Ad tracking | Meta | Pixel + Conversions API (Graph API v21.0) |

## Current state

- Single branch, `master`, tracking `origin/master`; no other branches, no open PRs, no
  stashes.
- Last commit: `409cf8b` (2026-07-25) - "fix(meta): let the webhook own the server
  Purchase, not verify-payment". Repo has been dormant since (~2 months as of this
  handover); nobody has re-verified the live Cloud Run revision still matches this
  commit.
- Two harmless local-only uncommitted changes (graphify tooling files, not product
  code): a 3-line `.gitignore` addition and an untracked `.gitattributes`. Safe to
  commit or discard; not app functionality.
- Vercel and a PM2+Nginx VPS were the previous hosting; both retired in commit
  `042b861` ("feat(deploy): Cloud Run + Firebase Hosting (retire Vercel/VPS)"). Worth
  Ayush double-checking no orphaned Vercel project is still billing.
- Live domains verified reachable and serving this app during this handover
  (2026-09-23).

## Build and deploy

No CI - manual `gcloud`/`firebase` from an engineer's laptop, same pattern as the rest
of the estate. Full commands: [CLAUDE.md](./CLAUDE.md#deployment). Summary:

```bash
# 1. Build image (NEXT_PUBLIC_* values are baked in at build time via substitutions)
gcloud builds submit --project jaatpride-05874 --config cloudbuild.yaml \
  --substitutions _NEXT_PUBLIC_RAZORPAY_KEY_ID=...,_NEXT_PUBLIC_META_PIXEL_ID=...,_NEXT_PUBLIC_WHATSAPP_ONBOARDING_URL=...,_NEXT_PUBLIC_SITE_BASE_URL=https://www.getlistingpro.com

# 2. Deploy (server secrets as runtime env - never a build arg)
gcloud run deploy listingpro-web --project jaatpride-05874 --region asia-south1 \
  --image <artifact-registry-path>:latest --allow-unauthenticated --memory 512Mi \
  --set-env-vars RAZORPAY_KEY_ID=...,RAZORPAY_KEY_SECRET=...,RAZORPAY_PLAN_ID_STARTER=...,RAZORPAY_PLAN_ID_GROWTH=...,RAZORPAY_WEBHOOK_SECRET=...,NEXT_PUBLIC_SITE_BASE_URL=https://www.getlistingpro.com

# 3. Point the domain at it
firebase deploy --only hosting:getlistingpro --project jaatpride-05874
```

Traps:
- Step 1 and step 3 use `jaatpride-05874`, the same shared GCP project as JaatPride -
  no isolation between the two apps' billing/IAM/Cloud Build history.
- Step 2's `--set-env-vars` **replaces the whole env** on the service (the same
  full-replace footgun documented for the RadheRadhe/PocketPDF/CaseDesk project);
  prefer `gcloud run services update --update-env-vars` to add or rotate one var
  without wiping the rest, as `CLAUDE.md` itself recommends for one-off rotations.
- `.dockerignore`/`.gcloudignore` exclude `.env*` from the build context, so nothing
  secret is baked into the image or sent to Cloud Build - confirmed by reading both
  files and the `Dockerfile`.

## Secrets and config

No values below - names and locations only.

| Name | Where it lives | Notes |
|---|---|---|
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Cloud Run runtime env only | Not in Secret Manager. Shared Razorpay account across House of Tech products |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Baked into the JS bundle at Cloud Build time (substitution) | Publishable, must match the server key |
| `RAZORPAY_PLAN_ID_STARTER` / `RAZORPAY_PLAN_ID_GROWTH` | Cloud Run runtime env only | Defined in the shared Razorpay Dashboard |
| `RAZORPAY_PLAN_ID_TEST` | Cloud Run runtime env only, optional | Rs1 plan; gates the unlinked `/test-plan` verification route - unset disables that route |
| `RAZORPAY_WEBHOOK_SECRET` | Cloud Run runtime env only | Secret of the `subscription.charged` webhook endpoint in the Razorpay Dashboard; distinct from the key secret |
| `NEXT_PUBLIC_META_PIXEL_ID` | Baked in at build time (substitution) | Which Meta Business account owns this pixel is not recorded anywhere in-repo |
| `META_CAPI_ACCESS_TOKEN` | Cloud Run runtime env only, optional | Meta Events Manager -> Conversions API; unset just logs a warning and skips the server event |
| `META_CAPI_TEST_EVENT_CODE` | Cloud Run runtime env only, optional | Routes CAPI events to Events Manager Test Events, verification only |
| `NEXT_PUBLIC_WHATSAPP_ONBOARDING_URL` / `NEXT_PUBLIC_SITE_BASE_URL` | Build-time substitutions in `cloudbuild.yaml` | Not secret; `SITE_BASE_URL` defaults to `https://www.getlistingpro.com` in the file |
| gcloud/firebase deploy credentials | Whoever runs the deploy commands | No CI; deployer needs write access to `jaatpride-05874` |

No `.env` files, keystores, or service-account JSON exist anywhere in this repo (this is
a web-only app - no local secret archive item applies here).

## Open items

1. **Confirm GitHub transfer landed** (owner: Ayush) - verify `ayush2491` has access to
   `github.com/ayush2491/getlistingpro` after today's transfer; this repo had exactly
   one collaborator (Yash) beforehand.
2. **Get Razorpay Dashboard access** (owner: Ayush) - needed to see/rotate
   `RAZORPAY_KEY_ID/SECRET`, `RAZORPAY_WEBHOOK_SECRET`, and the Starter/Growth/Test plan
   IDs; account is shared with other House of Tech apps, so coordinate any rotation with
   whoever else depends on it.
3. **Get Meta Business Manager access** (owner: Ayush) - identify which ad account owns
   `NEXT_PUBLIC_META_PIXEL_ID` and get Events Manager access to rotate
   `META_CAPI_ACCESS_TOKEN`; not documented in-repo, ask Yash before access lapses.
4. **Verify the Artifact Registry path live** (owner: next engineer) - `CLAUDE.md` and
   `cloudbuild.yaml` disagree (see Gotchas); check which path Cloud Run is actually
   pulling from before the next deploy.
5. **Recreate `.env.example`** (owner: next engineer) - `CLAUDE.md`'s local-dev step
   (`cp .env.example .env.local`) has no file to copy; rebuild it from the env var table
   in [CLAUDE.md](./CLAUDE.md#environment-variables) (names only).
6. **Consider moving secrets to Secret Manager** (owner: Ayush, IAM-gated) - this app's
   Razorpay/Meta secrets are plaintext Cloud Run env vars today, same pattern flagged
   estate-wide; migrating requires Owner-level IAM on `jaatpride-05874`.
7. **Confirm no orphaned Vercel project or VPS is still running/billing** (owner:
   Ayush) - both were retired for this app in commit `042b861`.

## Gotchas

- **Shared GCP project, not a dedicated one.** `jaatpride-05874` also hosts JaatPride.
  IAM changes, Cloud Build history, and billing are shared - do not treat this app in
  isolation when touching that project.
- **Artifact Registry path disagreement (unverified which is current):**
  `cloudbuild.yaml`'s `_IMAGE` substitution builds to
  `asia-south1-docker.pkg.dev/jaatpride-05874/cloud-run-source-deploy/listingpro-web`,
  while `CLAUDE.md`'s documented `gcloud run deploy` example uses
  `asia-south1-docker.pkg.dev/jaatpride-05874/listingpro/listingpro-web`. One of the two
  is stale; confirm against the live Cloud Run service before the next deploy.
- **`--set-env-vars` replaces the whole environment** on the Cloud Run service (see
  Build and deploy); use `--update-env-vars` for one-off rotations.
- **This is not the same repo as `Political-Academy-Private-Limited/listingpro`** on
  GitHub - that is a different codebase under the PAPL org and is out of scope for this
  handover; it stays where it is.
- **No mobile app here** - purely a Next.js web app, so none of the Android/Play Console
  handover items elsewhere in the estate apply to this repo.

## History

- [CLAUDE.md](./CLAUDE.md) - full tech stack, routes, environment variable reference,
  and the canonical deploy commands.
