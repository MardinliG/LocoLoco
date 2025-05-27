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

    // Fonction pour vérifier si le cocktail est dans les favoris
    const checkFavoriteStatus = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                setIsFavorite(false)
                return
            }

            const { data, error } = await supabase
                .from('favorites')
                .select('id')
                .eq('cocktail_id', cocktailId)
                .eq('user_id', user.id)
                .single()

            if (error && error.code !== 'PGRST116') {
                console.error('Error checking favorite status:', error)
                return
            }

            setIsFavorite(!!data)
        } catch (error) {
            console.error('Error checking favorite status:', error)
        }
    }

    // Vérifier le statut au montage du composant
    useEffect(() => {
        checkFavoriteStatus()
    }, [cocktailId])

    // Réinitialiser le statut quand l'utilisateur change
    useEffect(() => {
        checkFavoriteStatus()
    }, [supabase.auth.getUser()])

    const toggleFavorite = async () => {
        if (isLoading) return

        setIsLoading(true)
        setError(null)

        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push('/login')
                return
            }

            if (isFavorite) {
                // Supprimer des favoris
                const { error: deleteError } = await supabase
                    .from('favorites')
                    .delete()
                    .eq('cocktail_id', cocktailId)
                    .eq('user_id', user.id)

                if (deleteError) throw deleteError
                setIsFavorite(false)
            } else {
                // Ajouter aux favoris
                const { error: insertError } = await supabase
                    .from('favorites')
                    .insert({
                        cocktail_id: cocktailId,
                        user_id: user.id
                    })

                if (insertError) throw insertError
                setIsFavorite(true)
            }
        } catch (error) {
            console.error('Error toggling favorite:', error)
            setError('Erreur lors de la modification des favoris')
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
                className={`p-2 rounded-full transition-colors focus:outline-none ${isFavorite
                        ? 'text-red-500 hover:text-red-600'
                        : 'text-gray-400 hover:text-gray-500'
                    }`}
            >
                <FiHeart
                    className={`w-8 h-8 ${isFavorite ? 'fill-current' : ''
                        }`}
                />
            </button>
            {error && (
                <p className="mt-2 text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    )
} 