import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import ProfileForm from "@/components/ProfileForm"
import QuizHistory from "@/components/QuizHistory"
import FavoritesList from "@/components/FavoritesList"
import UserLevelCard from "@/components/UserLevelCard"
import LevelSystemTable from "@/components/LevelSystemTable"
import UserStats from "@/components/UserStats"
import { calculateTotalPoints } from "@/lib/levelSystem"

export default async function ProfilePage() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Récupérer le profil utilisateur
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  // Récupérer l'historique des quiz (limité pour l'affichage)
  const { data: quizHistory } = await supabase
    .from("quiz_results")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  // Récupérer TOUS les quiz pour calculer les points totaux
  const { data: allQuizResults } = await supabase.from("quiz_results").select("score").eq("user_id", session.user.id)

  // Calculer les points totaux
  const totalPoints = calculateTotalPoints(allQuizResults || [])

  // Récupérer les favoris
  const { data: favorites } = await supabase
    .from("favorites")
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
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-mexican-gradient mb-4">Mon Profil</h1>
          <p className="text-lg text-gray-600">Gérez votre profil et suivez vos progrès</p>
        </div>

        <div className="space-y-8">
          {/* Informations du profil */}
          <ProfileForm profile={profile} />

          {/* Niveau et Progression */}
          <UserLevelCard totalPoints={totalPoints} />

          {/* Historique des quiz et Favoris */}
          <div className="grid lg:grid-cols-2 gap-8">
            <QuizHistory history={quizHistory || []} />
            <FavoritesList favorites={favorites || []} />
          </div>

          {/* Statistiques rapides */}
          <UserStats
            favoritesCount={favorites?.length || 0}
            quizCount={quizHistory?.length || 0}
            memberSince={profile?.created_at || null}
            totalPoints={totalPoints}
          />

          {/* Tableau des niveaux */}
          <LevelSystemTable totalPoints={totalPoints} />
        </div>
      </div>
    </div>
  )
}
