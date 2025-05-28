"use client"

import { useState, useEffect } from "react"
import { useSupabase } from "@/lib/supabase-provider"
import { supabase } from "@/lib/supabase"
import { toast } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, Trophy, Target, RotateCcw, CheckCircle, XCircle, Timer } from "lucide-react"

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
  const [showScore, setShowScore] = useState(false)
  const [timerActive, setTimerActive] = useState(true)
  const [showAnswer, setShowAnswer] = useState(false)

  useEffect(() => {
    fetchQuestions()
  }, [])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (timeLeft > 0 && !isQuizComplete && timerActive && !showAnswer) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
    } else if (timeLeft === 0 && !isQuizComplete) {
      handleNextQuestion()
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [timeLeft, isQuizComplete, timerActive, showAnswer])

  const fetchQuestions = async () => {
    try {
      setIsLoading(true)
      const { data: questions, error } = await supabase.from("quiz_questions").select("*")

      if (error) throw error

      // Sélectionner 5 questions aléatoires
      const shuffled = questions.sort(() => 0.5 - Math.random())
      const selectedQuestions = shuffled.slice(0, 5)

      setQuestions(selectedQuestions)
      setCurrentQuestion(0)
      setScore(0)
      setShowScore(false)
      setTimeLeft(30)
      setTimerActive(true)
      setStartTime(Date.now())
      setIsLoading(false)
      setShowAnswer(false)
    } catch (error) {
      console.error("Error fetching questions:", error)
      toast.error("Erreur lors du chargement des questions")
      setIsLoading(false)
    }
  }

  const handleAnswerSelect = (answer: string) => {
    if (showAnswer) return
    setSelectedAnswer(answer)
    setShowAnswer(true)
    setTimerActive(false)

    // Vérifier si la réponse est correcte
    if (answer === questions[currentQuestion].correct_answer) {
      setScore(score + questions[currentQuestion].points)
      toast.success("🎉 Bonne réponse !")
    } else {
      toast.error("❌ Mauvaise réponse...")
    }

    // Passer à la question suivante après 2 secondes
    setTimeout(() => {
      handleNextQuestion()
    }, 2000)
  }

  const handleNextQuestion = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowAnswer(false)
      setTimeLeft(30)
      setTimerActive(true)
    } else {
      const endTime = Date.now()
      const timeTaken = startTime ? Math.floor((endTime - startTime) / 1000) : 0
      const correctAnswers = score / (questions.reduce((sum, q) => sum + q.points, 0) / questions.length)

      const result: QuizResult = {
        score,
        total_questions: questions.length,
        correct_answers: Math.round(correctAnswers),
        time_taken: timeTaken,
      }

      setQuizResult(result)
      setIsQuizComplete(true)
      setTimerActive(false)

      // Sauvegarder le résultat si l'utilisateur est connecté
      if (session?.user) {
        try {
          const now = new Date().toISOString()
          const quizResultData = {
            user_id: session.user.id,
            quiz_name: "Quiz Cocktails Général",
            score,
            max_score: questions.reduce((sum, q) => sum + q.points, 0),
            created_at: now,
          }

          const { error } = await supabase.from("quiz_results").insert(quizResultData)

          if (error) throw error
          toast.success("🎉 Résultat sauvegardé avec succès !")
        } catch (error: any) {
          console.error("Error saving quiz result:", error)
          toast.error(`Erreur lors de la sauvegarde: ${error?.message || "Erreur inconnue"}`)
        }
      }
    }
  }

  const restartQuiz = () => {
    setIsQuizComplete(false)
    setQuizResult(null)
    setShowAnswer(false)
    fetchQuestions()
  }

  const getTimerColor = () => {
    if (timeLeft > 20) return "text-green-600"
    if (timeLeft > 10) return "text-yellow-600"
    return "text-red-600"
  }

  const getProgressPercentage = () => {
    return ((currentQuestion + 1) / questions.length) * 100
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="p-8 text-center bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Chargement des questions...</p>
          <p className="text-sm text-gray-500 mt-2">🍹 Préparation de votre quiz cocktails</p>
        </Card>
      </div>
    )
  }

  if (isQuizComplete && quizResult) {
    const percentage = Math.round((quizResult.score / questions.reduce((sum, q) => sum + q.points, 0)) * 100)
    const getResultEmoji = () => {
      if (percentage >= 90) return "🏆"
      if (percentage >= 75) return "🥇"
      if (percentage >= 60) return "🥈"
      if (percentage >= 40) return "🥉"
      return "💪"
    }

    const getResultMessage = () => {
      if (percentage >= 90) return "Incroyable ! Vous êtes un vrai expert !"
      if (percentage >= 75) return "Excellent ! Vous maîtrisez bien les cocktails !"
      if (percentage >= 60) return "Bien joué ! Vous avez de bonnes connaissances !"
      if (percentage >= 40) return "Pas mal ! Continuez à apprendre !"
      return "Ne vous découragez pas ! La pratique fait le maître !"
    }

    return (
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white text-center py-8">
            <div className="text-6xl mb-4">{getResultEmoji()}</div>
            <CardTitle className="text-3xl font-bold mb-2">Quiz Terminé !</CardTitle>
            <p className="text-lg opacity-90">{getResultMessage()}</p>
          </CardHeader>

          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Score principal */}
              <div className="text-center">
                <div className="text-5xl font-bold text-orange-600 mb-2">{percentage}%</div>
                <p className="text-gray-600">Score de réussite</p>
              </div>

              {/* Statistiques détaillées */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 text-center border border-orange-200">
                  <Trophy className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-700">{quizResult.score}</div>
                  <p className="text-sm text-orange-600">Points obtenus</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center border border-green-200">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-700">
                    {quizResult.correct_answers}/{quizResult.total_questions}
                  </div>
                  <p className="text-sm text-green-600">Bonnes réponses</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center border border-blue-200">
                  <Timer className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-700">{quizResult.time_taken}s</div>
                  <p className="text-sm text-blue-600">Temps total</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={restartQuiz}
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:shadow-lg"
                >
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Nouveau Quiz
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="text-center p-8">
        <Card className="max-w-md mx-auto bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-8">
            <div className="text-4xl mb-4">😕</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune question disponible</h3>
            <p className="text-gray-600 mb-6">Les questions du quiz ne sont pas encore configurées.</p>
            <Button onClick={fetchQuestions} className="bg-gradient-to-r from-orange-500 to-red-500">
              <RotateCcw className="mr-2 h-4 w-4" />
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl overflow-hidden">
        {/* Header avec progression */}
        <CardHeader className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white">
          <div className="flex justify-between items-center mb-4">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              Question {currentQuestion + 1} / {questions.length}
            </Badge>
            <div className={`flex items-center gap-2 ${getTimerColor()}`}>
              <Clock className="h-5 w-5" />
              <span className="text-xl font-bold">{timeLeft}s</span>
            </div>
          </div>

          <Progress value={getProgressPercentage()} className="h-2 bg-white/20" />

          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              <span className="font-medium">Score: {score} pts</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              <span className="font-medium">{question.points} pts</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          {/* Question */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 leading-relaxed">{question.question}</h3>

            {/* Options de réponse */}
            <div className="space-y-4">
              {question.options.map((option, index) => {
                let buttonClass = "w-full p-4 text-left rounded-xl transition-all duration-300 border-2 "

                if (showAnswer) {
                  if (option === question.correct_answer) {
                    buttonClass += "bg-green-100 border-green-500 text-green-800"
                  } else if (option === selectedAnswer && option !== question.correct_answer) {
                    buttonClass += "bg-red-100 border-red-500 text-red-800"
                  } else {
                    buttonClass += "bg-gray-50 border-gray-200 text-gray-500"
                  }
                } else if (selectedAnswer === option) {
                  buttonClass += "bg-orange-100 border-orange-500 text-orange-800 shadow-lg"
                } else {
                  buttonClass += "bg-gray-50 hover:bg-orange-50 border-gray-200 hover:border-orange-300 text-gray-700"
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={showAnswer}
                    className={buttonClass}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option}</span>
                      {showAnswer && option === question.correct_answer && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                      {showAnswer && option === selectedAnswer && option !== question.correct_answer && (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Actions */}
          {!showAnswer && (
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {selectedAnswer ? "Réponse sélectionnée" : "Sélectionnez une réponse"}
              </div>
              <Button
                onClick={handleNextQuestion}
                disabled={!selectedAnswer}
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-red-500 disabled:opacity-50"
              >
                {currentQuestion < questions.length - 1 ? "Question suivante" : "Terminer le quiz"}
              </Button>
            </div>
          )}

          {showAnswer && (
            <div className="text-center">
              <p className="text-gray-600">
                {selectedAnswer === question.correct_answer
                  ? "🎉 Excellente réponse ! Passage à la question suivante..."
                  : "💪 Pas de souci ! Passage à la question suivante..."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
