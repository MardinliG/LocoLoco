import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { FiPlus } from 'react-icons/fi'
import { redirect } from 'next/navigation'

export default async function CocktailsPage() {
    const supabase = createServerComponentClient({ cookies })

    // Vérifier si l'utilisateur est connecté et est admin
    const { data: { session } } = await supabase.auth.getSession()
    let isAdmin = false

    if (session) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single()

        isAdmin = profile?.role === 'admin'
    }

    const { data: cocktails, error } = await supabase
        .from('cocktails')
        .select(`
            *,
            countries (
                name,
                code
            )
        `)
        .order('name')

    if (error) {
        console.error('Error fetching cocktails:', error)
        return <div>Une erreur est survenue lors du chargement des cocktails.</div>
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Cocktails</h1>
                {isAdmin && (
                    <Link
                        href="/cocktails/new"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                        Nouveau cocktail
                    </Link>
                )}
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {cocktails?.map((cocktail) => (
                    <Link
                        key={cocktail.id}
                        href={`/cocktails/${cocktail.id}`}
                        className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200"
                    >
                        <div className="p-6">
                            {cocktail.image_url && (
                                <div className="mb-4 aspect-w-16 aspect-h-9">
                                    <img
                                        src={cocktail.image_url}
                                        alt={cocktail.name}
                                        className="object-cover rounded-lg w-full h-48"
                                    />
                                </div>
                            )}
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-900">{cocktail.name}</h2>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {cocktail.countries?.name || 'Pays inconnu'}
                                </span>
                            </div>
                            <p className="mt-2 text-gray-600 line-clamp-2">{cocktail.description || 'Aucune description disponible'}</p>
                            <div className="mt-4">
                                <h3 className="text-sm font-medium text-gray-900">Ingrédients :</h3>
                                <ul className="mt-1 text-sm text-gray-600">
                                    {Array.isArray(cocktail.ingredients) && cocktail.ingredients.length > 0 ? (
                                        <>
                                            {cocktail.ingredients.slice(0, 3).map((ingredient: string, index: number) => (
                                                <li key={index}>{ingredient}</li>
                                            ))}
                                            {cocktail.ingredients.length > 3 && (
                                                <li className="text-gray-500">+ {cocktail.ingredients.length - 3} autres...</li>
                                            )}
                                        </>
                                    ) : (
                                        <li className="text-gray-500">Aucun ingrédient listé</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
} 