import type {Metadata} from 'next';
import {Plus_Jakarta_Sans, Space_Grotesk, JetBrains_Mono} from 'next/font/google';
import './globals.css';
import {LanguageProvider} from '@/lib/i18n';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'TruckBuddy — Smart Freight, RAG Routing & AI Backhaul',
  description:
    'Minimalist logistics platform for Transporters, Shippers, and Drivers with live truck tracking, RAG highway intelligence, AI driver selection, Razorpay payments, and instant bills.',
  openGraph: {
    title: 'TruckBuddy — Smart Freight, RAG Routing & AI Backhaul',
    description:
      'Minimalist logistics platform for Transporters, Shippers, and Drivers with live truck tracking, RAG highway intelligence, AI driver selection, Razorpay payments, and instant bills.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TruckBuddy — Smart Freight, RAG Routing & AI Backhaul',
    description:
      'Minimalist logistics platform for Transporters, Shippers, and Drivers with live truck tracking, RAG highway intelligence, AI driver selection, Razorpay payments, and instant bills.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body
        suppressHydrationWarning
        className="bg-[#F5F6F8] text-[#1E293B] antialiased selection:bg-[#E2E8F0] selection:text-[#0F172A]"
        style={{fontFamily: 'var(--font-sans), sans-serif'}}
      >
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
