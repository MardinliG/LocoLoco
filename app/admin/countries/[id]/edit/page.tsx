import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import CountryForm from '@/components/CountryForm'

export default async function EditCountryPage({ params }: { params: { id: string } }) {
    const supabase = createServerComponentClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        redirect('/login')
    }

    // Vérifier si l'utilisateur est admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .single()

    if (!profile?.is_admin) {
        redirect('/')
    }

    // Récupérer le pays
    const { data: country } = await supabase
        .from('countries')
        .select('*')
        .eq('id', params.id)
        .single()

    if (!country) {
        redirect('/admin/countries')
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8">Modifier le pays</h1>
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <CountryForm country={country} mode="edit" />
                </div>
            </div>
        </div>
    )
} 