'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiEdit2, FiTrash2, FiHeart, FiMessageSquare } from 'react-icons/fi'
import { useSupabase } from '@/lib/supabase-provider'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

type Cocktail = {
    id: string
    name: string
    description: string | null
    ingredients: string[] | null
    instructions: string | null
    image_url?: string | null
    countries?: {
        id: string
        name: string
        code: string
    } | null
    profiles?: {
        id: string
        username: string
    } | null
}

type Comment = {
    id: string
    content: string
    created_at: string
    user_id: string
    cocktail_id: string
    profiles: {
        username: string
    }
}

export default function CocktailDetails({ cocktail, comments: initialComments = [] }: { cocktail: Cocktail, comments?: Comment[] }) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const [isOwner, setIsOwner] = useState(false)
    const [isFavorite, setIsFavorite] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [comment, setComment] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [comments, setComments] = useState<Comment[]>(initialComments || [])
    const supabase = createClientComponentClient()
    const router = useRouter()
    const { session } = useSupabase()

    useEffect(() => {
        const checkUserStatus = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                setIsAdmin(false)
                setIsOwner(false)
                return
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single()

            setIsAdmin(profile?.role === 'admin')
            setIsOwner(cocktail.profiles?.id === user.id)
        }

        checkUserStatus()
    }, [cocktail.profiles?.id])

    const handleDelete = async () => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce cocktail ?')) {
            return
        }

        setIsDeleting(true)
        setError(null)

        try {
            const { error: deleteError } = await supabase
                .from('cocktails')
                .delete()
                .eq('id', cocktail.id)

            if (deleteError) {
                throw deleteError
            }

            router.push('/cocktails')
            router.refresh()
        } catch (error) {
            console.error('Error deleting cocktail:', error)
            setError('Erreur lors de la suppression du cocktail')
        } finally {
            setIsDeleting(false)
        }
    }

    const toggleFavorite = async () => {
        if (!session) {
            toast.error('Vous devez être connecté pour ajouter aux favoris')
            return
        }

        setIsLoading(true)

        try {
            if (isFavorite) {
                const { error } = await supabase
                    .from('favorites')
                    .delete()
                    .eq('cocktail_id', cocktail.id)
                    .eq('user_id', session.user.id)

                if (error) throw error
                setIsFavorite(false)
                toast.success('Cocktail retiré des favoris')
            } else {
                const { error } = await supabase
                    .from('favorites')
                    .insert([
                        {
                            cocktail_id: cocktail.id,
                            user_id: session.user.id
                        }
                    ])

                if (error) throw error
                setIsFavorite(true)
                toast.success('Cocktail ajouté aux favoris')
            }
        } catch (error) {
            console.error('Error toggling favorite:', error)
            toast.error('Erreur lors de la modification des favoris')
        } finally {
            setIsLoading(false)
        }
    }

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!session) {
            toast.error('Vous devez être connecté pour commenter')
            return
        }

        if (!comment.trim()) {
            toast.error('Le commentaire ne peut pas être vide')
            return
        }

        setIsSubmitting(true)

        try {
            const { data, error } = await supabase
                .from('comments')
                .insert([
                    {
                        content: comment.trim(),
                        cocktail_id: cocktail.id,
                        user_id: session.user.id
                    }
                ])
                .select(`
                    id,
                    content,
                    created_at,
                    user_id,
                    cocktail_id,
                    profiles:user_id (
                        username
                    )
                `)
                .single()

            if (error) throw error

            // Créer un nouveau commentaire avec le bon format
            const newComment: Comment = {
                id: data.id,
                content: data.content,
                created_at: data.created_at,
                user_id: data.user_id,
                cocktail_id: data.cocktail_id,
                profiles: {
                    username: data.profiles.username
                }
            }

            // Ajouter le nouveau commentaire au début de la liste
            setComments(prevComments => [newComment, ...prevComments])
            setComment('')
            toast.success('Commentaire ajouté')
        } catch (error) {
            console.error('Error adding comment:', error)
            toast.error('Erreur lors de l\'ajout du commentaire')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!cocktail) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center">
                    <p className="text-gray-600">Cocktail non trouvé</p>
                    <Link
                        href="/cocktails"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 mt-4"
                    >
                        <FiArrowLeft className="mr-2" />
                        Retour aux cocktails
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link
                href="/cocktails"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
            >
                <FiArrowLeft className="mr-2" />
                Retour aux cocktails
            </Link>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {cocktail.image_url && (
                    <div className="w-full h-96 relative">
                        <img
                            src={cocktail.image_url}
                            alt={cocktail.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    </div>
                )}

                <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                        <h1 className="text-3xl font-bold text-gray-900">{cocktail.name}</h1>
                        {cocktail.countries && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                {cocktail.countries.name}
                            </span>
                        )}
                    </div>

                    {cocktail.description && (
                        <p className="text-gray-600 mb-6">{cocktail.description}</p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {cocktail.ingredients && cocktail.ingredients.length > 0 && (
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-3">Ingrédients</h2>
                                <ul className="space-y-2">
                                    {cocktail.ingredients.map((ingredient, index) => (
                                        <li key={index} className="flex items-center">
                                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                            {ingredient}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {cocktail.instructions && (
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-3">Instructions</h2>
                                <div className="prose prose-blue">
                                    <p className="whitespace-pre-line">{cocktail.instructions}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {cocktail.profiles && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <p className="text-sm text-gray-500">
                                Créé par {cocktail.profiles.username}
                            </p>
                        </div>
                    )}

                    {(isAdmin || isOwner) && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                        {isAdmin ? 'Actions administrateur' : 'Actions'}
                                    </h2>
                                </div>
                                <div className="flex space-x-2">
                                    <Link
                                        href={`/cocktails/${cocktail.id}/edit`}
                                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        <FiEdit2 className="mr-2" />
                                        Modifier
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                    >
                                        <FiTrash2 className="mr-2" />
                                        {isDeleting ? 'Suppression...' : 'Supprimer'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                    <FiHeart className="mr-2" />
                                    {isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                                </h2>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={toggleFavorite}
                                    disabled={isLoading}
                                    className={`p-2 rounded-full ${isFavorite
                                        ? 'text-red-600 hover:text-red-700'
                                        : 'text-gray-400 hover:text-gray-500'
                                        }`}
                                >
                                    <FiHeart className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                            <FiMessageSquare className="mr-2" />
                            Commentaires
                        </h2>

                        {session ? (
                            <form onSubmit={handleCommentSubmit} className="mb-8">
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Partagez votre avis sur ce cocktail..."
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    rows={3}
                                    disabled={isSubmitting}
                                />
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Envoi...' : 'Publier'}
                                </button>
                            </form>
                        ) : (
                            <p className="text-gray-600 mb-8">
                                Connectez-vous pour laisser un commentaire
                            </p>
                        )}

                        <div className="space-y-6">
                            {comments && comments.length > 0 ? (
                                comments.map((comment) => (
                                    <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-medium text-gray-900">
                                                {comment.profiles.username}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {new Date(comment.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-gray-600">{comment.content}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-600 text-center py-4">
                                    Aucun commentaire pour le moment. Soyez le premier à commenter !
                                </p>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="mt-4 text-sm text-red-600">
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
} 