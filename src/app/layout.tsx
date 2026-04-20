import type { Metadata, Viewport } from "next";
import { Inter, Poppins, Roboto_Mono } from "next/font/google";
import "./globals.css";

// Font configurations
const inter = Inter({ 
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({ 
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

const robotoMono = Roboto_Mono({ 
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  display: "swap",
});

// Viewport configuration
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

// Metadata configuration
export const metadata: Metadata = {
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en" 
      className={`${inter.variable} ${poppins.variable} ${robotoMono.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        
        {/* Additional Meta Tags */}
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
        
        {/* PWA / Mobile App */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="NYBFF" />
        
        {/* Social Media Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:determiner" content="the" />
        <meta property="og:site_name" content="New York Bengali Film Festival" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:locale:alternate" content="bn_BD" />
        
        {/* Facebook App ID */}
        <meta property="fb:app_id" content={process.env.NEXT_PUBLIC_FB_APP_ID} />
        
        {/* Twitter App */}
        <meta name="twitter:app:name:iphone" content="NYBFF" />
        <meta name="twitter:app:id:iphone" content={process.env.NEXT_PUBLIC_TWITTER_APP_ID} />
        <meta name="twitter:app:name:googleplay" content="NYBFF" />
        <meta name="twitter:app:id:googleplay" content={process.env.NEXT_PUBLIC_GOOGLE_PLAY_ID} />
        
        {/* LinkedIn */}
        <meta property="linkedin:owner" content="nybff" />
        
        {/* Pinterest */}
        <meta name="pinterest-rich-pin" content="true" />
        
        {/* Schema.org markup for Google+ */}
        <meta itemProp="name" content="NYBFF - New York Bengali Film Festival" />
        <meta itemProp="description" content="Celebrating Bengali cinema in New York. Submit your films and join the celebration!" />
        <meta itemProp="image" content="/og-image.jpg" />
        
        {/* Geo Tags */}
        <meta name="geo.region" content="US-NY" />
        <meta name="geo.placename" content="New York" />
        <meta name="geo.position" content="40.7128;-74.0060" />
        <meta name="ICBM" content="40.7128, -74.0060" />
        
        {/* Copyright */}
        <meta name="copyright" content={`${new Date().getFullYear()} New York Bengali Film Festival. All rights reserved.`} />
        
        {/* Author */}
        <meta name="author" content="NYBFF Team" />
        <meta name="designer" content="NYBFF Creative Team" />
        
        {/* Rating */}
        <meta name="rating" content="General" />
        
        {/* Distribution */}
        <meta name="distribution" content="Global" />
        
        {/* Language */}
        <meta name="language" content="English" />
        <meta name="content-language" content="en" />
        
        {/* Revisit after */}
        <meta name="revisit-after" content="7 days" />
        
        {/* Google Site Verification */}
        {process.env.GOOGLE_SITE_VERIFICATION && (
          <meta name="google-site-verification" content={process.env.GOOGLE_SITE_VERIFICATION} />
        )}
      </head>
      <body 
        className={`${inter.className} h-full antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
        suppressHydrationWarning
      >
        {/* Skip to main content link for accessibility */}
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-blue-600 text-white rounded-md">
          Skip to main content
        </a>
        
        {/* Main content */}
        <main id="main-content" className="min-h-screen">
          {children}
        </main>
        
        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Festival",
              "name": "New York Bengali Film Festival",
              "alternateName": "NYBFF",
              "description": "The New York Bengali Film Festival celebrates the rich cultural heritage of Bengali cinema, showcasing independent films, documentaries, and short films from emerging and established filmmakers.",
              "url": "https://nybff.us",
              "logo": "https://nybff.us/logo.png",
              "image": "https://nybff.us/og-image.jpg",
              "sameAs": [
                "https://www.facebook.com/nybff",
                "https://www.twitter.com/nybff",
                "https://www.instagram.com/nybff",
                "https://www.linkedin.com/company/nybff",
                "https://www.youtube.com/@nybff"
              ],
              "location": {
                "@type": "Place",
                "name": "New York City",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "New York",
                  "addressRegion": "NY",
                  "addressCountry": "US"
                }
              },
              "startDate": "2024-06-01",
              "endDate": "2024-06-07",
              "organizer": {
                "@type": "Organization",
                "name": "New York Bengali Film Festival",
                "email": "info@nybff.us",
                "telephone": "+1 (212) 555-0123"
              },
              "offers": {
                "@type": "Offer",
                "name": "Film Submission",
                "price": "25",
                "priceCurrency": "USD",
                "availability": "https://schema.org/OnlineOnly"
              }
            }),
          }}
        />
      </body>
    </html>
  );
}