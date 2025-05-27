'use client'

import { useState } from 'react'
import { useSupabase } from '@/lib/supabase-provider'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Cocktail = {
    id: string
    name: string
    description: string
    ingredients: string[]
    instructions: string
    country_id: string
    image_url: string | null
    countries: {
        id: string
        name: string
        code: string
    }
}

type Favorite = {
    id: string
    created_at: string
    cocktails: Cocktail
}

export default function FavoritesList({ favorites: initialFavorites }: { favorites: Favorite[] }) {
    const { session } = useSupabase()
    const [isRemoving, setIsRemoving] = useState<string | null>(null)
    const [favorites, setFavorites] = useState<Favorite[]>(initialFavorites)
    const router = useRouter()

    const removeFavorite = async (favoriteId: string) => {
        setIsRemoving(favoriteId)

        try {
            const { error } = await supabase
                .from('favorites')
                .delete()
                .eq('id', favoriteId)

            if (error) throw error

            // Mettre à jour l'état local
            setFavorites(favorites.filter(fav => fav.id !== favoriteId))
            toast.success('Cocktail retiré des favoris')

            // Rafraîchir la page pour mettre à jour les données
            router.refresh()
        } catch (error) {
            console.error('Error removing favorite:', error)
            toast.error('Erreur lors de la suppression du favori')
        } finally {
            setIsRemoving(null)
        }
    }

    if (favorites.length === 0) {
        return (
            <div className="text-center py-4">
                <p className="text-gray-600">Vous n'avez pas encore de cocktails favoris</p>
                <Link
                    href="/world"
                    className="inline-block mt-4 text-blue-600 hover:text-blue-800"
                >
                    Découvrir des cocktails
                </Link>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => (
                <div
                    key={favorite.id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                    {favorite.cocktails.image_url && (
                        <div className="w-full h-48 relative">
                            <img
                                src={favorite.cocktails.image_url}
                                alt={favorite.cocktails.name}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        </div>
                    )}
                    <div className="p-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                    {favorite.cocktails.name}
                                </h2>
                                {favorite.cocktails.countries && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {favorite.cocktails.countries.name}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => removeFavorite(favorite.id)}
                                disabled={isRemoving === favorite.id}
                                className="text-red-600 hover:text-red-800 disabled:opacity-50"
                            >
                                {isRemoving === favorite.id ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-red-600"></div>
                                ) : (
                                    '×'
                                )}
                            </button>
                        </div>
                        {favorite.cocktails.description && (
                            <p className="text-gray-600 line-clamp-2 mt-2">
                                {favorite.cocktails.description}
                            </p>
                        )}
                        <Link
                            href={`/cocktails/${favorite.cocktails.id}`}
                            className="mt-4 inline-block text-blue-600 hover:text-blue-800 text-sm"
                        >
                            Voir la recette complète →
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    )
} 