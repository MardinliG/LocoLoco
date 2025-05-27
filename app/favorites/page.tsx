import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft } from 'react-icons/fi'

export default async function FavoritesPage() {
    const supabase = createServerComponentClient({ cookies })

    // Vérifier si l'utilisateur est connecté
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    // Récupérer les favoris avec les détails des cocktails
    const { data: favorites, error } = await supabase
        .from('favorites')
        .select(`
            id,
            created_at,
            cocktails:cocktail_id (
                id,
                name,
                description,
                image_url,
                countries:country_id (
                    id,
                    name,
                    code
                )
            )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching favorites:', error)
        throw error
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Mes Favoris</h1>
                <Link
                    href="/cocktails"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800"
                >
                    <FiArrowLeft className="mr-2" />
                    Retour aux cocktails
                </Link>
            </div>

            {favorites && favorites.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((favorite) => (
                        <Link
                            key={favorite.id}
                            href={`/cocktails/${favorite.cocktails.id}`}
                            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                        >
                            {favorite.cocktails.image_url && (
                                <div className="w-full h-48 relative">
                                    <img
                                        src={favorite.cocktails.image_url}
                                        alt={favorite.cocktails.name}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                            )}
                            <div className="p-4">
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                    {favorite.cocktails.name}
                                </h2>
                                {favorite.cocktails.description && (
                                    <p className="text-gray-600 line-clamp-2">
                                        {favorite.cocktails.description}
                                    </p>
                                )}
                                {favorite.cocktails.countries && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                                        {favorite.cocktails.countries.name}
                                    </span>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-600 mb-4">Vous n'avez pas encore de favoris</p>
                    <Link
                        href="/cocktails"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800"
                    >
                        Découvrir des cocktails
                    </Link>
                </div>
            )}
        </div>
    )
} 