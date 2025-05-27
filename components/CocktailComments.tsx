'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { FiUser } from 'react-icons/fi'

type Comment = {
    id: string
    rating: number
    comment: string
    created_at: string
    profiles: {
        username: string
    }
}

type CocktailCommentsProps = {
    cocktailId: string
}

export default function CocktailComments({ cocktailId }: CocktailCommentsProps) {
    const [comments, setComments] = useState<Comment[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const supabase = createClientComponentClient()

    useEffect(() => {
        const fetchComments = async () => {
            try {
                // D'abord, récupérer les notes avec les commentaires
                const { data: ratingsData, error: ratingsError } = await supabase
                    .from('ratings')
                    .select(`
                        id,
                        rating,
                        comment,
                        created_at,
                        user_id
                    `)
                    .eq('cocktail_id', cocktailId)
                    .order('created_at', { ascending: false })

                if (ratingsError) {
                    throw ratingsError
                }

                if (!ratingsData) {
                    setComments([])
                    return
                }

                // Ensuite, récupérer les usernames pour chaque user_id
                const userIds = ratingsData.map(rating => rating.user_id)
                const { data: profilesData, error: profilesError } = await supabase
                    .from('profiles')
                    .select('id, username')
                    .in('id', userIds)

                if (profilesError) {
                    throw profilesError
                }

                // Combiner les données
                const commentsWithProfiles = ratingsData.map(rating => ({
                    ...rating,
                    profiles: profilesData?.find(profile => profile.id === rating.user_id) || { username: 'Utilisateur anonyme' }
                }))

                setComments(commentsWithProfiles)
            } catch (error) {
                console.error('Error fetching comments:', error)
                setError('Erreur lors du chargement des commentaires')
            } finally {
                setIsLoading(false)
            }
        }

        fetchComments()
    }, [cocktailId])

    if (isLoading) {
        return <div className="text-gray-600">Chargement des commentaires...</div>
    }

    if (error) {
        return <div className="text-red-600">{error}</div>
    }

    if (comments.length === 0) {
        return <div className="text-gray-600">Aucun commentaire pour le moment</div>
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Commentaires</h3>
            <div className="space-y-4">
                {comments.map((comment) => (
                    <div key={comment.id} className="bg-white rounded-lg shadow p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                                <FiUser className="w-5 h-5 text-gray-400" />
                                <span className="font-medium text-gray-900">
                                    {comment.profiles?.username || 'Utilisateur anonyme'}
                                </span>
                            </div>
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <span
                                        key={i}
                                        className={`text-lg ${i < comment.rating ? 'text-yellow-400' : 'text-gray-300'
                                            }`}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                        </div>
                        {comment.comment && (
                            <p className="text-gray-700 mt-2">{comment.comment}</p>
                        )}
                        <div className="text-sm text-gray-500 mt-2">
                            {new Date(comment.created_at).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
} 