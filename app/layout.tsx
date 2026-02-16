import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Layout/Navigation'
import Footer from '@/components/Layout/Footer'

export const metadata: Metadata = {
  title: 'ReGarden - Community Gardens Nonprofit',
  description: 'Connecting communities through sustainable gardening and green spaces',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- Root layout applies to all pages; font loads at runtime to avoid build-time network. */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
        />
      </head>
      <body className="font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
