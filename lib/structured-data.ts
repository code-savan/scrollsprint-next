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
        text: "No. These are self-initiated spec ads for creative demonstration. The product names shown do not imply a paid client relationship or brand endorsement.",
      },
    },
    {
      "@type": "Question",
      name: "What counts as a hook cut?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A hook cut changes the opening of an approved original ad. It uses the same core story and footage; it is not another original concept. All packages include one bounded revision round and vertical 9:16 delivery.",
      },
    },
    {
      "@type": "Question",
      name: "What happens after payment?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We collect your product link, claims and assets, agree on the creative direction and confirm the delivery date. The one-time package payment covers creative production; ad spend and media buying are separate.",
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
          "One original concept for one product, one finished vertical ad up to 30 seconds, and one revision round.",
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
          "Two original concepts for one product and one extra hook cut, for three final vertical cuts up to 30 seconds each, with one revision round.",
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
          "Three original concepts for one product and four extra hook cuts, for seven final vertical cuts up to 30 seconds each, with one revision round.",
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
          "Five original concepts for one product and ten extra hook cuts, for fifteen final vertical cuts up to 30 seconds each, with one revision round.",
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
