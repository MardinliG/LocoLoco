import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import CocktailForm from '@/components/CocktailForm'

export default async function NewCocktailPage() {
    const supabase = createServerComponentClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        redirect('/login')
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8">Créer un nouveau cocktail</h1>
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <CocktailForm mode="create" />
                </div>
            </div>
        </div>
    )
} 