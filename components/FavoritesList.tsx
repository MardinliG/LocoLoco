'use client'

import { useState } from 'react'
import { useSupabase } from '@/lib/supabase-provider'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'
import Link from 'next/link'

type Cocktail = {
    id: string
    name: string
    description: string
    ingredients: string[]
    instructions: string
    country_id: string
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

export default function FavoritesList({ favorites }: { favorites: Favorite[] }) {
    const { session } = useSupabase()
    const [isRemoving, setIsRemoving] = useState<string | null>(null)

    const removeFavorite = async (favoriteId: string) => {
        setIsRemoving(favoriteId)

        try {
            const { error } = await supabase
                .from('favorites')
                .delete()
                .eq('id', favoriteId)

            if (error) throw error

            toast.success('Cocktail retiré des favoris')
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((favorite) => (
                <div
                    key={favorite.id}
                    className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                >
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="font-semibold text-lg">{favorite.cocktails.name}</h3>
                            <p className="text-sm text-gray-600">
                                {favorite.cocktails.countries.name}
                            </p>
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
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {favorite.cocktails.description}
                    </p>
                    <div className="space-y-1">
                        <h4 className="text-sm font-medium">Ingrédients :</h4>
                        <ul className="text-sm text-gray-600 list-disc list-inside">
                            {favorite.cocktails.ingredients.slice(0, 3).map((ingredient, index) => (
                                <li key={index}>{ingredient}</li>
                            ))}
                            {favorite.cocktails.ingredients.length > 3 && <li>...</li>}
                        </ul>
                    </div>
                    <Link
                        href={`/cocktails/${favorite.cocktails.id}`}
                        className="mt-4 inline-block text-blue-600 hover:text-blue-800 text-sm"
                    >
                        Voir la recette complète →
                    </Link>
                </div>
            ))}
        </div>
    )
} 