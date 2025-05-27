'use client'

import { useState } from 'react'
import { useSupabase } from '@/lib/supabase-provider'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { FiPlus, FiTrash2 } from 'react-icons/fi'

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
    image_url?: string
}

interface CocktailFormProps {
    mode?: 'create' | 'edit'
    initialData?: {
        id: string
        name: string
        description: string
        ingredients: string[]
        instructions: string
        country_id: string
    }
}

export default function CocktailForm({ mode = 'create', initialData }: CocktailFormProps) {
    const { supabase, user } = useSupabase()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState(initialData?.name || '')
    const [description, setDescription] = useState(initialData?.description || '')
    const [ingredients, setIngredients] = useState<string[]>(initialData?.ingredients || [''])
    const [instructions, setInstructions] = useState(initialData?.instructions || '')
    const [countryId, setCountryId] = useState(initialData?.country_id || '')
    const [imageUrl, setImageUrl] = useState(initialData?.image_url || '')
    const [countries, setCountries] = useState<Country[]>([])

    useState(() => {
        const loadCountries = async () => {
            const { data, error } = await supabase
                .from('countries')
                .select('*')
                .order('name')

            if (error) {
                toast.error('Erreur lors du chargement des pays')
                return
            }

            setCountries(data || [])
        }

        loadCountries()
    }, [supabase])

    const handleAddIngredient = () => {
        setIngredients([...ingredients, ''])
    }

    const handleRemoveIngredient = (index: number) => {
        setIngredients(ingredients.filter((_, i) => i !== index))
    }

    const handleIngredientChange = (index: number, value: string) => {
        const newIngredients = [...ingredients]
        newIngredients[index] = value
        setIngredients(newIngredients)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            if (!user) {
                toast.error('Vous devez être connecté pour créer un cocktail')
                return
            }

            const cocktailData = {
                name,
                description,
                ingredients: ingredients.filter(i => i.trim() !== ''),
                instructions,
                country_id: countryId,
                user_id: user.id,
                image_url: imageUrl
            }

            if (mode === 'create') {
                const { error } = await supabase
                    .from('cocktails')
                    .insert([cocktailData])

                if (error) throw error
                toast.success('Cocktail créé avec succès !')
                router.push('/cocktails')
            } else if (mode === 'edit' && initialData) {
                const { error } = await supabase
                    .from('cocktails')
                    .update(cocktailData)
                    .eq('id', initialData.id)

                if (error) throw error
                toast.success('Cocktail mis à jour avec succès !')
                router.push(`/cocktails/${initialData.id}`)
            }
        } catch (error: any) {
            toast.error(error.message || 'Une erreur est survenue')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nom du cocktail
                </label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                </label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ingrédients
                </label>
                {ingredients.map((ingredient, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={ingredient}
                            onChange={(e) => handleIngredientChange(index, e.target.value)}
                            required
                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder={`Ingrédient ${index + 1}`}
                        />
                        {ingredients.length > 1 && (
                            <button
                                type="button"
                                onClick={() => handleRemoveIngredient(index)}
                                className="p-2 text-red-600 hover:text-red-800"
                            >
                                <FiTrash2 className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                ))}
                <button
                    type="button"
                    onClick={handleAddIngredient}
                    className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <FiPlus className="-ml-0.5 mr-2 h-4 w-4" />
                    Ajouter un ingrédient
                </button>
            </div>

            <div>
                <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
                    Instructions
                </label>
                <textarea
                    id="instructions"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    required
                    rows={5}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
            </div>

            <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                    Pays d'origine
                </label>
                <select
                    id="country"
                    value={countryId}
                    onChange={(e) => setCountryId(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                    <option value="">Sélectionnez un pays</option>
                    {countries.map((country) => (
                        <option key={country.id} value={country.id}>
                            {country.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">
                    URL de l'image (optionnel)
                </label>
                <input
                    type="url"
                    id="image_url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="https://example.com/image.jpg"
                />
            </div>

            <div className="flex justify-end space-x-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {isLoading ? (
                        <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                            {mode === 'create' ? 'Création...' : 'Mise à jour...'}
                        </div>
                    ) : mode === 'create' ? (
                        'Créer le cocktail'
                    ) : (
                        'Mettre à jour'
                    )}
                </button>
            </div>
        </form>
    )
} 