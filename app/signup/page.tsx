'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/lib/supabase-provider'
import { supabase } from '@/lib/supabase'

export default function SignupPage() {
    const router = useRouter()
    const { user } = useSupabase()
    const [username, setUsername] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            if (!user) {
                throw new Error('No user found')
            }

            // Check if username is already taken
            const { data: existingUser } = await supabase
                .from('users')
                .select('username')
                .eq('username', username)
                .single()

            if (existingUser) {
                setError('Ce pseudo est déjà pris')
                return
            }

            // Create user profile
            const { error: profileError } = await supabase
                .from('users')
                .insert({
                    id: user.id,
                    email: user.email,
                    username,
                    role: 'user',
                })

            if (profileError) throw profileError

            // Redirect to home page
            router.push('/')
        } catch (err) {
            console.error('Error creating profile:', err)
            setError('Une erreur est survenue')
        } finally {
            setIsLoading(false)
        }
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Accès non autorisé
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Veuillez vous connecter pour continuer
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Choisissez votre pseudo
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Ce pseudo sera visible par tous les utilisateurs
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username" className="sr-only">
                            Pseudo
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="input-field"
                            placeholder="Votre pseudo"
                        />
                    </div>

                    {error && (
                        <div className="text-red-600 text-sm text-center">{error}</div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full"
                        >
                            {isLoading ? 'Chargement...' : 'Continuer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
} 