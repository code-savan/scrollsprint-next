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
    "Short-form ad creative for ecommerce brands already testing or running paid traffic, with stronger hooks, clearer product demos and fresh directions to test.",
} as const;

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "ScrollSprint Creative",
  publisher: { "@id": `${SITE_URL}/#organization` },
} as const;

// Answers reflect the visible FAQ in components/scrollsprint-site.tsx.
export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${SITE_URL}/#faq`,
  mainEntity: [
    {
      "@type": "Question",
      name: "Do you run the ads or guarantee results?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our packages cover creative production. Your team handles media buying. Results depend on your offer, audience, landing page and campaign execution. We do not guarantee ROAS, CPA or revenue.",
      },
    },
    {
      "@type": "Question",
      name: "Do we need to ship a product?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Not always. We often work with approved product imagery, existing footage and generated production. We will flag any concept requiring a physical shoot before you commit.",
      },
    },
    {
      "@type": "Question",
      name: "Are the portfolio videos commissioned client work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. We identify our self-initiated spec ads and the reference videos provided to us. Product names do not imply a paid client relationship or brand endorsement.",
      },
    },
    {
      "@type": "Question",
      name: "What counts as a finished ad?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Each ad has its own opening and payoff. Ads within a batch may share approved footage, production elements and a creative direction. Longer explainers run 60–90 seconds. One bounded revision round applies to the batch.",
      },
    },
    {
      "@type": "Question",
      name: "What happens after payment?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We review your product page, claims, assets, current ads and goals, then confirm the creative direction and delivery date before production begins. The one-time payment covers creative production; ad spend and media buying are separate. There is no ongoing commitment.",
      },
    },
  ],
} as const;

// Price and deliverables mirror the four visible project packages.
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
        name: "Trial Ad",
        description:
          "Three finished vertical ads for one product, each up to 30 seconds, with one batch revision round.",
        provider: { "@id": `${SITE_URL}/#organization` },
        offers: { "@type": "Offer", price: "99", priceCurrency: "USD" },
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "Service",
        name: "Test Sprint",
        description:
          "Five finished vertical ads up to 30 seconds each and one 60–90 second product explainer for one product, across two creative directions, with one batch revision round.",
        provider: { "@id": `${SITE_URL}/#organization` },
        offers: { "@type": "Offer", price: "299", priceCurrency: "USD" },
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "Service",
        name: "Growth Sprint",
        description:
          "Eight finished vertical ads up to 30 seconds each and two 60–90 second product explainers for one product, across four creative directions, with one batch revision round.",
        provider: { "@id": `${SITE_URL}/#organization` },
        offers: { "@type": "Offer", price: "699", priceCurrency: "USD" },
      },
    },
    {
      "@type": "ListItem",
      position: 4,
      item: {
        "@type": "Service",
        name: "Scale Batch",
        description:
          "Twelve finished vertical ads up to 30 seconds each and four 60–90 second product explainers for one product, across six creative directions, a testing sequence and one batch revision round.",
        provider: { "@id": `${SITE_URL}/#organization` },
        offers: { "@type": "Offer", price: "1499", priceCurrency: "USD" },
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
