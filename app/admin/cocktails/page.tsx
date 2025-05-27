import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminCocktailsList from '@/components/admin/AdminCocktailsList'

export default async function AdminCocktailsPage() {
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

    // Récupérer les cocktails avec les informations des pays
    const { data: cocktails } = await supabase
        .from('cocktails')
        .select(`
            *,
            countries (
                id,
                name,
                code
            ),
            profiles (
                username
            )
        `)
        .order('created_at', { ascending: false })

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Gestion des Cocktails</h1>
                <a
                    href="/admin/cocktails/new"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Ajouter un cocktail
                </a>
            </div>

            <AdminCocktailsList cocktails={cocktails || []} />
        </div>
    )
} 