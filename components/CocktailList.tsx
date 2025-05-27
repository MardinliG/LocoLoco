'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import { FiPlus } from 'react-icons/fi'

type Cocktail = {
    id: string
    name: string
    description: string | null
    image_url: string | null
    countries: {
        name: string
    } | null
}

export default function CocktailList({ cocktails }: { cocktails: Cocktail[] }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const supabase = createClientComponentClient()

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setIsAuthenticated(!!user)
        }

        checkAuth()

        // S'abonner aux changements d'authentification
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setIsAuthenticated(!!session?.user)
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Cocktails</h1>
                {isAuthenticated && (
                    <Link
                        href="/cocktails/new"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <FiPlus className="mr-2" />
                        Nouveau cocktail
                    </Link>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cocktails.map((cocktail) => (
                    <Link
                        key={cocktail.id}
                        href={`/cocktails/${cocktail.id}`}
                        className="block bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                    >
                        <div className="aspect-w-16 aspect-h-9">
                            {cocktail.image_url ? (
                                <img
                                    src={cocktail.image_url}
                                    alt={cocktail.name}
                                    className="w-full h-48 object-cover"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-400">Pas d'image</span>
                                </div>
                            )}
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start">
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                    {cocktail.name}
                                </h2>
                                {cocktail.countries && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {cocktail.countries.name}
                                    </span>
                                )}
                            </div>
                            {cocktail.description && (
                                <p className="text-gray-600 line-clamp-2">
                                    {cocktail.description}
                                </p>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
} 