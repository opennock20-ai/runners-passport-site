# Runner's Passport — Preview Website

A custom-coded first version of **myrunnerspassport.com**. Designed for Cloudflare Pages, without hosting subscriptions or build dependencies.

## What's working

- Responsive premium branded homepage with product photography and brand artwork
- Searchable-by-category race catalogue (All / Half marathons / Marathons)
- Interactive personalisation studio: choose event, date, finish time, caption, name, and upload a local photo
- Live front and back mockup preview
- Downloadable PNG concept preview of either card side (NOT print-ready)
- Preview shopping basket with local persistence, quantities, add/remove functionality
- Preview UK card delivery: single card 99p; 2+ cards free; album delivery TBC
- Album showcase, product storytelling, FAQ, mobile navigation

## Not yet connected (intentionally)

- Real checkout, merchant/payment provider
- Orders database / admin dashboard / receipts
- Image storage, uploads to the business, photo retention and data deletion workflows
- Final artwork and verified GPX race routes / production PDF generation
- UK and international fulfilment calculations, taxes, return policies, licensing
- Contact email and waitlist

**Pre-launch SEO:** The site currently uses `noindex` and robots disallow to prevent indexing before it can accept real orders. Remove both when it officially launches.

**Important:** Current images are prototypes and a few still use older *Running Passport* typography. Replace with *Runner's Passport* final approved product photos before going live commercially. Illustrated mockups may not reflect real manufactured product or accurate race route maps. Photos uploaded into the personaliser remain on the visitor's device; no upload endpoint exists. The local basket persists product metadata, not user photos.

## Deploy to Cloudflare Pages — recommended: GitHub integration

Cloudflare's **Git integration** automatically publishes each new commit. This is the recommended choice for ongoing development. You cannot convert an existing Direct Upload Pages project to Git integration later; you would need a new Pages project.

1. Create a GitHub repository named `runners-passport-site` (a **private** repository is fine).
2. Upload/push all source files in this folder to the repository root, except `dist/` and `node_modules/`.
3. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git** → choose your GitHub repository.
4. Framework preset: **None**. Build command: **`npm run build`**. Output directory: **`dist`**. No environment variables or API secrets are needed.
5. Deploy. Cloudflare gives you a preview URL ending in `.pages.dev`.
6. In the new Pages project → **Custom domains** → **Set up a custom domain** → enter `myrunnerspassport.com`. Because the domain is already on Cloudflare DNS, Cloudflare can set up the relevant DNS record for you. Remove any obsolete/conflicting root A records if requested.

## Alternative: upload directly to Cloudflare Pages

If you prefer to skip GitHub for now, you can create a **Direct Upload** project in Workers & Pages and drag-and-drop the `runners-passport-deploy.zip` archive. This archive contains the built root contents, not an extra top-level directory. Be aware you cannot later change that exact Pages project to Git integration.

Official guidance: https://developers.cloudflare.com/pages/get-started/direct-upload/ and https://developers.cloudflare.com/pages/configuration/git-integration/

## Quick local test

```sh
cd runners-passport-site
python3 -m http.server 8000
```

Visit http://localhost:8000. No dependencies or API keys required.

## Next steps

1. Approve design and branding, obtain final photography, legal/rights checks.
2. Build Cloudflare Worker endpoints and R2 signed photo uploads, with D1 data storage; add user consent, deletion, image retention and access controls.
3. Add hosted payment gateway; validate order amounts server-side, use secure webhook to move paid orders to fulfilment status. Never treat a browser cart as proof of purchase.
4. Add VAT/delivery rules, GDPR/UK GDPR notices, cancellation and bespoke-product returns rules, licensing, security/backup testing.
5. Add print-production master templates and fulfilment dashboard.
