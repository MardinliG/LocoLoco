'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Stats = {
    totalUsers: number
    totalCocktails: number
    totalCountries: number
    totalQuizResults: number
}

type QuizResult = {
    id: string
    score: number
    total_questions: number
    correct_answers: number
    time_taken: number
    created_at: string
    profiles: {
        username: string
    }
}

type Cocktail = {
    id: string
    name: string
    description: string
    created_at: string
    countries: {
        name: string
    }
}

interface AdminDashboardProps {
    stats: Stats
    recentQuizResults: QuizResult[]
    recentCocktails: Cocktail[]
}

export default function AdminDashboard({ stats, recentQuizResults, recentCocktails }: AdminDashboardProps) {
    const router = useRouter()

    return (
        <div className="space-y-8">
            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Utilisateurs</h3>
                    <p className="text-3xl font-bold">{stats.totalUsers}</p>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Cocktails</h3>
                    <p className="text-3xl font-bold">{stats.totalCocktails}</p>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Pays</h3>
                    <p className="text-3xl font-bold">{stats.totalCountries}</p>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Quiz joués</h3>
                    <p className="text-3xl font-bold">{stats.totalQuizResults}</p>
                </div>
            </div>

            {/* Actions rapides */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button
                    onClick={() => router.push('/admin/cocktails')}
                    className="bg-blue-600 text-white rounded-lg p-4 hover:bg-blue-700 transition-colors"
                >
                    Gérer les Cocktails
                </button>
                <button
                    onClick={() => router.push('/admin/countries')}
                    className="bg-blue-600 text-white rounded-lg p-4 hover:bg-blue-700 transition-colors"
                >
                    Gérer les Pays
                </button>
                <button
                    onClick={() => router.push('/admin/users')}
                    className="bg-blue-600 text-white rounded-lg p-4 hover:bg-blue-700 transition-colors"
                >
                    Gérer les Utilisateurs
                </button>
            </div>

            {/* Activités récentes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quiz récents */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Quiz Récents</h2>
                    <div className="space-y-4">
                        {recentQuizResults.map((result) => (
                            <div
                                key={result.id}
                                className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-medium">{result.profiles.username}</p>
                                        <p className="text-sm text-gray-600">
                                            {result.correct_answers} / {result.total_questions} réponses correctes
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-semibold text-blue-600">
                                            {result.score} points
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {new Date(result.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cocktails récents */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Cocktails Récents</h2>
                    <div className="space-y-4">
                        {recentCocktails.map((cocktail) => (
                            <div
                                key={cocktail.id}
                                className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-medium">{cocktail.name}</h3>
                                        <p className="text-sm text-gray-600">{cocktail.countries.name}</p>
                                        <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                                            {cocktail.description}
                                        </p>
                                    </div>
                                    <Link
                                        href={`/admin/cocktails/${cocktail.id}`}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        Modifier
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
} 