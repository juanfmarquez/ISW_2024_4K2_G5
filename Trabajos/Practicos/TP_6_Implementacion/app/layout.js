'use client'
import localFont from 'next/font/local'
import './globals.css'
import { ChevronLeft } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900'
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900'
})

export default function RootLayout ({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const isMainPage = pathname === '/'

  const handleBackClick = (e) => {
    e.preventDefault()
    router.back()
  }

  return (
    <html lang='es'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {!isMainPage && (
          <header className='border px-4 h-10 flex items-center'>
            <button onClick={handleBackClick} className='mr-4'>
              <ChevronLeft className='hover:text-gray-600 transition-colors' />
            </button>
            <p className=''>Tango</p>
          </header>
        )}
        <main className='p-4'>
          {children}
        </main>
      </body>
    </html>
  )
}
