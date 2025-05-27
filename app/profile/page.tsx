import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import ProfileForm from '@/components/ProfileForm'
import QuizHistory from '@/components/QuizHistory'
import FavoritesList from '@/components/FavoritesList'

export default async function ProfilePage() {
    const supabase = createServerComponentClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        redirect('/login')
    }

    // Récupérer le profil utilisateur
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

    // Récupérer l'historique des quiz
    const { data: quizHistory } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(5)

    // Récupérer les favoris
    const { data: favorites } = await supabase
        .from('favorites')
        .select(`
            *,
            cocktails (
                id,
                name,
                description,
                ingredients,
                instructions,
                country_id,
                countries (
                    id,
                    name,
                    code
                )
            )
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(5)

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Mon Profil</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Informations du profil */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
                    <ProfileForm profile={profile} />
                </div>

                {/* Historique des quiz */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Historique des quiz</h2>
                    <QuizHistory history={quizHistory || []} />
                </div>

                {/* Favoris */}
                <div className="bg-white rounded-lg shadow-lg p-6 md:col-span-2">
                    <h2 className="text-xl font-semibold mb-4">Mes cocktails favoris</h2>
                    <FavoritesList favorites={favorites || []} />
                </div>
            </div>
        </div>
    )
} 