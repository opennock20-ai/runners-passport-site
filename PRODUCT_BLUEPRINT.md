# Runner’s Passport — Product blueprint (October 2026)

## The promise
**Every finish line has a story. Keep yours.**

An album-led premium collectible brand. The completed passport is the hero product; individual 63.5 × 88.9 mm personalised physical cards are the chapters. The website is a memory-keeping experience first, a collectible discovery platform second and a verification product third.

## Locked decisions
- Visual direction: minimal elegant editorial luxury. Ivory, deep sage, warm copper-red sun, classic serif. Neutral, spacious, no childish “game” UI. Responsive mobile first.
- Hero: one exceptional photograph of the physical passport **open**, two pockets per page, with restrained heading and clear actions. Current site uses illustrative concept artwork; replace with a proper high-resolution photo when the real prototype exists.
- Product: customers may buy cards without an album. Album strongly encouraged, not mandatory.
- Public gallery: display a few **deliberately published** race artworks. Never expose unrevealed edition artwork in public source, HTML, JavaScript, thumbnails, CSS backgrounds or accessible URLs.
- Exclusivity: same original front illustration for each race/year. No randomly assigned paid rewards. Classic / Signature / Exceptional signal the nature of the achievement, not a chance of winning a valuable card.
- Physical card purchase includes permanent access to that edition in the digital passport, subject to refund/chargeback policy.
- Photos, finish times, dates and captions personalised **before** purchase, reviewed in order summary; payment confirmed server side; then gated digital reveal; card physically produced and shipped.
- Interactive packaging: sealed deep-sage paper pack using the existing route-and-red-sun logo. Drag-to-tear interaction, with keyboard and reduced-motion alternatives. Flip to see own photo on reverse. Replays available.
- Profiles private by default. Public following and feed will use independently shared Runner’s Passport content, not third-party source data. For artwork, viewer must own/unlock **same race+year edition** before they can see it.
- Achievement cards encourage every ability: first run, first race, logged-run milestones, distance, improvement, race counts, race types, streaks, geography, trail/elevation and extreme challenges.

## Implementation phases
**Phase 1: design system and interactive prototype (present).** Public luxury homepage and guided open-album tour; published sample gallery and sealed teasers; touch/mouse/keyboard tear-pack demonstration; sample digital passport; searchable/browsable achievement catalogue; no accounts, payment, OAuth or promises of verified results.

**Phase 2: real commerce.** Secure accounts and profiles, private photo uploads, race data catalogue, gated art in **private Cloudflare R2**, orders, Stripe Checkout with verified idempotent webhooks, shipping/tax calculations server-side, return/refund policy, order management and print-export workflow. Only post-confirmation server authorisation may deliver the paid artwork to a user. Do not use random mystery rewards.

**Phase 3: permitted verification.** Apply for Strava developer integration review **before** implementing production connection. Separate short-lived authorised activity processing from independently provided proof and permanent purchase records. Implement event date/route/distance/title matching only to the extent permitted by Strava. Review ambiguous matches manually, support official result links, race confirmations and manual evidence. No AI analysis of Strava API data. Respect API 2026 restriction on disclosure to non-authenticated athletes and seven-day cache period; reconfirm exact permissible recognition and retention with Strava. Do not claim Strava-integrated progress is permanent unless its usage is approved. Other providers require separate API/permission review.

**Phase 4: full milestone engine, journal and community.** Derive rewards from independent user-provided data or otherwise permitted integrations. Distinguish **earned eligible**, **purchased/collected**, **refunded**, **verified** and **under review**. Social feed features consent, block/report, moderation, privacy, avatar/photo permissions and non-spoiler thumbnails.

**Phase 5:** larger UK race library (500 target), multiple years, gift cards, clubs and referral programme, future international growth.

## Architecture
- Website: current static Cloudflare Pages prototype. Upgrade to modular component frontend where necessary.
- Backend: Cloudflare Workers. Database: D1 or managed Postgres with migrations and security policies.
- Auth: managed identity/session solution, secure cookie sessions, MFA optional.
- Assets: public only for marketing samples; unrevealed artwork, personal photos and proof in private R2 with short-lived signed requests.
- Orders: Stripe hosted checkout; server determines prices, delivery and tax. Webhook validates signature and processes idempotently. Never trust a client-submitted paid flag.
- Achievements: versioned definitions with type, threshold, source provenance, historical rules, edition year and eligibility criteria. Don't infer a race from distance alone.
- Production: exact 63.5×88.9mm print files, verified personalised back artwork, trim/bleed, mirrored alignment and fulfilment status; physical emboss is a manufacturing step, not a raster effect.
- Privacy and IP: UK GDPR, consent/deletion/export flows, marketing consent, content moderation, race logos/official routes and photography rights.

## Key edge cases
- Race changes route each year; match against year-specific dated route records and tolerate GPS drift.
- Multiple runs on the same day, training runs on course, race title impersonation, treadmill activities and GPS anomalies.
- Past races before account creation, stale or removed Strava data, expired tokens, athlete revokes access.
- A person can complete a race more than once; edition based on event year; distinct purchases can be associated with separate finishing memories.
- Rewards based on cumulative runs over arbitrary windows require clearly defined source of truth and Strava-permitted retention.
- Refund before opening; post-reveal returns subject to consumer law and product personalisation rules; never hide real refund rights.
- Public feed cannot spoiler a specific year edition; even photo attachments should be handled without accidentally showing concealed original artwork.
- Mobile touch drag gestures must not block page scrolling until interaction is deliberate.

## Achievement catalogue
Current prototype contains ~90 example milestone definitions. All progress shown is fictional, labelled **sample only**, and is not derived from a user’s Strava account. Real progress and tiering need a calibrated, documented rules engine. Speed goals should display “N minutes faster” not claims predicting when they’ll achieve it.

## Launch go/no-go
1. A real printed physical card and manufactured album look and feel premium.
2. Payment, privacy, authentication, eligibility and order pipelines tested.
3. Strava approval/policy confirmation before launching that connection.
4. All locked artwork server-protected and access tested.
5. Actual product images and finished brand assets reviewed at mobile and desktop resolutions.
6. Customer messaging clearly distinguishes real availability from design previews.
