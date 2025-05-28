import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Wine, Globe, MapPin, BookOpen, Users, Star, ChevronRight, Sparkles } from "lucide-react"

export default function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
            {/* Enhanced decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-slate-300/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-slate-400/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-slate-300/20 rounded-full blur-2xl animate-pulse delay-500"></div>
            </div>

            <div className="container mx-auto px-4 relative">
                <div className="min-h-screen flex flex-col items-center justify-center py-16">
                    {/* Enhanced main content */}
                    <div className="text-center max-w-4xl mx-auto mb-20">
                        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200 mb-8">
                            <Sparkles className="h-4 w-4 text-slate-600" />
                            <span className="text-sm font-medium text-slate-700">Découverte Mondiale</span>
                        </div>

                        <h1 className="text-8xl font-bold text-slate-800 leading-tight mb-8">Cocktails du Monde</h1>

                        <p className="text-2xl text-slate-600 mb-12 leading-relaxed">
                            Embarquez pour un voyage gustatif extraordinaire à travers les continents.
                            <br />
                            <span className="text-slate-700 font-medium">
                                Chaque gorgée raconte une histoire, chaque recette révèle une culture.
                            </span>
                        </p>

                        <div className="flex justify-center items-center mb-12">
                            <Link href="/world">
                                <Button className="bg-slate-800 text-white px-10 py-4 text-lg font-medium rounded-lg hover:bg-slate-700 transition-colors duration-200 flex items-center gap-2">
                                    <Globe className="h-5 w-5" />
                                    Explorer le Globe
                                </Button>
                            </Link>
                        </div>

                        {/* Stats section */}
                        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-slate-700 mb-1">150+</div>
                                <div className="text-sm text-slate-600">Cocktails</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-slate-700 mb-1">50+</div>
                                <div className="text-sm text-slate-600">Pays</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-slate-700 mb-1">25k+</div>
                                <div className="text-sm text-slate-600">Utilisateurs</div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced feature cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-7xl">
                        <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:rotate-1">
                            <div className="bg-slate-100 p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Wine className="h-8 w-8 text-slate-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-4">Recettes Authentiques</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Découvrez les secrets des maîtres bartenders et les recettes transmises de génération en génération
                            </p>
                            <div className="flex items-center gap-1 mt-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 fill-slate-400 text-slate-400" />
                                ))}
                            </div>
                        </div>

                        <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:-rotate-1">
                            <div className="bg-slate-100 p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                                <MapPin className="h-8 w-8 text-slate-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-4">Carte Interactive</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Explorez le monde en 3D et découvrez les spécialités cocktails de chaque région
                            </p>
                            <div className="flex items-center gap-1 mt-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 fill-slate-400 text-slate-400" />
                                ))}
                            </div>
                        </div>

                        <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:rotate-1">
                            <div className="bg-slate-100 p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                                <BookOpen className="h-8 w-8 text-slate-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-4">Histoire & Culture</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Plongez dans les récits fascinants derrière chaque cocktail et leur impact culturel
                            </p>
                            <div className="flex items-center gap-1 mt-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 fill-slate-400 text-slate-400" />
                                ))}
                            </div>
                        </div>

                        <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:-rotate-1">
                            <div className="bg-slate-100 p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Users className="h-8 w-8 text-slate-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-4">Communauté</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Rejoignez une communauté passionnée et partagez vos propres créations cocktails
                            </p>
                            <div className="flex items-center gap-1 mt-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 fill-slate-400 text-slate-400" />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Testimonial section */}
                    <div className="mt-24 max-w-4xl mx-auto">
                        <div className="bg-white/80 backdrop-blur-sm p-12 rounded-3xl border border-slate-200 shadow-2xl">
                            <div className="text-center">
                                <div className="flex justify-center mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="h-6 w-6 fill-slate-400 text-slate-400" />
                                    ))}
                                </div>
                                <blockquote className="text-2xl font-medium text-slate-700 mb-6 italic">
                                    "Une expérience incroyable ! J'ai découvert des cocktails que je n'aurais jamais imaginés. Chaque
                                    recette est une invitation au voyage."
                                </blockquote>
                                <div className="flex items-center justify-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center">
                                        <span className="text-white font-bold">MJ</span>
                                    </div>
                                    <div className="text-left">
                                        <div className="font-semibold text-slate-800">Marie Dubois</div>
                                        <div className="text-slate-600">Bartender Professionnelle</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
