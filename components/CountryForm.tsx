'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

type Country = {
    id: string
    name: string
    code: string
}

interface CountryFormProps {
    country?: Country
    mode: 'create' | 'edit'
}

export default function CountryForm({ country, mode }: CountryFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState<Partial<Country>>({
        name: country?.name || '',
        code: country?.code || ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                toast.error('Vous devez être connecté pour gérer les pays')
                return
            }

            // Vérifier si l'utilisateur est admin
            const { data: profile } = await supabase
                .from('profiles')
                .select('is_admin')
                .eq('id', session.user.id)
                .single()

            if (!profile?.is_admin) {
                toast.error('Vous devez être administrateur pour gérer les pays')
                return
            }

            if (mode === 'create') {
                const { error } = await supabase
                    .from('countries')
                    .insert([formData])

                if (error) throw error
                toast.success('Pays créé avec succès')
            } else {
                const { error } = await supabase
                    .from('countries')
                    .update(formData)
                    .eq('id', country!.id)

                if (error) throw error
                toast.success('Pays mis à jour avec succès')
            }

            router.push('/admin/countries')
            router.refresh()
        } catch (error) {
            console.error('Error saving country:', error)
            toast.error('Erreur lors de la sauvegarde du pays')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nom du pays
                </label>
                <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
            </div>

            <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                    Code du pays (2 lettres)
                </label>
                <input
                    type="text"
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    required
                    maxLength={2}
                    minLength={2}
                    pattern="[A-Za-z]{2}"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <p className="mt-1 text-sm text-gray-500">
                    Code ISO 3166-1 alpha-2 (ex: FR pour France)
                </p>
            </div>

            <div className="flex justify-end gap-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {isLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    ) : mode === 'create' ? (
                        'Créer le pays'
                    ) : (
                        'Mettre à jour le pays'
                    )}
                </button>
            </div>
        </form>
    )
} 