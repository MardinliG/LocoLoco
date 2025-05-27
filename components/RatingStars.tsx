'use client'

import { useState, useEffect } from 'react'
import { FiStar } from 'react-icons/fi'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

type RatingStarsProps = {
    cocktailId: string
    initialRating?: number
    averageRating?: number
    totalRatings?: number
}

export default function RatingStars({ cocktailId, initialRating = 0, averageRating = 0, totalRatings = 0 }: RatingStarsProps) {
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [stats, setStats] = useState({ averageRating, totalRatings })
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

            const total = data.length
            const average = total > 0
                ? data.reduce((acc, curr) => acc + curr.rating, 0) / total
                : 0

            setStats({
                averageRating: average,
                totalRatings: total
            })
        } catch (error) {
            console.error('Error fetching rating stats:', error)
        }
    }

    // Fonction pour récupérer la note de l'utilisateur connecté
    const fetchUserRating = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                setRating(0)
                setComment('')
                return
            }

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
            } else {
                setRating(0)
                setComment('')
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

    // Réinitialiser la note quand l'utilisateur change
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
                fetchUserRating()
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    const handleSubmit = async () => {
        if (isSubmitting) return

        setIsSubmitting(true)
        setError(null)
        setSuccess(null)

        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push('/login')
                return
            }

            // Vérifier si l'utilisateur a déjà noté ce cocktail
            const { data: existingRating } = await supabase
                .from('ratings')
                .select('id')
                .eq('cocktail_id', cocktailId)
                .eq('user_id', user.id)
                .single()

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

                if (updateError) throw updateError
                setSuccess('Votre note a été mise à jour avec succès !')
            } else {
                // Créer une nouvelle note
                const { error: insertError } = await supabase
                    .from('ratings')
                    .insert({
                        user_id: user.id,
                        cocktail_id: cocktailId,
                        rating,
                        comment
                    })

                if (insertError) throw insertError
                setSuccess('Votre note a été enregistrée avec succès !')
            }

            // Mettre à jour les statistiques
            await fetchRatingStats()
        } catch (error) {
            console.error('Error submitting rating:', error)
            setError('Erreur lors de l\'enregistrement de la note')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="focus:outline-none"
                    >
                        <FiStar
                            className={`w-8 h-8 ${star <= rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                                }`}
                        />
                    </button>
                ))}
            </div>

            <div className="text-center">
                <p className="text-sm text-gray-600">
                    Note moyenne : {stats.averageRating.toFixed(1)} ({stats.totalRatings} avis)
                </p>
            </div>

            <div>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Ajoutez un commentaire (optionnel)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                />
            </div>

            {error && (
                <div className="text-sm text-red-600">
                    {error}
                </div>
            )}

            {success && (
                <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
                    {success}
                </div>
            )}

            <div className="flex justify-center">
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting || rating === 0}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {isSubmitting
                        ? 'Enregistrement...'
                        : rating === 0
                            ? 'Sélectionnez une note'
                            : 'Envoyer ma note'}
                </button>
            </div>
        </div>
    )
}