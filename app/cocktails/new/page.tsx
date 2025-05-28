import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import CocktailForm from '@/components/CocktailForm'


export default async function NewCocktailPage() {
    const supabase = createServerComponentClient({ cookies })

    // Vérifier si l'utilisateur est connecté
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    // Récupérer la liste des pays
    const { data: countries } = await supabase
        .from('countries')
        .select('id, name, code')
        .order('name')

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Nouveau cocktail</h1>
            <CocktailForm countries={countries || []} />
        </div>
    )
} 