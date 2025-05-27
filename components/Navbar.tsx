'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi'
import { useSupabase } from '@/lib/supabase-provider'
import { toast } from 'react-hot-toast'

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    const pathname = usePathname()
    const { supabase, user } = useSupabase()

    const handleSignOut = async () => {
        try {
            const { error } = await supabase.auth.signOut()
            if (error) throw error
            toast.success('Déconnexion réussie')
        } catch (error: any) {
            toast.error(error.message || 'Erreur lors de la déconnexion')
        }
    }

    const isActive = (path: string) => pathname === path

    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link href="/" className="flex items-center">
                            <span className="text-xl font-bold text-gray-900">AuMax</span>
                        </Link>
                    </div>

                    {/* Desktop menu */}
                    <div className="hidden sm:flex sm:items-center sm:space-x-8">
                        <Link
                            href="/"
                            className={`text-sm font-medium ${isActive('/') ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Accueil
                        </Link>
                        <Link
                            href="/world"
                            className={`text-sm font-medium ${isActive('/world') ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            World
                        </Link>
                        <Link
                            href="/cocktails"
                            className={`text-sm font-medium ${isActive('/cocktails') ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Cocktails
                        </Link>
                        <Link
                            href="/quiz"
                            className={`text-sm font-medium ${isActive('/quiz') ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Quiz
                        </Link>
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900"
                                >
                                    <FiUser className="h-5 w-5" />
                                </button>
                                {isUserMenuOpen && (
                                    <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <div className="py-1">
                                            <Link
                                                href="/profile"
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                <FiUser className="mr-3 h-5 w-5" />
                                                Profil
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    handleSignOut()
                                                    setIsUserMenuOpen(false)
                                                }}
                                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                <FiLogOut className="mr-3 h-5 w-5" />
                                                Déconnexion
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="text-sm font-medium text-gray-500 hover:text-gray-900"
                            >
                                Connexion
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="sm:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                        >
                            {isMenuOpen ? (
                                <FiX className="block h-6 w-6" />
                            ) : (
                                <FiMenu className="block h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="sm:hidden">
                    <div className="pt-2 pb-3 space-y-1">
                        <Link
                            href="/"
                            className={`block px-3 py-2 text-base font-medium ${isActive('/') ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                        >
                            Accueil
                        </Link>
                        <Link
                            href="/world"
                            className={`block px-3 py-2 text-base font-medium ${isActive('/world') ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                        >
                            World
                        </Link>
                        <Link
                            href="/cocktails"
                            className={`block px-3 py-2 text-base font-medium ${isActive('/cocktails') ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                        >
                            Cocktails
                        </Link>
                        <Link
                            href="/quiz"
                            className={`block px-3 py-2 text-base font-medium ${isActive('/quiz') ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                        >
                            Quiz
                        </Link>
                        {user ? (
                            <>
                                <Link
                                    href="/profile"
                                    className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                >
                                    Profil
                                </Link>
                                <button
                                    onClick={handleSignOut}
                                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                >
                                    Déconnexion
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                            >
                                Connexion
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
} 