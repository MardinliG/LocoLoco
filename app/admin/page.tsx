import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminDashboard from '@/components/admin/AdminDashboard'

export default async function AdminPage() {
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

    // Récupérer les statistiques
    const [
        { count: totalUsers },
        { count: totalCocktails },
        { count: totalCountries },
        { count: totalQuizResults }
    ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('cocktails').select('*', { count: 'exact', head: true }),
        supabase.from('countries').select('*', { count: 'exact', head: true }),
        supabase.from('quiz_results').select('*', { count: 'exact', head: true })
    ])

    // Récupérer les dernières activités
    const { data: recentQuizResults } = await supabase
        .from('quiz_results')
        .select(`
            *,
            profiles (
                username
            )
        `)
        .order('created_at', { ascending: false })
        .limit(5)

    const { data: recentCocktails } = await supabase
        .from('cocktails')
        .select(`
            *,
            countries (
                name
            )
        `)
        .order('created_at', { ascending: false })
        .limit(5)

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Administration</h1>

            <AdminDashboard
                stats={{
                    totalUsers: totalUsers || 0,
                    totalCocktails: totalCocktails || 0,
                    totalCountries: totalCountries || 0,
                    totalQuizResults: totalQuizResults || 0
                }}
                recentQuizResults={recentQuizResults || []}
                recentCocktails={recentCocktails || []}
            />
        </div>
    )
} 