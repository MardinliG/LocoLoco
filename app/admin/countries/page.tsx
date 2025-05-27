import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminCountriesList from '@/components/admin/AdminCountriesList'

export default async function AdminCountriesPage() {
    const supabase = createServerComponentClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        redirect('/login')
    }

    // Vérifier si l'utilisateur est admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .single()

    if (!profile?.is_admin) {
        redirect('/')
    }

    // Récupérer les pays avec le nombre de cocktails
    const { data: countries } = await supabase
        .from('countries')
        .select(`
            *,
            cocktails:cocktails(count)
        `)
        .order('name')

    // Transformer les données pour inclure le nombre de cocktails
    const countriesWithCount = countries?.map(country => ({
        ...country,
        cocktails_count: country.cocktails?.[0]?.count || 0
    })) || []

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Gestion des Pays</h1>
                <a
                    href="/admin/countries/new"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Ajouter un pays
                </a>
            </div>

            <AdminCountriesList countries={countriesWithCount} />
        </div>
    )
} 