import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geist = Geist({ subsets: ['latin'] })
const geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'مهامي - إدارة المهام',
  description:
    'تطبيق إدارة المهام والإنجازات - من تطوير فريق ZIADPWA - المطور زياد يحيى زكريا',
  generator: 'ZIADPWA',
  manifest: '/mahamey/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'مهامي',
  },
  icons: {
    icon: '/mahamey/icons/icon-512x512.jpg',
    apple: '/mahamey/icons/icon-512x512.jpg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${geist.className} ${geistMono.className} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
