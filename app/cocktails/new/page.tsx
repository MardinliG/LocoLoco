import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import CocktailForm from '@/components/CocktailForm'

export default async function NewCocktailPage() {
    const supabase = createServerComponentClient({ cookies })

    // Vérifier si l'utilisateur est connecté
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
        redirect('/login')
    }

    // Vérifier si l'utilisateur est admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

    if (profile?.role !== 'admin') {
        redirect('/')
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Nouveau cocktail</h1>
            <CocktailForm />
        </div>
    )
} 