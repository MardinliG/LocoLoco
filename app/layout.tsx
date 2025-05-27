import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { SupabaseProvider } from '@/lib/supabase-provider'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
    title: 'Lococktail - L\'encyclopédie du cocktail',
    description: 'Découvrez et partagez vos recettes de cocktails préférées',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="fr">
            <body className={`${inter.variable} font-sans`}>
                <SupabaseProvider>
                    <Navbar />
                    <main>{children}</main>
                    <Toaster position="top-right" />
                </SupabaseProvider>
            </body>
        </html>
    )
} 