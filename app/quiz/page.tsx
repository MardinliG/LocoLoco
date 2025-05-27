import Quiz from '@/components/Quiz'

export default function QuizPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Quiz des Cocktails</h1>
            <p className="text-center text-gray-600 mb-8">
                Testez vos connaissances sur les cocktails du monde entier !
                Vous avez 30 secondes pour répondre à chaque question.
            </p>
            <Quiz />
        </div>
    )
} 