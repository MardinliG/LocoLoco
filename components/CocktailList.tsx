"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, Filter, Heart, MapPin, Clock } from "lucide-react"

type Cocktail = {
  id: string
  name: string
  description: string | null
  image_url: string | null
  countries: {
    name: string
    code: string
  } | null
  difficulty?: string
  prep_time?: number
  ratings?: Array<{ rating: number }>
}

// Fonction pour obtenir l'emoji du pays
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
    GB: "🇬🇧",
    RU: "🇷🇺",
    JP: "🇯🇵",
  }
  return countryCode ? emojiMap[countryCode] || "🌍" : "🍹"
}

// Fonction pour obtenir un gradient aléatoire
function getRandomGradient(index: number) {
  const gradients = [
    "from-orange-400 to-red-500",
    "from-yellow-400 to-orange-500",
    "from-red-400 to-pink-500",
    "from-green-400 to-blue-500",
    "from-purple-400 to-pink-500",
    "from-blue-400 to-purple-500",
  ]
  return gradients[index % gradients.length]
}

// Fonction pour calculer la note moyenne
function calculateAverageRating(ratings: Array<{ rating: number }>) {
  if (!ratings || ratings.length === 0) return 0
  const sum = ratings.reduce((acc, r) => acc + r.rating, 0)
  return Math.round((sum / ratings.length) * 10) / 10
}

// Fonction pour afficher les étoiles
function renderStars(rating: number) {
  const stars = []
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

  for (let i = 0; i < fullStars; i++) {
    stars.push("⭐")
  }
  if (hasHalfStar) {
    stars.push("✨")
  }

  return stars.join("")
}

// Composant pour l'image avec fallback élégant
function CocktailImage({
  src,
  alt,
  gradient,
  emoji,
}: {
  src: string | null
  alt: string
  gradient: string
  emoji: string
}) {
  if (!src) {
    return (
      <div
        className={`h-56 bg-gradient-to-br ${gradient} rounded-t-xl flex items-center justify-center relative overflow-hidden`}
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <span className="text-5xl relative z-10">{emoji}</span>
        <div className="absolute bottom-2 right-2 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1">
          <span className="text-xs text-white font-medium">Cocktail</span>
        </div>
      </div>
    )
  }

  return (
    <div className="h-56 rounded-t-xl relative overflow-hidden group">
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        fill
        className="object-cover group-hover:scale-110 transition-transform duration-500"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  )
}

export default function CocktailList({ cocktails }: { cocktails: Cocktail[] }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredCocktails, setFilteredCocktails] = useState(cocktails)
  const [sortBy, setSortBy] = useState("name")
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setIsAuthenticated(!!user)
    }

    checkAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session?.user)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Filtrage et tri des cocktails
  useEffect(() => {
    const filtered = cocktails.filter(
      (cocktail) =>
        cocktail.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cocktail.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cocktail.countries?.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "country":
          return (a.countries?.name || "").localeCompare(b.countries?.name || "")
        case "rating":
          const ratingA = calculateAverageRating(a.ratings || [])
          const ratingB = calculateAverageRating(b.ratings || [])
          return ratingB - ratingA
        default:
          return 0
      }
    })

    setFilteredCocktails(filtered)
  }, [searchTerm, sortBy, cocktails])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header avec recherche et actions */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">🍹 Tous les Cocktails</h1>
              <p className="text-lg text-gray-600">
                Découvrez notre collection de {cocktails.length} recettes authentiques
              </p>
            </div>

            {isAuthenticated && (
              <Link href="/cocktails/new">
                <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:shadow-lg">
                  <Plus className="mr-2 h-5 w-5" />
                  Créer un cocktail
                </Button>
              </Link>
            )}
          </div>

          {/* Barre de recherche et filtres */}
          <div className="mt-8 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Rechercher un cocktail, ingrédient ou pays..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-base border-orange-200 focus:border-orange-400"
              />
            </div>

            <div className="flex gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-orange-200 rounded-lg bg-white text-gray-700 focus:border-orange-400 focus:outline-none"
              >
                <option value="name">Trier par nom</option>
                <option value="country">Trier par pays</option>
                <option value="rating">Trier par note</option>
              </select>

              <Button variant="outline" size="lg" className="border-orange-300 text-orange-600 hover:bg-orange-50">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Statistiques */}
          <div className="mt-6 flex flex-wrap gap-4">
            <Badge variant="outline" className="px-3 py-1 text-sm">
              📊 {filteredCocktails.length} cocktails trouvés
            </Badge>
            <Badge variant="outline" className="px-3 py-1 text-sm">
              🌍 {new Set(cocktails.map((c) => c.countries?.name).filter(Boolean)).size} pays représentés
            </Badge>
          </div>
        </div>

        {/* Grille des cocktails */}
        {filteredCocktails.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredCocktails.map((cocktail, index) => (
              <Link key={cocktail.id} href={`/cocktails/${cocktail.id}`}>
                <Card className="group hover-lift cursor-pointer border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                  <CocktailImage
                    src={cocktail.image_url}
                    alt={cocktail.name}
                    gradient={getRandomGradient(index)}
                    emoji={getCountryEmoji(cocktail.countries?.code || null)}
                  />

                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                        {cocktail.name}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
                        onClick={(e) => {
                          e.preventDefault()
                          // Logique pour ajouter aux favoris
                        }}
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Badges et infos */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {cocktail.countries && (
                        <Badge variant="sage" className="text-xs">
                          {getCountryEmoji(cocktail.countries.code)} {cocktail.countries.name}
                        </Badge>
                      )}
                      {cocktail.difficulty && (
                        <Badge variant="outline" className="text-xs">
                          🎯 {cocktail.difficulty}
                        </Badge>
                      )}
                      {cocktail.prep_time && (
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {cocktail.prep_time}min
                        </Badge>
                      )}
                    </div>

                    {/* Note */}
                    {cocktail.ratings && cocktail.ratings.length > 0 && (
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm">{renderStars(calculateAverageRating(cocktail.ratings))}</span>
                        <span className="text-sm font-medium text-orange-600">
                          {calculateAverageRating(cocktail.ratings)}/5
                        </span>
                        <span className="text-xs text-gray-500">({cocktail.ratings.length})</span>
                      </div>
                    )}

                    {/* Description */}
                    {cocktail.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{cocktail.description}</p>
                    )}
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        Voir la recette
                      </span>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-xs text-gray-500">Disponible</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          // État vide
          <div className="text-center py-16">
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Aucun cocktail trouvé</h3>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Essayez de modifier vos critères de recherche ou explorez d'autres catégories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => setSearchTerm("")}
                variant="outline"
                size="lg"
                className="border-orange-300 text-orange-600 hover:bg-orange-50"
              >
                Effacer la recherche
              </Button>
              {isAuthenticated && (
                <Link href="/cocktails/new">
                  <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500">
                    <Plus className="mr-2 h-4 w-4" />
                    Créer le premier cocktail
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Pagination (si nécessaire) */}
        {filteredCocktails.length > 12 && (
          <div className="mt-12 flex justify-center">
            <Button variant="outline" size="lg" className="border-orange-300 text-orange-600 hover:bg-orange-50">
              Charger plus de cocktails
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
