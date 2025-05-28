import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Heart, Zap, Users, ArrowRight } from "lucide-react"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Image from "next/image"
import SearchBar from "@/components/Searchbar"

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
  }
  return countryCode ? emojiMap[countryCode] || "🌍" : "🍹"
}

// Fonction pour obtenir un gradient aléatoire
function getRandomGradient(index: number) {
  const gradients = [
    "from-cocktail-sage-200 to-cocktail-sage-300",
    "from-cocktail-terracotta-200 to-cocktail-terracotta-300",
    "from-cocktail-amber-200 to-cocktail-amber-300",
    "from-cocktail-cream-200 to-cocktail-cream-300",
  ]
  return gradients[index % gradients.length]
}

// Composant pour l'image avec fallback
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
      <div className={`h-40 bg-gradient-to-br ${gradient} rounded-t-cocktail flex items-center justify-center`}>
        <span className="text-4xl">{emoji}</span>
      </div>
    )
  }

  return (
    <div className="h-40 rounded-t-cocktail relative overflow-hidden">
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-300"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={false}
      />
    </div>
  )
}

export default async function HomePage() {
  const supabase = createServerComponentClient({ cookies })

  // Récupérer les 3 cocktails les plus populaires (ou les 3 premiers)
  const { data: popularCocktails, error } = await supabase
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
    .limit(3)

  // En cas d'erreur, utiliser des données de fallback
  const cocktailsToShow = popularCocktails || []

  return (
    <div className="min-h-screen">
      {/* Hero Section Minimaliste */}
      <section className="relative py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="elegant" className="mb-6 px-4 py-2">
            🍹 Découvrez l'art des cocktails
          </Badge>

          <h1 className="text-4xl md:text-6xl font-display font-semibold mb-6 leading-tight">
              Lococktail
          </h1>

          <p className="text-lg md:text-xl text-warm-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Explorez une collection soigneusement sélectionnée de recettes authentiques. Créez, partagez et savourez
            l'art de la mixologie.
          </p>

          <div className="mb-12">
            <SearchBar />
          </div>

          {/* CTA Buttons Minimalistes */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/cocktails">
              <Button size="lg" className="px-8 py-3">
                Explorer les cocktails
              </Button>
            </Link>
            <Link href="/world">
              <Button size="lg" variant="outline" className="px-8 py-3">
                Découvrir le monde
              </Button>
            </Link>
          </div>

          {/* Stats Minimalistes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-semibold text-cocktail-amber-600 mb-1">500+</div>
              <div className="text-sm text-warm-600">Recettes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-cocktail-terracotta-600 mb-1">50+</div>
              <div className="text-sm text-warm-600">Pays</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-cocktail-sage-600 mb-1">1000+</div>
              <div className="text-sm text-warm-600">Utilisateurs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-cocktail-amber-600 mb-1">4.8★</div>
              <div className="text-sm text-warm-600">Note moyenne</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section Épurée */}
      <section className="py-20 px-4 bg-cocktail-warm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-semibold mb-4">Une expérience sur mesure</h2>
            <p className="text-lg text-warm-600 max-w-2xl mx-auto">
              Des outils pensés pour les passionnés de mixologie
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover-lift">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-cocktail-amber-100 rounded-cocktail flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-cocktail-amber-600" />
                </div>
                <CardTitle className="text-lg">Recherche Intelligente</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Trouvez le cocktail parfait grâce à notre moteur de recherche avancé par ingrédients et préférences.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover-lift">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-cocktail-terracotta-100 rounded-cocktail flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-6 w-6 text-cocktail-terracotta-600" />
                </div>
                <CardTitle className="text-lg">Collection Personnelle</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Sauvegardez vos recettes favorites et créez votre propre collection de cocktails.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover-lift">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-cocktail-sage-100 rounded-cocktail flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-cocktail-sage-600" />
                </div>
                <CardTitle className="text-lg">Communauté Active</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Partagez vos créations et découvrez les recettes de notre communauté passionnée.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Cocktails Populaires avec vraies données */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-semibold mb-4">Cocktails incontournables</h2>
            <p className="text-lg text-warm-600">Les créations les plus appréciées de notre communauté</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {cocktailsToShow.length > 0 ? (
              cocktailsToShow.map((cocktail, index) => (
                <Link key={cocktail.id} href={`/cocktails/${cocktail.id}`}>
                  <Card className="group hover-lift cursor-pointer">
                    <CocktailImage
                      src={cocktail.image_url}
                      alt={cocktail.name}
                      gradient={getRandomGradient(index)}
                      emoji={getCountryEmoji(cocktail.countries?.code || null)}
                    />
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg group-hover:text-cocktail-amber-600 transition-colors">
                          {cocktail.name}
                        </CardTitle>
                        {cocktail.countries && (
                          <Badge variant="sage" className="text-xs">
                            {getCountryEmoji(cocktail.countries.code)} {cocktail.countries.name}
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="line-clamp-2">
                        {cocktail.description || "Une délicieuse création à découvrir absolument."}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))
            ) : (
              // Fallback si pas de cocktails dans la BDD
              <>
                <Card className="group hover-lift">
                  <div className="h-40 bg-gradient-to-br from-cocktail-sage-200 to-cocktail-sage-300 rounded-t-cocktail flex items-center justify-center">
                    <span className="text-4xl">🍹</span>
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">Margarita Classique</CardTitle>
                      <Badge variant="sage" className="text-xs">
                        🇲🇽 Mexique
                      </Badge>
                    </div>
                    <CardDescription>
                      L'incontournable cocktail mexicain avec tequila, citron vert et triple sec.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="group hover-lift">
                  <div className="h-40 bg-gradient-to-br from-cocktail-terracotta-200 to-cocktail-terracotta-300 rounded-t-cocktail flex items-center justify-center">
                    <span className="text-4xl">🥤</span>
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">Paloma Rafraîchissante</CardTitle>
                      <Badge variant="sage" className="text-xs">
                        🇲🇽 Mexique
                      </Badge>
                    </div>
                    <CardDescription>
                      Tequila et pamplemousse pour une fraîcheur incomparable en toute saison.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="group hover-lift">
                  <div className="h-40 bg-gradient-to-br from-cocktail-amber-200 to-cocktail-amber-300 rounded-t-cocktail flex items-center justify-center">
                    <span className="text-4xl">🍺</span>
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">Michelada Épicée</CardTitle>
                      <Badge variant="sage" className="text-xs">
                        🇲🇽 Mexique
                      </Badge>
                    </div>
                    <CardDescription>
                      Bière mexicaine relevée avec citron, sauce piquante et épices authentiques.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </>
            )}
          </div>

          <div className="text-center mt-12">
            <Link href="/cocktails">
              <Button variant="outline" size="lg" className="px-8">
                Voir tous les cocktails
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section Minimaliste */}
      <section className="py-20 px-4 bg-cocktail-elegant">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-display font-semibold mb-6">Prêt à commencer votre aventure ?</h2>
          <p className="text-lg text-warm-600 mb-8">Rejoignez notre communauté et découvrez l'art de la mixologie.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="px-8">
                Commencer gratuitement
              </Button>
            </Link>
            <Link href="/quiz">
              <Button size="lg" variant="outline" className="px-8">
                Tester mes connaissances
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Minimaliste */}
      <footer className="py-12 px-4 bg-warm-900 text-warm-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-cocktail-amber-400">🍹 LocoLoco</h3>
              <p className="text-warm-300 text-sm leading-relaxed">
                L'art des cocktails à portée de main. Découvrez, créez et partagez vos recettes favorites.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Navigation</h4>
              <ul className="space-y-2 text-sm text-warm-300">
                <li>
                  <Link href="/world" className="hover:text-cocktail-amber-400 transition-colors">
                    Monde
                  </Link>
                </li>
                <li>
                  <Link href="/cocktails" className="hover:text-cocktail-amber-400 transition-colors">
                    Cocktails
                  </Link>
                </li>
                <li>
                  <Link href="/quiz" className="hover:text-cocktail-amber-400 transition-colors">
                    Quiz
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="hover:text-cocktail-amber-400 transition-colors">
                    Profil
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Fonctionnalités</h4>
              <ul className="space-y-2 text-sm text-warm-300">
                <li>Recherche avancée</li>
                <li>Collection personnelle</li>
                <li>Notations communautaires</li>
                <li>Interface responsive</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-warm-300">
                <li>
                  <Link href="/contact" className="hover:text-cocktail-amber-400 transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-cocktail-amber-400 transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-cocktail-amber-400 transition-colors">
                    Confidentialité
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-cocktail-amber-400 transition-colors">
                    Conditions
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-warm-800 mt-8 pt-8 text-center">
            <p className="text-sm text-warm-400">&copy; 2024 LocoLoco. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
