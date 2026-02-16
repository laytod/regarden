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
      <head />
      <body className="font-sans">
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
