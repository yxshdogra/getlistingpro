import type { Metadata } from "next";
import { DM_Sans, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ListingPro — Get More Orders with Better Content",
  description:
    "Increase product visibility and conversions with model shoots, viral reels, and SEO-optimized marketplace listings for Indian e-commerce sellers.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/icon.svg",
  },
};

// Cap CDN caching at 5 minutes: prerendered pages otherwise ship
// s-maxage=31536000, and the Firebase Hosting CDN would serve stale HTML
// (old bundles, old pixel id) for up to a year after a deploy.
export const revalidate = 300;

// Validate Pixel ID is numeric to prevent script injection via env tampering
const RAW_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const PIXEL_ID = RAW_PIXEL_ID && /^\d+$/.test(RAW_PIXEL_ID) ? RAW_PIXEL_ID : null;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${inter.variable} antialiased`}>
        {children}

        {PIXEL_ID && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}
      </body>
    </html>
  );
}
