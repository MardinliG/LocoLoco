'use client'

import { useState, useEffect } from 'react'
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
    image_url?: string
}

interface CocktailFormProps {
    cocktail?: Cocktail
    mode: 'create' | 'edit'
}

export default function CocktailForm({ cocktail, mode }: CocktailFormProps) {
    const router = useRouter()
    const [countries, setCountries] = useState<Country[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState<Partial<Cocktail>>({
        name: '',
        description: '',
        ingredients: [''],
        instructions: '',
        country_id: '',
        image_url: ''
    })

    useEffect(() => {
        if (cocktail) {
            setFormData(cocktail)
        }
        fetchCountries()
    }, [cocktail])

    const fetchCountries = async () => {
        const { data } = await supabase
            .from('countries')
            .select('*')
            .order('name')
        if (data) setCountries(data)
    }

    const handleIngredientChange = (index: number, value: string) => {
        const newIngredients = [...formData.ingredients!]
        newIngredients[index] = value
        setFormData({ ...formData, ingredients: newIngredients })
    }

    const addIngredient = () => {
        setFormData({
            ...formData,
            ingredients: [...formData.ingredients!, '']
        })
    }

    const removeIngredient = (index: number) => {
        const newIngredients = formData.ingredients!.filter((_, i) => i !== index)
        setFormData({ ...formData, ingredients: newIngredients })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                toast.error('Vous devez être connecté pour créer un cocktail')
                return
            }

            const cocktailData = {
                ...formData,
                user_id: session.user.id
            }

            if (mode === 'create') {
                const { error } = await supabase
                    .from('cocktails')
                    .insert([cocktailData])

                if (error) throw error
                toast.success('Cocktail créé avec succès')
            } else {
                const { error } = await supabase
                    .from('cocktails')
                    .update(cocktailData)
                    .eq('id', cocktail!.id)

                if (error) throw error
                toast.success('Cocktail mis à jour avec succès')
            }

            router.push('/cocktails')
            router.refresh()
        } catch (error) {
            console.error('Error saving cocktail:', error)
            toast.error('Erreur lors de la sauvegarde du cocktail')
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
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
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
                    value={formData.country_id}
                    onChange={(e) => setFormData({ ...formData, country_id: e.target.value })}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                    <option value="">Sélectionner un pays</option>
                    {countries.map((country) => (
                        <option key={country.id} value={country.id}>
                            {country.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ingrédients
                </label>
                {formData.ingredients?.map((ingredient, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={ingredient}
                            onChange={(e) => handleIngredientChange(index, e.target.value)}
                            required
                            placeholder="Ingrédient"
                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {index > 0 && (
                            <button
                                type="button"
                                onClick={() => removeIngredient(index)}
                                className="text-red-600 hover:text-red-800"
                            >
                                Supprimer
                            </button>
                        )}
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addIngredient}
                    className="mt-2 text-blue-600 hover:text-blue-800"
                >
                    + Ajouter un ingrédient
                </button>
            </div>

            <div>
                <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
                    Instructions
                </label>
                <textarea
                    id="instructions"
                    value={formData.instructions}
                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                    required
                    rows={5}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
            </div>

            <div>
                <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">
                    URL de l'image (optionnel)
                </label>
                <input
                    type="url"
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
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
                        'Créer le cocktail'
                    ) : (
                        'Mettre à jour le cocktail'
                    )}
                </button>
            </div>
        </form>
    )
} 