import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminStats from '@/components/admin/AdminStats'

export default async function AdminStatsPage() {
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

    // Récupérer les statistiques initiales
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

    // Récupérer les cocktails par pays
    const { data: cocktailsByCountry } = await supabase
        .from('cocktails')
        .select('countries(name), count')
        .group('country_id, countries(name)')
        .order('count', { ascending: false })

    // Récupérer les résultats de quiz par jour
    const { data: quizResultsByDay } = await supabase
        .from('quiz_results')
        .select('created_at, count')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .group('created_at')
        .order('created_at')

    // Récupérer l'activité des utilisateurs
    const { data: userActivity } = await supabase
        .from('profiles')
        .select('created_at, cocktails(count)')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at')

    const initialStats = {
        totalUsers: totalUsers || 0,
        totalCocktails: totalCocktails || 0,
        totalCountries: totalCountries || 0,
        totalQuizResults: totalQuizResults || 0,
        cocktailsByCountry: cocktailsByCountry?.map(item => ({
            country: item.countries.name,
            count: item.count
        })) || [],
        quizResultsByDay: quizResultsByDay?.map(item => ({
            date: new Date(item.created_at).toLocaleDateString(),
            count: item.count
        })) || [],
        userActivity: userActivity?.map(item => ({
            date: new Date(item.created_at).toLocaleDateString(),
            newUsers: 1,
            newCocktails: item.cocktails?.[0]?.count || 0
        })) || []
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Statistiques</h1>
            <AdminStats initialStats={initialStats} />
        </div>
    )
} 