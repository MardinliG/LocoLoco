import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AuthForm from '@/components/AuthForm'

export default async function LoginPage() {
    const supabase = createServerComponentClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (session) {
        redirect('/')
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-md mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8">Bienvenue</h1>
                <AuthForm />
            </div>
        </div>
    )
} 