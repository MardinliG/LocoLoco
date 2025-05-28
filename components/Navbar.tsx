"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, User, LogOut, Heart, Search, MapPin, Trophy, Home } from "lucide-react"
import { useSupabase } from "@/lib/supabase-provider"
import { toast } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { supabase, user } = useSupabase()

  // Effet de scroll pour la navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      toast.success("¡Hasta la vista! 👋")
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la déconnexion")
    }
  }

  const isActive = (path: string) => pathname === path

  const navItems = [
    { href: "/", label: "Accueil", icon: Home },
    { href: "/world", label: "Monde", icon: MapPin },
    { href: "/cocktails", label: "Cocktails", icon: Search },
    { href: "/quiz", label: "Quiz", icon: Trophy },
  ]

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100" : "bg-white/90 backdrop-blur-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            {/* Logo compact */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <div className="text-xl group-hover:scale-110 transition-transform">🍹</div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900">Loco</span>
                <span className="text-xs text-orange-600 font-medium -mt-1">Cocktails</span>
              </div>
            </Link>

            {/* Desktop Navigation - Plus compact */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
                      active
                        ? "bg-orange-50 text-orange-600"
                        : "text-gray-600 hover:text-orange-600 hover:bg-orange-50/50"
                    }`}
                  >
                    <div className="flex items-center space-x-1.5">
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </div>
                    {active && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-orange-500 rounded-full"></div>
                    )}
                  </Link>
                )
              })}
            </div>

            {/* User Menu & Actions - Plus compact */}
            <div className="hidden md:flex items-center space-x-3">
              {user ? (
                <div className="flex items-center space-x-2">
                  {/* Favoris compact */}
                  <Link href="/favorites">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="relative h-8 w-8 p-0 text-gray-600 hover:text-red-500 hover:bg-red-50"
                    >
                      <Heart className="h-4 w-4" />
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-red-500 text-white"
                      >
                        3
                      </Badge>
                    </Button>
                  </Link>

                  {/* User Dropdown compact */}
                  <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-2 px-2 py-1.5 rounded-lg transition-all duration-200 bg-gray-50 hover:bg-gray-100"
                    >
                      <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        {user.email?.[0]?.toUpperCase() || "U"}
                      </div>
                      <span className="text-sm font-medium text-gray-700 hidden lg:block">
                        {user.email?.split("@")[0] || "Usuario"}
                      </span>
                    </button>

                    {/* Dropdown Menu compact */}
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50">
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 px-3 py-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {user.email?.[0]?.toUpperCase() || "U"}
                            </div>
                            <div>
                              <p className="text-white font-medium text-sm">{user.email?.split("@")[0] || "Usuario"}</p>
                              <p className="text-orange-100 text-xs truncate">{user.email}</p>
                            </div>
                          </div>
                        </div>
                        <div className="py-1">
                          <Link
                            href="/profile"
                            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <User className="mr-2 h-4 w-4" />
                            Mon Profil
                          </Link>
                          <Link
                            href="/favorites"
                            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Heart className="mr-2 h-4 w-4" />
                            Mes Favoris
                          </Link>
                          <hr className="my-1 border-gray-100" />
                          <button
                            onClick={() => {
                              handleSignOut()
                              setIsUserMenuOpen(false)
                            }}
                            className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            Déconnexion
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="text-sm text-gray-600 hover:text-orange-600">
                      Connexion
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="sm" className="text-sm bg-orange-500 hover:bg-orange-600 text-white px-4">
                      Commencer
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-colors"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu compact */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100">
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      active ? "bg-orange-50 text-orange-600" : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}

              {user ? (
                <div className="pt-3 border-t border-gray-100 space-y-2">
                  <div className="flex items-center space-x-3 px-3 py-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {user.email?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{user.email?.split("@")[0] || "Usuario"}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/profile"
                    className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    <span>Mon Profil</span>
                  </Link>
                  <Link
                    href="/favorites"
                    className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Heart className="h-4 w-4" />
                    <span>Mes Favoris</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut()
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Déconnexion</span>
                  </button>
                </div>
              ) : (
                <div className="pt-3 border-t border-gray-100 space-y-2">
                  <Link
                    href="/login"
                    className="block px-3 py-2 text-center bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Commencer l'Aventure
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Spacer réduit */}
      <div className="h-14"></div>
    </>
  )
}
