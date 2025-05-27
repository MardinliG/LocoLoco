'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { FiPlus, FiTrash2 } from 'react-icons/fi'

type Country = {
    id: string
    name: string
}

type CocktailFormProps = {
    mode: 'create' | 'edit'
    initialData?: {
        id: string
        name: string
        description: string
        ingredients: string[]
        instructions: string
        image_url: string
        country_id: string
    }
    countries: Country[]
}

export default function CocktailForm({ mode, initialData, countries }: CocktailFormProps) {
    const [name, setName] = useState(initialData?.name || '')
    const [description, setDescription] = useState(initialData?.description || '')
    const [ingredients, setIngredients] = useState<string[]>(initialData?.ingredients || [''])
    const [instructions, setInstructions] = useState(initialData?.instructions || '')
    const [imageUrl, setImageUrl] = useState(initialData?.image_url || '')
    const [countryId, setCountryId] = useState(initialData?.country_id || '')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const supabase = createClientComponentClient()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                throw new Error('Vous devez être connecté pour effectuer cette action')
            }

            const cocktailData = {
                name,
                description,
                ingredients: ingredients.filter(i => i.trim() !== ''),
                instructions,
                image_url: imageUrl,
                country_id: countryId,
                user_id: user.id
            }

            if (mode === 'edit' && initialData) {
                const { error: updateError } = await supabase
                    .from('cocktails')
                    .update(cocktailData)
                    .eq('id', initialData.id)

                if (updateError) throw updateError
            } else {
                const { error: insertError } = await supabase
                    .from('cocktails')
                    .insert(cocktailData)

                if (insertError) throw insertError
            }

            router.push('/cocktails')
            router.refresh()
        } catch (error) {
            console.error('Error submitting cocktail:', error)
            setError(error instanceof Error ? error.message : 'Une erreur est survenue')
        } finally {
            setIsSubmitting(false)
        }
    }

    const addIngredient = () => {
        setIngredients([...ingredients, ''])
    }

    const removeIngredient = (index: number) => {
        setIngredients(ingredients.filter((_, i) => i !== index))
    }

    const updateIngredient = (index: number, value: string) => {
        const newIngredients = [...ingredients]
        newIngredients[index] = value
        setIngredients(newIngredients)
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ingrédients
                </label>
                <div className="space-y-2">
                    {ingredients.map((ingredient, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={ingredient}
                                onChange={(e) => updateIngredient(index, e.target.value)}
                                required
                                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => removeIngredient(index)}
                                className="p-2 text-red-600 hover:text-red-800"
                            >
                                <FiTrash2 />
                            </button>
                        </div>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={addIngredient}
                    className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <FiPlus className="mr-2" />
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
                        : mode === 'edit'
                            ? 'Mettre à jour le cocktail'
                            : 'Créer le cocktail'}
                </button>
            </div>
        </form>
    )
} 