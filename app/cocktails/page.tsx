import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import CocktailList from "@/components/CocktailList"

export default async function CocktailsPage() {
  const supabase = createServerComponentClient({ cookies })

  const { data: cocktails, error } = await supabase
    .from("cocktails")
    .select(`
      *,
      countries (
        name,
        code
      ),
      ratings (
        rating
      )
    `)
    .order("name")

  if (error) {
    console.error("Error fetching cocktails:", error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">😵</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Oups ! Une erreur est survenue</h2>
          <p className="text-lg text-gray-600 mb-8">Impossible de charger les cocktails pour le moment.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  return <CocktailList cocktails={cocktails || []} />
}
