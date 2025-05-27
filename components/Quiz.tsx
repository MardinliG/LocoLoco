'use client'

import { useState, useEffect } from 'react'
import { useSupabase } from '@/lib/supabase-provider'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

type Question = {
    id: string
    question: string
    options: string[]
    correct_answer: string
    points: number
}

type QuizResult = {
    score: number
    total_questions: number
    correct_answers: number
    time_taken: number
}

export default function Quiz() {
    const { session } = useSupabase()
    const [questions, setQuestions] = useState<Question[]>([])
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
    const [score, setScore] = useState(0)
    const [timeLeft, setTimeLeft] = useState(30)
    const [isQuizComplete, setIsQuizComplete] = useState(false)
    const [quizResult, setQuizResult] = useState<QuizResult | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [startTime, setStartTime] = useState<number | null>(null)

    useEffect(() => {
        loadQuestions()
    }, [])

    useEffect(() => {
        if (timeLeft > 0 && !isQuizComplete) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
            return () => clearTimeout(timer)
        } else if (timeLeft === 0 && !isQuizComplete) {
            handleNextQuestion()
        }
    }, [timeLeft, isQuizComplete])

    const loadQuestions = async () => {
        try {
            const { data, error } = await supabase
                .from('quiz_questions')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(10)

            if (error) throw error

            if (data) {
                setQuestions(data)
                setStartTime(Date.now())
            }
        } catch (error) {
            console.error('Error loading questions:', error)
            toast.error('Erreur lors du chargement des questions')
        } finally {
            setIsLoading(false)
        }
    }

    const handleAnswerSelect = (answer: string) => {
        setSelectedAnswer(answer)
    }

    const handleNextQuestion = async () => {
        if (selectedAnswer === questions[currentQuestion].correct_answer) {
            setScore(score + 1)
        }

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1)
            setSelectedAnswer(null)
            setTimeLeft(30)
        } else {
            const endTime = Date.now()
            const timeTaken = startTime ? Math.floor((endTime - startTime) / 1000) : 0
            const correctAnswers = score

            const result: QuizResult = {
                score,
                total_questions: questions.length,
                correct_answers: correctAnswers,
                time_taken: timeTaken
            }

            setQuizResult(result)
            setIsQuizComplete(true)

            // Sauvegarder le résultat si l'utilisateur est connecté
            if (session?.user) {
                try {
                    const { error } = await supabase
                        .from('quiz_results')
                        .insert({
                            user_id: session.user.id,
                            quiz_id: questions[0].quiz_id,
                            score,
                            completed_at: new Date().toISOString()
                        })

                    if (error) throw error
                } catch (error) {
                    console.error('Error saving quiz result:', error)
                }
            }
        }
    }

    const restartQuiz = () => {
        setCurrentQuestion(0)
        setSelectedAnswer(null)
        setScore(0)
        setTimeLeft(30)
        setIsQuizComplete(false)
        setQuizResult(null)
        setStartTime(Date.now())
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    if (isQuizComplete && quizResult) {
        return (
            <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-6">Quiz Terminé !</h2>
                <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <span className="font-medium">Score total :</span>
                        <span className="text-xl font-bold text-blue-600">{quizResult.score} points</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <span className="font-medium">Réponses correctes :</span>
                        <span className="text-xl font-bold text-green-600">
                            {quizResult.correct_answers} / {quizResult.total_questions}
                        </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <span className="font-medium">Temps total :</span>
                        <span className="text-xl font-bold text-purple-600">
                            {quizResult.time_taken} secondes
                        </span>
                    </div>
                </div>
                <button
                    onClick={restartQuiz}
                    className="w-full mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Recommencer le quiz
                </button>
            </div>
        )
    }

    if (questions.length === 0) {
        return (
            <div className="text-center p-6">
                <p className="text-gray-600">Aucune question disponible pour le moment.</p>
            </div>
        )
    }

    const question = questions[currentQuestion]

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <div className="text-sm text-gray-600">
                    Question {currentQuestion + 1} sur {questions.length}
                </div>
                <div className="text-sm font-medium">
                    Temps restant : <span className={timeLeft <= 10 ? 'text-red-600' : 'text-blue-600'}>{timeLeft}s</span>
                </div>
            </div>

            <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">{question.question}</h3>
                <div className="space-y-3">
                    {question.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswerSelect(option)}
                            className={`w-full p-4 text-left rounded-lg transition-colors ${selectedAnswer === option
                                ? 'bg-blue-100 border-2 border-blue-500'
                                : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                                }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex justify-between items-center">
                <div className="text-lg font-medium">
                    Score : <span className="text-blue-600">{score}</span>
                </div>
                <button
                    onClick={handleNextQuestion}
                    disabled={!selectedAnswer}
                    className={`px-6 py-2 rounded-lg transition-colors ${selectedAnswer
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    {currentQuestion < questions.length - 1 ? 'Question suivante' : 'Terminer'}
                </button>
            </div>
        </div>
    )
} 