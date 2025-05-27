import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FiSettings } from 'react-icons/fi'
import Quiz from '@/components/Quiz'

export default async function QuizPage() {
    const supabase = createServerComponentClient({ cookies })

    // Vérifier si l'utilisateur est connecté
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    // Vérifier si l'utilisateur est admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    const isAdmin = profile?.role === 'admin'

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-center">Quiz des Cocktails</h1>
                {isAdmin && (
                    <Link
                        href="/admin/questions"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <FiSettings className="mr-2" />
                        Gérer les questions
                    </Link>
                )}
            </div>
            <p className="text-center text-gray-600 mb-8">
                Testez vos connaissances sur les cocktails du monde entier !
                Vous avez 30 secondes pour répondre à 5 questions aléatoires.
            </p>
            <Quiz />
        </div>
    )
} 