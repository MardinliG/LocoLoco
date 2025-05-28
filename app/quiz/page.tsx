import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Settings, Trophy, Target, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Quiz from "@/components/Quiz"

export default async function QuizPage() {
  const supabase = createServerComponentClient({ cookies })

  // Vérifier si l'utilisateur est connecté
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/login")
  }

  // Vérifier si l'utilisateur est admin
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  const isAdmin = profile?.role === "admin"

  // Récupérer les statistiques du quiz
  const { data: quizStats } = await supabase
    .from("quiz_results")
    .select("score, total_questions")
    .eq("user_id", user.id)

  const totalQuizzes = quizStats?.length || 0
  const averageScore = quizStats?.length
    ? Math.round((quizStats.reduce((sum, quiz) => sum + quiz.score, 0) / quizStats.length) * 10) / 10
    : 0
  const bestScore = quizStats?.length ? Math.max(...quizStats.map((quiz) => quiz.score)) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header avec statistiques */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="text-4xl">🎯</div>
            <h1 className="text-4xl font-bold text-gray-900">Quiz des Cocktails</h1>
            <div className="text-4xl">🍹</div>
          </div>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Testez vos connaissances sur les cocktails du monde entier ! Vous avez 30 secondes pour répondre à 5
            questions aléatoires.
          </p>

          {/* Statistiques utilisateur */}
          {totalQuizzes > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-orange-100">
                <div className="text-3xl mb-2">🏆</div>
                <div className="text-2xl font-bold text-orange-600">{totalQuizzes}</div>
                <p className="text-sm text-gray-600">Quiz réalisés</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-yellow-100">
                <div className="text-3xl mb-2">⭐</div>
                <div className="text-2xl font-bold text-yellow-600">{averageScore}</div>
                <p className="text-sm text-gray-600">Score moyen</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-red-100">
                <div className="text-3xl mb-2">🔥</div>
                <div className="text-2xl font-bold text-red-600">{bestScore}</div>
                <p className="text-sm text-gray-600">Meilleur score</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {isAdmin && (
              <Link href="/admin/questions">
                <Button variant="outline" size="lg" className="border-orange-300 text-orange-600 hover:bg-orange-50">
                  <Settings className="mr-2 h-5 w-5" />
                  Gérer les questions
                </Button>
              </Link>
            )}
            <div className="flex gap-2">
              <Badge variant="outline" className="px-3 py-1">
                <Clock className="h-3 w-3 mr-1" />
                30s par question
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                <Target className="h-3 w-3 mr-1" />5 questions
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                <Trophy className="h-3 w-3 mr-1" />
                Points bonus
              </Badge>
            </div>
          </div>
        </div>

        {/* Composant Quiz */}
        <Quiz />
      </div>
    </div>
  )
}
