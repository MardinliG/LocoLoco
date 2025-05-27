'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiEdit2, FiTrash2 } from 'react-icons/fi'

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

export default function CocktailDetails({ cocktail }: { cocktail: Cocktail }) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const supabase = createClientComponentClient()
    const router = useRouter()

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

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                    Actions
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