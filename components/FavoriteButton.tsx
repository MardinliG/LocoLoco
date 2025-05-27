'use client'

import { useState, useEffect } from 'react'
import { FiHeart } from 'react-icons/fi'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

type FavoriteButtonProps = {
    cocktailId: string
    initialIsFavorite?: boolean
}

export default function FavoriteButton({ cocktailId, initialIsFavorite = false }: FavoriteButtonProps) {
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const supabase = createClientComponentClient()
    const router = useRouter()

    const toggleFavorite = async () => {
        if (isLoading) return

        setIsLoading(true)
        setError(null)

        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser()

            if (userError) {
                console.error('Error getting user:', userError)
                throw new Error('Erreur lors de la récupération de l\'utilisateur')
            }

            if (!user) {
                router.push('/login')
                return
            }

            console.log('User authenticated:', user.id)

            if (isFavorite) {
                // Supprimer des favoris
                console.log('Removing from favorites:', { cocktailId, userId: user.id })
                const { data: deleteData, error: deleteError } = await supabase
                    .from('favorites')
                    .delete()
                    .eq('cocktail_id', cocktailId)
                    .eq('user_id', user.id)
                    .select()

                if (deleteError) {
                    console.error('Error deleting favorite:', deleteError)
                    throw new Error(`Erreur lors de la suppression des favoris: ${deleteError.message}`)
                }

                console.log('Favorite removed successfully:', deleteData)
            } else {
                // Ajouter aux favoris
                console.log('Adding to favorites:', { cocktailId, userId: user.id })
                const { data: insertData, error: insertError } = await supabase
                    .from('favorites')
                    .insert({
                        cocktail_id: cocktailId,
                        user_id: user.id
                    })
                    .select()

                if (insertError) {
                    console.error('Error inserting favorite:', insertError)
                    throw new Error(`Erreur lors de l'ajout aux favoris: ${insertError.message}`)
                }

                console.log('Favorite added successfully:', insertData)
            }

            setIsFavorite(!isFavorite)
            router.refresh()
        } catch (error) {
            console.error('Error toggling favorite:', error)
            setError(error instanceof Error ? error.message : 'Une erreur est survenue')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center">
            <button
                type="button"
                onClick={toggleFavorite}
                disabled={isLoading}
                className={`p-2 rounded-full transition-colors ${isFavorite
                        ? 'text-red-500 hover:text-red-600'
                        : 'text-gray-400 hover:text-red-500'
                    }`}
                title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            >
                <FiHeart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            {error && (
                <div className="text-sm text-red-600 mt-1">
                    {error}
                </div>
            )}
        </div>
    )
} 