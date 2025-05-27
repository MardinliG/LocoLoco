'use client'

import Link from 'next/link'
import { FiArrowLeft } from 'react-icons/fi'

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
                </div>
            </div>
        </div>
    )
} 