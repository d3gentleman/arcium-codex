import type { Metadata } from 'next'
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import DiscoveryShell from '@/components/DiscoveryShell'
import { getDiscoveryIndex, getUIConfig } from '@/lib/content'
import './globals.css'

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk'
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-jetbrains-mono'
})

export const metadata: Metadata = {
  title: 'ARCIUM ATLAS | ECOSYSTEM_CORE',
  description: 'Educational hub about the Arcium ecosystem.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const discoveryItems = getDiscoveryIndex()
  const ui = getUIConfig()

  return (
    <html lang="en" className="dark">
      <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} selection:bg-primary-container selection:text-on-primary min-h-screen p-4 md:p-8 antialiased`}>
        <DiscoveryShell items={discoveryItems} ui={ui}>
          <div className="fixed inset-0 scanline-effect z-[100]"></div>
          <div className="max-w-[1400px] mx-auto grid grid-cols-12 gap-4 relative z-10">
            {children}
          </div>
        </DiscoveryShell>
      </body>
    </html>
  )
}
