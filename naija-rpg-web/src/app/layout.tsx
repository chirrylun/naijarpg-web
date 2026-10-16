import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Suspense } from 'react';
import { Providers } from './providers';
import { Navbar } from '@/components/layout/NavBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { Toaster } from '@/components/ui/Toaster';
import { ChatDock } from '@/features/chat/ChatDock';

const body = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-body' });
const heading = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-heading' });

const title = 'Naija RPG: live the gist, roll the dice';
const description =
  'Real Naija wahala, one d20, and your guy across the table. Play 2-minute encounters free in your browser.';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title,
  description,
  openGraph: { title, description, images: ['/api/og'], locale: 'en_NG', type: 'website' },
  twitter: { card: 'summary_large_image', title, description, images: ['/api/og'] },
};

export const viewport: Viewport = {
  themeColor: '#08100d',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${body.variable} ${heading.variable} min-h-dvh font-sans antialiased`}>
       <Providers>
  <Suspense fallback={null}>
    <Navbar />
  </Suspense>
  <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-5 sm:pb-12">{children}</main>
  <Suspense fallback={null}>
    <BottomNav />
  </Suspense>
  <ChatDock />
  <Toaster />
</Providers>
      </body>
    </html>
  );
}