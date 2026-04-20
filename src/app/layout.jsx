import { Inter, Poppins, Roboto_Mono } from "next/font/google";
import "./globals.css";

// Font configurations
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({ 
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const robotoMono = Roboto_Mono({ 
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

// Viewport configuration
export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#3b82f6",
};

// Basic metadata
export const metadata = {
  title: {
    default: "NYBFF - New York Bengali Film Festival",
    template: "%s | NYBFF",
  },
  description: "New York Bengali Film Festival celebrates the rich cultural heritage of Bengali cinema, showcasing independent films, documentaries, and short films.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} ${robotoMono.variable}`}>
      <body className="antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <main>{children}</main>
      </body>
    </html>
  );
}