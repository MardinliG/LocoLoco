'use client'

import { useEffect, useState } from 'react'
import { useSupabase } from '@/lib/supabase-provider'
import { supabase } from '@/lib/supabase'

type QuizResult = {
    id: string
    score: number
    total_questions: number
    correct_answers: number
    time_taken: number
    created_at: string
}

export default function QuizHistory({ history: initialHistory }: { history: QuizResult[] }) {
    const { session } = useSupabase()
    const [history, setHistory] = useState<QuizResult[]>(initialHistory)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (session?.user) {
            loadQuizHistory()
        }
    }, [session])

    const loadQuizHistory = async () => {
        try {
            setIsLoading(true)
            const { data, error } = await supabase
                .from('quiz_results')
                .select('*')
                .eq('user_id', session?.user.id)
                .order('created_at', { ascending: false })
                .limit(5)

            if (error) {
                console.error('Error loading quiz history:', error)
                return
            }

            if (data) {
                setHistory(data)
            }
        } catch (error) {
            console.error('Error loading quiz history:', error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            </div>
        )
    }

    if (history.length === 0) {
        return (
            <div className="text-center py-4">
                <p className="text-gray-600">Vous n'avez pas encore participé à des quiz</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {history.map((result) => (
                <div
                    key={result.id}
                    className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                >
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <p className="text-sm text-gray-600">
                                {new Date(result.created_at).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-600">
                                {new Date(result.created_at).toLocaleTimeString()}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-semibold text-blue-600">
                                {result.score} points
                            </p>
                            <p className="text-sm text-gray-600">
                                {result.correct_answers} / {result.total_questions} réponses correctes
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-600">
                        <p>Temps : {result.time_taken} secondes</p>
                        <p>
                            Score moyen :{' '}
                            {((result.score / result.total_questions) * 10).toFixed(1)}/10
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
} 