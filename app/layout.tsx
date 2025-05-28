import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { SupabaseProvider } from '@/lib/supabase-provider'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Lococktail - Découvrez les meilleurs cocktails',
    description: 'Explorez une collection de cocktails du monde entier',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="fr">
            <body className={inter.className}>
                <SupabaseProvider>
                    <Navbar />
                    <main>{children}</main>
                    <Toaster position="top-center" />
                </SupabaseProvider>
            </body>
        </html>
    )
} 