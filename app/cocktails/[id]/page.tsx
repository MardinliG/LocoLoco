export const dynamic = 'force-dynamic'


import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import CocktailDetails from '@/components/CocktailDetails'
import FavoriteButton from '@/components/FavoriteButton'
import RatingStars from '@/components/RatingStars'
import CocktailComments from '@/components/CocktailComments'

export default async function CocktailPage({ params }: { params: { id: string } }) {
    const supabase = createServerComponentClient({ cookies })

    try {
        // Récupérer les données du cocktail avec les relations
        const { data: cocktail, error: cocktailError } = await supabase
            .from('cocktails')
            .select(`
                id,
                name,
                description,
                ingredients,
                instructions,
                image_url,
                country_id,
                user_id,
                created_at,
                countries:country_id (
                    id,
                    name,
                    code
                )
            `)
            .eq('id', params.id)
            .single()

        if (cocktailError) {
            console.error('Error fetching cocktail:', cocktailError)
            throw cocktailError
        }

        if (!cocktail) {
            console.log('No cocktail found with ID:', params.id)
            notFound()
        }

        // Récupérer les informations du profil
        let profile = null
        if (cocktail.user_id) {
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('id, username')
                .eq('id', cocktail.user_id)
                .single()

            if (!profileError && profileData) {
                profile = profileData
            }
        }

        // Récupérer la note de l'utilisateur connecté
        let userRating = 0
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            const { data: ratingData } = await supabase
                .from('cocktail_ratings')
                .select('rating')
                .eq('cocktail_id', params.id)
                .eq('user_id', user.id)
                .single()

            if (ratingData) {
                userRating = ratingData.rating
            }
        }

        // Récupérer la moyenne des notes et le nombre total de notes
        const { data: ratingStats } = await supabase
            .from('cocktail_ratings')
            .select('rating')
            .eq('cocktail_id', params.id)

        const averageRating = ratingStats?.length
            ? ratingStats.reduce((acc, curr) => acc + curr.rating, 0) / ratingStats.length
            : 0

        // Vérifier si le cocktail est dans les favoris de l'utilisateur
        let isFavorite = false
        if (user) {
            const { data: favoriteData } = await supabase
                .from('favorites')
                .select('id')
                .eq('cocktail_id', params.id)
                .eq('user_id', user.id)
                .single()

            isFavorite = !!favoriteData
        }

        // S'assurer que les données sont sérialisables
        const serializedCocktail = {
            ...cocktail,
            created_at: cocktail.created_at ? new Date(cocktail.created_at).toISOString() : null,
            countries: cocktail.countries?.[0] ? {
                id: cocktail.countries[0].id,
                name: cocktail.countries[0].name,
                code: cocktail.countries[0].code
            } : null,
            profiles: profile
        }

        return (
            <div className="space-y-8">
                <CocktailDetails cocktail={serializedCocktail} />

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
                        <div className="flex justify-center">
                            <FavoriteButton
                                cocktailId={params.id}
                                initialIsFavorite={isFavorite}
                            />
                        </div>

                        <div className="border-t border-gray-200 pt-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Donnez votre avis
                            </h2>
                            <RatingStars
                                cocktailId={params.id}
                                initialRating={userRating}
                                averageRating={averageRating}
                                totalRatings={ratingStats?.length || 0}
                            />
                        </div>

                        <div className="border-t border-gray-200 pt-6">
                            <CocktailComments cocktailId={params.id} />
                        </div>
                    </div>
                </div>
            </div>
        )
    } catch (error) {
        console.error('Unexpected error:', error)
        notFound()
    }
} 