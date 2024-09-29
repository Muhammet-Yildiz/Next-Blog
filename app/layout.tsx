import Script from "next/script";
import "./globals.css";
import { Providers } from "./providers";
import { inter } from "@/lib/fonts";
import "react-lazy-load-image-component/src/effects/blur.css";

export const metadata = {
  title: {
    default: 'Next Blog',
    template: '%s | Next Blog',
  },
  description: 'Next Blog : Read and write stories.',
  icons: {
    icon: '/icon.png',
  },
  openGraph: {
    title: 'Next Blog',
    description: 'Next Blog : Read and write stories.',
    url: process.env.NEXT_PUBLIC_BASE_URL,
    siteName: 'Next Blog',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/main.png`,
        width: 1200,
        height: 630,
        alt: 'Site Image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    title: 'Next Blog',
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100/50 dark:bg-black text-black dark:text-white overflow-x-hidden  min-h-screen   w-full mx-auto  md:px-6 2xl:px-0  lg:w-11/12 2xl:w-9/12  px-6 relative `} >
        <section >
          <Providers>
            {children}
          </Providers>
        </section>

        {/* Google one tap login */}
        <Script src="https://accounts.google.com/gsi/client" strategy="beforeInteractive" />
      </body>

    </html>
  );
}