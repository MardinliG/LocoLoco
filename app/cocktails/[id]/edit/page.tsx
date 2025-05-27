import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import CocktailForm from '@/components/CocktailForm'

export default async function EditCocktailPage({ params }: { params: { id: string } }) {
    const supabase = createServerComponentClient({ cookies })

    // Vérifier si l'utilisateur est connecté et est admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (!profile || profile.role !== 'admin') {
        redirect('/cocktails')
    }

    // Récupérer les données du cocktail
    const { data: cocktail, error } = await supabase
        .from('cocktails')
        .select(`
            id,
            name,
            description,
            ingredients,
            instructions,
            image_url,
            country_id
        `)
        .eq('id', params.id)
        .single()

    if (error || !cocktail) {
        console.error('Error fetching cocktail:', error)
        notFound()
    }

    // Récupérer la liste des pays
    const { data: countries } = await supabase
        .from('countries')
        .select('id, name')
        .order('name')

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Modifier le cocktail
            </h1>

            <CocktailForm
                mode="edit"
                initialData={cocktail}
                countries={countries || []}
            />
        </div>
    )
} 