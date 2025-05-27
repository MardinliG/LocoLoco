'use client'

import { useState, useEffect } from 'react'
import { FiStar } from 'react-icons/fi'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

type RatingStats = {
    averageRating: number
    totalRatings: number
}

type RatingStarsProps = {
    cocktailId: string
}

export default function RatingStars({ cocktailId }: RatingStarsProps) {
    const [rating, setRating] = useState(0)
    const [hover, setHover] = useState(0)
    const [comment, setComment] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [stats, setStats] = useState<RatingStats>({ averageRating: 0, totalRatings: 0 })
    const supabase = createClientComponentClient()
    const router = useRouter()

    // Fonction pour récupérer les statistiques des notes
    const fetchRatingStats = async () => {
        try {
            const { data, error } = await supabase
                .from('ratings')
                .select('rating')
                .eq('cocktail_id', cocktailId)

            if (error) {
                console.error('Error fetching rating stats:', error)
                return
            }

            if (data && data.length > 0) {
                const totalRatings = data.length
                const sum = data.reduce((acc, curr) => acc + curr.rating, 0)
                const averageRating = sum / totalRatings

                setStats({
                    averageRating,
                    totalRatings
                })
            }
        } catch (error) {
            console.error('Error calculating rating stats:', error)
        }
    }

    // Fonction pour récupérer la note de l'utilisateur connecté
    const fetchUserRating = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data, error } = await supabase
                .from('ratings')
                .select('rating, comment')
                .eq('cocktail_id', cocktailId)
                .eq('user_id', user.id)
                .single()

            if (error && error.code !== 'PGRST116') {
                console.error('Error fetching user rating:', error)
                return
            }

            if (data) {
                setRating(data.rating)
                setComment(data.comment || '')
            }
        } catch (error) {
            console.error('Error fetching user rating:', error)
        }
    }

    // Charger les statistiques et la note de l'utilisateur au montage du composant
    useEffect(() => {
        fetchRatingStats()
        fetchUserRating()
    }, [cocktailId])

    const handleSubmit = async () => {
        if (isSubmitting) return

        setIsSubmitting(true)
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

            console.log('Submitting rating:', { cocktailId, userId: user.id, rating, comment })

            // Vérifier si l'utilisateur a déjà noté ce cocktail
            console.log('Checking for existing rating with:', { cocktailId, userId: user.id })
            const { data: existingRating, error: checkError } = await supabase
                .from('ratings')
                .select('id')
                .eq('cocktail_id', cocktailId)
                .eq('user_id', user.id)
                .single()

            if (checkError && checkError.code !== 'PGRST116') {
                console.error('Error checking existing rating:', checkError)
                throw new Error(`Erreur lors de la vérification: ${checkError.message}`)
            }

            if (existingRating) {
                // Mettre à jour la note existante
                const { error: updateError } = await supabase
                    .from('ratings')
                    .update({
                        rating,
                        comment,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', existingRating.id)

                if (updateError) {
                    console.error('Error updating rating:', updateError)
                    throw new Error(`Erreur lors de la mise à jour: ${updateError.message}`)
                }
            } else {
                // Créer une nouvelle note
                const { error: insertError } = await supabase
                    .from('ratings')
                    .insert({
                        cocktail_id: cocktailId,
                        user_id: user.id,
                        rating,
                        comment
                    })

                if (insertError) {
                    console.error('Error inserting rating:', insertError)
                    throw new Error(`Erreur lors de l'ajout: ${insertError.message}`)
                }
            }

            // Mettre à jour les statistiques après l'ajout/modification d'une note
            await fetchRatingStats()
            router.refresh()
        } catch (error) {
            console.error('Error submitting rating:', error)
            setError(error instanceof Error ? error.message : 'Une erreur est survenue')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        className={`p-1 rounded-full transition-colors ${star <= (hover || rating)
                            ? 'text-yellow-400 hover:text-yellow-500'
                            : 'text-gray-300 hover:text-gray-400'
                            }`}
                        title={`${star} étoile${star > 1 ? 's' : ''}`}
                    >
                        <FiStar className="w-6 h-6" />
                    </button>
                ))}
            </div>

            {stats.totalRatings > 0 && (
                <div className="text-sm text-gray-600">
                    Note moyenne : {stats.averageRating.toFixed(1)}/5 ({stats.totalRatings} avis)
                </div>
            )}

            <div className="space-y-2">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                    Commentaire (optionnel)
                </label>
                <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Partagez votre expérience avec ce cocktail..."
                />
            </div>

            <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || rating === 0}
                className={`w-full px-4 py-2 text-sm font-medium text-white rounded-md ${isSubmitting || rating === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                    }`}
            >
                {isSubmitting ? 'Envoi en cours...' : rating ? 'Modifier ma note' : 'Envoyer ma note'}
            </button>

            {error && (
                <div className="text-sm text-red-600">
                    {error}
                </div>
            )}
        </div>
    )
}