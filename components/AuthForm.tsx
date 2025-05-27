'use client'

import { useState } from 'react'
import { useSupabase } from '@/lib/supabase-provider'
import { toast } from 'react-hot-toast'
import { FiGithub, FiMail } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'

type AuthMode = 'signin' | 'signup'

export default function AuthForm() {
    const { supabase } = useSupabase()
    const [mode, setMode] = useState<AuthMode>('signin')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isOAuthLoading, setIsOAuthLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            if (mode === 'signin') {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
                toast.success('Connexion réussie !')
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback`
                    }
                })
                if (error) throw error
                toast.success('Inscription réussie ! Vérifiez votre email.')
            }
        } catch (error: any) {
            toast.error(error.message || 'Une erreur est survenue')
        } finally {
            setIsLoading(false)
        }
    }

    const handleOAuthSignIn = async (provider: 'google' | 'github') => {
        setIsOAuthLoading(true)
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                    queryParams: provider === 'google' ? {
                        access_type: 'offline',
                        prompt: 'consent',
                    } : undefined
                }
            })
            if (error) throw error
        } catch (error: any) {
            toast.error(error.message || 'Une erreur est survenue lors de la connexion')
            setIsOAuthLoading(false)
        }
    }

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-6">
                {mode === 'signin' ? 'Connexion' : 'Inscription'}
            </h2>

            <div className="space-y-4">
                <button
                    onClick={() => handleOAuthSignIn('google')}
                    disabled={isOAuthLoading}
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <FcGoogle className="h-5 w-5 mr-2" />
                    Continuer avec Google
                </button>

                <button
                    onClick={() => handleOAuthSignIn('github')}
                    disabled={isOAuthLoading}
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <FiGithub className="h-5 w-5 mr-2" />
                    Continuer avec GitHub
                </button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">ou</span>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="input-field"
                        placeholder="votre@email.com"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Mot de passe
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="input-field"
                        placeholder="••••••••"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full btn-primary ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                        </div>
                    ) : mode === 'signin' ? (
                        'Se connecter'
                    ) : (
                        "S'inscrire"
                    )}
                </button>
            </form>

            <div className="mt-4 text-center">
                <button
                    onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                    className="text-sm text-blue-600 hover:text-blue-800"
                >
                    {mode === 'signin'
                        ? "Pas encore de compte ? S'inscrire"
                        : 'Déjà un compte ? Se connecter'}
                </button>
            </div>
        </div>
    )
} 