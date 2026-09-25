import type { Metadata } from "next";
import "./globals.css";
import { jsonLdSchemas } from "@/lib/structured-data";

export const metadata: Metadata = {
  metadataBase: new URL("https://scrollsprint.online"),
  title: "ScrollSprint Creative — More ads to test.",
  description:
    "Short-form ad creative for ecommerce brands running paid traffic. Stronger hooks, clearer product demos and fresh directions for Meta, TikTok and YouTube Shorts.",
  openGraph: {
    title: "ScrollSprint Creative — More ads to test.",
    description:
      "Short-form ad creative for ecommerce brands running paid traffic. Stronger hooks, clearer product demos and fresh directions for Meta, TikTok and YouTube Shorts.",
    url: "https://scrollsprint.online",
    siteName: "ScrollSprint Creative",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "ScrollSprint Creative — More ads to test.",
    description: "Direct-response creative for ecommerce brands built to test faster."
  },
  icons: { icon: "/favicon.svg" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>
        {jsonLdSchemas.map((schema) => (
          <script
            key={String(schema["@id"])}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
        {children}
      </body>
    </html>
  );
}
