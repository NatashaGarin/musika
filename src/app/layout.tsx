import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import FontAwesomeLoader from '@/components/FontAwesomeLoader'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Musika - Musical Instrument Assistant',
  description: 'AI-powered musical instrument assistant with RAG capabilities powered by Flowise. Get expert advice on instruments, techniques, and music theory.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FontAwesomeLoader />
        {children}
      </body>
    </html>
  )
}

