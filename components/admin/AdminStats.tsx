'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
} from 'chart.js'
import { Bar, Pie, Line } from 'react-chartjs-2'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
)

type Stats = {
    totalUsers: number
    totalCocktails: number
    totalCountries: number
    totalQuizResults: number
    cocktailsByCountry: { country: string; count: number }[]
    quizResultsByDay: { date: string; count: number }[]
    userActivity: { date: string; newUsers: number; newCocktails: number }[]
}

type CocktailByCountry = {
    countries: { name: string }[]
    count: number
}

type QuizResultByDay = {
    created_at: string
    count: number
}

type UserActivity = {
    created_at: string
    cocktails: { count: number }[]
}

interface AdminStatsProps {
    initialStats: Stats
}

export default function AdminStats({ initialStats }: AdminStatsProps) {
    const [stats, setStats] = useState<Stats>(initialStats)
    const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month')
    const [isLoading, setIsLoading] = useState(false)

    const fetchStats = async () => {
        setIsLoading(true)
        try {
            // Récupérer les statistiques mises à jour
            const { data: cocktailsByCountry, error: cocktailsError } = await supabase
                .from('cocktails')
                .select('countries(name)')

            if (cocktailsError) throw cocktailsError

            // Grouper les cocktails par pays
            const groupedCocktails = cocktailsByCountry?.reduce((acc, item) => {
                const countryName = item.countries[0].name
                acc[countryName] = (acc[countryName] || 0) + 1
                return acc
            }, {} as Record<string, number>)

            const cocktailsByCountryData = Object.entries(groupedCocktails || {}).map(([country, count]) => ({
                country,
                count
            })).sort((a, b) => b.count - a.count)

            const { data: quizResults, error: quizError } = await supabase
                .from('quiz_results')
                .select('created_at')
                .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

            if (quizError) throw quizError

            // Grouper les résultats de quiz par jour
            const groupedQuizResults = quizResults?.reduce((acc, item) => {
                const date = new Date(item.created_at).toLocaleDateString()
                acc[date] = (acc[date] || 0) + 1
                return acc
            }, {} as Record<string, number>)

            const quizResultsByDay = Object.entries(groupedQuizResults || {}).map(([date, count]) => ({
                date,
                count
            })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

            const { data: userActivity, error: userError } = await supabase
                .from('profiles')
                .select('created_at, cocktails(count)')
                .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
                .order('created_at')

            if (userError) throw userError

            setStats({
                ...stats,
                cocktailsByCountry: cocktailsByCountryData,
                quizResultsByDay,
                userActivity: userActivity?.map(item => ({
                    date: new Date(item.created_at).toLocaleDateString(),
                    newUsers: 1,
                    newCocktails: item.cocktails?.[0]?.count || 0
                })) || []
            })
        } catch (error) {
            console.error('Error fetching stats:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchStats()
    }, [timeRange])

    const cocktailsByCountryData = {
        labels: stats.cocktailsByCountry.map(item => item.country),
        datasets: [
            {
                label: 'Nombre de cocktails',
                data: stats.cocktailsByCountry.map(item => item.count),
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1
            }
        ]
    }

    const quizResultsData = {
        labels: stats.quizResultsByDay.map(item => item.date),
        datasets: [
            {
                label: 'Quiz joués',
                data: stats.quizResultsByDay.map(item => item.count),
                borderColor: 'rgb(16, 185, 129)',
                backgroundColor: 'rgba(16, 185, 129, 0.5)',
                tension: 0.4
            }
        ]
    }

    const userActivityData = {
        labels: stats.userActivity.map(item => item.date),
        datasets: [
            {
                label: 'Nouveaux utilisateurs',
                data: stats.userActivity.map(item => item.newUsers),
                borderColor: 'rgb(245, 158, 11)',
                backgroundColor: 'rgba(245, 158, 11, 0.5)',
                tension: 0.4
            },
            {
                label: 'Nouveaux cocktails',
                data: stats.userActivity.map(item => item.newCocktails),
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.5)',
                tension: 0.4
            }
        ]
    }

    return (
        <div className="space-y-8">
            {/* Filtres */}
            <div className="flex justify-end">
                <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value as 'week' | 'month' | 'year')}
                    className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                    <option value="week">7 derniers jours</option>
                    <option value="month">30 derniers jours</option>
                    <option value="year">12 derniers mois</option>
                </select>
            </div>

            {/* Statistiques générales */}
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

            {/* Graphiques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-600 mb-4">Cocktails par pays</h3>
                    <div className="h-80">
                        <Bar
                            data={cocktailsByCountryData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'top' as const
                                    }
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-600 mb-4">Quiz joués</h3>
                    <div className="h-80">
                        <Line
                            data={quizResultsData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'top' as const
                                    }
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 lg:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-600 mb-4">Activité des utilisateurs</h3>
                    <div className="h-80">
                        <Line
                            data={userActivityData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'top' as const
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
} 