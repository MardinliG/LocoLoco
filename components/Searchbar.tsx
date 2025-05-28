"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Search, ArrowRight, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

type Cocktail = {
  id: string
  name: string
  description: string | null
  image_url: string | null
  countries: {
    name: string
    code: string
  } | null
}

function getCountryEmoji(countryCode: string | null) {
  const emojiMap: { [key: string]: string } = {
    MX: "🇲🇽",
    US: "🇺🇸",
    CU: "🇨🇺",
    BR: "🇧🇷",
    AR: "🇦🇷",
    ES: "🇪🇸",
    FR: "🇫🇷",
    IT: "🇮🇹",
  }
  return countryCode ? emojiMap[countryCode] || "🌍" : "🍹"
}

export default function SearchBar() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Cocktail[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const supabase = createClientComponentClient()
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Recherche dans la base de données
  const searchCocktails = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([])
      setIsOpen(false)
      return
    }

    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("cocktails")
        .select(`
          id,
          name,
          description,
          image_url,
          countries (
            name,
            code
          )
        `)
        .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .limit(6)

      if (error) throw error

      setResults(data || [])
      setIsOpen(true)
      setSelectedIndex(-1)
    } catch (error) {
      console.error("Erreur de recherche:", error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  // Debounce pour éviter trop de requêtes
  useEffect(() => {
    const timer = setTimeout(() => {
      searchCocktails(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  // Fermer les résultats quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Navigation au clavier
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0 && results[selectedIndex]) {
          window.location.href = `/cocktails/${results[selectedIndex].id}`
        } else if (results.length > 0) {
          window.location.href = `/cocktails/${results[0].id}`
        }
        break
      case "Escape":
        setIsOpen(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  const clearSearch = () => {
    setQuery("")
    setResults([])
    setIsOpen(false)
    setSelectedIndex(-1)
    inputRef.current?.focus()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (results.length > 0) {
      const targetCocktail = selectedIndex >= 0 ? results[selectedIndex] : results[0]
      window.location.href = `/cocktails/${targetCocktail.id}`
    }
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-lg mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-warm-400 h-5 w-5" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Rechercher un cocktail..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query.length >= 2 && setIsOpen(true)}
            className="pl-12 pr-20 py-3 text-base rounded-cocktail-lg border-warm-200 focus:border-cocktail-amber-400"
          />

          {/* Bouton clear */}
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-12 top-1/2 transform -translate-y-1/2 text-warm-400 hover:text-warm-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Bouton search */}
          <Button
            type="submit"
            size="sm"
            disabled={results.length === 0}
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </form>

      {/* Résultats de recherche */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-cocktail-lg shadow-cocktail-xl border border-warm-200 z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-cocktail-amber-600 mx-auto mb-2"></div>
              <p className="text-warm-600 text-sm">Recherche en cours...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((cocktail, index) => (
                <Link
                  key={cocktail.id}
                  href={`/cocktails/${cocktail.id}`}
                  className={`block px-4 py-3 hover:bg-cocktail-warm transition-colors ${
                    selectedIndex === index ? "bg-cocktail-warm" : ""
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    {/* Image ou emoji */}
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      {cocktail.image_url ? (
                        <Image
                          src={cocktail.image_url || "/placeholder.svg"}
                          alt={cocktail.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-cocktail-amber-200 to-cocktail-amber-300 flex items-center justify-center">
                          <span className="text-lg">{getCountryEmoji(cocktail.countries?.code || null)}</span>
                        </div>
                      )}
                    </div>

                    {/* Informations */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-warm-900 truncate">{cocktail.name}</h4>
                        {cocktail.countries && (
                          <Badge variant="sage" className="text-xs ml-2 flex-shrink-0">
                            {getCountryEmoji(cocktail.countries.code)} {cocktail.countries.name}
                          </Badge>
                        )}
                      </div>
                      {cocktail.description && (
                        <p className="text-sm text-warm-600 truncate mt-1">{cocktail.description}</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center">
              <div className="text-3xl mb-2">🔍</div>
              <p className="text-warm-600 text-sm">Aucun cocktail trouvé pour "{query}"</p>
              <p className="text-warm-500 text-xs mt-1">Essayez avec d'autres mots-clés</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
