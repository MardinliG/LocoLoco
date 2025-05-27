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

type Cocktail = {
    id: string
    name: string
    description: string
    ingredients: string[]
    instructions: string
    country_id: string
    created_at: string
    countries: Country
    profiles: {
        username: string
    }
}

interface AdminCocktailsListProps {
    cocktails: Cocktail[]
}

export default function AdminCocktailsList({ cocktails: initialCocktails }: AdminCocktailsListProps) {
    const router = useRouter()
    const [cocktails, setCocktails] = useState(initialCocktails)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCountry, setSelectedCountry] = useState<string>('')
    const [isDeleting, setIsDeleting] = useState<string | null>(null)

    // Extraire la liste unique des pays
    const countries = Array.from(
        new Set(initialCocktails.map((cocktail) => cocktail.countries))
    ).sort((a, b) => a.name.localeCompare(b.name))

    const deleteCocktail = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce cocktail ?')) return

        setIsDeleting(id)
        try {
            const { error } = await supabase
                .from('cocktails')
                .delete()
                .eq('id', id)

            if (error) throw error

            setCocktails(cocktails.filter((cocktail) => cocktail.id !== id))
            toast.success('Cocktail supprimé avec succès')
        } catch (error) {
            console.error('Error deleting cocktail:', error)
            toast.error('Erreur lors de la suppression du cocktail')
        } finally {
            setIsDeleting(null)
        }
    }

    const filteredCocktails = cocktails.filter((cocktail) => {
        const matchesSearch =
            cocktail.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cocktail.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCountry = !selectedCountry || cocktail.country_id === selectedCountry
        return matchesSearch && matchesCountry
    })

    return (
        <div className="space-y-6">
            {/* Filtres */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                            Rechercher
                        </label>
                        <input
                            type="text"
                            id="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Rechercher un cocktail..."
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                            Filtrer par pays
                        </label>
                        <select
                            id="country"
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="">Tous les pays</option>
                            {countries.map((country) => (
                                <option key={country.id} value={country.id}>
                                    {country.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Liste des cocktails */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nom
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Pays
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Créé par
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredCocktails.map((cocktail) => (
                                <tr key={cocktail.id}>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {cocktail.name}
                                        </div>
                                        <div className="text-sm text-gray-500 line-clamp-1">
                                            {cocktail.description}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {cocktail.countries.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {cocktail.profiles?.username || 'Utilisateur inconnu'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">
                                            {new Date(cocktail.created_at).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => router.push(`/admin/cocktails/${cocktail.id}`)}
                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                        >
                                            Éditer
                                        </button>
                                        <button
                                            onClick={() => deleteCocktail(cocktail.id)}
                                            disabled={isDeleting === cocktail.id}
                                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                        >
                                            {isDeleting === cocktail.id ? (
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