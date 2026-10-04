import type { Metadata, Viewport } from "next";
import { Michroma, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { SITE_URL, CONTACT } from "@/lib/data";

const display = Michroma({ weight: "400", subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = Instrument_Sans({ subsets: ["latin"], variable: "--font-body", display: "swap" });

const title = "Nocta Studios | Premium Web Design & Development";
const description = "Nocta Studios designs and builds premium websites for brands that want to stand out. Fixed prices from €100. Order your website online.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title, description,
  alternates: { canonical: "/" },
  openGraph: { title, description, url: "/", siteName: "Nocta Studios", type: "website", locale: "en_US" },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = { themeColor: "#000000", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const ld = {
    "@context": "https://schema.org", "@type": "ProfessionalService", name: "Nocta Studios", url: SITE_URL,
    description, email: CONTACT.email, sameAs: [CONTACT.instagram],
    serviceType: ["Web Design", "Web Development", "Landing Pages", "E-commerce", "Website Redesign", "UI/UX Design"],
  };
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-sans">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
        {children}
      </body>
    </html>
  );
}
