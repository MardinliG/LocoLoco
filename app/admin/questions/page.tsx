import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import QuestionManager from '@/components/QuestionManager'

export default async function QuestionsPage() {
    const supabase = createServerComponentClient({ cookies })

    // Vérifier si l'utilisateur est connecté et est admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        redirect('/')
    }

    // Récupérer toutes les questions
    const { data: questions, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching questions:', error)
        throw error
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Gestion des Questions du Quiz</h1>
            <QuestionManager initialQuestions={questions || []} />
        </div>
    )
} 