import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import CocktailList from '@/components/CocktailList'

export default async function CocktailsPage() {
    const supabase = createServerComponentClient({ cookies })

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

    return <CocktailList cocktails={cocktails || []} />
} 