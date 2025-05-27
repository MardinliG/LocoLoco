'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

type Country = {
    id: string
    name: string
    code: string
    cocktails_count: number
}

interface AdminCountriesListProps {
    countries: Country[]
}

export default function AdminCountriesList({ countries: initialCountries }: AdminCountriesListProps) {
    const router = useRouter()
    const [countries, setCountries] = useState(initialCountries)
    const [searchTerm, setSearchTerm] = useState('')
    const [isDeleting, setIsDeleting] = useState<string | null>(null)

    const deleteCountry = async (id: string) => {
        const country = countries.find(c => c.id === id)
        if (!country) return

        if (country.cocktails_count > 0) {
            toast.error('Impossible de supprimer un pays qui contient des cocktails')
            return
        }

        if (!confirm('Êtes-vous sûr de vouloir supprimer ce pays ?')) return

        setIsDeleting(id)
        try {
            const { error } = await supabase
                .from('countries')
                .delete()
                .eq('id', id)

            if (error) throw error

            setCountries(countries.filter((country) => country.id !== id))
            toast.success('Pays supprimé avec succès')
        } catch (error) {
            console.error('Error deleting country:', error)
            toast.error('Erreur lors de la suppression du pays')
        } finally {
            setIsDeleting(null)
        }
    }

    const filteredCountries = countries.filter((country) =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.code.toLowerCase().includes(searchTerm.toLowerCase())
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
                        placeholder="Rechercher un pays..."
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Liste des pays */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nom
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Code
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cocktails
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredCountries.map((country) => (
                                <tr key={country.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {country.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {country.code}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {country.cocktails_count}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => router.push(`/admin/countries/${country.id}`)}
                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                        >
                                            Éditer
                                        </button>
                                        <button
                                            onClick={() => deleteCountry(country.id)}
                                            disabled={isDeleting === country.id || country.cocktails_count > 0}
                                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                            title={country.cocktails_count > 0 ? 'Impossible de supprimer un pays qui contient des cocktails' : ''}
                                        >
                                            {isDeleting === country.id ? (
                                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-red-600"></div>
                                            ) : (
                                                'Supprimer'
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