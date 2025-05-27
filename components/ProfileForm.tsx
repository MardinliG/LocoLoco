'use client'

import { useState } from 'react'
import { useSupabase } from '@/lib/supabase-provider'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

type Profile = {
    id: string
    username: string
    created_at: string
    is_admin: boolean
}

export default function ProfileForm({ profile }: { profile: Profile | null }) {
    const { session } = useSupabase()
    const [username, setUsername] = useState(profile?.username || '')
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // Vérifier si le nom d'utilisateur est déjà pris
            const { data: existingUser } = await supabase
                .from('profiles')
                .select('id')
                .eq('username', username)
                .neq('id', session?.user.id)
                .single()

            if (existingUser) {
                toast.error('Ce nom d\'utilisateur est déjà pris')
                return
            }

            const { error } = await supabase
                .from('profiles')
                .update({ username })
                .eq('id', session?.user.id)

            if (error) throw error

            toast.success('Profil mis à jour avec succès')
            setIsEditing(false)
        } catch (error) {
            console.error('Error updating profile:', error)
            toast.error('Erreur lors de la mise à jour du profil')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-lg text-gray-900">{session?.user.email}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                        Nom d'utilisateur
                    </label>
                    {isEditing ? (
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                            minLength={3}
                            maxLength={20}
                        />
                    ) : (
                        <p className="mt-1 text-lg text-gray-900">{username}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Membre depuis</label>
                    <p className="mt-1 text-lg text-gray-900">
                        {new Date(profile?.created_at || '').toLocaleDateString()}
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Statut</label>
                    <p className="mt-1 text-lg text-gray-900">
                        {profile?.is_admin ? 'Administrateur' : 'Utilisateur'}
                    </p>
                </div>

                {isEditing ? (
                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {isLoading ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setIsEditing(false)
                                setUsername(profile?.username || '')
                            }}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Annuler
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Modifier le profil
                    </button>
                )}
            </form>
        </div>
    )
} 