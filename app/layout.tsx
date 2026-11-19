import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GoProteen: Protein, fermented.',
  description: '10 g fermented yeast protein snack bar. Wake up your muscle.',
  keywords: ['GoProteen', 'protein bar', 'fermented protein', 'vegan', 'sarcopenia', 'gut health', 'synbiotic'],
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased selection:bg-purple-900 selection:text-white">
        {children}
      </body>
    </html>
  );
}
