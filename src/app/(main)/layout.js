import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Header from "@/components/shared/Header/Header";
import Footer from "@/components/shared/Footer/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata = {
  // Basic Metadata
  title: {
    default: "NYBFF - New York Bengali Film Festival",
    template: "%s | NYBFF",
  },
  description: "New York Bengali Film Festival celebrates the rich cultural heritage of Bengali cinema, showcasing independent films, documentaries, and short films from emerging and established filmmakers.",

  // Keywords for SEO
  keywords: [
    "film festival",
    "bengali film",
    "new york film festival",
    "independent film",
    "documentary",
    "short film",
    "cinema",
    "bengali cinema",
    "film submission",
    "film competition",
    "NYBFF",
    "New York Bengali Film Festival"
  ],

  // Authors and Creator
  authors: [
    { name: "NYBFF Team", url: "https://nybff.us" },
    { name: "New York Bengali Film Festival" }
  ],
  creator: "New York Bengali Film Festival",
  publisher: "New York Bengali Film Festival",

  // URL and Canonical
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://nybff.us"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
      "bn": "/bn",
    },
  },

  // Open Graph (Facebook, LinkedIn, etc.)
  openGraph: {
    title: "NYBFF - New York Bengali Film Festival",
    description: "Celebrating the rich cultural heritage of Bengali cinema. Submit your films, attend screenings, and be part of an incredible cinematic journey.",
    url: "https://nybff.us",
    siteName: "New York Bengali Film Festival",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NYBFF - New York Bengali Film Festival",
        type: "image/jpeg",
      },
    ],
    locale: "en_US",
    type: "website",
    emails: ["info@nybff.us"],
    phoneNumbers: ["+1 (212) 555-0123"],
    countryName: "United States",
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "NYBFF - New York Bengali Film Festival",
    description: "Celebrating Bengali cinema in New York. Submit your films and join the celebration!",
    images: ["/twitter-image.jpg"],
    creator: "@nybff",
    site: "@nybff",
  },

  // Icons
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/apple-icon-152x152.png", sizes: "152x152", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#3b82f6",
      },
    ],
  },

  // Manifest
  manifest: "/site.webmanifest",

  // Robots
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Verification
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
    other: {
      "facebook-domain-verification": process.env.FACEBOOK_DOMAIN_VERIFICATION,
    },
  },

  // Apple specific
  appleWebApp: {
    capable: true,
    title: "NYBFF",
    statusBarStyle: "black-translucent",
  },

  // Microsoft specific
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },

  // Other metadata
  category: "Entertainment",
  classification: "Film Festival",



  // Bookmark
  bookmarks: ["https://nybff.us"],

  // Mobile app deep links
  appLinks: {
    ios: {
      url: "https://nybff.us",
      app_store_id: "123456789",
    },
    android: {
      package: "us.nybff.app",
      url: "https://nybff.us",
    },
  },

  // Archive
  archives: ["https://nybff.us/archive"],

  // Asset links
  assets: ["https://nybff.us/assets"],

};


export default function RootLayout({ children }) {
  return <main className="flex-grow">
    <Header />
    {children}
    <Footer />
  </main>;
}
