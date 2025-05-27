'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

type User = {
    id: string
    username: string
    email: string
    is_admin: boolean
    created_at: string
    cocktails_count: number
    favorites_count: number
    quiz_results_count: number
}

interface AdminUsersListProps {
    users: User[]
}

export default function AdminUsersList({ users: initialUsers }: AdminUsersListProps) {
    const [users, setUsers] = useState(initialUsers)
    const [searchTerm, setSearchTerm] = useState('')
    const [isUpdating, setIsUpdating] = useState<string | null>(null)

    const toggleAdminStatus = async (userId: string) => {
        const user = users.find(u => u.id === userId)
        if (!user) return

        setIsUpdating(userId)
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ is_admin: !user.is_admin })
                .eq('id', userId)

            if (error) throw error

            setUsers(users.map(u =>
                u.id === userId ? { ...u, is_admin: !u.is_admin } : u
            ))
            toast.success(`Statut admin ${!user.is_admin ? 'activé' : 'désactivé'} avec succès`)
        } catch (error) {
            console.error('Error updating user:', error)
            toast.error('Erreur lors de la mise à jour du statut admin')
        } finally {
            setIsUpdating(null)
        }
    }

    const filteredUsers = users.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            {/* Filtres */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div>
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                        Rechercher
                    </label>
                    <input
                        type="text"
                        id="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Rechercher un utilisateur..."
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Liste des utilisateurs */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Utilisateur
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cocktails
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Favoris
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Quiz
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Statut
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map((user) => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {user.username}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Membre depuis {new Date(user.created_at).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {user.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {user.cocktails_count}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {user.favorites_count}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {user.quiz_results_count}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.is_admin
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {user.is_admin ? 'Admin' : 'Utilisateur'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => toggleAdminStatus(user.id)}
                                            disabled={isUpdating === user.id}
                                            className={`${user.is_admin
                                                    ? 'text-red-600 hover:text-red-900'
                                                    : 'text-green-600 hover:text-green-900'
                                                } disabled:opacity-50`}
                                        >
                                            {isUpdating === user.id ? (
                                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-current"></div>
                                            ) : user.is_admin ? (
                                                'Retirer admin'
                                            ) : (
                                                'Rendre admin'
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
} 