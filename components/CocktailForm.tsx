'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { FiPlus, FiTrash2 } from 'react-icons/fi'

type Country = {
    id: string
    name: string
    code: string
}

type CocktailFormProps = {
    mode?: 'create' | 'edit';
    initialData?: {
        id: string;
        name: string;
        description: string | null;
        ingredients: string[] | null;
        instructions: string | null;
        image_url: string | null;
        country_id: string | null;
    };
    countries: Country[];
}

export default function CocktailForm({ mode = 'create', initialData, countries: initialCountries }: CocktailFormProps) {
    const [name, setName] = useState(initialData?.name || '')
    const [description, setDescription] = useState(initialData?.description || '')
    const [ingredients, setIngredients] = useState<string[]>(initialData?.ingredients || [])
    const [instructions, setInstructions] = useState(initialData?.instructions || '')
    const [imageUrl, setImageUrl] = useState(initialData?.image_url || '')
    const [countryId, setCountryId] = useState(initialData?.country_id || '')
    const [countries, setCountries] = useState<Country[]>(initialCountries)
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [newIngredient, setNewIngredient] = useState('')
    const supabase = createClientComponentClient()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push('/login')
                return
            }

            const cocktailData = {
                name,
                description: description || null,
                ingredients: ingredients.length > 0 ? ingredients : null,
                instructions: instructions || null,
                image_url: imageUrl || null,
                country_id: countryId || null,
                user_id: user.id
            }

            if (initialData) {
                // Mise à jour
                const { error: updateError } = await supabase
                    .from('cocktails')
                    .update(cocktailData)
                    .eq('id', initialData.id)

                if (updateError) throw updateError
            } else {
                // Création
                const { error: insertError } = await supabase
                    .from('cocktails')
                    .insert(cocktailData)

                if (insertError) throw insertError
            }

            router.push('/cocktails')
            router.refresh()
        } catch (error) {
            console.error('Error submitting cocktail:', error)
            setError('Erreur lors de l\'enregistrement du cocktail')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleAddIngredient = () => {
        if (newIngredient.trim()) {
            setIngredients([...ingredients, newIngredient.trim()])
            setNewIngredient('')
        }
    }

    const handleRemoveIngredient = (index: number) => {
        setIngredients(ingredients.filter((_, i) => i !== index))
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-gray-600">Chargement...</div>
            </div>
        )
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
                    rows={3}
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
                <label className="block text-sm font-medium text-gray-700">
                    Ingrédients
                </label>
                <div className="mt-1 flex space-x-2">
                    <input
                        type="text"
                        value={newIngredient}
                        onChange={(e) => setNewIngredient(e.target.value)}
                        placeholder="Ajouter un ingrédient"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <button
                        type="button"
                        onClick={handleAddIngredient}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Ajouter
                    </button>
                </div>
                <ul className="mt-2 space-y-2">
                    {ingredients.map((ingredient, index) => (
                        <li key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                            <span>{ingredient}</span>
                            <button
                                type="button"
                                onClick={() => handleRemoveIngredient(index)}
                                className="text-red-600 hover:text-red-800"
                            >
                                Supprimer
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
                    Instructions
                </label>
                <textarea
                    id="instructions"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    rows={5}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
            </div>

            <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                    URL de l'image
                </label>
                <input
                    type="url"
                    id="imageUrl"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
            </div>

            {error && (
                <div className="text-sm text-red-600">
                    {error}
                </div>
            )}

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {isSubmitting
                        ? 'Enregistrement...'
                        : initialData
                            ? 'Mettre à jour le cocktail'
                            : 'Créer le cocktail'}
                </button>
            </div>
        </form>
    )
} 