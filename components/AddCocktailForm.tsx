'use client'

import { useState } from 'react'
import { useSupabase } from '@/lib/supabase-provider'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'
import toast from 'react-hot-toast'

type Country = Database['public']['Tables']['countries']['Row']

interface AddCocktailFormProps {
    countryId: string
    onSuccess: () => void
}

export default function AddCocktailForm({ countryId, onSuccess }: AddCocktailFormProps) {
    const { user } = useSupabase()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        ingredients: [''],
        instructions: '',
    })

    const handleIngredientChange = (index: number, value: string) => {
        const newIngredients = [...formData.ingredients]
        newIngredients[index] = value
        setFormData({ ...formData, ingredients: newIngredients })
    }

    const addIngredient = () => {
        setFormData({
            ...formData,
            ingredients: [...formData.ingredients, ''],
        })
    }

    const removeIngredient = (index: number) => {
        const newIngredients = formData.ingredients.filter((_, i) => i !== index)
        setFormData({ ...formData, ingredients: newIngredients })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        setIsLoading(true)
        try {
            const { error } = await supabase.from('cocktails').insert({
                name: formData.name,
                description: formData.description,
                ingredients: formData.ingredients.filter(Boolean),
                instructions: formData.instructions,
                country_id: countryId,
                created_by: user.id,
            })

            if (error) throw error

            toast.success('Cocktail ajouté avec succès !')
            setFormData({
                name: '',
                description: '',
                ingredients: [''],
                instructions: '',
            })
            onSuccess()
        } catch (error) {
            console.error('Error adding cocktail:', error)
            toast.error('Erreur lors de l\'ajout du cocktail')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nom du cocktail
                </label>
                <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field mt-1"
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                </label>
                <textarea
                    id="description"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field mt-1"
                    rows={3}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Ingrédients
                </label>
                <div className="space-y-2 mt-1">
                    {formData.ingredients.map((ingredient, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                required
                                value={ingredient}
                                onChange={(e) => handleIngredientChange(index, e.target.value)}
                                className="input-field flex-1"
                                placeholder={`Ingrédient ${index + 1}`}
                            />
                            {formData.ingredients.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeIngredient(index)}
                                    className="px-3 py-2 text-red-600 hover:text-red-800"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addIngredient}
                        className="text-sm text-primary-600 hover:text-primary-800"
                    >
                        + Ajouter un ingrédient
                    </button>
                </div>
            </div>

            <div>
                <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
                    Instructions
                </label>
                <textarea
                    id="instructions"
                    required
                    value={formData.instructions}
                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                    className="input-field mt-1"
                    rows={4}
                />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full"
            >
                {isLoading ? 'Ajout en cours...' : 'Ajouter le cocktail'}
            </button>
        </form>
    )
} 