// Machine-readable structured data for AI answer engines and search crawlers.
// GROUNDING RULE: every string below is transcribed verbatim from on-site
// content. Sources: app/layout.tsx (site meta) and
// components/scrollsprint-site.tsx (portfolio, pricing, faq, process arrays).
// If on-screen copy changes, update this file to match. Do not invent facts
// (no addresses, people, ratings, or performance claims exist on the site).

export const SITE_URL = "https://scrollsprint.online";

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#organization`,
  name: "ScrollSprint Creative",
  url: SITE_URL,
  slogan: "More ads to test. Less production drag.",
  description:
    "Product-first paid-social video creatives for ecommerce teams that need more hooks, more angles and less production drag.",
} as const;

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "ScrollSprint Creative",
  publisher: { "@id": `${SITE_URL}/#organization` },
} as const;

// Verbatim from the `faq` array in components/scrollsprint-site.tsx.
export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${SITE_URL}/#faq`,
  mainEntity: [
    {
      "@type": "Question",
      name: "Do you guarantee performance?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Performance depends on the offer, product, audience, media buying, landing page and other factors. We produce testing-ready creative and variations; we do not promise specific ROAS, CPA or revenue outcomes.",
      },
    },
    {
      "@type": "Question",
      name: "Do we need to ship a product?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Not always. Some campaigns can be built from approved product imagery, existing footage, screenshots and generated production. Physical product requirements depend on the concept.",
      },
    },
    {
      "@type": "Question",
      name: "Are the portfolio examples client work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Commissioned work will be identified as client work. Self-initiated demonstrations are clearly labeled Concept Campaign or Spec Creative.",
      },
    },
    {
      "@type": "Question",
      name: "Do you run the ads?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The core offer is creative production. Media buying is separate unless explicitly included in a custom engagement.",
      },
    },
    {
      "@type": "Question",
      name: "What platforms do you produce for?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The primary format is vertical paid-social creative for Meta, TikTok and YouTube Shorts. Other formats can be included by scope.",
      },
    },
  ],
} as const;

// Verbatim from the `pricing` array in components/scrollsprint-site.tsx.
// Prices in USD; feature lists condensed to the on-screen `description` so
// no per-item claim drifts from the visible copy.
export const servicesSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": `${SITE_URL}/#services`,
  name: "ScrollSprint Creative packages",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "Service",
        name: "Starter Test",
        description:
          "A low-risk first test for one product and one core angle. Includes 2 finished ads, 3 hook variations, 1 core angle, 9:16 delivery, captions + sound, 1 revision round.",
        provider: { "@id": `${SITE_URL}/#organization` },
        offers: { "@type": "Offer", price: "397", priceCurrency: "USD" },
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "Service",
        name: "Creative Sprint",
        description:
          "The core offer: enough finished creative to actually learn something. Includes 5 finished ads, 10 hook variations, 2 creative angles, VO + captions + sound, Testing-ready variations, 1 revision round, 72-hour target turnaround.",
        provider: { "@id": `${SITE_URL}/#organization` },
        offers: { "@type": "Offer", price: "897", priceCurrency: "USD" },
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "Service",
        name: "Scale Pack",
        description:
          "For brands already spending consistently and hungry for more test inventory. Includes 10 finished creatives, 20 hooks / openings, 3 creative angles, UGC + product-led concepts, multiple CTAs, testing recommendations, priority production.",
        provider: { "@id": `${SITE_URL}/#organization` },
        offers: { "@type": "Offer", price: "1497", priceCurrency: "USD" },
      },
    },
  ],
} as const;

export const jsonLdSchemas = [
  organizationSchema,
  websiteSchema,
  faqSchema,
  servicesSchema,
];
