import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import CocktailForm from '@/components/CocktailForm'

export default async function EditCocktailPage({ params }: { params: { id: string } }) {
    const supabase = createServerComponentClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        redirect('/login')
    }

    // Récupérer le cocktail
    const { data: cocktail } = await supabase
        .from('cocktails')
        .select('*')
        .eq('id', params.id)
        .single()

    if (!cocktail) {
        redirect('/cocktails')
    }

    // Vérifier si l'utilisateur est autorisé à modifier le cocktail
    if (cocktail.user_id !== session.user.id) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', session.user.id)
            .single()

        if (!profile?.is_admin) {
            redirect('/cocktails')
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8">Modifier le cocktail</h1>
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <CocktailForm cocktail={cocktail} mode="edit" />
                </div>
            </div>
        </div>
    )
} 