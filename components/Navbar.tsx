'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiMenu, FiX, FiUser, FiLogOut, FiSettings } from 'react-icons/fi'
import { useSupabase } from '@/lib/supabase-provider'

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    const pathname = usePathname()
    const { user, signOut } = useSupabase()

    const isActive = (path: string) => pathname === path

    const navLinks = [
        { href: '/world', label: 'World' },
        { href: '/quiz', label: 'Quiz' },
        { href: '/favorites', label: 'Favoris' },
    ]

    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link href="/" className="flex items-center">
                            <span className="text-xl font-bold text-primary-600">Lococktail</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden sm:flex sm:items-center sm:space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`${isActive(link.href)
                                    ? 'text-primary-600'
                                    : 'text-gray-500 hover:text-gray-900'
                                    } px-3 py-2 text-sm font-medium`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center text-gray-500 hover:text-gray-900"
                                >
                                    <FiUser className="h-5 w-5" />
                                </button>

                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                        <div className="py-1">
                                            <Link
                                                href="/profile"
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                <FiUser className="mr-3 h-5 w-5" />
                                                Mon profil
                                            </Link>
                                            {user.role === 'admin' && (
                                                <Link
                                                    href="/admin"
                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    <FiSettings className="mr-3 h-5 w-5" />
                                                    Administration
                                                </Link>
                                            )}
                                            <button
                                                onClick={() => signOut()}
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
                                className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                            >
                                Connexion
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center sm:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-500 hover:text-gray-900"
                        >
                            {isMenuOpen ? (
                                <FiX className="h-6 w-6" />
                            ) : (
                                <FiMenu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="sm:hidden">
                    <div className="pt-2 pb-3 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`${isActive(link.href)
                                    ? 'bg-primary-50 text-primary-600'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                    } block px-3 py-2 text-base font-medium`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        {user ? (
                            <>
                                <Link
                                    href="/profile"
                                    className="block px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                >
                                    Mon profil
                                </Link>
                                {user.role === 'admin' && (
                                    <Link
                                        href="/admin"
                                        className="block px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                    >
                                        Administration
                                    </Link>
                                )}
                                <button
                                    onClick={() => signOut()}
                                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                >
                                    Déconnexion
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="block px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
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