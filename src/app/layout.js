import { MatchmakingProvider } from "@/contexts/MatchmakingContext";
import { UserProvider } from "@/contexts/UserContext";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: 'Locally',
  description: 'Real People. Real Experiences. Real Connections.',
  icons: {
    icon: '/images/favicon_io/favicon.ico',
    shortcut: '/images/favicon_io/favicon-16x16.png',
    apple: '/images/favicon_io/apple-touch-icon.png'
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MatchmakingProvider>
          <UserProvider>{children}</UserProvider>
        </MatchmakingProvider>
        <Script
          src="https://kit.fontawesome.com/c2a7616b54.js"
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}
