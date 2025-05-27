import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import CocktailDetails from '@/components/CocktailDetails'

export default async function CocktailPage({ params }: { params: { id: string } }) {
    const supabase = createServerComponentClient({ cookies })

    try {
        // Vérifier l'authentification
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError) {
            console.error('Auth error:', authError)
            throw authError
        }

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
                created_at,
                countries:country_id (
                    id,
                    name,
                    code
                ),
                profiles!cocktails_user_id_fkey (
                    id,
                    username
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

        // S'assurer que les données sont sérialisables
        const serializedCocktail = {
            ...cocktail,
            created_at: cocktail.created_at?.toISOString(),
            countries: cocktail.countries ? {
                id: cocktail.countries.id,
                name: cocktail.countries.name,
                code: cocktail.countries.code
            } : null,
            profiles: cocktail.profiles ? {
                id: cocktail.profiles.id,
                username: cocktail.profiles.username
            } : null
        }

        return <CocktailDetails cocktail={serializedCocktail} />
    } catch (error) {
        console.error('Unexpected error:', error)
        notFou