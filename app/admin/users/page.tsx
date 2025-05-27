import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminUsersList from '@/components/admin/AdminUsersList'

export default async function AdminUsersPage() {
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

    // Récupérer les utilisateurs avec leurs statistiques
    const { data: users } = await supabase
        .from('profiles')
        .select(`
            *,
            cocktails:cocktails(count),
            favorites:favorites(count),
            quiz_results:quiz_results(count)
        `)
        .order('created_at', { ascending: false })

    // Transformer les données pour inclure les statistiques
    const usersWithStats = users?.map(user => ({
        ...user,
        cocktails_count: user.cocktails?.[0]?.count || 0,
        favorites_count: user.favorites?.[0]?.count || 0,
        quiz_results_count: user.quiz_results?.[0]?.count || 0
    })) || []

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Gestion des Utilisateurs</h1>
            </div>

            <AdminUsersList users={usersWithStats} />
        </div>
    )
} 